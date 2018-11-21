package com.audit.modules.towerReport.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.towerReport.entity.SiteSwitchRateTower;

public interface SiteSwitchRateTowerDao{

	List<SiteSwitchRateTower> findByTypeAndYear(@Param("typeCode") String typeCode,@Param("year") String year);
}