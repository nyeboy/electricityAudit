package com.audit.file.excel.serviceImpl;

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
import com.audit.file.excel.entity.SmartMeterMeta;
import com.audit.file.excel.service.SmartMeterService;
import com.audit.modules.common.utils.BatchUtil;
import com.audit.modules.common.utils.LogUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.excelUpload.dao.SmartMeterDao;
import com.google.common.collect.Lists;

@Service
public class SmartMeterServiceImpl implements SmartMeterService
{
	@Autowired
	SmartMeterDao smartMeterDao;
	
    @Resource
    private SqlSessionTemplate sqlSessionTemplate;
	
	@Override
	public void saveExcel2DB(List<Object[]> list) throws Exception
	{
		List<SmartMeterMeta> smartMeterMeta = mosaicBean(list);
		
		new BatchUtil().batchSave(smartMeterMeta,"com.audit.modules.excelUpload.dao.SmartMeterDao","batchSave",sqlSessionTemplate);
		
	}
	
	private List<SmartMeterMeta> mosaicBean(List<Object[]> listob)
	{
		 List<SmartMeterMeta> smartMeterList = Lists.newArrayList();
		 
	     for (Object[] objects : listob)
	     {
	    	 String ID = StringUtils.getUUid();
	    	 int SYSTEM_TITLE = Integer.valueOf(objects[0] + "");
	    	 int NE_CLASS = Integer.valueOf(objects[1] + "");
	    	 String SITE_NAME = objects[2] + "";
	    	 int SITE_NO = Integer.valueOf(objects[3] + "");
	    	 String SITE_ATTIBUTION = objects[4] + "";
	    	 
	    	 
	    	 SimpleDateFormat time = new SimpleDateFormat("yyyy/MM/dd HH:mm");
	    	 Date TIME_START = null;
	    	 Date TIME_END = null;
			 try
			 {
				 TIME_START = time.parse(objects[5] + "");
				 TIME_END = time.parse(objects[6] + "");
			 } 
			 catch (ParseException e)
			 {
				 e.printStackTrace();
				 LogUtil.getLogger(UploadExcelTask.class).error(e.getMessage());
			 }
	    	 String METER_DIAL = objects[7] + "";
	    	 String METER_STATE = objects[8] + "";
	    	 String MAIN_EQUIPMENT_METER_DIAL = objects[9] + "";
	    	 int MAIN_EQUIPMENT_METER_STATE = Integer.valueOf(objects[10] + "");
	    	 String AIR_COND_METER_DIAL = objects[11] + "";
	    	 int AIR_COND_METER_STATE = Integer.valueOf(objects[12] + "");
	    	 String STATION_OUTDOOR_AVER_TEMP = objects[13] + "";
	    	 String STATION_INDOOR_AVER_TEMP = objects[14] + "";
	    	 String STATION_DAILY_PUE = objects[15] + "";
	    	 String SWITCH_POWER_LOSS = objects[16] + "";
	    	 
	    	 SmartMeterMeta meta = new SmartMeterMeta();
	    	 meta.setID(ID);
	    	 meta.setSYSTEM_TITLE(SYSTEM_TITLE);
	    	 meta.setNE_CLASS(NE_CLASS);
	    	 meta.setSITE_NAME(SITE_NAME);
	    	 meta.setSITE_NO(SITE_NO);
	    	 meta.setSITE_ATTIBUTION(SITE_ATTIBUTION);
	    	 meta.setTIME_START(TIME_START);
	    	 meta.setTIME_END(TIME_END);
	    	 meta.setMETER_DIAL(METER_DIAL);
	    	 meta.setMETER_STATE(METER_STATE);
	    	 meta.setMAIN_EQUIPMENT_METER_DIAL(MAIN_EQUIPMENT_METER_DIAL);
	    	 meta.setAIR_COND_METER_STATE(MAIN_EQUIPMENT_METER_STATE);
	    	 meta.setAIR_COND_METER_DIAL(AIR_COND_METER_DIAL);
	    	 meta.setAIR_COND_METER_STATE(AIR_COND_METER_STATE);
	    	 meta.setSTATION_OUTDOOR_AVER_TEMP(STATION_OUTDOOR_AVER_TEMP);
	    	 meta.setSTATION_INDOOR_AVER_TEMP(STATION_INDOOR_AVER_TEMP);
	    	 meta.setSTATION_DAILY_PUE(STATION_DAILY_PUE);
	    	 meta.setSWITCH_POWER_LOSS(SWITCH_POWER_LOSS);
	    	 
	    	 smartMeterList.add(meta);
	     }
	     return smartMeterList;
	}
}
