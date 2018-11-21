package com.audit.modules.system.dao;

import java.math.BigDecimal;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysResource;

/**
 * 
 * @Description: 权限资源dao
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年3月31日 下午3:21:17
 */
@Component
@MybatisRepostiory
public interface SysResourceDao {

	// 通过IdSet批量删除资源
	void deleteResByIdList(List<Long> list);

	// 新增资源（可以部分属性为null）
	int insertSelective(SysResource record);

	// 通过id查询资源
	SysResource selectByPrimaryKey(BigDecimal id);

	// 通过ResourceIdList 查询资源
	List<SysResource> selectByResourceIdList(List<Integer> list);

	// 通过角色Id 查询资源
	List<SysResource> selectByRoleId(Integer roleId);

	// 通过id更改可选属性
	int updateByPrimaryKeySelective(SysResource record);

	// 查询所有权限资源
	List<SysResource> findAll(String functionType);

	// 根据类型查询资源： menu、button
	List<SysResource> findResourceByType(@Param("type")String type,@Param("functionType") String functionType);

	// 通过角色IdList 查询资源IdList
	List<Integer> selectIdByRoleIdList(@Param("list")List<Integer> roleIdList);

	// 通过角色Id 查询资源IdList
	List<Integer> selectIdByRoleId(Integer roleId);

	// 查询子资源Id
	List<Long> selectIdByParentId(String resId);

	// 分页搜索
	List<SysResource> getPageRoleList(PageUtil<SysResource> pageUtil);

	// 通过 functionType查询资源("0":自维；“1”：塔维）
	List<SysResource> findAllByFunctionType(@Param(value="functionType") String functionType);

}