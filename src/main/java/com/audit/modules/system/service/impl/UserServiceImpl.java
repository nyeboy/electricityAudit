package com.audit.modules.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.EncryptUtil;
import com.audit.modules.common.utils.GlobalUitl;
import com.audit.modules.common.utils.Log;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.system.dao.SysResourceDao;
import com.audit.modules.system.dao.SysRoleDao;
import com.audit.modules.system.dao.UserDao;
import com.audit.modules.system.entity.AccountShiftVO;
import com.audit.modules.system.entity.SuperAdminConstant;
import com.audit.modules.system.entity.SysResource;
import com.audit.modules.system.entity.SysRoleVo;
import com.audit.modules.system.entity.SysUserRole;
import com.audit.modules.system.entity.UserLevelConstant;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.service.UserService;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**
 * @author : chentao
 * @Description : 用户
 * @date : 2017/3/8
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;
	@Autowired
	private SysRoleDao sysRoleDao;
	/**用户默认密码*/
	public static final String DEFAULT_USER_PASSWARD = "123456";

	@Autowired
	private SysResourceDao sysResourceDao;

	/**
	* @Description: 查询所有（可选条件）
	* @param :page 查询参数
	* @return :UserVO
	*/
	@Override
	public List<UserVo> queryUserByPage(PageUtil<UserVo> page) {
		UserVo user = new UserVo();
		user.setLoginDate(new Date());
		List<UserVo> userList = userDao.queryUserByPage(page);
		if (userList != null && userList.size() > 0) {
			for (UserVo userVo : userList) {
				if (null != user.getUserStatus()) {
					if (userVo.getUserStatus() == 0) {
						userVo.setUserStatusStr("正常");
					} else {
						userVo.setUserStatusStr("锁定");
					}
				}
			}
		}
		return userList;
	}

	/**
	 * @Description: 验证用户是否具有这些等级（可选多个等级）
	 * @param :
	 * @return :
	 */
	@Override
	public boolean checkUserLevel(String userId, String userLevels) {
		boolean hasUserLevel = false;
		if (userLevels == null || userLevels.equals("")) {
			return hasUserLevel;
		}
		if (userId == null || userId.equals("")) {
			UserVo uservo = GlobalUitl.getLoginUser();
			userId = uservo.getUserId();
		}
		if (userId == null) {
			return hasUserLevel;
		}
		String[] userLevelArray = userLevels.split(",");
		List<SysRoleVo> sysRoleList = sysRoleDao.queryRoleByUserId(userId);
		if (sysRoleList != null && sysRoleList.size() > 0) {
			return hasUserLevel;
		}
		for (SysRoleVo sysRoleVo : sysRoleList) {
			String roleLevel = sysRoleVo.getRoleLevel() + "";
			if (userLevelArray != null && roleLevel != null && !roleLevel.equals("")) {
				for (String userLevel : userLevelArray) {
					if (userLevel.equals(roleLevel)) {
						return true;
					}
				}
			}
		}
		return hasUserLevel;
	}

	/**
	 * 验证用户是否具有这些等级（可选多个等级）
	 * 
	 * @param userLevels 用户层级
	 * @return true:有 false:没有
	 */
	@Override
	public boolean checkUserLevel(String userLevels) {
		return checkUserLevel((String) null, userLevels);
	}

	/**
	 * @Description: 删除所选用户
	 * @param :userIds 用户id数组对象
	 * @return :返回操作状态/信息
	 * @throws
	*/
	@Override
	public ResultVO deleteById(String userIds) {

		if (userIds != null && !userIds.equals("")) {
			Subject subject = SecurityUtils.getSubject();
			String[] userId = userIds.split(",");
			if (!subject.hasRole(SuperAdminConstant.SUPERADMIN_ROLE_NAME) && checkAdminSupper(userId)) {
				return ResultVO.failed("包含超级管理员账户，不允许删除");
			}
			userDao.deleteById(userId);
			return ResultVO.success();
		}
		return ResultVO.failed("请勾选用户！");
	}

	/**   
	 * @Description: 验证是否是超级管理员角色  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private boolean checkAdminSupper(String[] userId) {
		Integer num = userDao.checkAdminSupper(userId);
		if (num > 0) {
			return true;
		}
		return false;
	}

	/**
	 * @Description:添加用户
	 * @param :user UserVo对象
	 * @return :ResultVO 返回操作状态/信息
	 * @throws
	*/
	@Override
	public ResultVO addUser(UserVo user) {

		if (user != null) {
			String account = user.getAccount();
			UserVo userPre = queryUserVoByAccount(account);
			if (null != userPre) {
				return ResultVO.failed("用户名已存在！");
			}
			user.setCreateDate(new Date());
			user.setPassword(EncryptUtil.encryptSha256("123456"));
			userDao.addUser(user);
			return ResultVO.success();
		}
		return ResultVO.failed("添加失败！");
	}

	/**
	 * @Description:更新用户(userId 必填)
	 * @param :user UserVo对象
	 * @return :ResultVO 返回操作状态/信息
	 *  
	*/
	@Override
	public ResultVO updateUser(UserVo user) {

		if (user != null) {
			userDao.updateUser(user);
			return ResultVO.success();
		}
		return ResultVO.failed("修改失败！");
	}

	/**   
	 * @Description: 根据用户名查询资源权限符
	 * @param : account 用户名      
	 * @return : Set<String> 资源权限符Set
	 * @throws  
	*/
	@Override
	public Set<String> findPermissions(String account) {
		Set<String> permissionSet = new HashSet<String>();
		List<SysResource> sysResourceList = new ArrayList<SysResource>();
		List<Integer> roleIdList = new ArrayList<Integer>();
		List<Integer> resourceIdList = new ArrayList<Integer>();
		String permission = null;

		// 根据用户名查角色Id
		List<SysUserRole> userRoleList = userDao.showPermissionlist(account);

		if (null != userRoleList) {
			for (SysUserRole sysUserRole : userRoleList) {
				String roleId = sysUserRole.getRoleId();
				roleIdList.add(new Integer(roleId));
			}
			if (roleIdList.size() > 0) {
				// 通过角色IdList 查询资源IdList
				resourceIdList = sysResourceDao.selectIdByRoleIdList(roleIdList);
			}
			if (resourceIdList.size() > 0) {
				// 根据resourceIdList 查询资源
				sysResourceList = sysResourceDao.selectByResourceIdList(resourceIdList);
			}
			if (sysResourceList.size() > 0) {
				for (SysResource sysResource : sysResourceList) {
					permission = sysResource.getPermission();
					permissionSet.add(permission);
				}
			}
		}
		return permissionSet;
	}

	/**
	 * @Description: 根据根据账号 查询用户信息OA表
	 * @param :account 用户名
	 * @return :ResultVO
	*/
	@Override
	public ResultVO queryByAccountInOA(String account) {
		if (account != null && !account.equals("")) {
			List<UserVo> userVoList = userDao.queryUserByAccount(account);
			if (null != userVoList && userVoList.size() > 0) {
				return ResultVO.failed("用户在系统内已存在，请修改");
			}
			UserVo userVo = userDao.queryByAccountInOA(account);
			return ResultVO.success(userVo);
		}
		return ResultVO.failed("账号不存在-查询失败");
	}

	/**
	 * @Description: 根据根据账号 查询用户信息sys_user
	 * @param :account 用户名
	 * @return :ResultVO
	*/
	@Override
	public ResultVO queryUserByAccount(String account) {
		if (account != null && !account.equals("")) {
			List<UserVo> userVoList = userDao.queryUserByAccount(account);
			UserVo userVo = userVoList.get(0);
			if (userVo.getUserStatus() == 0) {
				userVo.setUserStatusStr("正常");
			} else {
				userVo.setUserStatusStr("锁定");
			}
			return ResultVO.success(userVo);
		}
		return ResultVO.failed("查询失败");
	}

	/**
	 * @Description: 查询用户-角色信息
	 * @param :userId 用户id
	 * @return :ResultVO
	*/
	@Override
	public ResultVO showPermissionlist(String account) {
		if (account != null && !account.equals("")) {
			List<SysUserRole> list = userDao.showPermissionlist(account);
			return ResultVO.success(list);
		}
		return ResultVO.failed("查询失败");
	}

	/**   
	 * @Description: 根据用户名查询角色信息  
	 * @param : username 用户账户  
	 * @return :Set<String> 角色名称    
	 * @throws  
	*/
	@Override
	public Set<String> queryRoleNameByAccount(String username) {
		Set<String> roleNameSet = new HashSet<String>();
		List<SysUserRole> sysResourceList = new ArrayList<SysUserRole>();
		sysResourceList = userDao.showPermissionlist(username);
		for (SysUserRole sysUserRole : sysResourceList) {
			String roleName = sysUserRole.getRoleName();
			roleNameSet.add(roleName);
		}
		return roleNameSet;
	}

	/**
	 * @Description: 更新用户-角色信息
	 * @param :userId 用户id
	 * @return :ResultVO
	*/
	public ResultVO updateUserPermission(String userId, String[] roleIds, UserVo user) {
		// 现有的权限id
		List<String> oldRoleId = userDao.queryRoleIds(userId);
		// 需要删除的权限id
		List<String> removeRoleId = new ArrayList<>();

		if (roleIds != null && roleIds.length > 0) {
			List<String> list = Arrays.asList(roleIds);
			for (String newStr : list) {
				if (!oldRoleId.contains(newStr) && null != newStr && !newStr.equals("")) {
					// 添加用户-角色权限
					userDao.addUserPermission(userId, newStr);
					if (newStr.equals(SuperAdminConstant.SUPERADMIN_ROLE_ID)) {
						Subject subject = SecurityUtils.getSubject();
						if (!subject.hasRole(SuperAdminConstant.SUPERADMIN_ROLE_NAME)) {
							return ResultVO.failed("超级管理员不允许普通用户操作");
						}
						if (user != null) {
							user.setPassword(EncryptUtil.encryptSha256(DEFAULT_USER_PASSWARD));
						}
					}
				}
			}
			for (String oldStr : oldRoleId) {
				if (!list.contains(oldStr) && null != oldStr && !oldStr.equals("")) {
					removeRoleId.add(oldStr);
				}
			}
			// 删除用户-角色权限
			if (removeRoleId.size() > 0) {
				userDao.deleteUserPermission(userId, removeRoleId);
			}
			return ResultVO.success();
		}
		return ResultVO.failed("更新失败");
	}

	/**   
	 * @Description: 根据用户名查询用户详情  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public UserVo queryUserVoByAccountDetail(String account) {
		UserVo userVo = null;
		UserVo userVo2 = null;
		List<UserVo> userVoList = userDao.queryUserByAccount(account);
		//从移动员工表中查询部门信息（oa)
		List<UserVo> userVoList2 = userDao.queryUserByAccountByOA(account);
	
		if (userVoList.size() > 0) {
			userVo = userVoList.get(0);
			
		}
		//System.out.println(userVo.getCity()+"==="+userVo.getCounty());
		if (null != userVo) {
			//设置部门信息
			List<String> departmentId = new ArrayList<>();//部门ID
			List<String> departmentName = new ArrayList<>();//部门ID
			if(userVoList2.size() > 0) {
				userVo.setDepartmentNo(userVoList2.get(0).getDepartmentNo());
				for (UserVo userVoList1 : userVoList2) {
					departmentId.add(userVoList1.getDepartmentId());
					departmentName.add(userVoList1.getDepartmentName());
				}
			}
			userVo.setDepartmentIdSum(departmentId);//所有的部门id
			userVo.setDepartmentNameSum(departmentName);//所有的部门名
			// 查询设置用户的信息
			StringBuffer roleIdBuffer = new StringBuffer();
			Set<String> roleNameSet = new HashSet<String>();
			List<SysUserRole> sysResourceList = new ArrayList<SysUserRole>();//角色信息
			sysResourceList = userDao.showPermissionlist(account);
			for (SysUserRole sysUserRole : sysResourceList) {
				String roleName = sysUserRole.getRoleName();
				String roleId = sysUserRole.getRoleId();
				roleNameSet.add(roleName);
				roleIdBuffer.append(roleId);
				roleIdBuffer.append(",");
			}
			Set<String> permissionSet = findPermissions(account);
			userVo.setRoleNameList(new ArrayList<String>(roleNameSet));
			userVo.setPermissionList(new ArrayList<String>(permissionSet));
			userVo.setRoleIds(new String(roleIdBuffer));
			String userId = userVo.getUserId();
			String userLev = queryUserLevByUserId(userId);
			Log.info(userLev + "userLevel");
			userVo.setUserLevel(Integer.valueOf(userLev));
		}
		return userVo;
	}

	/**   
	 * @Description: 根据用户名查询用户信息  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public UserVo queryUserVoByAccount(String account) {
		UserVo userVo = null;
		List<UserVo> userVoList = userDao.queryUserByAccount(account);
		if (userVoList.size() > 0) {
			userVo = userVoList.get(0);
		}
		return userVo;
	}

	/**   
	 * @Description: 根据用户Id查询用户信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public ResultVO queryUserByUserId(String userId) {
		UserVo userVo = new UserVo();
		userVo = userDao.queryUserByUserId(userId);
		List<String> roleIds = userDao.queryRoleIds(userId);
		userVo.setRoleIds(String.join(",", roleIds));
		return ResultVO.success(userVo);
	}

	/**   
	 * @Description: 根据用户Id查询角色Id
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public List<String> queryRoleIdsByUserId(String userId) {
		List<String> roleIds = userDao.queryRoleIds(userId);
		return roleIds;
	}

	/**   
	 * @Description: 通过用户Id查询用户等级  
	 * @param :   0省级、1市、2经办人、3区、4报销发起人、5市领导         
	 * @return :     
	 * @throws  
	*/
	@Override
	public String queryUserLevByUserId(String userId) {
		String userLev = "";
		Integer roleLevel = null;
		List<SysRoleVo> sysRoleList = sysRoleDao.queryRoleByUserId(userId);
		for (SysRoleVo sysRole : sysRoleList) {
			roleLevel = sysRole.getRoleLevel();
			if (roleLevel != null) {
				// 省级
				if (roleLevel == UserLevelConstant.USER_LEVEL_PROVINCIAL) {
					userLev = UserLevelConstant.USER_LEVEL_PROVINCIAL + "";
					break;
				}
				// 市领导
				if (roleLevel == UserLevelConstant.USER_LEVEL_CITY_LEADERS) {
					userLev = UserLevelConstant.USER_LEVEL_CITY_LEADERS + "";
					continue;
				}
				// 经办人
				if (roleLevel == UserLevelConstant.USER_LEVEL_HANDLER
						&& !userLev.equals(UserLevelConstant.USER_LEVEL_CITY_LEADERS + "")) {
					userLev = UserLevelConstant.USER_LEVEL_HANDLER + "";
					continue;
				}
				// 报销发起人
				if (roleLevel == UserLevelConstant.USER_LEVEL_REIMBURSE
						&& !userLev.equals(UserLevelConstant.USER_LEVEL_CITY_LEADERS + "")
						&& !userLev.equals(UserLevelConstant.USER_LEVEL_HANDLER + "")) {
					userLev = UserLevelConstant.USER_LEVEL_REIMBURSE + "";
					continue;
				}
				// 市级
				if (roleLevel == UserLevelConstant.USER_LEVEL_MUNICIPAL
						&& !userLev.equals(UserLevelConstant.USER_LEVEL_CITY_LEADERS + "")
						&& !userLev.equals(UserLevelConstant.USER_LEVEL_HANDLER + "")
						&& !userLev.equals(UserLevelConstant.USER_LEVEL_REIMBURSE + "")) {
					userLev = UserLevelConstant.USER_LEVEL_MUNICIPAL + "";
					continue;
				}
				// 区县级
				if (roleLevel == UserLevelConstant.USER_LEVEL_COUNTY && userLev.equals("")) {
					userLev = UserLevelConstant.USER_LEVEL_COUNTY + "";
				}
			}

		}
		if (userLev.equals("")) {
			userLev = UserLevelConstant.USER_LEVEL_COUNTY + "";
		}
		return userLev;
	}

	@Override
	public List<SysUserRole> roleSelect() {
		List<SysUserRole> list=userDao.roleSelect();
		return list;
	}
	
	/**
	 * @param :serialNumber 流水号  accountName 报站点名称
	 * @return :
	 * @throws
	 * @Description: 获取电费列表信息
	 */
	@Override
	public void userSelect(PageUtil<AccountShiftVO> page, AccountShiftVO accountShift) {
		Map<String, Object> map = Maps.newHashMap();
		setParamterMap(page, accountShift, map);
		List<AccountShiftVO> accountShiftVOs = userDao.userSelect(map);
		page.setTotalRecord(userDao.userSelectCount(map));
		page.setResults(accountShiftVOs);

	}
	
	// 设置参数
	private void setParamterMap(PageUtil<AccountShiftVO> page, AccountShiftVO accountShift, Map<String, Object> map) {
		map.put("cityId", accountShift.getCityId() == null ? "" : accountShift.getCityId());
		map.put("countyId", accountShift.getCountyId() == null ? "" : accountShift.getCountyId());
		map.put("roleId", accountShift.getRoleId() == null ? "" : accountShift.getRoleId());
		map.put("userName", accountShift.getUserName() == null ? "" : accountShift.getUserName());
		map.put("pageSize",page.getPageSize()*page.getPageNo());
		map.put("pageNo",(page.getPageNo()-1)*page.getPageSize());
		page.setObj(map);
	}

	@Override
	public UserVo getUserByUserId(String id) {
		UserVo userByUserId = userDao.getUserByUserId(id);
		return userByUserId;
	}
	
}
