package com.audit.modules.report.entity;

import java.math.BigDecimal;

/**
 * 
 * @Description: 电费单价占比
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月27日 下午10:37:05
 */
public class UnitPrice {
	private BigDecimal id;

	private String cityId;

	private String countyId;

	private String regionName;

	private String year;
	// 1.3元以上的占比
	private String highCharge;
	// 1-1.3元占比
	private String midCharge;
	// <1元占比
	private String lowCharge;
	// "0"：表示存的是市级数据
	private String typeCode;
	//"0":直供电；"1":转供电
	private String supplyType;

	public BigDecimal getId() {
		return id;
	}

	public void setId(BigDecimal id) {
		this.id = id;
	}

	public String getCityId() {
		return cityId;
	}

	public void setCityId(String cityId) {
		this.cityId = cityId == null ? null : cityId.trim();
	}

	public String getCountyId() {
		return countyId;
	}

	public void setCountyId(String countyId) {
		this.countyId = countyId == null ? null : countyId.trim();
	}

	public String getRegionName() {
		return regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName == null ? null : regionName.trim();
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getHighCharge() {
		return highCharge;
	}

	public void setHighCharge(String highCharge) {
		this.highCharge = highCharge == null ? null : highCharge.trim();
	}

	public String getMidCharge() {
		return midCharge;
	}

	public void setMidCharge(String midCharge) {
		this.midCharge = midCharge == null ? null : midCharge.trim();
	}

	public String getLowCharge() {
		return lowCharge;
	}

	public void setLowCharge(String lowCharge) {
		this.lowCharge = lowCharge == null ? null : lowCharge.trim();
	}

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode == null ? null : typeCode.trim();
	}
	public String getSupplyType() {
		return supplyType;
	}

	public void setSupplyType(String supplyType) {
		this.supplyType = supplyType == null ? null : supplyType.trim();
	}
}