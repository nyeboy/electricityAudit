package com.audit.modules.report.service.impl;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.report.dao.ElectricPowerDao;
import com.audit.modules.report.entity.ElectricPowerDTO;
import com.audit.modules.report.service.ElectricPowerService;

/**
 * Created by fangren on 2017/3/7.
 * 电量业务类
 */
@Service
public class ElectricPowerServiceImpl implements ElectricPowerService {

	@Autowired
	private ElectricPowerDao electricPowerDao;

	/**
	 * 年用电量统计
	 */
	@Override
	public List<ElectricPowerDTO> getStationEPStasticByCityId(String cityId, String year, String month,Integer auditType) {
		DecimalFormat df = new DecimalFormat("0.00");
		List<ElectricPowerDTO> electricChargeDTOList = new ArrayList<ElectricPowerDTO>();
		List<Map<String, Object>> electricChargetList = null;
		ElectricPowerDTO electricPowerDTO = null;
		Double regionPower = null;
		// 总用电量
		Double allPower = 0.0;
		// 平均用电量
		Double average = 0.0;
		// electricPowerDTO里存储数据的map
		Map<String, Double> map = null;
		Set<String> resultKeySet = null;
		if (null != cityId && cityId.equals("0")) {
			electricChargetList = electricPowerDao.stasticCityYearPower(year, month,auditType);
		} else if (null != cityId && !cityId.equals("0")) {
			electricChargetList = electricPowerDao.stasticCountyYearPower(cityId, year, month,auditType);
		}
		if (null != electricChargetList && electricChargetList.size() > 0) {
			for (Map<String, Object> resultMap : electricChargetList) {
				resultKeySet = resultMap.keySet();
				if (resultKeySet.contains("REGIONNAME")) {
					electricPowerDTO = new ElectricPowerDTO();
					electricPowerDTO.setCityName(resultMap.get("REGIONNAME") + "");
					electricPowerDTO.setCityId(resultMap.get("REGIONID") + "");
					regionPower = null != resultMap.get("TOTALAMOUNT")
							? Double.valueOf(resultMap.get("TOTALAMOUNT") + "") : 0.0;
					map = new HashMap<String, Double>();
					regionPower = Double.valueOf(df.format(regionPower / 10000));
					allPower += regionPower;
					map.put("power", regionPower);
					electricPowerDTO.setCityData(map);
					electricChargeDTOList.add(electricPowerDTO);
				}
			}
		}
		if (electricChargeDTOList.size() > 0) {
			average = allPower / electricChargeDTOList.size();
			average = Double.valueOf(df.format(average));
			for (ElectricPowerDTO electricPowerdto : electricChargeDTOList) {
				electricPowerdto.setAverage01(average);
			}
		}
		// 按增幅排序
		Collections.sort(electricChargeDTOList, new Comparator<ElectricPowerDTO>() {

			@Override
			public int compare(ElectricPowerDTO o1, ElectricPowerDTO o2) {
				Map<String, Double> map1 = o1.getCityData();
				Map<String, Double> map2 = o2.getCityData();
				String powerKey = null;
				for (String key : map1.keySet()) {
					if (key.indexOf("power") > 0) {
						powerKey = key;
						break;
					}
				}
				if (null != powerKey) {
					return -map1.get(powerKey).compareTo(map2.get(powerKey));
				} else {
					return 0;
				}
			}
		});

		return electricChargeDTOList;
		// return FieldConstant.parseStationEPStasticList(cityId);
	}

