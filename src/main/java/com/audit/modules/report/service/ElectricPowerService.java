package com.audit.modules.report.service;

import java.util.List;

import com.audit.modules.report.entity.ElectricPowerDTO;

/**
 * Created by fangren on 2017/3/7.
 * 电量业务类
 */
public interface ElectricPowerService {

	// 统计年用电量
	List<ElectricPowerDTO> getStationEPStasticByCityId(String cityId, String year, String month,Integer auditType);
	// 统计 直转供电 年用电量
    List<ElectricPowerDTO> getStationDetailEPStasticByCityId(String cityId, String year, String month,Integer auditType);
    
    

}
