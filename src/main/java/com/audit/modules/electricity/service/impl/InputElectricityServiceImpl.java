package com.audit.modules.electricity.service.impl;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.xml.rpc.ParameterMode;
import javax.xml.rpc.encoding.XMLType;

import com.audit.modules.system.service.FileOperatorService;

import org.activiti.engine.HistoryService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.apache.axis.client.Call;
import org.apache.commons.collections.set.SynchronizedSet;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.audit.filter.exception.CommonException;
import com.audit.modules.basedata.service.WhiteMgService;
import com.audit.modules.common.DoubleUtil;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StreamUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.costcenter.entity.CostCeterVO;
import com.audit.modules.costcenter.service.CostCenterService;
import com.audit.modules.electricity.bo.ElectricityBO;
import com.audit.modules.electricity.dao.ElectricitySubmitDao;
import com.audit.modules.electricity.dao.InputElectricityDao;
import com.audit.modules.electricity.dao.JobDao;
import com.audit.modules.electricity.dao.RoomLockingDao;
import com.audit.modules.electricity.dao.TowerElectricityDao;
import com.audit.modules.electricity.entity.BenchmarkVO;
import com.audit.modules.electricity.entity.EleCpowerJobVO;
import com.audit.modules.electricity.entity.ElectricityBenchmark;
import com.audit.modules.electricity.entity.ElectricityFlowVo;
import com.audit.modules.electricity.entity.ElectricitySubmitVO;
import com.audit.modules.electricity.entity.ElectricityWatthourEntity;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.electricity.entity.ElectrictyMidInvoice;
import com.audit.modules.electricity.entity.ElectrictySaveVO;
import com.audit.modules.electricity.entity.ElectrictyToAddVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.electricity.entity.ElectricyBaseVO;
import com.audit.modules.electricity.entity.ExpenseAccountDetails;
import com.audit.modules.electricity.entity.PowerRatingVO;
import com.audit.modules.electricity.entity.RoomIsOnlineVO;
import com.audit.modules.electricity.service.InputElectricityService;
import com.audit.modules.electricity.vo.ElectricityBenchmarkCheckVO;
import com.audit.modules.invoice.service.InvoiceService;
import com.audit.modules.payment.dao.AdvancePaymentDao;
import com.audit.modules.payment.dao.EleMidPaymentDao;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.payment.entity.EleMidPaymentVO;
import com.audit.modules.payment.service.AdvancePaymentService;
import com.audit.modules.reimbursementgroup.entity.ReimbursementVO;
import com.audit.modules.site.dao.BenchmarkDao;
import com.audit.modules.site.dao.SiteInfoDao;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.site.entity.SiteMidSupplierInfo;
import com.audit.modules.site.entity.SmartMeterStandard;
import com.audit.modules.site.entity.SwitchPowerStandard;
import com.audit.modules.site.service.BenchmarkService;
import com.audit.modules.site.service.SiteInfoService;
import com.audit.modules.supplier.dao.SupplierDao;
import com.audit.modules.supplier.service.SupplierService;
import com.audit.modules.system.dao.FileDao;
import com.audit.modules.system.dao.SysMiddleFileDao;
import com.audit.modules.system.entity.SysFileVO;
import com.audit.modules.system.entity.SysMidlleFile;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.service.LoginService;
import com.audit.modules.watthourmeter.dao.WatthourMeterDao;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.audit.modules.watthourmeter.service.WatthourMeterService;
import com.audit.modules.workflow.entity.FinanceExpenseResponse;
import com.audit.modules.workflow.service.AuditWorkflowService;
import com.audit.modules.workflow.service.ZAuditWorkflowService;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**
 * @author : jiadu
 * @Description : 电费录入service实现类
 * @date : 2017/3/7
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Transactional
@Service
public class InputElectricityServiceImpl implements InputElectricityService {

	@Autowired
	private HistoryService historyService;
	
	@Autowired
	private InputElectricityDao inputElectricityDao;
	
	@Autowired
	private JobDao jobDao;
	
	@Autowired
	private RoomLockingDao roomLockingDao;
	
	@Autowired
    private ElectricitySubmitDao electricitySubmitDao;

	@Autowired
	private SysMiddleFileDao sysMiddleFileDao;

	@Autowired
	private WatthourMeterDao watthourMeterDao;

	@Autowired
	private EleMidPaymentDao eleMidPaymentDao;
	
	@Autowired
	private FileDao fileDao;

	@Autowired
	private CostCenterService costCenterService;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private WatthourMeterService watthourMeterService;

	@Autowired
	private SiteInfoService siteInfoService;

	@Autowired
	private AuditWorkflowService auditWorkflowService;

	@Autowired
	private LoginService loginService;

	@Autowired
	private SiteInfoDao siteInfoDao;

	@Autowired
	private BenchmarkService benchmarkService;

	@Autowired
	private BenchmarkDao benchmarkDao;

	@Autowired
	private TowerElectricityDao towerElectricityDao;
	
	@Autowired
	HttpServletRequest request;

	@Autowired
	private FileOperatorService fileOperatorService;
	@Autowired
	private AdvancePaymentService adpvService;
	@Autowired
	private AdvancePaymentDao adpvDao;
	
	@Autowired
	private ZAuditWorkflowService zauditWorkflowService;
	@Autowired
	private SupplierDao sd;
	@Autowired
	private WhiteMgService whiteMgService;

