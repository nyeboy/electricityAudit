package com.audit.modules.workflow.service;

import java.util.List;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.workflow.entity.WorkflowVo;

/**
 * 流程模板管理服务
 * 
 * @author luoyun
 */
public interface WorkflowManageService {

	/**
	 * 创建流程模板
	 * 
	 * @param vo 待创建模板
	 */
	void createModel(WorkflowVo vo);
	
	/**
	 * 查询已经部署的流程
	 * 
	 * @param vo 查询参数
	 * @param pageVo 分页
	 * @return 流程模型
	 */
	@SuppressWarnings("rawtypes")
	List<WorkflowVo> queryModel(WorkflowVo vo, PageUtil pageVo);
	
	/**
	 * 查询详情
	 * 
	 * @param definitionId 模板实例ID
	 * @return 模板实例
	 */
	WorkflowVo queryDetail(String definitionId);
}
