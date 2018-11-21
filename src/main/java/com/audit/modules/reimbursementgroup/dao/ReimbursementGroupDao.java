package com.audit.modules.reimbursementgroup.dao;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.reimbursementgroup.entity.ReimbursementVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/19
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Component
@MybatisRepostiory
public interface ReimbursementGroupDao {
    List<ReimbursementVO> queryList(PageUtil<ReimbursementVO> page);
    void createReimbursement(ReimbursementVO reimbursementVO);
    void updateReimbursement(ReimbursementVO reimbursementVO);
    Integer findElectricityByID(@Param("id") String id);
    void deleteById(@Param("id") String id);
    ReimbursementVO findOneById(@Param("id") String id);
}
