package com.audit.modules.site.dao;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.site.entity.EquRoomDevice;
import com.audit.modules.site.entity.ResourcePointInfo;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author jiadu
 * @Description
 * @date 2017/4/14
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface ResourcePointDao {
    List<ResourcePointInfo> findAllByCityID(String cityID);
}
