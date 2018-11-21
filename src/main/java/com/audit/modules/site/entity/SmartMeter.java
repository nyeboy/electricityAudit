package com.audit.modules.site.entity;

/**
 * @Description : TODO(智能电表Vo)
 *
 * @author :
 * @date : 2017年4月19日
 *
 *       Copyright (c) 2017, IsoftStone All Right reserved.
 */

public class SmartMeter {
	// ID
	private String id;
	// 省网标识
	private String systemTitle;
	// 资源类型
	private String neClass;
	// 基站名称
	private String siteName;
	// 基站编号
	private String siteNo;
	// 归属地市/区
	private String siteAttibution;
	// 记录起始时间
	private String timeStart;
	// 记录结束时间
	private String timeEnd;
	// 总表读数
	private Double meterDial;
	// 总电表状态位
	private Integer meterState;
	// 主设备电表读数
	private Double mainEquipmentMeterDial;
	// 主设备电表状态位
	private Integer mainEquipmentMeterState;
	// 空调系统电表读数
	private Double airCondMeterDial;
	// 空调系统电表状态位
	private Integer airCondMeterState;
	// 基站室外日平均温度
	private String stationOutdoorAverTemp;
	// 基站室内日平均温度
	private String stationIndoorAverTemp;
	// 基站日PUE值
	private String stationDailyPue;
	// 开关电源转换损耗
	private String switchPowerLoss;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSystemTitle() {
		return systemTitle;
	}

	public void setSystemTitle(String systemTitle) {
		this.systemTitle = systemTitle;
	}

	public String getNeClass() {
		return neClass;
	}

	public void setNeClass(String neClass) {
		this.neClass = neClass;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public String getSiteNo() {
		return siteNo;
	}

	public void setSiteNo(String siteNo) {
		this.siteNo = siteNo;
	}

	public String getSiteAttibution() {
		return siteAttibution;
	}

	public void setSiteAttibution(String siteAttibution) {
		this.siteAttibution = siteAttibution;
	}

	public String getTimeStart() {
		return timeStart;
	}

	public void setTimeStart(String timeStart) {
		this.timeStart = timeStart;
	}

	public String getTimeEnd() {
		return timeEnd;
	}

	public void setTimeEnd(String timeEnd) {
		this.timeEnd = timeEnd;
	}

	public Double getMeterDial() {
		return meterDial;
	}

	public void setMeterDial(Double meterDial) {
		this.meterDial = meterDial;
	}

	public Integer getMeterState() {
		return meterState;
	}

	public void setMeterState(Integer meterState) {
		this.meterState = meterState;
	}

	public Double getMainEquipmentMeterDial() {
		return mainEquipmentMeterDial;
	}

	public void setMainEquipmentMeterDial(Double mainEquipmentMeterDial) {
		this.mainEquipmentMeterDial = mainEquipmentMeterDial;
	}

	public Integer getMainEquipmentMeterState() {
		return mainEquipmentMeterState;
	}

	public void setMainEquipmentMeterState(Integer mainEquipmentMeterState) {
		this.mainEquipmentMeterState = mainEquipmentMeterState;
	}

	public Double getAirCondMeterDial() {
		return airCondMeterDial;
	}

	public void setAirCondMeterDial(Double airCondMeterDial) {
		this.airCondMeterDial = airCondMeterDial;
	}

	public Integer getAirCondMeterState() {
		return airCondMeterState;
	}

	public void setAirCondMeterState(Integer airCondMeterState) {
		this.airCondMeterState = airCondMeterState;
	}

	public String getStationOutdoorAverTemp() {
		return stationOutdoorAverTemp;
	}

	public void setStationOutdoorAverTemp(String stationOutdoorAverTemp) {
		this.stationOutdoorAverTemp = stationOutdoorAverTemp;
	}

	public String getStationIndoorAverTemp() {
		return stationIndoorAverTemp;
	}

	public void setStationIndoorAverTemp(String stationIndoorAverTemp) {
		this.stationIndoorAverTemp = stationIndoorAverTemp;
	}

	public String getStationDailyPue() {
		return stationDailyPue;
	}

	public void setStationDailyPue(String stationDailyPue) {
		this.stationDailyPue = stationDailyPue;
	}

	public String getSwitchPowerLoss() {
		return switchPowerLoss;
	}

	public void setSwitchPowerLoss(String switchPowerLoss) {
		this.switchPowerLoss = switchPowerLoss;
	}

}
