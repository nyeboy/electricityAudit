package com.audit.modules.system.entity;

public class WhiteMg {
	
	private String id;
	private String cityId;//市id
	private String countyId;//区id
	private String siteName;//站点名
	private String ziguanName;//资管名
	private String siteNo;//移动站址号
	private String tsiteNo;//铁塔站址号
	private Integer status;//状态0非BMD 1BMD2BMD-1
	private String szydNo;//三重一大会议编号
	private String endTime;//有效截至时间
	private Integer cj;//白名单场景1、党政军等特殊单位无法提供合规票据、不签订协议；  2、非党政军供应商不能提供合规票据；  3、非党政军供应商未签订协议；  4、水电分摊单、收据金额大于电费发票复印件金额；5、转供电发票复印件户名与水电分摊单、收据供应商不一致
	private String fj;//附件id
	private String cperson;//录入人
	private String siteId;//站点id
	private String sureTime;//决议时间
	private String createTime;//创建时间（白名单申请提交时间）
	private String updateTime;//最近修改时间（最新审批记录时间）
	private String contractId;//合同id
	private String cityName;//城市名
	private String zhLabel;//区县名
	private String contractName;//合同名
	private String contractDate;//合同生效日期
	private Integer payType;//1、月付（默认）2、季度付3、半年付4、年付5、其他
	private Double price;//单价或包干价*非0的正数，默认：0，保留2位小数
	private Double fTan;//分摊比例*填写范围（0-100的正数，保留
	private Integer contractStatus;//合同状态默认有效0无效1有效
	private String supplyName;//供应商名
	private String supplySiteId;//供应商地点id
	private String supplyerOrganizationId;//供应商组织id
	private String supplyId;
	private String bankName;//开户行
	private String bankacName;//开户名
	private String bankNum;//账号
	private String contractEndTime;
	private String szydBeginTime;
	private Integer submitStatus;
	private String bz;
	
	
	
	
	public String getSupplyId() {
		return supplyId;
	}
	public void setSupplyId(String supplyId) {
		this.supplyId = supplyId;
	}
	public String getBz() {
		return bz;
	}
	public void setBz(String bz) {
		this.bz = bz;
	}
	public Double getfTan() {
		return fTan;
	}
	public void setfTan(Double fTan) {
		this.fTan = fTan;
	}
	public Integer getSubmitStatus() {
		return submitStatus;
	}
	public void setSubmitStatus(Integer submitStatus) {
		this.submitStatus = submitStatus;
	}
	public String getSzydBeginTime() {
		return szydBeginTime;
	}
	public void setSzydBeginTime(String szydBeginTime) {
		this.szydBeginTime = szydBeginTime;
	}
	public String getContractEndTime() {
		return contractEndTime;
	}
	public void setContractEndTime(String contractEndTime) {
		this.contractEndTime = contractEndTime;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public String getSiteName() {
		return siteName;
	}
	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}
	public String getZiguanName() {
		return ziguanName;
	}
	public void setZiguanName(String ziguanName) {
		this.ziguanName = ziguanName;
	}
	public String getSiteNo() {
		return siteNo;
	}
	public void setSiteNo(String siteNo) {
		this.siteNo = siteNo;
	}
	public String getTsiteNo() {
		return tsiteNo;
	}
	public void setTsiteNo(String tsiteNo) {
		this.tsiteNo = tsiteNo;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getSzydNo() {
		return szydNo;
	}
	public void setSzydNo(String szydNo) {
		this.szydNo = szydNo;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public Integer getCj() {
		return cj;
	}
	public void setCj(Integer cj) {
		this.cj = cj;
	}
	public String getFj() {
		return fj;
	}
	public void setFj(String fj) {
		this.fj = fj;
	}
	public String getCperson() {
		return cperson;
	}
	public void setCperson(String cperson) {
		this.cperson = cperson;
	}
	public String getSiteId() {
		return siteId;
	}
	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}
	public String getSureTime() {
		return sureTime;
	}
	public void setSureTime(String sureTime) {
		this.sureTime = sureTime;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	public String getContractId() {
		return contractId;
	}
	public void setContractId(String contractId) {
		this.contractId = contractId;
	}
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	public String getZhLabel() {
		return zhLabel;
	}
	public void setZhLabel(String zhLabel) {
		this.zhLabel = zhLabel;
	}
	public String getContractName() {
		return contractName;
	}
	public void setContractName(String contractName) {
		this.contractName = contractName;
	}
	public String getContractDate() {
		return contractDate;
	}
	public void setContractDate(String contractDate) {
		this.contractDate = contractDate;
	}
	public Integer getPayType() {
		return payType;
	}
	public void setPayType(Integer payType) {
		this.payType = payType;
	}
	
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public Integer getContractStatus() {
		return contractStatus;
	}
	public void setContractStatus(Integer contractStatus) {
		this.contractStatus = contractStatus;
	}
	public String getSupplyName() {
		return supplyName;
	}
	public void setSupplyName(String supplyName) {
		this.supplyName = supplyName;
	}
	public String getSupplySiteId() {
		return supplySiteId;
	}
	public void setSupplySiteId(String supplySiteId) {
		this.supplySiteId = supplySiteId;
	}
	public String getSupplyerOrganizationId() {
		return supplyerOrganizationId;
	}
	public void setSupplyerOrganizationId(String supplyerOrganizationId) {
		this.supplyerOrganizationId = supplyerOrganizationId;
	}
	public String getBankName() {
		return bankName;
	}
	public void setBankName(String bankName) {
		this.bankName = bankName;
	}
	public String getBankacName() {
		return bankacName;
	}
	public void setBankacName(String bankacName) {
		this.bankacName = bankacName;
	}
	public String getBankNum() {
		return bankNum;
	}
	public void setBankNum(String bankNum) {
		this.bankNum = bankNum;
	}
	
	

}
