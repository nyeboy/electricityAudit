package com.audit.file.excel.entity;

import java.util.Date;

public class SmartMeterMeta
{
	/**
	 * 智能电表统计元数据类
	 * 
	 */
	private String ID = "";
	// 省网标识,整型
	private int SYSTEM_TITLE = 0;
	// 资源类型 ，整型
	private int NE_CLASS = 0;
	// 站点名称。字符串
	private String SITE_NAME = "";
	// 站点编号。整型
	private int SITE_NO = 0;
	// 归属地市，字符串
	private String SITE_ATTIBUTION = "";
	// 数据采集时间，SimpleDateFormat
	private Date TIME_START = null;
	// 数据采集截止时间
	private Date TIME_END = null;
	// 总表读数
	private String METER_DIAL = "";
	// 总电表状态位
	private String METER_STATE = "";
	// 主设备电表读数
	private String MAIN_EQUIPMENT_METER_DIAL = "";
	// 主设备电表状态位
	private int MAIN_EQUIPMENT_METER_STATE = 0;
	// 空调系统电表读数
	private String AIR_COND_METER_DIAL = "";
	// 空调系统电表状态位
	private int AIR_COND_METER_STATE = 0;
	// 基站室外日平均温度
	private String STATION_OUTDOOR_AVER_TEMP = "";
	// 基站室内日平均温度
	private String STATION_INDOOR_AVER_TEMP = "";
	// 基站日PUE值
	private String STATION_DAILY_PUE = "";
	// 开关电源转换损耗
	private String SWITCH_POWER_LOSS = "";
	
	public String getID()
	{
		return ID;
	}
	public void setID(String iD)
	{
		ID = iD;
	}
	public int getSYSTEM_TITLE()
	{
		return SYSTEM_TITLE;
	}
	public void setSYSTEM_TITLE(int sYSTEM_TITLE)
	{
		SYSTEM_TITLE = sYSTEM_TITLE;
	}
	public int getNE_CLASS()
	{
		return NE_CLASS;
	}
	public void setNE_CLASS(int nE_CLASS)
	{
		NE_CLASS = nE_CLASS;
	}
	public String getSITE_NAME()
	{
		return SITE_NAME;
	}
	public void setSITE_NAME(String sITE_NAME)
	{
		SITE_NAME = sITE_NAME;
	}
	public int getSITE_NO()
	{
		return SITE_NO;
	}
	public void setSITE_NO(int sITE_NO)
	{
		SITE_NO = sITE_NO;
	}
	public String getSITE_ATTIBUTION()
	{
		return SITE_ATTIBUTION;
	}
	public void setSITE_ATTIBUTION(String sITE_ATTIBUTION)
	{
		SITE_ATTIBUTION = sITE_ATTIBUTION;
	}
	public String getMETER_DIAL()
	{
		return METER_DIAL;
	}
	public void setMETER_DIAL(String mETER_DIAL)
	{
		METER_DIAL = mETER_DIAL;
	}
	public String getMETER_STATE()
	{
		return METER_STATE;
	}
	public void setMETER_STATE(String mETER_STATE)
	{
		METER_STATE = mETER_STATE;
	}
	public String getMAIN_EQUIPMENT_METER_DIAL()
	{
		return MAIN_EQUIPMENT_METER_DIAL;
	}
	public void setMAIN_EQUIPMENT_METER_DIAL(String mAIN_EQUIPMENT_METER_DIAL)
	{
		MAIN_EQUIPMENT_METER_DIAL = mAIN_EQUIPMENT_METER_DIAL;
	}
	public int getMAIN_EQUIPMENT_METER_STATE()
	{
		return MAIN_EQUIPMENT_METER_STATE;
	}
	public void setMAIN_EQUIPMENT_METER_STATE(int mAIN_EQUIPMENT_METER_STATE)
	{
		MAIN_EQUIPMENT_METER_STATE = mAIN_EQUIPMENT_METER_STATE;
	}
	public String getAIR_COND_METER_DIAL()
	{
		return AIR_COND_METER_DIAL;
	}
	public void setAIR_COND_METER_DIAL(String aIR_COND_METER_DIAL)
	{
		AIR_COND_METER_DIAL = aIR_COND_METER_DIAL;
	}
	public int getAIR_COND_METER_STATE()
	{
		return AIR_COND_METER_STATE;
	}
	public void setAIR_COND_METER_STATE(int aIR_COND_METER_STATE)
	{
		AIR_COND_METER_STATE = aIR_COND_METER_STATE;
	}
	public String getSTATION_OUTDOOR_AVER_TEMP()
	{
		return STATION_OUTDOOR_AVER_TEMP;
	}
	public void setSTATION_OUTDOOR_AVER_TEMP(String sTATION_OUTDOOR_AVER_TEMP)
	{
		STATION_OUTDOOR_AVER_TEMP = sTATION_OUTDOOR_AVER_TEMP;
	}
	public String getSTATION_INDOOR_AVER_TEMP()
	{
		return STATION_INDOOR_AVER_TEMP;
	}
	public void setSTATION_INDOOR_AVER_TEMP(String sTATION_INDOOR_AVER_TEMP)
	{
		STATION_INDOOR_AVER_TEMP = sTATION_INDOOR_AVER_TEMP;
	}
	public String getSTATION_DAILY_PUE()
	{
		return STATION_DAILY_PUE;
	}
	public void setSTATION_DAILY_PUE(String sTATION_DAILY_PUE)
	{
		STATION_DAILY_PUE = sTATION_DAILY_PUE;
	}
	public String getSWITCH_POWER_LOSS()
	{
		return SWITCH_POWER_LOSS;
	}
	public void setSWITCH_POWER_LOSS(String sWITCH_POWER_LOSS)
	{
		SWITCH_POWER_LOSS = sWITCH_POWER_LOSS;
	}
	public Date getTIME_START()
	{
		return TIME_START;
	}
	public void setTIME_START(Date tIME_START)
	{
		TIME_START = tIME_START;
	}
	public Date getTIME_END()
	{
		return TIME_END;
	}
	public void setTIME_END(Date tIME_END)
	{
		TIME_END = tIME_END;
	}
	

}
