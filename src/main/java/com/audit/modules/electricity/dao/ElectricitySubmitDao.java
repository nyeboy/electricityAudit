package com.audit.modules.electricity.dao;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.EleMiddleSubmitVO;
import com.audit.modules.electricity.entity.ElectricitySubmitVO;
import com.audit.modules.electricity.entity.SubmitProcess;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface ElectricitySubmitDao {
    void createEleSubmit(ElectricitySubmitVO electricitySubmitVO);
    
    void updateEleSubmit_1(ElectricitySubmitVO electricitySubmitVO);

    void saveEleMidlleSubmit(List<EleMiddleSubmitVO> eleMiddleSubmitVOs);

    List<ElectricitySubmitVO> queryList(PageUtil<ElectricitySubmitVO> pageUtil);
    List<ElectricitySubmitVO> queryListExcel(PageUtil<ElectricitySubmitVO> pageUtil);

    ElectricitySubmitVO queryDetail(@Param("subID") String subID);

    List<EleMiddleSubmitVO> queryMiddleBySubID(@Param("subID") String subID);

    void deleteBySubID(@Param("subID") String subID);

    void deleteEleMidBySubID(@Param("subID") String subID);

    void updateStatus(@Param("map") Map<String, Object> map);
    
    void updateStatusByNo(@Param("map") Map<String, Object> map);
    
	ElectricitySubmitVO queryBysubmitNo(@Param("submitNo") String submitNo);
	
	public ElectricitySubmitVO getCpById(String id); 
	
	public EleMiddleSubmitVO getEidBEsId(String sysEleSubmitId);
	
	public List<WatthourExtendVO> getMt(String sid);
	
	public int addProcess(SubmitProcess sp);
	
	public List<SubmitProcess> getProcessBySI(String submitId);
	
	public void updateProcess(Map<String, Object> map);
	
	public ElectricitySubmitVO queryById(String id);
}
