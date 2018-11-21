package com.audit.modules.common.dict;

import com.audit.modules.common.utils.JsonUtil;

/**
 * @author 王松
 * @Description
 * 登录返回码，起止编码1101-1199，注意不要重复
 * @date 2017/3/13
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public enum LoginCode implements ResultCode {
    PASSWORD_ERROR(1101, "用户名密码错误")
    ,NOT_EXIST(1102, "用户不存在");

    private int code;
    private String message;

    LoginCode(int code, String message) {
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

    @Override
    public String toString(){
        return JsonUtil.toJson(this);
    }

}
