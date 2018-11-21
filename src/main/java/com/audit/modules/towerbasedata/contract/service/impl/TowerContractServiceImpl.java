package com.audit.modules.towerbasedata.contract.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.contract.dao.TowerContractDao;
import com.audit.modules.towerbasedata.contract.entity.TowerContractVO;
import com.audit.modules.towerbasedata.contract.service.TowerContractService;
import com.google.common.collect.Maps;

/**
 * @author : bingliup
 * @Description : 合同查询
 * @date : 2017/4/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Service
public class TowerContractServiceImpl implements TowerContractService {

    @Autowired
    private TowerContractDao contractDao;

    /**
     * @Description: 获取合同信息
     */
	@Override
	public List<TowerContractVO> queryListPage(TowerContractVO VO, PageUtil<TowerContractVO> pageUtil) {
		Map<String, Object> paramMap = Maps.newHashMap();
		if (null != VO) {
			setMap(paramMap, VO, pageUtil);
		}
		return contractDao.getPageList(pageUtil);
	}
	
	/**   
	 * @Description: 设置查询参数    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, TowerContractVO VO, PageUtil<TowerContractVO> pageUtil) {
		if (VO.getCityId() != null) {
			paramMap.put("CityId", VO.getCityId());
		}
		if (VO.getCountyId() != null) {
			paramMap.put("CountyId", VO.getCountyId());
		}
        if (VO.getCode() != null) {
			paramMap.put("Code", VO.getCode());
		}
		if (VO.getLabel() != null) {
			paramMap.put("Label", VO.getLabel());
		}
		if(VO.getZyName()!=null){
			paramMap.put("zyName", VO.getZyName());
		}
		pageUtil.setObj(paramMap);
	}

	/**
	 * 
	 */
	@Override
	public TowerContractVO selectById(String Id) {
		TowerContractVO towerContractVO = null;
		List<TowerContractVO> towerContractVOList = contractDao.selectById(Id);
		if(towerContractVOList != null && towerContractVOList.size() > 0){
			towerContractVO = towerContractVOList.get(0);
		}
		return towerContractVO;
	}

	/**
	 *  @Description: 根据站点ID删除合同信息
	 */
	@Override
	public void delete(List<String> IdList) {
		contractDao.delete(IdList);
	}


	/**
	 *  @Description: saveOrUpdate合同信息
	 */

	@Override
	public void update(TowerContractVO VO) {
		contractDao.update(VO);
	}
	
	/**
	 *  @Description:  铁塔id 查询合同信息
	 */
	@Override
	public List<TowerContractVO> selectByTowerId(String towerId) {
		if (towerId != null) {
			List<TowerContractVO> list = contractDao.selectByTowerId(towerId);
			for (TowerContractVO towerContractVO : list) {
				String paymentCycle =towerContractVO.getPaymentCycle(); 
				if (paymentCycle != null && !paymentCycle.equals("")) {
					switch (paymentCycle) {
					case "1":
						towerContractVO.setPaymentCycle("月");
						break;
					case "3":
						towerContractVO.setPaymentCycle("季度");
						break;
					case "6":
						towerContractVO.setPaymentCycle("半年");
						break;
					case "12":
						towerContractVO.setPaymentCycle("年");
						break;
					default:
						break;
					}
				}
				String isClud = towerContractVO.getIsClud();
				if (isClud != null && !isClud.equals("")) {
					
					switch (isClud) {
					case "0":
						towerContractVO.setIsClud("包干"); 
						break;
					case "1":
						towerContractVO.setIsClud("不包干");
						break;
					default:
						break;
					}
				}
			}
			return list;
		}
			return null;
	}

	@Override
	public Integer queryCount() {
		Integer queryCount = contractDao.queryCount();
		return queryCount;
	}
	
}
