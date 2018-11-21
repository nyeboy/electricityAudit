package com.audit.modules.site.service.impl;

import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.common.PageVO;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.BatchUtil;
import com.audit.modules.common.utils.ImportExcelUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.contract.dao.ContractDao;
import com.audit.modules.contract.entity.ContractVO;
import com.audit.modules.electricity.dao.InputElectricityDao;
import com.audit.modules.electricity.entity.ElectricityBenchmark;
import com.audit.modules.electricity.entity.PowerRatingVO;
import com.audit.modules.site.dao.EquRoomDeviceDao;
import com.audit.modules.site.dao.ResourcePointDao;
import com.audit.modules.site.dao.SiteInfoDao;
import com.audit.modules.site.entity.*;
import com.audit.modules.site.service.EquipmentRoomService;
import com.audit.modules.site.service.SiteInfoService;
import com.audit.modules.supplier.dao.SupplierDao;
import com.audit.modules.supplier.entity.SupplierVO;
import com.audit.modules.system.dao.ZgSpaceDao;
import com.audit.modules.watthourmeter.dao.WatthourMeterDao;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import org.apache.ibatis.annotations.Param;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author : jiadu
 * @Description : 站点信息查询
 * @date : 2017/3/10 Copyright (c) , IsoftStone All Right reserved.
 */
@Transactional
@Service
public class SiteInfoServiceImpl implements SiteInfoService {

	private final static Integer START_ROW = 5;

	private final static String CITY_COUNTY_NOT_EXIT = "市区在系统中不存在!";
	private final static String RESOURCE_UNQUIEN = "资源点或机房已被其他报账点使用！";
	private final static String CAN_NOT_DIFFERENCE = "无法判断是机房还是资源点!";
	private final static String SAME_READ = "相同电表标识符、电表户号的多条数据，当前读数必须也相同!";
	private final static String SAME_DATE = "相同电表标识符、电表户号的多条数据，当前归属日期必须也相同!";
	private final static String SAME_SITE_ALIAS = "同一报账点名称的数据，报账点别名必须一致!";
	private final static String SAME_OLD_FINANCE_NAME = "同一报账点名称的数据，原财务站点名称必须一致!";
	private final static String SITE_NAME_REPEAT = "报账点在系统中已存在！";
	private final static String WATTHOUR_REPEAT = "电表在系统中已存在！";
	private final static String SITE_MIDLE_WATTHOUR_REPEAT = "报账点与电表关系在系统中已存在！";
	private final static String WATT_HOUR_METER_EMPTY = "电表当前读数必须为数字切大于0";


	@Autowired
	private SiteInfoDao siteInfoDao;
	@Autowired
	private EquipmentRoomService equipmentRoomService;
	@Autowired
	private InputElectricityDao inputElectricityDao;

	@Autowired
	private WatthourMeterDao watthourMeterDao;

	@Autowired
	private ZgSpaceDao zgSpaceDao;

	@Autowired
	private SupplierDao supplierDao;

	@Autowired
	private ContractDao contractDao;

	@Autowired
	private EquRoomDeviceDao equRoomDeviceDao;

	@Autowired
	private ResourcePointDao resourcePointDao;

	@Resource
	private SqlSessionTemplate sqlSessionTemplate;

	private InitData initData = null;

	private Map<String, SiteInfoVO> savedSiteInfo = null;

	private List<String> savedSiteMidSuppler = null;

	private List<String> savedSiteMidContract = null;

	private List<String> savedSiteMidResource = null;

	private Map<String, ExcelErrorInfo> excelErrorInfoMap = null;

	private Set<Integer> toDelete = null;

	private String countID = null;
	private String cityID = null;

	private Map<String, SiteInfoVO> map;

	@Override
	public SiteInfoVO queryById(String siteId) {
		return siteInfoDao.queryById(siteId);
	}
	
	@Override
	public List<BasedataLableVO> queryByIdTOEqRoom(String siteId) {
		return siteInfoDao.queryByIdTOEqRoom(siteId);
	}
	
	@Override
	public List<BasedataLableVO> queryByIdTORePoint(String siteId) {
		return siteInfoDao.queryByIdTORePoint(siteId);
	}


	/**
	 * @param :
	 * @return :
	 * @throws @Description:
	 *             导入excel
	 */
	@Override
	public ResultVO importExcel(MultipartFile file) throws Exception {
		if (file == null || file.isEmpty()) {
			return ResultVO.failed("请上传文件！");
		}
		InputStream in = null;
		List<Object[]> listob = null;
		in = file.getInputStream();
		listob = new ImportExcelUtil().getBankListByExcel(in, file.getOriginalFilename(), START_ROW);
		initData(listob);
		listob = checkExcelData(listob);
		mosaicBean(listob);
		if (!excelErrorInfoMap.isEmpty()) {
			return ResultVO.success(excelErrorInfoMap.values().toString());
		} else {
			return ResultVO.success();
		}
	}

	private void initData(List<Object[]> listob) {
		initData = new InitData();
		savedSiteInfo = Maps.newHashMap();
		savedSiteMidSuppler = Lists.newArrayList();
		savedSiteMidContract = Lists.newArrayList();
		savedSiteMidResource = Lists.newArrayList();
		String cityN = listob.get(0)[1] + "";// 首先市
		String countyN = listob.get(0)[2] + "";// 首先获取区
		try {
			initCity(cityN, countyN);
		} catch (Exception e) {
			putErrorMessage(e.getMessage(), 1);
			return;
		}
		initMidForSiteAndWatthour();
		initSiteInfo();
		initWatthour();
		// initSupplier();
		// initContract();
		initResource();
	}

	private void putErrorMessage(String message, Integer row) {
		ExcelErrorInfo excelErrorInfo = null;
		if (excelErrorInfoMap.get(message) != null) {
			excelErrorInfo = excelErrorInfoMap.get(message);
			excelErrorInfo.getRows().add(row);
		} else {
			excelErrorInfo = new ExcelErrorInfo();
			excelErrorInfo.setMessage(message);
			List<Integer> rows = Lists.newArrayList();
			rows.add(row);
			excelErrorInfo.setRows(rows);
		}
		excelErrorInfoMap.put(message, excelErrorInfo);
	}

	// 获取报站点和电表中间表
	private void initMidForSiteAndWatthour() {
		List<SiteMidWattInfo> siteMidWattInfos = siteInfoDao.queryMidForSiteAndWatthour(countID);
		Map<String, SiteMidWattInfo> siteMidWattInfoMap = Maps.newHashMap();
		for (SiteMidWattInfo siteMidWattInfo : siteMidWattInfos) {
			siteMidWattInfoMap.put(siteMidWattInfo.getAccountSiteId() + "_" + siteMidWattInfo.getWatthourMeterId(),
					siteMidWattInfo);
		}
		initData.setSiteMidWattInfoMap(siteMidWattInfoMap);
	}

	private void initSiteInfo() {
		// 获取所有报账点信息
		List<SiteInfoVO> siteInfoVOs = siteInfoDao.queryByCountyID(countID);
		Map<String, SiteInfoVO> siteInfoVOMap = Maps.newHashMap();
		for (SiteInfoVO siteInfoVO : siteInfoVOs) {
			siteInfoVOMap.put(siteInfoVO.getAccountName(), siteInfoVO);// 唯一标识符
																		// ：
																		// 报账点名称
		}
		initData.setSiteInfoVOMap(siteInfoVOMap);
	}

