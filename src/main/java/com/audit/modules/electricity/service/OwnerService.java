package com.audit.modules.electricity.service;

import java.util.List;
import java.util.Map;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.OwnerMeterVo;
import com.audit.modules.electricity.entity.OwnerVo;

/**
 * @Description 业主信息service
 * @author 袁礼斌
 * @date 2017/4/21 Copyright (c) 2017, ISoftStone All Right reserved.
 */
public interface OwnerService {

	/**
	 * 分页查询业主信息
	 * @param page
	 * @param ownerVo
	 */
	public void queryPage(PageUtil<OwnerVo> page, OwnerVo ownerVo);
	
	/**
	 * 根据主键ID查询业主信息
	 * @param ownerId
	 * @return
	 */
	public OwnerVo queryOwner(String ownerId);
	
	/**
	 * 保存业主信息
	 * @param ownerVo
	 * @return
	 */
	public ResultVO saveOwner(OwnerVo ownerVo);
	
	/**
	 * 修改业主信息
	 * @param ownerVo
	 * @return
	 */
	public ResultVO updateOwner(OwnerVo ownerVo);
	
	/**
	 * 删除业主信息
	 * @param ownerId
	 * @return
	 */
	public ResultVO deleteOwner(String ownerId);
	
	/**
	 * 批量删除业主信息
	 * @param ownerIds
	 * @return
	 */
	public ResultVO bathDeleteOwner(String[] ownerIds);
	
	/**
	 * 导出Excel
	 * @param ownerIds
	 * @return
	 */
	public List<OwnerMeterVo> exportExcel(Map<String,Long> map);
	
	/**
	 * 导出数据长度
	 * @param ownerIds
	 * @return
	 */
	public Long listCount();
	
}
