
/*
* @Author: tmliua
* @Date:   2017-05-08 09:51:35
* @Last Modified by:   tmliua
* @Last Modified time: 2017-02-07 10:19:58
*/
/**
*
*  稽核流程---新增稽核单  addTowerAuditCtrl 公用模块（包含电费录入--新增稽核单   电费录入--修改、查看稽核单   电费稽核---修改、查看稽核单）
*/
app.controller('addTowerAuditCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'towerAuditServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, towerAuditServ) {

	/**
     *新建稽核单所需的数据
    */
    $scope.resultData={
        "isSfSite":"",                          //是否为三方铁塔 铁塔类型，1，铁塔公司 2 ，三方铁塔
        "id":"",                              // id
        "serialNumber":new Date().getTime(),  //流水号
        "sysTowerSitId":"",                  //铁塔站址ID
        "sysTowerSitNo":"",                  //铁塔站点编号
        "zgSpaceSiteName":"",                //资管站点名称
        "zgTowerSiteName":"",                //铁塔地址名称
        "status":"",                         //状态
        "shareAmount":"",                    //分摊电费金额
        "towerWatthourMeterVOs":[],           //塔维电表信息
        "costCenterID":"",                          //成本中心ID
        "contractNo":"",                            // 合同编号
        "isClud":"",                                //是否包干；1 包干；0 非包干
        "supplierName":"",                           //供应商名称
        "overProoFreAsons":"",						//超标杆原因
        "isOnline":"",							//稽核单在网状态
   		"ptype":""                              //电表类型1普通 2智能
    }



/********************************************************新增稽核和电费录入公共部分****************************************************************/


    /**
     * 获取稽核单号、地市、区县
     * @getTowerElectrictyInfo()
     * @return {[type]}  {resultData}
     */
    towerAuditServ.getTowerElectrictyInfo().success(function(data){
        $scope.resultData.serialNumber=data.serialNumber;  // 流水号
        $scope.resultData.areas=data.areas;                // 地市
        $scope.resultData.counties=data.counties;          // 区县
    });


    /**
     * [costCeterVOs description]  获取成本中心
     * @type {Array}
     */
    $scope.costCeterVOs=[];
    towerAuditServ.getTowerCostCeterVOsInfo().success(function(data){
        utils.loadData(data,function(data){
            $scope.costCeterVOs=data.data;
            console.log(data)
            // $scope.resultData.costCenterID = $scope.costCeterVOs[0].costCenterName;
        })
    });

     /**
     * [pageInfo description] 塔维编号页面数据
     * @type {Object}
     */
    $scope.pageInfoTowerSite = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.paramsTowerSite = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };


    /**
     * / 铁塔站址编号查询列表
     * @param  {[type]} towerSiteInfo [description]
     * @return {[type]}               [description]
     */
    $scope.getData=function(towerSiteInfo){

        // todo 根据条件查询
        angular.extend($scope.paramsTowerSite,{
            "zyName": towerSiteInfo ,  //资管站点名称
            "isSfSite":$scope.resultData.isSfSite,//铁塔类型
        })
        towerAuditServ.getTowerSiteInfo($scope.paramsTowerSite).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfoTowerSite.totalCount = data.data.totalRecord;
                $scope.pageInfoTowerSite.pageCount = data.data.totalPage;
                $scope.paramsTowerSite.page = data.data.pageNo;
                $scope.list = data.data.results;
            }
 )       });
    };


        // 切换类型
    $scope.towerType = "";
    $scope.choiceType = function(towerType) {
        $scope.towerType = towerType;//选取铁塔类型

        if(towerType == 1){
            $scope.resultData.isSfSite = "1";
            delete $scope.resultData.sysTowerSitNo;
            delete $scope.resultData.zgSpaceSiteName;
            delete $scope.resultData.zgTowerSiteName;
            delete $scope.resultData.costCenterID;
            delete $scope.supplierObject.supplierName;
        }
        if(towerType == 2){
            $scope.resultData.isSfSite = "2";
            delete $scope.resultData.sysTowerSitNo;
            delete $scope.resultData.zgSpaceSiteName;
            delete $scope.resultData.zgTowerSiteName;
            delete $scope.resultData.costCenterID;
            delete $scope.supplierObject.supplierName;
        }
        console.log(towerType)
       
    }


    $scope.conf = [];   // 报账点
    $scope.confs = []; //供货商
    $scope.siteObject={};  //选取的铁塔数据
   
    // 铁塔站址编号弹出框
    $scope.getTowerSite=function(){
        //要先选择铁塔类型
        if($scope.resultData.isSfSite == "" ) {
            utils.msg("请先选择铁塔类型！");
            return;
        }
            $scope.towerSiteDialog=ngDialog.open({
                template: './tw/toweraddressnumlistDialog.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                width: 800,
                scope: $scope,
            });
    }


    /**
     * / 选取铁塔站址名称
     * @return {[type]} [description]
     */
    $scope.choiceTowerSite=function(){

        // 获取当前信息
        var obj= utils.getCheckedValsForRadio('#siteList');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        $scope.siteObject= JSON.parse(obj);
        if($scope.siteObject.isClud=="1"){
            $scope.siteObject.isClud = "包干";
        }else if($scope.siteObject.isClud=="0"){
            $scope.siteObject.isClud = "不包干";
        }else if($scope.siteObject.isClud == null){  //6/7此处修改
            $scope.siteObject.isClud = null;
        }
        
        //获取报账点是否存在未锁定的机房
        towerAuditServ.getSiteNoRoomIsOnline($scope.siteObject.zyCode).success(function(data){
        	debugger;
        	var data1 = data.data;
        	$scope.siteNoRoomIsOnline = data1;
        	if(data1.onlineRoomNum == 0 && data1.noOnLineRoomNum == 0){
        		alert("该站点无对应可报账机房！");
        		return;
        	}
        	if(data1.onlineRoomNum == 0 && data1.noOnLineRoomNum != 0){
        		alert("该站点只存在退网机房,开始进行最后一次报账!")
        	}
        })

        // 新增稽核单数据
        $scope.resultData.sysTowerSitId = $scope.siteObject.id;         // 铁塔站址ID
        $scope.resultData.sysTowerSitNo = $scope.siteObject.zyCode;     //铁塔站点编号
        $scope.resultData.zgSpaceSiteName = $scope.siteObject.zhLabel;  //资管站点名称
        $scope.resultData.zgTowerSiteName = $scope.siteObject.zyName;  //铁塔地址名称
        $scope.resultData.isClud =  $scope.siteObject.isClud;
        // 修改稽核单数据   519将新增和修改稽核单整合
        if(!$scope.flagSave  && $scope.flagSave != undefined) {
            if($scope.listDetail.length == 0 && $scope.object.isClud=="包干"){
                $scope.isElectric = true;
            }else{
                $scope.object.shareAmount = null;
            }
            debugger;
	        $scope.object.sysTowerSitId = $scope.siteObject.id;         // 铁塔站址ID
	        $scope.object.sysTowerSitNo = $scope.siteObject.zyCode;     //铁塔站点编号
	        $scope.object.zgSpaceSiteName = $scope.siteObject.zhLabel;  //资管站点名称
	        $scope.object.zgTowerSiteName = $scope.siteObject.zyName;  //铁塔地址名称
            $scope.object.isClud =  $scope.siteObject.isClud;
	    }
		 towerAuditServ.selectWatthour($scope.siteObject.zyCode).success(function (data) {
                utils.loadData(data,function (data) {
					if(data.data!=null){
					for(var i=0;i<data.data.length;i++){
						data.data[i].belongStartTime=$scope.dataChange(data.data[i].belongStartTime);
						data.data[i].belongEndTime="";
						if(data.data[i].paymentAccountCode==null){
							data.data[i].paymentAccountCode="";
						}
					}					
                    $scope.resultData.towerWatthourMeterVOs=data.data;
					}
                })
            });
        console.log("站址信息",angular.toJson($scope.siteObject,true));
        $scope.closeDialog("towerSiteDialog");
    }





    /**
     * [pageInfo description] 获取供应商数据
     * @type {Object}
     */
    $scope.pageInfoSupplier = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.paramsSupplier = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

    /**
     * / 供应商弹出框
     * @return {[type]} [description]
     */
    $scope.choiceSupplierDialog=function(){

        $scope.choiceSupplierDialogs=ngDialog.open({
            template: './tw/supplierDetailsDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
            scope: $scope,
        });


        // 获取供应商列表信息
        $scope.getDataSupplier=function(supplierName){

            angular.extend($scope.paramsSupplier,{
                "name":supplierName               // 供货商名称
            })
            towerAuditServ.querySupplier($scope.paramsSupplier).success(function (data) {
                utils.loadData(data,function (data) {
                    $scope.pageInfoSupplier.totalCount = data.data.totalRecord;
                    $scope.pageInfoSupplier.pageCount = data.data.totalPage;
                    $scope.paramsSupplier.page = data.data.pageNo;
                    $scope.suppliers=data.data.results;
                })
            });
        }
    }


    /**确定供货商
     * [supplierObject description]
     * @type {Object}
     */
    $scope.supplierObject={};  //选取的铁塔供货商数据
    $scope.choiceSupplier=function(){
        var obj= utils.getCheckedValsForRadio('#SupplieList');
        if(obj==null){
            utils.msg("请选择一个项目！");
            return;
        }
        obj= JSON.parse(obj);
        console.log("供货商信息",angular.toJson(obj,true));
        $scope.supplierObject.supplierName=obj.name;
        $scope.regionCode=obj.vendorCode;//供应商地点id--暂时未使用
        if(!$scope.flagSave && $scope.flagSave != undefined) {
        	 $scope.object.supplierName = obj.name;      //修改稽核单页面供货商数据   此处519修改将新增稽核单和修改稽核单整合
        }
        
        $scope.resultData.supplierName=obj.id;     //获取供应商ID
        $scope.closeDialog("choiceSupplierDialogs");

    }


    var isEmpty = true;  //判断电表信息是否填写完整
    var isRightReg = true;  // 判断电表信息是否符合规矩
    // 校验数据
    $scope.checkNumber=function(meterVo){
        var reg = /^[\+\-]?[0-9]\d*(\.\d{1,2})?$/;//用来验证数字，包括小数的正则
        if((meterVo.rate != null && meterVo.rate.length > 20) || (meterVo.startAmmeter != null && meterVo.startAmmeter.length > 20) || (meterVo.endAmmeter != null && meterVo.endAmmeter.length > 20) || (meterVo.totalEleciric != null && meterVo.totalEleciric.length > 20) || (meterVo.payAmount != null && meterVo.payAmount.length > 20) || (meterVo.unitPrice != null && meterVo.unitPrice.length > 20) || (meterVo.otherAmount != null && meterVo.otherAmount.length > 20) || (meterVo.actualAmount != null && meterVo.actualAmount.length>20) ){
            utils.msg("数值类型长度不能超过20个字符。");
                isRightReg = false;
                return;
        }else if(meterVo.rate != null || meterVo.startAmmeter != null || meterVo.endAmmeter != null || meterVo.totalEleciric != null  || meterVo.payAmount != null || meterVo.unitPrice != null || meterVo.otherAmount != null || meterVo.actualAmount != null){
                isRightReg = true;
                return;
        }
        if((meterVo.rate != null && !reg.test(meterVo.rate) )||(meterVo.startAmmeter != null && !reg.test(meterVo.startAmmeter) )|| (meterVo.endAmmeter != null && !reg.test(meterVo.endAmmeter)  ) || (meterVo.totalEleciric != null && !reg.test(meterVo.totalEleciric) )|| (meterVo.payAmount != null && !reg.test(meterVo.payAmount) )|| (meterVo.unitPrice != null && !reg.test(meterVo.unitPrice) ) || (meterVo.otherAmount != null && !reg.test(meterVo.otherAmount)) || (meterVo.electricLoss != null && !reg.test(meterVo.electricLoss)  )){
            utils.msg("请填入不含有空格的数字或小数点保留后两位的数字类型。");
                isRightReg = false;
                return;
        }else if(meterVo.rate != null || meterVo.startAmmeter != null || meterVo.endAmmeter != null || meterVo.totalEleciric != null  || meterVo.payAmount != null || meterVo.unitPrice != null || meterVo.otherAmount != null || meterVo.actualAmount != null){
                isRightReg = true;
                return;
        }
        // // 此处修改-----当总用电止度为空的时候校验总电量为负数 meterVo.endAmmeter != null
        if( (meterVo.startAmmeter != null && meterVo.startAmmeter < 0 )|| (meterVo.endAmmeter != null && meterVo.endAmmeter < 0 )||  (meterVo.totalEleciric != null && meterVo.totalEleciric < 0  && meterVo.endAmmeter != null)|| (meterVo.payAmount != null && meterVo.payAmount < 0)|| (meterVo.unitPrice != null && meterVo.unitPrice < 0 ) || (meterVo.otherAmount != null && meterVo.otherAmount < 0 )){
            utils.msg("数值不能为负。");
                isRightReg = false;
                return;
        }else if(meterVo.rate != null || meterVo.startAmmeter != null || meterVo.endAmmeter != null || meterVo.totalEleciric != null  || meterVo.payAmount != null || meterVo.unitPrice != null || meterVo.otherAmount != null || meterVo.actualAmount != null){
                isRightReg = true;
                return;
        }
        // }else if((meterVo.startAmmeter != null) || (meterVo.endAmmeter != null) || (meterVo.dayAmmeter != null) || (meterVo.totalEleciric != null ) || (meterVo.totalAmount != null) || (meterVo.unitPrice != null)){
        //         isRightReg = true;
        // }
        // if(meterVo.remarks != null &&　meterVo.remarks.length > 150){
        //      utils.msg("备注长度不能超过150个字符。");
        //         isRightReg = false;
        //         return;
        // }else if(meterVo.remarks != null){
        //         isRightReg = true;
        // }
    }


    /**
     * 计算电表的用电量
     * @param  {[type]} electricInfo [description]
     * @param  {[type]} index        [description]
     * @return {[type]}              [description]
     */
    $scope.countPowerSize=function(electricInfo,index){
        
        // $scope.checkNumber(electricInfo); 暂时隐藏
        //翻表
        if(electricInfo.whetherMeter==1){
             // 翻表总电量=(最大读数+用电止度-用电起度)*倍率+电损
            var sum1=(Number(electricInfo.maxReading)+Number(electricInfo.endAmmeter)-Number(electricInfo.startAmmeter))*Number(electricInfo.rate);
            sum1 += Number(electricInfo.electricLoss);
	        electricInfo.totalEleciric = parseFloat(sum1).toFixed(2);
        }else{
            // 不翻表总电量=(用电止度-用电起度)*倍率+电损
            var sum=(electricInfo.endAmmeter - electricInfo.startAmmeter)*electricInfo.rate;            
        	sum += Number(electricInfo.electricLoss);
            electricInfo.totalEleciric = parseFloat(sum).toFixed(2);
        }
    }



    /**
     * 单张电表单价
     * @param  {[type]} electricInfo [description]
     * @return {[type]}              [description]
     */
    $scope.singlePrice = function(electricInfo){
    	// 总缴费金额 / 总电量
        if(!$scope.electricInfo.totalEleciric || $scope.electricInfo.totalEleciric == '0.00' ) {
            return;
        }else{
    	    $scope.electricInfo.unitPrice = parseFloat($scope.electricInfo.payAmount/$scope.electricInfo.totalEleciric).toFixed(2);
            $scope.payInvoiceType();

        }
        console.log($scope.electricInfo.unitPrice);
    }


    /**
     * 选择发票类型
     * @param  {[type]} electricInfo [description]
     * @return {[type]}              [description]
     */
    $scope.payInvoiceType = function(electricInfo){
    	$scope.electricInfo.payBillCoefficient = $scope.electricInfo.payInvoiceType;  //缴费发票系数
    	$scope.electricInfo.otherBillCoefficient = $scope.electricInfo.otherInvoiceType;  //其他发票系数
    	$scope.countActualAmount(electricInfo);
        $scope.countShareAmount();
    }


    /**
     * 计算单个电表的实际支付费用 = 实际缴费金额*缴费系数 + 其他缴费金额*其他缴费系数
     * @param  {[type]} electricInfo [description]
     * @return {[type]}              [description]
     */
    $scope.countActualAmount = function(electricInfo){
    	$scope.electricInfo.actualAmount = parseFloat($scope.electricInfo.payAmount*$scope.electricInfo.payBillCoefficient + $scope.electricInfo.otherAmount*$scope.electricInfo.otherBillCoefficient).toFixed(2);
    }


    // 计算单个分摊电费金额    实际支付总金额*分摊比例
    $scope.countShareAmount = function(){
    	$scope.electricInfo.shareAmount = parseFloat($scope.electricInfo.actualAmount* $scope.electricInfo.shareProportion).toFixed(2);
    }



    // 计算总的分摊电费总金额
    $scope.countShareAmountTotal = function(){
        var ShareAmountTotal=0;
    	for(var i=0; i<$scope.resultData.towerWatthourMeterVOs.length; i++){
            if($scope.resultData.towerWatthourMeterVOs[i].shareAmount != null){
        		ShareAmountTotal += parseFloat($scope.resultData.towerWatthourMeterVOs[i].shareAmount);
                $scope.resultData.shareAmount = parseFloat(ShareAmountTotal).toFixed(2);
            }
        // $scope.object.shareAmount = parseFloat(ShareAmountTotal).toFixed(2);   //修改稽核单页面数据
    	}

    }


    // 计算单个电表的金额
    $scope.countElectrictyItemPrice=function(electricInfo,index){
        var total=electricInfo.totalEleciric*electricInfo.unitPrice;
        electricInfo.totalAmount= parseFloat(total).toFixed(2);
    //     $scope.watthourMeterVOs[index]=electricInfo;
    };


     //公用关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
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




