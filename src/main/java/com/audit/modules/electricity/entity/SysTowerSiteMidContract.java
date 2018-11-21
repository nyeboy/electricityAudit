package com.audit.modules.electricity.entity;

/**
 * @author : jiadu
 * @Description : 塔维站点和合同中间表
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SysTowerSiteMidContract {
    private String id;
    private String sysTowerSiteId;//塔维站点
    private String sysContractId;//合同ID

    public SysTowerSiteMidContract() {
        super();
    }

    public SysTowerSiteMidContract(String id, String sysTowerSiteId, String sysContractId) {
        this.id = id;
        this.sysTowerSiteId = sysTowerSiteId;
        this.sysContractId = sysContractId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSysTowerSiteId() {
        return sysTowerSiteId;
    }

    public void setSysTowerSiteId(String sysTowerSiteId) {
        this.sysTowerSiteId = sysTowerSiteId;
    }

    public String getSysContractId() {
        return sysContractId;
    }

    public void setSysContractId(String sysContractId) {
        this.sysContractId = sysContractId;
    }
}
