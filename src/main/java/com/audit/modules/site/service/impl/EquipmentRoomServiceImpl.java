package com.audit.modules.site.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.common.utils.StreamUtil;
import com.audit.modules.electricity.entity.DeviceVO;
import com.audit.modules.site.dao.EquRoomDeviceDao;
import com.audit.modules.site.dao.SiteInfoDao;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.site.entity.PowerRatingDetailVO;
import com.audit.modules.site.service.EquipmentRoomService;

/**
 * @author 王松
 * @Description
 * @date 2017/3/15
 *
 */
@Service
public class EquipmentRoomServiceImpl implements EquipmentRoomService {

	@Autowired
	private EquRoomDeviceDao equRoomDeviceDao;
	@Autowired
	private SiteInfoDao siteInfoDao;

	@Override
	public List<DeviceVO> queryDevice(String id) {
		List<PowerRatingDetailVO> p1 = siteInfoDao.getZTOByAccountId(id);
		List<PowerRatingDetailVO> p2 = siteInfoDao.getZTTNByAccountId(id);
		List<PowerRatingDetailVO> p3 = siteInfoDao.getZWBByAccountId(id);
		List<PowerRatingDetailVO> p4 = siteInfoDao.getZWENByAccountId(id);
		List<PowerRatingDetailVO> p5 = siteInfoDao.getZWLRByAccountId(id);
		List<PowerRatingDetailVO> p6 = siteInfoDao.getZWNRByAccountId(id);
		p1.addAll(p2);
		p1.addAll(p3);
		p1.addAll(p4);
		p1.addAll(p5);
		p1.addAll(p6);
		// 分别根据机房名、设备专业、设备型号、设备厂家进行排序
		StreamUtil.sort(p1, new StreamUtil.SorterASC<>(PowerRatingDetailVO::getEquipmentRoomName),
				new StreamUtil.SorterASC<>(PowerRatingDetailVO::getDeviceBelong),
				new StreamUtil.SorterASC<>(PowerRatingDetailVO::getDeviceType),
				new StreamUtil.SorterASC<>(PowerRatingDetailVO::getDeviceModel),
				new StreamUtil.SorterASC<>(PowerRatingDetailVO::getDeviceVendor));
		
		
		
		/*List<EquRoomDevice> deviceList = equRoomDeviceDao.queryBySiteId(id);
		if (deviceList == null || deviceList.isEmpty()) {
			return null;
		}
		// 分别根据机房名、设备专业、设备类型、设备型号、设备厂家进行排序
		StreamUtil.sort(deviceList, new StreamUtil.SorterASC<>(EquRoomDevice::getEquipmentRoomName),
				new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceBelong),
				new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceType),
				new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceModel),
				new StreamUtil.SorterASC<>(EquRoomDevice::getDeviceVendor));*/

		List<DeviceVO> result = new ArrayList<>();
		for (PowerRatingDetailVO powerRatingDetail : p1) {
			DeviceVO currentDeviceVO = new DeviceVO(powerRatingDetail);
			// 如果是第一个元素，则直接存入列表
			if (result.isEmpty()) {
				result.add(currentDeviceVO);
				continue;
			}
			// 获取最近的一个设备信息
			// 如果与当前设备是同一个设备，则累加number
			// 否则，将当前设别存入列表
			DeviceVO lastDeviceVO = result.get(result.size() - 1);
			System.out.println(lastDeviceVO.getDeviceType());
			System.out.println(currentDeviceVO.getDeviceType());
			System.out.println(lastDeviceVO.getDeviceModel());
			System.out.println(currentDeviceVO.getDeviceModel());
			System.out.println(lastDeviceVO.getDeviceVendor());
			System.out.println(currentDeviceVO.getDeviceVendor());
			
			if (lastDeviceVO.getDeviceType().equals(currentDeviceVO.getDeviceType()) && lastDeviceVO.getDeviceModel().equals(currentDeviceVO.getDeviceModel()) && lastDeviceVO.getDeviceVendor().equals(currentDeviceVO.getDeviceVendor())) {
				lastDeviceVO.addNumber();
			} else {
				result.add(currentDeviceVO);
			}
		}

		return result;
	}
	
	@Override
	public PowerRateManage getPowerRating(PowerRateManage powerRatingManage) {
		return equRoomDeviceDao.getPowerRating(powerRatingManage);
	}

}
