package com.audit.modules.basedata.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.WhiteDataMgDao;
import com.audit.modules.basedata.dao.WhiteMgDao;
import com.audit.modules.basedata.entity.WhiteCpersonFile;
import com.audit.modules.basedata.entity.WhiteMidFile;
import com.audit.modules.basedata.entity.WhiteSubmit;
import com.audit.modules.basedata.entity.whiteSubmitMg;
import com.audit.modules.basedata.service.WhiteDataMgService;
import com.audit.modules.basedata.service.WhiteMgService;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysFile;
import com.audit.modules.system.entity.WhiteMg;

@Service
public class WhiteDataMgServiceImpl implements WhiteDataMgService {

	private WhiteDataMgDao whiteDataMgDao;
	@Override
	public List<WhiteSubmit> getWhiteSubmitByPage() {
		List<WhiteSubmit> whiteSubmitByPage = whiteDataMgDao.getWhiteSubmitByPage();
		return whiteSubmitByPage;
	}
	@Override
	public int getWhiteSubmitTotal(PageUtil<WhiteSubmit> page) {
		int i = whiteDataMgDao.getWhiteSubmitTotal(page);
		return i;
	}


}
