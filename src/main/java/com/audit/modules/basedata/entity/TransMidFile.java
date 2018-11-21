package com.audit.modules.basedata.entity;
/**
 * @author : 
 * @Description : 附件中间表
 * @date :
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TransMidFile {
	private String id;
    private String businessId;//关联表ID
    private String transFileId;//附件表ID,TRANS_FILE_ID
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getBusinessId() {
		return businessId;
	}
	public void setBusinessId(String businessId) {
		this.businessId = businessId;
	}
	public String getTransFileId() {
		return transFileId;
	}
	public void setTransFileId(String transFileId) {
		this.transFileId = transFileId;
	}

}
