package com.audit.modules.watthourmeter.entity;

import java.io.File;
import java.io.Serializable;
import java.util.Date;

/**
 * @author : jiadu
 * @Description : 电表扩展vo
 * @date : 2017/3/15
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class WatthourExtendVO implements Serializable{

    private static final long serialVersionUID = 5610230302536789197L;
    private String exTendId;//扩展电表ID
    private String watthourId ;//电表ID
    private Integer whetherMeter;//是否翻表
    private String maxReadings;//电表最大读数，发生翻表情况录入后记录 
    private String electricLoss;//电损（度）
    private Date belongStartTime;//电费归属起始日期
    private Date belongEndTime;//电费归属终止日期
    private String belongEndTimeS;
    private Integer dayAmmeter;//用电天数
    private String startAmmeter;//用电起度（度）
    private String endAmmeter;//用电止度（度）
    private String totalEleciric;//总电量
    private String unitPrice;//单价(不含税）
    private String totalAmount;//电表总金额
    private String remarks;//备注
    private Integer photosStatus;
    
    private Date reimbursementDate;//电费最后一次报销的归属日期(其实日期)
    private Integer status;
   
    //电表抄表功能添加的变量
    private String exceptionsExplain;//异常原因说明(报销时间与拍照时间相同)
    private String accessories;//附件(拍照图片)用于保存图片在服务器中的路径
    private Date lastTakePhotosTime;//上次拍照时间
    private String takePhotosPeopleInfo;//拍照人员姓名
    private String electricMeterDeg; //电表度数
    private Date theTakePhotosTime;//本次拍照时间
    private String exceptions1Explain;//异常原因说明(拍照电表读数小于报销电表当前读数) 
    
    //合同变更新增的变量
    private String backcalculationPrice;//反算单价
    private String exceptions2Explain;//异常原因说明(报账点单电表日均电费超1千元)
    private String exceptions3Explain;//异常原因说明(报账点单电表日均电量超1千度)
    private String exceptions4Explain;//异常原因说明(电损占比=稽核单电损电量/稽核单总电量>80%)
    private String isContinue;//报账点电表单价高于2.5元/度继续提交
    private Date takePhotosTime;
    
    private String accountid; //报账点id
    
    

	public String getAccountid() {
		return accountid;
	}

	public void setAccountid(String accountid) {
		this.accountid = accountid;
	}

	public Integer getPhotosStatus() {
		return photosStatus;
	}

	public void setPhotosStatus(Integer photosStatus) {
		this.photosStatus = photosStatus;
	}

	public Date getTakePhotosTime() {
		return takePhotosTime;
	}

	public void setTakePhotosTime(Date takePhotosTime) {
		this.takePhotosTime = takePhotosTime;
	}


	public String getIsContinue() {
		return isContinue;
	}

	public void setIsContinue(String isContinue) {
		this.isContinue = isContinue;
	}

	public String getExceptions2Explain() {
		return exceptions2Explain;
	}

	public void setExceptions2Explain(String exceptions2Explain) {
		this.exceptions2Explain = exceptions2Explain;
	}

	public String getExceptions3Explain() {
		return exceptions3Explain;
	}

	public void setExceptions3Explain(String exceptions3Explain) {
		this.exceptions3Explain = exceptions3Explain;
	}

	public String getExceptions4Explain() {
		return exceptions4Explain;
	}

	public void setExceptions4Explain(String exceptions4Explain) {
		this.exceptions4Explain = exceptions4Explain;
	}

	public String getBackcalculationPrice() {
		return backcalculationPrice;
	}

	public void setBackcalculationPrice(String backcalculationPrice) {
		this.backcalculationPrice = backcalculationPrice;
	}

	public String getExceptions1Explain() {
		return exceptions1Explain;
	}

	public void setExceptions1Explain(String exceptions1Explain) {
		this.exceptions1Explain = exceptions1Explain;
	}

	public Date getLastTakePhotosTime() {
		return lastTakePhotosTime;
	}

	public void setLastTakePhotosTime(Date lastTakePhotosTime) {
		this.lastTakePhotosTime = lastTakePhotosTime;
	}

	public Date getTheTakePhotosTime() {
		return theTakePhotosTime;
	}

	public void setTheTakePhotosTime(Date theTakePhotosTime) {
		this.theTakePhotosTime = theTakePhotosTime;
	}

	public String getExceptionsExplain() {
		return exceptionsExplain;
	}

	public void setExceptionsExplain(String exceptionsExplain) {
		this.exceptionsExplain = exceptionsExplain;
	}

	public String getAccessories() {
		return accessories;
	}

	public void setAccessories(String accessories) {
		this.accessories = accessories;
	}

	public String getTakePhotosPeopleInfo() {
		return takePhotosPeopleInfo;
	}

	public void setTakePhotosPeopleInfo(String takePhotosPeopleInfo) {
		this.takePhotosPeopleInfo = takePhotosPeopleInfo;
	}

	public String getElectricMeterDeg() {
		return electricMeterDeg;
	}

	public void setElectricMeterDeg(String electricMeterDeg) {
		this.electricMeterDeg = electricMeterDeg;
	}

	public String getMaxReadings() {
		return maxReadings;
	}

	public void setMaxReadings(String maxReadings) {
		this.maxReadings = maxReadings;
	}
    
    public String getBelongEndTimeS() {
		return belongEndTimeS;
	}

	public void setBelongEndTimeS(String belongEndTimeS) {
		this.belongEndTimeS = belongEndTimeS;
	}

	public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Date getReimbursementDate() {
        return reimbursementDate;
    }

    public void setReimbursementDate(Date reimbursementDate) {
        this.reimbursementDate = reimbursementDate;
    }

    public Date getBelongStartTime() {
        return belongStartTime;
    }

    public void setBelongStartTime(Date belongStartTime) {
        this.belongStartTime = belongStartTime;
    }

    public Date getBelongEndTime() {
        return belongEndTime;
    }

    public void setBelongEndTime(Date belongEndTime) {
        this.belongEndTime = belongEndTime;
    }

    public String getStartAmmeter() {
        return startAmmeter;
    }

    public void setStartAmmeter(String startAmmeter) {
        this.startAmmeter = startAmmeter;
    }

    public String getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(String totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getExTendId() {
        return exTendId;
    }

    public void setExTendId(String exTendId) {
        this.exTendId = exTendId;
    }

    public String getWatthourId() {
        return watthourId;
    }

    public void setWatthourId(String watthourId) {
        this.watthourId = watthourId;
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

    public String getElectricLoss() {
		return electricLoss;
    }

    public void setElectricLoss(String electricLoss) {
        this.electricLoss = electricLoss;
    }

    public String getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(String unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getTotalEleciric() {
        return totalEleciric;
    }

    public void setTotalEleciric(String totalEleciric) {
        this.totalEleciric = totalEleciric;
    }

    public Integer getDayAmmeter() {
        return dayAmmeter;
    }

    public void setDayAmmeter(Integer dayAmmeter) {
        this.dayAmmeter = dayAmmeter;
    }
}
