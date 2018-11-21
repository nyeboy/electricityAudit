package com.audit.modules.system.entity;

/**   
 * @Description : 用户角色
 *
 * @author : 陈涛
 * @date : 2017年4月6日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class AccountShiftVO {
	
    //页面搜索条件
    private String cityId;//地市ID
    private String countyId;//区县ID	
	private String roleId;//角色id	
	private String userName;//用户名
	
	//页面展示
    private String areas;//地市
    private String counties;//区县	
	private String roleName;//角色名
	private String account;//账号(登录名)
	
	public String getCityId() {
		return cityId;
	}
	public void setCityId(String cityId) {
		this.cityId = cityId;
	}
	public String getCountyId() {
		return countyId;
	}
	public void setCountyId(String countyId) {
		this.countyId = countyId;
	}
	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getAreas() {
		return areas;
	}
	public void setAreas(String areas) {
		this.areas = areas;
	}
	public String getCounties() {
		return counties;
	}
	public void setCounties(String counties) {
		this.counties = counties;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
		
}
