package com.audit.modules.electricity.entity;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

/**
 * @author : 袁礼斌
 * @Description : 塔维电费报销单VO
 * @date : 2017/5/2
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerReimburseVo {

	private Integer id;
	//电费报销提交单号
	private String reimburseNo;
	//经办人ID
	private String userId;
	// 经办人名字
	private String userName;
	//城市ID
	private Long cityId;
	private String cityName;
	//区县ID
    private Long countyId;
    private String countyName;
    //推送类型（0.报销）
    private Integer reimburseType;
    // 推送类型（显示使用）
    private String reimburseTypeName;
    //报销总金额
    private Double totalAmount;
    // 发票类型
    private String invoiceType;
    // 发票类型名
    private String invoiceTypeName;
    // 价款金额
    private Double priceAmount;
    // 税金金额
    private Double taxAmount;
	// 预付冲销金额
	private Double preAmount = 0d;
	// 付款金额
	private Double PayAmount = 0d;
    
    //状态（0.等待报销发起人推送财务1.等待推送财务 2.等待财务报销 3. 报销成功 4. 报销失败 5. 已撤销）
    private Integer status;
    // 状态(显示使用)
    private String statusName;
    //建单时间
    private Date createDate;
    private String timeStr;
	// 查询起始时间
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date startCreateDate;

	// 查询的结束时间
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date endCreateDate;
    
    //电费录入单
    private List<TowerElectrictyVO> towerElectrictys;
    private List<String> towerEleIds;
    
	// 是否具有操作权限
	private boolean operation;
    
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getReimburseNo() {
		return reimburseNo;
	}
	public void setReimburseNo(String reimburseNo) {
		this.reimburseNo = reimburseNo;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public Long getCityId() {
		return cityId;
	}
	public void setCityId(Long cityId) {
		this.cityId = cityId;
	}
	public Long getCountyId() {
		return countyId;
	}
	public void setCountyId(Long countyId) {
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
	public Integer getReimburseType() {
		return reimburseType;
	}
	public void setReimburseType(Integer reimburseType) {
		this.reimburseType = reimburseType;
	}
	public Double getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public List<TowerElectrictyVO> getTowerElectrictys() {
		return towerElectrictys;
	}
	public void setTowerElectrictys(List<TowerElectrictyVO> towerElectrictys) {
		this.towerElectrictys = towerElectrictys;
	}
	public List<String> getTowerEleIds() {
		return towerEleIds;
	}
	public void setTowerEleIds(List<String> towerEleIds) {
		this.towerEleIds = towerEleIds;
	}
	public String getTimeStr() {
		return timeStr;
	}
	public void setTimeStr(String timeStr) {
		this.timeStr = timeStr;
	}
	public String getInvoiceType() {
		return invoiceType;
	}
	public void setInvoiceType(String invoiceType) {
		this.invoiceType = invoiceType;
	}
	public Double getPriceAmount() {
		return priceAmount;
	}
	public void setPriceAmount(Double priceAmount) {
		this.priceAmount = priceAmount;
	}
	public Double getTaxAmount() {
		return taxAmount;
	}
	public void setTaxAmount(Double taxAmount) {
		this.taxAmount = taxAmount;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getReimburseTypeName() {
		return reimburseTypeName;
	}
	public void setReimburseTypeName(String reimburseTypeName) {
		this.reimburseTypeName = reimburseTypeName;
	}
	public String getStatusName() {
		return statusName;
	}
	public void setStatusName(String statusName) {
		this.statusName = statusName;
	}
	public String getInvoiceTypeName() {
		return invoiceTypeName;
	}
	public void setInvoiceTypeName(String invoiceTypeName) {
		this.invoiceTypeName = invoiceTypeName;
	}
	public Date getStartCreateDate() {
		return startCreateDate;
	}
	public void setStartCreateDate(Date startCreateDate) {
		this.startCreateDate = startCreateDate;
	}
	public Date getEndCreateDate() {
		return endCreateDate;
	}
	public void setEndCreateDate(Date endCreateDate) {
		this.endCreateDate = endCreateDate;
	}
	public Double getPreAmount() {
		return preAmount;
	}
	public void setPreAmount(Double preAmount) {
		this.preAmount = preAmount;
	}
	public Double getPayAmount() {
		return PayAmount;
	}
	public void setPayAmount(Double payAmount) {
		PayAmount = payAmount;
	}
	public boolean isOperation() {
		return operation;
	}
	public void setOperation(boolean operation) {
		this.operation = operation;
	}
}
