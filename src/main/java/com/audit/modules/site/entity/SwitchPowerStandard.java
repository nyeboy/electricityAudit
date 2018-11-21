package com.audit.modules.site.entity;

/**   
 * @Description : TODO(开关电源标杆vo)    
 *
 * @author : 
 * @date : 2017年4月18日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class SwitchPowerStandard {
	
		//开关id
		private String switchId;
		//地市
		private String cityName;
		//区县
		private String countyName;
		//报账点名称
		private String accountName ;
		//机房或资源点名称
		private String resourceName;
		//闲忙时开关电源负载电流
		private Float elecCurrent;
		//开关电源直流系统输出电压
		private Float outputVoltage;
		//电量标杆值（度）
		private Double standardNum;
		//更新状态
		private String updateStatus;
		//更新时间
		private String updateTime;
		//关联机房号
		private String intId;
		//站点id
		private String siteId;
		
		
	//电量标杆值=（（avg平均负载电流*输出电压）/转换效率)（瓦）*24（小时）/1000
		
		public String getSwitchId() {
			return switchId;
		}
		public void setSwitchId(String switchId) {
			this.switchId = switchId;
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
	
		public Float getElecCurrent() {
			return elecCurrent;
		}
		public void setElecCurrent(Float elecCurrent) {
			this.elecCurrent = elecCurrent;
		}
		public Float getOutputVoltage() {
			return outputVoltage;
		}
		public void setOutputVoltage(Float outputVoltage) {
			this.outputVoltage = outputVoltage;
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
		public String getIntId() {
			return intId;
		}
		public void setIntId(String intId) {
			this.intId = intId;
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
		public double getOverSwitchPower(double totalElectricityOfUser, int dateRange){
			double benchmarkElectricity = benchmarkSwitchPower(dateRange);
			//如果标杆电量为0，说明开关电源没有数据，没有数据的一致处理成没有超标杆
			if(benchmarkElectricity == 0d){
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
		public double benchmarkSwitchPower(int dateRange){
			return (this.standardNum==null ? 0d : this.standardNum) * dateRange;
		}
		
}
