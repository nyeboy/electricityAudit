package com.audit.modules.system.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysRoleVo;

/**   
 * @Description : 角色DAO    
 *
 * @author : liuyan
 * @date : 2017年3月9日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
@Component
@MybatisRepostiory
public interface SysRoleDao {
	// 查询所有角色(超级管理员 可见超级管理员角色)
	List<SysRoleVo> getRoleList(@Param("supAdminTag")String supAdminTag);

	// 添加角色
	int insertSelective(SysRoleVo sysRoleVo);

	// 通过角色名模糊查询角色信息
	List<SysRoleVo> getRoleListByRoleName(String roleName);

	// 根据角色ID查询角色信息
	List<SysRoleVo> getRoleListByRoleId(Integer roleId);

	// 修改角色信息
	void updateRole(SysRoleVo sysrole);

	// 根据角色ID删除角色
	int deleteByPrimaryKey(Integer roleId);

	// 根据角色ID删除用户角色中间表信息
	int deleteUserRoleByRoleIds(String[] roleArray);

	// 分页查询角色列表
	List<SysRoleVo> getPageRoleList(PageUtil<SysRoleVo> pageUtil);

	// 查询用户相关角色的最大等级  
	Integer queryMaxRoleLevelByAccount(String account);

	//	 根据角色IDs删除角色
	int deleteByRoleIds(String[] roleArray);

	//根据用户Id查询角色
	List<SysRoleVo> queryRoleByUserId(String userId);

}
