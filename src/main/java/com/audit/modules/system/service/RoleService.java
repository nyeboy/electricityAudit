package com.audit.modules.system.service;

import java.util.List;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysResource;
import com.audit.modules.system.entity.SysRoleVo;

/**   
 * @Description : 系统角色service    
 *
 * @author : liuyan
 * @date : 2017年3月8日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public interface RoleService {
	
	/*
	 * 获取所有角色
	 */
	List<SysRoleVo> getRoleList();

	/*
	 * 根据角色名模糊查询角色信息
	 */
	List<SysRoleVo> getRoleListByRoleName(String roleName);
	
	/*
	 * 根据角色id查询角色信息
	 */
	SysRoleVo getRoleByRoleId(Integer roleId);
	
	/*
	 * 更新角色信息
	 */
	void updateRole(Integer roleId, String roleName, String description, Integer roleLevel, Integer isSystem);
	
	/*
	 * 更新角色的权限资源
	 */
	void updateRoleResource(Integer roleId, List<Integer> resourceIdList);
	
	/*
	 * 根据角色Id查询权限资源
	 */
	List<SysResource> findResourceByRoleId(Integer roleId);
	
	/*
	 * 根据角色Ids删除角色
	 */
	void removeRoleByIds(String roleIds);
	
	/*
	 * 新增角色
	 */
	void addRole(SysRoleVo roleVo);

	/*
	 *分页查询角色列表 
	 */
	void getPageRoleList(SysRoleVo sysRoleVo, PageUtil<SysRoleVo> pageUtil);

	/*
	 * 查询用户相关角色的最大等级。
	 */
	String queryMaxRoleLevelByAccount(String account);
}
