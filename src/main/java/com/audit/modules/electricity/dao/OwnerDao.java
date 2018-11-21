package com.audit.modules.electricity.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.OwnerMeterVo;
import com.audit.modules.electricity.entity.OwnerVo;

@Component
@MybatisRepostiory
public interface OwnerDao {
	/**
	 * 分页查询业主信息
	 * @param page
	 * @return
	 */
	public List<OwnerVo> queryPage(PageUtil<OwnerVo> page);
	
	/**
	 * 根据主键ID查询业主信息
	 * @param ownerId
	 * @return
	 */
	public OwnerVo queryOwner(@Param("ownerId")String ownerId);
	
	/**
	 * 保存业主信息
	 * @param ownerVo
	 * @return
	 */
	public Boolean saveOwner(OwnerVo ownerVo);
	
	/**
	 * 修改业主信息
	 * @param ownerVo
	 * @return
	 */
	public Boolean updateOwner(OwnerVo ownerVo);
	
	/**
	 * 删除业主信息
	 * @param ownerId
	 * @return
	 */
	public Boolean deleteOwner(@Param("ownerId")String ownerId);
	
	/**
	 * 批量删除业主信息
	 * @param ownerIds
	 * @return
	 */
	public Boolean bathDeleteOwner(@Param("array")String[] ownerIds);
	
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
