package com.audit.modules.system.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.GlobalUitl;
import com.audit.modules.common.utils.Log;
import com.audit.modules.system.entity.SysNoticVo;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.service.SysNoticeService;

/**   
 * @Description : TODO(系统公告接口)    
 *
 * @author : chentao
 * @date : 2017年4月17日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

@Controller
@RequestMapping("sysNotice")
public class SysNoticeController {
	
	@Autowired
	private SysNoticeService sysNoticeService;
	
	/**
	* @Description: 查询所有
	* @param :page 查询参数
	* @return :SysNoticVo
	*/
	@RequestMapping("queryNoticByPage")
	@ResponseBody
	public ResultVO queryNoticByPage(SysNoticVo sysNoticVo, Integer pageNo, Integer pageSize) {
		PageUtil<SysNoticVo> page = new PageUtil<>();
		
		if (sysNoticVo != null) {
			page.setObj(sysNoticVo);
		}
		if (pageNo != null && pageSize != null) {
			page.setPageNo(pageNo);
			page.setPageSize(pageSize);
        }
		sysNoticeService.queryNoticByPage(page);
		return  ResultVO.success(page);
	}
	
	/**
	* @Description: 查询所有公告,以及未读信息数
	* @param :page 查询参数
	* @return :SysNoticVo
	*/
	@RequestMapping("queryNoticeNotRead")
	@ResponseBody
	public ResultVO queryNoticeNotRead(HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<String,Object>();
		UserVo user = GlobalUitl.getLoginUser();
		if(null != user){
			String userId = user.getUserId();
			if(null != userId &&!userId.equals("")){
				resultMap = sysNoticeService.queryNoticeNotRead(userId);
			}
		}else{
			return ResultVO.failed("当前用户未登录");
		}
		return  ResultVO.success(resultMap);
	}
	
	/**
	* @Description:记录已读公告
	* @param :page 查询参数
	* @return :SysNoticVo
	*/
	@RequestMapping("addNoticeReaded")
	@ResponseBody
	public ResultVO addNoticeReaded(String noticId) {
		UserVo user = GlobalUitl.getLoginUser();
		String userId = user.getUserId();
		Log.info(userId+"userId");
		if(null == userId || userId.equals("")){
			return ResultVO.failed("添加已读失败");
		}
		sysNoticeService.addNoticeReaded(noticId, userId);
		return  ResultVO.success();
	}
	
	
	
	/**
	 * @Description: 删除所选公告
	 * @param :noticIds 公告id数组
	 * @return :返回操作状态/信息
	 * @throws
	*/
	@RequestMapping("deleteNoticById")
	@ResponseBody
	public ResultVO deleteNoticById(String noticIds) {
		
		return	sysNoticeService.deleteNoticById(noticIds);
	}
	
	
	/**
	 * @Description:添加公告
	 * @param :sysNoticVo SysNoticVo对象
	 * @return :ResultVO 返回操作状态/信息
	 * @throws
	*/
	@RequestMapping("addNotic")
	@ResponseBody
	public ResultVO addNotic(SysNoticVo sysNoticVo,HttpServletRequest request) {
	
		return	sysNoticeService.addNotic(sysNoticVo,request);
		
	}
	
	
	/**
	 * @Description:更新公告(noticId 必填)
	 * @param :sysNoticVo SysNoticVo对象
	 * @return :ResultVO 返回操作状态/信息
	 *  
	*/
	@RequestMapping("updateNotic")
	@ResponseBody
	public ResultVO updateNotic(SysNoticVo sysNoticVo) {
		
		return	sysNoticeService.updateNotic(sysNoticVo);
	}
	
	/**
	 * @Description:根据id查找
	 * @param :noticId 对象id
	 * @return :ResultVO 返回操作状态/信息
	 *  
	*/
	@RequestMapping("queryNoticById")
	@ResponseBody
	public ResultVO queryNoticById(String noticId) {
		
		return	sysNoticeService.queryNoticById(noticId);
	}
}

