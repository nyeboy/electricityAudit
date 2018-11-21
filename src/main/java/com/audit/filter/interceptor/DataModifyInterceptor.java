package com.audit.filter.interceptor;

import java.io.Console;

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
 * @Description: 基础数据维护拦截器 （走审批流程）   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月24日 下午9:07:05
 */

public class DataModifyInterceptor implements HandlerInterceptor {

//	@Autowired
//	private DataModifyApplyService dataModifyApplyService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o)
			throws Exception {
		
		Log.info("DataModifyInterceptor");
		//判断是否是自执行操作
		String executeRequest  = request.getParameter("executeApplyRequest");
		if(null != executeRequest && executeRequest.equals("1")) {
			return true;
		}
		//判断是否是快捷登录操作 
		if (null != request.getAttribute("loginRequest") && request.getAttribute("loginRequest").equals("1")) {
			return true;
		}

		String url = request.getRequestURL() + "";
		System.out.println("进入这里了吗？============"+url);
		StringBuffer regBuffer = new StringBuffer(1400);
		regBuffer.append("(.*supplierManage/deleteSupplyById.*)|(.*supplierManage/updateSupply.*)");
		regBuffer.append("|(.*supplierManage/insertSupply.*)|(.*watthourMeter/saveOrUpdate.*)");
		regBuffer.append("|(.*watthourMeter/delete.*)|(.*invoice/saveOrUpdate.*)");
		regBuffer.append("|(.*invoice/delete.*)|(.*powerRateManage/updatePowerRate.*)|(.*accountSitePSU/updateAccountSitePSUById.*)");
		regBuffer.append("|(.*accountSiteManage/updateAccountSiteManageById.*)|(.*accountSiteManage/deleteAccountSiteManageByIds.*)");
		regBuffer.append("|(.*accountSiteManage/createAccountSite.*)|(.*accountSiteOther/updateAccountSiteOtherById.*)");
		regBuffer.append("|(.*ownerController/saveOwner.*)|(.*ownerController/updateOwner.*)|(.*ownerController/deleteOwner.*)|(.*ownerController/bathDeleteOwner.*)");
		regBuffer.append("|(.*meterController /updateMeter.*)|(.*meterController/saveMeter.*)|(.*meterController/deleteMeter.*)");
//		regBuffer.append("|(.*accountSiteTrans/saveTransEleAdd.*)");//添加自维转供电
//		regBuffer.append("|(.*towerTrans/saveTransEleAdd.*)");//添加塔维转供电
		regBuffer.append("|(.*accountSiteTrans/submitToFlow.*)");//添加自维转供电
		regBuffer.append("|(.*towerTrans/submitToFlow.*)");//添加塔维转供电
		
		
		//自维转供电管理
		StringBuffer transRegBuffer = new StringBuffer(1400);
		transRegBuffer.append("|(.*accountSiteTrans/submitToFlow.*)");//添加自维转供电拦截
		String transReg = new String(transRegBuffer);
		//塔维转供电管理
		StringBuffer towerRegBuffer = new StringBuffer(1400);
		towerRegBuffer.append("|(.*towerTrans/submitToFlow.*)");//添加塔维转供电拦截
		String towerReg = new String(towerRegBuffer);
		
		
		String reg = new String(regBuffer);
		//判断是否是基础数据维护操作，如果不是就跳过
		if (!url.replaceAll("%20", "").matches(reg)) {
			return true;
		}
		System.out.println("url的值是---------------------------"+url);
		System.out.println("正则替换的是--------------------------"+url.replaceAll("%20", ""));
		System.out.println("ture或者false-------------------------"+url.replaceAll("%20", "").matches(reg));
		System.out.println("reg是-----------------------------------"+reg);
		// 判断是否登陆
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		UserVo userVo = (UserVo) session.getAttribute("user");
		if (null == userVo) {
			return true;
		} else {
			//进入到流程中去
			session.setAttribute("originalUrl", url);
			//分两步，一是基础数据，一是转供电数据
			if (url.replaceAll("%20", "").matches(transReg)) {
				//进入转供电审批
				request.getRequestDispatcher("/dataModifyApply/transEleApply.do").forward(request, response);
				
			}else if(url.replaceAll("%20", "").matches(towerReg)){
				//进入转供电审批
				request.getRequestDispatcher("/dataModifyApply/transEleApply.do").forward(request, response);

			}else {
				//进入到基础数据审批
				request.getRequestDispatcher("/dataModifyApply/handleApply.do").forward(request, response);  //服务器端跳转，从filter到控制器
			}
		}
		return false;
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
