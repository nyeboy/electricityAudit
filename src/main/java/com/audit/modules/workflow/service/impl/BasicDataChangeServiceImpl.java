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
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.audit.filter.exception.CommonException;
import com.audit.modules.basedata.dao.AccountSiteTransDao;
import com.audit.modules.basedata.entity.AccountSiteNeedTrans;
import com.audit.modules.basedata.entity.AccountSiteTrans;
import com.audit.modules.basedata.entity.AccountSiteTransSubmit;
import com.audit.modules.basedata.entity.DataModifyApply;
import com.audit.modules.basedata.entity.TransEleFile;
import com.audit.modules.basedata.service.AccountSiteTransService;
import com.audit.modules.basedata.service.DataModifyApplyService;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.dao.UserDao;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.towerbasedata.trans.dao.TowerTransDao;
import com.audit.modules.towerbasedata.trans.entity.TowerNeedTrans;
import com.audit.modules.towerbasedata.trans.entity.TowerTransEleFile;
import com.audit.modules.towerbasedata.trans.entity.TowerTransSubmitVO;
import com.audit.modules.workflow.entity.ApprovalDetailVo;
import com.audit.modules.workflow.entity.BasicDataVo;
import com.audit.modules.workflow.entity.BasicFlowConstant;
import com.audit.modules.workflow.entity.WorkflowConstant;
import com.audit.modules.workflow.service.BasicDataChangeService;

/**
 * 基础数据变更
 * 
 * @author luoyun
 */
@Service
public class BasicDataChangeServiceImpl implements BasicDataChangeService {

	/** 流程承接人 */
	private static final String EMPLOYEE = "employee";
	
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
	private UserDao userDao;
	
	@Autowired
	private DataModifyApplyService dataModifyApplyService;
	
	//自维转供电dao
	@Autowired
	private AccountSiteTransDao accountSiteTransDao;
	
	//塔维转供电dao
	@Autowired
	private TowerTransDao towerTransDao;
	/**
	 * 基础数据启动流程
	 * 
	 * @param busId 业务ID
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
			throw new CommonException("未找到对应的流程!");
		}
		// 设置流程相关参数
		Map<String, Object> params = handleOtherVariable(userInfo, busId);
		handledefinitionVariable(processDefinition, params);
		// 启动流程
		runtimeService.startProcessInstanceById(processDefinition.getId(), busId, params);
	}
	
	/**
	 * 自维获取流程id并保存
	 * 
	 * @param busId 业务ID
	 */
	@Override
	public String getInstanceByApplyId(String busId,AccountSiteTransSubmit accountSiteTransSubmit) {
		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceBusinessKey(busId).singleResult();
//		processInstance.getActivityId();
//		processInstance.getBusinessKey();
		//把流程id保存到表中
		String instanceId = processInstance.getProcessInstanceId();
		accountSiteTransSubmit.setInstanceId(instanceId);
		accountSiteTransDao.updateInstanceIdByApplyId(accountSiteTransSubmit);
		return instanceId;
//		List<Task> task = taskService.createTaskQuery().processInstanceBusinessKey(processInstance.getBusinessKey()).list();
//		List<Task> task2 = taskService.createTaskQuery().processInstanceBusinessKey(busId).list();
	
	}
	
