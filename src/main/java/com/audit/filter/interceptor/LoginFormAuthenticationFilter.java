package com.audit.filter.interceptor;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;

import com.audit.modules.common.utils.Log;

/**
 * 
 * @Description: 自定义的登录状态校验类（如果request有参数loginAccountParam,则完成登录然后跳转原来的请求）
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月6日 上午10:08:35
 */
public class LoginFormAuthenticationFilter extends FormAuthenticationFilter {

	@Override
	protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
		String account = null;
		boolean isAllowed = false;

		Log.info("LoginFilter");

		try {
			request.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		HttpServletRequest req = (HttpServletRequest) request;

		Map<String, String[]> paramMap = req.getParameterMap();
		for (String key : paramMap.keySet()) {
			Log.info(key + ":" + String.join("", paramMap.get(key)));
		}
		Log.info(req.getRequestURI() + "");
		
		
		// 获取Subject单例对象
		Subject subject = SecurityUtils.getSubject();
		Log.info("sessionID:" + subject.getSession().getId());
		
		//是否是自执行请求
		String executeRequest = request.getParameter("executeApplyRequest");
		if (null != executeRequest && executeRequest.equals("1")) {
			return true;
		}
		//是否是登录、登出操作
		String loginreg = ".*loginController/login\\.do.*|.*loginController/loginOut\\.do.*";
		if (req.getRequestURI().replaceAll("%20", "").matches(loginreg)) {
			return true;
		}
		// 是否需要进行快捷登录
		account = request.getParameter("loginAccountParam");
		if (account != null && !account.equals("") ) {
			//判断是否已经快捷登录过
			if( null == request.getAttribute("loginRequest") || !request.getAttribute("loginRequest").equals("1")){
				//没有登陆则，添加快捷登录的标识（先完成登陆后，再跳转原来的请求）
				request.setAttribute("loginRequest", "1");
				return true;
			}
		}else if(null != request.getAttribute("loginRequest") ){
			request.setAttribute("loginRequest", "0");
			//已经快捷登陆过，则去除标识,正常访问
			request.removeAttribute("loginRequest");
		}
		
		isAllowed = super.isAccessAllowed(request, response, mappedValue);
		Log.info("isAllowed:" + isAllowed);
		return isAllowed;
	}
}
