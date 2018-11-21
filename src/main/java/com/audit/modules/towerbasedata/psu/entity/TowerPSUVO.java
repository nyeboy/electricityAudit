package com.audit.modules.towerbasedata.psu.entity;

import java.util.Date;

/**
 * 
 * @Description:供电信息   
 * @throws  
 * 
 * @author bingliup
 * @date 2017年4月30日 下午2:02:17
 */
public class TowerPSUVO {
	// SYS_TOWER_ACCOUNT_SITE 的id
	private String id;
	// 市ID
	private String cityId;
	// 区县ID
	private String countyId;
	// 城市名
	private String cityStr;
	// 区县名
	private String countyStr;
	// 铁塔站点编码
	private String code;
	// 资管站点名称
	private String label;
	// 用电类型(1.直供电、2.转供电)
	private String electricityType;
	// 共享方式(（1共享、2.独享。）)
	private String shareType;
	// 站址类型: 1铁塔新建、2.电信存量、3.联通存量、4.移动存量
	private String zzType;
	// 更新时间
	private Date updateTime;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCityId() {
		return cityId;
	}

	public void setCityId(String cityId) {
		this.cityId = cityId == null ? null : cityId.trim();
	}

	public String getCountyId() {
		return countyId;
	}

	public void setCountyId(String countyId) {
		this.countyId = countyId == null ? null : countyId.trim();
	}

	public String getElectricityType() {
		return electricityType;
	}

	public void setElectricityType(String electricityType) {
		this.electricityType = electricityType == null ? null : electricityType.trim();
	}

	public String getShareType() {
		return shareType;
	}

	public void setShareType(String shareType) {
		this.shareType = shareType == null ? null : shareType.trim();
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getZzType() {
		return zzType;
	}

	public void setZzType(String zzType) {
		this.zzType = zzType;
	}

	public String getCityStr() {
		return cityStr;
	}

	public String getCountyStr() {
		return countyStr;
	}

	public void setCityStr(String cityStr) {
		this.cityStr = cityStr;
	}

	public void setCountyStr(String countyStr) {
		this.countyStr = countyStr;
	}
}