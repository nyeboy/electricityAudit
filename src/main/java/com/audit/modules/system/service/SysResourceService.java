package com.audit.modules.system.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.MenuVo;
import com.audit.modules.system.entity.ResourceVo;
import com.audit.modules.system.entity.SysResource;

/**   
 * @Description: TODO   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年3月31日 下午3:02:24    
*/
public interface SysResourceService {
	
	/**
	 * 
	 * @Description: 通过资源Id查询资源  
	 * @param :Long resourceId       
	 * @return :     
	 * @throws
	 */
	SysResource findOne(Long resourceId);

	/**
	 * 
	 * @Description: 查询所有资源  
	 * @param :       
	 * @return :     
	 * @throws
	 */
	Map<String, List<ResourceVo>> findAll();
	
	/**
	 * 
	 * @Description: 通过id更改可选属性 
	 * @param :SysResource sysresource   
	 * @return :     
	 * @throws
	 */
	void updateByIdSelective(SysResource sysresource);

	/**
	 * @Description: 得到资源对应的权限字符串
	 * @param resourceIds
	 * @return
	 */
	Set<String> findPermissions(Set<Long> resourceIds);
	
	/**
	 * 
	 * @Description: 添加资源  
	 * @param :sysresource     
	 * @return :     
	 * @throws
	 */
	void addResource(SysResource sysresource);

	/** 
	 * @Description:根据用户权限得到菜单
	 * @param permissions
	 * @return
	 */
	List<MenuVo> findMenus(Set<String> permissions, String functionType);

	/**   
	 * @Description: 批量删除资源
	 * @param :resourceIdList    
	 * @return :     
	 * @throws  
	*/
	void removeResource(List<Long> resourceIdList);

	/**   
	 * @Description:分页搜索
	 * @param :  sysResoure
	 * @param :  pageUtil
	 * @return :     
	 * @throws  
	*/
	void queryResourceListPage(SysResource sysResoure, PageUtil<SysResource> pageUtil);
	
	
}
