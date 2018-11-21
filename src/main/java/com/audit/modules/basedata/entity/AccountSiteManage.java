package com.audit.modules.basedata.entity;

import java.util.List;

public class AccountSiteManage {
	// 报账点ID
	private String id;
	// 站点名称
	private String siteName;
	// 报账点名称
	private String accountName;
	// 报账点别名
	private String accountAlias;
	// 原财务站点名称
	private String oldFinanceName;
	// '产权性质（0.自维 1.塔维）产权性质';
	private String productNature;
	// 市ID
	private String cityId;
	// 区县ID
	private String countyId;
	// '报销周期。(1.月、3.季度、6.半年、12.年)';
	private Integer cycle;
	// 用电类型(1.直供电、2.转供电)
	private String electricityType;
	// 供电公司/业主(1.供电公司 2. 业主)
	private String supplyCompany;
	// 共享方式(（1共享、2.独享。）)
	private String shareType;
	// 电费缴纳方式(1.代维代缴、2.铁塔代缴、3.自缴)
	private String payType;
	// 包干价
	private String clubPrice;
	// 合同Id
	private String contractId;
	// 电表号
	private String meterCode;
	// 电表Id
	private String meterId;
	// 机房/资源点名称
	private String resourceName;
	
	private List resourceNames;
	
	private Double DTotalE;
	private Integer islock;
	
private String totalE;
	
	private Integer payTypee;
	private String professional;
	
	//总用电费
	private String totalAmount;
	
	private Double DTotalAmount;
	
	private String eCreateTime;
	
	
	
	public Integer getIslock() {
		return islock;
	}



	public void setIslock(Integer islock) {
		this.islock = islock;
	}



	public String getTotalAmount() {
		return totalAmount;
	}
	
	

	public String geteCreateTime() {
		return eCreateTime;
	}



	public void seteCreateTime(String eCreateTime) {
		this.eCreateTime = eCreateTime;
	}



	public void setTotalAmount(String totalAmount) {
		this.totalAmount = totalAmount;
	}

	public Double getDTotalAmount() {
		return DTotalAmount;
	}

	public void setDTotalAmount(Double dTotalAmount) {
		DTotalAmount = dTotalAmount;
	}

	public Double getDTotalE() {
		return DTotalE;
	}

	public void setDTotalE(Double dTotalE) {
		DTotalE = dTotalE;
	}

	

	public Integer getPayTypee() {
		return payTypee;
	}

	public List getResourceNames() {
		return resourceNames;
	}

	public void setResourceNames(List resourceNames) {
		this.resourceNames = resourceNames;
	}

	public String getTotalE() {
		return totalE;
	}

	public void setTotalE(String totalE) {
		this.totalE = totalE;
	}

	public void setPayTypee(Integer payTypee) {
		this.payTypee = payTypee;
	}


	public String getProfessional() {
		return professional;
	}

	public void setProfessional(String professional) {
		this.professional = professional;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id == null ? null : id.trim();
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName == null ? null : siteName.trim();
	}

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName == null ? null : accountName.trim();
	}

	public String getAccountAlias() {
		return accountAlias;
	}

	public void setAccountAlias(String accountAlias) {
		this.accountAlias = accountAlias == null ? null : accountAlias.trim();
	}

	public String getOldFinanceName() {
		return oldFinanceName;
	}

	public void setOldFinanceName(String oldFinanceName) {
		this.oldFinanceName = oldFinanceName == null ? null : oldFinanceName.trim();
	}

	public String getProductNature() {
		return productNature;
	}

	public void setProductNature(String productNature) {
		this.productNature = productNature == null ? null : productNature.trim();
	}

	public String getCityId() {
		return cityId;
	}

	public void setCityId(String cityId) {
		this.cityId = cityId == null ? null : cityId.trim();
	}

	public String getCountyId() {
		return countyId;
	}

	public void setCountyId(String countyId) {
		this.countyId = countyId == null ? null : countyId.trim();
	}

	public Integer getCycle() {
		return cycle;
	}

	public void setCycle(Integer cycle) {
		this.cycle = cycle;
	}

	public String getElectricityType() {
		return electricityType;
	}

	public void setElectricityType(String electricityType) {
		this.electricityType = electricityType == null ? null : electricityType.trim();
	}

	public String getSupplyCompany() {
		return supplyCompany;
	}

	public void setSupplyCompany(String supplyCompany) {
		this.supplyCompany = supplyCompany == null ? null : supplyCompany.trim();
	}

	public String getShareType() {
		return shareType;
	}

	public void setShareType(String shareType) {
		this.shareType = shareType == null ? null : shareType.trim();
	}

	public String getPayType() {
		return payType;
	}

	public void setPayType(String payType) {
		this.payType = payType == null ? null : payType.trim();
	}

	public String getClubPrice() {
		return clubPrice;
	}

	public String getContractId() {
		return contractId;
	}

	public void setContractId(String contractId) {
		this.contractId = contractId;
	}

	public void setClubPrice(String clubPrice) {
		this.clubPrice = clubPrice;
	}

	public String getMeterCode() {
		return meterCode;
	}

	public String getResourceName() {
		return resourceName;
	}

	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}

	public void setMeterCode(String meterCode) {
		this.meterCode = meterCode;
	}

	public String getMeterId() {
		return meterId;
	}

	public void setMeterId(String meterId) {
		this.meterId = meterId;
	}
}