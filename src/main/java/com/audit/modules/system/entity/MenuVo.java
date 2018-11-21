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
public class MenuVo {

	
	// 资源名称(页面展示)
	private String value;
	// 别名(页面展示)
	private String id;
	// 子资源
	private List<MenuVo> child;
	// icon 图标地址
	private String icon;
	// 小标题组（资源从大到小）
	private List<String> title;

	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public List<MenuVo> getChild() {
		return child;
	}
	public void setChild(List<MenuVo> child) {
		this.child = child;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public List<String> getTitle() {
		return title;
	}
	public void setTitle(List<String> title) {
		this.title = title;
	}
	
}
