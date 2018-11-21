package com.audit.modules.excelUpload.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.file.excel.entity.SmartMeterMeta;
import com.audit.modules.common.mybatis.MybatisRepostiory;

@Component
@MybatisRepostiory
public interface SmartMeterDao
{
	void deleteAll();
    void batchSave(List<SmartMeterMeta> smartMeterMeta);
}
