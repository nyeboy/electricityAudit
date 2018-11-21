package com.audit.modules.towerbasedata.psu.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.OwnerMeterVo;
import com.audit.modules.towerbasedata.psu.entity.TowerPSUVO;
/**
 * 
 * @Description: 供电信息dao   
 * @throws  
 * 
 * @author  bingliup
 * @date 2017年4月30日 下午2:14:31
 */
@Component
@MybatisRepostiory
public interface TowerPSUDao {
   
	/**   
	 * @Description: 分页查询  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<TowerPSUVO> getPageList(PageUtil<TowerPSUVO> pageUtil);

	/**   
	 * @Description: 通过Id查询  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	TowerPSUVO selectById(String Id);

	/**   
	 * @Description: 通过Id修改供电信息  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void update(TowerPSUVO vo);

	/**   
	 * @Description: 删除（设置为"")  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void updateRemove(@Param("array")String[] idArray);

	/**
	 * 导出Excel
	 * @param ownerIds
	 * @return
	 */
	public List<TowerPSUVO> exportExcel(Map<String,Long> map);
	
	/**
	 * 导出数据长度
	 * @param ownerIds
	 * @return
	 */
	public Long listCount();
	
}