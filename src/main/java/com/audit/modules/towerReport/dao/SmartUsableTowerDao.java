package com.audit.modules.towerReport.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.towerReport.entity.SmartUsableTower;
@Component
@MybatisRepostiory
public interface SmartUsableTowerDao{
   
    List<SmartUsableTower> findByTypeAndYear(@Param("typeCode") String typeCode,@Param("year") String year);
  
   
}