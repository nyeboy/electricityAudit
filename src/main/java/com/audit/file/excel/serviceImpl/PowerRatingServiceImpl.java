package com.audit.file.excel.serviceImpl;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.audit.file.excel.entity.PowerRatingMeta;
import com.audit.file.excel.service.PowerRatingService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.dict.DefaultCode;
import com.audit.modules.common.utils.BatchUtil;
import com.audit.modules.common.utils.ImportExcelUtil;
import com.audit.modules.common.utils.Log;
import com.audit.modules.common.utils.LogUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.excelUpload.dao.PowerRatingDao;
import com.google.common.collect.Lists;

@Service
public class PowerRatingServiceImpl implements PowerRatingService
{
	private static final int POWER_RATING_START = 1;
	
    @Resource
    private SqlSessionTemplate sqlSessionTemplate;
    
    @Resource
    private PowerRatingDao powerRatingDao;

	@Override
	public ResultVO saveExcel2DB(MultipartFile file) throws Exception
	{
		if (file == null || file.isEmpty())
		{
			LogUtil.getLogger().error("待上传文件为空");
			
			return ResultVO.failed(DefaultCode.FAILED.getCode(), "请选择额定功率表上传。");
		}
		
		InputStream in = file.getInputStream();
		List<Object[]> listob = new ImportExcelUtil().getBankListByExcel(in, file.getOriginalFilename(), POWER_RATING_START);
		List<PowerRatingMeta> prMetaList = mosaicBean(listob);

		new BatchUtil().batchSave(prMetaList,"com.audit.modules.excelUpload.dao.PowerRatingDao","batchSave",sqlSessionTemplate);
		
		return ResultVO.success();
	}

	private List<PowerRatingMeta> mosaicBean(List<Object[]> listob)
	{
		List<PowerRatingMeta> prMetaList = Lists.newArrayList();

		for(Object[] obj : listob)
		{
			
//			String ID = StringUtils.getUUid();
			String type = String.valueOf(obj[0]) + "";
			String model =  String.valueOf(obj[1]) + "";
			String vendor = String.valueOf(obj[2]) + "";
			String powerRating = String.valueOf(obj[3]) + "";
		
			
			PowerRatingMeta prMeta = new PowerRatingMeta();
//			prMeta.setId(ID);
			prMeta.setType(type);
			prMeta.setModel(model);
			prMeta.setVendor(vendor);
			prMeta.setPowerRatingD(powerRating);
			
			prMetaList.add(prMeta);
		}
		return prMetaList;
	}
	
	
	/**
	 * 更新数据表
	 * @param list
	 * @return
	 */
	@Override
	public boolean dataUpdate(){
		try {
			Map<String, Object> param = new HashMap<String, Object>();
			param.put("code", null);
			powerRatingDao.dataUpdate(param);
			if (("1").equals(param.get("code").toString())) {
				return true;
			}
			return false;
		} catch (Exception e) {
			Log.error("数据更新失败！："+e.getMessage());
			return false;
		}
	}
	
}
