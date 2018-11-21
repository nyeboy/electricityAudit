package com.audit.modules.basedata.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.PowerRateManageDao;
import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.basedata.entity.PropertyAsStatus;
import com.audit.modules.basedata.service.PowerRateManageService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;

/**   
 * @Description : TODO(额定功率信息管理)    
 *
 * @author : 
 * @date : 2017年4月20日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Service
public class PowerRateManageServiceImpl implements PowerRateManageService{
	
	
	@Autowired
	private PowerRateManageDao powerRateManageDao;
	
	@Override
	public List<PowerRateManage> findPowerRateByPage(PageUtil<PowerRateManage> page) {
		
		return powerRateManageDao.findPowerRateByPage(page);
	}

	@Override
	public List<String> findProperty() {
		
		return powerRateManageDao.findProperty();
	}
	
	@Override
	public List<String> findStatus() {
		
		return powerRateManageDao.findStatus();
	}
	
	@Override
	public ResultVO selectFacility(String id) {
		
		if (id !=null && !id.equals("")) {
			List<PowerRateManage> poManage = powerRateManageDao.selectFacility(id);
			return ResultVO.success(poManage);
		}
		return ResultVO.failed("查询失败");
	}
	
	@Override
	public ResultVO findPowerRateById(String id) {
		
		if (id !=null && !id.equals("")) {
			PowerRateManage poManage = powerRateManageDao.findPowerRateById(id);
			return ResultVO.success(poManage);
		}
		return ResultVO.failed("查询失败");
	}
		 
	

	@Override
	public ResultVO updatePowerRate(PowerRateManage poManage) {
		
		if (poManage !=null) {
			SimpleDateFormat sFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			poManage.setUpdateDate(sFormat.format(new Date()));
			powerRateManageDao.updatePowerRate(poManage);
			 return ResultVO.success();
		}
		return ResultVO.failed("添加失败");
		 
	}

	@Override
	public ResultVO deletePowerRateById(String id) {
		
		if (id !=null && !id.equals("")) {
			powerRateManageDao.deletePowerRateById(id);
			return ResultVO.success();
		}
		return ResultVO.failed("查询失败");
	}
		 

	@Override
	public ResultVO insertPowerRate(PowerRateManage poManage) {
		
		if (poManage !=null) {
			powerRateManageDao.insertPowerRate(poManage);
			 return ResultVO.success();
		}
		return ResultVO.failed("添加失败");
	}

	@Override
	public ResultVO findPdeviceType() {
		
		List<String> list = powerRateManageDao.findPdeviceType();
		System.err.println("sdfsafs____-"+list);
		return ResultVO.success(list);
	}

	

}
