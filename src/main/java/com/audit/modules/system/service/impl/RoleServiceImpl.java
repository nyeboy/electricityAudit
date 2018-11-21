package com.audit.modules.system.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.dao.SysResourceDao;
import com.audit.modules.system.dao.SysRoleDao;
import com.audit.modules.system.dao.SysRoleResourceDao;
import com.audit.modules.system.entity.SuperAdminConstant;
import com.audit.modules.system.entity.SysResource;
import com.audit.modules.system.entity.SysRoleResource;
import com.audit.modules.system.entity.SysRoleVo;
import com.audit.modules.system.service.RoleService;
import com.google.common.collect.Maps;

/**   
 * @Description : 角色service实现类   
 *
 * @author : liuyan
 * @date : 2017年3月9日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
	private SysRoleDao sysRoleDao;

	@Autowired
	private SysResourceDao sysResourceDao;

	@Autowired
	private SysRoleResourceDao sysRoleResourceDao;

	/**
	 * @Description: 查询所有角色信息列表
	 * @param :SysRoleVo sysrole
	 * @return :List<SysRoleVo>
	*/
	@Override
	public List<SysRoleVo> getRoleList() {
		Subject subject = SecurityUtils.getSubject();
		String supAdminTag = null;
		if(subject.hasRole(SuperAdminConstant.SUPERADMIN_ROLE_NAME)){
			supAdminTag = "1";
		}
		return sysRoleDao.getRoleList(supAdminTag);
	}

	/**
	 * @Description: 根据角色名查询角色信息
	 * @param :roleName
	 * @return :list
	*/
	@Override
	public List<SysRoleVo> getRoleListByRoleName(String roleName) {
		List<SysRoleVo> sysRoleVoList = sysRoleDao.getRoleListByRoleName(roleName);
		/*
		 * if (null != sysRoleVoList) { for (SysRoleVo role : sysRoleVoList) {
		 * roleid = role.getRoleId(); List<SysResource> resourceList =
		 * sysResourceDao.selectByRoleId(roleid); if (null != resourceList) {
		 * role.setResourceList(resourceList); } } }
		 */
		return sysRoleVoList;
	}

	/**
	 * @Description: 根据角色Id查询角色信息
	 * @param :roleId
	 * @return :list
	*/
	@Override
	public SysRoleVo getRoleByRoleId(Integer roleId) {
		SysRoleVo sysRoleVo = null;
		List<SysRoleVo> sysRoleVoList = sysRoleDao.getRoleListByRoleId(roleId);
		List<SysResource> resourceList = sysResourceDao.selectByRoleId(roleId);
		if (null != sysRoleVoList && sysRoleVoList.size() > 0) {
			sysRoleVo = sysRoleVoList.get(0);
			if (null != resourceList) {
				sysRoleVo.setResourceList(resourceList);
			}
		}
		return sysRoleVo;
	}

	/**
	 * @param isSystem 
	 * @Description: 修改角色信息
	 * @param :Integer roleId
	 * @param :String roleName
	 * @param :String description
	 * @param :Integer roleLevel
	 * @return
	*/
	@Override
	public void updateRole(Integer roleId, String roleName, String description, Integer roleLevel, Integer isSystem) {
		SysRoleVo sysrole = new SysRoleVo();
		sysrole.setRoleId(roleId);
		sysrole.setRoleName(roleName);
		sysrole.setDescription(description);
		sysrole.setRoleLevel(roleLevel);
		sysrole.setUpdateDate(new Date());
		sysrole.setIsSystem(isSystem);
		sysRoleDao.updateRole(sysrole);
	}

	/**   
	 * @Description: 修改角色的的资源权限
	 * @param :Integer roleId
	 * @param :List<Integer> resourceId  
	 * 设置 不进行删除的资源权限    
	 * @return :     
	 * @throws  
	*/
	@Override
	public void updateRoleResource(Integer roleId, List<Integer> resourceIdList) {
		// 现有的资源权限
		List<Integer> oldResIdList = sysResourceDao.selectIdByRoleId(roleId);
		// 需要添加的资源权限
		List<Integer> addResourceIdList = new ArrayList<Integer>();
		// 需要删除的资源权限
		List<Integer> removerResourceIdList = new ArrayList<Integer>();
		// 不进行删除的资源权限
		List<Integer> neverIdList = new ArrayList<Integer>();
		neverIdList.add(35);
		neverIdList.add(36);
		neverIdList.add(66);
		neverIdList.add(67);
		
		
		for (Integer resourceId : resourceIdList) {
			if (!oldResIdList.contains(resourceId)) {
				addResourceIdList.add(resourceId);
			}
		}
		for (Integer resId : oldResIdList) {
			if (!resourceIdList.contains(resId) && !neverIdList.contains(resId)) {
				removerResourceIdList.add(resId);
			}
		}
		if (addResourceIdList.size() > 0) {
			for (Integer resourceId : addResourceIdList) {
				sysRoleResourceDao.insert(roleId, resourceId);
			}
		}
		if (removerResourceIdList.size() > 0) {
			sysRoleResourceDao.delete(roleId, removerResourceIdList);
		}
	}

	/**   
	 * @Description: 根据角色Id查询权限资源  
	 * @param : roleId 角色Id    
	 * @return :  List<SysResource> 资源列表
	 * @throws  
	*/
	@Override
	public List<SysResource> findResourceByRoleId(Integer roleId) {
		List<SysResource> syeResourceList = new ArrayList<SysResource>();
		syeResourceList = sysResourceDao.selectByRoleId(roleId);
		return syeResourceList;
	}

	/**   
	 * @Description: 根据角色ID删除角色 
	 * @param :Integer roleId 角色Id       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void removeRoleByIds(String roleIds) {
		String[] roleArray = roleIds.split(",");
		if (null != roleArray) {
			sysRoleDao.deleteByRoleIds(roleArray);
			sysRoleDao.deleteUserRoleByRoleIds(roleArray);
			sysRoleResourceDao.deletByRoleIds(roleArray);
		}
	}

	/**   
	 * @Description: 新增角色  
	 * @param : SysRoleVo roleVo 角色      
	 * @return :     
	 * @throws  
	*/
	@Override
	public void addRole(SysRoleVo roleVo) {
		roleVo.setCreateDate(new Date());
		roleVo.setUpdateDate(new Date());
		sysRoleDao.insertSelective(roleVo);
	}

	/**   
	 * @Description:分页查询角色列表
	 * @param :SysRoleVo对象
	 */
	@Override
	public void getPageRoleList(SysRoleVo sysRoleVo, PageUtil<SysRoleVo> pageUtil) {
		Map<String, Object> parameMap = Maps.newHashMap();
		Map<String, SysRoleVo> roleMap = Maps.newHashMap();
		List<Integer> roleIdList = null;
		if(null != sysRoleVo){
			setMap(parameMap, sysRoleVo, pageUtil);
		}
		
		sysRoleDao.getPageRoleList(pageUtil);
		List<SysRoleVo> sysRoleVoList = pageUtil.getResults();
		if(null != sysRoleVoList && sysRoleVoList.size() > 0) {
			roleIdList = new ArrayList<Integer>();
			for(SysRoleVo roleVo : sysRoleVoList) {
				Integer roleId = roleVo.getRoleId();
				roleVo.setResourceIdList(new ArrayList<String>());
				roleIdList.add(roleId); 
				roleMap.put(roleId+"", roleVo);
			}
		}
		if(null != roleIdList) {
			List<SysRoleResource> roleResourceList = sysRoleResourceDao.selectByRoleIdList(roleIdList);
			if(null != roleResourceList && roleResourceList.size() > 0) {
				for(SysRoleResource sysRoleResource : roleResourceList) {
					String roleId = sysRoleResource.getRoleId() + "";
					String resourceId = sysRoleResource.getResourceId() + "";
					SysRoleVo roVo = roleMap.get(roleId);
					roVo.getResourceIdList().add(resourceId);
				}
			}
		}
	}

	/**   
	 * @Description: 设置查询参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, SysRoleVo sysRoleVo, PageUtil<SysRoleVo> pageUtil) {
		if (sysRoleVo.getIsSystem() != null) {
			paramMap.put("isSystem", sysRoleVo.getIsSystem() + "");
		}
		if (sysRoleVo.getRoleLevel() != null) {
			paramMap.put("roleLevel", sysRoleVo.getRoleLevel() + "");
		}
		if (sysRoleVo.getRoleName() != null && !"".equals(sysRoleVo.getRoleName())) {
			paramMap.put("roleName", sysRoleVo.getRoleName());
		}
		pageUtil.setObj(paramMap);
	}

	/**   
	 * @Description: 查询用户相关角色的最大等级  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public String queryMaxRoleLevelByAccount(String account) {
		String roleLevelStr = null;
		Integer roleLevel = sysRoleDao.queryMaxRoleLevelByAccount(account);
		if (null != roleLevel) {
			roleLevelStr = roleLevel + "";
		} else {
			// 设为最低级别
			roleLevelStr = "2";
		}
		return roleLevelStr;
	}

}
