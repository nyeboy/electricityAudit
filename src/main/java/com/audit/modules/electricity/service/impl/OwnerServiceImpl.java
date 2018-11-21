package com.audit.modules.electricity.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.dao.OwnerDao;
import com.audit.modules.electricity.entity.MeterVo;
import com.audit.modules.electricity.entity.OwnerMeterVo;
import com.audit.modules.electricity.entity.OwnerVo;
import com.audit.modules.electricity.service.MeterService;
import com.audit.modules.electricity.service.OwnerService;

@Transactional
@Service
public class OwnerServiceImpl implements OwnerService {

	@Autowired
	private OwnerDao ownerDao;
	
	@Resource
	private MeterService meterService;
	
	@Override
	public void queryPage(PageUtil<OwnerVo> page, OwnerVo ownerVo) {
		page.setObj(ownerVo);
		ownerDao.queryPage(page);
	}

	@Override
	public OwnerVo queryOwner(String ownerId) {
		OwnerVo ownerVo = ownerDao.queryOwner(ownerId);
		//查询业主电表列表信息
		if(ownerVo != null){
			ownerVo.setMeterList(meterService.queryMeterList(ownerId));
		}
		return ownerVo;
	}

	@Override
	public ResultVO saveOwner(OwnerVo ownerVo) {
		boolean isSuccess = false;
		if(null != ownerVo) {
			ownerVo.setOwnerId(StringUtils.getUUid());
			isSuccess = ownerDao.saveOwner(ownerVo);
			if(isSuccess){
				if(null != ownerVo.getMeterList() && ownerVo.getMeterList().size() > 0){
					for(MeterVo meterVo :ownerVo.getMeterList()){
						meterVo.setOwnerId(ownerVo.getOwnerId());
						meterService.saveMeter(meterVo);
					}
				}
			}
		}
		
		return isSuccess?ResultVO.success():ResultVO.failed("保存失败");
	}

	@Override
	public ResultVO updateOwner(OwnerVo ownerVo) {
		boolean isSuccess = ownerDao.updateOwner(ownerVo);
		if(isSuccess){
			if(null != ownerVo.getMeterList() && ownerVo.getMeterList().size() > 0){
				for(MeterVo meterVo :ownerVo.getMeterList()){
					meterVo.setOwnerId(ownerVo.getOwnerId());
					String meterId = meterVo.getMeterId();
					if (null != meterId && !meterId.equals("")) {
						meterService.updateMeter(meterVo);
					}else {
						meterVo.setMeterId(StringUtils.getUUid());
						meterService.saveMeter(meterVo);
					}
				}
			}
		}
		return isSuccess?ResultVO.success():ResultVO.failed("修改失败");
	}

	@Override
	public ResultVO deleteOwner(String ownerId) {
		boolean isSuccess = ownerDao.deleteOwner(ownerId);
		if (isSuccess) {
			meterService.deleteMeterByOwnerId(ownerId);
		}
		return isSuccess?ResultVO.success():ResultVO.failed("删除失败");
	}

	@Override
	public ResultVO bathDeleteOwner(String[] ownerIds) {
		boolean isSuccess = ownerDao.bathDeleteOwner(ownerIds);
		return isSuccess?ResultVO.success():ResultVO.failed("删除失败");
	}

	@Override
	public List<OwnerMeterVo> exportExcel(Map<String,Long> map) {
		List<OwnerMeterVo> list= ownerDao.exportExcel(map);
		return list;
	}
	
	@Override
	public Long listCount() {
		return ownerDao.listCount();
	}
	
}
