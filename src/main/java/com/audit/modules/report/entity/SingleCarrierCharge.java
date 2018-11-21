package com.audit.modules.report.entity;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 
 * @Description: 单载波电费情况   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月27日 下午10:08:10
 */
public class SingleCarrierCharge {
	
	private BigDecimal id;

	private String cityId;

	private String countyId;
	// 城市名 或 区县名
	private String regionName;
	// 统计时间
	private Date createTime;
	// 单载波电费（元）
	private String scecCharge;
	// 0：表示存的是市级数据
	private String typeCode;
	// 年
	private String year;
	// 全省平均单载波电费
	private String singleMoney;


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

	public String getScecCharge() {
		return scecCharge;
	}

	public void setScecCharge(String scecCharge) {
		this.scecCharge = scecCharge == null ? null : scecCharge.trim();
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

	public String getSingleMoney() {
		return singleMoney;
	}

	public void setSingleMoney(String singleMoney) {
		this.singleMoney = singleMoney;
	}
	
}