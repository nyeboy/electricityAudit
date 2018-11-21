package com.audit.modules.basedata.entity;

import java.util.List;
import java.util.Map;

/**
 * 
 * @Description: 基础数据维护 查看日志详情   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年5月4日 上午9:58:48
 */
public class DataModifyDetail {

	// 原数据（用于页面展示）
	private List<Map<String, Map>> originalDataList;
	// 修改数据（用于页面展示）
	private List<Map<String, String>> modifyLogList;
	// 修改数据Id
	private String dataId;
	// 表名
	private String tablName;
	
	public String getTablName() {
		return tablName;
	}

	public void setTablName(String tablName) {
		this.tablName = tablName;
	}

	public List<Map<String, String>> getModifyLogList() {
		return modifyLogList;
	}

	public void setModifyLogList(List<Map<String, String>> modifyLogList) {
		this.modifyLogList = modifyLogList;
	}

	public List<Map<String, Map>> getOriginalDataList() {
		return originalDataList;
	}

	public void setOriginalDataList(List<Map<String, Map>> originalDataList) {
		this.originalDataList = originalDataList;
	}

	public String getDataId() {
		return dataId;
	}

	public void setDataId(String dataId) {
		this.dataId = dataId;
	}
	
}