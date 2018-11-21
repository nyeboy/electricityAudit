package com.audit.modules.basedata.entity;

public class WhiteFlow {
	
	private String id;
	private Integer status;
	private String person;
	private String time;
	private String remark;
	private String mgid;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getPerson() {
		return person;
	}
	public void setPerson(String person) {
		this.person = person;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getMgid() {
		return mgid;
	}
	public void setMgid(String mgid) {
		this.mgid = mgid;
	}

}
