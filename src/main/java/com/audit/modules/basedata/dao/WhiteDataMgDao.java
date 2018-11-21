package com.audit.modules.basedata.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.basedata.entity.WhiteCpersonFile;
import com.audit.modules.basedata.entity.WhiteMidFile;
import com.audit.modules.basedata.entity.WhiteSubmit;
import com.audit.modules.basedata.entity.whiteSubmitMg;
import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysFile;
import com.audit.modules.system.entity.WhiteMg;

/**
 * @Description : TODO(供应商信息管理)
 *
 * @author :
 * @date : 2017年4月20日
 *
 *       Copyright (c) 2017, IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface WhiteDataMgDao {
	
	public List<WhiteSubmit> getWhiteSubmitByPage();
	public int getWhiteSubmitTotal(PageUtil<WhiteSubmit> page);
}
