package com.audit.modules.report.service;

import java.util.List;
import java.util.Map;

/**
 * @Description: 单价统计报表service
 * @author  tantaigen
 * @date 2017年3月8日 下午3:27:15
 */
public interface UnitPriceService {
	/**
	 * 
	 * @Description: 全省基站电费单价占比情况   
	 * @param :      cityType   1 成都  
	 * @return :     List<UnitPrice>   
	 * @throws
	 */
	
	public List<Map<String, Object>> UnitPriceProportionCount(String typeCode, String year, String supplyType);

}
