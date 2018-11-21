package com.audit.modules.workflow.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.activiti.workflow.simple.converter.WorkflowDefinitionConversion;
import org.activiti.workflow.simple.converter.WorkflowDefinitionConversionFactory;
import org.activiti.workflow.simple.converter.step.ChoiceStepsDefinitionConverter;
import org.activiti.workflow.simple.converter.step.DelayStepDefinitionConverter;
import org.activiti.workflow.simple.converter.step.FeedbackStepDefinitionConverter;
import org.activiti.workflow.simple.converter.step.ParallelStepsDefinitionConverter;
import org.activiti.workflow.simple.converter.step.ScriptStepDefinitionConverter;
import org.activiti.workflow.simple.converter.step.StepDefinitionConverter;
import org.activiti.workflow.simple.definition.WorkflowDefinition;

/**
 * 工作流转换工厂
 * 
 * @author luoyun
 */
public class AutoWorkflowDefinitionConversionFactory extends WorkflowDefinitionConversionFactory {

	/**
	 * 初始化
	 */
	@SuppressWarnings("rawtypes")
	@Override
	protected void initDefaultStepConverters() {
		List<StepDefinitionConverter> converters = new ArrayList<StepDefinitionConverter>();
		converters.add(new ParallelStepsDefinitionConverter());
		converters.add(new ChoiceStepsDefinitionConverter());
		converters.add(new AutoHumanStepDefinitionConverter());
		converters.add(new FeedbackStepDefinitionConverter());
		converters.add(new ScriptStepDefinitionConverter());
		converters.add(new DelayStepDefinitionConverter());
		setDefaultStepDefinitionConverters(converters);
	}
	
	/**
	 * 获取工作流转换器
	 * 
	 * @param workflowDefinition 工作流定义
	 * @return 工作流转换器
	 */
	@Override
	public WorkflowDefinitionConversion createWorkflowDefinitionConversion(WorkflowDefinition workflowDefinition) {
		return new AuditWorkflowDefinitionConversion(this, workflowDefinition);
	}
}
