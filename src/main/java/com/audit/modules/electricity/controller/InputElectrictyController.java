package com.audit.modules.electricity.controller;

import com.alibaba.fastjson.JSON;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.dict.DefaultCode;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.GlobalUitl;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.LogUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.entity.*;
import com.audit.modules.electricity.service.InputElectricityService;
import com.audit.modules.electricity.vo.ElectricityBenchmarkCheckVO;
import com.audit.modules.reimbursementgroup.entity.ReimbursementVO;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.site.service.SiteInfoService;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.audit.modules.watthourmeter.service.WatthourMeterService;
import com.audit.modules.workflow.entity.FinanceExpenseResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description : 电费录入
 * @date : 2016/3/7
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/inputElectricty")
public class InputElectrictyController {

    @Autowired
    private InputElectricityService inputElectricityService;
    @Autowired
    private SiteInfoService sfService;
    
    @Autowired
    private WatthourMeterService watthourMeterService;

    /**
     * @param : ElectrictyVO  Model
     * @return :
     * @throws
     * @Description: 获取电费录入内容
     */
    @RequestMapping("/queryList")
    @ResponseBody
    public ResultVO queryList(HttpServletRequest request, ElectrictyVO electrictyVO) {
        PageUtil<ElectrictyListVO> page = new PageUtil<>();
        Object object = request.getSession().getAttribute("userInfo");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        String pageNo = request.getParameter("pageNo");
        String pageSize = request.getParameter("pageSize");
        if (pageNo != null && !"".equals(pageNo) && pageSize != null && !"".equals(pageSize)) {
            page.setPageNo(Integer.parseInt(pageNo));
            page.setPageSize(Integer.parseInt(pageSize));
        }
        inputElectricityService.queryList(page, electrictyVO, userInfo);
        return ResultVO.success(page);
    }
    
     /**
     * @param : 
     * @return :
     * @throws
     * @Description: 通过经办人userID获取报账组
     */
    @RequestMapping("/selectSysRg")
    @ResponseBody
    public ResultVO selectSysRg(HttpServletRequest request) {
        Object object = request.getSession().getAttribute("userInfo");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        List<String> list = inputElectricityService.selectSysRg(userInfo);
        return ResultVO.success(list);
    }
    
    /**
     * @param : userId 用户Id （经办人，报销发起人）
     * @param : personType 类型：0:经办人，1：报销发起人                                       
     * @return :
     * 
     * @throws
     * @Description: 统计稽核单状态
     */
    @RequestMapping("/stasticStatus")
    @ResponseBody
    public ResultVO stasticStatus(HttpServletRequest request) {
    	String personType = "0";
    	String userId = null;
        List<Map<String, Object>> resultMap = null;
        UserVo user = GlobalUitl.getLoginUser();
        if(user != null){
        	userId = user.getUserId();
        }
        personType = request.getAttribute("personType") + "";
        if (null != personType && personType.equals("0")) {
            resultMap = inputElectricityService.stasticStatusByCreatePerson(userId);
        }
        if (null != personType && personType.equals("1")) {
            resultMap = inputElectricityService.stasticStatusBySubmitPerson(userId);
        }else{
        	resultMap = inputElectricityService.stasticStatusByCreatePerson(userId);
        }
        return ResultVO.success(resultMap);
    }
    
    /**
     * @param : userId 用户Id （经办人，报销发起人）
     * @param : personType 类型：0:经办人，1：报销发起人                                       
     * @return :
     * 
     * @throws
     * @Description: 统计稽核单状态
     */
    @RequestMapping("/stasticSubmitStatus")
    @ResponseBody
    public ResultVO stasticSubmitStatus(HttpServletRequest request) {
    	String personType = "0";
    	String userId = null;
    	List<Map<String, Object>> resultMap = null;
    	UserVo user = GlobalUitl.getLoginUser();
    	if(user != null){
    		userId = user.getUserId();
    	}
    	personType = request.getAttribute("personType") + "";
    	if (null != personType && personType.equals("0")) {
    		resultMap = inputElectricityService.stasticSubmitStatusByCreatePerson(userId);
    	}
    	if (null != personType && personType.equals("1")) {
    		resultMap = inputElectricityService.stasticSubmitStatusBySubmitPerson(userId);
    	}else{
    		resultMap = inputElectricityService.stasticSubmitStatusByCreatePerson(userId);
    	}
    	return ResultVO.success(resultMap);
    }


    /**
     * @param :
     * @return :
     * @throws
     * @Description: 跳转到添加页面
     */
    @RequestMapping("/toAdd")
    @ResponseBody
    public ElectrictyToAddVO toAdd(HttpServletRequest request) {
        Object object = request.getSession().getAttribute("userInfo");        
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        return inputElectricityService.toAdd(userInfo);
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
        return inputElectricityService.deleteByIDs(ids);
    }

    /**
     * @param : id
     * @return :
     * @throws
     * @Description: 查看详情
     */
    @RequestMapping("/findOneByID")
    @ResponseBody
    public ResultVO findOneByID(String id) {
        try {
            return ResultVO.success(inputElectricityService.findOneByID(id));
        } catch (Exception e) {
            LogUtil.getLogger().info(e.getMessage());
            System.out.println(e.getMessage());
            return ResultVO.failed("查询失败");
        }
    }

