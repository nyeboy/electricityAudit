package com.audit.modules.basedata.entity;

/**   
 * @Description : TODO(供应商信息管理)    
 *
 * @author : 
 * @date : 2017年4月20日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class SupplierManage {
		
		//id
		private String id;
	    //供应商名称
		private String name;
		//供应商id
		private Integer code;
		//组织结构id
		private Integer organizationCode;
	    //分公司名称
	    private String ouName;
	    //供应商编码
	    private String vendorCode;
	    //供应商地址
	    private String address;
	    //银行名称
	    private String bankBranchName;
	    //开户账号
	    private String bankNum;
	    //报账点名称
	    private String accountName;
	    //供应商地点id
	    private String regionCode;
	    //合同id
	    private String contractId;
	    
		public String getContractId() {
			return contractId;
		}
		public void setContractId(String contractId) {
			this.contractId = contractId;
		}
		public String getRegionCode() {
			return regionCode;
		}
		public void setRegionCode(String regionCode) {
			this.regionCode = regionCode;
		}
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public Integer getCode() {
			return code;
		}
		public void setCode(Integer code) {
			this.code = code;
		}
		public Integer getOrganizationCode() {
			return organizationCode;
		}
		public void setOrganizationCode(Integer organizationCode) {
			this.organizationCode = organizationCode;
		}
		public String getOuName() {
			return ouName;
		}
		public void setOuName(String ouName) {
			this.ouName = ouName;
		}
		public String getVendorCode() {
			return vendorCode;
		}
		public void setVendorCode(String vendorCode) {
			this.vendorCode = vendorCode;
		}
		public String getAddress() {
			return address;
		}
		public void setAddress(String address) {
			this.address = address;
		}
		public String getBankBranchName() {
			return bankBranchName;
		}
		public void setBankBranchName(String bankBranchName) {
			this.bankBranchName = bankBranchName;
		}
		public String getBankNum() {
			return bankNum;
		}
		public void setBankNum(String bankNum) {
			this.bankNum = bankNum;
		}
		public String getAccountName() {
			return accountName;
		}
		public void setAccountName(String accountName) {
			this.accountName = accountName;
		}
	    
	    
	    
}
