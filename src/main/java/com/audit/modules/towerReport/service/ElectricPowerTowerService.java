package com.audit.modules.towerReport.service;

import java.util.List;

import com.audit.modules.towerReport.entity.ElectricPowerTower;

/**
 * Created by fangren on 2017/3/7.
 * 电量业务类
 */
public interface ElectricPowerTowerService {

	// 统计年用电量
	List<ElectricPowerTower> getStationEPStasticByCityId(String cityId, String year, String month);
	// 统计 直转供电 年用电量
    List<ElectricPowerTower> getStationDetailEPStasticByCityId(String cityId, String year, String month);
    
    

}
