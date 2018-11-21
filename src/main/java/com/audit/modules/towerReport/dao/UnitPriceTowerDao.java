package com.audit.modules.towerReport.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.towerReport.entity.UnitPriceTower;
@Component
@MybatisRepostiory
public interface UnitPriceTowerDao{

	List<UnitPriceTower> findByTypeAndYear(@Param("typeCode") String typeCode, 
			@Param("year") String year, @Param("supplyType")String supplyType);
    
}