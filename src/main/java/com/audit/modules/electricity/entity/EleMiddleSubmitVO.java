package com.audit.modules.electricity.entity;

/**
 * @author : jiadu
 * @Description : 电费提交表和电费录入中间表
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class EleMiddleSubmitVO {
    private String id;
    private String sysEleSubmitId;//电费提交表ID
    private String sysElectricityId;//电费录入表ID

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSysEleSubmitId() {
        return sysEleSubmitId;
    }

    public void setSysEleSubmitId(String sysEleSubmitId) {
        this.sysEleSubmitId = sysEleSubmitId;
    }

    public String getSysElectricityId() {
        return sysElectricityId;
    }

    public void setSysElectricityId(String sysElectricityId) {
        this.sysElectricityId = sysElectricityId;
    }
}
