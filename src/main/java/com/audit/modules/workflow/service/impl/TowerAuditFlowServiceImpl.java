package com.audit.modules.workflow.service.impl;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.dict.FlowConstant;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.sms.SmsUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.electricity.entity.TowerElectrictyEntities;
import com.audit.modules.electricity.entity.TowerReimburseVo;
import com.audit.modules.electricity.entity.TowerSaveEntities;
import com.audit.modules.electricity.entity.TowerSaveVO;
import com.audit.modules.electricity.service.TowerElectricityService;
import com.audit.modules.electricity.service.TowerReimburseService;
import com.audit.modules.electricity.vo.ElectricityBenchmarkCheckVO;
import com.audit.modules.site.service.BenchmarkService;
import com.audit.modules.system.dao.UserDao;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.workflow.entity.ApprovalDetailVo;
import com.audit.modules.workflow.entity.FlowSetpVo;
import com.audit.modules.workflow.entity.TowerConstant;
import com.audit.modules.workflow.entity.TowerElectricityFlowVo;
import com.audit.modules.workflow.entity.WorkflowConstant;
import com.audit.modules.workflow.service.TowerAuditFlowService;

/**
 * 塔维稽核流程
 * 
 * @author luoyun
 */
@Service
public class TowerAuditFlowServiceImpl implements TowerAuditFlowService {

	/** 流程承接人 */
	private static final String EMPLOYEE = "employee";

	/** 超标标准 */
	private static final double OVER_PROPORTION_STANDARD = 0.2;

	// 获取流程存储服务组件
	@Autowired
	private RepositoryService repositoryService;

	// 获取运行时服务组件
	@Autowired
	private RuntimeService runtimeService;

	// 历史数据查询
	@Autowired
	private HistoryService historyService;

	// 获取流程任务组件
	@Autowired
	private TaskService taskService;

	// 塔维服务
	@Autowired
	private TowerElectricityService towerElectricityService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private TowerReimburseService towerReimburseService;

	@Autowired
	private BenchmarkService benchmarkService;

	@Autowired
	private OAServiceImpl oAServiceImpl;

	/**
	 * 启动流程
	 * 
	 * @param busId
	 *            业务ID
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
		// 处理流程参数
		Map<String, Object> params = handleParam(userInfo, busId);
		handledefinitionVariable(processDefinition, params);
		// 启动流程
		runtimeService.startProcessInstanceById(processDefinition.getId(), busId, params);
	}

	/**
	 * 流程相关参数
	 * 
	 * @param userInfo
	 *            当前登录人
	 * @param busId
	 *            业务ID
	 * @return 流程参数
	 */
	private Map<String, Object> handleParam(UserVo userInfo, String busId) {
		Map<String, Object> params = new HashMap<>();
		// 流程提交人
		params.put(EMPLOYEE, userInfo.getUserId());
		// 设置通过
		params.put("approved", 1);
		// 设置流程状态
		params.put(TowerConstant.FLOW_STATE_NAME, TowerConstant.FLOW_APPROVAL_AWAITING);
		// 设置流程类型
		params.put(TowerConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.PAGODADIMENSION);
		// 查询业务相关数据，绑定相关参数
		TowerSaveVO info = towerElectricityService.findOneByID(busId);
		// 城市
		params.put(TowerConstant.CITY_NAME, info.getAreas());
		// 区县
		params.put(TowerConstant.COUNTY_NAME, info.getCounties());
		// 铁塔站址编号
		params.put(TowerConstant.COUNTER_NUMBER_NAME, info.getSysTowerSitNo());
		// 资管站点名称
		params.put(TowerConstant.COUNTER_NAME, info.getZgSpaceSiteName());
		// 稽核流水号
		params.put(TowerConstant.SERIAL_NUMBER_NAME, info.getSerialNumber());
		// 分担总金额
		params.put(TowerConstant.SHARE_MONEY_NAME, info.getShareAmount());
		// 流程发起人
		params.put(TowerConstant.VARIABLE_USERID_START, userInfo.getUserId());
		// 流程处理人
		params.put(TowerConstant.VARIABLE_HANDLE_PERSON, userInfo.getUserId());
		// 超标状态
		params.put(TowerConstant.OVER_STATE_NAME, overStandard(busId).toString());

		return params;
	}

