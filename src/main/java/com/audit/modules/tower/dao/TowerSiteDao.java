package com.audit.modules.tower.dao;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.SysTowerSiteMidContract;
import com.audit.modules.electricity.entity.TowerWatthourMeterVO;
import com.audit.modules.tower.entity.TowerSiteVO;
import com.audit.modules.towerbasedata.contract.entity.TowerContractVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface TowerSiteDao {
    List<TowerSiteVO> queryzhLabelByTowerSiteCode(@Param("code") String code);

    List<TowerSiteVO> queryTowerSite(PageUtil<TowerSiteVO> page);

    List<String>  selectWatthourCode(String zyCode);
    
    TowerWatthourMeterVO  selectWatthour(String watthourMeterCode);
    
    /**
     * @param exportZyCode 
     * @param :
     * @return :
     * @throws
     * @Description: 查询资管站点中的铁塔站址编码
     */
    List<String> queryZyCode(@Param("list")List<String> exportZyCode);
    
    /**
     * @param exportZyCode 
     * @param :
     * @return :
     * @throws
     * @Description: 查询资管站点中的资管名称
     */
    List<String> queryZgName(@Param("list")List<String> exportZgName);

    void batchSaveTowerSiteInfo(List<TowerSiteVO> towerSiteVOs);

    void batchSaveContractInfo(List<TowerContractVO> towerContractVOs);

    void batchSaveTowerMidContractInfo(List<SysTowerSiteMidContract> sysTowerSiteMidContracts);
    public TowerSiteVO queryzhLabelByTowerSiteId(String id);
}
