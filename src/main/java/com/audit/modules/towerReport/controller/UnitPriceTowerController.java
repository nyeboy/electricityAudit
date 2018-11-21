package com.audit.modules.towerReport.controller;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.Log;
import com.audit.modules.towerReport.service.UnitPriceTowerService;

/**
 * 
 * @Description: 单价统计业务类     
 * @author  tantaigen
 * @date 2017年3月8日 下午3:25:27
 */
@Controller("UnitPriceTowerController")
@RequestMapping("/towerUnitPrice")
public class UnitPriceTowerController {
	@Autowired
	UnitPriceTowerService unitPriceTowerService;

	/**
	 * 
	 * @Description: 全省电费单价占比情况统计(默认显示转供电)
	 * @param :      typeCode 0：全省各市数据；  1 ：成都各区数据 ；
	 * @return :     ResultVO     
	 * @throws
	 */
	@RequestMapping("/proportion")
	@ResponseBody
	public ResultVO UnitPriceProportion(String typeCode, String year) {
		// 获取层级数据
		if(typeCode == null || typeCode.equals("")){
			typeCode = "0";
		}
		//获取查询年份
		if(year == null || year.equals("") ){
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
		}
		String supplyType = "1";//获取直供电、转供电类型,默认查询转供电数据
		Log.info("统计报表——" + year + "年全省电费单价占比情况统计开始===========");
		List<Map<String,Object>> list = unitPriceTowerService.UnitPriceProportionCount(typeCode, year, supplyType);
		if(list != null){
			Log.info("统计报表——" + year + "年全省电费单价占比情况统计成功===========");
			return ResultVO.success(list);
		} else {
			Log.error("统计报表——" + year + "年全省电费单价占比情况统计失败");
			return ResultVO.failed("fail");
		}
	}
}
