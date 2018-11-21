package com.audit.modules.site.entity;

/**   
 * @Description : TODO(智能开关vo)    
 *
 * @author : chentao
 * @date : 2017年4月19日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class SwitchPower {
	
	//ID
	private String id;
	//省网标识
	private String systemTitle;
	//资源类型
	private String neClass;
	//基站名称
	private String siteName;
	//基站编号
	private String siteNo;
	//归属地市/区
	private String siteAttibution;
	//采集数据的时间点
	private String time;
	//闲忙时开关电源负载电流
	private Double elecCurrent;
	//开关电源直流系统输出电压
	private Double outputVoltage;
	//开关电源监控状态
	private Integer switchPowerState;
	
	
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
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public Double getElecCurrent() {
		return elecCurrent;
	}
	public void setElecCurrent(Double elecCurrent) {
		this.elecCurrent = elecCurrent;
	}
	public Double getOutputVoltage() {
		return outputVoltage;
	}
	public void setOutputVoltage(Double outputVoltage) {
		this.outputVoltage = outputVoltage;
	}
	public Integer getSwitchPowerState() {
		return switchPowerState;
	}
	public void setSwitchPowerState(Integer switchPowerState) {
		this.switchPowerState = switchPowerState;
	}

	
}
