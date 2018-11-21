package com.audit.modules.system.service.impl;

import com.audit.modules.common.utils.StreamUtil;
import com.audit.modules.system.dao.DepartmentDao;
import com.audit.modules.system.entity.DepartmentEntity;
import com.audit.modules.system.service.DepartmentService;
import com.audit.modules.system.vo.DepartmentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author 王松
 * @description
 * @date 2017/5/26
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentDao departmentDao;

    @Override
    public List<DepartmentVO> findRootNodes() {
        long currentTime = System.currentTimeMillis();
        List<DepartmentEntity> rootNodes = departmentDao.findByLevel("0");
        System.out.println("查询0级数据共花费：" + (System.currentTimeMillis() - currentTime));
        if(rootNodes == null || rootNodes.isEmpty()){
            return null;
        }
        currentTime = System.currentTimeMillis();
        List<DepartmentEntity> children = departmentDao.findByLevel("1");
        System.out.println("查询1级数据共花费：" + (System.currentTimeMillis() - currentTime));

        currentTime = System.currentTimeMillis();
        List<DepartmentVO> result =  convert2Vo(rootNodes, children);
        System.out.println("转换数据共花费：" + (System.currentTimeMillis() - currentTime));
        return result;
    }

    @Override
    public List<DepartmentVO> findChildren(String dptId) {
        if(!dptId.trim().matches("[0-9]+")){
            return null;
        }
        DepartmentEntity current = departmentDao.findById(Integer.valueOf(dptId));
        if(current == null){
            return null;
        }

        String companyCode = current.getCompanyCode();
        int currentLevel = current.getDepartmentLevel();

        List<DepartmentEntity> children = departmentDao.findByCompanyCodeAndLevel(companyCode, currentLevel + 1);
        List<DepartmentEntity> grandchildren =  departmentDao.findByCompanyCodeAndLevel(companyCode, currentLevel + 2);

        return convert2Vo(children, grandchildren);
    }

    private List<DepartmentVO> convert2Vo(List<DepartmentEntity> parent, List<DepartmentEntity> children){
        if(parent == null || parent.isEmpty()){
            return null;
        }

        List<DepartmentVO> result = DepartmentVO.convert(parent);
        if(children != null && !children.isEmpty()){
            Map<String, List<DepartmentEntity>> childrenGroupByParentNo = StreamUtil.convertListToMapList(
                    children, DepartmentEntity::getDepartmentParentNo
            );

            Map<Integer, List<DepartmentEntity>> childrenGroupByParentId = new HashMap<>();
            for(DepartmentEntity parentEntity : parent){
                int id = parentEntity.getId();
                String departmentParentNo = parentEntity.getDepartmentNo();

                childrenGroupByParentId.put(id, childrenGroupByParentNo.get(departmentParentNo));
            }

            for(DepartmentVO parentVO : result){
                int parentId = parentVO.getId();
                List<DepartmentEntity> childrenEntity = childrenGroupByParentId.get(parentId);
                List<DepartmentVO> childrenVO = DepartmentVO.convert(childrenEntity);
                parentVO.setChildren(childrenVO);
            }
        }

        return result;
    }

	
	@Override
	public List<DepartmentVO> findChildrenNum(String dptId) {
		  List<DepartmentEntity> children = departmentDao.findChildren(dptId);
		  List<DepartmentVO> result = DepartmentVO.convert(children);
		 
		return result;
	}
}
