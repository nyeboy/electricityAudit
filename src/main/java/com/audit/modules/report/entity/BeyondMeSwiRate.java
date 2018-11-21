package com.audit.modules.report.entity;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 
 * @Description: 超智能电表标杆、超开关电源标杆值情况
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月27日 下午9:46:04
 */
public class BeyondMeSwiRate {

	private BigDecimal id;

	private String cityId;

	private String countyId;
	// 城市名 或 区县名
	private String regionName;
	// 统计时间
	private Date createTime;
	// 超智能电表标杆值比例
	private String supperSmeter;
	// 超电源开关标杆值比例
	private String supperSwith;
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

	public String getSupperSmeter() {
		return supperSmeter;
	}

	public void setSupperSmeter(String supperSmeter) {
		this.supperSmeter = supperSmeter == null ? null : supperSmeter.trim();
	}

	public String getSupperSwith() {
		return supperSwith;
	}

	public void setSupperSwith(String supperSwith) {
		this.supperSwith = supperSwith == null ? null : supperSwith.trim();
	}

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode == null ? null : typeCode.trim();
	}
}