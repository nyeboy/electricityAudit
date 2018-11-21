package com.audit.modules.towerReport.entity;

/**
 * Created by tglic on 2017/3/7.
 * 全省智能电表接入率、可用率基础数据
 */
public class SmartMeterTower {

    //市、区级名称
    private String city;

    //智能电表接入率
    private String accessRate;

    //智能电表可用率
    private String availableRate;

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

	public String getAccessRate() {
		return accessRate;
	}

	public void setAccessRate(String accessRate) {
		this.accessRate = accessRate;
	}

	public String getAvailableRate() {
		return availableRate;
	}

	public void setAvailableRate(String availableRate) {
		this.availableRate = availableRate;
	}

}
