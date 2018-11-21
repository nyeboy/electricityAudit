package com.audit.modules.common.sms.enums;

/**
 * @author : 袁礼斌
 * @Description : 短信接口消息码
 * @date : 2017/4/26
 * Copyright (c) , IsoftStone All Right reserved.
 */
public enum SmsCode {

    SUCCESS("0","发送成功"),    //成功
    ERROR("1","其他系统错误");   //其他系统错误
    
    private String code;
    
    private String display;
    
    private SmsCode(String code, String display) {
        this.code = code;
        this.display = display;
    }
	
	public static SmsCode parse(String code) {
		SmsCode[] datas = SmsCode.values();
		for (SmsCode data : datas) {
			if (data.getCode().equals(code))
				return data;
		}
		return null;
	}

	public static SmsCode valuesOf(String code) {
		SmsCode[] datas = SmsCode.values();
		for (SmsCode data : datas) {
			if (data.getCode().equals(code))
				return data;
		}
		return null;
	}
	
	public String getCode() {
		return code;
	}

	public String getRemark() {
		return display;
	}
}
