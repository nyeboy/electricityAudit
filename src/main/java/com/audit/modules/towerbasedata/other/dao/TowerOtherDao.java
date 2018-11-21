package com.audit.modules.towerbasedata.other.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.other.entity.TowerOtherVO;

/**
 * 
 * @Description: 报账点其他信息管理（报销周期、铁塔）   
 * @throws  
 * 
 * @author  bingliu
 * @date 2017年4月30日 下午7:51:07
 */
@Component
@MybatisRepostiory
public interface TowerOtherDao{
	

	/**   
	 * @Description: 分页查询报报账点 其他信息   
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<TowerOtherVO> getPageList(PageUtil<TowerOtherVO> pageUtil);

	/**   
	 * @Description: 通过Id查询报账点 其他信息 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	TowerOtherVO selectById(String Id);
	

	/**   
	 * @Description: 通过Id修改报账点  其他信息 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void update(TowerOtherVO VO);

	/**   
	 * @Description: 设置为"" 
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateRemove(@Param("array")String[] idArray);
	
}