	private void initCity(String cityN, String countyN) throws Exception {
		Map<String, String> cityMap = Maps.newHashMap();
		// 获取所有市区
		List<Map<String, Object>> cities = zgSpaceDao.findAllCity();
		for (Map<String, Object> c : cities) {
			String city = c.get("CITY_NAME") + "";
			String countyName = c.get("ZH_LABEL") + "";
			String cId = c.get("CITY_ID") + "";
			String countyId = c.get("INT_ID") + "";
			cityMap.put(city + "_" + countyName, cId + "_" + countyId);
		}
		System.out.println(cityN + "-----" + countyN);
		if (cityMap.get(cityN + "_" + countyN) != null) {
			String key = cityMap.get(cityN + "_" + countyN);
			countID = key.split("_")[1];
			cityID = key.split("_")[0];
			System.out.println(cityID + "====" + countID);
		} else {
			throw new Exception(CITY_COUNTY_NOT_EXIT);
		}
		initData.setCityMap(cityMap);
	}

	private void initWatthour() {
		// 获取所有电表信息
		List<WatthourMeterVO> watthourMeterVOs = watthourMeterDao.findAll();
		Map<String, WatthourMeterVO> watthourMeterVOMap = Maps.newHashMap();
		for (WatthourMeterVO watthourMeterVO : watthourMeterVOs) {// 唯一标识
																	// 电表的标识符+电表缴费户号
			watthourMeterVOMap.put(watthourMeterVO.getCode() + "_"
					+ (watthourMeterVO.getPaymentAccountCode() == null ? "" : watthourMeterVO.getPaymentAccountCode()),
					watthourMeterVO);
		}
		initData.setWatthourMeterVOMap(watthourMeterVOMap);
	}

	private void initResource() {
		List<ResourcePointInfo> resourcePointInfos = resourcePointDao.findAllByCityID(cityID);
		List<EquRoomDevice> equRoomDevices = equRoomDeviceDao.findAllByCountyID(countID);
		List<SiteMidResourceInfo> siteMidResourceInfos = siteInfoDao.queryMidForSiteAndResoure(countID);
		Map<String, String> equRoomOrResourcePointMap = Maps.newHashMap();
		for (EquRoomDevice equRoomDevice : equRoomDevices) {
			equRoomOrResourcePointMap.put(equRoomDevice.getEquipmentRoomName(), equRoomDevice.getId() + "");
		}
		for (ResourcePointInfo resourcePointInfo : resourcePointInfos) {
			equRoomOrResourcePointMap.put(resourcePointInfo.getZhLabel(), resourcePointInfo.getId());
		}
		initData.setEquRoomOrResourcePointMap(equRoomOrResourcePointMap);
		Set<String> resourceIDs = Sets.newHashSet();
		for (SiteMidResourceInfo siteMidResourceInfo : siteMidResourceInfos) {
			resourceIDs.add(siteMidResourceInfo.getResourceId());
		}
		initData.setResourceIDs(resourceIDs);
	}

	private void initContract() {
		List<ContractVO> contractVOs = contractDao.findAll();
		Map<String, ContractVO> contractVOMap = Maps.newHashMap();
		for (ContractVO contractVO : contractVOs) {
			contractVOMap.put(contractVO.getId(), contractVO);
		}
		initData.setContractVOMap(contractVOMap);
	}

	private void initSupplier() {
		// 获取所有供应商信息
		List<SupplierVO> supplierVOs = supplierDao.findAll();
		Map<String, SupplierVO> supplierVOMap = Maps.newHashMap();
		// 唯一标识 供应商ID+供应商组织结构编码+供应商区域编码
		for (SupplierVO supplierVO : supplierVOs) {
			// 供应商ID
			String code = supplierVO.getCode() == null ? "" : supplierVO.getCode() + "";
			// 供应商组织结构编码
			String organizationCode = supplierVO.getOrganizationCode() == null ? ""
					: supplierVO.getOrganizationCode() + "";
			// 供应商区域编码
			String regionCode = supplierVO.getRegionCode() == null ? "" : supplierVO.getRegionCode() + "";
			supplierVOMap.put(code + "_" + organizationCode + "_" + regionCode, supplierVO);
		}
		initData.setSupplierVOMap(supplierVOMap);
	}

	private void mosaicBean(List<Object[]> listob) {
		Set<WatthourMeterVO> toUpdateWattInfo = Sets.newHashSet();// 需要修改的电费信息
		Set<WatthourMeterVO> toSaveWattInfo = Sets.newHashSet();// 需要保存的电费信息
		Set<SiteInfoVO> toUpdateSiteInfo = Sets.newHashSet();// 需要修改的站点信息
		Set<SiteInfoVO> toSaveInfo = Sets.newHashSet();// 需要保存的站点信息
		List<SiteMidWattInfo> siteMidWattInfo = Lists.newArrayList();// 电表报账点
		List<SiteMidSupplierInfo> supplierInfos = Lists.newArrayList();// 报账点供应商中间
		List<SiteMidContractInfo> siteMidContractInfos = Lists.newArrayList();// 报账点合同中间
		List<SiteMidResourceInfo> siteMidResourceInfos = Lists.newArrayList();// 报账点\资源机房中间表
		for (int i = 0; i < listob.size(); i++) {
			Object[] o = listob.get(i);
			// -----------SYS_ACCOUNT_SITE(报账点) 唯一标识符 ： 报账点名称
			SiteInfoVO siteInfoVO = null;
			try {
				siteInfoVO = handleSiteInfo(o, toUpdateSiteInfo, toSaveInfo, i);
			} catch (Exception e) {
				putErrorMessage(e.getMessage(), i + START_ROW + 1);
				Log.error("第" + i + "行 " + e.getMessage());
				continue;
			}
			// -------SYS_WATTHOUR_METER(电表) 唯一标识 电表的标识符+电表缴费户号
			handleWatthour(o, toUpdateWattInfo, toSaveWattInfo, siteInfoVO, siteMidWattInfo, i);

			// ----------SYS_CONTRACT(合同) 唯一标识 合同id
			// handleContract(o, siteMidContractInfos, siteInfoVO);

			// -------------SYS_SUPPLIER(供应商) 唯一标识 供应商ID+供应商组织结构编码+供应商区域编码
			// handleSupplier(o, supplierInfos, siteInfoVO);

			// String dianbiaohuhao = o[18]+"";//重复的电表户号？？？？？？？？？？？
			// ---------------资源点或机房信息
			handleEquRoomAndResourcePoint(o, siteMidResourceInfos, siteInfoVO, i);

		}
		ExecutorService executorService = Executors.newFixedThreadPool(4);
		executorService.execute(new SaveorUpdateSiteInfo(toSaveInfo, toUpdateSiteInfo));
		executorService.execute(new InsertOrUpdateWattInfo(toSaveWattInfo, toUpdateWattInfo));
		executorService.execute(new InsertOrUpdateSiteInfoMidWattInfo(siteMidWattInfo));
		executorService.execute(new InsertOrUpdateSiteInfoMidResource(siteMidResourceInfos));
		// toInsertOrUpdateSiteInfo(toSaveInfo, toUpdateSiteInfo);
		// toInsertOrUpdateWattInfo(toSaveWattInfo, toUpdateWattInfo);
		// toInsertOrUpdateSiteInfoMidWattInfo(siteMidWattInfo);
		// toInsertOrUpdateSiteInfoMidContractAndSupplier(supplierInfos,siteMidContractInfos);
		// toInsertOrUpdateSiteInfoMidResource(siteMidResourceInfos);
		System.out.println("完成");
	}

