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
                        $scope.object.isClud = '包干';
                    }else {
                        $scope.object.isClud = '不包干';
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

