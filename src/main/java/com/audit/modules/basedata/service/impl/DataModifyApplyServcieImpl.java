/**
 * Copyright (c) 2017, IsoftStone All Right reserved.
 */
package com.audit.modules.basedata.service.impl;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.AccountSiteManageDao;
import com.audit.modules.basedata.dao.AccountSiteOtherDao;
import com.audit.modules.basedata.dao.AccountSitePSUDao;
import com.audit.modules.basedata.dao.AccountSiteTransDao;
import com.audit.modules.basedata.dao.DataModifyApplyDao;
import com.audit.modules.basedata.dao.DataModifyLogDao;
import com.audit.modules.basedata.dao.PowerRateManageDao;
import com.audit.modules.basedata.dao.SupplierManageDao;
import com.audit.modules.basedata.entity.AccountSiteManage;
import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSiteOther;
import com.audit.modules.basedata.entity.AccountSitePSU;
import com.audit.modules.basedata.entity.AccountSiteTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.DataModifyApply;
import com.audit.modules.basedata.entity.DataModifyDetail;
import com.audit.modules.basedata.entity.DataModifyLog;
import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.basedata.service.DataModifyApplyService;
import com.audit.modules.basedata.service.DataModifyLogService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.HttpClientUtils;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.dao.MeterDao;
import com.audit.modules.electricity.dao.OwnerDao;
import com.audit.modules.electricity.entity.MeterVo;
import com.audit.modules.electricity.entity.OwnerVo;
import com.audit.modules.invoice.dao.InvoiceDao;
import com.audit.modules.invoice.entity.InvoiceVO;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.towerbasedata.trans.dao.TowerTransDao;
import com.audit.modules.towerbasedata.trans.entity.TowerNeedTrans;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;
import com.audit.modules.watthourmeter.dao.WatthourMeterDao;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @Description: 数据维护操作管理
 * @throws
 * 
 * 			@author
 *             杨芃
 * @date 2017年4月20日 下午5:16:14
 */
@Service
public class DataModifyApplyServcieImpl implements DataModifyApplyService {
	//塔维转供电管理dao
	@Autowired
	private TowerTransDao towerTransDao;
	//转供电管理dao
	@Autowired
	private AccountSiteTransDao accountSiteTransDao;
	// 基础数据修改申请dao
	@Autowired
	private DataModifyApplyDao dataModifyApplyDao;
	// 基础数据修改日志dao
	@Autowired
	private DataModifyLogDao dataModifyLogDao;
	// 供应商管理dao
	@Autowired
	private SupplierManageDao supplierManageDao;
	// 电表信息管理dao
	@Autowired
	private WatthourMeterDao watthourMeterDao;
	// 发票管理dao
	@Autowired
	private InvoiceDao invoiceDao;
	// 额定功率管理dao
	@Autowired
	private PowerRateManageDao powerRateManageDao;
	// 供电信息管理dao
	@Autowired
	private AccountSitePSUDao accountSitePSUDao;
	// 其他信息管理dao
	@Autowired
	private AccountSiteOtherDao accountSiteOtherDao;
	// 报账点管理dao
	@Autowired
	private AccountSiteManageDao accountSiteManageDao;
	// 业主电表dao
	@Autowired
	private MeterDao meterDao;
	// 业主dao
	@Autowired
	private OwnerDao ownerDao;

	@Autowired
	private DataModifyLogService dataModifyLogService;

	/**
	 * @Description: 添加操作申请 @param
	 */
	@Override
	public String insertSelective(DataModifyApply record) {
		String applyId = StringUtils.getUUid();
		record.setId(applyId);
		dataModifyApplyDao.insertSelective(record);
		return applyId;
	}
	/**
	 * @Description: 自维转供电添加操作申请 @param
	 */
	@Override
	public String transInsertSelective(AccountSiteTransSubmit accountSiteTransSubmit) {
		String applyId = StringUtils.getUUid();
		accountSiteTransSubmit.setApplyId(applyId);
		accountSiteTransDao.transInsertSelective(accountSiteTransSubmit);
		return applyId;
	}
	/**
	 * @Description: 塔维转供电添加操作申请 @param
	 */
	@Override
	public String towerTransInsertSelective(TowerTransSubmitVO towerTransSubmitVO) {
		String applyId = StringUtils.getUUid();
		towerTransSubmitVO.setApplyId(applyId);
		towerTransDao.transInsertSelective(towerTransSubmitVO);
		return applyId;
	}

	/**
	 * @Description: 通过id查询操作申请
	 */
	@Override
	public DataModifyApply selectByPrimaryKey(String id) {
		return dataModifyApplyDao.selectByPrimaryKey(id);
	}

