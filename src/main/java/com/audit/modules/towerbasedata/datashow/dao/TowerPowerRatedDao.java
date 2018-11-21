package com.audit.modules.towerbasedata.datashow.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.towerbasedata.datashow.entity.TowerPowerRate;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : 
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
@Component
@MybatisRepostiory
public interface TowerPowerRatedDao {

	//塔维： 额定功率 标杆管理
	List<TowerPowerRate> powerRateManage(PageUtil<TowerPowerRate> page);
	
	//塔维：额定功率标杆管理-详情
	List<EquRoomDevice> powerRateManageDetail(@Param("towerId")String towerId);
	//塔维：获取站点总功率
	Double queryTotalPower(@Param("towerId")String towerId);
}
