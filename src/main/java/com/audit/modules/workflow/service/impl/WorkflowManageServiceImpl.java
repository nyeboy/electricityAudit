package com.audit.modules.workflow.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Collection;
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
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Model;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.spring.SpringProcessEngineConfiguration;
import org.activiti.workflow.simple.converter.WorkflowDefinitionConversion;
import org.activiti.workflow.simple.converter.WorkflowDefinitionConversionFactory;
import org.activiti.workflow.simple.converter.json.SimpleWorkflowJsonConverter;
import org.activiti.workflow.simple.definition.HumanStepDefinition;
import org.activiti.workflow.simple.definition.WorkflowDefinition;
import org.activiti.workflow.simple.definition.form.FormDefinition;
import org.activiti.workflow.simple.definition.form.FormPropertyDefinition;
import org.activiti.workflow.simple.definition.form.TextPropertyDefinition;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.dao.UserDao;
import com.audit.modules.system.entity.SysDataVo;
import com.audit.modules.system.service.SystemDataService;
import com.audit.modules.workflow.dao.WorkflowManageDao;
import com.audit.modules.workflow.entity.FlowSetpVo;
import com.audit.modules.workflow.entity.WorkflowConstant;
import com.audit.modules.workflow.entity.WorkflowVo;
import com.audit.modules.workflow.service.WorkflowManageService;

/**
 * 流程模板管理服务
 * 
 * @author luoyun
 */
@Service
public class WorkflowManageServiceImpl implements WorkflowManageService {

	private static final String TABLE_EDITOR_CATEGORY = "table-editor";
	
	private static final String START_NODE_NAME = "流程提交人";
	
	@Autowired
	private RepositoryService repositoryService;
	
	@Autowired
	private SpringProcessEngineConfiguration processEngineConfiguration;
	
	@Autowired
	private SimpleWorkflowJsonConverter simpleWorkflowJsonConverter;

	@Autowired
	private WorkflowDefinitionConversionFactory workflowDefinitionConversionFactory;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private SystemDataService systemDataService;
	
	@Autowired
	private WorkflowManageDao workflowManageDao;
	
	/**
	 * 创建流程模板
	 * 
	 * @param vo 待创建模板
	 */
	@Override
	public void createModel(WorkflowVo vo) {
		if (StringUtils.isEmpty(vo.getCity()) || StringUtils.isEmpty(vo.getCounty())
				|| StringUtils.isEmpty(vo.getName()) || StringUtils.isEmpty(vo.getType())) {
			throw new CommonException("参数：流程名字、流程类型、地市、区县不全！");
		}
		// 处理流程名字
		handleAreaName(vo);
		//创建流程模板
		WorkflowDefinition workflowDefinition = createWorkflow(vo);//获取各个流程节点

		Model model = null;
		if (vo.getModelId() == null) {
			model = repositoryService.newModel();	//创建一个新的model
		} else {
			model = repositoryService.getModel(vo.getModelId());
		}
		//设置流程名
		model.setName(vo.getName());
		
		model.setCategory(TABLE_EDITOR_CATEGORY);
		model.setKey(vo.getCityStr() + "-" + vo.getCountyStr() + "-" + vo.getType().toString());
		repositoryService.saveModel(model);

		// model转换
		WorkflowDefinitionConversion conversion = workflowDefinitionConversionFactory
				.createWorkflowDefinitionConversion(workflowDefinition);//将对应的流程节点写进流程里
		conversion.convert();

		try {
			// 保存流程模型的二进制数据
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			simpleWorkflowJsonConverter.writeWorkflowDefinition(workflowDefinition,
					new OutputStreamWriter(baos, "UTF-8"));
			repositoryService.addModelEditorSource(model.getId(), baos.toByteArray());

			repositoryService.addModelEditorSourceExtra(model.getId(),
					IOUtils.toByteArray(processEngineConfiguration.getProcessDiagramGenerator().generateDiagram(
							conversion.getBpmnModel(), "png", processEngineConfiguration.getActivityFontName(),
							processEngineConfiguration.getLabelFontName(),
							processEngineConfiguration.getAnnotationFontName(),
							processEngineConfiguration.getClassLoader())));
			// 部署流程
			createFlow(model);
		} catch (IOException e) {
			throw new CommonException("创建流程模板失败！");
		}
	}
	
	/**
	 * 处理地区信息
	 * 
	 * @param vo 流程信息
	 */
	private void handleAreaName(WorkflowVo vo) {
		// 地市名字
		SysDataVo sysCityDataVo = systemDataService.queryCityInfo(vo.getCity());
		vo.setCityStr(sysCityDataVo.getValue().toString());
		// 区县
		SysDataVo sysCountyDataVo = systemDataService.queryCountyInfo(vo.getCounty());
		vo.setCountyStr(sysCountyDataVo.getValue().toString());
	}
	
