package com.audit.modules.electricity.dao;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.*;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.workflow.entity.TowerElectricityFlowVo;

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
public interface TowerElectricityDao {
    List<TowerElectrictyVO> queryList(@Param("map") Map<String, Object> map);

    Long queryListCount(@Param("map") Map<String, Object> map);
    
    //删除超标信息表中的数据
    void deleteBenchmarkByTWID(String twElectricityId);
    
    //向超标信息表中添加数据
    
    void saveBenchmark(TowerEleBenchmark twEleBenchmarkEntity);

    List<Map<String, Object>> queryELECIRICAndTotalAmount(List<String> ids);

    void deleteByIDs(List<String> ids);

    ElectricyBaseVO findBySiteID(Map<String, String> paramMap);//根据报账点ID获取想关联数据

    //塔维保存稽核单
    void saveElectricty(TowerSaveEntities towerSaveEntities);

    void updateSubmitPerson(Map<String, Object> paramMap);
    
    void addDEC(Map<String,Object> paramMap);

    List<TowerElectrictyVO> queryByIDs(List<String> ids);

    void updateElectricty(TowerSaveEntities towerSaveEntities);

    void updateStatus(@Param("map") Map<String, Object> map);

    void saveTowerWatthour(TowerWatthourMeterVO towerWatthourMeterVO);

    void saveTowerMidWatthour(List<SysTowerMidWatthour> sysTowerMidWatthours);

    void deleteTowerWatthourByTowerID(List<String> idList);

    void deleteMidWatthourByTowerID(List<String> idList);

    TowerSaveVO findOneByID(Map<String, String> paramMap);

    List<TowerWatthourMeterVO> findTowerWatthourByTowerID(Map<String, String> paramMap);

    Double queryTotalAmountByTowerIDs(List<String> tds);
    
    //根据铁塔站址编码获取对应机房id
    public List<String> getRoomsByTowerId(Map<String,String> param);
    
  //根据铁塔编号查询ZTO类电器的额定功率之和
    Double queryPowerRatingToZTO(String sysTowerSitId);
    
  //根据铁塔编号查询ZTTN类电器的额定功率之和
    Double queryPowerRatingToZTTN(String sysTowerSitId);
    
  //根据铁塔编号查询ZWB类电器的额定功率之和
    Double queryPowerRatingToZWB(String sysTowerSitId);
    
  //根据铁塔编号查询ZWEN类电器的额定功率之和
    Double queryPowerRatingToZWEN(String sysTowerSitId);
    
  //根据铁塔编号查询ZWLR类电器的额定功率之和
    Double queryPowerRatingToZWLR(String sysTowerSitId);
    
  //根据铁塔编号查询ZWN类电器的额定功率之和
    Double queryPowerRatingToZWN(String sysTowerSitId);
    
    //根据铁塔id获取地市情况
    CityNameVO getCityById(String id);

    List<TowerElectrictyVO> queryTowerElBySubmitId(@Param("subID")Integer subID);

	/**   
	 * @Description: TODO  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<Map<String, Object>> stasticStatusBySubmitPerson(String userId);

	/**   
	 * @Description: TODO  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<Map<String, Object>> stasticStatusByCreatePerson(Map<String,String> params);

    void saveTowerMidCostcenter(SysTowerMidCostcenter sysTowerMidCostcenter);

    void saveTowerMidSupplier(SysTowerMidSupplier sysTowerMidSupplier);

    void updateTowerMidCostcenter(SysTowerMidCostcenter sysTowerMidCostcenter);

    void updateTowerMidSupplier(SysTowerMidSupplier sysTowerMidSupplier);

    /**
     * 根据稽核单ID列表，获取稽核单电表信息
     * @param eleIds
     * @return
     */
    List<ElectricityWatthourEntity> findElectricityWatthourByEleIds(List<String> eleIds);

    Integer checkSerialNumber(String serialNumber);   
    /**
	 * 导出Excel
	 * @param 
	 * @return
	 */
	public List<TowerElectrictyExcelVO> exportExcel(Map<String,Object> map);
    
    
    public TowerWatthourMeterVO getMt(String sid);

	List<String> getOldEle(TowerElectricityFlowVo param);
}
