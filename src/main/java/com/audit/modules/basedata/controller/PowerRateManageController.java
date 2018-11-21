package com.audit.modules.basedata.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

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

import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.basedata.entity.PropertyAsStatus;
import com.audit.modules.basedata.service.PowerRateManageService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.google.common.collect.Maps;

/**   
 * @Description : TODO(额定功率信息管理)    
 * @author : chentao
 * @date : 2017年4月20日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Controller
@RequestMapping("powerRateManage")
public class PowerRateManageController {
		
	@Autowired
	private PowerRateManageService powerRateManageService;
	
	/**   
	 * @Description: TODO(分页查询)    
	 * @param :      deviceModel 设备型号 
	 * @param		 deviceType  设备类型
	 * @param :      city	 市
	 * @param :      county  区县     
	 * @return :     操作状态/信息json     
	*/
	@RequestMapping("findPowerRateByPage")
	@ResponseBody
	public ResultVO findPowerRateByPage(HttpServletRequest request ,Integer pageNo, Integer pageSize) {
		
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	//paramMap.put("deviceType",request.getParameter("deviceType"));
		 	//paramMap.put("deviceModel",request.getParameter("deviceModel"));
		 	paramMap.put("zhLabel",request.getParameter("zhLabel")!=null?request.getParameter("zhLabel"):"");
		 	paramMap.put("zgProperty",request.getParameter("zgProperty")!=null?request.getParameter("zgProperty"):"");
		 	paramMap.put("zgStatus",request.getParameter("zgStatus")!=null?request.getParameter("zgStatus"):"");
	        paramMap.put("cityId",request.getParameter("cityId")!=null?request.getParameter("cityId"):"");
	        paramMap.put("countyId",request.getParameter("countyId")!=null?request.getParameter("countyId"):"");
	        System.out.println(request.getParameter("zgProperty")+"--"+request.getParameter("zgStatus"));
		PageUtil<PowerRateManage> page = new PageUtil<PowerRateManage>();
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		if(pageNo != null && pageSize != null){
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		List<PowerRateManage> list = powerRateManageService.findPowerRateByPage(page);
		return ResultVO.success(page);
	}
	
	/**   
	 * @Description: 导出excel 
	 * @param :      deviceModel 设备型号 
	 * @param		 deviceType  设备类型
	 * @param :      city	 市
	 * @param :      county  区县     
	 * @return :          
	*/
	@RequestMapping("findPowerRateByPageExcel")
	@ResponseBody
	public ResultVO findPowerRateByPageExcel(HttpServletRequest request ,HttpServletResponse response) {
		
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	//paramMap.put("deviceType",request.getParameter("deviceType"));
		 	//paramMap.put("deviceModel",request.getParameter("deviceModel"));
		 	paramMap.put("zhLabel",request.getParameter("zhLabel")!=null?request.getParameter("zhLabel"):"");
		 	paramMap.put("zgProperty",request.getParameter("zgProperty")!=null?request.getParameter("zgProperty"):"");
		 	paramMap.put("zgStatus",request.getParameter("zgStatus")!=null?request.getParameter("zgStatus"):"");
	        paramMap.put("cityId",request.getParameter("cityId")!=null?request.getParameter("cityId"):"");
	        paramMap.put("countyId",request.getParameter("countyId")!=null?request.getParameter("countyId"):"");
	        System.out.println(request.getParameter("zgProperty")+"--"+request.getParameter("zgStatus"));
		PageUtil<PowerRateManage> page = new PageUtil<PowerRateManage>();
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		
		page.setPageNo(1);
		page.setPageSize(100000000);
		
		List<PowerRateManage> list = powerRateManageService.findPowerRateByPage(page);
		 //创建表格
  		XSSFWorkbook wb = new XSSFWorkbook();//创建表格
  		XSSFSheet aSheet = wb.createSheet("额定功率详情");//创建工作簿
  		int a = 0;
  		XSSFRow aRow = aSheet.createRow(a);
		aRow.createCell(0,1).setCellValue("地市");
		aRow.createCell(1,1).setCellValue("区县");
		aRow.createCell(2,1).setCellValue("资管机房名称");
		aRow.createCell(3,1).setCellValue("资管机房拥有者");
		aRow.createCell(4,1).setCellValue("资管机房状态");
		if(page.getResults()!=null && page.getResults().size()!=0) {
			List<PowerRateManage> vos = page.getResults();
			for(PowerRateManage vo :vos) {
				a++;
				aRow = aSheet.createRow(a);
				aRow.createCell(0,1).setCellValue(vo.getCityName()==null?"":vo.getCityName());
				aRow.createCell(1,1).setCellValue(vo.getCountyNmae()==null?"":vo.getCountyNmae());
				aRow.createCell(2,1).setCellValue(vo.getZhLabel()==null?"":vo.getZhLabel());
				aRow.createCell(3,1).setCellValue(vo.getProperty()==null?"":vo.getProperty());
				aRow.createCell(4,1).setCellValue(vo.getStatus()==null?"":vo.getStatus());
			}
		}
		ServletOutputStream out = null;
		try {        
            out = response.getOutputStream();    
            String fileName = "电表信息详情.xls";// 文件名    
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
	
	@RequestMapping("findProperty")
	@ResponseBody
	public ResultVO findProperty() {
		List<String> list = powerRateManageService.findProperty();
		return ResultVO.success(list);
	}
	
	@RequestMapping("findStatus")
	@ResponseBody
	public ResultVO findStatus() {
		List<String> list = powerRateManageService.findStatus();
		return ResultVO.success(list);
	}
	
	/**   
	 * @Description: TODO(根据机房id查询机房设备信息)    
	 * @param :      id    
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("selectFacility")
	@ResponseBody
	public ResultVO selectFacility(String id) {
		return powerRateManageService.selectFacility(id);
	}
	
	/**   
	 * @Description: TODO(根据id查找)    
	 * @param :      id    
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("findPowerRateById")
	@ResponseBody
	public ResultVO findPowerRateById(String id) {
		return powerRateManageService.findPowerRateById(id);
	}
	
	
	/**   
	 * @Description: TODO(更新)    
	 * @param :      poManage    
	 * @return :     操作状态/信息json   
	 * @throws  
	*/
	@RequestMapping("updatePowerRate")
	@ResponseBody
	public ResultVO updatePowerRate(PowerRateManage poManage) {
		return powerRateManageService.updatePowerRate(poManage);
	}
	
	/**   
	 * @Description: TODO(删除)    
	 * @param :      id    
	 * @return :     操作状态/信息json     
	*/
	@RequestMapping("deletePowerRateById")
	@ResponseBody
	public ResultVO deletePowerRateById(String id) {
		return powerRateManageService.deletePowerRateById(id);
	}
	
	/**   
	 * @Description: TODO(添加)    
	 * @param :      poManage   
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("insertPowerRate")
	@ResponseBody
	public ResultVO insertPowerRate(PowerRateManage poManage) {
		return powerRateManageService.insertPowerRate(poManage);
	}
	
	/**   
	 * @Description: TODO(获取设备类型)    
	 * @param :         
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("findPdeviceType")
	@ResponseBody
	public ResultVO findPdeviceType() {
		return powerRateManageService.findPdeviceType();
	}
	
}
