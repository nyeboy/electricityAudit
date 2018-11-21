package com.audit.modules.costcenter.controller;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.LogUtil;
import com.audit.modules.costcenter.entity.CostCeterVO;
import com.audit.modules.costcenter.service.CostCenterService;
import com.audit.modules.supplier.entity.SupplierVO;
import com.audit.modules.system.entity.UserVo;
import com.google.common.collect.Maps;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * @author : jiadu
 * @Description : 成本中心
 * @date : 2017/4/1
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/costcenter")
public class CostcenterController {

    @Autowired
    private CostCenterService costCenterService;

    /**
     * @Description: 数据同步（全量）
     * @param :
     * @return :
     * @throws
    */
    @RequestMapping("/costCenterImport")
    @ResponseBody
    public ResultVO importExecel(@RequestParam(value="file") MultipartFile file, HttpServletRequest request){
        if(file==null||file.isEmpty()){
            return ResultVO.failed("请上传文件！");
        }
        try {
            costCenterService.importExecel(file);
        } catch (Exception e) {
            e.printStackTrace();
            LogUtil.getLogger().error(e.getMessage());
            return ResultVO.failed("保存出错！",e.getMessage());
        }
        return ResultVO.success();
    }

    /**
     * @Description: 根据登录用户获取成本中心
     * @param :
     * @return :
     * @throws
    */
    @RequestMapping("/findByUser")
    @ResponseBody
    public ResultVO findByLoginUser(HttpServletRequest request){
    	List<CostCeterVO> lists = new ArrayList<CostCeterVO>();
        Object object = request.getSession().getAttribute("userInfo");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
          // return ResultVO.success(costCenterService.findByLoginUser(userInfo));
        }
        if (userInfo != null) { 
        	System.out.println(userInfo.getAccount()+"------");
        	Map<String, String> paramterMap = Maps.newHashMap();
            paramterMap.put("account", userInfo.getAccount());
    		 List<CostCeterVO> list = costCenterService.findByLoginUser(paramterMap);
    		 if(list!=null){
    	        	return ResultVO.success(list);
    	        }
/*        if(userInfo.getDepartmentIdSum()!=null){
        	for(int i=0;i<userInfo.getDepartmentIdSum().size();i++){
        		Map<String, String> paramterMap = Maps.newHashMap();
                paramterMap.put("departmentNo", userInfo.getDepartmentIdSum().get(i));
        		 List<CostCeterVO> list = costCenterService.findByLoginUser(paramterMap);
        		 System.out.println( list.size());
        		 if(list!=null){          			
        			 for(int j=0;j<list.size();j++){
        				 if(i==0){
        				 lists.add(list.get(j));  
        				 }else{      
        					 int pd=0;
        						for(int k=0;k<lists.size();k++){
        							System.out.println(list.get(j).getId()+"QQQ"+lists.get(k).getId());
        							if(list.get(j).getId().equals(lists.get(k).getId())){        								
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
        	}
        if(lists!=null){
        	return ResultVO.success(lists);
        } */
        }       
        return ResultVO.failed("用户不存在！");
    }

}
