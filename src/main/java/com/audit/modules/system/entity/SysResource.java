package com.audit.modules.system.entity;

import java.math.BigDecimal;

/**
 * 
 * @Description: 权限资源   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年3月31日 下午3:40:19
 */
public class SysResource {
	private BigDecimal id;
	// 资源名称
	private String resourceName;
	// 权限字符串
	private String permission;
	// 资源类型:menu菜单，button按钮
	private String type;
	// 父编号
	private BigDecimal parentId;
	// 父编号列表
	private String parentIds;
	// 资源路径
	private String url;
	// 别名
	private String alias;
	// 类型：0:自维，1：塔维
	private String functionType;

	public BigDecimal getId() {
		return id;
	}

	public void setId(BigDecimal id) {
		this.id = id;
	}

	public String getResourceName() {
		return resourceName;
	}

	public void setResourceName(String resourceName) {
		this.resourceName = resourceName == null ? null : resourceName.trim();
	}

	public String getPermission() {
		return permission;
	}

	public void setPermission(String permission) {
		this.permission = permission == null ? null : permission.trim();
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public BigDecimal getParentId() {
		return parentId;
	}

	public void setParentId(BigDecimal parentId) {
		this.parentId = parentId;
	}

	public String getParentIds() {
		return parentIds;
	}

	public void setParentIds(String parentIds) {
		this.parentIds = parentIds == null ? null : parentIds.trim();
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url == null ? null : url.trim();
	}

	@Override
	public int hashCode() {
		return id != null ? id.hashCode() : 0;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null || getClass() != obj.getClass())
			return false;
		SysResource resource = (SysResource) obj;
		if (id != null ? !id.equals(resource.id) : resource.id != null)
			return false;
		return true;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	@Override
	public String toString() {
		return "SysResource [id=" + id + ", resourceName=" + resourceName + ", permission=" + permission + ", type="
				+ type + ", parentId=" + parentId + ", parentIds=" + parentIds + ", url=" + url + ", alias=" + alias
				+ "]";
	}

	// 判断是否是根节点
	public boolean isRootNode() {
		int compare = parentId.compareTo(new BigDecimal(0));
		return compare == 0;
	}

	public String getFunctionType() {
		return functionType;
	}

	public void setFunctionType(String functionType) {
		this.functionType = functionType;
	}

}