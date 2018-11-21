package com.audit.modules.electricity.entity;

import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author : jiadu
 * @Description : 电表
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerWatthourMeterVO extends WatthourExtendVO implements Serializable {
    private static final long serialVersionUID = -1036337329841924808L;
    private String id; //电表ID
    private String code;//电表编号
    private String paymentAccountCode;// 电表缴费户号
    private Integer ptype;//电表类型。1 普通；2 智能
    private Integer status;//状态；1 正常；0 损坏
    private Double rate;//倍率
    private Double maxReading;//电表最大读数，发生翻表情况录入后记录
    private String electricLoss;//电损（度）
    private Integer whetherMeter;//是否翻表 (0.否1.是）
    private Date belongStartTime;//电费归属起始日期
    private Date belongEndTime;//电费归属终止日期
    private String belongEndTimeS;
    private String startAmmeter;//用电起度（度）
    private String endAmmeter;//用电止度（度）
    private String totalEleciric;//总电量
    private String payAmount;//缴费金额（元）
    private String unitPrice;//单价(不含税）
    private String otherAmount;//其他费用
    private String actualAmount;//实际支付电费
    private String shareProportion;//分摊比例
    private String shareAmount;//分摊电费金额
    private String payInvoiceType;//缴费发票类型
    private String payBillCoefficient;//缴费开票系数
    private String otherInvoiceType;//其他发票类型
    private String otherBillCoefficient;//其他开票系数
    private String watthourType;//电表状态（铁塔站址编码带出电表时使用）
    
    public String getWatthourType() {
		return watthourType;
	}

	public void setWatthourType(String watthourType) {
		this.watthourType = watthourType;
	}

	public String getBelongEndTimeS() {
		return belongEndTimeS;
	}

	public void setBelongEndTimeS(String belongEndTimeS) {
		this.belongEndTimeS = belongEndTimeS;
	}

	public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    @Override
    public Integer getStatus() {
        return status;
    }

    @Override
    public void setStatus(Integer status) {
        this.status = status;
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

    @Override
    public String getElectricLoss() {
        return electricLoss;
    }

    @Override
    public void setElectricLoss(String electricLoss) {
        this.electricLoss = electricLoss;
    }

    @Override
    public Integer getWhetherMeter() {
        return whetherMeter;
    }

    @Override
    public void setWhetherMeter(Integer whetherMeter) {
        this.whetherMeter = whetherMeter;
    }

    @Override
    public Date getBelongStartTime() {
        return belongStartTime;
    }

    @Override
    public void setBelongStartTime(Date belongStartTime) {
        this.belongStartTime = belongStartTime;
    }

    @Override
    public Date getBelongEndTime() {
        return belongEndTime;
    }

    @Override
    public void setBelongEndTime(Date belongEndTime) {
        this.belongEndTime = belongEndTime;
    }

    @Override
    public String getStartAmmeter() {
        return startAmmeter;
    }

    @Override
    public void setStartAmmeter(String startAmmeter) {
        this.startAmmeter = startAmmeter;
    }

    @Override
    public String getEndAmmeter() {
        return endAmmeter;
    }

    @Override
    public void setEndAmmeter(String endAmmeter) {
        this.endAmmeter = endAmmeter;
    }

    @Override
    public String getTotalEleciric() {
        return totalEleciric;
    }

    @Override
    public void setTotalEleciric(String totalEleciric) {
        this.totalEleciric = totalEleciric;
    }

    public String getPayAmount() {
        return payAmount;
    }

    public void setPayAmount(String payAmount) {
        this.payAmount = payAmount;
    }

    @Override
    public String getUnitPrice() {
        return unitPrice;
    }

    @Override
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

    public String getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(String shareAmount) {
        this.shareAmount = shareAmount;
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
}
