package com.audit.modules.report.entity;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 
 * @Description: 基站超额定功率标杆占比情况   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月27日 下午10:05:36
 */
public class BeyondSwiRate {
	private BigDecimal id;

	private String cityId;

	private String countyId;
	// 城市名 或 区县名
	private String regionName;
	// 统计时间
	private Date createTime;
	// 超额定功率比例
	private String supperCount;
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

	public String getSupperCount() {
		return supperCount;
	}

	public void setSupperCount(String supperCount) {
		this.supperCount = supperCount == null ? null : supperCount.trim();
	}

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode == null ? null : typeCode.trim();
	}
}