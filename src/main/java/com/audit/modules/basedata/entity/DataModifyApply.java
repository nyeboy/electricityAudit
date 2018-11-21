package com.audit.modules.basedata.entity;

import java.util.Date;
/**
 * 
 * @Description: 基础数据维护 修改申请    
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年5月4日 上午9:59:20
 */
public class DataModifyApply {
	
	//0自维 1塔维 判断
	private String mobileType;
	// 基础数据修改申请Id
	private String id;
	// 申请人用户Id
	private String applyUserId;
	// 申请人姓名
	private String applyUserName;
	// 变更时间
	private Date changeTime;
	// 变更状态: 0:待审批,1：审批通过,2：审批失败 ,3:已执行
	private String changeStatus;
	// 城市Id
	private String cityId;
	// 城市名
	private String cityName;
	// 区县Id
	private String countyId;
	// 区县name
	private String countyName;
	// 备注
	private String remarks;
	// '变更类型:供应商管理,供电管理,发票管理,额定功率管理,报账点管理,其他信息管理,业主管理,业主电表管理,转供电管理;
	private String changeType;
	// 修改对象jsonStr
	private String changeObject;
	// 数据维护访问地址
	private String url;
	// 参数和值
	private String params;
	// 审批人用户Id
	private String approveUserId;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getApplyUserId() {
		return applyUserId;
	}

	public void setApplyUserId(String applyUserId) {
		this.applyUserId = applyUserId == null ? null : applyUserId.trim();
	}

	public String getApplyUserName() {
		return applyUserName;
	}

	public void setApplyUserName(String applyUserName) {
		this.applyUserName = applyUserName;
	}

	public Date getChangeTime() {
		return changeTime;
	}

	public void setChangeTime(Date changeTime) {
		this.changeTime = changeTime;
	}

	public String getChangeStatus() {
		return changeStatus;
	}

	public void setChangeStatus(String changeStatus) {
		this.changeStatus = changeStatus == null ? null : changeStatus.trim();
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

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks == null ? null : remarks.trim();
	}

	public String getChangeType() {
		return changeType;
	}

	public void setChangeType(String changeType) {
		this.changeType = changeType == null ? null : changeType.trim();
	}

	public String getChangeObject() {
		return changeObject;
	}

	public void setChangeObject(String changeObject) {
		this.changeObject = changeObject == null ? null : changeObject.trim();
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url == null ? null : url.trim();
	}

	public String getParams() {
		return params;
	}

	public void setParams(String params) {
		this.params = params == null ? null : params.trim();
	}

	public String getApproveUserId() {
		return approveUserId;
	}

	public void setApproveUserId(String approveUserId) {
		this.approveUserId = approveUserId == null ? null : approveUserId.trim();
	}

	public String getCityName() {
		return cityName;
	}

	public String getCountyName() {
		return countyName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public void setCountyName(String countyName) {
		this.countyName = countyName;
	}

	public String getMobileType() {
		return mobileType;
	}

	public void setMobileType(String mobileType) {
		this.mobileType = mobileType;
	}
}