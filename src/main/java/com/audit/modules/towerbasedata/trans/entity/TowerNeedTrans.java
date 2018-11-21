package com.audit.modules.towerbasedata.trans.entity;

import java.util.Date;
import java.util.List;

public class TowerNeedTrans {
	//查看详情时保存的文件数据
	private List<TowerTransEleFile> transEleFiles;
	//角色状态
 	private String transLevel;
	//提交到流程的人的id
	private String addapoUserId;
	//提交到流程的人的名字
	private String addapoUserName;
	//附件id
	private String[] attachmentId;
	//流程id
	private String instanceId;
	//唯一id作为区分用的
	private String onlyId;
	//审批状态
	private String resultStatus;
	//提交状态	1 , 已提交至下一级  2 被撤回  3 改造完成    null '' 未提交
	private String submitStatus;
	//合同id
	private String contractId;
	//供应商ids
	private String supplierIds;
	//供应商名字
	private String supplierNames;
	//提交过来的人名字
	private String trusteesName;
	//提交过来的人id
	private String trusteesId;
	//备注
	private String remark;
	//站点供电类型
	private String siteEleType;
	//机房供电类型
	private String roomEleType;
	//铁塔站点名字
	private String towerSiteName;
	//铁塔站址编码
	private String towerSiteCode;
	//创建时间
	private Date createDate;
	//机房名字
	private String roomName;
	//市ID
	private String cityId;
	//区县ID
	private String countyId;
	//市名字
	private String cityName;
	//区县名字
	private String countyName;
	public String getTransLevel() {
		return transLevel;
	}
	public void setTransLevel(String transLevel) {
		this.transLevel = transLevel;
	}
	public String getAddapoUserId() {
		return addapoUserId;
	}
	public void setAddapoUserId(String addapoUserId) {
		this.addapoUserId = addapoUserId;
	}
	public String getAddapoUserName() {
		return addapoUserName;
	}
	public void setAddapoUserName(String addapoUserName) {
		this.addapoUserName = addapoUserName;
	}
	public String[] getAttachmentId() {
		return attachmentId;
	}
	public void setAttachmentId(String[] attachmentId) {
		this.attachmentId = attachmentId;
	}
	public String getInstanceId() {
		return instanceId;
	}
	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}
	public String getOnlyId() {
		return onlyId;
	}
	public void setOnlyId(String onlyId) {
		this.onlyId = onlyId;
	}
	public String getResultStatus() {
		return resultStatus;
	}
	public void setResultStatus(String resultStatus) {
		this.resultStatus = resultStatus;
	}
	public String getSubmitStatus() {
		return submitStatus;
	}
	public void setSubmitStatus(String submitStatus) {
		this.submitStatus = submitStatus;
	}
	public String getContractId() {
		return contractId;
	}
	public void setContractId(String contractId) {
		this.contractId = contractId;
	}
	public String getSupplierIds() {
		return supplierIds;
	}
	public void setSupplierIds(String supplierIds) {
		this.supplierIds = supplierIds;
	}
	public String getSupplierNames() {
		return supplierNames;
	}
	public void setSupplierNames(String supplierNames) {
		this.supplierNames = supplierNames;
	}
	public String getTrusteesName() {
		return trusteesName;
	}
	public void setTrusteesName(String trusteesName) {
		this.trusteesName = trusteesName;
	}
	public String getTrusteesId() {
		return trusteesId;
	}
	public void setTrusteesId(String trusteesId) {
		this.trusteesId = trusteesId;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getSiteEleType() {
		return siteEleType;
	}
	public void setSiteEleType(String siteEleType) {
		this.siteEleType = siteEleType;
	}
	public String getRoomEleType() {
		return roomEleType;
	}
	public void setRoomEleType(String roomEleType) {
		this.roomEleType = roomEleType;
	}
	public String getTowerSiteName() {
		return towerSiteName;
	}
	public void setTowerSiteName(String towerSiteName) {
		this.towerSiteName = towerSiteName;
	}
	public String getTowerSiteCode() {
		return towerSiteCode;
	}
	public void setTowerSiteCode(String towerSiteCode) {
		this.towerSiteCode = towerSiteCode;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
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
	public List<TowerTransEleFile> getTransEleFiles() {
		return transEleFiles;
	}
	public void setTransEleFiles(List<TowerTransEleFile> transEleFiles) {
		this.transEleFiles = transEleFiles;
	}

}
