package com.audit.modules.workflow.service.impl;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.DeploymentQuery;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.PageVO;
import com.audit.modules.workflow.service.WorkflowService;

/**
 * 
 * @Description: 业务流程处理service实现类
 * 
 * @author 礼斌
 * 
 * @date 2017年3月8日 下午4:31:03
 */
@Service
public class WorkflowServiceImpl implements WorkflowService {

	//获取流程存储服务组件
	@Autowired
	private RepositoryService repositoryService;
	//获取运行时服务组件 
	@Autowired
	private RuntimeService runtimeService;
	//获取流程任务组件
	@Autowired
	private TaskService taskService;

	/**
	 * 流程定义列表查询
	 */
	@Override
	public void qeuryProcessDefinitionPage(PageVO pageVo) {

		// 创建流程定义查询
		ProcessDefinitionQuery pdQuery = repositoryService.createProcessDefinitionQuery();
		long count = pdQuery.count();
		// 查询流程定义列表
		List<ProcessDefinition> listPd = pdQuery.orderByProcessDefinitionId().orderByProcessDefinitionId().desc()
				.listPage(pageVo.getPageNo() * pageVo.getPageSize(), pageVo.getPageSize());
		List<Map<String, Object>> listMap = new ArrayList<Map<String, Object>>();
		DeploymentQuery query = repositoryService.createDeploymentQuery();

		// 组装流程定义列表信息
		for (ProcessDefinition processDefinition : listPd) {
			Map<String, Object> map = new HashMap<String, Object>();
			Deployment deployment = query.deploymentId(processDefinition.getDeploymentId()).singleResult();
			map.put("deploymentId", deployment.getId());
			map.put("deploymentTime", deployment.getDeploymentTime());
			map.put("deploymentname", deployment.getName());
			map.put("category", deployment.getCategory());
			map.put("description", processDefinition.getDescription());
			map.put("diagramResourceName", processDefinition.getDiagramResourceName());
			map.put("id", processDefinition.getId());
			map.put("key", processDefinition.getKey());
			map.put("name", processDefinition.getName());
			map.put("resourceName", processDefinition.getResourceName());
			map.put("version", processDefinition.getVersion());
			listMap.add(map);
		}

		pageVo.setData(listMap);
		pageVo.setTotalData(count);

	}

	/**
	 * 流程实例列表查询
	 * 
	 * @param pageVo
	 * @return
	 */
	@Override
	public void queryProcessInstancePage(PageVO pageVo) {

		//创建查询流程实例对象
		ProcessInstanceQuery query = runtimeService.createProcessInstanceQuery();

		//获取流程实例总数据量
		long count = query.count();
		//分页查询流程实例
		List<ProcessInstance> list = query.orderByProcessInstanceId().desc()
				.listPage(pageVo.getPageNo() * pageVo.getPageSize(), pageVo.getPageSize());

		pageVo.setData(list);
		pageVo.setTotalData(count);
	}

	/**
	 * 任务列表查询
	 * 
	 * @param pageVo
	 */
	@Override
	public void queryTaskPage(PageVO pageVo) {
		
		//创建查询流程任务对象
		TaskQuery query = taskService.createTaskQuery();
		
		//获取流程任务总数据量
		long count = query.count();
		//分页查询流程任务
		List<Task> list = query.orderByTaskCreateTime().desc().listPage(pageVo.getPageNo() * pageVo.getPageSize(),
				pageVo.getPageSize());

		pageVo.setData(list);
		pageVo.setTotalData(count);
	}
	
	/**
	 * 动态流程图查看
	 * @param instanceId
	 * @param deploymentId
	 * @return InputStream
	 */
	@Override
	public InputStream queryWorkflowImage(String instanceId, String deploymentId) {
		
		// 定义图片资源的名称
		InputStream in = null;
		if(instanceId != null && !"".equals(instanceId)){
			ProcessInstance p = runtimeService.createProcessInstanceQuery().processInstanceId(instanceId).singleResult();
			in = repositoryService.getProcessDiagram(p.getProcessDefinitionId());
		}else{
			List<String> list = repositoryService.getDeploymentResourceNames(deploymentId);
			//定义图片资源的名称
			String resourceName = "";
			if(list!=null && list.size()>0){
				for(String name:list){
					if(name.indexOf(".png")>=0){
						resourceName = name;
					}
				}
			}
			in = repositoryService.getResourceAsStream(deploymentId, resourceName);
		}
		return in;
	}

	/**
	 * 启动流程任务
	 * @param processInstanceId 流程实例ID
	 */
	@Override
	public boolean startProcessInstanceById(String processInstanceId) {
		boolean isSuccess = false;
		
		ProcessInstance pi = null ;
		try {
			String time = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
			pi = runtimeService.startProcessInstanceById(processInstanceId,time+"_"+UUID.randomUUID().toString());
			isSuccess = true;
			System.out.println("流程实例ID:"+pi.getId());//流程实例ID
			System.out.println("流程定义ID:"+pi.getProcessDefinitionId());//流程定义ID  
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isSuccess;
	}

	/**
	 * 完成流程任务
	 * @param taskId 流程任务ID
	 * @return boolean
	 */
	@Override
	public boolean completeTaskById(String taskId) {
		
		boolean isSuccess = false;
		try {
			//完成流程任务
			taskService.complete(taskId);
			isSuccess = true;
		} catch (Exception e) {
			
		}
		return isSuccess;
	}

	@Override
	public void queryUserTaskPage(PageVO pageVo, Long userId) {
		// TODO Auto-generated method stub
		
	}

}
