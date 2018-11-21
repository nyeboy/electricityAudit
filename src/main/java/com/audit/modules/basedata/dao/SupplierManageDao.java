package com.audit.modules.basedata.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;

/**
 * @Description : TODO(供应商信息管理)
 *
 * @author :
 * @date : 2017年4月20日
 *
 *       Copyright (c) 2017, IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface SupplierManageDao {

	// 分页查询
	List<SupplierManage> findSupplyByPage(PageUtil<SupplierManage> page);
	
	// 只分页查询供应商，不显示报账点名称(供应商信息不会重复)
	List<SupplierManage> onlyFindSupplyByPage(PageUtil<SupplierManage> page);

	// 只分页查询供应商，不显示报账点名称(供应商信息不会重复)不关联报账点
	List<SupplierManage> onlyFindSupplyByPage1(PageUtil<SupplierManage> page);

	
	// 根据id查找
	SupplierManage findSupplyById(@Param("id") String id);

	// 更新
	void updateSupply(SupplierManage sManage);

	// 删除
	void deleteSupplyById(@Param("id") String id);

	// 添加
	void insertSupply(SupplierManage sManage);
}
