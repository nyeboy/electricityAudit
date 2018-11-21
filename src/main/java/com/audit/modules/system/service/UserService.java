package com.audit.modules.system.service;

import java.util.List;
import java.util.Set;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.system.entity.AccountShiftVO;
import com.audit.modules.system.entity.SysUserRole;
import com.audit.modules.system.entity.UserVo;
/**
 * 
 * @Description: 用户service   
 * @throws  
 * 
 * @date 2017年4月8日 下午2:57:32
 */
public interface UserService {
	//查询角色
	List<SysUserRole> roleSelect();
	
	//获取用户列表
	void userSelect(PageUtil<AccountShiftVO> page, AccountShiftVO accountShift);

	// 查询所有用户信息（可条件）
	List<UserVo> queryUserByPage(PageUtil<UserVo> page);

	// 删除选中
	ResultVO deleteById(String userIds);

	// 添加用户
	ResultVO addUser(UserVo user);

	// 修改用户信息
	ResultVO updateUser(UserVo user);

	// 根据用户名查询资源权限符
	Set<String> findPermissions(String account);
	
	//根据账号查询用户信息OA表
	ResultVO queryByAccountInOA(String account);
	
	// 账号-查询用户
	ResultVO queryUserByAccount(String account);
	
	//展示该用户-角色信息
	ResultVO showPermissionlist(String account);

	//更新用户-角色信息
	ResultVO updateUserPermission(String userId, String[] roleIds, UserVo user);

	//根据用户名查询角色名称
	Set<String> queryRoleNameByAccount(String username);

	// 根据用户名查询用户信息
	UserVo queryUserVoByAccount(String username);

	//根据用户Id查询用户信息
	ResultVO queryUserByUserId(String userId);

	//通过用户Id查询用户等级
	String queryUserLevByUserId(String userId);

	/**   
	 * @Description: 根据用户名查询用户详细信息  
	*/
	UserVo queryUserVoByAccountDetail(String account);

	/**   
	 * @Description: 根据用户Id查询角色Id
	*/
	List<String> queryRoleIdsByUserId(String userId);

	/**   
	 * @Description:  验证用户是否具有这些等级（可选多个等级）  
	*/
	boolean checkUserLevel(String userId, String userLevels);

	/**
	 * 验证用户是否具有这些等级（可选多个等级）
	 * 
	 * @param userLevels 用户登录
	 * @return true:有 false:没有
	 */
	boolean checkUserLevel(String userLevels);
	
	public UserVo getUserByUserId(String id);
}
