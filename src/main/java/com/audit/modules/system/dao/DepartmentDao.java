package com.audit.modules.system.dao;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.system.entity.DepartmentEntity;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author 王松
 * @description
 * @date 2017/5/26
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface DepartmentDao {
    /**
     * 根据ID查询
     * @param id id
     * @return
     */
    DepartmentEntity findById(Integer id);

    /**
     * 根据层级获取
     * @param level 层级
     * @return
     */
    List<DepartmentEntity> findByLevel(@Param("level")String level);

    /**
     * 根据公司代码和层级查询
     * @param companyCode 公司代码
     * @param level 层级
     * @return
     */
    List<DepartmentEntity> findByCompanyCodeAndLevel(@Param("companyCode") String companyCode, @Param("level") int level);
    
    /**
     * 根据公司deptId查询子部门
     * @param companyCode 公司代码
     * @param level 层级
     * @return
     */
    List<DepartmentEntity> findChildren(@Param("deptId") String deptId);

}
