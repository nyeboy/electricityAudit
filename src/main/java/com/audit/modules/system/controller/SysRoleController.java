package com.audit.modules.system.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SuperAdminConstant;
import com.audit.modules.system.entity.SysResource;
import com.audit.modules.system.entity.SysRoleVo;
import com.audit.modules.system.service.RoleService;

/**   
 * @Description : 系统角色控制器
 *
 * @author : liuyan
 * @date : 2017年3月8日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Controller
@RequestMapping("role")
public class SysRoleController {

	@Autowired
	private RoleService roleService;

	/**
	 * @Description:全部角色列表展示
	 * @param :SysRoleVo对象
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/getRoleList")
	@ResponseBody
	public ResultVO getRoleList() {
		List<SysRoleVo> roleVoList = new ArrayList<SysRoleVo>();
		roleVoList = roleService.getRoleList();
		return ResultVO.success(roleVoList);
	}

	/**
	 * @Description:分页查询角色列表
	 * @param :SysRoleVo对象
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryPageRoleList")
	@ResponseBody
	public ResultVO queryPageRoleList(SysRoleVo sysRoleVo, Integer pageNo, Integer pageSize) {
		PageUtil<SysRoleVo> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		roleService.getPageRoleList(sysRoleVo, pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	/**
	 * @Description:根据角色名查询角色信息
	 * @param :HttpServletRequest request
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryRoleByRoleName")
	@ResponseBody
	public ResultVO queryRoleByRoleName(HttpServletRequest request) {
		
		String roleName = request.getParameter("roleName");// 获取角色名
		List<SysRoleVo> resultVoList = new ArrayList<SysRoleVo>();
		if (roleName != null) {
			resultVoList = roleService.getRoleListByRoleName(roleName);
			return ResultVO.success(resultVoList);
		} else {
			return ResultVO.failed("角色名未输入");
		}
	}

	/**
	 * @Description:根据角色Id查询角色信息和角色权限
	 * @param :HttpServletRequest request
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryRoleByRoleId")
	@ResponseBody
	public ResultVO queryRoleByRoleId(HttpServletRequest request) {
		String roleId = request.getParameter("roleId");// 获取角色Id
		SysRoleVo sysRoleVo = null;
		if (roleId != null) {
			sysRoleVo = roleService.getRoleByRoleId(Integer.valueOf(roleId));
			if (sysRoleVo != null) {
				return ResultVO.success(sysRoleVo);
			}
		}
		return ResultVO.failed("角色名错误");
	}

	/**
	 * @Description:修改角色信息
	 * @param :HttpServletRequest request
	 * @return :ResultVO返回操作状态/信息
	 * @throws :Exception
	*/

	@RequestMapping("/updateRole")
	@ResponseBody
	public ResultVO updateRole(HttpServletRequest request) {
		Integer roleid = null;
		Integer rolelevel = null;
		List<Integer> resourceIdList = null;
		String[] resourceIdArray = null;
		String roleId = request.getParameter("roleId");
		String isSystem = request.getParameter("isSystem");
		String roleName = request.getParameter("roleName");
		String description = request.getParameter("description");
		String roleLevel = request.getParameter("roleLevel");
		String resourceIds = request.getParameter("resourceIds");
		if(null != roleId && !roleId.equals("")){
			roleid = Integer.valueOf(roleId);
			if(roleid == 180){
				return ResultVO.failed("超级管理员角色不允许修改。");
			}
		}
		if(null != roleLevel && !roleLevel.equals("")){
			rolelevel = Integer.valueOf(roleLevel);
		}
		Subject subject = SecurityUtils.getSubject();
		// 系统内置角色(IsSystem为1)不允许修改 ,如果用户是超级管理员则可以修改
		if (null != isSystem && roleid !=null && !isSystem.equals("")
				&& (!isSystem.equals("1") && !subject.hasRole(SuperAdminConstant.SUPERADMIN_ROLE_NAME))) {
			roleService.updateRole(roleid, roleName, description, rolelevel, Integer.valueOf(isSystem));
			if(null != resourceIds) {
				resourceIdArray = resourceIds.split(",");
				resourceIdList = new ArrayList<Integer>();
				for (String resourceId : resourceIdArray) {
					if (!resourceId.equals("")) {
						resourceIdList.add(new Integer(resourceId));
					}
				}
				roleService.updateRoleResource(Integer.valueOf(roleId), resourceIdList);
			}
			return ResultVO.success();
		} else {
			return ResultVO.failed("系统内置角色不允许修改");
		}

	}

	/**   
	 * @Description: 根据角色Id查询权限资源  
	 * @param : roleId 角色Id    
	 * @return :ResultVO   
	 * @throws  
	*/
	@RequestMapping("/findResourceByRoleId")
	@ResponseBody
	public ResultVO findResourceByRoleId(HttpServletRequest request) {
		Integer roleId = null;
		String roleid = request.getParameter("roleId");
		if (null != roleid && !roleid.equals("") && Integer.valueOf(roleid) != null) {
			roleId = Integer.valueOf(roleid);
			List<SysResource> syeResourceList = new ArrayList<SysResource>();
			syeResourceList = roleService.findResourceByRoleId(roleId);
			return ResultVO.success(syeResourceList);
		} else {
			return ResultVO.failed("参数错误");
		}
	}

	/**   
	 * @Description: 修改角色的的资源权限
	 * @param :Integer roleId
	 * @param :List<Integer> resourceId      
	 * @return : ResultVO    
	 * @throws  
	*/
	@RequestMapping("/updateRoleResource")
	@ResponseBody
	public ResultVO updateRoleResource(HttpServletRequest request) {
		String roleId = request.getParameter("roleId");
		String resourceIds = request.getParameter("resourceIds");
		Integer roleid = null;
		List<Integer> resourceIdList = null;
		String[] resourceIdArray = null;
		if (null == roleId || null == resourceIds) {
			return ResultVO.failed("参数错误");
		}
		if (!roleId.equals("")) {
			roleid = new Integer(roleId);
		}
		resourceIdArray = resourceIds.split(","); 
		resourceIdList = new ArrayList<Integer>();
		
		for (String resourceId : resourceIdArray) {
			if (!resourceId.equals("")) {
				resourceIdList.add(new Integer(resourceId));
			}
		}
		if (null != roleid) {
			roleService.updateRoleResource(roleid, resourceIdList);
			return ResultVO.success();
		} else {
			return ResultVO.failed("参数错误");
		}
	}

	/**   
	 * @Description: 根据角色ID删除角色 
	 * @param :Integer roleId 角色Id       
	 * @return :ResultVO     
	 * @throws  
	*/
	@RequestMapping("/deleteRoleByIds")
	@ResponseBody
	public ResultVO deleteRoleByIds(HttpServletRequest request) {
		String roleIds = request.getParameter("roleIds");
		if (null != roleIds && !roleIds.equals("") ) {
			String[] roleIdArray = roleIds.split(",");
			for(String roleId : roleIdArray){
				if(roleId.equals(SuperAdminConstant.SUPERADMIN_ROLE_ID)){
					return ResultVO.failed("包含超级管理员角色，不允许删除");
				}
			}
			roleService.removeRoleByIds(roleIds);
			return ResultVO.success();
		} else {
			return ResultVO.failed("参数错误");
		}
	}

	/**
	 * @Description:新增角色信息
	 * @param :HttpServletRequest request
	 * @return :ResultVO返回操作状态/信息
	 * @throws :Exception
	*/
	@RequestMapping("/createRole")
	@ResponseBody
	public ResultVO createRole(HttpServletRequest request) {
		ResultVO resultVO = null;
		SysRoleVo roleVo = new SysRoleVo();
		Integer roleid = null;
		List<Integer> resourceIdList = null;
		String isSystem = request.getParameter("isSystem");
		String roleName = request.getParameter("roleName");
		String description = request.getParameter("description");
		String roleLevel = request.getParameter("roleLevel");
		String resourceIds = request.getParameter("resourceIds");
		
		String[] resourceIdArray = null;
		if (null != roleName && !roleName.equals("") && null != isSystem && !isSystem.equals("")) {
			roleVo.setRoleName(roleName);
			roleVo.setIsSystem(Integer.valueOf(isSystem));
			if (null != roleLevel && !roleLevel.equals("")) {
				roleVo.setRoleLevel(Integer.valueOf(roleLevel));
			}
			if (null != description && !description.equals("")) {
				roleVo.setDescription(description);
			}
			roleVo.setCreateDate(new Date());
			roleVo.setUpdateDate(new Date());
			roleService.addRole(roleVo);
		}
		List<SysRoleVo> resultVoList = roleService.getRoleListByRoleName(roleName);
		if(null != resultVoList && resultVoList.size() > 0  && null != resourceIds){
			roleVo = resultVoList.get(0);
			roleid = roleVo.getRoleId();
			resourceIdList = new ArrayList<Integer>();
			resourceIdArray = resourceIds.split(",");
			for (String resourceId : resourceIdArray) {
				if (!resourceId.equals("")) {
					resourceIdList.add(new Integer(resourceId));
				}
			}
			if (null != roleid) {
				roleService.updateRoleResource(roleid, resourceIdList);
				resultVO = ResultVO.success();
			} 
		}
		if(null == resultVO){
			resultVO = ResultVO.failed("参数错误");
		}
		return resultVO;
	}
}