	/**
	 * 
	 * @Description: 年直供、转供用电量统计  
	 * @param :       
	 * @return :     
	 * @throws
	 */
	@Override
	public List<ElectricPowerDTO> getStationDetailEPStasticByCityId(String cityId, String year, String month,Integer auditType) {
		List<ElectricPowerDTO> electricPowerDTOList = new ArrayList<ElectricPowerDTO>();
		DecimalFormat df = new DecimalFormat("0.00");
		ElectricPowerDTO electricPowerDTO = null;
		// 直供电 电量
		List<Map<String, Object>> electricDirectPowertList = null;
		// 转供电 电量
		List<Map<String, Object>> electricRotaryPowertList = null;
		// 直供电量
		Double directPower = null;
		// 转供电量
		Double rotaryPower = null;
		// 转供电量比例
		Double rotaryScale = null;
		// 转供电量总数量
		Integer allDirectPowerSite = 0;
		Integer allRotaryPowerSite = 0;
		// 平均转供电量比例
		Double averageRotaryScale = null;
		// 区域名
		String directRegionName = null;
		String rotaryRegionName = null;
		// electricPowerDTO里存储数据的map
		Map<String, Double> map = null;

		if (null != cityId && cityId.equals("0")) {
			electricDirectPowertList = electricPowerDao.stasticCityYearDirectRotary(year, month, 1,auditType);
			electricRotaryPowertList = electricPowerDao.stasticCityYearDirectRotary(year, month, 2,auditType);
		} else if (null != cityId && !cityId.equals("0")) {
			electricDirectPowertList = electricPowerDao.stasticCountyYearDirectRotary(cityId, year, month, 1,auditType);
			electricRotaryPowertList = electricPowerDao.stasticCountyYearDirectRotary(cityId, year, month, 2,auditType);
		}
		if (null != electricDirectPowertList && electricDirectPowertList.size() > 0) {
			// 获取 直供电量
			for (Map<String, Object> directMap : electricDirectPowertList) {
				directRegionName = directMap.get("REGIONNAME") + "";
				if (directRegionName.equals("")) {
					continue;
				}
				electricPowerDTO = new ElectricPowerDTO();
				electricPowerDTO.setCityName(directRegionName);
				electricPowerDTO.setCityId(directMap.get("REGIONID") + "");
				directPower = null != directMap.get("TOTALAMOUNT") ? Double.valueOf(directMap.get("TOTALAMOUNT") + "")
						: 0.0;
				// 获取 转供电量
				if (null != electricRotaryPowertList && electricRotaryPowertList.size() > 0) {
					for (Map<String, Object> rotaryMap : electricRotaryPowertList) {
						rotaryRegionName = rotaryMap.get("REGIONNAME") + "";
						if (rotaryRegionName.equals(directRegionName)) {
							rotaryPower = null != rotaryMap.get("TOTALAMOUNT")
									? Double.valueOf(rotaryMap.get("TOTALAMOUNT") + "") : 0.0;
							break;
						}
					}
				} else {
					rotaryPower = 0.0;
				}
				allDirectPowerSite += electricDirectPowertList.size();
				allRotaryPowerSite += electricRotaryPowertList.size();
				map = new HashMap<String, Double>();
				directPower = Double.valueOf(df.format(directPower / 10000));
				rotaryPower = Double.valueOf(df.format(rotaryPower / 10000));
				map.put("directPower", directPower);
				map.put("rotaryPower", rotaryPower);
				if((electricRotaryPowertList.size() + electricDirectPowertList.size()) > 0) {
					rotaryScale = (electricRotaryPowertList.size() * 1.0)
							/ (electricRotaryPowertList.size() + electricDirectPowertList.size());
				}else {
					rotaryScale = 0.0;
				}
				rotaryScale = Double.valueOf(df.format(rotaryScale * 100));
				map.put("rotaryRate", rotaryScale);
				electricPowerDTO.setCityData(map);
				electricPowerDTOList.add(electricPowerDTO);
			}
		}
		if (null != electricRotaryPowertList && electricRotaryPowertList.size() > 0) {
			A: for (Map<String, Object> rotaryMap : electricRotaryPowertList) {
				electricPowerDTO = new ElectricPowerDTO();
				rotaryRegionName = rotaryMap.get("REGIONNAME") + "";
				if (rotaryRegionName.equals("")) {
					continue;
				}
				allRotaryPowerSite += electricRotaryPowertList.size();
				electricPowerDTO.setCityName(rotaryRegionName);
				// 判断是否已经包含在electricPowerDTOList
				if (electricPowerDTOList.size() > 0) {
					for (ElectricPowerDTO electricPowerDto : electricPowerDTOList) {
						directRegionName = electricPowerDto.getCityName();
						if (null != directRegionName && directRegionName.equals(rotaryRegionName)) {
							continue A;
						}
					}
				}
				rotaryPower = null != rotaryMap.get("TOTALAMOUNT") ? Double.valueOf(rotaryMap.get("TOTALAMOUNT") + "")
						: 0.0;
				electricPowerDTO.setCityId(rotaryMap.get("REGIONID") + "");
				rotaryPower = null != rotaryMap.get("TOTALAMOUNT") ? Double.valueOf(rotaryMap.get("TOTALAMOUNT") + "")
						: 0.0;
				map = new HashMap<String, Double>();
				rotaryPower = Double.valueOf(df.format(rotaryPower / 10000));
				map.put("directPower", rotaryPower);
				map.put("rotaryPower", 0.0);
				map.put("rotaryRate", 100.0);
				electricPowerDTO.setCityData(map);
				electricPowerDTOList.add(electricPowerDTO);
			}
		}
		// 平均转供电比例
		if (electricPowerDTOList.size() > 0) {
			averageRotaryScale =( allRotaryPowerSite * 1.0) / (allRotaryPowerSite + allDirectPowerSite);
			averageRotaryScale = Double.valueOf(df.format(averageRotaryScale * 100));
			for (ElectricPowerDTO electricPowerDto : electricPowerDTOList) {
				electricPowerDto.setAverage01(averageRotaryScale);
			}
		}
		
		// 按增幅排序
		Collections.sort(electricPowerDTOList, new Comparator<ElectricPowerDTO>() {

			@Override
			public int compare(ElectricPowerDTO o1, ElectricPowerDTO o2) {
				Map<String, Double> map1 = o1.getCityData();
				Map<String, Double> map2 = o2.getCityData();
				String addScaleKey = null;
				for (String key : map1.keySet()) {
					if (key.indexOf("rotaryRate") > 0) {
						addScaleKey = key;
						break;
					}
				}
				if (null != addScaleKey) {
					return -map1.get(addScaleKey).compareTo(map2.get(addScaleKey));
				} else {
					return 0;
				}
			}
		});
		return electricPowerDTOList;

		// return FieldConstant.parseStationDetailEPStasticList(cityId);
	}
}
