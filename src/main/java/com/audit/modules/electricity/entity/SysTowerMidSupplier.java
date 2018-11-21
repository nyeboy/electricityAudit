package com.audit.modules.electricity.entity;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SysTowerMidSupplier {
    private String id;
    private String sysTowerEleId;//塔维稽核单ID
    private String sysSupplier;//供应商ID

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSysTowerEleId() {
        return sysTowerEleId;
    }

    public void setSysTowerEleId(String sysTowerEleId) {
        this.sysTowerEleId = sysTowerEleId;
    }

    public String getSysSupplier() {
        return sysSupplier;
    }

    public void setSysSupplier(String sysSupplier) {
        this.sysSupplier = sysSupplier;
    }
}
