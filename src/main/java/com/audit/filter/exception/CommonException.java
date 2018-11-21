package com.audit.filter.exception;

/**
 * <p>
 * Created by TangJianjun
 * <p>
 * Date: 2015/04/08
 * <p>
 * Time: 16:52
 */
public class CommonException extends AbstractRuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = -5591707892449863268L;

	public CommonException(String msg) {
        super(msg);
    }

    public CommonException(Exception ex) {
        super(ex);
    }
}