	/**
	 * 转换城市、区县的ID
	 * 
	 * @param vo 流程信息
	 */
	private void handleAreaId(WorkflowVo vo) {
		Map<String, String> params = new HashMap<>();
		params.put("cityName", vo.getCityStr());
		params.put("countyName", vo.getCountyStr());
		SysDataVo sysCityDataVo = systemDataService.queryCityCounty(params);
		if (sysCityDataVo != null) {
			vo.setCity(sysCityDataVo.getKey());
			vo.setCounty(sysCityDataVo.getValue().toString());
		}
	}
	
	/**
	 * 创建工作流
	 * 
	 * @param vo 创建条件
	 * @return 工作流
	 */
	private WorkflowDefinition createWorkflow(WorkflowVo vo) {
		WorkflowDefinition workflow = new WorkflowDefinition();
		workflow.setName(vo.getName());			//设置流程名字

		String description = vo.getDesc();
		if (description != null && description.length() > 0) {
			workflow.setDescription(description);		//设置流程备注
		}
		//创建流程的审批步骤
		List<HumanStepDefinition> steps = getFlowSetps(vo);
		for (int i = 0; i < steps.size(); i++) {
			workflow.addStep(steps.get(i));
		}

		return workflow;
	}

	/**
	 * 创建审批步骤
	 * 
	 * @param vo 条件
	 * @return 审批步骤
	 */
	private List<HumanStepDefinition> getFlowSetps(WorkflowVo vo) {
		List<HumanStepDefinition> steps = new ArrayList<HumanStepDefinition>();
		// 发起流程节点(非基础数据变更),转供电也是属于基础数据
		if (!WorkflowConstant.BASICDATA.equals(vo.getType())&&!WorkflowConstant.PAGODATRANSELEPOWER.equals(vo.getType()) && !WorkflowConstant.TRANSELEPOWER.equals(vo.getType())) {
			HumanStepDefinition starHumanStepDefinition = new HumanStepDefinition();
			starHumanStepDefinition.setName(START_NODE_NAME);
			starHumanStepDefinition.setAssignee("${employee}");
			steps.add(starHumanStepDefinition);
		}
		// 可变节点
		buildStepDefinition(steps, vo.getVariableSetps());
		// 固定节点
		buildStepDefinition(steps, vo.getFixedSetps());
		return steps;
	}
	
	/**
	 * 
	 * 
	 * @param steps
	 * @param fowSteps
	 */
	private void buildStepDefinition(List<HumanStepDefinition> steps, List<FlowSetpVo> fowSteps) {
		for (FlowSetpVo setp : fowSteps) {
			HumanStepDefinition humanStepDefinition = new HumanStepDefinition();
			// 步骤名字
			String name = setp.getStepName();
			if (name != null && name.length() > 0) {
				humanStepDefinition.setName(name);	//设置步骤名字
			}
			// 审批人
			String assignee = setp.getApprover();
			if (assignee != null && assignee.length() > 0) {
				humanStepDefinition.setAssignee(assignee);	//设置步骤操作人
				
				FormDefinition form = new FormDefinition();
				FormPropertyDefinition propertyDefinition = new TextPropertyDefinition();
				propertyDefinition.setName(setp.getType().toString());	//type表示固定节点和流动节点
				form.addFormProperty(propertyDefinition);
				humanStepDefinition.setForm(form);
			}

			// 标示扭转结点
			if (setp.getType().equals(WorkflowConstant.VARIABLE) && setp.equals(fowSteps.get(fowSteps.size()-1))) {
				Map<String, Object> parameters = new HashMap<String, Object>();
				parameters.put("reverse", true);
				humanStepDefinition.setParameters(parameters);
			}
			steps.add(humanStepDefinition);
		}
	}
	
	/**
	 * 创建流和实例
	 * 
	 * @param modelData 模型数据
	 * @param modelByte 流程模型数据
	 */
	private void createFlow(Model modelData) {
		byte[] modelByte = repositoryService.getModelEditorSource(modelData.getId());
		// 转换对象
		WorkflowDefinition workflowDefinition = simpleWorkflowJsonConverter.readWorkflowDefinition(modelByte);
		// 更新modle名字
		modelData.setName(modelData.getName());
		workflowDefinition.setName(modelData.getName());
		workflowDefinition.setId(modelData.getKey());
		WorkflowDefinitionConversion conversion = workflowDefinitionConversionFactory
				.createWorkflowDefinitionConversion(workflowDefinition);
		// 部署
		String bpmnString = conversion.getBpmn20Xml();
		String processName = modelData.getName() + ".bpmn20.xml";
		repositoryService.createDeployment().name(modelData.getName()).addString(processName, bpmnString).deploy();
	}
	
