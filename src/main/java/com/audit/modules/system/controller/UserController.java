package com.audit.modules.system.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.EncryptUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.system.entity.SuperAdminConstant;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.service.UserService;
import com.audit.modules.system.service.impl.UserServiceImpl;
import com.google.common.collect.Maps;

/**
 * @Description:系统管理：用户 ——增 删 查 改
 * @author  chentao
 * @date : 2017/3/8
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserService userService;
	
	/**
	 * @Description 通过条件查询用户列表
	 * @param userVo  UserVo对象-查询参数
	 * @param userLevels  0省级、1市、2经办人、3区、4报销发起人、5市领导 ;可以用","拼接如 "0,1"
	 * @return 查询结果json
	 * */
	@RequestMapping(value = "/queryUserByPage")
	@ResponseBody
	public ResultVO queryUserByPage(UserVo userVo, Integer pageNo, Integer pageSize) {

		PageUtil<UserVo> page = new PageUtil<UserVo>();
		
		if (pageNo != null && pageSize != null) {
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		if (userVo != null ) {
			 setMap( userVo, page);
		}
		
		// 默认值 ：
		// page.setPageNo(1); page.setPageSize(20);
		userService.queryUserByPage(page);
		page.setObj("");
		return ResultVO.success(page);
	}
	
	/**   
	 * @Description: 设置查询参数    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(UserVo userVo, PageUtil<UserVo> page) {
		Map<String, String> paramMap = Maps.newHashMap();
		if (userVo.getAccount() != null && !"".equals(userVo.getAccount())) {
			paramMap.put("account", userVo.getAccount());
		}
		if (userVo.getRoleIds() != null && !"".equals(userVo.getRoleIds())) {
			paramMap.put("roleIds", userVo.getRoleIds());
		}
		if (userVo.getEmail() != null && !"".equals(userVo.getEmail())) {
			paramMap.put("email", userVo.getEmail());
		}
		if (userVo.getDepartmentId() != null && !"".equals(userVo.getDepartmentId())) {
			paramMap.put("departmentId", userVo.getDepartmentId());
		}
		if(userVo.getCounty() != null && !userVo.getCounty().equals("")){
			paramMap.put("county", userVo.getCounty()+"");
		}
		if(userVo.getCity() != null && !userVo.getCity().equals("")){
			paramMap.put("city", userVo.getCity() + "");
		}
		String userLevels = null;
		if(userVo.getUserLevel() != null && !"".equals(userVo.getUserLevel())){
			userLevels = ","+ userVo.getUserLevel() +",";
			paramMap.put("userLevels", userLevels);
		}
	
		page.setObj(paramMap);
	}
	/**   
	 * @Description: 根据用户名查询资源权限符
	 * @param : account 用户名      
	 * @return : Set<String> 资源权限符Set
	 * @throws  
	*/
	@RequestMapping(value = "/findPermissions", method = RequestMethod.POST)
	@ResponseBody
	public ResultVO findPermissions(String account) {
		if (null != account) {
			List<String> permissionList = new ArrayList<String>();
			Set<String> permissionSet = userService.findPermissions(account);
			if (null != permissionSet && permissionSet.size() > 0) {
				permissionList.addAll(permissionSet);
			}
			return ResultVO.success(permissionList);
		} else {
			return ResultVO.failed("请传递用户账户");
		}
	}

	/**
	 * @Description  删除选中用户
	 * @param userIds 用户id数组
	 * @return 返回操作状态/信息
	 * */
	@RequestMapping(value = "/deleteById", method = RequestMethod.POST)
	@ResponseBody
	public ResultVO deleteById(String userIds) {
		return userService.deleteById(userIds);
	}

	/**
	 * @Description:添加用户
	 * @param :user UserVo对象
	 * @return :返回操作状态/信息
	 * @throws
	*/
	@RequestMapping(value = "/createUser", method = RequestMethod.POST)
	@ResponseBody
	public ResultVO createUser(UserVo user) {
		ResultVO resultVO = null;
		UserVo userVo = null;
		String account = null;
		String userId = null;
		String[] roleIds = null;
		if (user != null) {
			account = user.getAccount();
			roleIds = user.getRoleIds().split(",");
			user.setPassword(EncryptUtil.encryptSha256(UserServiceImpl.DEFAULT_USER_PASSWARD));
		}
		resultVO = userService.addUser(user);
		if (resultVO.getCode() == 200 && null != account && null != roleIds && null != roleIds && roleIds.length > 0) {
			userVo = userService.queryUserVoByAccount(user.getAccount());
			userId = userVo.getUserId();
			resultVO = userService.updateUserPermission(userId, roleIds, user);
		}
		return resultVO;
	}

	/**
	 * @Description:更新用户
	 * @param :user UserVo对象
	 * @return :返回操作状态/信息
	*/
	@RequestMapping(value = "/updateUser", method = RequestMethod.POST)
	@ResponseBody
	public ResultVO updateUser(UserVo user) {
		Log.info(user.getUserName());
		Log.info(JsonUtil.toJson(user)+"");
		ResultVO resultVo = null;
		String userId = user.getUserId();
		List<String> oldRoleIds = userService.queryRoleIdsByUserId(userId);
		Subject subject = SecurityUtils.getSubject();
		if(null != oldRoleIds && oldRoleIds.contains(SuperAdminConstant.SUPERADMIN_ROLE_ID) 
				&& !subject.hasRole(SuperAdminConstant.SUPERADMIN_ROLE_NAME)){
			return ResultVO.failed("超级管理员用户，不允许修改");
		}
		String[] roleIds = user.getRoleIds().split(",");
		if(null != roleIds) {
			resultVo = userService.updateUserPermission(user.getUserId(), roleIds,user);
		}
		resultVo = userService.updateUser(user);
		return resultVo;
	}
	
	/**
	 * @Description:更新用户密码
	 * @param :user UserVo对象
	 * @return :返回操作状态/信息
	*/
	@RequestMapping(value = "/updateUserWord", method = RequestMethod.GET)
	@ResponseBody
	public ResultVO updateUserWord(String name, String word) {
		Subject subject = SecurityUtils.getSubject();
		if(!subject.hasRole(SuperAdminConstant.SUPERADMIN_ROLE_NAME)){
			return ResultVO.failed("无操作权限");
		}
		if(name == null || word == null || word.equals("")){
			return ResultVO.failed("参数错误");
		}
		UserVo user = userService.queryUserVoByAccount(name);
		if (user == null) {
			return ResultVO.failed("用户名未找到");// 没找到帐号
		}
		String userId = user.getUserId();
		List<String> oldRoleIds = userService.queryRoleIdsByUserId(userId);
		if(null != oldRoleIds && !oldRoleIds.contains(SuperAdminConstant.SUPERADMIN_ROLE_ID)){
			return ResultVO.failed("非超级管理员用户，无法修改密码");
		}
		user.setPassword(EncryptUtil.encryptSha256(word));
		ResultVO resultVo = userService.updateUser(user);
		return resultVo;
	}

	/**
	 * @Description: 根据账号 查询用户信息OA
	 * @param :account 用户名
	 * @return :ResultVO
	 * 新增前调用
	*/
	@RequestMapping(value = "/queryByAccountInOA")
	@ResponseBody
	public ResultVO queryByAccountInOA(String account) {
		return userService.queryByAccountInOA(account);
	}

	/**
	 * @Description: 根据账号 查询用户信息
	 * @param :account 用户名
	 * @return :ResultVO
	 * 查看/修改 前调用
	*/
	@RequestMapping(value = "/queryUserByAccount")
	@ResponseBody
	public ResultVO queryUserByAccount(String account) {
		return userService.queryUserByAccount(account);
	}
	
	/**
	 * @Description: 根据用户Id 查询用户信息
	 * @param :account 用户名
	 * @return :ResultVO
	 * 查看/修改 前调用
	*/
	@RequestMapping(value = "/queryUserByUserId")
	@ResponseBody
	public ResultVO queryUserByUserId(String userId) {
		return userService.queryUserByUserId(userId);
	}

	/**
	 * @Description: 更新用户-角色信息
	 * @param :userId 用户id
	 * @param :roleIds 角色id
	 * @return :ResultVO
	*/
	@RequestMapping(value = "/updateUserPermission")
	@ResponseBody
	public ResultVO updateUserPermission(String userId, String roleIds) {
		String[] roleids = null;
		if(null != roleIds){
			roleids = roleIds.split(",");
		}
		return userService.updateUserPermission(userId, roleids,null);
	}

	/**
	 * @Description: 查询用户-角色信息
	 * @param :account 账号
	 * @return :ResultVO
	*/
	@RequestMapping(value = "/showPermissionlist")
	@ResponseBody
	public ResultVO showPermissionlist(String account) {
		return userService.showPermissionlist(account);
	}

}
