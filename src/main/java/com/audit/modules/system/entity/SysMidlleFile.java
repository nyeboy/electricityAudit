package com.audit.modules.system.entity;

import java.io.Serializable;

/**
 * @author : jiadu
 * @Description : 附件中间表
 * @date : 2017/3/12
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SysMidlleFile implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = 8149980232815862922L;
	private String id;
    private String businessId;//关联表ID
    private String sysFileId;//附件表ID

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBusinessId() {
        return businessId;
    }

    public void setBusinessId(String businessId) {
        this.businessId = businessId;
    }

    public String getSysFileId() {
        return sysFileId;
    }

    public void setSysFileId(String sysFileId) {
        this.sysFileId = sysFileId;
    }
}
