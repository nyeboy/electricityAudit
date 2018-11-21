package com.audit.modules.payment.dao;
/**
 * 电费稽核预付中间表
 */

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.payment.entity.EleMidPaymentVO;

@Component
@MybatisRepostiory
public interface EleMidPaymentDao {
	
	//创建中间表数据
	void add(EleMidPaymentVO eleMidPaymentVO);
	
	//根据稽核单id查看预付信息
	List<EleMidPaymentVO> getEleMidPaymentByEleID(String electricityID);
	
	//根据稽核单id和预付单id查核销金额
	String getExpenseAmountByEIdAndPId(EleMidPaymentVO eleMidPaymentVO);
	
	//根据稽核单id和预付单id修改核销金额
	void updateEleMidPaymentByEIdAndPId(EleMidPaymentVO eleMidPaymentVO);
	
	//根据稽核单id和预付单id删除中间表记录
	void deleteEleMidPaymentByEIdAndPId(EleMidPaymentVO eleMidPaymentVO);
}