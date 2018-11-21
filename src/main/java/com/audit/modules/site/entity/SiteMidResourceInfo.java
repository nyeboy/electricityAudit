package com.audit.modules.site.entity;

/**
 * @author : jiadu
 * @Description : 报站点和合同中间表
 * @date : 2017/4/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SiteMidResourceInfo {
    private String id;
    private Integer type;//1 机房；2 资源点
    private String accountSiteId;//报账点ID
    private String resourceId;//机房或资源点ID
    private String resourceName;
    private Integer sort;

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccountSiteId() {
        return accountSiteId;
    }

    public void setAccountSiteId(String accountSiteId) {
        this.accountSiteId = accountSiteId;
    }
}
