package com.audit.modules.system.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.system.entity.SysFile;

/**
 * @author : JIADU
 * @Description : 附件上传下载
 * @date : 2017/3/9
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface FileDao {
    void uploadFile(SysFile sysFile);
    SysFile findByID(String fileID);
    void deleteFiles(List<String> ids);
    List<SysFile> findByIDs(List<String> ids);
}
