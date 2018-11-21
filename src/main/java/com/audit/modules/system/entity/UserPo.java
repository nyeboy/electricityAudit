package com.audit.modules.system.entity;

/**   
 * @Description : TODO(用户 页面展示)    
 *
 * @author : 陈涛
 * @date : 2017年3月28日   
 *
 * Copyright (c) 2017, IsoftStone All Right reserved.
*/

public class UserPo {
	
		//省(页面展示)
		private String provinceStr;
		//市(页面展示)
		private String cityStr;
		//县(页面展示)
		private String countyStr;
		//登录时间(格式化)
		private String loginDateStr;
		// 状态
		private String userStatusStr;
		
		public String getLoginDateStr() {
			return loginDateStr;
		}

		public void setLoginDateStr(String loginDateStr) {
			this.loginDateStr = loginDateStr;
		}
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

		public String getUserStatusStr() {
			return userStatusStr;
		}

		public void setUserStatusStr(String userStatusStr) {
			this.userStatusStr = userStatusStr;
		}

		
}
