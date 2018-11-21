package com.audit.modules.site.entity;

/**
 * @author : jiadu
 * @Description : 报站点和合同中间表
 * @date : 2017/4/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SiteMidContractInfo {
    private String id ;
    private String accountSiteId;//报账点ID
    private String contractId;//合同ID

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

    public String getContractId() {
        return contractId;
    }

    public void setContractId(String contractId) {
        this.contractId = contractId;
    }
}
