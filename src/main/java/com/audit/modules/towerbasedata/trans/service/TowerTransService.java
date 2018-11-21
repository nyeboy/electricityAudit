package com.audit.modules.towerbasedata.trans.service;

import java.util.Map;

import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSiteTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.DataModifyApply;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.towerbasedata.trans.entity.TowerNeedTrans;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;
import com.audit.modules.towerbasedata.trans.entity.TowerTransVO;

public interface TowerTransService {
	
	
	/**   
	 * @Description: 查询需改造的转供电数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void findNeedTransList(TowerTransVO towerTransVO,PageUtil<TowerTransVO> pageUtil);
	
	
	//验证审批通过的和已经提交的数据，防止重复提交
	String checkIsSubmitData(TowerTransVO towerTransVO);
	
	//保存新增的数据到SYS_ZGROOM_TRANS_MID中
	void saveNeedChangeSite(TowerTransVO towerTransVO);
	
	//经办人获取可以提交的转供电数据
	void getNeedSubmitData(TowerNeedTrans towerNeedTrans,PageUtil<TowerNeedTrans> pageUtil);
	
	//转供电-撤销----------把提交过来的单子返回到新增人员手中
	boolean cancelTransSite(TowerNeedTrans towerNeedTrans);
	
	//批量删除提交单
	ResultVO deleteByIDs(String[] ids);
	
	//保存更改供电状态
	void saveSuccessStatus(TowerNeedTrans needTrans);
	
	//根据onlyId 修改SYS_ZGROOM_TOWER_TRANS_MID中提交状态
	void updateResultStatusByOnlyId(TowerNeedTrans tNeedTrans);
	
	//修改时保存转供电数据
	ResultVO saveTransInfo(TowerNeedTrans tneedTrans,UserVo userVo);

}