	/**
	 * 处理流程定义
	 * 
	 * @param definition
	 *            流程定义
	 * @param handleVariable
	 *            变量
	 */
	private void handledefinitionVariable(ProcessDefinition definition, Map<String, Object> handleVariable) {
		try {
			InputStream bpmnStream = repositoryService.getResourceAsStream(definition.getDeploymentId(),
					definition.getResourceName());
			XMLInputFactory xif = WorkflowXMLInputFactory.createSafeXmlInputFactory();
			InputStreamReader in = new InputStreamReader(bpmnStream, "UTF-8");
			XMLStreamReader xtr = xif.createXMLStreamReader(in);
			BpmnModel bpmnModel = new BpmnXMLConverter().convertToBpmnModel(xtr);

			List<Map<String, String>> taskSorts = new ArrayList<>();
			List<Process> processes = bpmnModel.getProcesses();
			if (processes != null && !processes.isEmpty()) {
				Collection<FlowElement> flowElements = processes.get(0).getFlowElements();
				for (FlowElement flowElement : flowElements) {
					if (flowElement instanceof UserTask) {
						List<SequenceFlow> flows = ((UserTask) flowElement).getOutgoingFlows();
						Map<String, String> curSetp = new HashMap<>();
						curSetp.put(TowerConstant.VARIABLE_TASKID_NAME, flowElement.getId());
						curSetp.put(TowerConstant.VARIABLE_USERID_NAME, ((UserTask) flowElement).getAssignee());
						taskSorts.add(curSetp);
						for (SequenceFlow flow : flows) {
							if (flow.getConditionExpression() != null
									&& flow.getConditionExpression().equals("${approved == 2}")) {
								handleVariable.put(TowerConstant.VARIABLE_REVERSE_NAME, flowElement.getId());
								break;
							}
						}
					}
				}
				handleVariable.put(TowerConstant.VARIABLE_TASKSORT_NAME, taskSorts);
			}
		} catch (Exception e) {
			throw new CommonException("解析失败！");
		}
	}

