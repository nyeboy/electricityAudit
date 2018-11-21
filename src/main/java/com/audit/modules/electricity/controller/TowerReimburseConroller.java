package com.audit.modules.electricity.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.electricity.entity.TowerReimburseVo;
import com.audit.modules.electricity.service.TowerReimburseService;
import com.audit.modules.workflow.entity.TowerConstant;

/**
 * @author : 袁礼斌
 * @Description : 塔维电费报销单controller
 * @date : 2016/5/4
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/towerReimburse")
public class TowerReimburseConroller {

	@Resource
	private TowerReimburseService towerReimburseService;
	/**
	 * 分页查询塔维电费报销单
	 * @param request
	 * @param pageNo
	 * @param pageSize
	 * @param record
	 * @return
	 */
	@RequestMapping("/queryPage")
	@ResponseBody
	public ResultVO queryPage(HttpServletRequest request,Integer pageNo, Integer pageSize,TowerReimburseVo record){
		PageUtil<TowerReimburseVo> page = new PageUtil<TowerReimburseVo>();
        if (pageNo != null && pageSize != null) {
        	page.setPageNo(pageNo);
        	page.setPageSize(pageSize);
        }
        towerReimburseService.queryPage(page, record);
        return ResultVO.success(page);
	}
	
	/**
	 * 根据ID查询塔维报电费报销单
	 * @param reimburseId
	 * @param request
	 * @return
	 */
	@RequestMapping("/selectByPrimaryKey")
	@ResponseBody
	public ResultVO selectByPrimaryKey(Integer reimburseId, HttpServletRequest request){
		return ResultVO.success(towerReimburseService.selectByPrimaryKey(reimburseId));
	}
	
	/**
	 * 删除塔维电费报销单
	 * @param reimburseId
	 * @return
	 */
	@RequestMapping("/delete")
	@ResponseBody
	public ResultVO delete(Integer reimburseId){
		return towerReimburseService.deleteByPrimaryKey(reimburseId);
	}

	/**
	 * 插入塔维电费报销单
	 * @param record
	 * @param towerEleIds
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public ResultVO save(@RequestBody TowerReimburseVo record,HttpServletRequest request){
		return towerReimburseService.insert(record);
	}
	
	/**
	 * 修改电费生成单
	 * 
	 * @param record 记录信息
	 * @return 修改结果状态
	 */
	@RequestMapping("update")
	@ResponseBody
	public ResultVO update(@RequestBody TowerReimburseVo record) {
		towerReimburseService.updateByPrimaryKeySelective(record);
		return ResultVO.success();
	}
	
	/**
	 * 批量更新状态
	 * 
	 * @param ids IDS
	 * @param status 状态
	 * @return 操作状态
	 */
	@RequestMapping("updateList")
	@ResponseBody
	public ResultVO updateList(String[] ids) {
		Integer state = null;
		// 根据登录人，记录操作类型
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(TowerConstant.FLOW_BX_ROLE);
			state = 2;
		} catch (AuthorizationException e) {
			state = 1;
		}

		// 推送
		try {
			towerReimburseService.updateList(ids, state);
			return ResultVO.success();
		} catch (CommonException e) {
			return ResultVO.failed(e.getMessage());
		} catch (Exception ex) {
			Log.error("推送失败！", ex);
			return ResultVO.failed("推送失败！");
		}
	}
	
	/**
	 * 更新状态值
	 * 
	 * @param reimburseNos 电费提交单号
	 * @param status 状态值
	 * @return 更新结果
	 */
	@RequestMapping("updateByNo")
	@ResponseBody
	public ResultVO updateByNo(String[] reimburseNos, Integer status) {
		try {
			towerReimburseService.updateByNo(reimburseNos, status);
			return ResultVO.success();
		} catch (CommonException e) {
			return ResultVO.failed(e.getMessage());
		}
	}
	
	/**
	 * 报销成功
	 * 
	 * @param ids 生成单ID数组
	 * @return 操作结果
	 */
	@RequestMapping("reimbursementSuccess")
	@ResponseBody
	public ResultVO reimbursementSuccess(String[] ids) {
		for (String id : ids) {
			TowerReimburseVo record = new TowerReimburseVo();
			record.setId(Integer.valueOf(id));
			record.setStatus(3);
			towerReimburseService.updateByPrimaryKeySelective(record);
		}
		return ResultVO.success();
	}
	
	/**
	 * 报销失败
	 * 
	 * @param ids 生成单ID数组
	 * @return 操作结果
	 */
	@RequestMapping("reimbursementFailure")
	@ResponseBody
	public ResultVO reimbursementFailure(String[] ids) {
		for (String id : ids) {
			TowerReimburseVo record = new TowerReimburseVo();
			record.setId(Integer.valueOf(id));
			record.setStatus(4);
			towerReimburseService.updateByPrimaryKeySelective(record);
		}
		return ResultVO.success();
	}
	
	/**
	 * 报销撤销
	 * 
	 * @param ids 生成单ID数组
	 * @return 操作结果
	 */
	@RequestMapping("reimbursementCance")
	@ResponseBody
	public ResultVO reimbursementCance(String[] ids) {
		for (String id : ids) {
			TowerReimburseVo record = new TowerReimburseVo();
			record.setId(Integer.valueOf(id));
			record.setStatus(5);
			towerReimburseService.updateByPrimaryKeySelective(record);
		}
		return ResultVO.success();
	}
}
