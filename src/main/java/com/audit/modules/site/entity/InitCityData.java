package com.audit.modules.site.entity;

import com.google.common.collect.Maps;

import java.util.Map;

/**
 * Description :
 * author : jiadu
 * date : 2017/6/1
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class InitCityData {
    private Map<String, String> cityMap = Maps.newHashMap();//key  cityName+"_"+countyName ,value cityID+"_"+countyID

    public Map<String, String> getCityMap() {
        return cityMap;
    }

    public void setCityMap(Map<String, String> cityMap) {
        this.cityMap = cityMap;
    }
}
