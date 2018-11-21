package com.audit.modules.site.controller;

import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.LogUtil;
import com.audit.modules.contract.service.ContractService;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.site.service.EquipmentRoomService;
import com.audit.modules.site.service.SiteInfoService;
import com.audit.modules.supplier.service.SupplierService;
import com.audit.modules.system.entity.BaseDataVO;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.audit.modules.watthourmeter.service.WatthourMeterService;
import com.google.common.collect.Maps;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description : 站点信息查询
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/siteInfo")
public class SiteInfoController {

    @Autowired
    private SiteInfoService siteInfoService;

    @Autowired
    private ContractService contractService;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private WatthourMeterService watthourMeterService;

    @Autowired
    private EquipmentRoomService equipmentRoomService;

    @RequestMapping("/excelImport")
    @ResponseBody
    public ResultVO importExecel(@RequestParam(value="file") MultipartFile file, HttpServletRequest request){
        if(file==null||file.isEmpty()){
            return ResultVO.failed("请上传文件！");
        }
        try {
            return siteInfoService.importExcel(file);
        } catch (Exception e) {
            e.printStackTrace();
            LogUtil.getLogger().error(e.getMessage());
            return ResultVO.failed("保存出错！",e.getMessage());
        }
    }

    /**
     * @param : siteName
     * @return :
     * @throws
     * @Description: 模糊查询报账点名称(列表查询)
     */
    @RequestMapping("/querySite")
    @ResponseBody
    public ResultVO querySite(Integer pageNo, Integer pageSize, String siteName, String cityId, String countyId,String meterCode) {
        PageUtil<SiteInfoVO> pageUtil = new PageUtil<>();
        if (pageNo != null && pageSize != null) {
            pageUtil.setPageNo(pageNo);
            pageUtil.setPageSize(pageSize);
        }
        siteInfoService.querySite(pageUtil, siteName, cityId, countyId,meterCode);
        return ResultVO.success(pageUtil);
    }
    
