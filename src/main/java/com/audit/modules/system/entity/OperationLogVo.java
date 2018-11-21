package com.audit.modules.system.entity;

import java.util.Date;

/**
 * 
 * @Description: 操作日志对象     
 * 
 * @author  liuyan
 * @date 2017年3月10日
 */

public class OperationLogVo {

	//日志id
	private Integer logId;
	//操作用户id
    private String userId;
    //操作用户名
    private String userName;
    //操作用户登录账号
    private String account;
    //操作URI
    private String uri;
    //操作类型(C-新建，U-修改，D-删除)
    private String type;
    //操作参数
    private String parameters;
    //操作时间
    private Date createTime;
    //开始时间 搜索
    private Date startTime;
    //结束时间 搜索
    private Date endTime;
    //用户登录IP
    private String loginIp;
    
	
	public Integer getLogId() {
		return logId;
	}
	
	public void setId(Integer logId) {
		this.logId = logId;
	}
	
	public String getUserId() {
		return userId;
	}
	
	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	public String getUserName() {
		return userName;
	}
	
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public String getAccount() {
		return account;
	}
	
	public void setAccount(String account) {
		this.account = account;
	}
	
	public String getUri() {
		return uri;
	}
	
	public void setUri(String uri) {
		this.uri = uri;
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public String getParameters() {
		return parameters;
	}
	
	public void setParameters(String parameters) {
		this.parameters = parameters;
	}
	
	public Date getCreateTime() {
		return createTime;
	}
	
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	public String getLoginIP() {
		return loginIp;
	}
	
	public void setLoginIP(String loginIp) {
		this.loginIp = loginIp;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

}
