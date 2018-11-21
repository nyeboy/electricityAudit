package com.audit.modules.workflow.service;

import java.util.List;

import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;
import com.audit.modules.workflow.entity.ApprovalDetailVo;
import com.audit.modules.workflow.entity.BasicDataVo;

/**
 * 流程变更流程服务
 * 
 * @author luoyun
 */
public interface BasicDataChangeService {

	/**
	 * 启动流程
	 * 
	 * @param busId 业务ID
	 */
	void startFlow(String busId);
	
	/**
	 * 自维转供电启动流程
	 * 
	 * @param busId 业务ID
	 */
	void tranStartFlow(String busId);
	/**
	 * 塔维转供电启动流程
	 * 
	 * @param busId 业务ID
	 */
	void towerTranStartFlow(String busId);
	
	
	/**
	 * 自维根据业务id获取流程id
	 * @param busId 业务ID
	 */
	String getInstanceByApplyId(String busId,AccountSiteTransSubmit accountSiteTransSubmit);
	
	/**
	 * 塔维根据业务id获取流程id
	 * @param busId 业务ID
	 */
	String getTowerInstanceByApplyId(String busId,TowerTransSubmitVO towerTransSubmitVO);
	
	/**
	 * 查询待办任务
	 * 
	 * @param param 查询参数
	 * @param pageVo 分页
	 */
	@SuppressWarnings("rawtypes")
	void queryFlowPage(BasicDataVo param, PageUtil pageVo);
	
	/**
	 * 自维查询转供电待办任务
	 * 
	 * @param param 查询参数
	 * @param pageVo 分页
	 */
	@SuppressWarnings("rawtypes")
	void queryTransFlowPage(AccountSiteTransSubmit param, PageUtil pageVo);
	
	/**
	 * 塔维查询转供电待办任务
	 * 
	 * @param param 查询参数
	 * @param pageVo 分页
	 */
	@SuppressWarnings("rawtypes")
	void queryTowerTransFlowPage(TowerTransSubmitVO param, PageUtil pageVo);
	
	/**
	 * 审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 */
	void auditElectricityFlow(String instanceId, Integer approveState);
	
	/**
	 * 自维转供电-------审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 */
	void transApprovalDataModify(String instanceId, Integer approveState);
	
	/**
	 * 塔维转供电-------审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 */
	void towerTransApprovalDataModify(String instanceId, Integer approveState);
	
	
	/**
	 * 查询审批过程
	 * 
	 * @param instanceId 流程ID
	 * @return 审批过程
	 */
	List<ApprovalDetailVo> queryApprovalDetails(String instanceId);
	
	/**
	 * 根据流程id删除审批流程
	 * 
	 * @param instanceId 流程ID
	 * @return 审批过程
	 */
	
	void deleteByInstanceId(String instanceId);
}
