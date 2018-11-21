package com.audit.filter.interceptor;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.audit.modules.common.utils.Log;
import com.audit.modules.system.entity.UserVo;

/**
 * 
 * @Description: 便捷登录拦截器 （如果带登录参数，先转发到登录接口，再跳转原来的接口）   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月24日 下午9:07:05
 */
public class FastLoginInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
		// 是否是自执行请求
		String executeRequest = request.getParameter("executeApplyRequest");
		if (null != executeRequest && executeRequest.equals("1")) {
			return true;
		}
		// 判断是否是登录、登出请求
		Log.info("FastLoginInterceptor");
		String loginreg = ".*loginController/login\\.do.*|.*loginController/loginOut\\.do.*";
		String uri = request.getRequestURI() + "";
		if (!request.getRequestURI().replaceAll("%20", "").matches(loginreg)) {
			// 判断是否是快捷登录
			if (null != request.getAttribute("loginRequest") && request.getAttribute("loginRequest").equals("1")) {
				Subject subject = SecurityUtils.getSubject();
				request.setAttribute("beforLoginURI", uri.replaceAll("/audit", ""));
				try {
					request.getRequestDispatcher("/loginController/login.do").forward(request, response);
				} catch (ServletException | IOException e1) {
					e1.printStackTrace();
				}
				return false;
			}
		}
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object o,
			ModelAndView modelAndView) throws Exception {

	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
	}
}
