/**   
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
package com.audit.modules.towerbasedata.psu.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.OwnerMeterVo;
import com.audit.modules.towerbasedata.psu.dao.TowerPSUDao;
import com.audit.modules.towerbasedata.psu.entity.TowerPSUVO;
import com.audit.modules.towerbasedata.psu.service.TowerPSUService;
import com.google.common.collect.Maps;

/**   
 * @Description: TODO   
 * @throws  
 * 
 * @author  bingliup
 * @date 2017年4月30日 下午5:16:14    
*/
@Service
public class TowerPSUServiceImpl implements TowerPSUService {

	@Autowired
	private TowerPSUDao PSUDao;
	/**   
	 * @Description:分页查询    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public List<TowerPSUVO> queryListPage(TowerPSUVO accountSitePSU, PageUtil<TowerPSUVO> pageUtil) {
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null != accountSitePSU){
			setMap(parameMap, accountSitePSU, pageUtil);
		}
		return PSUDao.getPageList(pageUtil);
	}

	/**   
	 * @Description: 设置查询参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> paramMap, TowerPSUVO VO, PageUtil<TowerPSUVO> pageUtil) {
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
		pageUtil.setObj(paramMap);
		
	}

	/**   
	 * @Description: 通过Id查询供电信息    
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public TowerPSUVO selectById(String Id) {
		return PSUDao.selectById(Id);
	}

	/**   
	 * @Description: 通过Id修改供电信息 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void update(TowerPSUVO vo) {
		vo.setUpdateTime(new Date());
		PSUDao.update(vo);
	}

	/**   
	 * @Description: 通过Ids 删除  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void delete(String[] idArray) {
		PSUDao.updateRemove(idArray);
	}

	@Override
	public List<TowerPSUVO> exportExcel(Map<String,Long> map) {
		List<TowerPSUVO> list= PSUDao.exportExcel(map);
		return list;
	}
	
	@Override
	public Long listCount() {
		return PSUDao.listCount();
	}
	
}
