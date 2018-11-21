package com.audit.modules.invoice.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.invoice.dao.InvoiceDao;
import com.audit.modules.invoice.entity.InvoiceVO;
import com.audit.modules.invoice.service.InvoiceService;
import com.google.common.collect.Maps;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Service
public class InvoiceServiceImpl implements InvoiceService{

    @Autowired
    private InvoiceDao invoiceDao;

    @Override
    public List<InvoiceVO> queryAllInvoice() {
        return invoiceDao.queryAllInvoice();
    }

    /**
     * 查询分页搜索
     */
	@Override
	public List<InvoiceVO> queryInvoiceListPage(InvoiceVO contractVO, PageUtil<InvoiceVO> pageUtil) {
		Map<String, Object> paramMap = Maps.newHashMap();
		if (null != contractVO) {
			setMap(paramMap, contractVO, pageUtil);
		}
		return invoiceDao.getPageInvoiceList(pageUtil);
		
	}

	/**   
	 * @Description: 设置查询参数    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, InvoiceVO invoiceVO, PageUtil<InvoiceVO> pageUtil) {
		if (invoiceVO.getId() != null) {
			paramMap.put("ID", invoiceVO.getId());
		}
		if (invoiceVO.getBillType() != null) {
			paramMap.put("billType", invoiceVO.getBillType());
		}
		if (invoiceVO.getCreateDateStr()!= null) {
			paramMap.put("createDateStr", invoiceVO.getCreateDateStr());
		}
		pageUtil.setObj(paramMap);
	}
	
	/**
	 * 通过ID查找单发票
	 */
	@Override
	public InvoiceVO selectInvoiceById(String invoiceId) {
		return invoiceDao.selectByInvoiceId(invoiceId);
	}

	/**
	 * 批量删除发票
	 */
	@Override
	public void deleteInvoice(List<String> IdList) {
		invoiceDao.deleteInvoice(IdList);
	}

	/**
	 * 保存或更新发票
	 */
	@Override
	public void saveOrUpdateInvoice(InvoiceVO invoice) {
		invoiceDao.saveOrUpdateInvoice(invoice);
	}

	/**   
	 * @Description: 查询发票类型  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public List<String> queryBillType() {
		return invoiceDao.queryBillType();
	}
	
	/**   
	 * @Description: 查询所有发票
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	@Override
	public List<InvoiceVO> queryAll() {
		return invoiceDao.queryAllInvoice();
	}
}
