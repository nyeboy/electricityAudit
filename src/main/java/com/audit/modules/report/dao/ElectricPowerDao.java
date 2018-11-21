/**
 * Copyright (c) 2017, IsoftStone All Right reserved.
 */
package com.audit.modules.report.dao;

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
public interface ElectricPowerDao {

	/**
	 * @Description: 查询某市各区县 年电量 
	 * @param year 
	 * @param cityId    
	 * @throws  
	*/
	List<Map<String, Object>> stasticCountyYearPower(@Param("cityId") String cityId, @Param("year") String year,
			@Param("month") String month,@Param("auditType") Integer auditType);

	/**
	 * @param month    
	 * @Description: 查询某市各区县 年直供/转供电量   
	 * @param :  electricityType // 1:直供 2:转供
	 * @return :     
	 * @throws  
	*/
	List<Map<String, Object>> stasticCountyYearDirectRotary(@Param("cityId") String cityId, @Param("year") String year,
			@Param("month") String month, @Param("electricityType") Integer electricityType,@Param("auditType") Integer auditType);

	/**
	 * @Description: 查询全省各市 年电量 
	 * @param year 
	 * @param    
	 * @throws  
	*/
	List<Map<String, Object>> stasticCityYearPower(@Param("year")String year, @Param("month") String month,@Param("auditType") Integer auditType);

	/**   
	 * @Description: 查询全省各市 年直供/转供电量   
	 * @param :  electricityType // 1:直供 2:转供
	 * @return :     
	 * @throws  
	*/
	List<Map<String, Object>> stasticCityYearDirectRotary(@Param("year") String year, @Param("month") String month,
			@Param("electricityType") Integer electricityType ,@Param("auditType") Integer auditType);
	
	/**   
	 * @Description: 查询全省 年直供/转供电量   
	 * @param : electricityType // 1:直供 2:转供
	 * @return :     
	 * @throws  
	 */
	Double stasticDirectRotarySum(@Param("year") String year, @Param("month") String month,
			@Param("electricityType") String electricityType);

	/**
	 * @Description: 查询某市各区县 某时段电量 
	 * @param 搜索开始日期
	 * @param 搜索截至日期
	 * @param cityId    
	 * @throws  
	*/
	List<Map<String, Object>> stasticCountyTimePower(@Param("cityId") String cityId,
			@Param("startTime") String startTime, @Param("endTime") String endTime);

	/**
	 * @Description: 查询全省 某时段电量
	 * @param 搜索开始日期
	 * @param 搜索截至日期
	 * @throws  
	*/
	List<Map<String, Object>> stasticCityTimePower(@Param("startTime") String startTime,
			@Param("endTime") String endTime);

}