	class SaveorUpdateSiteInfo implements Runnable {
		private Set<SiteInfoVO> toSaveInfo;
		private Set<SiteInfoVO> toUpdateSiteInfo;

		SaveorUpdateSiteInfo(Set<SiteInfoVO> toSaveInfo, Set<SiteInfoVO> toUpdateSiteInfo) {
			this.toSaveInfo = toSaveInfo;
			this.toUpdateSiteInfo = toUpdateSiteInfo;
		}

		@Override
		public void run() {
			if (toSaveInfo != null && toSaveInfo.size() > 0) {// 保存报账点
				new BatchUtil().batchSave(toSaveInfo, "com.audit.modules.site.dao.SiteInfoDao", "batchSave",
						sqlSessionTemplate);
			}
			/*
			 * if (toUpdateSiteInfo != null && toUpdateSiteInfo.size() > 0)
			 * {//修改报账点 new BatchUtil().batchupdate(toUpdateSiteInfo,
			 * "com.audit.modules.site.dao.SiteInfoDao", "batchUpdate",
			 * sqlSessionTemplate); }
			 */
		}
	}

	class InsertOrUpdateWattInfo implements Runnable {
		private Set<WatthourMeterVO> toUpdateWattInfo;// 需要修改的电费信息
		private Set<WatthourMeterVO> toSaveWattInfo;// 需要保存的电费信息

		InsertOrUpdateWattInfo(Set<WatthourMeterVO> toSaveWattInfo, Set<WatthourMeterVO> toUpdateWattInfo) {
			this.toUpdateWattInfo = toUpdateWattInfo;
			this.toSaveWattInfo = toSaveWattInfo;
		}

		@Override
		public void run() {
			if (toSaveWattInfo != null && toSaveWattInfo.size() > 0) {// 保存电费
				new BatchUtil().batchSave(toSaveWattInfo, "com.audit.modules.watthourmeter.dao.WatthourMeterDao",
						"batchSave", sqlSessionTemplate);
			}
			/*
			 * if (toUpdateWattInfo != null && toUpdateWattInfo.size() > 0)
			 * {//修改电费 new BatchUtil().batchupdate(toUpdateWattInfo,
			 * "com.audit.modules.watthourmeter.dao.WatthourMeterDao",
			 * "batchUpdate", sqlSessionTemplate); }
			 */
		}
	}

	class InsertOrUpdateSiteInfoMidWattInfo implements Runnable {
		private List<SiteMidWattInfo> siteMidWattInfo;

		InsertOrUpdateSiteInfoMidWattInfo(List<SiteMidWattInfo> siteMidWattInfo) {
			this.siteMidWattInfo = siteMidWattInfo;
		}

		@Override
		public void run() {
			if (siteMidWattInfo != null && siteMidWattInfo.size() > 0) {// 保存报账点和电费中间表
				// new BatchUtil().batchDelete(siteMidWattInfo,
				// "com.audit.modules.site.dao.SiteInfoDao",
				// "batchDeleteMidForWatth", sqlSessionTemplate);
				new BatchUtil().batchSave(siteMidWattInfo, "com.audit.modules.site.dao.SiteInfoDao",
						"batchSaveMidForWatth", sqlSessionTemplate);
			}
		}
	}

	class InsertOrUpdateSiteInfoMidResource implements Runnable {
		private List<SiteMidResourceInfo> siteMidResourceInfos;

		InsertOrUpdateSiteInfoMidResource(List<SiteMidResourceInfo> siteMidResourceInfos) {
			this.siteMidResourceInfos = siteMidResourceInfos;
		}

		@Override
		public void run() {
			if (siteMidResourceInfos != null && siteMidResourceInfos.size() > 0) { // 保存报账点资源、机房中间表
				// new BatchUtil().batchDelete(siteMidResourceInfos,
				// "com.audit.modules.site.dao.SiteInfoDao",
				// "batchDeleteMidResource", sqlSessionTemplate);
				for (SiteMidResourceInfo resourceInfos : siteMidResourceInfos) {
					try {
						siteInfoDao.saveMidForResource(resourceInfos);
					} catch (Exception e) {
						putErrorMessage(RESOURCE_UNQUIEN, resourceInfos.getSort());
					}
				}
			}
		}
	}

	// 保存报账点资源、机房中间表
	private void toInsertOrUpdateSiteInfoMidResource(List<SiteMidResourceInfo> siteMidResourceInfos) {
		if (siteMidResourceInfos != null && siteMidResourceInfos.size() > 0) { // 保存报账点资源、机房中间表
			// new BatchUtil().batchDelete(siteMidResourceInfos,
			// "com.audit.modules.site.dao.SiteInfoDao",
			// "batchDeleteMidResource", sqlSessionTemplate);
			for (SiteMidResourceInfo resourceInfos : siteMidResourceInfos) {
				try {
					siteInfoDao.saveMidForResource(resourceInfos);
				} catch (Exception e) {
					putErrorMessage(RESOURCE_UNQUIEN, resourceInfos.getSort());
				}
			}
		}
	}

	// 保存报账点和供应商中间表、合同中间表
	private void toInsertOrUpdateSiteInfoMidContractAndSupplier(List<SiteMidSupplierInfo> supplierInfos,
			List<SiteMidContractInfo> siteMidContractInfos) {
		if (supplierInfos != null && supplierInfos.size() > 0) {// 保存报账点和供应商中间表
			new BatchUtil().batchDelete(supplierInfos, "com.audit.modules.site.dao.SiteInfoDao",
					"batchDeleteMidSupplier", sqlSessionTemplate);
			new BatchUtil().batchSave(supplierInfos, "com.audit.modules.site.dao.SiteInfoDao",
					"batchSaveMidForSupplier", sqlSessionTemplate);
		}
		if (siteMidContractInfos != null && siteMidContractInfos.size() > 0) {// 保存报账点合同中间表
			new BatchUtil().batchDelete(siteMidContractInfos, "com.audit.modules.site.dao.SiteInfoDao",
					"batchDeleteMidContract", sqlSessionTemplate);
			new BatchUtil().batchSave(siteMidContractInfos, "com.audit.modules.site.dao.SiteInfoDao",
					"batchSaveMidForContract", sqlSessionTemplate);
		}
	}

	// 保存报账点和电费中间表
	private void toInsertOrUpdateSiteInfoMidWattInfo(List<SiteMidWattInfo> siteMidWattInfo) {
		if (siteMidWattInfo != null && siteMidWattInfo.size() > 0) {// 保存报账点和电费中间表
			new BatchUtil().batchDelete(siteMidWattInfo, "com.audit.modules.site.dao.SiteInfoDao",
					"batchDeleteMidForWatth", sqlSessionTemplate);
			new BatchUtil().batchSave(siteMidWattInfo, "com.audit.modules.site.dao.SiteInfoDao", "batchSaveMidForWatth",
					sqlSessionTemplate);
		}
	}

