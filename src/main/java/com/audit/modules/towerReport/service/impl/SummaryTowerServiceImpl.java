package com.audit.modules.towerReport.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.StreamUtil;
import com.audit.modules.towerReport.entity.AuditPowerRatingReportTower;
import com.audit.modules.towerReport.entity.AuditSmartMeterTower;
import com.audit.modules.towerReport.entity.ElectricChargeTower;
import com.audit.modules.towerReport.entity.ElectricPowerTower;
import com.audit.modules.towerReport.entity.FinancialSystemTower;
import com.audit.modules.towerReport.service.AuditReportTowerService;
import com.audit.modules.towerReport.service.ElectricChargeTowerService;
import com.audit.modules.towerReport.service.ElectricPowerTowerService;
import com.audit.modules.towerReport.service.NormTowerService;
import com.audit.modules.towerReport.service.SummaryTowerService;

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
public class SummaryTowerServiceImpl implements SummaryTowerService {

    @Autowired
    private ElectricChargeTowerService electricChargeTowerService;
    @Autowired
    private ElectricPowerTowerService electricPowerTowerService;
    @Autowired
    private AuditReportTowerService auditReportTowerService;
    @Autowired
    private NormTowerService normTowerService;

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" }) 
    public List<Map<String, Object>> detail(String typeCode, String year ,String month) {
        int maxLength = 0;
        List<String> cityName = new ArrayList<>();
        //单载波电费，原谅我的拼音，实在是太专业了
        Map<String, ElectricChargeTower> dzbMap = new HashMap<>();
        //
        List<ElectricChargeTower> dzbList = electricChargeTowerService.getSCECStasticByCityId(typeCode,year);
        
        if(dzbList != null){
            if(maxLength < dzbList.size()){
                maxLength = dzbList.size();
                cityName = StreamUtil.getProps(dzbList, ElectricChargeTower::getCityName);
            }
            dzbMap = StreamUtil.convertListToMap(dzbList, ElectricChargeTower::getCityName);
        }
        //电费占收比，占支比
        Map<String, ElectricChargeTower> zsbMap = new HashMap<>();
        List<ElectricChargeTower> zsbList = electricChargeTowerService.getScaleECStasticByCityId(typeCode, year);
        if(zsbList != null){
            if(maxLength < zsbList.size()){
                maxLength = zsbList.size();
                cityName = StreamUtil.getProps(zsbList, ElectricChargeTower::getCityName);
            }
            zsbMap = StreamUtil.convertListToMap(zsbList, ElectricChargeTower::getCityName);
        }
        //转供电比
        Map<String, ElectricPowerTower> zgdMap = new HashMap<>();
        List<ElectricPowerTower> zgdList = electricPowerTowerService.getStationDetailEPStasticByCityId(typeCode, year, month);
        if(zgdList != null){
            if(maxLength < zgdList.size()){
                maxLength = zgdList.size();
                cityName = StreamUtil.getProps(zgdList, ElectricPowerTower::getCityName);
            }
            zgdMap = StreamUtil.convertListToMap(zgdList, ElectricPowerTower::getCityName);
        }
        //超额定功率标杆比
        List<AuditPowerRatingReportTower> beyondPowerRatingList = auditReportTowerService.SuperPowerRatingCount(typeCode, year);
        Map<String, AuditPowerRatingReportTower> beyondPowerRatingMap = new HashMap<>();
        if(beyondPowerRatingList != null){
            if(maxLength < beyondPowerRatingList.size()){
                maxLength = beyondPowerRatingList.size();
                cityName = StreamUtil.getProps(beyondPowerRatingList, AuditPowerRatingReportTower::getCityName);
            }
            beyondPowerRatingMap = StreamUtil.convertListToMap(beyondPowerRatingList, AuditPowerRatingReportTower::getCityName);
        }
        //开关电源可用率，智能电表可用率
        List<AuditSmartMeterTower> list = auditReportTowerService.SuperSmartMeter(typeCode, year);
        Map<String, AuditSmartMeterTower> map = new HashMap<>();
        if(list != null){
            if(maxLength < list.size()){
                maxLength = list.size();
                cityName = StreamUtil.getProps(list, AuditSmartMeterTower::getCityName);
            }
            map = StreamUtil.convertListToMap(list, AuditSmartMeterTower::getCityName);
        }
        //资财一致性
        List<FinancialSystemTower> financialSystemsList = (List)normTowerService.financialSystemConsistencyTowerService(typeCode, year);
        Map<String, FinancialSystemTower> financialSystemMap = new HashMap<>();
        if(financialSystemsList != null){
            if(maxLength < financialSystemsList.size()){
                maxLength = financialSystemsList.size();
                cityName = StreamUtil.getProps(financialSystemsList, FinancialSystemTower::getCity);
            }
            //city有重复？？？
            financialSystemsList = StreamUtil.distinct(financialSystemsList, FinancialSystemTower::getCity);
            financialSystemMap = StreamUtil.convertListToMap(financialSystemsList, FinancialSystemTower::getCity);
        }

        if(cityName == null || cityName.isEmpty()){
            return new ArrayList<>();
        }

        double defaultDoubleValue = -1D;
        List<Map<String, Object>> result = new ArrayList<>(maxLength);
        int i=1;
        for(String city : cityName){
        	
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("comprehensiveRank",i++ );
            data.put("cityName", city);
            //单载波电费
            ElectricChargeTower dzb = dzbMap.get(city);
            if(dzb != null){
                data.put("SCEC", dzb.getCityDataValue("SCEC"));
            } else {
                data.put("SCEC", defaultDoubleValue);
            }
            //电费占收比，占支比
            ElectricChargeTower zsb = zsbMap.get(city);
            if(zsb != null){
                data.put("income", zsb.getCityDataValue("income"));
                data.put("expenditure", zsb.getCityDataValue("expenditure"));
            } else {
                data.put("income", defaultDoubleValue);
                data.put("expenditure", defaultDoubleValue);
            }
            //转供电比
            ElectricPowerTower zgd = zgdMap.get(city);
            if(zgd != null){
                data.put("RotaryScale", zgd.getCityData().getOrDefault("RotaryScale", defaultDoubleValue));
            } else {
                data.put("RotaryScale", defaultDoubleValue);
            }
            //超额定功率标杆比
            AuditPowerRatingReportTower beyondPowerRating = beyondPowerRatingMap.get(city);
            if(beyondPowerRating != null){
                data.put("proportion", beyondPowerRating.getProportion());
            } else {
                data.put("proportion", defaultDoubleValue);
            }
            //开关电源可用率，智能电表可用率
            AuditSmartMeterTower asm = map.get(city);
            if(asm != null){
                data.put("proportion1", asm.getProportion1());
                data.put("proportion2", asm.getProportion2());
            } else {
                data.put("proportion1", defaultDoubleValue);
                data.put("proportion2", defaultDoubleValue);
            }
            //资财一致性
            FinancialSystemTower financialSystem = financialSystemMap.get(city);
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
}