	/**
	 * @param :serialNumber 流水号  accountName 报站点名称
	 * @return :
	 * @throws
	 * @Description: 获取电费列表信息
	 */
	@Override
	public void queryList(PageUtil<ElectrictyListVO> page, ElectrictyVO electrictyVO, UserVo userInfo) {
		Map<String, Object> map = Maps.newHashMap();
		setParamterMap(page, electrictyVO, map, userInfo);
		List<ElectrictyListVO> electrictyListVOs = inputElectricityDao.queryList(map);
/*		//判断用户等级
		HttpSession session = request.getSession();
		UserVo user =(UserVo) session.getAttribute("user");
		List<String> roleList = whiteMgService.getRoleList(user.getUserId());
		int roleLevel=0;
		for(String sys:roleList){
			if("区县公司经办人".equals(sys)){
				roleLevel=1;
				break;
			}
		}
		for(ElectrictyListVO ev:electrictyListVOs){
			ev.setRolelevel(String.valueOf(roleLevel));
		}*/
		page.setTotalRecord(inputElectricityDao.queryListCount(map));
		page.setResults(electrictyListVOs);
		List<String> ids = Lists.newArrayList();
		for (ElectrictyListVO electrictyListVO : electrictyListVOs) {
			ids.add(electrictyListVO.getId());
		}
		// 获取电表信息
		List<Map<String, Object>> objects = queryElectricity(ids);
		if (objects != null && objects.size() > 0) {
			A: for (Map<String, Object> o : objects) {
				String eId = o.get("ID") + "";
				String price = o.get("PRICE") + "";
				String electricity = o.get("ELECTRICITY") + "";
				// String amount = o.get("AMOUNT")+"";
				for (ElectrictyListVO electrictyListVO : electrictyListVOs) {
					if (electrictyListVO.getId().equals(eId)) {
						electrictyListVO.setPrice(price);
						electrictyListVO.setElectricity(electricity);
						continue A;
					}
				}
			}
		}
	}

	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 查询报账组
	 */
	@Override
	public List<String> selectSysRg(UserVo userInfo) {
		Map<String, Object> map = Maps.newHashMap();
		map.put("userId", userInfo.getUserId());
		List<String> list = inputElectricityDao.selectSysRg(map);
		return list;
	}
	
	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 经办人稽核单状态统计
	 */
	@Override
	public List<Map<String, Object>> stasticStatusByCreatePerson(String userId) {
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		Map<String, Object> resultMap = null;
		String status = null;
		List<Map<String, Object>> statusList = inputElectricityDao.stasticStatusByCreatePerson(userId);
		if (null != statusList && statusList.size() > 0) {
			for (Map<String, Object> statusMap : statusList) {
				if (null != statusMap.get("STATUS") && null != statusMap.get("AMOUNT")) {
					resultMap = new HashMap<String, Object>();
					// 0、等待提交审批 1、审批中 2、审批通过 3、审批驳回 4、报销中 5、报销成功 6、报销失败 7、已撤销
					// 8、等待提交稽核
					switch (statusMap.get("STATUS") + "") {
					case "0":
						status = "等待提交审批";
						break;
					case "1":
						status = "审批中";
						break;
					case "2":
						status = "审批通过";
						break;
					case "3":
						status = "审批驳回";
						break;
					case "4":
						status = "报销中";
						break;
					case "5":
						status = "报销成功";
						break;
					case "6":
						status = "报销失败";
						break;
					case "7":
						status = "已撤销";
						break;
					case "8":
						status = "等待提交稽核";
						break;
					}
					resultMap.put("name", status);
					resultMap.put("value", statusMap.get("AMOUNT"));
					resultList.add(resultMap);
				}
			}
		}
		return resultList;
	}

	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 稽核发起人稽核单状态统计
	 */
	@Override
	public List<Map<String, Object>> stasticStatusBySubmitPerson(String userId) {
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		Map<String, Object> resultMap = null;
		String status = null;
		List<Map<String, Object>> statusList = inputElectricityDao.stasticStatusBySubmitPerson(userId);
		if (null != statusList && statusList.size() > 0) {
			for (Map<String, Object> statusMap : statusList) {
				if (null != statusMap.get("STATUS") && null != statusMap.get("AMOUNT")) {
					resultMap = new HashMap<String, Object>();
					switch (statusMap.get("STATUS") + "") {
					case "0":
						status = "等待提交审批";
						break;
					case "1":
						status = "审批中";
						break;
					case "2":
						status = "审批通过";
						break;
					case "3":
						status = "审批驳回";
						break;
					case "4":
						status = "报销中";
						break;
					case "5":
						status = "报销成功";
						break;
					case "6":
						status = "报销失败";
						break;
					case "7":
						status = "已撤销";
						break;
					case "8":
						status = "等待提交稽核";
						break;
					}
					resultMap.put("name", status);
					resultMap.put("value", statusMap.get("AMOUNT"));
					resultList.add(resultMap);
				}
			}
		}
		return resultList;
	}
	/**   
	 * @Description: 报销发起人统计报销单状态  
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	@Override
	public List<Map<String, Object>> stasticSubmitStatusBySubmitPerson(String userId) {
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		Map<String, Object> resultMap = null;
		String status = null;
		List<Map<String, Object>> statusList = inputElectricityDao.stasticStatusBySubmitPerson(userId);
		if (null != statusList && statusList.size() > 0) {
			for (Map<String, Object> statusMap : statusList) {
				status=null;
				if (null != statusMap.get("STATUS") && null != statusMap.get("AMOUNT")) {
					resultMap = new HashMap<String, Object>();
					switch (statusMap.get("STATUS") + "") {
					case "4":
						status = "报销中";
						break;
					case "5":
						status = "报销成功";
						break;
					case "6":
						status = "报销失败";
						break;
					case "7":
						status = "已撤销";
						break;
					}
				}
				if(status != null ){
					resultMap.put("name", status);
					resultMap.put("value", statusMap.get("AMOUNT"));
					resultList.add(resultMap);
				}
			}
		}
		return resultList;
	}
	
	/**   
	 * @Description: 经办人统计报销单状态  
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	@Override
	public List<Map<String, Object>> stasticSubmitStatusByCreatePerson(String userId) {
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		Map<String, Object> resultMap = null;
		String status = null;
		List<Map<String, Object>> statusList = inputElectricityDao.stasticStatusByCreatePerson(userId);
		if (null != statusList && statusList.size() > 0) {
			for (Map<String, Object> statusMap : statusList) {
				status = null;
				if (null != statusMap.get("STATUS") && null != statusMap.get("AMOUNT")) {
					resultMap = new HashMap<String, Object>();
					// 0、等待提交审批 1、审批中 2、审批通过 3、审批驳回 4、报销中 5、报销成功 6、报销失败 7、已撤销
					// 8、等待提交稽核
					switch (statusMap.get("STATUS") + "") {
					case "4":
						status = "报销中";
						break;
					case "5":
						status = "报销成功";
						break;
					case "6":
						status = "报销失败";
						break;
					case "7":
						status = "已撤销";
						break;
					}
				}
				if(status != null ){
					resultMap.put("name", status);
					resultMap.put("value", statusMap.get("AMOUNT"));
					resultList.add(resultMap);
				}
			}
		}
		return resultList;
	}
	
	@Override
	public WatthourMeterVO getelenewtime(String id) {
		WatthourMeterVO watthourMeterVO = inputElectricityDao.getelenewtime(id);
		return watthourMeterVO;
	}

	@Override
	public ResultVO checkSerialNumber(String serialNumber) {
		Integer count =  inputElectricityDao.checkSerialNumber(serialNumber);
		if(count!=null&&count>0){
			return ResultVO.failed("流水号已存在，请重新填写！");
		}
		return ResultVO.success();
	}

	// 设置参数
	private void setParamterMap(PageUtil<ElectrictyListVO> page, ElectrictyVO electrictyVO, Map<String, Object> map,
			UserVo userInfo) {
		map.put("serialNumber", electrictyVO.getSerialNumber() == null ? "" : electrictyVO.getSerialNumber());
		map.put("accountName", electrictyVO.getAccountName() == null ? "" : electrictyVO.getAccountName());
//		parameMap.put("status", electrictyVO.getStatus() == null ? "" : electrictyVO.getStatus() + "");
		map.put("submitPerson", electrictyVO.getSubmitPerson() == null ? "" : electrictyVO.getSubmitPerson());
		map.put("sysRgName", electrictyVO.getSysRgName() == null ? "" : electrictyVO.getSysRgName());
		map.put("countyId", electrictyVO.getCountyId() == null ? "" : electrictyVO.getCountyId());
		map.put("cityId", electrictyVO.getCityId() == null ? "" : electrictyVO.getCityId());
		if(electrictyVO.getCreateStartDate()!=null){
			map.put("createStartDate",electrictyVO.getCreateStartDate());
		}
		if(electrictyVO.getAuditType()!=null){
			map.put("auditType", electrictyVO.getAuditType());
		}
		if(electrictyVO.getCreateEndDate()!=null){
			Calendar calendar = new GregorianCalendar();
			calendar.setTime(electrictyVO.getCreateEndDate());
			calendar.add(Calendar.DAY_OF_YEAR,1);
			map.put("createEndDate",calendar.getTime());
		}
		if(electrictyVO.getStatuses()!=null&&electrictyVO.getStatuses().length>0){
			map.put("status",electrictyVO.getStatuses());
		}
		if (userInfo != null) {
			map.put("userID", userInfo.getUserId() == null ? "" : userInfo.getUserId());
		}
		map.put("pageSize",page.getPageSize());
		map.put("pageNo",page.getPageNo()-1);
		page.setObj(map);
	}

	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 批量提交
	 */
	@Override
	public ResultVO batchSubmit(String[] ids, UserVo userInfo) {
		String userID = null;
		if (userInfo != null) {
			userID = userInfo.getUserId();
		} else {
			return ResultVO.failed("用户ID获取失败！");
		}
		List<ElectrictyListVO> electrictyListVOs = inputElectricityDao.queryByIDs(Arrays.asList(ids));
		for (ElectrictyListVO electrictyListVO : electrictyListVOs) {
									//		String status = checkSiteRepeatSubmit(electrictyListVO.getSiteID());
									//			if (status == null) {
				String id = electrictyListVO.getId();
									//根据id查找电费table信息
				ElectrictyVO evo = inputElectricityDao.getCpById(id);
								//获得核销金
								/*Map<String, String> map=new HashMap<String,String>();
								String expenseTotalAmount = evo.getExpenseTotalAmount();
								map.put("supplyId", evo.getSupplierID());*/
								//查找到预付单
				
									//AdvancePaymentVo adpv = adpvService.getOneByUserId(map);//提交查看每一个稽核单对应供应商的预付单
	           //查看稽核单对应的多个预付单的中间表
				List<EleMidPaymentVO> eleMidPayments = eleMidPaymentDao.getEleMidPaymentByEleID(evo.getId());
				//检测保存的预付信息现在是否还能够使用
				for(EleMidPaymentVO eleMidPayment : eleMidPayments) {
					//获取预付单id
					String paymentID = eleMidPayment.getAdvancePaymentID();
					//查询预付单信息
					AdvancePaymentVo advpm = adpvDao.getOneById(paymentID);
					//中间表中记录的核销金额
					double expenseAmount = Double.parseDouble(eleMidPayment.getExpenseAmount());
					//该预付单当前的剩余金额
					double surplusMoney_new = Double.parseDouble(advpm.getSurplusMoney());
					
					if(expenseAmount>surplusMoney_new) {
						return ResultVO.failed("稽核单流水号"+electrictyListVO.getSerialNumber()+"对应的预付单号"+advpm.getPaymentNumber()+"余额不足，请检查后再提交");
					}
				}
				//预付信息能够使用后，正式修改预付单信息（当所有的 预付信息都能够使用的时候才修改数据）
				for(EleMidPaymentVO eleMidPayment : eleMidPayments) {
					//获取预付单id
					String paymentID = eleMidPayment.getAdvancePaymentID();
					//中间表中记录的核销金额
					double expenseAmount = Double.parseDouble(eleMidPayment.getExpenseAmount());
					
					//查询预付单信息
					AdvancePaymentVo advpm = adpvDao.getOneById(paymentID);
					//该预付单当前的剩余金额
					double surplusMoney_new = Double.parseDouble(advpm.getSurplusMoney());
					//该预付单当前的流程中金额
					double cancellingMoney_new = Double.parseDouble(advpm.getCancellingMoney());
					
					
					AdvancePaymentVo newAdpv=new AdvancePaymentVo();//构建一个新的预付单用来修改原预付单
					newAdpv.setId(advpm.getId());//复制预付单的id
					newAdpv.setCancellingMoney(String.valueOf(cancellingMoney_new+expenseAmount));//流程中的金额增加
					newAdpv.setSurplusMoney(String.valueOf(surplusMoney_new-expenseAmount));//剩余的金额减少
					adpvDao.updatePayment(newAdpv);//更新预付单的数据
				}
				
				
				/*if(adpv!=null){
	            	 //上一次流程中核销金
		            String cancellingMoney = adpv.getCancellingMoney();//产看该预付单在流程中的金额
		            AdvancePaymentVo newAdpv=new AdvancePaymentVo();//构建一个新的预付单用来修改原预付单
		            newAdpv.setId(adpv.getId());//设置新预付单id
		            if(cancellingMoney!= null && !"0.0".equals(cancellingMoney)){
		            	Double add = DoubleUtil.add(Double.parseDouble(cancellingMoney), Double.parseDouble(expenseTotalAmount));
		            	newAdpv.setCancellingMoney(String.valueOf(add));
		            }else{
		            	newAdpv.setCancellingMoney(expenseTotalAmount);
		            }
		            double sub = DoubleUtil.sub(Double.parseDouble(adpv.getSurplusMoney()), Double.parseDouble(expenseTotalAmount));
		            newAdpv.setSurplusMoney(String.valueOf(sub));
		            //修改改最新的流程中核销金和剩余的钱
		            adpvDao.updatePayment(newAdpv);
					
	            }*/
	            //以下是改变流程
	            auditWorkflowService.startFlow(id);
				Map<String, String> paramterMap = Maps.newHashMap();
				paramterMap.put("id", id);
				paramterMap.put("submitPerson", userID);
				inputElectricityDao.updateSubmitPerson(paramterMap);
				updateStatus(id, 1);
//			}else {
//				return ResultVO.failed(status);
//			}
				//如果稽核单超标，推送emos
				if(electrictyListVO.getDec()!=null && !electrictyListVO.getDec().equals("")) {
					//根据稽核单号查询用电信息和该报账点的标杆信息
					List<WatthourExtendVO> watthourExtendVOs = jobDao.getWatthourExtendByEleID(id);
					
					int allDay = watthourExtendVOs.get(0).getDayAmmeter();//总用电天数
					Double allPower = 0d;//总用电量
					
					for(WatthourExtendVO watthourExtendVO : watthourExtendVOs) {
						if(watthourExtendVO.getTotalEleciric()!=null) {
							allPower += Double.parseDouble(watthourExtendVO.getTotalEleciric());
						}
					}
					//查询报账点总功率
					List<String> param = new ArrayList<String>();
					param.add(watthourExtendVOs.get(0).getAccountid());
					List<PowerRatingVO> powerRatingVOS;
					powerRatingVOS = benchmarkService.getPowerRating(param);
					long oldAllPower = powerRatingVOS.get(0).getTotalPowerRating();
					//查询报账点信息
					SiteInfoVO queryById = siteInfoDao.queryById(watthourExtendVOs.get(0).getAccountid());
					if(oldAllPower==0) {
						this.emos(id,queryById.getArea(), queryById.getAccountName(), "9999", electrictyListVO.getDec());
					}else if(oldAllPower*allDay/1000<allPower) {
						this.emos(id,queryById.getArea(), queryById.getAccountName(), new java.text.DecimalFormat("#.00").format((allPower-(oldAllPower*allDay/1000))/(oldAllPower*allDay/1000)), electrictyListVO.getDec());
					}
				}
		}
		return ResultVO.success();
	}
	
	
	
	
	
	
	
	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 综合批量提交
	 */
	@Override
	public ResultVO zbatchSubmit(String[] ids, UserVo userInfo) {
		String userID = null;
		if (userInfo != null) {
			userID = userInfo.getUserId();
		} else {
			return ResultVO.failed("用户ID获取失败！");
		}
		List<ElectrictyListVO> electrictyListVOs = inputElectricityDao.zqueryByIDs(Arrays.asList(ids));
		for (ElectrictyListVO electrictyListVO : electrictyListVOs) {
//		String status = checkSiteRepeatSubmit(electrictyListVO.getSiteID());
//			if (status == null) {
				String id = electrictyListVO.getId();
				zauditWorkflowService.startFlow(id);
				Map<String, String> paramterMap = Maps.newHashMap();
				paramterMap.put("id", id);
				paramterMap.put("submitPerson", userID);
				inputElectricityDao.updateSubmitPerson(paramterMap);
				updateStatus(id, 1);
//			}else {
//				return ResultVO.failed(status);
//			}
		}
		return ResultVO.success();
	}


	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 根据电费表ID 获取电费信息
	 */
	@Override
	public List<ElectrictyVO> findSiteIdByEid(List<String> eids) {
		return inputElectricityDao.findSiteIdByEid(eids);
	}

	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 根据电费录入IDs获取列表信息
	 */
	@Override
	public List<ElectrictyListVO> queryByIDs(List<String> ids) {
		List<ElectrictyListVO> electrictyListVOs = inputElectricityDao.queryByIDs(ids);
		for (ElectrictyListVO electrictyListVO : electrictyListVOs) {
			ids.add(electrictyListVO.getId());
		}
		List<Map<String, Object>> objects = queryElectricity(ids);// 获取电表信息
		if (objects != null && objects.size() > 0) {
			A: for (Map<String, Object> o : objects) {
				String eId = o.get("ID") + "";
				String price = o.get("PRICE") + "";
				String electricity = o.get("ELECTRICITY") + "";
				// String amount = o.get("AMOUNT")+"";
				for (ElectrictyListVO electrictyListVO : electrictyListVOs) {
					if (electrictyListVO.getId().equals(eId)) {
						electrictyListVO.setPrice(price);
						electrictyListVO.setElectricity(electricity);
						continue A;
					}
				}
			}
		}
		return electrictyListVOs;
	}

