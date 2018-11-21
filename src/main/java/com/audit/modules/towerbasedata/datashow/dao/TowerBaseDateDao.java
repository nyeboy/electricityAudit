package com.audit.modules.towerbasedata.datashow.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.towerbasedata.datashow.entity.TowerDataShow;

/**   
 * @Description : TODO(塔维基础数据 --呈现)    
 *
 * @author : chentao
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
@Component
@MybatisRepostiory
public interface TowerBaseDateDao {
	
	//查询铁塔列表
	List<TowerDataShow> showBaseDateByPage(PageUtil<TowerDataShow> page);
	//查询供电信息、其他信息
	TowerDataShow findTowerSiteById(@Param("towerId")String towerId);
	//查询机房设备信息
	List<EquRoomDevice> queryDeviceById(@Param("towerId")String towerId);
	
	
	
	
}
