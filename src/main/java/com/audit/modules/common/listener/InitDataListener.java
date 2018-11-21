package com.audit.modules.common.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.ContextLoaderListener;

import com.audit.modules.common.sms.SmsUtil;
import com.audit.modules.common.sms.bean.SMSConfig;
import com.audit.modules.common.utils.ConfigUtil;

/**
 * @author : 袁礼斌
 * @Description : 系统数据初始化监听
 * @date : 2017/4/26
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class InitDataListener extends ContextLoaderListener {

    private static Log log = LogFactory.getLog(InitDataListener.class);
    
    /**
     * <默认构造函数>
     */
    public InitDataListener() 
    {
        super();
    }

    /**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent event){
    	//短信服务配置
        SMSConfig smsConfig = new SMSConfig();
        smsConfig.setUserName(ConfigUtil.getInstance().get("sms_account"));
        smsConfig.setPassword(ConfigUtil.getInstance().get("sms_pwd"));
        smsConfig.setUrl(ConfigUtil.getInstance().get("sms_url"));
        smsConfig.setTimeout(Integer.valueOf(ConfigUtil.getInstance().get("sms_timeout")));
        smsConfig.setSystem(ConfigUtil.getInstance().get("system_info"));
        smsConfig.setLicence(ConfigUtil.getInstance().get("licence"));
        smsConfig.setSmsActionUrl(ConfigUtil.getInstance().get("smsActionUrl"));
        smsConfig.setSmsNameSpace(ConfigUtil.getInstance().get("smsNameSpace"));
        smsConfig.setSmsSendMethod(ConfigUtil.getInstance().get("smsSendMethod"));
        
        //启动短信发送服务
        SmsUtil.instance().start(smsConfig);
        log.info(smsConfig);
        log.info("系统短信发送服务启动完成！");
    }
}