	/**
	 * @Description: 更新申请信息 
	 */
	@Override
	public int updateByPrimaryKeySelective(DataModifyApply record) {
		//审批失败时删除流程id
		if (null != record && null != record.getChangeStatus() && record.getChangeStatus().equals("2")) {
			String applyId = record.getId();
			String[] applyIds = applyId.split(",");
			if (applyIds != null && applyIds.length > 0) {
				dataModifyLogDao.deleteByApplyIds(applyIds);
				//查询是否属于塔维转供电的数据,暂时只支持单个数据查询，删除可以是数组id
				
//				TowerTransSubmitVO towerTransSubmitVO = towerTransDao.selectIsTransData(applyId);
//				if(towerTransSubmitVO != null && !towerTransSubmitVO.equals("") ){
//					//删除转供电表中数据,注意，不要删除数据，而是改变状态即可
////					accountSiteTransDao.deleteByApplyIds(applyIds);
//					towerTransDao.updateFailStatusByApplyIds(applyIds);
//					
//				}
				//查询是否属于转供电的数据,暂时只支持单个数据查询，删除可以是数组id
				 AccountSiteTransSubmit accountSiteTransSubmit = accountSiteTransDao.selectIsTransData(applyId);
				if(accountSiteTransSubmit != null && !accountSiteTransSubmit.equals("") ){
					//删除转供电表中数据,注意，不要删除数据，而是改变状态即可
//					accountSiteTransDao.deleteByApplyIds(applyIds);
					accountSiteTransDao.updateFailStatusByApplyIds(applyIds);
					
				}
			}
			
		}
		return dataModifyApplyDao.updateByPrimaryKeySelective(record);
	}
	
	/**
	 * @Description: 自维转供电----------更新申请信息 
	 */
	@Override
	public void transUpdateByPrimaryKeySelective(AccountSiteTransSubmit reData) {
		//审批失败时更改表中状态流程id
		
		
		if (null != reData && null != reData.getStatus() && reData.getStatus().equals("2")) {
			String applyId = reData.getApplyId();
			String[] applyIds = applyId.split(",");
			if (applyIds != null && applyIds.length > 0) {
				//查询是否属于转供电的数据,暂时只支持单个数据查询，删除可以是数组id
				 AccountSiteTransSubmit accountSiteTransSubmit = accountSiteTransDao.selectIsTransData(applyId);
				if(accountSiteTransSubmit != null && !accountSiteTransSubmit.equals("") ){
					//改变为2
					//SYS_TRANSELEPOWER_SUBMIT中STATUS变更状态:0:待审批,1：审批通过，2：审批失败
					accountSiteTransDao.updateFailStatusByApplyIds(applyIds);
					//改变为4
					//1，SYS_ZGROOM_TRANS_MID中SUBMIT_STATUS，1 , 已提交至下一级  2 被撤回  3 改造完成   4，审批失败 null '' 未提交
					//根据流程id修改状态
					AccountSiteNeedTrans needTrans = new AccountSiteNeedTrans();
					needTrans.setSubmitStatus("4");
					needTrans.setResultStatus("2");
					needTrans.setInstanceId(reData.getInstanceId());
					accountSiteTransDao.updateNeedTransDataByInstanceId(needTrans);
				}
			}
			
		}
	}
	
	/**
	 * @Description: 塔维转供电----------更新申请信息 
	 */
	@Override
	public void towerTransUpdateByPrimaryKeySelective(TowerTransSubmitVO reData) {
		//审批失败时更改表中状态流程id
		
		
		if (null != reData && null != reData.getStatus() && reData.getStatus().equals("2")) {
			String applyId = reData.getApplyId();
			String[] applyIds = applyId.split(",");
			if (applyIds != null && applyIds.length > 0) {
				//查询是否属于转供电的数据,暂时只支持单个数据查询，删除可以是数组id 
				TowerTransSubmitVO towerTransSubmitVO = towerTransDao.selectIsTransData(applyId);
				if(towerTransSubmitVO != null && !towerTransSubmitVO.equals("") ){
					//改变为2
					//SYS_TOWER_TRANSELEPOWER_SUBMIT中STATUS变更状态:0:待审批,1：审批通过，2：审批失败
					towerTransDao.updateFailStatusByApplyIds(applyIds);
					//改变为4
					//1，SYS_ZGROOM_TOWER_TRANS_MID中SUBMIT_STATUS，1 , 已提交至下一级  2 被撤回  3 改造完成   4，审批失败 null '' 未提交
					//根据流程id修改状态
					TowerNeedTrans tNeedTrans = new TowerNeedTrans();
					tNeedTrans.setSubmitStatus("4");
					tNeedTrans.setResultStatus("2");
					tNeedTrans.setInstanceId(reData.getInstanceId());
					towerTransDao.updateNeedTransDataByInstanceId(tNeedTrans);
				}
			}
			
		}
	}

	/**
	 * @Description: 分页搜索查询 @param :
	 */
	@Override
	public List<DataModifyApply> findApplyByPage(PageUtil<DataModifyApply> page) {
		return dataModifyApplyDao.findApplyByPage(page);
	}

	/**
	 * @Description: 通过Ids批量删除申请
	 *  @param ids
	 */
	@Override
	public ResultVO deleteApplyByIds(String ids) {
		if (null == ids || ids.equals("")) {
			return ResultVO.failed("请传递参数");
		}
		String[] idArray = ids.split(",");
		try {
			dataModifyApplyDao.deleteApplyByIds(idArray);
			dataModifyLogDao.deleteByApplyIds(idArray);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultVO.failed("删除失败");
		}
		return ResultVO.success();
	}

