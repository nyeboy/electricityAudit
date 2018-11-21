package com.audit.modules.basedata.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.basedata.dao.WhiteMgDao;
import com.audit.modules.basedata.entity.AccountSiteManage;
import com.audit.modules.basedata.entity.Peat;
import com.audit.modules.basedata.entity.WhiteCityNum;
import com.audit.modules.basedata.entity.WhiteCountyNum;
import com.audit.modules.basedata.entity.WhiteCpersonFile;
import com.audit.modules.basedata.entity.WhiteFlow;
import com.audit.modules.basedata.entity.WhiteMidFile;
import com.audit.modules.basedata.entity.WhiteSubmit;
import com.audit.modules.basedata.entity.WrongInfo;
import com.audit.modules.basedata.entity.whiteSubmitMg;
import com.audit.modules.basedata.service.WhiteMgService;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysFile;
import com.audit.modules.system.entity.WhiteMg;

@Service
public class WhiteMgServiceImpl implements WhiteMgService {

	@Autowired
	private WhiteMgDao whiteMgDao;
	@Override
	public List<WhiteMg> findWhiteUploadByPage(PageUtil<WhiteMg> page) {
		List<WhiteMg> findByPage = whiteMgDao.findByPage(page);
		return findByPage;
	}
	
	@Override
	public WhiteSubmit findSzydByCityName(String cityName) {
		WhiteSubmit findSzydByCityName = whiteMgDao.findSzydByCityName(cityName);
		return findSzydByCityName;
	}

	@Override
	public List<SysFile> findFJBySzydNo(String szydNo) {
		List<SysFile> findFJBySzydNo = whiteMgDao.findFJBySzydNo(szydNo);
		return findFJBySzydNo;
	}

	@Override
	public List<WhiteSubmit> findWhiteMgSubmitByPage(PageUtil<WhiteSubmit> page) {
		List<WhiteSubmit> findWhiteMgSubmitByPage = whiteMgDao.findWhiteMgSubmitByPage(page);
		return findWhiteMgSubmitByPage;
	}

	@Override
	public WhiteMg findWhiteMgById(String id) {
		WhiteMg findWhiteMgById = whiteMgDao.findWhiteMgById(id);
		return findWhiteMgById;
	}

	@Override
	public int delWhiteMgById(String id) {
		int i = whiteMgDao.delWhiteMgById(id);
		return i;
	}

	@Override
	public List<WhiteMg> findWhitMg() {
		List<WhiteMg> findWhitMg = whiteMgDao.findWhitMg();
		return findWhitMg;
	}

	@Override
	public int addWhiteSubmit(WhiteMg whiteMg) {
		int i = whiteMgDao.addWhiteSubmit(whiteMg);
		return i;
	}

	@Override
	public void deleteWhite() {
		whiteMgDao.deleteWhite();
		
	}

	@Override
	public int getTotal(Map<String, Object> paramMap) {
		int total = whiteMgDao.getTotal(paramMap);
		return total;
	}

	@Override
	public List<String> getRoleList(String userId) {
		List<String> roleList = whiteMgDao.getRoleList(userId);
		return roleList;
	}

	/*@Override
	public WhiteSubmit getWhiteSubmitById(String id) {
		WhiteSubmit whiteSubmitById = whiteMgDao.getWhiteSubmitById(id);
		return whiteSubmitById;
	}*/

	@Override
	public int delWhiteSubmitMg(String id) {
		int delWhiteSubmit = whiteMgDao.delWhiteSubmitMg(id);
		return delWhiteSubmit;
	}

	@Override
	public int upWhiteSubmitStatusById(Map<String, Object> map) {
		int i = whiteMgDao.upWhiteSubmitStatusById(map);
		return i;
	}

	@Override
	public int addSubmitMg(whiteSubmitMg wsm) {
		int i = whiteMgDao.addSubmitMg(wsm);
		return i;
	}

	@Override
	public int addSubmitMidMg(Map<String, Object> map) {
		int i = whiteMgDao.addSubmitMidMg(map);
		return i;
	}

	@Override
	public List<whiteSubmitMg> getSubmitMgByPage(PageUtil<whiteSubmitMg> page) {
		List<whiteSubmitMg> submitMgByPage = whiteMgDao.getSubmitMgByPage(page);
		return submitMgByPage;
	}

	@Override
	public int getTotals(PageUtil<whiteSubmitMg> page) {
		int totals = whiteMgDao.getTotals(page);
		return totals;
	}

	@Override
	public List<WhiteSubmit> getWhiteSubmitByLeftJoinId(String mgId) {
		List<WhiteSubmit> whiteSubmitByLeftJoinId = whiteMgDao.getWhiteSubmitByLeftJoinId(mgId);
		return whiteSubmitByLeftJoinId;
	}