/********************************************************新增稽核单业务****************************************************************/


    // 新增稽核单------新增电表弹出框
    $scope.addElecDialog = function(flag){
        if(!$scope.siteObject.id) {
            utils.msg("请先选择铁塔站址编号！")
        }else{
            $scope.checkDetail = false;
            $scope.editDetail = flag;
            $scope.edit = false; //修改按钮隐藏
            $scope.save = flag;  //保存按钮显示
            $scope.electricInfo={   //电表信息
                    // "id":null,
                    "code":null,                             //电表编号
                    "paymentAccountCode":null,                //电表缴费户号
                    "ptype":null,                        //电表类型。1 普通；2 智能
                    "status":null,                      //状态；1 正常；0 损坏
                    "rate":null,                       //倍率
                    "maxReading":null,                //电表最大读数
                    "electricLoss":null,              //电损（度）
                    "whetherMeter":null,              //是否翻表 (0.否1.是）
                    "belongStartTime":null,               //电费归属起始日期
                    "belongEndTime":null,             //电费归属终止日期
                    "startAmmeter":null,              //用电起度（度）
                    "endAmmeter":null,                //用电止度（度）
                    "totalEleciric":null,             //总电量
                    "payAmount":null,                //缴费金额（元）
                    "unitPrice":null,                //单价(不含税）
                    "otherAmount":null,               //其他费用
                    "actualAmount":null,              //实际支付电费
                    "shareProportion":null,               //分摊比例
                    "shareAmount":null,               //分摊电费金额
                    "payInvoiceType":null,                //缴费发票类型
                    "payBillCoefficient":null,                //缴费开票系数
                    "otherInvoiceType":null,              //其他发票类型
                    "otherBillCoefficient":null              //其他开票系数
            };

            $scope.addElectricInfoDialogs=ngDialog.open({
                template: './tw/addElecDialog.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                width: 1100,
                scope: $scope,
            });
        }
    }



     // 保存电表信息
    $scope.saveElectrictInfo = function(electricInfo,flag){
        var meterVo = $scope.electricInfo;
        if(!meterVo || !meterVo.code || meterVo.whetherMeter==null ||  !meterVo.rate || !meterVo.belongStartTime || !meterVo.belongEndTime || (!meterVo.electricLoss && meterVo.electricLoss != 0)|| (!meterVo.totalEleciric && meterVo.totalEleciric !=0) || (!meterVo.payAmount && meterVo.payAmount !=0)|| !meterVo.payInvoiceType || (!meterVo.unitPrice && meterVo.unitPrice !=0) || (!meterVo.otherAmount && meterVo.otherAmount !=0) || (!meterVo.actualAmount && meterVo.actualAmount !=0) || (!meterVo.shareProportion && meterVo.shareProportion !=0)|| (!meterVo.shareAmount && meterVo.shareAmount !=0)){
            utils.msg("请完成必填项后再提交。");
            return;
        }
		
		if($scope.resultData.towerWatthourMeterVOs!=null&&$scope.resultData.towerWatthourMeterVOs.length>0){			
			for(var i=0;i<$scope.resultData.towerWatthourMeterVOs.length;i++){
				if($scope.electricInfo.code==$scope.resultData.towerWatthourMeterVOs[i].code){
					 utils.msg("电表编码已存在，请从新输入电表编码！");
					 return;
				}
			}
			
		}
        //判断字符长度
        if( meterVo.electricLoss.length>20 || meterVo.totalEleciric.length>20 || meterVo.payAmount.length>20 || meterVo.unitPrice.length>20 || meterVo.otherAmount.length>20 || meterVo.actualAmount.length>20 || meterVo.shareProportion.length>20 || meterVo.shareAmount.length>20 ){
            utils.msg("数值类型长度不能超过20个字符。");
            return;
        }

        if(isNaN(parseFloat(meterVo.electricLoss)) || isNaN(parseFloat(meterVo.totalEleciric)) || isNaN(parseFloat(meterVo.payAmount)) || isNaN(parseFloat(meterVo.unitPrice)) || isNaN(parseFloat(meterVo.otherAmount)) || isNaN(parseFloat(meterVo.actualAmount)) || isNaN(parseFloat(meterVo.shareProportion)) || isNaN(parseFloat(meterVo.shareAmount))){
            utils.msg("请填入正确数值类型。");
            return;
        }
        if(meterVo.shareProportion > 1){
            utils.msg("分摊比例不能大于1。");
            return;
        }

        if($scope.resultData.towerWatthourMeterVOs.length>=0 &&　$scope.electricInfo.shareAmount != null && $scope.electricInfo.shareAmount != "0.00"){
            $scope.resultData.towerWatthourMeterVOs.unshift({
                // "id": "",
                "code": $scope.electricInfo.code,                             //电表编号
                "paymentAccountCode": $scope.electricInfo.paymentAccountCode,                //电表缴费户号
                "ptype": $scope.electricInfo.ptype,                        //电表类型。1 普通；2 智能
                "status": $scope.electricInfo.status,                      //状态；1 正常；0 损坏
                "rate": $scope.electricInfo.rate,                       //倍率
                "maxReading": $scope.electricInfo.maxReading,                //电表最大读数
                "electricLoss": $scope.electricInfo.electricLoss,              //电损（度）
                "whetherMeter": $scope.electricInfo.whetherMeter,              //是否翻表 (0.否1.是）
                "belongStartTime": $scope.electricInfo.belongStartTime,               //电费归属起始日期
                "belongEndTime": $scope.electricInfo.belongEndTime,             //电费归属终止日期
                "startAmmeter": $scope.electricInfo.startAmmeter,              //用电起度（度）
                "endAmmeter": $scope.electricInfo.endAmmeter,                //用电止度（度）
                "totalEleciric": $scope.electricInfo.totalEleciric,             //总电量
                "payAmount": $scope.electricInfo.payAmount,                //缴费金额（元）
                "unitPrice": $scope.electricInfo.unitPrice,                //单价(不含税）
                "otherAmount": $scope.electricInfo.otherAmount,               //其他费用
                "actualAmount": $scope.electricInfo.actualAmount,              //实际支付电费
                "shareProportion": $scope.electricInfo.shareProportion,               //分摊比例
                "shareAmount": $scope.electricInfo.shareAmount,               //分摊电费金额
                "payInvoiceType": $scope.electricInfo.payInvoiceType,                //缴费发票类型
                "payBillCoefficient": $scope.electricInfo.payBillCoefficient,                //缴费开票系数
                "otherInvoiceType": $scope.electricInfo.otherInvoiceType,              //其他发票类型
                "otherBillCoefficient":$scope.electricInfo.otherBillCoefficient              //其他开票系数
            })
            console.log("resultData",angular.toJson($scope.resultData,true));

            if($scope.isElectric){   //包干无电表时添加
                $scope.listDetail = $scope.resultData.towerWatthourMeterVOs;
                //计算修改后的电费的分摊总金额
                var ShareAmountTotal=0;
                for(var i=0; i<$scope.listDetail.length; i++){
                    ShareAmountTotal += parseFloat($scope.listDetail[i].shareAmount);
                    $scope.resultData.shareAmount = parseFloat(ShareAmountTotal).toFixed(2);
                    $scope.object.shareAmount = $scope.resultData.shareAmount;
                }
            }
            // 关闭电表信息弹出框
            $scope.closeDialog("addElectricInfoDialogs");
            $scope.countShareAmountTotal();  //计算总的分摊金额
        }else {
            utils.msg("分摊金额不能为空，请认真填写后再提交！");
        }


    }




    // 修改电表信息  todo待修改  （新增稽核单页面）
    $scope.editedElectrictInfo = function(index,flag){
        $scope.checkDetail = false;
        $scope.editDetail = flag;
    	$scope.save = false; // 保存按钮隐藏
    	$scope.edit = flag;  //修改按钮显示

    	for(var i=0; i<$scope.resultData.towerWatthourMeterVOs.length; i++){
    		if(i==index){
    			$scope.electricInfo = $scope.resultData.towerWatthourMeterVOs[i];  //获取当前修改的电表信息
    		}
    	}

         // 电费生效终止日期
        $scope.electricInfo.belongStartTime = $scope.dataChange($scope.electricInfo.belongStartTime);
		if($scope.electricInfo.belongEndTime!=""){
        $scope.electricInfo.belongEndTime =  $scope.dataChange($scope.electricInfo.belongEndTime);
		}

    	// 修改页面
    	$scope.addElectricInfoDialogs=ngDialog.open({
            template: './tw/addElecDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1100,
            scope: $scope,
        });

        // 保存修改
        $scope.editTowerEdit = function(index){
            var meterVo = $scope.electricInfo;
            if(!meterVo || !meterVo.code || meterVo.whetherMeter==null ||  !meterVo.rate || !meterVo.belongStartTime || !meterVo.belongEndTime || (!meterVo.electricLoss && meterVo.electricLoss != 0)|| (!meterVo.totalEleciric && meterVo.totalEleciric !=0) || (!meterVo.payAmount && meterVo.payAmount !=0)|| !meterVo.payInvoiceType || (!meterVo.unitPrice && meterVo.unitPrice !=0) || (!meterVo.otherAmount && meterVo.otherAmount !=0) || (!meterVo.actualAmount && meterVo.actualAmount !=0) || (!meterVo.shareProportion && meterVo.shareProportion !=0)|| (!meterVo.shareAmount && meterVo.shareAmount !=0)){
                utils.msg("请完成必填项后再提交。");
                return;
            }
            //判断字符长度
            if( meterVo.electricLoss.length>20 || meterVo.totalEleciric.length>20 || meterVo.payAmount.length>20 || meterVo.unitPrice.length>20 || meterVo.otherAmount.length>20 || meterVo.actualAmount.length>20 || meterVo.shareProportion.length>20 || meterVo.shareAmount.length>20 ){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }

            if(isNaN(parseFloat(meterVo.electricLoss)) || isNaN(parseFloat(meterVo.totalEleciric)) || isNaN(parseFloat(meterVo.payAmount)) || isNaN(parseFloat(meterVo.unitPrice)) || isNaN(parseFloat(meterVo.otherAmount)) || isNaN(parseFloat(meterVo.actualAmount)) || isNaN(parseFloat(meterVo.shareProportion)) || isNaN(parseFloat(meterVo.shareAmount))){
                utils.msg("请填入正确数值类型。");
                return;
            }
            if(meterVo.shareProportion > 1){
                utils.msg("分摊比例不能大于1。");
                return;
            }

            if($scope.electricInfo.shareAmount != "0.00") {
                $scope.resultData.towerWatthourMeterVOs[index] = $scope.electricInfo;  // 保存当前修改后的电表信息
                // 关闭电表信息弹出框
                $scope.closeDialog("addElectricInfoDialogs");
            }else {
                utils.msg("分摊电费金额有误，请重新填写后再提交！");
            }

        }
    }



    // 新增稽核单-------保存稽核单（status==0）
    $scope.saveTowerAuditPage=function(status){
        $scope.resultData.status = status;
        if($scope.siteObject.isClud=="包干"){
            $scope.resultData.isClud = 1;
        }else if($scope.siteObject.isClud=="不包干"){
            $scope.resultData.isClud = 0;
        }else {
            $scope.resultData.isClud = null;
        }

      //检测退网状态是否填写
    	var isOnline = $("#isOnline").val();
    	if(isOnline==null || isOnline==""){
    		utils.msg("请选择在网状态后再提交");
    		return;
    	}else{
    		if($scope.siteNoRoomIsOnline.onlineRoomNum == 0 && isOnline=="1"){
    			utils.msg("该站点不存在对应的在网机房，请核对信息后再提交！");
    			return;
    		}
    		if($scope.siteNoRoomIsOnline.noOnLineRoomNum == 0 && isOnline=="2"){
    			utils.msg("该站点不存在对应的退网机房，请核对信息后再提交！");
    			return;
    		}
    		$scope.resultData.isOnline = isOnline;	//将选择的在网状态存入提交数据中
    	}
        
        
        //if($scope.resultData.isClud == 0 && $scope.resultData.towerWatthourMeterVOs.length == 0 || $scope.resultData.supplierName == "") {
        //    utils.msg("信息不完整,请认真填写后再提交！");
        //    return;
        //}
		
		//判断是否有电表填写完整
		var length=$scope.resultData.towerWatthourMeterVOs.length
		if($scope.resultData.towerWatthourMeterVOs.length > 0){
			for(var i=0;i<$scope.resultData.towerWatthourMeterVOs.length;i++){
				if($scope.resultData.towerWatthourMeterVOs[i].belongEndTime==""||$scope.resultData.towerWatthourMeterVOs[i].endAmmeter==null
				||$scope.resultData.towerWatthourMeterVOs[i].electricLoss==null||$scope.resultData.towerWatthourMeterVOs[i].payAmount==null
				||$scope.resultData.towerWatthourMeterVOs[i].payInvoiceType==null||$scope.resultData.towerWatthourMeterVOs[i].otherAmount==null
				||$scope.resultData.towerWatthourMeterVOs[i].shareProportion==null){
				length = length-1;
				}	
			}
			
		}
		if($scope.resultData.towerWatthourMeterVOs.length == 0 || $scope.resultData.supplierName == "" ) {
            utils.msg("信息不完整,请认真填写后再提交！");
            return;
        }else if(length == 0){
			utils.msg("电表信息不可用,请认真填写电表信息后再提交！");
            return;
		}else {
			if($scope.resultData.towerWatthourMeterVOs.length > 0){
			for(var i=0;i<$scope.resultData.towerWatthourMeterVOs.length;i++){
				if($scope.resultData.towerWatthourMeterVOs[i].belongEndTime==""||$scope.resultData.towerWatthourMeterVOs[i].endAmmeter==null
				||$scope.resultData.towerWatthourMeterVOs[i].electricLoss==null||$scope.resultData.towerWatthourMeterVOs[i].payAmount==null
				||$scope.resultData.towerWatthourMeterVOs[i].payInvoiceType==null||$scope.resultData.towerWatthourMeterVOs[i].otherAmount==null
				||$scope.resultData.towerWatthourMeterVOs[i].shareProportion==null){
				$scope.resultData.towerWatthourMeterVOs.splice(i,1);
				i=i-1;
					}	
				}
			
			}
			if($scope.resultData.overProoFreAsons!=""){
				towerAuditServ.saveTowerAuditPage($scope.resultData).success(function (data){
					utils.ajaxSuccess(data,function(data){
						console.log("resultData",angular.toJson($scope.resultData,true));
						//返回电费录入页面
						$state.go('app.towerInputTariff',{
							'status':'towerInputTariff/tariffSubmit'
						});
					})
				});
			}else{
				//检测是否超标杆
            	towerAuditServ.checkPowerRating($scope.resultData).success(function(data){
            		utils.ajaxSuccess(data,function(data){
            			if(data.data!="未超标杆值" && $scope.resultData.overProoFreAsons==""){
            				$scope.twSubErrData = data.data;
            				$scope.isFlag = true;
            				$scope.twSubErrDialog = ngDialog.open({
            					template: './tw/twSubErrDialog.html?time='+new Date().getTime(),
            					className: 'ngdialog-theme-default ngdialog-theme-custom',
            					width: 750,
            					scope: $scope,
            				});									
            				return;	
            			}else {
            				towerAuditServ.saveTowerAuditPage($scope.resultData).success(function (data){
            					utils.ajaxSuccess(data,function(data){
            						console.log("resultData",angular.toJson($scope.resultData,true));
            						//返回电费录入页面
            						$state.go('app.towerInputTariff',{
            							'status':'towerInputTariff/tariffSubmit'
            						});
            					})
            				});
            			}
            		});
            	});
			}
			
        }
    }

  //报账点电表超标判断是否填写原因(保存)
	$scope.ack=function(){
		var cause=$("#cause1").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause!=""&&cause!=null){//填写原因可以提交
			$scope.closeDialog("twSubErrDialog");
			$scope.resultData.overProoFreAsons=cause;
			$scope.saveTowerAuditPage($scope.resultData.status); //调用电费明细提交，再次判断
			return;			
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}

	 //报账点电表超标判断是否填写原因	20以上
	$scope.ack1=function(){
		//console.log("hamapi");
		var cause1=$("#cause1").val().replace(/(^\s*)|(\s*$)/g, ""); //用于保存用户所填原因
		if(cause1!=""&&cause1!=null){//填写原因可以提交
			console.log(cause1)
			$scope.closeDialog("twSubErrDialog");
			$scope.resultData.overProoFreAsons=cause1;
			$scope.submitTowerAuditPage($scope.resultData.status); //调用电费明细提交，再次判断
			return;		
		}else{//未填写原因
			alert("请填写异常原因说明!!");
			return;
		}
	}
	
	//选择超标杆原因
	$scope.changeOther = function(){
		console.log("hmp");
		//var other=$("select[name='other']").val();
		//console.log(other);
    	//	$scope.resultData.overProoFreAsons=other;
	}
	

    // 新增稽核单-------提交稽核单  (status==1)
    $scope.submitTowerAuditPage=function(status){
        $scope.resultData.status = status;
		//是否包干功能未实现---现在，默认为否，即不包干
        if($scope.siteObject.isClud=="包干"){
            $scope.resultData.isClud = 1;
        }else if($scope.siteObject.isClud=="不包干"){
            $scope.resultData.isClud = 0;
        }else {
           // $scope.resultData.isClud = null;  //是否包干实现后，在此设置$scope.resultData.isClud = null
		   $scope.resultData.isClud = 0;   //是否包干实现后，可删除这一行
        }
        
        //检测退网状态是否填写
    	var isOnline = $("#isOnline").val();
    	if(isOnline==null || isOnline==""){
    		utils.msg("请选择在网状态后再提交");
    		return;
    	}else{
    		if($scope.siteNoRoomIsOnline.onlineRoomNum == 0 && isOnline=="1"){
    			utils.msg("该站点不存在对应的在网机房，请核对信息后再提交！");
    			return;
    		}
    		if($scope.siteNoRoomIsOnline.noOnLineRoomNum == 0 && isOnline=="2"){
    			utils.msg("该站点不存在对应的退网机房，请核对信息后再提交！");
    			return;
    		}
    		$scope.resultData.isOnline = isOnline;	//将选择的在网状态存入提交数据中
    	}
        
		//判断是否有电表填写完整
		var length=$scope.resultData.towerWatthourMeterVOs.length
		if($scope.resultData.towerWatthourMeterVOs.length > 0){
			for(var i=0;i<$scope.resultData.towerWatthourMeterVOs.length;i++){
				if($scope.resultData.towerWatthourMeterVOs[i].belongEndTime==""||$scope.resultData.towerWatthourMeterVOs[i].endAmmeter==null
				||$scope.resultData.towerWatthourMeterVOs[i].electricLoss==null||$scope.resultData.towerWatthourMeterVOs[i].payAmount==null
				||$scope.resultData.towerWatthourMeterVOs[i].payInvoiceType==null||$scope.resultData.towerWatthourMeterVOs[i].otherAmount==null
				||$scope.resultData.towerWatthourMeterVOs[i].shareProportion==null){
				length = length-1;
				}	
			}			
		}
		
        if($scope.resultData.isClud == 0 && $scope.resultData.towerWatthourMeterVOs.length == 0 || $scope.resultData.supplierName == "") {
            utils.msg("信息不完整,请认真填写后再提交！");
            return;
        }else if($scope.resultData.isClud == 0 && length == 0){
			utils.msg("电表信息不可用,请认真填写电表信息后再提交！");
            return;
		}else {
			if($scope.resultData.towerWatthourMeterVOs.length > 0){
			for(var i=0;i<$scope.resultData.towerWatthourMeterVOs.length;i++){
				if($scope.resultData.towerWatthourMeterVOs[i].belongEndTime==""||$scope.resultData.towerWatthourMeterVOs[i].endAmmeter==null
				||$scope.resultData.towerWatthourMeterVOs[i].electricLoss==null||$scope.resultData.towerWatthourMeterVOs[i].payAmount==null
				||$scope.resultData.towerWatthourMeterVOs[i].payInvoiceType==null||$scope.resultData.towerWatthourMeterVOs[i].otherAmount==null
				||$scope.resultData.towerWatthourMeterVOs[i].shareProportion==null){
				$scope.resultData.towerWatthourMeterVOs.splice(i,1);
				i=i-1;
					}	
				}
			
			}
            console.log(angular.toJson($scope.resultData,true));
            if($scope.resultData.overProoFreAsons!=""){
            	towerAuditServ.saveTowerAuditPage($scope.resultData).success(function (data){
        			utils.ajaxSuccess(data,function(data){
        				console.log("resultData",angular.toJson($scope.resultData,true));
        				$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
        				//返回电费录入页面
        				$state.go('app.towerAuditTariff',{
        					'status':'towerAuditTariff/twAudit'
        				});
        			})
        		});
            }else{
            	//检测是否超标杆
            	towerAuditServ.checkPowerRating($scope.resultData).success(function(data){
            		utils.ajaxSuccess(data,function(data){
            			if(data.data!="未超标杆值" && $scope.resultData.overProoFreAsons==""){
            				$scope.twSubErrData = data.data;
            				$scope.twSubErrDialog = ngDialog.open({
            					template: './tw/twSubErrDialog.html?time='+new Date().getTime(),
            					className: 'ngdialog-theme-default ngdialog-theme-custom',
            					width: 750,
            					scope: $scope,
            				});									
            				return;	
            			}else {
            				towerAuditServ.saveTowerAuditPage($scope.resultData).success(function (data){
            					utils.ajaxSuccess(data,function(data){
            						console.log("resultData",angular.toJson($scope.resultData,true));
            						$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
            						//返回电费录入页面
            						$state.go('app.towerAuditTariff',{
            							'status':'towerAuditTariff/twAudit'
            						});
            					})
            				});
            			}
            		});
            	});
            	
            }
            
        }

    }



     // 删除电表信息
    $scope.removeElectrictInfo=function(index){

        $scope.resultData.towerWatthourMeterVOs.splice(index,1);
    }


    //取消返回电费录入页面
    $scope.returnPage = function(){
        $state.go('app.towerInputTariff',{
            'status':'towerInputTariff/tariffSubmit'
        });
    }





