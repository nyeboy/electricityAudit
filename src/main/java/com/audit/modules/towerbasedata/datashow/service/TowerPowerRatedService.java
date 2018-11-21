package com.audit.modules.towerbasedata.datashow.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.datashow.entity.TowerPowerRate;
import com.audit.modules.towerbasedata.datashow.entity.TowerPowerRateDetail;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : 
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public interface TowerPowerRatedService {
	
	//塔维 额定功率 标杆
	List<TowerPowerRate> powerRateManage(PageUtil<TowerPowerRate> page);
	
	//塔维：额定功率标杆管理-详情
	List<TowerPowerRateDetail> powerRateManageDetail(@Param("towerId")String towerId);
}
