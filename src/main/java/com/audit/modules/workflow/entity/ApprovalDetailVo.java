package com.audit.modules.workflow.entity;

import com.audit.modules.system.entity.UserVo;

/**
 * 审批过程
 * 
 * @author luoyun
 */
public class ApprovalDetailVo {

	// 用户
	private UserVo user;

	// 时间
	private String time;

	// 意见
	private String suggestion;

	// 操作类型
	private String opType;

	public UserVo getUser() {
		return user;
	}

	public void setUser(UserVo user) {
		this.user = user;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getSuggestion() {
		return suggestion;
	}

	public void setSuggestion(String suggestion) {
		this.suggestion = suggestion;
	}

	public String getOpType() {
		return opType;
	}

	public void setOpType(String opType) {
		this.opType = opType;
	}
}
