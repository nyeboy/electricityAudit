package com.audit.modules.basedata.entity;

/**   
 * @Description : TODO(额定功率信息管理)    
 *
 * @author : 
 * @date : 2017年4月20日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class PowerRateManage {
	
	//id
	private String id;
	//设备类型
	private String deviceType;
	//设备型号
	private String deviceModel;
	//生产厂家
	private String deviceVendor;
	//额定功率
	private String powerRating;
	//更新时间
	private String updateDate;
//更新后所加字段
	//资管机房id
	private String intId;
	//资管机房名称
	private String zhLabel;
	//资管机房拥有者 
	private String property;
	//资管机房所属地市
	private String cityName;
	//资管机房所属区县
	private String countyNmae;
	//资管机房状态
	private String status;
	
	public String getIntId() {
		return intId;
	}
	public void setIntId(String intId) {
		this.intId = intId;
	}
	public String getZhLabel() {
		return zhLabel;
	}
	public void setZhLabel(String zhLabel) {
		this.zhLabel = zhLabel;
	}
	public String getProperty() {
		return property;
	}
	public void setProperty(String property) {
		this.property = property;
	}
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	public String getCountyNmae() {
		return countyNmae;
	}
	public void setCountyNmae(String countyNmae) {
		this.countyNmae = countyNmae;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
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
	public String getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}

}
