package com.audit.modules.electricity.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;

@Component
@MybatisRepostiory
public interface RoomLockingDao{
	
	//锁定机房
	public void lockingRoom(Map<String,Object> param);
	
	//解锁机房
	public void unLockingRoom(String roomId);
	
	//根据稽核单查询是否有锁定机房的行为，并返回机房的id
	public List<String> unLockingRoomByElectrictyId(String electrictyId);
}