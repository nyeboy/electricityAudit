package com.audit.modules.data.entity;

import javax.xml.bind.annotation.XmlElement;

/**
 * @author : 袁礼斌
 * @Description : OA人员职务数据
 * @date : 2017/4/19
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class EmpDutyPo {

	private String rowNo;
	
	private String id;
	
	private String name;

	@XmlElement(name = "Id")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@XmlElement(name = "Name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRowNo() {
		return rowNo;
	}

	public void setRowNo(String rowNo) {
		this.rowNo = rowNo;
	}

	@Override
	public String toString() {
		return "EmpDutyPo [rowNo=" + rowNo + ", id=" + id + ", name=" + name + "]";
	}
	
}
