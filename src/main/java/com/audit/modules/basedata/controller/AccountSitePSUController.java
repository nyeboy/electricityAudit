package com.audit.modules.basedata.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.entity.AccountSitePSU;
import com.audit.modules.basedata.service.AccountSitePSUService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;

/**
 * 
 * @Description: 报账点供电信息管理   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午3:14:31
 */
@Controller
@RequestMapping("/accountSitePSU")
public class AccountSitePSUController {

	@Autowired
	private AccountSitePSUService accountSitePSUService;

	/**
	 * @Description:分页查询供电信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryPageAccountSitePSU")
	@ResponseBody
	public ResultVO queryPageAccountSitePSU(AccountSitePSU accountSitePSU, Integer pageNo, Integer pageSize) {
		PageUtil<AccountSitePSU> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		accountSitePSUService.queryPageAccountSitePSU(accountSitePSU, pageUtil);
		return ResultVO.success(pageUtil);
	}
	

	/**
	 * @Description:通过报账点Id查询供电信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryAccountSitePSUById")
	@ResponseBody
	public ResultVO queryAccountSitePSUById(String accountSitePSUId) {
		if(accountSitePSUId == null || accountSitePSUId.equals("")) {
			return ResultVO.failed("请传递Id");
		}
		AccountSitePSU accountSitePSU = accountSitePSUService.queryAccountSitePSUById(accountSitePSUId);
		return ResultVO.success(accountSitePSU);
	}
	

	/**
	 * @Description:通过报账点Id修改供电信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/updateAccountSitePSUById")
	@ResponseBody
	public ResultVO updateAccountSitePSUById(AccountSitePSU accountSitePSU) {
		if(accountSitePSU != null && null != accountSitePSU.getId() && !"".equals(accountSitePSU.getId())) {
			accountSitePSUService.updateAccountSitePSUById(accountSitePSU);
			return ResultVO.success();
		}
		return ResultVO.failed("参数错误");
		
	}
	
	/**
	 * @Description:通过报账点Ids清空供电信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/clearAccountSitePSUByIds")
	@ResponseBody
	public ResultVO clearAccountSitePSUByIds(String accountSitePSUIds) {
		if(accountSitePSUIds == null || accountSitePSUIds.equals("")) {
			return ResultVO.failed("参数错误");
		}
		accountSitePSUService.clearAccountSitePSUByIds(accountSitePSUIds);
		return ResultVO.success();
	}
}
