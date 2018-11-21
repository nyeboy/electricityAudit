package com.audit.modules.system.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.audit.modules.system.dao.SystemDataDao;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.system.service.SystemDataService;

@Service
public class SystemDataServiceImpl implements SystemDataService {

	@Resource
	private SystemDataDao systemDataDao;
	
	@Override
	public List<SysDataVo> queryCityList() {
		return systemDataDao.queryCityList();
	}

	@Override
	public List<SysDataVo> queryCountyList(String cityId) {
		return systemDataDao.queryCountyList(cityId);
	}

	/**
	 * 查询
	 * 
	 * @param id id
	 * @return 信息
	 */
	@Override
	public SysDataVo queryCityInfo(String id) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("id", id);
		return systemDataDao.queryCityInfo(params);
	}

	/**
	 * 查询
	 * 
	 * @param id ID
	 * @return 信息
	 */
	@Override
	public SysDataVo queryCountyInfo(String id) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("id", id);
		return systemDataDao.queryCountyInfo(params);
	}

	/**
	 * 按城市、区县名查询各自ID
	 * 
	 * @param name 参数
	 * @return 城市、区县ID
	 */
	@Override
	public SysDataVo queryCityCounty(Map<String, String> params) {
		return systemDataDao.queryCityCounty(params);
	}

}
