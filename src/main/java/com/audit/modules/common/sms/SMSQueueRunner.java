package com.audit.modules.common.sms;

import java.net.URL;
import java.util.concurrent.BlockingQueue;

import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.rpc.ParameterMode;
import javax.xml.rpc.encoding.XMLType;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.audit.modules.common.sms.bean.SMSConfig;
import com.audit.modules.common.sms.bean.SMSInfo;

/**
 * @author : 袁礼斌
 * @Description : 短信发送队列处理线程
 * @date : 2017/4/26
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SMSQueueRunner implements Runnable {
    
    private static Log log = LogFactory.getLog(SMSQueueRunner.class);
    
    private SMSConfig config;  //邮件服务器配置
    
    private BlockingQueue<SMSInfo> queue; //短信发送队列
    
    private boolean over = false;   //线程是否结束
    
    public SMSQueueRunner(SMSConfig config,BlockingQueue<SMSInfo> queue){
        this.config = config;
        this.queue = queue;
    }
    
    @Override
    public void run() {
        
        if(null != config){

            String data = null;
            String result = null;
            while(!over){
                SMSInfo smsInfo = null;
                
                try {
                	smsInfo = queue.take();
                	data = createXml(config,smsInfo);
                    Service service = new Service();
                    Call call = (Call)service.createCall();
                    call.setTargetEndpointAddress(new URL(config.getUrl()));
                    call.setSOAPActionURI(config.getSmsActionUrl());
                    call.setOperationName(new QName(config.getSmsNameSpace(), config.getSmsSendMethod()));
                    call.addParameter(new QName(config.getSmsNameSpace(), "message"), XMLType.XSD_STRING,
                            ParameterMode.IN);
                    call.setEncodingStyle("UTF-8");
                    call.setReturnType(org.apache.axis.encoding.XMLType.XSD_STRING);

                    Object[] objects = new Object[]{data};
                    result = (String)call.invoke(objects);
                    if("0".equals(result)){
                    	log.info("短信发送成功");
                    }
                    
                } catch (Exception e) {
                	log.error("短信发送异常");
                    e.printStackTrace();
                }
            }
        }
    }
    
    public void stop(){
        this.over = false;
    }
    
    private String createXml(SMSConfig config,SMSInfo smsInfo) {  
        String xmlString = "";

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        try {
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.newDocument();
            document.setXmlStandalone(true);
            Element doc = document.createElement("xml");
            document.appendChild(doc);
  
            Element items = document.createElement("message");
            doc.appendChild(items);
            String[] recievers = smsInfo.getRecievers().split(",");
            for(String reciever : recievers){
	            // 此处可以循环添加 
	            Element item = document.createElement("OneRecord");
	            items.appendChild(item);
	  
	            Element itemDesttermid = document.createElement("desttermid");
	            itemDesttermid.setTextContent(reciever);
	            item.appendChild(itemDesttermid);
	  
	            Element itemUsername = document.createElement("username");
	            itemUsername.setTextContent(config.getUserName());
	            item.appendChild(itemUsername);
	  
	            Element itemPassword = document.createElement("password");
	            itemPassword.setTextContent(config.getPassword());
	            item.appendChild(itemPassword);
	  
	            Element itemLicence = document.createElement("licence");
	            itemLicence.setTextContent(config.getLicence());
	            item.appendChild(itemLicence);
	            
	            Element itemMsgcontent = document.createElement("msgcontent");
	            itemMsgcontent.appendChild(document.createCDATASection(smsInfo.getContent()));    
	            item.appendChild(itemMsgcontent);
	            
	            Element itemSysteminfo = document.createElement("systeminfo");
	            itemSysteminfo.setTextContent(config.getSystem());
	            item.appendChild(itemSysteminfo);
            }  
            TransformerFactory transFactory = TransformerFactory.newInstance();
            Transformer transformer = transFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("encoding","UTF-8");
            DOMSource domSource = new DOMSource(document);
            
            // xml transform String
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            transformer.transform(domSource, new StreamResult(bos));
            xmlString = bos.toString();
            System.out.println(xmlString);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return xmlString;
    }
}
