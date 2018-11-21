package com.audit.modules.electricity.entity;

import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : jiadu
 * @Description : 电费列表显示VO
 * @date : 2017/3/7
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ElectrictyListVO implements Serializable {

    private static final long serialVersionUID = -5359336196932507214L;
    private String id;
    private String serialNumber;//流水号
    private String areas;//地区
    private String counties;//区县
    private String accountName;//报账点名称
    private String electricity;//电量
    private String amount;//金额(总金额（含税）)
    private Integer status;//状态（0.保存 1.提交）
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date createDate;//建单时间
    private String price;//单价
    private String supplierName;//供应商名称
    private String createPersonName; //经办人名称
    private String siteID;
    private String rolelevel;
    private String dec;
    

    public String getDec() {
		return dec;
	}

	public void setDec(String dec) {
		this.dec = dec;
	}

	public String getRolelevel() {
		return rolelevel;
	}

	public void setRolelevel(String rolelevel) {
		this.rolelevel = rolelevel;
	}

	public String getSiteID() {
        return siteID;
    }

    public void setSiteID(String siteID) {
        this.siteID = siteID;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
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

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getElectricity() {
        return electricity;
    }

    public void setElectricity(String electricity) {
        this.electricity = electricity;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public Integer getStatus() {
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

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

	public String getCreatePersonName() {
		return createPersonName;
	}

	public void setCreatePersonName(String createPersonName) {
		this.createPersonName = createPersonName;
	}
}
