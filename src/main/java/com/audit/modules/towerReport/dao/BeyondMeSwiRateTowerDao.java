package com.audit.modules.towerReport.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.towerReport.entity.BeyondMeSwiRateTower;

@Component
@MybatisRepostiory
public interface BeyondMeSwiRateTowerDao{

	List<BeyondMeSwiRateTower> findByTypeAndYear(@Param("typeCode") String typeCode, @Param("year") String year);
}