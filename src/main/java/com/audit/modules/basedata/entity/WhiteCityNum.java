package com.audit.modules.basedata.entity;

public class WhiteCityNum {
	private String id;
	private String cityName;
	private String cityId;
	private Integer siteNum;
	private Integer whiteSiteNum;
	private String bi;
	private Integer yu;
	private String zbi;
	private Integer zSiteNum;
	private Integer zWhiteSiteNum;
	
	public Integer getzSiteNum() {
		return zSiteNum;
	}
	public void setzSiteNum(Integer zSiteNum) {
		this.zSiteNum = zSiteNum;
	}
	public Integer getzWhiteSiteNum() {
		return zWhiteSiteNum;
	}
	public void setzWhiteSiteNum(Integer zWhiteSiteNum) {
		this.zWhiteSiteNum = zWhiteSiteNum;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	public String getCityId() {
		return cityId;
	}
	public void setCityId(String cityId) {
		this.cityId = cityId;
	}
	public Integer getSiteNum() {
		return siteNum;
	}
	public void setSiteNum(Integer siteNum) {
		this.siteNum = siteNum;
	}
	public Integer getWhiteSiteNum() {
		return whiteSiteNum;
	}
	public void setWhiteSiteNum(Integer whiteSiteNum) {
		this.whiteSiteNum = whiteSiteNum;
	}
	public String getBi() {
		return bi;
	}
	public void setBi(String bi) {
		this.bi = bi;
	}
	public Integer getYu() {
		return yu;
	}
	public void setYu(Integer yu) {
		this.yu = yu;
	}
	public String getZbi() {
		return zbi;
	}
	public void setZbi(String zbi) {
		this.zbi = zbi;
	}
	

}
