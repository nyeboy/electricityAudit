package com.audit.modules.watthourmeter.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;

/**
 * @author : jiadu
 * @Description : 电表
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface WatthourMeterDao {
    List<WatthourMeterVO> findBySiteID(Map<String, String> paramterMap);
    
    List<WatthourExtendVO> findHisSiteInfo(Map<String, String> paramterMap);
    
    List<WatthourMeterVO> selectTime(Map<String, String> paramterMap);
    
    void saveWatthourExtend(WatthourExtendVO watthourExtendVO);
    
    void updateWatthourMeter(WatthourExtendVO watthourExtendVO);
    
    void saveInMiddle(Map<String, String> paramterMap);//保存电费和电表中间表

    List<WatthourMeterVO> findAllBySiteID(Map<String, String> paramterMap);

    List<Map<String, Object>> findExtendBySiteIDs(List<String> ids);

    List<String> findWatthourExtendIDs(@Param("id") String id);

    void deleteMilldeWatthour(@Param("id") String id);

    void deleteWatthourExtends(List<String> ids);

    List<WatthourMeterVO> findAll();

    void batchSave(List<WatthourMeterVO> toSaveWattInfo);

    void batchUpdate(List<WatthourMeterVO> toSaveWattInfo);
    
    /**
     * 查询、分布、搜索
     * @param pageUtil
     * @return
     */
 	List<WatthourMeterVO> getPageList(PageUtil<WatthourMeterVO> pageUtil);
 	
 	/**
 	 * 通过Id单个查询
 	 * @param ID
 	 * @return InvoiceVO
 	 */
 	WatthourMeterVO selectById(String invoiceId);
 	
 	/**
 	 * 删除
 	 * @param list
 	 */
 	void delete(List<String> IdList);
 	
 	/**
 	 * 新增、更新
 	 * @param Invoice
 	 */
 	void saveOrUpdate(WatthourMeterVO VO);
 	
 	public WatthourMeterVO geteleinfo(String id);
}
