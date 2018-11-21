package com.audit.modules.basedata.entity;

import java.sql.Date;
import java.util.List;

import com.audit.modules.system.entity.SysFile;

public class whiteSubmitMg {
	
	private String cityName;
	private String zhLabel;
	private Integer status;
	private String szydNo;
	private String endTime;
	private String cperson;
	private Integer cj;
	private String id;
	private String submitTime;
	private Integer roleLevel;
	private String updateTime;
	private String ziguanName;
	private String szydBeginTime;
	private List<WhiteSubmit> whiteSubmitLists;
	private List<SysFile> fjs;
	private Integer isdo;
	private Integer dostatus;
	private String bz;
	private String contractId;
	private Date createTime;
	
	
	
	
	
	
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public String getContractId() {
		return contractId;
	}
	public void setContractId(String contractId) {
		this.contractId = contractId;
	}
	public String getBz() {
		return bz;
	}
	public void setBz(String bz) {
		this.bz = bz;
	}
	public Integer getDostatus() {
		return dostatus;
	}
	public void setDostatus(Integer dostatus) {
		this.dostatus = dostatus;
	}
	public Integer getIsdo() {
		return isdo;
	}
	public void setIsdo(Integer isdo) {
		this.isdo = isdo;
	}
	public List<SysFile> getFjs() {
		return fjs;
	}
	public void setFjs(List<SysFile> fjs) {
		this.fjs = fjs;
	}
	public String getSzydBeginTime() {
		return szydBeginTime;
	}
	public void setSzydBeginTime(String szydBeginTime) {
		this.szydBeginTime = szydBeginTime;
	}
	public List<WhiteSubmit> getWhiteSubmitLists() {
		return whiteSubmitLists;
	}
	public void setWhiteSubmitLists(List<WhiteSubmit> whiteSubmitLists) {
		this.whiteSubmitLists = whiteSubmitLists;
	}
	public String getZiguanName() {
		return ziguanName;
	}
	public void setZiguanName(String ziguanName) {
		this.ziguanName = ziguanName;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	public Integer getRoleLevel() {
		return roleLevel;
	}
	public void setRoleLevel(Integer roleLevel) {
		this.roleLevel = roleLevel;
	}
	public String getSubmitTime() {
		return submitTime;
	}
	public void setSubmitTime(String submitTime) {
		this.submitTime = submitTime;
	}
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	public String getZhLabel() {
		return zhLabel;
	}
	public void setZhLabel(String zhLabel) {
		this.zhLabel = zhLabel;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getSzydNo() {
		return szydNo;
	}
	public void setSzydNo(String szydNo) {
		this.szydNo = szydNo;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getCperson() {
		return cperson;
	}
	public void setCperson(String cperson) {
		this.cperson = cperson;
	}
	public Integer getCj() {
		return cj;
	}
	public void setCj(Integer cj) {
		this.cj = cj;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	

}