/********************************************************电费录入单个电表信息修改、删除、查询业务****************************************************************/

    /**
     * 查看电表信息（电费录入）
     * @param  {[type]} index [description]
     * @param  {[type]} flag  [description]
     * @return {[type]}       [description]
     */
    $scope.queryElectricDetail = function(index,flag){
        $scope.checkDetail = true;
        $scope.editDetail = flag;
    	$scope.save = true; // 保存按钮隐藏
    	$scope.edit = flag;  //修改按钮显示

    	// 新增稽核单页面------稽核信息
        for(var i=0; i<$scope.listDetail.length; i++){
            if(i==index){
                $scope.electricInfo = $scope.listDetail[i];  //获取当前修改的电表信息
            }
        }
        if($scope.electricInfo.whetherMeter==1){
           $scope.electricInfo.whetherMeter= "是"
        }else {
           $scope.electricInfo.whetherMeter= "否"
        }
        // 电费生效终止日期
        $scope.electricInfo.belongStartTime = $scope.dataChange($scope.electricInfo.belongStartTime);
        $scope.electricInfo.belongEndTime =  $scope.dataChange($scope.electricInfo.belongEndTime);

        // 修改页面
        $scope.addElectricInfoDialogs=ngDialog.open({
            template: './tw/addElecDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1100,
            scope: $scope,
        });

    }

    /**
     * 修改电表信息  （电费录入-----页面稽核单修改）
     * @param  {[type]} index [description]
     * @param  {[type]} flag  [description]
     * @return {[type]}       [description]
     */
    $scope.editedElectrictPage = function(index,flag){
        $scope.checkDetail = false;
        $scope.editDetail = flag;
        $scope.save = false; // 保存按钮隐藏
        $scope.edit = flag;  //修改按钮显示

        // 新增核单----稽核信息
        for(var i=0; i<$scope.listDetail.length; i++){
            if(i==index){
                $scope.electricInfo = $scope.listDetail[i];  //获取当前修改的电表信息
            }
        }

        // 电费生效终止日期
        $scope.electricInfo.belongStartTime = $scope.dataChange($scope.electricInfo.belongStartTime);
        $scope.electricInfo.belongEndTime =  $scope.dataChange($scope.electricInfo.belongEndTime);

        // 修改页面
        $scope.addElectricInfoDialogs=ngDialog.open({
            template: './tw/addElecDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1100,
            scope: $scope,
        });

        // 保存修改的电表
        $scope.editTowerEdit = function(index){
            var meterVo = $scope.electricInfo;
            if(!meterVo || !meterVo.code || meterVo.whetherMeter==null ||  !meterVo.rate || !meterVo.belongStartTime || !meterVo.belongEndTime || (!meterVo.electricLoss && meterVo.electricLoss != 0)|| (!meterVo.totalEleciric && meterVo.totalEleciric !=0) || (!meterVo.payAmount && meterVo.payAmount !=0)|| !meterVo.payInvoiceType || (!meterVo.unitPrice && meterVo.unitPrice !=0) || (!meterVo.otherAmount && meterVo.otherAmount !=0) || (!meterVo.actualAmount && meterVo.actualAmount !=0) || (!meterVo.shareProportion && meterVo.shareProportion !=0)|| (!meterVo.shareAmount && meterVo.shareAmount !=0)){
                utils.msg("请完成必填项后再提交。");
                return;
            }
            //判断字符长度
            if( meterVo.electricLoss.length>20 || meterVo.totalEleciric.length>20 || meterVo.payAmount.length>20 || meterVo.unitPrice.length>20 || meterVo.otherAmount.length>20 || meterVo.actualAmount.length>20 || meterVo.shareProportion.length>20 || meterVo.shareAmount.length>20 ){
                utils.msg("数值类型长度不能超过20个字符。");
                return;
            }

            if(isNaN(parseFloat(meterVo.electricLoss)) || isNaN(parseFloat(meterVo.totalEleciric)) || isNaN(parseFloat(meterVo.payAmount)) || isNaN(parseFloat(meterVo.unitPrice)) || isNaN(parseFloat(meterVo.otherAmount)) || isNaN(parseFloat(meterVo.actualAmount)) || isNaN(parseFloat(meterVo.shareProportion)) || isNaN(parseFloat(meterVo.shareAmount))){
                utils.msg("请填入正确数值类型。");
                return;
            }
            if(meterVo.shareProportion > 1){
                utils.msg("分摊比例不能大于1。");
                return;
            }

            if($scope.electricInfo.shareAmount != "0.00") {
                $scope.resultData.towerWatthourMeterVOs = $scope.electricInfo;  // 保存当前修改后的电表信息

                console.log("修改后的信息",angular.toJson($scope.resultData.towerWatthourMeterVOs,true));

            	//计算修改后的电费的分摊总金额
            	var ShareAmountTotal=0;
    	    	for(var i=0; i<$scope.listDetail.length; i++){
            		ShareAmountTotal += parseFloat($scope.listDetail[i].shareAmount);
                    $scope.resultData.shareAmount = parseFloat(ShareAmountTotal).toFixed(2);
                    $scope.object.shareAmount = $scope.resultData.shareAmount;
    	    	}

                // 关闭电表信息弹出框
                $scope.closeDialog("addElectricInfoDialogs");
            }else {
                utils.msg("分摊电费金额有误，请重新填写后再提交！");
            }
        }
    }


    //删除电表信息----电费录入页面
    $scope.deleteEletrcInfo = function(index){

        $scope.listDetail.splice(index,1);

    }



    /**
      * 保存\提交电费（电费录入-------页面修改稽核单数据）
      * @param  {[type]} status [description]
      * @return {[type]}        [description]
      */
    $scope.saveTowerEditPage=function(status){
        $scope.resultData={
            "id":$scope.object.id,                              // id
            "serialNumber":$scope.object.serialNumber,  //流水号
            "sysTowerSitId":$scope.object.sysTowerSitId,                  //铁塔站址ID
            "sysTowerSitNo":$scope.object.sysTowerSitNo,                  //铁塔站点编号
            "zgSpaceSiteName":$scope.object.zgSpaceSiteName,                //资管站点名称
            "zgTowerSiteName":$scope.object.zgTowerSiteName,                //铁塔地址名称
            "status":status,                         //状态
            "shareAmount":$scope.object.shareAmount,                    //分摊电费金额
            "towerWatthourMeterVOs":[],           //塔维电表信息
            "costCenterID":$scope.object.costCenterID,                          //成本中心ID
            "supplierName":$scope.resultData.supplierName,                           //供应商名称
            "overProofReasons":$scope.object.overProofReasons			//超标杆原因
        }
        
        $scope.resultData.towerWatthourMeterVOs = $scope.listDetail;   // 未修改时的数据
        if($scope.object.isClud =="包干"){
            $scope.resultData.shareAmount = null;
            $scope.resultData.towerWatthourMeterVOs = [];
        }
    	towerAuditServ.editedSingleTaiffSubmit($scope.resultData).success(function (data){
    		utils.ajaxSuccess(data,function(data){
    			console.log("resultData",angular.toJson($scope.resultData,true));
                $scope.params.pageNo=1;
                $scope.getAuditData();   //电费录入页面，修改稽核单519暂时隐藏功能未完善
                $scope.closeDialog("showDetailDialog");  //电费录入页面，修改稽核单519暂时隐藏功能未完善
    		})
        });
    }


