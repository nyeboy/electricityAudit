package com.audit.modules.electricity.service.impl;

import com.audit.modules.common.DoubleUtil;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.dict.FlowConstant;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.dao.ElectricitySubmitDao;
import com.audit.modules.electricity.entity.EleMiddleSubmitVO;
import com.audit.modules.electricity.entity.ElectricitySubmitVO;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.electricity.entity.SubmitProcess;
import com.audit.modules.electricity.service.ElectricitySubmitService;
import com.audit.modules.electricity.service.InputElectricityService;
import com.audit.modules.payment.dao.AdvancePaymentDao;
import com.audit.modules.payment.dao.EleMidPaymentDao;
import com.audit.modules.payment.dao.PreSubmitDao;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.payment.entity.EleMidPaymentVO;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import org.activiti.engine.HistoryService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Transactional
@Service
public class ElectricitySubmitImpl implements ElectricitySubmitService {

	@Autowired
	private HistoryService historyService;
	
    @Autowired
    private InputElectricityService inputElectricityService;

    @Autowired
	private EleMidPaymentDao eleMidPaymentDao;
    
    @Autowired
    private ElectricitySubmitDao electricitySubmitDao;
    
    @Autowired
    private AdvancePaymentDao adpvDao;
    @Autowired
    private PreSubmitDao pDao;

