/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.towerbasedata.other.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.other.dao.TowerOtherDao;
import com.audit.modules.towerbasedata.other.entity.TowerOtherVO;
import com.audit.modules.towerbasedata.other.service.TowerOtherService;
import com.google.common.collect.Maps;

/**   
 * @Description:    
 * @throws  
 * 
 * @author  bingliu
 * @date 2017年4月30日 下午5:16:14    
*/
@Service
public class TowerOtherServiceImpl implements TowerOtherService {

	@Autowired
	private TowerOtherDao otherDao;
	/**   
	 * @Description:分页查询    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public List<TowerOtherVO> queryListPage(TowerOtherVO VO, PageUtil<TowerOtherVO> pageUtil) {
		Map<String, TowerOtherVO> resultMap = Maps.newHashMap();
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null != VO){
			setMap(parameMap, VO, pageUtil);
		}
		return otherDao.getPageList(pageUtil);
		
	}

	/**   
	 * @Description: 设置参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, TowerOtherVO VO, PageUtil<TowerOtherVO> pageUtil) {
		if (VO.getCityId() != null) {
			paramMap.put("CityId", VO.getCityId());
		}
		if (VO.getCountyId() != null) {
			paramMap.put("CountyId", VO.getCountyId());
		}
        if (VO.getCode() != null) {
			paramMap.put("Code", VO.getCode());
		}
        if (VO.getName() != null) {
     			paramMap.put("name", VO.getName());
     		}
		if (VO.getLabel() != null) {
			paramMap.put("Label", VO.getLabel());
		}
		pageUtil.setObj(paramMap);
		
	}

	/**   
	 * @Description: 通过Id查询报账点信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public TowerOtherVO selectById(String Id) {
		return otherDao.selectById(Id);
	}

	/**
	 * 保存修改
	 */
	@Override
	public void update(TowerOtherVO VO) {
		otherDao.update(VO);
	}

	/**   
	 * @Description: 设置为""  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void delete(String[] idArray) {
		otherDao.updateRemove(idArray);
	}



}
