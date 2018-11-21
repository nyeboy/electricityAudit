package com.audit.modules.tower.service.impl;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.BatchUtil;
import com.audit.modules.common.utils.DateUtil;
import com.audit.modules.common.utils.ImportExcelUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.entity.SysTowerSiteMidContract;
import com.audit.modules.electricity.entity.TowerWatthourMeterVO;
import com.audit.modules.site.entity.ExcelErrorInfo;
import com.audit.modules.site.entity.InitTowerData;
import com.audit.modules.system.dao.ZgSpaceDao;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.tower.dao.TowerSiteDao;
import com.audit.modules.tower.entity.TowerSiteVO;
import com.audit.modules.tower.service.TowerSiteService;
import com.audit.modules.towerbasedata.contract.entity.TowerContractVO;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/28
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Service
@Transactional
public class TowerSiteServiceImpl implements TowerSiteService {

    private final static Integer START_ROW = 3;
    private InitTowerData initTowerData = null;
    private InitTowerData initTowerSfData = null;
    private Map<String, ExcelErrorInfo> excelErrorInfoMap = null;
    private final static String CITY_COUNTY_NOT_EXIT = "市区在系统中不存在!";
    private Set<Integer> toDelete = null;

    @Resource
    private SqlSessionTemplate sqlSessionTemplate;

    @Autowired
    private ZgSpaceDao zgSpaceDao;

    @Autowired
    private TowerSiteDao towerSiteDao;

    private String concatNull(String every) {
        return every + "不能为空!";
    }

    private String concatRepeat(String every) {
        return every + "重复!";
    }

    @Override
    public ResultVO queryzhLabelByTowerSiteCode(String code) {
        List<TowerSiteVO> towerSiteVOs = towerSiteDao.queryzhLabelByTowerSiteCode(code);
        if (towerSiteVOs != null && towerSiteVOs.size() > 1) {
            return ResultVO.failed("该铁塔站址编号对应的资管站点不唯一，请重新查询！");
        }
        return ResultVO.success(towerSiteVOs);
    }

    @Override
    public List<TowerSiteVO> queryTowerSite(PageUtil<TowerSiteVO> page, TowerSiteVO towerSiteVO, UserVo userInfo) {
        List<TowerSiteVO> towerSiteVOs = Lists.newArrayList();
        if (userInfo == null) {
            return towerSiteVOs;
        }
        setParamterMap(page, towerSiteVO, userInfo);
        towerSiteVOs = towerSiteDao.queryTowerSite(page);
        return towerSiteVOs;
    }

    @Override
    public List<TowerWatthourMeterVO> selectWatthour(String zyCode) {
    	List<TowerWatthourMeterVO> watthourMeterVOs = Lists.newArrayList();
    	 List<String> watthourMeterCode=towerSiteDao.selectWatthourCode(zyCode); 
    	 if(watthourMeterCode!=null){
    		 for(int i = 0;i<watthourMeterCode.size();i++){
    			 TowerWatthourMeterVO watthourMeterVO=towerSiteDao.selectWatthour(watthourMeterCode.get(i)); 			 
    			 if(watthourMeterVOs!=null){
    				 watthourMeterVO.setWatthourType("1");
    				 watthourMeterVOs.add(watthourMeterVO) ;
    			 }
    		 }   		 
    	 }
        return watthourMeterVOs;
    }
    
    @Override
    public ResultVO importExcel(MultipartFile file, UserVo userInfo) throws Exception {
        if (file == null || file.isEmpty()) {
            return ResultVO.failed("请上传文件！");
        }
        InputStream in = file.getInputStream();
        List<Object[]> listob = null;
        listob = new ImportExcelUtil().getBankListByExcel(in, file.getOriginalFilename(), START_ROW);
        initData(listob);
        checkExcelData(listob, userInfo);
        saveData(listob, userInfo);
        if (!excelErrorInfoMap.isEmpty()) {
            return ResultVO.success(excelErrorInfoMap.values().toString());
        } else {
            return ResultVO.success();
        }
    }

