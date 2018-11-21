package com.audit.modules.basedata.entity;

/**
 * 
 * @Description: 报账点供电信息   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午2:02:17
 */
public class AccountSitePSU {
	// 报账点ID
	private String id;
	// 站点名称
	private String siteName;
	// 报账点名称
	private String accountName;
	// 报账点别名
	private String accountAlias;
	// 市ID
	private String cityId;
	// 区县ID
	private String countyId;
	// 用电类型(1.直供电、2.转供电)
	private String electricityType;
	// 供电公司/业主(1.供电公司 2. 业主)
	private String supplyCompany;
	// 共享方式(（1共享、2.独享。）)
	private String shareType;
	// 电费缴纳方式(1.代维代缴、2.铁塔代缴、3.自缴)
	private String payType;
	//更新时间
	private String updateTime;

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

	public String getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
}