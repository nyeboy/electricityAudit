package com.audit.modules.system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;

/**
 * 
 * @Description: Shiro验证失败后的页面跳转   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月1日 下午5:28:12
 */
@Controller
public class ShiroRedirectController {
	
	/**
	 * 登录状态验证失败后的页面跳转
	 * @return
	 */
	@RequestMapping(value="loginerror",method=RequestMethod.GET)
	@ResponseBody
	public ResultVO loginerror(){
		
		 return ResultVO.failed("loginerror"); 
	}
	
	
	
}
