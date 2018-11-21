package com.audit.modules.basedata.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.basedata.entity.SupplierManage;
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

public interface SupplierManageService {

	// 分页查询
	List<SupplierManage> findSupplyByPage(PageUtil<SupplierManage> page, String only);

	// 根据id查找
	ResultVO findSupplyById(@Param("id") String id);

	// 更新
	ResultVO updateSupply(SupplierManage sManage);

	// 删除
	ResultVO deleteSupplyById(@Param("id") String id);

	// 添加
	ResultVO insertSupply(SupplierManage sManage);
}
