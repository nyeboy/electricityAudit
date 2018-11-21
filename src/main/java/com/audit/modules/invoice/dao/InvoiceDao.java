package com.audit.modules.invoice.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.invoice.entity.InvoiceVO;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface InvoiceDao {
  
	List<InvoiceVO> queryAllInvoice();

    /**
     * 查询、分布、搜索
     * @param pageUtil
     * @return
     */
 	List<InvoiceVO> getPageInvoiceList(PageUtil<InvoiceVO> pageUtil);
 	
 	/**
 	 * 通过Id单个查询
 	 * @param ID
 	 * @return InvoiceVO
 	 */
 	InvoiceVO selectByInvoiceId(String invoiceId);
 	
 	/**
 	 * 删除
 	 * @param list
 	 */
 	void deleteInvoice(List<String> IdList);
 	
 	/**
 	 * 新增、更新
 	 * @param Invoice
 	 */
 	void saveOrUpdateInvoice(InvoiceVO invoiceVO);

	/**   
	 * @Description: 查询发票类型  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<String> queryBillType();
}
