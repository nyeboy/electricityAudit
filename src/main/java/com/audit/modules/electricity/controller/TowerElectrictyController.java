package com.audit.modules.electricity.controller;

import com.alibaba.fastjson.JSON;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.GlobalUitl;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.LogUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.entity.RoomIsOnlineVO;
import com.audit.modules.electricity.entity.TowerElectrictyEntities;
import com.audit.modules.electricity.entity.TowerElectrictyExcelVO;
import com.audit.modules.electricity.entity.TowerElectrictyVO;
import com.audit.modules.electricity.entity.TowerSaveEntities;
import com.audit.modules.electricity.entity.TowerToAddVO;
import com.audit.modules.electricity.entity.TowerWatthourMeterVO;
import com.audit.modules.electricity.service.TowerElectricityService;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.towerbasedata.psu.entity.TowerPSUVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description : 塔维电费录入
 * @date : 2016/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/towerElectricty")
public class TowerElectrictyController {

    @Autowired
    private TowerElectricityService towerElectricityService;

    /**
     * @param : ElectrictyVO  Model
     * @return :
     * @throws
     * @Description: 获取电费录入内容
     */
    @RequestMapping("/queryList")
    @ResponseBody
    public ResultVO queryList(HttpServletRequest request, TowerElectrictyEntities towerElectrictyEntities) {
        PageUtil<TowerElectrictyVO> page = new PageUtil<>();
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
        towerElectricityService.queryList(page, towerElectrictyEntities, userInfo);
        return ResultVO.success(page);
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 跳转到添加页面(获取流水号、地市、区县)
     */
    @RequestMapping("/toAdd")
    @ResponseBody
    public TowerToAddVO toAdd(HttpServletRequest request) {
        Object object = request.getSession().getAttribute("userInfo");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        return towerElectricityService.toAdd(userInfo);
    }

    /**
     * @param : electrictyVO
     * @return :
     * @throws
     * @Description: 保存
     */
    @RequestMapping("/saveElectricty")
    @ResponseBody
    public ResultVO saveElectricty(HttpServletRequest request, String str) {
        TowerSaveEntities towerSaveEntities = new TowerSaveEntities();
        try {
            towerSaveEntities = JSON.parseObject(str, TowerSaveEntities.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Object object = request.getSession().getAttribute("userInfo");
        request.getParameter("");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        return towerElectricityService.saveElectricty(towerSaveEntities, userInfo);
    }
    
    /**
     * 根据稽核单id查询超标杆情况
     */
    @RequestMapping("/checkPowerRatingByTowerID")
    @ResponseBody
    public ResultVO checkPowerRatingByTowerID(String id) {
    
    	Map<String,Object> ret =towerElectricityService.checkPowerRatingByTowerID(id);
    	return ResultVO.success(ret);
    }
    
    /**
     * @param : electrictyVO
     * @return :
     * @throws
     * @Description: 检测电表是否超标杆
     */
    @RequestMapping("/checkPowerRating")
    @ResponseBody
    public ResultVO checkPowerRating(HttpServletRequest request, String str) {
        TowerSaveEntities towerSaveEntities = new TowerSaveEntities();
        try {
            towerSaveEntities = JSON.parseObject(str, TowerSaveEntities.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Map<String,Object> ret = towerElectricityService.checkPowerRating(towerSaveEntities);
        if((boolean) ret.get("isPR")) {
        	if((double)ret.get("overScale")==99.9999) {
        		return ResultVO.newResult(200, "用电量超标20%以上", "用电量超标,超标类型为额定功率,超标值为9999%");
        	}else if((double)ret.get("overScale")>0.2){
        		NumberFormat nf = NumberFormat.getPercentInstance();
    			nf.setMaximumFractionDigits(2);
    			return ResultVO.newResult(200, "用电量超标20%以上", "用电量超标,超标类型为额定功率,超标值为"+nf.format((double)ret.get("overScale")));        	
    		}else {
    			NumberFormat nf = NumberFormat.getPercentInstance();
    			nf.setMaximumFractionDigits(2);
    			return ResultVO.newResult(200, "用电量超标", "用电量超标,超标类型为额定功率,超标值为"+nf.format((double)ret.get("overScale")));
    		}
        }else {
        	return ResultVO.success("未超标杆值");
        }
    }
    
    /**
     * 根据铁塔站址编码获取对应在网和退网机房的数量
     */
    @RequestMapping("/getSiteNoRoomIsOnline")
    @ResponseBody
    public ResultVO getSiteNoRoomIsOnline(String siteNo) {
    	RoomIsOnlineVO siteNoRoomIsOnline = towerElectricityService.getSiteNoRoomIsOnline(siteNo);
    	
    	return ResultVO.success(siteNoRoomIsOnline);
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
            resultMap = towerElectricityService.stasticStatusByCreatePerson(userId);
        }
        if (null != personType && personType.equals("1")) {
            resultMap = towerElectricityService.stasticStatusBySubmitPerson(userId);
        }else{
        	resultMap = towerElectricityService.stasticStatusByCreatePerson(userId);
        }
        return ResultVO.success(resultMap);
    }
    
    /**
     * @param : userId 用户Id （经办人，报销发起人）
     * @param : personType 类型：0:经办人，1：报销发起人                                       
     * @return :
     * 
     * @throws
     * @Description: 统计报销单状态
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
            resultMap = towerElectricityService.stasticStatusSubmitByCreatePerson(userId);
        }
        if (null != personType && personType.equals("1")) {
            resultMap = towerElectricityService.stasticStatusSubmitBySubmitPerson(userId);
        }else{
        	resultMap = towerElectricityService.stasticStatusSubmitByCreatePerson(userId);
        }
        return ResultVO.success(resultMap);
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
        return towerElectricityService.deleteByIDs(ids);
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
            return ResultVO.success(towerElectricityService.findOneByID(id));
        } catch (Exception e) {
            LogUtil.getLogger().info(e.getMessage());
            System.out.println(e.getMessage());
            return ResultVO.failed("查询失败");
        }
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 修改电费
     */
    @RequestMapping("/updateElectricty")
    @ResponseBody
    public ResultVO updateElectricty(HttpServletRequest request, String str) {
        TowerSaveEntities towerSaveEntities = new TowerSaveEntities();
        try {
            towerSaveEntities = JSON.parseObject(str, TowerSaveEntities.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (towerSaveEntities.getId() == null || "".equals(towerSaveEntities.getId())) {
            return ResultVO.failed("ID不能传入空值！");
        }
        Object object = request.getSession().getAttribute("userInfo");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        towerElectricityService.updateElectricty(towerSaveEntities, userInfo);
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
        return towerElectricityService.batchSubmit(ids, userInfo);
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 修改电费状态
     */
    @RequestMapping("/updateStatus")
    @ResponseBody
    public ResultVO updateStatus(String[] ids, Integer status) {
        return towerElectricityService.updateStatus(ids, status);
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 生成电费提交单时获取 总金额
     */
    @RequestMapping("/queryTotalAmountByTowerIDs")
    @ResponseBody
    public ResultVO queryTotalAmountByTowerIDs(String[] ids) {
        if (ids == null || ids.length == 0) {
            return ResultVO.failed("请至少选择一条电表数据！");
        }
        List<String> tid = Arrays.asList(ids);

        return ResultVO.success(towerElectricityService.queryTotalAmountByTowerIDs(tid));
    }

    @RequestMapping("/checkSerialNumber")
    @ResponseBody
    public ResultVO checkSerialNumber(HttpServletRequest request,String serialNumber){
        if(StringUtils.isBlank(serialNumber)){
            return ResultVO.failed("流水号不能为空！");
        }
        return towerElectricityService.checkSerialNumber(serialNumber);
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
    public ResultVO exportExcel(HttpServletRequest request) throws IOException { 
    	 Map<String,Object> map=new HashMap<>();
    	 Object object = request.getSession().getAttribute("userInfo");
    	 UserVo userInfo = null;
    	 Integer[] status={0,7};
         if (object != null) {
             userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
         }
         map.put("userID", userInfo.getUserId() == null ? "" : userInfo.getUserId());
         map.put("status", status);
        List<TowerElectrictyExcelVO> list=towerElectricityService.exportExcel(map);
		return ResultVO.success(list);
    }   
    
    @RequestMapping("getMt")
    @ResponseBody
    public ResultVO getMt(String id){
    	TowerWatthourMeterVO mt = towerElectricityService.getMt(id);
    	return ResultVO.success(mt);
    }
}
