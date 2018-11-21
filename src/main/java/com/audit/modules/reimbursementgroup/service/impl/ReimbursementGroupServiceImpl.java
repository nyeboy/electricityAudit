package com.audit.modules.reimbursementgroup.service.impl;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.reimbursementgroup.dao.ReimbursementGroupDao;
import com.audit.modules.reimbursementgroup.entity.ReimbursementVO;
import com.audit.modules.reimbursementgroup.service.ReimbursementGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/19
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Transactional
@Service
public class ReimbursementGroupServiceImpl implements ReimbursementGroupService {
    @Autowired
    private ReimbursementGroupDao reimbursementGroupDao;

    @Override
    public void queryList(PageUtil<ReimbursementVO> page, ReimbursementVO reimbursementVO) {
        if(reimbursementVO!=null){
            page.setObj(reimbursementVO);
        }
        List<ReimbursementVO> electrictyListVOs = reimbursementGroupDao.queryList(page);
        page.setResults(electrictyListVOs);
    }

    @Override
    public ResultVO createReimbursement(ReimbursementVO reimbursementVO) {
        if(!StringUtils.isNotBlank(reimbursementVO.getName())){
            return ResultVO.failed("报账组名称不能为空！");
        }
        reimbursementVO.setId(StringUtils.getUUid());
        reimbursementVO.setCreateTime(new Date());
        try {
            reimbursementGroupDao.createReimbursement(reimbursementVO);
        }catch (Exception e){
            return ResultVO.failed("报账组名称系统中已存在！");
        }
        return ResultVO.success();
    }

    @Override
    public ResultVO updateReimbursement(ReimbursementVO reimbursementVO) {
        if(!StringUtils.isNotBlank(reimbursementVO.getName())){
            return ResultVO.failed("报账组名称不能为空！");
        }
        if(!StringUtils.isNotBlank(reimbursementVO.getId())){
            return ResultVO.failed("未传入ID值");
        }
        reimbursementVO.setUpdateTime(new Date());
        try {
            reimbursementGroupDao.updateReimbursement(reimbursementVO);
        }catch (Exception e){
            return ResultVO.failed("报账组名称系统中已存在！");
        }
        return ResultVO.success();
    }

    @Override
    public ResultVO deleteByIds(String[] ids) {
        if(ids==null||ids.length==0){
            return ResultVO.failed("请至少选择一个！");
        }
        for(String id:ids){
            Integer count = reimbursementGroupDao.findElectricityByID(id);
            if(count!=null&&count>0){
                return ResultVO.failed("该报账组正在使用中，不能删除！");
            }
            reimbursementGroupDao.deleteById(id);
        }
        return ResultVO.success();
    }

    public ReimbursementVO findOneById(String id){
        return reimbursementGroupDao.findOneById(id);
    }
}
