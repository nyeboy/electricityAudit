package com.audit.modules.common.utils;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;

import com.audit.modules.system.entity.UserVo;

public class GlobalUitl {

	private static String _USER_LOGIN_SESSION_KEY = "user";
	
	public static Session getSession() {
		return SecurityUtils.getSubject().getSession();
	}
	
	/** 获取登陆信息 */
	public static UserVo getLoginUser(){
		return (UserVo)getSession().getAttribute(_USER_LOGIN_SESSION_KEY);
	}
	
	/** 存储登陆信息 */
	public static void storeLoginUserInfo(UserVo user) {
		getSession().setAttribute(_USER_LOGIN_SESSION_KEY, user);
	}

	/** 会话失效，删除登陆对象 */
	public static void inValidLogin() {
		try {
			getSession().removeAttribute(_USER_LOGIN_SESSION_KEY);
		} catch (Exception e) {
		}
	}
}
