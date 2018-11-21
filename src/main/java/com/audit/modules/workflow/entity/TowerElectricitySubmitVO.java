package com.audit.modules.workflow.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.audit.modules.electricity.entity.TowerElectrictyVO;

/**
 * 塔维电费提交表实体
 * 
 * @author luoyun
 */
public class TowerElectricitySubmitVO {

	// ID
	private String id;
	
	// 经办人ID
	private String trustees;
	
	// 城市ID
	private String city;
	
	// 县区ID
	private String county;
	
	// 状态（0.等待报销发起人推送财务1.等待推送财务 2.等待财务报销 3. 报销成功 4. 报销失败 5. 已撤销）
	private Integer status;
	
	// 推送类型（0.报销）
	private Integer reimbursementType;
	
	// 价款总金额
	private BigDecimal totalAmount;
	
	// 税金总金额
	private BigDecimal taxAmount;
	
	// 电费录入单IDS
	private List<String> ids;
	
	// 建单时间
	private Date createDate;
	
	// 电费提交单号
	private String submitNo;
	
	// 开始时间（yyyy-MM-dd）页面查询用
	private Date startCreateDate;
	
	// 结束时间(yyyy-MM-dd)页面查询用
	private Date endCreateDate;
	
	// 城市名
	private String cityName;
	
	// 区县名
	private String countyName;
	
	// 电费录入表单
	private List<TowerElectrictyVO> electrictyListVOs;
	
	// 发票类型
	private Integer invoiceType;
	
	// 报销总金额
	private BigDecimal totalReimbursement;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTrustees() {
		return trustees;
	}

	public void setTrustees(String trustees) {
		this.trustees = trustees;
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

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getReimbursementType() {
		return reimbursementType;
	}

	public void setReimbursementType(Integer reimbursementType) {
		this.reimbursementType = reimbursementType;
	}

	public BigDecimal getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(BigDecimal totalAmount) {
		this.totalAmount = totalAmount;
	}

	public BigDecimal getTaxAmount() {
		return taxAmount;
	}

	public void setTaxAmount(BigDecimal taxAmount) {
		this.taxAmount = taxAmount;
	}

	public List<String> getIds() {
		return ids;
	}

	public void setIds(List<String> ids) {
		this.ids = ids;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getSubmitNo() {
		return submitNo;
	}

	public void setSubmitNo(String submitNo) {
		this.submitNo = submitNo;
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

	public List<TowerElectrictyVO> getElectrictyListVOs() {
		return electrictyListVOs;
	}

	public void setElectrictyListVOs(List<TowerElectrictyVO> electrictyListVOs) {
		this.electrictyListVOs = electrictyListVOs;
	}

	public Integer getInvoiceType() {
		return invoiceType;
	}

	public void setInvoiceType(Integer invoiceType) {
		this.invoiceType = invoiceType;
	}

	public BigDecimal getTotalReimbursement() {
		return totalReimbursement;
	}

	public void setTotalReimbursement(BigDecimal totalReimbursement) {
		this.totalReimbursement = totalReimbursement;
	}
}
