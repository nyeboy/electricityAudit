package com.audit.modules.common.sms.bean;

import java.util.Map;

/**
 * @author : 袁礼斌
 * @Description : 短信信息
 * @date : 2017/4/26
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SMSInfo{
	private String content;   //短信正文
	private String recievers;  //收件人帐号
	private String account;//帐号
	private Map<String,Object> params;
	
    /**
     * @param content
     * @param recievers
     */
    public SMSInfo(String content, String recievers,String account) {
        super();
        this.content = content;
        this.recievers = recievers;
        this.account=account;
    }
    /**
     * @return the content
     */
    public String getContent() {
        return content;
    }
    /**
     * @param content the content to set
     */
    public void setContent(String content) {
        this.content = content;
    }
    /**
     * @return the recievers
     */
    public String getRecievers() {
        return recievers;
    }
    /**
     * @param recievers the recievers to set
     */
    public void setRecievers(String recievers) {
        this.recievers = recievers;
    }
    
    /**
     * @return the account
     */
    public String getAccount() {
        return account;
    }
    /**
     * @param account the account to set
     */
    public void setAccount(String account) {
        this.account = account;
    }
    /**
     * @return the params
     */
    public Map<String, Object> getParams() {
        return params;
    }
    /**
     * @param params the params to set
     */
    public void setParams(Map<String, Object> params) {
        this.params = params;
    }
    /* (non-Javadoc)
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((account == null) ? 0 : account.hashCode());
        result = prime * result + ((content == null) ? 0 : content.hashCode());
        result = prime * result + ((params == null) ? 0 : params.hashCode());
        result = prime * result
                + ((recievers == null) ? 0 : recievers.hashCode());
        return result;
    }
    /* (non-Javadoc)
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        SMSInfo other = (SMSInfo) obj;
        if (account == null) {
            if (other.account != null)
                return false;
        }
        else if (!account.equals(other.account))
            return false;
        if (content == null) {
            if (other.content != null)
                return false;
        }
        else if (!content.equals(other.content))
            return false;
        if (params == null) {
            if (other.params != null)
                return false;
        }
        else if (!params.equals(other.params))
            return false;
        if (recievers == null) {
            if (other.recievers != null)
                return false;
        }
        else if (!recievers.equals(other.recievers))
            return false;
        return true;
    }
    
  

}
