package com.audit.modules.electricity.entity;

import java.util.Date;

/**
 * emos保存数据表实体类
 * 
 */

public class EleCpowerJobVO{
	
	private String electricity_id;
	private String job_num;
	private Date create_job_time;
	private Date finish_job_time;
	private String status;
	private String description;
	private String failed_desc;
	public String getFiled_desc() {
		return failed_desc;
	}
	public void setFiled_desc(String filed_desc) {
		this.failed_desc = filed_desc;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	private int type;
	public String getElectricity_id() {
		return electricity_id;
	}
	public void setElectricity_id(String electricity_id) {
		this.electricity_id = electricity_id;
	}
	public String getJob_num() {
		return job_num;
	}
	public void setJob_num(String job_num) {
		this.job_num = job_num;
	}
	public Date getCreate_job_time() {
		return create_job_time;
	}
	public void setCreate_job_time(Date create_job_time) {
		this.create_job_time = create_job_time;
	}
	public Date getFinish_job_time() {
		return finish_job_time;
	}
	public void setFinish_job_time(Date finish_job_time) {
		this.finish_job_time = finish_job_time;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	
	
	
}