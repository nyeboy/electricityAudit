package com.audit.modules.site.entity;
/**
 * 基础数据呈现展示机房或资源点的部分数据
 */
public class BasedataLableVO{
	private String zhLable;//机房或资源点名称
	private String status;//在网状态
	private String property;//所属类型
	private String PSType;//供电类型
	public String getZhLable() {
		return zhLable;
	}
	public void setZhLable(String zhLable) {
		this.zhLable = zhLable;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getProperty() {
		return property;
	}
	public void setProperty(String property) {
		this.property = property;
	}
	public String getPSType() {
		return PSType;
	}
	public void setPSType(String pSType) {
		PSType = pSType;
	}
}