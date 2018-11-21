package com.audit.modules.towerbasedata.contract.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.contract.entity.TowerContractVO;

/**
 * @author : bingliup
 * @Description : 合同
 * @date : 2017/4/30
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface TowerContractService {
    
 	/**   
	 * @Description:分页搜索
	 * @param :  Contract
	 * @param :  pageUtil
	 * @return :     
	 * @throws  
	*/
 	List<TowerContractVO> queryListPage(TowerContractVO VO, PageUtil<TowerContractVO> pageUtil);
 
 	/**
 	 * 查询合同Id 查询
 	 * @param ID
 	 * @return
 	 */
 	TowerContractVO selectById(String Id);
 	
 	/**
 	 * 单、批量合同删除
 	 * @param IdList
 	 */
 	void delete(List<String> IdList);

 	/**
 	 * 添加、更新合同（可以部分属性为null）
 	 * @param record
 	 * @return
 	 */
 	void update(TowerContractVO VO);
 	
 	/**
 	 * 铁塔id 查询合同信息
 	 * @param towerId
 	 */
 	List<TowerContractVO> selectByTowerId(@Param("towerId") String towerId);
 	
 	public Integer queryCount();
 	
}
