/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.towerbasedata.other.service;

import java.util.List;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.other.entity.TowerOtherVO;

/**   
 * @Description: 其他信息管理（报销周期，分摊比例）  
 * @throws  
 * 
 * @author  bingliup
 * @date 2017年4月30日 下午7:11:12    
*/
public interface TowerOtherService {
	
	/**   
	 * @Description: 分页查询报账点其他信息  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<TowerOtherVO> queryListPage(TowerOtherVO VO, PageUtil<TowerOtherVO> pageUtil);

	/**   
	 * @Description: 通过Id查询其他信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	TowerOtherVO selectById(String accountSiteOtherId);

	/**
	 * 添加、更新
	 * @param VO
	 */
	void update(TowerOtherVO VO);

	/**   
	 * @Description: 删除（设置为""）  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void delete(String[] idArray);

}
