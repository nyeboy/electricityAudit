package com.audit.modules.basedata.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.DataModifyApply;
import com.audit.modules.basedata.entity.DataModifyDetail;
import com.audit.modules.basedata.service.AccountSiteTransService;
import com.audit.modules.basedata.service.DataModifyApplyService;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.PropertyUtils;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.towerbasedata.trans.entity.TowerNeedTrans;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;
import com.audit.modules.towerbasedata.trans.service.TowerTransService;
import com.audit.modules.workflow.service.BasicDataChangeService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;

/**
 * 
 * @Description: 数据维护管理   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月25日 下午10:47:51
 */
@Controller
@RequestMapping("dataModifyApply")
public class DataModifyApplyController {

	@Autowired
	private DataModifyApplyService dataModifyApplyService;
	@Autowired
	private BasicDataChangeService basicDataChangeService;
	@Autowired
	private AccountSiteTransService accountSiteTransService;
	@Autowired
	private TowerTransService towerTransService;
	
	/**NGINX部署服务器的ip */
	public static String NGINX_IP = PropertyUtils.getLogInfo("/dataModifyApply/NGINX_IP");
	/**NGINX部署服务器的http */
	public static String NGINX_HTTP = PropertyUtils.getLogInfo("/dataModifyApply/NGINX_HTTP");
	
	

	/**   
	 * @Description: (分页查询)    
	 * @param :      changeType 修改类型：
	 * @param		 applyUserName 申请人姓名
	 * @param :      cityId	 市
	 * @param :      countyId  区县     
	 * @return :     操作状态/信息json     
	*/
	@RequestMapping("findApplyByPage")
	@ResponseBody
	public ResultVO findApplyByPage(HttpServletRequest request, Integer pageNo, Integer pageSize) {

		Map<String, Object> paramMap = Maps.newHashMap();
		paramMap.put("changeType", request.getParameter("changeType"));
		paramMap.put("applyUserName", request.getParameter("applyUserName"));
		paramMap.put("applyUserId", request.getParameter("applyUserId"));
		paramMap.put("cityId", request.getParameter("cityId"));
		paramMap.put("countyId", request.getParameter("countyId"));

		PageUtil<DataModifyApply> page = new PageUtil<DataModifyApply>();
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		if (pageNo != null && pageSize != null) {
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}

		List<DataModifyApply> list = dataModifyApplyService.findApplyByPage(page);
		return ResultVO.success(page);
	}
	
