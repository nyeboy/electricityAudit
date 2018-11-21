package com.audit.modules.dataimport.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedList;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;

import com.audit.modules.common.utils.Log;
import com.audit.modules.dataimport.service.ZgDataImportService;

/**   
 * @Description : 定时任务    
 *
 * @author : liuyan
 * @date : 2017年4月11日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class TimedTask {
	
	@Autowired
    private  ZgDataImportService zgDataImportService;

    public void dataImport() {
    	Log.info("资管数据导入开始!");
		
		//读取资管数据导入配置文件
		Properties prop = new Properties();
		InputStream ins = this.getClass().getResourceAsStream("/conf/dataImport.properties");
		try {
			prop.load(ins);
		} catch (IOException e) {
			Log.error("资管数据导入错误："+e.getMessage());
			e.printStackTrace();
		}
		
		//获取TXT文件存放路径
		String dataPath = prop.getProperty("dataImportTxtPath");
		if (dataPath.equals(null) || dataPath.equals("")){
			Log.error("资管数据导入错误：TXT文件存储路径为空!");
		} else {
			//获取文件夹下的所有文件
			LinkedList<File> fileList = new LinkedList<File>();
			fileList = zgDataImportService.getFileList(dataPath, fileList);
			
			if(fileList.size()>0){
				long startTime = System.currentTimeMillis();  //获取开始时间
				
				for (File txtFile : fileList) {
					String fileName = txtFile.getName().replaceAll("[^A-Z]", "");
					//根据文件名获取数据表名
					String tableName = prop.getProperty(fileName, null);
					//执行数据导入：读取TXT文件，删除数据表原有数据并导入数据
					if(tableName != null){
						zgDataImportService.readDateFile(txtFile,tableName);
					}
				}
				long endTime = System.currentTimeMillis();//获取结束时间
				//输出程序运行时间到日志
				Log.info("资管数据导入运行时间：" + (endTime - startTime)/1000 + "s");
				
				//数据导入完成后，执行数据库表间数据同步
				if(zgDataImportService.dataUpdateAfterImport()){
					Log.info("资管数据导入：表间数据更新完成！");
				} else {
					Log.error("资管数据导入错误：表间数据更新失败！");
				}
			}
		}
    }
}
