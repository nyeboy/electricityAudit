/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.basedata.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.poi.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.AccountSiteManageDao;
import com.audit.modules.basedata.entity.AccountSiteManage;
import com.audit.modules.basedata.service.AccountSiteManageService;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.google.common.collect.Maps;

/**   
 * @Description: 报账点管理      
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午5:16:14    
*/
@Service
public class AccountSiteManageServiceImpl implements AccountSiteManageService {

	@Autowired
	private AccountSiteManageDao accountSiteManageDao;
	/**   
	 * @Description:分页查询    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void queryPageAccountSiteManage(AccountSiteManage accountSiteManage, PageUtil<AccountSiteManage> pageUtil) {
//		Map<String, AccountSiteManage> resultMap = Maps.newHashMap();
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null != accountSiteManage){
			setMap(parameMap, accountSiteManage, pageUtil);
		}
		accountSiteManageDao.queryPageAccountSiteManage(pageUtil);
		List<AccountSiteManage> accountSiteManageList = pageUtil.getResults();
		if(null != accountSiteManageList && accountSiteManageList.size() > 0) {
			for(AccountSiteManage actSiteManage: accountSiteManageList) {
//				resultMap.put(actSiteManage.getId(), actSiteManage);
				if(null == actSiteManage.getClubPrice()) {
					actSiteManage.setClubPrice("");
				}
			}
		}
		
	}

	/**   
	 * @Description: 设置参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, AccountSiteManage accountSiteManage, PageUtil<AccountSiteManage> pageUtil) {
		if (accountSiteManage.getAccountName() != null) {
			paramMap.put("accountName", accountSiteManage.getAccountName() + "");
		}
		if (accountSiteManage.getSiteName() != null) {
			paramMap.put("siteName", accountSiteManage.getSiteName() + "");
		}
		if (accountSiteManage.getCountyId() != null) {
			paramMap.put("countyId", accountSiteManage.getCountyId() + "");
		}
		if (accountSiteManage.getCityId() != null) {
			paramMap.put("cityId", accountSiteManage.getCityId() + "");
		}
		if (accountSiteManage.getAccountAlias() != null) {
			paramMap.put("accountAlias", accountSiteManage.getAccountAlias() + "");
		}
		if (accountSiteManage.getOldFinanceName() != null) {
			paramMap.put("oldFinanceName", accountSiteManage.getOldFinanceName() + "");
		}
		if (accountSiteManage.getResourceName() != null) {
			paramMap.put("resourceName", accountSiteManage.getResourceName() + "");
		}
		if (accountSiteManage.getPayTypee() != null) {
			paramMap.put("payTypee", accountSiteManage.getPayTypee());
		}
		if (accountSiteManage.getProfessional() != null) {
			paramMap.put("professional", accountSiteManage.getProfessional() + "");
		}
//		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//		String selectTime = sdf.format(new Date());
//		paramMap.put("selectTime", selectTime);
		pageUtil.setObj(paramMap);
		
	}

	/**   
	 * @Description: 通过Id查询报账点信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public List<AccountSiteManage> queryAccountSiteManageById(String accountSiteManageId) {
		return accountSiteManageDao.queryAccountSiteManageBYId(accountSiteManageId);
	}
	
	/**   
	 * @Description: 通过电表ID查询报账点信息
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	@Override
	public AccountSiteManage queryAccountSiteManageBYMeterId(String meterId) {
		return accountSiteManageDao.queryAccountSiteManageBYMeterId(meterId);
	}

	/**   
	 * @Description: 通过Id修改报账点信息 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void updateAccountSiteManageById(AccountSiteManage accountSiteManage) {
		accountSiteManageDao.updateSelective(accountSiteManage);
	}

	

	/**   
	 * @Description: 通过报账点Ids删除 报账点 ，中间表:报账点-电表、报账点-合同、报账点-供应商
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void deleteAccountSiteManageByIds(String accountSiteManageIds) {
		List<String> accountSiteIdList = null;
		Set<String> accountSiteIdSet = new HashSet<String>();
		String[] siteManageIdArray = accountSiteManageIds.split(",");
		if(siteManageIdArray.length > 0) {
			for(String accountSiteId : siteManageIdArray) {
				accountSiteIdSet.add(accountSiteId);
			}
			accountSiteIdList = new ArrayList<String>(accountSiteIdSet);
			accountSiteManageDao.deleteByIDs(accountSiteIdList);
		}
	}

	/**   
	 * @Description: 新增报账点  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	
	public void createAccountSite(AccountSiteManage accountSiteManage) {
		accountSiteManage.setId(StringUtils.getUUid());
		accountSiteManageDao.insertSelective(accountSiteManage);
	}

	@Override
	public List<AccountSiteManage> queryASETop100() {
		List<AccountSiteManage> queryASETop100 = accountSiteManageDao.queryASETop100();
		return queryASETop100;
	}

	//查找所有报账点名字
	@Override
	public List<AccountSiteManage> queryASENTop100() {
		List<AccountSiteManage> queryASENTop100 = accountSiteManageDao.queryASENTop100();
		return queryASENTop100;
	}

	@Override
	public List<AccountSiteManage> getAllAcount() {
		List<AccountSiteManage> allAcount = accountSiteManageDao.getAllAcount();
		return allAcount;
	}

	@Override
	public List<AccountSiteManage> geteletop11() {
		List<AccountSiteManage> geteletop11 = accountSiteManageDao.geteletop11();
		return geteletop11;
	}


}
