package com.audit.modules.supplier.service.impl;

import java.util.List;
import java.util.Map;

import com.audit.modules.system.entity.UserVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.supplier.dao.SupplierDao;
import com.audit.modules.supplier.entity.SupplierVO;
import com.audit.modules.supplier.service.SupplierService;
import com.google.common.collect.Maps;

/**
 * @author : jiadu
 * @Description : 供应商
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierDao supplierDao;

    @Override
    public SupplierVO findBySiteID(String siteID) {
        Map<String, String> paramterMap = Maps.newHashMap();
        paramterMap.put("siteId", siteID);
        return supplierDao.findBySiteID(paramterMap);
    }


    /**
     * @param code 供应商编码
     * @return 供应商名称/code
     * @Description 根据code获取供应商名称
     */
    @Override
    public List<Map<String, String>> queryNameByCode(String code) {

        return supplierDao.queryNameByCode(code);
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 模糊查询供应商
     */
    @Override
    public List<SupplierVO> findLikeByName(PageUtil<SupplierVO> page, UserVo userInfo,SupplierVO supplierVO) {
    	
        List<SupplierVO> supplierVOs = supplierDao.findLikeByName(page);
        //page.setResults(supplierVOs);
        return supplierVOs;
    }


	@Override
	public ElectrictyVO findContractBySiteID(String siteID) {
		  Map<String, String> paramterMap = Maps.newHashMap();
	        paramterMap.put("siteId", siteID);
		return supplierDao.findContractBySiteID(paramterMap);
	}

	@Override
	public List<String> queryContract(String siteID) {
		  Map<String, String> paramterMap = Maps.newHashMap();
	        paramterMap.put("siteId", siteID);
		return supplierDao.queryContract(paramterMap);
	}
	
	@Override
	public int getCodeById(String supplyId) {
		int codeById = supplierDao.getCodeById(supplyId);
		return codeById;
	}
}
