package com.audit.modules.testdemo.service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysDataVo;

public interface TestDemoService {

	public void queryDataByPage(PageUtil<SysDataVo> page);
}
