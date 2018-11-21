package com.audit.modules.towerReport.service;

import java.util.List;
import java.util.Map;

/**
 * @Description 汇总统计的接口
 *
 * @author 王松
 * @date 2017/3/9
 *
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public interface SummaryTowerService {

    /**
     * 获取全省的详细统计
     * @return
     */
    List<Map<String, Object>> detail(String typeCode, String year, String month);

    /**
     * 获取全省的简略统计
     * @return
     */
    List<Map<String, Object>> simple();
}
