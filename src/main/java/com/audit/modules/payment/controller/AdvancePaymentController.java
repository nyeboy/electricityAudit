package com.audit.modules.payment.controller;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.activiti.engine.repository.ProcessDefinition;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSON;
import com.audit.filter.exception.CommonException;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.payment.entity.ElectricitySubmitVO;
import com.audit.modules.payment.entity.Sepcc;
import com.audit.modules.payment.service.AdvancePaymentService;
import com.audit.modules.payment.service.PreSubmitService;
import com.audit.modules.supplier.service.SupplierService;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.workflow.service.PrepayWorkflowService;
import com.google.common.collect.Maps;

/**   
 * @Description : TODO(基站电费-预付提交：基础操作接口)    
 *
 * @author : chentao
 * @date : 2017年4月10日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/
@RequestMapping("advancePayment")
@Controller
public class AdvancePaymentController {

	
	private static final String UserVo = null;
	@Autowired
	private AdvancePaymentService advancePayment;
	@Autowired
	private PreSubmitService psService;
	@Autowired
	private PrepayWorkflowService prepayWorkflowService;
	 
	@Autowired
	private SupplierService sService;
	
	
	//获得预付单申请批号
		@RequestMapping("getprepayID")
		@ResponseBody
		public ResultVO getprepayID(HttpServletRequest request){
			HttpSession session = request.getSession();
			UserVo uv=(UserVo)session.getAttribute("user");
			//后台自动生成流水单号
			AdvancePaymentVo apv=new AdvancePaymentVo();
			String paymentnumber="";
			SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMddHHmmss");
			String date = sdf.format(new Date());
			int num=(int)((Math.random()*9+1)*100000); 
			paymentnumber=paymentnumber+"YF"+date+num;
			apv.setPaymentNumber(paymentnumber);
			apv.setProvinceStr(uv.getProvinceStr());
			apv.setCityStr(uv.getCityStr());
			apv.setCountyStr(uv.getCountyStr());
			String proId="";
			if(uv.getProvinceStr()!=null &&uv.getProvinceStr()!=""){
				proId = advancePayment.getProId(new Sepcc("",uv.getProvinceStr(), "", ""));
			}else {
				proId = "1";
			}
			apv.setProvinceId(proId);
			String citId = advancePayment.getCitId(new Sepcc(proId, "", uv.getCityStr(), ""));
			apv.setCityId(citId);
			String couId="";
			if(uv.getCountyStr()!=null &&uv.getCountyStr()!=""){
				couId = advancePayment.getCouId(new Sepcc(citId,"" , "", uv.getCountyStr()));
			}
			//设置经办人id
			apv.setSubmitManId(uv.getUserId());
			apv.setCountyId(couId);
			apv.setSubmitMan(uv.getUserName());
			apv.setDepartmentName(uv.getDepartmentName());
			apv.setDepartmentNameSum(uv.getDepartmentNameSum());
			apv.setDepartmentId(uv.getDepartmentId());
			return ResultVO.success(apv);
		}
		
		
		//保存预付单
		@RequestMapping("prepayAdd")
		@ResponseBody
		public ResultVO savePrepayAdd(HttpServletRequest request,String str){
			AdvancePaymentVo adPay = JSON.parseObject(str,AdvancePaymentVo.class);
			System.out.println(adPay.getAttachmentId()[0]);
			//看状态是保存还是提交1保存2提交
			//提交
			//获得供应商id	
			String supplyId = adPay.getSupplyId();
			//最新的预付开始时间
			Date startDate = adPay.getStartDate();
			//最新的预付结束时间
			Date endDate = adPay.getEndDate();
			int codeById = sService.getCodeById(supplyId);
			String code = String.valueOf(codeById);
			List<AdvancePaymentVo> adpvs = advancePayment.getOneBySupplyId(code);
			for(AdvancePaymentVo adpv:adpvs){
				//数据库中已经存在的预付单预付开始时间
				Date startDate2 = adpv.getStartDate();
				//数据库中已经存在的预付单预付结束时间
				Date endDate2 = adpv.getEndDate();
				//判断最新预付开始时间是否存在冲突
				if(startDate.getTime() >= startDate2.getTime() && startDate.getTime() <= endDate2.getTime() && adpv.getStatus()!=7) {
					return ResultVO.failed("该供应商的预付单中已存在该预付单的起始时间");
				}
				if(endDate.getTime() >= startDate2.getTime() && endDate.getTime() <= endDate2.getTime() && adpv.getStatus()!=7) {
					return ResultVO.failed("该供应商的预付单中已存在该预付单的终止时间");
				}
				
				
				
//				if(adpv.getStatus()!=5){
//					return ResultVO.success("已存在该供应商预付单，待提交或在审批流程中");
//				}
//				if(adpv.getStatus()==5){
//					if(Double.parseDouble(adpv.getSurplusMoney())>0d){
//						return ResultVO.success("预付的钱还没核销完");
//					}
//				}
			}
				adPay.setSupplyId(code);
				
				
//				Subject subject = SecurityUtils.getSubject();
//				Session session = subject.getSession();
				HttpSession session = request.getSession();
				UserVo uv=(UserVo)session.getAttribute("user");
				
				UserVo userInfo = (UserVo) session.getAttribute("user");
				if (StringUtils.isEmpty(userInfo)) {
					throw new CommonException("请先登录!");
				}
				// 定义流程实例
				ProcessDefinition processDefinition = prepayWorkflowService.getProcessDefinition(userInfo);
				if (StringUtils.isEmpty(processDefinition)) {
					throw new CommonException("未找到对应的流程,请联系管理员创建对应地区的流程!");
				}
				
				
				
				int i = advancePayment.prepayAdd(adPay);
				if(i>0){
					//流程代码
					AdvancePaymentVo one = advancePayment.getOne(adPay);
					String id = one.getId();
//					HttpSession session = request.getSession();
//					UserVo uv=(UserVo)session.getAttribute("user");
					//获取流程
					prepayWorkflowService.startFlow(id);
					Map<String, String> paramterMap = Maps.newHashMap();
					paramterMap.put("id", id);
					paramterMap.put("submitMan", uv.getUserName());
					//修改提交人
					int j = advancePayment.updateSubmitMan(paramterMap);
					if(j>0){
						return ResultVO.success("提交成功");
					}else{
						return ResultVO.failed("提交失败");
					}
				}else{
					return ResultVO.failed("预付单保存失败");
				}
				
				
			
			
		}
		
		
		//根据id查找预付单详情
		@RequestMapping("getViewPrepayDetails")
		@ResponseBody
		public ResultVO getViewPrepayDetails(HttpServletRequest request){
			String id = request.getParameter("id");
			AdvancePaymentVo adpv = advancePayment.getViewPrepayDetails(id);
			return ResultVO.success(adpv);
		}
		
		
		
		/**
		 * @param :
		 * @return :
		 * @throws
		 * @Description: 修改预付状态
		 */
		public ResultVO updateStatus(String id, Integer status) {
			if (id == null || "".equals(id) || status == null) {
				return ResultVO.failed("ID或状态值不能为空！");
			}
			Map<String, String> paraMap = Maps.newHashMap();
			paraMap.put("id", id);
			paraMap.put("status", status + "");
			advancePayment.updateStatus(paraMap);
			return ResultVO.success();
		}

		
		
	
	/**
	 * @Description 查询预付列表
	 * @param page 分页查询条件
	 * @return 预付信息list
	 * */
		@RequestMapping("queryList")
		@ResponseBody
	    public ResultVO queryList(HttpServletRequest request, AdvancePaymentVo adpv) {
	        PageUtil<AdvancePaymentVo> page = new PageUtil<>();
	        Object object = request.getSession().getAttribute("userInfo");
	        UserVo userInfo = null;
	        if (object != null) {
	            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
	        }
	        String pageNo = request.getParameter("pageNo");
	        String pageSize = request.getParameter("pageSize");
	        if (pageNo != null && !"".equals(pageNo) && pageSize != null && !"".equals(pageSize)) {
	            page.setPageNo(Integer.parseInt(pageNo));
	            page.setPageSize(Integer.parseInt(pageSize));
	        }
	        advancePayment.queryList(page, adpv, userInfo);
	        return ResultVO.success(page);
	    }
		
		
		
		/**
		 * @Description 查询预付列表
		 * @param page 分页查询条件
		 * @return 预付信息list
		 * */
