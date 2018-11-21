/*
* @Author: admin
* @Date:   2017-02-07 09:51:35
* @Last Modified by:   admin
* @Last Modified time: 2017-02-07 10:19:58
*/


app.service('commonServ', [ '$http', function($http) {

    var base_url = CONFIG.BASE_URL;

    return {

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
         * 查询部门
         * @returns {HttpPromise}
         */
        queryDepartment:function (dptId){
            if(dptId){
                 return $http.get(base_url+'/dpt/getDpts.do?dptId='+dptId);
            }else{
                return $http.get(base_url+'/dpt/getDpts.do');
            }

        },

        //查询所有角色
        findAllRole:function(){
            return $http.get(base_url+'/role/getRoleList.do');

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
            
            return $http.post(base_url+'/index/getIndex.do',{        // 2017.5.4修改请求方式为post
                account:account,
                functionType:functionType,
            });
        },



        /**
         * 退出登录
         */
        logout:function () {
            var date=new Date();
            var timer=date.getTime().toString();
            return $http.get(base_url+'/loginController/loginOut.do?t='+timer);
            // return $http.get(base_url+'/loginController/loginOut.do');
        },

		/**
         * 查询账号
         */
        goLogin:function () {
			return $http.get(base_url+'/loginController/accountSelect.do');
			
		},
		
		/**
         * 查询角色
         */
        getroleSelect:function () {
			return $http.get(base_url+'/loginController/roleSelect.do');
			
		},

		/**
         * 获取用户列表
         */
        getAccountData:function (params) {			
			return $http.get(base_url+'/loginController/userSelect.do',{
                params:params
            });
		},


        /**
         * 操作日志列表
         * @param params
         * @returns {HttpPromise}
         */
        getlogList:function (params) {
            return $http.get(base_url+'/log/getPageLog.do',{
                params:params
            })
        },
        
        /**
         * 查询塔维首页待办的统计信息
         */
        queryTowerPendingApproval:function () {
            return $http.get(base_url+'/towerWorkflow/queryPendingApproval.do')
        },
        
        /**
         * 查询塔维首页待办的统计信息
         */
        queryTowerElectricityApproval:function () {
            return $http.get(base_url+'/towerWorkflow/queryElectricityApproval.do')
        },
        /**
         * 统计自维首页待办信息
         */
        queryPendingApproval : function() {
        	return $http.get(base_url+'/workflow/queryOperatorNum.do')
        },
        queryElectricityApproval : function() {
        	return $http.get(base_url+'/workflow/queryElectricityApproval.do')
        },

        //--------------------------------------------------------------------系统角色----------------------------------------------------------------------


        /**
         * 获取资源列表
         * @param params
         * @returns {HttpPromise}
         */
        getResourceList:function(params){

            return $http.get(base_url+'/resource/getResourceList.do',{
                params:params
            })

        },


        /**
         * 获取角色列表
         * @returns {HttpPromise}
         */
        getRoleList:function(){

            return $http.get(base_url+'/role/getRoleList.do')
        },

        /**
         * 获取角色列表分页
         * @returns {HttpPromise}
         */
        getRoleListByPager:function(params){
            return $http.get(base_url+'/role/queryPageRoleList.do',{
                params:params
            })
        },

        /**
         * 根据角色名获取角色信息
         * @param roleName
         * @returns {HttpPromise}
         */
        getRoleInfoByName:function(roleName){

            return $http.get(base_url+'/role/queryPageRoleList.do?roleName='+roleName);
        },


        /**
         * 删除角色
         * @param ids
         * @returns {HttpPromise}
         */
        deleteRoles:function(ids){
            return $http.post(base_url+'/role/deleteRoleByIds.do',{
                roleIds:ids
            });
        },


        /**
         * 添加或修改角色信息
         */
        saveOrUpdateRole:function(role){

            if(role.roleId==undefined){
                return $http.post(base_url+'/role/createRole.do',role);
            }else{
                return  $http.post(base_url+'/role/updateRole.do',role);
            }

        },










        /**
         * 4.1	查询用户列表
         * @param params
         * @returns {HttpPromise}
         */
        queryUserByPage:function(params){

            return $http.post(base_url+'/user/queryUserByPage.do',params);
        },

        /**
         * 通过ＩＤ　查找用户
         * @param id
         * @returns {HttpPromise}
         */
        queryUserByUserId:function(id){
            return $http.get(base_url+'/user/queryUserByUserId.do?userId='+id);
        },

        /**
         * 查询OA系统的用户信息
         */
         queryOA:function(account){
            return $http.get(base_url+'/user/queryByAccountInOA.do?account='+account);
         },

        /**
         * 新增用户
         * @returns {HttpPromise}
         */
        addOrUpdateUser:function(user,word){
            console.log(user.id);
            console.log(user.userId);
            debugger;
            if((user.userId!=undefined && user.userId != "") && (!word || word!='add')){
                return $http.post(base_url+'/user/updateUser.do',user);
            }else{
                return $http.post(base_url+'/user/createUser.do',user);
            }



            //
            //return $http({
            //    method: "POST",
            //    url: base_url+'/user/queryUserByPage.do',
            //    data: JSON.stringify(user) ,
            //    headers: { 'Content-Type': 'application/json' }
            //});


        },
        /**
         * 删除
         * @param idsArr
         */
        deleteUsers:function(userIds){
            return $http.post(base_url+'/user/deleteById.do',{
                userIds:userIds
            });

        },

        //---------------------------------------------------------------------------------系统公告 功能模块----------------------------------------------------------------------------


        /**
         * 添加或更新系统公告
         * @param Notice
         * @returns {HttpPromise}
         */
        addOrUpdateNotice:function(Notice){


            if(Notice.noticId==undefined) {
                return $http.post(base_url + '/sysNotice/addNotic.do', Notice);
            }else{
                return $http.post(base_url + '/sysNotice/updateNotic.do', Notice);
            }

        },
        /**
         * 添加已读系统公告
         * @param Notice
         * @returns {HttpPromise}
         */
        addNoticeReaded:function(noticId){
            debugger;
            return $http.get(base_url + '/sysNotice/addNoticeReaded.do?noticId='+noticId);
        }, 

        /**
         * 查询未读系统公告
         * @param Notice
         * @returns {HttpPromise}
         */
        queryNoticeNotRead:function(){
            return $http.get(base_url + '/sysNotice/queryNoticeNotRead.do');
        },
        getProcess:function(id){
            return $http.get(base_url + '/electricitySubmit/getProcess.do?submitId='+id);
        },
        


        /**
         * 分页查询系统公告
         * @param params
         * @returns {HttpPromise}
         */
        queryNoticeByPage:function (params){
            return $http.post(base_url+'/sysNotice/queryNoticByPage.do',{
                params:params
            });
        },

        /**
         * 查询单条系统公告
          * @param id
         * @returns {HttpPromise}
         */
        queryNoticeById:function(id){
            return $http.get(base_url+'/sysNotice/queryNoticById.do?noticId='+id);
        },
        
        
        getMt : function(id){
			return $http({
                method: "POST",
                url: base_url+'/electricitySubmit/getMt.do?id='+id,
                headers: { 'Content-Type': 'application/json' }
            });
		},

        /**
         * 删除单条或多条系统公告
         * @param ids
         * @returns {HttpPromise}
         */
        deleteNotices:function(ids){
            return $http.post(base_url + '/sysNotice/deleteNoticById.do', {
                "noticIds":ids
            });

        },



        //---------------------------------------------------------------------------------基础数据 功能模块----------------------------------------------------------------------------

        /**
         * 基础数据呈现
         * @param params
         * @returns {HttpPromise}
         */
        getBaseDataByPage:function(params){
            return $http.get(base_url+'/siteInfo/querySite.do',{
                params:params
            });
        },
        /**
         * 基础数据呈现导出excel
         */
        getBaseDataByPageExcel:function(){
        	return base_url+'/siteInfo/querySiteExcel.do';
        },
        
        geteletop11:function(){
        	return $http.get(base_url+'/whiteMg/geteletop11.do');
        },
        
        geteletopMoney:function(){
        	return $http.get(base_url+'/whiteMg/geteleMoney.do');
        },
        
        
        
        /**
         * 查询白名单站点
         * @returns {HttpPromise}
         */
        findWhiteMgByPage:function(params){

            return $http.get(base_url+'/whiteMg/findUpload.do',{
                    params:params
            });

        },
        
        //每次进入addwhite页面删除white表
        delwhite:function(params){
            return $http.get(base_url+'/whiteMg/delwhite.do');

        },
        //删除wrong信息
        delWrong:function(){
        	 return $http.get(base_url+'/whiteMg/delWrong.do');
        },
        
        
        delCpMid:function(){
        	
        	 return $http.get(base_url+'/whiteMg/delCpMid.do');
        },
        //稽核页查找站点是否为白名单
        getWhite:function(asiteId){
        	return $http.get(base_url+'/whiteMg/getWhiteBySiteName.do?asiteId='+asiteId);
        },
        
        //白名单查站点详情
        getSiteInfo:function(id){
        	 return $http.get(base_url+'/whiteMg/getSiteInfo.do?id='+id);
        },
      //白名单查站点详情
        getSiteInfo1:function(id){
        	 return $http.get(base_url+'/whiteMg/getSiteInfo1.do?id='+id);
        },
        
        
        //获得白名单配置数据
        getWhiteSet:function(){
        	return $http.get(base_url+'/whiteMg/getWhiteSetCity.do?');
        },
        
        getSetBi:function(){
        	return $http.get(base_url+'/whiteMg/getSetBi.do?');
        },
        getZbi:function(cityId){
        	return $http.get(base_url+'/whiteMg/getZbi.do?cityId='+cityId);
        },
        //确认更改比例
        surechangebili:function(params){
            return $http.get(base_url+'/whiteMg/surechangebili.do',{
                    params:params
            });
        },
        
        getWhiteCountyNum1:function(cityName){
        	return $http.get(base_url+'/whiteMg/getWhiteCountyNum.do?cityName='+cityName);
        },
        
        //查找白名单流程
        getWhiteFlow:function(id){
        	 return $http.get(base_url+'/whiteMg/getWhiteFlow.do?id='+id);
        },
        //白名单数据管理页查fjs
        getSzydFj:function(szydNo){
        	 return $http.get(base_url+'/whiteMg/getSzydFj.do?szydNo='+szydNo);
        },
        //白名单数据管理页下载附件
        downFj:function(obj){
        	return base_url+'/whiteMg/downFj.do?filepath='+obj.filepath+"&filename="+obj.filename+"&ext="+obj.ext;
        },
        //删除白名单站点
        delWhiteMgByid:function(id){
        	return $http.get(base_url+'/whiteMg/delWhiteMgById.do?id='+id);
        },
        //修改页面删除白名单站点
        delWhiteMgByid1:function(id){
        	return $http.get(base_url+'/whiteMg/delWhiteMgById1.do?id='+id);
        },        
        //查找白名单
        findWhiteSubmitByPage:function(params){
            return $http.get(base_url+'/whiteMg/findWhiteSubmit.do',
            		{params:params});
        },
        
      //查找白名单数据管理
        findWhiteDataSubmitByPage:function(params){
            return $http.get(base_url+'/whiteMg/findWhiteDataSubmitByPage.do',{
                    params:params
            });
        },
        //白名单批量通过驳回
        bachUpStatus:function(auditDetail) {
            return $http({
                method: "POST",
                url: base_url+'/whiteMg/bachUpStatus.do',
                data: JSON.stringify(auditDetail),
                headers: { 'Content-Type': 'application/json'}
            });
        },
        
        //白名单查找当前市还剩余多少白名单站点数
        findwhitesitenum:function(){
        	 return $http.get(base_url+'/whiteMg/findwhitesitenum.do');
        },
        
        //白名单修改页面删除附件
        delfj:function(params){
        	 return $http.get(base_url+'/whiteMg/delfj.do',{params:params});
        },
        
        findfjagain:function(szydno){
        	return $http.get(base_url+'/whiteMg/findfjagain.do?szydno='+szydno);
        },
        
        getSubmitAll:function(){
        	 return $http.get(base_url+'/whiteMg/getSubmitAll.do');
        },
        
        deleteWhiteMg:function(){
        	return $http.get(base_url+'/whiteMg/deleteWhiteMg.do');
        },
        //保存入whiteSubmit/submitMg
        saveWhiteMgSubmit:function(params){
        	return $http.get(base_url+'/whiteMg/saveWhiteSubmit.do',{
                params:params
        });
        },
        //保存入whiteSubmit/submitMg
        saveWhiteMgSubmit1:function(params){
        	return $http.get(base_url+'/whiteMg/saveWhiteSubmit1.do',{
                params:params
        });
        },
        
        updateSubmitMgStatus:function(params){
        	return $http.get(base_url+'/whiteMg/updateSubmitMgStatus.do',{
                params:params
        });
        },
        
        
        findwrong:function(){
        	return $http.get(base_url+'/whiteMg/findwrong.do');
        },
        //查找whiteSubmit详情
        getWhiteSubmitInfo:function(id){
        	return $http.get(base_url+'/whiteMg/getWhiteSubmitInfo.do?id='+id);
        },
        //删除whiteSubmit
        delWhiteSubmit:function(id){
        	return $http.get(base_url+'/whiteMg/delWhiteSubmitMg.do?id='+id);
        },
        
        updateWhiteSubmit:function(params){
        	return $http.get(base_url+'/whiteMg/updateWhiteSubmit.do',{
                params:params
        });
        },
        
        updatemgsubmitstatus:function(params){
        	return $http.get(base_url+'/whiteMg/updatemgsubmitstatus.do',{
                params:params
            });
        },
        
        findSzyd:function(szydno){
        	return $http.get(base_url+'/whiteMg/findSzyd.do?szydno='+szydno);
        },

        /**
         * 基础数据呈现查看详情
         * @param params
         * @returns {HttpPromise}
         */
        getBaseDataByDetails: function(id){
            return $http.get(base_url+'/siteInfo/queryDetail.do?id='+id);

        },
        
        
        /**
         * 基础数据呈现查看详情(excel)
         * @param params
         * @returns {HttpPromise}
         */
        baseDataExcelCtrl: function(id){
            return $http.get(base_url+'/siteInfo/queryAllDetail.do');
        },



        /**
         * 基础数据-合同信息管理
         * @param params
         * @returns {HttpPromise}
         */
        queryContractPage:function(params){
            return $http.get(base_url+'/contract/queryListPage.do',{
                params:params
            });
        },
        //合同excel下载
        queryContractPageExcel:function(){
        	return base_url+'/contract/queryListPageExcel.do';
        },
        
        delfile:function(id){
        	return $http.get(base_url+'/inputElectricty/delupfile.do?id='+id);
        },
        /**
         * 基础数据-合同信息管理--查看详情
         * @param params
         * @returns {HttpPromise}
         */
        showContractInfo:function(id){
            return $http.get(base_url+'/contract/selectById.do?id='+id);
        },
        /**
         * 基础数据-合同信息管理--修改保存
         * @param params
         * @returns {HttpPromise}
         */
        updateContractInfo:function(params){
            return $http.post(base_url+'/contract/saveOrUpdateContract.do',{
                params:params
            });
        },



        /**
         * 基础数据-供应商管理
         * @param params
         * @returns {HttpPromise}
         */
        findSupplyByPage:function(params){
            return $http.get(base_url+'/supplierManage/findSupplyByPage.do',{
                params:params
            });
        },
        
        /**
         * 基础数据-供应商管理导出excel
         * @param params
         * @returns {HttpPromise}
         */
        findSupplyByPageExcel:function(params){
            return base_url+'/supplierManage/findSupplyByPageExcel.do';
        },
        
        /**
         * 基础数据-供应商管理根据id
         * @param params
         * @returns {HttpPromise}
         */
        findSupplyById:function(id){
            return $http.get(base_url+'/supplierManage/findSupplyById.do?id='+id)
        },




        /**
         *基础数据-电表管理
         * @param params
         * @returns {HttpPromise}
         */
        queryWatthourMeterPage:function(params){
            return $http.post(base_url+'/watthourMeter/queryListPage.do',{
                params:params
            });

        },
        /**
         *基础数据-电表管理导出Excel
         * @param params
         * @returns {HttpPromise}
         */
        queryWatthourMeterPageExcel:function(){
            return base_url+'/watthourMeter/queryListPageExcel.do';
        },

        /**
         *基础数据-电表管理-查询单条
         * @param params
         * @returns {HttpPromise}
         */

        queryWatthourMeterById:function(id){
            return $http.get(base_url+'/watthourMeter/selectById.do?id='+id);

        },


        /**
         * 基础数据-电表管理-删除电表(单条或多条)
         * @param ids
         * @returns {HttpPromise}
         */
        deleteWatthourMeter:function(ids){

            return $http.get(base_url+'/watthourMeter/delete.do?ids='+ids);

        },


        /**
         * 基础数据-电表管理-添加或删除
         * @param WatthourMeter
         * @returns {HttpPromise}
         */
        saveOrUpdateWatthourMeter:function(WatthourMeter){
        	debugger;
            return $http.post(base_url+'/watthourMeter/saveOrUpdate.do',WatthourMeter);
        },

        /**
         * 基础数据-电表管理-换表
         * @param WatthourMeter
         * @returns {HttpPromise}
         */
        saveOrUpdateMeter:function(WatthourMeter){
            return $http.post(base_url+'/watthourMeter/saveOrUpdate.do',WatthourMeter);
        },




        /**
         *基础数据-发票管理
         * @param params
         * @returns {HttpPromise}
         */
        queryInvoicePage:function(params){
            return $http.get(base_url+'/invoice/queryListPage.do',{
                params:params
            });

        },
        
        /**
         *基础数据-发票管理-新增or修改
         * @param params
         * @returns {HttpPromise}
         */
        saveOrUpdateInvoice:function(params){
        	return $http.post(base_url+'/invoice/saveOrUpdate.do',{
        		params:params
        	});
        	
        },
        
        /**
         * 基础数据-发票管理-删除发票(单条或多条)
         * @param ids
         * @returns {HttpPromise}
         */
        deleteInvoice:function(Ids){

            return $http.get(base_url+'/invoice/delete.do?Ids='+Ids);

        },


        /**
         *基础数据-额定功率管理
         * @param params
         * @returns {HttpPromise}
         */
        findPowerRateByPage:function(params){
            return $http.get(base_url+'/powerRateManage/findPowerRateByPage.do',{
                params:params
            });

        },
        //额定功率excel导出
        findPowerRateByPageExcel:function(){
            return base_url+'/powerRateManage/findPowerRateByPageExcel.do';

        },
        
		//查询资管机房拥有者 
		findProperty:function(){
            return $http.get(base_url+'/powerRateManage/findProperty.do');

        },
		
		//查询资管机房状态
		findStatus:function(){
            return $http.get(base_url+'/powerRateManage/findStatus.do');

        },
		
		//查看机房设备
		 selectFacility:function(id){

            return $http.get(base_url+'/powerRateManage/selectFacility.do?id='+id);
        },
		
        /**
         * 基础数据维护-额定功率管理--单条查询接口
         * @param params
         * @returns {HttpPromise}
         */
        querySingleRMSPage:function(id){

            return $http.get(base_url+'/powerRateManage/findPowerRateById.do?id='+id);
        },
        
        /**
         * 基础数据维护-额定功率管理--修改额定功率
         * @params
         * @returns {HttpPromise}
        */
        editedRMS:function(params){
            debugger;
            return $http.get(base_url+'/powerRateManage/updatePowerRate.do',{
                params: params
            });
        },


        /**
         *基础数据-供电信息管理
         * @param params
         * @returns {HttpPromise}
         */
        queryPageAccountSitePSU:function(params){
            return $http.get(base_url+'/accountSitePSU/queryPageAccountSitePSU.do',{
                params:params
            });

        },
        /**********************转供电相关serv**************************************/
        /**
         *基础数据-转供电信息管理获取数据
         * @param params
         * @returns {HttpPromise}
         */
        // findAccountSiteByTransPage:function(params){
        //     return $http.get(base_url+'/accountSiteTrans/findAccountSiteByTransPage.do',{
        //         params:params
        //     });

        // },
        /**
         *基础数据-转供电信息管理--获取从流程中查到的数据
         * @param params
         * @returns {HttpPromise}
         */
        findAccountSiteByTransPage:function(params){
            return $http.get(base_url+'/basicDataChange/queryTransFlowPage.do',{
                params:params
            });

        },

        /**
         *基础数据-转供电-获取需要改造的转供电数据
         * @param params
         * @returns {HttpPromise}
         */
        findNeedTransList:function(params){
        	return $http.get(base_url+'/accountSiteTrans/findNeedTransList.do',{
                params:params
            });
        },
         /**
         *基础数据-转供电-提交单个转供电站点到流程中
         * @param params
         * @returns {HttpPromise}
         */

        submitToFlow:function(params){
            console.log(params)
            return $http.post(base_url+'/accountSiteTrans/submitToFlow.do',params);
        },
        /**
         *基础数据-转供电-单个转供电站点改造提交
         * @param params
         * @returns {HttpPromise}
         */

        saveTransEleAdd:function(accountSiteTrans){
            console.log(accountSiteTrans)
            return $http.post(base_url+'/accountSiteTrans/saveTransEleAdd.do',accountSiteTrans);
        },
        /**
         *基础数据-转供电-省级管理员把需要改造的站点提交到下一级经办人手中
         * @param params
         * @returns {HttpPromise}
         */

        addNeedChangeSiteToNext:function(accountSiteTrans){
            console.log(accountSiteTrans)
            return $http.post(base_url+'/accountSiteTrans/addNeedChangeSiteToNext.do',accountSiteTrans);
        },

        /**
         *基础数据-转供电-经办人获取可以提交的转供电数据
         * @param params
         * @returns {HttpPromise}
         */

        getNeedSubmitData:function(params){
            console.log(params)
            return $http.post(base_url+'/accountSiteTrans/getNeedSubmitData.do',params);
        },

         /**
         * 转供电审批管理
         */
        transApprovalDataModify : function(params) {
            return $http.post(base_url+'/basicDataChange/transApprovalDataModify.do',{
                params:params
            });
        },



          /**
         *基础数据-转供电-单个转供电站点改造提交
         * @param params
         * @returns {HttpPromise}
         */

        // updateTransPower:function(accountsiteTransSubmit){
        //     console.log(accountSiteTrans)
        //     return $http.post(base_url+'/accountSiteTrans/updateTransPower.do',accountsiteTransSubmit);
        // },

        /**
         *基础数据-转供电-撤销----------把提交过来的单子返回到新增人员手中
         * @param params
         * @returns {HttpPromise}
         */

        cancelTransSite:function(params){
            console.log(params)
            return $http.post(base_url+'/accountSiteTrans/cancelTransSite.do',params);
        },

         /**
         *基础数据-转供电管理查询流程数据
         * @param params
         * @returns {HttpPromise}
         */
        transGetFlowData:function(params){
            return $http.post(base_url+'/basicDataChange/queryTransFlowPage.do',{
                params:params
            });

        },


         /**
         * 基础数据-转供电批量删除数据
         * @param ids
         * @returns {HttpPromise}
         * 
         */
        deleteTransDatas:function(ids){

            return $http.post(base_url+'/accountSiteTrans/deleteByIDs.do',{
                ids:ids
            });
        },

        /**
         * 基础数据---转供电批量审批
         */
        bachSubmitTransEleForJson: function(auditDetail) {
            return $http({
                method: "POST",
                url: base_url+'/basicDataChange/transEleFlowList.do',
                data: JSON.stringify(auditDetail),
                headers: { 'Content-Type': 'application/json'}
            });
        },

   

        /**
         *  基础数据-转供电-查询流转信息
         * @param id
         * @returns {HttpPromise}
         */

        getTransFlowDetails:function(id){
            return $http.post(base_url+'/basicDataChange/queryApprovalDetails.do',{  
                instanceId:id
            });
        },

        /**
         * 转供电保存数据
         * @param electricty
         * @returns {HttpPromise}
         */
        saveTransInfo:function(needTrans){

            return $http({
                method: "POST",
                url: base_url+'/accountSiteTrans/saveTransInfo.do',
                data:{str: JSON.stringify(needTrans)},
                //headers: { 'Content-Type': 'application/json' }
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },


        /**
         *基础数据-转供电数据导出Excel
         * @param params
         * @returns {HttpPromise}
         */
        queryTransDatasPageExcel:function(){
            return base_url+'/accountSiteTrans/queryTransDatasPageExcel.do';
        },

        /**
         * 基础数据-转供电-查询转供电待改造的数据
         */
//        getTransEleList：function(params){
//        	return $http.get(base_url+'/accountSiteTrans/getTransEleList.do',{
//        		params:params
//        	});
//        }



        /***********************************转供电结束*********************************/
        
        /**
         *基础数据-供电信息管理--修改
         * @param params
         * @returns {HttpPromise}
         */
        updatesupplyPower:function(accountSitePSU){
        	
        	debugger;
        	console.log(accountSitePSU)
            return $http.post(base_url+'/accountSitePSU/updateAccountSitePSUById.do',accountSitePSU);

        },
        


        /**
         * 添加或修改电表信息
         * @param watthour
         * @returns {HttpPromise}
         */
        saveOrUpdateWatthourMeter:function(watthour){
            return $http.post(base_url+'/watthourMeter/saveOrUpdate.do',watthour);
        },


        /**
         *基础数据-报账点管理
         * @param params
         * @returns {HttpPromise}
         */
        queryPageAccountSitePage:function(params){
        	debugger;
            return $http.get(base_url+'/accountSiteManage/queryPageAccountSiteManage.do',{
                params:params
            });
        },

        
         /**
         *基础数据-报账点管理 ：修改 
         * @param params
         * @returns {HttpPromise}
         */
        updateSiteInfo:function(params){
            return $http.get(base_url+'/accountSiteManage/updateAccountSiteManageById.do',{
                params:params
            });

        },

        /**
         *基础数据-其他信息管理
         * @param params
         * @returns {HttpPromise}
         */
        queryOtherInfoPage:function(params){
            return $http.get(base_url+'/accountSiteOther/queryPageAccountSiteOther.do',{
                params:params
            });

        },
        
        /**
         *基础数据-其他信息管理 ：修改 
         * @param params
         * @returns {HttpPromise}
         */
        saveOrUpdateOther:function(params){
        	debugger;
            return $http.get(base_url+'/accountSiteOther/updateAccountSiteOtherById.do',{
                params:params
            });

        },



        /**
         *基础数据-业主信息管理
         * @param params
         * @returns {HttpPromise}
         */
        queryOwnerInfoPage:function(params){
        	console.log(params);
            return $http.get(base_url+'/ownerController/queryPage.do',{
                params:params
            });

        },

        /**
         *基础数据-业主信息管理-导出
         * @param params
         * @returns {HttpPromise}
         */
    /*    exportExcel:function(){
            return $http.get(base_url+'/ownerController/exportExcel.do');

        }, */

//        exportExcel:function(){
//        	return $http({  
//                url: base_url+'/ownerController/exportExcel.do',  
//                method: "Post",//接口方法  
//            })
//        },

        exportExcel:function(){
        	return base_url+'/ownerController/exportExcel.do';
        },
        //电费稽核导出excel
        exportEleExcel:function(){
        	 return base_url+'/workflow/queryFlowExportExcel.do';
        },
        
        /**
         *基础数据-新增业主信息详情
         * @ownerInfo ownerInfo
         * @returns {HttpPromise}
         */
        addOwnerInfoDetal:function(ownerInfo){

            return $http({
               method: "POST",
               url: base_url+'/ownerController/saveOwner.do',
               data:{str: JSON.stringify(ownerInfo)},
               // headers: { 'Content-Type': 'application/json'}
               // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

        },
        
        /**
         *基础数据-更新业主信息详情
         * @ownerInfo ownerInfo
         * @returns {HttpPromise}
         */
        updateOwnerInfoDetal:function(ownerInfo){
        	debugger;
            return $http({
               method: "POST",
               url: base_url+'/ownerController/updateOwner.do',
               data:{str: JSON.stringify(ownerInfo)},
               
               // headers: { 'Content-Type': 'application/json'}
               // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

        },

        /**
         *基础数据-删除业主信息
         *@ownerId ownerId
         *@return {HttpPromise}
         */
        deleteOwnerInfo: function(ownerId){
            return $http.post(base_url+'/ownerController/deleteOwner.do?ownerId='+ownerId);
        },
        
        /**
         *基础数据-删除业主电表
         *@ownerId ownerId
         *@return {HttpPromise}
         */
        deleteElectrictySingle: function(meterId){
            return $http.post(base_url+'/meterController/deleteMeter.do?meterId='+meterId);
        },


        /**
         *基础数据-查看业主信息详情
         * @param params
         * @returns {HttpPromise}
         */
        queryOwnerInfoDetal:function(ownerId){
            return $http.get(base_url+'/ownerController/queryOwner.do?ownerId='+ownerId);
        },
        
        
        
        /**
         * 基础数据 维护管理 查看详情
         */
        queryDetailDialog:function(ownerId){
        	return $http.get(base_url+'/dataModifyApply/findLogByApplyId.do?id='+ownerId);
        },



        /*
        *
        * 基础数据-业主电表信息查询
        */ 
        queryElectrictyAmount:function(){
            return $http.get(base_url+'/meterController/queryMeter.do?meterId='+meterId);
        },


        /**
         *基础数据-新增电表信息
         * @electricDetail electricDetail
         * @returns {HttpPromise}
         */
        addElectricInfoDetal:function(electricDetail){
            return $http.post(base_url+'/meterController/saveMeter.do',electricDetail);
        },


        /**
         *基础数据-查询修改电表信息
         * @param params
         * @returns {HttpPromise}
         */
        modifyElectrictySingle:function(meterId){

            return $http.post(base_url+'/meterController/updateMeter.do?meterId='+meterId);

        },

        
        /**
         *基础数据-修改保存电表信息
         * @param params
         * @returns {HttpPromise}
         */
        updateMeter:function(electricDetail){
            return $http.post(base_url+'/meterController/updateMeter.do',electricDetail);
        },



        /**
         *基础数据-维护数据修改管理
         * @param params
         * @returns {HttpPromise}
         */
        dataModifyApply:function(params){
            return $http.post(base_url+'/basicDataChange/queryFlowPage.do',{
                params:params
            });

        },
        
        /**
         * 审批
         */
        approvalDataModify : function(params) {
        	return $http.post(base_url+'/basicDataChange/auditElectricityFlow.do',{
                params:params
            });
        },

        /**
         *基础数据-查看详情管理
         * @param params
         * @returns {HttpPromise}
         */
        queryDataModify:function(id){
            return $http.get(base_url+'/dataModifyApply/findApplyById.do?id='+id);
        },




        /**
         *基础数据-驳回管理
         * @param params
         * @returns {HttpPromise}
         */
        deletDataModifyApply:function(ids){
            return $http.get(base_url+'/dataModifyApply/deleteApplyByIds.do?ids='+ids);
        },















        //---------------------------------------------------------------------------------电费录入 新增稽核单 功能模块----------------------------------------------------------------------------

        /**
         * 获取流水号及发票信息
         * @returns {HttpPromise}
         */
        getInputElectrictyAddInfo:function(){

            return $http.get(base_url+'/inputElectricty/toAdd.do');
        },
        
        //根据供应商id查找预付单
        getPreBySuId:function(supplyId,supplierRegionCode){
        
        	return $http.get(base_url+'/advancePayment/getPreBySuId.do?supplyId='+supplyId+'&supplierRegionCode='+supplierRegionCode);
        },


        /**
         * 获取成中心 数据源
         * @returns {HttpPromise}
         */
        getInputElectrictyCostCeterVOsInfo:function(){

            return $http.get(base_url+'/costcenter/findByUser.do');

        },


        /**
         * 查询供应商
         * @param params
         */
        querySupplier:function(params){
           
            return  $http.post(base_url+'/supplierManage/findSupplyByPage.do',{
                params:params
            });
        },

        /**
         * 查询合同信息
         * @param params
         */
        queryContract:function(params){
           
            return  $http.post(base_url+'/contractManage/findContractByPage.do',{
                params:params
            });
        },

		    /**
         * 根据合同ID查询合同信息
         * @param params
         */
        getContractInfo:function(contractId,cityId,countyId){           
            return $http.get(base_url+'/contractManage/findContractById.do?contractId='+contractId+'&cityId='+cityId+'&countyId='+countyId);
        },
        
        getwhiteContractInfo:function(contractId,cityId,countyId){           
            return $http.get(base_url+'/contractManage/findwhiteContractById.do?contractId='+contractId+'&cityId='+cityId+'&countyId='+countyId);
        },
		
        /**
         * 根據報賬點ID  返回所對應的供應商
         * @param params
         */
        getSupplierName:function(siteID){
           
            return  $http.get(base_url+'/supplier/queryBySiteID.do?siteID='+siteID);
        },

        /**
         * 根據報賬點ID  返回所對應的合同ID
         * @param params
         */
        getContractName:function(siteID){
           
            return  $http.get(base_url+'/supplier/queryContractBySiteID.do?siteID='+siteID);
        },
        
        /**
         * 根據報賬點ID  返回所對應的合同ID(报账点对应的所有合同)
         * @param params
         */
        getContract:function(siteID){
           
            return  $http.get(base_url+'/supplier/queryContract.do?siteID='+siteID);
        },

        /**
         * 查询报账点-分页
         * @param params
         */
        querySiteInfoPage:function(params){

            return $http.post(base_url+'/siteInfo/querySite.do',{
                params:params
            });
        },


        /**
         * 查询是否包干、产权性质 ------后台根据当前登录人调用的接口   查询数据ID  （暂时没调用）
         * @param params
         */
        queryByBlurred:function(){

            return $http.get(base_url+'/inputElectricty/queryByBlurred.do');
        },

        


        /**
         * 获取电表明细
         * @param siteID
         * @returns {HttpPromise}
         */
        getInputElectrictyDetail:function(siteID){

            return $http.get(base_url+'/inputElectricty/findBySiteID.do?siteID='+siteID);

        },
        
        geteleinfo:function(id){
        	return $http.get(base_url+'/inputElectricty/geteleinfo.do?id='+id);
        },


        /**
         * 保存录入电费
         * @param electricty
         * @returns {HttpPromise}
         */
        saveElectricty:function(electrictySaveVO){

            return $http({
                method: "POST",
                url: base_url+'/inputElectricty/saveElectricty.do',
                data:{str: JSON.stringify(electrictySaveVO)},
                //headers: { 'Content-Type': 'application/json' }
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        
        /**
         * 稽核单提交时检测是否超标杆
         */
        checkElePowerInSub:function(electrictySaveVO){
        	 return $http({
                 method: "POST",
                 url: base_url+'/inputElectricty/check1.do',
                 data:{str: JSON.stringify(electrictySaveVO)},
                 //headers: { 'Content-Type': 'application/json' }
                 //headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
             });
        },
        
        /**
         * 查询报账点是否存在可以报账的机房
         */
        getAccountRoomIsOnline:function(accountId){
        	return $http.get(base_url+'/inputElectricty/getAccountRoomIsOnline.do?accountId='+accountId);
        },
        /**
         * 保存综合录入电费
         * @param electricty
         * @returns {HttpPromise}
         */
        saveZElectricty:function(electrictySaveVO){

            return $http({
                method: "POST",
                url: base_url+'/inputElectricty/saveZElectricty.do',
                data:{str: JSON.stringify(electrictySaveVO)},
                //headers: { 'Content-Type': 'application/json' }
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        //查询登录人预付单数量
        queryPreNum:function(){
            return $http({
                method: "POST",
                url: base_url+'/advancePayment/queryPreNum.do',
            });
        },
      //查询登录人预付单数量
        queryPreSNum:function(){

            return $http({
                method: "POST",
                url: base_url+'/advancePayment/queryPreSNum.do',
            });
        },
      //查询登录人预付单数量
        queryPreCNum:function(){

            return $http({
                method: "POST",
                url: base_url+'/advancePayment/queryPreCNum.do',
            });
        },
        
        
        
        /*//电费稽核导出excel
        downExcel:function(){
        	alert("excel");
        	return $http({  
                url: base_url+'/inputElectricty/downExcel.do',  
                method: "GET",//接口方法  
                params: {  
                },  
                headers: {  
                    'Content-type': 'application/json'  
                },  
                responseType: 'arraybuffer'  
            })
        },*/
        
        //电费稽核导出excel
        downExcel:function(page){
        	return $http({  
                url: base_url+'/inputElectricty/downExcel.do?pageSize='+page.pageSize+"&pageNo="+page.pageNo,  
                method: "GET",//接口方法  
            })
        },
        
      //综合电费稽核导出excel
        ZdownExcel:function(){
        	return $http({  
                url: base_url+'/inputElectricty/ZdownExcel.do',  
                method: "GET",//接口方法  
            })
        },
        
        //导出转供电改造清单
        downZGExcel:function(){
        	return $http({  
                url: base_url+'/accountSiteManage/downZGExcel.do',  
                method: "GET",//接口方法  
            })
        },



        /**
         * 更改电费状态
         * @param id
         * @param status
         * @returns {HttpPromise}
         */
        updateElectrictyStatus:function(id,status){
            return $http.post(base_url+' /inputElectricty/updateStatus.do',{
                id:id,
                status:status
            });
        },


        /**
         *查询汇总金额（列表页显示）
         * @returns {HttpPromise}
         */
        queryElectrictyTotalAmount:function(){
            return $http.get(base_url+'/inputElectricty/queryTotalAmount.do');
        },


        /**
         *继续上传----暂时未用
         * @returns {HttpPromise}
         */
        uploadFile:function(files){
            return $http({
                method: "POST",
                url: base_url+'/fileOperator/fileUpload.do',
                data:files,
                // headers: { 'Content-Type':undefined}
                enctype: 'multipart/form-data',
            
            });
        },



         /**
         *报账组列表查询
         * @returns {HttpPromise}
         */
        queryAccount: function(params){
            return  $http.get(base_url+'/reimbursementGroup/queryList.do',{
                params:params
            });
        },


        /**
         *报账组查看详情
         * @returns {HttpPromise}
         */
        queryAccountDetail: function(id){
            return  $http.get(base_url+'/reimbursementGroup/findOneById.do?id='+id);
        },


        /**
         *删除报账组名称
         * @returns {HttpPromise}
         */
        deleteAccount: function(ids){
            return  $http.get(base_url+'/reimbursementGroup/deleteByIds.do?ids='+ids);
        },



        /**
         *修改报账组名称
         * @returns {HttpPromise}
         */
        modifyAccount: function(params){
            return  $http.get(base_url+'/reimbursementGroup/updateReimbursement.do',{
                params:params
            });
        },



        /**
         *新增报账组名称
         * @returns {HttpPromise}
         */
        addAccountPage: function(params){
            return  $http.get(base_url+'/reimbursementGroup/createReimbursement.do',{
                params:params
            });
        },

        /**
         *超标杆提交接口
         * @returns {HttpPromise}
        */
       checkMarkDetails: function(eIds){
            return  $http.post(base_url+'/inputElectricty/check.do?eIds='+eIds);
       },


        //---------------------------------------------------------------------------------电费录入 页面 功能模块----------------------------------------------------------------------------


        /**
         * 电费录入-列表查询
         * @param params
         * @returns {HttpPromise}
         */
        inputElectrictyQueryPage:function(params){

            return $http.get(base_url+'/inputElectricty/queryList.do',{
                params:params
            });
        },
        
		/**
         * 查询对应报账组
         * @param params
         * @returns {HttpPromise}
         */
        selectSysRg:function(){

            return $http.get(base_url+'/inputElectricty/selectSysRg.do');
        },

        /**
         *  电费录入-批量删除
         * @param ids
         * @returns {HttpPromise}
         * 
         */
        deleteInputElectricty:function(ids){

            return $http.post(base_url+'/inputElectricty/deleteByIDs.do',{
                ids:ids
            });
        },


        /**
         *  电费录入（电费稽核详情） 同一接口进行查询
         * @param id
         * @returns {HttpPromise}
         */
        getInputElectrictyById:function(id){
            return $http.get(base_url+'/inputElectricty/findOneByID.do?id='+id);
        },
        
		 /**
         *  电费录入（电费稽核详情） 同一接口进行查询（用于查看报销单明细所需数据）
         * @param id
         * @returns {HttpPromise}
         */
        getInputElectrictyByIdDetails:function(id){
            return $http.get(base_url+'/inputElectricty/findOneByIDDetails.do?id='+id);
        },
        
        
         /**
         * 电费录入批量-单个提交
         * @param ids
         * @returns {HttpPromise}
         */
        submitElectricty:function(id){
            return $http.post(base_url+'/inputElectricty/batchSubmit.do',{
                ids:id
            });
            // return $http({
            //     method: "POST",
            //     url: base_url+'/inputElectricty/batchSubmit.do',
            //     data: id ,
            //     // headers: { 'Content-Type': 'application/json' }
            //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            // });
        },

        /**
         * 综合电费录入批量-单个提交
         * @param ids
         * @returns {HttpPromise}
         */
        submitZElectricty:function(id){
            return $http.post(base_url+'/inputElectricty/zbatchSubmit.do',{
                ids:id
            });
        },
        
        addDEC:function(pppa){
            return $http.post(base_url+'/inputElectricty/addDEC.do?',{params:pppa});
        },


        /**
         * 修改电费录入
         * @param electricty
         * @returns {HttpPromise}
         */
        modifyElectricty:function(electrictySaveVO){

            return $http({
                method: "POST",
                url: base_url+'/inputElectricty/updateElectricty.do',
                data:{str: JSON.stringify(electrictySaveVO)},
                //headers: { 'Content-Type': 'application/json' }
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        
  //---------------------------------------------预付单提交功能------------------------------------------------      
        /**
         * 保存预付单
         * @param electricty
         * @returns {HttpPromise}
         */
        submitPrepay:function(aPaymentVo){
            return $http({
                method: "POST",
                url: base_url+'/advancePayment/prepayAdd.do',
                data:{str: JSON.stringify(aPaymentVo)},
                
            });
        },

        
        /**
         * 预付单-列表查询（流程）
         * @returns {HttpPromise}
         */
        getprepayFlowList:function(params){

            return $http.get(base_url+'/workflow/queryPrepayFlow.do',{
                    params:params
            });

        },
        
        
        
        /**
         * 预付单-列表查询
         * @returns {HttpPromise}
         */
        getprepaylist:function(adpv){


            return $http.get(base_url+'/advancePayment/queryList.do',{
                    params:adpv
            });

        },
        
        /**
         *  新增预付获得经办人基本信息与预付单号
         * @param id
         * @returns {HttpPromise}
         */
        getprepayID:function(){
            return $http.get(base_url+'/advancePayment/getprepayID.do');
        },
        
        
        /**
         *  预付单查询
         * @param id
         * @returns {HttpPromise}
         */
        getPrepayById:function(id){
        	return $http.get(base_url+'/advancePayment/getViewPrepayDetails.do?id='+id);
        },
        
        //预付提交查看
        getPreSubmit:function(id){
        	return $http.get(base_url+'/advancePayment/queryDetail.do?subID='+id);
        },
       
        /**
         *  预付单个通过\驳回
         * @param id
         * @returns {HttpPromise}
         */
        
        submitzwPreAudit: function(auditDetail) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/approvepre.do',
                data: auditDetail,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        
        /**
         *  预付单个删除
         * @param id
         * @returns {HttpPromise}
         */
        
        rejectPreAduit: function(singleAudit) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/deleteTaskpre.do',
                data: singleAudit,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        
        
        /**
         * 批量审批(预付)
         */
        bachSubmitPreForJson: function(auditDetail) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/approvePreList.do',
                data: JSON.stringify(auditDetail),
                headers: { 'Content-Type': 'application/json'}
            });
        },

        
        /**
         *  预付提交财务-列表查询
         * @param id
         * @returns {HttpPromise}
         */
        getPreList: function(params){
            return  $http.get(base_url+'/workflow/queryPreSendInfo.do',{
                params:params
            })
        },
   
        
        saveTalk: function(params){
        	return $http.get(base_url+"/advancePayment/saveTalk.do",{
        		params:params
        	})
        },
        
        
        
        /**
         * 生成预付提交单按钮操作
         * @returns {HttpPromise}
         */
        createtePreSubmit:function(id){

            return $http.post(base_url+'/advancePayment/createtePreSubmit.do',{
                ids:id
            });
        },
        
        
        /**
         * 批量审批(预付)
         */
        bachSubmitPreForJson: function(auditDetail) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/approvePreList.do',
                data: JSON.stringify(auditDetail),
                headers: { 'Content-Type': 'application/json'}
            });
        },
        
        
        
        /**
         *  预付批量删除
         * @param id
         * @returns {HttpPromise}
         */
        
        bachPreDeleteTask: function(singleAudit) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/deletePreTaskList.do',
                data: singleAudit,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        
        
        /**
         *  点击生成预付提交单生成按钮
         * @param id
         * @returns {HttpPromise}
         */
        getViewPreDetails:function(id){
            return $http.get(base_url+'/advancePayment/queryDetail.do?subID='+id);
        },
        
        
        
        
        /**
         * 预付录入-列表查询
         * @param params
         * @returns {HttpPromise}
         */
        preQueryPage:function(params){
            return $http.get(base_url+'/advancePayment/queryList.do',{
                params:params
            });
        },
        

        
        /**
         *  电费预付修改---流程更新
         * @param id
         * @returns {HttpPromise}
        
/*        editAduit: function(params) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/updatePreTask.do',
                data: JSON.stringify(params),
                headers: { 'Content-Type': 'application/json'}
            });
        },*/
 

        //---------------------------------------------------------------------------------电费稽核 功能模块----------------------------------------------------------------------------

        /**
         * 电费稽核-列表查询
         * @returns {HttpPromise}
         */
        getInputElectrictyList:function(params){
            return $http.get(base_url+'/workflow/queryFlow.do',{
                    params:params
            });

        },
        
        /**
         * 综合电费稽核-列表查询
         * @returns {HttpPromise}
         */
        getInputZElectrictyList:function(params){

            return $http.get(base_url+'/workflow/queryZFlow.do',{
                    params:params
            });

        },
        
        
        /**
         * 电费稽核-列表查询
         * @returns {HttpPromise}
         */
        getqueryGenerated:function(params){

            return $http.get(base_url+'/workflow/queryGenerated.do',{
                    params:params
            });

        },

        
         /**
         *  点击生成电费提交单生成按钮
         * @param id
         * @returns {HttpPromise}
         */
        getViewElectricDetails:function(id){
            return $http.get(base_url+'/electricitySubmit/queryDetail.do?subID='+id);
        },
        

    

        /**
         * 生成电费提交单按钮操作
         * @returns {HttpPromise}
         */
        createteEleSubmit:function(id){
            return $http.post(base_url+'/electricitySubmit/createteEleSubmit.do',{
                ids:id
            });
        },


        /**
           *
           *删除提交表单
           * @async id
           * @returns {HttpPromise}
         */
        revocationProcess: function(id){
            return $http.post(base_url+'/electricitySubmit/deleteBySubID.do',{
                subID:id
            });
        },



        /**
         *  电费稽核查看详情-流转图信息
         * @param id
         * @returns {HttpPromise}
         */

        getFlowDetails:function(id){
            return $http.post(base_url+'/workflow/queryApprovalDetails.do',{  
                instanceId:id
            });
        },

        /**
         * 查询自维流转图
         * 
         */
        queryFlowChart:function(id){
            return $http.post(base_url+'/workflow/queryFlowChart.do', {
            	instanceId:id
            });
        },
        
        /**
         * 查询预付流转图
         * 
         */
        queryFlowChartByPay:function(id){
            return $http.post(base_url+'/workflow/queryFlowChartByPay.do', {
            	instanceId:id
            });
        },
        
         /**
         *  电费稽核单个通过\驳回
         * @param id
         * @returns {HttpPromise}
         */
        
        submitzwAudit: function(auditDetail) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/approve.do',
                data: auditDetail,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        
        
        
        /**
         *  综合电费稽核单个通过\驳回
         * @param id
         * @returns {HttpPromise}
         */
        
        submitzwZAudit: function(auditDetail) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/approvez.do',
                data: auditDetail,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        
        //按报账点id查缴费类型与所属专业
        getPayTypeById:function(siteId){
        	return $http.post(base_url+'/inputElectricty/getPayTypeById.do?id='+siteId);
        },


        // 电费稽核单批量通过\驳回
        submitZWAuditForJson: function(auditDetail) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/approve.do',
                data: auditDetail,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },
        
        /**
         * 批量审批
         */
        bachSubmitZWAuditForJson: function(auditDetail) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/approveList.do',
                data: JSON.stringify(auditDetail),
                headers: { 'Content-Type': 'application/json'}
            });
        },





        /**
         * 电费稽核批量提交点
         * @param ids
         * @returns {HttpPromise}
         */
        batchSubmitInputElectricty:function(id){
            return $http.post(base_url+'/inputElectricty/batchSubmit.do',{
                ids:id
            });
        },


        /**
         *  电费稽核单个删除
         * @param id
         * @returns {HttpPromise}
         */
        
        rejectAduit: function(singleAudit) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/deleteTask.do',
                data: singleAudit,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        
        
        /**
         *  综合电费稽核单个删除
         * @param id
         * @returns {HttpPromise}
         */
        
        rejectZAduit: function(singleAudit) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/deleteZTask.do',
                data: singleAudit,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },

         /**
         *  电费稽核批量删除
         * @param id
         * @returns {HttpPromise}
         */
        
        bachDeleteTask: function(singleAudit) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/deleteTaskList.do',
                data: singleAudit,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },

        


        /**
         *  电费稽核修改---流程更新
         * @param id
         * @returns {HttpPromise}
         */
        editAduit: function(params) {
            return $http({
                method: "POST",
                url: base_url+'/workflow/updateTask.do',
                data: {str: JSON.stringify(params)},
               // headers: { 'Content-Type': 'application/json'} 
            });
        },


        //---------------------------------------------------------------------------------提交财务管理 功能模块----------------------------------------------------------------------------
         

        /**
         *  提交财务-列表查询
         * @param id
         * @returns {HttpPromise}
         */
        getElectricList: function(params){
            return  $http.get(base_url+'/workflow/querySendInfo.do',{
                params:params
            })
        },
        
        /**
         * 报销单导出excel
         */
        getElectricListExcel:function(){
        	return base_url+'/workflow/querySendInfoExcel.do';
        },


        /**
         * 推送报销发起人
         */
        pushManager: function(id) {
            return  $http.post(base_url+'/workflow/sendOut.do',{
                id:id
            })
        },
        
        
        /**
         * 推送报销发起人
         */
        pushPreManager: function(id) {
            return  $http.post(base_url+'/workflow/sendPreOut.do',{
                id:id
            })
        },
        


        /**
         *批量推送报销发起人
         */
        batchPushManager: function(params) {
            return  $http.post(base_url+'/workflow/batchSendOut.do',{ids:params})
        },
        


        /**
           *
           *
           * 财务电费列表查询
         */ 
        queryAuditList: function(params) {
            return $http.get(base_url+'/electricitySubmit/queryList.do',{
                    params:params
            });
        },



         /**
           *
           *
           * 流程进展查询
         */
        queryProcessDetail: function(instanceId) {
            return $http.get(base_url+'/workflow/queryApprovalDetails.do',{
                instanceId:instanceId
            });
        },

     
        //---------------------------------------------------------------------------------流程管理 功能模块----------------------------------------------------------------------------


        /**
         * 流程任务查询-列表查询修改
         * @param params
         * @returns {HttpPromise}
         */
        // queryFlowByPage:function(params){
        //     return $http.get(base_url+'/workflow/queryFlow.do',{
        //         params:params
        //     });
        // },



        //---------------------------------------------------------------------------------标杆管理 功能模块----------------------------------------------------------------------------


        /**
         * 额定功率标杆-列表查询
         * @param params
         * @returns {HttpPromise}
         */
        queryPowerRatingPage:function(params){
            return $http.get(base_url+'/benchmark/powerRating.do',{
                params:params
            });
        },

        /**
         * 额定功率标杆-详情查询
         * @param id
         */
        queryPowerRatingDetail:function (id){
            return $http.get(base_url+'/benchmark/powerRatingDetail.do?siteId='+id);
        },

        /**
         * 智能电表标杆-列表查询
         * @param params
         * @returns {HttpPromise}
         */
        querySmartMeterPage:function(params){
            return $http.get(base_url+'/benchmark/querySmartMeterStandard.do',{
                params:params
            });
        },
        
        /**
         * 开关电源标杆-列表查询
         * @param params
         * @returns {HttpPromise}
         */
        querySwitchPowerPage:function(params){
            return $http.get(base_url+'/benchmark/querySwitchPowerStandard.do',{
                params:params
            });
        },

        //---------------------------------------------------------------------------------流程管理 功能模块----------------------------------------------------------------------------

        /**
         *系统管理-列表查询
         * @param params
         * @returns {HttpPromise}
         */
        queryWorkflowPage:function(params){
            return $http.get(base_url+'/workflowManage/queryWorkflowPage.do',{
                params:params
            });
        },



        queryAllUser:function(params){

            return $http.get(base_url+'/user/queryUserByPage.do',{
                params:params
            });
        },



        /**
         * 添加或更新流程
         * @param Workflow
         * @returns {*}
         */
        addOrUpdateWorkflow:function(Workflow){

                return $http({
                    method: "POST",
                    url: base_url+'/workflowManage/createModel.do',
                    data: JSON.stringify(Workflow) ,
                    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
                });
        },

        /**
         * 查询单个流程信息
         * 
         * @param Workflow
         * @returns {*}
         */
        getMangeFlowDetails:function(id){
                return $http({
                    method: "POST",
                    url: base_url+'/workflowManage/queryDetail.do',
                    data: {"definitionId" : id} ,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
        },


        /**
         * 成本中心 数据导入
         * @returns {string}
         */
        costCenterImport:function(){
            return base_url+'/costcenter/costCenterImport.do';
        },
        
        /**
         * 自维报账点 数据导入
         * @returns {string}
         */
        siteImport:function(){
            return base_url+'/siteInfo/excelImport.do';
        },
        
        /**
         * 下载模板
         * @returns {string}
         */
        downLoadURI:function(){
        	 return base_url+'/downloadModel/downLoadExcelDemo.do';
        	
        },
        
        
        downDownDemo:function(){
        	return base_url+'/downloadModel/downDownDemo.do';
        },
        
        /*downLoadFile:function(fileID){
       	 debugger;
       	 return $http.get(base_url+'/fileOperator/fileDownLoad.do?fileID='+fileID)
       	
       },*/
        
        









        //----------------------------------------------------------报表统计---------------------------------------------------------------
        /**
         * 获取地图json文件
         */
        echartMapJson:function(cityMap){
            return $http.get('./assets/map/json/'+ cityMap +'.json')
        },
        
        
        
        
        /**
         * 用电量top100
         * @param params
         */
        queryTop100E:function(){
            return  $http.get(base_url+'/accountSiteManage/queryASETop100.do');
        },
        
        /**
         * 用电费top100
         * @param params
         */
        queryTop100EM:function(){
            return  $http.get(base_url+'/accountSiteManage/queryASEMTop100.do');
        },
        

        /**
         * 塔维稽核单状态统计
         */
        towerStasticStatus:function (typeCode,year){
            return $http.get(base_url+'/towerElectricty/stasticStatus.do')
        },
        
        /**
         * 塔维报销单状态统计图
         */
        towerStasticSubmitStatus:function (typeCode,year){
            return $http.get(base_url+'/towerElectricty/stasticSubmitStatus.do')
        },
        
        /**
         * 自维稽核单统计图
         */
        stasticStatus:function (typeCode,year){
            return $http.get(base_url+'/inputElectricty/stasticStatus.do')
        },
        
        /**
         * 自维报销单状态统计图
         */
        stasticSubmitStatus:function (typeCode,year){
            return $http.get(base_url+'/inputElectricty/stasticSubmitStatus.do')
        },

        /**
         * 自维区县统计
         */
        stasticCountySubmitStatus:function (){
            return $http.get(base_url+'/workflow/statisticsCountInfo.do')
        },
        
        /**
         * 塔维区县统计
         */
        stasticTowerCountySubmitStatus : function() {
        	return $http.get(base_url+'/towerWorkflow/statisticsCountInfo.do')
        },

        //电量统计管理-全省站点用电量情况
        stationEPStastic:function (typeCode,year,auditType){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = (new Date()).getFullYear();
            }
            return $http.get(base_url+'/electricPower/stationEPStastic.do?typeCode='+typeCode+'&year='+ year+'&auditType='+auditType)
        },

        //电量统计管理- 全省站点直供电，转供电用电量情况
        stationDetailEPStastic:function (typeCode,year,auditType){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = (new Date()).getFullYear();
            }
            return $http.get(base_url+'/electricPower/stationDetailEPStastic.do?typeCode='+typeCode+'&year='+ year+'&auditType='+auditType)
        },





        //电费统计管理-全省站点电费情况
        stationECStastic:function (typeCode,year,auditType){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = (new Date()).getFullYear();
            }
            return $http.get(base_url+'/electricCharge/stationECStastic.do?typeCode='+typeCode+'&year='+ year+'&auditType='+auditType)
        },

        //电费统计管理-全省站点电费占收比，占支比
        scaleECStastic:function (typeCode,year){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = 2016;
            }
            return $http.get(base_url+'/electricCharge/scaleECStastic.do?typeCode='+typeCode+'&year='+ year)
        },

        //电费统计管理-全省站点单载波电费情况
        scECStastic:function (typeCode,year,auditType){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = 2016;
            }
            return $http.get(base_url+'/electricCharge/scECStastic.do?typeCode='+typeCode+'&year='+ year+'&auditType='+auditType)
        },



        //稽核统计管理-全省站点超额定功率标杆情况
        superPowerRating:function (typeCode,year){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = 2016;
            }
            return $http.get(base_url+'/auditReport/superPowerRating.do?typeCode='+typeCode+'&year='+ year)
        },

        //稽核统计管理-全省站点超智能电表标杆值、超开关电源标杆值情况
        superSmartMeter:function (typeCode,year){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = 2016;
            }
            return $http.get(base_url+'/auditReport/superSmartMeter.do?typeCode='+typeCode+'&year='+ year)
        },





        //单价统计管理-全省电费单价占比情况
        unitPriceProportion:function (typeCode,year){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = 2016;
            }
            return $http.get(base_url+'/unitPrice/proportion.do?typeCode='+typeCode+'&year='+ year)
        },



        //指标统计管理- 资产、财务系统基站名称一致性报表
        normConsistency:function (typeCode,year){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = 2016;
            }
            return $http.get(base_url+'/norm/consistency.do?typeCode='+typeCode+'&year='+ year)
        },
        //指标统计管理- 全省站点智能电表接入率、可用率报表
        normAvailability:function (typeCode,year){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = 2016;
            }
            return $http.get(base_url+'/norm/availability.do?typeCode='+typeCode+'&year='+ year)
        },
        //指标统计管理- 资产、财务系统基站名称一致性报表
        normSitePower:function (typeCode,year){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = 2016;
            }
            return $http.get(base_url+'/norm/sitePower.do?typeCode='+typeCode+'&year='+ year)
        },   
        //综合统计-详情（地图显示）
        normDetail:function (typeCode,year,auditType){
            if(!typeCode){
                typeCode = 0;
            }
            if(!year){
                year = 2016;
            }
            return $http.get(base_url+'/report/summary/detail.do?typeCode='+typeCode+'&year='+ year+'&auditType='+auditType)
        },

        provinceSummary:function (year){
            if(!year){
                year = new Date().getFullYear();
            }
            return $http.get(base_url+'/report/summary/provinceSummary.do?year='+ year)
        },
        
        /**
         * 报销单中移出稽核单
         */
        removeElectricityToSubmit:function(electricityID,submitID){
        	return $http.get(base_url+'/inputElectricty/removeElectricityToSubmit.do?electricityID='+electricityID+'&submitID='+submitID);
        },
        
        /**
         * 查询稽核报销单是否只含一个稽核单
         */
        checkSubmitIsOneyOne:function(submitID){
        	return $http.get(base_url+'/inputElectricty/checkSubmitIsOneyOne.do?submitID='+submitID);
        },
        /**
         * 生成电费提交单按钮操作
         * @returns {HttpPromise}
         */
        createteEleSubmit_1:function(id,submitID){
            return $http.post(base_url+'/electricitySubmit/createteEleSubmit_1.do',{
                ids:id,
                submitID:submitID
            });
        },
    }
}]);