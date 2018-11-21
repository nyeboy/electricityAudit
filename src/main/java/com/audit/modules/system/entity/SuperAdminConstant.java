/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.system.entity;

import com.audit.modules.common.utils.PropertyUtils;

/**   
 * @Description: 超级管理员角色信息   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年6月20日 下午5:47:11    
*/
public final class SuperAdminConstant {

	
	/** 超级管理员角色名称 */
	public static final String  SUPERADMIN_ROLE_NAME = PropertyUtils.getLogInfo("/SuperAdminConstant/SUPERADMIN_ROLE_NAME");

	/**  超级管理员角色ID   */
	public static final String SUPERADMIN_ROLE_ID = PropertyUtils.getLogInfo("/SuperAdminConstant/SUPERADMIN_ROLE_ID");
}
