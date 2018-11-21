package com.audit.modules.towerbasedata.datashow.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StreamUtil;
import com.audit.modules.electricity.entity.DeviceVO;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.towerbasedata.datashow.entity.TowerDataShow;
import com.audit.modules.towerbasedata.datashow.service.TowerBaseDataService;
import com.audit.modules.towerbasedata.datashow.dao.TowerBaseDateDao;
/**   
 * @Description : TODO(塔维基础数据 --呈现)    
 *
 * @author : chentao
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
@Service
public class TowerBaseDataServiceImpl implements TowerBaseDataService{

	@Autowired
	private TowerBaseDateDao TowerBaseDateDao;
	
	/**   
	 * Description: 查询铁塔信息列表 
	*/
	@Override
	public List<TowerDataShow> showBaseDateByPage(PageUtil<TowerDataShow> page) {
		
		return TowerBaseDateDao.showBaseDateByPage(page);
	}

	/**   
	 * Description:  查询供电信息、其他信息
	*/
	@Override
	public TowerDataShow findTowerSiteById(String towerId) {
		TowerDataShow towerDataShow = TowerBaseDateDao.findTowerSiteById(towerId);
		if (towerDataShow != null ) {
			String elecType = towerDataShow.getElecType();
			if (elecType != null && !elecType.equals("")) {
				switch (elecType) {
				case "1":
					towerDataShow.setElecType("直供电");
					break;
				case "2":
					towerDataShow.setElecType("转供电");	
					break;
				}}
				
			String zzType =  towerDataShow.getZzType();
			if (zzType != null && !zzType.equals("")) {
				switch (zzType) {
				case "1":
					towerDataShow.setZzType("铁塔新建");
					break;
				case "2":
					towerDataShow.setZzType("电信存量");
					break;
				case "3":
					towerDataShow.setZzType("联通存量");
					break;
				case "4":
					towerDataShow.setZzType("移动存量");
					break;
			}}
				
			String shareType =  towerDataShow.getShareType();
			if (shareType != null && !shareType.equals("")) {
				switch (shareType) {
				case "1":
					towerDataShow.setShareType("共享");
					break;
				case "2":
					towerDataShow.setShareType("独享");
					break;
			}}
			
			String cycle =  towerDataShow.getCycle();
			if (cycle != null && !cycle.equals("")) {
				switch (cycle) {
				case "1":
					towerDataShow.setCycle("月");
					break;
				case "3":
					towerDataShow.setCycle("季度");
					break;
				case "6":
					towerDataShow.setCycle("半年");
					break;
				case "12":
					towerDataShow.setCycle("年");
					break;
			}
			}
		}
		return towerDataShow;
	}

	/**   
	 * Description:  查询机房设备信息
	*/
	@Override
	public List<DeviceVO> queryDeviceById(String towerId) {
		List<EquRoomDevice> deviceList = TowerBaseDateDao.queryDeviceById(towerId);
		if (deviceList == null || deviceList.isEmpty()) {
			return null;
		}
		// 分别根据机房名、设备专业、设备类型、设备型号、设备厂家进行排序
		StreamUtil.sort(deviceList, new StreamUtil.SorterASC<>(EquRoomDevice::getEquipmentRoomName),
				new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceBelong),
				new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceType),
				new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceModel),
				new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceVendor));

		List<DeviceVO> result = new ArrayList<>();
		DeviceVO currentDeviceVO = null;
		for (EquRoomDevice equRoomDevice : deviceList) {
			if (equRoomDevice != null) {
				currentDeviceVO = new DeviceVO(equRoomDevice);
			}
			// 如果是第一个元素，则直接存入列表
			if (result.isEmpty()) {
				result.add(currentDeviceVO);
				continue;
			}
			// 获取最近的一个设备信息
			// 如果与当前设备是同一个设备，则累加number
			// 否则，将当前设别存入列表
			DeviceVO lastDeviceVO = result.get(result.size() - 1);
			if (lastDeviceVO.equals(currentDeviceVO)) {
				lastDeviceVO.addNumber();
			} else {
				result.add(currentDeviceVO);
			}
		}

		return result;
	}
	
}
