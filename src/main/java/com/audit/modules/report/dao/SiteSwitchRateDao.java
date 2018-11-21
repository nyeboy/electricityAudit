package com.audit.modules.report.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.report.entity.SiteSwitchRate;

public interface SiteSwitchRateDao {

	List<SiteSwitchRate> findByTypeAndYear(@Param("typeCode") String typeCode,@Param("year") String year);
}