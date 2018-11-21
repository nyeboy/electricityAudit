package com.audit.modules.contract.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : jiadu
 * @Description : 合同VO
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ContractVO implements Serializable {

    private static final long serialVersionUID = 6171339883888912838L;
    private String id;//合同ID
    private String name;//合同名称
    private Date startDate;//合同生效日期
    private Date endDate;//合同终止日期
    private String isClud;//是否包干（0.包干 1.不包干）
    private String cludPrice;//包干价
    private String paymentCycle;//续费周期；1 月；3 季度；6 半年；12 年；
    private String paymentAccountCode;//电表户号
    private String unitPrice;// 单价（不含税)
    private int count;
    
    private String accountName;//报账点名称
    
    private String oldFinanceName;//财务报账点名称
    
    private String cityId;//市ID
    
    private String countyId; //区县ID
    
    private String startDateStr;//合同生效日期
    private String endDateStr;//合同终止日期
    //合同表改变后
    private String contractNumber;//合同编号 
    private String contractName;//合同名称
    private String priceOrLumpSumPrice;//单价或包干价
    private String isUploadOverproof;//分级审批记录
    private String companyName;//分公司名称
    private String contractStatus;//合同状态
    private String siteName;//站点名称
    
    public String getContractName() {
		return contractName;
	}
	public void setContractName(String contractName) {
		this.contractName = contractName;
	}
	public String getContractNumber() {
		return contractNumber;
	}
	public void setContractNumber(String contractNumber) {
		this.contractNumber = contractNumber;
	}
	public String getPriceOrLumpSumPrice() {
		return priceOrLumpSumPrice;
	}
	public void setPriceOrLumpSumPrice(String priceOrLumpSumPrice) {
		this.priceOrLumpSumPrice = priceOrLumpSumPrice;
	}
	public String getIsUploadOverproof() {
		return isUploadOverproof;
	}
	public void setIsUploadOverproof(String isUploadOverproof) {
		this.isUploadOverproof = isUploadOverproof;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getContractStatus() {
		return contractStatus;
	}
	public void setContractStatus(String contractStatus) {
		this.contractStatus = contractStatus;
	}
	public String getSiteName() {
		return siteName;
	}
	public void setSiteName(String siteName) {
		this.siteName = siteName;
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

	public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getCludPrice() {
        return cludPrice;
    }

    public void setCludPrice(String cludPrice) {
        this.cludPrice = cludPrice;
    }

    public String getPaymentCycle() {
        return paymentCycle;
    }

    public void setPaymentCycle(String paymentCycle) {
        this.paymentCycle = paymentCycle;
    }

    public String getPaymentAccountCode() {
        return paymentAccountCode;
    }

    public void setPaymentAccountCode(String paymentAccountCode) {
        this.paymentAccountCode = paymentAccountCode;
    }

    public String getIsClud() {
        return isClud;
    }

    public void setIsClud(String isClud) {
        this.isClud = isClud;
    }

    public String getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(String unitPrice) {
        this.unitPrice = unitPrice;
    }

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public String getOldFinanceName() {
		return oldFinanceName;
	}

	public void setOldFinanceName(String oldFinanceName) {
		this.oldFinanceName = oldFinanceName;
	}

	public String getCityId() {
		return cityId;
	}

	public void setCityId(String cityId) {
		this.cityId = cityId;
	}

	public String getCountyId() {
		return countyId;
	}

	public void setCountyId(String countyId) {
		this.countyId = countyId;
	}
    
}
