package com.audit.modules.site.entity;

/**
 * @author : jiadu
 * @Description : 报站点和供应商中间表
 * @date : 2017/4/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SiteMidSupplierInfo {
    private String id ;
    private String accountSiteId;//报账点ID
    private String supplierId;//供应商ID

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

    public String getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }
}
