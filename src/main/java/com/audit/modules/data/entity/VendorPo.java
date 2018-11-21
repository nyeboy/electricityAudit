package com.audit.modules.data.entity;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author : 袁礼斌
 * @Description : EPR供应商数据
 * @date : 2017/4/19
 * Copyright (c) , IsoftStone All Right reserved.
 */

@XmlRootElement(name = "Vendor")
public class VendorPo {

	private String extensionData;
	
	private String orgId;
	
	private String vendorId;
	
	private String vendorSiteId;
	
	private String ouName;
	
	private String vendorName;
	
	private String vendorCode;
	
	private String vendorType;
	
	private String address;
	
	private String employeeName;
	
	private String phone;
	
	private String bankBranchName;
	
	private String bankName;
	
	private String bankNum;
	
	private String lastUpdate;
	
	private String enableFlag;
	
	private String vendorEndDateActive;
	
	private String siteInactiveDate;
	
	private String bankInactiveDate;
	
	private String areaCode;
	
	private String vendorTaxType;
	
	private String attribute1;
	
	private String attribute2;

	@XmlElement(name = "ExtensionData")
	public String getExtensionData() {
		return extensionData;
	}

	public void setExtensionData(String extensionData) {
		this.extensionData = extensionData;
	}

	@XmlElement(name = "Org_id")
	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	@XmlElement(name = "vendor_id")
	public String getVendorId() {
		return vendorId;
	}

	public void setVendorId(String vendorId) {
		this.vendorId = vendorId;
	}

	@XmlElement(name = "vendor_site_id")
	public String getVendorSiteId() {
		return vendorSiteId;
	}

	public void setVendorSiteId(String vendorSiteId) {
		this.vendorSiteId = vendorSiteId;
	}

	@XmlElement(name = "ou_name")
	public String getOuName() {
		return ouName;
	}

	public void setOuName(String ouName) {
		this.ouName = ouName;
	}

	@XmlElement(name = "vendor_name")
	public String getVendorName() {
		return vendorName;
	}

	public void setVendorName(String vendorName) {
		this.vendorName = vendorName;
	}

	@XmlElement(name = "vendor_code")
	public String getVendorCode() {
		return vendorCode;
	}

	public void setVendorCode(String vendorCode) {
		this.vendorCode = vendorCode;
	}

	@XmlElement(name = "vendor_type")
	public String getVendorType() {
		return vendorType;
	}

	public void setVendorType(String vendorType) {
		this.vendorType = vendorType;
	}

	@XmlElement(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@XmlElement(name = "employee_name")
	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	@XmlElement(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@XmlElement(name = "bank_branch_name")
	public String getBankBranchName() {
		return bankBranchName;
	}

	public void setBankBranchName(String bankBranchName) {
		this.bankBranchName = bankBranchName;
	}

	@XmlElement(name = "bank_name")
	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@XmlElement(name = "bank_num")
	public String getBankNum() {
		return bankNum;
	}

	public void setBankNum(String bankNum) {
		this.bankNum = bankNum;
	}

	@XmlElement(name = "last_update")
	public String getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(String lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	@XmlElement(name = "enable_flag")
	public String getEnableFlag() {
		return enableFlag;
	}

	public void setEnableFlag(String enableFlag) {
		this.enableFlag = enableFlag;
	}

	@XmlElement(name = "vendor_end_date_active")
	public String getVendorEndDateActive() {
		return vendorEndDateActive;
	}

	public void setVendorEndDateActive(String vendorEndDateActive) {
		this.vendorEndDateActive = vendorEndDateActive;
	}

	@XmlElement(name = "site_inactive_date")
	public String getSiteInactiveDate() {
		return siteInactiveDate;
	}

	public void setSiteInactiveDate(String siteInactiveDate) {
		this.siteInactiveDate = siteInactiveDate;
	}

	@XmlElement(name = "bank_inactive_date")
	public String getBankInactiveDate() {
		return bankInactiveDate;
	}

	public void setBankInactiveDate(String bankInactiveDate) {
		this.bankInactiveDate = bankInactiveDate;
	}

	@XmlElement(name = "area_code")
	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	@XmlElement(name = "vendor_tax_type")
	public String getVendorTaxType() {
		return vendorTaxType;
	}

	public void setVendorTaxType(String vendorTaxType) {
		this.vendorTaxType = vendorTaxType;
	}

	@XmlElement(name = "attribute1")
	public String getAttribute1() {
		return attribute1;
	}

	public void setAttribute1(String attribute1) {
		this.attribute1 = attribute1;
	}

	@XmlElement(name = "attribute2")
	public String getAttribute2() {
		return attribute2;
	}

	public void setAttribute2(String attribute2) {
		this.attribute2 = attribute2;
	}

	@Override
	public String toString() {
		return "VendorPo [extensionData=" + extensionData + ", orgId=" + orgId + ", vendorId=" + vendorId
				+ ", vendorSiteId=" + vendorSiteId + ", ouName=" + ouName + ", vendorName=" + vendorName
				+ ", vendorCode=" + vendorCode + ", vendorType=" + vendorType + ", address=" + address
				+ ", employeeName=" + employeeName + ", phone=" + phone + ", bankBranchName=" + bankBranchName
				+ ", bankName=" + bankName + ", bankNum=" + bankNum + ", lastUpdate=" + lastUpdate + ", enableFlag="
				+ enableFlag + ", vendorEndDateActive=" + vendorEndDateActive + ", siteInactiveDate=" + siteInactiveDate
				+ ", bankInactiveDate=" + bankInactiveDate + ", areaCode=" + areaCode + ", vendorTaxType="
				+ vendorTaxType + ", attribute1=" + attribute1 + ", attribute2=" + attribute2 + "]";
	}
	
}