	@Override
	public ElectrictySaveVO queryTotalAmount() {
		return inputElectricityDao.queryTotalAmount();
	}

	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 跳转到添加页面
	 */
	@Override
	public ElectrictyToAddVO toAdd(UserVo userInfo) {
		List<CostCeterVO> lists = new ArrayList<CostCeterVO>();
		ElectrictyToAddVO electrictyToAddVO = new ElectrictyToAddVO();
		if (userInfo != null) {
			electrictyToAddVO.setAreas(userInfo.getCityStr());
			electrictyToAddVO.setCounties(userInfo.getCountyStr());
			if(userInfo.getDepartmentIdSum()!=null){
	        	for(int i=0;i<userInfo.getDepartmentIdSum().size();i++){
	        		Map<String, String> paramterMap = Maps.newHashMap();
	                paramterMap.put("departmentNo", userInfo.getDepartmentIdSum().get(i));
	        		 List<CostCeterVO> list = costCenterService.findByLoginUser(paramterMap);
	        		 System.out.println( list.size());
	        		 if(list!=null){          			
	        			 for(int j=0;j<list.size();j++){
	        				 if(i==0){
	        				 lists.add(list.get(j));  
	        				 }else{     
	        					 int pd=0;
	        						for(int k=0;k<lists.size();k++){
	        							System.out.println(list.get(j).getId()+"QQQ"+lists.get(k).getId()+"www"+lists.size());
	        							if(list.get(j).getId().equals(lists.get(k).getId())){        								
	        								list.remove(j);
	        								pd=1;
	        								break;
	        								//lists.add(list.get(j));       							       								
	        							}
	        						}   
	        						if(pd==0){
	        						lists.add(list.get(j));
	        						}
	        				 }        				     				
	        			 }        									
	        		 }
	        	}
	        	electrictyToAddVO.setCostCeterVOs(lists);
	        	}				
		}
		electrictyToAddVO.setInvoiceVOs(invoiceService.queryAllInvoice());// 获取发票信息
		synchronized (this){
			electrictyToAddVO.setSerialNumber(StringUtils.createSerialNumber("JH"));
		}
		return electrictyToAddVO;
	}
	

	@Override
	public ResultVO deleteByIDs(String[] ids) {
		if (ids == null || ids.length == 0) {
			return ResultVO.failed("请选择电费单！");
		}
		List<String> idList = Arrays.asList(ids);
		//删除电费table信息
		for(int i=0;i<ids.length;i++){
			//根据电费单id查报账点id,知道保障点id可以更改锁定状态 noone
			String getaccoutsiteidbyeleid = inputElectricityDao.getaccoutsiteidbyeleid(ids[i]);
			//根据报账点id查对应报账点电费最新终止时间
			WatthourMeterVO getnewtime = inputElectricityDao.getnewtime(getaccoutsiteidbyeleid);
			//查这次删除电费单中的终止时间有没有最新的那个时间，没有就不让删除
			WatthourMeterVO getelenewtime = inputElectricityDao.getelenewtime(ids[i]);
			if(getelenewtime!=null&&getnewtime!=null&&getelenewtime.getBelongEndTime()!=null &&getnewtime.getBelongEndTime()!=null){
				if(getelenewtime.getBelongEndTime().getTime()!=getnewtime.getBelongEndTime().getTime()){
					return ResultVO.failed("请先删除电表归属日期最新的稽核单");
				}
			}
			
			//删除稽核单的时候，如果该稽核单存在锁定机房的的行为要放开对应的机房
			List<String> roomIDs = roomLockingDao.unLockingRoomByElectrictyId(ids[i]);
			if(roomIDs!=null && roomIDs.size()>0) {
				for(String roomID : roomIDs) {
					roomLockingDao.unLockingRoom(roomID);
				}
			}
			
			//根据报账点id查出退网状态，如果时退网，把锁定状态更改为""
//			List<SiteInfoVO> siteInfoVOs= siteInfoDao.queryExitStatusById(getaccoutsiteidbyeleid);
//			if(siteInfoVOs.get(0)!=null &&siteInfoVOs.get(0).getRoomStatus()!=null && siteInfoVOs.get(0).getRoomStatus().equals("退网")) {
//				siteInfoDao.batchUpdateRoomStatusNull(getaccoutsiteidbyeleid);
//			}
		}
		inputElectricityDao.deleteByIDs(idList);
		for(String id :idList){
			List<String> fileIDs = sysMiddleFileDao.findFilesID(id);
			if (fileIDs != null && fileIDs.size() > 0) {
				fileOperatorService.fileDelete(fileIDs.toArray(new String[]{}));
			}
			sysMiddleFileDao.deleteMiddleFiles(id);
			inputElectricityDao.deleteEleMidInvoiceByEleID(id);
			List<String> watthourExtendIDs = watthourMeterService.findWatthourExtendIDs(id);
			watthourMeterService.deleteMiddleWatthour(id);
			if (watthourExtendIDs != null && watthourExtendIDs.size() > 0) {
				watthourMeterService.deleteWatthourExtends(watthourExtendIDs);
			}
		}
		return ResultVO.success();
	}

	/**
	 * 税金金额
	 * */
	@Override
	public String findTaxAmountSum(String id) {
		Map<String, String> paramMap = Maps.newHashMap();
		paramMap.put("id", id);
		List<String> taxamounts=inputElectricityDao.findTaxAmountSum(paramMap);
		BigDecimal taxamount = new BigDecimal("0.00");
		if(taxamounts.size()>0&&taxamounts!=null){		
		for(int i=0;i<taxamounts.size();i++){
			taxamount=taxamount.add(new BigDecimal(taxamounts.get(i)));
		}
		}
		return taxamount+"";
	}
	
	/**
	 * 其他费用
	 * */
	@Override
	public String findOtherCostSum(String id) {
		Map<String, String> paramMap = Maps.newHashMap();
		paramMap.put("id", id);
		String othercost=inputElectricityDao.findOtherCostSum(paramMap);
		return othercost;
	}

	/**
	 * 电费金额
	 * */
	@Override
	public String findElectricityAmountSum(String id) {
		Map<String, String> paramMap = Maps.newHashMap();
		paramMap.put("id", id);
		List<String> electricityamounts=inputElectricityDao.findElectricityAmountSum(paramMap);
		BigDecimal electricityamount = new BigDecimal("0.00");
		if(electricityamounts.size()>0&&electricityamounts!=null){		
		for(int i=0;i<electricityamounts.size();i++){
			electricityamount=electricityamount.add(new BigDecimal(electricityamounts.get(i)));
		}
		}
		return electricityamount+"";
	}
	
	/**
	 * @param : id
	 * @return :
	 * @throws
	 * @Description: 查看详情
	 */
	@Override
	public ElectrictyVO findOneByID(String id) {
		Map<String, String> paramMap = Maps.newHashMap();
		paramMap.put("id", id);
		ElectrictyVO electrictyVO = inputElectricityDao.findOneByID(paramMap);
		if (electrictyVO == null) {
			return null;
		}
		//查询是否为最后一个月
		electrictyVO.setIsNewEle(true);
		//根据电费单id查报账点id
		String getaccoutsiteidbyeleid = inputElectricityDao.getaccoutsiteidbyeleid(id);
		System.err.println("getaccoutsiteidbyeleid="+getaccoutsiteidbyeleid);
		
		if (getaccoutsiteidbyeleid != null && getaccoutsiteidbyeleid != "") {
			//根据报账点id查对应报账点电费最新终止时间
			WatthourMeterVO getnewtime = inputElectricityDao.getnewtime(getaccoutsiteidbyeleid);
			//查这次删除电费单中的终止时间有没有最新的那个时间，没有就不让删除
			WatthourMeterVO getelenewtime = inputElectricityDao.getelenewtime(id);
			
			if(getelenewtime!=null&&getnewtime!=null&&getelenewtime.getBelongEndTime()!=null &&getnewtime.getBelongEndTime()!=null){
				if(getelenewtime.getBelongEndTime().getTime()!=getnewtime.getBelongEndTime().getTime()){
					electrictyVO.setIsNewEle(false);
				}
			}
		}
	
		
		electrictyVO.setTaxAmount(findTaxAmountSum(id));//税金金额
		electrictyVO.setElectricityAmount(findElectricityAmountSum(id));//电费金额
		List<AdvancePaymentVo> new_adpv = new ArrayList<AdvancePaymentVo>();
		//根据稽核单id查询预付核销信息
		List<EleMidPaymentVO>  eleMidPayments = eleMidPaymentDao.getEleMidPaymentByEleID(id);
		if(eleMidPayments!=null && eleMidPayments.size()>0) {
			for(EleMidPaymentVO eleMidPayment : eleMidPayments) {
				//获取预付单id
				String paymentID = eleMidPayment.getAdvancePaymentID();
				//中间表中记录的核销金额
				double expenseAmount = Double.parseDouble(eleMidPayment.getExpenseAmount());
				
				//查询预付单信息
				AdvancePaymentVo advpm = adpvDao.getOneById(paymentID);
				advpm.setExpenseAmount(String.valueOf(expenseAmount));
				new_adpv.add(advpm);
			}
			electrictyVO.setAdpv(new_adpv);
		}
//		// 查询对象
//    	HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery();   
//    	//query.processDefinitionKey("02c9b99e16844032bfb2f4a9db776c13");//使用流程定义的KEY查询
//    	List<HistoricProcessInstance> hpis = query.list();
//    	  for (HistoricProcessInstance hpi : hpis) {
//    		  if(hpi.getBusinessKey().equals(id)){
//       		   System.out.print("pid:" + hpi.getId()+",");
//       		   if(hpi.getId()!=null||hpi.getId()!=""){
//       			electrictyVO.setInstanceID(hpi.getId());  
//       		   }    	
//    		  }
//    		  }
    	
		List<SysFileVO> sysFileVOs = inputElectricityDao.findFileByElID(paramMap);
		List<WatthourMeterVO> watthourMeterVOs = watthourMeterDao.findAllBySiteID(paramMap);
		List<ExpenseAccountDetails> expenseAccountDetails = inputElectricityDao.findExpenseAccountDetails(paramMap);//报销单明细数据
		electrictyVO.setExpenseAccountDetails(expenseAccountDetails);
		Double total  = 0d;
		for(WatthourMeterVO watthourMeterVO:watthourMeterVOs){			
			if(watthourMeterVO != null && StringUtils.isNotBlank(watthourMeterVO.getTotalEleciric())){
				try {
					total+=Double.parseDouble(watthourMeterVO.getTotalEleciric());
				}catch (Exception e){

				}
			}
		}
		electrictyVO.setTotalEleciric(total+"");
		electrictyVO.setWatthourMeterVOs(watthourMeterVOs);
		electrictyVO.setSysFileVOs(sysFileVOs);

		ElectricityBenchmark electricityBenchmark = inputElectricityDao.queryElectricityBenchmarkByElectricityId(id);
		electrictyVO.setElectrictyMidInvoices(inputElectricityDao.findByEleID(id));
		if (electricityBenchmark != null) {
			electrictyVO.setBenchmarkVO(new BenchmarkVO(electricityBenchmark));
		}
		return electrictyVO;
	}
	
	
	
	@Override
	public ElectrictyVO findOneByID11(String id) {
		Map<String, String> paramMap = Maps.newHashMap();
		paramMap.put("id", id);
		ElectrictyVO electrictyVO = inputElectricityDao.findOneByID11(paramMap);
		if (electrictyVO == null) {
			return null;
		}
		electrictyVO.setTaxAmount(findTaxAmountSum(id));//税金金额
		electrictyVO.setElectricityAmount(findElectricityAmountSum(id));//电费金额
//		// 查询对象
//    	HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery();   
//    	//query.processDefinitionKey("02c9b99e16844032bfb2f4a9db776c13");//使用流程定义的KEY查询
//    	List<HistoricProcessInstance> hpis = query.list();
//    	  for (HistoricProcessInstance hpi : hpis) {
//    		  if(hpi.getBusinessKey().equals(id)){
//       		   System.out.print("pid:" + hpi.getId()+",");
//       		   if(hpi.getId()!=null||hpi.getId()!=""){
//       			electrictyVO.setInstanceID(hpi.getId());  
//       		   }    	
//    		  }
//    		  }
    	
		List<SysFileVO> sysFileVOs = inputElectricityDao.findFileByElID(paramMap);
		List<WatthourMeterVO> watthourMeterVOs = watthourMeterDao.findAllBySiteID(paramMap);
		List<ExpenseAccountDetails> expenseAccountDetails = inputElectricityDao.findExpenseAccountDetails(paramMap);//报销单明细数据
		electrictyVO.setExpenseAccountDetails(expenseAccountDetails);
		Double total  = 0d;
		for(WatthourMeterVO watthourMeterVO:watthourMeterVOs){			
			if(StringUtils.isNotBlank(watthourMeterVO.getTotalEleciric())){
				try {
					total+=Double.parseDouble(watthourMeterVO.getTotalEleciric());
				}catch (Exception e){

				}
			}
		}
		electrictyVO.setTotalEleciric(total+"");
		electrictyVO.setWatthourMeterVOs(watthourMeterVOs);
		electrictyVO.setSysFileVOs(sysFileVOs);

		ElectricityBenchmark electricityBenchmark = inputElectricityDao.queryElectricityBenchmarkByElectricityId(id);
		electrictyVO.setElectrictyMidInvoices(inputElectricityDao.findByEleID(id));
		if (electricityBenchmark != null) {
			electrictyVO.setBenchmarkVO(new BenchmarkVO(electricityBenchmark));
		}
		return electrictyVO;
	}
	
