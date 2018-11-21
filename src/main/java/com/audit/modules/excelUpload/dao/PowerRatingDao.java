package com.audit.modules.excelUpload.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import com.audit.file.excel.entity.PowerRatingMeta;
import com.audit.modules.common.mybatis.MybatisRepostiory;

// 额定功率表
@Component
@MybatisRepostiory
public interface PowerRatingDao
{
    void batchSave(@Param("list")List<PowerRatingMeta> powerRatingMeta);
    
    String dataUpdate(Map<String, Object> map);
}
