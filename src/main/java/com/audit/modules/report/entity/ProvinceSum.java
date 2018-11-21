/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.report.entity;

/**   
 * @Description: 省首页信息汇总   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年6月1日 下午1:37:59    
*/
public class ProvinceSum {
	
	//直供电比例		
	private String directScale;
	//转供电比例	
	private String rotaryScale;
	//直供电电量
	private String directPower;
	//转供电电量
	private String rotaryPower;
	//基站总数
	private String siteNum;
	//自维
	private String selfNum;
	//移交铁塔站点数
	private String towerSite;
	//过户站点数
	private String transferSite;
	
	public String getDirectScale() {
		return directScale;
	}
	public String getRotaryScale() {
		return rotaryScale;
	}
	public String getDirectPower() {
		return directPower;
	}
	public String getRotaryPower() {
		return rotaryPower;
	}
	public String getSiteNum() {
		return siteNum;
	}
	public String getSelfNum() {
		return selfNum;
	}
	public String getTowerSite() {
		return towerSite;
	}
	public String getTransferSite() {
		return transferSite;
	}
	public void setDirectScale(String directScale) {
		this.directScale = directScale;
	}
	public void setRotaryScale(String rotaryScale) {
		this.rotaryScale = rotaryScale;
	}
	public void setDirectPower(String directPower) {
		this.directPower = directPower;
	}
	public void setRotaryPower(String rotaryPower) {
		this.rotaryPower = rotaryPower;
	}
	public void setSiteNum(String siteNum) {
		this.siteNum = siteNum;
	}
	public void setSelfNum(String selfNum) {
		this.selfNum = selfNum;
	}
	public void setTowerSite(String towerSite) {
		this.towerSite = towerSite;
	}
	public void setTransferSite(String transferSite) {
		this.transferSite = transferSite;
	}
	
	
	
	

}
