package com.audit.modules.electricity.service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.*;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.towerbasedata.psu.entity.TowerPSUVO;
import com.audit.modules.workflow.entity.TowerElectricityFlowVo;

import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description : 电费录入service
 * @date : 2017/3/7
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface TowerElectricityService {

    void queryList(PageUtil<TowerElectrictyVO> page, TowerElectrictyEntities towerElectrictyEntities, UserVo userInfo);

    /**
	 * 导出Excel
	 * @param ownerIds
	 * @return
	 */
	public List<TowerElectrictyExcelVO> exportExcel(Map<String,Object> map);
    
    TowerToAddVO toAdd(UserVo userInfo);

    ResultVO deleteByIDs(String[] ids);

    TowerSaveVO findOneByID(String id);

    ElectricyBaseVO findBySiteID(String siteID);

    Map<String,Object> checkPowerRatingByTowerID(String id);

    ResultVO saveElectricty(TowerSaveEntities towerSaveEntities, UserVo userInfo);
    
    Map<String, Object> checkPowerRating(TowerSaveEntities towerSaveEntities);

    void updateElectricty(TowerSaveEntities towerSaveEntities, UserVo userInfo);

    ResultVO updateStatus(String[] ids, Integer status);

    List<Map<String, Object>> queryElectricity(List<String> ids);

    ResultVO batchSubmit(String[] ids, UserVo userInfo);

    Double queryTotalAmountByTowerIDs(List<String> tid);

    List<TowerElectrictyVO> queryTowerElBySubmitId(Integer subID);
    
    //根据铁塔站址编码，获取对应在网和退网的机房数量
    public RoomIsOnlineVO getSiteNoRoomIsOnline(String siteNo);

	/**   
	 * @Description: 统计稽核单状态 建单人（经办人）   
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<Map<String, Object>> stasticStatusByCreatePerson(String userId);

	/**   
	 * @Description:  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<Map<String, Object>> stasticStatusBySubmitPerson(String userId);
	//统计报销单状态 提交人（经办人） 
	List<Map<String, Object>> stasticStatusSubmitByCreatePerson(String userId);
	//统计报销单状态 提交人（发起人） 
	List<Map<String, Object>> stasticStatusSubmitBySubmitPerson(String userId);

	ResultVO checkSerialNumber(String serialNumber);
	
	public TowerWatthourMeterVO getMt(String sid);
	
	//塔维超标杆推送emos
	String emos(String id, String cityName, String accountSiteName, String cPowerNum, String cPowerDec);

	List<String> getOldEle(TowerElectricityFlowVo param);
}
