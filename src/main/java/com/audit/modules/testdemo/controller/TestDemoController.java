package com.audit.modules.testdemo.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.utils.Log;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.testdemo.service.TestDemoService;

import java.util.Map;

@Controller
@RequestMapping("/testDemo")
public class TestDemoController {

	@Resource
	private TestDemoService testDemoService;
	
	@RequestMapping("queryCityList")
	@ResponseBody
	public ResultVO queryCityList(Model model){
		PageUtil<SysDataVo> page = new PageUtil<>();
		page.setPageNo(1);  
		page.setPageSize(10); 
		testDemoService.queryDataByPage(page);
		return ResultVO.success(page);
	}

	@RequestMapping(value = "/log")
	@ResponseBody
	public ResultVO log(HttpServletRequest request) {
		Log.info("测试日志");
		Log.debug("测试日志");
		try {
			Map map = null;
			map.clear();
		} catch (Exception ex) {
			Log.error(ex);
			Log.error(ex.getMessage(), ex);

		}
		throw new CommonException(new NullPointerException("hello"));
//		return ResultVO.success("测试日志");
	}

}
