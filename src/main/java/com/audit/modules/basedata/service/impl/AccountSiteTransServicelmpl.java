/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.basedata.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.AccountSiteTransDao;
import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSiteTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.TransEleFile;
import com.audit.modules.basedata.entity.TransMidFile;
import com.audit.modules.basedata.service.AccountSiteTransService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.workflow.service.BasicDataChangeService;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**
 * 
 * @Description: 转供电信息管理实现类
 * @throws  
 * 
 * @author  noone
 * @date 2017年1月8日 
 */
@Service
public class AccountSiteTransServicelmpl implements AccountSiteTransService{
	@Autowired
	private AccountSiteTransDao accountSiteTransDao;
	
	//基础数据流程serv
	@Autowired
	private BasicDataChangeService basicDataChangeService;
	/**   
	 * @Description:待改造转供电信息分页查询    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
/*	@Override
	public void findAccountSiteByTransPage(AccountSiteTransSubmit accountSiteTransSubmit,PageUtil<AccountSiteTransSubmit> pageUtil) {
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null !=accountSiteTransSubmit) {
			setMapWait(parameMap, accountSiteTransSubmit, pageUtil);
		}
		List<AccountSiteTrans> sysRoleVoList = accountSiteTransDao.findAccountSiteByTransPage(pageUtil);
	}*/
	/**   
	 * @Description: 待改造数据设置查询参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMapWait(Map<String, Object> parameMap,AccountSiteTransSubmit accountSiteTransSubmit,PageUtil<AccountSiteTransSubmit> pageUtil) {
		if(accountSiteTransSubmit.getSiteName() != null) {
			parameMap.put("siteName", accountSiteTransSubmit.getSiteName() + "");
		}
		if(accountSiteTransSubmit.getCountyId() != null) {
			parameMap.put("countyId", accountSiteTransSubmit.getCountyId() + "");
		}
		if(accountSiteTransSubmit.getCityId() != null){
			parameMap.put("cityId", accountSiteTransSubmit.getCityId() + "");
		}
		if(accountSiteTransSubmit.getProperType() != null &&accountSiteTransSubmit.getProperType() != "") {
			parameMap.put("properType", accountSiteTransSubmit.getProperType() + "");
		}
		if(accountSiteTransSubmit.getStatus() != null) {
			parameMap.put("status", accountSiteTransSubmit.getStatus() + "");
		}
		pageUtil.setObj(parameMap);
	}
	/**   
	 * @Description:需要改造的转供电列表查询
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void findNeedTransList(AccountSiteTrans accountSiteTrans,PageUtil<AccountSiteTrans> pageUtil){
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null != accountSiteTrans){
			setMap(parameMap, accountSiteTrans, pageUtil);
		}
		//从SYS_ZGROOM_TRANS_MID中查出提交状态
		List<AccountSiteTrans> sysRoleVolist = accountSiteTransDao.findNeedTransList(pageUtil);
	}
	
	/**   
	 * @Description: 设置查询参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> parameMap,AccountSiteTrans accountSiteTrans,PageUtil<AccountSiteTrans> pageUtil) {
		if(accountSiteTrans.getSiteName() != null) {
			parameMap.put("siteName", accountSiteTrans.getSiteName() + "");
		}
		if(accountSiteTrans.getCountyId() != null) {
			parameMap.put("countyId", accountSiteTrans.getCountyId() + "");
		}
		if(accountSiteTrans.getCityId() != null){
			parameMap.put("cityId", accountSiteTrans.getCityId() + "");
		}
		if(accountSiteTrans.getProperType() != null &&accountSiteTrans.getProperType() != "") {
			parameMap.put("properType", accountSiteTrans.getProperType() + "");
		}
		pageUtil.setObj(parameMap);
	}
	@Override
	public void saveTransEleAdd(String siteId) {
		//更改SYS_ACCOUNT_SITE表中状态,变为转供电，逻辑关系是：一个站点对应一个机房，而一个机房对应多个站点
		accountSiteTransDao.updateTransEleStatus(siteId);
	}
/*	//保存中间信息
	@Override
	public void saveTransData(DataModifyApply dataModifyApply, Map<String, String> paramap) {
//		List<AccountSiteTransSubmit> accountSiteTransSubmits = new ArrayList<AccountSiteTransSubmit>();
		AccountSiteTransSubmit accountSiteTransSubmit = new AccountSiteTransSubmit();
		accountSiteTransSubmit.setInstanceId(paramap.get("instanceId"));//流程id
		accountSiteTransSubmit.setCreateDate(dataModifyApply.getChangeTime());//改造时间
		accountSiteTransSubmit.setTrusteesName(dataModifyApply.getApplyUserName());//申请人名字
		accountSiteTransSubmit.setStatus(dataModifyApply.getChangeStatus());
		accountSiteTransSubmit.setSiteName(paramap.get("siteName"));
		accountSiteTransSubmit.setApplyId(dataModifyApply.getId());
		accountSiteTransSubmit.setCityId(dataModifyApply.getCityId());
		accountSiteTransSubmit.setCountyId(dataModifyApply.getCountyId());
		accountSiteTransSubmit.setTrusteesId(dataModifyApply.getApplyUserId());
		accountSiteTransSubmit.setProperType(paramap.get("properType"));
		accountSiteTransDao.insertTransData(accountSiteTransSubmit);
		
	}*/
	//批量删除转供电稽核单
	@Override
	public ResultVO deleteByIDs(String[] ids) {
		if (ids == null || ids.length == 0) {
			return ResultVO.failed("请选择需要删除的数据！");
		}
		List<String> idList = Arrays.asList(ids);
		
		//SYS_TRANSELEPOWER_SUBMIT中数据要根据流程id删除
		//SYS_ZGROOM_TRANS_MID中数据要根据onlyid删除，分开删除比较好
		List<String> instanceIds = new ArrayList<>();
		for (String id : idList) {
			AccountSiteNeedTrans needTrans = accountSiteTransDao.findDataByOnlyId(id);
			if(needTrans==null){
				return ResultVO.failed("参数错误！");
			}
			if(needTrans.getSubmitStatus()!=null && needTrans.getSubmitStatus().equals("3")){
				return ResultVO.failed("改造成功，不允许删除数据!");
			}
			if(needTrans.getResultStatus()!=null &&needTrans.getResultStatus().equals("0")){
				return ResultVO.failed("审批中数据，不能删除！");
			}
			if(needTrans.getResultStatus()!=null && needTrans.getResultStatus().equals("1")){
				return ResultVO.failed("审批成功数据，不允许删除！");
			}
			if(needTrans.getInstanceId()!=null && !needTrans.getInstanceId().equals("")){
				instanceIds.add(needTrans.getInstanceId());
			}
			
			//删除流程中的数据,可以保留，如果需求改了，可以在流程中删除数据的话可以用上
			//basicDataChangeService.deleteByInstanceId(id);
		}
		try {
			//删除SYS_ZGROOM_TRANS_MID中数据
			accountSiteTransDao.deleteByOnlyIds(idList);
			//删除SYS_TRANSELEPOWER_SUBMIT中数据
			if(instanceIds!=null && !instanceIds.isEmpty()){
				accountSiteTransDao.deleteByIDs(instanceIds);
			}
			//预留，删除附件中数据
		} catch (Exception e) {
			return ResultVO.failed(e.getMessage());
		}
		return ResultVO.success();
	}
	

    
    
