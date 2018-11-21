package com.audit.filter.exception;

import com.audit.modules.common.dict.DefaultCode;
import com.audit.modules.common.dict.ResultCode;

/**
 * Created on 16-7-18.
 *
 * @author 王松
 */
public abstract class AbstractRuntimeException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = -8779591869150860085L;
	protected int code = DefaultCode.FAILED.getCode();
    protected String message;

    public AbstractRuntimeException(String msg){
        this.message = msg;
    }

    public AbstractRuntimeException(Exception ex){
        super(ex);
        this.message = ex.getMessage();
    }

    public AbstractRuntimeException(int code, String message){
        super(message);
        this.code = code;
        this.message = message;
    }

    public AbstractRuntimeException(ResultCode resultCode){
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
    }

    public AbstractRuntimeException(int code, String message, Exception ex){
        super(message, ex);
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return this.code;
    }

    public String getMessage() {
        return this.message;
    }

}
