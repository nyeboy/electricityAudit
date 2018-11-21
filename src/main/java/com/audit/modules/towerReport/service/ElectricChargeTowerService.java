package com.audit.modules.towerReport.service;

import java.util.List;

import com.audit.modules.towerReport.entity.ElectricChargeTower;

/**
 * Created by fangren on 2017/3/7.
 * 电费业务类
 */
public interface ElectricChargeTowerService {
	
	
    List<ElectricChargeTower> getstationECStasticByCityId(String cityId, String year, String month, String taxType);
    //单载波电费
    List<ElectricChargeTower> getSCECStasticByCityId(String cityId, String year);

    List<ElectricChargeTower> getScaleECStasticByCityId(String cityId, String year);
}
