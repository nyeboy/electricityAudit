package com.audit.modules.basedata.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.audit.modules.common.ResultVO;

/**   
 * @Description : TODO(下载模板excel)    
 *
 * @author : chentao
 * @date : 2017年6月2日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Controller
@RequestMapping("downloadModel")
public class DownloadModelController {
	
	
	/**
	 * Excel模板下载
	 * @param response
	 * @param request
	 * @param fileName
	 * @throws Exception
	 */
	@RequestMapping("downLoadExcelDemo")
	public void downLoadExcelDemo(HttpServletResponse response,HttpServletRequest request, String fileName)throws Exception {
		
		System.err.println("-----"+fileName);
		OutputStream os = null;
		InputStream in = null;
		String fileNameEnd = null;
		try {
			fileNameEnd = fileName+".xlsx";
			String path = request.getRealPath("/WEB-INF/excel/");
			//File file = new File(path+"\\"+fileNameEnd);
			File file = new File(path+"/"+fileNameEnd);
			System.out.println(file.getPath());
			if (file.exists()) {
				in = new FileInputStream(file);
				os = response.getOutputStream();
				
				response.reset();// 清空输出流
				response.addHeader("Content-Disposition","attachment;filename=" + new String(fileNameEnd.getBytes("GB2312"), "ISO8859-1"));// 设定输出文件头
				response.setContentType("application/x-download");
				response.setCharacterEncoding("utf-8");
				byte[] bytes = new byte[1024*1024];
				int i = 0;
				while((i=in.read(bytes)) != -1){
					 os.write(bytes, 0, i);
				}
				os.flush();
			}
		} catch (IOException e) {
			e.printStackTrace();
			ResultVO.failed("文件【"+fileNameEnd+"】不存在！");
			throw new Exception("文件【"+fileNameEnd+"】不存在！") ;
		} finally {
			if (in != null) {
				in.close();
			}
			if (os != null) {
				os.close();
			}
		}
	}
	
	
	
}
