package com.audit.modules.payment.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.payment.entity.ElectricityFlowVo;
import com.audit.modules.payment.entity.Sepcc;
import com.audit.modules.system.entity.SysFileVO;

/**   
 * @Description : TODO(基站电费-预付提交：基础操作接口)    
 *
 * @author : chentao
 * @date : 2017年4月10日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
@Component
@MybatisRepostiory
public interface AdvancePaymentDao {
	
	//查询预付列表
	List<AdvancePaymentVo> queryPaymentByPage(PageUtil<AdvancePaymentVo> page);
	
	//删除被选中预付信息
	void deletePaymentById(String [] paymentNumber);
	
	//更新预付信息 
	void updatePayment(AdvancePaymentVo aPaymentVo);
	
	//添加预付信息
	void addPayment(AdvancePaymentVo aPaymentVo);
	
	//更新预付单状态
	void submitOrReject(Map<String, String> parm);
	
	
	//新增预付单（提交预付单）
	public int prepayAdd(AdvancePaymentVo aPaymentVo);
	
	
	//<!-- 模糊查省 id-->
	public String getProId(Sepcc sepcc);
	//<!-- 模糊查市 id-->
	public String getCitId(Sepcc sepcc);
	//<!-- 模糊查区 id-->
	public String getCouId(Sepcc sepcc);
	//修改提交人信息
	public int updateSubmitMan(Map map);
	//修改预付状态
	public int updateStatus(Map map);
	//根据id查预付信息
	public AdvancePaymentVo getOneById(String id);
	
	public AdvancePaymentVo getOne(AdvancePaymentVo adp);
	//修改预付单状态
	public int upPreStatus(Map<String,Object> map);
	
	//<!-- 根据id修改意见 -->
	 public int upTalk(Map<String,String> map);
	 
	 public List<AdvancePaymentVo> getOneByUserId(Map<String, String> map);
	 
	 public void delPreByPaymetNumber(String paymentNumber);
	
//----------------------------------------查列表------------------------------------------
	List<AdvancePaymentVo> queryList(@Param("map") Map<String, Object> map);
	
	Long queryListCount(@Param("map")Map<String, Object> map);
	
//---------------查找详情------------------------------------------------------------------
	//根据id查预付详情
	public AdvancePaymentVo getViewPrepayDetails(String id);
	
	//查附件
	public List<SysFileVO> findFileByPrepayID(Map<String, String> map);
	
	List<AdvancePaymentVo> queryByIDs(List<String> ids);
	
	public List<AdvancePaymentVo>  getOneBySupplyId(String supplyId);
	
	public  int getPreNum(String submitManId);
	
	public  int getPreSNum(String submitManId);
	public  int getPreCNum(String submitManId);
	List<String> getOldEle(ElectricityFlowVo flowVo);
	
	
}
