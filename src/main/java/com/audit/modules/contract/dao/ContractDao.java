package com.audit.modules.contract.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.contract.entity.ContractVO;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface ContractDao {
    ContractVO queryByMeters(String metersNumber);

    ContractVO queryBySiteId(Map<String, String> paramterMap);

    List<ContractVO> findAll();
    
    
    /**
     * 分页搜索 获取所有合同数据
     * @param pageUtil
     * @return
     */
 	List<ContractVO> getPageContractList(PageUtil<ContractVO> pageUtil);
 	
 	/**
 	 * 通过Id单个查询
 	 * @param ID
 	 * @return
 	 */
 	ContractVO selectByContractId(String contractId);
 	
 	/**
 	 * 删除
 	 * @param list
 	 */
 	void deleteContract(List<String> IdList);
 	
 	/**
 	 * 新增、更新
 	 * @param contract
 	 */
 	void saveOrUpdateContract(ContractVO contract);

 	
}
