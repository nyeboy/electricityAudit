package com.audit.modules.electricity.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.audit.modules.payment.entity.AdvancePaymentVo;
import com.audit.modules.system.entity.SysFileVO;
import com.google.common.collect.Lists;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * @author : jiadu
 * @Description : 电费VO
 * @date : 2017/3/7
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ElectrictyVO extends ElectricyBaseVO implements Serializable{

    private static final long serialVersionUID = -5359336196932507214L;
    private String id;
    private String serialNumber;//流水号
    private String contractID;//合同id
    private String instanceID;//流程Id
    private String areas;//地区
    private String counties;//区县
    private String sysAccountSiteId;//站点信息ID
    private String accountName;//报账点名称
    private String accountAlias;//报账点别名
    private String electricity;//电量
    private String amount;//金额
    private Integer status;//状态（0、等待提交审批 1、审批中 2、审批通过 3、审批驳回 4、报销中 5、报销成功 6、报销失败 7、已撤销 8、等待提交稽核）
    private Integer productNature;//产权性质（0.自维 1.塔维）
    private String costCenter;//成本中心
    private String costCenterID;//成本中心ID
    private String towerSiteNumber;// 铁塔站点编号
    private String billingCoefficient;//开票系数
    private String shareElectricity;//分摊电费金额
    private String invoiceType;//发票类型
    private String taxes;//税率
    private String taxAmount;//税金金额
    private String electricityAmount;//电费金额(不含税)
    private String otherCost;//其他费用
	private String totalAmount;//总金额(含税)
    private String expenseTotalAmount;//报销总金额
    private String paymentAmount;//支付总金额
    private String[] attachmentId;//附件ID
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date createDate;//建单时间
    private String price;//单价
    List<SysFileVO> sysFileVOs = Lists.newArrayList();//附件信息（用于页面展示）
    List<ElectrictyMidInvoice> electrictyMidInvoices = Lists.newArrayList();//发票信息
    List<ExpenseAccountDetails> expenseAccountDetails = Lists.newArrayList();//报销单明细信息
    private String submitPerson;//提交人ID
    private List<String> ids;//电费录入IDs
    private String sysRgName;//报账组名称
    private String sysRgID;
   

	private List<AdvancePaymentVo> adpv;//预付详情
    private String remark;//备注
    private String overproofReasons;//超标原因
    private String departmentName;//部门名
    //页面搜索条件
    private String cityId;
    private String countyId;

    private String totalEleciric;//总电量
   
    //建单人Id
    private String createPerson;
    //建单人(录入人员)
    private String inputPerson;
    
    //页面所需要查询的状态
    private String[] statuses ;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date createStartDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date createEndDate;
    private Integer payType;//缴费类型
    private String professional;//所属专业
    private Integer auditType;//稽核类型
    private String supplierName;//供应商名
    

    private String siteName;//站点名
    private String oldFinanceName;//原账务站点名
    private Boolean iswhite;
    private Boolean isNewEle;//是否是最后一次提交的电表
    private String isOnline;//在网 状态

    
    public String getIsOnline() {
		return isOnline;
	}

	public void setIsOnline(String isOnline) {
		this.isOnline = isOnline;
	}

	public List<AdvancePaymentVo> getAdpv() {
		return adpv;
	}

	public void setAdpv(List<AdvancePaymentVo> adpv) {
		this.adpv = adpv;
	}
    
	public Boolean getIsNewEle() {
		return isNewEle;
	}

	public void setIsNewEle(Boolean isNewEle) {
		this.isNewEle = isNewEle;
	}

	public Boolean getIswhite() {
		return iswhite;
	}

	public void setIswhite(Boolean iswhite) {
		this.iswhite = iswhite;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public String getOldFinanceName() {
		return oldFinanceName;
	}

	public void setOldFinanceName(String oldFinanceName) {
		this.oldFinanceName = oldFinanceName;
	}

	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}


	public String getInputPerson() {
		return inputPerson;
	}

	public void setInputPerson(String inputPerson) {
		this.inputPerson = inputPerson;
	}


	public Integer getPayType() {
		return payType;
	}

	public void setPayType(Integer payType) {
		this.payType = payType;
	}

	public String getProfessional() {
		return professional;
	}

	public void setProfessional(String professional) {
		this.professional = professional;
	}

	public Integer getAuditType() {
		return auditType;
	}

	public void setAuditType(Integer auditType) {
		this.auditType = auditType;
	}

	public String getInstanceID() {
		return instanceID;
	}

	public void setInstanceID(String instanceID) {
		this.instanceID = instanceID;
	}

	public List<ExpenseAccountDetails> getExpenseAccountDetails() {
		return expenseAccountDetails;
	}

	public void setExpenseAccountDetails(List<ExpenseAccountDetails> expenseAccountDetails) {
		this.expenseAccountDetails = expenseAccountDetails;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getContractID() {
		return contractID;
	}

	public void setContractID(String contractID) {
		this.contractID = contractID;
	}

	public String getOverproofReasons() {
		return overproofReasons;
	}
	

	public String getCreatePerson() {
		return createPerson;
	}

	public void setCreatePerson(String createPerson) {
		this.createPerson = createPerson;
	}

	public void setOverproofReasons(String overproofReasons) {
		this.overproofReasons = overproofReasons;
	}

	public String getTotalEleciric() {
        return totalEleciric;
    }

    public void setTotalEleciric(String totalEleciric) {
        this.totalEleciric = totalEleciric;
    }

    public String getSysRgID() {
		return sysRgID;
	}

	public void setSysRgID(String sysRgID) {
		this.sysRgID = sysRgID;
	}

	public Date getCreateStartDate() {
        return createStartDate;
    }

    public void setCreateStartDate(Date createStartDate) {
        this.createStartDate = createStartDate;
    }

    public Date getCreateEndDate() {
        return createEndDate;
    }

    public void setCreateEndDate(Date createEndDate) {
        this.createEndDate = createEndDate;
    }

    public String getCountyId() {
        return countyId;
    }

    public void setCountyId(String countyId) {
        this.countyId = countyId;
    }

    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId;
    }


    public String[] getStatuses() {
        return statuses;
    }

    public void setStatuses(String[] statuses) {
        this.statuses = statuses;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }



    public List<ElectrictyMidInvoice> getElectrictyMidInvoices() {
        return electrictyMidInvoices;
    }

    public void setElectrictyMidInvoices(List<ElectrictyMidInvoice> electrictyMidInvoices) {
        this.electrictyMidInvoices = electrictyMidInvoices;
    }

    public String getSysRgName() {
        return sysRgName;
    }

    public void setSysRgName(String sysRgName) {
        this.sysRgName = sysRgName;
    }

    public List<String> getIds() {
        return ids;
    }

    public void setIds(List<String> ids) {
        this.ids = ids;
    }

    public String getSubmitPerson() {
        return submitPerson;
    }

    public void setSubmitPerson(String submitPerson) {
        this.submitPerson = submitPerson;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public List<SysFileVO> getSysFileVOs() {
        return sysFileVOs;
    }

    public void setSysFileVOs(List<SysFileVO> sysFileVOs) {
        this.sysFileVOs = sysFileVOs;
    }

    public String getSysAccountSiteId() {
        return sysAccountSiteId;
    }

    public void setSysAccountSiteId(String sysAccountSiteId) {
        this.sysAccountSiteId = sysAccountSiteId;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getAreas() {
        return areas;
    }

    public void setAreas(String areas) {
        this.areas = areas;
    }

    public String getCounties() {
        return counties;
    }

    public void setCounties(String counties) {
        this.counties = counties;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountAlias() {
        return accountAlias;
    }

    public void setAccountAlias(String accountAlias) {
        this.accountAlias = accountAlias;
    }

    public String getElectricity() {
        return electricity;
    }

    public void setElectricity(String electricity) {
        this.electricity = electricity;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getProductNature() {
        return productNature;
    }

    public void setProductNature(Integer productNature) {
        this.productNature = productNature;
    }

    public String getCostCenter() {
        return costCenter;
    }

    public void setCostCenter(String costCenter) {
        this.costCenter = costCenter;
    }

    public String getTowerSiteNumber() {
        return towerSiteNumber;
    }

    public void setTowerSiteNumber(String towerSiteNumber) {
        this.towerSiteNumber = towerSiteNumber;
    }

    public String getBillingCoefficient() {
        return billingCoefficient;
    }

    public void setBillingCoefficient(String billingCoefficient) {
        this.billingCoefficient = billingCoefficient;
    }

    public String getShareElectricity() {
        return shareElectricity;
    }

    public void setShareElectricity(String shareElectricity) {
        this.shareElectricity = shareElectricity;
    }

    public String getInvoiceType() {
        return invoiceType;
    }

    public void setInvoiceType(String invoiceType) {
        this.invoiceType = invoiceType;
    }

    public String getTaxes() {
        return taxes;
    }

    public void setTaxes(String taxes) {
        this.taxes = taxes;
    }

    public String getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(String taxAmount) {
        this.taxAmount = taxAmount;
    }

    public String getElectricityAmount() {
        return electricityAmount;
    }

    public void setElectricityAmount(String electricityAmount) {
        this.electricityAmount = electricityAmount;
    }

    public String getOtherCost() {
        return otherCost;
    }

    public void setOtherCost(String otherCost) {
        this.otherCost = otherCost;
    }

    public String getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(String totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getExpenseTotalAmount() {
        return expenseTotalAmount;
    }

    public void setExpenseTotalAmount(String expenseTotalAmount) {
        this.expenseTotalAmount = expenseTotalAmount;
    }

    public String getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(String paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public String[] getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(String[] attachmentId) {
        this.attachmentId = attachmentId;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    private Integer startRow;
    private Integer endRow;

    public Integer getStartRow() {
        return startRow;
    }

    public void setStartRow(Integer startRow) {
        this.startRow = startRow;
    }

    public Integer getEndRow() {
        return endRow;
    }

    public void setEndRow(Integer endRow) {
        this.endRow = endRow;
    }

	public String getCostCenterID() {
		return costCenterID;
	}

	public void setCostCenterID(String costCenterID) {
		this.costCenterID = costCenterID;
	}
}
