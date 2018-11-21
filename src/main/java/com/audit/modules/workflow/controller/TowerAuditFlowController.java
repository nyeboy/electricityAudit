package com.audit.modules.workflow.controller;

import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.AuditTowerSaveEntities;
import com.audit.modules.electricity.entity.TowerElectrictyEntities;
import com.audit.modules.electricity.entity.TowerReimburseVo;
import com.audit.modules.workflow.entity.ApprovalDetailVo;
import com.audit.modules.workflow.entity.FlowSetpVo;
import com.audit.modules.workflow.entity.TowerElectricityFlowVo;
import com.audit.modules.workflow.service.TowerAuditFlowService;

/**
 * 塔维流程
 * 
 * @author luoyun
 */
@Controller
@RequestMapping("towerWorkflow")
public class TowerAuditFlowController {

	@Autowired
	TowerAuditFlowService towerAuditFlowService;
	
	/**
	 * 启动流程
	 * 
	 * @return 运行状态
	 */
	@RequestMapping("start")
	@ResponseBody
	public ResultVO start() {
		towerAuditFlowService.startFlow("1");
		return ResultVO.success();
	}
	
	/**
	 * 查询待审批的流程
	 * 
	 * @param param 参数
	 * @param page 分页
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping("queryFlow")
	@ResponseBody
	public ResultVO queryFlow(TowerElectricityFlowVo param, PageUtil page) {
		// 处理时间
		if (!StringUtils.isEmpty(param.getqEndTime())) {
			GregorianCalendar gc = new GregorianCalendar();
			gc.setTime(param.getqEndTime());
			gc.add(5, 1);
			param.setqEndTime(gc.getTime());
		}
		
		ResultVO rs = null;
		try {
			towerAuditFlowService.queryFlow(param, page);
			rs = ResultVO.success(page);
		} catch (CommonException e) {
			rs = ResultVO.failed(e.getMessage());
		}
		return rs;
	}
	
	/**
	 * 审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态值
	 * @return 审批结果
	 */
	@RequestMapping("approve")
	@ResponseBody
	public ResultVO approve(String instanceId, Integer approveState) {
		ResultVO rs = null;
		try {
			towerAuditFlowService.approve(instanceId, approveState);
			rs = ResultVO.success();
		} catch (Exception e) {
			rs = ResultVO.failed(e.getMessage());
		}
		return rs;
	}
	
	/**
	 * 批量审批
	 * 
	 * @param instanceIds 流程IDS
	 * @param approveState 审批状态
	 */
	@RequestMapping("batchApprove")
	@ResponseBody
	public ResultVO batchApprove(String[] instanceIds, Integer approveState) {
		ResultVO rs = null;
		try {
			towerAuditFlowService.batchApprove(instanceIds, approveState);
			rs = ResultVO.success();
		} catch (Exception e) {
			rs = ResultVO.failed(e.getMessage());
		}
		return rs;
	}
	
	/**
	 * 撤销流程
	 * 
	 * @param instanceId 流程ID
	 * @param reason 原因
	 */
	@RequestMapping("deleteTask")
	@ResponseBody
	public ResultVO deleteTask(String instanceId, String reason) {
		towerAuditFlowService.deleteTask(instanceId, reason);
		return ResultVO.success();
	}
	
	@RequestMapping("bachDeleteTask")
	@ResponseBody
	public ResultVO bachDeleteTask(String[] instanceIds, String reason) {
		for (String instanceId : instanceIds) {
			towerAuditFlowService.deleteTask(instanceId, reason);
		}
		return ResultVO.success();
	}
	
	/**
	 * 更新流程
	 * 
	 * @param towerSaveEntitie 塔维实体
	 */
	@RequestMapping("updateTask")
	@ResponseBody
	public ResultVO updateTask(@RequestBody AuditTowerSaveEntities towerSaveEntitie) {
		towerAuditFlowService.updateTask(towerSaveEntitie.getInstanceId(), towerSaveEntitie);
		return ResultVO.success();
	}
	
	/**
	 * 查询历史审批
	 * 
	 * @param instanceId 流程ID
	 * @return 历史审批记录
	 */
	@RequestMapping("queryApprovalDetails")
	@ResponseBody
	public ResultVO queryApprovalDetails(String instanceId) {
		List<ApprovalDetailVo> lists = towerAuditFlowService.queryApprovalDetails(instanceId);
		return ResultVO.success(lists);
	}
	
	
	/**
	 * 查询待生成电费提交单记录
	 * 
	 * @param towerElectrictyEntities 查询参数
	 * @param page 分页
	 */
	@RequestMapping("queryGenerated")
	@ResponseBody
	@SuppressWarnings("rawtypes")
	public ResultVO queryGenerated(TowerElectrictyEntities towerElectrictyEntities, PageUtil page) {
		towerAuditFlowService.queryGenerated(towerElectrictyEntities, page);
		return ResultVO.success(page);
	}
	
	/**
     * 查询电费提交单数据
     * 
     * @param record
     * @param page 分页参数
     * @return 查询结果
     */
    @RequestMapping("querySendInfo")
    @ResponseBody
	public ResultVO querySendInfo(TowerReimburseVo record, PageUtil<TowerReimburseVo> page) {
		// 处理查询时间
		if (!StringUtils.isEmpty(record.getEndCreateDate())) {
			GregorianCalendar gc = new GregorianCalendar();
			gc.setTime(record.getEndCreateDate());
			gc.add(5, 1);
			record.setEndCreateDate(gc.getTime());
		}
    	
		towerAuditFlowService.querySendInfo(record, page);
		return ResultVO.success(page);
	}
    
	/**
	 * 查询待审批记录数
	 * 
	 * @return 待审批记录数
	 */
	@RequestMapping("queryPendingApproval")
	@ResponseBody
	public ResultVO queryPendingApproval() {
		Integer approval = towerAuditFlowService.queryPendingApproval();
		return ResultVO.success(approval);
	}
	
	/**
	 * 查询待处理电费提交数量
	 * 
	 * @return 待处理电费提交数量
	 */
	@RequestMapping("queryElectricityApproval")
	@ResponseBody
	public ResultVO queryElectricityApproval() {
		Double number = towerAuditFlowService.queryElectricityApproval();
		return ResultVO.success(number);
	}
	
	/**
	 * 查询流转图信息
	 * 
	 * @param instanceId 流程ID
	 * @return 流转图信息
	 */
	@RequestMapping("queryFlowChart")
	@ResponseBody
	public ResultVO queryFlowChart(String instanceId) {
		List<FlowSetpVo> setps = towerAuditFlowService.queryFlowChart(instanceId);
		return ResultVO.success(setps);
	}
	
	/**
	 * 统计区县信息
	 * 
	 * @return 统计信息
	 */
	@RequestMapping("statisticsCountInfo")
	@ResponseBody
	public ResultVO statisticsCountInfo() {
		List<Map<String, String>> result = towerAuditFlowService.statisticsCountInfo();
		return ResultVO.success(result);
	}
}
