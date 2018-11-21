package com.audit.modules.towerbasedata.powerrate.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.powerrate.entity.TowerPowerRateVO;
import com.audit.modules.towerbasedata.powerrate.service.TowerPowerRateService;
import com.google.common.collect.Maps;

/**   
 * @Description : TODO(额定功率信息管理)    
 * @author : bingliup
 * @date : 2017年4月30日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Controller
@RequestMapping("towerpowerRate")
public class TowerPowerRateController {
		
	@Autowired
	private TowerPowerRateService powerRateService;
	
	/**   
	 * @Description: TODO(分页查询)    
	 * @param :      deviceModel 设备型号 
	 * @param		 deviceType  设备类型
	 * @param :      city	 市
	 * @param :      county  区县     
	 * @return :     操作状态/信息json     
	*/
	@RequestMapping("queryListPage")
	@ResponseBody
	public ResultVO queryListPage(HttpServletRequest request ,Integer pageNo, Integer pageSize) {
		
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	paramMap.put("deviceType",request.getParameter("deviceType"));
		 	paramMap.put("deviceModel",request.getParameter("deviceModel"));
	        paramMap.put("cityId",request.getParameter("cityId"));
	        paramMap.put("countyId",request.getParameter("countyId"));

		PageUtil<TowerPowerRateVO> page = new PageUtil<TowerPowerRateVO>();
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		if(pageNo != null && pageSize != null){
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		powerRateService.queryListPage(page);
		return ResultVO.success(page);
	}
	
	
	/**   
	 * @Description: TODO(根据id查找)    
	 * @param :      id    
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("selectById")
	@ResponseBody
	public ResultVO selectById(String id) {
		return powerRateService.selectById(id);
	}
	
	/**   
	 * @Description: 通过Ids删除其他信息
	 * @param :ContractVO Contract       
	 * @return :     
	 * @throws  
	*/
	@RequestMapping("/delete")
	@ResponseBody
	public ResultVO delete(HttpServletRequest request) {
		String[] IdArray = null;
		String Ids = request.getParameter("Ids");
		if (null == Ids || Ids.equals("")) {
			return ResultVO.failed("参数错误");
		}
		IdArray = Ids.split(",");
		
		if (IdArray.length > 0) {
			powerRateService.delete(IdArray);
		}
		return ResultVO.success();
	}
	
	/**   
	 * @Description: TODO(更新)    
	 * @param :      poManage    
	 * @return :     操作状态/信息json   
	 * @throws  
	*/
	@RequestMapping("update")
	@ResponseBody
	public ResultVO update(TowerPowerRateVO VO) {
		if(VO != null && null != VO.getId() && !"".equals(VO.getId())) {
		   return powerRateService.update(VO);
		}
		return ResultVO.failed("参数错误");
	}
}
