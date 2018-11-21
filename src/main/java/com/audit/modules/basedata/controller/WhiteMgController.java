package com.audit.modules.basedata.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.basedata.dao.WhiteMgDao;
import com.audit.modules.basedata.entity.AccountSiteManage;
import com.audit.modules.basedata.entity.Peat;
import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.basedata.entity.WhiteCityNum;
import com.audit.modules.basedata.entity.WhiteCountyNum;
import com.audit.modules.basedata.entity.WhiteCpersonFile;
import com.audit.modules.basedata.entity.WhiteFlow;
import com.audit.modules.basedata.entity.WhiteMidFile;
import com.audit.modules.basedata.entity.WhiteSubmit;
import com.audit.modules.basedata.entity.WrongInfo;
import com.audit.modules.basedata.entity.whiteSubmitMg;
import com.audit.modules.basedata.service.WhiteMgService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.system.entity.SysFile;
import com.audit.modules.system.entity.SysRoleVo;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.entity.WhiteMg;
import com.google.common.collect.Maps;
@Controller
@RequestMapping("/whiteMg")
public class WhiteMgController {
	
	private static final String UserVo = null;
	@Autowired
	private WhiteMgService whiteMgService;
	
	@RequestMapping("/findUpload.do")
	@ResponseBody
	public ResultVO findUploadByPage(HttpServletRequest request ,Integer pageNo, Integer pageSize) {
		PageUtil<WhiteMg> page = new PageUtil<WhiteMg>();
		if(pageNo != null && pageSize != null){
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		List<WhiteMg> findWhiteUploadByPage = whiteMgService.findWhiteUploadByPage(page);
		return ResultVO.success(page);
	}
	
	@RequestMapping("findSzyd")
	@ResponseBody
	public ResultVO findSzyd(HttpServletRequest request){
		String szydno = request.getParameter("szydno");
		WhiteSubmit szydInofBySzydNo = whiteMgService.getSzydInofBySzydNo(szydno);
		List<SysFile> findFJBySzydNo = whiteMgService.findFJBySzydNo(szydno);
		if(szydInofBySzydNo!=null){
			szydInofBySzydNo.setFjs(findFJBySzydNo);
		}
		
		
		/*HttpSession session = request.getSession();
		UserVo user = (UserVo)session.getAttribute("user");
		Long city = user.getCity();
		WhiteSubmit findSzydByCityName = whiteMgService.findSzydByCityName(String.valueOf(city));
		if(findSzydByCityName!=null){
			List<SysFile> findFJBySzydNo = whiteMgService.findFJBySzydNo(findSzydByCityName.getSzydNo());
			findSzydByCityName.setFjs(findFJBySzydNo);
			return ResultVO.success(findSzydByCityName);
		}else{
			return ResultVO.success();
		}*/
		return ResultVO.success(szydInofBySzydNo);
	}
	
	
/*	@RequestMapping("findWhiteSubmit")
	@ResponseBody
	public ResultVO findWhiteSubmit(HttpServletRequest request ,Integer pageNo, Integer pageSize){
		HttpSession session = request.getSession();
		UserVo user =(UserVo) session.getAttribute("user");
		List<String> roleList = whiteMgService.getRoleList(user.getUserId());
		int roleLevel=0;
		for(String sys:roleList){
			if("分公司市级电费管理员".equals(sys)){
				roleLevel=0;
				break;
			}
			if("分公司网络部分管经理".equals(sys)){
				roleLevel=1;
				break;
			}
			if("分公司分管副总".equals(sys)){
				roleLevel=2;
				break;
			}
		}
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	paramMap.put("siteName",request.getParameter("siteName"));
		 	paramMap.put("szydNo",request.getParameter("szydNo"));
		 	paramMap.put("cityId", user.getCity());
		PageUtil<WhiteSubmit> page = new PageUtil<WhiteSubmit>();
		if(pageNo != null && pageSize != null){
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		List<WhiteSubmit> findWhiteMgSubmitByPage = whiteMgService.findWhiteMgSubmitByPage(page);
		for(WhiteSubmit ws:findWhiteMgSubmitByPage){
			ws.setUserRoleLevel(roleLevel);
		}
		int total = whiteMgService.getTotal(page);
		page.setTotalRecord(total);
		page.setResults(findWhiteMgSubmitByPage);
		return ResultVO.success(page);
	}*/
	
	
	
	@RequestMapping("findWhiteSubmit")
	@ResponseBody
	public ResultVO findWhiteSubmit(HttpServletRequest request ,Integer pageNo, Integer pageSize){
		HttpSession session = request.getSession();
		UserVo user =(UserVo) session.getAttribute("user");
		List<String> roleList = whiteMgService.getRoleList(user.getUserId());
		int roleLevel=0;
		for(String sys:roleList){
			if("分公司市级电费管理员".equals(sys)){
				roleLevel=0;
				break;
			}
			if("分公司网络部分管经理".equals(sys)){
				roleLevel=1;
				break;
			}
			if("分公司分管副总".equals(sys)){
				roleLevel=2;
				break;
			}
		}
		 Map<String,Object> paramMap = Maps.newHashMap();
		 	paramMap.put("status",request.getParameter("status"));
		 	paramMap.put("szydNo",request.getParameter("szydNo"));
		 	paramMap.put("submitTime", request.getParameter("submitTime"));
		 	paramMap.put("cperson", request.getParameter("cperson"));
		PageUtil<whiteSubmitMg> page = new PageUtil<whiteSubmitMg>();
		if(pageNo != null && pageSize != null){
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		//查比例
				String cityNameByCityId = whiteMgService.getCityNameByCityId(String.valueOf(user.getCity()));
				int countyWhiteCountZNum = whiteMgService.getCountyWhiteCountZNum(String.valueOf(user.getCity()));
				int countyZNum = whiteMgService.getCountyZNum(String.valueOf(user.getCity()));
				String zbiByCityId = whiteMgService.getZbiByCityId(String.valueOf(user.getCity()));
				if(countyZNum>0 && countyZNum!=0){
					if(countyWhiteCountZNum/countyZNum>Integer.parseInt(zbiByCityId)){
						whiteMgService.upIsDo(cityNameByCityId);
					}
				}
		List<whiteSubmitMg> submitMgByPage = whiteMgService.getSubmitMgByPage(page);
		for(whiteSubmitMg ws:submitMgByPage){
			ws.setRoleLevel(roleLevel);
		}
		int total = whiteMgService.getTotals(page);
		page.setTotalRecord(total);
		page.setResults(submitMgByPage);
		return ResultVO.success(page);
	}
	
	
	
	
	//查找白名单站点详情
	@RequestMapping("getSiteInfo")
	@ResponseBody
	public ResultVO getSiteInfo(HttpServletRequest request){
		String id = request.getParameter("id");
		WhiteMg findWhiteMgById = whiteMgService.findWhiteMgById(id);
		return ResultVO.success(findWhiteMgById);
	}
	
	
	//查找白名单站点详情
		@RequestMapping("getSiteInfo1")
		@ResponseBody
		public ResultVO getSiteInfo1(HttpServletRequest request){
			String id = request.getParameter("id");
			WhiteSubmit findWhiteMgById1 = whiteMgService.findWhiteMgById1(id);
			return ResultVO.success(findWhiteMgById1);
		}
		//查找白名单流程
		@RequestMapping("getWhiteFlow")
		@ResponseBody
		public ResultVO getWhiteFlow(HttpServletRequest request){
			String id = request.getParameter("id");
			List<WhiteFlow> whiteFlow = whiteMgService.getWhiteFlow(id);
			return ResultVO.success(whiteFlow);
		}
	
   //删除一条白名单站点信息
	@RequestMapping("delWhiteMgById")
	@ResponseBody
	public ResultVO delWhiteMg(HttpServletRequest request){
		String id = request.getParameter("id");
		int i = whiteMgService.delWhiteMgById(id);
		if(i>=1){
			return ResultVO.success("删除成功");
		}else{
			return ResultVO.success("删除失败");
		}
	}
	
	
//	修改页删除一条白名单站点信息
	@RequestMapping("delWhiteMgById1")
	@ResponseBody
	public ResultVO delWhiteMg1(HttpServletRequest request){
		String id = request.getParameter("id");
		int i = whiteMgService.delWhiteMgById1(id);
		if(i>=1){
			return ResultVO.success("删除成功");
		}else{
			return ResultVO.success("删除失败");
		}
	}
	
	//保存入whiteSubmit
	@RequestMapping("saveWhiteSubmit")
	@ResponseBody
	public ResultVO saveWhiteSubmit(HttpServletRequest request){
		HttpSession session = request.getSession();
		UserVo user = (UserVo)session.getAttribute("user");
		Long city = user.getCity();
		Long county = user.getCounty();
		String userName = request.getParameter("userName");
		String szydNo = request.getParameter("szydNo");
		String bz = request.getParameter("bz");
		List<WhiteCpersonFile> fileId = whiteMgService.getFileId(user.getUserId());
		//将上传的附件存入中间表
		if(fileId!=null && fileId.size()>0){
			for(int i=0;i<fileId.size();i++){
				Map<String, Object> map=new HashMap<String,Object>();
				map.put("szydNo", szydNo);
				map.put("fjId", fileId.get(i).getFileId());
				map.put("id", UUID.randomUUID().toString().replaceAll("-", ""));
				int addWhiteMidFile = whiteMgService.addWhiteMidFile(map);
				if(addWhiteMidFile>0){
					whiteMgService.deCpersonMidFileByfjid(fileId.get(i).getFileId());
				}
			}
		}
		String szydBeginTime = request.getParameter("szydBeginTime");
		String status = request.getParameter("status");
		if(status!=null && status!=""&&"0".equals(status)){
			List<WhiteMg> findWhitMg = whiteMgService.findWhitMg();
			for(int i=0;i<findWhitMg.size();i++){
				findWhitMg.get(i).setCperson(userName);
				findWhitMg.get(i).setSzydNo(szydNo);
				findWhitMg.get(i).setSzydBeginTime(szydBeginTime);
				findWhitMg.get(i).setSubmitStatus(-1);
				findWhitMg.get(i).setCityId(String.valueOf(city));
				findWhitMg.get(i).setCountyId(String.valueOf(county));
			}
			//存入whiteSubmitMg表中
			whiteSubmitMg wsm=new whiteSubmitMg();
			String uuid = UUID.randomUUID().toString().replaceAll("-", "");
			wsm.setId(uuid);
			wsm.setCperson(userName);
			wsm.setCityName(findWhitMg.get(0).getCityName());
			wsm.setZhLabel(findWhitMg.get(0).getZhLabel());
			wsm.setCj(findWhitMg.get(0).getCj());
			wsm.setStatus(-1);
			wsm.setSzydNo(findWhitMg.get(0).getSzydNo());
			Date date = new Date();
			Calendar ca=new GregorianCalendar();
			ca.setTime(date);
			ca.add(ca.YEAR, 1);
			Date time = ca.getTime();
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String endTime = sdf.format(time);
			wsm.setEndTime(endTime);
			wsm.setSubmitTime(sdf.format(date));
			wsm.setUpdateTime(sdf.format(date));
			wsm.setZiguanName(findWhitMg.get(0).getZiguanName());
			wsm.setSzydBeginTime(findWhitMg.get(0).getSzydBeginTime());
			wsm.setIsdo(0);
			wsm.setBz(bz);
			Date date2 = new Date();
			wsm.setCreateTime(new java.sql.Date(date2.getTime()));
			/*//合同id
			String contractId="HT"+new SimpleDateFormat("yyyy-MM-dd").format(new Date())+(Math.random()*8999+1000);*/
/*			wsm.setContractId(contractId);
*/			int kk = whiteMgService.addSubmitMg(wsm);
			if(kk==0){
				return ResultVO.success("失败");
			}else{
				for(int k=0;k<findWhitMg.size();k++){
					int j = whiteMgService.addWhiteSubmit(findWhitMg.get(k));
				}
				//存入中间表
				for(int m=0;m<findWhitMg.size();m++){
					Map<String, Object> map=new HashMap<String,Object>();
					map.put("mgId", uuid);
					map.put("submitId", findWhitMg.get(m).getId());
					map.put("id", UUID.randomUUID().toString().replaceAll("-", ""));
					int ii = whiteMgService.addSubmitMidMg(map);
					if(ii==0){
						return ResultVO.success("失败");
					}
				}
				
				//存入流程表
				Map<String, Object> flowMap=new HashMap<String,Object>();
				flowMap.put("id", UUID.randomUUID().toString().replace("-", ""));
				flowMap.put("status",-1);
				flowMap.put("person",userName);
				flowMap.put("time", sdf.format(new Date()));
				flowMap.put("remark", "");
				flowMap.put("mgId", uuid);
				whiteMgService.addWhiteFlow(flowMap);
			}
			
		}else {
			List<WhiteMg> findWhitMg = whiteMgService.findWhitMg();
			for(int i=0;i<findWhitMg.size();i++){
				findWhitMg.get(i).setCperson(userName);
				findWhitMg.get(i).setSzydNo(szydNo);
				findWhitMg.get(i).setSzydBeginTime(szydBeginTime);
				findWhitMg.get(i).setSubmitStatus(1);
				findWhitMg.get(i).setCityId(String.valueOf(city));
				findWhitMg.get(i).setCountyId(String.valueOf(county));
			}
			//存入whiteSubmitMg表中
			whiteSubmitMg wsm=new whiteSubmitMg();
			String uuid = UUID.randomUUID().toString().replaceAll("-", "");
			wsm.setId(uuid);
			wsm.setCperson(userName);
			wsm.setCityName(findWhitMg.get(0).getCityName());
			wsm.setZhLabel(findWhitMg.get(0).getZhLabel());
			wsm.setCj(findWhitMg.get(0).getCj());
			wsm.setStatus(1);
			wsm.setSzydNo(findWhitMg.get(0).getSzydNo());
			Date date = new Date();
			Calendar ca=new GregorianCalendar();
			ca.setTime(date);
			ca.add(ca.YEAR, 1);
			Date time = ca.getTime();
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String endTime = sdf.format(time);
			wsm.setEndTime(endTime);
			wsm.setSubmitTime(sdf.format(date));
			wsm.setUpdateTime(sdf.format(date));
			wsm.setZiguanName(findWhitMg.get(0).getZiguanName());
			wsm.setSzydBeginTime(findWhitMg.get(0).getSzydBeginTime());
			wsm.setIsdo(0);
			wsm.setBz(bz);
			/*//合同id
			String contractId="HT"+new SimpleDateFormat("yyyy-MM-dd").format(new Date())+(Math.random()*8999+1000);*/
/*			wsm.setContractId(contractId);
*/			int kk = whiteMgService.addSubmitMg(wsm);
			if(kk==0){
				return ResultVO.success("失败");
			}else{
				for(int k=0;k<findWhitMg.size();k++){
					int j = whiteMgService.addWhiteSubmit(findWhitMg.get(k));
				}
				//存入中间表
				for(int m=0;m<findWhitMg.size();m++){
					Map<String, Object> map=new HashMap<String,Object>();
					map.put("mgId", uuid);
					map.put("submitId", findWhitMg.get(m).getId());
					map.put("id", UUID.randomUUID().toString().replaceAll("-", ""));
					int ii = whiteMgService.addSubmitMidMg(map);
					if(ii==0){
						return ResultVO.success("失败");
					}
				}
				
				//存入流程表
				Map<String, Object> flowMap=new HashMap<String,Object>();
				flowMap.put("id", UUID.randomUUID().toString().replace("-", ""));
				flowMap.put("status",1);
				flowMap.put("person",userName);
				flowMap.put("time", sdf.format(new Date()));
				flowMap.put("remark", "");
				flowMap.put("mgId", uuid);
				whiteMgService.addWhiteFlow(flowMap);
			}
			
		
			
			
			
		}
		return ResultVO.success();
	}
	
	
	
	
	
	
	
	
	//保存入whiteSubmit
		@RequestMapping("saveWhiteSubmit1")
		@ResponseBody
		public ResultVO saveWhiteSubmit1(HttpServletRequest request){
			HttpSession session = request.getSession();
			UserVo user = (UserVo)session.getAttribute("user");
			Long city = user.getCity();
			Long county = user.getCounty();
			String userName = request.getParameter("userName");
			String szydNo = request.getParameter("szydNo");
			String szydBeginTime = request.getParameter("szydBeginTime");
			String status = request.getParameter("status");
			String mgId = request.getParameter("mgId");
			if(status!=null && status!=""&&"0".equals(status)){
				List<WhiteMg> findWhitMg = whiteMgService.findWhitMg();
				for(int i=0;i<findWhitMg.size();i++){
					findWhitMg.get(i).setCperson(userName);
					findWhitMg.get(i).setSzydNo(szydNo);
					findWhitMg.get(i).setSzydBeginTime(szydBeginTime);
					findWhitMg.get(i).setSubmitStatus(0);
					findWhitMg.get(i).setCityId(String.valueOf(city));
					findWhitMg.get(i).setCountyId(String.valueOf(county));
				}
				for(int k=0;k<findWhitMg.size();k++){
					int j = whiteMgService.addWhiteSubmit(findWhitMg.get(k));
				}
				//存入中间表
				for(int m=0;m<findWhitMg.size();m++){
					Map<String, Object> map=new HashMap<String,Object>();
					map.put("mgId", mgId);
					map.put("submitId", findWhitMg.get(m).getId());
					map.put("id", UUID.randomUUID().toString().replaceAll("-", ""));
					int ii = whiteMgService.addSubmitMidMg(map);
					if(ii==0){
						return ResultVO.success("失败");
					}
				}
				
			}else {
				List<WhiteMg> findWhitMg = whiteMgService.findWhitMg();
				for(int i=0;i<findWhitMg.size();i++){
					findWhitMg.get(i).setCperson(userName);
					findWhitMg.get(i).setSzydNo(szydNo);
					findWhitMg.get(i).setSzydBeginTime(szydBeginTime);
					findWhitMg.get(i).setSubmitStatus(1);
					findWhitMg.get(i).setCityId(String.valueOf(city));
					findWhitMg.get(i).setCountyId(String.valueOf(county));
				}
				for(int k=0;k<findWhitMg.size();k++){
					int j = whiteMgService.addWhiteSubmit(findWhitMg.get(k));
				}
			}
			return ResultVO.success();
		}
	
	
	
	
	
	
	
	@RequestMapping("deleteWhiteMg")
	@ResponseBody
	public ResultVO deleteWhiteMg(){
		whiteMgService.deleteWhite();
		return ResultVO.success();
	}
	
	
	/*//查找whitSubmit
	@RequestMapping("getWhiteSubmitInfo")
	@ResponseBody
	public ResultVO getWhiteSubmitInfo(HttpServletRequest request){
		String id = request.getParameter("id");
		WhiteSubmit whiteSubmitById = whiteMgService.getWhiteSubmitById(id);
		return ResultVO.success(whiteSubmitById);
	}
	
	//删除whitSubmit
	@RequestMapping("delWhiteSubmit")
	@ResponseBody
	public ResultVO delWhiteSubmit(HttpServletRequest request){
		String id = request.getParameter("id");
		int i = whiteMgService.delWhiteSubmit(id);
		if(i>0){
			return ResultVO.success("删除成功");
		}else{
			return ResultVO.success("删除失败");
		}
	}*/
	
	
	//查找whitSubmitMg
		@RequestMapping("getWhiteSubmitInfo")
		@ResponseBody
		public ResultVO getWhiteSubmitInfo(HttpServletRequest request){
			String id = request.getParameter("id");
			//查找whitesubmitmg
			whiteSubmitMg whiteSubmitById = whiteMgService.getWhiteSubmitById(id);
			//查找whitesubmit
			List<WhiteSubmit> whiteSubmitByLeftJoinId = whiteMgService.getWhiteSubmitByLeftJoinId(id);
			//查找附件
			List<SysFile> findFJBySzydNo = whiteMgService.findFJBySzydNo(whiteSubmitById.getSzydNo());
			whiteSubmitById.setWhiteSubmitLists(whiteSubmitByLeftJoinId);
			whiteSubmitById.setFjs(findFJBySzydNo);
			return ResultVO.success(whiteSubmitById);
		}
		
		//删除whitSubmit
		@RequestMapping("delWhiteSubmitMg")
		@ResponseBody
		public ResultVO delWhiteSubmitMg(HttpServletRequest request){
			String id = request.getParameter("id");
			List<String> submitIdByMgId = whiteMgService.getSubmitIdByMgId(id);
			//根据mgid查找是否还有该市的白名单
			int szydCount = whiteMgService.getSzydCount(id);
			//没有单子就删除三重一大关联的附件
			if(szydCount==1){
				whiteMgService.delSMFByMgId(id);
			}
			int i = whiteMgService.delWhiteSubmitMg(id);
			int delWhiteSubmitBySubmitId = whiteMgService.delWhiteSubmitBySubmitId(submitIdByMgId);
			int delSubmitMidMgByMgId = whiteMgService.delSubmitMidMgByMgId(id);
			if(i>0){
				return ResultVO.success("删除成功");
			}else{
				return ResultVO.success("删除失败");
			}
		}
		
		
		
	@RequestMapping("updateWhiteSubmit")
	@ResponseBody
	public ResultVO updateWhiteSubmit(HttpServletRequest request){
		HttpSession session = request.getSession();
		UserVo user =(UserVo) session.getAttribute("user");
		Map<String, Object> map=new HashMap<String,Object>();
		Map<String, Object> flowMap=new HashMap<String,Object>();
		String id = request.getParameter("id");
		int submitStatus = Integer.parseInt(request.getParameter("submitStatus"));
		int flag = Integer.parseInt(request.getParameter("flag"));
		List<WhiteSubmit> submitByMgId = whiteMgService.getSubmitByMgId(id);
		//根据mgId查找sys_white_submit_mg
		String getszydbegintimebymgid = whiteMgService.getszydbegintimebymgid(id);
		if(flag==-1){
			String remark = request.getParameter("remark");
			if(submitStatus==0){
				map.put("submitStatus", 0);
				flowMap.put("status", 0);
			}else if(submitStatus==1){
				map.put("submitStatus", 0);
				flowMap.put("status", 0);
				flowMap.put("remark", remark);
			}else if(submitStatus==2){
				map.put("submitStatus", 0);
				flowMap.put("status", 0);
				flowMap.put("remark", remark);
			}else if(submitStatus==3){
				map.put("submitStatus", 6);
				flowMap.put("status", 6);
				flowMap.put("remark", remark);
			}
		}else{
			if(submitStatus==0){
				map.put("submitStatus", 1);
				flowMap.put("status", 1);
				flowMap.put("remark", "");
			}else if(submitStatus==-1){
				map.put("submitStatus", 1);
				flowMap.put("status", 1);
				flowMap.put("remark", "");
			}else if(submitStatus==1){
				map.put("submitStatus", 2);
				flowMap.put("status", 2);
				flowMap.put("remark", "");
			}else if(submitStatus==2){
				map.put("submitStatus", 4);
				flowMap.put("status", 4);
				flowMap.put("remark", "");
			}else if(submitStatus==3){
				map.put("submitStatus", 5);
				flowMap.put("status", 5);
				flowMap.put("remark", "");
			}
		}
		//修改submit状态
		for(WhiteSubmit ws:submitByMgId){
			Object object = map.get("submitStatus");
			ws.setSubmitStatus((int)object);
			whiteMgService.updateSubmitStatus(ws);
		}
		map.put("id", id);
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String updateTime = sdf.format(new Date());
		map.put("updateTime", updateTime);
		map.put("szydBeginTime", getszydbegintimebymgid);
		int i = whiteMgService.upWhiteSubmitStatusById(map);
		//入库成功修改Iswhite
		int kkkkkk=((int)map.get("submitStatus"));
		if(i>0 && flag==1 && kkkkkk==4 &&submitStatus==2){
			//修改sys_white_submit_mg 状态4
			whiteMgService.updatesyswhitesubmitmgstatus(id);
			whiteMgService.ruku(id);
			//将合同信息保存入合同表
			List<WhiteSubmit> whiteSubmitByLeftJoinId = whiteMgService.getWhiteSubmitByLeftJoinId(id);
			if(whiteSubmitByLeftJoinId.size()>0){
				for(int jj=0;jj<whiteSubmitByLeftJoinId.size();jj++){
					Map<String, Object> mmap=new HashMap<String,Object>();
					mmap.put("contractId", whiteSubmitByLeftJoinId.get(jj).getContractId());
					mmap.put("contractName", whiteSubmitByLeftJoinId.get(jj).getContractName());
					mmap.put("city", whiteSubmitByLeftJoinId.get(jj).getCityId());
					mmap.put("county", whiteSubmitByLeftJoinId.get(jj).getCountyId());
					SimpleDateFormat sdff=new SimpleDateFormat("yyyy-MM-dd");
					
					try {
						mmap.put("contractDate",new java.sql.Date(sdff.parse(whiteSubmitByLeftJoinId.get(jj).getContractDate()).getTime()));
						mmap.put("contractEndTime", new java.sql.Date(sdff.parse(whiteSubmitByLeftJoinId.get(jj).getContractEndTime()).getTime()));
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					mmap.put("payType",String.valueOf(whiteSubmitByLeftJoinId.get(jj).getPayType()) );
					mmap.put("price",whiteSubmitByLeftJoinId.get(jj).getPrice() );
					mmap.put("fTan", String.valueOf(whiteSubmitByLeftJoinId.get(jj).getfTan()));
					mmap.put("supplyName",whiteSubmitByLeftJoinId.get(jj).getSupplyName() );
					mmap.put("supplySiteId", whiteSubmitByLeftJoinId.get(jj).getSupplySiteId());
					mmap.put("supplyerOrganizationId", whiteSubmitByLeftJoinId.get(jj).getSupplyerOrganizationId());
					mmap.put("bankName", whiteSubmitByLeftJoinId.get(jj).getBankName());
					mmap.put("bankacName", whiteSubmitByLeftJoinId.get(jj).getBankacName());
					mmap.put("bankNum", whiteSubmitByLeftJoinId.get(jj).getBankNum());
					mmap.put("id", UUID.randomUUID().toString().replaceAll("-", ""));
					mmap.put("iswhite", 1);
					whiteMgService.addContract(mmap);
					
				}
			}
		}
		
		//如果出库成功修改资管站表iswhite状态
		if(i>0 && flag==1 && kkkkkk==5 && submitStatus==3){
			
			whiteMgService.cuku(id);
			//删除虚拟合同
			List<WhiteSubmit> whiteSubmitByLeftJoinId = whiteMgService.getWhiteSubmitByLeftJoinId(id);
			for(int jj=0;jj<whiteSubmitByLeftJoinId.size();jj++){
				whiteMgService.delContractByContractId(whiteSubmitByLeftJoinId.get(jj).getContractId());
			}
			
		}
		//存入流程表
		flowMap.put("id", UUID.randomUUID().toString().replace("-", ""));
		flowMap.put("person",user.getUserName());
		flowMap.put("time", sdf.format(new Date()));
		flowMap.put("mgId", id);
		whiteMgService.addWhiteFlow(flowMap);
		
		if(i>0){
			return ResultVO.success("成功");
		}else{
			return ResultVO.success("失败");
		}
	}
	
	
	
	
	//批量
	@RequestMapping("bachUpStatus")
	@ResponseBody
	public ResultVO bachUpStatus(HttpServletRequest request,@RequestBody List<whiteSubmitMg> wms){
		HttpSession session = request.getSession();
		UserVo user =(UserVo) session.getAttribute("user");
		for(whiteSubmitMg wm:wms){
			Map<String, Object> map=new HashMap<String,Object>();
			Map<String, Object> flowMap=new HashMap<String,Object>();
			String id = wm.getId();
			Integer flag = wm.getDostatus();
			Integer submitStatus = wm.getStatus();
			List<WhiteSubmit> submitByMgId = whiteMgService.getSubmitByMgId(id);
			if(flag==-1){
				if(submitStatus==0){
					map.put("submitStatus", 0);
					flowMap.put("status", 0);
				}else if(submitStatus==1){
					map.put("submitStatus", 0);
					flowMap.put("status", 0);
					flowMap.put("remark", "");
				}else if(submitStatus==2){
					map.put("submitStatus", 0);
					flowMap.put("status", 0);
					flowMap.put("remark", "");
				}else if(submitStatus==3){
					map.put("submitStatus", 6);
					flowMap.put("status", 6);
					flowMap.put("remark", "");
				}
			}else{
				if(submitStatus==0){
					map.put("submitStatus", 1);
					flowMap.put("status", 1);
					flowMap.put("remark", "");
				}else if(submitStatus==-1){
					map.put("submitStatus", 1);
					flowMap.put("status", 1);
					flowMap.put("remark", "");
				}else if(submitStatus==1){
					map.put("submitStatus", 2);
					flowMap.put("status", 2);
					flowMap.put("remark", "");
				}else if(submitStatus==2){
					map.put("submitStatus", 4);
					flowMap.put("status", 4);
					flowMap.put("remark", "");
					//修改sys_white_submit_mg 状态4
					whiteMgService.updatesyswhitesubmitmgstatus(id);
				}else if(submitStatus==3){
					map.put("submitStatus", 5);
					flowMap.put("status", 5);
					flowMap.put("remark", "");
				}
			}
			//修改submit状态
			for(WhiteSubmit ws:submitByMgId){
				Object object = map.get("submitStatus");
				ws.setSubmitStatus((int)object);
				whiteMgService.updateSubmitStatus(ws);
			}
			map.put("id", id);
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String updateTime = sdf.format(new Date());
			map.put("updateTime", updateTime);
			int i = whiteMgService.upWhiteSubmitStatusById(map);
			//入库成功修改Iswhite
			int kkkkkk=((int)map.get("submitStatus"));
			if(i>0 && flag==1 && kkkkkk==4 && submitStatus==2){
				whiteMgService.ruku(id);
				//将合同信息保存入合同表
				List<WhiteSubmit> whiteSubmitByLeftJoinId = whiteMgService.getWhiteSubmitByLeftJoinId(id);
				if(whiteSubmitByLeftJoinId.size()>0){
					for(int jj=0;jj<whiteSubmitByLeftJoinId.size();jj++){
						Map<String, Object> mmap=new HashMap<String,Object>();
						mmap.put("contractId", whiteSubmitByLeftJoinId.get(jj).getContractId());
						mmap.put("contractName", whiteSubmitByLeftJoinId.get(jj).getContractName());
						mmap.put("city", whiteSubmitByLeftJoinId.get(jj).getCityId());
						mmap.put("county", whiteSubmitByLeftJoinId.get(jj).getCountyId());
						SimpleDateFormat sdff=new SimpleDateFormat("yyyy-MM-dd");
						
						try {
							mmap.put("contractDate",new java.sql.Date(sdff.parse(whiteSubmitByLeftJoinId.get(jj).getContractDate()).getTime()));
							mmap.put("contractEndTime", new java.sql.Date(sdff.parse(whiteSubmitByLeftJoinId.get(jj).getContractEndTime()).getTime()));
						} catch (ParseException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						mmap.put("payType",String.valueOf(whiteSubmitByLeftJoinId.get(jj).getPayType()) );
						mmap.put("price",whiteSubmitByLeftJoinId.get(jj).getPrice() );
						mmap.put("fTan", String.valueOf(whiteSubmitByLeftJoinId.get(jj).getfTan()));
						mmap.put("supplyName",whiteSubmitByLeftJoinId.get(jj).getSupplyName() );
						mmap.put("supplySiteId", whiteSubmitByLeftJoinId.get(jj).getSupplySiteId());
						mmap.put("supplyerOrganizationId", whiteSubmitByLeftJoinId.get(jj).getSupplyerOrganizationId());
						mmap.put("bankName", whiteSubmitByLeftJoinId.get(jj).getBankName());
						mmap.put("bankacName", whiteSubmitByLeftJoinId.get(jj).getBankacName());
						mmap.put("bankNum", whiteSubmitByLeftJoinId.get(jj).getBankNum());
						mmap.put("id", UUID.randomUUID().toString().replaceAll("-", ""));
						whiteMgService.addContract(mmap);
					}
				}
				
			}
			
			//如果出库成功修改资管站表iswhite状态
			if(i>0 && flag==1 && kkkkkk==5 && submitStatus==3){
				whiteMgService.cuku(id);
				List<WhiteSubmit> whiteSubmitByLeftJoinId = whiteMgService.getWhiteSubmitByLeftJoinId(id);
				for(int jj=0;jj<whiteSubmitByLeftJoinId.size();jj++){
					whiteMgService.delContractByContractId(whiteSubmitByLeftJoinId.get(jj).getContractId());
				}
			}
			//存入流程表
			flowMap.put("id", UUID.randomUUID().toString().replace("-", ""));
			flowMap.put("person",user.getUserName());
			flowMap.put("time", sdf.format(new Date()));
			flowMap.put("mgId", id);
			whiteMgService.addWhiteFlow(flowMap);
		}
		return ResultVO.success();
	}
	
	
	
	@RequestMapping("updateSubmitMgStatus")
	@ResponseBody
	public ResultVO updateSubmitMgStatus(HttpServletRequest request){
		String id = request.getParameter("id");
		String szydBeginTime = request.getParameter("szydBeginTime");
		String bz = request.getParameter("bz");
		int status = Integer.parseInt(request.getParameter("status"));
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String updateTime = sdf.format(new Date());
		Map<String, Object> map=new HashMap<String,Object>();
		map.put("id", id);
		map.put("submitStatus", status);
		map.put("updateTime", updateTime);
		map.put("szydBeginTime",szydBeginTime);
		map.put("bz", bz);
		int i = whiteMgService.upWhiteSubmitStatusById(map);
		if(i>0){
			return ResultVO.success("修改成功");
		}else{
			return ResultVO.success("修改失败");
		}
	}
	
	@RequestMapping("findWhiteDataSubmitByPage")
	@ResponseBody
	public ResultVO findWhiteDataSubmitByPage(HttpServletRequest request,Integer pageNo, Integer pageSize){
		HttpSession session = request.getSession();
		UserVo user =(UserVo) session.getAttribute("user");
		List<String> roleList = whiteMgService.getRoleList(user.getUserId());
		int roleLevel=0;
		for(String sys:roleList){
			if("分公司市级电费管理员".equals(sys)){
				roleLevel=0;
				break;
			}
			if("分公司网络部分管经理".equals(sys)){
				roleLevel=1;
				break;
			}
			if("分公司分管副总".equals(sys)){
				roleLevel=2;
				break;
			}if("省级超级管理员".equals(sys)){
				roleLevel=3;
				break;
			}
		}
		
		Map<String,Object> paramMap = Maps.newHashMap();
		 	paramMap.put("siteName",request.getParameter("siteName"));
		 	paramMap.put("szydNo",request.getParameter("szydNo"));
		 	if(user.getCity()!=null){
		 		paramMap.put("cityId", String.valueOf(user.getCity()));
		 	}else{
		 		paramMap.put("cityId", "");
		 	}
		 	
		PageUtil<WhiteSubmit> page = new PageUtil<WhiteSubmit>();
		if(pageNo != null && pageSize != null){
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
		}
		if (paramMap != null) {
			page.setObj(paramMap);
		}
		List<WhiteSubmit> dataSubmitByPage = whiteMgService.getDataSubmitByPage(paramMap);
		for(WhiteSubmit ws:dataSubmitByPage){
			ws.setUserRoleLevel(roleLevel);
		}
		int total = whiteMgService.getTotal(paramMap);
		page.setTotalRecord(total);
		page.setResults(dataSubmitByPage);
		return ResultVO.success(page);
	}
	
	@RequestMapping("getSzydFj")
	@ResponseBody
	public ResultVO getSzydFj(HttpServletRequest request){
		String szydNo = request.getParameter("szydNo");
		List<SysFile> szydFj = whiteMgService.getSzydFj(szydNo);
		return ResultVO.success(szydFj);
	}
	
	
	
	
    /**
     * 获取内容类型。
     *
     * @param extName
     * @return
     */
    private String getContextType(String extName, boolean isRead) {
        String contentType = "application/octet-stream";
        if ("jpg".equalsIgnoreCase(extName) || "jpeg".equalsIgnoreCase(extName)) {
            contentType = "image/jpeg";
        } else if ("png".equalsIgnoreCase(extName)) {
            contentType = "image/png";
        } else if ("gif".equalsIgnoreCase(extName)) {
            contentType = "image/gif";
        } else if ("doc".equalsIgnoreCase(extName) || "docx".equalsIgnoreCase(extName)) {
            contentType = "application/msword";
        } else if ("xls".equalsIgnoreCase(extName) || "xlsx".equalsIgnoreCase(extName)) {
            contentType = "application/vnd.ms-excel";
        } else if ("ppt".equalsIgnoreCase(extName) || "pptx".equalsIgnoreCase(extName)) {
            contentType = "application/ms-powerpoint";
        } else if ("rtf".equalsIgnoreCase(extName)) {
            contentType = "application/rtf";
        } else if ("htm".equalsIgnoreCase(extName) || "html".equalsIgnoreCase(extName)) {
            contentType = "text/html";
        } else if ("swf".equalsIgnoreCase(extName)) {
            contentType = "application/x-shockwave-flash";
        } else if ("bmp".equalsIgnoreCase(extName)) {
            contentType = "image/bmp";
        } else if ("mp4".equalsIgnoreCase(extName)) {
            contentType = "video/mp4";
        } else if ("wmv".equalsIgnoreCase(extName)) {
            contentType = "video/x-ms-wmv";
        } else if ("wm".equalsIgnoreCase(extName)) {
            contentType = "video/x-ms-wm";
        } else if ("rv".equalsIgnoreCase(extName)) {
            contentType = "video/vnd.rn-realvideo";
        } else if ("mp3".equalsIgnoreCase(extName)) {
            contentType = "audio/mp3";
        } else if ("wma".equalsIgnoreCase(extName)) {
            contentType = "audio/x-ms-wma";
        } else if ("wav".equalsIgnoreCase(extName)) {
            contentType = "audio/wav";
        }
        if ("pdf".equalsIgnoreCase(extName) && isRead)// txt不下载文件，读取文件内容
        {
            contentType = "application/pdf";
        }
        if (("sql".equalsIgnoreCase(extName) || "txt".equalsIgnoreCase(extName)) && isRead)// pdf不下载文件，读取文件内容
        {
            contentType = "text/plain";
        }
        return contentType;
    }
	
	@RequestMapping("downFj")
	@ResponseBody
	public void downFj(HttpServletResponse response,HttpServletRequest request) throws Exception{
		
        response.reset();
        String vers = request.getHeader("USER-AGENT");
        String filepath = request.getParameter("filepath");
        String fileName = request.getParameter("filename");
        String ext = request.getParameter("ext");
        String fileNameEnd=fileName+"."+ext;
        if (filepath != null) {
            OutputStream outp = response.getOutputStream();
            String isDownload = request.getParameter("download");
            String contextType = getContextType(ext, true);
            response.setContentType(contextType);
            response.setCharacterEncoding("utf-8");
            if (vers.indexOf("Chrome") != -1 && vers.indexOf("Mobile") != -1) {
            	fileNameEnd = fileNameEnd.toString();
            } else {
            	fileNameEnd = StringUtils.encodingString(fileNameEnd, "GB2312", "ISO-8859-1");
            }
            if ("application/octet-stream".equals(contextType) || StringUtils.isNotBlank(isDownload)) {
                response.addHeader("Content-Disposition", "attachment;filename=" + fileNameEnd);
            } else {
                response.addHeader("Content-Disposition", "attachment;filename=" + fileNameEnd);
            }
            response.addHeader("Content-Transfer-Encoding", "binary");
                // 读取文件并输出
                File file = new File(filepath);
                if (file.exists()) {
                    response.setContentLength((int) file.length());
                    FileInputStream in = null;
                    try {
                        in = new FileInputStream(filepath);
                        byte[] b = new byte[1024];
                        int i = 0;
                        while ((i = in.read(b)) > 0) {
                            outp.write(b, 0, i);
                        }
                        outp.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        if (in != null) {
                            in.close();
                            in = null;
                        }
                        if (outp != null) {
                            outp.close();
                            outp = null;
                            response.flushBuffer();
                        }
                    }
                } else {
                    response.getWriter().print("<font style='font-weight:800;color:#696969;font-size:14px;text-align:center;'>The file is not exists!</font>");
                }
        }
    
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		/*String filepath = request.getParameter("filepath");
		String filename = request.getParameter("filename");
		String ext = request.getParameter("ext");
		System.err.println("-----"+fileName);
		OutputStream os = null;
		InputStream in = null;
		String fileNameEnd = null;
		OutputStream ops=null;
		try {
	        if (filepath != null) {
	            OutputStream outp = response.getOutputStream();
	            String isDownload = request.getParameter("download");
	            String contextType = getContextType(sysFile.getExt(), true);
	            response.setContentType(contextType);
	            response.setCharacterEncoding("utf-8");
	            if (vers.indexOf("Chrome") != -1 && vers.indexOf("Mobile") != -1) {
	                fileName = fileName.toString();
	            } else {
	                fileName = StringUtils.encodingString(fileName, "GB2312", "ISO-8859-1");
	            }
	            if ("application/octet-stream".equals(contextType) || StringUtils.isNotBlank(isDownload)) {
	                response.addHeader("Content-Disposition", "attachment;filename=" + fileName);
	            } else {
	                response.addHeader("Content-Disposition", "filename=" + fileName);
	            }
	            response.addHeader("Content-Transfer-Encoding", "binary");
	                // 读取文件并输出
	                File file = new File(filepath);
	                if (file.exists()) {
	                    response.setContentLength((int) file.length());
	                    FileInputStream in = null;
	                    try {
	                        in = new FileInputStream(filepath);
	                        byte[] b = new byte[1024];
	                        int i = 0;
	                        while ((i = in.read(b)) > 0) {
	                            outp.write(b, 0, i);
	                        }
	                        outp.flush();
	                    } catch (Exception e) {
	                        e.printStackTrace();
	                    } finally {
	                        if (in != null) {
	                            in.close();
	                            in = null;
	                        }
	                        if (outp != null) {
	                            outp.close();
	                            outp = null;
	                            response.flushBuffer();
	                        }
	                    }
	                } else {
	                    response.getWriter().print("<font style='font-weight:800;color:#696969;font-size:14px;text-align:center;'>The file is not exists!</font>");
	                }
	        }
			
			
			
			
			
			
		} catch (IOException e) {
			e.printStackTrace();
			ResultVO.failed("文件不存在！");
			throw new Exception("文件不存在！") ;
		} finally {
			if (in != null) {
				in.close();
			}
			if (ops != null) {
				ops.close();
			}
		}*/
	}
	
	//根据报账点Id查站点————查白名单
	@RequestMapping("getWhiteBySiteName")
	@ResponseBody
	public ResultVO getWhiteBySiteName(HttpServletRequest request) throws ParseException{
		String asiteId = request.getParameter("asiteId");
		WhiteSubmit whiteByAsiteId = whiteMgService.getWhiteByAsiteId(asiteId);
		if(whiteByAsiteId!=null){
			Integer status = whiteByAsiteId.getSubmitStatus();
			Date nowDate = new Date();
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
			String beginTime = whiteByAsiteId.getSzydBeginTime();
			Calendar ca=new GregorianCalendar();
			Date parse = sdf.parse(beginTime);
			ca.setTime(parse);
			ca.add(ca.YEAR, 1);
			Date endTime = ca.getTime();
			//超过白名单有效期
			if((nowDate.getTime() < endTime.getTime())&&(status==4 || status==6 || status==5)){
				return ResultVO.success(whiteByAsiteId);
			}else{
				return ResultVO.success("否");
			}
		}else{
			return ResultVO.success("否");
		}
	}
	
	@RequestMapping("getWhiteSetCity")
	@ResponseBody
	public ResultVO getWhiteSetCity(HttpServletRequest request){
		//查看whiteSubmit中通过审批的站点，修改zg_space_site里是否为白名单状态
		List<WhiteCityNum> countCitySiteNum = whiteMgService.getCountCitySiteNum();
		int zWhiteCount = whiteMgService.getCityWhiteCountZNum();
		int zsiteNum = whiteMgService.getCityCountZNum();
		for(WhiteCityNum wn:countCitySiteNum){
			if(wn.getWhiteSiteNum()==null || wn.getWhiteSiteNum()==0){
				wn.setYu(wn.getSiteNum());
				wn.setWhiteSiteNum(0);
				wn.setBi("0");
				wn.setzWhiteSiteNum(zWhiteCount);
				wn.setzSiteNum(zsiteNum);
			}else{
				wn.setYu(wn.getSiteNum()-wn.getWhiteSiteNum());
				wn.setBi(String.valueOf(wn.getWhiteSiteNum()/wn.getSiteNum()));
				wn.setzWhiteSiteNum(zWhiteCount);
				wn.setzSiteNum(zsiteNum);
			}
		}
		//List<WhiteCityNum> cityWhiteNum = whiteMgService.getCityWhiteNum();
		return ResultVO.success(countCitySiteNum);
	}
	
	@RequestMapping("getWhiteCountyNum")
	@ResponseBody
	public ResultVO getWhiteCountyNum(HttpServletRequest request){
		HttpSession session = request.getSession();
		UserVo user = (UserVo)session.getAttribute("user");
		String cn = request.getParameter("cityName");
		Long city = user.getCity();
		if(city==null){
			String getcity = whiteMgService.getcity(cn);
			if(getcity==null){
				return ResultVO.success("无");
			}else{
				 city = Long.parseLong(getcity);
			}
		}
		List<WhiteCountyNum> countyWhiteNumByCityId = whiteMgService.getCountyWhiteNumByCityId(String.valueOf(city));
		if(countyWhiteNumByCityId.size()<=0){
			return ResultVO.success("无");
		}
		String zbiByCityId = whiteMgService.getZbiByCityId(String.valueOf(city));
		int zWhiteSiteNum = whiteMgService.getCountyWhiteCountZNum(String.valueOf(city));
		int  zSiteNum= whiteMgService.getCountyZNum(String.valueOf(city));
		if(zSiteNum==0){
			return ResultVO.success("无");
		}
		String cityName = whiteMgService.getCityNameByCityId(String.valueOf(city));
		if(zWhiteSiteNum/zSiteNum>Integer.parseInt(zbiByCityId)){
			whiteMgService.upIsDo(cityName);
			countyWhiteNumByCityId.get(0).setInfo("超比例请增大比例");
		}
		for(WhiteCountyNum wn:countyWhiteNumByCityId){
			if(wn.getWhiteSiteNum()==null||wn.getWhiteSiteNum()==0){
				wn.setWhiteSiteNum(0);
				wn.setYu(wn.getSiteNum());
				wn.setBi("0");
				wn.setzWhiteSiteNum(zWhiteSiteNum);
				wn.setzSiteNum(zSiteNum);
			}else{
				wn.setYu(wn.getSiteNum()-wn.getWhiteSiteNum());
				wn.setBi(String.valueOf(wn.getWhiteSiteNum()/wn.getSiteNum()));
				wn.setzWhiteSiteNum(zWhiteSiteNum);
				wn.setzSiteNum(zSiteNum);
			}
		}
		return ResultVO.success(countyWhiteNumByCityId);
	}
	
	@RequestMapping("getZbi")
	@ResponseBody
	public ResultVO getZbi(HttpServletRequest request){
		String cityId = request.getParameter("cityId");
		String zbiByCityId = whiteMgService.getZbiByCityId(cityId);
		return ResultVO.success(zbiByCityId);
	}
	
	@RequestMapping("surechangebili")
	@ResponseBody
	public ResultVO surechangebili(HttpServletRequest request){
		String cityId = request.getParameter("cityId");
		String zbi = request.getParameter("bili");
		Map<String, Object> map=new HashMap<String,Object>();
		map.put("zbi", zbi);
		String cityNameByCityId = whiteMgService.getCityNameByCityId(cityId);
		map.put("cityName", cityNameByCityId);
		whiteMgService.upIsNDo(cityNameByCityId);
		whiteMgService.upWhiteBili(map);
		return ResultVO.success();
	}
	
	@RequestMapping("getSubmitAll")
	@ResponseBody
	public ResultVO submitAll(){
		List<WhiteSubmit> submitAll = whiteMgService.getSubmitAll();
		return ResultVO.success(submitAll);
	}
	
	@RequestMapping("delCpMid")
	@ResponseBody
	public ResultVO delCpMid(){
		whiteMgService.delCpMid();
		return ResultVO.success();
	}
	@RequestMapping("delwhite")
	@ResponseBody
	public ResultVO delwhite(){
		whiteMgService.delwhite();
		return ResultVO.success();
	}
	
	@RequestMapping("findwhitesitenum")
	@ResponseBody
	public ResultVO findwhitesitenum(HttpServletRequest request){
		HttpSession session = request.getSession();
		UserVo user=(UserVo) session.getAttribute("user");
		Long city = user.getCity();
		int cityCountZNum = whiteMgService.getCityCountZNum();
		int cityWhiteCountZNum = whiteMgService.getCityWhiteCountZNum();
		int sheng=cityCountZNum-cityWhiteCountZNum;
		return ResultVO.success(sheng);
	}
	
	
	@RequestMapping("delfj")
	@ResponseBody
	public ResultVO delfj(HttpServletRequest request){
		String szydno = request.getParameter("szydno");
		String fjid = request.getParameter("fjid");
		Map<String, Object> map=new HashMap<String,Object>();
		map.put("szydno", szydno);
		map.put("fjid", fjid);
		int i = whiteMgService.delfj(map);
		if(i>0){
			List<SysFile> findFJBySzydNo = whiteMgService.findFJBySzydNo(szydno);
			return ResultVO.success(findFJBySzydNo);
		}else{
			return ResultVO.success("删除失败");
		}
		
	}
	
	@RequestMapping("findfjagain")
	@ResponseBody
	public ResultVO findfjagain(HttpServletRequest request){
		String szydno = request.getParameter("szydno");
		List<SysFile> findFJBySzydNo = whiteMgService.findFJBySzydNo(szydno);
		return ResultVO.success(findFJBySzydNo);
	}
	
	
	@RequestMapping("updatemgsubmitstatus")
	@ResponseBody
	public ResultVO updatemgsubmitstatus(HttpServletRequest request){
		String id = request.getParameter("id");
		whiteMgService.upsys3(id);
		whiteMgService.updatesyswhitesubmitmgstatus(id);
		whiteMgService.upmg3(id);
		return ResultVO.success();
	}
	
	@RequestMapping("findwrong")
	@ResponseBody
	public ResultVO findwrong(HttpServletRequest request){
		HttpSession session = request.getSession();
		UserVo user =(UserVo) session.getAttribute("user");
		List<WrongInfo> getwronginfo = whiteMgService.getwronginfo(user.getUserId());
		int getwrong = whiteMgService.getwrong();
		int getrnum = whiteMgService.getrnum();
		if(getwronginfo!=null && getwronginfo.size()>0){
			getwronginfo.get(0).setWnum(getwrong);
			getwronginfo.get(0).setRnum(getrnum);
		}
		return ResultVO.success(getwronginfo);
	}
	
	@RequestMapping("delWrong")
	@ResponseBody
	public ResultVO delWrong(HttpServletRequest request){
		UserVo user=(UserVo)request.getSession().getAttribute("user");
		whiteMgService.delwrong(user.getUserId());
		return ResultVO.success();
	}
	
/*	@RequestMapping("geteletop11")
	@ResponseBody
	public ResultVO geteletop11(){
		 List<String> geteletop = whiteMgService.geteletop();
		return ResultVO.success(geteletop);
		
	}*/
	
	@RequestMapping("geteletop11")
	@ResponseBody
	public ResultVO getele(){
		List<String> getele = whiteMgService.getele();
		return ResultVO.success(getele);
	}
	
	@RequestMapping("geteleMoney")
	@ResponseBody
	public ResultVO geteleMoney(){
		List<Peat> geteleMoney = whiteMgService.geteleMoney();
		return ResultVO.success(geteleMoney);
	}
	
	
}
