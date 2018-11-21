package com.audit.modules.payment.dao;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.payment.entity.EleMiddleSubmitVO;
import com.audit.modules.payment.entity.ElectricitySubmitVO;
import com.audit.modules.payment.entity.PreMidSubmit;
import com.audit.modules.payment.entity.PreSubmit;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface PreSubmitDao {
    void createEleSubmit(ElectricitySubmitVO electricitySubmitVO);
    
    //保存入中间表
    public void savePreMidlleSubmit(PreMidSubmit premid);
    
    //查询列表
    List<ElectricitySubmitVO> queryList(PageUtil<ElectricitySubmitVO> pageUtil);
    
    ElectricitySubmitVO queryDetail(@Param("subID") String subID);
    
    List<PreMidSubmit> queryMiddleBySubID(@Param("subID") String subID);
    
    public PreSubmit getPreSubBySubNO(String submitNo);
    
    public List<String> getSpIds(String spsid);
//
//    void deleteBySubID(@Param("subID") String subID);
//
//    void deleteEleMidBySubID(@Param("subID") String subID);
//
    void updateStatus(Map<String, Object> map);
//    
//    void updateStatusByNo(@Param("map") Map<String, Object> map);
//    
//	ElectricitySubmitVO queryBysubmitNo(@Param("submitNo") String submitNo);

}
