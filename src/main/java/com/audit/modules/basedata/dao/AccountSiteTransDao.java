package com.audit.modules.basedata.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSiteTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.DataModifyApply;
import com.audit.modules.basedata.entity.TransEleFile;
import com.audit.modules.basedata.entity.TransMidFile;
import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.system.entity.SysFile;
import com.audit.modules.system.entity.SysFileVO;
import com.audit.modules.system.entity.SysMidlleFile;

/**
 * 
 * @Description: 转供电信息管理Dao层接口
 * @throws  
 * 
 * @author  noone
 * @date 2017年1月8日 
 */
@Component
@MybatisRepostiory
public interface AccountSiteTransDao {
	/**   
	 * @Description: 查询提交审批流程的转供电数据  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<AccountSiteTrans> findAccountSiteByTransPage(PageUtil<AccountSiteTransSubmit> pageUtil);
	
	
	
	List<AccountSiteTrans> findNeedTransList(PageUtil<AccountSiteTrans> pageUtil);
	
	/**   
	 * @Description: 经办人获取可以提交的转供电数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<AccountSiteNeedTrans> getNeedSubmitData(PageUtil<AccountSiteNeedTrans> pageUtil);
	
	/**
	 * 
	 * @Description: 通过业务id查询操作申请（所有数据）    
	 * @param :       
	 * @return :     
	 * @throws
	 */
	AccountSiteTransSubmit selectByPrimaryKey(String id);
	/**
	 * 
	 * @Description: 通过流程id查询zgroom表中数据    
	 * @param :       
	 * @return :     
	 * @throws
	 */
	AccountSiteNeedTrans findDataByInstancdId(String instanceId);
	/**
	 * 
	 * @Description: 通过id查询操作申请    
	 * @param :       
	 * @return :     
	 * @throws
	 */	
//	List<AccountSiteTransSubmit> selectTrusteesById(String id);
	
	/**   
	 * @Description: 通过站点Id修改转供电信息  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateTransEleStatus(String siteId);
	/**
	 * 保存转供电数据到表 SYS_TRANSELEPOWER_SUBMIT
	 * @param accountSiteTransSubmit
	 */
	void insertTransData(AccountSiteTransSubmit accountSiteTransSubmit);
	/**
	 * 根据流程id  删除 SYS_TRANSELEPOWER_SUBMIT中数据
	 * @param accountSiteTransSubmit
	 */
	void deleteByIDs(List<String> ids);
	/**
	 * 根据流程id  删除 SYS_TRANSELEPOWER_SUBMIT中数据
	 * @param accountSiteTransSubmit
	 */
	void deleteByOnlyIds(List<String> ids);
	/**
	 * 根据流程id  查询SYS_TRANSELEPOWER_SUBMIT中数据的状态
	 * @param accountSiteTransSubmit
	 */
	AccountSiteTransSubmit checkTransDataStatus(String id);
	
	/**
	 * 改变SYS_TRANSELEPOWER_SUBMIT中审批状态
	 */
	void updateTransDataTableStatus(AccountSiteTransSubmit accountSiteTransSubmit);
	
	
	/**
	 *上传文件至附件 
	 * @param transEleFile
	 */
	 void uploadFileTrans(TransEleFile transEleFile);
	 /**
	 *查找数据 图片地址
	 * @param transEleFile
	 */
	 
	 TransEleFile findByIDTrans(String fileID);
	 
	 /**   
	 * @Description: 根据申请id删除转供电数据	暂时没用到
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	 void deleteByApplyIds(@Param("array")String[] idArray);
	 
	 /**   
	 * @Description: 根据onlyId删除转供电附件中间表数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	 void deleteMidFileByOnlyId(String onlyId);
	 
	 /**   
	 * @Description: 根据申请id修改失败状态
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	 void updateFailStatusByApplyIds(@Param("array")String[] idArray);
	 
	 
	 /**   
	 * @Description: 根据流程id修改审批失败状态SYS_ZGROOM_TRANS_MID
	 * @param :       
	 * @return :     
	 * @throws  
	 */
	 void updateNeedTransDataByInstanceId(AccountSiteNeedTrans needTrans);
	 
	 
	 /**   
	 * @Description: 根据申请id查询是否为转供电数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	 AccountSiteTransSubmit selectIsTransData(String applyId);
	 /**   
	 * @Description: 根据机房id查询是否有数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	 AccountSiteNeedTrans checkNeedSubmitDataStatus(String onlyId);
	 /**   
	 * @Description: 新增需要改造的机房站点数据到SYS_ZGROOM_TRANS_MID
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	 void insertNeedTransData(AccountSiteNeedTrans accountSiteNeedTrans);
	 /**   
	 * @Description: 修改需要改造的机房站点数据到SYS_ZGROOM_TRANS_MID，因为可能之前被撤销了
	 * @param :       
	 * @return :     
	 * @throws  
	*/	 
	 void updateNeedTransData(AccountSiteNeedTrans accountSiteNeedTrans);
	 /**   
	 * @Description: 修改需要改造的机房站点数据到SYS_ZGROOM_TRANS_MID，因为可能之前被撤销了
	 * @param :       
	 * @return :     
	 * @throws  
	*/	
	 void saveMiddelFile(List<TransMidFile> transMidFiles);
	 /**   
	 * @Description: 更改SYS_ACCOUNT_SITE中站点供电状态ELECTRICITY_TYPE为1
	 * @param :       
	 * @return :     
	 * @throws  
	*/	
	 void updateSiteAccountSuccessStatus(SiteInfoVO siteInfoVO);
	 /**   
	 * @Description: 根据业务id修改流程id
	 * @param :       
	 * @return :     
	 * @throws  
	*/	
	 void updateInstanceIdByApplyId(AccountSiteTransSubmit accountSiteTransSubmit);
	 /**
     * @return    
	 * @Description: 转供电添加操作申请  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	int transInsertSelective(AccountSiteTransSubmit accountSiteTransSubmit);
	
	 /**
     * @return    
	 * @Description: 转供电根据onlyid修改 SYS_ZGROOM_TRANS_MID 中resultstatus状态
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateResultStatusByOnlyId(AccountSiteNeedTrans accountSiteNeedTrans);
	/**
     * @return    
	 * @Description: 转供电根据onlyid修改 SYS_ZGROOM_TRANS_MID 中resultstatus状态,result有null的状态
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateResultStatusByOnlyId2(AccountSiteNeedTrans accountSiteNeedTrans);
	
	 /**
     * @return    
	 * @Description: 转供电根据onlyid查看 SYS_ZGROOM_TRANS_MID 数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	AccountSiteNeedTrans findDataByOnlyId(String onlyId);
	
	/**
     * @return    
	 * @Description: 转供电根据onlyid查询文件数据
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<TransEleFile> queryFileByOnlyId(String onlyId);
	
	
	 
}
