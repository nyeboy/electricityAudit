package com.audit.modules.watthourmeter.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.binding.MapperMethod.ParamMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.watthourmeter.dao.WatthourMeterDao;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.audit.modules.watthourmeter.service.WatthourMeterService;
import com.google.common.collect.Maps;

/**
 * @author : jiadu
 * @Description : 电表信息
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Service
public class WatthourMeterServiceImpl implements WatthourMeterService{

    @Autowired
    private WatthourMeterDao watthourMeterDao;
    @Override
    public List<WatthourMeterVO> findBySiteId(String siteId) {
        Map<String,String> paramterMap = Maps.newHashMap();        
        paramterMap.put("siteId",siteId);
        List<WatthourMeterVO> list=watthourMeterDao.findBySiteID(paramterMap);
        for(int i=0;i<list.size();i++){
        	System.out.println(list.get(i).getId()+"==-==");
        	Map<String,String> paramterMaps = Maps.newHashMap();
        	paramterMaps.put("watthourId", list.get(i).getId());
        	List<WatthourMeterVO> lists=watthourMeterDao.selectTime(paramterMaps); //查询本次拍照时间
        	System.out.println(lists.size()+"ppppp");
        	if(lists.size()>0){
        		for(int j=0;j<lists.size();j++){
        			if(lists.get(j).getTheTakePhotosTime()!=null){
            			System.out.println(lists.get(j).getTheTakePhotosTime()+"本次拍照时间");
                    	list.get(i).setTakePhotosTime(lists.get(j).getTheTakePhotosTime()); //将最近一次的本次拍照时间赋予拍照时间	
            		break;
        			} 
        		}
        		     	
        	}
        	if(lists.size()>0){
        		for(int j=0;j<lists.size();j++){
        			if(lists.get(j).getMaxReadings()!=null){
            			System.out.println(lists.get(j).getMaxReadings()+"最大读数");
                    	list.get(i).setMaxReadings(lists.get(j).getMaxReadings()); //将最近一次的本次拍照时间赋予拍照时间
            		break;
        			} 
        		}
        		     	
        	}
        	
        	//如果是智能电表，需要计算三个值
        	//电表历史报销平均单价；
        	//电表历史报销平均日电量；
        	//电表历史报销平均日电费；
        	
        	if(list.get(i).getPtype() == 1){
        		//通过报账点id 查询出报销成功的历史单价总和，历史总电量，历史总金额，历史总天数
        		Map<String,String> hisMap = Maps.newHashMap();        
                hisMap.put("siteId",siteId);
                BigDecimal hisTotalAmount = new BigDecimal("0");
                BigDecimal hisTotalEleciric = new BigDecimal("0");
                BigDecimal hisDayAmmeter = new BigDecimal("0");
        		List<WatthourExtendVO> findHisSiteInfo = watthourMeterDao.findHisSiteInfo(hisMap);
        		for (int j = 0; j < findHisSiteInfo.size(); j++) {
        			 hisTotalAmount = hisTotalAmount.add(new BigDecimal(findHisSiteInfo.get(i).getTotalAmount())) ;//电表总金额
					 hisTotalEleciric = hisTotalEleciric.add(new BigDecimal(findHisSiteInfo.get(i).getTotalEleciric())) ;//总电量
					 hisDayAmmeter = hisDayAmmeter.add(new BigDecimal(findHisSiteInfo.get(i).getDayAmmeter())) ;//用电天数
				}
        		String histUnitPrice = "";
        		if(hisTotalEleciric.compareTo(BigDecimal.ZERO)!=0){
        			 histUnitPrice  = hisTotalAmount.divide(hisTotalEleciric,2)+"";//历史平均单价
        		}
        		String histDayEleNum = "";
        		String histDayElePrice = "";
        		if(hisDayAmmeter.compareTo(BigDecimal.ZERO)!=0){
        			 histDayEleNum = hisTotalEleciric.divide(hisDayAmmeter,2)+"";//历史平均日电量
        			 histDayElePrice = hisTotalAmount.divide(hisDayAmmeter,2)+"";//历史平均日电费
        		}
        		
        		list.get(i).setHistUnitPrice(histUnitPrice);
        		list.get(i).setHistDayEleNum(histDayEleNum);
        		list.get(i).setHistDayElePrice(histDayElePrice);
        	}
        }
        return list;
    }

    /**
     * @Description: 保存电表扩展信息
     * @param : electrictyId电费录入ID
     * @return :
     * @throws
    */
    @Override
    public void saveWatthourExtend(WatthourExtendVO[] watthourMeterVOs,String electrictyId) {
        for(WatthourExtendVO watthourExtendVO:watthourMeterVOs) {
            String id = StringUtils.getUUid();
            watthourExtendVO.setExTendId(id);              
           if(watthourExtendVO.getBackcalculationPrice()!=null){
        	   watthourExtendVO.setUnitPrice("");
           }
            watthourMeterDao.saveWatthourExtend(watthourExtendVO);//保存电表信息(SYS_WATTHOUR_EXTEND表)          
           // watthourMeterDao.updateWatthourMeter(watthourExtendVO);//修改电表拍照时间(SYS_WATTHOUR_METER表)
            Map<String,String> paramterMap = Maps.newHashMap();
            paramterMap.put("id",StringUtils.getUUid());
            paramterMap.put("sysEleciricityId",electrictyId);
            paramterMap.put("sysWatthourExtendId",id);
            watthourMeterDao.saveInMiddle(paramterMap);
        }
    }

    /**
     * @Description: 删除电表扩展信息
     * @param :
     * @return :
     * @throws
    */
    @Override
    public void deleteMiddleWatthour(String id) {
        watthourMeterDao.deleteMilldeWatthour(id);
    }

    @Override
    public List<String> findWatthourExtendIDs(String id) {
        return watthourMeterDao.findWatthourExtendIDs(id);
    }

    @Override
    public void deleteWatthourExtends(List<String> ids) {
        watthourMeterDao.deleteWatthourExtends(ids);
    }

    /**
     * 查询分页搜索
     */
	@Override
	public List<WatthourMeterVO> queryListPage(WatthourMeterVO VO, PageUtil<WatthourMeterVO> pageUtil) {
		Map<String, Object> paramMap = Maps.newHashMap();
		if (null != VO) {
			setMap(paramMap, VO, pageUtil);
		}
		return watthourMeterDao.getPageList(pageUtil);
	}

	/**   
	 * @Description: 设置查询参数    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, WatthourMeterVO VO, PageUtil<WatthourMeterVO> pageUtil) {
		if (VO.getCityId() != null) {
			paramMap.put("CityId", VO.getCityId());
		}
		if (VO.getCountyId() != null) {
			paramMap.put("CountyId", VO.getCountyId());
		}
		if (VO.getId() != null) {
			paramMap.put("Id", VO.getId());
		}
		if (VO.getAccountName() != null) {
			paramMap.put("AccountName", VO.getAccountName());
		}
		if (VO.getCode() != null) {
			paramMap.put("code", VO.getCode());
		}

		pageUtil.setObj(paramMap);
	}
	
	/**
	 * 通过ID查找单数据
	 */
	@Override
	public WatthourMeterVO selectById(String id) {
		return watthourMeterDao.selectById(id);
	}

	/**
	 * 批量删除
	 */
	@Override
	public void delete(List<String> IdList) {
		watthourMeterDao.delete(IdList);
	}

	/**
	 * 保存或更新
	 */
	@Override
	public void saveOrUpdate(WatthourMeterVO VO) {
		watthourMeterDao.saveOrUpdate(VO);
	}

	@Override
	public WatthourMeterVO geteleinfo(String id) {
		WatthourMeterVO geteleinfo = watthourMeterDao.geteleinfo(id);
		return geteleinfo;
	}
	

}
