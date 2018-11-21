package com.audit.modules.workflow.service.impl;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamReader;

import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.audit.filter.exception.CommonException;
import com.audit.modules.basedata.service.WhiteMgService;
import com.audit.modules.common.dict.FlowConstant;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.sms.SmsUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.electricity.dao.ElectricitySubmitDao;
import com.audit.modules.electricity.entity.EleMiddleSubmitVO;
import com.audit.modules.electricity.entity.ElectricityFlowVo;
import com.audit.modules.electricity.entity.ElectricitySubmitVO;
import com.audit.modules.electricity.entity.ElectrictySaveVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.electricity.service.ElectricitySubmitService;
import com.audit.modules.electricity.service.InputElectricityService;
import com.audit.modules.electricity.vo.ElectricityBenchmarkCheckVO;
import com.audit.modules.site.service.BenchmarkService;
import com.audit.modules.system.dao.UserDao;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.workflow.entity.ApprovalDetailVo;
import com.audit.modules.workflow.entity.FlowSetpVo;
import com.audit.modules.workflow.entity.WorkflowConstant;
import com.audit.modules.workflow.service.ZAuditWorkflowService;

/**
 * @Description: 稽核业务流程处理接口实现类
 * 
 * @author 礼斌
 * @date 2017年3月10日 下午2:07:36
 */
@Service
public class ZAuditWorkflowServiceImpl implements ZAuditWorkflowService {

	/** 流程承接人 */
	private static final String EMPLOYEE = "employee";
	
	@Autowired
	private WhiteMgService whiteMgService;

	/** 超标标准 */
	private static final double OVER_PROPORTION_STANDARD = 10d;
	
	// 获取流程存储服务组件
	@Autowired
	private RepositoryService repositoryService;
	
	// 获取运行时服务组件
	@Autowired
	private RuntimeService runtimeService;
	
	// 获取流程任务组件
	@Autowired
	private TaskService taskService;
	
	@Autowired
	private HistoryService historyService;
	
	@Autowired
	private InputElectricityService inputElectricityService;
	
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private BenchmarkService benchmarkService;
	
	@Autowired
    private SubmitFinanceServiceImpl submitFinanceService;
	
	@Autowired
    private ElectricitySubmitService electricitySubmitService;
	
	@Autowired
    private ElectricitySubmitDao electricitySubmitDao;
	
	@Autowired
	private OAServiceImpl oAServiceImpl;

	/**
	 * 根据KEY获取流程实例
	 * 
	 * @param busId 电费稽核业务ID
	 */
	@Override
	public void startFlow(String busId) {
		if (StringUtils.isEmpty(busId)) {
			throw new CommonException("参数：业务ID为空!");
		}
		UserVo userInfo = getLoginUser();
		if (StringUtils.isEmpty(userInfo)) {
			throw new CommonException("请先登录!");
		}
		// 定义流程实例
		ProcessDefinition processDefinition = getProcessDefinition(userInfo);
		if (StringUtils.isEmpty(processDefinition)) {
			throw new CommonException("未找到对应的流程,请联系管理员创建对应地区的流程!");
		}
		Map<String, Object> pars = new HashMap<>();
		// 流程提交人
		pars.put(EMPLOYEE, userInfo.getUserId());
		pars.put("approved", 1);
		// 启动流程
		ProcessInstance instance = runtimeService.startProcessInstanceById(processDefinition.getId(), busId, pars);
		// 保存参数
		runtimeService.setVariables(instance.getId(),
				handleVariable(instance, processDefinition, userInfo.getUserId()));
	}
	
	/**
	 * 设置参数
	 * 
	 * @param instance 流程实例
	 * @param definition 流程定义
	 * @return 参数
	 */
	private Map<String, Object> handleVariable(ProcessInstance instance, ProcessDefinition definition, String userId) {
		Map<String, Object> handleVariable = new HashMap<>();
		// 查询业务信息
		ElectrictyVO electrictyVO = inputElectricityService.findOneByID(instance.getBusinessKey());
		// 设置流程状态
		handleVariable.put(FlowConstant.VARIABLE_FLOW_STATE_NAME, FlowConstant.FLOW_APPROVAL_AWAITING);
		// 流程类型
		handleVariable.put(FlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.MANDIMENSION);	
		// 地市
		handleVariable.put(FlowConstant.VARIABLE_cityId_NAME, electrictyVO.getCityId());		
		// 区县
		handleVariable.put(FlowConstant.VARIABLE_countyId_NAME, electrictyVO.getCountyId());
		// 录入人员
		handleVariable.put(FlowConstant.VARIABLE_inputPerson_NAME, electrictyVO.getInputPerson());		
		// 报账点名称
		handleVariable.put(FlowConstant.VARIABLE_siteName_NAME, electrictyVO.getAccountName());
		
		// 设置流水号
		handleVariable.put(FlowConstant.VARIABLE_SERIALNUMBER_NAME, electrictyVO.getSerialNumber());		
		// 报账组
		handleVariable.put(FlowConstant.VARIABLE_ACCOUNT_NAME, electrictyVO.getSysRgName());
		// 流程发起人
		handleVariable.put(FlowConstant.VARIABLE_USERID_START, userId);
		// 流程处理人
		handleVariable.put(FlowConstant.VARIABLE_HANDLE_PERSON, userId);
		handledefinitionVariable(definition, handleVariable);
		return handleVariable;
	}
	
