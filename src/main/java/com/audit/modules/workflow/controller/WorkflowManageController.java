package com.audit.modules.workflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.workflow.entity.WorkflowVo;
import com.audit.modules.workflow.service.WorkflowManageService;

/**
 * 自定义工作流管理
 * 
 * @author luoyun
 */
@Controller
@RequestMapping("workflowManage")
public class WorkflowManageController {

	@Autowired
	private WorkflowManageService workflowManageService;
	
	@RequestMapping("init")
	public String init(Model model) {
		return "workflow/manage_init";
	}
	
	/**
	 * 创建流程模板
	 * 
	 * @param vo 流程实例
	 * @return
	 */
	@RequestMapping("createModel")
	@ResponseBody
	public ResultVO createModel(@RequestBody WorkflowVo vo) {
		workflowManageService.createModel(vo);
		return ResultVO.success();
	}
	
	/**
	 * 查询流程
	 * 
	 * @param params 参数
	 * @return 流程
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping("queryWorkflowPage")
	@ResponseBody
	public ResultVO queryWorkflowPage(WorkflowVo params, PageUtil pageVo) {
		List<WorkflowVo> workflows = workflowManageService.queryModel(params, pageVo);
		pageVo.setResults(workflows);
		return ResultVO.success(pageVo);
	}
	
	/**
	 * 查询详情
	 * 
	 * @param definitionId 流程ID
	 * @return 详情
	 */
	@RequestMapping("queryDetail")
	@ResponseBody
	public ResultVO queryDetail(String definitionId) {
		WorkflowVo flow = workflowManageService.queryDetail(definitionId);
		return ResultVO.success(flow);
	}
}
