package com.audit.modules.common.sms;

import com.audit.modules.common.sms.bean.SMSInfo;
import com.audit.modules.common.sms.enums.SmsCode;

/**
 * @author : 袁礼斌
 * @Description : 短信返回回调
 * @date : 2017/4/26
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface ISmsSendCallBack {
    /**
     * 发送成功
     * @param smsInfo 短信信息对象
     * @param responseCode 消息返回码
     */
    public void afterSend(SMSInfo smsInfo,SmsCode responseCode);
}
