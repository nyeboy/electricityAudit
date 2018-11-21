package com.audit.modules.payment.entity;

/**   
 * @Description : TODO(预付提交-用于页面展示数据)    
 *
 * @author : 
 * @date : 2017年4月10日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class AdvancePaymentPo {
	
		//省
		private String provinceStr;
		//市
		private String cityStr;
		//区/县
		private String countyStr;
		//预付开始时间
		private String startDateStr;
		//预付结束时间
		private String endDateStr;
		//预付供应商
		private String supplyStr;
		//合同
		private String contractStr;
		//建单时间
		private String createDateStr;
		//状态
		private String statusStr;
		
		
		
		public String getProvinceStr() {
			return provinceStr;
		}
		public void setProvinceStr(String provinceStr) {
			this.provinceStr = provinceStr;
		}
		public String getCityStr() {
			return cityStr;
		}
		public void setCityStr(String cityStr) {
			this.cityStr = cityStr;
		}
		public String getCountyStr() {
			return countyStr;
		}
		public void setCountyStr(String countyStr) {
			this.countyStr = countyStr;
		}
		public String getStartDateStr() {
			return startDateStr;
		}
		public void setStartDateStr(String startDateStr) {
			this.startDateStr = startDateStr;
		}
		public String getEndDateStr() {
			return endDateStr;
		}
		public void setEndDateStr(String endDateStr) {
			this.endDateStr = endDateStr;
		}
		public String getSupplyStr() {
			return supplyStr;
		}
		public void setSupplyStr(String supplyStr) {
			this.supplyStr = supplyStr;
		}
		public String getContractStr() {
			return contractStr;
		}
		public void setContractStr(String contractStr) {
			this.contractStr = contractStr;
		}
		
		public String getCreateDateStr() {
			return createDateStr;
		}
		public void setCreateDateStr(String createDateStr) {
			this.createDateStr = createDateStr;
		}
		public String getStatusStr() {
			return statusStr;
		}
		public void setStatusStr(String statusStr) {
			this.statusStr = statusStr;
		}
		
		
		
		
}
