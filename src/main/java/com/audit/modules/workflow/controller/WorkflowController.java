package com.audit.modules.workflow.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.audit.filter.exception.CommonException;
import com.audit.modules.common.DoubleUtil;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.dict.FlowConstant;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.electricity.entity.AuditElectrictySaveVO;
import com.audit.modules.electricity.entity.ElectricityFlowVo;
import com.audit.modules.electricity.entity.ElectricitySubmitVO;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.electricity.entity.ElectrictySaveVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.electricity.entity.SubmitProcess;
import com.audit.modules.electricity.service.ElectricitySubmitService;
import com.audit.modules.electricity.service.InputElectricityService;
import com.audit.modules.payment.dao.AdvancePaymentDao;
import com.audit.modules.payment.dao.EleMidPaymentDao;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.payment.entity.EleMidPaymentVO;
import com.audit.modules.payment.service.AdvancePaymentService;
import com.audit.modules.payment.service.PreSubmitService;
import com.audit.modules.supplier.service.SupplierService;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.audit.modules.workflow.entity.FlowSetpVo;
import com.audit.modules.workflow.service.AuditWorkflowService;
import com.audit.modules.workflow.service.PrepayWorkflowService;
import com.audit.modules.workflow.service.ZAuditWorkflowService;

/**
 * 流程处理
 *
 * @author ly
 * @date 2017年3月11日 下午1:08:13
 */
@Controller
@RequestMapping("/workflow")
public class WorkflowController {

    /**
     * 日志
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(WorkflowController.class);

    @Autowired
    private InputElectricityService inputElectricityService;

    @Autowired
    private AuditWorkflowService workflowService;
    @Autowired
    private ZAuditWorkflowService zworkflowService;
    
    @Autowired
	private AdvancePaymentDao adpvDao;
    
    @Autowired
    private PrepayWorkflowService pwfService;
    
    @Autowired
    private PrepayWorkflowService pWorkflowService;
    
    @Autowired
	private EleMidPaymentDao eleMidPaymentDao;
    
    @Autowired
    private ElectricitySubmitService electricitySubmitService;
    
    @Autowired
    private PreSubmitService psSubmitService;
    @Autowired
    private AdvancePaymentService adpvService;
    @Autowired
    private SupplierService suService;

    /**
     * 初始化界面
     *
     * @param model  model
     * @param userId 用户ID
     * @return 逻辑视图
     */
    @RequestMapping("init")
    public String init(Model model, HttpServletRequest request) {
        return "workflow/init";
    }

    /**
     * 启动流程
     *
     * @param request httpRequest
     */
    @RequestMapping("start")
    public void start(HttpServletRequest request) {
		workflowService.startFlow("1");
    }

    /**
     * 查询流程
     *
     * @param request httpQuest
     * @param page    分页
     * @return 结果
     */
    @RequestMapping("queryFlow")
    @ResponseBody
	public ResultVO queryFlow(HttpServletRequest request, ElectricityFlowVo flowVo, @SuppressWarnings("rawtypes") PageUtil page) {
		// 处理时间
		if (!StringUtils.isEmpty(flowVo.getqEndTime())) {
			GregorianCalendar gc = new GregorianCalendar();
			gc.setTime(flowVo.getqEndTime());
			gc.add(5, 1);
			flowVo.setqEndTime(gc.getTime());
		}
    	
    	try {
			// 当前登录人
			UserVo user = getLoginUser(request);
			flowVo.setCurOpUserID(user.getUserId());
			if("admin".equals(user.getAccount())){
				workflowService.queryTaskByUser11(request,flowVo, page);
			}else{
				// 涉及的流程
				workflowService.queryTaskByUser(request,flowVo, page);
			}
			
		} catch (CommonException e) {
			LOGGER.error("query error!", e.getMessage());
		}
		return ResultVO.success(page);
	}
    
    
    /**
     * 电费稽核导出excel
     */
    @RequestMapping("/queryFlowExportExcel")
    @ResponseBody
    public ResultVO queryFlowExportExcel(HttpServletRequest request,HttpServletResponse response,ElectricityFlowVo flowVo) {
    	// 处理时间
		if (!StringUtils.isEmpty(flowVo.getqEndTime())) {
			GregorianCalendar gc = new GregorianCalendar();
			gc.setTime(flowVo.getqEndTime());
			gc.add(5, 1);
			flowVo.setqEndTime(gc.getTime());
		}
		try {
			// 当前登录人
			UserVo user = getLoginUser(request);
			flowVo.setCurOpUserID(user.getUserId());
			if("admin".equals(user.getAccount())){
				workflowService.queryTaskByUser11Excel(request,response,flowVo);
			}else{
				// 涉及的流程
				workflowService.queryTaskByUserExcel(request,response,flowVo);
			}
			
		} catch (CommonException e) {
			LOGGER.error("query error!", e.getMessage());
		}
		return ResultVO.success("");
    }
    
    
    
