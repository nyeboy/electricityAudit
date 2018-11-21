package com.audit.modules.towerReport.entity;

/**
 * Created by tglic on 2017/3/7.
 * 全省站点开关电源监控完好率、可用率基础数据
 */
public class ProvinceSiteTower {

    //市、区级名称
    private String city;

    //动环网管现有站点数
    private int site;

    //开关电源监控完好率
    private String availability;

    //开关电源可用率
    private String  availableRate;

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

	public int getSite() {
		return site;
	}

	public void setSite(int site) {
		this.site = site;
	}

	public String getAvailability() {
		return availability;
	}

	public void setAvailability(String availability) {
		this.availability = availability;
	}

	public String getAvailableRate() {
		return availableRate;
	}

	public void setAvailableRate(String availableRate) {
		this.availableRate = availableRate;
	}
    
    
}
