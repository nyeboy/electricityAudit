package com.audit.modules.site.controller;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.audit.modules.common.dict.DefaultCode;
import com.audit.modules.electricity.vo.ElectricityBenchmarkCheckVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.DeviceVO;
import com.audit.modules.electricity.entity.PowerRatingVO;
import com.audit.modules.electricity.entity.TowerEleBenchmark;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.site.entity.SmartMeterStandard;
import com.audit.modules.site.entity.SwitchPowerStandard;
import com.audit.modules.site.service.BenchmarkService;
import com.audit.modules.site.service.EquipmentRoomService;
import com.google.common.collect.Maps;

/**
 * @author 王松
 * @Description
 * 标杆管理
 * @date 2017/3/15
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@Controller
@RequestMapping("/benchmark")
public class BenchmarkController {

    @Autowired
    private EquipmentRoomService equipmentRoomService;
    
    @Autowired
    private BenchmarkService benchmarkService;
    /**
     * 获取额定功率的标杆
     * @return
     * @throws UnsupportedEncodingException 
     */
    @RequestMapping("/powerRating")
    @ResponseBody
    public ResultVO queryPowerRating(HttpServletRequest request, Integer pageNo, Integer pageSize) throws UnsupportedEncodingException{
    	request.setCharacterEncoding("utf-8");
    	Map<String,Object> paramMap = Maps.newHashMap();  
    	System.out.println(request.getParameter("siteName")+"==========");
        paramMap.put("siteName",request.getParameter("siteName"));
        paramMap.put("cityId",request.getParameter("cityId"));
        paramMap.put("countyId",request.getParameter("countyId"));
        paramMap.put("pageNo",pageNo);
        paramMap.put("pageSize",pageSize);
        
        PageUtil<SiteInfoVO> pageUtil = new PageUtil<>();
        pageUtil.setObj(paramMap);
        if (pageNo != null && pageSize != null) {
            pageUtil.setPageNo(pageNo);
            pageUtil.setPageSize(pageSize);
        }
        PageUtil<PowerRatingVO> list = benchmarkService.queryBenchmarkOfPowerRating(pageUtil);
        return ResultVO.success(list);

    }

    /**
     * 获取额定功率的标杆的详情
     * @param siteId 报账点ID
     * @return
     */
    @RequestMapping("/powerRatingDetail")
    @ResponseBody
    public ResultVO queryPowerRating(String siteId){
    	if(siteId == null){
    		return null;
		}
    	
    	
    	List<DeviceVO> list = equipmentRoomService.queryDevice(siteId);
       //根据设备型号和设备厂商，查询设备功率
    	if(list!=null && list.size()>0) {
    		for(DeviceVO deviceVo : list) {
    			PowerRateManage powerRatingVo = new PowerRateManage();
    			powerRatingVo.setDeviceModel(deviceVo.getDeviceModel());
    			powerRatingVo.setDeviceVendor(deviceVo.getDeviceVendor());
    			powerRatingVo.setDeviceType(deviceVo.getDeviceType());
    			PowerRateManage newPowerRate = equipmentRoomService.getPowerRating(powerRatingVo);
    			if(newPowerRate!=null && newPowerRate.getPowerRating()!=null) {
    				deviceVo.setPowerRating(newPowerRate.getPowerRating());
    			}else {
    				deviceVo.setPowerRating("0");
    			}
    		}
    	}
       return ResultVO.success(list);
    }
    
    /**   
     * @Description: TODO(智能电表--标杆信息)
     * @param :		 id         报账点id()其他接口调用'预留' 
     * @param :      siteName	报账点   
     * @param :      pageNo    	当前页
     * @param :      pageSize	每页显示数
     * @param :      cityId 	市
     * @param :      countyId 	区县
     * @param :		 startDate  电费归属起始日期
     * @param :		 endDate    电费归属截止日期
     * @return :     参数/状态(json)   
     * @throws ParseException 
    */
    @RequestMapping("querySmartMeterStandard")
    @ResponseBody
	public ResultVO querySmartMeterStandard(HttpServletRequest request, Integer pageNo, Integer pageSize) throws ParseException {

		Map<String, Object> paramMap = Maps.newHashMap();
		
		paramMap.put("siteName", request.getParameter("siteName"));
		paramMap.put("cityId", request.getParameter("cityId"));
		paramMap.put("countyId", request.getParameter("countyId"));
		paramMap.put("startDate", request.getParameter("startDate"));
		paramMap.put("endDate", request.getParameter("endDate"));
//		paramMap.put("siteIds", request.getParameter("siteIds"));
	
		
		PageUtil<SmartMeterStandard> page = new PageUtil<SmartMeterStandard>();
		if (paramMap != null && !paramMap.isEmpty()) {
			page.setObj(paramMap);
		}
		page.setObj(paramMap);
        if (pageNo != null && pageSize != null) {
        	page.setPageNo(pageNo);
        	page.setPageSize(pageSize);
        }
		benchmarkService.querySmartMeterStandard(page);
		return ResultVO.success(page);
	}
    
    
    /**   
     * @Description: TODO(开关电源--标杆信息) 
     * @param :		 id         报账点id()其他接口调用'预留'
     * @param :      siteName	报账点名称  
     * @param :      pageNo    	当前页
     * @param :      pageSize	每页显示数
     * @param :      cityId 	市
     * @param :      countyId 	区县
     * @return :     参数/状态(json)   
    */
    @RequestMapping("querySwitchPowerStandard")
    @ResponseBody
	public ResultVO querySwitchPowerStandard(HttpServletRequest request, Integer pageNo, Integer pageSize) {

		Map<String, Object> paramMap = Maps.newHashMap();
//		paramMap.put("siteIds", request.getParameter("siteIds"));//外部掉用需要参数？
		paramMap.put("siteName", request.getParameter("siteName"));
		paramMap.put("cityId", request.getParameter("cityId"));
		paramMap.put("countyId", request.getParameter("countyId"));
		
		PageUtil<SwitchPowerStandard> page = new PageUtil<SwitchPowerStandard>();
		if (paramMap != null && !paramMap.isEmpty()) {
			page.setObj(paramMap);
		}
		if (pageNo != null && pageSize != null) {
        	page.setPageNo(pageNo);
        	page.setPageSize(pageSize);
        }
		benchmarkService.querySwitchPowerStandard(page);
		return ResultVO.success(page);
	}

    /**
     * 查看超标杆情况
     *
     * @return
     */
    @RequestMapping("queryOverBenchmark")
    @ResponseBody
	public ResultVO queryOverBenchmark(HttpServletRequest request){
        String eId = request.getParameter("eId");
        if(eId == null || eId.trim().isEmpty()){
            return ResultVO.newResult(DefaultCode.PARAMETER_ERROR.setMessage("参数eId不能为空"));
        }

        ElectricityBenchmarkCheckVO data = benchmarkService.queryOverBenchmark(eId);
        return ResultVO.success(data);
    }
    
    /**
     * 塔维查看超标杆情况
     *
     * @return
     */
    @RequestMapping("queryOverBenchmarkTw")
    @ResponseBody
	public ResultVO queryOverBenchmarkTw(HttpServletRequest request){
        String eId = request.getParameter("eId");
        if(eId == null || eId.trim().isEmpty()){
            return ResultVO.newResult(DefaultCode.PARAMETER_ERROR.setMessage("参数eId不能为空"));
        }

        ElectricityBenchmarkCheckVO data = benchmarkService.queryOverBenchmarkTw(eId);
        return ResultVO.success(data);
    }
}
