package com.audit.modules.towerbasedata.powerrate.entity;

import java.util.Date;

/**   
 * @Description : TODO(额定功率信息管理)    
 *
 * @author : bingliup
 * @date : 2017年4月30日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class TowerPowerRateVO {

	// 表标识ID
	private String id;
	// 设备类型
	private String deviceType;
	// 设备型号
	private String deviceModel;
	// 生产厂家
	private String deviceVendor;
	// 额定功率
	private String powerRating;
	// 更新时间
	private Date updateDate;
	// 城市名
	private String cityStr;
	// 区县名
	private String countyStr;
	// 市ID
	private String cityId;
	// 区县ID
	private String countyId;
	
	private String updateDateStr;
	
	

	public String getUpdateDateStr() {
		return updateDateStr;
	}

	public void setUpdateDateStr(String updateDateStr) {
		this.updateDateStr = updateDateStr;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPowerRating() {
		return powerRating;
	}

	public void setPowerRating(String powerRating) {
		this.powerRating = powerRating;
	}

	public String getDeviceType() {
		return deviceType;
	}

	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}

	public String getDeviceModel() {
		return deviceModel;
	}

	public void setDeviceModel(String deviceModel) {
		this.deviceModel = deviceModel;
	}

	public String getDeviceVendor() {
		return deviceVendor;
	}

	public void setDeviceVendor(String deviceVendor) {
		this.deviceVendor = deviceVendor;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
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

	public String getCityStr() {
		return cityStr;
	}

	public String getCountyStr() {
		return countyStr;
	}

	public void setCityStr(String cityStr) {
		this.cityStr = cityStr;
	}

	public void setCountyStr(String countyStr) {
		this.countyStr = countyStr;
	}

}
