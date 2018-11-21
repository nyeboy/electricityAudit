package com.audit.modules.towerbasedata.datashow.entity;

import com.audit.modules.site.entity.EquRoomDevice;

/**   
 * @Description : TODO(塔维：额定功率标杆管理-详情)    
 *
 * @author : 
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class TowerPowerRateDetail {
	
	
	//塔id
	private String towerId;
	//机房名
	private String equName;
	//设备专业
	private String deviceBelong;
	//设备类型
	private String deviceType;
	//设备型号
	private String deviceModel;
	//厂家
	private String deviceVendor;
	//数量
	private int amount;
	//额定功率
	private Double ratePower;
	//额定总功率
	private Double rateTotalPower;
	//站点总功率
	private Double siteTotalPower;
	
	
	
	public TowerPowerRateDetail() {
		super();
	}

	public TowerPowerRateDetail(EquRoomDevice equRoomDevice){
		this.towerId = equRoomDevice.getTowerId();
        this.equName = equRoomDevice.getEquipmentRoomName();
        this.deviceBelong = getDeviceBelongString(equRoomDevice.getDeviceBelong());
        this.ratePower = (double) equRoomDevice.getPowerRating();
        this.deviceType = equRoomDevice.getDeviceType();
        this.deviceModel = equRoomDevice.getDeviceModel();
        this.deviceVendor = equRoomDevice.getDeviceVendor();
        this.siteTotalPower = equRoomDevice.getSiteTotalPower();
        this.amount = 1;
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
    public boolean equals(TowerPowerRateDetail equRoomDevice){
        if(equRoomDevice != null){
        	String a = equRoomDevice.equName!=null?equRoomDevice.equName:"";
        	String b = equRoomDevice.deviceBelong!=null?equRoomDevice.deviceBelong:"";
        	String c = equRoomDevice.deviceType!=null?equRoomDevice.deviceType:"";
        	String d = equRoomDevice.deviceModel!=null?equRoomDevice.deviceModel:"";
        	String e = equRoomDevice.deviceVendor!=null?equRoomDevice.deviceVendor:"";
        	
        	return a.equals(equName)
                    && b.equals(deviceBelong)
                    && c.equals(deviceType)
                    && d.equals(deviceModel)
                    && e.equals(deviceVendor);
        }else {
        	return false;
		}
        
    }
   
    // 将当前设备个数+1
    public void addNumber(){
    	amount++;
    }

	public String getTowerId() {
		return towerId;
	}

	public void setTowerId(String towerId) {
		this.towerId = towerId;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public Double getRatePower() {
		return ratePower;
	}

	public void setRatePower(Double ratePower) {
		this.ratePower = ratePower;
	}

	public Double getRateTotalPower() {
		return rateTotalPower;
	}

	public void setRateTotalPower(Double rateTotalPower) {
		this.rateTotalPower = rateTotalPower;
	}

	public Double getSiteTotalPower() {
		return siteTotalPower;
	}

	public void setSiteTotalPower(Double siteTotalPower) {
		this.siteTotalPower = siteTotalPower;
	}

	public String getEquName() {
		return equName;
	}

	public void setEquName(String equName) {
		this.equName = equName;
	}

	public String getDeviceBelong() {
		return deviceBelong;
	}

	public void setDeviceBelong(String deviceBelong) {
		this.deviceBelong = deviceBelong;
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
