package com.audit.modules.payment.service.impl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.dao.InputElectricityDao;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.payment.dao.AdvancePaymentDao;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.payment.entity.ElectricityFlowVo;
import com.audit.modules.payment.entity.Sepcc;
import com.audit.modules.payment.service.AdvancePaymentService;
import com.audit.modules.system.dao.SysMiddleFileDao;
import com.audit.modules.system.entity.SysFileVO;
import com.audit.modules.system.entity.SysMidlleFile;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.service.FileOperatorService;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**   
 * @Description : TODO(基站电费-预付提交：基础操作接口)    
 *
 * @author : chentao
 * @date : 2017年4月10日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Service
public class AdvancePaymentServiceImpl implements AdvancePaymentService{
	
	@Autowired
	private AdvancePaymentDao aPaymentDao;
	
	@Autowired
    private FileOperatorService fileOperatorService;
	
	@Autowired
	private SysMiddleFileDao sysMiddleFileDao;
	
	@Autowired
	private InputElectricityDao inputElectricityDao;

	/**
	 * @Description 查询预付列表
	 * @param page 分页查询条件
	 * @return 预付信息list
	 * */
	@Override
	public List<AdvancePaymentVo> queryPaymentByPage(PageUtil<AdvancePaymentVo> page) {
		
		//未设置预付状态显示（流程状态）？？
		//等待提交审批、审批中、审批通过、审批驳回、等待推送财务、等待预付报销发起人推送财务、报销中、报销成功、报销失败
		List<AdvancePaymentVo> list = aPaymentDao.queryPaymentByPage(page);
		if (list != null && list.size()>0) {
			for(AdvancePaymentVo aPaymentVo :list){
				if (aPaymentVo.getStatus() != null) {
					switch(aPaymentVo.getStatus()){
						case 0 : 
							aPaymentVo.setStatusStr("等待提交审批");
							break;
						case 1 : 
							aPaymentVo.setStatusStr("审批中");
							break;
						case 2 : 
							aPaymentVo.setStatusStr("审批通过");
							break;
						case 3 : 
							aPaymentVo.setStatusStr("审批驳回");
							break;
						case 4 : 
							aPaymentVo.setStatusStr("等待推送财务");
							break;
					}
				}
			}
			
		}
		return list;
	}
	
	/**
	 * @Description  删除被选中预付信息
	 * @param paymentNumber 预付申请批次号
	 * @return 返回操作状态/信息
	 * */
	@Override
	public ResultVO deletePaymentById(String[] paymentNumber) {
		
		if (paymentNumber == null){
			return ResultVO.failed("删除失败");
		}
		aPaymentDao.deletePaymentById(paymentNumber);
		for(String id :paymentNumber){
			//清除附件中间表
			sysMiddleFileDao.deleteMiddleFiles(id);
		}
		return ResultVO.success();
	}
	
	/**
	 * @Description  更新预付信息 
	 * @param aPaymentVo 预付对象
	 * @return 返回操作状态/信息
	 * */
	@Override
	public ResultVO updatePayment(AdvancePaymentVo aPaymentVo) {
		if (aPaymentVo == null) {
			return ResultVO.failed("更新失败");
		}
		aPaymentDao.updatePayment(aPaymentVo);
		return ResultVO.success();
	}
	
