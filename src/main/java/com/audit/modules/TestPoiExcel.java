package com.audit.modules;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;

public class TestPoiExcel {
	static Log log = LogFactory.getLog(TestPoiExcel.class);
	public static String execelFile = "D://JHXM_FILE/2017/10/3bbac9ef64004aa19ca3097a7ce48385.xlsx";

	public static void main(String argv[]) {
		try {

			// 构造 Workbook 对象，execelFile 是传入文件路径(获得Excel工作区)

			Workbook book = null;

			try {

				// Excel 2007获取方法

				book = new XSSFWorkbook(new FileInputStream(execelFile));

			} catch (Exception ex) {

				// Excel 2003获取方法

				book = new HSSFWorkbook(new FileInputStream(execelFile));

			}

			// 读取表格的第一个sheet页

			Sheet sheet = book.getSheetAt(0);

			// 定义 row、cell

			Row row;

			String cell;

			// 总共有多少行,从0开始

			int totalRows = sheet.getLastRowNum();

			// 循环输出表格中的内容,首先循环取出行,再根据行循环取出列

			for (int i = 1; i <= totalRows; i++) {

				row = sheet.getRow(i);

				// 处理空行

				if (row == null) {

					continue;

				}

				// 总共有多少列,从0开始

				int totalCells = row.getLastCellNum();

				for (int j = row.getFirstCellNum(); j < totalCells; j++) {

					// 处理空列

					if (row.getCell(j) == null) {

						continue;

					}

					// 通过 row.getCell(j).toString() 获取单元格内容

					cell = row.getCell(j).toString();

					System.out.print(cell + "\t");

				}

				System.out.println("");

			}

		} catch (FileNotFoundException e) {

			e.printStackTrace();

		} catch (IOException e) {

			e.printStackTrace();

		}

	}
}
