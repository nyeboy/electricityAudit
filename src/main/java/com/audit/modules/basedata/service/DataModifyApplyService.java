package com.audit.modules.basedata.service;

import java.util.List;
import java.util.Map;

import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.DataModifyApply;
import com.audit.modules.basedata.entity.DataModifyDetail;
import com.audit.modules.basedata.entity.DataModifyLog;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;

public interface DataModifyApplyService {

	/**   
	 * @Description: 添加操作申请  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	String insertSelective(DataModifyApply record);
	
	
	/**   
	 * @Description: 转供电添加操作申请  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	String transInsertSelective(AccountSiteTransSubmit accountSiteTransSubmit);
	/**   
	 * @Description: 转供电添加操作申请  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	String towerTransInsertSelective(TowerTransSubmitVO towerTransSubmitVO);
	

	/**
	 * 
	 * @Description: 通过id查询操作申请    
	 * @param :       
	 * @return :     
	 * @throws
	 */
	DataModifyApply selectByPrimaryKey(String id);
	
	/**
	 * 
	 * @Description: 更新申请信息  
	 * @param :       
	 * @return :     
	 * @throws
	 */
	int updateByPrimaryKeySelective(DataModifyApply record);
	
	/**
	 * 
	 * @Description: 自维转供电--------更新申请信息  
	 * @param :       
	 * @return :     
	 * @throws
	 */
	void transUpdateByPrimaryKeySelective(AccountSiteTransSubmit reData);
	
	
	/**
	 * 
	 * @Description: 塔维转供电--------更新申请信息  
	 * @param :       
	 * @return :     
	 * @throws
	 */
	void towerTransUpdateByPrimaryKeySelective(TowerTransSubmitVO reData);

	/**   
	 * @Description: 分页查询数据维护申请  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<DataModifyApply> findApplyByPage(PageUtil<DataModifyApply> page);

	/**   
	 * @Description: 通过Ids批量删除申请  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	ResultVO deleteApplyByIds(String ids);

	/**   
	 * @Description: 通过id发送request请求  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	ResultVO executeApply(String id);
	
	/**   
	 * @Description: 自维转供电通过业务id发送request请求  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	ResultVO transExecuteApply(String id);
	
	/**   
	 * @Description: 塔维转供电通过业务id发送request请求  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	ResultVO towerTransExecuteApply(String id);

	/**   
	 * @Description: 根据申请id查找 修改详情
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	DataModifyDetail findDetailByApplyId(String applyId);

	/**
	 * @return    
	 * @Description: 添加修改日志  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<DataModifyLog> addDataModifyLog(DataModifyApply dataModifyApply, Map<String, String> paramap);

	/**   
	 * @Description: 判断是否在流程中  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	boolean isInFlow(DataModifyApply dataModifyApply, Map<String, String> params);
	/**   
	 * @Description: 自维转供电判断是否在流程中  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	boolean transIsInFlow(AccountSiteTransSubmit accountSiteTransSubmit);
	/**   
	 * @Description: 塔维转供电判断是否在流程中  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	boolean towerTransIsInFlow(TowerTransSubmitVO towerTransSubmitVO);
}