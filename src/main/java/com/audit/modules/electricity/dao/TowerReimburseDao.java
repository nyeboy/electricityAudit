package com.audit.modules.electricity.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.OwnerVo;
import com.audit.modules.electricity.entity.TowerReiEleVo;
import com.audit.modules.electricity.entity.TowerReimburseVo;

/**
 * @author : 袁礼斌
 * @Description : 塔维电费报销单DAO
 * @date : 2017/5/2
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface TowerReimburseDao {
	
	public Boolean deleteByPrimaryKey(Integer id);

	public Boolean insert(TowerReimburseVo record);
	
	public Integer selectId();
	
	public Integer selectReId();
	
	public Boolean saveReiEle(List<TowerReiEleVo> list);
	
	public List<OwnerVo> queryPage(PageUtil<TowerReimburseVo> page);
	
	public TowerReimburseVo selectByPrimaryKey(Integer id);

	public Boolean updateByPrimaryKeySelective(TowerReimburseVo record);

	public Boolean updateByPrimaryKey(TowerReimburseVo record);
	
	void updateByNo(@Param("map") Map<String, Object> map);
	
	TowerReimburseVo queryByNo(@Param("reimburseNo") String reimburseNo);
}
