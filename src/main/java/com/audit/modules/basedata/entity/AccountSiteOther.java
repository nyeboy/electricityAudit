package com.audit.modules.basedata.entity;

public class AccountSiteOther {
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
	// 分摊比例
//	private String allocationProportion;
	// 市ID
	private String cityName;
	// 区县ID
	private String countyName;
	
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

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public String getCountyName() {
		return countyName;
	}

	public void setCountyName(String countyName) {
		this.countyName = countyName;
	}


}