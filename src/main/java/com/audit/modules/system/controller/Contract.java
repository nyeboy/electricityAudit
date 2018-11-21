package com.audit.modules.system.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.audit.modules.system.service.ContractSystemService;

public class Contract {
	public void outter_asyncontract() {
		ContractSystemService service = new ContractSystemService();
		Date d = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateNowStr = sdf.format(d);
		
	//报错注释了，以后使用	service.getContractInfoAndSaveToDB("2000-1-1", dateNowStr);
	}

}
