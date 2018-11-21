package com.audit.modules.workflow.service.impl;

import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.workflow.simple.converter.WorkflowDefinitionConversion;
import org.activiti.workflow.simple.converter.WorkflowDefinitionConversionFactory;
import org.activiti.workflow.simple.definition.WorkflowDefinition;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.utils.Log;

/**
 * 稽核工作流转换器
 * 
 * @author luoyun
 */
public class AuditWorkflowDefinitionConversion extends WorkflowDefinitionConversion {

	/**
	 * 构造方法
	 * 
	 * @param factory 构造器工厂
	 * @param workflowDefinition 工作流定义
	 */
	public AuditWorkflowDefinitionConversion(WorkflowDefinitionConversionFactory factory,
			WorkflowDefinition workflowDefinition) {
		super(factory, workflowDefinition);
	}
	
	/***
	 * 获取xml内容 
	 */
	@Override
	public String getBpmn20Xml() {
		String result = null;
		try {
			if (bpmnModel == null) {
				convert();
			}
			BpmnXMLConverter bpmnXMLConverter = new BpmnXMLConverter();
			result = new String(bpmnXMLConverter.convertToXML(bpmnModel), "UTF-8");
		} catch (Exception e) {
			Log.error(e);
			throw new CommonException("转换XML文件失败");
		}
		return result;
	}
}
