package com.audit.modules.towerbasedata.trans.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.audit.filter.exception.CommonException;
import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSiteTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.towerbasedata.trans.entity.TowerNeedTrans;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;
import com.audit.modules.towerbasedata.trans.entity.TowerTransVO;
import com.audit.modules.towerbasedata.trans.service.TowerTransService;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;

/**
 * @author : noone
 * @Description : 转供电信息
 * @date : 
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/towerTrans")
public class TowerTransController {
	@Autowired
	private TowerTransService towerTransService;
	
 
	/**
	 * @Description:新增页面中 -----查询需要改造的转供电列表
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/findNeedTransList")
	@ResponseBody
	public ResultVO findNeedTransList(HttpServletRequest request,TowerTransVO towerTransVO,Integer pageNo,Integer pageSize){
		// 当前登录人
        UserVo user = getLoginUser(request);
        //超级管理员的区县id是null
        //需要权限控制，区县隔离
        if(user.getCity()==null ||user.getCity().equals("")){
        	if(towerTransVO.getCityId()!=null){
        		
        	}else {
        		towerTransVO.setCityId(null);
			}
        	if(towerTransVO.getCountyId() != null){
        		
        	}else{
        		towerTransVO.setCountyId(null);
        		
        	}
        }else{
//        	accountSiteTrans.setCityId(String.valueOf(user.getCity()));
//        	accountSiteTrans.setCountyId(String.valueOf(user.getCounty()));
        }
		PageUtil<TowerTransVO> pageUtil = new PageUtil<>();
		if(pageNo != null && pageSize != null){
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		towerTransService.findNeedTransList(towerTransVO, pageUtil);
//		accountSiteTransService.findNeedTransList(accountSiteTrans,pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	
	/**
	 * @Description:省级管理员把需要改造的站点提交到下一级经办人手中
	 * @param :id 站点id
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/addNeedChangeSiteToNext")
	@ResponseBody
	public ResultVO addNeedChangeSiteToNext(HttpServletRequest request,TowerTransVO towerTransVO){
		// 当前登录人
        UserVo user = getLoginUser(request);
		if(towerTransVO != null && !towerTransVO.equals("")){
			towerTransVO.setTrusteesId(user.getUserId());//新增数据管理员的数据
			towerTransVO.setTrusteesName(user.getUserName());
			//验证审批通过的和已经提交的数据，防止重复提交
			String subStatus = towerTransService.checkIsSubmitData(towerTransVO);
			if(subStatus==null ||subStatus.equals("") || subStatus.equals("2")){
				//把提交信息保存到SYS_ZGROOM_TOWER_TRANS_MID
				towerTransService.saveNeedChangeSite(towerTransVO);
				return ResultVO.success();
			}
			if(subStatus.equals("1")){
				return ResultVO.failed("已经提交到下一级，请重新选择站点！");
			}
			if(subStatus.equals("3")){
				return ResultVO.failed("站点已经改造完成，请重新选择站点！");
			}
			if(subStatus.equals("4")){
				return ResultVO.failed("请先撤销改站点或者删除改站点数据再提交!");
			}
			
			}
			
		return ResultVO.failed("参数错误！");
	}
	
	/**
	 * @Description:经办人获取可以提交的转供电数据
	 * @param :id 站点id
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/getNeedSubmitData")
	@ResponseBody
	public ResultVO getNeedSubmitData(HttpServletRequest request,TowerNeedTrans towerNeedTrans,Integer pageNo,Integer pageSize){
		// 当前登录人
        UserVo user = getLoginUser(request);
        
        //超级管理员的区县id是null
        //省级管理员可以搜索
        //需要权限控制，区县隔离
        if(user.getCity()==null ||user.getCity().equals("") ){//这是admin
        	if(towerNeedTrans.getCityId()!=null){
        		
        	}else {
        		towerNeedTrans.setCityId(null);
			}
        	if(towerNeedTrans.getCountyId() != null){
        		
        	}else{
        		towerNeedTrans.setCountyId(null);
        		
        	}
        }else if(towerNeedTrans.getTransLevel()!=null &&towerNeedTrans.getTransLevel().equals("1")){//这是省级管理员
        	System.out.println("已经有区县id在其中");
        }else {
        	towerNeedTrans.setCityId(String.valueOf(user.getCity()));
        	towerNeedTrans.setCountyId(String.valueOf(user.getCounty()));
		}
        //需要权限控制，区县隔离
//        accountSiteNeedTrans.setCityId(String.valueOf(user.getCity()));
//        accountSiteNeedTrans.setCountyId(String.valueOf(user.getCounty()));
		PageUtil<TowerNeedTrans> pageUtil = new PageUtil<>();
		if(pageNo != null && pageSize != null){
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		towerTransService.getNeedSubmitData(towerNeedTrans,pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	/**
     * @param : AccountSiteNeedTrans
     * @return :
     * @throws
     * @Description:转供电-撤销----------把提交过来的单子返回到新增人员手中
     */
    @RequestMapping("/cancelTransSite")
    @ResponseBody
    public ResultVO cancelTransSite(TowerNeedTrans towerNeedTrans) {
    	if(towerNeedTrans==null||towerNeedTrans.equals("")){
    		return ResultVO.failed("参数错误！");
    	}
    	if(towerNeedTrans.getOnlyId().equals("")){
    		return ResultVO.failed("参数错误！");
    	}
    	//根据onlyid查询数据比对，看是否是前台暴力更改
    	//根据onlyid改变submitstatus状态
    	boolean status = towerTransService.cancelTransSite(towerNeedTrans);
//    	boolean status = accountSiteTransService.cancelTransSite(needTrans);
    	if(status){
    		return ResultVO.success();
    	}else {
			return ResultVO.failed("撤销失败,正在审批或已经审批完成，请检查！");
		}
    	
    }
    
    /**
     * @param : ids
     * @return :
     * @throws
     * @Description: 批量删除电费单
     */
    @RequestMapping("/deleteByIDs")
    @ResponseBody
    public ResultVO deleteByIDs(String[] ids) {
    	return towerTransService.deleteByIDs(ids);
    }
	
	
	/**
     * 获取当前用户
     *
     * @param request httpRuquest
     * @return 用户
     */
    private UserVo getLoginUser(HttpServletRequest request) {
        Object userStr = request.getSession().getAttribute("userInfo");
        if (userStr == null) {
            throw new CommonException("请先登录！");
        }
        return JsonUtil.valueOf(userStr.toString(), UserVo.class);
    }
    
	/**
	 * @Description:导出excel
	 * @param request
	 * @param pageNo
	 * @param pageSize
	 * @return 列表
	 */
	@RequestMapping("/queryTransDatasPageExcel")
	@ResponseBody
	public ResultVO queryTransDatasPageExcel(HttpServletRequest request,HttpServletResponse response) {
		PageUtil<TowerNeedTrans> pageUtil = new PageUtil<>();
		int pageNum =1;
		pageUtil.setPageNo(pageNum);
		pageUtil.setPageSize(100000);
		//获取从前端来的参数
		TowerNeedTrans trVO = new TowerNeedTrans();
		trVO = getExcelNeedTrans(request,trVO);
		//创建表格
		SXSSFWorkbook wb = new SXSSFWorkbook(1000);//创建表格
		int a=0;
		int aa=0;
		Sheet sheet1=null; 
		
		String[] titleRow = new String[] {
				"地市",
				"区县",
				"资管站点名称",
				"铁塔站点名称",
				"铁塔站址编码",
				"用电类型",
				"改造状态"
				};
		while(true) {
			a=0;
			aa++;
			//获取数据
			towerTransService.getNeedSubmitData(trVO, pageUtil);
			if(pageUtil.getResults()!=null && pageUtil.getResults().size()!=0) {
				sheet1 = wb.createSheet("塔维转供电信息详情"+aa);
				Row row = sheet1.createRow(a++);
				for(int i=0;i<titleRow.length;i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(titleRow[i]);
				}
				List<TowerNeedTrans> vos  =pageUtil.getResults();
				for(TowerNeedTrans vo : vos) {
					System.out.println(a);
					System.out.println(aa);
					row = sheet1.createRow(a++);
					row.createCell(0).setCellValue(vo.getCityName()==null?"":vo.getCityName());
					row.createCell(1).setCellValue(vo.getCountyName()==null?"":vo.getCountyName());
					row.createCell(2).setCellValue(vo.getRoomName()==null?"":vo.getRoomName());
					row.createCell(3).setCellValue(vo.getTowerSiteName()==null?"":vo.getTowerSiteName());
					row.createCell(4).setCellValue(vo.getTowerSiteCode()==null?"":vo.getTowerSiteCode());
					row.createCell(5).setCellValue(vo.getSiteEleType()==null?"":(vo.getSiteEleType().equals("1")?"直供电":"转供电"));
					row.createCell(6).setCellValue((vo.getResultStatus()==null || vo.getResultStatus().equals(""))?"未提交流程":(vo.getResultStatus().equals("0")?"审批中":(vo.getResultStatus().equals("1")?"改造完成":"审批失败")));
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
            String fileName = "塔维转供电信息详情.xls";// 文件名    
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
	 * 导出时获取前端传递的信息
	 * 
	 * @param request
	 * @return 信息
	 */
	public TowerNeedTrans getExcelNeedTrans(HttpServletRequest request, TowerNeedTrans trVO) {
		String cityName = request.getParameter("cityName");
		String cityId = request.getParameter("cityId");
		String countyId = request.getParameter("countyId");
		String countyName = request.getParameter("countyName");
		String roomName = request.getParameter("roomName");
		String siteEleType = request.getParameter("siteEleType");
		String resultStatus = request.getParameter("resultStatus");
		if(cityId != null && !cityId.equals("")){
			trVO.setCityId(cityId);
		}
		if(countyId != null && !countyId.equals("")){
			trVO.setCountyId(countyId);
		}
		if(cityName != null && !cityName.equals("")){
			trVO.setCityId(cityName);
		}
		if(countyName != null && !countyName.equals("")){
			trVO.setCountyId(countyName);
		}
		if(roomName != null && !roomName.equals("")){
			trVO.setRoomName(roomName);;
		}
		if(resultStatus != null && !resultStatus.equals("")){
			trVO.setResultStatus(resultStatus);
		}
		if(siteEleType !=null && !siteEleType.equals("")){
			trVO.setSiteEleType(siteEleType);
		}
		return trVO;
	}
	
	/**
	 * @Description:审批通过后，改变供电状态
	 * @param :id 站点id
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/submitToFlow")
	@ResponseBody
	public ResultVO submitToFlow(HttpServletRequest request){
		TowerNeedTrans needTrans = new TowerNeedTrans();
//		AccountSiteNeedTrans needTrans = new AccountSiteNeedTrans();
		needTrans = getaNeedTrans(request, needTrans);
		if(needTrans.getOnlyId() == null || needTrans.getTowerSiteCode()==null || needTrans.getTowerSiteName()==null
		||needTrans.getOnlyId().equals("") || needTrans.getTowerSiteCode().equals("") || needTrans.getTowerSiteName().equals("")){
			return ResultVO.failed("参数错误");
		}
		//一 保存审批通过状态到SYS_ZGROOM_TRANS_MID，改变SUBMIT_STATUS状态为3,改变RESULT_STATUS为1
		//二 更改SYS_ACCOUNT_SITE中站点供电状态ELECTRICITY_TYPE为1
		towerTransService.saveSuccessStatus(needTrans);
				return ResultVO.success();
			
		
	}
	
	/**
	 * 获取前端传递的转供电信息
	 * 
	 * @param request
	 * @return 转供电信息
	 */
	public TowerNeedTrans getaNeedTrans(HttpServletRequest request, TowerNeedTrans needTrans) {
		String trusteesId = request.getParameter("trusteesId");//新增数据人id
		String roomEleType = request.getParameter("roomEleType");
		String trusteesName = request.getParameter("trusteesName");//新增数据人名字
		String siteEleType = request.getParameter("siteEleType");
		String towerSiteCode = request.getParameter("towerSiteCode");
		String towerSiteName = request.getParameter("towerSiteName");
		String onlyId = request.getParameter("onlyId");
		String roomName = request.getParameter("roomName");
		String createDate = request.getParameter("createDate");//提交时间
		
		if (null != trusteesId && !trusteesId.equals("")) {
			needTrans.setTrusteesId(trusteesId);
		}
		if (null != roomEleType && !roomEleType.equals("")) {
			needTrans.setRoomEleType(roomEleType);
		}
		if (null != trusteesName && !trusteesName.equals("")) {
			needTrans.setTrusteesName(trusteesName);
		}
		if (null != siteEleType && !siteEleType.equals("")) {
			needTrans.setSiteEleType(siteEleType);
		}
		if (null != towerSiteCode && !towerSiteCode.equals("")) {
			needTrans.setTowerSiteCode(towerSiteCode);;
		}
		if (null != towerSiteName && !towerSiteName.equals("")) {
			needTrans.setTowerSiteName(towerSiteName);;
		}
		if (null != onlyId && !onlyId.equals("")) {
			needTrans.setOnlyId(onlyId);
		}
		if (null != roomName && !roomName.equals("")) {
			needTrans.setRoomName(roomName);
		}
		
		return needTrans;
	}
	
	
	/**
     * @param : electrictyVO
     * @return :
     * @throws
     * @Description: 修改时保存转供电数据
     */
    @RequestMapping("/saveTransInfo")
    @ResponseBody
    public ResultVO saveTransInfo(HttpServletRequest request, String str) {
    	TowerNeedTrans tNeedTrans = new TowerNeedTrans();
    	try {
    		tNeedTrans = JSON.parseObject(str,TowerNeedTrans.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	 Object object = request.getSession().getAttribute("userInfo");
         request.getParameter("");
         UserVo userInfo = null;
         if (object != null) {
             userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
         }
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        
        return towerTransService.saveTransInfo(tNeedTrans, userInfo);
    }
	

}
