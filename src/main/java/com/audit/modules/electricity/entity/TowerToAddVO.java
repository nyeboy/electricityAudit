package com.audit.modules.electricity.entity;

import com.audit.modules.costcenter.entity.CostCeterVO;
import com.audit.modules.invoice.entity.InvoiceVO;
import com.google.common.collect.Lists;

import java.io.Serializable;
import java.util.List;

/**
 * @author : jiadu
 * @Description : 跳转到塔维电费录入添加页面
 * @date : 2017/3/12
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerToAddVO implements Serializable {
    private static final long serialVersionUID = 6778089961609225870L;
    private String serialNumber;//流水号
    private String areas;//地区
    private String counties;//区县

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getAreas() {
        return areas;
    }

    public void setAreas(String areas) {
        this.areas = areas;
    }

    public String getCounties() {
        return counties;
    }

    public void setCounties(String counties) {
        this.counties = counties;
    }

//    public List<SiteInfoVO> getSiteInfoVOs() {
//        return siteInfoVOs;
//    }
//
//    public void setSiteInfoVOs(List<SiteInfoVO> siteInfoVOs) {
//        this.siteInfoVOs = siteInfoVOs;
//    }
}
