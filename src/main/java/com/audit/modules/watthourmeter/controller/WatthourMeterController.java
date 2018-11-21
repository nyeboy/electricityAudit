package com.audit.modules.watthourmeter.controller;

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

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.audit.modules.watthourmeter.service.WatthourMeterService;

/**
 * @author : bingliup
 * @Description : 电表管理
 * @date : 2017/4/20 Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/watthourMeter")
public class WatthourMeterController {

	@Autowired
	private WatthourMeterService watthourMeterService;

	/**
	 * @Description:查询分页搜索
	 * @param request
	 * @param pageNo
	 * @param pageSize
	 * @return 列表
	 */
	@RequestMapping("/queryListPage")
	@ResponseBody
	public ResultVO queryListPage(HttpServletRequest request, Integer pageNo, Integer pageSize) {
		PageUtil<WatthourMeterVO> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		} 
		
		WatthourMeterVO VO = new WatthourMeterVO();
		VO = getWatthourMeterVO(request, VO);
		watthourMeterService.queryListPage(VO, pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	/**
	 * @Description:导出excel
	 * @param request
	 * @param pageNo
	 * @param pageSize
	 * @return 列表
	 */
	@RequestMapping("/queryListPageExcel")
	@ResponseBody
	public ResultVO queryListPageExcel(HttpServletRequest request,HttpServletResponse response) {
		PageUtil<WatthourMeterVO> pageUtil = new PageUtil<>();
		int pageNum =1;
		pageUtil.setPageNo(pageNum);
		pageUtil.setPageSize(100000);
		WatthourMeterVO VO = new WatthourMeterVO();
		VO = getWatthourMeterVO(request, VO);
		//创建表格
		SXSSFWorkbook wb = new SXSSFWorkbook(1000);//创建表格
		int a=0;
		int aa=0;
		Sheet sheet1=null; 
		
		String[] titleRow = new String[] {
				"报账点名称",
				"电表号",
				"倍率",
				"电表状态",
				"当前读数",
				"电表户号",
				"电表类型",
				"最大读数",
				"所属户头",
				"电费归属日期",
				"单价",
				"额定功率"
				};
		while(true) {
			a=0;
			aa++;
			//获取数据
			watthourMeterService.queryListPage(VO, pageUtil);
			if(pageUtil.getResults()!=null && pageUtil.getResults().size()!=0) {
				sheet1 = wb.createSheet("电表信息详情"+aa);
				Row row = sheet1.createRow(a++);
				for(int i=0;i<titleRow.length;i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(titleRow[i]);
				}
				List<WatthourMeterVO> vos = pageUtil.getResults();
				for(WatthourMeterVO vo : vos) {
					System.out.println(a);
					System.out.println(aa);
					row = sheet1.createRow(a++);
					row.createCell(0).setCellValue(vo.getAccountName()==null?"":vo.getAccountName());
					row.createCell(1).setCellValue(vo.getCode()==null?"":vo.getCode());
					row.createCell(2).setCellValue(vo.getRate()==null?1.0:vo.getRate());
					row.createCell(3).setCellValue((vo.getStatus()==null || vo.getStatus()==1)?"正常":"损坏");
					row.createCell(4).setCellValue(vo.getCurrentReadingStr()==null?"":vo.getCurrentReadingStr());
					row.createCell(5).setCellValue(vo.getPaymentAccountCode()==null?"":vo.getPaymentAccountCode());
					row.createCell(6).setCellValue((vo.getPtype()==null ||vo.getPtype()==1)?"普通":"智能");
					row.createCell(7).setCellValue(vo.getMaxReadings()==null?"":vo.getMaxReadings());
					row.createCell(8).setCellValue((vo.getBelongAccount()==null || vo.getBelongAccount()==1)?"移动":"铁塔");
					row.createCell(9).setCellValue(vo.getReimbursementDateStr()==null?"":vo.getReimbursementDateStr());
					row.createCell(10).setCellValue(vo.getPrice()==null?"":vo.getPrice());
					row.createCell(11).setCellValue("");
					vo=null;
				}
				vos.clear();
				vos=null;
				pageUtil.setPageNo(++pageNum);
		}else {
			break;
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

	/**
	 * 通过ID查找单数据
	 * @param request
	 * @return ResultVO
	 */
	@RequestMapping("/selectById")
	@ResponseBody
	public ResultVO selectById(HttpServletRequest request) {
		WatthourMeterVO watthourMeterVO = new WatthourMeterVO();
		String _Id = request.getParameter("id");
		if (null == _Id || _Id.equals("")) {
			return ResultVO.failed("参数错误");
		}
		
		watthourMeterVO = watthourMeterService.selectById(_Id);
		
		if (watthourMeterVO != null) {
			return ResultVO.success(watthourMeterVO);
		} else {
			return ResultVO.failed("资源未找到");
		}
	}

	/**
	 * @Description: 删除
	 * @param request
	 * @return
	 */
	@RequestMapping("/delete")
	@ResponseBody
	public ResultVO delete (HttpServletRequest request) {

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
			watthourMeterService.delete(IdList);
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
		WatthourMeterVO watthourMeter = new WatthourMeterVO();
		WatthourMeterVO oldMeter = new WatthourMeterVO();
		watthourMeter = getWatthourMeterVO(request, watthourMeter);
		
		if(null == watthourMeter.getId() || watthourMeter.getId().equals("")){
			watthourMeter.setId(StringUtils.getUUid());
		}
		if(null == watthourMeter.getMid() || watthourMeter.getMid().equals("")){
			watthourMeter.setMid(StringUtils.getUUid());
		}
		// 包含旧表标号 ；则为换表：设置旧表状态0'损坏'
		if (watthourMeter.getDamageMeterNum()!=null && watthourMeter.getDamageMeterNum()!="") {
			oldMeter.setElectricLoss(watthourMeter.getElectricLoss());
			oldMeter.setDamageInnerNum(watthourMeter.getDamageInnerNum());
			oldMeter.setDamageNum(watthourMeter.getDamageNum());
			oldMeter.setDamageDate(watthourMeter.getDamageDate());
			oldMeter.setStatus(0);
			oldMeter.setId(watthourMeter.getDamageMeterNum());
			
			watthourMeterService.saveOrUpdate(oldMeter);
		}
		//添加新表及站点信息
	    watthourMeterService.saveOrUpdate(watthourMeter);
		return ResultVO.success();
	}
	

	/**
	 * 获取前端传递的信息
	 * 
	 * @param request
	 * @return 信息
	 */
	public WatthourMeterVO getWatthourMeterVO(HttpServletRequest request, WatthourMeterVO VO) {

		String id = request.getParameter("id");
		String accountSiteId = request.getParameter("accountSiteId");
		String cityId = request.getParameter("cityId");
		String countyId = request.getParameter("countyId");
		
		String code = request.getParameter("code");
		String paymentAccountCode = request.getParameter("paymentAccountCode");
		String ptype = request.getParameter("ptype");
		String status = request.getParameter("status");
		String rate = request.getParameter("rate");
		String maxReading = request.getParameter("maxReading");

		String currentReadingStr = request.getParameter("currentReadingStr");
		String reimbursementDateStr = request.getParameter("reimbursementDateStr");
		String belongAccount = request.getParameter("belongAccount");
		
		String accountName = request.getParameter("accountName");
		
		String damageNum = request.getParameter("damageNum");
		String damageDate = request.getParameter("damageDate");
		String damageInnerNum = request.getParameter("damageInnerNum");
		String electricLoss = request.getParameter("electricLoss");
		String damageMeterNum = request.getParameter("damageMeterNum");
		String updateTimeStr = request.getParameter("updateTimeStr");
		
		
		if (null != id && !id.equals("")) {
			VO.setId(id);
		}
		if (null != accountSiteId && !accountSiteId.equals("")) {
			VO.setAccountSiteId(accountSiteId);
		}
		if (null != cityId && !cityId.equals("")) {
			VO.setCityId(cityId);
		}
		if (null != countyId && !countyId.equals("")) {
			VO.setCountyId(countyId);
		}
		if (null != code && !code.equals("")) {
			VO.setCode(code);
		}
		if (null != paymentAccountCode && !paymentAccountCode.equals("")) {
			VO.setPaymentAccountCode(paymentAccountCode);
		}
		if (null != ptype && !ptype.equals("")) {
			VO.setPtype(Integer.valueOf(ptype));
		}
		if (null != status && !status.equals("")) {
			VO.setStatus(Integer.valueOf(status));
		}
		if (null != rate && !rate.equals("")) {
			VO.setRate(Double.valueOf(rate));
		}
		if (null != maxReading && !maxReading.equals("")) {
			VO.setMaxReading(Double.valueOf(maxReading));
		}
		if (null != currentReadingStr && !currentReadingStr.equals("")) {
			VO.setCurrentReadingStr(currentReadingStr);
		}
		if (null != reimbursementDateStr && !reimbursementDateStr.equals("")) {
			VO.setReimbursementDateStr(reimbursementDateStr);
		}
		if (null != belongAccount && !belongAccount.equals("")) {
			VO.setBelongAccount(Integer.valueOf(belongAccount));
		}
		if (null != accountName && !accountName.equals("")) {
			VO.setAccountName(accountName);
		}

		if (null != damageNum && !damageNum.equals("")) {
			VO.setDamageNum(Double.valueOf(damageNum));
		}
		if (null != damageDate && !damageDate.equals("")) {
			VO.setDamageDate(damageDate);;
		}
		if (null != damageInnerNum && !damageInnerNum.equals("")) {
			VO.setDamageInnerNum(Double.valueOf(damageInnerNum));
		}
		if (null != electricLoss && !electricLoss.equals("")) {
			VO.setElectricLoss(electricLoss);
		}
		if (null != damageMeterNum && !damageMeterNum.equals("")) {
			VO.setDamageMeterNum(damageMeterNum);
		}
		if (null != updateTimeStr && !updateTimeStr.equals("")) {
			VO.setUpdateTimeStr(updateTimeStr);
		}

		return VO;
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
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd ");
			date = sdf.parse(dateString);
		} catch (ParseException e) {
			return null;
		}
		return date;
	}
	
	/**
	 * 获取电表个数
	 */
//	@RequestMapping("/queryMeterNum")
//	@ResponseBody
//	public ResultVO queryMeterNum(HttpServletRequest request) {
//		return null;
//		
//	}

}
