package com.audit.modules.costcenter.service.impl;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.audit.modules.common.utils.BatchUtil;
import com.audit.modules.common.utils.ImportExcelUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.costcenter.dao.CostCenterDao;
import com.audit.modules.costcenter.entity.CostCeterEntity;
import com.audit.modules.costcenter.entity.CostCeterVO;
import com.audit.modules.costcenter.service.CostCenterService;
import com.audit.modules.system.entity.UserVo;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Transactional
@Service
public class CostCenterServiceImpl implements CostCenterService {

    @Autowired
    private CostCenterDao costCenterDao;

    @Resource
    private SqlSessionTemplate sqlSessionTemplate;

    /**
     * @Description: 根据用户查询成本中心
     * @param :
     * @return :
     * @throws
    */
    @Override
    public List<CostCeterVO> findByLoginUser(Map<String, String> paramterMap) {       
    	return costCenterDao.findByLoginUser(paramterMap);
    }

    @Override
    public void importExecel(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("请上传文件！");
        }
        InputStream in = null;
        List<Object[]> listob = null;
        in = file.getInputStream();
        listob = new ImportExcelUtil().getBankListByExcel(in, file.getOriginalFilename(),1);
        in.close();
        List<CostCeterEntity> costCeterEntities = mosaicBean(listob);
        costCenterDao.deleteAll();
        new BatchUtil().batchSave(costCeterEntities,"com.audit.modules.costcenter.dao.CostCenterDao","batchSave",sqlSessionTemplate);
    }

    private List<CostCeterEntity> mosaicBean(List<Object[]> listob) {
        List<CostCeterEntity> costCeterEntities = Lists.newArrayList();
        for (Object[] objects : listob) {
            String deploymentNo = objects[0] + "";
            String misConpanyNo = objects[2] + "";
            String costCenterNo = objects[3] + "";
            String costCenterName = objects[4] + "";
            String sortNo = objects[5] + "";
            CostCeterEntity costCeterEntity = new CostCeterEntity();
            costCeterEntity.setDeploymentNo(deploymentNo);
            costCeterEntity.setMisConpanyNo(misConpanyNo);
            costCeterEntity.setCostCenterNo(costCenterNo);
            costCeterEntity.setCostCenterName(costCenterName);
            try {
                costCeterEntity.setSortNo(Integer.parseInt(sortNo));
            } catch (Exception e) {
                System.out.println("排序行为空，deploymentNo=" + deploymentNo);
            }
            costCeterEntity.setId(StringUtils.getUUid());
            costCeterEntities.add(costCeterEntity);
        }
        return costCeterEntities;
    }
}
