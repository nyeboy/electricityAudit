package com.audit.modules.electricity.entity;

/**
 * 获取报账点是否锁定及对应机房的在线数量 
 * 
 */
public class RoomIsOnlineVO{
	
	
	//未锁定的机房数量
	private int noLockingNum =0;
	//在网的机房数量
	private int onlineRoomNum = 0;
	//退网的机房数量
	private int noOnLineRoomNum = 0;
	public int getNoLockingNum() {
		return noLockingNum;
	}
	public void setNoLockingNum(int noLockingNum) {
		this.noLockingNum = noLockingNum;
	}
	public int getOnlineRoomNum() {
		return onlineRoomNum;
	}
	public void setOnlineRoomNum(int onlineRoomNum) {
		this.onlineRoomNum = onlineRoomNum;
	}
	public int getNoOnLineRoomNum() {
		return noOnLineRoomNum;
	}
	public void setNoOnLineRoomNum(int noOnLineRoomNum) {
		this.noOnLineRoomNum = noOnLineRoomNum;
	}
	
}