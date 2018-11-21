package com.audit.modules.common.sms.bean;

/**
 * @author : 袁礼斌
 * @Description : 短信接口配置
 * @date : 2017/4/26
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SMSConfig  {
    

    private String userName;
    
    private String password;
    
    private String licence;
    
    private Integer timeout;
    
    private String url;
    
    private String system;

	private String smsActionUrl;
			
	private String smsNameSpace;
	
	private String smsSendMethod;
    		
    /**
     * 
     */
    public SMSConfig() {
        super();
    }

    /**
     * @param userName
     * @param password
     * @param timeout
     * @param url
     */
    public SMSConfig(String userName, String password, Integer timeout, String url,
    		String system,String smsActionUrl,String smsNameSpace,String smsSendMethod) {
        super();
        this.userName = userName;
        this.password = password;
        this.timeout = timeout;
        this.url = url;
        this.system = system;
        this.smsActionUrl = smsActionUrl;
        this.smsSendMethod = smsSendMethod;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public Integer getTimeout() {
        return timeout;
    }

    public void setTimeout(Integer timeout) {
        this.timeout = timeout;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSystem() {
		return system;
	}

	public void setSystem(String system) {
		this.system = system;
	}

	public String getSmsActionUrl() {
		return smsActionUrl;
	}

	public void setSmsActionUrl(String smsActionUrl) {
		this.smsActionUrl = smsActionUrl;
	}

	public String getSmsNameSpace() {
		return smsNameSpace;
	}

	public void setSmsNameSpace(String smsNameSpace) {
		this.smsNameSpace = smsNameSpace;
	}

	public String getSmsSendMethod() {
		return smsSendMethod;
	}

	public void setSmsSendMethod(String smsSendMethod) {
		this.smsSendMethod = smsSendMethod;
	}

	public String getLicence() {
		return licence;
	}

	public void setLicence(String licence) {
		this.licence = licence;
	}

	@Override
	public String toString() {
		return "SMSConfig [userName=" + userName + ", password=" + password + ", licence=" + licence + ", timeout="
				+ timeout + ", url=" + url + ", system=" + system + ", smsActionUrl=" + smsActionUrl + ", smsNameSpace="
				+ smsNameSpace + ", smsSendMethod=" + smsSendMethod + "]";
	}
	
}
