package com.audit.modules.electricity.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.OwnerMeterVo;
import com.audit.modules.electricity.entity.OwnerVo;
import com.audit.modules.electricity.service.OwnerService;

/**
 * @author : 袁礼斌
 * @Description : 业主信息管理controller
 * @date : 2017/4/21
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/ownerController")
public class OwnerController {
	private XSSFWorkbook wb = null;// 创建一个exlx文件对象
	private XSSFSheet aSheet = null;// 在创建好的工作表实例中创建表格并将
	private XSSFRow aRow = null; // 在创建好的表格中创建列
	private int number=1;//用于创建表名
	private int row=0; //用于记录excel的行数
	private Long page=1L;//用于记录循环进入create方法的次数
	private int num=1; //用于判断文件夹中是否存在filenamec文件

	@Resource
	private OwnerService ownerService;
	
	   /**
     * @param :
     * @return :
     * @throws
     * @Description: 分页查询业主列表信息
     */
    @RequestMapping("/queryPage")
    @ResponseBody
    public ResultVO queryPage(OwnerVo ownerVo, Integer pageNo, Integer pageSize) {
        PageUtil<OwnerVo> pageUtil = new PageUtil<>();
        if (pageNo != null && pageSize != null) {
            pageUtil.setPageNo(pageNo);
            pageUtil.setPageSize(pageSize);
        }
        ownerService.queryPage(pageUtil,ownerVo);
        return ResultVO.success(pageUtil);
    }
    
	/**
     * @param :
     * @return :
     * @throws
     * @Description: 查询业主信息
     */
    @RequestMapping("/queryOwner")
    @ResponseBody
    public ResultVO queryOwner(String ownerId, HttpServletRequest request) {
        return ResultVO.success(ownerService.queryOwner(ownerId));
    }
    
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 添加业主信息
     */
    @RequestMapping("/saveOwner")
    @ResponseBody
    public ResultVO saveOwner(String str, HttpServletRequest request) {
    	OwnerVo ownerVo = null;
        try {
        	ownerVo = JSON.parseObject(str,OwnerVo.class);
        }catch (Exception e){
            e.printStackTrace();
            return ResultVO.failed("参数错误");
        }
        return ownerService.saveOwner(ownerVo);
    }
    
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 修改业主信息
     */
    @RequestMapping("/updateOwner")
    @ResponseBody
    public ResultVO updateOwner(String str, HttpServletRequest request) {
    	OwnerVo ownerVo = null;
        try {
        	ownerVo = JSON.parseObject(str,OwnerVo.class);
        }catch (Exception e){
            e.printStackTrace();
            return ResultVO.failed("参数错误");
        }
        return ownerService.updateOwner(ownerVo);
    }
    
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 删除业主信息
     */
    @RequestMapping("/deleteOwner")
    @ResponseBody
    public ResultVO deleteOwner(String ownerId, HttpServletRequest request) {
        return ownerService.deleteOwner(ownerId);
    }
    
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 删除业主信息
     */
    @RequestMapping("/bathDeleteOwner")
    @ResponseBody
    public ResultVO bathDeleteOwner(String ownerIds, HttpServletRequest request) {
    	String[] ownerIdArray = ownerIds.split(",");
        return ownerService.bathDeleteOwner(ownerIdArray);
    }
    
    
    /**
     * @param :
     * @return :
     * @throws IOException 
     * @throws
     * @Description: 导出Excel
     */
    @RequestMapping("/exportExcel")
    @ResponseBody
    public ResultVO exportExcel(HttpServletRequest request, HttpServletResponse response,String fileName) throws IOException { 
    	request.setCharacterEncoding("utf-8");
    	Long count=ownerService.listCount();
        Long page1=1L;
        Long rows=5000L; 
        //Long pageNum=count/rows;
        Long pageNum=count-page1*rows;
        Map<String,Long> map=new HashMap<>();
        List<OwnerMeterVo> list=new ArrayList<>();
        List<OwnerMeterVo> lists=new ArrayList<>();
   while(true){     
	if(pageNum<0){
		map.put("page", page1*count+1);
		map.put("rows", (page1-1)*count);
	}else{
		map.put("page", page1*rows+1);
		map.put("rows", (page1-1)*rows);
	}
	
	list=ownerService.exportExcel(map);

	if(list.size()==0){
		break;
	}

//    	for (OwnerMeterVo a : list) {
//			System.out.println(a.getCityName()+"=="+a.getCountyName()+"="+a.getSupplier()+a.getMeterAccout());
//		}
		 create(list,request);
		lists.addAll(list);
		//System.out.println(lists.size());
		page1++;
		page++;
   }
   //存到服务器中
   String filenamec = "业主信息.xlsx";
	File filepathc = new File(request.getServletContext().getRealPath(filenamec));
	if(page==1){
	if(filepathc.exists()){
		filepathc.delete();
	}
	}
	OutputStream osc = new FileOutputStream(filepathc,true);
	wb.write(osc);// 将录入的信息写入到文件
   
	//初始化变量
	 wb = null;// 创建一个exlx文件对象
	 aSheet = null;// 在创建好的工作表实例中创建表格并将
	 aRow = null; // 在创建好的表格中创建列
	 number=1; //用于创建表名
	 row=0;	//用于记录excel的行数
	 page=1L;//用于记录循环进入create方法的次数
	 num=1; //用于判断文件夹中是否存在filenamec文件
	
	//导出到客户保存路径
   //final String userAgent = request.getHeader("USER-AGENT"); 
   String filename =fileName+".xlsx";
		String name = "业主信息.xlsx";
		File filepath = new File(request.getServletContext().getRealPath(name));
//		 if(StringUtils.contains(userAgent, "Mozilla")){//google,火狐浏览器 
//			 response.setHeader("content-disposition", "attachment;filename="+URLEncoder.encode(filename,"ISO8859-1"));
//         }else{
		//response.setHeader("content-disposition", "attachment;filename="+URLEncoder.encode(name,"UTF-8"));
//         }
		InputStream is = new FileInputStream(filepath);
		int len = 0;
		byte []b = new byte[1024];
		response.reset();// 清空输出流
		//response.setContentType("application/x-a11");
		response.setCharacterEncoding("utf-8");
		response.setContentType("application/vnd.ms-excel;charset=utf-8");
		response.setHeader("Content-Disposition","attachment;filename=" + new String(filename.getBytes(), "ISO-8859-1"));// 设定输出文件头
		//response.setContentType("application/x-download");		
		OutputStream os = response.getOutputStream();
//		File filepath1=new File("C:\\Users\\Administrator\\Desktop\\"+filename);
//		int i=1;
//		while(filepath1.exists()){
//			filepath1=new File("C:\\Users\\Administrator\\Desktop\\业主信息"+"("+i+")"+".xlsx");
//			i++;
//		}
//
//		OutputStream os = new FileOutputStream(filepath1);
		while((len = is.read(b))!=-1){
			os.write(b, 0, len);
			os.flush();
		}
		is.close();
		os.flush();
		os.close();
		return ResultVO.success(lists);
    }
    
	public void create(List<OwnerMeterVo> list,HttpServletRequest request) {
		if(page==1){
			System.out.println("创建表---");
			wb = new XSSFWorkbook();// 创建一个exlx文件对象
			aSheet = wb.createSheet("供电信息");// 在创建好的工作表实例中创建表格
		}
//		XSSFWorkbook wb = new XSSFWorkbook();// 创建一个exlx文件对象
//		XSSFSheet aSheet = wb.createSheet("业主信息");// 在创建好的工作表实例中创建表格并将
		
		for (int rowNumOfSheet = 0; rowNumOfSheet < list.size() + 1; rowNumOfSheet++) {// 因为需要输入头，所以最大循环次数为list.size()+1
			if(((page*list.size())%60000)==0){
				System.out.println("创建表格===");
				aSheet = wb.createSheet("供电信息续"+number);// 在创建好的工作表实例中创建表格
				page=1L;
				number++;
			}	
			if(page!=1){
				if(rowNumOfSheet == 0){
					rowNumOfSheet++;
				}
				if(list.size()!=5000){
					row=(int) (rowNumOfSheet+5000*(page-1));
				}else{
					row=(int) (rowNumOfSheet+list.size()*(page-1));
				}
			}else{
				row=rowNumOfSheet;
			}
			aRow = aSheet.createRow(row);// 在创建好的表格中创建列
			if (rowNumOfSheet == 0&&page==1) {// 第一次的时候先录入头
				aRow.createCell(0, 1).setCellValue("地市");
				aRow.createCell(1, 1).setCellValue("区县");
				aRow.createCell(2, 1).setCellValue("业主名称");
				aRow.createCell(3, 1).setCellValue("业主开户银行");
				aRow.createCell(4, 1).setCellValue("业主银行账号");
				aRow.createCell(5, 1).setCellValue("供应商");
				aRow.createCell(6, 1).setCellValue("用电协议单位");
				aRow.createCell(7, 1).setCellValue("用电协议起始日期");
				aRow.createCell(8, 1).setCellValue("用电协议终止日期");
				aRow.createCell(9, 1).setCellValue("用电协议单价");
				aRow.createCell(10, 1).setCellValue("电表号");
				aRow.createCell(11, 1).setCellValue("电表标识符");
				aRow.createCell(12, 1).setCellValue("电表户号");
				aRow.createCell(13, 1).setCellValue("电类型");
				aRow.createCell(14, 1).setCellValue("用电用途");
			} else {// rowNumOfSheet-1,确保从集合中的第一个开始录入
				String startTime=dataChange(list.get(rowNumOfSheet-1).getStartTime());
				String endTime=dataChange(list.get(rowNumOfSheet-1).getEndTime());
				aRow.createCell(0, 1).setCellValue(list.get(rowNumOfSheet - 1).getCityName());
				aRow.createCell(1, 1).setCellValue(list.get(rowNumOfSheet - 1).getCountyName());
				aRow.createCell(2, 1).setCellValue(list.get(rowNumOfSheet - 1).getOwnerName());
				aRow.createCell(3, 1).setCellValue(list.get(rowNumOfSheet - 1).getBankName());
				aRow.createCell(4, 1).setCellValue(list.get(rowNumOfSheet - 1).getBankAccount());
				aRow.createCell(5, 1).setCellValue(list.get(rowNumOfSheet - 1).getSupplier());
				aRow.createCell(6, 1).setCellValue(list.get(rowNumOfSheet - 1).getUseCompany());
				aRow.createCell(7, 1).setCellValue(startTime);
				aRow.createCell(8, 1).setCellValue(endTime);
				aRow.createCell(9, 1).setCellValue(list.get(rowNumOfSheet - 1).getPrice());
				aRow.createCell(10, 1).setCellValue(list.get(rowNumOfSheet - 1).getMeterNumber());
				aRow.createCell(11, 1).setCellValue(list.get(rowNumOfSheet - 1).getMeterIdentifier());
				aRow.createCell(12, 1).setCellValue(list.get(rowNumOfSheet - 1).getMeterAccout());
				aRow.createCell(13, 1).setCellValue(list.get(rowNumOfSheet - 1).getMeterType());
				aRow.createCell(14, 1).setCellValue(list.get(rowNumOfSheet - 1).getMeterPurpose());
				
			}
		}
	}
	
	public String dataChange(Date time){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String times=sdf.format(time);
		return times;
	}
	
	
	 /**
     * @param :
     * @return :
     * @throws IOException 
     * @throws
     * @Description: 导出Excel-弃用
     */
    @RequestMapping("/exportExcel1")
    @ResponseBody
    public void exportExcel1(HttpServletRequest request, HttpServletResponse response,String fileName) throws IOException {
    	String filename =fileName+".xlsx";
    	String name = "业主信息.xlsx";
		File filepath = new File(request.getServletContext().getRealPath(name));
		//String name="ownerInfo.xlsx";
		InputStream is = new FileInputStream(filepath);
		int len = 0;
		byte []b = new byte[1024];
		response.reset();// 清空输出流
		response.setCharacterEncoding("utf-8");
		response.setContentType("application/vnd.ms-excel;charset=utf-8");
		response.setHeader("Content-Disposition","attachment;filename=" + new String(filename.getBytes("GB2312"), "ISO8859-1"));// 设定输出文件头		
		OutputStream os = response.getOutputStream();
		while((len = is.read(b))!=-1){
			os.write(b, 0, len);
			os.flush();
		}
		is.close();
		os.flush();
		os.close();
    }
}
