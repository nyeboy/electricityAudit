package com.audit.modules.system.entity;

/**
 * @author 王松
 * @description
 * @date 2017/5/26
 * Copyright (c) 2017, ISoftStone All Right reserved.
 */
public class DepartmentEntity {
    private int id;
    //部门编号
    private String departmentNo;
    //父部门编号
    private String departmentParentNo;
    //部门名称
    private String departmentName;
    //公司编码
    private String companyCode;
    //部门层级
    private int departmentLevel;
    //是否有效
    private String status;
    //是否看见
    private String visible;
    //区域Code
    private String areaCode;
    //部门序号
    private String departmentOrder;
    //子部门数量
    private String childNum;

    public String getChildNum() {
		return childNum;
	}

	public Integer getId() {
        return id;
    }

    public String getDepartmentParentNo() {
        return departmentParentNo;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public int getDepartmentLevel() {
        return departmentLevel;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public long getSeqNum(){
        if(departmentOrder == null || departmentOrder.trim().isEmpty()){
            return 0;
        }
        String tmp = departmentOrder.trim();
        if(tmp.matches("[0-9]+")) {
            //如果以O开头，则需要替换掉开头的0，然后再转换
            while (tmp.startsWith("0")) {
                tmp = tmp.substring(1);
            }
            if (!tmp.isEmpty()) {
                return Long.valueOf(tmp);
            }
        }
        return 0;
    }

    public String getDepartmentNo() {
        return departmentNo;
    }
}