	/**
	 * 根据KEY获取流程实例
	 * 
	 * @param userInfo
	 *            当前登录用户
	 * @return ProcessDefinition
	 */
	private ProcessDefinition getProcessDefinition(UserVo userInfo) {
		// 登录人所在地区查询流程
		String city = userInfo.getCityStr();
		String county = userInfo.getCountyStr();
		String queryKey = city + "-" + county + "-" + WorkflowConstant.PAGODADIMENSION;
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
	 * 查询任务列表
	 * 
	 * @param param
	 *            查询参数
	 * @param page
	 *            分页
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void queryFlow(TowerElectricityFlowVo param, PageUtil page) {
		UserVo userInfo = getLoginUser();
		if (userInfo == null) {
			throw new CommonException("请先登录！");
		}
		param.setCurOpUserID(userInfo.getUserId());
		List<TowerElectricityFlowVo> flows = new ArrayList<>();
		// 查询对象
		HistoricProcessInstanceQuery query = createHistoricQuery(param);
		// 设置总页数
//		page.setTotalRecord(query.count());
		// 查询数据
		// List<HistoricProcessInstance> processs =
		// query.listPage((page.getPageNo() - 1) * page.getPageSize(),
		// page.getPageSize());

		// 分页查询用户关联业务
		List<HistoricProcessInstance> processs = query.list();

		List<HashMap<String, String>> allMap = new ArrayList<>();

		List<String> oldEle = towerElectricityService.getOldEle(param);

		for (HistoricProcessInstance instance : processs) {
			HashMap<String, String> map = new HashMap<>();
			map.put("businessKey", instance.getBusinessKey());
			map.put("instanceId", instance.getId());
			allMap.add(map);
		}

		for (String businessKey : oldEle) {
			HashMap<String, String> map = new HashMap<>();
			map.put("businessKey", businessKey);
			map.put("instanceId", "");
			allMap.add(map);
		}

		// 设置总页数
		page.setTotalRecord(allMap.size());

		int pageNo = page.getPageNo();
		int pageSize = page.getPageSize();

		List<HashMap<String, String>> nowMap = new ArrayList<>();

		for (int i = 0; i < allMap.size(); i++) {

			if (i < pageNo * pageSize && i >= (pageNo - 1) * pageSize) {

				nowMap.add(allMap.get(i));
			}
		}

		for (HashMap<String, String> process : nowMap) {
			TowerElectricityFlowVo flow = new TowerElectricityFlowVo();
			flow.setCurOpUserID(param.getCurOpUserID());

			String businessKe = process.get("businessKey");
			String instanceId = process.get("instanceId");
			if (businessKe == null) {
				businessKe = "";
			}
			if (instanceId == null) {
				instanceId = "";
			}

			// 业务关联ID
			flow.setBusinessKey(businessKe);
			// 流程ID
			flow.setInstanceId(instanceId);
			// 设置流程的相关状态值
			handleOperation(flow);
			// 电费信息
			TowerSaveVO towerInfo = towerElectricityService.findOneByID(businessKe);
			if (null != towerInfo) {
				flow.setTowerInfo(towerInfo);
			}
			flows.add(flow);
		}
		page.setResults(flows);
	}

	/**
	 * 设置流程状态
	 * 
	 * @param vo
	 *            保存实体
	 */
	private void handleOperation(TowerElectricityFlowVo vo) {
		Task task = taskService.createTaskQuery().processInstanceId(vo.getInstanceId()).singleResult();
		handleOperation(task, vo);
	}

	/**
	 * 设置流程状态
	 * 
	 * @param task
	 *            任务
	 * @param vo
	 *            保存实体
	 */
	@SuppressWarnings("unchecked")
	private void handleOperation(Task task, TowerElectricityFlowVo vo) {
		if (task != null) {
			Map<String, Object> variables = runtimeService.getVariables(task.getProcessInstanceId());
			List<Map<String, String>> allSteps = (List<Map<String, String>>) variables
					.get(TowerConstant.VARIABLE_TASKSORT_NAME);
			String starUserId = variables.get(TowerConstant.VARIABLE_USERID_START).toString();
			Integer curFlowState = Integer.valueOf(variables.get(TowerConstant.FLOW_STATE_NAME).toString());
			String reverse = variables.get(TowerConstant.VARIABLE_REVERSE_NAME).toString();
			String serialNumber = variables.get(TowerConstant.SERIAL_NUMBER_NAME).toString();
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
			vo.setFlowState(TowerConstant.FLOW_STATE_END);
			vo.setOperation(false);
			vo.setReverse(false);
		}
	}

	/**
	 * 计算下次审批状态
	 * 
	 * @param allSteps
	 *            所有步骤
	 * @param curStep
	 *            当前步骤
	 * @return 审批状态
	 */
	private Integer nextFlowState(List<Map<String, String>> allSteps, String curStep, Integer approveState) {
		Integer nexState = -1;
		// 审批状态为通过，审批后流程为驳回
		if (approveState != null && approveState == -1) {
			nexState = TowerConstant.FLOW_STATE_REBUT;
		}
		// 审批后流程结束
		else if (approveState != null && approveState == 2) {
			nexState = TowerConstant.FLOW_STATE_END;
		}
		// 等待提交审批
		else if (allSteps.get(0).get(TowerConstant.VARIABLE_TASKID_NAME).equals(curStep)) {
			nexState = TowerConstant.FLOW_STATE_APPROVALING;
		}
		// 审批结束
		else if (allSteps.get(allSteps.size() - 1).get(TowerConstant.VARIABLE_TASKID_NAME).equals(curStep)) {
			nexState = TowerConstant.FLOW_STATE_END;
		}
		// 审批中
		else {
			nexState = TowerConstant.FLOW_STATE_APPROVALING;
		}
		return nexState;
	}

	/**
	 * 取得下级审批人ID
	 * 
	 * @param allSteps
	 *            所有步骤
	 * @param curStep
	 *            当前步骤
	 * @param approveState
	 *            审批状态
	 * @param starUserId
	 *            流程发起人
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
	 * 创建查询对象
	 * 
	 * @param flowVo
	 *            流程查询条件
	 * @return 查询对象
	 */
	private HistoricProcessInstanceQuery createHistoricQuery(TowerElectricityFlowVo flowVo) {

		HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery();
		// 当前用户关联的任务
		query.involvedUser(flowVo.getCurOpUserID());
		// 流程状态
		if (!StringUtils.isEmpty(flowVo.getFlowState())) {
			query.variableValueEquals(TowerConstant.FLOW_STATE_NAME, flowVo.getFlowState());
		}
		// 流水号查询
		if (!StringUtils.isEmpty(flowVo.getqSerialNumber())) {
			query.variableValueLike(TowerConstant.SERIAL_NUMBER_NAME, "%" + flowVo.getqSerialNumber() + "%");
		}
		// 城市查询
		if (!StringUtils.isEmpty(flowVo.getqCity())) {
			query.variableValueLike(TowerConstant.CITY_NAME, flowVo.getqCity());
		}
		// 区县查询
		if (!StringUtils.isEmpty(flowVo.getqCounty())) {
			query.variableValueLike(TowerConstant.COUNTY_NAME, flowVo.getqCounty());
		}
		// 铁塔站址编号
		if (!StringUtils.isEmpty(flowVo.getqCounterNumber())) {
			query.variableValueLike(TowerConstant.COUNTER_NUMBER_NAME, flowVo.getqCounterNumber());
		}
		// 资管站点名称
		if (!StringUtils.isEmpty(flowVo.getqCounterName())) {
			query.variableValueLike(TowerConstant.COUNTER_NAME, flowVo.getqCounterName());
		}
		// 超标状态
		if (!StringUtils.isEmpty(flowVo.getqOverState())) {
			query.variableValueLike(TowerConstant.OVER_STATE_NAME, flowVo.getqOverState().toString());
		}
		// 分担总金额
		if (!StringUtils.isEmpty(flowVo.getqShareMoney())) {
			query.variableValueEquals(TowerConstant.SHARE_MONEY_NAME, flowVo.getqShareMoney());
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
		// 当前处理人为自己的数据
		if (flowVo.isOperation()) {
			query.variableValueEquals(TowerConstant.VARIABLE_HANDLE_PERSON, flowVo.getCurOpUserID());
		}
		// 流程类型
		query.variableValueEquals(TowerConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.PAGODADIMENSION);
		// 降序排列
		query.orderByProcessInstanceStartTime().desc();

		return query;
	}

	/**
	 * 审批流程
	 * 
	 * @param instanceId
	 *            流程ID
	 * @param approveState
	 *            审批状态
	 */
	@Override
	public void approve(String instanceId, Integer approveState) {
		if (StringUtils.isEmpty(instanceId) || StringUtils.isEmpty(approveState)) {
			throw new CommonException("参数：流程ID或审批状态为空!");
		}
		UserVo user = getLoginUser();
		if (user == null) {
			throw new CommonException("请先登录！");
		}
		TowerElectricityFlowVo flow = new TowerElectricityFlowVo();
		flow.setCurOpUserID(user.getUserId());
		flow.setApproveState(approveState);
		Task task = taskService.createTaskQuery().processInstanceId(instanceId).singleResult();
		// 判断运行状态
		handleOperation(task, flow);
		// 前置判断
		auditBefore(flow, task);
		Map<String, Object> param = new HashMap<>();
		param.put("approved", flow.getApproveState());
		param.put(TowerConstant.VARIABLE_HANDLE_PERSON, flow.getNextUserID());
		param.put(TowerConstant.FLOW_STATE_NAME, flow.getNextFlowState());
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
			towerElectricityService.updateStatus(new String[] { flow.getBusinessKey() }, 3);
			sendMessage("您有一条塔维稽核单被驳回，请登录系统处理。", flow.getNextUserID());
			// 发送者账户信息
			UserVo receiverUser = userDao.queryUserByUserId(flow.getNextUserID());
			oAServiceImpl.handle(senderUser.getAccount(), receiverUser.getAccount(), flow.getqSerialNumber(), "被驳回");
		}
		// 审批结束
		else if (flow.getNextFlowState() == TowerConstant.FLOW_STATE_END) {
			towerElectricityService.updateStatus(new String[] { flow.getBusinessKey() }, 2);
			sendMessage("您有一条塔维稽核单审批通过，请登录系统生成电费提交单。", flow.getNextUserID());
		}
		// 审批中
		else {
			towerElectricityService.updateStatus(new String[] { flow.getBusinessKey() }, 1);
			sendMessage("您有一条塔维稽核单需要审批，请登录系统处理。", flow.getNextUserID());
			// 发送者账户信息
			UserVo receiverUser = userDao.queryUserByUserId(flow.getNextUserID());
			oAServiceImpl.handle(senderUser.getAccount(), receiverUser.getAccount(), flow.getqSerialNumber(), "待审批");
		}
	}

	/**
	 * 审批前的条件判断
	 * 
	 * @param flow
	 *            条件
	 */
	private void auditBefore(TowerElectricityFlowVo flow, Task task) {
		// 是否跳过最后一层审批
		if (flow.isReverse()) {
			// 判断接口
			ProcessInstanceQuery pQuery = runtimeService.createProcessInstanceQuery()
					.processInstanceId(task.getProcessInstanceId());
			ProcessInstance instance = pQuery.singleResult();
			// 未超标，则结束流程
			if (TowerConstant.NOT_EXCEED_STANDARD == overStandard(instance.getBusinessKey())) {
				flow.setApproveState(2);
				flow.setNextFlowState(TowerConstant.FLOW_STATE_END);
			}
		}
	}

	/**
	 * 超标状态值
	 * 
	 * @param businessKey
	 *            业务ID
	 * @return 是否超标 1:超标 -1:未超标
	 */
	private Integer overStandard(String businessKey) {
		ElectricityBenchmarkCheckVO benchmarkCheckVO = benchmarkService.queryOverBenchmarkTw(businessKey);
		if (benchmarkCheckVO == null || OVER_PROPORTION_STANDARD > benchmarkCheckVO.getOverProportion()) {
			return TowerConstant.NOT_EXCEED_STANDARD;
		}
		return TowerConstant.EXCEED_STANDARD;
	}

	/**
	 * 批量审批
	 * 
	 * @param instanceIds
	 *            流程IDS
	 * @param approveState
	 *            审批状态
	 */
	@Override
	public void batchApprove(String[] instanceIds, Integer approveState) {
		for (String instanceId : instanceIds) {
			approve(instanceId, approveState);
		}
	}

	/**
	 * 撤销流程
	 * 
	 * @param instanceId
	 *            流程ID
	 * @param reason
	 *            原因
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
		towerElectricityService.updateStatus(new String[] { businessKey }, 7);
		// 删除流程
		runtimeService.deleteProcessInstance(instanceId, reason);
		historyService.deleteHistoricProcessInstance(instanceId);
	}

	/**
	 * 更新流程
	 * 
	 * @param instanceId
	 *            流程ID
	 * @param towerSaveEntities
	 *            塔维实体
	 */
	@Override
	public void updateTask(String instanceId, TowerSaveEntities towerSaveEntities) {
		if (StringUtils.isEmpty(instanceId)) {
			throw new CommonException("参数：流程ID为空!");
		}
		ProcessInstance instance = runtimeService.createProcessInstanceQuery().processInstanceId(instanceId)
				.singleResult();
		String businessKey = instance.getBusinessKey();
		// 更新流程信息
		towerSaveEntities.setId(businessKey);
		UserVo userInfo = getLoginUser();
		towerElectricityService.updateElectricty(towerSaveEntities, userInfo);
		// 删除流程
		runtimeService.deleteProcessInstance(instanceId, "流程信息更新!");
		historyService.deleteHistoricProcessInstance(instanceId);
	}

	/**
	 * 查询历史审批
	 * 
	 * @param instanceId
	 *            流程ID
	 * @return 历史审批记录
	 */
	@Override
	public List<ApprovalDetailVo> queryApprovalDetails(String instanceId) {
		List<HistoricActivityInstance> activitys = historyService.createHistoricActivityInstanceQuery()
				.activityType("userTask").processInstanceId(instanceId).orderByHistoricActivityInstanceStartTime().asc()
				.list();

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
	 * 获取登录人
	 * 
	 * @return 登录人
	 */
	private UserVo getLoginUser() {
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		return (UserVo) session.getAttribute("user");
	}

	/**
	 * 查询待生成电费提交单记录
	 * 
	 * @param towerElectrictyEntities
	 *            查询参数
	 * @param page
	 *            分页
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void queryGenerated(TowerElectrictyEntities towerElectrictyEntities, PageUtil page) {
		UserVo userInfo = getLoginUser();
		towerElectrictyEntities.setStatuses(new String[] { "2" });
		towerElectricityService.queryList(page, towerElectrictyEntities, userInfo);
	}

	/**
	 * 查询待处理的财务高妙
	 * 
	 * @param record
	 *            参数
	 * @param page
	 *            分页
	 */
	@Override
	public void querySendInfo(TowerReimburseVo record, PageUtil<TowerReimburseVo> page) {
		Integer operationState = -1;
		// 登录人为经办人，则直接查询经办人的待办信息
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(TowerConstant.FLOW_BX_ROLE);
			operationState = 1;
		} catch (AuthorizationException e) {
			operationState = 0;
			UserVo user = getLoginUser();
			record.setUserId(user.getUserId());
		}
		// 查询
		towerReimburseService.queryPage(page, record);

		for (TowerReimburseVo vo : page.getResults()) {
			if (vo.getStatus() == operationState) {
				vo.setOperation(true);
			} else {
				vo.setOperation(false);
			}
		}
	}

	/**
	 * 查询待办数量
	 * 
	 * @return 待办数量
	 */
	@Override
	public Integer queryPendingApproval() {
		UserVo userInfo = getLoginUser();
		if (userInfo == null) {
			throw new CommonException("请先登录！");
		}
		return taskService.createTaskQuery().taskAssignee(userInfo.getUserId())
				.processVariableValueEquals(TowerConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.PAGODADIMENSION)
				.list().size();
	}

	/**
	 * 查询待处理电费提交数量
	 * 
	 * @return 待处理电费提交数量
	 */
	@Override
	public Double queryElectricityApproval() {
		TowerReimburseVo record = new TowerReimburseVo();
		PageUtil<TowerReimburseVo> page = new PageUtil<>();
		// 登录人为经办人，则直接查询经办人的待办信息
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(TowerConstant.FLOW_BX_ROLE);
			record.setStatus(1);
		} catch (AuthorizationException e) {
			record.setStatus(0);
		}
		// 查询
		towerReimburseService.queryPage(page, record);
		return Double.valueOf(page.getTotalRecord());
	}

