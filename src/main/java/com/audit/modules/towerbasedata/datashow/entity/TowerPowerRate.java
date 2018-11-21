package com.audit.modules.towerbasedata.datashow.entity;

/**   
 * @Description : TODO(塔维：额定功率标杆vo)    
 *
 * @author : 
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class TowerPowerRate {
	
		//开关id
		private String towerId;
		//地市
		private String cityName;
		//区县
		private String countyName;
		//塔编号
		private String towerNum ;
		//资管站名
		private String resName;
		//站点总功率
		private Double siteTotalPower;
		//电量标杆值（度）
		private Double standardNum;
		//更新状态
		private String updateStatus;
		//更新时间
		private String updateTime;
		
		
		public TowerPowerRate() {
			super();
		}
		public String getTowerId() {
			return towerId;
		}
		public void setTowerId(String towerId) {
			this.towerId = towerId;
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
		public String getTowerNum() {
			return towerNum;
		}
		public void setTowerNum(String towerNum) {
			this.towerNum = towerNum;
		}
		public String getResName() {
			return resName;
		}
		public void setResName(String resName) {
			this.resName = resName;
		}
		public Double getSiteTotalPower() {
			return siteTotalPower;
		}
		public void setSiteTotalPower(Double siteTotalPower) {
			this.siteTotalPower = siteTotalPower;
		}
		public Double getStandardNum() {
			return standardNum;
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
		public void setStandardNum(Double standardNum) {
			this.standardNum = standardNum;
		}
		
}
