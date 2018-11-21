package com.audit.modules.electricity.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.audit.filter.exception.CommonException;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.GlobalUitl;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.dao.TowerReimburseDao;
import com.audit.modules.electricity.entity.TowerReiEleVo;
import com.audit.modules.electricity.entity.TowerReimburseVo;
import com.audit.modules.electricity.entity.TowerSaveVO;
import com.audit.modules.electricity.service.TowerElectricityService;
import com.audit.modules.electricity.service.TowerReimburseService;
import com.audit.modules.invoice.entity.InvoiceVO;
import com.audit.modules.invoice.service.InvoiceService;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.workflow.entity.TowerConstant;
import com.audit.modules.workflow.service.impl.SubmitFinanceServiceImpl;
import com.google.common.collect.Maps;

@Transactional
@Service
public class TowerReimburseServiceImpl implements TowerReimburseService {

	@Autowired
    private TowerReimburseDao towerReimburseDao;
	
	@Autowired
	private TowerElectricityService towerElectricityService;
	
	@Autowired
	private InvoiceService invoiceService;
	
	@Autowired
    private SubmitFinanceServiceImpl submitFinanceService;
	
	@Override
	public void queryPage(PageUtil<TowerReimburseVo> page,TowerReimburseVo record) {
		page.setObj(record);
		towerReimburseDao.queryPage(page);
	}

	@Override
	public TowerReimburseVo selectByPrimaryKey(Integer id) {
		TowerReimburseVo towerReimburseVo = towerReimburseDao.selectByPrimaryKey(id);
		// 设置状态显示值
		switch (towerReimburseVo.getStatus()) {
		case 0:
			towerReimburseVo.setStatusName("等待报销发起人推送财务");
			break;
		case 1:
			towerReimburseVo.setStatusName("等待推送财务");
			break;
		case 2:
			towerReimburseVo.setStatusName("等待财务报销");
			break;
		case 3:
			towerReimburseVo.setStatusName("报销成功");
			break;
		case 4:
			towerReimburseVo.setStatusName("报销失败");
			break;
		case 5:
			towerReimburseVo.setStatusName("已撤销");
			break;
		default:
			towerReimburseVo.setStatusName("等待报销发起人推送财务");
			break;
		}
		// 设置推送类型显示值
		switch (towerReimburseVo.getReimburseType()) {
		case 0:
			towerReimburseVo.setReimburseTypeName("报销");
			break;
		default:
			towerReimburseVo.setReimburseTypeName("报销");
			break;
		}
		if(towerReimburseVo != null){
			towerReimburseVo.setTowerElectrictys(towerElectricityService.queryTowerElBySubmitId(id));
		}
		return towerReimburseVo;
	}

	@Override
	public ResultVO deleteByPrimaryKey(Integer id) {
		return towerReimburseDao.deleteByPrimaryKey(id)?ResultVO.failed("删除失败"):ResultVO.success();
	}

