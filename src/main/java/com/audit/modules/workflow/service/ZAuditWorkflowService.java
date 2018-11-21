package com.audit.modules.workflow.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectricityFlowVo;
import com.audit.modules.electricity.entity.ElectrictySaveVO;
import com.audit.modules.workflow.entity.ApprovalDetailVo;
import com.audit.modules.workflow.entity.FlowSetpVo;

/**
 * @Description: 稽核业务流程处理接口类
 * 
 * @author  礼斌
 * @date 2017年3月10日 下午2:07:36
 */
/**   
 * @Description: TODO(请描述此方法的作用)    
 * @param :      设定文件    
 * @return :     返回类型    
 * @throws  
 * 
 * @author  
 * @date 2017年3月17日 下午3:26:58    
*/
public interface ZAuditWorkflowService {

	/**
	 * 根据KEY获取流程实例
	 * 
	 * @param busId 电费稽核业务ID
	 */
	void startFlow(String busId);
	
	/**
	 * 查询用户流程任务
	 * 
	 * @param flowVo 流程查询参数
	 * @return 电费稽核业务ID
	 */
	@SuppressWarnings("rawtypes")
	void queryTaskByUser(HttpServletRequest request, ElectricityFlowVo flowVo, PageUtil pageVo);
	
	@SuppressWarnings("rawtypes")
	void queryTaskByUser11(ElectricityFlowVo flowVo, PageUtil pageVo);
	
	/**
	 * 流程审核
	 * 
	 * @param userId 用户ID 
	 * @param flow 审批条件
	 */
	void auditElectricityFlow(String userId, ElectricityFlowVo flow);
	
	/**
	 * 撤销流程
	 * 
	 * @param instanceId 流程ID
	 * @param reason 原因说明
	 */
	void deleteTask(String instanceId, String reasion);
	
	
	/**
	 * 修改
	 * 
	 * @param instanceId 流程ID
	 * @param vo 待更新数据
	 */
	void updateTask(String instanceId, ElectrictySaveVO vo);
	
	/**
	 * 查询审批过程
	 * 
	 * @param instanceId 流程ID
	 * @return 审批过程
	 */
	List<ApprovalDetailVo> queryApprovalDetails(String instanceId);
	
	/**
	 * 查询待办数量
	 * 
	 * @param userId 用户ID
	 * @return 待办数量
	 */
	Integer queryOperatorNum(String userId);
	
	/**
	 * 根据业务ID查询流程信息
	 * 
	 * @param busId 业务ID
	 * @return 流程信息
	 */
	ElectricityFlowVo queryFlowInfo(String busId);
	
	/**
	 * 查询流转图
	 * 
	 * @param instanceId 流程图
	 * @return 查询流转图
	 */
	List<FlowSetpVo> queryFlowChart(String instanceId);
	
	/**
	 * 统计区县信息
	 * 
	 * @return
	 */
	List<Map<String, String>> statisticsCountInfo();
	
	/**
	 * 推送
	 * 
	 * @param ids 数据记录标示
	 * @param state 状态
	 */
	void sendOut(String[] ids, Integer state);
}
