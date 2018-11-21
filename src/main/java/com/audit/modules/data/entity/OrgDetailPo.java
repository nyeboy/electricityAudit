package com.audit.modules.data.entity;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;

/**
 * @author : 袁礼斌
 * @Description : OA部门数据详情
 * @date : 2017/4/18
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class OrgDetailPo {
	
	//部门编号
	private String departmentNo;
	//父部门编号
	private String departmentParentNo;
	//部门名称
	private String departmentName;
	//公司编码
	private String companyCode;
	//部门层级
	private String departmentLevel;
	//是否有效
	private String status;
	//是否看见
	private String visible;
	//区域Code
	private String areaCode;
	//区域名称
	private String areaName;
	//部门序号
	private String departmentOrder;
	
	private List<OrgDetailPo> departments;

    //@XmlElement(name = "Department_No") 节点属性用法 
    //节点
    @XmlElement(name = "Department_No")
	public String getDepartmentNo() {
		return departmentNo;
	}
	public void setDepartmentNo(String departmentNo) {
		this.departmentNo = departmentNo;
	}
	
	@XmlElement(name = "Department_Parent_No")
	public String getDepartmentParentNo() {
		return departmentParentNo;
	}

	public void setDepartmentParentNo(String departmentParentNo) {
		this.departmentParentNo = departmentParentNo;
	}

	@XmlElement(name = "Department_Name")
	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	@XmlElement(name = "Company_Code")
	public String getCompanyCode() {
		return companyCode;
	}
	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}
	
	@XmlElement(name = "Department_Level")
	public String getDepartmentLevel() {
		return departmentLevel;
	}
	public void setDepartmentLevel(String departmentLevel) {
		this.departmentLevel = departmentLevel;
	}
	
	@XmlElement(name = "Status")
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@XmlElement(name = "Visible")
	public String getVisible() {
		return visible;
	}

	public void setVisible(String visible) {
		this.visible = visible;
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

	@XmlElement(name = "Department_Order")
	public String getDepartmentOrder() {
		return departmentOrder;
	}

	public void setDepartmentOrder(String departmentOrder) {
		this.departmentOrder = departmentOrder;
	}
	
	@XmlElementWrapper(name = "Children")  
    @XmlElement(name = "DepartmentData")
	public List<OrgDetailPo> getDepartments() {
		return departments;
	}
	public void setDepartments(List<OrgDetailPo> departments) {
		this.departments = departments;
	}
	@Override
	public String toString() {
		return "OrgDetailPo [departmentNo=" + departmentNo + ", departmentParentNo=" + departmentParentNo
				+ ", departmentName=" + departmentName + ", companyCode=" + companyCode + ", departmentLevel="
				+ departmentLevel + ", status=" + status + ", visible=" + visible + ", areaCode=" + areaCode
				+ ", areaName=" + areaName + ", departmentOrder=" + departmentOrder + ", departments=" + departments
				+ "]";
	}
	
}
