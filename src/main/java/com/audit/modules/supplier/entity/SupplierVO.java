package com.audit.modules.supplier.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author : jiadu
 * @Description : 供应商VO
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SupplierVO implements Serializable{
    
	private static final long serialVersionUID = -2032201373581100768L;
    
	//id
	private String id;
    //供应商名称
	private String name;
	//供应商id
	private Integer code;
	//供应商区域id
	private Integer regionCode;
	//组织结构id
	private Integer organizationCode;
    //供应商ou名称
    private String ouName;
    //供应商编码
    private Integer vendorCode;
    //供应商类型
    private String vendorType;
    //供应商地址
    private String address;
    //个人供应商名称
    private String employeeName;
    //电话
    private String phone;
    //银行名称
    private String bankBranchName;
    //开户名
    private String bankName;
    //开户账号
    private String bankNum;
    //最后更新时间
    private Date lastUpdate;
    //是否有效
    private Integer enableFlag;
    //供应商失效日期
    private String vendorEndDateActive;
    //地点时失日期
    private String sitInactiveDate;
    //银行失效日期
    private String bankInactiveDate;
    //区域编码(部门ID)
    private String areaCode;
    //纳税类型
    private String vendorTaxType;
    //供应商集采类型
    private String attribute;
    //部门id(多个部门)
    private List<String> areaCodes;

    public List<String> getAreaCodes() {
		return areaCodes;
	}

	public void setAreaCodes(List<String> areaCodes) {
		this.areaCodes = areaCodes;
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

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public Integer getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(Integer regionCode) {
        this.regionCode = regionCode;
    }

    public Integer getOrganizationCode() {
        return organizationCode;
    }

    public void setOrganizationCode(Integer organizationCode) {
        this.organizationCode = organizationCode;
    }

	public String getOuName() {
		return ouName;
	}

	public void setOuName(String ouName) {
		this.ouName = ouName;
	}

	public Integer getVendorCode() {
		return vendorCode;
	}

	public void setVendorCode(Integer vendorCode) {
		this.vendorCode = vendorCode;
	}

	public String getVendorType() {
		return vendorType;
	}

	public void setVendorType(String vendorType) {
		this.vendorType = vendorType;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getBankBranchName() {
		return bankBranchName;
	}

	public void setBankBranchName(String bankBranchName) {
		this.bankBranchName = bankBranchName;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getBankNum() {
		return bankNum;
	}

	public void setBankNum(String bankNum) {
		this.bankNum = bankNum;
	}

	public Date getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	public Integer getEnableFlag() {
		return enableFlag;
	}

	public void setEnableFlag(Integer enableFlag) {
		this.enableFlag = enableFlag;
	}

	public String getVendorEndDateActive() {
		return vendorEndDateActive;
	}

	public void setVendorEndDateActive(String vendorEndDateActive) {
		this.vendorEndDateActive = vendorEndDateActive;
	}

	public String getSitInactiveDate() {
		return sitInactiveDate;
	}

	public void setSitInactiveDate(String sitInactiveDate) {
		this.sitInactiveDate = sitInactiveDate;
	}

	public String getBankInactiveDate() {
		return bankInactiveDate;
	}

	public void setBankInactiveDate(String bankInactiveDate) {
		this.bankInactiveDate = bankInactiveDate;
	}

	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	public String getVendorTaxType() {
		return vendorTaxType;
	}

	public void setVendorTaxType(String vendorTaxType) {
		this.vendorTaxType = vendorTaxType;
	}

	public String getAttribute() {
		return attribute;
	}

	public void setAttribute(String attribute) {
		this.attribute = attribute;
	}
    
}
