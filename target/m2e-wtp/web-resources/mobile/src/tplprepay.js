/**
 * 自维新增稽核单 addOrUpdateAuditCtrl 公用模块（包含电费录入--新增稽核单 电费录入--修改、查看稽核单
 * 电费稽核---修改、查看稽核单）
 */
app.controller('prepayCtrl',[
						'lsServ',
						'$rootScope',
						'$scope',
						'$state',
						'$stateParams',
						'ngDialog',
						'utils',
						'commonServ',
						function(lsServ, $rootScope, $scope, $state,
								$stateParams, ngDialog, utils, commonServ) {

							/**
							 * [resultData description] 新建预付单
							 * 
							 * @type {Object}
							 */
							$scope.resultData = {

								"id" : "",
								"provinceId" : "",// 省id
								"cityId" : "",// 市id
								"countyId" : "",// 区/县id
								"provinceStr" : "",// 省id
								"cityStr" : "",// 市id
								"countyStr" : "",// 区/县id
								"startDate" : "",// 预付开始时间
								"endDate" : "",// 预付结束时间
								"totalMoney" : "0",// 预付总金额
								"supplyId" : "",// 预付供应商id
								"supplyStr" : "",// 预付供应商名
								"contractId" : "",// 合同id
								"contractStr" : "",// 合同名
								"paymentNumber" : "",// 预付申请批次号
								"createDate" : "",// 建单时间
								"status" : "",// 状态
								"remark" : "",// 备注
								"submitMan" : "",// 制单人
								"attachmentId":[],//附件　ids
								"departmentName" : "",// 部门名
								"departmentNameSum" : [],//部门选择
								"departmentId" : "",// 部门id
								"submitManId":"",//经办人id
								"ouName":"",
								"regionCode":"",//供应商地点id
								"OrganizationCode":""//供应商组织id

							}

							/** ******************************************************新增稽核和电费录入公共部分*************************************************************** */

							// 获取稽核单号、地市、区县、发票信息
							commonServ.getprepayID()
									.success(
											function(data1) {
												$scope.resultData.paymentNumber = data1.data.paymentNumber; // 预付单号
												$scope.resultData.provinceStr = data1.data.provinceStr; // 省
												$scope.resultData.cityStr = data1.data.cityStr; // 市
												$scope.resultData.countyStr = data1.data.countyStr; // 区
												$scope.resultData.departmentName = data1.data.departmentName;// 部门名
												$scope.resultData.departmentNameSum = data1.data.departmentNameSum;//部门选择
												$scope.resultData.departmentId = data1.data.departmentId;// 部门id
												$scope.resultData.provinceId = data1.data.provinceId;
												$scope.resultData.cityId = data1.data.cityId;
												$scope.resultData.countyId = data1.data.countyId;
												$scope.resultData.submitMan=data1.data.submitMan;//经办人
												$scope.resultData.submitManId=data1.data.submitManId;//经办人id
											});
//---------------------------------------------------------------------------------------------------------------------------------
							// 预览的url
							$scope.getObjectURL = function(file) {
								var url = null;
								if (window.createObjectURL != undefined) { // basic
									url = window.createObjectURL(file[0]);
								} else if (window.URL != undefined) { // mozilla(firefox)
									url = window.URL.createObjectURL(file[0]);
								} else if (window.webkitURL != undefined) { // webkit
																			// or
																			// chrome
									url = window.webkitURL
											.createObjectURL(file[0]);
								}
								return url;
							}

							// 继续上传框
							$scope.uploadFile = function() {
								$scope.tabUpload = 1;
								$scope.uploadFileDialog = ngDialog
										.open({
											template : './tpl/upload.html?time='
													+ new Date().getTime(),
											className : 'ngdialog-theme-default ngdialog-theme-custom',
											width : 750,
											scope : $scope,
										});
							};

							$scope.files = [];
							// 上传
							$scope.change = function(ele) {
								$scope.files = ele.files;
								$scope.fileName = $scope.files[0].name;
								var extStart = $scope.fileName.lastIndexOf(".");
								var ext = $scope.fileName.substring(extStart,
										$scope.fileName.length).toUpperCase();
								if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/
										.test(ext)) {
									utils
											.msg("请上传图片,类型必须是.gif,jpeg,jpg,png中的一种");
									return;
								} else {
									var objUrl = $scope
											.getObjectURL($scope.files);
									$(".preview-box").attr("src", objUrl);
									$scope.$apply();
								}

							}

							$scope.uploadFiles = []; // 已上传的文件

							// 上传发送
							$scope.uploadType = function() {
								if ($scope.files.length == 0
										|| $scope.files == null) {
									utils.msg("请上传图片！");
									return;
								}
								var base_url = CONFIG.BASE_URL;
								var formData = new FormData($("#uploadForm")[0]);
								$
										.ajax({
											url : base_url
													+ '/fileOperator/fileUpload.do',
											type : 'POST',
											data : formData,
											async : false,
											cache : false,
											contentType : false,
											processData : false,
											success : function(data) {
												if (data.code == 200) {
													layer.alert(data.message, {
														icon : 1,
														time : 2000,
														btn : [],
													});
													$scope.uploadFileDialog
															.close("");
													// 上傳成功后清空数据
													$scope.files = [];
												}
												for ( var key in data.data) {
													$scope.uploadFilesDetails = {
														"id" : "",
														"upName" : "",
													}
													//上传附件id
													$scope.uploadFilesDetails.id = key;
													
													 $scope.resultData.attachmentId.push(key);
													 console.log($scope.resultData.attachmentId)
													$scope.uploadFilesDetails.upName = data.data[key];
													// $scope.resultData.attachmentId.push(key);
													// $scope.fileNameImg =
													// data.data[key];
												}
												$scope.uploadFiles
														.push($scope.uploadFilesDetails);
											}
										});
							}

							// 查看上传的图片
							$scope.showDetailFiles = function(item) {
								$scope.tabUpload = 2;
								var base_url = CONFIG.BASE_URL;
								var showUrl = base_url
										+ '/fileOperator/fileDownLoad.do?fileID='
										+ item.id;
								$scope.showUrls = showUrl;
								$scope.uploadFileDialog = ngDialog
										.open({
											template : './tpl/upload.html?time='
													+ new Date().getTime(),
											className : 'ngdialog-theme-default ngdialog-theme-custom',
											width : 750,
											scope : $scope,
										});
							}
							

							// 删除对应上传的图片
							$scope.deleteFiles = function(index) {
								$scope.uploadFiles.splice(index, 1);
							}

							console.log($scope.resultData.attachmentId);

							// 关闭弹出框
							$scope.closeDialog = function(dialog) {
								$scope[dialog].close("");
							}
							
//-----------------------------------------------------------------------------------------------------------							
							
							// 提交新增预付单
							$scope.submitPrepay = function(status) {
								
								if ($scope.resultData.startDate.length == 0
										|| $scope.resultData.endDate.length == 0) {
									utils.msg("预付开始时间或结束时间为空,请重新填写！");
									return;
								}else{
									//日期的正则表达式
									var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
									var regExp = new RegExp(reg);
									if(!regExp.test($scope.resultData.startDate)||!regExp.test($scope.resultData.endDate)){
									　　utils.msg("日期赶写格式不正确，‘2000-01-01’");
									　　return;	
									}
								}
								if ($scope.resultData.supplyStr.length == 0) {
									utils.msg("供应商不能为空,请认真填写！");
									return;
								}
								if ($scope.resultData.remark.length == 0){
									utils.msg("备注信息不能为空！");
									return;
								}

								if ($scope.uploadFiles.length > 0) {
									for (var fileId = 0; fileId < $scope.uploadFiles.length; fileId++) {
										$scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
									}
								}else{
									utils.msg("附件为空");
									return;
								}
								$scope.resultData.status = status;
								console.log("resultData", angular.toJson($scope.resultData, true));
								var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;// 用来验证数字，包括小数的正则
								if ($scope.resultData && $scope.resultData.remark
										&& $scope.resultData.remark.length
										&& $scope.resultData.remark.length > 150) {
									utils.msg("备注信息不能超过150个字符。");
									return;
								}
								if ($scope.resultData.totalMoney && $scope.resultData.totalMoney < 0) {
									utils.msg("支付总金额不能为负。");
									return;
								}
								if ($scope.resultData.totalMoney && !reg.test($scope.resultData.totalMoney)) {
									utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
									return;
								} else if (!$scope.resultData.totalMoney
										&& $scope.resultData.totalMoney.length > 20) {
									utils.msg("数值类型长度不能超过20个字符。");
									return;
								}
								commonServ
										.submitPrepay($scope.resultData)
										.success(
												function(data) {
													utils.ajaxSuccess(
																	data,
																	function(data) {
																		if(data.data!=null){
																			utils.msg(data.data);
																			//console.log($scope.reloadRoute);
																			//$state.go('app.prepayAdd');
																			// 更新页面的稽核单号
																			commonServ.getprepayID().success(
																				function(data1) {
																					$scope.resultData.paymentNumber = data1.data.paymentNumber; // 预付单号
																				});
																			//清空页面数据
																			$scope.resultData.startDate=null;
																			$scope.resultData.endDate=null;
																			$scope.resultData.supplyStr=null;
																			$scope.resultData.remark=null;
																			$scope.resultData.totalMoney=0;
																			$scope.uploadFiles=null;
																		}else{
																			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
																			$state.go('app.prepayAdd');
																			 $state.go('app.prepaySel',{
															                        'status':'prepay/sel'
															                    });
																		}
																	});
												});
							}
							
	//--------------------------------------------------------------------------------------------------------------------						
							
							
						    
						    
						    // 合同信息弹出框
						    $scope.choiceContractDialog=function(){
/*						        var siteId=$scope.resultData.sysAccountSiteId;
						        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){          
								   utils.msg("请先选择报账点！");
						            return;
						        }*/
						        $scope.choiceContractDialogs=ngDialog.open({
						            template: './tpl/contractDialog.html?time='+new Date().getTime(),
						            className: 'ngdialog-theme-default ngdialog-theme-custom',
						            width: 1000,
						            scope: $scope,
						        });
						    }
						    
						    
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
						    
						    
						    
						    // 确定选择合同ID
						    $scope.choiceContract=function(){
						        var obj= utils.getCheckedValsForRadio('#ContractList');
						        if(obj==null){
						            utils.msg("请选择一个合同！");
						            return;
						        }
						        obj= JSON.parse(obj);
						        $scope.resultData.contractStr=obj.name; //合同名称
						        $scope.resultData.contractId=obj.id;   //改变后的合同id
						        alert($scope.resultData.contractId);
						        $scope.closeDialog("choiceContractDialogs");
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
							        pageSize: 100,//每页显示条数
							        pageNo: 1,// 当前页
						   		 };
						    	}

						        angular.extend($scope.getSparams,{
						            "cityId":$scope.resultData.cityId,
						            "countyId":$scope.resultData.countyId,
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
						        $scope.getData2("",true);
						     
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
//						        alert(obj.regionCode);
						        $scope.resultData.supplyStr=obj.name; //供应商名称
						        $scope.resultData.regionCode=obj.regionCode;
//						        alert(obj.organizationCode);
						        $scope.resultData.OrganizationCode=obj.organizationCode;
						        if(!$scope.flagSave && $scope.flagSave != undefined) {
						            $scope.resultData.supplyStr = obj.name;      //修改页面供货商数据
						            $scope.resultData.supplyId=obj.id;
						            $scope.resultData.ouName=obj.ouName;
						            $scope.resultData.regionCode=obj.regionCode;
						            $scope.resultData.OrganizationCode=obj.organizationCode;
						        }
						        $scope.resultData.supplyId=obj.id;   //改变后的供应商id
						        $scope.resultData.ouName=obj.ouName;
						        $scope.closeDialog("choiceSupplierDialogs");
						    }
						    
						    
						    
						    
						    
						    
						 // 供应商弹出框2
						    $scope.choiceSupplierDialog2=function(){
						        var siteId=$scope.resultData.sysAccountSiteId;
						        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
						            utils.msg("请先选择报账点！");
						            return;
						        }
						        $scope.choiceSupplierDialogs=ngDialog.open({
						            template: './tpl/supplierDialog2.html?time='+new Date().getTime(),
						            className: 'ngdialog-theme-default ngdialog-theme-custom',
						            width: 1000,
						            scope: $scope,
						        });
						    }


						    // 确定选择供应商2
						    $scope.choiceSupplier2=function(){
						        var obj= utils.getCheckedValsForRadio('#SupplieList');
						        if(obj==null){
						            utils.msg("请选择一个供应商！");
						            return;
						        }
						        obj= JSON.parse(obj);
						        $scope.singleDetail.supplyStr=obj.name; //供应商名称
						        if(!$scope.flagSave && $scope.flagSave != undefined) {
						            $scope.singleDetail.supplyStr = obj.name;      //修改页面供货商数据
						            $scope.singleDetail.supplyId=obj.id;
						            $scope.singleDetail.ouName=obj.ouName;
						        }
						        $scope.singleDetail.supplyId=obj.id;   //改变后的供应商id
						        $scope.closeDialog("choiceSupplierDialogs");
						    }
	

//---------------------------------------------------------------------------------------------------------------------
							
						    /**
					         * @ 预付单修改保存  修改保存预付单
					        */

					        $scope.editZiweiAudit=function(){

					            $scope.resultData = {
					            		"id":$scope.editZiweiID,
					            		"instanceId":$scope.instanceId,
										"sDate" : $scope.singleDetail.sDate,// 预付开始时间
										"eDate" : $scope.singleDetail.eDate,// 预付结束时间
										"totalMoney" : $scope.singleDetail.totalMoney,// 预付总金额
										"supplyId" : $scope.singleDetail.supplyId,// 预付供应商id
										"supplyStr" : $scope.singleDetail.supplyStr,// 预付供应商名
										"contractId" : $scope.singleDetail.contractId,// 合同id
										"remark" : $scope.singleDetail.remark,// 备注
										"ouName":$scope.singleDetail.ouName,
					            }
					            if ($scope.resultData.startDate.length == 0
										|| $scope.resultData.endDate.length == 0) {
									utils.msg("预付开始时间或结束时间为空,请重新填写！");
									return;
								}else{
									//日期的正则表达式
									var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
									var regExp = new RegExp(reg);
									if(!regExp.test($scope.resultData.startDate)||!regExp.test($scope.resultData.endDate)){
									　　utils.msg("日期赶写格式不正确，‘2000-01-01’");
									　　return;	
									}
								}
					            
					            
					            if ($scope.resultData.supplyStr.length == 0) {
									utils.msg("供应商不能为空,请认真填写！");
									return;
								}

								if ($scope.uploadFiles.length > 0) {
									for (var fileId = 0; fileId < $scope.uploadFiles.length; fileId++) {
										$scope.resultData.attachmentId.push($scope.uploadFiles[fileId].id);
									}
								}
								$scope.resultData.status = status;
								console.log("resultData", angular.toJson($scope.resultData, true));
								var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;// 用来验证数字，包括小数的正则
								if ($scope.resultData && $scope.resultData.remark
										&& $scope.resultData.remark.length
										&& $scope.resultData.remark.length > 150) {
									utils.msg("备注信息不能超过150个字符。");
									return;
								}
								if ($scope.resultData.totalMoney && $scope.resultData.totalMoney < 0) {
									utils.msg("支付总金额不能为负。");
									return;
								}
								if ($scope.resultData.totalMoney && !reg.test($scope.resultData.totalMoney)) {
									utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
									return;
								} else if (!$scope.resultData.totalMoney
										&& $scope.resultData.totalMoney.length > 20) {
									utils.msg("数值类型长度不能超过20个字符。");
									return;
								}


					            commonServ.editAduit($scope.resultData).success(function(data){
					                utils.ajaxSuccess(data,function(data){
					                    $scope.closeDialog('showZweiAuditDialog');
					                    $scope.getZwAuditDetail();
					                });
					            });
					        }
					    

						} ]);



