package com.audit.modules.system.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.GlobalUitl;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.system.dao.SysNoticReadedDao;
import com.audit.modules.system.dao.SysNoticeDao;
import com.audit.modules.system.entity.SysNoticReaded;
import com.audit.modules.system.entity.SysNoticVo;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.service.SysNoticeService;

/**
 * @Description : TODO(系统公告)
 *
 * @author : chentao
 * @date : 2017年4月17日
 *
 *       Copyright (c) 2017, IsoftStone All Right reserved.
 */

@Service
public class SysNoticeServiceImpl implements SysNoticeService {

	@Autowired
	private SysNoticeDao sysNoticeDao;

	@Autowired
	private SysNoticReadedDao sysNoticReadedDao;

	/**
	 * @Description: 查询所有
	 * @param :page
	 *            查询参数
	 * @return :SysNoticVo
	 */
	@Override
	public List<SysNoticVo> queryNoticByPage(PageUtil<SysNoticVo> page) {

		sysNoticeDao.queryNoticByPage(page);
		return null;
	}

	/**
	 * @Description: 删除所选公告 @param :noticIds 公告id数组 @return :返回操作状态/信息 @throws
	 */
	@Override
	public ResultVO deleteNoticById(String noticIds) {

		if (noticIds != null && !noticIds.equals("")) {
			String[] noticId = noticIds.split(",");

			sysNoticeDao.deleteNoticById(noticId);
			return ResultVO.success();
		}
		return ResultVO.failed("没有被删除的目标！");
	}

	/**
	 * @Description:添加公告 @param :sysNoticVo SysNoticVo对象 @return :ResultVO
	 *                   返回操作状态/信息 @throws
	 */
	@Override
	public ResultVO addNotic(SysNoticVo sysNoticVo, HttpServletRequest request) {

		UserVo userVo = GlobalUitl.getLoginUser();
		String account = "匿名";
		if (userVo != null) {
			if (userVo.getAccount() != null && !userVo.getAccount().equals("")) {
				account = userVo.getUserName();
			}
		}

		if (sysNoticVo != null) {
			sysNoticVo.setUserName(account);
			sysNoticVo.setNoticId(StringUtils.getUUid());
			sysNoticVo.setCreateDate(new Date());
			sysNoticeDao.addNotic(sysNoticVo);
			return ResultVO.success();
		}
		return ResultVO.failed("添加失败！");

	}

	/**
	 * @Description:更新公告(noticId 必填)
	 * @param :sysNoticVo
	 *            SysNoticVo对象
	 * @return :ResultVO 返回操作状态/信息
	 * 
	 */
	@Override
	public ResultVO updateNotic(SysNoticVo sysNoticVo) {
		if (sysNoticVo != null) {
			sysNoticeDao.updateNotic(sysNoticVo);
			return ResultVO.success();
		}
		return ResultVO.failed("修改失败！");
	}

	/**
	 * @Description:根据id查找
	 * @param :noticId
	 *            对象id
	 * @return :ResultVO 返回操作状态/信息
	 * 
	 */
	@Override
	public ResultVO queryNoticById(String noticId) {

		if (noticId != null && !noticId.equals("")) {
			SysNoticVo sysNoticVo = sysNoticeDao.queryNoticById(noticId);
			return ResultVO.success(sysNoticVo);
		}
		return ResultVO.failed("结果不存在！");
	}

	/**
	 * @Description: 根据用户Id查询未读公共告 @param : @return : @throws
	 */
	@Override
	public Map<String, Object> queryNoticeNotRead(String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		// 已读的公告
		boolean isReaded = false;
		String sysNoticId = null;
		List<SysNoticVo> readedList = new ArrayList<SysNoticVo>();
		List<SysNoticVo> notReadedList = new ArrayList<SysNoticVo>();
		Iterator<SysNoticVo> iterator = null;
		SysNoticVo sysNoticVo = null;
		List<String> notReadIdList = new ArrayList<String>();
		List<String> readedIdList = sysNoticeDao.queryNoticeIdReaded(userId);
		List<SysNoticVo> noticeList = sysNoticeDao.queryAllNotice();
		
		if (null != noticeList && noticeList.size() > 0) {
			iterator = noticeList.iterator();
			while (iterator.hasNext()) {
				isReaded = false;
				sysNoticVo = iterator.next();
				sysNoticId = sysNoticVo.getNoticId();
				if (null != readedIdList && readedIdList.size() > 0) {
					for (String noticId : readedIdList) {
						// 如果已读
						if (sysNoticVo.getNoticId().equals(noticId)) {
							readedList.add(sysNoticVo);
							isReaded = true;
						}
					}
				}
				//如果未读
				if(!isReaded){
					notReadIdList.add(sysNoticId);
					notReadedList.add(sysNoticVo);
				}
			}
		}
		
		if (readedList.size() > 0) {
			notReadedList.addAll(readedList);
		}
		resultMap.put("notReadIdList", notReadIdList);
		resultMap.put("noticeList", notReadedList);
		return resultMap;
	}

	/**
	 * @Description: 添加公共已读信息 @param : @return : @throws
	 */
	@Override
	public void addNoticeReaded(String noticeId, String userId) {
		if (null != noticeId && null != userId) {
			List<String> readedIdList = sysNoticeDao.queryNoticeIdReaded(userId);
			for(String readedId : readedIdList){
				if(readedId.equals(noticeId)){
					return;
				}
			}
			SysNoticReaded sysNoticReaded = new SysNoticReaded();
			sysNoticReaded.setNoticeId(noticeId);
			sysNoticReaded.setUserId(userId);
			sysNoticReaded.setId(StringUtils.getUUid());
			sysNoticReadedDao.insert(sysNoticReaded);
		}

	}

}
