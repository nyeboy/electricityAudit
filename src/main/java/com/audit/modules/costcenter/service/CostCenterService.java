package com.audit.modules.costcenter.service;

import java.util.List;
import java.util.Map;

import com.audit.modules.costcenter.entity.CostCeterVO;
import com.audit.modules.system.entity.UserVo;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author : jiadu
 * @Description : 成本中心
 * @date : 2017/3/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface CostCenterService {
    List<CostCeterVO> findByLoginUser(Map<String, String> paramterMap);
    void importExecel(MultipartFile file) throws Exception;

}
