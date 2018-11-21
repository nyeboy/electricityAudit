package com.audit.modules.electricity.entity;

/**
 * 流程更新实例
 * 
 * @author luoyun
 */
public class AuditTowerSaveEntities extends TowerSaveEntities {

	// 流程ID
	private String instanceId;

	public String getInstanceId() {
		return instanceId;
	}

	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}
}