	// 保存报账点
	private void toInsertOrUpdateSiteInfo(Set<SiteInfoVO> toSaveInfo, Set<SiteInfoVO> toUpdateSiteInfo) {
		if (toSaveInfo != null && toSaveInfo.size() > 0) {// 保存报账点
			new BatchUtil().batchSave(toSaveInfo, "com.audit.modules.site.dao.SiteInfoDao", "batchSave",
					sqlSessionTemplate);
		}
		if (toUpdateSiteInfo != null && toUpdateSiteInfo.size() > 0) {// 修改报账点
			new BatchUtil().batchupdate(toUpdateSiteInfo, "com.audit.modules.site.dao.SiteInfoDao", "batchUpdate",
					sqlSessionTemplate);
		}
	}

	// 保存电费
	private void toInsertOrUpdateWattInfo(Set<WatthourMeterVO> toSaveWattInfo, Set<WatthourMeterVO> toUpdateWattInfo) {
		if (toSaveWattInfo != null && toSaveWattInfo.size() > 0) {// 保存电费
			new BatchUtil().batchSave(toSaveWattInfo, "com.audit.modules.watthourmeter.dao.WatthourMeterDao",
					"batchSave", sqlSessionTemplate);
		}
		if (toUpdateWattInfo != null && toUpdateWattInfo.size() > 0) {// 修改电费
			new BatchUtil().batchupdate(toUpdateWattInfo, "com.audit.modules.watthourmeter.dao.WatthourMeterDao",
					"batchUpdate", sqlSessionTemplate);
		}
	}

	// 机房或资源点名称
	private void handleEquRoomAndResourcePoint(Object[] o, List<SiteMidResourceInfo> siteMidResourceInfos,
			SiteInfoVO siteInfoVO, int i) {
		// 唯一标识 合同id
		String resourceName = o[7] == null ? "" : o[7] + "";// 机房或资源点名称
		if (initData.getEquRoomOrResourcePointMap().get(resourceName) != null) {
			String id = initData.getEquRoomOrResourcePointMap().get(resourceName);
			SiteMidResourceInfo siteMidResourceInfo = new SiteMidResourceInfo();
			if (savedSiteMidResource.contains(siteInfoVO.getId() + "_" + id)) {
				return;
			}
			if (initData.getResourceIDs().contains(id)) {
				putErrorMessage(RESOURCE_UNQUIEN, i + START_ROW + 1);
				return;
			}
			siteMidResourceInfo.setId(StringUtils.getUUid());
			siteMidResourceInfo.setAccountSiteId(siteInfoVO.getId());
			if (resourceName.indexOf("机房") != -1) {
				siteMidResourceInfo.setType(1);
			} else if (resourceName.indexOf("资源点") != -1) {
				siteMidResourceInfo.setType(2);
			} else {
				putErrorMessage(CAN_NOT_DIFFERENCE, i + START_ROW + 1);
				return;
			}
			siteMidResourceInfo.setResourceName(resourceName);
			siteMidResourceInfo.setResourceId(id);
			siteMidResourceInfo.setSort(i + START_ROW + 1);
			siteMidResourceInfos.add(siteMidResourceInfo);
			savedSiteMidResource.add(siteInfoVO.getId() + "_" + id);
		}
	}

	private List<Object[]> checkExcelData(List<Object[]> listob) {
		toDelete = Sets.newHashSet();
		excelErrorInfoMap = Maps.newHashMap();
		// 同一报账点名称的数据，报账点别名必须一致
		// 同一报账点名称的数据，原财务站点名称必须一致
		// 相同电表标识符、电表户号的多条数据，必须当前读数、当前电费归属日期数据也相同
		Map<String, List<SiteInfoVO>> siteChekMap = Maps.newHashMap();
		Map<String, List<WatthourMeterVO>> wattourChekMap = Maps.newHashMap();
		for (int i = 0; i < listob.size(); i++) {
			Object[] o = listob.get(i);
			String accountName = o[3] == null ? "" : o[3] + "";// 报账点名称
			String accountAlias = o[4] == null ? "" : o[4] + "";// 报账点别名
			String oldFinanceName = o[9] == null ? "" : o[9] + "";// 原财务站点名称
			String watthourCode = o[5] == null ? "" : o[5] + "";// 电表出厂编号或其他能识别该电表的标识符
			String paymentAccountCode = o[6] == null ? "" : o[6] + "";// 电表缴费户号
			String currentReading = o[19] == null ? "" : o[19] + "";// 当前读数
			String reimbursementDate = o[20] == null ? "" : o[20] + "";// 当前电费归属期
			SiteInfoVO siteInfoVO = new SiteInfoVO();
			siteInfoVO.setAccountAlias(accountAlias);
			siteInfoVO.setOldFinanceName(oldFinanceName);
			siteInfoVO.setId(i + "");
			List<SiteInfoVO> siteList = null;
			if (siteChekMap.get(accountName) != null) {
				siteList = siteChekMap.get(accountName);
			} else {
				siteList = Lists.newArrayList();
			}
			siteList.add(siteInfoVO);
			siteChekMap.put(accountName, siteList);
			List<WatthourMeterVO> witthourList = null;
			WatthourMeterVO watthourMeterVO = new WatthourMeterVO();
			watthourMeterVO.setCurrentReadingStr(currentReading);
			watthourMeterVO.setReimbursementDateStr(reimbursementDate);
			watthourMeterVO.setId(i + "");
			if (StringUtils.isBlank(watthourCode) && StringUtils.isBlank(paymentAccountCode)) {
				continue;
			}
			if (wattourChekMap.get(watthourCode + "_" + paymentAccountCode) != null) {
				witthourList = wattourChekMap.get(accountName);
			} else {
				witthourList = Lists.newArrayList();
			}
			witthourList.add(watthourMeterVO);
			wattourChekMap.put(watthourCode + "_" + paymentAccountCode, witthourList);
		}
		checkSite(siteChekMap);
		checkWittour(wattourChekMap);
		deleteExcel(listob);
		return listob;
	}

	private void deleteExcel(List<Object[]> listob) {
		List<Object[]> toDeleteL = Lists.newArrayList();
		if (toDelete != null && toDelete.size() > 0) {
			for (int row : toDelete) {
				listob.remove(row);
			}
		}
		if (toDeleteL.size() > 0) {
			listob.removeAll(toDeleteL);
		}
	}

	private void checkWittour(Map<String, List<WatthourMeterVO>> wattourChekMap) {
		for (String key : wattourChekMap.keySet()) {
			List<WatthourMeterVO> siteList = wattourChekMap.get(key);
			String currentReading = null;// 当前读数
			String reimbursementDate = null;// 当前电费归属期
			boolean delete = false;
			for (int i = 0; i < siteList.size(); i++) {
				if (currentReading == null) {
					currentReading = siteList.get(i).getCurrentReadingStr();
				} else if (!currentReading.equals(siteList.get(i).getCurrentReadingStr())) {
					putErrorMessage(SAME_READ, (Integer.parseInt(siteList.get(i).getId()) + START_ROW + 1));
					delete = true;
				}
				if (reimbursementDate == null) {
					reimbursementDate = siteList.get(i).getReimbursementDateStr();
				} else if (!reimbursementDate.equals(siteList.get(i).getReimbursementDateStr())) {
					putErrorMessage(SAME_DATE, (Integer.parseInt(siteList.get(i).getId()) + START_ROW + 1));
					delete = true;
				}
//				if (currentReading == null || currentReading.equals("")) {
//					putErrorMessage(WATT_HOUR_METER_EMPTY, (Integer.parseInt(siteList.get(i).getId()) + START_ROW + 1));
//					delete = true;
//
//				} else {
//					try {
//						int current = Integer.parseInt(currentReading);
//						if (current <= 0) {
//							putErrorMessage(WATT_HOUR_METER_EMPTY, (Integer.parseInt(siteList.get(i).getId()) + START_ROW + 1));
//							delete = true;
//						}
//					} catch (Exception e) {
//						putErrorMessage(WATT_HOUR_METER_EMPTY, (Integer.parseInt(siteList.get(i).getId()) + START_ROW + 1));
//						delete = true;
//					}
//				}

			}
			if (delete) {
				for (int i = 0; i < siteList.size(); i++) {
					toDelete.add(Integer.parseInt(siteList.get(i).getId()));
				}
			}
		}
	}

