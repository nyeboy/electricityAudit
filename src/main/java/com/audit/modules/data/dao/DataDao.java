package com.audit.modules.data.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.data.entity.DptDetailPo;
import com.audit.modules.data.entity.EmpDptPo;
import com.audit.modules.data.entity.EmpDutyPo;
import com.audit.modules.data.entity.EmpRolesPo;
import com.audit.modules.data.entity.EmployeePo;
import com.audit.modules.data.entity.OrgDetailPo;

@Component
@MybatisRepostiory
public interface DataDao {

	/**
	 * 保存OA部门信息
	 * @return
	 */
	public Boolean addDpt(OrgDetailPo orgDetailPo);
	/**
	 * 导入OA部门信息
	 * @return
	 */
	public Boolean addDpts(List<DptDetailPo> dptDetailPos);
	
	/**
	 * 导入OA人员信息
	 * @return
	 */
	public Boolean addEmployees(List<EmployeePo> employeePos);
	
	/**
	 * 导入OA人员部门关系信息
	 * @return
	 */
	public Boolean addEmpDepartment(List<EmpDptPo> list);
	
	/**
	 * 导入OA人员角色关系信息
	 * @return
	 */
	public Boolean addEmpRole(List<EmpRolesPo> list);
	
	/**
	 * 导入OA人员职位关系信息
	 * @return
	 */
	public Boolean addEmpDuty(List<EmpDutyPo> list);
	
}
