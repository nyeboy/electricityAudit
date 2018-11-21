/**
 * Copyright (c) 2017, IsoftStone All Right reserved.
 */
package com.audit.modules.system.service.impl;

import java.math.BigDecimal;
import java.text.Collator;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.shiro.authz.permission.WildcardPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.system.dao.SysResourceDao;
import com.audit.modules.system.dao.SysRoleResourceDao;
import com.audit.modules.system.entity.MenuVo;
import com.audit.modules.system.entity.ResourceVo;
import com.audit.modules.system.entity.SysResource;
import com.audit.modules.system.service.SysResourceService;
import com.google.common.collect.Maps;

/**   
 * @Description: 资源serviceImpl   
 * 
 * @author  杨芃
 * @date 2017年3月31日 下午3:07:49    
*/

@Service
public class SysResourceServiceImpl implements SysResourceService {

	@Autowired
	private SysResourceDao resourceDao;

	@Autowired
	private SysRoleResourceDao roleResourceDao;

	@Override
	public SysResource findOne(Long resourceId) {
		return resourceDao.selectByPrimaryKey(new BigDecimal(resourceId));
	}
	@Override
	public Map<String, List<ResourceVo>> findAll() {
		//拼音排序
		Comparator<Object> cmp = Collator.getInstance(java.util.Locale.CHINA);
		Map<String, List<ResourceVo>> resultMap = new HashMap<String, List<ResourceVo>>();
		List<ResourceVo> resultList = null;
		List<ResourceVo> resourceVoTempList = null;
		Map<String, ResourceVo> resourceVoMap = new HashMap<String, ResourceVo>();
		List<SysResource> resourceList = null;
		ResourceVo resourceVo = null;
		String resourceId = null;
		String resourceName = null;
		List<String> resourceTitleList = new ArrayList<String>();
		resourceTitleList.add("电费提交");
		resourceTitleList.add("基础数据");
		resourceTitleList.add("统计报表");
		resourceTitleList.add("系统管理");
		resourceTitleList.add("预付提交");
		resourceTitleList.add("综合电费提交");
		
		for (int i = 0; i < 2; i++) {
			resourceList = resourceDao.findAllByFunctionType(i + "");
			resultList = new ArrayList<ResourceVo>();
			resourceVoTempList = new ArrayList<ResourceVo>();
			if (null != resourceList && resourceList.size() > 0) {
				Collections.sort(resourceList, new Comparator<SysResource>() {
					@Override
					public int compare(SysResource arg0, SysResource arg1) {
						return arg0.getId().compareTo(arg1.getId());
					}

				});
				//
				for (SysResource sysResource : resourceList) {
					resourceName = sysResource.getResourceName();
					resourceId = sysResource.getId() + "";
					if (null != resourceName && !"".equals(resourceName) && null != resourceId
							&& !"".equals(resourceId) ) {
						resourceVo = new ResourceVo();
						resourceVo.setFunctionType(i + "");
						resourceVo.setResourceName(resourceName);
						resourceVo.setId(resourceId);
						resourceVoMap.put(resourceId, resourceVo);
						if(resourceTitleList.contains(resourceName) || resourceName.equals("用户/角色")) {
							resourceVo.setChild(new ArrayList<ResourceVo>());
							resourceVoTempList.add(resourceVo);
						}
					}
				}
				//添加子数据
				for(ResourceVo resVo : resourceVoTempList){
					String id = resVo.getId();
					List<ResourceVo> resourVoList = resVo.getChild();
					for (SysResource sysRes : resourceList) {
						BigDecimal sysResid = sysRes.getId();
						BigDecimal parentid = sysRes.getParentId();
						//把转供电信息管理加入基础数据列表下管理
//						if(sysRes.getResourceName().equals("转供电信息管理")){
//							resourVoList.add(resourceVoMap.get(""+sysResid));
//						}
						if((parentid + "").equals(id) && !"用户/角色".equals(sysRes.getResourceName())) {
							resourVoList.add(resourceVoMap.get(""+sysResid));
						}
					}
				}
				//用户/角色子资源并入系统管理
				List<ResourceVo> userRoleList = null;
				for(ResourceVo resVo : resourceVoTempList){
					resVo.getResourceName().equals("用户/角色"); 
					userRoleList = resVo.getChild();
				}
				
				for(ResourceVo reVo : resourceVoTempList) {
					if(!reVo.getResourceName().equals("用户/角色") && reVo.getChild().size() > 0) {
						resultList.add(reVo);
					}
					if(reVo.getResourceName().equals("系统管理") && null != userRoleList && userRoleList.size() > 0) {
						reVo.getChild().addAll(userRoleList);
					}
				}
				Collections.sort(resultList, new Comparator<ResourceVo>() {
					@Override
					public int compare(ResourceVo arg0, ResourceVo arg1) {
						return cmp.compare(arg0.getResourceName(), arg1.getResourceName());
					}
				});
			}
			if(i == 0) {
				resultMap.put("self", resultList);
			}else if(i ==1) {
				resultMap.put("tower", resultList);
			}
		}
		return resultMap;
	}