//		@RequestMapping("queryPaymentByPage")
//		@ResponseBody
//		public ResultVO queryPaymentByPage(AdvancePaymentVo params) {
//			System.out.println(params.getStatus());
//			if (params == null) {
//				return ResultVO.failed("查询失败");
//			}
//			PageUtil<AdvancePaymentVo> page = new PageUtil<AdvancePaymentVo>();
//			if (params != null) {
//				page.setObj(params);
//			}
//			advancePayment.queryPaymentByPage(page);
//			return ResultVO.success(page);
//		}
		
		
		
		
	/*@RequestMapping("queryPaymentByPage")
	@ResponseBody
	public ResultVO queryPaymentByPage(AdvancePaymentVo aPaymentVo) {
		if (aPaymentVo == null) {
			return ResultVO.failed("查询失败");
		}
		PageUtil<AdvancePaymentVo> page = new PageUtil<AdvancePaymentVo>();
		if (aPaymentVo != null) {
			page.setObj(aPaymentVo);
		}
		advancePayment.queryPaymentByPage(page);
		return ResultVO.success(page);
	}*/
	
	/**
	 * @Description  删除被选中预付信息
	 * @param paymentNumber 预付申请批次号
	 * @return 返回操作状态/信息
	 * */
	@RequestMapping("deletePaymentById")
	@ResponseBody
	public ResultVO deletePaymentById(String[] paymentNumber) {
		
		return advancePayment.deletePaymentById(paymentNumber);
	}
	
	/**
	 * @Description  更新预付信息 
	 * @param aPaymentVo 预付对象
	 * @return 返回操作状态/信息
	 * */
	@RequestMapping("updatePayment")
	@ResponseBody
	public ResultVO updatePayment(AdvancePaymentVo aPaymentVo) {
		
		return advancePayment.updatePayment(aPaymentVo);
	}
	
	/**
	 * @Description 添加预付信息
	 * @param aPaymentVo 预付对象
	 * @return 返回操作状态/信息
	 * */
	@RequestMapping("addPayment")
	@ResponseBody
	public ResultVO addPayment(@RequestParam("files") MultipartFile [] files, AdvancePaymentVo aPaymentVo,HttpServletRequest request) {
		
		return advancePayment.addPayment(files,aPaymentVo,request);
	}
	
	
	/**
	 * @Description  提交、驳回(更新状态/备注) 
	 * @param paymentNumber 预付申请批单号
	 * @param status 预付单状态
	 * @return 返回操作状态/信息
	 * */
	public ResultVO submitOrReject(String paymentNumber, Integer status ,String remark) {
		
		return	advancePayment.submitOrReject(paymentNumber, status, remark);
		 
	}
	
	/**
	 * @Description  批量提交预付单(至流程) 
	 * @param paymentNumber 预付申请批单号
	 * @param status 预付单状态
	 * @return 返回操作状态/信息
	 * */
	public ResultVO submitPayment(String account, String [] paymentNumber) {
		
//		advancePayment.updateStatus(account,paymentNumber);
		return	null;
		 
	}
	
	//保存意见
	@RequestMapping("saveTalk")
	@ResponseBody
	public ResultVO saveTalk(HttpServletRequest request){
		String id = request.getParameter("id");
		String talk = request.getParameter("talks");
		Map<String, String> map=new HashMap<String,String>();
		map.put("id", id);
		map.put("talk",talk);
		int i = advancePayment.upTalk(map);
		if(i>0){
			return ResultVO.success();
		}else{
			return ResultVO.failed("意见提交失败");
		}
		
	}
	
	
	
	 /**
     * @param :
     * @return :
     * @throws
     * @Description: 生成预付提交单
     */
    @RequestMapping("/createtePreSubmit")
    @ResponseBody
    public ResultVO createteEleSubmit(ElectricitySubmitVO electricitySubmitVO, HttpServletRequest request) {
        return psService.createEleSubmit(electricitySubmitVO, request);
    }
    
    
    /**
     * @param : 预付提交表单ID
     * @return :
     * @throws
     * @Description: 查看详情
     */
    @RequestMapping("/queryDetail")
    @ResponseBody
    public ResultVO queryDetail(String subID) {
    	
        return ResultVO.success(psService.queryDetail(subID));
    }
    
    //根据供应商Id查找预付单
    @RequestMapping("getPreBySuId")
    @ResponseBody
    public ResultVO getOneByUserId(HttpServletRequest request){
    	//supplyId  ==code
    	Map<String, String> map=new HashMap<String,String>();
    	map.put("supplyId", request.getParameter("supplyId"));
    	map.put("supplierRegionCode", request.getParameter("supplierRegionCode"));
    /*	map.put("cityId", request.getParameter("cityId"));
    	map.put("countyId", request.getParameter("countyId"));*/
    	List<AdvancePaymentVo> oneByUserId = advancePayment.getOneByUserId(map);
    	return ResultVO.success(oneByUserId);
    }
    
    //查询登录扔要处理预付单数量
    @RequestMapping("queryPreNum")
    @ResponseBody
    public int getPreNum(HttpServletRequest request){
    	HttpSession session = request.getSession();
    	UserVo uv=(UserVo)session.getAttribute("user");
    	int preNum = advancePayment.getPreNum(uv.getUserId());
    	return preNum;
    }
    
    //查询登录扔要处理预付单数量
    @RequestMapping("queryPreSNum")
    @ResponseBody
    public int getPreSNum(HttpServletRequest request){
    	HttpSession session = request.getSession();
    	UserVo uv=(UserVo)session.getAttribute("user");
    	int preNum = advancePayment.getPreSNum(uv.getUserId());
    	return preNum;
    }
    
    //查询登录扔要处理预付单数量
    @RequestMapping("queryPreCNum")
    @ResponseBody
    public int getPreCNum(HttpServletRequest request){
    	HttpSession session = request.getSession();
    	UserVo uv=(UserVo)session.getAttribute("user");
    	int preNum = advancePayment.getPreCNum(uv.getUserId());
    	return preNum;
    }
	
}