	/**
	 * 查询流程模型
	 * 
	 * @param vo 查询参数
	 * @param pageVo 分页
	 * @return 流程模型
	 */
	@SuppressWarnings("rawtypes")
	@Override
	public List<WorkflowVo> queryModel(WorkflowVo params, PageUtil pageVo) {
		List<WorkflowVo> results = new ArrayList<>();
		pageVo.setObj(params);
		List<ProcessDefinition> definitions = workflowManageDao.queryFlowInfo(pageVo);
		for (ProcessDefinition definition : definitions) {
			WorkflowVo vo = new WorkflowVo();
			vo.setName(definition.getName());
			vo.setDesc(definition.getDescription());
			vo.setDefinitionId(definition.getId());
			String key = definition.getKey();
			if (!StringUtils.isEmpty(key) && key.split("-").length == 3) {
				vo.setCityStr(key.split("-")[0]);
				vo.setCountyStr(key.split("-")[1]);
				vo.setType(key.split("-")[2]);
			}
			
			// 转义类型
			switch (vo.getType()) {
			case WorkflowConstant.MANDIMENSION:
				vo.setTypeStr("自维");
				break;
			case WorkflowConstant.MANDIMENSIONPRE:
				vo.setTypeStr("自维预付");
				break;
			case WorkflowConstant.ZMANDIMENSION:
				vo.setTypeStr("自维综合电费");
				break;
			case WorkflowConstant.PAGODADIMENSION:
				vo.setTypeStr("塔维");
				break;
			case WorkflowConstant.BASICDATA:
				vo.setTypeStr("基础数据变更");
				break;
			case WorkflowConstant.TRANSELEPOWER:
				vo.setTypeStr("自维转供电");
				break;
			case WorkflowConstant.PAGODATRANSELEPOWER:
				vo.setTypeStr("塔维转供电");
				break;
			default:
				break;
			}
			
			results.add(vo);
		}
		return results;
	}
	
	/**
	 * 解析流程过程信息
	 * 
	 * @param definition 流程定义
	 * @param flow 流程定义
	 */
	private void analysisProcess(ProcessDefinition definition, WorkflowVo flow) {
		try {
			InputStream bpmnStream = repositoryService.getResourceAsStream(definition.getDeploymentId(),
					definition.getResourceName());
			XMLInputFactory xif = WorkflowXMLInputFactory.createSafeXmlInputFactory();
			InputStreamReader in = new InputStreamReader(bpmnStream, "UTF-8");
			XMLStreamReader xtr = xif.createXMLStreamReader(in);
			BpmnModel bpmnModel = new BpmnXMLConverter().convertToBpmnModel(xtr);

			List<Process> processes = bpmnModel.getProcesses();
			if (processes != null && !processes.isEmpty()) {
				Collection<FlowElement> flowElements = processes.get(0).getFlowElements();
				for (FlowElement flowElement : flowElements) {
					if (flowElement instanceof UserTask) {
						FlowSetpVo setp = new FlowSetpVo();
						UserTask task = (UserTask) flowElement;
						// 发起人节点，不展示
						if (START_NODE_NAME.equals(task.getName())) {
							continue;
						}
						// 设置步骤名
						setp.setStepName(task.getName());
						// 设置审批人
						setp.setApprover(task.getAssignee());
						setp.setUser(userDao.queryUserByUserId(task.getAssignee()));
						// 设置类型
						if (null != task.getFormProperties() && !task.getFormProperties().isEmpty()
								&& WorkflowConstant.FIXED.equals(task.getFormProperties().get(0).getName())) {
							setp.setType(task.getFormProperties().get(0).getName());
							flow.getFixedSetps().add(setp);
						} else {
							setp.setType(WorkflowConstant.VARIABLE);
							flow.getVariableSetps().add(setp);
						}
					}
				}
			}
		} catch (Exception e) {
			throw new CommonException("解析失败！");
		}
	}

	/**
	 * 查询详情
	 * 
	 * @param definitionId 模板实例ID
	 * @return 模板实例
	 */
	@Override
	public WorkflowVo queryDetail(String definitionId) {
		ProcessDefinition definition = repositoryService.createProcessDefinitionQuery()
				.processDefinitionId(definitionId).singleResult();
		WorkflowVo flow = new WorkflowVo();
		flow.setName(definition.getName());
		flow.setDesc(definition.getDescription());
		String key = definition.getKey();
		if (!StringUtils.isEmpty(key) && key.split("-").length == 3) {
			flow.setCityStr(key.split("-")[0]);
			flow.setCountyStr(key.split("-")[1]);
			flow.setType(key.split("-")[2]);
		}
		handleAreaId(flow);
		analysisProcess(definition, flow);
		return flow;
	}
}
