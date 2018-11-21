package com.audit.modules.towerbasedata.psu.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.audit.modules.electricity.entity.OwnerMeterVo;
import com.audit.modules.towerbasedata.psu.entity.TowerPSUVO;
import com.audit.modules.towerbasedata.psu.service.TowerPSUService;

/**
 * 
 * @Description: 供电信息管理   
 * @throws  
 * 
 * @author  bingliup
 * @date 2017年4月30日 下午3:14:31
 */
@Controller
@RequestMapping("/towerPSU")
public class TowerPSUController {
	private XSSFWorkbook wb = null;// 创建一个exlx文件对象
	private XSSFSheet aSheet = null;// 在创建好的工作表实例中创建表格并将
	private XSSFRow aRow = null; // 在创建好的表格中创建列
	private int number=1;//用于创建表名
	private int row=0; //用于记录excel的行数
	private Long page=1L;//用于记录循环进入create方法的次数
	private int num=1; //用于判断文件夹中是否存在filenamec文件
	@Autowired
	private TowerPSUService towerPSUService;

	/**
	 * @Description:分页查询供电信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryListPage")
	@ResponseBody
	public ResultVO queryListPage(TowerPSUVO accountSitePSU, Integer pageNo, Integer pageSize) {
		PageUtil<TowerPSUVO> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		towerPSUService.queryListPage(accountSitePSU, pageUtil);
		return ResultVO.success(pageUtil);
	}
	

	/**
	 * @Description:通过报账点Id查询供电信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryById")
	@ResponseBody
	public ResultVO queryById(String Id) {
		if(Id == null || Id.equals("")) {
			return ResultVO.failed("请传递Id");
		}
		TowerPSUVO accountSitePSU = towerPSUService.selectById(Id);
		return ResultVO.success(accountSitePSU);
	}
	
	
	/**
	 * @Description:通过报账点Ids删除供电信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	 */
	@RequestMapping("/delete")
	@ResponseBody
	public ResultVO delete(String Ids) {
		if(Ids == null || Ids.equals("")) {
			return ResultVO.failed("请传递Id");
		}
		try {
			String[] idArray = Ids.split(",");
			if(idArray.length > 0) {
				towerPSUService.delete(idArray);
			}else{
				return ResultVO.failed("参数错误");
			}
		} catch (Exception e) {
			return ResultVO.failed("删除失败");
		}
		return ResultVO.success();
	}
	

