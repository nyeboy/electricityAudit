/*
* @Author: tmliua
* @Date:   2017-05-08 09:51:35
* @Last Modified by:   tmliua
* @Last Modified time: 2017-02-07 10:19:58
*/
/**
 * 基础数据呈现
 */
app.controller('towerDisplayData', ['lsServ',  '$rootScope', '$scope', '$filter', '$state', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $filter, $state, ngDialog, utils, basicManagerServ) {
	
	$scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 25,//每页显示条数
        pageNo: 1,// 当前页
    };

    $rootScope.countys={};
    //获取数据列表
    $scope.getData=function(a){
    	
    	if(a){
    		$scope.params = {
    		        pageSize: 25,//每页显示条数
    		        pageNo: 1,// 当前页
    		    };
    	}
    	
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })  
         }
        console.log($scope.params);
        angular.extend($scope.params,{
        	"towerNum":$scope.towerNum,   //铁塔站址编号
            "resName":$scope.resName,     //资管站名
            "addrName":$scope.addrName,
        })

       
        basicManagerServ.getBaseDataByPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }
    

    $scope.showAll=function(flag){


        if(flag){

            $('.basic-details .list table').show();


               var bgImgSrc= $('.basic-details i').eq(0).css('background');

            $('.basic-details i').css({
                "background":bgImgSrc.replace("drop-UP","drop-down")
            })


        }else{
            $('.basic-details .list table').hide();

               var bgImgSrc= $('.basic-details i').eq(0).css('background');

                $('.basic-details i').css({
                    "width": "15px",
                    "background":bgImgSrc.replace("drop-down","drop-UP")
                })


        }



    }
    $scope.basicinfotw=function (num) {
        $('.basic-details .list table').hide();
        if(num==1){
            $('.basic-details .list  #header').show();
        }else if(num==2){
            $('.basic-details .list #epyte').show();
        }else if(num==3){
            $('.basic-details .list #info').show();
        }else if(num==4){
            $('.basic-details .list #otherinfotw').show();
        
        }


    }
    // $('.basic-details .list').hover(
    //     function(){
    //         $(this).removeClass("list-hover").addClass("fade-list");
    //     },function(){
    //         $(this).removeClass("fade-list").addClass("list-hover");
    //     }
    // )

    //查看详情
    $scope.showDetail=function(item){
    	

        basicManagerServ.getBaseDataByDetails(item.towerId).success(function (data) {

            utils.loadData(data,function (data) {
                console.log(data);
                $scope.object = data.data;
                console.log("object",angular.toJson($scope.object,true));

            })
        });



        $scope.showDetailDialog=ngDialog.open({
            template: './tw/basicViewDetails.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

    }


    //关闭查看详情
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    };


}]);

/**********************************************塔维转供电开始*******************************************************************/
/**
 * 转供电审批管理
 */
app.controller('towerTransApproManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, basicManagerServ) {
    $rootScope.auditType=-1;
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };
    
    $scope.params = {
            pageSize: 15,//每页显示条数
            pageNo: 1,// 当前页
        };
    
    $rootScope.countys={};

          //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }

    // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showTransEleDlog.close("");
    };


        // 时间戳转换
    $scope.dataChange=function(time){
        var date = new Date(time);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate(): date.getDate());
        // var h = date.getHours() + ':';
        // var m = (date.getMinutes() < 10 ? '0'+ date.getMinutes(): date.getMinutes()) +':';
        // var s = date.getSeconds() < 10 ? '0'+ date.getSeconds():date.getSeconds();
        var times = Y+M+D;
        return times;
    }

        /**
     * 查看详情
    */
    $scope.showDetail = function(item,flag,save){
        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.isTransFlag = true;
        $scope.tab=1;
       
        //根据经办人id查询名字
            $scope.transData={
                "instanceId": item.instanceId,
                "onlyId": item.towerNeedTrans.onlyId,
                "resultStatus": item.towerNeedTrans.resultStatus,
                "submitStatus": item.towerNeedTrans.submitStatus,
                "contractId": item.towerNeedTrans.contractId,
                "supplierIds": item.towerNeedTrans.supplierIds,
                "supplierNames": item.towerNeedTrans.supplierNames,
                "addapoUserName": item.towerNeedTrans.addapoUserName, //这里的名字，是谁提交就显示谁 
                "trusteesId": item.trusteesId,
                "remark": item.towerNeedTrans.remark,
                "siteEleType": item.towerNeedTrans.siteEleType,
                "roomEleType": item.towerNeedTrans.roomEleType,
                "towerSiteName": item.towerNeedTrans.towerSiteName,
                "towerSiteCode": item.towerNeedTrans.towerSiteCode,
                // "roomId": item.towerNeedTrans.roomId,
                "createDate": $scope.dataChange(item.towerNeedTrans.createDate),
                // "properType": item.properType,
                "roomName": item.towerNeedTrans.roomName,
                // "accountName": item.towerNeedTrans.accountName,
                "cityId": item.towerNeedTrans.cityId,
                "countyId": item.towerNeedTrans.countyId,
                "cityName": item.towerNeedTrans.cityName,
                "countyName": item.towerNeedTrans.countyName,
                "attachmentId":item.towerNeedTrans.attachmentId,
                "transEleFiles":item.towerNeedTrans.transEleFiles

               
        }
         /**
         * [流转信息]
         *
         */
        basicManagerServ.getTransFlowDetails(item.instanceId).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.ApprovalZWDetails = data.data;
            })
        });

        // $scope.instanceId = item.instanceId;
        $scope.showTransEleDlog=ngDialog.open({
            template: './tw/transEleShowDetail.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'towerUpdateTransEletricityCtrl',
            scope: $scope
        });

    }

     //从流程中获取列表数据ok
    $scope.getFlowData=function(){
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.userCity != "" && $scope.userCity != null){           
            angular.extend($scope.params,{
              cityId : $rootScope.userCityId    //若城市有值，则将对应的城市ID传入cityId
            
            })
        }
        if($scope.userCounty != "" && $scope.userCounty != null){
            angular.extend($scope.params,{
                countyId : $rootScope.userCountyId  //若区县有值，则将对应的区县ID赋给countyId 
            
            })
         }
        
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })
         }
        angular.extend($scope.params,{
            // properType : $scope.properType,
            status : $scope.status,
            "mobileType" : "1",//塔维标识符
            towerSiteName : $scope.towerSiteName

        });
         console.log($scope.params)
         //获取从流程中查到的真实数据
         basicManagerServ.transGetFlowData($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

        // 转供电单个审批
    $scope.bachSubmit = function(instanceId, approveState) {
        basicManagerServ.transApprovalDataModify({"instanceId":instanceId,approveState:approveState}).success(function(data) {
             utils.ajaxSuccess(data,function(data){

                $scope.params.pageNo=1;
                $scope.getFlowData();
            })
        })
    }

    /**
     * 转供电批量审批、驳回
     */
    $scope.bachSubmitAll = function(adopt) {
        var ids = utils.getCheckedVals('#list', true);
        var flows = new Array();
        if(ids.length < 1){
            utils.msg("请选择至少一项");
            return;
        }

        for (var index = 0; index < $scope.list.length; index++) {
            var info = $scope.list[index];
            if ($.inArray(info.instanceId, ids) > -1) {
                if (info.flowState < 2) {
                    utils.msg("请批量通过按钮选择'审批中'的记录！");
                    return;
                }
                flows.push({"instanceId" : info.instanceId, "approveState": adopt});
            }
        }
        console.log(flows,"123213213")

        utils.confirm('确定要进行批量审批？',"",function(){
            basicManagerServ.bachSubmitTransEleForJson(flows).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getFlowData();
                    unCheckAll('#list')
                });
            });
        });
    }


}]);





