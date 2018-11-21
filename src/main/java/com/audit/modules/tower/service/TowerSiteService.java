package com.audit.modules.tower.service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.TowerWatthourMeterVO;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.tower.entity.TowerSiteVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface TowerSiteService {
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 根据铁塔地址编号查询资管站点名称
     */
    ResultVO queryzhLabelByTowerSiteCode(String code);

    List<TowerSiteVO> queryTowerSite(PageUtil<TowerSiteVO> page, TowerSiteVO towerSiteVO, UserVo userInfo);

    List<TowerWatthourMeterVO>  selectWatthour(String zyCode);
    
    ResultVO importExcel(MultipartFile file, UserVo userInfo) throws Exception;
    
    public TowerSiteVO queryzhLabelByTowerSiteId(String id);
}