	/**
	 * 塔维获取流程id并保存
	 * 
	 * @param busId 业务ID
	 */
	@Override
	public String getTowerInstanceByApplyId(String busId,TowerTransSubmitVO towerTransSubmitVO) {
		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceBusinessKey(busId).singleResult();
//		processInstance.getActivityId();
//		processInstance.getBusinessKey();
		//把流程id保存到表中
		String instanceId = processInstance.getProcessInstanceId();
		towerTransSubmitVO.setInstanceId(instanceId);
		towerTransDao.updateInstanceIdByApplyId(towerTransSubmitVO);
		return instanceId;
//		List<Task> task = taskService.createTaskQuery().processInstanceBusinessKey(processInstance.getBusinessKey()).list();
//		List<Task> task2 = taskService.createTaskQuery().processInstanceBusinessKey(busId).list();
	
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
		//在这里要判断转供电的流程，基本和basedata一致
		String queryKey = city + "-" + county + "-" + WorkflowConstant.BASICDATA;
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
	 * 设置参数
	 * 
	 * @param userInfo 当前登录人
	 * @param busId 业务ID
	 * @return 参数
	 */
	private Map<String, Object> handleOtherVariable(UserVo userInfo, String busId) {
		Map<String, Object> handleVariable = new HashMap<>();
		// 流程提交人
		handleVariable.put(EMPLOYEE, userInfo.getUserId());
		handleVariable.put("approved", 1);
		// 流程类型
		handleVariable.put(BasicFlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.BASICDATA);
		// 设置业务相关查询
		DataModifyApply applyInfo = dataModifyApplyService.selectByPrimaryKey(busId);
		// 设置发起人
		handleVariable.put(BasicFlowConstant.VARIABLE_SPONSOR_NAME, applyInfo.getApplyUserId());
		// 变更类型
		handleVariable.put(BasicFlowConstant.APPLY_CHANGE_TYPE, applyInfo.getChangeType());
		// 城市
		handleVariable.put(BasicFlowConstant.VARIABLE_CITY_NAME, applyInfo.getCityId());
		// 区县
		handleVariable.put(BasicFlowConstant.VARIABLE_COUNTY_NAME, applyInfo.getCountyId());
		return handleVariable;
	}
	
	/**
	 * 基础数据处理流程定义
	 * 
	 * @param definition 流程定义
	 * @param handleVariable 变量
	 */
	private void handledefinitionVariable(ProcessDefinition definition, Map<String, Object> handleVariable) {
		try {
			InputStream bpmnStream = repositoryService.getResourceAsStream(definition.getDeploymentId(),
					definition.getResourceName());
			XMLInputFactory xif = WorkflowXMLInputFactory.createSafeXmlInputFactory();
			InputStreamReader in = new InputStreamReader(bpmnStream, "UTF-8");
			XMLStreamReader xtr = xif.createXMLStreamReader(in);
			BpmnModel bpmnModel = new BpmnXMLConverter().convertToBpmnModel(xtr);

			String lastNode = "";
			List<Process> processes = bpmnModel.getProcesses();
			if (processes != null && !processes.isEmpty()) {
				Collection<FlowElement> flowElements = processes.get(0).getFlowElements();
				for (FlowElement flowElement : flowElements) {
					if (flowElement instanceof UserTask) {
						lastNode = flowElement.getId();
					}
				}
				handleVariable.put(BasicFlowConstant.LAST_NODE_NAME, lastNode);
			}
		} catch (Exception e) {
			throw new CommonException("解析失败！");
		}
	}
	/**
	 * 转供电---------处理流程定义
	 * 
	 * @param definition 流程定义
	 * @param handleVariable 变量
	 */
	private void transHandledefinitionVariable(ProcessDefinition definition, Map<String, Object> handleVariable) {
		try {
			InputStream bpmnStream = repositoryService.getResourceAsStream(definition.getDeploymentId(),
					definition.getResourceName());
			XMLInputFactory xif = WorkflowXMLInputFactory.createSafeXmlInputFactory();
			InputStreamReader in = new InputStreamReader(bpmnStream, "UTF-8");
			XMLStreamReader xtr = xif.createXMLStreamReader(in);
			BpmnModel bpmnModel = new BpmnXMLConverter().convertToBpmnModel(xtr);

			String lastNode = "";
			List<Process> processes = bpmnModel.getProcesses();
			if (processes != null && !processes.isEmpty()) {
				Collection<FlowElement> flowElements = processes.get(0).getFlowElements();
				for (FlowElement flowElement : flowElements) {
					if (flowElement instanceof UserTask) {
						lastNode = flowElement.getId();
					}
				}
				handleVariable.put(BasicFlowConstant.LAST_NODE_NAME, lastNode);
			}
		} catch (Exception e) {
			throw new CommonException("解析失败！");
		}
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
	 * 查询待办任务
	 * 
	 * @param param 查询参数
	 * @param pageVo 分页
	 * @return 待办任务
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void queryFlowPage(BasicDataVo param, PageUtil pageVo) {
		List<BasicDataVo> zwInfos = new ArrayList<>();//自维数据
		List<BasicDataVo> twInfos = new ArrayList<>();//塔维数据
		TaskQuery query = createHistoricQuery(param);
		// 设置总页数,不在这里设置了,细化到自维塔维中去
//		pageVo.setTotalRecord(query.count());
		
		//注意区分自维塔维，需要增加字段做判断

		// 分页查询用户关联业务
		List<Task> tasks = query.listPage((pageVo.getPageNo() - 1) * pageVo.getPageSize(), pageVo.getPageSize());
		for (Task task : tasks) {
			
			ProcessInstance instance = runtimeService.createProcessInstanceQuery()
					.processInstanceId(task.getProcessInstanceId()).singleResult();
			BasicDataVo zwInfo = new BasicDataVo();//自维
			BasicDataVo twInfo = new BasicDataVo();//塔维
				//自维塔维数据区分
				DataModifyApply dataModifyApply = dataModifyApplyService.selectByPrimaryKey(instance.getBusinessKey());
				
				if(dataModifyApply.getMobileType() == "0" || dataModifyApply.getMobileType().equals("0")){//自维
					if(!dataModifyApply.getChangeType().equals("转供电信息") && dataModifyApply.getChangeType() != "转供电信息"){
						// 流程 ID
						zwInfo.setInstanceId(task.getProcessInstanceId());
						// 业务ID
						zwInfo.setBusinessKey(instance.getBusinessKey());
						// 业务实体信息
						
						zwInfo.setAataModifyApply(dataModifyApply);
						
						zwInfos.add(zwInfo);
					}
				}else{//塔维
					if(!dataModifyApply.getChangeType().equals("塔维转供电信息") && dataModifyApply.getChangeType() != "塔维转供电信息"){
						// 流程 ID
						twInfo.setInstanceId(task.getProcessInstanceId());
						// 业务ID
						twInfo.setBusinessKey(instance.getBusinessKey());
						// 业务实体信息
						
						twInfo.setAataModifyApply(dataModifyApply);
						
						twInfos.add(twInfo);
					}
				}
				
				
		}
		if(param.getMobileType() == "0" || param.getMobileType().equals("0")){
			pageVo.setTotalRecord(zwInfos.size());
			pageVo.setResults(zwInfos);
		}else{
			pageVo.setTotalRecord(twInfos.size());
			pageVo.setResults(twInfos);
		}
		
	}
	
	/**
	 * 自维转供电-------------查询转供电待办任务
	 * 
	 * @param param 查询参数
	 * @param pageVo 分页
	 * @return 待办任务
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void queryTransFlowPage(AccountSiteTransSubmit param, PageUtil pageVo) {
		List<AccountSiteTransSubmit> zwInfos = new ArrayList<>();//自维数据
		//转供电设置查询参数
		TaskQuery query = transCreateHistoricQuery(param);
		// 分页查询用户关联业务,与审批相关
		List<Task> tasks = query.listPage((pageVo.getPageNo() - 1) * pageVo.getPageSize(), pageVo.getPageSize());
		
		//说明是审批人
		for (Task task : tasks) {
			
			ProcessInstance instance = runtimeService.createProcessInstanceQuery()
					.processInstanceId(task.getProcessInstanceId()).singleResult();
			if(param.getMobileType() == "0" || param.getMobileType().equals("0")){//自维
				//通过id查询操作申请,查出必要数据
				AccountSiteTransSubmit accountSiteTransSubmit = accountSiteTransDao.selectByPrimaryKey(instance.getBusinessKey());
				//需要查出转供电的详细信息，因为保存在sys_zgroom_trans_mid中
				AccountSiteNeedTrans needTrans = new AccountSiteNeedTrans();
			    needTrans = accountSiteTransDao.findDataByInstancdId(task.getProcessInstanceId());
			    if(needTrans!=null){
			    	//查出附件信息
			    	String onlyId = needTrans.getOnlyId();//onlyId就是文件id
			    	List<TransEleFile> fileDatas = accountSiteTransDao.queryFileByOnlyId(onlyId);
			    	needTrans.setTransEleFiles(fileDatas);
			    	accountSiteTransSubmit.setNeedTrans(needTrans);
			    }
				if(accountSiteTransSubmit!=null && !accountSiteTransSubmit.equals("")){
					zwInfos.add(accountSiteTransSubmit);
				}
			}
		}
		if(param.getMobileType() == "0" || param.getMobileType().equals("0")){
			pageVo.setTotalRecord(zwInfos.size());
			pageVo.setResults(zwInfos);
		}
		
	}
	
	/**
	 * 塔维转供电-------------查询转供电待办任务
	 * 
	 * @param param 查询参数
	 * @param pageVo 分页
	 * @return 待办任务
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void queryTowerTransFlowPage(TowerTransSubmitVO param, PageUtil pageVo) {
		List<TowerTransSubmitVO> twInfos = new ArrayList<>();//塔维数据
		//转供电设置查询参数
		TaskQuery query = towerTransCreateHistoricQuery(param);
		// 分页查询用户关联业务,与审批相关
		List<Task> tasks = query.listPage((pageVo.getPageNo() - 1) * pageVo.getPageSize(), pageVo.getPageSize());
		//说明是审批人
		for (Task task : tasks) {
			ProcessInstance instance = runtimeService.createProcessInstanceQuery()
					.processInstanceId(task.getProcessInstanceId()).singleResult();
			if(param.getMobileType() == "1" || param.getMobileType().equals("1")){//塔维
				//通过id查询操作申请,查出必要数据
				TowerTransSubmitVO towerTransSubmitVO = towerTransDao.selectByPrimaryKey(instance.getBusinessKey());
				//需要查出转供电的详细信息，因为保存在sys_zgroom_tower_trans_mid中
				TowerNeedTrans tNeedTrans = new TowerNeedTrans();
				tNeedTrans = towerTransDao.findDataByInstancdId(task.getProcessInstanceId());
			    if(tNeedTrans!=null){
			    	//查出附件信息
			    	String onlyId = tNeedTrans.getOnlyId();//onlyId就是文件id
			    	List<TowerTransEleFile> fileDatas = towerTransDao.queryFileByOnlyId(onlyId);
			    	tNeedTrans.setTransEleFiles(fileDatas);
			    	towerTransSubmitVO.setTowerNeedTrans(tNeedTrans);
			    }
				if(towerTransSubmitVO!=null && !towerTransSubmitVO.equals("")){
					twInfos.add(towerTransSubmitVO);
				}
			}
		}
		//塔维
		if(param.getMobileType() == "1" || param.getMobileType().equals("1")){
			pageVo.setTotalRecord(twInfos.size());
			pageVo.setResults(twInfos);
		}
		
	}
	
	
	/**
	 * 自维转供电生成查询条件
	 * 
	 * @param param 查询参数
	 * @return 查询条件
	 */
	private TaskQuery transCreateHistoricQuery(AccountSiteTransSubmit param) {

		TaskQuery query = taskService.createTaskQuery();
		// 当前用户关联的任务,当前处理人id
		query.taskAssignee(param.getTrusteesId());
		// 查询地市
		if (!StringUtils.isEmpty(param.getCityName())) {
			query.processVariableValueEquals(BasicFlowConstant.VARIABLE_CITY_NAME, param.getCityName());
		}
		// 查询区县
		if (!StringUtils.isEmpty(param.getCountyName())) {
			query.processVariableValueEquals(BasicFlowConstant.VARIABLE_COUNTY_NAME, param.getCountyName());
		}
		// 发起人
		//暂时不用
		
		// 流程类型
		query.processVariableValueEquals(BasicFlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.TRANSELEPOWER);
		// 降序排列
		query.orderByTaskCreateTime().desc();

		return query;
	}
	
	
	/**
	 * 塔维转供电生成查询条件
	 * 
	 * @param param 查询参数
	 * @return 查询条件
	 */
	private TaskQuery towerTransCreateHistoricQuery(TowerTransSubmitVO param) {

		TaskQuery query = taskService.createTaskQuery();
		// 当前用户关联的任务,当前处理人id
		query.taskAssignee(param.getTrusteesId());
		// 查询地市
		if (!StringUtils.isEmpty(param.getCityName())) {
			query.processVariableValueEquals(BasicFlowConstant.VARIABLE_CITY_NAME, param.getCityName());
		}
		// 查询区县
		if (!StringUtils.isEmpty(param.getCountyName())) {
			query.processVariableValueEquals(BasicFlowConstant.VARIABLE_COUNTY_NAME, param.getCountyName());
		}
		// 发起人
		//暂时不用
		
		// 流程类型
		query.processVariableValueEquals(BasicFlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.PAGODATRANSELEPOWER);
		// 降序排列
		query.orderByTaskCreateTime().desc();

		return query;
	}
	
	/**
	 * 基础数据生成查询条件
	 * 
	 * @param param 查询参数
	 * @return 查询条件
	 */
	private TaskQuery createHistoricQuery(BasicDataVo param) {

		TaskQuery query = taskService.createTaskQuery();
		// 当前用户关联的任务
		query.taskAssignee(param.getCurOpUserID());
		// 查询地市
		if (!StringUtils.isEmpty(param.getCity())) {
			query.processVariableValueEquals(BasicFlowConstant.VARIABLE_CITY_NAME, param.getCity());
		}
		// 查询区县
		if (!StringUtils.isEmpty(param.getCounty())) {
			query.processVariableValueEquals(BasicFlowConstant.VARIABLE_COUNTY_NAME, param.getCounty());
		}
		// 指定变更类型
		if (!StringUtils.isEmpty(param.getChangeType())) {
			query.processVariableValueEquals(BasicFlowConstant.VARIABLE_CHANGE_TYPE, param.getChangeType());
		}
		// 发起人
		if (!StringUtils.isEmpty(param.getSponsor())) {
			query.processVariableValueEquals(BasicFlowConstant.VARIABLE_SPONSOR_NAME, param.getSponsor());
		}
		// 流程类型
		query.processVariableValueEquals(BasicFlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.BASICDATA);
		// 降序排列
		query.orderByTaskCreateTime().desc();

		return query;
	}

	/**
	 * 基础数据审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 */
	@Override
	public void auditElectricityFlow(String instanceId, Integer approveState) {
		if (StringUtils.isEmpty(instanceId) || StringUtils.isEmpty(approveState)) {
			throw new CommonException("参数：流程ID或审批状态为空!");
		}
		Task task = taskService.createTaskQuery().processInstanceId(instanceId).singleResult();
		ProcessInstance instance = runtimeService.createProcessInstanceQuery().processInstanceId(instanceId).singleResult();
		Map<String, Object> params = new HashMap<>();
		params.put("approved", approveState);
		String lastNode = runtimeService.getVariable(instanceId, BasicFlowConstant.LAST_NODE_NAME).toString();
		DataModifyApply record = new DataModifyApply();
		// 不通过，需要设置批注
		if (approveState == -1) {
			record.setId(instance.getBusinessKey());
			record.setChangeStatus("2");
			taskService.addComment(task.getId(), instanceId, "驳回");//设置批注，可以在后面查到
			dataModifyApplyService.updateByPrimaryKeySelective(record);
			runtimeService.deleteProcessInstance(instanceId, "驳回");
			
		}
		// 通过并且是最后的审批节点
		else if (task.getTaskDefinitionKey().equals(lastNode)) {
			taskService.addComment(task.getId(), instanceId, "审批通过");//设置批注
			dataModifyApplyService.executeApply(instance.getBusinessKey());
			taskService.complete(task.getId(), params);
		} else {
			//中间节点审批
			taskService.addComment(task.getId(), instanceId, "审批通过");//设置批注
			taskService.complete(task.getId(), params);
		}
	}
	/**
	 * 自维转供电------------审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 */
	@Override
	public void transApprovalDataModify(String instanceId, Integer approveState) {
		if (StringUtils.isEmpty(instanceId) || StringUtils.isEmpty(approveState)) {
			throw new CommonException("参数：流程ID或审批状态为空!");
		}
		Task task = taskService.createTaskQuery().processInstanceId(instanceId).singleResult();
		ProcessInstance instance = runtimeService.createProcessInstanceQuery().processInstanceId(instanceId).singleResult();
		Map<String, Object> params = new HashMap<>();
		params.put("approved", approveState);
		String lastNode = runtimeService.getVariable(instanceId, BasicFlowConstant.LAST_NODE_NAME).toString();
		AccountSiteTransSubmit reData = new AccountSiteTransSubmit();
		// 不通过，需要设置批注
		if (approveState == -1) {
			reData.setApplyId(instance.getBusinessKey());
			reData.setStatus("2");//审批失败状态
			reData.setInstanceId(instanceId);
			taskService.addComment(task.getId(), instanceId, "驳回");//设置批注，可以在后面查到
			//转供电更新申请信息
			//1，SYS_ZGROOM_TRANS_MID中SUBMIT_STATUS，1 , 已提交至下一级  2 被撤回  3 改造完成   4，审批失败 null '' 未提交
			//2，SYS_TRANSELEPOWER_SUBMIT中STATUS变更状态:0:待审批,1：审批通过，2：审批失败
			dataModifyApplyService.transUpdateByPrimaryKeySelective(reData);
			runtimeService.deleteProcessInstance(instanceId, "驳回");//删除流程中的id
			
		}
		// 通过并且是最后的审批节点
		else if (task.getTaskDefinitionKey().equals(lastNode)) {
			taskService.addComment(task.getId(), instanceId, "审批通过");//设置批注
			//通过业务id发送url请求
			dataModifyApplyService.transExecuteApply(instance.getBusinessKey());
//			dataModifyApplyService.executeApply(instance.getBusinessKey());
			taskService.complete(task.getId(), params);
		} else {
			//中间节点审批
			taskService.addComment(task.getId(), instanceId, "审批通过");//设置批注
			taskService.complete(task.getId(), params);
		}
	}
	
	/**
	 * 塔维转供电------------审批流程
	 * 
	 * @param instanceId 流程ID
	 * @param approveState 审批状态
	 */
	@Override
	public void towerTransApprovalDataModify(String instanceId, Integer approveState) {
		if (StringUtils.isEmpty(instanceId) || StringUtils.isEmpty(approveState)) {
			throw new CommonException("参数：流程ID或审批状态为空!");
		}
		Task task = taskService.createTaskQuery().processInstanceId(instanceId).singleResult();
		ProcessInstance instance = runtimeService.createProcessInstanceQuery().processInstanceId(instanceId).singleResult();
		Map<String, Object> params = new HashMap<>();
		params.put("approved", approveState);
		String lastNode = runtimeService.getVariable(instanceId, BasicFlowConstant.LAST_NODE_NAME).toString();
		TowerTransSubmitVO reData = new TowerTransSubmitVO();
		// 不通过，需要设置批注
		if (approveState == -1) {
			reData.setApplyId(instance.getBusinessKey());
			reData.setStatus("2");//审批失败状态
			reData.setInstanceId(instanceId);
			taskService.addComment(task.getId(), instanceId, "驳回");//设置批注，可以在后面查到
			//转供电更新申请信息
			//1，SYS_ZGROOM_TRANS_MID中SUBMIT_STATUS，1 , 已提交至下一级  2 被撤回  3 改造完成   4，审批失败 null '' 未提交
			//2，SYS_TRANSELEPOWER_SUBMIT中STATUS变更状态:0:待审批,1：审批通过，2：审批失败
			dataModifyApplyService.towerTransUpdateByPrimaryKeySelective(reData);
			runtimeService.deleteProcessInstance(instanceId, "驳回");//删除流程中的id
			
		}
		// 通过并且是最后的审批节点
		else if (task.getTaskDefinitionKey().equals(lastNode)) {
			taskService.addComment(task.getId(), instanceId, "审批通过");//设置批注
			//通过业务id发送url请求
			dataModifyApplyService.towerTransExecuteApply(instance.getBusinessKey());
//			dataModifyApplyService.executeApply(instance.getBusinessKey());
			taskService.complete(task.getId(), params);
		} else {
			//中间节点审批
			taskService.addComment(task.getId(), instanceId, "审批通过");//设置批注
			taskService.complete(task.getId(), params);
		}
	}
	
	/**
	 * 查询审批过程,通过流程id可以查询出数据---查询流转图用的
	 * 
	 * @param instanceId 流程ID
	 * @return 审批过程
	 */
	@Override
	public List<ApprovalDetailVo> queryApprovalDetails(String instanceId) {
		//这里要判断instanceId是否为空
		List<ApprovalDetailVo> failtails = new ArrayList<>();
		if(instanceId==null ||instanceId.equals("")){
			return failtails;
		}
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
			//基础数据审批时没有批注，所以获取不到批注值
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
	
	//根据流程id删除流程
	@Override
	public void deleteByInstanceId(String instanceId) {
		runtimeService.deleteProcessInstance(instanceId, "删除数据");
	}
	
	/**
	 * 自维转供电----------启动流程
	 * 
	 * @param busId 业务ID
	 */
	@Override
	public void tranStartFlow(String busId) {
		if (StringUtils.isEmpty(busId)) {
			throw new CommonException("参数：业务ID为空!");
		}
		UserVo userInfo = getLoginUser();
		if (StringUtils.isEmpty(userInfo)) {
			throw new CommonException("请先登录!");
		}
		// 定义流程实例
		ProcessDefinition processDefinition = getTransProcessDefinition(userInfo);
		if (StringUtils.isEmpty(processDefinition)) {
			throw new CommonException("未找到对应的流程!");
		}
		// 转供电设置流程相关参数
		Map<String,Object> params = transHandleOtherVariable(userInfo,busId);
		//转供电处理流程定义
		transHandledefinitionVariable(processDefinition, params);
		// 启动流程
		runtimeService.startProcessInstanceById(processDefinition.getId(), busId, params);
	}
	
	/**
	 * 塔维转供电----------启动流程
	 * 
	 * @param busId 业务ID
	 */
	@Override
	public void towerTranStartFlow(String busId) {
		if (StringUtils.isEmpty(busId)) {
			throw new CommonException("参数：业务ID为空!");
		}
		UserVo userInfo = getLoginUser();
		if (StringUtils.isEmpty(userInfo)) {
			throw new CommonException("请先登录!");
		}
		// 定义流程实例
		ProcessDefinition processDefinition = getTowerTransProcessDefinition(userInfo);
		if (StringUtils.isEmpty(processDefinition)) {
			throw new CommonException("未找到对应的流程!");
		}
		// 转供电设置流程相关参数
		Map<String,Object> params = towerTransHandleOtherVariable(userInfo,busId);
		//转供电处理流程定义
		transHandledefinitionVariable(processDefinition, params);
		// 启动流程
		runtimeService.startProcessInstanceById(processDefinition.getId(), busId, params);
	}
	
	/**
	 * 自维转供电根据KEY获取流程实例
	 * 
	 * @param flowKey
	 * @return ProcessDefinition
	 */
	private ProcessDefinition getTransProcessDefinition(UserVo userInfo) {
		// 登录人所在地区查询流程
		String city = userInfo.getCityStr();
		String county = userInfo.getCountyStr();
		//在这里要判断转供电的流程
		String queryKey = city + "-" + county + "-" + WorkflowConstant.TRANSELEPOWER;
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
	 * 塔维转供电根据KEY获取流程实例
	 * 
	 * @param flowKey
	 * @return ProcessDefinition
	 */
	private ProcessDefinition getTowerTransProcessDefinition(UserVo userInfo) {
		// 登录人所在地区查询流程
		String city = userInfo.getCityStr();
		String county = userInfo.getCountyStr();
		//在这里要判断转供电的流程
		String queryKey = city + "-" + county + "-" + WorkflowConstant.PAGODATRANSELEPOWER;
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
	 * 自维转供电设置参数
	 * 
	 * @param userInfo 当前登录人
	 * @param busId 业务ID
	 * @return 参数
	 */
	private Map<String, Object> transHandleOtherVariable(UserVo userInfo, String busId) {
		Map<String, Object> handleVariable = new HashMap<>();
		// 流程提交人
		handleVariable.put(EMPLOYEE, userInfo.getUserId());
		handleVariable.put("approved", 1);
		// 流程类型
		handleVariable.put(BasicFlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.TRANSELEPOWER);
		// 转供电设置业务相关查询
		AccountSiteTransSubmit applyInfo = accountSiteTransDao.selectByPrimaryKey(busId);
		// 设置发起人
		handleVariable.put(BasicFlowConstant.VARIABLE_SPONSOR_NAME, applyInfo.getTrusteesId());
		// 城市
		handleVariable.put(BasicFlowConstant.VARIABLE_CITY_NAME, applyInfo.getCityId());
		// 区县
		handleVariable.put(BasicFlowConstant.VARIABLE_COUNTY_NAME, applyInfo.getCountyId());
		return handleVariable;
	}
	
	/**
	 * 塔维转供电设置参数
	 * 
	 * @param userInfo 当前登录人
	 * @param busId 业务ID
	 * @return 参数
	 */
	private Map<String, Object> towerTransHandleOtherVariable(UserVo userInfo, String busId) {
		Map<String, Object> handleVariable = new HashMap<>();
		// 流程提交人
		handleVariable.put(EMPLOYEE, userInfo.getUserId());
		handleVariable.put("approved", 1);
		// 流程类型
		handleVariable.put(BasicFlowConstant.VARIABLE_TASKSORT_TYPE, WorkflowConstant.PAGODATRANSELEPOWER);
		// 塔维转供电设置业务相关查询
		TowerTransSubmitVO applyInfo = towerTransDao.selectByPrimaryKey(busId);
		// 设置发起人
		handleVariable.put(BasicFlowConstant.VARIABLE_SPONSOR_NAME, applyInfo.getTrusteesId());
		// 城市
		handleVariable.put(BasicFlowConstant.VARIABLE_CITY_NAME, applyInfo.getCityId());
		// 区县
		handleVariable.put(BasicFlowConstant.VARIABLE_COUNTY_NAME, applyInfo.getCountyId());
		return handleVariable;
	}
}
