package com.audit.modules.system.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.system.entity.AccountShiftVO;
import com.audit.modules.system.entity.SysUserRole;
import com.audit.modules.system.entity.UserVo;

/**
 * @author issuser
 *	用户操作dao
 *	返回状态 未实现!!!
 */
@Component
@MybatisRepostiory
public interface UserDao {
	//查询角色
	List<SysUserRole> roleSelect();
		
	//获取用户列表
	List<AccountShiftVO> userSelect(@Param("map") Map<String, Object> map);
	
	Long userSelectCount(@Param("map")Map<String, Object> map);

	// 查询所有用户信息（可条件）
	List<UserVo> queryUserByPage(PageUtil<UserVo> page);

	// 删除选中
	void deleteById(String[] ids);

	// 添加用户
	void addUser(UserVo user);

	// 修改用户信息
	void updateUser(UserVo user);

	// 账号-查询用户
	List<UserVo> queryUserByAccount(@Param("account") String account);
	
	//从移动用户表中查询用户部门oa
	List<UserVo> queryUserByAccountByOA(@Param("account") String account);

	// 添加用户时 从OA获取部分数据渲染
	UserVo queryByAccountInOA(@Param("account") String account);

	// -----权限-----
	// 用户分配角色
	void addUserPermission(@Param("userId") String userId, @Param("roleId") String newStr);

	// 删除用户-角色
	void deleteUserPermission(@Param("userId") String userId, @Param("list") List<String> list);

	// 展示该用户-角色信息
	List<SysUserRole> showPermissionlist(@Param("account") String account);

	// 获取用户拥有的 角色id
	List<String> queryRoleIds(@Param("userId") String userId);

	// 用户Id-查询用户
	UserVo queryUserByUserId(@Param("userId")String userId);

	// 用户Id-查询超级管理员用户数
	Integer checkAdminSupper(@Param("array") String[] array);
	
	public UserVo getUserByUserId(String id);

}
