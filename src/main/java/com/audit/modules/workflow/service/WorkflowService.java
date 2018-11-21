package com.audit.modules.workflow.service;

import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;

import com.audit.modules.common.PageVO;
import com.audit.modules.electricity.entity.ElectricityFlowVo;

/**
 * @Description: 业务流程处理接口类
 * 
 * @author  礼斌
 * @date 2017年3月8日 下午3:07:36
 */
public interface WorkflowService {

	/**
	 * 流程定义列表查询
	 * @param pageVo 分页查询VO
	 * @return list
	 */
	void qeuryProcessDefinitionPage(PageVO pageVo);
	
	/**
	 * 流程实例列表查询
	 * @param pageVo
	 * @return list
	 */
	void queryProcessInstancePage(PageVO pageVo);
	
	/**
	 * 流程任务列表查询
	 * @param pageVo
	 * @return list
	 */
	void queryTaskPage(PageVO pageVo);
	

	
	/**
	 * 动态流程图查看
	 * @param instanceId 实例ID
	 * @param deploymentId 调度ID
	 * 
	 * @return InputStream
	 */
	InputStream queryWorkflowImage(String instanceId,String deploymentId);
	
	/**
	 * 启动流程任务
	 * @param processInstanceId 流程实例ID
	 */
	boolean startProcessInstanceById(String processInstanceId);
	
	/**
	 * 结束流程任务
	 * @param taskId 流程任务ID
	 * 
	 * @return boolean true:成功 false:失败
	 */
	boolean completeTaskById(String taskId);
	
	////////////////////////系统用户个人流程业务相关////////////////////////////
	
	/**
	 * 分页查询用户待办流程
	 * @param pageVo 分页查询条件
	 * @param userId 用户ID
	 */
	void queryUserTaskPage(PageVO pageVo,Long userId);
	
}
