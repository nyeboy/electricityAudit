package com.audit.modules.system.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.system.entity.SysDataVo;

/**
 * @Description:系统数据dao
 * @author 礼斌
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface SystemDataDao {

	List<SysDataVo> queryCityList();
	
	/**
	 * 查询
	 * 
	 * @param id id
	 * @return 信息
	 */
	SysDataVo queryCityInfo(Map<String, String> params);
	
	List<SysDataVo> queryCountyList(String cityId);
	
	/**
	 * 查询
	 * 
	 * @param id ID
	 * @return 信息
	 */
	SysDataVo queryCountyInfo(Map<String, String> params);
	
	/**
	 * 按城市、区县名查询各自ID
	 * 
	 * @param name 参数
	 * @return 城市、区县ID
	 */
	SysDataVo queryCityCounty(Map<String, String> param);
}
