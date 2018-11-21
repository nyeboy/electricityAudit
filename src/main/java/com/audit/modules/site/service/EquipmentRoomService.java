package com.audit.modules.site.service;

import java.util.List;

import com.audit.modules.basedata.entity.PowerRateManage;
import com.audit.modules.electricity.entity.DeviceVO;

/**
 * @author 王松
 * @Description
 * @date 2017/3/15
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public interface EquipmentRoomService {
    /**
     * 根据报账点ID获取机房设备信息
     * @param id 报账点ID
     * @return DeviceVO
     */
    List<DeviceVO> queryDevice(String id);
    
    /**
     * 更具设备生产商和设备型号查询设备功率
     * @param powerRatingManage
     * @return
     */
    public PowerRateManage getPowerRating(PowerRateManage powerRatingManage);
}
