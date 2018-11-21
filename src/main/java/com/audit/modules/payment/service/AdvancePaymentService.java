package com.audit.modules.payment.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.payment.entity.ElectricityFlowVo;
import com.audit.modules.payment.entity.Sepcc;
import com.audit.modules.system.entity.SysFileVO;
import com.audit.modules.system.entity.UserVo;

/**
 * @Description : TODO(基站电费-预付提交：基础操作接口)
 *
 * @author : chentao
 * @date : 2017年4月10日
 *
 *       Copyright (c) 2017, IsoftStone All Right reserved.
 */

public interface AdvancePaymentService {

	// 查询预付列表
	List<AdvancePaymentVo> queryPaymentByPage(PageUtil<AdvancePaymentVo> page);

	// 删除被选中预付信息
	ResultVO deletePaymentById(String[] paymentNumber);

	// 更新预付信息
	ResultVO updatePayment(AdvancePaymentVo aPaymentVo);

	// 添加预付信息
	ResultVO addPayment(MultipartFile[] files, AdvancePaymentVo aPaymentVo, HttpServletRequest request);

	// 新增预付单（提交预付单）
	public int prepayAdd(AdvancePaymentVo aPaymentVo);

	// 提交、驳回(更新状态/备注)
	ResultVO submitOrReject(String paymentNumber, Integer status, String remark);

	// <!-- 模糊查省 id-->
	public String getProId(Sepcc sepcc);

	// <!-- 模糊查市 id-->
	public String getCitId(Sepcc sepcc);

	// <!-- 模糊查区 id-->
	public String getCouId(Sepcc sepcc);

	// 修改提交人信息
	public int updateSubmitMan(Map map);

	// 修改预付状态
	public int updateStatus(Map map);

	// 根据id查预付信息
	public AdvancePaymentVo getOneById(String id);

	public AdvancePaymentVo getOne(AdvancePaymentVo adp);

	// 查询预付列表
	public void queryList(PageUtil<AdvancePaymentVo> page, AdvancePaymentVo adp, UserVo userInfo);

	// 根据id查预付详情
	public AdvancePaymentVo getViewPrepayDetails(String id);

	// 查附件
	public List<SysFileVO> findFileByPrepayID(Map<String, String> map);

	// 修改预付单状态
	public int upPreStatus(Map<String, Object> map);

	// <!-- 根据id修改意见 -->
	public int upTalk(Map<String, String> map);

	// 查询预付表（列表显示）
	List<AdvancePaymentVo> queryByIDs(List<String> ids);

	public List<AdvancePaymentVo> getOneByUserId(Map<String, String> map);

	public void delPreByPaymetNumber(String paymentNumber);

	public List<AdvancePaymentVo> getOneBySupplyId(String supplyId);

	public int getPreNum(String submitManId);

	public int getPreSNum(String submitManId);

	public int getPreCNum(String submitManId);

	List<String> getOldEle(ElectricityFlowVo flowVo);

}