	@Override
	public void saveNeedChangeSite(AccountSiteTrans aSiteTrans) {
		
		//根据机房id先查询有之前有没有数据，没有就新增，有就修改
		//不能用机房id或者站点id，他们是多对多关系，创建一个唯一标识符
		//onlyId 唯一不会重复的id，中间表id
		AccountSiteNeedTrans countData = accountSiteTransDao.checkNeedSubmitDataStatus(aSiteTrans.getOnlyId());
		if(countData == null || countData.equals("")){
			AccountSiteNeedTrans aNeedTrans = new AccountSiteNeedTrans();
			aNeedTrans.setOnlyId(aSiteTrans.getOnlyId());
			aNeedTrans.setCityId(aSiteTrans.getCityId());
			aNeedTrans.setCityName(aSiteTrans.getCityName());
			aNeedTrans.setCountyId(aSiteTrans.getCountyId());
			aNeedTrans.setCountyName(aSiteTrans.getCountyName());
			aNeedTrans.setCreateDate(new Date());
			aNeedTrans.setSiteId(aSiteTrans.getSiteId());
			aNeedTrans.setSiteName(aSiteTrans.getSiteName());
			aNeedTrans.setRoomId(aSiteTrans.getRoomId());
			aNeedTrans.setRoomName(aSiteTrans.getRoomName());
			aNeedTrans.setRoomEleType(aSiteTrans.getRoomEleType());
			aNeedTrans.setSiteEleType(aSiteTrans.getSiteEleType());
			aNeedTrans.setProperType(aSiteTrans.getProperType());
			aNeedTrans.setTrusteesId(aSiteTrans.getTrusteesId());
			aNeedTrans.setTrusteesName(aSiteTrans.getTrusteesName());
			aNeedTrans.setSubmitStatus("1");//1 已提交  2 被撤回 3 改造完成  null 未提交
			//新增该条数据
			try {
				accountSiteTransDao.insertNeedTransData(aNeedTrans);
				
			} catch (Exception e) {
				System.err.println(e.getMessage());
			}
		}else{
			AccountSiteNeedTrans aNeedTrans = new AccountSiteNeedTrans();
			aNeedTrans.setOnlyId(aSiteTrans.getOnlyId());
			aNeedTrans.setCityId(aSiteTrans.getCityId());
			aNeedTrans.setCityName(aSiteTrans.getCityName());
			aNeedTrans.setCountyId(aSiteTrans.getCountyId());
			aNeedTrans.setCountyName(aSiteTrans.getCountyName());
			aNeedTrans.setCreateDate(new Date());
			aNeedTrans.setSiteId(aSiteTrans.getSiteId());
			aNeedTrans.setSiteName(aSiteTrans.getSiteName());
			aNeedTrans.setRoomId(aSiteTrans.getRoomId());
			aNeedTrans.setRoomName(aSiteTrans.getRoomName());
			aNeedTrans.setRoomEleType(aSiteTrans.getRoomEleType());
			aNeedTrans.setSiteEleType(aSiteTrans.getSiteEleType());
			aNeedTrans.setProperType(aSiteTrans.getProperType());
			aNeedTrans.setTrusteesId(aSiteTrans.getTrusteesId());
			aNeedTrans.setTrusteesName(aSiteTrans.getTrusteesName());
			aNeedTrans.setSubmitStatus("1");//1 已提交  2 被撤回 3 改造完成  null 未提交
			//修改该条数据
			try {
				accountSiteTransDao.updateNeedTransData(aNeedTrans);
				
			} catch (Exception e) {
				System.err.println(e.getMessage());
			}
		}
		//把提交状态改变成1，提交成功
		
		
	}
	//经办人获取可以提交的转供电数据
	@Override
	public void getNeedSubmitData(AccountSiteNeedTrans accountSiteNeedTrans, PageUtil<AccountSiteNeedTrans> pageUtil) {
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null !=accountSiteNeedTrans) {
			setNeedSubmit(parameMap, accountSiteNeedTrans, pageUtil);
		}
		@SuppressWarnings("unused")
		List<AccountSiteNeedTrans> sysRoleVoList = accountSiteTransDao.getNeedSubmitData(pageUtil);
		List<AccountSiteNeedTrans> allDatas =pageUtil.getResults();
		for (AccountSiteNeedTrans vo : allDatas) {
			String onlyId = vo.getOnlyId();//onlyId就是文件id
			List<TransEleFile> fileDatas = accountSiteTransDao.queryFileByOnlyId(onlyId);
			vo.setTransEleFiles(fileDatas);
		}
		
		
	}
	/**   
	 * @Description: 待提交数据设置查询参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setNeedSubmit(Map<String, Object> parameMap,AccountSiteNeedTrans accountSiteNeedTrans,PageUtil<AccountSiteNeedTrans> pageUtil) {
		if(accountSiteNeedTrans.getSiteName() != null) {
			parameMap.put("siteName", accountSiteNeedTrans.getSiteName() + "");
		}
		if(accountSiteNeedTrans.getCountyId() != null) {
			parameMap.put("countyId", accountSiteNeedTrans.getCountyId() + "");
		}
		if(accountSiteNeedTrans.getCityId() != null){
			parameMap.put("cityId", accountSiteNeedTrans.getCityId() + "");
		}
		if(accountSiteNeedTrans.getProperType() != null &&accountSiteNeedTrans.getProperType() != "") {
			parameMap.put("properType", accountSiteNeedTrans.getProperType() + "");
		}
		if(accountSiteNeedTrans.getResultStatus() != null) {
			parameMap.put("resultStatus", accountSiteNeedTrans.getResultStatus() + "");
		}
		pageUtil.setObj(parameMap);
	}
	/**
	 * 根据onlyId 修改状态
	 */
	@Override
	public void updateResultStatusByOnlyId(AccountSiteNeedTrans accountSiteNeedTrans) {
		accountSiteTransDao.updateResultStatusByOnlyId(accountSiteNeedTrans);
		
	}
	/**
	 * 根据onlyid修改成功审批后的状态
	 */
	@Override
	public void saveSuccessStatus(AccountSiteNeedTrans needTrans) {
		try {
			//一 保存审批通过状态到SYS_ZGROOM_TRANS_MID，改变SUBMIT_STATUS状态为3，RESULT_STATUS为1
			AccountSiteNeedTrans data1 = new AccountSiteNeedTrans();
			data1.setResultStatus("1");
			data1.setSubmitStatus("3");
			data1.setOnlyId(needTrans.getOnlyId());
			accountSiteTransDao.updateNeedTransData(data1);
			//二 更改SYS_ACCOUNT_SITE中站点供电状态ELECTRICITY_TYPE为1
			SiteInfoVO siteInfoVO = new SiteInfoVO();
			siteInfoVO.setId(needTrans.getSiteId());
			siteInfoVO.setElectricityType("1");
			accountSiteTransDao.updateSiteAccountSuccessStatus(siteInfoVO);
		} catch (Exception e) {
			System.err.println("sql出现错误"+e.getMessage());
		}
	}
	
	
	//验证审批通过的和已经提交的数据，防止重复提交
	@Override
	public String checkIsSubmitData(AccountSiteTrans accountSiteTrans) {
		String onlyId = accountSiteTrans.getOnlyId();
		AccountSiteNeedTrans resultData = accountSiteTransDao.checkNeedSubmitDataStatus(onlyId);
		//1 , 已提交至下一级  2 被撤回  3 改造完成   4，审批失败 null '' 未提交
		if(resultData==null){//空指针异常
			return null;
		}
		return resultData.getSubmitStatus();
		
	}
	//修改时保存转供电数据
	@Override
	public ResultVO saveTransInfo(AccountSiteNeedTrans needTrans, UserVo userVo) {
		//保存供应商，备注，改造日期等信息
		if(needTrans.getSupplierIds()==null || needTrans.getSupplierNames()==null){
			return ResultVO.failed("请选择供应商！");
		}
		//时间需要转换格式吗
		try {
			needTrans.setAddapoUserId(userVo.getUserId());
			needTrans.setAddapoUserName(userVo.getUserName());
			//备注可能为空，需要判断
			accountSiteTransDao.updateNeedTransData(needTrans);
			//附件信息未保存，需要建一个类专门保存，用在产看详情时
			saveFile(needTrans);
			
			
		} catch (Exception e) {
			return ResultVO.failed(e.getMessage());
		}
		System.out.println(needTrans);
		System.out.println(userVo);
		return ResultVO.success();
	}
	
	/**
	 * 保存文件信息
	 * @param electrictySaveVO
	 */
	public void saveFile(AccountSiteNeedTrans needTrans) {
		if (needTrans.getAttachmentId() != null && needTrans.getAttachmentId().length > 0) {
			//删除之前保存的文件
			//SYS_TRANS_FILE中删除
			//SYS_TRANS_MIDDLE_FILE中删除
			accountSiteTransDao.deleteMidFileByOnlyId(needTrans.getOnlyId());
			List<TransMidFile> transMidFiles = Lists.newArrayList();
			for (String fileId : needTrans.getAttachmentId()) {
				TransMidFile transMidFile = new TransMidFile();
				transMidFile.setId(StringUtils.getUUid());
				transMidFile.setBusinessId(needTrans.getOnlyId());
				transMidFile.setTransFileId(fileId);
				transMidFiles.add(transMidFile);//把每一个文件保存进去
			}
			accountSiteTransDao.saveMiddelFile(transMidFiles);
		}
	}
	//转供电-撤销----------把提交过来的单子返回到新增人员手中
	@Override
	public boolean cancelTransSite(AccountSiteNeedTrans needTrans) {
		//根据onlyid查询数据比对，看是否是前台暴力更改
		AccountSiteNeedTrans checkData =accountSiteTransDao.findDataByOnlyId(needTrans.getOnlyId());
    	if(checkData.getSubmitStatus()!=null && checkData.getSubmitStatus().equals("3")){//改造完成
    		return false;
    	}
    	if(checkData.getResultStatus()!=null && checkData.getResultStatus().equals("0")){//审批中
    		return false;
    	}
    	if(checkData.getResultStatus()!=null && checkData.getResultStatus().equals("1")){//审批通过
    		return false;
    	}
    	if(checkData.getInstanceId()!=null && !checkData.getInstanceId().equals("")){//说明提交过流程
    		//删除SYS_TRANSELEPOWER_SUBMIT中该条数据
    		List<String> ids = new ArrayList<>();
    		ids.add(checkData.getInstanceId());
    		accountSiteTransDao.deleteByIDs(ids);
    	}
		//根据onlyid改变submitstatus状态2和resultsstaus状态null
    	AccountSiteNeedTrans changeData = new AccountSiteNeedTrans();
    	changeData.setOnlyId(needTrans.getOnlyId());
    	changeData.setSubmitStatus("2");
    	changeData.setResultStatus(null);
    	accountSiteTransDao.updateResultStatusByOnlyId2(changeData);
		return true;
	}

	
	

}
