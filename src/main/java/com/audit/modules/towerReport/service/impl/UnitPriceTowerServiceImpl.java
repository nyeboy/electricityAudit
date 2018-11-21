package com.audit.modules.towerReport.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.utils.Log;
import com.audit.modules.towerReport.dao.UnitPriceTowerDao;
import com.audit.modules.towerReport.entity.UnitPriceTower;
import com.audit.modules.towerReport.service.UnitPriceTowerService;

/**
 * 
 * @Description:单价统计报表service实现
 * @author: tantaigen
 * @date 2017年4月28日 下午3:28:19
 */
@Service
public class UnitPriceTowerServiceImpl implements UnitPriceTowerService {
	
	@Autowired
	private UnitPriceTowerDao unitPriceTowerDao;

	@Override
	public List<Map<String,Object>> UnitPriceProportionCount(String typeCode, String year, String supplyType){
		
		List<UnitPriceTower> datalist = new ArrayList<>();
		List<Map<String,Object>> list = new LinkedList<>();
		
		datalist = unitPriceTowerDao.findByTypeAndYear(typeCode, year, supplyType);
		for (UnitPriceTower data:datalist){
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("cityName", data.getRegionName());
			map.put("proportion1", data.getHighCharge());
			map.put("proportion2", data.getMidCharge());
			map.put("proportion3", data.getLowCharge());	
			list.add(map);
			Log.info("统计报表——" + data.getRegionName() + "市电费单价占比情况统计完成");
		}
		return list;
	}

}
