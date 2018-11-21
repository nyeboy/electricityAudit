package com.audit.modules.electricity.entity;

/**
 * @author 袁礼斌
 * @Description 业主电表信息
 * @date 2017/4/21 Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class MeterVo {

	//主键ID
	private String meterId;
	//业主ID
	private String ownerId;
	// 电表号
	private String meterNumber;
	// 电表标识符
	private String meterIdentifier;
	// 电表户号
	private String meterAccout;
	// 用电类型
	private String meterType;
	// 用电用途*
	private String meterPurpose;
	
	public String getMeterId() {
		return meterId;
	}
	public void setMeterId(String meterId) {
		this.meterId = meterId;
	}
	public String getOwnerId() {
		return ownerId;
	}
	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}
	public String getMeterNumber() {
		return meterNumber;
	}
	public void setMeterNumber(String meterNumber) {
		this.meterNumber = meterNumber;
	}
	public String getMeterIdentifier() {
		return meterIdentifier;
	}
	public void setMeterIdentifier(String meterIdentifier) {
		this.meterIdentifier = meterIdentifier;
	}
	public String getMeterAccout() {
		return meterAccout;
	}
	public void setMeterAccout(String meterAccout) {
		this.meterAccout = meterAccout;
	}
	public String getMeterType() {
		return meterType;
	}
	public void setMeterType(String meterType) {
		this.meterType = meterType;
	}
	public String getMeterPurpose() {
		return meterPurpose;
	}
	public void setMeterPurpose(String meterPurpose) {
		this.meterPurpose = meterPurpose;
	}
	@Override
	public String toString() {
		return "MeterVo [meterId=" + meterId + ", ownerId=" + ownerId + ", meterNumber=" + meterNumber
				+ ", meterIdentifier=" + meterIdentifier + ", meterAccout=" + meterAccout + ", meterType=" + meterType
				+ ", meterPurpose=" + meterPurpose + "]";
	}
	
}
