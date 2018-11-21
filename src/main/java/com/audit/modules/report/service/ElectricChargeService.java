package com.audit.modules.report.service;

import java.util.List;

import com.audit.modules.report.entity.ElectricChargeDTO;

/**
 * Created by fangren on 2017/3/7.
 * 电费业务类
 */
public interface ElectricChargeService {
	
	
    List<ElectricChargeDTO> getstationECStasticByCityId(String cityId, String year, String month, String taxType,Integer auditType);
    //单载波电费
    List<ElectricChargeDTO> getSCECStasticByCityId(String cityId, String year);

    List<ElectricChargeDTO> getScaleECStasticByCityId(String cityId, String year);
}
