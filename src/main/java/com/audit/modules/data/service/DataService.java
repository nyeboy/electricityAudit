package com.audit.modules.data.service;

/**
 * 
 * @author issuser
 *
 */
public interface DataService {

	/**
	 * 导入电费合同数据
	 * @return
	 */
	public Boolean importEleContract();
	
	/**
	 * 同步供应商信息
	 */
	public Boolean addVendor();
	/**
	 * 全量同步OA部门信息
	 * @return
	 */
	public Boolean addAllDpts();
	/**
	 * 增量同步OA部门信息
	 * @return
	 */
	public Boolean addDpts(String startTime,String endTime);
	/**
	 * 增量同步OA人员信息
	 * @return
	 */
	public Boolean addEmps(String startTime,String endTime);
	
	
}