/**
 * 转供电信息管理
 */
app.controller('towerTransEletricityManagerCtrl', ['$window','lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'basicManagerServ', function ($window,lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, basicManagerServ) {
    $rootScope.auditType=-1;
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };
    $scope.params = {
            pageSize: 15,//每页显示条数
            pageNo: 1,// 当前页
    };
    
    $rootScope.countys={};
    console.log($rootScope.transLevel)

    //三级权限判断---转供电
   
    
     // if($rootScope.roleNameList.indexOf("省公司电费稽核组基础数据管理员") != -1){
     //    $scope.transLevel = 1;
     // }else if($rootScope.roleNameList.indexOf("地市分公司网络部分管经理") != -1){
     //    $scope.transLevel = 2;
     // }else if($rootScope.roleNameList.indexOf("地市分公司电费管理员") != -1){
     //    $scope.transLevel = 3;
     // }

     $scope.reloadRoute = function () {
        $window.location.reload();
    };
    


    // 时间戳转换
    $scope.dataChange=function(time){
        var date = new Date(time);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate(): date.getDate());
        // var h = date.getHours() + ':';
        // var m = (date.getMinutes() < 10 ? '0'+ date.getMinutes(): date.getMinutes()) +':';
        // var s = date.getSeconds() < 10 ? '0'+ date.getSeconds():date.getSeconds();
        var times = Y+M+D;
        return times;
    }


    //提交到流程中，只有经办人有此权限
    $scope.submitToFlow = function(item){

        utils.confirm('确定要提交吗？',"",function(){
           // 做限制，1需要有供应商信息，2，需要有备注，3需要有附件上传，4，可以修改改造时间
            if(item.resultStatus==0){
                utils.msg("该站点已经提交流程，请勿重复提交!");
                return;
            }
            if(item.resultStatus==1){
                utils.msg("该站点已经审批完成，请勿重复提交!");
                return;
            }
            if(item.supplierNames==null || item.supplierNames==""){
                utils.msg("请选择供应商之后再提交");
                return;
            }


            $scope.transPower = {
                "trusteesName":item.trusteesName,//省级领导名字
                "trusteesId":item.trusteesId,//省级领导id
                "siteEleType":item.siteEleType,//站点用电类型
                "roomEleType":item.roomEleType,//机房用电类型
                "towerSiteCode":item.towerSiteCode,//站点id
                "towerSiteName":item.towerSiteName,//站点名字
                "roomName":item.roomName,//机房名字
                // "roomId":item.roomId,//机房id
                "supplierNames":item.supplierNames,//供应商名字
                "createDate":item.createDate,//创建时间
                // "properType":item.properType,//产权类型
                "remark":item.remark,//备注   
                "onlyId":item.onlyId,//待转供电表中唯一识别符
                "instanceId":item.instanceId,//流程id
                "mobileType":"1"//塔维表示符

            }
            //用站点id作为流程id提交进去
         basicManagerServ.submitToFlow($scope.transPower).success(function(data){
            //跳转刷新
             utils.ajaxSuccess(data,function(data){

                 // $rootScope.selectedMenu = $rootScope.menu[1].child[3].id; // 選中效果
                 $state.go('app.towerTransEletricityInfo',{
                     'status':'towerTransEletricity/info'
                 },{reload:true});
             });
         });
            
        });

    }
   /**
     * 撤销----------把提交过来的单子返回到新增人员手中
    */
    $scope.cancelBtn = function(item){
        console.log(item)
        utils.confirm('确定要撤销吗？',"",function(){
            if(item.submitStatus==3){
                utils.msg("该站点已经改造完成，无法撤销！");
                return;
            }
            if(item.resultStatus==0){
                utils.msg("该站点正在审批，无法撤销!");
            }
            $scope.canceData = {
                "onlyId":item.onlyId,
                "submitStatus":item.submitStatus,
                "resultStatus":item.resultStatus,
                "instanceId":item.instanceId
            }

            basicManagerServ.cancelTransSite($scope.canceData).success(function(data){
                       //跳转刷新
             utils.ajaxSuccess(data,function(data){
                // $state.reload('app.transEletricityManagerCtrl');
                // $scope.reloadRoute();
                 // $rootScope.selectedMenu = $rootScope.menu[1].child[3].id; // 選中效果
                 $state.go('app.towerTransEletricityInfo',{
                     'status':'towerTransEletricity/info'
                 },{reload:true});
             });
            
            })
         });
    }


    /**
     * 删除  批量删除----------直接删除这条记录
    */

    $scope.deleteSelected=function(){
        var list=[];
        list= utils.getCheckedVals('#list',false);
        console.log("onlyId123dd",list)
        if(list.length<1){
            utils.msg("请选择要删除的项目，注意审批中无法删除");
            return;
        }
        

        utils.confirm('确定要删除吗？,注意审批中无法删除',"",function(){
            basicManagerServ.deleteTransDatas(list).success(function(data){
                utils.ajaxSuccess(data,function(data){
                     $state.go('app.towerTransEletricityInfo',{
                             'status':'towerTransEletricity/info'
                              },{reload:true});
                    // $scope.params.pageNo=1;
                    // $scope.getRightData();
                    unCheckAll('#list')
                });
            });
        });
    }

    /**
     * 转供电------------------导出excel
    */

    $scope.getDataExcel = function(){
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.userCity != "" && $scope.userCity != null && $rootScope.transLevel!=1){           
            angular.extend($scope.params,{
              cityId : $rootScope.userCityId    //若城市有值，则将对应的城市ID传入cityId
            
            })
        }
        console.log(123213,$scope.params)
        if($scope.userCounty != "" && $scope.userCounty != null && $rootScope.transLevel!=1){
            
            angular.extend($scope.params,{
                countyId : $rootScope.userCountyId  //若区县有值，则将对应的区县ID赋给countyId 
            
            })
         }
        
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })
         }

         angular.extend($scope.params,{
            // "cityId":$scope.cityId,
            // "countyId":$scope.countyId,
            "transLevel":$rootScope.transLevel,
            
            "resultStatus":$scope.resultStatus,
            "mobileType" : "1",//自维标识符
            "roomName" : $scope.roomName//有可能是机房名字

        });

        var URL=basicManagerServ.queryTransDatasPageExcel();
        alert("数据加载中,请耐心等待,勿重复点击!!");
        var form=$("<form>");
        form.attr("style","display:none");
        form.attr("target","");
        form.attr("method","post");
        form.attr("action",URL);
        
        if($scope.cityId != "" && $scope.cityId != null){
            var input=$("<input>");
            input.attr("type","hidden");
            input.attr("name","cityId");
            input.attr("value",$scope.cityId);
            form.append(input);
        }
        if($scope.countyId != "" && $scope.cityId != null){
            var input1=$("<input>");
            input1.attr("type","hidden");
            input1.attr("name","countyId");
            input1.attr("value",$scope.countyId);
            form.append(input1);
         }
        var input2=$("<input>");
        input2.attr("type","hidden");
        input2.attr("name","code");
        input2.attr("value",$scope.code);
        form.append(input2);
        
        var input3=$("<input>");
        input3.attr("type","hidden");
        input3.attr("name","accountName");
        input3.attr("value",$scope.accountName);
        form.append(input3);
        
        $("body").append(form);
        form.submit();
    }
    
    /**
     * 查看详情
    */
    $scope.showDetail = function(item,flag,save){
        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.isTransFlag = true;
        $scope.tab=1;
       
        //根据经办人id查询名字
            $scope.transData={
                "instanceId": item.instanceId,
                "onlyId": item.onlyId,
                "resultStatus": item.resultStatus,
                "submitStatus": item.submitStatus,
                "contractId": item.contractId,
                "supplierIds": item.supplierIds,
                "supplierNames": item.supplierNames,
                "trusteesName": item.trusteesName, //这里的名字，是谁提交就显示谁 
                "trusteesId": item.trusteesId,
                "remark": item.remark,
                "siteEleType": item.siteEleType,
                "roomEleType": item.roomEleType,
                "towerSiteName": item.towerSiteName,
                "towerSiteCode": item.towerSiteCode,
                // "roomId": item.roomId,
                "createDate": $scope.dataChange(item.createDate),
                // "properType": item.properType,
                "roomName": item.roomName,
                // "accountName": item.accountName,
                "cityId": item.cityId,
                "countyId": item.countyId,
                "cityName": item.cityName,
                "countyName": item.countyName,
                "attachmentId":item.attachmentId,
                "addapoUserName":item.addapoUserName,
                "transEleFiles":item.transEleFiles

               
        }
         /**
         * [流转信息]
         *
         */
        basicManagerServ.getTransFlowDetails(item.instanceId).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.ApprovalZWDetails = data.data;
            })
        });

        // $scope.instanceId = item.instanceId;
        $scope.showTransEleDlog=ngDialog.open({
            template: './tw/transEleShowDetail.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'towerUpdateTransEletricityCtrl',
            scope: $scope
        });

    }


    // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showTransEleDlog.close("");
    };


    $scope.abcd = "";

    
    //获取数据-------------
    //从SYS_ZGROOM_TRANS_MID中获取需要提交到流程中的数据
    $scope.getSubmitData = function(a){
        if(a){
             $scope.params = {
                        pageSize: 15,//每页显示条数
                        pageNo: 1,// 当前页
             };
        }
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.userCity != "" && $scope.userCity != null && $rootScope.transLevel!=1){           
            angular.extend($scope.params,{
              cityId : $rootScope.userCityId    //若城市有值，则将对应的城市ID传入cityId
            
            })
        }
        console.log(123213,$scope.params)
        if($scope.userCounty != "" && $scope.userCounty != null && $rootScope.transLevel!=1){
            
            angular.extend($scope.params,{
                countyId : $rootScope.userCountyId  //若区县有值，则将对应的区县ID赋给countyId 
            
            })
         }
        
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })
         }

         angular.extend($scope.params,{
            // "cityId":$scope.cityId,
            // "countyId":$scope.countyId,
            "transLevel":$rootScope.transLevel,
            
            "resultStatus":$scope.resultStatus,
            "mobileType" : "1",//塔维标识符
            "roomName" : $scope.roomName//有可能是机房名字

        });

        console.log($scope.params)
         //获取从SYS_ZGROOM_TRANS_MID查到的真实数据
         basicManagerServ.getNeedSubmitData($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    // 跳转到新增页面
    $scope.goAddTrans=function(){
         $state.go('app.towerAddTransEletricity',{
                'status':'towerTransEle/add'
            });
    }
    
}]);


