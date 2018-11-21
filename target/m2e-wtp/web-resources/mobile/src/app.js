var app = angular.module('app', ['ngResource','ui.router','httploading','ngDialog','ui.bootstrap.showErrors','im.pagination','angularBootstrapNavTree','ngLaydate',"ipCookie"]);

var findUserType = function () {

    var type= window.sessionStorage.getItem('userType') || "2";

    return type
}

var userType = findUserType();



//重写$http 参数传递类型：由 json 更改为： application/x-www-form-urlencoded
app.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide','$httpProvider',function ($controllerProvider, $compileProvider, $filterProvider, $provide,$httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[]';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = subName;
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]'
            ? param(data)
            : data;
    }];
}]);

// 解决IE 不刷新 缓存
app.config(function ($httpProvider) {
      // Initialize get if not there
      if (!$httpProvider.defaults.headers.get) {
          $httpProvider.defaults.headers.get = {};
      }
  
      // Enables Request.IsAjaxRequest() in ASP.NET MVC
      $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
  
     //禁用IE对ajax的缓存
     $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
     $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
 });


//http loading 效果
app.config(['$httpProvider','showErrorsConfigProvider', function($httpProvider,showErrorsConfigProvider) {



    //配置数据校验
    showErrorsConfigProvider.showSuccess(true);
    showErrorsConfigProvider.trigger('change');
    showErrorsConfigProvider.trigger('keypress');


    $httpProvider.interceptors.push('accessTokenInjector');
    $httpProvider.interceptors.push('httpLoadingInjector');

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    var url=""

    userType=1*userType;

    switch (userType){

        case 0:
            url='/provincial/index';
            break

        case 1:
            url= '/municipal/index';
            break;

        case 2:
            url= '/trustees/index';
            break

        case 3:
            url= '/county/index';
            break;

        case 4:
            url= '/reimbursement/index';
            break

    }


    $urlRouterProvider.otherwise(url);

/*********************************************路由导航***************************************************/ 

    $stateProvider.state('app', {
        url: '/',
        views: {
            'header':{
                templateUrl: 'tpl/header.html?time='+ new Date().getTime(),
                controller:'headerCtrl',
            },
            'aside':{
                templateUrl:'tpl/aside.html?time='+ new Date().getTime(),
            },
            'content': {
                templateUrl: 'tpl/trusteesIndex.html?time='+ new Date().getTime(),
                controller:'trusteesIndexCtrl',

            },
            'right': {
                templateUrl: 'tpl/right.html?time='+ new Date().getTime(),
            },
            'footer':{
                templateUrl: 'tpl/footer.html?time='+ new Date().getTime(),
            }
        }
    })

/***********************************************角色公共首页*************************************************/ 
    //省级首页
    .state('app.provincial', {
        url: 'provincial/index',
        views: {
            'content@': {
                templateUrl: 'tpl/provincialIndex.html?time='+ new Date().getTime(),
                controller: 'provincialIndexCtrl',
            }
        }
    })

    //市级首页
    .state('app.municipal', {
        url: 'municipal/index',
        views: {
            'content@': {
                templateUrl: 'tpl/municipalIndex.html?time='+ new Date().getTime(),
                controller: 'municipalIndexCtrl',
            }
        }
    })

    //经办人首页
    .state('app.trustees', {
        url: 'trustees/index',
        views: {
            'content@': {
                templateUrl: 'tpl/trusteesIndex.html?time='+ new Date().getTime(),
                controller: 'trusteesIndexCtrl',
            }
        }
    })


    //报销发起人首页
    .state('app.reimbursement', {
        url: 'reimbursement/index',
        views: {
            'content@': {
                templateUrl: 'tpl/reimbursementIndex.html?time='+ new Date().getTime(),
                controller: 'reimbursementCtrl',
            }
        }
    })
    
    .state('app.downExcel',{
    	url:'audit/excel',
    	views: {
            'content@': {
                templateUrl: 'tpl/downExcel.html?time='+ new Date().getTime(),
                controller: 'excelCtrl',
            }
        }
    })
  
    //综合用电导出excel
    .state('app.ZdownExcel',{
    	url:'auditz/zexcel',
    	views: {
            'content@': {
                templateUrl: 'tpl/zh/downExcel.html?time='+ new Date().getTime(),
                controller: 'ZexcelCtrl',
            }
        }
    })
    
    
    
     //综合用电导出excel
    .state('app.downZGExcel',{
    	url:'auditzg/zgexcel',
    	views: {
            'content@': {
                templateUrl: 'tpl/bb/downExcel.html?time='+ new Date().getTime(),
                controller: 'ZGexcelCtrl',
            }
        }
    })


    //区县首页
    .state('app.county', {
        url: 'county/index',
        views: {
            'content@': {
                templateUrl: 'tpl/countyIndex.html?time='+ new Date().getTime(),
                controller: 'countyCtrl',
            }
        }
    })



/***********************************************自维页面部分*************************************************/ 

    //系统操作日志

    .state('app.operationLog', {
        url: 'system/logs',
        views: {
            'content@': {
                templateUrl: 'tpl/logs.html?time='+ new Date().getTime(),
                controller: 'logCtrl',
            }
        }
    })

   //用户管理
    .state('app.user', {
        url: 'user/mannager',
        views: {
            'content@': {
                templateUrl: 'tpl/userMannager.html?time='+ new Date().getTime(),
                controller: 'userMannagerCtrl',
            }
        }
    })

    //添加
    .state('app.userAdd', {
        url: 'user/:status/:id',
        views: {
            'content@': {
                templateUrl: 'tpl/addUser.html?time='+ new Date().getTime(),
                controller: 'addUserCtrl',
            }
        }
    })

     //角色管理
    .state('app.role', {
        url: 'system/roles',
        views: {
            'content@': {
                templateUrl: 'tpl/roles.html?time='+ new Date().getTime(),
                controller: 'rolesCtrl',
            }
        }
    })



     // 添加角色
    .state('app.rolesAdd', {
        url: 'system/:status/:id',
        views: {
            'content@': {
                templateUrl: 'tpl/addRoles.html?time='+ new Date().getTime(),
                controller: 'rolesCtrl',
            }
        }
    })

       //系统消息
     .state('app.systemBBS', {
            url: 'system/notice',
            views: {
                'content@': {
                    templateUrl: 'tpl/systemNotice.html?time='+ new Date().getTime(),
                    controller: 'systemNoticeCtrl',
                }
            }
     })
  //系统消息
     .state('app.towerSystemBBS', {
            url: 'system/notice',
            views: {
                'content@': {
                    templateUrl: 'tpl/systemNotice.html?time='+ new Date().getTime(),
                    controller: 'systemNoticeCtrl',
                }
            }
     })

     //添加或更新系統公告
    .state('app.addOrUpdateNotice', {
        url: 'notice/:status/:id',
        views: {
            'content@': {
                templateUrl: 'tpl/addNotice.html?time='+ new Date().getTime(),
                controller: 'addOrUpdateSystemNoticeCtrl',
            }
        }
    })

    //基礎数据呈现
    .state('app.displayData', {
        url: 'base/data',
        views: {
            'content@': {
                templateUrl: 'tpl/baseData.html?time='+ new Date().getTime(),
                controller: 'baseDataCtrl',
            }
        }
    })
    
    //基礎数据呈现(导邮)
    .state('app.baseDataExcel', {
        url: 'base/dataExcel',
        views: {
            'content@': {
                templateUrl: 'tpl/downDateExcel.html?time='+ new Date().getTime(),
                controller: 'baseDataExcelCtrl',
            }
        }
    })


     //流程管理
    .state('app.workflow', {
        url: 'process',
        views: {
            'content@': {
                templateUrl: 'tpl/processManage.html?time='+ new Date().getTime(),
                controller: 'processManageCtrl',
            }
        }
    })

    //添加或更新流程
    .state('app.addOrUpdateWorkflow', {
        url: 'process/:status/:id',
        views: {
            'content@': {
                templateUrl: 'tpl/addProcess.html?time='+ new Date().getTime(),
                controller: 'addOrUpdateWorkflow',
            }
        }
    })





    //额定功率标杆
    .state('app.RMSBenchmark', {
        url: 'rated/mark',
        views: {
            'content@': {
                templateUrl: 'tpl/ratedMark.html?time='+ new Date().getTime(),
                controller: 'ratedMarkCtrl',
            }
        }
    })



    //智能电表标杆
    .state('app.smartMeterBenchmark', {
        url: 'smartBench/mark',
        views: {
            'content@': {
                templateUrl: 'tpl/smartBenchmark.html?time='+ new Date().getTime(),
                controller: 'smartBenchmarkCtrl',
            }
        }
    })



    //开关电源标杆
    .state('app.SMPSBenchmark', {
        url: 'SMPSBench/mark',
        views: {
            'content@': {
                templateUrl: 'tpl/SMPSBenchmark.html?time='+ new Date().getTime(),
                controller: 'SMPSBenchmarkCtrl',
            }
        }
    })



    //其他信息管理
    .state('app.additionalInfo', {
        url: 'other/manager',
        views: {
            'content@': {
                templateUrl: 'tpl/otherManager.html?time='+ new Date().getTime(),
                controller: 'otherManagerCtrl',
            }
        }
    })


    // 业主信息管理
    .state('app.owner', {
        url: 'owner/manager',
        views: {
            'content@' : {
                templateUrl: 'tpl/ownerManage.html?time='+ new Date().getTime(),
                controller: 'ownerManagerCtrl',
            }
        }
    })


    // 维护数据修改管理
    .state('app.basedataManager', {
        url: 'mainTainData/manager',
        views: {
            'content@' : {
                templateUrl: 'tpl/mainTainData.html?time='+ new Date().getTime(),
                controller: 'mainTainDataCtrl',
            }
        }
    })


    //报账点管理
    .state('app.reimburseSite', {
        url: 'reimburse/site',
        views: {
            'content@': {
                templateUrl: 'tpl/reimburManger.html?time='+ new Date().getTime(),
                controller: 'reimburMangerCtrl',
            }
        }
    })


    //发票信息管理
    .state('app.invoiceInfo', {
        url: 'invoice/info',
        views: {
            'content@': {
                templateUrl: 'tpl/invoiceManage.html?time='+ new Date().getTime(),
                controller: 'invoiceManageCtrl',
            }
        }
    })

    //<电表信息管理
    .state('app.meterInfo', {
        url: 'meter/info',
        views: {
            'content@': {
                templateUrl: 'tpl/powerInfoManager.html?time='+ new Date().getTime(),
                controller: 'meterInfoCtrl',
            }
        }
    })
    //供电信息管理
    .state('app.eletricityInfo', {
        url: 'eletricity/info',
        views: {
            'content@': {
                templateUrl: 'tpl/supplierPowerManager.html?time='+ new Date().getTime(),
                controller: 'supplierPowerManagerCtrl',
            }
        }
    })
    //转供电审批路由noone
    
    .state('app.transAppro', {
        url: 'transAppro/data',
        views: {
            'content@': {
                templateUrl: 'tpl/transEleAppro.html?time='+ new Date().getTime(),
                controller: 'transApproManagerCtrl',
                reload:true,
            }
        }
    })
     //转供电改造管理路由noone
    .state('app.transEletricityInfo', {
        url: 'transEletricity/info',
        views: {
            'content@': {
                templateUrl: 'tpl/transEletricityManager.html?time='+ new Date().getTime(),
                controller: 'transEletricityManagerCtrl',
                reload:true,
            }
        }
    })
    //新增转供电页面路由noone
    .state('app.addTransEletricity',{
    	url:'transEle/add',
    	views:{
    		'content@': {
    			templateUrl: 'tpl/addTransDialog.html?time='+new Date().getTime(),
    			controller: 'addTransEletricityCtrl',
                reload:true,
    		}
    	}
    })
    //供应商信息管理
    .state('app.supplierInfo', {
        url: 'supplier/info',
        views: {
            'content@': {
                templateUrl: 'tpl/supplierManager.html?time='+ new Date().getTime(),
                controller: 'supplierManagerCtrl',
            }
        }
    })
    //基础信息合同管理
    .state('app.contractInfo', {
        url: 'contract/info',
        views: {
            'content@': {
                templateUrl: 'tpl/contractManager.html?time='+ new Date().getTime(),
                controller: 'contractInfoCtrl',
            }
        }
    })
    
       //白名单审核管理
    .state('app.whiteCheck', {
        url: 'white/check',
        views: {
            'content@': {
                templateUrl: 'tpl/whiteMg.html?time='+ new Date().getTime(),
                controller: 'whiteMgCtrl',
            }
        }
    })
    
    //白名单数据管理
    .state('app.white', {
        url: 'white/white',
        views: {
            'content@': {
                templateUrl: 'tpl/white/whiteDataMg.html?time='+ new Date().getTime(),
                controller: 'whiteDataMgCtrl',
            }
        }
    })
    
    
     //新增白名单管理
    .state('app.addWhite', {
        url: 'white/add',
        views: {
            'content@': {
                templateUrl: 'tpl/addWhite.html?time='+ new Date().getTime(),
                controller: 'addWhiteMgCtrl',
            }
        }
    })


    // 额定功率管理
    .state('app.RMS', {
        url: 'rated/manager',
        views: {
            'content@': {
                templateUrl: 'tpl/ratedManager.html?time='+ new Date().getTime(),
                controller: 'ratedManagerCtrl',
            }
        }
    })


    // 电费录入
    .state('app.inputTariff', {
        url: 'tariff/sumbit',
        views: {
            'content@': {
                templateUrl: 'tpl/tariffSumbit.html?time='+ new Date().getTime(),
                controller: 'tariffSumbitCtrl',
            }
        }
    })
    
    // 综合电费录入
    .state('app.inputZTariff', {
        url: 'tariffZ/sumbit',
        views: {
            'content@': {
                templateUrl: 'tpl/zh/tariffSumbit.html?time='+ new Date().getTime(),
                controller: 'tariffZSumbitCtrl',
            }
        }
    })


    // 电费稽核
    .state('app.auditTariff', {
        url: 'tariff/audit',
        views: {
            'content@': {
                templateUrl: 'tpl/tariffAudit.html?time='+ new Date().getTime(),
                controller: 'tariffAuditCtrl',
            }
        },
        reload:true
    })
    
    
     // 综合电费稽核
    .state('app.auditZTariff', {
        url: 'tariffZ/audit',
        views: {
            'content@': {
                templateUrl: 'tpl/zh/tariffAudit.html?time='+ new Date().getTime(),
                controller: 'tariffZAuditCtrl',
            }
        },
        reload:true
    })



    // 提交财务
    .state('app.inputFinance', {
        url: 'input/financ',
        views: {
            'content@': {
                templateUrl: 'tpl/tariffFinance.html?time='+ new Date().getTime(),
                controller: 'inputFinanceCtrl',
            }
        }
    })
    
    
    
     // 综合电费提交财务
    .state('app.inputZFinance', {
        url: 'inputZ/financ',
        views: {
            'content@': {
                templateUrl: 'tpl/zh/tariffFinance.html?time='+ new Date().getTime(),
                controller: 'inputZFinanceCtrl',
            }
        }
    })

    // 新增或修改 稽核单
    .state('app.addAudit', {
        url: 'audit/:status/:id',
        views: {
            'content@': {
                templateUrl: 'tpl/addAudit.html?time='+ new Date().getTime(),
                controller: 'addOrUpdateAuditCtrl',
            }
        }
    })
    
    // (综合)新增或修改 稽核单
    .state('app.addZAudit', {
        url: 'auditZ/:status/:id',
        views: {
            'content@': {
                templateUrl: 'tpl/zh/addAudit.html?time='+ new Date().getTime(),
                controller: 'addOrUpdateZAuditCtrl',
            }
        }
    })
    

    // 数据导入
    .state('app.inputData', {
        url: 'data/exprot',
        views: {
            'content@': {
                templateUrl: 'tpl/dataExprot.html?time='+ new Date().getTime(),
                controller: 'dataExprotCtrl',
            }
        }
    })



    // 统计报表
    .state('app.statisticsReport', {
        url: 'statistics/report',
        views: {
            'content@': {
                templateUrl: 'tpl/statisticsReport.html?time='+ new Date().getTime(),
                controller: 'statisticsReportCtrl',
            }
        }
    })
//------------------------------预付功能----------------------------------    
    // 新增预付
    .state('app.prepayAdd', {
        url: 'prepay/add',
        views: {
            'content@': {
                templateUrl: 'tpl/prepayAdd.html?time='+ new Date().getTime(),
                controller: 'prepayCtrl',
            }
        }
    })
    
    // 预付单查询
    .state('app.prepaySel', {
        url: 'prepay/sel',
        views: {
            'content@': {
                templateUrl: 'tpl/prepaySel.html?time='+ new Date().getTime(),
                controller: 'prepaySelCtrl',
            }
        }
    })
    
     // 待审批预付单
    .state('app.prepayWait', {
        url: 'prepay/wait',
        views: {
            'content@': {
                templateUrl: 'tpl/prepayWait.html?time='+ new Date().getTime(),
                controller: 'prepayCtrl',
            }
        }
    })
    
    
     // 提交财务
    .state('app.submitToFinancePre', {
        url: 'prepay/financ',
        views: {
            'content@': {
                templateUrl: 'tpl/prepayFinance.html?time='+ new Date().getTime(),
                controller: 'preFinanceCtrl',
            }
        }
    })
    
    // 白名单下载
    .state('app.WdownExcel', {
        url: 'white/getall',
        views: {
            'content@': {
                templateUrl: './tpl/white/downExcel.html?time='+new Date().getTime(),
                controller: 'whiteDataMgCtrl',
            }
        }
    })



/***********************************************塔维页面部分*************************************************/ 


    /**
    *
    *塔维稽核管理
    * 
    */
    // 新增或修改 塔维稽核单
    .state('app.addTowerAudit', {
        url: 'addTowerAudit/:status/:id',
        views: {
            'content@': {
                templateUrl: 'tw/addAudit.html?time='+ new Date().getTime(),
                controller: 'addTowerAuditCtrl',
            }
        }
    })


    // 电费录入
    .state('app.towerInputTariff', {
        url: 'towerInputTariff/tariffSubmit',
        views: {
            'content@': {
                templateUrl: 'tw/tariffSubmit.html?time='+ new Date().getTime(),
                controller: 'towerInputTariffCtrl',
            }
        }
    })


    // 电费稽核 
    .state('app.towerAuditTariff', {
        url: 'towerAuditTariff/twAudit',
        views: {
            'content@': {
                templateUrl: 'tw/tariffAudit.html?time='+ new Date().getTime(),
                  controller: 'towerAuditCtrl',
            }
        }
    })

    // 提交财务
    .state('app.towerInputFinance', {
        url: 'towerInputFinance/SubmitFinancial',
        views: {
            'content@': {
                templateUrl: 'tw/SubmitFinancial.html?time='+ new Date().getTime(),
                 controller: 'towerSubmitfinancial',
            }
        }
    })



   /**
    *
    *塔维基础数据管理
    * 
    */

    // 塔维----------维护数据修改管理
    .state('app.towerBasedatamanager', {
        url: 'towerMainTainData/manager',
        views: {
            'content@' : {
                templateUrl: 'tw/mainTainData.html?time='+ new Date().getTime(),
                controller: 'towerMainTainDataCtrl',
            }
        }
    })

    /****************************************************塔维转供电开始**************************************/
     //基础数据维护---塔维转供电改造管理路由noone
    .state('app.towerTransEletricityInfo', {
        url: 'towerTransEletricity/info',
        views: {
            'content@': {
                templateUrl: 'tw/transEletricityManager.html?time='+ new Date().getTime(),
                controller: 'towerTransEletricityManagerCtrl',
                reload:true,
            }
        }
    })

    //基础数据维护---塔维新增转供电页面路由noone
    .state('app.towerAddTransEletricity',{
    	url:'towerTransEle/add',
    	views:{
    		'content@': {
    			templateUrl: 'tw/addTransDialog.html?time='+new Date().getTime(),
    			controller: 'towerAddTransEletricityCtrl',
                 reload:true,
    		}
    	}
    })


    //基础数据维护---塔维转供电审批路由noone
    
    .state('app.towerTransAppro', {
        url: 'towerTransAppro/data',
        views: {
            'content@': {
                templateUrl: 'tw/transEleAppro.html?time='+ new Date().getTime(),
                controller: 'towerTransApproManagerCtrl',
                reload:true,
            }
        }
    })



     /****************************************************塔维转供电结束**************************************/
   // 基础数据呈现
   .state('app.towerDisplayData', {
        url: 'towerDisplayData/basicData',
        views: {
            'content@': {
                templateUrl: 'tw/basicDate.html?time='+ new Date().getTime(),
                controller: 'towerDisplayData',
            }
        }
    })


    // 基础数据维护---合同信息管理
   .state('app.towerContractInfo', {
        url: 'towerContractInfo/contractManager',
        views: {
            'content@': {
                templateUrl: 'tw/contractManager.html?time='+ new Date().getTime(),
                controller: 'towerContractInfoCtrl',
            }
        }
    })


    // 基础数据维护---供电信息管理
   .state('app.towerEletricityInfo', {
        url: 'towerEletricityInfo/supplierPowerManager',
        views: {
            'content@': {
                templateUrl: 'tw/supplierPowerManager.html?time='+ new Date().getTime(),
                controller: 'towerEletricityInfoCtrl',
            }
        }
    })


    // 基础数据维护---发票信息管理
   .state('app.towerInvoiceInfo', {
        url: 'towerInvoiceInfo/invoiceManage',
        views: {
            'content@': {
                templateUrl: 'tw/invoiceManage.html?time='+ new Date().getTime(),
                controller: 'towerInvoiceInfoCtrl',
            }
        }
    })
   

     // 基础数据维护---额定功率管理
   .state('app.towerRMS', {
        url: 'towerRMS/ratedManager',
        views: {
            'content@': {
                templateUrl: 'tw/ratedManager.html?time='+ new Date().getTime(),
                controller: 'towerRMSCtrl',
            }
        }
    })


    // 基础数据维护---其他信息管理
   .state('app.towerAdditionalInfo', {
        url: 'towerAdditionalInfo/otherManager',
        views: {
            'content@': {
                templateUrl: 'tw/otherManager.html?time='+ new Date().getTime(),
                controller: 'towerAdditionalInfoCtrl',
            }
        }
    })


   // 基础标杆管理---额定功率标杆
   .state('app.towerRMSBenchmark', {
        url: 'towerRMSBenchmark/ratedMark',
        views: {
            'content@': {
                templateUrl: 'tw/ratedMark.html?time='+ new Date().getTime(),
                controller: 'towerRMSBenchmarkCtrl',
            }
        }
    })


    // 基础标杆管理---智能电表标杆
   .state('app.towerSmartMeterBenchmark', {
        url: 'towerSmartMeterBenchmark/smbenchmark',
        views: {
            'content@': {
                templateUrl: 'tw/smbenchmark.html?time='+ new Date().getTime(),
                // controller: 'towerSmartMeterBenchmarkCtrl',
            }
        }
    })

    //用户管理
    .state('app.towerUser', {
        url: 'user/mannager',
        views: {
            'content@': {
                templateUrl: 'tpl/userMannager.html?time='+ new Date().getTime(),
                controller: 'userMannagerCtrl',
            }
        }
    })

    

     //角色管理
    .state('app.towerRole', {
        url: 'system/roles',
        views: {
            'content@': {
                templateUrl: 'tpl/roles.html?time='+ new Date().getTime(),
                controller: 'rolesCtrl',
            }
        }
    })

    // 基础标杆管理---开关电源标杆
   .state('app.towerSMPSBenchmark', {
        url: 'towerSMPSBenchmark/switchpowerpole',
        views: {
            'content@': {
                templateUrl: 'tw/switchpowerpole.html?time='+ new Date().getTime(),
                // controller: 'towerSMPSBenchmarkCtrl',
            }
        }
    })


    // 基础数据维护---数据导入
   .state('app.towerInputData', {
        url: 'towerInputData/dataExprot',
        views: {
            'content@': {
                templateUrl: 'tw/dataExprot.html?time='+ new Date().getTime(),
                 controller: 'towerInputDataCtrl',
            }
        }
    })


    // 统计报表
    .state('app.towerStatisticsReport', {
        
        url: 'towerStatistics/report',
        views: {
            'content@': {
                templateUrl: 'tw/towerStatisticsReport.html?time='+ new Date().getTime(),
                controller: 'towerStatisticsReportCtrl',
            }
        }
    })
    //塔维流程管理
    .state('app.towerWorkflow', {
        url: 'process',
        views: {
            'content@': {
                templateUrl: 'tpl/processManage.html?time='+ new Date().getTime(),
                controller: 'processManageCtrl',
            }
        }
    })

    //系统操作日志

    .state('app.towerOperationLog', {
        url: 'system/logs',
        views: {
            'content@': {
                templateUrl: 'tpl/logs.html?time='+ new Date().getTime(),
                controller: 'logCtrl',
            }
        }
    })

    //nav-tree 树形菜单
    .state('app.navtree', {
        url: 'system/navtree',
        views: {
            'content@': {
                templateUrl: 'tpl/navtree.html?time='+ new Date().getTime(),
                controller: 'userMannagerCtrl',
            }
        }
    })



}]);


























































































