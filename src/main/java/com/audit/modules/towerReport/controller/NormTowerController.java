package com.audit.modules.towerReport.controller;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.Log;
import com.audit.modules.towerReport.entity.FinancialSystemTower;
import com.audit.modules.towerReport.entity.ProvinceSiteTower;
import com.audit.modules.towerReport.entity.SmartMeterTower;
import com.audit.modules.towerReport.service.NormTowerService;

/**   
 * @Description: 指标业务类 
 * @param :      设定文件    
 * @return :     返回类型    
 * @throws  
 * 
 * @author  litiangang
 * @date 2017年3月8日 上午10:43:47    
*/
@Controller("NormTowerController")
@RequestMapping("/towerNorm")
public class NormTowerController {

	@Autowired
	private NormTowerService normTowerService;

	/**   
	 * @Description: 资管、财务系统基站名称一致性报表   
	 * @param :      设定文件    
	 * @return :     returnValue    
	 * @throws  
	*/
	@RequestMapping(value = "/consistency", method = { RequestMethod.GET })
	public @ResponseBody ResultVO financialSystemConsistency(String typeCode, String year) {
		if (null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		if (null == typeCode || typeCode.equals("")) {
			typeCode = "0";
		}
		Log.info("统计报表——资管、财务系统基站名称一致性报表统计开始===========");
		List<FinancialSystemTower> list = normTowerService.financialSystemConsistencyTowerService(typeCode, year);
		Log.debug("返回的数据:" + list);
		Log.info("统计报表——资管、财务系统基站名称一致性报表统计完成===========");
		return ResultVO.success(list);
	}

	/**   
	 * @Description: 全省智能电表接入率、可用率报表
	 * @param :      typeCode:0,全省；1，成都市  
	 * @return :     ResultVO
	 * @throws  
	*/
	@RequestMapping(value = "/availability", method = { RequestMethod.GET })
	public @ResponseBody ResultVO smartMeterOfAvailability(String typeCode, String year) {
		if (null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		if (null == typeCode || typeCode.equals("")) {
			typeCode = "0";
		}
		Log.info("统计报表——全省智能电表接入率、可用率报表统计开始===========");
		List<SmartMeterTower> list = normTowerService.smartMeterOfAvailabilityTowerService(typeCode, year);
		Log.debug("返回的数据:" + list);
		Log.info("统计报表——全省智能电表接入率、可用率报表统计完成===========");
		return ResultVO.success(list);
	}

	/**   
	 * @Description: 全省站点开关电源监控完好率、可用率报表
	 * @param :       typeCode:0,全省；1，成都市 
	 * @return :     ResultVO
	 * @throws  
	*/
	@RequestMapping(value = "/sitePower", method = { RequestMethod.GET })
	public @ResponseBody ResultVO provinceSitePower(String typeCode, String year) {
		if (null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		if (null == typeCode || typeCode.equals("")) {
			typeCode = "0";
		}
		Log.info("统计报表——全省站点开关电源监控完好率、可用率报表统计开始===========");
		List<ProvinceSiteTower> list = normTowerService.provinceSitePowerTowerService(typeCode, year);
		Log.debug("返回的数据:" + list);
		Log.info("统计报表——全省站点开关电源监控完好率、可用率报表统计完成===========");
		return ResultVO.success(list);
	}
}
