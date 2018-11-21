package com.audit.modules.electricity.entity;

import java.io.Serializable;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerElectrictyEntities{

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
    private String supplierName;//供应商名称
    private String startTime;//开始时间（yyyy-MM-dd）
    private String endTime;//截至时间（yyyy-MM-dd）
   
    private String cityId;//地市ID
    private String countyId;//区县ID
    private String flowState;//状态(查询条件状态（0、等待提交审批 1、审批中 2、审批通过 3、审批驳回 4、报销中 5、报销成功 6、报销失败 7、已撤销 8、等待提交稽核)

    private String[] statuses ;

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

	public String getFlowState() {
		return flowState;
	}

	public void setFlowState(String flowState) {
		this.flowState = flowState;
	}

	public String[] getStatuses() {
        return statuses;
    }

    public void setStatuses(String[] statuses) {
        this.statuses = statuses;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
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
