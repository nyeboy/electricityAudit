package com.audit.modules.system.entity;

/**   
 * @Description : 系统管理》角色权限对象    
 *
 * @author : liuyan
 * @date : 2017年3月7日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class SysRoleAuthorityVo {
	
	private Integer roleId;// 角色Id
	private String authorities;// 角色权限
	
	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}

	public String getAuthorities() {
		return authorities;
	}

	public void setAuthorities(String authorities) {
		this.authorities = authorities;
	}

}
