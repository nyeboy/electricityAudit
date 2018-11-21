package com.audit.modules.towerbasedata.datashow.entity;

import java.util.List;

import com.audit.modules.electricity.entity.DeviceVO;
import com.audit.modules.tower.entity.TowerSiteVO;
import com.audit.modules.towerbasedata.contract.entity.TowerContractVO;

/**   
 * @Description : TODO(基础信息详情VO)    
 *
 * @author : 
 * @date : 2017年5月3日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class TowerDataDetail {
	
	//供电信息、其他信息
	private TowerDataShow towerDataShow;
	//机房设备信息
	private List<DeviceVO> deviceVO;
	//合同信息
	private List<TowerContractVO> towerContractVO;
	
	private TowerSiteVO towerSiteInfo;
	
	
	public TowerSiteVO getTowerSiteInfo() {
		return towerSiteInfo;
	}
	public void setTowerSiteInfo(TowerSiteVO towerSiteInfo) {
		this.towerSiteInfo = towerSiteInfo;
	}
	public TowerDataDetail() {
		super();
	}
	public TowerDataShow getTowerDataShow() {
		return towerDataShow;
	}
	public void setTowerDataShow(TowerDataShow towerDataShow) {
		this.towerDataShow = towerDataShow;
	}
	public List<DeviceVO> getDeviceVO() {
		return deviceVO;
	}
	public void setDeviceVO(List<DeviceVO> deviceVO) {
		this.deviceVO = deviceVO;
	}
	public List<TowerContractVO> getTowerContractVO() {
		return towerContractVO;
	}
	public void setTowerContractVO(List<TowerContractVO> towerContractVO) {
		this.towerContractVO = towerContractVO;
	}
	
}
