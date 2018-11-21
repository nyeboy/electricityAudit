package com.audit.modules.towerbasedata.powerrate.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.powerrate.entity.TowerPowerRateVO;

/**   
 * @Description : TODO(额定功率信息管理)    
 *
 * @author : bingliup
 * @date : 2017年4月30日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Component
@MybatisRepostiory
public interface TowerPowerRateDao {
		
		// 分页查询
		List<TowerPowerRateVO> getPageList (PageUtil<TowerPowerRateVO> page);

		// 根据id查找
		TowerPowerRateVO selectById(@Param("id") String id);

		// 更新
		void update(TowerPowerRateVO poManage);

		/**   
		 * @Description: 通过Ids删除  
		 * @param :       
		 * @return :     
		 * @throws  
		*/
		void delete(@Param("array")String[] idArray);

		
		
}
