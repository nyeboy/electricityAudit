package com.audit.modules.workflow.entity;

import java.util.ArrayList;
import java.util.List;

/**
 * 流程模板实体
 * 
 * @author luoyun
 */
public class WorkflowVo {

	// modelId
	private String modelId;

	// 流程名字
	private String name;
	
	// 流程类型(1、自维(mandimension) 2、塔维(pagodadimension) 3、基础数据变更(basicdata))
	private String type;
	
	// 流程类型显示
	private String typeStr;

	// 流程说明
	private String desc;

	// 地市(编号)
	private String city;

	// 地市(名字)
	private String cityStr;

	// 区县(编号)
	private String county;
	
	// 区县(名字)
	private String countyStr;
	
	// 模块实例ID
	private String definitionId;
	
	// 可变审批节点
	private List<FlowSetpVo> variableSetps = new ArrayList<>();

	// 固定审批节点
	private List<FlowSetpVo> fixedSetps = new ArrayList<>();

	public String getModelId() {
		return modelId;
	}

	public void setModelId(String modelId) {
		this.modelId = modelId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCityStr() {
		return cityStr;
	}

	public void setCityStr(String cityStr) {
		this.cityStr = cityStr;
	}

	public String getCounty() {
		return county;
	}

	public void setCounty(String county) {
		this.county = county;
	}

	public String getCountyStr() {
		return countyStr;
	}

	public void setCountyStr(String countyStr) {
		this.countyStr = countyStr;
	}

	public List<FlowSetpVo> getVariableSetps() {
		return variableSetps;
	}

	public void setVariableSetps(List<FlowSetpVo> variableSetps) {
		this.variableSetps = variableSetps;
	}

	public List<FlowSetpVo> getFixedSetps() {
		return fixedSetps;
	}

	public void setFixedSetps(List<FlowSetpVo> fixedSetps) {
		this.fixedSetps = fixedSetps;
	}

	public String getDefinitionId() {
		return definitionId;
	}

	public void setDefinitionId(String definitionId) {
		this.definitionId = definitionId;
	}

	public String getTypeStr() {
		return typeStr;
	}

	public void setTypeStr(String typeStr) {
		this.typeStr = typeStr;
	}
}
