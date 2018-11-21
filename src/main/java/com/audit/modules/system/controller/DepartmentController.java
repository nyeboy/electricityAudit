package com.audit.modules.system.controller;

import com.audit.modules.common.ResultVO;
import com.audit.modules.system.service.DepartmentService;
import com.audit.modules.system.vo.DepartmentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * @author 王松
 * @description
 * @date 2017/5/26
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@Controller
@RequestMapping("/dpt")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @RequestMapping(value = "/getDpts")
    @ResponseBody
    public ResultVO getDpts(HttpServletRequest request) {
        String dptId = request.getParameter("dptId");
        List<DepartmentVO> data = new ArrayList<>();
        data = departmentService.findChildrenNum(dptId);
        return ResultVO.success(data);
    }
}