/********************************************************电费稽核单个电表信息修改、保存业务****************************************************************/


     /**
      * 保存\提交电费（电费稽核-------页面修改稽核单数据）
      * @param  {[type]} status [description]
      * @return {[type]}        [description]
      */
    $scope.saveTowerEditAuditPage=function(){

        $scope.resultData={
            "instanceId":$scope.instanceId,
            "id":$scope.object.id,                              // id
            "serialNumber":$scope.object.serialNumber,  //流水号
            "sysTowerSitId":$scope.object.sysTowerSitId,                  //铁塔站址ID
            "sysTowerSitNo":$scope.object.sysTowerSitNo,                  //铁塔站点编号
            "zgSpaceSiteName":$scope.object.zgSpaceSiteName,                //资管站点名称
            "zgTowerSiteName":$scope.object.zgTowerSiteName,                //铁塔地址名称
            "status":status,                         //状态
            "overProoFreAsons":$scope.object.overProofReasons,		//超标杆原因
            "shareAmount":$scope.object.shareAmount,                    //分摊电费金额
            "towerWatthourMeterVOs":[],           //塔维电表信息
            "costCenterID":$scope.object.costCenterID,                          //成本中心ID
            "supplierName":$scope.resultData.supplierName,                           //供应商名称
        }
        $scope.resultData.towerWatthourMeterVOs = $scope.listDetail;   // 未修改时的数据

        if($scope.object.isClud =="包干"){
            $scope.resultData.shareAmount = null;
            $scope.resultData.towerWatthourMeterVOs = [];
        }
        //修改表单状态
        towerAuditServ.updateData($scope.resultData).success(function (data){//修改流程状态
            utils.ajaxSuccess(data,function(data){
            	towerAuditServ.updateTask($scope.resultData).success(function (data){//修改流程状态
            		utils.ajaxSuccess(data,function(data){
            			console.log("resultData",angular.toJson($scope.resultData,true));
            			$scope.params.pageNo=1;
            			$scope.getAuditDetail();   //电费录入页面，修改稽核单519暂时隐藏功能未完善
            			$scope.closeDialog("showAudtiPageDetail");  //电费录入页面，修改稽核单519暂时隐藏功能未完善
            		})
            	});
            })
        });
    }


}])





