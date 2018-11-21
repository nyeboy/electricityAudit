package com.audit.modules.electricity.entity;

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
	
    /*新添属性
     * 税金金额总额：taxAmountSum
     * 电费金额(不含税)总额：electricityAmountSum
     * 其他费用总额：otherCostSum
     * 总金额： amount
     * */
    private String taxAmountSum;//税金金额总额
    private String electricityAmountSum;//电费金额(不含税)总额
    private String otherCostSum;//其他费用总额
    private String amount;//总金额
	// 下级流程状态
	private Integer nextFlowState;
	
	// 是否为扭转节点
	private boolean reverse;

	// 是否有操作权限(true:是 false:否)
	private boolean operation;

	// 流程ID
	private String instanceId;

	// 事业实体
	private ElectrictyVO electricty;

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
	
	// 报账组(查询参数)
	private String qAccount;
	
	//地市Id(查询参数)
	private String cityId;
	
	//区县Id(查询参数)
	private String countyId;
	
	//录入人(查询参数)
	private String inputPerson;
	
	//报账点名称(查询参数)
	private String siteName;
		
	// 审批备注
	private String remark;
	
	//稽核类型
	private Integer auditType;
	
	private Integer rolelevel;
	

	public Integer getRolelevel() {
		return rolelevel;
	}

	public void setRolelevel(Integer rolelevel) {
		this.rolelevel = rolelevel;
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

	public String getInputPerson() {
		return inputPerson;
	}

	public void setInputPerson(String inputPerson) {
		this.inputPerson = inputPerson;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public Integer getAuditType() {
		return auditType;
	}

	public void setAuditType(Integer auditType) {
		this.auditType = auditType;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getTaxAmountSum() {
		return taxAmountSum;
	}

	public void setTaxAmountSum(String taxAmountSum) {
		this.taxAmountSum = taxAmountSum;
	}

	public String getElectricityAmountSum() {
		return electricityAmountSum;
	}

	public void setElectricityAmountSum(String electricityAmountSum) {
		this.electricityAmountSum = electricityAmountSum;
	}

	public String getOtherCostSum() {
		return otherCostSum;
	}

	public void setOtherCostSum(String otherCostSum) {
		this.otherCostSum = otherCostSum;
	}

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

	public ElectrictyVO getElectricty() {
		return electricty;
	}

	public void setElectricty(ElectrictyVO electricty) {
		this.electricty = electricty;
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

	public String getqAccount() {
		return qAccount;
	}

	public void setqAccount(String qAccount) {
		this.qAccount = qAccount;
	}

	public String getNextUserID() {
		return nextUserID;
	}

	public void setNextUserID(String nextUserID) {
		this.nextUserID = nextUserID;
	}
}
