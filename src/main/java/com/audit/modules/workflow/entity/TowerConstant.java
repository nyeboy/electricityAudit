package com.audit.modules.workflow.entity;

public final class TowerConstant {

	/** 流程状态 */
	public static final String FLOW_STATE_NAME = "flowState";
	
	/** 扭转结点名 */
	public static final String VARIABLE_REVERSE_NAME = "reverseVar";

	/** 流程执行顺序 */
	public static final String VARIABLE_TASKSORT_NAME = "taskSortName";
	
	/** 任务ID */
	public static final String VARIABLE_TASKID_NAME = "taskId";

	/** 任务用户ID */
	public static final String VARIABLE_USERID_NAME = "taskUserId";
	
	/** 流程发起人 */
	public static final String VARIABLE_USERID_START = "startUser";
	
	/** 流程处理人 */
	public static final String VARIABLE_HANDLE_PERSON = "handlePerson";
	
	/** 城市 */
	public static final String CITY_NAME = "city";
	
	/** 区县 */
	public static final String COUNTY_NAME = "county";
	
	/** 铁塔站址编号 */
	public static final String COUNTER_NUMBER_NAME = "counterNumber";
	
	/** 资管站点名称 */
	public static final String COUNTER_NAME = "counterName";
	
	/** 超标状态 */
	public static final String OVER_STATE_NAME = "overState";
	
	/** 稽核流水号 */
	public static final String SERIAL_NUMBER_NAME = "serialNumber";
	
	/** 分担总金额 */
	public static final String SHARE_MONEY_NAME = "shareMoney";
	
	/** 流程类型 */
	public static final String VARIABLE_TASKSORT_TYPE = "taskType";

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
	
	/** 报销人角色名 */
	public static final String FLOW_BX_ROLE= "区县公司塔维报销发起人";
	
	/** 超标 */
	public static final Integer EXCEED_STANDARD = 1;

	/** 未超标 */
	public static final Integer NOT_EXCEED_STANDARD = -1;
}