	/**
	 * @Description 添加预付信息
	 * @param aPaymentVo 预付对象
	 * @return 返回操作状态/信息
	 * */
	@Override
	public ResultVO addPayment(MultipartFile[] files, AdvancePaymentVo aPaymentVo, HttpServletRequest request) {
		
		if (aPaymentVo == null) {
			return ResultVO.failed("添加信息失败");
		}
		//获取制单人
		UserVo userVo = (UserVo)request.getSession().getAttribute("userInfo");
		String submitMan = "";
		if (userVo != null) {
			submitMan = userVo.getAccount();
		}
		// 保存附件
		if (files == null || files.length == 0) {
			return ResultVO.failed("附件不能为空");
		}
		// 返回map{fileName=fileId}
		Map<String, String> map = fileOperatorService.saveFile(files, request);
		// 保存到中间表
		List<SysMidlleFile> sysMidlleFiles = Lists.newArrayList();
		if (!map.isEmpty() && map.size() > 0) {
			for (String ids : map.values()) {
				SysMidlleFile sysMidlleFile = new SysMidlleFile();
				sysMidlleFile.setId(StringUtils.getUUid());
				sysMidlleFile.setBusinessId(aPaymentVo.getId());
				sysMidlleFile.setSysFileId(ids);
				sysMidlleFiles.add(sysMidlleFile);
			}
			sysMiddleFileDao.saveMiddelFile(sysMidlleFiles);
		}
		
		// 保存预付信息
		String id = StringUtils.getUUid();
		SimpleDateFormat sDateFormat = new SimpleDateFormat("yyyyMMdd");
		String date = sDateFormat.format(new Date());
		long time = System.currentTimeMillis();
		String paymentNumber = "YF" + date + time;

		aPaymentVo.setId(id);
		aPaymentVo.setPaymentNumber(paymentNumber);
		aPaymentVo.setSubmitMan(submitMan);

		aPaymentDao.addPayment(aPaymentVo);
		return ResultVO.success();
	}
	
	
	/**
	 * @Description  提交、驳回(更新状态/备注)
	 * @param paymentNumber 预付申请批单号
	 * @param status 预付单状态
	 * @return 返回操作状态/信息
	 * */
	@Override
	public ResultVO submitOrReject(String paymentNumber, Integer status ,String remark) {
		if (paymentNumber == null) {
			return ResultVO.failed("操作失败");
		}
		Map<String, String> parm = new HashMap<>();
		parm.put("paymentNumber", paymentNumber);
		parm.put("status", status.toString());
		parm.put("remark", remark);
		
		aPaymentDao.submitOrReject(parm);
		return ResultVO.success();
		
	}

	//新增预付单（提交预付单）
	@Override
	public int prepayAdd(AdvancePaymentVo aPaymentVo) {
//		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		String createTime = sdf.format(new Date());
		aPaymentVo.setCreateDate(new Date());
		aPaymentVo.setId(StringUtils.getUUid().replace("-", ""));
		aPaymentVo.setSurplusMoney(aPaymentVo.getTotalMoney());
		//保存入预付表
		int i = aPaymentDao.prepayAdd(aPaymentVo);
		List<SysMidlleFile> sysMidlleFiles = Lists.newArrayList();
		for(int k=0;k<aPaymentVo.getAttachmentId().length;k++){
			SysMidlleFile sysMidlleFile = new SysMidlleFile();
			sysMidlleFile.setId(StringUtils.getUUid());
			sysMidlleFile.setBusinessId(aPaymentVo.getId());
			sysMidlleFile.setSysFileId(aPaymentVo.getAttachmentId()[k]);
			sysMidlleFiles.add(sysMidlleFile);
		}
		sysMiddleFileDao.saveMiddelFile(sysMidlleFiles);
		return i;
	}

	@Override
	public String getProId(Sepcc sepcc) {
		String proId = aPaymentDao.getProId(sepcc);
		return proId;
	}

	@Override
	public String getCitId(Sepcc sepcc) {
		String citId = aPaymentDao.getCitId(sepcc);
		return citId;
	}

	@Override
	public String getCouId(Sepcc sepcc) {
		String couId = aPaymentDao.getCouId(sepcc);
		return couId;
	}

	//修改提交人信息
	@Override
	public int updateSubmitMan(Map map) {
		int i = aPaymentDao.updateSubmitMan(map);
		return i;
	}

	//修改预付状态
	@Override
	public int updateStatus(Map map) {
		int i = aPaymentDao.updateStatus(map);
		return i;
	}

	@Override
	public AdvancePaymentVo getOneById(String id) {
		AdvancePaymentVo advancePaymentVo = aPaymentDao.getOneById(id);
		return advancePaymentVo;
	}

