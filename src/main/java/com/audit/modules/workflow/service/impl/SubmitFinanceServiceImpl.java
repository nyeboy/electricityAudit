package com.audit.modules.workflow.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import javax.xml.parsers.DocumentBuilder;

import org.apache.soap.Body;
import org.apache.soap.Envelope;
import org.apache.soap.SOAPException;
import org.apache.soap.messaging.Message;
import org.apache.soap.transport.SOAPTransport;
import org.apache.soap.util.xml.XMLParserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.utils.Log;
import com.audit.modules.electricity.entity.ElectricitySubmitVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.electricity.entity.TowerReimburseVo;
import com.audit.modules.electricity.entity.TowerSaveVO;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.system.dao.UserDao;
import com.audit.modules.system.entity.UserVo;

/**
 * 提交财务接口
 * 
 * @author luoyun
 */
/**
 * @author bingliup
 *
 */
public class SubmitFinanceServiceImpl {

	/** SOAPAction */
	private static final String SOAP_ACTION = "http://tempuri.org/IReimbursementSrv/ReimbursementSrvRun";

	private static final String PRE_SOAP_ACTION = "http://tempuri.org/IPrepaymentSrv/PrepaymentSrvRun";
	
	private static final String AdvancePaymentVo = null;
	
	public String getServiceUrl() {
		return serviceUrl;
	}

	public void setServiceUrl(String serviceUrl) {
		this.serviceUrl = serviceUrl;
	}

	// 服务器IP
	private String serviceUrl;
	
	// 是否开启功能
	private boolean breaker = false;
	
	public boolean isBreaker() {
		return breaker;
	}

	public void setBreaker(boolean breaker) {
		this.breaker = breaker;
	}

	@Autowired
	private UserDao userDao;
	
	/**
	 * 构造方法
	 * 
	 * @param serviceUrl 服务接口
	 */
	public SubmitFinanceServiceImpl(String serviceUrl) {
		this.serviceUrl = serviceUrl;
	}
	
	/**
	 * 构造方法
	 * 
	 * @param serviceUrl 服务接口
	 * @param breaker 是否执行功能
	 */
	public SubmitFinanceServiceImpl(String serviceUrl, boolean breaker) {
		this(serviceUrl);
		this.breaker = breaker;
	}
	
	
	
	/**
	 * 自维预付推送账务
	 * 
	 * @param sendList 待推送信息
	 * @return 是否推送成功
	 */
	public void handlePreFinance(List<Map<String, Object>> sendList) {
		// 判断是否执行功能
		if (!this.breaker) {
			Log.info("The switch is not open");
			return;
		}
		String resultXml = preHandleRequest(handlePreMessage(sendList));
		exeSuccess(resultXml);
	}
	
	
	
	
	/**
	 * 自维推送账务
	 * 
	 * @param sendList 待推送信息
	 * @return 是否推送成功
	 */
	public void handleFinance(List<Map<String, Object>> sendList) {
		// 判断是否执行功能
		if (!this.breaker) {
			Log.info("The switch is not open");
			return;
		}
		String resultXml = handleRequest(handleMessage(sendList));
		exeSuccess(resultXml);
	}

	/**
	 * 自维推送
	 * 
	 * @param requestXml
	 */
	public void handleFinance(String requestXml) {
		// 判断是否执行功能
		if (!this.breaker) {
			Log.info("The switch is not open");
			return;
		}
		String resultXml = handleRequest(requestXml);
		exeSuccess(resultXml);
	}
	
