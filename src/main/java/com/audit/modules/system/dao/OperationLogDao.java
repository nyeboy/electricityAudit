package com.audit.modules.system.dao;

import java.util.List;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.OperationLogVo;

/**
 * @Description :操作日志Dao
 * @author liuyan
 * @date 2017/3/10
 */
public interface OperationLogDao  {
	
	List<OperationLogVo> queryAll();

	void createLog(OperationLogVo user);

	/**   
	 * @Description: TODO  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<OperationLogVo> getPageLogList(PageUtil<OperationLogVo> pageUtil);

}
