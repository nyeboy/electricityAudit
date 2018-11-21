package com.audit.modules.contract.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.contract.entity.ContractVO;
import com.audit.modules.contract.service.ContractService;

/**
 * @author : jiadu
 * @Description : 合同查询
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/contract")
public class ContractController {

    @Autowired
    private ContractService contractService;

    /**
     * @Description: 根据电表户号查询是否包干等参数
     * @param :      metersNumber
     * @return :    ContractVO
     * @throws
    */
    @RequestMapping("/queryByMeters")
    @ResponseBody
    public ContractVO queryByMeters(String metersNumber){
        return contractService.queryByMeters(metersNumber);
    }
    
	/**
	 * @Description:可分页查询合同列表
	 * @param :contractVO对象
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryListPage")
	@ResponseBody
	public ResultVO queryListPage(HttpServletRequest request, Integer pageNo, Integer pageSize) {
		PageUtil<ContractVO> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}else{
			return ResultVO.failed("缺少分页参数pageNo、pageSize.");
		}
		ContractVO contract = new ContractVO();;
		contract = getContractVO(request, contract);
        contractService.queryContractListPage(contract, pageUtil);
		return ResultVO.success(pageUtil);
	}
	/**
	 * @Description:查询合同列表excel下载
	 * @param :contractVO对象
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryListPageExcel")
	@ResponseBody
	public ResultVO queryListPageExcel(HttpServletRequest request,HttpServletResponse response) {
		PageUtil<ContractVO> pageUtil = new PageUtil<>();
		
		pageUtil.setPageNo(1);
		pageUtil.setPageSize(100000000);
		
		ContractVO contract = new ContractVO();;
		contract = getContractVO(request, contract);
        contractService.queryContractListPage(contract, pageUtil);
      //创建表格
  		XSSFWorkbook wb = new XSSFWorkbook();//创建表格
  		XSSFSheet aSheet = wb.createSheet("合同信息详情");//创建工作簿
  		int a = 0;
  		XSSFRow aRow = aSheet.createRow(a);
		aRow.createCell(0,1).setCellValue("合同编号");
		aRow.createCell(1,1).setCellValue("合同名称");
		aRow.createCell(2,1).setCellValue("合同生效日期");
		aRow.createCell(3,1).setCellValue("合同终止日期");
		aRow.createCell(4,1).setCellValue("是否包干");
		aRow.createCell(5,1).setCellValue("单价");
		aRow.createCell(6,1).setCellValue("包干价");
		aRow.createCell(7,1).setCellValue("分级审批记录");
		aRow.createCell(8,1).setCellValue("站点名称");
		if(pageUtil.getResults()!=null && pageUtil.getResults().size()!=0) {
			List<ContractVO> vos = pageUtil.getResults();
			for(ContractVO vo : vos) {
				a++;
				aRow = aSheet.createRow(a);
				aRow.createCell(0,1).setCellValue(vo.getContractNumber());
				aRow.createCell(1,1).setCellValue(vo.getContractName());
				aRow.createCell(2,1).setCellValue(vo.getStartDateStr());
				aRow.createCell(3,1).setCellValue(vo.getEndDateStr());
				aRow.createCell(4,1).setCellValue(vo.getIsClud());
				aRow.createCell(5,1).setCellValue(vo.getUnitPrice());
				aRow.createCell(6,1).setCellValue(vo.getCludPrice());
				aRow.createCell(7,1).setCellValue(vo.getIsUploadOverproof());
				aRow.createCell(8,1).setCellValue(vo.getSiteName());
			}
		}
		
		ServletOutputStream out = null;
		try {        
            out = response.getOutputStream();    
            String fileName = "合同信息详情.xls";// 文件名    
            response.setContentType("application/x-msdownload");    
            response.setHeader("Content-Disposition", "attachment; filename="    
                                                    + URLEncoder.encode(fileName, "UTF-8"));    
            wb.write(out);    
        } catch (Exception e) {    
            e.printStackTrace();    
        } finally {      
            try {       
                out.close();      
            } catch (IOException e) {      
                e.printStackTrace();    
            }      
        }
		return ResultVO.success("");
	}
	
	/**
	 * 
	 * @Description: 通过Id查询单个合同  
	 * @param :Integer contractId       
	 * @return :     
	 * @throws
	 */
	@RequestMapping("/selectById")
	@ResponseBody
	public ResultVO selectById(HttpServletRequest request) {
		ContractVO contractVO = new ContractVO();
		String contractId = request.getParameter("id");
		if (null == contractId || contractId.equals("")) {
			return ResultVO.failed("参数错误");
		}
		contractVO = contractService.selectByContractId(contractId);
		if (contractVO != null) {
			return ResultVO.success(contractVO);
		} else {
			return ResultVO.failed("资源未找到");
		}
	}

	/**   
	 * @Description: 删除合同
	 * @param :ContractVO Contract       
	 * @return :     
	 * @throws  
	*/
	@RequestMapping("/deleteContract")
	@ResponseBody
	public ResultVO deleteContracte(HttpServletRequest request) {
		List<String> IdList = new ArrayList<String>();
		String[] IdArray = null;
		String Ids = request.getParameter("Ids");
		if (null == Ids || Ids.equals("")) {
			return ResultVO.failed("参数错误");
		}
		IdArray = Ids.split(",");
		for(String Id : IdArray) {
			IdList.add(Id);
		}
		if (IdList.size() > 0) {
			contractService.deleteContract(IdList);
		}
		return ResultVO.success();
	}

	/**
	 * @Description 添加资源信息
	 * @param :HttpServletRequest request
	 * @return :返回操作状态/信息
	 * @throws :Exception
	*/

	@RequestMapping("/saveOrUpdateContract")
	@ResponseBody
	public ResultVO saveOrUpdateContract(HttpServletRequest request) {
		ContractVO contract = new ContractVO();
		contract = getContractVO(request, contract);
		if (null == contract.getId() || contract.getId().equals("") || null == contract.getName() && contract.getName().equals("")) {
			return ResultVO.failed("参数错误");
		}
		contractService.saveOrUpdateContract(contract);
		return ResultVO.success();
	}
	
	/**
	 * 获取前端传递的合同信息
	 * @param request
	 * @return 合同信息
	 */
	public ContractVO getContractVO(HttpServletRequest request, ContractVO contract){
		
		String id =  request.getParameter("id");
		String name = request.getParameter("name");
		String startDate = request.getParameter("startDate");
		String endDate = request.getParameter("endDate");
		String isClud = request.getParameter("isClud");
		String cludPrice = request.getParameter("cludPrice");
		String paymentCycle = request.getParameter("paymentCycle");
		String unitPrice = request.getParameter("unitPrice");
		
		String cityId = request.getParameter("cityId");
		String countyId = request.getParameter("countyId");
		String accountName=request.getParameter("accountName");	
		if(null != accountName && !accountName.equals("")){
			contract.setAccountName(accountName);		
		}
		if (null != id && !id.equals("")) {
			contract.setId(id);
		}
		if (null != name && !name.equals("")) {
			contract.setName(name);
		}
		if (null != startDate && !startDate.equals("")) {
			contract.setStartDate(StringToDate(startDate));
		}
		if (null != endDate && !endDate.equals("")) {
			contract.setEndDate(StringToDate(endDate));
		}
		if (null != isClud && !isClud.equals("")) {
			contract.setIsClud(isClud);
		}
		if (null != cludPrice && !cludPrice.equals("")) {
			contract.setCludPrice(cludPrice);
		}
		if (null != paymentCycle && !paymentCycle.equals("")) {
			contract.setPaymentCycle(paymentCycle);
		}
		if (null != unitPrice && !unitPrice.equals("")) {
			contract.setUnitPrice(unitPrice);
		}
		if (null != cityId && !cityId.equals("")) {
			contract.setCityId(cityId);
		}
		if (null != countyId && !countyId.equals("")) {
			contract.setCountyId(countyId);
		}
		return contract;
	}
	
	/**
	 *  Java String和Date的转换
	 * @param dateString
	 * @return Date
	 */
	public Date StringToDate(String dateString){
		Date date = null;
		try  
		{  
		    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd ");  
		    date = sdf.parse(dateString);  
		}  
		catch (ParseException e)  
		{  
		    return null;
		}  
		return date;
	}
}
