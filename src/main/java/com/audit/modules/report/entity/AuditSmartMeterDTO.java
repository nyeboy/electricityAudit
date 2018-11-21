package com.audit.modules.report.entity;

/**
 * 稽核报表统计》》 超智能电表标杆 /超开关电源标杆情况
 * 
 * @author tantaigen
 *
 */
public class AuditSmartMeterDTO {
	private String cityName;// 城市名称
	private String proportion1;// 超智能电表标杆比例
	private String proportion2;// 超开关电源标杆比例

	public AuditSmartMeterDTO() {
	};

	public AuditSmartMeterDTO(String cityName, String proportion1, String proportion2) {
		this.cityName = cityName;
		this.proportion1 = proportion1;
		this.proportion2 = proportion2;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public String getProportion1() {
		return proportion1;
	}

	public void setProportion1(String proportion1) {
		this.proportion1 = proportion1;
	}

	public String getProportion2() {
		return proportion2;
	}

	public void setProportion2(String proportion2) {
		this.proportion2 = proportion2;
	};

}