//Access-token Injector
app.factory('accessTokenInjector', ['lsServ',function(lsServ) {
    var accessTokenInjector = {
        request: function(config) {

            // if(lsServ.getValue('token') ==null){
            //    msg("登录状态已过期，请重新登录！",function () {
            //        // logout();
            //    });
            // }
            //if(config.url.indexOf('.html')<0){
            //    config.headers['token'] = lsServ.getValue('token');
            //}

            //config.headers['X-Requested-With"'] ="XMLHttpRequest";

            return config;
        },
        response: function (response) {


            if(response.data.code!=undefined){
                //console.log("<><><><><><>",response.data.code);
                if(response.data.code!=200){
                    console.log(response.data.code);
                    var json= response.data.message;
                    console.log('josn---->',json);
                    if(json && json=="loginerror"){
                        window.location.href='tpl/sessionError.html';
                        return;
                    }
                    error(response.data.message || response.data.data);

                }

            }

            return response;
        }
    };

    return accessTokenInjector;

}]);

//http loading Injector
app.factory('httpLoadingInjector',['$rootScope','$q',function($rootScope,$q) {
    var accessTokenInjector = {
        request: function(config) {

            $rootScope.httpLoading=true;
            return config;
        },

        response: function (response) {
            $rootScope.httpLoading=false;

            if(response.status!=200){
                console.log("Response-Error:",response);
            }


            return response;
        },
        responseError: function(err){

            console.log("err:",err);

            if(500 == err.status) {
                // 处理各类自定义错误
                $rootScope.httpLoading=false;
                msg("服务出问题拉,联系系统维护人员吧");

                console.log(err);


            } else if(404 == err.status) {

                msg("服务找不到了，请联系维护人员！")

            }else if(403  == err.status) {
                msg("登录状态已过期，请重新登录！",function () {
                   // logout();
                });

            }else{
                msg("服务找不到了，请联系维护人员！",function () {
                  // logout();
                });

            }


            $rootScope.httpLoading=false;
            return $q.reject(err);
        }
    };

    return accessTokenInjector;

}]);







