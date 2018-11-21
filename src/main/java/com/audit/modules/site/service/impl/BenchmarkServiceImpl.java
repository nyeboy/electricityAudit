package com.audit.modules.site.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.DateUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.StreamUtil;
import com.audit.modules.electricity.entity.ElectricityBenchmark;
import com.audit.modules.electricity.entity.PowerRatingVO;
import com.audit.modules.electricity.entity.TowerEleBenchmark;
import com.audit.modules.electricity.vo.ElectricityBenchmarkCheckVO;
import com.audit.modules.site.dao.BenchmarkDao;
import com.audit.modules.site.dao.EquRoomDeviceDao;
import com.audit.modules.site.dao.SiteInfoDao;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.site.entity.SitePowerRatingEntity;
import com.audit.modules.site.entity.SmartMeterStandard;
import com.audit.modules.site.entity.SwitchPowerStandard;
import com.audit.modules.site.service.BenchmarkService;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 * 标杆有关的业务处理类
 * @author : 
 * @date : 2017年4月19日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Service
public class BenchmarkServiceImpl implements BenchmarkService{
		
	
	@Autowired
	private BenchmarkDao benchmarkDao;
	@Autowired
	private EquRoomDeviceDao equRoomDeviceDao;
	@Autowired
	private SiteInfoDao siteInfoDao;


	/**
     * @Description: TODO(智能电表标杆信息) 
	 * @throws ParseException 
     */
	@Override
	public void querySmartMeterStandard(PageUtil<SmartMeterStandard> page) throws ParseException {
		
		Calendar calendarEnd = Calendar.getInstance();
		Calendar calendarStart = Calendar.getInstance();
		Map<String, Object> map = (Map<String, Object>)page.getObj();
		
		int day = 1;
		if (map.get("startDate") != null && map.get("endDate") !=null) {
			Date startDate = DateUtil.parseFromPage((String)map.get("startDate"));
			Date endDate = DateUtil.parseFromPage((String)map.get("endDate"));
			calendarEnd.setTime(endDate);
			calendarStart.setTime(startDate);
			//录入-始终天数差
			day = calendarEnd.get(Calendar.DAY_OF_YEAR)-calendarStart.get(Calendar.DAY_OF_YEAR);
			day = (day >= 0)? day:Math.abs(day);
			
		}
		long currentTime = System.currentTimeMillis();
		benchmarkDao.querySmartMeterStandard(page);
		List<SmartMeterStandard> currentStandNum = benchmarkDao.queryCurrentStandard(map);
		Log.info("dao花费时间" + (System.currentTimeMillis()-currentTime));
		List<SmartMeterStandard> list = page.getResults();
		if (list.size()>0  && !list.isEmpty()) {
			for (SmartMeterStandard smartMeter : list) {
				
				Double endNum = smartMeter.getEndNum();
				Double startNum = smartMeter.getStartNum();
				if (endNum != null && startNum != null) {
				//设置标杆值
				smartMeter.setStandardNum((endNum-startNum)/day);
				}else{
				//查询当天标杆值
					if(currentStandNum!=null && !currentStandNum.isEmpty()){
						for(SmartMeterStandard sMeterStandard :currentStandNum){
							if (sMeterStandard.getYesterDayNum()!=null && smartMeter.getResourceName().equals(sMeterStandard.getResourceName())) {
								smartMeter.setStandardNum((smartMeter.getMeterLatestNum()-sMeterStandard.getYesterDayNum()));
							}
						}
					}
				}
				//设置状态
				smartMeter.setUpdateStatus("已更新");
				smartMeter.setUpdateTime(DateUtil.toPageDataSec(new Date()));
			}
		}
	}

	/**
     * 查询开关电源标杆
     * @Description: TODO(查询开关电源标杆)    
     * @return List
     */
	@Override
	public void querySwitchPowerStandard(PageUtil<SwitchPowerStandard> page) {
		
		//获取报账点信息
		benchmarkDao.queryAccountInfo(page);
		List<SwitchPowerStandard> accountInfo = page.getResults();
		if (!accountInfo.isEmpty() && accountInfo.size()>0) {
			for(SwitchPowerStandard power :accountInfo){
				String intId = power.getIntId();
				if (intId != null && intId !="") {
					//通过intId查询开关信息
					SwitchPowerStandard account = benchmarkDao.querySwitchPowerInfo(intId);
					if (account!=null) {
						power.setElecCurrent(account.getElecCurrent()!=null?account.getElecCurrent():0);
						power.setOutputVoltage(account.getOutputVoltage()!=null?account.getOutputVoltage():0); 
						power.setStandardNum(account.getStandardNum()!=null?account.getStandardNum():0);
						power.setUpdateStatus("已更新");
						power.setUpdateTime(DateUtil.toPageData(new Date()));
					}
				}
				power.setUpdateStatus("已更新");
				power.setUpdateTime(DateUtil.toPageDataSec(new Date()));
			}
		}
	}
	
	
	
