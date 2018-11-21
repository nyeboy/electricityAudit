package com.audit.modules.electricity.entity;

import java.io.Serializable;

import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.site.entity.PowerRatingDetailVO;
import com.fasterxml.jackson.annotation.JsonAutoDetect;

/**
 * @author 王松
 * @Description
 * @date 2017/3/15
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY //解析所有字段
        ,getterVisibility = JsonAutoDetect.Visibility.NONE)     //不解析get方法
public class DeviceVO implements Serializable {
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

	/**
	 * 
	 */
	private static final long serialVersionUID = -6530575192172358895L;
	/**机房ID*/
    private String equipmentRoomId;
    public String getEquipmentRoomId() {
		return equipmentRoomId;
	}
	public void setEquipmentRoomId(String equipmentRoomId) {
		this.equipmentRoomId = equipmentRoomId;
	}

	/**机房名*/
    private String equipmentRoomName;
    /**机房类型*/
    private String equipmentRoomType;
    /**设备专业。1 传输设备；2 无线设备；3 动力设备*/
    private String deviceBelong;
    /**设备类型*/
    private String deviceType;
    public String getDeviceType() {
		return deviceType;
	}
	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}

	/**设备型号*/
    private String deviceModel;
    /**设备厂商*/
    private String deviceVendor;
    /**设备个数*/
    private int number;
    /**网元状态*/
    private String deviceStatus;
    
    /**设备功率*/
    private String powerRating;
    public String getPowerRating() {
		return powerRating;
	}
	public void setPowerRating(String powerRating) {
		this.powerRating = powerRating;
	}

    
    public DeviceVO(EquRoomDevice equRoomDevice){
        this.equipmentRoomId = equRoomDevice.getEquipmentRoomId();
        this.equipmentRoomName = equRoomDevice.getEquipmentRoomName();
        this.equipmentRoomType = equRoomDevice.getEquipmentRoomType();
        this.deviceBelong = getDeviceBelongString(equRoomDevice.getDeviceBelong());
        this.deviceType = equRoomDevice.getDeviceType();
        this.deviceModel = equRoomDevice.getDeviceModel();
        this.deviceVendor = equRoomDevice.getDeviceVendor();
        this.deviceStatus = equRoomDevice.getDeviceStatus();
        this.number = 1;
    }
    
    public DeviceVO(PowerRatingDetailVO powerRatingDetail){
        this.equipmentRoomId = powerRatingDetail.getEquipmentRoomId();
        this.equipmentRoomName = powerRatingDetail.getEquipmentRoomName();
        this.deviceType = powerRatingDetail.getDeviceType();
        this.deviceBelong = powerRatingDetail.getDeviceBelong();
        this.deviceModel = powerRatingDetail.getDeviceModel();
        this.deviceVendor = powerRatingDetail.getDeviceVendor();
        this.deviceStatus = powerRatingDetail.getDeviceStatus();
        this.number = 1;
    }
    
    private String getDeviceBelongString(int belong){
        String result = "";
        switch (belong) {
            case 1:
                result = "传输设备";
                break;
            case 2:
                result = "无线设备";
                break;
            case 3:
                result = "动力设备";
                break;
        }

        return result;
    }

    /**
     * 判断是否是同一个设备
     * 如果机房相同，设备专业相同，设备类型相同，设备型号相同，设备厂商相同。则认为机房设备属于本对象
     * @return boolean
     */
    public boolean equals(DeviceVO equRoomDevice){
        
        if(equRoomDevice != null){
        	String a = equRoomDevice.equipmentRoomName!=null?equRoomDevice.equipmentRoomName:"";
        	String b = equRoomDevice.deviceBelong!=null?equRoomDevice.deviceBelong:"";
        	String c = equRoomDevice.deviceType!=null?equRoomDevice.deviceType:"";
        	String d = equRoomDevice.deviceModel!=null?equRoomDevice.deviceModel:"";
        	String e = equRoomDevice.deviceVendor!=null?equRoomDevice.deviceVendor:"";
        	
        	return a.equals(equipmentRoomName)
                    && b.equals(deviceBelong)
                    && c.equals(deviceType)
                    && d.equals(deviceModel)
                    && e.equals(deviceVendor);
        }else {
        	return false;
		}
    }

    /**
     * 将当前设备个数+1
     */
    public void addNumber(){
        number++;
    }
}
