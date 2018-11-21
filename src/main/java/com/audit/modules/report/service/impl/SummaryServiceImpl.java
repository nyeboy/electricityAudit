package com.audit.modules.report.service.impl;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.AccountSiteManageDao;
import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.StreamUtil;
import com.audit.modules.report.dao.BeyondSwiRateDao;
import com.audit.modules.report.dao.ElectricPowerDao;
import com.audit.modules.report.entity.AuditPowerRatingReportDTO;
import com.audit.modules.report.entity.AuditSmartMeterDTO;
import com.audit.modules.report.entity.ElectricChargeDTO;
import com.audit.modules.report.entity.ElectricPowerDTO;
import com.audit.modules.report.entity.FinancialSystem;
import com.audit.modules.report.entity.ProvinceSum;
import com.audit.modules.report.service.AuditReportService;
import com.audit.modules.report.service.ElectricChargeService;
import com.audit.modules.report.service.ElectricPowerService;
import com.audit.modules.report.service.NormService;
import com.audit.modules.report.service.SummaryService;

/**
 * @Description
 * 汇总统计，有两点需要注意
 * 1 返回值应该使用DTO
 * 2 在使用真实数据以后，应当关注其性能问题
 *
 * @author 王松
 * @date 2017/3/9
 *
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@Service
public class SummaryServiceImpl implements SummaryService {

    @Autowired
    private ElectricChargeService electricChargeService;
    @Autowired
    private ElectricPowerService electricPowerService;
    @Autowired
    private AuditReportService auditReportService;
    @Autowired
    private NormService normService;
    @Autowired
    private ElectricPowerDao electricPowerDao;
    @Autowired
    private BeyondSwiRateDao beyondSwiRateDao;
    @Autowired
    private AccountSiteManageDao accountSiteManageDao;
    
    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" }) 
    public List<Map<String, Object>> detail(String typeCode, String year ,String month,Integer auditType) {
        int maxLength = 0;
        List<String> cityName = new ArrayList<>();
        //单载波电费，原谅我的拼音，实在是太专业了
        Map<String, ElectricChargeDTO> dzbMap = new HashMap<>();
        //
        List<ElectricChargeDTO> dzbList = electricChargeService.getSCECStasticByCityId(typeCode,year);
        
        if(dzbList != null){
            if(maxLength < dzbList.size()){
                maxLength = dzbList.size();
                cityName = StreamUtil.getProps(dzbList, ElectricChargeDTO::getCityName);
            }
            dzbMap = StreamUtil.convertListToMap(dzbList, ElectricChargeDTO::getCityName);
        }
        //电费占收比，占支比
        Map<String, ElectricChargeDTO> zsbMap = new HashMap<>();
        List<ElectricChargeDTO> zsbList = electricChargeService.getScaleECStasticByCityId(typeCode, year);
        if(zsbList != null){
            if(maxLength < zsbList.size()){
                maxLength = zsbList.size();
                cityName = StreamUtil.getProps(zsbList, ElectricChargeDTO::getCityName);
            }
            zsbMap = StreamUtil.convertListToMap(zsbList, ElectricChargeDTO::getCityName);
        }
        //转供电比
        Map<String, ElectricPowerDTO> zgdMap = new HashMap<>();
        List<ElectricPowerDTO> zgdList = electricPowerService.getStationDetailEPStasticByCityId(typeCode, year, month, auditType);
        if(zgdList != null){
            if(maxLength < zgdList.size()){
                maxLength = zgdList.size();
                cityName = StreamUtil.getProps(zgdList, ElectricPowerDTO::getCityName);
            }
            zgdMap = StreamUtil.convertListToMap(zgdList, ElectricPowerDTO::getCityName);
        }
        //超额定功率标杆比
        List<AuditPowerRatingReportDTO> beyondPowerRatingList = auditReportService.SuperPowerRatingCount(typeCode, year);
        Map<String, AuditPowerRatingReportDTO> beyondPowerRatingMap = new HashMap<>();
        if(beyondPowerRatingList != null){
            if(maxLength < beyondPowerRatingList.size()){
                maxLength = beyondPowerRatingList.size();
                cityName = StreamUtil.getProps(beyondPowerRatingList, AuditPowerRatingReportDTO::getCityName);
            }
            beyondPowerRatingMap = StreamUtil.convertListToMap(beyondPowerRatingList, AuditPowerRatingReportDTO::getCityName);
        }
        //开关电源可用率，智能电表可用率
        List<AuditSmartMeterDTO> list = auditReportService.SuperSmartMeter(typeCode, year);
        Map<String, AuditSmartMeterDTO> map = new HashMap<>();
        if(list != null){
            if(maxLength < list.size()){
                maxLength = list.size();
                cityName = StreamUtil.getProps(list, AuditSmartMeterDTO::getCityName);
            }
            map = StreamUtil.convertListToMap(list, AuditSmartMeterDTO::getCityName);
        }
        //资财一致性
        List<FinancialSystem> financialSystemsList = (List)normService.financialSystemConsistencyService(typeCode, year);
        Map<String, FinancialSystem> financialSystemMap = new HashMap<>();
        if(financialSystemsList != null){
            if(maxLength < financialSystemsList.size()){
                maxLength = financialSystemsList.size();
                cityName = StreamUtil.getProps(financialSystemsList, FinancialSystem::getCity);
            }
            //city有重复？？？
            financialSystemsList = StreamUtil.distinct(financialSystemsList, FinancialSystem::getCity);
            financialSystemMap = StreamUtil.convertListToMap(financialSystemsList, FinancialSystem::getCity);
        }

        if(cityName == null || cityName.isEmpty()){
            return new ArrayList<>();
        }
        //综合城市排名
        List<String> cityRankList = normService.findRankByTypeAndYear(typeCode, year);        
        double defaultDoubleValue = 0D;
        List<Map<String, Object>> result = new ArrayList<>(maxLength);
        int i=1;
        for(String city : cityName){
        	
            Map<String, Object> data = new LinkedHashMap<>();
            if(null != cityRankList && cityRankList.size() > 0) {
            	for(int ind = 0 ; ind  < cityRankList.size(); ind ++){
            		String cityNam  = cityRankList.get(ind);
            		if(cityNam.equals(city)){
            			data.put("comprehensiveRank", ind+1);
            			break;
            		}
            	}
            }
            
            data.put("cityName", city);
            //单载波电费
            ElectricChargeDTO dzb = dzbMap.get(city);
            if(dzb != null){
                data.put("SCEC", dzb.getCityDataValue("SCEC"));
            } else {
                data.put("SCEC", defaultDoubleValue);
            }
            //电费占收比，占支比
            ElectricChargeDTO zsb = zsbMap.get(city);
            if(zsb != null){
                data.put("income", zsb.getCityDataValue("income"));
                data.put("expenditure", zsb.getCityDataValue("expenditure"));
            } else {
                data.put("income", defaultDoubleValue);
                data.put("expenditure", defaultDoubleValue);
            }
            //转供电比
            ElectricPowerDTO zgd = zgdMap.get(city);
            if(zgd != null){
                data.put("RotaryScale", zgd.getCityData().getOrDefault("RotaryScale", defaultDoubleValue));
            } else {
                data.put("RotaryScale", defaultDoubleValue);
            }
            //超额定功率标杆比
            AuditPowerRatingReportDTO beyondPowerRating = beyondPowerRatingMap.get(city);
            if(beyondPowerRating != null){
                data.put("proportion", beyondPowerRating.getProportion());
            } else {
                data.put("proportion", defaultDoubleValue);
            }
            //开关电源可用率，智能电表可用率
            AuditSmartMeterDTO asm = map.get(city);
            if(asm != null){
                data.put("proportion1", asm.getProportion1());
                data.put("proportion2", asm.getProportion2());
            } else {
                data.put("proportion1", defaultDoubleValue);
                data.put("proportion2", defaultDoubleValue);
            }
            //资财一致性
            FinancialSystem financialSystem = financialSystemMap.get(city);
            if(financialSystem != null){
                data.put("successRate", financialSystem.getSuccessRate());
            } else {
                data.put("successRate", defaultDoubleValue);
            }
            //信息反馈时效
            data.put("feedback", 90d);

            result.add(data);
            Log.info("统计报表——" + city + "市/自治州 综合信息统计结束");
        }

        return result;
    }

    @Override
    public List<Map<String, Object>> simple() {
        return null;
    }

	/**   
	 * @Description: 省首页信息汇总  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public ProvinceSum proviceSummary(String year ,String month) {
		ProvinceSum provinceSum = new ProvinceSum();
		DecimalFormat formatter = new DecimalFormat("#.##");
		Double directRate = 0.0;
		Double rotaryRate = 0.0;
		Double directPower = electricPowerDao.stasticDirectRotarySum(year, month, "1");
		Double rotaryPower = electricPowerDao.stasticDirectRotarySum(year, month, "2");
		Double siteNumber = beyondSwiRateDao.findSiteNum(year);
		Double selfNum = accountSiteManageDao.querySelfSiteNum();
		
		if(null != directPower && null != rotaryPower && (directPower + rotaryPower) != 0){
			directRate = directPower/(directPower + rotaryPower);
			rotaryRate = rotaryPower/(directPower + rotaryPower);
		}else if(null == directPower && null == rotaryPower){
			directPower = 0.0;
			rotaryPower = 0.0;
		}else if(null == directPower && null != rotaryPower){
			directPower = 0.0;
			directRate = 0.0;
			rotaryRate = 1.0;
		}else if(null != directPower && null == rotaryPower){
			rotaryPower = 0.0;
			directRate = 1.0;
			rotaryRate = 0.0;
		}else{
			directRate = 0.0;
			rotaryRate = 1.0;
		}
		provinceSum.setDirectPower(checkStyle(directPower));
		provinceSum.setRotaryPower(checkStyle(rotaryPower));
		provinceSum.setRotaryScale(formatter.format(rotaryRate*100) + "%");
		provinceSum.setDirectScale(formatter.format(directRate*100) + "%");
		provinceSum.setSiteNum(String.valueOf(siteNumber).replaceAll("\\.[0-9]+", ""));
		provinceSum.setSelfNum(String.valueOf(selfNum).replaceAll("\\.[0-9]+", ""));
		return provinceSum;
	}

	/**   
	 * @Description: 设置显示格式  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private String checkStyle(Double doub) {
		NumberFormat nf = NumberFormat.getInstance();
		nf.setMaximumFractionDigits(2);
		BigDecimal bg = null;
		String temp = null;
		if(doub >= 0 && doub < 10000){
			temp = nf.format(doub);
			temp += "度";
		}else if(doub >= 10000 && doub < 10000*1000){
			temp = nf.format(doub/10000);
			temp += "万度";
		}else if(doub >= 10000*1000){
			bg = new BigDecimal(Double.toString(doub));
			if(doub < 10000*10000){
			   bg = bg.divide(new BigDecimal("10000"));
			   temp = nf.format(bg).toString() + "万度";
			}else if(doub >= 10000*10000 && doub < 10000*10000){
				 bg = bg.divide(new BigDecimal("100000000"));
				 temp = nf.format(bg).toString() + "亿度";
			}else if(doub >= 10000*10000*10000L){
				bg = bg.divide(new BigDecimal("1000000000000"));
				temp = nf.format(bg).toString() + "万亿度";
			}
		}
		return temp;
	}
}
