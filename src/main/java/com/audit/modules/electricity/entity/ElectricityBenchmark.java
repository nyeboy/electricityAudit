package com.audit.modules.electricity.entity;

import com.audit.modules.common.utils.StringUtils;

/**
 * @author 王松
 * @Description
 * 电费超标杆信息
 * @date 2017/3/16
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class ElectricityBenchmark {

    public static final int TYPE_POWER_RATING = 1;
    public static final int TYPE_SMART_METER = 2;
    public static final int TYPE_SWITCH_POWER = 3;

    private String id;
    /**稽核单ID*/
    private String electricityId;
    /**稽核单流水号*/
    private String electricitySN;
    /**超标杆类型。1 额定功率；2 智能电表；3 开关电源；*/
    private Integer type;
    /**标杆值*/
    private double benchmark;
    /**超标杆比例*/
    private double overProportion;
    /**原因*/
    private String reason;

    public ElectricityBenchmark(){
        this.id = StringUtils.getUUid();
    }

    public void setElectricityId(String electricityId) {
        this.electricityId = electricityId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public void setBenchmark(double benchmark) {
        this.benchmark = benchmark;
    }

    public void setOverProportion(double overProportion) {
        this.overProportion = overProportion;
    }

    /**
     * 获取类型的显示字符
     * @return
     */
    public String getTypeLabel(){
        String result = "额定功率";
        switch (type) {
            case TYPE_POWER_RATING :
                result = "额定功率";
                break;
            case TYPE_SMART_METER:
                result = "智能电表";
                break;
            case TYPE_SWITCH_POWER:
                result = "开关电源";
                break;
        }

        return result;
    }

    public double getBenchmark() {
        return benchmark;
    }

    public double getOverProportion() {
        return overProportion;
    }

    public String getReason() {
        return reason;
    }

    public String getElectricitySN() {
        return electricitySN;
    }

    public void setElectricitySN(String electricitySN) {
        this.electricitySN = electricitySN;
    }
}