    private void saveData(List<Object[]> listob, UserVo userInfo) {
        List<TowerSiteVO> towerSiteVOs = Lists.newArrayList();
        List<TowerContractVO> towerContractVOs = Lists.newArrayList();
        List<SysTowerSiteMidContract> sysTowerMidCostcenters = Lists.newArrayList();
        for (int i = 0; i < listob.size(); i++) {
            Object[] o = listob.get(i);
            String siteID = StringUtils.getUUid();
            TowerSiteVO towerSiteVO = toTowerSiteVO(o, i, userInfo);
            towerSiteVO.setId(siteID);
            towerSiteVOs.add(towerSiteVO);
            String contractID = StringUtils.getUUid();
            TowerContractVO towerContractVO = concastTowerContract(o, i);
            towerContractVO.setId(contractID);
            towerContractVOs.add(towerContractVO);
            SysTowerSiteMidContract sysTowerSiteMidContract = new SysTowerSiteMidContract(StringUtils.getUUid(), siteID, contractID);
            sysTowerMidCostcenters.add(sysTowerSiteMidContract);
        }
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        executorService.execute(new SaveTowerSiteInfo(towerSiteVOs));
        executorService.execute(new SaveTowerContractInfo(towerContractVOs));
        executorService.execute(new SaveTowerMidContractInfo(sysTowerMidCostcenters));
    }

    class SaveTowerMidContractInfo implements Runnable {
        private List<SysTowerSiteMidContract> sysTowerMidCostcenters;

        SaveTowerMidContractInfo(List<SysTowerSiteMidContract> sysTowerMidCostcenters) {
            this.sysTowerMidCostcenters = sysTowerMidCostcenters;
        }

        @Override
        public void run() {
            if (sysTowerMidCostcenters != null && sysTowerMidCostcenters.size() > 0) {//保存报账点
                new BatchUtil().batchSave(sysTowerMidCostcenters, "com.audit.modules.tower.dao.TowerSiteDao", "batchSaveTowerMidContractInfo", sqlSessionTemplate);
            }
        }
    }

    class SaveTowerContractInfo implements Runnable {
        private List<TowerContractVO> towerContractVOs;

        SaveTowerContractInfo(List<TowerContractVO> towerContractVOs) {
            this.towerContractVOs = towerContractVOs;
        }

        @Override
        public void run() {
            if (towerContractVOs != null && towerContractVOs.size() > 0) {//保存报账点
                new BatchUtil().batchSave(towerContractVOs, "com.audit.modules.tower.dao.TowerSiteDao", "batchSaveContractInfo", sqlSessionTemplate);
            }
        }
    }

    class SaveTowerSiteInfo implements Runnable {
        private List<TowerSiteVO> towerSiteVOs;

        SaveTowerSiteInfo(List<TowerSiteVO> towerSiteVOs) {
            this.towerSiteVOs = towerSiteVOs;
        }

        @Override
        public void run() {
            if (towerSiteVOs != null && towerSiteVOs.size() > 0) {//保存报账点
                new BatchUtil().batchSave(towerSiteVOs, "com.audit.modules.tower.dao.TowerSiteDao", "batchSaveTowerSiteInfo", sqlSessionTemplate);
            }
        }
    }

    private List<Object[]> checkExcelData(List<Object[]> listob, UserVo userInfo) {
        toDelete = Sets.newHashSet();
        excelErrorInfoMap = Maps.newHashMap();
        Map<String, List<TowerSiteVO>> siteChekMap = Maps.newHashMap();
        List<TowerContractVO> towerContractVOs = Lists.newArrayList();
        toDeleteIfEmpty(listob);//删除为空的行
        List<String> importZyCode = Lists.newArrayList();
        List<String> importZgName = Lists.newArrayList();
        for (int i = 0; i < listob.size(); i++) {
            Object[] o = listob.get(i);
            String isSfSite = o[16] == null ? "1" :o[16] +"";//判断铁塔类型，1，铁塔公司，2，三方铁塔
            String zyCode = "";//铁塔站址编码
            if(isSfSite.equals("2")){
            	SimpleDateFormat tempDate = new SimpleDateFormat("yyyyMMdd");
            	String datetime = tempDate.format(new Date(System.currentTimeMillis())); 
            	System.out.println(datetime);
            	zyCode = "ST"+datetime +String.valueOf((int)(Math.random()*9+1)*100000);
            	String zgName = o[17] == null ?"":o[17] +"";//把资管名字存起用于验证
            	importZgName.add(zgName);
            	
            }
            if(isSfSite.equals("1")){
            	zyCode = o[2] == null ? "" : o[2] + "";//铁塔地址编号，三方铁塔没有站址编号，自己生成
            	importZyCode.add(zyCode);//保持zycode一致性
            }
            o[2]=zyCode;//改变铁塔站址编码的值
            concastTowerSiteVo(o, i, siteChekMap, userInfo);
            concastTowerContract(o, i, towerContractVOs);
        }
        
        initZyCode(importZyCode);//验证存入铁塔站址编码
        //验证三方铁塔资管名称
        initZgName(importZgName);//验证存入资管名称
        
        checkSite(siteChekMap);
        
        checkConCast(towerContractVOs);
        deleteExcel(listob);
        return listob;
    }
    
