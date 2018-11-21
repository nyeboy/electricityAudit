package com.audit.modules.common.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 
 * 
 * Description:读取本地配置文件
 * 
 * @author jiadu
 * @version 1.0
 * 
 */
public class PropertyUtils {
	private static String pathLog = "/conf/operatorConfig.properties";// 新增、修改、删除日志
	public static String PAGESIZE = "pageSize";
	private static Properties plog = new Properties();// 日志数据库专用
	InputStream inLog = null;
	InputStream in = null;
	static {
		InputStream inLog = PropertyUtils.class.getResourceAsStream(pathLog);
		try {
			plog.load(inLog);
		} catch (IOException e) {
			throw new ExceptionInInitializerError("不能正确读取资源文件");
		} finally {
			if (inLog != null)
				try {
					inLog.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
	}
	/**
	 * 从properties文件中根据key取出value值
	 * 
	 * @param key
	 * @return
	 */
	public static String getLogInfo(String key) {
		return plog.getProperty(key);
	}
	
	public static void main(String[] args) {
		System.out.println(PropertyUtils.getLogInfo("/SuperAdminConstant/SUPERADMIN_ROLE_NAME"));
		
	}
}
