package com.audit.modules.workflow.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Vector;

import javax.xml.parsers.DocumentBuilder;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrBuilder;
import org.apache.soap.Body;
import org.apache.soap.Envelope;
import org.apache.soap.SOAPException;
import org.apache.soap.messaging.Message;
import org.apache.soap.transport.SOAPTransport;
import org.apache.soap.util.xml.XMLParserUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.utils.Log;

/**
 * OA接口
 * 
 * @author luoyun
 */
public class OAServiceImpl {

	/** soapAction */
	private static final String SOAP_ACTION = "http://tempuri.org/XMLDataImport";
	
	/** dayCodeAction */
	private static final String CODE_SOAP_ACTION = "http://eipsps.scmcc.com.cn/GetDayCodeKey";
	
	// regAppCode值
	private String regAppCode; 

	// OA服务接口
	private String serviceUrl;
	
	// dayCode服务接口
	private String dayServiceUrl;
	
	// 稽核服务器IP地址
	private String auditUrl;
	
	// 是否开启功能
	private boolean breaker = false;

	/**
	 * 构造方法
	 * 
	 * @param serviceUrl OA服务接口
	 * @param dayServiceUrl dayCode服务接口
	 * @param auditIp 稽核服务器IP地址
	 * @param regAppCode regAppCode值
	 */
	public OAServiceImpl(String serviceUrl, String dayServiceUrl, String auditUrl, String regAppCode) {
		this.serviceUrl = serviceUrl;
		this.regAppCode = regAppCode;
		this.auditUrl = auditUrl;
		this.dayServiceUrl = dayServiceUrl;
	}
	
	/**
	 * 构造方法
	 * 
	 * @param serviceUrl OA服务接口
	 * @param dayServiceUrl dayCode服务接口
	 * @param auditIp 稽核服务器IP地址
	 * @param regAppCode regAppCode值
	 * @param breaker 是否执行功能
	 */
	public OAServiceImpl(String serviceUrl, String dayServiceUrl, String auditUrl, String regAppCode, boolean breaker) {
		this(serviceUrl, dayServiceUrl, auditUrl, regAppCode);
		this.breaker = breaker;
	}
	
	/**
	 * 处理OA
	 * 
	 * @param sender 发送者账户名
	 * @param receiver 接收者账户名
	 * @param serialNumber 稽核单号
	 * @param tip 提示 （待审批、被驳回等描述）
	 */
	public void handle(String sender, String receiver, String serialNumber, String tip) {
		// 判断是否执行功能  
		if (!this.breaker) {
			Log.info("The switch is not open");
			return;
		}
		
		try {
			String dayCodeKey = requestDayCodeKey();
			String day = getCurDay();
			StringBuilder preKey = new StringBuilder(this.regAppCode).append("|").append(dayCodeKey).append("|")
					.append(day).append(sender);
			String preStr = SHA1(preKey.toString().toLowerCase()).toLowerCase();
			StringBuilder sufKey = new StringBuilder(sender).append("|").append(this.regAppCode);
			String sufStr = encodeData(sufKey.toString().toLowerCase());
			String ssokey = preStr + ";" + sufStr;

			String questXml = handleRequestXml(sender, receiver, serialNumber, tip);
			StrBuilder sb = new StrBuilder();
			sb.append("<XMLDataImport xmlns=\"http://tempuri.org/\">");
			sb.append("<RegSSOKey>");
			sb.append(ssokey);
			sb.append("</RegSSOKey>");

			sb.append("<XMLData><![CDATA[");
			sb.append(questXml);
			sb.append("]]></XMLData>");

			sb.append("</XMLDataImport>");
			String responseXml = handleRequest(sb.toString(), serviceUrl, SOAP_ACTION);
			parseReuslt(responseXml);
		} catch (CommonException e) {
			Log.info(e.getMessage());
		}
	}
	
