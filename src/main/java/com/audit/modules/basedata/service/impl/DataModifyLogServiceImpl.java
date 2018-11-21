/**
 * Copyright (c) 2017, IsoftStone All Right reserved.
 */
package com.audit.modules.basedata.service.impl;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.audit.modules.basedata.service.DataModifyLogService;
import com.audit.modules.common.utils.Log;

/**   
 * @Description: 基础数据维护 日志操作   (主要用于将字段名转换成中文)
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年5月14日 下午8:48:34    
*/
@Service
public class DataModifyLogServiceImpl implements DataModifyLogService {

	/**   
	 * @Description: 生成日志描述语句 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public String createLogStr(String tableName, String paramStr, String changeType) {
		StringBuffer sbf = new StringBuffer(800);
		String field = null;
		String value = null;
		String temptStr = null;
		Date time = null;
		if (null != paramStr && null != tableName) {
			Map<String, String> paramap = new HashMap<String, String>();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			// 用正则表达式提取 参数和参数值
			String reg = "(\")([^\",:}]+?)([\\\"]{0,2}:[\\\\\"]{0,2})([^\\\\\",}]*)";
			Pattern pattern = Pattern.compile(reg);
			Matcher m = pattern.matcher(paramStr);
			while (m.find()) {
				field = m.group(2);
				value = m.group(4);
				if(field.indexOf("\\") == field.length()-1){
					field = field.substring(0, field.length()-1);
				}
				if (null != field && !field.equals("") && null != value && !value.equals("")) {
					paramap.put(field, value);
				}
			}
			if (null != paramap) {
				switch (changeType) {
				case "供应商信息":
					for (String key : paramap.keySet()) {
						time = null;
						switch (key) {
						case "name":
							sbf.append("合同供应商名称变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "code":
							sbf.append("供应商ID变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "organizationCode":
							sbf.append("供应商组织ID变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "ouName":
							sbf.append("分公司变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "bankNum":
							sbf.append("银行账户变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "vendorCode":
							sbf.append("供应商编号变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "address":
							sbf.append("供应商地址变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "bankBranchName":
							sbf.append("银行名称变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "accountName":
							sbf.append("报账点名称变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						}
					}
					break;
				case "电表信息":
					for (String key : paramap.keySet()) {
						time = null;
						switch (key) {
						case "id" :
							sbf.append("电表号变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "code":
							sbf.append("电表标识符变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "paymentAccountCode":
							sbf.append("电表户号变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "ptype":
							sbf.append("电表类型变为'");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(temptStr.equals("1")){
								temptStr = "普通";
							}else if(temptStr.equals("2")){
								temptStr = "智能";
							}
							sbf.append(temptStr);
							sbf.append("',");
							break;
						case "status":
							sbf.append("电表状态变为'");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								sbf.append("正常");
							} else if (temptStr.equals("2")) {
								sbf.append("损坏");
							} else {
								sbf.append(temptStr);
							}
							break;
						case "rate":
							sbf.append("倍率变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "maxReading":
							sbf.append("最大读数变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "currentReadingStr":
							sbf.append("当前读数变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "belongAccount":
							sbf.append("所属户头变为'");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								sbf.append("移动");
							} else if (temptStr.equals("2")) {
								sbf.append("铁塔");
							} else {
								sbf.append(temptStr);
							}
							sbf.append("',");
							break;
						case "reimbursementDate":
							sbf.append("电费归属日期变为'");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(temptStr.matches("[0-9]{5,}")){
								Long dateLong = Long.valueOf(temptStr);
								temptStr = dateFormat.format(new Date(dateLong));
							}
							sbf.append(temptStr);
							sbf.append("',");
							break;
						}
					}
					break;
				case "发票信息":
					time = null;
					for (String key : paramap.keySet()) {
						switch (key) {
						case "billTax":
							sbf.append("税率变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "billType":
							sbf.append("发票类型变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "billCoefficient":
							sbf.append("开票系数变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "rate":
							sbf.append("倍率变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						}
					}
					break;
				case "额定功率信息":
					for (String key : paramap.keySet()) {
						time = null;
						switch (key) {
						case "deviceType":
							sbf.append("设备类型变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "deviceModel":
							sbf.append("设备型号变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "deviceVendor":
							sbf.append("生产厂家变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "powerRating":
							sbf.append("额定功率变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "updateDate":
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("")){
								if( temptStr.matches("[1-9][0-9]*")){
									Long dateLong = Long.valueOf(temptStr);
									time = new Date(dateLong);
									temptStr = dateFormat.format(time);
								}
								sbf.append("时间变为'");
								sbf.append(temptStr);
								sbf.append("',");
							}
							break;
						}
					}
					break;
				case "供电信息":
					for (String key : paramap.keySet()) {
						time = null;
						switch (key) {
						case "accountName":
							sbf.append("报账点名称变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "electricityType":
							sbf.append("供电类型变为'");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								sbf.append("直供电");
							} else if (temptStr.equals("2")) {
								sbf.append("转供电");
							} else {
								sbf.append(temptStr);
							}
							sbf.append("',");
							break;
						case "supplyCompany":
							sbf.append("供电公司/业主变为'");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								sbf.append("供电公司");
							} else if (temptStr.equals("2")) {
								sbf.append("业主");
							} else {
								sbf.append(temptStr);
							}
							sbf.append("',");
							break;
							
						case "payType":
							sbf.append("电费缴纳方式变为'");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								sbf.append("代维代缴");
							} else if (temptStr.equals("2")) {
								sbf.append("铁塔代缴");
							} else if (temptStr.equals("3")) {
								sbf.append("自缴");
							} else {
								sbf.append(temptStr);
							}
							sbf.append("',");
							break;
						case "shareType":
							sbf.append("共享方式变为'");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								sbf.append("共享");
							} else if (temptStr.equals("2")) {
								sbf.append("独享");
							} else {
								sbf.append(temptStr);
							}
							sbf.append("',");
							break;
						case "updateTime":
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("")){
								if( temptStr.matches("[1-9][0-9]*")){
									Long dateLong = Long.valueOf(temptStr);
									time = new Date(dateLong);
									temptStr = dateFormat.format(time);
								}
								sbf.append("时间变为'");
								sbf.append(temptStr);
								sbf.append("',");
							}
							break;
						}
					}
					break;
				case "报账点信息":
					for (String key : paramap.keySet()) {
						time = null;
						switch (key) {
						case "siteName":
							sbf.append("资管站点名称变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "accountName":
							sbf.append("报账点名称变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "accountAlias":
							sbf.append("报账点别名变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "oldFinanceName":
							sbf.append("原财务站点变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "clubPrice":
							sbf.append("包干价变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "contractId":
							sbf.append("合同Id变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "meterCode":
							sbf.append("电表号变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "resourceName":
							sbf.append("机房/资源点名称变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						}
					}
					break;
				case "其他信息":
					for (String key : paramap.keySet()) {
						switch (key) {
						case "cycle":
							sbf.append("报销周期变为'");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								value = "月";
							} else if (temptStr.equals("3")) {
								value = "季度";
							} else if (temptStr.equals("6")) {
								value = "半年";
							} else if (temptStr.equals("12")) {
								value = "年";
							} else {
								value = temptStr;
							}
							sbf.append(value);
							sbf.append("',");
							break;
						}
					}
					break;
				case "业主电表信息":
					for (String key : paramap.keySet()) {
						time = null;
						switch (key) {
						case "meterNumber":
							sbf.append("电表号变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "ownerId":
							sbf.append("业主ID变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "meterIdentifier":
							sbf.append("电表标识符变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "meterAccout":
							sbf.append("电表户号变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "meterType":
							sbf.append("用电类型变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "meterPurpose":
							sbf.append("用电用途变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						}
					}
					break;
				case "业主信息":
					for (String key : paramap.keySet()) {
						time = null;
						switch (key) {
						case "ownerName":
							sbf.append("业主名称变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "bankName":
							sbf.append("业主开户银行变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "bankAccount":
							sbf.append("业主银行账号变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "supplier":
							sbf.append("供应商变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "useCompany":
							sbf.append("用电协议单位变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "price":
							sbf.append("用电协议单价变为'");
							sbf.append(paramap.get(key).equals("null")?"":paramap.get(key));
							sbf.append("',");
							break;
						case "startTime":
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("")){
								if( temptStr.matches("[1-9][0-9]*")){
									Long dateLong = Long.valueOf(temptStr);
									time = new Date(dateLong);
									temptStr = dateFormat.format(time);
								}
								sbf.append("用电协议起始日期变为'");
								sbf.append(temptStr);
								sbf.append("',");
							}
							break;
						case "endTime":
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("")){
								if( temptStr.matches("[1-9][0-9]*")){
									Long dateLong = Long.valueOf(temptStr);
									time = new Date(dateLong);
									temptStr = dateFormat.format(time);
								}
								sbf.append("用电协议终止日期变为");
								sbf.append(temptStr);
								sbf.append("',");
							}
							break;
						}
					}
					break;
				}
			}
		}
		String logStr = new String(sbf);
		return logStr;
	}

	/**   
	 * @Description: 生成原数据字段值  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public List<Map<String, String>> createOriginalField(String tableName, String originalParams, String changeType) {
		List<Map<String, String>> fieldList = new ArrayList<Map<String, String>>();
		Map<String, String> fieldmap = null;
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String field = null;
		String value = null;
		String temptStr = null;
		Date time = null;
		Long dateLong = null;
		if (null != originalParams && null != tableName) {
			Map<String, String> paramap = new HashMap<String, String>();
			// 用正则表达式提取 参数和参数值
			String reg = "(\")([^\",:}]+?)([\\\"]{0,2}:[\\\\\"]{0,2})([^\\\\\",}]*)";
			Pattern pattern = Pattern.compile(reg);
			Matcher m = pattern.matcher(originalParams);
			Log.info(originalParams);
			while (m.find()) {
				field = m.group(2);
				value = m.group(4);
				if(field.indexOf("\\") == field.length()-1){
					field = field.substring(0, field.length()-1);
				}
				Log.info(m.group(0));
				Log.info(field);
				Log.info(value);
				if (null != field && !field.equals("") && null != value && !value.equals("")) {
					paramap.put(field, value);
				}
			}
			if (null != paramap) {
				switch (changeType) {
				case "供应商信息":
					for (String key : paramap.keySet()) {
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "accountName":
							fieldmap.put("key", "报账点名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "name":
							fieldmap.put("key", "合同供应商名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "vendorCode":
							fieldmap.put("key", "供应商编号");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "address":
							fieldmap.put("key", "供应商地点");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "organizationCode":
							fieldmap.put("key", "供应商组织ID");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "ouName":
							fieldmap.put("key", "分公司");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "bankBranchName":
							fieldmap.put("key", "银行名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "bankNum":
							fieldmap.put("key", "银行账户");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				case "电表信息":
					for (String key : paramap.keySet()) {
						time = null;
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "id":
							fieldmap.put("key", "电表号");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "code":
							fieldmap.put("key", "电表标识符");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "accountName":
							fieldmap.put("key", "报账点名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "rate":
							fieldmap.put("key", "倍率");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "status":
							fieldmap.put("key", "电表状态");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								value = "正常";
							} else if (temptStr.equals("2")) {
								value = "损坏";
							} else {
								value = temptStr;
							}
							fieldmap.put("value", value);
							break;
						case "currentReading":
							fieldmap.put("key", "当前读数");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "paymentAccountCode":
							fieldmap.put("key", "电表户号");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "ptype":
							fieldmap.put("key", "电表类型");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(temptStr.equals("1")){
								temptStr = "普通";
							}else if(temptStr.equals("2")){
								temptStr = "智能";
							}
							fieldmap.put("value", temptStr);
							break;
						case "maxReading":
							fieldmap.put("key", "最大读数");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "belongAccount":
							fieldmap.put("key", "所属户头");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								value = "移动";
							} else if (temptStr.equals("2")) {
								value = "铁塔";
							} else {
								value = temptStr;
							}
							fieldmap.put("value", value);
							break;
						case "reimbursementDate":
							fieldmap.put("key", "电费归属日期");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("") && temptStr.matches("[1-9][0-9]*")){
								dateLong = Long.valueOf(temptStr);
								temptStr = dateFormat.format(new Date(dateLong));
							}
							fieldmap.put("value", temptStr);
							break;
						case "damageNum":
							fieldmap.put("key", "损坏读数");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "damageDate":
							fieldmap.put("key", "损坏日期");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("") && temptStr.matches("[1-9][0-9]*")){
								dateLong = Long.valueOf(temptStr);
								temptStr = dateFormat.format(new Date(dateLong));
							}
							fieldmap.put("value", temptStr);
							break;
						case "damageInnerNum":
							fieldmap.put("key", "损坏期间电量（度）");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "electricLoss":
							fieldmap.put("key", "电损(度)");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				case "发票信息":
					for (String key : paramap.keySet()) {
						time = null;
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "billTax":
							fieldmap.put("key", "税率");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "billType":
							fieldmap.put("key", "发票类型");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "billCoefficient":
							fieldmap.put("key", "开票系数");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "rate":
							fieldmap.put("key", "倍率");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "createDate":
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("") && temptStr.matches("[1-9][0-9]*")){
								dateLong = Long.valueOf(temptStr);
								time = new Date(dateLong);
								fieldmap.put("key", "时间");
								fieldmap.put("value", dateFormat.format(time));
							}
							break;
						case "modifyDate":
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("") && temptStr.matches("[1-9][0-9]*")){
								dateLong = Long.valueOf(temptStr);
								time = new Date(dateLong);
								fieldmap.put("key", "时间");
								fieldmap.put("value", dateFormat.format(time));
							}
							break;
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				case "额定功率信息":
					for (String key : paramap.keySet()) {
						time = null;
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "deviceType":
							fieldmap.put("key", "设备类型");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "deviceModel":
							fieldmap.put("key", "型号");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "deviceVendor":
							fieldmap.put("key", "生产厂家");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "powerRating":
							fieldmap.put("key", "额定功率");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "updateDate":
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("") && temptStr.matches("[1-9][0-9]*")){
								dateLong = Long.valueOf(temptStr);
								time = new Date(dateLong);
								fieldmap.put("key", "时间");
								fieldmap.put("value", dateFormat.format(time));
							}
							break;
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				case "供电信息":
					for (String key : paramap.keySet()) {
						time = null;
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "accountName":
							fieldmap.put("key", "报账点名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "electricityType":
							fieldmap.put("key", "供电类型");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								value = "直供电";
							} else if (temptStr.equals("2")) {
								value = "转供电";
							} else {
								value = temptStr;
							}
							fieldmap.put("value", value);
							break;
						case "shareType":
							fieldmap.put("key", "共享方式");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								value = "共享";
							} else if (temptStr.equals("2")) {
								value = "独享";
							} else {
								value = temptStr;
							}
							fieldmap.put("value", value);
							break;
						case "supplyCompany":
							fieldmap.put("key", "供电公司/业主");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								value = "供电公司";
							} else if (temptStr.equals("2")) {
								value = "业主";
							} else {
								value = temptStr;
							}
							fieldmap.put("value", value);
							break;
						case "payType":
							fieldmap.put("key", "电费缴纳方式");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								value = "代维代缴";
							} else if (temptStr.equals("2")) {
								value = "铁塔代缴";
							} else if (temptStr.equals("3")) {
								value = "自缴";
							} else {
								value = temptStr;
							}
							fieldmap.put("value", value);
							break;
						case "updateTime":
							fieldmap.put("key", "时间");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("") && temptStr.matches("[1-9][0-9]*")){
								dateLong = Long.valueOf(temptStr);
								time = new Date(dateLong);
								fieldmap.put("key", "时间");
								fieldmap.put("value", dateFormat.format(time));
							}
							fieldmap.put("value", temptStr);
							break;
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				case "转供电信息":
					for (String key : paramap.keySet()) {
						time = null;
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "siteName":
							fieldmap.put("key", "站点名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "electricityType":
							fieldmap.put("key", "现在供电类型");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								value = "直供电";
							} else if (temptStr.equals("2")) {
								value = "转供电";
							} else {
							}
							fieldmap.put("value", value);
							break;
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				case "报账点信息":
					for (String key : paramap.keySet()) {
						time = null;
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "accountName":
							fieldmap.put("key", "报账点名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "accountAlias":
							fieldmap.put("key", "报账点别名");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "siteName":
							fieldmap.put("key", "资管站点名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "oldFinanceName":
							fieldmap.put("key", "原财务站点");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "meterCode":
							fieldmap.put("key", "电表号");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "clubPrice":
							fieldmap.put("key", "包干价");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "resourceName":
							fieldmap.put("key", "机房/资源点名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				case "其他信息":
					for (String key : paramap.keySet()) {
						time = null;
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "accountName":
							fieldmap.put("key", "报账点名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "siteName":
							fieldmap.put("key", "资管站点名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "oldFinanceName":
							fieldmap.put("key", "原财务站点");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "cycle":
							fieldmap.put("key", "报销周期");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if (temptStr.equals("1")) {
								value = "月";
							} else if (temptStr.equals("3")) {
								value = "季度";
							} else if (temptStr.equals("6")) {
								value = "半年";
							} else if (temptStr.equals("12")) {
								value = "年";
							} else {
								value = temptStr;
							}
							fieldmap.put("value", value);
							break;
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				case "业主电表信息":
					for (String key : paramap.keySet()) {
						time = null;
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "meterNumber":
							fieldmap.put("key", "电表号");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "ownerId":
							fieldmap.put("key", "业主ID");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "meterIdentifier":
							fieldmap.put("key", "电表标识符");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "meterAccout":
							fieldmap.put("key", "电表户号");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "meterType":
							fieldmap.put("key", "用电类型");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "meterPurpose":
							fieldmap.put("key", "用电用途");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				case "业主信息":
					for (String key : paramap.keySet()) {
						time = null;
						fieldmap = new TreeMap<String, String>();
						switch (key) {
						case "ownerName":
							fieldmap.put("key", "业主名称");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "bankName":
							fieldmap.put("key", "业主开户银行");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "bankAccount":
							fieldmap.put("key", "业主银行账号");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "supplier":
							fieldmap.put("key", "供应商");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "useCompany":
							fieldmap.put("key", "用电协议单位");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						case "startTime":
							fieldmap.put("key", "用电协议起始日期");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("") && temptStr.matches("[1-9][0-9]*")){
								dateLong = Long.valueOf(temptStr);
								time = new Date(dateLong);
								fieldmap.put("key", "时间");
								fieldmap.put("value", dateFormat.format(time));
							}
							fieldmap.put("value", temptStr);
							break;
						case "endTime":
							fieldmap.put("key", "用电协议终止日期");
							temptStr = paramap.get(key).equals("null")?"":paramap.get(key);
							if(null != temptStr && !temptStr.equals("") && temptStr.matches("[1-9][0-9]*")){
								dateLong = Long.valueOf(temptStr);
								time = new Date(dateLong);
								fieldmap.put("key", "时间");
								fieldmap.put("value", dateFormat.format(time));
							}
							fieldmap.put("value", temptStr);
							break;
						case "price":
							fieldmap.put("key", "用电协议单价");
							fieldmap.put("value", paramap.get(key).equals("null")?"":paramap.get(key));
							break;
						}
						if(fieldmap.keySet().size() > 0){
							fieldList.add(fieldmap);
						}
					}
					break;
				}
			}
		}
		return fieldList;
	}

}
