package com.audit.modules.electricity.service.impl;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.rpc.ParameterMode;
import javax.xml.rpc.encoding.XMLType;

import org.apache.axis.client.Call;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.dao.InputElectricityDao;
import com.audit.modules.electricity.dao.JobDao;
import com.audit.modules.electricity.dao.RoomLockingDao;
import com.audit.modules.electricity.dao.TowerElectricityDao;
import com.audit.modules.electricity.entity.CityNameVO;
import com.audit.modules.electricity.entity.EleCpowerJobVO;
import com.audit.modules.electricity.entity.ElectricityBenchmark;
import com.audit.modules.electricity.entity.ElectricityFlowVo;
import com.audit.modules.electricity.entity.ElectricityWatthourEntity;
import com.audit.modules.electricity.entity.ElectricyBaseVO;
import com.audit.modules.electricity.entity.OwnerMeterVo;
import com.audit.modules.electricity.entity.RoomIsOnlineVO;
import com.audit.modules.electricity.entity.SysTowerMidCostcenter;
import com.audit.modules.electricity.entity.SysTowerMidSupplier;
import com.audit.modules.electricity.entity.SysTowerMidWatthour;
import com.audit.modules.electricity.entity.TowerEleBenchmark;
import com.audit.modules.electricity.entity.TowerElectrictyEntities;
import com.audit.modules.electricity.entity.TowerElectrictyExcelVO;
import com.audit.modules.electricity.entity.TowerElectrictyVO;
import com.audit.modules.electricity.entity.TowerSaveEntities;
import com.audit.modules.electricity.entity.TowerSaveVO;
import com.audit.modules.electricity.entity.TowerToAddVO;
import com.audit.modules.electricity.entity.TowerWatthourMeterVO;
import com.audit.modules.electricity.service.TowerElectricityService;
import com.audit.modules.site.dao.BenchmarkDao;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.watthourmeter.service.WatthourMeterService;
import com.audit.modules.workflow.entity.TowerElectricityFlowVo;
import com.audit.modules.workflow.service.TowerAuditFlowService;
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
public class TowerElectricityServiceImpl implements TowerElectricityService {

    @Autowired
    private TowerElectricityDao towerElectricityDao;

    @Autowired
	private BenchmarkDao benchmarkDao;
    
    @Autowired
    private RoomLockingDao roomLockingDao;
    
    @Autowired
    private JobDao jobDao;
    
    @Autowired
    InputElectricityDao inputElectricityDao;
    
    @Autowired
    private WatthourMeterService watthourMeterService;

    @Autowired
    private TowerAuditFlowService towerAuditFlowService;

    /**
     * @param :serialNumber 流水号  accountName 报站点名称
     * @return :
     * @throws
     * @Description: 获取电费列表信息
     */
    @Override
    public void queryList(PageUtil<TowerElectrictyVO> page, TowerElectrictyEntities towerElectrictyEntities, UserVo userInfo) {
        Map<String, Object> parameMap = Maps.newHashMap();
        setParamterMap(page, towerElectrictyEntities, parameMap, userInfo);
        List<TowerElectrictyVO> towerElectrictyVOs = towerElectricityDao.queryList(parameMap);
        page.setResults(towerElectrictyVOs);
        page.setTotalRecord(towerElectricityDao.queryListCount(parameMap));
        List<String> ids = Lists.newArrayList();
        for (TowerElectrictyVO towerElectrictyVO1 : towerElectrictyVOs) {
            ids.add(towerElectrictyVO1.getId());
        }
        //获取电表信息
        List<Map<String, Object>> objects = queryElectricity(ids);
        if (objects != null && objects.size() > 0) {
            A:
            for (Map<String, Object> o : objects) {
                String eId = o.get("EID") + "";
                String totalEleciric = o.get("TOTALELECIRIC") + "";
                String totalAmount = o.get("PAYAMOUNT") + "";
//                String amount =  o.get("AMOUNT")+"";
                for (TowerElectrictyVO towerElectrictyVO1 : towerElectrictyVOs) {
                    if (towerElectrictyVO1.getId().equals(eId)) {
                        towerElectrictyVO1.setTotalEleciric(totalEleciric);
//                        towerElectrictyVO1.setTotalAmount(totalAmount);
                        continue A;
                    }
                }
            }
        }
    }

