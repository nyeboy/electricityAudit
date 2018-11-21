package com.audit.modules.towerReport.entity;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 
 * @Description: 站点开关电源监控完好率、可用率统计   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月27日 下午10:11:04
 */
public class SiteSwitchRateTower {

	private BigDecimal id;

	private String cityId;
	// 动环网现有站点数
	private String crossSiteAmount;
	
	private String countyId;
	// 城市名 或 区县名
	private String regionName;
	// 统计时间
	private Date createTime;
	// 开关电源监控完好率
	private String intactRate;
	// 开关电源可用率
	private String availableRate;
	// 0：表示存的是市级数据
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

	public String getIntactRate() {
		return intactRate;
	}

	public void setIntactRate(String intactRate) {
		this.intactRate = intactRate == null ? null : intactRate.trim();
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

	public String getCrossSiteAmount() {
		return crossSiteAmount;
	}

	public void setCrossSiteAmount(String crossSiteAmount) {
		this.crossSiteAmount = crossSiteAmount;
	}
}