	/**   
	 * @Description: 转供电 保存request,url 
	 * @param :     
	 * @return :     转供电 操作状态/信息json    
	*/
	@RequestMapping("transEleApply")
	@ResponseBody
	public ResultVO transEleApply(HttpServletRequest request, HttpServletResponse response) {
		//提交过来的数据先从SYS_ZGROOM_TRANS_MID中查出相应的数据进行验证
		//验证预留位置
		
		
		
		//预留
		//自维
		AccountSiteTransSubmit accountSiteTransSubmit = new AccountSiteTransSubmit();
		//塔维
		TowerTransSubmitVO towerTransSubmitVO = new TowerTransSubmitVO();
		
		//前台传过来的参数处理
		Map<String, String> params = new HashMap<String, String>();
		Map<String, String[]> paramMap = request.getParameterMap();
		String paramStr = null;
		for (String key : paramMap.keySet()) {
			Log.debug(key + String.join("", paramMap.get(key)));
			params.put(key, String.join("", paramMap.get(key)));
		}
		if (params.size() >= 1) {
			// 设置参数 map ->json -> String
			ObjectMapper mapper = new ObjectMapper();
			try {
				paramStr = mapper.writeValueAsString(params);
			} catch (JsonProcessingException e1) {
				e1.printStackTrace();
			}
		}
		if (null == paramStr) {
			ResultVO.failed("参数错误");
		}
		//自维塔维判断,0自维 1塔维
		String mobileType = params.get("mobileType");
		if(mobileType == null || mobileType.equals("")){
			return ResultVO.failed("参数错误10086");
		}
		//自维
		if(mobileType!=null && mobileType.equals("0")){
			//参数和url需要保存，审批完成后需要根据参数修改数据后期有用
			accountSiteTransSubmit.setParams(paramStr);
			//如果接下来写塔维转供电的话需要做判断，现在适用自维
			accountSiteTransSubmit.setProperType(params.get("properType"));
			accountSiteTransSubmit.setSiteId(params.get("siteId"));
			accountSiteTransSubmit.setSiteName(params.get("siteName"));
			accountSiteTransSubmit.setRoomId(params.get("roomId"));
			accountSiteTransSubmit.setRoomName(params.get("roomName"));
			accountSiteTransSubmit.setMobileType(params.get("mobileType"));
			
		}
		//塔维
		if(mobileType!=null && mobileType.equals("1")){
			towerTransSubmitVO.setParams(paramStr);
			towerTransSubmitVO.setTowerSiteCode(params.get("towerSiteCode"));
			towerTransSubmitVO.setTowerSiteName(params.get("towerSiteName"));
			towerTransSubmitVO.setRoomName(params.get("roomName"));
			towerTransSubmitVO.setMobileType(params.get("mobileType"));
		}
		//都有onlyid
		//SYS_ZGROOM_TRANS_MID中不会重复的id，据此查数据和改数据，才不会出错
		String onlyId = params.get("onlyId");
		if(onlyId ==null ||onlyId.equals("")){
			return ResultVO.failed("操作失败,缺少参数");
		}
		

		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		
		String url = session.getAttribute("originalUrl") + "";
		// 设置url
		if (null != url && !url.equals("")) {
			if(url.indexOf(NGINX_HTTP) == 0){
				url = url.replace(NGINX_HTTP, NGINX_IP);
			}
			if(mobileType.equals("0")){//自维
				accountSiteTransSubmit.setUrl(url);
			}
			if(mobileType.equals("1")){//塔维
				towerTransSubmitVO.setUrl(url);
			}
			session.removeAttribute("originalUrl");
		}
		

		UserVo userVo = (UserVo) session.getAttribute("user");
		if (null != userVo) {//设置用户数据
			if(mobileType.equals("0")){
				accountSiteTransSubmit.setTrusteesId(userVo.getUserId());
				accountSiteTransSubmit.setTrusteesName(userVo.getUserName());
				accountSiteTransSubmit.setCityId(userVo.getCity() + "");
				accountSiteTransSubmit.setCountyId(userVo.getCounty() + "");
			}
			if(mobileType.equals("1")){
				towerTransSubmitVO.setTrusteesId(userVo.getUserId());
				towerTransSubmitVO.setTrusteesName(userVo.getUserName());
				towerTransSubmitVO.setCityId(userVo.getCity() + "");
				towerTransSubmitVO.setCountyId(userVo.getCounty() + "");
			}
		}
		//自维
		if(mobileType.equals("0")){
			try {
				accountSiteTransSubmit.setStatus("0");
				accountSiteTransSubmit.setCreateDate(new Date());
				//判断是否在流程
				//没写完，预留
				boolean transIsInFlow = dataModifyApplyService.transIsInFlow(accountSiteTransSubmit);
				if(transIsInFlow){
					return ResultVO.failed("操作失败,数据在审批中");
				}
				//applyid不是流程id，是业务id，把数据存储下面使用
				String applyid =dataModifyApplyService.transInsertSelective(accountSiteTransSubmit); 
				if (null != applyid) {
					//自维转供电启动流程
					basicDataChangeService.tranStartFlow(applyid);
					//根据业务键获取流程实例和任务，并保存到表中
					String instanceId = basicDataChangeService.getInstanceByApplyId(applyid,accountSiteTransSubmit);
					//修改SYS_ZGROOM_TRANS_MID中提交审批的状态0:待审批,1：审批通过，2：审批失败
					AccountSiteNeedTrans aNeedTrans = new AccountSiteNeedTrans();
					aNeedTrans.setOnlyId(onlyId);
					aNeedTrans.setResultStatus("0");
					aNeedTrans.setInstanceId(instanceId);
					accountSiteTransService.updateResultStatusByOnlyId(aNeedTrans);
				}
			} catch (Exception e) {
				e.printStackTrace();
				return ResultVO.failed("未找到对应的流程,请先新建流程");
			}
		}
		//塔维
		if(mobileType.equals("1")){
			try {
				towerTransSubmitVO.setStatus("0");
				towerTransSubmitVO.setCreateDate(new Date());
				//判断是否在流程
				//没写完，预留
				boolean towerTransIsInFlow = dataModifyApplyService.towerTransIsInFlow(towerTransSubmitVO);
				if(towerTransIsInFlow){
					return ResultVO.failed("操作失败,数据在审批中");
				}
				//applyid不是流程id，是业务id，把数据存储下面使用
				String applyid = dataModifyApplyService.towerTransInsertSelective(towerTransSubmitVO);
				if (null != applyid) {
					//塔维转供电启动流程
					basicDataChangeService.towerTranStartFlow(applyid);
					//根据业务键获取流程实例和任务，并保存到表中
					String instanceId = basicDataChangeService.getTowerInstanceByApplyId(applyid,towerTransSubmitVO);
					//修改SYS_ZGROOM_TOWER_TRANS_MID中提交审批的状态0:待审批,1：审批通过，2：审批失败
					TowerNeedTrans tNeedTrans = new TowerNeedTrans();
					tNeedTrans.setOnlyId(onlyId);
					tNeedTrans.setResultStatus("0");
					tNeedTrans.setInstanceId(instanceId);
					towerTransService.updateResultStatusByOnlyId(tNeedTrans);
				}
			} catch (Exception e) {
				e.printStackTrace();
				return ResultVO.failed("未找到对应的流程,请先新建流程");
			}
		}

		
		return ResultVO.successMsg("已提交操作申请，等待审批");
	}

