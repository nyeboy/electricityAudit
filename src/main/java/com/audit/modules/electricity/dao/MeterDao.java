package com.audit.modules.electricity.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.electricity.entity.MeterVo;

@Component
@MybatisRepostiory
public interface MeterDao {

	/**
	 * 查询业主电表信息
	 * @param ownerId
	 * @return
	 */
	public MeterVo queryMeter(@Param("meterId")String meterId);
	/**
	 * 查询业主电表列表信息
	 * @param ownerId
	 * @return
	 */
	public List<MeterVo> queryMeterList(@Param("ownerId")String ownerId);
	
	/**
	 * 保存业主电表信息
	 * @param ownerVo
	 * @return
	 */
	public Boolean saveMeter(MeterVo meterVo);
	
	/**
	 * 修改业主电表信息
	 * @param ownerVo
	 * @return
	 */
	public Boolean updateMeter(MeterVo meterVo);
	
	/**
	 * 删除业主电表信息
	 * @param meterId
	 * @return
	 */
	public Boolean deleteMeter(@Param("meterId")String meterId);
	
	/**
	 * 删除业主电表信息-业主id
	 * @param meterId
	 * @return
	 */
	public Boolean deleteMeterByOwnerId(@Param("ownerId")String ownerId);

}
