package com.audit.modules.electricity.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerElectrictyExcelVO implements Serializable{

    private static final long serialVersionUID = 2295653330732063137L;
    private String id;
    private String serialNumber;//稽核单流水号
    private String zgTowerSiteName;//铁塔地址名称
    private Integer status;//状态
    private String submitPerson;//提交人
    private String areas;//市
    private String counties;//区县
    private String sysTowerSitNo;//铁塔站址编号
    private String zgSpaceSiteName;//资管站点名称
    private String totalEleciric;//总电量
    private String totalAmount;//缴费金额(总金额)
    private String contractName;//合同名称
    private Date createDate;//建单时间
    private String createPerson;//建单人
    private String supplierName;//供应商名称
    private String supplierID;//供应商ID
    private String costCenterName;//成本中心名称
    private String contractNo;//合同编号
    
    private Integer isClud;//是否包干；1 包干；0 非包干
    private String shareAmount;//分摊电费金额 
    private String shareAmountSum;//分摊电费总金额 
    private String regionCode;// 供应商地点Id
   
    private String code;//电表编号
    private String paymentAccountCode;// 电表缴费户号
    private Integer ptype;//电表类型。1 普通；2 智能
    private Double rate;//倍率
    private Double maxReading;//电表最大读数，发生翻表情况录入后记录
    private String electricLoss;//电损（度）
    private Integer whetherMeter;//是否翻表 (0.否1.是）
    private Date belongStartTime;//电费归属起始日期
    private Date belongEndTime;//电费归属终止日期
    private String startAmmeter;//用电起度（度）
    private String endAmmeter;//用电止度（度）
    private String payAmount;//缴费金额（元）
    private String unitPrice;//单价(不含税）
    private String otherAmount;//其他费用
    private String actualAmount;//实际支付电费
    private String shareProportion;//分摊比例
    private String payInvoiceType;//缴费发票类型
    private String payBillCoefficient;//缴费开票系数
    private String otherInvoiceType;//其他发票类型
    private String otherBillCoefficient;//其他开票系数
    
    public String getShareAmountSum() {
		return shareAmountSum;
	}

	public void setShareAmountSum(String shareAmountSum) {
		this.shareAmountSum = shareAmountSum;
	}

	public Integer getIsClud() {
		return isClud;
	}

	public void setIsClud(Integer isClud) {
		this.isClud = isClud;
	}

	public String getShareAmount() {
		return shareAmount;
	}

	public void setShareAmount(String shareAmount) {
		this.shareAmount = shareAmount;
	}

	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getPaymentAccountCode() {
		return paymentAccountCode;
	}

	public void setPaymentAccountCode(String paymentAccountCode) {
		this.paymentAccountCode = paymentAccountCode;
	}

	public Integer getPtype() {
		return ptype;
	}

	public void setPtype(Integer ptype) {
		this.ptype = ptype;
	}

	public Double getRate() {
		return rate;
	}

	public void setRate(Double rate) {
		this.rate = rate;
	}

	public Double getMaxReading() {
		return maxReading;
	}

	public void setMaxReading(Double maxReading) {
		this.maxReading = maxReading;
	}

	public String getElectricLoss() {
		return electricLoss;
	}

	public void setElectricLoss(String electricLoss) {
		this.electricLoss = electricLoss;
	}

	public Integer getWhetherMeter() {
		return whetherMeter;
	}

	public void setWhetherMeter(Integer whetherMeter) {
		this.whetherMeter = whetherMeter;
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

	public String getPayAmount() {
		return payAmount;
	}

	public void setPayAmount(String payAmount) {
		this.payAmount = payAmount;
	}

	public String getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(String unitPrice) {
		this.unitPrice = unitPrice;
	}

	public String getOtherAmount() {
		return otherAmount;
	}

	public void setOtherAmount(String otherAmount) {
		this.otherAmount = otherAmount;
	}

	public String getActualAmount() {
		return actualAmount;
	}

	public void setActualAmount(String actualAmount) {
		this.actualAmount = actualAmount;
	}

	public String getShareProportion() {
		return shareProportion;
	}

	public void setShareProportion(String shareProportion) {
		this.shareProportion = shareProportion;
	}

	public String getPayInvoiceType() {
		return payInvoiceType;
	}

	public void setPayInvoiceType(String payInvoiceType) {
		this.payInvoiceType = payInvoiceType;
	}

	public String getPayBillCoefficient() {
		return payBillCoefficient;
	}

	public void setPayBillCoefficient(String payBillCoefficient) {
		this.payBillCoefficient = payBillCoefficient;
	}

	public String getOtherInvoiceType() {
		return otherInvoiceType;
	}

	public void setOtherInvoiceType(String otherInvoiceType) {
		this.otherInvoiceType = otherInvoiceType;
	}

	public String getOtherBillCoefficient() {
		return otherBillCoefficient;
	}

	public void setOtherBillCoefficient(String otherBillCoefficient) {
		this.otherBillCoefficient = otherBillCoefficient;
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
