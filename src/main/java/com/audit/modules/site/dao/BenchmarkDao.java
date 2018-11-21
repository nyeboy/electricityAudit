package com.audit.modules.site.dao;

import java.util.List;
import java.util.Map;

import com.audit.modules.electricity.entity.ElectricityBenchmark;
import com.audit.modules.electricity.entity.TowerEleBenchmark;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.report.entity.SmartMeter;
import com.audit.modules.site.entity.SmartMeterStandard;
import com.audit.modules.site.entity.SwitchPowerStandard;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : 
 * @date : 2017年4月19日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
@Component
@MybatisRepostiory
public interface BenchmarkDao {
	
	//查询智能电表标杆
    List<SmartMeter> querySmartMeterStandard(PageUtil<SmartMeterStandard> page);
    //查询开关电源标杆
    SwitchPowerStandard querySwitchPowerInfo(@Param("intId")String intId);
    //根据电源开关查询报账点信息
    List<SwitchPowerStandard> queryAccountInfo(PageUtil<SwitchPowerStandard> page);
    //查询稽核单超标杆情况
    ElectricityBenchmark queryOverBenchmark(String electricityId);
    //塔维查询稽核单超标杆情况
    TowerEleBenchmark queryOverBenchmarkTw(String tower_electricityId);
    //保存稽核单超标杆情况
    void saveElectricityBenchmark(ElectricityBenchmark electricityBenchmark);
    //删除稽核单超标杆情况
    void deleteElectricityBenchmark(String electricityId);
    //删除稽核单超标杆情况
    List<SmartMeterStandard> queryCurrentStandard(Map<String, Object> map);
    
}
