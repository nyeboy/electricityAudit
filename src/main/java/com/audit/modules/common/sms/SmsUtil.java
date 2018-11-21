package com.audit.modules.common.sms;

import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.audit.modules.common.sms.bean.SMSConfig;
import com.audit.modules.common.sms.bean.SMSInfo;

/**
 * @author : 袁礼斌
 * @Description : 短信服务工具类
 * @date : 2017/4/26
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SmsUtil {
    
    private static Log log = LogFactory.getLog(SmsUtil.class);
    
    //短信发送任务队列
    private BlockingQueue<SMSInfo> queue = new LinkedBlockingQueue<SMSInfo>();
    
    private static SmsUtil util;
    
    private SMSQueueRunner sendRunner;
    
    private SmsUtil() { }
    
    /**
     * 获取单例
     * @return
     */
    public static SmsUtil instance() {
        if (null == util) {
            util = new SmsUtil();
        }
        return util;
    }
    
    /**
     * 发送短信,添加到短信发送任务到队列
     * @param content   短信内容
     * @param recievers 短信接收人(多个接收人用逗号分隔)
     * @param account   发短信人账号
     */
    public void sendSMS(String content, String recievers,String account) {
        SMSInfo smsInfo = new SMSInfo(content,recievers,account);
        if (validate(smsInfo)) {
            try {
                queue.put(smsInfo);
            }
            catch (InterruptedException e) {
                if (log.isErrorEnabled()) {
                    log.error("短信发送队列监听线程意外中止!");
                }
            }
        }
    }
    
    /**
     * 发送短信,添加到短信发送任务到队列
     * @param content   短信内容
     * @param recievers 短信接收人(多个接收人用逗号分隔)
     * @param account   发短信人账号
     * @param params    回调参数
     */
    public void sendSMS(String content, String recievers,String account,Map<String,Object> params) {
        SMSInfo smsInfo = new SMSInfo(content,recievers,account);
        if (validate(smsInfo)) {
            try {
                smsInfo.setParams(params);
                queue.put(smsInfo);
            }
            catch (InterruptedException e) {
                if (log.isErrorEnabled()) {
                    log.error("短信发送队列监听线程意外中止!");
                }
            }
        }
    }
    
    /**
     * 启动短信发送队列
     * @param config    短信接口配置
     */
    public void start(SMSConfig config) {
        if (null != sendRunner) {
            sendRunner.stop();
            sendRunner = null;
        }
        if (null != config) {
            sendRunner = new SMSQueueRunner(config, queue);
            new Thread(sendRunner).start();
            if (log.isDebugEnabled()) {
                log.debug("成功开启短信发送队列！");
            }
        }
    }
    
    /**
     * 验证短信内容是否完整(检查短信正文、短信接收人)
     * @param smsInfo 短信内容
     * @return
     */
    private boolean validate(SMSInfo smsInfo) {
    	boolean isValidate = false;
        if (null != smsInfo) {
        	//TODO 验证短信内容格式
        	isValidate = true;
        }
        return isValidate;
    }
    
}
