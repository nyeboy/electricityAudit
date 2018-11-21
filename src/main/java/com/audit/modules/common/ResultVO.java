package com.audit.modules.common;

import java.io.Serializable;

import com.audit.modules.common.dict.DefaultCode;
import com.audit.modules.common.dict.ResultCode;
import com.audit.modules.common.utils.JsonUtil;
import com.fasterxml.jackson.annotation.JsonAutoDetect;

/**
 * @author : jiadu，wangsong
 * @Description : 返回状态等非业务数据
 * @date : 2017/3/8
 * Copyright (c) , ISoftStone All Right reserved.
 */
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY //解析所有字段
        ,getterVisibility = JsonAutoDetect.Visibility.NONE)     //不解析get方法
public class ResultVO implements Serializable {
    /**序列化*/
    private static final long serialVersionUID = 1L;
    /**成功的返回码*/
    protected static final int SUCCESS = DefaultCode.SUCCESS.getCode();
    /**失败的返回码*/
    protected static final int FAILED = DefaultCode.FAILED.getCode();
    /**默认消息*/
    protected static final String DEFAULT_MESSAGE = DefaultCode.SUCCESS.getMessage();

    /**返回码*/
    protected int code;
    /**返回码简单说明*/
    protected String message;
    /**返回具体数据，可以为null*/
    protected Object data;


    /**
     * 默认的成功返回值
     * code = 200
     * message = OK
     * @return
     */
    public static ResultVO success(){
        return success(null);
    }

    /**
     * 成功返回结果
     * code = 200
     * message = OK
     * @param data 前端需要解析的数据，有可能是List，有可能是Map，也可能是具体的JSON对象
     * @return
     */
    public static ResultVO success(Object data){
        return success(DEFAULT_MESSAGE, data);
    }

    /**
     * 成功返回结果
     * code = 200
     * @param message 返回简短消息
     * @param data 前端需要解析的数据，有可能是List，有可能是Map，也可能是具体的JSON对象
     * @return
     */
    public static ResultVO success(String message, Object data){
        return newResult(SUCCESS, message, data);
    }
    
    /**
     * 成功返回结果
     * code = 200
     * @param message 用于成功后 返回简短消息！
     * @param 
     * @return
     */
    public static ResultVO successMsg(String message){
    	return newResult(SUCCESS, message, null);
    }

    /**
     * 失败返回结果，使用默认返回码
     * @param message 失败原因
     * @return
     */
    public static ResultVO failed(String message){
        return failed(FAILED, message);
    }

    /**
     * 失败返回结果
     * @param code 错误码
     * @param message 失败原因
     * @return
     */
    public static ResultVO failed(int code, String message){
        return failed(code, message, null);
    }

    public static ResultVO failed(String message, Object data){
        return failed(FAILED, message, data);
    }

    /**
     * 失败返回结果
     * @param code 错误码
     * @param message 失败原因
     * @param data 额外返回的数据，一般情况下应该是堆栈信息
     * @return
     */
    public static ResultVO failed(int code, String message, Object data){
        return newResult(code, message, data);
    }

    public static ResultVO newResult(ResultCode result){
        return newResult(result.getCode(), result.getMessage(), null);
    }

    public static ResultVO newResult(int code, String message, Object data){
        return new ResultVO(code, message, data);
    }

    /**
     * 为了兼容ReturnValue，可见域设置成保护的
     * @param code
     * @param message
     * @param data
     */
    protected ResultVO(int code, String message, Object data){
        this.code = code;
        this.message = message;
        this.data = data;
    }


    @Override
    public String toString(){
        return JsonUtil.toJson(this);
    }


    /* get方法和set方法都不建议使用，建议直接使用静态方法 -s*/
    public int getCode() {
        return code;
    }

    @Deprecated
    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    @Deprecated
    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
    /* get方法和set方法都不建议使用，建议直接使用静态方法 -e*/

}