    /**
     * 查询综合流程
     *
     * @param request httpQuest
     * @param page    分页
     * @return 结果
     */
    @RequestMapping("queryZFlow")
    @ResponseBody
	public ResultVO queryZFlow(HttpServletRequest request, ElectricityFlowVo flowVo, @SuppressWarnings("rawtypes") PageUtil page) {
		// 处理时间
		if (!StringUtils.isEmpty(flowVo.getqEndTime())) {
			GregorianCalendar gc = new GregorianCalendar();
			gc.setTime(flowVo.getqEndTime());
			gc.add(5, 1);
			flowVo.setqEndTime(gc.getTime());
		}
    	
    	try {
			// 当前登录人
			UserVo user = getLoginUser(request);
			flowVo.setCurOpUserID(user.getUserId());
			
			if("admin".equals(user.getAccount())){
				// 涉及的流程
				zworkflowService.queryTaskByUser11(flowVo, page);
			}else{
				// 涉及的流程
				zworkflowService.queryTaskByUser(request,flowVo, page);
			}
			
			
			// 涉及的流程
			zworkflowService.queryTaskByUser(request,flowVo, page);
		} catch (CommonException e) {
			LOGGER.error("query error!", e.getMessage());
		}
		return ResultVO.success(page);
	}
    
    
    
    
    /**
     * 查询预付流程
     *
     * @param request httpQuest
     * @param page    分页
     * @return 结果
     */
    @RequestMapping("queryPrepayFlow")
    @ResponseBody
	public ResultVO queryPrepayFlow(HttpServletRequest request, com.audit.modules.payment.entity.ElectricityFlowVo flowVo, @SuppressWarnings("rawtypes") PageUtil page) {
		// 处理时间
		if (!StringUtils.isEmpty(flowVo.getqEndTime())) {
			GregorianCalendar gc = new GregorianCalendar();
			gc.setTime(flowVo.getqEndTime());
			gc.add(5, 1);
			flowVo.setqEndTime(gc.getTime());
		}
    	
    	try {
			// 当前登录人
			UserVo user = getLoginUser(request);
			flowVo.setCurOpUserID(user.getUserId());
			if("admin".equals(user.getAccount())){

				// 涉及的流程
				pWorkflowService.queryTaskByUser11(flowVo, page);
			}else{

				// 涉及的流程
				pWorkflowService.queryTaskByUser(flowVo, page);
			}
			
			
			
		} catch (CommonException e) {
			LOGGER.error("query error!", e.getMessage());
		}
		return ResultVO.success(page);
	}
    
    
    

    /**
     * 审批流程
     *
     * @param request httpQuest
     * @param flow    是否通过
     * @return 审批结果
     */
    @RequestMapping("approve")
    @ResponseBody
    public ResultVO approve(HttpServletRequest request, ElectricityFlowVo flow) {
        ResultVO rs = null;
        try {
            // 当前登录人
            UserVo user = getLoginUser(request);
            // 审批流程
            System.out.println("进入审批流程");
            workflowService.auditElectricityFlow(user.getUserId(), flow);
            rs = ResultVO.success();
        } catch (CommonException e) {
            rs = ResultVO.failed(e.getMessage());
        }
        return rs;
    }
    
    
    
    
    /**
     * 综合审批流程
     *
     * @param request httpQuest
     * @param flow    是否通过
     * @return 审批结果
     */
    @RequestMapping("approvez")
    @ResponseBody
    public ResultVO approvez(HttpServletRequest request, ElectricityFlowVo flow) {
        ResultVO rs = null;
        try {
            // 当前登录人
            UserVo user = getLoginUser(request);
            // 审批流程
            System.out.println("进入审批流程");
            zworkflowService.auditElectricityFlow(user.getUserId(), flow);
            rs = ResultVO.success();
        } catch (CommonException e) {
            rs = ResultVO.failed(e.getMessage());
        }
        return rs;
    }
    
    
    
    
    /**
     * 预付审批流程
     *
     * @param request httpQuest
     * @param flow    是否通过
     * @return 审批结果
     */
    @RequestMapping("approvepre")
    @ResponseBody
    public ResultVO approvepre(HttpServletRequest request, com.audit.modules.payment.entity.ElectricityFlowVo flow) {
        ResultVO rs = null;
        try {
            // 当前登录人
            UserVo user = getLoginUser(request);
            // 审批流程
            pwfService.auditElectricityFlow(user.getUserId(), flow);
            rs = ResultVO.success();
        } catch (CommonException e) {
            rs = ResultVO.failed(e.getMessage());
        }
        return rs;
    }

