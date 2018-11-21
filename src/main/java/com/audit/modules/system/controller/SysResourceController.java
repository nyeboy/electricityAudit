package com.audit.modules.system.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
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
import com.audit.modules.system.entity.ResourceVo;
import com.audit.modules.system.entity.SysResource;
import com.audit.modules.system.service.SysResourceService;

/**
 * 
 * @Description: TODO   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年4月8日 上午10:16:04
 */
@Controller
@RequestMapping("resource")
public class SysResourceController {

	@Autowired
	private SysResourceService resourceService;

	/**
	 * @Description:查询所有资源
	 * @param :
	 * @return :List<SysRoleVo>
	 * @throws
	*/
	@RequestMapping("/getResourceList")
	@ResponseBody
	public ResultVO getResourceList() {
		Map<String, List<ResourceVo>> sysResourceMap = new HashMap<String, List<ResourceVo>>();
		sysResourceMap = resourceService.findAll();
		return ResultVO.success(sysResourceMap);
	}

	/**
	 * @Description:分页查询资源列表
	 * @param :sysResoure对象
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryResourceListPage")
	@ResponseBody
	public ResultVO queryResourceListPage(SysResource sysResoure, Integer pageNo, Integer pageSize) {
		PageUtil<SysResource> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}
		resourceService.queryResourceListPage(sysResoure, pageUtil);
		return ResultVO.success(pageUtil);
	}

	/**
	 * 
	 * @Description: 通过资源Id查询资源  
	 * @param :Long resourceId       
	 * @return :     
	 * @throws
	 */
	@RequestMapping("/selectResourceById")
	@ResponseBody
	public ResultVO selectResourceById(HttpServletRequest request) {
		Long resId = null;
		SysResource sysResource = null;
		String resourceId = request.getParameter("resourceId");
		if (null == resourceId || resourceId.equals("")) {
			return ResultVO.failed("参数错误");
		}
		resId = Long.valueOf(resourceId);
		if (null != resId) {
			sysResource = resourceService.findOne(resId);
		}
		if (sysResource != null) {
			return ResultVO.success(sysResource);
		} else {
			return ResultVO.failed("资源未找到");
		}
	}

	/**   
	 * @Description: 删除资源  
	 * @param :SysResource sysresource       
	 * @return :     
	 * @throws  
	*/
	@RequestMapping("/deleteResource")
	@ResponseBody
	public ResultVO deleteResource(HttpServletRequest request) {
		Long resId = null;
		List<Long> resourceIdList = new ArrayList<Long>();
		String[] resourceIdArray = null;
		String resouceIds = request.getParameter("resourceIds");
		if (null == resouceIds || resouceIds.equals("")) {
			return ResultVO.failed("参数错误");
		}
		resourceIdArray = resouceIds.split(",");
		for (String resourceId : resourceIdArray) {
			resId = Long.valueOf(resourceId);
			resourceIdList.add(resId);
		}
		if (resourceIdList.size() > 0) {
			resourceService.removeResource(resourceIdList);
		}
		return ResultVO.success();
	}

	/**
	 * @Description:修改资源信息
	 * @param :HttpServletRequest request
	 * @return :返回操作状态/信息
	 * @throws :Exception
	*/
	@RequestMapping("/updateRsourceById")
	@ResponseBody
	public ResultVO updateRsourceById(HttpServletRequest request) {
		SysResource parentResource = null;
		String parentIds = null;
		SysResource sysResource = new SysResource();
		String resourceId = request.getParameter("resourceId");
		String resourceName = request.getParameter("resourceName");
		String permission = request.getParameter("permission");
		String type = request.getParameter("type");
		String parentId = request.getParameter("parentId");
		String alias = request.getParameter("alias");
		String url = request.getParameter("url");

		if (null != resourceId && !resourceId.equals("") && null != resourceName && !resourceName.equals("")) {
			sysResource.setId(new BigDecimal(resourceId));
			sysResource.setResourceName(resourceName);
		} else {
			return ResultVO.failed("参数错误");
		}
		if (null != parentId && !parentId.equals("")) {
			sysResource.setParentId(new BigDecimal(parentId));
			if (!parentId.equals("0")) {
				Long parentid = Long.valueOf(parentId);
				parentResource = resourceService.findOne(parentid);
			}
			if (null != parentResource && null != parentResource.getParentIds()) {
				parentIds = parentResource.getParentIds() + "/" + parentId;
				sysResource.setParentIds(parentIds);
			}
		}
		if (null != url && !url.equals("")) {
			sysResource.setUrl(url);
		}
		if (null != permission && !permission.equals("")) {
			sysResource.setPermission(permission);
		}
		if (null != alias && !alias.equals("")) {
			sysResource.setAlias(alias);
		}
		if (null != type && !type.equals("")) {
			sysResource.setType(type);
		}
		resourceService.updateByIdSelective(sysResource);
		return ResultVO.success();
	}

	/**
	 * @Description 添加资源信息
	 * @param :HttpServletRequest request
	 * @return :返回操作状态/信息
	 * @throws :Exception
	*/

	@RequestMapping("/addResource")
	@ResponseBody
	public ResultVO addResource(HttpServletRequest request) {
		SysResource sysResource = new SysResource();
		SysResource parentResource = null;
		String parentIds = null;
		String resourceName = request.getParameter("resourceName");
		String permission = request.getParameter("permission");
		String type = request.getParameter("type");
		String parentId = request.getParameter("parentId");
		String alias = request.getParameter("alias");
		String url = request.getParameter("url");
		if (null != resourceName && !resourceName.equals("") && null != permission && !permission.equals("")) {
			sysResource.setResourceName(resourceName);
			sysResource.setPermission(permission);
		} else {
			return ResultVO.failed("参数错误");
		}
		if (null != parentId && !parentId.equals("")) {
			sysResource.setParentId(new BigDecimal(parentId));
			if (!parentId.equals("0")) {
				Long parentid = Long.valueOf(parentId);
				parentResource = resourceService.findOne(parentid);
			}
			if (null != parentResource && null != parentResource.getParentIds()) {
				parentIds = parentResource.getParentIds() + "/" + parentId;
				sysResource.setParentIds(parentIds);
			}
		} else {
			sysResource.setParentId(new BigDecimal("0"));
			sysResource.setParentIds("0/");
		}
		if (null != url && !url.equals("")) {
			sysResource.setUrl(url);
		}
		if (null != alias && !alias.equals("")) {
			sysResource.setAlias(alias);
		}
		if (null != type && !type.equals("")) {
			sysResource.setType(type);
		}
		resourceService.addResource(sysResource);
		return ResultVO.success();
	}

}
