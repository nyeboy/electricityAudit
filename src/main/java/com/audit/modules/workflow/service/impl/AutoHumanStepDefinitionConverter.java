package com.audit.modules.workflow.service.impl;

import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.UserTask;
import org.activiti.workflow.simple.converter.WorkflowDefinitionConversion;
import org.activiti.workflow.simple.converter.step.HumanStepDefinitionConverter;
import org.activiti.workflow.simple.definition.HumanStepDefinition;
import org.springframework.util.StringUtils;

/**
 * 用户流程步骤转换器
 * 
 * @author luoyun
 */
public class AutoHumanStepDefinitionConverter extends HumanStepDefinitionConverter{

	private String recoredId;
	
	@Override
	protected UserTask createProcessArtifact(HumanStepDefinition stepDefinition,
			WorkflowDefinitionConversion conversion) {
		UserTask userTask = createUserTask(stepDefinition, conversion);
		boolean isFirstTask = isFirstTask(conversion.getProcess());
		if (conversion.isSequenceflowGenerationEnabled()) {
			addSequenceFlow(conversion, conversion.getLastActivityId(), userTask.getId(), "${approved == 1}");
		}
		conversion.getProcess().addFlowElement(userTask);
		if (conversion.isUpdateLastActivityEnabled()) {
			conversion.setLastActivityId(userTask.getId());
		}
		// 设置回退节点
		if (isFirstTask) {
			recoredId = userTask.getId();
		} else {
			addSequenceFlow(conversion, conversion.getLastActivityId(), recoredId, "${approved == -1}");
		}
		
		// 扭转条件
		if (!StringUtils.isEmpty(stepDefinition.getParameters().get("reverse"))
				&& (Boolean) stepDefinition.getParameters().get("reverse")) {
			addSequenceFlow(conversion, conversion.getLastActivityId(), "end", "${approved == 2}");
		}
		return userTask;
	}
	
	private boolean isFirstTask(Process process) {
		if (null != process.getFlowElements() && !process.getFlowElements().isEmpty()) {
			for (FlowElement flowElement : process.getFlowElements()) {
				if (flowElement instanceof UserTask) {
					return false;
				}
			}
		}
		return true;
	}
}