    private void toDeleteIfEmpty(List<Object[]> listob){
    	for (int i = 0; i < listob.size(); i++) {//判断为空的行，并删除
            Object[] o = listob.get(i);
            String cityName = o[0] == null ? "" : o[0] + "";//城市名称
            String countyName = o[1] == null ? "" : o[1] + "";//区县
            String zyCode = o[2] == null ? "" : o[2] + "";//铁塔地址编号
            String zyName = o[3] == null ? "" : o[3] + "";//铁塔地址名称
            String isSfSite = o[16] == null ?"1" : o[16] +"";//判断铁塔类型，1，铁塔公司，2，三方铁塔
            String zgName = o[17] == null ?"" : o[17] +"";//资管站址名称
            String zgCode = o[18] == null ?"" : o[18] +"";//资管站址编码
            //三方铁塔站点导入基础数据时，不填写铁塔站址编码，由系统自动生成；
            //其余字段：铁塔站址名称、资管站点名称（需进行资管数据校验）、资管站点编码（非必填项）
            if(StringUtils.isBlank(cityName)&&StringUtils.isBlank(countyName)&&StringUtils.isBlank(zyCode)&&StringUtils.isBlank(zyName)&&StringUtils.isBlank(isSfSite)&&StringUtils.isBlank(zgCode)&&StringUtils.isBlank(zgName)){
            	toDelete.add(i);
            	continue;
        	}
        }
    	deleteExcel(listob);
    }

    private void checkConCast(List<TowerContractVO> towerContractVOs) {
        for (TowerContractVO towerContractVO : towerContractVOs) {
            String isclude = towerContractVO.getIsClud();
            if (StringUtils.isBlank(isclude)) {
                putErrorMessage(concatNull("是否包干"), (Integer.parseInt(towerContractVO.getId()) + START_ROW + 1));
                toDelete.add(Integer.parseInt(towerContractVO.getId()));
            } else if (isclude.equals("1")) {
                if (StringUtils.isBlank(towerContractVO.getCludPrice())) {
                    putErrorMessage("是否包干为‘是’时，" + concatNull("包干价"), (Integer.parseInt(towerContractVO.getId()) + START_ROW + 1));
                    toDelete.add(Integer.parseInt(towerContractVO.getId()));
                }
                if (towerContractVO.getPaymentCycle() == null) {
                    putErrorMessage("是否包干为‘是’时，" + concatNull("续费周期"), (Integer.parseInt(towerContractVO.getId()) + START_ROW + 1));
                    toDelete.add(Integer.parseInt(towerContractVO.getId()));
                }
            } else if (isclude.equals("0")) {
                if (StringUtils.isBlank(towerContractVO.getUnitPrice())) {
                    putErrorMessage("是否包干为‘否’时，" + concatNull("单价"), (Integer.parseInt(towerContractVO.getId()) + START_ROW + 1));
                    toDelete.add(Integer.parseInt(towerContractVO.getId()));
                }
            }
        }
    }