    /**
     * 批量审批
     *
     * @param request httpRequest
     * @param flows   流程
     * @return 审批结果
     */
    @RequestMapping("approveList")
    @ResponseBody
    public ResultVO approveList(HttpServletRequest request, @RequestBody List<ElectricityFlowVo> flows) {
        ResultVO rs = null;
        StringBuilder sb = new StringBuilder();
        // 当前登录人
        UserVo user = getLoginUser(request);
        for (ElectricityFlowVo flow : flows) {
            try {
                workflowService.auditElectricityFlow(user.getUserId(), flow);
                // 审批流程
            } catch (CommonException e) {
                ElectrictyVO electrictyVO = inputElectricityService.findOneByID(flow.getBusinessKey());
                String serialNumber = electrictyVO.getSerialNumber();
                sb.append("流水单：");
                sb.append(serialNumber);
                sb.append(",");
                sb.append(e.getMessage());
            }
        }
        // 部分失败
        if (!StringUtils.isEmpty(sb.toString())) {
            rs = ResultVO.failed(sb.toString());
        } else {
            rs = ResultVO.success();
        }
        return rs;
    }
    
    
    
    
    /**
     * 批量提交(预付)审批
     *
     * @param request httpRequest
     * @param flows   流程
     * @return 审批结果
     */
    @RequestMapping("approvePreList")
    @ResponseBody
    public ResultVO approvePList(HttpServletRequest request, @RequestBody List<com.audit.modules.payment.entity.ElectricityFlowVo> flows) {
        ResultVO rs = null;
        StringBuilder sb = new StringBuilder();
        // 当前登录人
        UserVo user = getLoginUser(request);
        for (com.audit.modules.payment.entity.ElectricityFlowVo flow : flows) {
            try {
            	pWorkflowService.auditElectricityFlow(user.getUserId(), flow);
                // 审批流程
            } catch (CommonException e) {
                AdvancePaymentVo adpv = adpvService.getOneById(flow.getBusinessKey());
                String serialNumber = adpv.getPaymentNumber();
                sb.append("流水单：");
                sb.append(serialNumber);
                sb.append(",");
                sb.append(e.getMessage());
            }
        }
        // 部分失败
        if (!StringUtils.isEmpty(sb.toString())) {
            rs = ResultVO.failed(sb.toString());
        } else {
            rs = ResultVO.success();
        }
        return rs;
    }
    
    
    

