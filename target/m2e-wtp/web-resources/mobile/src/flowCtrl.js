/**
 * Created by issuser on 2017/4/25.
 */



/**
 * 流程管理
 */
app.controller('processManageCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ) {

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
    /**
     *
     */
    //获取列表
    $scope.getData=function(){
        angular.extend($scope.params,{
            "cityStr" : $("#cityName").val() ? $("#cityName option:selected").text() : null,
            "countyStr": $("#county").val() ? $("#county option:selected").text() : null,
            "name":$scope.name,
            "type":$scope.type
        })

        commonServ.queryWorkflowPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }



    //跳转到添加或修改页面
    $scope.goAddPage=function(){
        $state.go('app.addOrUpdateWorkflow',{
            'status':'add',
            'id':'none'
        });
    }

    //跳转到修改页面
    $scope.goUpdatePage=function(item, isUpdate) {
    	if (isUpdate) {
    		$state.go('app.addOrUpdateWorkflow',{
    			'status':'update',
    			'id':item.definitionId
    		});
    	} else {
    		$state.go('app.addOrUpdateWorkflow',{
    			'id':item.definitionId
    		});
    	}
    	
    }

    //显示详情
    $scope.showDetail=function(item){

        $scope.obj=item;

        $scope.showDetailDialog=ngDialog.open({
            template: 'showDetailDialog',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 600,
            scope: $scope,
        });

    }

    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");

    };



}]);


/**
 * 添加或更新流程，转供电新增
 */
