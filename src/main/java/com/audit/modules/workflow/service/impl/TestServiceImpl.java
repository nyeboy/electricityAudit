package com.audit.modules.workflow.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.util.Vector;

import javax.xml.parsers.DocumentBuilder;

import org.apache.soap.Body;
import org.apache.soap.Envelope;
import org.apache.soap.SOAPException;
import org.apache.soap.messaging.Message;
import org.apache.soap.transport.SOAPTransport;
import org.apache.soap.util.xml.XMLParserUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.utils.Log;

/**
 * 测试回调
 * 
 * @author luoyun
 */
public class TestServiceImpl {

	/**
	 * 处理请求
	 * 
	 * @param requestXml 请求XML内容
	 * @return 返回响应XML
	 */
	public String handleRequest(String requestXml, String url, String action) {
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
	 * 验证验证
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		TestServiceImpl xx = new TestServiceImpl();
		StringBuffer requestXml = new StringBuffer();
		requestXml.append("<AuditRequest xmlns=\"http://mycompany.com/audit/schemas\">");
		requestXml.append("<xmlResult><![CDATA[<finance><expense><type>EXPENSE</type><accountNo>BX201703031488473570234</accountNo><status>SUCCESS</status></expense></finance>");
		requestXml.append("]]></xmlResult>");
		requestXml.append("</AuditRequest>");
		xx.handleRequest(requestXml.toString(), "http://120.77.81.69:8090/audit/ws/holidayService/", "");
	}
}