    /**
     * 基础数据呈现导出excel
     */
    @RequestMapping("/querySiteExcel")
    @ResponseBody
    public ResultVO querySiteExcel(String siteName, String cityId, String countyId,String meterCode,HttpServletResponse response) {
    	
		int pageNum=1;
		int a=0;
		int aa=0;
		String b="";
		String c="";
		Sheet sheet1=null; 
		Row row=null;
		String[] titleRow = new String[] {
				"地市",
				"区县",
				"报账点名称",
				"报账点别名",
				"机房或资源点名称",
				"站点名称",
				"原财务站点名称",
				"产权性质",
				"合同ID",
				"合同名称",
				"合同生效日期",
				"合同终止日期",
				"是否包干",
				"包干价",
				"缴费周期",
				"单价(不含税)",
				"用电类型",
				"供电公司/业主",
				"共享方式",
				"电费缴纳方式",
				"电表号",
				"电表标识符",
				"电表户号",
				"电表类型",
				"电表状态",
				"倍率",
				"最大读数",
				"当前读数",
				"当前电费归属日期",
				"所属户头",
				"报销周期"
				};
		
		//创建excel
		SXSSFWorkbook wb = new SXSSFWorkbook(1000);	
		while(true) {
			PageUtil<SiteInfoVO> pageUtil = new PageUtil<>();
			Map<String, Object> paramMap = Maps.newHashMap();
				paramMap.put("queryData", siteName == null ? "" : siteName);
				paramMap.put("cityId", cityId == null ? "" : cityId);
				paramMap.put("countyId", countyId == null ? "" : countyId);
				paramMap.put("meterCode",meterCode==null ? "" : meterCode);//noone
				pageUtil.setObj(paramMap);
			//设置页码
			pageUtil.setPageNo(pageNum);
			pageUtil.setPageSize(100000);
			
			//初始化行数
			a=0;
			//excel页增加
			aa++;
			List<Map<String, Object>> list = siteInfoService.querySiteExcel(pageUtil);
			if(list!=null && list.size()!=0) {
				sheet1 = wb.createSheet("基础数据详情"+aa);
				row = sheet1.createRow(a++);
				//创建表头
				for(int i=0;i<titleRow.length;i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(titleRow[i]);
				}
				for(Map<String,Object> map : list) {
					
					System.out.println(a);
					System.out.println(aa);
					row = sheet1.createRow(a++);
					row.createCell(0).setCellValue(map.get("DS")==null?"":String.valueOf(map.get("DS")));
					row.createCell(1).setCellValue(map.get("QX")==null?"":String.valueOf(map.get("QX")));
					row.createCell(2).setCellValue(map.get("BZDMC")==null?"":String.valueOf(map.get("BZDMC")));
					row.createCell(3).setCellValue(map.get("BZDBM")==null?"":String.valueOf(map.get("BZDBM")));
					row.createCell(4).setCellValue(map.get("JFZYDMC")==null?"":String.valueOf(map.get("JFZYDMC")));
					row.createCell(5).setCellValue(map.get("ZDMC")==null?"":String.valueOf(map.get("ZDMC")));
					row.createCell(6).setCellValue(map.get("YCWZDMC")==null?"":String.valueOf(map.get("YCWZDMC")));
					row.createCell(7).setCellValue((map.get("CQXZ")==null || String.valueOf(map.get("CQXZ")).equals("0"))?"自维":"塔维");
					row.createCell(8).setCellValue(map.get("HTBH")==null?"":String.valueOf(map.get("HTBH")));
					row.createCell(9).setCellValue(map.get("HTMC")==null?"":String.valueOf(map.get("HTMC")));
					row.createCell(10).setCellValue(map.get("HTSXRQ")==null?"":String.valueOf(map.get("HTSXRQ")));
					row.createCell(11).setCellValue(map.get("HTZZRQ")==null?"":String.valueOf(map.get("HTZZRQ")));
					row.createCell(12).setCellValue((map.get("SFBG")==null || String.valueOf(map.get("SFBG")).equals("0"))?"非包干":"包干");
					row.createCell(13).setCellValue(map.get("BGJ")==null?"":String.valueOf(map.get("BGJ")));
					switch(String.valueOf(map.get("JFZQ"))) {
					case "1":
						b="月";
						break;
					case "3":
						b="季度";
						break;
					case "6":
						b="半年";
						break;
					case "12":
						b="年";
						break;
					}
					row.createCell(14).setCellValue(b);
					row.createCell(15).setCellValue(map.get("DTDJ")==null?"":String.valueOf(map.get("DTDJ")));
					row.createCell(16).setCellValue((map.get("YDLX")==null || String.valueOf(map.get("YDLX")).equals("1"))?"直供电":"转供电");
					row.createCell(17).setCellValue(String.valueOf(map.get("GDGS")).equals("1")?"供电公司":"业主");
					row.createCell(18).setCellValue((map.get("GXFS")==null || String.valueOf(map.get("GXFS")).equals("1"))?"共享":"独享");
					row.createCell(19).setCellValue((map.get("DFJNFS")==null || String.valueOf(map.get("DFJNFS")).equals("3"))?"自缴":String.valueOf(map.get("DFJNFS")).equals("2")?"铁塔代缴":"代维代缴");
					row.createCell(20).setCellValue(map.get("DBBSF")==null?"":String.valueOf(map.get("DBBSF")));
					row.createCell(21).setCellValue(map.get("DBBSF")==null?"":String.valueOf(map.get("DBBSF")));
					row.createCell(22).setCellValue(map.get("DBHH")==null?"":String.valueOf(map.get("DBHH")));
					row.createCell(23).setCellValue((map.get("DBLX")==null || String.valueOf(map.get("DBLX")).equals("1"))?"普通":"智能");
					row.createCell(24).setCellValue((map.get("DBZT")==null || String.valueOf(map.get("DBZT")).equals("1"))?"正常":String.valueOf(map.get("DBZT")).equals("0")?"损坏":"损坏未提交");
					row.createCell(25).setCellValue(map.get("BL")==null?"":String.valueOf(map.get("BL")));
					row.createCell(26).setCellValue(map.get("ZDDS")==null?"":String.valueOf(map.get("ZDDS")));
					row.createCell(27).setCellValue(map.get("DQDS")==null?"":String.valueOf(map.get("DQDS")));
					row.createCell(28).setCellValue(map.get("DQDSKSRQ")==null?"":String.valueOf(map.get("DQDSKSRQ")));
					row.createCell(29).setCellValue(map.get("SSHT")==null?"":String.valueOf(map.get("SSHT")));
					switch(String.valueOf(map.get("BXZQ"))) {
					case "1":
						c="月";
						break;
					case "3":
						c="季度";
						break;
					case "6":
						c="半年";
						break;
					case "12":
						c="年";
						break;
					}
					row.createCell(30).setCellValue(c);
					map=null;
					}
				list.clear();
				list=null;
				pageUtil.setPageNo(++pageNum);
			}else {
				break;
			}
				
			
		}
		ServletOutputStream out = null;
		try {        
            out = response.getOutputStream();    
            String fileName = "基础信息详情.xls";// 文件名    
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
     * @param :
     * @return :
     * @throws
     * @Description: 基础数据详情
     */
    @RequestMapping("/queryDetail")
    @ResponseBody
    public ResultVO queryDetail(String id) {
        BaseDataVO baseDataVO = new BaseDataVO();
        SiteInfoVO siteInfoVOs = siteInfoService.queryById(id);//获取站点信息
        if (siteInfoVOs != null) {
            baseDataVO.setSiteInfoVO(siteInfoVOs);
            if(siteInfoVOs.getPayTypee()==null){
            	siteInfoVOs.setPayTypee(7);
            }
            if(siteInfoVOs.getProfessional()==null){
            	siteInfoVOs.setProfessional("无线");
            }
        }
        baseDataVO.setEqRoomVO(siteInfoService.queryByIdTOEqRoom(id));//机房信息
        baseDataVO.setRePointVO(siteInfoService.queryByIdTORePoint(id));//资源点信息
        baseDataVO.setContractVO(contractService.queryBySiteId(id));//合同信息
        baseDataVO.setSupplierVO(supplierService.findBySiteID(id));//供应商信息
        baseDataVO.setDeviceVO(equipmentRoomService.queryDevice(id));//机房设备信息
        List<WatthourMeterVO> watthourMeterVOs = watthourMeterService.findBySiteId(id);
        if (watthourMeterVOs != null && watthourMeterVOs.size() > 0) {
            baseDataVO.setWatthourMeterVO(watthourMeterVOs);//电表信息
        }
        return ResultVO.success(baseDataVO);
    }
    
    

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 基础数据详情
     */
    @RequestMapping("/queryAllDetail")
    @ResponseBody
    public ResultVO queryAllDetail(String id) {
        List<BaseDataVO> baseDataVOs = new ArrayList<BaseDataVO>();
        //查出所有站点
        List<SiteInfoVO> siteInfoVOS = siteInfoService.queryAll();
        //遍历站点，根据站点Id查抓获合同信息与供应商信息
        for(SiteInfoVO sv:siteInfoVOS){
        	BaseDataVO baseDataVO=new BaseDataVO();
        	 baseDataVO.setContractVO(contractService.queryBySiteId(sv.getId()));//合同信息
        	 baseDataVO.setSupplierVO(supplierService.findBySiteID(sv.getId()));//供应商信息
        	 baseDataVO.setSiteInfoVO(sv);
        	 baseDataVOs.add(baseDataVO);
        }
        /*SiteInfoVO siteInfoVOs = siteInfoService.queryById(id);//获取站点信息
        if (siteInfoVOs != null) {
            baseDataVO.setSiteInfoVO(siteInfoVOs);
        }
        baseDataVO.setContractVO(contractService.queryBySiteId(id));//合同信息
        baseDataVO.setSupplierVO(supplierService.findBySiteID(id));//供应商信息
        baseDataVO.setDeviceVO(equipmentRoomService.queryDevice(id));//机房设备信息
        List<WatthourMeterVO> watthourMeterVOs = watthourMeterService.findBySiteId(id);
        if (watthourMeterVOs != null && watthourMeterVOs.size() > 0) {
            baseDataVO.setWatthourMeterVO(watthourMeterVOs);//电表信息
        }
        return ResultVO.success(baseDataVO);*/
        return ResultVO.success(baseDataVOs);
    }
    
}
