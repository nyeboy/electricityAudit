package com.audit.file.excel.service;

import org.springframework.web.multipart.MultipartFile;

import com.audit.modules.common.ResultVO;

public interface PowerRatingService
{
	ResultVO saveExcel2DB(MultipartFile file) throws Exception;
	
	boolean dataUpdate();
}
