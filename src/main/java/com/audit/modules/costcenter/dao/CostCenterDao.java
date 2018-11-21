package com.audit.modules.costcenter.dao;

import java.util.List;
import java.util.Map;

import com.audit.modules.costcenter.entity.CostCeterEntity;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.costcenter.entity.CostCeterVO;

/**
 * @author : jiadu
 * @Description : 成本中心
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface CostCenterDao {
    List<CostCeterVO> findByLoginUser(Map<String,String> paramterMap);
    void deleteAll();
    void batchSave(List<CostCeterEntity> ceterEntities);
}
