package com.audit.modules.common.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class DateUtil {

	private static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd");
	
	private static SimpleDateFormat SDFS = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	private static SimpleDateFormat SDF_MONTH = new SimpleDateFormat("yyyy-MM");

	private static SimpleDateFormat DF_ZW = new SimpleDateFormat("yyyy年MM月dd日");
	private static SimpleDateFormat DF_ZW_SIMPLE = new SimpleDateFormat("yyyy年MM月dd日");
	private static SimpleDateFormat ZW_SIMPLE_NOYEAR = new SimpleDateFormat("MM月dd日");

	/** 将页面传递的日期数据转换为日期对象 */
	public static Date parseFromPage(String data) throws ParseException {
			return SDF.parse(data);
	}

	public static String toPageData(Date date) {
		return SDF.format(date);
	}

	public static String toPageDataByChina(Date date) {
		return DF_ZW.format(date);
	}

	public static String toPageDataByChinaSimple(Date date) {
		return DF_ZW_SIMPLE.format(date);
	}
	public static String toPageDataByChinaSimpleNoYear(Date date) {
		return ZW_SIMPLE_NOYEAR.format(date);
	}

	public static String toPageDataMonth(Date date) {
		return SDF_MONTH.format(date);
	}
	
	public static String toPageDataSec(Date date) {
		return SDFS.format(date);
	}

	/** 获取指定周的日期数据 */
	public static List<Calendar[]> getWeekList(Calendar statDate, int amount) {
		Calendar weekOne = getMondayOfThisWeek(statDate);
		List<Calendar[]> list = new LinkedList<>();
		list.add(buildWeekC(weekOne));// 生成第一周
		for (int i = 1; i <= amount; i++) {
			weekOne.add(Calendar.DAY_OF_YEAR, -7);

			list.add(buildWeekC(weekOne));
		}
		return list;
	}

	private static Calendar[] buildWeekC(Calendar weekOne) {
		Calendar[] eweek = new Calendar[7];
		{// 生成7个日期
			Calendar calOne = Calendar.getInstance();
			calOne.setTime(weekOne.getTime());
			eweek[0] = calOne;
			for (int i = 1; i < 7; i++) {
				Calendar cal = Calendar.getInstance();
				cal.setTime(weekOne.getTime());
				cal.add(Calendar.DAY_OF_YEAR, i);
				eweek[i] = cal;
			}

		}
		return eweek;
	}

	/**
	 * 
	 * @return
	 */
	public static Calendar getMondayOfThisWeek(Calendar c) {
		int day_of_week = c.get(Calendar.DAY_OF_WEEK) - 1;
		if (day_of_week == 0)
			day_of_week = 7;
		c.add(Calendar.DATE, -day_of_week + 1);
		return c;
	}

	/**
	 * 根据日期字符串获取星期几
	 * 
	 * @param dateStr
	 * @return
	 */
	public static String getWeekOfDate(Calendar cal) {
		String[] weekDays = { "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" };
		int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
		if (w < 0)
			w = 0;

		return weekDays[w];
	}

	public static String getIndexWeekofMonth(Calendar calendar) {
		String[] weekDays = { "第一周", "第二周", "第三周", "第四周", "第五周", "第六周" };
		// 第几周
		int week = calendar.get(Calendar.WEEK_OF_MONTH);
		// 第几天，从周日开始
		int month = calendar.get(Calendar.MONTH) + 1;
		// int day = calendar.get(Calendar.DAY_OF_WEEK);
		return month + "月 " + weekDays[week - 1];
	}

	public static int getIndexWeekofDate(String dateStr) {
		Calendar cal = DateUtil.parseCalendar(dateStr);
		// 第一个(周日改为从周一算起-减1)，第二个(要用到数组索引-减1)
		int index = (cal.get(Calendar.DAY_OF_WEEK) - 1) - 1;
		if (index < 0)
			index = 6;
		return index;
	}

	/**
	 * 字符串转换成Calendar
	 */
	public static Calendar parseCalendar(String s) {
		Calendar c = null;

		Date d = null;
		try {
			d = parseFromPage(s);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		if (d != null) {
			c = Calendar.getInstance();
			c.setTime(d);
		}
		return c;
	}


}
