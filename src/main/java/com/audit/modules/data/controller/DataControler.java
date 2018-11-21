package com.audit.modules.data.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.dom4j.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.data.service.DataService;

/**
 * @author : 袁礼斌
 * @Description : 数据导入
 * @date : 2017/4/18
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/dataControler")
public class DataControler {

	@Autowired
    private DataService dataService;

    /**
     * @param :
     * @return :
     * @throws DocumentException 
     * @throws IOException 
     * @throws
     * @Description: 导入
     */
    @RequestMapping("/importEleContract")
    @ResponseBody
    public Boolean importEleContract(HttpServletRequest request) throws IOException, DocumentException {
        return dataService.importEleContract();
    }
    
    /**
     * 全量同步部门信息
     * @param request
     * @return
     * @throws IOException
     * @throws DocumentException
     */
    @RequestMapping("/addAllDpts")
    @ResponseBody
    public Boolean addAllDpts(HttpServletRequest request) throws IOException, DocumentException {
        return dataService.addAllDpts();
    }
    /**
     * 增量同步人员信息
     * @param request
     * @return
     * @throws IOException
     * @throws DocumentException
     */
    @RequestMapping("/addEmps")
    @ResponseBody
    public Boolean addEmps(HttpServletRequest request) throws IOException, DocumentException {
        return dataService.addEmps("2017-04-1","2017-04-02");
    }
}
