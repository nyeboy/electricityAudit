package com.audit.modules.site.entity;

/**
 * @author 王松
 * @description
 * 机房设备信息
 * @date 2017/3/15
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class EquRoomDevice {
    private int id;
    private String equipmentRoomId;//机房id
    private String equipmentRoomName;//机房
    private String equipmentRoomType;//机房类型
    private int deviceBelong;//设备专业。1 传输设备；2 无线设备；3 动力设备
    private int deviceId;//设备id
    private int powerRating;//额定功率
    private String deviceStatus;//设备状态
    private String deviceType;//设备类型
    private String deviceModel;//设备型号
    private String deviceVendor;//厂商
    private String towerId;//
    private Double siteTotalPower;
    
    
    public String getTowerId() {
		return towerId;
	}

	public void setTowerId(String towerId) {
		this.towerId = towerId;
	}

	public Double getSiteTotalPower() {
		return siteTotalPower;
	}

	public void setSiteTotalPower(Double siteTotalPower) {
		this.siteTotalPower = siteTotalPower;
	}

	public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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

    public String getEquipmentRoomType() {
        return equipmentRoomType;
    }

    public void setEquipmentRoomType(String equipmentRoomType) {
        this.equipmentRoomType = equipmentRoomType;
    }

    public int getDeviceBelong() {
        return deviceBelong;
    }

    public void setDeviceBelong(int deviceBelong) {
        this.deviceBelong = deviceBelong;
    }

    public int getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(int deviceId) {
        this.deviceId = deviceId;
    }

    public int getPowerRating() {
        return powerRating;
    }

    public void setPowerRating(int powerRating) {
        this.powerRating = powerRating;
    }

    public String getDeviceStatus() {
        return deviceStatus;
    }

    public void setDeviceStatus(String deviceStatus) {
        this.deviceStatus = deviceStatus;
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
}