	private void checkSite(Map<String, List<SiteInfoVO>> siteChekMap) {
		for (String key : siteChekMap.keySet()) {
			List<SiteInfoVO> siteList = siteChekMap.get(key);
			String accountAlias = null;
			String oldFinanceName = null;
			boolean delete = false;
			for (int i = 0; i < siteList.size(); i++) {
				if (accountAlias == null) {
					accountAlias = siteList.get(i).getAccountAlias();
				} else if (!accountAlias.equals(siteList.get(i).getAccountAlias())) {
					putErrorMessage(SAME_SITE_ALIAS, (Integer.parseInt(siteList.get(i).getId()) + START_ROW + 1));
					toDelete.add(Integer.parseInt(siteList.get(i).getId()));
					delete = true;
				}
				if (oldFinanceName == null) {
					oldFinanceName = siteList.get(i).getOldFinanceName();
				} else if (!accountAlias.equals(siteList.get(i).getOldFinanceName())) {
					putErrorMessage(SAME_OLD_FINANCE_NAME, (Integer.parseInt(siteList.get(i).getId()) + START_ROW + 1));
					toDelete.add(Integer.parseInt(siteList.get(i).getId()));
					delete = true;
				}
			}
			if (delete) {
				for (int i = 0; i < siteList.size(); i++) {
					toDelete.add(Integer.parseInt(siteList.get(i).getId()));
				}
			}
		}
	}

	private void handleContract(Object[] o, List<SiteMidContractInfo> siteMidContractInfos, SiteInfoVO siteInfoVO) {
		// 唯一标识 合同id
		String contractID = o[11] == null ? "" : o[11] + "";// 合同ID
		String contractName = o[12] + "";// 合同名称
		String startDate = o[13] + "";// 合同生效日期(yyyy-MM-dd)
		String endDate = o[14] + "";// 合同失效日期(yyyy-MM-dd)
		String isClud = o[15] + "";// 是否包干；1 包干；0 非包干
		String cludPrice = o[16] + "";// 包干价
		String paymentCycle = o[17] + "";// 续费周期；1 月；3 季度；6 半年；12 年；-1 一次性；
		String price = o[19] + "";// 非包干模式才填写，电表对应的单价。只能填写数值格式的数据
		if (initData.getContractVOMap().get(contractID) != null) {
			ContractVO contractVO = initData.getContractVOMap().get(contractID);
			SiteMidContractInfo siteMidContractInfo = new SiteMidContractInfo();
			if (savedSiteMidContract.contains(siteInfoVO.getId() + "_" + contractVO.getId())) {
				return;
			}
			siteMidContractInfo.setId(StringUtils.getUUid());
			siteMidContractInfo.setAccountSiteId(siteInfoVO.getId());
			siteMidContractInfo.setContractId(contractVO.getId());
			siteMidContractInfos.add(siteMidContractInfo);
			savedSiteMidContract.add(siteInfoVO.getId() + "_" + contractVO.getId());
		}
	}

	private void handleSupplier(Object[] o, List<SiteMidSupplierInfo> supplierInfos, SiteInfoVO siteInfoVO) {
		// 供应商ID+供应商组织结构编码+供应商区域编码
		String supplierName = o[20] + "";// 供应商名称
		String supplierID = o[21] == null ? "" : o[21] + "";// 供应商ID
		String supplierCode = o[22] == null ? "" : o[22] + "";// 供应商组织结构编码
		String regionCode = o[23] == null ? "" : o[23] + "";// 供应商区域编码
		if (initData.getSupplierVOMap().get(supplierID + "_" + supplierCode + "_" + regionCode) != null) {
			SupplierVO supplierVO = initData.getSupplierVOMap().get(supplierID + "_" + supplierCode + "_" + regionCode);
			SiteMidSupplierInfo siteMidSupplierInfo = new SiteMidSupplierInfo();
			if (savedSiteMidSuppler.contains(siteInfoVO.getId() + "_" + supplierVO.getId())) {
				return;
			}
			siteMidSupplierInfo.setId(StringUtils.getUUid());
			siteMidSupplierInfo.setAccountSiteId(siteInfoVO.getId());
			siteMidSupplierInfo.setSupplierId(supplierVO.getId());
			supplierInfos.add(siteMidSupplierInfo);
			savedSiteMidSuppler.add(siteInfoVO.getId() + "_" + supplierVO.getId());
		}
	}

	private SiteInfoVO handleSiteInfo(Object[] o, Set<SiteInfoVO> toUpdateSiteInfo, Set<SiteInfoVO> toSaveInfo, int i)
			throws Exception {
		String ciyt = o[1] + "";// 城市
		String county = o[2] + "";// 区县
		String accountName = o[3] + "";// 报账点名称
		String accountAlias = o[4] + "";// 报账点别名
		String siteName = o[8] + "";// 站点名称
		String oldFinanceName = o[9] + "";// 原财务站点名称
		String productNature = o[10] + "";// 产权性质（0.自维 1.塔维）产权性质
		String electricityType = o[11] + "";// 用电类型 (1.直供电、2.转供电)
		String supplyCompany = o[12] + "";// 供电公司/业主 1.供电公司 2. 业主
		String shareType = o[13] + "";// 共享方式 1共享、2.独享。）
		String payType = o[14] + "";// 电费缴纳方式 (1.代维代缴、2.铁塔代缴、3.自缴)
		// String cycle = o[35] + "";//报销周期。1 月；3 季度；6 半年；12 年
		// String allocationProportion = o[36] + "";//分摊比例
		String cityAndCounty = initData.getCityMap().get(ciyt + "_" + county);
		if (cityAndCounty == null) {
			throw new Exception(CITY_COUNTY_NOT_EXIT);
		}
		ciyt = cityAndCounty.split("_")[0];
		county = cityAndCounty.split("_")[1];
		SiteInfoVO siteInfoVO = null;
		if (initData.getSiteInfoVOMap().get(accountName) != null) {
			putErrorMessage(SITE_NAME_REPEAT, i + START_ROW + 1);
			siteInfoVO = initData.getSiteInfoVOMap().get(accountName);
			siteInfoVO.setData(accountName, accountAlias, productNature, ciyt, county, oldFinanceName, siteName,
					electricityType, supplyCompany, shareType, payType);
			if (savedSiteInfo.get(siteInfoVO.getAccountName()) != null) {
				return savedSiteInfo.get(siteInfoVO.getAccountName());
			}
			// toUpdateSiteInfo.add(siteInfoVO);
		} else {
			siteInfoVO = new SiteInfoVO(StringUtils.getUUid(), accountName, accountAlias, productNature, ciyt, county,
					oldFinanceName, siteName, electricityType, supplyCompany, shareType, payType);
			if (savedSiteInfo.get(siteInfoVO.getAccountName()) != null) {
				return savedSiteInfo.get(siteInfoVO.getAccountName());
			}
			toSaveInfo.add(siteInfoVO);
		}
		savedSiteInfo.put(siteInfoVO.getAccountName(), siteInfoVO);
		return siteInfoVO;
	}

