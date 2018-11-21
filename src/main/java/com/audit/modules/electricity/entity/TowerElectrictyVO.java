package com.audit.modules.electricity.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerElectrictyVO implements Serializable{

    private static final long serialVersionUID = 2295653330732063137L;
    private String id;
    private String serialNumber;//稽核单流水号
    private String zgTowerSiteName;//铁塔地址名称
    private Integer status;//状态（0.已保存1.已提交 2.已撤销 3.待推送 4.已推送 5.待经办)
    private String submitPerson;//提交人
    private String areas;//市
    private String counties;//区县
    private String sysTowerSitNo;//铁塔站址编号
    private String zgSpaceSiteName;//资管站点名称
    private String totalEleciric;//总电量
    private String totalAmount;//缴费金额
    private String contractName;//合同名称
    private Date createDate;//建单时间
    private String createPerson;//建单人
    private String supplierName;//供应商名称
    private String supplierID;//供应商ID
    private String costCenterName;//成本中心名称
    private String contractNo;//合同编号
    private String overProOfReasons;//超标信息

    public String getOverProOfReasons() {
		return overProOfReasons;
	}

	public void setOverProOfReasons(String overProOfReasons) {
		this.overProOfReasons = overProOfReasons;
	}

	public String getCreatePerson() {
		return createPerson;
	}

	public void setCreatePerson(String createPerson) {
		this.createPerson = createPerson;
	}

	public String getContractNo() {
        return contractNo;
    }

    public void setContractNo(String contractNo) {
        this.contractNo = contractNo;
    }

    public String getCostCenterName() {
        return costCenterName;
    }

    public void setCostCenterName(String costCenterName) {
        this.costCenterName = costCenterName;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getSupplierID() {
        return supplierID;
    }

    public void setSupplierID(String supplierID) {
        this.supplierID = supplierID;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getContractName() {
        return contractName;
    }

    public void setContractName(String contractName) {
        this.contractName = contractName;
    }

    public String getTotalEleciric() {
        return totalEleciric;
    }

    public void setTotalEleciric(String totalEleciric) {
        this.totalEleciric = totalEleciric;
    }

    public String getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(String totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getSysTowerSitNo() {
        return sysTowerSitNo;
    }

    public void setSysTowerSitNo(String sysTowerSitNo) {
        this.sysTowerSitNo = sysTowerSitNo;
    }

    public String getZgSpaceSiteName() {
        return zgSpaceSiteName;
    }

    public void setZgSpaceSiteName(String zgSpaceSiteName) {
        this.zgSpaceSiteName = zgSpaceSiteName;
    }

    public String getAreas() {
        return areas;
    }

    public void setAreas(String areas) {
        this.areas = areas;
    }

    public String getCounties() {
        return counties;
    }

    public void setCounties(String counties) {
        this.counties = counties;
    }

    public String getSubmitPerson() {
        return submitPerson;
    }

    public void setSubmitPerson(String submitPerson) {
        this.submitPerson = submitPerson;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getZgTowerSiteName() {
        return zgTowerSiteName;
    }

    public void setZgTowerSiteName(String zgTowerSiteName) {
        this.zgTowerSiteName = zgTowerSiteName;
    }
}
