package com.audit.modules.basedata.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.AccountSitePSU;
import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
/**
 * 
 * @Description: 报账点供电信息dao   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午2:14:31
 */
@Component
@MybatisRepostiory
public interface AccountSitePSUDao {
   
	/**   
	 * @Description: 分页查询  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<AccountSitePSU> queryPageAccountSitePSU(PageUtil<AccountSitePSU> pageUtil);

	/**   
	 * @Description: 通过Id查询  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	AccountSitePSU queryAccountSitePSUBYId(String accountSitePSUId);

	/**   
	 * @Description: 通过Id修改供电信息  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateSelective(AccountSitePSU accountSitePSU);

	/**
	 * @param accountSitePSUIds     
	 * @Description: TODO  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void clearByIDs(String[] accountSitePSUIds );
}