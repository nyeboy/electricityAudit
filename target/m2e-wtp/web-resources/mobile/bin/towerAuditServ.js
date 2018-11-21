
/**
 * 塔维稽核流程管理
 */
app.service('towerAuditServ', [ '$http', function($http) {
	var base_url = CONFIG.BASE_URL;
	
	return {
		// 塔维稽核流程查询
		getTowerAuditList : function(params) {
			return $http({
                method: "POST",
                url: base_url+'/towerWorkflow/queryFlow.do',
                data: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
		},
        // 单个通过、驳回
		submitAudit : function(auditDetail) {
			return $http({
                method: "POST",
                url: base_url+'/towerWorkflow/approve.do',
                data: auditDetail,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });	
		},
        // 批量提交、审批、驳回
		submitAuditForJson : function(auditDetail) {
			return $http({
                method: "POST",
                url: base_url+'/towerWorkflow/batchApprove.do',
                data: auditDetail,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
		},
        // 删除流程
		deleteAudit : function(params) {
			return $http({
                method: "POST",
                url: base_url+'/towerWorkflow/deleteTask.do',
                data: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
		},
        // 批量删除
		bachDeleteTask : function(params) {
			return $http({
                method: "POST",
                url: base_url+'/towerWorkflow/bachDeleteTask.do',
                data: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
		},
        // 查询生成电费需要生成的单列表
		queryGenerated : function(params) {
			return $http({
                method: "POST",
                url: base_url+'/towerWorkflow/queryGenerated.do',
                data: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
		},
		getInvoiceTypeList : function() {
			return $http({
                method: "POST",
                url: base_url+'/invoice/queryAll.do',
                data: {},
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
		},
        // 生成电费提交单
		saveGeneratedData : function(info){
			return $http({
                method: "POST",
                url: base_url+'/towerReimburse/save.do',
                data: JSON.stringify(info),
                headers: { 'Content-Type': 'application/json' }
            });
		},
		getGeneratedInfo : function(params) {
			return $http({
                method: "POST",
                url: base_url+'/towerReimburse/selectByPrimaryKey.do',
                data: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
		},
		querySubmitFinancialList : function(params) {
			return $http({
                method: "POST",
                url: base_url+'/towerWorkflow/querySendInfo.do',
                data: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
		},
        /**
         * 流程更新
         * @return {[type]} [description]
         */
        updateTask: function(params){
            return $http({
                method: "POST",
                url: base_url+'/towerWorkflow/updateTask.do',
                data: JSON.stringify(params),
                headers: { 'Content-Type': 'application/json'}
            });
        },

        /**
         * 流转信息[审批历史]
         * @param  {[type]} instanceId [description]
         * @return {[type]}            [description]
         */
        queryApprovalDetails: function(instanceId){
            return $http({
                method: "POST",
                url: base_url+'/towerWorkflow/queryApprovalDetails.do?instanceId='+instanceId,
            });
        },
		// 推送财务
		pushManager : function(info) {
			return $http({
                method: "POST",
                url: base_url+'/towerReimburse/updateList.do',
                data: info,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

		},
        updateGeneratedInfo : function(info) {
            return $http({
                method: "POST",
                url: base_url+'/towerReimburse/update.do',
                data: JSON.stringify(info),
                headers: { 'Content-Type': 'application/json' }
            });
        },



    /*********************************************电费稽核流程--新增稽核单**************************************************/

        /**
         * 电费稽核流程-新增稽核单--稽核单流水号、城市、地名
         * 
         * @returns {HttpPromise}
        */
        getTowerElectrictyInfo:function(){
            return $http.get(base_url+'/towerElectricty/toAdd.do');
        },


        /**
         * 获取成中心 数据源
         * @returns {HttpPromise}
         */
        getTowerCostCeterVOsInfo:function(){
            return $http.get(base_url+'/costcenter/findByUser.do');
        },


        /**
         * 根据铁塔站址编号查询资管站点名称、铁塔站址名称、是否包干
         * @returns {HttpPromise}
         */
        getTowerSiteInfo:function(params){
            return  $http.post(base_url+'/towerSite/queryTowerSite.do',{
                params:params
            });
        },


        /**
         * 查询供应商
         * @param params
        */
        querySupplier:function(params){
           
            return  $http.get(base_url+'/supplier/queryLikeByName.do',{
                params:params
            });
        },
        
        
        /**
         * 保存新增稽核单
         * @param params
        */
        saveTowerAuditPage:function(electrictySaveVO){

            return $http({
                method: "POST",
                url: base_url+'/towerElectricty/saveElectricty.do',
                data:{str: JSON.stringify(electrictySaveVO)},
                //headers: { 'Content-Type': 'application/json' }
                // headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },


        /*********************************************电费稽核流程--电费录入**************************************************/

        /**
         * 电费稽核流程-电费录入--列表查询
         * @param params
         * @returns {HttpPromise}
        */
        queryTaiffSubmitPage:function(params){
            return $http.post(base_url+'/towerElectricty/queryList.do',{
                params:params
            });
        },


        /**
         * 电费稽核流程-电费录入--查看单条
         * @id
         * @returns {HttpPromise}
        */
        querySingleTaiffSubmit:function(id){
            return $http.post(base_url+'/towerElectricty/findOneByID.do?id='+id);
        },


        /**
         * 电费稽核流程-电费录入--修改单条数据
         * @params
         * @returns {HttpPromise}
        */
        editedSingleTaiffSubmit:function(electrictySaveVO){
            return $http({
                method: "POST",
                url: base_url+'/towerElectricty/updateElectricty.do',
                data:{str: JSON.stringify(electrictySaveVO)},
                //headers: { 'Content-Type': 'application/json' }
                // headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },


        /**
         * 电费稽核流程-电费录入--批量、单条删除数据
         * @id
         * @returns {HttpPromise}
        */
        modifyTaiffSubmit:function(id){
            return $http.post(base_url+'/towerElectricty/deleteByIDs.do',{
                ids:id
            });
        },


        /**
         * 电费稽核流程-电费录入--批量、单条提交数据
         * @id
         * @returns {HttpPromise}
        */
        batchTaiffSubmit:function(id){
            return $http.post(base_url+'/towerElectricty/batchSubmit.do',{
                ids:id
            });
        },


        /**
         * 电费稽核流程-电费录入--新增塔维稽核单跳转页面
         * @returns {HttpPromise}
         */
        getInputElectrictyAddInfo:function(){
            return $http.get(base_url+'/towerElectricty/toAdd.do');
        },


        /**
         * 查询流转图
         */
        queryFlowChart : function(id) {
        	return $http.post(base_url+'/towerWorkflow/queryFlowChart.do', {
            	instanceId:id
            });
        },


        /**
         *超标杆提交接口
         * @returns {HttpPromise}
        */
       checkMarkDetails: function(eIds){
            return  $http.post(base_url+'/inputElectricty/check.do?',{
                eIds:eIds
            });
       },

       /**
         *稽核查看超标杆接口
         * @returns {HttpPromise}
        */
        queryMarkDetails: function(eId){
            return  $http.post(base_url+'/benchmark/queryOverBenchmark.do?',{
                eId:eId
            });
        },


	}
}])