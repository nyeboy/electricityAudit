package com.audit.modules.basedata.service;

import com.audit.modules.basedata.entity.AccountSitePSU;
import com.audit.modules.common.mybatis.PageUtil;

/**
 * 
 * @Description: 报账点供电信息管理   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午3:15:40
 */
public interface AccountSitePSUService {

	/**   
	 * @Description: 分页查询  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void queryPageAccountSitePSU(AccountSitePSU accountSitePSU, PageUtil<AccountSitePSU> pageUtil);

	/**   
	 * @Description: 通过Id查询供电信息  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	AccountSitePSU queryAccountSitePSUById(String accountSitePSUId);

	/**   
	 * @Description: 通过Id修改供电信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateAccountSitePSUById(AccountSitePSU accountSitePSU);

	/**
	 * @return    
	 * @Description: 通过报账点Ids清空  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void clearAccountSitePSUByIds(String accountSitePSUIds);

	
}
