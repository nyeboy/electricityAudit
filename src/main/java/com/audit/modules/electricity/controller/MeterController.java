package com.audit.modules.electricity.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.electricity.entity.MeterVo;
import com.audit.modules.electricity.service.MeterService;

/**
 * @author : 袁礼斌
 * @Description : 业主电表信息管理controller
 * @date : 2017/4/21
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/meterController")
public class MeterController {

	@Resource
	private MeterService meterService;
	/**
     * @param :
     * @return :
     * @throws
     * @Description: 查询业主电表信息
     */
    @RequestMapping("/queryMeter")
    @ResponseBody
    public ResultVO queryMeter(String meterId, HttpServletRequest request) {
        return ResultVO.success(meterService.queryMeter(meterId));
    }
    
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 添加业主电表信息
     */
    @RequestMapping("/saveMeter")
    @ResponseBody
    public ResultVO saveMeter(MeterVo meterVo, HttpServletRequest request) {
        return ResultVO.success(meterService.saveMeter(meterVo));
    }
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 修改业主电表信息
     */
    @RequestMapping("/updateMeter")
    @ResponseBody
    public ResultVO updateMeter(MeterVo meterVo, HttpServletRequest request) {
        return ResultVO.success(meterService.updateMeter(meterVo));
    }
    
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 删除业主信息
     */
    @RequestMapping("/deleteMeter")
    @ResponseBody
    public ResultVO deleteMeter(String meterId, HttpServletRequest request) {
        return ResultVO.success(meterService.deleteMeter(meterId));
    }
}
