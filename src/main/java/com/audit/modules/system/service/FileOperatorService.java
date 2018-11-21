package com.audit.modules.system.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.audit.modules.basedata.entity.TransEleFile;
import com.audit.modules.common.ResultVO;
import org.springframework.web.multipart.MultipartFile;

import com.audit.modules.system.entity.SysFile;
import com.audit.modules.towerbasedata.trans.entity.TowerTransEleFile;

/**
 * @author : jiadu
 * @Description : 附件上传下载
 * @date : 2017/3/9
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface FileOperatorService {
    Map<String,String> saveFile(MultipartFile[] multipartFile,HttpServletRequest request);
    //自维转供电上传附件
    Map<String,String> saveFileTrans(MultipartFile[] multipartFile,HttpServletRequest request);
    //塔维转供电上传附件
    Map<String,String> saveFileTowerTrans(MultipartFile[] multipartFile,HttpServletRequest request);
    
    Map<String,String> saveFileagain(MultipartFile[] multipartFile,HttpServletRequest request,String saydno);
    Map<String,String> saveFileExcel(MultipartFile[] multipartFile,HttpServletRequest request);
    Map<String,String> saveFileExcel1(MultipartFile[] multipartFile,HttpServletRequest request);
    SysFile findByID(String id);
    //自维转供电查看附件
    TransEleFile findByIDTrans(String id);
    //塔维转供电查看附件
    TowerTransEleFile findByIDTowerTrans(String id);
    
    ResultVO fileDelete(String ids[]);

}
