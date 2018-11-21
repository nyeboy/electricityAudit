package com.audit.modules.towerReport.service;

import java.util.List;

import com.audit.modules.towerReport.entity.AuditPowerRatingReportTower;
import com.audit.modules.towerReport.entity.AuditSmartMeterTower;

/**
 * 
 * @Description:稽核统计报表 service   
 * @author  tantaigen
 * @date 2017年3月8日 下午3:29:41
 */
public interface AuditReportTowerService {
	/**
	 * @param year 
	 * 
	 * @Description: 超额定功率标杆情况    
	 * @param :      cityType 1 成都各区    
	 * @return :    List<AuditPowerRatingReport>    
	 * @throws
	 */
	public List<AuditPowerRatingReportTower> SuperPowerRatingCount(String typeCode, String year);
	
	/**
	 * 超智能电表标杆值 超电源开关标杆值
	 * @Description: TODO(请描述此方法的作用)    
	 * @param :       cityType    1 成都 
	 * @return :     List<AuditSmartMeter>   
	 * @throws
	 */
	public List<AuditSmartMeterTower> SuperSmartMeter(String typeCode, String year);


}
