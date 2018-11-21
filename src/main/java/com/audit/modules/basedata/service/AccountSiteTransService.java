package com.audit.modules.basedata.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSiteTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.DataModifyApply;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.UserVo;

/**
 * 
 * @Description: 转供电信息管理接口   
 * @throws  
 * 
 * @author  noone
 * @date 2017年1月8日 
 */
public interface AccountSiteTransService {
	/**   
	 * @Description: 查询需改造的转供电数据，就是提交审批的数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
//	void findAccountSiteByTransPage(AccountSiteTransSubmit accountSiteTransSubmit,PageUtil<AccountSiteTransSubmit> pageUtil);

	void findNeedTransList(AccountSiteTrans accountSiteTrans,PageUtil<AccountSiteTrans> pageUtil);
	//经办人获取可以提交的转供电数据
	void getNeedSubmitData(AccountSiteNeedTrans accountSiteNeedTrans,PageUtil<AccountSiteNeedTrans> pageUtil);
	
	//根据站点id保存转供电信息，新增
	void saveTransEleAdd(String siteId);
	
	//保存新增的数据到SYS_ZGROOM_TRANS_MID中
	void saveNeedChangeSite(AccountSiteTrans accountSiteTrans);
	
	//转供电-撤销----------把提交过来的单子返回到新增人员手中
	boolean cancelTransSite(AccountSiteNeedTrans needTrans);
	
	//验证审批通过的和已经提交的数据，防止重复提交
	String checkIsSubmitData(AccountSiteTrans accountSiteTrans);
	
	//根据onlyId 修改SYS_ZGROOM_TRANS_MID中提交状态
	void updateResultStatusByOnlyId(AccountSiteNeedTrans accountSiteNeedTrans);
	
	/*//把信息保存在新建的转供电表中
	void saveTransData(DataModifyApply dataModifyApply,Map<String, String> paramap);*/
	
	ResultVO deleteByIDs(String[] ids);
	
	void saveSuccessStatus(AccountSiteNeedTrans needTrans);
	
	//修改时保存转供电数据
	ResultVO saveTransInfo(AccountSiteNeedTrans needTrans,UserVo userVo);
}
