/**
 *  自维新增稽核单 addOrUpdateAuditCtrl 公用模块（包含电费录入--新增稽核单   电费录入--修改、查看稽核单   电费稽核---修改、查看稽核单）
 */
app.controller('addOrUpdateAuditCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

    /**
     * [resultData description] 新建稽核单数据
     * @type {Object}
     */
    $scope.resultData={

        "serialNumber":new Date().getTime(),
        "sysAccountSiteId":"",//报账点ID
        "status":"",//状态
        "productNature":"",
        "costCenterID":"",//成本中心ID
        "towerSiteNumber":"",//铁塔站点编号
        "shareElectricity":"",//分摊电费金额
        "invoiceId":"",//发票类型ID
        "taxAmount":"",//税金金额
        "electricityAmount":"",//电费金额
        "otherCost":"",//其他费用
        "totalAmount":"",//总金额
        "adpv":[],//核销数据
        "expenseTotalAmount":0,//总共核销金额
        "paymentAmount":"",//支付总金额
        "attachmentId":[],//附件　ids
        "watthourExtendVOs":[],//各电表信息,
        "sysSupplierID":"",//供应商ID
        "electrictyMidInvoices":[],  // 自维电费金额及发票信息
        "supplierName":"",//供应商名称
        "sysRgID":"", // 报账组名称
        "contractID":"", //合同ID
		"departmentName":"", //部门名
		"overproofReasons":"",//超标原因
		"remark":"",
        "payType":7,//缴费类型
        "professional":"无线",//所属专业
        "auditType":0,//稽核类型
        "einfo":[],
        "isOnline":"",
        //"exitStatus":"",//退网锁定状态
        //"roomStatus":"",//退网状态
        // "eleTableType":"",//电表类型 1 普通 2 智能
        "ptype":""//电表类型 1 普通 2 智能
    }

/********************************************************新增稽核和电费录入公共部分****************************************************************/
    // 电费录入修改稽核单状态
    $scope.isAudit = true;        //修改稽核單狀態
    $scope.isEditAudit = false;   //查看稽核單狀態
    $scope.whiteType=0;
    $rootScope.settimetime="";
    $scope.timeflag=false;
    $scope.startAmmertflag=[];
    //发票信息
    $scope.invoiceVOs=[];
    //获取稽核单号、地市、区县、发票信息
    commonServ.getInputElectrictyAddInfo().success(function(data){
        $scope.resultData.serialNumber=data.serialNumber;  // 稽核单号
        $scope.resultData.areas=data.areas;                // 地市
        $scope.resultData.counties=data.counties;          // 区县cco
        $scope.invoiceVOs=data.invoiceVOs;                 // 发票信息
        //alert(data.adpv.paymentNumber);
        $scope.adpv=data.adpv;//预付单信息

    });
    
    
/*    $scope.belongStartTime="";
    $scope.belongEndTime="";*/
    

    $rootScope.whiteflag=0;

    //获取成本中心列表
    $scope.costCeterVOs=[];
    commonServ.getInputElectrictyCostCeterVOsInfo().success(function(data){
        utils.loadData(data,function(data){
            if(data.data.length>0){
                $scope.costCeterVOs=data.data;
                $scope.resultData.costCenterID = $scope.costCeterVOs[0].id;
            }
        })
    });
    
    
    $scope.changeOther=function(){
    	var other=$("[name='other']").find("option:selected").text();
    	if(other==="其他"){
    		$scope.singleDetail.overproofReasons="";
    	}
    	
    };

 //保存选择的成本中心
	$scope.selectCostCenter = function(data){		
		if(data==null){
			 utils.msg("请选择一个成本中心！");
			 return;
		}		
		$scope.resultData.costCenterID=data;   //保存选择的成本中心ID
	};

    //获取报账单名称
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
    
    //保存提交的时候核销计算
    $scope.countMoney2=function(){
    	var noNum = $scope.resultData.adpv;//所有核销数据list
    	var totalAmount = $scope.resultData.totalAmount*1;//稽核单总金额(含税)
    	var allExpenseAmount = 0;//本次总共想要核销的金额
    	for(var i=0;i<noNum.length;i++){
    		allExpenseAmount += noNum[i].expenseAmount*1;
    	}
    	if(allExpenseAmount>totalAmount){
    		return 0;//表示核销超过总金额
    	}else{
    		return 1;//表示ok
    	}
    }
    
    //核销计算
    $scope.countMoney=function(index){
    	//alert("计算核销金");
    	var noNum = $scope.resultData.adpv;//所有核销数据list
    	var expenseAmount = noNum[index].expenseAmount*1;//该次想要核销的金额
    	var surplusMoney = noNum[index].surplusMoney*1;//该预付单最多能核销的金额
    	var allSurplusMoney = 0;//所有预付单总共能核销的金额
    	var allExpenseAmount = 0;//本次总共想要核销的金额
    	for(var i=0;i<noNum.length;i++){
    		allSurplusMoney += noNum[i].surplusMoney*1;
    		allExpenseAmount += noNum[i].expenseAmount*1;
    	}
    	var totalAmount = $scope.resultData.totalAmount*1;//稽核单总金额(含税)
    	
    	if(expenseAmount*1 != expenseAmount){
    		utils.msg("请输入数字格式");
    		$scope.resultData.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(expenseAmount<0){
    		utils.msg("请输入大于0的数字");
    		$scope.resultData.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(expenseAmount>surplusMoney){
    		utils.msg("输入的核销金额大于该预付单能核销的金额");
    		$scope.resultData.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(allExpenseAmount>allSurplusMoney){
    		utils.msg("总核销金额大于所有预付单能核销金额之和");
    		$scope.resultData.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(allExpenseAmount>totalAmount){
    		utils.msg("总核销金额大于稽核单总金额");
    		$scope.resultData.adpv[index].expenseAmount=0;
    		return;
    	}
    	//设置本次想核销总金额(改在提交中设置)
    	$scope.resultData.expenseTotalAmount=allExpenseAmount;
    	$scope.resultData.paymentAmount = totalAmount-allExpenseAmount;
    	//未完待续*********************************************************************
    };


    //获取报账点列表
    $scope.getData=function(siteName){	
    	
        angular.extend($scope.params,{
            "cityId":$rootScope.userCityId,
            "countyId":$rootScope.userCountyId,
            "siteName":$("#siteName").val(),
            // "accountName":$scope.accountName,
            // "accountAlias":$scope.accountAlias,
            // "oldFinanceName":$scope.oldFinanceName,
            // "resourceName":$scope.resourceName
        })
        commonServ.querySiteInfoPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    $scope.confvv = [];  //报账点
    $scope.confs = []; //供货商

    // 获取报账点弹框
    $scope.siteObject={};   //返回countyId
    $scope.getAccountSite=function(){
/*    	if($scope.belongStartTime==""){
    		utils.msg("请填写电表归属起始日期");
    		return;
    	}
    	if($scope.belongEndTime==""){
    		utils.msg("请填写电表归属终止日期");
    		return;
    	}*/
        $scope.accountSiteDialog=ngDialog.open({
            template: './tpl/reimburDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }


    // 查询是否包干  产权性质
    $scope.getIsClud=function(siteId){
        commonServ.getInputElectrictyDetail(siteId).success(function (data) {
            if(data.isClud == 1){
                $scope.isCludInfoDetail = "包干";
            }else if(data.isClud == 0){
                $scope.isCludInfoDetail = "不包干";
            }else {
                $scope.isCludInfoDetail = "";
            }
        });
    }

    // 选择报账点名称  新增稽核、电费录入修改
    $scope.choiceAccountSite=function(){

    	$scope.bbelongStartTime="";
		$scope.bbelongEndTime="";
    	
		$scope.resultData.contractID==null;

    	$scope.meterNum="";//noone清空电表数
		$scope.resultData.contractID=null;
        $scope.isAudit = false;
        $scope.isEditAudit = true;
        var obj= utils.getCheckedValsForRadio('#siteList');
        console.log(obj)
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        
        $scope.siteObject= JSON.parse(obj);
        //获取报账点是否存在未锁定的机房
        commonServ.getAccountRoomIsOnline($scope.siteObject.id).success(function(data){
        	// debugger;
        	var data1 = data.data;
        	$scope.accountRoomIsOnline = data1;
        	if(data1.onlineRoomNum == 0 && data1.noOnLineRoomNum == 0){
        		alert("该报账点无可报账机房！");
        		return;
        	}
        	if(data1.onlineRoomNum == 0 && data1.noOnLineRoomNum != 0){
        		alert("该报账点只存在退网机房,开始进行最后一次报账!")
        	}
        })
//        //判断是否退网noone
//        if($scope.siteObject.roomStatus=="退网" && $scope.siteObject.exitStatus=="锁定"){
//        	alert("该报账点已经退网报账！");	
//            return;	
//        }else if($scope.siteObject.roomStatus=="退网"&&$scope.siteObject.exitStatus==null){
//        	alert("该报账点已经退网,开始进行最后一次报账！");	
//        }
//        /**********全局退网状态********/
//        $rootScope.exitStatus=$scope.siteObject.exitStatus;//保存退网锁定状态noone
//        $rootScope.roomStatus=$scope.siteObject.roomStatus;//保存退网状态noone
//        
        
		$rootScope.AccountSiteId=$scope.siteObject.id;//保存报账点id
		$rootScope.AccountSiteName=$scope.siteObject.accountName;//保存报账点名称
        $scope.resultData.sysAccountSiteId=$scope.siteObject.id;//报账点id
       // $scope.getIsClud($scope.siteObject.id);  //是否包干
       // $scope.getSuppliers($scope.siteObject.id); //查询对应的供应商
        // debugger;
		$scope.getContract($scope.siteObject.id); //查询对应的合同id	
	        commonServ.getMt($scope.resultData.sysAccountSiteId).success(function (data) {
	        	$rootScope.belongEndTimezw= new Array(data.data.length);//电费归属终止日期
		        $rootScope.endAmmeterzw= new Array(data.data.length); //用电终度（度）
	        	  for(var index=0; index<data.data.length; index++) {
	        		  $rootScope.belongEndTimezw[index]= data.data[index].belongEndTimeS;//电费归属终止日期
		              $rootScope.endAmmeterzw[index]= data.data[index].endAmmeter; //用电终度（度）
	              }
	       })
		
        if($scope.siteObject.productNature == 0) {
            $scope.productNatureType = "自维";
        }else {
            $scope.productNatureType = "塔维";
        }

        // 修改页面
        if(!$scope.flagSave  && $scope.flagSave != undefined) {
            $scope.singleDetail.sysAccountSiteId = $scope.siteObject.id;         // 报账点ID
            $scope.singleDetail.accountName = $scope.siteObject.accountName;     //报账点名称
            $scope.singleDetail.accountAlias = $scope.siteObject.accountAlias;  //报账点别名
            //选择报账点后清空页面上原有数据
            $scope.singleDetail.paymentAmount = "";   //支付总金额
            $scope.singleDetail.otherCost = "";       //其他费用
            $scope.singleDetail.totalAmount = "";     //总金额
            $scope.singleDetail.sysSupplierName = ""; //供货商名称
            if($scope.electrictyMidInvoices.length >= 0){
                $scope.electrictyMidInvoices = [];  //发票信息
            }
            if($scope.watthourMeterVOs &&　$scope.watthourMeterVOs.length > 0){
                $scope.watthourMeterVOs = [];
            }

        }else {
             //清空原有数据 新增
            $scope.resultData.paymentAmount = "";   //支付总金额
            $scope.resultData.otherCost = "";       //其他费用
            $scope.resultData.totalAmount = "";     //总金额
            $scope.resultData.sysSupplierName = ""; //供货商名称
            if($scope.resultData.electrictyMidInvoices.length >= 0){
                $scope.resultData.electrictyMidInvoices = [];  //发票信息
            }
            $scope.accountObject.name = ""; // 报账组信息
            if($scope.resultData.watthourExtendVOs &&　$scope.resultData.watthourExtendVOs.length > 0){
                $scope.resultData.watthourExtendVOs = [];
            }
            // 清空页面上的电表数据信息
            if($scope.watthourMeterVOs && $scope.watthourMeterVOs.length > 0){
                $scope.watthourMeterVOs = [];
            }
        }

        $scope.closeDialog('accountSiteDialog');
    }



    //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }


     //根据报账点查找对应的供应商
    $scope.getSuppliers=function(countyId){
        commonServ.getSupplierName(countyId).success(function(data){
            utils.loadData(data,function(data){
            	
                if(data.data == null){
                    // utils.msg("该站点无供应商信息,请选择一个默认供应商");
                    return;
                }else {
                    $scope.resultData.sysSupplierName=data.data.name;
                    $scope.resultData.sysSupplierID=data.data.id;
                    //查找供应商的预付单
                    $scope.getPreBySuId(data.data.code);
                }
            })
        });
    }
    
    $scope.flagg=false;
    //查找供应商的预付单
      $scope.getPreBySuId=function(suId,supplierRegionCode){
      	commonServ.getPreBySuId(suId,supplierRegionCode).success(function(data){
      		//$scope.adpv=data.data;
      		var dataList = data.data;
      		if(dataList!=null && dataList.length>0){
      			$scope.flagg=true;
      			for(var i=0;i<dataList.length;i++){
      				dataList[i].expenseAmount=0;
      			}
      			$scope.resultData.adpv=dataList;
      			//$scope.resultData.adpv[1]=$scope.resultData.adpv[0];
      		}else{
      			$scope.flagg=false;
      		}
      		
      	})
      }
      

     //获取供应商名称
    $scope.suPpageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getSparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 供应商搜索列表
    $scope.getData2=function(supplierName,a){
    	if(a){
   		 $scope.getSparams = {
	        pageSize: 10,//每页显示条数
	        pageNo: 1,// 当前页
   		 };
    	}

        angular.extend($scope.getSparams,{
            "cityId":$rootScope.userCityId,
            "only":"1",
            "name": supplierName,
            //"accountName":$scope.accountName,
            //"accountAlias":$scope.accountAlias,
            //"oldFinanceName":$scope.oldFinanceName,
            //"resourceName":$scope.resourceName
        })			
        commonServ.querySupplier($scope.getSparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.suPpageInfo.totalCount = data.data.totalRecord;
                $scope.suPpageInfo.pageCount = data.data.totalPage;
                $scope.getSparams.page = data.data.pageNo;
                $scope.suppliers = data.data.results;
            })
        });
    }



    // 供应商弹出框
    $scope.choiceSupplierDialog=function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
        $scope.choiceSupplierDialogs=ngDialog.open({
            template: './tpl/supplierDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
            scope: $scope,
        });
    }


    // 确定选择供应商
    $scope.choiceSupplier=function(){
        var obj= utils.getCheckedValsForRadio('#SupplieList');
        if(obj==null){
            utils.msg("请选择一个供应商！");
            return;
        }
        obj= JSON.parse(obj);
        $scope.resultData.sysSupplierName=obj.name; //供应商名称
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            $scope.singleDetail.supplierName = obj.name;      //修改稽核单页面供货商数据
            $scope.singleDetail.sysSupplierID=obj.id;
        }
        $scope.resultData.sysSupplierID=obj.id;   //改变后的供应商id
        $scope.getPreBySuId(obj.code);
        $scope.closeDialog("choiceSupplierDialogs");
    }
    
    //根据报账点查找对应的合同ID
    $scope.getContract=function(countyId){
		//(匹配上次录入)
        commonServ.getContractName(countyId).success(function(data){
            utils.loadData(data,function(data){
                if(data.data == null){
/*                	debugger;
                    // utils.msg("该站点无合同信息,请选择一个默认合同id");
                	//根据报账点查找站点--查找白名单状态是否是白名单
                	commonServ.getWhite(countyId).success(function(data){
                		if(data.data!='否'){
                			//白名单状态
                			$scope.white=data.data;
                			$scope.whiteType=1;
                			$scope.resultData.contractID=data.data.contractName;
                			var ht=new Array();
                			ht.push(data.data.contractId);
                			$scope.contractIds=ht;
                			//选择合同下的合同
                			$rootScope.contractPrice=data.data.price;
                		}else{
                			$scope.whiteType=0;//非白名单
                			$rootScope.contractPrice="";
                			return;
                		}
                	});*/
                	return;
                }else {
                	$scope.whiteType=0;
                	$scope.resultData.costCenter=data.data.costCenter;//匹配上次录入的成本中心
					$scope.resultData.costCenterID=data.data.costCenterID;//保存上次录入的成本中心ID
 					$scope.accountObject.name=data.data.sysRgName;//匹配上次录入的报账组名称
					$scope.resultData.sysRgID=data.data.sysRgID;//保存上次录入的报账组id
					$scope.departmentName=data.data.departmentName;//匹配上次录入的部门名
					$scope.departmentName1=data.data.departmentName;//匹配上次录入的部门名显示在录入页面
					$scope.resultData.departmentName=data.data.departmentName;//保存上次录入的部门名
                }
            })
        });
    		//匹配报账点对应的合同
    		commonServ.getContract(countyId).success(function(data){
                utils.loadData(data,function(data){
                	// debugger;
                    if(data.data == null||data.data==""){
                    	// debugger;
                    	//根据报账点查找站点--查找白名单状态是否是白名单
                    	commonServ.getWhite(countyId).success(function(data){
                    		if(data.data!='否'){
                    			//白名单状态
                    			$scope.white=data.data;
                    			$scope.whiteType=1;
                    			$rootScope.whiteflag=1;
                    			/*$scope.resultData.contractID=data.data.contractName;*/
                    			var ht=new Array();
                    			ht.push(data.data.contractId);
                    			$scope.contractIds=ht;
                    			//选择合同下的合同
                    			$rootScope.contractPrice=data.data.price;
                    		}else{
                    			$scope.whiteType=0;//非白名单
                    			$rootScope.whiteflag=0;
                    			$scope.contractIds="";
            					alert("该报账点无合同数据,不允许报销,请确认合同信息上传财务系统后再试！");					
                                return;				
                    		}
                    	});
                    }else {                         	
                    	$scope.contractIds=data.data;//获取报账点对应的合同id
                    }
                })
            });
    }
	
	//未选择报账点选择合同时判断
	$scope.judgeContract = function(){	
//		console.log($rootScope.exitStatus)
//		console.log($rootScope.roomStatus)
//		console.log(1111)
		var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
			return;		
	}
	 //保存选择的合同
	$scope.selectContract = function(data){	
		//选择合同清空电表信息
		$scope.resultData.watthourExtendVOs = [];
		if(data==null){
			 utils.msg("请选择一个合同！");
			 $scope.resultData.contractID=null;
			 return;
		}
//		alert(data);
		$scope.resultData.contractID=data;//保存选择的合同
		
        if($rootScope.whiteflag==1){
        	$scope.whitecontractInfos(data);//根据合同id查	询对应的合同信息
        }else{
        	if(data!=null||data!=""){
        		$scope.resultData.contractID=data;   //保存选择的合同
       	        $scope.contractInfos(data);//根据合同id查询对应的合同信息
        	}
        }
		// utils.msg("你选择了合同:"+data);
				
	};
	
     //获取合同名称
    $scope.coNpageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getSparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 合同信息搜索列表
    $scope.getData3=function(contractName,a){
    	if(a){
   		 $scope.getSparams = {
	        pageSize: 10,//每页显示条数
	        pageNo: 1,// 当前页
   		 };
    	}

        angular.extend($scope.getSparams,{
            //"cityId":$scope.cityId,
            "only":"1",
            "name": contractName,
			"AccountSiteId" : $rootScope.AccountSiteId,
            //"accountName":$scope.accountName,
            //"accountAlias":$scope.accountAlias,
            //"oldFinanceName":$scope.oldFinanceName,
            //"resourceName":$scope.resourceName
        })

        commonServ.queryContract($scope.getSparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.coNpageInfo.totalCount = data.data.totalRecord;
                $scope.coNpageInfo.pageCount = data.data.totalPage;
                $scope.getSparams.page = data.data.pageNo;
                $scope.Contract = data.data.results;
            })
        });
    }

    // 合同信息弹出框
    $scope.choiceContractDialog=function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){          
		   utils.msg("请先选择报账点！");
            return;
        }
        $scope.choiceContractDialogs=ngDialog.open({
            template: './tpl/contractDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
            scope: $scope,
        });
    }


    // 确定选择合同ID
    $scope.choiceContract=function(){
        var obj= utils.getCheckedValsForRadio('#ContractList');
        if(obj==null){
            utils.msg("请选择一个合同！");
            return;
        }
        obj= JSON.parse(obj);
        $scope.resultData.contractName=obj.name; //合同名称
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            $scope.singleDetail.contractName = obj.name;      //修改稽核单页面合同数据
            $scope.singleDetail.contractID=obj.id;
        }
        $scope.resultData.contractID=obj.id;   //改变后的合同id
        	$scope.contractInfos(obj.id);//根据合同id查询对应的合同信息
        $scope.closeDialog("choiceContractDialogs");
    }

	//根据合同id查询对应的合同信息
	$scope.contractInfos=function(contractId){
	
		var cityId=$rootScope.userCityId;//地市ID
		var countyId=$rootScope.userCountyId;//区县id
		commonServ.getContractInfo(contractId,cityId,countyId).success(function(data){
			// debugger;
            utils.loadData(data,function(data){  
			$scope.vendorName=data.data.vendorName;//供应商名称
			$scope.resultData.sysSupplierID=data.data.supplierId;//保存供应商ID
			$scope.resultData.supplierName=data.data.vendorName;//保存供应商名称
			 //查找供应商的预付单（通过供应商ID--表中的code字段,供应商地点id）
            $scope.getPreBySuId(data.data.vendorId,data.data.supplierRegionCode);
			$scope.startDate=data.data.executionBeginDate; //合同生效日期
			$scope.endDate=data.data.executionEndDate; //合同失效日期
			$scope.assetManagementSiteName=data.data.assetManagementSiteName;//资管站点名称
			if(data.data.unitPrice==null||data.data.unitPrice==""){//区域直供电单价
				$scope.zgdUnitPrice="0";
			}else{
				$scope.zgdUnitPrice=data.data.unitPrice; //区域直供电单价
			}
			//$scope.isUploadOverproof=data.data.isUploadOverproof;//是否上传超标审批记录( 有(0)、无(1))
			if(data.data.isUploadOverproof=="0"){ //上传了超标审批记录
				$scope.isUploadOverproof="有"; 
			}else if(data.data.isUploadOverproof=="1"){ //未上传超标审批记录
				$scope.isUploadOverproof="无";
			}else{
				$scope.isUploadOverproof="";
			}
			if(data.data.contractNumber==null){
				$scope.contractNumber="无";//合同编号
			}else{
				$scope.contractNumber=data.data.contractNumber;//合同编号
			}
			$scope.priceOrLumpSumPrice=data.data.priceOrLumpSumPrice;//单价或包干价(大于20即包干价)
			if(data.data.priceOrLumpSumPrice>20){
				$scope.xIsClud="bg";//设置状态为包干
				$scope.sumXPrice=data.data.priceOrLumpSumPrice;//包干价
			}else{
				$scope.xIsClud="bbg";//设置状态为不包干
				$scope.xPrice=data.data.priceOrLumpSumPrice;//单价
			}			
            })
        });
	}
	
	
	
	
	//白名单根据合同id查询对应的合同信息
	$scope.whitecontractInfos=function(contractId){
		var cityId=$rootScope.userCityId;//地市ID
		var countyId=$rootScope.userCountyId;//区县id
		commonServ.getwhiteContractInfo(contractId,cityId,countyId).success(function(data){
            utils.loadData(data,function(data){  
			$scope.vendorName=data.data.vendorName;//供应商名称
			$scope.resultData.sysSupplierID=data.data.supplierId;//保存供应商ID
			$scope.resultData.supplierName=data.data.vendorName;//保存供应商名称
			
			 //查找供应商的预付单（通过供应商ID--表中的code字段）
			$scope.getPreBySuId(data.data.vendorId,data.data.supplierRegionCode);
			$scope.startDate=data.data.executionBeginDate; //合同生效日期
			$scope.endDate=data.data.executionEndDate; //合同失效日期
			$scope.assetManagementSiteName=data.data.assetManagementSiteName;//资管站点名称
			if(data.data.unitPrice==null||data.data.unitPrice==""){//区域直供电单价
				$scope.zgdUnitPrice="0";
			}else{
				$scope.zgdUnitPrice=data.data.unitPrice; //区域直供电单价
			}
			//$scope.isUploadOverproof=data.data.isUploadOverproof;//是否上传超标审批记录( 有(0)、无(1))
			if(data.data.isUploadOverproof=="0"){ //上传了超标审批记录
				$scope.isUploadOverproof="有"; 
			}else if(data.data.isUploadOverproof=="1"){ //未上传超标审批记录
				$scope.isUploadOverproof="无";
			}else{
				$scope.isUploadOverproof="";
			}
			if(data.data.contractNumber==null){
				$scope.contractNumber="无";//合同编号
			}else{
				$scope.contractNumber=data.data.contractNumber;//合同编号
			}
			$scope.priceOrLumpSumPrice=data.data.priceOrLumpSumPrice;//单价或包干价(大于20即包干价)
			if(data.data.priceOrLumpSumPrice>20){
				$scope.xIsClud="bg";//设置状态为包干
				$scope.sumXPrice=data.data.priceOrLumpSumPrice;//包干价
			}else{
				$scope.xIsClud="bbg";//设置状态为不包干
				$scope.xPrice=data.data.priceOrLumpSumPrice;//单价
			}			
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

    //统一时间
    $scope.countTime=function(){
    	for(var i=0;i<$scope.watthourMeterVOs.length;i++){
        		$scope.bbelongStartTime=$("#belongStartTime").val();
        		$scope.bbelongEndTime=$("#belongEndTime").val();
        		$scope.watthourMeterVOs[i].belongStartTime=$scope.bbelongStartTime;
        		$scope.watthourMeterVOs[i].belongEndTime=$scope.bbelongEndTime;
        		if($("#belongStartTime").val()!="" && $("#belongEndTime").val()!=""){
                    console.log("统一时间"+$("#belongStartTime").val())
                    console.log("统一时间2"+$("#belongEndTime").val())
        			 $scope.countDays($scope.watthourMeterVOs[i],i);
        		}
        		
    	}
    };
    
    
    //计算用电天数
    $scope.countDays=function(item, index){
        if(!item.belongStartTime || !item.belongEndTime){
            return;
        }		
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.exceptions3Explain=null;//初始化异常原因(报账点单电表日均电量超1千度)
		item.isContinue=null;//初始化状态(是否继续提交)
        item.dayAmmeter= utils.getDays(item.belongStartTime,item.belongEndTime) + 1;
        $scope.watthourMeterVOs[index]=item;
    }

	//电损改变时重新判断电损占比
	$scope.bElectricLoss=function(item, index){
		
		if(item.electricLoss==""||item.electricLoss==null){
			item.electricLoss=0;
		}
		item.totalEleciric=parseFloat($scope.totalEleciricDS)+parseFloat(item.electricLoss)+"";
		item.exceptions4Explain=null;//初始化异常原因(电损占比=稽核单电损电量/稽核单总电量>80%)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
		if($scope.sumXPrice==null||$scope.sumXPrice==""){
        $scope.countElectrictyItemPrice(item,index);
		}else if(($scope.sumXPrice!=null||$scope.sumXPrice!="")&&(item.totalAmount!=null||item.totalAmount!="")){
			$scope.backcalculationPrice(item,index);
		}
	}
	
	//本次拍照时间改变时重新判断报销时间与拍照时间是否相同
	$scope.bTheTakePhotosTime=function(item, index){
		//item.theTakePhotosTime=null;//
		item.exceptionsExplain=null;//初始化异常原因(报销时间与拍照时间相同)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
	}
	
	//拍照电表读数改变时重新判断拍照电表读数是否小于报销电表当前读数
	$scope.bElectricMeterDeg=function(item, index){
		item.exceptions1Explain=null;//初始化异常原因(拍照电表读数小于报销电表当前读数)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
	}
	
    //计算电表的用电量
    $scope.countPowerSize=function(item,index){
        //如果翻表选择‘是’
        if(item.whetherMeter == 1 && (item.maxReading || item.maxReading == 0 )){
           item.viewMaxReading = item.maxReading;
        }else if(!item.maxReading && item.maxReading != 0){
            item.whetherMeter == 0;
            item.viewMaxReading = "";
        }else{
            // $scope.isSelect = false;
            // $scope.isSelected = true;
            item.viewMaxReading = "";
        }
        if(!item.startAmmeter ){
            item.startAmmeter = null;
        }
        if(!item.endAmmeter){
            item.endAmmeter = null;
        }
        var sum=( item.endAmmeter - item.startAmmeter); //未翻表
        //翻表
        if(item.whetherMeter==1 && (item.maxReading || item.maxReading == 0 )){
            sum= parseFloat(sum+item.maxReading+1); //翻表总电量 = 最大读数 + 当前止度读数 - 当前起度读数 + 1
        }

        if(isNaN(parseFloat(sum))){
            $scope.checkNumber(item);
            return;
        }
		item.exceptions1Explain=null;//初始化异常原因(拍照电表读数小于报销电表当前读数)
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.exceptions3Explain=null;//初始化异常原因(报账点单电表日均电量超1千度)
		item.exceptions4Explain=null;//初始化异常原因(电损占比=稽核单电损电量/稽核单总电量>80%)
		item.isContinue=null;//初始化状态(是否继续提交)
		if(item.electricLoss==null||item.electricLoss==""){
			item.electricLoss="0";
		}
        item.totalEleciric= (parseFloat(sum)+parseFloat(item.electricLoss)).toFixed(2);
		$scope.totalEleciricDS=parseFloat(sum).toFixed(2);
        $scope.watthourMeterVOs[index]=item;
		if($scope.sumXPrice==null||$scope.sumXPrice==""){
        $scope.countElectrictyItemPrice(item,index);
		}else if(($scope.sumXPrice!=null||$scope.sumXPrice!="")&&(item.totalAmount!=null||item.totalAmount!="")){
			$scope.backcalculationPrice(item,index);
		}
    }

   //反算单价
    $scope.backcalculationPrice=function(item,index){
		if(item.totalAmount>$scope.sumXPrice){			
			utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
		}
        var price; //单个电表总金额
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.isContinue=null;//初始化状态(是否继续提交)
		price=item.totalAmount/item.totalEleciric;
		item.unitPrice=	parseFloat(price).toFixed(2);//单价	
        item.backcalculationPrice = parseFloat(price).toFixed(2);//反算单价
        $scope.watthourMeterVOs[index]=item;
    };

    // 计算单个电表的金额
    $scope.countElectrictyItemPrice=function(item,index){
        var total; //单个电表总金额
       /* if($scope.invoiceVOs.length == 0){
            utils.msg("目前暂无税率信息，请联系管理员后配置后再进行计算!");
            return;
        }else if($scope.invoiceVOs[0].billTax == "0"){
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice;
        }else {
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice*($scope.invoiceVOs[0].billTax/100);
        } */
		if($scope.xIsClud=="bbg"){
			item.unitPrice=$scope.xPrice;//单价
		}
		total=item.totalEleciric*item.unitPrice;
        if(isNaN(parseFloat(total))){
            $scope.checkNumber(item);
            return;
        }
        item.totalAmount= parseFloat(total).toFixed(2);
        $scope.checkNumber(item);
        $scope.watthourMeterVOs[index]=item;
    };


    $scope.disabled = false;  // 判断发票信息是否能填写
    //计算电费总金额需要新增验证
    $scope.countElectrictyTotPrice=function(){
        var sum=0;
        for(var  i=0; i<$scope.watthourMeterVOs.length; i++){
            var item = $scope.watthourMeterVOs[i];
            if(item.totalAmount != null){
                sum += parseFloat(item.totalAmount);
            }
        }
        $scope.resultData.totalAmount= sum.toFixed(2);    //各电表的总金额
		$scope.totalAmount = sum.toFixed(2);//用于填写其他费用后计算总金额
        $scope.resultData.paymentAmount = sum.toFixed(2); // 支付总金额

        // 录入电费页面修改
        if(!$scope.flagSave && $scope.flagSave != undefined) {
        	console.log("this")
            if(isNaN(parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost))){
                return;
            }
          //  $scope.singleDetail.paymentAmount= parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost).toFixed(2);//页面上的数据
          //  $scope.singleDetail.totalAmount = $scope.resultData.totalAmount;  // 页面显示的数据
			
			$scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.singleDetail.otherCost))+"";  //支付总金额
			$scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.singleDetail.otherCost))+""; //总金额（含税）+=其他金额

            //$scope.editInvoiceVO(); //电费录入页面-----计算发票税金金额
            if($scope.resultData.electrictyMidInvoices.length==0){
                $scope.resultData.electrictyMidInvoices.unshift({
                    "taxAmount":parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else {
            	console.log("here")
                $scope.resultData.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
         //发票修改时修改   $scope.electrictyMidInvoices = $scope.resultData.electrictyMidInvoices; //电费录入 ---修改详情页面显示修改的发票
        }else {
            $scope.disabled = true;
            $scope.resultData.paymentAmount = parseFloat($scope.resultData.totalAmount - $scope.resultData.otherCost).toFixed(2);
             //新增稽核单-----计算发票税金金额
            if($scope.resultData.electrictyMidInvoices.length==0){
            	var totalAmount = parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2);
            	var taxAmount = parseFloat(totalAmount*($scope.invoiceVOs[0].billTax/100)).toFixed(2);
            	console.log(totalAmount,taxAmount)
            	$scope.resultData.electrictyMidInvoices.unshift({
                    "taxAmount":taxAmount,
                    "electricityAmount":parseFloat(totalAmount - taxAmount).toFixed(2), 
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                    "totalAmount":totalAmount,
                })
                //含税  不含税 和 税金 计算noone
                $scope.checkElectricityAmount = totalAmount;//含税
                $scope.checkElectricityTaxAmount = taxAmount;//税金
                $scope.checkElectricityElectricityAmount = parseFloat(totalAmount - taxAmount).toFixed(2);//不含税
            }else {
            	console.log("电表有两个时")
            	var totalAmount = parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2);
            	var taxAmount = parseFloat(totalAmount*($scope.invoiceVOs[0].billTax/100)).toFixed(2);
            	console.log(totalAmount,taxAmount)
                $scope.resultData.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":taxAmount,
                    "electricityAmount": parseFloat(totalAmount - taxAmount).toFixed(2), 
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                    "totalAmount":totalAmount,
                })
            }
        }
    }

    // 手动填写其他费用
    $scope.changeTotalAmount = function(){
		if($scope.totalAmount==null||$scope.totalAmount==""){
			$scope.resultData.otherCost=null;
			 utils.msg("请先添加电表明细");			 
		}else{
		if($scope.resultData.otherCost==null||$scope.resultData.otherCost==""){
			$scope.resultData.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(!reg.test($scope.resultData.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.resultData.otherCost < 0){
            utils.msg("数值不能为负。");
            return;
        }else if($scope.resultData.otherCost){	
        $scope.resultData.paymentAmount =new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.resultData.otherCost))+"";  //支付总金额
        $scope.resultData.totalAmount = new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.resultData.otherCost))+""; //总金额（含税）+=其他金额
		//alert($scope.resultData.otherCost+"==="+$scope.resultData.totalAmount+$scope.resultData.paymentAmount+parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2));
		}else {
			$scope.resultData.paymentAmount = $scope.totalAmount;
			$scope.resultData.totalAmount = $scope.totalAmount;
			
        }

		if($scope.resultData.otherCost=="0"){
			$scope.resultData.otherCost=null;
		}
		
        if($scope.resultData.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
          /*  $scope.resultData.electrictyMidInvoices.splice(0,1,{
                "taxAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
                "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            }) */
			$scope.resultData.electrictyMidInvoices.splice(0,1,{
                "taxAmount": new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
                "electricityAmount": new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
			
        }
		}
    }
    
  //验证手动输入的支付总金额
    $scope.changePaymentAmount=function(){
    	if($scope.totalAmount==null||$scope.totalAmount==""){
			$scope.resultData.paymentAmount=null;
			 utils.msg("请先添加电表明细");			 
		}else{
		if($scope.resultData.paymentAmount==null||$scope.resultData.paymentAmount==""){
			$scope.resultData.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(!reg.test($scope.resultData.paymentAmount)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.paymentAmount.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.resultData.paymentAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if((new BigDecimal($scope.resultData.paymentAmount).subtract(new BigDecimal($scope.resultData.totalAmount))) > 0){
        	 utils.msg("支付总金额不能大于总金额(含税)");
             return;        	
        }

		if($scope.resultData.paymentAmount=="0"){
			$scope.resultData.paymentAmount=null;
		}		
    }
    }

    //关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }
    
            // 切换类型
    $scope.eleTableType = "1";//初始化为普通电表
    $scope.choiceType = function(eleTableType) {
        $scope.eleTableType = eleTableType;//选取电表

        if(eleTableType == 1){
            $scope.resultData.ptype = "1";
        }
        if(eleTableType == 2){
            $scope.resultData.ptype = "2";
        }
        console.log(eleTableType)
       
    }
    
    //获取电表明细----对应电表个数
    $scope.getDianBiaoDetail=function(){
         //智能电表最长九十天周期
        $scope.ptype2EndTime= "";
        console.log($scope.bbelongStartTime+"dddddd11ddddd");
    	 $rootScope.settimetime="";
/*    	if($scope.belongStartTime==""){
    		utils.msg("请填写电表归属起始日期");
    		return;
    	}
    	if($scope.belongEndTime==""){
    		utils.msg("请填写电表归属终止日期");
    		return;
    	}*/
    	$rootScope.settime="";
    	$rootScope.setEndAmmeter="";
        var siteId=$scope.resultData.sysAccountSiteId;//报账单ID
		var contractID=$scope.resultData.contractID;//合同id，合同不一样，带出的数据不一样
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }else if((contractID==''||contractID==null)&& $scope.flagSave == undefined && $scope.flag == undefined){
			utils.msg("请先选择合同！");
            return;
		}else if(siteId !== ""){
            // 电表数组为空新增   电表数组不为空直接显示--------新增电表时
            if(!$scope.watthourMeterVOs || $scope.watthourMeterVOs.length < 1){
            	
                $scope.isNew = true;   //默认显示viewMaxReading
				//通过报账点查询电表信息
                commonServ.getInputElectrictyDetail(siteId).success(function(data){	
                	
                	
//                	$scope.priceOrLumpSumPrice=data.data.priceOrLumpSumPrice;//单价或包干价(大于20即包干价)
                	$scope.meterNum=data.watthourMeterVOs.length;//把电表个数赋值给meterNum,bYNoone
					$rootScope.createDate=data.createDate;
					$rootScope.nowTime= new Date();
					$scope.resultData.einfo=data.watthourMeterVOs;
                    if(data != "" && data.watthourMeterVOs.length > 0){//当有电表信息的时候
                    	var setEndAmmeter=new Array(data.watthourMeterVOs.length);
/*                    	for(var index=0; index<data.watthourMeterVOs.length; index++) {	
                    		 commonServ.geteleinfo(data.watthourMeterVOs[index].id).success(function(data){
                             	alert("1"+data.data.belongEndTime);
                             	setEndAmmeter[index]=data.data.endAmmeter;
                             	alert("index"+setEndAmmeter[index])
                             	$("#belongStartTime").val(data.data.belongEndTime);
                             	$rootScope.settime=data.data.belongEndTime;
                             	alert("2"+setEndAmmeter[index]);
                             	 data.watthourMeterVOs[index].startAmmeter=data.data.endAmmeter;
                             	 alert("3"+data.watthourMeterVOs[index].startAmmeter)
                             });
                    	}*/
                        //计算普通电表和智能电表个数
                        var nomarNum = 0;//普通个数
                        var fashonNum = 0;//智能个数
                        for(var index=0; index<data.watthourMeterVOs.length; index++) {	
                            data.watthourMeterVOs[index].watthourId = data.watthourMeterVOs[index].id;
                            $scope.iix=index;
                            //只要有普通电表，那么电表归属终止日期就是当天
                            if(data.watthourMeterVOs[index].ptype==1){
                                nomarNum+=1;
                                // $scope.eleTableType = "1";
                            }
                            if(data.watthourMeterVOs[index].ptype==2){
                                fashonNum+=1;

                            }
                            //查询每个电表关联的电费表
                     		 /*commonServ.geteleinfo(data.watthourMeterVOs[index].id).success(function(data){
                              	$("#belongStartTime").val(data.data.belongEndTimeS);
                     			$scope.bbelongStartTime=data.data.belongEndTimeS;
                              });*/
                            /*data.watthourMeterVOs[index].belongStartTime=$rootScope.belongEndTimezw[index];*/
//                            data.watthourMeterVOs[index].startAmmeter=setEndAmmeter[index];
                            $scope.bbelongStartTime=data.watthourMeterVOs[0].belongEndTimeS;
                            var str = data.watthourMeterVOs[0].belongEndTimeS;
                            str = str.replace(/-/g,'/');
                            var date = new Date(str).getTime(); 
                            //90天限制 24*60*60*90
                            date = date*1+24*60*60*90*1000;
                            var abc = $scope.dataChange(date);
                            $scope.ptype2EndTime = abc;
                            console.log(abc)
                            data.watthourMeterVOs[index].belongStartTime=data.watthourMeterVOs[0].belongEndTimeS;
                            data.watthourMeterVOs[index].belongEndTime="";
							//判断上次拍照时间是否有值
							if(data.watthourMeterVOs[index].takePhotosTime==null){
							data.watthourMeterVOs[index].photosStatus=false;	//拍照时间为null,用户选择上次拍照时间
						
							}else{
								data.watthourMeterVOs[index].photosStatus=true; //拍照时间不为null,上次拍照时间为后台查询出来的拍照时间
							data.watthourMeterVOs[index].takePhotosTime=$scope.dataChange(data.watthourMeterVOs[index].takePhotosTime);
							}
							data.watthourMeterVOs[index].lastTakePhotosTime=data.watthourMeterVOs[index].takePhotosTime;//上次拍照时间=拍照时间
							//判断最大读数是否有值
							if(data.watthourMeterVOs[index].maxReadings==null){
							data.watthourMeterVOs[index].maxReadingStatus=false;	//最大读数为null,用户选择最大读数					
							}else{
								data.watthourMeterVOs[index].maxReadingStatus=true; //最大读数不为null,带出用户上次选择
							}
					   }
                    if(nomarNum!=0){
                        $scope.eleTableType = "1";
                    }else if(fashonNum!=0 && nomarNum == 0){
                        $scope.eleTableType = "2";
                    }
                    console.log("qwewqewq"+fashonNum,nomarNum)
                        
                        $scope.watthourMeterVOs =utils.deepCopy(data.watthourMeterVOs);
						//alert($scope.dataChange(data.watthourMeterVOs[0].takePhotosTime)+"拍照时间");
                        $scope.accountSiteDialog=ngDialog.open({
                            template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                            width: 1000,
                            scope: $scope,
                        });
                    }else {
                        utils.msg("报账点对应的电表信息为空，请重新选择报账点！");
                        // $scope.closeDialog('accountSiteDialog');  此处6月8日已注释
                        return;
                    }
                });
            }else{
                $scope.isNew = false;
                $scope.accountSiteDialog=ngDialog.open({
                    template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                    width: 1000,
                    scope: $scope,
                });
            }

        }else if(!$scope.flagSave  && $scope.flagSave != undefined || !$scope.flag){
            $scope.isNew = false;   //默认显示viewMaxReading
			$rootScope.nowTime= new Date();//当前时间
            // 查看修改电表信息时
			if($scope.singleDetail.watthourMeterVOs!=null){
				if($scope.singleDetail.watthourMeterVOs.length>0){
					for(var index=0; index<$scope.singleDetail.watthourMeterVOs.length; index++) {	
					if($scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime==null||$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime==""){					
					$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime="";
					}else{
						$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime=$scope.dataChange($scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime);
					}
					if($scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime==null||$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime==""){					
						$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime="";
					}else{
						$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime=$scope.dataChange($scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime);
					}
					if(($scope.singleDetail.watthourMeterVOs[index].unitPrice==""||$scope.singleDetail.watthourMeterVOs[index].unitPrice==null)
					&&($scope.singleDetail.watthourMeterVOs[index].backcalculationPrice!=""||$scope.singleDetail.watthourMeterVOs[index].backcalculationPrice!=null)
					){
						$scope.singleDetail.watthourMeterVOs[index].unitPrice=$scope.singleDetail.watthourMeterVOs[index].backcalculationPrice;
					}
					}
				}			
			}
            $scope.watthourMeterVOs = utils.deepCopy($scope.singleDetail.watthourMeterVOs);
            for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
                //时间格式转换
                $scope.watthourMeterVOs[i].belongEndTime = $scope.dataChange($scope.watthourMeterVOs[i].belongEndTime);
                $scope.watthourMeterVOs[i].belongStartTime = $scope.dataChange($scope.watthourMeterVOs[i].belongStartTime);
            }
            $scope.accountSiteDialog=ngDialog.open({
                template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                width: 1000,
                scope: $scope,
            });
        }
        console.log("电表明细",angular.toJson($scope.watthourMeterVOs,true));

    }
    
    

    var isEmpty = true;  //判断电表信息是否填写完整
    var isRightReg = true;  // 判断电表信息是否符合规矩
    // 校验数据
    $scope.checkNumber=function(meterVo){
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if((meterVo.startAmmeter != null && meterVo.startAmmeter.length > 20) || (meterVo.endAmmeter != null && meterVo.endAmmeter.length > 20) || (meterVo.dayAmmeter != null && meterVo.dayAmmeter.length > 20) || (meterVo.totalEleciric != null && meterVo.totalEleciric.length > 20) || (meterVo.totalAmount != null && meterVo.totalAmount.length > 20) || (meterVo.unitPrice != null && meterVo.unitPrice.length > 20) ){
            utils.msg("数值类型长度不能超过20个字符。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        if((meterVo.startAmmeter != null && !reg.test(meterVo.startAmmeter) )|| (meterVo.endAmmeter != null && !reg.test(meterVo.endAmmeter)  )|| (meterVo.dayAmmeter != null && isNaN(parseFloat(meterVo.dayAmmeter)) )|| (meterVo.totalEleciric != null && !reg.test(meterVo.totalEleciric) )|| (meterVo.totalAmount != null && !reg.test(meterVo.totalAmount) )|| (meterVo.unitPrice != null && !reg.test(meterVo.unitPrice) )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        // 此处修改-----当总用电止度为空的时候校验总电量为负数 meterVo.endAmmeter != null
        if( (meterVo.startAmmeter != null && meterVo.startAmmeter < 0 )|| (meterVo.endAmmeter != null && meterVo.endAmmeter < 0 )|| (meterVo.dayAmmeter != null && meterVo.dayAmmeter < 0 )|| (meterVo.totalEleciric != null && meterVo.totalEleciric < 0  && meterVo.endAmmeter != null)|| (meterVo.totalAmount != null && meterVo.totalAmount < 0)|| (meterVo.unitPrice != null && meterVo.unitPrice < 0 )){
            utils.msg("数值不能为负。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        if(meterVo.remarks != null &&　meterVo.remarks.length > 150){
             utils.msg("备注长度不能超过150个字符。");
                isRightReg = false;
                return;
        }else if(meterVo.remarks != null){
                isRightReg = true;
        }
    }

//最大度数
    $scope.maxReadingsChange=function(item,index){
		item.maxReadings=$("#maxReadings").val();

		 $scope.watthourMeterVOs[index]=item;

	}

	    // 上传拍照图片
    $scope.uploadImg = function(item) {
        $scope.tabUpload=1;
		$scope.watthourMeterID=item.id;
        $scope.uploadImgDialog=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    };
	
	 //查看上传的图片
    $scope.showImg = function(item){
		if(item.accessories==null||item.accessories==""){
			alert("该电表无拍照图片！");
			return;
		}
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        var showUrl = base_url+'/fileOperator/fileDownLoadImg.do?filepath='+item.accessories;	   
        $scope.showUrls = showUrl;
        $scope.uploadImg=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    }
	
	    $scope.files = [];
     // 选择图片
    $scope.change1 = function(ele){
        $scope.files = ele.files;
        $scope.fileName = $scope.files[0].name;	
        var extStart=$scope.fileName.lastIndexOf(".");
        var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
        if(!/\.(gif|jpg|bmp|png|GIF|JPG|PNG|BMP)$/.test(ext)){
            utils.msg("请上传图片,类型必须是.jpg,gif,png,bmp中的一种");
            return;
        }else {
            var objUrl = $scope.getObjectURL($scope.files);
            $(".preview-box").attr("src",objUrl);
            $scope.$apply();
        }

    }


    $scope.uploadFiles = [];    //已上传的文件

    // 上传图片发送后台
    $scope.uploadImgType = function(){
        if($scope.files.length == 0 || $scope.files == null){
            utils.msg("请上传图片！");
            return;
        }
        var base_url = CONFIG.BASE_URL;
		var fileName=$scope.fileName;
        var formData = new FormData($( "#uploadForm1" )[0]);
        $.ajax({
            url:base_url+'/fileOperator/imgUpload.do',
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
					$scope.fileUrl = $scope.getObjectURL($scope.files);
                    $scope.uploadImgDialog.close("");
                    // 上傳成功后清空数据
                    $scope.files = [];
                }
                for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
					if($scope.watthourMeterVOs[i].id==$scope.watthourMeterID){
						$scope.watthourMeterVOs[i].accessories=data.data;
					}
				}
				
            }
        });
    }

	//删除拍照图片
	 $scope.deleteImgType = function(){
		 $scope.files=[];
		 $scope.fileName=null;
		  for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
					if($scope.watthourMeterVOs[i].id==$scope.watthourMeterID){
						$scope.watthourMeterVOs[i].accessories=null;
					}
				}
	    $(".preview-box").attr("src","./assets/img/upload_photo_img.png");
		 $scope.uploadImgDialog.close("");
		 $scope.uploadImgDialog=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
	 }
	
	//计算时间差是否大于6个月
	$scope.compare=function(date1,date2){
		 var newYear = date1.getFullYear();
        var newMonth =date1.getMonth() + 6;
        console.log(newMonth)
        if(newMonth >= 11){
            newYear += 1;
            newMonth -= 11;
            date1.setFullYear(newYear);
            date1.setMonth(newMonth-1);
        }
        else{
            date1.setFullYear(newYear);
            date1.setMonth(newMonth);
        }
        if(date1.getTime() > date2.getTime()){
            return true;//在六个月之内
        }
        else{
            return false;//大于六个月未填写抄表信息
        }
		};
		
	//报销时间与拍照时间相同判断是否填写原因	
	$scope.ack=function(){
		var cause=$("#cause").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause!=""&&cause!=null){//填写原因可以提交
			$scope.closeDialog("exceptionsHintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptionsExplain=cause;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
		//拍照电表读数小于报销电表当前读数判断是否填写原因	
	/*$scope.ack1=function(){
		var cause1=$("#cause1").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause1!=""&&cause1!=null){//填写原因可以提交
			$scope.closeDialog("exceptions1HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions1Explain=cause1;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}*/
	
	//报账点单电表日均电费超1千元判断是否填写原因	
	$scope.ack2=function(){
		var cause2=$("#cause2").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause2!=""&&cause2!=null){//填写原因可以提交
			$scope.closeDialog("exceptions2HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions2Explain=cause2;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//报账点单电表日均电量超1千度判断是否填写原因	
	$scope.ack3=function(){
		var cause3=$("#cause3").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause3!=""&&cause3!=null){//填写原因可以提交
			$scope.closeDialog("exceptions3HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions3Explain=cause3;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//电损占比=稽核单电损电量/稽核单总电量>80%判断是否填写原因	
	$scope.ack4=function(){
		var cause4=$("#cause4").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause4!=""&&cause4!=null){//填写原因可以提交
			$scope.closeDialog("exceptions4HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions4Explain=cause4;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
		//报账点电表单价高于2.5元/度继续提交	
	$scope.ack5=function(){
			$scope.closeDialog("exceptions5HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.isContinue="继续提交";				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
	}
		
    //电费明细提交
    $scope.submitDetail=function(csngDialog){			
        var writedList = [];
		
        //查看有没有填完整的电表
        for(var index=0; index<$scope.watthourMeterVOs.length; index++){
            var meterVo = $scope.watthourMeterVOs[index];			
            $scope.checkNumber(meterVo);  //再次校验
            // 如果翻表为否，删除最大读数；
         //   if(!meterVo.whetherMeter){
          //      delete meterVo.maxReading;
         //   }
            if(!meterVo || !meterVo.belongStartTime || !meterVo.belongEndTime || !meterVo.dayAmmeter || (!meterVo.startAmmeter && meterVo.startAmmeter != 0) || (!meterVo.endAmmeter && meterVo.endAmmeter != 0) || (!meterVo.totalEleciric && meterVo.totalEleciric != 0) || (!meterVo.totalAmount && meterVo.totalAmount != 0) || (!meterVo.unitPrice && meterVo.unitPrice != 0) ){
                isEmpty = false;
            }else if((meterVo.totalAmount != null || meterVo.totalAmount != "0.00") && meterVo.dayAmmeter != null){
              //判断电费总金额(含税)是否大于合同总价包干值
				if(meterVo.totalAmount>$scope.sumXPrice){			
					utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
					return;
				}
				
				//判断合同单价是否>直供电单价*120%，且无分级审批记录				
				if(((meterVo.unitPrice-$scope.zgdUnitPrice*1.2)>0)&&$scope.isUploadOverproof!="有"){
					alert("合同单价("+meterVo.unitPrice+")>直供电单价("+$scope.zgdUnitPrice+")*120%，稽核单生成失败，请于财务系统上传分级审批记录后再试！");
					return;
				}
				
				//判断报销周期是否在合同期限内
				var belongStartDates=new Date(meterVo.belongStartTime);//电费归属起始日期
				var belongEndDates=new Date(meterVo.belongEndTime);//电费归属终止日期
				var startDates=new Date($scope.startDate);//合同生效日期
				var endDates=new Date($scope.endDate);//合同失效日期
				if((belongStartDates.getTime()<startDates.getTime())
					||(belongStartDates.getTime()>endDates.getTime())
				||(belongEndDates.getTime()<startDates.getTime())
				||(belongEndDates.getTime()>endDates.getTime())){ //报销周期未在合同期限内不予报销，弹出提示框
					$scope.exceptions=ngDialog.open({
								template: './tpl/exceptions.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							return;		
				}
				
				//判断报账点电表单价是否高于2.5元/度
				if(meterVo.unitPrice-2.5>0){
					if(meterVo.isContinue==null){//未选择继续提交，弹出提示框
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					$scope.exceptions5HintDialog=ngDialog.open({
								template: './tpl/exceptions5HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							return;	
					}							
				}	
				
			  //判断报账点单电表日均电费是否超1千元
			   if((meterVo.totalAmount/meterVo.dayAmmeter)>1000){//报账点单电表日均电费超1千元，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions2Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions2HintDialog=ngDialog.open({
								template: './tpl/exceptions2HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}	
			   
			   //判断报账点单电表日均电量是否超1千度
			   if((meterVo.totalEleciric/meterVo.dayAmmeter)>1000){//报账点单电表日均电量超1千度，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions3Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions3HintDialog=ngDialog.open({
								template: './tpl/exceptions3HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
				
			   //判断电损占比=稽核单电损电量/稽核单总电量是否>80%
			   if((0-meterVo.electricLoss)==0){
				   meterVo.electricLoss=null;
			   }
			   if(meterVo.electricLoss!=null){
			   if((meterVo.electricLoss/meterVo.totalEleciric)>0.8){//电损占比=稽核单电损电量/稽核单总电量>80%，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions4Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions4HintDialog=ngDialog.open({
								template: './tpl/exceptions4HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
			   }
			   
			   //判断用户填写抄表信息时是否填写完整
				if(meterVo.theTakePhotosTime==""){
					meterVo.theTakePhotosTime=null;
				}
			if((meterVo.theTakePhotosTime!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.electricMeterDeg!=null&&(meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.takePhotosPeopleInfo!=null&&(meterVo.electricMeterDeg==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.accessories!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null))){
					meterVo.theTakePhotosTime=null;
				}
			if((meterVo.electricMeterDeg!=null&&(meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null||meterVo.theTakePhotosTime==null))
				||(meterVo.takePhotosPeopleInfo!=null&&(meterVo.electricMeterDeg==null||meterVo.accessories==null||meterVo.theTakePhotosTime==null))
				||(meterVo.accessories!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null||meterVo.theTakePhotosTime==null))){				
					alert("请完善抄表信息!!");
					return;
				}
				
				//如果本次拍照时间为空或拍照图片为null,则判断是否已有六个月未填写抄表信息										
					if(meterVo.theTakePhotosTime==null||meterVo.accessories==null){
						var myDate = new Date();//获取系统当前时间
						var lastTime=new Date(meterVo.lastTakePhotosTime);	
						$rootScope.lastTimes=meterVo.lastTakePhotosTime;
						var result=$scope.compare(lastTime,myDate);
						if(result){
							//isEmpty = true;
							if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}
						}else{
							//alert("超过六个月未填写抄表信息");
							 $scope.wattTimeDialog=ngDialog.open({
								template: './tpl/wattTimeDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							//isEmpty = false;
							return;							
						}
							
				}else{
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
				
				//判断拍照电表读数是否小于报销电表当前读数				
				if(meterVo.electricMeterDeg!=null){
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
				if((meterVo.electricMeterDeg-meterVo.endAmmeter)<0){ //拍照电表读数小于报销电表当前读数，视为异常需填写原因说明					
					if(meterVo.exceptions1Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions1HintDialog=ngDialog.open({
								template: './tpl/exceptions1HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}					
				}else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}	
				}
				
				//判断报销时间与拍照时间是否相同
					if(meterVo.theTakePhotosTime!=null){
					var myDate = new Date();//获取系统当前时间
					var myDates=$scope.dataChange(myDate);
					var lastTime=meterVo.theTakePhotosTime;
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					//alert((myDates==lastTime)+"=-="+myDate+"---"+lastTime+"---"+meterVo.theTakePhotosTime+"=="+myDates);
					if(myDates==lastTime){
						if(meterVo.exceptionsExplain==null){//如果异常原因没有值，则弹出窗口让用户填写原因说明				
						 $scope.exceptionsHintDialog=ngDialog.open({
								template: './tpl/exceptionsHintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;								
						}else{//若已填写原因，则继续提交
							if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
						}						
					}else{
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
					}
					}
									
            }
        }
        // 多个电表
        if(!isEmpty && $scope.watthourMeterVOs.length > 1){
            for(var index=0; index < $scope.watthourMeterVOs.length; index++){
                var meterVo = $scope.watthourMeterVOs[index];
                // 其中某一个电表为未填写
                if(meterVo.totalAmount == null || meterVo.totalAmount=="0.00"){
                    continue;
                }else if(meterVo.dayAmmeter != null && meterVo.startAmmeter != null && meterVo.endAmmeter != null  && meterVo.totalEleciric !=null && meterVo.unitPrice != null && meterVo.lastTakePhotosTime!=null){                 				
						isEmpty = true;
						break;									                   
                }
            }
            if(isEmpty){
                if(isRightReg){
                    utils.confirm("当前报账点所对应的电表未填写完全，确定要提交吗？","",function(){
                        $scope.closeDialog(csngDialog);
                        setTimeout(utils.msg("已成功添加电表"),1000);
                    });
                    if(!$scope.flagSave  && $scope.flagSave != undefined) {  //查看修改页面时
                        $scope.singleDetail.watthourMeterVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }else {
                        $scope.resultData.watthourExtendVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }
                    $scope.countElectrictyTotPrice();    //计算电表总金额
                }

            }else if((!isEmpty && isRightReg) || isEmpty){
                utils.msg("请至少完成一个电表的必填项再提交。");
            }
        // 单个电表
        }else if($scope.watthourMeterVOs.length == 1){
            if(isEmpty){
                if(isRightReg){
                    $scope.closeDialog(csngDialog);
                    utils.msg("已成功添加电表");
                    if(!$scope.flagSave  && $scope.flagSave != undefined) {  //查看修改页面时
                        $scope.singleDetail.watthourMeterVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }else {
                        $scope.resultData.watthourExtendVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }
                    $scope.countElectrictyTotPrice();    //计算电表总金额
                }
            }else if((!isEmpty && isRightReg) || isEmpty){
                utils.msg("请至少完成一个电表的必填项再提交。");
            }
        }
    };



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
            template: './tpl/upload.html?time='+new Date().getTime(),
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
            url:base_url+'/fileOperator/fileUpload.do',
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
            }
        });
    }


    //查看上传的图片
    $scope.showDetailFiles = function(item){
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test($scope.extt)){
        	var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id;
        	$scope.showUrls = showUrl;
            $scope.uploadFileDialog=ngDialog.open({
                template: './tpl/upload.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                width: 750,
                scope: $scope,
            });
        }else{
        	/*var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id+"&download="+"down";*/
        	 var URL= base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id+"&download="+"down";
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
    $scope.delflag=true;
    //稽核修改页面中删除图片
    $scope.delupfile=function(item){
    	$scope.delflag=true;
    	commonServ.delfile(item.id).success(function(){
    		$scope.delflag=false;
    		
    	});
    };
    

    // 删除对应上传的图片
    $scope.deleteFiles = function(index){
        $scope.uploadFiles.splice(index,1);
    }

    console.log($scope.resultData.attachmentId );

    /**
     * 报账点名称管理
    */
   $scope.showAccountGrop = function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
        $scope.accountSiteDialog=ngDialog.open({
            template: './tpl/accountGrouplist.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

   };


   //获取报账单名称
    $scope.getApageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getAparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };


   /**
    * 获取报账组列表
    */
    $scope.getAccountName = function(name){

        angular.extend($scope.getAparams,{
            "name":name,
        })

        commonServ.queryAccount($scope.getAparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.getApageInfo.totalCount = data.data.totalRecord;
                $scope.getApageInfo.pageCount = data.data.totalPage;
                $scope.getAparams.page = data.data.pageNo;
                $scope.accountList = data.data.results;
            })
        });
    }


   /*
    *@新增或修改报账组弹框
    */

    $scope.addAccountGrop = function(item,flag){
        if(item != null) {
            $scope.isModifyAccount = true;  //修改
            $scope.isAddAccount = false;   //新增
            commonServ.queryAccountDetail(item.id).success(function (data) {
                utils.loadData(data,function (data) {
                    $scope.getAccountDetail = data.data;
                })
            });
        }else {
            $scope.isModifyAccount = false;
            $scope.isAddAccount = true;
        }
        $scope.accountGroupDialog=ngDialog.open({
            template: './tpl/addAccountGroup.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 450,
            scope: $scope,
        });
    }



    /**
     * 保存报账组名称
     */
    $scope.accountObject = {// 新增的报账点名称
        "id":"",
        "name":""
    };
    $scope.addAccountNameSave = function(){
        $scope.accountObject = { // 新增的报账点名称
            "id":"",
            "name":$scope.accountObject.addName
        };

        commonServ.addAccountPage($scope.accountObject).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.accountGroupDialog.close("");
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }



    /**
     * 修改报账组名称
     */
    $scope.modifyAccountNameSave = function(){

        $scope.accountObject = {
            "id":$scope.getAccountDetail.id,
            "name":$scope.getAccountDetail.name
        }

        commonServ.modifyAccount($scope.accountObject).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.accountGroupDialog.close("");
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }


    /**
     * 删除报账组信息
     */
    $scope.deleteAccountSingle = function(item){

        commonServ.deleteAccount(item.id).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }



     /**
     * 选择报账组信息
     */
    $scope.choiceAccountGroup = function(){
        var obj= utils.getCheckedValsForRadio('#sysAccount');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        $scope.accountObject= JSON.parse(obj);
        if(!$scope.flagSave  && $scope.flagSave != undefined) {
            $scope.singleDetail.sysRgName = $scope.accountObject.name;
             $scope.singleDetail.sysRgID=$scope.accountObject.id;
        }else{
            $scope.resultData.sysRgID=$scope.accountObject.id;
        }
        $scope.accountSiteDialog.close("");
    }



/********************************************************新增稽核页面 保存、提交稽核单****************************************************************/

    //新增发票信息  -------
    $scope.addInvoiceVO=function(){
        if($scope.resultData.electrictyMidInvoices.length >= 1){
        	console.log("新增发票信息---------electrictyMidInvoices.length>=1")
            $scope.disabled = false;  // 新添加发票  可
            $scope.resultData.electrictyMidInvoices.unshift({
                "taxAmount":0,   //税金金额
                "electricityAmount":0,//不含税
                "totalAmount":0,//含税noone
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
        }else if($scope.resultData.electrictyMidInvoices.length == 0 && $scope.resultData.totalAmount != "") {
        	console.log("新增发票信息---------electrictyMidInvoices.length=0")
        	var totalAmount = parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2);
        	var taxAmount = parseFloat(totalAmount*($scope.invoiceVOs[0].billTax/100)).toFixed(2);
        	console.log(totalAmount,taxAmount)
        	$scope.disabled = true;
            $scope.resultData.electrictyMidInvoices.unshift({
                "taxAmount":taxAmount,
                "electricityAmount": parseFloat(totalAmount - taxAmount).toFixed(2),
                "totalAmount":totalAmount,
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
        }else {
            utils.msg("当前电费总金额为0,请先选择报账点或添加电表明细！");
             return;
        }
    }




    //删除添加的发票
    $scope.removeInvoiceVO=function(index,item){

        if($scope.resultData.electrictyMidInvoices.length == 1){
            utils.msg("对不起，不能删除最后一张!");
            return;
        }else{
            $scope.resultData.electrictyMidInvoices.splice(index,1);
            if($scope.resultData.electrictyMidInvoices.length == 1){
            	var totalAmount = parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2);
            	var taxAmount = parseFloat(totalAmount*($scope.invoiceVOs[0].billTax/100)).toFixed(2);
            	console.log(totalAmount,taxAmount)
                $scope.disabled = true;
                $scope.resultData.electrictyMidInvoices.invoiceId = $scope.invoiceVOs[0].invoiceId;
                $scope.resultData.electrictyMidInvoices[0].billTax = $scope.invoiceVOs[0].billTax;
                $scope.resultData.electrictyMidInvoices[0].billType = $scope.invoiceVOs[0].billType;
//                $scope.resultData.electrictyMidInvoices[0].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[0].electricityAmount* ($scope.invoiceVOs[0].billTax/100)).toFixed(2);  //税金金额
//                $scope.resultData.electrictyMidInvoices[0].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2) ; //电费金额不含税
                $scope.resultData.electrictyMidInvoices[0].totalAmount = totalAmount;
                $scope.resultData.electrictyMidInvoices[0].taxAmount = taxAmount;
                $scope.resultData.electrictyMidInvoices[0].electricityAmount = parseFloat(totalAmount - taxAmount).toFixed(2);
            
            }
        }
    }


    // 选择发票种类
    $scope.selectInvoiceVOs = function(item,invoiceId,index){

        var invoice=null;
        var items1 =$scope.invoiceVOs[0];
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];			
            if(items.id==invoiceId){
                invoice=items;					
				$scope.invoiceVOs[0]=items;
				$scope.invoiceVOs[i]=items1;
                break;
            }
        }
/*		if(invoice.billType.length>4){
		if(invoice.billType.substring(invoice.billType.length-4,invoice.billType.length)=="(3%)"){
			alert("你选择的发票不能生成稽核单,请从新选择发票！");
		}
		}
		if(invoice.billType.length>5){
		if(invoice.billType.substring(invoice.billType.length-5,invoice.billType.length)=="(17%)"){
			alert("你选择的发票不能生成稽核单,请从新选择发票！");
		}
		}*/
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        console.log(item)
        item.totalAmount = new BigDecimal(item.totalAmount).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//含税
        item.taxAmount = new BigDecimal(item.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 税金金额
        item.electricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(item.taxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//不含税
//        if($scope.disabled){ // 只有一张发票且初始时
          //  item.electricityAmount= parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
           // "taxAmount": new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
          //  "electricityAmount": new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税
//        item.electricityAmount = new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+""; //电费不含税

//        }
       // item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
        
        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
        var sumElectricityAmount = 0;
        var sumElectricityTaxAmount = 0;//税金验证noone
        var sumElectricityElectricityAmount = 0;//不含税验证noone
        for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
            sumElectricityAmount +=
            parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
            sumElectricityTaxAmount+=
            parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
            sumElectricityElectricityAmount+=
            parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount);	
        }
        sumElectricityAmount=sumElectricityAmount.toFixed(2);
        sumElectricityTaxAmount = sumElectricityTaxAmount.toFixed(2);//noone
        sumElectricityElectricityAmount = sumElectricityElectricityAmount.toFixed(2);//noone
        $scope.resultData.electrictyMidInvoices[index]=item;
		//$scope.resultData.electrictyMidInvoices[index].billType=item;
        $scope.checkElectricityAmount = sumElectricityAmount;
        $scope.checkElectricityTaxAmount = sumElectricityTaxAmount;//noone
        $scope.checkElectricityElectricityAmount = sumElectricityElectricityAmount;//noone

    }

   /*******************初始化验证金额数据 含税 不含税 税金*******************************/
    $scope.checkElectricityAmount = 0;  //校验发票金额 == 支付总金额(含税)
    $scope.checkElectricityTaxAmount = 0;//校验发票税金==总税金
    $scope.checkElectricityElectricityAmount = 0;//校验发票金额 == 支付总金额(不含税)
    $scope.editInit = 0;   //手动填写的初始电费金额
    
    
    //手动填写电费金额(含税)noone
    $scope.changeTotalInvoice=function(item,invoiceId,index){
        var invoice=null;
        console.log("手动填写电费金额(含税)--------------------------------noone")
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            console.log(i)
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        console.log(item)
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.totalAmount && item.totalAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.totalAmount && !reg.test(item.totalAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.totalAmount  && item.totalAmount.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if(item.totalAmount ==null || item.totalAmount ==""){
        	utils.msg("请输入需要报销的数额！");
        	return;
        	}
        else{
            $scope.editInit = item.electricityAmount;
            if(item.totalAmount==null || item.totalAmount ==""){
            	item.taxAmount = 0;
            	item.electricityAmount=0;
            }else{
            	item.taxAmount = new BigDecimal(item.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 税金金额
            	item.electricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(item.taxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//不含税
            	
            }
        // 手填自动算出其他的电费不含税
        //
        // if($scope.resultData.electrictyMidInvoices.length == 2){

        //     for(var j= 0; j<$scope.resultData.electrictyMidInvoices.length; j++){
        //         if(index != [j]){
        //             $scope.resultData.electrictyMidInvoices[j].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost-$scope.editInit-item.taxAmount)/(($scope.resultData.electrictyMidInvoices[j].billTax/100)+1)).toFixed(2);
        //             $scope.resultData.electrictyMidInvoices[j].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount*($scope.resultData.electrictyMidInvoices[j].billTax/100)).toFixed(2);


        //         }
        //     }

        // }

            

        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            var sumElectricityAmount = 0;
            var sumElectricityTaxAmount = 0;//总税金
            var sumElectricityElectricityAmount = 0;//不含税
            for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
                sumElectricityTaxAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);	
                sumElectricityElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount);	
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            sumElectricityTaxAmount = sumElectricityTaxAmount.toFixed(2);
            sumElectricityElectricityAmount = sumElectricityElectricityAmount.toFixed(2);
            $scope.resultData.electrictyMidInvoices[index]=item;
            $scope.checkElectricityAmount = sumElectricityAmount;
            $scope.checkElectricityTaxAmount = sumElectricityTaxAmount;
            $scope.checkElectricityElectricityAmount = sumElectricityElectricityAmount;
        }
    }
  //手动填写电费税金 noone,允许调整的值+-0.01
    $scope.changeTaxAmountInvoice=function(item,invoiceId,index){
        var invoice=null;
        console.log("手动填写税金--------------------------------noone")
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            console.log(i)
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        console.log(item)
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.totalAmount && item.totalAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.totalAmount && !reg.test(item.totalAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.totalAmount  && item.totalAmount.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if(item.totalAmount ==null || item.totalAmount ==""){
        	utils.msg("请输入需要报销的数额！");
        	return;
        }else{
        	//需要把税金保存起来，做改变
        	var stepTaxAmount = item.taxAmount;
        	var stepElectricityAmount  = item.electricityAmount;
        	console.log(stepTaxAmount,stepElectricityAmount)
        	var oldtaxAmount = new BigDecimal(item.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 旧税金金额
            var oldelectricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(oldtaxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//旧不含税
            $scope.editInit = item.electricityAmount;
            console.log(oldtaxAmount,oldelectricityAmount)
            console.log(stepTaxAmount-oldtaxAmount)
            var stepAvg = (stepTaxAmount-oldtaxAmount).toFixed(2);
            console.log(stepAvg)
            if(stepAvg>0.01 || stepAvg<-0.01){
            	utils.msg("允许修改的数据0.01元");
            	item.taxAmount =  oldtaxAmount;    // 税金金额
            	item.electricityAmount = oldelectricityAmount;//不含税
            	return;
            }else{
            	item.taxAmount = stepTaxAmount;//税金金额
            	item.electricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(stepTaxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//不含税
            }
//            if(item.totalAmount==null || item.totalAmount ==""){
//            	item.taxAmount = 0;
//            	item.electricityAmount=0;
//            }else{
//            	item.taxAmount = new BigDecimal(item.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 税金金额
//            	item.electricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(item.taxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//不含税
//            	
//            }

            

        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            var sumElectricityAmount = 0;
            var sumElectricityTaxAmount = 0;//总税金
            var sumElectricityElectricityAmount = 0;//不含税
            for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
                sumElectricityTaxAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);	
                sumElectricityElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount);	
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            sumElectricityTaxAmount = sumElectricityTaxAmount.toFixed(2);
            sumElectricityElectricityAmount = sumElectricityElectricityAmount.toFixed(2);
            $scope.resultData.electrictyMidInvoices[index]=item;
            $scope.checkElectricityAmount = sumElectricityAmount;
            $scope.checkElectricityTaxAmount = sumElectricityTaxAmount;
            $scope.checkElectricityElectricityAmount = sumElectricityElectricityAmount;
        }
    }
    //手动填写电费金额(不含税)，此controller中没有用到这个
    $scope.changeInvoice=function(item,invoiceId,index){
        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.electricityAmount && item.electricityAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.electricityAmount && !reg.test(item.electricityAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.electricityAmount  && item.electricityAmount .length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else{
            $scope.editInit = item.electricityAmount;
            item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额

        // 手填自动算出其他的电费不含税
        //
        // if($scope.resultData.electrictyMidInvoices.length == 2){

        //     for(var j= 0; j<$scope.resultData.electrictyMidInvoices.length; j++){
        //         if(index != [j]){
        //             $scope.resultData.electrictyMidInvoices[j].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost-$scope.editInit-item.taxAmount)/(($scope.resultData.electrictyMidInvoices[j].billTax/100)+1)).toFixed(2);
        //             $scope.resultData.electrictyMidInvoices[j].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount*($scope.resultData.electrictyMidInvoices[j].billTax/100)).toFixed(2);


        //         }
        //     }

        // }



        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            var sumElectricityAmount = 0;
            for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            $scope.resultData.electrictyMidInvoices[index]=item;
            $scope.checkElectricityAmount = sumElectricityAmount;
        }
    }



    //取消返回页面
    $scope.returnPage = function(){
        $state.go('app.inputTariff',{
            'status':'tariff/sumbit'
        });
    }

	//保存选择的部门名
	$scope.selectDepartmentName = function(data){
		if(data==null){
			 utils.msg("请选择一个部门！");
			 return;
		}
		$scope.resultData.departmentName=data;
		utils.msg("你选择了部门:"+data);
	};

    // 保存新增稽核单
    $scope.saveElectricty=function(status){
//    	console.log($rootScope.exitStatus,$rootScope.roomStatus,$rootScope.AccountSiteId);
//		console.log($scope.resultData.sysAccountSiteId)
    	console.log($scope.resultData);
    	var adpv = $scope.resultData.adpv;
        var checkTotal = $scope.resultData.totalAmount;
        var checkTotal2 = $scope.checkElectricityAmount;
        console.log("122222222222"+checkTotal)
        console.log("122222222222"+checkTotal2)
        //验证税金总额是否正确
        if( checkTotal!= checkTotal2){
            return utils.msg("发票金额和电表金额不一致!");
        }
    	//设置总核销预付金额
    	if(adpv!=null && adpv!=""){
    		var allExpenseAmount = 0;//本次总共想要核销的金额
        	for(var i=0;i<adpv.length;i++){
        		allExpenseAmount += adpv[i].expenseAmount*1;
        	}
        	$scope.resultData.expenseTotalAmount=allExpenseAmount;
    	}
    	// debugger;
    	var checkPay =  $scope.countMoney2();
    	if(checkPay==0){
    		utils.msg("预付核销金额大于总金额!");
            return;
    	}
    	
    	if($scope.resultData.contractID==null){
			 utils.msg("请选择合同后再提交！");
            return;
		}
    	
    	//检测退网状态是否填写
    	var isOnline = $("#isOnline").val();
    	if(isOnline==null || isOnline==""){
    		utils.msg("请选择在网状态后再提交");
    		return;
    	}else{
    		if($scope.accountRoomIsOnline.onlineRoomNum == 0 && isOnline=="1"){
    			utils.msg("该报账点不存在在网机房，请核对信息后再提交！");
    			return;
    		}
    		if($scope.accountRoomIsOnline.noOnLineRoomNum == 0 && isOnline=="2"){
    			utils.msg("该报账点不存在退网机房，请核对信息后再提交！");
    			return;
    		}
    		$scope.resultData.isOnline = isOnline;	//将选择的在网状态存入提交数据中
    	}
    	
        if($scope.resultData.watthourExtendVOs.length == 0 ){
            utils.msg("电表信息,请认真填写后再提交！");
            return;
        }else if($scope.checkElectricityAmount && $scope.checkElectricityAmount<$scope.resultData.paymentAmount*1+$scope.resultData.expenseTotalAmount*1) {
            utils.msg("手动填写金额加核销金额需小于等于支付总金额,请重新填写后再提交!");
            return;
        }else{
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.viewMaxReading;
            }
            if($scope.uploadFiles.length > 0){
                for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
                }
            }
            delete  $scope.resultData.sysSupplierName;   //526暂时隐藏
            $scope.resultData.status = status;
            $scope.resultData.productNature = $scope.siteObject.productNature;
            console.log("resultData" , angular.toJson($scope.resultData,true));
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
/*			if($scope.resultData.electrictyMidInvoices.length>0){
				for(var i=0;i<$scope.resultData.electrictyMidInvoices.length;i++){
					 var items =$scope.resultData.electrictyMidInvoices[i];				 
				if(items.billType.length>4){
					if(items.billType.substring(items.billType.length-4,items.billType.length)=="(3%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				if(items.billType.length>5){
					if(items.billType.substring(items.billType.length-5,items.billType.length)=="(17%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				}
				
			}*/
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }
//            console.log($rootScope.exitStatus,$rootScope.roomStatus,$rootScope.AccountSiteId);
//            $scope.resultData.exitStatus = $rootScope.exitStatus;
//            $scope.resultData.roomStatus = $rootScope.roomStatus;
//            $scope.resultData.sysAccountSiteId=$rootScope.AccountSiteId;
            commonServ.saveElectricty($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $state.go('app.inputTariff',{
                        'status':'tariff/sumbit'
                    });
                });
            });
        }
    }

    // 提交新增稽核单
    $scope.submitElectricty=function(status){
    	console.log($scope.resultData);
    	var adpv = $scope.resultData.adpv;	//预付核销数据，数据格式  [{},{}...]
        var checkTotal = $scope.resultData.totalAmount;
        var checkTotal2 = $scope.checkElectricityAmount;
        console.log("submitElectricty"+checkTotal)
        console.log("submitElectricty"+checkTotal2)
        //验证税金总额是否正确
        if( checkTotal!= checkTotal2){
            return utils.msg("发票金额和电表金额不一致!");
        }
    	//设置总核销预付金额
    	if(adpv!=null && adpv!=""){
    		var allExpenseAmount = 0;	//本次总共想要核销的金额
        	for(var i=0;i<adpv.length;i++){
        		allExpenseAmount += adpv[i].expenseAmount*1;
        	}
        	$scope.resultData.expenseTotalAmount=allExpenseAmount;	//总预付核销数据
    	}
    	var checkPay =  $scope.countMoney2();	//预付核销金额与总金额进行比较
    	if(checkPay==0){
    		utils.msg("预付核销金额大于总金额!");
            return;
    	}
		if($scope.resultData.contractID==null){
			 utils.msg("请选择合同后再提交！");
            return;
		}
		
		//检测退网状态是否填写
    	var isOnline = $("#isOnline").val();
    	if(isOnline==null || isOnline==""){
    		utils.msg("请选择在网状态后再提交");
    		return;
    	}else{
    		if($scope.accountRoomIsOnline.onlineRoomNum == 0 && isOnline=="1"){
    			utils.msg("该报账点不存在在网机房，请核对信息后再提交！");
    			return;
    		}
    		if($scope.accountRoomIsOnline.noOnLineRoomNum == 0 && isOnline=="2"){
    			utils.msg("该报账点不存在退网机房，请核对信息后再提交！");
    			return;
    		}
    		$scope.resultData.isOnline = isOnline;	//将选择的在网状态存入提交数据中
    	}
		
        if($scope.resultData.watthourExtendVOs.length == 0 ){
            utils.msg("电表信息,请认真填写后再提交！");
            return;
        }else if($scope.checkElectricityAmount && $scope.checkElectricityAmount<$scope.resultData.paymentAmount*1+$scope.resultData.expenseTotalAmount) {
            utils.msg("手动填写金额加核销金额需小于等于支付总金额,请重新填写后再提交!");
            return;
        }else{
        	$scope.oldresultData=$scope.resultData;	//将原数据另行保存
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.viewMaxReading;

            }
            if($scope.uploadFiles.length > 0){
                for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
                }
            }
          //  delete  $scope.resultData.sysSupplierName;   //526暂时隐藏
            $scope.resultData.status = status;	//状态为1指提交
            $scope.resultData.productNature = $scope.siteObject.productNature;
            console.log("resultData" , angular.toJson($scope.resultData,true));
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
/*			if($scope.resultData.electrictyMidInvoices.length>0){
				for(var i=0;i<$scope.resultData.electrictyMidInvoices.length;i++){
					 var items =$scope.resultData.electrictyMidInvoices[i];				 
				if(items.billType.length>4){
					if(items.billType.substring(items.billType.length-4,items.billType.length)=="(3%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				if(items.billType.length>5){
					if(items.billType.substring(items.billType.length-5,items.billType.length)=="(17%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				}
				
			}*/
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if(!$scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }
            
//            console.log($rootScope.exitStatus,$rootScope.roomStatus,$rootScope.AccountSiteId);
//            $scope.resultData.exitStatus = $rootScope.exitStatus;
//            $scope.resultData.roomStatus = $rootScope.roomStatus;
            console.log($scope.resultData);
            //检测是否超标杆
            if(status==1 && ($scope.resultData.overproofReasons==null || $scope.resultData.overproofReasons.length==0)){	//如果为提交，并且超标信息没有的时候进行超标杆检测
            	commonServ.checkElePowerInSub($scope.resultData).success(function(data){
            		if(data.data=="未超标杆值"){
            			commonServ.saveElectricty($scope.resultData).success(function(data){
                    		utils.ajaxSuccess(data,function(data){
                    			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
                    			$state.go('app.auditTariff',{
                    				'status':'tariff/audit'
                    			});
                    		});
                    	});
            		}else{
            			$scope.subErrData=data.data;
            			 $scope.overhtml1=ngDialog.open({
             	            template: './tpl/over11.html?time='+new Date().getTime(),
             	            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
             	            width: 750,
             	            controller:'addOrUpdateAuditCtrl',
             	            scope: $scope
             	        });
             		    $scope.changeOther=function(){
             		    	var other=$("[name='other']").find("option:selected").text();
             		    	$scope.overproofReasons=other;
             		    };
            		}
            	})
            	
            }else{
            	commonServ.saveElectricty($scope.resultData).success(function(data){
            		utils.ajaxSuccess(data,function(data){
            			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
            			$state.go('app.auditTariff',{
            				'status':'tariff/audit'
            			});
            		});
            	});
            }
        }
    }
    $scope.ack1=function(){
		//console.log("hamapi");
    	// debugger;
		var cause1=$("#cause1").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause1!=""&&cause1!=null){//填写原因可以提交
			console.log(cause1)
			if($scope.exceptions1HintDialog){
				$scope.exceptions1HintDialog.close("");
				//$scope.resultData=$scope.oldresultData;
				for(var i=0;i<$scope.watthourMeterVOs.length;i++){
					var meterVo = $scope.watthourMeterVOs[i];
					if(meterVo.watthourId==$rootScope.wattID){
						meterVo.exceptions1Explain=cause1;				
					}
				}
			//	$scope.resultData.overproofReasons=cause1;
			
				$scope.submitDetail('accountSiteDialog'); //调用电费明细提交，再次判断
				return;		
			}else if($scope.overhtml1){
				$scope.overhtml1.close("");
				$scope.resultData = $scope.oldresultData;
				$scope.resultData.overproofReasons = cause1;
				$scope.submitElectricty( $scope.resultData.status);
				
			}
			
			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}

/********************************************************自维电费录入 查看、修改稽核单****************************************************************/

    /**
     * @自维电费录入修改------添加发票、手动添加、修改发票
     */
    $scope.editInvoiceVO = function(){
        if($scope.singleDetail.totalAmount != "" || !$scope.flagSave  && $scope.flagSave != undefined) {  //有数据才可添加发票
            $scope.isEditAudit = true;
            $scope.isAudit = false;
            if($scope.electrictyMidInvoices.length>=1){
                $scope.disabled = false;
                $scope.electrictyMidInvoices.unshift({
                    "taxAmount":0,   //税金金额
                    "electricityAmount":0,
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else{
                $scope.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
        }
    }


    /**
     * @async
     */
    //删除添加的发票
    $scope.removeEditInvoiceVO=function(index,item){

        if($scope.electrictyMidInvoices.length == 1){
            item.electricityAmount= parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
            utils.msg("对不起，不能删除最后一张!");
            return;
        }else{
            $scope.electrictyMidInvoices.splice(index,1);
            if($scope.electrictyMidInvoices.length == 1){
                $scope.disabled = true;
                $scope.electrictyMidInvoices[0].electricityAmount = parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / (($scope.electrictyMidInvoices[0].billTax/100)+1)).toFixed(2) ; //电费金额不含税
                $scope.electrictyMidInvoices.invoiceId = $scope.electrictyMidInvoices[0].invoiceId;
                $scope.electrictyMidInvoices[0].billTax = $scope.electrictyMidInvoices[0].billTax;
                $scope.electrictyMidInvoices[0].billType = $scope.electrictyMidInvoices[0].billType;
                $scope.electrictyMidInvoices[0].taxAmount = parseFloat($scope.electrictyMidInvoices[0].electricityAmount* ($scope.electrictyMidInvoices[0].billTax/100)).toFixed(2);  //税金金额
            }
        }
    }


    // 选择发票种类--修改电费录入
    $scope.selectEditInvoiceVOs = function(item,invoiceId,index){
        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率

        if($scope.electrictyMidInvoices.length ==1 && item.electricityAmount != 0){   // 只有一张发票时
            item.electricityAmount= parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
        }

        item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
        $scope.electrictyMidInvoices[index]=item;
        var sumElectricityAmount = 0;
        for(var j=0; j<$scope.electrictyMidInvoices.length; j++){
            sumElectricityAmount +=
            parseFloat($scope.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.electrictyMidInvoices[j].taxAmount);
        }
        sumElectricityAmount=sumElectricityAmount.toFixed(2);
        $scope.checkAmount = sumElectricityAmount;   //需要校验的金额

    }




    $scope.editInitAudit = 0;   //手动填写的初始电费金额
    $scope.checkAmount = 0;  // 修改校验支付总金额 == 发票金额 + 总金额不含税
    //手动填写电费金额(不含税)--修改电费录入
    $scope.changeEditInvoice=function(item,invoiceId,index){

        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.electricityAmount && item.electricityAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.electricityAmount && !reg.test(item.electricityAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.electricityAmount  && item.electricityAmount .length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else{
            $scope.editInitAudit  = item.electricityAmount;
            item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
            $scope.electrictyMidInvoices[index]=item;
            //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            // $scope.taxAmount = sumElectricityAmount;
            var sumElectricityAmount = 0;
            for(var j=0; j<$scope.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.electrictyMidInvoices[j].taxAmount);
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            $scope.checkAmount = sumElectricityAmount;   //需要校验的金额

        }

    }


	
     // 手动填写其他费用(电费录入修改)
    $scope.countTotal = function(){
		
		if($scope.singleDetail.otherCost==null||$scope.singleDetail.otherCost==""){
			$scope.singleDetail.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if($scope.singleDetail.otherCost && !reg.test($scope.singleDetail.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.singleDetail.otherCost && $scope.singleDetail.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.singleDetail.otherCost && $scope.singleDetail.otherCost < 0){
            utils.msg("数值不能为负。");
            return;
        }else if($scope.singleDetail.otherCost){
			 $scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmounts).add(new BigDecimal($scope.singleDetail.otherCost))+"";  //支付总金额
        $scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmounts).add(new BigDecimal($scope.singleDetail.otherCost))+""; //总金额（含税）+=其他金额

           // $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost).toFixed(2);  //支付总金额
        }else {
			$scope.singleDetail.paymentAmount = $scope.singleDetail.totalAmount;
			$scope.singleDetail.totalAmount = $scope.singleDetail.totalAmount;
			
           // $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount).toFixed(2);
        }
		if($scope.singleDetail.otherCost=="0"){
			$scope.singleDetail.otherCost=null;
		}
		
        if($scope.singleDetail.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
            $scope.singleDetail.electrictyMidInvoices.splice(0,1,{
				"taxAmount": new BigDecimal($scope.singleDetail.totalAmount).multiply(new BigDecimal($scope.singleDetail.electrictyMidInvoices[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
                "electricityAmount": new BigDecimal($scope.singleDetail.totalAmount).subtract(new BigDecimal($scope.singleDetail.totalAmount).multiply(new BigDecimal($scope.singleDetail.electrictyMidInvoices[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税

				//"taxAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
               // "electricityAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.singleDetail.electrictyMidInvoices[0].id,
                "billType":$scope.singleDetail.electrictyMidInvoices[0].billType,
                "billTax":$scope.singleDetail.electrictyMidInvoices[0].billTax,
            })
        }
    }



    /**
     * @ 电费录入页面-----修改保存稽核单
    */
    $scope.editZiweiElectricty=function(status){
        $scope.resultData = {
            "id":$scope.editZiweiID,
            "status":status,
            "costCenterID":$scope.singleDetail.costCenterID,
            "towerSiteNumber":$scope.singleDetail.towerSiteNumber,
            "serialNumber":$scope.singleDetail.serialNumber,
            "productNature":$scope.singleDetail.productNature,
            "sysAccountSiteId":$scope.singleDetail.sysAccountSiteId,  //报账点ID
            "taxAmount":$scope.singleDetail.taxAmount,
            "otherCost":$scope.singleDetail.otherCost,
            "totalAmount":$scope.singleDetail.totalAmount,
            "paymentAmount":$scope.singleDetail.paymentAmount,
            "sysSupplierID":$scope.singleDetail.supplierID,
            "attachmentId":[],
            "adpv":$scope.singleDetail.adpv,
            "watthourExtendVOs":$scope.singleDetail.watthourMeterVOs,
            "electrictyMidInvoices":$scope.electrictyMidInvoices,
            "sysRgID":$scope.singleDetail.sysRgID,
            "contractID":$scope.singleDetail.contractID,  //合同ID
			"departmentName":$scope.singleDetail.departmentName, //部门名
			"overproofReasons":$scope.singleDetail.overproofReasons,
            "remark":$scope.singleDetail.remark,
            "payType":$scope.singleDetail.payType,
            "professional":$scope.singleDetail.professional
        }
        if($scope.checkAmount && $scope.checkAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }
        for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
            var obj= $scope.resultData.watthourExtendVOs[i];
                delete  obj.reimbursementDate;
                delete  obj.status;
                delete  obj.id;
                delete  obj.code;
                delete  obj.paymentAccountCode;
                delete  obj.ptype;
                delete  obj.rate;
                delete  obj.maxReading;
                delete  obj.currentReading;
                delete  obj.belongAccount;
                delete  obj.damageNum;
                delete  obj.damageDate;
                delete  obj.damageInnerNum;
                delete  obj.damageMeterNum;
                delete  obj.reimbursementDateStr;
                delete  obj.currentReadingStr;
                delete  obj.accountSiteId;
                delete  obj.accountName;
                delete  obj.oldFinanceName;
                delete  obj.mid;
                delete  obj.count;
                delete  obj.cityId;
                delete  obj.countyId;
                delete  obj.price;
                delete  obj.updateTimeStr;
                delete  obj.viewMaxReading;
        }
        // 附件信息
        if($scope.uploadFiles.length> 0){
            for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                $scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
            }
        }
/*        if($scope.singUploadFiles){
            for(var fileId=0; fileId < $scope.singUploadFiles.length; fileId++){
                $scope.resultData.attachmentId.push($scope.singUploadFiles[fileId].id);
            }
        }*/
        if($scope.singleDetail.productNature == "自维") {
            $scope.resultData.productNature = "0";
        }else {
            $scope.resultData.productNature = "1";
        }

        delete $scope.resultData.name;
        console.log("resultData" , angular.toJson($scope.resultData,true));
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
            utils.msg("备注信息不能超过150个字符。");
            return;
        }
       
        if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
            utils.msg("支付总金额不能为负。");
            return;
        }
        if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }
        for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
            var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
            if(metert && metert < 0){
                utils.msg("数值不能为负。");
                return;
            }else if(metert && !reg.test(metert)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if(metert  && metert.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
        }
        console.log($scope.resultData);
        commonServ.modifyElectricty($scope.resultData).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.closeDialog('showZweiDialog');
                $scope.getZiweiData();
            });
        });

    }


/********************************************************自维电费稽核 查看、修改稽核单****************************************************************/

        /**
         * @ 电费稽核页面  修改保存稽核单
        */

        $scope.editZiweiAudit=function(){
            $scope.resultData = {
                "instanceId":$scope.instanceId,
                "id":$scope.editZiweiID,
                "status":status,
                "costCenterID":$scope.singleDetail.costCenterID || null,
                "towerSiteNumber":$scope.singleDetail.towerSiteNumber,
                "serialNumber":$scope.singleDetail.serialNumber,
                "sysAccountSiteId":$scope.singleDetail.sysAccountSiteId,  //报账点ID
                "otherCost":$scope.singleDetail.otherCost,
                "totalAmount":$scope.singleDetail.totalAmount,
                "paymentAmount":$scope.singleDetail.paymentAmount,
                "sysSupplierID":$scope.singleDetail.supplierID || null,
                "attachmentId":[],
                "watthourExtendVOs":$scope.singleDetail.watthourMeterVOs,
                "electrictyMidInvoices":$scope.electrictyMidInvoices,
                "remark":$scope.singleDetail.remark,
                "contractID":$scope.singleDetail.contractID,  //合同ID
				"departmentName":$scope.singleDetail.departmentName, //部门名
				"overproofReasons":$scope.singleDetail.overproofReasons,
                "sysRgID":$scope.singleDetail.sysRgID
            }
            if($scope.checkAmount && $scope.checkAmount!=$scope.resultData.paymentAmount) {
                utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
                return;
            }
            for(var i=0; i<$scope.singleDetail.watthourMeterVOs.length; i++){
                if($scope.singleDetail.watthourMeterVOs[i].whetherMeter == "是") {
                    $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "1";
                }else {
                    $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "0";
                }
            }
            // 附件信息
            if($scope.singUploadFiles!=null){
                if($scope.singUploadFiles.length>0){
                    for(var fileId=0; fileId < $scope.singUploadFiles.length; fileId++){
                        $scope.resultData.attachmentId.push($scope.singUploadFiles[fileId].id);
                    }
                }
            };
            if($scope.uploadFiles.length>0){
            	for(var i=0;i<$scope.uploadFiles.length;i++){
            		$scope.resultData.attachmentId.push($scope.uploadFiles[i].id);
            	}
            };

            // 电表信息
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.price;
                    delete  obj.updateTimeStr;
                    delete  obj.viewMaxReading;

            }
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }

            commonServ.editAduit($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.closeDialog('showZweiAuditDialog');
                    $scope.getZwAuditDetail();
                });
            });
        }

}]);













/**
 *  综合自维新增稽核单 addOrUpdateZAuditCtrl 公用模块（包含电费录入--新增稽核单   电费录入--修改、查看稽核单   电费稽核---修改、查看稽核单）
 */
app.controller('addOrUpdateZAuditCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

    /**
     * [resultData description] 新建稽核单数据
     * @type {Object}
     */
    $scope.resultData={

        "serialNumber":new Date().getTime(),
        "sysAccountSiteId":"",//报账点ID
        "status":"",//状态
        "productNature":"",
        "costCenterID":"",//成本中心ID
        "towerSiteNumber":"",//铁塔站点编号
        "shareElectricity":"",//分摊电费金额
        "invoiceId":"",//发票类型ID
        "taxAmount":"",//税金金额
        "electricityAmount":"",//电费金额
        "otherCost":"",//其他费用
        "totalAmount":"",//总金额
        "expenseTotalAmount":0,//核销总金额
        "paymentAmount":"",//支付总金额
        "attachmentId":[],//附件　ids
        "watthourExtendVOs":[],//各电表信息,
        "sysSupplierID":"",//供应商ID
        "electrictyMidInvoices":[],  // 自维电费金额及发票信息
        //"sysSupplierName":"",//供应商名称
		"supplierName":"",//供应商名称
        "sysRgID":"", // 报账组名称
        "contractID":"", //合同ID
		"departmentName":"", //部门名
		"overproofReasons":"",//超标原因
        "remark":"",
        "payType":-1,//缴费类型
        "professional":"",//所属专业
        "auditType":1//稽核类型

    }


/********************************************************新增稽核和电费录入公共部分****************************************************************/
    // 电费录入修改稽核单状态
    $scope.isAudit = true;        //修改稽核單狀態
    $scope.isEditAudit = false;   //查看稽核單狀態

    //发票信息
    $scope.invoiceVOs=[];
    //获取稽核单号、地市、区县、发票信息
    commonServ.getInputElectrictyAddInfo().success(function(data){
        $scope.resultData.serialNumber=data.serialNumber;  // 稽核单号
        $scope.resultData.areas=data.areas;                // 地市
        $scope.resultData.counties=data.counties;          // 区县
        $scope.invoiceVOs=data.invoiceVOs;                 // 发票信息
    });
    


    //获取成本中心列表
    $scope.costCeterVOs=[];
    commonServ.getInputElectrictyCostCeterVOsInfo().success(function(data){
        utils.loadData(data,function(data){
            if(data.data.length>0){
                $scope.costCeterVOs=data.data;
                $scope.resultData.costCenterID = $scope.costCeterVOs[0].id;
            }
        })
    });

	 //保存选择的成本中心
	$scope.selectCostCenter = function(data){		
		if(data==null){
			 utils.msg("请选择一个成本中心！");
			 return;
		}
		$scope.resultData.costCenterID=data;   //保存选择的成本中心ID
	};
    
    //选择缴费类型
    $scope.selectpayType=function(payType){
    	$scope.resultData.payType=payType;
    	if(payType<=1){
    		$scope.resultData.professional="无线";
    	}else{
    		$scope.resultData.professional="全业务";
    	}
    };


    //获取报账单名称
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
    
    //核销计算
    $scope.countMoney=function(){
    	if($scope.resultData.expenseTotalAmount==null ||$scope.resultData.expenseTotalAmount==''){
    		$scope.resultData.expenseTotalAmount=0;
    		$scope.resultData.paymentAmount=$scope.resultData.totalAmount;
    	}
    	if(parseFloat($scope.resultData.expenseTotalAmount)>parseFloat($scope.adpv.surplusMoney)){
    		utils.msg("核销金大于剩余预付金额")
    	}else if(parseFloat($scope.resultData.expenseTotalAmount)>parseFloat($scope.resultData.paymentAmount)){
    		utils.msg("核销金大于这次报销金")
    	}else{
    		$scope.resultData.paymentAmount=($scope.resultData.paymentAmount-$scope.resultData.expenseTotalAmount).toFixed(2);
    	}
    };


    //获取报账点列表
    $scope.getData=function(siteName){
        angular.extend($scope.params,{
            "cityId":$rootScope.userCityId,
            "countyId":$rootScope.userCountyId,
            "siteName":$("#siteName").val(),
            // "accountName":$scope.accountName,
            // "accountAlias":$scope.accountAlias,
            // "oldFinanceName":$scope.oldFinanceName,
            // "resourceName":$scope.resourceName
        })
        commonServ.querySiteInfoPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    $scope.confvv = [];  //报账点
    $scope.confs = []; //供货商

    // 获取报账点弹框
    $scope.siteObject={};   //返回countyId
    $scope.getAccountSite=function(){
        $scope.accountSiteDialog=ngDialog.open({
            template: './tpl/reimburDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }


    // 查询是否包干  产权性质
    $scope.getIsClud=function(siteId){
        commonServ.getInputElectrictyDetail(siteId).success(function (data) {
            if(data.isClud == 1){
                $scope.isCludInfoDetail = "包干";
            }else if(data.isClud == 0){
                $scope.isCludInfoDetail = "不包干";
            }else {
                $scope.isCludInfoDetail = "";
            }
        });
    }



    // 选择报账点名称  新增稽核、电费录入修改
    $scope.choiceAccountSite=function(){
    	
    	$scope.bbelongStartTime="";
		$scope.bbelongEndTime="";
		
		$scope.resultData.contractID=null;
        $scope.isAudit = false;
        $scope.isEditAudit = true;
        var obj= utils.getCheckedValsForRadio('#siteList');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        $scope.meterNum="";//noone清空电表数
        $scope.siteObject= JSON.parse(obj);
		$rootScope.AccountSiteId=$scope.siteObject.id;//保存报账点id
		$rootScope.AccountSiteName=$scope.siteObject.accountName;//保存报账点名称
        $scope.resultData.sysAccountSiteId=$scope.siteObject.id;//报账点id
       // $scope.getIsClud($scope.siteObject.id);  //是否包干
       // $scope.getSuppliers($scope.siteObject.id); //查询对应的供应商
		$scope.getContract($scope.siteObject.id); //查询对应的合同id
        if($scope.siteObject.productNature == 0) {
            $scope.productNatureType = "自维";
        }else {
            $scope.productNatureType = "塔维";
        }

        // 修改页面
        if(!$scope.flagSave  && $scope.flagSave != undefined) {
            $scope.singleDetail.sysAccountSiteId = $scope.siteObject.id;         // 报账点ID
            $scope.singleDetail.accountName = $scope.siteObject.accountName;     //报账点名称
            $scope.singleDetail.accountAlias = $scope.siteObject.accountAlias;  //报账点别名
            //选择报账点后清空页面上原有数据
            $scope.singleDetail.paymentAmount = "";   //支付总金额
            $scope.singleDetail.otherCost = "";       //其他费用
            $scope.singleDetail.totalAmount = "";     //总金额
            $scope.singleDetail.sysSupplierName = ""; //供货商名称
            if($scope.electrictyMidInvoices.length >= 0){
                $scope.electrictyMidInvoices = [];  //发票信息
            }
            if($scope.watthourMeterVOs &&　$scope.watthourMeterVOs.length > 0){
                $scope.watthourMeterVOs = [];
            }

        }else {
             //清空原有数据 新增
            $scope.resultData.paymentAmount = "";   //支付总金额
            $scope.resultData.otherCost = "";       //其他费用
            $scope.resultData.totalAmount = "";     //总金额
            $scope.resultData.sysSupplierName = ""; //供货商名称
            if($scope.resultData.electrictyMidInvoices.length >= 0){
                $scope.resultData.electrictyMidInvoices = [];  //发票信息
            }
            $scope.accountObject.name = ""; // 报账组信息
            if($scope.resultData.watthourExtendVOs &&　$scope.resultData.watthourExtendVOs.length > 0){
                $scope.resultData.watthourExtendVOs = [];
            }
            // 清空页面上的电表数据信息
            if($scope.watthourMeterVOs && $scope.watthourMeterVOs.length > 0){
                $scope.watthourMeterVOs = [];
            }
        }

        $scope.closeDialog('accountSiteDialog');
    }



    //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }


     //根据报账点查找对应的供应商（与报账点的缴费类型与所属专业）
    $scope.getSuppliers=function(countyId){
    	//查找缴费类型
        $scope.getPayTypeById(countyId);
        commonServ.getSupplierName(countyId).success(function(data){
            utils.loadData(data,function(data){
                if(data.data == null){
                    // utils.msg("该站点无供应商信息,请选择一个默认供应商");
                    return;
                }else {
                    $scope.resultData.sysSupplierName=data.data.name;
                    $scope.resultData.sysSupplierID=data.data.id;
                    //查找供应商的预付单
                    $scope.getPreBySuId($scope.resultData.sysSupplierID);
                }
            })
        });
    }
    
    $scope.flagg=false;
  //查找供应商的预付单
    $scope.getPreBySuId=function(suId){
    	commonServ.getPreBySuId(suId).success(function(data){
    		$scope.adpv=data.data;
    		if($scope.adpv!=null){
    			$scope.flagg=true;
    		}else{
    			$scope.flagg=false;
    		}
    		
    	})
    }
    
    $scope.payTypeFlag=false;
  //查找缴费类型
    $scope.getPayTypeById=function(countyId){
    	commonServ.getPayTypeById(countyId).success(function(data){
    		if(data.data!=null){
    			$scope.resultData.payType=data.data.payTypee;
        		if($scope.resultData.payType>=0){
        			 $scope.payTypeFlag=true;
        		}else{
        			$scope.payTypeFlag=false;
        		}
        		$scope.resultData.professional=data.data.professional;
    		}else{
    			$scope.payTypeFlag=false;
    		}
    		
    	})
    }
    

     //获取供应商名称
    $scope.suPpageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getSparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 供应商搜索列表
    $scope.getData2=function(supplierName,a){
    	if(a){
   		 $scope.getSparams = {
	        pageSize: 10,//每页显示条数
	        pageNo: 1,// 当前页
   		 };
    	}

        angular.extend($scope.getSparams,{
            //"cityId":$scope.cityId,
			"cityId":$rootScope.userCityId,
            "only":"1",
            "name": supplierName,
            //"accountName":$scope.accountName,
            //"accountAlias":$scope.accountAlias,
            //"oldFinanceName":$scope.oldFinanceName,
            //"resourceName":$scope.resourceName
        })

        commonServ.querySupplier($scope.getSparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.suPpageInfo.totalCount = data.data.totalRecord;
                $scope.suPpageInfo.pageCount = data.data.totalPage;
                $scope.getSparams.page = data.data.pageNo;
                $scope.suppliers = data.data.results;
            })
        });
    }



    // 供应商弹出框
    $scope.choiceSupplierDialog=function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
        $scope.choiceSupplierDialogs=ngDialog.open({
            template: './tpl/supplierDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
            scope: $scope,
        });
    }


    // 确定选择供应商
    $scope.choiceSupplier=function(){
        var obj= utils.getCheckedValsForRadio('#SupplieList');
        if(obj==null){
            utils.msg("请选择一个供应商！");
            return;
        }
        obj= JSON.parse(obj);
        $scope.resultData.sysSupplierName=obj.name; //供应商名称
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            $scope.singleDetail.supplierName = obj.name;      //修改稽核单页面供货商数据
            $scope.singleDetail.sysSupplierID=obj.id;
        }
        $scope.resultData.sysSupplierID=obj.id;   //改变后的供应商id
        $scope.closeDialog("choiceSupplierDialogs");
    }
    
    
    
    //根据报账点查找对应的合同ID
    //根据报账点查找对应的合同ID
    $scope.getContract=function(countyId){
		//(匹配上次录入)
        commonServ.getContractName(countyId).success(function(data){
            utils.loadData(data,function(data){
                if(data.data == null){
/*                	debugger;
                    // utils.msg("该站点无合同信息,请选择一个默认合同id");
                	//根据报账点查找站点--查找白名单状态是否是白名单
                	commonServ.getWhite(countyId).success(function(data){
                		if(data.data!='否'){
                			//白名单状态
                			$scope.white=data.data;
                			$scope.whiteType=1;
                			$scope.resultData.contractID=data.data.contractName;
                			var ht=new Array();
                			ht.push(data.data.contractId);
                			$scope.contractIds=ht;
                			//选择合同下的合同
                			$rootScope.contractPrice=data.data.price;
                		}else{
                			$scope.whiteType=0;//非白名单
                			$rootScope.contractPrice="";
                			return;
                		}
                	});*/
                	return;
                }else {
                	$scope.whiteType=0;
                	$scope.resultData.costCenter=data.data.costCenter;//匹配上次录入的成本中心
					$scope.resultData.costCenterID=data.data.costCenterID;//保存上次录入的成本中心ID
 					$scope.accountObject.name=data.data.sysRgName;//匹配上次录入的报账组名称
					$scope.resultData.sysRgID=data.data.sysRgID;//保存上次录入的报账组id
					$scope.departmentName=data.data.departmentName;//匹配上次录入的部门名
					$scope.departmentName1=data.data.departmentName;//匹配上次录入的部门名显示在录入页面
					$scope.resultData.departmentName=data.data.departmentName;//保存上次录入的部门名
                }
            })
        });
    		//匹配报账点对应的合同
    		commonServ.getContract(countyId).success(function(data){
                utils.loadData(data,function(data){
                	// debugger;
                    if(data.data == null||data.data==""){
                    	// debugger;
                    	//根据报账点查找站点--查找白名单状态是否是白名单
                    	commonServ.getWhite(countyId).success(function(data){
                    		if(data.data!='否'){
                    			//白名单状态
                    			$scope.white=data.data;
                    			$scope.whiteType=1;
                    			/*$scope.resultData.contractID=data.data.contractName;*/
                    			var ht=new Array();
                    			ht.push(data.data.contractId);
                    			$scope.contractIds=ht;
                    			//选择合同下的合同
                    			$rootScope.contractPrice=data.data.price;
                    		}else{
                    			$scope.whiteType=0;//非白名单
                    			$scope.contractIds="";
            					alert("该报账点无合同数据,不允许报销,请确认合同信息上传财务系统后再试！");					
                                return;				
                    		}
                    	});
                    }else {                         	
                    	$scope.contractIds=data.data;//获取报账点对应的合同id
                    }
                })
            });
    }
	
	
	//未选择报账点选择合同是判断
	$scope.judgeContract = function(){	
		var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
			return;		
	}
	 //保存选择的合同
	$scope.selectContract = function(data){		
		if(data==null){
			 utils.msg("请选择一个合同！");
			  $scope.resultData.contractID=null;
			 return;
		}
		if(data!=null||data!=""){
		$scope.resultData.contractID=data;   //保存选择的合同
		$scope.contractInfos(data);//根据合同id查询对应的合同信息
		utils.msg("你选择了合同:"+data);
		}
	};

     //获取合同名称
    $scope.coNpageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getSparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 合同信息搜索列表
    $scope.getData3=function(contractName,a){
    	if(a){
   		 $scope.getSparams = {
	        pageSize: 10,//每页显示条数
	        pageNo: 1,// 当前页
   		 };
    	}

        angular.extend($scope.getSparams,{
            //"cityId":$scope.cityId,
            "only":"1",
            "name": contractName,
            //"accountName":$scope.accountName,
            //"accountAlias":$scope.accountAlias,
            //"oldFinanceName":$scope.oldFinanceName,
            //"resourceName":$scope.resourceName
        })

        commonServ.queryContract($scope.getSparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.coNpageInfo.totalCount = data.data.totalRecord;
                $scope.coNpageInfo.pageCount = data.data.totalPage;
                $scope.getSparams.page = data.data.pageNo;
                $scope.Contract = data.data.results;
            })
        });
    }

    // 合同信息弹出框
    $scope.choiceContractDialog=function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){          
		   utils.msg("请先选择报账点！");
            return;
        }
        $scope.choiceContractDialogs=ngDialog.open({
            template: './tpl/contractDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
            scope: $scope,
        });
    }


    // 确定选择合同ID
    $scope.choiceContract=function(){
        var obj= utils.getCheckedValsForRadio('#SupplieList');
        if(obj==null){
            utils.msg("请选择一个合同！");
            return;
        }
        obj= JSON.parse(obj);
        $scope.resultData.contractName=obj.name; //合同名称
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            $scope.singleDetail.contractName = obj.name;      //修改稽核单页面合同数据
            $scope.singleDetail.contractID=obj.id;
        }
        $scope.resultData.contractID=obj.id;   //改变后的合同id
        $scope.closeDialog("choiceContractDialogs");
    }

	//根据合同id查询对应的合同信息
	$scope.contractInfos=function(contractId){
		var cityId=$rootScope.userCityId;//地市ID
		var countyId=$rootScope.userCountyId;//区县id
		commonServ.getContractInfo(contractId,cityId,countyId).success(function(data){
            utils.loadData(data,function(data){  
			$scope.vendorName=data.data.vendorName;//供应商名称
			$scope.resultData.sysSupplierID=data.data.supplierId;//保存供应商ID
			$scope.resultData.supplierName=data.data.vendorName;//保存供应商名称
			 //查找供应商的预付单（通过供应商ID--表中的code字段）
            $scope.getPreBySuId(data.data.vendorId);
			$scope.startDate=data.data.executionBeginDate; //合同生效日期
			$scope.endDate=data.data.executionEndDate; //合同失效日期
			$scope.assetManagementSiteName=data.data.assetManagementSiteName;//资管站点名称
			if(data.data.unitPrice==null||data.data.unitPrice==""){//区域直供电单价
				$scope.zgdUnitPrice="0";
			}else{
				$scope.zgdUnitPrice=data.data.unitPrice; //区域直供电单价
			}
			//$scope.isUploadOverproof=data.data.isUploadOverproof;//是否上传超标审批记录( 有(0)、无(1))
			if(data.data.isUploadOverproof=="0"){ //上传了超标审批记录
				$scope.isUploadOverproof="有"; 
			}else if(data.data.isUploadOverproof=="1"){ //未上传超标审批记录
				$scope.isUploadOverproof="无";
			}else{
				$scope.isUploadOverproof="";
			}
			if(data.data.contractNumber==null){
				$scope.contractNumber="无";//合同编号
			}else{
				$scope.contractNumber=data.data.contractNumber;//合同编号
			}
			$scope.priceOrLumpSumPrice=data.data.priceOrLumpSumPrice;//单价或包干价(大于20即包干价)
			if(data.data.priceOrLumpSumPrice>20){
				$scope.xIsClud="bg";//设置状态为包干
				$scope.sumXPrice=data.data.priceOrLumpSumPrice;//包干价
			}else{
				$scope.xIsClud="bbg";//设置状态为不包干
				$scope.xPrice=data.data.priceOrLumpSumPrice;//单价
			}			
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

    
    
  //统一时间
    $scope.countTime=function(){
    	for(var i=0;i<$scope.watthourMeterVOs.length;i++){
    		$scope.bbelongStartTime=$("#belongStartTime").val();
    		$scope.bbelongEndTime=$("#belongEndTime").val();
    		$scope.watthourMeterVOs[i].belongStartTime=$scope.bbelongStartTime;
    		$scope.watthourMeterVOs[i].belongEndTime=$scope.bbelongEndTime;
    		if($("#belongStartTime").val()!=""&&$("#belongEndTime").val()!=""){
    			 $scope.countDays($scope.watthourMeterVOs[i],i);
    		}
    	}
    };

    //计算用电天数
    $scope.countDays=function(item, index){
    	// debugger;
        if(!item.belongStartTime || !item.belongEndTime){
            return;
        }
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.exceptions3Explain=null;//初始化异常原因(报账点单电表日均电量超1千度)
		item.isContinue=null;//初始化状态(是否继续提交)
        item.dayAmmeter= utils.getDays(item.belongStartTime,item.belongEndTime) + 1;
        $scope.watthourMeterVOs[index]=item;
    }

	//电损改变时重新判断电损占比
	$scope.bElectricLoss=function(item, index){
		
		if(item.electricLoss==""||item.electricLoss==null){
			item.electricLoss=0;
		}
		item.totalEleciric=parseFloat($scope.totalEleciricDS)+parseFloat(item.electricLoss)+"";
		item.exceptions4Explain=null;//初始化异常原因(电损占比=稽核单电损电量/稽核单总电量>80%)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
		if($scope.sumXPrice==null||$scope.sumXPrice==""){
        $scope.countElectrictyItemPrice(item,index);
		}else if(($scope.sumXPrice!=null||$scope.sumXPrice!="")&&(item.totalAmount!=null||item.totalAmount!="")){
			$scope.backcalculationPrice(item,index);
		}
	}
	
	//本次拍照时间改变时重新判断报销时间与拍照时间是否相同
	$scope.bTheTakePhotosTime=function(item, index){
		item.exceptionsExplain=null;//初始化异常原因(报销时间与拍照时间相同)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
	}
		
	//拍照电表读数改变时重新判断拍照电表读数是否小于报销电表当前读数
	$scope.bElectricMeterDeg=function(item, index){
		item.exceptions1Explain=null;//初始化异常原因(拍照电表读数小于报销电表当前读数)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
	}

    //计算电表的用电量
    $scope.countPowerSize=function(item,index){
         //如果翻表选择‘是’
        if(item.whetherMeter == 1 && (item.maxReading || item.maxReading == 0 )){
           item.viewMaxReading = item.maxReading;
        }else if(!item.maxReading && item.maxReading != 0){
            item.whetherMeter == 0;
            item.viewMaxReading = "";
        }else{
            // $scope.isSelect = false;
            // $scope.isSelected = true;
            item.viewMaxReading = "";
        }
        if(!item.startAmmeter ){
            item.startAmmeter = null;
        }
        if(!item.endAmmeter){
            item.endAmmeter = null;
        }
        var sum=( item.endAmmeter - item.startAmmeter); //未翻表
        //翻表
        if(item.whetherMeter==1 && (item.maxReading || item.maxReading == 0 )){
            sum= parseFloat(sum+item.maxReading+1); //翻表总电量 = 最大读数 + 当前止度读数 - 当前起度读数 + 1
        }

        if(isNaN(parseFloat(sum))){
            $scope.checkNumber(item);
            return;
        }
		item.exceptions1Explain=null;//初始化异常原因(拍照电表读数小于报销电表当前读数)
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.exceptions3Explain=null;//初始化异常原因(报账点单电表日均电量超1千度)
		item.exceptions4Explain=null;//初始化异常原因(电损占比=稽核单电损电量/稽核单总电量>80%)
		item.isContinue=null;//初始化状态(是否继续提交)
		if(item.electricLoss==null||item.electricLoss==""){
			item.electricLoss="0";
		}
        item.totalEleciric= (parseFloat(sum)+parseFloat(item.electricLoss)).toFixed(2);
		$scope.totalEleciricDS=parseFloat(sum).toFixed(2);
        $scope.watthourMeterVOs[index]=item;
		if($scope.sumXPrice==null||$scope.sumXPrice==""){
        $scope.countElectrictyItemPrice(item,index);
		}else if(($scope.sumXPrice!=null||$scope.sumXPrice!="")&&(item.totalAmount!=null||item.totalAmount!="")){
			$scope.backcalculationPrice(item,index);
		}
    }

	//反算单价
    $scope.backcalculationPrice=function(item,index){
		if(item.totalAmount>$scope.sumXPrice){			
			utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
		}
        var price; //单个电表总金额
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.isContinue=null;//初始化状态(是否继续提交)
		price=item.totalAmount/item.totalEleciric;
		item.unitPrice=	parseFloat(price).toFixed(2);//单价	
        item.backcalculationPrice = parseFloat(price).toFixed(2);//反算单价
        $scope.watthourMeterVOs[index]=item;
    };

    // 计算单个电表的金额
    $scope.countElectrictyItemPrice=function(item,index){
        var total; //单个电表总金额
     /*   if($scope.invoiceVOs.length == 0){
            utils.msg("目前暂无税率信息，请联系管理员后配置后再进行计算!");
            return;
        }else if($scope.invoiceVOs[0].billTax == "0"){
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice;
        }else {
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice*($scope.invoiceVOs[0].billTax/100);
        } */
		if($scope.xIsClud=="bbg"){
			item.unitPrice=$scope.xPrice;//单价
		}
		total=item.totalEleciric*item.unitPrice;
        if(isNaN(parseFloat(total))){
            $scope.checkNumber(item);
            return;
        }
        item.totalAmount= parseFloat(total).toFixed(2);
        $scope.checkNumber(item);
        $scope.watthourMeterVOs[index]=item;
    };


    $scope.disabled = false;  // 判断发票信息是否能填写
    //计算电费总金额
    $scope.countElectrictyTotPrice=function(){
        var sum=0;
        for(var  i=0; i<$scope.watthourMeterVOs.length; i++){
            var item = $scope.watthourMeterVOs[i];
            if(item.totalAmount != null){
                sum += parseFloat(item.totalAmount);
            }
        }
        $scope.resultData.totalAmount= sum.toFixed(2);    //各电表的总金额
		$scope.totalAmount = sum.toFixed(2);//用于填写其他费用后计算总金额
        $scope.resultData.paymentAmount = sum.toFixed(2); // 支付总金额
        // 录入电费页面修改
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            if(isNaN(parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost))){
                return;
            }
          //  $scope.singleDetail.paymentAmount= parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost).toFixed(2);//页面上的数据
          //  $scope.singleDetail.totalAmount = $scope.resultData.totalAmount;  // 页面显示的数据
			
			$scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.singleDetail.otherCost))+"";  //支付总金额
			$scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.singleDetail.otherCost))+""; //总金额（含税）+=其他金额

            //$scope.editInvoiceVO(); //电费录入页面-----计算发票税金金额
            if($scope.resultData.electrictyMidInvoices.length==0){
                $scope.resultData.electrictyMidInvoices.unshift({
                    "taxAmount":parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else {
                $scope.resultData.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
         //发票修改时修改   $scope.electrictyMidInvoices = $scope.resultData.electrictyMidInvoices; //电费录入 ---修改详情页面显示修改的发票
        }else {
            $scope.disabled = true;
            $scope.resultData.paymentAmount = parseFloat($scope.resultData.totalAmount - $scope.resultData.otherCost).toFixed(2);
             //新增稽核单-----计算发票税金金额
            if($scope.resultData.electrictyMidInvoices.length==0){
            	var totalAmount = parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2);
            	var taxAmount = parseFloat(totalAmount*($scope.invoiceVOs[0].billTax/100)).toFixed(2);
            	console.log(totalAmount,taxAmount)
                $scope.resultData.electrictyMidInvoices.unshift({
                    "taxAmount":taxAmount,
                    "electricityAmount": parseFloat(totalAmount - taxAmount).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                    "totalAmount":totalAmount,
                })
                //含税  不含税 和 税金 计算noone
                $scope.checkElectricityAmount = totalAmount;//含税
                $scope.checkElectricityTaxAmount = taxAmount;//税金
                $scope.checkElectricityElectricityAmount = parseFloat(totalAmount - taxAmount).toFixed(2);//不含税
            }else {
            	console.log("电表有两个时")
            	var totalAmount = parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2);
            	var taxAmount = parseFloat(totalAmount*($scope.invoiceVOs[0].billTax/100)).toFixed(2);
            	console.log(totalAmount,taxAmount)
                $scope.resultData.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":taxAmount,
                    "electricityAmount": parseFloat(totalAmount - taxAmount).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                    "totalAmount":totalAmount,
                })
            }
        }
    }

    // 手动填写其他费用
    $scope.changeTotalAmount = function(){
		if($scope.totalAmount==null||$scope.totalAmount==""){
			$scope.resultData.otherCost=null;
			 utils.msg("请先添加电表明细");			 
		}else{
		if($scope.resultData.otherCost==null||$scope.resultData.otherCost==""){
			$scope.resultData.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(!reg.test($scope.resultData.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.resultData.otherCost < 0){
            utils.msg("数值不能为负。");
            return;
        }else if($scope.resultData.otherCost){	
		
        $scope.resultData.paymentAmount =new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.resultData.otherCost))+"";  //支付总金额
        $scope.resultData.totalAmount = new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.resultData.otherCost))+""; //总金额（含税）+=其他金额
		//alert($scope.resultData.otherCost+"==="+$scope.resultData.totalAmount+$scope.resultData.paymentAmount+parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2));
		}else {
			$scope.resultData.paymentAmount = $scope.totalAmount;
			$scope.resultData.totalAmount = $scope.totalAmount;
			
        }

		if($scope.resultData.otherCost=="0"){
			$scope.resultData.otherCost=null;
		}
		
        if($scope.resultData.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
          /*  $scope.resultData.electrictyMidInvoices.splice(0,1,{
                "taxAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
                "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            }) */
			$scope.resultData.electrictyMidInvoices.splice(0,1,{
                "taxAmount": new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
                "electricityAmount": new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
			
        }
		}
    }

    //验证手动输入的支付总金额
    $scope.changePaymentAmount=function(){
    	if($scope.totalAmount==null||$scope.totalAmount==""){
			$scope.resultData.paymentAmount=null;
			 utils.msg("请先添加电表明细");			 
		}else{
		if($scope.resultData.paymentAmount==null||$scope.resultData.paymentAmount==""){
			$scope.resultData.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(!reg.test($scope.resultData.paymentAmount)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.paymentAmount.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.resultData.paymentAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if((new BigDecimal($scope.resultData.paymentAmount).subtract(new BigDecimal($scope.resultData.totalAmount))) > 0){
        	 utils.msg("支付总金额不能大于总金额(含税)");
             return;        	
        }

		if($scope.resultData.paymentAmount=="0"){
			$scope.resultData.paymentAmount=null;
		}		
    }
    }


    //关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }
      // 切换类型
    $scope.eleTableType = "1";//初始化为普通电表
    $scope.choiceType = function(eleTableType) {
        $scope.eleTableType = eleTableType;//选取电表

        if(eleTableType == 1){
            $scope.resultData.ptype = "1";
        }
        if(eleTableType == 2){
            $scope.resultData.ptype = "2";
        }
        console.log(eleTableType)
       
    }


    //获取电表明细----对应电表个数
    $scope.getDianBiaoDetail=function(){
        // debugger;
        var siteId=$scope.resultData.sysAccountSiteId;
       var contractID=$scope.resultData.contractID;//合同id
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }else if((contractID==''||contractID==null)&& $scope.flagSave == undefined && $scope.flag == undefined){
			utils.msg("请先选择合同！");
            return;
        }else if(siteId !== ""){
            // debugger;
            // 电表数组为空新增   电表数组不为空直接显示--------新增电表时
            if(!$scope.watthourMeterVOs || $scope.watthourMeterVOs.length < 1){
                $scope.isNew = true;   //默认显示viewMaxReading
                commonServ.getInputElectrictyDetail(siteId).success(function(data){
                	$scope.meterNum=data.watthourMeterVOs.length;//把电表个数赋值给meterNum,bYNoone
                	$rootScope.createDate=data.createDate;
					$rootScope.nowTime= new Date();
                    if(data != "" && data.watthourMeterVOs.length > 0){
                        for(var index=0; index<data.watthourMeterVOs.length; index++) {
                                //只要有普通电表，那么电表归属终止日期就是当天
                            if(data.watthourMeterVOs[index].ptype==1){
                                $scope.eleTableType = "1";
                            }
                            data.watthourMeterVOs[index].watthourId = data.watthourMeterVOs[index].id;
							//判断上次拍照时间是否有值
							if(data.watthourMeterVOs[index].takePhotosTime==null){
							data.watthourMeterVOs[index].photosStatus=false;	//拍照时间为null,用户选择上次拍照时间
						
							}else{
								data.watthourMeterVOs[index].photosStatus=true; //拍照时间不为null,上次拍照时间为后台查询出来的拍照时间
							data.watthourMeterVOs[index].takePhotosTime=$scope.dataChange(data.watthourMeterVOs[index].takePhotosTime)
							}
							data.watthourMeterVOs[index].lastTakePhotosTime=data.watthourMeterVOs[index].takePhotosTime;//上次拍照时间=拍照时间
							//判断最大读数是否有值
							if(data.watthourMeterVOs[index].maxReadings==null){
							data.watthourMeterVOs[index].maxReadingStatus=false;	//最大读数为null,用户选择最大读数					
							}else{
								data.watthourMeterVOs[index].maxReadingStatus=true; //最大读数不为null,带出用户上次选择
							}
                        }
                        $scope.watthourMeterVOs =utils.deepCopy(data.watthourMeterVOs);
                        $scope.accountSiteDialog=ngDialog.open({
                            template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                            width: 1000,
                            scope: $scope,
                        });
                    }else {
                        utils.msg("报账点对应的电表信息为空，请重新选择报账点！");
                        // $scope.closeDialog('accountSiteDialog');  此处6月8日已注释
                        return;
                    }
                });
            }else{
                $scope.isNew = false;
                $scope.accountSiteDialog=ngDialog.open({
                    template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                    width: 1000,
                    scope: $scope,
                });
            }

        }else if(!$scope.flagSave  && $scope.flagSave != undefined || !$scope.flag){
            $scope.isNew = false;   //默认显示viewMaxReading
			$rootScope.nowTime= new Date();//当前时间
            // 查看修改电表信息时
			if($scope.singleDetail.watthourMeterVOs!=null){
				if($scope.singleDetail.watthourMeterVOs.length>0){
					for(var index=0; index<$scope.singleDetail.watthourMeterVOs.length; index++) {	
					if($scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime==null||$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime==""){					
					$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime="";
					}else{
						$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime=$scope.dataChange($scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime);
					}
					if($scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime==null||$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime==""){					
						$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime="";
					}else{
						$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime=$scope.dataChange($scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime);
					}
					if(($scope.singleDetail.watthourMeterVOs[index].unitPrice==""||$scope.singleDetail.watthourMeterVOs[index].unitPrice==null)
					&&($scope.singleDetail.watthourMeterVOs[index].backcalculationPrice!=""||$scope.singleDetail.watthourMeterVOs[index].backcalculationPrice!=null)
					){
						$scope.singleDetail.watthourMeterVOs[index].unitPrice=$scope.singleDetail.watthourMeterVOs[index].backcalculationPrice;
					}
					}
				}			
			}
            $scope.watthourMeterVOs = utils.deepCopy($scope.singleDetail.watthourMeterVOs);
            for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
                //时间格式转换
                $scope.watthourMeterVOs[i].belongEndTime = $scope.dataChange($scope.watthourMeterVOs[i].belongEndTime);
                $scope.watthourMeterVOs[i].belongStartTime = $scope.dataChange($scope.watthourMeterVOs[i].belongStartTime);
            }
            $scope.accountSiteDialog=ngDialog.open({
                template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                width: 1000,
                scope: $scope,
            });
        }
        console.log("电表明细",angular.toJson($scope.watthourMeterVOs,true));

    }

    var isEmpty = true;  //判断电表信息是否填写完整
    var isRightReg = true;  // 判断电表信息是否符合规矩
    // 校验数据
    $scope.checkNumber=function(meterVo){
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if((meterVo.startAmmeter != null && meterVo.startAmmeter.length > 20) || (meterVo.endAmmeter != null && meterVo.endAmmeter.length > 20) || (meterVo.dayAmmeter != null && meterVo.dayAmmeter.length > 20) || (meterVo.totalEleciric != null && meterVo.totalEleciric.length > 20) || (meterVo.totalAmount != null && meterVo.totalAmount.length > 20) || (meterVo.unitPrice != null && meterVo.unitPrice.length > 20) ){
            utils.msg("数值类型长度不能超过20个字符。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        if((meterVo.startAmmeter != null && !reg.test(meterVo.startAmmeter) )|| (meterVo.endAmmeter != null && !reg.test(meterVo.endAmmeter)  )|| (meterVo.dayAmmeter != null && isNaN(parseFloat(meterVo.dayAmmeter)) )|| (meterVo.totalEleciric != null && !reg.test(meterVo.totalEleciric) )|| (meterVo.totalAmount != null && !reg.test(meterVo.totalAmount) )|| (meterVo.unitPrice != null && !reg.test(meterVo.unitPrice) )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        // 此处修改-----当总用电止度为空的时候校验总电量为负数 meterVo.endAmmeter != null
        if( (meterVo.startAmmeter != null && meterVo.startAmmeter < 0 )|| (meterVo.endAmmeter != null && meterVo.endAmmeter < 0 )|| (meterVo.dayAmmeter != null && meterVo.dayAmmeter < 0 )|| (meterVo.totalEleciric != null && meterVo.totalEleciric < 0  && meterVo.endAmmeter != null)|| (meterVo.totalAmount != null && meterVo.totalAmount < 0)|| (meterVo.unitPrice != null && meterVo.unitPrice < 0 )){
            utils.msg("数值不能为负。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        if(meterVo.remarks != null &&　meterVo.remarks.length > 150){
             utils.msg("备注长度不能超过150个字符。");
                isRightReg = false;
                return;
        }else if(meterVo.remarks != null){
                isRightReg = true;
        }
    }
//最大度数
    $scope.maxReadingsChange=function(item,index){
		item.maxReadings=$("#maxReadings").val();
	
		 $scope.watthourMeterVOs[index]=item;

	}
  // 上传拍照图片
    $scope.uploadImg = function(item) {
        $scope.tabUpload=1;
		$scope.watthourMeterID=item.id;
        $scope.uploadImgDialog=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    };
	
	 //查看上传的图片
    $scope.showImg = function(item){
		if(item.accessories==null||item.accessories==""){
			alert("该电表无拍照图片！");
			return;
		}
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        var showUrl = base_url+'/fileOperator/fileDownLoadImg.do?filepath='+item.accessories;	   
        $scope.showUrls = showUrl;
        $scope.uploadImg=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    }
	
	    $scope.files = [];
     // 选择图片
    $scope.change1 = function(ele){
        $scope.files = ele.files;
        $scope.fileName = $scope.files[0].name;	
        var extStart=$scope.fileName.lastIndexOf(".");
        var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
        if(!/\.(gif|jpg|bmp|png|GIF|JPG|PNG|BMP)$/.test(ext)){
            utils.msg("请上传图片,类型必须是.jpg,gif,png,bmp中的一种");
            return;
        }else {
            var objUrl = $scope.getObjectURL($scope.files);
            $(".preview-box").attr("src",objUrl);
            $scope.$apply();
        }

    }


    $scope.uploadFiles = [];    //已上传的文件

    // 上传图片发送后台
    $scope.uploadImgType = function(){
        if($scope.files.length == 0 || $scope.files == null){
            utils.msg("请上传图片！");
            return;
        }
        var base_url = CONFIG.BASE_URL;
		var fileName=$scope.fileName;
        var formData = new FormData($( "#uploadForm1" )[0]);
        $.ajax({
            url:base_url+'/fileOperator/imgUpload.do',
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
					$scope.fileUrl = $scope.getObjectURL($scope.files);
                    $scope.uploadImgDialog.close("");
                    // 上傳成功后清空数据
                    $scope.files = [];
                }
                for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
					if($scope.watthourMeterVOs[i].id==$scope.watthourMeterID){
						$scope.watthourMeterVOs[i].accessories=data.data;
					}
				}
				
            }
        });
    }

	//删除拍照图片
	 $scope.deleteImgType = function(){
		 $scope.files=[];
		 $scope.fileName=null;
		  for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
					if($scope.watthourMeterVOs[i].id==$scope.watthourMeterID){
						$scope.watthourMeterVOs[i].accessories=null;
					}
				}
	    $(".preview-box").attr("src","./assets/img/upload_photo_img.png");
		 $scope.uploadImgDialog.close("");
		 $scope.uploadImgDialog=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
	 }
	
	//计算时间差是否大于6个月
	$scope.compare=function(date1,date2){
		 var newYear = date1.getFullYear();
        var newMonth =date1.getMonth() + 6;
        console.log(newMonth)
        if(newMonth >= 11){
            newYear += 1;
            newMonth -= 11;
            date1.setFullYear(newYear);
            date1.setMonth(newMonth-1);
        }
        else{
            date1.setFullYear(newYear);
            date1.setMonth(newMonth);
        }
        if(date1.getTime() > date2.getTime()){
            return true;//在六个月之内
        }
        else{
            return false;//大于六个月未填写抄表信息
        }
		};
		
	//报销时间与拍照时间相同判断是否填写原因	
	$scope.ack=function(){
		var cause=$("#cause").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause!=""&&cause!=null){//填写原因可以提交
			$scope.closeDialog("exceptionsHintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptionsExplain=cause;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
		//拍照电表读数小于报销电表当前读数判断是否填写原因	
	$scope.ack1=function(){
		var cause1=$("#cause1").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause1!=""&&cause1!=null){//填写原因可以提交
			$scope.closeDialog("exceptions1HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions1Explain=cause1;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//报账点单电表日均电费超1千元判断是否填写原因	
	$scope.ack2=function(){
		var cause2=$("#cause2").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause2!=""&&cause2!=null){//填写原因可以提交
			$scope.closeDialog("exceptions2HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions2Explain=cause2;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//报账点单电表日均电量超1千度判断是否填写原因	
	$scope.ack3=function(){
		var cause3=$("#cause3").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause3!=""&&cause3!=null){//填写原因可以提交
			$scope.closeDialog("exceptions3HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions3Explain=cause3;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//电损占比=稽核单电损电量/稽核单总电量>80%判断是否填写原因	
	$scope.ack4=function(){
		var cause4=$("#cause4").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause4!=""&&cause4!=null){//填写原因可以提交
			$scope.closeDialog("exceptions4HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions4Explain=cause4;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
		//报账点电表单价高于2.5元/度继续提交	
	$scope.ack5=function(){
			$scope.closeDialog("exceptions5HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.isContinue="继续提交";				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
	}
	
    //电费明细提交
    $scope.submitDetail=function(csngDialog){

        var writedList = [];
        //查看有没有填完整的电表
        for(var index=0; index<$scope.watthourMeterVOs.length; index++){
            var meterVo = $scope.watthourMeterVOs[index];
			if(meterVo.totalAmount>$scope.sumXPrice){			
				utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
				return;
			}
            $scope.checkNumber(meterVo);  //再次校验
            // 如果翻表为否，删除最大读数；
          /*  if(!meterVo.whetherMeter){
                delete meterVo.maxReading;
            } */
            if(!meterVo || !meterVo.belongStartTime || !meterVo.belongEndTime || !meterVo.dayAmmeter || (!meterVo.startAmmeter && meterVo.startAmmeter != 0) || (!meterVo.endAmmeter && meterVo.endAmmeter != 0) || (!meterVo.totalEleciric && meterVo.totalEleciric != 0) || (!meterVo.totalAmount && meterVo.totalAmount != 0) || (!meterVo.unitPrice && meterVo.unitPrice != 0) ){
                isEmpty = false;
            }else if((meterVo.totalAmount != null || meterVo.totalAmount != "0.00") && meterVo.dayAmmeter != null ){
               //判断电费总金额(含税)是否大于合同总价包干值
				if(meterVo.totalAmount>$scope.sumXPrice){			
					utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
					return;
				}
				
				//判断合同单价是否>直供电单价*120%，且无分级审批记录				
				if(((meterVo.unitPrice-$scope.zgdUnitPrice*1.2)>0)&&$scope.isUploadOverproof!="有"){
					alert("合同单价("+meterVo.unitPrice+")>直供电单价("+$scope.zgdUnitPrice+")*120%，稽核单生成失败，请于财务系统上传分级审批记录后再试！");
					return;
				}
				
				//判断报销周期是否在合同期限内
				var belongStartDates=new Date(meterVo.belongStartTime);//电费归属起始日期
				var belongEndDates=new Date(meterVo.belongEndTime);//电费归属终止日期
				var startDates=new Date($scope.startDate);//合同生效日期
				var endDates=new Date($scope.endDate);//合同失效日期
				if((belongStartDates.getTime()<startDates.getTime())
					||(belongStartDates.getTime()>endDates.getTime())
				||(belongEndDates.getTime()<startDates.getTime())
				||(belongEndDates.getTime()>endDates.getTime())){ //报销周期未在合同期限内不予报销，弹出提示框
					$scope.exceptions=ngDialog.open({
								template: './tpl/exceptions.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							return;		
				}
				
				//判断报账点电表单价是否高于2.5元/度
				if(meterVo.unitPrice-2.5>0){
					if(meterVo.isContinue==null){//未选择继续提交，弹出提示框
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					$scope.exceptions5HintDialog=ngDialog.open({
								template: './tpl/exceptions5HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							return;	
					}							
				}	
				
			  //判断报账点单电表日均电费是否超1千元
			   if((meterVo.totalAmount/meterVo.dayAmmeter)>1000){//报账点单电表日均电费超1千元，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions2Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions2HintDialog=ngDialog.open({
								template: './tpl/exceptions2HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}	
			   
			   //判断报账点单电表日均电量是否超1千度
			   if((meterVo.totalEleciric/meterVo.dayAmmeter)>1000){//报账点单电表日均电量超1千度，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions3Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions3HintDialog=ngDialog.open({
								template: './tpl/exceptions3HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
				
			   //判断电损占比=稽核单电损电量/稽核单总电量是否>80%
			   if((0-meterVo.electricLoss)==0){
				   meterVo.electricLoss=null;
			   }
			   if(meterVo.electricLoss!=null){
			   if((meterVo.electricLoss/meterVo.totalEleciric)>0.8){//电损占比=稽核单电损电量/稽核单总电量>80%，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions4Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions4HintDialog=ngDialog.open({
								template: './tpl/exceptions4HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
			   }
			   
			   //判断用户填写抄表信息时是否填写完整
				if(meterVo.theTakePhotosTime==""){
					meterVo.theTakePhotosTime=null;
				}
				if((meterVo.theTakePhotosTime!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.electricMeterDeg!=null&&(meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.takePhotosPeopleInfo!=null&&(meterVo.electricMeterDeg==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.accessories!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null))){
					meterVo.theTakePhotosTime=null;
				}
			if((meterVo.electricMeterDeg!=null&&(meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null||meterVo.theTakePhotosTime==null))
				||(meterVo.takePhotosPeopleInfo!=null&&(meterVo.electricMeterDeg==null||meterVo.accessories==null||meterVo.theTakePhotosTime==null))
				||(meterVo.accessories!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null||meterVo.theTakePhotosTime==null))){				
					alert("请完善抄表信息!!");
					return;
				}
				
				//如果本次拍照时间为空或拍照图片为null,则判断是否已有六个月未填写抄表信息										
					if(meterVo.theTakePhotosTime==null||meterVo.accessories==null){
						var myDate = new Date();//获取系统当前时间
						var lastTime=new Date(meterVo.lastTakePhotosTime);	
						$rootScope.lastTimes=meterVo.lastTakePhotosTime;
						var result=$scope.compare(lastTime,myDate);
						if(result){
							//isEmpty = true;
							if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}
						}else{
							//alert("超过六个月未填写抄表信息");
							 $scope.wattTimeDialog=ngDialog.open({
								template: './tpl/wattTimeDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							//isEmpty = false;
							return;							
						}
							
				}else{
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
				
				//判断拍照电表读数是否小于报销电表当前读数				
				if(meterVo.electricMeterDeg!=null){
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
				if((meterVo.electricMeterDeg-meterVo.endAmmeter)<0){ //拍照电表读数小于报销电表当前读数，视为异常需填写原因说明					
					if(meterVo.exceptions1Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions1HintDialog=ngDialog.open({
								template: './tpl/exceptions1HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}					
				}else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}	
				}
				
				//判断报销时间与拍照时间是否相同
					if(meterVo.theTakePhotosTime!=null){
					var myDate = new Date();//获取系统当前时间
					var myDates=$scope.dataChange(myDate);
					var lastTime=meterVo.theTakePhotosTime;
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					//alert((myDates==lastTime)+"=-="+myDate+"---"+lastTime+"---"+meterVo.theTakePhotosTime+"=="+myDates);
					if(myDates==lastTime){
						if(meterVo.exceptionsExplain==null){//如果异常原因没有值，则弹出窗口让用户填写原因说明				
						 $scope.exceptionsHintDialog=ngDialog.open({
								template: './tpl/exceptionsHintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;								
						}else{//若已填写原因，则继续提交
							if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
						}						
					}else{
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
					}
					}									
            }
        }
        // 多个电表
        if(!isEmpty && $scope.watthourMeterVOs.length > 1){
            for(var index=0; index < $scope.watthourMeterVOs.length; index++){
                var meterVo = $scope.watthourMeterVOs[index];
                // 其中某一个电表为未填写
                if(meterVo.totalAmount == null || meterVo.totalAmount=="0.00"){
                    continue;
                }else if(meterVo.dayAmmeter != null && meterVo.startAmmeter != null && meterVo.endAmmeter != null  && meterVo.totalEleciric !=null && meterVo.unitPrice != null){
                    isEmpty = true;
                    break;
                }
            }
            if(isEmpty){
                if(isRightReg){
                    utils.confirm("当前报账点所对应的电表未填写完全，确定要提交吗？","",function(){
                        $scope.closeDialog(csngDialog);
                        setTimeout(utils.msg("已成功添加电表"),1000);
                    });
                    if(!$scope.flagSave  && $scope.flagSave != undefined) {  //查看修改页面时
                        $scope.singleDetail.watthourMeterVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }else {
                        $scope.resultData.watthourExtendVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }
                    $scope.countElectrictyTotPrice();    //计算电表总金额
                }

            }else if((!isEmpty && isRightReg) || isEmpty){
                utils.msg("请至少完成一个电表的必填项再提交。");
            }
        // 单个电表
        }else if($scope.watthourMeterVOs.length == 1){
            if(isEmpty){
                if(isRightReg){
                    $scope.closeDialog(csngDialog);
                    utils.msg("已成功添加电表");
                    if(!$scope.flagSave  && $scope.flagSave != undefined) {  //查看修改页面时
                        $scope.singleDetail.watthourMeterVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }else {
                        $scope.resultData.watthourExtendVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }
                    $scope.countElectrictyTotPrice();    //计算电表总金额
                }
            }else if((!isEmpty && isRightReg) || isEmpty){
                utils.msg("请至少完成一个电表的必填项再提交。");
            }
        }
    };



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
            template: './tpl/upload.html?time='+new Date().getTime(),
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
        var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ext)){
            utils.msg("请上传图片,类型必须是.gif,jpeg,jpg,png中的一种");
            return;
        }else {
            var objUrl = $scope.getObjectURL($scope.files);
            $(".preview-box").attr("src",objUrl);
            $scope.$apply();
        }

    }


    $scope.uploadFiles = [];    //已上传的文件

    // 上传发送
    $scope.uploadType = function(){
        if($scope.files.length == 0 || $scope.files == null){
            utils.msg("请上传图片！");
            return;
        }
        var base_url = CONFIG.BASE_URL;
        var formData = new FormData($( "#uploadForm" )[0]);
        $.ajax({
            url:base_url+'/fileOperator/fileUpload.do',
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
                    $scope.uploadFilesDetails = {
                        "id":"",
                        "upName":"",
                    }
                    $scope.uploadFilesDetails.id = key;
                    $scope.uploadFilesDetails.upName = data.data[key];
                    // $scope.resultData.attachmentId.push(key);
                    // $scope.fileNameImg = data.data[key];
                }
                $scope.uploadFiles.push($scope.uploadFilesDetails);
            }
        });
    }


    //查看上传的图片
    $scope.showDetailFiles = function(item){
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id;
        $scope.showUrls = showUrl;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/upload.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    }

    // 删除对应上传的图片
    $scope.deleteFiles = function(index){
        $scope.uploadFiles.splice(index,1);
    }

    console.log($scope.resultData.attachmentId );

    /**
     * 报账点名称管理
    */
   $scope.showAccountGrop = function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
        $scope.accountSiteDialog=ngDialog.open({
            template: './tpl/accountGrouplist.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

   };


   //获取报账单名称
    $scope.getApageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getAparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };


   /**
    * 获取报账组列表
    */
    $scope.getAccountName = function(name){

        angular.extend($scope.getAparams,{
            "name":name,
        })

        commonServ.queryAccount($scope.getAparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.getApageInfo.totalCount = data.data.totalRecord;
                $scope.getApageInfo.pageCount = data.data.totalPage;
                $scope.getAparams.page = data.data.pageNo;
                $scope.accountList = data.data.results;
            })
        });
    }


   /*
    *@新增或修改报账组弹框
    */

    $scope.addAccountGrop = function(item,flag){
        if(item != null) {
            $scope.isModifyAccount = true;  //修改
            $scope.isAddAccount = false;   //新增
            commonServ.queryAccountDetail(item.id).success(function (data) {
                utils.loadData(data,function (data) {
                    $scope.getAccountDetail = data.data;
                })
            });
        }else {
            $scope.isModifyAccount = false;
            $scope.isAddAccount = true;
        }
        $scope.accountGroupDialog=ngDialog.open({
            template: './tpl/addAccountGroup.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 450,
            scope: $scope,
        });
    }



    /**
     * 保存报账组名称
     */
    $scope.accountObject = {// 新增的报账点名称
        "id":"",
        "name":""
    };
    $scope.addAccountNameSave = function(){
        $scope.accountObject = { // 新增的报账点名称
            "id":"",
            "name":$scope.accountObject.addName
        };

        commonServ.addAccountPage($scope.accountObject).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.accountGroupDialog.close("");
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }



    /**
     * 修改报账组名称
     */
    $scope.modifyAccountNameSave = function(){

        $scope.accountObject = {
            "id":$scope.getAccountDetail.id,
            "name":$scope.getAccountDetail.name
        }

        commonServ.modifyAccount($scope.accountObject).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.accountGroupDialog.close("");
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }


    /**
     * 删除报账组信息
     */
    $scope.deleteAccountSingle = function(item){

        commonServ.deleteAccount(item.id).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }



     /**
     * 选择报账组信息
     */
    $scope.choiceAccountGroup = function(){
        var obj= utils.getCheckedValsForRadio('#sysAccount');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        $scope.accountObject= JSON.parse(obj);
        if(!$scope.flagSave  && $scope.flagSave != undefined) {
            $scope.singleDetail.sysRgName = $scope.accountObject.name;
             $scope.singleDetail.sysRgID=$scope.accountObject.id;
        }else{
            $scope.resultData.sysRgID=$scope.accountObject.id;
        }
        $scope.accountSiteDialog.close("");
    }



/********************************************************新增稽核页面 保存、提交稽核单****************************************************************/

    //新增发票信息  -------
    $scope.addInvoiceVO=function(){
        if($scope.resultData.electrictyMidInvoices.length >= 1){
            $scope.disabled = false;  // 新添加发票  可
            $scope.resultData.electrictyMidInvoices.unshift({
                "taxAmount":0,   //税金金额
                "electricityAmount":0,//不含税
                "totalAmount":0,//含税noone
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
        }else if($scope.resultData.electrictyMidInvoices.length == 0 && $scope.resultData.totalAmount != "") {
        	console.log("新增发票信息---------electrictyMidInvoices.length=0")
        	var totalAmount = parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2);
        	var taxAmount = parseFloat(totalAmount*($scope.invoiceVOs[0].billTax/100)).toFixed(2);
        	console.log(totalAmount,taxAmount)
        	$scope.disabled = true;
            $scope.resultData.electrictyMidInvoices.unshift({
                "taxAmount":taxAmount,
                "electricityAmount": parseFloat(totalAmount - taxAmount).toFixed(2),
                "totalAmount":totalAmount,
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
        }else {
            utils.msg("当前电费总金额为0,请先选择报账点或添加电表明细！");
             return;
        }
    }




    //删除添加的发票
    $scope.removeInvoiceVO=function(index,item){

        if($scope.resultData.electrictyMidInvoices.length == 1){
            utils.msg("对不起，不能删除最后一张!");
            return;
        }else{
            $scope.resultData.electrictyMidInvoices.splice(index,1);
            if($scope.resultData.electrictyMidInvoices.length == 1){
            	var totalAmount = parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2);
            	var taxAmount = parseFloat(totalAmount*($scope.invoiceVOs[0].billTax/100)).toFixed(2);
            	console.log(totalAmount,taxAmount)
                $scope.disabled = true;
                $scope.resultData.electrictyMidInvoices.invoiceId = $scope.invoiceVOs[0].invoiceId;
                $scope.resultData.electrictyMidInvoices[0].billTax = $scope.invoiceVOs[0].billTax;
                $scope.resultData.electrictyMidInvoices[0].billType = $scope.invoiceVOs[0].billType;
//                $scope.resultData.electrictyMidInvoices[0].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2) ; //电费金额不含税
//                $scope.resultData.electrictyMidInvoices[0].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[0].electricityAmount* ($scope.invoiceVOs[0].billTax/100)).toFixed(2);  //税金金额
                $scope.resultData.electrictyMidInvoices[0].totalAmount = totalAmount;
                $scope.resultData.electrictyMidInvoices[0].taxAmount = taxAmount;
                $scope.resultData.electrictyMidInvoices[0].electricityAmount = parseFloat(totalAmount - taxAmount).toFixed(2);
            }
        }
    }


    // 选择发票种类
    $scope.selectInvoiceVOs = function(item,invoiceId,index){

        var invoice=null;
		var items1 =$scope.invoiceVOs[0];
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
				$scope.invoiceVOs[0]=items;
				$scope.invoiceVOs[i]=items1;
                break;
            }
        }
/*		if(invoice.billType.length>4){
		if(invoice.billType.substring(invoice.billType.length-4,invoice.billType.length)=="(3%)"){
			alert("你选择的发票不能生成稽核单,请从新选择发票！");
		}
		}
		if(invoice.billType.length>5){
		if(invoice.billType.substring(invoice.billType.length-5,invoice.billType.length)=="(17%)"){
			alert("你选择的发票不能生成稽核单,请从新选择发票！");
		}
		}*/
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        
        console.log(item)
        item.totalAmount = new BigDecimal(item.totalAmount).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//含税
        item.taxAmount = new BigDecimal(item.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 税金金额
        item.electricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(item.taxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//不含税

        //        if($scope.disabled){ // 只有一张发票且初始时
          //  item.electricityAmount= parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
           // "taxAmount": new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
          //  "electricityAmount": new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税
//        	item.electricityAmount = new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";  //电费不含税
//
//        }
       // item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
//        item.taxAmount = new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 税金金额
        
        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
        var sumElectricityAmount = 0;
        var sumElectricityTaxAmount = 0;//税金验证noone
        var sumElectricityElectricityAmount = 0;//不含税验证noone
        for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
            sumElectricityAmount +=
            parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
            sumElectricityTaxAmount+=
            parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
            sumElectricityElectricityAmount+=
            parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount);
        }
        sumElectricityAmount=sumElectricityAmount.toFixed(2);
        sumElectricityTaxAmount = sumElectricityTaxAmount.toFixed(2);//noone
        sumElectricityElectricityAmount = sumElectricityElectricityAmount.toFixed(2);//noone
        $scope.resultData.electrictyMidInvoices[index]=item;
        $scope.checkElectricityAmount = sumElectricityAmount;
        $scope.checkElectricityTaxAmount = sumElectricityTaxAmount;//noone
        $scope.checkElectricityElectricityAmount = sumElectricityElectricityAmount;//noone

    }

    /*******************初始化验证金额数据 含税 不含税 税金*******************************/
    $scope.checkElectricityAmount = 0;  //校验发票金额 == 支付总金额(含税)
    $scope.checkElectricityTaxAmount = 0;//校验发票税金==总税金
    $scope.checkElectricityElectricityAmount = 0;//校验发票金额 == 支付总金额(不含税)
    $scope.editInit = 0;   //手动填写的初始电费金额
    
    //手动填写电费金额(含税)noone
    $scope.changeTotalInvoice=function(item,invoiceId,index){
        var invoice=null;
        console.log("手动填写电费金额(含税)--------------------------------noone")
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            console.log(i)
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        console.log(item)
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.totalAmount && item.totalAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.totalAmount && !reg.test(item.totalAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.totalAmount  && item.totalAmount.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if(item.totalAmount ==null || item.totalAmount ==""){
        	utils.msg("请输入需要报销的数额！");
        	return;
        	}
        else{
            $scope.editInit = item.electricityAmount;
            if(item.totalAmount==null || item.totalAmount ==""){
            	item.taxAmount = 0;
            	item.electricityAmount=0;
            }else{
            	item.taxAmount = new BigDecimal(item.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 税金金额
            	item.electricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(item.taxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//不含税
            	
            }
        // 手填自动算出其他的电费不含税
        //
        // if($scope.resultData.electrictyMidInvoices.length == 2){

        //     for(var j= 0; j<$scope.resultData.electrictyMidInvoices.length; j++){
        //         if(index != [j]){
        //             $scope.resultData.electrictyMidInvoices[j].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost-$scope.editInit-item.taxAmount)/(($scope.resultData.electrictyMidInvoices[j].billTax/100)+1)).toFixed(2);
        //             $scope.resultData.electrictyMidInvoices[j].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount*($scope.resultData.electrictyMidInvoices[j].billTax/100)).toFixed(2);


        //         }
        //     }

        // }

            

        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            var sumElectricityAmount = 0;
            var sumElectricityTaxAmount = 0;//总税金
            var sumElectricityElectricityAmount = 0;//不含税
            for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
                sumElectricityTaxAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);	
                sumElectricityElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount);	
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            sumElectricityTaxAmount = sumElectricityTaxAmount.toFixed(2);
            sumElectricityElectricityAmount = sumElectricityElectricityAmount.toFixed(2);
            $scope.resultData.electrictyMidInvoices[index]=item;
            $scope.checkElectricityAmount = sumElectricityAmount;
            $scope.checkElectricityTaxAmount = sumElectricityTaxAmount;
            $scope.checkElectricityElectricityAmount = sumElectricityElectricityAmount;
        }
    }
    
    //手动填写电费税金 noone,允许调整的值+-0.01
    $scope.changeTaxAmountInvoice=function(item,invoiceId,index){
        var invoice=null;
        console.log("手动填写税金--------------------------------noone")
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            console.log(i)
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        console.log(item)
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.totalAmount && item.totalAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.totalAmount && !reg.test(item.totalAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.totalAmount  && item.totalAmount.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if(item.totalAmount ==null || item.totalAmount ==""){
        	utils.msg("请输入需要报销的数额！");
        	return;
        }else{
        	//需要把税金保存起来，做改变
        	var stepTaxAmount = item.taxAmount;
        	var stepElectricityAmount  = item.electricityAmount;
        	console.log(stepTaxAmount,stepElectricityAmount)
        	var oldtaxAmount = new BigDecimal(item.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 旧税金金额
            var oldelectricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(oldtaxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//旧不含税
            $scope.editInit = item.electricityAmount;
            console.log(oldtaxAmount,oldelectricityAmount)
            console.log(stepTaxAmount-oldtaxAmount)
            var stepAvg = (stepTaxAmount-oldtaxAmount).toFixed(2);
            console.log(stepAvg)
            if(stepAvg>0.01 || stepAvg<-0.01){
            	utils.msg("允许修改的数据0.01元");
            	item.taxAmount =  oldtaxAmount;    // 税金金额
            	item.electricityAmount = oldelectricityAmount;//不含税
            	return;
            }else{
            	item.taxAmount = stepTaxAmount;//税金金额
            	item.electricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(stepTaxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//不含税
            }
//            if(item.totalAmount==null || item.totalAmount ==""){
//            	item.taxAmount = 0;
//            	item.electricityAmount=0;
//            }else{
//            	item.taxAmount = new BigDecimal(item.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 税金金额
//            	item.electricityAmount = new BigDecimal(item.totalAmount).subtract(new BigDecimal(item.taxAmount)).setScale(2,BigDecimal.ROUND_HALF_UP)+"";//不含税
//            	
//            }

            

        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            var sumElectricityAmount = 0;
            var sumElectricityTaxAmount = 0;//总税金
            var sumElectricityElectricityAmount = 0;//不含税
            for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
                sumElectricityTaxAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);	
                sumElectricityElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount);	
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            sumElectricityTaxAmount = sumElectricityTaxAmount.toFixed(2);
            sumElectricityElectricityAmount = sumElectricityElectricityAmount.toFixed(2);
            $scope.resultData.electrictyMidInvoices[index]=item;
            $scope.checkElectricityAmount = sumElectricityAmount;
            $scope.checkElectricityTaxAmount = sumElectricityTaxAmount;
            $scope.checkElectricityElectricityAmount = sumElectricityElectricityAmount;
        }
    }
    
    //手动填写电费金额(不含税)，此controller中没有用到这个
    $scope.changeInvoice=function(item,invoiceId,index){
        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.electricityAmount && item.electricityAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.electricityAmount && !reg.test(item.electricityAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.electricityAmount  && item.electricityAmount .length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else{
            $scope.editInit = item.electricityAmount;
            item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额

        // 手填自动算出其他的电费不含税
        //
        // if($scope.resultData.electrictyMidInvoices.length == 2){

        //     for(var j= 0; j<$scope.resultData.electrictyMidInvoices.length; j++){
        //         if(index != [j]){
        //             $scope.resultData.electrictyMidInvoices[j].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost-$scope.editInit-item.taxAmount)/(($scope.resultData.electrictyMidInvoices[j].billTax/100)+1)).toFixed(2);
        //             $scope.resultData.electrictyMidInvoices[j].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount*($scope.resultData.electrictyMidInvoices[j].billTax/100)).toFixed(2);


        //         }
        //     }

        // }



        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            var sumElectricityAmount = 0;
            for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            $scope.resultData.electrictyMidInvoices[index]=item;
            $scope.checkElectricityAmount = sumElectricityAmount;
        }
    }



    //取消返回页面
    $scope.returnPage = function(){
        $state.go('app.inputTariff',{
            'status':'tariff/sumbit'
        });
    }

	//保存选择的部门名
	$scope.selectDepartmentName = function(data){
		if(data==null){
			 utils.msg("请选择一个部门！");
			 return;
		}
		$scope.resultData.departmentName=data;
		utils.msg("你选择了部门:"+data);
	};

    // 保存综合新增稽核单
    $scope.saveElectricty=function(status){
		if($scope.resultData.contractID==null){
			 utils.msg("请选择合同后再提交！");
            return;
		}
        if($scope.resultData.watthourExtendVOs.length == 0 ){
            utils.msg("电表信息,请认真填写后再提交！");
            return;
        }else if($scope.checkElectricityAmount && $scope.checkElectricityAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }else{
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.viewMaxReading;
            }
            if($scope.uploadFiles.length > 0){
                for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
                }
            }
            delete  $scope.resultData.sysSupplierName;   //526暂时隐藏
            $scope.resultData.status = status;
            $scope.resultData.productNature = $scope.siteObject.productNature;
            console.log("resultData" , angular.toJson($scope.resultData,true));
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
/*			if($scope.resultData.electrictyMidInvoices.length>0){
				for(var i=0;i<$scope.resultData.electrictyMidInvoices.length;i++){
					 var items =$scope.resultData.electrictyMidInvoices[i];				 
				if(items.billType.length>4){
					if(items.billType.substring(items.billType.length-4,items.billType.length)=="(3%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				if(items.billType.length>5){
					if(items.billType.substring(items.billType.length-5,items.billType.length)=="(17%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				}
				
			}*/
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.payType==-1){
            	utils.msg("请选择缴费类型");
            	return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }
            commonServ.saveZElectricty($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $state.go('app.inputZTariff',{
                        'status':'tariffZ/sumbit'
                    });
                });
            });
        }
    }

    // 提交新增稽核单
    $scope.submitElectricty=function(status){
		if($scope.resultData.contractID==null){
			 utils.msg("请选择合同后再提交！");
            return;
		}
        if($scope.resultData.watthourExtendVOs.length == 0 ){
            utils.msg("电表信息,请认真填写后再提交！");
            return;
        }else if($scope.checkElectricityAmount && $scope.checkElectricityAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }else{
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.viewMaxReading;

            }
            if($scope.uploadFiles.length > 0){
                for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
                }
            }
            delete  $scope.resultData.sysSupplierName;   //526暂时隐藏
            $scope.resultData.status = status;
            $scope.resultData.productNature = $scope.siteObject.productNature;
            console.log("resultData" , angular.toJson($scope.resultData,true));
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
/*			if($scope.resultData.electrictyMidInvoices.length>0){
				for(var i=0;i<$scope.resultData.electrictyMidInvoices.length;i++){
					 var items =$scope.resultData.electrictyMidInvoices[i];				 
				if(items.billType.length>4){
					if(items.billType.substring(items.billType.length-4,items.billType.length)=="(3%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				if(items.billType.length>5){
					if(items.billType.substring(items.billType.length-5,items.billType.length)=="(17%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				}
				
			}*/
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if(!$scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }
            commonServ.saveZElectricty($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
                    $state.go('app.auditTariff',{
                        'status':'tariff/audit'
                    });
                });
            });
        }
    }


/********************************************************自维电费录入 查看、修改稽核单****************************************************************/

    /**
     * @自维电费录入修改------添加发票、手动添加、修改发票
     */
    $scope.editInvoiceVO = function(){
        if($scope.singleDetail.totalAmount != "" || !$scope.flagSave  && $scope.flagSave != undefined) {  //有数据才可添加发票
            $scope.isEditAudit = true;
            $scope.isAudit = false;
            if($scope.electrictyMidInvoices.length>=1){
                $scope.disabled = false;
                $scope.electrictyMidInvoices.unshift({
                    "taxAmount":0,   //税金金额
                    "electricityAmount":0,
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else{
                $scope.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
        }
    }


    /**
     * @async
     */
    //删除添加的发票
    $scope.removeEditInvoiceVO=function(index,item){

        if($scope.electrictyMidInvoices.length == 1){
            item.electricityAmount= parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
            utils.msg("对不起，不能删除最后一张!");
            return;
        }else{
            $scope.electrictyMidInvoices.splice(index,1);
            if($scope.electrictyMidInvoices.length == 1){
                $scope.disabled = true;
                $scope.electrictyMidInvoices[0].electricityAmount = parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / (($scope.electrictyMidInvoices[0].billTax/100)+1)).toFixed(2) ; //电费金额不含税
                $scope.electrictyMidInvoices.invoiceId = $scope.electrictyMidInvoices[0].invoiceId;
                $scope.electrictyMidInvoices[0].billTax = $scope.electrictyMidInvoices[0].billTax;
                $scope.electrictyMidInvoices[0].billType = $scope.electrictyMidInvoices[0].billType;
                $scope.electrictyMidInvoices[0].taxAmount = parseFloat($scope.electrictyMidInvoices[0].electricityAmount* ($scope.electrictyMidInvoices[0].billTax/100)).toFixed(2);  //税金金额
            }
        }
    }


    // 选择发票种类--修改电费录入
    $scope.selectEditInvoiceVOs = function(item,invoiceId,index){
        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率

        if($scope.electrictyMidInvoices.length ==1 && item.electricityAmount != 0){   // 只有一张发票时
            item.electricityAmount= parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
        }

        item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
        $scope.electrictyMidInvoices[index]=item;
        var sumElectricityAmount = 0;
        for(var j=0; j<$scope.electrictyMidInvoices.length; j++){
            sumElectricityAmount +=
            parseFloat($scope.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.electrictyMidInvoices[j].taxAmount);
        }
        sumElectricityAmount=sumElectricityAmount.toFixed(2);
        $scope.checkAmount = sumElectricityAmount;   //需要校验的金额

    }




    $scope.editInitAudit = 0;   //手动填写的初始电费金额
    $scope.checkAmount = 0;  // 修改校验支付总金额 == 发票金额 + 总金额不含税
    //手动填写电费金额(不含税)--修改电费录入
    $scope.changeEditInvoice=function(item,invoiceId,index){

        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.electricityAmount && item.electricityAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.electricityAmount && !reg.test(item.electricityAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.electricityAmount  && item.electricityAmount .length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else{
            $scope.editInitAudit  = item.electricityAmount;
            item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
            $scope.electrictyMidInvoices[index]=item;
            //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            // $scope.taxAmount = sumElectricityAmount;
            var sumElectricityAmount = 0;
            for(var j=0; j<$scope.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.electrictyMidInvoices[j].taxAmount);
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            $scope.checkAmount = sumElectricityAmount;   //需要校验的金额

        }

    }




     // 手动填写其他费用(电费录入修改)
   $scope.countTotal = function(){
		
		if($scope.singleDetail.otherCost==null||$scope.singleDetail.otherCost==""){
			$scope.singleDetail.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if($scope.singleDetail.otherCost && !reg.test($scope.singleDetail.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.singleDetail.otherCost && $scope.singleDetail.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.singleDetail.otherCost && $scope.singleDetail.otherCost < 0){
            utils.msg("数值不能为负。");
            return;
        }else if($scope.singleDetail.otherCost){
			 $scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmounts).add(new BigDecimal($scope.singleDetail.otherCost))+"";  //支付总金额
        $scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmounts).add(new BigDecimal($scope.singleDetail.otherCost))+""; //总金额（含税）+=其他金额

           // $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost).toFixed(2);  //支付总金额
        }else {
			$scope.singleDetail.paymentAmount = $scope.singleDetail.totalAmount;
			$scope.singleDetail.totalAmount = $scope.singleDetail.totalAmount;
			
           // $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount).toFixed(2);
        }
		if($scope.singleDetail.otherCost=="0"){
			$scope.singleDetail.otherCost=null;
		}
		
        if($scope.singleDetail.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
            $scope.singleDetail.electrictyMidInvoices.splice(0,1,{
				"taxAmount": new BigDecimal($scope.singleDetail.totalAmount).multiply(new BigDecimal($scope.singleDetail.electrictyMidInvoices[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
                "electricityAmount": new BigDecimal($scope.singleDetail.totalAmount).subtract(new BigDecimal($scope.singleDetail.totalAmount).multiply(new BigDecimal($scope.singleDetail.electrictyMidInvoices[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税

				//"taxAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
               // "electricityAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.singleDetail.electrictyMidInvoices[0].id,
                "billType":$scope.singleDetail.electrictyMidInvoices[0].billType,
                "billTax":$scope.singleDetail.electrictyMidInvoices[0].billTax,
            })
        }
    }



    /**
     * @ （综合）电费录入页面-----修改保存稽核单
    */
    $scope.editZiweiElectricty=function(status){
        $scope.resultData = {
            "id":$scope.editZiweiID,
            "status":status,
            "costCenterID":$scope.singleDetail.costCenterID,
            "towerSiteNumber":$scope.singleDetail.towerSiteNumber,
            "serialNumber":$scope.singleDetail.serialNumber,
            "productNature":$scope.singleDetail.productNature,
            "sysAccountSiteId":$scope.singleDetail.sysAccountSiteId,  //报账点ID
            "taxAmount":$scope.singleDetail.taxAmount,
            "otherCost":$scope.singleDetail.otherCost,
            "totalAmount":$scope.singleDetail.totalAmount,
            "paymentAmount":$scope.singleDetail.paymentAmount,
            "sysSupplierID":$scope.singleDetail.supplierID,
            "attachmentId":[],
            "watthourExtendVOs":$scope.singleDetail.watthourMeterVOs,
            "electrictyMidInvoices":$scope.electrictyMidInvoices,
            "sysRgID":$scope.singleDetail.sysRgID,
            "contractID":$scope.singleDetail.contractID,  //合同ID
			"departmentName":$scope.singleDetail.departmentName, //部门名
			"overproofReasons":$scope.singleDetail.overproofReasons,
            "remark":$scope.singleDetail.remark
        }
        if($scope.checkAmount && $scope.checkAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }
        for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
            var obj= $scope.resultData.watthourExtendVOs[i];
                delete  obj.reimbursementDate;
                delete  obj.status;
                delete  obj.id;
                delete  obj.code;
                delete  obj.paymentAccountCode;
                delete  obj.ptype;
                delete  obj.rate;
                delete  obj.maxReading;
                delete  obj.currentReading;
                delete  obj.belongAccount;
                delete  obj.damageNum;
                delete  obj.damageDate;
                delete  obj.damageInnerNum;
                delete  obj.damageMeterNum;
                delete  obj.reimbursementDateStr;
                delete  obj.currentReadingStr;
                delete  obj.accountSiteId;
                delete  obj.accountName;
                delete  obj.oldFinanceName;
                delete  obj.mid;
                delete  obj.count;
                delete  obj.cityId;
                delete  obj.countyId;
                delete  obj.price;
                delete  obj.updateTimeStr;
                delete  obj.viewMaxReading;
        }
        // 附件信息
        if($scope.singUploadFiles){
            for(var fileId=0; fileId < $scope.singUploadFiles.length; fileId++){
                $scope.resultData.attachmentId.push($scope.singUploadFiles[fileId].id);
            }
        }
        if($scope.singleDetail.productNature == "自维") {
            $scope.resultData.productNature = "0";
        }else {
            $scope.resultData.productNature = "1";
        }

        delete $scope.resultData.name;
        console.log("resultData" , angular.toJson($scope.resultData,true));
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
            utils.msg("备注信息不能超过150个字符。");
            return;
        }
        if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
            utils.msg("支付总金额不能为负。");
            return;
        }
        if($scope.resultData.payType==-1 || $scope.resultData.payType==null){
        	utils.msg("请选择缴费类型");
        	return;
        }
        if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }
        for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
            var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
            if(metert && metert < 0){
                utils.msg("数值不能为负。");
                return;
            }else if(metert && !reg.test(metert)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if(metert  && metert.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
        }
        commonServ.modifyElectricty($scope.resultData).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.closeDialog('showZweiDialog');
                $scope.getZiweiData();
            });
        });

    }


/********************************************************自维电费稽核 查看、修改稽核单****************************************************************/

        /**
         * @ 电费稽核页面  修改保存稽核单
        */

        $scope.editZiweiAudit=function(){
            $scope.resultData = {
                "instanceId":$scope.instanceId,
                "id":$scope.editZiweiID,
                "status":status,
                "costCenterID":$scope.singleDetail.costCenterID || null,
                "towerSiteNumber":$scope.singleDetail.towerSiteNumber,
                "serialNumber":$scope.singleDetail.serialNumber,
                "sysAccountSiteId":$scope.singleDetail.sysAccountSiteId,  //报账点ID
                "otherCost":$scope.singleDetail.otherCost,
                "totalAmount":$scope.singleDetail.totalAmount,
                "paymentAmount":$scope.singleDetail.paymentAmount,
                "sysSupplierID":$scope.singleDetail.supplierID || null,
                "attachmentId":[],
                "watthourExtendVOs":$scope.singleDetail.watthourMeterVOs,
                "electrictyMidInvoices":$scope.electrictyMidInvoices,
                "remark":$scope.singleDetail.remark,
                "contractID":$scope.singleDetail.contractID,  //合同ID
				"departmentName":$scope.singleDetail.departmentName, //部门名
				"overproofReasons":$scope.singleDetail.overproofReasons,
                "sysRgID":$scope.singleDetail.sysRgID
            }
            if($scope.checkAmount && $scope.checkAmount!=$scope.resultData.paymentAmount) {
                utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
                return;
            }
            for(var i=0; i<$scope.singleDetail.watthourMeterVOs.length; i++){
                if($scope.singleDetail.watthourMeterVOs[i].whetherMeter == "是") {
                    $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "1";
                }else {
                    $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "0";
                }
            }
            // 附件信息
            if($scope.singUploadFiles){
                for(var fileId=0; fileId < $scope.singUploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.singUploadFiles[fileId].id);
                }
            }
            // 电表信息
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.price;
                    delete  obj.updateTimeStr;
                    delete  obj.viewMaxReading;

            }
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }

            commonServ.editAduit($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.closeDialog('showZweiAuditDialog');
                    $scope.getZwAuditDetail();
                });
            });
        }

}]);







/**
 * 电费录入
 */
app.controller('tariffSumbitCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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



    //获取电费录入列表
    $scope.getZiweiData=function() {
        angular.extend($scope.params,{
           "accountName":$scope.accountName, //报账点名称
            "cityId":$scope.cityId,
            "countyId":$scope.countyId,
            // "syseRgName":$scope.syseRgName,     // 报账点名称
            "serialNumber":$scope.serialNumber,  // 稽核单号
            "statuses":"0,7",
            "auditType":0
        });

        delete $scope.params.page;
        commonServ.inputElectrictyQueryPage($scope.params).success(function (data) {
            if(data.data.results == "") {
                utils.msg("目前暂无数据！");
            }
            utils.loadData(data, function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });

        // 回车搜索
        $scope.search=function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.getZiweiData();
            }
        };
    }


    /**
     * 批量删除
     */
    $scope.deleteSelected=function(){
        var list=[];
        list= utils.getCheckedVals('#list',false);
        if(list.length<1){
            utils.msg("请选择要删除的项目");
            return;
        }

        utils.confirm('确定要删除吗？',"",function(){
            commonServ.deleteInputElectricty(list).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZiweiData();
                    unCheckAll('#list')
                });
            });
        });
    }

    //单个删除
    $scope.deleteSelected2=function(id){
        utils.confirm('确定要删除吗？',"",function(){
            commonServ.deleteInputElectricty(id).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZiweiData();
                    unCheckAll('#list')
                });
            });
        });
    }


    /**
     * 批量提交
     */
    $scope.bachSubmit=function(){

        var list=[];
        list= utils.getCheckedVals('#list',false);
        if(list.length<1){
            utils.msg("请选择至少一项");
            return;
        }
        utils.confirm('确定要提交吗？',"",function(){
            commonServ.checkMarkDetails(list).success(function(data){
                if(data.data.length == 0){
                    commonServ.submitElectricty(list).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.params.pageNo=1;
                            $scope.getZiweiData();
                            unCheckAll('#list');
                        });
                    });
                }else{
                    var checkMark = data.data;
                    var listDetail = [];
                    var listDetail = list.split(",");
                    var tips = "";
                    var tsArr = new Array();
                    for(var j=0; j<listDetail.length; j++){
                        for(var i=0; i<checkMark.length; i++){
                            if(checkMark[i].electricityId == listDetail[j] && checkMark[i].type == "额定功率"){
                                if(checkMark[i].overProportion > 0){
                                    tips += '当前稽核单号'+checkMark[i].electricitySN+'电量已经超标杆了，超标类型为额定功率，超标杆比例为'+checkMark[i].overProportion+'%'
                                    tsArr.push(listDetail[j]);
                                }else if( checkMark[i].overProportion == "" || checkMark[i].overProportion == "0"){
                                    commonServ.submitElectricty(list).success(function(data){
                                        utils.ajaxSuccess(data,function(data){
                                            $scope.params.pageNo=1;
                                            $scope.getZiweiData();
                                            unCheckAll('#list');
                                        });
                                    });
                                }
                            }
                        }
                    }

                    if(tips) {
                        for(var index=0; index<tips.length; index++) {
                            utils.confirm(tips+' ，确定是否进行提交操作？',"",function(){
                                commonServ.submitElectricty(list).success(function(data){
                                    utils.ajaxSuccess(data,function(data){
                                        $scope.params.pageNo=1;
                                        $scope.getZiweiData();
                                        unCheckAll('#list');
                                    });
                                });
                            })
                        }
                    }
                }
            });
        });
    };
    
    
     /**
     * 单个提交-----超标杆控制
     */
    $scope.bachSubmit2=function(id){
        utils.confirm('确定要提交吗？',"",function(){
        	$rootScope.idid=id;
//        	alert($rootScope.idid);
            commonServ.checkMarkDetails(id).success(function(data){  //超标杆值查询
                if(data.data.length == 0){
                    commonServ.submitElectricty(id).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.params.pageNo=1;
                            $scope.getZiweiData();
                        });
                    });
                }else{
                    var checkMark = data.data[0].overProportion;
                    if( checkMark == "" || checkMark == "0"){  // 不超标
                        commonServ.submitElectricty(id).success(function(data){
                            utils.ajaxSuccess(data,function(data){
                                $scope.params.pageNo=1;
                                $scope.getZiweiData();
                            });
                        });
                    }else if(checkMark > 0 ) {  // 超标
                    		  $scope.overhtml=ngDialog.open({
                    	            template: './tpl/over.html?time='+new Date().getTime(),
                    	            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                    	            width: 1200,
                    	            controller:'tariffSumbitCtrl',
                    	            scope: $scope
                    	        });
                    		  $scope.overdata=data.data;
                    		  $scope.overproofReasons='当前稽核单号'+data.data[0].electricitySN+'电量已经超标杆了，超标类型为额定功率，超标杆比例为'+data.data[0].overProportion+'%';
                    		    $scope.changeOther=function(){
                    		    	var other=$("[name='other']").find("option:selected").text();
                    		    	if(other==="其他"){
                    		    		$scope.overproofReasons="";
                    		    	}else{
                    		    		$scope.overproofReasons=other;
                    		    	}
                    		    	
                    		    };
/*                        utils.confirm('当前稽核单号'+data.data[0].electricitySN+'电量已经超标杆了，超标类型为额定功率，超标杆比例为'+data.data[0].overProportion+'%'+'，确定是否进行提交操作？',"",function(){
                        	//写入超标杆原因
                    		    
                        	$scope.pppa={
                        			"id":id,
                        			"dec":$scope.overproofReasons
                        	};
                        	
                        	commonServ.addDEC($scope.pppa).success(function(){
                        		
                        	});
                            commonServ.submitElectricty(id).success(function(data){
                                utils.ajaxSuccess(data,function(data){
                                    $scope.params.pageNo=1;
                                    $scope.getZiweiData();
                                });
                            });
                        })*/
                    }
                }

            });
        });
    };
    
    $scope.sure11=function(){
    	$scope.pppa={
    			"id":$rootScope.idid,
    			"dec":$scope.overproofReasons
    	};
//    	alert($rootScope.idid);
    	commonServ.addDEC($scope.pppa).success(function(){
    		$scope.overhtml.close("");
    	});
        commonServ.submitElectricty($rootScope.idid).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.params.pageNo=1;
                $scope.getZiweiData();
            });
        });
    	
    }



    //跳转到添加或修改页面
    $scope.goAddPage=function(){
        $state.go('app.addAudit',{
            'status':'add',
            'id':'none'
        });
    }

    $scope.tab=1;

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
    
    //列表单个查看、修改详情
    $scope.showSubmitDetail=function(item,flag,save){
        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.editZiweiID= item.id;
        $scope.isZWsubmitSave = save;
        // 列表单个详情
        commonServ.getInputElectrictyById(item.id).success(function (data) {
            utils.loadData(data,function (data) {
				$scope.departmentName = data.data.departmentName;
                $scope.singleDetail = data.data;
				if(data.data.totalAmount==null||data.data.totalAmount==""){
					data.data.totalAmount="0.00";
				}
				if(data.data.otherCost==null||data.data.otherCost==""){
					data.data.otherCost="0.00";
				}
				$scope.totalAmounts = new BigDecimal(data.data.totalAmount).subtract(new BigDecimal(data.data.otherCost))+"";
                if(data.data.sysFileVOs.length>0){
                    $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                }
                //初始化取值
                $scope.departmentName = data.data.departmentName;
                $scope.singleDetail = data.data;
                $scope.watthourMeterVOs = data.data.watthourMeterVOs;
                
                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;  //发票信息
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
                }else if($scope.singleDetail.productNature == '1'){
                    $scope.singleDetail.productNature = '塔维';
                }
                
                $scope.totalAmounts = new BigDecimal(data.data.totalAmount).subtract(new BigDecimal(data.data.otherCost))+"";
              //*************
                //var siteId=$scope.resultData.sysAccountSiteId;//报账单ID
                var siteId=$scope.singleDetail.sysAccountSiteId;//报账单ID
                var contractID=$scope.singleDetail.contractID;//合同id
                if(siteId !== ""){
                	// 电表数组为空新增   电表数组不为空直接显示--------新增电表时
                	if($scope.watthourMeterVOs.length < 1){
                		$scope.isNew = true;   //默认显示viewMaxReading
                		
                		commonServ.getMt(siteId).success(function (data) {
             	        	$rootScope.belongEndTimezw= new Array(data.data.length);//电费归属终止日期
             		        $rootScope.endAmmeterzw= new Array(data.data.length); //用电终度（度）
             	        	  for(var index=0; index<data.data.length; index++) {
             	        		  $rootScope.belongEndTimezw[index]= data.data[index].belongEndTimeS;//电费归属终止日期
             		              $rootScope.endAmmeterzw[index]= data.data[index].endAmmeter; //用电终度（度）
             	              }
             	       	});
                		//通过报账点查询电表信息
                		commonServ.getInputElectrictyDetail(siteId).success(function(data){					
                			$rootScope.createDate=data.createDate;
                			$rootScope.nowTime= new Date();
                			
                			if(data != "" && data.watthourMeterVOs.length > 0){
                				for(var index=0; index<data.watthourMeterVOs.length; index++) {							
                					data.watthourMeterVOs[index].watthourId = data.watthourMeterVOs[index].id;
                					data.watthourMeterVOs[index].belongStartTime=$rootScope.belongEndTimezw[index];
                					data.watthourMeterVOs[index].startAmmeter=$rootScope.endAmmeterzw[index];
                					//判断上次拍照时间是否有值
                					if(data.watthourMeterVOs[index].takePhotosTime==null){
                						data.watthourMeterVOs[index].photosStatus=false;	//拍照时间为null,用户选择上次拍照时间
                						
                					}else{
                						data.watthourMeterVOs[index].photosStatus=true; //拍照时间不为null,上次拍照时间为后台查询出来的拍照时间
                						data.watthourMeterVOs[index].takePhotosTime=$scope.dataChange(data.watthourMeterVOs[index].takePhotosTime);
                					}
                					data.watthourMeterVOs[index].lastTakePhotosTime=data.watthourMeterVOs[index].takePhotosTime;//上次拍照时间=拍照时间
                					//判断最大读数是否有值
                					if(data.watthourMeterVOs[index].maxReadings==null){
                						data.watthourMeterVOs[index].maxReadingStatus=false;	//最大读数为null,用户选择最大读数					
                					}else{
                						data.watthourMeterVOs[index].maxReadingStatus=true; //最大读数不为null,带出用户上次选择
                					}
                				}
                				$scope.watthourMeterVOs =utils.deepCopy(data.watthourMeterVOs);
                				
                			}else {
                				utils.msg("报账点对应的电表信息为空，请重新选择报账点！");
                				// $scope.closeDialog('accountSiteDialog');  此处6月8日已注释
                				return;
                			}
                		});
                	}else{
                		//处理时间格式
                        for(var i=0; i<$scope.watthourMeterVOs.length;i++){
                        	
                        	$scope.watthourMeterVOs[i].belongEndTime = $scope.dataChange($scope.watthourMeterVOs[i].belongEndTime);
                        	$scope.watthourMeterVOs[i].belongStartTime = $scope.dataChange($scope.watthourMeterVOs[i].belongStartTime);
                        	$scope.watthourMeterVOs[i].lastTakePhotosTime = $scope.dataChange($scope.watthourMeterVOs[i].lastTakePhotosTime);
                        	$scope.watthourMeterVOs[i].theTakePhotosTime = $scope.dataChange($scope.watthourMeterVOs[i].theTakePhotosTime);
                        	
                        }
                		$scope.isNew = false;
                		
                	}
                	
                } 
            })
        });

        $scope.showZweiDialog=ngDialog.open({
            template: './tpl/auditPageDialog2_1.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'addOrUpdateAuditCtrl_1',
            scope: $scope
        });

    }

    // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showZweiDialog.close("");
    };
    
  //保存提交的时候核销计算
    $scope.countMoney2=function(){
    	var noNum = $scope.singleDetail.adpv;//所有核销数据list
    	var totalAmount = $scope.singleDetail.totalAmount*1;//稽核单总金额(含税)
    	var allExpenseAmount = 0;//本次总共想要核销的金额
    	for(var i=0;i<noNum.length;i++){
    		allExpenseAmount += noNum[i].expenseAmount*1;
    	}
    	if(allExpenseAmount>totalAmount){
    		return 0;//表示核销超过总金额
    	}else{
    		return 1;//表示ok
    	}
    }
    
    
    //核销计算
    $scope.countMoney1=function(index){
    	//alert("计算核销金");
    	var noNum = $scope.singleDetail.adpv;//所有核销数据list
    	var expenseAmount = noNum[index].expenseAmount*1;//该次想要核销的金额
    	var surplusMoney = noNum[index].surplusMoney*1;//该预付单最多能核销的金额
    	var allSurplusMoney = 0;//所有预付单总共能核销的金额
    	var allExpenseAmount = 0;//本次总共想要核销的金额
    	for(var i=0;i<noNum.length;i++){
    		allSurplusMoney += noNum[i].surplusMoney*1;
    		allExpenseAmount += noNum[i].expenseAmount*1;
    	}
    	var totalAmount = $scope.singleDetail.totalAmount*1;//稽核单总金额(含税)
    	
    	if(expenseAmount*1 != expenseAmount){
    		utils.msg("请输入数字格式");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(expenseAmount<0){
    		utils.msg("请输入大于0的数字");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(expenseAmount>surplusMoney){
    		utils.msg("输入的核销金额大于该预付单能核销的金额");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(allExpenseAmount>allSurplusMoney){
    		utils.msg("总核销金额大于所有预付单能核销金额之和");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(allExpenseAmount>totalAmount){
    		utils.msg("总核销金额大于稽核单总金额");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	//设置本次想核销总金额(改在提交中设置)
    	//$scope.resultData.expenseTotalAmount=allExpenseAmount;
    	//未完待续*********************************************************************
    };



}]);









/**
 * 综合电费录入
 */
app.controller('tariffZSumbitCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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



    //获取电费录入列表
    $scope.getZiweiData=function() {
        angular.extend($scope.params,{
           "accountName":$scope.accountName, //报账点名称
            "cityId":$scope.cityId,
            "countyId":$scope.countyId,
            // "syseRgName":$scope.syseRgName,     // 报账点名称
            "serialNumber":$scope.serialNumber,  // 稽核单号
            "statuses":"0,7",
            "auditType":1//稽核类型
        });

        delete $scope.params.page;
        commonServ.inputElectrictyQueryPage($scope.params).success(function (data) {
            if(data.data.results == "") {
                utils.msg("目前暂无数据！");
            }
            utils.loadData(data, function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });

        // 回车搜索
        $scope.search=function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.getZiweiData();
            }
        };
    }


    /**
     * 批量删除
     */
    $scope.deleteSelected=function(){
        var list=[];
        list= utils.getCheckedVals('#list',false);
        if(list.length<1){
            utils.msg("请选择要删除的项目");
            return;
        }

        utils.confirm('确定要删除吗？',"",function(){
            commonServ.deleteInputElectricty(list).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZiweiData();
                    unCheckAll('#list')
                });
            });
        });
    }

    //单个删除
    $scope.deleteSelected2=function(id){
        utils.confirm('确定要删除吗？',"",function(){
            commonServ.deleteInputElectricty(id).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZiweiData();
                    unCheckAll('#list')
                });
            });
        });
    }


    /**
     * 批量提交
     */
    $scope.bachSubmit=function(){

        var list=[];
        list= utils.getCheckedVals('#list',false);
        if(list.length<1){
            utils.msg("请选择至少一项");
            return;
        }
        utils.confirm('确定要提交吗？',"",function(){
            commonServ.checkMarkDetails(list).success(function(data){
                if(data.data.length == 0){
                    commonServ.submitElectricty(list).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.params.pageNo=1;
                            $scope.getZiweiData();
                            unCheckAll('#list');
                        });
                    });
                }else{
                    var checkMark = data.data;
                    var listDetail = [];
                    var listDetail = list.split(",");
                    var tips = "";
                    var tsArr = new Array();
                    for(var j=0; j<listDetail.length; j++){
                        for(var i=0; i<checkMark.length; i++){
                            if(checkMark[i].electricityId == listDetail[j] && checkMark[i].type == "额定功率"){
                                if(checkMark[i].overProportion > 0){
                                    tips += '当前稽核单号'+checkMark[i].electricitySN+'电量已经超标杆了，超标类型为额定功率，超标杆比例为'+checkMark[i].overProportion+'%'
                                    tsArr.push(listDetail[j]);
                                }else if( checkMark[i].overProportion == "" || checkMark[i].overProportion == "0"){
                                    commonServ.submitElectricty(list).success(function(data){
                                        utils.ajaxSuccess(data,function(data){
                                            $scope.params.pageNo=1;
                                            $scope.getZiweiData();
                                            unCheckAll('#list');
                                        });
                                    });
                                }
                            }
                        }
                    }

                    if(tips) {
                        for(var index=0; index<tips.length; index++) {
                            utils.confirm(tips+' ，确定是否进行提交操作？',"",function(){
                                commonServ.submitElectricty(list).success(function(data){
                                    utils.ajaxSuccess(data,function(data){
                                        $scope.params.pageNo=1;
                                        $scope.getZiweiData();
                                        unCheckAll('#list');
                                    });
                                });
                            })
                        }
                    }
                }
            });
        });
    };


     /**
     * 综合单个提交-----超标杆控制
     */
    $scope.bachSubmit2=function(id){
        utils.confirm('确定要提交吗？',"",function(){

            /*commonServ.checkMarkDetails(id).success(function(data){  //超标杆值查询
                if(data.data.length == 0){
                    commonServ.submitElectricty(id).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.params.pageNo=1;
                            $scope.getZiweiData();
                        });
                    });
                }else{
                    var checkMark = data.data[0].overProportion;
                    if( checkMark == "" || checkMark == "0"){  // 不超标
                        commonServ.submitElectricty(id).success(function(data){
                            utils.ajaxSuccess(data,function(data){
                                $scope.params.pageNo=1;
                                $scope.getZiweiData();
                            });
                        });
                    }else if(checkMark > 0 ) {  // 超标
                        utils.confirm('当前稽核单号'+data.data[0].electricitySN+'电量已经超标杆了，超标类型为额定功率，超标杆比例为'+data.data[0].overProportion+'%'+'，确定是否进行提交操作？',"",function(){
                            commonServ.submitElectricty(id).success(function(data){
                                utils.ajaxSuccess(data,function(data){
                                    $scope.params.pageNo=1;
                                    $scope.getZiweiData();
                                });
                            });
                        })
                    }
                }

            });*/
        	
        	commonServ.submitZElectricty(id).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZiweiData();
                });
            });
        });
    };



    //跳转到添加或修改页面
    $scope.goAddPage=function(){
        $state.go('app.addZAudit',{
            'status':'addZ',
            'id':'nonez'
        });
    }

    $scope.tab=1;

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
    
    //综合电费列表单个查看、修改详情
    $scope.showSubmitDetail=function(item,flag,save){

        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.editZiweiID= item.id;
        $scope.isZWsubmitSave = save;
        // 列表单个详情
        commonServ.getInputElectrictyById(item.id).success(function (data) {
            utils.loadData(data,function (data) {
            	//
                $scope.watthourMeterVOs = data.data.watthourMeterVOs;
                
				$scope.departmentName = data.data.departmentName;
                $scope.singleDetail = data.data;
				if(data.data.totalAmount==null||data.data.totalAmount==""){
					data.data.totalAmount="0.00";
				}
				if(data.data.otherCost==null||data.data.otherCost==""){
					data.data.otherCost="0.00";
				}
				$scope.totalAmounts = new BigDecimal(data.data.totalAmount).subtract(new BigDecimal(data.data.otherCost))+"";
                if(data.data.sysFileVOs.length>0){
                    $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                }
                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;  //发票信息
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
                }else if($scope.singleDetail.productNature == '1'){
                    $scope.singleDetail.productNature = '塔维';
                }
                $scope.totalAmounts = new BigDecimal(data.data.totalAmount).subtract(new BigDecimal(data.data.otherCost))+"";
                //*************
                //var siteId=$scope.resultData.sysAccountSiteId;//报账单ID
                var siteId=$scope.singleDetail.sysAccountSiteId;//报账单ID
                var contractID=$scope.singleDetail.contractID;//合同id
                if(siteId !== ""){
                	// 电表数组为空新增   电表数组不为空直接显示--------新增电表时
                	if($scope.watthourMeterVOs.length < 1){
                		$scope.isNew = true;   //默认显示viewMaxReading
                		
                		commonServ.getMt(siteId).success(function (data) {
             	        	$rootScope.belongEndTimezw= new Array(data.data.length);//电费归属终止日期
             		        $rootScope.endAmmeterzw= new Array(data.data.length); //用电终度（度）
             	        	  for(var index=0; index<data.data.length; index++) {
             	        		  $rootScope.belongEndTimezw[index]= data.data[index].belongEndTimeS;//电费归属终止日期
             		              $rootScope.endAmmeterzw[index]= data.data[index].endAmmeter; //用电终度（度）
             	              }
             	       	});
                		//通过报账点查询电表信息
                		commonServ.getInputElectrictyDetail(siteId).success(function(data){					
                			$rootScope.createDate=data.createDate;
                			$rootScope.nowTime= new Date();
                			
                			if(data != "" && data.watthourMeterVOs.length > 0){
                				for(var index=0; index<data.watthourMeterVOs.length; index++) {							
                					data.watthourMeterVOs[index].watthourId = data.watthourMeterVOs[index].id;
                					data.watthourMeterVOs[index].belongStartTime=$rootScope.belongEndTimezw[index];
                					data.watthourMeterVOs[index].startAmmeter=$rootScope.endAmmeterzw[index];
                					//判断上次拍照时间是否有值
                					if(data.watthourMeterVOs[index].takePhotosTime==null){
                						data.watthourMeterVOs[index].photosStatus=false;	//拍照时间为null,用户选择上次拍照时间
                						
                					}else{
                						data.watthourMeterVOs[index].photosStatus=true; //拍照时间不为null,上次拍照时间为后台查询出来的拍照时间
                						data.watthourMeterVOs[index].takePhotosTime=$scope.dataChange(data.watthourMeterVOs[index].takePhotosTime);
                					}
                					data.watthourMeterVOs[index].lastTakePhotosTime=data.watthourMeterVOs[index].takePhotosTime;//上次拍照时间=拍照时间
                					//判断最大读数是否有值
                					if(data.watthourMeterVOs[index].maxReadings==null){
                						data.watthourMeterVOs[index].maxReadingStatus=false;	//最大读数为null,用户选择最大读数					
                					}else{
                						data.watthourMeterVOs[index].maxReadingStatus=true; //最大读数不为null,带出用户上次选择
                					}
                				}
                				$scope.watthourMeterVOs =utils.deepCopy(data.watthourMeterVOs);
                				
                			}else {
                				utils.msg("报账点对应的电表信息为空，请重新选择报账点！");
                				// $scope.closeDialog('accountSiteDialog');  此处6月8日已注释
                				return;
                			}
                		});
                	}else{
                		//处理时间格式
                        for(var i=0; i<$scope.watthourMeterVOs.length;i++){
                        	
                        	$scope.watthourMeterVOs[i].belongEndTime = $scope.dataChange($scope.watthourMeterVOs[i].belongEndTime);
                        	$scope.watthourMeterVOs[i].belongStartTime = $scope.dataChange($scope.watthourMeterVOs[i].belongStartTime);
                        	$scope.watthourMeterVOs[i].lastTakePhotosTime = $scope.dataChange($scope.watthourMeterVOs[i].lastTakePhotosTime);
                        	$scope.watthourMeterVOs[i].theTakePhotosTime = $scope.dataChange($scope.watthourMeterVOs[i].theTakePhotosTime);
                        	
                        }
                		$scope.isNew = false;
                		
                	}
                	
                }
            })
        });
        
        
        //修改页面选择缴费类型
        $scope.selectpayType1=function(payType){
        	 $scope.singleDetail.payType=payType;
        	 if($scope.singleDetail.payType!=-1){
        		 if($scope.singleDetail.payType>1 ){
            		 $scope.singleDetail.professional="全业务"
            	 }else{
            		 $scope.singleDetail.professional="无线"
            	 }
        	 }
        }

        $scope.showZweiDialog=ngDialog.open({
            template: './tpl/zh/auditPageDialog2_1.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'addOrUpdateZAuditCtrl_1',
            scope: $scope
        });

    }

    // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showZweiDialog.close("");
    };


}]);









/**
 * 电费稽核
 */
app.controller('tariffAuditCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

	if ($rootScope.stateType) {
		$scope.operation = true;
	}

    if($rootScope.reloadPage){
        $scope.operation = false;
    }else {
        $scope.operation = true;
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



     //获取电费列表   生成电费提交单查询--弹出框中按钮  公用
    $scope.getZwAuditDetail=function() {

        angular.extend($scope.params,{   
           "cityId":$scope.cityId, //地市
           "countyId":$scope.countyId, //区县
           "inputPerson":$("#inputPerson").val(), //录入人员
           "siteName":$("#siteName").val(), //报账点名称
        	"qSerialNumber":$scope.qSerialNumber, // 流水号
            "qStartTime":$("#id1").val(), // 时间
            "qEndTime":$("#id2").val(), // 时间
            "flowState":$scope.flowState, // 状态
            "qAccount" : $scope.qAccount,
            "operation" : $scope.operation
            
        });
        delete $scope.params.page;
        commonServ.getInputElectrictyList($scope.params).success(function (data) {
            if(data.data.results == "") {
                utils.msg("目前暂无数据！");
            }
            utils.loadData(data, function (data) {
            	console.log(data)
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }
    
  //导出excel文件
    $scope.downExcel=function(){
    	//$state.go('app.downExcel');
    	
    	var URL=commonServ.exportEleExcel();
    	alert("数据加载中,请耐心等待,勿重复点击!!");
    	var form=$("<form>");
    	form.attr("style","display:none");
    	form.attr("target","");
    	form.attr("method","post");
    	form.attr("action",URL);
    	
    	var input=$("<input>");
    	input.attr("type","hidden");
    	input.attr("name","cityId");
    	input.attr("value",$scope.cityId);
    	form.append(input);
    	
    	var input1=$("<input>");
    	input1.attr("type","hidden");
    	input1.attr("name","countyId");
    	input1.attr("value",$scope.countyId);
    	form.append(input1);
    	
    	var input2=$("<input>");
    	input2.attr("type","hidden");
    	input2.attr("name","inputPerson");
    	input2.attr("value",$("#inputPerson").val());
    	form.append(input2);
    	
    	var input3=$("<input>");
    	input3.attr("type","hidden");
    	input3.attr("name","siteName");
    	input3.attr("value",$("#siteName").val());
    	form.append(input3);
    	
    	var input4=$("<input>");
    	input4.attr("type","hidden");
    	input4.attr("name","qSerialNumber");
    	input4.attr("value",$scope.qSerialNumber);
    	form.append(input4);
    	
    	var input5=$("<input>");
    	input5.attr("type","hidden");
    	input5.attr("name","qStartTime");
    	input5.attr("value",$("#id1").val());
    	form.append(input5);
    	
    	var input6=$("<input>");
    	input6.attr("type","hidden");
    	input6.attr("name","qEndTime");
    	input6.attr("value",$("#id2").val());
    	form.append(input6);
    	
    	var input7=$("<input>");
    	input7.attr("type","hidden");
    	input7.attr("name","flowState");
    	input7.attr("value",$scope.flowState);
    	form.append(input7);
    	
    	var input8=$("<input>");
    	input8.attr("type","hidden");
    	input8.attr("name","qAccount");
    	input8.attr("value",$scope.qAccount);
    	form.append(input8);
    	
    	var input9=$("<input>");
    	input9.attr("type","hidden");
    	input9.attr("name","operation");
    	input9.attr("value",$scope.operation);
    	form.append(input9);
    	
    	$("body").append(form);
    	form.submit();
    	
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
        $scope.editZiweiID= item.electricty.id;
        $scope.instanceId = item.instanceId;
        $scope.isZWauditSave = true;
        // 列表详情
        commonServ.getInputElectrictyById(item.businessKey).success(function (data) {
        	utils.loadData(data,function (data) {
        		// debugger;
				$scope.departmentName = data.data.departmentName;
                $scope.singleDetail = data.data;
                $scope.isNewEle = data.data.isNewEle;
                $scope.watthourMeterVOs = data.data.watthourMeterVOs;
                if(data.data.sysFileVOs.length>0){
                    $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                }
                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
                }else if($scope.singleDetail.productNature == '1'){
                    $scope.singleDetail.productNature = '塔维';
                }
               
                //var siteId=$scope.resultData.sysAccountSiteId;//报账单ID
                var siteId=$scope.singleDetail.sysAccountSiteId;//报账单ID
                var contractID=$scope.singleDetail.contractID;//合同id
                if(siteId !== ""){
                	// 电表数组为空新增   电表数组不为空直接显示--------新增电表时
                	if($scope.watthourMeterVOs.length < 1){
                		$scope.isNew = true;   //默认显示viewMaxReading
                		
                		commonServ.getMt(siteId).success(function (data) {
             	        	$rootScope.belongEndTimezw= new Array(data.data.length);//电费归属终止日期
             		        $rootScope.endAmmeterzw= new Array(data.data.length); //用电终度（度）
             	        	  for(var index=0; index<data.data.length; index++) {
             	        		  $rootScope.belongEndTimezw[index]= data.data[index].belongEndTimeS;//电费归属终止日期
             		              $rootScope.endAmmeterzw[index]= data.data[index].endAmmeter; //用电终度（度）
             	              }
             	       	});
                		//通过报账点查询电表信息
                		commonServ.getInputElectrictyDetail(siteId).success(function(data){					
                			$rootScope.createDate=data.createDate;
                			$rootScope.nowTime= new Date();
                			
                			if(data != "" && data.watthourMeterVOs.length > 0){
                				for(var index=0; index<data.watthourMeterVOs.length; index++) {							
                					data.watthourMeterVOs[index].watthourId = data.watthourMeterVOs[index].id;
                					data.watthourMeterVOs[index].belongStartTime=$rootScope.belongEndTimezw[index];
                					data.watthourMeterVOs[index].startAmmeter=$rootScope.endAmmeterzw[index];
                					//判断上次拍照时间是否有值
                					if(data.watthourMeterVOs[index].takePhotosTime==null){
                						data.watthourMeterVOs[index].photosStatus=false;	//拍照时间为null,用户选择上次拍照时间
                						
                					}else{
                						data.watthourMeterVOs[index].photosStatus=true; //拍照时间不为null,上次拍照时间为后台查询出来的拍照时间
                						data.watthourMeterVOs[index].takePhotosTime=$scope.dataChange(data.watthourMeterVOs[index].takePhotosTime);
                					}
                					data.watthourMeterVOs[index].lastTakePhotosTime=data.watthourMeterVOs[index].takePhotosTime;//上次拍照时间=拍照时间
                					//判断最大读数是否有值
                					if(data.watthourMeterVOs[index].maxReadings==null){
                						data.watthourMeterVOs[index].maxReadingStatus=false;	//最大读数为null,用户选择最大读数					
                					}else{
                						data.watthourMeterVOs[index].maxReadingStatus=true; //最大读数不为null,带出用户上次选择
                					}
                				}
                				$scope.watthourMeterVOs =utils.deepCopy(data.watthourMeterVOs);
                				
                			}else {
                				utils.msg("报账点对应的电表信息为空，请重新选择报账点！");
                				// $scope.closeDialog('accountSiteDialog');  此处6月8日已注释
                				return;
                			}
                		});
                	}else{
                		//处理时间格式
                        for(var i=0; i<$scope.watthourMeterVOs.length;i++){
                        	
                        	$scope.watthourMeterVOs[i].belongEndTime = $scope.dataChange($scope.watthourMeterVOs[i].belongEndTime);
                        	$scope.watthourMeterVOs[i].belongStartTime = $scope.dataChange($scope.watthourMeterVOs[i].belongStartTime);
                        	$scope.watthourMeterVOs[i].lastTakePhotosTime = $scope.dataChange($scope.watthourMeterVOs[i].lastTakePhotosTime);
                        	$scope.watthourMeterVOs[i].theTakePhotosTime = $scope.dataChange($scope.watthourMeterVOs[i].theTakePhotosTime);
                        	
                        }
                		$scope.isNew = false;
                		
                	}
                	
                }
            })
        });


        /**
         * [流转信息]
         *
         */
        commonServ.getFlowDetails(item.instanceId).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.ApprovalZWDetails = data.data;
            })
        });



        // 查询流转图
        commonServ.queryFlowChart(item.instanceId).success(function(data){
        	utils.loadData(data, function (data) {
        		$scope.flowChartList = data.data;
            })
        });



        $scope.tab=1;
        $scope.instanceId = item.instanceId;
        $scope.showZweiAuditDialog=ngDialog.open({
            template: './tpl/auditPageDialog_1.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'addOrUpdateAuditCtrl_1',
            scope: $scope
        });

    }

     // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showZweiAuditDialog.close("");
    };


    //   //关闭弹出框
    // $scope.closeDialog=function(dialog){
    //     $scope[dialog].close("");
    // }

    
    /*//导出excel文件
    $scope.downExcel=function(){
    	alert("进入下excel");
        commonServ.downExcel().success(function (data, status, headers, config) {  
            var blob = new Blob([data], {type: "application/vnd.ms-excel"});  
            var objectUrl = URL.createObjectURL(blob);  
            var a = document.createElement('a');  
            document.body.appendChild(a);  
            a.setAttribute('style', 'display:none');  
            a.setAttribute('href', objectUrl);  
            var filename="电费稽核.xls";  
            a.setAttribute('download', filename);  
            a.click();  
            URL.revokeObjectURL(objectUrl);  
        }).error(function (data, status, headers, config) {  
        });
    	
    };*/
    
    
   
    
    


    /**
     * 单个提交、驳回
     */

    $scope.bachSubmit=function(adopt,id){
        var details = {
            "instanceId":id,
            "approveState":adopt
        }
        utils.confirm('确定要进行审批？',"",function(){
            commonServ.submitzwAudit(details).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list')
                });
            });
        });
    };



    /**
     * 批量提交
     */
    $scope.bachSubmit2=function (adopt) {

        var ids=utils.getCheckedVals('#list',true);
        var flows = new Array();
        if(ids.length<1){
            utils.msg("请选择至少一项");
            return;
        }

        for (var index = 0; index < $scope.list.length; index++) {
            var info = $scope.list[index];
            if ($.inArray(info.instanceId, ids) > -1) {
                if (info.flowState != 1 && info.flowState != 0) {
                    utils.msg("请批量选择'等待提交审批'的记录！");
                    return;
                }
                flows.push({"instanceId" : info.instanceId, "approveState": adopt});
            }
        }

        utils.confirm('确定要进行批量审批？',"",function(){
            commonServ.bachSubmitZWAuditForJson(flows).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list');
                });
            });
        });
    }


    /**
     * 批量审批、驳回
     */
    $scope.bachSubmit3 = function(adopt) {
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

        utils.confirm('确定要进行批量审批？',"",function(){
            commonServ.bachSubmitZWAuditForJson(flows).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list')
                });
            });
        });
    }


    /**
     * 删除单个
     */
    $scope.deleteSelected=function(item){
        var details = {
            "instanceId":item.instanceId,
            "reason":"",
            "serialNumber":item.electricty.serialNumber
        }
        utils.confirm('确定要删除吗？',"",function(){
            commonServ.rejectAduit(details).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list')

                });
            });
        });
    }



     /**
     * 批量删除
     */
    $scope.bachDeleteTaskList = function() {

        var ids = utils.getCheckedVals('#list', true);
        if(ids.length < 1) {
            utils.msg("请选择至少一项");
            return;
        }
        for (var index = 0; index < $scope.list.length; index++) {
            var info = $scope.list[index];

            if ($.inArray(info.instanceId, ids) > -1) {
                if (info.flowState != 1 && info.flowState != 0) {
                    utils.msg("请批量选择'等待提交审批'的记录！");
                    return;
                }
            }
        }

        utils.confirm('确定是否删除该流程？',"",function(){
            commonServ.bachDeleteTask({"instanceIds":utils.getCheckedVals('#list', false),reason:""}).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list');
                });
            });
        })
    }


    $scope.generatedPageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.generatedParams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 打开生成电费提交单弹框--------待接入后台接口查询
    $scope.getElectricDialog = function(){
         angular.extend($scope.generatedParams,{
		   "sysRgName":$scope.sysRgName,//报账组
           "serialNumber":$scope.serialNumber,
           "createStartDate":$("#createDate").val(),
           "createEndDate":$("#endDate").val(),
           "accountName": $scope.accountName,
           "statuses":"2",
           "auditType":$scope.auditType//稽核单类型
        });
        delete $scope.generatedParams.page;
        // 获取生成电费提交单审批通过列表
        commonServ.inputElectrictyQueryPage($scope.generatedParams).success(function(data){
           utils.loadData(data, function (data) {
                $scope.generatedPageInfo.totalCount = data.data.totalRecord;
                $scope.generatedPageInfo.pageCount = data.data.totalPage;
                $scope.generatedParams.page = data.data.pageNo;
                $scope.waitList = data.data.results;

            })
        });


    }
    
    //修改稽核类型
    $scope.seAuditType=function(auditType){
    	$scope.auditType=auditType;
    }


    /**
     * 稽核页面打开生成电费提交单--弹出框
     */
    $scope.createSubmitOrderDialog=function (){
		//查询对应报账组
		 commonServ.selectSysRg().success(function(data){
           utils.loadData(data, function (data) {
                $scope.sysRgs = data.data;
            })
        });
		//查询电费提交单数据
        $scope.getElectricDialog();
        $scope.SubmitOrderDialog=ngDialog.open({

            template: './tpl/addElectricSumbitDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,

        });


    };



    /**
     * 点击生成电费提交弹框中生成提交单--弹出提交单详情
     */
    $scope.createSubmitOrder=function(id){
        var list=[];
	   
        if(id!=undefined && id!=''){
            console.log("id",id);
            list.push(id);
        }else{
			var idStr="";
			var id="";
			var ids=[];
			var xb=[]; //获取出现","(逗号)的所有下标	
            list= utils.getCheckedVals('#SubmitOrder',false);
				//获取数组中出现逗号的下标与将数组转为字符串
				for(var i=0;i<list.length;i++){
					if(list[i]==","){
						xb.push(i);
					}
					idStr=idStr+list[i]+"";
				}
				//获取稽核单ID号
				if(xb.length<1){
					id=idStr;
					ids.push(id);
					id="";
				}else{
				for(var j=0;j<xb.length;j++){
					if(j==0){					
					id=idStr.slice(0,xb[j]);
					ids.push(id);
					id="";
					}else if(j>0&&j<(xb.length)){
					id=idStr.slice(xb[j-1]+1,xb[j]);
					ids.push(id);
					id="";					
					}									
				}
				id=idStr.slice(xb[xb.length-1]+1);
				ids.push(id);
				id="";
				}
				//获取供应商名称
				var supplierName ="";
				var supplierNames =[];
				for(var i=0;i<ids.length;i++){
					var eid=ids[i];
					for(var j=0;j<$scope.waitList.length;j++){
						if(eid==$scope.waitList[j].id){
							supplierName=$scope.waitList[j].supplierName;
							supplierNames.push(supplierName);
						}
					}
				}
				//判断供应商名称是否相同
				for(var i=0;i<supplierNames.length-1;i++){
					if(supplierNames[i]!=supplierNames[i+1]){
					utils.msg("相同的供应商才能生成同一张报销单！");
							return;	
					}
				}								
				
            if(list.length<1){
                utils.msg("请选择至少一项");
                return;
            }
		  
        }

        //生成电费稽核发送后台
        commonServ.createteEleSubmit(list).success(function(data){
                $scope.subID = data.data;
                unCheckAll('#SubmitOrder')

            // 生成电费提交列表单----详情
            commonServ.getViewElectricDetails($scope.subID).success(function(data){
                // utils.ajaxSuccess(data,function(data){
                    $scope.listDetail = data.data.data.electrictyListVOs;
                    $scope.trustees = data.data.data.trustees;
                    $scope.details = data.data.data;
                    if($scope.details.reimbursementType == 0){
                        $scope.details.reimbursementType ="报销";
                    }else{
                        $scope.details.reimbursementType ="报销";
                    }
                    unCheckAll('#SubmitOrder');
                // });

            });

        });
			$scope.getElectricDialog();

        $scope.saveOrderDialog=ngDialog.open({

            template: './tpl/viewElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        }); 	

    };

      // 保存提交单
        $scope.saveDialog= function() {
			$scope.getElectricDialog();
            utils.confirm('确定要保存吗？',"",function(){
                $scope.saveOrderDialog.close("");
            })
        }


         /**
         * 取消删除生成提交表单
         */
        $scope.revocationProcess=function(){

            commonServ.revocationProcess($scope.subID).success(function (data) {

                utils.loadData(data, function (data) {
                    $scope.params.pageNo=1;
                    $scope.getElectricDialog();
                    unCheckAll('#SubmitOrder');

                })
            });

            $scope.saveOrderDialog.close("");

        }


    // 电费提交单中的查看详情 ----已完成
    $scope.showZWauditDetailDetail = function(item,flag,save){

        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.editZiweiID= item.id;
        $scope.isZWauditSave = false;
        // 列表详情
        commonServ.getInputElectrictyById(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.singleDetail = data.data;
                $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
                }else if($scope.singleDetail.productNature == '1'){
                    $scope.singleDetail.productNature = '塔维';
                }
            })
        });


        $scope.tab=1;
        $scope.showZweiAuditDialog=ngDialog.open({
            template: './tpl/auditPageDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'addOrUpdateAuditCtrl',
            scope: $scope
        });
    }

    // //公共关闭弹出框
    // $scope.closeDialog=function(dialog){
    //     $scope[dialog].close("");
    // }

}]);













/**
 * 综合电费稽核
 */
app.controller('tariffZAuditCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

	if ($rootScope.stateType) {
		$scope.operation = true;
	}

    if($rootScope.reloadPage){
        $scope.operation = false;
    }else {
        $scope.operation = true;
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



     //获取电费列表   生成电费提交单查询--弹出框中按钮  公用
    $scope.getZwAuditDetail=function() {

        angular.extend($scope.params,{  
		
           "cityId":$scope.cityId, //地市
           "countyId":$scope.countyId, //区县
           "inputPerson":$("#inputPerson").val(), //录入人员
           "siteName":$("#siteName").val(), //报账点名称
        	"qSerialNumber":$scope.qSerialNumber, // 流水号
            "qStartTime":$("#id1").val(), // 时间
            "qEndTime":$("#id2").val(), // 时间
            "flowState":$scope.flowState, // 状态
            "qAccount" : $scope.qAccount,
            "operation" : $scope.operation
            
        });
        delete $scope.params.page;
        commonServ.getInputZElectrictyList($scope.params).success(function (data) {
            if(data.data.results == "") {
                utils.msg("目前暂无数据！");
                
            }
            utils.loadData(data, function (data) {
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
    
    /**
     * 查看详情
    */
    $scope.showDetail = function(item,flag,save){
        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.editZiweiID= item.electricty.id;
        $scope.instanceId = item.instanceId;
        $scope.isZWauditSave = true;
        console.log("123");
        // 列表详情
        commonServ.getInputElectrictyById(item.businessKey).success(function (data) {
            utils.loadData(data,function (data) {
            	
                $scope.watthourMeterVOs = data.data.watthourMeterVOs;
                
				$scope.departmentName = data.data.departmentName;
                $scope.singleDetail = data.data;
                if(data.data.sysFileVOs.length>0){
                    $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                }
                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
                }else if($scope.singleDetail.productNature == '1'){
                    $scope.singleDetail.productNature = '塔维';
                }
              //*************
                //var siteId=$scope.resultData.sysAccountSiteId;//报账单ID
                var siteId=$scope.singleDetail.sysAccountSiteId;//报账单ID
                var contractID=$scope.singleDetail.contractID;//合同id
                if(siteId !== ""){
                	// 电表数组为空新增   电表数组不为空直接显示--------新增电表时
                	if($scope.watthourMeterVOs.length < 1){
                		$scope.isNew = true;   //默认显示viewMaxReading
                		
                		commonServ.getMt(siteId).success(function (data) {
             	        	$rootScope.belongEndTimezw= new Array(data.data.length);//电费归属终止日期
             		        $rootScope.endAmmeterzw= new Array(data.data.length); //用电终度（度）
             	        	  for(var index=0; index<data.data.length; index++) {
             	        		  $rootScope.belongEndTimezw[index]= data.data[index].belongEndTimeS;//电费归属终止日期
             		              $rootScope.endAmmeterzw[index]= data.data[index].endAmmeter; //用电终度（度）
             	              }
             	       	});
                		//通过报账点查询电表信息
                		commonServ.getInputElectrictyDetail(siteId).success(function(data){					
                			$rootScope.createDate=data.createDate;
                			$rootScope.nowTime= new Date();
                			
                			if(data != "" && data.watthourMeterVOs.length > 0){
                				for(var index=0; index<data.watthourMeterVOs.length; index++) {							
                					data.watthourMeterVOs[index].watthourId = data.watthourMeterVOs[index].id;
                					data.watthourMeterVOs[index].belongStartTime=$rootScope.belongEndTimezw[index];
                					data.watthourMeterVOs[index].startAmmeter=$rootScope.endAmmeterzw[index];
                					//判断上次拍照时间是否有值
                					if(data.watthourMeterVOs[index].takePhotosTime==null){
                						data.watthourMeterVOs[index].photosStatus=false;	//拍照时间为null,用户选择上次拍照时间
                						
                					}else{
                						data.watthourMeterVOs[index].photosStatus=true; //拍照时间不为null,上次拍照时间为后台查询出来的拍照时间
                						data.watthourMeterVOs[index].takePhotosTime=$scope.dataChange(data.watthourMeterVOs[index].takePhotosTime);
                					}
                					data.watthourMeterVOs[index].lastTakePhotosTime=data.watthourMeterVOs[index].takePhotosTime;//上次拍照时间=拍照时间
                					//判断最大读数是否有值
                					if(data.watthourMeterVOs[index].maxReadings==null){
                						data.watthourMeterVOs[index].maxReadingStatus=false;	//最大读数为null,用户选择最大读数					
                					}else{
                						data.watthourMeterVOs[index].maxReadingStatus=true; //最大读数不为null,带出用户上次选择
                					}
                				}
                				$scope.watthourMeterVOs =utils.deepCopy(data.watthourMeterVOs);
                				
                			}else {
                				utils.msg("报账点对应的电表信息为空，请重新选择报账点！");
                				// $scope.closeDialog('accountSiteDialog');  此处6月8日已注释
                				return;
                			}
                		});
                	}else{
                		//处理时间格式
                        for(var i=0; i<$scope.watthourMeterVOs.length;i++){
                        	
                        	$scope.watthourMeterVOs[i].belongEndTime = $scope.dataChange($scope.watthourMeterVOs[i].belongEndTime);
                        	$scope.watthourMeterVOs[i].belongStartTime = $scope.dataChange($scope.watthourMeterVOs[i].belongStartTime);
                        	$scope.watthourMeterVOs[i].lastTakePhotosTime = $scope.dataChange($scope.watthourMeterVOs[i].lastTakePhotosTime);
                        	$scope.watthourMeterVOs[i].theTakePhotosTime = $scope.dataChange($scope.watthourMeterVOs[i].theTakePhotosTime);
                        	
                        }
                		$scope.isNew = false;
                		
                	}
                	
                }
            })
        });


        /**
         * [流转信息]
         *
         */
        commonServ.getFlowDetails(item.instanceId).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.ApprovalZWDetails = data.data;
            })
        });



        // 查询流转图
        commonServ.queryFlowChart(item.instanceId).success(function(data){
        	utils.loadData(data, function (data) {
        		$scope.flowChartList = data.data;
            })
        });



        $scope.tab=1;
        $scope.instanceId = item.instanceId;
        $scope.showZweiAuditDialog=ngDialog.open({
            template: './tpl/zh/auditPageDialog_1.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'addOrUpdateZAuditCtrl_1',
            scope: $scope
        });

    }

     // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showZweiAuditDialog.close("");
    };


    //   //关闭弹出框
    // $scope.closeDialog=function(dialog){
    //     $scope[dialog].close("");
    // }

    
    /*//导出excel文件
    $scope.downExcel=function(){
    	alert("进入下excel");
        commonServ.downExcel().success(function (data, status, headers, config) {  
            var blob = new Blob([data], {type: "application/vnd.ms-excel"});  
            var objectUrl = URL.createObjectURL(blob);  
            var a = document.createElement('a');  
            document.body.appendChild(a);  
            a.setAttribute('style', 'display:none');  
            a.setAttribute('href', objectUrl);  
            var filename="电费稽核.xls";  
            a.setAttribute('download', filename);  
            a.click();  
            URL.revokeObjectURL(objectUrl);  
        }).error(function (data, status, headers, config) {  
        });
    	
    };*/
    
    
   
    //导出excel文件
    $scope.downExcel=function(){
    	$state.go('app.ZdownExcel');
    	
    };
    


    /**
     * 单个提交、驳回
     */

    $scope.bachSubmit=function(adopt,id){
        var details = {
            "instanceId":id,
            "approveState":adopt
        }
        utils.confirm('确定要进行审批？',"",function(){
            commonServ.submitzwZAudit(details).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list')
                });
            });
        });
    };



    /**
     * 批量提交
     */
    $scope.bachSubmit2=function (adopt) {

        var ids=utils.getCheckedVals('#list',true);
        var flows = new Array();
        if(ids.length<1){
            utils.msg("请选择至少一项");
            return;
        }

        for (var index = 0; index < $scope.list.length; index++) {
            var info = $scope.list[index];
            if ($.inArray(info.instanceId, ids) > -1) {
                if (info.flowState != 1 && info.flowState != 0) {
                    utils.msg("请批量选择'等待提交审批'的记录！");
                    return;
                }
                flows.push({"instanceId" : info.instanceId, "approveState": adopt});
            }
        }

        utils.confirm('确定要进行批量审批？',"",function(){
            commonServ.bachSubmitZWAuditForJson(flows).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list');
                });
            });
        });
    }


    /**
     * 批量审批、驳回
     */
    $scope.bachSubmit3 = function(adopt) {
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

        utils.confirm('确定要进行批量审批？',"",function(){
            commonServ.bachSubmitZWAuditForJson(flows).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list')
                });
            });
        });
    }


    /**
     * 删除单个
     */
    $scope.deleteSelected=function(item){
        var details = {
            "instanceId":item.instanceId,
            "reason":"",
            "serialNumber":item.electricty.serialNumber
        }
        utils.confirm('确定要删除吗？',"",function(){
            commonServ.rejectZAduit(details).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list')

                });
            });
        });
    }



     /**
     * 批量删除
     */
    $scope.bachDeleteTaskList = function() {

        var ids = utils.getCheckedVals('#list', true);
        if(ids.length < 1) {
            utils.msg("请选择至少一项");
            return;
        }
        for (var index = 0; index < $scope.list.length; index++) {
            var info = $scope.list[index];

            if ($.inArray(info.instanceId, ids) > -1) {
                if (info.flowState != 1 && info.flowState != 0) {
                    utils.msg("请批量选择'等待提交审批'的记录！");
                    return;
                }
            }
        }

        utils.confirm('确定是否删除该流程？',"",function(){
            commonServ.bachDeleteTask({"instanceIds":utils.getCheckedVals('#list', false),reason:""}).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list');
                });
            });
        })
    }


    $scope.generatedPageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.generatedParams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 打开生成电费提交单弹框--------待接入后台接口查询
    $scope.getElectricDialog = function(){
         angular.extend($scope.generatedParams,{
		   "sysRgName":$scope.sysRgName,//报账组
           "serialNumber":$scope.serialNumber,
           "createStartDate":$("#createDate").val(),
           "createEndDate":$("#endDate").val(),
           "accountName": $scope.accountName,
           "statuses":"2",
           "auditType":$scope.auditType//稽核单类型
        });

        delete $scope.generatedParams.page;
        // 获取生成电费提交单审批通过列表
        commonServ.inputElectrictyQueryPage($scope.generatedParams).success(function(data){
           utils.loadData(data, function (data) {
                $scope.generatedPageInfo.totalCount = data.data.totalRecord;
                $scope.generatedPageInfo.pageCount = data.data.totalPage;
                $scope.generatedParams.page = data.data.pageNo;
                $scope.waitList = data.data.results;

            })
        });


    }
    //修改稽核类型
    $scope.seAuditType=function(auditType){
    	$scope.auditType=auditType;
    }
    
    /**
     * 稽核页面打开生成电费提交单--弹出框
     */
    $scope.createSubmitOrderDialog=function (){
		//查询对应报账组
		 commonServ.selectSysRg().success(function(data){
           utils.loadData(data, function (data) {
                $scope.sysRgs = data.data;
            })
        });
		//查询电费提交单数据
        $scope.getElectricDialog();
        $scope.SubmitOrderDialog=ngDialog.open({

            template: './tpl/addElectricSumbitDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,

        });


    };
    
    
    



    /**
     * 点击生成电费提交弹框中生成提交单--弹出提交单详情
     */
    $scope.createSubmitOrder=function(id){

        var list=[];
        if(id!=undefined && id!=''){
            console.log("id",id);
            list.push(id);
        }else{
			var idStr="";
			var id="";
			var ids=[];
			var xb=[]; //获取出现","(逗号)的所有下标	
            list= utils.getCheckedVals('#SubmitOrder',false);
				//获取数组中出现逗号的下标与将数组转为字符串
				for(var i=0;i<list.length;i++){
					if(list[i]==","){
						xb.push(i);
					}
					idStr=idStr+list[i]+"";
				}
				//获取稽核单ID号
				if(xb.length<1){
					id=idStr;
					ids.push(id);
					id="";
				}else{
				for(var j=0;j<xb.length;j++){
					if(j==0){					
					id=idStr.slice(0,xb[j]);
					ids.push(id);
					id="";
					}else if(j>0&&j<(xb.length)){
					id=idStr.slice(xb[j-1]+1,xb[j]);
					ids.push(id);
					id="";					
					}									
				}
				id=idStr.slice(xb[xb.length-1]+1);
				ids.push(id);
				id="";
				}
				//获取供应商名称
				var supplierName ="";
				var supplierNames =[];
				for(var i=0;i<ids.length;i++){
					var eid=ids[i];
					for(var j=0;j<$scope.waitList.length;j++){
						if(eid==$scope.waitList[j].id){
							supplierName=$scope.waitList[j].supplierName;
							supplierNames.push(supplierName);
						}
					}
				}
				//判断供应商名称是否相同
				for(var i=0;i<supplierNames.length-1;i++){
					if(supplierNames[i]!=supplierNames[i+1]){
					utils.msg("相同的供应商才能生成同一张报销单！");
							return;	
					}
				}								
				
            if(list.length<1){
                utils.msg("请选择至少一项");
                return;
            }
		  
        }

        //生成电费稽核发送后台
        commonServ.createteEleSubmit(list).success(function(data){
                $scope.subID = data.data;
                unCheckAll('#SubmitOrder')

            // 生成综合电费提交列表单----详情
            commonServ.getViewElectricDetails($scope.subID).success(function(data){
                // utils.ajaxSuccess(data,function(data){
                    $scope.listDetail = data.data.data.electrictyListVOs;
                    $scope.trustees = data.data.data.trustees;
                    $scope.details = data.data.data;
                    if($scope.details.reimbursementType == 0){
                        $scope.details.reimbursementType ="报销";
                    }else{
                        $scope.details.reimbursementType ="报销";
                    }
                    unCheckAll('#SubmitOrder');
                // });

            });

        });

		$scope.getElectricDialog();

        $scope.saveOrderDialog=ngDialog.open({

            template: './tpl/viewElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });

    };


        // 保存提交单
        $scope.saveDialog= function() {
			$scope.getElectricDialog();
            utils.confirm('确定要保存吗？',"",function(){
                $scope.saveOrderDialog.close("");
            })
        }


         /**
         * 取消删除生成提交表单
         */
        $scope.revocationProcess=function(){

            commonServ.revocationProcess($scope.subID).success(function (data) {

                utils.loadData(data, function (data) {
                    $scope.params.pageNo=1;
                    $scope.getElectricDialog();
                    unCheckAll('#SubmitOrder');

                })
            });

            $scope.saveOrderDialog.close("");

        }


    // 电费提交单中的查看详情 ----已完成
    $scope.showZWauditDetailDetail = function(item,flag,save){

        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.editZiweiID= item.id;
        $scope.isZWauditSave = false;
        // 列表详情
        commonServ.getInputElectrictyById(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.singleDetail = data.data;
                $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
                }else if($scope.singleDetail.productNature == '1'){
                    $scope.singleDetail.productNature = '塔维';
                }
            })
        });


        $scope.tab=1;
        $scope.showZweiAuditDialog=ngDialog.open({
            template: './tpl/auditPageDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'addOrUpdateAuditCtrl',
            scope: $scope
        });
    }

    // //公共关闭弹出框
    // $scope.closeDialog=function(dialog){
    //     $scope[dialog].close("");
    // }

}]);










/**
 * 提交财务 ------已完成
 */
app.controller('inputFinanceCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

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
    $scope.getData=function(){

        angular.extend($scope.params,{

            "submitNo":$scope.submitNo,                 //电费提交单号
            "status":$scope.status,                     // 状态
            "startCreateDate":$scope.startCreateDate || null,    // 开始时间
            "endCreateDate":$scope.endCreateDate || null        // 结束时间
        });

        delete $scope.params.page;
        commonServ.getElectricList($scope.params).success(function (data) {

            if(data.data.results == "") {
                utils.msg("目前暂无数据！");
            }
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }
    //导出excel
    $scope.downExcel=function(){
    	var URL=commonServ.getElectricListExcel();
    	alert("数据加载中,请耐心等待,勿重复点击!!");
    	var form=$("<form>");
    	form.attr("style","display:none");
    	form.attr("target","");
    	form.attr("method","post");
    	form.attr("action",URL);
    	
    	var input=$("<input>");
    	input.attr("type","hidden");
    	input.attr("name","submitNo");
        input.attr("value",$scope.submitNo);
    	form.append(input);
    	
    	var input1=$("<input>");
    	input1.attr("type","hidden");
    	input1.attr("name","status");
        input1.attr("value",$scope.status);
        form.append(input1);
        
        var input2=$("<input>");
    	input2.attr("type","hidden");
    	input2.attr("name","startCreateDate");
    	input2.attr("value",$scope.startCreateDate);
    	form.append(input2);
    	
    	var input3=$("<input>");
    	input3.attr("type","hidden");
    	input3.attr("name","endCreateDate");
    	input3.attr("value",$scope.endCreateDate);
    	form.append(input3);
         
    	$("body").append(form);
    	form.submit();
    }

    //推送报销发起人
    $scope.pushManager=function(item){
        utils.confirm('确定要推送吗？',"",function(){
            commonServ.pushManager(item.id).success(function (data) {
                utils.ajaxSuccess(data,function (data) {
                    $scope.params.pageNo = 1;
                    $scope.getData();
                })
            });
        });
    }
    
   


    //推送报销发起人--批量
    $scope.pushManagerMultiy=function(item){
        var ids=[];
        ids=utils.getCheckedVals('#list',false);
        if(ids.length<1){
            utils.msg("请选择至少一项");
            return;
        }

        utils.confirm('确定要批量推送吗？',"",function(){
            commonServ.batchPushManager(ids).success(function (data) {
                utils.ajaxSuccess(data,function (data) {
                    $scope.params.pageNo = 1;
                    $scope.getData();
                    unCheckAll("#list");
                })
            });
        });
    }
    $scope.generatedPageInfo = {
            totalCount: 0,//总的记录条数
            pageCount: 0,// 总的页数
            pageOptions: [15,50,100,200],//每页条数的选项,选填
            showPages: 5//显示几个页码,选填
        };

        $scope.generatedParams = {
            pageSize: 10,//每页显示条数
            pageNo: 1,// 当前页
        };


    $scope.isZWfrinc = true;

    /**
     * 点击生成电费提交弹框中生成提交单--弹出提交单详情
     */
    $scope.createSubmitOrder_1=function(id){

        var list=[];
        if(id!=undefined && id!=''){
            console.log("id",id);
            list.push(id);
        }else{
			var idStr="";
			var id="";
			var ids=[];
			var xb=[]; //获取出现","(逗号)的所有下标	
            list= utils.getCheckedVals('#SubmitOrder',false);
				//获取数组中出现逗号的下标与将数组转为字符串
				for(var i=0;i<list.length;i++){
					if(list[i]==","){
						xb.push(i);
					}
					idStr=idStr+list[i]+"";
				}
				//获取稽核单ID号
				if(xb.length<1){
					id=idStr;
					ids.push(id);
					id="";
				}else{
					for(var j=0;j<xb.length;j++){
						if(j==0){					
						id=idStr.slice(0,xb[j]);
						ids.push(id);
						id="";
						}else if(j>0&&j<(xb.length)){
						id=idStr.slice(xb[j-1]+1,xb[j]);
						ids.push(id);
						id="";					
						}									
					}
					id=idStr.slice(xb[xb.length-1]+1);
					ids.push(id);
					id="";
				}
				//获取供应商名称
				var supplierName ="";
				var supplierNames =[];
				for(var i=0;i<ids.length;i++){
					var eid=ids[i];
					for(var j=0;j<$scope.waitList.length;j++){
						if(eid==$scope.waitList[j].id){
							supplierName=$scope.waitList[j].supplierName;
							supplierNames.push(supplierName);
						}
					}
				}
				//判断供应商名称是否相同
				for(var i=0;i<supplierNames.length-1;i++){
					if(supplierNames[i]!=supplierNames[i+1]){
					utils.msg("相同的供应商才能生成同一张报销单！");
							return;	
					}
				}								
				
            if(list.length<1){
                utils.msg("请选择至少一项");
                return;
            }
		  
        }

        //生成电费稽核发送后台
        commonServ.createteEleSubmit_1(list,$scope.details.id).success(function(data){
                $scope.subID = data.data;
                unCheckAll('#SubmitOrder')

            // 生成综合电费提交列表单----详情
            commonServ.getViewElectricDetails($scope.details.id).success(function(data){
                // utils.ajaxSuccess(data,function(data){
                    $scope.listDetail = data.data.data.electrictyListVOs;
                    $scope.trustees = data.data.data.trustees;
                    $scope.details = data.data.data;
                    if($scope.details.reimbursementType == 0){
                        $scope.details.reimbursementType ="报销";
                    }else{
                        $scope.details.reimbursementType ="报销";
                    }
                    //unCheckAll('#SubmitOrder');
                // });

            });

        });
        //查询审核通过的稽核单(更新页面数据)
		$scope.getElectricDialog_1();
     // 电费提交单详情
        
		$scope.closeDialog('SubmitOrderDialog');
       /*$scope.saveOrderDialog=ngDialog.open({

            template: './tpl/viewElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });*/

    };
    
    // 打开生成电费提交单弹框--------待接入后台接口查询
    $scope.getElectricDialog_1 = function(){
        angular.extend($scope.generatedParams,{
		   "sysRgName":$scope.sysRgName,//报账组
           "serialNumber":$scope.serialNumber,
           "createStartDate":$("#createDate").val(),
           "createEndDate":$("#endDate").val(),
           "accountName": $scope.accountName,
           "statuses":"2",
           "auditType":"0"//稽核单类型
        });
        /* $scope.generatedParams={
      		   "sysRgName":$scope.sysRgName,//报账组
               "serialNumber":$scope.serialNumber,
               "createStartDate":$("#createDate").val(),
               "createEndDate":$("#endDate").val(),
               "accountName": $scope.accountName,
               "statuses":"2",
               "auditType":$scope.auditType//稽核单类型
            };
*/
        delete $scope.generatedParams.page;
        // 获取生成电费提交单审批通过列表
        commonServ.inputElectrictyQueryPage($scope.generatedParams).success(function(data){
           utils.loadData(data, function (data) {
                $scope.generatedPageInfo.totalCount = data.data.totalRecord;
                $scope.generatedPageInfo.pageCount = data.data.totalPage;
                $scope.generatedParams.page = data.data.pageNo;
                $scope.waitList = data.data.results;

            })
        });


    }
    
	/**
	 * 修改页面里的增加稽核单页面
	 */
    
    $scope.createSubmitOrderDialog_1=function (){
		//查询对应报账组
		 commonServ.selectSysRg().success(function(data){
           utils.loadData(data, function (data) {
                $scope.sysRgs = data.data;
            })
        });
		 $scope.isJz=true;
		//查询电费提交单数据
        $scope.getElectricDialog_1();
        $scope.SubmitOrderDialog=ngDialog.open({

            template: './tpl/addElectricSumbitDialog_1.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,

        });


    };
	

    /**
     * 查看详情弹出框
     */
    $scope.showDetail=function(item,isSave){			
		$rootScope.lists = item;
		$scope.isSaveOK=isSave;
        // 电费提交单详情
        commonServ.getViewElectricDetails(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.listDetail = data.data.data.electrictyListVOs;
				$rootScope.listDetails=data.data.data.electrictyListVOs; 
                $scope.trustees = data.data.data.trustees;
                $scope.details=data.data.data;
                if($scope.details.reimbursementType == 0){
                    $scope.details.reimbursementType ="报销";
                }else{
                    $scope.details.reimbursementType ="报销";
                }
            })
        });
        $scope.SubmitDialog=ngDialog.open({

            template: './tpl/viewElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });

    }
    
    /**
     * 移出报销单中的录入单
     */
	$scope.removeElectricityToSubmit = function(electricityID,submitID,index){
		console.log(electricityID+"----"+submitID+"------"+index);
		var checkYes = confirm("是否移出该稽核单?");
		if(checkYes){
			//检测该报销单是否只剩一个稽核单
			commonServ.checkSubmitIsOneyOne(submitID).success(function(data){
				 utils.loadData(data,function (data) {
					 if(data.data==true){
						 alert("请至少保留一条稽核单！")
					 }else{
						 commonServ.removeElectricityToSubmit(electricityID,submitID).success(function(data){
							 utils.loadData(data,function(data){
								 //移出录入单成功后返回操作(重新获取数据)
								 // 电费提交单详情
								 commonServ.getViewElectricDetails(submitID).success(function (data) {
									 utils.loadData(data,function (data) {
										 $scope.listDetail = data.data.data.electrictyListVOs;
										 $rootScope.listDetails=data.data.data.electrictyListVOs; 
										 $scope.trustees = data.data.data.trustees;
										 $scope.details=data.data.data;
										 if($scope.details.reimbursementType == 0){
											 $scope.details.reimbursementType ="报销";
										 }else{
											 $scope.details.reimbursementType ="报销";
										 }
									 })
								 });
								 
							 })
						 });
					 }
				 });
			});
		}
	}
    /**
     *
     * 查看详情中的查看详情  
    */
    $scope.showZWauditDetailDetail = function(item,flag,save){	
	
        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.editZiweiID= item.id;
        $scope.isZWauditSave = false;

        // 列表详情
        commonServ.getInputElectrictyById(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.singleDetail = data.data;
                $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
                }else if($scope.singleDetail.productNature == '1'){
                    $scope.singleDetail.productNature = '塔维';
                }
            })
        });


        $scope.tab=1;
        $scope.instanceId = item.instanceId;
        $scope.showZweiAuditDialog=ngDialog.open({
            template: './tpl/auditPageDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'addOrUpdateAuditCtrl',
            scope: $scope
        });
		
    }
     // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showZweiAuditDialog.close("");
    };
    
    
    //报销单明细
    $scope.returnPage1 = function(){
        $state.go('app.MMM',{
            'status':'input/financ1'
        });
    };
    //关闭弹窗并刷新数据
    $scope.closeAndSearch = function(dialog){
    	$scope[dialog].close("");
    	$scope.getData();
    };

    //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }	
	$rootScope.BasicInfo=[];//用于保存列表信息返回给页面计
	/**
     *
     * 查看报销单明细
    */
    $scope.expenseAccountDetail = function(){
	//$scope.BasicInfo = $rootScope.BasicInfo;//明细表中所需基本信息
	//$scope.TransferInfo = $rootScope.TransferInfo; //明细表中所需流转信息
		//window.location.href="./tpl/expenseAccountDialog.html?scope="+$scope;
		$rootScope.BasicInfo=[];//用于保存电费报销明细列表信息返回给页面
		$rootScope.BasicInfo1=[];//用于保存报账点费用明细信息返回给页面
		$rootScope.total="";//用于保存电费金额合计
		$rootScope.otherCostSums="";//保存其他费用合计
		$rootScope.electricityAmountSums="";//保存电费金额(元/不含税)合计
		$rootScope.taxAmountSums="";//保存税金金额合计
		$rootScope.totalAmountSumSums="";//保存总金额(元/含税)合计
		$rootScope.expenseTotalAmountSums="";//保存本次核销金额合计
		$rootScope.paymentAmountSums="";//保存支付金额(元/含税)合计
		var sum=new BigDecimal("0.00");
		var	otherCostSum=new BigDecimal("0.00");//其他费用合计
		var	electricityAmountSum=new BigDecimal("0.00");//电费金额(元/不含税)合计
		var	taxAmountSum=new BigDecimal("0.00");//税金金额合计
		var	totalAmountSumSum=new BigDecimal("0.00");//总金额(元/含税)合计
		var	expenseTotalAmountSum=new BigDecimal("0.00");//本次核销金额合计
		var	paymentAmountSum=new BigDecimal("0.00");//支付金额(元/含税)合计
		$rootScope.list1 = $rootScope.lists;
		for(var i=0;i<$rootScope.listDetails.length;i++){		
			//$scope.listDetails($rootScope.listDetails[i]);
			//alert($rootScope.listDetails[i].id+"666"+i);			
				
				/**
	* 列表详情
	*/	
	 commonServ.getInputElectrictyByIdDetails($rootScope.listDetails[i].id).success(function (data) {		 	
            utils.loadData(data,function (data) {
				var sum1=new BigDecimal("0.00");
				$scope.singleDetail = data.data;
				//$scope.watthourMeterVOs=data.data.watthourMeterVOs;
				$scope.instanceId=data.data.instanceID; //流程id
				$scope.expenseAccountDetails=data.data.expenseAccountDetails;
                $scope.singUploadFiles = data.data.sysFileVOs;  //附件				
              $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
			  for(var k = 0; k<$scope.expenseAccountDetails.length; k++){
				  //时间格式转换
				 $scope.expenseAccountDetails[k].belongEndTime = $scope.dataChange($scope.expenseAccountDetails[k].belongEndTime);
				  $scope.expenseAccountDetails[k].belongStartTime = $scope.dataChange($scope.expenseAccountDetails[k].belongStartTime);
				//电费金额总计
				 //alert($scope.singleDetail.watthourMeterVOs[k].totalAmount+"@13");
				  if($scope.expenseAccountDetails[k].totalAmount==null||$scope.expenseAccountDetails[k].totalAmount==""){
					  $scope.expenseAccountDetails[k].totalAmount="0.00";
					 
				  }
				  if($scope.expenseAccountDetails[k].expenseTotalAmount==null||$scope.expenseAccountDetails[k].expenseTotalAmount==""){
					  $scope.expenseAccountDetails[k].expenseTotalAmount="0.00";
					 
				  }	
					if($scope.expenseAccountDetails[k].otherCost==null||$scope.expenseAccountDetails[k].otherCost==""){
					  $scope.expenseAccountDetails[k].otherCost="0.00";
					 
				  }	
					if($scope.expenseAccountDetails[k].electricityAmount==null||$scope.expenseAccountDetails[k].electricityAmount==""){
					  $scope.expenseAccountDetails[k].electricityAmount="0.00";
					 
				  }	
					if($scope.expenseAccountDetails[k].taxAmount==null||$scope.expenseAccountDetails[k].taxAmount==""){
					  $scope.expenseAccountDetails[k].taxAmount="0.00";
					 
				  }	
				  		if($scope.expenseAccountDetails[k].paymentAmount==null||$scope.expenseAccountDetails[k].paymentAmount==""){
					  $scope.expenseAccountDetails[k].paymentAmount="0.00";
					 
				  }	
				  if($scope.expenseAccountDetails[k].bankNum!=null){
					  $scope.expenseAccountDetails[k].bankNum="B/C: "+$scope.expenseAccountDetails[k].bankNum;  
					  
				  }else{
					  $scope.expenseAccountDetails[k].bankNum="";
				  }

				sum=sum.add(new BigDecimal($scope.expenseAccountDetails[k].totalAmount));
				
					sum1=sum1.add(new BigDecimal($scope.expenseAccountDetails[k].totalAmount));
				$rootScope.BasicInfo.push($scope.expenseAccountDetails[k]);
			  }
			 
			  $scope.expenseAccountDetails[0].totalAmountSum=sum1+"";//单个报账点电费金额合计
			if(data.data.expenseTotalAmount==null||data.data.expenseTotalAmount==""){
					data.data.expenseTotalAmount="0.00";
				}
			  sum1=sum1.subtract(new BigDecimal($scope.expenseAccountDetails[0].expenseTotalAmount));
			$scope.expenseAccountDetails[0].paymentAmount=sum1+"";	//单个报账点支付金额合计
			 $rootScope.BasicInfo1.push($scope.expenseAccountDetails[0]);
			
			 $rootScope.total=sum+"";//多个电费金额合计				
			  $scope.expenseAccountDetails[0].expenseTotalAmount=data.data.expenseTotalAmount;
				otherCostSum=otherCostSum.add(new BigDecimal($scope.expenseAccountDetails[0].otherCost));
				electricityAmountSum=electricityAmountSum.add(new BigDecimal($scope.expenseAccountDetails[0].electricityAmount));
				taxAmountSum=taxAmountSum.add(new BigDecimal($scope.expenseAccountDetails[0].taxAmount));
				totalAmountSumSum=totalAmountSumSum.add(new BigDecimal($scope.expenseAccountDetails[0].totalAmountSum));
				expenseTotalAmountSum=expenseTotalAmountSum.add(new BigDecimal($scope.expenseAccountDetails[0].expenseTotalAmount));
				paymentAmountSum=paymentAmountSum.add(new BigDecimal($scope.expenseAccountDetails[0].paymentAmount));

			// alert($rootScope.otherCostSums+"==="+otherCostSum);
		$rootScope.otherCostSums=otherCostSum+"";//为其他费用合计赋值
		$rootScope.electricityAmountSums=electricityAmountSum+"";//为电费金额(元/不含税)合计赋值
		$rootScope.taxAmountSums=taxAmountSum+"";//为税金金额合计赋值
		$rootScope.totalAmountSumSums=totalAmountSumSum+"";//为总金额(元/含税)合计赋值
		$rootScope.expenseTotalAmountSums=expenseTotalAmountSum+"";//为本次核销金额合计赋值
		$rootScope.paymentAmountSums=paymentAmountSum+"";//为支付金额(元/含税)合计赋值
			/**  for(var j = 0; j<$scope.singleDetail.watthourMeterVOs.length; j++){
				 // alert(j);
                //时间格式转换
				  $scope.singleDetail.watthourMeterVOs[j].belongEndTime = $scope.dataChange($scope.singleDetail.watthourMeterVOs[j].belongEndTime);
				  $scope.singleDetail.watthourMeterVOs[j].belongStartTime = $scope.dataChange($scope.singleDetail.watthourMeterVOs[j].belongStartTime);
				//电费金额总计
				 //alert($scope.singleDetail.watthourMeterVOs[j].totalAmount+"@13");
				  if($scope.singleDetail.watthourMeterVOs[j].totalAmount==null||$scope.singleDetail.watthourMeterVOs[j].totalAmount==""){
					  $scope.singleDetail.watthourMeterVOs[j].totalAmount="0.00";
					 
				  }
				sum=sum.add(new BigDecimal($scope.singleDetail.watthourMeterVOs[j].totalAmount));
				$scope.totals=sum+"";//电费金额合计
				//alert($scope.totals+"111");
		   }
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
				}else if($scope.singleDetail.productNature == '1'){
					$scope.singleDetail.productNature = '塔维';
                }*/							
		/**
         * [流转信息]
         *
         */
		 if(data.data.instanceID == null||data.data.instanceID == ""){
					return;
		 }else{
			 commonServ.getFlowDetails($scope.instanceId).success(function (data) {
            utils.loadData(data,function (data) {
                $rootScope.ApprovalZWDetails = data.data;
            })
        });
		 }
 
			//$rootScope.BasicInfo.push($scope.singleDetail);
			//alert($scope.totals+"222");

            })
        })
				
		}; 
	//window.open("./tpl/expenseAccountDialog.html?rootScope="+$rootScope);
	
	   $scope.expenseAccountDialog=ngDialog.open({
            template: './tpl/expenseAccountDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
           width: 1200,
            controller:'addOrUpdateAuditCtrl',
            scope: $scope
			});
	}
    
    
    $scope.submitProcess= function(){
    	commonServ.getProcess($scope.details.submitNo).success(function(data){
    		$scope.submitProcess1=data;
    	})
    	
    	
    	
    	 $scope.getProcess2=ngDialog.open({
             template: './tpl/submitProcess.html?time='+new Date().getTime(),
             width: 1200,
             scope: $scope
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
	
    
    //导出excle(报销单明细表)
	/* $scope.deriveExcel=function(){
		
		event.preventDefault();
        var BB = self.Blob;
        var contentStr = document.getElementById("expenseAccountDetails").innerHTML;   //内容
        var fileNmae='报销单明细表.xls';
        saveAs(
          new BB(
              ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
            , { type: "applicationnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
        ) , fileNmae);
		
	} */

		
	/**
	* 列表详情(弃用)
	*/

	$scope.listDetails = function(item){
	 commonServ.getInputElectrictyById(item.id).success(function (data) {
		 	$rootScope.BasicInfo=[];//用于保存列表信息返回给页面
            utils.loadData(data,function (data) {
				$scope.singleDetail = data.data;
				//$rootScope.singleDetails = data.data;
                $scope.singUploadFiles = data.data.sysFileVOs;  //附件
              $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
				}else if($scope.singleDetail.productNature == '1'){
					$scope.singleDetail.productNature = '塔维';
                }
			$rootScope.BasicInfo.push($scope.singleDetail);
            })
        })
	}
}]);





/**
 * 提交财务 ------已完成
 */
app.controller('inputZFinanceCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

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
    $scope.getData=function(){

        angular.extend($scope.params,{

            "submitNo":$scope.submitNo,                 //电费提交单号
            "status":$scope.status,                     // 状态
            "startCreateDate":$scope.startCreateDate || null,    // 开始时间
            "endCreateDate":$scope.endCreateDate || null        // 结束时间
        });

        delete $scope.params.page;
        commonServ.getElectricList($scope.params).success(function (data) {

            if(data.data.results == "") {
                utils.msg("目前暂无数据！");
            }
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    //推送报销发起人
    $scope.pushManager=function(item){
        utils.confirm('确定要推送吗？',"",function(){
            commonServ.pushManager(item.id).success(function (data) {
                utils.ajaxSuccess(data,function (data) {
                    $scope.params.pageNo = 1;
                    $scope.getData();
                })
            });
        });
    }
    
   


    //推送报销发起人--批量
    $scope.pushManagerMultiy=function(item){
        var ids=[];
        ids=utils.getCheckedVals('#list',false);
        if(ids.length<1){
            utils.msg("请选择至少一项");
            return;
        }

        utils.confirm('确定要批量推送吗？',"",function(){
            commonServ.batchPushManager(ids).success(function (data) {
                utils.ajaxSuccess(data,function (data) {
                    $scope.params.pageNo = 1;
                    $scope.getData();
                    unCheckAll("#list");
                })
            });
        });
    }



    $scope.isZWfrinc = true;

	
		
	

    /**
     * 查看详情弹出框
     */
    $scope.showDetail=function(item){			
		$rootScope.lists = item;
        // 电费提交单详情
        commonServ.getViewElectricDetails(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.listDetail = data.data.data.electrictyListVOs;
				$rootScope.listDetails=data.data.data.electrictyListVOs; 
                $scope.trustees = data.data.data.trustees;
                $scope.details=data.data.data;
                if($scope.details.reimbursementType == 0){
                    $scope.details.reimbursementType ="报销";
                }else{
                    $scope.details.reimbursementType ="报销";
                }
            })
        });
        $scope.SubmitDialog=ngDialog.open({

            template: './tpl/viewElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });

    }
		
    /**
     *
     * 查看详情中的查看详情  
    */
    $scope.showZWauditDetailDetail = function(item,flag,save){	
	
        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.editZiweiID= item.id;
        $scope.isZWauditSave = false;

        // 列表详情
        commonServ.getInputElectrictyById(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.singleDetail = data.data;
                $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
                }else if($scope.singleDetail.productNature == '1'){
                    $scope.singleDetail.productNature = '塔维';
                }
            })
        });


        $scope.tab=1;
        $scope.instanceId = item.instanceId;
        $scope.showZweiAuditDialog=ngDialog.open({
            template: './tpl/auditPageDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'addOrUpdateAuditCtrl',
            scope: $scope
        });
		
    }

     // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showZweiAuditDialog.close("");
    };
    
    
    //报销单明细
    $scope.returnPage1 = function(){
        $state.go('app.MMM',{
            'status':'input/financ1'
        });
    };
  
    
    //公共关闭弹出框
    $scope.closeDialog=function(dialog){
    	
        $scope[dialog].close("");
    };	
	$rootScope.BasicInfo=[];//用于保存列表信息返回给页面计
	/**
     *
     * 查看报销单明细
    */
    $scope.expenseAccountDetail = function(){
	//$scope.BasicInfo = $rootScope.BasicInfo;//明细表中所需基本信息
	//$scope.TransferInfo = $rootScope.TransferInfo; //明细表中所需流转信息
		//window.location.href="./tpl/expenseAccountDialog.html?scope="+$scope;
    	
		$rootScope.BasicInfo=[];//用于保存电费报销明细列表信息返回给页面
		$rootScope.BasicInfo1=[];//用于保存报账点费用明细信息返回给页面
		$rootScope.total="";//用于保存电费金额合计
		$rootScope.otherCostSums="";//保存其他费用合计
		$rootScope.electricityAmountSums="";//保存电费金额(元/不含税)合计
		$rootScope.taxAmountSums="";//保存税金金额合计
		$rootScope.totalAmountSumSums="";//保存总金额(元/含税)合计
		$rootScope.expenseTotalAmountSums="";//保存本次核销金额合计
		$rootScope.paymentAmountSums="";//保存支付金额(元/含税)合计
		var sum=new BigDecimal("0.00");
		var	otherCostSum=new BigDecimal("0.00");//其他费用合计
		var	electricityAmountSum=new BigDecimal("0.00");//电费金额(元/不含税)合计
		var	taxAmountSum=new BigDecimal("0.00");//税金金额合计
		var	totalAmountSumSum=new BigDecimal("0.00");//总金额(元/含税)合计
		var	expenseTotalAmountSum=new BigDecimal("0.00");//本次核销金额合计
		var	paymentAmountSum=new BigDecimal("0.00");//支付金额(元/含税)合计
		$rootScope.list1 = $rootScope.lists;
		for(var i=0;i<$rootScope.listDetails.length;i++){		
			//$scope.listDetails($rootScope.listDetails[i]);
			//alert($rootScope.listDetails[i].id+"666"+i);			
				
				/**
	* 列表详情
	*/	
	 commonServ.getInputElectrictyByIdDetails($rootScope.listDetails[i].id).success(function (data) {		 	
            utils.loadData(data,function (data) {
				var sum1=new BigDecimal("0.00");
				$scope.singleDetail = data.data;
				//$scope.watthourMeterVOs=data.data.watthourMeterVOs;
				$scope.instanceId=data.data.instanceID; //流程id
				$scope.expenseAccountDetails=data.data.expenseAccountDetails;
                $scope.singUploadFiles = data.data.sysFileVOs;  //附件				
              $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
			  for(var k = 0; k<$scope.expenseAccountDetails.length; k++){
				  //时间格式转换
				 $scope.expenseAccountDetails[k].belongEndTime = $scope.dataChange($scope.expenseAccountDetails[k].belongEndTime);
				  $scope.expenseAccountDetails[k].belongStartTime = $scope.dataChange($scope.expenseAccountDetails[k].belongStartTime);
				//电费金额总计
				 //alert($scope.singleDetail.watthourMeterVOs[k].totalAmount+"@13");
				  if($scope.expenseAccountDetails[k].totalAmount==null||$scope.expenseAccountDetails[k].totalAmount==""){
					  $scope.expenseAccountDetails[k].totalAmount="0.00";
					 
				  }
				  if($scope.expenseAccountDetails[k].expenseTotalAmount==null||$scope.expenseAccountDetails[k].expenseTotalAmount==""){
					  $scope.expenseAccountDetails[k].expenseTotalAmount="0.00";
					 
				  }	
					if($scope.expenseAccountDetails[k].otherCost==null||$scope.expenseAccountDetails[k].otherCost==""){
					  $scope.expenseAccountDetails[k].otherCost="0.00";
					 
				  }	
					if($scope.expenseAccountDetails[k].electricityAmount==null||$scope.expenseAccountDetails[k].electricityAmount==""){
					  $scope.expenseAccountDetails[k].electricityAmount="0.00";
					 
				  }	
					if($scope.expenseAccountDetails[k].taxAmount==null||$scope.expenseAccountDetails[k].taxAmount==""){
					  $scope.expenseAccountDetails[k].taxAmount="0.00";
					 
				  }	
				  		if($scope.expenseAccountDetails[k].paymentAmount==null||$scope.expenseAccountDetails[k].paymentAmount==""){
					  $scope.expenseAccountDetails[k].paymentAmount="0.00";
					 
				  }	
				  if($scope.expenseAccountDetails[k].bankNum!=null){
					  $scope.expenseAccountDetails[k].bankNum="B/C: "+$scope.expenseAccountDetails[k].bankNum;  
					  
				  }else{
					  $scope.expenseAccountDetails[k].bankNum="";
				  }

				sum=sum.add(new BigDecimal($scope.expenseAccountDetails[k].totalAmount));
				
					sum1=sum1.add(new BigDecimal($scope.expenseAccountDetails[k].totalAmount));
				$rootScope.BasicInfo.push($scope.expenseAccountDetails[k]);
			  }
			 
			  $scope.expenseAccountDetails[0].totalAmountSum=sum1+"";//单个报账点电费金额合计
			if(data.data.expenseTotalAmount==null||data.data.expenseTotalAmount==""){
					data.data.expenseTotalAmount="0.00";
				}
			  sum1=sum1.subtract(new BigDecimal($scope.expenseAccountDetails[0].expenseTotalAmount));
			$scope.expenseAccountDetails[0].paymentAmount=sum1+"";	//单个报账点支付金额合计
			 $rootScope.BasicInfo1.push($scope.expenseAccountDetails[0]);
			
			 $rootScope.total=sum+"";//多个电费金额合计				
			  $scope.expenseAccountDetails[0].expenseTotalAmount=data.data.expenseTotalAmount;
				otherCostSum=otherCostSum.add(new BigDecimal($scope.expenseAccountDetails[0].otherCost));
				electricityAmountSum=electricityAmountSum.add(new BigDecimal($scope.expenseAccountDetails[0].electricityAmount));
				taxAmountSum=taxAmountSum.add(new BigDecimal($scope.expenseAccountDetails[0].taxAmount));
				totalAmountSumSum=totalAmountSumSum.add(new BigDecimal($scope.expenseAccountDetails[0].totalAmountSum));
				expenseTotalAmountSum=expenseTotalAmountSum.add(new BigDecimal($scope.expenseAccountDetails[0].expenseTotalAmount));
				paymentAmountSum=paymentAmountSum.add(new BigDecimal($scope.expenseAccountDetails[0].paymentAmount));

			// alert($rootScope.otherCostSums+"==="+otherCostSum);
		$rootScope.otherCostSums=otherCostSum+"";//为其他费用合计赋值
		$rootScope.electricityAmountSums=electricityAmountSum+"";//为电费金额(元/不含税)合计赋值
		$rootScope.taxAmountSums=taxAmountSum+"";//为税金金额合计赋值
		$rootScope.totalAmountSumSums=totalAmountSumSum+"";//为总金额(元/含税)合计赋值
		$rootScope.expenseTotalAmountSums=expenseTotalAmountSum+"";//为本次核销金额合计赋值
		$rootScope.paymentAmountSums=paymentAmountSum+"";//为支付金额(元/含税)合计赋值
			/**  for(var j = 0; j<$scope.singleDetail.watthourMeterVOs.length; j++){
				 // alert(j);
                //时间格式转换
				  $scope.singleDetail.watthourMeterVOs[j].belongEndTime = $scope.dataChange($scope.singleDetail.watthourMeterVOs[j].belongEndTime);
				  $scope.singleDetail.watthourMeterVOs[j].belongStartTime = $scope.dataChange($scope.singleDetail.watthourMeterVOs[j].belongStartTime);
				//电费金额总计
				 //alert($scope.singleDetail.watthourMeterVOs[j].totalAmount+"@13");
				  if($scope.singleDetail.watthourMeterVOs[j].totalAmount==null||$scope.singleDetail.watthourMeterVOs[j].totalAmount==""){
					  $scope.singleDetail.watthourMeterVOs[j].totalAmount="0.00";
					 
				  }
				sum=sum.add(new BigDecimal($scope.singleDetail.watthourMeterVOs[j].totalAmount));
				$scope.totals=sum+"";//电费金额合计
				//alert($scope.totals+"111");
		   }
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
				}else if($scope.singleDetail.productNature == '1'){
					$scope.singleDetail.productNature = '塔维';
                }*/							
		/**
         * [流转信息]
         *
         */
		 if(data.data.instanceID == null||data.data.instanceID == ""){
					return;
		 }else{
			 commonServ.getFlowDetails($scope.instanceId).success(function (data) {
            utils.loadData(data,function (data) {
                $rootScope.ApprovalZWDetails = data.data;
            })
        });
		 }
 
			//$rootScope.BasicInfo.push($scope.singleDetail);
			//alert($scope.totals+"222");

            })
        })
				
		}; 
	//window.open("./tpl/expenseAccountDialog.html?rootScope="+$rootScope);
	
	   $scope.expenseAccountDialog=ngDialog.open({
            template: './tpl/expenseAccountDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
           width: 1200,
            controller:'addOrUpdateAuditCtrl',
            scope: $scope
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
	
    
    //导出excle(报销单明细表)
	 $scope.deriveExcel=function(){
		
		event.preventDefault();
        var BB = self.Blob;
        var contentStr = document.getElementById("expenseAccountDetails").innerHTML;   //内容
        var fileNmae='报销单明细表.xls';
        saveAs(
          new BB(
              ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
            , { type: "applicationnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
        ) , fileNmae);
		
	} 

		
	/**
	* 列表详情(弃用)
	*/

	$scope.listDetails = function(item){
	 commonServ.getInputElectrictyById(item.id).success(function (data) {
		 	$rootScope.BasicInfo=[];//用于保存列表信息返回给页面
            utils.loadData(data,function (data) {
				$scope.singleDetail = data.data;
				//$rootScope.singleDetails = data.data;
                $scope.singUploadFiles = data.data.sysFileVOs;  //附件
              $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                if($scope.singleDetail.isClud=="1"){
                    $scope.singleDetail.isClud = "包干";
                }else if($scope.singleDetail.isClud=="0"){
                    $scope.singleDetail.isClud = "不包干";
                }
                if($scope.singleDetail.productNature == '0'){
                    $scope.singleDetail.productNature = '自维';
				}else if($scope.singleDetail.productNature == '1'){
					$scope.singleDetail.productNature = '塔维';
                }
			$rootScope.BasicInfo.push($scope.singleDetail);
            })
        })
	}
}]);





/**
 * 基站电excel
 */
app.controller('excelCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
	 $scope.resultData={

		        "serialNumber":new Date().getTime(),
		        "sysAccountSiteId":"",//报账点ID
		        "status":"",//状态
		        "productNature":"",
		        "costCenterID":"",//成本中心ID
		        "towerSiteNumber":"",//铁塔站点编号
		        "shareElectricity":"",//分摊电费金额
		        "invoiceId":"",//发票类型ID
		        "taxAmount":"",//税金金额
		        "electricityAmount":"",//电费金额
		        "otherCost":"",//其他费用
		        "totalAmount":"",//总金额
		        "expenseTotalAmount":0,//核销总金额
		        "paymentAmount":"",//支付总金额
		        "attachmentId":[],//附件　ids
		        "watthourExtendVOs":[],//各电表信息,
		        "sysSupplierID":"",//供应商ID
		        "electrictyMidInvoices":[],  // 自维电费金额及发票信息
		        //"sysSupplierName":"",//供应商名称
				"supplierName":"",//供应商名称
		        "sysRgID":"", // 报账组名称
		        "contractID":"", //合同ID
				"departmentName":"", //部门名
				"overproofReasons":"",//超标原因
		        "remark":""

		    };	
		
	    $scope.pageInfo = {
	        totalCount: 0,//总的记录条数
	        pageCount: 0,// 总的页数
	        pageOptions: [15,50,100,200],//每页条数的选项,选填
	        showPages: 5//显示几个页码,选填
	    };

	    $scope.params = {
	        pageSize: 10,//每页显示条数
	        pageNo: 2,// 当前页
	    };
	 	commonServ.downExcel($scope.params).success(function (data) { 
			$scope.excel=data;
	    });
	
	$scope.downExcelGo=function(){
		
		event.preventDefault();
        var BB = self.Blob;
        var contentStr = document.getElementById("exportable").innerHTML;   //内容
        var fileNmae='自维稽核数据.xls';
        saveAs(
          new BB(
              ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
            , { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
        ) , fileNmae);
		
	}
	  //获取电费列表   生成电费提交单查询--弹出框中按钮  公用
    $scope.getDetail=function() {

    	commonServ.downExcel($scope.params).success(function (data) { 
			$scope.excel=data;
			
	    });
   
    }
}]);


/**
 * 综合电费excel
 */
app.controller('ZexcelCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
	 $scope.resultData={

		        "serialNumber":new Date().getTime(),
		        "sysAccountSiteId":"",//报账点ID
		        "status":"",//状态
		        "productNature":"",
		        "costCenterID":"",//成本中心ID
		        "towerSiteNumber":"",//铁塔站点编号
		        "shareElectricity":"",//分摊电费金额
		        "invoiceId":"",//发票类型ID
		        "taxAmount":"",//税金金额
		        "electricityAmount":"",//电费金额
		        "otherCost":"",//其他费用
		        "totalAmount":"",//总金额
		        "expenseTotalAmount":0,//核销总金额
		        "paymentAmount":"",//支付总金额
		        "attachmentId":[],//附件　ids
		        "watthourExtendVOs":[],//各电表信息,
		        "sysSupplierID":"",//供应商ID
		        "electrictyMidInvoices":[],  // 自维电费金额及发票信息
		        //"sysSupplierName":"",//供应商名称
				"supplierName":"",//供应商名称
		        "sysRgID":"", // 报账组名称
		        "contractID":"", //合同ID
				"departmentName":"", //部门名
				"overproofReasons":"",//超标原因
		        "remark":""

		    }	
	
	 	commonServ.ZdownExcel().success(function (data) { 
			$scope.excel=data;
	    });
	
	$scope.downExcelGo=function(){
		
		event.preventDefault();
        var BB = self.Blob;
        var contentStr = document.getElementById("exportable").innerHTML;   //内容
        var fileNmae='自维综合稽核数据.xls';
        saveAs(
          new BB(
              ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
            , { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
        ) , fileNmae);
		
	}
	

}]);



/**
 * 转供电费excel
 */
app.controller('ZGexcelCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
	 
	 	commonServ.downZGExcel().success(function (data) { 
			$scope.excel=data.data;
	    });
	
	$scope.downExcelGo=function(){
		
		event.preventDefault();
        var BB = self.Blob;
        var contentStr = document.getElementById("exportable").innerHTML;   //内容
        var fileNmae='转供电清单.xls';
        saveAs(
          new BB(
              ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
            , { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
        ) , fileNmae);
		
	}
	

}]);

/**
 *  自维新增稽核单(电表在外边显示) addOrUpdateAuditCtrl_1 公用模块（包含电费录入--新增稽核单   电费录入--修改、查看稽核单   电费稽核---修改、查看稽核单）
 */
app.controller('addOrUpdateAuditCtrl_1', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
    /**
     * [resultData description] 新建稽核单数据
     * @type {Object}
     */
    $scope.resultData={

        "serialNumber":new Date().getTime(),
        "sysAccountSiteId":"",//报账点ID
        "status":"",//状态
        "productNature":"",
        "costCenterID":"",//成本中心ID
        "towerSiteNumber":"",//铁塔站点编号
        "shareElectricity":"",//分摊电费金额
        "invoiceId":"",//发票类型ID
        "taxAmount":"",//税金金额
        "electricityAmount":"",//电费金额
        "otherCost":"",//其他费用
        "totalAmount":"",//总金额
        "expenseTotalAmount":0,//核销总金额
        "paymentAmount":"",//支付总金额
        "attachmentId":[],//附件　ids
        "watthourExtendVOs":[],//各电表信息,
        "sysSupplierID":"",//供应商ID
        "electrictyMidInvoices":[],  // 自维电费金额及发票信息
        "supplierName":"",//供应商名称
        "sysRgID":"", // 报账组名称
        "contractID":"", //合同ID
		"departmentName":"", //部门名
		"overproofReasons":"",//超标原因
		"remark":"",
        "payType":7,//缴费类型
        "professional":"无线",//所属专业
        "auditType":0//稽核类型

    }

/********************************************************新增稽核和电费录入公共部分****************************************************************/
    // 电费录入修改稽核单状态
    $scope.isAudit = true;        //修改稽核單狀態
    $scope.isEditAudit = false;   //查看稽核單狀態

    //发票信息
    $scope.invoiceVOs=[];
    //获取稽核单号、地市、区县、发票信息
    commonServ.getInputElectrictyAddInfo().success(function(data){
        $scope.resultData.serialNumber=data.serialNumber;  // 稽核单号
        $scope.resultData.areas=data.areas;                // 地市
        $scope.resultData.counties=data.counties;          // 区县
        $scope.invoiceVOs=data.invoiceVOs;                 // 发票信息
        //alert(data.adpv.paymentNumber);
        $scope.adpv=data.adpv;//预付单信息

    });
    


    //获取成本中心列表
    $scope.costCeterVOs=[];
    commonServ.getInputElectrictyCostCeterVOsInfo().success(function(data){
        utils.loadData(data,function(data){
            if(data.data.length>0){
                $scope.costCeterVOs=data.data;
                $scope.resultData.costCenterID = $scope.costCeterVOs[0].id;
            }
        })
    });

 //保存选择的成本中心
	$scope.selectCostCenter = function(data){		
		if(data==null){
			 utils.msg("请选择一个成本中心！");
			 return;
		}		
		$scope.resultData.costCenterID=data;   //保存选择的成本中心ID
	};

    //获取报账单名称
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
    
    //核销计算
    $scope.countMoney=function(){

    	if($scope.resultData.expenseTotalAmount==null ||$scope.resultData.expenseTotalAmount==''){
    		$scope.resultData.expenseTotalAmount=0;
    	}
    	if(parseFloat($scope.resultData.expenseTotalAmount)>parseFloat($scope.resultData.paymentAmount)||$scope.resultData.paymentAmount==null ||$scope.resultData.paymentAmount==''){
    		utils.msg("核销金大于此次支付金额");
    		$scope.resultData.expenseTotalAmount=0;
    	}
    	if(parseFloat($scope.resultData.expenseTotalAmount)>parseFloat($scope.adpv.surplusMoney)){
    		utils.msg("核销金大于剩余预付金额");
    		$scope.resultData.expenseTotalAmount=0;
    	}else if(parseFloat($scope.resultData.expenseTotalAmount)>parseFloat($scope.resultData.paymentAmount)){
    		utils.msg("核销金大于这次报销金");
    		$scope.resultData.expenseTotalAmount=0;
    	}
    };


    //获取报账点列表
    $scope.getData=function(siteName){	
        angular.extend($scope.params,{
            "cityId":$rootScope.userCityId,
            "countyId":$rootScope.userCountyId,
            "siteName":$("#siteName").val(),
            // "accountName":$scope.accountName,
            // "accountAlias":$scope.accountAlias,
            // "oldFinanceName":$scope.oldFinanceName,
            // "resourceName":$scope.resourceName
        })
        commonServ.querySiteInfoPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    $scope.confvv = [];  //报账点
    $scope.confs = []; //供货商

    // 获取报账点弹框
    $scope.siteObject={};   //返回countyId
    $scope.getAccountSite=function(){
        $scope.accountSiteDialog=ngDialog.open({
            template: './tpl/reimburDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }


    // 查询是否包干  产权性质
    $scope.getIsClud=function(siteId){
        commonServ.getInputElectrictyDetail(siteId).success(function (data) {
            if(data.isClud == 1){
                $scope.isCludInfoDetail = "包干";
            }else if(data.isClud == 0){
                $scope.isCludInfoDetail = "不包干";
            }else {
                $scope.isCludInfoDetail = "";
            }
        });
    }

    // 选择报账点名称  新增稽核、电费录入修改
    $scope.choiceAccountSite=function(){
		$scope.resultData.contractID=null;
        $scope.isAudit = false;
        $scope.isEditAudit = true;
        var obj= utils.getCheckedValsForRadio('#siteList');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        $scope.siteObject= JSON.parse(obj);
		$rootScope.AccountSiteId=$scope.siteObject.id;//保存报账点id
		$rootScope.AccountSiteName=$scope.siteObject.accountName;//保存报账点名称
        $scope.resultData.sysAccountSiteId=$scope.siteObject.id;//报账点id
       // $scope.getIsClud($scope.siteObject.id);  //是否包干
       // $scope.getSuppliers($scope.siteObject.id); //查询对应的供应商
		$scope.getContract($scope.siteObject.id); //查询对应的合同id	
	        commonServ.getMt($scope.resultData.sysAccountSiteId).success(function (data) {
	        	$rootScope.belongEndTimezw= new Array(data.data.length);//电费归属终止日期
		        $rootScope.endAmmeterzw= new Array(data.data.length); //用电终度（度）
	        	  for(var index=0; index<data.data.length; index++) {
	        		  $rootScope.belongEndTimezw[index]= data.data[index].belongEndTimeS;//电费归属终止日期
		              $rootScope.endAmmeterzw[index]= data.data[index].endAmmeter; //用电终度（度）
	              }
	       })
		
        if($scope.siteObject.productNature == 0) {
            $scope.productNatureType = "自维";
        }else {
            $scope.productNatureType = "塔维";
        }

        // 修改页面
        if(!$scope.flagSave  && $scope.flagSave != undefined) {
            $scope.singleDetail.sysAccountSiteId = $scope.siteObject.id;         // 报账点ID
            $scope.singleDetail.accountName = $scope.siteObject.accountName;     //报账点名称
            $scope.singleDetail.accountAlias = $scope.siteObject.accountAlias;  //报账点别名
            //选择报账点后清空页面上原有数据
            $scope.singleDetail.paymentAmount = "";   //支付总金额
            $scope.singleDetail.otherCost = "";       //其他费用
            $scope.singleDetail.totalAmount = "";     //总金额
            $scope.singleDetail.sysSupplierName = ""; //供货商名称
            if($scope.electrictyMidInvoices.length >= 0){
                $scope.electrictyMidInvoices = [];  //发票信息
            }
            if($scope.watthourMeterVOs &&　$scope.watthourMeterVOs.length > 0){
                $scope.watthourMeterVOs = [];
            }

        }else {
             //清空原有数据 新增
            $scope.resultData.paymentAmount = "";   //支付总金额
            $scope.resultData.otherCost = "";       //其他费用
            $scope.resultData.totalAmount = "";     //总金额
            $scope.resultData.sysSupplierName = ""; //供货商名称
            if($scope.resultData.electrictyMidInvoices.length >= 0){
                $scope.resultData.electrictyMidInvoices = [];  //发票信息
            }
            $scope.accountObject.name = ""; // 报账组信息
            if($scope.resultData.watthourExtendVOs &&　$scope.resultData.watthourExtendVOs.length > 0){
                $scope.resultData.watthourExtendVOs = [];
            }
            // 清空页面上的电表数据信息
            if($scope.watthourMeterVOs && $scope.watthourMeterVOs.length > 0){
                $scope.watthourMeterVOs = [];
            }
        }

        $scope.closeDialog('accountSiteDialog');
    }



    //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }


     //根据报账点查找对应的供应商
    $scope.getSuppliers=function(countyId){
        commonServ.getSupplierName(countyId).success(function(data){
            utils.loadData(data,function(data){
                if(data.data == null){
                    // utils.msg("该站点无供应商信息,请选择一个默认供应商");
                    return;
                }else {
                    $scope.resultData.sysSupplierName=data.data.name;
                    $scope.resultData.sysSupplierID=data.data.id;
                    //查找供应商的预付单
                    $scope.getPreBySuId(data.data.code);
                }
            })
        });
    }
    
    $scope.flagg=false;
    //查找供应商的预付单
      $scope.getPreBySuId=function(suId){
      	commonServ.getPreBySuId(suId).success(function(data){
      		$scope.adpv=data.data;
      		if($scope.adpv!=null){
      			$scope.flagg=true;
      		}else{
      			$scope.flagg=false;
      		}
      		
      	})
      }
      

     //获取供应商名称
    $scope.suPpageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getSparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 供应商搜索列表
    $scope.getData2=function(supplierName,a){
    	if(a){
   		 $scope.getSparams = {
	        pageSize: 10,//每页显示条数
	        pageNo: 1,// 当前页
   		 };
    	}

        angular.extend($scope.getSparams,{
            "cityId":$rootScope.userCityId,
            "only":"1",
            "name": supplierName,
            //"accountName":$scope.accountName,
            //"accountAlias":$scope.accountAlias,
            //"oldFinanceName":$scope.oldFinanceName,
            //"resourceName":$scope.resourceName
        })			
        commonServ.querySupplier($scope.getSparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.suPpageInfo.totalCount = data.data.totalRecord;
                $scope.suPpageInfo.pageCount = data.data.totalPage;
                $scope.getSparams.page = data.data.pageNo;
                $scope.suppliers = data.data.results;
            })
        });
    }



    // 供应商弹出框
    $scope.choiceSupplierDialog=function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
        $scope.choiceSupplierDialogs=ngDialog.open({
            template: './tpl/supplierDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
            scope: $scope,
        });
    }


    // 确定选择供应商
    $scope.choiceSupplier=function(){
        var obj= utils.getCheckedValsForRadio('#SupplieList');
        if(obj==null){
            utils.msg("请选择一个供应商！");
            return;
        }
        obj= JSON.parse(obj);
        $scope.resultData.sysSupplierName=obj.name; //供应商名称
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            $scope.singleDetail.supplierName = obj.name;      //修改稽核单页面供货商数据
            $scope.singleDetail.sysSupplierID=obj.id;
        }
        $scope.resultData.sysSupplierID=obj.id;   //改变后的供应商id
        $scope.getPreBySuId(obj.code);
        $scope.closeDialog("choiceSupplierDialogs");
    }
    
    
    
    //根据报账点查找对应的合同ID
    $scope.getContract=function(countyId){
		//(匹配上次录入)
        commonServ.getContractName(countyId).success(function(data){
            utils.loadData(data,function(data){
                if(data.data == null){
                    // utils.msg("该站点无合同信息,请选择一个默认合同id");
                    return;
                }else {          
                	 //$scope.resultData.contractID=data.data.contractID;//匹配上次录入的合同ID					 
 					$scope.resultData.costCenter=data.data.costCenter;//匹配上次录入的成本中心
					$scope.resultData.costCenterID=data.data.costCenterID;//保存上次录入的成本中心ID
 					$scope.accountObject.name=data.data.sysRgName;//匹配上次录入的报账组名称
					$scope.resultData.sysRgID=data.data.sysRgID;//保存上次录入的报账组id
					$scope.departmentName=data.data.departmentName;//匹配上次录入的部门名
					$scope.departmentName1=data.data.departmentName;//匹配上次录入的部门名显示在录入页面
					$scope.resultData.departmentName=data.data.departmentName;//保存上次录入的部门名
					//alert(data.data.contractID+"==");
					//$scope.contractInfos(data.data.contractID);//根据合同id查询对应的合同信息
                }
            })
        });
		//匹配报账点对应的合同
		commonServ.getContract(countyId).success(function(data){
            utils.loadData(data,function(data){
                if(data.data == null||data.data==""){
					$scope.contractIds="";
					alert("该报账点无合同数据,不允许报销,请确认合同信息上传财务系统后再试！");					
                    return;
                }else {                         	
                	$scope.contractIds=data.data;//获取报账点对应的合同id
                }
            })
        });
    }
	
	//未选择报账点选择合同时判断
	$scope.judgeContract = function(){	
		var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
			return;		
	}
	 //保存选择的合同
	$scope.selectContract = function(data){	
		if(data==null){
			 utils.msg("请选择一个合同！");
			 $scope.resultData.contractID=null;
			 return;
		}
		if(data!=null||data!=""){
		 $scope.watthourMeterVOs = [];	
		$scope.resultData.contractID=data;   //保存选择的合同
		$scope.contractInfos(data);//根据合同id查询对应的合同信息
		utils.msg("你选择了合同:"+data);
		}		
	};
	
     //获取合同名称
    $scope.coNpageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getSparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 合同信息搜索列表
    $scope.getData3=function(contractName,a){
    	if(a){
   		 $scope.getSparams = {
	        pageSize: 10,//每页显示条数
	        pageNo: 1,// 当前页
   		 };
    	}

        angular.extend($scope.getSparams,{
            //"cityId":$scope.cityId,
            "only":"1",
            "name": contractName,
			"AccountSiteId" : $rootScope.AccountSiteId,
            //"accountName":$scope.accountName,
            //"accountAlias":$scope.accountAlias,
            //"oldFinanceName":$scope.oldFinanceName,
            //"resourceName":$scope.resourceName
        })

        commonServ.queryContract($scope.getSparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.coNpageInfo.totalCount = data.data.totalRecord;
                $scope.coNpageInfo.pageCount = data.data.totalPage;
                $scope.getSparams.page = data.data.pageNo;
                $scope.Contract = data.data.results;
            })
        });
    }

    // 合同信息弹出框
    $scope.choiceContractDialog=function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){          
		   utils.msg("请先选择报账点！");
            return;
        }
        $scope.choiceContractDialogs=ngDialog.open({
            template: './tpl/contractDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
            scope: $scope,
        });
    }


    // 确定选择合同ID
    $scope.choiceContract=function(){
        var obj= utils.getCheckedValsForRadio('#ContractList');
        if(obj==null){
            utils.msg("请选择一个合同！");
            return;
        }
        obj= JSON.parse(obj);
        $scope.resultData.contractName=obj.name; //合同名称
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            $scope.singleDetail.contractName = obj.name;      //修改稽核单页面合同数据
            $scope.singleDetail.contractID=obj.id;
        }
        $scope.resultData.contractID=obj.id;   //改变后的合同id
		$scope.contractInfos(obj.id);//根据合同id查询对应的合同信息
        $scope.closeDialog("choiceContractDialogs");
    }

	//根据合同id查询对应的合同信息
	$scope.contractInfos=function(contractId){
		var cityId=$rootScope.userCityId;//地市ID
		var countyId=$rootScope.userCountyId;//区县id
		commonServ.getContractInfo(contractId,cityId,countyId).success(function(data){
            utils.loadData(data,function(data){  
			$scope.vendorName=data.data.vendorName;//供应商名称
			$scope.resultData.sysSupplierID=data.data.supplierId;//保存供应商ID
			$scope.resultData.supplierName=data.data.vendorName;//保存供应商名称
			 //查找供应商的预付单（通过供应商ID--表中的code字段）
            $scope.getPreBySuId(data.data.vendorId);
			$scope.startDate=data.data.executionBeginDate; //合同生效日期
			$scope.endDate=data.data.executionEndDate; //合同失效日期
			$scope.assetManagementSiteName=data.data.assetManagementSiteName;//资管站点名称
			if(data.data.unitPrice==null||data.data.unitPrice==""){//区域直供电单价
				$scope.zgdUnitPrice="0";
			}else{
				$scope.zgdUnitPrice=data.data.unitPrice; //区域直供电单价
			}
			//$scope.isUploadOverproof=data.data.isUploadOverproof;//是否上传超标审批记录( 有(0)、无(1))
			if(data.data.isUploadOverproof=="0"){ //上传了超标审批记录
				$scope.isUploadOverproof="有"; 
			}else if(data.data.isUploadOverproof=="1"){ //未上传超标审批记录
				$scope.isUploadOverproof="无";
			}else{
				$scope.isUploadOverproof="";
			}
			if(data.data.contractNumber==null){
				
				$scope.contractNumber="无";//合同编号
			}else{
				$scope.contractNumber=data.data.contractNumber;//合同编号
			}
			$scope.priceOrLumpSumPrice=data.data.priceOrLumpSumPrice;//单价或包干价(大于20即包干价)
			if(data.data.priceOrLumpSumPrice>20){
				$scope.xIsClud="bg";//设置状态为包干
				$scope.sumXPrice=data.data.priceOrLumpSumPrice;//包干价
			}else{
				$scope.xIsClud="bbg";//设置状态为不包干
				$scope.xPrice=data.data.priceOrLumpSumPrice;//单价
			}			
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


    //计算用电天数
    $scope.countDays=function(item, index){
        if(!item.belongStartTime || !item.belongEndTime){
            return;
        }		
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.exceptions3Explain=null;//初始化异常原因(报账点单电表日均电量超1千度)
		item.isContinue=null;//初始化状态(是否继续提交)
        item.dayAmmeter= utils.getDays(item.belongStartTime,item.belongEndTime) + 1;
        $scope.watthourMeterVOs[index]=item;
    }

	//电损改变时重新判断电损占比
	$scope.bElectricLoss=function(item, index){
		
		if(item.electricLoss==""||item.electricLoss==null){
			item.electricLoss=0;
		}
		item.totalEleciric=parseFloat($scope.totalEleciricDS)+parseFloat(item.electricLoss)+"";
		item.exceptions4Explain=null;//初始化异常原因(电损占比=稽核单电损电量/稽核单总电量>80%)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
		if($scope.sumXPrice==null||$scope.sumXPrice==""){
        $scope.countElectrictyItemPrice(item,index);
		}else if(($scope.sumXPrice!=null||$scope.sumXPrice!="")&&(item.totalAmount!=null||item.totalAmount!="")){
			$scope.backcalculationPrice(item,index);
		}
	}
	
	//本次拍照时间改变时重新判断报销时间与拍照时间是否相同
	$scope.bTheTakePhotosTime=function(item, index){
		//item.theTakePhotosTime=null;//
		item.exceptionsExplain=null;//初始化异常原因(报销时间与拍照时间相同)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
	}
	
	//拍照电表读数改变时重新判断拍照电表读数是否小于报销电表当前读数
	$scope.bElectricMeterDeg=function(item, index){
		item.exceptions1Explain=null;//初始化异常原因(拍照电表读数小于报销电表当前读数)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
	}
	
    //计算电表的用电量
    $scope.countPowerSize=function(item,index){ 	
        //如果翻表选择‘是’
        if(item.whetherMeter == 1 && (item.maxReading || item.maxReading == 0 )){
           item.viewMaxReading = item.maxReading;
        }else if(!item.maxReading && item.maxReading != 0){
            item.whetherMeter == 0;
            item.viewMaxReading = "";
        }else{
            // $scope.isSelect = false;
            // $scope.isSelected = true;
            item.viewMaxReading = "";
        }
        if(!item.startAmmeter ){
            item.startAmmeter = null;
        }
        if(!item.endAmmeter){
            item.endAmmeter = null;
        }
        var sum=( item.endAmmeter - item.startAmmeter); //未翻表
        //翻表
        if(item.whetherMeter==1 && (item.maxReading || item.maxReading == 0 )){
            sum= parseFloat(sum+item.maxReading+1); //翻表总电量 = 最大读数 + 当前止度读数 - 当前起度读数 + 1
        }

        if(isNaN(parseFloat(sum))){
            $scope.checkNumber(item);
            return;
        }
		item.exceptions1Explain=null;//初始化异常原因(拍照电表读数小于报销电表当前读数)
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.exceptions3Explain=null;//初始化异常原因(报账点单电表日均电量超1千度)
		item.exceptions4Explain=null;//初始化异常原因(电损占比=稽核单电损电量/稽核单总电量>80%)
		item.isContinue=null;//初始化状态(是否继续提交)
		if(item.electricLoss==null||item.electricLoss==""){
			item.electricLoss="0";
		}
        item.totalEleciric= (parseFloat(sum)+parseFloat(item.electricLoss)).toFixed(2);
		$scope.totalEleciricDS=parseFloat(sum).toFixed(2);
		/*if($scope.xIsClud=="bbg"){
			item.unitPrice=$scope.xPrice;//单价
		} */
        $scope.watthourMeterVOs[index]=item;
		/*if(item.totalAmount==null||item.totalAmount==""){
			$scope.countElectrictyItemPrice(item,index);
		} */
		if($scope.sumXPrice==null||$scope.sumXPrice==""){
        $scope.countElectrictyItemPrice(item,index);
		}else if(($scope.sumXPrice!=null||$scope.sumXPrice!="")&&(item.totalAmount!=null||item.totalAmount!="")){
			$scope.backcalculationPrice(item,index);
		}
		$scope.submitDetail();	//电表同步稽核单数据
    }

   //反算单价
    $scope.backcalculationPrice=function(item,index){
		if(item.totalAmount>$scope.sumXPrice){			
			utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
		}
        var price; //单个电表总金额
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.isContinue=null;//初始化状态(是否继续提交)
		price=item.totalAmount/item.totalEleciric;
		item.unitPrice=	parseFloat(price).toFixed(2);//单价	
        item.backcalculationPrice = parseFloat(price).toFixed(2);//反算单价
        $scope.watthourMeterVOs[index]=item;
    };

    // 计算单个电表的金额
    $scope.countElectrictyItemPrice=function(item,index){
        var total; //单个电表总金额
       /* if($scope.invoiceVOs.length == 0){
            utils.msg("目前暂无税率信息，请联系管理员后配置后再进行计算!");
            return;
        }else if($scope.invoiceVOs[0].billTax == "0"){
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice;
        }else {
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice*($scope.invoiceVOs[0].billTax/100);
        } */
		if($scope.xIsClud=="bbg"){
			item.unitPrice=$scope.xPrice;//单价
		}
		total=item.totalEleciric*item.unitPrice;
        if(isNaN(parseFloat(total))){
            $scope.checkNumber(item);
            return;
        }
        item.totalAmount= parseFloat(total).toFixed(2);
        $scope.checkNumber(item);
        $scope.watthourMeterVOs[index]=item;
    };


    $scope.disabled = false;  // 判断发票信息是否能填写
    //计算电费总金额
    $scope.countElectrictyTotPrice=function(){
    	// debugger;
        var sum=0;
        for(var  i=0; i<$scope.watthourMeterVOs.length; i++){
            var item = $scope.watthourMeterVOs[i];
            if(item.totalAmount != null){
                sum += parseFloat(item.totalAmount);
            }
        }
        $scope.resultData.totalAmount= sum.toFixed(2);    //各电表的总金额
		$scope.totalAmount = sum.toFixed(2);//用于填写其他费用后计算总金额
        $scope.resultData.paymentAmount = sum.toFixed(2); // 支付总金额

        // 录入电费页面修改
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            /*if(isNaN(parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost))){
                return;
            }*/
        	if(isNaN(parseFloat($scope.resultData.totalAmount))){
                return;
            }
          //  $scope.singleDetail.paymentAmount= parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost).toFixed(2);//页面上的数据
          //  $scope.singleDetail.totalAmount = $scope.resultData.totalAmount;  // 页面显示的数据
			
			//$scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.singleDetail.otherCost))+"";  //支付总金额
        	$scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmount)+"";//支付总金额
        	//$scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.singleDetail.otherCost))+""; //总金额（含税）
        	$scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmount)+""; //总金额（含税）
            //$scope.editInvoiceVO(); //电费录入页面-----计算发票税金金额
            if($scope.resultData.electrictyMidInvoices.length==0){
                $scope.resultData.electrictyMidInvoices.unshift({
                    "taxAmount":parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else {
                $scope.resultData.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
         //发票修改时修改   $scope.electrictyMidInvoices = $scope.resultData.electrictyMidInvoices; //电费录入 ---修改详情页面显示修改的发票
        }else {
            $scope.disabled = true;
            $scope.resultData.paymentAmount = parseFloat($scope.resultData.totalAmount/* - $scope.resultData.otherCost*/).toFixed(2);
             //新增稽核单-----计算发票税金金额
            if($scope.resultData.electrictyMidInvoices.length==0){
                $scope.resultData.electrictyMidInvoices.unshift({
                    "taxAmount":parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else {
                $scope.resultData.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
        }
    }

    // 手动填写其他费用
    $scope.changeTotalAmount = function(){
		if($scope.totalAmount==null||$scope.totalAmount==""){
			$scope.resultData.otherCost=null;
			 utils.msg("请先添加电表明细");			 
		}else{
		if($scope.resultData.otherCost==null||$scope.resultData.otherCost==""){
			$scope.resultData.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(!reg.test($scope.resultData.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.resultData.otherCost < 0){
            utils.msg("数值不能为负。");
            return;
        }else if($scope.resultData.otherCost){	
        $scope.resultData.paymentAmount =new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.resultData.otherCost))+"";  //支付总金额
        $scope.resultData.totalAmount = new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.resultData.otherCost))+""; //总金额（含税）+=其他金额
		//alert($scope.resultData.otherCost+"==="+$scope.resultData.totalAmount+$scope.resultData.paymentAmount+parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2));
		}else {
			$scope.resultData.paymentAmount = $scope.totalAmount;
			$scope.resultData.totalAmount = $scope.totalAmount;
			
        }

		if($scope.resultData.otherCost=="0"){
			$scope.resultData.otherCost=null;
		}
		
        if($scope.resultData.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
          /*  $scope.resultData.electrictyMidInvoices.splice(0,1,{
                "taxAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
                "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            }) */
			$scope.resultData.electrictyMidInvoices.splice(0,1,{
                "taxAmount": new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
                "electricityAmount": new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
			
        }
		}
    }
    
  //验证手动输入的支付总金额
    $scope.changePaymentAmount=function(){
    	if($scope.totalAmount==null||$scope.totalAmount==""){
			$scope.resultData.paymentAmount=null;
			 utils.msg("请先添加电表明细");			 
		}else{
		if($scope.resultData.paymentAmount==null||$scope.resultData.paymentAmount==""){
			$scope.resultData.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(!reg.test($scope.resultData.paymentAmount)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.paymentAmount.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.resultData.paymentAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if((new BigDecimal($scope.resultData.paymentAmount).subtract(new BigDecimal($scope.resultData.totalAmount))) > 0){
        	 utils.msg("支付总金额不能大于总金额(含税)");
             return;        	
        }

		if($scope.resultData.paymentAmount=="0"){
			$scope.resultData.paymentAmount=null;
		}		
    }
    }

    //关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }


    //获取电表明细----对应电表个数
    $scope.getDianBiaoDetail=function(){
    	console.log($scope.singleDetail);
        // debugger;
        var siteId=$scope.resultData.sysAccountSiteId;//报账单ID
		var contractID=$scope.resultData.contractID;//合同id
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }else if((contractID==''||contractID==null)&& $scope.flagSave == undefined && $scope.flag == undefined){
			utils.msg("请先选择合同！");
            return;
		}else if(siteId !== ""){
            // debugger;
            // 电表数组为空新增   电表数组不为空直接显示--------新增电表时
            if(!$scope.watthourMeterVOs || $scope.watthourMeterVOs.length < 1){
                $scope.isNew = true;   //默认显示viewMaxReading
				//通过报账点查询电表信息
                commonServ.getInputElectrictyDetail(siteId).success(function(data){					
					$rootScope.createDate=data.createDate;
					$rootScope.nowTime= new Date();
                    if(data != "" && data.watthourMeterVOs.length > 0){
                        for(var index=0; index<data.watthourMeterVOs.length; index++) {							
                            data.watthourMeterVOs[index].watthourId = data.watthourMeterVOs[index].id;
                            data.watthourMeterVOs[index].belongStartTime=$rootScope.belongEndTimezw[index];
                            data.watthourMeterVOs[index].startAmmeter=$rootScope.endAmmeterzw[index];
							//判断上次拍照时间是否有值
							if(data.watthourMeterVOs[index].takePhotosTime==null){
							data.watthourMeterVOs[index].photosStatus=false;	//拍照时间为null,用户选择上次拍照时间
						
							}else{
								data.watthourMeterVOs[index].photosStatus=true; //拍照时间不为null,上次拍照时间为后台查询出来的拍照时间
							data.watthourMeterVOs[index].takePhotosTime=$scope.dataChange(data.watthourMeterVOs[index].takePhotosTime);
							}
							data.watthourMeterVOs[index].lastTakePhotosTime=data.watthourMeterVOs[index].takePhotosTime;//上次拍照时间=拍照时间
							//判断最大读数是否有值
							if(data.watthourMeterVOs[index].maxReadings==null){
							data.watthourMeterVOs[index].maxReadingStatus=false;	//最大读数为null,用户选择最大读数					
							}else{
								data.watthourMeterVOs[index].maxReadingStatus=true; //最大读数不为null,带出用户上次选择
							}
					   }
                        $scope.watthourMeterVOs =utils.deepCopy(data.watthourMeterVOs);
						//alert($scope.dataChange(data.watthourMeterVOs[0].takePhotosTime)+"拍照时间");
                       /* $scope.accountSiteDialog=ngDialog.open({
                            template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                            width: 1000,
                            scope: $scope,
                        });*/
                    }else {
                        utils.msg("报账点对应的电表信息为空，请重新选择报账点！");
                        // $scope.closeDialog('accountSiteDialog');  此处6月8日已注释
                        return;
                    }
                });
            }else{
                $scope.isNew = false;
                /*$scope.accountSiteDialog=ngDialog.open({
                    template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                    width: 1000,
                    scope: $scope,
                });*/
            }

        }else if(!$scope.flagSave  && $scope.flagSave != undefined || !$scope.flag){
            $scope.isNew = false;   //默认显示viewMaxReading
			$rootScope.nowTime= new Date();//当前时间
            // 查看修改电表信息时
			if($scope.singleDetai && $scope.singleDetail.watthourMeterVOs!=null){
				if($scope.singleDetail.watthourMeterVOs.length>0){
					for(var index=0; index<$scope.singleDetail.watthourMeterVOs.length; index++) {	
					if($scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime==null||$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime==""){					
					$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime="";
					}else{
						$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime=$scope.dataChange($scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime);
					}
					if($scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime==null||$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime==""){					
						$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime="";
					}else{
						$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime=$scope.dataChange($scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime);
					}
					if(($scope.singleDetail.watthourMeterVOs[index].unitPrice==""||$scope.singleDetail.watthourMeterVOs[index].unitPrice==null)
					&&($scope.singleDetail.watthourMeterVOs[index].backcalculationPrice!=""||$scope.singleDetail.watthourMeterVOs[index].backcalculationPrice!=null)
					){
						$scope.singleDetail.watthourMeterVOs[index].unitPrice=$scope.singleDetail.watthourMeterVOs[index].backcalculationPrice;
					}
					}
				}			
			}
            $scope.watthourMeterVOs = utils.deepCopy($scope.singleDetail.watthourMeterVOs);
            for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
                //时间格式转换
                $scope.watthourMeterVOs[i].belongEndTime = $scope.dataChange($scope.watthourMeterVOs[i].belongEndTime);
                $scope.watthourMeterVOs[i].belongStartTime = $scope.dataChange($scope.watthourMeterVOs[i].belongStartTime);
            }
            /*$scope.accountSiteDialog=ngDialog.open({
                template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                width: 1000,
                scope: $scope,
            });*/
        }
        console.log("电表明细",angular.toJson($scope.watthourMeterVOs,true));

    }
    
    var isEmpty = true;  //判断电表信息是否填写完整
    var isRightReg = true;  // 判断电表信息是否符合规矩
    // 校验数据
    $scope.checkNumber=function(meterVo){
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if((meterVo.startAmmeter != null && meterVo.startAmmeter.length > 20) || (meterVo.endAmmeter != null && meterVo.endAmmeter.length > 20) || (meterVo.dayAmmeter != null && meterVo.dayAmmeter.length > 20) || (meterVo.totalEleciric != null && meterVo.totalEleciric.length > 20) || (meterVo.totalAmount != null && meterVo.totalAmount.length > 20) || (meterVo.unitPrice != null && meterVo.unitPrice.length > 20) ){
            utils.msg("数值类型长度不能超过20个字符。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        if((meterVo.startAmmeter != null && !reg.test(meterVo.startAmmeter) )|| (meterVo.endAmmeter != null && !reg.test(meterVo.endAmmeter)  )|| (meterVo.dayAmmeter != null && isNaN(parseFloat(meterVo.dayAmmeter)) )|| (meterVo.totalEleciric != null && !reg.test(meterVo.totalEleciric) )|| (meterVo.totalAmount != null && !reg.test(meterVo.totalAmount) )|| (meterVo.unitPrice != null && !reg.test(meterVo.unitPrice) )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        // 此处修改-----当总用电止度为空的时候校验总电量为负数 meterVo.endAmmeter != null
        if( (meterVo.startAmmeter != null && meterVo.startAmmeter < 0 )|| (meterVo.endAmmeter != null && meterVo.endAmmeter < 0 )|| (meterVo.dayAmmeter != null && meterVo.dayAmmeter < 0 )|| (meterVo.totalEleciric != null && meterVo.totalEleciric < 0  && meterVo.endAmmeter != null)|| (meterVo.totalAmount != null && meterVo.totalAmount < 0)|| (meterVo.unitPrice != null && meterVo.unitPrice < 0 )){
            utils.msg("数值不能为负。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        if(meterVo.remarks != null &&　meterVo.remarks.length > 150){
             utils.msg("备注长度不能超过150个字符。");
                isRightReg = false;
                return;
        }else if(meterVo.remarks != null){
                isRightReg = true;
        }
    }

//最大度数
    $scope.maxReadingsChange=function(item,index){
		item.maxReadings=$("#maxReadings").val();

		 $scope.watthourMeterVOs[index]=item;

	}

	    // 上传拍照图片
    $scope.uploadImg = function(item) {
        $scope.tabUpload=1;
		$scope.watthourMeterID=item.id;
        $scope.uploadImgDialog=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    };
	
	 //查看上传的图片
    $scope.showImg = function(item){
		if(item.accessories==null||item.accessories==""){
			alert("该电表无拍照图片！");
			return;
		}
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        var showUrl = base_url+'/fileOperator/fileDownLoadImg.do?filepath='+item.accessories;	   
        $scope.showUrls = showUrl;
        $scope.uploadImg=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    }
	
	    $scope.files = [];
     // 选择图片
    $scope.change1 = function(ele){
        $scope.files = ele.files;
        $scope.fileName = $scope.files[0].name;	
        var extStart=$scope.fileName.lastIndexOf(".");
        var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
        if(!/\.(gif|jpg|bmp|png|GIF|JPG|PNG|BMP)$/.test(ext)){
            utils.msg("请上传图片,类型必须是.jpg,gif,png,bmp中的一种");
            return;
        }else {
            var objUrl = $scope.getObjectURL($scope.files);
            $(".preview-box").attr("src",objUrl);
            $scope.$apply();
        }

    }


    $scope.uploadFiles = [];    //已上传的文件

    // 上传图片发送后台
    $scope.uploadImgType = function(){
        if($scope.files.length == 0 || $scope.files == null){
            utils.msg("请上传图片！");
            return;
        }
        var base_url = CONFIG.BASE_URL;
		var fileName=$scope.fileName;
        var formData = new FormData($( "#uploadForm1" )[0]);
        $.ajax({
            url:base_url+'/fileOperator/imgUpload.do',
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
					$scope.fileUrl = $scope.getObjectURL($scope.files);
                    $scope.uploadImgDialog.close("");
                    // 上傳成功后清空数据
                    $scope.files = [];
                }
                for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
					if($scope.watthourMeterVOs[i].id==$scope.watthourMeterID){
						$scope.watthourMeterVOs[i].accessories=data.data;
					}
				}
				
            }
        });
    }

	//删除拍照图片
	 $scope.deleteImgType = function(){
		 $scope.files=[];
		 $scope.fileName=null;
		  for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
					if($scope.watthourMeterVOs[i].id==$scope.watthourMeterID){
						$scope.watthourMeterVOs[i].accessories=null;
					}
				}
	    $(".preview-box").attr("src","./assets/img/upload_photo_img.png");
		 $scope.uploadImgDialog.close("");
		 $scope.uploadImgDialog=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
	 }
	
	//计算时间差是否大于6个月
	$scope.compare=function(date1,date2){
		 var newYear = date1.getFullYear();
        var newMonth =date1.getMonth() + 6;
        console.log(newMonth)
        if(newMonth >= 11){
            newYear += 1;
            newMonth -= 11;
            date1.setFullYear(newYear);
            date1.setMonth(newMonth-1);
        }
        else{
            date1.setFullYear(newYear);
            date1.setMonth(newMonth);
        }
        if(date1.getTime() > date2.getTime()){
            return true;//在六个月之内
        }
        else{
            return false;//大于六个月未填写抄表信息
        }
		};
		
	//报销时间与拍照时间相同判断是否填写原因	
	$scope.ack=function(){
		var cause=$("#cause").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause!=""&&cause!=null){//填写原因可以提交
			$scope.closeDialog("exceptionsHintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptionsExplain=cause;				
				}
			}
			$scope.submitDetail(); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
		//拍照电表读数小于报销电表当前读数判断是否填写原因	
	$scope.ack1=function(){
		var cause1=$("#cause1").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause1!=""&&cause1!=null){//填写原因可以提交
			$scope.closeDialog("exceptions1HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions1Explain=cause1;				
				}
			}
			$scope.submitDetail(); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//报账点单电表日均电费超1千元判断是否填写原因	
	$scope.ack2=function(){
		var cause2=$("#cause2").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause2!=""&&cause2!=null){//填写原因可以提交
			$scope.closeDialog("exceptions2HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions2Explain=cause2;				
				}
			}
			$scope.submitDetail(); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//报账点单电表日均电量超1千度判断是否填写原因	
	$scope.ack3=function(){
		var cause3=$("#cause3").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause3!=""&&cause3!=null){//填写原因可以提交
			$scope.closeDialog("exceptions3HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions3Explain=cause3;				
				}
			}
			$scope.submitDetail(); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//电损占比=稽核单电损电量/稽核单总电量>80%判断是否填写原因	
	$scope.ack4=function(){
		var cause4=$("#cause4").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause4!=""&&cause4!=null){//填写原因可以提交
			$scope.closeDialog("exceptions4HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions4Explain=cause4;				
				}
			}
			$scope.submitDetail(); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
		//报账点电表单价高于2.5元/度继续提交	
	$scope.ack5=function(){
			$scope.closeDialog("exceptions5HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.isContinue="继续提交";				
				}
			}
			$scope.submitDetail(); //调用电费明细提交，再次判断
			return;			
	}
		
    //电费明细提交
    $scope.submitDetail=function(){			
        var writedList = [];
        //查看有没有填完整的电表
        for(var index=0; index<$scope.watthourMeterVOs.length; index++){
            var meterVo = $scope.watthourMeterVOs[index];			
            $scope.checkNumber(meterVo);  //再次校验
            // 如果翻表为否，删除最大读数；
         //   if(!meterVo.whetherMeter){
          //      delete meterVo.maxReading;
         //   }
            if(!meterVo || !meterVo.belongStartTime || !meterVo.belongEndTime || !meterVo.dayAmmeter || (!meterVo.startAmmeter && meterVo.startAmmeter != 0) || (!meterVo.endAmmeter && meterVo.endAmmeter != 0) || (!meterVo.totalEleciric && meterVo.totalEleciric != 0) || (!meterVo.totalAmount && meterVo.totalAmount != 0) || (!meterVo.unitPrice && meterVo.unitPrice != 0) ){
                isEmpty = false;
            }else if((meterVo.totalAmount != null || meterVo.totalAmount != "0.00") && meterVo.dayAmmeter != null){
              //判断电费总金额(含税)是否大于合同总价包干值
			  if($scope.sumXPrice==""){
				  $scope.sumXPrice=null;
			  }
			  if($scope.sumXPrice!=null){
				if(meterVo.totalAmount>$scope.sumXPrice){			
					utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
					return;
				}
			  }
				//判断合同单价是否>直供电单价*120%，且无分级审批记录				
				if(((meterVo.unitPrice-$scope.zgdUnitPrice*1.2)>0)&&$scope.isUploadOverproof!="有"){
					alert("合同单价("+meterVo.unitPrice+")>直供电单价("+$scope.zgdUnitPrice+")*120%，稽核单生成失败，请于财务系统上传分级审批记录后再试！");
					return;
				}
				
				//判断报销周期是否在合同期限内
				var belongStartDates=new Date(meterVo.belongStartTime);//电费归属起始日期
				var belongEndDates=new Date(meterVo.belongEndTime);//电费归属终止日期
				var startDates=new Date($scope.startDate);//合同生效日期
				var endDates=new Date($scope.endDate);//合同失效日期
				if((belongStartDates.getTime()<startDates.getTime())
					||(belongStartDates.getTime()>endDates.getTime())
				||(belongEndDates.getTime()<startDates.getTime())
				||(belongEndDates.getTime()>endDates.getTime())){ //报销周期未在合同期限内不予报销，弹出提示框
					$scope.exceptions=ngDialog.open({
								template: './tpl/exceptions.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							return;		
				}
				
				//判断报账点电表单价是否高于2.5元/度
				if(meterVo.unitPrice-2.5>0){
					if(meterVo.isContinue==null){//未选择继续提交，弹出提示框
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					$scope.exceptions5HintDialog=ngDialog.open({
								template: './tpl/exceptions5HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							return;	
					}							
				}	
				
			  //判断报账点单电表日均电费是否超1千元
			   if((meterVo.totalAmount/meterVo.dayAmmeter)>1000){//报账点单电表日均电费超1千元，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions2Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions2HintDialog=ngDialog.open({
								template: './tpl/exceptions2HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}	
			   
			   //判断报账点单电表日均电量是否超1千度
			   if((meterVo.totalEleciric/meterVo.dayAmmeter)>1000){//报账点单电表日均电量超1千度，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions3Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions3HintDialog=ngDialog.open({
								template: './tpl/exceptions3HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
				
			   //判断电损占比=稽核单电损电量/稽核单总电量是否>80%
			   if((0-meterVo.electricLoss)==0){
				   meterVo.electricLoss=null;
			   }
			   if(meterVo.electricLoss!=null){
			   if((meterVo.electricLoss/meterVo.totalEleciric)>0.8){//电损占比=稽核单电损电量/稽核单总电量>80%，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions4Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions4HintDialog=ngDialog.open({
								template: './tpl/exceptions4HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
			   }
			   
			   //判断用户填写抄表信息时是否填写完整
				if(meterVo.theTakePhotosTime==""){
					meterVo.theTakePhotosTime=null;
				}
				if(meterVo.electricMeterDeg==""){
					meterVo.electricMeterDeg=null;
				}
				if(meterVo.takePhotosPeopleInfo==""){
					meterVo.takePhotosPeopleInfo=null;
				}
				if(meterVo.accessories==""){
					meterVo.accessories=null;
				}
			if((meterVo.theTakePhotosTime!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.electricMeterDeg!=null&&(meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.takePhotosPeopleInfo!=null&&(meterVo.electricMeterDeg==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.accessories!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null))){
					meterVo.theTakePhotosTime=null;
				}
			if((meterVo.electricMeterDeg!=null&&(meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null||meterVo.theTakePhotosTime==null))
				||(meterVo.takePhotosPeopleInfo!=null&&(meterVo.electricMeterDeg==null||meterVo.accessories==null||meterVo.theTakePhotosTime==null))
				||(meterVo.accessories!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null||meterVo.theTakePhotosTime==null))){				
					alert("请完善抄表信息!!");
					return;
				}
				
				//如果本次拍照时间为空或拍照图片为null,则判断是否已有六个月未填写抄表信息										
					if(meterVo.theTakePhotosTime==null||meterVo.accessories==null){
						var myDate = new Date();//获取系统当前时间
						var lastTime=new Date(meterVo.lastTakePhotosTime);	
						$rootScope.lastTimes=meterVo.lastTakePhotosTime;
						var result=$scope.compare(lastTime,myDate);
						if(result){
							//isEmpty = true;
							if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}
						}else{
							//alert("超过六个月未填写抄表信息");
							 $scope.wattTimeDialog=ngDialog.open({
								template: './tpl/wattTimeDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							//isEmpty = false;
							return;							
						}
							
				}else{
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
				
				//判断拍照电表读数是否小于报销电表当前读数				
				if(meterVo.electricMeterDeg!=null){
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
				if((meterVo.electricMeterDeg-meterVo.endAmmeter)<0){ //拍照电表读数小于报销电表当前读数，视为异常需填写原因说明					
					if(meterVo.exceptions1Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions1HintDialog=ngDialog.open({
								template: './tpl/exceptions1HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}					
				}else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}	
				}
				
				//判断报销时间与拍照时间是否相同
					if(meterVo.theTakePhotosTime!=null){
					var myDate = new Date();//获取系统当前时间
					var myDates=$scope.dataChange(myDate);
					var lastTime=meterVo.theTakePhotosTime;
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					//alert((myDates==lastTime)+"=-="+myDate+"---"+lastTime+"---"+meterVo.theTakePhotosTime+"=="+myDates);
					if(myDates==lastTime){
						if(meterVo.exceptionsExplain==null){//如果异常原因没有值，则弹出窗口让用户填写原因说明				
						 $scope.exceptionsHintDialog=ngDialog.open({
								template: './tpl/exceptionsHintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;								
						}else{//若已填写原因，则继续提交
							if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
						}						
					}else{
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
					}
					}
									
            }
        }
        // 多个电表
        if(!isEmpty && $scope.watthourMeterVOs.length > 1){
            for(var index=0; index < $scope.watthourMeterVOs.length; index++){
                var meterVo = $scope.watthourMeterVOs[index];
                // 其中某一个电表为未填写
                if(meterVo.totalAmount == null || meterVo.totalAmount=="0.00"){
                    continue;
                }else if(meterVo.dayAmmeter != null && meterVo.startAmmeter != null && meterVo.endAmmeter != null  && meterVo.totalEleciric !=null && meterVo.unitPrice != null && meterVo.lastTakePhotosTime!=null){                 				
						isEmpty = true;
						break;									                   
                }
            }
            if(isEmpty){
                if(isRightReg){
                    utils.confirm("当前报账点所对应的电表未填写完全，确定要提交吗？","",function(){
                       // $scope.closeDialog(csngDialog);
                       // setTimeout(utils.msg("已成功添加电表"),1000);
                    });
                    if(!$scope.flagSave  && $scope.flagSave != undefined) {  //查看修改页面时
                        $scope.singleDetail.watthourMeterVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }else {
                        $scope.resultData.watthourExtendVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }
                    $scope.countElectrictyTotPrice();    //计算电表总金额
                    return 1;
                }

            }else if((!isEmpty && isRightReg) || isEmpty){
                utils.msg("请至少完成一个电表的必填项再提交。");
            }
        // 单个电表
        }else if($scope.watthourMeterVOs.length == 1){
            if(isEmpty){
                if(isRightReg){
                   // $scope.closeDialog(csngDialog);
                   // utils.msg("已成功添加电表");
                    if(!$scope.flagSave  && $scope.flagSave != undefined) {  //查看修改页面时
                        $scope.singleDetail.watthourMeterVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }else {
                        $scope.resultData.watthourExtendVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }
                    $scope.countElectrictyTotPrice();    //计算电表总金额
                    return 1;
                }
            }else if((!isEmpty && isRightReg) || isEmpty){
                utils.msg("请至少完成一个电表的必填项再提交。");
            }
        }
    };



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
            template: './tpl/upload.html?time='+new Date().getTime(),
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
        var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ext)){
            utils.msg("请上传图片,类型必须是.gif,jpeg,jpg,png中的一种");
            return;
        }else {
            var objUrl = $scope.getObjectURL($scope.files);
            $(".preview-box").attr("src",objUrl);
            $scope.$apply();
        }

    }


    $scope.uploadFiles = [];    //已上传的文件

    // 上传发送
    $scope.uploadType = function(){
        if($scope.files.length == 0 || $scope.files == null){
            utils.msg("请上传图片！");
            return;
        }
        var base_url = CONFIG.BASE_URL;
        var formData = new FormData($( "#uploadForm" )[0]);
        $.ajax({
            url:base_url+'/fileOperator/fileUpload.do',
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
                    $scope.uploadFilesDetails = {
                        "id":"",
                        "upName":"",
                    }
                    $scope.uploadFilesDetails.id = key;
                    $scope.uploadFilesDetails.upName = data.data[key];
                    // $scope.resultData.attachmentId.push(key);
                    // $scope.fileNameImg = data.data[key];
                }
                $scope.uploadFiles.push($scope.uploadFilesDetails);
            }
        });
    }


    //查看上传的图片
    $scope.showDetailFiles = function(item){
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id;
        $scope.showUrls = showUrl;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/upload.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    }

    // 删除对应上传的图片
    $scope.deleteFiles = function(index){
        $scope.uploadFiles.splice(index,1);
    }

    console.log($scope.resultData.attachmentId );

    /**
     * 报账点名称管理
    */
   $scope.showAccountGrop = function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
        $scope.accountSiteDialog=ngDialog.open({
            template: './tpl/accountGrouplist.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

   };


   //获取报账单名称
    $scope.getApageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getAparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };


   /**
    * 获取报账组列表
    */
    $scope.getAccountName = function(name){

        angular.extend($scope.getAparams,{
            "name":name,
        })

        commonServ.queryAccount($scope.getAparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.getApageInfo.totalCount = data.data.totalRecord;
                $scope.getApageInfo.pageCount = data.data.totalPage;
                $scope.getAparams.page = data.data.pageNo;
                $scope.accountList = data.data.results;
            })
        });
    }


   /*
    *@新增或修改报账组弹框
    */

    $scope.addAccountGrop = function(item,flag){
        if(item != null) {
            $scope.isModifyAccount = true;  //修改
            $scope.isAddAccount = false;   //新增
            commonServ.queryAccountDetail(item.id).success(function (data) {
                utils.loadData(data,function (data) {
                    $scope.getAccountDetail = data.data;
                })
            });
        }else {
            $scope.isModifyAccount = false;
            $scope.isAddAccount = true;
        }
        $scope.accountGroupDialog=ngDialog.open({
            template: './tpl/addAccountGroup.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 450,
            scope: $scope,
        });
    }
    //保存提交的时候核销计算
    $scope.countMoney2=function(){
    	var noNum = $scope.singleDetail.adpv;//所有核销数据list
    	var totalAmount = $scope.singleDetail.totalAmount*1;//稽核单总金额(含税)
    	var allExpenseAmount = 0;//本次总共想要核销的金额
    	for(var i=0;i<noNum.length;i++){
    		allExpenseAmount += noNum[i].expenseAmount*1;
    	}
    	if(allExpenseAmount>totalAmount){
    		return 0;//表示核销超过总金额
    	}else{
    		return 1;//表示ok
    	}
    }
    
    
  //核销计算
    $scope.countMoney1=function(index){
    	//alert("计算核销金");
    	var noNum = $scope.singleDetail.adpv;//所有核销数据list
    	var expenseAmount = noNum[index].expenseAmount*1;//该次想要核销的金额
    	var surplusMoney = noNum[index].surplusMoney*1;//该预付单最多能核销的金额
    	var allSurplusMoney = 0;//所有预付单总共能核销的金额
    	var allExpenseAmount = 0;//本次总共想要核销的金额
    	for(var i=0;i<noNum.length;i++){
    		allSurplusMoney += noNum[i].surplusMoney*1;
    		allExpenseAmount += noNum[i].expenseAmount*1;
    	}
    	var totalAmount = $scope.singleDetail.totalAmount*1;//稽核单总金额(含税)
    	
    	if(expenseAmount*1 != expenseAmount){
    		utils.msg("请输入数字格式");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(expenseAmount<0){
    		utils.msg("请输入大于0的数字");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(expenseAmount>surplusMoney){
    		utils.msg("输入的核销金额大于该预付单能核销的金额");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(allExpenseAmount>allSurplusMoney){
    		utils.msg("总核销金额大于所有预付单能核销金额之和");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	if(allExpenseAmount>totalAmount){
    		utils.msg("总核销金额大于稽核单总金额");
    		$scope.singleDetail.adpv[index].expenseAmount=0;
    		return;
    	}
    	//设置本次想核销总金额(改在提交中设置)
    	//$scope.resultData.expenseTotalAmount=allExpenseAmount;
    	//未完待续*********************************************************************
    };



    /**
     * 保存报账组名称
     */
    $scope.accountObject = {// 新增的报账点名称
        "id":"",
        "name":""
    };
    $scope.addAccountNameSave = function(){
        $scope.accountObject = { // 新增的报账点名称
            "id":"",
            "name":$scope.accountObject.addName
        };

        commonServ.addAccountPage($scope.accountObject).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.accountGroupDialog.close("");
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }



    /**
     * 修改报账组名称
     */
    $scope.modifyAccountNameSave = function(){

        $scope.accountObject = {
            "id":$scope.getAccountDetail.id,
            "name":$scope.getAccountDetail.name
        }

        commonServ.modifyAccount($scope.accountObject).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.accountGroupDialog.close("");
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }


    /**
     * 删除报账组信息
     */
    $scope.deleteAccountSingle = function(item){

        commonServ.deleteAccount(item.id).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }



     /**
     * 选择报账组信息
     */
    $scope.choiceAccountGroup = function(){
        var obj= utils.getCheckedValsForRadio('#sysAccount');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        $scope.accountObject= JSON.parse(obj);
        if(!$scope.flagSave  && $scope.flagSave != undefined) {
            $scope.singleDetail.sysRgName = $scope.accountObject.name;
             $scope.singleDetail.sysRgID=$scope.accountObject.id;
        }else{
            $scope.resultData.sysRgID=$scope.accountObject.id;
        }
        $scope.accountSiteDialog.close("");
    }



/********************************************************新增稽核页面 保存、提交稽核单****************************************************************/

    //新增发票信息  -------
    $scope.addInvoiceVO=function(){
        if($scope.resultData.electrictyMidInvoices.length >= 1){
            $scope.disabled = false;  // 新添加发票  可
            $scope.resultData.electrictyMidInvoices.unshift({
                "taxAmount":0,   //税金金额
                "electricityAmount":0,
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
        }else if($scope.resultData.electrictyMidInvoices.length == 0 && $scope.resultData.totalAmount != "") {
            $scope.disabled = true;
            $scope.resultData.electrictyMidInvoices.unshift({
                "taxAmount":parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
        }else {
            utils.msg("当前电费总金额为0,请先选择报账点或添加电表明细！");
             return;
        }
    }




    //删除添加的发票
    $scope.removeInvoiceVO=function(index,item){

        if($scope.resultData.electrictyMidInvoices.length == 1){
            utils.msg("对不起，不能删除最后一张!");
            return;
        }else{
            $scope.resultData.electrictyMidInvoices.splice(index,1);
            if($scope.resultData.electrictyMidInvoices.length == 1){
                $scope.disabled = true;
                $scope.resultData.electrictyMidInvoices[0].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2) ; //电费金额不含税
                $scope.resultData.electrictyMidInvoices.invoiceId = $scope.invoiceVOs[0].invoiceId;
                $scope.resultData.electrictyMidInvoices[0].billTax = $scope.invoiceVOs[0].billTax;
                $scope.resultData.electrictyMidInvoices[0].billType = $scope.invoiceVOs[0].billType;
                $scope.resultData.electrictyMidInvoices[0].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[0].electricityAmount* ($scope.invoiceVOs[0].billTax/100)).toFixed(2);  //税金金额
            }
        }
    }


    // 选择发票种类
    $scope.selectInvoiceVOs = function(item,invoiceId,index){

        var invoice=null;
        var items1 =$scope.invoiceVOs[0];
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];			
            if(items.id==invoiceId){
                invoice=items;					
				$scope.invoiceVOs[0]=items;
				$scope.invoiceVOs[i]=items1;
                break;
            }
        }
		/*if(invoice.billType.length>4){
		if(invoice.billType.substring(invoice.billType.length-4,invoice.billType.length)=="(3%)"){
			alert("你选择的发票不能生成稽核单,请从新选择发票！");
		}
		}
		if(invoice.billType.length>5){
		if(invoice.billType.substring(invoice.billType.length-5,invoice.billType.length)=="(17%)"){
			alert("你选择的发票不能生成稽核单,请从新选择发票！");
		}
		}  */
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        if($scope.disabled){ // 只有一张发票且初始时
          //  item.electricityAmount= parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
           // "taxAmount": new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
          //  "electricityAmount": new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税
        item.electricityAmount = new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+""; //电费不含税

        }
       // item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
        item.taxAmount = new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 税金金额
        
        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
        var sumElectricityAmount = 0;
        for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
            sumElectricityAmount +=
            parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
        }
        sumElectricityAmount=sumElectricityAmount.toFixed(2);
        $scope.resultData.electrictyMidInvoices[index]=item;
		//$scope.resultData.electrictyMidInvoices[index].billType=item;
        $scope.checkElectricityAmount = sumElectricityAmount;

    }


    $scope.checkElectricityAmount = 0;  //校验发票金额 == 支付总金额
    $scope.editInit = 0;   //手动填写的初始电费金额
    //手动填写电费金额(不含税)
    $scope.changeInvoice=function(item,invoiceId,index){
        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.electricityAmount && item.electricityAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.electricityAmount && !reg.test(item.electricityAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.electricityAmount  && item.electricityAmount .length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else{
            $scope.editInit = item.electricityAmount;
            item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额

        // 手填自动算出其他的电费不含税
        //
        // if($scope.resultData.electrictyMidInvoices.length == 2){

        //     for(var j= 0; j<$scope.resultData.electrictyMidInvoices.length; j++){
        //         if(index != [j]){
        //             $scope.resultData.electrictyMidInvoices[j].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost-$scope.editInit-item.taxAmount)/(($scope.resultData.electrictyMidInvoices[j].billTax/100)+1)).toFixed(2);
        //             $scope.resultData.electrictyMidInvoices[j].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount*($scope.resultData.electrictyMidInvoices[j].billTax/100)).toFixed(2);


        //         }
        //     }

        // }



        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            var sumElectricityAmount = 0;
            for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            $scope.resultData.electrictyMidInvoices[index]=item;
            $scope.checkElectricityAmount = sumElectricityAmount;
        }
    }



    //取消返回页面
    $scope.returnPage = function(){
        $state.go('app.inputTariff',{
            'status':'tariff/sumbit'
        });
    }

	//保存选择的部门名
	$scope.selectDepartmentName = function(data){
		if(data==null){
			 utils.msg("请选择一个部门！");
			 return;
		}
		$scope.resultData.departmentName=data;
		utils.msg("你选择了部门:"+data);
	};

    // 保存新增稽核单
    $scope.saveElectricty=function(status){		
		if($scope.resultData.contractID==null){
			 utils.msg("请选择合同后再提交！");
            return;
		}
        if($scope.resultData.watthourExtendVOs.length == 0 ){
            utils.msg("电表信息,请认真填写后再提交！");
            return;
        }else if($scope.checkElectricityAmount && $scope.checkElectricityAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }else{
          /*  for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.viewMaxReading;
            } */
            if($scope.uploadFiles.length > 0){
                for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
                }
            }
            delete  $scope.resultData.sysSupplierName;   //526暂时隐藏
            $scope.resultData.status = status;
            $scope.resultData.productNature = $scope.siteObject.productNature;
            console.log("resultData" , angular.toJson($scope.resultData,true));
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
		/*	if($scope.resultData.electrictyMidInvoices.length>0){
				for(var i=0;i<$scope.resultData.electrictyMidInvoices.length;i++){
					 var items =$scope.resultData.electrictyMidInvoices[i];				 
				if(items.billType.length>4){
					if(items.billType.substring(items.billType.length-4,items.billType.length)=="(3%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				if(items.billType.length>5){
					if(items.billType.substring(items.billType.length-5,items.billType.length)=="(17%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				}
				
			} */
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }
            commonServ.saveElectricty($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $state.go('app.inputTariff',{
                        'status':'tariff/sumbit'
                    });
                });
            });
			$scope.sumXPrice=null;
        }
    }

    // 提交新增稽核单
    $scope.submitElectricty=function(status){
	
		if($scope.resultData.contractID==null){
			 utils.msg("请选择合同后再提交！");
            return;
		}
        if($scope.resultData.watthourExtendVOs.length == 0 ){
            utils.msg("电表信息,请认真填写后再提交！");
            return;
        }else if($scope.checkElectricityAmount && $scope.checkElectricityAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }else{
          /*  for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.viewMaxReading;

            } */
            if($scope.uploadFiles.length > 0){
                for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
                }
            }
            delete  $scope.resultData.sysSupplierName;   //526暂时隐藏
            $scope.resultData.status = status;
            $scope.resultData.productNature = $scope.siteObject.productNature;
            console.log("resultData" , angular.toJson($scope.resultData,true));
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
		/*	if($scope.resultData.electrictyMidInvoices.length>0){
				for(var i=0;i<$scope.resultData.electrictyMidInvoices.length;i++){
					 var items =$scope.resultData.electrictyMidInvoices[i];				 
				if(items.billType.length>4){
					if(items.billType.substring(items.billType.length-4,items.billType.length)=="(3%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				if(items.billType.length>5){
					if(items.billType.substring(items.billType.length-5,items.billType.length)=="(17%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				}
				
			} */
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if(!$scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }
            commonServ.saveElectricty($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
                    $state.go('app.auditTariff',{
                        'status':'tariff/audit'
                    });
                });
            });
				$scope.sumXPrice=null;
        }
    }


/********************************************************自维电费录入 查看、修改稽核单****************************************************************/

    /**
     * @自维电费录入修改------添加发票、手动添加、修改发票
     */
    $scope.editInvoiceVO = function(){
        if($scope.singleDetail.totalAmount != "" || !$scope.flagSave  && $scope.flagSave != undefined) {  //有数据才可添加发票
            $scope.isEditAudit = true;
            $scope.isAudit = false;
            if($scope.electrictyMidInvoices.length>=1){
                $scope.disabled = false;
                $scope.electrictyMidInvoices.unshift({
                    "taxAmount":0,   //税金金额
                    "electricityAmount":0,
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else{
                $scope.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
        }
    }


    /**
     * @async
     */
    //删除添加的发票
    $scope.removeEditInvoiceVO=function(index,item){

        if($scope.electrictyMidInvoices.length == 1){
            item.electricityAmount= parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
            utils.msg("对不起，不能删除最后一张!");
            return;
        }else{
            $scope.electrictyMidInvoices.splice(index,1);
            if($scope.electrictyMidInvoices.length == 1){
                $scope.disabled = true;
                $scope.electrictyMidInvoices[0].electricityAmount = parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / (($scope.electrictyMidInvoices[0].billTax/100)+1)).toFixed(2) ; //电费金额不含税
                $scope.electrictyMidInvoices.invoiceId = $scope.electrictyMidInvoices[0].invoiceId;
                $scope.electrictyMidInvoices[0].billTax = $scope.electrictyMidInvoices[0].billTax;
                $scope.electrictyMidInvoices[0].billType = $scope.electrictyMidInvoices[0].billType;
                $scope.electrictyMidInvoices[0].taxAmount = parseFloat($scope.electrictyMidInvoices[0].electricityAmount* ($scope.electrictyMidInvoices[0].billTax/100)).toFixed(2);  //税金金额
            }
        }
    }


    // 选择发票种类--修改电费录入
    $scope.selectEditInvoiceVOs = function(item,invoiceId,index){
        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率

        if($scope.electrictyMidInvoices.length ==1 && item.electricityAmount != 0){   // 只有一张发票时
            item.electricityAmount= parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
        }

        item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
        $scope.electrictyMidInvoices[index]=item;
        var sumElectricityAmount = 0;
        for(var j=0; j<$scope.electrictyMidInvoices.length; j++){
            sumElectricityAmount +=
            parseFloat($scope.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.electrictyMidInvoices[j].taxAmount);
        }
        sumElectricityAmount=sumElectricityAmount.toFixed(2);
        $scope.checkAmount = sumElectricityAmount;   //需要校验的金额

    }




    $scope.editInitAudit = 0;   //手动填写的初始电费金额
    $scope.checkAmount = 0;  // 修改校验支付总金额 == 发票金额 + 总金额不含税
    //手动填写电费金额(不含税)--修改电费录入
    $scope.changeEditInvoice=function(item,invoiceId,index){

        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.electricityAmount && item.electricityAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.electricityAmount && !reg.test(item.electricityAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.electricityAmount  && item.electricityAmount .length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else{
            $scope.editInitAudit  = item.electricityAmount;
            item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
            $scope.electrictyMidInvoices[index]=item;
            //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            // $scope.taxAmount = sumElectricityAmount;
            var sumElectricityAmount = 0;
            for(var j=0; j<$scope.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.electrictyMidInvoices[j].taxAmount);
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            $scope.checkAmount = sumElectricityAmount;   //需要校验的金额

        }

    }


	
     // 手动填写其他费用(电费录入修改)
    $scope.countTotal = function(){
		
		if($scope.singleDetail.otherCost==null||$scope.singleDetail.otherCost==""){
			$scope.singleDetail.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if($scope.singleDetail.otherCost && !reg.test($scope.singleDetail.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.singleDetail.otherCost && $scope.singleDetail.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.singleDetail.otherCost && $scope.singleDetail.otherCost < 0){
            utils.msg("数值不能为负。");
            return;
        }else if($scope.singleDetail.otherCost){
			 $scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmounts).add(new BigDecimal($scope.singleDetail.otherCost))+"";  //支付总金额
        $scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmounts).add(new BigDecimal($scope.singleDetail.otherCost))+""; //总金额（含税）+=其他金额

           // $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost).toFixed(2);  //支付总金额
        }else {
			$scope.singleDetail.paymentAmount = $scope.singleDetail.totalAmount;
			$scope.singleDetail.totalAmount = $scope.singleDetail.totalAmount;
			
           // $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount).toFixed(2);
        }
		if($scope.singleDetail.otherCost=="0"){
			$scope.singleDetail.otherCost=null;
		}
		
        if($scope.singleDetail.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
            $scope.singleDetail.electrictyMidInvoices.splice(0,1,{
				"taxAmount": new BigDecimal($scope.singleDetail.totalAmount).multiply(new BigDecimal($scope.singleDetail.electrictyMidInvoices[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
                "electricityAmount": new BigDecimal($scope.singleDetail.totalAmount).subtract(new BigDecimal($scope.singleDetail.totalAmount).multiply(new BigDecimal($scope.singleDetail.electrictyMidInvoices[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税

				//"taxAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
               // "electricityAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.singleDetail.electrictyMidInvoices[0].id,
                "billType":$scope.singleDetail.electrictyMidInvoices[0].billType,
                "billTax":$scope.singleDetail.electrictyMidInvoices[0].billTax,
            })
        }
    }



    /**
     * @ 电费录入页面-----修改保存稽核单
    */
    $scope.editZiweiElectricty=function(status){
    	//验证电表数据是否合法后再进行保存处理
    	var checkDianBiao = $scope.submitDetail();
    	if(checkDianBiao!=1){
    		return;
    	}
    	//原有数据
        $scope.resultData = {
            "id":$scope.editZiweiID,
            "status":status,
            "costCenterID":$scope.singleDetail.costCenterID,
            "towerSiteNumber":$scope.singleDetail.towerSiteNumber,
            "serialNumber":$scope.singleDetail.serialNumber,
            "productNature":$scope.singleDetail.productNature,
            "sysAccountSiteId":$scope.singleDetail.sysAccountSiteId,  //报账点ID
            "taxAmount":$scope.singleDetail.taxAmount,
            "otherCost":$scope.singleDetail.otherCost,
            "totalAmount":$scope.singleDetail.totalAmount,
            "paymentAmount":$scope.singleDetail.paymentAmount,
            "sysSupplierID":$scope.singleDetail.supplierID,
            "attachmentId":[],
            "expenseTotalAmount":$scope.singleDetail.expenseTotalAmount,
            "adpv":$scope.singleDetail.adpv,
            "watthourExtendVOs":$scope.singleDetail.watthourMeterVOs,
            "electrictyMidInvoices":$scope.electrictyMidInvoices,
            "sysRgID":$scope.singleDetail.sysRgID,
            "contractID":$scope.singleDetail.contractID,  //合同ID
			"departmentName":$scope.singleDetail.departmentName, //部门名
			"overproofReasons":$scope.singleDetail.overproofReasons,
            "remark":$scope.singleDetail.remark,
            "payType":$scope.singleDetail.payType,
            "professional":$scope.singleDetail.professional
        }
        if($scope.checkAmount && $scope.checkAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }
        for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
            var obj= $scope.resultData.watthourExtendVOs[i];
                delete  obj.reimbursementDate;
                delete  obj.status;
                delete  obj.id;
                delete  obj.code;
                delete  obj.paymentAccountCode;
                delete  obj.ptype;
                delete  obj.rate;
                delete  obj.maxReading;
                delete  obj.currentReading;
                delete  obj.belongAccount;
                delete  obj.damageNum;
                delete  obj.damageDate;
                delete  obj.damageInnerNum;
                delete  obj.damageMeterNum;
                delete  obj.reimbursementDateStr;
                delete  obj.currentReadingStr;
                delete  obj.accountSiteId;
                delete  obj.accountName;
                delete  obj.oldFinanceName;
                delete  obj.mid;
                delete  obj.count;
                delete  obj.cityId;
                delete  obj.countyId;
                delete  obj.price;
                delete  obj.updateTimeStr;
                delete  obj.viewMaxReading;
        }
        // 附件信息
        if($scope.singUploadFiles){
            for(var fileId=0; fileId < $scope.singUploadFiles.length; fileId++){
                $scope.resultData.attachmentId.push($scope.singUploadFiles[fileId].id);
            }
        }
        if($scope.singleDetail.productNature == "自维") {
            $scope.resultData.productNature = "0";
        }else {
            $scope.resultData.productNature = "1";
        }

        delete $scope.resultData.name;
        console.log("resultData" , angular.toJson($scope.resultData,true));
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
            utils.msg("备注信息不能超过150个字符。");
            return;
        }
       
        if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
            utils.msg("支付总金额不能为负。");
            return;
        }
        if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }
        for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
            var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
            if(metert && metert < 0){
                utils.msg("数值不能为负。");
                return;
            }else if(metert && !reg.test(metert)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if(metert  && metert.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
        }
        commonServ.modifyElectricty($scope.resultData).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.closeDialog('showZweiDialog');
                $scope.getZiweiData();
            });
        });

    }


/********************************************************自维电费稽核 查看、修改稽核单****************************************************************/

        /**
         * @ 电费稽核页面  修改保存稽核单
        */

        $scope.editZiweiAudit=function(){
        	//验证电表数据是否合法后再进行保存处理
        	var checkDianBiao = $scope.submitDetail();
        	if(checkDianBiao!=1){
        		return;
        	}
        	// debugger;
        	//原有数据
            $scope.resultData = {
                "instanceId":$scope.instanceId,
                "id":$scope.editZiweiID,
                "status":status,
                "costCenterID":$scope.singleDetail.costCenterID || null,
                "towerSiteNumber":$scope.singleDetail.towerSiteNumber,
                "serialNumber":$scope.singleDetail.serialNumber,
                "sysAccountSiteId":$scope.singleDetail.sysAccountSiteId,  //报账点ID
                "otherCost":$scope.singleDetail.otherCost,
                "totalAmount":$scope.singleDetail.totalAmount,
                "paymentAmount":$scope.singleDetail.paymentAmount,
                "sysSupplierID":$scope.singleDetail.supplierID || null,
                "attachmentId":[],
                "adpv":$scope.singleDetail.adpv,//核销数据
                "expenseTotalAmount":$scope.singleDetail.expenseTotalAmount,//总共核销金额
                "watthourExtendVOs":$scope.singleDetail.watthourMeterVOs,
                "electrictyMidInvoices":$scope.electrictyMidInvoices,
                "remark":$scope.singleDetail.remark,
                "contractID":$scope.singleDetail.contractID,  //合同ID
				"departmentName":$scope.singleDetail.departmentName, //部门名
				"overproofReasons":$scope.singleDetail.overproofReasons,
                "sysRgID":$scope.singleDetail.sysRgID,
                "isOnline":$scope.singleDetail.isOnline
            }
            if($scope.checkAmount && $scope.checkAmount!=$scope.resultData.paymentAmount) {
                utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
                return;
            }
            for(var i=0; i<$scope.singleDetail.watthourMeterVOs.length; i++){
                if($scope.singleDetail.watthourMeterVOs[i].whetherMeter == "是") {
                    $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "1";
                }else {
                    $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "0";
                }
            }
            // 附件信息
            if($scope.singUploadFiles){
                for(var fileId=0; fileId < $scope.singUploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.singUploadFiles[fileId].id);
                }
            }
            // 电表信息
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.price;
                    delete  obj.updateTimeStr;
                    delete  obj.viewMaxReading;

            }
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }

            commonServ.editAduit($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.closeDialog('showZweiAuditDialog');
                    $scope.getZwAuditDetail();
                });
            });
        }
      //直接获取电表页面并自动判断显示类型
     //   setTimeout($scope.getDianBiaoDetail(),3000);
        

}]);


/**
 *  综合自维新增稽核单(电表在外) addOrUpdateZAuditCtrl 公用模块（包含电费录入--新增稽核单   电费录入--修改、查看稽核单   电费稽核---修改、查看稽核单）
 */
app.controller('addOrUpdateZAuditCtrl_1', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

    /**
     * [resultData description] 新建稽核单数据
     * @type {Object}
     */
    $scope.resultData={

        "serialNumber":new Date().getTime(),
        "sysAccountSiteId":"",//报账点ID
        "status":"",//状态
        "productNature":"",
        "costCenterID":"",//成本中心ID
        "towerSiteNumber":"",//铁塔站点编号
        "shareElectricity":"",//分摊电费金额
        "invoiceId":"",//发票类型ID
        "taxAmount":"",//税金金额
        "electricityAmount":"",//电费金额
        "otherCost":"",//其他费用
        "totalAmount":"",//总金额
        "expenseTotalAmount":0,//核销总金额
        "paymentAmount":"",//支付总金额
        "attachmentId":[],//附件　ids
        "watthourExtendVOs":[],//各电表信息,
        "sysSupplierID":"",//供应商ID
        "electrictyMidInvoices":[],  // 自维电费金额及发票信息
        //"sysSupplierName":"",//供应商名称
		"supplierName":"",//供应商名称
        "sysRgID":"", // 报账组名称
        "contractID":"", //合同ID
		"departmentName":"", //部门名
		"overproofReasons":"",//超标原因
        "remark":"",
        "payType":-1,//缴费类型
        "professional":"",//所属专业
        "auditType":1//稽核类型

    }


/********************************************************新增稽核和电费录入公共部分****************************************************************/
    // 电费录入修改稽核单状态
    $scope.isAudit = true;        //修改稽核單狀態
    $scope.isEditAudit = false;   //查看稽核單狀態

    //发票信息
    $scope.invoiceVOs=[];
    //获取稽核单号、地市、区县、发票信息
    commonServ.getInputElectrictyAddInfo().success(function(data){
        $scope.resultData.serialNumber=data.serialNumber;  // 稽核单号
        $scope.resultData.areas=data.areas;                // 地市
        $scope.resultData.counties=data.counties;          // 区县
        $scope.invoiceVOs=data.invoiceVOs;                 // 发票信息
    });
    


    //获取成本中心列表
    $scope.costCeterVOs=[];
    commonServ.getInputElectrictyCostCeterVOsInfo().success(function(data){
        utils.loadData(data,function(data){
            if(data.data.length>0){
                $scope.costCeterVOs=data.data;
                $scope.resultData.costCenterID = $scope.costCeterVOs[0].id;
            }
        })
    });

	 //保存选择的成本中心
	$scope.selectCostCenter = function(data){		
		if(data==null){
			 utils.msg("请选择一个成本中心！");
			 return;
		}
		$scope.resultData.costCenterID=data;   //保存选择的成本中心ID
	};
    
    //选择缴费类型
    $scope.selectpayType=function(payType){
    	$scope.resultData.payType=payType;
    	if(payType<=1){
    		$scope.resultData.professional="无线";
    	}else{
    		$scope.resultData.professional="全业务";
    	}
    };


    //获取报账单名称
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
    
    //核销计算
    $scope.countMoney=function(){
    	if($scope.resultData.expenseTotalAmount==null ||$scope.resultData.expenseTotalAmount==''){
    		$scope.resultData.expenseTotalAmount=0;
    		$scope.resultData.paymentAmount=$scope.resultData.totalAmount;
    	}
    	if(parseFloat($scope.resultData.expenseTotalAmount)>parseFloat($scope.adpv.surplusMoney)){
    		utils.msg("核销金大于剩余预付金额")
    	}else if(parseFloat($scope.resultData.expenseTotalAmount)>parseFloat($scope.resultData.paymentAmount)){
    		utils.msg("核销金大于这次报销金")
    	}else{
    		$scope.resultData.paymentAmount=($scope.resultData.paymentAmount-$scope.resultData.expenseTotalAmount).toFixed(2);
    	}
    };


    //获取报账点列表
    $scope.getData=function(siteName){
        angular.extend($scope.params,{
            "cityId":$rootScope.userCityId,
            "countyId":$rootScope.userCountyId,
            "siteName":$("#siteName").val(),
            // "accountName":$scope.accountName,
            // "accountAlias":$scope.accountAlias,
            // "oldFinanceName":$scope.oldFinanceName,
            // "resourceName":$scope.resourceName
        })
        commonServ.querySiteInfoPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    $scope.confvv = [];  //报账点
    $scope.confs = []; //供货商

    // 获取报账点弹框
    $scope.siteObject={};   //返回countyId
    $scope.getAccountSite=function(){
        $scope.accountSiteDialog=ngDialog.open({
            template: './tpl/reimburDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }


    // 查询是否包干  产权性质
    $scope.getIsClud=function(siteId){
        commonServ.getInputElectrictyDetail(siteId).success(function (data) {
            if(data.isClud == 1){
                $scope.isCludInfoDetail = "包干";
            }else if(data.isClud == 0){
                $scope.isCludInfoDetail = "不包干";
            }else {
                $scope.isCludInfoDetail = "";
            }
        });
    }



    // 选择报账点名称  新增稽核、电费录入修改
    $scope.choiceAccountSite=function(){
		$scope.resultData.contractID=null;
        $scope.isAudit = false;
        $scope.isEditAudit = true;
        var obj= utils.getCheckedValsForRadio('#siteList');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        $scope.siteObject= JSON.parse(obj);
		$rootScope.AccountSiteId=$scope.siteObject.id;//保存报账点id
		$rootScope.AccountSiteName=$scope.siteObject.accountName;//保存报账点名称
        $scope.resultData.sysAccountSiteId=$scope.siteObject.id;//报账点id
       // $scope.getIsClud($scope.siteObject.id);  //是否包干
       // $scope.getSuppliers($scope.siteObject.id); //查询对应的供应商
		$scope.getContract($scope.siteObject.id); //查询对应的合同id
        if($scope.siteObject.productNature == 0) {
            $scope.productNatureType = "自维";
        }else {
            $scope.productNatureType = "塔维";
        }

        // 修改页面
        if(!$scope.flagSave  && $scope.flagSave != undefined) {
            $scope.singleDetail.sysAccountSiteId = $scope.siteObject.id;         // 报账点ID
            $scope.singleDetail.accountName = $scope.siteObject.accountName;     //报账点名称
            $scope.singleDetail.accountAlias = $scope.siteObject.accountAlias;  //报账点别名
            //选择报账点后清空页面上原有数据
            $scope.singleDetail.paymentAmount = "";   //支付总金额
            $scope.singleDetail.otherCost = "";       //其他费用
            $scope.singleDetail.totalAmount = "";     //总金额
            $scope.singleDetail.sysSupplierName = ""; //供货商名称
            if($scope.electrictyMidInvoices.length >= 0){
                $scope.electrictyMidInvoices = [];  //发票信息
            }
            if($scope.watthourMeterVOs &&　$scope.watthourMeterVOs.length > 0){
                $scope.watthourMeterVOs = [];
            }

        }else {
             //清空原有数据 新增
            $scope.resultData.paymentAmount = "";   //支付总金额
            $scope.resultData.otherCost = "";       //其他费用
            $scope.resultData.totalAmount = "";     //总金额
            $scope.resultData.sysSupplierName = ""; //供货商名称
            if($scope.resultData.electrictyMidInvoices.length >= 0){
                $scope.resultData.electrictyMidInvoices = [];  //发票信息
            }
            $scope.accountObject.name = ""; // 报账组信息
            if($scope.resultData.watthourExtendVOs &&　$scope.resultData.watthourExtendVOs.length > 0){
                $scope.resultData.watthourExtendVOs = [];
            }
            // 清空页面上的电表数据信息
            if($scope.watthourMeterVOs && $scope.watthourMeterVOs.length > 0){
                $scope.watthourMeterVOs = [];
            }
        }

        $scope.closeDialog('accountSiteDialog');
    }



    //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }


     //根据报账点查找对应的供应商（与报账点的缴费类型与所属专业）
    $scope.getSuppliers=function(countyId){
    	//查找缴费类型
        $scope.getPayTypeById(countyId);
        commonServ.getSupplierName(countyId).success(function(data){
            utils.loadData(data,function(data){
                if(data.data == null){
                    // utils.msg("该站点无供应商信息,请选择一个默认供应商");
                    return;
                }else {
                    $scope.resultData.sysSupplierName=data.data.name;
                    $scope.resultData.sysSupplierID=data.data.id;
                    //查找供应商的预付单
                    $scope.getPreBySuId($scope.resultData.sysSupplierID);
                }
            })
        });
    }
    
    $scope.flagg=false;
  //查找供应商的预付单
    $scope.getPreBySuId=function(suId){
    	commonServ.getPreBySuId(suId).success(function(data){
    		$scope.adpv=data.data;
    		if($scope.adpv!=null){
    			$scope.flagg=true;
    		}else{
    			$scope.flagg=false;
    		}
    		
    	})
    }
    
    $scope.payTypeFlag=false;
  //查找缴费类型
    $scope.getPayTypeById=function(countyId){
    	commonServ.getPayTypeById(countyId).success(function(data){
    		if(data.data!=null){
    			$scope.resultData.payType=data.data.payTypee;
        		if($scope.resultData.payType>=0){
        			 $scope.payTypeFlag=true;
        		}else{
        			$scope.payTypeFlag=false;
        		}
        		$scope.resultData.professional=data.data.professional;
    		}else{
    			$scope.payTypeFlag=false;
    		}
    		
    	})
    }
    

     //获取供应商名称
    $scope.suPpageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getSparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 供应商搜索列表
    $scope.getData2=function(supplierName,a){
    	if(a){
   		 $scope.getSparams = {
	        pageSize: 10,//每页显示条数
	        pageNo: 1,// 当前页
   		 };
    	}

        angular.extend($scope.getSparams,{
            //"cityId":$scope.cityId,
			"cityId":$rootScope.userCityId,
            "only":"1",
            "name": supplierName,
            //"accountName":$scope.accountName,
            //"accountAlias":$scope.accountAlias,
            //"oldFinanceName":$scope.oldFinanceName,
            //"resourceName":$scope.resourceName
        })

        commonServ.querySupplier($scope.getSparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.suPpageInfo.totalCount = data.data.totalRecord;
                $scope.suPpageInfo.pageCount = data.data.totalPage;
                $scope.getSparams.page = data.data.pageNo;
                $scope.suppliers = data.data.results;
            })
        });
    }



    // 供应商弹出框
    $scope.choiceSupplierDialog=function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
        $scope.choiceSupplierDialogs=ngDialog.open({
            template: './tpl/supplierDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
            scope: $scope,
        });
    }


    // 确定选择供应商
    $scope.choiceSupplier=function(){
        var obj= utils.getCheckedValsForRadio('#SupplieList');
        if(obj==null){
            utils.msg("请选择一个供应商！");
            return;
        }
        obj= JSON.parse(obj);
        $scope.resultData.sysSupplierName=obj.name; //供应商名称
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            $scope.singleDetail.supplierName = obj.name;      //修改稽核单页面供货商数据
            $scope.singleDetail.sysSupplierID=obj.id;
        }
        $scope.resultData.sysSupplierID=obj.id;   //改变后的供应商id
        $scope.closeDialog("choiceSupplierDialogs");
    }
    
    
    
    //根据报账点查找对应的合同ID
    //根据报账点查找对应的合同ID
    $scope.getContract=function(countyId){
		//(匹配上次录入)
        commonServ.getContractName(countyId).success(function(data){
            utils.loadData(data,function(data){
                if(data.data == null){
/*                	debugger;
                    // utils.msg("该站点无合同信息,请选择一个默认合同id");
                	//根据报账点查找站点--查找白名单状态是否是白名单
                	commonServ.getWhite(countyId).success(function(data){
                		if(data.data!='否'){
                			//白名单状态
                			$scope.white=data.data;
                			$scope.whiteType=1;
                			$scope.resultData.contractID=data.data.contractName;
                			var ht=new Array();
                			ht.push(data.data.contractId);
                			$scope.contractIds=ht;
                			//选择合同下的合同
                			$rootScope.contractPrice=data.data.price;
                		}else{
                			$scope.whiteType=0;//非白名单
                			$rootScope.contractPrice="";
                			return;
                		}
                	});*/
                	return;
                }else {
                	$scope.whiteType=0;
                	$scope.resultData.costCenter=data.data.costCenter;//匹配上次录入的成本中心
					$scope.resultData.costCenterID=data.data.costCenterID;//保存上次录入的成本中心ID
 					$scope.accountObject.name=data.data.sysRgName;//匹配上次录入的报账组名称
					$scope.resultData.sysRgID=data.data.sysRgID;//保存上次录入的报账组id
					$scope.departmentName=data.data.departmentName;//匹配上次录入的部门名
					$scope.departmentName1=data.data.departmentName;//匹配上次录入的部门名显示在录入页面
					$scope.resultData.departmentName=data.data.departmentName;//保存上次录入的部门名
                }
            })
        });
    		//匹配报账点对应的合同
    		commonServ.getContract(countyId).success(function(data){
                utils.loadData(data,function(data){
                	// debugger;
                    if(data.data == null||data.data==""){
                    	// debugger;
                    	//根据报账点查找站点--查找白名单状态是否是白名单
                    	commonServ.getWhite(countyId).success(function(data){
                    		if(data.data!='否'){
                    			//白名单状态
                    			$scope.white=data.data;
                    			$scope.whiteType=1;
                    			/*$scope.resultData.contractID=data.data.contractName;*/
                    			var ht=new Array();
                    			ht.push(data.data.contractId);
                    			$scope.contractIds=ht;
                    			//选择合同下的合同
                    			$rootScope.contractPrice=data.data.price;
                    		}else{
                    			$scope.whiteType=0;//非白名单
                    			$scope.contractIds="";
            					alert("该报账点无合同数据,不允许报销,请确认合同信息上传财务系统后再试！");					
                                return;				
                    		}
                    	});
                    }else {                         	
                    	$scope.contractIds=data.data;//获取报账点对应的合同id
                    }
                })
            });
    }
	
	
	//未选择报账点选择合同是判断
	$scope.judgeContract = function(){	
		var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
			return;		
	}
	 //保存选择的合同
	$scope.selectContract = function(data){		
		if(data==null){
			 utils.msg("请选择一个合同！");
			  $scope.resultData.contractID=null;
			 return;
		}
		if(data!=null||data!=""){
		$scope.resultData.contractID=data;   //保存选择的合同
		$scope.contractInfos(data);//根据合同id查询对应的合同信息
		utils.msg("你选择了合同:"+data);
		}
	};

     //获取合同名称
    $scope.coNpageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getSparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    // 合同信息搜索列表
    $scope.getData3=function(contractName,a){
    	if(a){
   		 $scope.getSparams = {
	        pageSize: 10,//每页显示条数
	        pageNo: 1,// 当前页
   		 };
    	}

        angular.extend($scope.getSparams,{
            //"cityId":$scope.cityId,
            "only":"1",
            "name": contractName,
            //"accountName":$scope.accountName,
            //"accountAlias":$scope.accountAlias,
            //"oldFinanceName":$scope.oldFinanceName,
            //"resourceName":$scope.resourceName
        })

        commonServ.queryContract($scope.getSparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.coNpageInfo.totalCount = data.data.totalRecord;
                $scope.coNpageInfo.pageCount = data.data.totalPage;
                $scope.getSparams.page = data.data.pageNo;
                $scope.Contract = data.data.results;
            })
        });
    }

    // 合同信息弹出框
    $scope.choiceContractDialog=function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){          
		   utils.msg("请先选择报账点！");
            return;
        }
        $scope.choiceContractDialogs=ngDialog.open({
            template: './tpl/contractDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
            scope: $scope,
        });
    }


    // 确定选择合同ID
    $scope.choiceContract=function(){
        var obj= utils.getCheckedValsForRadio('#SupplieList');
        if(obj==null){
            utils.msg("请选择一个合同！");
            return;
        }
        obj= JSON.parse(obj);
        $scope.resultData.contractName=obj.name; //合同名称
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            $scope.singleDetail.contractName = obj.name;      //修改稽核单页面合同数据
            $scope.singleDetail.contractID=obj.id;
        }
        $scope.resultData.contractID=obj.id;   //改变后的合同id
        $scope.closeDialog("choiceContractDialogs");
    }

	//根据合同id查询对应的合同信息
	$scope.contractInfos=function(contractId){
		var cityId=$rootScope.userCityId;//地市ID
		var countyId=$rootScope.userCountyId;//区县id
		commonServ.getContractInfo(contractId,cityId,countyId).success(function(data){

            utils.loadData(data,function(data){  
			$scope.vendorName=data.data.vendorName;//供应商名称
			$scope.resultData.sysSupplierID=data.data.supplierId;//保存供应商ID
			$scope.resultData.supplierName=data.data.vendorName;//保存供应商名称
			 //查找供应商的预付单（通过供应商ID--表中的code字段）
            $scope.getPreBySuId(data.data.vendorId);
			$scope.startDate=data.data.executionBeginDate; //合同生效日期
			$scope.endDate=data.data.executionEndDate; //合同失效日期
			$scope.assetManagementSiteName=data.data.assetManagementSiteName;//资管站点名称
			if(data.data.unitPrice==null||data.data.unitPrice==""){//区域直供电单价
				$scope.zgdUnitPrice="0";
			}else{
				$scope.zgdUnitPrice=data.data.unitPrice; //区域直供电单价
			}
			//$scope.isUploadOverproof=data.data.isUploadOverproof;//是否上传超标审批记录( 有(0)、无(1))
			if(data.data.isUploadOverproof=="0"){ //上传了超标审批记录
				$scope.isUploadOverproof="有"; 
			}else if(data.data.isUploadOverproof=="1"){ //未上传超标审批记录
				$scope.isUploadOverproof="无";
			}else{
				$scope.isUploadOverproof="";
			}
			if(data.data.contractNumber==null){
				$scope.contractNumber="无";//合同编号
			}else{
				$scope.contractNumber=data.data.contractNumber;//合同编号
			}
			$scope.priceOrLumpSumPrice=data.data.priceOrLumpSumPrice;//单价或包干价(大于20即包干价)
			if(data.data.priceOrLumpSumPrice>20){
				$scope.xIsClud="bg";//设置状态为包干
				$scope.sumXPrice=data.data.priceOrLumpSumPrice;//包干价
			}else{
				$scope.xIsClud="bbg";//设置状态为不包干
				$scope.xPrice=data.data.priceOrLumpSumPrice;//单价
			}			
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

    
    
  //统一时间
    $scope.countTime=function(){
    	for(var i=0;i<$scope.watthourMeterVOs.length;i++){
    		$scope.bbelongStartTime=$("#belongStartTime").val();
    		$scope.bbelongEndTime=$("#belongEndTime").val();
    		$scope.watthourMeterVOs[i].belongStartTime=$scope.bbelongStartTime;
    		$scope.watthourMeterVOs[i].belongEndTime=$scope.bbelongEndTime;
    		if($("#belongStartTime").val()!=""&&$("#belongEndTime").val()!=""){
    			 $scope.countDays($scope.watthourMeterVOs[i],i);
    		}
    	}
    };

    //计算用电天数
    $scope.countDays=function(item, index){
    	// debugger;
        if(!item.belongStartTime || !item.belongEndTime){
            return;
        }
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.exceptions3Explain=null;//初始化异常原因(报账点单电表日均电量超1千度)
		item.isContinue=null;//初始化状态(是否继续提交)
        item.dayAmmeter= utils.getDays(item.belongStartTime,item.belongEndTime) + 1;
        $scope.watthourMeterVOs[index]=item;
    }

	//电损改变时重新判断电损占比
	$scope.bElectricLoss=function(item, index){
		
		if(item.electricLoss==""||item.electricLoss==null){
			item.electricLoss=0;
		}
		item.totalEleciric=parseFloat($scope.totalEleciricDS)+parseFloat(item.electricLoss)+"";
		item.exceptions4Explain=null;//初始化异常原因(电损占比=稽核单电损电量/稽核单总电量>80%)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
		if($scope.sumXPrice==null||$scope.sumXPrice==""){
        $scope.countElectrictyItemPrice(item,index);
		}else if(($scope.sumXPrice!=null||$scope.sumXPrice!="")&&(item.totalAmount!=null||item.totalAmount!="")){
			$scope.backcalculationPrice(item,index);
		}
	}
	
	//本次拍照时间改变时重新判断报销时间与拍照时间是否相同
	$scope.bTheTakePhotosTime=function(item, index){
		item.exceptionsExplain=null;//初始化异常原因(报销时间与拍照时间相同)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
	}
		
	//拍照电表读数改变时重新判断拍照电表读数是否小于报销电表当前读数
	$scope.bElectricMeterDeg=function(item, index){
		item.exceptions1Explain=null;//初始化异常原因(拍照电表读数小于报销电表当前读数)
		item.isContinue=null;//初始化状态(是否继续提交)
		$scope.watthourMeterVOs[index]=item;
	}

    //计算电表的用电量
    $scope.countPowerSize=function(item,index){
         //如果翻表选择‘是’
        if(item.whetherMeter == 1 && (item.maxReading || item.maxReading == 0 )){
           item.viewMaxReading = item.maxReading;
        }else if(!item.maxReading && item.maxReading != 0){
            item.whetherMeter == 0;
            item.viewMaxReading = "";
        }else{
            // $scope.isSelect = false;
            // $scope.isSelected = true;
            item.viewMaxReading = "";
        }
        if(!item.startAmmeter ){
            item.startAmmeter = null;
        }
        if(!item.endAmmeter){
            item.endAmmeter = null;
        }
        var sum=( item.endAmmeter - item.startAmmeter); //未翻表
        //翻表
        if(item.whetherMeter==1 && (item.maxReading || item.maxReading == 0 )){
            sum= parseFloat(sum+item.maxReading+1); //翻表总电量 = 最大读数 + 当前止度读数 - 当前起度读数 + 1
        }

        if(isNaN(parseFloat(sum))){
            $scope.checkNumber(item);
            return;
        }
		item.exceptions1Explain=null;//初始化异常原因(拍照电表读数小于报销电表当前读数)
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.exceptions3Explain=null;//初始化异常原因(报账点单电表日均电量超1千度)
		item.exceptions4Explain=null;//初始化异常原因(电损占比=稽核单电损电量/稽核单总电量>80%)
		item.isContinue=null;//初始化状态(是否继续提交)
		if(item.electricLoss==null||item.electricLoss==""){
			item.electricLoss="0";
		}
        item.totalEleciric= (parseFloat(sum)+parseFloat(item.electricLoss)).toFixed(2);
		$scope.totalEleciricDS=parseFloat(sum).toFixed(2);
        $scope.watthourMeterVOs[index]=item;
		if($scope.sumXPrice==null||$scope.sumXPrice==""){
        $scope.countElectrictyItemPrice(item,index);
		}else if(($scope.sumXPrice!=null||$scope.sumXPrice!="")&&(item.totalAmount!=null||item.totalAmount!="")){
			$scope.backcalculationPrice(item,index);
		}
		/*$scope.submitDetail();	//电表同步稽核单数据
*/    }

	//反算单价
    $scope.backcalculationPrice=function(item,index){
		if(item.totalAmount>$scope.sumXPrice){			
			utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
		}
        var price; //单个电表总金额
		item.exceptions2Explain=null;//初始化异常原因(报账点单电表日均电费超1千元)
		item.isContinue=null;//初始化状态(是否继续提交)
		price=item.totalAmount/item.totalEleciric;
		item.unitPrice=	parseFloat(price).toFixed(2);//单价	
        item.backcalculationPrice = parseFloat(price).toFixed(2);//反算单价
        $scope.watthourMeterVOs[index]=item;
    };

    // 计算单个电表的金额
    $scope.countElectrictyItemPrice=function(item,index){
        var total; //单个电表总金额
     /*   if($scope.invoiceVOs.length == 0){
            utils.msg("目前暂无税率信息，请联系管理员后配置后再进行计算!");
            return;
        }else if($scope.invoiceVOs[0].billTax == "0"){
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice;
        }else {
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice*($scope.invoiceVOs[0].billTax/100);
        } */
		if($scope.xIsClud=="bbg"){
			item.unitPrice=$scope.xPrice;//单价
		}
		total=item.totalEleciric*item.unitPrice;
        if(isNaN(parseFloat(total))){
            $scope.checkNumber(item);
            return;
        }
        item.totalAmount= parseFloat(total).toFixed(2);
        $scope.checkNumber(item);
        $scope.watthourMeterVOs[index]=item;
    };


    $scope.disabled = false;  // 判断发票信息是否能填写
    //计算电费总金额
    $scope.countElectrictyTotPrice=function(){
        var sum=0;
        for(var  i=0; i<$scope.watthourMeterVOs.length; i++){
            var item = $scope.watthourMeterVOs[i];
            if(item.totalAmount != null){
                sum += parseFloat(item.totalAmount);
            }
        }
        $scope.resultData.totalAmount= sum.toFixed(2);    //各电表的总金额
		$scope.totalAmount = sum.toFixed(2);//用于填写其他费用后计算总金额
        $scope.resultData.paymentAmount = sum.toFixed(2); // 支付总金额
        // 录入电费页面修改
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            if(isNaN(parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost))){
                return;
            }
          //  $scope.singleDetail.paymentAmount= parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost).toFixed(2);//页面上的数据
          //  $scope.singleDetail.totalAmount = $scope.resultData.totalAmount;  // 页面显示的数据
			
			//$scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.singleDetail.otherCost))+"";  //支付总金额
            $scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmount)+"";  //支付总金额
            //$scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.singleDetail.otherCost))+""; //总金额（含税）+=其他金额
            $scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmount)+""; //总金额（含税）+=其他金额

            //$scope.editInvoiceVO(); //电费录入页面-----计算发票税金金额
            if($scope.resultData.electrictyMidInvoices.length==0){
                $scope.resultData.electrictyMidInvoices.unshift({
                    "taxAmount":parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else {
                $scope.resultData.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
         //发票修改时修改   $scope.electrictyMidInvoices = $scope.resultData.electrictyMidInvoices; //电费录入 ---修改详情页面显示修改的发票
        }else {
            $scope.disabled = true;
            $scope.resultData.paymentAmount = parseFloat($scope.resultData.totalAmount /*- $scope.resultData.otherCost*/).toFixed(2);
             //新增稽核单-----计算发票税金金额
            if($scope.resultData.electrictyMidInvoices.length==0){
                $scope.resultData.electrictyMidInvoices.unshift({
                    "taxAmount":parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else {
                $scope.resultData.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.resultData.totalAmount/*-$scope.resultData.otherCost*/) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
        }
    }

    // 手动填写其他费用
    $scope.changeTotalAmount = function(){
		if($scope.totalAmount==null||$scope.totalAmount==""){
			$scope.resultData.otherCost=null;
			 utils.msg("请先添加电表明细");			 
		}else{
		if($scope.resultData.otherCost==null||$scope.resultData.otherCost==""){
			$scope.resultData.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(!reg.test($scope.resultData.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.resultData.otherCost < 0){
            utils.msg("数值不能为负。");
            return;
        }else if($scope.resultData.otherCost){	
		
        $scope.resultData.paymentAmount =new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.resultData.otherCost))+"";  //支付总金额
        $scope.resultData.totalAmount = new BigDecimal($scope.totalAmount).add(new BigDecimal($scope.resultData.otherCost))+""; //总金额（含税）+=其他金额
		//alert($scope.resultData.otherCost+"==="+$scope.resultData.totalAmount+$scope.resultData.paymentAmount+parseFloat($scope.resultData.totalAmount-$scope.resultData.otherCost).toFixed(2));
		}else {
			$scope.resultData.paymentAmount = $scope.totalAmount;
			$scope.resultData.totalAmount = $scope.totalAmount;
			
        }

		if($scope.resultData.otherCost=="0"){
			$scope.resultData.otherCost=null;
		}
		
        if($scope.resultData.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
          /*  $scope.resultData.electrictyMidInvoices.splice(0,1,{
                "taxAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
                "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            }) */
			$scope.resultData.electrictyMidInvoices.splice(0,1,{
                "taxAmount": new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
                "electricityAmount": new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
			
        }
		}
    }

    //验证手动输入的支付总金额
    $scope.changePaymentAmount=function(){
    	if($scope.totalAmount==null||$scope.totalAmount==""){
			$scope.resultData.paymentAmount=null;
			 utils.msg("请先添加电表明细");			 
		}else{
		if($scope.resultData.paymentAmount==null||$scope.resultData.paymentAmount==""){
			$scope.resultData.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(!reg.test($scope.resultData.paymentAmount)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.paymentAmount.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.resultData.paymentAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if((new BigDecimal($scope.resultData.paymentAmount).subtract(new BigDecimal($scope.resultData.totalAmount))) > 0){
        	 utils.msg("支付总金额不能大于总金额(含税)");
             return;        	
        }

		if($scope.resultData.paymentAmount=="0"){
			$scope.resultData.paymentAmount=null;
		}		
    }
    }


    //关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }


    //获取电表明细----对应电表个数
    $scope.getDianBiaoDetail=function(){
        // debugger;
        var siteId=$scope.resultData.sysAccountSiteId;
       var contractID=$scope.resultData.contractID;//合同id
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }else if((contractID==''||contractID==null)&& $scope.flagSave == undefined && $scope.flag == undefined){
			utils.msg("请先选择合同！");
            return;
        }else if(siteId !== ""){
            // debugger;
            // 电表数组为空新增   电表数组不为空直接显示--------新增电表时
            if(!$scope.watthourMeterVOs || $scope.watthourMeterVOs.length < 1){
                $scope.isNew = true;   //默认显示viewMaxReading
                commonServ.getInputElectrictyDetail(siteId).success(function(data){
					$rootScope.createDate=data.createDate;
					$rootScope.nowTime= new Date();
                    if(data != "" && data.watthourMeterVOs.length > 0){
                        for(var index=0; index<data.watthourMeterVOs.length; index++) {
                            data.watthourMeterVOs[index].watthourId = data.watthourMeterVOs[index].id;
							//判断上次拍照时间是否有值
							if(data.watthourMeterVOs[index].takePhotosTime==null){
							data.watthourMeterVOs[index].photosStatus=false;	//拍照时间为null,用户选择上次拍照时间
						
							}else{
								data.watthourMeterVOs[index].photosStatus=true; //拍照时间不为null,上次拍照时间为后台查询出来的拍照时间
							data.watthourMeterVOs[index].takePhotosTime=$scope.dataChange(data.watthourMeterVOs[index].takePhotosTime)
							}
							data.watthourMeterVOs[index].lastTakePhotosTime=data.watthourMeterVOs[index].takePhotosTime;//上次拍照时间=拍照时间
							//判断最大读数是否有值
							if(data.watthourMeterVOs[index].maxReadings==null){
							data.watthourMeterVOs[index].maxReadingStatus=false;	//最大读数为null,用户选择最大读数					
							}else{
								data.watthourMeterVOs[index].maxReadingStatus=true; //最大读数不为null,带出用户上次选择
							}
                        }
                        $scope.watthourMeterVOs =utils.deepCopy(data.watthourMeterVOs);
                        /*$scope.accountSiteDialog=ngDialog.open({
                            template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                            width: 1000,
                            scope: $scope,
                        });*/
                    }else {
                        utils.msg("报账点对应的电表信息为空，请重新选择报账点！");
                        // $scope.closeDialog('accountSiteDialog');  此处6月8日已注释
                        return;
                    }
                });
            }else{
                $scope.isNew = false;
                /*$scope.accountSiteDialog=ngDialog.open({
                    template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                    width: 1000,
                    scope: $scope,
                });*/
            }

        }else if(!$scope.flagSave  && $scope.flagSave != undefined || !$scope.flag){
            $scope.isNew = false;   //默认显示viewMaxReading
			$rootScope.nowTime= new Date();//当前时间
            // 查看修改电表信息时
			if($scope.singleDetail.watthourMeterVOs!=null){
				if($scope.singleDetail.watthourMeterVOs.length>0){
					for(var index=0; index<$scope.singleDetail.watthourMeterVOs.length; index++) {	
					if($scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime==null||$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime==""){					
					$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime="";
					}else{
						$scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime=$scope.dataChange($scope.singleDetail.watthourMeterVOs[index].lastTakePhotosTime);
					}
					if($scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime==null||$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime==""){					
						$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime="";
					}else{
						$scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime=$scope.dataChange($scope.singleDetail.watthourMeterVOs[index].theTakePhotosTime);
					}
					if(($scope.singleDetail.watthourMeterVOs[index].unitPrice==""||$scope.singleDetail.watthourMeterVOs[index].unitPrice==null)
					&&($scope.singleDetail.watthourMeterVOs[index].backcalculationPrice!=""||$scope.singleDetail.watthourMeterVOs[index].backcalculationPrice!=null)
					){
						$scope.singleDetail.watthourMeterVOs[index].unitPrice=$scope.singleDetail.watthourMeterVOs[index].backcalculationPrice;
					}
					}
				}			
			}
            $scope.watthourMeterVOs = utils.deepCopy($scope.singleDetail.watthourMeterVOs);
            for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
                //时间格式转换
                $scope.watthourMeterVOs[i].belongEndTime = $scope.dataChange($scope.watthourMeterVOs[i].belongEndTime);
                $scope.watthourMeterVOs[i].belongStartTime = $scope.dataChange($scope.watthourMeterVOs[i].belongStartTime);
            }
            /*$scope.accountSiteDialog=ngDialog.open({
                template: './tpl/electricityDetailDialog.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
                width: 1000,
                scope: $scope,
            });*/
        }
        console.log("电表明细",angular.toJson($scope.watthourMeterVOs,true));

    }

    var isEmpty = true;  //判断电表信息是否填写完整
    var isRightReg = true;  // 判断电表信息是否符合规矩
    // 校验数据
    $scope.checkNumber=function(meterVo){
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if((meterVo.startAmmeter != null && meterVo.startAmmeter.length > 20) || (meterVo.endAmmeter != null && meterVo.endAmmeter.length > 20) || (meterVo.dayAmmeter != null && meterVo.dayAmmeter.length > 20) || (meterVo.totalEleciric != null && meterVo.totalEleciric.length > 20) || (meterVo.totalAmount != null && meterVo.totalAmount.length > 20) || (meterVo.unitPrice != null && meterVo.unitPrice.length > 20) ){
            utils.msg("数值类型长度不能超过20个字符。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        if((meterVo.startAmmeter != null && !reg.test(meterVo.startAmmeter) )|| (meterVo.endAmmeter != null && !reg.test(meterVo.endAmmeter)  )|| (meterVo.dayAmmeter != null && isNaN(parseFloat(meterVo.dayAmmeter)) )|| (meterVo.totalEleciric != null && !reg.test(meterVo.totalEleciric) )|| (meterVo.totalAmount != null && !reg.test(meterVo.totalAmount) )|| (meterVo.unitPrice != null && !reg.test(meterVo.unitPrice) )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        // 此处修改-----当总用电止度为空的时候校验总电量为负数 meterVo.endAmmeter != null
        if( (meterVo.startAmmeter != null && meterVo.startAmmeter < 0 )|| (meterVo.endAmmeter != null && meterVo.endAmmeter < 0 )|| (meterVo.dayAmmeter != null && meterVo.dayAmmeter < 0 )|| (meterVo.totalEleciric != null && meterVo.totalEleciric < 0  && meterVo.endAmmeter != null)|| (meterVo.totalAmount != null && meterVo.totalAmount < 0)|| (meterVo.unitPrice != null && meterVo.unitPrice < 0 )){
            utils.msg("数值不能为负。");
                isRightReg = false;
                return;
        }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
                isRightReg = true;
        }
        if(meterVo.remarks != null &&　meterVo.remarks.length > 150){
             utils.msg("备注长度不能超过150个字符。");
                isRightReg = false;
                return;
        }else if(meterVo.remarks != null){
                isRightReg = true;
        }
    }
//最大度数
    $scope.maxReadingsChange=function(item,index){
		item.maxReadings=$("#maxReadings").val();
	
		 $scope.watthourMeterVOs[index]=item;

	}
  // 上传拍照图片
    $scope.uploadImg = function(item) {
        $scope.tabUpload=1;
		$scope.watthourMeterID=item.id;
        $scope.uploadImgDialog=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    };
	
	 //查看上传的图片
    $scope.showImg = function(item){
		if(item.accessories==null||item.accessories==""){
			alert("该电表无拍照图片！");
			return;
		}
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        var showUrl = base_url+'/fileOperator/fileDownLoadImg.do?filepath='+item.accessories;	   
        $scope.showUrls = showUrl;
        $scope.uploadImg=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    }
	
	    $scope.files = [];
     // 选择图片
    $scope.change1 = function(ele){
        $scope.files = ele.files;
        $scope.fileName = $scope.files[0].name;	
        var extStart=$scope.fileName.lastIndexOf(".");
        var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
        if(!/\.(gif|jpg|bmp|png|GIF|JPG|PNG|BMP)$/.test(ext)){
            utils.msg("请上传图片,类型必须是.jpg,gif,png,bmp中的一种");
            return;
        }else {
            var objUrl = $scope.getObjectURL($scope.files);
            $(".preview-box").attr("src",objUrl);
            $scope.$apply();
        }

    }


    $scope.uploadFiles = [];    //已上传的文件

    // 上传图片发送后台
    $scope.uploadImgType = function(){
        if($scope.files.length == 0 || $scope.files == null){
            utils.msg("请上传图片！");
            return;
        }
        var base_url = CONFIG.BASE_URL;
		var fileName=$scope.fileName;
        var formData = new FormData($( "#uploadForm1" )[0]);
        $.ajax({
            url:base_url+'/fileOperator/imgUpload.do',
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
					$scope.fileUrl = $scope.getObjectURL($scope.files);
                    $scope.uploadImgDialog.close("");
                    // 上傳成功后清空数据
                    $scope.files = [];
                }
                for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
					if($scope.watthourMeterVOs[i].id==$scope.watthourMeterID){
						$scope.watthourMeterVOs[i].accessories=data.data;
					}
				}
				
            }
        });
    }

	//删除拍照图片
	 $scope.deleteImgType = function(){
		 $scope.files=[];
		 $scope.fileName=null;
		  for(var i = 0; i<$scope.watthourMeterVOs.length; i++){
					if($scope.watthourMeterVOs[i].id==$scope.watthourMeterID){
						$scope.watthourMeterVOs[i].accessories=null;
					}
				}
	    $(".preview-box").attr("src","./assets/img/upload_photo_img.png");
		 $scope.uploadImgDialog.close("");
		 $scope.uploadImgDialog=ngDialog.open({
            template: './tpl/uploadImg.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
	 }
	
	//计算时间差是否大于6个月
	$scope.compare=function(date1,date2){
		 var newYear = date1.getFullYear();
        var newMonth =date1.getMonth() + 6;
        console.log(newMonth)
        if(newMonth >= 11){
            newYear += 1;
            newMonth -= 11;
            date1.setFullYear(newYear);
            date1.setMonth(newMonth-1);
        }
        else{
            date1.setFullYear(newYear);
            date1.setMonth(newMonth);
        }
        if(date1.getTime() > date2.getTime()){
            return true;//在六个月之内
        }
        else{
            return false;//大于六个月未填写抄表信息
        }
		};
		
	//报销时间与拍照时间相同判断是否填写原因	
	$scope.ack=function(){
		var cause=$("#cause").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause!=""&&cause!=null){//填写原因可以提交
			$scope.closeDialog("exceptionsHintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptionsExplain=cause;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
		//拍照电表读数小于报销电表当前读数判断是否填写原因	
	$scope.ack1=function(){
		var cause1=$("#cause1").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause1!=""&&cause1!=null){//填写原因可以提交
			$scope.closeDialog("exceptions1HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions1Explain=cause1;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//报账点单电表日均电费超1千元判断是否填写原因	
	$scope.ack2=function(){
		var cause2=$("#cause2").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause2!=""&&cause2!=null){//填写原因可以提交
			$scope.closeDialog("exceptions2HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions2Explain=cause2;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//报账点单电表日均电量超1千度判断是否填写原因	
	$scope.ack3=function(){
		var cause3=$("#cause3").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause3!=""&&cause3!=null){//填写原因可以提交
			$scope.closeDialog("exceptions3HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions3Explain=cause3;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//电损占比=稽核单电损电量/稽核单总电量>80%判断是否填写原因	
	$scope.ack4=function(){
		var cause4=$("#cause4").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause4!=""&&cause4!=null){//填写原因可以提交
			$scope.closeDialog("exceptions4HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.exceptions4Explain=cause4;				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
		//报账点电表单价高于2.5元/度继续提交	
	$scope.ack5=function(){
			$scope.closeDialog("exceptions5HintDialog");
			for(var i=0;i<$scope.watthourMeterVOs.length;i++){
				var meterVo = $scope.watthourMeterVOs[i];
				if(meterVo.watthourId==$rootScope.wattID){
					meterVo.isContinue="继续提交";				
				}
			}
			$scope.submitDetail("accountSiteDialog"); //调用电费明细提交，再次判断
			return;			
	}
	
    //电费明细提交
    $scope.submitDetail=function(){

        var writedList = [];
        //查看有没有填完整的电表
        for(var index=0; index<$scope.watthourMeterVOs.length; index++){
            var meterVo = $scope.watthourMeterVOs[index];
			if(meterVo.totalAmount>$scope.sumXPrice){			
				utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
				return;
			}
            $scope.checkNumber(meterVo);  //再次校验
            // 如果翻表为否，删除最大读数；
          /*  if(!meterVo.whetherMeter){
                delete meterVo.maxReading;
            } */
            if(!meterVo || !meterVo.belongStartTime || !meterVo.belongEndTime || !meterVo.dayAmmeter || (!meterVo.startAmmeter && meterVo.startAmmeter != 0) || (!meterVo.endAmmeter && meterVo.endAmmeter != 0) || (!meterVo.totalEleciric && meterVo.totalEleciric != 0) || (!meterVo.totalAmount && meterVo.totalAmount != 0) || (!meterVo.unitPrice && meterVo.unitPrice != 0) ){
                isEmpty = false;
            }else if((meterVo.totalAmount != null || meterVo.totalAmount != "0.00") && meterVo.dayAmmeter != null ){
               //判断电费总金额(含税)是否大于合同总价包干值
				if(meterVo.totalAmount>$scope.sumXPrice){			
					utils.msg("电费总金额(含税)不能大于合同总价包干值("+$scope.sumXPrice+")！");
					return;
				}
				
				//判断合同单价是否>直供电单价*120%，且无分级审批记录				
				if(((meterVo.unitPrice-$scope.zgdUnitPrice*1.2)>0)&&$scope.isUploadOverproof!="有"){
					alert("合同单价("+meterVo.unitPrice+")>直供电单价("+$scope.zgdUnitPrice+")*120%，稽核单生成失败，请于财务系统上传分级审批记录后再试！");
					return;
				}
				
				//判断报销周期是否在合同期限内
				var belongStartDates=new Date(meterVo.belongStartTime);//电费归属起始日期
				var belongEndDates=new Date(meterVo.belongEndTime);//电费归属终止日期
				var startDates=new Date($scope.startDate);//合同生效日期
				var endDates=new Date($scope.endDate);//合同失效日期
				if((belongStartDates.getTime()<startDates.getTime())
					||(belongStartDates.getTime()>endDates.getTime())
				||(belongEndDates.getTime()<startDates.getTime())
				||(belongEndDates.getTime()>endDates.getTime())){ //报销周期未在合同期限内不予报销，弹出提示框
					$scope.exceptions=ngDialog.open({
								template: './tpl/exceptions.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							return;		
				}
				
				//判断报账点电表单价是否高于2.5元/度
				if(meterVo.unitPrice-2.5>0){
					if(meterVo.isContinue==null){//未选择继续提交，弹出提示框
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					$scope.exceptions5HintDialog=ngDialog.open({
								template: './tpl/exceptions5HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							return;	
					}							
				}	
				
			  //判断报账点单电表日均电费是否超1千元
			   if((meterVo.totalAmount/meterVo.dayAmmeter)>1000){//报账点单电表日均电费超1千元，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions2Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions2HintDialog=ngDialog.open({
								template: './tpl/exceptions2HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}	
			   
			   //判断报账点单电表日均电量是否超1千度
			   if((meterVo.totalEleciric/meterVo.dayAmmeter)>1000){//报账点单电表日均电量超1千度，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions3Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions3HintDialog=ngDialog.open({
								template: './tpl/exceptions3HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
				
			   //判断电损占比=稽核单电损电量/稽核单总电量是否>80%
			   if((0-meterVo.electricLoss)==0){
				   meterVo.electricLoss=null;
			   }
			   if(meterVo.electricLoss!=null){
			   if((meterVo.electricLoss/meterVo.totalEleciric)>0.8){//电损占比=稽核单电损电量/稽核单总电量>80%，视为异常需填写原因说明
				   if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					if(meterVo.exceptions4Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions4HintDialog=ngDialog.open({
								template: './tpl/exceptions4HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}		
			   }else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
			   }
			   
			   //判断用户填写抄表信息时是否填写完整
				if(meterVo.theTakePhotosTime==""){
					meterVo.theTakePhotosTime=null;
				}
				if((meterVo.theTakePhotosTime!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.electricMeterDeg!=null&&(meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.takePhotosPeopleInfo!=null&&(meterVo.electricMeterDeg==null||meterVo.accessories==null))
				||(meterVo.theTakePhotosTime!=null&&meterVo.accessories!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null))){
					meterVo.theTakePhotosTime=null;
				}
			if((meterVo.electricMeterDeg!=null&&(meterVo.takePhotosPeopleInfo==null||meterVo.accessories==null||meterVo.theTakePhotosTime==null))
				||(meterVo.takePhotosPeopleInfo!=null&&(meterVo.electricMeterDeg==null||meterVo.accessories==null||meterVo.theTakePhotosTime==null))
				||(meterVo.accessories!=null&&(meterVo.electricMeterDeg==null||meterVo.takePhotosPeopleInfo==null||meterVo.theTakePhotosTime==null))){				
					alert("请完善抄表信息!!");
					return;
				}
				
				//如果本次拍照时间为空或拍照图片为null,则判断是否已有六个月未填写抄表信息										
					if(meterVo.theTakePhotosTime==null||meterVo.accessories==null){
						var myDate = new Date();//获取系统当前时间
						var lastTime=new Date(meterVo.lastTakePhotosTime);	
						$rootScope.lastTimes=meterVo.lastTakePhotosTime;
						var result=$scope.compare(lastTime,myDate);
						if(result){
							//isEmpty = true;
							if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}
						}else{
							//alert("超过六个月未填写抄表信息");
							 $scope.wattTimeDialog=ngDialog.open({
								template: './tpl/wattTimeDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});
							//isEmpty = false;
							return;							
						}
							
				}else{
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}
				
				//判断拍照电表读数是否小于报销电表当前读数				
				if(meterVo.electricMeterDeg!=null){
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
				if((meterVo.electricMeterDeg-meterVo.endAmmeter)<0){ //拍照电表读数小于报销电表当前读数，视为异常需填写原因说明					
					if(meterVo.exceptions1Explain==null){ //若未填写原因，则弹出异常提示						
						 $scope.exceptions1HintDialog=ngDialog.open({
								template: './tpl/exceptions1HintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;	
					}else{ //若已填写原因，则继续提交
						if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
					}					
				}else{ //否则继续提交
					//isEmpty = true;
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
				}	
				}
				
				//判断报销时间与拍照时间是否相同
					if(meterVo.theTakePhotosTime!=null){
					var myDate = new Date();//获取系统当前时间
					var myDates=$scope.dataChange(myDate);
					var lastTime=meterVo.theTakePhotosTime;
					if(meterVo.paymentAccountCode==null){
						meterVo.paymentAccountCode="空";
					}if(meterVo.code==null){
						meterVo.code=="空";
					}					
					$rootScope.wattID=meterVo.id;//电表号（id）
					$rootScope.wattCode=meterVo.code;//电表标识符
					$rootScope.wattPaymentAccountCode=meterVo.paymentAccountCode; //电表户号
					//alert((myDates==lastTime)+"=-="+myDate+"---"+lastTime+"---"+meterVo.theTakePhotosTime+"=="+myDates);
					if(myDates==lastTime){
						if(meterVo.exceptionsExplain==null){//如果异常原因没有值，则弹出窗口让用户填写原因说明				
						 $scope.exceptionsHintDialog=ngDialog.open({
								template: './tpl/exceptionsHintDialog.html?time='+new Date().getTime(),
								className: 'ngdialog-theme-default ngdialog-theme-custom',
								width: 750,
								scope: $scope,
								});									
								return;								
						}else{//若已填写原因，则继续提交
							if($scope.watthourMeterVOs.length>1){
								isEmpty=false;
							}else if($scope.watthourMeterVOs.length==1){
								isEmpty=true;
							}	
						}						
					}else{
					if($scope.watthourMeterVOs.length>1){
							isEmpty=false;
					}else if($scope.watthourMeterVOs.length==1){
							isEmpty=true;
					 }
					}
					}									
            }
        }
        // 多个电表
        if(!isEmpty && $scope.watthourMeterVOs.length > 1){
            for(var index=0; index < $scope.watthourMeterVOs.length; index++){
                var meterVo = $scope.watthourMeterVOs[index];
                // 其中某一个电表为未填写
                if(meterVo.totalAmount == null || meterVo.totalAmount=="0.00"){
                    continue;
                }else if(meterVo.dayAmmeter != null && meterVo.startAmmeter != null && meterVo.endAmmeter != null  && meterVo.totalEleciric !=null && meterVo.unitPrice != null){
                    isEmpty = true;
                    break;
                }
            }
            if(isEmpty){
                if(isRightReg){
                    utils.confirm("当前报账点所对应的电表未填写完全，确定要提交吗？","",function(){
                       // $scope.closeDialog(csngDialog);
                        setTimeout(utils.msg("已成功添加电表"),1000);
                    });
                    if(!$scope.flagSave  && $scope.flagSave != undefined) {  //查看修改页面时
                        $scope.singleDetail.watthourMeterVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }else {
                        $scope.resultData.watthourExtendVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }
                    // debugger;
                    $scope.countElectrictyTotPrice();    //计算电表总金额
                    return 1;
                }

            }else if((!isEmpty && isRightReg) || isEmpty){
                utils.msg("请至少完成一个电表的必填项再提交。");
            }
        // 单个电表
        }else if($scope.watthourMeterVOs.length == 1){
            if(isEmpty){
                if(isRightReg){
                    //$scope.closeDialog(csngDialog);
                    utils.msg("已成功添加电表");
                    if(!$scope.flagSave  && $scope.flagSave != undefined) {  //查看修改页面时
                        $scope.singleDetail.watthourMeterVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }else {
                        $scope.resultData.watthourExtendVOs=$scope.watthourMeterVOs;  // 各个电表总信息
                    }
                    $scope.countElectrictyTotPrice();    //计算电表总金额
                    return 1;
                }
            }else if((!isEmpty && isRightReg) || isEmpty){
                utils.msg("请至少完成一个电表的必填项再提交。");
            }
        }
    };



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
            template: './tpl/upload.html?time='+new Date().getTime(),
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
        var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ext)){
            utils.msg("请上传图片,类型必须是.gif,jpeg,jpg,png中的一种");
            return;
        }else {
            var objUrl = $scope.getObjectURL($scope.files);
            $(".preview-box").attr("src",objUrl);
            $scope.$apply();
        }

    }


    $scope.uploadFiles = [];    //已上传的文件

    // 上传发送
    $scope.uploadType = function(){
        if($scope.files.length == 0 || $scope.files == null){
            utils.msg("请上传图片！");
            return;
        }
        var base_url = CONFIG.BASE_URL;
        var formData = new FormData($( "#uploadForm" )[0]);
        $.ajax({
            url:base_url+'/fileOperator/fileUpload.do',
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
                    $scope.uploadFilesDetails = {
                        "id":"",
                        "upName":"",
                    }
                    $scope.uploadFilesDetails.id = key;
                    $scope.uploadFilesDetails.upName = data.data[key];
                    // $scope.resultData.attachmentId.push(key);
                    // $scope.fileNameImg = data.data[key];
                }
                $scope.uploadFiles.push($scope.uploadFilesDetails);
            }
        });
    }


    //查看上传的图片
    $scope.showDetailFiles = function(item){
        $scope.tabUpload=2;
        var base_url = CONFIG.BASE_URL;
        var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id;
        $scope.showUrls = showUrl;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/upload.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            scope: $scope,
        });
    }

    // 删除对应上传的图片
    $scope.deleteFiles = function(index){
        $scope.uploadFiles.splice(index,1);
    }

    console.log($scope.resultData.attachmentId );

    /**
     * 报账点名称管理
    */
   $scope.showAccountGrop = function(){
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }
        $scope.accountSiteDialog=ngDialog.open({
            template: './tpl/accountGrouplist.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

   };


   //获取报账单名称
    $scope.getApageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.getAparams = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };


   /**
    * 获取报账组列表
    */
    $scope.getAccountName = function(name){

        angular.extend($scope.getAparams,{
            "name":name,
        })

        commonServ.queryAccount($scope.getAparams).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.getApageInfo.totalCount = data.data.totalRecord;
                $scope.getApageInfo.pageCount = data.data.totalPage;
                $scope.getAparams.page = data.data.pageNo;
                $scope.accountList = data.data.results;
            })
        });
    }


   /*
    *@新增或修改报账组弹框
    */

    $scope.addAccountGrop = function(item,flag){
        if(item != null) {
            $scope.isModifyAccount = true;  //修改
            $scope.isAddAccount = false;   //新增
            commonServ.queryAccountDetail(item.id).success(function (data) {
                utils.loadData(data,function (data) {
                    $scope.getAccountDetail = data.data;
                })
            });
        }else {
            $scope.isModifyAccount = false;
            $scope.isAddAccount = true;
        }
        $scope.accountGroupDialog=ngDialog.open({
            template: './tpl/addAccountGroup.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 450,
            scope: $scope,
        });
    }



    /**
     * 保存报账组名称
     */
    $scope.accountObject = {// 新增的报账点名称
        "id":"",
        "name":""
    };
    $scope.addAccountNameSave = function(){
        $scope.accountObject = { // 新增的报账点名称
            "id":"",
            "name":$scope.accountObject.addName
        };

        commonServ.addAccountPage($scope.accountObject).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.accountGroupDialog.close("");
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }



    /**
     * 修改报账组名称
     */
    $scope.modifyAccountNameSave = function(){

        $scope.accountObject = {
            "id":$scope.getAccountDetail.id,
            "name":$scope.getAccountDetail.name
        }

        commonServ.modifyAccount($scope.accountObject).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.accountGroupDialog.close("");
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }


    /**
     * 删除报账组信息
     */
    $scope.deleteAccountSingle = function(item){

        commonServ.deleteAccount(item.id).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.params.pageNo=1;
                $scope.getAccountName();
            });
        });

    }



     /**
     * 选择报账组信息
     */
    $scope.choiceAccountGroup = function(){
        var obj= utils.getCheckedValsForRadio('#sysAccount');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        $scope.accountObject= JSON.parse(obj);
        if(!$scope.flagSave  && $scope.flagSave != undefined) {
            $scope.singleDetail.sysRgName = $scope.accountObject.name;
             $scope.singleDetail.sysRgID=$scope.accountObject.id;
        }else{
            $scope.resultData.sysRgID=$scope.accountObject.id;
        }
        $scope.accountSiteDialog.close("");
    }



/********************************************************新增稽核页面 保存、提交稽核单****************************************************************/

    //新增发票信息  -------
    $scope.addInvoiceVO=function(){
        if($scope.resultData.electrictyMidInvoices.length >= 1){
            $scope.disabled = false;  // 新添加发票  可
            $scope.resultData.electrictyMidInvoices.unshift({
                "taxAmount":0,   //税金金额
                "electricityAmount":0,
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
        }else if($scope.resultData.electrictyMidInvoices.length == 0 && $scope.resultData.totalAmount != "") {
            $scope.disabled = true;
            $scope.resultData.electrictyMidInvoices.unshift({
                "taxAmount":parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
        }else {
            utils.msg("当前电费总金额为0,请先选择报账点或添加电表明细！");
             return;
        }
    }




    //删除添加的发票
    $scope.removeInvoiceVO=function(index,item){

        if($scope.resultData.electrictyMidInvoices.length == 1){
            utils.msg("对不起，不能删除最后一张!");
            return;
        }else{
            $scope.resultData.electrictyMidInvoices.splice(index,1);
            if($scope.resultData.electrictyMidInvoices.length == 1){
                $scope.disabled = true;
                $scope.resultData.electrictyMidInvoices[0].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2) ; //电费金额不含税
                $scope.resultData.electrictyMidInvoices.invoiceId = $scope.invoiceVOs[0].invoiceId;
                $scope.resultData.electrictyMidInvoices[0].billTax = $scope.invoiceVOs[0].billTax;
                $scope.resultData.electrictyMidInvoices[0].billType = $scope.invoiceVOs[0].billType;
                $scope.resultData.electrictyMidInvoices[0].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[0].electricityAmount* ($scope.invoiceVOs[0].billTax/100)).toFixed(2);  //税金金额
            }
        }
    }


    // 选择发票种类
    $scope.selectInvoiceVOs = function(item,invoiceId,index){

        var invoice=null;
		var items1 =$scope.invoiceVOs[0];
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
				$scope.invoiceVOs[0]=items;
				$scope.invoiceVOs[i]=items1;
                break;
            }
        }
/*		if(invoice.billType.length>4){
		if(invoice.billType.substring(invoice.billType.length-4,invoice.billType.length)=="(3%)"){
			alert("你选择的发票不能生成稽核单,请从新选择发票！");
		}
		}
		if(invoice.billType.length>5){
		if(invoice.billType.substring(invoice.billType.length-5,invoice.billType.length)=="(17%)"){
			alert("你选择的发票不能生成稽核单,请从新选择发票！");
		}
		}*/
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        if($scope.disabled){ // 只有一张发票且初始时
          //  item.electricityAmount= parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
           // "taxAmount": new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
          //  "electricityAmount": new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal($scope.invoiceVOs[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税
        	item.electricityAmount = new BigDecimal($scope.resultData.totalAmount).subtract(new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";  //电费不含税

        }
       // item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
        item.taxAmount = new BigDecimal($scope.resultData.totalAmount).multiply(new BigDecimal(item.billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"";    // 税金金额
        
        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
        var sumElectricityAmount = 0;
        for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
            sumElectricityAmount +=
            parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
        }
        sumElectricityAmount=sumElectricityAmount.toFixed(2);
        $scope.resultData.electrictyMidInvoices[index]=item;
        $scope.checkElectricityAmount = sumElectricityAmount;

    }


    $scope.checkElectricityAmount = 0;  //校验发票金额 == 支付总金额
    $scope.editInit = 0;   //手动填写的初始电费金额
    //手动填写电费金额(不含税)
    $scope.changeInvoice=function(item,invoiceId,index){
        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.electricityAmount && item.electricityAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.electricityAmount && !reg.test(item.electricityAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.electricityAmount  && item.electricityAmount .length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else{
            $scope.editInit = item.electricityAmount;
            item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额

        // 手填自动算出其他的电费不含税
        //
        // if($scope.resultData.electrictyMidInvoices.length == 2){

        //     for(var j= 0; j<$scope.resultData.electrictyMidInvoices.length; j++){
        //         if(index != [j]){
        //             $scope.resultData.electrictyMidInvoices[j].electricityAmount = parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost-$scope.editInit-item.taxAmount)/(($scope.resultData.electrictyMidInvoices[j].billTax/100)+1)).toFixed(2);
        //             $scope.resultData.electrictyMidInvoices[j].taxAmount = parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount*($scope.resultData.electrictyMidInvoices[j].billTax/100)).toFixed(2);


        //         }
        //     }

        // }



        //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            var sumElectricityAmount = 0;
            for(var j=0; j<$scope.resultData.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.resultData.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.resultData.electrictyMidInvoices[j].taxAmount);
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            $scope.resultData.electrictyMidInvoices[index]=item;
            $scope.checkElectricityAmount = sumElectricityAmount;
        }
    }



    //取消返回页面
    $scope.returnPage = function(){
        $state.go('app.inputTariff',{
            'status':'tariff/sumbit'
        });
    }

	//保存选择的部门名
	$scope.selectDepartmentName = function(data){
		if(data==null){
			 utils.msg("请选择一个部门！");
			 return;
		}
		$scope.resultData.departmentName=data;
		utils.msg("你选择了部门:"+data);
	};

    // 保存综合新增稽核单
    $scope.saveElectricty=function(status){
		if($scope.resultData.contractID==null){
			 utils.msg("请选择合同后再提交！");
            return;
		}
        if($scope.resultData.watthourExtendVOs.length == 0 ){
            utils.msg("电表信息,请认真填写后再提交！");
            return;
        }else if($scope.checkElectricityAmount && $scope.checkElectricityAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }else{
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.viewMaxReading;
            }
            if($scope.uploadFiles.length > 0){
                for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
                }
            }
            delete  $scope.resultData.sysSupplierName;   //526暂时隐藏
            $scope.resultData.status = status;
            $scope.resultData.productNature = $scope.siteObject.productNature;
            console.log("resultData" , angular.toJson($scope.resultData,true));
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
/*			if($scope.resultData.electrictyMidInvoices.length>0){
				for(var i=0;i<$scope.resultData.electrictyMidInvoices.length;i++){
					 var items =$scope.resultData.electrictyMidInvoices[i];				 
				if(items.billType.length>4){
					if(items.billType.substring(items.billType.length-4,items.billType.length)=="(3%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				if(items.billType.length>5){
					if(items.billType.substring(items.billType.length-5,items.billType.length)=="(17%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				}
				
			}*/
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.payType==-1){
            	utils.msg("请选择缴费类型");
            	return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }
            commonServ.saveZElectricty($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $state.go('app.inputZTariff',{
                        'status':'tariffZ/sumbit'
                    });
                });
            });
        }
    }

    // 提交新增稽核单
    $scope.submitElectricty=function(status){
		if($scope.resultData.contractID==null){
			 utils.msg("请选择合同后再提交！");
            return;
		}
        if($scope.resultData.watthourExtendVOs.length == 0 ){
            utils.msg("电表信息,请认真填写后再提交！");
            return;
        }else if($scope.checkElectricityAmount && $scope.checkElectricityAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }else{
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.viewMaxReading;

            }
            if($scope.uploadFiles.length > 0){
                for(var fileId=0; fileId < $scope.uploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
                }
            }
            delete  $scope.resultData.sysSupplierName;   //526暂时隐藏
            $scope.resultData.status = status;
            $scope.resultData.productNature = $scope.siteObject.productNature;
            console.log("resultData" , angular.toJson($scope.resultData,true));
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
/*			if($scope.resultData.electrictyMidInvoices.length>0){
				for(var i=0;i<$scope.resultData.electrictyMidInvoices.length;i++){
					 var items =$scope.resultData.electrictyMidInvoices[i];				 
				if(items.billType.length>4){
					if(items.billType.substring(items.billType.length-4,items.billType.length)=="(3%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				if(items.billType.length>5){
					if(items.billType.substring(items.billType.length-5,items.billType.length)=="(17%)"){
						alert("你选择的发票不能生成稽核单，请从新选择发票！");
						return;
						}
					}
				}
				
			}*/
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if(!$scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }
            commonServ.saveZElectricty($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
                    $state.go('app.auditTariff',{
                        'status':'tariff/audit'
                    });
                });
            });
        }
    }


/********************************************************自维电费录入 查看、修改稽核单****************************************************************/

    /**
     * @自维电费录入修改------添加发票、手动添加、修改发票
     */
    $scope.editInvoiceVO = function(){
        if($scope.singleDetail.totalAmount != "" || !$scope.flagSave  && $scope.flagSave != undefined) {  //有数据才可添加发票
            $scope.isEditAudit = true;
            $scope.isAudit = false;
            if($scope.electrictyMidInvoices.length>=1){
                $scope.disabled = false;
                $scope.electrictyMidInvoices.unshift({
                    "taxAmount":0,   //税金金额
                    "electricityAmount":0,
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }else{
                $scope.electrictyMidInvoices.splice(0,1,{
                    "taxAmount":parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),
                    "electricityAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),
                    "invoiceId":$scope.invoiceVOs[0].id,
                    "billType":$scope.invoiceVOs[0].billType,
                    "billTax":$scope.invoiceVOs[0].billTax,
                })
            }
        }
    }


    /**
     * @async
     */
    //删除添加的发票
    $scope.removeEditInvoiceVO=function(index,item){

        if($scope.electrictyMidInvoices.length == 1){
            item.electricityAmount= parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
            utils.msg("对不起，不能删除最后一张!");
            return;
        }else{
            $scope.electrictyMidInvoices.splice(index,1);
            if($scope.electrictyMidInvoices.length == 1){
                $scope.disabled = true;
                $scope.electrictyMidInvoices[0].electricityAmount = parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / (($scope.electrictyMidInvoices[0].billTax/100)+1)).toFixed(2) ; //电费金额不含税
                $scope.electrictyMidInvoices.invoiceId = $scope.electrictyMidInvoices[0].invoiceId;
                $scope.electrictyMidInvoices[0].billTax = $scope.electrictyMidInvoices[0].billTax;
                $scope.electrictyMidInvoices[0].billType = $scope.electrictyMidInvoices[0].billType;
                $scope.electrictyMidInvoices[0].taxAmount = parseFloat($scope.electrictyMidInvoices[0].electricityAmount* ($scope.electrictyMidInvoices[0].billTax/100)).toFixed(2);  //税金金额
            }
        }
    }


    // 选择发票种类--修改电费录入
    $scope.selectEditInvoiceVOs = function(item,invoiceId,index){
        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类ID
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率

        if($scope.electrictyMidInvoices.length ==1 && item.electricityAmount != 0){   // 只有一张发票时
            item.electricityAmount= parseFloat(($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
        }

        item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
        $scope.electrictyMidInvoices[index]=item;
        var sumElectricityAmount = 0;
        for(var j=0; j<$scope.electrictyMidInvoices.length; j++){
            sumElectricityAmount +=
            parseFloat($scope.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.electrictyMidInvoices[j].taxAmount);
        }
        sumElectricityAmount=sumElectricityAmount.toFixed(2);
        $scope.checkAmount = sumElectricityAmount;   //需要校验的金额

    }




    $scope.editInitAudit = 0;   //手动填写的初始电费金额
    $scope.checkAmount = 0;  // 修改校验支付总金额 == 发票金额 + 总金额不含税
    //手动填写电费金额(不含税)--修改电费录入
    $scope.changeEditInvoice=function(item,invoiceId,index){

        var invoice=null;
        for(var i=0; i<$scope.invoiceVOs.length; i++){
            var items =$scope.invoiceVOs[i];
            if(items.id==invoiceId){
                invoice=items;
                break;
            }
        }
        item.invoiceId=invoiceId;        //选取的发票种类
        item.billType=invoice.billType;  //选取的发票对应的值
        item.billTax=invoice.billTax;    // 税率
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(item.electricityAmount && item.electricityAmount < 0){
            utils.msg("数值不能为负。");
            return;
        }else if(item.electricityAmount && !reg.test(item.electricityAmount )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(item.electricityAmount  && item.electricityAmount .length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else{
            $scope.editInitAudit  = item.electricityAmount;
            item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
            $scope.electrictyMidInvoices[index]=item;
            //需要校验的变量  支付总金额 = 总金额（含税）- 其他费用  = 发票1电费含税 + 发票1税金 + 发票2电费含税 + 发票2税金
            // $scope.taxAmount = sumElectricityAmount;
            var sumElectricityAmount = 0;
            for(var j=0; j<$scope.electrictyMidInvoices.length; j++){
                sumElectricityAmount +=
                parseFloat($scope.electrictyMidInvoices[j].electricityAmount)+parseFloat($scope.electrictyMidInvoices[j].taxAmount);
            }
            sumElectricityAmount=sumElectricityAmount.toFixed(2);
            $scope.checkAmount = sumElectricityAmount;   //需要校验的金额

        }

    }




     // 手动填写其他费用(电费录入修改)
   $scope.countTotal = function(){
		
		if($scope.singleDetail.otherCost==null||$scope.singleDetail.otherCost==""){
			$scope.singleDetail.otherCost="0";
		}
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if($scope.singleDetail.otherCost && !reg.test($scope.singleDetail.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.singleDetail.otherCost && $scope.singleDetail.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if($scope.singleDetail.otherCost && $scope.singleDetail.otherCost < 0){
            utils.msg("数值不能为负。");
            return;
        }else if($scope.singleDetail.otherCost){
			 $scope.singleDetail.paymentAmount =new BigDecimal($scope.totalAmounts).add(new BigDecimal($scope.singleDetail.otherCost))+"";  //支付总金额
        $scope.singleDetail.totalAmount = new BigDecimal($scope.totalAmounts).add(new BigDecimal($scope.singleDetail.otherCost))+""; //总金额（含税）+=其他金额

           // $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost).toFixed(2);  //支付总金额
        }else {
			$scope.singleDetail.paymentAmount = $scope.singleDetail.totalAmount;
			$scope.singleDetail.totalAmount = $scope.singleDetail.totalAmount;
			
           // $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount).toFixed(2);
        }
		if($scope.singleDetail.otherCost=="0"){
			$scope.singleDetail.otherCost=null;
		}
		
        if($scope.singleDetail.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
            $scope.singleDetail.electrictyMidInvoices.splice(0,1,{
				"taxAmount": new BigDecimal($scope.singleDetail.totalAmount).multiply(new BigDecimal($scope.singleDetail.electrictyMidInvoices[0].billTax).multiply(new BigDecimal("0.01"))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",    // 税金金额
                "electricityAmount": new BigDecimal($scope.singleDetail.totalAmount).subtract(new BigDecimal($scope.singleDetail.totalAmount).multiply(new BigDecimal($scope.singleDetail.electrictyMidInvoices[0].billTax).multiply(new BigDecimal("0.01")))).setScale(2,BigDecimal.ROUND_HALF_UP)+"",  //电费不含税

				//"taxAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
               // "electricityAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.singleDetail.electrictyMidInvoices[0].id,
                "billType":$scope.singleDetail.electrictyMidInvoices[0].billType,
                "billTax":$scope.singleDetail.electrictyMidInvoices[0].billTax,
            })
        }
    }



    /**
     * @ （综合）电费录入页面-----修改保存稽核单
    */
    $scope.editZiweiElectricty=function(status){
        $scope.resultData = {
            "id":$scope.editZiweiID,
            "status":status,
            "costCenterID":$scope.singleDetail.costCenterID,
            "towerSiteNumber":$scope.singleDetail.towerSiteNumber,
            "serialNumber":$scope.singleDetail.serialNumber,
            "productNature":$scope.singleDetail.productNature,
            "sysAccountSiteId":$scope.singleDetail.sysAccountSiteId,  //报账点ID
            "taxAmount":$scope.singleDetail.taxAmount,
            "otherCost":$scope.singleDetail.otherCost,
            "totalAmount":$scope.singleDetail.totalAmount,
            "paymentAmount":$scope.singleDetail.paymentAmount,
            "sysSupplierID":$scope.singleDetail.supplierID,
            "attachmentId":[],
            "watthourExtendVOs":$scope.singleDetail.watthourMeterVOs,
            "electrictyMidInvoices":$scope.electrictyMidInvoices,
            "sysRgID":$scope.singleDetail.sysRgID,
            "contractID":$scope.singleDetail.contractID,  //合同ID
			"departmentName":$scope.singleDetail.departmentName, //部门名
			"overproofReasons":$scope.singleDetail.overproofReasons,
            "remark":$scope.singleDetail.remark
        }
        if($scope.checkAmount && $scope.checkAmount!=$scope.resultData.paymentAmount) {
            utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
            return;
        }
        for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
            var obj= $scope.resultData.watthourExtendVOs[i];
                delete  obj.reimbursementDate;
                delete  obj.status;
                delete  obj.id;
                delete  obj.code;
                delete  obj.paymentAccountCode;
                delete  obj.ptype;
                delete  obj.rate;
                delete  obj.maxReading;
                delete  obj.currentReading;
                delete  obj.belongAccount;
                delete  obj.damageNum;
                delete  obj.damageDate;
                delete  obj.damageInnerNum;
                delete  obj.damageMeterNum;
                delete  obj.reimbursementDateStr;
                delete  obj.currentReadingStr;
                delete  obj.accountSiteId;
                delete  obj.accountName;
                delete  obj.oldFinanceName;
                delete  obj.mid;
                delete  obj.count;
                delete  obj.cityId;
                delete  obj.countyId;
                delete  obj.price;
                delete  obj.updateTimeStr;
                delete  obj.viewMaxReading;
        }
        // 附件信息
        if($scope.singUploadFiles){
            for(var fileId=0; fileId < $scope.singUploadFiles.length; fileId++){
                $scope.resultData.attachmentId.push($scope.singUploadFiles[fileId].id);
            }
        }
        if($scope.singleDetail.productNature == "自维") {
            $scope.resultData.productNature = "0";
        }else {
            $scope.resultData.productNature = "1";
        }

        delete $scope.resultData.name;
        console.log("resultData" , angular.toJson($scope.resultData,true));
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
            utils.msg("备注信息不能超过150个字符。");
            return;
        }
        if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
            utils.msg("支付总金额不能为负。");
            return;
        }
        if($scope.resultData.payType==-1 || $scope.resultData.payType==null){
        	utils.msg("请选择缴费类型");
        	return;
        }
        if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }
        for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
            var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
            if(metert && metert < 0){
                utils.msg("数值不能为负。");
                return;
            }else if(metert && !reg.test(metert)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if(metert  && metert.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
        }
        commonServ.modifyElectricty($scope.resultData).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.closeDialog('showZweiDialog');
                $scope.getZiweiData();
            });
        });

    }


/********************************************************自维电费稽核 查看、修改稽核单****************************************************************/

        /**
         * @ 电费稽核页面  修改保存稽核单
        */

        $scope.editZiweiAudit=function(){
        	//验证电表数据是否合法后再进行保存处理
        	var checkDianBiao = $scope.submitDetail();
        	// debugger;
        	if(checkDianBiao!=1){
        		return;
        	}
        	var checkPay =  $scope.countMoney2();
        	if(checkPay==0){
        		utils.msg("预付核销金额大于总金额!");
                return;
        	}
        	
            $scope.resultData = {
                "instanceId":$scope.instanceId,
                "id":$scope.editZiweiID,
                "status":status,
                "costCenterID":$scope.singleDetail.costCenterID || null,
                "towerSiteNumber":$scope.singleDetail.towerSiteNumber,
                "serialNumber":$scope.singleDetail.serialNumber,
                "sysAccountSiteId":$scope.singleDetail.sysAccountSiteId,  //报账点ID
                "otherCost":$scope.singleDetail.otherCost,
                "totalAmount":$scope.singleDetail.totalAmount,
                "paymentAmount":$scope.singleDetail.paymentAmount,
                "sysSupplierID":$scope.singleDetail.supplierID || null,
                "attachmentId":[],
                "watthourExtendVOs":$scope.singleDetail.watthourMeterVOs,
                "electrictyMidInvoices":$scope.electrictyMidInvoices,
                "remark":$scope.singleDetail.remark,
                "contractID":$scope.singleDetail.contractID,  //合同ID
				"departmentName":$scope.singleDetail.departmentName, //部门名
				"overproofReasons":$scope.singleDetail.overproofReasons,
                "sysRgID":$scope.singleDetail.sysRgID
            }
            var adpv = $scope.singleDetail.adpv;
        	//设置总核销预付金额
        	if(adpv!=null && adpv!=""){
        		var allExpenseAmount = 0;//本次总共想要核销的金额
            	for(var i=0;i<adpv.length;i++){
            		allExpenseAmount += adpv[i].expenseAmount*1;
            	}
            	$scope.resultData.expenseTotalAmount=allExpenseAmount;
        	}

            if($scope.checkAmount && $scope.checkAmount!=$scope.resultData.paymentAmount) {
                utils.msg("手动填写金额需与支付总金额一致,请重新填写后再提交!");
                return;
            }
            for(var i=0; i<$scope.singleDetail.watthourMeterVOs.length; i++){
                if($scope.singleDetail.watthourMeterVOs[i].whetherMeter == "是") {
                    $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "1";
                }else {
                    $scope.singleDetail.watthourMeterVOs[i].whetherMeter = "0";
                }
            }
            // 附件信息
            if($scope.singUploadFiles){
                for(var fileId=0; fileId < $scope.singUploadFiles.length; fileId++){
                    $scope.resultData.attachmentId.push($scope.singUploadFiles[fileId].id);
                }
            }
            // 电表信息
            for(var i=0; i<$scope.resultData.watthourExtendVOs.length; i++){
                var obj= $scope.resultData.watthourExtendVOs[i];
                    delete  obj.reimbursementDate;
                    delete  obj.status;
                    delete  obj.id;
                    delete  obj.code;
                    delete  obj.paymentAccountCode;
                    delete  obj.ptype;
                    delete  obj.rate;
                    delete  obj.maxReading;
                    delete  obj.currentReading;
                    delete  obj.belongAccount;
                    delete  obj.damageNum;
                    delete  obj.damageDate;
                    delete  obj.damageInnerNum;
                    delete  obj.damageMeterNum;
                    delete  obj.reimbursementDateStr;
                    delete  obj.currentReadingStr;
                    delete  obj.accountSiteId;
                    delete  obj.accountName;
                    delete  obj.oldFinanceName;
                    delete  obj.mid;
                    delete  obj.count;
                    delete  obj.cityId;
                    delete  obj.countyId;
                    delete  obj.price;
                    delete  obj.updateTimeStr;
                    delete  obj.viewMaxReading;

            }
            var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
            if($scope.resultData && $scope.resultData.remark && $scope.resultData.remark.length && $scope.resultData.remark.length > 150){
                utils.msg("备注信息不能超过150个字符。");
                return;
            }
            if($scope.resultData.paymentAmount && $scope.resultData.paymentAmount < 0){
                utils.msg("支付总金额不能为负。");
                return;
            }
            if($scope.resultData.otherCost && !reg.test($scope.resultData.otherCost)){
                utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                return;
            }else if($scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }
            for(var index= 0; index<$scope.resultData.electrictyMidInvoices.length; index++){
                var metert = $scope.resultData.electrictyMidInvoices[index].electricityAmount;
                if(metert && metert < 0){
                    utils.msg("数值不能为负。");
                    return;
                }else if(metert && !reg.test(metert)){
                    utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                    return;
                }else if(metert  && metert.length > 20){
                    utils.msg("数值类型长度不能超过20个字符。");
                    return;
                }
            }

            commonServ.editAduit($scope.resultData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.closeDialog('showZweiAuditDialog');
                    $scope.getZwAuditDetail();
                });
            });
        }

}]);

