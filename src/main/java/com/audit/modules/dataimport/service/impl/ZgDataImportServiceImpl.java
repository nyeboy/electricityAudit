package com.audit.modules.dataimport.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.utils.Log;
import com.audit.modules.dataimport.dao.ZgDataImportDao;
import com.audit.modules.dataimport.service.ZgDataImportService;

/**   
 * @Description : 资管数据导入方法实现  
 *
 * @author : liuyan
 * @date : 2017年4月13日
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
@Service
public class ZgDataImportServiceImpl implements ZgDataImportService{

	 @Autowired
	 private ZgDataImportDao zgDataImportDao;

	/**
	 * 获取文件夹下的文件
	 * @param path
	 * @param list
	 * @return
	 */
	@Override
	public LinkedList<File> getFileList(String path, LinkedList<File> list) {
        File file = new File(path);
        if (file.exists()) {
            File[] files = file.listFiles();
            if (files.length == 0) {
                Log.error("资管数据导入错误：TXT存储文件夹为空!");
                return null;
            } else {
                for (File txtFile : files) {
                    if (txtFile.isDirectory()) {
                    	getFileList(txtFile.getAbsolutePath(), list);
                    }else{
                    	list.add(txtFile);
                    }
                }
            }
        } else {
        	Log.error("资管数据导入错误：TXT存储路径不存在!");
        }
        return list;
    }
	
	/**
	 * 更新数据表
	 * @param list
	 * @return
	 */
	@Override
	public boolean dataUpdateAfterImport(){
		try {
			Map<String, Object> param = new HashMap<String, Object>();
			param.put("code", null);
			zgDataImportDao.dataUpdateAfterImport(param);
			if (("1").equals(param.get("code").toString())) {
				return true;
			}
			return false;
		} catch (Exception e) {
			Log.error("资管数据导入错误："+e.getMessage());
			return false;
		}
	}
	/**
	 * 循环解析文件
	 * @param list
	 * @return
	 */
	@Override
	public int readDateFile(File txtFile, String tableName) {
		String encoding = "UTF-8";
		if(checkTable(tableName) ==1 &&  deleteTable(tableName)){//判断表是否存在，并删除表中原有数据
			Log.info("开始导入表"+ tableName);
			try {
				InputStreamReader read = new InputStreamReader(new FileInputStream(txtFile), encoding);// 考虑到编码格式
				//LineNumberReader为BufferedReader子类，有getLineNumber功能 
				LineNumberReader lineReader = new LineNumberReader(read);  
				//调用多线程完成数据导入
				completionService(lineReader, tableName);
			} catch (Exception e) {
				Log.error("资管数据导入错误："+e.getMessage());
				e.printStackTrace();
				return 0;
			}
		}else{
			Log.error("资管数据导入错误：表"+txtFile.getName()+"不存在");
		}
		return 1;
	}
	
	/**
     * 使用completionService收集callable结果
     * @throws ExecutionException 
     * @throws InterruptedException 
     */
	public void completionService(LineNumberReader lineReader, String tableName)throws InterruptedException, ExecutionException {
		ExecutorService executorService = Executors.newCachedThreadPool();
		CompletionService<Integer> completionService = new ExecutorCompletionService<Integer>(executorService);
		int threadNum = 7;
		for (int i = 0; i < threadNum; i++) {
			completionService.submit(getTask(i, lineReader, tableName));
		}
		for (int i = 0; i < threadNum; i++) {
			completionService.take().get();
		}
		executorService.shutdown();
	}
	
	/**
	 * 数据导入
	 * @param no
	 * @param lineReader
	 * @param tableName
	 * @return
	 */
    public  Callable<Integer> getTask(final int no, LineNumberReader lineReader, String tableName) {
        Callable<Integer> task = new Callable<Integer>() {
            @Override
            public Integer call() throws Exception {
            	long startTime = System.currentTimeMillis();  //获取开始时间
            	String lineTxt = "";
				String valueStr= "";
				while ((lineTxt = lineReader.readLine()) != null) {
					//因为第一行为表头，自动跳过
					if (lineReader.getLineNumber() == 1){
						continue;
					}
					StringBuffer sb = new StringBuffer(lineTxt);
					String line = sb.reverse().replace(0, 1, "\'").reverse().toString().replace("\t", "\',\'");
				    //开始准备拼接单行sql， 格式为 into 表名 values('v1','v2','v3'), 必须值加入单引号
					String lineStr = " into "+ tableName +" values (\'" + line +")" ;
					 //拼接单行sql， 格式为 into 表名 values('v1','v2','v3') into 表名 values('v1','v2','v3')
					 valueStr +=lineStr;
					if (lineReader.getLineNumber() % 60 == 0) {
						DataImport(tableName, valueStr);
						valueStr = "";
						lineStr = "";
					}
				}
				//最后一批数据，数据总量小于60
				if (lineReader.readLine() == null && !("").equals(valueStr)) {
					DataImport(tableName, valueStr);
					valueStr = "";
				}
				long endTime = System.currentTimeMillis();//获取结束时间   
				//输出程序运行时间到日志
				Log.info("线程"+ no+"运行时间:" + (endTime - startTime) + "ms");
                return no;
            }
        };
        return task;
    } 
    
    /**
     * 调用存储过程
     * @param tableName
     * @param valueStr
     */
    private void DataImport(String tableName, String valueStr){
    	Map<String, Object> map = new HashMap<String, Object>();
    	map.put("tbname", tableName);
    	map.put("valueStr", valueStr);
		zgDataImportDao.dataImport(map);
    }
    
    /**
	 * 清空表数据
	 */
	public boolean deleteTable(String tableName) {
		try {
			Map<String, Object> paramter = new HashMap<String, Object>();
			paramter.put("tbname", tableName);
			zgDataImportDao.deleteTable(paramter);
			if (("1").equals(paramter.get("code").toString())) {
				return true;
			}
			return false;
		} catch (Exception e) {
			Log.error("资管数据导入错误："+e.getMessage());
			return false;
		}
	}
	
	/**
	 * 检查表是否存在
	 */
	public int checkTable(String tableName) {
		return zgDataImportDao.checkTable(tableName);
	}

}
