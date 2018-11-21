/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.basedata.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.AccountSiteOtherDao;
import com.audit.modules.basedata.entity.AccountSiteOther;
import com.audit.modules.basedata.service.AccountSiteOtherService;
import com.audit.modules.common.mybatis.PageUtil;
import com.google.common.collect.Maps;

/**   
 * @Description:    
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午5:16:14    
*/
@Service
public class AccountSiteOtherServiceImpl implements AccountSiteOtherService {

	@Autowired
	private AccountSiteOtherDao accountSiteOtherDao;
	/**   
	 * @Description:分页查询    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void queryPageAccountSiteOther(AccountSiteOther accountSiteOther, PageUtil<AccountSiteOther> pageUtil) {
		Map<String, AccountSiteOther> resultMap = Maps.newHashMap();
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null != accountSiteOther){
			setMap(parameMap, accountSiteOther, pageUtil);
		}
		accountSiteOtherDao.queryPageAccountSiteOther(pageUtil);
		List<AccountSiteOther> accountSiteOtherList = pageUtil.getResults();
		if(null != accountSiteOtherList && accountSiteOtherList.size() > 0) {
			for(AccountSiteOther actSiteOther: accountSiteOtherList) {
				resultMap.put(actSiteOther.getId(), actSiteOther);
			}
		}
		
	}

	/**   
	 * @Description: 设置参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, AccountSiteOther accountSiteOther, PageUtil<AccountSiteOther> pageUtil) {
		if (accountSiteOther.getAccountName() != null) {
			paramMap.put("accountName", accountSiteOther.getAccountName() + "");
		}
		if (accountSiteOther.getCountyId() != null) {
			paramMap.put("countyId", accountSiteOther.getCountyId() + "");
		}
		if (accountSiteOther.getCityId() != null) {
			paramMap.put("cityId", accountSiteOther.getCityId() + "");
		}
		pageUtil.setObj(paramMap);
		
	}

	/**   
	 * @Description: 通过Id查询报账点信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public AccountSiteOther queryAccountSiteOtherById(String accountSiteOtherId) {
		return accountSiteOtherDao.queryAccountSiteOtherBYId(accountSiteOtherId);
	}

	/**   
	 * @Description: 通过Id修改报账点信息 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void updateAccountSiteOtherById(AccountSiteOther accountSiteOther) {
		accountSiteOtherDao.updateSelective(accountSiteOther);
	}



}