	/**
	 * @param : id
	 * @return :
	 * @throws
	 * @Description: 查看详情
	 */
	@Override
	public ElectrictyVO findOneByIDDetails(String id) {
		Map<String, String> paramMap = Maps.newHashMap();
		paramMap.put("id", id);
		
		ElectrictyVO electrictyVO = inputElectricityDao.findOneByID(paramMap);
		if (electrictyVO == null) {
			return null;
		}
		electrictyVO.setTaxAmount(findTaxAmountSum(id));//税金金额
		electrictyVO.setElectricityAmount(findElectricityAmountSum(id));//电费金额
//		// 查询历史对象
//    	HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery();   
//    	//query.processDefinitionKey("02c9b99e16844032bfb2f4a9db776c13");//使用流程定义的KEY查询
//    	List<HistoricProcessInstance> hpis = query.list();
//    	  for (HistoricProcessInstance hpi : hpis) {
//    		  if(hpi.getBusinessKey().equals(id)){
//       		   System.out.print("pid:" + hpi.getId()+",");
//       		   if(hpi.getId()!=null||hpi.getId()!=""){
//       			electrictyVO.setInstanceID(hpi.getId());  
//       		   }    	
//    		  }
//    		  }
		//查看流程id
		String instanceId=inputElectricityDao.findInstanceId(paramMap);
		if(instanceId!=null||!"".equals(instanceId)){
			electrictyVO.setInstanceID(instanceId); 
		}
		List<SysFileVO> sysFileVOs = inputElectricityDao.findFileByElID(paramMap);
		List<WatthourMeterVO> watthourMeterVOs = watthourMeterDao.findAllBySiteID(paramMap);
		List<ExpenseAccountDetails> expenseAccountDetails = inputElectricityDao.findExpenseAccountDetails(paramMap);//报销单明细数据
		electrictyVO.setExpenseAccountDetails(expenseAccountDetails);
		Double total  = 0d;
		for(WatthourMeterVO watthourMeterVO:watthourMeterVOs){			
			if(StringUtils.isNotBlank(watthourMeterVO.getTotalEleciric())){
				try {
					total+=Double.parseDouble(watthourMeterVO.getTotalEleciric());
				}catch (Exception e){

				}
			}
		}
		electrictyVO.setTotalEleciric(total+"");
		electrictyVO.setWatthourMeterVOs(watthourMeterVOs);
		electrictyVO.setSysFileVOs(sysFileVOs);

		ElectricityBenchmark electricityBenchmark = inputElectricityDao.queryElectricityBenchmarkByElectricityId(id);
		electrictyVO.setElectrictyMidInvoices(inputElectricityDao.findByEleID(id));
		if (electricityBenchmark != null) {
			electrictyVO.setBenchmarkVO(new BenchmarkVO(electricityBenchmark));
		}
		return electrictyVO;
	}

	/**
	 * @param : siteID 站点ID
	 * @return :
	 * @throws
	 * @Description: 根据选择的站点名称获取其余数据
	 */
	@Override
	public ElectricyBaseVO findBySiteID(String siteID) {
		Map<String, String> paramMap = Maps.newHashMap();
		paramMap.put("siteID", siteID);
		ElectricyBaseVO electricyBaseVO = new ElectricyBaseVO();
		List<ElectricyBaseVO> dElectricyBaseVO =new ArrayList<>();
		ElectricyBaseVO qelectricyBaseVO = inputElectricityDao.findBySiteID(paramMap);
		dElectricyBaseVO = inputElectricityDao.findByCreateDate(paramMap);		
		if (qelectricyBaseVO != null) {
			electricyBaseVO=qelectricyBaseVO;
		}
		if(dElectricyBaseVO!=null && !dElectricyBaseVO.isEmpty()){
			if(dElectricyBaseVO.size()>0){	
        		for(int j=0;j<dElectricyBaseVO.size();j++){

        			if(dElectricyBaseVO.get(j)!=null){
        			if(dElectricyBaseVO.get(j).getCreateDate()!=null){
            			System.out.println(dElectricyBaseVO.get(j).getCreateDate()+"上次创单时间");
            			electricyBaseVO.setCreateDate(dElectricyBaseVO.get(j).getCreateDate());; //保存上次创单时间	
            		break;
        			} 
        		}  
				}
        	}
		}
		//电费录入时查询电表信息
		List<WatthourMeterVO> findBySiteId = watthourMeterService.findBySiteId(siteID);
		for(int i=0;i<findBySiteId.size();i++){
			if(findBySiteId.get(i).getStartAmmeter()!=null &&findBySiteId.get(i).getStartAmmeter()!=""){
				findBySiteId.get(i).setIshave(true);
			}else{
				findBySiteId.get(i).setIshave(false);
			}
		}
		if(findBySiteId.size()>0){
			if(findBySiteId.get(0)!=null&&findBySiteId.get(0).getBelongEndTime()!=null){
				Calendar ca=Calendar.getInstance();
				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
				Date belongEndTime = findBySiteId.get(0).getBelongEndTime();
				ca.setTime(belongEndTime);
				ca.set(Calendar.DAY_OF_MONTH,ca.get(Calendar.DAY_OF_MONTH)+1);//让日期加1  
				Date time = ca.getTime();
				String format = sdf.format(time);
				findBySiteId.get(0).setBelongEndTimeS(format);
			}

		}
		
		electricyBaseVO.setWatthourMeterVOs(findBySiteId);
		return electricyBaseVO;
	}
	
	/**
	 * 检测提交的稽核单电表是否超标杆
	 */
	@Override
	public ResultVO checkElePowerRating(ElectrictySaveVO electrictySaveVO) {
		WatthourExtendVO[] vos = electrictySaveVO.getWatthourExtendVOs();
		Double allDay = 0d;//总小时数
		Double allPower = 0d;//总用电量
		for(int i = 0 ; i<vos.length ;i++) {
			//总小时数
			if(vos[i].getDayAmmeter()!=null) {
				allDay+=vos[i].getDayAmmeter()*24;
			}
			//总用电量
			if(vos[i].getTotalEleciric()!=null) {
				allPower +=Double.parseDouble(vos[i].getTotalEleciric());
			}
		}
		//查询总功率
		Double allPowerRating = 0d;//机房总功率
		if(electrictySaveVO.getIsOnline().equals("1")) {
			List<String> onlineRooms = this.checkRoomIdByAccountId(electrictySaveVO.getSysAccountSiteId(), 1, true);
			for(String roomId : onlineRooms) {
				allPowerRating += this.getPowerRatingByRoomId(roomId, 1);
			}
		}else {
			List<String> onlineRooms = this.checkRoomIdByAccountId(electrictySaveVO.getSysAccountSiteId(), 2, true);
			for(String roomId : onlineRooms) {
				allPowerRating += this.getPowerRatingByRoomId(roomId, 0);
			}
		}
		if(allPowerRating==0) {
			return ResultVO.newResult(200, "用电量超标20%以上", "用电量超标,超标类型为额定功率,超标值为9999%");
		}else if(allPowerRating*allDay/1000*1.2<allPower) {
			NumberFormat nf = NumberFormat.getPercentInstance();
			nf.setMaximumFractionDigits(2);
			return ResultVO.newResult(200, "用电量超标20%以上", "用电量超标,超标类型为额定功率,超标值为"+nf.format((allPower-(allPowerRating*allDay/1000))/(allPowerRating*allDay/1000)));
		}else if(allPowerRating*allDay/1000<allPower) {
			NumberFormat nf = NumberFormat.getPercentInstance();
			nf.setMaximumFractionDigits(2);
			return ResultVO.newResult(200, "用电量超标", "用电量超标,超标类型为额定功率,超标值为"+nf.format((allPower-(allPowerRating*allDay/1000))/(allPowerRating*allDay/1000)));
		}else {
			return ResultVO.success("未超标杆值");
		}
		
//		List<PowerRatingVO> powerRatingVOS;
//		powerRatingVOS = benchmarkService.getPowerRating(param);
//		long oldAllPower = powerRatingVOS.get(0).getTotalPowerRating();
//		if(oldAllPower==0) {
//			return ResultVO.newResult(200, "用电量超标20%以上", "用电量超标,超标类型为额定功率,超标值为9999%");
//		}else if(oldAllPower*allDay/1000*1.2<allPower) {
//			NumberFormat nf = NumberFormat.getPercentInstance();
//			nf.setMaximumFractionDigits(2);
//			return ResultVO.newResult(200, "用电量超标20%以上", "用电量超标,超标类型为额定功率,超标值为"+nf.format((allPower-(oldAllPower*allDay/1000))/(oldAllPower*allDay/1000)));
//		}else if(oldAllPower*allDay/1000<allPower){
//			NumberFormat nf = NumberFormat.getPercentInstance();
//			nf.setMaximumFractionDigits(2);
//			return ResultVO.newResult(200, "用电量超标", "用电量超标,超标类型为额定功率,超标值为"+nf.format((allPower-(oldAllPower*allDay/1000))/(oldAllPower*allDay/1000)));
//		}else{
//			return ResultVO.success("未超标杆值");
//		}
	}

