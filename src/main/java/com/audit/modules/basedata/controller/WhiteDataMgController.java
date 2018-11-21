package com.audit.modules.basedata.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.entity.WhiteSubmit;
import com.audit.modules.basedata.entity.whiteSubmitMg;
import com.audit.modules.basedata.service.WhiteDataMgService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.UserVo;
import com.google.common.collect.Maps;

@RequestMapping("whiteDataMg")
@Controller
public class WhiteDataMgController {
	
	private WhiteDataMgService whiteDataMgServie;
	@RequestMapping("findWhiteDataSubmitByPage")
	@ResponseBody
	public ResultVO getWhiteSubmitByPage(HttpServletRequest request ,Integer pageNo, Integer pageSize){
		List<WhiteSubmit> whiteSubmitByPage = whiteDataMgServie.getWhiteSubmitByPage();
		return ResultVO.success(whiteSubmitByPage);
	}
	
	

}
