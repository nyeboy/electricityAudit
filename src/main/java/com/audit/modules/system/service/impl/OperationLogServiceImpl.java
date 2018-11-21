package com.audit.modules.system.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.dao.OperationLogDao;
import com.audit.modules.system.entity.OperationLogVo;
import com.audit.modules.system.service.OperationLogService;
import com.google.common.collect.Maps;

/**
 * @Description :操作日志接口实现
 * @author : liuyan
 * @date : 2017年3月9日   
 */
@Service
@Transactional
public class OperationLogServiceImpl implements OperationLogService {

    @Autowired
    private OperationLogDao operationLogDao;

    @Override
    public void create(OperationLogVo entity) {
    	//如果参数超出1000个字符，剪切后存入数据库
    	if (entity.getParameters().length() > 1000) {
			entity.setParameters(entity.getParameters().substring(0, 1000));
		}
        operationLogDao.createLog(entity);
    }
    
    //查询所有操作日志
    @Override
    public List<OperationLogVo> findAll() {
        return operationLogDao.queryAll();
    }

	/**   
	 * @Description: 分页搜索操作日志  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	@Override
	public void getPageLogList(OperationLogVo operationLogVo, PageUtil<OperationLogVo> pageUtil) {
		
		Map<String, Object> parameMap = Maps.newHashMap();
		if(null != operationLogVo){
			setMap(parameMap, operationLogVo, pageUtil);
		}
		List<OperationLogVo> operationLogVoList= operationLogDao.getPageLogList(pageUtil);
	}

	/**   
	 * @Description: 添加搜索参数  
	 * @param :       
	 * @return :     
	 * @throws  
	*/
	private void setMap(Map<String, Object> parameMap, OperationLogVo operationLogVo,
			PageUtil<OperationLogVo> pageUtil) {
	
		if(operationLogVo.getAccount() != null) {
			parameMap.put("account", operationLogVo.getAccount());
		}
		if (operationLogVo.getStartTime() != null) {
			parameMap.put("startTime", operationLogVo.getStartTime() + "");
		}
		if (operationLogVo.getEndTime() != null) {
			parameMap.put("endTime", operationLogVo.getEndTime() + "");
		}
		pageUtil.setObj(parameMap);
	}
	
}
