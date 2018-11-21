package com.audit.filter.interceptor;

import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.system.entity.OperationLogVo;
import com.audit.modules.system.service.OperationLogService;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * @Description: 记录操作日志     
 * 
 * @author  liuyan
 * @date 2017年3月10日 
 */
public class OperationLogInterceptor implements HandlerInterceptor {

    @Autowired
    private OperationLogService operationLogService;

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object o, ModelAndView modelAndView) throws Exception {
    	if(request.isRequestedSessionIdValid()){
    		//是否是自执行请求
    		Log.info("OperationLogInterceptor");
    		HttpSession session = request.getSession();
            String uri = request.getRequestURI();
            //判断是否快捷登录
			if (null != request.getAttribute("loginRequest") && request.getAttribute("loginRequest").equals("1")) {
				return;
			}
            Map<String, String[]> parameters = request.getParameterMap();
            Object userInfoStr = session.getAttribute("userInfo");
            if(userInfoStr == null){
                Log.info(String.format("敏感操作中未记录到用户信息 \nuri = %s \nparameters = %s", uri, parameters.toString()));
                System.out.println("敏感操作中未记录到用户信息 ");
            } else {
                UserInfo userInfo = JsonUtil.valueOf(userInfoStr.toString(), UserInfo.class);

                String type = "C";
                if(uri.contains("update")){
                    type = "U";
                } else if (uri.contains("delete")){
                    type = "D";
                } else if (uri.contains("start")){
                    type = "S";
                } else if (uri.contains("audit")){
                    type = "A";
                }
                OperationLogVo entity = new OperationLogVo();
                entity.setUserId(userInfo.userId);
                entity.setAccount(userInfo.account);
                entity.setUserName(userInfo.userName);
                entity.setType(type);
                entity.setUri(uri);
                entity.setParameters(parameters == null ? "null" : JsonUtil.toJson(parameters));
                entity.setCreateTime(new Date());
                entity.setLoginIP(userInfo.loginIp);

                operationLogService.create(entity);
            }
    	}
    }

    private static class UserInfo {
		@JsonProperty("userId")
        private String userId;
        @JsonProperty("account")
        private String account;
        @JsonProperty("userName")
        private String userName;
        @JsonProperty("loginIp")
        public String loginIp;
    }

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
	}
}
