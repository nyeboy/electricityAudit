package com.audit.modules.report.service;

import java.util.List;
import java.util.Map;

import com.audit.modules.report.entity.ProvinceSum;

/**
 * @Description 汇总统计的接口
 *
 * @author 王松
 * @date 2017/3/9
 *
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public interface SummaryService {

    /**
     * 获取全省的详细统计
     * @return
     */
    List<Map<String, Object>> detail(String typeCode, String year, String month,Integer auditType);

    /**
     * 获取全省的简略统计
     * @return
     */
    List<Map<String, Object>> simple();

	/**
	 * @param  
	 * @Description: 省首页信息汇总  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	ProvinceSum proviceSummary(String year, String month);
}
