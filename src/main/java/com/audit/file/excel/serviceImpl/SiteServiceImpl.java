package com.audit.file.excel.serviceImpl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.audit.file.excel.UploadExcelTask;
import com.audit.file.excel.entity.SiteStatisticMeta;
import com.audit.file.excel.service.SiteService;
import com.audit.modules.common.utils.BatchUtil;
import com.audit.modules.common.utils.LogUtil;
import com.audit.modules.excelUpload.dao.SiteDao;
import com.google.common.collect.Lists;

@Service
public class SiteServiceImpl implements SiteService
{

	@Autowired
	SiteDao siteDao;

    @Resource
    private SqlSessionTemplate sqlSessionTemplate;

	@Override
	public void saveExcel2DB(List<Object[]> list) throws Exception
	{
		List<SiteStatisticMeta> siteStatisticMetas = mosaicBean(list);

		new BatchUtil().batchSave(siteStatisticMetas,"com.audit.modules.excelUpload.dao.SiteDao","batchSave",sqlSessionTemplate);
	}

	private List<SiteStatisticMeta> mosaicBean(List<Object[]> listob)
	{
		List<SiteStatisticMeta> staticMetaList = Lists.newArrayList();
		SimpleDateFormat timeTmp = new SimpleDateFormat("yyyyMMdd");
		Date now = new Date();
		String primaryID = timeTmp.format(now);
		
		int idTmp = 0;
		for (Object[] objects : listob)
		{
			// 使用“yyyyMMdd”+id的方式生成主键
			String id = primaryID + (++idTmp);
			int system_title = (int) objects[0];
			int ne_class =(int) objects[1];
			String site_name = objects[2] + "";
			int site_no = Integer.valueOf(objects[3] + "");
			String site_attribution = objects[4] + "";

			// 对应数据库表“SYS_SWITCH_MODE_POWER”中的TIME字段，使用Date类型存储
			SimpleDateFormat time = new SimpleDateFormat("yyyy/MM/dd HH:mm");
			Date date = null;
			try
			{
				date = time.parse(objects[5] + "");
			} 
			catch (ParseException e)
			{
				e.printStackTrace();
				LogUtil.getLogger(UploadExcelTask.class).error(e.getMessage());
			}
			
			String elecCurrent = String.valueOf(new BigDecimal(objects[6]+"").doubleValue());
			String output_voltage = String.valueOf(new BigDecimal(objects[7]+"").doubleValue());
			int switch_power_state = Integer.valueOf(objects[8]+"");

			SiteStatisticMeta meta = new SiteStatisticMeta();
			meta.setId(id);
			meta.setSystem_title(system_title);
			meta.setNe_class(ne_class);
			meta.setSite_name(site_name);
			meta.setSite_no(site_no);
			meta.setSite_attribution(site_attribution);
			meta.setForm(date);
			meta.setElecCurrent(elecCurrent);
			meta.setOutput_voltage(output_voltage);
			meta.setSwitch_power_state(switch_power_state);

			staticMetaList.add(meta);
		}
		return staticMetaList;
	}
}