	/**
	 * 查询流转图
	 * 
	 * @param instanceId
	 *            流程图
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
			if (TowerConstant.NOT_EXCEED_STANDARD == overStandard(busId)) {
				setps.remove(setps.size() - 1);
			}
		} catch (Exception e) {
//			throw new CommonException("查询失败!");
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
		TowerElectricityFlowVo flowVo = new TowerElectricityFlowVo();
		flowVo.setCurOpUserID(userInfo.getUserId());
		// 统计审批中人记录数
		flowVo.setFlowState(TowerConstant.FLOW_STATE_APPROVALING);
		HistoricProcessInstanceQuery query = createHistoricQuery(flowVo);
		Long approvalingNum = query.count();
		Map<String, String> curMap = new HashMap<>();
		curMap.put("name", "审批中");
		curMap.put("value", approvalingNum.toString());
		result.add(curMap);

		// 统计审批结束
		flowVo.setFlowState(TowerConstant.FLOW_STATE_END);
		query = createHistoricQuery(flowVo);
		Long endNum = query.count();
		curMap = new HashMap<>();
		curMap.put("name", "审批通过");
		curMap.put("value", endNum.toString());
		result.add(curMap);

		// 统计驳回
		flowVo.setFlowState(TowerConstant.FLOW_STATE_REBUT);
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
	 * @param message
	 *            消息
	 * @param userId
	 *            用户ID
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
}
