package com.audit.modules.towerbasedata.other.entity;

/**
 * 
 * @author bingliup
 *
 */
public class TowerOtherVO {
	// 站点id
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
	//铁塔站址名称
	private String name;
	// 资管站点名称
	private String label;
	// 报销周期
	private Integer cycle;
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
		this.cityId = cityId;
	}

	public String getCountyId() {
		return countyId;
	}

	public void setCountyId(String countyId) {
		this.countyId = countyId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Integer getCycle() {
		return cycle;
	}

	public void setCycle(Integer cycle) {
		this.cycle = cycle;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

}