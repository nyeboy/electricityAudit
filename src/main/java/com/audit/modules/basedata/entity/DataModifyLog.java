package com.audit.modules.basedata.entity;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 
 * @Description: 基础数据维护 修改日志   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年5月4日 上午9:58:48
 */
public class DataModifyLog {
	
	
	//0自维 1塔维判断
	private String mobileType;
	// 修改Id
	private String id;
	// 原数据字段
	private String originalParams;
	// 新数据字段
	private String newParams;
	// 修改类型：C:新建，D:删除，U:修改';
	private String modifyType;
	// 表名
	private String tablName;
	// '修改申请ID';
	private String applyId;
	// 申请的用户ID
	private String applyUserId;
	// 修改时间
	private Date modifyTime;
	//基础数据的Id
	private String dataId;
	//原数据（用于页面展示）
	private List<Map<String,String>> originalDataList;
	//修改数据（用于页面展示）
	private List<Map<String,String>> modifyLogList;
	

	public String getOriginalParams() {
		return originalParams;
	}

	public void setOriginalParams(String originalParams) {
		this.originalParams = originalParams == null ? null : originalParams.trim();
	}

	public String getNewParams() {
		return newParams;
	}

	public void setNewParams(String newParams) {
		this.newParams = newParams == null ? null : newParams.trim();
	}

	public String getModifyType() {
		return modifyType;
	}

	public void setModifyType(String modifyType) {
		this.modifyType = modifyType == null ? null : modifyType.trim();
	}

	public String getTablName() {
		return tablName;
	}

	public void setTablName(String tablName) {
		this.tablName = tablName == null ? null : tablName.trim();
	}

	public String getApplyUserId() {
		return applyUserId;
	}

	public void setApplyUserId(String applyUserId) {
		this.applyUserId = applyUserId == null ? null : applyUserId.trim();
	}

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

	public String getId() {
		return id;
	}

	public String getApplyId() {
		return applyId;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setApplyId(String applyId) {
		this.applyId = applyId;
	}

	public List<Map<String, String>> getModifyLogList() {
		return modifyLogList;
	}

	public void setModifyLogList(List<Map<String, String>> modifyLogList) {
		this.modifyLogList = modifyLogList;
	}

	public List<Map<String, String>> getOriginalDataList() {
		return originalDataList;
	}

	public void setOriginalDataList(List<Map<String, String>> originalDataList) {
		this.originalDataList = originalDataList;
	}

	public String getDataId() {
		return dataId;
	}

	public void setDataId(String dataId) {
		this.dataId = dataId;
	}

	public String getMobileType() {
		return mobileType;
	}

	public void setMobileType(String mobileType) {
		this.mobileType = mobileType;
	}
}