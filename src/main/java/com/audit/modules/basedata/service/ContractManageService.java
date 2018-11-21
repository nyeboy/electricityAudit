package com.audit.modules.basedata.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.basedata.entity.ContractManage;
import com.audit.modules.basedata.entity.ContractManage;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;

/**
 * @Description : TODO(供应商信息管理)
 *
 * @author :
 * @date : 2017年4月20日
 *
 *       Copyright (c) 2017, IsoftStone All Right reserved.
 */

public interface ContractManageService {

	// 分页查询
	/*List<ContractManage> findContractByPage(PageUtil<ContractManage> page, String only);*/
	List<ContractManage> findContractByPage(PageUtil<ContractManage> page);
	// 根据id查找
	ResultVO findContractById(String id,String cityId,String countyId);
	
	// 根据id查找
	ResultVO findwhiteContractById(String id,String cityId,String countyId);

	// 更新
	ResultVO updateContract(ContractManage sManage);

	// 删除
	ResultVO deleteContractById(@Param("id") String id);

	// 添加
	ResultVO insertContract(ContractManage sManage);
}
