package com.audit.modules.common.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * Created by tglic on 2017/3/6.
 */
public class StringUtils extends org.apache.commons.lang3.StringUtils{

    public static String getUUid(){
        UUID uuid = UUID.randomUUID();
        return uuid.toString().replaceAll("-","");
    }

    public static String encodingString(String str, String from, String to)
    {
        String result = str;
        try {
            result = new String(str.getBytes(from), to);
        } catch (Exception e) {
            result = str;
        }
        return result;
    }
    
    /**
	 * 生成电费提交单流水单号
	 * @return
	 */
	public static synchronized String createSerialNumber(String key) {
		StringBuffer serialNumber = new StringBuffer();
		serialNumber.append(key);
		SimpleDateFormat format = new SimpleDateFormat("yyMMdd");
		serialNumber.append(format.format(new Date()));
		serialNumber.append(System.nanoTime());
		return serialNumber.toString();
	}
}
