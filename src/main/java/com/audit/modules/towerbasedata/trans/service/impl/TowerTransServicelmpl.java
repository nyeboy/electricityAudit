package com.audit.modules.towerbasedata.trans.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.TransMidFile;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.tower.entity.TowerSiteVO;
import com.audit.modules.towerbasedata.trans.dao.TowerTransDao;
import com.audit.modules.towerbasedata.trans.entity.TowerNeedTrans;
import com.audit.modules.towerbasedata.trans.entity.TowerTransEleFile;
import com.audit.modules.towerbasedata.trans.entity.TowerTransMidFile;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;
import com.audit.modules.towerbasedata.trans.entity.TowerTransVO;
import com.audit.modules.towerbasedata.trans.service.TowerTransService;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
@Service
public class TowerTransServicelmpl implements TowerTransService{
	
	@Autowired
	private TowerTransDao towerTransDao;
	
	
	
	



	/**   
	 * @Description:需要改造的转供电列表查询
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void findNeedTransList(TowerTransVO towerTransVO, PageUtil<TowerTransVO> pageUtil){
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null != towerTransVO){
			setMap(parameMap, towerTransVO, pageUtil);
		}
		//从SYS_ZGROOM_TOWER_TRANS_MID中查出提交状态
		List<TowerTransVO> sysList = towerTransDao.findNeedTransList(pageUtil);
		//查出来的数据中有直供电数据,分页是错误的,但是数据是对的
	/*	List<TowerTransVO> stepList =  pageUtil.getResults();
		List<TowerTransVO> resultLists = new ArrayList<>();
		Integer totalNum = 0;
		for (TowerTransVO vo : stepList) {
			if(vo.getRoomEleType() != null &&  vo.getRoomEleType().equals("转供电")){
				resultLists.add(vo);
				totalNum+=1;
			}
		}
		pageUtil.setResults(resultLists);*/
//		pageUtil.setTotalRecord(totalNum);
	}
	
	/**   
	 * @Description: 设置查询参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> parameMap,TowerTransVO towerTransVO,PageUtil<TowerTransVO> pageUtil) {
		if(towerTransVO.getRoomName() != null) {
			parameMap.put("roomName", towerTransVO.getRoomName() + "");
		}
		if(towerTransVO.getCountyId() != null) {
			parameMap.put("countyId", towerTransVO.getCountyId() + "");
		}
		if(towerTransVO.getCityId() != null){
			parameMap.put("cityId", towerTransVO.getCityId() + "");
		}
		pageUtil.setObj(parameMap);
	}

	
	
	//验证审批通过的和已经提交的数据，防止重复提交
	@Override
	public String checkIsSubmitData(TowerTransVO towerTransVO) {
		String onlyId = towerTransVO.getOnlyId();
		TowerNeedTrans resultData = towerTransDao.checkNeedSubmitDataStatus(onlyId);
		//1 , 已提交至下一级  2 被撤回  3 改造完成   4，审批失败 null '' 未提交
		if(resultData==null){//空指针异常
			return null;
		}
		return resultData.getSubmitStatus();
		
	}
	
	//保存新增的数据到SYS_ZGROOM_TOWER_TRANS_MID中
	@Override
	public void saveNeedChangeSite(TowerTransVO towerTransVO) {
		
		//根据机房id先查询有之前有没有数据，没有就新增，有就修改
		//不能用机房id或者站点id，他们是多对多关系，创建一个唯一标识符
		//onlyId 唯一不会重复的id，中间表id
		TowerNeedTrans countData = towerTransDao.checkNeedSubmitDataStatus(towerTransVO.getOnlyId());
		if(countData == null || countData.equals("")){
			TowerNeedTrans tNeedTrans = new TowerNeedTrans();
			tNeedTrans.setOnlyId(towerTransVO.getOnlyId());
			tNeedTrans.setCityId(towerTransVO.getCityId());
			tNeedTrans.setCityName(towerTransVO.getCityName());
			tNeedTrans.setCountyId(towerTransVO.getCountyId());
			tNeedTrans.setCountyName(towerTransVO.getCountyName());
			tNeedTrans.setCreateDate(new Date());
			tNeedTrans.setTowerSiteCode(towerTransVO.getTowerSiteCode());
			tNeedTrans.setTowerSiteName(towerTransVO.getTowerSiteName());
			tNeedTrans.setRoomName(towerTransVO.getRoomName());
			tNeedTrans.setRoomEleType(towerTransVO.getRoomEleType());
			tNeedTrans.setSiteEleType(towerTransVO.getSiteEleType());
			tNeedTrans.setTrusteesId(towerTransVO.getTrusteesId());
			tNeedTrans.setTrusteesName(towerTransVO.getTrusteesName());
			tNeedTrans.setSubmitStatus("1");//1 已提交  2 被撤回 3 改造完成  null 未提交
			//新增该条数据
			try {
				towerTransDao.insertNeedTransData(tNeedTrans);
				
			} catch (Exception e) {
				System.err.println(e.getMessage());
			}
		}else{
			TowerNeedTrans tNeedTrans = new TowerNeedTrans();
			tNeedTrans.setOnlyId(towerTransVO.getOnlyId());
			tNeedTrans.setCityId(towerTransVO.getCityId());
			tNeedTrans.setCityName(towerTransVO.getCityName());
			tNeedTrans.setCountyId(towerTransVO.getCountyId());
			tNeedTrans.setCountyName(towerTransVO.getCountyName());
			tNeedTrans.setCreateDate(new Date());
			tNeedTrans.setTowerSiteCode(towerTransVO.getTowerSiteCode());
			tNeedTrans.setTowerSiteName(towerTransVO.getTowerSiteName());
			tNeedTrans.setRoomName(towerTransVO.getRoomName());
			tNeedTrans.setRoomEleType(towerTransVO.getRoomEleType());
			tNeedTrans.setSiteEleType(towerTransVO.getSiteEleType());
			tNeedTrans.setTrusteesId(towerTransVO.getTrusteesId());
			tNeedTrans.setTrusteesName(towerTransVO.getTrusteesName());
			tNeedTrans.setSubmitStatus("1");//1 已提交  2 被撤回 3 改造完成  null 未提交
			//修改该条数据
			try {
				towerTransDao.updateNeedTransData(tNeedTrans);
				
			} catch (Exception e) {
				System.err.println(e.getMessage());
			}
		}
		//把提交状态改变成1，提交成功
		
		
	}
	
	//经办人获取可以提交的转供电数据
		@Override
		public void getNeedSubmitData(TowerNeedTrans towerNeedTrans, PageUtil<TowerNeedTrans> pageUtil) {
			Map<String, Object> parameMap = Maps.newHashMap();
			if(null !=towerNeedTrans) {
				setNeedSubmit(parameMap, towerNeedTrans, pageUtil);
			}
			@SuppressWarnings("unused")
			List<TowerNeedTrans> sysRoleVoList = towerTransDao.getNeedSubmitData(pageUtil);
			List<TowerNeedTrans> allDatas =pageUtil.getResults();
			for (TowerNeedTrans vo : allDatas) {
				String onlyId = vo.getOnlyId();//onlyId就是文件id
				List<TowerTransEleFile> fileDatas = towerTransDao.queryFileByOnlyId(onlyId);
				vo.setTransEleFiles(fileDatas);
			}
			
			
		}
		
		/**   
		 * @Description: 待提交数据设置查询参数  
		 * @param :       
		 * @return :     
		 * @throws  
		*/
		private void setNeedSubmit(Map<String, Object> parameMap,TowerNeedTrans towerNeedTrans,PageUtil<TowerNeedTrans> pageUtil) {
			if(towerNeedTrans.getRoomName() != null) {
				parameMap.put("roomName", towerNeedTrans.getRoomName() + "");
			}
			if(towerNeedTrans.getCountyId() != null) {
				parameMap.put("countyId", towerNeedTrans.getCountyId() + "");
			}
			if(towerNeedTrans.getCityId() != null){
				parameMap.put("cityId", towerNeedTrans.getCityId() + "");
			}
			if(towerNeedTrans.getResultStatus() != null) {
				parameMap.put("resultStatus", towerNeedTrans.getResultStatus() + "");
			}
			pageUtil.setObj(parameMap);
		}
		
		
		//转供电-撤销----------把提交过来的单子返回到新增人员手中
		@Override
		public boolean cancelTransSite(TowerNeedTrans toNeedTrans) {
			//根据onlyid查询数据比对，看是否是前台暴力更改
			TowerNeedTrans checkData = towerTransDao.findDataByOnlyId(toNeedTrans.getOnlyId());
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
	    		towerTransDao.deleteByIDs(ids);
	    	}
			//根据onlyid改变submitstatus状态2和resultsstaus状态null
	    	TowerNeedTrans changeData = new TowerNeedTrans();
	    	changeData.setOnlyId(toNeedTrans.getOnlyId());
	    	changeData.setSubmitStatus("2");
	    	changeData.setResultStatus(null);
	    	towerTransDao.updateResultStatusByOnlyId2(changeData);
			return true;
		}
		
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
				TowerNeedTrans needTrans = towerTransDao.findDataByOnlyId(id);
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
				//删除SYS_ZGROOM_TOWER_TRANS_MID中数据
				towerTransDao.deleteByOnlyIds(idList);
				//删除SYS_TOWER_TRANSELEPOWER_SUBMIT中数据
				if(instanceIds!=null && !instanceIds.isEmpty()){
					towerTransDao.deleteByIDs(instanceIds);
				}
				//预留，删除附件中数据
			} catch (Exception e) {
				return ResultVO.failed(e.getMessage());
			}
			return ResultVO.success();
		}
		
		/**
		 * 根据onlyid修改成功审批后的状态
		 */
		@Override
		public void saveSuccessStatus(TowerNeedTrans needTrans) {
			try {
				//一 保存审批通过状态到SYS_ZGROOM_TOWER_TRANS_MID，改变SUBMIT_STATUS状态为3，RESULT_STATUS为1
				TowerNeedTrans data1 = new TowerNeedTrans();
				data1.setResultStatus("1");
				data1.setSubmitStatus("3");
				data1.setOnlyId(needTrans.getOnlyId());
				towerTransDao.updateNeedTransData(data1);
//				accountSiteTransDao.updateNeedTransData(data1);
				//二 更改SYS_TOWER_ACCOUNT_SITE中站点供电状态ELECTRICITY_TYPE为1
				TowerSiteVO towerSiteVO = new TowerSiteVO();
				towerSiteVO.setZyCode(needTrans.getTowerSiteCode());
				towerSiteVO.setElectricityType("1");
				towerTransDao.updateSiteAccountSuccessStatus(towerSiteVO);
			} catch (Exception e) {
				System.err.println("sql出现错误"+e.getMessage());
			}
		}
		
		/**
		 * 根据onlyId 修改状态
		 */
		@Override
		public void updateResultStatusByOnlyId(TowerNeedTrans tNeedTrans) {
			towerTransDao.updateResultStatusByOnlyId(tNeedTrans);
			
		}
		
		//修改时保存转供电数据
		@Override
		public ResultVO saveTransInfo(TowerNeedTrans tneedTrans, UserVo userVo) {
			//保存供应商，备注，改造日期等信息
			if(tneedTrans.getSupplierIds()==null || tneedTrans.getSupplierNames()==null){
				return ResultVO.failed("请选择供应商！");
			}
			//时间需要转换格式吗
			try {
				tneedTrans.setAddapoUserId(userVo.getUserId());
				tneedTrans.setAddapoUserName(userVo.getUserName());
				//备注可能为空，需要判断
				towerTransDao.updateNeedTransData(tneedTrans);
				//附件信息未保存，需要建一个类专门保存，用在产看详情时
				saveFile(tneedTrans);
				
				
			} catch (Exception e) {
				return ResultVO.failed(e.getMessage());
			}
			System.out.println(userVo);
			return ResultVO.success();
		}
		
		/**
		 * 保存文件信息
		 * @param electrictySaveVO
		 */
		public void saveFile(TowerNeedTrans tneedTrans) {
			if (tneedTrans.getAttachmentId() != null && tneedTrans.getAttachmentId().length > 0) {
				//删除之前保存的文件
				//SYS_TRANS_FILE中删除
				//SYS_TRANS_MIDDLE_FILE中删除
				towerTransDao.deleteMidFileByOnlyId(tneedTrans.getOnlyId());
				List<TowerTransMidFile> towerTransMidFiles = Lists.newArrayList();
				
				for (String fileId : tneedTrans.getAttachmentId()) {
					TowerTransMidFile towerTransMidFile = new TowerTransMidFile();
					towerTransMidFile.setId(StringUtils.getUUid());
					towerTransMidFile.setBusinessId(tneedTrans.getOnlyId());
					towerTransMidFile.setTransFileId(fileId);
					towerTransMidFiles.add(towerTransMidFile);//把每一个文件保存进去
				}
				towerTransDao.saveMiddelFile(towerTransMidFiles);
			}
		}
		
	

}
