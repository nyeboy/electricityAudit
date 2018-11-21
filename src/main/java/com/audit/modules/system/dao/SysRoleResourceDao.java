package com.audit.modules.system.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.system.entity.SysRoleResource;

/**
 * 
 * @Description: 角色资源中间表 dao   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月8日 下午3:10:05
 */
@Component
@MybatisRepostiory
public interface SysRoleResourceDao {
	// 删除角色资源信息
	int delete(@Param("roleId") Integer roleId, @Param("list") List<Integer> resourceIdList);

	// 新增角色资源信息
	int insert(@Param("roleId") Integer roleId, @Param("resourceId") Integer resourceId);

	// 通过角色Id删除角色资源信息
	int deletByRoleId(@Param("roleId") Integer roleId);

	// 通过资源Id删除指定角色资源信息
	int deletByResourceId(@Param("resourceId") Integer reousrceId);

	// 通过资源IdSet批量删除
	void deletRoleResByResIdList(@Param("list") List<Long> resIdList);
	
	// 通过角色Ids删除角色资源信息
	void deletByRoleIds(@Param("array")String[] roleArray);
	
	// 通过角色ids查询角色资源信息
	List<SysRoleResource> selectByRoleIdList(@Param("list") List<Integer> roleIdList);

}