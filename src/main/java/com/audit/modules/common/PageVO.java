package com.audit.modules.common;

import java.io.Serializable;

/**
 * @author : jiadu
 * @Description : 分页用VO
 * @date : 2017/3/8
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class PageVO implements Serializable{
    private static final long serialVersionUID = 7309942342765257163L;
    private Long totalData;//总条数
    private Integer pageNo;//当前页
    private Integer pageSize;//每页显示条数
    private Object data;//数据

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Long getTotalData() {
        return totalData;
    }

    public void setTotalData(Long totalData) {
        this.totalData = totalData;
    }

    public Integer getPageNo() {
        return pageNo;
    }

    public void setPageNo(Integer pageNo) {
        this.pageNo = pageNo;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
