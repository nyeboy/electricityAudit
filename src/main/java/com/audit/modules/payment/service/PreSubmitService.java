package com.audit.modules.payment.service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.payment.entity.ElectricitySubmitVO;
import com.audit.modules.payment.entity.PreMidSubmit;
import com.audit.modules.payment.entity.PreSubmit;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.List;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface PreSubmitService {
    ResultVO createEleSubmit(ElectricitySubmitVO electricitySubmitVO, HttpServletRequest request);

    void queryList(ElectricitySubmitVO electricitySubmitVO, PageUtil<ElectricitySubmitVO> pageUtil) throws ParseException;

    ResultVO queryDetail(String subID);
//
//    ResultVO deleteBySubID(String subID);
//
    ResultVO updateStatus(Integer status, String ids[]);
    
    public PreSubmit getPreSubBySubNO(String submitNo);
    
    public List<String> getSpIds(String spsid);
//    
//    /**
//	 * 通过流水号更新状态值
//	 * 
//	 * @param status 状态值
//	 * @param submitNos 电费提交单号
//	 * @return 更新结果
//	 */
//	ResultVO updateStatusByNo(Integer status, String submitNos[]);
//	
//	/**
//	 * 通过稽核单号查询
//	 * 
//	 * @param submitNo 稽核单号
//	 * @return 电费提交单
//	 */
//	ElectricitySubmitVO queryBysubmitNo(String submitNo);
//	
	
	
	
}
