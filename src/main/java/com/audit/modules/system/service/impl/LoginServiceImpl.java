package com.audit.modules.system.service.impl;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.system.dao.LoginDao;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.service.LoginService;

/**
 * @author : chentao
 * @Description : 用户登录
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Service
public class LoginServiceImpl implements LoginService{

	@Autowired
	private LoginDao loginDao;
	
	@Autowired
	private HttpServletRequest request;
	
	@Override
	public UserVo findUserByName(String account) {
		return loginDao.findUserByName(account);
	}
/*	
	*//**
     * @Description: 检查登录用户等级
     * @param :userId 用户ID
     * @return :
    *//*
	@Override
	public Map<String,Object> checkUserByUserId(String userId){
		Map<String,Object> result = new HashMap<String,Object>();
		UserVo user = loginDao.getUserByUserId(userId);
		if (user.getUserType() != null) {
			if (user.getUserLevel() == 1) {
				result.put("level", user.getCity());
			} else if (user.getUserLevel() == 0) {
				result.put("level", 1);
			}
		} else {
			result.put("level", 0);
		}
		//dao修改待补
		List<Map<String,Object>> userRoles = null;
		if(userRoles!=null&&userRoles.isEmpty()){
			result.put("roleNames", null);
		} else {
			List<String> roleNames = new ArrayList<String>();
			for(Map<String,Object> userRole:userRoles){
				roleNames.add((String)userRole.get("NAME"));
			}
			result.put("roleNames", roleNames);
		}
		return result;
	}
	*/
	
	/**
     * @Description:获取客户端登录ip
     * @return :string : ip
    */
	@Override
	public String getIp(){
		String ipAddress = null;    
//	    ipAddress = request.getRemoteAddr();     
        ipAddress = request.getHeader("x-forwarded-for");     
        if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {     
            ipAddress = request.getHeader("Proxy-Client-IP");     
        }     
        if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {     
            ipAddress = request.getHeader("WL-Proxy-Client-IP");     
        }     
        if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {     
            ipAddress = request.getRemoteAddr();    
            //如下代码是获取本地内网ip地址</span>  

           if(ipAddress.equals("127.0.0.1")){     
        //根据网卡取本机配置的IP     
        InetAddress inet=null;     
        try {     
            inet = InetAddress.getLocalHost();     
        } catch (UnknownHostException e) {     
            e.printStackTrace();  
            ipAddress="无法获取IP地址";  
        }     
        ipAddress= inet.getHostAddress();     
	    }     
	  
	}    
			//对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割     
			if(ipAddress!=null && ipAddress.length()>15){ //"***.***.***.***".length() = 15     
			    if(ipAddress.indexOf(",")>0){     
			        ipAddress = ipAddress.substring(0,ipAddress.indexOf(","));     
			    }     
			}    
			return ipAddress; 
	    }
}
