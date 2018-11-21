package com.audit.modules.electricity.service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.*;
import com.audit.modules.electricity.vo.ElectricityBenchmarkCheckVO;
import com.audit.modules.reimbursementgroup.entity.ReimbursementVO;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.audit.modules.workflow.entity.FinanceExpenseResponse;

import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description : 电费录入service
 * @date : 2017/3/7
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface InputElectricityService {
	//其他费用
	String findOtherCostSum(String id);
	//电费金额
	String findElectricityAmountSum(String id);
	//税金金额
	String findTaxAmountSum(String id);
	
    void queryList(PageUtil<ElectrictyListVO> page, ElectrictyVO electrictyVO, UserVo userInfo);

    //查询报账组
    List<String> selectSysRg(UserVo userInfo);
    
    ElectrictyToAddVO toAdd(UserVo userInfo);

    ResultVO deleteByIDs(String[] ids);

    ElectrictyVO findOneByID(String id);

    String emos(String id,String cityName,String accountSiteName,String cPowerNum,String cPowerDec);
    
    
    ElectrictyVO findOneByID11(String id);
    ElectrictyVO findOneByIDDetails(String id);
    
    ElectricyBaseVO findBySiteID(String siteID);

    ResultVO saveElectricty(ElectrictySaveVO electrictySaveVO, UserVo userInfo);

    void updateElectricty(ElectrictySaveVO electrictySaveVO);

    PageUtil<SiteInfoVO> queryByBlurred(String queryData, Integer pageNo, Integer pageSize, UserVo userInfo);

    ResultVO updateStatus(String id, Integer status);

    List<Map<String, Object>> queryElectricity(List<String> ids);

    ResultVO batchSubmit(String[] ids, UserVo userInfo);
    ResultVO zbatchSubmit(String[] ids, UserVo userInfo);

    List<ElectrictyVO> findSiteIdByEid(List<String> eids);

    List<ElectrictyListVO> queryByIDs(List<String> ids);
    
    WatthourMeterVO getelenewtime(String id);

    ElectrictySaveVO queryTotalAmount();
    
    //根据报账点id获取报账点对应机房的锁定情况
    public RoomIsOnlineVO getAccountRoomIsOnline(String accountId);
    
    public void upSiteById(Map<String, Object> map);

    /**
     * @param userId
     * @param :
     * @return :
     * @throws
     * @Description: 经办人统计稽核单状态
     */
    List<Map<String, Object>> stasticStatusBySubmitPerson(String userId);

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 报销发起人统计稽核单状态
     */
    List<Map<String, Object>> stasticStatusByCreatePerson(String userId);

    /**
     * 稽核是否超标杆
     * @param electricityIds 稽核单IDS
     * @param type 类型。1 自维；2 塔维
     * @return
     */
    List<ElectricityBenchmarkCheckVO> check(List<String> electricityIds, int type);

    
    ResultVO checkElePowerRating(ElectrictySaveVO electrictySaveVO);
	/**   
	 * @Description:   报销发起人统计报销单状态
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<Map<String, Object>> stasticSubmitStatusBySubmitPerson(String userId);

	/**   
	 * @Description: 经办人统计报销单状态  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<Map<String, Object>> stasticSubmitStatusByCreatePerson(String userId);

    ResultVO checkSerialNumber(String serialNumber);
    
    public ElectrictyVO getCpBySerNum(String seid);
    
    public ElectrictyVO getCpById(String id);
    
    public List<ElectrictyVO> getall(Map<String,Integer> map);
    
    public List<Map<String,Object>> getExcelByEleId(String id);
    
    public List<ElectrictyVO> getZall();
    
    public void addDEC(Map<String, Object> map);
    
    public void delupfile(String id);
    
    public void delSEMS(Map<String,Object> map,ElectricitySubmitVO electricitySubmitVO);
    
    public boolean checkSubmitIsOneyOne(String submitID);
    
    public String getaccoutsiteidbyeleid(String id);
    
    public WatthourMeterVO getnewtime(String id);
	List<String> getOldEle(ElectricityFlowVo ele);
}
