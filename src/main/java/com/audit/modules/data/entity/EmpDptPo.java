package com.audit.modules.data.entity;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;

/**
 * @author : 袁礼斌
 * @Description : OA人员部门数据
 * @date : 2017/4/19
 * Copyright (c) , IsoftStone All Right reserved.
 */

public class EmpDptPo {

	private String rowNo;
	
	private String isMainDpt;
	
	private String departmentId;
	
	private String departmentName;
	
	private String areaCode;
	
	private String areaName;
	
	private String employeeOrder;
	
	private List<EmpDutyPo> duty;
	
	private List<EmpRolesPo> roles;

	@XmlElement(name = "IsMainDpt")
	public String getIsMainDpt() {
		return isMainDpt;
	}

	public void setIsMainDpt(String isMainDpt) {
		this.isMainDpt = isMainDpt;
	}

	@XmlElement(name = "DepartmentId")
	public String getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}

	@XmlElement(name = "DepartmentName")
	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	@XmlElement(name = "Area_Code")
	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	@XmlElement(name = "Area_Name")
	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	@XmlElement(name = "Employee_Order")
	public String getEmployeeOrder() {
		return employeeOrder;
	}

	public void setEmployeeOrder(String employeeOrder) {
		this.employeeOrder = employeeOrder;
	}

	@XmlElement(name = "Duty")
	public List<EmpDutyPo> getDuty() {
		return duty;
	}

	public void setDuty(List<EmpDutyPo> duty) {
		this.duty = duty;
	}

	@XmlElementWrapper(name = "Roles")  
	@XmlElement(name = "EmployeeRole")
	public List<EmpRolesPo> getRoles() {
		return roles;
	}

	public void setRoles(List<EmpRolesPo> roles) {
		this.roles = roles;
	}

	@Override
	public String toString() {
		return "OwnDepartmentsPo [isMainDpt=" + isMainDpt + ", departmentId=" + departmentId + ", departmentName="
				+ departmentName + ", areaCode=" + areaCode + ", areaName=" + areaName + ", employeeOrder="
				+ employeeOrder + ", duty=" + duty + ", roles=" + roles + "]";
	}

	public String getRowNo() {
		return rowNo;
	}

	public void setRowNo(String rowNo) {
		this.rowNo = rowNo;
	}
}
