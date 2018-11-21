package com.audit.modules.electricity.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.audit.modules.site.entity.SitePowerRatingEntity;
import com.fasterxml.jackson.annotation.JsonAutoDetect;

/**
 * @author 王松
 * @Description
 * @date 2017/3/15
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY //解析所有字段
        ,getterVisibility = JsonAutoDetect.Visibility.NONE)     //不解析get方法
public class PowerRatingVO {
    /**市*/
    private String cityName;
    /**区县*/
    private String countyName;
    /**报账点ID*/
    private String siteId;
    /**报账点名字*/
    private String siteName;
    /**总功率*/
    private long totalPowerRating;
    /**总电量。实际上是一天的最大用电量*/
    private double totalElectricity;
    /**更新状态*/
    private String updateStatus;
    /**更新时间*/
    private Date updateTime;
    /**更新时间 字符串*/
    private String updateTimeStr;

	public PowerRatingVO(List<SitePowerRatingEntity> sitePowerRatingEntities){
    	if(sitePowerRatingEntities == null || sitePowerRatingEntities.isEmpty()){
    		return;
		}
		SitePowerRatingEntity sitePowerRatingEntity = sitePowerRatingEntities.get(0);
    	this.cityName = sitePowerRatingEntity.getCityName();
    	this.countyName = sitePowerRatingEntity.getCountyName();
    	this.siteId = sitePowerRatingEntity.getSiteId();
    	this.siteName = sitePowerRatingEntity.getAccountName();
    	this.updateStatus = "已更新";
        this.updateTime = new Date();
        this.totalPowerRating = sitePowerRatingEntities.stream()
				.filter(spr -> spr.getPowerRating() != null && spr.getPowerRating() != 0)
				.mapToLong(SitePowerRatingEntity::getPowerRating)
				.sum();
		setTotalElectricityByPowerRating(this.totalPowerRating);
	}

	public PowerRatingVO(){}


	public String getCityName() {
		return cityName;
	}


	public String getCountyName() {
		return countyName;
	}


	public String getSiteId() {
		return siteId;
	}


	public String getSiteName() {
		return siteName;
	}


	public double getTotalElectricity() {
		return totalElectricity;
	}


	public String getUpdateStatus() {
		return updateStatus;
	}


	public Date getUpdateTime() {
		return updateTime;
	}


	public void setCityName(String cityName) {
		this.cityName = cityName;
	}


	public void setCountyName(String countyName) {
		this.countyName = countyName;
	}


	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}


	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}


	public void setTotalPowerRating(long totalPowerRating) {
		this.totalPowerRating = totalPowerRating;
	}


	public void setUpdateStatus(String updateStatus) {
		this.updateStatus = updateStatus;
	}


	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public void setPowerRatingAndElectricity(long powerRating){
        this.totalPowerRating = powerRating;
		setTotalElectricityByPowerRating(powerRating);
    }

    public long getTotalPowerRating() {
        return totalPowerRating;
    }
    
    public void setStatus(long powerRating){
        this.totalPowerRating = powerRating;
        setTotalElectricityByPowerRating(powerRating);
    }

	public String getUpdateTimeStr() {
		return updateTimeStr;
	}

	public void setUpdateTimeStr(String updateTimeStr) {
		this.updateTimeStr = updateTimeStr;
	}

	/**
	 * 计算超标杆比例
	 * @param totalElectricityOfUser 用户的总电量
	 * @param dateRange 天数
	 * @return 超标杆百分比。如果未超标，则为0
	 */
	public double getOverPowerRatingProportion(double totalElectricityOfUser, int dateRange){
		double benchmarkElectricity = getBenchmarkElectricity(dateRange);
    	if(totalElectricityOfUser <= benchmarkElectricity){
    		return 0;
		}
		//如果额定功率为0，则认为超标，并且将超标杆比例设置为9999
		if(benchmarkElectricity == 0d){
    		return 9999;
		}

		BigDecimal tmp = new BigDecimal((totalElectricityOfUser - benchmarkElectricity) / benchmarkElectricity * 100);
		tmp = tmp.setScale(2, BigDecimal.ROUND_HALF_UP);
		return tmp.doubleValue();
	}

	/**
	 * 获取标杆电量
	 * @param dateRange 用电天数
	 * @return
	 */
	public double getBenchmarkElectricity(int dateRange){
		return this.totalElectricity * dateRange;
	}


	private void setTotalElectricityByPowerRating(long powerRating){
		this.totalElectricity = (double) (powerRating * 24) / 1000;
	}
    
}
