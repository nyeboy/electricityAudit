package com.audit.modules.supplier.service;

import java.util.List;
import java.util.Map;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.supplier.entity.SupplierVO;
import com.audit.modules.system.entity.UserVo;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface SupplierService {
	
	//通过报账点id获取供应商
    SupplierVO findBySiteID(String siteID);
   
    //通过报账点id获取稽核单数据(合同信息)
    ElectrictyVO findContractBySiteID(String siteID);

  //通过报账点id获取合同id
    List<String> queryContract(String siteID);
    
    //根据code获取供应商名称
    List<Map<String, String>> queryNameByCode(String code);
    
    //根据本门id/供应商name查询
    List<SupplierVO> findLikeByName(PageUtil<SupplierVO> page,UserVo userInfo,SupplierVO supplierVO);
    
    public int getCodeById(String supplyId);
}
