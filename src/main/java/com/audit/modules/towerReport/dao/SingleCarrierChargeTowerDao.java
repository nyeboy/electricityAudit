package com.audit.modules.towerReport.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.towerReport.entity.SingleCarrierChargeTower;
@Component
@MybatisRepostiory
public interface SingleCarrierChargeTowerDao{
    
	List<SingleCarrierChargeTower> findByCodeTypeAndYear(@Param("typeCode") String typeCode, @Param("year")String year);
}