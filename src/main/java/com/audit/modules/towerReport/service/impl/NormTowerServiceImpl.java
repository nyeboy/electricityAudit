package com.audit.modules.towerReport.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.towerReport.dao.FinConsistencyTowerDao;
import com.audit.modules.towerReport.dao.SiteSwitchRateTowerDao;
import com.audit.modules.towerReport.dao.SmartUsableTowerDao;
import com.audit.modules.towerReport.entity.FinConsistencyTower;
import com.audit.modules.towerReport.entity.FinancialSystemTower;
import com.audit.modules.towerReport.entity.ProvinceSiteTower;
import com.audit.modules.towerReport.entity.SiteSwitchRateTower;
import com.audit.modules.towerReport.entity.SmartMeterTower;
import com.audit.modules.towerReport.entity.SmartUsableTower;
import com.audit.modules.towerReport.service.NormTowerService;

/**
 * Created by tglic on 2017/3/6.
 */
@Service
public class NormTowerServiceImpl implements NormTowerService {

	@Autowired
	private FinConsistencyTowerDao finConsistencyTowerDao;
	@Autowired
	private SiteSwitchRateTowerDao siteSwitchRateTowerDao;
	@Autowired
	private SmartUsableTowerDao smartUsableTowerDao;
	
	/**
	 * 资管、财务系统基站名称一致性报表
	 * typeCode:0,全省；1，成都市
	 * @return ResultVO
	 */
	@Override
	public List<FinancialSystemTower> financialSystemConsistencyTowerService(String typeCode, String year) {
		List<FinancialSystemTower> list = new ArrayList<FinancialSystemTower>();
		String regionName = null;
		String finSiteNum = null;
		String successAmounts = null;
		String successRate = null;
		List<FinConsistencyTower> finConsistencyList = finConsistencyTowerDao.findByTypeAndYear(typeCode, year);
		if(null != finConsistencyList)	{
			for(FinConsistencyTower finConsistency : finConsistencyList) {
				regionName = finConsistency.getRegionName();
				finSiteNum = finConsistency.getFinancialSite();
				successAmounts = finConsistency.getSuccessAmounts();
				successRate = finConsistency.getSuccessRate();
				if(null != regionName && null != finSiteNum && null != successAmounts && null != successRate ){
					FinancialSystemTower financialSystem = new FinancialSystemTower();
					financialSystem.setCity(regionName);
					financialSystem.setSite(Integer.valueOf(finSiteNum));
					financialSystem.setSuccessData(Integer.valueOf(successAmounts));
					financialSystem.setSuccessRate(successRate);
					list.add(financialSystem);
				}
			}
		}
		return list;
	}

	/**
	 * 全省智能电表接入率、可用率报表
	 *  typeCode:0,全省；1，成都市
	 * @return ResultVO
	 */
	@Override
	public List<SmartMeterTower> smartMeterOfAvailabilityTowerService(String typeCode, String year) {
		List<SmartMeterTower> list = new ArrayList<SmartMeterTower>();
		SmartMeterTower smartMeter = null;
		String regionName = null;
		String accessRate = null;
		String availableRate = null;
		List<SmartUsableTower> smartUsableList = smartUsableTowerDao.findByTypeAndYear(typeCode, year);
		if(null != smartUsableList) {
			for(SmartUsableTower smartUsable : smartUsableList) {
				regionName = smartUsable.getRegionName();
				accessRate = smartUsable.getAccessRate();
				availableRate = smartUsable.getAvailableRate();
				if(null != regionName && null != accessRate && null != availableRate) {
					smartMeter = new SmartMeterTower();
					smartMeter.setCity(regionName);
					smartMeter.setAccessRate(accessRate);
					smartMeter.setAvailableRate(availableRate);;
					list.add(smartMeter);
				}
			}
		}
		return list;
	}

	/**
	 * 全省站点开关电源监控完好率、可用率报表
	 *  typeCode:0,全省；1，成都市
	 * @return ResultVO
	 */
	@Override
	public List<ProvinceSiteTower> provinceSitePowerTowerService(String typeCode, String year) {
		List<ProvinceSiteTower> list = new ArrayList<ProvinceSiteTower>();
		ProvinceSiteTower provinceSite = null;
		String regionName = null;
		String availableRate = null;
		String intactRate = null;
		String crossSiteAmount = null;
		List<SiteSwitchRateTower> siteSwitchRateList = siteSwitchRateTowerDao.findByTypeAndYear(typeCode, year);
		if(null != siteSwitchRateList){
			for(SiteSwitchRateTower siteSwitchRate : siteSwitchRateList) {
				provinceSite = new ProvinceSiteTower();
				regionName = siteSwitchRate.getRegionName();
				intactRate = siteSwitchRate.getIntactRate();
				crossSiteAmount = siteSwitchRate.getCrossSiteAmount();
				availableRate = siteSwitchRate.getAvailableRate();
				if(null != regionName && null != intactRate && null != availableRate) {
					provinceSite = new ProvinceSiteTower();
					provinceSite.setCity(regionName);
					provinceSite.setSite(Integer.valueOf(crossSiteAmount));
					provinceSite.setAvailableRate(intactRate);
					provinceSite.setAvailability(intactRate);
					list.add(provinceSite);
				}
			}
		}
		return list;
	}

}
