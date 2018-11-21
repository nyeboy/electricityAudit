package com.audit.modules.basedata.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.entity.AccountSiteOther;
import com.audit.modules.basedata.service.AccountSiteOtherService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;

/**
 * 
 * @Description: 报账点其他信息管理   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午3:14:31
 */
@Controller
@RequestMapping("/accountSiteOther")
public class AccountSiteOtherController {

	@Autowired
	private AccountSiteOtherService accountSiteOtherService;

	/**
	 * @Description:分页查询报账点其他信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryPageAccountSiteOther")
	@ResponseBody
	public ResultVO queryPageAccountSiteOther(AccountSiteOther accountSiteOther, Integer pageNo, Integer pageSize) {
		PageUtil<AccountSiteOther> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		accountSiteOtherService.queryPageAccountSiteOther(accountSiteOther, pageUtil);
		return ResultVO.success(pageUtil);
	}
	

	/**
	 * @Description:通过报账点Id查询报账点其他信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryAccountSiteOtherById")
	@ResponseBody
	public ResultVO queryAccountSiteOtherById(String accountSiteOtherId) {
		if(accountSiteOtherId == null || accountSiteOtherId.equals("")) {
			return ResultVO.failed("请传递Id");
		}
		AccountSiteOther accountSiteOther = accountSiteOtherService.queryAccountSiteOtherById(accountSiteOtherId);
		return ResultVO.success(accountSiteOther);
	}
	

	/**
	 * @Description:通过报账点Id修改报账点其他信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/updateAccountSiteOtherById")
	@ResponseBody
	public ResultVO updateAccountSiteOtherById(AccountSiteOther accountSiteOther) {
		if(accountSiteOther != null && null != accountSiteOther.getId() && !"".equals(accountSiteOther.getId())) {
			accountSiteOtherService.updateAccountSiteOtherById(accountSiteOther);
			return ResultVO.success();
		}
		return ResultVO.failed("参数错误");
		
	}
}
