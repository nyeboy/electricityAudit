package com.audit.modules.basedata.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.ContractManage;
import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;

/**
 * @Description : TODO(合同信息管理)
 *
 * @author :
 * @date : 2017年4月20日
 *
 *       Copyright (c) 2017, IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface ContractManageDao {

	// 分页查询 
	List<ContractManage> findContractByPage(PageUtil<ContractManage> page);
	
	// 只分页查询供应商，不显示报账点名称(合同信息不会重复)
	List<ContractManage> onlyFindContractByPage(PageUtil<ContractManage> page);

	// 根据id查找
	ContractManage findContractById(Map<String,String> paramterMap);
	
	// 根据id查找
	ContractManage findwhiteContractById(Map<String,String> paramterMap);
	
	// 根据地市区县查找区域直供电单价
	Double findUnitPrice(Map<String,String> paramterMap);	

	// 更新
	void updateContract(ContractManage sManage);

	// 删除
	void deleteContractById(@Param("id") String id);

	// 添加
	void insertContract(ContractManage sManage);
}
