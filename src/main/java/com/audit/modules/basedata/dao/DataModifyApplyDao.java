package com.audit.modules.basedata.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.DataModifyApply;
import com.audit.modules.common.mybatis.PageUtil;

public interface DataModifyApplyDao {
	
    /**
     * @return    
	 * @Description: 添加操作申请  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	int insertSelective(DataModifyApply record);
	
	

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
	void deleteApplyByIds(@Param("array")String[] idArray);

	/**   
	 * @Description: 通过dataIds查询正在审批的申请  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<DataModifyApply> findInFlowApplyBydataIds(@Param("list")List<String> dataIds);
}