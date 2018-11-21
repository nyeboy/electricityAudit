package com.audit.modules.report.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.utils.Log;
import com.audit.modules.report.dao.UnitPriceDao;
import com.audit.modules.report.entity.UnitPrice;
import com.audit.modules.report.service.UnitPriceService;

/**
 * 
 * @Description:单价统计报表service实现
 * @author: tantaigen
 * @date 2017年4月28日 下午3:28:19
 */
@Service
public class UnitPriceServiceImpl implements UnitPriceService {
	
	@Autowired
	private UnitPriceDao unitPriceDao;

	@Override
	public List<Map<String,Object>> UnitPriceProportionCount(String typeCode, String year, String supplyType){
		
		List<UnitPrice> datalist = new ArrayList<>();
		List<Map<String,Object>> list = new LinkedList<>();
		
		datalist = unitPriceDao.findByTypeAndYear(typeCode, year, supplyType);
		for (UnitPrice data:datalist){
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("cityName", data.getRegionName());
			map.put("proportion1", data.getHighCharge().replaceAll("%",""));
			map.put("proportion2", data.getMidCharge().replaceAll("%",""));
			map.put("proportion3", data.getLowCharge().replaceAll("%",""));	
			list.add(map);
			Log.info("统计报表——" + data.getRegionName() + "市电费单价占比情况统计完成");
		}
		return list;
	}

}
