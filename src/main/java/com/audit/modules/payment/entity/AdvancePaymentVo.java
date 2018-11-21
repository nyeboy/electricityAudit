package com.audit.modules.payment.entity;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.audit.modules.system.entity.SysFileVO;
import com.google.common.collect.Lists;

/**   
 * @Description : TODO(基站电费-预付提交Vo)    
 *
 * @author : chentao
 * @date : 2017年4月10日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class AdvancePaymentVo extends AdvancePaymentPo{
	
	//id
	private String id;
	//省id
	private String provinceId;
	//省
	private String provinceStr;
	//市id
	private String cityId;
	//市
	private String cityStr;
	//区/县id
	private String countyId;
	//区/县
	private String countyStr;
	//预付开始时间
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date startDate;
	
	private String sDate;
	private String eDate;
	
	//预付结束时间
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date endDate;
	//预付总金额
	private String totalMoney;
	//预付供应商id
	private String supplyId;
	//供应商名字
	private String supplyStr;
	private String talk;
	private String moneyAmount;//提交单里预付金额字段
	//供应商组织代码
	private String OrganizationCode;
	//供应商地点id
	private String regionCode;
	//合同id
	private String contractId;
	//建单时间
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date createDate;
	//状态
	private Integer status;
	//备注
	private String remark;
	//制单人
	private String submitMan;
	//制单人id
	private String submitManId;
	//预付申请批次号
	private String paymentNumber;
	// 部门名
	private String departmentName;
	//本次核销金额
	private String expenseAmount;
	


	// 部门id
	private String departmentId;
	//公司名
	private String name;
	//公司id
	private String companyId;
	
	private String[] attachmentId;
	//附件信息
	private List<SysFileVO> sysFileVOs = Lists.newArrayList();//附件信息（用于页面展示）
	//已核销金额
	private String canceledMoney;
	//流程中金额
	private String cancellingMoney; 
	//剩余预付金
	private String surplusMoney;
	private String ouName;
	
	//部门集合
		private List<String> departmentNameSum;
		public List<String> getDepartmentNameSum() {
			return departmentNameSum;
		}


		public void setDepartmentNameSum(List<String> departmentNameSum) {
			this.departmentNameSum = departmentNameSum;
		}
	
		public String getExpenseAmount() {
			return expenseAmount;
		}
		
		
		public void setExpenseAmount(String expenseAmount) {
			this.expenseAmount = expenseAmount;
		}
	public String getOuName() {
		return ouName;
	}


	public void setOuName(String ouName) {
		this.ouName = ouName;
	}


	public String getTalk() {
		return talk;
	}
	
	
	public String getCanceledMoney() {
		return canceledMoney;
	}


	public void setCanceledMoney(String canceledMoney) {
		this.canceledMoney = canceledMoney;
	}


	public String getCancellingMoney() {
		if(cancellingMoney==null || cancellingMoney.equals("")) {
			return "0";
		}
		return cancellingMoney;
	}


	public void setCancellingMoney(String cancellingMoney) {
		this.cancellingMoney = cancellingMoney;
	}


	public String getSurplusMoney() {
		return surplusMoney;
	}


	public void setSurplusMoney(String surplusMoney) {
		this.surplusMoney = surplusMoney;
	}


	public String getSubmitManId() {
		return submitManId;
	}

	public void setSubmitManId(String submitManId) {
		this.submitManId = submitManId;
	}

	public void setTalk(String talk) {
		this.talk = talk;
	}
	
	public String getsDate() {
		return sDate;
	}

	public void setsDate(String sDate) {
		this.sDate = sDate;
	}

	public String geteDate() {
		return eDate;
	}

	public void seteDate(String eDate) {
		this.eDate = eDate;
	}


	public List<SysFileVO> getSysFileVOs() {
		return sysFileVOs;
	}

	public void setSysFileVOs(List<SysFileVO> sysFileVOs) {
		this.sysFileVOs = sysFileVOs;
	}

	public String[] getAttachmentId() {
		return attachmentId;
	}
	
	public String getCompanyId() {
		return companyId;
	}

	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setAttachmentId(String[] attachmentId) {
		this.attachmentId = attachmentId;
	}

	public String getProvinceStr() {
		return provinceStr;
	}

	public void setProvinceStr(String provinceStr) {
		this.provinceStr = provinceStr;
	}

	public String getCityStr() {
		return cityStr;
	}
	
	
	public String getOrganizationCode() {
		return OrganizationCode;
	}

	public void setOrganizationCode(String organizationCode) {
		OrganizationCode = organizationCode;
	}

	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}

	public String getMoneyAmount() {
		return moneyAmount;
	}

	public void setMoneyAmount(String moneyAmount) {
		this.moneyAmount = moneyAmount;
	}

	public String getSupplyStr() {
		return supplyStr;
	}

	public void setSupplyStr(String supplyStr) {
		this.supplyStr = supplyStr;
	}


	public void setCityStr(String cityStr) {
		this.cityStr = cityStr;
	}

	public String getCountyStr() {
		return countyStr;
	}

	public void setCountyStr(String countyStr) {
		this.countyStr = countyStr;
	}
	
	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}

	public AdvancePaymentVo() {
		super();
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getProvinceId() {
		return provinceId;
	}
	public void setProvinceId(String provinceId) {
		this.provinceId = provinceId;
	}
	public String getCityId() {
		return cityId;
	}
	public void setCityId(String cityId) {
		this.cityId = cityId;
	}
	public String getCountyId() {
		return countyId;
	}
	public void setCountyId(String countyId) {
		this.countyId = countyId;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getTotalMoney() {
		return totalMoney;
	}
	public void setTotalMoney(String totalMoney) {
		this.totalMoney = totalMoney;
	}
	public String getSupplyId() {
		return supplyId;
	}
	public void setSupplyId(String supplyId) {
		this.supplyId = supplyId;
	}

	public String getContractId() {
		return contractId;
	}

	public void setContractId(String contractId) {
		this.contractId = contractId;
	}

	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getSubmitMan() {
		return submitMan;
	}
	public void setSubmitMan(String submitMan) {
		this.submitMan = submitMan;
	}

	public String getPaymentNumber() {
		return paymentNumber;
	}

	public void setPaymentNumber(String paymentNumber) {
		this.paymentNumber = paymentNumber;
	}

	
}
