/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.basedata.service;

import java.util.List;

import com.audit.modules.basedata.entity.AccountSiteManage;
import com.audit.modules.common.mybatis.PageUtil;

/**   
 * @Description: 报账点 信息管理  
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午7:11:12    
*/
public interface AccountSiteManageService {
	
	/**   
	 * @Description: 分页查询报账点  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void queryPageAccountSiteManage(AccountSiteManage accountSiteManage, PageUtil<AccountSiteManage> pageUtil);

	/**   
	 * @Description: 通过Id查询报账点 信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<AccountSiteManage>  queryAccountSiteManageById(String accountSiteManageId);

	/**   
	 * @Description: 通过Id修改报账点信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateAccountSiteManageById(AccountSiteManage accountSiteManage);

	/**
	 * @return    
	 * @Description: 通过报账点Ids清空  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void deleteAccountSiteManageByIds(String accountSiteManageIds);

	/**   
	 * @Description: 通过电表Id查询电表报账点 信息     
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	AccountSiteManage queryAccountSiteManageBYMeterId(String MeterId);

	/**   
	 * @Description: 新增报账点  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void createAccountSite(AccountSiteManage accountSiteManage);
	
	//查用电量前100
		public List<AccountSiteManage>  queryASETop100();
		
		//查出所有报账点名字
		public List<AccountSiteManage> queryASENTop100();

		public List<AccountSiteManage>  getAllAcount();
		
		public  List<AccountSiteManage> geteletop11();
}
