package com.audit.modules.electricity.entity;

import java.io.Serializable;

/**
 * @author 王松
 * @description
 * 稽核单电表
 * @date 2017/5/5
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class ElectricityWatthourEntity implements Serializable {
    /**稽核单ID*/
    private String electricityId;
    /**报账点ID*/
    private String siteId;
    /**稽核单流水号*/
    private String electricitySN;
    /**电表ID*/
    private String watthourId;
    /**总电量*/
    private double totalElecitity;
    /**用电天数*/
    private int dateRange;

    public String getSiteId() {
        return siteId;
    }

    public String getElectricityId() {
        return electricityId;
    }

    public String getElectricitySN() {
        return electricitySN;
    }

    public double getTotalElecitity() {
        return totalElecitity;
    }

    public int getDateRange() {
        return dateRange;
    }
}