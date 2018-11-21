package com.audit.modules.system.entity;

import java.util.List;

/**
 * 
 * @Description: 菜单视图展示   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月5日 下午7:26:54
 */
public class ResourceVo {
	
	// 资源名称(页面展示)
	private String resourceName;
	// 资源Id
	private String id;
	// 子资源
	private List<ResourceVo> child;
	// 功能type:0：自维，1：塔维
	private String functionType;
	
	
	public String getResourceName() {
		return resourceName;
	}
	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}
	public String getFunctionType() {
		return functionType;
	}
	public void setFunctionType(String functionType) {
		this.functionType = functionType;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public List<ResourceVo> getChild() {
		return child;
	}
	public void setChild(List<ResourceVo> child) {
		this.child = child;
	}
}
