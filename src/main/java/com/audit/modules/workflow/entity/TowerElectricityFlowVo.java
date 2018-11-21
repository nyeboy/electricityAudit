package com.audit.modules.workflow.entity;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.audit.modules.electricity.entity.TowerSaveVO;

/**
 * 塔维流程实体
 * 
 * @author luoyun
 */
public class TowerElectricityFlowVo {

	// 业务ID
	private String businessKey;

	// 是否有操作权限
	private boolean operation;

	// 流程ID
	private String instanceId;

	// 审批状态值
	private Integer approveState;

	// 流程当前处理人
	private String curOpUserID;
	
	// 下级审批人
	private String nextUserID;

	// 流程状态
	private Integer flowState;

	// 起始时间
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date qStartTime;

	// 截止时间
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date qEndTime;

	// 地市
	private String qCity;

	// 区县
	private String qCounty;

	// 铁塔站址编号
	private String qCounterNumber;
	
	// 资管站点名称
	private String qCounterName;

	// 超标状态
	private Integer qOverState;

	// 稽核流水号
	private String qSerialNumber;

	// 分担总金额
	private String qShareMoney;
	
	// 是否为扭转节点
	private boolean reverse;
	
	// 下级流程状态
	private Integer nextFlowState;
	
	// 电费相关信息
	private TowerSaveVO towerInfo;

	public String getBusinessKey() {
		return businessKey;
	}

	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
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

	public Integer getFlowState() {
		return flowState;
	}

	public void setFlowState(Integer flowState) {
		this.flowState = flowState;
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

	public String getqCity() {
		return qCity;
	}

	public void setqCity(String qCity) {
		this.qCity = qCity;
	}

	public String getqCounty() {
		return qCounty;
	}

	public void setqCounty(String qCounty) {
		this.qCounty = qCounty;
	}

	public String getqCounterNumber() {
		return qCounterNumber;
	}

	public void setqCounterNumber(String qCounterNumber) {
		this.qCounterNumber = qCounterNumber;
	}

	public String getqCounterName() {
		return qCounterName;
	}

	public void setqCounterName(String qCounterName) {
		this.qCounterName = qCounterName;
	}

	public Integer getqOverState() {
		return qOverState;
	}

	public void setqOverState(Integer qOverState) {
		this.qOverState = qOverState;
	}

	public String getqSerialNumber() {
		return qSerialNumber;
	}

	public void setqSerialNumber(String qSerialNumber) {
		this.qSerialNumber = qSerialNumber;
	}

	public String getqShareMoney() {
		return qShareMoney;
	}

	public void setqShareMoney(String qShareMoney) {
		this.qShareMoney = qShareMoney;
	}

	public boolean isReverse() {
		return reverse;
	}

	public void setReverse(boolean reverse) {
		this.reverse = reverse;
	}

	public Integer getNextFlowState() {
		return nextFlowState;
	}

	public void setNextFlowState(Integer nextFlowState) {
		this.nextFlowState = nextFlowState;
	}

	public TowerSaveVO getTowerInfo() {
		return towerInfo;
	}

	public void setTowerInfo(TowerSaveVO towerInfo) {
		this.towerInfo = towerInfo;
	}

	public String getNextUserID() {
		return nextUserID;
	}

	public void setNextUserID(String nextUserID) {
		this.nextUserID = nextUserID;
	}
}
