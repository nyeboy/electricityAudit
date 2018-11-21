package com.audit.modules.system.service;

import java.util.List;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.OperationLogVo;

/**
 * @Description :操作日志管理接口
 * @author liuyan
 * @date 2017/3/10
 */
public interface OperationLogService {
    void create(OperationLogVo entity);
    List<OperationLogVo> findAll();
	/**   
	 * @Description: 分页搜索日志  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void getPageLogList(OperationLogVo operationLogVo, PageUtil<OperationLogVo> pageUtil);
}
