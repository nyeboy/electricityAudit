package com.audit.modules.electricity.vo;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

/**
 * @author 王松
 * @description
 *
 * @date 2017-5-4
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY //解析所有字段
        ,getterVisibility = JsonAutoDetect.Visibility.NONE)     //不解析get方法
public class ElectricityBenchmarkCheckVO {
    /**稽核单ID*/
    private String electricityId;
    /**稽核单流水号*/
    private String electricitySN;
    /**超标杆类型。1 额定功率；2 智能电表；3 开关电源；*/
    private String type;
    /**超标杆比例*/
    private double overProportion;

    public ElectricityBenchmarkCheckVO(String electricityId, String electricitySN, String type, double overProportion){
        this.electricityId = electricityId;
        this.electricitySN = electricitySN;
        this.type = type;
        this.overProportion = overProportion;
    }

	public String getElectricityId() {
		return electricityId;
	}

	public void setElectricityId(String electricityId) {
		this.electricityId = electricityId;
	}

	public String getElectricitySN() {
		return electricitySN;
	}

	public void setElectricitySN(String electricitySN) {
		this.electricitySN = electricitySN;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public double getOverProportion() {
		return overProportion;
	}

	public void setOverProportion(double overProportion) {
		this.overProportion = overProportion;
	}
}
