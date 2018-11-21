package com.audit.modules.towerReport.entity;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 
 * @Description: 电费占收比、占支比
 * @throws
 * 
 * 			@author
 *             杨芃
 * @date 2017年4月27日 下午10:06:10
 */
public class ECScareTower {
	private BigDecimal id;

	private String cityId;

	private String countyId;
	// 城市名 或 区县名
	private String regionName;
	// 统计时间
	private Date stasticTime;
	// 占总收入比例
	private String incomeScare;
	// 占总支出比例
	private String costScare;
	// 0：表示存的是市级数据
	private String typeCode;
	// 平均占收入比例
	private String avarageIncomeScare;
	// 平均占投入比例
	private String avarageCostScare;
	// 年
	private String year;

	public String getAvarageIncomeScare() {
		return avarageIncomeScare;
	}

	public void setAvarageIncomeScare(String avarageIncomeScare) {
		this.avarageIncomeScare = avarageIncomeScare;
	}

	public String getAvarageCostScare() {
		return avarageCostScare;
	}

	public void setAvarageCostScare(String avarageCostScare) {
		this.avarageCostScare = avarageCostScare;
	}

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

	public Date getStasticTime() {
		return stasticTime;
	}

	public void setStasticTime(Date stasticTime) {
		this.stasticTime = stasticTime;
	}

	public String getIncomeScare() {
		return incomeScare;
	}

	public void setIncomeScare(String incomeScare) {
		this.incomeScare = incomeScare == null ? null : incomeScare.trim();
	}

	public String getCostScare() {
		return costScare;
	}

	public void setCostScare(String costScare) {
		this.costScare = costScare == null ? null : costScare.trim();
	}

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode == null ? null : typeCode.trim();
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}
}