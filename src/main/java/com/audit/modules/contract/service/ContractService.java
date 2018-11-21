package com.audit.modules.contract.service;

import java.util.List;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.contract.entity.ContractVO;

/**
 * @author : jiadu
 * @Description : 合同查询
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface ContractService {
    ContractVO queryByMeters(String metersNumber);
    ContractVO queryBySiteId(String siteId);
    
 	/**   
	 * @Description:分页搜索合同
	 * @param :  Contract
	 * @param :  pageUtil
	 * @return :     
	 * @throws  
	*/
 	List<ContractVO> queryContractListPage(ContractVO contractVO, PageUtil<ContractVO> pageUtil);
 
 	
 	/**
 	 * 查询合同Id 查询
 	 * @param ID
 	 * @return
 	 */
 	ContractVO selectByContractId(String contractId);
 	
 	/**
 	 * 单、批量合同删除
 	 * @param IdList
 	 */
 	void deleteContract(List<String> IdList);

 	/**
 	 * 添加、更新合同（可以部分属性为null）
 	 * @param record
 	 * @return
 	 */
 	void saveOrUpdateContract(ContractVO contract);

 	
}
