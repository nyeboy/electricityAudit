package com.audit.modules.system.dao;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description : 获取区县信息
 * @date : 2017/4/12
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface ZgSpaceDao {
    List<Map<String,Object>> findAllCity();
}
