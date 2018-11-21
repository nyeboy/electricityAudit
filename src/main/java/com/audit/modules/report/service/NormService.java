package com.audit.modules.report.service;

import java.util.List;

import com.audit.modules.report.entity.FinancialSystem;
import com.audit.modules.report.entity.ProvinceSite;
import com.audit.modules.report.entity.SmartMeter;

/**
 * Created by tglic on 2017/3/6.
 */
public interface NormService {

    //资管、财务系统基站名称一致性报表
	List<FinancialSystem> financialSystemConsistencyService(String typeCode, String year);

    //全省智能电表接入率、可用率报表
	List<SmartMeter> smartMeterOfAvailabilityService(String typeCode, String year);

    //全省站点开关电源监控完好率、可用率报表
	List<ProvinceSite> provinceSitePowerService(String typeCode, String year);
	
	//全省站点综合排名
	List<String> findRankByTypeAndYear(String typeCode, String year);

}
