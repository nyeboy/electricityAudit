package com.audit.modules.towerReport.entity;

/**
 * Created by tglic on 2017/3/6.
 * 资管、财务系统基站名称一致性基础数据
 */
public class FinancialSystemTower {

    //市级名称
    private String city;

    //财务系统站点数
    private int site;

    //匹配成功资管数据
    private int successData;

    //匹配成功率
    private String successRate;

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

	public int getSuccessData() {
		return successData;
	}

	public void setSuccessData(int successData) {
		this.successData = successData;
	}

	public String getSuccessRate() {
		return successRate;
	}

	public void setSuccessRate(String successRate) {
		this.successRate = successRate;
	}

    
}
