package com.audit.modules.workflow.entity;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 响应实体
 * 
 * @author luoyun
 */
@XmlRootElement(name = "AuditResponse", namespace="http://mycompany.com/audit/schemas")
@XmlAccessorType(XmlAccessType.FIELD)
public class AuditResponse {

	// CODE值
	@XmlElement(namespace = "http://mycompany.com/audit/schemas")
	private Integer code;

	// 返回码简单说明
	// 返回内容
	@XmlElement(namespace = "http://mycompany.com/audit/schemas")
	protected String message;

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
