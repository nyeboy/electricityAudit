package com.audit.modules.payment.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.google.common.collect.Lists;

/**
 * @author : jiadu
 * @Description : 电费提交但VO
 * @date : 2017/3/17
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ElectricitySubmitVO implements Serializable{
    public List<AdvancePaymentVo> getAdpv() {
		return adpv;
	}

	public void setAdpv(List<AdvancePaymentVo> adpv) {
		this.adpv = adpv;
	}

	private static final long serialVersionUID = 9185304570412911763L;
    private String id;
    private String trustees;//经办人ID
    private String trusteesName;//经办人名称
    private String city;//城市ID
    private String county;//区县ID
    private Integer status;//状态（0.等待报销发起人推送财务1.等待推送财务 2.等待财务报销 3. 报销成功 4. 报销失败 5. 已撤销）
    private List<String> ids;//预付录入单IDS
	private Integer reimbursementType;//推送类型（0.报销）
    private String moneyAmount;//预付总金额
   
	private String supplierName; //供应商名字
    private Date createDate;//建单时间
    private String submitNo;//预付提交单号					
    private String startCreateDate;//开始时间（yyyy-MM-dd）页面查询用
    private String endCreateDate;//结束时间(yyyy-MM-dd)

    private String cityName ;
    private String countyName;
    
    // 是否具有操作权限
    private boolean operation;
    
    List<AdvancePaymentVo> adpv = Lists.newArrayList();//预付录入表单

    
    public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}

    public List<String> getIds() {
		return ids;
	}

	public void setIds(List<String> ids) {
		this.ids = ids;
	}

    
    
    public String getMoneyAmount() {
		return moneyAmount;
	}

	public void setMoneyAmount(String moneyAmount) {
		this.moneyAmount = moneyAmount;
	}


    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getCountyName() {
        return countyName;
    }

    public void setCountyName(String countyName) {
        this.countyName = countyName;
    }


    public String getStartCreateDate() {
        return startCreateDate;
    }

    public void setStartCreateDate(String startCreateDate) {
        this.startCreateDate = startCreateDate;
    }

    public String getEndCreateDate() {
        return endCreateDate;
    }

    public void setEndCreateDate(String endCreateDate) {
        this.endCreateDate = endCreateDate;
    }

    public String getSubmitNo() {
        return submitNo;
    }

    public String getTrusteesName() {
		return trusteesName;
	}

	public void setTrusteesName(String trusteesName) {
		this.trusteesName = trusteesName;
	}

	public void setSubmitNo(String submitNo) {
        this.submitNo = submitNo;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
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

    public String getTrustees() {
        return trustees;
    }

    public void setTrustees(String trustees) {
        this.trustees = trustees;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getReimbursementType() {
        return reimbursementType;
    }

    public void setReimbursementType(Integer reimbursementType) {
        this.reimbursementType = reimbursementType;
    }

	public boolean isOperation() {
		return operation;
	}

	public void setOperation(boolean operation) {
		this.operation = operation;
	}
}
