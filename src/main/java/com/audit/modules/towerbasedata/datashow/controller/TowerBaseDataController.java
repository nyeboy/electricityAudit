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
import com.audit.modules.electricity.entity.DeviceVO;
import com.audit.modules.tower.entity.TowerSiteVO;
import com.audit.modules.tower.service.TowerSiteService;
import com.audit.modules.towerbasedata.contract.entity.TowerContractVO;
import com.audit.modules.towerbasedata.contract.service.TowerContractService;
import com.audit.modules.towerbasedata.datashow.entity.TowerDataDetail;
import com.audit.modules.towerbasedata.datashow.entity.TowerDataShow;
import com.audit.modules.towerbasedata.datashow.service.TowerBaseDataService;
import com.google.common.collect.Maps;

/**   
 * @Description : TODO(塔维基础数据 --呈现)    
 *
 * @author : chentao
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Controller
@RequestMapping("towerBaseData")
public class TowerBaseDataController {
	
	@Autowired
	private TowerBaseDataService towerBaseDataService;
	@Autowired
	private TowerContractService towerContractService;
	@Autowired
	private TowerSiteService tService;
	
	/**
	 * @Description:基础数据 --呈现
	 * @param :towerNum	铁塔站址编号
	 * @param :resName	资管站名
	 * @param :cityId	市id
	 * @param :countyId	区id
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/showBaseDateByPage")
	@ResponseBody
	public ResultVO showBaseDateByPage(HttpServletRequest request, Integer pageNo, Integer pageSize) {
		
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	paramMap.put("towerNum",request.getParameter("towerNum"));
		 	paramMap.put("resName",request.getParameter("resName"));
	        paramMap.put("cityId",request.getParameter("cityId"));
	        paramMap.put("countyId",request.getParameter("countyId"));
	        paramMap.put("addrName", request.getParameter("addrName"));
	        
		PageUtil<TowerDataShow> pageUtil = new PageUtil<>();
		if (paramMap != null) {
			pageUtil.setObj(paramMap);
		}
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		towerBaseDataService.showBaseDateByPage(pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	
	/**   
	 * @Description: TODO(根据铁塔id查询 --基础数据详情)    
	 * @param :      towerId 铁塔id    
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("showBaseDateDetail")
	@ResponseBody
	public ResultVO showBaseDateDetail(String towerId) {
		
		TowerDataDetail tDetail = new TowerDataDetail();
		//获取报账点基础
		
		TowerSiteVO towerSiteInfo = tService.queryzhLabelByTowerSiteId(towerId);
		if(towerSiteInfo!=null){
			tDetail.setTowerSiteInfo(towerSiteInfo);
		}
		//获取： 供电信息、其他信息
		TowerDataShow tShow = towerBaseDataService.findTowerSiteById(towerId);
		if (tShow != null) {
			tDetail.setTowerDataShow(tShow);
		}
		//获取： 查询机房设备信息
		List<DeviceVO> dList = towerBaseDataService.queryDeviceById(towerId);
		if (dList !=null && dList.size()>0) {
			tDetail.setDeviceVO(dList);
		}
		//获取：合同信息
		List<TowerContractVO> tList = towerContractService.selectByTowerId(towerId);
		if (tList !=null && tList.size()>0) {
			tDetail.setTowerContractVO(tList);
		}
		return ResultVO.success(tDetail);
	}
	
}
