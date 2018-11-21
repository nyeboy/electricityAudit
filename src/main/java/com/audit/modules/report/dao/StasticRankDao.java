package com.audit.modules.report.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;

@Component
@MybatisRepostiory
public interface StasticRankDao {
   
	List<String> findByTypeAndYear(@Param("typeCode")String typeCode,@Param("year") String year);
    
    
}