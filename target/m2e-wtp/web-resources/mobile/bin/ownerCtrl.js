/**
 * Created by issuser on 2017/4/25.
 */

/**
 * 业主信息管理
 */
app.controller('ownerManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {


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
    
    $rootScope.countys={};

    //获取列表
    $scope.getData=function(a){
    	if(a){
     		 $scope.params = {
     			        pageSize: 10,//每页显示条数
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
            "vague":$scope.vague
        })

        commonServ.queryOwnerInfoPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
                console.log(data);
            })
        });
    }


    $scope.resultData={

        "ownerId":$scope.ownerId,
        "cityId":$scope.cityId,
        "countyId":$scope.countyId,
        "ownerName":$scope.ownerName,            //业主名称
        "bankName": $scope.bankName,            //业主开户银行
        "bankAccount": $scope.bankAccount,         //业主账号
        "supplier": $scope.supplier,            //供应商
        "useCompany": $scope.useCompany,          //用电协议单位
        "startTimeStr": $scope.startTimeStr,        //用电协议起始日期(yyyy-MM-dd)
        "endTimeStr": $scope.endTimeStr,          //用电协议终止日期(yyyy-MM-dd)
        "price": $scope.price,               //用电协议单价
        "meterList":[]                     	//电表信息

    }

    // 电表信息
    $scope.electrictyInfo = [];


    // 查看业主详情
    $scope.queryOwnerInfoDetal=function(item){
        commonServ.queryOwnerInfoDetal(item.ownerId).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.OwnerInfo = data.data;
                $scope.electricInfo = data.data.meterList;

            })
        });

        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/queryOwnerDiao.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });
        
    }

 
    // 新增业主弹出框
    $scope.addOwnerInfoDetal=function(){
    		$scope.resultData={
    				
    		        "ownerId":"",
    		        "cityId":"",
    		        "countyId":"",
    		        "ownerName":"",            //业主名称
    		        "bankName": "",            //业主开户银行
    		        "bankAccount": "",         //业主账号
    		        "supplier": "",            //供应商
    		        "useCompany": "",          //用电协议单位
    		        "startTimeStr": "",        //用电协议起始日期(yyyy-MM-dd)
    		        "endTimeStr": "",          //用电协议终止日期(yyyy-MM-dd)
    		        "price": "",               //用电协议单价
    		        "meterList":[]             //电表信息
    		    }
    	
        $scope.addOwnerInfoDialog=ngDialog.open({
            template: './tpl/addOwnerDiao.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });
       
    }


    
    // 新增/修改 -> 新增电表 '弹出框' 
    $scope.addElectricInfoDetail = function(){
    	debugger;
        $scope.electrictyInfo={
        		"meterNumber":"",
        		"meterIdentifier":"",
        		"meterAccout":"",
        		"meterType":"",
        		"meterPurpose":""
        };   

        $scope.addElectricInfoDialog=ngDialog.open({
            template: './tpl/addElecDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 600,
            scope: $scope
        });

    }

    $scope.meterId = "";
    $scope.ArrayIndex = "";//保存被修改数组元素下标
    // 修改 ->修改电表信息
    $scope.modifyElectrictySingle=function(item,index){
    	debugger;
    	$scope.ArrayIndex = index;
    		//新增-》修改restDate->meterList:电表信息
    		$scope.modifyElectricty=item;
    		
        $scope.modifyElectricDialog=ngDialog.open({
            template: './tpl/modifyElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 600,
            scope: $scope
        });

    }

    // 修改->修改电表信息->保存电表信息
    $scope.modify=function(){
    	debugger;
    		//新增-》保存meterList中电表信息unshift()
    		$scope.modelElectricInfo();
    		//根据下标($index)删除被修改的数组元素
    		$scope.resultData.meterList.splice($scope.ArrayIndex,1);
    
		 	/*utils.confirm("确定要修改吗？","",function(){
	                commonServ.updateMeter($scope.modifyElectrictyInfo).success(function (data) {
	                    utils.ajaxSuccess(data,function(data){
	                        commonServ.modifyElectrictySingle($scope.meterId).success(function (data) {
	                            utils.loadData(data,function (data) {
	                                $scope.modifyElectricty = data.data;
	                            })
	                        });
	                        $scope.closeDialog('addElectricInfoDialog');
	                        $scope.closeDialog('modifyElectricDialog');
	                        
	                    });
	                });
	        })*/

    };

    
     // 点击保存添加电表-》到业主信息里
    $scope.addElectricInfo = function(){
     debugger;
     if(!$scope.electrictyInfo.meterNumber || !$scope.electrictyInfo.meterAccout){
    	 utils.msg("带'*'为必填项");
 		return;
     }
     
        if($scope.resultData && $scope.resultData.meterList && $scope.resultData.meterList.length>=1){
            $scope.resultData.meterList.unshift({
                "meterNumber":$scope.electrictyInfo.meterNumber,           // 电表号
                "meterIdentifier":$scope.electrictyInfo.meterIdentifier,       // 电表标识符
                "meterAccout":$scope.electrictyInfo.meterAccout,  // 电表户号
                "meterType":$scope.electrictyInfo.meterType,  // 用电类型(下拉选择:直转电、转供电)
                "meterPurpose":$scope.electrictyInfo.meterPurpose  //用电用途
            })

        }else{
            $scope.resultData.meterList.unshift({
                "meterNumber":$scope.electrictyInfo.meterNumber,           // 电表号
                "meterIdentifier":$scope.electrictyInfo.meterIdentifier,       // 电表标识符
                "meterAccout":$scope.electrictyInfo.meterAccout,  // 电表户号
                "meterType":$scope.electrictyInfo.meterType,  // 用电类型(下拉选择:直转电、转供电)
                "meterPurpose":$scope.electrictyInfo.meterPurpose  //用电用途
            })
        }
        console.log($scope.resultData.meterList);
        $scope.closeDialog('addElectricInfoDialog');
       

    }
    
    // 点击保存添加电表-》到业主信息里
    $scope.modelElectricInfo = function(){
        if($scope.resultData &&　$scope.resultData.meterList && $scope.resultData.meterList.length>=1){
            $scope.resultData.meterList.unshift({
                "meterNumber":$scope.electrictyInfo.meterNumber,           // 电表号
                "meterIdentifier":$scope.electrictyInfo.meterIdentifier,       // 电表标识符
                "meterAccout":$scope.electrictyInfo.meterAccout,  // 电表户号
                "meterType":$scope.electrictyInfo.meterType,  // 用电类型(下拉选择:直转电、转供电)
                "meterPurpose":$scope.electrictyInfo.meterPurpose  //用电用途
            })
        }else{
            $scope.resultData.meterList.unshift({
                "meterNumber":$scope.electrictyInfo.meterNumber,           // 电表号
                "meterIdentifier":$scope.electrictyInfo.meterIdentifier,       // 电表标识符
                "meterAccout":$scope.electrictyInfo.meterAccout,  // 电表户号
                "meterType":$scope.electrictyInfo.meterType,  // 用电类型(下拉选择:直转电、转供电)
                "meterPurpose":$scope.electrictyInfo.meterPurpose  //用电用途
            })
        }
        console.log($scope.resultData.meterList);
        $scope.closeDialog('modifyElectricDialog');
    }
    
    $scope.checkTimeValue = function(resultData){
        if(resultData.startTimeStr && resultData.endTimeStr && resultData.startTimeStr > resultData.endTimeStr){
            utils.msg("协议终止日期须大于协议开始日期。");
            return false;
        }
    }

    $scope.checkBankAccount = function(resultData){
        if(resultData.bankAccount  && !resultData.bankAccount.replace(/\s/g,'').match(/^(\d{16}|\d{19})$/)){
           utils.msg("请输入正确格式的银行账户(16或19位数字)。");
           return false; 
        }
    }

    $scope.checkPrice = function(resultData){
        if((resultData.price || resultData.price == 0) && isNaN(parseFloat(resultData.price))){
           utils.msg("请输入数值类型的单价。");
           return false; 
        }
    }


    // 新增业主及电表信息
    $scope.addOwnerInfo = function(){
    	var resultData = $scope.resultData;
    	if(!resultData || !resultData.ownerName || !resultData.bankName || !resultData.bankAccount ||
    	!resultData.supplier || !resultData.useCompany || !resultData.startTimeStr || !resultData.endTimeStr || !resultData.price
    	){
    		utils.msg("带'*'为必填项");
    		return;
    	}
    	if(resultData.startTimeStr && resultData.endTimeStr && resultData.startTimeStr > resultData.endTimeStr){
            utils.msg("协议终止日期须大于协议开始日期。");
            return;
        }
        if(resultData.bankAccount && !resultData.bankAccount.replace(/\s/g,'').match(/^(\d{16}|\d{19})$/)){
           utils.msg("请输入正确格式的银行账户(16或19位数字)。");
           return; 
        }
        if((resultData.price || resultData.price == 0) && isNaN(parseFloat(resultData.price))){
           utils.msg("请输入数值类型的单价。");
           return; 
        }
        commonServ.addOwnerInfoDetal($scope.resultData).success(function (data) {
            utils.ajaxSuccess(data,function(data){
                console.log(data);
            });
        });
        $scope.getData();
        $scope.closeDialog('addOwnerInfoDialog');
        
    }
    
    
    // 修改业主详情
    $scope.modifyOwnerInfoDetal=function(item){
    	
        commonServ.queryOwnerInfoDetal(item.ownerId).success(function (data) {
            utils.loadData(data,function (data) {
            		
            	  $scope.resultData = data.data;
            	  $scope.resultData.meterList = data.data.meterList;
            	 
            	  $rootScope.queryCountyList($scope.resultData.cityId);
            	   
            })
        });

        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/modifyOwnerDiao.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });
        
    }

    
    // 更新业主及电表信息
    $scope.updateOwnerInfo = function(){

        var resultData = $scope.resultData;
        if(!resultData || !resultData.ownerName || !resultData.bankName || !resultData.bankAccount ||
        !resultData.supplier || !resultData.useCompany || !resultData.startTimeStr || !resultData.endTimeStr || !resultData.price
        ){
            utils.msg("带'*'为必填项");
            return;
        }
        if(resultData.startTimeStr && resultData.endTimeStr && resultData.startTimeStr > resultData.endTimeStr){
            utils.msg("协议终止日期须大于协议开始日期。");
            return;
        }
        if(resultData.bankAccount && !resultData.bankAccount.replace(/\s/g,'').match(/^(\d{16}|\d{19})$/)){
           utils.msg("请输入正确格式的银行账户(16或19位数字)。");
           return; 
        }
        if((resultData.price || resultData.price == 0) && isNaN(parseFloat(resultData.price))){
           utils.msg("请输入数值类型的单价。");
           return; 
        }
        commonServ.updateOwnerInfoDetal($scope.resultData).success(function (data) {
            utils.ajaxSuccess(data,function(data){
            	
                console.log(data);
            });
        });
        $scope.getData();
        $scope.closeDialog('showDetailDialog');
        
    }
    
    // 删除列表中业主
    $scope.deleteOwnerInfo = function(item){
        utils.confirm("确定要删除吗？","",function(){
            commonServ.deleteOwnerInfo(item.ownerId).success(function (data) {
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getData();

                });
            });
        })
    }
    // 删除电表明细中的电表信息
    $scope.deleteElectrictySingle = function(item,index){
    	
    		if(index != null){
    			//根据下标($index)删除数组中电表信息
    	       	 utils.confirm("确定要删除吗？","",function(){
    	       		 $scope.resultData.meterList.splice(index,1);
    	            })
    	    	}else{
    	    		 $scope.resultData.meterList.splice($scope.ArrayIndex,1);
    	    	}
    		}

    //关闭弹出框 
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
        $scope.getData();
    }
    

}]);
