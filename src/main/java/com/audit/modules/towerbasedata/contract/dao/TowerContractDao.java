package com.audit.modules.towerbasedata.contract.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.contract.entity.TowerContractVO;

/**
 * @author : bingliup
 * @Description :
 * @date : 2017/4/30
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface TowerContractDao {    
    
    /**
     * 分页搜索 获取所有合同数据
     * @param pageUtil
     * @return
     */
 	List<TowerContractVO> getPageList(PageUtil<TowerContractVO> pageUtil);
 	
 	/**
 	 * 通过Id单个查询
 	 * @param ID
 	 * @return
 	 */
 	List<TowerContractVO> selectById(String Id);
 	
 	/**
 	 * 删除
 	 * @param list
 	 */
 	void delete(List<String> IdList);
 	
 	/**
 	 * 新增、更新
 	 * @param VO
 	 */
 	void update(TowerContractVO VO);

 	/**
 	 * 铁塔id 查询合同信息
 	 * @param towerId
 	 */
 	List<TowerContractVO> selectByTowerId(@Param("towerId") String towerId);
 	
 	public Integer queryCount();
}
