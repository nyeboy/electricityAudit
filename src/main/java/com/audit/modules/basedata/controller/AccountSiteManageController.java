package com.audit.modules.basedata.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.entity.AccountSiteManage;
import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.basedata.service.AccountSiteManageService;
import com.audit.modules.common.DoubleUtil;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;

/**
 * 
 * @Description: 报账点管理   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午3:14:31
 */
@Controller
@RequestMapping("/accountSiteManage")
public class AccountSiteManageController {

	@Autowired
	private AccountSiteManageService accountSiteManageService;

	/**
	 * @Description:分页查询报账点信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryPageAccountSiteManage")
	@ResponseBody
	public ResultVO queryPageAccountSiteManage(AccountSiteManage accountSiteManage, Integer pageNo, Integer pageSize) {
		PageUtil<AccountSiteManage> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		accountSiteManageService.queryPageAccountSiteManage(accountSiteManage, pageUtil);
		return ResultVO.success(pageUtil);
	}
	

	/**
	 * @Description:通过报账点Id查询报账点信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryAccountSiteManageById")
	@ResponseBody
	public ResultVO queryAccountSiteManageById(String accountSiteManageId) {
		if(accountSiteManageId == null || accountSiteManageId.equals("")) {
			return ResultVO.failed("请传递Id");
		}
		List<AccountSiteManage> accountSiteManageList = accountSiteManageService.queryAccountSiteManageById(accountSiteManageId);
		return ResultVO.success(accountSiteManageList);
	}
	

	/**
	 * @Description:通过报账点Id修改报账点信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/updateAccountSiteManageById")
	@ResponseBody
	public ResultVO updateAccountSiteManageById(AccountSiteManage accountSiteManage) {
		if(accountSiteManage != null && null != accountSiteManage.getId() && !"".equals(accountSiteManage.getId())) {
			accountSiteManageService.updateAccountSiteManageById(accountSiteManage);
			return ResultVO.success();
		}
		return ResultVO.failed("参数错误");
		
	}
	
	/**
	 * @Description:通过报账点Ids删除报账点信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/deleteAccountSiteManageByIds")
	@ResponseBody
	public ResultVO deleteAccountSiteManageByIds(String accountSiteManageIds) {
		if(accountSiteManageIds == null || accountSiteManageIds.equals("")) {
			return ResultVO.failed("参数错误");
		}
		accountSiteManageService.deleteAccountSiteManageByIds(accountSiteManageIds);
		return ResultVO.success();
	}
	
	/**
	 * @Description:新增报账点信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/createAccountSite")
	@ResponseBody
	public ResultVO createAccountSite(AccountSiteManage accountSiteManage) {
		if(accountSiteManage.getAccountName() == null) {
			return ResultVO.failed("参数错误");
		}
		accountSiteManageService.createAccountSite(accountSiteManage);
		return ResultVO.success();
	}
	

	
	
	
	
	@RequestMapping("queryASETop100")
	@ResponseBody
	public ResultVO queryASETop100(HttpServletRequest request) {
		List<AccountSiteManage> queryASETop100 = accountSiteManageService.queryASETop100();
		System.out.println(queryASETop100);
		return ResultVO.success(queryASETop100);
	}
	
	@RequestMapping("geteletop11")
	@ResponseBody
	public ResultVO geteletop11(){
		List<AccountSiteManage> geteletop11 = accountSiteManageService.geteletop11();
		return ResultVO.success(geteletop11);
	}
	
	

	
	
	
	
	@RequestMapping("queryASEMTop100")
	@ResponseBody
	public ResultVO queryASEMTop100(HttpServletRequest request,Integer pageNo,Integer pageSize) throws ParseException{
		List<AccountSiteManage> queryASETop100 = accountSiteManageService.queryASETop100();
		System.out.println(queryASETop100);
		return ResultVO.success(queryASETop100);
	}
	
	
	
	
	
	
	
	@RequestMapping("downZGExcel")
	@ResponseBody
	public ResultVO downZGExcel(){
		List<AccountSiteManage> allAcount = accountSiteManageService.getAllAcount();
		return ResultVO.success(allAcount);
	}
	
}
