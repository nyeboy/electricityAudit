package com.audit.modules.towerbasedata.contract.controller;

import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.MyDateFormat;
import com.audit.modules.towerbasedata.contract.entity.TowerContractVO;
import com.audit.modules.towerbasedata.contract.service.TowerContractService;

/**
 * @author : bingliu
 * @Description : 合同查询
 * @date : 2017/4/30
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/towerContract")
public class TowerContractController {

    @Autowired
    private TowerContractService contractService;
    
	/**
	 * @Description:可分页查询合同列表
	 * @param :contractVO对象
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryListPage")
	@ResponseBody
	public ResultVO queryListPage(TowerContractVO contractVO, Integer pageNo, Integer pageSize) {
		PageUtil<TowerContractVO> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}else{
			return ResultVO.failed("缺少分页参数pageNo、pageSize");
		}
        contractService.queryListPage(contractVO, pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	/**
	 * 
	 * @Description: 通过Id查询单个合同  
	 * @param :Integer contractId       
	 * @return :     
	 * @throws
	 */
	@RequestMapping("/selectById")
	@ResponseBody
	public ResultVO selectById(HttpServletRequest request) {
		TowerContractVO contractVO = new TowerContractVO();
		String contractId = request.getParameter("id");
		if (null == contractId || contractId.equals("")) {
			return ResultVO.failed("参数错误");
		}
		contractVO = contractService.selectById(contractId);
		if (contractVO != null) {
			return ResultVO.success(contractVO);
		} else {
			return ResultVO.failed("资源未找到");
		}
	}

	/**   
	 * @Description: 删除合同
	 * @param :ContractVO Contract       
	 * @return :     
	 * @throws  
	*/
	@RequestMapping("/delete")
	@ResponseBody
	public ResultVO delete(HttpServletRequest request) {
		List<String> IdList = new ArrayList<String>();
		String[] IdArray = null;
		String Ids = request.getParameter("Ids");
		if (null == Ids || Ids.equals("")) {
			return ResultVO.failed("参数错误");
		}
		IdArray = Ids.split(",");
		for(String Id : IdArray) {
			IdList.add(Id);
		}
		if (IdList.size() > 0) {
			contractService.delete(IdList);
		}
		return ResultVO.success();
	}

	/**
	 * @Description 修改资源信息
	 * @param :HttpServletRequest request
	 * @return :返回操作状态/信息
	 * @throws :Exception
	*/

	@RequestMapping("/update")
	@ResponseBody
	public ResultVO update(TowerContractVO contract) {
		if (null == contract.getId() || contract.getId().equals("")) {
			return ResultVO.failed("参数错误");
		}
		contractService.update(contract);
		return ResultVO.success();
	}
	
	@InitBinder
    protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
        DateFormat df = new MyDateFormat("yyyy-MM-dd HH:mm:ss");
        CustomDateEditor editor = new CustomDateEditor(df, false);
        binder.registerCustomEditor(Date.class, editor);
    }
	
	@RequestMapping("queryContractCount")
	@ResponseBody
	public Integer queryContractCount(){
		Integer queryCount = contractService.queryCount();
		return queryCount;
	}
	
}
