package com.audit.modules.invoice.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.invoice.entity.InvoiceVO;
import com.audit.modules.invoice.service.InvoiceService;

/**
 * @author : bingliup
 * @Description : 发票管理
 * @date : 2017/4/20 Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/invoice")
public class InvoiceController {

	@Autowired
	private InvoiceService invoiceService;

	/**
	 * @Description:可分页查询列表
	 * @param request
	 * @param pageNo
	 * @param pageSize
	 * @return 列表
	 */
	@RequestMapping("/queryListPage")
	@ResponseBody
	public ResultVO queryListPage(HttpServletRequest request, Integer pageNo, Integer pageSize) {
		PageUtil<InvoiceVO> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		InvoiceVO invoiceVO = new InvoiceVO();
		invoiceVO = getInvoiceVO(request, invoiceVO);
		invoiceService.queryInvoiceListPage(invoiceVO, pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	/**
	 * @Description:查询发票类型
	 * @param request
	 * @param pageNo
	 * @param pageSize
	 * @return 列表
	 */
	@RequestMapping("/queryBillType")
	@ResponseBody
	public ResultVO queryBillType() {
		List<String> typeList = new ArrayList<String> ();
		typeList =	invoiceService.queryBillType();
		return ResultVO.success(typeList);
	}
	/**
	 * @Description:查询所有发票
	 * @param request
	 * @param pageNo
	 * @param pageSize
	 * @return 列表
	 */
	@RequestMapping("/queryAll")
	@ResponseBody
	public ResultVO queryAll() {
		List<InvoiceVO> typeList = new ArrayList<InvoiceVO> ();
		typeList =	invoiceService.queryAll();
		return ResultVO.success(typeList);
	}

	/**
	 * 通过ID查找单发票
	 * @param request
	 * @return ResultVO
	 */
	@RequestMapping("/selectById")
	@ResponseBody
	public ResultVO selectById(HttpServletRequest request) {
		InvoiceVO invoiceVO = new InvoiceVO();
		String _Id = request.getParameter("id");
		if (null == _Id || _Id.equals("")) {
			return ResultVO.failed("参数错误");
		}
		invoiceVO = invoiceService.selectInvoiceById(_Id);
		if (invoiceVO != null) {
			return ResultVO.success(invoiceVO);
		} else {
			return ResultVO.failed("资源未找到");
		}
	}

	/**
	 * @Description: 删除发票
	 * @param request
	 * @return
	 */
	@RequestMapping("/delete")
	@ResponseBody
	public ResultVO delete(HttpServletRequest request) {
		List<String> IdList = new ArrayList<String>();
		String[] IdArray = null;
		String Ids = request.getParameter("Ids");
		if (null == Ids || Ids.equals("")) {
			return ResultVO.failed("参数错误");
		}
		IdArray = Ids.split(",");
		for (String Id : IdArray) {
			IdList.add(Id);
		}
		if (IdList.size() > 0) {
			invoiceService.deleteInvoice(IdList);
		}
		return ResultVO.success();
	}


	/**
	 * @Description 保存或更新信息
	 * @param request
	 * @return
	 */
	@RequestMapping("/saveOrUpdate")
	@ResponseBody
	public ResultVO saveOrUpdate(HttpServletRequest request) {
		InvoiceVO invoiceVO = new InvoiceVO();
		invoiceVO = getInvoiceVO(request, invoiceVO);
		if (null == invoiceVO.getBillTax() || invoiceVO.getBillTax().equals("") 
				|| null == invoiceVO.getBillType() || invoiceVO.getBillType().equals("")) {
			return ResultVO.failed("参数错误");
		}
		if(null == invoiceVO.getId() || invoiceVO.getId().equals("")){
			invoiceVO.setId(StringUtils.getUUid());
			invoiceVO.setCreateDate(new Date());
			invoiceVO.setModifyDate(new Date());
		}else {
			invoiceVO.setModifyDate(new Date());
		}
		invoiceService.saveOrUpdateInvoice(invoiceVO);
		
		return ResultVO.success();
	}

	/**
	 * 获取前端传递的发票信息
	 * 
	 * @param request
	 * @return 发票信息
	 */
	public InvoiceVO getInvoiceVO(HttpServletRequest request, InvoiceVO invoiceVO) {

		String id = request.getParameter("id");
		String billTax = request.getParameter("billTax");
		String billType = request.getParameter("billType");
		String billCoefficient = request.getParameter("billCoefficient");
		String createDateStr = request.getParameter("createDateStr");
		
		if (null != id && !id.equals("")) {
			invoiceVO.setId(id);
		}
		if (null != billTax && !billTax.equals("")) {
			invoiceVO.setBillTax(billTax);;
		}
		if (null != billType && !billType.equals("")) {
			invoiceVO.setBillType(billType);
		}
		if (null != billCoefficient && !billCoefficient.equals("")) {
			invoiceVO.setBillCoefficient(billCoefficient);
		}
		if (null != createDateStr && !createDateStr.equals("")) {
			invoiceVO.setCreateDateStr(createDateStr);
		}
		
		return invoiceVO;
	}

	/**
	 * Java String和Date的转换
	 * 
	 * @param dateString
	 * @return Date
	 */
	public Date StringToDate(String dateString) {
		Date date = null;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			date = sdf.parse(dateString);
		} catch (ParseException e) {
			return null;
		}
		return date;
	}

}
