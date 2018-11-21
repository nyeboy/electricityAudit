package com.audit.modules.electricity.entity;

import java.io.Serializable;
import java.util.List;

import com.audit.modules.costcenter.entity.CostCeterVO;
import com.audit.modules.invoice.entity.InvoiceVO;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.google.common.collect.Lists;

/**
 * @author : jiadu
 * @Description : 跳转到电费录入添加页面
 * @date : 2017/3/12
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ElectrictyToAddVO implements Serializable {
    private static final long serialVersionUID = 6778089961609225870L;
    private String serialNumber;//流水号
    private String areas;//地区
    private String counties;//区县
//    private List<SiteInfoVO> siteInfoVOs = Lists.newArrayList();//站点信息VO
    private List<CostCeterVO> costCeterVOs =Lists.newArrayList();//成本中心
    private List<InvoiceVO> invoiceVOs = Lists.newArrayList();//发票
    private AdvancePaymentVo adpv;//预付单

    public AdvancePaymentVo getAdpv() {
		return adpv;
	}

	public void setAdpv(AdvancePaymentVo adpv) {
		this.adpv = adpv;
	}

	public List<InvoiceVO> getInvoiceVOs() {
        return invoiceVOs;
    }

    public void setInvoiceVOs(List<InvoiceVO> invoiceVOs) {
        this.invoiceVOs = invoiceVOs;
    }

    public List<CostCeterVO> getCostCeterVOs() {
        return costCeterVOs;
    }

    public void setCostCeterVOs(List<CostCeterVO> costCeterVOs) {
        this.costCeterVOs = costCeterVOs;
    }

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
