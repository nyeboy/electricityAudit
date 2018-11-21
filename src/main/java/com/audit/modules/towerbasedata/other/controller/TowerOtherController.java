package com.audit.modules.towerbasedata.other.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.towerbasedata.other.entity.TowerOtherVO;
import com.audit.modules.towerbasedata.other.service.TowerOtherService;

/**
 * 
 * @Description: 其他信息   
 * @throws  
 * 
 * @author bingliup
 * @date 2017年4月20日 下午3:14:31
 */
@Controller
@RequestMapping("/towerother")
public class TowerOtherController {

	@Autowired
	private TowerOtherService otherService;

	/**
	 * @Description:分页查询报其他信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/queryListPage")
	@ResponseBody
	public ResultVO queryListPage(TowerOtherVO VO, Integer pageNo, Integer pageSize) {
		PageUtil<TowerOtherVO> pageUtil = new PageUtil<>();
		if (pageNo != null && pageSize != null) {
			pageUtil.setPageNo(pageNo);
			pageUtil.setPageSize(pageSize);
		}else {
			return ResultVO.failed("缺少分页参数pageNo、pageSize");
		}
		otherService.queryListPage(VO, pageUtil);
		return ResultVO.success(pageUtil);
	}
	
	/**   
	 * @Description: 通过Ids删除其他信息
	 * @param :ContractVO Contract       
	 * @return :     
	 * @throws  
	*/
	@RequestMapping("/delete")
	@ResponseBody
	public ResultVO delete(HttpServletRequest request) {
		String[] IdArray = null;
		String Ids = request.getParameter("Ids");
		if (null == Ids || Ids.equals("")) {
			return ResultVO.failed("参数错误");
		}
		IdArray = Ids.split(",");
		
		if (IdArray.length > 0) {
			otherService.delete(IdArray);
		}
		return ResultVO.success();
	}
	

	/**
	 * @Description:通过Id查询其他信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/selectById")
	@ResponseBody
	public ResultVO selectById(String Id) {
		if(Id == null || Id.equals("")) {
			return ResultVO.failed("请传递Id");
		}
		TowerOtherVO accountSiteOther = otherService.selectById(Id);
		return ResultVO.success(accountSiteOther);
	}
	

	/**
	 * @Description:保存更新信息
	 * @param :
	 * @return :ResultVO
	 * @throws
	*/
	@RequestMapping("/update")
	@ResponseBody
	public ResultVO update(TowerOtherVO VO) {
		if(VO != null && null != VO.getId() && !"".equals(VO.getId()) && null != VO.getCycle() && !"".equals(VO.getCycle())) {
			otherService.update(VO);
			return ResultVO.success();
		}
		return ResultVO.failed("参数错误");
		
	}
}
