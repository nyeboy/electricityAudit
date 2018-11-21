package com.audit.modules.basedata.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.basedata.service.SupplierManageService;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : 
 * @date : 2017年4月20日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.google.common.collect.Maps;

/**   
 * @Description: TODO(供应商信息管理)    
 * @author  chentao
 * @date 2017年4月20日 下午4:39:19    
*/
@Controller
@RequestMapping("supplierManage")
public class SupplierManageController {
	
	@Autowired
	private SupplierManageService supplierManageService;
	
	/**   
	 * @Description: TODO(分页查询)    
	 * @param :      name 供应商名称
	 * @param		 organizationCode 组织结构id
	 * @param :      cityId	 市
	 * @param :      countyId  区县     
	 * @param :      only  only为 1 的时候，供应商code去重
	 * @return :     操作状态/信息json     
	*/
	@RequestMapping("findSupplyByPage")
	@ResponseBody
	public ResultVO findSupplyByPage(HttpServletRequest request,Integer pageNo, Integer pageSize, String only) {
		
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	paramMap.put("name",request.getParameter("name"));
		 	paramMap.put("organizationCode",request.getParameter("organizationCode"));
	        paramMap.put("cityId",request.getParameter("cityId"));
	        paramMap.put("countyId",request.getParameter("countyId"));
	     
		PageUtil<SupplierManage> page = new PageUtil<SupplierManage>();
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		if(pageNo != null && pageSize != null){
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		  System.out.println(request.getParameter("cityId")+"城市ID===-=="+page.getObj().toString()); 
		List<SupplierManage> list = supplierManageService.findSupplyByPage(page, only);
		return ResultVO.success(page);
	}
	
	
	
	/**
	 * 供应商导出excel
	 */
	@RequestMapping("findSupplyByPageExcel")
	@ResponseBody
	public ResultVO findSupplyByPageExcel(HttpServletRequest request,HttpServletResponse response, String only) {
		
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	paramMap.put("name",request.getParameter("name"));
		 	paramMap.put("organizationCode",request.getParameter("organizationCode"));
	        paramMap.put("cityId",request.getParameter("cityId"));
	        paramMap.put("countyId",request.getParameter("countyId"));
	     
		PageUtil<SupplierManage> page = new PageUtil<SupplierManage>();
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		int pageNum=1;
		page.setPageNo(pageNum);
		page.setPageSize(100000);
		//创建excel表
		SXSSFWorkbook wb = new SXSSFWorkbook(1000);
		int a=0;
		int aa=0;
		Sheet sheet1=null; 
		
		String[] titleRow = new String[] {
				"报账点名称",
				"供应商名称",
				"供应商编号",
				"供应商地点",
				"供应商地点ID",
				"供应商组织ID",
				"分公司",
				"银行名称",
				"银行账户"};
	
		
		while(true) {
			a=0;
			aa++;
			supplierManageService.findSupplyByPage(page, only);
			if(page.getResults()!=null && page.getResults().size()!=0) {
				sheet1 = wb.createSheet("供应商信息详情"+aa);
				Row row = sheet1.createRow(a++);
				for(int i=0;i<titleRow.length;i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(titleRow[i]);
				}
				List<SupplierManage> vos = page.getResults();
				for(SupplierManage vo : vos) {
					System.out.println(a);
					row = sheet1.createRow(a++);
					row.createCell(0).setCellValue(vo.getAccountName()==null?"":vo.getAccountName());
					row.createCell(1).setCellValue(vo.getName()==null?"":vo.getName());
					row.createCell(2).setCellValue(vo.getVendorCode()==null?"":vo.getVendorCode());
					row.createCell(3).setCellValue(vo.getAddress()==null?"":vo.getAddress());
					row.createCell(4).setCellValue(vo.getRegionCode()==null?"":vo.getRegionCode());
					row.createCell(5).setCellValue(vo.getOrganizationCode());
					row.createCell(6).setCellValue(vo.getOuName()==null?"":vo.getOuName());
					row.createCell(7).setCellValue(vo.getBankBranchName()==null?"":vo.getBankBranchName());
					row.createCell(8).setCellValue(vo.getBankNum()==null?"":vo.getBankNum());
					vo=null;
					}
				vos.clear();
				vos=null;
				page.setPageNo(++pageNum);
			}else {
				break;
			}
		}
		
	
		ServletOutputStream out = null;
		try {        
            out = response.getOutputStream();    
            String fileName = "供应商信息详情.xls";// 文件名    
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
	 * @Description: TODO(根据id查找)    
	 * @param :      id    
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("findSupplyById")
	@ResponseBody
	public ResultVO findSupplyById(String id) {
		return supplierManageService.findSupplyById(id);
	}
	
	/**   
	 * @Description: TODO(更新)    
	 * @param :      supplierVO    
	 * @return :     操作状态/信息json   
	 * @throws  
	*/
	@RequestMapping("updateSupply")
	@ResponseBody
	public ResultVO updateSupply(SupplierManage sManage) {
		return supplierManageService.updateSupply(sManage);
	}
	
	/**   
	 * @Description: TODO(删除)    
	 * @param :      id    
	 * @return :     操作状态/信息json     
	*/
	@RequestMapping("deleteSupplyById")
	@ResponseBody
	public ResultVO deleteSupplyById(String id) {
		return supplierManageService.deleteSupplyById(id);
	}
	
	/**   
	 * @Description: TODO(添加)    
	 * @param :      supplierVO   
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("insertSupply")
	@ResponseBody
	public ResultVO insertSupply(SupplierManage sManage) {
		return supplierManageService.insertSupply(sManage);
	}
	
}
