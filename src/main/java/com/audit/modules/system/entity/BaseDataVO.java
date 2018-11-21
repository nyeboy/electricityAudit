package com.audit.modules.system.entity;

import java.io.Serializable;
import java.util.List;

import com.audit.modules.contract.entity.ContractVO;
import com.audit.modules.electricity.entity.DeviceVO;
import com.audit.modules.site.entity.BasedataLableVO;
import com.audit.modules.site.entity.SiteInfoVO;
import com.audit.modules.supplier.entity.SupplierVO;
import com.audit.modules.watthourmeter.entity.WatthourMeterVO;
import com.fasterxml.jackson.annotation.JsonAutoDetect;

/**
 * @author : jiadu
 * @Description : 基础数据
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY //解析所有字段
        ,getterVisibility = JsonAutoDetect.Visibility.NONE)     //不解析get方法
public class BaseDataVO implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1416007067669803246L;
	private SiteInfoVO siteInfoVO;//站点信息
    private ContractVO contractVO;//合同信息
    private SupplierVO supplierVO;//供应商信息
    private List<WatthourMeterVO> watthourMeterVO;//电表信息
    private List<DeviceVO> deviceVO;//机房设备信息
    private List<BasedataLableVO> eqRoomVO;//机房信息
    private List<BasedataLableVO> rePointVO;//资源点信息
    

    public List<BasedataLableVO> getEqRoomVO() {
		return eqRoomVO;
	}

	public void setEqRoomVO(List<BasedataLableVO> eqRoomVO) {
		this.eqRoomVO = eqRoomVO;
	}

	public List<BasedataLableVO> getRePointVO() {
		return rePointVO;
	}

	public void setRePointVO(List<BasedataLableVO> rePointVO) {
		this.rePointVO = rePointVO;
	}

	public List<WatthourMeterVO> getWatthourMeterVO() {
        return watthourMeterVO;
    }

    public void setWatthourMeterVO(List<WatthourMeterVO> watthourMeterVO) {
        this.watthourMeterVO = watthourMeterVO;
    }

    public SupplierVO getSupplierVO() {
        return supplierVO;
    }

    public void setSupplierVO(SupplierVO supplierVO) {
        this.supplierVO = supplierVO;
    }

    public ContractVO getContractVO() {
        return contractVO;
    }

    public void setContractVO(ContractVO contractVO) {
        this.contractVO = contractVO;
    }

    public SiteInfoVO getSiteInfoVO() {
        return siteInfoVO;
    }

    public void setSiteInfoVO(SiteInfoVO siteInfoVO) {
        this.siteInfoVO = siteInfoVO;
    }

    public List<DeviceVO> getDeviceVO() {
		return deviceVO;
	}
    
    public void setDeviceVO(List<DeviceVO> deviceVO) {
        this.deviceVO = deviceVO;
    }
	
}
