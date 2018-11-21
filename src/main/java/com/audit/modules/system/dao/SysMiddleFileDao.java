package com.audit.modules.system.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.system.entity.SysMidlleFile;

/**
 * @author : jiadu
 * @Description : 附件中间表
 * @date : 2017/3/12
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface SysMiddleFileDao {
    void saveMiddelFile(List<SysMidlleFile> sysMidlleFiles);
    void deleteMiddleFiles(@Param("id") String id);
    List<String> findFilesID(@Param("id") String id);
}
