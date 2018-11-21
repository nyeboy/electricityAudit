package com.audit.modules.data.entity;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;

/**
 * @author : 袁礼斌
 * @Description : OA人员数据详情
 * @date : 2017/4/19
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class EmployeePo {

	//员工ID
	private String rowNo;
	
	private String employeeNumber;
	//登录名
	private String loginName;
	//邮箱
	private String mail;
	//姓名
	private String employeeName;
	//员工类型
	private String userType;
	//员工类型名称
	private String userTypeName;
	//电话
	private String mobile;
	//层级
	private String employeeLevel;
	//是否有效
	private String employeeStatus;
	
	private List<EmpDptPo> ownDepartments;

	@XmlElement(name = "RowNo")
	public String getRowNo() {
		return rowNo;
	}

	public void setRowNo(String rowNo) {
		this.rowNo = rowNo;
	}

	@XmlElement(name = "Employee_Number")
	public String getEmployeeNumber() {
		return employeeNumber;
	}

	public void setEmployeeNumber(String employeeNumber) {
		this.employeeNumber = employeeNumber;
	}

	@XmlElement(name = "Login_Name")
	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	@XmlElement(name = "Mail")
	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	@XmlElement(name = "Employee_Name")
	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	@XmlElement(name = "UserType")
	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	@XmlElement(name = "UserTypeName")
	public String getUserTypeName() {
		return userTypeName;
	}

	public void setUserTypeName(String userTypeName) {
		this.userTypeName = userTypeName;
	}

	@XmlElement(name = "Mobile")
	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@XmlElement(name = "Employee_Level")
	public String getEmployeeLevel() {
		return employeeLevel;
	}

	public void setEmployeeLevel(String employeeLevel) {
		this.employeeLevel = employeeLevel;
	}

	@XmlElement(name = "Employee_Status")
	public String getEmployeeStatus() {
		return employeeStatus;
	}

	public void setEmployeeStatus(String employeeStatus) {
		this.employeeStatus = employeeStatus;
	}

	@XmlElementWrapper(name = "OwnDepartments")  
	@XmlElement(name = "OwnDepartment")
	public List<EmpDptPo> getOwnDepartments() {
		return ownDepartments;
	}

	public void setOwnDepartments(List<EmpDptPo> ownDepartments) {
		this.ownDepartments = ownDepartments;
	}

	@Override
	public String toString() {
		return "EmployeePo [rowNo=" + rowNo + ", employeeNumber=" + employeeNumber + ", loginName=" + loginName
				+ ", mail=" + mail + ", employeeName=" + employeeName + ", userType=" + userType + ", userTypeName="
				+ userTypeName + ", mobile=" + mobile + ", employeeLevel=" + employeeLevel + ", employeeStatus="
				+ employeeStatus + ", ownDepartments=" + ownDepartments + "]";
	}
	
}
