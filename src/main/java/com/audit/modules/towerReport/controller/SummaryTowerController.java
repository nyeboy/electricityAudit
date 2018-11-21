package com.audit.modules.towerReport.controller;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.Log;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.towerReport.service.SummaryTowerService;

/**
 * @Description 汇总统计，一般首页会使用到
 *
 * @author 王松
 * @date 2017/3/9
 *
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@Controller
@RequestMapping("towerSummary")
public class SummaryTowerController {

	@Autowired
	private SummaryTowerService summaryTowerService;

	/**
	 * 详细情况汇总，应该可以去一个更好的名字，先将就着用吧
	 * @return ResultVO
	 */
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@ResponseBody
	public ResultVO detail(@RequestParam(value = "typeCode") String typeCode,
			String year, String month) {
		Log.info("统计报表——首页全省各市综合信息统计开始============");
		if(null == year || year.equals("")) {
			year = Calendar.getInstance().get(Calendar.YEAR) + "";
			month = Calendar.getInstance().get(Calendar.MONTH) + 1 + "";
		} else if (null == month || month.equals("")){
			month = "12";
		}
		if(typeCode == null || typeCode.equals("")){
			typeCode = "0";
		}
		List<Map<String, Object>> result = summaryTowerService.detail(typeCode, year, month);
		// 返回结果日志记录
		Log.info("统计报表——首页全省各市综合信息统计完成===========");
		return ResultVO.success(result);
	}

	/**
	 * 简单情况汇总，应该可以去一个更好的名字，先将就着用吧
	 * @return ResultVO
	 */
	@RequestMapping(value = "/simple", method = RequestMethod.GET)
	@ResponseBody
	public ResultVO simple() {
		// 返回结果日志记录，后面统一处理
		return ResultVO.success(summaryTowerService.simple());
	}

}