	/**
	 * @Description: 通过id发送request请求 
	 */
	@Override
	public ResultVO executeApply(String id) {
		if (id == null || id.equals("")) {
			return ResultVO.failed("未传递任务id");
		}
		UserVo userVo = null;
		String url = null;
		String paramStr = null;
		Map<String, String> paramap = new HashMap<String, String>();
		DataModifyApply dataModifyApply = dataModifyApplyDao.selectByPrimaryKey(id);
		String changeStatus = dataModifyApply.getChangeStatus();
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();

		// if(null != changeStatus && !changeStatus.equals("0")){
		// return ResultVO.failed("已执行，请勿重复操作");
		// }
		if (null != dataModifyApply) {
			url = dataModifyApply.getUrl();
			paramStr = dataModifyApply.getParams();
		}
		if (null != url && paramStr != null) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				paramap = mapper.readValue(paramStr, new TypeReference<HashMap<String, String>>() {
				});
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		if (null != url && null != paramap) {
			dataModifyApply.setChangeTime(new Date());
			dataModifyApply.setChangeStatus("1");//审批通过，更改状态
			userVo = (UserVo) session.getAttribute("user");
			if (null != userVo && null != userVo.getUserId()) {
				dataModifyApply.setApproveUserId(userVo.getUserId() + "");
			}
			try {
				// 发送执行请求
				paramap.put("executeApplyRequest", "1");
				// 查询日志
				List<DataModifyLog> dataModifyLoglist = dataModifyLogDao.findLogByApplyId(dataModifyApply.getId());
				if (null == dataModifyLoglist || dataModifyLoglist.size() == 0) {
					// 添加日志
					dataModifyLoglist = addDataModifyLog(dataModifyApply, paramap);
				}
				HttpClientUtils.doPost(url, paramap);
				// 更新申请状态
				updateByPrimaryKeySelective(dataModifyApply);
				
				//塔维转供电更新审批状态SYS_TOWER_TRANSELEPOWER_SUBMIT
				if(dataModifyApply.getChangeType().equals("塔维转供电信息")&&dataModifyApply.getChangeStatus().equals("1")){
					System.out.println("改变塔维转供电表中状态");
				}
				//转供电更新审批状态SYS_TRANSELEPOWER_SUBMIT
				if(dataModifyApply.getChangeType().equals("转供电信息")&&dataModifyApply.getChangeStatus().equals("1")){
					System.out.println("改变转供电表中状态");
					
				}
				if (null != dataModifyLoglist && dataModifyLoglist.size() > 0) {
					// 更新日志
					for (DataModifyLog eacheDataModifyLog : dataModifyLoglist) {
						eacheDataModifyLog.setModifyTime(new Date());
						dataModifyLogDao.updateByPrimaryKey(eacheDataModifyLog);
						Log.info(JsonUtil.toJsonAll(eacheDataModifyLog));
					}
				}
				return ResultVO.success("执行成功");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return ResultVO.failed("执行失败");
	}
	
	/**
	 * @Description: 自维转供电通过id发送request请求 
	 */
	@Override
	public ResultVO transExecuteApply(String id) {
		if (id == null || id.equals("")) {
			return ResultVO.failed("未传递任务id");
		}
		UserVo userVo = null;
		String url = null;
		String paramStr = null;
		Map<String, String> paramap = new HashMap<String, String>();
		//通过业务id查出所有数据
		AccountSiteTransSubmit accountSiteTransSubmit = accountSiteTransDao.selectByPrimaryKey(id);
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();

		if (null != accountSiteTransSubmit) {
			url = accountSiteTransSubmit.getUrl();//操作地址
			paramStr = accountSiteTransSubmit.getParams();//提交时传入的参数
		}
		if (null != url && paramStr != null) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				//解析参数
				paramap = mapper.readValue(paramStr, new TypeReference<HashMap<String, String>>() {
				});
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		if (null != url && null != paramap) {
			accountSiteTransSubmit.setCreateDate(new Date());
			accountSiteTransSubmit.setStatus("1");//审批通过，更改状态
			userVo = (UserVo) session.getAttribute("user");
			
			if (null != userVo && null != userVo.getUserId()) {//这里如果有多个审批人就会覆盖前一个，需要考虑
				//保存的是最后一级的审批人id
				accountSiteTransSubmit.setApproveUserId(userVo.getUserId() + "");//设置审批人id
			}
			try {
				// 发送执行请求
				paramap.put("executeApplyRequest", "1");
				//更新字段，把转供电改为直供电
				HttpClientUtils.doPost(url, paramap);
				if(accountSiteTransSubmit.getStatus().equals("1")){
					//改变转供电为直供电
				}
				// 更新申请状态
				transUpdateByPrimaryKeySelective(accountSiteTransSubmit);
				
				//转供电更新审批状态SYS_TRANSELEPOWER_SUBMIT
				if(accountSiteTransSubmit.getStatus().equals("1")){
					System.out.println("改变转供电表中状态");
					accountSiteTransSubmit.setApplyId(id);
					accountSiteTransDao.updateTransDataTableStatus(accountSiteTransSubmit);
					
				}
				return ResultVO.success("执行成功");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return ResultVO.failed("执行失败");
	}
	
	/**
	 * @Description: 塔维转供电通过id发送request请求 
	 */
	@Override
	public ResultVO towerTransExecuteApply(String id) {
		if (id == null || id.equals("")) {
			return ResultVO.failed("未传递任务id");
		}
		UserVo userVo = null;
		String url = null;
		String paramStr = null;
		Map<String, String> paramap = new HashMap<String, String>();
		//通过业务id查出所有数据
		TowerTransSubmitVO towerTransSubmitVO = towerTransDao.selectByPrimaryKey(id);
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();

		if (null != towerTransSubmitVO) {
			url = towerTransSubmitVO.getUrl();//操作地址
			paramStr = towerTransSubmitVO.getParams();//提交时传入的参数
		}
		if (null != url && paramStr != null) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				//解析参数
				paramap = mapper.readValue(paramStr, new TypeReference<HashMap<String, String>>() {
				});
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		if (null != url && null != paramap) {
			towerTransSubmitVO.setCreateDate(new Date());
			towerTransSubmitVO.setStatus("1");//审批通过，更改状态
			userVo = (UserVo) session.getAttribute("user");
			
			if (null != userVo && null != userVo.getUserId()) {//这里如果有多个审批人就会覆盖前一个，需要考虑
				//保存的是最后一级的审批人id
				towerTransSubmitVO.setApproveUserId(userVo.getUserId() + "");//设置审批人id
			}
			try {
				// 发送执行请求
				paramap.put("executeApplyRequest", "1");
				//更新字段，把转供电改为直供电
				HttpClientUtils.doPost(url, paramap);
				if(towerTransSubmitVO.getStatus().equals("1")){
					//改变转供电为直供电
				}
				// 更新申请状态
				towerTransUpdateByPrimaryKeySelective(towerTransSubmitVO);
				
				//转供电更新审批状态SYS_TOWER_TRANSELEPOWER_SUBMIT
				if(towerTransSubmitVO.getStatus().equals("1")){
					System.out.println("改变转供电表中状态");
					towerTransSubmitVO.setApplyId(id);
					towerTransDao.updateTransDataTableStatus(towerTransSubmitVO);
					
				}
				return ResultVO.success("执行成功");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return ResultVO.failed("执行失败");
	}

	/**
	 * 
	 * @Description: 添加日志 
	 */
	@Override
	public List<DataModifyLog> addDataModifyLog(DataModifyApply dataModifyApply, Map<String, String> paramap) {
		List<DataModifyLog> dataModifyLogList = createDataModifyLog(dataModifyApply, paramap);
		if (null != dataModifyLogList) {
			for (DataModifyLog dataModifyLog : dataModifyLogList) {
				dataModifyLogDao.insertSelective(dataModifyLog);
			}
		}
		return dataModifyLogList;
	}

	/**
	 * @param paramap
	 * @Description: 生成修改日志 
	 */
	private List<DataModifyLog> createDataModifyLog(DataModifyApply dataModifyApply, Map<String, String> paramap) {
		String changeType = null;
		String remark = null;
		String tablName = null;
		String entityName = null;
		String recordId = null;
		String recordIds = null;
		String objectStr = null;
		String tempStr = null;
		String key = null;
		String value = null;
		List<String> paramsList = null;
		DataModifyLog dataModifyLog = null;
		String reg = null;
		Pattern pattern = null;
		StringBuffer  strBuffer = null;
		List<DataModifyLog> dataModifyLogList = new ArrayList<DataModifyLog>();
		
		
		

		if (null != dataModifyApply) {
			// 设置log的属性值
			dataModifyLog = new DataModifyLog();
			//把自维塔维状态存入
			dataModifyLog.setMobileType(dataModifyApply.getMobileType());
			// 申请Id
			if (null != dataModifyApply.getId()) {
				dataModifyLog.setApplyId(dataModifyApply.getId());
			}
			// 申请人Id
			if (null != dataModifyApply.getApplyUserId()) {
				dataModifyLog.setApplyUserId(dataModifyApply.getApplyUserId());
			}
			// 表名
			if (null != dataModifyApply.getChangeType()) {
				changeType = dataModifyApply.getChangeType();
				switch (changeType) {
				case "塔维转供电信息":
					tablName = "ZG_TOWER_SITE";
					entityName = "TowerTransVO";
					break;
				case "转供电信息":
					tablName = "SYS_ACCOUNT_SITE";
					entityName = "AccountSiteTrans";
					break;
				case "供应商信息":
					tablName = "SYS_SUPPLIER";
					entityName = "SupplierManage";
					break;
				case "电表信息":
					tablName = "SYS_WATTHOUR_METER";
					entityName = "WatthourMeterVO";
					break;
				case "发票信息":
					tablName = "SYS_INVOICE";
					entityName = "InvoiceVO";
					break;
				case "额定功率信息":
					tablName = "SYS_EQUROOM_POWER_RATING";
					entityName = "PowerRateManage";
					break;
				case "供电信息":
					tablName = "SYS_ACCOUNT_SITE";
					entityName = "AccountSitePSU";
					break;
				case "其他信息":
					tablName = "SYS_ACCOUNT_SITE";
					entityName = "AccountSiteOther";
					break;
				case "报账点信息":
					tablName = "SYS_ACCOUNT_SITE";
					entityName = "AccountSiteManage";
					break;
				case "业主电表信息":
					tablName = "SYS_METER";
					entityName = "MeterVo";
					break;
				case "业主信息":
					tablName = "SYS_OWNER";
					entityName = "OwnerVo";
					break;
				}
				dataModifyLog.setTablName(tablName);
			}
			// 判断修改类型，查找原始数据，修改数据
			if (null != dataModifyApply.getRemarks() && null != paramap) {
				remark = dataModifyApply.getRemarks();
				if (null != remark) {
					// 设置修改类型
					if (remark.indexOf("修改") >= 0) {
						dataModifyLog.setModifyType("U");
					}
					if (remark.indexOf("删除") >= 0) {
						dataModifyLog.setModifyType("D");
					}
					if (remark.indexOf("新增") >= 0) {
						dataModifyLog.setModifyType("C");
					}

				}
				dataModifyLog.setModifyTime(new Date());
				// 单条数据 删除和修改时， 设置日志的原始数据和修改的数据
				// 考虑电表换表时的特殊情况
				if (remark.indexOf("修改") >= 0 || remark.indexOf("删除") >= 0 || entityName.equals("WatthourMeterVO")) {
					paramsList = new ArrayList<String>();
					if (paramap.containsKey("id")) {
						recordId = paramap.get("id");
						// 考虑业主管理的特殊情况，参数值为str
					} else if (paramap.containsKey("str") && entityName.equals("OwnerVo")) {
						tempStr = paramap.get("str");
						reg = "(\")(ownerId)([\\\"]{0,2}:[\\\\\"]{0,2})([^\\\\\",}]*)";
						pattern = Pattern.compile(reg);
						Log.info(tempStr);
						Matcher m = pattern.matcher(tempStr);
						if (m.find()) {
							recordId = m.group(4);
						}
					}else if(paramap.containsKey("damageMeterNum")){
						recordId = paramap.get("damageMeterNum");
					}
					if (recordId != null && !recordId.equals("")) {
						dataModifyLogList.add(dataModifyLog);
						// 设置基础数据的ID
						dataModifyLog.setDataId(recordId);
						objectStr = getObjectStr(recordId, entityName);
						Log.info(objectStr.length() + "");
						if (objectStr.length() > 1000) {
							objectStr = objectStr.substring(0, 1000);
						}
					}
					// 查询修改的字段
					// 考虑电表换表时的特殊情况
					if ((remark.indexOf("修改") >= 0 || entityName.equals("WatthourMeterVO"))&& null != recordId) {
						Map<String, String> changeMap = new HashMap<String, String>();
						// 业主管理时，获取参数
						if (entityName.equals("OwnerVo")) {
							// 查询传递的参数
							tempStr = paramap.get("str");
							paramap = new HashMap<String, String>();
							reg = "(\")([^\",:}]+?)([\\\"]{0,2}:[\\\\\"]{0,2})([^\\\\\",}]*)";
							pattern = Pattern.compile(reg);
							Matcher m = pattern.matcher(tempStr);
							while (m.find()) {
								key = m.group(2);
								value = m.group(4);
								paramap.put(key, value);
							}
						}
						Set<String> nameSet = paramap.keySet();
						if(entityName.equals("AccountSiteManage")){
							nameSet = new HashSet<String>();
							nameSet.add("accountAlias");
							nameSet.add("accountName");
							nameSet.add("siteName");
							nameSet.add("oldFinanceName");
						}
						// 遍历参数 ，对比原数据 存储修改
						for (String name : nameSet) {	
							Log.info(name);
							if (objectStr.matches(".*\"" + name + "\".*")) {
								reg = "(" + name + "\":\"{0,1})(.*?)([\",}])";
								pattern = Pattern.compile(reg);
								Matcher m = pattern.matcher(objectStr);
								if (m.find()) {
									Log.info("true");
									Log.info(m.group(2));
									Log.info(paramap.get(name));
									String oldvalue = m.group(2);
									String newvalue = paramap.get(name);
									// 时间字段特殊处理（统一格式）
									if (name.matches(".*[tT]ime.*") || name.matches(".*[dD]ate.*")) {
										addChangeTime(changeMap, oldvalue, newvalue, name);
									}else{
										//小数格式处理
										if((oldvalue.indexOf(".0") > 0 || newvalue.indexOf(".0") > 0) && oldvalue.length() > 0 
												&& newvalue.length() > 0){
											if(!oldvalue.replace(".0", "").equals(newvalue.replace(".0", ""))){
												changeMap.put(name, paramap.get(name));
											}
										}else{
											if (!oldvalue.equals(paramap.get(name) + "") ) {
												changeMap.put(name, newvalue);
											}
											
										}
									}
									
								}
							}
						}
						//如果是电表换表的情况，添加旧表损坏数据
						if(entityName.equals("WatthourMeterVO") && remark.indexOf("新增") >= 0 ){
							strBuffer = new StringBuffer();
							String[] damagekeyArray = {"damageNum","damageDate","damageInnerNum","electricLoss"};
							for (String name : nameSet) {
								for(String damagekeyStr : damagekeyArray){
									if(name.equals(damagekeyStr)){
										tempStr = paramap.get(damagekeyStr);
										if(null != tempStr && !"".equals(damagekeyStr)){
											strBuffer.append(",\"");
											strBuffer.append(damagekeyStr);
											strBuffer.append("\":\"");
											strBuffer.append(tempStr).append("\",");
										}
									}
								}
							}
							String damageString = new String(strBuffer);
							if(!damageString.equals("")){
								objectStr = objectStr + damageString;
							}
						}
						if (changeMap.size() > 0) {
							String changeMapStr = JsonUtil.toJsonAll(changeMap);
							if (changeMapStr.length() > 1000) {
								changeMapStr = changeMapStr.substring(0, 1000);
							}
							// 设置修改的字段值
							dataModifyLog.setNewParams(changeMapStr);
						}
					}
					// 设置原数据
					dataModifyLog.setOriginalParams(objectStr);
				}
				// 新增时设置 新增的字段值
				
				if (remark.indexOf("新增") >= 0 && !entityName.equals("WatthourMeterVO") ) {
					String changeMapStr = JsonUtil.toJsonAll(paramap);
					changeMapStr.replace("\"loginAccountParam\":[,}]*?", "");
					dataModifyLog.setNewParams(changeMapStr);
					//新增时，设置Log原数据为传入的参数
					dataModifyLog.setOriginalParams(dataModifyApply.getParams());
					dataModifyLogList.add(dataModifyLog);
				}
				// 删除多条数据时 设置多条日志 以及原始数据字段和值
				if (remark.indexOf("删除") >= 0 && paramap.containsKey("Ids")) {
					recordIds = paramap.get("Ids");
				}
				if (remark.indexOf("删除") >= 0 && paramap.containsKey("ownerIds")) {
					recordIds = paramap.get("ownerIds");
				}

				if (null != recordIds) {
					String[] recordIdArray = recordIds.split(",");
					paramsList = new ArrayList<String>();
					for (String recorId : recordIdArray) {
						objectStr = getObjectStr(recorId, entityName);
						if (!objectStr.equals("")) {

							DataModifyLog newModifyLog = copy(dataModifyLog);
							newModifyLog.setOriginalParams(objectStr);
							newModifyLog.setDataId(recorId);
							// newModifyLog.setOriginalParams(objectStr);
							dataModifyLogList.add(newModifyLog);
							paramsList.add(objectStr);
						}
					}
					String paramListStr = JsonUtil.toJsonAll(paramsList);
					if (paramListStr.length() > 1000) {
						paramListStr = paramListStr.substring(0, 1000);
					}
					dataModifyLog.setOriginalParams(paramListStr);
				}
			}
		}

		if (dataModifyLogList.size() > 0) {
			for (DataModifyLog eachModifyLog : dataModifyLogList) {
				eachModifyLog.setId(StringUtils.getUUid());
			}
		}
		return dataModifyLogList;
	}

	/**   
	 * @Description: 不同时间格式 对比，转换成"yyyy-MM-dd"  
	 * 
	*/
	private void addChangeTime(Map<String, String> changeMap, String oldTime, String newTime , String name) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String oldDateStr = "";
		String newDateStr = "";
		Date dateTemp = null;
		oldDateStr = oldTime;
		newDateStr = newTime;
		if (oldTime.matches("[0-9]{5,}")) {
			Long time = new Long(oldTime);
			dateTemp = new Date(time);
			oldDateStr = df.format(dateTemp);
		}
		if (oldTime.matches("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\\s.*")) {
			oldDateStr = oldTime.substring(0, oldDateStr.indexOf(" "));
		}
		if (newTime.matches("[0-9]{5,}")) {
			Long time = new Long(newTime);
			dateTemp = new Date(time);
			newDateStr = df.format(dateTemp);
		}
		if (newTime.matches("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\\s.*")) {
			newDateStr = newTime.substring(0, newTime.indexOf(" "));
		}

		if (!oldDateStr.equals(newDateStr)) {
			changeMap.put(name, newDateStr);
		}

	}

	/**
	 * @Description: 新建 DataModifyLog 并复制一份 
	 */
	private DataModifyLog copy(DataModifyLog dataModifyLog) {
		if (null == dataModifyLog) {
			return null;
		}
		DataModifyLog newModifyLog = new DataModifyLog();
		if (null != dataModifyLog.getApplyId()) {
			newModifyLog.setApplyId(dataModifyLog.getApplyId());
		}
		if (null != dataModifyLog.getApplyUserId()) {
			newModifyLog.setApplyUserId(dataModifyLog.getApplyUserId());
		}
		if (null != dataModifyLog.getModifyType()) {
			newModifyLog.setModifyType(dataModifyLog.getModifyType());
		}
		if (null != dataModifyLog.getModifyTime()) {
			newModifyLog.setModifyTime(dataModifyLog.getModifyTime());
		}
		if (null != dataModifyLog.getTablName()) {
			newModifyLog.setTablName(dataModifyLog.getTablName());
		}
		if (null != dataModifyLog.getNewParams()) {
			newModifyLog.setNewParams(dataModifyLog.getNewParams());
		}
		if (null != dataModifyLog.getOriginalParams()) {
			newModifyLog.setOriginalParams(dataModifyLog.getOriginalParams());
		}
		return newModifyLog;
	}

	/**
	 * @Description: 通过Id、实体类名查询对应的记录。
	 */
	private String getObjectStr(String recordId, String entityName) {
		String objectStr = "";
		if (null != entityName && null != recordId && !recordId.equals("")) {
			switch (entityName) {
			case "SupplierManage":
				SupplierManage supplierManage = supplierManageDao.findSupplyById(recordId);
				if (null != supplierManage) {
					objectStr = JsonUtil.toJsonAll(supplierManage);
				}
				break;
			case "WatthourMeterVO":
				WatthourMeterVO watthourMeterVO = watthourMeterDao.selectById(recordId);
				if (null != watthourMeterVO) {
					objectStr = JsonUtil.toJsonAll(watthourMeterVO);
				}
				break;
			case "InvoiceVO":
				InvoiceVO invoiceVo = invoiceDao.selectByInvoiceId(recordId);
				if (null != invoiceVo) {
					objectStr = JsonUtil.toJsonAll(invoiceVo);
				}
				break;
			case "PowerRateManage":
				PowerRateManage power = powerRateManageDao.findPowerRateById(recordId);
				if (null != power) {
					objectStr = JsonUtil.toJsonAll(power);
				}
				break;
			case "AccountSitePSU":
				AccountSitePSU accountSitePSU = accountSitePSUDao.queryAccountSitePSUBYId(recordId);
				if (null != accountSitePSU) {
					objectStr = JsonUtil.toJsonAll(accountSitePSU);
				}
				break;
			case "AccountSiteOther":
				AccountSiteOther accountSiteOther = accountSiteOtherDao.queryAccountSiteOtherBYId(recordId);
				if (null != accountSiteOther) {
					objectStr = JsonUtil.toJsonAll(accountSiteOther);
				}
				break;
			case "AccountSiteManage":
				List<AccountSiteManage> accountSiteManageList = accountSiteManageDao
						.queryAccountSiteManageBYId(recordId);
				if (null != accountSiteManageList && accountSiteManageList.size() > 0) {
					AccountSiteManage AccountSiteManage = accountSiteManageList.get(0);
					objectStr = JsonUtil.toJsonAll(AccountSiteManage);
				}
				break;
			case "MeterVo":
				MeterVo meterVo = meterDao.queryMeter(recordId);
				if (null != meterVo) {
					objectStr = JsonUtil.toJsonAll(meterVo);
				}
				break;
			case "OwnerVo":
				OwnerVo ownerVo = ownerDao.queryOwner(recordId);
				if (null != ownerVo) {
					objectStr = JsonUtil.toJsonAll(ownerVo);
				}
				break;
			}
		}
		return objectStr;
	}

	/**
	 * @Description: 根据申请id查看 修改详情
	 */
	@Override
	public DataModifyDetail findDetailByApplyId(String applyId) {
		String applyStatus = null;
		String changeTime = null;
		// 根据applyId查询日志（删除类型可能是批量的，有多个日志）
		List<DataModifyLog> dataModifyLogList = dataModifyLogDao.findLogByApplyId(applyId);
		// 根据applyId查询申请
		DataModifyApply dataModifyApply = dataModifyApplyDao.selectByPrimaryKey(applyId);
		if (null != dataModifyApply && null != dataModifyApply.getChangeStatus()) {
			applyStatus = dataModifyApply.getChangeStatus();

		} else if (null == dataModifyApply) {
			return null;
		}
		Date time = dataModifyApply.getChangeTime();
		if (null != time) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			changeTime = dateFormat.format(time);
		}
		String changeType = dataModifyApply.getChangeType();
		DataModifyDetail dataModifyDetail = translateView(dataModifyLogList, applyStatus, changeType, changeTime);
		return dataModifyDetail;
	}

	/**
	 * @param changeType
	 *            修改类型 
	 * @Description: 设置返回页面参数
	 */
	private DataModifyDetail translateView(List<DataModifyLog> dataModifyLogList, String applyStatus, String changeType,
			String changeTime) {
		Set<String> dataIdSet = new TreeSet<String>();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String modifyDdate = null;
		DataModifyDetail dataModifyDetail = new DataModifyDetail();
		// 原数据的页面显示
		ArrayList<Map<String, Map>> allOriginalDataList = new ArrayList<Map<String, Map>>();
		// 修改日志的页面显示
		ArrayList<Map<String, String>> allModifyLogList = new ArrayList<Map<String, String>>();
		List<Map<String, Map>> originalDataList = null;
		List<Map<String, String>> modifyLogList = null;
		// 记录修改字段值和时间
		List<Map<String, String>> loglist = new ArrayList<Map<String, String>>();
		if (null == dataModifyLogList && dataModifyLogList.size() == 0) {
			return dataModifyDetail;
		}
		for (DataModifyLog dataModifyLog : dataModifyLogList) {
			String dataId = dataModifyLog.getDataId();
			String tableName = dataModifyLog.getTablName();
			String modifyType = dataModifyLog.getModifyType();
			String originalParams = dataModifyLog.getOriginalParams();
			String newParams = dataModifyLog.getNewParams();
			Date modifyTime = dataModifyLog.getModifyTime();
			//这里要判断，因为转供电是新增的功能
			if (modifyType.equals("C") && !tableName.equals("SYS_WATTHOUR_METER")) {
				Map<String, String> paraMap = new HashMap<String, String>();
				// 如果是新增操作
				paraMap.put("newParams", "C");
				if (modifyTime == null) {
					modifyTime = new Date();
				}
				modifyDdate = dateFormat.format(modifyTime);
				paraMap.put("modifyDdate", modifyDdate);
				loglist.add(paraMap);
			
			}
			//修改或者换表
			if (null != dataId && !dataId.equals("") && null != tableName && !tableName.equals("")) {
				dataIdSet.add(dataId);
				for (DataModifyLog dataLog : dataModifyLogList) {
					if (null != dataLog.getNewParams() && !dataLog.getNewParams().equals("")) {
						Map<String, String> paraMap = new HashMap<String, String>();
						originalParams = dataLog.getOriginalParams();
						// 如果是修改操作或换表操作
						if (null != dataLog.getModifyType() && dataLog.getModifyType().equals("U") || tableName.equals("SYS_WATTHOUR_METER")) {
							paraMap.put("newParams", dataLog.getNewParams());
							if (null != dataLog.getModifyTime()) {
								modifyDdate = dateFormat.format(dataLog.getModifyTime());
								paraMap.put("modifyDdate", modifyDdate);
							}
							if (null != changeTime) {
								paraMap.put("modifyDdate", changeTime);
							}
							loglist.add(paraMap);
						}
					}
					// 如果是删除操作
					if (null != dataLog.getModifyType() && dataLog.getModifyType().equals("D")) {
						Map<String, String> paraMap = new HashMap<String, String>();
						paraMap.put("newParams", "D");
						if (null != dataLog.getModifyTime()) {
							modifyDdate = dateFormat.format(dataLog.getModifyTime());
							paraMap.put("modifyDdate", modifyDdate);
						}
						loglist.add(paraMap);
					}
				}
			}
			if (null != tableName) {
				dataModifyDetail.setTablName(tableName);
			}
			if (dataIdSet.size() > 0) {
				dataModifyDetail.setDataId(String.join(",", dataIdSet));
			}
			originalDataList = makeOriginalData(tableName, modifyType, originalParams, changeType);
			modifyLogList = makeModifyLog(tableName, modifyType, loglist, changeType);
			if (null != originalDataList && originalDataList.size() > 0) {
				allOriginalDataList.addAll(originalDataList);
			}
			if (null != modifyLogList && modifyLogList.size() > 0) {
				allModifyLogList.addAll(modifyLogList);
			}
		}
		dataModifyDetail.setModifyLogList(allModifyLogList);
		dataModifyDetail.setOriginalDataList(allOriginalDataList);
		return dataModifyDetail;
	}

	/**
	 * @param changeType todo
	 * @Description: 生成修改日志 @param : @return : @throws
	 */
	private List<Map<String, String>> makeModifyLog(String tableName, String modifyType,
			List<Map<String, String>> loglist, String changeType) {
		// 所有日志页面显示
		List<Map<String, String>> modifyLog = new ArrayList<Map<String, String>>();
		// 每行的日志显示
		Map<String, String> lineMap = null;
		List<Map<String, String>> fieldsList = null;
		String paramStr = null;
		String timeStr = null;
		String logStr = null;
		if (null != tableName && null != modifyType && null != loglist && !tableName.equals("")
				&& !modifyType.equals("") && loglist.size() > 0) {
			for (Map<String, String> dataMap : loglist) {
				lineMap = new HashMap<String, String>();
				timeStr = dataMap.get("modifyDdate");
				paramStr = dataMap.get("newParams");
				lineMap.put("time", timeStr);
				if (modifyType.equals("C") && !tableName.equals("SYS_WATTHOUR_METER")) {
					lineMap.put("log", "新增");
				} else if (modifyType.equals("D")) {
					lineMap.put("log", "删除");
				} else {
					logStr = dataModifyLogService.createLogStr(tableName, paramStr, changeType);
					if(modifyType.equals("C") && tableName.equals("SYS_WATTHOUR_METER")){
						logStr = "换表：" + logStr;
					}
					lineMap.put("log", logStr);						
				}
				modifyLog.add(lineMap);
			}
		}
		return modifyLog;
	}

	/**
	 * @param changeType
	 * @Description: 生成原数据 
	 */
	private List<Map<String, Map>> makeOriginalData(String tableName, String modifyType, String originalParams,
			String changeType) {
		// 字段和值
		List<Map<String, String>> fieldList = dataModifyLogService.createOriginalField(tableName, originalParams,
				changeType);
		// 生成展示数据
		List<Map<String, Map>> originalList = new ArrayList<Map<String, Map>>();
		// 行数据
		Map<String, Map> lineMap = null;
		for (int i = 0; i < fieldList.size(); i++) {
			Map<String, String> fieldmap = fieldList.get(i);
			if (i % 3 == 0) {
				lineMap = new HashMap<String, Map>();
				lineMap.put("left", fieldmap);
			} else if (i % 3 == 1) {
				lineMap.put("mid", fieldmap);
			} else if (i % 3 == 2) {
				lineMap.put("right", fieldmap);
				originalList.add(lineMap);
			}
			if (i == (fieldList.size() - 1) && i % 3 != 2) {
				if (i % 3 == 0) {
					lineMap.put("mid", null);
					lineMap.put("right", null);
				} else if (i % 3 == 1) {
					lineMap.put("right", null);
				}
				originalList.add(lineMap);
			}
		}
		return originalList;
	}

	/**
	 * @Description: 判断是否在流程中 
	 */
	@Override
	public boolean isInFlow(DataModifyApply dataModifyApply, Map<String, String> params) {
		List<String> dataIds = new ArrayList<String>();
		if (null != dataModifyApply && null != dataModifyApply.getId()) {
			String changeStatus = dataModifyApply.getChangeStatus();
			if (null != changeStatus && "0".equals(changeStatus)) {
				return true;
			}
			List<DataModifyLog> dataModifyLogList = createDataModifyLog(dataModifyApply, params);
			for (DataModifyLog dataModifyLog : dataModifyLogList) {
				String dataId = dataModifyLog.getDataId();
				if (null != dataId && !dataId.equals("")) {
					dataIds.add(dataId);
				}
			}
			if (dataIds.size() > 0) {
				List<DataModifyApply> currentApplyList = dataModifyApplyDao.findInFlowApplyBydataIds(dataIds);
				if (null != currentApplyList && currentApplyList.size() > 0) {
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * @Description: 自维转供电判断是否在流程中 
	 */

	@Override
	public boolean transIsInFlow(AccountSiteTransSubmit accountSiteTransSubmit) {
		//判断是否有业务操作id
		if (null != accountSiteTransSubmit && null != accountSiteTransSubmit.getApplyId()) {
			//存在业务id
			return true;
		}
		return false;
	}
	
	/**
	 * @Description: 塔维转供电判断是否在流程中 
	 */

	@Override
	public boolean towerTransIsInFlow(TowerTransSubmitVO towerTransSubmitVO) {
		//判断是否有业务操作id
		if (null != towerTransSubmitVO && null != towerTransSubmitVO.getApplyId()) {
			//存在业务id
			return true;
		}
		return false;
	}

}
