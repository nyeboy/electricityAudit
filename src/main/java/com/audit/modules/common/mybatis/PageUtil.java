package com.audit.modules.common.mybatis;

import java.util.List;

public class PageUtil<T> {

	public static final int DEFAULT_PAGE_SIZE = 20;

	protected int pageNo = 1; // 当前页, 默认为第1页
	protected int pageSize = DEFAULT_PAGE_SIZE; // 每页记录数
	protected long totalRecord = -1; // 总记录数, 默认为-1, 表示需要查询
	protected int totalPage = -1; // 总页数, 默认为-1, 表示需要计算
	
	protected String resultsSum; // 当前页税金金额记录String形式
	protected List<T> results; // 当前页记录List形式
	// 查询参数
	private Object obj;
	private List<String> departmentNameSum;//登录人所在部门(一个登录人可能有多个部门)
			
	public List<String> getDepartmentNameSum() {
		return departmentNameSum;
	}

	public void setDepartmentNameSum(List<String> departmentNameSum) {
		this.departmentNameSum = departmentNameSum;
	}

	public String getResultsSum() {
		return resultsSum;
	}

	public void setResultsSum(String resultsSum) {
		this.resultsSum = resultsSum;
	}

	public int getPageNo() {
		return pageNo;
	}

	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
		computeTotalPage();
	}

	public long getTotalRecord() {
		return totalRecord;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalRecord(long totalRecord) {
		this.totalRecord = totalRecord;
		computeTotalPage();
	}

	protected void computeTotalPage() {
		if (getPageSize() > 0 && getTotalRecord() > -1) {
			this.totalPage = (int) (getTotalRecord() % getPageSize() == 0 ? getTotalRecord() / getPageSize() : getTotalRecord() / getPageSize() + 1);
		}
	}

	public List<T> getResults() {
		return results;
	}

	public void setResults(List<T> results) {
		this.results = results;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder().append("Page [pageNo=").append(pageNo).append(", pageSize=").append(pageSize)
				.append(", totalRecord=").append(totalRecord < 0 ? "null" : totalRecord).append(", totalPage=")
				.append(totalPage < 0 ? "null" : totalPage).append(", curPageObjects=").append(results == null ? "null" : results.size()).append("]");
		return builder.toString();
	}

	public Object getObj() {
		return obj;
	}

	public void setObj(Object obj) {
		this.obj = obj;
	}

}