	 /**
     * 分页查询额定功率标杆
     * @param pageUtil
	 * @return 
     */
	@Override
	public PageUtil<PowerRatingVO> queryBenchmarkOfPowerRating(PageUtil<SiteInfoVO> pageUtil) {
		//查询报账点信息
		List<SiteInfoVO> siteInfos = siteInfoDao.queryListByPage(pageUtil);
		//List<Map<String,Object>> res = new ArrayList<Map<String,Object>>();
		List<PowerRatingVO> powerRatings = new ArrayList<PowerRatingVO>();
		for(SiteInfoVO siteInfo : siteInfos) {
			PowerRatingVO powerRating = new PowerRatingVO();
			powerRating.setSiteId(siteInfo.getId());
			powerRating.setCityName(siteInfo.getArea());
			powerRating.setCountyName(siteInfo.getCounty());
			powerRating.setSiteName(siteInfo.getAccountName());
			powerRating.setTotalPowerRating(0);
			List<EquRoomDevice> equRoomDeviceList = siteInfoDao.getRoomByAccountSiteId(siteInfo.getId());//查询报账点对应机房
			if (null != equRoomDeviceList && equRoomDeviceList.size() > 0) {
				Double num = 0d;
				for (EquRoomDevice equRoomDevice : equRoomDeviceList) {
					if(equRoomDevice != null) {
						num += getPowerRatingByRID(equRoomDevice.getEquipmentRoomId());
					}
				}
				powerRating.setPowerRatingAndElectricity(Math.round(num));
			}
			powerRating.setUpdateTimeStr(DateUtil.toPageDataSec(new Date()));
			powerRating.setUpdateStatus("已更新");
			powerRatings.add(powerRating);
		}
		PageUtil<PowerRatingVO> pageUtil1 = new PageUtil<PowerRatingVO>();
		pageUtil1.setObj(pageUtil.getObj());
		pageUtil1.setPageNo(pageUtil.getPageNo());
		pageUtil1.setPageSize(pageUtil.getPageSize());
		pageUtil1.setResultsSum(pageUtil.getResultsSum());
		pageUtil1.setTotalRecord(pageUtil.getTotalRecord());
		pageUtil1.setResults(powerRatings);
		
		return pageUtil1;

	}
	
	/**
	 * 根据机房id获取机房所有用电设备的功率之和
	 */
	public Double getPowerRatingByRID(String siteID) {
		Double totalPowerRating = 0d;
		Double num1 = siteInfoDao.queryPowerRatingToZTO(siteID);
		Double num2 = siteInfoDao.queryPowerRatingToZTTN(siteID);
		Double num3 = siteInfoDao.queryPowerRatingToZWB(siteID);
		Double num4 = siteInfoDao.queryPowerRatingToZWEN(siteID);
		Double num5 = siteInfoDao.queryPowerRatingToZWLR(siteID);
		Double num6 = siteInfoDao.queryPowerRatingToZWN(siteID);
		if(num1!=null) {
			totalPowerRating+=num1;
		}
		if(num2!=null) {
			totalPowerRating+=num2;
		}
		if(num3!=null) {
			totalPowerRating+=num3;
		}
		if(num4!=null) {
			totalPowerRating+=num4;
		}
		if(num5!=null) {
			totalPowerRating+=num5;
		}
		if(num6!=null) {
			totalPowerRating+=num6;
		}
		return totalPowerRating;
	}

	@Override
	public List<PowerRatingVO> getPowerRating(List<String> siteIds) {
		return getPowerRating(siteIds, 1);
	}

	@Override
	public List<PowerRatingVO> getTowerPowerRating(List<String> siteIds) {
		return getPowerRating(siteIds, 2);
	}
	private List<PowerRatingVO> getPowerRating(List<String> siteIds, int type){
		if (siteIds == null || siteIds.isEmpty()) {
			return new ArrayList<>();
		}
		List<SitePowerRatingEntity> sitePowerRatingEntities;
		//自维
		if(type == 1){
			sitePowerRatingEntities = equRoomDeviceDao.findBySiteIds(siteIds);//根据报账点id获取报账点的功率情况
			
		} else {
			sitePowerRatingEntities = equRoomDeviceDao.findByTowerSiteIds(siteIds);
		}
		if(sitePowerRatingEntities == null || sitePowerRatingEntities.isEmpty()){
			return new ArrayList<>();
		}
		Map<String, List<SitePowerRatingEntity>> sitePowerRatingEntityMap =
				StreamUtil.convertListToMapList(sitePowerRatingEntities, SitePowerRatingEntity::getSiteId);

		List<PowerRatingVO> data = new ArrayList<>();
		for(String siteId : sitePowerRatingEntityMap.keySet()){
			List<SitePowerRatingEntity> list = sitePowerRatingEntityMap.get(siteId);
			PowerRatingVO item = new PowerRatingVO(list);
			data.add(item);
		}

		return data;
	}

	@Override
	public ElectricityBenchmarkCheckVO queryOverBenchmark(String electricityId){
		ElectricityBenchmark electricityBenchmark = benchmarkDao.queryOverBenchmark(electricityId);
		if(electricityBenchmark == null){
			return null;
		} else {
			return new ElectricityBenchmarkCheckVO(electricityId,
					electricityBenchmark.getElectricitySN(),
					electricityBenchmark.getTypeLabel(),
					electricityBenchmark.getOverProportion());
		}
	}
	
	@Override
	public ElectricityBenchmarkCheckVO queryOverBenchmarkTw(String tower_electricityId){
		TowerEleBenchmark towerEleBenchmark = benchmarkDao.queryOverBenchmarkTw(tower_electricityId);
		if(towerEleBenchmark == null){
			return null;
		} else {
			return new ElectricityBenchmarkCheckVO(tower_electricityId,
					towerEleBenchmark.getTower_electricitySN(),
					towerEleBenchmark.getTypeLabel(),
					towerEleBenchmark.getOverProportion());
		}
	}
	
}