	/**
	 * 处理请求
	 * 
	 * @param requestXml 请求XML内容
	 * @return 返回响应XML
	 */
	private String handleRequest(String requestXml, String url, String action) {
		DocumentBuilder xdb = XMLParserUtils.getXMLDocBuilder();
		try {
			Document doc = xdb.parse(new InputSource(new StringReader(requestXml)));
			Vector<Element> bodyElements = new Vector<>();
			bodyElements.add(doc.getDocumentElement());
			Envelope envelope = new Envelope();
			Body body = new Body();
			body.setBodyEntries(bodyElements);
			envelope.setBody(body);

			Message msg = new Message();
			msg.send(new URL(url), action, envelope);

			SOAPTransport st = msg.getSOAPTransport();
			BufferedReader br = st.receive();
			// 结果XML文件
			StringBuilder resultXml = new StringBuilder();
			boolean end = false;
			while (!end) {
				String curLine = br.readLine();
				if (curLine == null) {
					end = true;
				} else {
					resultXml.append(curLine);
				}
			}
			Log.info("resultXml:" + resultXml);
			return resultXml.toString();
		} catch (SAXException e) {
			Log.error("XML解析失败!" + e);
			throw new CommonException("XML解析失败!");
		} catch (IOException e) {
			Log.error("XML解析失败!" + e);
			throw new CommonException("XML解析失败!");
		} catch (SOAPException e) {
			Log.error("请求失败!" + e);
			throw new CommonException("请求失败!");
		} catch (CommonException e) {
			throw e;
		} catch (Exception e) {
			Log.error("未知错误!" + e);
			throw new CommonException("未知错误!");
		}
	}
	
	/**
	 * 构建请求XML内容
	 * 
	 * @param sender 发送者账户名
	 * @param receiver 接收者账户名
	 * @param serialNumber 稽核单号
	 * @param tip 提示 （待审批、被驳回等描述）
	 */
	private String handleRequestXml(String sender, String receiver, String serialNumber, String tip) {
		StringBuilder sb = new StringBuilder();

		sb.append("<?xml version=\"1.0\" encoding=\"gb2312\"?>");
		sb.append("<App RegAppCode='" + this.regAppCode + "'>");
		sb.append("<DataList>");
		sb.append("<Data Operation=\"0\">");

		// 应用数据ID
		sb.append("<DataID>");
		sb.append(serialNumber);
		sb.append("</DataID>");
		// 应用名
		sb.append("<DataAlias>稽核单");
		sb.append(serialNumber);
		sb.append(tip);
		sb.append("</DataAlias>");
		// 应用数据Title
		sb.append("<DataTitle>稽核单");
		sb.append(serialNumber);
		sb.append(tip);
		sb.append("</DataTitle>");
		// 应用数据open URL
		sb.append("<DataOpenUrl>");
		sb.append(dataOpenUrl(receiver));
		sb.append("</DataOpenUrl>");
		// 应用数据开始时间
		sb.append("<BeginDateTime>");
		sb.append(getCurDate());
		sb.append("</BeginDateTime>");
		// 应用数据结束时间
		sb.append("<EndDateTime>2999-01-01 00:00:00</EndDateTime>");
		// 数据状态 0待办、1已办、2过期、3系统结束
		sb.append("<Status>0</Status>");
		// 数据是否已读 0:未读 1：已读
		sb.append("<IsReaded>0</IsReaded>");
		// 数据发送者OID.
		sb.append("<SenderOID>");
		sb.append(sender);
		sb.append("</SenderOID>");
		// 数据发送者Name
		sb.append("<SenderName>");
		sb.append(sender);
		sb.append("</SenderName>");
		// 数据类型 0待办 1待阅 默认0
		sb.append("<DataType>0</DataType>");

		// 数据接收者
		sb.append("<Receivers>");
		// 数据接收者OID EIP
		sb.append("<Receiver>");
		sb.append(receiver);
		sb.append("</Receiver>");
		sb.append("</Receivers>");

		sb.append("</Data>");
		sb.append("</DataList>");
		sb.append("</App>");

		return sb.toString();
	}
	
	/**
	 * 当前日期格式化
	 * 
	 * @return 日期
	 */
	private String getCurDate() {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return format.format(new Date());
	}
	
	/**
	 * 当前日期
	 * 
	 * @return 日期
	 */
	private String getCurDay() {
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHH");
		return format.format(new Date());
	}
	
	/**
	 * 解析运行结果
	 * 
	 * @param responseXml 结果XML
	 */
	private void parseReuslt(String responseXml) {
		DocumentBuilder xdb = XMLParserUtils.getXMLDocBuilder();
		Document resXml = null;
		try {
			resXml = xdb.parse(new InputSource(new StringReader(responseXml.toString())));
		} catch (SAXException e) {
			Log.error("XML解析失败!" + e);
			throw new CommonException("XML解析失败!");
		} catch (IOException e) {
			Log.error("XML解析失败!" + e);
			throw new CommonException("XML解析失败!");
		}
		Node msgNode = resXml.getElementsByTagName("XMLDataImportResult").item(0);
		if (msgNode == null || msgNode.getFirstChild() == null
				|| StringUtils.isEmpty(msgNode.getFirstChild().getNodeValue())) {
			Log.info("请求失败!");
			throw new CommonException("请求失败!");
		} else if ("100".equals(msgNode.getFirstChild().getNodeValue())) {
			Log.info("应用认证失败。");
			throw new CommonException("应用认证失败。");
		} else if ("00".equals(msgNode.getFirstChild().getNodeValue())) {
			Log.info("错误。");
			throw new CommonException("错误。");
		} else if ("101".equals(msgNode.getFirstChild().getNodeValue())) {
			Log.info("接收人不能为空，找不到注册系统提供的接收人OID对应的EIP用户。");
			throw new CommonException("接收人不能为空，找不到注册系统提供的接收人OID对应的EIP用户。");
		}
	}
	