/**
 * 塔维转供电---新增页面控制器
 */
app.controller('towerAddTransEletricityCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, basicManagerServ) {
    $rootScope.auditType=-1;
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 15,//每页显示条数
        pageNo: 1,// 当前页
    };

    $rootScope.countys={};
    
    //获取需要改造的转供电列表
    $scope.getNeedTransData=function(a){
        if(a){
             $scope.params = {
                        pageSize: 15,//每页显示条数
                        pageNo: 1,// 当前页
             };
        }
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        // if($scope.userCity != "" && $scope.userCity != null){            
  //           angular.extend($scope.params,{
  //             cityId : $rootScope.userCityId //若城市有值，则将对应的城市ID传入cityId
  //           })
  //       }
   //      if($scope.userCounty != "" && $scope.userCounty != null){
   //          angular.extend($scope.params,{
   //              countyId : $rootScope.userCountyId  //若区县有值，则将对应的区县ID赋给countyId 
            // })
   //       }
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })
         }
         console.log("获取需改造的转供电列表",$scope.params);
        angular.extend($scope.params,{
            roomName:$scope.roomName
        });

        basicManagerServ.findNeedTransList($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                console.log('新增页面！！！！！！！！！！！！！！！！！！！！！')
                console.log(data)
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.needTransList = data.data.results;
            })
        });
    }
    

    //省级管理员把需要改造的站点提交到下一级经办人手中
    $scope.addNeedChangeSiteToNext=function(item){
        utils.confirm('确定要提交吗？',"",function(){
         if(item.submitStatus==3){
            utils.msg("该站点已经改造完成，请重新选择！");
            return;
         }
          if(item.submitStatus==1){
            utils.msg("该站点已经提交至下一级，请重新选择！");
            return;
         }
         if(item.submitStatus==4){
            utils.msg("请先撤销改站点或者删除改站点数据再提交!");
            return;
         }
         //后台同样需要验证，防止前台暴力更改

         //需要保存的数据存到SYS_ZGROOM_TRANS_MID中
             $scope.needChangeData = {
                    "towerSiteName":item.towerSiteName,
                    "towerSiteCode":item.towerSiteCode,
                    "roomName":item.roomName,
                    "roomEleType":item.roomEleType,
                    "siteEleType":item.siteEleType,
                    "cityId":item.cityId,
                    "cityName":item.cityName,
                    "countyId":item.countyId,
                    "countyName":item.countyName,
                    "onlyId":item.onlyId,//唯一id
                    "siteName":item.siteName,
                    "submitStatus":item.submitStatus
             }

             basicManagerServ.addNeedChangeSiteToNext($scope.needChangeData).success(function(data){
                //跳转刷新
                 utils.ajaxSuccess(data,function(data){
                         // $rootScope.selectedMenu = $rootScope.menu[1].child[3].id; // 選中效果
                         $state.go('app.towerTransEletricityInfo',{
                             'status':'towerTransEletricity/info'
                         },{reload:true});
                 });
            });
     
            
        });

    }
    
    
 
}]);


