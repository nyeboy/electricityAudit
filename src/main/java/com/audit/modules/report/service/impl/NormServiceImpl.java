package com.audit.modules.report.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.report.dao.FinConsistencyDao;
import com.audit.modules.report.dao.SiteSwitchRateDao;
import com.audit.modules.report.dao.SmartUsableDao;
import com.audit.modules.report.dao.StasticRankDao;
import com.audit.modules.report.entity.FinConsistency;
import com.audit.modules.report.entity.FinancialSystem;
import com.audit.modules.report.entity.ProvinceSite;
import com.audit.modules.report.entity.SiteSwitchRate;
import com.audit.modules.report.entity.SmartMeter;
import com.audit.modules.report.entity.SmartUsable;
import com.audit.modules.report.service.NormService;

/**
 * Created by tglic on 2017/3/6.
 */
@Service
public class NormServiceImpl implements NormService {

	@Autowired
	private FinConsistencyDao finConsistencyDao;
	@Autowired
	private SiteSwitchRateDao siteSwitchRateDao;
	@Autowired
	private SmartUsableDao smartUsableDao;
	@Autowired
	private StasticRankDao stasticRankDao;
	
	/**
	 * 资管、财务系统基站名称一致性报表
	 * typeCode:0,全省；1，成都市
	 * @return ResultVO
	 */
	@Override
	public List<FinancialSystem> financialSystemConsistencyService(String typeCode, String year) {
		List<FinancialSystem> list = new ArrayList<FinancialSystem>();
		String regionName = null;
		String finSiteNum = null;
		String successAmounts = null;
		String successRate = null;
		List<FinConsistency> finConsistencyList = finConsistencyDao.findByTypeAndYear(typeCode, year);
		if(null != finConsistencyList)	{
			for(FinConsistency finConsistency : finConsistencyList) {
				regionName = finConsistency.getRegionName();
				finSiteNum = finConsistency.getFinancialSite();
				successAmounts = finConsistency.getSuccessAmounts();
				successRate = finConsistency.getSuccessRate();
				if(null != regionName && null != finSiteNum && null != successAmounts && null != successRate ){
					FinancialSystem financialSystem = new FinancialSystem();
					financialSystem.setCity(regionName);
					financialSystem.setSite(Integer.valueOf(finSiteNum));
					financialSystem.setSuccessData(Integer.valueOf(successAmounts));
					financialSystem.setSuccessRate(successRate.replaceAll("%", ""));
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
	public List<SmartMeter> smartMeterOfAvailabilityService(String typeCode, String year) {
		List<SmartMeter> list = new ArrayList<SmartMeter>();
		SmartMeter smartMeter = null;
		String regionName = null;
		String accessRate = null;
		String availableRate = null;
		List<SmartUsable> smartUsableList = smartUsableDao.findByTypeAndYear(typeCode, year);
		if(null != smartUsableList) {
			for(SmartUsable smartUsable : smartUsableList) {
				regionName = smartUsable.getRegionName();
				accessRate = smartUsable.getAccessRate();
				availableRate = smartUsable.getAvailableRate();
				if(null != regionName && null != accessRate && null != availableRate) {
					smartMeter = new SmartMeter();
					smartMeter.setCity(regionName);
					smartMeter.setAccessRate(accessRate.replaceAll("%", ""));
					smartMeter.setAvailableRate(availableRate.replaceAll("%", ""));;
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
	public List<ProvinceSite> provinceSitePowerService(String typeCode, String year) {
		List<ProvinceSite> list = new ArrayList<ProvinceSite>();
		ProvinceSite provinceSite = null;
		String regionName = null;
		String availableRate = null;
		String intactRate = null;
		String crossSiteAmount = null;
		List<SiteSwitchRate> siteSwitchRateList = siteSwitchRateDao.findByTypeAndYear(typeCode, year);
		if(null != siteSwitchRateList){
			for(SiteSwitchRate siteSwitchRate : siteSwitchRateList) {
				provinceSite = new ProvinceSite();
				regionName = siteSwitchRate.getRegionName();
				intactRate = siteSwitchRate.getIntactRate();
				crossSiteAmount = siteSwitchRate.getCrossSiteAmount();
				availableRate = siteSwitchRate.getAvailableRate();
				if(null != regionName && null != intactRate && null != availableRate) {
					provinceSite = new ProvinceSite();
					provinceSite.setCity(regionName);
					provinceSite.setSite(Integer.valueOf(crossSiteAmount));
					provinceSite.setAvailableRate(availableRate.replaceAll("%", ""));
					provinceSite.setAvailability(intactRate.replaceAll("%", ""));
					list.add(provinceSite);
				}
			}
		}
		return list;
	}

	/**   
	 * @Description: 全省综合排名  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public List<String> findRankByTypeAndYear(String typeCode, String year) {
		
		
		return stasticRankDao.findByTypeAndYear(typeCode, year);
	}

}
