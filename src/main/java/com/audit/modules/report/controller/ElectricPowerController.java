package com.audit.modules.report.controller;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.Log;
import com.audit.modules.report.entity.ElectricPowerDTO;
import com.audit.modules.report.service.ElectricPowerService;

/**
 * Created by fangren on 2017/3/7.
 * 电量业务类
 */
@Controller("ElectricPowerController")
@RequestMapping("/electricPower")
public class ElectricPowerController {

	@Autowired
	private ElectricPowerService electricPowerService;

	/**
	 * 全省站点用电量情况
	 * @return ResultVO
	 */
	@RequestMapping(value = "/stationEPStastic", method = { RequestMethod.GET })
	@ResponseBody
	public ResultVO stationEPStastic(@RequestParam(required = false, defaultValue = "0") Integer typeCode,
			String year, String month,Integer auditType) {
		if(auditType==-1){
			auditType=null;
		}
		if (null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		if (null == month || month.equals("")) {
			 if( year.equals(Calendar.getInstance().get(Calendar.YEAR) + "")){
				 month = Calendar.getInstance().get(Calendar.MONTH) + 1 + "";
			 }else {
				 month = "12";
			 }
		}
		Log.info("统计报表——全省站点用电量情况统计开始===========");
		try {
			List<ElectricPowerDTO> list = electricPowerService.getStationEPStasticByCityId(typeCode.toString(), year, month,auditType);
			Log.info("统计报表——全省站点用电量情况统计成功===========");
			return ResultVO.success("success", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		Log.error("统计报表——全省站点用电量情况统计失败");
		return ResultVO.failed(400, "failed");
	}

	/**
	 * 全省站点直供电，转供电用电量情况
	 * @return ResultVO
	 */
	@RequestMapping(value = "/stationDetailEPStastic", method = { RequestMethod.GET })
	@ResponseBody
	public ResultVO stationDetailEPStastic(@RequestParam(required = false, defaultValue = "0") Integer typeCode,
			String year, String month,Integer auditType) {
		if(auditType==-1){
			auditType=null;
		}
		if (null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		if (null == month || month.equals("")) {
			 if( year.equals(Calendar.getInstance().get(Calendar.YEAR) + "")){
				 month = Calendar.getInstance().get(Calendar.MONTH) + 1 + "";
			 }else {
				 month = "12";
			 }
		}
		Log.info("统计报表——全省站点直供电，转供电用电量情况统计开始===========");
		try {
			List<ElectricPowerDTO> list = electricPowerService.getStationDetailEPStasticByCityId(typeCode.toString(),
					year, month,auditType);
			Log.info("统计报表——全省站点直供电，转供电用电量情况统计成功===========");
			return ResultVO.success("success", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		Log.error("统计报表——全省站点直供电，转供电用电量情况统计失败");
		return ResultVO.failed(400, "failed");
	}

}
