package com.audit.modules.system.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.modules.common.mybatis.MybatisRepostiory;
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

@Component
@MybatisRepostiory
public interface SysNoticeDao {
	
	    // 查询所有用户信息
		List<SysNoticVo> queryNoticByPage(PageUtil<SysNoticVo> page);

		// 删除选中
		void deleteNoticById(String[] noticId);

		// 添加用户
		void addNotic(SysNoticVo sysNoticVo);

		// 修改用户信息
		void updateNotic(SysNoticVo sysNoticVo);
		// 根据id查询
		SysNoticVo queryNoticById(@Param("noticId")String noticId);

		//查询用户未读公告
		List<SysNoticVo> queryAllNotice();
		//查询用户未读公告Id
		List<String> queryNoticeIdReaded(@Param("userId")String userId);
}
