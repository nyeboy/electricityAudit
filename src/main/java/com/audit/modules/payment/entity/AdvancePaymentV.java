package com.audit.modules.payment.entity;

import java.util.Date;

/**   
 * @Description : TODO(基站电费-预付提交Vo)    
 *
 * @author : chentao
 * @date : 2017年4月10日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class AdvancePaymentV extends AdvancePaymentPo{
	
	//id
	private String id;
	//省id
	private String provinceId;
	//省
	private String provinceStr;
	//市id
	private String cityId;
	//市
	private String cityStr;
	//区/县id
	private String countyId;
	//区/县
	private String countyStr;
	//预付开始时间
	private String startDate;
	//预付结束时间
	private String endDate;
	//预付总金额
	private String totalMoney;
	//预付供应商id
	private String supplyId;
	//合同id
	private String contractId;
	//建单时间
	private String createDate;
	//状态
	private Integer status;
	//备注
	private String remark;
	//制单人
	private String submitMan;
	//预付申请批次号
	private String paymentNumber;
	// 部门名
	private String departmentName;
	// 部门id
	private String departmentId;
	
	private String[] attachmentId;
	
	
	public String[] getAttachmentId() {
		return attachmentId;
	}

	public void setAttachmentId(String[] attachmentId) {
		this.attachmentId = attachmentId;
	}

	public String getProvinceStr() {
		return provinceStr;
	}

	public void setProvinceStr(String provinceStr) {
		this.provinceStr = provinceStr;
	}

	public String getCityStr() {
		return cityStr;
	}

	public void setCityStr(String cityStr) {
		this.cityStr = cityStr;
	}

	public String getCountyStr() {
		return countyStr;
	}

	public void setCountyStr(String countyStr) {
		this.countyStr = countyStr;
	}
	
	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}

	public AdvancePaymentV() {
		super();
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getProvinceId() {
		return provinceId;
	}
	public void setProvinceId(String provinceId) {
		this.provinceId = provinceId;
	}
	public String getCityId() {
		return cityId;
	}
	public void setCityId(String cityId) {
		this.cityId = cityId;
	}
	public String getCountyId() {
		return countyId;
	}
	public void setCountyId(String countyId) {
		this.countyId = countyId;
	}
	public String getTotalMoney() {
		return totalMoney;
	}
	public void setTotalMoney(String totalMoney) {
		this.totalMoney = totalMoney;
	}
	public String getSupplyId() {
		return supplyId;
	}
	public void setSupplyId(String supplyId) {
		this.supplyId = supplyId;
	}

	public String getContractId() {
		return contractId;
	}

	public void setContractId(String contractId) {
		this.contractId = contractId;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getSubmitMan() {
		return submitMan;
	}
	public void setSubmitMan(String submitMan) {
		this.submitMan = submitMan;
	}

	public String getPaymentNumber() {
		return paymentNumber;
	}

	public void setPaymentNumber(String paymentNumber) {
		this.paymentNumber = paymentNumber;
	}

	
}
