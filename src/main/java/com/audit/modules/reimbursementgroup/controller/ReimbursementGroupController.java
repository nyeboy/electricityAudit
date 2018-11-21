package com.audit.modules.reimbursementgroup.controller;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.reimbursementgroup.entity.ReimbursementVO;
import com.audit.modules.reimbursementgroup.service.ReimbursementGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * @author : jiadu
 * @Description : 报账组管理
 * @date : 2017/4/19
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("reimbursementGroup")
public class ReimbursementGroupController {

    @Autowired
    private ReimbursementGroupService reimbursementGroupService;

    /**
     * @Description: 查询列表
     * @param :
     * @return :
     * @throws
    */
    @RequestMapping("/queryList")
    @ResponseBody
    public ResultVO queryList(HttpServletRequest request, ReimbursementVO reimbursementVO) {
        PageUtil<ReimbursementVO> page = new PageUtil<>();
        String pageNo = request.getParameter("pageNo");
        String pageSize = request.getParameter("pageSize");
        if (pageNo != null && !"".equals(pageNo) && pageSize != null && !"".equals(pageSize)) {
            page.setPageNo(Integer.parseInt(pageNo));
            page.setPageSize(Integer.parseInt(pageSize));
        }
        reimbursementGroupService.queryList(page, reimbursementVO);
        return ResultVO.success(page);
    }

    /**
     * @Description: 新增
     * @param :
     * @return :
     * @throws
    */
    @RequestMapping("/createReimbursement")
    @ResponseBody
    public ResultVO createReimbursement(ReimbursementVO reimbursementVO){
        return reimbursementGroupService.createReimbursement(reimbursementVO);
    }

    /**
     * @Description: 修改
     * @param :
     * @return :
     * @throws
    */
    @RequestMapping("/updateReimbursement")
    @ResponseBody
    public ResultVO updateReimbursement(ReimbursementVO reimbursementVO){
        return reimbursementGroupService.updateReimbursement(reimbursementVO);
    }

    @RequestMapping("/deleteByIds")
    @ResponseBody
    public ResultVO deleteByIds(String ids[]){
        if(ids==null||ids.length==0){
            return ResultVO.failed("请至少选择一个！");
        }
        return reimbursementGroupService.deleteByIds(ids);
    }

    @RequestMapping("/findOneById")
    @ResponseBody
    public ResultVO findOneById(String id){
        if(id==null){
            return ResultVO.failed("id不能为空！");
        }
        ReimbursementVO reimbursementVO = reimbursementGroupService.findOneById(id);
        return ResultVO.success(reimbursementVO);
    }
}
