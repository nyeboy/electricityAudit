package com.audit.modules.payment.entity;

import java.util.Date;

public class PreSubmit {
	
	private String id;
	private String city;
	private String county;
	private Integer status;
	private Integer reimbursementType;//报销类型 REIMBURSEMENT_TYPE
	private String moneyAmout; //预付总金额  MONEYAMOUNT
	private String  trustessId;//经办人TRUSTEES_ID
	private Date createDate;
	private String submitNo;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCounty() {
		return county;
	}
	public void setCounty(String county) {
		this.county = county;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getReimbursementType() {
		return reimbursementType;
	}
	public void setReimbursementType(Integer reimbursementType) {
		this.reimbursementType = reimbursementType;
	}
	public String getMoneyAmout() {
		return moneyAmout;
	}
	public void setMoneyAmout(String moneyAmout) {
		this.moneyAmout = moneyAmout;
	}
	public String getTrustessId() {
		return trustessId;
	}
	public void setTrustessId(String trustessId) {
		this.trustessId = trustessId;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public String getSubmitNo() {
		return submitNo;
	}
	public void setSubmitNo(String submitNo) {
		this.submitNo = submitNo;
	}
	

}
