/**
 * 塔维稽核流程
 * 
 */
app.controller('towerAuditCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'towerAuditServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, towerAuditServ) {
	
	if ($rootScope.stateType) {
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
	  pageNo: 1// 当前页
	};
	
	// 稽核任务查询
	$scope.getAuditDetail=function() {
		// 补齐金额的小数位
		if ($scope.qShareMoney && !$scope.qShareMoney.split(".")[1]) {
			var shareMoney = $scope.qShareMoney + ".00";
		} else if ($scope.qShareMoney && $scope.qShareMoney.split(".")[1].length == 1) {
			var shareMoney = $scope.qShareMoney + "0";
		} else {
			var shareMoney = $scope.qShareMoney;
		}
        angular.extend($scope.params, {
            "qSerialNumber":$scope.qSerialNumber, // 流水号
            "flowState":$scope.flowState, // 状态
            "qCity":$("#qCity option:selected").val() ? $("#qCity option:selected").text() : null, // 城市
            "qCounty":$("#qCounty option:selected").val() ? $("#qCounty option:selected").text() : null, // 区县
            "qCounterNumber":$scope.qCounterNumber, // 铁塔站址编号
            "qCounterName":$scope.qCounterName, // 资管站点名称
            "qOverState":$scope.qOverState, // 超标状态
            "qStartTime":$scope.qStartTime || null, // 超始时间
            "qEndTime":$scope.qEndTime || null, // 截止时间
            "qShareMoney":shareMoney, // 分摊总金额
            "operation" : $scope.operation
        });

        delete $scope.params.page;
        towerAuditServ.getTowerAuditList($scope.params).success(function (data) {
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
	
	/**
     * 单个通过、驳回
     */
    $scope.bachSubmit=function(adopt,id){
        var details = {
            "instanceId":id,
            "approveState":adopt
        }

        utils.confirm('确定要进行审批？',"",function(){
        	towerAuditServ.submitAudit(details).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getAuditDetail();
                    unCheckAll('#audit-list')
                });
            });
        });
    };
    
    /**
     * 批量提交
     */
    $scope.bachSubmit2 = function(adopt) {
    	var ids = utils.getCheckedVals('#audit-list', true);
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
        
        utils.confirm('确定要进行批量审批？',"",function(){
        	towerAuditServ.submitAuditForJson({"instanceIds":ids.join(','), "approveState":adopt}).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getAuditDetail();
                    unCheckAll('#audit-list')
                });
            });
        });
    }
    
    /**
     * 批量审批、驳回
     */
    $scope.bachSubmit3 = function(adopt) {
    	var ids = utils.getCheckedVals('#audit-list', true);
        if(ids.length < 1){
            utils.msg("请选择至少一项");
            return;
        }
        for (var index = 0; index < $scope.list.length; index++) {
        	var info = $scope.list[index];
        	if ($.inArray(info.instanceId, ids) > -1) {
        		if (info.flowState < 2) {
        			utils.msg("请批量选择'审批中'的记录！");
        			return;
        		}
        	}
        }
        
        ids = utils.getCheckedVals('#audit-list', false);
        utils.confirm('确定要进行批量审批？',"",function(){
        	towerAuditServ.submitAuditForJson({"instanceIds":ids, "approveState":adopt}).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getAuditDetail();
                    unCheckAll('#audit-list')
                });
            });
        });
    }
    
    /**
     * 删除
     */
    $scope.deleteTask = function(id) {
    	utils.confirm('确定是否删除该流程？',"",function(){
    		towerAuditServ.deleteAudit({"instanceId":id, "reason":""}).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getAuditDetail();
                    unCheckAll('#audit-list')
                });
            });
    	})
    }
    
    /**
     * 批量删除
     */
    $scope.bachDeleteTask = function() {
    	var ids = utils.getCheckedVals('#audit-list', true);
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
    		towerAuditServ.bachDeleteTask({"instanceIds":ids.join(','), "reason":""}).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getAuditDetail();
                    unCheckAll('#audit-list')
                });
            });
    	})
    }


    /**
     * 查看详情
    */
    $scope.showDetail = function(item,flag,save){

        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.isTWauditSave = true;
        


        /**
         * 电费稽核单信息
         * @param  {[type]} 
         * @return {[type]}       [description]
         */
        towerAuditServ.querySingleTaiffSubmit(item.businessKey).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.object=data.data;
                $scope.listDetail = data.data.towerWatthourMeterVOs;
                if($scope.object.isClud=="1"){
                    $scope.object.isClud = "包干";
                }else if($scope.object.isClud=="0"){
                    $scope.object.isClud = "不包干";
                }
            })
        });



        // 查看超标状态
        towerAuditServ.queryMarkDetails(item.businessKey).success(function(data){
            utils.loadData(data,function (data) {
                if(data.data == null) {
                    $scope.markInfo = "未进行稽核验证";
                    return;
                }else{
                    var checkMark = data.data.overProportion;
                    if( checkMark > 0 ){
                        $scope.markInfo = "稽核不通过";
                    }else{
                        $scope.markInfo = "稽核通过";
                    }
                }
            })

        });

        /**
         * [流转信息]
         * 
         */
        towerAuditServ.queryApprovalDetails(item.instanceId).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.ApprovalDetails = data.data;
            })
        });

        // 查询流转图
        towerAuditServ.queryFlowChart(item.instanceId).success(function(data){
        	utils.loadData(data, function (data) {
        		$scope.flowChartList = data.data;
            })
        })
        
        $scope.tab=1;
        $scope.instanceId = item.instanceId;
        $scope.showAudtiPageDetail=ngDialog.open({
            template: './tw/TariffdetailsDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom ngdialog-audit',
            width: 1136,
            controller:'addTowerAuditCtrl', 
            scope: $scope,
        });

    }

}])




