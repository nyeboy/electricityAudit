package com.audit.modules.invoice.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : jiadu
 * @Description : 发票VO
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class InvoiceVO implements Serializable{
    private static final long serialVersionUID = 7316238242003731416L;
    private String id; //主键;
    private String billTax;//税率
    private String billType;//发票类型
    private String billCoefficient;//开票系数
    private Date createDate;//创建时间
    private Date modifyDate;//修改时间
    private int count;
    private String createDateStr;//创建时间Str

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBillTax() {
        return billTax;
    }

    public void setBillTax(String billTax) {
        this.billTax = billTax;
    }

    public String getBillType() {
        return billType;
    }

    public void setBillType(String billType) {
        this.billType = billType;
    }

    public String getBillCoefficient() {
        return billCoefficient;
    }

    public void setBillCoefficient(String billCoefficient) {
        this.billCoefficient = billCoefficient;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getModifyDate() {
        return modifyDate;
    }

    public void setModifyDate(Date modifyDate) {
        this.modifyDate = modifyDate;
    }

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public String getCreateDateStr() {
		return createDateStr;
	}

	public void setCreateDateStr(String createDateStr) {
		this.createDateStr = createDateStr;
	}
    
}
