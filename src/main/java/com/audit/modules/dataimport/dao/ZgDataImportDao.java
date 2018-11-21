package com.audit.modules.dataimport.dao;


import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;

import java.util.Map;

/**
 * @author : liuyan
 * @Description : 资管数据导入Dao
 * @date : 2017/4/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface ZgDataImportDao {
    
    /**
     * 检查表是否存在
     * @param tableName
     * @return
     */
    int checkTable(@Param("tableName")String tableName);
    
    /**
     * 清空表数据
     * @param map
     * @return
     */
    String deleteTable(Map<String, Object> map);
    
    /**
     * 插入数据
     * @param map
     * @return
     */
    String dataImport(Map<String, Object> map);
    
    /**
     * 更新数据
     * @return
     */
    String dataUpdateAfterImport(Map<String, Object> map);
}