	private void handleWatthour(Object[] o, Set<WatthourMeterVO> toUpdateWattInfo, Set<WatthourMeterVO> toSaveWattInfo,
			SiteInfoVO siteInfoVO, List<SiteMidWattInfo> siteMidWattInfos, int i) {
		String watthourCode = o[5] + "";// 电表出厂编号或其他能识别该电表的标识符
		String paymentAccountCode = o[6] + "";// 电表缴费户号
		String watthourType = o[15] + "";// 电表类型。1 普通；2 智能
		String watthourStatus = o[16] + "";// 电表状态；1 正常；0 损坏
		String rate = o[17] + "";// 倍率。
		String maxReading = o[18] + "";// 电表最大读数，发生翻表情况录入后记录
		String currentReading = o[19] + "";// 当前读数
		String reimbursementDate = o[20] + "";// 当前电费归属期
		String belongAccount = o[21] + "";// 所属户头（1.移动、2.铁塔）
		WatthourMeterVO watthourMeterVO = null;
		if (initData.getWatthourMeterVOMap().get(watthourCode + "_" + paymentAccountCode) != null) {
			watthourMeterVO = initData.getWatthourMeterVOMap().get(watthourCode + "_" + paymentAccountCode);
			watthourMeterVO.setData(watthourCode, paymentAccountCode, watthourType, watthourStatus, rate, maxReading,
					currentReading, reimbursementDate, belongAccount);
			putErrorMessage(WATTHOUR_REPEAT, i + START_ROW + 1);
			// toUpdateWattInfo.add(watthourMeterVO);
		} else {
			watthourMeterVO = new WatthourMeterVO(StringUtils.getUUid(), watthourCode, paymentAccountCode, watthourType,
					watthourStatus, rate, maxReading, currentReading, reimbursementDate, belongAccount);
			toSaveWattInfo.add(watthourMeterVO);
		}
		Map<String, SiteMidWattInfo> stringSiteMidWattInfoMap = initData.getSiteMidWattInfoMap();
		if (stringSiteMidWattInfoMap.get(siteInfoVO.getId() + "_" + watthourMeterVO.getId()) != null) {
			putErrorMessage(SITE_MIDLE_WATTHOUR_REPEAT, i + START_ROW + 1);
			return;
		}
		
		// 保存中间表
		SiteMidWattInfo siteMidWattInfo = new SiteMidWattInfo();
		siteMidWattInfo.setId(StringUtils.getUUid());
		siteMidWattInfo.setAccountSiteId(siteInfoVO.getId());
		siteMidWattInfo.setWatthourMeterId(watthourMeterVO.getId());
		siteMidWattInfos.add(siteMidWattInfo);
	}

	@Override
	public void querySite(PageUtil<SiteInfoVO> pageUtil, String queryData, String cityId, String countyId,String meterCode) {
		PageVO pageVO = new PageVO();
		Map<String, Object> paramMap = Maps.newHashMap();
		paramMap.put("queryData", queryData == null ? "" : queryData);
		paramMap.put("cityId", cityId == null ? "" : cityId);
		paramMap.put("countyId", countyId == null ? "" : countyId);
		paramMap.put("meterCode",meterCode==null ? "" : meterCode);//noone
		pageUtil.setObj(paramMap);
		List<SiteInfoVO> queryList = siteInfoDao.queryList(pageUtil);
		for (SiteInfoVO sfv : queryList) {
			if (sfv.getPayTypee() == null) {
				sfv.setPayTypee(7);
			}
			if (sfv.getProfessional() == null) {
				sfv.setProfessional("无线");
			}
		}
		pageVO.setData(queryList);
	}
	
