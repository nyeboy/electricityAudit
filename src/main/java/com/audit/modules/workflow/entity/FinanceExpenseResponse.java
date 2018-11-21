package com.audit.modules.workflow.entity;

/**
 * Created by yezhang on 3/15/2017.
 */
public class FinanceExpenseResponse {

    private String status;

    private String callbackResponse;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCallbackResponse() {
        return callbackResponse;
    }

    public void setCallbackResponse(String callbackResponse) {
        this.callbackResponse = callbackResponse;
    }
}
