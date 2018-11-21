package com.audit.modules.electricity.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.google.common.collect.Lists;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/12
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ElectricyBaseVO implements Serializable{

	private static final long serialVersionUID = -2309573907451709767L;
	private Integer isClud;// 是否包干；1 包干；0 非包干
	private String unitPrice;// 单价
	private String cludPrice;// 包干价
	private String supplierName;// 供应商名称
	private String supplierID;// 供应商ID
    private String supplierCode;//供应商No
	private Integer organizationCode;// 组织结构id
	private String regionCode;// 供应商地址
	private Date createDate;// 上次报销单生成时间
	private String siteID;//报账点ID

    private List<WatthourMeterVO> watthourMeterVOs = Lists.newArrayList();//电表信息
    private BenchmarkVO benchmarkVO;//超标杆信息

    public String getSiteID() {
		return siteID;
	}

	public void setSiteID(String siteID) {
		this.siteID = siteID;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
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

    public List<WatthourMeterVO> getWatthourMeterVOs() {
        return watthourMeterVOs;
    }

    public void setWatthourMeterVOs(List<WatthourMeterVO> watthourMeterVOs) {
        this.watthourMeterVOs = watthourMeterVOs;
    }

    public Integer getIsClud() {
        return isClud;
    }

    public void setIsClud(Integer isClud) {
        this.isClud = isClud;
    }

    public String getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(String unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getCludPrice() {
        return cludPrice;
    }

    public void setCludPrice(String cludPrice) {
        this.cludPrice = cludPrice;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public BenchmarkVO getBenchmarkVO() {
        return benchmarkVO;
    }

    public void setBenchmarkVO(BenchmarkVO benchmarkVO) {
        this.benchmarkVO = benchmarkVO;
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
