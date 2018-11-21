package com.audit.modules.electricity.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.audit.modules.system.entity.SysFileVO;
import com.google.common.collect.Lists;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * @author : jiadu
 * @Description : 电费VO
 * @date : 2017/3/7
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ExpenseAccountDetails implements Serializable{

    private static final long serialVersionUID = -5359336196932507214L;
    private String taxAmount;//税金金额。。
    private String electricityAmount;//电费金额（不含税）。。
    private Date belongStartTime;//电费归属起始日期。。
    private Date belongEndTime;//电费归属终止日期。。
    private Integer dayAmmeter;//用电天数..
    private String startAmmeter;//用电起度（度）..
    private String endAmmeter;//用电止度（度）..
    private String totalEleciric;//总电量 ..
    private String electricLoss;//电损（度）..
    private String unitPrice;//单价(不含税）。。
    //private String totalAmount;//电表总金额
    private String counties;//区县。。
    private String accountName;//报账点名称。。
    private String otherCost;//其他费用。。
	private String totalAmount;//总金额(含税)。。
	private String totalAmountSum;//报账点总金额之和
    private String expenseTotalAmount;//报销总金额。。
    private String paymentAmount;//支付总金额。。
    private String supplierName;//供应商名称(收款单位)
    private String bankBranchName;//开户银行名
    private String bankNum;//银行账号
    private String purpose;//用途
    private String payer;//支付方
    private String contract;//合同
    private String entrust;//是否委托
    private String remark;//备注。。
     
	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
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

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public String getPayer() {
		return payer;
	}

	public void setPayer(String payer) {
		this.payer = payer;
	}

	public String getContract() {
		return contract;
	}

	public void setContract(String contract) {
		this.contract = contract;
	}

	public String getEntrust() {
		return entrust;
	}

	public void setEntrust(String entrust) {
		this.entrust = entrust;
	}

	public String getTotalAmountSum() {
		return totalAmountSum;
	}

	public void setTotalAmountSum(String totalAmountSum) {
		this.totalAmountSum = totalAmountSum;
	}

	public String getElectricLoss() {
		return electricLoss;
	}

	public void setElectricLoss(String electricLoss) {
		this.electricLoss = electricLoss;
	}

	public String getTotalEleciric() {
        return totalEleciric;
    }

    public void setTotalEleciric(String totalEleciric) {
        this.totalEleciric = totalEleciric;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }


    public static long getSerialVersionUID() {
        return serialVersionUID;
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

    public String getOtherCost() {
        return otherCost;
    }

    public void setOtherCost(String otherCost) {
        this.otherCost = otherCost;
    }

    public String getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(String totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getExpenseTotalAmount() {
        return expenseTotalAmount;
    }

    public void setExpenseTotalAmount(String expenseTotalAmount) {
        this.expenseTotalAmount = expenseTotalAmount;
    }

    public String getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(String paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    private Integer startRow;
    private Integer endRow;

    public Integer getStartRow() {
        return startRow;
    }

    public void setStartRow(Integer startRow) {
        this.startRow = startRow;
    }

    public Integer getEndRow() {
        return endRow;
    }

    public void setEndRow(Integer endRow) {
        this.endRow = endRow;
    }

	public Date getBelongStartTime() {
		return belongStartTime;
	}

	public void setBelongStartTime(Date belongStartTime) {
		this.belongStartTime = belongStartTime;
	}

	public Date getBelongEndTime() {
		return belongEndTime;
	}

	public void setBelongEndTime(Date belongEndTime) {
		this.belongEndTime = belongEndTime;
	}

	public Integer getDayAmmeter() {
		return dayAmmeter;
	}

	public void setDayAmmeter(Integer dayAmmeter) {
		this.dayAmmeter = dayAmmeter;
	}

	public String getStartAmmeter() {
		return startAmmeter;
	}

	public void setStartAmmeter(String startAmmeter) {
		this.startAmmeter = startAmmeter;
	}

	public String getEndAmmeter() {
		return endAmmeter;
	}

	public void setEndAmmeter(String endAmmeter) {
		this.endAmmeter = endAmmeter;
	}

	public String getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(String unitPrice) {
		this.unitPrice = unitPrice;
	}

}
