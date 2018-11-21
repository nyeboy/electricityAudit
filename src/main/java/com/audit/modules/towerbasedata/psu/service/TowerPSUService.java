package com.audit.modules.towerbasedata.psu.service;


import java.util.List;
import java.util.Map;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.electricity.entity.OwnerMeterVo;
import com.audit.modules.towerbasedata.psu.entity.TowerPSUVO;

/**
 * 
 * @Description: 供电信息
 * @throws  
 * 
 * @author  bingliup
 * @date 2017年4月30日 下午3:15:40
 */
public interface TowerPSUService {

	/**   
	 * @Description: 分页查询  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	List<TowerPSUVO> queryListPage(TowerPSUVO VO, PageUtil<TowerPSUVO> pageUtil);

	/**   
	 * @Description: 通过Id查询供电信息  
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
	 * @Description: 通过Ids 删除  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	void delete(String[] idArray);

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