//--------------------------------------------------------------------------------------------------------------					    	


/**
 * 预付查询
 */
app.controller('prepaySelCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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



     //获取列表   生成电费提交单查询--弹出框中按钮  公用
    $scope.getZwAuditDetail=function() {

        angular.extend($scope.params,{
            "qSerialNumber":$("[name='paymentNumber']").val(), // 流水号
            "qStartTime":$("#id1").val(), // 时间
            "qEndTime":$("#id2").val(), // 时间
            "flowState":$scope.flowState, // 状态
            "operation" : $scope.operation
        });
        
        
        
        delete $scope.params.page;
        commonServ.getprepayFlowList($scope.params).success(function (data) {
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
    

//        delete $scope.params.page;
//        commonServ.getprepaylist($scope.params).success(function (data) {
//            if(data.data.results == "") {
//                utils.msg("目前暂无数据！");
//            }
//            utils.loadData(data, function (data) {
//                $scope.pageInfo.totalCount = data.data.totalRecord;
//                $scope.pageInfo.pageCount = data.data.totalPage;
//                $scope.params.page = data.data.pageNo;
//				$scope.page11 = data.data.pageNo;
//                $scope.list = data.data.results;
//            })
//        });
    }
    
    
    //----------------------------------------------------查看详情-----------------------------------------------
    
    /**
     * 查看详情
    */
    $scope.showDetail = function(item,flag,save){
//        $scope.flag = flag;   //修改显示保存和取消
//        $scope.flagSave = save;//查看时只显示确定按钮
//        $scope.editZiweiID= item.adpv.id;
//        $scope.instanceId = item.id;
        
        
        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.editZiweiID= item.adpv.id;
        $scope.instanceId = item.instanceId;
        $scope.isZWauditSave = true;
        
        //控制是否显示
        $scope.isZWauditSave = true;
        // 列表详情
        commonServ.getPrepayById(item.businessKey).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.singleDetail = data.data;
                if(data.data.sysFileVOs.length>0){
                    $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                }
//                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
//                if($scope.singleDetail.isClud=="1"){
//                    $scope.singleDetail.isClud = "包干";
//                }else if($scope.singleDetail.isClud=="0"){
//                    $scope.singleDetail.isClud = "不包干";
//                }
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
        commonServ.queryFlowChartByPay(item.instanceId).success(function(data){
        	utils.loadData(data, function (data) {
        		$scope.flowChartList = data.data;
            })
        });



        $scope.tab=1;
        $scope.instanceId = item.instanceId;
        $scope.showZweiAuditDialog=ngDialog.open({
            template: './tpl/prepayPageDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'prepayCtrl',
            scope: $scope
        });

    }

     // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showZweiAuditDialog.close("");
    };
    
    
    
    /**
     * 预付单个提交、驳回
     */

    $scope.bachSubmit=function(adopt,id){
        var details = {
            "instanceId":id,
            "approveState":adopt
        }
        utils.confirm('确定要进行审批？',"",function(){
            commonServ.submitzwPreAudit(details).success(function(data){
            	console.log(data)
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list')
                });
            });
        });
    };
    
    
    /**
     * 批量提交(预付)
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
            commonServ.bachSubmitPreForJson(flows).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list');
                });
            });
        });
    }
    
    
    /**
     * 批量删除（预付）
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
            commonServ.bachPreDeleteTask({"instanceIds":utils.getCheckedVals('#list', false),reason:"", "paymentNumbers":utils.getCheckedIdVals('#list', false)}).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list');
                });
            });
        })
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
            commonServ.bachSubmitPreForJson(flows).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list')
                });
            });
        });
    }

    
    
    /**
     * 预付删除单个
     */
    $scope.deleteSelected=function(item){
        var details = {
            "instanceId":item.instanceId,
            "reason":"",
            "paymentNumber":item.adpv.paymentNumber//预付单流水号
        }
        utils.confirm('确定要删除吗？',"",function(){
            commonServ.rejectPreAduit(details).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getZwAuditDetail();
                    unCheckAll('#list')
                });
            });
        });
    }
    
    //意见框
    
    /**
     * 查看详情弹出框
     */
    $scope.talkInfo=function(id){
        $scope.idd = id;
        
       
        $scope.SubmitDialog=ngDialog.open({
            template: './tpl/talkInfo.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });
        
    }
    
    
    $scope.talk=function(talks){
    	$scope.params={
    			id:$scope.idd,
    			talks:talks,
    	}
   	 commonServ.saveTalk($scope.params).success(function (data) {
   		 console.log(data)
   		 if(data.message=="OK"){
   			 utils.alert("意见提交成功")
   		 }else{
   			utils.alert("意见提交失败")
   		 }
   	 })
   }
    
    // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showZweiAuditDialog.close("");
    };

    //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }
    
    
    
    /**
     * 预付单查询页面打开生成预付提交单--弹出框
     */
    $scope.createPreSubmitOrderDialog=function (){
        $scope.getPreDialog();
        $scope.SubmitOrderDialog=ngDialog.open({

            template: './tpl/addPreSumbitDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,

        });


    };
    
    
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
    $scope.getPreDialog = function(){
         angular.extend($scope.generatedParams,{
           "paymentNumber":$scope.serialNumber,
           "startDate":$("#createDate").val(),
           "endDate":$("#endDate").val(),
           "status":"2"
        });

        delete $scope.generatedParams.page;
        // 获取生成电费提交单审批通过列表
        commonServ.preQueryPage($scope.generatedParams).success(function(data){
           utils.loadData(data, function (data) {
                $scope.generatedPageInfo.totalCount = data.data.totalRecord;
                $scope.generatedPageInfo.pageCount = data.data.totalPage;
                $scope.generatedParams.page = data.data.pageNo;
                $scope.waitList = data.data.results;

            })
        });


    }
    
    
    /**
     * 点击生成电费提交弹框中生成提交单--弹出提交单详情
     */
    $scope.createSubmitOrder=function(id){

        var list='';
        if(id!=undefined && id!=''){
            console.log("id",id);
            list=id;
        }else{

            list= utils.getCheckedVals('#SubmitOrder',false);
            if(list.length<1){
                utils.msg("请选择至少一项");
                return;
            }
        }

        //生成预付单发送后台
        commonServ.createtePreSubmit(list).success(function(data){
        	if(data.code==100){
        		return;
        	}
                $scope.subID = data.data;
                unCheckAll('#SubmitOrder')

            // 生成电费提交列表单----详情
            commonServ.getViewPreDetails($scope.subID).success(function(data){
                // utils.ajaxSuccess(data,function(data){
                    $scope.listDetail = data.data.data.adpv;
                    $scope.trustees = data.data.data.trustees;
                    $scope.details = data.data.data;
                    if($scope.details.reimbursementType == 0){
                        $scope.details.reimbursementType ="报销";
                    }else{
                        $scope.details.reimbursementType ="报销";
                    }
                    if(id==undefined || id==""){
                    	$scope.SubmitOrderDialog.close("");
                    	unCheckAll('#SubmitOrder');
                    }
                // });

            });

                $scope.saveOrderDialog=ngDialog.open({
                	
                	template: './tpl/viewPreDialog.html?time='+new Date().getTime(),
                	className: 'ngdialog-theme-default ngdialog-theme-custom',
                	width: 1136,
                	scope: $scope,
                });
        });


        //查看详情中的预付单详情按钮
        $scope.getPreDetail = function(id){
          // 列表详情

          commonServ.getPrepayById(id).success(function (data) {
              utils.loadData(data,function (data) {
                  $scope.singleDetail = data.data;
                  if(data.data.sysFileVOs.length>0){
                      $scope.singUploadFiles = data.data.sysFileVOs;  //附件
                  }
              })
          });
          $scope.showZweiAuditDialog=ngDialog.open({
              template: './tpl/prepayPageDialog1.html?time='+new Date().getTime(),
              className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
              width: 1200,
              controller:'prepayCtrl',
              scope: $scope
          });

      }
        

        
        
        


        // 保存提交单
        $scope.saveDialog= function() {

            /*utils.confirm('确定要保存吗？',"",function(){
                $scope.saveOrderDialog.close("");
            })*/
        	if($scope.SubmitOrderDialog!=undefined){
        		$scope.SubmitOrderDialog.close("");
        	}
        	if($scope.showZweiAuditDialog!=undefined){
        		$scope.showZweiAuditDialog.close("");
        	}
        	if($scope.saveOrderDialog!=undefined){
        		$scope.saveOrderDialog.close("");
        	}
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
            $scope.SubmitOrderDialog.close("");
        }
    };
  
}]);

