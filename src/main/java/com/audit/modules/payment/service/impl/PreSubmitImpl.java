package com.audit.modules.payment.service.impl;

import com.audit.modules.common.DoubleUtil;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.dict.FlowConstant;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.electricity.service.InputElectricityService;
import com.audit.modules.payment.dao.AdvancePaymentDao;
import com.audit.modules.payment.dao.PreSubmitDao;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.payment.entity.EleMiddleSubmitVO;
import com.audit.modules.payment.entity.ElectricitySubmitVO;
import com.audit.modules.payment.entity.PreMidSubmit;
import com.audit.modules.payment.entity.PreSubmit;
import com.audit.modules.payment.service.AdvancePaymentService;
import com.audit.modules.payment.service.PreSubmitService;
import com.audit.modules.system.entity.UserVo;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Transactional
@Service
public class PreSubmitImpl implements PreSubmitService {

    @Autowired
    private AdvancePaymentService adpvService;

    @Autowired
    private PreSubmitDao  electricitySubmitDao;

    @Override
    public ResultVO createEleSubmit(ElectricitySubmitVO electricitySubmitVO, HttpServletRequest request) {
    	 List<String> ids = electricitySubmitVO.getIds();
         if (ids == null || ids.size() == 0) {
             return ResultVO.failed("预付录入单ID不能为空！");
         }
         if(ids.size()>1) {
        	 String isOnlyOne1="";
        	 String isOnlyOne2="";
        	 isOnlyOne1 = adpvService.getOneById(ids.get(0)).getSupplyId();
        	 for(int i=0; i<ids.size(); i++) {
        		 isOnlyOne2 = adpvService.getOneById(ids.get(i)).getSupplyId();
        		 if(!isOnlyOne1.equals(isOnlyOne2)) {
        			 return ResultVO.failed("只有同一供应商才能打包提交");
        		 }
        	 }
        	 
         }
    	String id = "YFTID"+StringUtils.getUUid();
        //预付提交单id
        electricitySubmitVO.setId(id);
        try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			electricitySubmitVO.setStatus(1);
		} catch (AuthorizationException e) {
			electricitySubmitVO.setStatus(0);
		}
        //设置预付报销单其它数据
        electricitySubmitVO.setReimbursementType(0);
        electricitySubmitVO.setCreateDate(new Date());
        electricitySubmitVO.setSubmitNo(StringUtils.createSerialNumber("YFTDH"));
        Object object = request.getSession().getAttribute("userInfo");
        //设置预付单报销提交人信息
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
            electricitySubmitVO.setTrustees(userInfo.getUserId());
            electricitySubmitVO.setCity(userInfo.getCity() + "");
            electricitySubmitVO.setCounty(userInfo.getCounty() + "");
        }
        List<AdvancePaymentVo> adpvList=new ArrayList<AdvancePaymentVo>(); 
        //根据id查找预付单信息
        for(String idd:ids){
        	AdvancePaymentVo adpv = adpvService.getOneById(idd);
        	adpvList.add(adpv);
        }
        electricitySubmitVO.setAdpv(adpvList);
        Double moneyAmount=0d;
        for (AdvancePaymentVo adp : adpvList) {
            // 更新预付单状态
        	Map<String, Object> map=new HashMap<String,Object>();
        	map.put("id", adp.getId());
        	map.put("status", 4);
            adpvService.upPreStatus(map);
            String totalMoney = adp.getTotalMoney();
            moneyAmount=DoubleUtil.add(moneyAmount, Double.parseDouble(totalMoney));
        }
        electricitySubmitVO.setMoneyAmount(String.valueOf(moneyAmount));
        electricitySubmitDao.createEleSubmit(electricitySubmitVO);//保存预付单报销单
        for (String eid : ids) {
            PreMidSubmit preMidSubmit = new PreMidSubmit();
            preMidSubmit.setId(StringUtils.getUUid());
            preMidSubmit.setSysPreId(eid);
            preMidSubmit.setSysPreSubmitId(id);
            electricitySubmitDao.savePreMidlleSubmit(preMidSubmit);//保存中间表
            
        }
        return ResultVO.success(electricitySubmitVO.getId());
    }

    /**
     * @param :
     * @return :
     * @throws
     * @Description: 查询列表
    */
    @Override
    public void queryList(ElectricitySubmitVO electricitySubmitVO, PageUtil<ElectricitySubmitVO> pageUtil) throws ParseException {
        Map<String, Object> parameMap = Maps.newHashMap();
        setMap(parameMap, electricitySubmitVO, pageUtil);
        List<ElectricitySubmitVO> electricitySubmitVOs = electricitySubmitDao.queryList(pageUtil);
        for(ElectricitySubmitVO evo : electricitySubmitVOs) {
        	//查中间表
        	String subid = evo.getId();
        	List<PreMidSubmit> eleids = electricitySubmitDao.queryMiddleBySubID(subid);
        	//查预付表
        	if (eleids != null && eleids.size() > 0) {
        		String payeleId = eleids.get(0).getSysPreId();
            	AdvancePaymentVo payele = adpvService.getViewPrepayDetails(payeleId);
            	//赋值
            	if(payele!=null) {
            		evo.setSupplierName(payele.getSupplyStr());
            	}
			}
        	
        }
    }
    /**
     * 查看预付提交单详情
     */
    @Override
    public ResultVO queryDetail(String subID) {
        ElectricitySubmitVO electricitySubmitVO = electricitySubmitDao.queryDetail(subID);
        List<PreMidSubmit> eleMiddleSubmitVOs = electricitySubmitDao.queryMiddleBySubID(subID);
        List<String> elID = Lists.newArrayList();
        for (PreMidSubmit middleSubmitVO : eleMiddleSubmitVOs) {
            elID.add(middleSubmitVO.getSysPreId());
        }
        
        List<AdvancePaymentVo> queryByIDs = new ArrayList<AdvancePaymentVo>();
        if (elID.size() > 0) {
            queryByIDs = adpvService.queryByIDs(elID);

		}
        electricitySubmitVO.setAdpv(queryByIDs);
        return ResultVO.success(electricitySubmitVO);
    }

