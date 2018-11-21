package com.audit.modules.system.dao;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.system.entity.SysNoticReaded;

/**
 * 
 * @Description: 记录已读公告   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年5月20日 上午11:18:22
 */
@Component
@MybatisRepostiory
public interface SysNoticReadedDao {
	
    int deleteByPrimaryKey(String id);

    int insert(SysNoticReaded record);

    int insertSelective(SysNoticReaded record);

    SysNoticReaded selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(SysNoticReaded record);

    int updateByPrimaryKey(SysNoticReaded record);
}