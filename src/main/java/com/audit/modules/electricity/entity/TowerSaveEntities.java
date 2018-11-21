package com.audit.modules.electricity.entity;

import java.util.Date;
import java.util.List;

/**
 * @author : jiadu
 * @Description : 保存铁塔电表
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerSaveEntities {

    private static final long serialVersionUID = -5359336196932507214L;
    private String id;
    private String serialNumber;//流水号
    private String sysTowerSitId;//铁塔站址ID
    private String sysTowerSitNo;//铁塔站址编号
    private String zgSpaceSiteName;//资管站点名称
    private String zgTowerSiteName;//铁塔地址名称
    private Integer status;//状态（0、等待提交审批 1、审批中 2、审批通过 3、审批驳回 4、报销中 5、报销成功 6、报销失败 7、已撤销 8、等待提交稽核）
    private String shareAmount;//分摊电费金额
    private Date createDate;//建单时间
    private String createPerson;//建单人ID
    private Date updateDate;//修改时间
    private String updatePerson;//修改人ID
    private Date submitDate;//提交时间
    private String submitPerson;//提交人ID
    private String areas;
    private String counties;

	private String overProoFreAsons;//超标原因
    private String costCenterID;//成本中心ID
    private String supplierName;//供应商
    private String remark;//备注
    private String isOnline;//稽核单在网状态

    public String getIsOnline() {
		return isOnline;
	}

	public void setIsOnline(String isOnline) {
		this.isOnline = isOnline;
	}

	public String getOverProoFreAsons() {
    	return overProoFreAsons;
    }
    
    public void setOverProoFreAsons(String overProoFreAsons) {
    	this.overProoFreAsons = overProoFreAsons;
    }
    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getCostCenterID() {
        return costCenterID;
    }

    public void setCostCenterID(String costCenterID) {
        this.costCenterID = costCenterID;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    private List<TowerWatthourMeterVO> towerWatthourMeterVOs;

    public List<TowerWatthourMeterVO> getTowerWatthourMeterVOs() {
        return towerWatthourMeterVOs;
    }

    public void setTowerWatthourMeterVOs(List<TowerWatthourMeterVO> towerWatthourMeterVOs) {
        this.towerWatthourMeterVOs = towerWatthourMeterVOs;
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

    public String getSysTowerSitId() {
        return sysTowerSitId;
    }

    public void setSysTowerSitId(String sysTowerSitId) {
        this.sysTowerSitId = sysTowerSitId;
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

    public String getZgTowerSiteName() {
        return zgTowerSiteName;
    }

    public void setZgTowerSiteName(String zgTowerSiteName) {
        this.zgTowerSiteName = zgTowerSiteName;
    }

    public String getShareAmount() {
        if(shareAmount!=null&&shareAmount.equals("NaN")){
            return null;
        }
        return shareAmount;
    }

    public void setShareAmount(String shareAmount) {
        this.shareAmount = shareAmount;
    }

    public String getUpdatePerson() {
        return updatePerson;
    }

    public void setUpdatePerson(String updatePerson) {
        this.updatePerson = updatePerson;
    }

    public Date getSubmitDate() {
        return submitDate;
    }

    public void setSubmitDate(Date submitDate) {
        this.submitDate = submitDate;
    }

    public String getCreatePerson() {
        return createPerson;
    }

    public void setCreatePerson(String createPerson) {
        this.createPerson = createPerson;
    }

    public String getSubmitPerson() {
        return submitPerson;
    }

    public void setSubmitPerson(String submitPerson) {
        this.submitPerson = submitPerson;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }


    public static long getSerialVersionUID() {
        return serialVersionUID;
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

    public Integer getStatus() {
        if (status == null) {
            status = 0;
        }
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
