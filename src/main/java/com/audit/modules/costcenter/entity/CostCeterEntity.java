package com.audit.modules.costcenter.entity;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/6
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class CostCeterEntity {
    private String id;
    //EIP部门编号
    private String deploymentNo;
    //MIS公司代码
    private String misConpanyNo;
    //成本中心代码
    private String costCenterNo;
    //成本中心名字
    private String costCenterName;
    //排序号
    private Integer sortNo;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDeploymentNo() {
        return deploymentNo;
    }

    public void setDeploymentNo(String deploymentNo) {
        this.deploymentNo = deploymentNo;
    }

    public String getMisConpanyNo() {
        return misConpanyNo;
    }

    public void setMisConpanyNo(String misConpanyNo) {
        this.misConpanyNo = misConpanyNo;
    }

    public String getCostCenterNo() {
        return costCenterNo;
    }

    public void setCostCenterNo(String costCenterNo) {
        this.costCenterNo = costCenterNo;
    }

    public String getCostCenterName() {
        return costCenterName;
    }

    public void setCostCenterName(String costCenterName) {
        this.costCenterName = costCenterName;
    }

    public Integer getSortNo() {
        return sortNo;
    }

    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }
}
