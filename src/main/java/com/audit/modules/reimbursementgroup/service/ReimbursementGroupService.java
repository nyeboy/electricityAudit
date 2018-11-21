package com.audit.modules.reimbursementgroup.service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectrictyVO;
import com.audit.modules.reimbursementgroup.entity.ReimbursementVO;

import java.util.List;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/19
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface ReimbursementGroupService {
    void queryList(PageUtil<ReimbursementVO> page, ReimbursementVO reimbursementVO);
    ResultVO createReimbursement(ReimbursementVO reimbursementVO);
    ResultVO updateReimbursement(ReimbursementVO reimbursementVO);
    ResultVO deleteByIds(String[] ids);
    ReimbursementVO findOneById(String id);
}
