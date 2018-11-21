package com.audit.modules.electricity.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.electricity.entity.EleCpowerJobVO;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;

@Component
@MybatisRepostiory
public interface JobDao {
	
	/**
	 * 插入emos工单
	 */
	public void insertByJobNum(EleCpowerJobVO eleCpowerJobVO);
	
	public void insertByDescription(EleCpowerJobVO eleCpowerJobVO);
	
	//根据稽核单号查询该计核单的电表信息
	public List<WatthourExtendVO> getWatthourExtendByEleID(String eleid);
}