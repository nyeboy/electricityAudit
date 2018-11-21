package com.audit.modules.tower.controller;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.LogUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.entity.TowerWatthourMeterVO;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.tower.entity.TowerSiteVO;
import com.audit.modules.tower.service.TowerSiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/towerSite")
public class TowerSiteController {

    @Autowired
    private TowerSiteService towerSiteService;

    @RequestMapping("/queryzhLabelByTowerSiteCode")
    @ResponseBody
    private ResultVO queryzhLabelByTowerSiteCode(String code) {
        if (!StringUtils.isNotBlank(code)) {
            return ResultVO.failed("铁塔地址编号不能为空！");
        }
        return towerSiteService.queryzhLabelByTowerSiteCode(code);
    }

    @RequestMapping("/queryTowerSite")
    @ResponseBody
    private ResultVO queryTowerSite(HttpServletRequest request, TowerSiteVO towerSiteVO) {
        PageUtil<TowerSiteVO> page = new PageUtil<>();
        String pageNo = request.getParameter("pageNo");
        String pageSize = request.getParameter("pageSize");
        if (pageNo != null && !"".equals(pageNo) && pageSize != null && !"".equals(pageSize)) {
            page.setPageNo(Integer.parseInt(pageNo));
            page.setPageSize(Integer.parseInt(pageSize));
        }
        UserVo userInfo = null;
        Object object = request.getSession().getAttribute("userInfo");
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        List<TowerSiteVO> towerSiteVOList = towerSiteService.queryTowerSite(page, towerSiteVO, userInfo);
        page.setResults(towerSiteVOList);
        return ResultVO.success(page);
    }

    @RequestMapping("/selectWatthour")
    @ResponseBody
    private ResultVO selectWatthour(String zyCode) {
    	 List<TowerWatthourMeterVO> watthourMeterVOs = towerSiteService.selectWatthour(zyCode);
        return ResultVO.success(watthourMeterVOs);
    }
    
    @RequestMapping("/excelImport")
    @ResponseBody
    public ResultVO importExecel(@RequestParam(value = "file") MultipartFile file, HttpServletRequest request) {
        if (file == null || file.isEmpty()) {
            return ResultVO.failed("请上传文件！");
        }
        UserVo userInfo = null;
        Object object = request.getSession().getAttribute("userInfo");
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
        }
        try {
            return towerSiteService.importExcel(file, userInfo);
        } catch (Exception e) {
            e.printStackTrace();
            LogUtil.getLogger().error(e.getMessage());
            return ResultVO.failed("保存出错！", e.getMessage());
        }
    }
}
