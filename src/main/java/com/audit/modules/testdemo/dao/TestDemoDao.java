package com.audit.modules.testdemo.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysDataVo;

@Component
@MybatisRepostiory
public interface TestDemoDao {
	List<SysDataVo> queryDataByPage(PageUtil<SysDataVo> page);
}
