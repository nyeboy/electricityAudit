package com.audit.modules.supplier.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.system.entity.UserVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.supplier.entity.SupplierVO;
import com.audit.modules.supplier.service.SupplierService;

import javax.servlet.http.HttpServletRequest;

/**
 * @author :
 * @Description : TODO(供应商)
 * @date : 2017年4月11日
 * <p>
 * Copyright (c) 2017, IsoftStone All Right reserved.
 */

@Controller
@RequestMapping("supplier")
public class SupplierController {

    @Autowired
    SupplierService supplierService;


    /**
     * @param code 供应商编码
     * @return 供应商信息/状态
     * @Description 根据code获取供应商名称
     */
    @RequestMapping("queryNameByCode")
    @ResponseBody
    public ResultVO queryNameByCode(String code) {

        List<Map<String, String>> list = supplierService.queryNameByCode(code);
        return ResultVO.success(list);
    }

    /**
     * @Description: 模糊查询供应商
     * @param : name 供应商名称
     * @param :areaCode 部门编号
     * @return :
     * 
     */
	@RequestMapping("queryLikeByName")
    @ResponseBody
    public ResultVO queryLikeByName(SupplierVO supplierVO, HttpServletRequest request) {  
//		List<SupplierVO> lists = new ArrayList<SupplierVO>();
    	Object object = request.getSession().getAttribute("userInfo");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        PageUtil<SupplierVO> page = new PageUtil<SupplierVO>();

        if (userInfo != null) {
            supplierVO.setAreaCode(userInfo.getDepartmentId());
            supplierVO.setAreaCodes(userInfo.getDepartmentIdSum());
            page.setDepartmentNameSum(userInfo.getDepartmentIdSum());
        }
        if (supplierVO != null) {
            page.setObj(supplierVO);
        }
        String pageNo = request.getParameter("pageNo");
        String pageSize = request.getParameter("pageSize");
        if (pageNo != null && !"".equals(pageNo) && pageSize != null && !"".equals(pageSize)) {
            page.setPageNo(Integer.parseInt(pageNo));
            page.setPageSize(Integer.parseInt(pageSize));
        }
       /* if(page.getDepartmentNameSum()!=null){
        	for(int i=0;i<page.getDepartmentNameSum().size();i++){
//        		supplierVO.setAreaCode(page.getDepartmentNameSum().get(i));
        		 if (supplierVO != null) {
        	            page.setObj(supplierVO);
        	        } 
        		 List<SupplierVO> list = supplierService.findLikeByName(page, userInfo,supplierVO);
        		 if(list!=null){          			
        			 for(int j=0;j<list.size();j++){
        				 if(i==0){
        				 lists.add(list.get(j));  
        				 }else{    
        					 int pd=0;
        						for(int k=0;k<lists.size();k++){
        							if(list.get(j).getCode().equals(lists.get(k).getCode())){        								
        								list.remove(j);
        								pd=1;
        								break;
        								//lists.add(list.get(j));       							       								
        							}
        						}   
        						if(pd==0){
	        						lists.add(list.get(j));
	        						}
        				 }        				     				
        			 }        									
        		 }
        	}
        	}*/
        List<SupplierVO> list = supplierService.findLikeByName(page, userInfo,supplierVO);
        if(list != null){
        	page.setResults(list);
        }
       // page.setResults(lists);
        return ResultVO.success(page);
    }

    @RequestMapping("queryBySiteID")
    @ResponseBody
    public ResultVO queryBySiteID(String siteID){
        return ResultVO.success(supplierService.findBySiteID(siteID));
    }
    
    @RequestMapping("queryContractBySiteID")
    @ResponseBody
    public ResultVO queryContractBySiteID(String siteID){
    	ElectrictyVO findContractBySiteID = supplierService.findContractBySiteID(siteID);
        return ResultVO.success(findContractBySiteID);
    }
    
    @RequestMapping("queryContract")
    @ResponseBody
    public ResultVO queryContract(String siteID){
        return ResultVO.success(supplierService.queryContract(siteID));
    }

}
