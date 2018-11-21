/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.basedata.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.AccountSitePSUDao;
import com.audit.modules.basedata.entity.AccountSitePSU;
import com.audit.modules.basedata.service.AccountSitePSUService;
import com.audit.modules.common.mybatis.PageUtil;
import com.google.common.collect.Maps;

/**   
 * @Description: 供电信息管理   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午5:16:14    
*/
@Service
public class AccountSitePSUServiceImpl implements AccountSitePSUService {

	@Autowired
	private AccountSitePSUDao accountSitePSUDao;
	/**   
	 * @Description:分页查询    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void queryPageAccountSitePSU(AccountSitePSU accountSitePSU, PageUtil<AccountSitePSU> pageUtil) {
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null != accountSitePSU){
			setMap(parameMap, accountSitePSU, pageUtil);
		}
		List<AccountSitePSU> sysRoleVoList = accountSitePSUDao.queryPageAccountSitePSU(pageUtil);
	}

	/**   
	 * @Description: 设置查询参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, AccountSitePSU accountSitePSU, PageUtil<AccountSitePSU> pageUtil) {
		if (accountSitePSU.getAccountName() != null) {
			paramMap.put("accountName", accountSitePSU.getAccountName() + "");
		}
		if (accountSitePSU.getCountyId() != null) {
			paramMap.put("countyId", accountSitePSU.getCountyId() + "");
		}
		if (accountSitePSU.getCityId() != null) {
			paramMap.put("cityId", accountSitePSU.getCityId() + "");
		}
		if (accountSitePSU.getElectricityType() != null) {
			paramMap.put("electricityType", accountSitePSU.getElectricityType() + "");
		}
		pageUtil.setObj(paramMap);
		
	}

	/**   
	 * @Description: 通过Id查询供电信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public AccountSitePSU queryAccountSitePSUById(String accountSitePSUId) {
		return accountSitePSUDao.queryAccountSitePSUBYId(accountSitePSUId);
	}

	/**   
	 * @Description: 通过Id修改供电信息 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void updateAccountSitePSUById(AccountSitePSU accountSitePSU) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String updateTime = sdf.format(new Date());
		accountSitePSU.setUpdateTime(updateTime);
		accountSitePSUDao.updateSelective(accountSitePSU);
	}

	/**   
	 * @Description: 通过报账点Ids清空   
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void clearAccountSitePSUByIds(String accountSitePSUIds) {
		String[] sitePSUIdArray = accountSitePSUIds.split(",");
		accountSitePSUDao.clearByIDs(sitePSUIdArray);
	}

}
