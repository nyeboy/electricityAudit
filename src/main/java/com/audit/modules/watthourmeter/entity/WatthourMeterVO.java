package com.audit.modules.watthourmeter.entity;

import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.StringUtils;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author : jiadu
 * @Description : 电表
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class WatthourMeterVO extends WatthourExtendVO implements Serializable {	
    private static final long serialVersionUID = -1036337329841924808L;
    private String histUnitPrice;//历史平均单价
    private String histDayEleNum;//历史平均日电量
    private String histDayElePrice;//历史平均日电费
    private String id; //电表ID
    private String code;//电表出厂编号或其他能识别该电表的标识符
    private String paymentAccountCode;// 电表缴费户号
    private Integer ptype;//电表类型。1 普通；2 智能
    private Integer status;//状态；1 正常；0 损坏
    private Double rate;//倍率。实际使用的电能缩小该数字的倍数后在电表上反映出来的数字
    private Double maxReading;//电表最大读数，发生翻表情况录入后记录
    private Double currentReading;//当前读数（用电起度）
    private Date reimbursementDate;//电费最后一次报销的归属日期(其实日期)
    private Integer belongAccount;//所属户头（1.移动、2.铁塔）
    private Double damageNum; //损坏读数
    private String damageDate; //损坏日期
    private Double damageInnerNum; //损坏期间电量（度）
    private String damageMeterNum; //坏表电表号
    private String electricLoss;	//电损(度)
    
	private String reimbursementDateStr;
	private String currentReadingStr;

    private String accountSiteId;//报账点ID
    
    private String accountName;//报账点名称
    
    private String oldFinanceName;//财务报账点名称
    
    private String mid;//关键表ID
    
    private int count;
    
    private String cityId;//市ID
    
    private String countyId; //区县ID
    
    private String updateTimeStr; //更新时间
    //是否翻表
    private Integer whetherMeter;
    private String endAmmeter;
    
    private String price;
    private Boolean ishave;
    
    //电表抄表功能添加的变量
    private Date takePhotosTime;//拍照时间	
    private Boolean photosStatus;//状态，用于判断电表是否有拍照时间数据，若无(false)，则让用户选择上次拍照时间，若有(true)，则上次拍照时间为查询出来的拍照时间
    private Boolean maxReadingStatus;//用于判定最大读数是否有值,若用户未选择过最大读数，则让用户选择，若选择了，则带出用户上次选择的最大读数

    
    
	public Boolean getIshave() {
		return ishave;
	}

	public void setIshave(Boolean ishave) {
		this.ishave = ishave;
	}

	public Boolean getMaxReadingStatus() {
		return maxReadingStatus;
	}

	public void setMaxReadingStatus(Boolean maxReadingStatus) {
		this.maxReadingStatus = maxReadingStatus;
	}


	public void setPhotosStatus(Boolean photosStatus) {
		this.photosStatus = photosStatus;
	}

	public Date getTakePhotosTime() {
		return takePhotosTime;
	}

	public void setTakePhotosTime(Date takePhotosTime) {
		this.takePhotosTime = takePhotosTime;
	}

	public Integer getWhetherMeter() {
		return whetherMeter;
	}

	public void setWhetherMeter(Integer whetherMeter) {
		this.whetherMeter = whetherMeter;
	}

	public String getEndAmmeter() {
		return endAmmeter;
	}

	public void setEndAmmeter(String endAmmeter) {
		this.endAmmeter = endAmmeter;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getUpdateTimeStr() {
		return updateTimeStr;
	}

	public void setUpdateTimeStr(String updateTimeStr) {
		this.updateTimeStr = updateTimeStr;
	}

	public String getCurrentReadingStr() {
        return currentReadingStr;
    }

    public void setCurrentReadingStr(String currentReadingStr) {
        this.currentReadingStr = currentReadingStr;
    }

    public String getReimbursementDateStr() {
        return reimbursementDateStr;
    }

    public void setReimbursementDateStr(String reimbursementDateStr) {
        this.reimbursementDateStr = reimbursementDateStr;
    }

    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

    public WatthourMeterVO() {
    }

    public void setData(String code, String paymentAccountCode, String ptype, String status, String rate, String maxReading, String currentReading, String reimbursementDate, String belongAccount) {
        this.code = code;
        this.paymentAccountCode = paymentAccountCode;
        switch (ptype) {
            case "普通":
                this.ptype = 1;
                break;
            case "智能":
                this.ptype = 2;
                break;
        }
        switch (status) {
            case "正常":
                this.status = 1;
                break;
            case "损坏":
                this.status = 0;
                break;
            case "损坏未报修":
                this.status = 3;
                break;
        }
        if (StringUtils.isNotBlank(rate)) {
            this.rate = Double.parseDouble(rate);
        }
        if (StringUtils.isNotBlank(maxReading)) {
            this.maxReading = Double.parseDouble(maxReading);
        }
        if (StringUtils.isNotBlank(currentReading)) {
            this.currentReading = Double.parseDouble(currentReading);
        }
        if (StringUtils.isNotBlank(reimbursementDate)) {
            try {
                this.reimbursementDate = format.parse(reimbursementDate);
            } catch (ParseException e) {
                Log.error(e.getMessage());
                e.printStackTrace();
            }
        }
        switch (belongAccount) {
            case "移动":
                this.belongAccount = 1;
                break;
            case "铁塔":
                this.belongAccount = 2;
                break;
        }
    }

    public void setMaxReading(Double maxReading) {
        this.maxReading = maxReading;
    }

    public void setCurrentReading(Double currentReading) {
        this.currentReading = currentReading;
    }

    public WatthourMeterVO(String id, String code, String paymentAccountCode, String ptype, String status, String rate, String maxReading, String currentReading, String reimbursementDate, String belongAccount) {
        this.id = id;
        this.code = code;
        this.paymentAccountCode = paymentAccountCode;
        switch (ptype) {
            case "普通":
                this.ptype = 1;
                break;
            case "智能":
                this.ptype = 2;
                break;
        }
        switch (status) {
            case "正常":
                this.status = 1;
                break;
            case "损坏":
                this.status = 0;
                break;
        }
        if (StringUtils.isNotBlank(rate)) {
            this.rate = Double.parseDouble(rate);
        }
        if (StringUtils.isNotBlank(maxReading)) {
            this.maxReading = Double.parseDouble(maxReading);
        }
        if (StringUtils.isNotBlank(currentReading)) {
            this.currentReading = Double.parseDouble(currentReading);
        }
        if (StringUtils.isNotBlank(reimbursementDate)) {
            try {
                this.reimbursementDate = format.parse(reimbursementDate);
            } catch (ParseException e) {
                Log.error(e.getMessage());
                e.printStackTrace();
            }
        }
        switch (belongAccount) {
            case "移动":
                this.belongAccount = 1;
                break;
            case "铁塔":
                this.belongAccount = 2;
                break;
        }
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Integer getBelongAccount() {
        return belongAccount;
    }

    public void setBelongAccount(Integer belongAccount) {
        this.belongAccount = belongAccount;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPaymentAccountCode() {
        return paymentAccountCode;
    }

    public void setPaymentAccountCode(String paymentAccountCode) {
        this.paymentAccountCode = paymentAccountCode;
    }

    public Integer getPtype() {
        return ptype;
    }

    public void setPtype(Integer ptype) {
        this.ptype = ptype;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public Double getMaxReading() {
        return maxReading;
    }

    public Double getCurrentReading() {
        return currentReading;
    }

    public Date getReimbursementDate() {
        return reimbursementDate;
    }

    public void setReimbursementDate(Date reimbursementDate) {
        this.reimbursementDate = reimbursementDate;
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

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
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

	public String getMid() {
		return mid;
	}

	public void setMid(String mid) {
		this.mid = mid;
	}

	public Double getDamageNum() {
		return damageNum;
	}

	public void setDamageNum(Double damageNum) {
		this.damageNum = damageNum;
	}

	public String getDamageDate() {
		return damageDate;
	}

	public void setDamageDate(String damageDate) {
		this.damageDate = damageDate;
	}

	public Double getDamageInnerNum() {
		return damageInnerNum;
	}

	public void setDamageInnerNum(Double damageInnerNum) {
		this.damageInnerNum = damageInnerNum;
	}


	public String getDamageMeterNum() {
		return damageMeterNum;
	}

	public void setDamageMeterNum(String damageMeterNum) {
		this.damageMeterNum = damageMeterNum;
	}

	public String getElectricLoss() {
		return electricLoss;
	}

	public void setElectricLoss(String electricLoss) {
		this.electricLoss = electricLoss;
	}

	public String getHistUnitPrice() {
		return histUnitPrice;
	}

	public void setHistUnitPrice(String histUnitPrice) {
		this.histUnitPrice = histUnitPrice;
	}

	public String getHistDayEleNum() {
		return histDayEleNum;
	}

	public void setHistDayEleNum(String histDayEleNum) {
		this.histDayEleNum = histDayEleNum;
	}

	public String getHistDayElePrice() {
		return histDayElePrice;
	}

	public void setHistDayElePrice(String histDayElePrice) {
		this.histDayElePrice = histDayElePrice;
	}
	
	
}