    private TowerContractVO concastTowerContract(Object[] o, int i) {
        String contractNo = o[4] == null ? "" : o[4] + "";//合同No
        String contractName = o[5] == null ? "" : o[5] + "";//合同Name
        String contractStarTime = o[6] == null ? "" : o[6] + "";//合同生效日期
        String contractEndTime = o[7] == null ? "" : o[7] + "";//合同结束日期
        String isClud = o[8] == null ? "" : o[8] + "";//是否包干
        String cludPrice = o[9] == null ? "" : o[9] + "";//包干价 （“是否包干”为“是”时填写）
        String paymentCycle = o[10] == null ? "" : o[10] + "";//续费周期；1 月；3 季度；6 半年；12 年；-1 一次性；(“是否包干”为“是”时填写)
        String price = o[11] == null ? "" : o[11] + "";//单价(“是否包干”为“否”时填写)
        TowerContractVO towerContractVO = new TowerContractVO();
        towerContractVO.setId(i + "");
        towerContractVO.setContractNo(contractNo);
        towerContractVO.setName(contractName);
        if (!StringUtils.isBlank(contractStarTime)) {
            try {
                towerContractVO.setStartDate(DateUtil.parseFromPage(contractStarTime));
            } catch (ParseException e) {
                putErrorMessage("合同生效日期格式错误", (Integer.parseInt(towerContractVO.getId()) + START_ROW + 1));
                toDelete.add(Integer.parseInt(towerContractVO.getId()));
            }
        }
        if (!StringUtils.isBlank(contractEndTime)) {
            try {
                towerContractVO.setEndDate(DateUtil.parseFromPage(contractEndTime));
            } catch (ParseException e) {
                putErrorMessage("合同终止日期格式错误", (Integer.parseInt(towerContractVO.getId()) + START_ROW + 1));
                toDelete.add(Integer.parseInt(towerContractVO.getId()));
            }
        }
        if (!StringUtils.isBlank(isClud)) {
            towerContractVO.setIsClud(isClud);
        }
        towerContractVO.setCludPrice(cludPrice);
        // 1 月；3 季度；6 半年；12 年；-1 一次性；
        if (!StringUtils.isBlank(paymentCycle)) {
            towerContractVO.setPaymentCycle(paymentCycle);
        }
        towerContractVO.setUnitPrice(price);
        return towerContractVO;
    }

    private void concastTowerContract(Object[] o, int i, List<TowerContractVO> towerContractVOs) {
        TowerContractVO towerContractVO = concastTowerContract(o, i);
        towerContractVOs.add(towerContractVO);
    }

    private void concastTowerSiteVo(Object[] o, int i, Map<String, List<TowerSiteVO>> siteChekMap, UserVo userInfo) {
        String zyCode = o[2] == null ? "" : o[2] + "";//铁塔地址编号
        TowerSiteVO towerSiteVO = toTowerSiteVO(o, i, userInfo);
        List<TowerSiteVO> siteList = null;
        if (siteChekMap.get(zyCode) != null) {
            siteList = siteChekMap.get(zyCode);
        } else {
            siteList = Lists.newArrayList();
        }
        siteList.add(towerSiteVO);
        siteChekMap.put(zyCode, siteList);
    }

    private TowerSiteVO toTowerSiteVO(Object[] o, int i, UserVo userInfo) {
        String cityName = o[0] == null ? "" : o[0] + "";//城市名称
        String countyName = o[1] == null ? "" : o[1] + "";//区县
        String zyCode = o[2] == null ? "" : o[2] + "";//铁塔地址编号
        String zyName = o[3] == null ? "" : o[3] + "";//铁塔地址名称
        String electricityType = o[12] == null ? "" : o[12] + "";//用电类型(1.直供电、2.转供电)
        String zzType = o[13] == null ? "" : o[13] + "";//站址类型: 1铁塔新建、2.电信存量、3.联通存量、4.移动存量
        String shareType = o[14] == null ? "" : o[14] + "";//共享方式(（1共享、2.独享。）)
        String cycle = o[15] == null ? "" : o[15] + "";//报销周期。(1.月、3.季度、6.半年、12.年)
        String isSfSite = o[16] == null ?"1" : o[16] +"";//判断铁塔类型，1，铁塔公司，2，三方铁塔
        String zgName = o[17] == null ?"" : o[17] +"";//资管站址名称
        String zgCode = o[18] == null ?"" : o[18] +"";//资管站址编码
        
        TowerSiteVO towerSiteVO = new TowerSiteVO();
        towerSiteVO.setId(i + "");
        towerSiteVO.setCityId(cityName);
        towerSiteVO.setCountyId(countyName);
        towerSiteVO.setZyCode(zyCode);
        towerSiteVO.setZyName(zyName);
        towerSiteVO.setElectricityType(electricityType);
        towerSiteVO.setShareType(shareType);
        towerSiteVO.setZhLabel(zgName);//资管站点名称
        towerSiteVO.setYwCode(zgCode);//资管站点编码
        towerSiteVO.setIsSfSite(isSfSite);//三方铁塔和铁塔公司
        if (userInfo != null) {
            towerSiteVO.setCreatePerson(userInfo.getUserId());
        }
        towerSiteVO.setCreateTime(new Date());
        //三方铁塔判断
        if(isSfSite.equals("2")){
        	if(StringUtils.isBlank(zgName)){
        		putErrorMessage("三方铁塔必须有资管站点名称", (Integer.parseInt(towerSiteVO.getId()) + START_ROW + 1));
        		toDelete.add(Integer.parseInt(towerSiteVO.getId()));
        	}
        }
        //铁塔公司判断
        if(isSfSite.equals("1")){
        	if(StringUtils.isBlank(zyCode)){
        		putErrorMessage("铁塔站址编码不能为空", (Integer.parseInt(towerSiteVO.getId()) + START_ROW + 1));
        		toDelete.add(Integer.parseInt(towerSiteVO.getId()));
        	}
        }
        if (cycle != null) {
            try {
                towerSiteVO.setCycle(Integer.parseInt(cycle));
            } catch (Exception e) {
                putErrorMessage("报销周期必须为数字！", (Integer.parseInt(towerSiteVO.getId()) + START_ROW + 1));
                toDelete.add(Integer.parseInt(towerSiteVO.getId()));
            }
        }
        towerSiteVO.setZzType(zzType);
        Map<String, String> cityMap = initTowerData.getCityMap();
        if (cityMap.get(towerSiteVO.getCityId() + "_" + towerSiteVO.getCountyId()) != null) {
            String key = cityMap.get(towerSiteVO.getCityId() + "_" + towerSiteVO.getCountyId());
            towerSiteVO.setCityId(key.split("_")[0]);
            towerSiteVO.setCountyId(key.split("_")[1]);
        } else {
            putErrorMessage(CITY_COUNTY_NOT_EXIT, (Integer.parseInt(towerSiteVO.getId()) + START_ROW + 1));
            toDelete.add(Integer.parseInt(towerSiteVO.getId()));
        }
        return towerSiteVO;
    }

