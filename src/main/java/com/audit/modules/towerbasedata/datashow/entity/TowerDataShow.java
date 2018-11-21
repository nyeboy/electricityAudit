package com.audit.modules.towerbasedata.datashow.entity;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : 
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class TowerDataShow {
	
	//塔id
	private String towerId;      		
	//市名
	private String cityName;		
	//区名
	private String countyName;		
	//塔编号
	private String towerNum;			
	//塔地址名
	private String addrName;			
	//资管站名
	private String resName;		 
	//产权性质
	private String produceNature;  
	//用电类型	1.直供电、2.转供电
	private String elecType; 				
	//站址类型	1铁塔新建、2.电信存量、3.联通存量、4.移动存量
	private String zzType;										
	//共享方式	1共享、2.独享
	private String shareType;									
	//报销周期	1.月、3.季度、6.半年、12.年
	private String cycle;															
	//分摊比例
	private String proportion;
	
	
	public TowerDataShow() {
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
	public String getAddrName() {
		return addrName;
	}
	public void setAddrName(String addrName) {
		this.addrName = addrName;
	}
	public String getResName() {
		return resName;
	}
	public void setResName(String resName) {
		this.resName = resName;
	}
	public String getProduceNature() {
		return produceNature;
	}
	public void setProduceNature(String produceNature) {
		this.produceNature = "塔维";
	}
	public String getElecType() {
		return elecType;
	}
	public void setElecType(String elecType) {
		this.elecType = elecType;
	
	}
	public String getZzType() {
		return zzType;
	}
	public void setZzType(String zzType) {
		this.zzType = zzType;
	
	}
	public String getShareType() {
		return shareType;
	}
	public void setShareType(String shareType) {
		this.shareType = shareType;
	}
	public String getCycle() {
		return cycle;
	}
	public void setCycle(String cycle) {
		this.cycle = cycle; 
	
	}
	public String getProportion() {
		return proportion;
	}
	public void setProportion(String proportion) {
		this.proportion = proportion;
	}
	
	
	
	
}