	/**
	 * 处理流程定义
	 * 
	 * @param definition 流程定义
	 * @param handleVariable 变量
	 * @return 流程的流转图
	 */
	private void handledefinitionVariable(ProcessDefinition definition, Map<String, Object> handleVariable) {
		try {
			InputStream bpmnStream = repositoryService.getResourceAsStream(definition.getDeploymentId(),
					definition.getResourceName());
			XMLInputFactory xif = WorkflowXMLInputFactory.createSafeXmlInputFactory();
			InputStreamReader in = new InputStreamReader(bpmnStream, "UTF-8");
			XMLStreamReader xtr = xif.createXMLStreamReader(in);
			BpmnModel bpmnModel = new BpmnXMLConverter().convertToBpmnModel(xtr);

			List<Map<String,String>> taskSorts = new ArrayList<>();
			List<Process> processes = bpmnModel.getProcesses();
			if (processes != null && !processes.isEmpty()) {
				Collection<FlowElement> flowElements = processes.get(0).getFlowElements();
				for (FlowElement flowElement : flowElements) {
					if (flowElement instanceof UserTask) {
						List<SequenceFlow> flows = ((UserTask) flowElement).getOutgoingFlows();
						Map<String, String> curSetp = new HashMap<>();
						curSetp.put(FlowConstant.VARIABLE_TASKID_NAME, flowElement.getId());
						curSetp.put(FlowConstant.VARIABLE_USERID_NAME, ((UserTask) flowElement).getAssignee());
						taskSorts.add(curSetp);
						for (SequenceFlow flow : flows) {
							if (flow.getConditionExpression() != null
									&& flow.getConditionExpression().equals("${approved == 2}")) {
								handleVariable.put(FlowConstant.VARIABLE_REVERSE_NAME, flowElement.getId());
								break;
							}
						}
					}
				}
				handleVariable.put(FlowConstant.VARIABLE_TASKSORT_NAME, taskSorts);
			}
		} catch (Exception e) {
			throw new CommonException("解析失败！");
		}
	}
	