    private void checkSite(Map<String, List<TowerSiteVO>> siteChekMap) {
        for (String key : siteChekMap.keySet()) {
            List<TowerSiteVO> siteList = siteChekMap.get(key);
            if (siteList != null) {
                String prompt = "";
                if (StringUtils.isBlank(key)) {
                    prompt = concatNull("铁塔公司的铁塔站址编码");//为空
                } else {
                    prompt = concatRepeat("铁塔公司的铁塔站址编码");//重复
                }
                if (siteList.size() > 1) {
                    for (int i = 0; i < siteList.size(); i++) {
                        putErrorMessage(prompt, (Integer.parseInt(siteList.get(i).getId()) + START_ROW + 1));
                        toDelete.add(Integer.parseInt(siteList.get(i).getId()));
                    }
                } else {
                    TowerSiteVO towerSiteVO = siteList.get(0);
                    if (StringUtils.isBlank(towerSiteVO.getCityId())) {
                        putErrorMessage(concatNull("地市"), (Integer.parseInt(siteList.get(0).getId()) + START_ROW + 1));
                        toDelete.add(Integer.parseInt(siteList.get(0).getId()));
                    }
                    if (StringUtils.isBlank(towerSiteVO.getCountyId())) {
                        putErrorMessage(concatNull("区县"), (Integer.parseInt(siteList.get(0).getId()) + START_ROW + 1));
                        toDelete.add(Integer.parseInt(siteList.get(0).getId()));
                    }
                    if (StringUtils.isBlank(towerSiteVO.getZyCode())) {
                        putErrorMessage(concatNull("铁塔站址编码"), (Integer.parseInt(siteList.get(0).getId()) + START_ROW + 1));
                        toDelete.add(Integer.parseInt(siteList.get(0).getId()));
                    }
                    if (StringUtils.isBlank(towerSiteVO.getZyName())) {
                        putErrorMessage(concatNull("铁塔站址名称"), (Integer.parseInt(siteList.get(0).getId()) + START_ROW + 1));
                        toDelete.add(Integer.parseInt(siteList.get(0).getId()));
                    }
                    if (StringUtils.isBlank(towerSiteVO.getElectricityType())) {
                        putErrorMessage(concatNull("用电类型"), (Integer.parseInt(siteList.get(0).getId()) + START_ROW + 1));
                        toDelete.add(Integer.parseInt(siteList.get(0).getId()));
                    }
                    if (StringUtils.isBlank(towerSiteVO.getShareType())) {
                        putErrorMessage(concatNull("共享方式"), (Integer.parseInt(siteList.get(0).getId()) + START_ROW + 1));
                        toDelete.add(Integer.parseInt(siteList.get(0).getId()));
                    }
                    if (StringUtils.isBlank(towerSiteVO.getZzType())) {
                        putErrorMessage(concatNull("站址类型"), (Integer.parseInt(siteList.get(0).getId()) + START_ROW + 1));
                        toDelete.add(Integer.parseInt(siteList.get(0).getId()));
                    }
                    //这里验证是否在资管表中有数据
                    //铁塔公司验证
                    if (towerSiteVO.getIsSfSite().equals("1") && initTowerData.getZyCode() != null && !initTowerData.getZyCode().isEmpty()) {
                        if (!initTowerData.getZyCode().contains(towerSiteVO.getZyCode())) {
                            putErrorMessage("铁塔站址编码与资管站点无匹配！", (Integer.parseInt(siteList.get(0).getId()) + START_ROW + 1));
                            toDelete.add(Integer.parseInt(siteList.get(0).getId()));
                        }
                    }
                    
                    //三方铁塔公司验证
                    if (towerSiteVO.getIsSfSite().equals("2") && initTowerSfData.getZgName() != null && !initTowerSfData.getZgName().isEmpty()) {
                        if (!initTowerSfData.getZgName().contains(towerSiteVO.getZhLabel())) {
                            putErrorMessage("导入的资管站点数据与资管站点无匹配！", (Integer.parseInt(siteList.get(0).getId()) + START_ROW + 1));
                            toDelete.add(Integer.parseInt(siteList.get(0).getId()));
                        }
                    }
                }
            }
        }
    }

