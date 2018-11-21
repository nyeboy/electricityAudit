package com.audit.modules.site.service;

import java.text.ParseException;
import java.util.List;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.PowerRatingVO;
import com.audit.modules.electricity.entity.TowerEleBenchmark;
import com.audit.modules.electricity.vo.ElectricityBenchmarkCheckVO;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.site.entity.SmartMeterStandard;
import com.audit.modules.site.entity.SwitchPowerStandard;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : 
 * @date : 2017年4月19日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public interface BenchmarkService {
	
	/**
	 * 
	 */

    /**
     * 分页查询额定功率标杆
     * @param pageUtil
     */
	PageUtil<PowerRatingVO> queryBenchmarkOfPowerRating(PageUtil<SiteInfoVO> pageUtil);

    /**
     * 查询额定功率标杆
     * @param siteIds 报账点ID列表
     * @return
     */
    List<PowerRatingVO> getPowerRating(List<String> siteIds);

    /**
     * 获取塔维的额定功率
     * @param siteIds 塔维报账点ID列表
     * @return
     */
    List<PowerRatingVO> getTowerPowerRating(List<String> siteIds);

    /**
     * 获取超标杆情况
     * @param electricityId 稽核单ID
     * @return
     */
    ElectricityBenchmarkCheckVO queryOverBenchmark(String electricityId);
    
    /**
     * 塔维获取超标杆情况
     * @param page
     * @throws ParseException
     */
    ElectricityBenchmarkCheckVO queryOverBenchmarkTw(String tower_electricityId);
    
	//查询智能电表标杆
    void querySmartMeterStandard(PageUtil<SmartMeterStandard> page) throws ParseException;
    //查询开关电源标杆
    void querySwitchPowerStandard(PageUtil<SwitchPowerStandard> page);
}
