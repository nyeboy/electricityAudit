package com.audit.modules.electricity.entity;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SysTowerMidWatthour {
    private String id;
    private String sysTowerEleId;//塔维稽核单ID
    private String sysTowerWatthourId;//塔维电表ID

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

    public String getSysTowerWatthourId() {
        return sysTowerWatthourId;
    }

    public void setSysTowerWatthourId(String sysTowerWatthourId) {
        this.sysTowerWatthourId = sysTowerWatthourId;
    }
}
