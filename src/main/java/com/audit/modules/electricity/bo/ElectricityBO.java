package com.audit.modules.electricity.bo;

/**
 * @author 王松
 * @description
 * 稽核单电量
 * @date 2017/5/23
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class ElectricityBO {
    /**稽核单ID*/
    private String electricityId;
    /**稽核单流水号*/
    private String electricitySN;
    /**报账点ID*/
    private String siteId;
    /**日期范围*/
    private int dateRange;
    /**总电量*/
    private double totalElectricity;

    public ElectricityBO (String electricityId, String electricitySN, String siteId, int dateRange, double totalElectricity){
        this.electricityId = electricityId;
        this.electricitySN = electricitySN;
        this.siteId = siteId;
        this.dateRange = dateRange;
        this.totalElectricity = totalElectricity;
    }

    public String getSiteId() {
        return siteId;
    }

    public int getDateRange() {
        return dateRange;
    }

    public double getTotalElectricity() {
        return totalElectricity;
    }

    public String getElectricitySN() {
        return electricitySN;
    }
}
