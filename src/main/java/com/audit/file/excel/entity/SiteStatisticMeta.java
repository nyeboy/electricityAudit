package com.audit.file.excel.entity;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 站点统计元数据类
 * 
 */
public class SiteStatisticMeta
{
	private String id = "";
	// 省网标识,整型
	private int system_title = 0;
	// 资源类型 ，整型
	private int ne_class = 0;
	// 站点名称。字符串
	private String site_name = "";
	// 站点编号。整型
	private int site_no = 0;
	// 归属地市，字符串
	private String site_attribution = "";
	// 数据采集时间，SimpleDateFormat
	private Date time = null;
	// 闲忙时开关电源负载电流，浮点数
	private String elecCurrent = "";
	// 开关电源直流系统输出电压，浮点数
	private String output_voltage = "";
	// 开关电源测点监控状态，整型
	private int switch_power_state = 0;
	
	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public int getSystem_title()
	{
		return system_title;
	}
	
	public void setSystem_title(int system_title)
	{
		this.system_title = system_title;
	}
	
	public int getNe_class()
	{
		return ne_class;
	}
	
	public void setNe_class(int ne_class)
	{
		this.ne_class = ne_class;
	}
	
	public String getSite_name()
	{
		return site_name;
	}
	
	public void setSite_name(String site_name)
	{
		this.site_name = site_name;
	}
	public int getSite_no()
	{
		return site_no;
	}
	
	public void setSite_no(int site_no)
	{
		this.site_no = site_no;
	}
	
	public String getSite_attribution()
	{
		return site_attribution;
	}
	
	public void setSite_attribution(String site_attribution)
	{
		this.site_attribution = site_attribution;
	}
	
	public Date getTime()
	{
		return time;
	}
	public void setForm(Date time)
	{
		this.time = time;
	}
	
	public String getElecCurrent()
	{
		return elecCurrent;
	}
	
	public void setElecCurrent(String elecCurrent)
	{
		this.elecCurrent = elecCurrent;
	}
	
	public String getOutput_voltage()
	{
		return output_voltage;
	}
	
	public void setOutput_voltage(String output_voltage)
	{
		this.output_voltage = output_voltage;
	}
	
	public int getSwitch_power_state()
	{
		return switch_power_state;
	}
	
	public void setSwitch_power_state(int switch_power_state)
	{
		this.switch_power_state = switch_power_state;
	}

	public String toString()
	{
		return "省网标识  : " + system_title + "\n资源类型 : " + ne_class + "\n站点名称 : " + site_name
			+ "\n站点编号 : " + site_no + "\n归属地市 : " + site_attribution + "\n数据采集时间 : " + time
			+ "\n闲忙时开关电源负载电流 : " + elecCurrent + "\n开关电源直流系统输出电压 : " + output_voltage
			+ "\n开关电源测点监控状态 : " + switch_power_state;
	}
}
