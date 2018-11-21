package com.audit.modules.data.entity;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author : 袁礼斌
 * @Description : OA部门数据导入实体
 * @date : 2017/4/18
 * Copyright (c) , IsoftStone All Right reserved.
 */
//XML文件中的根标识  
@XmlRootElement(name = "UUC_DptResponse")  
public class DptsPo {
	
	private String sequenceId;
	
	private String successFlag;
	
	private String errorMessage;
	
	private List<DptDetailPo> departments;
    
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
	public void setError_Message(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	@XmlElementWrapper(name = "Departments")  
    @XmlElement(name = "DepartmentData")
	public List<DptDetailPo> getDepartments() {
		return departments;
	}
	public void setDepartments(List<DptDetailPo> departments) {
		this.departments = departments;
	}
	
	@Override
	public String toString() {
		return "DptsPo [sequenceId=" + sequenceId + ", successFlag=" + successFlag + ", errorMessage=" + errorMessage
				+ ", departments=" + departments + "]";
	}

}