	/**
	 * @param : electrictyVO
	 * @return :
	 * @throws
	 * @Description: 保存
	 */
	@Override
	public ResultVO saveElectricty(ElectrictySaveVO electrictySaveVO, UserVo userInfo) {
		String id = StringUtils.getUUid();
		electrictySaveVO.setId(id);
		electrictySaveVO.setCreateDate(new Date());
		if (userInfo != null) {
			electrictySaveVO.setCreatePerson(userInfo.getUserId());
		}
		//查是否存在同一报账点信息
		String status = checkSiteRepeatSubmit(electrictySaveVO.getSysAccountSiteId(),electrictySaveVO);
		if (status != null) {
			return ResultVO.failed(status);
		}
		Integer count = inputElectricityDao.checkSerialNumber(electrictySaveVO.getSerialNumber());
		if(count!=null&& count>0){
			return ResultVO.failed("流水号已存在，请重新填写！");
		}
		WatthourExtendVO[] watthourMeterVOs = electrictySaveVO.getWatthourExtendVOs();
		if (watthourMeterVOs != null && watthourMeterVOs.length > 0) {
			watthourMeterService.saveWatthourExtend(watthourMeterVOs, id);// 保存电表信息
		}
		if(electrictySaveVO.getStatus() == 1){
			String userID = null;
			if (userInfo != null) {
				userID = userInfo.getUserId();
				electrictySaveVO.setCreatePerson(userID);
			}
			electrictySaveVO.setSubmitPerson(userID);
		}
		inputElectricityDao.saveElectricty(electrictySaveVO);//保存电费信息
		saveMid(electrictySaveVO);
		saveFile(electrictySaveVO);
		if(electrictySaveVO.getStatus() != 1) { //状态不是1时为保存，应该将对应的预付信息存入中间表，保存后提交的时候需要查询预付信息
			Integer auditType = electrictySaveVO.getAuditType();
			//类型不为1是基站电费
			if(auditType!=1){
				EleMidPaymentVO eleMidPayment = new EleMidPaymentVO();//构建中间表实体类
				if(electrictySaveVO.getAdpv()!=null && electrictySaveVO.getAdpv().size()>0 && Double.parseDouble(electrictySaveVO.getExpenseTotalAmount())>0) {
					for(AdvancePaymentVo adpv : electrictySaveVO.getAdpv()) {
						String expenseAmount = adpv.getExpenseAmount();//获取核销金额
						//设置中间表的id
						eleMidPayment.setId(StringUtils.getUUid());
						//设置中间表的稽核单id
						eleMidPayment.setElectricityID(electrictySaveVO.getId());
						//设置中间表的预付单id
						eleMidPayment.setAdvancePaymentID(adpv.getId());
						//设置中间表的核销金额
						eleMidPayment.setExpenseAmount(expenseAmount);
						//设置中间表创建时间
						eleMidPayment.setCreateDate(new Date());
						//更新中间表数据
						eleMidPaymentDao.add(eleMidPayment);
					}
				}
			}
		}
		
		if (electrictySaveVO.getStatus() == 1) {// 如果状态为1提交给流程（并且修改预付单中的相关预付金）
			Integer auditType = electrictySaveVO.getAuditType();
			//类型不为1是基站电费
			if(auditType!=1){
				auditWorkflowService.startFlow(id);
				//更新预付单信息
				//核销金额
				AdvancePaymentVo adppv=new AdvancePaymentVo();//构建一个核销实体类
				EleMidPaymentVO eleMidPayment = new EleMidPaymentVO();//构建中间表实体类
				if(electrictySaveVO.getAdpv()!=null && electrictySaveVO.getAdpv().size()>0 && Double.parseDouble(electrictySaveVO.getExpenseTotalAmount())>0) {
					for(AdvancePaymentVo adpv : electrictySaveVO.getAdpv()) {
						String expenseAmount = adpv.getExpenseAmount();//获取核销金额
						//增加流程中的核销金额
						Double allCancellingMoney = Double.parseDouble(adpv.getCancellingMoney())+Double.parseDouble(expenseAmount);
						adppv.setCancellingMoney(String.valueOf(allCancellingMoney));
						//减少剩余金额
						Double newSurplusMoney = Double.parseDouble(adpv.getSurplusMoney())-Double.parseDouble(expenseAmount);
						adppv.setSurplusMoney(String.valueOf(newSurplusMoney));
						//设置预付单id
						adppv.setId(adpv.getId());
						
						//设置中间表的id
						eleMidPayment.setId(StringUtils.getUUid());
						//设置中间表的稽核单id
						eleMidPayment.setElectricityID(electrictySaveVO.getId());
						//设置中间表的预付单id
						eleMidPayment.setAdvancePaymentID(adpv.getId());
						//设置中间表的核销金额
						eleMidPayment.setExpenseAmount(expenseAmount);
						//设置中间表创建时间
						eleMidPayment.setCreateDate(new Date());
						//更新中间表数据
						eleMidPaymentDao.add(eleMidPayment);
						adpvDao.updatePayment(adppv);//更新数据库信息
					}
				}
			
			}else{
				zauditWorkflowService.startFlow(id);
			}
		}
		//当用户为退网时，最后一次报账就锁定
//		if(electrictySaveVO.getRoomStatus() != null && electrictySaveVO.getRoomStatus().equals("退网")) {
//			siteInfoDao.batchUpdateRoomStatus(electrictySaveVO.getSysAccountSiteId());
//		}
		
		
		//选择不同的在网状态，计算额定功率的方式也需要不一样，在网计算在网的额定功率，退网计算退网的额定功率
		//如果用电量超标杆，则向数据库插入数据
		if(electrictySaveVO.getOverproofReasons()!=null && !electrictySaveVO.getOverproofReasons().equals("")) {
			//向稽核单中添加超标原因
			Map<String,Object> param1 = new HashMap<String,Object>();
			param1.put("id", electrictySaveVO.getId());
			param1.put("dec", electrictySaveVO.getOverproofReasons());
			inputElectricityDao.addDEC(param1);
			
			WatthourExtendVO[] vos = electrictySaveVO.getWatthourExtendVOs();
			Double allDay = 0d;//总小时数
			Double allPower = 0d;//总用电量
			for(int i = 0 ; i<vos.length ;i++) {
				//总小时数
				if(vos[i].getDayAmmeter()!=null) {
					allDay+=vos[i].getDayAmmeter()*24;
				}
				//总用电量
				if(vos[i].getTotalEleciric()!=null) {
					allPower +=Double.parseDouble(vos[i].getTotalEleciric());
				}
			}
			//查询总功率
			Double allPowerRating = 0d;//机房总功率
			if(electrictySaveVO.getIsOnline().equals("1")) {
				List<String> onlineRooms = this.checkRoomIdByAccountId(electrictySaveVO.getSysAccountSiteId(), 1, true);
				for(String roomId : onlineRooms) {
					allPowerRating += this.getPowerRatingByRoomId(roomId, 1);
				}
			}else {
				List<String> onlineRooms = this.checkRoomIdByAccountId(electrictySaveVO.getSysAccountSiteId(), 2, true);
				for(String roomId : onlineRooms) {
					allPowerRating += this.getPowerRatingByRoomId(roomId, 0);
				}
			}
			SiteInfoVO queryById = siteInfoDao.queryById(electrictySaveVO.getSysAccountSiteId());
			if(allPowerRating==0) {
				saveBenchmar(electrictySaveVO.getId(), electrictySaveVO.getSerialNumber(), ElectricityBenchmark.TYPE_POWER_RATING, allPowerRating*allDay/1000, 9999);
				//return ResultVO.newResult(200, "用电量超标20%以上", "用电量超标,超标类型为额定功率,超标值为9999%");
				this.emos(electrictySaveVO.getId(),queryById.getArea(), queryById.getAccountName(), "9999", electrictySaveVO.getOverproofReasons());
			}else if(allPowerRating*allDay/1000<allPower) {
				
				saveBenchmar(electrictySaveVO.getId(), electrictySaveVO.getSerialNumber(), ElectricityBenchmark.TYPE_POWER_RATING, allPowerRating*allDay/1000, Double.parseDouble(new java.text.DecimalFormat("#.00").format((allPower-(allPowerRating*allDay/1000))/(allPowerRating*allDay/1000))));
				this.emos(electrictySaveVO.getId(),queryById.getArea(), queryById.getAccountName(), new java.text.DecimalFormat("#.00").format((allPower-(allPowerRating*allDay/1000))/(allPowerRating*allDay/1000)), electrictySaveVO.getOverproofReasons());
			}
		}
		
		//退网状态，当用户选择退网的模式的时候，才对退网的机房数据进行锁定，锁定数据信息存在中间表中
		if(electrictySaveVO.getIsOnline()!=null && electrictySaveVO.getIsOnline().equals("2")) {
			//修改当前报账点对应的机房状态为锁定
			this.lockingRoomByAccountId(electrictySaveVO.getSysAccountSiteId(),id);
		}
		return ResultVO.success();
	}
	
	
	/**
	 * 根据机房id获取机房功率
	 * @param roomId 机房id
	 * @param isOnline 是否在网 1-在网
	 */
	public double getPowerRatingByRoomId(String roomId,int isOnline) {
		Double sumPowerRating =0d;
		if(isOnline==1){
			Double ZTOPowerRating = inputElectricityDao.getZTOPower_Online(roomId);
			if(ZTOPowerRating!=null) {
				sumPowerRating+=ZTOPowerRating;
			}
			Double ZTTNPowerRating = inputElectricityDao.getZTTNPower_Online(roomId);
			if(ZTTNPowerRating!=null) {
				sumPowerRating+=ZTTNPowerRating;
			}
			Double ZWBPowerRating = inputElectricityDao.getZWBPower_Online(roomId);
			if(ZWBPowerRating!=null) {
				sumPowerRating+=ZWBPowerRating;
			}
			Double ZWENPowerRating = inputElectricityDao.getZWENPower_Online(roomId);
			if(ZWENPowerRating!=null) {
				sumPowerRating+=ZWENPowerRating;
			}
			Double ZWLRPowerRating = inputElectricityDao.getZWLRPower_Online(roomId);
			if(ZWLRPowerRating!=null) {
				sumPowerRating+=ZWLRPowerRating;
			}
			Double ZWNPowerRating = inputElectricityDao.getZWNPower_Online(roomId);
			if(ZWNPowerRating!=null) {
				sumPowerRating+=ZWNPowerRating;
			}
		}else {
			Double ZTOPowerRating = inputElectricityDao.getZTOPower(roomId);
			if(ZTOPowerRating!=null) {
				sumPowerRating+=ZTOPowerRating;
			}
			Double ZTTNPowerRating = inputElectricityDao.getZTTNPower(roomId);
			if(ZTTNPowerRating!=null) {
				sumPowerRating+=ZTTNPowerRating;
			}
			Double ZWBPowerRating = inputElectricityDao.getZWBPower(roomId);
			if(ZWBPowerRating!=null) {
				sumPowerRating+=ZWBPowerRating;
			}
			Double ZWENPowerRating = inputElectricityDao.getZWENPower(roomId);
			if(ZWENPowerRating!=null) {
				sumPowerRating+=ZWENPowerRating;
			}
			Double ZWLRPowerRating = inputElectricityDao.getZWLRPower(roomId);
			if(ZWLRPowerRating!=null) {
				sumPowerRating+=ZWLRPowerRating;
			}
			Double ZWNPowerRating = inputElectricityDao.getZWNPower(roomId);
			if(ZWNPowerRating!=null) {
				sumPowerRating+=ZWNPowerRating;
			}
		}
		return sumPowerRating;
	}
	
	/**
	 * 锁定报账点对应的退网的机房
	 * @param accountId 报账点id
	 * @param electrictyId 稽核单id
	 */
	private void lockingRoomByAccountId(String accountId,String electrictyId) {
		List<String> roomIDs =  this.checkRoomIdByAccountId(accountId,2,false);
		//根据机房id在中间表中对相应的机房进行锁定
		if(roomIDs.size()>0) {
			for(String roomID : roomIDs) {
				//调用锁定机房的方法，锁定信息存在中间表中
				Map<String,Object> param = new HashMap<String,Object>();
				param.put("roomID", roomID);
				param.put("electrictyId", electrictyId);
				param.put("lockingDate", new Date());
				roomLockingDao.lockingRoom(param);
			}
		}
	}
	
	/**
	 * 查询报账点对应的机房id
	 * @param int status 1-在网，2-退网，3-所有
	 * @param String accountId 报账点id
	 * @param boolean isLocking 是否排除已锁定的机房
	 */
	private List<String> checkRoomIdByAccountId(String accountId,int status,boolean isLocking) {
		Map<String,String> param = new HashMap<String,String>();
		param.put("accountId", accountId);
		if(status==1) {
			param.put("status","在网");
		}else if(status==2) {
			param.put("status", "退网");
			if(isLocking) {
				param.put("isLocking", "isLocking");
			}
		}
		List<String> roomIDs = inputElectricityDao.checkRoomIdByAccountId(param);
		
		return roomIDs;
	}
	
