package com.audit.modules.site.dao;

import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.site.entity.SitePowerRatingEntity;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author 王松
 * @Description
 * @date 2017/3/15
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface EquRoomDeviceDao {
    List<EquRoomDevice> queryBySiteId(String id);

    List<EquRoomDevice> queryBySiteIds(List<String> ids);

    List<EquRoomDevice> findAllByCountyID(String countyID);

    List<SitePowerRatingEntity> findBySiteIds(List<String> siteIds);

    /**
     * 根据塔维报账点ID列表获取塔维报账点与额定功率的数据
     * @param siteIds
     * @return
     */
    List<SitePowerRatingEntity> findByTowerSiteIds(List<String> siteIds);
    
    //根据设备商家和是设备号，获取设备功率
    PowerRateManage getPowerRating(PowerRateManage powerRatingManage);
}
