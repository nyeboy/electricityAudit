package com.audit.modules.workflow.entity;

import com.audit.modules.system.entity.UserVo;

/**
 * 审批步骤
 * 
 * @author luoyun
 */
public class FlowSetpVo {

	// 步骤索引
	private Integer index;
	
	// 步骤名字
	private String stepName;
	
	// 流程节点类型(可变节点(variable) 固定节点(fixed))
	private String type;
	
	// 步骤审批人
	private String approver;
	
	// 审批人信息
	private UserVo user;
	
	// 当前是否为活动节点
	private boolean active;

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
		this.index = index;
	}

	public String getStepName() {
		return stepName;
	}

	public void setStepName(String stepName) {
		this.stepName = stepName;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getApprover() {
		return approver;
	}

	public void setApprover(String approver) {
		this.approver = approver;
	}

	public UserVo getUser() {
		return user;
	}

	public void setUser(UserVo user) {
		this.user = user;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
}
