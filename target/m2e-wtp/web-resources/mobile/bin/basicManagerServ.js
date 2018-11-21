/*
* @Author: tmliua
* @Date:   2017-05-08 09:51:35
* @Last Modified by:   tmliua
* @Last Modified time: 2017-02-07 10:19:58
*/


app.service('basicManagerServ', [ '$http', function($http) {

    var base_url = CONFIG.BASE_URL;

    return {

    	/*********************************************基础数据公共模块**************************************************/
    
    	/**
         * 查询市
         * @returns {HttpPromise}
         */
        queryCityList:function (){
            return $http.get(base_url+'/systemData/queryCityList.do');
        },

        /**
         * 查询区
         * @returns {HttpPromise}
         */
        queryCountyList:function (cityId){

            return $http.get(base_url+'/systemData/queryCountyList.do?cityId='+cityId);

        },

        /**
         * 获取当前用户信息
         * @returns {HttpPromise}
         */
        getCurrentUser:function () {
            return $http.get(base_url+'/loginController/getCurrentUser.do');
        },


        /**
         * 获取当前用户菜单
         * @returns {HttpPromise}
         */
        getUserMenu:function (account,functionType) {
            console.log("account>>>>>>>>>>>",account);
            return $http.post(base_url+'/index/getIndex.do',{        // 2017.5.4修改请求方式为post
                account:account,
                functionType:functionType,
            });
        },



        /**
         * 退出登录
         */
        logout:function () {

            return $http.get(base_url+'/loginOut.do');
        },



    	/*********************************************基础数据模块**************************************************/
    	

    	/**
    	 * 基础数据呈现
    	 * @param params
         * @returns {HttpPromise}
    	*/
    	getBaseDataByPage:function(params){
            return $http.get(base_url+'/towerBaseData/showBaseDateByPage.do',{
                params:params
            });
        },


        /**
         * 基础数据呈现查看详情
         * @towerId
         * @returns {HttpPromise}
         */
        getBaseDataByDetails: function(towerId){
            return $http.get(base_url+'/towerBaseData/showBaseDateDetail.do?towerId='+towerId);
        },



        /*********************************************基础数据标杆管理**************************************************/

        /**
         *基础数据-额定功率管理
         * @param params
         * @returns {HttpPromise}
         */
        findPowerRateByPage:function(params){
            return $http.get(base_url+'/towerPowerRated/powerRateManageByPage.do',{
                params:params
            });

        },


        /**
         * 基础数据--额定功率--查看详情
         * @towerId
         * @returns {HttpPromise}
         */
        queryPowerRatingDetail: function(towerId){
            return $http.get(base_url+'/towerPowerRated/powerRateManageDetail.do?towerId='+towerId);
        },



        /*********************************************基础数据维护--合同信息管理**************************************************/

        /**
         * 基础数据维护-合同信息管理--列表查询
         * @param params
         * @returns {HttpPromise}
         */
        queryContractPage:function(params){
            return $http.get(base_url+'/towerContract/queryListPage.do',{
                params:params
            });
        },



        /**
         * 基础数据维护--合同信息管理--查询单行数据
         * @id
         * @returns {HttpPromise}
         */
        querySingleContractPage: function(id){
            return $http.get(base_url+'/towerContract/selectById.do?id='+id);
        },


        /**
         * 基础数据维护--合同信息管理--修改合同
         * @id
         * @returns {HttpPromise}
         */
        
        editedContractPage: function(params){
           
            return $http.get(base_url+'/towerContract/update.do',{
                params: params
            });
        },


        /**
         * 基础数据维护--合同信息管理--删除合同
         * @ids
         * @returns {HttpPromise}
         */
        modifyContractPage: function(ids){
            return $http.get(base_url+'/towerContract/delete.do?Ids='+ids);
        },




        /*********************************************基础数据维护--供电信息管理**************************************************/

        /**
         * 基础数据维护-供电信息管理--列表查询接口
         * @param params
         * @returns {HttpPromise}
         */
        queryPowerPage:function(params){
            return $http.get(base_url+'/towerPSU/queryListPage.do',{
                params:params
            });
        },


        /**
         * 基础数据维护-供电信息管理--单条查询接口
         * @param params
         * @returns {HttpPromise}
         */
        querySinglePowerPage:function(id){

            return $http.get(base_url+'/towerPSU/queryById.do?Id='+id);
        },
        
        /**
         * 基础数据维护-供电信息管理--修改供电信息
         * @params
         * @returns {HttpPromise}
        */
        editedPower:function(params){
            
            return $http.get(base_url+'/towerPSU/update.do',{
                params: params
            });
        },
        

        /**
         * 基础数据维护-供电信息管理--删除供电信息
         * @id
         * @returns {HttpPromise}
        */
        deletedPowerPage: function(ids){
            return $http.get(base_url+'/towerPSU/delete.do?Ids='+ids);
        },



        /*********************************************基础数据维护--发票信息管理**************************************************/

        /**
         * 基础数据维护-发票信息管理--列表查询 
         * @param params
         * @returns {HttpPromise}
         */
        queryInvoicePage:function(params){
            return $http.get(base_url+'/towerInvoice/queryListPage.do',{
                params:params
            });
        },


        /**
         * 基础数据维护--发票信息管理--查询单行数据 
         * @id
         * @returns {HttpPromise}
         */
        querySingleInvoicePage: function(id){
            return $http.get(base_url+'/towerInvoice/selectById.do?id='+id);
        },


        /**
         * 基础数据维护--发票信息管理--修改发票 
         * @params params
         * @returns {HttpPromise}
         */
        editedInvoicePage: function(params){
            return $http.post(base_url+'/towerInvoice/saveOrUpdate.do',{
                params:params
            });
        },


        /**
         * 基础数据维护--发票信息管理--删除发票 
         * @Ids
         * @returns {HttpPromise}
         */
        modifyInvoicePage: function(ids){
            return $http.get(base_url+'/towerInvoice/delete.do?Ids='+ids);
        },



        /*********************************************基础数据维护--额定功率管理**************************************************/

        /**
         * 基础数据维护-额定功率管理--列表查询接口
         * @param params
         * @returns {HttpPromise}
         */
        queryRMSPage:function(params){
            return $http.get(base_url+'/towerpowerRate/queryListPage.do',{
                params:params
            });
        },


        /**
         * 基础数据维护-额定功率管理--单条查询接口
         * @param params
         * @returns {HttpPromise}
         */
        querySingleRMSPage:function(id){

            return $http.get(base_url+'/towerpowerRate/selectById.do?id='+id);
        },
        
        /**
         * 基础数据维护-额定功率管理--修改额定功率
         * @params
         * @returns {HttpPromise}
        */
        editedRMS:function(params){
            
            return $http.get(base_url+'/towerpowerRate/update.do',{
                params: params
            });
        },
        

        /**
         * 基础数据维护-额定功率管理--删除额定功率
         * @id
         * @returns {HttpPromise}
        */
        deletedRMSPage: function(ids){
            return $http.get(base_url+'/towerpowerRate/delete.do?Ids='+ids);
        },



          /*********************************************基础数据维护--其他信息管理**************************************************/

        /**
         * 基础数据维护-其他信息管理--列表查询接口
         * @param params
         * @returns {HttpPromise}
         */
        queryAdditionalInfoPage:function(params){
            return $http.get(base_url+'/towerother/queryListPage.do',{
                params:params
            });
        },


        /**
         * 基础数据维护-其他信息管理--单条查询接口
         * @param params
         * @returns {HttpPromise}
         */
        querySingleAdditionalInfoPage:function(id){

            return $http.get(base_url+'/towerother/selectById.do?Id='+id);
        },
        
        /**
         * 基础数据维护-其他信息管理--修改其他信息
         * @params
         * @returns {HttpPromise}
        */
        editedAdditionalInfo:function(params){
            
            return $http.get(base_url+'/towerother/update.do',{
                params: params
            });
        },
        

        /**
         * 基础数据维护-其他信息管理--删除其他信息
         * @id
         * @returns {HttpPromise}
        */
        deletedAdditionalInfoPage: function(ids){
            return $http.get(base_url+'/towerother/delete.do?Ids='+ids);
        },
        
        
        /**
         * 塔维 数据导入
         * @returns {string}
         */
        towerSiteImport:function(){
            return base_url+'/towerSite/excelImport.do';
        },
        
        
        /**
         *塔维 下载模板
         * @returns {string}
         */
        downLoadURI:function(){
        	 
        	 return base_url+'/downloadModel/downLoadExcelDemo.do';
        	
        },
        
        
        /**
         * 塔维 额定功率  数据导入
         * @returns {string}
         */
        powerRateImport:function(){
            return base_url+'/upload/powerRatingUpload.do';
        },

    }
}]);