	/**
	 * 
	 * @Description: 根据资源IdSet查询权限  
	 * @param : Set<Long> resourceIds  资源IdSet   
	 * @return :     
	 * @throws
	 */
	@Override
	public Set<String> findPermissions(Set<Long> resourceIds) {
		Set<String> permissions = new HashSet<String>();
		List<Integer> resourceIdsList = new ArrayList<Integer>();
		for (Long resourcId : resourceIds) {
			resourceIdsList.add(new Integer(resourcId.toString()));
		}
		List<SysResource> sysResourceList = resourceDao.selectByResourceIdList(resourceIdsList);
		for (SysResource resource : sysResourceList) {
			if (resource != null && !StringUtils.isEmpty(resource.getPermission())) {
				permissions.add(resource.getPermission());
			}
		}
		return permissions;
	}

	/**
	 * 
	 * @Description: 根据权限列表查询菜单  
	 * @param : Set<String> permissions 权限 set      
	 * @return :     
	 * @throws
	 */
	@Override
	public List<MenuVo> findMenus(Set<String> permissionSet, String functionType) {
		if(null == functionType || "".equals(functionType)){
			functionType = "0";
		}
		List<MenuVo> resultMenuList = new ArrayList<MenuVo>();
		List<SysResource> resourceList = new ArrayList<SysResource>();
		List<MenuVo> menuVoList = new ArrayList<MenuVo>();
		Map<String, MenuVo> menuMap = new HashMap<String, MenuVo>();
		String[] parentIdArray = null;
		String resourceName = null;
		String permission = null;
		String parentIds = null;
		Set<String> parentIdSet = new HashSet<String>();

		List<SysResource> allResource = resourceDao.findResourceByType("menu", functionType);
		Collections.sort(allResource, new Comparator<SysResource>() {
			@Override
			public int compare(SysResource arg0, SysResource arg1) {
				return arg0.getId().compareTo(arg1.getId());
			}

		});
		// 存资源的父菜单Id;
		// 把permission为key;Set<BigDecimal> idSet为Value
		for (SysResource resource : allResource) {
			permission = resource.getPermission();
			if (permissionSet.contains(permission)) {
				parentIds = resource.getParentIds();
				parentIdArray = parentIds.split("/");
				for (String parent : parentIdArray) {
					parentIdSet.add(parent);
				}
			}
		}
		// 提取菜单资源
		for (SysResource resource : allResource) {
			if (parentIdSet.contains("" + resource.getId())) {
				resourceList.add(resource);
				continue;
			}
			System.out.println(resource.getResourceName());
			if (!hasPermission(permissionSet, resource)) {
				continue;
			}
			resourceList.add(resource);
		}
		// 添加父菜单资源

		// 添加到menuMap
		for (SysResource resour : resourceList) {
			MenuVo menuVo = new MenuVo();
			resourceName = resour.getResourceName();
			String parentid = resour.getParentId() + "";
			menuVo.setValue(resourceName);
			menuVo.setChild(new ArrayList<MenuVo>());
			menuVo.setTitle(new ArrayList<String>());
			BigDecimal id = resour.getId();
			BigDecimal parentId = resour.getParentId();

			if (resourceName.equals("稽核管理") && parentid.equals("0")) {
				menuVo.setIcon("img/audit_icon.png");
			}
			if (resourceName.equals("基础数据") && parentid.equals("0")) {
				menuVo.setIcon("img/data_icon.png");
			}
			if (resourceName.equals("统计报表") && parentid.equals("0")) {
				menuVo.setIcon("img/table_icon.png");
			}
			if (resourceName.equals("系统管理") && parentid.equals("0")) {
				menuVo.setIcon("img/table_icon.png");
			}
			if (null != resour.getAlias()) {
				menuVo.setId(resour.getAlias());
			}

			if (parentId.compareTo(new BigDecimal(0)) == 0) {
				menuVoList.add(menuVo);
			}
			menuMap.put(id.toString(), menuVo);
		}
		// 添加到child List中
		for (SysResource re : resourceList) {
			BigDecimal id = re.getId();
			BigDecimal parentid = re.getParentId();
			if (parentid.compareTo(new BigDecimal(0)) != 0) {
				MenuVo menuchild = menuMap.get(id.toString());
				MenuVo menuparent = menuMap.get(parentid.toString());
				if (menuparent == null) {
					continue;
				}
				List<MenuVo> menuList = menuparent.getChild();
				if (menuList != null) {
					menuList.add(menuchild);
				} else {
					menuList = new ArrayList<MenuVo>();
					menuList.add(menuchild);
				}
				menuparent.setChild(menuList);
			}
		}
		// // 添加 title
		// for (SysResource re : resourceList) {
		// BigDecimal id = re.getId();
		// MenuVo menu = menuMap.get(id.toString());
		// List<String> title = new ArrayList<String>();
		// parentIdArray = re.getParentIds().split("/");
		// for (String parid : parentIdArray) {
		// if (!parid.equals("0") && !parid.equals("") &&
		// menuMap.containsKey(parid)) {
		// String parname = menuMap.get(parid).getValue();
		// System.out.println(parname);
		// title.add(parname);
		// }
		// }
		// menu.setTitle(title);
		// title.add(menu.getValue());
		// }
		// menuVoList 排序
		for (MenuVo menu : menuVoList) {
			if (menu.getValue().equals("稽核管理")) {
				resultMenuList.add(menu);
			}
			if (menu.getValue().equals("基础数据")) {
				resultMenuList.add(menu);
			}
			if (menu.getValue().equals("统计报表")) {
				resultMenuList.add(menu);
			}
			if (menu.getValue().equals("系统管理")) {
				resultMenuList.add(menu);
			}
		}
		return resultMenuList;
	}

