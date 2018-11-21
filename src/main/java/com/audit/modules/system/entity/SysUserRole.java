package com.audit.modules.system.entity;

/**   
 * @Description : 用户角色
 *
 * @author : 陈涛
 * @date : 2017年4月6日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class SysUserRole {
	
	private String id;
	//用户id
	private String userId;
	//角色id
	private String roleId;
	//角色名
	private String roleName;

	public SysUserRole() {
		super();
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}


	
}
