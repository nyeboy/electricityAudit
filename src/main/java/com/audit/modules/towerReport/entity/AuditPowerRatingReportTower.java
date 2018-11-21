package com.audit.modules.towerReport.entity;

/**
 * 稽核统计报表 超额定功率标杆情况
 * 
 * @author tantaigen
 *
 */
public class AuditPowerRatingReportTower {
	private String cityName;//城市
	private String proportion;//超额定功率占比

	public AuditPowerRatingReportTower(String cityName, String proportion) {
		this.cityName = cityName;
		this.proportion = proportion;
	}

	public AuditPowerRatingReportTower() {
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public String getProportion() {
		return proportion;
	}

	public void setProportion(String proportion) {
		this.proportion = proportion;
	}

}