//    /**
//     * @param :
//     * @return :
//     * @throws
//     * @Description: 删除电费提交表
//     */
//    @Override
//    public ResultVO deleteBySubID(String subID) {
//        electricitySubmitDao.deleteBySubID(subID);
//        electricitySubmitDao.deleteEleMidBySubID(subID);
//        return ResultVO.success();
//    }
//
    @Override
    public ResultVO updateStatus(Integer status, String[] ids) {
        if (ids == null || ids.length == 0) {
            return ResultVO.failed("id不能为空！");
        }
        if (status == null) {
            return ResultVO.failed("状态不能为空！");
        }
        Map<String, Object> map = Maps.newHashMap();
        map.put("status", status);
        map.put("ids", ids);
        electricitySubmitDao.updateStatus(map);
        return ResultVO.success();
    }

    private void setMap(Map<String, Object> parameMap, ElectricitySubmitVO electricitySubmitVO, PageUtil<ElectricitySubmitVO> pageUtil) throws ParseException {
        if (electricitySubmitVO.getSubmitNo() != null && !"".equals(electricitySubmitVO.getSubmitNo())) {
            parameMap.put("submitNo", electricitySubmitVO.getSubmitNo());
        }
        if (electricitySubmitVO.getStatus() != null) {
            parameMap.put("status", electricitySubmitVO.getStatus() + "");
        }
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        if (electricitySubmitVO.getStartCreateDate() != null && !"".equals(electricitySubmitVO.getStartCreateDate())) {
            parameMap.put("startTime", format.parse(electricitySubmitVO.getStartCreateDate()));
        }
        if (electricitySubmitVO.getEndCreateDate() != null && !"".equals(electricitySubmitVO.getEndCreateDate())) {
            parameMap.put("endTime", format.parse(electricitySubmitVO.getEndCreateDate()));
        }
		if (!StringUtils.isEmpty(electricitySubmitVO.getTrustees())) {
			parameMap.put("trustees", electricitySubmitVO.getTrustees());
		}
        pageUtil.setObj(parameMap);
    }
//
//    /**
//	 * 通过流水号更新状态值
//	 * 
//	 * @param status 状态值
//	 * @param submitNos 电费提交单号
//	 * @return 更新结果
//	 */
//	@Override
//	public ResultVO updateStatusByNo(Integer status, String[] submitNos) {
//		if (submitNos == null || submitNos.length == 0) {
//			return ResultVO.failed("电费提交单号不能为空！");
//		}
//		if (status == null) {
//			return ResultVO.failed("状态不能为空！");
//		}
//		Map<String, Object> map = Maps.newHashMap();
//		map.put("status", status);
//		map.put("submitNos", submitNos);
//		electricitySubmitDao.updateStatusByNo(map);
//		return ResultVO.success();
//	}
//
//	/**
//	 * 通过稽核单号查询
//	 * 
//	 * @param submitNo 稽核单号
//	 * @return 电费提交单
//	 */
//	@Override
//	public ElectricitySubmitVO queryBysubmitNo(String submitNo) {
//		return electricitySubmitDao.queryBysubmitNo(submitNo);
//	}

	@Override
	public PreSubmit getPreSubBySubNO(String submitNo) {
		PreSubmit preSubBySubNO = electricitySubmitDao.getPreSubBySubNO(submitNo);
		return preSubBySubNO;
	}

	@Override
	public List<String> getSpIds(String spsid) {
		List<String> spIds = electricitySubmitDao.getSpIds(spsid);
		return spIds;
	}
}
