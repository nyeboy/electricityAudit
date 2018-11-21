package com.audit.modules.common.dict;

/**
 * 流程相关常量
 *
 * @author ly
 * @date : 2017年3月16日
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
 */
public final class FlowConstant {

	/** 流程状态变量名 */
	public static final String VARIABLE_FLOW_STATE_NAME = "flowState";

	/** 地市 */
	public static final String VARIABLE_cityId_NAME = "cityId";
	
	/** 区县 */
	public static final String VARIABLE_countyId_NAME = "countyId";
	
	/** 录入人 */
	public static final String VARIABLE_inputPerson_NAME = "inputPerson";
	
	/** 报账点名称 */
	public static final String VARIABLE_siteName_NAME = "siteName";
	
	/** 业务序号名变量名 */
	public static final String VARIABLE_SERIALNUMBER_NAME = "serialNumber";

	/** 扭转结点名 */
	public static final String VARIABLE_REVERSE_NAME = "reverseVar";
	
	/** 任务ID */
	public static final String VARIABLE_TASKID_NAME = "taskId";

	/** 任务用户ID */
	public static final String VARIABLE_USERID_NAME = "taskUserId";
	
	/** 流程发起人 */
	public static final String VARIABLE_USERID_START = "startUser";
	
	/** 流程处理人 */
	public static final String VARIABLE_HANDLE_PERSON = "handlePerson";

	/** 流程执行顺序 */
	public static final String VARIABLE_TASKSORT_NAME = "taskSortName";
	
	/** 流程类型 */
	public static final String VARIABLE_TASKSORT_TYPE = "taskType";
	
	/** 报账组名 */
	public static final String VARIABLE_ACCOUNT_NAME = "account";

	/** 结束(审批结束) */
	public static final Integer FLOW_STATE_END = -1;

	/** 驳回 */
	public static final Integer FLOW_STATE_REBUT = 0;

	/** 等待提交审批 */
	public static final Integer FLOW_APPROVAL_AWAITING = 1;

	/** 审批中 */
	public static final Integer FLOW_STATE_APPROVALING = 2;
	
	/** 已经推送 */
	public static final Integer FLOW_STATE_PUSH = 3;
	
	public static final String FLOW_BX_ROLE= "区县公司自维报销发起人";
	
	/** 超标 */
	public static final Integer EXCEED_STANDARD = 1;

	/** 未超标 */
	public static final Integer NOT_EXCEED_STANDARD = -1;
}
