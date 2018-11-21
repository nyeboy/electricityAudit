package com.audit.modules.system.service;

import java.util.List;
import java.util.Map;

import com.audit.modules.system.entity.SysDataVo;

/**
 * @Description:系统数据service
 * @author 礼斌
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface SystemDataService {

	public List<SysDataVo> queryCityList();
	
	public List<SysDataVo> queryCountyList(String cityId);
	
	/**
	 * 查询
	 * 
	 * @param id id
	 * @return 信息
	 */
	SysDataVo queryCityInfo(String id);
	
	/**
	 * 查询
	 * 
	 * @param id ID
	 * @return 信息
	 */
	SysDataVo queryCountyInfo(String id);
	
	/**
	 * 按城市、区县名查询各自ID
	 * 
	 * @param name 参数
	 * @return 城市、区县ID
	 */
	SysDataVo queryCityCounty(Map<String, String> params);
}
