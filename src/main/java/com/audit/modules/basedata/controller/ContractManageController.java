package com.audit.modules.basedata.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.entity.ContractManage;
import com.audit.modules.basedata.service.ContractManageService;


/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : 
 * @date : 2017年4月20日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.google.common.collect.Maps;

/**   
 * @Description: TODO(合同信息管理)    
 * @author  chentao
 * @date 2017年4月20日 下午4:39:19    
*/
@Controller
@RequestMapping("contractManage")
public class ContractManageController {
	
	@Autowired
	private ContractManageService contractManageService;
	
	/**   
	 * @Description: TODO(分页查询)    
	 * @param :      name 供应商名称
	 * @param		 organizationCode 组织结构id
	 * @param :      cityId	 市
	 * @param :      countyId  区县     
	 * @param :      only  only为 1 的时候，供应商code去重
	 * @return :     操作状态/信息json     
	*/
	@RequestMapping("findContractByPage")
	@ResponseBody
	public ResultVO findcontractByPage(HttpServletRequest request,Integer pageNo, Integer pageSize, String only) {	
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	paramMap.put("name",request.getParameter("name"));

/*		paramMap.put("organizationCode",request.getParameter("organizationCode"));
	        paramMap.put("cityId",request.getParameter("cityId"));
	        paramMap.put("countyId",request.getParameter("countyId"));*/
	        
		PageUtil<ContractManage> page = new PageUtil<ContractManage>();
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		if(pageNo != null && pageSize != null){
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		List<ContractManage> list = contractManageService.findContractByPage(page);
		/*List<ContractManage> list = contractManageService.findContractByPage(page, only);*/
		return ResultVO.success(page);
	}
	
	/**   
	 * @Description: TODO(根据id查找)    
	 * @param :      id    
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("findContractById")
	@ResponseBody
	public ResultVO findContractById(String contractId,String cityId,String countyId) {
		return contractManageService.findContractById(contractId,cityId,countyId);
	}
	
	@RequestMapping("findwhiteContractById")
	@ResponseBody
	public ResultVO findwhiteContractById(String contractId,String cityId,String countyId) {
		return contractManageService.findwhiteContractById(contractId,cityId,countyId);
	}
	
	/**   
	 * @Description: TODO(更新)    
	 * @param :      ContractVO    
	 * @return :     操作状态/信息json   
	 * @throws  
	*/
	@RequestMapping("updateContract")
	@ResponseBody
	public ResultVO updateContract(ContractManage sManage) {
		return contractManageService.updateContract(sManage);
	}
	
	/**   
	 * @Description: TODO(删除)    
	 * @param :      id    
	 * @return :     操作状态/信息json     
	*/
	@RequestMapping("deleteContractById")
	@ResponseBody
	public ResultVO deleteContractById(String id) {
		return contractManageService.deleteContractById(id);
	}
	
	/**   
	 * @Description: TODO(添加)    
	 * @param :      ContractVO   
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("insertContract")
	@ResponseBody
	public ResultVO insertContract(ContractManage sManage) {
		return contractManageService.insertContract(sManage);
	}
	
}
