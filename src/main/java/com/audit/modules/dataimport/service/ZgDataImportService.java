package com.audit.modules.dataimport.service;

import java.io.File;
import java.util.LinkedList;

/**   
 * @Description : 资管数据导入方法   
 *
 * @author : liuyan
 * @date : 2017年4月13日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public interface ZgDataImportService {

	LinkedList<File> getFileList(String path, LinkedList<File> list);

	int readDateFile(File txtFile, String tableName);
	
	boolean dataUpdateAfterImport();
}