/**
 *转供电---修改和查看数据控制器
 */
app.controller('towerUpdateTransEletricityCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, basicManagerServ) {
 

    //分页用
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

       //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }


     //选择供应商弹框
    $scope.openChoiceSupply=function(flagSave){
        //判断修改或查看
        if(flagSave){
            return;
        }   
     
        $scope.choiceSupplyDialog=ngDialog.open({
            template: './tw/transSupplyDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1200,
            scope: $scope,
        });
    }
    //选择供应商
     $scope.choiceSupply=function(item){
        console.log("item",item);
        console.log($scope.transData);
        $scope.transData.supplierNames=item.name;
        $scope.transData.supplierIds=item.code;

        console.log("1222222222"+$scope.transData);
        

        $scope.closeDialog('choiceSupplyDialog')
    }

        //  "id": "1234",
        // "name": "杨洪东（南充）",
        // "code": 115462,
        // "organizationCode": 99,
        // "ouName": "南充分公司",
        // "vendorCode": "101080",
        // "address": "四川省南充市南部县柳树人民街5号",
        // "bankBranchName": "中国邮政储蓄银行股份有限责任公司南部县升钟镇柳树支行",
        // "bankNum": null,
        // "accountName": null,
        // "regionCode": "143559",
        // "contractId": null

    //搜索词初始化
      $scope.key = {word:""};
    //获取供应商列表，暂时不做区县隔离
    $scope.getSupplyData=function(a){
        word = $scope.key.word;
        if(a){
             $scope.params = {
                pageSize: 15,//每页显示条数
                pageNo: 1,// 当前页
             };
        }
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })
         }
         console.log($scope.params);

        angular.extend($scope.params,{
            // cityId:$scope.cityId,    //市id
            // countyId:$scope.countyId,    //区县id

            name:word,
            // organizationCode:$scope.organizationCode

        });



        //查找所有供应商数据
        basicManagerServ.findSupplyByPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.supplyList = data.data.results;
            })
        });
    }


















     //预览的url
    $scope.getObjectURL = function(file) {
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file[0]) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file[0]) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file[0]) ;
        }
        return url ;
    }



    // 继续上传框
    $scope.uploadFile = function() {
        $scope.tabUpload=1;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/uploadTrans.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    };


    $scope.files = [];
    // 上传
    $scope.change = function(ele){
        $scope.files = ele.files;
        $scope.fileName = $scope.files[0].name;
        var extStart=$scope.fileName.lastIndexOf(".");
        $scope.extt="";
        var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
        $scope.extt=ext;
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|xls|XLS|xlsx|XLSX|doc|DOC|zip|ZIP)$/.test(ext)){
            utils.msg("请上传类型必须是.gif,jpeg,jpg,png,xls,xlsx,doc,zip,ZIP中的一种");
            return;
        }else {
            
            if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ext)){
                 var objUrl = $scope.getObjectURL($scope.files);
                 $(".preview-box").attr("src",objUrl);
                 $scope.$apply();
            }else{
                var objUrl = $scope.getObjectURL($scope.files);
                $(".preview-box").hide();
                $("[class='upload-info']").append($scope.fileName);
                $scope.$apply();
            }
           
        }

    }

       $scope.uploadFiles = [];    //已上传的文件

    

      // 上传发送
    $scope.uploadType = function(){
        if($scope.files.length == 0 || $scope.files == null){
            utils.msg("请上传文件！");
            return;
        }
        var base_url = CONFIG.BASE_URL;
        var formData = new FormData($( "#uploadForm" )[0]);
        $.ajax({
            url:base_url+'/fileOperator/fileUploadTowerTrans.do',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                if (data.code==200) {
                    layer.alert(data.message, {
                        icon:1,
                        time:2000,
                        btn:[],
                    });
                    $scope.uploadFileDialog.close("");
                    // 上傳成功后清空数据
                    $scope.files = [];
                }
                for(var key in data.data){
                    console.log(key)
                    $scope.uploadFilesDetails = {
                        "id":"",
                        "upName":"",
                        "ext":$scope.extt,
                    }
                    $scope.uploadFilesDetails.id = key;
                    $scope.uploadFilesDetails.upName = data.data[key];
                    // $scope.resultData.attachmentId.push(key);
                    // $scope.fileNameImg = data.data[key];
                }
                $scope.uploadFiles.push($scope.uploadFilesDetails);
                console.log($scope.uploadFiles)
            }
        });
    }

        //查看上传的文件,保存时
    $scope.showDetailFiles = function(item){
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test($scope.extt)){
            var showUrl = base_url+'/fileOperator/fileDownLoadTowerTrans.do?fileID='+item.id;
            $scope.showUrls = showUrl;
            $scope.uploadFileDialog=ngDialog.open({
                template: './tpl/uploadTrans.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                width: 750,
                scope: $scope,
            });
        }else{
            /*var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id+"&download="+"down";*/
             var URL= base_url+'/fileOperator/fileDownLoadTowerTrans.do?fileID='+item.id+"&download="+"down";
                var form=$("<form>");
                form.attr("style","display:none");
                form.attr("target","");
                form.attr("method","post");
                form.attr("action",URL);
                /*var input=$("<input>");
                input.attr("type","hidden");
                input.attr("name","fileName");
                input.attr("value","白名单导入模板");*/
                $("body").append(form);
                /*form.append(input);*/
                form.submit();
        }
       /* var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id;*/
        /*$scope.showUrls = showUrl;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/upload.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });*/
    }


    //查看附件中的文件
    $scope.showDetailFiles2 = function(item){
        console.log(item)
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        if(/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(item.ext)){
            var showUrl = item.filepath;
            console.log(showUrl)
            $scope.showUrls = showUrl;
            $scope.uploadFileDialog=ngDialog.open({
                template: './tpl/uploadTrans.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                width: 750,
                scope: $scope,
            });
        }else{
            console.log(11)
            /*var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id+"&download="+"down";*/
             var URL= base_url+'/fileOperator/fileDownLoadTowerTrans.do?fileID='+item.id+"&download="+"down";
                var form=$("<form>");
                form.attr("style","display:none");
                form.attr("target","");
                form.attr("method","post");
                form.attr("action",URL);
                /*var input=$("<input>");
                input.attr("type","hidden");
                input.attr("name","fileName");
                input.attr("value","白名单导入模板");*/
                $("body").append(form);
                /*form.append(input);*/
                form.submit();
        }
       /* var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id;*/
        /*$scope.showUrls = showUrl;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/upload.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });*/
    }


    // 删除对应上传的图片
    $scope.deleteFiles = function(index){
        $scope.uploadFiles.splice(index,1);
    }






        //保存修改信息
    // $scope.saveTransInfo=function(){
    //     var check = $scope.newObject;
    //     if( !check|| !check.damageNum || !check.damageDate || !check.damageInnerNum
    //         || !check.status || !check.belongAccount || !check.currentReadingStr || !check.reimbursementDateStr)
    //     {
    //         utils.msg("带'*'为必填项");
    //         return;
    //     }



    //      commonServ.saveOrUpdateMeter($scope.newObject).success(function(data){
    //          utils.ajaxSuccess(data,function(data){
    //              $scope.closeDialog('changeDialog')
    //              $scope.params.pageNo=1;
    //              $scope.getData();
    //          })
    //      });
    // }


        $scope.saveTransInfo=function(){
            $scope.resultData = {
                 "instanceId": $scope.transData.instanceId,
                "onlyId": $scope.transData.onlyId,
                "resultStatus": $scope.transData.resultStatus,
                "submitStatus": $scope.transData.submitStatus,
                "contractId": $scope.transData.contractId,
                "supplierIds": $scope.transData.supplierIds,
                "supplierNames": $scope.transData.supplierNames,
                "trusteesName": $scope.transData.trusteesName, //这里的名字，是谁提交就显示谁 
                "trusteesId": $scope.transData.trusteesId,
                "remark": $scope.transData.remark,
                "siteEleType": $scope.transData.siteEleType,
                "roomEleType": $scope.transData.roomEleType,
                "towerSiteName": $scope.transData.towerSiteName,
                "towerSiteCode": $scope.transData.towerSiteCode,
                // "roomId": $scope.transData.roomId,
                "createDate": $scope.dataChange($scope.transData.createDate),
                // "properType": $scope.transData.properType,
                "roomName": $scope.transData.roomName,
                // "accountName": $scope.transData.accountName,
                "cityId": $scope.transData.cityId,
                "countyId": $scope.transData.countyId,
                "cityName": $scope.transData.cityName,
                "countyName": $scope.transData.countyName,
                "attachmentId":$scope.transData.attachmentId?$scope.transData.attachmentId: ""//附件id
            }
            console.log($scope.resultData)
            if($scope.transData.supplierNames==null || $scope.transData.supplierNames=="") {
                utils.msg("请选择供应商");
                return;
            }
            // for(var i=0; i<$scope.singleDetail.watthourMeterVOs.length; i++){
            //     if($scope.singleDetail.watthourMeterVOs[i].whetherMeter == "是") {
            //         $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "1";
            //     }else {
            //         $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "0";
            //     }
            // }
            
            // if($scope.singUploadFiles){
            //     for(var fileId=0; fileId < $scope.singUploadFiles.length; fileId++){
            //         $scope.resultData.attachmentId.push($scope.singUploadFiles[fileId].id);
            //     }
            // }
            if($scope.transData.attachmentId==null){
               $scope.transData.attachmentId=[];//需要初始化一遍 
            }
            // 附件信息
            if($scope.uploadFiles.length > 0){
                for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                    console.log($scope.uploadFiles)
                    $scope.transData.attachmentId.push($scope.uploadFiles[fileId].id);
                }
            }
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.transData && $scope.transData.remark && $scope.transData.remark.length && $scope.transData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
            if($scope.transData.remark==null ||$scope.transData.remark.length<0){
                utils.msg("请输入备注！");
                return;
            }
           
       
      

            basicManagerServ.saveTransInfo($scope.transData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                     $scope.closePage();
                     // $rootScope.selectedMenu = $rootScope.menu[1].child[3].id;  // 選中效果
                     $state.go('app.towerTransEletricityInfo',{
                                'status':'towerTransEletricity/info'
                         },{reload:true});
                });
            });
        }



   

}]);





















