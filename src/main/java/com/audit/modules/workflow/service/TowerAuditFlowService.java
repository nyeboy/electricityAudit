package com.audit.modules.workflow.service;

import java.util.List;
import java.util.Map;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.TowerElectrictyEntities;
import com.audit.modules.electricity.entity.TowerReimburseVo;
import com.audit.modules.electricity.entity.TowerSaveEntities;
import com.audit.modules.workflow.entity.ApprovalDetailVo;
import com.audit.modules.workflow.entity.FlowSetpVo;
import com.audit.modules.workflow.entity.TowerElectricityFlowVo;

/**
 * 塔维稽核服务
 * 
 * @author luoyun
 */
public interface TowerAuditFlowService {

	/**
	 * 启动流程
	 * 
	 * @param busId 业务ID
	 */
	void startFlow(String busId);
	
	/**
	 * 查询任务列表
	 * 
	 * @param param 查询参数
	 * @param page 分页
	 */
	@SuppressWarnings("rawtypes")
	void queryFlow(TowerElectricityFlowVo param, PageUtil page);
	
	/**
	 * 审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 */
	void approve(String instanceId, Integer approveState);

	/**
	 * 批量审批
	 * 
	 * @param instanceIds 流程IDS
	 * @param approveState 审批状态
	 */
	void batchApprove(String[] instanceIds, Integer approveState);
	
	/**
	 * 撤销流程
	 * 
	 * @param instanceId 流程ID
	 * @param reason 原因
	 */
	void deleteTask(String instanceId, String reason);
	
	/**
	 * 更新流程
	 * 
	 * @param instanceId 流程ID
	 * @param towerSaveEntities  塔维实体
	 */
	void updateTask(String instanceId, TowerSaveEntities towerSaveEntities);
	
	/**
	 * 查询历史审批
	 * 
	 * @param instanceId 流程ID
	 * @return 历史审批记录
	 */
	List<ApprovalDetailVo> queryApprovalDetails(String instanceId);
	
	/**
	 * 查询待生成电费提交单记录
	 * 
	 * @param towerElectrictyEntities 查询参数
	 * @param page 分页
	 */
	@SuppressWarnings("rawtypes")
	void queryGenerated(TowerElectrictyEntities towerElectrictyEntities, PageUtil page);
	
	/**
	 * 查询待处理的财务高妙 
	 * 
	 * @param record 参数
	 * @param page 分页
	 */
	void querySendInfo(TowerReimburseVo record, PageUtil<TowerReimburseVo> page);
	
	/**
	 * 查询待办数量
	 * 
	 * @return 待办数量
	 */
	Integer queryPendingApproval();
	
	/**
	 * 查询待处理电费提交数量
	 * 
	 * @return 待处理电费提交数量
	 */
	Double queryElectricityApproval();
	
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
}
