package com.audit.modules.electricity.entity;

import java.io.Serializable;

/**
 * @author : jiadu
 * @Description : 自维电费与发票中间表
 * @date : 2017/4/24
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ElectrictyMidInvoice implements Serializable{

    private static final long serialVersionUID = 8506985158532026766L;

    private String id;
    private String sysElectricityId;//自维电费ID
    private String invoiceId;//发票类型ID
    private String taxAmount;//税金金额
    private String electricityAmount;//电费金额
    private String billType;//发票类型
    private String billTax;//发票税率

    public String getBillType() {
        return billType;
    }

    public void setBillType(String billType) {
        this.billType = billType;
    }

    public String getBillTax() {
        return billTax;
    }

    public void setBillTax(String billTax) {
        this.billTax = billTax;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSysElectricityId() {
        return sysElectricityId;
    }

    public void setSysElectricityId(String sysElectricityId) {
        this.sysElectricityId = sysElectricityId;
    }

    public String getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(String invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(String taxAmount) {
        this.taxAmount = taxAmount;
    }

    public String getElectricityAmount() {
        return electricityAmount;
    }

    public void setElectricityAmount(String electricityAmount) {
        this.electricityAmount = electricityAmount;
    }
}
