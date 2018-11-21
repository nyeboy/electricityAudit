package com.audit.modules.system.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.EncryptUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.electricity.entity.ElectrictyListVO;
import com.audit.modules.system.entity.AccountShiftVO;
import com.audit.modules.system.entity.SuperAdminConstant;
import com.audit.modules.system.entity.SysUserRole;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.service.UserService;

/**
 * @author : chentao
 * @Description : 鐢ㄦ埛鐧诲綍
 * @date : 2017/3/13
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Controller
@RequestMapping("loginController")
public class LoginController {

	@Autowired
	private UserService userService;

	/**
	 * @Description: 登陆接口
	 * @param :account 
	 * @return :
	*/
	@RequestMapping(value="/login.do")
	@ResponseBody
	public ResultVO login(HttpServletRequest request, HttpServletResponse response) {
		Log.info("loginController");
		UserVo userVo = null;
		String account = request.getParameter("loginAccountParam");
		
		
		Subject subject = SecurityUtils.getSubject();
		String word = null;
		String password = null;		
		// 
		String fromPage = request.getParameter("fromPage");

		Log.info("sessionID:" + subject.getSession().getId());
		String ip = request.getParameter("ip");
		if (null == ip || ip.equals("")) {
			ip = ((HttpServletRequest) request).getRemoteAddr();
		}
		if (account != null && !account.equals("")) {
			// shiro 
			UsernamePasswordToken token = new UsernamePasswordToken(account, "123456");
			if (null != subject.getSession().getAttribute("userInfo")
					|| null != subject.getSession().getAttribute("user")) {
				Log.info("session remove");
				subject.logout();
			}
			// 
			try {
				UserVo user = userService.queryUserVoByAccount(account);
				if (user == null) {
					return ResultVO.failed("用户不存在");// 娌℃壘鍒板笎鍙�
				}
				if (user.getUserStatus() != null && user.getUserStatus() == 1) {
					return ResultVO.failed("用户被锁定");
				}
				//
				if (null != fromPage && fromPage.equals("1")) {
					word = request.getParameter("word");
					password = user.getPassword();
					if (password == null || word == null || !password.equals(EncryptUtil.encryptSha256(word))) {
						return ResultVO.failed("密码不正确");
					}
				} 
				Log.info("login");
				subject = SecurityUtils.getSubject();
				subject.login(token);
				Log.info(subject.getSession().getId() + "");
			} catch (UnknownAccountException uae) {
				// 鎹曡幏鏈煡鐢ㄦ埛鍚嶅紓甯�
				return ResultVO.failed("登录失败");
			} catch (Exception e) {
				e.printStackTrace();
				return ResultVO.failed("登录失败");
			}
			userVo = userService.queryUserVoByAccountDetail(account);
			if (null != userVo) {
				if (null != ip && !ip.equals("")) {
					userVo.setLoginIp(ip);
				}
				userVo.setLoginDate(new Date());
				userService.updateUser(userVo);
				subject.getSession().setAttribute("user", userVo);
				subject.getSession().setAttribute("userInfo", JsonUtil.toJson(userVo));
			}
		} else {
			return ResultVO.failed("登录失败");
		}
		if (null != userVo) {
			String beforLoginURI = request.getAttribute("beforLoginURI") + "";
			// 鍒ゆ柇鏄惁鏄揩鎹风櫥褰�
			if (null != beforLoginURI && !beforLoginURI.equals("") && !beforLoginURI.equals("null")) {
				Log.info(beforLoginURI);
				try {
					request.setAttribute("loginRequest", "0");
					request.getRequestDispatcher(beforLoginURI).forward(request, response);
				} catch (ServletException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			subject.getSession().setAttribute("account", account);//保存账号
			return ResultVO.success("登录成功");
		}
		subject.getSession().setAttribute("account", account);//保存账号
		return ResultVO.success("登录成功");
	}
	
	
	/**
	 * @Description: 外部登录陆接口
	 * @param :account 
	 * @return :
	*/
	@RequestMapping(value="/outlogin.do")
	@ResponseBody
	public String outlogin(HttpServletRequest request, HttpServletResponse response) {
		Log.info("loginController");
		UserVo userVo = null;
		String account = request.getParameter("loginAccountParam");
		String callBack = request.getParameter("callBack");
		
		
		Subject subject = SecurityUtils.getSubject();
		String word = null;
		String password = null;		
		// 
		String fromPage = request.getParameter("fromPage");

		Log.info("sessionID:" + subject.getSession().getId());
		String ip = request.getParameter("ip");
		if (null == ip || ip.equals("")) {
			ip = ((HttpServletRequest) request).getRemoteAddr();
		}
		if (account != null && !account.equals("")) {
			// shiro 
			UsernamePasswordToken token = new UsernamePasswordToken(account, "123456");
			if (null != subject.getSession().getAttribute("userInfo")
					|| null != subject.getSession().getAttribute("user")) {
				Log.info("session remove");
				subject.logout();
			}
			// 
			try {
				UserVo user = userService.queryUserVoByAccount(account);
				if (user == null) {
					return callBack + "("+ResultVO.failed("用户不存在").toString()+")";// 娌℃壘鍒板笎鍙�
				}
				if (user.getUserStatus() != null && user.getUserStatus() == 1) {
					
					return callBack + "("+ResultVO.failed("用户被锁定").toString()+")";// 娌℃壘鍒板笎鍙�

				}
				//
				if (null != fromPage && fromPage.equals("1")) {
					word = request.getParameter("word");
					password = user.getPassword();
					if (password == null || word == null || !password.equals(EncryptUtil.encryptSha256(word))) {
						return callBack + "("+ResultVO.failed("密码不正确").toString()+")";// 娌℃壘鍒板笎鍙�

					}
				} 
				Log.info("login");
				subject = SecurityUtils.getSubject();
				subject.login(token);
				Log.info(subject.getSession().getId() + "");
			} catch (UnknownAccountException uae) {
				// 鎹曡幏鏈煡鐢ㄦ埛鍚嶅紓甯�
				return callBack + "("+ResultVO.failed("登录失败").toString()+")";// 娌℃壘鍒板笎鍙�

			} catch (Exception e) {
				e.printStackTrace();
				return callBack + "("+ResultVO.failed("登录失败").toString()+")";// 娌℃壘鍒板笎鍙�

				
			}
			userVo = userService.queryUserVoByAccountDetail(account);
			if (null != userVo) {
				if (null != ip && !ip.equals("")) {
					userVo.setLoginIp(ip);
				}
				userVo.setLoginDate(new Date());
				userService.updateUser(userVo);
				subject.getSession().setAttribute("user", userVo);
				subject.getSession().setAttribute("userInfo", JsonUtil.toJson(userVo));
			}
		} else {
			return callBack + "("+ResultVO.failed("登录失败").toString()+")";// 娌℃壘鍒板笎鍙�

		}
		if (null != userVo) {
			String beforLoginURI = request.getAttribute("beforLoginURI") + "";
			// 鍒ゆ柇鏄惁鏄揩鎹风櫥褰�
			if (null != beforLoginURI && !beforLoginURI.equals("") && !beforLoginURI.equals("null")) {
				Log.info(beforLoginURI);
				try {
					request.setAttribute("loginRequest", "0");
					request.getRequestDispatcher(beforLoginURI).forward(request, response);
				} catch (ServletException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			subject.getSession().setAttribute("account", account);//保存账号
			
			return callBack + "("+ResultVO.success("登录成功").toString()+")";// 娌℃壘鍒板笎鍙�

		}
		subject.getSession().setAttribute("account", account);//保存账号
		return callBack + "("+ResultVO.success("登录成功").toString()+")";// 娌℃壘鍒板笎鍙�
	}
	
	

	/**
	 * @Description: 鑾峰彇褰撳墠鐢ㄦ埛
	 * @param :account 璐﹀彿
	 * @param :passWord 瀵嗙爜
	 * @return :杩斿洖鎿嶄綔鐘舵��/淇℃伅
	*/
	@RequestMapping("getCurrentUser")
	@ResponseBody
	public ResultVO getCurrentUser(HttpServletRequest request) {
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();
		UserVo userVo = (UserVo) session.getAttribute("user");
		String account = null;
		if (null != userVo) {
			account = userVo.getAccount();
			userVo = userService.queryUserVoByAccountDetail(account);
			userVo.setPassword("");
			// 鍒ゆ柇鏄惁鏄秴绾х鐞嗗憳
			if (userVo != null && userVo.getRoleIds() != null) {
				String roleIds = userVo.getRoleIds();
				roleIds = "," + roleIds + ",";
				if (roleIds.indexOf(SuperAdminConstant.SUPERADMIN_ROLE_ID+",") >= 0) {
					userVo.setIsSupperAdmin("0");
				}
			}
			return ResultVO.success(userVo);
		} else {
			return ResultVO.failed("用户不存在");
		}
	}

	/**
	* @Description: 閫�鍑虹郴缁�
	*/
	@RequestMapping("loginOut")
	@ResponseBody
	public ResultVO loginOut(HttpServletRequest request, HttpServletResponse response) {
		// 鍒犻櫎鐧诲綍淇℃伅
		request.getSession().removeAttribute("userInfo");
		request.getSession().removeAttribute("user");
		try {
			SecurityUtils.getSubject().logout();
			return ResultVO.successMsg("退出成功");
		} catch (Exception e) {
			e.printStackTrace();
			return ResultVO.failed("退出失败");
		}
	}

	/**
	* @Description: 查询角色
	*/
	@RequestMapping("roleSelect")
	@ResponseBody
	public ResultVO roleSelect() {
		List<SysUserRole> list=userService.roleSelect();
		return ResultVO.success(list);
	}
	
	/**
	* @Description: 查询账号
	*/
	@RequestMapping("accountSelect")
	@ResponseBody
	public ResultVO accountSelect(HttpServletRequest request) {
		Subject subject = SecurityUtils.getSubject();
		Session session = subject.getSession();		
		String account = (String) session.getAttribute("account");				
		return ResultVO.success(account);
	}
	
	
	/**
	* @Description: 获取用户列表
	*/
	@RequestMapping("userSelect")
	@ResponseBody
	public ResultVO userSelect(HttpServletRequest request,AccountShiftVO accountShift) {
		 PageUtil<AccountShiftVO> page = new PageUtil<>();	       
	        String pageNo = request.getParameter("pageNo");
	        String pageSize = request.getParameter("pageSize");
	        if (pageNo != null && !"".equals(pageNo) && pageSize != null && !"".equals(pageSize)) {
	            page.setPageNo(Integer.parseInt(pageNo));
	            page.setPageSize(Integer.parseInt(pageSize));
	        }
	        userService.userSelect(page, accountShift);
	        return ResultVO.success(page);
	}
	
}