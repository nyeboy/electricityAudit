package com.audit.modules.towerbasedata.datashow.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.DateUtil;
import com.audit.modules.common.utils.StreamUtil;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.towerbasedata.datashow.dao.TowerPowerRatedDao;
import com.audit.modules.towerbasedata.datashow.entity.TowerPowerRate;
import com.audit.modules.towerbasedata.datashow.entity.TowerPowerRateDetail;
import com.audit.modules.towerbasedata.datashow.service.TowerPowerRatedService;

/**   
 * @Description : TODO(请描述该文件主要功能)    
 *
 * @author : 
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Service
public class TowerPowerRatedServiceImpl implements TowerPowerRatedService{
	
	@Autowired
	private TowerPowerRatedDao towerPowerRateDao;
	
	/**   
	 * Description: 塔维：额定功率标杆管理
	*/
	@Override
	public List<TowerPowerRate> powerRateManage(PageUtil<TowerPowerRate> page) {
		List<TowerPowerRate> list = towerPowerRateDao.powerRateManage(page);
			
		if (list != null && list.size()>1) {
			for(TowerPowerRate tRate : list){
				//获取站点总功率
				Double sDouble = towerPowerRateDao.queryTotalPower(tRate.getTowerId());
				if (sDouble != null) {
					tRate.setSiteTotalPower(sDouble);
					//电量标杆值
					tRate.setStandardNum(sDouble*24/1000);
				}else {
					tRate.setSiteTotalPower(0.0);
					tRate.setStandardNum(0.0*24/1000);
				}
				tRate.setUpdateStatus("已更新");
				tRate.setUpdateTime(DateUtil.toPageData(new Date()));
			}
		}
		return list;
	}

	/**   
	 * Description:塔维：额定功率标杆管理-详情
	*/
	@Override
	public List<TowerPowerRateDetail> powerRateManageDetail(String towerId) {
	
	List<EquRoomDevice> deviceList = towerPowerRateDao.powerRateManageDetail(towerId);
	List<TowerPowerRateDetail> result = new ArrayList<>();
	if(deviceList == null || deviceList.isEmpty()){
		return result;
	}
	
	// 分别根据机房名、设备专业、设备类型、设备型号、设备厂家进行排序
	StreamUtil.sort(deviceList, new StreamUtil.SorterASC<>(EquRoomDevice::getEquipmentRoomName),
			new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceBelong),
			new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceType),
			new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceModel),
			new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceVendor));

	
	for (EquRoomDevice equRoomDevice : deviceList) {
		if (equRoomDevice == null) {
			continue;
		}
		TowerPowerRateDetail currentDeviceVO = new TowerPowerRateDetail(equRoomDevice);
	
		// 如果是第一个元素，则直接存入列表
		if (result.isEmpty()) {
			result.add(currentDeviceVO);
			continue;
		}
		// 获取最近的一个设备信息
		// 如果与当前设备是同一个设备，则累加number
		// 否则，将当前设别存入列表
		TowerPowerRateDetail lastDeviceVO = result.get(result.size() - 1);
		
		if (lastDeviceVO!=null && lastDeviceVO.equals(currentDeviceVO)) {
			lastDeviceVO.addNumber();
			//额定总功率= 数量 * 额定功率
			lastDeviceVO.setRateTotalPower(lastDeviceVO.getAmount()*lastDeviceVO.getRatePower());
		} else {
			result.add(currentDeviceVO);
		}
	}
		return result;
	}
	
}
