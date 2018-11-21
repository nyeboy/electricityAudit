package com.audit.modules.workflow.dao;

import java.util.List;

import org.activiti.engine.repository.ProcessDefinition;

import com.audit.modules.common.mybatis.PageUtil;

/**
 * 流程定义查询
 * 
 * @author ly
 */
public interface WorkflowManageDao {

	/**
	 * 查询自宝义流程
	 * 
	 * @param params 参数
	 * @param pageVo 分页
	 * @return 流程
	 */
	@SuppressWarnings("rawtypes")
	List<ProcessDefinition> queryFlowInfo(PageUtil pageVo);
}
