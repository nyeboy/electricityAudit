/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.basedata.service;

import com.audit.modules.basedata.entity.AccountSiteOther;
import com.audit.modules.common.mybatis.PageUtil;

/**   
 * @Description: 报账点其他信息管理（报销周期，分摊比例）  
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午7:11:12    
*/
public interface AccountSiteOtherService {
	
	/**   
	 * @Description: 分页查询报账点其他信息  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void queryPageAccountSiteOther(AccountSiteOther accountSiteOther, PageUtil<AccountSiteOther> pageUtil);

	/**   
	 * @Description: 通过Id查询其他信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	AccountSiteOther queryAccountSiteOtherById(String accountSiteOtherId);

	/**   
	 * @Description: 通过Id修改其他信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateAccountSiteOtherById(AccountSiteOther accountSiteOther);

}
