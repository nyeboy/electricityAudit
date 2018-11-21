package com.audit.modules.site.entity;

import java.util.List;
import java.util.Map;

import com.audit.modules.tower.entity.TowerSiteVO;
import com.audit.modules.towerbasedata.contract.entity.TowerContractVO;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**
 * @author : jiadu
 * @Description : 导入excel初始化数据
 * @date : 2017/4/11
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class InitTowerData extends InitCityData{
    private Map<String, TowerSiteVO> siteInfoVOMap = Maps.newHashMap();//报账点
    private Map<String, TowerContractVO> contractVOMap = Maps.newHashMap();//合同信息
    private List<String> zyCode = Lists.newArrayList();//资管站点的CODE
    private List<String> zgName = Lists.newArrayList();//资管站点名称

    public Map<String, TowerSiteVO> getSiteInfoVOMap() {
        return siteInfoVOMap;
    }

    public void setSiteInfoVOMap(Map<String, TowerSiteVO> siteInfoVOMap) {
        this.siteInfoVOMap = siteInfoVOMap;
    }

    public Map<String, TowerContractVO> getContractVOMap() {
        return contractVOMap;
    }

    public void setContractVOMap(Map<String, TowerContractVO> contractVOMap) {
        this.contractVOMap = contractVOMap;
    }

    public List<String> getZyCode() {
        return zyCode;
    }

    public void setZyCode(List<String> zyCode) {
        this.zyCode = zyCode;
    }

	public List<String> getZgName() {
		return zgName;
	}

	public void setZgName(List<String> zgName) {
		this.zgName = zgName;
	}
}