	/**
	 * 
	 * @Description: 判断是否有该资源的权限  
	 * @param :permissions 权限（资源标识符）
	 * @param :resource 资源
	 * @return :     
	 * @throws
	 */
	private boolean hasPermission(Set<String> permissions, SysResource resource) {
		if (StringUtils.isEmpty(resource.getPermission())) {
			return true;
		}
		for (String permission : permissions) {
			WildcardPermission p1 = new WildcardPermission(permission);
			WildcardPermission p2 = new WildcardPermission(resource.getPermission());
			if (p1.implies(p2) || p2.implies(p1)) {
				return true;
			}
		}
		return false;
	}

	/**   
	 * @Description: 添加资源  
	 * @param :SysResource sysresource       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void addResource(SysResource sysresource) {
		resourceDao.insertSelective(sysresource);
	}

	/**   
	 * @Description: 删除资源  
	 * @param :List<Long> resourceIdLList        
	 * @return :     
	 * @throws  
	*/
	@Override
	public void removeResource(List<Long> resourceIdList) {
		List<Long> allResIdList = new ArrayList<Long>();
		allResIdList.addAll(resourceIdList);
		List<Long> resIdList = null;
		for (Long resId : resourceIdList) {
			resIdList = resourceDao.selectIdByParentId("/" + resId + "/");
			if (null != resIdList && resIdList.size() > 0) {
				allResIdList.removeAll(resIdList);
				allResIdList.addAll(resIdList);
			}
		}
		resourceDao.deleteResByIdList(allResIdList);
		roleResourceDao.deletRoleResByResIdList(allResIdList);
	}

	/**
	 * 
	 * @Description: 通过id更改可选属性 
	 * @param :SysResource sysresource   
	 * @return :     
	 * @throws
	 */
	@Override
	public void updateByIdSelective(SysResource sysresource) {
		resourceDao.updateByPrimaryKeySelective(sysresource);
	}

	/**   
	 * @Description: 分页搜索  
	 * @param :sysResoure资源 pageUtil页面       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void queryResourceListPage(SysResource sysResource, PageUtil<SysResource> pageUtil) {
		Map<String, Object> paramMap = Maps.newHashMap();
		if (null != sysResource) {
			setMap(paramMap, sysResource, pageUtil);
		}
		List<SysResource> sysRoleVoList = resourceDao.getPageRoleList(pageUtil);
	}

	/**   
	 * @Description: 设置查询参数    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, SysResource sysResource, PageUtil<SysResource> pageUtil) {
		if (sysResource.getResourceName() != null) {
			paramMap.put("resourceName", sysResource.getResourceName());
		}
		if (sysResource.getParentId() != null) {
			paramMap.put("parentId", "/" + sysResource.getParentId() + "/");
		}
		if (sysResource.getPermission() != null && !"".equals(sysResource.getPermission())) {
			paramMap.put("permission", sysResource.getPermission());
		}
		if (sysResource.getId() != null) {
			paramMap.put("resourceId", sysResource.getId() + "");
		}
		if (sysResource.getType() != null && !"".equals(sysResource.getType())) {
			paramMap.put("type", sysResource.getType());
		}

		pageUtil.setObj(paramMap);
	}
}
