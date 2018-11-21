package com.audit.modules.system.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.system.service.SystemDataService;

/**
 * @Description:系统数据controller
 * @author 礼斌
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/systemData")
public class SystemDataController {

	@Resource
	private SystemDataService systemDataService;
	
	@RequestMapping("init")
	public String init(Model model){
		return "test/test";
	}
	/**
     * @Description: 获取城市列表信息
     * @return :返回城市列表信息
    */
	@RequestMapping("queryCityList")
	@ResponseBody
	public ResultVO queryCityList(Model model){
		return ResultVO.success(systemDataService.queryCityList());
	}
	
	/**
     * @Description: 根据城市ID查询区县列表信息
     * @return :返回区县列表信息
    */
	@RequestMapping("queryCountyList")
	@ResponseBody
	public ResultVO queryCountyList(Model model, String cityId){
		return ResultVO.success(systemDataService.queryCountyList(cityId));
	}
}
