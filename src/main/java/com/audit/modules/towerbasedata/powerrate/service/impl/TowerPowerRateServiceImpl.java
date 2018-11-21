package com.audit.modules.towerbasedata.powerrate.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.powerrate.dao.TowerPowerRateDao;
import com.audit.modules.towerbasedata.powerrate.entity.TowerPowerRateVO;
import com.audit.modules.towerbasedata.powerrate.service.TowerPowerRateService;

/**   
 * @Description : TODO(额定功率信息管理)    
 *
 * @author : bingliup
 * @date : 2017年4月30日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Service
public class TowerPowerRateServiceImpl implements TowerPowerRateService{
	
	
	@Autowired
	private TowerPowerRateDao powerRateDao;
	
	@Override
	public List<TowerPowerRateVO> queryListPage(PageUtil<TowerPowerRateVO> page) {
		
		return powerRateDao.getPageList(page);
	}

	@Override
	public ResultVO selectById(String id) {
		if (id !=null && !id.equals("")) {
			TowerPowerRateVO poManage = powerRateDao.selectById(id);
			return ResultVO.success(poManage);
		}
		return ResultVO.failed("查询失败");
	}
		 
	

	@Override
	public ResultVO update(TowerPowerRateVO poManage) {
		
		if (poManage !=null) {
			poManage.setUpdateDate(new Date());
			powerRateDao.update(poManage);
			return ResultVO.success();
		}
		return ResultVO.failed("添加失败");
		 
	}

	/**   
	 * @Description: 通过Ids删除  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void delete(String[] idArray) {
		powerRateDao.delete(idArray);
	}
}
