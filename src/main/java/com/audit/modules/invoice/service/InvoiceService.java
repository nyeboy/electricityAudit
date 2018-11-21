package com.audit.modules.invoice.service;

import java.util.List;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.invoice.entity.InvoiceVO;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface InvoiceService {
    List<InvoiceVO> queryAllInvoice();
    
    /**   
	 * @Description:查询分页搜索
	 * @param :  Invoice
	 * @param :  pageUtil
	 * @return :     
	 * @throws  
	*/
 	List<InvoiceVO> queryInvoiceListPage(InvoiceVO contractVO, PageUtil<InvoiceVO> pageUtil);
 
 	/**
 	 * 通过ID查询
 	 * @param ID
 	 * @return
 	 */
 	InvoiceVO selectInvoiceById(String InvoiceId);
 	
 	/**
 	 * 单、批量删除
 	 * @param IdList
 	 */
 	void deleteInvoice(List<String> IdList);

 	/**
 	 * 添加、更新发票（可以部分属性为null）
 	 * @param record
 	 * @return
 	 */
 	void saveOrUpdateInvoice(InvoiceVO invoice);

	/**   
	 * @Description:  发票类型 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<String> queryBillType();

	/**   
	 * @Description: 查询所有发票  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<InvoiceVO> queryAll();
 	
}