/**********************************************塔维转供电结束*******************************************************************/


/**
*
*  基础数据----额定功率标杆管理
*/

app.controller('towerRMSBenchmarkCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', '$http','basicManagerServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, $http, basicManagerServ) {
		
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 20,//每页显示条数
        pageNo: 1,// 当前页
    };
    $scope.list=[];

    $rootScope.countys={};
    //获取列表
    $scope.getData=function(a){
    	if(a){
    		$scope.params = {
    		        pageSize: 20,//每页显示条数
    		        pageNo: 1,// 当前页
    		    };
    	}
    	
    	 delete $scope.params.countyId;
         delete $scope.params.cityId;
         if($scope.cityId != "" && $scope.cityId != null){
             angular.extend($scope.params,{
               cityId : $scope.cityId
             })
         }
         if($scope.countyId != "" && $scope.cityId != null){
             angular.extend($scope.params,{
                 countyId : $scope.countyId
             })  
          }
         
    	angular.extend($scope.params,{
        	"towerNum":$scope.towerNum,   //铁塔站址编号
            "resName":$scope.resName,     //资管站名
        })

        delete $scope.params.page;
        basicManagerServ.findPowerRateByPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }


    //查看详情
    $scope.showDetail=function(item){
    	
        basicManagerServ.queryPowerRatingDetail(item.towerId).success(function(data){
            utils.loadData(data,function(data){
            	$scope.object = data.data;
                 
                //     // $scope.subList=[] //
            })
        });


        $scope.showDetailDialog=ngDialog.open({
            template: './tw/rateowerinfoDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

    }


    //关闭查看详情
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    };
    
    //额定功率数据导入excel
    $scope.powerRateExports = function() {   
		
		//额定功率导入uri
		var URL = basicManagerServ.powerRateImport();
        var file = document.querySelector('input[type=file]').files[0];
        if(file==null){
            utils.msg("请选择文件!");
            return;
        }
        if(!file){
            return;
        }
        var index1=file.name.lastIndexOf(".");
        var index2=file.name.length;
        var suffix=file.name.substring(index1+1,index2);//后缀名

        if(suffix!="xlsx"){
            utils.msg("请选择文件.xlsx文件文件后缀必须为小写");
            return;
        }
        var fd = new FormData();
        fd.append('file', file); 
         $http({
              method:'POST',
              url:URL,
              data: fd,
              headers: {'Content-Type': undefined},
              transformRequest: angular.identity 
               })
               .success( function (data){
            	   var other = data.data!=null?data.data:'OK';
                    var msg="额定功率数据--导入成功!"+other;
                if(data.code!=200){
                	var other = data.data!=null?data.data:'';
                    var msg="额定功率数据--导入失败!"+other;
                }
                utils.confirm('信息:',msg,function(){
              	  utils.ajaxSuccess(200,function(data){
              	  	});
              });
//                utils.msg(msg);
           });
     };
     
     
     //下载excle模板
     $scope.downLoadRate = function(){
    	 
    	 var Url=basicManagerServ.downLoadURI();
    	 
    	 var form = $("<form>");
    	 form.attr("method","post");
    	 form.attr("action",Url);
    	 form.attr("style","display:none");
    	 var input = $("<input>");
    	 input.attr("type","hidden");
    	 input.attr("name","fileName");
    	 input.attr("value","额定功率数据(模板)");
    	 $("body").append(form);
    	 form.append(input);
    	 form.submit();
    	 
     };
     
     

}]);


/**
*
*  基础数据----智能电表标杆管理
*/


/**
*
*  基础数据----开关电源标杆管理
*/



/**
*
*  基础数据维护----合同信息管理   TODO Excel导入 错误校验待进行
*/

