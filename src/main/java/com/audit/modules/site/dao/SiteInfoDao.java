package com.audit.modules.site.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.PowerRatingVO;
import com.audit.modules.site.entity.BasedataLableVO;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.site.entity.PowerRatingDetailVO;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.site.entity.SiteMidContractInfo;
import com.audit.modules.site.entity.SiteMidResourceInfo;
import com.audit.modules.site.entity.SiteMidSupplierInfo;
import com.audit.modules.site.entity.SiteMidWattInfo;

/**
 * @author : jiadu
 * @Description : 站点信息查询
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface SiteInfoDao {

	SiteInfoVO queryById(@Param("id")String id);

	List<BasedataLableVO> queryByIdTOEqRoom(@Param("id")String id);
	
	List<BasedataLableVO> queryByIdTORePoint(@Param("id")String id);
	
	List<SiteInfoVO> queryList(PageUtil<SiteInfoVO> pageUtil);
	
	//根据报账点id获取对应的机房
	List<EquRoomDevice> getRoomByAccountSiteId(String accountId);
	
	List<Map<String,Object>> queryListExcel(PageUtil<SiteInfoVO> pageUtil);
	
	//根据机房id查询机房功率
	Double queryPowerRatingToZTO(String accountSiteId);
	Double queryPowerRatingToZTTN(String accountSiteId);
	Double queryPowerRatingToZWB(String accountSiteId);
	Double queryPowerRatingToZWEN(String accountSiteId);
	Double queryPowerRatingToZWLR(String accountSiteId);
	Double queryPowerRatingToZWN(String accountSiteId);

	Long queryListCount(Map<String, Object> paraMap);

	List<SiteInfoVO> queryByCountyID(@Param("countyID") String countyID);
	
	List<SiteInfoVO> queryExitStatusById(@Param("id") String id);//查询退网状态

	void batchSave(List<SiteInfoVO> toSaveInfo);

	void batchUpdate(List<SiteInfoVO> toUpdateInfo);

	void batchDeleteMidForWatth(List<SiteMidWattInfo> siteMidWattInfo);

	void batchSaveMidForWatth(List<SiteMidWattInfo> siteMidWattInfo);

	void batchSaveMidForSupplier(List<SiteMidSupplierInfo> siteMidWattInfo);

	void batchDeleteMidSupplier(List<SiteMidSupplierInfo> siteMidWattInfo);

	void batchSaveMidForContract(List<SiteMidContractInfo> siteMidContractInfos);

	void batchDeleteMidContract(List<SiteMidContractInfo> siteMidContractInfos);

	void batchSaveMidForResource(List<SiteMidResourceInfo> siteMidResourceInfo);

	void saveMidForResource(SiteMidResourceInfo siteMidResourceInfo);

	void batchDeleteMidResource(List<SiteMidResourceInfo> siteMidResourceInfo);

	void batchUpdateRoomStatus(@Param("siteId") String siteId);//改为锁定
	
	void batchUpdateRoomStatusNull(@Param("siteId") String siteId);//解锁
	
	//根据报账点id查询机房设备
	List<PowerRatingDetailVO> getZTOByAccountId(String accountId);
	List<PowerRatingDetailVO> getZTTNByAccountId(String accountId);
	List<PowerRatingDetailVO> getZWBByAccountId(String accountId);
	List<PowerRatingDetailVO> getZWENByAccountId(String accountId);
	List<PowerRatingDetailVO> getZWLRByAccountId(String accountId);
	List<PowerRatingDetailVO> getZWNRByAccountId(String accountId);
	
	// 获取报站点和电表中间表
	List<SiteMidWattInfo> queryMidForSiteAndWatthour(@Param("countyID") String countyID);

	// 获取报站点和电表中间表
	List<SiteMidResourceInfo> queryMidForSiteAndResoure(@Param("countyID") String countyID);

	// 额定功率的标杆列表查询
	List<PowerRatingVO>  queryPowerRatingList(PageUtil<PowerRatingVO> pageUtil);
	
	//查找站点信息表所有信息
	public List<SiteInfoVO> queryAll();
	
	public List<SiteInfoVO> queryListByPage(PageUtil<SiteInfoVO> pageUtil);
	
	public SiteInfoVO getPayTypeById(String id);
}
