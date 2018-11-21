package com.audit.file.excel;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.audit.file.excel.service.SiteService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.dict.DefaultCode;
import com.audit.modules.common.utils.ImportExcelUtil;
import com.audit.modules.common.utils.LogUtil;
import com.google.common.collect.Lists;

@Component
public class UploadExcelTask
{
	@Autowired
	SiteService siteSer;
	
	private String FilePath = "E:/";
	
	// 电流
	static double CURRENT_TOTAL = 0.0;
	static double CURRENT_AVER = 0.0;
	// 电压
	static double VOLTAGE_TOTAL = 0.0;
	static double VOLTAGE_AVER = 0.0;
	// 总记录条数
	static int RECORD_TOTAL = 0;
	// 单个文件吉林路条数
	static int RECORD_FILE = 0;
	
	// 
	static final int RESULT_SUCCESS = 1;
	static final int RESULT_FAIL = 0;
	
	public String getFilePath()
	{
		return FilePath;
	}
	
	public void setFilePath(String filePath)
	{
		FilePath = filePath;
	}
	
	/**
	 * 从文件夹中选择不同目录下的Excel文件 ：
	 * BTSRSWITCH:开关电源
	 * BTSRROOM:智能电表
     * RATEDPOWER:额定工具
     * 进行导入
     * 
	 * 此方法使用顺序导入，没有采用线程池，后期可优化 
	 * 
	 */
	@Scheduled(cron="0 0 2 * * *")
	public ResultVO chooseFile2Upload()
	{
		ResultVO res = null;
		File[] direcs = new File(FilePath).listFiles();
		
		int i = 0;
		for(; i < direcs.length; i++)
		{
			if(!direcs[i].isDirectory())
			{
				continue;
			}
			
			String dirName = direcs[i].getName();
			int index = ExcelFilename.getIndex(dirName);
			switch(index)
			{
			case 1 :
				res = uploadBTSRROOMSWITCH(dirName);
			case 2 :
				res = UploadBTSRROOM.uploadBR(dirName);
			
			default:
				LogUtil.getLogger(UploadExcelTask.class).error("暂不支持此文件夹内容导入  ：" + dirName);
			}
			
			if(res.getCode() != DefaultCode.SUCCESS.getCode())
			{
				return res;
			}
		}
		
		return null;
	}
	
	/**
	 * 定时任务，每天凌晨2:00执行
	 * 提取固定目录下的Excel文件，计算文件中电流、电压平局值后导入数据库
	 * 文件大小暂不做限制
	 * 
	 * @param request
	 * @return ResultVO
	 * */
	public ResultVO uploadBTSRROOMSWITCH(String dirName)
	{
		List<List<Object[]>> fList = getFileList4Switch();
		if(null == fList)
		{
			return ResultVO.failed("该文件夹下没有文件可导入 ： ",dirName);
		}
		
		List<Object[]> afterCalList = calAver2List(fList);
		fList = null;
		try
		{
			siteSer.saveExcel2DB(afterCalList);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			LogUtil.getLogger(UploadExcelTask.class).error(e.getMessage());
			
			return ResultVO.failed("导入Excel文件到数据库出错！",e.getMessage());
		}
		
        return ResultVO.success();
	}

	private List<List<Object[]>> getFileList4Switch()
	{
		File[] files =  getFileListOfDir();
		if(1 > files.length)
		{
			return null;
		}
		
		File execFile = null;
		List<Object[]> listobj = null;
		List<List<Object[]>> fList = Lists.newArrayList();
		
		FileInputStream fin = null;
		
		int fileNum = 0;
		for(; fileNum < files.length; fileNum++)
		{
			try 
			{
				execFile = files[fileNum];
				fin = new FileInputStream(files[fileNum]);
				listobj = new ImportExcelUtil().getBankListByExcel(fin, execFile.getName(),1);
				fList.add(listobj);
				
				// 如果文件目录中有多个相同文件徐导入到一张表中，需比较每个文件中的记录数是否一致
				if(1 < fList.size() && RESULT_SUCCESS != checkRecNum(fList))
				{
					
					LogUtil.getLogger(UploadExcelTask.class).error("待导入Excel文件中记录数不一致！");
					return null;
				}
					
				calTotalPerFile(listobj);
			} 
			catch (Exception e) 
			{
				e.printStackTrace();
				LogUtil.getLogger(UploadExcelTask.class).error(e.getMessage());
				
				return null;
			}
			finally
			{
				try
				{
					fin.close();
				}
				catch(IOException e)
				{
					e.printStackTrace();
					LogUtil.getLogger(UploadExcelTask.class).error(e.getMessage());
				}
			}
		}
		return fList;
	}
	
	// 判断每个文件的记录数是否相等
	private int checkRecNum(List<List<Object[]>> fList)
	{
		int i = 0;
		for(; i < fList.size(); i++)
		{
			if(0 != (fList.get(i+1).size() - (fList.get(i).size())))
			{
				return RESULT_FAIL;
			}
		}
		
		return RESULT_SUCCESS;
	}

	// 计算电流、电压平局值，并写回list
	private List<Object[]> calAver2List(List<List<Object[]>> lists)
	{
		BigDecimal currTotal = new BigDecimal(Double.toString(CURRENT_TOTAL));
		BigDecimal volTolal = new BigDecimal(Double.toString(VOLTAGE_TOTAL));
		BigDecimal recTotal = new BigDecimal(Double.toString(RECORD_TOTAL));
		
		// 根据接口定义要求，计算结果保留小数点后两位
		double currResult = currTotal.divide(recTotal, 2, BigDecimal.ROUND_HALF_UP).doubleValue();
		double volResult = volTolal.divide(recTotal, 2, BigDecimal.ROUND_HALF_UP).doubleValue();
		
		// 循环每个list元素，得到List<Object[]>
		List<Object[]> listObj = lists.get(0);
			
		// 将计算得到的电流、电压平均值写回List<Object[]>
		int j = 0;
		for(; j < listObj.size(); j++)
		{
			(listObj.get(j))[6] = currResult;
			(listObj.get(j))[7] = volResult;
		}
		
		return listObj;
	}

	// 计算从每个exel文件中得到的current、voltage总数、记录数
	private void calTotalPerFile(List<Object[]> listobj)
	{
		// 从取到的excel表数据计算Current平均值
		int i = 0;
		for(; i < listobj.size(); i++)
		{
			Object[] obj = listobj.get(i);
			CURRENT_TOTAL += (double)obj[6];
			VOLTAGE_TOTAL += (double)obj[7];
			RECORD_TOTAL++;
		}
	}

	private File[] getFileListOfDir()
	{
		String filePath = getFilePath();
		
		return new File(filePath).listFiles();
	}
}
