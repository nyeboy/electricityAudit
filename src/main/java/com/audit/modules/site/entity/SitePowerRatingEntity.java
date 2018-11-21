package com.audit.modules.site.entity;

import java.io.Serializable;

/**
 * @author 王松
 * @description
 * 报账点额定功率
 * @date 2017/5/5
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class SitePowerRatingEntity implements Serializable {
    private static final long serialVersionUID = -4469402872285865010L;
    /**地市ID*/
    private String cityName;
    /**区县D*/
    private String countyName;//区县ID
    /**报账点ID*/
    private String siteId;//站点ID
    /**报账点名称*/
    private String accountName;//报账点名称
    /**机房名*/
    private String equipmentRoomName;
    /**机房类型*/
    private String equipmentRoomType;
    /**设备专业。1 传输设备；2 无线设备；3 动力设备*/
    private String deviceBelong;
    /**设备类型*/
    private String deviceType;
    /**设备型号*/
    private String deviceModel;
    /**设备厂商*/
    private String deviceVendor;
    /**网元状态*/
    private String deviceStatus;
    /**额定功率*/
    private Long powerRating;


    public String getCityName() {
        return cityName;
    }

    public String getCountyName() {
        return countyName;
    }

    public String getSiteId() {
        return siteId;
    }

    public String getAccountName() {
        return accountName;
    }

    public String getEquipmentRoomName() {
        return equipmentRoomName;
    }

    public String getEquipmentRoomType() {
        return equipmentRoomType;
    }

    public String getDeviceBelong() {
        return deviceBelong;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public String getDeviceModel() {
        return deviceModel;
    }

    public String getDeviceVendor() {
        return deviceVendor;
    }

    public String getDeviceStatus() {
        return deviceStatus;
    }

    public Long getPowerRating() {
        return powerRating;
    }
}
