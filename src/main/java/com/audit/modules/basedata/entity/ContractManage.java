package com.audit.modules.basedata.entity;

/**   
 * @Description : TODO(合同信息管理)    
 *
 * @author : 
 * @date : 2017年8月22日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class ContractManage {
		
		//id
		private String id;
	    //合同名称
		private String name;
		//合同生效日期
		private String startDate;
		//合同终止日期
		private String endDate;
	    //是否包干
	    private Integer isClud;
	    //包干价
	    private Integer cludPrice;
	    //缴费周期
	    private Integer paymentCycle;
	    //单价
	    private double price;
	    
	    //(现在在使用的)
	    private String executionBeginDate;//新版合同生效时间
	    private String executionEndDate;//新版合同终止时间
	    private double priceOrLumpSumPrice;//单价或包干价(大于20即包干价)
	    private String vendorName;//供应商名称
	    private String vendorId;//供应商CODE
	    private String assetManagementSiteName;//资管站点名称
	    private String contractNumber;//合同编号
	    private String isUploadOverproof;//是否上传超标审批记录( 有(0)、无(1))
	    private double unitPrice;//区域直供电单价 
	    private String supplierId;//供应商ID
	    private String supplierRegionCode; //供应商地点id
	    	    	    
		public String getSupplierRegionCode() {
			return supplierRegionCode;
		}
		public void setSupplierRegionCode(String supplierRegionCode) {
			this.supplierRegionCode = supplierRegionCode;
		}
		public String getSupplierId() {
			return supplierId;
		}
		public void setSupplierId(String supplierId) {
			this.supplierId = supplierId;
		}
		public String getVendorId() {
			return vendorId;
		}
		public void setVendorId(String vendorId) {
			this.vendorId = vendorId;
		}
		public double getUnitPrice() {
			return unitPrice;
		}
		public void setUnitPrice(double unitPrice) {
			this.unitPrice = unitPrice;
		}
		public String getIsUploadOverproof() {
			return isUploadOverproof;
		}
		public void setIsUploadOverproof(String isUploadOverproof) {
			this.isUploadOverproof = isUploadOverproof;
		}
		public String getAssetManagementSiteName() {
			return assetManagementSiteName;
		}
		public void setAssetManagementSiteName(String assetManagementSiteName) {
			this.assetManagementSiteName = assetManagementSiteName;
		}
		public String getContractNumber() {
			return contractNumber;
		}
		public void setContractNumber(String contractNumber) {
			this.contractNumber = contractNumber;
		}
		public String getExecutionBeginDate() {
			return executionBeginDate;
		}
		public void setExecutionBeginDate(String executionBeginDate) {
			this.executionBeginDate = executionBeginDate;
		}
		public String getExecutionEndDate() {
			return executionEndDate;
		}
		public void setExecutionEndDate(String executionEndDate) {
			this.executionEndDate = executionEndDate;
		}
		public double getPriceOrLumpSumPrice() {
			return priceOrLumpSumPrice;
		}
		public void setPriceOrLumpSumPrice(double priceOrLumpSumPrice) {
			this.priceOrLumpSumPrice = priceOrLumpSumPrice;
		}
		public String getVendorName() {
			return vendorName;
		}
		public void setVendorName(String vendorName) {
			this.vendorName = vendorName;
		}
		public double getPrice() {
			return price;
		}
		public void setPrice(double price) {
			this.price = price;
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
		public Integer getIsClud() {
			return isClud;
		}
		public void setIsClud(Integer isClud) {
			this.isClud = isClud;
		}
		public Integer getCludPrice() {
			return cludPrice;
		}
		public void setCludPrice(Integer cludPrice) {
			this.cludPrice = cludPrice;
		}
		public Integer getPaymentCycle() {
			return paymentCycle;
		}
		public void setPaymentCycle(Integer paymentCycle) {
			this.paymentCycle = paymentCycle;
		}
	    		    
}
