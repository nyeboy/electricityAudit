package com.audit.modules.electricity.entity;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SysTowerMidCostcenter {
    private String id;
    private String sysTowerEleId;//塔维稽核单ID
    private String sysCostCenterId;//成本中心

    public SysTowerMidCostcenter() {
        super();
    }

    public SysTowerMidCostcenter(String id, String sysTowerEleId, String sysCostCenterId) {
        this.id = id;
        this.sysTowerEleId = sysTowerEleId;
        this.sysCostCenterId = sysCostCenterId;
    }

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

    public String getSysCostCenterId() {
        return sysCostCenterId;
    }

    public void setSysCostCenterId(String sysCostCenterId) {
        this.sysCostCenterId = sysCostCenterId;
    }
}
