package com.audit.modules.towerReport.entity;

import java.math.BigDecimal;
import java.util.Date;
/**
 * 
 * @Description: 智能电表接入率、可用率   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月27日 下午10:53:47
 */
public class SmartUsableTower {
	private BigDecimal id;

	private String cityId;

	private String countyId;

	private String regionName;

	private Date createTime;
	// 智能电表接入率
	private String accessRate;
	// 智能电表可用率
	private String availableRate;
	// "0"：表示存的是市级数据
	private String typeCode;

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

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getAccessRate() {
		return accessRate;
	}

	public void setAccessRate(String accessRate) {
		this.accessRate = accessRate == null ? null : accessRate.trim();
	}

	public String getAvailableRate() {
		return availableRate;
	}

	public void setAvailableRate(String availableRate) {
		this.availableRate = availableRate == null ? null : availableRate.trim();
	}

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode == null ? null : typeCode.trim();
	}
}