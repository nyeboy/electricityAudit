package com.audit.modules.report.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.report.dao.BeyondMeSwiRateDao;
import com.audit.modules.report.dao.BeyondSwiRateDao;
import com.audit.modules.report.entity.AuditPowerRatingReportDTO;
import com.audit.modules.report.entity.AuditSmartMeterDTO;
import com.audit.modules.report.entity.BeyondMeSwiRate;
import com.audit.modules.report.entity.BeyondSwiRate;
import com.audit.modules.report.service.AuditReportService;

/**
 * 
 * @Description: 稽核统计service实现类
 * @author: tantaigen
 * @date 2017年3月8日 下午3:30:30
 */
@Service
public class AuditReportServiceImpl implements AuditReportService {

	@Autowired
	private BeyondSwiRateDao beyondSwiRateDao;
	@Autowired
	private BeyondMeSwiRateDao beyondMeSwiRateDao;

	@Override
	public List<AuditPowerRatingReportDTO> SuperPowerRatingCount(String typeCode, String year) {
		List<AuditPowerRatingReportDTO> list = new ArrayList<>();
		List<BeyondSwiRate> beyondSwiRatingList = beyondSwiRateDao.findByTypeAndYear(typeCode, year);
		String regionName = null;
		String rate = null;
		if (null != beyondSwiRatingList) {
			for (BeyondSwiRate beyondSwiRate : beyondSwiRatingList) {
				AuditPowerRatingReportDTO powerRatingReport = new AuditPowerRatingReportDTO();
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
	public List<AuditSmartMeterDTO> SuperSmartMeter(String typeCode, String year) {
		List<AuditSmartMeterDTO> list = new ArrayList<>();
		List<BeyondMeSwiRate> beyondMeSwiRateList = beyondMeSwiRateDao.findByTypeAndYear(typeCode, year);
		String regionName = null;
		String superSmeter = null;
		String superSwith = null;
		if (null != beyondMeSwiRateList) {
			for (BeyondMeSwiRate beyondMeSwiRate : beyondMeSwiRateList) {
				AuditSmartMeterDTO auditSmartMeterDTO = new AuditSmartMeterDTO();
				regionName = beyondMeSwiRate.getRegionName();
				superSmeter = beyondMeSwiRate.getSupperSmeter();
				superSwith = beyondMeSwiRate.getSupperSwith();
				if (null != regionName && null != superSmeter && null != superSwith) {
					auditSmartMeterDTO.setCityName(regionName);
					auditSmartMeterDTO.setProportion1(superSmeter.replaceAll("%", ""));
					auditSmartMeterDTO.setProportion2(superSwith.replaceAll("%", ""));
				}
				list.add(auditSmartMeterDTO);
			}
		}
		return list;
	}

}
