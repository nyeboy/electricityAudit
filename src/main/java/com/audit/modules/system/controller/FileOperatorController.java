package com.audit.modules.system.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.druid.sql.visitor.functions.Substring;
import com.audit.modules.basedata.entity.TransEleFile;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.FileUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.system.entity.SysFile;
import com.audit.modules.system.service.FileOperatorService;
import com.audit.modules.towerbasedata.trans.entity.TowerTransEleFile;
import com.mysql.fabric.xmlrpc.base.Data;

/**
 * @author : jiadu
 * @Description : 文件上传下载
 * @date : 2017/3/9
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("/fileOperator")
public class FileOperatorController {

    @Autowired
    private FileOperatorService fileOperatorService;

    @RequestMapping("/fileUpload")
    @ResponseBody
    private ResultVO fileUpload(@RequestParam(value="files") MultipartFile[] files,HttpServletRequest request){
        if(files==null||files.length==0){
            return ResultVO.failed("附件不能为空！");
        }
        Map<String,String> map = fileOperatorService.saveFile(files,request);
        return ResultVO.success(map);
    }
    
    //自维转供电上传附件
    @RequestMapping("/fileUploadTrans")
    @ResponseBody
    private ResultVO fileUploadTrans(@RequestParam(value="files") MultipartFile[] files,HttpServletRequest request){
        if(files==null||files.length==0){
            return ResultVO.failed("附件不能为空！");
        }
        Map<String,String> map = fileOperatorService.saveFileTrans(files,request);
        return ResultVO.success(map);
    }
    
    //塔维转供电上传附件
    @RequestMapping("/fileUploadTowerTrans")
    @ResponseBody
    private ResultVO fileUploadTowerTrans(@RequestParam(value="files") MultipartFile[] files,HttpServletRequest request){
        if(files==null||files.length==0){
            return ResultVO.failed("附件不能为空！");
        }
        Map<String,String> map = fileOperatorService.saveFileTowerTrans(files,request);
        return ResultVO.success(map);
    }
    
    
    @RequestMapping("/fileUploadagain")
    @ResponseBody
    private ResultVO fileUploadagain(@RequestParam(value="files") MultipartFile[] files,HttpServletRequest request){
    	String szydno = request.getParameter("fjszydno");
        if(files==null||files.length==0){
            return ResultVO.failed("附件不能为空！");
        }
        Map<String,String> map = fileOperatorService.saveFileagain(files,request,szydno);
        return ResultVO.success(map);
    }
    
    
    
    @RequestMapping("/fileUploadexcel")
    @ResponseBody
    private ResultVO fileUploadexcel(@RequestParam(value="files") MultipartFile[] files,HttpServletRequest request){
        if(files==null||files.length==0){
            return ResultVO.failed("附件不能为空！");
        }
        Map<String,String> map = fileOperatorService.saveFileExcel(files,request);
        return ResultVO.success(map);
    }
    
    
    @RequestMapping("/fileUploadexcel1")
    @ResponseBody
    private ResultVO fileUploadexcel1(@RequestParam(value="files") MultipartFile[] files,HttpServletRequest request){
        if(files==null||files.length==0){
            return ResultVO.failed("附件不能为空！");
        }
        Map<String,String> map = fileOperatorService.saveFileExcel1(files,request);
        return ResultVO.success(map);
    }
    

    @RequestMapping("/imgUpload")
    @ResponseBody
    private ResultVO imgUpload(@RequestParam(value="files") MultipartFile[] files,@RequestParam(value="fileName") String fileName,HttpServletRequest request) throws IOException, ServletException{
    	//String savePath = request.getServletContext().getRealPath("/images");
		//System.out.println(savePath);
    	if(files==null||files.length==0){
            return ResultVO.failed("附件不能为空！");
        }
    	MultipartFile file = files[files.length-1]; //获取前台所传文件	  
    	//String fileName=request.getParameter("fileName");
       // String header = request.getHeader("content-disposition");
		// 获取文件名
		//String fileName = getFileName(header);		
		//保存图片路径 
		//File filepath =new File(request.getServletContext().getRealPath("/images/"+"("+new Date().getTime()+")"+fileName));		
		//OutputStream osc = new FileOutputStream(filepath);
    	//将图片写入服务器
		//file.write(osc);// 将录入的信息写入到文件
    	if(fileName!=null||fileName.equals("")){
    		fileName= fileName.substring(fileName.lastIndexOf("."));  		
    	}
		String filepath =request.getServletContext().getRealPath("/img/images/"+new Date().getTime()+fileName);
		System.out.println(fileName+"==-==名称"+filepath);
		FileUtil.writeByte(filepath, file.getBytes());
        
        return ResultVO.success(filepath);
    }
    
    @RequestMapping("/fileDownLoadImg")
    private void fileDownLoadImg(String filepath, HttpServletResponse response, HttpServletRequest request) throws IOException{
        if(filepath==null){
            return ;
        }
        response.reset();
        if (filepath != null) {
            OutputStream outp = response.getOutputStream();
            response.setCharacterEncoding("utf-8");
            response.addHeader("Content-Transfer-Encoding", "binary");
                // 读取文件并输出
                File file = new File(filepath);
                if (file.exists()) {
                    response.setContentLength((int) file.length());
                    FileInputStream in = null;
                    try {
                        in = new FileInputStream(filepath);
                        byte[] b = new byte[1024];
                        int i = 0;
                        while ((i = in.read(b)) > 0) {
                            outp.write(b, 0, i);
                        }
                        outp.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        if (in != null) {
                            in.close();
                            in = null;
                        }
                        if (outp != null) {
                            outp.close();
                            outp = null;
                            response.flushBuffer();
                        }
                    }
                } else {
                    response.getWriter().print("<font style='font-weight:800;color:#696969;font-size:14px;text-align:center;'>The file is not exists!</font>");
                }
        }
    }

    
    public String getFileName(String header) {
		String[] tempArr1 = header.split(";");
		String[] tempArr2 = tempArr1[2].split("=");
		// 获取文件名，兼容各种浏览器的写法
		String fileName = tempArr2[1].substring(tempArr2[1].lastIndexOf("\\") + 1).replaceAll("\"", "");
		return fileName;
	}
    
    @RequestMapping("/fileDelete")
    @ResponseBody
    private ResultVO fileDelete(String[] ids){
        if(ids==null||ids.length==0){
            return ResultVO.failed("ID不能为空！");
        }
        return fileOperatorService.fileDelete(ids);
    }
    
    
    
    
    

    @RequestMapping("/fileDownLoad")
    private void downLoad(String fileID, HttpServletResponse response, HttpServletRequest request) throws IOException{
        SysFile sysFile = fileOperatorService.findByID(fileID);
        if(sysFile==null){
            return ;
        }
        response.reset();
        String vers = request.getHeader("USER-AGENT");
        String filepath = sysFile.getFilepath();
        String fileName = sysFile.getFilename()+"."+sysFile.getExt();
        if (filepath != null) {
            OutputStream outp = response.getOutputStream();
            String isDownload = request.getParameter("download");
            String contextType = getContextType(sysFile.getExt(), true);
            response.setContentType(contextType);
            response.setCharacterEncoding("utf-8");
            if (vers.indexOf("Chrome") != -1 && vers.indexOf("Mobile") != -1) {
                fileName = fileName.toString();
            } else {
                fileName = StringUtils.encodingString(fileName, "GB2312", "ISO-8859-1");
            }
            if ("application/octet-stream".equals(contextType) || StringUtils.isNotBlank(isDownload)) {
                response.addHeader("Content-Disposition", "attachment;filename=" + fileName);
            } else {
                response.addHeader("Content-Disposition", "filename=" + fileName);
            }
            response.addHeader("Content-Transfer-Encoding", "binary");
                // 读取文件并输出
                File file = new File(filepath);
                if (file.exists()) {
                    response.setContentLength((int) file.length());
                    FileInputStream in = null;
                    try {
                        in = new FileInputStream(filepath);
                        byte[] b = new byte[1024];
                        int i = 0;
                        while ((i = in.read(b)) > 0) {
                            outp.write(b, 0, i);
                        }
                        outp.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        if (in != null) {
                            in.close();
                            in = null;
                        }
                        if (outp != null) {
                            outp.close();
                            outp = null;
                            response.flushBuffer();
                        }
                    }
                } else {
                    response.getWriter().print("<font style='font-weight:800;color:#696969;font-size:14px;text-align:center;'>The file is not exists!</font>");
                }
        }
    }
    //自维查看下载
    @RequestMapping("/fileDownLoadTrans")
    private void downLoadTrans(String fileID, HttpServletResponse response, HttpServletRequest request) throws IOException{
//        SysFile sysFile = fileOperatorService.findByID(fileID);
        TransEleFile transEleFile = fileOperatorService.findByIDTrans(fileID);
        if(transEleFile==null){
            return ;
        }
        response.reset();
        String vers = request.getHeader("USER-AGENT");
        String filepath = transEleFile.getFilepath();
        String fileName = transEleFile.getFilename()+"."+transEleFile.getExt();
        if (filepath != null) {
            OutputStream outp = response.getOutputStream();
            String isDownload = request.getParameter("download");
            String contextType = getContextType(transEleFile.getExt(), true);
            response.setContentType(contextType);
            response.setCharacterEncoding("utf-8");
            if (vers.indexOf("Chrome") != -1 && vers.indexOf("Mobile") != -1) {
                fileName = fileName.toString();
            } else {
                fileName = StringUtils.encodingString(fileName, "GB2312", "ISO-8859-1");
            }
            if ("application/octet-stream".equals(contextType) || StringUtils.isNotBlank(isDownload)) {
                response.addHeader("Content-Disposition", "attachment;filename=" + fileName);
            } else {
                response.addHeader("Content-Disposition", "filename=" + fileName);
            }
            response.addHeader("Content-Transfer-Encoding", "binary");
                // 读取文件并输出
                File file = new File(filepath);
                if (file.exists()) {
                    response.setContentLength((int) file.length());
                    FileInputStream in = null;
                    try {
                        in = new FileInputStream(filepath);
                        byte[] b = new byte[1024];
                        int i = 0;
                        while ((i = in.read(b)) > 0) {
                            outp.write(b, 0, i);
                        }
                        outp.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        if (in != null) {
                            in.close();
                            in = null;
                        }
                        if (outp != null) {
                            outp.close();
                            outp = null;
                            response.flushBuffer();
                        }
                    }
                } else {
                    response.getWriter().print("<font style='font-weight:800;color:#696969;font-size:14px;text-align:center;'>The file is not exists!</font>");
                }
        }
    }
    //塔维查看下载
    @RequestMapping("/fileDownLoadTowerTrans")
    private void downLoadTowerTrans(String fileID, HttpServletResponse response, HttpServletRequest request) throws IOException{
//        SysFile sysFile = fileOperatorService.findByID(fileID);
    	TowerTransEleFile towerTransEleFile = fileOperatorService.findByIDTowerTrans(fileID);
        if(towerTransEleFile==null){
            return ;
        }
        response.reset();
        String vers = request.getHeader("USER-AGENT");
        String filepath = towerTransEleFile.getFilepath();
        String fileName = towerTransEleFile.getFilename()+"."+towerTransEleFile.getExt();
        if (filepath != null) {
            OutputStream outp = response.getOutputStream();
            String isDownload = request.getParameter("download");
            String contextType = getContextType(towerTransEleFile.getExt(), true);
            response.setContentType(contextType);
            response.setCharacterEncoding("utf-8");
            if (vers.indexOf("Chrome") != -1 && vers.indexOf("Mobile") != -1) {
                fileName = fileName.toString();
            } else {
                fileName = StringUtils.encodingString(fileName, "GB2312", "ISO-8859-1");
            }
            if ("application/octet-stream".equals(contextType) || StringUtils.isNotBlank(isDownload)) {
                response.addHeader("Content-Disposition", "attachment;filename=" + fileName);
            } else {
                response.addHeader("Content-Disposition", "filename=" + fileName);
            }
            response.addHeader("Content-Transfer-Encoding", "binary");
                // 读取文件并输出
                File file = new File(filepath);
                if (file.exists()) {
                    response.setContentLength((int) file.length());
                    FileInputStream in = null;
                    try {
                        in = new FileInputStream(filepath);
                        byte[] b = new byte[1024];
                        int i = 0;
                        while ((i = in.read(b)) > 0) {
                            outp.write(b, 0, i);
                        }
                        outp.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        if (in != null) {
                            in.close();
                            in = null;
                        }
                        if (outp != null) {
                            outp.close();
                            outp = null;
                            response.flushBuffer();
                        }
                    }
                } else {
                    response.getWriter().print("<font style='font-weight:800;color:#696969;font-size:14px;text-align:center;'>The file is not exists!</font>");
                }
        }
    }


    /**
     * 获取内容类型。
     *
     * @param extName
     * @return
     */
    private String getContextType(String extName, boolean isRead) {
        String contentType = "application/octet-stream";
        if ("jpg".equalsIgnoreCase(extName) || "jpeg".equalsIgnoreCase(extName)) {
            contentType = "image/jpeg";
        } else if ("png".equalsIgnoreCase(extName)) {
            contentType = "image/png";
        } else if ("gif".equalsIgnoreCase(extName)) {
            contentType = "image/gif";
        } else if ("doc".equalsIgnoreCase(extName) || "docx".equalsIgnoreCase(extName)) {
            contentType = "application/msword";
        } else if ("xls".equalsIgnoreCase(extName) || "xlsx".equalsIgnoreCase(extName)) {
            contentType = "application/vnd.ms-excel";
        } else if ("ppt".equalsIgnoreCase(extName) || "pptx".equalsIgnoreCase(extName)) {
            contentType = "application/ms-powerpoint";
        } else if ("rtf".equalsIgnoreCase(extName)) {
            contentType = "application/rtf";
        } else if ("htm".equalsIgnoreCase(extName) || "html".equalsIgnoreCase(extName)) {
            contentType = "text/html";
        } else if ("swf".equalsIgnoreCase(extName)) {
            contentType = "application/x-shockwave-flash";
        } else if ("bmp".equalsIgnoreCase(extName)) {
            contentType = "image/bmp";
        } else if ("mp4".equalsIgnoreCase(extName)) {
            contentType = "video/mp4";
        } else if ("wmv".equalsIgnoreCase(extName)) {
            contentType = "video/x-ms-wmv";
        } else if ("wm".equalsIgnoreCase(extName)) {
            contentType = "video/x-ms-wm";
        } else if ("rv".equalsIgnoreCase(extName)) {
            contentType = "video/vnd.rn-realvideo";
        } else if ("mp3".equalsIgnoreCase(extName)) {
            contentType = "audio/mp3";
        } else if ("wma".equalsIgnoreCase(extName)) {
            contentType = "audio/x-ms-wma";
        } else if ("wav".equalsIgnoreCase(extName)) {
            contentType = "audio/wav";
        }
        if ("pdf".equalsIgnoreCase(extName) && isRead)// txt不下载文件，读取文件内容
        {
            contentType = "application/pdf";
        }
        if (("sql".equalsIgnoreCase(extName) || "txt".equalsIgnoreCase(extName)) && isRead)// pdf不下载文件，读取文件内容
        {
            contentType = "text/plain";
        }
        return contentType;
    }
}
