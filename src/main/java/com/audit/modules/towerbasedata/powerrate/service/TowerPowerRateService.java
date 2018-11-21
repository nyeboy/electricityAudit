package com.audit.modules.towerbasedata.powerrate.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.powerrate.entity.TowerPowerRateVO;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : bingliup
 * @date : 2017年4月30日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public interface TowerPowerRateService {

	// 分页查询
	List<TowerPowerRateVO> queryListPage(PageUtil<TowerPowerRateVO> page);

	// 根据id查找
	ResultVO selectById(@Param("id") String id);

	// 更新
	ResultVO update(TowerPowerRateVO poManage);

	/**   
	 * @Description: 通过Ids删除  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void delete(String[] idArray);
}
