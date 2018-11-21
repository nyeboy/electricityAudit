package com.audit.modules.workflow.entity;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 请求实体
 * 
 * @author luoyun
 */
@XmlRootElement(name = "AuditRequest", namespace="http://mycompany.com/audit/schemas")
@XmlAccessorType(XmlAccessType.FIELD)
public class AuditRequest {
	
	// 处理内容
	@XmlElement(namespace = "http://mycompany.com/audit/schemas")
	private String xmlResult;

	public String getXmlResult() {
		return xmlResult;
	}

	public void setXmlResult(String xmlResult) {
		this.xmlResult = xmlResult;
	}
}