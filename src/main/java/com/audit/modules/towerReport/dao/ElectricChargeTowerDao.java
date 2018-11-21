/**
 * Copyright (c) 2017, IsoftStone All Right reserved.
 */
package com.audit.modules.towerReport.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;

/**   
 * @Description: 电费统计查询   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月17日 上午9:39:16    
*/
@Component
@MybatisRepostiory
public interface ElectricChargeTowerDao{

	/**
	 * @param month 
	 * @Description: 统计指定市的各区县年电费  1~x月 (含税)
	 * @param year 
	 * @param cityId 
	 * @throws  
	*/
	List<Map<String, Object>> stasticCountyYearMoneyAll(@Param("cityId") String cityId, @Param("year") String year,
			@Param("month") String month);
	/**
	 * @param month 
	 * @Description: 统计指定市的各区县年电费  1~x月 (不含税)
	 * @param year 
	 * @param cityId 
	 * @throws  
	 */
	List<Map<String, Object>> stasticCountyYearMoneyNoTax(@Param("cityId") String cityId, @Param("year") String year,
			@Param("month") String month);

	/**
	 * @param month    
	 * @Description: 查询全省各市 年电费  1~x月(含税)
	 * @param year 
	 * @param cityId       
	 * @return :     
	 * @throws  
	*/
	List<Map<String, Object>> stasticCityYearMoneyAll(@Param("year") String year, @Param("month") String month);
	
	/**
	 * @param month    
	 * @Description: 查询全省各市 年电费  1~x月（不含税）
	 * @param year 
	 * @param cityId       
	 * @return :     
	 * @throws  
	 */
	List<Map<String, Object>> stasticCityYearMoneyNoTax(@Param("year") String year, @Param("month") String month);

}
