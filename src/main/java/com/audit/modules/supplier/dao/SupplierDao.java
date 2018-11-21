package com.audit.modules.supplier.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.supplier.entity.SupplierVO;

/**
 * @author : jiadu
 * @Description : 供应商
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface SupplierDao {

	//通过报账点id获取供应商
    SupplierVO findBySiteID(Map<String,String> paramterMap);
    
    //通过报账点id获取稽核单数据(合同信息)
    ElectrictyVO findContractBySiteID(Map<String,String> paramterMap);
    
   //报账点对应的所有合同
    List<String>  queryContract(Map<String,String> paramterMap);

    //根据code获取供应商名称
    List<Map<String, String>> queryNameByCode(String code);

    List<SupplierVO> findAll();
    
    //根据本门id/供应商name查询
    List<SupplierVO> findLikeByName(PageUtil<SupplierVO> page);
    
    public int getCodeById(String supplyId);
}
