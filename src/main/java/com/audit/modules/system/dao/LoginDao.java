package com.audit.modules.system.dao;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.system.entity.UserVo;

/**
 * @author : chentao
 * @Description : 用户登录
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface LoginDao {
	
	UserVo findUserByName(String account);
	
	UserVo getUserByUserId(String userId);

}
