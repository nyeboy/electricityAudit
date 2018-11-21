package com.audit.file.excel.Controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.audit.file.excel.service.PowerRatingService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.LogUtil;

@Controller
@RequestMapping("/upload")
public class PowerRatingController
{
	@Autowired
	private PowerRatingService prService;

	@RequestMapping("/powerRatingUpload")
	@ResponseBody
	public ResultVO importPowerRating(@RequestParam(value = "file") MultipartFile file, HttpServletRequest request)
	{
		if (file == null || file.isEmpty())
		{
			return ResultVO.failed("请上传文件！");
		}
		try
		{
			ResultVO result =  prService.saveExcel2DB(file);
			
			if (result.getMessage()!=null && result.getMessage()=="OK") {
				//调用存储过程--更新'SYS_EQUROOM_POWER_RATING'
				boolean b = prService.dataUpdate();
				return result;
			}
			return ResultVO.failed("数据更新出错！");
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			LogUtil.getLogger().error("额定功率表上传出错!");
			
			return ResultVO.failed("保存出错！", e.getMessage());
		}
	}
}
