package com.audit.modules.towerbasedata.datashow.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.datashow.entity.TowerPowerRate;
import com.audit.modules.towerbasedata.datashow.entity.TowerPowerRateDetail;
import com.audit.modules.towerbasedata.datashow.service.TowerPowerRatedService;
import com.google.common.collect.Maps;

/**   
 * @Description : TODO(塔维：额定功率标杆管理)    
 *
 * @author : chentao
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Controller
@RequestMapping("towerPowerRated")
public class TowerPowerRatedController {
	
	@Autowired
	private TowerPowerRatedService towerPowerRateService;
	
	/**
	 * @Description: 塔维：额定功率标杆管理
	 * @param :towerNum	铁塔站址编号
	 * @param :resName	资管站名
	 * @param :cityId	市id
	 * @param :countyId	区id
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/powerRateManageByPage")
	@ResponseBody
	public ResultVO powerRateManageByPage(HttpServletRequest request, Integer pageNo, Integer pageSize) {
		
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	paramMap.put("towerNum",request.getParameter("towerNum"));
		 	paramMap.put("resName",request.getParameter("resName"));
	        paramMap.put("cityId",request.getParameter("cityId"));
	        paramMap.put("countyId",request.getParameter("countyId"));
	        
		PageUtil<TowerPowerRate> page = new PageUtil<>();
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		if (pageNo != null && pageSize != null) {
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		towerPowerRateService.powerRateManage(page);
		return ResultVO.success(page);
	}
	
	
	/**   
	 * @Description: TODO(塔维：额定功率标杆管理-详情)    
	 * @param :      towerId 铁塔id    
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("powerRateManageDetail")
	@ResponseBody
	public ResultVO powerRateManageDetail(String towerId) {
		
		List<TowerPowerRateDetail> list = towerPowerRateService.powerRateManageDetail(towerId);
		return ResultVO.success(list);
	}
	
}
