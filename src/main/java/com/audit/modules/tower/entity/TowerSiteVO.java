package com.audit.modules.tower.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerSiteVO implements Serializable {

    private static final long serialVersionUID = 8457089104246335767L;
    private String isSfSite;//三方铁塔和铁塔公司，1 铁塔公司 2 三方铁塔
    private String id;
    private String zhLabel;//资管站点名称
    private String zyCode;//铁塔地址编号
    private String zyName;//铁塔站址名称
    private Integer isClud;//是否包干；1 包干；0 非包干
    private String ywCode;//资管站点编号

    private String cityId;//市
    private String countyId;//区县
    private String electricityType;//用电类型(1.直供电、2.转供电)
    private String shareType;//共享方式(（1共享、2.独享。）)
    private Integer cycle;//报销周期。(1.月、3.季度、6.半年、12.年)
    private String zzType;//站址类型: 1铁塔新建、2.电信存量、3.联通存量、4.移动存量
    private String proportion;//分摊比例
    private Date createTime;//创建时间
    private String createPerson;//创建人
    private String cityName;
    private String countyName;
    

    public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public String getCountyName() {
		return countyName;
	}

	public void setCountyName(String countyName) {
		this.countyName = countyName;
	}

	public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getCreatePerson() {
        return createPerson;
    }

    public void setCreatePerson(String createPerson) {
        this.createPerson = createPerson;
    }

    public String getProportion() {
        return proportion;
    }

    public void setProportion(String proportion) {
        this.proportion = proportion;
    }

    public String getElectricityType() {
        return electricityType;
    }

    public void setElectricityType(String electricityType) {
        switch (electricityType) {
            case "直供电":
                this.electricityType = "1";
                break;
            case "转供电":
                this.electricityType = "2";
                break;
            default:
                this.electricityType = electricityType;
        }
    }

    public String getShareType() {
        return shareType;
    }

    public void setShareType(String shareType) {
        switch (shareType) {
            case "共享":
                this.shareType = "1";
                break;
            case "独享":
                this.shareType = "2";
                break;
            default:
                this.shareType = shareType;
        }
    }

    public Integer getCycle() {
        return cycle;
    }

    public void setCycle(Integer cycle) {
        this.cycle = cycle;
    }

    public String getZzType() {
        return zzType;
    }

    // 1铁塔新建、2.电信存量、3.联通存量、4.移动存量
    public void setZzType(String zzType) {
        switch (zzType) {
            case "铁塔新建":
                this.zzType = "1";
                break;
            case "电信存量":
                this.zzType = "2";
                break;
            case "联通存量":
                this.zzType = "3";
                break;
            case "移动存量":
                this.zzType = "4";
                break;
            default:
                this.zzType = zzType;
        }
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
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

    public String getYwCode() {
        return ywCode;
    }

    public void setYwCode(String ywCode) {
        this.ywCode = ywCode;
    }

    public Integer getIsClud() {
        return isClud;
    }

    public void setIsClud(Integer isClud) {
        this.isClud = isClud;
    }

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

    public String getZyCode() {
        return zyCode;
    }

    public void setZyCode(String zyCode) {
        this.zyCode = zyCode;
    }

    public String getZyName() {
        return zyName;
    }

    public void setZyName(String zyName) {
        this.zyName = zyName;
    }

	public String getIsSfSite() {
		return isSfSite;
	}

	public void setIsSfSite(String isSfSite) {
		this.isSfSite = isSfSite;
	}
}
