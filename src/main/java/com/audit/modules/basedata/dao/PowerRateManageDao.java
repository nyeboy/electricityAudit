package com.audit.modules.basedata.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.basedata.entity.PropertyAsStatus;
import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;

/**   
 * @Description : TODO(额定功率信息管理)    
 *
 * @author : 
 * @date : 2017年4月20日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Component
@MybatisRepostiory
public interface PowerRateManageDao {
		
		// 分页查询
		List<PowerRateManage> findPowerRateByPage(PageUtil<PowerRateManage> page);

		//查询资管机房拥有者
		List<String> findProperty();
		
		//查询资管机房状态
		List<String> findStatus();
		
		//根据机房id查询对应设备信息
		List<PowerRateManage> selectFacility(@Param("id") String id);
		
		// 根据id查找
		PowerRateManage findPowerRateById(@Param("id") String id);

		// 更新
		void updatePowerRate(PowerRateManage poManage);

		// 删除
		void deletePowerRateById(@Param("id") String id);

		// 添加
		void insertPowerRate(PowerRateManage poManage);
		
		// 获取设备类型
		List<String> findPdeviceType();
		
		
}
