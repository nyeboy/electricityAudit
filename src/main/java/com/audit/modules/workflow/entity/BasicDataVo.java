package com.audit.modules.workflow.entity;

import com.audit.modules.basedata.entity.DataModifyApply;

/**
 * 基础数据变更实体
 * 
 * @author luoyun
 */
public class BasicDataVo {
	//0自维 1 塔维
	private String mobileType;

	// 业务ID
	private String businessKey;
	
	// 当前处理人ID
	private String curOpUserID;
	
	// 地市
	private String city;
	
	// 区县
	private String county;
	
	// 变更类型
	private String changeType;
	
	// 发起人
	private String sponsor;
	
	// 流程ID
	private String instanceId;
	
	// 审批状态值(-1、不通过 1、通过)
	private Integer approveState;
	
	// 是否为最后审批节点
	private boolean isLast;
	
	// 变更申请信息
	private DataModifyApply aataModifyApply;

	public String getBusinessKey() {
		return businessKey;
	}

	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
	}

	public String getCurOpUserID() {
		return curOpUserID;
	}

	public void setCurOpUserID(String curOpUserID) {
		this.curOpUserID = curOpUserID;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCounty() {
		return county;
	}

	public void setCounty(String county) {
		this.county = county;
	}

	public String getChangeType() {
		return changeType;
	}

	public void setChangeType(String changeType) {
		this.changeType = changeType;
	}

	public String getSponsor() {
		return sponsor;
	}

	public void setSponsor(String sponsor) {
		this.sponsor = sponsor;
	}

	public String getInstanceId() {
		return instanceId;
	}

	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}

	public Integer getApproveState() {
		return approveState;
	}

	public void setApproveState(Integer approveState) {
		this.approveState = approveState;
	}

	public boolean isLast() {
		return isLast;
	}

	public void setLast(boolean isLast) {
		this.isLast = isLast;
	}

	public DataModifyApply getAataModifyApply() {
		return aataModifyApply;
	}

	public void setAataModifyApply(DataModifyApply aataModifyApply) {
		this.aataModifyApply = aataModifyApply;
	}

	public String getMobileType() {
		return mobileType;
	}

	public void setMobileType(String mobileType) {
		this.mobileType = mobileType;
	}
}
