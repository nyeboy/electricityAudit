package com.audit.modules.basedata.service;

import java.util.List;
import java.util.Map;

public interface DataModifyLogService {
	/**
	 * 
	 * @Description: 生成日志描述  
	 * @return :     
	 * @throws
	 */
	 String createLogStr(String tableName, String paramStr, String changeType);

	/**
	 * @Description: 生成原数据的字段和值
	 * @return :     
	 * @throws  
	*/
	List<Map<String, String>> createOriginalField(String tableName, String originalParams, String changeType);

}