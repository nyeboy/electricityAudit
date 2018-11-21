package com.audit.modules.towerReport.entity;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 
 * @Description: 资管、财务系统基站名称一致性   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月27日 下午10:34:09
 */
public class FinConsistencyTower {
	private BigDecimal id;

	private String cityId;

	private String countyId;
	// 城市名 或 区县名
	private String regionName;

	private Date createTime;
	// 财务系统站点数
	private String financialSite;
	// 匹配成功资管数据
	private String successAmounts;
	// "0"：表示存的是市级数据
	private String typeCode;
	// 匹配成功比例
	private String successRate;
	// 平均匹配比例
	private String avarageRate;

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

	public String getFinancialSite() {
		return financialSite;
	}

	public void setFinancialSite(String financialSite) {
		this.financialSite = financialSite == null ? null : financialSite.trim();
	}

	public String getSuccessAmounts() {
		return successAmounts;
	}

	public void setSuccessAmounts(String successAmounts) {
		this.successAmounts = successAmounts == null ? null : successAmounts.trim();
	}

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode == null ? null : typeCode.trim();
	}

	public String getSuccessRate() {
		return successRate;
	}

	public void setSuccessRate(String successRate) {
		this.successRate = successRate;
	}

	public String getavarageRate() {
		return avarageRate;
	}

	public void setAvarageRate(String avarageRate) {
		this.avarageRate = avarageRate;
	}
}