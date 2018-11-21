package com.audit.modules.basedata.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.basedata.entity.AccountSiteManage;
import com.audit.modules.basedata.entity.Peat;
import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.basedata.entity.SupplierManage;
import com.audit.modules.basedata.entity.WhiteCityNum;
import com.audit.modules.basedata.entity.WhiteCountyNum;
import com.audit.modules.basedata.entity.WhiteCpersonFile;
import com.audit.modules.basedata.entity.WhiteFlow;
import com.audit.modules.basedata.entity.WhiteMidFile;
import com.audit.modules.basedata.entity.WhiteSubmit;
import com.audit.modules.basedata.entity.WrongInfo;
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
public interface WhiteMgDao {
	//新增白名单
	public int addWhite(WhiteMg whiteMg);
	
	public List<WhiteMg> findByPage(PageUtil<WhiteMg> page);
	
	public List<WhiteMg> findWhitMg();
	
	public WhiteSubmit findSzydByCityName(String cityName);
	
	public List<SysFile> findFJBySzydNo(String szydNo);
	
	public List<WhiteSubmit> findWhiteMgSubmitByPage(PageUtil<WhiteSubmit> page);
	
	public WhiteMg findWhiteMgById(String id);
	
	public WhiteSubmit findWhiteMgById1(String id);
	public int delWhiteMgById(String id);
	
	public int delWhiteMgById1(String id);
	
	public int addWhiteSubmit(WhiteMg whiteMg);
	
	public void deleteWhite();
	
	public int getTotal(Map<String, Object> paramMap);
	public int getTotals(PageUtil<whiteSubmitMg> page);
	
	public List<String> getRoleList(String userId);
	
	/*public WhiteSubmit getWhiteSubmitById(String id);*/
	public whiteSubmitMg getWhiteSubmitById(String id);
	
	public int delWhiteSubmitMg(String id);
	
	public int upWhiteSubmitStatusById(Map<String, Object> map);
	
	public List<whiteSubmitMg> getSubmitMgByPage(PageUtil<whiteSubmitMg> page);
	
	public List<WhiteSubmit> getWhiteSubmitByLeftJoinId(String mgId);
	
	
	  //<!-- 插入syssubmitMg表中 -->
	public int addSubmitMg(whiteSubmitMg wsm);
	    
	    //<!-- 插入submit_mid_mg -->
	 public int  addSubmitMidMg(Map<String, Object> map);
	 
	 
	 
	   // <!-- 根据mgId查whiteSubmit -->
	    public List<String> getSubmitIdByMgId(String mgId);
	    //<!-- 删除whiteSubmit -->
	    public int delWhiteSubmitBySubmitId(List<String> list);
	    
	    //<!-- 删除中间表submit-mid_mg -->
	    public int delSubmitMidMgByMgId(String mgId);
	    
	    public void addCpersonFile(Map<String, Object> map);
	    
	    public List<WhiteCpersonFile> getFileId(String cperson);
	    
	    public int addWhiteMidFile(Map<String, Object> map);
    
    public List<WhiteMidFile> getWhiteMidFile(String szydNo);
    
    public int addWhiteFlow(Map<String, Object> map);
    
    public List<WhiteSubmit> getSubmitByMgId(String mgId);
    public void updateSubmitStatus(WhiteSubmit ws);
    
    public List<WhiteSubmit> getDataSubmitByPage(Map<String, Object> paramMap);
    
    public List<WhiteFlow> getWhiteFlow(String id);
    
    public List<SysFile> getSzydFj(String szydNo);
    
    public String getSiteIdBySiteName(String siteName);
    
    public WhiteSubmit getWhiteByAsiteId(String asiteId);
    
    public int checkCityName(String cityName);
    
    public int checkZhlabel(String zhLabel);
    
    public int checkZiguan(String ziguanName);
    
   public int checkSupplyName(String name);
   public int checkSupplySiteId(String siteId);
	public int checkSupplyOrgId(String orgId);
	
	public List<WhiteCityNum> getCityWhiteNum();
	
	public List<WhiteCountyNum> getCountyWhiteNumByCityId(String cityId);
	
	public List<WhiteCityNum> getCountCitySiteNum();
	
	
	public int getCityWhiteCountZNum();

public int getCityCountZNum();

public int getCountyWhiteCountZNum(String cityId);
public int getCountyZNum(String cityId);
	 public String getZbiByCityId(String cityId);
	 
	 public String getCityNameByCityId(String cityId);
	 
	 public void upIsDo(String cityName);
	 public void upIsNDo(String cityName);
	 
	 public void upWhiteBili(Map<String, Object> map);
	 public List<WhiteSubmit> getSubmitAll();
	 
	 public void deCpersonMidFileByfjid(String fileId);
	 
	 public void delCpMid();
	 
	 public int getSzydCount(String id);
	 public void delSMFByMgId(String id);
	 
	 public void delwhite();
	 
	 public WhiteSubmit getSzydInofBySzydNo(String szydno);
	 
	 public int delfj(Map<String, Object> map);
	 
	 public void addsyswhitemidfile(Map<String, Object> map);
	 public String getszydbegintimebymgid(String id);
	 public void updatesyswhitesubmitmgstatus(String id);
	 
	 public void upsys3(String id);
	 
	 public void upmg3(String id);
	 
	 public void addwrong(Map<String, Object> map);

	public int getwrong();

	public void delwrong(String userid);
	
	public int checkziguanname(String ziguanName);
	public int checkziguanname2(String ziguanName);
	public List<WrongInfo> getwronginfo(String userid);
	
	public int getrnum();
	public void ruku(String id);
	public void cuku(String id);
	
	public String getsupplyid(WhiteMg whiteMg);
	
	//保存合同信息
	public void addContract(Map<String, Object> mmap);
	public List<String> geteletop();
	
	public List<String> getele();
	public List<Peat> geteleMoney();
	 
	public void delContractByContractId(String contractId);
	
	public String getcity(String cn);
	
	public int checkziguanname1(String siteName);
}
