package com.audit.modules.payment.entity;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

/**
 * 预付单和电费稽核单中间表
 */

public class EleMidPaymentVO {
	private String id;
	private String advancePaymentID;//预付单id
	private String electricityID;//电费稽核单id
	private String expenseAmount;//核销金额
	 @DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date createDate;//创建时间内
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getAdvancePaymentID() {
		return advancePaymentID;
	}
	public void setAdvancePaymentID(String advancePaymentID) {
		this.advancePaymentID = advancePaymentID;
	}
	public String getElectricityID() {
		return electricityID;
	}
	public void setElectricityID(String electricityID) {
		this.electricityID = electricityID;
	}
	public String getExpenseAmount() {
		return expenseAmount;
	}
	public void setExpenseAmount(String expenseAmount) {
		this.expenseAmount = expenseAmount;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
}