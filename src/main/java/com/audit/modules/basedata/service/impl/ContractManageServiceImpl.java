package com.audit.modules.basedata.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.ContractManageDao;
import com.audit.modules.basedata.entity.ContractManage;
import com.audit.modules.basedata.service.ContractManageService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.google.common.collect.Maps;


/**
 * @Description : 合同管理(请描述该文件主要功能)
 *
 * @author :
 * @date : 2017年8月22日
 *
 *       Copyright (c) 2017, IsoftStone All Right reserved.
 */

@Service
public class ContractManageServiceImpl implements ContractManageService {

	@Autowired
	private ContractManageDao ContractManageDao;

	/*
	 * 分业查询
	 * */
	@Override 
/*	public List<ContractManage> findContractByPage(PageUtil<ContractManage> page, String only) {
		if(null != only && only.equals("1")){
			return ContractManageDao.onlyFindContractByPage(page);
		}else{
			return ContractManageDao.findContractByPage(page);
		}
	}*/
	public List<ContractManage> findContractByPage(PageUtil<ContractManage> page) {
			return ContractManageDao.findContractByPage(page);
	}
	
	@Override
	public ResultVO findContractById(String id,String cityId,String countyId) {
		Map<String, String> paramterMap = Maps.newHashMap();
        paramterMap.put("id", id);
        paramterMap.put("cityId", cityId);
        paramterMap.put("countyId", countyId);
        System.out.println(cityId+"=-------"+countyId+"--"+(cityId!=null)+"--"+("".equals(cityId)));
		if (id !=null && !id.equals("")) {
			ContractManage sManage = ContractManageDao.findContractById(paramterMap);
			if(sManage!=null){
				Double price=ContractManageDao.findUnitPrice(paramterMap);
				if(price!=null){
					sManage.setUnitPrice(price);
				}
				return ResultVO.success(sManage);
			}
		}
		return ResultVO.failed("查询失败");
	}
	
	
	
	@Override
	public ResultVO findwhiteContractById(String id,String cityId,String countyId) {
		Map<String, String> paramterMap = Maps.newHashMap();
        paramterMap.put("id", id);
        paramterMap.put("cityId", cityId);
        paramterMap.put("countyId", countyId);
        System.out.println(cityId+"=-------"+countyId+"--"+(cityId!=null)+"--"+("".equals(cityId)));
		if (id !=null && !id.equals("")) {
			ContractManage sManage = ContractManageDao.findwhiteContractById(paramterMap);
			if(sManage!=null){
				Double price=ContractManageDao.findUnitPrice(paramterMap);
				if(price!=null){
					sManage.setUnitPrice(price);
				}
				return ResultVO.success(sManage);
			}else {
				return ResultVO.success("否");
			}
		}
		return ResultVO.failed("查询失败");
	}

	@Override
	public ResultVO updateContract(ContractManage sManage) {
		if (sManage !=null) {
			ContractManageDao.updateContract(sManage);
			return ResultVO.success();
		}
		return ResultVO.failed("更新失败");
		
	}

	@Override
	public ResultVO deleteContractById(String id) {
		if (id !=null && !id.equals("")) {
			ContractManageDao.deleteContractById(id);
			return ResultVO.success();
		}
		return ResultVO.failed("删除失败");
		
		
	}

	@Override
	public ResultVO insertContract(ContractManage sManage) {
		if (sManage !=null) {
			ContractManageDao.insertContract(sManage);
			 return ResultVO.success();
		}
		return ResultVO.failed("添加失败");
		 
	}

}
