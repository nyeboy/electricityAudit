package com.audit.modules.site.entity;

/**
 * @author jiadu
 * @description
 * 资源点
 * @date 2017/4/14
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class ResourcePointInfo {
    private String id;
    private String zhLabel;//名称

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getZhLabel() {
        return zhLabel;
    }

    public void setZhLabel(String zhLabel) {
        this.zhLabel = zhLabel;
    }
}
