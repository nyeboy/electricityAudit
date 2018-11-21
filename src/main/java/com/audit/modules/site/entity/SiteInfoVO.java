package com.audit.modules.site.entity;

import java.io.Serializable;

/**
 * @author : jiadu
 * @Description :  站点VO
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SiteInfoVO implements Serializable {
    private static final long serialVersionUID = -4469402872285865010L;
    private String id;//站点ID
    private String accountName;//报账点名称
    private String accountAlias;//报账点别名
    private String productNature;//产权性质（0.自维 1.塔维）
    // 市ID
 	private String cityId;
 	// 区县ID
 	private String countyId;
    private String area;//地市
    private String county;//区县
    private String resourceName;//机房或资源点名称
    private String oldFinanceName;//原财务点名称

//    private Integer cycle;//报销周期(1.月、3.季度、6.半年、12.年)
    private String supplierName;//供应商名称
    private String siteName;//站点名称

    private String electricityType;//用电类型(1.直供电、2.转供电)
    private String supplyCompany;//供电公司/业主  1.供电公司 2. 业主
    private String shareType;//共享方式 （1共享、2.独享。）
    private String payType;//电费缴纳方式(1.代维代缴、2.铁塔代缴、3.自缴)
    private Integer payTypee;//缴费类型
    private String professional;//所属专业
    private String pointStatus;//资源点状态noone
   // private String roomStatus;//机房状态noone
   // private String exitStatus;//退网状态noone '锁定'，退网已报账，锁定状态
   /* public String getExitStatus() {
		return exitStatus;
	}

	public void setExitStatus(String exitStatus) {
		this.exitStatus = exitStatus;
	}

	public String getRoomStatus() {
		return roomStatus;
	}

	public void setRoomStatus(String roomStatus) {
		this.roomStatus = roomStatus;
	}*/

	public String getPointStatus() {
		return pointStatus;
	}

	public void setPointStatus(String pointStatus) {
		this.pointStatus = pointStatus;
	}

    

    public Integer getPayTypee() {
		return payTypee;
	}

	public void setPayTypee(Integer payTypee) {
		this.payTypee = payTypee;
	}

	public String getProfessional() {
		return professional;
	}

	public void setProfessional(String professional) {
		this.professional = professional;
	}

	public SiteInfoVO() {
    }

    public SiteInfoVO(String id,String accountName, String accountAlias, String productNature, String area, String county, String oldFinanceName,String siteName, String electricityType, String supplyCompany, String shareType, String payType) {
        this.id = id;
        this.accountName = accountName;
        this.accountAlias = accountAlias;
        switch (productNature){
            case "自维":this.productNature="0";break;
            case "塔维":this.productNature="1";break;
        }
        this.area = area;
        this.county = county;
        this.oldFinanceName = oldFinanceName;
//        switch (cycle){
//            case "月":this.cycle=1;break;
//            case "季度":this.cycle=3;break;
//            case "半年":this.cycle=6;break;
//            case "年":this.cycle=12;break;
//        }
        this.siteName = siteName;
        switch (electricityType){
            case "直供电":this.electricityType="1";break;
            case "转供电":this.electricityType="2";break;
        }
        switch (supplyCompany){
            case "供电公司":this.supplyCompany="1";break;
            case "业主":this.supplyCompany="2";break;
        }
        switch (shareType){
            case "共享":this.shareType="1";break;
            case "独享":this.shareType="2";break;
        }
        switch (payType){
            case "代维代缴":this.payType="1";break;
            case "铁塔代缴":this.payType="2";break;
            case "自缴":this.payType="3";break;
        }
    }

    public void setData(String accountName, String accountAlias, String productNature, String area, String county, String oldFinanceName,String siteName, String electricityType, String supplyCompany, String shareType, String payType) {
        this.id = id;
        this.accountName = accountName;
        this.accountAlias = accountAlias;
        switch (productNature){
            case "自维":this.productNature="0";break;
            case "塔维":this.productNature="1";break;
        }
        this.area = area;
        this.county = county;
        this.resourceName = resourceName;
        this.oldFinanceName = oldFinanceName;
//        switch (cycle){
//            case "月":this.cycle=1;break;
//            case "季度":this.cycle=3;break;
//            case "半年":this.cycle=6;break;
//            case "年":this.cycle=12;break;
//        }
        this.siteName = siteName;
        switch (electricityType){
            case "直供电":this.electricityType="1";break;
            case "转供电":this.electricityType="2";break;
        }
        switch (supplyCompany){
            case "供电公司":this.supplyCompany="1";break;
            case "业主":this.supplyCompany="2";break;
        }
        switch (shareType){
            case "共享":this.shareType="1";break;
            case "独享":this.shareType="2";break;
        }
        switch (payType){
            case "代维代缴":this.payType="1";break;
            case "铁塔代缴":this.payType="2";break;
            case "自缴":this.payType="3";break;
        }
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getElectricityType() {
        return electricityType;
    }

    public void setElectricityType(String electricityType) {
        this.electricityType = electricityType;
    }

    public String getSupplyCompany() {
        return supplyCompany;
    }

    public void setSupplyCompany(String supplyCompany) {
        this.supplyCompany = supplyCompany;
    }

    public String getShareType() {
        return shareType;
    }

    public void setShareType(String shareType) {
        this.shareType = shareType;
    }

    public String getPayType() {
        return payType;
    }

    public void setPayType(String payType) {
        this.payType = payType;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

//    public Integer getCycle() {
//        return cycle;
//    }
//
//    public void setCycle(Integer cycle) {
//        this.cycle = cycle;
//    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getOldFinanceName() {
        return oldFinanceName;
    }

    public void setOldFinanceName(String oldFinanceName) {
        this.oldFinanceName = oldFinanceName;
    }

    public String getProductNature() {
        String result = productNature;
//        if(productNature != null){
//            if(productNature.equals("0")){
//                result = "自维";
//            } else {
//                result = "塔维";
//            }
//        }
        return result;
    }

    public void setProductNature(String productNature) {
        this.productNature = productNature;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountAlias() {
        return accountAlias;
    }

    public void setAccountAlias(String accountAlias) {
        this.accountAlias = accountAlias;
    }

	public String getCityId() {
		return cityId;
	}

	public String getCountyId() {
		return countyId;
	}

	public void setCityId(String cityId) {
		this.cityId = cityId;
	}

	public void setCountyId(String countyId) {
		this.countyId = countyId;
	}
}
