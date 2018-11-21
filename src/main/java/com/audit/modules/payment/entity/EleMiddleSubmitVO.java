package com.audit.modules.payment.entity;

/**
 * @author : jiadu
 * @Description : 电费提交表和电费录入中间表
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class EleMiddleSubmitVO {
    private String id;
    private String sysPresubmitId;//预付提交表ID
    private String sysPreId;//预付表id

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

	public String getSysPresubmitId() {
		return sysPresubmitId;
	}

	public void setSysPresubmitId(String sysPresubmitId) {
		this.sysPresubmitId = sysPresubmitId;
	}

	public String getSysPreId() {
		return sysPreId;
	}

	public void setSysPreId(String sysPreId) {
		this.sysPreId = sysPreId;
	}

}
