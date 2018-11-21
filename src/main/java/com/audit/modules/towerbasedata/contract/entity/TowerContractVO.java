package com.audit.modules.towerbasedata.contract.entity;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author : bingliup
 * @Description : tower合同VO
 * @date : 2017/4/30
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerContractVO implements Serializable {

	private static final long serialVersionUID = 6171339883888912838L;

	private String cityId;// 市ID
	private String cityStr;// 城市名
	private String countyStr;// 区县名
	private String countyId; // 区县ID
	private String code;// 铁塔站点编码
	private String label;// 资管站点名称
	private String id;//  合同id
	private String contractNo;// 合同编号
	private String name;// 合同名称
	private Date startDate;// 合同生效日期
	private Date endDate;// 合同终止日期
	private String isClud;// 是否包干（1 包干；0 非包干）
	private String cludPrice;// 包干价
	private String paymentCycle;// 续费周期；1 月；3 季度；6 半年；12 年；
	private String unitPrice;// 单价（不含税)
	private String zyName;

	public String getZyName() {
		return zyName;
	}

	public void setZyName(String zyName) {
		this.zyName = zyName;
	}

	public String getCityStr() {
		return cityStr;
	}

	public String getCountyStr() {
		return countyStr;
	}

	public String getContractNo() {
		return contractNo;
	}

	public void setContractNo(String contractNo) {
		this.contractNo = contractNo;
	}

	public void setCityStr(String cityStr) {
		this.cityStr = cityStr;
	}

	public void setCountyStr(String countyStr) {
		this.countyStr = countyStr;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getCludPrice() {
		return cludPrice;
	}

	public void setCludPrice(String cludPrice) {
		this.cludPrice = cludPrice;
	}

	public String getPaymentCycle() {
		return paymentCycle;
	}

	public void setPaymentCycle(String paymentCycle) {
		switch (paymentCycle){
			case "月":this.paymentCycle="1";break;
			case "季度":this.paymentCycle="3";break;
			case "半年":this.paymentCycle="6";break;
			case "年":this.paymentCycle="12";break;
			default:this.paymentCycle=paymentCycle;
		}
	}

	public String getIsClud() {
		return isClud;
	}

	public void setIsClud(String isClud) {
		switch (isClud){
			case "是":this.isClud="1";break;
			case "否":this.isClud="0";break;
			default:this.isClud=isClud;
		}
	}

	public String getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(String unitPrice) {
		this.unitPrice = unitPrice;
	}

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

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
}