	@Override
	public AdvancePaymentVo getOne(AdvancePaymentVo adp) {
		AdvancePaymentVo one = aPaymentDao.getOne(adp);
		return one;
	}
	
	
	/**
	 * @param :serialNumber 流水号  accountName 报站点名称
	 * @return :
	 * @throws
	 * @Description: 获取预付列表
	 */
	@Override
	public void queryList(PageUtil<AdvancePaymentVo> page, AdvancePaymentVo adp, UserVo userInfo) {
		Map<String, Object> map = Maps.newHashMap();
		setParamterMap(page, adp, map, userInfo);
		List<AdvancePaymentVo> adps = aPaymentDao.queryList(map);
		page.setTotalRecord(aPaymentDao.queryListCount(map));
		page.setResults(adps);
//		List<String> ids = Lists.newArrayList();
//		for (AdvancePaymentVo electrictyListVO : adps) {
//			ids.add(electrictyListVO.getId());
//		}
	}
	
	
	// 设置参数
		private void setParamterMap(PageUtil<AdvancePaymentVo> page, AdvancePaymentVo adp, Map<String, Object> map,UserVo userInfo) {
			//流水号
			map.put("paymentNumber", adp.getPaymentNumber() == null ? "" :  adp.getPaymentNumber());
			//预付供应商id
//			map.put("supplyId", adp.getSupplyId() == null ? "" : adp.getSupplyId());
//			//制单人
//			map.put("submitMan", adp.getSubmitMan() == null ? "" :  adp.getSubmitMan() == null);
//			//预付金额
//			map.put("totalMoney", adp.getTotalMoney() == null ? "" : adp.getTotalMoney());
			//制单时间
//			map.put("createDate", adp.getCreateDate() == null ? "" : adp.getCreateDate());
			map.put("status", adp.getStatus() == null ? "" : adp.getStatus());
			if(adp.getStartDate()!=null){
				map.put("startDate",adp.getStartDate());
			}
			if(adp.getEndDate()!=null){
				Calendar calendar = new GregorianCalendar();
				calendar.setTime(adp.getEndDate());
				calendar.add(Calendar.DAY_OF_YEAR,1);
				map.put("endDate",calendar.getTime());
			}
//			if(adp.getStatuses()!=null&&electrictyVO.getStatuses().length>0){
//				map.put("status",electrictyVO.getStatuses());
//			}
			if (userInfo != null) {
				map.put("userID", userInfo.getUserId() == null ? "" : userInfo.getUserId());
			}
			map.put("pageSize",page.getPageSize()*page.getPageNo());
			map.put("pageNo",(page.getPageNo()-1)*page.getPageSize());
			page.setObj(map);
		}

		//根据id查详情
		@Override
		public AdvancePaymentVo getViewPrepayDetails(String id) {
			Map<String, String> paramMap = Maps.newHashMap();
			paramMap.put("id", id);
			AdvancePaymentVo adpv = aPaymentDao.getViewPrepayDetails(id);
			if(adpv!=null){
				Date startDate = adpv.getStartDate();
				Date endDate = adpv.getEndDate();
				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
				adpv.setsDate(sdf.format(startDate));
				adpv.seteDate(sdf.format(endDate));
			}
			if(adpv!=null){
				//根据预付单id查附件信息
				List<SysFileVO> sysFileVOs = this.findFileByPrepayID(paramMap);
				//List<SysFileVO> sysFileVOs = inputElectricityDao.findFileByElID(paramMap);
				adpv.setSysFileVOs(sysFileVOs);
			}
			return adpv;
		}

		//查附件信息
		@Override
		public List<SysFileVO> findFileByPrepayID(Map<String, String> map) {
			List<SysFileVO> findFileByPrepayID = aPaymentDao.findFileByPrepayID(map);
			return findFileByPrepayID;
		}


		@Override
		public int upPreStatus(Map<String, Object> map) {
			int i = aPaymentDao.upPreStatus(map);
			return i;
		}

		//修改提交意见
		@Override
		public int upTalk(Map<String, String> map) {
			int i = aPaymentDao.upTalk(map);
			return i;
		}

		
		
		/**
		 * @param :
		 * @return :
		 * @throws
		 * @Description: 根据电费录入IDs获取列表信息
		 */
		@Override
		public List<AdvancePaymentVo> queryByIDs(List<String> ids) {
			List<AdvancePaymentVo> electrictyListVOs = aPaymentDao.queryByIDs(ids);
			return electrictyListVOs;
		}

		@Override
		public List<AdvancePaymentVo> getOneByUserId(Map<String, String> map) {
			List<AdvancePaymentVo> oneByUserIds = aPaymentDao.getOneByUserId(map);
			return oneByUserIds;
		}

		@Override
		public void delPreByPaymetNumber(String paymentNumber) {
			aPaymentDao.delPreByPaymetNumber(paymentNumber);
		}

		@Override
		public List<AdvancePaymentVo> getOneBySupplyId(String supplyId) {
			List<AdvancePaymentVo> oneBySupplyId = aPaymentDao.getOneBySupplyId(supplyId);
			return oneBySupplyId;
		}

		@Override
		public int getPreNum(String submitManId) {
			int preNum = aPaymentDao.getPreNum(submitManId);
			return preNum;
		}

		@Override
		public int getPreSNum(String submitManId) {
			int preSNum = aPaymentDao.getPreSNum(submitManId);
			return preSNum;
		}

		@Override
		public int getPreCNum(String submitManId) {
			int preCNum = aPaymentDao.getPreCNum(submitManId);
			return preCNum;
		}

		@Override
		public List<String> getOldEle(ElectricityFlowVo flowVo) {
			List<String> list = aPaymentDao.getOldEle(flowVo);
			return list;
		}
	
	
}