    /**
     * @param : id
     * @return :
     * @throws
     * @Description: 查看详情
     */
    @RequestMapping("/findOneByIDDetails")
    @ResponseBody
    public ResultVO findOneByIDDetails(String id) {
        try {
            return ResultVO.success(inputElectricityService.findOneByIDDetails(id));
        } catch (Exception e) {
            LogUtil.getLogger().info(e.getMessage());
            System.out.println(e.getMessage());
            return ResultVO.failed("查询失败");
        }
    }
    
    /**
     * @param : siteID 站点ID
     * @return :
     * @throws
     * @Description: 根据选择的站点名称获取其余数据
     */
    @RequestMapping("/findBySiteID")
    @ResponseBody
    public ElectricyBaseVO findBySiteID(String siteID) {
        ElectricyBaseVO electricyBaseVO = inputElectricityService.findBySiteID(siteID);
        return electricyBaseVO;
    }

    /**
     * @param : electrictyVO
     * @return :
     * @throws
     * @Description: 保存或者提交,根据status不同
     */
    @RequestMapping("/saveElectricty")
    @ResponseBody
    public ResultVO saveElectricty(HttpServletRequest request, String str) {
        ElectrictySaveVO electrictySaveVO = new ElectrictySaveVO();
        try {
            electrictySaveVO = JSON.parseObject(str, ElectrictySaveVO.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Object object = request.getSession().getAttribute("userInfo");
        request.getParameter("");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        return inputElectricityService.saveElectricty(electrictySaveVO, userInfo);
    }
    
    
   
    
    
    
   /**
     * @param : electrictyVO
     * @return :
     * @throws
     * @Description: 保存综合电费
     */
    @RequestMapping("/saveZElectricty")
    @ResponseBody
    public ResultVO saveZElectricty(HttpServletRequest request, String str) {
        ElectrictySaveVO electrictySaveVO = new ElectrictySaveVO();
        try {
            electrictySaveVO = JSON.parseObject(str, ElectrictySaveVO.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Object object = request.getSession().getAttribute("userInfo");
        request.getParameter("");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        return inputElectricityService.saveElectricty(electrictySaveVO, userInfo);
    }
    
    
    

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 修改电费
     */
    @RequestMapping("/updateElectricty")
    @ResponseBody
    public ResultVO updateElectricty(String str, HttpServletRequest request) {
        ElectrictySaveVO electrictySaveVO = new ElectrictySaveVO();
        try {
            electrictySaveVO = JSON.parseObject(str, ElectrictySaveVO.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (electrictySaveVO.getId() == null || "".equals(electrictySaveVO.getId())) {
            return ResultVO.failed("ID不能传入空值！");
        }
        inputElectricityService.updateElectricty(electrictySaveVO);
        return ResultVO.success();
    }

    /**
     * @param : ids
     * @return :
     * @throws
     * @Description: 批量提交
     */
    @RequestMapping("/batchSubmit")
    @ResponseBody
    public ResultVO batchSubmit(String[] ids, HttpServletRequest request) {
        UserVo userInfo = null;
        Object object = request.getSession().getAttribute("userInfo");
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        return inputElectricityService.batchSubmit(ids, userInfo);
    }
    
    
    /**
     * @param : ids
     * @return :
     * @throws
     * @Description: 综合电费批量提交
     */
    @RequestMapping("/zbatchSubmit")
    @ResponseBody
    public ResultVO zbatchSubmit(String[] ids, HttpServletRequest request) {
        UserVo userInfo = null;
        Object object = request.getSession().getAttribute("userInfo");
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        return inputElectricityService.zbatchSubmit(ids, userInfo);
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 模糊查询站点信息
     */
    @RequestMapping("/queryByBlurred")
    @ResponseBody
    public ResultVO queryByBlurred(String queryData, HttpServletRequest request, Integer pageNo, Integer pageSize) {
        Object object = request.getSession().getAttribute("userInfo");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        PageUtil<SiteInfoVO> pageUtil = inputElectricityService.queryByBlurred(queryData, pageNo, pageSize, userInfo);
        return ResultVO.success(pageUtil);
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 查询汇总金额
     */
    @RequestMapping("/queryTotalAmount")
    @ResponseBody
    public ResultVO queryTotalAmount() {
        return ResultVO.success(inputElectricityService.queryTotalAmount());
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 修改电费状态
     */
    @RequestMapping("/updateStatus")
    @ResponseBody
    public ResultVO updateStatus(String id, Integer status) {
        return inputElectricityService.updateStatus(id, status);
    }

    /**
     * 检测是否超标杆
     * @return
     */
    @RequestMapping("/check")
    @ResponseBody
    public ResultVO check(HttpServletRequest request){
        String eIdsStr = request.getParameter("eIds");
        if(eIdsStr == null || eIdsStr.trim().isEmpty()){
            return ResultVO.newResult(DefaultCode.PARAMETER_ERROR.setMessage("参数eIds不能为空"));
        }
        List<String> electricityIds = Arrays.asList(eIdsStr.split(","));

        String type = request.getParameter("type");
        List<ElectricityBenchmarkCheckVO> data = null;
        if(type != null && type.trim().equals("2")){
            data = inputElectricityService.check(electricityIds, 2);
        } else {
            data = inputElectricityService.check(electricityIds, 1);
        }

        return ResultVO.success(data);
    }
    
    /**
     * 查询保账点是否存在可以报账的机房
     */
    @RequestMapping("/getAccountRoomIsOnline")
    @ResponseBody
    public ResultVO getAccountRoomIsOnline(String accountId) {
    	if(accountId == null || accountId.equals("")) {
    		 return ResultVO.newResult(DefaultCode.PARAMETER_ERROR.setMessage("参数accountId不能为空"));
    	}
    	RoomIsOnlineVO accountRoomIsOnline = inputElectricityService.getAccountRoomIsOnline(accountId);
    	return ResultVO.success(accountRoomIsOnline);
    }
    
    /**
     * 根据原始数据直接查询是否超标
     * @param equest
     * @param serialNumber
     * @return
     */
    @RequestMapping("/check1")
    @ResponseBody
    public ResultVO check1(HttpServletRequest request, String str){
    	ElectrictySaveVO electrictySaveVO = new ElectrictySaveVO();
        try {
            electrictySaveVO = JSON.parseObject(str, ElectrictySaveVO.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    	return inputElectricityService.checkElePowerRating(electrictySaveVO);
    }

    @RequestMapping("/checkSerialNumber")
    @ResponseBody
    
    public ResultVO checkSerialNumber(HttpServletRequest request,String serialNumber){
        if(StringUtils.isBlank(serialNumber)){
            return ResultVO.failed("流水号不能为空！");
        }
        return inputElectricityService.checkSerialNumber(serialNumber);
    }
    
    @RequestMapping("downExcel")
    @ResponseBody
    public List<ElectrictyVO> downExcel(String pageSize,String pageNo){
    	Integer first = (Integer.parseInt(pageNo)-1)*Integer.parseInt(pageSize);
    	Integer last = first+Integer.parseInt(pageSize);
    	Map<String,Integer> map = new HashMap<String,Integer>();
    	map.put("first", first);
    	map.put("last", last);
    	List<ElectrictyVO> getall = inputElectricityService.getall(map);
    	return getall;
    }
    
    
    @RequestMapping("ZdownExcel")
    @ResponseBody
    public List<ElectrictyVO> ZdownExcel(){
    	List<ElectrictyVO> getall = inputElectricityService.getZall();
    	return getall;
    }
    
    //查报帐点缴费类型
    @RequestMapping("getPayTypeById")
    @ResponseBody
    public ResultVO  getPayTypeById(HttpServletRequest request){
    	String id = request.getParameter("id");
    	SiteInfoVO payTypeById = sfService.getPayTypeById(id);
    	return ResultVO.success(payTypeById);
    }
    
    @RequestMapping("addDEC")
    @ResponseBody
    public ResultVO addDEC(HttpServletRequest request){
    	String id = request.getParameter("id");
    	String dec = request.getParameter("dec");
    	Map<String, Object> map=new HashMap<String,Object>();
    	map.put("id", id);
    	map.put("dec", dec);
    	inputElectricityService.addDEC(map);
    	return ResultVO.success();
    }
    
    @RequestMapping("delupfile")
    @ResponseBody
    public ResultVO delupfile(HttpServletRequest request){
    	String id = request.getParameter("id");
    	inputElectricityService.delupfile(id);
    	return ResultVO.success();
    }
    
    @RequestMapping("geteleinfo")
    @ResponseBody
    public ResultVO geteleinfo(HttpServletRequest request){
    	String id = request.getParameter("id");
    	WatthourMeterVO geteleinfo = watthourMeterService.geteleinfo(id);
    	SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
    	Date belongEndTime = geteleinfo.getBelongEndTime();
    	String format = sdf.format(belongEndTime);
    	geteleinfo.setBelongEndTimeS(format);
    	return ResultVO.success(geteleinfo);
    }
    
    @RequestMapping("removeElectricityToSubmit")
    @ResponseBody
    public ResultVO removeElectricityToSubmit(ElectricitySubmitVO electricitySubmitVO,HttpServletRequest request) {
    	String electricityID = request.getParameter("electricityID");
    	String submitID = request.getParameter("submitID");
    	Map<String,Object> pre = new HashMap<String,Object>();
    	pre.put("submitID", submitID);
    	pre.put("electricityID", electricityID);
    	//中间表移出记录
    	inputElectricityService.delSEMS(pre,electricitySubmitVO);
    	
    	
    	return ResultVO.success();
    }
    @RequestMapping("checkSubmitIsOneyOne")
    @ResponseBody
    public ResultVO checkSubmitIsOneyOne(HttpServletRequest request) {
    	String submitID = request.getParameter("submitID");
    	Boolean isTrue = inputElectricityService.checkSubmitIsOneyOne(submitID);
    	return ResultVO.success(isTrue);
    }
}
