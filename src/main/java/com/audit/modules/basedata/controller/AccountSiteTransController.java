package com.audit.modules.basedata.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpRequest;
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
import com.audit.modules.basedata.dao.AccountSiteTransDao;
import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSitePSU;
import com.audit.modules.basedata.entity.AccountSiteTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.service.AccountSiteTransService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.electricity.entity.ElectrictySaveVO;
import com.audit.modules.invoice.entity.InvoiceVO;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
@Controller
@RequestMapping("/accountSiteTrans")
public class AccountSiteTransController {
	@Autowired
	private AccountSiteTransService accountSiteTransService;
	
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
		PageUtil<AccountSiteNeedTrans> pageUtil = new PageUtil<>();
		int pageNum =1;
		pageUtil.setPageNo(pageNum);
		pageUtil.setPageSize(100000);
		//获取从前端来的参数
		AccountSiteNeedTrans trVO = new AccountSiteNeedTrans();
		trVO = getExcelNeedTrans(request,trVO);
		WatthourMeterVO VO = new WatthourMeterVO();
		//创建表格
		SXSSFWorkbook wb = new SXSSFWorkbook(1000);//创建表格
		int a=0;
		int aa=0;
		Sheet sheet1=null; 
		
		String[] titleRow = new String[] {
				"地市",
				"区县",
				"前期上报站点名称",
				"站点名称",
				"资管产权性质",
				"用电类型",
				"改造状态"
				};
		while(true) {
			a=0;
			aa++;
			//获取数据
			accountSiteTransService.getNeedSubmitData(trVO, pageUtil);
			if(pageUtil.getResults()!=null && pageUtil.getResults().size()!=0) {
				sheet1 = wb.createSheet("转供电信息详情"+aa);
				Row row = sheet1.createRow(a++);
				for(int i=0;i<titleRow.length;i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(titleRow[i]);
				}
				List<AccountSiteNeedTrans> vos  =pageUtil.getResults();
				for(AccountSiteNeedTrans vo : vos) {
					System.out.println(a);
					System.out.println(aa);
					row = sheet1.createRow(a++);
					row.createCell(0).setCellValue(vo.getCityName()==null?"":vo.getCityName());
					row.createCell(1).setCellValue(vo.getCountyName()==null?"":vo.getCountyName());
					row.createCell(2).setCellValue(vo.getSiteName()==null?"":vo.getSiteName());
					row.createCell(3).setCellValue(vo.getSiteName()==null?"":vo.getSiteName());
					row.createCell(4).setCellValue(vo.getProperType()==null?"":(vo.getProperType().equals("0")?"自维":"塔维"));
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
            String fileName = "转供电信息详情.xls";// 文件名    
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
	public AccountSiteNeedTrans getExcelNeedTrans(HttpServletRequest request, AccountSiteNeedTrans trVO) {
		String cityName = request.getParameter("cityName");
		String cityId = request.getParameter("cityId");
		String countyId = request.getParameter("countyId");
		String countyName = request.getParameter("countyName");
		String siteName = request.getParameter("siteName");
		String properType = request.getParameter("properType");
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
		if(siteName != null && !siteName.equals("")){
			trVO.setSiteName(siteName);
		}
		if(properType != null && !properType.equals("")){
			trVO.setProperType(properType);
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
     * @param : AccountSiteNeedTrans
     * @return :
     * @throws
     * @Description:转供电-撤销----------把提交过来的单子返回到新增人员手中
     */
    @RequestMapping("/cancelTransSite")
    @ResponseBody
    public ResultVO cancelTransSite(AccountSiteNeedTrans needTrans) {
    	if(needTrans==null||needTrans.equals("")){
    		return ResultVO.failed("参数错误！");
    	}
    	if(needTrans.getOnlyId().equals("")){
    		return ResultVO.failed("参数错误！");
    	}
    	//根据onlyid查询数据比对，看是否是前台暴力更改
    	//根据onlyid改变submitstatus状态
    	boolean status = accountSiteTransService.cancelTransSite(needTrans);
    	if(status){
    		return ResultVO.success();
    	}else {
			return ResultVO.failed("撤销失败,正在审批或已经审批完成，请检查！");
		}
    	
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
    	AccountSiteNeedTrans needTrans = new AccountSiteNeedTrans();
    	try {
			needTrans = JSON.parseObject(str,AccountSiteNeedTrans.class);
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
        return accountSiteTransService.saveTransInfo(needTrans,userInfo);
    }
	
	/**
	 * @Description:转供电修改数据
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/accountSiteTrans")
	@ResponseBody
	public void accountSiteTrans(AccountSiteTransSubmit accountSiteTransSubmit) {
		System.out.println("jindaozheli");
	}
	/**
	 * @Description:新增页面中 -----查询需要改造的转供电列表
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/findNeedTransList")
	@ResponseBody
	public ResultVO findNeedTransList(HttpServletRequest request,AccountSiteTrans accountSiteTrans,Integer pageNo,Integer pageSize){
		// 当前登录人
        UserVo user = getLoginUser(request);
        //超级管理员的区县id是null
        //需要权限控制，区县隔离
        if(user.getCity()==null ||user.getCity().equals("")){
        	if(accountSiteTrans.getCityId()!=null){
        		
        	}else {
        		accountSiteTrans.setCityId(null);
			}
        	if(accountSiteTrans.getCountyId() != null){
        		
        	}else{
        		accountSiteTrans.setCountyId(null);
        		
        	}
        }else{
//        	accountSiteTrans.setCityId(String.valueOf(user.getCity()));
//        	accountSiteTrans.setCountyId(String.valueOf(user.getCounty()));
        }
		PageUtil<AccountSiteTrans> pageUtil = new PageUtil<>();
		if(pageNo != null && pageSize != null){
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		accountSiteTransService.findNeedTransList(accountSiteTrans,pageUtil);
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
	public ResultVO addNeedChangeSiteToNext(HttpServletRequest request,AccountSiteTrans accountSiteTrans){
		// 当前登录人
        UserVo user = getLoginUser(request);
		if(accountSiteTrans != null && !accountSiteTrans.equals("")){
			accountSiteTrans.setTrusteesId(user.getUserId());//新增数据管理员的数据
			accountSiteTrans.setTrusteesName(user.getUserName());
			//验证审批通过的和已经提交的数据，防止重复提交
			String subStatus = accountSiteTransService.checkIsSubmitData(accountSiteTrans);
			if(subStatus==null ||subStatus.equals("") || subStatus.equals("2")){
				//把提交信息保存到SYS_ZGROOM_TRANS_MID
				accountSiteTransService.saveNeedChangeSite(accountSiteTrans);
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
	public ResultVO getNeedSubmitData(HttpServletRequest request,AccountSiteNeedTrans accountSiteNeedTrans,Integer pageNo,Integer pageSize){
		// 当前登录人
        UserVo user = getLoginUser(request);
        
        //超级管理员的区县id是null
        //省级管理员可以搜索
        //需要权限控制，区县隔离
        if(user.getCity()==null ||user.getCity().equals("") ){//这是admin
        	if(accountSiteNeedTrans.getCityId()!=null){
        		
        	}else {
        		accountSiteNeedTrans.setCityId(null);
			}
        	if(accountSiteNeedTrans.getCountyId() != null){
        		
        	}else{
        		accountSiteNeedTrans.setCountyId(null);
        		
        	}
        }else if(accountSiteNeedTrans.getTransLevel()!=null &&accountSiteNeedTrans.getTransLevel().equals("1")){//这是省级管理员
        	System.out.println("已经有区县id在其中");
        }else {
        	accountSiteNeedTrans.setCityId(String.valueOf(user.getCity()));
        	accountSiteNeedTrans.setCountyId(String.valueOf(user.getCounty()));
		}
        //需要权限控制，区县隔离
//        accountSiteNeedTrans.setCityId(String.valueOf(user.getCity()));
//        accountSiteNeedTrans.setCountyId(String.valueOf(user.getCounty()));
		PageUtil<AccountSiteNeedTrans> pageUtil = new PageUtil<>();
		if(pageNo != null && pageSize != null){
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		accountSiteTransService.getNeedSubmitData(accountSiteNeedTrans,pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	
	/**
	 * @Description:提交单个转供电站点到流程中---废弃
	 * @param :id 站点id
	 * @return :ResultVO
	 * @throws
	*/
/*	@RequestMapping("/saveTransEleAdd")
	@ResponseBody
	public ResultVO saveTransEleAdd(AccountSiteTrans accountSiteTrans){
		if(accountSiteTrans != null && !accountSiteTrans.equals("")){
			String siteId = accountSiteTrans.getSiteId();
			if(siteId != null && !siteId.equals("")){
				accountSiteTransService.saveTransEleAdd(siteId);
				return ResultVO.success();
			}
			
		}
		return ResultVO.failed("参数错误！");
		
	}*/
	
	/**
	 * @Description:审批通过后，改变供电状态
	 * @param :id 站点id
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/submitToFlow")
	@ResponseBody
	public ResultVO submitToFlow(HttpServletRequest request){
		AccountSiteNeedTrans needTrans = new AccountSiteNeedTrans();
		needTrans = getaNeedTrans(request, needTrans);
		if(needTrans.getOnlyId() == null || needTrans.getSiteId()==null || needTrans.getRoomId()==null
		||needTrans.getOnlyId().equals("") || needTrans.getSiteId().equals("") || needTrans.getRoomId().equals("")){
			return ResultVO.failed("参数错误");
		}
		//一 保存审批通过状态到SYS_ZGROOM_TRANS_MID，改变SUBMIT_STATUS状态为3,改变RESULT_STATUS为1
		//二 更改SYS_ACCOUNT_SITE中站点供电状态ELECTRICITY_TYPE为1
		accountSiteTransService.saveSuccessStatus(needTrans);
				return ResultVO.success();
			
		
	}
	
	/**
	 * 获取前端传递的转供电信息
	 * 
	 * @param request
	 * @return 转供电信息
	 */
	public AccountSiteNeedTrans getaNeedTrans(HttpServletRequest request, AccountSiteNeedTrans needTrans) {
		String trusteesId = request.getParameter("trusteesId");//新增数据人id
		String roomEleType = request.getParameter("roomEleType");
		String trusteesName = request.getParameter("trusteesName");//新增数据人名字
		String siteEleType = request.getParameter("siteEleType");
		String properType = request.getParameter("properType");
		String siteId = request.getParameter("siteId");
		String siteName = request.getParameter("siteName");
		String onlyId = request.getParameter("onlyId");
		String roomName = request.getParameter("roomName");
		String roomId = request.getParameter("roomId");
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
		if (null != properType && !properType.equals("")) {
			needTrans.setProperType(properType);
		}
		if (null != siteId && !siteId.equals("")) {
			needTrans.setSiteId(siteId);
		}
		if (null != siteName && !siteName.equals("")) {
			needTrans.setSiteName(siteName);
		}
		if (null != onlyId && !onlyId.equals("")) {
			needTrans.setOnlyId(onlyId);
		}
		if (null != roomName && !roomName.equals("")) {
			needTrans.setRoomName(roomName);
		}
		if (null != roomId && !roomId.equals("")) {
			needTrans.setRoomId(roomId);
		}
		
		return needTrans;
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
        return accountSiteTransService.deleteByIDs(ids);
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
	
	

}
