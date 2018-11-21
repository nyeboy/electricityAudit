package com.audit.modules.electricity.service;

import java.util.List;

import com.audit.modules.electricity.entity.MeterVo;

/**
 * @Description 业主电表信息service
 * @author 袁礼斌
 * @date 2017/4/21 Copyright (c) 2017, ISoftStone All Right reserved.
 */
public interface MeterService {

	/**
	 * 查询业主电表信息
	 * @param meterId
	 * @return
	 */
	public MeterVo queryMeter(String meterId);
	/**
	 * 查询业主电表列表信息
	 * @param ownerId
	 * @return
	 */
	public List<MeterVo> queryMeterList(String ownerId);
	
	/**
	 * 保存业主电表信息
	 * @param meterVo
	 * @return
	 */
	public Boolean saveMeter(MeterVo meterVo);
	
	/**
	 * 修改业主电表信息
	 * @param meterVo
	 * @return
	 */
	public Boolean updateMeter(MeterVo meterVo);
	
	/**
	 * 删除业主电表信息
	 * @param meterId
	 * @return
	 */
	public Boolean deleteMeter(String meterId);
	
	/**
	 * 删除业主电表信息-业主id
	 * @param meterId
	 * @return
	 */
	public Boolean deleteMeterByOwnerId(String ownerId);
}
