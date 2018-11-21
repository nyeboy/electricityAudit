package com.audit.modules.workflow.service.impl;

import java.io.IOException;
import java.io.StringReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jws.WebService;
import javax.xml.parsers.DocumentBuilder;

import org.apache.commons.lang3.StringUtils;
import org.apache.soap.util.xml.XMLParserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.audit.modules.common.utils.Log;
import com.audit.modules.electricity.entity.ElectricitySubmitVO;
import com.audit.modules.electricity.entity.TowerReimburseVo;
import com.audit.modules.electricity.service.ElectricitySubmitService;
import com.audit.modules.electricity.service.TowerReimburseService;
import com.audit.modules.payment.dao.AdvancePaymentDao;
import com.audit.modules.payment.dao.PreSubmitDao;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.payment.entity.PreSubmit;
import com.audit.modules.workflow.entity.FinanceExpenseResponse;

/**
 * 报销单-财务系统回调接口
 * 
 * @author luoyun
 */
@Component
@WebService(endpointInterface = "com.audit.modules.workflow.service.impl.FinanceExpenseCallback", serviceName = "financeExpenseCallback")
public class FinanceExpenseServiceImpl implements FinanceExpenseCallback {

	private static final String FINANCE_CALLBACK_FAILED = "FAILED";

	private static final String FINANCE_CALLBACK_SUCCESS = "SUCCESS";

	@Autowired
	private ElectricitySubmitService electricitySubmitService;

	@Autowired
	private TowerReimburseService towerReimburseService;
	@Autowired
	private PreSubmitDao preSubmitDao;
	@Autowired
	private AdvancePaymentDao adpvDao;

	/**
	 * 财务系统调用-推送报销结果-包括报销单和预付单
	 *
	 * @param xmlResult
	 * @return 执行结果
	 */
	@Override
	public FinanceExpenseResponse pushResult(String xmlResult) {
		// xml example
		/*
		 * String xmlResultTest = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
		 * + "<finance>\n" + "\t<expense>\n" +
		 * "\t\t<accountNo>报销单号</accountNo>\n" + "\t\t<type>PREPAY</type>\n" +
		 * "\t\t<status>状态</status>\n" + "\t\t<description>描述信息</description>\n"
		 * + "\t</expense>\n" + "</finance>";
		 */
		FinanceExpenseResponse response = new FinanceExpenseResponse();
		Log.debug("财务回调结果:" + xmlResult);
		if (StringUtils.isEmpty(xmlResult)) {
			response.setStatus(FINANCE_CALLBACK_FAILED);
			response.setCallbackResponse("xmlResult参数不空！");
			return response;
		}

		DocumentBuilder xdb = XMLParserUtils.getXMLDocBuilder();
		Document document = null;
		try {
			document = xdb.parse(new InputSource(new StringReader(xmlResult.toString())));

			// 目前只会有一条数据，所以直接取第一条数据
			NodeList typeElement = document.getElementsByTagName("type");
			NodeList accountNoElement = document.getElementsByTagName("accountNo");
			NodeList statusElement = document.getElementsByTagName("status");
			if (isNUll(typeElement)) {
				response.setStatus(FINANCE_CALLBACK_FAILED);
				response.setCallbackResponse("参数：type为空！");
				return response;
			}
			if (isNUll(accountNoElement)) {
				response.setStatus(FINANCE_CALLBACK_FAILED);
				response.setCallbackResponse("参数：accountNo为空！");
				return response;
			}
			if (isNUll(statusElement)) {
				response.setStatus(FINANCE_CALLBACK_FAILED);
				response.setCallbackResponse("参数：status为空！");
				return response;
			}
			String type = typeElement.item(0).getFirstChild().getNodeValue();
			String accountNo = accountNoElement.item(0).getFirstChild().getNodeValue();
			String status = statusElement.item(0).getFirstChild().getNodeValue();

			Integer statusNo = 3;
			if (!("SUCCESS".equals(status) || "FAILED".equals(status))) {
				Log.debug("推送失败:status错误");
				statusNo = 4;
			}

			// 预付
			if ("PREPAY".equals(type)) {
				//根据预付提交单号查找预付提交单
				PreSubmit preSubBySubNO = preSubmitDao.getPreSubBySubNO(accountNo);
				//如果预付提交单为空
				if(preSubBySubNO==null){
					response.setStatus(FINANCE_CALLBACK_FAILED);
					response.setCallbackResponse("自维预付，未找到对应流水号数据！");
					return response;
				}
				//修改预付提交单状态
				Map<String, Object> map=new HashMap<String,Object>();
				map.put("status",statusNo);
				map.put("ids",preSubBySubNO.getId());
				preSubmitDao.updateStatus(map);
				//根据预付提交单id查找得到预付单id
				List<String> spIds = preSubmitDao.getSpIds(preSubBySubNO.getId());
				//修改预付单状态（status 5）
				//预付提交单3. 报销成功 4. 报销失败 5. 已撤销
				//预付单 5、报销成功 6、报销失败 7、已撤销
				if(statusNo==3){
					for(int i=0;i<spIds.size();i++){
						AdvancePaymentVo adpv=new AdvancePaymentVo();
						adpv.setId(spIds.get(i));
						adpv.setStatus(5);
						adpvDao.updatePayment(adpv);
					}
				}else if(statusNo==4){
					for(int i=0;i<spIds.size();i++){
						AdvancePaymentVo adpv=new AdvancePaymentVo();
						adpv.setId(spIds.get(i));
						adpv.setStatus(6);
						adpvDao.updatePayment(adpv);
					}
				}
			}
			// 自维
			else if ("EXPENSE".equals(type) && accountNo.startsWith("BX")) {
				ElectricitySubmitVO vo = electricitySubmitService.queryBysubmitNo(accountNo);
				if (vo == null) {
					response.setStatus(FINANCE_CALLBACK_FAILED);
					response.setCallbackResponse("自维，未找到对应流水号数据！");
					return response;
				}
				electricitySubmitService.updateStatusByNo(statusNo, new String[] { accountNo });
			}
			// 塔维
			else if ("EXPENSE".equals(type) && accountNo.startsWith("TTBX")) {
				TowerReimburseVo vo = towerReimburseService.queryByNo(accountNo);
				if (vo == null) {
					response.setStatus(FINANCE_CALLBACK_FAILED);
					response.setCallbackResponse("塔维，未找到对应流水号数据！");
					return response;
				}
				towerReimburseService.updateByNo(new String[] { accountNo }, statusNo);
			}
			// 示知类型
			else {
				Log.debug("推送失败:type错误");
			}

			// 保存推送结果
			response.setStatus(FINANCE_CALLBACK_SUCCESS);
			response.setCallbackResponse("推送成功");
			Log.debug("推送成功");
			return response;
		} catch (SAXException e) {
			Log.error("推送失败", e);
			response.setStatus(FINANCE_CALLBACK_FAILED);
			response.setCallbackResponse("推送失败！");
			return response;
		} catch (IOException e) {
			Log.error("推送失败", e);
			response.setStatus(FINANCE_CALLBACK_FAILED);
			response.setCallbackResponse("推送失败！");
			return response;
		}
	}
	
	/**
	 * 判断参数是否有值
	 * 
	 * @param nodeList 节点
	 * @return true:空 false:不空
	 */
	private boolean isNUll(NodeList nodeList) {
		if (nodeList.item(0) == null || nodeList.item(0).getFirstChild() == null
				|| StringUtils.isEmpty(nodeList.item(0).getFirstChild().getNodeValue())) {
			return true;
		}
		return false;
	}
}
