package com.audit.modules.towerbasedata.trans.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSiteTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.TransEleFile;
import com.audit.modules.basedata.entity.TransMidFile;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.tower.entity.TowerSiteVO;
import com.audit.modules.towerbasedata.trans.entity.TowerNeedTrans;
import com.audit.modules.towerbasedata.trans.entity.TowerTransEleFile;
import com.audit.modules.towerbasedata.trans.entity.TowerTransMidFile;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;
import com.audit.modules.towerbasedata.trans.entity.TowerTransVO;

public interface TowerTransDao {
	
	List<TowerTransVO> findNeedTransList(PageUtil<TowerTransVO> pageUtil);
	
	 /**   
	 * @Description: 根据机房id查询是否有数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	 TowerNeedTrans checkNeedSubmitDataStatus(String onlyId);
	 
	 /**   
	 * @Description: 新增需要改造的机房站点数据到SYS_ZGROOM_TOWER_TRANS_MID
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	 void insertNeedTransData(TowerNeedTrans towerNeedTrans);
	 
	 /**   
	 * @Description: 修改需要改造的机房站点数据到SYS_ZGROOM_TRANS_MID，因为可能之前被撤销了
	 * @param :       
	 * @return :     
	 * @throws  
	*/	 
	 void updateNeedTransData(TowerNeedTrans towerNeedTrans);
	 
	 /**   
	 * @Description: 经办人获取可以提交的转供电数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<TowerNeedTrans> getNeedSubmitData(PageUtil<TowerNeedTrans> pageUtil);
	
	/**
     * @return    
	 * @Description: 转供电根据onlyid查询文件数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<TowerTransEleFile> queryFileByOnlyId(String onlyId);
	
	 /**
     * @return    
	 * @Description: 转供电根据onlyid查看 SYS_ZGROOM_TRANS_MID 数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	TowerNeedTrans findDataByOnlyId(String onlyId);
	
	/**
	 * 根据流程id  删除 SYS_TOWER_TRANSELEPOWER_SUBMIT中数据
	 * @param accountSiteTransSubmit
	 */
	void deleteByIDs(List<String> ids);
	
	/**
     * @return    
	 * @Description: 转供电根据onlyid修改 SYS_ZGROOM_TRANS_MID 中resultstatus状态,result有null的状态
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateResultStatusByOnlyId2(TowerNeedTrans towerNeedTrans);
	
	/**
	 * 根据流程id  删除 SYS_TOWER_TRANSELEPOWER_SUBMIT中数据
	 * @param accountSiteTransSubmit
	 */
	void deleteByOnlyIds(List<String> ids);
	
	 /**   
	 * @Description: 更改SYS_TOWER_ACCOUNT_SITE中站点供电状态ELECTRICITY_TYPE为1
	 * @param :       
	 * @return :     
	 * @throws  
	*/	
	 void updateSiteAccountSuccessStatus(TowerSiteVO towerSiteVO);
	 
	 /**
     * @return    
	 * @Description: 转供电添加操作申请  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	int transInsertSelective(TowerTransSubmitVO towerTransSubmitVO);
	
	/**
	 * 
	 * @Description: 通过业务id查询操作申请（所有数据）    
	 * @param :       
	 * @return :     
	 * @throws
	 */
	TowerTransSubmitVO selectByPrimaryKey(String id);
	
	 /**   
	 * @Description: 根据业务id修改流程id
	 * @param :       
	 * @return :     
	 * @throws  
	*/	
	 void updateInstanceIdByApplyId(TowerTransSubmitVO towerTransSubmitVO);
	 
	 /**
     * @return    
	 * @Description: 转供电根据onlyid修改 SYS_ZGROOM_TRANS_MID 中resultstatus状态
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateResultStatusByOnlyId(TowerNeedTrans tNeedTrans);
	
	/**
	 *上传文件至附件 
	 * @param transEleFile
	 */
	 void uploadFileTrans(TowerTransEleFile towerTransEleFile);
	 
	 /**
	 *查找数据 图片地址
	 * @param transEleFile
	 */
	 
	 TowerTransEleFile findByIDTrans(String fileID);
	 
	 /**   
	 * @Description: 根据onlyId删除转供电附件中间表数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	 void deleteMidFileByOnlyId(String onlyId);
	 
	 /**   
	 * @Description: 修改需要改造的机房站点数据到SYS_ZGROOM_TRANS_MID，因为可能之前被撤销了
	 * @param :       
	 * @return :     
	 * @throws  
	*/	
	 void saveMiddelFile(List<TowerTransMidFile> towerTransMidFiles);
	 
	 
	 /**
	 * 
	 * @Description: 通过流程id查询zgroom表中数据    
	 * @param :       
	 * @return :     
	 * @throws
	 */
	TowerNeedTrans findDataByInstancdId(String instanceId);
	
	
	/**   
	 * @Description: 根据申请id查询是否为转供电数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	 TowerTransSubmitVO selectIsTransData(String applyId);
	 
	 /**   
	 * @Description: 根据申请id修改失败状态
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	 void updateFailStatusByApplyIds(@Param("array")String[] idArray);
	 
	 
	 /**   
	 * @Description: 根据流程id修改审批失败状态SYS_TOWER_ZGROOM_TRANS_MID
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	 void updateNeedTransDataByInstanceId(TowerNeedTrans tNeedTrans);
	 
	 /**
	 * 改变SYS_TOWER_TRANSELEPOWER_SUBMIT中审批状态
	 */
	void updateTransDataTableStatus(TowerTransSubmitVO towerTransSubmitVO);

}