	/**
	 * 处理请求
	 * 
	 * @param requestXml 请求XML内容
	 * @return 返回响应XML
	 */
	private String handleRequest(String requestXml) {
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
			msg.send(new URL(this.serviceUrl), SOAP_ACTION, envelope);

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
	 * 预付处理请求
	 * 
	 * @param requestXml 请求XML内容
	 * @return 返回响应XML
	 */
	private String preHandleRequest(String requestXml) {
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
			msg.send(new URL(this.serviceUrl), PRE_SOAP_ACTION, envelope);

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
	 * 组装消息内容
	 * 
	 * @param sendInfos 待推送信息
	 * @return 待推送SOAP信息
	 */
	private String handleMessage(List<Map<String, Object>> sendList) {
		StringBuilder sb = new StringBuilder();
		sb.append("<tem:ReimbursementSrvRun xmlns:tem=\"http://tempuri.org/\">");
		sb.append("<agents>");

		// 参数
		sb.append("<tem:SOURCESYSTEMID>DFGH_WGZX_CW</tem:SOURCESYSTEMID>");
		sb.append("<tem:SOURCESYSTEMNAME>四川移动电费稽核系统</tem:SOURCESYSTEMNAME>");
		sb.append("<tem:USERID>SC_WGZX</tem:USERID>");
		sb.append("<tem:USERNAME>四川移动网络管理中心</tem:USERNAME>");
		sb.append("<tem:SUBMITDATE>" + getCurDate() + "</tem:SUBMITDATE>");
		sb.append("<tem:TOTAL_RECORD>" + sendList.size() + "</tem:TOTAL_RECORD>");
		sb.append("<tem:ENVIRONMENT_NAME></tem:ENVIRONMENT_NAME>");
		sb.append("<tem:AccountCollect>");
		// 处理数据
		for (Map<String, Object> info : sendList) {
			ElectricitySubmitVO electricitySubmitVO = (ElectricitySubmitVO) info.get("electricitySubmitVO");
			int num = (int)info.get("num");
			for(int i=0;i<num;i++){
				ElectrictyVO electricty = (ElectrictyVO) info.get("electricty"+i);
				sb.append(financeContext(electricitySubmitVO, electricty));
			}
//			ElectrictyVO electricty = (ElectrictyVO) info.get("electricty");
		}
		sb.append("</tem:AccountCollect>");
		sb.append("</agents>");
		sb.append("</tem:ReimbursementSrvRun>");
		return sb.toString();
	}
	
	
	
	
	/**
	 * 组装消息内容(预付)
	 * 
	 * @param sendInfos 待推送信息
	 * @return 待推送SOAP信息
	 */
	private String handlePreMessage(List<Map<String, Object>> sendList) {
		StringBuilder sb = new StringBuilder();
		sb.append("<tem:PrepaymentSrvRun xmlns:tem=\"http://tempuri.org/\">");
		sb.append("<pi>");

		// 参数
		sb.append("<tem:SOURCESYSTEMID>DFGH_WGZX_CW</tem:SOURCESYSTEMID>");
		sb.append("<tem:SOURCESYSTEMNAME>四川移动电费稽核系统</tem:SOURCESYSTEMNAME>");
		sb.append("<tem:USERID>SC_WGZX</tem:USERID>");
		sb.append("<tem:USERNAME>四川移动网络管理中心</tem:USERNAME>");
		sb.append("<tem:SUBMITDATE>" + getCurDate() + "</tem:SUBMITDATE>");
		sb.append("<tem:TOTAL_RECORD>" + sendList.size() + "</tem:TOTAL_RECORD>");
		sb.append("<tem:ENVIRONMENT_NAME></tem:ENVIRONMENT_NAME>");
		sb.append("<tem:AccountCollect>");
		// 处理数据(预付)
		for (Map<String, Object> info : sendList) {
			com.audit.modules.payment.entity.ElectricitySubmitVO electricitySubmitVO = (com.audit.modules.payment.entity.ElectricitySubmitVO) info.get("electricitySubmitVO");
			AdvancePaymentVo electricty=(AdvancePaymentVo)info.get("electricty");
			//组装预付数据
			sb.append(financePreContext(electricitySubmitVO, electricty));
		}
		sb.append("</tem:AccountCollect>");
		sb.append("</pi>");
		sb.append("</tem:PrepaymentSrvRun>");
		return sb.toString();
	}

	
	

	/**
	 * 处理账务信息
	 * 
	 * @param electricitySubmitVO 电费提交单内容
	 * @param electricty 稽核单信息
	 * @return
	 */
	private String financeContext(ElectricitySubmitVO electricitySubmitVO, ElectrictyVO electricty) {
		StringBuilder sb = new StringBuilder();
		// 报销参数
		sb.append(" <tem:Reimbursement_AccountCollect_In>");
		// 流水号
		sb.append("<tem:AccountCollectCode>");
		sb.append(electricitySubmitVO.getSubmitNo());
		sb.append("</tem:AccountCollectCode>");
		// 报销单标题
		sb.append("<tem:ReimbursementReason>测试</tem:ReimbursementReason>");
		// 起草人信息
		UserVo user = userDao.getUserByUserId(electricitySubmitVO.getTrustees());
//		UserVo user = userDao.queryUserByUserId(electricitySubmitVO.getTrustees());
		// 起草人ID
		sb.append("<tem:CreatorID>");
		sb.append(electricitySubmitVO.getTrustees());
		sb.append("</tem:CreatorID>");
		// 起草人登录名
		sb.append("<tem:CreatorLoginName>");
		sb.append(user.getAccount());
		sb.append("</tem:CreatorLoginName>");
		// 起草人名称
		sb.append("<tem:CreatorName>");
		sb.append(user.getUserName());
		sb.append("</tem:CreatorName>");
		// 供应商ID
		sb.append("<tem:VenderID>");
		sb.append(electricty.getSupplierCode());
		sb.append("</tem:VenderID>");
		// 供应商组织结构代码
		sb.append("<tem:VenderOrganizationID>");
		sb.append(electricty.getOrganizationCode());
		sb.append("</tem:VenderOrganizationID>");
		// 供应地点ID
		sb.append("<tem:VenderSiteID>");
		sb.append(electricty.getRegionCode());
		sb.append("</tem:VenderSiteID>");
		// 台帐总金额（含税）
		sb.append("<tem:AccountMoney>");
		sb.append(electricitySubmitVO.getTotalAmount());
		sb.append("</tem:AccountMoney>");
		// 台账价款合计
		sb.append("<tem:AccountPriceToltal>");
		sb.append(electricitySubmitVO.getPriceAmount());
		sb.append("</tem:AccountPriceToltal>");
		// 台账税额合计
		sb.append("<tem:AccountTaxToltal>");
		sb.append(electricitySubmitVO.getTaxAmount());
		sb.append("</tem:AccountTaxToltal>");
		// 预付冲销金额
		sb.append("<tem:AccountPrepayment>");
		sb.append(electricty.getExpenseTotalAmount());
		sb.append("</tem:AccountPrepayment>");
		// 付款金额
		sb.append("<tem:PaymentMoney>");
		sb.append(electricitySubmitVO.getPayAmount());
		sb.append("</tem:PaymentMoney>");
		
		//是否包含增值税发票
		String taxAmount = electricty.getTaxAmount();
		if(taxAmount!=null&&taxAmount!=""){
			sb.append("<tem:IsIncludeInputVATVoucher>true</tem:IsIncludeInputVATVoucher>");
		}else{
			sb.append("<tem:IsIncludeInputVATVoucher>false</tem:IsIncludeInputVATVoucher>");
		}
		//是否为白名单
		String contractID = electricty.getContractID();
		int indexOf = contractID.indexOf("HT");
		if(indexOf!=-1){
			sb.append(" <tem:IsWhiteVendor>");
			sb.append("true");
			sb.append("</tem:IsWhiteVendor>");
		}else{
			sb.append(" <tem:IsWhiteVendor>");
			sb.append("false");
			sb.append("</tem:IsWhiteVendor>");
		}
		sb.append("<tem:AccountDetails>");
		sb.append("<tem:Reimbursement_AccountCollectDetails_In>");
		

		if(indexOf!=-1){
			
		}else{
			 sb.append("<tem:ContractId>");
		       sb.append(electricty.getContractID());
				//现在无正确合同数据
				/*sb.append("1268384");*/
		       sb.append("</tem:ContractId>");
		}
/*       sb.append("<tem:ContractId>");
       sb.append(electricty.getContractID());
		//现在无正确合同数据
		sb.append("1268384");
       sb.append("</tem:ContractId>");*/
       sb.append(" <tem:BudgetCode>P006511201409001</tem:BudgetCode>");
       sb.append("<tem:BudgetName>客户服务中心房屋租赁费</tem:BudgetName>");
       sb.append(" <tem:ActivityCode>N04010102</tem:ActivityCode>");
       sb.append("<tem:ActivityName>基础网络-电费</tem:ActivityName>");
     //成本中心
     		sb.append(" <tem:cost_center>");
     		sb.append(user.getCostid());
     		sb.append("</tem:cost_center>");
     		sb.append("<tem:price>");
     		sb.append(electricty.getTotalAmount());
     		sb.append("</tem:price>");
     		sb.append(" <tem:totalPrice>");
     		sb.append(electricty.getTotalAmount());
     		sb.append("</tem:totalPrice>");
     		
     		
     		//是否包含增值税发票
     		if(taxAmount!=null&&taxAmount!=""){
    			sb.append("<tem:LineVATPriceAmount>");
    			sb.append(electricty.getElectricityAmount());
    			sb.append("</tem:LineVATPriceAmount>");
    		}
     		if(taxAmount!=null&&taxAmount!=""){
    			sb.append(" <tem:LineVATTaxCode>");
    			sb.append("VAT"+electricty.getTaxes());
    			sb.append("</tem:LineVATTaxCode>");
    		}
     		
    		if(taxAmount!=null&&taxAmount!=""){
    			sb.append(" <tem:LineVATTaxAmount>");
    			sb.append(electricty.getTaxAmount());
    			sb.append("</tem:LineVATTaxAmount>");
    		}
     		sb.append("<tem:remark>测试</tem:remark>");
     		sb.append("<tem:WhiteVendorType>1</tem:WhiteVendorType>");
     		sb.append("</tem:Reimbursement_AccountCollectDetails_In>");
     		sb.append("</tem:AccountDetails>");
     		sb.append("</tem:Reimbursement_AccountCollect_In>");
		return sb.toString();
	}
	
	
	
	
	/**
	 * 处理预付账务信息
	 * 
	 * @param electricitySubmitVO 预付提交单内容
	 * @param electricty 预付单
	 * @return
	 */
	private String financePreContext(com.audit.modules.payment.entity.ElectricitySubmitVO electricitySubmitVO, AdvancePaymentVo electricty) {
		StringBuilder sb = new StringBuilder();
		// 报销参数
		sb.append("<tem:Prepayment_AccountCollect_In>");
		// 流水号
		sb.append("<tem:AccountCollectCode>");
		sb.append(electricitySubmitVO.getSubmitNo());
		sb.append("</tem:AccountCollectCode>");
		// 报销单标题
		sb.append("<tem:PrePaymentTitle>");
		sb.append("测试预付");
		sb.append("</tem:PrePaymentTitle>");
		//预付原因
		sb.append(" <tem:PrePaymentReason>测试</tem:PrePaymentReason>");
		// 起草人信息
		UserVo user = userDao.getUserByUserId(electricitySubmitVO.getTrustees());
		// 起草人登录名
		sb.append("<tem:ExcutePerson>");
		sb.append(user.getAccount());
		sb.append("</tem:ExcutePerson>");
		// 部门id
		sb.append("<tem:ExcutePersonDept>");
		sb.append(user.getDepartmentNo());
		sb.append("</tem:ExcutePersonDept>");
		// 公司id
		sb.append("<tem:ExcutePersonCompany>");
		sb.append(user.getCompanyId());
		sb.append("</tem:ExcutePersonCompany>");
		// 供应商ID
		sb.append("<tem:VenderID>");
		sb.append(electricty.getSupplyId());
		sb.append("</tem:VenderID>");
		// 供应商组织结构代码
		sb.append("<tem:VenderOrganizationID>");
		sb.append(electricty.getOrganizationCode());
		sb.append("</tem:VenderOrganizationID>");
		// 供应地点ID
		sb.append("<tem:VenderSiteID>");
		sb.append(electricty.getRegionCode());
		sb.append("</tem:VenderSiteID>");
		// 合同ID
		sb.append("<tem:ContractID>");
		sb.append(electricty.getContractId());
		sb.append("</tem:ContractID>");		
		// 预付总金额
		sb.append("<tem:PrepaymentAmmount>");
		sb.append(electricitySubmitVO.getMoneyAmount());
		sb.append("</tem:PrepaymentAmmount>");
		//成本中心
		sb.append(" <tem:CostCenter>");
		sb.append(user.getCostid());
		sb.append("</tem:CostCenter>");
		sb.append("<tem:AccountDetails>");
       sb.append("<tem:Prepayment_AccountCollectDetails_In>");
       sb.append("<tem:ActivityCode>N04010102</tem:ActivityCode>");
       sb.append("<tem:ActivityName>基础网络-电费</tem:ActivityName>");
       sb.append(" <tem:MoneyAmount>");
       sb.append(electricitySubmitVO.getMoneyAmount());
       sb.append("</tem:MoneyAmount>");
       sb.append(" </tem:Prepayment_AccountCollectDetails_In>");
       sb.append("</tem:AccountDetails>");
		sb.append("</tem:Prepayment_AccountCollect_In>");
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
	 * 结果解析
	 * 
	 * @param resultXml 结果XML
	 */
	private void exeSuccess(String resultXml) {
		DocumentBuilder xdb = XMLParserUtils.getXMLDocBuilder();
		Document resXml = null;
		try {
			resXml = xdb.parse(new InputSource(new StringReader(resultXml.toString())));
		} catch (SAXException e) {
			Log.error("XML解析失败!" + e);
			throw new CommonException("XML解析失败!");
		} catch (IOException e) {
			Log.error("XML解析失败!" + e);
			throw new CommonException("XML解析失败!");
		}
		Node msgNode = resXml.getElementsByTagName("ErrorMsg").item(0);
		String message = msgNode.getFirstChild().getNodeValue();
		if (message.indexOf("成功") == -1) {
			Log.info("报账失败!");
			throw new CommonException(message);
		}
	}
	
	/**
	 * 塔维接口
	 * 
	 * @param sendList 待处理数据
	 */
	public void handleTowerFinance(List<Map<String, Object>> sendList) {
		// 判断是否执行功能
		if (!this.breaker) {
			Log.info("The switch is not open");
			return;
		}
		String responseXml = handleRequest(handleTowerMessage(sendList));
		exeSuccess(responseXml);
	}
	
	/**
	 * 处理请求内容
	 * 
	 * @param sendList 
	 * @return
	 */
	private String handleTowerMessage(List<Map<String, Object>> sendList) {
		StringBuilder sb = new StringBuilder();
		sb.append("<tem:ReimbursementSrvRun xmlns:tem=\"http://tempuri.org/\">");
		sb.append("<agents>");

		// 参数
		sb.append("<tem:SOURCESYSTEMID>ZFGH_WGZX_CW</tem:SOURCESYSTEMID>");
		sb.append("<tem:SOURCESYSTEMNAME>四川移动电费稽核系统</tem:SOURCESYSTEMNAME>");
		sb.append("<tem:USERID>SC_WGZX</tem:USERID>");
		sb.append("<tem:USERNAME>四川移动网络管理中心</tem:USERNAME>");
		sb.append("<tem:SUBMITDATE>" + getCurDate() + "</tem:SUBMITDATE>");
		sb.append("<tem:TOTAL_RECORD>" + sendList.size() + "</tem:TOTAL_RECORD>");
		sb.append("<tem:ENVIRONMENT_NAME></tem:ENVIRONMENT_NAME>");
		sb.append("<tem:AccountCollect>");
		// 处理数据
		for (Map<String, Object> info : sendList) {
			TowerReimburseVo electricitySubmitVO = (TowerReimburseVo) info.get("electricitySubmitVO");
			TowerSaveVO electricty = (TowerSaveVO) info.get("electricty");
			sb.append(financeTowerContext(electricitySubmitVO, electricty));
		}
		sb.append("</tem:AccountCollect>");

		sb.append("</agents>");
		sb.append("</tem:ReimbursementSrvRun>");
		return sb.toString();
	}
	
	/**
	 * 处理塔维XML内容 
	 * 
	 * @param electricitySubmitVO 电费提交单
	 * @param electricty 稽核单
	 * @return 塔维请求XML
	 */
	private String financeTowerContext(TowerReimburseVo electricitySubmitVO, TowerSaveVO electricty) {
		StringBuilder sb = new StringBuilder();
		// 报销参数
		sb.append("<tem:Reimbursement_AccountCollect_In>");
		// 流水号
		sb.append("<tem:AccountCollectCode>");
		sb.append(electricitySubmitVO.getReimburseNo());
		sb.append("</tem:AccountCollectCode>");
		// 报销单标题
		sb.append("<tem:ReimbursementReason></tem:ReimbursementReason>");
		// 起草人信息
		UserVo user = userDao.queryUserByUserId(electricitySubmitVO.getUserId());
		// 起草人ID
		sb.append("<tem:CreatorID>");
		sb.append(electricitySubmitVO.getUserId());
		sb.append("</tem:CreatorID>");
		// 起草人登录名
		sb.append("<tem:CreatorLoginName>");
		sb.append(user.getAccount());
		sb.append("</tem:CreatorLoginName>");
		// 起草人名称
		sb.append("<tem:CreatorName>");
		sb.append(user.getUserName());
		sb.append("</tem:CreatorName>");
		// 供应商ID
		sb.append("<tem:VenderID>");
		sb.append(electricty.getSupplierCode());
		sb.append("</tem:VenderID>");
		// 供应商组织结构代码
		sb.append("<tem:VenderOrganizationID>");
		sb.append(electricty.getOrganizationCode());
		sb.append("</tem:VenderOrganizationID>");
		// 供应地点ID
		sb.append("<tem:VenderSiteID>");
		sb.append(electricty.getRegionCode());
		sb.append("</tem:VenderSiteID>");
		// 台帐总金额（含税）
		sb.append("<tem:AccountMoney>");
		sb.append(electricitySubmitVO.getTotalAmount());
		sb.append("</tem:AccountMoney>");
		// 台账价款合计
		sb.append("<tem:AccountPriceToltal>");
		sb.append(electricitySubmitVO.getPriceAmount());
		sb.append("</tem:AccountPriceToltal>");
		// 台账税额合计
		sb.append("<tem:AccountTaxToltal>");
		sb.append(electricitySubmitVO.getTaxAmount());
		sb.append("</tem:AccountTaxToltal>");
		// 预付冲销金额
		sb.append("<tem:AccountPrepayment>");
		sb.append(electricitySubmitVO.getPreAmount());
		sb.append("</tem:AccountPrepayment>");
		// 付款金额
		sb.append("<tem:PaymentMoney>");
		sb.append(electricitySubmitVO.getPayAmount());
		sb.append("</tem:PaymentMoney>");
		sb.append("<tem:IsIncludeInputVATVoucher>False</tem:IsIncludeInputVATVoucher>");
		sb.append("<tem:AccountDetails/>");
		sb.append("</tem:Reimbursement_AccountCollect_In>");
		return sb.toString();
	}
	
	/**
	 * 验证代码
	 * 
	 * @param args
	 */
	/*public static void main(String[] args) {
		String serviceUrl = "http://10.101.11.247/ElectrcityAuditIntoBaseSiteSvc/ReimbursementBaseSiteSrv.svc";
		SubmitFinanceServiceImpl xx = new SubmitFinanceServiceImpl(serviceUrl, true);
		StringBuilder sb = new StringBuilder();
		sb.append("<tem:ReimbursementSrvRun xmlns:tem=\"http://tempuri.org/\">");
		sb.append("<agents>");

		// 参数
		sb.append("<tem:SOURCESYSTEMID>ZFGH_WGZX_CW</tem:SOURCESYSTEMID>");
		sb.append("<tem:SOURCESYSTEMNAME>四川移动电费稽核系统</tem:SOURCESYSTEMNAME>");
		sb.append("<tem:USERID>SC_WGZX</tem:USERID>");
		sb.append("<tem:USERNAME>四川移动网络管理中心</tem:USERNAME>");
		sb.append("<tem:SUBMITDATE>2017-06-15 00:00:00</tem:SUBMITDATE>");
		sb.append("<tem:TOTAL_RECORD>1</tem:TOTAL_RECORD>");
		sb.append("<tem:ENVIRONMENT_NAME>稽核测试</tem:ENVIRONMENT_NAME>");
		sb.append("<tem:AccountCollect>");
		// 报销参数
		sb.append("<tem:Reimbursement_AccountCollect_In>");
		// 流水号
		sb.append("<tem:AccountCollectCode>");
		sb.append("BX1706193279264867425973");
		sb.append("</tem:AccountCollectCode>");
		// 报销单标题
		sb.append("<tem:ReimbursementReason></tem:ReimbursementReason>");
		// 起草人ID
		sb.append("<tem:CreatorID>");
		sb.append("7253");
		sb.append("</tem:CreatorID>");
		// 起草人登录名
		sb.append("<tem:CreatorLoginName>");
		sb.append("cwb_tangsu");
		sb.append("</tem:CreatorLoginName>");
		// 起草人名称
		sb.append("<tem:CreatorName>");
		sb.append("财务部_财务信息平台维护组");
		sb.append("</tem:CreatorName>");
		// 供应商ID
		sb.append("<tem:VenderID>");
		sb.append("119195");
		sb.append("</tem:VenderID>");
		// 供应商组织结构代码
		sb.append("<tem:VenderOrganizationID>");
		sb.append("91");
		sb.append("</tem:VenderOrganizationID>");
		// 供应地点ID
		sb.append("<tem:VenderSiteID>");
		sb.append("148509");
		sb.append("</tem:VenderSiteID>");
		// 台帐总金额（含税）
		sb.append("<tem:AccountMoney>");
		sb.append("200.00");
		sb.append("</tem:AccountMoney>");
		// 台账价款合计
		sb.append("<tem:AccountPriceToltal>");
		sb.append("300.00");
		sb.append("</tem:AccountPriceToltal>");
		// 台账税额合计
		sb.append("<tem:AccountTaxToltal>");
		sb.append("500.00");
		sb.append("</tem:AccountTaxToltal>");
		// 预付冲销金额
		sb.append("<tem:AccountPrepayment>");
		sb.append("1.00");
		sb.append("</tem:AccountPrepayment>");
		// 付款金额
		sb.append("<tem:PaymentMoney>");
		sb.append("500.00");
		sb.append("</tem:PaymentMoney>");
		
		//是否包含增值税专用发票
		sb.append("<tem:IsIncludeInputVATVoucher>False</tem:IsIncludeInputVATVoucher>");
		//台账名细
		sb.append("<tem:AccountDetails/>");
		//报销参数（结束标签）
		sb.append("</tem:Reimbursement_AccountCollect_In>");
		//参数（结束标签）
		sb.append("</tem:AccountCollect>");
		//结束标签
		sb.append("</agents>");
		sb.append("</tem:ReimbursementSrvRun>");
		xx.handleFinance(sb.toString());
	}*/
}
