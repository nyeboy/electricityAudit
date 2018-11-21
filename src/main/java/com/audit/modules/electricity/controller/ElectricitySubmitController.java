package com.audit.modules.electricity.controller;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.entity.ElectricitySubmitVO;
import com.audit.modules.electricity.entity.SubmitProcess;
import com.audit.modules.electricity.service.ElectricitySubmitService;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.List;

/**
 * @author : jiadu
 * @Description : 电费提交单
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/electricitySubmit")
public class ElectricitySubmitController {

    @Autowired
    private ElectricitySubmitService electricitySubmitService;

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 生成电费提交单
     */
    @RequestMapping("/createteEleSubmit")
    @ResponseBody
    public ResultVO createteEleSubmit(ElectricitySubmitVO electricitySubmitVO, HttpServletRequest request) {
       
    	return electricitySubmitService.createEleSubmit(electricitySubmitVO, request);    
        
    }
    
    /**
     * 修改电费提交单
     */
    @RequestMapping("/createteEleSubmit_1")
    @ResponseBody
    public ResultVO createteEleSubmit_1(ElectricitySubmitVO electricitySubmitVO, HttpServletRequest request) {
       
    	return electricitySubmitService.createEleSubmit_1(electricitySubmitVO, request);    
        
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 查询列表信息
     */
    @RequestMapping("/queryList")
    @ResponseBody
    public ResultVO queryList(ElectricitySubmitVO electricitySubmitVO, Integer pageNo, Integer pageSize) {
        try {
            PageUtil<ElectricitySubmitVO> pageUtil = new PageUtil<>();
            if (pageNo != null && pageSize != null) {
                pageUtil.setPageNo(pageNo);
                pageUtil.setPageSize(pageSize);
            }
            electricitySubmitService.queryList(electricitySubmitVO, pageUtil);
            return ResultVO.success(pageUtil);
        } catch (ParseException e) {
            e.printStackTrace();
            return ResultVO.failed(e.getMessage());
        }
    }

    /**
     * @param : 电费提交表单ID
     * @return :
     * @throws
     * @Description: 查看详情
     */
    @RequestMapping("/queryDetail")
    @ResponseBody
    public ResultVO queryDetail(String subID) {
        return ResultVO.success(electricitySubmitService.queryDetail(subID));
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: (请描述此方法的作用)
     */
    @RequestMapping("/deleteBySubID")
    @ResponseBody
    public ResultVO deleteBySubID(String subID) {
        if (!StringUtils.isNotBlank(subID)) {
            return ResultVO.failed("ID不能为空！");
        }
        electricitySubmitService.deleteBySubID(subID);
        return ResultVO.success();
    }

    @RequestMapping("/updateStatus")
    @ResponseBody
    public ResultVO updateStatus(Integer status, String ids[]) {
        if (ids == null || ids.length == 0) {
            return ResultVO.failed("id不能为空！");
        }
        if (status == null) {
            return ResultVO.failed("状态不能为空！");
        }
        electricitySubmitService.updateStatus(status, ids);
        return ResultVO.success();
    }
    
	/**
	 * 通过流水号更新状态值
	 * 
	 * @param status 状态值
	 * @param submitNos 电费提交单叼
	 * @return 更新结果
	 */
    @RequestMapping("updateStatusByNo")
    @ResponseBody
	public ResultVO updateStatusByNo(Integer status, String submitNos[]) {
		return electricitySubmitService.updateStatusByNo(status, submitNos);
	}
    
    @RequestMapping("getMt")
    @ResponseBody
    public ResultVO getMt(String id){
    	List<WatthourExtendVO> mt = electricitySubmitService.getMt(id);
    	return ResultVO.success(mt);
    }
    
    @RequestMapping("getProcess")
    @ResponseBody
    public List<SubmitProcess> getProcess(String submitId){
    	List<SubmitProcess> processBySI = electricitySubmitService.getProcessBySI(submitId);
    	return processBySI;
    }

}
