package com.audit.modules.basedata.entity;
/**
 * 
 * @Description: 转供电信息管理实体类
 * @throws  
 * @author  noone
 * @date 2017年1月8日 
 */
public class AccountSiteTrans {
	//唯一标识id
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
	//资源站点IDZG_SPACE_EQUIP_ROOM的ID,转供电的状态和单号在其中;""为需改造 1 待改造 2 已改造
	private String roomId;
	//站点siteid,和id是一样的，多了一个名字而已
	private String siteId;
	//站点名称
	private String siteName;
	//报账点名称
	private String accountName;
	//市ID
	private String cityId;
	//区县ID
	private String countyId;
	//资产产权性质(1.自维  2.塔维)
	private String properType;
	//用电类型(只能是转供电)通过站点查出来的
	private String siteEleType;
	//市名字
	private String cityName;
	//区县名字
	private String countyName;
	public String getSiteName() {
		return siteName;
	}
	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}
	public String getAccountName() {
		return accountName;
	}
	public void setAccountName(String accountName) {
		this.accountName = accountName;
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
	public String getProperType() {
		return properType;
	}
	public void setProperType(String properType) {
		this.properType = properType;
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
	public String getSiteId() {
		return siteId;
	}
	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}
	public String getSubmitStatus() {
		return submitStatus;
	}
	public void setSubmitStatus(String submitStatus) {
		this.submitStatus = submitStatus;
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
	public String getOnlyId() {
		return onlyId;
	}
	public void setOnlyId(String onlyId) {
		this.onlyId = onlyId;
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
	public String getRoomId() {
		return roomId;
	}
	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}
	public String getSiteEleType() {
		return siteEleType;
	}
	public void setSiteEleType(String siteEleType) {
		this.siteEleType = siteEleType;
	}
	

}
