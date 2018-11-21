package com.audit.modules.system.entity;

import java.util.Date;
import java.util.List;

/**   
 * @Description : 系统管理》角色对象   
 *
 * @author : liuyan
 * @date : 2017年3月7日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class SysRoleVo {
	// 角色ID
	private Integer roleId;
	// 角色名
	private String roleName;
	// 角色等级
	private Integer roleLevel;
	// 是否系统内置角色
	private Integer isSystem;
	// 备注
	private String description;
	// 建立时间
	private Date createDate;
	// 修改时间
	private Date updateDate;
	//资源list
	private List<SysResource> resourceList;
	//资源Idlist
	private List<String> resourceIdList;

	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public Integer getRoleLevel() {
		return roleLevel;
	}

	public void setRoleLevel(Integer roleLevel) {
		this.roleLevel = roleLevel;
	}

	public Integer getIsSystem() {
		return isSystem;
	}

	public void setIsSystem(Integer isSystem) {
		this.isSystem = isSystem;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public List<SysResource> getResourceList() {
		return resourceList;
	}

	public void setResourceList(List<SysResource> resourceList) {
		this.resourceList = resourceList;
	}

	public List<String> getResourceIdList() {
		return resourceIdList;
	}

	public void setResourceIdList(List<String> resourceIdList) {
		this.resourceIdList = resourceIdList;
	}

	
}