	@Override
	public ResultVO insert(TowerReimburseVo record) {
		Boolean isSuccess = false;
		// 获取登录用户信息
		UserVo userVo = GlobalUitl.getLoginUser();
		record.setUserId(userVo.getUserId());
		record.setCityId(userVo.getCity());
		record.setCountyId(userVo.getCounty());
		Integer id = 1;
		Integer ids = towerReimburseDao.selectId();
		id=ids+1;
		record.setId(id);
		// 生成电费提交单单号
		record.setReimburseNo(StringUtils.createSerialNumber("TTBX"));
		record.setReimburseType(0);
		record.setCreateDate(new Date());
		// 根据登录人，记录操作类型
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.checkRole(TowerConstant.FLOW_BX_ROLE);
			record.setStatus(1);
		} catch (AuthorizationException e) {
			record.setStatus(0);
		}
		record.setTotalAmount(towerElectricityService.queryTotalAmountByTowerIDs(record.getTowerEleIds()));
		// 查询税率
		InvoiceVO invoice = invoiceService.selectInvoiceById(record.getInvoiceType());
		BigDecimal billTax = new BigDecimal(invoice.getBillTax()).divide(new BigDecimal(100));
		// 计算价款金额
		BigDecimal total = new BigDecimal(0);
		if (record.getTotalAmount() != null) {
			total = new BigDecimal(record.getTotalAmount());
		}
		BigDecimal priceAmount = total.divide(billTax.add(new BigDecimal(1)), 2, BigDecimal.ROUND_HALF_UP);
		record.setPriceAmount(priceAmount.doubleValue());
		// 计算税金金额
		BigDecimal taxAmount = total.subtract(priceAmount).setScale(2, BigDecimal.ROUND_HALF_UP);
		record.setTaxAmount(taxAmount.doubleValue());
		// 保存报销单
		isSuccess = towerReimburseDao.insert(record);
		// 保存报销单电费稽核单详情列表
		isSuccess = saveReiEle(record.getId(), record.getTowerEleIds());
		// 更新电费录入数据的状态
		String[] updateIds = record.getTowerEleIds().toArray(new String[record.getTowerEleIds().size()]);
		towerElectricityService.updateStatus(updateIds, 4);
		return isSuccess ? ResultVO.success(record) : ResultVO.failed("添加失败");
	}

	private Boolean saveReiEle(Integer reimburseId,List<String> towerEleIds){
		List<TowerReiEleVo> lst = new ArrayList<>();
		Integer reid = 1;
		for(String id : towerEleIds){
			Integer ids = towerReimburseDao.selectReId();
			reid=ids+1;
			TowerReiEleVo vo = new TowerReiEleVo();
			vo.setId(reid);
			vo.setReimburseId(reimburseId);
			vo.setTowerId(id);
			lst.add(vo);
		}
		
		return towerReimburseDao.saveReiEle(lst);
	}
	@Override
	public ResultVO updateByPrimaryKeySelective(TowerReimburseVo record) {
		return towerReimburseDao.updateByPrimaryKeySelective(record) ? ResultVO.success() : ResultVO.failed("更新失败");
	}

	@Override
	public ResultVO updateByPrimaryKey(TowerReimburseVo record) {
		return towerReimburseDao.updateByPrimaryKey(record) ? ResultVO.success() : ResultVO.failed("更新失败");
	}

	/**
	 * 财务推送
	 * 
	 * @param ids 记录标示
	 * @param state 状态
	 */
	@Override
	public void updateList(String[] ids, Integer state) {
		// 推送财务
		if (2 == state) {
			List<Map<String, Object>> sendList = new ArrayList<>();
			for (String id : ids) {
				Map<String, Object> info = new HashMap<>();
				// 电费提交单内的一条稽核单
				TowerReimburseVo towerReimburseVo = selectByPrimaryKey(Integer.valueOf(id));
				TowerSaveVO electricty = towerElectricityService
						.findOneByID(towerReimburseVo.getTowerElectrictys().get(0).getId());
				info.put("electricty", electricty);
				// 电费提交单信息
				info.put("electricitySubmitVO", towerReimburseVo);
				sendList.add(info);
			}
			submitFinanceService.handleTowerFinance(sendList);
			// 更新数据的状态
			updateStates(ids, state);
		} else {
			// 更新数据的状态
			updateStates(ids, state);
		}
	}
	
	/**
	 * 更新数据的状态
	 * 
	 * @param ids 记录标示
	 * @param state 状态
	 */
	private void updateStates(String[] ids, Integer state) {
		for (String id : ids) {
			TowerReimburseVo record = new TowerReimburseVo();
			// 更新状态
			record.setId(Integer.valueOf(id));
			record.setStatus(state);
			updateByPrimaryKeySelective(record);
		}
	}

	/**
	 * 更新状态值
	 * 
	 * @param reimburseNos 电费提交单号
	 * @param status 状态值
	 */
	@Override
	public void updateByNo(String[] reimburseNos, Integer status) {
		if (reimburseNos == null || reimburseNos.length == 0) {
			throw new CommonException("电费提交单号不能为空！");
		}
		if (status == null) {
			throw new CommonException("请先登录！");
		}
		Map<String, Object> map = Maps.newHashMap();
		map.put("status", status);
		map.put("submitNos", reimburseNos);
		towerReimburseDao.updateByNo(map);
	}

	/**
	 * 通过流水号查询
	 * 
	 * @param reimburseNo 电费提交单号
	 * @return 电费提交单
	 */
	@Override
	public TowerReimburseVo queryByNo(String reimburseNo) {
		return towerReimburseDao.queryByNo(reimburseNo);
	}
}
