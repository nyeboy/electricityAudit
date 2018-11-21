package com.audit.modules.basedata.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.AccountSiteOther;
import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;

/**
 * 
 * @Description: 报账点其他信息管理（报销周期、铁塔）   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午7:51:07
 */
@Component
@MybatisRepostiory
public interface AccountSiteOtherDao{
	

	/**   
	 * @Description: 分页查询报报账点 其他信息   
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<AccountSiteOther> queryPageAccountSiteOther(PageUtil<AccountSiteOther> pageUtil);

	/**   
	 * @Description: 通过Id查询报账点 其他信息 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	AccountSiteOther queryAccountSiteOtherBYId(String accountSiteOtherId);
	

	/**   
	 * @Description: 通过Id修改报账点  其他信息 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateSelective(AccountSiteOther accountSiteOther);
	
}