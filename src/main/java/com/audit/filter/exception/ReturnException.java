package com.audit.filter.exception;


import com.audit.modules.common.dict.ResultCode;

/**
 * Created on 16-6-30.
 *
 * @author 王松
 */
public class ReturnException extends AbstractRuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 4805188353924325090L;

	public ReturnException(ResultCode resultCode) {
        super(resultCode);
    }

}