	/**
	 * 应用地址
	 * 
	 * @param receiver 接收者
	 * @return 应用地址
	 */
	private String dataOpenUrl(String receiver) {
		return this.auditUrl + "?loginAccountParam=" + receiver;
	}
	
	/**
	 * 加密
	 * 
	 * @param decript 待加密
	 * @return 加密串
	 */
	private String SHA1(String decript) {
		try {
			MessageDigest digest = java.security.MessageDigest.getInstance("SHA-1");
			digest.update(decript.getBytes());
			byte messageDigest[] = digest.digest();
			// Create Hex String
			StringBuffer hexString = new StringBuffer();
			// 字节数组转换为 十六进制 数
			for (int i = 0; i < messageDigest.length; i++) {
				String shaHex = Integer.toHexString(messageDigest[i] & 0xFF);
				if (shaHex.length() < 2) {
					hexString.append(0);
				}
				hexString.append(shaHex);
			}
			return hexString.toString();

		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	/**
	 * Base64加密
	 * 
	 * @param inputData 待加密
	 * @return 加密串
	 */
	private String encodeData(String inputData) {
		try {
			return new String(Base64.encodeBase64(inputData.getBytes("utf-8")), "utf-8");
		} catch (UnsupportedEncodingException e) {
			Log.error("Base64加密失败！", e);
		}
		return null;
	}
	
	/**
	 * 请求并获取DayCodeKey值
	 * 
	 * @param responseXml 响应XML
	 * @return dayCodeKey值
	 */
	public String requestDayCodeKey() {
		String dayCodeKeyXml = handleGetDayCodeKeyXml();
		String reXml = handleRequest(dayCodeKeyXml, this.dayServiceUrl, CODE_SOAP_ACTION);
		return getGetDayCodeKey(reXml);
	}
	
	/**
	 * 请求GetDayCodeKey的XML
	 * 
	 * @return GetDayCodeKey的XML
	 */
	private String handleGetDayCodeKeyXml() {
		StringBuilder sb = new StringBuilder();
		sb.append("<GetDayCodeKey xmlns=\"http://eipsps.scmcc.com.cn/\">");
		sb.append("<RegCode>");
		sb.append(regAppCode);
		sb.append("</RegCode>");
		sb.append("</GetDayCodeKey>");
		return sb.toString();
	}
	
	/**
	 * 取得DayCodeKey值
	 * 
	 * @param responseXml 响应XML
	 * @return dayCodeKey值
	 */
	private String getGetDayCodeKey(String responseXml) {
		DocumentBuilder xdb = XMLParserUtils.getXMLDocBuilder();
		Document resXml = null;
		try {
			resXml = xdb.parse(new InputSource(new StringReader(responseXml.toString())));
		} catch (SAXException e) {
			Log.error("XML解析失败!" + e);
			throw new CommonException("XML解析失败!");
		} catch (IOException e) {
			Log.error("XML解析失败!" + e);
			throw new CommonException("XML解析失败!");
		}
		Node msgNode = resXml.getElementsByTagName("GetDayCodeKeyResult").item(0);
		if (msgNode == null || msgNode.getFirstChild() == null
				|| StringUtils.isEmpty(msgNode.getFirstChild().getNodeValue())) {
			throw new CommonException("daycode获取失败！");
		}
		return msgNode.getFirstChild().getNodeValue();
	}
	
	/**
	 * 验证验证
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		String serviceUrl = "http://10.102.8.234/EIP.SSOAppCenterServer.WebService/TaskTodo.asmx";
		String dayServiceUrl = "http://10.102.8.234/EIP.SSOAppCenterServer.WebService/SSOAppService.asmx";
		String auditUrl = "http://120.77.81.69:8090/audit/mobile/login.html";
		String regAppCode = "F57C36B4-3D17-408D-B1A5-D49C7B3F2E95";
		OAServiceImpl xxx = new OAServiceImpl(serviceUrl, dayServiceUrl, auditUrl, regAppCode);
		xxx.handle("pengming_cd", "wangyuhan_nj", "JH201703301490859065471", "测试");
	}
}