app.controller('towerContractInfoCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, basicManagerServ) {
        
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 20,//每页显示条数
        pageNo: 1,// 当前页
    };
    
    $rootScope.countys={};
    //获取列表
    $scope.getData=function(a){
    	if(a){
    		 $scope.params = {
    			        pageSize: 20,//每页显示条数
    			        pageNo: 1,// 当前页
    			    };
    		
    	}
    	
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })  
         }
         console.log($scope.params);
        angular.extend($scope.params,{
            "code":$scope.code,            //铁塔站址编号
            "label":$scope.label,         //资管站名
            "zyName":$scope.zyName,
        })

        delete $scope.params.page;
        basicManagerServ.queryContractPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    // 时间戳转换
    $scope.dataChange=function(time){
            var date = new Date(time);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate() < 10 ? '0' + date.getDate(): date.getDate());
            // var h = date.getHours() + ':';
            // var m = (date.getMinutes() < 10 ? '0'+ date.getMinutes(): date.getMinutes()) +':';
            // var s = date.getSeconds() < 10 ? '0'+ date.getSeconds():date.getSeconds(); 
            var times = Y+M+D; 
            return times;  
    }
    
    //查看单条合同
    $scope.showDetail=function(item,flag,btn){

        $scope.disabled=flag;false
        $scope.queryDetail = btn;true
        $scope.save = flag;

        basicManagerServ.querySingleContractPage(item.id).success(function(data){
            utils.loadData(data,function(data){
                $scope.object = data.data;
                if($scope.disabled) {
                     // 是否包干
                    if($scope.object.isClud == 0){
                        $scope.object.isClud = '不包干';
                    }else {
                        $scope.object.isClud = '包干';
                    }
                    // 缴费周期
                    if($scope.object.paymentCycle == 1){
                        $scope.object.paymentCycle = '月';
                    }else if($scope.object.paymentCycle == 3){
                        $scope.object.paymentCycle = '季度';
                    }else if($scope.object.paymentCycle == 6){
                        $scope.object.paymentCycle = '半年';
                    }else if($scope.object.paymentCycle == 12){
                        $scope.object.paymentCycle = '年';
                    }
                }
                // 合同生效终止日期
                $scope.object.startDate = $scope.dataChange($scope.object.startDate);
                $scope.object.endDate =  $scope.dataChange($scope.object.endDate);

                $scope.showDetailDialog=ngDialog.open({
                    template: './tw/addcontractinfo.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    width: 600,
                    scope: $scope,
                });

                // 保存修改合同信息
               /* $scope.saveContractInfo = function(contractInfo){
                    basicManagerServ.editedContractPage(contractInfo).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.showDetailDialog.close("");
                            $scope.params.pageNo=1;
                            $scope.getData();
                        });
                    })
                }*/

            });   
        });

        
    }
    
    
    //修改单条合同
    $scope.modeflyDetail=function(item){
    	
        basicManagerServ.querySingleContractPage(item.id).success(function(data){
            utils.loadData(data,function(data){
                $scope.object = data.data;
                
                // 合同生效终止日期
                $scope.object.startDate = $scope.dataChange($scope.object.startDate);
                $scope.object.endDate =  $scope.dataChange($scope.object.endDate);
       
                $scope.showDetailDialog=ngDialog.open({
                    template: './tw/modifyContractInfo.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    width: 600,
                    scope: $scope,
                });

                // 保存修改合同信息
                $scope.saveContractInfo = function(contractInfo){
                	
                	
                    basicManagerServ.editedContractPage(contractInfo).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.showDetailDialog.close("");
                            $scope.params.pageNo=1;
                            $scope.getData();
                        });
                    })
                }

            });   
        });
    }
    
    
    //关闭查看详情
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    };

    // 删除合同
    $scope.deleteContract = function(item){
        utils.confirm('确定要删除吗？',"",function(){
            basicManagerServ.modifyContractPage(item.id).success(function(data){
                utils.ajaxSuccess(data,function (data){
                    $scope.params.pageNo=1;
                    $scope.getData();
                });   
            });
        });
    }

}]);


/**
*
*  基础数据维护----供电信息管理   TODO 错误校验待进行
*/

app.controller('towerEletricityInfoCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, basicManagerServ) {
        
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 20,//每页显示条数
        pageNo: 1,// 当前页
    };
    
    $rootScope.countys={};
    //获取列表
    $scope.getData=function(a){
    	if(a){
    		 $scope.params = {
    			        pageSize: 20,//每页显示条数
    			        pageNo: 1,// 当前页
    			    };
    	}
    	
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })  
         }
         console.log($scope.params);
        angular.extend($scope.params,{
            "code":$scope.code,            //铁塔站址编号
            "label":$scope.label,         //资管站名
        })
        
        basicManagerServ.queryPowerPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    // 修改供电信息
    $scope.editedPower = function(item){
        basicManagerServ.querySinglePowerPage(item.id).success(function(data){
            utils.loadData(data,function(data){
                $scope.object = data.data;
                $scope.showDetailDialog=ngDialog.open({
                    template: './tw/addproelectricityinfoDialog.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    width: 540,
                    scope: $scope,
                });
                // 保存修改后的供电信息
                $scope.saveEditedPowerInfo = function(powerInfo){
                    delete powerInfo.countyId;
                    delete powerInfo.code;
                    delete powerInfo.cityStr;
                    delete powerInfo.cityId;
                    delete powerInfo.updateTime;
                    delete powerInfo.countyStr;
                    delete powerInfo.label;
                    basicManagerServ.editedPower(powerInfo).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.showDetailDialog.close("");
                            $scope.params.pageNo=1;
                            $scope.getData();
                        });
                    })

                }
            });   
        });
    }
   

    // 删除供电信息
    $scope.deletePower = function(item){

        utils.confirm('确定要删除吗？',"",function(){
            basicManagerServ.deletedPowerPage(item.id).success(function(data){
                utils.ajaxSuccess(data,function (data){
                    $scope.params.pageNo=1;
                    $scope.getData();
                });   
            });
        });
    }
    
    //关闭窗口
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    };
    
    //导出供电信息
    $scope.supplierExportExcel=function(){   	
	var URL=basicManagerServ.supplierExportExcel();
	 alert("数据加载中,请耐心等待,勿重复点击!!");	
	var form=$("<form>");
	form.attr("style","display:none");
	form.attr("target","");
	form.attr("method","post");
	form.attr("action",URL);
	var input=$("<input>");
	input.attr("type","hidden");
	input.attr("name","fileName");
	input.attr("value","供电信息");
	$("body").append(form);
	form.append(input);
	form.submit();
	
    	
    /*	basicManagerServ.supplierExportExcel().success(function (data) {    		   		
    		for(var i=0;i<data.data.length;i++){
    			data.data[i].code="Encode:    "+data.data[i].code;   			
    			 if(data.data[i].electricityType == 1){
    				 data.data[i].electricityType = "直供电";
    	            }else if(data.data[i].electricityType == 2){
    	            	data.data[i].electricityType = "转供电";
    	            }else {
    	            	data.data[i].electricityType = "";
    	            }
    			 if(data.data[i].shareType == 1){
    				 data.data[i].shareType = "共享";
    	            }else if(data.data[i].shareType == 2){
    	            	data.data[i].shareType = "独享";
    	            }else {
    	            	data.data[i].shareType = "";
    	            }
    			 if(data.data[i].updateTime==null){
    				 data.data[i].updateTime=""; 
    			 }else{
    			data.data[i].updateTime=$scope.dataChange(data.data[i].updateTime);
    			 }
    		}
              utils.loadData(data,function (data) {
            		$scope.lists=data.data;
              })
    		
    	});
    	alert("页面加载中,请等待。。。");
		   $scope.supplierExportDialog=ngDialog.open({
	            template: './tw/supplierExportDialog.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
	           width: 1200,	        
	            scope: $scope
				}); */
		   
    } 
    
    //导出excle(供电信息)-弃用
	 $scope.supplierExcel=function(){
		
		event.preventDefault();
       var BB = self.Blob;
       var contentStr = document.getElementById("supplierDetails").innerHTML;   //内容
       var fileNmae='供电信息.xlsx';
       saveAs(
         new BB(
             ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
           , { type: "applicationnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
       ) , fileNmae);
		
	} 
    
	 // 时间戳转换
	    $scope.dataChange=function(time){
	        var date = new Date(time);
	        var Y = date.getFullYear() + '-';
	        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	        var D = (date.getDate() < 10 ? '0' + date.getDate(): date.getDate());
	        // var h = date.getHours() + ':';
	        // var m = (date.getMinutes() < 10 ? '0'+ date.getMinutes(): date.getMinutes()) +':';
	        // var s = date.getSeconds() < 10 ? '0'+ date.getSeconds():date.getSeconds();
	        var times = Y+M+D;
	        return times;
	    }
	 
	//关闭弹出框 
	    $scope.closeDialog=function(dialog){
	        $scope[dialog].close("");
	        $scope.getData();
	    }
	 
}]);


