package com.audit.file.excel.entity;

import com.audit.modules.common.utils.StringUtils;

public class PowerRatingMeta
{
	private Integer id;
	
	// 类型
	private String type = "";
	
	//型号
	private String model = "";
	
	//厂家
	private String vendor = "";
	
	//额定功率
	private String powerRating = "";
	
	private Double powerRatingD;
	
	
	public Double getPowerRatingD() {
		return powerRatingD;
	}

	public void setPowerRatingD(String powerRating) {
		if(!StringUtils.isBlank(powerRating)){
			try {
				this.powerRatingD = Double.parseDouble(powerRating);
			} catch (Exception e) {
				// TODO: handle exception
			}
		}
	}

	public Integer getId()
	{
		return id;
	}

	public void setId(Integer id)
	{
		this.id = id;
	}

	public String getType()
	{
		return type;
	}

	public void setType(String type)
	{
		this.type = type;
	}

	public String getModel()
	{
		return model;
	}

	public void setModel(String model)
	{
		this.model = model;
	}

	public String getVendor()
	{
		return vendor;
	}

	public void setVendor(String vendor)
	{
		this.vendor = vendor;
	}

	public String getPowerRating()
	{
		return powerRating;
	}

	public void setPowerRating(String powerRating)
	{
		this.powerRating = powerRating;
	}
	
	
}
