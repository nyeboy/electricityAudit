package com.audit.modules.towerReport.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.towerReport.dao.BeyondMeSwiRateTowerDao;
import com.audit.modules.towerReport.dao.BeyondSwiRateTowerDao;
import com.audit.modules.towerReport.entity.AuditPowerRatingReportTower;
import com.audit.modules.towerReport.entity.AuditSmartMeterTower;
import com.audit.modules.towerReport.entity.BeyondMeSwiRateTower;
import com.audit.modules.towerReport.entity.BeyondSwiRateTower;
import com.audit.modules.towerReport.service.AuditReportTowerService;

/**
 * 
 * @Description: 稽核统计service实现类
 * @author: tantaigen
 * @date 2017年3月8日 下午3:30:30
 */
@Service
public class AuditReportTowerServiceImpl implements AuditReportTowerService {

	@Autowired
	private BeyondSwiRateTowerDao beyondSwiRateTowerDao;
	@Autowired
	private BeyondMeSwiRateTowerDao beyondMeSwiRateTowerDao;

	@Override
	public List<AuditPowerRatingReportTower> SuperPowerRatingCount(String typeCode, String year) {
		List<AuditPowerRatingReportTower> list = new ArrayList<>();
		List<BeyondSwiRateTower> beyondSwiRatingList = beyondSwiRateTowerDao.findByTypeAndYear(typeCode, year);
		String regionName = null;
		String rate = null;
		if (null != beyondSwiRatingList) {
			for (BeyondSwiRateTower beyondSwiRate : beyondSwiRatingList) {
				AuditPowerRatingReportTower powerRatingReport = new AuditPowerRatingReportTower();
				regionName = beyondSwiRate.getRegionName();
				rate = beyondSwiRate.getSupperCount();
				if (null != regionName && !"".equals(regionName) && null != rate && !"".equals(rate)) {
					powerRatingReport.setCityName(regionName);
					powerRatingReport.setProportion(rate.replaceAll("%", ""));
				}
				list.add(powerRatingReport);
			}
		}
		return list;
	}

	@Override
	public List<AuditSmartMeterTower> SuperSmartMeter(String typeCode, String year) {
		List<AuditSmartMeterTower> list = new ArrayList<>();
		List<BeyondMeSwiRateTower> beyondMeSwiRateList = beyondMeSwiRateTowerDao.findByTypeAndYear(typeCode, year);
		String regionName = null;
		String superSmeter = null;
		String superSwith = null;
		if (null != beyondMeSwiRateList) {
			for (BeyondMeSwiRateTower beyondMeSwiRate : beyondMeSwiRateList) {
				AuditSmartMeterTower auditSmartMeterDTO = new AuditSmartMeterTower();
				regionName = beyondMeSwiRate.getRegionName();
				superSmeter = beyondMeSwiRate.getSupperSmeter();
				superSwith = beyondMeSwiRate.getSupperSwith();
				if (null != regionName && null != superSmeter && null != superSwith) {
					auditSmartMeterDTO.setCityName(regionName);
					auditSmartMeterDTO.setProportion1(superSmeter);
					auditSmartMeterDTO.setProportion2(superSwith);
				}
				list.add(auditSmartMeterDTO);
			}
		}
		return list;
	}

}