/**
 * 生成电费提交单
 * 
 */
app.controller('towerSubmitfinancial', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'towerAuditServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, towerAuditServ) {
	
	$scope.generatedPageInfo = {
		totalCount: 0,//总的记录条数
		pageCount: 0,// 总的页数
		pageOptions: [15,50,100,200],//每页条数的选项,选填
		showPages: 5//显示几个页码,选填
    };
	
	// 打开生成电费提交单
	$scope.createSubmission = function() {
		$scope.saveOrderDialog = ngDialog.open({
			template: './tw/addElectricSumbit.html?time='+new Date().getTime(),
			className: 'ngdialog-theme-default ngdialog-theme-custom',
			width: 1136,
			scope: $scope,
		});
	}
	
	// 查询参数
	$scope.generatedParams = {
		pageSize: 10,//每页显示条数
	    pageNo: 1// 当前页
	}
	
	// 生成电费提交单数据
    $scope.electricCharge = {
		"invoiceType" : "",
	}
	
	// 查询待生成电费提交单的数据
	$scope.getGeneratedData = function() {
		// 增加参数 
		angular.extend($scope.generatedParams, {
			"startTime" : $scope.generatedParams.startTime,
			"endTime" : $scope.generatedParams.endTime,
			"supplierName" : $scope.generatedParams.supplierName
        });
		
		delete $scope.generatedParams.page;
		// 执行查询
		towerAuditServ.queryGenerated($scope.generatedParams).success(function(data) {
			utils.loadData(data, function(data){
                $scope.generatedParams.pageNo=1;
                $scope.generatedPageInfo.totalCount = data.data.totalRecord;
                $scope.generatedPageInfo.pageCount = data.data.totalPage;
                $scope.generatedParams.page = data.data.pageNo;
                $scope.list = data.data.results;
            });
		})
	}
	
	// 打开生成电费提交单
	$scope.creatGenerated = function() {
		var ids = utils.getCheckedVals('#generatedList', true);
		if(ids.length < 1) {
            utils.msg("请选择至少一项");
            return;
        }
        if (!$scope.electricCharge.invoiceType) {
        	utils.msg("请选择发票类型");
            return;
        }
        // 稽核单
        $scope.electricCharge.towerEleIds = ids;
        // 生成电费提交单
        towerAuditServ.saveGeneratedData($scope.electricCharge).success(function(data) {
        	towerAuditServ.getGeneratedInfo({"reimburseId" : data.data.id}).success(function(data) {
        		$scope.generatedInfo = data.data;
        		$scope.creatGeneratedDig = ngDialog.open({
        			template: './tw/elecSumbitdetailDialog.html?time='+new Date().getTime(),
        			className: 'ngdialog-theme-default ngdialog-theme-custom',
        			width: 1136,
        			scope: $scope,
        		});
        	})
            // $scope.getData();
        	
        })
        
	}
	
	// 保存关闭生成界面
	$scope.closeGeneratedDig = function(){
		// 更新记录
		towerAuditServ.updateGeneratedInfo($scope.generatedInfo).success(function(data) {
			$scope.getGeneratedData();
            $scope.getData();  // 更新财务查询列表
		    $scope.creatGeneratedDig.close();
		})
	}
	
	$scope.saveGenerated = function() {
		$scope.saveOrderDialog.close();
	}
	
	// 查询发票类型
	towerAuditServ.getInvoiceTypeList().success(function(data){
		$scope.invoiceTypeList = data.data;
	});
	
	// 生成单发票类型、总金额变更事件
	$scope.generatedInvoiceType = function(typeId, types, totalAmount) {
		// 获取选择的发票类型信息
		var selectType;
		for (var index = 0; index < types.length; index++) {
			var type = types[index];
			if (typeId == type.id) {
				selectType = type;
				break;
			}
		}
		// 价款金额
		var priceAmount = (totalAmount / (1 + (selectType.billTax / 100))).toFixed(2);
		$scope.generatedInfo.priceAmount = priceAmount;
		// 计算税金金额
		var taxAmount = (totalAmount - priceAmount).toFixed(2);
		$scope.generatedInfo.taxAmount = taxAmount;
	}
	
	// 修改税金额
	$scope.generatedtaxAmountChange = function(taxAmount, totalAmount) {
		$scope.generatedInfo.priceAmount = (totalAmount - taxAmount).toFixed(2);
	}
	
	// 修改价款金额
	$scope.generatedpriceAmountChange = function(priceAmount, totalAmount) {
		$scope.generatedInfo.taxAmount = (totalAmount - priceAmount).toFixed(2);
	}
	
	// 推送财务查询参数
	$scope.params = {
	    pageSize: 10,//每页显示条数
		pageNo: 1// 当前页
	}

    $scope.frincePageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };
	
	// 推送财务列表查询
	$scope.getData = function() {
		angular.extend($scope.params, {
			"reimburseNo" : $scope.reimburseNo || null,
			"startCreateDate" : $scope.startCreateDate || null,
			"endCreateDate" : $scope.endCreateDate || null,
			"status" : $scope.status || null
        });
		delete $scope.params.page;
		towerAuditServ.querySubmitFinancialList($scope.params).success(function(data) {
            if(data.data.results == "") {
                utils.msg("目前暂无数据！");
            }
            utils.loadData(data,function (data) {
    			$scope.params.pageNo = 1;
                $scope.frincePageInfo.totalCount = data.data.totalRecord;
                $scope.frincePageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
    			$scope.submitFinancialList = data.data.results;
            });
		});
	}
	
	// 推送财务
	$scope.pushManager = function(info) {
		towerAuditServ.pushManager({ids: info.id}).success(function(data) {
			$scope.getData();
		})
	}
	
	// 账务模块批量推送下一级
	$scope.batchPushManager = function() {
		var ids = utils.getCheckedVals("#submitList", false);
		if(!ids) {
            utils.msg("请选择至少一项");
            return;
        }
		
		towerAuditServ.pushManager({ids: ids}).success(function(data) {
			$scope.getData();
		})
	}

    // 财务查看详情
	$scope.showFinancialDetail = function(item){
        $scope.isTWfrinceBtn = true;
        towerAuditServ.getGeneratedInfo({"reimburseId" : item.id}).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.generatedInfo=data.data;
                $scope.list = data.data.towerElectrictys;
            })
        });

        // 电费提交单详情弹框
        $scope.FinancialDialog = ngDialog.open({
            template: './tw/elecSumbitdetailDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });

    }

    // 财务中查看详情关闭电费提交单详情
    $scope.closedElectricDig = function(){
        $scope.FinancialDialog.close();
    }



    /**
     * 查看详情中的查看详情
    */
    $scope.showDetail = function(item,flag,save){
        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.isTWauditSave = false;
        
        /**
         * 电费稽核单信息
         * @param  {[type]} 
         * @return {[type]}       [description]
         */
        towerAuditServ.querySingleTaiffSubmit(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.object=data.data;
                $scope.listDetail = data.data.towerWatthourMeterVOs;
                if($scope.object.isClud=="1"){
                    $scope.object.isClud = "包干";
                }else if($scope.object.isClud=="0"){
                    $scope.object.isClud = "不包干";
                }
            })
        });

        // 查看超标状态
        towerAuditServ.queryMarkDetails(item.id).success(function(data){
            utils.loadData(data,function (data) {
                if(data.data == null) {
                    $scope.markInfo = "未进行稽核验证";
                    return;
                }else{
                    var checkMark = data.data.overProportion;
                    if( checkMark > 0 ){
                        $scope.markInfo = "稽核不通过";
                    }else{
                        $scope.markInfo = "稽核通过";
                    }
                }
            })

        });

        $scope.tab=1;
        // $scope.instanceId = item.instanceId;
        $scope.showAudtiPageDetail=ngDialog.open({
            template: './tw/TariffdetailsDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom ngdialog-audit',
            width: 1136,
            controller:'addTowerAuditCtrl', 
            scope: $scope,
        });

    }


}])