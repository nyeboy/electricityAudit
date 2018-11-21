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
        "expenseTotalAmount":"",//核销总金额
        "paymentAmount":"",//支付总金额
        "attachmentId":[],//附件　ids
        "watthourExtendVOs":[],//各电表信息,
        "sysSupplierID":"",//供应商ID
        "electrictyMidInvoices":[],  // 自维电费金额及发票信息
        //"sysSupplierName":"",//供应商名称
        "sysRgID":"", // 报账组名称
        "remark":"",//备注
		"overproofReasons":""//超标原因

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


    //获取报账点列表
    $scope.getData=function(siteName){
        angular.extend($scope.params,{
            "cityId":$scope.cityId,
            "countyId":$scope.countyId,
            "siteName":siteName,
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
        $scope.isAudit = false;
        $scope.isEditAudit = true;
        var obj= utils.getCheckedValsForRadio('#siteList');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        $scope.siteObject= JSON.parse(obj);
        $scope.resultData.sysAccountSiteId=$scope.siteObject.id;
        $scope.getIsClud($scope.siteObject.id);  //是否包干
        $scope.getSuppliers($scope.siteObject.id); //查询对应的供应商
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
                }
            })
        });
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
        item.dayAmmeter= utils.getDays(item.belongStartTime,item.belongEndTime) + 1;
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
        item.totalEleciric= parseFloat(sum).toFixed(2);
        $scope.watthourMeterVOs[index]=item;
        $scope.countElectrictyItemPrice(item,index);
    }


    // 计算单个电表的金额
    $scope.countElectrictyItemPrice=function(item,index){
        var total; //单个电表总金额
        if($scope.invoiceVOs.length == 0){
            utils.msg("目前暂无税率信息，请联系管理员后配置后再进行计算!");
            return;
        }else if($scope.invoiceVOs[0].billTax == "0"){
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice;
        }else {
            if(!item.unitPrice){item.unitPrice = null;}
            total=item.totalEleciric*item.unitPrice*($scope.invoiceVOs[0].billTax/100);
        }
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
        $scope.resultData.paymentAmount = sum.toFixed(2); // 支付总金额
        // 录入电费页面修改
        if(!$scope.flagSave && $scope.flagSave != undefined) {
            if(isNaN(parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost))){
                return;
            }
            $scope.singleDetail.paymentAmount= parseFloat($scope.resultData.totalAmount - $scope.singleDetail.otherCost).toFixed(2)      //页面上的数据
            $scope.singleDetail.totalAmount = $scope.resultData.totalAmount;  // 页面显示的数据
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
            $scope.electrictyMidInvoices = $scope.resultData.electrictyMidInvoices; //电费录入 ---修改详情页面显示修改的发票
        }else {
            $scope.disabled = true;
            $scope.resultData.paymentAmount = parseFloat($scope.resultData.totalAmount - $scope.resultData.otherCost).toFixed(2);
             //新增稽核单-----计算发票税金金额
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
        }
    }

    // 手动填写其他费用
    $scope.changeTotalAmount = function(){

        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if(!reg.test($scope.resultData.otherCost)){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
            return;
        }else if(!$scope.resultData.otherCost && $scope.resultData.otherCost.length > 20){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }else if(!$scope.resultData.otherCost && $scope.resultData.otherCost < 0){
            utils.msg("数值不能为负。");
            return;
        }else if($scope.resultData.otherCost){
            $scope.resultData.paymentAmount = parseFloat($scope.resultData.totalAmount - $scope.resultData.otherCost).toFixed(2);  //支付总金额
        }else {
            $scope.resultData.paymentAmount = parseFloat($scope.resultData.totalAmount).toFixed(2);
        }

        if($scope.resultData.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
            $scope.resultData.electrictyMidInvoices.splice(0,1,{
                "taxAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
                "electricityAmount": parseFloat(($scope.resultData.totalAmount-$scope.resultData.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
            })
        }
    }


    //关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }


    //获取电表明细----对应电表个数
    $scope.getDianBiaoDetail=function(){
        debugger;
        var siteId=$scope.resultData.sysAccountSiteId;
        if(siteId=='' && $scope.flagSave == undefined && $scope.flag == undefined){
            utils.msg("请先选择报账点！");
            return;
        }else if(siteId !== ""){
            debugger;
            // 电表数组为空新增   电表数组不为空直接显示--------新增电表时
            if(!$scope.watthourMeterVOs || $scope.watthourMeterVOs.length < 1){
                $scope.isNew = true;   //默认显示viewMaxReading
                commonServ.getInputElectrictyDetail(siteId).success(function(data){
                    if(data != "" && data.watthourMeterVOs.length > 0){
                        for(var index=0; index<data.watthourMeterVOs.length; index++) {
                            data.watthourMeterVOs[index].watthourId = data.watthourMeterVOs[index].id;
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
            // 查看修改电表信息时
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


    //电费明细提交
    $scope.submitDetail=function(ngDialog){

        var writedList = [];
        //查看有没有填完整的电表
        for(var index=0; index<$scope.watthourMeterVOs.length; index++){
            var meterVo = $scope.watthourMeterVOs[index];
            $scope.checkNumber(meterVo);  //再次校验
            // 如果翻表为否，删除最大读数；
            if(!meterVo.whetherMeter){
                delete meterVo.maxReading;
            }
            if(!meterVo || !meterVo.belongStartTime || !meterVo.belongEndTime || !meterVo.dayAmmeter || (!meterVo.startAmmeter && meterVo.startAmmeter != 0) || (!meterVo.endAmmeter && meterVo.endAmmeter != 0) || (!meterVo.totalEleciric && meterVo.totalEleciric != 0) || (!meterVo.totalAmount && meterVo.totalAmount != 0) || (!meterVo.unitPrice && meterVo.unitPrice != 0) ){
                isEmpty = false;
            }else if((meterVo.totalAmount != null || meterVo.totalAmount != "0.00") && meterVo.dayAmmeter != null){
                isEmpty = true;
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
                        $scope.closeDialog(ngDialog);
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
                    $scope.closeDialog(ngDialog);
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
        if($scope.disabled){ // 只有一张发票且初始时
            item.electricityAmount= parseFloat(($scope.resultData.totalAmount - $scope.resultData.otherCost) / ((item.billTax/100)+1)).toFixed(2) ; //电费金额不含税
        }
        item.taxAmount = parseFloat(item.electricityAmount* (item.billTax/100)).toFixed(2);  //税金金额
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



    // 保存新增稽核单
    $scope.saveElectricty=function(status){

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
        }
    }

    // 提交新增稽核单
    $scope.submitElectricty=function(status){

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
            $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount - $scope.singleDetail.otherCost).toFixed(2);  //支付总金额
        }else {
            $scope.singleDetail.paymentAmount = parseFloat($scope.singleDetail.totalAmount).toFixed(2);
        }
        if($scope.singleDetail.electrictyMidInvoices.length==1) {
            $scope.disabled = true;
            $scope.singleDetail.electrictyMidInvoices.splice(0,1,{
                "taxAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)*($scope.invoiceVOs[0].billTax/100)).toFixed(2),    // 税金金额
                "electricityAmount": parseFloat(($scope.singleDetail.totalAmount-$scope.singleDetail.otherCost) / (($scope.invoiceVOs[0].billTax/100)+1)).toFixed(2),  //电费不含税
                "invoiceId":$scope.invoiceVOs[0].id,
                "billType":$scope.invoiceVOs[0].billType,
                "billTax":$scope.invoiceVOs[0].billTax,
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
            "watthourExtendVOs":$scope.singleDetail.watthourMeterVOs,
            "electrictyMidInvoices":$scope.electrictyMidInvoices,
            "sysRgID":$scope.singleDetail.sysRgID,
            "remark":$scope.singleDetail.remark,
			"overproofReasons":$scope.singleDetail.overproofReasons
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
            "statuses":"0,7"
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

            });
        });
    };



    //跳转到添加或修改页面
    $scope.goAddPage=function(){
        $state.go('app.addAudit',{
            'status':'add',
            'id':'none'
        });
    }

    $scope.tab=1;

    //列表单个查看、修改详情
    $scope.showSubmitDetail=function(item,flag,save){

        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮
        $scope.editZiweiID= item.id;
        $scope.isZWsubmitSave = save;
        // 列表单个详情
        commonServ.getInputElectrictyById(item.id).success(function (data) {
            utils.loadData(data,function (data) {

                $scope.singleDetail = data.data;
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
            })
        });

        $scope.showZweiDialog=ngDialog.open({
            template: './tpl/auditPageDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'addOrUpdateAuditCtrl',
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

    //获取报账组列表
    $scope.sysRgList = [];
    commonServ.queryAccount().success(function(data){
        utils.loadData(data,function(data){
            $scope.sysRgList=data.data.results;
        })
    });



    // 查询报账组
    commonServ.queryAccount().success(function(data) {
    	$scope.accountList = data.data.results;
    });

     //获取电费列表   生成电费提交单查询--弹出框中按钮  公用
    $scope.getZwAuditDetail=function() {

        angular.extend($scope.params,{
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
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
				$scope.page11 = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
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


    //   //关闭弹出框
    // $scope.closeDialog=function(dialog){
    //     $scope[dialog].close("");
    // }



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
            "reason":""
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
           "serialNumber":$scope.serialNumber,
           "createStartDate":$("#createDate").val(),
           "createEndDate":$("#endDate").val(),
           "accountName": $scope.accountName,
           "statuses":"2"
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


    /**
     * 稽核页面打开生成电费提交单--弹出框
     */
    $scope.createSubmitOrderDialog=function (){
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

            list= utils.getCheckedVals('#SubmitOrder',false);

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


        $scope.saveOrderDialog=ngDialog.open({

            template: './tpl/viewElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });


        // 保存提交单
        $scope.saveDialog= function() {

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


    };




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

        // 电费提交单详情
        commonServ.getViewElectricDetails(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.listDetail = data.data.data.electrictyListVOs;
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

    //公共关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }


}]);