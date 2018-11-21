package com.audit.modules.basedata.entity;

import java.util.Date;
import java.util.List;

import com.google.common.collect.Lists;

/**
 * 
 * @Description: 转供电插入记录实体类 SYS_TRANSELEPOWER_SUBMIT 审批用户实体类也可以
 * @throws  
 * @author  noone
 * @date 2017年1月8日 
 */
public class AccountSiteTransSubmit {
	//审批参数1通过-1驳回
	private Integer approveState;
	//查看详情用的具体数据，SYS_ZGROOM_TRANS_MID中的数据
	private AccountSiteNeedTrans needTrans;
	// 数据维护访问地址
	private String url;
	// 参数和值
	private String params;
	//站点id
	private String siteId;
	//机房id
	private String roomId;
	//机房名字
	private String roomName;
	//0自维 1塔维 判断
	private String mobileType;
	// 审批人用户Id
	private String approveUserId;
	//业务 ID 基础数据修改申请Id
	private String applyId;
	//流程id
	private String instanceId;
	//市id
	private String cityId;
	//区县id
	private String countyId;
	//审批状态:0:待审批,1：审批通过，2：审批失败 ,3:已执行
	private String status;
	//创建时间
	private Date createDate;
	//经办人id，申请人id,当前处理人
	private String trusteesId;
	//经办人名字，申请人名字,当前处理人
	private String trusteesName;
	//站点名称
	private String siteName;
	//产权性质（0.自维 1.塔维）
	private String properType;
	//市名字
	private String cityName;
	//区县名字
	private String countyName;
	public String getApplyId() {
		return applyId;
	}
	public void setApplyId(String applyId) {
		this.applyId = applyId;
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
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getTrusteesId() {
		return trusteesId;
	}
	public void setTrusteesId(String trusteesId) {
		this.trusteesId = trusteesId;
	}
	public String getSiteName() {
		return siteName;
	}
	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}
	public String getProperType() {
		return properType;
	}
	public void setProperType(String properType) {
		this.properType = properType;
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
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public String getTrusteesName() {
		return trusteesName;
	}
	public void setTrusteesName(String trusteesName) {
		this.trusteesName = trusteesName;
	}
	public String getInstanceId() {
		return instanceId;
	}
	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}
	public String getMobileType() {
		return mobileType;
	}
	public void setMobileType(String mobileType) {
		this.mobileType = mobileType;
	}
	public String getApproveUserId() {
		return approveUserId;
	}
	public void setApproveUserId(String approveUserId) {
		this.approveUserId = approveUserId;
	}
	public String getSiteId() {
		return siteId;
	}
	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}
	public String getRoomId() {
		return roomId;
	}
	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getParams() {
		return params;
	}
	public void setParams(String params) {
		this.params = params;
	}
	public AccountSiteNeedTrans getNeedTrans() {
		return needTrans;
	}
	public void setNeedTrans(AccountSiteNeedTrans needTrans) {
		this.needTrans = needTrans;
	}
	public Integer getApproveState() {
		return approveState;
	}
	public void setApproveState(Integer approveState) {
		this.approveState = approveState;
	}
}