    @Override
    public ResultVO createEleSubmit(ElectricitySubmitVO electricitySubmitVO, HttpServletRequest request) {
        List<String> ids = electricitySubmitVO.getIds();
        if (ids == null || ids.size() == 0) {
            return ResultVO.failed("电费录入单ID不能为空！");
        }
        String id = StringUtils.getUUid();
        //如果自带报销单id则使用自带id
        //String submitID = request.getParameter("submitID");
       /* if(submitID!=null && !submitID.equals("")) {
        	id = submitID;
        }*/
        
        electricitySubmitVO.setId(id);
        try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			electricitySubmitVO.setStatus(1);
		} catch (AuthorizationException e) {
			electricitySubmitVO.setStatus(0);
		}
        electricitySubmitVO.setReimbursementType(0);
        electricitySubmitVO.setCreateDate(new Date());
        //生成报销提交单id
        String createSerialNumber = StringUtils.createSerialNumber("BX");
        electricitySubmitVO.setSubmitNo(createSerialNumber);
        Object object = request.getSession().getAttribute("userInfo");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
            electricitySubmitVO.setTrustees(userInfo.getUserId());
            electricitySubmitVO.setCity(userInfo.getCity() + "");
            electricitySubmitVO.setCounty(userInfo.getCounty() + "");
        }
        List<ElectrictyVO> electrictyVOs = inputElectricityService.findSiteIdByEid(ids);
        Double amount = 0d;
        Double tax = 0d;
        for (ElectrictyVO electrictyVO : electrictyVOs) {
            String totalAmount = electrictyVO.getTotalAmount();
            if (totalAmount != null) {
                amount += Double.parseDouble(totalAmount);
            }
            String taxAmount = electrictyVO.getTaxAmount();
            if (taxAmount != null) {
                tax += Double.parseDouble(taxAmount);
            }
            // 更新状
            inputElectricityService.updateStatus(electrictyVO.getId(), 4);
        }
        electricitySubmitVO.setTaxAmount(tax + "");
        electricitySubmitVO.setTotalAmount(amount + "");
        electricitySubmitDao.createEleSubmit(electricitySubmitVO);//保存电费提交表
        //写入报销记录
        SubmitProcess addProcess = addProcess(createSerialNumber,request);
        int addProcess2 = electricitySubmitDao.addProcess(addProcess);
        List<EleMiddleSubmitVO> eleMiddleSubmitVOs = Lists.newArrayList();
        for (String eid : ids) {
            EleMiddleSubmitVO eleMiddleSubmitVO = new EleMiddleSubmitVO();
            eleMiddleSubmitVO.setId(StringUtils.getUUid());
            eleMiddleSubmitVO.setSysElectricityId(eid);
            eleMiddleSubmitVO.setSysEleSubmitId(id);
            eleMiddleSubmitVOs.add(eleMiddleSubmitVO);
        }
        electricitySubmitDao.saveEleMidlleSubmit(eleMiddleSubmitVOs);//保存中间表
        return ResultVO.success(electricitySubmitVO.getId());
    }
    
    /**
     * 修改电费提交单
     */
    @Override
    public ResultVO createEleSubmit_1(ElectricitySubmitVO electricitySubmitVO, HttpServletRequest request) {
        List<String> ids = electricitySubmitVO.getIds();
        if (ids == null || ids.size() == 0) {
            return ResultVO.failed("电费录入单ID不能为空！");
        }
        //从提交数据中获取报销单号
        String id = request.getParameter("submitID");
        electricitySubmitVO.setId(id);
       /* try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			electricitySubmitVO.setStatus(1);
		} catch (AuthorizationException e) {
			electricitySubmitVO.setStatus(0);
		}
        electricitySubmitVO.setReimbursementType(0);
        electricitySubmitVO.setCreateDate(new Date());
        //生成报销提交单id
        String createSerialNumber = StringUtils.createSerialNumber("BX");
        electricitySubmitVO.setSubmitNo(createSerialNumber);
        Object object = request.getSession().getAttribute("userInfo");
        UserVo userInfo = null;
        if (object != null) {
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
            electricitySubmitVO.setTrustees(userInfo.getUserId());
            electricitySubmitVO.setCity(userInfo.getCity() + "");
            electricitySubmitVO.setCounty(userInfo.getCounty() + "");
        }*/
        List<ElectrictyVO> electrictyVOs = inputElectricityService.findSiteIdByEid(ids);
        //此处初始化总金额的数据应查询原先报销单的数据
        ElectricitySubmitVO oldElectricitySubmitVO = electricitySubmitDao.queryById(id);
        
        Double amount = Double.parseDouble(oldElectricitySubmitVO.getTotalAmount());
        Double tax = Double.parseDouble(oldElectricitySubmitVO.getTaxAmount());
        
        for (ElectrictyVO electrictyVO : electrictyVOs) {
            String totalAmount = electrictyVO.getTotalAmount();
            if (totalAmount != null) {
                amount += Double.parseDouble(totalAmount);
            }
            String taxAmount = electrictyVO.getTaxAmount();
            if (taxAmount != null) {
                tax += Double.parseDouble(taxAmount);
            }
            // 更新状
            inputElectricityService.updateStatus(electrictyVO.getId(), 4);
        }
        electricitySubmitVO.setTaxAmount(tax + "");
        electricitySubmitVO.setTotalAmount(amount + "");
        electricitySubmitDao.updateEleSubmit_1(electricitySubmitVO);//保存电费提交表
        //写入报销记录(此处不修改报销单状态)
        /*SubmitProcess addProcess = addProcess(createSerialNumber,request);
        int addProcess2 = electricitySubmitDao.addProcess(addProcess);*/
        List<EleMiddleSubmitVO> eleMiddleSubmitVOs = Lists.newArrayList();
        for (String eid : ids) {
            EleMiddleSubmitVO eleMiddleSubmitVO = new EleMiddleSubmitVO();
            eleMiddleSubmitVO.setId(StringUtils.getUUid());
            eleMiddleSubmitVO.setSysElectricityId(eid);
            eleMiddleSubmitVO.setSysEleSubmitId(id);
            eleMiddleSubmitVOs.add(eleMiddleSubmitVO);
        }
        electricitySubmitDao.saveEleMidlleSubmit(eleMiddleSubmitVOs);//保存中间表
        return ResultVO.success(electricitySubmitVO.getId());
    }
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 查询列表
     */
    @Override
    public void queryList(ElectricitySubmitVO electricitySubmitVO, PageUtil<ElectricitySubmitVO> pageUtil) throws ParseException {    	
    	Map<String, Object> parameMap = Maps.newHashMap();
        setMap(parameMap, electricitySubmitVO, pageUtil);
        List<ElectricitySubmitVO> electricitySubmitVOs = electricitySubmitDao.queryList(pageUtil);
    }
    
    @Override
    public void queryListExcel(ElectricitySubmitVO electricitySubmitVO, PageUtil<ElectricitySubmitVO> pageUtil,HttpServletResponse response) throws ParseException {    	
    	Map<String, Object> parameMap = Maps.newHashMap();
        pageUtil.setPageNo(1);
        pageUtil.setPageSize(10000000);
        setMap(parameMap, electricitySubmitVO, pageUtil);
        List<ElectricitySubmitVO> electricitySubmitVOs = electricitySubmitDao.queryListExcel(pageUtil);
        XSSFWorkbook wb = new XSSFWorkbook();//创建表格
		XSSFSheet aSheet = wb.createSheet("报销单信息详情");//创建工作簿
		int a = 0;
		XSSFRow aRow = aSheet.createRow(a);
		aRow.createCell(0,1).setCellValue("电费提交单号");
		aRow.createCell(1,1).setCellValue("制单时间");
		aRow.createCell(2,1).setCellValue("地市");
		aRow.createCell(3,1).setCellValue("区县");
		aRow.createCell(4,1).setCellValue("推送类型");
		aRow.createCell(5,1).setCellValue("报销状态");
		aRow.createCell(6,1).setCellValue("价款金额");
		aRow.createCell(7,1).setCellValue("税金金额");
		String b="";
		for(ElectricitySubmitVO vo : electricitySubmitVOs) {
			System.out.println(vo.getCreateDate());
			a++;
			aRow = aSheet.createRow(a);
			aRow.createCell(0,1).setCellValue(vo.getSubmitNo());
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String dateString = formatter.format(vo.getCreateDate());
			aRow.createCell(1,1).setCellValue(dateString);
			aRow.createCell(2,1).setCellValue(vo.getCity());
			aRow.createCell(3,1).setCellValue(vo.getCounty());
			aRow.createCell(4,1).setCellValue(String.valueOf(vo.getReimbursementType()).equals("0")?"报销":"");
			switch(vo.getStatus()) {
				case 0:
					b="等待报销发起人推送财务";
					break;
				case 1:
					b="等待推送财务";
					break;
				case 2:
					b="等待财务报销";
					break;
				case 3:
					b="报销成功";
					break;
				case 4:
					b="报销失败";
					break;
				case 5:
					b="已撤销";
					break;
			}
			aRow.createCell(5,1).setCellValue(b);
			aRow.createCell(6,1).setCellValue(vo.getTotalAmount());
			aRow.createCell(7,1).setCellValue(vo.getTaxAmount());
		}
		ServletOutputStream out = null;
		try {        
            out = response.getOutputStream();    
            String fileName = "报销单详情.xls";// 文件名    
            response.setContentType("application/x-msdownload");    
            response.setHeader("Content-Disposition", "attachment; filename="    
                                                    + URLEncoder.encode(fileName, "UTF-8"));    
            wb.write(out);    
        } catch (Exception e) {    
            e.printStackTrace();    
        } finally {      
            try {       
                out.close();      
            } catch (IOException e) {      
                e.printStackTrace();    
            }      
        } 
    }

    @Override
    public ResultVO queryDetail(String subID) {
        ElectricitySubmitVO electricitySubmitVO = electricitySubmitDao.queryDetail(subID);
        List<EleMiddleSubmitVO> eleMiddleSubmitVOs = electricitySubmitDao.queryMiddleBySubID(subID);
        List<String> elID = Lists.newArrayList();
        for (EleMiddleSubmitVO middleSubmitVO : eleMiddleSubmitVOs) {
            elID.add(middleSubmitVO.getSysElectricityId());
        }
        List<ElectrictyListVO> electrictyListVOs = inputElectricityService.queryByIDs(elID);
        electricitySubmitVO.setElectrictyListVOs(electrictyListVOs);
        return ResultVO.success(electricitySubmitVO);
    }

    
    
    
    /**
     * @param :
     * @return :
     * @throws
     * @Description: 删除电费提交表
     */
    @Override
    public ResultVO deleteBySubID(String subID) {
        electricitySubmitDao.deleteBySubID(subID);
        electricitySubmitDao.deleteEleMidBySubID(subID);
        return ResultVO.success();
    }

    @Override
    public ResultVO updateStatus(Integer status, String[] ids) {
        if (ids == null || ids.length == 0) {
            return ResultVO.failed("id不能为空！");
        }
        if (status == null) {
            return ResultVO.failed("状态不能为空！");
        }
        String strId = ids[0];
    	String newStrId = strId.substring(0, 2);
    	if("YF".equals(newStrId)){
    		Map<String, Object> map=new HashMap<String,Object>();
    		map.put("status", status);
    		map.put("ids", ids);
    		pDao.updateStatus(map);
    		return ResultVO.success();
    	}else{
    		//报销成功修改预付单：已核销金，流程中核销金，剩余金额
            for(String id:ids){
            	ElectricitySubmitVO esvo = electricitySubmitDao.getCpById(id);
            	//获得供应商
            	if(esvo!=null){
            		//String supplyId = esvo.getSupplyId();
                	//获得电表与电表提交表中间表
                	EleMiddleSubmitVO emsvo = electricitySubmitDao.getEidBEsId(id);
                	//获得电表
                	ElectrictyVO evo = inputElectricityService.getCpById(emsvo.getSysElectricityId());
                	//获得报销成功的预付核销金
                	String expenseTotalAmount = evo.getExpenseTotalAmount();
                	
                	if(expenseTotalAmount != null && !expenseTotalAmount.equals("") && Double.parseDouble(expenseTotalAmount)!=0) {
                		 //查看稽核单对应的多个预付单的中间表
        				List<EleMidPaymentVO> eleMidPayments = eleMidPaymentDao.getEleMidPaymentByEleID(esvo.getId());
        				//处理每一个预付单
        				for(EleMidPaymentVO eleMidPayment : eleMidPayments) {
        					//获取预付单id
        					String paymentID = eleMidPayment.getAdvancePaymentID();
        					//中间表中记录的核销金额
        					double expenseAmount = Double.parseDouble(eleMidPayment.getExpenseAmount());
        					
        					//查询预付单信息
        					AdvancePaymentVo advpm = adpvDao.getOneById(paymentID);
        					//该预付单当前的流程中金额
        					double cancellingMoney_new = Double.parseDouble(advpm.getCancellingMoney());
        					//该预付单已经核销的金额
        					double canceledMoney_new = Double.parseDouble(advpm.getCanceledMoney());
        					
        					AdvancePaymentVo newAdpv=new AdvancePaymentVo();//构建一个新的预付单用来修改原预付单
        					newAdpv.setId(advpm.getId());//复制预付单的id
        					newAdpv.setCancellingMoney(String.valueOf(cancellingMoney_new - expenseAmount));//流程中的金额减少
        					newAdpv.setCanceledMoney(String.valueOf(canceledMoney_new + expenseAmount));//已核销的金额增加
        					adpvDao.updatePayment(newAdpv);//更新预付单的数据
        				}
                	}
					                	/*//查找该经办人的预付单
					                	Map<String, String> map=new HashMap<String,String>();
					                	map.put("supplyId", supplyId);
					                	//获得预付单
					                	AdvancePaymentVo apv = adpvDao.getOneByUserId(map);
					                	if(apv!=null){
					                		//预付单中已核销的金额
					                    	String canceledMoney = apv.getCanceledMoney();  
					                    	//预付单中正在核销的金
					                    	String cancellingMoney = apv.getCancellingMoney();
					                    	//预付单中剩余的金
					                    	String surplusMoney = apv.getSurplusMoney();
					                    	AdvancePaymentVo newAdpv=new AdvancePaymentVo();
					                    	newAdpv.setId(apv.getId());
					                    	if(canceledMoney!=null && !"0.0".equals(canceledMoney)){
					                    		Double add = DoubleUtil.add(Double.parseDouble(canceledMoney), Double.parseDouble(expenseTotalAmount));
					                    		newAdpv.setCanceledMoney(String.valueOf(add));
					                    	}else{
					                    		newAdpv.setCanceledMoney(expenseTotalAmount);
					                    	}
					                    	double sub = DoubleUtil.sub(Double.parseDouble(cancellingMoney), Double.parseDouble(expenseTotalAmount));
					                    	newAdpv.setCancellingMoney(String.valueOf(sub));
					                    	adpvDao.updatePayment(newAdpv);
					                	}*/
            	}
            }
            Map<String, Object> map = Maps.newHashMap();
            map.put("status", status);
            map.put("ids", ids);
            electricitySubmitDao.updateStatus(map);
            return ResultVO.success();
    	}
        
    }

    private void setMap(Map<String, Object> parameMap, ElectricitySubmitVO electricitySubmitVO, PageUtil<ElectricitySubmitVO> pageUtil) throws ParseException {
       //如果提交号不为空
    	if (electricitySubmitVO.getSubmitNo() != null && !"".equals(electricitySubmitVO.getSubmitNo())) {
    		//设置提交号
            parameMap.put("submitNo", electricitySubmitVO.getSubmitNo());
        }
    	//状态
        if (electricitySubmitVO.getStatus() != null) {
            parameMap.put("status", electricitySubmitVO.getStatus() + "");
        }
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        if (electricitySubmitVO.getStartCreateDate() != null && !"".equals(electricitySubmitVO.getStartCreateDate())) {
            parameMap.put("startTime", format.parse(electricitySubmitVO.getStartCreateDate()));
        }
        if (electricitySubmitVO.getEndCreateDate() != null && !"".equals(electricitySubmitVO.getEndCreateDate())) {
            parameMap.put("endTime", format.parse(electricitySubmitVO.getEndCreateDate()));
        }
        	//查看是否有经办人
		if (!StringUtils.isEmpty(electricitySubmitVO.getTrustees())) {
			parameMap.put("trustees", electricitySubmitVO.getTrustees());
		}
        pageUtil.setObj(parameMap);
    }

    /**
	 * 通过流水号更新提交单状态值
	 * 
	 * @param status 状态值
	 * @param submitNos 电费提交单号
	 * @return 更新结果
	 */
	@Override
	public ResultVO updateStatusByNo(Integer status, String[] submitNos) {
		if (submitNos == null || submitNos.length == 0) {
			return ResultVO.failed("电费提交单号不能为空！");
		}
		if (status == null) {
			return ResultVO.failed("状态不能为空！");
		}
		Map<String, Object> map = Maps.newHashMap();
		map.put("status", status);
		map.put("submitNos", submitNos);
		electricitySubmitDao.updateStatusByNo(map);
		return ResultVO.success();
	}

	/**
	 * 通过稽核单号查询
	 * 
	 * @param submitNo 稽核单号
	 * @return 电费提交单
	 */
	@Override
	public ElectricitySubmitVO queryBysubmitNo(String submitNo) {
		return electricitySubmitDao.queryBysubmitNo(submitNo);
	}

	@Override
	public ElectricitySubmitVO getCpById(String id) {
		ElectricitySubmitVO cpById = electricitySubmitDao.getCpById(id);
		return cpById;
	}

	@Override
	public EleMiddleSubmitVO getEidBEsId(String sysEleSubmitId) {
		EleMiddleSubmitVO eidBEsId = electricitySubmitDao.getEidBEsId(sysEleSubmitId);
		return eidBEsId;
	}

	@Override
	public List<WatthourExtendVO> getMt(String sid) {
		List<WatthourExtendVO> mt = electricitySubmitDao.getMt(sid);
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		if(mt !=null){
			for(int i=0;i<mt.size();i++){
				if(mt.get(i)!=null){
					Date belongEndTime = mt.get(i).getBelongEndTime();
					String format = sdf.format(belongEndTime);
					mt.get(i).setBelongEndTimeS(format);
				}
			}
		}
		return mt;
	}
	
	//写入报销流程
	public SubmitProcess addProcess(String createSerialNumber,HttpServletRequest request){
		SubmitProcess sp=new SubmitProcess();
		sp.setId(StringUtils.getUUid().replace("-", ""));
		sp.setSubmitId(createSerialNumber);
		HttpSession session = request.getSession();
		UserVo user= (UserVo)session.getAttribute("user");
		sp.setAccount(user.getAccount());
		sp.setNickName(user.getNickName()==null?"":user.getNickName());
		sp.setUserName(user.getUserName());
		sp.setMobile(user.getMobile()==null?"":user.getMobile());
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		String format = sdf.format(date);
		sp.setTime(format);
		//0.生成报销单1.已推送到报销发起人 2.等报销 3. 报销成功 4. 报销失败 5. 已撤销
		sp.setStatus(0);
		return sp;
	}

	@Override
	public int addProcess(SubmitProcess sp) {
		int addProcess = electricitySubmitDao.addProcess(sp);
		return addProcess;
	}

	@Override
	public List<SubmitProcess> getProcessBySI(String submitId) {
		List<SubmitProcess> processBySI = electricitySubmitDao.getProcessBySI(submitId);
		return processBySI;
	}

	@Override
	public ElectricitySubmitVO queryById(String id) {
		ElectricitySubmitVO queryById = electricitySubmitDao.queryById(id);
		return queryById;
	}
}