	/**
	 * 获取报账点对应的在网和退网的机房数量
	 */
	@Override
	public RoomIsOnlineVO getAccountRoomIsOnline(String accountId) {
		List<String> onlineRooms = this.checkRoomIdByAccountId(accountId, 1, true);
		List<String> notOnlineRooms = this.checkRoomIdByAccountId(accountId, 2, true);
		RoomIsOnlineVO roomIsOnlineVO = new RoomIsOnlineVO();
		if(onlineRooms!=null && onlineRooms.size()>0) {
			roomIsOnlineVO.setOnlineRoomNum(onlineRooms.size());//在网未锁定的机房数量
		}
		if(notOnlineRooms!=null && notOnlineRooms.size()>0) {
			roomIsOnlineVO.setNoOnLineRoomNum(notOnlineRooms.size());//退网但未锁定的机房数量
		}
		return roomIsOnlineVO;
	}
	
	
	@Override
	public String emos(String id,String cityName,String accountSiteName,String cPowerNum,String cPowerDec){
//		String id = getPara("id");
//		String zuis=getPara("val");
//		Record findById = Db.findById("tower_account", id);
//		if(findById!=null){
//			setAttr("message", "该单子已推送EMOS系统112");
//			renderJson();
//			return;
//		}
		
		
//		if(findById.getStr("is_emos")!=null&&findById.getStr("is_emos").equals("1")){
//			setAttr("message", "该单子已推送EMOS系统");
//			renderJson();
//			return;
//		}
		
    try {  
    	StringBuffer stringBuffer=new StringBuffer();
    	String str = cityName;
    	if(str.endsWith("市")){
    		str=str.substring(0, str.length()-1);
    	}else if(str.indexOf("自治州")>=0){
    		str=str.substring(0,str.length()-3);
    	}
    	System.out.println(str+"----------");
    	stringBuffer.append("<opDetail>");
    	stringBuffer.append("<recordInfo><fieldInfo>");
    	stringBuffer.append("<fieldChName>模型名称</fieldChName>");	
    	stringBuffer.append("<fieldEnName>zh_en</fieldEnName>");
    	stringBuffer.append("<fieldContent>YDJHAudit</fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>资源勘误工单主题</fieldChName>");	
    	stringBuffer.append("<fieldEnName>title</fieldEnName>");
    	stringBuffer.append("<fieldContent>四川省"+str+"电费稽核系统-超额定功率标杆工单</fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>工单类型</fieldChName>");	
    	stringBuffer.append("<fieldEnName>isNetSheet</fieldEnName>");
    	stringBuffer.append("<fieldContent>4</fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>资源唯一标识</fieldChName>");	
    	stringBuffer.append("<fieldEnName>ind_id</fieldEnName>");
    	stringBuffer.append("<fieldContent></fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>地市名称</fieldChName>");	
    	stringBuffer.append("<fieldEnName>region_name</fieldEnName>");
    	stringBuffer.append("<fieldContent>"+str+"</fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>网元名称</fieldChName>");
    	stringBuffer.append("<fieldEnName>zh_label</fieldEnName>");
    	stringBuffer.append("<fieldContent>"+accountSiteName+"</fieldContent>");//报账点名称
    	stringBuffer.append("</fieldInfo>");
    	
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>备注</fieldChName>");	
    	stringBuffer.append("<fieldEnName>re_mark</fieldEnName>");
    	
    	stringBuffer.append("<fieldContent>"+"超标值："+cPowerNum+",超标原因："+cPowerDec+"</fieldContent>");//超标杆内容和原因
    	stringBuffer.append("</fieldInfo>");
    	
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>状态</fieldChName>");	
    	stringBuffer.append("<fieldEnName>status</fieldEnName>");
    	stringBuffer.append("<fieldContent>新建派发</fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>故障工单编号</fieldChName>");	
    	stringBuffer.append("<fieldEnName>falultSheetId</fieldEnName>");
    	stringBuffer.append("<fieldContent></fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>故障工单主题</fieldChName>");	
    	stringBuffer.append("<fieldEnName>faulltSheetTitle</fieldEnName>");
    	stringBuffer.append("<fieldContent></fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>需要进行勘误的属性名称</fieldChName>");	
    	stringBuffer.append("<fieldEnName>embedded_info</fieldEnName>");
    	stringBuffer.append("<fieldContent></fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	stringBuffer.append("<fieldInfo>");
    	stringBuffer.append("<fieldChName>属性修改前值</fieldChName>");	
    	stringBuffer.append("<fieldEnName>old_name</fieldEnName>");
    	stringBuffer.append("<fieldContent></fieldContent>");
    	stringBuffer.append("</fieldInfo>");
    	stringBuffer.append("</recordInfo></opDetail>");
    	String string = stringBuffer.toString();
//		String string2 = new String(string.getBytes(),"GB2312");
		
		SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String format = simpleDateFormat.format(new Date());
		format=new String(format.getBytes(),"GB2312");
//		System.out.println(string2);
		System.out.println(format);
//    	stringBuffer.append("<fieldInfo>");
//    	stringBuffer.append("<fieldChName>资源唯一标识</fieldChName>");	
//    	stringBuffer.append("<<fieldEnName>ind_id</fieldEnName>");
//    	stringBuffer.append("<fieldChName></fieldChName>");
//    	stringBuffer.append("</fieldInfo>");
    	

    	

//        String endpoint = "http://10.101.214.121:9080/eoms35/services/InterCorrectSheet?wsdladdNewSheet";  
     // http://10.101.214.121:9080/eoms35/services/InterCorrectSheet?wsdladdNewSheet/测试
        // http://10.101.214.113:8080/eoms35/services/InterCorrectSheet?wsdladdNewSheet/正式
		String endpoint = "http://10.101.214.121:9080/eoms35/services/InterCorrectSheet?wsdladdNewSheet";
		org.apache.axis.client.Service service1 = new org.apache.axis.client.Service();  
        Call call = (Call) service1.createCall();  
        call.setTargetEndpointAddress(endpoint);  
        // WSDL里面描述的接口名称(要调用的方法)  
        call.setOperationName("addNewSheet");  
        // 接口方法的参数名, 参数类型,参数模式  IN(输入), OUT(输出) or INOUT(输入输出)  
        call.addParameter("serSupplier", XMLType.XSD_STRING, ParameterMode.IN);  
        call.addParameter("serCaller", XMLType.XSD_STRING, ParameterMode.IN);
        call.addParameter("callerPwd", XMLType.XSD_STRING, ParameterMode.IN);  
        call.addParameter("callTime", XMLType.XSD_STRING, ParameterMode.IN); 
        call.addParameter("opDetail", XMLType.XSD_STRING, ParameterMode.IN);  
//        call.addParameter("companyFlag", XMLType.XSD_STRING, ParameterMode.IN); 
//        call.addParameter("consignOrderNo", XMLType.XSD_STRING, ParameterMode.IN);  
//        call.addParameter("orderNo", XMLType.XSD_STRING, ParameterMode.IN); 
        // 设置被调用方法的返回值类型  
        call.setReturnType(XMLType.XSD_STRING);  
        //设置方法中参数的值  
        Object[] paramValues = new Object[] {"EOMS","TowerAudit","",format,string}; 
        // 给方法传递参数，并且调用方法  
        String result = (String) call.invoke(paramValues);
        System.out.println("result is " + result);
        String job_num = "";
        String failed_desc = "";
        String electricity_id = id;
        String[] split1 = result.split(";",-1);
        for(String str1 : split1) {
        	String[] split2 = str1.split("=",-1);
        	if(split2[0].equals("sheetNo")) {
        		job_num = split2[1];
        	}else {
        		failed_desc = split2[1];
        	}
        }
        EleCpowerJobVO eleCpowerJobVO = new EleCpowerJobVO();
        eleCpowerJobVO.setElectricity_id(electricity_id);
        eleCpowerJobVO.setJob_num(job_num);
        eleCpowerJobVO.setCreate_job_time(new Date());
        eleCpowerJobVO.setType(1);
        eleCpowerJobVO.setFiled_desc(failed_desc);
        
        if(!job_num.equals("")) {//推送数据成功的情况
        	jobDao.insertByJobNum(eleCpowerJobVO);
        }else {//推送数据有错误，报错的情况
        	jobDao.insertByDescription(eleCpowerJobVO);
        }
        return result;
//        	}
        	
//        }else{
//        	String replace = split[1].replace("errList=","");
//        	setAttr("message",replace);
//			renderJson();
//			return;
//        }
//         
    } catch (Exception e) {  
        e.printStackTrace(); 
        return "错误";
    } 
}

	//查看是否有同一报账点的信息存在
	private String checkSiteRepeatSubmit(String siteID,ElectrictySaveVO electrictySaveVO) {
		//获得稽核类型
		Integer auditType = electrictySaveVO.getAuditType();
		if(auditType!=1){
			List<WatthourExtendVO> watthourExtendVOs = inputElectricityDao.queryElectricityBySiteID(siteID);
			WatthourExtendVO[] os = electrictySaveVO.getWatthourExtendVOs();
			for (WatthourExtendVO watthourExtendVO : watthourExtendVOs) {
				// 状态（0.已保存1.已提交 2.已撤销 3.待推送 4.已推送)
				Integer status = watthourExtendVO.getStatus();
				if (status ==1||status==3||status==4) {
//					return "已有同一报账点的报销单处于已提交或待推送状态！";
					// 如果电费起始日期小于数据库归属日期，或者大于当前日期，则不允许再次提交
					Date reimbursementDate = null;
					// 归属日期(电费最后一次报销的归属日期(起始日期))
					if (watthourExtendVO.getReimbursementDate() != null) {
						//电费最后一次报销的起始时间 
						reimbursementDate = watthourExtendVO.getReimbursementDate();
					}
					//这次提交结束时间(数据库里的)
					Date belongEndTime=null;
					//这次提交开始时间
					Date belongStartTime2=null;
					if(watthourExtendVO.getBelongEndTime() != null){
						belongEndTime=watthourExtendVO.getBelongEndTime();
						belongStartTime2=watthourExtendVO.getBelongStartTime();
						if(belongEndTime!=null & belongStartTime2!=null){
							for(WatthourExtendVO os1:os){
								//最新一次的开始时间
								Date belongStartTime = os1.getBelongStartTime();
								//最新一次的结束时间
								Date belongEndTime2 = os1.getBelongEndTime();
								if(belongStartTime!=null & belongEndTime2!=null){
									if(belongEndTime2.getTime()<belongStartTime2.getTime()){
										
									}else{
										if(os1.getBelongStartTime().getTime()<=belongEndTime.getTime()){
											return "时间有冲突，此次报销中有部份时间已经在此报账点的报销流程中";
										}
										if(os1.getBelongStartTime().getTime()>new Date().getTime()){
											return "报销提交开始时间大与当前时间";
										}
										if(os1.getBelongEndTime().getTime()>new Date().getTime()){
											return "报销提交结束时间大与当前时间";
										}
									}
								}
							}
						}
					}
//					// 这次电费起始日期
//					if (watthourExtendVO.getBelongStartTime() != null) {
//						//这次电费的起始时间
//						Date belongStartTime = watthourExtendVO.getBelongStartTime();
//						//如果这次电费的开始时间小于电费报销最后一闪时间或者大于当前日期
//						if (belongStartTime.getTime() < reimbursementDate.getTime()
//								|| belongStartTime.getTime() > new Date().getTime()) {
//							return "电费起始日期小于数据库归属日期，或者大于当前日期,不允许再次提交!";
//						}
//					}
				}
			}
			if(watthourExtendVOs.size()==0){
				for(WatthourExtendVO os1:os){
					if(os1.getBelongStartTime()!=null){
						if(os1.getBelongStartTime().getTime()>new Date().getTime()){
							return "报销提交开始时间大与当前时间";
						}
						if(os1.getBelongEndTime().getTime()>new Date().getTime()){
							return "报销提交结束时间大与当前时间";
						}
					}
			}
			}
			return null;
		}else{
			List<WatthourExtendVO> watthourExtendVOs = inputElectricityDao.queryZElectricityBySiteID(siteID);
			WatthourExtendVO[] os = electrictySaveVO.getWatthourExtendVOs();
			for (WatthourExtendVO watthourExtendVO : watthourExtendVOs) {
				// 状态（0.已保存1.已提交 2.已撤销 3.待推送 4.已推送)
				Integer status = watthourExtendVO.getStatus();
				if (status ==1||status==3||status==4) {
//					return "已有同一报账点的报销单处于已提交或待推送状态！";
					// 如果电费起始日期小于数据库归属日期，或者大于当前日期，则不允许再次提交
					Date reimbursementDate = null;
					// 归属日期(电费最后一次报销的归属日期(起始日期))
					if (watthourExtendVO.getReimbursementDate() != null) {
						//电费最后一次报销的起始时间 
						reimbursementDate = watthourExtendVO.getReimbursementDate();
					}
					//这次提交结束时间(数据库里的)
					Date belongEndTime=null;
					//这次提交开始时间
					Date belongStartTime2=null;
					if(watthourExtendVO.getBelongEndTime() != null){
						belongEndTime=watthourExtendVO.getBelongEndTime();
						belongStartTime2=watthourExtendVO.getBelongStartTime();
						if(belongEndTime!=null & belongStartTime2!=null){
							for(WatthourExtendVO os1:os){
								//最新一次的开始时间
								Date belongStartTime = os1.getBelongStartTime();
								//最新一次的结束时间
								Date belongEndTime2 = os1.getBelongEndTime();
								if(belongStartTime!=null & belongEndTime2!=null){
									if(belongEndTime2.getTime()<belongStartTime2.getTime()){
										
									}else{
										if(os1.getBelongStartTime().getTime()<=belongEndTime.getTime()){
											return "时间有冲突，此次报销中有部份时间已经在此报账点的报销流程中";
										}
										if(os1.getBelongStartTime().getTime()>new Date().getTime()){
											return "报销提交开始时间大与当前时间";
										}
										if(os1.getBelongEndTime().getTime()>new Date().getTime()){
											return "报销提交结束时间大与当前时间";
										}
									}
								}
								
							}
						}
						
					}
//					// 这次电费起始日期
//					if (watthourExtendVO.getBelongStartTime() != null) {
//						//这次电费的起始时间
//						Date belongStartTime = watthourExtendVO.getBelongStartTime();
//						//如果这次电费的开始时间小于电费报销最后一闪时间或者大于当前日期
//						if (belongStartTime.getTime() < reimbursementDate.getTime()
//								|| belongStartTime.getTime() > new Date().getTime()) {
//							return "电费起始日期小于数据库归属日期，或者大于当前日期,不允许再次提交!";
//						}
//					}
				}
			}
			if(watthourExtendVOs.size()==0){
				for(WatthourExtendVO os1:os){
					if(os1.getBelongStartTime()!=null){
						if(os1.getBelongStartTime().getTime()>new Date().getTime()){
							return "报销提交开始时间大与当前时间";
						}
						if(os1.getBelongEndTime().getTime()>new Date().getTime()){
							return "报销提交结束时间大与当前时间";
						}
					}
			}
			}
			return null;
		}
	}

	// 保存报站点和供应商和合同的关联关系
	private void saveMid(ElectrictySaveVO electrictySaveVO) {
		if (StringUtils.isNotBlank(electrictySaveVO.getSysSupplierID())) {
			SiteMidSupplierInfo siteMidSupplierInfo = new SiteMidSupplierInfo();
			siteMidSupplierInfo.setId(StringUtils.getUUid());
			siteMidSupplierInfo.setAccountSiteId(electrictySaveVO.getSysAccountSiteId());
			siteMidSupplierInfo.setSupplierId(electrictySaveVO.getSysSupplierID());
			List<SiteMidSupplierInfo> supplierInfos = Lists.newArrayList();
			supplierInfos.add(siteMidSupplierInfo);
			siteInfoDao.batchDeleteMidSupplier(supplierInfos);
			siteInfoDao.batchSaveMidForSupplier(supplierInfos);
		}
		if (electrictySaveVO.getElectrictyMidInvoices() != null
				&& electrictySaveVO.getElectrictyMidInvoices().length > 0) {
			inputElectricityDao.deleteEleMidInvoiceByEleID(electrictySaveVO.getId());
			for (ElectrictyMidInvoice electrictyMidInvoice : electrictySaveVO.getElectrictyMidInvoices()) {
				electrictyMidInvoice.setId(StringUtils.getUUid());
				electrictyMidInvoice.setSysElectricityId(electrictySaveVO.getId());
				inputElectricityDao.saveEleMidInvoice(electrictyMidInvoice);
			}
		}
	}

	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 修改电费
	 */
	@Override
	public void updateElectricty(ElectrictySaveVO electrictySaveVO) {

		if(electrictySaveVO.getTrueStatus()==0 || electrictySaveVO.getTrueStatus()==2) {
			//保存状态下，只修改中间表，不改流程中的核销金
			if(electrictySaveVO.getAdpv()!=null && electrictySaveVO.getAdpv().size()>0) {
				
				EleMidPaymentVO eleMidPayment = new EleMidPaymentVO();//构建中间表实体类
				for(AdvancePaymentVo adpv : electrictySaveVO.getAdpv()) {
					//设置中间表的稽核单id
					eleMidPayment.setElectricityID(electrictySaveVO.getId());
					//设置中间表的预付单id
					eleMidPayment.setAdvancePaymentID(adpv.getId());
					//设置中间表的核销金额
					eleMidPayment.setExpenseAmount(adpv.getExpenseAmount());
					
					if(adpv.getExpenseAmount()==null || adpv.getExpenseAmount().equals("") || Double.parseDouble(adpv.getExpenseAmount())==0) {
						eleMidPaymentDao.deleteEleMidPaymentByEIdAndPId(eleMidPayment);//为0直接删除
					}else {
						eleMidPaymentDao.updateEleMidPaymentByEIdAndPId(eleMidPayment);//不为0则修改
					}
					
				}
				
			}
		}else {
			//流程中状态下，既修改中间表，又改流程中的核销金
			if(electrictySaveVO.getAdpv()!=null && electrictySaveVO.getAdpv().size()>0) {
				
				AdvancePaymentVo adppv=new AdvancePaymentVo();//构建一个核销实体类
				EleMidPaymentVO eleMidPayment = new EleMidPaymentVO();//构建中间表实体类
				for(AdvancePaymentVo adpv : electrictySaveVO.getAdpv()) {
					//设置中间表的稽核单id
					eleMidPayment.setElectricityID(electrictySaveVO.getId());
					//设置中间表的预付单id
					eleMidPayment.setAdvancePaymentID(adpv.getId());
					//设置中间表的核销金额
					eleMidPayment.setExpenseAmount(adpv.getExpenseAmount());
					
					//查询原来中间表的核销金额用于计算
					String old_expenseAmount = eleMidPaymentDao.getExpenseAmountByEIdAndPId(eleMidPayment);
					//增加剩余金额
					Double newSurplusMoney = Double.parseDouble(adpv.getSurplusMoney()) + Double.parseDouble(old_expenseAmount);
					adppv.setSurplusMoney(String.valueOf(newSurplusMoney));
					//设置预付单id
					adppv.setId(adpv.getId());
					//减少流程中的核销金额
					Double allCancellingMoney = Double.parseDouble(adpv.getCancellingMoney()) - Double.parseDouble(old_expenseAmount);
					adppv.setCancellingMoney(String.valueOf(allCancellingMoney));
					adpvDao.updatePayment(adppv);//更新数据库信息
					
					
					//中间 表的数据要后更新，先要取出之前的核销金额进行计算
					if(adpv.getExpenseAmount()==null || adpv.getExpenseAmount().equals("") || Double.parseDouble(adpv.getExpenseAmount())==0) {
						eleMidPaymentDao.deleteEleMidPaymentByEIdAndPId(eleMidPayment);//为0直接删除
					}else {
						eleMidPaymentDao.updateEleMidPaymentByEIdAndPId(eleMidPayment);//不为0则修改
					}
				}
				
			}
		}
		electrictySaveVO.setUpdateDate(new Date());
		electrictySaveVO.setStatus(0);// 修改的情况都改为以保存
		System.out.println(electrictySaveVO.getContractID()+"==="+electrictySaveVO.getSysRgID());
		inputElectricityDao.updateElectricty(electrictySaveVO);//修改电费
		String id = electrictySaveVO.getId();
		List<String> fileIDs = sysMiddleFileDao.findFilesID(id);
		sysMiddleFileDao.deleteMiddleFiles(id);
		saveFile(electrictySaveVO);
		WatthourExtendVO[] watthourMeterVOs = electrictySaveVO.getWatthourExtendVOs();
		List<String> watthourExtendIDs = watthourMeterService.findWatthourExtendIDs(electrictySaveVO.getId());
		watthourMeterService.deleteMiddleWatthour(electrictySaveVO.getId());
		if (watthourExtendIDs != null && watthourExtendIDs.size() > 0) {
			watthourMeterService.deleteWatthourExtends(watthourExtendIDs);
		}
		if (watthourMeterVOs != null && watthourMeterVOs.length > 0) {
			watthourMeterService.saveWatthourExtend(watthourMeterVOs, electrictySaveVO.getId());// 保存电表信息
		}
		saveMid(electrictySaveVO);
	}
	
	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 模糊查询站点信息
	 */
	@Override
	public PageUtil<SiteInfoVO> queryByBlurred(String queryData, Integer pageNo, Integer pageSize, UserVo userInfo) {
		String countyId = null;
		String cityId = null;
		if (userInfo != null) {
			Integer level = userInfo.getUserLevel();
			if (level == 1) {// 市领导
				cityId = userInfo.getCity() + "";
			} else if (level > 1) {// 区县领导
				countyId = userInfo.getCounty() + "";
			}
		}
		PageUtil<SiteInfoVO> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		//这里电表模糊数据查询添加
		String meterCode = "";
		siteInfoService.querySite(pageUtil, queryData, cityId, countyId,meterCode);
		return pageUtil;
	}

	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 修改电费状态
	 */
	@Override
	public ResultVO updateStatus(String id, Integer status) {
		if (id == null || "".equals(id) || status == null) {
			return ResultVO.failed("ID或状态值不能为空！");
		}
		Map<String, String> paraMap = Maps.newHashMap();
		paraMap.put("id", id);
		paraMap.put("status", status + "");
		inputElectricityDao.updateStatus(paraMap);
		return ResultVO.success();
	}

	/**
	 * @param : ids 电费IDs
	 * @return :
	 * @throws
	 * @Description: 获取电表信息
	 */
	@Override
	public List<Map<String, Object>> queryElectricity(List<String> ids) {
		List<Map<String, Object>> objects = Lists.newArrayList();
		if (ids.size() > 0) {
			objects = watthourMeterDao.findExtendBySiteIDs(ids);
		}
		return objects;
	}

	public void saveFile(ElectrictySaveVO electrictySaveVO) {
		if (electrictySaveVO.getAttachmentId() != null && electrictySaveVO.getAttachmentId().length > 0) {
			List<SysMidlleFile> sysMidlleFiles = Lists.newArrayList();
			for (String fileID : electrictySaveVO.getAttachmentId()) {
				SysMidlleFile sysMidlleFile = new SysMidlleFile();
				sysMidlleFile.setId(StringUtils.getUUid());
				sysMidlleFile.setBusinessId(electrictySaveVO.getId());
				sysMidlleFile.setSysFileId(fileID);
				sysMidlleFiles.add(sysMidlleFile);
			}
			sysMiddleFileDao.saveMiddelFile(sysMidlleFiles);
		}
	}

	@Override
    public List<ElectricityBenchmarkCheckVO> check(List<String> electricityIds, int type) {
        if(electricityIds == null || electricityIds.isEmpty()){
            return new ArrayList<>();
        }

        List<ElectricityWatthourEntity> electricityWatthourEntities;
        if(type == 1){
			electricityWatthourEntities = inputElectricityDao.findElectricityWatthourByEleIds(electricityIds);
		} else {
        	electricityWatthourEntities = towerElectricityDao.findElectricityWatthourByEleIds(electricityIds);
		}
        if(electricityWatthourEntities == null || electricityWatthourEntities.isEmpty()){
            return new ArrayList<>();
        }

        List<String> siteIds = StreamUtil.getProps(electricityWatthourEntities, ElectricityWatthourEntity::getSiteId);
		Map<String, PowerRatingVO> powerRatingVOMap = getPowerRatingBySite(siteIds, type);
		Map<String, SmartMeterStandard> smartMeterVOMap = querySmartMeterInfo(siteIds);
		Map<String, SwitchPowerStandard> switchPowerVOMap = querySwitchPowerInfo(siteIds);
		Map<String, ElectricityBO> electricityBOMap = getElectricityByEIds(electricityWatthourEntities);
		List<ElectricityBenchmarkCheckVO> result = new ArrayList<>();
        for( String electricityId : electricityBOMap.keySet()){
			ElectricityBO electricityBO = electricityBOMap.get(electricityId);

//当前报账点的额定功率----------1
			PowerRatingVO currentSitePR = powerRatingVOMap.get(electricityBO.getSiteId());
			//如果当前报账点的额定功率信息不存在，则认为当前稽核单超标杆，并且将超标杆比例设置为9999
			if(currentSitePR == null){
				ElectricityBenchmarkCheckVO item = new ElectricityBenchmarkCheckVO(electricityId,
						electricityBO.getElectricitySN(),
						"额定功率",
						9999);
				result.add(item);
				continue;
			}

			double benchmarkElectricity = currentSitePR.getBenchmarkElectricity(electricityBO.getDateRange());
			double overProportion = currentSitePR.getOverPowerRatingProportion(electricityBO.getTotalElectricity(), electricityBO.getDateRange());
			//已经超标杆
			if(overProportion > 0){
				//存储到数据库
				saveBenchmar(electricityId, electricityBO.getElectricitySN(), ElectricityBenchmark.TYPE_POWER_RATING, benchmarkElectricity, overProportion);

				//返回给页面
				ElectricityBenchmarkCheckVO item = new ElectricityBenchmarkCheckVO(electricityId,
						electricityBO.getElectricitySN(),
						"额定功率",
						overProportion);
				result.add(item);
				continue;
			}
			//如果是塔维，则只检测额定功率
			if(type == 2) {
				continue;
			}
			
//智能电表标杆值 ----------------2
			SmartMeterStandard smartMeterStandard = smartMeterVOMap.get(electricityBO.getSiteId());
			//查询不到智能电表，不能向额定功率那样处理，因为，很可能，当前站点确实没有智能电表
			if(smartMeterStandard == null){
//				ElectricityBenchmarkCheckVO item = new ElectricityBenchmarkCheckVO(electricityId,
//						electricityBO.getElectricitySN(),
//						"智能电表",
//						9999);
//				result.add(item);
				continue;
			}

			double benchmarkSmartMeter = smartMeterStandard.getBenchmarkSmartMeter(electricityBO.getDateRange());
			double overSmartMeter = smartMeterStandard.getOverSmartMeter(electricityBO.getTotalElectricity(), electricityBO.getDateRange());
			//已经超标杆
			if(overSmartMeter > 0){
				//存储到数据库
				saveBenchmar(electricityId, electricityBO.getElectricitySN(), ElectricityBenchmark.TYPE_SMART_METER, benchmarkSmartMeter, overSmartMeter);

				//返回给页面
				ElectricityBenchmarkCheckVO item = new ElectricityBenchmarkCheckVO(electricityId,
						electricityBO.getElectricitySN(),
						"智能电表",
						overSmartMeter);
				result.add(item);
                continue;
			}
			
//开关电源标杆值 -------------3
			SwitchPowerStandard switchPowerStandard = switchPowerVOMap.get(electricityBO.getSiteId());
			if(switchPowerStandard == null){
				//查询不到开关电源，不能向额定功率那样处理，因为，很可能，当前站点确实没有开关电源数据
//				ElectricityBenchmarkCheckVO item = new ElectricityBenchmarkCheckVO(electricityId,
//						electricityBO.getElectricitySN(),
//						"开关电源",
//						9999);
//				result.add(item);
				continue;
			}

			double benchmarkSwitchPower = switchPowerStandard.benchmarkSwitchPower(electricityBO.getDateRange());
			double overSwitchPower = switchPowerStandard.getOverSwitchPower(electricityBO.getTotalElectricity(), electricityBO.getDateRange());
			//已经超标杆
			if(overSwitchPower > 0){
				//存储到数据库
				saveBenchmar(electricityId, electricityBO.getElectricitySN(), ElectricityBenchmark.TYPE_SWITCH_POWER, benchmarkSwitchPower, overSwitchPower);
				//返回给页面
				ElectricityBenchmarkCheckVO item = new ElectricityBenchmarkCheckVO(electricityId,
						electricityBO.getElectricitySN(),
						"开关电源",
						overSwitchPower);
				result.add(item);
			}
		}

		return result;
    }
	/**
	 * 根据稽核单ID，获取稽核单的电量
	 * @param electricityWatthourEntities 稽核单电表列表
	 * @return
	 */
	private Map<String, ElectricityBO> getElectricityByEIds(List<ElectricityWatthourEntity> electricityWatthourEntities){
		//根据稽核单ID进行分组
		Map<String, List<ElectricityWatthourEntity>> electricityWatthourMap =
				StreamUtil.convertListToMapList(electricityWatthourEntities, ElectricityWatthourEntity::getElectricityId);

		Map<String, ElectricityBO> result = new HashMap<>();
		for( String electricityId : electricityWatthourMap.keySet()) {
			List<ElectricityWatthourEntity> list = electricityWatthourMap.get(electricityId);
			ElectricityWatthourEntity ewe = list.get(0);
			String siteId = ewe.getSiteId();
			//电表的起止日期是强制相同的，所以，时间范围可以从第一个元素中获取
			int dateRange = ewe.getDateRange();
			double totalElectricity = list.stream()
					.mapToDouble(ElectricityWatthourEntity::getTotalElecitity)
					.sum();

			result.put(electricityId, new ElectricityBO(electricityId, ewe.getElectricitySN(), siteId, dateRange, totalElectricity));
		}

		return result;
	}
	/**
	 * 根据报账点ID，获取--额定功率标杆值
	 * @param siteIds 报账点ID列表
	 * @return
	 */
	private Map<String, PowerRatingVO> getPowerRatingBySite(List<String> siteIds, int type){
		List<PowerRatingVO> powerRatingVOS;
		if(type == 1){
			powerRatingVOS = benchmarkService.getPowerRating(siteIds);
		} else {
			powerRatingVOS = benchmarkService.getTowerPowerRating(siteIds);
		}
		//查询不到额定功率
		if(powerRatingVOS == null || powerRatingVOS.isEmpty()){
			return new HashMap<>();
		}
		//根据报账点ID进行分组
		return StreamUtil.convertListToMap(powerRatingVOS, PowerRatingVO::getSiteId);
	}
	
	/**
	 * 根据报账点ID，获取--智能电表标杆值
	 * @param siteIds 报账点ID列表
	 * @return
	 * @throws ParseException 
	 */
	private Map<String, SmartMeterStandard> querySmartMeterInfo(List<String> siteIds){
		
		List<SmartMeterStandard> list = null;
		Map<String, Object> paramMap = Maps.newHashMap();
		paramMap.put("siteName", request.getParameter("siteName"));
		paramMap.put("cityId", request.getParameter("cityId"));
		paramMap.put("countyId", request.getParameter("countyId"));
		paramMap.put("startDate", request.getParameter("startDate"));
		paramMap.put("endDate", request.getParameter("endDate"));
		
		StringBuilder result=new StringBuilder();
        boolean flag=false;
        for (String string : siteIds) {
            if (flag) {
                result.append(",");
            }else {
                flag=true;
            }
         result.append(string);
        }
        paramMap.put("siteIds", result.toString());

		PageUtil<SmartMeterStandard> page = new PageUtil<SmartMeterStandard>();
		if (paramMap != null && !paramMap.isEmpty()) {
			page.setObj(paramMap);
		}
		page.setObj(paramMap);
     
			try {
				benchmarkService.querySmartMeterStandard(page);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		
		list = page.getResults();
		//查询不到额定功率
		if(list == null || list.isEmpty()){
			return new HashMap<>();
		}
		//根据报账点ID进行分组
		return StreamUtil.convertListToMap(StreamUtil.distinct(list,SmartMeterStandard::getSiteId), SmartMeterStandard::getSiteId);
	}
	
	/**
	 * 根据报账点ID，获取--开关电源标杆值
	 * @param siteIds 报账点ID列表
	 * @return
	 * @throws ParseException 
	 */
	private Map<String, SwitchPowerStandard> querySwitchPowerInfo(List<String> siteIds){
		
		List<SwitchPowerStandard> list =null;
		
		Map<String, Object> paramMap = Maps.newHashMap();
		paramMap.put("siteName", request.getParameter("siteName"));
		paramMap.put("cityId", request.getParameter("cityId"));
		paramMap.put("countyId", request.getParameter("countyId"));
		
		 StringBuilder result=new StringBuilder();
	        boolean flag=false;
	        for (String string : siteIds) {
	            if (flag) {
	                result.append(",");
	            }else {
	                flag=true;
	            }
	         result.append(string);
	        }
		paramMap.put("siteIds", result.toString());

		PageUtil<SwitchPowerStandard> page = new PageUtil<SwitchPowerStandard>();
		if (paramMap != null && !paramMap.isEmpty()) {
			page.setObj(paramMap);
		}
		page.setObj(paramMap);
			benchmarkService.querySwitchPowerStandard(page);
		
		list = page.getResults();
		//查询不到额定功率
		if(list == null || list.isEmpty()){
			return new HashMap<>();
		}
		//根据报账点ID进行分组
		return StreamUtil.convertListToMap(StreamUtil.distinct(list,SwitchPowerStandard::getSiteId), SwitchPowerStandard::getSiteId);
	}
	/**
	 * 保存超标杆信息
	 * @param electricityId 稽核单ID
	 * @param electricitySN 稽核单流水号
	 * @param type 超标杆类型
	 * @param benchmarkElectricity 超标杆电量
	 * @param overProportion 超标杆比例
	 */
    private void saveBenchmar(String electricityId, String electricitySN, int type, double benchmarkElectricity, double overProportion){
		//存储到数据库
		ElectricityBenchmark electricityBenchmarkEntity = new ElectricityBenchmark();
		electricityBenchmarkEntity.setElectricityId(electricityId);
		electricityBenchmarkEntity.setElectricitySN(electricitySN);
		electricityBenchmarkEntity.setType(type);
		electricityBenchmarkEntity.setBenchmark(benchmarkElectricity);
		electricityBenchmarkEntity.setOverProportion(overProportion);
		benchmarkDao.deleteElectricityBenchmark(electricityId);
		benchmarkDao.saveElectricityBenchmark(electricityBenchmarkEntity);
	}

	@Override
	public ElectrictyVO getCpBySerNum(String seid) {
		ElectrictyVO cpBySerNum = inputElectricityDao.getCpBySerNum(seid);
		return cpBySerNum;
	}

	@Override
	public ElectrictyVO getCpById(String id) {
		ElectrictyVO cpById = inputElectricityDao.getCpById(id);
		return cpById;
	}

	@Override
	public List<ElectrictyVO> getall(Map<String,Integer> map) {
		List<ElectrictyVO> getall = inputElectricityDao.getall(map);
		return getall;
	}
	
	@Override
	public List<ElectrictyVO> getZall() {
		List<ElectrictyVO> getall = inputElectricityDao.getZall();
		return getall;
	}
	
	@Override
	public List<Map<String,Object>> getExcelByEleId(String id){
		List<Map<String,Object>> list = inputElectricityDao.getExcelByEleId(id);
		return list;
	}

	@Override
	public void upSiteById(Map<String, Object> map) {
		inputElectricityDao.upSiteById(map);
	}

	@Override
	public void addDEC(Map<String, Object> map) {

		inputElectricityDao.addDEC(map);
	}

	@Override
	public void delupfile(String id) {
		inputElectricityDao.delupfile(id);	
	}

	@Override
	public String getaccoutsiteidbyeleid(String id) {
		String getaccoutsiteidbyeleid = inputElectricityDao.getaccoutsiteidbyeleid(id);
		return getaccoutsiteidbyeleid;
	}

	@Override
	public WatthourMeterVO getnewtime(String id) {
		WatthourMeterVO getnewtime = inputElectricityDao.getnewtime(id);
		return getnewtime;
	}
	@Override
	public void delSEMS(Map<String,Object> map,ElectricitySubmitVO electricitySubmitVO) {
		//移出中间表记录
		inputElectricityDao. delSEMS(map);
		
		
		//改变报销单的金额
		String id = String.valueOf(map.get("submitID"));
		electricitySubmitVO.setId(id);
		//获取稽核单内容（钱）
		List<String> ids = new ArrayList<String>();
		ids.add(String.valueOf(map.get("electricityID")));
		List<ElectrictyVO> electrictyVOs = findSiteIdByEid(ids);
		 //此处初始化总金额的数据应查询原先报销单的数据
        ElectricitySubmitVO oldElectricitySubmitVO = electricitySubmitDao.queryById(id);
        
        Double amount = Double.parseDouble(oldElectricitySubmitVO.getTotalAmount());
        Double tax = Double.parseDouble(oldElectricitySubmitVO.getTaxAmount());
        
        for (ElectrictyVO electrictyVO : electrictyVOs) {
            String totalAmount = electrictyVO.getTotalAmount();
            if (totalAmount != null) {
                amount -= Double.parseDouble(totalAmount);
            }
            String taxAmount = electrictyVO.getTaxAmount();
            if (taxAmount != null) {
                tax -= Double.parseDouble(taxAmount);
            }
        }
        electricitySubmitVO.setTaxAmount(tax + "");
        electricitySubmitVO.setTotalAmount(amount + "");
        electricitySubmitDao.updateEleSubmit_1(electricitySubmitVO);//保存电费提交表
		
		
		
		//改变稽核单状态为3
		Map<String, String> paraMap = Maps.newHashMap();
		paraMap.put("id", String.valueOf(map.get("electricityID")));
		paraMap.put("status", "2");
		inputElectricityDao.updateStatus(paraMap);
	}
	
	@Override
	public boolean checkSubmitIsOneyOne(String submitID) {
		Map<String , Object> pre = new HashMap<String,Object>();
		pre.put("submitID", submitID);
		long isTrue = inputElectricityDao.checkSubmitIsOneyOne(pre);
		if(isTrue==1) {
			return true;
		}else {
			return false;
		}
	}
	
	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 查询老数据库稽核单数据
	 */
	@Override
	public List<String> getOldEle(ElectricityFlowVo ele) {
		List<String> list = inputElectricityDao.getOldEle(ele);
		return list;
	}

}