/**
*
*  基础数据维护----发票信息管理   TODO 错误校验待进行
*/

app.controller('towerInvoiceInfoCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, basicManagerServ) {
        
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 20,//每页显示条数
        pageNo: 1,// 当前页
    };
    
    $rootScope.countys={};
    
    //获取列表
    $scope.getData=function(a){
    	if(a){
    		 $scope.params = {
    			        pageSize: 20,//每页显示条数
    			        pageNo: 1,// 当前页
    			    };
    	}
        angular.extend($scope.params,{
            "billType":$scope.billType            //发票类型
        })
//        delete $scope.params.page;
        basicManagerServ.queryInvoicePage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    // 修改发票信息
    $scope.editedInvoice = function(item){
        if(item != null) {    //修改
            $scope.editInvoic=true;
            $scope.addInvoic=false;
            $scope.btnEdit=true;
            $scope.btnInvoice=false;
            // $scope.btnSave=false;
            basicManagerServ.querySingleInvoicePage(item.id).success(function(data){
                utils.loadData(data,function(data){
                    $scope.object = data.data;
                    $scope.showDetailDialog=ngDialog.open({
                        template: './tw/addinvoiceDialog.html?time='+new Date().getTime(),
                        className: 'ngdialog-theme-default ngdialog-theme-custom',
                        width: 540,
                        scope: $scope,
                    });
                    // 保存修改后的发票信息
                    $scope.editedInvoiceInfo = function(invoiceInfo){
                        delete invoiceInfo.createDate;
                        delete invoiceInfo.count;
                        basicManagerServ.editedInvoicePage(invoiceInfo).success(function(data){
                            utils.ajaxSuccess(data,function(data){
                                $scope.showDetailDialog.close("");
                                $scope.params.pageNo=1;
                                $scope.getData();
                            });
                        })
                    }
                });   
            });
        }else {    // 新增
            $scope.editInvoic=false;
            $scope.addInvoic=true;
            $scope.btnEdit=false;
            $scope.btnInvoice=true;
            $scope.editInvoicDetail={
                "billType":$scope.billType,                 //发票类型
                "billTax":$scope.billTax,                   //税率  
                "billCoefficient":$scope.billCoefficient,   //开票系数
            }
            
            $scope.showDetailDialog=ngDialog.open({
                template: './tw/addinvoiceDialog.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                width: 540,
                scope: $scope,
            });
            // // 新增发票信息
            $scope.saveInvoiceInfo = function(){
                basicManagerServ.editedInvoicePage($scope.editInvoicDetail).success(function(data){
                    utils.ajaxSuccess(data,function(data){
                        $scope.showDetailDialog.close("");
                        $scope.params.pageNo=1;
                        $scope.getData();
                    });
                })
            }
           
        }
    }
    
    // 删除发票信息
    $scope.deleteInvoice = function(item){

        utils.confirm('确定要删除吗？',"",function(){
            basicManagerServ.modifyInvoicePage(item.id).success(function(data){
                utils.ajaxSuccess(data,function (data){
                    $scope.params.pageNo=1;
                    $scope.getData();
                });   
            });
        });
    }
    
    //关闭查看详情
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    };
    
}]);


/**
*
*  基础数据维护----额定功率管理   TODO 错误校验待进行
*/

app.controller('towerRMSCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, basicManagerServ) {
        
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 20,//每页显示条数
        pageNo: 1,// 当前页
    };
    
    $rootScope.countys={};
    
    //获取列表
    $scope.getData=function(a){
    	if(a){
   		 $scope.params = {
   			        pageSize: 20,//每页显示条数
   			        pageNo: 1,// 当前页
   			    };
    	}

        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })  
         }
         console.log($scope.params);
        angular.extend($scope.params,{
            "deviceType":$scope.deviceType,            //设备类型
            "deviceModel":$scope.deviceModel,         //设备型号
        })
      

        basicManagerServ.queryRMSPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    // 修改额定功率
    $scope.editedRMS = function(item){
    	
        basicManagerServ.querySingleRMSPage(item.id).success(function(data){
            utils.loadData(data,function(data){
                $scope.object = data.data;
                $scope.showDetailDialog=ngDialog.open({
                    template: './tw/addrateDialog.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    width: 540,
                    scope: $scope,
                });
                // 保存修改后的额定功率
                $scope.saveEditedRMSInfo = function(rmsInfo){
                    delete rmsInfo.updateDate;
                    delete rmsInfo.cityId;
                    delete rmsInfo.countyId;
                    basicManagerServ.editedRMS(rmsInfo).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.showDetailDialog.close("");
                            $scope.params.pageNo=1;
                            $scope.getData();
                        });
                    })

                }
            });   
        });
    }
    

    $scope.downRateExcelGo=function(){
		event.preventDefault();
        var BB = self.Blob;
        var contentStr = document.getElementById("exportable").innerHTML;   //内容
        var fileNmae='额定功率.xls';
        saveAs(
          new BB(
              ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
            , { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
        ) , fileNmae);
	}

    // 删除额定功率
    $scope.deleteRMS = function(item){

        utils.confirm('确定要删除吗？',"",function(){
            basicManagerServ.deletedRMSPage(item.id).success(function(data){
                utils.ajaxSuccess(data,function (data){
                    $scope.params.pageNo=1;
                    $scope.getData();
                });   
            });
        });
    }
    
    //关闭查看详情
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    };
    
    

}]);






