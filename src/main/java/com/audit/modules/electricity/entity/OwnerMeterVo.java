package com.audit.modules.electricity.entity;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.audit.modules.common.utils.DateUtil;

/**
 * @author 袁礼斌
 * @Description 业主信息实体
 * @date 2017/4/21 Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class OwnerMeterVo {

	//主键ID
	private String ownerId;
	// 市
	private String cityId;
	private String cityName;
	// 区县
	private String countyId;
	private String countyName;
	// 业主名称
	private String ownerName;
	// 业主开户银行*
	private String bankName;
	// 业主银行账号*
	private String bankAccount;
	// 供应商*
	private String supplier;
	// 用电协议单位*
	private String useCompany;
	// 用电协议起始日期*
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date startTime;
	// 用电协议终止日期*
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date endTime;
	//时间格式化
	private String startTimeStr; //时间格String
	private String endTimeStr;
	// 用电协议单价*
	private Double price;
	//电表列表信息
	private List<MeterVo> meterList;
	
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
	
	//模糊查询参数
	private String vague;
	
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
	public String getOwnerId() {
		return ownerId;
	}
	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
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
	public String getOwnerName() {
		return ownerName;
	}
	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
	}
	public String getBankName() {
		return bankName;
	}
	public void setBankName(String bankName) {
		this.bankName = bankName;
	}
	public String getBankAccount() {
		return bankAccount;
	}
	public void setBankAccount(String bankAccount) {
		this.bankAccount = bankAccount;
	}
	public String getSupplier() {
		return supplier;
	}
	public void setSupplier(String supplier) {
		this.supplier = supplier;
	}
	
	public String getUseCompany() {
		return useCompany;
	}
	public void setUseCompany(String useCompany) {
		this.useCompany = useCompany;
	}
	public Date getStartTime() {
		return startTime;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	public String getStartTimeStr() {
		return startTimeStr;
	}
	public void setStartTimeStr(String startTimeStr) {
		this.startTimeStr = startTimeStr;
		try {
			this.setStartTime(DateUtil.parseFromPage(startTimeStr));
		} catch (ParseException e) {

		}
	}
	public String getEndTimeStr() {
		return endTimeStr;
	}
	public void setEndTimeStr(String endTimeStr) {
		this.endTimeStr = endTimeStr;
		try {
			this.setEndTime(DateUtil.parseFromPage(endTimeStr));
		} catch (ParseException e) {

		}
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public List<MeterVo> getMeterList() {
		return meterList;
	}
	public void setMeterList(List<MeterVo> meterList) {
		this.meterList = meterList;
	}
	public String getVague() {
		return vague;
	}
	public void setVague(String vague) {
		this.vague = vague;
	}
	@Override
	public String toString() {
		return "OwnerVo [ownerId=" + ownerId + ", cityId=" + cityId + ", cityName=" + cityName + ", countyId="
				+ countyId + ", countyName=" + countyName + ", ownerName=" + ownerName + ", bankName=" + bankName
				+ ", bankAccount=" + bankAccount + ", supplier=" + supplier + ", useCompany=" + useCompany
				+ ", startTime=" + startTime + ", endTime=" + endTime + ", startTimeStr=" + startTimeStr
				+ ", endTimeStr=" + endTimeStr + ", price=" + price + ", meterList=" + meterList + ", vague=" + vague
				+ "]";
	}
	
}
