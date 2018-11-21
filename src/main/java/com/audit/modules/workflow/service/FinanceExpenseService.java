package com.audit.modules.workflow.service;

/**
 * 报销单-财务系统回调接口
 * 
 * @author luoyun
 */
public interface FinanceExpenseService {
	
	/**
	 * 处理回调
	 * 
	 * @param xmlResult 结果XML
	 */
	void pushResult(String xmlResult);
}
