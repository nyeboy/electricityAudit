package com.audit.modules.testdemo.service.impl;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.testdemo.dao.TestDemoDao;
import com.audit.modules.testdemo.service.TestDemoService;

@Service
public class TestDemoServiceImpl implements TestDemoService {

	@Resource
	private TestDemoDao testDemoDao;
	
	@Override
	public void queryDataByPage(PageUtil<SysDataVo> page) {
		Map<String,Object> para = new HashMap<>();
//		para.put("intId", 28);
		page.setObj(para);
		testDemoDao.queryDataByPage(page);
		System.out.println(page);
	}


}
