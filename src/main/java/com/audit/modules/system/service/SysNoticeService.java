package com.audit.modules.system.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.annotations.Param;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.system.entity.SysNoticVo;

/**   
 * @Description : TODO(系统公告)    
 *
 * @author : chentao
 * @date : 2017年4月17日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public interface SysNoticeService {
	
    	// 查询所有用户信息
		List<SysNoticVo> queryNoticByPage(PageUtil<SysNoticVo> page);

		// 删除选中
		ResultVO deleteNoticById(String noticIds);

		// 添加用户
		ResultVO addNotic(SysNoticVo user,HttpServletRequest request);

		// 修改用户信息
		ResultVO updateNotic(SysNoticVo user);
		
		// 根据id查询
		ResultVO queryNoticById(String noticId);

		//通过userId查询未读的公告
		Map<String, Object> queryNoticeNotRead(String userId);

		//添加已读公告
		void addNoticeReaded(String noticeId, String userId);
}
