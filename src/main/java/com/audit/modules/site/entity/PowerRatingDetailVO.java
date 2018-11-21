package com.audit.modules.site.entity;

/**
 * 查看额定功率详情类
 * @author Administrator
 *
 */
public class PowerRatingDetailVO{
	//设备id
	String equipmentRoomId;
	//设备类型
	String deviceType;
	public String getDeviceType() {
		return deviceType;
	}
	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}
	//机房名称
	String equipmentRoomName;
	//设备专业
	String deviceBelong;
	//网元状态
	String deviceStatus;
	//型号
	String deviceModel;
	//生产厂家
	String deviceVendor;
	//数量
	int number;
	//额定功率
	String powerRating;
	public String getEquipmentRoomId() {
		return equipmentRoomId;
	}
	public void setEquipmentRoomId(String equipmentRoomId) {
		this.equipmentRoomId = equipmentRoomId;
	}
	public String getEquipmentRoomName() {
		return equipmentRoomName;
	}
	public void setEquipmentRoomName(String equipmentRoomName) {
		this.equipmentRoomName = equipmentRoomName;
	}
	public String getDeviceBelong() {
		return deviceBelong;
	}
	public void setDeviceBelong(String deviceBelong) {
		this.deviceBelong = deviceBelong;
	}
	public String getDeviceStatus() {
		return deviceStatus;
	}
	public void setDeviceStatus(String deviceStatus) {
		this.deviceStatus = deviceStatus;
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
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public String getPowerRating() {
		return powerRating;
	}
	public void setPowerRating(String powerRating) {
		this.powerRating = powerRating;
	}

	
	
}