/**
*
*  稽核流程----电费录入
*/
app.controller('towerInputTariffCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'towerAuditServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, towerAuditServ) {

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
    $scope.getAuditData=function(){
        angular.extend($scope.params,{
        	"cityId":$scope.cityId, //地市
            "countyId":$scope.countyId, //区县
            "zgTowerSiteName":$("#twSiteName").val(),   //铁塔站址名称
            "supplierName":$("#supplierName").val(),   //供应商
            "flowState":$scope.flowState, // 状态
            "startTime":$("#id1").val(), // 时间
            "endTime":$("#id2").val(), // 时间
            
        	"serialNumber":$scope.serialNumber,               //稽核单流水号
            "zgSpaceSiteName":$scope.zgSpaceSiteName,         //资管站点名称
            "statuses":"0,7"
        })

        delete $scope.params.page;
        towerAuditServ.queryTaiffSubmitPage($scope.params).success(function(data){
            if(data.data.results == "") {
                utils.msg("目前暂无数据！");
            }
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;                            
                for(var i=0;i<$scope.list.length;i++){
                	$scope.list[i].createDate=$scope.dataChange($scope.list[i].createDate);
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

    //跳转到新增塔维稽核单页面
    $scope.goAddPage=function(){
        $state.go('app.addTowerAudit',{
            'status':'addTower',
            'id':'tower'
        });
    }


    // 查看单条电费录入单
    $scope.showDetail=function(item,flag,save){

        $scope.flag = flag;   //修改显示保存和取消
        $scope.flagSave = save;//查看时只显示确定按钮

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
        $scope.showDetailDialog=ngDialog.open({
            template: './tw/submitDetailDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom ',
            width: 1100,
            controller:'addTowerAuditCtrl',
            scope: $scope,
        });

    }


    // // 单个提交
    // $scope.bachSubmit=function(id){

    //     utils.confirm('确定要提交吗？',"",function(){
    //         towerAuditServ.batchTaiffSubmit(id).success(function(data){
    //             utils.ajaxSuccess(data,function(data){
    //                 $scope.params.pageNo=1;
    //                 $scope.getAuditData();
    //             });
    //         });
    //     });
    // };



    // // 批量提交
    // $scope.bachSubmit2=function(id){
    //     var list=[];

    //     list= utils.getCheckedVals('#list',false);

    //     if(list.length<1){
    //         utils.msg("请选择至少一项");
    //         return;
    //     }

    //     utils.confirm('确定要提交吗？',"",function(){
    //         towerAuditServ.batchTaiffSubmit(list).success(function(data){
    //             utils.ajaxSuccess(data,function(data){
    //                 $scope.params.pageNo=1;
    //                 $scope.getAuditData();
    //                 unCheckAll('#list')
    //             });
    //         });
    //     });
    // };


    // 批量提交----超标杆----待测试
    $scope.bachSubmit2=function(id){
        var list=[];

        list= utils.getCheckedVals('#list',false);

        if(list.length<1){
            utils.msg("请选择至少一项");
            return;
        }

        var eIds = {
            "eIds":list,
            "type":"2"
        }
        utils.confirm('确定要提交吗？',"",function(){
            towerAuditServ.checkMarkDetails(eIds).success(function(data){
                if(data.data.length == 0){
                    towerAuditServ.batchTaiffSubmit(list).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.params.pageNo=1;
                            $scope.getAuditData();
                            unCheckAll('#list')
                        });
                    });
                }else{
                    var checkMark = data.data;
                    var listDetail = [];
                    var listDetail = list.split(",");
                    var tips = "";
                    var tsArr = new Array();
                    debugger;
                    for(var j=0; j<listDetail.length; j++){
                        for(var i=0; i<checkMark.length; i++){
                            if(checkMark[i].electricityId == listDetail[j] && checkMark[i].type == "额定功率"){
                                if(checkMark[i].overProportion > 0){
                                    tips += '当前稽核单号'+checkMark[i].electricitySN+'电量已经超标杆了，超标类型为额定功率，超标杆比例为'+checkMark[i].overProportion+'%'
                                    tsArr.push(listDetail[j]);
                                }else if( checkMark[i].overProportion == "" || checkMark[i].overProportion == "0"){
                                    towerAuditServ.batchTaiffSubmit(list).success(function(data){
                                        utils.ajaxSuccess(data,function(data){
                                            $scope.params.pageNo=1;
                                            $scope.getAuditData();
                                            unCheckAll('#list')
                                        });
                                    });
                                }
                            }
                        }
                    }
                    if(tips) {
                        for(var index=0; index<tips.length; index++) {
                            utils.confirm(tips+' ，确定是否进行提交操作？',"",function(){
                                towerAuditServ.batchTaiffSubmit(list).success(function(data){
                                    utils.ajaxSuccess(data,function(data){
                                        $scope.params.pageNo=1;
                                        $scope.getAuditData();
                                        unCheckAll('#list')
                                    });
                                });
                            });
                        }
                    }
                }
            });
        });
    };
    //
    //

    // 单个提交----超标杆----待测试
    $scope.bachSubmit=function(id){

        
        utils.confirm('确定要提交吗？',"",function(){

            towerAuditServ.towercheckMarkDetails(id).success(function(data){
            	if(data.data.isPR==true){
            		var s = data.data.overScale*100 + "";
            		utils.confirm('当前稽核单电量已经超标杆了，超标类型为额定功率，超标杆比例为'+s.substring(0,s.indexOf(".")+3)+'%'+'，确定是否进行提交操作？',"",function(){
                        towerAuditServ.batchTaiffSubmit(id).success(function(data){
                            utils.ajaxSuccess(data,function(data){
                                $scope.params.pageNo=1;
                                $scope.getAuditData();
                            });
                        });
                    });
            	}else{
            		towerAuditServ.batchTaiffSubmit(id).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.params.pageNo=1;
                            $scope.getAuditData();
                        });
                    });
            	}
            
                /*if(data.data.length == 0){
                    towerAuditServ.batchTaiffSubmit(id).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.params.pageNo=1;
                            $scope.getAuditData();
                        });
                    });
                    return;
                }
                var checkMark = data.data[0].overProportion;
                if( checkMark == "" || checkMark == "0"){
                    towerAuditServ.batchTaiffSubmit(id).success(function(data){
                        utils.ajaxSuccess(data,function(data){
                            $scope.params.pageNo=1;
                            $scope.getAuditData();
                        });
                    });
                }else if(checkMark > 0 ){
                    utils.confirm('当前稽核单号'+data.data[0].electricitySN+'电量已经超标杆了，超标类型为额定功率，超标杆比例为'+data.data[0].overProportion+'%'+'，确定是否进行提交操作？',"",function(){
                        towerAuditServ.batchTaiffSubmit(id).success(function(data){
                            utils.ajaxSuccess(data,function(data){
                                $scope.params.pageNo=1;
                                $scope.getAuditData();
                            });
                        });
                    });
                }*/
            });
        });
    };




    /**
     * 删除单个
     */
    $scope.deleteSelected=function(id){

        utils.confirm('确定要删除吗？',"",function(){
            towerAuditServ.modifyTaiffSubmit(id).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getAuditData();
                });
            });
        });
    }


     /**
     * 批量删除
     */
    $scope.deleteSelected2=function(id){

        var list=[];

        list= utils.getCheckedVals('#list',false);

        if(list.length<1){
            utils.msg("请选择要删除的项目");
            return;
        }

        utils.confirm('确定要删除吗？',"",function(){
            towerAuditServ.modifyTaiffSubmit(list).success(function(data){
                utils.ajaxSuccess(data,function(data){
                    $scope.params.pageNo=1;
                    $scope.getAuditData();
                    unCheckAll('#list')

                });
            });
        });
    }
    


    //导出 页面
    $scope.tariffSubmitExportExcel=function(){
    	
    	towerAuditServ.tariffSubmitExportExcel().success(function (data) {    		   		
    		for(var i=0;i<data.data.length;i++){
    			data.data[i].sysTowerSitNo="Encode:    "+data.data[i].sysTowerSitNo;
    			data.data[i].createDate=$scope.dataChange(data.data[i].createDate);
    			if(data.data[i].status=="0"){
    				data.data[i].status="等待提交审批";	
    			}else if(data.data[i].status=="1"){
    				data.data[i].status="审批中";
    			}else if(data.data[i].status=="2"){
    				data.data[i].status="审批通过";
    			}else if(data.data[i].status=="3"){
    				data.data[i].status="审批驳回";
    			}else if(data.data[i].status=="4"){
    				data.data[i].status="报销中";
    			}else if(data.data[i].status=="5"){
    				data.data[i].status="报销成功";
    			}else if(data.data[i].status=="6"){
    				data.data[i].status="报销失败";
    			}else if(data.data[i].status=="7"){
    				data.data[i].status="已撤销";
    			}else if(data.data[i].status=="8"){
    				data.data[i].status="等待提交稽核";
    			}else{
    				data.data[i].status="";
    			}
    			
    			if(data.data[i].isClud=="0"){
    				data.data[i].isClud="不包干";
    			}else if(data.data[i].isClud=="1"){
    				data.data[i].isClud="包干";
    			}else{
    				data.data[i].isClud="";
    			}
    			
    			if(data.data[i].whetherMeter=="0"){
    				data.data[i].whetherMeter="否";
    			}else if(data.data[i].whetherMeter=="1"){
    				data.data[i].whetherMeter="是";
    			}else{
    				data.data[i].whetherMeter="";
    			}
    			data.data[i].belongStartTime=$scope.dataChange(data.data[i].belongStartTime);
    			data.data[i].belongEndTime=$scope.dataChange(data.data[i].belongEndTime);
    		}
              utils.loadData(data,function (data) {
            		$scope.lists=data.data;
              })
    		
    	});
		   $scope.twSubmitExportDialog=ngDialog.open({
	            template: './tw/twSubmitExportDialog.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
	           width: 1200,	        
	            scope: $scope
				});
		   
    } 
    
    //导出excle(塔维电费录入)
	 $scope.twSubmitExcel=function(){
		
		event.preventDefault();
       var BB = self.Blob;
       var contentStr = document.getElementById("twSubmitDetails").innerHTML;   //内容
       var fileNmae='塔维稽核单信息.xlsx';
       saveAs(
         new BB(
             ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
           , { type: "applicationnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
       ) , fileNmae);
		
	} 

	//关闭弹出框 
	    $scope.closeDialog=function(dialog){
	        $scope[dialog].close("")
	    }
	 
}])