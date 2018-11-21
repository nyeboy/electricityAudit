package com.audit.modules.watthourmeter.service;

import java.util.List;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;

/**
 * @author : jiadu
 * @Description : 电表信息
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface WatthourMeterService {
    List<WatthourMeterVO> findBySiteId(String siteId);
    void saveWatthourExtend(WatthourExtendVO[] watthourMeterVOs,String id);
    void deleteMiddleWatthour(String id);
    List<String> findWatthourExtendIDs(String id);
    void deleteWatthourExtends(List<String> ids);
    
    /**   
   	 * @Description:查询分页搜索
   	 * @param :  Invoice
   	 * @param :  pageUtil
   	 * @return :     
   	 * @throws  
   	*/
    	List<WatthourMeterVO> queryListPage(WatthourMeterVO vo, PageUtil<WatthourMeterVO> pageUtil);
    
    	/**
    	 * 查询单行数据
    	 * @param ID
    	 * @return
    	 */
    	WatthourMeterVO selectById(String id);
    	
    	/**
    	 * 单、批量删除
    	 * @param IdList
    	 */
    	void delete(List<String> IdList);

    	/**
    	 * 添加、更新合同（可以部分属性为null）
    	 * @param record
    	 * @return
    	 */
    	void saveOrUpdate(WatthourMeterVO vo);
    	
    	public WatthourMeterVO geteleinfo(String id);
}