    private void deleteExcel(List<Object[]> listob) {
        List<Object[]> toDeleteL = Lists.newArrayList();
        if (toDelete != null && toDelete.size() > 0) {
            for (int row : toDelete) {
                toDeleteL.add(listob.get(row));
            }
        }
        if (toDeleteL.size() > 0) {
            listob.removeAll(toDeleteL);
        }
        toDelete.clear();
    }

    private void initData(List<Object[]> listob) {
        initTowerData = new InitTowerData();
        try {
            initCity();
        } catch (Exception e) {
            putErrorMessage(e.getMessage(), 1);
            return;
        }
    }

    //获取资管站点的zycode
    private void initZyCode(List<String> exportZyCode) {
    	Long start = System.currentTimeMillis();
        initTowerData.setZyCode(towerSiteDao.queryZyCode(exportZyCode));
        Log.info("queryZyCode() cost Time "+ (System.currentTimeMillis() - start)/1000);
    }
    
    //获取资管站点的zhlabel
    private void initZgName(List<String> exportZgName) {
    	Long start = System.currentTimeMillis();
        initTowerSfData.setZgName(towerSiteDao.queryZyCode(exportZgName));
        Log.info("queryZyCode() cost Time "+ (System.currentTimeMillis() - start)/1000);
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

    private void initCity() throws Exception {
        Map<String, String> cityMap = Maps.newHashMap();
        //获取所有市区
        List<Map<String, Object>> cities = zgSpaceDao.findAllCity();
        for (Map<String, Object> c : cities) {
            String city = c.get("CITY_NAME") + "";
            String countyName = c.get("ZH_LABEL") + "";
            String cId = c.get("CITY_ID") + "";
            String countyId = c.get("INT_ID") + "";
            cityMap.put(city + "_" + countyName, cId + "_" + countyId);
        }
        initTowerData.setCityMap(cityMap);
    }

    // 设置参数
    private void setParamterMap(PageUtil<TowerSiteVO> page, TowerSiteVO towerSiteVO, UserVo userInfo) {
        Map<String, String> parameMap = Maps.newHashMap();
//        parameMap.put("zyCode", towerSiteVO.getZyCode() == null ? "" : towerSiteVO.getZyCode());
        parameMap.put("zyName", towerSiteVO.getZyName() == null ? "" : towerSiteVO.getZyName());
        parameMap.put("isSfSite", towerSiteVO.getIsSfSite() == null ? "":towerSiteVO.getIsSfSite());
//        parameMap.put("zhLabel", towerSiteVO.getZhLabel() == null ? "" : towerSiteVO.getZhLabel());
        Integer level = userInfo.getUserLevel();
        if (level == 1) {// 市领导
            parameMap.put("cityId", userInfo.getCity() + "");
        } else if (level > 1) {// 区县领导
            parameMap.put("countyId", userInfo.getCounty() + "");
        }
        page.setObj(parameMap);
    }

	@Override
	public TowerSiteVO queryzhLabelByTowerSiteId(String id) {
		TowerSiteVO queryzhLabelByTowerSiteId = towerSiteDao.queryzhLabelByTowerSiteId(id);
		return queryzhLabelByTowerSiteId;
	}
}
