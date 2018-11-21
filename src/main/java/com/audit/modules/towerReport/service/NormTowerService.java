package com.audit.modules.towerReport.service;

import java.util.List;

import com.audit.modules.towerReport.entity.FinancialSystemTower;
import com.audit.modules.towerReport.entity.ProvinceSiteTower;
import com.audit.modules.towerReport.entity.SmartMeterTower;

/**
 * Created by tglic on 2017/3/6.
 */
public interface NormTowerService {

    //资管、财务系统基站名称一致性报表
	List<FinancialSystemTower> financialSystemConsistencyTowerService(String typeCode, String year);

    //全省智能电表接入率、可用率报表
	List<SmartMeterTower> smartMeterOfAvailabilityTowerService(String typeCode, String year);

    //全省站点开关电源监控完好率、可用率报表
	List<ProvinceSiteTower> provinceSitePowerTowerService(String typeCode, String year);

}
