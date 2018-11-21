package com.audit.modules.towerbasedata.trans.entity;
	/**
	 * 
	 * @Description: 转供电信息管理实体类
	 * @throws  
	 * @author  noone
	 * @date 2017年1月8日 
	 */
public class TowerTransVO {
		//唯一标识id,转供电的状态和单号在其中;""为需改造 1 待改造 2 已改造
		private String onlyId;
		//提交过来的人名字
		private String trusteesName;
		//提交过来的人id
		private String trusteesId;
		//提交状态	1 , 已提交至下一级  2 被撤回  3 改造完成    null '' 未提交
		private String submitStatus;
		//机房供电状态
		private String roomEleType;
		//机房名字
		private String roomName;
		//报账点ID,SYS_ACCOUNT_SITE的ID   他们的中间表是SYS_SITE_MID_RESOURCE
		//铁塔站址编码
		private String towerSiteCode;
		//铁塔站点名称
		private String towerSiteName;
		//市ID
		private String cityId;
		//区县ID
		private String countyId;
		//用电类型(只能是转供电)通过站点查出来的
		private String siteEleType;
		//市名字
		private String cityName;
		//区县名字
		private String countyName;
		public String getOnlyId() {
			return onlyId;
		}
		public void setOnlyId(String onlyId) {
			this.onlyId = onlyId;
		}
		public String getTrusteesName() {
			return trusteesName;
		}
		public void setTrusteesName(String trusteesName) {
			this.trusteesName = trusteesName;
		}
		public String getTrusteesId() {
			return trusteesId;
		}
		public void setTrusteesId(String trusteesId) {
			this.trusteesId = trusteesId;
		}
		public String getSubmitStatus() {
			return submitStatus;
		}
		public void setSubmitStatus(String submitStatus) {
			this.submitStatus = submitStatus;
		}
		public String getRoomEleType() {
			return roomEleType;
		}
		public void setRoomEleType(String roomEleType) {
			this.roomEleType = roomEleType;
		}
		public String getRoomName() {
			return roomName;
		}
		public void setRoomName(String roomName) {
			this.roomName = roomName;
		}
		public String getTowerSiteCode() {
			return towerSiteCode;
		}
		public void setTowerSiteCode(String towerSiteCode) {
			this.towerSiteCode = towerSiteCode;
		}
		public String getTowerSiteName() {
			return towerSiteName;
		}
		public void setTowerSiteName(String towerSiteName) {
			this.towerSiteName = towerSiteName;
		}
		public String getCityId() {
			return cityId;
		}
		public void setCityId(String cityId) {
			this.cityId = cityId;
		}
		public String getCountyId() {
			return countyId;
		}
		public void setCountyId(String countyId) {
			this.countyId = countyId;
		}
		public String getSiteEleType() {
			return siteEleType;
		}
		public void setSiteEleType(String siteEleType) {
			this.siteEleType = siteEleType;
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



}
