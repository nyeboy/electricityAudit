package com.audit.modules.towerReport.controller;

import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.Log;
import com.audit.modules.towerReport.entity.AuditPowerRatingReportTower;
import com.audit.modules.towerReport.entity.AuditSmartMeterTower;
import com.audit.modules.towerReport.service.AuditReportTowerService;

/**
 * 
 * @Description: 稽核统计业务类   
 * 
 * @author  tantaigen
 * @date 2017年3月8日 下午3:28:50
 */
@Controller("AuditTowerController")
@RequestMapping("/towerAuditReport")
public class AuditTowerController {

	@Autowired
	AuditReportTowerService auditReportTowerService;
	
	/**   
     * @Description: 全省基站超额定功率标杆值占比情况
     * @param :         cityType 1 ：成都  
     * @return :     ResultVO
     * @throws  
    */
	@RequestMapping(value = "/superPowerRating", method = RequestMethod.GET)
	@ResponseBody
	public ResultVO SuperPowerRatingCount(HttpServletResponse response, String typeCode, String year) {
		Log.info("统计报表——全省基站超额定功率标杆值占比情况统计开始===========");
		if (null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		if(typeCode == null || typeCode.equals("")){
			typeCode = "0";
		}
		try {
			List<AuditPowerRatingReportTower> list = auditReportTowerService.SuperPowerRatingCount(typeCode, year);
			Log.info("统计报表——全省基站超额定功率标杆值占比情况统计成功===========");
			return ResultVO.success(list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		Log.error("统计报表——全省基站超额定功率标杆值占比情况统计失败");
		return ResultVO.failed("fail");
	}

	/**   
     * @Description: 超智能电表标杆值比例 /超电源开关标杆值比例 报表
     * @param :          
     * @return :     ResultVO
     * @throws  
    */
	@RequestMapping(value = "/superSmartMeter", method = RequestMethod.GET)
	@ResponseBody
	public ResultVO SuperSmartMeterCount(HttpServletResponse response, String typeCode, String year) {
		if (null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		if(typeCode == null || typeCode.equals("")){
			typeCode = "0";
		}
		Log.info("统计报表——超智能电表标杆值比例 /超电源开关标杆值比例 报表统计开始===========");
		try {
			List<AuditSmartMeterTower> list = auditReportTowerService.SuperSmartMeter(typeCode, year);
			Log.info("统计报表——超智能电表标杆值比例 /超电源开关标杆值比例 报表统计成功===========");	
			return  ResultVO.success(list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		Log.error("统计报表——超智能电表标杆值比例 /超电源开关标杆值比例 报表统计失败");
		return ResultVO.failed("fail");
	}

}
