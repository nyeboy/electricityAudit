package com.audit.modules.payment.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.audit.modules.invoice.entity.InvoiceVO;
import com.audit.modules.watthourmeter.entity.WatthourExtendVO;
import com.google.common.collect.Lists;

/**
 * @author : jiadu
 * @Description : 保存预付单
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ElectrictySaveVO implements Serializable{

    private static final long serialVersionUID = -5359336196932507214L;
    private String id;
    private String serialNumber;//流水号
//    private String sysAccountSiteId;//站点信息ID
    private Integer status;//状态（0.已保存1.已提交 2.已撤销 3.待推送 4.已推送）
//    private String costCenterID;//成本中心ID
//    private String towerSiteNumber;// 铁塔站点编号
//    private String shareElectricity;//分摊电费金额
//    private String otherCost;//其他费用
    private String totalAmount;//总金额
//    private String expenseTotalAmount;//核销总金额
//    private String paymentAmount;//支付总金额
    private String[] attachmentId;//附件ID
    private Date updateDate;//修改时间
    private Date createDate;//建单时间
    private String submitPerson;//提交人ID
    private String createPerson;//建单人ID
    private String sysSupplierID;//供应商ID
//    private String sysRgID;//报账组ID
    private String contractID;//合同ID
    private String departmentName;//部门名
    private String remark;//备注
//    private String overproofReasons;//超标原因
       
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

//	public String getOverproofReasons() {
//		return overproofReasons;
//	}
//
//	public void setOverproofReasons(String overproofReasons) {
//		this.overproofReasons = overproofReasons;
//	}

	public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }



//    public String getSysRgID() {
//        return sysRgID;
//    }
//
//    public void setSysRgID(String sysRgID) {
//        this.sysRgID = sysRgID;
//    }


    public String getSysSupplierID() {
        return sysSupplierID;
    }

    public void setSysSupplierID(String sysSupplierID) {
        this.sysSupplierID = sysSupplierID;
    }

    public String getCreatePerson() {
        return createPerson;
    }

    public void setCreatePerson(String createPerson) {
        this.createPerson = createPerson;
    }

    public String getSubmitPerson() {
        return submitPerson;
    }

    public void setSubmitPerson(String submitPerson) {
        this.submitPerson = submitPerson;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
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

//    public String getSysAccountSiteId() {
//        return sysAccountSiteId;
//    }
//
//    public void setSysAccountSiteId(String sysAccountSiteId) {
//        this.sysAccountSiteId = sysAccountSiteId;
//    }

    public Integer getStatus() {
        if(status==null){
            status=0;
        }
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

//    public String getCostCenterID() {
//        return costCenterID;
//    }
//
//    public void setCostCenterID(String costCenterID) {
//        this.costCenterID = costCenterID;
//    }
//
//    public String getTowerSiteNumber() {
//        return towerSiteNumber;
//    }
//
//    public void setTowerSiteNumber(String towerSiteNumber) {
//        this.towerSiteNumber = towerSiteNumber;
//    }
//
//    public String getShareElectricity() {
//        return shareElectricity;
//    }
//
//    public void setShareElectricity(String shareElectricity) {
//        this.shareElectricity = shareElectricity;
//    }
//
//    public String getOtherCost() {
//        return otherCost;
//    }
//
//    public void setOtherCost(String otherCost) {
//        this.otherCost = otherCost;
//    }

    public String getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(String totalAmount) {
        this.totalAmount = totalAmount;
    }

//    public String getExpenseTotalAmount() {
//        return expenseTotalAmount;
//    }
//
//    public void setExpenseTotalAmount(String expenseTotalAmount) {
//        this.expenseTotalAmount = expenseTotalAmount;
//    }
//
//    public String getPaymentAmount() {
//        return paymentAmount;
//    }
//
//    public void setPaymentAmount(String paymentAmount) {
//        this.paymentAmount = paymentAmount;
//    }

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
}