app.controller('addOrUpdateWorkflow', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

    $scope.status=$stateParams.status;
    var id=$stateParams.id;
    $scope.cityId='2';
   /* $scope.resultData={
        "type" : "mandimension",
        "name":"",
        "desc":"",
        "city":"",
        "county":"",
        "variableSetps":[
            {
                "stepName":"区县网络部经理审核",
                "type":"variable",
                "approver":"", //approver
                "index":"0"
            },
            {
                "stepName":"区县公司经理审核",
                "type":"variable",
                "approver":"", //approver
                "index":"1"
            }
        ],//
        "fixedSetps1":[{
            "stepName":"市公司网络部电费管理岗审核",
            "type":"fixed",
            "approver":"", //approver
            "index":"2"
        }],
        "fixedSetps2":[{
            "stepName":"市公司网络部分管经审核",
            "type":"fixed",
            "approver":"", //approver
            "index":"3"
        }]
    };*/
    $scope.resultData={
            "type" : "mandimension",
            "name":"",
            "desc":"",
            "city":"",
            "county":"",
            "variableSetps":[
                {
                    "stepName":"",
                    "type":"variable",
                    "approver":"", //approver
                    "index":"0"
                }
            ],
            "fixedSetps":[{
                "stepName":"",
                "type":"fixed",
                "approver":"", //approver
                "index":"0"
            }]
        };

    //审批人对象
    var flow={
        "stepName":"",
        "flowType":"",
        "approver":"", //approver
        "name":"",
        "index":""
    }

    if(id!="none"){
        commonServ.getMangeFlowDetails(id).success(function(data){
            utils.loadData(data,function(data){
                console.log("data",data);
                $scope.resultData=data.data;
                if ($scope.resultData.type == "mandimension" || $scope.resultData.type == "pagodadimension") {
                	$scope.allType = 1
                } else if ($scope.resultData.type == "basicdata"){
                	$scope.allType = 2
                } else if($scope.resultData.type == "mandimensionpre"){
                	$scope.allType = 3
                }else if($scope.resultData.type == "zmandimension"){
                	$scope.allType = 4
                }else if($scope.resultData.type == "transelepower" || $scope.resultData.type == "pagodatranselepower"){
                	$scope.allType = 5
                }
                $rootScope.queryCountyList( $scope.resultData.city);
                setTimeout(function(){
                    $scope.$apply()
                    $scope.resultData.county= $scope.resultData.county;
                },2000);
            });
        });
    }

    $scope.save=function(){
    	
    	var inputs = $(".verification");
    	for (var index = 0; index < inputs.length; index++) {//检测是否有必填信息未填完
    		var curDom = $(inputs[index]);
    		if (curDom.attr("required") && !curDom.val()) {
    			utils.msg(curDom.attr("message"));
    			curDom.focus();
    			return;
    		}
    	}
    
    	
        for(var i=0; i<$scope.resultData.variableSetps.length; i++){
            delete  $scope.resultData.variableSetps[i].name;
        }

        for(var i=0; i<$scope.resultData.fixedSetps && $scope.resultData.fixedSetps.length; i++){
            delete  $scope.resultData.fixedSetps[i].name;
        }

        console.log("data",angular.toJson($scope.resultData,true));
     
        commonServ.addOrUpdateWorkflow($scope.resultData).success(function(data){//提交后台创建流程模板
            utils.ajaxSuccess(data,function(data){
            	$scope.returnPage();
            })
        });
    }

    // 返回页面
    $scope.returnPage = function(){
        $state.go('app.workflow',{
            'status':'process',
        });
    }

    //常规审批删除人员
    $scope.removeItem=function(index){
        $scope.resultData.variableSetps.splice(index,1);
        console.log($scope.resultData.variableSetps.length);
    }
    //特殊审批删除人员
    $scope.removeItem1=function(index){
        $scope.resultData.fixedSetps.splice(index,1);
        console.log($scope.resultData.fixedSetps.length);
    }

    //常规审批添加人员
    $scope.addPerson=function(){
        $scope.resultData.variableSetps.push({
            "stepName":"",
            "type":"variable",
            "approver":"", //approver,
            "name":"",
            "index":$scope.resultData.variableSetps.length
        })
    }
    //特殊审批添加人员
    $scope.addPerson1=function(){
        $scope.resultData.fixedSetps.push({
            "stepName":"",
            "type":"fixed",
            "approver":"", //approver,
            "name":"",
            "index":$scope.resultData.fixedSetps.length
        })
    }

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

    $scope.key = {word:""};
    //获取列表
    $scope.getData=function(){
    	word = $scope.key.word;
    	angular.extend($scope.params,{
    	       account:word,
    	      // userLevel:$scope.level,
    	      // city:$scope.resultData.city,
    	       //county:$scope.resultData.county
    	});

        commonServ.queryAllUser($scope.params).success(function (data) {
            utils.loadData(data,function (data) {

                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.userList = data.data.results;
            })
        });
    }

    /*//选择用户
    $scope.openChoiceUser=function(type,index){
    	debugger;
        $scope.type=type;
        $scope.index=index;
        // 用户等级
        if ('FIXED' == type) {
        	$scope.level = 1;
        } else if('VARIABLE' == type && $scope.allType != 2) {
        	$scope.level = 3;
        } 
        // 基础数据变更,用户为市级
        else if('VARIABLE' == type && $scope.allType == 2) {
        	$scope.level = 1;
        }
        
        // 地市
        if (!$scope.resultData.city) {
        	utils.msg("请选择地市");
        	return;
        }
        // 区县
        if (!$scope.resultData.county) {
        	utils.msg("请选择区县");
        	return;
        }
        
        $scope.choiceUserDialog=ngDialog.open({
            template: './tpl/userDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }*/
    
  //选择用户
    $scope.openChoiceUser=function(type,index){   
    	 $scope.type=type;
         $scope.index=index;
        // 地市
        if (!$scope.resultData.city) {
        	utils.msg("请选择地市");
        	return;
        }
        // 区县
        if (!$scope.resultData.county) {
        	utils.msg("请选择区县");
        	return;
        }
        
        
        $scope.choiceUserDialog=ngDialog.open({
            template: './tpl/userDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }

    $scope.choiceUsers=function(item){
        console.log("item",item);
        if($scope.type=='variable'){
            $scope.resultData.variableSetps[$scope.index].approver= item.userId;
            $scope.resultData.variableSetps[$scope.index].user= item;
        }else{
            $scope.resultData.fixedSetps[$scope.index].approver= item.userId;
            $scope.resultData.fixedSetps[$scope.index].user= item;
        }
        $scope.closeDialog('choiceUserDialog')
    }

    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }

    // 切换类型
    $scope.changeFlowType = function(allType) {
    	$scope.allType = allType;
    	if(allType == 5){
    		$scope.resultData.type = "transelepower";
    		delete $scope.resultData.fixedSetps;
    	}
    	if (allType == 2) {
    		$scope.resultData.type = "basicdata";
    		delete $scope.resultData.fixedSetps;
    	} 
    	if (allType == 1){
    		$scope.resultData.type = "mandimension";
    		$scope.resultData.fixedSetps = [{
                "stepName":"",
                "type":"fixed",
                "approver":"", //approver
                "index":"0"
            }/*,{
                "stepName":"市公司网络部分管经审核",
                "type":"fixed",
                "approver":"", //approver
                "index":"3"
            }*/]
    	}
    	if (allType == 3){
    		$scope.resultData.type = "mandimensionpre";
    		delete $scope.resultData.fixedSetps;
    	}
    }

}]);




