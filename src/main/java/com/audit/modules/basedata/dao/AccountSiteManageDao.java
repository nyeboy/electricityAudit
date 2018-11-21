package com.audit.modules.basedata.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.AccountSiteManage;
import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;

/**
 * 
 * @Description: 报账点信息管理   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月20日 下午7:51:07
 */
@Component
@MybatisRepostiory
public interface AccountSiteManageDao{
	
	/**
	 * 
	 * @Description: 新增报账点信息  
	 * @param :       
	 * @return :     
	 * @throws
	 */
    int insertSelective(AccountSiteManage record);
    
    /**
     * 
     * @Description: 根据电表ID 清除报账点和电表关联  
     * @param :       
     * @return :     
     * @throws
     */
    void clearByMeterIds(String[] meterIds);
    

	/**   
	 * @Description: 分页查询报账点  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<AccountSiteManage> queryPageAccountSiteManage(PageUtil<AccountSiteManage> pageUtil);

	/**   
	 * @Description: 通过Id查询报账点  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<AccountSiteManage> queryAccountSiteManageBYId(String accountSiteManageId);
	
	/**   
	 * @Description: 通过电表ID查询报账点信息
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	AccountSiteManage queryAccountSiteManageBYMeterId(String MeterId);

	/**   
	 * @Description: 通过Id修改报账点  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateSelective(AccountSiteManage accountSiteManage);

	/**   
	 * @Description: 通过报账点Ids删除报账点  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void deleteByIDs(List<String> accountSiteIdList);
	/**
	 * 
	 * @Description: 查询自维报账点数目  
	 * @param :       
	 * @return :     
	 * @throws
	 */
	Double querySelfSiteNum();
	//查用电量前100
	public List<AccountSiteManage>  queryASETop100();
	
	public  List<AccountSiteManage> geteletop11();
	//查出所有报账点名字
	public List<AccountSiteManage> queryASENTop100();
	
	public List<AccountSiteManage>  getAllAcount();
	
}