    @Override
    public Double queryTotalAmountByTowerIDs(List<String> tid) {
        if (tid == null || tid.size() == 0) {
            return -1d;
        }
        return towerElectricityDao.queryTotalAmountByTowerIDs(tid);
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 通过塔维提交表ID获取 塔维录入List
     */
    @Override
    public List<TowerElectrictyVO> queryTowerElBySubmitId(Integer subID) {
        List<TowerElectrictyVO> towerVo = towerElectricityDao.queryTowerElBySubmitId(subID);
        List<String> towerIDs = Lists.newArrayList();
        for (TowerElectrictyVO t : towerVo) {
            towerIDs.add(t.getId());
        }
        List<Map<String, Object>> objects = queryElectricity(towerIDs);
        if (objects != null && objects.size() > 0) {
            A:
            for (Map<String, Object> o : objects) {
                String eId = o.get("EID") + "";
                String totalEleciric = o.get("TOTALELECIRIC") + "";
                String totalAmount = o.get("PAYAMOUNT") + "";
//                String amount =  o.get("AMOUNT")+"";
                for (TowerElectrictyVO towerElectrictyVO1 : towerVo) {
                    if (towerElectrictyVO1.getId().equals(eId)) {
                        towerElectrictyVO1.setTotalEleciric(totalEleciric);
//                        towerElectrictyVO1.setTotalAmount(totalAmount);
                        continue A;
                    }
                }
            }
        }
        return towerVo;
    }

    //设置参数
    private void setParamterMap(PageUtil<TowerElectrictyVO> page, TowerElectrictyEntities towerElectrictyEntities, Map<String, Object> parameMap, UserVo userInfo) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        parameMap.put("serialNumber", towerElectrictyEntities.getSerialNumber() == null ? "" : towerElectrictyEntities.getSerialNumber());
        parameMap.put("zgTowerSiteName", towerElectrictyEntities.getZgTowerSiteName() == null ? "" : towerElectrictyEntities.getZgTowerSiteName());

        parameMap.put("submitPerson", towerElectrictyEntities.getSubmitPerson() == null ? "" : towerElectrictyEntities.getSubmitPerson());
        parameMap.put("supplierName", towerElectrictyEntities.getSupplierName() == null ? "" : towerElectrictyEntities.getSupplierName());
        parameMap.put("startTime", towerElectrictyEntities.getStartTime() == null ? "" : towerElectrictyEntities.getStartTime());
        parameMap.put("endTime", towerElectrictyEntities.getEndTime() == null ? "" : towerElectrictyEntities.getEndTime());
       
        parameMap.put("cityId", towerElectrictyEntities.getCityId() == null ? "" : towerElectrictyEntities.getCityId());
        parameMap.put("countyId", towerElectrictyEntities.getCountyId() == null ? "" : towerElectrictyEntities.getCountyId());
        parameMap.put("flowState", towerElectrictyEntities.getFlowState() == null ? "" : towerElectrictyEntities.getFlowState());
        parameMap.put("zgSpaceSiteName", towerElectrictyEntities.getZgSpaceSiteName() == null ? "" : towerElectrictyEntities.getZgSpaceSiteName());

        if (userInfo != null) {
            parameMap.put("userID", userInfo.getUserId() == null ? "" : userInfo.getUserId());
        }
        parameMap.put("pageNo",page.getPageNo()-1);
        parameMap.put("pageSize",page.getPageSize());
        if(towerElectrictyEntities.getStatuses()!=null&&towerElectrictyEntities.getStatuses().length>0){
            parameMap.put("status", towerElectrictyEntities.getStatuses());
        }
        page.setObj(parameMap);
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
        List<TowerElectrictyVO> towerElectrictyVOs = towerElectricityDao.queryByIDs(Arrays.asList(ids));
        for (TowerElectrictyVO electrictyListVO : towerElectrictyVOs) {
            String id = electrictyListVO.getId();
            towerAuditFlowService.startFlow(id);
            Map<String, Object> paramterMap = Maps.newHashMap();
            paramterMap.put("id", id);
            paramterMap.put("submitPerson", userID);
            paramterMap.put("submitDate", new Date());
            towerElectricityDao.updateSubmitPerson(paramterMap);
            updateStatus(new String[]{id}, 1);
            
            //检测是否额定功率超标，如果超标则推送emos
            if(electrictyListVO.getOverProOfReasons()!=null && !electrictyListVO.getOverProOfReasons().equals("")) {
            	//查询超标杆信息，并计算
            	TowerEleBenchmark queryOverBenchmarkTw = benchmarkDao.queryOverBenchmarkTw(id);
            	//这儿需要查询铁塔所在城市
       		 	CityNameVO cityById = towerElectricityDao.getCityById(id); 
            	//进行emos推送
            	this.emos(id, cityById.getCityName(), electrictyListVO.getZgTowerSiteName(), String.valueOf(queryOverBenchmarkTw.getOverProportion()), queryOverBenchmarkTw.getReason());
            }
            /*List<String> eids = Lists.newArrayList();
            eids.add(id);
            List<Map<String, Object>> objects = queryElectricity(eids);
            for (Map<String, Object> o : objects) {
                String electricity = o.get("ELECTRICITY") == null ? null : o.get("ELECTRICITY") + "";
                String totalDay = o.get("TOTALDAY") == null ? null : o.get("TOTALDAY") + "";
                List<String> elids = Lists.newArrayList();
                elids.add(id);
                List<ElectrictyVO> electrictyVO = findSiteIdByEid(elids);

                int totalDayNum = 0;
                if (totalDay != null && !totalDay.trim().isEmpty()) {
                    if (totalDay.matches("[0-9]+")) {
                        totalDayNum = Integer.valueOf(totalDay);
                    }
                }
                long electricityNum = 0;
                if (electricity != null && !electricity.trim().isEmpty()) {
                    if (electricity.matches("[0-9]+")) {
                        electricityNum = Long.valueOf(electricity);
                    }
                }
                siteInfoService.setOverBenchmarkProportion(id, electrictyVO.get(0).getSysAccountSiteId(),
                        totalDayNum, electricityNum);
            }*/
        }
        return ResultVO.success();
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 跳转到添加页面
     */
    @Override
    public TowerToAddVO toAdd(UserVo userInfo) {
        TowerToAddVO towerToAddVO = new TowerToAddVO();
        if (userInfo != null) {
            towerToAddVO.setAreas(userInfo.getCityStr());
            towerToAddVO.setCounties(userInfo.getCountyStr());
        }
        synchronized (this){
            towerToAddVO.setSerialNumber(StringUtils.createSerialNumber("TTJH"));
        }
        return towerToAddVO;
    }

    @Override
    public ResultVO deleteByIDs(String[] ids) {
        if (ids == null || ids.length == 0) {
            return ResultVO.failed("请选择电费单！");
        }
        List<String> idList = Arrays.asList(ids);
        towerElectricityDao.deleteByIDs(idList);
        towerElectricityDao.deleteTowerWatthourByTowerID(idList);
        towerElectricityDao.deleteMidWatthourByTowerID(idList);
      //删除稽核单的时候，如果该稽核单存在锁定机房的的行为要放开对应的机房
        for(String id : idList) {
        	List<String> roomIDs = roomLockingDao.unLockingRoomByElectrictyId(id);
        	if(roomIDs!=null && roomIDs.size()>0) {
        		for(String roomID : roomIDs) {
        			roomLockingDao.unLockingRoom(roomID);
        		}
        	}
        }
        return ResultVO.success();
    }

    /**
     * @param : id
     * @return :
     * @throws
     * @Description: 查看详情
     */
    @Override
    public TowerSaveVO findOneByID(String id) {
        Map<String, String> paramMap = Maps.newHashMap();
        paramMap.put("id", id);
        TowerSaveVO towerSaveVO = towerElectricityDao.findOneByID(paramMap);
        if (towerSaveVO == null) {
            return towerSaveVO;
        }
        List<TowerWatthourMeterVO> towerWatthourMeterVOs = towerElectricityDao.findTowerWatthourByTowerID(paramMap);

        if (towerWatthourMeterVOs != null) {
            towerSaveVO.setTowerWatthourMeterVOs(towerWatthourMeterVOs);
            //总电量
            Double total  = 0d;
            //总分摊比例
            Double totalFTBL = 0d;
            //总缴费金额
            Double allDS=0d;
            for(TowerWatthourMeterVO towerWatthourMeterVO:towerWatthourMeterVOs){
                if(StringUtils.isNotBlank(towerWatthourMeterVO.getTotalEleciric())){
                    try {
                    	totalFTBL+=Double.parseDouble(towerWatthourMeterVO.getShareProportion());
                        total+=Double.parseDouble(towerWatthourMeterVO.getTotalEleciric());
                        allDS+=Double.parseDouble(towerWatthourMeterVO.getPayAmount());
                    }catch (Exception e){

                    }
                }
            }
            if(towerWatthourMeterVOs.size()>1) {
            	totalFTBL = totalFTBL/towerWatthourMeterVOs.size();
            }
//            java.text.DecimalFormat   df   =new   java.text.DecimalFormat("#.00");  
//            towerSaveVO.setTotalUnitPrice(df.format(allDS/total));
//            towerSaveVO.setTotalShareProportion(df.format(totalFTBL));
            towerSaveVO.setTotalUnitPrice(String.format("%.2f", allDS/total));
            towerSaveVO.setTotalShareProportion(String.format("%.2f", totalFTBL));
            towerSaveVO.setTotalEleciric(total+"");
        }
        return towerSaveVO;
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
        ElectricyBaseVO baseVO = towerElectricityDao.findBySiteID(paramMap);
        if (baseVO != null) {
            electricyBaseVO=baseVO;
        }
        electricyBaseVO.setWatthourMeterVOs(watthourMeterService.findBySiteId(siteID));
        return electricyBaseVO;
    }
    /**
     * 根据id获取超标杆情况
     */
    @Override
    public Map<String,Object> checkPowerRatingByTowerID(String id){
    	//返回值
    	Map<String,Object> ret = new HashMap<String,Object>();
    	Map<String, String> paramMap = Maps.newHashMap();
        paramMap.put("id", id);
        TowerSaveVO towerSaveVO = towerElectricityDao.findOneByID(paramMap);
        String sysTowerSitId = towerSaveVO.getSysTowerSitNo();
        String isOnline = towerSaveVO.getIsOnline();
        
        //机房对应状态的总功率
        Double sumPowerRating =0d;
        //根据铁塔站址编码和在线状态，获取对应的机房id,在获取对应的功率和
        if(isOnline.equals("1")) {
        	List<String> roomIds = new ArrayList<String>();
        	roomIds = this.getRoomsByTowerId(sysTowerSitId, 1, false);
        	for(String roomId : roomIds ) {
        		sumPowerRating += this.getPowerRatingByRoomId(roomId, 1);
        	}
        }else if(isOnline.equals("2")) {
        	List<String> roomIds = new ArrayList<String>();
        	roomIds = this.getRoomsByTowerId(sysTowerSitId, 2, false);
        	for(String roomId : roomIds ) {
        		sumPowerRating += this.getPowerRatingByRoomId(roomId, 2);
        	}
        }
        
        List<ElectricityWatthourEntity> electricityWatthourEntities;
        List<String> param = new ArrayList<String>();
        param.add(id);
        electricityWatthourEntities = towerElectricityDao.findElectricityWatthourByEleIds(param);
        if (electricityWatthourEntities != null && electricityWatthourEntities.size() > 0) {
        	//检测总的用电量并比较是否超标杆
        	//总用电度数
        	Double sumW = 0d;
        	//最大用电小时数
        	long maxH = 0;
        	for(ElectricityWatthourEntity vo : electricityWatthourEntities) {
        		//计算用电小时数
        		long newTime = vo.getDateRange()*24+24;
        		if(newTime>maxH) {
        			maxH=newTime;
        		}
        		sumW+=vo.getTotalElecitity();
        	}
        	ret.put("oldPowerRating", sumPowerRating/1000*maxH);
        	if(sumW>sumPowerRating/1000*maxH*1.2) {
        		ret.put("overOldPowerRating", sumW-sumPowerRating/1000*maxH);
        		ret.put("isPR", true);
        		if(sumPowerRating==0) {
        			ret.put("overScale", 99.9999);
        			return ret;
        		}else {
        			ret.put("overScale", (sumW-sumPowerRating/1000*maxH)/(sumPowerRating/1000*maxH));
        			return ret;
        		}
        	}else if(sumW>sumPowerRating/1000*maxH) {
        		ret.put("overOldPowerRating", sumW-sumPowerRating/1000*maxH);
        		ret.put("isPR", true);
        		ret.put("overScale", (sumW-sumPowerRating/1000*maxH)/(sumPowerRating/1000*maxH));
        		return ret;
        	}
        }
        ret.put("isPR", false);
        return ret;
    }
    
    /**
     * @param : electrictyVO
     * @return :
     * @throws
     * @Description: 检测电费是否超标杆
     */
    @Override
    public Map<String, Object> checkPowerRating(TowerSaveEntities towerSaveEntities) {
    	//返回值
    	Map<String,Object> ret = new HashMap<String,Object>();
    	
    	//判断功率是否超标
        String sysTowerSitId = towerSaveEntities.getSysTowerSitNo();
        
        //获取稽核单在网状态
        String isOnline = towerSaveEntities.getIsOnline();
        
        //机房对应状态的总功率
        Double sumPowerRating =0d;
        //根据铁塔站址编码和在线状态，获取对应的机房id,在获取对应的功率和
        if(isOnline.equals("1")) {
        	List<String> roomIds = new ArrayList<String>();
        	roomIds = this.getRoomsByTowerId(sysTowerSitId, 1, false);
        	for(String roomId : roomIds ) {
        		sumPowerRating += this.getPowerRatingByRoomId(roomId, 1);
        	}
        }else if(isOnline.equals("2")) {
        	List<String> roomIds = new ArrayList<String>();
        	roomIds = this.getRoomsByTowerId(sysTowerSitId, 2, false);
        	for(String roomId : roomIds ) {
        		sumPowerRating += this.getPowerRatingByRoomId(roomId, 2);
        	}
        }
        //比较功率是否超标杆
        List<TowerWatthourMeterVO> watthourMeterVOs = towerSaveEntities.getTowerWatthourMeterVOs();
        if (watthourMeterVOs != null && watthourMeterVOs.size() > 0) {
        	//检测总的用电量并比较是否超标杆
        	//总用电度数
        	Double sumW = 0d;
        	//最大用电小时数
        	long maxH = 0;
        	for(TowerWatthourMeterVO vo : watthourMeterVOs) {
        		//计算用电小时数
        		long newTime = (vo.getBelongEndTime().getTime() - vo.getBelongStartTime().getTime())/(60*60*1000)+24;
        		if(newTime>maxH) {
        			maxH=newTime;
        		}
        		sumW+=Double.parseDouble(vo.getTotalEleciric());
        	}
        	ret.put("oldPowerRating", sumPowerRating/1000*maxH);
        	if(sumW>sumPowerRating/1000*maxH*1.2) {
        		ret.put("overOldPowerRating", sumW-sumPowerRating/1000*maxH);
        		ret.put("isPR", true);
        		if(sumPowerRating==0) {
        			ret.put("overScale", 99.9999);
        			return ret;
        		}else {
        			ret.put("overScale", (sumW-sumPowerRating/1000*maxH)/(sumPowerRating/1000*maxH));
        			return ret;
        		}
        	}else if(sumW>sumPowerRating/1000*maxH) {
        		ret.put("overOldPowerRating", sumW-sumPowerRating/1000*maxH);
        		ret.put("isPR", true);
        		ret.put("overScale", (sumW-sumPowerRating/1000*maxH)/(sumPowerRating/1000*maxH));
        		return ret;
        	}
        }
        ret.put("isPR", false);
        return ret;
    }
    
    /**
     * 获取铁塔站点对应的机房id
     * @param String towerId 塔维站点id
     * 		  int status 1-现网，2退网，3所有
     * 		  boolean inLocking 是否锁定
     */
    private List<String> getRoomsByTowerId(String towerId,int status,boolean isLocking){
    	Map<String,String> param = new HashMap<String,String>();
    	param.put("siteNo", towerId);
    	if(status==1) {
    		param.put("status", "现网");
    	}else if(status==2) {
    		param.put("status", "退网");
    		if(isLocking) {
    			param.put("isLocking", "isLocking");
    		}
    	}
    	List<String> roomsByTowerId = towerElectricityDao.getRoomsByTowerId(param);
    	return roomsByTowerId;
    }
    
    /**
	 * 锁定铁塔站址编码对应的退网的机房
	 * @param siteNo 报账点id
	 * @param electrictyId 稽核单id
	 */
	private void lockingRoomBySiteNo(String siteNo,String electrictyId) {
		List<String> roomIDs =  this.getRoomsByTowerId(siteNo,2,false);
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
	 * 根据铁塔站址编码，获取对应在网和退网的机房数量
	 */
	@Override
	public RoomIsOnlineVO getSiteNoRoomIsOnline(String siteNo) {
		List<String> onlineRooms = this.getRoomsByTowerId(siteNo, 1, true);
		List<String> notOnlineRooms = this.getRoomsByTowerId(siteNo, 2, true);
		RoomIsOnlineVO roomIsOnlineVO = new RoomIsOnlineVO();
		if(onlineRooms!=null && onlineRooms.size()>0) {
			roomIsOnlineVO.setOnlineRoomNum(onlineRooms.size());//在网未锁定的机房数量
		}
		if(notOnlineRooms!=null && notOnlineRooms.size()>0) {
			roomIsOnlineVO.setNoOnLineRoomNum(notOnlineRooms.size());//退网但未锁定的机房数量
		}
		return roomIsOnlineVO;
	}
    
    /**
     * @param : electrictyVO
     * @return :
     * @throws
     * @Description: 保存
     */
    @Override
    public ResultVO saveElectricty(TowerSaveEntities towerSaveEntities, UserVo userInfo) {
        String id = StringUtils.getUUid();
        towerSaveEntities.setId(id);
        towerSaveEntities.setCreateDate(new Date());
        String userID = null;
        if (userInfo != null) {
            userID = userInfo.getUserId();
            towerSaveEntities.setCreatePerson(userID);
            towerSaveEntities.setAreas(userInfo.getCity() + "");
            towerSaveEntities.setCounties(userInfo.getCounty() + "");
        }
        Integer count =  towerElectricityDao.checkSerialNumber(towerSaveEntities.getSerialNumber());
        if(count!=null&&count>0){
            return ResultVO.failed("流水号已存在，请重新填写！");
        }
        List<TowerWatthourMeterVO> watthourMeterVOs = towerSaveEntities.getTowerWatthourMeterVOs();
        if (watthourMeterVOs != null && watthourMeterVOs.size() > 0) {
            saveWatthour(watthourMeterVOs, id);//保存电表信息
        }
        if(!StringUtils.isBlank(towerSaveEntities.getCostCenterID())){
            SysTowerMidCostcenter sysTowerMidCostcenter = new SysTowerMidCostcenter();
            sysTowerMidCostcenter.setId(StringUtils.getUUid());
            sysTowerMidCostcenter.setSysTowerEleId(id);
            sysTowerMidCostcenter.setSysCostCenterId(towerSaveEntities.getCostCenterID());
            towerElectricityDao.saveTowerMidCostcenter(sysTowerMidCostcenter);
        }
        if(!StringUtils.isBlank(towerSaveEntities.getSupplierName())){
            SysTowerMidSupplier sysTowerMidSupplier = new SysTowerMidSupplier();
            sysTowerMidSupplier.setId(StringUtils.getUUid());
            sysTowerMidSupplier.setSysTowerEleId(id);
            sysTowerMidSupplier.setSysSupplier(towerSaveEntities.getSupplierName());
            towerElectricityDao.saveTowerMidSupplier(sysTowerMidSupplier);
        }
        if(towerSaveEntities.getStatus() == 1){
            towerSaveEntities.setSubmitPerson(userID);
            towerSaveEntities.setSubmitDate(new Date());
        }
        //保存塔维稽核单
        towerElectricityDao.saveElectricty(towerSaveEntities);
        
        if (towerSaveEntities.getStatus() == 1) {//提交给流程
            towerAuditFlowService.startFlow(id);
        }
        if(towerSaveEntities.getOverProoFreAsons()!=null && !towerSaveEntities.getOverProoFreAsons().equals("")) {
        	//添加超标杆信息
        	Map<String,Object> param22 = new HashMap<String,Object>();
        	param22.put("id", id);
        	param22.put("dec", towerSaveEntities.getOverProoFreAsons());
        	towerElectricityDao.addDEC(param22);
        	Map<String,Object> checkPR = checkPowerRating(towerSaveEntities);//检测超标杆信息
        	//向超标杆表中添加数据
        	double overProportin = 0d;
        	if((boolean)checkPR.get("isPR")==true) {
        		double benchmark1 = (double) checkPR.get("overOldPowerRating");
        		BigDecimal b = new BigDecimal(benchmark1);   
        		double benchmark = b.setScale(4, BigDecimal.ROUND_HALF_UP).doubleValue();
        		double overProportin1 = (double) checkPR.get("overScale");
        		BigDecimal c = new BigDecimal(overProportin1);   
        		overProportin = c.setScale(4, BigDecimal.ROUND_HALF_UP).doubleValue();
        		saveBenchmar(id, towerSaveEntities.getSerialNumber(), 1, benchmark, overProportin);
        	}
        	 if (towerSaveEntities.getStatus() == 1) {//提交给流程的情况下
        		 //这儿需要查询铁塔所在城市
        		 CityNameVO cityById = towerElectricityDao.getCityById(towerSaveEntities.getSysTowerSitId()); 
        		 //推送emos
        		 this.emos(id, cityById.getCityName(), towerSaveEntities.getZgTowerSiteName(), String.valueOf(overProportin), towerSaveEntities.getOverProoFreAsons());
        	 }
        }
      //退网状态，当用户选择退网的模式的时候，才对退网的机房数据进行锁定，锁定数据信息存在中间表中
  		if(towerSaveEntities.getIsOnline()!=null && towerSaveEntities.getIsOnline().equals("2")) {
  			//修改当前报账点对应的机房状态为锁定
  			this.lockingRoomBySiteNo(towerSaveEntities.getSysTowerSitNo(), id);
  		}
        return ResultVO.success();
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
        eleCpowerJobVO.setType(2);
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
    
    
    /**
	 * 保存超标杆信息
	 * @param electricityId 塔维稽核单ID
	 * @param electricitySN 塔维稽核单流水号
	 * @param type 超标杆类型
	 * @param benchmarkElectricity 标杆电量
	 * @param overProportion 超标杆比例
	 */
    private void saveBenchmar(String twElectricityId, String twElectricitySN, int type, double benchmark, double overProportion){
		//存储到数据库
		TowerEleBenchmark twEleBenchmarkEntity = new TowerEleBenchmark();
		twEleBenchmarkEntity.setTower_electricityId(twElectricityId);
		twEleBenchmarkEntity.setTower_electricitySN(twElectricitySN);
		twEleBenchmarkEntity.setType(type);
		twEleBenchmarkEntity.setBenchmark(benchmark);
		twEleBenchmarkEntity.setOverProportion(overProportion);
		
		towerElectricityDao.deleteBenchmarkByTWID(twElectricityId);
		
		towerElectricityDao.saveBenchmark(twEleBenchmarkEntity);
    }
    
    private void saveWatthour(List<TowerWatthourMeterVO> watthourMeterVOs, String id) {
        List<SysTowerMidWatthour> sysTowerMidWatthours = Lists.newArrayList();
        for (TowerWatthourMeterVO towerWatthourMeterVO : watthourMeterVOs) {
            String wID = StringUtils.getUUid();
            towerWatthourMeterVO.setId(wID);
            SysTowerMidWatthour sysTowerMidWatthour = new SysTowerMidWatthour();
            sysTowerMidWatthour.setId(StringUtils.getUUid());
            sysTowerMidWatthour.setSysTowerEleId(id);
            sysTowerMidWatthour.setSysTowerWatthourId(wID);
            towerElectricityDao.saveTowerWatthour(towerWatthourMeterVO);
            sysTowerMidWatthours.add(sysTowerMidWatthour);
        }
        towerElectricityDao.saveTowerMidWatthour(sysTowerMidWatthours);
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 修改电费
     */
    @Override
    public void updateElectricty(TowerSaveEntities towerSaveEntities, UserVo userInfo) {
        towerSaveEntities.setUpdateDate(new Date());
        towerSaveEntities.setStatus(0);//修改的情况都改为以保存
        towerSaveEntities.setUpdateDate(new Date());
        towerSaveEntities.setUpdatePerson(userInfo.getUserId());
        towerSaveEntities.setAreas(userInfo.getCity() + "");
        towerSaveEntities.setCounties(userInfo.getCounty() + "");
        towerElectricityDao.updateElectricty(towerSaveEntities);
        if(!StringUtils.isBlank(towerSaveEntities.getCostCenterID())){
            SysTowerMidCostcenter sysTowerMidCostcenter = new SysTowerMidCostcenter();
            sysTowerMidCostcenter.setSysTowerEleId(towerSaveEntities.getId());
            sysTowerMidCostcenter.setSysCostCenterId(towerSaveEntities.getCostCenterID());
            towerElectricityDao.updateTowerMidCostcenter(sysTowerMidCostcenter);
        }
        if(!StringUtils.isBlank(towerSaveEntities.getSupplierName())){
            SysTowerMidSupplier sysTowerMidSupplier = new SysTowerMidSupplier();
            sysTowerMidSupplier.setSysTowerEleId(towerSaveEntities.getId());
            sysTowerMidSupplier.setSysSupplier(towerSaveEntities.getSupplierName());
            towerElectricityDao.updateTowerMidSupplier(sysTowerMidSupplier);
        }
        String id = towerSaveEntities.getId();
        List<String> ids = Lists.newArrayList();
        ids.add(id);
        List<TowerWatthourMeterVO> watthourMeterVOs = towerSaveEntities.getTowerWatthourMeterVOs();
        towerElectricityDao.deleteTowerWatthourByTowerID(ids);
        towerElectricityDao.deleteMidWatthourByTowerID(ids);
        if (watthourMeterVOs != null) {
            List<SysTowerMidWatthour> sysTowerMidWatthours = Lists.newArrayList();
            for (TowerWatthourMeterVO watthourMeterVO : watthourMeterVOs) {
                String tID = StringUtils.getUUid();
                watthourMeterVO.setId(tID);
                towerElectricityDao.saveTowerWatthour(watthourMeterVO);
                SysTowerMidWatthour sysTowerMidWatthour = new SysTowerMidWatthour();
                sysTowerMidWatthour.setId(StringUtils.getUUid());
                sysTowerMidWatthour.setSysTowerEleId(id);
                sysTowerMidWatthour.setSysTowerWatthourId(tID);
                sysTowerMidWatthours.add(sysTowerMidWatthour);
            }
            if (sysTowerMidWatthours.size() > 0) {
                towerElectricityDao.saveTowerMidWatthour(sysTowerMidWatthours);
            }
        }
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 修改电费状态
     */
    @Override
    public ResultVO updateStatus(String[] ids, Integer status) {
        if (ids == null || ids.length == 0 || status == null) {
            return ResultVO.failed("ID或状态值不能为空！");
        }
        Map<String, Object> map = Maps.newHashMap();
        map.put("ids", ids);
        map.put("status", status + "");
        towerElectricityDao.updateStatus(map);
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
            objects = towerElectricityDao.queryELECIRICAndTotalAmount(ids);
        }
        return objects;
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
        Map<String,String> params = new HashMap<String, String>();
        params.put("userId", userId);
        List<Map<String, Object>> statusList = towerElectricityDao.stasticStatusByCreatePerson(params);
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
        List<Map<String, Object>> statusList = towerElectricityDao.stasticStatusBySubmitPerson(userId);
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
    //经办人 报销单
	@Override
	public List<Map<String, Object>> stasticStatusSubmitByCreatePerson(String userId) {
		 List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
	        Map<String, Object> resultMap = null;
	        String status = null;
	        Map<String,String> params = new HashMap<String, String>();
	        params.put("userId", userId);
	        List<Map<String, Object>> statusList = towerElectricityDao.stasticStatusByCreatePerson(params);
	        if (null != statusList && statusList.size() > 0) {
	            for (Map<String, Object> statusMap : statusList) {
	                if (null != statusMap.get("STATUS") && null != statusMap.get("AMOUNT")) {
	                	status = null;
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
	                    if(status != null){
	                    	resultMap.put("name", status);
	                    	resultMap.put("value", statusMap.get("AMOUNT"));
	                    	resultList.add(resultMap);
	                    }
	                }
	            }
	        }
	        return resultList;
	}
	//发起人 报销单
	@Override
	public List<Map<String, Object>> stasticStatusSubmitBySubmitPerson(String userId) {
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
        Map<String, Object> resultMap = null;
        String status = null;
        Map<String,String> params = new HashMap<String, String>();
        params.put("userId", userId);
        List<Map<String, Object>> statusList = towerElectricityDao.stasticStatusBySubmitPerson(userId);
        if (null != statusList && statusList.size() > 0) {
            for (Map<String, Object> statusMap : statusList) {
                if (null != statusMap.get("STATUS") && null != statusMap.get("AMOUNT")) {
                	status = null;
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
                    if(status != null){
                    	resultMap.put("name", status);
                    	resultMap.put("value", statusMap.get("AMOUNT"));
                    	resultList.add(resultMap);
                    }
                }
            }
        }
        return resultList;
	}

    @Override
    public ResultVO checkSerialNumber(String serialNumber) {
        Integer count =  towerElectricityDao.checkSerialNumber(serialNumber);
        if(count!=null&&count>0){
            return ResultVO.failed("流水号已存在，请重新填写！");
        }
        return ResultVO.success();
    }

	@Override
	public List<TowerElectrictyExcelVO> exportExcel(Map<String,Object> map) {
		List<TowerElectrictyExcelVO> list= towerElectricityDao.exportExcel(map);
		return list;
	}
    
	@Override
	public TowerWatthourMeterVO getMt(String sid) {
		TowerWatthourMeterVO mt = towerElectricityDao.getMt(sid);
		if(mt!=null){
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
			Date belongEndTime = mt.getBelongEndTime();
			String format = sdf.format(belongEndTime);
			mt.setBelongEndTimeS(format);
		}
		return mt;
	}
	
	/**
	 * @param :
	 * @return :
	 * @throws
	 * @Description: 查询老数据库稽核单数据
	 */
	@Override
	public List<String> getOldEle(TowerElectricityFlowVo param) {
		List<String> list = towerElectricityDao.getOldEle(param);
		return list;
	}

}
