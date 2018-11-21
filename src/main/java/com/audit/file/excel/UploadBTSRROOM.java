package com.audit.file.excel;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.audit.file.excel.service.SmartMeterService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.ImportExcelUtil;
import com.audit.modules.common.utils.LogUtil;
import com.google.common.collect.Lists;

public class UploadBTSRROOM
{
	@Autowired
	static SmartMeterService smSer;
	
	public static ResultVO uploadBR(String dirName)
	{
		List<List<Object[]>> fList = getFileList(dirName);
		if(null == fList)
		{
			return ResultVO.failed("该文件夹下没有文件可导入 ： ",dirName);
		}
		
		List<Object[]> listMerged = mergeList(fList);
		fList = null;
		try
		{
			smSer.saveExcel2DB(listMerged);
		} 
		catch (Exception e)
		{
			e.printStackTrace();
			LogUtil.getLogger(UploadExcelTask.class).error(e.getMessage());
			
			return ResultVO.failed("导入Excel文件到数据库出错！",e.getMessage());
		}
		
        return ResultVO.success();
	}
	
	// 将获取到的文件List进行合并，把所有List都追加到第一个List中
	private static List<Object[]> mergeList(List<List<Object[]>> fList)
	{
		List<Object[]> listTmp = Lists.newArrayList();
		
		int i = 0;
		for(; i < fList.size(); i++)
		{
			listTmp.addAll(fList.get(i));
		}
		return listTmp;
	}

	private static List<List<Object[]>> getFileList(String dirName)
	{
		File[] files =  new File(dirName).listFiles();
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
}
