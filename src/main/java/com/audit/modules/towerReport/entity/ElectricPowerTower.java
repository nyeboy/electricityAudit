package com.audit.modules.towerReport.entity;

import java.io.Serializable;
import java.util.Map;

/**
 * Created by fangrena on 2017/3/7.
 */
public class ElectricPowerTower implements Serializable{

    /**
	 * 
	 */
	private static final long serialVersionUID = -3771452950269624304L;

	private String cityId;

    private String cityName;

    private Double average01;

    private Double average02;

    private Map<String,Double> cityData;

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


    public Double getAverage01() {
		return average01;
	}

	public void setAverage01(Double average01) {
		this.average01 = average01;
	}

	public Double getAverage02() {
		return average02;
	}

	public void setAverage02(Double average02) {
		this.average02 = average02;
	}

	public Map<String, Double> getCityData() {
		return cityData;
	}

	public void setCityData(Map<String, Double> cityData) {
        this.cityData = cityData;
    }
}
