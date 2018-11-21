package com.audit.modules.contract.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.contract.dao.ContractDao;
import com.audit.modules.contract.entity.ContractVO;
import com.audit.modules.contract.service.ContractService;
import com.google.common.collect.Maps;

/**
 * @author : jiadu
 * @Description : 合同查询
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Service
public class ContractServiceImpl implements ContractService {

    @Autowired
    private ContractDao contractDao;
    @Override
    public ContractVO queryByMeters(String metersNumber) {
        ContractVO contractVO = new ContractVO();
        contractVO.setIsClud("1");
        contractVO.setUnitPrice("0.9119");
        return contractVO;	
    }

    /**
     * @Description: 根据站点ID获取合同信息
     * @param :      siteId
     * @return :
     * @throws
    */
    @Override
    public ContractVO queryBySiteId(String siteId) {
        Map<String,String> paramterMap = Maps.newHashMap();
        paramterMap.put("siteId",siteId);
        return contractDao.queryBySiteId(paramterMap);
    }

    /**
     * @Description: 获取合同信息
     */
	@Override
	public List<ContractVO> queryContractListPage(ContractVO contractVO, PageUtil<ContractVO> pageUtil) {
		Map<String, Object> paramMap = Maps.newHashMap();
		if (null != contractVO) {
			setMap(paramMap, contractVO, pageUtil);
		}
		List<ContractVO> list=contractDao.getPageContractList(pageUtil);
		if(list!=null&&list.size()!=0){
			for(int i=0;i<list.size();i++){
				if(list.get(i)!=null){
					//分级审批记录
					if(list.get(i).getIsUploadOverproof()==null){
						list.get(i).setIsUploadOverproof("");
					}
					if(list.get(i).getIsUploadOverproof().equals("0")){
						list.get(i).setIsUploadOverproof("有");
					}else if(list.get(i).getIsUploadOverproof().equals("1")){
						list.get(i).setIsUploadOverproof("无");
					}else{
						list.get(i).setIsUploadOverproof("");
					}
					//缴费周期
					if(list.get(i).getPaymentCycle()==null){
						list.get(i).setPaymentCycle("");
					}
					if(list.get(i).getPaymentCycle().equals("1")){
						list.get(i).setPaymentCycle("月");
					}else if(list.get(i).getPaymentCycle().equals("3")){
						list.get(i).setPaymentCycle("季");
					}else if(list.get(i).getPaymentCycle().equals("6")){
						list.get(i).setPaymentCycle("半年");
					}else if(list.get(i).getPaymentCycle().equals("12")){
						list.get(i).setPaymentCycle("年");
					}else{
						list.get(i).setPaymentCycle("");
					}
					//单价或包干价
					if(list.get(i).getPriceOrLumpSumPrice()==null){
						list.get(i).setPriceOrLumpSumPrice("0");
					}
					if(Double.valueOf(list.get(i).getPriceOrLumpSumPrice())>20){
						if(list.get(i).getPaymentCycle().equals("")){
							list.get(i).setCludPrice(list.get(i).getPriceOrLumpSumPrice());
						}else{
						list.get(i).setCludPrice(list.get(i).getPriceOrLumpSumPrice()+"/"+list.get(i).getPaymentCycle());
						}
					}else if(Double.valueOf(list.get(i).getPriceOrLumpSumPrice())<20&&Double.valueOf(list.get(i).getPriceOrLumpSumPrice())>0){
						list.get(i).setUnitPrice(list.get(i).getPriceOrLumpSumPrice());
					}else{
						list.get(i).setCludPrice("");
						list.get(i).setUnitPrice("");
					}
					
				}				
			}			
		}
		return list;
	}
	
	/**   
	 * @Description: 设置查询参数    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, ContractVO contractVO, PageUtil<ContractVO> pageUtil) {
		System.out.println(contractVO.getCityId()+"==="+contractVO.getCountyId()+"==="+contractVO.getId()+"==="+contractVO.getName());
		if (contractVO.getCityId() != null) {
			paramMap.put("CityId", contractVO.getCityId());
		}
		if (contractVO.getCountyId() != null) {
			paramMap.put("CountyId", contractVO.getCountyId());
		}
        if (contractVO.getId() != null) {
			paramMap.put("Id", contractVO.getId());
		}
		if (contractVO.getName() != null) {
			paramMap.put("Name", contractVO.getName());
		}
		if (contractVO.getAccountName() != null) {
			paramMap.put("accountName", contractVO.getAccountName());
		}
		
		pageUtil.setObj(paramMap);
	}

	/**
	 * 
	 */
	@Override
	public ContractVO selectByContractId(String contractId) {
		return contractDao.selectByContractId(contractId);
	}

	/**
	 *  @Description: 根据站点ID删除合同信息
	 */
	@Override
	public void deleteContract(List<String> IdList) {
		contractDao.deleteContract(IdList);
	}


	/**
	 *  @Description: saveOrUpdate合同信息
	 */

	@Override
	public void saveOrUpdateContract(ContractVO contract) {
		contractDao.saveOrUpdateContract(contract);
	}
	
}
