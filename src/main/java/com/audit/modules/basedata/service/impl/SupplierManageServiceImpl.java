package com.audit.modules.basedata.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.SupplierManageDao;
import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.basedata.service.SupplierManageService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;

/**
 * @Description : 供应商管理(请描述该文件主要功能)
 *
 * @author :
 * @date : 2017年4月20日
 *
 *       Copyright (c) 2017, IsoftStone All Right reserved.
 */

@Service
public class SupplierManageServiceImpl implements SupplierManageService {

	@Autowired
	private SupplierManageDao supplierManageDao;

	/*
	 * 分业查询
	 * */
	@Override 
	public List<SupplierManage> findSupplyByPage(PageUtil<SupplierManage> page, String only) {
		if(null != only && only.equals("1")){
			return supplierManageDao.onlyFindSupplyByPage1(page);
		}else{
			return supplierManageDao.findSupplyByPage(page);
		}
	}

	@Override
	public ResultVO findSupplyById(String id) {
		if (id !=null && !id.equals("")) {
			SupplierManage sManage = supplierManageDao.findSupplyById(id);
			return ResultVO.success(sManage);
		}
		return ResultVO.failed("查询失败");
	}

	@Override
	public ResultVO updateSupply(SupplierManage sManage) {
		if (sManage !=null) {
			supplierManageDao.updateSupply(sManage);
			return ResultVO.success();
		}
		return ResultVO.failed("更新失败");
		
	}

	@Override
	public ResultVO deleteSupplyById(String id) {
		if (id !=null && !id.equals("")) {
			supplierManageDao.deleteSupplyById(id);
			return ResultVO.success();
		}
		return ResultVO.failed("删除失败");
		
		
	}

	@Override
	public ResultVO insertSupply(SupplierManage sManage) {
		if (sManage !=null) {
			supplierManageDao.insertSupply(sManage);
			 return ResultVO.success();
		}
		return ResultVO.failed("添加失败");
		 
	}

}
