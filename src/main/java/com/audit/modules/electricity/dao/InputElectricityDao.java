package com.audit.modules.electricity.dao;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.*;
import com.audit.modules.reimbursementgroup.entity.ReimbursementVO;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.system.entity.SysFileVO;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author : JIADU
 * @Description : 电费录入DAO
 * @date : 2017/3/7
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface InputElectricityDao {
	List<ElectrictyListVO> queryList(@Param("map") Map<String, Object> map);

	 List<String> selectSysRg(Map<String, Object> map);//根据经办人userid查询报账组
	
	Long queryListCount(@Param("map")Map<String, Object> map);

	void deleteByIDs(List<String> ids);
	
	
	
	    
	List<String> findElectricityAmountSum(Map<String, String> paramMap);//根据报账点ID获取电费金额
	    
	String findOtherCostSum(Map<String, String> paramMap);//根据报账点ID获取其他金额
	    
	List<String>  findTaxAmountSum(Map<String, String> paramMap);//根据报账点ID获取税金金额

	ElectrictyVO findOneByID(Map<String, String> paramMap);//根据电费ID（SYS_ELECTRICITY的ID）获取稽核单数据
	ElectrictyVO findOneByID11(Map<String, String> paramMap);//根据电费ID（SYS_ELECTRICITY的ID）获取稽核单数据
	
	String findInstanceId(Map<String, String> paramMap);//根据电费ID（SYS_ELECTRICITY的ID）获取流程ID
	
	List<ExpenseAccountDetails> findExpenseAccountDetails(Map<String, String> paramMap);//根据电费ID（SYS_ELECTRICITY的ID）获取报销单明细数据

	ElectricyBaseVO findBySiteID(Map<String, String> paramMap);//根据报账点ID获取想关联数据
	
	List<ElectricyBaseVO> findByCreateDate(Map<String, String> paramMap);//根据报账点ID获取想关联数据

	void saveElectricty(ElectrictySaveVO electrictySaveVO);//保存电费信息(添加SYS_ELECTRICITY表信息)

    List<SysFileVO> findFileByElID(Map<String, String> paramMap);

    List<ElectrictyVO> findSiteIdByEid(List<String> elids);

    void updateSubmitPerson(Map<String, String> paramMap);

    List<ElectrictyListVO> queryByIDs(List<String> ids);
    List<ElectrictyListVO> zqueryByIDs(List<String> ids);

    ElectricityBenchmark queryElectricityBenchmarkByElectricityId(String electricityId);

    void updateElectricty(ElectrictySaveVO electrictySaveVO);

    void updateStatus(Map<String, String> paramMap);

    ElectrictySaveVO queryTotalAmount();

    List<WatthourExtendVO> queryElectricityBySiteID(@Param("siteID") String siteID);
    
    List<WatthourExtendVO> queryZElectricityBySiteID(@Param("siteID") String siteID);

    void saveEleMidInvoice(ElectrictyMidInvoice electrictyMidInvoice);

    List<ElectrictyMidInvoice> findByEleID(@Param("eleID") String eleID);

    void deleteEleMidInvoiceByEleID(@Param("eleID") String eleID);
    
    public void upSiteById(Map<String, Object> map);

    /**
     * @param userId
     * @param :
     * @return :
     * @throws
     * @Description: 经办人统计稽核单状态
     */
    List<Map<String, Object>> stasticStatusByCreatePerson(@Param("userId") String userId);

    /**
     * @param userId
     * @param :
     * @return :
     * @throws
     * @Description: 报销发起人统计稽核单状态
     */
    List<Map<String, Object>> stasticStatusBySubmitPerson(@Param("userId") String userId);

    /**
     * 根据稽核单ID列表，获取稽核单电表信息
     * @param eleIds
     * @return
     */
    List<ElectricityWatthourEntity> findElectricityWatthourByEleIds(List<String> eleIds);

    Integer checkSerialNumber(String serialNumber);
    
    
    public ElectrictyVO getCpBySerNum(String serialNumber);
    
    public ElectrictyVO getCpById(String id);
    
    public List<ElectrictyVO> getall(Map<String,Integer> map);
    
    public List<Map<String,Object>> getExcelByEleId(String id);
    
    public List<ElectrictyVO> getZall();
    
    public void addDEC(Map<String, Object> map);
    
    public void delupfile(String id);
    
    
    public String getaccoutsiteidbyeleid(String id);
    
    public WatthourMeterVO getnewtime(String id);
    
    public WatthourMeterVO getelenewtime(String id);
    
    public void delSEMS(Map<String,Object> map);
    
    public long checkSubmitIsOneyOne(Map<String,Object> map);

  //根据报账点查询对应的机房
	public List<String> checkRoomIdByAccountId(Map<String, String> param);
	
	//根据机房id和稽核单id于中间表中对机房进行锁定
	//public void lockingRoom(Map<String,String> map);
	
	//根据机房id对中间表中机房进行解锁
	//public void unLockingRoom(String roomID);
	
	
	
	//查询自维机房【未退网】ZTTN类电器的额定功率之和
	public Double getZTTNPower_Online(String roomId);
		//查询自维机房【退网】ZTTN类电器的额定功率之和
	public Double getZTTNPower(String roomId);
	
	//查询自维机房【未退网】ZWB类电器的额定功率之和
	public Double getZWBPower_Online(String roomId);
		//查询自维机房【退网】ZWB类电器的额定功率之和
	public Double getZWBPower(String roomId);
	
	//查询自维机房【未退网】ZWEN类电器的额定功率之和
	public Double getZWENPower_Online(String roomId);
		//查询自维机房【退网】ZWEN类电器的额定功率之和
	public Double getZWENPower(String roomId);
	
	//查询自维机房【未退网】ZWLR类电器的额定功率之和
	public Double getZWLRPower_Online(String roomId);
		//查询自维机房【退网】ZWLR类电器的额定功率之和
	public Double getZWLRPower(String roomId);
	
	//查询自维机房【未退网】ZWN类电器的额定功率之和
	public Double getZWNPower_Online(String roomId);
		//查询自维机房【退网】ZWN类电器的额定功率之和
	public Double getZWNPower(String roomId);
	
	//查询自维机房【未退网】ZTO类电器的额定功率之和
	public Double getZTOPower_Online(String roomId);
		//查询自维机房【退网】ZTO类电器的额定功率之和
	public Double getZTOPower(String roomId);
	
    public List<String> getOldEle(ElectricityFlowVo ele);


}
