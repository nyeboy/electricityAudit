package com.audit.modules.workflow.service.impl;

import javax.jws.WebParam;
import javax.jws.WebService;

import com.audit.modules.workflow.entity.FinanceExpenseResponse;

/**
 * 报销单-财务系统回调接口
 * Created by yezhang on 3/10/2017.
 */
@WebService
public interface FinanceExpenseCallback {
	
    /**
     * 获取推送消息
     * 
     * @param xmlResult 消息内容
     * @return 推送结果
     */
    FinanceExpenseResponse pushResult(@WebParam(name = "xmlResult") String xmlResult);
}
