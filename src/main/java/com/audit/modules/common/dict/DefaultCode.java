package com.audit.modules.common.dict;

import com.audit.modules.common.utils.JsonUtil;

/**
 * @author 王松
 * @Description
 * 系统返回码，起止编号100-999，注意不要重复
 * @date 2017/3/13
 *
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public enum DefaultCode implements ResultCode {

    SUCCESS(200, "OK")
    ,FAILED(100, "")
    ,PARAMETER_ERROR(300, "参数错误");

    private int code;
    private String message;

    DefaultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public DefaultCode setMessage(String message){
        this.message = message;
        return this;
    }

    @Override
    public String toString(){
        return JsonUtil.toJson(this);
    }
}