//--------------------------预付提交账务---------------------------------------------------------------------
/**
 * 提交财务 ------已完成
 */
app.controller('preFinanceCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

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

            "submitNo":$scope.submitNo,                 //预付提交单号
            "status":$scope.status,                     // 状态
            "startCreateDate":$scope.startCreateDate || null,    // 开始时间
            "endCreateDate":$scope.endCreateDate || null        // 结束时间
        });

        delete $scope.params.page;
        commonServ.getPreList($scope.params).success(function (data) {

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
            commonServ.pushPreManager(item.id).success(function (data) {
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
        // 预付提交查看
        commonServ.getPreSubmit(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.details=data.data.data;
                
            })
        });

        $scope.SubmitDialog=ngDialog.open({

            template: './tpl/viewPreDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });


    }
    
    //查看详情中的预付单详情按钮
    $scope.getPreDetail = function(id){
      // 列表详情

      commonServ.getPrepayById(id).success(function (data) {
          utils.loadData(data,function (data) {
              $scope.singleDetail = data.data;
              if(data.data.sysFileVOs.length>0){
                  $scope.singUploadFiles = data.data.sysFileVOs;  //附件
              }
          })
      });
      $scope.showZweiAuditDialog=ngDialog.open({
          template: './tpl/prepayPageDialog1.html?time='+new Date().getTime(),
          className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
          width: 1200,
          controller:'prepayCtrl',
          scope: $scope
      });

  }

   // 查看详情关闭弹出框
  $scope.closePage = function(){
      $scope.showZweiAuditDialog.close("");
  };


   
     // 查看详情关闭弹出框
    $scope.closePage = function(){
        $scope.showZweiAuditDialog.close("");
    };

    //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }
    
    
    
    
    
    
    
    /**
     * 点击生成电费提交弹框中生成提交单--弹出提交单详情
     */
    $scope.createPreSubmitOrder=function(id){

        var list=[];
        if(id!=undefined && id!=''){
            console.log("id",id);
            list.push(id);
        }else{

            list= utils.getCheckedVals('#SubmitOrder',false);

            if(list.length<1){
                utils.msg("请选择至少一项");
                return;
            }
        }

//        //生成电费稽核发送后台
//        commonServ.createteEleSubmit(list).success(function(data){
//                $scope.subID = data.data;
//                unCheckAll('#SubmitOrder')
//
//            // 生成电费提交列表单----详情
//            commonServ.getViewElectricDetails($scope.subID).success(function(data){
//                // utils.ajaxSuccess(data,function(data){
//                    $scope.listDetail = data.data.data.electrictyListVOs;
//                    $scope.trustees = data.data.data.trustees;
//                    $scope.details = data.data.data;
//                    if($scope.details.reimbursementType == 0){
//                        $scope.details.reimbursementType ="报销";
//                    }else{
//                        $scope.details.reimbursementType ="报销";
//                    }
//                    unCheckAll('#SubmitOrder');
//                // });
//
//            });
//
//        });


        $scope.saveOrderDialog=ngDialog.open({

            template: './tpl/viewElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });


//        // 保存提交单
//        $scope.saveDialog= function() {
//
//            utils.confirm('确定要保存吗？',"",function(){
//                $scope.saveOrderDialog.close("");
//            })
//        }
//
//
//         /**
//         * 取消删除生成提交表单
//         */
//        $scope.revocationProcess=function(){
//
//            commonServ.revocationProcess($scope.subID).success(function (data) {
//
//                utils.loadData(data, function (data) {
//                    $scope.params.pageNo=1;
//                    $scope.getElectricDialog();
//                    unCheckAll('#SubmitOrder');
//
//                })
//            });
//
//            $scope.saveOrderDialog.close("");
//
//        }


    };
    
    
    /**
    *
    * 查看详情中的查看详情
   */
   $scope.showZWauditDetailDetail = function(item,flag,save){
   	$scope.flag = flag;   //修改显示保存和取消
       $scope.flagSave = save;//查看时只显示确定按钮
       $scope.editZiweiID= item.adpv.id;
       $scope.instanceId = item.instanceId;
       $scope.isZWauditSave = true;
       
       //控制是否显示
       $scope.isZWauditSave = true;
       // 列表详情
       commonServ.getPrepayById(item.businessKey).success(function (data) {
           utils.loadData(data,function (data) {
               $scope.singleDetail = data.data;
               if(data.data.sysFileVOs.length>0){
                   $scope.singUploadFiles = data.data.sysFileVOs;  //附件
               }
           })
       });


       $scope.tab=1;
       $scope.instanceId = item.instanceId;
       $scope.showZweiAuditDialog=ngDialog.open({
           template: './tpl/prepayPageDialog.html?time='+new Date().getTime(),
           className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
           width: 1200,
           controller:'prepayCtrl',
           scope: $scope
       });

   }
    
    

}]);




