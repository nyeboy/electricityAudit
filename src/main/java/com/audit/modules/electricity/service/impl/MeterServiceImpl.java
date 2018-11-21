package com.audit.modules.electricity.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.electricity.dao.MeterDao;
import com.audit.modules.electricity.entity.MeterVo;
import com.audit.modules.electricity.service.MeterService;

@Transactional
@Service
public class MeterServiceImpl implements MeterService {

	@Autowired
	private MeterDao meterDao;
	@Override
	public MeterVo queryMeter(String meterId){
		return meterDao.queryMeter(meterId);
	}
	
	@Override
	public List<MeterVo> queryMeterList(String ownerId) {
		return meterDao.queryMeterList(ownerId);
	}

	@Override
	public Boolean saveMeter(MeterVo meterVo) {
		meterVo.setMeterId(StringUtils.getUUid());
		return meterDao.saveMeter(meterVo);
	}

	@Override
	public Boolean updateMeter(MeterVo meterVo) {
		return meterDao.updateMeter(meterVo);
	}

	@Override
	public Boolean deleteMeter(String meterId) {
		return meterDao.deleteMeter(meterId);
	}

	@Override
	public Boolean deleteMeterByOwnerId(String ownerId) {
		return meterDao.deleteMeterByOwnerId(ownerId);
	}

}
