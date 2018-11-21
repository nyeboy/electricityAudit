package com.audit.modules.electricity.entity;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

/**
 * @author 王松
 * @Description
 * 超标杆
 * @date 2017/3/16
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY //解析所有字段
        ,getterVisibility = JsonAutoDetect.Visibility.NONE)     //不解析get方法
public class BenchmarkVO {
    /**超标杆类型。1 额定功率；2 智能电表；3 开关电源；*/
    private String type;
    /**标杆值*/
    private double benchmark;
    /**超标杆比例*/
    private double overProportion;
    /**原因*/
    private String reason;

    public BenchmarkVO(ElectricityBenchmark benchmark){
        this.type = benchmark.getTypeLabel();
        this.benchmark = benchmark.getBenchmark();
        this.overProportion = benchmark.getOverProportion();
        this.reason = benchmark.getReason();
    }

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public double getBenchmark() {
		return benchmark;
	}

	public void setBenchmark(double benchmark) {
		this.benchmark = benchmark;
	}

	public double getOverProportion() {
		return overProportion;
	}

	public void setOverProportion(double overProportion) {
		this.overProportion = overProportion;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}
}
