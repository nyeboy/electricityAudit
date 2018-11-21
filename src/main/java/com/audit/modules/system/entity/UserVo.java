package com.audit.modules.system.entity;

import java.util.Date;
import java.util.List;

/**
 * @author : chentao
 * @Description : 用户
 * @date : 2017/3/8 Copyright (c) , IsoftStone All Right reserved.
 */
public class UserVo extends UserPo {
	// 用户id
	private String userId;
	// 登录时间
	private Date loginDate;
	// 登录ip
	private String loginIp;
	// 用户名（汉字）
	private String userName;
	// 职位
	private String nickName;
	// 登录密码
	private String password;
	// 用户等级( 0省级、1市级、2经办人、3区县级、4报销发起人、5市领导 ）
	private Integer userLevel;
	// 账户名（字母）
	private String account;
	// 用户类型
	private Integer userType;
	// 省
	private Long province;
	// 市
	private Long city;
	// 县
	private Long county;
	// 邮箱
	private String email;
	// 电话
	private String mobile;
	// 状态 用户状态(0为正常，1为锁定)
	private Integer userStatus;
	// 备注
	private String Remark;
	//是否是超级管理员（"0"是，"1"否）
	private String isSupperAdmin;
	// 创建时间
	private Date createDate;
	// 角色list
	private List<SysRoleVo> roleList;
	// 角色Ids
	private String roleIds;
	// 部门名
	private String departmentName;
	// 部门id
	private String departmentId;
	// 部门num
	private String departmentNo;
	// 部门id总数
	private List<String> departmentIdSum;
	// 部门名总数
	private List<String> departmentNameSum;
	//角色名list
	private List<String> roleNameList;
	//权限list
	private List<String> permissionList;
	//成本中心号
	private String costid;
	
	
	
	public String getCostid() {
		return costid;
	}

	public void setCostid(String costid) {
		this.costid = costid;
	}

	private String companyId;
	
	
	

	public String getCompanyId() {
		return companyId;
	}

	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	public List<String> getDepartmentIdSum() {
		return departmentIdSum;
	}

	public void setDepartmentIdSum(List<String> departmentIdSum) {
		this.departmentIdSum = departmentIdSum;
	}

	public List<String> getDepartmentNameSum() {
		return departmentNameSum;
	}

	public void setDepartmentNameSum(List<String> departmentNameSum) {
		this.departmentNameSum = departmentNameSum;
	}

	public List<String> getRoleNameList() {
		return roleNameList;
	}

	public void setRoleNameList(List<String> roleNameList) {
		this.roleNameList = roleNameList;
	}

	public UserVo() {
		super();
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getLoginDate() {
		return loginDate;
	}

	public void setLoginDate(Date loginDate) {
		this.loginDate = loginDate;
	}

	public String getLoginIp() {
		return loginIp;
	}

	public void setLoginIp(String loginIp) {
		this.loginIp = loginIp;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getUserLevel() {
		return userLevel;
	}

	public void setUserLevel(Integer userLevel) {
		this.userLevel = userLevel;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Integer getUserType() {
		return userType;
	}

	public void setUserType(Integer userType) {
		this.userType = userType;
	}

	public String getIsSupperAdmin() {
		return isSupperAdmin;
	}

	public void setIsSupperAdmin(String isSupperAdmin) {
		this.isSupperAdmin = isSupperAdmin;
	}

	public Long getProvince() {
		return province;
	}

	public void setProvince(Long province) {
		this.province = province;
	}

	public Long getCity() {
		return city;
	}

	public void setCity(Long city) {
		this.city = city;
	}

	public Long getCounty() {
		return county;
	}

	public void setCounty(Long county) {
		this.county = county;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<String> getPermissionList() {
		return permissionList;
	}

	public void setPermissionList(List<String> permissionList) {
		this.permissionList = permissionList;
	}

	public String getMobile() {
		return mobile;
	}

	
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public List<SysRoleVo> getRoleList() {
		return roleList;
	}

	public void setRoleList(List<SysRoleVo> roleList) {
		this.roleList = roleList;
	}

	public Integer getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(Integer userStatus) {
		this.userStatus = userStatus;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getRoleIds() {
		return roleIds;
	}

	public void setRoleIds(String roleIds) {
		this.roleIds = roleIds;
	}

	public String getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}

	public String getDepartmentNo() {
		return departmentNo;
	}

	public void setDepartmentNo(String departmentNo) {
		this.departmentNo = departmentNo;
	}
	
}