/**
 * 维护数据修改管理
 */
app.controller('towerMainTainDataCtrl', ['lsServ',  '$rootScope', '$scope', '$filter', '$state', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $filter, $state, ngDialog, utils, basicManagerServ) {

    $rootScope.auditType=-1;
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 15,//每页显示条数
        pageNo: 1,// 当前页
    };

    $rootScope.countys={};
    //获取列表
    $scope.getData=function(){
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })
         }
         console.log($scope.params);
        angular.extend($scope.params,{
            "changeType":$scope.changeType,      // 修改类型
            "applyUserName":$scope.applyUserName,// 申请人姓名
            "mobileType":"1",//塔维识别符
        })

        basicManagerServ.dataModifyApply($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    // 审批
    $scope.bachSubmit = function(instanceId, approveState) {
        basicManagerServ.approvalDataModify({"instanceId":instanceId,approveState:approveState}).success(function(data) {
             utils.ajaxSuccess(data,function(data){

                $scope.params.pageNo=1;
                $scope.getData();
            })
        })
    }

    // 查看维护数据详情(要修改的数据)

    $scope.showDetail= function(item) {

            basicManagerServ.queryDetailDialog(item.aataModifyApply.id).success(function (data) {

            utils.loadData(data,function (data) {
                // console.log(data);
                $scope.object = data.data;
                console.log("object",angular.toJson($scope.object,true));

            })
        });


         $scope.showDetailDialog=ngDialog.open({
            template: './tpl/queryMaintainDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });

    }

    $scope.closeDialog = function() {
        $scope.showDetailDialog.close();
    }



    // 驳回维护








    //     // 电表信息

    //     commonServ.queryElectrictyAmount(item.meterId).success(function (data) {

    //         utils.loadData(data,function (data) {
    //             // console.log(data);
    //             $scope.object = data.data;
    //             $scope.ovn = data.data.cityName;
    //             console.log("object",angular.toJson($scope.object,true));

    //         })
    //     });


    //     $scope.showDetailDialog=ngDialog.open({
    //         template: './tpl/addOwnerDiao.html?time='+new Date().getTime(),
    //         className: 'ngdialog-theme-default ngdialog-theme-custom',
    //         width: 800,
    //         scope: $scope,
    //     });

    // }




    // //关闭查看详情
    // $scope.closeDialog=function(){
    //     $scope.showDetailDialog.close("");

    // };



}]);





/**
*
*  基础数据维护----其他信息管理   TODO 错误校验待进行
*/

app.controller('towerAdditionalInfoCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'basicManagerServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, basicManagerServ) {
        
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 20,//每页显示条数
        pageNo: 1,// 当前页
    };
    
    $rootScope.countys={};

    //获取列表
    $scope.getData=function(a){
    	
    	if(a){
   		 $scope.params = {
   			        pageSize: 20,//每页显示条数
   			        pageNo: 1,// 当前页
   			    };
    	}
        delete $scope.params.countyId;
        delete $scope.params.cityId;
        if($scope.cityId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
              cityId : $scope.cityId
            })
        }
        if($scope.countyId != "" && $scope.cityId != null){
            angular.extend($scope.params,{
                countyId : $scope.countyId
            })  
         }
         console.log($scope.params);
        angular.extend($scope.params,{
            "code":$scope.code,            //铁塔站点编码
            "name":$scope.name,            //铁塔站址名称
            "label":$scope.label,         //资管站点名称
        })

        basicManagerServ.queryAdditionalInfoPage($scope.params).success(function (data) {
        	
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    // 修改其他信息
    $scope.editedOther = function(item){
        basicManagerServ.querySingleAdditionalInfoPage(item.id).success(function(data){
            utils.loadData(data,function(data){
                $scope.object = data.data;
                $scope.showDetailDialog=ngDialog.open({
                    template: './tw/addotherinfoDialog.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    width: 540,
                    scope: $scope,
                });
                // 保存修改后的其他信息
                $scope.saveEditedOtherInfo = function(otherInfo){
                    delete otherInfo.updateDate;
                    delete otherInfo.cityId;
                    delete otherInfo.countyId;
                    basicManagerServ.editedAdditionalInfo(otherInfo).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.showDetailDialog.close("");
                            $scope.params.pageNo=1;
                            $scope.getData();
                        });
                    })

                }
            });   
        });
    }

    // 删除其他信息
    $scope.deleteOther = function(item){

        utils.confirm('确定要删除吗？',"",function(){
            basicManagerServ.deletedAdditionalInfoPage(item.id).success(function(data){
                utils.ajaxSuccess(data,function (data){
                    $scope.params.pageNo=1;
                    $scope.getData();
                });   
            });
        });
    }
    
    //关闭查看详情
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    };
    

}]);


/**
 * 数据导入TODO
 */
app.controller('towerInputDataCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', '$http','basicManagerServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, $http, basicManagerServ) {

   //数据导入
	$scope.excelExports = function() {   
		
		//塔维站点导入
        var URL = basicManagerServ.towerSiteImport();
        var file = document.querySelector('input[type=file]').files[0];
        if(file==null){
            utils.msg("请选择文件!");
            return;
        }
        if(!file){
            return;
        }
        var index1=file.name.lastIndexOf(".");
        var index2=file.name.length;
        var suffix=file.name.substring(index1+1,index2);//后缀名

        if(suffix!="xlsx"){
            utils.msg("请选择文件.xlsx文件文件后缀必须为小写");
            return;
        }
        var fd = new FormData();
        fd.append('file', file); 
         $http({
              method:'POST',
              url:URL,
              data: fd,
              headers: {'Content-Type': undefined},
              transformRequest: angular.identity 
               })
               .success( function (data){
            	   var other = data.data!=null?data.data:'OK';
                    var msg="塔维站点数据--导入成功!"+other;
                if(data.code!=200){
                	var other = data.data!=null?data.data:'';
                    var msg="塔维站点数据--导入失败!"+other;
                }
                utils.confirm('信息:',msg,function(){
                	  utils.ajaxSuccess(200,function(data){
                	  	});
                });
//                utils.msg(msg);
           }); 

     };
  
	

  //下载自维excel 模板   
    $scope.downDownDemo = function() {
    	
    	var URL=basicManagerServ.downLoadURI();
    	
    	var form=$("<form>");
		form.attr("style","display:none");
		form.attr("target","");
		form.attr("method","post");
		form.attr("action",URL);
		var input1=$("<input>");
		input1.attr("type","hidden");
		input1.attr("name","fileName");
		input1.attr("value","塔维基础数据(模板)");
		$("body").append(form);
		form.append(input1);
		form.submit();
    	 
    };
    
    
   



    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    //获取列表
   /* $scope.getData=function(){
        commonServ.getlogList($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.list=data;
            })
        });
    }*/




    /**
     * 查看
     */
   /* $scope.showDetail=function(item){


        $scope.SubmitDialog=ngDialog.open({

            template: './tpl/viewElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });

    }*/


    $scope.closeDialog=function(){

        $scope.SubmitDialog.close("");
    }




}]);

