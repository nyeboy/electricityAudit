package com.audit.modules.electricity.entity;

/**
 * 流程更新实体
 * 
 * @author luoyun
 */
public class AuditElectrictySaveVO extends ElectrictySaveVO {

	private static final long serialVersionUID = -1920105460241353177L;

	private String instanceId;

	public String getInstanceId() {
		return instanceId;
	}

	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}
}
