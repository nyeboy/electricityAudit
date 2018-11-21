package com.audit.modules.towerReport.entity;

import java.io.Serializable;
import java.util.Map;

/**
 * Created by fangrena on 2017/3/7.
 */
public class ElectricChargeTower implements Serializable{

    /**
	 * 
	 */
	private static final long serialVersionUID = 7673489121160735932L;

	private String cityId;

    private String cityName;

    private String average01;

    private String average02;

    private Map<String,String> cityData;

    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }


    public String getAverage01() {
		return average01;
	}

	public void setAverage01(String average01) {
		this.average01 = average01;
	}

	public String getAverage02() {
		return average02;
	}

	public void setAverage02(String average02) {
		this.average02 = average02;
	}

	public Map<String, String> getCityData() {
		return cityData;
	}

	public void setCityData(Map<String, String> cityData) {
		this.cityData = cityData;
	}

	public Object getCityDataValue(String key){
        if(cityData == null){
            return null;
        }
        return cityData.get(key);
    }


    public ElectricChargeTower(String cityId,String cityName, String average01,String average02,
                             Map<String,String> cityData){
        this.cityId=cityId;
        this.cityName=cityName;
        this.average01=average01;
        this.average02=average02;
        this.cityData=cityData;
    }
    public ElectricChargeTower(){};
}
