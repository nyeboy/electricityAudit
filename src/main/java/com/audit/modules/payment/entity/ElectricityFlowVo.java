package com.audit.modules.payment.entity;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

/**
 * 电费审核实体
 *
 * @author ly
 * @date : 2017年3月14日
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
 */
public class ElectricityFlowVo {

	// 业务ID
	private String businessKey;

	// 流程状态(-1:结束、 0:被驳回、 1:等待审批、 2:审批中、 3:审批通过)
	private Integer flowState;
	
   
   
	// 下级流程状态
	private Integer nextFlowState;
	
	// 是否为扭转节点
	private boolean reverse;

	// 是否有操作权限(true:是 false:否)
	private boolean operation;

	// 流程ID
	private String instanceId;

	// 事业实体
	private AdvancePaymentVo adpv;

	// 审批状态值(-1、不通过 1、通过)
	private Integer approveState;

	// 当前处理人ID
	private String curOpUserID;
	
	// 下级处理人ID
	private String nextUserID;

	// 起始时间(查询参数)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date qStartTime;

	// 截至时间(查询参数)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date qEndTime;

	// 流水号(查询参数)
	private String qSerialNumber;
	
	
	// 审批备注
	private String remark;
	

	public String getBusinessKey() {
		return businessKey;
	}

	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
	}

	public Integer getFlowState() {
		return flowState;
	}

	public void setFlowState(Integer flowState) {
		this.flowState = flowState;
	}

	public Integer getNextFlowState() {
		return nextFlowState;
	}

	public void setNextFlowState(Integer nextFlowState) {
		this.nextFlowState = nextFlowState;
	}

	public boolean isReverse() {
		return reverse;
	}

	public void setReverse(boolean reverse) {
		this.reverse = reverse;
	}

	public boolean isOperation() {
		return operation;
	}

	public void setOperation(boolean operation) {
		this.operation = operation;
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

	public String getCurOpUserID() {
		return curOpUserID;
	}

	public void setCurOpUserID(String curOpUserID) {
		this.curOpUserID = curOpUserID;
	}

	public Date getqStartTime() {
		return qStartTime;
	}

	public void setqStartTime(Date qStartTime) {
		this.qStartTime = qStartTime;
	}

	public Date getqEndTime() {
		return qEndTime;
	}

	public void setqEndTime(Date qEndTime) {
		this.qEndTime = qEndTime;
	}

	public String getqSerialNumber() {
		return qSerialNumber;
	}

	public void setqSerialNumber(String qSerialNumber) {
		this.qSerialNumber = qSerialNumber;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}


	public AdvancePaymentVo getAdpv() {
		return adpv;
	}

	public void setAdpv(AdvancePaymentVo adpv) {
		this.adpv = adpv;
	}

	public String getNextUserID() {
		return nextUserID;
	}

	public void setNextUserID(String nextUserID) {
		this.nextUserID = nextUserID;
	}
}