	@Override
	public whiteSubmitMg getWhiteSubmitById(String id) {
		whiteSubmitMg whiteSubmitById = whiteMgDao.getWhiteSubmitById(id);
		return whiteSubmitById;
	}

	@Override
	public WhiteSubmit findWhiteMgById1(String id) {
		WhiteSubmit findWhiteMgById1 = whiteMgDao.findWhiteMgById1(id);
		return findWhiteMgById1;
	}

	@Override
	public List<String> getSubmitIdByMgId(String mgId) {
		List<String> submitIdByMgId = whiteMgDao.getSubmitIdByMgId(mgId);
		return submitIdByMgId;
	}

	@Override
	public int delWhiteSubmitBySubmitId(List<String> list) {
		int i = whiteMgDao.delWhiteSubmitBySubmitId(list);
		return i;
	}

	@Override
	public int delSubmitMidMgByMgId(String mgId) {
		int i = whiteMgDao.delSubmitMidMgByMgId(mgId);
		return i;
	}

	@Override
	public void addCpersonFile(Map<String, Object> map) {
		whiteMgDao.addCpersonFile(map);
		
	}

	@Override
	public List<WhiteCpersonFile> getFileId(String cperson) {
		List<WhiteCpersonFile> fileId = whiteMgDao.getFileId(cperson);
		return fileId;
	}

	@Override
	public int addWhiteMidFile(Map<String, Object> map) {
		int i = whiteMgDao.addWhiteMidFile(map);
		return i;
		
	}

	@Override
	public List<WhiteMidFile> getWhiteMidFile(String szydNo) {
		List<WhiteMidFile> whiteMidFile = whiteMgDao.getWhiteMidFile(szydNo);
		return whiteMidFile;
	}

	@Override
	public int delWhiteMgById1(String id) {
		int i = whiteMgDao.delWhiteMgById1(id);
		return i;
	}

	@Override
	public int addWhiteFlow(Map<String, Object> map) {
		int i = whiteMgDao.addWhiteFlow(map);
		return i;
	}

	@Override
	public List<WhiteSubmit> getSubmitByMgId(String mgId) {
		List<WhiteSubmit> submitByMgId = whiteMgDao.getSubmitByMgId(mgId);
		return submitByMgId;
	}

	@Override
	public void updateSubmitStatus(WhiteSubmit ws) {
		whiteMgDao.updateSubmitStatus(ws);
	}

	@Override
	public List<WhiteSubmit> getDataSubmitByPage(Map<String, Object> paramMap) {
		List<WhiteSubmit> dataSubmitByPage = whiteMgDao.getDataSubmitByPage(paramMap);
		return dataSubmitByPage;
	}

	@Override
	public List<WhiteFlow> getWhiteFlow(String id) {
		List<WhiteFlow> whiteFlow = whiteMgDao.getWhiteFlow(id);
		return whiteFlow;
	}

	@Override
	public List<SysFile> getSzydFj(String szydNo) {
		List<SysFile> szydFj = whiteMgDao.getSzydFj(szydNo);
		return szydFj;
	}

	@Override
	public String getSiteIdBySiteName(String siteName) {
		String siteIdBySiteName = whiteMgDao.getSiteIdBySiteName(siteName);
		return null;
	}

	@Override
	public WhiteSubmit getWhiteByAsiteId(String asiteId) {
		WhiteSubmit whiteByAsiteId = whiteMgDao.getWhiteByAsiteId(asiteId);
		return whiteByAsiteId;
	}

	@Override
	public int checkCityName(String cityName) {
		int i = whiteMgDao.checkCityName(cityName);
		return i;
	}

	@Override
	public List<WhiteCityNum> getCityWhiteNum() {
		List<WhiteCityNum> cityWhiteNum = whiteMgDao.getCityWhiteNum();
		return cityWhiteNum;
	}

	@Override
	public List<WhiteCountyNum> getCountyWhiteNumByCityId(String cityId) {
		List<WhiteCountyNum> countyWhiteNumByCityId = whiteMgDao.getCountyWhiteNumByCityId(cityId);
		return countyWhiteNumByCityId;
	}

	@Override
	public List<WhiteCityNum> getCountCitySiteNum() {
		List<WhiteCityNum> countCitySiteNum = whiteMgDao.getCountCitySiteNum();
		return countCitySiteNum;
	}

	@Override
	public int getCityWhiteCountZNum() {
		int i = whiteMgDao.getCityWhiteCountZNum();
		return i;
	}

	@Override
	public int getCityCountZNum() {
		int i = whiteMgDao.getCityCountZNum();
		return i;
	}