/**
 * 本地存储
 */
app.service('lsServ', ['ipCookie',function(ipCookie){

        if(!window.sessionStorage){
            return {

                setValue:function(key,value){
                    ipCookie(key, value);
                },
                getValue:function(key){

                    return  ipCookie(key);
                    //console.log(window.localStorage.getItem(key))
                }
            }

        //使用cookie 存储
        }else{

            var storage=window.sessionStorage;
            return {

                setValue:function(key,value){
                    storage.setItem(key,value);
                },
                getValue:function(key){

                    return storage.getItem(key);

                }
            };

        }

}]);

app.directive('noData', [function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
           scope: {
              has:'='
           }, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
         restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
         template: '<div ng-if="has" class="row">'

        +'<div class="col-sm-12" style="margin-top:200px;">'
        +    '<div class="modal-center animated fadeInUp text-center" style="width:200px;margin:-100px 0 0 -100px;">'
        +        '<div class="thumb-lg">'
        +            '<i class="icon-puzzle" style="font-size:50px;"></i>'
        +        '</div>'
        +       ' <p class="h4 m-t m-b">暂无相关数据哟！</p>'
        +    '</div>'
        +' </div>'
        +'</div>',
        // templateUrl: '',
        replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
        }
    };
}]);

app.directive('serachBox', function(){
    // Runs during compile
    return {
        name: 'serachBox',
        scope: {
            ngModel:'=',
            placeholder:'@',
            method:'&',
        },
        restrict: 'EA',

        template:  '<div class="input-group">'
        +'<input  ng-keypress="search($event)" ng-model="ngModel" class="input-sm form-control ng-pristine ng-valid ng-empty ng-touched" placeholder="{{placeholder}}" type="text">'
        +'<span class="input-group-btn">'
        +   '<button ng-click="method()" class="btn btn-sm btn-default" type="button">Go!</button>'
        +'</span>'
        +'</div>',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {
            $scope.search=function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.method();
                }
            };
        }
    };
});

/*app.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return { 
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px' 
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
});*/

