package com.audit.modules.system.service;

import com.audit.modules.system.vo.DepartmentVO;

import java.util.List;

/**
 * @author 王松
 * @description
 * @date 2017/5/26
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public interface DepartmentService {
    /**
     * 获取根节点
     * @return
     */
    List<DepartmentVO> findRootNodes();

    /**
     * 根据部门ID，获取其孩子节点
     * 注意，本方法将会包含两级节点，及孩子节点与其子节点
     * @param dptId 部门ID
     * @return
     */
    List<DepartmentVO> findChildren(String dptId);
    
    /**
     * 根据部门ID，获取其子节点
     * 包含一级子节点，及二级子节点个数
     * @param dptId 部门ID
     * @return
     */
    List<DepartmentVO> findChildrenNum(String dptId);
    
    
    
}
