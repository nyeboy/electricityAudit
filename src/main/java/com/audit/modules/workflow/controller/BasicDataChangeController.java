package com.audit.modules.workflow.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.filter.exception.CommonException;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.electricity.entity.ElectricityFlowVo;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.system.entity.BaseDataVO;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;
import com.audit.modules.workflow.entity.BasicDataVo;
import com.audit.modules.workflow.service.BasicDataChangeService;

/**
 * 基础数据变更流程
 * 
 * @author luoyun
 */
@Controller
@RequestMapping("basicDataChange")
public class BasicDataChangeController {

	@Autowired
	private BasicDataChangeService basicDataChangeService;
	
	@RequestMapping("init")
	public String init() {
		return "workflow/change_init";
	}
	
	
	/**
	 * 基础数据启动流程
	 * 
	 * @return 执行状态
	 */
	@RequestMapping("start")
	@ResponseBody
	public ResultVO start() {
		basicDataChangeService.startFlow("50");
		return ResultVO.success();
	}
	
	/**
	 * 查询待办任务
	 * 
	 * @param request request
	 * @param param 参数
	 * @param pageVo 分页
	 * @return 查询结果
	 */
	@RequestMapping("queryFlowPage")
	@ResponseBody
	@SuppressWarnings("rawtypes")
	public ResultVO queryFlowPage(HttpServletRequest request, BasicDataVo param, PageUtil pageVo) {
		try {
			UserVo user = getLoginUser(request);
			String mobileType =  request.getParameter("mobileType");
			param.setMobileType(mobileType);
			param.setCurOpUserID(user.getUserId());
			basicDataChangeService.queryFlowPage(param, pageVo);
			return ResultVO.success(pageVo);
		} catch (Exception e) {
			return ResultVO.failed(e.getMessage());
		}
	}
	
	/**
	 * 自维转供电 -------------------查询转供电待办任务
	 * 
	 * @param request request
	 * @param param 参数
	 * @param pageVo 分页
	 * @return 查询结果
	 */
	@RequestMapping("queryTransFlowPage")
	@ResponseBody
	@SuppressWarnings("rawtypes")
	public ResultVO queryTransFlowPage(HttpServletRequest request, AccountSiteTransSubmit param, PageUtil pageVo) {
		try {
			UserVo user = getLoginUser(request);
			String mobileType =  request.getParameter("mobileType");
			param.setMobileType(mobileType);
			param.setTrusteesId(user.getUserId());
			basicDataChangeService.queryTransFlowPage(param,pageVo);
			return ResultVO.success(pageVo);
		} catch (Exception e) {
			return ResultVO.failed(e.getMessage());
		}
	}
	
	/**
	 * 塔维转供电 -------------------查询转供电待办任务
	 * 
	 * @param request request
	 * @param param 参数
	 * @param pageVo 分页
	 * @return 查询结果
	 */
	@RequestMapping("queryTowerTransFlowPage")
	@ResponseBody
	@SuppressWarnings("rawtypes")
	public ResultVO queryTowerTransFlowPage(HttpServletRequest request, TowerTransSubmitVO param, PageUtil pageVo) {
		try {
			UserVo user = getLoginUser(request);
			String mobileType =  request.getParameter("mobileType");
			param.setMobileType(mobileType);
			param.setTrusteesId(user.getUserId());
			basicDataChangeService.queryTowerTransFlowPage(param,pageVo);
			return ResultVO.success(pageVo);
		} catch (Exception e) {
			return ResultVO.failed(e.getMessage());
		}
	}
	
	/**
	 * 审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 * @return 审批结果
	 */
	@RequestMapping("auditElectricityFlow")
	@ResponseBody
	public ResultVO auditElectricityFlow(String instanceId, Integer approveState) {
		try {
			basicDataChangeService.auditElectricityFlow(instanceId, approveState);
			return ResultVO.success();
		} catch (Exception e) {
			return ResultVO.failed(e.getMessage());
		}
	}
	
	/**
	 * 塔维转供电-----审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 * @return 审批结果
	 */
	@RequestMapping("towerTransApprovalDataModify")
	@ResponseBody
	public ResultVO towerTransApprovalDataModify(String instanceId, Integer approveState) {
		try {
			basicDataChangeService.towerTransApprovalDataModify(instanceId, approveState);
			return ResultVO.success();
		} catch (Exception e) {
			return ResultVO.failed(e.getMessage());
		}
	}
	
	
	/**
	 * 自维转供电-----审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 * @return 审批结果
	 */
	@RequestMapping("transApprovalDataModify")
	@ResponseBody
	public ResultVO transApprovalDataModify(String instanceId, Integer approveState) {
		try {
			basicDataChangeService.transApprovalDataModify(instanceId, approveState);
			return ResultVO.success();
		} catch (Exception e) {
			return ResultVO.failed(e.getMessage());
		}
	}
	
	
	/**
	 * 自维转供电-------------批量审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 * @return 审批结果
	 */
	@RequestMapping("transEleFlowList")
	@ResponseBody
	public ResultVO transEleFlowList(HttpServletRequest request,@RequestBody List<AccountSiteTransSubmit> transSubmits) {
		
		ResultVO rs = null;
        StringBuilder sb = new StringBuilder();
        // 当前登录人
        UserVo user = getLoginUser(request);
        for (AccountSiteTransSubmit flow : transSubmits) {
            try {
            	basicDataChangeService.transApprovalDataModify(flow.getInstanceId(), flow.getApproveState());
            	
            	// 审批流程
            } catch (Exception e) {
    			return ResultVO.failed(e.getMessage());
    		}
        }
        
        return ResultVO.success();
        // 部分失败
//        if (!StringUtils.isEmpty(sb.toString())) {
//            rs = ResultVO.failed(sb.toString());
//        } else {
//            rs = ResultVO.success();
//        }
	}
	
	
	/**
	 * 塔维转供电-------------批量审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 * @return 审批结果
	 */
	@RequestMapping("towerTransEleFlowList")
	@ResponseBody
	public ResultVO towerTransEleFlowList(HttpServletRequest request,@RequestBody List<TowerTransSubmitVO> transSubmits) {
		
		ResultVO rs = null;
        StringBuilder sb = new StringBuilder();
        // 当前登录人
        UserVo user = getLoginUser(request);
        for (TowerTransSubmitVO flow : transSubmits) {
            try {
            	
            	basicDataChangeService.towerTransApprovalDataModify(flow.getInstanceId(), flow.getApproveState());
            	
            	// 审批流程
            } catch (Exception e) {
    			return ResultVO.failed(e.getMessage());
    		}
        }
        
        return ResultVO.success();
        // 部分失败
//        if (!StringUtils.isEmpty(sb.toString())) {
//            rs = ResultVO.failed(sb.toString());
//        } else {
//            rs = ResultVO.success();
//        }
	}
	
	/**
	 * 查询流程的审批过程
	 * 
	 * @param instanceId 流程ID
	 * @return 流程的审批过程
	 */
	@RequestMapping("queryApprovalDetails")
	@ResponseBody
	public ResultVO queryApprovalDetails(String instanceId, Integer approveState) {
		return ResultVO.success(basicDataChangeService.queryApprovalDetails(instanceId));
	}
	
	/**
     * 获取当前用户
     *
     * @param request httpRuquest
     * @return 用户
     */
    private UserVo getLoginUser(HttpServletRequest request) {
        Object userStr = request.getSession().getAttribute("userInfo");
        if (userStr == null) {
            throw new CommonException("请先登录！");
        }
        return JsonUtil.valueOf(userStr.toString(), UserVo.class);
    }
}
