package com.audit.modules.report.entity;

/**
 * 电费单价占比
 * @author tantaigen
 *
 */
public class UnitPriceDTO {
	private String cityName;//地市名称
	private String proportion1;//大于1.3
	private String proportion2;//1-1.3
	private String proportion3;//小于1
	public UnitPriceDTO(String cityName, String proportion1,
			String proportion2,String proportion3){
		this.cityName=cityName;		
		this.proportion1=proportion1;
		this.proportion2=proportion2;
		this.proportion3=proportion3;
	}
	public UnitPriceDTO(){}
	
	
	
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	public String getProportion1() {
		return proportion1;
	}
	public void setProportion1(String proportion1) {
		this.proportion1 = proportion1;
	}
	public String getProportion2() {
		return proportion2;
	}
	public void setProportion2(String proportion2) {
		this.proportion2 = proportion2;
	}
	public String getProportion3() {
		return proportion3;
	}
	public void setProportion3(String proportion3) {
		this.proportion3 = proportion3;
	}

}
