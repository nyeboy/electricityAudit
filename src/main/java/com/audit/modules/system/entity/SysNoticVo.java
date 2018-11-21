package com.audit.modules.system.entity;

import java.io.Serializable;
import java.util.Date;

/**   
 * @Description : TODO(系统公告vo)    
 *
 * @author : chentao
 * @date : 2017年4月17日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class SysNoticVo implements Serializable {

	private static final long serialVersionUID = -6596438391044325720L;

	// id
	private String noticId;
	// 用户名
	private String userName;
	// 标题
	private String title;
	// 开始时间
	private Date startDate;
	// 结束时间
	private Date endDate;
	// 公告内容
	private String message;

	// 开始时间
	private String startDateStr;
	// 结束时间
	private String endDateStr;
	// 创建时间
	private Date createDate;
	
	
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public SysNoticVo() {
		super();
	}

	public String getNoticId() {
		return noticId;
	}

	public void setNoticId(String noticId) {
		this.noticId = noticId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getStartDateStr() {
		return startDateStr;
	}

	public void setStartDateStr(String startDateStr) {
		this.startDateStr = startDateStr;
	}

	public String getEndDateStr() {
		return endDateStr;
	}

	public void setEndDateStr(String endDateStr) {
		this.endDateStr = endDateStr;
	}

}
