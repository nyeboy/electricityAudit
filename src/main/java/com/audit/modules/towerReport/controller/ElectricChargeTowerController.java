package com.audit.modules.towerReport.controller;

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
import com.audit.modules.towerReport.entity.ElectricChargeTower;
import com.audit.modules.towerReport.service.ElectricChargeTowerService;

/**
 * Created by fangren on 2017/3/7.
 * 电费业务类
 */
@Controller("ElectricChargeTowerController")
@RequestMapping("/towerElectricCharge")
public class ElectricChargeTowerController {

	@Autowired
	private ElectricChargeTowerService electricChargeTowerService;

	/**
	 * 全省站点电费情况
	 * @return ResultVO
	 */
	@RequestMapping(value = "/stationECStastic", method = { RequestMethod.GET })
	@ResponseBody
	public ResultVO stationECStastic(@RequestParam(required = false, defaultValue = "0") Integer typeCode,
			String year, String month, String taxType) {
		Log.info("统计报表——全省站点电费情况统计开始===========");
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
		month = month.replaceAll("^0*", "");
		if(null == taxType || taxType.equals("")) {
			taxType = "0";
		}
		try {
			List<ElectricChargeTower> list = electricChargeTowerService.getstationECStasticByCityId(typeCode.toString(), year,
					month, taxType);
			Log.info("统计报表——全省站点电费情况统计成功===========");
			return ResultVO.success("success", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		Log.error("统计报表——全省站点电费情况统计失败");
		return ResultVO.failed(400, "failed");
	}

	/**
	 * 全省站点单载波电费情况
	 * @return ResultVO
	 */
	@RequestMapping(value = "/scECStastic", method = { RequestMethod.GET })
	@ResponseBody
	public ResultVO scECStastic(String typeCode, String year) {
		Log.info("全省站点单载波电费情况统计开始===========");
		if (null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		if(typeCode == null || typeCode.equals("")){
			typeCode = "0";
		}
		try {
			List<ElectricChargeTower> list = electricChargeTowerService.getSCECStasticByCityId(typeCode, year);
			Log.info("全省站点单载波电费情况统计成功===========");
			return ResultVO.success("success", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		Log.error("全省站点单载波电费情况统计失败");
		return ResultVO.failed(400, "failed");
	}

	/**
	 * 全省站点电费占收比，占支比
	 * @return ResultVO
	 */
	@RequestMapping(value = "/scaleECStastic", method = { RequestMethod.GET })
	@ResponseBody
	public ResultVO scaleECStastic(String typeCode , String year) {
		Log.info("全省站点电费占收比，占支比情况统计开始===========");
		
		if (null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		if(typeCode == null || typeCode.equals("")){
			typeCode = "0";
		}
		try {
			List<ElectricChargeTower> list = electricChargeTowerService.getScaleECStasticByCityId(typeCode, year);
			Log.info("全省站点电费占收比，占支比情况统计成功===========");
			return ResultVO.success("success", list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		Log.error("全省站点电费占收比，占支比情况统计失败");
		return ResultVO.failed(400, "failed");
	}
}
