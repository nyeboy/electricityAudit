package com.audit.modules.excelUpload.dao;

import java.util.List;

import org.springframework.stereotype.Component;

import com.audit.file.excel.entity.SiteStatisticMeta;
import com.audit.modules.common.mybatis.MybatisRepostiory;

@Component
@MybatisRepostiory
public interface SiteDao
{
	void deleteAll();
    void batchSave(List<SiteStatisticMeta> siteStatisticMeta);
}