    /**
     * 撤销流程
     *
     * @param instanceId 流程ID
     * @param reason     撤销原因
     * @return 撤销结果
     */
    @RequestMapping("deleteTask")
    @ResponseBody
    public ResultVO deleteTask(String instanceId, String reason,String serialNumber) {
    	//先获取计核单id
    	ElectrictyVO electrictyVo = inputElectricityService.getCpBySerNum(serialNumber);
    	String id = electrictyVo.getId();
    	
		//根据电费单id查报账点id
		String getaccoutsiteidbyeleid = inputElectricityService.getaccoutsiteidbyeleid(id);
		//根据报账点id查对应报账点电费最新终止时间
		WatthourMeterVO getnewtime = inputElectricityService.getnewtime(getaccoutsiteidbyeleid);
		//查这次删除电费单中的终止时间有没有最新的那个时间，没有就不让删除
		WatthourMeterVO getelenewtime = inputElectricityService.getelenewtime(id);
		if(getelenewtime!=null&&getnewtime!=null&&getelenewtime.getBelongEndTime()!=null &&getnewtime.getBelongEndTime()!=null){
			if(getelenewtime.getBelongEndTime().getTime()!=getnewtime.getBelongEndTime().getTime()){
				throw new CommonException("请先移出电表归属日期最新的稽核单");
			}
		}

    	
    	
        ResultVO rs = null;
        try {
            workflowService.deleteTask(instanceId, reason);
            Map<String, String> map=new HashMap<String,String>();
            ElectrictyVO evo = inputElectricityService.getCpBySerNum(serialNumber);
            //流程中核销金额
            String expenseTotalAmount = evo.getExpenseTotalAmount();
            if(expenseTotalAmount != null && !expenseTotalAmount.equals("") && Double.parseDouble(expenseTotalAmount)!=0) {
            	 //查看稽核单对应的多个预付单的中间表
				List<EleMidPaymentVO> eleMidPayments = eleMidPaymentDao.getEleMidPaymentByEleID(evo.getId());
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
					//该预付单当前的剩余金额
					double surplusMoney_new = Double.parseDouble(advpm.getSurplusMoney());
					
					AdvancePaymentVo newAdpv=new AdvancePaymentVo();//构建一个新的预付单用来修改原预付单
					newAdpv.setId(advpm.getId());//复制预付单的id
					newAdpv.setCancellingMoney(String.valueOf(cancellingMoney_new - expenseAmount));//流程中的金额减少
					newAdpv.setSurplusMoney(String.valueOf(surplusMoney_new + expenseAmount)); //可使用的剩余金额增加
					adpvDao.updatePayment(newAdpv);//更新预付单的数据
				}
            }
							           /* String code =String.valueOf(suService.getCodeById(evo.getSupplierID())) ;
							            map.put("supplyId",code);
							            AdvancePaymentVo adpv = adpvService.getOneByUserId(map);
							            if(adpv!=null){
							            	 //更新最新流程中核销金
							            	Double sub=null;
							            	Double add=null;
							            	if(adpv.getCancellingMoney()!=null &&adpv.getSurplusMoney()!=null){
							            		  sub = DoubleUtil.sub(Double.parseDouble(adpv.getCancellingMoney()), Double.parseDouble(expenseTotalAmount));
							            		  add = DoubleUtil.add(Double.parseDouble(adpv.getSurplusMoney()), Double.parseDouble(expenseTotalAmount));
							            	}
							                AdvancePaymentVo newAdpv=new AdvancePaymentVo();
							                //设置最新的流程中金额和剩余金额
							                newAdpv.setCancellingMoney(String.valueOf(sub));
							                newAdpv.setSurplusMoney(String.valueOf(add));
							                newAdpv.setId(adpv.getId());
							                adpvService.updatePayment(newAdpv);
							            }*/
            rs= ResultVO.success("撤销成功");
        } catch (CommonException e) {
            rs = ResultVO.failed(e.getMessage());
        }
        return rs;
    }
    
    
    
    
    /**
     * 综合撤销流程
     *
     * @param instanceId 流程ID
     * @param reason     撤销原因
     * @return 撤销结果
     */
    @RequestMapping("deleteZTask")
    @ResponseBody
    public ResultVO deleteZTask(String instanceId, String reason,String serialNumber) {
        ResultVO rs = null;
        try {
            zworkflowService.deleteTask(instanceId, reason);
            rs= ResultVO.success("撤销成功");
        } catch (CommonException e) {
            rs = ResultVO.failed(e.getMessage());
        }
        return rs;
    }
    
    
    
    
    /**
     * 预付撤销流程
     *
     * @param instanceId 流程ID
     * @param reason     撤销原因
     * @return 撤销结果
     */
    @RequestMapping("deleteTaskpre")
    @ResponseBody
    public ResultVO deleteTaskpre(String instanceId, String reason,String paymentNumber) {
        ResultVO rs = null;
        try {
            pwfService.deleteTask(instanceId, reason);
            //删除预付单
            adpvService.delPreByPaymetNumber(paymentNumber);
            rs = ResultVO.success();
        } catch (CommonException e) {
            rs = ResultVO.failed(e.getMessage());
        }
        return rs;
    }
    
    
    
    
    @RequestMapping("deleteTaskList")
    @ResponseBody
	public ResultVO deleteTaskList(String[] instanceIds, String reason) {
		for (String instanceId : instanceIds) {
			workflowService.deleteTask(instanceId, reason);
		}
		return ResultVO.success();
	}
    
    //预付批量撤销（删除）
    @RequestMapping("deletePreTaskList")
    @ResponseBody
	public ResultVO deletePreTaskList(String[] instanceIds, String reason,String[] paymentNumbers) {
    	for(int i=0;i<paymentNumbers.length;i++){
    		 //删除预付单
            adpvService.delPreByPaymetNumber(paymentNumbers[i]);
    	}
		for (String instanceId : instanceIds) {
			pWorkflowService.deleteTask(instanceId, reason);
		}
		return ResultVO.success();
	}
    

    /**
     * 修改
     *
     * @param instanceId 流程ID
     * @param vo         更新实体
     * @RequestBody AuditElectrictySaveVO vo
     */
    @RequestMapping("updateTask")
    @ResponseBody
	public ResultVO updateTask(String str) {
    	AuditElectrictySaveVO vo=new AuditElectrictySaveVO();
		ResultVO rs = null;
		try {
			 vo = JSON.parseObject(str, AuditElectrictySaveVO.class);
			workflowService.updateTask(vo.getInstanceId(), vo);
			rs = ResultVO.success();
		} catch (CommonException e) {
			rs = ResultVO.failed(e.getMessage());
		}
		return rs;
	}
    
    
    
    /**
     * 预付修改
     *
     * @param instanceId 流程ID
     * @param vo         更新实体
     */
    @RequestMapping("updatePreTask")
    @ResponseBody
	public ResultVO updatePreTask(@RequestBody AuditElectrictySaveVO vo) {
		ResultVO rs = null;
		try {
			workflowService.updateTask(vo.getInstanceId(), vo);
			rs = ResultVO.success();
		} catch (CommonException e) {
			rs = ResultVO.failed(e.getMessage());
		}
		return rs;
	}

    /**
     * 查询电费提交单数据
     * 
     * @param request request请求
     * @param electricitySubmitVO
     * @param page 分页参数
     * @return
     */
    @RequestMapping("querySendInfo")
    @ResponseBody
	public ResultVO querySendInfo(HttpServletRequest request, ElectricitySubmitVO electricitySubmitVO,
			PageUtil<ElectricitySubmitVO> page) {
		Integer operationState = -1;
		// 登录人为经办人，则直接查询经办人的待办信息
		try {
			Subject subject = SecurityUtils.getSubject();
			//区县公司自维报销发起人
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			operationState = 1;
		} catch (AuthorizationException e) {
			operationState = 0;
			UserVo user = getLoginUser(request);
			//设置经办人id
			electricitySubmitVO.setTrustees(user.getUserId());
		}
		// 查询
		try {
			electricitySubmitService.queryList(electricitySubmitVO, page);
			for (ElectricitySubmitVO vo : page.getResults()) {
				if (vo.getStatus() == operationState) {
					vo.setOperation(true);
				} else {
					vo.setOperation(false);
				}
			}
		} catch (ParseException e) {
			Log.error(e);
		}
		return ResultVO.success(page);
	}
    
    @RequestMapping("querySendInfoExcel")
    @ResponseBody
	public ResultVO querySendInfoExcel(HttpServletRequest request, ElectricitySubmitVO electricitySubmitVO,
			PageUtil<ElectricitySubmitVO> page,HttpServletResponse response) {
		Integer operationState = -1;
		// 登录人为经办人，则直接查询经办人的待办信息
		try {
			Subject subject = SecurityUtils.getSubject();
			//区县公司自维报销发起人
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			operationState = 1;
		} catch (AuthorizationException e) {
			operationState = 0;
			UserVo user = getLoginUser(request);
			//设置经办人id
			electricitySubmitVO.setTrustees(user.getUserId());
		}
		// 查询
		try {
			electricitySubmitService.queryListExcel(electricitySubmitVO, page,response);
			
		} catch (ParseException e) {
			Log.error(e);
		}
		return ResultVO.success("");
	}
    
    
    /**
     * 查询预付提交账务单数据(提交账务列表显示)
     * 
     * @param request request请求
     * @param electricitySubmitVO
     * @param page 分页参数
     * @return
     */
    @RequestMapping("queryPreSendInfo")
   	@ResponseBody
	public ResultVO queryPreSendInfo(HttpServletRequest request, com.audit.modules.payment.entity.ElectricitySubmitVO electricitySubmitVO,
			PageUtil<com.audit.modules.payment.entity.ElectricitySubmitVO> page) {
		Integer operationState = -1;
		// 登录人为经办人，则直接查询经办人的待办信息
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			operationState = 1;
		} catch (AuthorizationException e) {
			operationState = 0;
			UserVo user = getLoginUser(request);
			//设置经办人id
			electricitySubmitVO.setTrustees(user.getUserId());
		}
		// 查询
		try {
			//查询预付提交表列表
			psSubmitService.queryList(electricitySubmitVO, page);
			for (com.audit.modules.payment.entity.ElectricitySubmitVO vo : page.getResults()) {
				if (vo.getStatus() == operationState) {
					//设置是否具有操作权限
					vo.setOperation(true);
				} else {
					vo.setOperation(false);
				}
			}
		} catch (ParseException e) {
			Log.error(e);
		}
		return ResultVO.success(page);
	}

    
    
    
    

    /**
     * 发送结果给创建人
     *
     * @param vo 实体
     * @return 处理结果
     */
    @RequestMapping("sendOut")
    @ResponseBody
	public ResultVO sendOut(HttpServletRequest request,String id) {
		// 登录人为经办人，则流程提交为"已推送"
		Integer state = null;
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			state = 2;
		} catch (AuthorizationException e) {
			state = 1;
		}
		
		// 推送
		try {
			String[] ids=new String[] { id };
			workflowService.sendOut(ids, state);
			//写入报销流程
			for(String idd:ids){
				SubmitProcess sp=new SubmitProcess();
				ElectricitySubmitVO queryById = electricitySubmitService.queryById(idd);
				sp.setSubmitId(queryById.getSubmitNo());
				sp.setId(UUID.randomUUID().toString().replace("-", ""));
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
				sp.setStatus(state);
				electricitySubmitService.addProcess(sp);
			}
			return ResultVO.success();
		} catch (CommonException e) {
			return ResultVO.failed(e.getMessage());
		} catch (Exception ex) {
			LOGGER.error("推送失败！", ex);
			return ResultVO.failed("推送失败！");
		}
	}
    
    
    
    
    /**
     * 预付发送结果给创建人
     *
     * @param vo 实体
     * @return 处理结果
     */
    @RequestMapping("sendPreOut")
    @ResponseBody
	public ResultVO sendPreOut(String id) {
		// 登录人为经办人，则流程提交为"已推送"
		Integer state = null;
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			state = 2;
		} catch (AuthorizationException e) {
			state = 1;
		}
		
		// 推送
		try {
			pwfService.sendOut(new String[] { id }, state);
			return ResultVO.success();
		} catch (CommonException e) {
			return ResultVO.failed(e.getMessage());
		} catch (Exception ex) {
			LOGGER.error("推送失败！", ex);
			return ResultVO.failed("推送失败！");
		}
	}
    
    
    
    
    
	/**
	 * 批量处理（推送）
	 * 
	 * @param IDS
	 * @return
	 */
    @RequestMapping("batchSendOut")
    @ResponseBody
	public ResultVO batchSendOut(String[] ids) {
		// 登录人为经办人，则流程提交为"已推送"
		Integer state = null;
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			state = 2;
		} catch (AuthorizationException e) {
			state = 1;
		}

		// 推送
		try {
			workflowService.sendOut(ids, state);
			return ResultVO.success();
		} catch (CommonException e) {
			return ResultVO.failed(e.getMessage());
		} catch (Exception ex) {
			LOGGER.error("推送失败！", ex);
			return ResultVO.failed("推送失败！");
		}
	}

	/**
	 * 报销成功
	 * 
	 * @param ids 生成单ID数组
	 * @return 操作结果
	 */
    @RequestMapping("reimbursementSuccess")
    @ResponseBody
	public ResultVO reimbursementSuccess(String[] ids) {
		return electricitySubmitService.updateStatus(3, ids);
	}
	
	/**
	 * 报销失败
	 * 
	 * @param ids 生成单ID数组
	 * @return 操作结果
	 */
	@RequestMapping("reimbursementFailure")
	@ResponseBody
	public ResultVO reimbursementFailure(String[] ids) {
		return electricitySubmitService.updateStatus(4, ids);
	}
	
	/**
	 * 报销撤销
	 * 
	 * @param ids 生成单ID数组
	 * @return 操作结果
	 */
	@RequestMapping("reimbursementCance")
	@ResponseBody
	public ResultVO reimbursementCance(String[] ids) {
		return electricitySubmitService.updateStatus(5, ids);
	}
    
    /**
     * 获取当前用户
     *
     * @param request httpRuquest
     * @return 用户
     */
    private UserVo getLoginUser(HttpServletRequest request) {
        Object userStr = request.getSession().getAttribute("userInfo");
        if (userStr == null) {
            throw new CommonException("请先登录！");
        }
        return JsonUtil.valueOf(userStr.toString(), UserVo.class);
    }
    
	/**
	 * 查询流程的审批过程
	 * 
	 * @param instanceId 流程ID
	 * @return 流程的审批过程
	 */
	@RequestMapping("queryApprovalDetails")
	@ResponseBody
	public ResultVO queryApprovalDetails(String instanceId) {
		return ResultVO.success(workflowService.queryApprovalDetails(instanceId));
	}
	
	/**
	 * 统计待办事项(登录登录)
	 * 
	 * @return 查询结果状态
	 */
	@RequestMapping("queryOperatorNum")
	@ResponseBody
	public ResultVO queryOperatorNum(HttpServletRequest request) {
		ResultVO rs = null;
		try {
			// 当前登录人
			UserVo user = getLoginUser(request);
			Integer number = workflowService.queryOperatorNum(user.getUserId());
			rs = ResultVO.success(number);
		} catch (CommonException e) {
			rs = ResultVO.failed(e.getMessage());
		}
		return rs;
	}
	
	/**
	 * @return
	 */
	public ResultVO queryFlowInfo(HttpServletRequest request, String busId) {
		ResultVO rs = null;
		try {
			System.out.println("queryFlowInfo busId=" + busId);
			ElectricityFlowVo info = workflowService.queryFlowInfo(busId);
			rs = ResultVO.success(info);
		} catch (CommonException e) {
			rs = ResultVO.failed(e.getMessage());
		}
		return rs;
	}
	
	/**
	 * 查询待生成电费提交单记录
	 * 
	 * @param request request
	 * @param pageUtil 分页
	 * @return 结果状态
	 */
	@RequestMapping("queryGenerated")
	@ResponseBody
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public ResultVO queryGenerated(HttpServletRequest request, PageUtil pageUtil) {
		ResultVO rs = null;
		try {
			// 当前登录人
			UserVo user = getLoginUser(request);
			ElectrictyVO electrictyVO = new ElectrictyVO();
			electrictyVO.setStatuses(new String[] { "2" });
			inputElectricityService.queryList(pageUtil, electrictyVO, user);
			rs = ResultVO.success(pageUtil);
		} catch (CommonException e) {
			rs = ResultVO.failed(e.getMessage());
		}
		return rs;
	}
	
	/**
	 * 统计首页电子提交单待办数
	 * 
	 * @return
	 */
	@RequestMapping("queryElectricityApproval")
	@ResponseBody
	public ResultVO queryElectricityApproval() {
		ResultVO rs = null;
		ElectricitySubmitVO vo = new ElectricitySubmitVO();
		PageUtil<ElectricitySubmitVO> pageUtil = new PageUtil<>();
		// 登录人为经办人，则直接查询经办人的待办信息
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(FlowConstant.FLOW_BX_ROLE);
			vo.setStatus(1);
		} catch (AuthorizationException e) {
			vo.setStatus(0);
		}
		try {
			electricitySubmitService.queryList(vo, pageUtil);
			rs = ResultVO.success(pageUtil.getTotalRecord());
		} catch (ParseException e) {
			rs = ResultVO.failed("");
		}
		
		return rs;
	}
	
	/**
	 * 查询流转图信息
	 * 
	 * @param instanceId 流程ID
	 * @return 流转图信息
	 */
	@RequestMapping("queryFlowChart")
	@ResponseBody
	public ResultVO queryFlowChart(String instanceId) {
		List<FlowSetpVo> setps = workflowService.queryFlowChart(instanceId);
		return ResultVO.success(setps);
	}
	
	/**
	 * 预付查询流转图信息
	 * 
	 * @param instanceId 流程ID
	 * @return 流转图信息
	 */
	@RequestMapping("queryFlowChartByPay")
	@ResponseBody
	public ResultVO queryFlowChartByPay(String instanceId) {
		List<FlowSetpVo> setps = workflowService.queryFlowChartByPay(instanceId);
		return ResultVO.success(setps);
	}
	
	
	/**
	 * 统计区县信息
	 * 
	 * @return 统计信息
	 */
	@RequestMapping("statisticsCountInfo")
	@ResponseBody
	public ResultVO statisticsCountInfo() {
		List<Map<String, String>> result = workflowService.statisticsCountInfo();
		return ResultVO.success(result);
	}
}