	/**
	 * 查询用户流程任务
	 * 
	 * @param flowVo 流程查询参数
	 * @return 电费稽核业务ID
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void queryTaskByUser(HttpServletRequest request,ElectricityFlowVo flowVo, PageUtil pageVo) {
		List<ElectricityFlowVo> infos = new ArrayList<>();
		BigDecimal TaxAmountSum = new BigDecimal("0.00");//当前页税金金额累加求总额
		BigDecimal ElectricityAmountSum = new BigDecimal("0.00");//当前页电费金额累加求总额
		BigDecimal OtherCostSum = new BigDecimal("0.00");//当前页其他金额累加求总额
		BigDecimal Amount = new BigDecimal("0.00");//当前页总金额
		// 查询对象
		System.out.println(flowVo.getCityId()+"---=-=-=-="+flowVo.getCountyId()+"===="+flowVo.getqSerialNumber());
		HistoricProcessInstanceQuery query = createHistoricQuery(flowVo);
		// 设置总页数
		pageVo.setTotalRecord(query.count());

		// 分页查询用户关联业务
		List<HistoricProcessInstance> processs = query.listPage((pageVo.getPageNo() - 1) * pageVo.getPageSize(),
				pageVo.getPageSize());
		for (HistoricProcessInstance process : processs) {
			ElectricityFlowVo vo = new ElectricityFlowVo();
			vo.setCurOpUserID(flowVo.getCurOpUserID());
			// 业务关联ID
			vo.setBusinessKey(process.getBusinessKey());
			// 将当前id的电费金额(不含税)值赋予当前页电费金额(不含税)总额
			String electricity=inputElectricityService.findElectricityAmountSum(process.getBusinessKey());
			// 将当前id的其他费用值赋予当前页其他费用总额
			String other=inputElectricityService.findOtherCostSum(process.getBusinessKey());
			// 将当前id的税金金额值赋予当前页税金金额总额
			String tax=inputElectricityService.findTaxAmountSum(process.getBusinessKey());
			
			// 设置电费单数据
//			vo.setElectricty(inputElectricityService.findOneByID(process.getBusinessKey()));
			//计算单价noone
			ElectrictyVO meteData = inputElectricityService.findOneByID(process.getBusinessKey());
			BigDecimal allMete = new BigDecimal(meteData.getTotalEleciric());//获取总电量，有可能要减去其他金额
			BigDecimal allNum = new BigDecimal(meteData.getTotalAmount());//获取总金额
			System.out.println(allNum.divide(allMete, 4)+"-------------------------单价");
			meteData.setPrice(""+allNum.divide(allMete, 4));
			vo.setElectricty(meteData);
			// 流程ID
			vo.setInstanceId(process.getId());
			
			//保存实体			
			handleOperation(process.getId(), vo);
			//当前页税金金额总额为null或空字符串赋值为0.00;
			if(tax==null||tax.equals("")){
				tax="0.00";
			}
			//当前页电费金额总额为null或空字符串赋值为0.00;
			if(electricity==null||electricity.equals("")){
				electricity="0.00";
			}
			//当前页其他金额总额为null或空字符串赋值为0.00;
			if(other==null||other.equals("")){
				other="0.00";
			}
			//计算当前页税金金额总额
			BigDecimal TaxAmountSum1 = new BigDecimal(tax);//获取当前税金金额
			TaxAmountSum=TaxAmountSum.add(TaxAmountSum1);//累加求和
			vo.setTaxAmountSum(String.valueOf(TaxAmountSum));//将当前页税金金额总额值赋予税金金额总额（最终值）
			//计算当前页电费金额总额
			BigDecimal ElectricityAmountSum1 = new BigDecimal(electricity);//获取当前电费金额
			ElectricityAmountSum=ElectricityAmountSum.add(ElectricityAmountSum1);//累加求和
			vo.setElectricityAmountSum(String.valueOf(ElectricityAmountSum));//将当前页电费金额总额值赋予电费金额总额（最终值）
			//计算当前页其他费用金额总额
			BigDecimal OtherCostSum1 = new BigDecimal(other);//获取当前页其他费用金额
			OtherCostSum=OtherCostSum.add(OtherCostSum1);//累加求和
			vo.setOtherCostSum(String.valueOf(OtherCostSum));//将当前页其他费用金额总额值赋予其他费用金额总额（最终值）
			//计算当前页总金额
			Amount=TaxAmountSum.add(ElectricityAmountSum).add(OtherCostSum);
			vo.setAmount(String.valueOf(Amount));//将当前页总金额值赋予总金额（最终值）
			infos.add(vo);
		}
/*		pageVo.setResultsSum(String.valueOf(TaxAmountSum)); */
		//pageVo.setObj(String.valueOf(TaxAmountSum));
		//判断用户等级
		HttpSession session = request.getSession();
		UserVo user =(UserVo) session.getAttribute("user");
		List<String> roleList = whiteMgService.getRoleList(user.getUserId());
		int roleLevel=0;
		for(String sys:roleList){
			if("区县公司经办人".equals(sys)){
				roleLevel=2;
				break;
			}
			if("区县网络部经理".equals(sys)){
				roleLevel=3;
				break;
			}
			if("区县公司经理".equals(sys)){
				roleLevel=3;
				break;
			}
			if("市公司网络部管理岗".equals(sys)){
				roleLevel=1;
				break;
			}
			if("市公司网络部分管经理".equals(sys)){
				roleLevel=1;
				break;
			}
			if("区县正常报销发起人".equals(sys)){
				roleLevel=4;
				break;
			}
		}
for(ElectricityFlowVo ev:infos){
	ev.setRolelevel(roleLevel);
}
		pageVo.setResults(infos);
	}
	
	
	
	
	
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void queryTaskByUser11(ElectricityFlowVo flowVo, PageUtil pageVo) {
		List<ElectricityFlowVo> infos = new ArrayList<>();
		BigDecimal TaxAmountSum = new BigDecimal("0.00");//当前页税金金额累加求总额
		BigDecimal ElectricityAmountSum = new BigDecimal("0.00");//当前页电费金额累加求总额
		BigDecimal OtherCostSum = new BigDecimal("0.00");//当前页其他金额累加求总额
		BigDecimal Amount = new BigDecimal("0.00");//当前页总金额
		// 查询对象
		System.out.println(flowVo.getCityId()+"---=-=-=-="+flowVo.getCountyId()+"===="+flowVo.getqSerialNumber());
		HistoricProcessInstanceQuery query =  historyService.createHistoricProcessInstanceQuery();
		// 流程类型
				query.variableValueEquals(FlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.MANDIMENSION);
				// 降序排列
				query.orderByProcessInstanceStartTime().desc();
		// 设置总页数
		pageVo.setTotalRecord(query.count());

		// 分页查询用户关联业务
		List<HistoricProcessInstance> processs = query.listPage((pageVo.getPageNo() - 1) * pageVo.getPageSize(),
				pageVo.getPageSize());
		for (HistoricProcessInstance process : processs) {
			ElectricityFlowVo vo = new ElectricityFlowVo();
			vo.setCurOpUserID(flowVo.getCurOpUserID());
			// 业务关联ID
			vo.setBusinessKey(process.getBusinessKey());
			// 将当前id的电费金额(不含税)值赋予当前页电费金额(不含税)总额
			String electricity=inputElectricityService.findElectricityAmountSum(process.getBusinessKey());
			// 将当前id的其他费用值赋予当前页其他费用总额
			String other=inputElectricityService.findOtherCostSum(process.getBusinessKey());
			// 将当前id的税金金额值赋予当前页税金金额总额
			String tax=inputElectricityService.findTaxAmountSum(process.getBusinessKey());
			
			// 设置电费单数据
			vo.setElectricty(inputElectricityService.findOneByID(process.getBusinessKey()));
			// 流程ID
			vo.setInstanceId(process.getId());
			
			//保存实体			
			handleOperation11(process.getId(), vo);
			//当前页税金金额总额为null或空字符串赋值为0.00;
			if(tax==null||tax.equals("")){
				tax="0.00";
			}
			//当前页电费金额总额为null或空字符串赋值为0.00;
			if(electricity==null||electricity.equals("")){
				electricity="0.00";
			}
			//当前页其他金额总额为null或空字符串赋值为0.00;
			if(other==null||other.equals("")){
				other="0.00";
			}
			//计算当前页税金金额总额
			BigDecimal TaxAmountSum1 = new BigDecimal(tax);//获取当前税金金额
			TaxAmountSum=TaxAmountSum.add(TaxAmountSum1);//累加求和
			vo.setTaxAmountSum(String.valueOf(TaxAmountSum));//将当前页税金金额总额值赋予税金金额总额（最终值）
			//计算当前页电费金额总额
			BigDecimal ElectricityAmountSum1 = new BigDecimal(electricity);//获取当前电费金额
			ElectricityAmountSum=ElectricityAmountSum.add(ElectricityAmountSum1);//累加求和
			vo.setElectricityAmountSum(String.valueOf(ElectricityAmountSum));//将当前页电费金额总额值赋予电费金额总额（最终值）
			//计算当前页其他费用金额总额
			BigDecimal OtherCostSum1 = new BigDecimal(other);//获取当前页其他费用金额
			OtherCostSum=OtherCostSum.add(OtherCostSum1);//累加求和
			vo.setOtherCostSum(String.valueOf(OtherCostSum));//将当前页其他费用金额总额值赋予其他费用金额总额（最终值）
			//计算当前页总金额
			Amount=TaxAmountSum.add(ElectricityAmountSum).add(OtherCostSum);
			vo.setAmount(String.valueOf(Amount));//将当前页总金额值赋予总金额（最终值）
			infos.add(vo);
		}
/*		pageVo.setResultsSum(String.valueOf(TaxAmountSum)); */
		//pageVo.setObj(String.valueOf(TaxAmountSum));
		pageVo.setResults(infos);
	}

	
	
	
	
	
	

	/**
	 * 创建查询对象
	 * 
	 * @param flowVo 流程查询条件
	 * @return 查询对象
	 */
	private HistoricProcessInstanceQuery createHistoricQuery(ElectricityFlowVo flowVo) {
		
		HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery();
		// 当前用户关联的任务
		query.involvedUser(flowVo.getCurOpUserID());
		
		// 地市
		if (!StringUtils.isEmpty(flowVo.getCityId())) {
			query.variableValueEquals(FlowConstant.VARIABLE_cityId_NAME, flowVo.getCityId());
		}
		
		// 区县
		if (!StringUtils.isEmpty(flowVo.getCountyId())) {
			query.variableValueEquals(FlowConstant.VARIABLE_countyId_NAME, flowVo.getCountyId());
		}
		
		// 录入人员
		if (!StringUtils.isEmpty(flowVo.getInputPerson())) {
			query.variableValueLike(FlowConstant.VARIABLE_inputPerson_NAME, "%" + flowVo.getInputPerson() + "%");
		}
		
		// 报账点名称
		if (!StringUtils.isEmpty(flowVo.getSiteName())) {
			query.variableValueLike(FlowConstant.VARIABLE_siteName_NAME, "%" + flowVo.getSiteName() + "%");
		}
		
		// 流程状态
		if (!StringUtils.isEmpty(flowVo.getFlowState())) {
			query.variableValueEquals(FlowConstant.VARIABLE_FLOW_STATE_NAME, flowVo.getFlowState());
		}
		// 流水号查询
		if (!StringUtils.isEmpty(flowVo.getqSerialNumber())) {
			query.variableValueLike(FlowConstant.VARIABLE_SERIALNUMBER_NAME, "%" + flowVo.getqSerialNumber() + "%");
		}
		// 开始时间
		if (!StringUtils.isEmpty(flowVo.getqStartTime())) {
			query.startedAfter(flowVo.getqStartTime());
		}
		// 结束时间
		if (!StringUtils.isEmpty(flowVo.getqEndTime())) {
			query.startedBefore(flowVo.getqEndTime());
		}
		// 业务ID
		if (!StringUtils.isEmpty(flowVo.getBusinessKey())) {
			query.processInstanceBusinessKey(flowVo.getBusinessKey());
		}
		// 报账组
		if (!StringUtils.isEmpty(flowVo.getqAccount())) {
			query.variableValueLike(FlowConstant.VARIABLE_ACCOUNT_NAME, flowVo.getqAccount());
		}
		// 当前处理人为自己的数据
		if (flowVo.isOperation()) {
			query.variableValueEquals(FlowConstant.VARIABLE_HANDLE_PERSON, flowVo.getCurOpUserID());
		}				
		// 流程类型
		query.variableValueEquals(FlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.MANDIMENSION);
		// 降序排列
		query.orderByProcessInstanceStartTime().desc();
		return query;
	}
	
	/**
	 * 设置流程状态
	 * 
	 * @param rocessInstanceId 流程ID
	 * @param vo 保存实体
	 */
	private void handleOperation(String rocessInstanceId, ElectricityFlowVo vo) {
		Task task = taskService.createTaskQuery().processInstanceId(rocessInstanceId).singleResult();
		handleOperation(task, vo);
	}
	
	private void handleOperation11(String rocessInstanceId, ElectricityFlowVo vo) {
		Task task = taskService.createTaskQuery().processInstanceId(rocessInstanceId).singleResult();
		handleOperation(task, vo);
	}
	
	/**
	 * 设置流程状态 
	 * 
	 * @param task 任务
	 * @param vo 保存实体
	 */
	@SuppressWarnings("unchecked")
	private void handleOperation(Task task, ElectricityFlowVo vo) {
		if (task != null) {
			Map<String, Object> variables = runtimeService.getVariables(task.getProcessInstanceId());
			List<Map<String, String>> allSteps = (List<Map<String, String>>) variables
					.get(FlowConstant.VARIABLE_TASKSORT_NAME);
			Integer curFlowState = Integer.valueOf(variables.get(FlowConstant.VARIABLE_FLOW_STATE_NAME).toString());
			String starUserId = variables.get(FlowConstant.VARIABLE_USERID_START).toString();
			String reverse = variables.get(FlowConstant.VARIABLE_REVERSE_NAME).toString();
			String serialNumber = variables.get(FlowConstant.VARIABLE_SERIALNUMBER_NAME).toString();
			// 流水号
			vo.setqSerialNumber(serialNumber);
			// 当前流程状态
			vo.setFlowState(curFlowState);
			// 当前操作权限
			vo.setOperation(vo.getCurOpUserID().equals(task.getAssignee()));
			// 是否扭转
			vo.setReverse(task.getTaskDefinitionKey().equals(reverse));
			// 下级审批状态
			vo.setNextFlowState(nextFlowState(allSteps, task.getTaskDefinitionKey(), vo.getApproveState()));
			// 当前处理人
			vo.setCurOpUserID(task.getAssignee());
			// 下级处理人
			vo.setNextUserID(nextUserId(allSteps, task.getTaskDefinitionKey(), vo.getApproveState(), starUserId));
			// 设置业务ID
			if (StringUtils.isEmpty(vo.getBusinessKey())) {
				ProcessInstance instance = runtimeService.createProcessInstanceQuery()
						.processInstanceId(task.getProcessInstanceId()).singleResult();
				vo.setBusinessKey(instance.getBusinessKey());
			}
		} else {
			vo.setFlowState(FlowConstant.FLOW_STATE_END);
			vo.setOperation(false);
			vo.setReverse(false);
		}
	}
	
	
	
	@SuppressWarnings("unchecked")
	private void handleOperation11(Task task, ElectricityFlowVo vo) {
		if (task != null) {
			Map<String, Object> variables = runtimeService.getVariables(task.getProcessInstanceId());
			List<Map<String, String>> allSteps = (List<Map<String, String>>) variables
					.get(FlowConstant.VARIABLE_TASKSORT_NAME);
			Integer curFlowState = Integer.valueOf(variables.get(FlowConstant.VARIABLE_FLOW_STATE_NAME).toString());
			String starUserId = variables.get(FlowConstant.VARIABLE_USERID_START).toString();
		/*	String reverse = variables.get(FlowConstant.VARIABLE_REVERSE_NAME).toString();*/
			String serialNumber = variables.get(FlowConstant.VARIABLE_SERIALNUMBER_NAME).toString();
			// 流水号
			vo.setqSerialNumber(serialNumber);
			// 当前流程状态
			vo.setFlowState(curFlowState);
			// 当前操作权限
			vo.setOperation(vo.getCurOpUserID().equals(task.getAssignee()));
			// 是否扭转
			/*vo.setReverse(task.getTaskDefinitionKey().equals(reverse));*/
			// 下级审批状态
			vo.setNextFlowState(nextFlowState(allSteps, task.getTaskDefinitionKey(), vo.getApproveState()));
			// 当前处理人
			vo.setCurOpUserID(task.getAssignee());
			// 下级处理人
			vo.setNextUserID(nextUserId(allSteps, task.getTaskDefinitionKey(), vo.getApproveState(), starUserId));
			// 设置业务ID
			if (StringUtils.isEmpty(vo.getBusinessKey())) {
				ProcessInstance instance = runtimeService.createProcessInstanceQuery()
						.processInstanceId(task.getProcessInstanceId()).singleResult();
				vo.setBusinessKey(instance.getBusinessKey());
			}
		} else {
			vo.setFlowState(FlowConstant.FLOW_STATE_END);
			vo.setOperation(false);
			vo.setReverse(false);
		}
	}
	
	/**
	 * 计算下次审批状态
	 * 
	 * @param allSteps 所有步骤
	 * @param curStep 当前步骤 
	 * @return 审批状态
	 */
	private Integer nextFlowState(List<Map<String, String>> allSteps, String curStep, Integer approveState) {
		Integer nexState = -1;
		// 审批状态为通过，审批后流程为驳回
		if (approveState != null && approveState == -1) {
			nexState = FlowConstant.FLOW_STATE_REBUT;
		}
		// 审批后流程结束
		else if (approveState != null && approveState == 2) {
			nexState = FlowConstant.FLOW_STATE_END;
		}
		// 等待提交审批
		else if (allSteps.get(0).get(FlowConstant.VARIABLE_TASKID_NAME).equals(curStep)) {
			nexState = FlowConstant.FLOW_STATE_APPROVALING;
		}
		// 审批结束
		else if (allSteps.get(allSteps.size() - 1).get(FlowConstant.VARIABLE_TASKID_NAME).equals(curStep)) {
			nexState = FlowConstant.FLOW_STATE_END;
		}
		// 审批中
		else {
			nexState = FlowConstant.FLOW_STATE_APPROVALING;
		}
		return nexState;
	}
	
	/**
	 * 取得下级审批人ID
	 * 
	 * @param allSteps 所有步骤
	 * @param curStep 当前步骤
	 * @param approveState 审批状态
	 * @param starUserId 流程发起人
	 * @return 下级审批人ID
	 */
	private String nextUserId(List<Map<String, String>> allSteps, String curStep, Integer approveState,
			String starUserId) {
		String nextUserId = null;
		// 审批状态为通过，审批后流程为驳回
		if (approveState != null && approveState == -1) {
			// 直接退回到发起人
			nextUserId = starUserId;
		}
		// 审批结束,向发起人提示
		else if (allSteps.get(allSteps.size() - 1).get(FlowConstant.VARIABLE_TASKID_NAME).equals(curStep)) {
			nextUserId = starUserId;
		} else {
			boolean stop = false;
			for (Map<String, String> curSetp : allSteps) {
				// 当前节点
				if (curSetp.get(FlowConstant.VARIABLE_TASKID_NAME).equals(curStep)) {
					stop = true;
					continue;
				}
				// 下级审批人
				if (stop) {
					nextUserId = curSetp.get(FlowConstant.VARIABLE_USERID_NAME);
					break;
				}
			}
		}
		return nextUserId;
	}
	
	/**
	 * 根据KEY获取流程实例
	 * 
	 * @param flowKey
	 * @return ProcessDefinition
	 */
	private ProcessDefinition getProcessDefinition(UserVo userInfo) {
		// 登录人所在地区查询流程
		String city = userInfo.getCityStr();
		String county = userInfo.getCountyStr();
		String queryKey = city + "-" + county + "-" + WorkflowConstant.MANDIMENSION;
		// 执行查询
		ProcessDefinitionQuery query = repositoryService.createProcessDefinitionQuery().latestVersion().active();
		// 查询地市
		query.processDefinitionKey(queryKey);
		// 处理结果
		List<ProcessDefinition> lists = query.list();
		if (lists != null && !lists.isEmpty()) {
			return lists.get(0);
		}
		return null;
	}

	/**
	 * 获取登录人
	 * 
	 * @return
	 */
	private UserVo getLoginUser() {
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		return (UserVo) session.getAttribute("user");
	}
	
	/**
	 * 流程审核
	 * 
	 * @param userId 用户ID 
	 * @param flow 审批条件
	 */
	@Override
	@Transactional
	public void auditElectricityFlow(String userId, ElectricityFlowVo flow) {
		if (StringUtils.isEmpty(flow.getInstanceId()) || StringUtils.isEmpty(flow.getApproveState())) {
			throw new CommonException("参数：流程ID或审批状态为空!");
		}
		
		Task task = taskService.createTaskQuery().processInstanceId(flow.getInstanceId()).singleResult();
		flow.setCurOpUserID(userId);
		// 判断运行状态
		handleOperation(task, flow);
		// 前置判断
		auditBefore(flow, task);
		Map<String, Object> param = new HashMap<>();
		param.put("approved", flow.getApproveState());
		param.put(FlowConstant.VARIABLE_HANDLE_PERSON, flow.getNextUserID());
		param.put(FlowConstant.VARIABLE_FLOW_STATE_NAME, flow.getNextFlowState());
		if (flow.getApproveState() == -1) {
			taskService.addComment(task.getId(), flow.getInstanceId(), "驳回");
		} else {
			taskService.addComment(task.getId(), flow.getInstanceId(), "审批通过");
		}
		taskService.complete(task.getId(), param);
		// 发送者账户信息
		UserVo senderUser = userDao.queryUserByUserId(flow.getCurOpUserID());
		
		// 流程驳回
		if (flow.getApproveState() == -1) {
			inputElectricityService.updateStatus(flow.getBusinessKey(), 3);
			sendMessage("您有一条自维稽核单被驳回，请登录系统处理。", flow.getNextUserID());
			// 发送者账户信息
			UserVo receiverUser = userDao.queryUserByUserId(flow.getNextUserID());
			oAServiceImpl.handle(senderUser.getAccount(), receiverUser.getAccount(), flow.getqSerialNumber(), "被驳回");
		}
		// 审批结束
		else if (flow.getNextFlowState() == FlowConstant.FLOW_STATE_END) {
			inputElectricityService.updateStatus(flow.getBusinessKey(), 2);
			sendMessage("您有一条自维稽核单审批通过，请登录系统生成电费提交单。", flow.getNextUserID());
		} else {
			inputElectricityService.updateStatus(flow.getBusinessKey(), 1);
			sendMessage("您有一条自维稽核单需要审批，请登录系统处理。", flow.getNextUserID());
			// 发送者账户信息
			UserVo receiverUser = userDao.queryUserByUserId(flow.getNextUserID());
			oAServiceImpl.handle(senderUser.getAccount(), receiverUser.getAccount(), flow.getqSerialNumber(), "待审批");
		}
	}
	
	/**
	 * 审批前的条件判断
	 * 
	 * @param flow 条件
	 */
	private void auditBefore(ElectricityFlowVo flow, Task task) {
		// 是否跳过最后一层审批
		if (flow.isReverse()) {
			// 判断接口
			ProcessInstanceQuery pQuery = runtimeService.createProcessInstanceQuery()
					.processInstanceId(task.getProcessInstanceId());
			ProcessInstance instance = pQuery.singleResult();
			if (FlowConstant.NOT_EXCEED_STANDARD == overStandard(instance.getBusinessKey())) {
				flow.setApproveState(2);
				flow.setNextFlowState(FlowConstant.FLOW_STATE_END);
			}
		}
	}
	
	/**
	 * 超标状态值
	 * 
	 * @param businessKey 业务ID
	 * @return 是否超标 1:超标 -1:未超标
	 */
	private Integer overStandard(String businessKey) {
		ElectricityBenchmarkCheckVO benchmarkCheckVO = benchmarkService.queryOverBenchmark(businessKey);
		if (benchmarkCheckVO == null || OVER_PROPORTION_STANDARD > benchmarkCheckVO.getOverProportion()) {
			return FlowConstant.NOT_EXCEED_STANDARD;
		}
		return FlowConstant.EXCEED_STANDARD;
	}
	
	/**
	 * 撤销流程
	 * 
	 * @param instanceId 流程ID
	 * @param reason 原因说明
	 */
	@Override
	public void deleteTask(String instanceId, String reason) {
		if (StringUtils.isEmpty(instanceId)) {
			throw new CommonException("参数：流程ID为空!");
		}
		ProcessInstance instance = runtimeService.createProcessInstanceQuery().processInstanceId(instanceId)
				.singleResult();
		String businessKey = instance.getBusinessKey();
		// 更新流程状态
		inputElectricityService.updateStatus(businessKey, 7);
		// 删除流程
		runtimeService.deleteProcessInstance(instanceId, reason);
		historyService.deleteHistoricProcessInstance(instanceId);
	}
	

	/**
	 * 更新
	 * 
	 * @param instanceId 流程ID
	 * @param vo 待更新实体
	 */
	@Override
	public void updateTask(String instanceId, ElectrictySaveVO vo) {
		if (StringUtils.isEmpty(instanceId)) {
			throw new CommonException("参数：流程ID为空!");
		}
		ProcessInstance instance = runtimeService.createProcessInstanceQuery().processInstanceId(instanceId)
				.singleResult();
		String businessKey = instance.getBusinessKey();
		vo.setId(businessKey);
		// 更新流程信息
		inputElectricityService.updateElectricty(vo);
		// 删除流程
		runtimeService.deleteProcessInstance(instanceId, "流程信息更新!");
		historyService.deleteHistoricProcessInstance(instanceId);
	}

	/**
	 * 查询审批过程
	 * 
	 * @param instanceId 流程ID
	 * @return 审批过程
	 */
	@Override
	public List<ApprovalDetailVo> queryApprovalDetails(String instanceId) {
		List<HistoricActivityInstance> activitys = historyService.createHistoricActivityInstanceQuery()
				.activityType("userTask").processInstanceId(instanceId).orderByHistoricActivityInstanceStartTime()
				.asc().list();

		List<ApprovalDetailVo> details = new ArrayList<>();
		for (HistoricActivityInstance activity : activitys) {
			ApprovalDetailVo detail = new ApprovalDetailVo();
			detail.setOpType(activity.getActivityName());
			if (activity.getEndTime() != null) {
				detail.setTime(formatDate(activity.getEndTime()));
			} else {
				detail.setTime(formatDate(activity.getStartTime()));
			}
			List<Comment> comments = taskService.getTaskComments(activity.getTaskId());
			if (comments != null && !comments.isEmpty()) {
				detail.setSuggestion(comments.get(0).getFullMessage());
			} else {
				detail.setSuggestion("审批中");
			}
			detail.setUser(userDao.queryUserByUserId(activity.getAssignee()));
			details.add(detail);
		}
		return details;
	}

	private String formatDate(Date time) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return format.format(time);
	}
	
	/**
	 * 查询待办数量
	 * 
	 * @param userId 用户ID
	 * @return 待办数量
	 */
	@Override
	public Integer queryOperatorNum(String userId) {
		return taskService.createTaskQuery().taskAssignee(userId)
				.processVariableValueEquals(FlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.MANDIMENSION).list()
				.size();
	}

	/**
	 * 根据业务ID查询流程信息
	 * 
	 * @param busId 业务ID
	 * @return 流程信息
	 */
	@Override
	public ElectricityFlowVo queryFlowInfo(String busId) {
		if (StringUtils.isEmpty(busId)) {
			throw new CommonException("参数：业务ID不能为空!");
		}
		ElectricityFlowVo params = new ElectricityFlowVo();
		params.setBusinessKey(busId);
		// 查询对象
		HistoricProcessInstanceQuery query = createHistoricQuery(params);
		HistoricProcessInstance instance = query.list().get(0);

		ElectricityFlowVo vo = new ElectricityFlowVo();
		// 业务关联ID
		vo.setBusinessKey(instance.getBusinessKey());
		// 流程ID
		vo.setInstanceId(instance.getId());
		handleOperation(instance.getId(), vo);
		return vo;
	}

	/**
	 * 查询流转图
	 * 
	 * @param instanceId 流程图
	 * @return 查询流转图
	 */
	@Override
	public List<FlowSetpVo> queryFlowChart(String instanceId) {
		List<FlowSetpVo> setps = new ArrayList<>();
		try {
			// 查询运行的流程信息
			ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(instanceId)
					.singleResult();
			// 历史信息
			HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery()
					.processInstanceId(instanceId).singleResult();
			// 查询流程模板
			ProcessDefinition definition = repositoryService.createProcessDefinitionQuery()
					.deploymentId(historicProcessInstance.getDeploymentId()).singleResult();
			InputStream bpmnStream = repositoryService.getResourceAsStream(definition.getDeploymentId(),
					definition.getResourceName());
			XMLInputFactory xif = WorkflowXMLInputFactory.createSafeXmlInputFactory();
			InputStreamReader in = new InputStreamReader(bpmnStream, "UTF-8");
			XMLStreamReader xtr = xif.createXMLStreamReader(in);
			BpmnModel bpmnModel = new BpmnXMLConverter().convertToBpmnModel(xtr);

			List<Process> processes = bpmnModel.getProcesses();
			boolean activeEnd = false;
			if (processes != null && !processes.isEmpty()) {
				Collection<FlowElement> flowElements = processes.get(0).getFlowElements();
				for (FlowElement flowElement : flowElements) {
					if (flowElement instanceof UserTask) {
						FlowSetpVo setp = new FlowSetpVo();
						// 流程未结束且当前为流程处理节点，且以后的节点不能显示为已经处理
						if (processInstance != null && processInstance.getActivityId().equals(flowElement.getId())) {
							setp.setActive(true);
							activeEnd = true;
						} 
						// 流程未结束且流程流程的处理节点在该节点后，则该节点显示已经处理
						else if (processInstance != null && !activeEnd) {
							setp.setActive(true);
						} 
						// 流程已经结束，则所有节点都为已经处理
						else if (processInstance == null && historicProcessInstance != null) {
							setp.setActive(true);
						} else {
							setp.setActive(false);
						}
						
						// 节点名字
						setp.setStepName(flowElement.getName());
						// 用户信息
						String userId = ((UserTask) flowElement).getAssignee();
						UserVo user = userDao.queryUserByUserId(userId);
						if (user != null) {
							setp.setUser(user);
						}
						// 用户ID
						setp.setApprover(userId);

						setps.add(setp);
					}
				}
			}
			
			// 删除流程发起人节点
			if (!setps.isEmpty()) {
				setps.remove(0);
			}
			// 流程未超标，最后的审批人不参与流程，删除最后一个处理人信息
			String busId = historicProcessInstance.getBusinessKey();
			if (FlowConstant.NOT_EXCEED_STANDARD == overStandard(busId)) {
				setps.remove(setps.size() - 1);
			}
		} catch (Exception e) {
			throw new CommonException("查询失败!");
		}
		
		return setps;
	}

	/**
	 * 统计区县信息
	 * 
	 * @return 统计信息
	 */
	@Override
	public List<Map<String, String>> statisticsCountInfo() {
		List<Map<String, String>> result = new ArrayList<>();
		
		UserVo userInfo = getLoginUser();
		if (StringUtils.isEmpty(userInfo)) {
			throw new CommonException("请先登录!");
		}
		ElectricityFlowVo flowVo = new ElectricityFlowVo();
		flowVo.setCurOpUserID(userInfo.getUserId());
		// 统计审批中人记录数
		flowVo.setFlowState(FlowConstant.FLOW_STATE_APPROVALING);
		HistoricProcessInstanceQuery query = createHistoricQuery(flowVo);
		Long approvalingNum = query.count();
		Map<String, String> curMap = new HashMap<>();
		curMap.put("name", "审批中");
		curMap.put("value", approvalingNum.toString());
		result.add(curMap);
		
		// 统计审批结束
		flowVo.setFlowState(FlowConstant.FLOW_STATE_END);
		query = createHistoricQuery(flowVo);
		Long endNum = query.count();
		curMap = new HashMap<>();
		curMap.put("name", "审批通过");
		curMap.put("value", endNum.toString());
		result.add(curMap);
		
		// 统计驳回
		flowVo.setFlowState(FlowConstant.FLOW_STATE_REBUT);
		query = createHistoricQuery(flowVo);
		Long rebutNum = query.count();
		curMap = new HashMap<>();
		curMap.put("name", "审批驳回");
		curMap.put("value", rebutNum.toString());
		result.add(curMap);
		
		return result;
	}
	
	/**
	 * 发送短信消息
	 * 
	 * @param message 消息
	 * @param userId 用户ID
	 */
	private void sendMessage(String message, String userId) {
		try {
			UserVo user = userDao.queryUserByUserId(userId);
			if (user != null && !StringUtils.isEmpty(user.getMobile())) {
				SmsUtil.instance().sendSMS(message, user.getMobile(), "admin");
			}
		} catch (Exception e) {
			Log.error("短信发送失败！" + e);
		}
	}
	
	/**
	 * 推送
	 * 
	 * @param ids 数据记录标示
	 * @param state 状态
	 */
	@Override
	public void sendOut(String[] ids, Integer state) {
		// 推送财务
		if (2 == state) {
			List<Map<String, Object>> sendList = new ArrayList<>();
			for (String id : ids) {
				Map<String, Object> info = new HashMap<>();
				List<EleMiddleSubmitVO> eleMiddleSubmitVOs = electricitySubmitDao.queryMiddleBySubID(id);
				if (eleMiddleSubmitVOs == null || eleMiddleSubmitVOs.isEmpty()) {
					throw new CommonException("该电费提交单，未有稽核单明细！");
				}
				// 电费提交单内的一条稽核单
				ElectrictyVO electricty = inputElectricityService
						.findOneByID(eleMiddleSubmitVOs.get(0).getSysElectricityId());
				info.put("electricty", electricty);
				// 电费提交单信息
				ElectricitySubmitVO electricitySubmitVO = electricitySubmitDao.queryDetail(id);
				info.put("electricitySubmitVO", electricitySubmitVO);
				sendList.add(info);
			}
			// 提交财务
			submitFinanceService.setServiceUrl("http://10.101.11.247/ElectrcityAuditIntoBaseSiteSvc/ReimbursementBaseSiteSrv.svc");
			submitFinanceService.setBreaker(true);
			submitFinanceService.handleFinance(sendList);
			// 更新状态
			electricitySubmitService.updateStatus(state, ids);
		} else {
			electricitySubmitService.updateStatus(state, ids);
		}
	}

}
