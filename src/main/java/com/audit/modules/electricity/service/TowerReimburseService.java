package com.audit.modules.electricity.service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.TowerReimburseVo;

/**
 * @author : 袁礼斌
 * @Description : 塔维电费报销单Service
 * @date : 2017/5/2
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface TowerReimburseService {
	/**
	 * 分页查询塔维电费报销单
	 * @param page
	 * @return
	 */
	public void queryPage(PageUtil<TowerReimburseVo> page,TowerReimburseVo record);
	
	/**
	 * 根据ID查询塔维报电费报销单
	 * @param id
	 * @return
	 */
	public TowerReimburseVo selectByPrimaryKey(Integer id);
	
	/**
	 * 删除塔维电费报销单
	 * @param id
	 * @return
	 */
	public ResultVO deleteByPrimaryKey(Integer id);

	/**
	 * 插入塔维电费报销单
	 * @param record
	 * @return
	 */
	public ResultVO insert(TowerReimburseVo record);
	/**
	 * 精确更新塔维电费报销单
	 * @param record
	 * @return
	 */
	public ResultVO updateByPrimaryKeySelective(TowerReimburseVo record);

	/**
	 * 全量更新塔维电费报销单
	 * @param record
	 * @return
	 */
	public ResultVO updateByPrimaryKey(TowerReimburseVo record);
	
	/**
	 * 财务推送
	 * 
	 * @param ids 记录标示
	 * @param state 状态
	 */
	void updateList(String[] ids, Integer state);
	
	/**
	 * 更新状态值
	 * 
	 * @param reimburseNos 电费提交单号
	 * @param status 状态值
	 */
	void updateByNo(String[] reimburseNos, Integer status);
	
	/**
	 * 通过流水号查询
	 * 
	 * @param reimburseNo 电费提交单号
	 * @return 电费提交单
	 */
	TowerReimburseVo queryByNo(String reimburseNo);
}
