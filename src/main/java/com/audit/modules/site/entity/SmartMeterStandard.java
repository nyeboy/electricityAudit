package com.audit.modules.site.entity;


/**   
 * @Description : TODO(智能电表标杆vo)    
 *
 * @author : chentao
 * @date : 2017年4月18日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class SmartMeterStandard {
	
	//电表id
	private String meterId;
	//地市
	private String cityName;
	//区县
	private String countyName;
	//报账点名称
	private String accountName;
	//机房或资源点名称
	private String resourceName;
	//智能电表读数(当前)
	private Double meterLatestNum;
	//智能电表读数(上个节点)
	private Double meterOldNum;
	//动环智能电表测点监控状态
	private Integer monitorStatus;
	//电量标杆值（度）
	private Double standardNum;
	//更新状态
	private String updateStatus;
	//更新时间
	private String updateTime;
	//录入起始---读数
	private Double startNum;
	//录入终止--读数
	private Double endNum;
	//站点id
	private String siteId;
	//昨天读数
	private Double yesterDayNum;
	
	
	public Double getYesterDayNum() {
		return yesterDayNum;
	}


	public void setYesterDayNum(Double yesterDayNum) {
		this.yesterDayNum = yesterDayNum;
	}


	public SmartMeterStandard() {
		super();
	}


	public String getMeterId() {
		return meterId;
	}


	public void setMeterId(String meterId) {
		this.meterId = meterId;
	}


	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	public String getCountyName() {
		return countyName;
	}
	public void setCountyName(String countyName) {
		this.countyName = countyName;
	}

	public String getAccountName() {
		return accountName;
	}


	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}


	public String getResourceName() {
		return resourceName;
	}


	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}


	public Double getMeterLatestNum() {
		return meterLatestNum;
	}


	public void setMeterLatestNum(Double meterLatestNum) {
		this.meterLatestNum = meterLatestNum;
	}


	public Double getMeterOldNum() {
		return meterOldNum;
	}


	public void setMeterOldNum(Double meterOldNum) {
		this.meterOldNum = meterOldNum;
	}


	public Integer getMonitorStatus() {
		return monitorStatus;
	}


	public void setMonitorStatus(Integer monitorStatus) {
		this.monitorStatus = monitorStatus;
	}


	public Double getStandardNum() {
		return standardNum;
	}


	public void setStandardNum(Double standardNum) {
		this.standardNum = standardNum;
	}


	public String getUpdateStatus() {
		return updateStatus;
	}


	public void setUpdateStatus(String updateStatus) {
		this.updateStatus = updateStatus;
	}


	public String getUpdateTime() {
		return updateTime;
	}


	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}


	public Double getStartNum() {
		return startNum;
	}


	public void setStartNum(Double startNum) {
		this.startNum = startNum;
	}


	public Double getEndNum() {
		return endNum;
	}


	public void setEndNum(Double endNum) {
		this.endNum = endNum;
	}


	public String getSiteId() {
		return siteId;
	}


	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}
	
	/**
	 * 计算超标杆比例
	 * @param totalElectricityOfUser 用户的总电量
	 * @param dateRange 天数
	 * @return 超标杆百分比。如果未超标，则为0
	 */
	public double getOverSmartMeter(double totalElectricityOfUser, int dateRange){
		double benchmarkElectricity = getBenchmarkSmartMeter(dateRange);
		//如果标杆电量为0，说明智能电表没有数据，没有数据的一致处理成没有超标杆
		if(benchmarkElectricity == 0d) {
			return 0d;
		}

    	if(totalElectricityOfUser <= benchmarkElectricity){
    		return 0;
		}

		return (totalElectricityOfUser - benchmarkElectricity) / benchmarkElectricity * 100;
	}

	/**
	 * 获取标杆电量
	 * @param dateRange 用电天数
	 * @return 如果电量标杆值为null，则标杆电量返回0
	 */
	public double getBenchmarkSmartMeter(int dateRange){
		
//		return (this.standardNum==null?1:this.standardNum )* dateRange;
		return (this.standardNum == null ? 0d : this.standardNum )* dateRange;
	}
	
	
}