	@Override
	public int getCountyWhiteCountZNum(String cityId) {
		int i = whiteMgDao.getCountyWhiteCountZNum(cityId);
		return i;
	}

	@Override
	public int getCountyZNum(String cityId) {
		int i = whiteMgDao.getCountyZNum(cityId);
		return i;
	}

	@Override
	public String getZbiByCityId(String cityId) {
		String zbiByCityId = whiteMgDao.getZbiByCityId(cityId);
		return zbiByCityId;
	}

	@Override
	public String getCityNameByCityId(String cityId) {
		String cityNameByCityId = whiteMgDao.getCityNameByCityId(cityId);
		return cityNameByCityId;
	}

	@Override
	public void upIsDo(String cityName) {
		whiteMgDao.upIsDo(cityName);
	}

	@Override
	public void upIsNDo(String cityName) {
		whiteMgDao.upIsNDo(cityName);
		
	}

	@Override
	public void upWhiteBili(Map<String, Object> map) {
		whiteMgDao.upWhiteBili(map);
	}

	@Override
	public List<WhiteSubmit> getSubmitAll() {
		List<WhiteSubmit> submitAll = whiteMgDao.getSubmitAll();
		return submitAll;
	}

	@Override
	public void deCpersonMidFileByfjid(String fileId) {
		whiteMgDao.deCpersonMidFileByfjid(fileId);
		
	}

	@Override
	public void delCpMid() {
		whiteMgDao.delCpMid();
	}

	@Override
	public int getSzydCount(String id) {
		int i = whiteMgDao.getSzydCount(id);
		return i;
	}

	@Override
	public void delSMFByMgId(String id) {
		whiteMgDao.delSMFByMgId(id);
		
	}

	@Override
	public void delwhite() {
		whiteMgDao.delwhite();
		
	}

	@Override
	public WhiteSubmit getSzydInofBySzydNo(String szydno) {
		WhiteSubmit szydInofBySzydNo = whiteMgDao.getSzydInofBySzydNo(szydno);
		return szydInofBySzydNo;
	}

	@Override
	public int delfj(Map<String, Object> map) {
		int i = whiteMgDao.delfj(map);
		return i;
	}

	@Override
	public void addsyswhitemidfile(Map<String, Object> map) {
			whiteMgDao.addsyswhitemidfile(map);
	}

	@Override
	public String getszydbegintimebymgid(String id) {
		String getszydbegintimebymgid = whiteMgDao.getszydbegintimebymgid(id);
		return getszydbegintimebymgid;
	}

	@Override
	public void updatesyswhitesubmitmgstatus(String id) {
		whiteMgDao.updatesyswhitesubmitmgstatus(id);
		
	}

	@Override
	public void upsys3(String id) {
		whiteMgDao.upsys3(id);
		
	}

	@Override
	public void upmg3(String id) {
		whiteMgDao.upmg3(id);
		
	}

	@Override
	public void addwrong(Map<String, Object> map) {
		whiteMgDao.addwrong(map);
		
	}

	@Override
	public int getwrong() {
		int i = whiteMgDao.getwrong();
		return i;
	}

	@Override
	public void delwrong(String userid) {
		whiteMgDao.delwrong(userid);
		
	}

	@Override
	public List<WrongInfo> getwronginfo(String userid) {
		List<WrongInfo> getwronginfo = whiteMgDao.getwronginfo(userid);
		return getwronginfo;
	}

	@Override
	public int getrnum() {
		int i = whiteMgDao.getrnum();
		return i;
	}

	@Override
	public void ruku(String id) {
		whiteMgDao.ruku(id);
	}

	@Override
	public void cuku(String id) {

		whiteMgDao.cuku(id);
	}

	@Override
	public void addContract(Map<String, Object> mmap) {
		whiteMgDao.addContract(mmap);
		
	}

	@Override
	public List<String> geteletop() {
		  List<String> geteletop = whiteMgDao.geteletop();
		return geteletop;
	}

	@Override
	public List<String> getele() {
		List<String> getele = whiteMgDao.getele();
		return getele;
	}

	@Override
	public List<Peat> geteleMoney() {
		List<Peat> geteleMoney = whiteMgDao.geteleMoney();
		return geteleMoney;
	}

	@Override
	public void delContractByContractId(String contractId) {
		whiteMgDao.delContractByContractId(contractId);
	}

	@Override
	public String getcity(String cn) {
		String getcity = whiteMgDao.getcity(cn);
		return getcity;
	}

	@Override
	public int checkziguanname1(String siteName) {
		int i = whiteMgDao.checkziguanname1(siteName);
		return i;
	}

}
