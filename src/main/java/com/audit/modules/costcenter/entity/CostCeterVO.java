package com.audit.modules.costcenter.entity;

import java.io.Serializable;

/**
 * @author : jiadu
 * @Description : 成本中心VO
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class CostCeterVO implements Serializable{
    private static final long serialVersionUID = 1454724026164584548L;
    private String id;
    private String costCenterName;//成本中心名称

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCostCenterName() {
        return costCenterName;
    }

    public void setCostCenterName(String costCenterName) {
        this.costCenterName = costCenterName;
    }
}
