package com.audit.modules.system.service;

import com.audit.modules.system.entity.UserVo;

public interface LoginService {
	
	UserVo findUserByName(String userName);

//	Map<String,Object> checkUserByUserId(String userId);
	
	String getIp();
}
