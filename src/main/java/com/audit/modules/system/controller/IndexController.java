package com.audit.modules.system.controller;


import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.system.entity.MenuVo;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.service.SysResourceService;
import com.audit.modules.system.service.UserService;

/**
 * 
 * @Description: 左菜单   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月10日 上午10:49:43
 */
@Controller
@RequestMapping("index")
public class IndexController {

    @Autowired
    private SysResourceService resourceService;
    @Autowired
    private UserService userService;
    
    /**
     * 
     * @Description: 根据用户名获取菜单  
     * @param : account 用户名
     * @return : ResultVO 包含菜单列表    
     * @throws
     */
    @RequestMapping("/getIndex")
    @ResponseBody
    public ResultVO getIndex(HttpServletRequest request) {
    	String functionType = request.getParameter("functionType");
    	if(null == functionType || "".equals(functionType)){
			functionType = "0";
		}
    	String account = null;
    	List<MenuVo> menuVoList = new ArrayList<MenuVo>();
    	Set<String> permissionSet =null;
    	//获取当前用户
    	Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		UserVo userVo = (UserVo) session.getAttribute("user");
		if(null != userVo) {
			//获得账户名
			account = userVo.getAccount();
		}
    	if(null != account){
    		
    		 permissionSet = userService.findPermissions(account);
    	} else {
    		return ResultVO.failed("参数错误");
    	}
        if(null != permissionSet && permissionSet.size() > 0){
        	menuVoList = resourceService.findMenus(permissionSet, functionType);
        }
        return ResultVO.success(menuVoList);
    }

}
