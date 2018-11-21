package com.audit.modules.payment.entity;

public class Sepcc {
	private String int_id;
	private String province_name;
	private String city_name;
	private String zh_label;
	public String getInt_id() {
		return int_id;
	}
	public void setInt_id(String int_id) {
		this.int_id = int_id;
	}
	public String getProvince_name() {
		return province_name;
	}
	public void setProvince_name(String province_name) {
		this.province_name = province_name;
	}
	public String getCity_name() {
		return city_name;
	}
	public void setCity_name(String city_name) {
		this.city_name = city_name;
	}
	public String getZh_label() {
		return zh_label;
	}
	public void setZh_label(String zh_label) {
		this.zh_label = zh_label;
	}
	public Sepcc() {
		super();
	}

	public Sepcc(String int_id, String province_name, String city_name, String zh_label) {
		super();
		this.int_id = int_id;
		this.province_name = province_name;
		this.city_name = city_name;
		this.zh_label = zh_label;
	}
	
	

}