	@Override
	public List<Map<String, Object>> querySiteExcel(PageUtil<SiteInfoVO> pageUtil) {
		
//		Map<String, Object> paramMap = Maps.newHashMap();
//		paramMap.put("queryData", queryData == null ? "" : queryData);
//		paramMap.put("cityId", cityId == null ? "" : cityId);
//		paramMap.put("countyId", countyId == null ? "" : countyId);
//		paramMap.put("meterCode",meterCode==null ? "" : meterCode);//noone
//		pageUtil.setObj(paramMap);
//		int pageNum=1;
//		
//		pageUtil.setPageNo(pageNum);
//		pageUtil.setPageSize(100000);
//		//创建excel表
//		SXSSFWorkbook wb = new SXSSFWorkbook(1000);
//		int a=0;
//		int aa=0;
//		String b="";
//		String c="";
//		Sheet sheet1=null; 
//		Row row=null;
//		String[] titleRow = new String[] {
//				"地市",
//				"区县",
//				"报账点名称",
//				"报账点别名",
//				"机房或资源点名称",
//				"站点名称",
//				"原财务站点名称",
//				"产权性质",
//				"合同ID",
//				"合同名称",
//				"合同生效日期",
//				"合同终止日期",
//				"是否包干",
//				"包干价",
//				"缴费周期",
//				"单价(不含税)",
//				"用电类型",
//				"供电公司/业主",
//				"共享方式",
//				"电费缴纳方式",
//				"电表号",
//				"电表标识符",
//				"电表户号",
//				"电表类型",
//				"电表状态",
//				"倍率",
//				"最大读数",
//				"当前读数",
//				"当前电费归属日期",
//				"所属户头",
//				"报销周期"
//				};
//		List<Map<String, Object>> queryList = null;
//		
//		while(true) {
//			a=0;
//			aa++;
			List<Map<String, Object>> list = siteInfoDao.queryListExcel(pageUtil);
			return list;
//			if(queryList==null || queryList.size()==0) {
//				break;
//			}
//			sheet1 = wb.createSheet("基础数据详情"+aa);
//			row = sheet1.createRow(a++);
//			for(int i=0;i<titleRow.length;i++) {
//				Cell cell = row.createCell(i);
//				cell.setCellValue(titleRow[i]);
//			}
//			for(Map<String,Object> map : queryList) {
//				
//				System.out.println(a);
//				System.out.println(aa);
//				row = sheet1.createRow(a++);
//				row.createCell(0).setCellValue(map.get("DS")==null?"":String.valueOf(map.get("DS")));
//				row.createCell(1).setCellValue(map.get("QX")==null?"":String.valueOf(map.get("QX")));
//				row.createCell(2).setCellValue(map.get("BZDMC")==null?"":String.valueOf(map.get("BZDMC")));
//				row.createCell(3).setCellValue(map.get("BZDBM")==null?"":String.valueOf(map.get("BZDBM")));
//				row.createCell(4).setCellValue(map.get("JFZYDMC")==null?"":String.valueOf(map.get("JFZYDMC")));
//				row.createCell(5).setCellValue(map.get("ZDMC")==null?"":String.valueOf(map.get("ZDMC")));
//				row.createCell(6).setCellValue(map.get("YCWZDMC")==null?"":String.valueOf(map.get("YCWZDMC")));
//				row.createCell(7).setCellValue((map.get("CQXZ")==null || String.valueOf(map.get("CQXZ")).equals("0"))?"自维":"塔维");
//				row.createCell(8).setCellValue(map.get("HTBH")==null?"":String.valueOf(map.get("HTBH")));
//				row.createCell(9).setCellValue(map.get("HTMC")==null?"":String.valueOf(map.get("HTMC")));
//				row.createCell(10).setCellValue(map.get("HTSXRQ")==null?"":String.valueOf(map.get("HTSXRQ")));
//				row.createCell(11).setCellValue(map.get("HTZZRQ")==null?"":String.valueOf(map.get("HTZZRQ")));
//				row.createCell(12).setCellValue((map.get("SFBG")==null || String.valueOf(map.get("SFBG")).equals("0"))?"非包干":"包干");
//				row.createCell(13).setCellValue(map.get("BGJ")==null?"":String.valueOf(map.get("BGJ")));
//				switch(String.valueOf(map.get("JFZQ"))) {
//				case "1":
//					b="月";
//					break;
//				case "3":
//					b="季度";
//					break;
//				case "6":
//					b="半年";
//					break;
//				case "12":
//					b="年";
//					break;
//				}
//				row.createCell(14).setCellValue(b);
//				row.createCell(15).setCellValue(map.get("DTDJ")==null?"":String.valueOf(map.get("DTDJ")));
//				row.createCell(16).setCellValue((map.get("YDLX")==null || String.valueOf(map.get("YDLX")).equals("1"))?"直供电":"转供电");
//				row.createCell(17).setCellValue(String.valueOf(map.get("GDGS")).equals("1")?"供电公司":"业主");
//				row.createCell(18).setCellValue((map.get("GXFS")==null || String.valueOf(map.get("GXFS")).equals("1"))?"共享":"独享");
//				row.createCell(19).setCellValue((map.get("DFJNFS")==null || String.valueOf(map.get("DFJNFS")).equals("3"))?"自缴":String.valueOf(map.get("DFJNFS")).equals("2")?"铁塔代缴":"代维代缴");
//				row.createCell(20).setCellValue(map.get("DBBSF")==null?"":String.valueOf(map.get("DBBSF")));
//				row.createCell(21).setCellValue(map.get("DBBSF")==null?"":String.valueOf(map.get("DBBSF")));
//				row.createCell(22).setCellValue(map.get("DBHH")==null?"":String.valueOf(map.get("DBHH")));
//				row.createCell(23).setCellValue((map.get("DBLX")==null || String.valueOf(map.get("DBLX")).equals("1"))?"普通":"智能");
//				row.createCell(24).setCellValue((map.get("DBZT")==null || String.valueOf(map.get("DBZT")).equals("1"))?"正常":String.valueOf(map.get("DBZT")).equals("0")?"损坏":"损坏未提交");
//				row.createCell(25).setCellValue(map.get("BL")==null?"":String.valueOf(map.get("BL")));
//				row.createCell(26).setCellValue(map.get("ZDDS")==null?"":String.valueOf(map.get("ZDDS")));
//				row.createCell(27).setCellValue(map.get("DQDS")==null?"":String.valueOf(map.get("DQDS")));
//				row.createCell(28).setCellValue(map.get("DQDSKSRQ")==null?"":String.valueOf(map.get("DQDSKSRQ")));
//				row.createCell(29).setCellValue(map.get("SSHT")==null?"":String.valueOf(map.get("SSHT")));
//				switch(String.valueOf(map.get("BXZQ"))) {
//				case "1":
//					c="月";
//					break;
//				case "3":
//					c="季度";
//					break;
//				case "6":
//					c="半年";
//					break;
//				case "12":
//					c="年";
//					break;
//				}
//				row.createCell(30).setCellValue(c);
//				map=null;
//				}
//				
//				queryList.clear();
//				queryList=null;
//				pageUtil.setPageNo(++pageNum);
//				
//			
//		}
//		
//	
//		ServletOutputStream out = null;
//		try {        
//            out = response.getOutputStream();    
//            String fileName = "基础信息详情.xls";// 文件名    
//            response.setContentType("application/x-msdownload");    
//            response.setHeader("Content-Disposition", "attachment; filename="    
//                                                    + URLEncoder.encode(fileName, "UTF-8"));    
//            wb.write(out);    
//        } catch (Exception e) {    
//            e.printStackTrace();    
//        } finally {      
//            try {       
//                out.close();      
//            } catch (IOException e) {      
//                e.printStackTrace();    
//            }      
//        }
		
		
//		int aa=1;
//		XSSFWorkbook wb = new XSSFWorkbook();//创建表格
//		XSSFSheet aSheet = wb.createSheet("稽核信息详情");//创建工作簿
//		int a = 0;
//		XSSFRow aRow = aSheet.createRow(a);
//		aRow.createCell(0,1).setCellValue("地市");
//		aRow.createCell(1,1).setCellValue("区县");
//		aRow.createCell(2,1).setCellValue("报账点名称");
//		aRow.createCell(3,1).setCellValue("报账点别名");
//		aRow.createCell(4,1).setCellValue("机房或资源点名称");
//		aRow.createCell(5,1).setCellValue("站点名称");
//		aRow.createCell(6,1).setCellValue("原财务站点名称");
//		aRow.createCell(7,1).setCellValue("产权性质");
//		aRow.createCell(8,1).setCellValue("合同ID");
//		aRow.createCell(9,1).setCellValue("合同名称");
//		aRow.createCell(10,1).setCellValue("合同生效日期");
//		aRow.createCell(11,1).setCellValue("合同终止日期");
//		aRow.createCell(12,1).setCellValue("是否包干");
//		aRow.createCell(13,1).setCellValue("包干价");
//		aRow.createCell(14,1).setCellValue("缴费周期");
//		aRow.createCell(15,1).setCellValue("单价(不含税)");
//		aRow.createCell(16,1).setCellValue("用电类型");
//		aRow.createCell(17,1).setCellValue("供电公司/业主");
//		aRow.createCell(18,1).setCellValue("共享方式");
//		aRow.createCell(19,1).setCellValue("电费缴纳方式");
////		aRow.createCell(20,1).setCellValue("电表号");
////		aRow.createCell(21,1).setCellValue("电表标识符");
////		aRow.createCell(22,1).setCellValue("电表户号");
////		aRow.createCell(23,1).setCellValue("电表类型");
////		aRow.createCell(24,1).setCellValue("电表状态");
////		aRow.createCell(25,1).setCellValue("倍率");
////		aRow.createCell(26,1).setCellValue("最大读数");
////		aRow.createCell(27,1).setCellValue("当前读数");
////		aRow.createCell(28,1).setCellValue("当前电费归属日期");
//		aRow.createCell(20,1).setCellValue("所属户头");
//		aRow.createCell(21,1).setCellValue("报销周期");
//		String b="";
//		String c="";
//		
////		while(true) {
////			if(aa==11) {
////				break;
////			}
//			
//			List<Map<String, Object>> queryList = siteInfoDao.queryListExcel(pageUtil);
//			System.out.println("daxiao+++"+queryList.size());
////			if(queryList.size()==0) {
////				break;
////			}
//			
//			for(Map<String,Object> map : queryList) {
//				a++;
//				aRow = aSheet.createRow(a);
//				aRow.createCell(0,1).setCellValue(map.get("DS")==null?"":String.valueOf(map.get("DS")));
//				aRow.createCell(1,1).setCellValue(map.get("QX")==null?"":String.valueOf(map.get("QX")));
//				aRow.createCell(2,1).setCellValue(map.get("BZDMC")==null?"":String.valueOf(map.get("BZDMC")));
//				aRow.createCell(3,1).setCellValue(map.get("BZDBM")==null?"":String.valueOf(map.get("BZDBM")));
//				aRow.createCell(4,1).setCellValue(map.get("JFZYDMC")==null?"":String.valueOf(map.get("JFZYDMC")));
//				aRow.createCell(5,1).setCellValue(map.get("ZDMC")==null?"":String.valueOf(map.get("ZDMC")));
//				aRow.createCell(6,1).setCellValue(map.get("YCWZDMC")==null?"":String.valueOf(map.get("YCWZDMC")));
//				aRow.createCell(7,1).setCellValue((map.get("CQXZ")==null || String.valueOf(map.get("CQXZ")).equals("0"))?"自维":"塔维");
//				aRow.createCell(8,1).setCellValue(map.get("HTBH")==null?"":String.valueOf(map.get("HTBH")));
//				aRow.createCell(9,1).setCellValue(map.get("HTMC")==null?"":String.valueOf(map.get("HTMC")));
//				aRow.createCell(10,1).setCellValue(map.get("HTSXRQ")==null?"":String.valueOf(map.get("HTSXRQ")));
//				aRow.createCell(11,1).setCellValue(map.get("HTZZRQ")==null?"":String.valueOf(map.get("HTZZRQ")));
//				aRow.createCell(12,1).setCellValue((map.get("SFBG")==null || String.valueOf(map.get("SFBG")).equals("0"))?"非包干":"包干");
//				aRow.createCell(13,1).setCellValue(map.get("BGJ")==null?"":String.valueOf(map.get("BGJ")));
//				switch(String.valueOf(map.get("JFZQ"))) {
//				case "1":
//					b="月";
//					break;
//				case "3":
//					b="季度";
//					break;
//				case "6":
//					b="半年";
//					break;
//				case "12":
//					b="年";
//					break;
//				}
//				aRow.createCell(14,1).setCellValue(b);
//				aRow.createCell(15,1).setCellValue(map.get("DTDJ")==null?"":String.valueOf(map.get("DTDJ")));
//				aRow.createCell(16,1).setCellValue((map.get("YDLX")==null || String.valueOf(map.get("YDLX")).equals("1"))?"直供电":"转供电");
//				aRow.createCell(17,1).setCellValue(String.valueOf(map.get("GDGS")).equals("1")?"供电公司":"业主");
//				aRow.createCell(18,1).setCellValue((map.get("GXFS")==null || String.valueOf(map.get("GXFS")).equals("1"))?"共享":"独享");
//				aRow.createCell(19,1).setCellValue((map.get("DFJNFS")==null || String.valueOf(map.get("DFJNFS")).equals("3"))?"自缴":String.valueOf(map.get("DFJNFS")).equals("2")?"铁塔代缴":"代维代缴");
////				aRow.createCell(20,1).setCellValue(map.get("DBBSF")==null?"":String.valueOf(map.get("DBBSF")));
////				aRow.createCell(21,1).setCellValue(map.get("DBBSF")==null?"":String.valueOf(map.get("DBBSF")));
////				aRow.createCell(22,1).setCellValue(map.get("DBHH")==null?"":String.valueOf(map.get("DBHH")));
////				aRow.createCell(23,1).setCellValue((map.get("DBLX")==null || String.valueOf(map.get("DBLX")).equals("1"))?"普通":"智能");
////				aRow.createCell(24,1).setCellValue((map.get("DBZT")==null || String.valueOf(map.get("DBZT")).equals("1"))?"正常":String.valueOf(map.get("DBZT")).equals("0")?"损坏":"损坏未提交");
////				aRow.createCell(25,1).setCellValue(map.get("BL")==null?"":String.valueOf(map.get("BL")));
////				aRow.createCell(26,1).setCellValue(map.get("ZDDS")==null?"":String.valueOf(map.get("ZDDS")));
////				aRow.createCell(27,1).setCellValue(map.get("DQDS")==null?"":String.valueOf(map.get("DQDS")));
////				aRow.createCell(28,1).setCellValue(map.get("DQDSKSRQ")==null?"":String.valueOf(map.get("DQDSKSRQ")));
//				aRow.createCell(29,1).setCellValue(map.get("SSHT")==null?"":String.valueOf(map.get("SSHT")));
//				switch(String.valueOf(map.get("BXZQ"))) {
//				case "1":
//					c="月";
//					break;
//				case "3":
//					c="季度";
//					break;
//				case "6":
//					c="半年";
//					break;
//				case "12":
//					c="年";
//					break;
//				}
//				aRow.createCell(30,1).setCellValue(c);
//				System.out.println(a);
//				if(a==76531) {
//					break;
//				}
//			}
////			aa++;
////			pageUtil.setPageNo(aa);
//			
/////	      System.out.println(aa);
////		}
//		ServletOutputStream out = null;
//		try {        
//            out = response.getOutputStream();    
//            String fileName = "基础数据.xls";// 文件名    
//            response.setContentType("application/x-msdownload");    
//            response.setHeader("Content-Disposition", "attachment; filename="    
//                                                    + URLEncoder.encode(fileName, "UTF-8"));    
//            wb.write(out);    
//        } catch (Exception e) {    
//            e.printStackTrace();    
//        } finally {      
//            try {       
//                out.close();      
//            } catch (IOException e) {      
//                e.printStackTrace();    
//            }      
//        } 
	}

