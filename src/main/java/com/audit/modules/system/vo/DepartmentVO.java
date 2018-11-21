package com.audit.modules.system.vo;

import com.audit.modules.common.utils.StreamUtil;
import com.audit.modules.system.entity.DepartmentEntity;
import com.fasterxml.jackson.annotation.JsonAutoDetect;

import java.util.ArrayList;
import java.util.List;

/**
 * @author 王松
 * @description
 *
 * @date 2017/5/26
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY //解析所有字段
        ,getterVisibility = JsonAutoDetect.Visibility.NONE)     //不解析get方法
public class DepartmentVO {
    private int id;
    private String name;
    private int level;
    private long seqNum;
    private List<DepartmentVO> children;
    private String childNum;

    public void setChildNum(String childNum) {
		this.childNum = childNum;
	}

	public static List<DepartmentVO> convert(List<DepartmentEntity> departmentEntities){
        if(departmentEntities == null || departmentEntities.isEmpty()){
            return new ArrayList<>();
        }

        List<DepartmentVO> result = new ArrayList<>(departmentEntities.size());
        for(DepartmentEntity entity : departmentEntities){
            result.add(convert(entity));
        }
        //根据seqNum升序排序
        StreamUtil.sort(result, DepartmentVO::getSeqNum);

        return result;
    }

    public static DepartmentVO convert(DepartmentEntity departmentEntity){
        DepartmentVO departmentVO = new DepartmentVO();
        departmentVO.id = departmentEntity.getId();
        departmentVO.name = departmentEntity.getDepartmentName();
        departmentVO.level = departmentEntity.getDepartmentLevel();
        departmentVO.seqNum = departmentEntity.getSeqNum();
        departmentVO.childNum = departmentEntity.getChildNum()!=null ? departmentEntity.getChildNum() : "";
        departmentVO.children = new ArrayList<>();
        return departmentVO;
    }

    public int getId() {
        return id;
    }

    public void setChildren(List<DepartmentVO> children){
        this.children = children;
    }

    public long getSeqNum() {
        return seqNum;
    }
}
