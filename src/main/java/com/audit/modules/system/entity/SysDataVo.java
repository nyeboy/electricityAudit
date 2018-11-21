package com.audit.modules.system.entity;

import java.io.Serializable;

/**
 * @Description:系统数据controller
 * @author 礼斌
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SysDataVo implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7390993428108848600L;

	//系统数据key
	private String key;
	
	//系统数据value
	private Object value;
		
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}
	
}