	@Override
	public void setOverBenchmarkProportion(String electricityId, String siteId, Integer totalDays,
			Long totalElectricity) {
		// if(totalDays == null || totalDays == 0){
		// return;
		// }
		// if(totalElectricity == null || totalElectricity == 0){
		// return;
		// }
		// SiteInfoVO siteInfoVO = siteInfoDao.queryById(siteId);
		// //额定功率
		// List<PowerRatingVO> powerRatingVOs =
		// equipmentRoomService.getPowerRating(Arrays.asList(siteInfoVO));
		// //如果查不到功率信息，直接返回
		// if (powerRatingVOs == null || powerRatingVOs.isEmpty()) {
		// return;
		// }
		//
		// //标杆功率
		// long benchmarkPowerRating =
		// powerRatingVOs.stream().mapToLong(PowerRatingVO::getTotalPowerRating).sum();
		// //标杆电量。计算方式为：标杆功率*24*电费归属天数/1000
		// long benchmarkElectricity = benchmarkPowerRating * 24 * totalDays /
		// 1000;
		// //已经超标杆啦
		// if (totalElectricity > benchmarkElectricity) {
		// ElectricityBenchmark electricityBenchmarkEntity = new
		// ElectricityBenchmark();
		// electricityBenchmarkEntity.setElectricityId(electricityId);
		// electricityBenchmarkEntity.setType("额定功率");
		// electricityBenchmarkEntity.setBenchmark(benchmarkElectricity);
		// electricityBenchmarkEntity.setOverProportion((totalElectricity -
		// benchmarkElectricity) / benchmarkElectricity * 100);
		// inputElectricityDao.saveElectricityBenchmark(electricityBenchmarkEntity);
		// }

		// TODO 需要继续实现智能电表标杆和开关电源标杆
	}

	@Override
	public List<SiteInfoVO> queryAll() {
		List<SiteInfoVO> queryAll = siteInfoDao.queryAll();
		return queryAll;
	}

	@Override
	public SiteInfoVO getPayTypeById(String id) {
		SiteInfoVO payTypeById = siteInfoDao.getPayTypeById(id);
		return payTypeById;
	}

}
