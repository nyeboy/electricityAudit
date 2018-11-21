package com.audit.modules.common.utils;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.dom4j.Element;
import sun.net.www.protocol.http.HttpURLConnection;

/**
 * 封装了XML转换成object，object转换成XML的代码
 * 
 * @author 礼斌
 * 
 */
public class XmlUtil {
	/**
	 * 将对象直接转换成String类型的 XML输出
	 * 
	 * @param obj
	 * @return
	 */
	public static String convertToXml(Object obj) {
		// 创建输出流
		StringWriter sw = new StringWriter();
		try {
			// 利用jdk中自带的转换类实现
			JAXBContext context = JAXBContext.newInstance(obj.getClass());

			Marshaller marshaller = context.createMarshaller();
			// 格式化xml输出的格式
			marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
			// 将对象转换成输出流形式的xml
			marshaller.marshal(obj, sw);
		} catch (JAXBException e) {
			e.printStackTrace();
		}
		return sw.toString();
	}

	/**
	 * 将对象根据路径转换成xml文件
	 * 
	 * @param obj
	 * @param path
	 * @return
	 */
	public static void convertToXml(Object obj, String path) {
		try {
			// 利用jdk中自带的转换类实现
			JAXBContext context = JAXBContext.newInstance(obj.getClass());

			Marshaller marshaller = context.createMarshaller();
			// 格式化xml输出的格式
			marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
			// 将对象转换成输出流形式的xml
			// 创建输出流
			FileWriter fw = null;
			try {
				fw = new FileWriter(path);
			} catch (IOException e) {
				e.printStackTrace();
			}
			marshaller.marshal(obj, fw);
		} catch (JAXBException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 将String类型的xml转换成对象
	 */
	public static Object convertXmlStrToObject(Class<?> clazz, String xmlStr) {
		Object xmlObject = null;
		try {
			JAXBContext context = JAXBContext.newInstance(clazz);
			// 进行将Xml转成对象的核心接口
			Unmarshaller unmarshaller = context.createUnmarshaller();
			StringReader sr = new StringReader(xmlStr);
			xmlObject = unmarshaller.unmarshal(sr);
		} catch (JAXBException e) {
			e.printStackTrace();
		}
		return xmlObject;
	}

	/**
	 * 将file类型的xml转换成对象
	 */
	public static Object convertXmlFileToObject(Class<?> clazz, String xmlPath) {
		Object xmlObject = null;
		try {
			JAXBContext context = JAXBContext.newInstance(clazz);
			Unmarshaller unmarshaller = context.createUnmarshaller();
			FileReader fr = null;
			try {
				fr = new FileReader(xmlPath);
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			xmlObject = unmarshaller.unmarshal(fr);
		} catch (JAXBException e) {
			e.printStackTrace();
		}
		return xmlObject;
	}
	
	/**
	 * xml数据解析通用方法
	 * @param root
	 * @return Object
	 */
	public static Object parse(Element root) {
		List<?> elements = root.elements();
		if (elements.size() == 0) {
			//没有子元素
			return root.getTextTrim();
		} else {
			//有子元素
			String prev = null;
			//默认按照数组处理
			boolean guess = true;

			Iterator<?> iterator = elements.iterator();
			while (iterator.hasNext()) {
				Element elem = (Element) iterator.next();
				String name = elem.getName();
				if (prev == null) {
					prev = name;
				} else {
					guess = name.equals(prev);
					break;
				}
			}
			iterator = elements.iterator();
			if (guess) {
				List<Object> data = new ArrayList<Object>();
				while (iterator.hasNext()) {
					Element elem = (Element) iterator.next();
					((List<Object>) data).add(parse(elem));
				}
				return data;
			} else {
				Map<String, Object> data = new HashMap<String, Object>();
				while (iterator.hasNext()) {
					Element elem = (Element) iterator.next();
					((Map<String, Object>) data).put(elem.getName(), parse(elem));
				}
				return data;
			}
		}
	}
	
    /** 
     * 将Stream类型的xml转换成对象 
     */  
    public static Object convertXmlStreamToObject(Class<?> clazz, String url) {
    	URL reqURL = null;
		HttpURLConnection httpsConn = null;
		InputStream ins = null;
		Object object = null;
		try {
			//获取xml数据
			reqURL = new URL(url);
			httpsConn = (HttpURLConnection) reqURL.openConnection();
			httpsConn.setRequestProperty("Accept", "application/xml;charset=utf8");
			ins = httpsConn.getInputStream();
			//解析xml数据
            JAXBContext context = JAXBContext.newInstance(clazz);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            object = unmarshaller.unmarshal(ins);
        } catch (Exception e) {
            Log.error(e);
        } finally {
			//必须释放相关资源
			try {
				ins.close();
				httpsConn.disconnect();
			} catch (Exception ex){
				Log.error(ex);
			}
		}
		return object;
    }

}
