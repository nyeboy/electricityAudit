package com.audit.modules.site.entity;

/**
 * @author : jiadu
 * @Description : 报站点和电表中间表
 * @date : 2017/4/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SiteMidWattInfo {
    private String id ;
    private String accountSiteId;//报账点ID
    private String watthourMeterId;//电表ID

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccountSiteId() {
        return accountSiteId;
    }

    public void setAccountSiteId(String accountSiteId) {
        this.accountSiteId = accountSiteId;
    }

    public String getWatthourMeterId() {
        return watthourMeterId;
    }

    public void setWatthourMeterId(String watthourMeterId) {
        this.watthourMeterId = watthourMeterId;
    }
}
