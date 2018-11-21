package com.audit.modules.basedata.service;

import java.util.List;
import java.util.Map;

import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.basedata.entity.WhiteCpersonFile;
import com.audit.modules.basedata.entity.WhiteMidFile;
import com.audit.modules.basedata.entity.WhiteSubmit;
import com.audit.modules.basedata.entity.whiteSubmitMg;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysFile;
import com.audit.modules.system.entity.WhiteMg;

public interface WhiteDataMgService {
	
	public List<WhiteSubmit> getWhiteSubmitByPage();
	public int getWhiteSubmitTotal(PageUtil<WhiteSubmit> page);
	
}
