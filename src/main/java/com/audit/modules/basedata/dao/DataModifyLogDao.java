package com.audit.modules.basedata.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.DataModifyLog;
import com.audit.modules.common.mybatis.MybatisRepostiory;
@Component
@MybatisRepostiory
public interface DataModifyLogDao{
   
	int deleteByPrimaryKey(String id);

    int insert(DataModifyLog record);

    int insertSelective(DataModifyLog record);

    DataModifyLog selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(DataModifyLog record);

    int updateByPrimaryKey(DataModifyLog record);

	/**
	 * @return    
	 * @Description: 根据申请id查找日志  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<DataModifyLog> findLogByApplyId(String applyId);
	
	/**
	 * @return    
	 * @Description: 根据申请id查找第一份修改日志  
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	DataModifyLog findFistLogByApplyId(String applyId);
	
	/**
	 * @return    
	 * @Description: 根据申请id查找之前的修改日志，并按时间排序  
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	List<DataModifyLog> findOldLogByApplyId(String applyId);

	/**   
	 * @Description: 根据申请id删除日志  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void deleteByApplyIds(@Param("array")String[] idArray);

	/**   
	 * @Description: TODO  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<DataModifyLog> findLogByData(@Param("dataId")String dataId, @Param("tableName")String tableName);
}