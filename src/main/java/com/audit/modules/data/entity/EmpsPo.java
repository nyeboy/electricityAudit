package com.audit.modules.data.entity;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author : 袁礼斌
 * @Description : OA人员数据导入实体
 * @date : 2017/4/19
 * Copyright (c) , IsoftStone All Right reserved.
 */

//XML文件中的根标识  
@XmlRootElement(name = "UUC_EmpResponse")
public class EmpsPo {

	private String sequenceId;
	
	private String successFlag;
	
	private String errorMessage;
	
	private List<EmployeePo> employees;

	@XmlElement(name = "SequenceId")
	public String getSequenceId() {
		return sequenceId;
	}

	public void setSequenceId(String sequenceId) {
		this.sequenceId = sequenceId;
	}

	@XmlElement(name = "Success_Flag")
	public String getSuccessFlag() {
		return successFlag;
	}

	public void setSuccessFlag(String successFlag) {
		this.successFlag = successFlag;
	}

	@XmlElement(name = "Error_Message")
	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	@XmlElementWrapper(name = "Employees")  
    @XmlElement(name = "EmployeeData")
	public List<EmployeePo> getEmployees() {
		return employees;
	}

	public void setEmployees(List<EmployeePo> employees) {
		this.employees = employees;
	}

	@Override
	public String toString() {
		return "EmpsPo [sequenceId=" + sequenceId + ", successFlag=" + successFlag + ", errorMessage=" + errorMessage
				+ ", employees=" + employees + "]";
	}
	
}
