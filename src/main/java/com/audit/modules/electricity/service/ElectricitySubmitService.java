package com.audit.modules.electricity.service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.EleMiddleSubmitVO;
import com.audit.modules.electricity.entity.ElectricitySubmitVO;
import com.audit.modules.electricity.entity.SubmitProcess;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.text.ParseException;
import java.util.List;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface ElectricitySubmitService {
    ResultVO createEleSubmit(ElectricitySubmitVO electricitySubmitVO, HttpServletRequest request);

    ResultVO createEleSubmit_1(ElectricitySubmitVO electricitySubmitVO, HttpServletRequest request);
    
    void queryList(ElectricitySubmitVO electricitySubmitVO, PageUtil<ElectricitySubmitVO> pageUtil) throws ParseException;
    void queryListExcel(ElectricitySubmitVO electricitySubmitVO, PageUtil<ElectricitySubmitVO> pageUtil,HttpServletResponse response) throws ParseException;
    ResultVO queryDetail(String subID);

    ResultVO deleteBySubID(String subID);

    ResultVO updateStatus(Integer status, String ids[]);
    
    /**
	 * 通过流水号更新状态值
	 * 
	 * @param status 状态值
	 * @param submitNos 电费提交单号
	 * @return 更新结果
	 */
	ResultVO updateStatusByNo(Integer status, String submitNos[]);
	
	/**
	 * 通过稽核单号查询
	 * 
	 * @param submitNo 稽核单号
	 * @return 电费提交单
	 */
	ElectricitySubmitVO queryBysubmitNo(String submitNo);
	
	public ElectricitySubmitVO getCpById(String id); 
	
	public EleMiddleSubmitVO getEidBEsId(String sysEleSubmitId);
	
	public List<WatthourExtendVO> getMt(String sid);
	public int addProcess(SubmitProcess sp);
	public List<SubmitProcess> getProcessBySI(String submitId);
	
	public ElectricitySubmitVO queryById(String id);
	
}
