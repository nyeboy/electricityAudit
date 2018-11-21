package com.audit.modules.site.entity;

import com.audit.modules.contract.entity.ContractVO;
import com.audit.modules.supplier.entity.SupplierVO;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import java.util.Map;
import java.util.Set;

/**
 * @author : jiadu
 * @Description : 导入excel初始化数据
 * @date : 2017/4/11
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class InitData extends InitCityData{
    private Map<String, SiteInfoVO> siteInfoVOMap = Maps.newHashMap();//报账点
    private Map<String, WatthourMeterVO> watthourMeterVOMap = Maps.newHashMap();//电表
    private Map<String, SupplierVO> supplierVOMap = Maps.newHashMap();//供应商
    private Map<String, ContractVO> contractVOMap = Maps.newHashMap();//合同信息
    private Map<String, String> equRoomOrResourcePointMap = Maps.newHashMap();//资源点机房信息
    private Map<String, SiteMidWattInfo> siteMidWattInfoMap = Maps.newHashMap();//报账点和电表中间表
    private Set<String> resourceIDs = Sets.newHashSet();//系统中间表中已存在的资源或报账点ID

    public Set<String> getResourceIDs() {
        return resourceIDs;
    }

    public void setResourceIDs(Set<String> resourceIDs) {
        this.resourceIDs = resourceIDs;
    }

    public Map<String, SiteMidWattInfo> getSiteMidWattInfoMap() {
        return siteMidWattInfoMap;
    }

    public void setSiteMidWattInfoMap(Map<String, SiteMidWattInfo> siteMidWattInfoMap) {
        this.siteMidWattInfoMap = siteMidWattInfoMap;
    }

    public Map<String, String> getEquRoomOrResourcePointMap() {
        return equRoomOrResourcePointMap;
    }

    public void setEquRoomOrResourcePointMap(Map<String, String> equRoomOrResourcePointMap) {
        this.equRoomOrResourcePointMap = equRoomOrResourcePointMap;
    }

    public Map<String, ContractVO> getContractVOMap() {
        return contractVOMap;
    }

    public void setContractVOMap(Map<String, ContractVO> contractVOMap) {
        this.contractVOMap = contractVOMap;
    }

    public Map<String, SupplierVO> getSupplierVOMap() {
        return supplierVOMap;
    }

    public void setSupplierVOMap(Map<String, SupplierVO> supplierVOMap) {
        this.supplierVOMap = supplierVOMap;
    }


    public Map<String, SiteInfoVO> getSiteInfoVOMap() {
        return siteInfoVOMap;
    }

    public void setSiteInfoVOMap(Map<String, SiteInfoVO> siteInfoVOMap) {
        this.siteInfoVOMap = siteInfoVOMap;
    }

    public Map<String, WatthourMeterVO> getWatthourMeterVOMap() {
        return watthourMeterVOMap;
    }

    public void setWatthourMeterVOMap(Map<String, WatthourMeterVO> watthourMeterVOMap) {
        this.watthourMeterVOMap = watthourMeterVOMap;
    }
}