	/**
	 * @Description:通过报账点Id修改供电信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/update")
	@ResponseBody
	public ResultVO update(TowerPSUVO accountSitePSU) {
		if(accountSitePSU != null && null != accountSitePSU.getId() && !"".equals(accountSitePSU.getId())) {
			towerPSUService.update(accountSitePSU);
			return ResultVO.success();
		}
		return ResultVO.failed("参数错误");
		
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
    	Long count=towerPSUService.listCount();
    	Long page1=1L;
        Long rows=5000L; 
        //Long pageNum=count/rows;
        Long pageNum=count-page1*rows;
        Map<String,Long> map=new HashMap<>();
        List<TowerPSUVO> list=new ArrayList<>();
        List<TowerPSUVO> lists=new ArrayList<>();
   while(true){     
	if(pageNum<0){
		map.put("page", page1*count+1);
		map.put("rows", (page1-1)*count);
	}else{
		map.put("page", page1*rows+1);
		map.put("rows", (page1-1)*rows);
	}
	
	list=towerPSUService.exportExcel(map);

	if(list.size()==0){
		break;
	}
	 create(list,request);
		lists.addAll(list);
		System.out.println(lists.size()+"===");
		page1++;
		page++;
   }
   //存到服务器中
   String filenamec = "供电信息.xlsx";
	File filepathc = new File(request.getServletContext().getRealPath(filenamec));
	if(num==1){
	if(filepathc.exists()){
		System.out.println("删除表==-==");
		filepathc.delete();
	}
	num++;
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
   String filename =fileName+".xlsx";
	String name = "供电信息.xlsx";
	File filepath = new File(request.getServletContext().getRealPath(name));
//	 if(StringUtils.contains(userAgent, "Mozilla")){//google,火狐浏览器 
//		 response.setHeader("content-disposition", "attachment;filename="+URLEncoder.encode(filename,"ISO8859-1"));
//    }else{
	//response.setHeader("content-disposition", "attachment;filename="+URLEncoder.encode(name,"UTF-8"));
//    }
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
//	File filepath1=new File("C:\\Users\\Administrator\\Desktop\\"+filename);
//	int i=1;
//	while(filepath1.exists()){
//		filepath1=new File("C:\\Users\\Administrator\\Desktop\\业主信息"+"("+i+")"+".xlsx");
//		i++;
//	}
//
//	OutputStream os = new FileOutputStream(filepath1);
	while((len = is.read(b))!=-1){
		os.write(b, 0, len);
		os.flush();
	}
	is.close();
	os.flush();
	os.close();
	return ResultVO.success(lists);
    }
    
	public void create(List<TowerPSUVO> list,HttpServletRequest request){
		if(page==1){
			System.out.println("创建表---");
			wb = new XSSFWorkbook();// 创建一个exlx文件对象
			aSheet = wb.createSheet("供电信息");// 在创建好的工作表实例中创建表格
		}
		
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
				System.out.println("行：     "+row);
			aRow = aSheet.createRow(row);// 在创建好的表格中创建列
			if (rowNumOfSheet == 0&&page==1) {// 第一次的时候先录入头
				aRow.createCell(0, 1).setCellValue("地市");
				aRow.createCell(1, 1).setCellValue("区县");
				aRow.createCell(2, 1).setCellValue("铁塔站址编码");
				aRow.createCell(3, 1).setCellValue("资管站点名称");
				aRow.createCell(4, 1).setCellValue("用电类型");
				aRow.createCell(5, 1).setCellValue("共享方式");
				aRow.createCell(6, 1).setCellValue("站址类型");
				aRow.createCell(7, 1).setCellValue("时间");					
			} else {// rowNumOfSheet-1,确保从集合中的第一个开始录入
					
				if(list.get(rowNumOfSheet - 1).getElectricityType().equals("1")){
					list.get(rowNumOfSheet - 1).setElectricityType("直供电");
				}else if(list.get(rowNumOfSheet - 1).getElectricityType().equals("2")){
					list.get(rowNumOfSheet - 1).setElectricityType("转供电");
				}else{
					list.get(rowNumOfSheet - 1).setElectricityType("");
				}
				if(list.get(rowNumOfSheet - 1).getShareType().equals("1")){
					list.get(rowNumOfSheet - 1).setShareType("共享");
				}else if(list.get(rowNumOfSheet - 1).getShareType().equals("2")){
					list.get(rowNumOfSheet - 1).setShareType("独享");
				}else{
					list.get(rowNumOfSheet - 1).setShareType("");
				}
				String updateTime="";
				if(list.get(rowNumOfSheet-1).getUpdateTime()==null){
					 updateTime="";
				}else{
					updateTime=dataChange(list.get(rowNumOfSheet-1).getUpdateTime());
				}
				aRow.createCell(0, 1).setCellValue(list.get(rowNumOfSheet - 1).getCityStr());
				aRow.createCell(1, 1).setCellValue(list.get(rowNumOfSheet - 1).getCountyStr());
				aRow.createCell(2, 1).setCellValue(list.get(rowNumOfSheet - 1).getCode());
				aRow.createCell(3, 1).setCellValue(list.get(rowNumOfSheet - 1).getLabel());
				aRow.createCell(4, 1).setCellValue(list.get(rowNumOfSheet - 1).getElectricityType());
				aRow.createCell(5, 1).setCellValue(list.get(rowNumOfSheet - 1).getShareType());
				aRow.createCell(6, 1).setCellValue(list.get(rowNumOfSheet - 1).getZzType());
				aRow.createCell(7, 1).setCellValue(updateTime);					
			}			
		}
		
	}
	
	public String dataChange(Date time){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String times=sdf.format(time);
		return times;
	}
    
}
