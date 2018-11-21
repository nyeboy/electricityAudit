package com.audit.modules.system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.OperationLogVo;
import com.audit.modules.system.service.OperationLogService;

/**
 * 
 * @Description: 操作日志管理    
 * 
 * @author  liuyan
 * @date 2017年3月10日
 */
@Controller
@RequestMapping("/log")
public class LogController  {
	
	@Autowired
	 private OperationLogService operationLogService;
	
	/**
	 * @Description LOG列表展示
	 * */
	@RequestMapping("/getlogList")
	@ResponseBody
	public List<OperationLogVo> getLogList() {	
		return	operationLogService.findAll();
	}
	
	/**
	 * @Description LOG分页查询
	 * */
	@RequestMapping("/getPageLog")
	@ResponseBody
	public ResultVO queryPageLog(OperationLogVo operationLogVo, Integer pageNo, Integer pageSize) {	
		PageUtil<OperationLogVo> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		operationLogService.getPageLogList(operationLogVo, pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	
}
