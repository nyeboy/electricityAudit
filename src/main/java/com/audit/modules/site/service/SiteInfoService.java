package com.audit.modules.site.service;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.mybatis.PageUtil;
import com.audit.modules.site.entity.BasedataLableVO;
import com.audit.modules.site.entity.SiteInfoVO;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author :  jiadu
 * @Description :  站点信息查询
 * @date : 2017/3/10
 * Copyright (c) , IsoftStone All Right reserved.
 */
public interface SiteInfoService {

    SiteInfoVO queryById(String siteId);
//    List<SiteInfoVO> querySite(Map<String,String> paramMap);
    
    List<BasedataLableVO> queryByIdTOEqRoom(String id);
	
	List<BasedataLableVO> queryByIdTORePoint(String id);

    void querySite(PageUtil<SiteInfoVO> pageUtil, String siteName, String cityId, String countyId,String meterCode);
    public List<Map<String,Object>> querySiteExcel(PageUtil<SiteInfoVO> pageUtil);
    /**
     * 设置超标比例
     *
     * @param electricityId    电费ID
     * @param siteId           报账点ID
     * @param totalDays        总天数
     * @param totalElectricity 总电量
     */
    void setOverBenchmarkProportion(String electricityId, String siteId, Integer totalDays, Long totalElectricity);

    ResultVO importExcel(MultipartFile file) throws Exception;
    
	//查找站点信息表所有信息
	public List<SiteInfoVO> queryAll();
	
	public SiteInfoVO getPayTypeById(String id);
}