	/**   
	 * @Description: 保存request,url 
	 * @param :     
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("handleApply")
	@ResponseBody
	public ResultVO handleApply(HttpServletRequest request, HttpServletResponse response) {
		DataModifyApply dataModifyApply = new DataModifyApply();
		Map<String, String> params = new HashMap<String, String>();
		String[] operatorStr = null;
		// controller别名
		String operator = null;
		// controller方法
		String operatorMethod = null;
		// 变更类型
		String changeType = null;
		//自维塔维判断,0自维 1塔维
		String mobileType = null;
		

		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		String url = session.getAttribute("originalUrl") + "";
		String paramStr = null;
		Map<String, String[]> paramMap = request.getParameterMap();
		// 设置url
		if (null != url && !url.equals("")) {
			if(url.indexOf(NGINX_HTTP) == 0){
				url = url.replace(NGINX_HTTP, NGINX_IP);
			}
			dataModifyApply.setUrl(url);
			session.removeAttribute("originalUrl");
		}

		Log.debug(url + "");
		for (String key : paramMap.keySet()) {
			Log.debug(key + String.join("", paramMap.get(key)));
			params.put(key, String.join("", paramMap.get(key)));
		}
		if (params.size() >= 1) {
			// 设置参数 map ->json -> String
			ObjectMapper mapper = new ObjectMapper();
			try {
				paramStr = mapper.writeValueAsString(params);
			} catch (JsonProcessingException e1) {
				e1.printStackTrace();
			}
		}
		if (null == paramStr) {
			ResultVO.failed("参数错误");
		}
		dataModifyApply.setParams(paramStr);
		UserVo userVo = (UserVo) session.getAttribute("user");
		if (null != userVo) {
			dataModifyApply.setApplyUserId(userVo.getUserId());
			dataModifyApply.setApplyUserName(userVo.getUserName());
			dataModifyApply.setCityId(userVo.getCity() + "");
			dataModifyApply.setCountyId(userVo.getCounty() + "");
		}

		StringBuffer regBuffer = new StringBuffer(1400);
		regBuffer.append("supplierManage/deleteSupplyById|supplierManage/updateSupply");
		regBuffer.append("|supplierManage/insertSupply|watthourMeter/saveOrUpdate");
		regBuffer.append("|watthourMeter/delete|invoice/saveOrUpdate");
		regBuffer.append("|invoice/delete|powerRateManage/updatePowerRate|accountSitePSU/updateAccountSitePSUById");
		regBuffer.append(
				"|accountSiteManage/updateAccountSiteManageById|accountSiteManage/deleteAccountSiteManageByIds");
		regBuffer.append("|accountSiteManage/createAccountSite|accountSiteOther/updateAccountSiteOtherById");
		regBuffer.append(
				"|ownerController/saveOwner|ownerController/updateOwner|ownerController/deleteOwner|ownerController/bathDeleteOwner");
		regBuffer.append("|meterController/updateMeter|meterController/saveMeter|meterController/deleteMeter");
		regBuffer.append("|accountSiteTrans/saveTransEleAdd");//添加自维转供电
		regBuffer.append("|towerTrans/saveTransEleAdd");//添加塔维转供电
		String reg = new String(regBuffer);
		Pattern pattern = Pattern.compile(reg);
		Matcher m = pattern.matcher(url.replaceAll("%20", ""));
		while (m.find()) {
			Log.debug(m.group(0));
			operatorStr = m.group(0).split("/");
			if (operatorStr.length == 2) {
				operator = operatorStr[0];
				operatorMethod = operatorStr[1];
			}
		}
		if (null != operator && null != operatorMethod) {
			switch (operator) {
			case "towerTrans":
				changeType = "塔维转供电信息";
				mobileType = "1";
				break;
			case "accountSiteTrans":
				changeType = "转供电信息";
				mobileType = "0";
				break;
			case "supplierManage":
				changeType = "供应商信息";
				mobileType = "0";
				break;
			case "watthourMeter":
				changeType = "电表信息";
				mobileType = "0";
				break;
			case "invoice":
				changeType = "发票信息";
				mobileType = "0";
				break;
			case "powerRateManage":
				changeType = "额定功率信息";
				mobileType = "0";
				break;
			case "accountSitePSU":
				changeType = "供电信息";
				mobileType = "0";
				break;
			case "accountSiteOther":
				changeType = "其他信息";
				mobileType = "0";
				break;
			case "accountSiteManage":
				changeType = "报账点信息";
				mobileType = "0";
				break;
			case "meterController":
				changeType = "业主电表信息";
				mobileType = "0";
				break;
			case "ownerController":
				changeType = "业主信息";
				mobileType = "0";
				break;
			}
			dataModifyApply.setChangeType(changeType);
			dataModifyApply.setMobileType(mobileType);//设置自维塔维
			if (operatorMethod.matches("(?i).*delete.*|(?i).*remove.*|")) {
				dataModifyApply.setRemarks("删除");
			}
			if (operatorMethod.matches("(?i).*add.*|(?i).*insert.*|(?i).*create.*|(?i).*save.*|(?i).*update*")
					&& !params.containsKey("id")) {
				
				dataModifyApply.setRemarks("新增");
			} 
			if (operatorMethod.matches("(?i).*update.*")
					&& (params.containsKey("id") || changeType.equals("业主信息") )) {
				dataModifyApply.setRemarks("修改");
			}
		} else {
			ResultVO.failed("参数错误");
		}
		try {
			dataModifyApply.setChangeStatus("0");
			dataModifyApply.setChangeTime(new Date());
			//判断是否在流程中
			boolean isIntoFlow = dataModifyApplyService.isInFlow(dataModifyApply, params);
			if(isIntoFlow){
				return ResultVO.failed("操作失败,数据在审批中");
			}
			//applyid不是流程id，是业务id
			String applyid = dataModifyApplyService.insertSelective(dataModifyApply);
			if (null != applyid) {
				basicDataChangeService.startFlow(applyid);
				dataModifyApplyService.addDataModifyLog(dataModifyApply, params);
				
				
				//根据业务键获取流程实例和任务
//				String instanceId = basicDataChangeService.getInstanceByApplyId(applyid);
//				params.put("instanceId", instanceId);
				//塔维转供电表中插入审批记录
//				if(dataModifyApply.getChangeType() == "塔维转供电信息"){
//					//把信息插入进去
//					towerTransService.saveTransData(dataModifyApply,params);
//				}
				
				//自维转供电表中插入审批记录
//				if(dataModifyApply.getChangeType() =="转供电信息"){
//					//把信息插入进去
//					accountSiteTransService.saveTransData(dataModifyApply,params);
//				}
				
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResultVO.failed("未找到对应的流程,请先新建流程");
		}
		return ResultVO.successMsg("已提交操作申请，等待审批");
	}


	/**   
	 * @Description: (根据id查找申请)    
	 * @param :      id    
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("findApplyById")
	@ResponseBody
	public ResultVO findApplyById(String id) {
		DataModifyApply dataModifyApply = dataModifyApplyService.selectByPrimaryKey(id);
		return ResultVO.success(dataModifyApply);
	}

	/**   
	 * @Description: (根据申请id查找历史详情)    
	 * @param :      id    
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("findLogByApplyId")
	@ResponseBody
	public ResultVO findLogByApplyId(String id) {
		DataModifyDetail dataModifyDetail = dataModifyApplyService.findDetailByApplyId(id);
		if (dataModifyDetail == null) {
			return ResultVO.failed("未找到记录");
		}
		return ResultVO.success(dataModifyDetail);
	}

	/**   
	 * @Description: (通过ids删除)    
	 * @param :      ids    
	 * @return :     操作状态/信息json     
	*/
	@RequestMapping("deleteApplyByIds")
	@ResponseBody
	public ResultVO deleteApplyByIds(String ids) {
		return dataModifyApplyService.deleteApplyByIds(ids);
	}

	/**   
	 * @Description: vi(通过id调用apply)    
	 * @param :     
	 * @return :     操作状态/信息json    
	*/
	@RequestMapping("executeApply")
	@ResponseBody
	public ResultVO executeApply(String id) {
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		Log.debug(session.getAttribute("user").toString());
		return dataModifyApplyService.executeApply(id);
	}

}
