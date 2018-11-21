package com.audit.modules.electricity.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author : jiadu
 * @Description : 保存铁塔电表
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerSaveVO implements Serializable{

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

    private String costCenterID;//成本中心ID
    private String costCenterName;//成本中心名称
    private String contractNo;//合同编号
    private String supplierID;//供应商名称ID
    private String supplierCode;
    private String supplierName;//供应商名称（显示用）
    private Integer organizationCode;// 组织结构id
	private String regionCode;// 供应商地址
    private Integer isClud;//是否包干；1 包干；0 非包干
    private String totalEleciric;//总电量
    private String totalUnitPrice;//总单价(所有电表)
    private String totalShareProportion;//总电表平均分摊比例
    private String overProoFreAsons; //超标杆原因
    private String isOnline;//在网状态
    
    public String getIsOnline() {
		return isOnline;
	}

	public void setIsOnline(String isOnline) {
		this.isOnline = isOnline;
	}

	public String getOverProofReasons() {
		return overProoFreAsons;
	}

	public void setOverProofReasons(String overProofReasons) {
		this.overProoFreAsons = overProofReasons;
	}

	public String getTotalShareProportion() {
		return totalShareProportion;
	}

	public void setTotalShareProportion(String totalShareProportion) {
		this.totalShareProportion = totalShareProportion;
	}

	public String getTotalUnitPrice() {
		return totalUnitPrice;
	}
    
	public void setTotalUnitPrice(String totalUnitPrice) {
		this.totalUnitPrice = totalUnitPrice;
	}

	public String getTotalEleciric() {
        return totalEleciric;
    }

    public void setTotalEleciric(String totalEleciric) {
        this.totalEleciric = totalEleciric;
    }

    public String getSupplierCode() {
        return supplierCode;
    }

    public void setSupplierCode(String supplierCode) {
        this.supplierCode = supplierCode;
    }

    public String getSupplierID() {
        return supplierID;
    }

    public void setSupplierID(String supplierID) {
        this.supplierID = supplierID;
    }

    public String getCostCenterID() {
        return costCenterID;
    }

    public void setCostCenterID(String costCenterID) {
        this.costCenterID = costCenterID;
    }

    public Integer getIsClud() {
        return isClud;
    }

    public void setIsClud(Integer isClud) {
        this.isClud = isClud;
    }

    public List<TowerWatthourMeterVO> getTowerWatthourMeterVOs() {
        return towerWatthourMeterVOs;
    }

    public void setTowerWatthourMeterVOs(List<TowerWatthourMeterVO> towerWatthourMeterVOs) {
        this.towerWatthourMeterVOs = towerWatthourMeterVOs;
    }

    public String getCostCenterName() {
        return costCenterName;
    }

    public void setCostCenterName(String costCenterName) {
        this.costCenterName = costCenterName;
    }

    public String getContractNo() {
        return contractNo;
    }

    public void setContractNo(String contractNo) {
        this.contractNo = contractNo;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }


    private List<TowerWatthourMeterVO> towerWatthourMeterVOs ;

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
        if(status==null){
            status=0;
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

	public Integer getOrganizationCode() {
		return organizationCode;
	}

	public void setOrganizationCode(Integer organizationCode) {
		this.organizationCode = organizationCode;
	}

	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}
	
	
}
