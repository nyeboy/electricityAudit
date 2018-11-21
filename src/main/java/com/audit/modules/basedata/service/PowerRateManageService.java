package com.audit.modules.basedata.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.basedata.entity.PropertyAsStatus;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : 
 * @date : 2017年4月20日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public interface PowerRateManageService {

	// 分页查询
	List<PowerRateManage> findPowerRateByPage(PageUtil<PowerRateManage> page);

	//查询资管机房拥有者
	List<String> findProperty();
	
	//查询资管机房状态
	List<String> findStatus();
	
	//根据机房id查询机房设备信息
	ResultVO selectFacility(@Param("id") String id);
	
	// 根据id查找
	ResultVO findPowerRateById(@Param("id") String id);

	// 更新
	ResultVO updatePowerRate(PowerRateManage poManage);

	// 删除
	ResultVO deletePowerRateById(@Param("id") String id);

	// 添加
	ResultVO insertPowerRate(PowerRateManage poManage);
	
	// 获取设备类型
	ResultVO findPdeviceType();
}
