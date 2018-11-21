﻿﻿/**
 *
 *
 */


app.controller('headerCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ) {

    //显示系统信息框
    $scope.showNotice=false;
    $rootScope.auditType=-1;
    //TODO 获取用户公告并显示
    $rootScope.functionType=  window.sessionStorage.getItem("functionType") || '';  // 获取塔维自维信息
    $rootScope.checkCurrentMenu=function(){
    	if(!$rootScope.selectedMenu && window.localStorage && window.localStorage.selectedMenu){
           	$rootScope.selectedMenu=window.localStorage.selectedMenu;
      	  	console.log($rootScope.selectedMenu);
        }
	}
	$rootScope.checkCurrentMenu();
    // 系统公告
    $rootScope.notices=[];
    //获取未读公告
    $scope.updateNotices=function(){
        commonServ.queryNoticeNotRead().success(function(data){
        	$rootScope.notices=[];
        	if(data.data.noticeList != undefined){
                $rootScope.notices=data.data.noticeList;
            }
            if(data.data.notReadIdList != undefined){
                $rootScope.notReadIdList = data.data.notReadIdList;
                var length = $rootScope.notReadIdList.length;
                $rootScope.unreadNotice = length;
            }
        });
    }
    $scope.showOrcloseNotice=function(){
    	$scope.updateNotices();
    	$scope.showNotice = !$scope.showNotice;
    }


    $scope.updateNotices();

    $scope.showDetail=function(item){
        $scope.notice=item;
        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/showDetailDialog.html',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 600,
            scope: $scope,
        });
        for(var i = 0 ; i < $rootScope.notReadIdList.length ; i++){
            var notReadId = $rootScope.notReadIdList[i];
            if(notReadId == item.noticId){
                commonServ.addNoticeReaded(item.noticId);
                $rootScope.unreadNotice = $rootScope.unreadNotice - 1;
                break;
            }
        }

        $scope.showNotice = !$scope.showNotice;
    }

    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    };




    //全选
    $rootScope.checkAll=function(myDomId,domId){
        checkAll(myDomId,domId);
    };

    //获取省市区
    commonServ.queryCityList().success(function(data){
        console.log(data,"111112")
    	$rootScope.citys=[];
        if(data && data.data && data.data.length){
	        for(var i=0; i< data.data.length; i++){
	        	var city = data.data[i];
	        	if(city.value && (city.value != '全省汇总' && city.value != '网管传输室' && city.value != '数维' && city.value != '样例地市' && city.value != '成都')){
					$rootScope.citys.push(city);
	        	}else if(city.value && city.value == '成都'){
	        		$rootScope.citys.unshift(city);
	        	}
	        }
        }
        console.log($rootScope.citys[0],"111112")

        $rootScope.tests = [];
        if(data&&data.data&&data.data.length){
            for(var i = 0;i<data.data.length;i++){
                var test = data.data[i];
                
                if(test.value && (test.value != '全省汇总' && test.value != '网管传输室' && test.value != '数维' && test.value != '样例地市' && test.value != '成都')){
                    $rootScope.tests.push(test);
                }else if(test.value && test.value == '成都'){
                    $rootScope.tests.unshift(test);
                }
            }
            var newStep = {key:"",value:"全市"};
            console.log(newStep)

            $rootScope.tests.unshift(newStep);
            console.log($rootScope.tests[0],"33333333333")
        }
    });

    //查询县区
    $rootScope.queryCountyList=function(cityId){

        if(cityId != "" && cityId != null){
            commonServ.queryCountyList(cityId).success(function(data){
                utils.loadData(data,function(data){
                    $rootScope.countys=data.data;
                })
            });
        }else{
            $rootScope.countys={};
        }
    };
    
    
  //选择缴费类型
    $rootScope.queryPayTypee=function(cityId){
    	if(cityId!=-1){
    		 $rootScope.payTypee=cityId;
    	}else{
    		$rootScope.payTypee=null;
    	}
    	
    };

    //获取当前用户
    commonServ.getCurrentUser().success(function (data) {
        utils.loadData(data,function (data) {
            console.log("getCurrentUser",data);

            $rootScope.loginUser=data.data;
            $rootScope.account=data.data.account;
            $rootScope.userLevel=data.data.userLevel;
            $rootScope.userCity = data.data.cityStr;
			$rootScope.userCounty = data.data.countyStr;
			$rootScope.userCityId = data.data.city;
			$rootScope.userCountyId= data.data.county;
            $rootScope.roleNameList= data.data.roleNameList;//所有的角色名字,转供电判权限
			$rootScope.departmentIdSum = data.data.departmentIdSum;//所有的部门ID
			$rootScope.departmentNameSum = data.data.departmentNameSum;//所有的部门名
            // $rootScope.functionType=     //判断自维塔维;
            console.log("$rootScope.functionType"+$rootScope.functionType);
            console.log(data.data.roleNameList.indexOf("nihao"));
            //三级权限判断---转供电
             if($rootScope.roleNameList.indexOf("省公司电费稽核组基础数据管理员") != -1){
                $rootScope.transLevel = 1;
             }else if($rootScope.roleNameList.indexOf("地市分公司网络部分管经理") != -1){
                $rootScope.transLevel = 2;
             }else if($rootScope.roleNameList.indexOf("地市分公司电费管理员") != -1){
                $rootScope.transLevel = 3;
             }else if($rootScope.roleNameList.indexOf("省级超级管理员") != -1){
                $rootScope.transLevel = 0;//最高权限

             }

            //获得登录用户菜单
            commonServ.getUserMenu($rootScope.loginUser.account,$rootScope.functionType).success(function(data){
                utils.loadData(data,function(data){
                    console.log(data);
                    $rootScope.menu=data.data;

                });
            });
        });

    });




    /**
     *
     * 退出系统
     */
    $rootScope.logout=function () {
        commonServ.logout().success(function (data) {
            console.log("lifuzhi")
            utils.ajaxSuccess(data,function (data) {
                console.log("wangcong")
            	//setTimeout( $rootScope.closePage(), 3000);

            });
		});
		alert("退出成功!!");

        if($rootScope.loginUser.isSupperAdmin==0){
			window.location.href="tpl/loginSuper.html";
		}else{
			window.location.href="http://eip.scmcc.com.cn";
		}
    };

    $rootScope.closePage=function(){
		window.opener=null;
		window.open('','_self');
		window.close();
    }

			 /**
     *
     * 查询账号
     */
	$rootScope.goLogin=function () {
		//查询账号		
		commonServ.goLogin().success(function(data){
		    utils.loadData(data,function(data){		    					
				window.location.href='../mobile/login.html';
				
			})
			})
	}
	
		 /**
     *
     * 切换用户
     */
    $rootScope.shiftAccount=function () {	
    	
    	//查询角色
		commonServ.getroleSelect().success(function(data){
		    utils.loadData(data,function(data){
		    	$scope.roles = data.data;
				//alert(data.data[0].roleName+"666999");
			})
			})
			//获取用户列表
		//	$scope.getAccountData(true);
		//打开用户选择弹窗		
            $scope.shiftAccountDialogs=ngDialog.open({
            template: './tpl/shiftAccountDialog.html',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1200,
            scope: $scope,
        });
    };

	 //分页
    $scope.sApageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };
	
	$scope.params = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };
	
		    //获取用户列表(搜索用)
     $scope.getAccountData=function(a){
    	if(a){
      		 $scope.params = {
      			        pageSize: 10,//每页显示条数
      			        pageNo: 1,// 当前页
      		 };
      	}
        delete $scope.params.countyId;
        delete $scope.params.cityId;
		delete $scope.params.page;	
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
			roleId : $scope.roleId,
            userName : $("#name").val()
        })
         console.log($scope.params);

        commonServ.getAccountData($scope.params).success(function (data) {
			if(data.data.results == "") {
                utils.msg("目前暂无数据！");
            }
            utils.loadData(data,function (data) { 
				$scope.sApageInfo.totalCount = data.data.totalRecord;
                $scope.sApageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;				
            })
        });
    }
	
	//切换用户
	  $scope.shift=function(item){
		  window.location.href='../mobile/login.html?loginAccountParam='+item.account;
		  
	  }
	
	    //关闭弹出框
    $scope.closeDialogs=function(dialog){
        $scope[dialog].close("");
    }
	
    // 页面跳转
    $rootScope.goPage=function(item,$event) {
        if(item.child==undefined || item.child.length==0){
                console.log(item);
                var str = 'app.' + item.id;
                console.log(str);
                try {
                    // $state.go(str);
                    $rootScope.reloadPage =  true;
                    $state.go(str,{},{reload:$rootScope.reloadPage});  //612 此处已修改
                    if(item.id){
	        			$rootScope.selectedMenu=item.id;
	        			if(window.localStorage){
	        				window.localStorage.selectedMenu = item.id;
	        			}
        			}
                }catch (e){
                    console.log(e)
                    utils.alert(item.value+'模块正在开发中...')
                }
        }else {
            var dom= angular.element($event.target)
            var len =dom.next('ul').children().length;
            console.log("dom",dom.next('ul').children().length);
            if(len>0){
                if(dom.next('ul').is(":hidden")){
                    dom.addClass('close-menu').next('ul').show();

                }else{
                    dom.removeClass('close-menu').addClass('show-menu').next('ul').hide();
                }
            }
        }
        $rootScope.checkCurrentMenu();
    }

}]);

/**
 * 省级经办人
 */

app.controller('provincialIndexCtrl', ['lsServ',  '$rootScope', '$scope', '$state', '$filter','ngDialog', 'utils', 'commonServ', 'towerReportServ', function (lsServ, $rootScope, $scope, $state, $filter,ngDialog, utils, commonServ, towerReportServ) {
	$rootScope.auditType=-1;
	commonServ.provinceSummary().success(function(data){
	    utils.loadData(data,function(data){
	    	$scope.proSum = data.data;
		})
	})
	$scope.cityRankData ={}
	$scope.getListValsForAttr=function(list,attr){
        return utils.getListValsForAttr(list,attr);
    }

	$scope.getListValsForAttrAndSubAttr=function(list,attr,subAttr){
        return utils.getListValsForAttrAndSubAttr(list,attr,subAttr);
    }

	$scope.loadChart = function(cityName){
		var cityMap = '';
		var cityCode = '';
		if(cityName){
			switch(cityName){
				case '四川':
					cityMap = 'sichuan';
					cityCode = '0';
					break;
                case '成都':
                    cityMap = '510100';
                    cityCode = '28';
                    break;
                case '阿坝':
                    cityMap = '513200';
                    cityCode = '837';
                    break;
                case '宜宾':
                    cityMap = '511500';
                    cityCode = '831';
                    break;
                case '达州':
                    cityMap = '511700';
                    cityCode = '818';
                    break;
                case '甘孜':
                    cityMap = '513300';
                    cityCode = '836';
                    break;
                case '广元':
                    cityMap = '510800';
                    cityCode = '839';
                    break;
                case '凉山':
                    cityMap = '513400';
                    cityCode = '834';
                    break;
                case '泸州':
                    cityMap = '510500';
                    cityCode = '830';
                    break;
                case '眉山':
                    cityMap = '511400';
                    cityCode = '833';
                    break;
                case '绵阳':
                    cityMap = '510700';
                    cityCode = '816';
                    break;                
                case '内江':
                    cityMap = '511000';
                    cityCode = '842';
                    break;                
                case '南充':
                    cityMap = '511300';
                    cityCode = '817';
                    break;
                case '自贡':
                    cityMap = '510300';
                    cityCode = '813';
                    break;
                case '遂宁':
                    cityMap = '510900';
                    cityCode = '825';
                    break;
                case '雅安':
                    cityMap = '511800';
                    cityCode = '835';
                    break;
                case '资阳':
                    cityMap = '512000';
                    cityCode = '832';
                    break;
                case '广安':
                    cityMap = '511602';
                    cityCode = '826';
                    break;
                case '乐山':
                    cityMap = '511100';
                    cityCode = '843';
                    break;
                case '巴中':
                    cityMap = '511900';
                    cityCode = '827';
                    break;
                case '德阳':
                    cityMap = '510600';
                    cityCode = '838';
                    break;
                case '攀枝花':
                    cityMap = '510400';
                    cityCode = '813';
                    break;
			}
		}
		if( !cityMap || !cityCode){
			return;
		}
		var year = new Date().getFullYear();
		commonServ.normDetail(cityCode, 2016,$rootScope.auditType).success(function(data){
            utils.loadData(data,function(data){

            	$scope.ranking = 1;
            	var chartData = data.data;
                var rankList = []
                var cityList = []
                var scecList = []
                var incomeList = []
                var rotaryList = []
                var rateList = []
                var switchList = []
                var meterList = []
                var successRateList = []
                var expenditureList =[]

                var expenditureData = []
              	var rankData = []
                var cityData = []
                var scecData = []
                var incomeData = []
                var rotaryData = []
                var rateData = []
                var switchData = []
                var meterData = []
                var successRateData = []

                var ind = 1;

              	var maxValueMap = {};
                if(null != chartData && chartData.length > 0){

                	rankList = $scope.getListValsForAttr(chartData,"comprehensiveRank");
                	cityList = $scope.getListValsForAttr(chartData,"cityName");
                	scecList = $scope.getListValsForAttr(chartData,"SCEC");
                	incomeList = $scope.getListValsForAttr(chartData,"income");
                	expenditureList = $scope.getListValsForAttr(chartData,"expenditure");
                	rotaryList = $scope.getListValsForAttr(chartData,"RotaryScale");
                	rateList = $scope.getListValsForAttr(chartData,"proportion");
                	switchList = $scope.getListValsForAttr(chartData,"proportion1");
                	meterList = $scope.getListValsForAttr(chartData,"proportion2");
                	successRateList = $scope.getListValsForAttr(chartData,"successRate");

                	rankList.splice(21,1);
                	cityList.splice(21,1);
                	scecList.splice(21,1);
                	incomeList.splice(21,1);
                	expenditureList.splice(21,1);
                	rotaryList.splice(21,1);
                	rateList.splice(21,1);
                	switchList.splice(21,1);
                	meterList.splice(21,1);
                	successRateList.splice(21,1);

                	var rankMin = Math.min.apply(Math, rankList);
                	maxValueMap["综合指标排名"]=rankMin;
                	var scecMax = Math.max.apply(Math, scecList);
                	maxValueMap["单载波电费"]=scecMax;
                	var incomeMax = Math.max.apply(Math, incomeList);
                	maxValueMap["占收入比"]=incomeMax;
                	var expenditureMax = Math.max.apply(Math, expenditureList);
                	maxValueMap["占支出比"]= expenditureMax;
                	var rotaryMax = Math.max.apply(Math, rotaryList);
                	maxValueMap["转供电比"]=rotaryMax;
                	var rateMax = Math.max.apply(Math, rateList);
                	maxValueMap["超额定功率标杆比"]=rateMax;
                	var switchMax = Math.max.apply(Math, switchList);
                	maxValueMap["开关电源可用率"]=switchMax;
                	var meterMax = Math.max.apply(Math, meterList);
                	maxValueMap["智能电表可用率"]=meterMax;
                	var successRateMax =Math.max.apply(Math, successRateList);
                	maxValueMap["资产、财务系统基站名称一致性"]=successRateMax;

                	$scope.maxValueMap = maxValueMap;

                	for(var i = 0 ; i < chartData.length; i++){
                		if (!cityList[i]){
                			continue;
                		}
                		var rank = {};
                		rank.name = cityList[i];
                		rank.value = rankList[i];
                		rankData.push(rank);

                		var scec = {};
                		scec.name = cityList[i];
                		scec.value = parseFloat(scecList[i]);
                		scecData.push(scec);

                		var income = {};
                		income.name = cityList[i];
                		income.value = incomeList[i];
                		incomeData.push(income);

                		var rotary = {};
                		rotary.name = cityList[i];
                		rotary.value = rotaryList[i];
                		rotaryData.push(rotary);

                		var rate = {};
                		rate.name = cityList[i];
	                		rate.value = parseFloat(rateList[i]);
	                		rateData.push(rate);

	                		var switches = {};
	                		switches.name = cityList[i];
	                		switches.value = switchList[i];
	                		switchData.push(switches);

	                		var meter = {};
	                		meter.name = cityList[i];
	                		meter.value = meterList[i];
	                		meterData.push(meter);

	                		var successRate = {};
	                		successRate.name = cityList[i];
	                		successRate.value = successRateList[i];
	                		successRateData.push(successRate);

	                		var expenditure = {};
	                		expenditure.name = cityList[i];
	                		expenditure.value = expenditureList[i];
	                		expenditureData.push(expenditure);

	                	}
	                }
	          	var legendData = ["综合指标排名", "单载波电费", "占收入比", "占支出比", "转供电比", "超额定功率标杆比", "开关电源可用率", "智能电表可用率", "资产、财务系统基站名称一致性" ];
				rankData = $filter('orderBy')(rankData,'value',false);
				$scope.cityRankData = rankData;
				$scope.rankDataName = '综合指标排名';

	            var series = [];
	            var ind = 1;
	            var option = {};

		    commonServ.echartMapJson(cityMap).success(function (data) {
	        // $.get('./assets/map/json/'+ cityMap +'.json', function (sichuanJson) {
	        	if(!data||data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
				echarts.registerMap('sichuan', data);
	        	var container = $("#chart-province");
		        var autoWidth = $(".chart-content").width();
    			var	autoHeight = $(".chart-content").height();
    			container.width(autoWidth);
    			container.height(autoHeight);
				option = {
					title: {
						text: '',
						padding:[22,0,100,0],
						left: 'center'
					},
					tooltip: {
						trigger: 'item'
					},
					legend: {
						orient: 'vertical',
						left: '2%',
						top:'8%',
						height:autoHeight,
						width:autoWidth,
						itemGap:25,
						selectedMode: 'single',
						data:legendData,
					},
					dataRange: {
				      	show:false,
				        x: 'left',
				        y: 'bottom',
				        splitList: [
				            {end: 2,label:''},
				            {start:1,label:''}
				        ],
				        color: ['#4398cc','#fe5e80']
				    },
					series: [
					{
						type: 'map',
						map: 'sichuan',
						roam: true,
						name:"综合指标排名",
						showLegendSymbol:true,
	                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
	                    aspectScale:1,//拉伸比例
	                    scaleLimit:{
	                        min:1,
	                        max:10
	                    },
	                    itemStyle: {
							normal: {
								show: true,
								borderWidth:.5,//各区域边框宽度
								borderColor: '#0d4566',//区域描线颜色
								areaColor:"#4398cc",//单位区域颜色
								label: {
									show:true,  //地图文字显示
									textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
								}
							},
							emphasis: {            //鼠标经过状态
								show: true,
								borderWidth: .5,
								borderColor:'#64c1fa',
								areaColor:"#64c1fa",//鼠标经过时区域的颜色
								shadowBlur: 10,//地图阴影大小
								label: {
									show:true,
									textStyle: {
										color: '#fff',
										fontWeight:600
									}
								}
							}
						},
	                    data:rankData,
					},{
						type: 'map',
						map: 'sichuan',
						roam: true,
						name:"单载波电费",
						showLegendSymbol:true,
	                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
	                    aspectScale:1,//拉伸比例
	                    scaleLimit:{
	                        min:1,
	                        max:10
	                    },
	                    itemStyle: {
							normal: {
								show: true,
								borderWidth:.5,//各区域边框宽度
								borderColor: '#0d4566',//区域描线颜色
								areaColor:"#4398cc",//单位区域颜色
								label: {
									show:true,  //地图文字显示
									textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
								}
							},
							emphasis: {            //鼠标经过状态
								show: true,
								borderWidth: .5,
								borderColor:'#64c1fa',
								areaColor:"#64c1fa",//鼠标经过时区域的颜色
								shadowBlur: 10,//地图阴影大小
								label: {
									show:true,
									textStyle: {
										color: '#fff',
										fontWeight:600
									}
								}
							}
						},
	                    data:scecData,

					},{
						type: 'map',
						map: 'sichuan',
						roam: true,
						name:"占收入比",
						showLegendSymbol:true,
	                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
	                    aspectScale:1,//拉伸比例
	                    scaleLimit:{
	                        min:1,
	                        max:10
	                    },
	                    itemStyle: {
							normal: {
								show: true,
								borderWidth:.5,//各区域边框宽度
								borderColor: '#0d4566',//区域描线颜色
								areaColor:"#4398cc",//单位区域颜色
								label: {
									show:true,  //地图文字显示
									textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
								}
							},
							emphasis: {            //鼠标经过状态
								show: true,
								borderWidth: .5,
								borderColor:'#64c1fa',
								areaColor:"#64c1fa",//鼠标经过时区域的颜色
								shadowBlur: 10,//地图阴影大小
								label: {
									show:true,
									textStyle: {
										color: '#fff',
										fontWeight:600
									}
								}
							}
						},
	                    data:incomeData,

					},{
						type: 'map',
						map: 'sichuan',
						roam: true,
						name:"占支出比",
						showLegendSymbol:true,
	                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
	                    aspectScale:1,//拉伸比例
	                    scaleLimit:{
	                        min:1,
	                        max:10
	                    },
	                    itemStyle: {
							normal: {
								show: true,
								borderWidth:.5,//各区域边框宽度
								borderColor: '#0d4566',//区域描线颜色
								areaColor:"#4398cc",//单位区域颜色
								label: {
									show:true,  //地图文字显示
									textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
								}
							},
							emphasis: {            //鼠标经过状态
								show: true,
								borderWidth: .5,
								borderColor:'#64c1fa',
								areaColor:"#64c1fa",//鼠标经过时区域的颜色
								shadowBlur: 10,//地图阴影大小
								label: {
									show:true,
									textStyle: {
										color: '#fff',
										fontWeight:600
									}
								}
							}
						},
	                    data:expenditureData,

					},{
						type: 'map',
						map: 'sichuan',
						roam: true,
						name:"转供电比",
						showLegendSymbol:true,
	                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
	                    aspectScale:1,//拉伸比例
	                    scaleLimit:{
	                        min:1,
	                        max:10
	                    },
	                    itemStyle: {
							normal: {
								show: true,
								borderWidth:.5,//各区域边框宽度
								borderColor: '#0d4566',//区域描线颜色
								areaColor:"#4398cc",//单位区域颜色
								label: {
									show:true,  //地图文字显示
									textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
								}
							},
							emphasis: {            //鼠标经过状态
								show: true,
								borderWidth: .5,
								borderColor:'#64c1fa',
								areaColor:"#64c1fa",//鼠标经过时区域的颜色
								shadowBlur: 10,//地图阴影大小
								label: {
									show:true,
									textStyle: {
										color: '#fff',
										fontWeight:600
									}
								}
							}
						},
	                    data:rotaryData,

					},{
						type: 'map',
						map: 'sichuan',
						roam: true,
						name:"超额定功率标杆比",
						showLegendSymbol:true,
	                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
	                    aspectScale:1,//拉伸比例
	                    scaleLimit:{
	                        min:1,
	                        max:10
	                    },
	                    itemStyle: {
							normal: {
								show: true,
								borderWidth:.5,//各区域边框宽度
								borderColor: '#0d4566',//区域描线颜色
								areaColor:"#4398cc",//单位区域颜色
								label: {
									show:true,  //地图文字显示
									textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
								}
							},
							emphasis: {            //鼠标经过状态
								show: true,
								borderWidth: .5,
								borderColor:'#64c1fa',
								areaColor:"#64c1fa",//鼠标经过时区域的颜色
								shadowBlur: 10,//地图阴影大小
								label: {
									show:true,
									textStyle: {
										color: '#fff',
										fontWeight:600
									}
								}
							}
						},
	                    data:rateData,

					},{
						type: 'map',
						map: 'sichuan',
						roam: true,
						name:"开关电源可用率",
						showLegendSymbol:true,
	                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
	                    aspectScale:1,//拉伸比例
	                    scaleLimit:{
	                        min:1,
	                        max:10
	                    },
	                    itemStyle: {
							normal: {
								show: true,
								borderWidth:.5,//各区域边框宽度
								borderColor: '#0d4566',//区域描线颜色
								areaColor:"#4398cc",//单位区域颜色
								label: {
									show:true,  //地图文字显示
									textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
								}
							},
							emphasis: {            //鼠标经过状态
								show: true,
								borderWidth: .5,
								borderColor:'#64c1fa',
								areaColor:"#64c1fa",//鼠标经过时区域的颜色
								shadowBlur: 10,//地图阴影大小
								label: {
									show:true,
									textStyle: {
										color: '#fff',
										fontWeight:600
									}
								}
							}
						},
	                    data:switchData,

					},{
						type: 'map',
						map: 'sichuan',
						roam: true,
						name:"智能电表可用率",
						showLegendSymbol:true,
	                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
	                    aspectScale:1,//拉伸比例
	                    scaleLimit:{
	                        min:1,
	                        max:10
	                    },
	                    itemStyle: {
							normal: {
								show: true,
								borderWidth:.5,//各区域边框宽度
								borderColor: '#0d4566',//区域描线颜色
								areaColor:"#4398cc",//单位区域颜色
								label: {
									show:true,  //地图文字显示
									textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
								}
							},
							emphasis: {            //鼠标经过状态
								show: true,
								borderWidth: .5,
								borderColor:'#64c1fa',
								areaColor:"#64c1fa",//鼠标经过时区域的颜色
								shadowBlur: 10,//地图阴影大小
								label: {
									show:true,
									textStyle: {
										color: '#fff',
										fontWeight:600
									}
								}
							}
						},
	                    data:meterData,

					},{
						type: 'map',
						map: 'sichuan',
						roam: true,
						name:"资产、财务系统基站名称一致性",
						showLegendSymbol:true,
	                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
	                    aspectScale:1,//拉伸比例
	                    scaleLimit:{
	                        min:1,
	                        max:10
	                    },
	                    itemStyle: {
							normal: {
								show: true,
								borderWidth:.5,//各区域边框宽度
								borderColor: '#0d4566',//区域描线颜色
								areaColor:"#4398cc",//单位区域颜色
								label: {
									show:true,  //地图文字显示
									textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
								}
							},
							emphasis: {            //鼠标经过状态
								show: true,
								borderWidth: .5,
								borderColor:'#64c1fa',
								areaColor:"#64c1fa",//鼠标经过时区域的颜色
								shadowBlur: 10,//地图阴影大小
								label: {
									show:true,
									textStyle: {
										color: '#fff',
										fontWeight:600
									}
								}
							}
						},
	                    data:successRateData,
					}
					]
				};
				var chart = echarts.init(document.getElementById('chart-province'));
				$scope.option = option;
				chart.on('click', function (params) {
				    var city = params.name;
				    $scope.loadChart(city);
				})
				chart.setOption(option);
				chart.on('legendselectchanged', function (params) {
					 $scope.$apply(function(){
						for(var key in params.selected){
							if(params.selected[key] === true){
								$scope.rankDataName = key;
								switch(key){
									case "综合指标排名":
										rankData = $filter('orderBy')(rankData,'value',false).splice(0,10);
										$scope.cityRankData=rankData;
										if($scope.option){
											var maxValueMap = $scope.maxValueMap;
											var rankMin = maxValueMap["综合指标排名"];
											var splitList = $scope.option.dataRange.splitList;
											splitList[0] = {end: 2,label:''};
											splitList[1] = {start:1,label:''};
											$scope.option.dataRange.splitList = splitList;
											$scope.option.dataRange.color=['#4398cc','#fe5e80'];
											chart.setOption($scope.option);
										}
									 	break;
									case "单载波电费":
										scecData = $filter('orderBy')(scecData,'value',true).splice(0,10);
										$scope.cityRankData=scecData;
                                        if($scope.option){
											var maxValueMap = $scope.maxValueMap;
											var scecMax = maxValueMap["单载波电费"];
											var splitList = $scope.option.dataRange.splitList;
											splitList[0] = {start:(scecMax-0.5),label:''};
											splitList[1] = {end:scecMax,label:''};
											$scope.option.dataRange.splitList = splitList;
											$scope.option.dataRange.color=['#fe5e80','#4398cc'];
											chart.setOption($scope.option);
										}
									 	break;
									case "占收入比":
										incomeData = $filter('orderBy')(incomeData,'value',true).splice(0,10);
										$scope.cityRankData=incomeData;
                                        if($scope.option){
											var maxValueMap = $scope.maxValueMap;
											var incomeMax = maxValueMap["占收入比"];
											var splitList = $scope.option.dataRange.splitList;
											splitList[1] = {start:(incomeMax-0.5),label:''};
											splitList[0] = {end:incomeMax,label:''};
											$scope.option.dataRange.splitList = splitList;
											$scope.option.dataRange.color=['#fe5e80','#4398cc'];
											chart.setOption($scope.option);
										}
									 	break;
									case "转供电比":
										rotaryData = $filter('orderBy')(rotaryData,'value',true).splice(0,10);
										$scope.cityRankData=rotaryData;
                                        if($scope.option){
											var maxValueMap = $scope.maxValueMap;
											var rotaryMax = maxValueMap["转供电比"];
											var splitList = $scope.option.dataRange.splitList;
											splitList[1] = {start:(rotaryMax-0.5),label:''};
											splitList[0] = {end:rotaryMax,label:''};
											$scope.option.dataRange.splitList = splitList;
											$scope.option.dataRange.color=['#4398cc','#fe5e80'];
											chart.setOption($scope.option);
										}
									 	break;
									case "占支出比":
										expenditureData = $filter('orderBy')(expenditureData,'value',true).splice(0,10);
										$scope.cityRankData=expenditureData;
                                        console.log('占支出比')
										if($scope.option){
											var maxValueMap = $scope.maxValueMap;
											var expenditureMax = maxValueMap["占支出比"];
											console.log(expenditureMax)
											var splitList = $scope.option.dataRange.splitList;
											splitList[1] = {start:expenditureMax-0.5,label:''};
											splitList[0] = {end:expenditureMax,label:''};
											$scope.option.dataRange.splitList = splitList;
											$scope.option.dataRange.color=['#fe5e80','#4398cc'];
											console.log($scope.option.dataRange.splitList)
											chart.setOption($scope.option);
										}
									 	break;
									case "超额定功率标杆比":
										rateData = $filter('orderBy')(rateData,'value',true).splice(0,10);
										$scope.cityRankData=rateData;
                                        if($scope.option){
											var maxValueMap = $scope.maxValueMap;
											var rateMax = maxValueMap["超额定功率标杆比"];
											var splitList = $scope.option.dataRange.splitList;
											splitList[1] = {start:(rateMax-0.5),label:''};
											splitList[0] = {end:rateMax,label:''};
											$scope.option.dataRange.splitList = splitList;
											$scope.option.dataRange.color=['#fe5e80','#4398cc'];
											chart.setOption($scope.option);
										}
									 	break;
									case "开关电源可用率":
										switchData = $filter('orderBy')(switchData,'value',true).splice(0,10);
										$scope.cityRankData=switchData;
                                        if($scope.option){
											var maxValueMap = $scope.maxValueMap;
											var switchMax = maxValueMap["开关电源可用率"];
											var splitList = $scope.option.dataRange.splitList;
											splitList[1] = {start:(switchMax-0.5),label:''};
											splitList[0] = {end:switchMax,label:''};
											$scope.option.dataRange.splitList = splitList;
											$scope.option.dataRange.color=['#fe5e80','#4398cc'];
											chart.setOption($scope.option);
										}
									 	break;
									case "智能电表可用率":
										meterData = $filter('orderBy')(meterData,'value',true).splice(0,10);
										$scope.cityRankData=meterData;
                                        if($scope.option){
											var maxValueMap = $scope.maxValueMap;
											var meterMax = maxValueMap["智能电表可用率"];
											var splitList = $scope.option.dataRange.splitList;
											splitList[1] = {start:(meterMax-0.5),label:''};
											splitList[0] = {end:meterMax,label:''};
											$scope.option.dataRange.splitList = splitList;
											$scope.option.dataRange.color=['#fe5e80','#4398cc'];
											chart.setOption($scope.option);
										}
									 	break;
									case "资产、财务系统基站名称一致性":
										successRateData = $filter('orderBy')(successRateData,'value',true).splice(0,10);
										$scope.cityRankData=successRateData;
                                        $scope.rankDataName = '资产、财务基站名称一致性';
										if($scope.option){
											var maxValueMap = $scope.maxValueMap;
											var successMax = maxValueMap["资产、财务系统基站名称一致性"];
											var splitList = $scope.option.dataRange.splitList;
											splitList[1] = {start:(successMax-0.5),label:''};
											splitList[0] = {end:successMax,label:''};
											$scope.option.dataRange.splitList = splitList;
											$scope.option.dataRange.color=['#fe5e80','#4398cc'];
											chart.setOption($scope.option);
										}
									 	break;
								}
							}
						}

                	 });
				});


				});
	            })
	        });
			if(cityMap!='sichuan'){
				$scope.isCityMap = true;
			}else{
				$scope.isCityMap = false;
			}
		}
	// 自维统计
	if (!$rootScope.functionType) {
			// 地图统计详情
		$scope.normDetail = function() {
			$scope.loadChart('四川');
		}

		// 全省电费情况
		$scope.powerConsumption = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear();
			commonServ.stationECStastic(0, year,$rootScope.auditType).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	            $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var chart = echarts.init(document.getElementById('chart-province'),'walden');
                 $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        chart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });

	                var chartData=data.data;
	                var legendList = [];
	                var keyCurrentTotal = data.data[0].cityData.keyCurrentTotal ||'';
	                var keyPastTotal = data.data[0].cityData.keyPastTotal ||'';
	                var keyAddTotal = data.data[0].cityData.keyAddTotal ||'';
	                var keyAddRate = data.data[0].cityData.keyAddRate ||'';
	                legendList.push(keyCurrentTotal);
	                legendList.push(keyPastTotal);
	                legendList.push(keyAddTotal);
	                legendList.push(keyAddRate);
	                var title = '电费统计管理-全省站点电费情况';
	                var option = {
	                    title:{
	                        text:title,
	                        left: 'center',
	                        top:'3%',
	                    },
	                    legend: {
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%',
	                        data:legendList
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',

	                            data:$scope.getListValsForAttr(chartData,"cityName"),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万元'
	                            }
	                        },{
	                            type: 'value',
	                            axisLabel: {
	                                formatter: '{value} %'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            top:20,
	                            name:keyCurrentTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","currentTotal")
	                        },{
	                            name:keyPastTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","pastTotal")
	                        },{
	                            name:keyAddTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","addTotal")
	                        },{
	                            name:keyAddRate,
	                            type:'line',
	                            yAxisIndex: 1,
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","addRate")
	                        }
	                    ]

	                };

	                chart.setOption(option);
	            })
				})
	        });
		}

		// 全省电费占收比
		$scope.powerRate = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear();
			commonServ.scaleECStastic(0,year).success(function(data){
				utils.loadData(data,function(data){
				if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
				$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var chart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        chart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
					var chatData=data.data;
					var option = {
							title: {
								text: '电费占收比，占支比',
								subtext: ''
							},
							tooltip: {
								trigger: 'axis'
							},
							legend: {
								data:['占收比','占支比']
							},
							xAxis:  {
								type: 'category',
								boundaryGap: false,
								data:$scope.getListValsForAttr(chatData,'cityName')
							},
							yAxis: {
								type: 'value',
								axisLabel: {
									formatter: '{value} %'
								}
							},
							series: [{
								name:'占收比',
								type:'line',
								data:$scope.getListValsForAttrAndSubAttr(chatData,'cityData','income'),
								markLine: {
									data: [{
										type: 'average', name: '平均值'
									}]

							    }},{
							    	name:'占支比',
							    	type:'line',
							    	data:$scope.getListValsForAttrAndSubAttr(chatData,'cityData','expenditure'),
							    	markPoint: {
							    		data: [{
							    			name: '周最低', value: -2, xAxis: 1, yAxis: -1.5
							    		}]
							        }
							    }]
					};
					chart.setOption(option);
				})
				})
			});
		}

		// 载波电费情况
		$scope.carrierTariff = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear();
			commonServ.scECStastic(0, year).success(function(data){
				utils.loadData(data,function(data){
				if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
				$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var chart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        chart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
					var chartData= data.data;
					var list = $scope.getListValsForAttrAndSubAttr(chartData,"cityData","SCEC");
					console.log("  //电费统计管理-全省站点单载波电费情况",list);
					var option = {
							title:{text:"单载波电费",top:'3%',left: 'center'},
							color: ['#3398DB'],
							legend: {
								data:[{
									name:"单载波电费",//'单载波电费'
								}],
								orient: 'horizontal',
								padding:[30,0,10,0],
								top:'3.3%'
							},
							tooltip : {
								trigger: 'axis',
								axisPointer : {            // 坐标轴指示器，坐标轴触发有效
									type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
								}
							},
							grid: {
								left: '2%',
								right: '2%',
								bottom: '0.6%',
								top:'20%',
								containLabel: true
							},
							toolbox: {
								show: true,
								orient: 'horizontal',
								left: 'right',
								padding:[22,22,0,0],
								feature: {
									dataZoom: {
										yAxisIndex: 'none'
									},
									magicType: {type: ['line', 'bar']},
									restore: {},
									saveAsImage: {}
								}
							},
							xAxis : [{
								type : 'category',
								data:$scope.getListValsForAttr(chartData,'cityName'),
								axisTick: {
									alignWithLabel: true
								}
							}],
							yAxis : [{
								type : 'value',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series : [{
								name:"单载波电费(元)",
								type:'bar',
								barWidth: '20%',
								data: $scope.getListValsForAttrAndSubAttr(chartData,"cityData","SCEC"),
								markLine:{
									data:[{
										type:'average',name:'平均值'
									}]
							     }
							}
						]
					};
					chart.setOption(option);
				})
				})
			});
		}

		// 直供电、转供电用电量情况
		$scope.powerSupply = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear();
			commonServ.stationDetailEPStastic(0,year,$rootScope.auditType).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	           	$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData=data.data;
	                var option = {
	                    title:{text:"全省站点直供电，转供电用电量情况",top:'3%',left: 'center'},
	                    legend: {
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%',
	                        data:['直供电电量(万度)','转供电电量(万度)','转供电比例(%)']
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '-2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万度'
	                            }
	                        },
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万度'
	                            }
	                        },{
	                            type: 'value',
	                            axisLabel: {
	                                formatter: '{value} %'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:'直供电电量(万度)',
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","directPower")
	                        }, {
	                            name: '转供电电量(万度)',
	                            type: 'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","rotaryPower")
	                        },{
	                            name:'转供电比例(%)',
	                            type:'line',
	                            yAxisIndex: 2,
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","rotaryRate")
	                        }
	                    ]
	                };
	                myChart.setOption(option);

	            })
	            })
	        });
		}

		// 电费单价占比情况
		$scope.electricityPriceRatio = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear();
			commonServ.unitPriceProportion(0,year).success(function(data){
	            utils.loadData(data,function(data){
	             if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	           	$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData= data.data;
	                var list = $scope.getListValsForAttr(chartData,'cityName');
	                var option = {
	                    title:{text:"电费单价占比情况",top:'3%',left: 'center'},
	                    legend: {
	                        data:['大于1.3元占比','1-1.3元占比','小于1元占比'],
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%'
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value}%'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:"大于1.3元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion1'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        },
	                        {
	                            name:"1-1.3元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion2'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        },
	                        {
	                            name:"小于1元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion3'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	           })
	        })
		}
	}
	// 塔维统计
	else if ($rootScope.functionType == 1) {
		// 指标评优
		$scope.normDetail = function() {
			$scope.ranking = 1;
			$scope.loadChart('四川');
		}

		// 全省电费情况
		$scope.powerConsumption = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear()
			towerReportServ.stationECStastic(0, year,$rootScope.auditType).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	           	$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData=data.data;
	                var legendList = [];
	                var keyCurrentTotal = data.data[0].cityData.keyCurrentTotal ||'';
	                var keyPastTotal = data.data[0].cityData.keyPastTotal ||'';
	                var keyAddTotal = data.data[0].cityData.keyAddTotal ||'';
	                var keyAddRate = data.data[0].cityData.keyAddRate ||'';
	                legendList.push(keyCurrentTotal);
	                legendList.push(keyPastTotal);
	                legendList.push(keyAddTotal);
	                legendList.push(keyAddRate);
	                var title = '电费统计管理-全省站点电费情况';
	                var option = {
	                    title:{
	                        text:title,
	                        left: 'center',
	                        top:'3%',
	                    },
	                    legend: {
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%',
	                        data:legendList
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',

	                            data:$scope.getListValsForAttr(chartData,"cityName"),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万元'
	                            }
	                        },{
	                            type: 'value',
	                            axisLabel: {
	                                formatter: '{value} %'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            top:20,
	                            name:keyCurrentTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","currentTotal")
	                        },{
	                            name:keyPastTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","pastTotal")
	                        },{
	                            name:keyAddTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","addTotal")
	                        },{
	                            name:keyAddRate,
	                            type:'line',
	                            yAxisIndex: 1,
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","addRate")
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	           })
	        });
		}

		// 全省电费占收比
		$scope.powerRate = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear();
			towerReportServ.scaleECStastic(0,year).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	           	$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chatData=data.data;
	                option = {
	                    title: {
	                        text: '电费占收比，占支比',
	                        subtext: ''
	                    },
	                    tooltip: {
	                        trigger: 'axis',
	                        formatter:function(param){
	                            var data = "";
	                            data += param[0].axisValue + '</br>';
	                            for(var i = 0; i< param.length;i++){
	                                data += param[i].seriesName + " : " + param[i].value + "%" + "</br>";
	                            }
	                            return data;
	                        }

	                    },
	                    legend: {
	                        data:['占收比','占支比']
	                    },
	                    toolbox: {
	                        show: true,
	                        feature: {
	                            dataZoom: {
	                                yAxisIndex: 'none'
	                            },
	                            dataView: {readOnly: false},
	                            magicType: {type: ['line', 'bar']},
	                            restore: {},
	                            saveAsImage: {}
	                        }
	                    },
	                    xAxis:  {
	                        type: 'category',
	                        boundaryGap: false,
	                        data:$scope.getListValsForAttr(chatData,'cityName')
	                    },
	                    yAxis: {
	                        type: 'value',
	                        axisLabel: {
	                            formatter: '{value} %'
	                        }
	                    },
	                    series: [

	                        {
	                            name:'占收比',
	                            type:'line',
	                            data:$scope.getListValsForAttrAndSubAttr(chatData,'cityData','占收比'),
	                            markLine: {
	                                data: [
	                                    {type: 'average', name: '平均值'}
	                                ]
	                            }
	                        },

	                        {
	                            name:'占支比',
	                            type:'line',
	                            data:$scope.getListValsForAttrAndSubAttr(chatData,'cityData','占支比'),
	                            markPoint: {
	                                data: [
	                                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
	                                ]
	                            }
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	           })
	        });
		}

		// 载波电费情况
		$scope.carrierTariff = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear();
			towerReportServ.scECStastic( 0,year).success(function(data){
	            utils.loadData(data,function(data){
	             if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	           	$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                       myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                console.log("getStationEPStastic",data);
	                var chartData= data.data;
	                var list = $scope.getListValsForAttrAndSubAttr(chartData,"cityData","SCEC");
	                console.log("  //电费统计管理-全省站点单载波电费情况",list);
	                var option = {
	                    title:{text:"单载波电费",top:'3%',left: 'center'},
	                    color: ['#3398DB'],
	                    legend: {
	                        data:[{
	                            name:"单载波电费",//'单载波电费'
	                        }],
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%'
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value}'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:"单载波电费(元)",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttrAndSubAttr(chartData,"cityData","SCEC"),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	           })
	        });
		}

		// 直供电、转供电用电量情况
		$scope.powerSupply = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear();
			towerReportServ.stationDetailEPStastic(0,year,$rootScope.auditType).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	           	$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData=data.data;
	                var option = {
	                    title:{text:"全省站点直供电，转供电用电量情况",top:'3%',left: 'center'},
	                    legend: {
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%',
	                        data:['直供电电量(万度)','转供电电量(万度)','转供电比例(%)']
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万度'
	                            }
	                        },
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万度'
	                            }
	                        },{
	                            type: 'value',
	                            axisLabel: {
	                                formatter: '{value} %'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:'直供电电量(万度)',
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","directPower")
	                        }, {
	                            name: '转供电电量(万度)',
	                            type: 'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","rotaryPower")
	                        },{
	                            name:'转供电比例(%)',
	                            type:'line',
	                            yAxisIndex: 2,
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","rotaryRate")
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	               })
	            })
	        });
		}

		// 电费单价占比情况
		$scope.electricityPriceRatio = function() {
			$scope.ranking = 0;
			var year = new Date().getFullYear();
			towerReportServ.unitPriceProportion(0,year).success(function(data){
	            utils.loadData(data,function(data){
	             if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	            $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData= data.data;
	                var list = $scope.getListValsForAttr(chartData,'cityName');
	                var option = {
	                    title:{text:"电费单价占比情况",top:'3%',left: 'center'},
	                    legend: {
	                        data:['大于1.3元占比','1-1.3元占比','小于1元占比'],
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%'
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value}%'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:"大于1.3元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion1'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        },
	                        {
	                            name:"1-1.3元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion2'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        },
	                        {
	                            name:"小于1元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion3'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	            })
	        })
		}
	}
}]);

/**
 * 市级经办人
 */

app.controller('municipalIndexCtrl', ['lsServ',  '$rootScope', '$scope', '$state', '$filter', 'ngDialog', 'utils', 'commonServ', 'towerReportServ', function (lsServ, $rootScope, $scope, $state, $filter, ngDialog, utils, commonServ, towerReportServ) {
	$rootScope.auditType=-1;
	$scope.getListValsForAttr=function(list,attr){
        return utils.getListValsForAttr(list,attr);
    }

	$scope.getListValsForAttrAndSubAttr=function(list,attr,subAttr){
        return utils.getListValsForAttrAndSubAttr(list,attr,subAttr);
    }
    commonServ.provinceSummary().success(function(data){
        utils.loadData(data,function(data){
	    	$scope.proSum = data.data;
		})
	})
    $scope.loadChart = function(cityName){
        var cityMap = '';
        var cityCode = '';
        if(cityName){
            switch(cityName){
                case '四川':
                    cityMap = 'sichuan';
                    cityCode = '0';
                    break;
                case '成都':
                    cityMap = '510100';
                    cityCode = '28';
                    break;
                case '阿坝':
                    cityMap = '513200';
                    cityCode = '837';
                    break;
                case '宜宾':
                    cityMap = '511500';
                    cityCode = '831';
                    break;
                case '达州':
                    cityMap = '511700';
                    cityCode = '818';
                    break;
                case '甘孜':
                    cityMap = '513300';
                    cityCode = '836';
                    break;
                case '广元':
                    cityMap = '510800';
                    cityCode = '839';
                    break;
                case '凉山':
                    cityMap = '513400';
                    cityCode = '834';
                    break;
                case '泸州':
                    cityMap = '510500';
                    cityCode = '830';
                    break;
                case '眉山':
                    cityMap = '511400';
                    cityCode = '833';
                    break;
                case '绵阳':
                    cityMap = '510700';
                    cityCode = '816';
                    break;                
                case '内江':
                    cityMap = '511000';
                    cityCode = '842';
                    break;                
                case '南充':
                    cityMap = '511300';
                    cityCode = '817';
                    break;
                case '自贡':
                    cityMap = '510300';
                    cityCode = '813';
                    break;
                case '遂宁':
                    cityMap = '510900';
                    cityCode = '825';
                    break;
                case '雅安':
                    cityMap = '511800';
                    cityCode = '835';
                    break;
                case '资阳':
                    cityMap = '512000';
                    cityCode = '832';
                    break;
                case '广安':
                    cityMap = '511602';
                    cityCode = '826';
                    break;
                case '乐山':
                    cityMap = '511100';
                    cityCode = '843';
                    break;
                case '巴中':
                    cityMap = '511900';
                    cityCode = '827';
                    break;
                case '德阳':
                    cityMap = '510600';
                    cityCode = '838';
                    break;
                case '攀枝花':
                    cityMap = '510400';
                    cityCode = '813';
                    break;
            }
        }
        if( !cityMap || !cityCode){
            return;
        }
        var year = new Date().getFullYear();
        commonServ.normDetail(cityCode, 2016,$rootScope.auditType).success(function(data){
            utils.loadData(data,function(data){

                $scope.ranking = 1;
                var chartData = data.data;
                var rankList = []
                var cityList = []
                var scecList = []
                var incomeList = []
                var rotaryList = []
                var rateList = []
                var switchList = []
                var meterList = []
                var successRateList = []
                var expenditureList =[]

                var expenditureData = []
                var rankData = []
                var cityData = []
                var scecData = []
                var incomeData = []
                var rotaryData = []
                var rateData = []
                var switchData = []
                var meterData = []
                var successRateData = []

                var ind = 1;

                var maxValueMap = {};
                if(null != chartData && chartData.length > 0){

                    rankList = $scope.getListValsForAttr(chartData,"comprehensiveRank");
                    cityList = $scope.getListValsForAttr(chartData,"cityName");
                    scecList = $scope.getListValsForAttr(chartData,"SCEC");
                    incomeList = $scope.getListValsForAttr(chartData,"income");
                    expenditureList = $scope.getListValsForAttr(chartData,"expenditure");
                    rotaryList = $scope.getListValsForAttr(chartData,"RotaryScale");
                    rateList = $scope.getListValsForAttr(chartData,"proportion");
                    switchList = $scope.getListValsForAttr(chartData,"proportion1");
                    meterList = $scope.getListValsForAttr(chartData,"proportion2");
                    successRateList = $scope.getListValsForAttr(chartData,"successRate");

                    rankList.splice(21,1);
                    cityList.splice(21,1);
                    scecList.splice(21,1);
                    incomeList.splice(21,1);
                    expenditureList.splice(21,1);
                    rotaryList.splice(21,1);
                    rateList.splice(21,1);
                    switchList.splice(21,1);
                    meterList.splice(21,1);
                    successRateList.splice(21,1);

                    var rankMin = Math.min.apply(Math, rankList);
                    maxValueMap["综合指标排名"]=rankMin;
                    var scecMax = Math.max.apply(Math, scecList);
                    maxValueMap["单载波电费"]=scecMax;
                    var incomeMax = Math.max.apply(Math, incomeList);
                    maxValueMap["占收入比"]=incomeMax;
                    var expenditureMax = Math.max.apply(Math, expenditureList);
                    maxValueMap["占支出比"]= expenditureMax;
                    var rotaryMax = Math.max.apply(Math, rotaryList);
                    maxValueMap["转供电比"]=rotaryMax;
                    var rateMax = Math.max.apply(Math, rateList);
                    maxValueMap["超额定功率标杆比"]=rateMax;
                    var switchMax = Math.max.apply(Math, switchList);
                    maxValueMap["开关电源可用率"]=switchMax;
                    var meterMax = Math.max.apply(Math, meterList);
                    maxValueMap["智能电表可用率"]=meterMax;
                    var successRateMax =Math.max.apply(Math, successRateList);
                    maxValueMap["资产、财务系统基站名称一致性"]=successRateMax;

                    $scope.maxValueMap = maxValueMap;

                    for(var i = 0 ; i < chartData.length; i++){
                        if (!cityList[i]){
                            continue;
                        }
                        var rank = {};
                        rank.name = cityList[i];
                        rank.value = rankList[i];
                        rankData.push(rank);

                        var scec = {};
                        scec.name = cityList[i];
                        scec.value = parseFloat(scecList[i]);
                        scecData.push(scec);

                        var income = {};
                        income.name = cityList[i];
                        income.value = incomeList[i];
                        incomeData.push(income);

                        var rotary = {};
                        rotary.name = cityList[i];
                        rotary.value = rotaryList[i];
                        rotaryData.push(rotary);

                        var rate = {};
                        rate.name = cityList[i];
                            rate.value = parseFloat(rateList[i]);
                            rateData.push(rate);

                            var switches = {};
                            switches.name = cityList[i];
                            switches.value = switchList[i];
                            switchData.push(switches);

                            var meter = {};
                            meter.name = cityList[i];
                            meter.value = meterList[i];
                            meterData.push(meter);

                            var successRate = {};
                            successRate.name = cityList[i];
                            successRate.value = successRateList[i];
                            successRateData.push(successRate);

                            var expenditure = {};
                            expenditure.name = cityList[i];
                            expenditure.value = expenditureList[i];
                            expenditureData.push(expenditure);

                        }
                    }
                var legendData = ["综合指标排名", "单载波电费", "占收入比", "占支出比", "转供电比", "超额定功率标杆比", "开关电源可用率", "智能电表可用率", "资产、财务系统基站名称一致性" ];
                rankData = $filter('orderBy')(rankData,'value',false);
                $scope.cityRankData = rankData;
                $scope.rankDataName = '综合指标排名';

                var series = [];
                var ind = 1;
                var option = {};

            commonServ.echartMapJson(cityMap).success(function (data) {
            // $.get('./assets/map/json/'+ cityMap +'.json', function (sichuanJson) {
                if(!data||data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
                echarts.registerMap('sichuan', data);
                var container = $("#chart-province");
                var autoWidth = $(".chart-content").width();
                var autoHeight = $(".chart-content").height();
                container.width(autoWidth);
                container.height(autoHeight);
                option = {
                    title: {
                        text: '',
                        padding:[22,0,100,0],
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: '2%',
                        top:'8%',
                        height:autoHeight,
                        width:autoWidth,
                        itemGap:25,
                        selectedMode: 'single',
                        data:legendData,
                    },
                    dataRange: {
                        show:false,
                        x: 'left',
                        y: 'bottom',
                        splitList: [
                            {end: 2,label:''},
                            {start:1,label:''}
                        ],
                        color: ['#4398cc','#fe5e80']
                    },
                    series: [
                    {
                        type: 'map',
                        map: 'sichuan',
                        roam: true,
                        name:"综合指标排名",
                        showLegendSymbol:true,
                        color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                        aspectScale:1,//拉伸比例
                        scaleLimit:{
                            min:1,
                            max:10
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                borderWidth:.5,//各区域边框宽度
                                borderColor: '#0d4566',//区域描线颜色
                                areaColor:"#4398cc",//单位区域颜色
                                label: {
                                    show:true,  //地图文字显示
                                    textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
                                }
                            },
                            emphasis: {            //鼠标经过状态
                                show: true,
                                borderWidth: .5,
                                borderColor:'#64c1fa',
                                areaColor:"#64c1fa",//鼠标经过时区域的颜色
                                shadowBlur: 10,//地图阴影大小
                                label: {
                                    show:true,
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight:600
                                    }
                                }
                            }
                        },
                        data:rankData,
                    },{
                        type: 'map',
                        map: 'sichuan',
                        roam: true,
                        name:"单载波电费",
                        showLegendSymbol:true,
                        color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                        aspectScale:1,//拉伸比例
                        scaleLimit:{
                            min:1,
                            max:10
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                borderWidth:.5,//各区域边框宽度
                                borderColor: '#0d4566',//区域描线颜色
                                areaColor:"#4398cc",//单位区域颜色
                                label: {
                                    show:true,  //地图文字显示
                                    textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
                                }
                            },
                            emphasis: {            //鼠标经过状态
                                show: true,
                                borderWidth: .5,
                                borderColor:'#64c1fa',
                                areaColor:"#64c1fa",//鼠标经过时区域的颜色
                                shadowBlur: 10,//地图阴影大小
                                label: {
                                    show:true,
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight:600
                                    }
                                }
                            }
                        },
                        data:scecData,

                    },{
                        type: 'map',
                        map: 'sichuan',
                        roam: true,
                        name:"占收入比",
                        showLegendSymbol:true,
                        color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                        aspectScale:1,//拉伸比例
                        scaleLimit:{
                            min:1,
                            max:10
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                borderWidth:.5,//各区域边框宽度
                                borderColor: '#0d4566',//区域描线颜色
                                areaColor:"#4398cc",//单位区域颜色
                                label: {
                                    show:true,  //地图文字显示
                                    textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
                                }
                            },
                            emphasis: {            //鼠标经过状态
                                show: true,
                                borderWidth: .5,
                                borderColor:'#64c1fa',
                                areaColor:"#64c1fa",//鼠标经过时区域的颜色
                                shadowBlur: 10,//地图阴影大小
                                label: {
                                    show:true,
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight:600
                                    }
                                }
                            }
                        },
                        data:incomeData,

                    },{
                        type: 'map',
                        map: 'sichuan',
                        roam: true,
                        name:"占支出比",
                        showLegendSymbol:true,
                        color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                        aspectScale:1,//拉伸比例
                        scaleLimit:{
                            min:1,
                            max:10
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                borderWidth:.5,//各区域边框宽度
                                borderColor: '#0d4566',//区域描线颜色
                                areaColor:"#4398cc",//单位区域颜色
                                label: {
                                    show:true,  //地图文字显示
                                    textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
                                }
                            },
                            emphasis: {            //鼠标经过状态
                                show: true,
                                borderWidth: .5,
                                borderColor:'#64c1fa',
                                areaColor:"#64c1fa",//鼠标经过时区域的颜色
                                shadowBlur: 10,//地图阴影大小
                                label: {
                                    show:true,
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight:600
                                    }
                                }
                            }
                        },
                        data:expenditureData,

                    },{
                        type: 'map',
                        map: 'sichuan',
                        roam: true,
                        name:"转供电比",
                        showLegendSymbol:true,
                        color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                        aspectScale:1,//拉伸比例
                        scaleLimit:{
                            min:1,
                            max:10
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                borderWidth:.5,//各区域边框宽度
                                borderColor: '#0d4566',//区域描线颜色
                                areaColor:"#4398cc",//单位区域颜色
                                label: {
                                    show:true,  //地图文字显示
                                    textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
                                }
                            },
                            emphasis: {            //鼠标经过状态
                                show: true,
                                borderWidth: .5,
                                borderColor:'#64c1fa',
                                areaColor:"#64c1fa",//鼠标经过时区域的颜色
                                shadowBlur: 10,//地图阴影大小
                                label: {
                                    show:true,
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight:600
                                    }
                                }
                            }
                        },
                        data:rotaryData,

                    },{
                        type: 'map',
                        map: 'sichuan',
                        roam: true,
                        name:"超额定功率标杆比",
                        showLegendSymbol:true,
                        color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                        aspectScale:1,//拉伸比例
                        scaleLimit:{
                            min:1,
                            max:10
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                borderWidth:.5,//各区域边框宽度
                                borderColor: '#0d4566',//区域描线颜色
                                areaColor:"#4398cc",//单位区域颜色
                                label: {
                                    show:true,  //地图文字显示
                                    textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
                                }
                            },
                            emphasis: {            //鼠标经过状态
                                show: true,
                                borderWidth: .5,
                                borderColor:'#64c1fa',
                                areaColor:"#64c1fa",//鼠标经过时区域的颜色
                                shadowBlur: 10,//地图阴影大小
                                label: {
                                    show:true,
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight:600
                                    }
                                }
                            }
                        },
                        data:rateData,

                    },{
                        type: 'map',
                        map: 'sichuan',
                        roam: true,
                        name:"开关电源可用率",
                        showLegendSymbol:true,
                        color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                        aspectScale:1,//拉伸比例
                        scaleLimit:{
                            min:1,
                            max:10
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                borderWidth:.5,//各区域边框宽度
                                borderColor: '#0d4566',//区域描线颜色
                                areaColor:"#4398cc",//单位区域颜色
                                label: {
                                    show:true,  //地图文字显示
                                    textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
                                }
                            },
                            emphasis: {            //鼠标经过状态
                                show: true,
                                borderWidth: .5,
                                borderColor:'#64c1fa',
                                areaColor:"#64c1fa",//鼠标经过时区域的颜色
                                shadowBlur: 10,//地图阴影大小
                                label: {
                                    show:true,
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight:600
                                    }
                                }
                            }
                        },
                        data:switchData,

                    },{
                        type: 'map',
                        map: 'sichuan',
                        roam: true,
                        name:"智能电表可用率",
                        showLegendSymbol:true,
                        color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                        aspectScale:1,//拉伸比例
                        scaleLimit:{
                            min:1,
                            max:10
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                borderWidth:.5,//各区域边框宽度
                                borderColor: '#0d4566',//区域描线颜色
                                areaColor:"#4398cc",//单位区域颜色
                                label: {
                                    show:true,  //地图文字显示
                                    textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
                                }
                            },
                            emphasis: {            //鼠标经过状态
                                show: true,
                                borderWidth: .5,
                                borderColor:'#64c1fa',
                                areaColor:"#64c1fa",//鼠标经过时区域的颜色
                                shadowBlur: 10,//地图阴影大小
                                label: {
                                    show:true,
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight:600
                                    }
                                }
                            }
                        },
                        data:meterData,

                    },{
                        type: 'map',
                        map: 'sichuan',
                        roam: true,
                        name:"资产、财务系统基站名称一致性",
                        showLegendSymbol:true,
                        color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                        aspectScale:1,//拉伸比例
                        scaleLimit:{
                            min:1,
                            max:10
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                borderWidth:.5,//各区域边框宽度
                                borderColor: '#0d4566',//区域描线颜色
                                areaColor:"#4398cc",//单位区域颜色
                                label: {
                                    show:true,  //地图文字显示
                                    textStyle: {
                                        //文本字体颜色
                                        color: '#000'
                                    }
                                }
                            },
                            emphasis: {            //鼠标经过状态
                                show: true,
                                borderWidth: .5,
                                borderColor:'#64c1fa',
                                areaColor:"#64c1fa",//鼠标经过时区域的颜色
                                shadowBlur: 10,//地图阴影大小
                                label: {
                                    show:true,
                                    textStyle: {
                                        color: '#fff',
                                        fontWeight:600
                                    }
                                }
                            }
                        },
                        data:successRateData,
                    }
                    ]
                };
                var chart = echarts.init(document.getElementById('chart-province'));
                $scope.option = option;
                chart.on('click', function (params) {
                    var city = params.name;
                    $scope.loadChart(city);
                })
                chart.setOption(option);
                chart.on('legendselectchanged', function (params) {
                     $scope.$apply(function(){
                        for(var key in params.selected){
                            if(params.selected[key] === true){
                                $scope.rankDataName = key;
                                switch(key){
                                    case "综合指标排名":
                                        rankData = $filter('orderBy')(rankData,'value',false).splice(0,10);
                                        $scope.cityRankData=rankData;
                                        if($scope.option){
                                            var maxValueMap = $scope.maxValueMap;
                                            var rankMin = maxValueMap["综合指标排名"];
                                            var splitList = $scope.option.dataRange.splitList;
                                            splitList[0] = {end: 2,label:''};
                                            splitList[1] = {start:1,label:''};
                                            $scope.option.dataRange.splitList = splitList;
                                            $scope.option.dataRange.color=['#4398cc','#fe5e80'];
                                            chart.setOption($scope.option);
                                        }
                                        break;
                                    case "单载波电费":
                                        scecData = $filter('orderBy')(scecData,'value',true).splice(0,10);
                                        $scope.cityRankData=scecData;
                                        if($scope.option){
                                            var maxValueMap = $scope.maxValueMap;
                                            var scecMax = maxValueMap["单载波电费"];
                                            var splitList = $scope.option.dataRange.splitList;
                                            splitList[0] = {start:(scecMax-0.5),label:''};
                                            splitList[1] = {end:scecMax,label:''};
                                            $scope.option.dataRange.splitList = splitList;
                                            $scope.option.dataRange.color=['#fe5e80','#4398cc'];
                                            chart.setOption($scope.option);
                                        }
                                        break;
                                    case "占收入比":
                                        incomeData = $filter('orderBy')(incomeData,'value',true).splice(0,10);
                                        $scope.cityRankData=incomeData;
                                        if($scope.option){
                                            var maxValueMap = $scope.maxValueMap;
                                            var incomeMax = maxValueMap["占收入比"];
                                            var splitList = $scope.option.dataRange.splitList;
                                            splitList[1] = {start:(incomeMax-0.5),label:''};
                                            splitList[0] = {end:incomeMax,label:''};
                                            $scope.option.dataRange.splitList = splitList;
                                            $scope.option.dataRange.color=['#fe5e80','#4398cc'];
                                            chart.setOption($scope.option);
                                        }
                                        break;
                                    case "转供电比":
                                        rotaryData = $filter('orderBy')(rotaryData,'value',true).splice(0,10);
                                        $scope.cityRankData=rotaryData;
                                        if($scope.option){
                                            var maxValueMap = $scope.maxValueMap;
                                            var rotaryMax = maxValueMap["转供电比"];
                                            var splitList = $scope.option.dataRange.splitList;
                                            splitList[1] = {start:(rotaryMax-0.5),label:''};
                                            splitList[0] = {end:rotaryMax,label:''};
                                            $scope.option.dataRange.splitList = splitList;
                                            $scope.option.dataRange.color=['#4398cc','#fe5e80'];
                                            chart.setOption($scope.option);
                                        }
                                        break;
                                    case "占支出比":
                                        expenditureData = $filter('orderBy')(expenditureData,'value',true).splice(0,10);
                                        $scope.cityRankData=expenditureData;
                                        console.log('占支出比')
                                        if($scope.option){
                                            var maxValueMap = $scope.maxValueMap;
                                            var expenditureMax = maxValueMap["占支出比"];
                                            console.log(expenditureMax)
                                            var splitList = $scope.option.dataRange.splitList;
                                            splitList[1] = {start:expenditureMax-0.5,label:''};
                                            splitList[0] = {end:expenditureMax,label:''};
                                            $scope.option.dataRange.splitList = splitList;
                                            $scope.option.dataRange.color=['#fe5e80','#4398cc'];
                                            console.log($scope.option.dataRange.splitList)
                                            chart.setOption($scope.option);
                                        }
                                        break;
                                    case "超额定功率标杆比":
                                        rateData = $filter('orderBy')(rateData,'value',true).splice(0,10);
                                        $scope.cityRankData=rateData;
                                        if($scope.option){
                                            var maxValueMap = $scope.maxValueMap;
                                            var rateMax = maxValueMap["超额定功率标杆比"];
                                            var splitList = $scope.option.dataRange.splitList;
                                            splitList[1] = {start:(rateMax-0.5),label:''};
                                            splitList[0] = {end:rateMax,label:''};
                                            $scope.option.dataRange.splitList = splitList;
                                            $scope.option.dataRange.color=['#fe5e80','#4398cc'];
                                            chart.setOption($scope.option);
                                        }
                                        break;
                                    case "开关电源可用率":
                                        switchData = $filter('orderBy')(switchData,'value',true).splice(0,10);
                                        $scope.cityRankData=switchData;
                                        if($scope.option){
                                            var maxValueMap = $scope.maxValueMap;
                                            var switchMax = maxValueMap["开关电源可用率"];
                                            var splitList = $scope.option.dataRange.splitList;
                                            splitList[1] = {start:(switchMax-0.5),label:''};
                                            splitList[0] = {end:switchMax,label:''};
                                            $scope.option.dataRange.splitList = splitList;
                                            $scope.option.dataRange.color=['#fe5e80','#4398cc'];
                                            chart.setOption($scope.option);
                                        }
                                        break;
                                    case "智能电表可用率":
                                        meterData = $filter('orderBy')(meterData,'value',true).splice(0,10);
                                        $scope.cityRankData=meterData;
                                        if($scope.option){
                                            var maxValueMap = $scope.maxValueMap;
                                            var meterMax = maxValueMap["智能电表可用率"];
                                            var splitList = $scope.option.dataRange.splitList;
                                            splitList[1] = {start:(meterMax-0.5),label:''};
                                            splitList[0] = {end:meterMax,label:''};
                                            $scope.option.dataRange.splitList = splitList;
                                            $scope.option.dataRange.color=['#fe5e80','#4398cc'];
                                            chart.setOption($scope.option);
                                        }
                                        break;
                                    case "资产、财务系统基站名称一致性":
                                        successRateData = $filter('orderBy')(successRateData,'value',true).splice(0,10);
                                        $scope.cityRankData=successRateData;
                                        $scope.rankDataName = '资产、财务基站名称一致性';
                                        if($scope.option){
                                            var maxValueMap = $scope.maxValueMap;
                                            var successMax = maxValueMap["资产、财务系统基站名称一致性"];
                                            var splitList = $scope.option.dataRange.splitList;
                                            splitList[1] = {start:(successMax-0.5),label:''};
                                            splitList[0] = {end:successMax,label:''};
                                            $scope.option.dataRange.splitList = splitList;
                                            $scope.option.dataRange.color=['#fe5e80','#4398cc'];
                                            chart.setOption($scope.option);
                                        }
                                        break;
                                }
                            }
                        }

                     });
                });


                });
                })
            });
            if(cityMap!='sichuan'){
                $scope.isCityMap = true;
            }else{
                $scope.isCityMap = false;
            }
        }
	// 自维统计
	if (!$rootScope.functionType) {
			// 地图统计详情
		$scope.normDetail = function() {
            var cityName = window.sessionStorage.getItem("userCityName");
            if(!cityName){
                cityName = '成都';
            }
            $scope.loadChart(cityName);
        }

		// 全省电费情况
		$scope.powerConsumption = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			commonServ.stationECStastic(cityId, year,$rootScope.auditType).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	           	$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var chart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        chart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData=data.data;
	                var legendList = [];
	                var keyCurrentTotal = data.data[0].cityData.keyCurrentTotal ||'';
	                var keyPastTotal = data.data[0].cityData.keyPastTotal ||'';
	                var keyAddTotal = data.data[0].cityData.keyAddTotal ||'';
	                var keyAddRate = data.data[0].cityData.keyAddRate ||'';
	                legendList.push(keyCurrentTotal);
	                legendList.push(keyPastTotal);
	                legendList.push(keyAddTotal);
	                legendList.push(keyAddRate);
	                var title = '电费统计管理-全省站点电费情况';
	                var option = {
	                    title:{
	                        text:title,
	                        left: 'center',
	                        top:'3%',
	                    },
	                    legend: {
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%',
	                        data:legendList
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',

	                            data:$scope.getListValsForAttr(chartData,"cityName"),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万元'
	                            }
	                        },{
	                            type: 'value',
	                            axisLabel: {
	                                formatter: '{value} %'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            top:20,
	                            name:keyCurrentTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","currentTotal")
	                        },{
	                            name:keyPastTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","pastTotal")
	                        },{
	                            name:keyAddTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","addTotal")
	                        },{
	                            name:keyAddRate,
	                            type:'line',
	                            yAxisIndex: 1,
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","addRate")
	                        }
	                    ]
	                };
	                chart.setOption(option);
	            })
	            })
	        });
		}

		// 全省电费占收比
		$scope.powerRate = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			commonServ.scaleECStastic(cityId,year).success(function(data){
				utils.loadData(data,function(data){
					 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
				$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var chart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        chart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
					var chatData=data.data;
					var option = {
							title: {
								text: '电费占收比，占支比',
								subtext: ''
							},
							tooltip: {
								trigger: 'axis'
							},
							legend: {
								data:['占收比','占支比']
							},
							xAxis:  {
								type: 'category',
								boundaryGap: false,
								data:$scope.getListValsForAttr(chatData,'cityName')
							},
							yAxis: {
								type: 'value',
								axisLabel: {
									formatter: '{value} %'
								}
							},
							series: [{
								name:'占收比',
								type:'line',
								data:$scope.getListValsForAttrAndSubAttr(chatData,'cityData','income'),
								markLine: {
									data: [{
										type: 'average', name: '平均值'
									}]

							    }},{
							    	name:'占支比',
							    	type:'line',
							    	data:$scope.getListValsForAttrAndSubAttr(chatData,'cityData','expenditure'),
							    	markPoint: {
							    		data: [{
							    			name: '周最低', value: -2, xAxis: 1, yAxis: -1.5
							    		}]
							        }
							    }]
					};
					chart.setOption(option);
					})
				})
			});
		}

		// 载波电费情况
		$scope.carrierTariff = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			commonServ.scECStastic(cityId, year).success(function(data){
				utils.loadData(data,function(data){
					 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
				$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var chart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        chart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
					var chartData= data.data;
					var list = $scope.getListValsForAttrAndSubAttr(chartData,"cityData","SCEC");
					console.log("  //电费统计管理-全省站点单载波电费情况",list);
					var option = {
							title:{text:"单载波电费",top:'3%',left: 'center'},
							color: ['#3398DB'],
							legend: {
								data:[{
									name:"单载波电费",//'单载波电费'
								}],
								orient: 'horizontal',
								padding:[30,0,10,0],
								top:'3.3%'
							},
							tooltip : {
								trigger: 'axis',
								axisPointer : {            // 坐标轴指示器，坐标轴触发有效
									type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
								}
							},
							grid: {
								left: '2%',
								right: '2%',
								bottom: '0.6%',
								top:'20%',
								containLabel: true
							},
							toolbox: {
								show: true,
								orient: 'horizontal',
								left: 'right',
								padding:[22,22,0,0],
								feature: {
									dataZoom: {
										yAxisIndex: 'none'
									},
									magicType: {type: ['line', 'bar']},
									restore: {},
									saveAsImage: {}
								}
							},
							xAxis : [{
								type : 'category',
								data:$scope.getListValsForAttr(chartData,'cityName'),
								axisTick: {
									alignWithLabel: true
								}
							}],
							yAxis : [{
								type : 'value',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series : [{
								name:"单载波电费(元)",
								type:'bar',
								barWidth: '20%',
								data: $scope.getListValsForAttrAndSubAttr(chartData,"cityData","SCEC"),
								markLine:{
									data:[{
										type:'average',name:'平均值'
									}]
							     }
							}
						]
					};
					chart.setOption(option);
				})
				})
			});
		}

		// 直供电、转供电用电量情况
		$scope.powerSupply = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			commonServ.stationDetailEPStastic(cityId,year,$rootScope.auditType).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	             $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData=data.data;
	                var option = {
	                    title:{text:"全省站点直供电，转供电用电量情况",top:'3%',left: 'center'},
	                    legend: {
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%',
	                        data:['直供电电量(万度)','转供电电量(万度)','转供电比例(%)']
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万度'
	                            }
	                        },
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万度'
	                            }
	                        },{
	                            type: 'value',
	                            axisLabel: {
	                                formatter: '{value} %'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:'直供电电量(万度)',
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","directPower")
	                        }, {
	                            name: '转供电电量(万度)',
	                            type: 'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","rotaryPower")
	                        },{
	                            name:'转供电比例(%)',
	                            type:'line',
	                            yAxisIndex: 2,
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","rotaryRate")
	                        }
	                    ]
	                };
	                myChart.setOption(option);

	                })
	            })
	        });
		}

		// 电费单价占比情况
		$scope.electricityPriceRatio = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			commonServ.unitPriceProportion(cityId,year).success(function(data){
	            utils.loadData(data,function(data){
	             if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	            $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData= data.data;
	                var list = $scope.getListValsForAttr(chartData,'cityName');
	                var option = {
	                    title:{text:"电费单价占比情况",top:'3%',left: 'center'},
	                    legend: {
	                        data:['大于1.3元占比','1-1.3元占比','小于1元占比'],
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%'
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value}%'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:"大于1.3元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion1'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        },
	                        {
	                            name:"1-1.3元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion2'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        },
	                        {
	                            name:"小于1元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion3'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	        	})
	        })
		}
	}
	// 塔维统计
	else if ($rootScope.functionType == 1) {
		// 指标评优
        $scope.normDetail = function() {
            var cityName = window.sessionStorage.getItem("userCityName");
            if(!cityName){
                cityName = '成都';
            }
            $scope.loadChart(cityName);
        }
		// 全省电费情况
		$scope.powerConsumption = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			towerReportServ.stationECStastic(cityId, year,$rootScope.auditType).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	            $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData=data.data;
	                var legendList = [];
	                var keyCurrentTotal = data.data[0].cityData.keyCurrentTotal ||'';
	                var keyPastTotal = data.data[0].cityData.keyPastTotal ||'';
	                var keyAddTotal = data.data[0].cityData.keyAddTotal ||'';
	                var keyAddRate = data.data[0].cityData.keyAddRate ||'';
	                legendList.push(keyCurrentTotal);
	                legendList.push(keyPastTotal);
	                legendList.push(keyAddTotal);
	                legendList.push(keyAddRate);
	                var title = '电费统计管理-全省站点电费情况';
	                var option = {
	                    title:{
	                        text:title,
	                        left: 'center',
	                        top:'3%',
	                    },
	                    legend: {
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%',
	                        data:legendList
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',

	                            data:$scope.getListValsForAttr(chartData,"cityName"),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万元'
	                            }
	                        },{
	                            type: 'value',
	                            axisLabel: {
	                                formatter: '{value} %'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            top:20,
	                            name:keyCurrentTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","currentTotal")
	                        },{
	                            name:keyPastTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","pastTotal")
	                        },{
	                            name:keyAddTotal,
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","addTotal")
	                        },{
	                            name:keyAddRate,
	                            type:'line',
	                            yAxisIndex: 1,
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","addRate")
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	            })
	        });
		}

		// 全省电费占收比
		$scope.powerRate = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			towerReportServ.scaleECStastic(cityId,year).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	            $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chatData=data.data;
	                option = {
	                    title: {
	                        text: '电费占收比，占支比',
	                        subtext: ''
	                    },
	                    tooltip: {
	                        trigger: 'axis',
	                        formatter:function(param){
	                            var data = "";
	                            data += param[0].axisValue + '</br>';
	                            for(var i = 0; i< param.length;i++){
	                                data += param[i].seriesName + " : " + param[i].value + "%" + "</br>";
	                            }
	                            return data;
	                        }

	                    },
	                    legend: {
	                        data:['占收比','占支比']
	                    },
	                    xAxis:  {
	                        type: 'category',
	                        boundaryGap: false,
	                        data:$scope.getListValsForAttr(chatData,'cityName')
	                    },
	                    yAxis: {
	                        type: 'value',
	                        axisLabel: {
	                            formatter: '{value} %'
	                        }
	                    },
	                    series: [

	                        {
	                            name:'占收比',
	                            type:'line',
	                            data:$scope.getListValsForAttrAndSubAttr(chatData,'cityData','占收比'),
	                            markLine: {
	                                data: [
	                                    {type: 'average', name: '平均值'}
	                                ]
	                            }
	                        },

	                        {
	                            name:'占支比',
	                            type:'line',
	                            data:$scope.getListValsForAttrAndSubAttr(chatData,'cityData','占支比'),
	                            markPoint: {
	                                data: [
	                                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
	                                ]
	                            }
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	            })
	        });
		}

		// 载波电费情况
		$scope.carrierTariff = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			towerReportServ.scECStastic(cityId,year).success(function(data){
	            utils.loadData(data,function(data){
	             if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	            $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData= data.data;
	                var list = $scope.getListValsForAttrAndSubAttr(chartData,"cityData","SCEC");
	                console.log("  //电费统计管理-全省站点单载波电费情况",list);
	                var option = {
	                    title:{text:"单载波电费",top:'3%',left: 'center'},
	                    color: ['#3398DB'],
	                    legend: {
	                        data:[{
	                            name:"单载波电费",//'单载波电费'
	                        }],
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%'
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value}'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:"单载波电费(元)",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttrAndSubAttr(chartData,"cityData","SCEC"),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	            })
	        });
		}

		// 直供电、转供电用电量情况
		$scope.powerSupply = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			towerReportServ.stationDetailEPStastic(cityId,year,$rootScope.auditType).success(function(data){
	            utils.loadData(data,function(data){
	            	 if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	            $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData=data.data;
	                var option = {
	                    title:{text:"全省站点直供电，转供电用电量情况",top:'3%',left: 'center'},
	                    legend: {
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%',
	                        data:['直供电电量(万度)','转供电电量(万度)','转供电比例(%)']
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万度'
	                            }
	                        },
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value} 万度'
	                            }
	                        },{
	                            type: 'value',
	                            axisLabel: {
	                                formatter: '{value} %'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:'直供电电量(万度)',
	                            type:'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","directPower")
	                        }, {
	                            name: '转供电电量(万度)',
	                            type: 'bar',
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","rotaryPower")
	                        },{
	                            name:'转供电比例(%)',
	                            type:'line',
	                            yAxisIndex: 2,
	                            data:$scope.getListValsForAttrAndSubAttr(chartData,"cityData","rotaryRate")
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	            })
	        });
		}

		// 电费单价占比情况
		$scope.electricityPriceRatio = function() {
			$scope.ranking = 0;
			var cityId = $rootScope.loginUser.city;
			var year = new Date().getFullYear();
			towerReportServ.unitPriceProportion(cityId,year).success(function(data){
	            utils.loadData(data,function(data){
	             if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
	             $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('chart-province'),'walden');
                $(window).on("resize.doResize", function (){
	                  $scope.$apply(function(){
	                        $("#chart-province").height($(".chart-content").height());
	                        $("#chart-province").width($(".chart-content").width());
	                        myChart.resize();
	                  });
	              });

	              $scope.$on("$destroy",function (){
	                  $(window).off("resize.doResize"); //remove the handler added earlier
	              });
	                var chartData=data.data;
	                var chartData= data.data;
	                var list = $scope.getListValsForAttr(chartData,'cityName');
	                var option = {
	                    title:{text:"电费单价占比情况",top:'3%',left: 'center'},
	                    legend: {
	                        data:['大于1.3元占比','1-1.3元占比','小于1元占比'],
	                        orient: 'horizontal',
	                        padding:[30,0,10,0],
	                        top:'3.3%'
	                    },
	                    tooltip : {
	                        trigger: 'axis',
	                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                        }
	                    },
	                    grid: {
	                        left: '2%',
	                        right: '2%',
	                        bottom: '0.6%',
	                        top:'20%',
	                        containLabel: true
	                    },
	                    xAxis : [
	                        {
	                            type : 'category',
	                            data:$scope.getListValsForAttr(chartData,'cityName'),
	                            axisTick: {
	                                alignWithLabel: true
	                            }
	                        }
	                    ],
	                    yAxis : [
	                        {
	                            type : 'value',
	                            axisLabel: {
	                                formatter: '{value}%'
	                            }
	                        }
	                    ],
	                    series : [
	                        {
	                            name:"大于1.3元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion1'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        },
	                        {
	                            name:"1-1.3元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion2'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        },
	                        {
	                            name:"小于1元占比",
	                            type:'bar',
	                            barWidth: '20%',
	                            data: $scope.getListValsForAttr(chartData,'proportion3'),
	                            markLine:{
	                                data:[{
	                                    type:'average',name:'平均值'
	                                }]
	                            }
	                        }
	                    ]
	                };
	                myChart.setOption(option);
	            })
	            })
	        })
		}
	}
}]);


/**
 * 经办人
 */

app.controller('trusteesIndexCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', 'towerAuditServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ, towerAuditServ) {

    //tabIndex 选择
    $scope.tabIndex=1;
    $scope.userType = findUserType();
    $rootScope.auditType=-1;
    // 分布参数
    $scope.pageInfo = {
		totalCount: 0,//总的记录条数
		pageCount: 0,// 总的页数
		pageOptions: [15,50,100,200],//每页条数的选项,选填
		showPages: 5//显示几个页码,选填
	};

    // 查询参数
	$scope.params = {
		pageSize: 15,//每页显示条数
		pageNo: 1,// 当前页
	};

	// 跳转稽核待办
	$scope.goTowerAuditApproval = function(type) {
		// 跳转后的查询参数
		$rootScope.stateType = 'handle';
        $rootScope.reloadPage =  false;
		if (!$scope.approvalAuditNum) {
			return;
		}
		// 自维
		if (!$rootScope.functionType) {
			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
			$state.go('app.auditTariff', {
    			'status':'tariff/audit'
    		});
		}
		// 塔维
		else if ($rootScope.functionType == 1) {
			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
			$state.go('app.towerAuditTariff', {
				'status':'towerAuditTariff/twAudit'
			});
		}
	}
	
	
	// 跳转预付待办
	$scope.goPreApproval = function() {
		// 跳转后的查询参数
		$rootScope.stateType = 'handle';
        $rootScope.reloadPage =  false;
	/*	if (!$scope.approvalAuditNum) {
			return;
		}*/
		
			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
			$state.go('app.prepaySel', {
    			'status':'prepay/sel'
    		});
		}
	
	// 跳转冲销单待办
	$scope.goHXApproval = function() {
		// 跳转后的查询参数
		$rootScope.stateType = 'handle';
        $rootScope.reloadPage =  false;
/*		if (!$scope.approvalElectricityNum) {
			return;
		}
*/		
			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[1].id; // 選中效果
			$state.go('app.auditTariff', {
    			'status':'tariff/audit'
    		});
		}
	

	// 跳转电费提交单待办
	$scope.goTowerElectricityApproval = function() {

		if (!$scope.approvalElectricityNum) {
			return;
		}

		// 自维
		if (!$rootScope.functionType) {
			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[2].id; // 選中效果
			$state.go('app.inputFinance', {
    			'status':'tpl/tariffFinance.html'
    		});
		}
		// 塔维
		else if ($rootScope.functionType == 1) {
			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[2].id; // 選中效果
			$state.go('app.towerInputFinance', {
				'status':'towerInputFinance/SubmitFinancial'
			});
		}
	}
	
	
	// 查询登录人预付总数量
	commonServ.queryPreNum().success(function(data) {
		$scope.approvalPreNum = data;
	});
	
	// 查询登录人预付要审批数量
	commonServ.queryPreSNum().success(function(data) {
		$scope.approvalPreSNum = data;
	});
	
	// 查询登录人预付要处理数量
	commonServ.queryPreCNum().success(function(data) {
		$scope.approvalPreCNum = data;
	});
	

    // 自维
    if (!$rootScope.functionType) {
    	// 查询自维稽核待办的统计信息
    	commonServ.queryPendingApproval().success(function(data) {
    		$scope.approvalAuditNum = data.data || 0;
    	});
    	
    	// 查询自维稽核待办的统计信息
    	commonServ.queryPendingApproval().success(function(data) {
    		$scope.approvalAuditNum = data.data || 0;
    	});
    	
    	// 电费提交单待处理
    	commonServ.queryElectricityApproval().success(function(data) {
    		$scope.approvalElectricityNum = data.data || 0;
    	})

    	// 自维历史稽核单查询
    	$scope.getData=function(){
    		commonServ.getInputElectrictyList($scope.params).success(function (data) {
    			utils.loadData(data, function (data) {
    				$scope.pageInfo.totalCount = data.data.totalRecord;
    				$scope.pageInfo.pageCount = data.data.totalPage;
    				$scope.params.page = data.data.pageNo;
    				$scope.list = data.data.results;

    			})
    		});
    	}

    	// 自维历史稽核单查询详情

	    $scope.showIndexDetail = function(item,flag,save){
	        $scope.flag = flag;   //修改显示保存和取消
	        $scope.flagSave = save;//查看时只显示确定按钮
	        $scope.editZiweiID= item.electricty.id;
	        $scope.instanceId = item.instanceId;
	        if(item.flowState <= 1) {
	            $scope.isZWauditSave = true;
	        }
	        // 列表详情
	        commonServ.getInputElectrictyById(item.businessKey).success(function (data) {
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
	        $scope.showIndexDetailDialog=ngDialog.open({
	            template: './tpl/auditPageDialog.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
	            width: 1200,
	            controller:'addOrUpdateAuditCtrl',
	            scope: $scope
	        });

	    }

	     // 查看详情关闭弹出框
	    $scope.closePage = function(){
	        $scope.showIndexDetailDialog.close("");
	    };




    	// 自维稽核单状态统计图
    	commonServ.stasticStatus().success(function(data){

    		utils.loadData(data,function(data){
    			console.log(data.data)



		     $.get('assets/js/extends/walden.json', function (obj) {
		        echarts.registerTheme('walden', obj);
		  		var myChart = echarts.init( document.getElementById('container'), 'walden');


    			if(data.data==null){
    				utils.msg("暂无数据！");
    				return;
    			}

    			var chartData=[];
    			var legendList=[];
    			for(var i=0; i<data.data.length; i++){
    				var item= data.data[i];
    				legendList.push(item.name)
    				chartData.push({"name":item.name, "value":item.value});
    			}

			    $(window).on("resize.doResize", function (){
			      $scope.$apply(function(){
				      	var container = $("#container");
		    			var autoWidth;
		    			var autoHeight;
		    			(function resizedom () {
				            autoWidth = $("#manager").width();
		    				autoHeight = $("#manager").height()-110;
				        })();
		    			container.width(autoWidth);
		    			container.height(autoHeight);
		    			myChart.resize();
			      });
			  	});

			  $scope.$on("$destroy",function (){
			      $(window).off("resize.doResize"); //remove the handler added earlier
			  });

    			var container = $("#container");
    			var autoWidth;
    			var autoHeight;
    			(function resizedom () {
		            autoWidth = $("#manager").width();
    				autoHeight = $("#manager").height()-110;
		        })();
    			container.width(autoWidth);
    			container.height(autoHeight);
    			var option = {
    					title : {
    						text: '稽核单状态统计',
    						x:'center',
				            y: '5%',
				            textStyle: {
					            color: '#585c5e',
					            fontSize: '18'
				            }
    					},
    					tooltip : {
    						trigger: 'item',
    						formatter: "{a} <br/>{b} : {c} ({d}%)"
    					},
    					legend: {
    						orient: 'vertical',
    						x: '80%',
              				y: '10%',
    						right: '85%',
    						height:autoHeight,
    						width:autoWidth,
    						data: legendList,
    					},
    					series : [{
    					    name: '访问来源',
    					    type: 'pie',
    					    radius : '70%',
    					    center: ['50%', '57%'],
    					    data:chartData,
    					    itemStyle: {
    					        emphasis: {
    					            shadowBlur: 10,
    					        	shadowOffsetX: 0,
    					        	shadowColor: 'rgba(0, 0, 0, 0.5)'
    					        }
    					    }}],

    			};


    			myChart.setOption(option);

    			})
    		});
    	});

    	// 自维报销单状态图
    	commonServ.stasticSubmitStatus().success(function(data){
    		utils.loadData(data,function(data){
    		 $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart1 = echarts.init(document.getElementById('container1'),'walden');
	                var chartData=data.data;

    			if(data.data==null){
    				utils.msg("暂无数据！");
    				return;
    			}

    			var chartData=[];
    			var legendList=[];
    			for(var i=0; i<data.data.length; i++){
    				var item= data.data[i];
    				legendList.push(item.name)
    				chartData.push({"name":item.name, "value":item.value});
    			}

    			var container = $("#container1");
    			var autoWidth;
    			var autoHeight;
    			(function resizedom () {
		            autoWidth = $("#manager").width();
    				autoHeight =$("#manager").height();
		        })();
    			container.width(autoWidth);
    			container.height(autoHeight);
    			var option1 = {
    				title : {
    					text: '报销单状态统计',
    					x:'center',
					    y: '5%',
			            textStyle: {
				            color: '#585c5e',
				            fontSize: '18'
				        }
    				},
    				tooltip : {
    					trigger: 'item',
    					formatter: "{a} <br/>{b} : {c} ({d}%)"
    				},
    				legend: {
    					orient: 'vertical',
    					left: 'left',
    					height: autoHeight,
    					width: autoWidth,
    					x: '80%',
          				y: '10%',
						right: '85%',
						data: ['等待推送至财务','等待推送报销发起人','推送成功'],

    				},
    				series : [{
    				        	name: '访问来源',
    				        	type: 'pie',
    				        	radius : '70%',
    					        center: ['50%', '57%'],
    				        	data:chartData,
    				        	itemStyle: {
    				        		  emphasis: {
    				        			  shadowBlur: 10,
    				        			  shadowOffsetX: 0,
    				        			  shadowColor: 'rgba(0, 0, 0, 0.5)'
    				        		  }
    				        	  }
    				          }],

    			};




    			myChart1.setOption(option1);
    		})
    		});
    	});
    }
    // 塔维
    else if ($rootScope.functionType == 1) {

    	// 查询塔维待办的统计信息
    	commonServ.queryTowerPendingApproval().success(function(data) {
    		$scope.approvalAuditNum = data.data || 0;
    	});

    	// 查询塔维生成电费提交待办数
    	commonServ.queryTowerElectricityApproval().success(function(data) {
    		$scope.approvalElectricityNum = data.data || 0;
    	})

    	// 塔维历史稽核单
    	$scope.getData=function(){
    		towerAuditServ.getTowerAuditList($scope.params).success(function (data) {
    			utils.loadData(data, function (data) {
    				console.log(data.data);
    				$scope.pageInfo.totalCount = data.data.totalRecord;
    				$scope.pageInfo.pageCount = data.data.totalPage;
    				$scope.params.page = data.data.pageNo;
    				$scope.list = data.data.results;
    			})
    		});
    	}

    	// 塔维历史稽核单查询详情
    	$scope.showTWIndexDetail = function(item,flag,save){
	        $scope.flag = flag;   //修改显示保存和取消
	        $scope.flagSave = save;//查看时只显示确定按钮

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



	        /**
	         * [流转信息]
	         *
	         */
	        towerAuditServ.queryApprovalDetails(item.instanceId).success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.ApprovalDetails = data.data;
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

    	// 塔维稽核单状态统计图
    	commonServ.towerStasticStatus().success(function(data){
    		utils.loadData(data,function(data){
    		$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');

    			if(data.data==null){
    				utils.msg("暂无数据！");
    				return;
    			}

    			var chartData=[];
    			var legendList=[];
    			for(var i=0; i<data.data.length; i++){
    				var item= data.data[i];
    				legendList.push(item.name)
    				chartData.push({"name":item.name, "value":item.value});
    			}

    			var container = $("#container");
    			var autoWidth;
    			var autoHeight;
    			(function resizedom () {
		            autoWidth = $("#manager").width();
    				autoHeight = $("#manager").height()-110;
		        })();
    			container.width(autoWidth);
    			container.height(autoHeight);

    			var option = {
    					title : {
    						text: '稽核单状态统计',
    						x:'center',
						    y: '5%',
				            textStyle: {
					            color: '#585c5e',
					            fontSize: '18'
					        }
    					},
    					tooltip : {
    						trigger: 'item',
    						formatter: "{a} <br/>{b} : {c} ({d}%)"
    					},
    					legend: {
    						orient: 'vertical',
    						left: 'right',
    						x: '80%',
              				y: '10%',
    						right: '85%',
    						height:autoHeight,
    						width:autoWidth,
    						data: legendList,
    					},
    					series : [{
    					    name: '访问来源',
    					    type: 'pie',
    					    radius : '70%',
    					    center: ['50%', '57%'],
    					    data:chartData,
    					    itemStyle: {
    					        emphasis: {
    					            shadowBlur: 10,
    					        	shadowOffsetX: 0,
    					        	shadowColor: 'rgba(0, 0, 0, 0.5)'
    					        }
    					    }}]
    			};

    			myChart.setOption(option);
    		})
    		});
    	});

    	// 塔维报销单状态图
    	commonServ.towerStasticSubmitStatus().success(function(data){
    		utils.loadData(data,function(data){
    			$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart1 = echarts.init(document.getElementById('container1'),'walden');


    			if(data.data==null){
    				utils.msg("暂无数据！");

    				return;
    			}

    			var chartData=[];
    			var legendList=[];
    			for(var i=0; i<data.data.length; i++){
    				var item= data.data[i];
    				legendList.push(item.name)
    				chartData.push({"name":item.name, "value":item.value});
    			}

    			var container = $("#container1");
    			var autoWidth = container.parent().parent().width();
    			var autoHeight = container.parent().parent().height()-100;
    			container.width(autoWidth);
    			container.height(autoHeight)
    			var option1 = {
    				title : {
    					text: '报销单状态统计',
    					x:'center',
					    y: '5%',
			            textStyle: {
				            color: '#585c5e',
				            fontSize: '18'
				        }
    				},
    				tooltip : {
    					trigger: 'item',
    					formatter: "{a} <br/>{b} : {c} ({d}%)"
    				},
    				legend: {
    					orient: 'vertical',
    					left: 'left',
    					x: '80%',
          				y: '10%',
						right: '85%',
						height:autoHeight,
						width:autoWidth,
    					data: legendList,
    				},
    				series : [{
    				        	name: '访问来源',
    				        	type: 'pie',
    				        	radius : '70%',
    					    	center: ['50%', '57%'],
    				        	data:chartData,
    				        	itemStyle: {
    				        		  emphasis: {
    				        			  shadowBlur: 10,
    				        			  shadowOffsetX: 0,
    				        			  shadowColor: 'rgba(0, 0, 0, 0.5)'
    				        		  }
    				        	  }
    				          }]
    			};
    			// var myChart1 = echarts.init(document.getElementById('container1'));
    			myChart1.setOption(option1);
    		})
    		});
    	});
    }
}]);

/**
 * 区县报销人
 */

app.controller('countyCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', 'towerAuditServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ, towerAuditServ) {
    //tab 选择
    $scope.tabCounty=1;
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

    $scope.userType = findUserType();

    // 自维
    if (!$rootScope.functionType) {
    	// 查询自维稽核待办的统计信息
    	commonServ.queryPendingApproval().success(function(data) {
    		$scope.approvalAuditNum = data.data || 0;
    	});

    	// 自维历史稽核单查询
    	$scope.getData=function(){
    		commonServ.getInputElectrictyList($scope.params).success(function (data) {
    			utils.loadData(data, function (data) {
    				console.log(data.data);
    				$scope.pageInfo.totalCount = data.data.totalRecord;
    				$scope.pageInfo.pageCount = data.data.totalPage;
    				$scope.params.page = data.data.pageNo;
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
	                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                    $scope.singUploadFiles = data.data.sysFileVOs;  //附件
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

    	// 自维稽核单状态统计图
    	commonServ.stasticCountySubmitStatus().success(function(data){
    		utils.loadData(data,function(data){
    			$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
    			if(data.data==null){
    				utils.msg("暂无数据！");
    				return;
    			}

    			var chartData=[];
    			var legendList=[];
    			for(var i=0; i<data.data.length; i++){
    				var item= data.data[i];
    				legendList.push(item.name)
    				chartData.push({"name":item.name, "value":item.value});
    			}
    			var container = $("#container");
    			var autoWidth;
    			var autoHeight;
    			(function resizedom () {
		            autoWidth = $("#manager").width();
    				autoHeight = $("#manager").height()-110;
		        })();
    			container.width(autoWidth);
    			container.height(autoHeight);
    			var option = {
    					title : {
    						text: '稽核单状态统计',
    						x:'center',
				            y: '5%',
				            textStyle: {
					            color: '#585c5e',
					            fontSize: '18'
				            }
    					},
    					tooltip : {
    						trigger: 'item',
    						formatter: "{a} <br/>{b} : {c} ({d}%)"
    					},
    					legend: {
    						orient: 'vertical',
    						x: '80%',
              				y: '10%',
    						right: '85%',
    						height:autoHeight,
    						width:autoWidth,
    						data: legendList,
    					},
    					series : [{
    					    name: '访问来源',
    					    type: 'pie',
    					    radius : '70%',
    					    center: ['50%', '57%'],
    					    data:chartData,
    					    itemStyle: {
    					        emphasis: {
    					            shadowBlur: 10,
    					        	shadowOffsetX: 0,
    					        	shadowColor: 'rgba(0, 0, 0, 0.5)'
    					        }
    					    }}]
    			};

    			// var myChart = echarts.init(document.getElementById('container'));
    			myChart.setOption(option);
    		})
    		});
    	});
    }
    // 塔维
    else if ($rootScope.functionType == 1) {

    	// 查询塔维待办的统计信息
    	commonServ.queryTowerPendingApproval().success(function(data) {
    		$scope.approvalAuditNum = data.data || 0;
    	});

    	// 塔维历史稽核单
    	$scope.getData=function(){
    		towerAuditServ.getTowerAuditList($scope.params).success(function (data) {
    			utils.loadData(data, function (data) {
    				console.log(data.data);
    				$scope.pageInfo.totalCount = data.data.totalRecord;
    				$scope.pageInfo.pageCount = data.data.totalPage;
    				$scope.params.page = data.data.pageNo;
    				$scope.list = data.data.results;
    			})
    		});
    	}

    	// 塔维历史稽核单查询详情
    	$scope.showTWIndexDetail = function(item,flag,save){
	        $scope.flag = flag;   //修改显示保存和取消
	        $scope.flagSave = save;//查看时只显示确定按钮

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



	        /**
	         * [流转信息]
	         *
	         */
	        towerAuditServ.queryApprovalDetails(item.instanceId).success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.ApprovalDetails = data.data;
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

    	// 塔维稽核单状态统计图
    	commonServ.stasticTowerCountySubmitStatus().success(function(data){
    		utils.loadData(data,function(data){
    			$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
    			if(data.data==null){
    				utils.msg("暂无数据！");
    				return;
    			}

    			var chartData=[];
    			var legendList=[];
    			for(var i=0; i<data.data.length; i++){
    				var item= data.data[i];
    				legendList.push(item.name)
    				chartData.push({"name":item.name, "value":item.value});
    			}
    			var container = $("#container");
    			var autoWidth;
    			var autoHeight;
    			(function resizedom () {
		            autoWidth = $("#manager").width();
    				autoHeight = $("#manager").height()-110;
		        })();
    			container.width(autoWidth);
    			container.height(autoHeight);
    			var option = {
    					title : {
    						text: '稽核单状态统计',
    						x:'center',
				            y: '5%',
				            textStyle: {
					            color: '#585c5e',
					            fontSize: '18'
				            }
    					},
    					tooltip : {
    						trigger: 'item',
    						formatter: "{a} <br/>{b} : {c} ({d}%)"
    					},
    					legend: {
    						orient: 'vertical',
    						x: '80%',
              				y: '10%',
    						right: '85%',
    						height:autoHeight,
    						width:autoWidth,
    						data: ['审批中','审批通过','审批驳回'],
    					},
    					series : [{
    					    name: '访问来源',
    					    type: 'pie',
    					    radius : '70%',
    					    center: ['50%', '57%'],
    					    data:chartData,
    					    itemStyle: {
    					        emphasis: {
    					            shadowBlur: 10,
    					        	shadowOffsetX: 0,
    					        	shadowColor: 'rgba(0, 0, 0, 0.5)'
    					        }
    					    }}]
    			};

    			// var myChart = echarts.init(document.getElementById('container'));
    			myChart.setOption(option);
    		});
    		})
    	});
    }

    // 跳转稽核待办
	$scope.goTowerAuditApproval = function() {
		// 跳转后的查询参数
		$rootScope.stateType = 'handle';
		if (!$scope.approvalAuditNum) {
			return;
		}

		// 自维
		if (!$rootScope.functionType) {
			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[2].id; // 選中效果
			$state.go('app.auditTariff', {
    			'status':'tariff/audit'
    		});
		}
		// 塔维
		else if ($rootScope.functionType == 1) {
			$rootScope.selectedMenu = $rootScope.menu[0].child[0].child[0].child[2].id; // 選中效果
			$state.go('app.towerAuditTariff', {
				'status':'towerAuditTariff/twAudit'
			});
		}
	}
}]);

/**
 * 报销发起人
 */

app.controller('reimbursementCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', 'towerAuditServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ, towerAuditServ) {
    //tab 选择
    $scope.tabs=1;
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

    $scope.userType = findUserType();

    // 自维
    if (!$rootScope.functionType) {

    	// 电费提交单待处理
    	commonServ.queryElectricityApproval().success(function(data) {
    		$scope.approvalElectricityNum = data.data || 0;
    	})

    	// 自维历史稽核单查询
    	$scope.getData=function(){
    		commonServ.getInputElectrictyList($scope.params).success(function (data) {
    			utils.loadData(data, function (data) {
    				console.log(data.data);
    				$scope.pageInfo.totalCount = data.data.totalRecord;
    				$scope.pageInfo.pageCount = data.data.totalPage;
    				$scope.params.page = data.data.pageNo;
    				$scope.list = data.data.results;
    			})
    		});
    	}

    	// 自维报销单状态图
    	commonServ.stasticSubmitStatus().success(function(data){
    		utils.loadData(data,function(data){
    		$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart1 = echarts.init(document.getElementById('container'),'walden');
    			if(!data.data || data.data.length < 1){
    				utils.msg("暂无数据！");
    				return;
    			}

    			var chartData=[];
    			var legendList=[];
    			for(var i=0; i<data.data.length; i++){
    				var item= data.data[i];
    				chartData.push({"name":item.name, "value":item.value});
    			}

    			var container = $("#container1");
    			var autoWidth;
    			var autoHeight;
    			(function resizedom () {
		            autoWidth = $("#manager").width();
    				autoHeight =$("#manager").height();
		        })();
    			container.width(autoWidth);
    			container.height(autoHeight);
    			var option1 = {
    				title : {
    					text: '报销单状态统计',
    					x:'center',
					    y: '5%',
			            textStyle: {
				            color: '#585c5e',
				            fontSize: '18'
				        }
    				},
    				tooltip : {
    					trigger: 'item',
    					formatter: "{a} <br/>{b} : {c} ({d}%)"
    				},
    				legend: {
    					orient: 'vertical',
    					left: 'left',
    					height: autoHeight,
    					width: autoWidth,
    					x: '80%',
          				y: '10%',
						right: '85%',
						data: legendList,

    				},
    				series : [{
    				        	name: '访问来源',
    				        	type: 'pie',
    				        	radius : '70%',
    					        center: ['50%', '57%'],
    				        	data:chartData,
    				        	itemStyle: {
    				        		  emphasis: {
    				        			  shadowBlur: 10,
    				        			  shadowOffsetX: 0,
    				        			  shadowColor: 'rgba(0, 0, 0, 0.5)'
    				        		  }
    				        	  }
    				          }]
    			};

    			myChart1.setOption(option1);
    		})
    		});
    	});

    	// 自维历史稽核单查询详情

	    $scope.showIndexDetail = function(item,flag,save){
	        $scope.flag = flag;   //修改显示保存和取消
	        $scope.flagSave = save;//查看时只显示确定按钮
	        $scope.editZiweiID= item.electricty.id;
	        $scope.instanceId = item.instanceId;
	        if(item.flowState <= 1) {
	            $scope.isZWauditSave = true;
	        }
	        // 列表详情
	        commonServ.getInputElectrictyById(item.businessKey).success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.singleDetail = data.data;
	                $scope.electrictyMidInvoices = data.data.electrictyMidInvoices;
                    $scope.singUploadFiles = data.data.sysFileVOs;  //附件
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
	        $scope.showIndexDetailDialog=ngDialog.open({
	            template: './tpl/auditPageDialog.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
	            width: 1200,
	            controller:'addOrUpdateAuditCtrl',
	            scope: $scope
	        });

	    }

	     // 查看详情关闭弹出框
	    $scope.closePage = function(){
	        $scope.showIndexDetailDialog.close("");
	    };
    }
    // 塔维
    else if ($rootScope.functionType == 1) {

    	// 查询塔维生成电费提交待办数
    	commonServ.queryTowerElectricityApproval().success(function(data) {
    		$scope.approvalElectricityNum = data.data || 0;
    	})

    	// 塔维历史稽核单
    	$scope.getData=function(){
    		towerAuditServ.getTowerAuditList($scope.params).success(function (data) {
    			utils.loadData(data, function (data) {
    				console.log(data.data);
    				$scope.pageInfo.totalCount = data.data.totalRecord;
    				$scope.pageInfo.pageCount = data.data.totalPage;
    				$scope.params.page = data.data.pageNo;
    				$scope.list = data.data.results;
    			})
    		});
    	}



    	// 塔维历史稽核单查询详情
    	$scope.showTWIndexDetail = function(item,flag,save){
	        $scope.flag = flag;   //修改显示保存和取消
	        $scope.flagSave = save;//查看时只显示确定按钮

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



	        /**
	         * [流转信息]
	         *
	         */
	        towerAuditServ.queryApprovalDetails(item.instanceId).success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.ApprovalDetails = data.data;
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
    	// 塔维报销单状态图
    	commonServ.towerStasticSubmitStatus().success(function(data){
    		utils.loadData(data,function(data){
    			$.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart1 = echarts.init(document.getElementById('container'),'walden');

    			if(data.data==null){
    				utils.msg("暂无数据！");
    				return;
    			}

    			var chartData=[];
    			var legendList=[];
    			for(var i=0; i<data.data.length; i++){
    				var item= data.data[i];
    				chartData.push({"name":item.name, "value":item.value});
    			}

    			var container = $("#container1");
    			var autoWidth = container.parent().parent().width();
    			var autoHeight = container.parent().parent().height()-100;
    			container.width(autoWidth);
    			container.height(autoHeight)
    			var option1 = {
    				title : {
    					text: '报销单状态统计',
    					x:'center',
					    y: '5%',
			            textStyle: {
				            color: '#585c5e',
				            fontSize: '18'
				        }
    				},
    				tooltip : {
    					trigger: 'item',
    					formatter: "{a} <br/>{b} : {c} ({d}%)"
    				},
    				legend: {
    					orient: 'vertical',
    					left: 'left',
    					x: '80%',
          				y: '10%',
						right: '85%',
						height:autoHeight,
						width:autoWidth,
    					data: legendList,
    				},
    				series : [{
    				        	name: '访问来源',
    				        	type: 'pie',
    				        	radius : '70%',
    					    	center: ['50%', '57%'],
    				        	data:chartData,
    				        	itemStyle: {
    				        		  emphasis: {
    				        			  shadowBlur: 10,
    				        			  shadowOffsetX: 0,
    				        			  shadowColor: 'rgba(0, 0, 0, 0.5)'
    				        		  }
    				        	  }
    				          }]
    			};

    			// var myChart1 = echarts.init(document.getElementById('container'));
    			myChart1.setOption(option1);
    		})
    		});
    	});
    }

    // 跳转电费提交单待办
	$scope.goTowerElectricityApproval = function() {

		if (!$scope.approvalElectricityNum) {
			return;
		}
		// 自维
		if (!$rootScope.functionType) {
			$state.go('app.inputFinance', {
    			'status':'tpl/tariffFinance.html'
    		});
		}
		// 塔维
		else if ($rootScope.functionType == 1) {
			$state.go('app.towerInputFinance', {
				'status':'towerInputFinance/SubmitFinancial'
			});
		}
	}
}]);


/**
 * 用戶管理
 */
app.controller('userMannagerCtrl', ['lsServ', '$rootScope', '$scope', '$state', '$controller','ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$controller,ngDialog, utils, commonServ) {

    $scope.dialog={};
    $rootScope.auditType=-1;
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.my_data = [];
    $scope.params = {
        pageSize: 8,//每页显示条数
        pageNo: 1,// 当前页
    };

    //查询所有信息角色
     commonServ.findAllRole().success(function (data) {
            utils.loadData(data,function (data) {
                $scope.listAllRole = data.data;
            })
        });
    

     commonServ.queryDepartment($scope.deptId).success(function (data) {
            utils.loadData(data,function (data) {
            	console.log(data.data);
            	var treeData = data.data;
            	$scope.my_data = $scope.makeTreeData(treeData);

            })
     });


      //公用关闭弹出框
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }

    //获取用戶列表
   	 $scope.getData=function(tip, departmentId){
        if(tip != 'refresh'){
                delete $scope.params.countyId;
                delete $scope.params.cityId;
                console.log($scope.userCity,$scope.userCounty);
                console.log($rootScope.userCity,$rootScope.userCounty);

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
                      city : $scope.cityId
                    })
                }
                if($scope.countyId != "" && $scope.cityId != null){
                    angular.extend($scope.params,{
                        county : $scope.countyId
                    })
                 }

                 console.log($scope.params);
                 if($scope.roleInfo != "" && $scope.roleInfo != null){
                    angular.extend($scope.params,{
                        roleIds:$scope.roleInfo.roleId
                    })
                 }
                 console.log("test==========="+$scope.roleId)
                 	angular.extend($scope.params,{
                	    account:$scope.userAccount,
                	    email:$scope.email
               		})
        }

        if(tip == 'refresh' ){
        	$scope.params = {
		        pageSize: 10,//每页显示条数
		        pageNo: 1,// 当前页
		    }
		    delete $scope.departmentId;
        }

        // if($scope.departmentId && !departmentId){
        // 	departmentId = $scope.departmentId;
        // }

        // if(departmentId || departmentId == 0){
        // 	angular.extend($scope.params,{
        // 	    departmentId:departmentId
       	// 	})
        // }

        commonServ.queryUserByPage($scope.params).success(function (data) {

            utils.loadData(data,function (data) {
                console.log(data);
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;

                $scope.list = data.data.results;
                unCheckAll('#userList');

            })
        });



    }

     $scope.makeTreeData=function(treeData){
       if(treeData && treeData.length > 0){
         for(var ind = 0; ind < treeData.length; ind++){
           if(treeData[ind] && treeData[ind].name){
             treeData[ind].label = treeData[ind].name
           }
           if(treeData[ind] &&  treeData[ind].childNum && treeData[ind].childNum > 0){
               treeData[ind].children = [{'label':""}]
           }
         }
       }
       console.log("treeDatade" + treeData)
       return treeData;
     }


    //跳转到添加用户
    $scope.goAddUserPage=function(){
        $scope.dialog.id = 'none';
        $scope.dialog.status = 'add';
        $state.go('app.userAdd',{
            status:"add",
            id:'none',
            scope:$scope
        });
    }

    $scope.goUpdateUserPage=function(item){

        $scope.dialog.id = item.userId;
        $scope.dialog.status = "update";

        console.log(item.userId);
        $scope.userDialog=ngDialog.open({
            template:'./tpl/updateUser.html',
            className: 'ngdialog-theme-default',
            width:780,
            height:1800,
            scope:$scope,
            controller:'addUserCtrl'

        })

    }

    $scope.goViewUserPage=function(item){
        $scope.dialog.id = item.userId;
        $scope.dialog.status = "view";

        console.log(item.userId);
        $scope.userDialog=ngDialog.open({
            template:'./tpl/updateUser.html',
            className: 'ngdialog-theme-default',
            width:780,
            height:1800,
            scope:$scope,
            controller:'addUserCtrl'

        })
    }

     $scope.returnBack=function(){

        $scope.closeDialog("userDialog");
        $scope.params.pageNo=1;
        $scope.getData();
     }
    $scope.backUser=function(){
        $state.go('app.user',{ });
        console.log("!!!!");
    }
    /**
     * 删除选中
     */
    $scope.deleteSelected=function(id){

        var list=[];
        if(id !=undefined && id!=''){
            console.log("id",id);

            list.push(id);
        }else{

            list= utils.getCheckedVals('#userList',false);

            if(list.length<1){
                utils.msg("请选择要删除的项目");
                return;
            }
        }


        utils.confirm('确定要删除吗？',"",function(){
            commonServ.deleteUsers(list.toString()).success(function(data){
                utils.ajaxSuccess(data,function(data){

                    $scope.params.pageNo=1;
                    $scope.getData();

                    unCheckAll('#userList')

                });
            });
        });

    }





}]);


/**
 * 添加用戶
 */
app.controller('addUserCtrl', ['lsServ', '$rootScope', '$scope','$stateParams', '$state', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope,$stateParams, $state, ngDialog, utils, commonServ) {
	$rootScope.auditType=-1;
    if($stateParams.status=='add'){
        $scope.status=$stateParams.status;
        var id=$stateParams.id;
    }else{
        console.log($scope.dialog.id);
        console.log($scope.dialog.status);
        $scope.status=$scope.dialog.status;
        var id=$scope.dialog.id;

    }

    $scope.backUser=function(){
        $state.go('app.user',{ });
        console.log("!!!!");
    }

     //查询OA系统返回信息
    $scope.queryOA=function(account){
    	if($scope.status!='add'){
    		return;
    	}
    	if(!account || !account.match("[a-zA-Z0-9_]+")){
    		return;
    	}
        commonServ.queryOA(account).success(function (data) {
            utils.loadData(data,function(data){
            	var userVo = data.data;
            	if(userVo){
            		if(userVo.email){
            			$scope.user.email = userVo.email;
            		}
            		if(userVo.mobile){
            			$scope.user.mobile = userVo.mobile;
            		}
            		if(userVo.userName){
            			$scope.user.userName = userVo.userName;
            		}
            		if(userVo.userId){
            			$scope.user.userId = userVo.userId;
            		}
            	}
            })
        });
    }

 	$scope.checkRoles=function(){

    	var roleIds=utils.getCheckedVals('#userRoles',false);

    	if(roleIds != ""){
    		$scope.rolesChecked = true;
    	}else{
    		$scope.rolesChecked = false;
    	}

    }

    //获取所有角色列表
    commonServ.getRoleList().success(function(data){
        utils.loadData(data,function(data){
            $scope.roles=data.data;
            //
            //console.log(angular.toJson($scope.roles,true));
        });
    });

    if(id!='none' && id!=''){
        commonServ.queryUserByUserId(id).success(function(data){
            utils.loadData(data,function(data){

                $scope.user=data.data;
                $scope.rolesList=$scope.user.roleIds.split(',');
                if($scope.rolesList && $scope.rolesList.length > 0){
                	$scope.rolesChecked = true;
                }
                $rootScope.queryCountyList($scope.user.city);


                setTimeout(function(){
                    console.log("countys",$rootScope.countys);
                    console.log("跟新视图");
                    $scope.user.city= $scope.user.city;
                    $scope.$apply()
                    $scope.user.county= $scope.user.county;
                },3000);

            });
        });
    }




    $scope.hasRole=function(roleId){
        return utils.iInList(roleId,$scope.rolesList);
    }



    /**
     * 保存用户
     * @param form
     * @param user
     */
    $scope.saveUser=function(form,user,word){
        console.log("user",user);
        var roleIds = utils.getCheckedVals('#userRoles',false);
        user.roleIds = roleIds;

        if(!user.roleIds || user.roleIds == '' || !user.account || !user.userName || (!user.province &&  user.userStatus!=0)  ||( !user.userStatus && user.userStatus != 0)){
        	utils.msg("请完成必填项后再提交。");
        	return;
        }
      	var regAccount = /^[a-zA-Z]{1,}[a-zA-Z0-9_\s]*$/
        var regMobile = /^[0-9_\s+]*$/
        var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

        if(user.account.match(regAccount) == null){
        	utils.msg("登陆名只能由字母、数字、下划线组成,并且以字母开头。");
        	return;
        }
        if(user.email && user.email.match(regEmail) == null){
        	utils.msg("请输入正确格式的邮箱地址。");
        	return;
        }
        if(user.mobile && user.mobile.match(regMobile) == null){
        	utils.msg("请输入正确格式的电话号码。");
        	return;
        }
        if(user.remark && user.remark.length > 70){
        	utils.msg("备注长度不能超过70个字符。");
        	return;
        }
        if(user.userName.length > 30 || user.account.length >30 ){
        	utils.msg("登陆名、姓名长度不能超过30个字符。");
        	return;
        }
        if((user.email && user.email.length > 50) || (user.mobile && user.mobile.length > 50)){
        	utils.msg("邮箱、手机号长度不能超过50个字符。");
        	return;
        }
        //  if(!user.roleIds || user.roleIds == '' || !user.account || !user.userName || (!user.province &&  user.userStatus!=0) || !user.city || !user.county ||( !user.userStatus && user.userStatus != 0) || !user.county){
        //     utils.msg("请完成必填项后再提交。");
        //     return;
        // }

        commonServ.addOrUpdateUser(user,word).success(function(data){
            utils.ajaxSuccess(data,function(data){
                 if($scope.status=='add'){
                         $state.go('app.user');
                    }else{
                        $scope.closeDialog("userDialog");
                    }
                    if( $scope.params && $scope.params.pageNo){
                    	$scope.params.pageNo=1;
                    }
                    // $scope.getData();

            // utils.alert("操作成功将返回列表？",function(){

            //     $state.go('app.user');

            })
        });

    }

}]);


/**
 * 操作日志
 */
app.controller('logCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ) {
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


    //获取日志列表
    $scope.getData=function(){
        commonServ.getlogList($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }




}]);


/**
 * 系统公告
 */
app.controller('systemNoticeCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$filter', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state, $filter, ngDialog, utils, commonServ) {
    $scope.dialog ={};
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

    //获取系统公告列表
    $scope.getData=function(){
        if($scope.startTime !='' && $scope.startTime != null){
            angular.extend($scope.params,{
                startDateStr: $filter('date')($scope.startTime,'yyyy-MM-dd'),
            });
        }else{
        	delete $scope.params.startDateStr;
        }
        if($scope.endTime !='' && $scope.endTime != null){
            angular.extend($scope.params,{
                endDateStr: $filter('date')($scope.endTime,'yyyy-MM-dd'),
            });
        }else{
        	delete $scope.params.endDateStr;
        }


       delete $scope.params.page;

       commonServ.queryNoticeByPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {

                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
                unCheckAll('#noticeList')
            })
        });
    }

    //获取未读公告
    $scope.updateNotices=function(){
        commonServ.queryNoticeNotRead().success(function(data){
            console.log(data.data);
            $rootScope.notices=[];
            if(data.data.noticeList != undefined){
                $rootScope.notices=data.data.noticeList;
            }
            if(data.data.notReadIdList != undefined){
                $rootScope.notReadIdList=data.data.notReadIdList;
                $rootScope.unreadNotice = $rootScope.notReadIdList.length;
            }
        });
    }

    //跳转到添加或修改页面
    $scope.goAddPage=function(){
       /* $state.go('app.addOrUpdateNotice',{
            'status':'add',
            'id':'none'
        });*/
        $scope.dialog.id = 'none';
        $scope.dialog.status = "add";

        $scope.noticeDialog=ngDialog.open({
            template:'tpl/addNotice.html',
            className: 'ngdialog-theme-default',
            width:780,
            height:1800,
            scope:$scope,
            controller:'addOrUpdateSystemNoticeCtrl'

        })
    }

    //跳转到修改页面
    $scope.goUpdatePage=function(item){
        $scope.dialog.id=item.noticId;
        $scope.dialog.status = "update";

        $scope.noticeDialog=ngDialog.open({
            template:'tpl/addNotice.html',
            className: 'ngdialog-theme-default',
            width:780,
            height:1800,
            scope:$scope,
            controller:'addOrUpdateSystemNoticeCtrl'

        })
    }

    $scope.showDetail=function(item){
        $scope.notice=item;

        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/showDetailDialog.html',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 600,
            scope: $scope,
        });

    }
    $scope.closeDialog=function(ngDialog){
        $scope[ngDialog].close("");
    }
    // $scope.closeDialog=function(){
    //     $scope.showDetailDialog.close("");

    // };
     //公用关闭弹出框
    $scope.closeDialog=function(dialog){
        if( $scope[dialog].close != undefined){
            $scope[dialog].close("");
        }
        if($scope.noticeDialog != null){
            $scope.noticeDialog.close("");
        }
        if($scope.showDetailDialog != null){
            $scope.showDetailDialog.close("");
        }
    }


    /**
     * 删除选中
     */
    $scope.deleteSelected=function(id){

        var list=[];
        if(id!=undefined && id!=''){
            console.log("id",id);

            list.push(id);
        }else{

            list= utils.getCheckedVals('#noticeList',true);

            if(list.length<1){
                utils.msg("请选择要删除的项目");
                return;
            }
        }

        utils.confirm('确定要删除吗？',"",function(){
            commonServ.deleteNotices(list.toString()).success(function(data){
                 console.log('success');
                utils.ajaxSuccess(data,function(data){
                     $scope.params.pageNo=1;
                     $scope.getData();
                     $scope.updateNotices();
                     unCheckAll('#noticeList')
                });
            });

        })
    }

}]);




/**
 * 添加或修改公告
 */
app.controller('addOrUpdateSystemNoticeCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', '$filter','ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, $filter,ngDialog, utils, commonServ) {


    $scope.status=$scope.dialog.status;
    $rootScope.auditType=-1;
    $scope.id=$scope.dialog.id;
    if($scope.id && $scope.id != 'none' && $scope.status != 'add'){
        commonServ.queryNoticeById($scope.id).success(function(data){
            utils.loadData(data,function(data){
                $scope.notice=data.data;
                $scope.notice.startDate = data.data.startDateStr;
                $scope.notice.endDate = data.data.endDateStr;
                console.log(" $scope.notice", $scope.notice);
            })
        });
    }else{
    	$scope.notice=null;

    }

    $scope.saveOrUpdate=function(form,notice){
        if(!notice || !notice.startDate || !notice.endDate || !notice.title || !notice.message ){
            utils.msg("请完成所有内容再提交。");
            return;
        }

        if(notice.startDate!=undefined && notice.startDate!=''){
            notice.startDateStr = $filter('date')(notice.startDate,'yyyy-MM-dd');
            delete notice.startDate;
        }
        if(notice.endDate!=undefined && notice.endDate!=''){
            notice.endDateStr = $filter('date')(notice.endDate,'yyyy-MM-dd');
            delete notice.endDate;
        }
        if(notice.startDateStr == null || notice.endDateStr == ''){
            delete notice.startDateStr;
        }
        if(notice.endDateStr == null || notice.endDateStr == ''){
            delete notice.endDateStr;
        }
        console.log("notice",notice);
        commonServ.addOrUpdateNotice(notice).success(function(data){

            utils.ajaxSuccess(data,function(data){
                console.log('success');
                $scope.params.pageNo=1;
                $scope.getData();
                unCheckAll('#list');
                $scope.closeDialog('noticeDialog');

                $scope.updateNotices();
            });
            delete $scope.notice;
        });

    }

}]);



/**
 * 系统角色
 */
app.controller('rolesCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ) {

    $scope.showTap='self';
    $rootScope.auditType=-1;
    //添加角色时获取角色信息
    commonServ.getResourceList().success(function(data){
        utils.loadData(data,function(data){
            $scope.resources= data.data;
            console.log(data.data);

        });
    });

    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.params = {
        pageSize: 8,//每页显示条数
        pageNo: 1,// 当前页
    };

    $scope.returnBack=function(){

        $scope.closeDialog("roleDialog");
        $scope.params.pageNo=1;
        $scope.getData();
     }

    $scope.backRole=function(status){
        $state.go('app.role',{ });
    }


    //获取系统角色
    $scope.getData=function(){
    	angular.extend($scope.params,{
            "roleName":$scope.roleName,
        })
        commonServ.getRoleListByPager($scope.params).success(function (data) {
            utils.loadData(data,function (data) {

                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
                unCheckAll('#userList');
            })
        });
    }

     //跳转到添加角色
    $scope.goAddrolesPage=function(){

        $state.go('app.rolesAdd',{
            status:"addRoles",
            id:'none'
        });
    }

    $scope.resourceIds=[];

   $scope.addRoleDialog=function(item,status){
        $scope.role={}
        $scope.status = status;

        if(item!=undefined){
            $scope.role=item;
            $scope.resourceIds= $scope.role.resourceIdList;
        }else{
            $scope.resourceIds=[];//新增的时候 重置 resourceIds，避免资源初始状态被选中
        }

        $scope.roleDialog=ngDialog.open({
            template: './tpl/roleManagerDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 650,
            scope: $scope,
        });
    }

    $scope.checkMe=function(x){

        var flag=false;

        for(var  i=0; i<$scope.resourceIds.length; i++){
            if(x==$scope.resourceIds[i]){
                flag=true;
                break;
            }
        }

        console.log(flag);
        return flag;
    }

    $scope.closeDialog=function(ngDialog){
        $scope[ngDialog].close("");
    }
    $scope.addOrUpdate=function(){
        if(!$scope.role ||!$scope.role.roleName || $scope.role.roleName == '' || (!$scope.role.isSystem && $scope.role.isSystem != 0) ){
        	utils.msg("请完成必填项后再提交。");
        	return;
        }
        if($scope.role.roleName.length > 30){
        	utils.msg("角色名称长度不能超过30个字符。");
        	return;
        }
        if($scope.role.description && $scope.role.description.length > 30){
        	utils.msg("角色描述长度不能超过30个字符。");
        	return;
        }
        if(!$scope.role.roleLevel && $scope.role.roleLevel!=0){
            utils.msg("请选择角色等级。");
            return;
        }

 		delete  $scope.role.resourceIdList;
        delete  $scope.role.updateDate;
        console.log($scope.role.resourceIds);

        var listStr = utils.getCheckedVals('#roleTapContent1',false);
        var list2Str = utils.getCheckedVals('#roleTapContent2',false);

        if(!listStr){
        	listStr = "";
        }
        if(list2Str && list2Str != ""){
        	if(listStr == ""){
        		listStr = list2Str;
        	}else{
        		listStr = listStr + "," + list2Str;
        	}
        }

        $scope.role.resourceIds= listStr;
        angular.extend($scope.role,{
            "resourceIds":listStr
        })


        console.log("roleObject",angular.toJson($scope.role,true));



        commonServ.saveOrUpdateRole($scope.role).success(function(data){

            utils.ajaxSuccess(data,function(data){
                 if($scope.roleDialog != null){
                    $scope.closeDialog("roleDialog");
                    $scope.getData();
                 }else{
                    $state.go('app.role',{
                    });
                    $scope.getData();
                 }
            });
        });


    }



    /**
     * 删除选中
     */
    $scope.deleteSelected=function(id){

        var list=[];
        if(id!=undefined && id!=''){
            console.log("id",id);

            list.push(id);
        }else{

            list= utils.getCheckedVals('#list',true);

            if(list.length<1){
                utils.msg("请选择要删除的项目");
                return;
            }
        }


        console.log("list",list);

        utils.confirm('确定要删除吗？',"",function(){

            commonServ.deleteRoles(list.toString()).success(function(data){



                utils.ajaxSuccess(data,function(data){

                    $scope.params.pageNo=1;
                    $scope.getData();
                    unCheckAll('#list')

                });
            });
        });

    }



}]);


/**
 * 基础数据呈现
 */
app.controller('baseDataCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ) {
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
    $scope.getData=function(a){

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
         
		
        angular.extend($scope.params,{

            "siteName":$scope.siteName,
            "meterCode":$scope.meterCode,//noone
        })
        
        console.log($scope.params);
        
        commonServ.getBaseDataByPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    //导出excel
    $scope.downDataExcel=function(){
    	
    	var URL=commonServ.getBaseDataByPageExcel();
    	alert("数据加载中,请耐心等待,勿重复点击!!");
    	var form=$("<form>");
    	form.attr("style","display:none");
    	form.attr("target","");
    	form.attr("method","post");
    	form.attr("action",URL);
    	
    	var input=$("<input>");
    	input.attr("type","hidden");
    	input.attr("name","cityId");
    	if($scope.cityId != "" && $scope.cityId != null){
        	input.attr("value",$scope.cityId);
        }
    	form.append(input);
    	
    	var input1=$("<input>");
    	input1.attr("type","hidden");
    	input1.attr("name","countyId");
        if($scope.countyId != "" && $scope.cityId != null){
        	input1.attr("value",$scope.countyId);
         }
        form.append(input1);
        
        var input2=$("<input>");
    	input2.attr("type","hidden");
    	input2.attr("name","siteName");
    	input2.attr("value",$scope.siteName);
    	form.append(input2);
    	
    	var input3=$("<input>");
    	input3.attr("type","hidden");
    	input3.attr("name","meterCode");
    	input3.attr("value",$scope.meterCode);
    	form.append(input3);
         
    	$("body").append(form);
    	form.submit();
     
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
       $scope.basicinfo=function (num) {
          $('.basic-details .list table').hide();
          if(num==1){
              $('.basic-details .list .Reimbursement').show();
          }else if(num==2){
              $('.basic-details .list .contract').show();
          }else if(num==3){
              $('.basic-details .list .Supplier').show();
          }else if(num==4){
              $('.basic-details .list .Power').show();
          }else if(num==5){
              $('.basic-details .list .Table').show();
          }else if(num==6){
              $('.basic-details .list .Computer').show();
          }else if(num==7){
              $('.basic-details .list .other').show();
          }else if(num==8){
              $('.basic-details .list .eqRoom').show();
          }else if(num==9){
              $('.basic-details .list .rePoint').show();
          }


      }

    //查看详情
    $scope.showDetail=function(item){
        commonServ.getBaseDataByDetails(item.id).success(function (data) {

            utils.loadData(data,function (data) {
                console.log(data,"----------------------------");
                $scope.object = data.data;
                console.log("object",angular.toJson($scope.object,true));

            })
        });



        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/basicViewDetails.html?time='+new Date().getTime(),
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
 * 额定功率标杆
 */
app.controller('ratedMarkCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
    $scope.list=[];

    $rootScope.countys={};

    //获取列表
    $scope.getData=function(a){
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
        angular.extend($scope.params,{
        	siteName : $scope.siteName
        })

         console.log($scope.params);

        commonServ.queryPowerRatingPage($scope.params).success(function (data) {


            //TODO 等待后端修改数据格式
            $scope.list = data.data;


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
        // TODO 待后端接口修改返回 ＩＤ
        commonServ.queryPowerRatingDetail(item.siteId).success(function(data){

            utils.loadData(data,function(data){

                    $scope.subList=data.data; //
                    $scope.allPowerRating = 0;
                    if(data.data!=null && data.data.length>0){
                    	for(var i=0;i<data.data.length;i++){
                    		$scope.allPowerRating += data.data[i].powerRating *data.data[i].number;
                    	}
                    	$scope.allPowerRating = $scope.allPowerRating.toFixed(2);
                    }
            })
        });



        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/benchMarkDialog.html?time='+new Date().getTime(),
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
 * 智能电表标杆
 */
app.controller('smartBenchmarkCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
    $scope.list=[];

    $rootScope.countys={};

    //获取列表
    $scope.getData=function(a){
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
        angular.extend($scope.params,{
        	siteName : $scope.siteName
        })
         console.log($scope.params);
        commonServ.querySmartMeterPage($scope.params).success(function (data) {
            //TODO 等待后端修改数据格式
            $scope.list = data.data;
            utils.loadData(data,function (data) {
            	if(data.msg){
            	}
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;

            })
        });
    }

    //查看详情
    $scope.showDetail=function(item){

        //TODO 待后端接口修改返回　ＩＤ
        commonServ.queryPowerRatingDetail(item.id).success(function(){

            utils.loadData(data,function(data){

                    $scope.subList=[] //
            })
        });



        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/benchMarkDialog.html?time='+new Date().getTime(),
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
 * 开关电源标杆
 */
app.controller('SMPSBenchmarkCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
    $scope.list=[];

    $rootScope.countys={};

    //获取列表
    $scope.getData=function(a){
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
        angular.extend($scope.params,{
        	siteName : $scope.siteName
        })

        console.log($scope.params);

        commonServ.querySwitchPowerPage($scope.params).success(function (data) {


            //TODO 等待后端修改数据格式
            $scope.list = data.data;


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

        //TODO 待后端接口修改返回　ＩＤ
        commonServ.queryPowerRatingDetail(item.id).success(function(){

            utils.loadData(data,function(data){

                    $scope.subList=[] //
            })
        });



        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/benchMarkDialog.html?time='+new Date().getTime(),
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
 * 维护数据修改管理
 */
app.controller('mainTainDataCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

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
    //获取列表,现在不需要从此处查询转供电数据
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
            "mobileType":"0",//塔维识别符
        })

        commonServ.dataModifyApply($scope.params).success(function (data) {
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
    	commonServ.approvalDataModify({"instanceId":instanceId,approveState:approveState}).success(function(data) {
    		 utils.ajaxSuccess(data,function(data){

                $scope.params.pageNo=1;
                $scope.getData();
            })
    	})
    }

    // 查看维护数据详情(要修改的数据)

    $scope.showDetail= function(item) {

        	commonServ.queryDetailDialog(item.aataModifyApply.id).success(function (data) {

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
 * 其他信息管理
 */
app.controller('otherManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
    $scope.getData=function(a){
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
            "accountName":$("#accountName").val(),
        })

        commonServ.queryOtherInfoPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }

    /* $scope.other={
    		"id":"",
            "siteName":"",
            "oldFinanceName":"",
            "cycle":""

        }
    $scope.showDetail=function(item){
        if(item!=undefined){
            $scope.other=item;
        }else{
            $scope.other={
            	 "id":"",
        		 "siteName":"",
                 "oldFinanceName":"",
                 "cycle":""

            }
        }
    }*/
    //修改其他信息
    $scope.showDetail=function(item){
    	$scope.other={
    			"id":item.id,
        		"siteName":item.siteName,
                "oldFinanceName":item.oldFinanceName,
                "cycle":item.cycle

            }
        $scope.addDialog=ngDialog.open({
            template: './tpl/otherManagerEdit.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }




    // 保存其他信息
    $scope.addOrUpdate=function(){
        commonServ.saveOrUpdateOther($scope.other).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.closeDialog('addDialog')
                $scope.params.pageNo=1;
                $scope.getData();
            })
        });

    }

    //关闭查看详情
    $scope.closeDialog=function(ngDialog){
    	$scope[ngDialog].close("");

    };

}]);



/**
 * 报账点管理
 */
app.controller('reimburMangerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
    $scope.getData=function(a){
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
        	"payTypee":$rootScope.payTypee,
        	"professional":$scope.professional,
            "siteName":  $scope.siteName,
            "accountName":$scope.accountName,
            "accountAlias":$scope.accountAlias,
            "oldFinanceName":$scope.oldFinanceName,
            "resourceName":$scope.resourceName
        })



        commonServ.queryPageAccountSitePage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {

                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }





    //查看详情
    $scope.querySiteInfo=function(item){
        $scope.siteInfo = item;
        $scope.status = 'view';
        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/modifySite.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

    }

     //修改站点信息
    $scope.modifySiteInfo=function(item){
        $scope.siteInfo = utils.deepCopy(item);
        if($scope.siteInfo.islock==null ||$scope.siteInfo.islock==""){
        	$scope.siteInfo.islock=0;
        }
        $scope.status = 'update';
        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/modifySite.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

    }
    
    //修改报账点状态
    $scope.modifyChangeIslock=function(){
    		var islock=$("[name='islock']").val();
    		$scope.siteInfo.islock=islock;
    }
    
    //选择缴费类型
    $scope.modifyChangePayTyp=function(payType){
    	if(payType==-1){
    		$scope.siteInfo.payTypee=null;
    		$scope.siteInfo.professional="";
    	}else{
    		$scope.siteInfo.payTypee=payType;
    		if(payType>1){
    			$scope.siteInfo.professional="全业务";
    		}else{
    			$scope.siteInfo.professional="无线";
    		}
    	}
    }

    //保存修改详情
    $scope.updateSite=function(){
        var siteInfo = $scope.siteInfo;
        if(!siteInfo || !siteInfo.accountName || !siteInfo.accountAlias || !siteInfo.siteName || !siteInfo.oldFinanceName){
            utils.msg("请完成所有内容再提交。");
        }
        commonServ.updateSiteInfo($scope.siteInfo).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.closeDialog('showDetailDialog')
                $scope.params.pageNo=1;
                $scope.getData();
            })
        });
    }



    //关闭查看详情
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");

    };

}]);


/**
 * 发票信息管理
 */
app.controller('invoiceManageCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
    //TODO 发票信息管理
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
        angular.extend($scope.params,{
        	billType : $scope.billType,
        	createDateStr : $scope.createDateStr
        })

         console.log($scope.params)
        commonServ.queryInvoicePage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }



    //添加修改弹出框
    $scope.invoice={
        "billTax":"",
        "billType":"",
        "billCoefficient":""
    }
    // 新增发票信息
    $scope.showAddDialog=function(item){
        if(item!=undefined){
            $scope.invoice=utils.deepCopy(item);
            $scope.invoice.billTax=item.billTax;

        }else{
            $scope.invoice={
                "billTax":"",
                "billType":"",
                "billCoefficient":""

            }
        }


        $scope.addDialog=ngDialog.open({
            template: './tpl/invoiceManagerDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 600,
            scope: $scope,
        });
    }

    // 保存发票-----------------------------------todo 修复接口地址  去掉接口上的invoice
    $scope.addOrUpdate=function(){
        if($scope.invoice){
            var invoice = $scope.invoice;
        }
        if($scope.invoice){
        	var invoice = $scope.invoice;
        	if(invoice.billTax && (isNaN(parseFloat(invoice.billTax)) || invoice.billTax.indexOf('%')>=0 || parseFloat(invoice.billTax) < 0 || parseFloat(invoice.billTax) > 100)){
        		utils.msg("请输入0~100的数值");
        		return;
        	}
        }
        commonServ.saveOrUpdateInvoice($scope.invoice).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.closeDialog('addDialog')
                $scope.params.pageNo=1;
                $scope.getData();
            })
        });

    }






    //关闭查看详情
    $scope.closeDialog=function(ngDialog){

        $scope[ngDialog].close("");
        $scope.getData();
    };


    /**
     * 删除选中 或批量
     */
    $scope.deleteSelected=function(id){

        var list=[];
        if(id!=undefined && id!=''){
            console.log("id",id);

            list.push(id);
        }else{

            list= utils.getCheckedVals('#list',true);

            if(list.length<1){
                utils.msg("请选择要删除的项目");
                return;
            }
        }


        console.log("list",list);

        utils.confirm('确定要删除吗？',"",function(){

            commonServ.deleteInvoice(list.toString()).success(function(data){

                utils.ajaxSuccess(data,function(data){

                    $scope.params.pageNo=1;
                    $scope.getData();
                    unCheckAll('#list')

                });
            });
        });

    }






}]);


/**
 * 电表信息管理
 */
app.controller('meterInfoCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
    $scope.getData=function(a){
    	if(a){
     		 $scope.params = {
		        pageSize: 15,//每页显示条数
		        pageNo: 1,// 当前页
     		 };
     	}

        //cityId	城市(非必须，查询条件)
        //countyId	区(非必须，查询条件)
        //id	电表编号 (非必须，查询条件)
        //accountName	报账点名称(非必须，查询条件)
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
         console.log($scope.params)

        angular.extend($scope.params,{
            "code":$scope.code,
            "accountName":$scope.accountName

        });



        commonServ.queryWatthourMeterPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }
    //导出excel
    $scope.getDataExcel = function(){
    	var URL=commonServ.queryWatthourMeterPageExcel();
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


    //TODO 获取报账点信息

    commonServ.querySiteInfoPage({
        pageSize:10000,
        pageNo:1
    }).success(function(data){
        utils.loadData(data,function(data){

            $scope.accountSiteDataSource=data.data.results;
        });
    });


    //修改电表信息
    $scope.addOrUpdateDialog=function(item){
    	$scope.watthour=utils.deepCopy(item);
    	if(item.damageMeterNum != null && item.damageMeterNum != ""){
    		$scope.watthour.damageMeterNum = item.damageMeterNum; //旧表：电表号
    		$scope.watthour.mark=true;	//显示该信息 旧表：电表号
		}
        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/electricityEdit.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 700,
            scope: $scope,
        });
    }

    $scope.saveOrUpdate=function(){
        commonServ.saveOrUpdateWatthourMeter($scope.watthour).success(function(data){
            utils.ajaxSuccess(data,function(daa){

                $scope.closeDialog('showDetailDialog');

                $scope.getData();
            })
        });

    }

    //关闭查看详情
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");

    };

    // 换表-显示弹出框

    $scope.showChangeDialog=function(item){
        $scope.oldObject=item;

        $scope.newObject={

        		//旧表信息
        		"electricLoss":"",		//电损(度)
        		"damageInnerNum":"",	//损坏期间电量(度)
        		"damageNum":"",			//损坏读数
        		"damageDateStr":"", 	//损坏日期


        		//新表信息
    			"accountSiteId":item.accountSiteId,		//报账点id
    			"paymentAccountCode":"",				//电表户号	-并 非id
    			"damageMeterNum":item.id,				//坏表号
    			"code":"",
    			"ptype":"",
    			"status":"",
    			"rate":"",
    			"currentReadingStr":"",					//item.currentReadingStr
    			"reimbursementDateStr":"",				//item.reimbursementDateStr
    			"belongAccount":""
    	}

        $scope.changeDialog=ngDialog.open({
            template: './tpl/changeTable.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1200,
            scope: $scope,
        });


    };
    //换表-保存信息
    $scope.saveNewMeter=function(){
    	var check = $scope.newObject;
    	if( !check|| !check.damageNum || !check.damageDate || !check.damageInnerNum
    		|| !check.status || !check.belongAccount || !check.currentReadingStr || !check.reimbursementDateStr)
    	{
    		utils.msg("带'*'为必填项");
    	 	return;
    	}



    	 commonServ.saveOrUpdateMeter($scope.newObject).success(function(data){
             utils.ajaxSuccess(data,function(data){
                 $scope.closeDialog('changeDialog')
                 $scope.params.pageNo=1;
                 $scope.getData();
             })
         });
    }
    
    /*$scope.downPowerExcelGo=function(){
		event.preventDefault();
        var BB = self.Blob;
        var contentStr = document.getElementById("downPowertb").innerHTML;   //内容
        var fileNmae='电表信息.xls';
        saveAs(
          new BB(
              ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
            , { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
        ) , fileNmae);
	}*/

}]);




/**
 * 供电信息管理
 */
app.controller('supplierPowerManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
    $scope.getData=function(a){
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
        if($scope.electricityType != "" && $scope.electricityType != null){
            angular.extend($scope.params,{
            	electricityType : $scope.electricityType
            })
         }
        angular.extend($scope.params,{
            electricityType:$scope.electricityType,
            accountName:$scope.accountName

        });
        console.log($scope.params)
        commonServ.queryPageAccountSitePSU($scope.params).success(function (data) {
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

        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/modifySuplyPower.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

    }

    //修改信息--弹出框
    $scope.modifySupplierPower=function(item){
        if(item!=undefined){
            $scope.supplyPower = utils.deepCopy(item);

        }else{
            $scope.supplyPower={
                "electricityType":"",
            	"shareType":"",
            	"supplyCompany":"",
            	"payType":"",
            	"id":item.id,
            	"accountName":item.accountName
            }
        }
        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/modifySuplyPower.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }

    // 保存供电信息
    $scope.updateSupplyPower=function(){
        commonServ.updatesupplyPower($scope.supplyPower).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.closeDialog('showDetailDialog')
                $scope.params.pageNo=1;
                $scope.getData();
            })
        });
    }

    //关闭查看详情
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }

}]);
/*****************************************自维转供电开始*****************************************************************/

/**
 * 转供电审批管理
 */
app.controller('transApproManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
                "onlyId": item.needTrans.onlyId,
                "resultStatus": item.needTrans.resultStatus,
                "submitStatus": item.needTrans.submitStatus,
                "contractId": item.needTrans.contractId,
                "supplierIds": item.needTrans.supplierIds,
                "supplierNames": item.needTrans.supplierNames,
                "addapoUserName": item.needTrans.addapoUserName, //这里的名字，是谁提交就显示谁 
                "trusteesId": item.trusteesId,
                "remark": item.needTrans.remark,
                "siteEleType": item.needTrans.siteEleType,
                "roomEleType": item.needTrans.roomEleType,
                "siteName": item.needTrans.siteName,
                "siteId": item.needTrans.siteId,
                "roomId": item.needTrans.roomId,
                "createDate": $scope.dataChange(item.needTrans.createDate),
                "properType": item.properType,
                "roomName": item.needTrans.roomName,
                "accountName": item.needTrans.accountName,
                "cityId": item.needTrans.cityId,
                "countyId": item.needTrans.countyId,
                "cityName": item.needTrans.cityName,
                "countyName": item.needTrans.countyName,
                "attachmentId":item.needTrans.attachmentId,
                "transEleFiles":item.needTrans.transEleFiles

               
        }
         /**
         * [流转信息]
         *
         */
        commonServ.getTransFlowDetails(item.instanceId).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.ApprovalZWDetails = data.data;
            })
        });

        // $scope.instanceId = item.instanceId;
        $scope.showTransEleDlog=ngDialog.open({
            template: './tpl/transEleShowDetail.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'updateTransEletricityCtrl',
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
            properType : $scope.properType,
            status : $scope.status,
            "mobileType" : "0",//自维标识符
            siteName : $scope.siteName

        });
         console.log($scope.params)
         //获取从流程中查到的真实数据
         commonServ.transGetFlowData($scope.params).success(function (data) {
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
        commonServ.transApprovalDataModify({"instanceId":instanceId,approveState:approveState}).success(function(data) {
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
            commonServ.bachSubmitTransEleForJson(flows).success(function(data){
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
app.controller('transEletricityManagerCtrl', ['$window','lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function ($window,lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
                "siteId":item.siteId,//站点id
                "siteName":item.siteName,//站点名字
                "roomName":item.roomName,//机房名字
                "roomId":item.roomId,//机房id
                "supplierNames":item.supplierNames,//供应商名字
                "createDate":item.createDate,//创建时间
                "properType":item.properType,//产权类型
                "remark":item.remark,//备注
                "onlyId":item.onlyId,//待转供电表中唯一识别符
                "instanceId":item.instanceId,//流程id
                "mobileType":"0"//自维标识符

            }
            //用站点id作为流程id提交进去
         commonServ.submitToFlow($scope.transPower).success(function(data){
            //跳转刷新
             utils.ajaxSuccess(data,function(data){

                 $rootScope.selectedMenu = $rootScope.menu[1].child[3].id; // 選中效果
                 $state.go('app.transEletricityInfo',{
                     'status':'transEletricity/info'
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


            commonServ.cancelTransSite($scope.canceData).success(function(data){
                       //跳转刷新
             utils.ajaxSuccess(data,function(data){
                // $state.reload('app.transEletricityManagerCtrl');
                // $scope.reloadRoute();
                 // $rootScope.selectedMenu = $rootScope.menu[1].child[3].id; // 選中效果
                 $state.go('app.transEletricityInfo',{
                     'status':'transEletricity/info'
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
            commonServ.deleteTransDatas(list).success(function(data){
                utils.ajaxSuccess(data,function(data){
                     $state.go('app.transEletricityInfo',{
                             'status':'transEletricity/info'
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
            "properType":$scope.properType,
            "resultStatus":$scope.resultStatus,
            "mobileType" : "0",//自维标识符
            "siteName" : $scope.siteName//有可能是机房名字

        });

        var URL=commonServ.queryTransDatasPageExcel();
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
                "siteName": item.siteName,
                "siteId": item.siteId,
                "roomId": item.roomId,
                "createDate": $scope.dataChange(item.createDate),
                "properType": item.properType,
                "roomName": item.roomName,
                "accountName": item.accountName,
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
        commonServ.getTransFlowDetails(item.instanceId).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.ApprovalZWDetails = data.data;
            })
        });

        // $scope.instanceId = item.instanceId;
        $scope.showTransEleDlog=ngDialog.open({
            template: './tpl/transEleShowDetail.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom account-electric',
            width: 1200,
            controller:'updateTransEletricityCtrl',
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
            "properType":$scope.properType,
            "resultStatus":$scope.resultStatus,
            "mobileType" : "0",//自维标识符
            "siteName" : $scope.siteName//有可能是机房名字

        });

        console.log($scope.params)
         //获取从SYS_ZGROOM_TRANS_MID查到的真实数据
         commonServ.getNeedSubmitData($scope.params).success(function (data) {
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
		 $state.go('app.addTransEletricity',{
	            'status':'transEle/add'
	        });
    }
    
}]);

/**
 *转供电---修改和查看数据控制器
 */
app.controller('updateTransEletricityCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
 

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
            template: './tpl/transSupplyDialog.html?time='+new Date().getTime(),
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
        commonServ.findSupplyByPage($scope.params).success(function (data) {
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
            url:base_url+'/fileOperator/fileUploadTrans.do',
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
            var showUrl = base_url+'/fileOperator/fileDownLoadTrans.do?fileID='+item.id;
            $scope.showUrls = showUrl;
            $scope.uploadFileDialog=ngDialog.open({
                template: './tpl/uploadTrans.html?time='+new Date().getTime(),
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                width: 750,
                scope: $scope,
            });
        }else{
            /*var showUrl = base_url+'/fileOperator/fileDownLoad.do?fileID='+item.id+"&download="+"down";*/
             var URL= base_url+'/fileOperator/fileDownLoadTrans.do?fileID='+item.id+"&download="+"down";
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
             var URL= base_url+'/fileOperator/fileDownLoadTrans.do?fileID='+item.id+"&download="+"down";
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
                "siteName": $scope.transData.siteName,
                "siteId": $scope.transData.siteId,
                "roomId": $scope.transData.roomId,
                "createDate": $scope.dataChange($scope.transData.createDate),
                "properType": $scope.transData.properType,
                "roomName": $scope.transData.roomName,
                "accountName": $scope.transData.accountName,
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
           
       
      

            commonServ.saveTransInfo($scope.transData).success(function(data){
                utils.ajaxSuccess(data,function(data){
                     $scope.closePage();
                     $rootScope.selectedMenu = $rootScope.menu[1].child[3].id;  // 選中效果
                     $state.go('app.transEletricityInfo',{
                                'status':'transEletricity/info'
                         },{reload:true});
                });
            });
        }



   

}]);
/**
 * 转供电---新增页面控制器
 */
app.controller('addTransEletricityCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
  //             cityId : $rootScope.userCityId	//若城市有值，则将对应的城市ID传入cityId
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
            siteName:$scope.siteName
        });

        commonServ.findNeedTransList($scope.params).success(function (data) {
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
    
    //批量新增转供电数据模态框导入页面
 
    $scope.allLoad = function() {
    	console.log(1123)
//    	commonServ.delWrong().success(function(data){
//    		$rootScope.wronginfo="";
//    	});
        $scope.tabUpload=1;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/transEleAddAll.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            height:200,
            scope: $scope,
        });
    };
    //下载批量导入装供电excel 模板
    $scope.downDownDemo = function() {

    	var URL=commonServ.downLoadURI();

    	var form=$("<form>");
		form.attr("style","display:none");
		form.attr("target","");
		form.attr("method","post");
		form.attr("action",URL);
		var input=$("<input>");
		input.attr("type","hidden");
		input.attr("name","fileName");
		input.attr("value","批量新增转供电导入模板");
		$("body").append(form);
		form.append(input);
		form.submit();

    };

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
                    "accountName":item.accountName,
                    "cityId":item.cityId,
                    "cityName":item.cityName,
                    "countyId":item.countyId,
                    "countyName":item.countyName,
                    "siteEleType":item.siteEleType,
                    "onlyId":item.onlyId,//唯一id 站点机房中间表id
                    "roomId":item.roomId,
                    "roomEleType":item.roomEleType,
                    "properType":item.properType,
                    "siteId":item.siteId,
                    "siteName":item.siteName,
                    "submitStatus":item.submitStatus,
                    "roomName":item.roomName
             }

             commonServ.addNeedChangeSiteToNext($scope.needChangeData).success(function(data){
                //跳转刷新
                 utils.ajaxSuccess(data,function(data){
                         // $rootScope.selectedMenu = $rootScope.menu[1].child[3].id; // 選中效果
                         $state.go('app.transEletricityInfo',{
                             'status':'transEletricity/info'
                         },{reload:true});
                 });
            });
     
            
        });

    }
    
    
      //提交单个转供电站点到流程,资源站点的initid
  /*  $scope.submitTransAlone=function(item){
        utils.confirm('确定要提交吗？',"",function(){
            $scope.transPower = {
                "electricityType":item.electricityType,
                "siteId":item.id,
                "properType":item.properType,

                // "supplyCompany":"",
                // "payType":"",
                // "id":item.id,
                "siteName":item.siteName
            }
    	 commonServ.saveTransEleAdd($scope.transPower).success(function(data){
             utils.ajaxSuccess(data,function(data){
                 $rootScope.selectedMenu = $rootScope.menu[1].child[3].id; // 選中效果
                 $state.go('app.transEletricityInfo',{
                     'status':'transEletricity/info'
                 });
             });
         });
        	
        });
    };*/
}]);











/*****************************************自维转供电结束*****************************************************************/












/**
 * 供应商信息管理
 */
app.controller('supplierManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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
    $scope.getData=function(a){
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
            // cityId:$scope.cityId,	//市id
            // countyId:$scope.countyId,	//区县id

            name:$scope.name,
            organizationCode:$scope.organizationCode

        });




        commonServ.findSupplyByPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {

                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }
    
    //导出excel
    $scope.getDataExcel = function(){
    	var URL=commonServ.findSupplyByPageExcel();
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
		input2.attr("name","name");
		input2.attr("value",$scope.name);
		form.append(input2);
        
		var input3=$("<input>");
		input3.attr("type","hidden");
		input3.attr("name","organizationCode");
		input3.attr("value",$scope.organizationCode);
		form.append(input3);
		
		$("body").append(form);
		form.submit();
    }

    //查看详情
    $scope.showDetail=function(item){

        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/otherManagerEdit.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

    }
    
    
    
  //供应商查看详情
    $scope.showSupplyDetail=function(id){
    	 commonServ.findSupplyById(id).success(function (data) {
             utils.loadData(data,function (data) {
                 $scope.listL = data.data;
             })
         });

        $scope.showSupplyDetailDialog=ngDialog.open({
            template: './tpl/supplyManagerDetail.html?time='+new Date().getTime(),
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
 * 基础信息合同管理
 */
app.controller('contractInfoCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams','$filter','ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams,$filter, ngDialog, utils, commonServ) {
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

    // 获取列表--合同
    $scope.getData=function(a){
    	if(a){
      		 $scope.params = {
      			        pageSize: 15,//每页显示条数
      			        pageNo: 1,// 当前页
      		 };
      	}
        delete $scope.params.countyId;
        delete $scope.params.cityId;
		
		if($scope.userCity != "" && $scope.userCity != null){			
            angular.extend($scope.params,{
              cityId : $rootScope.userCityId	//若城市有值，则将对应的城市ID传入cityId
			
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
            id : $scope.id,
            name : $scope.name,
			accountName : $scope.accountName
        })
		
         console.log($scope.params);



        commonServ.queryContractPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }
    //获取excel
    $scope.getDetailExcel = function(){
    	var URL=commonServ.queryContractPageExcel();
    	alert("数据加载中,请耐心等待,勿重复点击!!");
    	var form=$("<form>");
		form.attr("style","display:none");
		form.attr("target","");
		form.attr("method","post");
		form.attr("action",URL);
		if($scope.userCity != "" && $scope.userCity != null){	
			var input=$("<input>");
			input.attr("type","hidden");
			input.attr("name","cityId");
			input.attr("value",$rootScope.userCityId);//若城市有值，则将对应的城市ID传入cityId
			if($scope.cityId != "" && $scope.cityId != null){
				input.attr("value",$scope.cityId);
	        }
			form.append(input);
           
        }
        if($scope.userCounty != "" && $scope.userCounty != null){
        	var input1=$("<input>");
			input1.attr("type","hidden");
			input1.attr("name","countyId");
			input1.attr("value",$rootScope.userCountyId);//若区县有值，则将对应的区县ID赋给countyId 
			if($scope.countyId != "" && $scope.cityId != null){
				input1.attr("value",$scope.countyId);
	         }
			form.append(input1);
           
         }
		 
		$("body").append(form);
		form.submit();
    }


    // 查看详情--合同
    $scope.showContractDetail=function(item){

    	$scope.contract=item;
    	$scope.contract.isClud=(item.isClude==0)?"包干":"不包干";

    	/*commonServ.showContractInfo(item.id).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.contract = data.data;

            })
        });*/

        $scope.openContractDetail=ngDialog.open({
            template: './tpl/contractEdit.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }

    //修改信息--合同
    $scope.modifyContractInfo=function(item){

        if(item!=undefined){
            $scope.editContract=utils.deepCopy(item);
            $scope.editContract.startDate= $filter('date')(item.startDate,'yyyy-MM-dd');
            $scope.editContract.endDate= $filter('date')(item.endDate,'yyyy-MM-dd');

        }else{
            $scope.editContract={
                "accountName":"",
            	"oldFinanceName":"",
            	"id":"",
            	"name":"",
            	"startDate":"",
            	"endDate":"",
            	"isClud":"",
            	"unitPrice":""

            }
        }
    }

    //查看详情
    $scope.showDetail=function(item){

        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/modifyContractInfo.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });
    }

    // 保存合同信息
    $scope.updateContractInfo=function(){

        commonServ.updateContractInfo($scope.editContract).success(function(data){
            utils.ajaxSuccess(data,function(data){
                $scope.closeDialog('showDetailDialog')
                $scope.params.pageNo=1;
                $scope.getData();
            })
        });
    }

    //关闭查看详情
    $scope.closeDialog=function(dialog){
        $scope[dialog].close("");
    }
    
    /*$scope.downContractExcelGo=function(){
		event.preventDefault();
        var BB = self.Blob;
        var contentStr = document.getElementById("contracttb").innerHTML;   //内容
        var fileNmae='合同.xls';
        saveAs(
          new BB(
              ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
            , { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
        ) , fileNmae);
	}*/

}]);




/**
 * 白名单审批管理
 */
app.controller('whiteMgCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams','$filter','ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams,$filter, ngDialog, utils, commonServ) {
	$rootScope.szydBeginTime11="";
	$rootScope.bz="";
	//每次进入页面查找当前市还剩余多少白名单
	  commonServ.findwhitesitenum().success(function(data){
		   $scope.shengyu=data.data;
		   $scope.shengyucity=$rootScope.userCity;
	   });
	
	$scope.status="";
	$scope.szydNo="";
	$scope.cperson="";
	$scope.submitTime="";
	$scope.showaddflag=true;
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
	    $scope.getData=function(a){
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
	        	status:$rootScope.spstatus,	//站点名
	            szydNo:$scope.szydNo,	//三重一大编号
	            submitTime:$scope.submitTime,
	            cperson:$scope.cperson,

	        });

	        commonServ.findWhiteSubmitByPage($scope.params).success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.pageInfo.totalCount = data.data.totalRecord;
	                $scope.pageInfo.pageCount = data.data.totalPage;
	                $scope.params.page = data.data.pageNo;
	                $scope.list = data.data.results;
	                if($scope.list[0].isdo==null || $scope.list[0].isdo==0){
	                	$scope.showaddflag=true;
	                }else{
	                	utils.msg("该地市白名单比例超标");
	                	$scope.showaddflag=false;
	                }
                    unCheckAll('#List');

	                
	            })
	        });
	    };
	    
	    $scope.changespstatus=function(){
	    	$rootScope.spstatus=$("[name='spstatus']").val();
	    };
	    //查看whiteSubmitMg
	    $scope.showWhiteSubmitDetail=function(item){
	    	commonServ.getWhiteSubmitInfo(item.id).success(function(data){
	    		$scope.siteInfo=data.data;
	    		$scope.fjslist=data.data.fjs;
	    		$rootScope.bz=data.data.bz;
	    	});
	    	$scope.showDetailDialog=ngDialog.open({
	            template: './tpl/white/whiteInfo.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:300,
	            scope: $scope,
	        });
	    };
	    
	    
	  //showSiteDetail(item)查看站点详情
	    $scope.showSiteDetail=function(item){
	    	commonServ.getSiteInfo1(item.id).success(function(data){
	    		$scope.siteInfo1=data.data;
	    	});
	    	$scope.showDetailDialog1=ngDialog.open({
	            template: './tpl/white/whiteSiteInfo.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:300,
	            scope: $scope,
	        });
	    };
	    
	    //删除whiteSubmit
	    $scope.delWhiteSubmit=function(item){
	    	commonServ.delWhiteSubmit(item.id).success(function(data){
	    		if(data.data=="删除成功"){
	    			utils.msg("删除成功");
	    			commonServ.findWhiteSubmitByPage($scope.params).success(function (data) {
			            utils.loadData(data,function (data) {
			                $scope.pageInfo.totalCount = data.data.totalRecord;
			                $scope.pageInfo.pageCount = data.data.totalPage;
			                $scope.params.page = data.data.pageNo;
			                $scope.list = data.data.results;
			            })
			        });
	    			
	    		}else{
	    			utils.msg("删除失败");
	    		}
	    	});
	    };
	    
	    //删除附件
	    
	    $scope.delfj=function(){
	    	debugger
    		var szydno=$("#szydno11").val();
    		var fjid=$("[name='fjselect']").val();
    		$rootScope.szydBeginTime11=$("[name='szydBeginTime']").val();
    		 $rootScope.bz=$("#bz").val();
	    	if(confirm("确认删除该附件吗")){
	    		$scope.jfparams={
	    				szydno:szydno,
	    				fjid:fjid,
	    		}
	    		commonServ.delfj($scope.jfparams).success(function(data){
	    			if(data.data=="删除失败"){
	    				utils.msg("附件删除失败");
	    			}else{
	    				utils.msg("附件删除成功");
	    				$scope.fjslist=data.data;
	    				$scope.showDetailDialog.close("");
	    				$scope.showDetailDialog=ngDialog.open({
	    		            template: './tpl/white/whiteInfo2.html?time='+new Date().getTime(),
	    		            className: 'ngdialog-theme-default ngdialog-theme-custom',
	    		            width: 750,
	    		            height:300,
	    		            scope: $scope,
	    		        });
	    			}
	    		});
	    	}
	    };
	    //确认驳回
	    $scope.sureBoH=function(){
	    	$scope.remark=$("#Bremark").val();
//	    	alert($scope.remark);
    		
    		$scope.itemid=$rootScope.boHitem.id;
	    	$scope.itemsubmitstatus=$rootScope.boHitem.status;
	    	$scope.itemflag=$rootScope.boHflag;
	    	$scope.submitParams={
	    		id:$scope.itemid,
	    		submitStatus:$scope.itemsubmitstatus,
	    		flag:$scope.itemflag,
	    		remark:$scope.remark,
	    	};
	    	commonServ.updateWhiteSubmit($scope.submitParams).success(function(data){
	    		utils.msg(data.data);
	    		 commonServ.findWhiteSubmitByPage($scope.params).success(function (data) {
	 	            utils.loadData(data,function (data) {
	 	                $scope.pageInfo.totalCount = data.data.totalRecord;
	 	                $scope.pageInfo.pageCount = data.data.totalPage;
	 	                $scope.params.page = data.data.pageNo;
	 	                $scope.list = data.data.results;
	 	               $scope.remarkDialog.close("");
	 	            })
	 	        });
	    	});
	    	
	    	
	    	
	    	
	    };
	    
	    
	    
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
	            if ($.inArray(info.id, ids) > -1) {
	                if (info.status==0||info.status==4) {
	                    utils.msg("请选择需要审的记录！");
	                    return;
	                }
	                flows.push({"id" : info.id, "dostatus": adopt,"status":info.status});
	            }
	        }

	        utils.confirm('确定要进行批量审批？',"",function(){
	            commonServ.bachUpStatus(flows).success(function(data){
	                utils.ajaxSuccess(data,function(data){
	                	$scope.getData(true);
	                    unCheckAll('#list')
	                });
	            });
	        });
	    }
	    
	    
	    
	    
	    
	    //修改状态（提交\通过审批\驳回）
	    $scope.updateWhiteSubmit=function(item,flag){
	    	if(flag=='-1'){
	    		$rootScope.boHitem=item;
	    		$rootScope.boHflag=flag;
	    		$scope.remarkDialog=ngDialog.open({
		            template: './tpl/white/remark.html?time='+new Date().getTime(),
		            className: 'ngdialog-theme-default ngdialog-theme-custom',
		            width: 750,
		            height:300,
		            scope: $scope,
		        });

	    	}else{
	    		$scope.itemid=item.id;
		    	$scope.itemsubmitstatus=item.status;
		    	$scope.itemflag=flag;
		    	$scope.submitParams={
		    		id:$scope.itemid,
		    		submitStatus:$scope.itemsubmitstatus,
		    		flag:$scope.itemflag,
		    	};
		    	commonServ.updateWhiteSubmit($scope.submitParams).success(function(data){
		    		utils.msg(data.data);
		    		 commonServ.findWhiteSubmitByPage($scope.params).success(function (data) {
		 	            utils.loadData(data,function (data) {
		 	                $scope.pageInfo.totalCount = data.data.totalRecord;
		 	                $scope.pageInfo.pageCount = data.data.totalPage;
		 	                $scope.params.page = data.data.pageNo;
		 	                $scope.list = data.data.results;
		 	            })
		 	        });
		    	});
	    	}
	    };
	   /* //修改whiteSubmitMg
	    $scope.modifyWhiteSubmit=function(item){
	    	$rootScope.item11=item;
	    	$rootScope.itemMgId=item.id;
	    	commonServ.getWhiteSubmitInfo(item.id).success(function(data){
	    		$scope.siteInfo=data.data;
	    		$scope.fjslist=data.data.fjs;
	    		$rootScope.itemMg=data.data;
	    	});
	    	
	    	$scope.showDetailDialog=ngDialog.open({
	            template: './tpl/white/whiteInfo2.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:300,
	            scope: $scope,
	        });
	    };*/
	    
	    
	    
	    //修改whiteSubmitMg
	    $scope.modifyWhiteSubmit=function(item,flag){
	    	if(flag==0){
	    		$rootScope.item11=item;
		    	$rootScope.itemMgId=item.id;
		    	commonServ.getWhiteSubmitInfo(item.id).success(function(data){
		    		$scope.siteInfo=data.data;
		    		$rootScope.list11=$scope.siteInfo.whiteSubmitLists;
		    		$scope.fjslist=data.data.fjs;
		    		$rootScope.itemMg=data.data;
		    			$rootScope.szydBeginTime11=data.data.szydBeginTime;
		    			$rootScope.bz=data.data.bz;
		    		
		    	});
	    	}else{
	    		$rootScope.item11=item;
		    	$rootScope.itemMgId=item.id;
		    	commonServ.getWhiteSubmitInfo(item.id).success(function(data){
		    		$scope.siteInfo=data.data;
		    		$rootScope.list11=$scope.siteInfo.whiteSubmitLists;
		    		$scope.fjslist=data.data.fjs;
		    		$rootScope.itemMg=data.data;
		    		
		    		if($rootScope.szydBeginTime11!=null && $rootScope.szydBeginTime11!=""){
		    			$rootScope.szydBeginTime11=$rootScope.szydBeginTime11;
		    			$rootScope.bz=$rootScope.bz;
		    		}else{
		    			$rootScope.szydBeginTime11=data.data.szydBeginTime;
		    			$rootScope.bz=data.data.bz;
		    		}
		    		
		    	});
	    	}
	    
	    	
	    	$scope.showDetailDialog=ngDialog.open({
	            template: './tpl/white/whiteInfo2.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:300,
	            scope: $scope,
	        });
	    };
	    
	    
	    
	 //修改页面下的 导入页面
	    $scope.goupload = function() {
	        $scope.tabUpload=1;
	        $scope.uploadFileDialog=ngDialog.open({
	            template: './tpl/white/goupload.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:200,
	            scope: $scope,
	        });
	    };
	    
	    
	    //修改页面删除一条白名单站点信息
	    $scope.delWhiteMgByid1=function(item){
	    	if($rootScope.list11.length==1){
	    		utils.msg("不能删除，至少有一条数据");
	    		return;
	    	}
	    	
	    	$rootScope.szydBeginTime11=$("[name='szydBeginTime']").val();
	    	$rootScope.bz=$("#bz").val();
	    	commonServ.delWhiteMgByid1(item.id).success(function(data){
	    		if(data.data=="删除成功"){
	    			utils.msg("删除成功");
	    			$scope.updateSubmitMgStatusParams={
	    	    			id:$rootScope.item11.id,
	    	    			status:"0",
	    	    	}
	    	    	commonServ.updateSubmitMgStatus($scope.updateSubmitMgStatusParams).success(function(data){
	    	    		commonServ.findWhiteSubmitByPage($scope.params).success(function (data) {
	    		            utils.loadData(data,function (data) {
	    		                $scope.pageInfo.totalCount = data.data.totalRecord;
	    		                $scope.pageInfo.pageCount = data.data.totalPage;
	    		                $scope.params.page = data.data.pageNo;
	    		                $scope.list = data.data.results;
	    		                $rootScope.list11=data.data.results;
	    		            })
	    		        });
	    	    	});
	    			
	    			
	    			$scope.showDetailDialog.close("");
	    			$scope.modifyWhiteSubmit($rootScope.item11,1);
	    		
	    		}else{
	    			utils.msg("删除失败");
	    		}
	    	});
	    };
	    
	  //修改下载白名单数据excel 模板
	    $scope.downDownDemo = function() {

	    	var URL=commonServ.downLoadURI();

	    	var form=$("<form>");
			form.attr("style","display:none");
			form.attr("target","");
			form.attr("method","post");
			form.attr("action",URL);
			var input=$("<input>");
			input.attr("type","hidden");
			input.attr("name","fileName");
			input.attr("value","白名单导入模板");
			$("body").append(form);
			form.append(input);
			form.submit();

	    };
	    
	    
	 // 继续上传框
	    $scope.upload = function() {
	        $scope.tabUpload=1;
	        $scope.uploadFileDialog=ngDialog.open({
	            template: './tpl/upload2.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:200,
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
	       if(!/\.(xlsx|xls|XLSX|XLS)$/.test(ext)){
	           utils.msg("请上传excel格式");
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
	           utils.msg("请上传excel文件");
	           return;
	       }
	       var base_url = CONFIG.BASE_URL;
	       var formData = new FormData($( "#uploadForm" )[0]);
	       $.ajax({
	           url:base_url+'/fileOperator/fileUploadexcel1.do',
	           type: 'POST',
	           data: formData,
	           async: false,
	           cache: false,
	           contentType: false,
	           processData: false,
	           success: function(data) {
	               if (data.code==200) {
	            	 //查找导入信息
	            	   commonServ.findwrong().success(function(data){
	            		   $rootScope.wronginfo=data.data;
	            	   });
	            	   var szydBeginTime="";
	            	   $rootScope.szydBeginTime11=$("[name='szydBeginTime']").val();
	            	   if($rootScope.szydBeginTime11!=null ||$rootScope.szydBeginTime11!=""){
	            		 var  szydBeginTime=$rootScope.szydBeginTime11;
	            	   }else{
	            		 var  szydBeginTime= $rootScope.itemMg.whiteSubmitLists[0].szydBeginTime;
	            	   }
	            	   
	            	   
	            	   $rootScope.bz=$("#bz").val();
	            	   $scope.saveparams = {
	            		        userName: $rootScope.itemMg.whiteSubmitLists[0].cperson,// 录入名
	            		        szydNo:$rootScope.itemMg.whiteSubmitLists[0].szydNo,
	            		        szydBeginTime :szydBeginTime,
	            		        status:"0",
	            		        mgId:$rootScope.itemMgId,
	            		    };
	            	    //保存
	            	    	commonServ.saveWhiteMgSubmit1($scope.saveparams).success(function(data){
	            	    		commonServ.deleteWhiteMg().success(function(){
	            	    			$scope.showDetailDialog.close("");
	            	    			/*$scope.uploadFileDialog.close("");*/
	            	    			$scope.modifyWhiteSubmit($rootScope.item11,1);
	            	    		})
	            	    	})
	            	   
	                   layer.alert(data.message, {
	                       icon:1,
	                       time:2000,
	                       btn:[],
	                   });
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
	    
	   /* //保存修改（审批）
	    $scope.saveWhiteMgSubmit11=function(status){
	    	$scope.updateSubmitMgStatusParams={
	    			id:$rootScope.item11.id,
	    			status:status,
	    	}
	    	commonServ.updateSubmitMgStatus($scope.updateSubmitMgStatusParams).success(function(data){
	    		alert(data.data);
	    		commonServ.findWhiteSubmitByPage($scope.params).success(function (data) {
		            utils.loadData(data,function (data) {
		                $scope.pageInfo.totalCount = data.data.totalRecord;
		                $scope.pageInfo.pageCount = data.data.totalPage;
		                $scope.params.page = data.data.pageNo;
		                $scope.list = data.data.results;
		            })
		        });
	    	});
	    };*/
	    
	    
	    
	    
	  //保存修改（暂存修改）
	    $scope.saveWhiteMgSubmit11=function(status){
	    	var szydBeginTime=$("[name='szydBeginTime']").val();
	    	var bz=$("#bz").val();
	    	if($scope.fjslist==null ||$scope.fjslist==""){
	    		utils.msg("请上传附件");
	    		return;
	    	}
	    	if($rootScope.list11==null ||$rootScope.list11==""){
	    		utils.msg("请上传白名单站点");
	    		return;
	    	}
	    	if(szydBeginTime==null||szydBeginTime==""){
	    		utils.msg("请填写会议时间");
	    		return;
	    	}
	    	$scope.updateSubmitMgStatusParams={
	    			id:$rootScope.item11.id,
	    			status:status,
	    			szydBeginTime:szydBeginTime,
	    			bz:bz,
	    	}
	    	commonServ.updateSubmitMgStatus($scope.updateSubmitMgStatusParams).success(function(data){
//	    		alert(data.data);
	    		commonServ.findWhiteSubmitByPage($scope.params).success(function (data) {
		            utils.loadData(data,function (data) {
		                $scope.pageInfo.totalCount = data.data.totalRecord;
		                $scope.pageInfo.pageCount = data.data.totalPage;
		                $scope.params.page = data.data.pageNo;
		                $scope.list = data.data.results;
		            })
		        });
	    	});
	    };
	    
	    
	    //关闭弹窗
	    $scope.closewindow=function(){
	    	$scope.showDetailDialog.close("");
	    };
	    //关闭弹窗
	    $scope.closewindow1=function(){
	    	$scope.remarkDialog.close("");
	    };
	    
	
	//跳转到新增白名单页面
	$scope.goAdd=function(){
		
		 $state.go('app.addWhite',{
	            'status':'white/add'
	        });
	}
	
	
	
	//添加附件
	// 附件1
    $scope.fj1 = function() {
        $scope.tabUpload=1;
        $scope.jfszydno=$("#szydno11").val();
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/fjx.html?time='+new Date().getTime(),
            width: 400,
            scope: $scope,
        });
    };
    
    $scope.files = [];
    // 上传
   
   $scope.change1 = function(ele){
       $scope.files = ele.files;
       $scope.fileName = $scope.files[0].name;
       var extStart=$scope.fileName.lastIndexOf(".");
       var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
       if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|doc|DOC|pdf|PDF|pptx|PPTX|xlsx|xls|XLSX|XLS)$/.test(ext)){
           utils.msg("请上传图片或office或pdf文件");
           return;
       }else {
           var objUrl = $scope.getObjectURL($scope.files);
           $(".preview-box").attr("src",objUrl);
           $scope.$apply();
       }

   }
   
 
   $scope.uploadFiles = [];    //已上传的文件
   // 上传发送
   $scope.uploadType1 = function(){
	   $rootScope.szydBeginTime11=$("[name='szydBeginTime']").val();
	   $rootScope.bz=$("#bz").val();
       if($scope.files.length == 0 || $scope.files == null){
           utils.msg("请上传图片或office或pdf文件");
           return;
       }
       var base_url = CONFIG.BASE_URL;
       var formData = new FormData($( "#uploadForm" )[0]);
       $.ajax({
           url:base_url+'/fileOperator/fileUploadagain.do',
           type: 'POST',
           data: formData,
           async: false,
           cache: false,
           contentType: false,
           processData: false,
           success: function(data) {
               if (data.code==200) {
            	   //重新查找附件
            	   var szydnoagain=$("#szydno11").val();
            	   commonServ.findfjagain(szydnoagain).success(function(data){
            		   $scope.fjslist=data.data;
            	   });
            		$scope.showDetailDialog.close("");
    				$scope.showDetailDialog=ngDialog.open({
    		            template: './tpl/white/whiteInfo2.html?time='+new Date().getTime(),
    		            className: 'ngdialog-theme-default ngdialog-theme-custom',
    		            width: 750,
    		            height:300,
    		            scope: $scope,
    		        });
            	   
            	   $rootScope.fjflag1=true;
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
                   $scope.uploadFilesDetails1 = {
                       "id":"",
                       "upName":"",
                   }
                   $scope.uploadFilesDetails1.id = key;
                   $scope.uploadFilesDetails1.upName = data.data[key];
                   // $scope.resultData.attachmentId.push(key);
                   // $scope.fileNameImg = data.data[key];
                   $rootScope.fjnames.push(data.data[key])
               }
               $scope.uploadFiles.push($scope.uploadFilesDetails1);
           }
       });
   }
	
	
	
	
	
	
	
	
}]);














/**
 * 白名单数据管理
 */
app.controller('whiteDataMgCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams','$filter','ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams,$filter, ngDialog, utils, commonServ) {
   
	$scope.siteName="";
	$scope.szydNo="";
	 $scope.setflag=false;
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
	    $scope.getData=function(a){
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
	        	siteName:$scope.siteName,	//站点名
	            szydNo:$scope.szydNo,	//三重一大编号
	        });

	        commonServ.findWhiteDataSubmitByPage($scope.params).success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.pageInfo.totalCount = data.data.totalRecord;
	                $scope.pageInfo.pageCount = data.data.totalPage;
	                $scope.params.page = data.data.pageNo;
	                $scope.list = data.data.results;
	            })
	        });
	    };
	    
	    
	    
	    //查看白名单数据详情
	    $scope.showWhiteSubmitDetai=function(item){
	    	$scope.tab=1;
	    	commonServ.getWhiteFlow(item.id).success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.whiteFlow=data.data;
	            })
	        });
	    	commonServ.getSzydFj(item.szydNo).success(function (data) {
	            utils.loadData(data,function (data) {
	            	$scope.szydFjs=data.data;
	            })
	        });
	        commonServ.getSiteInfo1(item.id).success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.siteInfo1 = data.data;
	                $scope.dataEndTime=item.endTime;
	            })
	        });
	    	
	    	$scope.showDetailDialog=ngDialog.open({
	            template: './tpl/white/whiteSubmitDialog.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:300,
	            scope: $scope,
	        });
	    };
	    
	    
	    //下载附件
	    $scope.downFj=function(){
	    	if(confirm("下载附件")){
	    		var obj=$.parseJSON($("#szydFj").val());
		    	$scope.showDetailDialog.close("");
		       var URL= commonServ.downFj(obj);
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
	    		
	    };
	    
	    
	    
	    //白名单配置
	    $scope.whiteSet=function(){
	        commonServ.getWhiteSet().success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.cityWhiteNum = data.data;
	            })
	        });	    	
	    	
	    	$scope.whiteSetDialog=ngDialog.open({
	            template: './tpl/white/whiteSet.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:300,
	            scope: $scope,
	        });	    	
	    }
	    
	    //比例变更
	    $scope.changeBi=function(){
	    	$scope.bili=ngDialog.open({
	            template: './tpl/white/bili.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:300,
	            scope: $scope,
	        });	   
	    };
	    
	    
	    $scope.sureChangeBi=function(){
	    	debugger;
	    	var cityId=$("#citycity").val();
	    	if($scope.setflag==true){
	    		var bili=$("#setbilinum").val();
	    	}else{
	    		var bili=$("#bilibili").val();
	    	}
	    	
	    	$scope.para={
	    			cityId:cityId,
	    			bili:bili,
	    	}
	    	
	    	commonServ.surechangebili($scope.para).success(function (data) {
	            utils.loadData(data,function (data) {
	            	$scope.bili.close("");
	            	$scope.setflag=false;
	            })
	        });	 
	    	
	    };
	    
	    
	    
	    //导出页
	    $scope.daochu=function(){
	    	
	    	 commonServ.getSubmitAll().success(function (data) {
		            utils.loadData(data,function (data) {
		            	$scope.excel=data.data;
		            })
		        });	
	    	
	    	$scope.downexcel=ngDialog.open({
	            template: './tpl/white/downExcel.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:300,
	            scope: $scope,
	        });	  
	    };
	    
	    
	    $scope.downExcelGo=function(){
			
			event.preventDefault();
	        var BB = self.Blob;
	        var contentStr = document.getElementById("exportable11").innerHTML;   //内容
	        var fileNmae='白名单.xls';
	        saveAs(
	          new BB(
	              ["\ufeff" + contentStr] //\ufeff防止utf8 bom防止中文乱码
	            , { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" }
	        ) , fileNmae);
			
		}
	    
	    
	    $scope.cb=function(){
	    	$scope.zbis="";
	    	var cityId=$("#citycity").val();
	    	commonServ.getZbi(cityId).success(function (data) {
	            utils.loadData(data,function (data) {
	            	debugger
	            	$scope.zbis=new Array();
	                $scope.zbi=data.data;
	                var tt=100-parseInt(data.data);
	                for(var i=Math.floor(tt/10*2);i>0;i--){
	                	$scope.zbis[i]=(21-i)*5;
	                }
	            })
	        });	    	
	    };
	    
	    
	    
	    
	    $scope.getWhiteCountyNum=function(cityName){
	    	commonServ.getWhiteCountyNum1(cityName).success(function (data) {
	            utils.loadData(data,function (data) {
	            	if(data.data=="无"){
	            		utils.msg("该地市无数据");
	            	}else{
	            		 $scope.countyWhiteNum = data.data;
	 	                if( $scope.countyWhiteNum[0].info!=null ||$scope.countyWhiteNum[0].info!=""){
	 	                	utils.msg($scope.countyWhiteNum[0].info);
	 	                }
	            	}
	            })
	        });	    	
	    	
	    	$scope.whiteSetDialog1=ngDialog.open({
	            template: './tpl/white/whiteSet1.html?time='+new Date().getTime(),
	            className: 'ngdialog-theme-default ngdialog-theme-custom',
	            width: 750,
	            height:300,
	            scope: $scope,
	        });	    	
	    	
	    }
	    
	    //删除出库
	    $scope.delWhiteSubmitWhiteMg=function(item){
	    	if(confirm("确认删除吗")){
	    		$scope.uppprams={
	    				status:3,
	    				id:item.mgid,
	    		}
	    		commonServ.updatemgsubmitstatus($scope.uppprams).success(function(){
	    			$scope.getData(true);
	    		});
	    	}
	    };
	    
	    $scope.changebili=function(){
	    	var ttt=$("#bilibili").find("option:selected").text();
	    	if(ttt=="其他"){
	    		$scope.setflag=true;
	    	}
	    };
	    
	    
	    
}]);














/**
 * 新增白名单管理
 */
app.controller('addWhiteMgCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams','$filter','ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams,$filter, ngDialog, utils, commonServ) {
   $scope.username=$rootScope.loginUser.userName;
   $scope.szydNo="";
   $scope.szydBeginTime="";
   $scope.bz="";
   $rootScope.list1==null;
   $rootScope.fjnames=new Array();
   //每次进入页面删除用户与上传文件 的中间表
   commonServ.delCpMid().success(function(){
   });
   
   //每次进入页面清空white表
   commonServ.delwhite().success(function(){
   });
   
   //每次进入页面查找当前市还剩余多少白名单
   commonServ.findwhitesitenum().success(function(data){
	   $scope.shengyu=data.data;
	   $scope.shengyucity=$rootScope.userCity;
   });
   $scope.flag=true;
   $scope.findszyd=function(){
	   var oldszydno=$("[name='szydNo']").val();
	   commonServ.findSzyd(oldszydno).success(function(data){
		   
		   if(data.data!=null){
				 $scope.szydBeginTime=data.data.szydBeginTime;
				 if($scope.szydBeginTime!=null && $scope.szydBeginTime!=''){
					 $scope.timeflag=true;
				 }else{
					 $scope.timeflag=false;
				 }
				 $scope.fjlist=data.data.fjs;
				 alert($scope.fjlist[0].filename)
				 $scope.flag=false;
			 }else{
				 $scope.szydBeginTime="";
				 $scope.fjlist="";
				 $scope.flag=true;
				 $scope.timeflag=false;
			 }
	   })};
   
   
   
/*   	//  查找该市是否有三重一大重要会议 
	 commonServ.findSzyd().success(function(data){
		 if(data.data!=null){
			 $scope.szydNo=data.data.szydNo;
			 $scope.szydBeginTime=data.data.szydBeginTime;
			 if($scope.szydBeginTime!=null && $scope.szydBeginTime!=''){
				 $scope.timeflag=true;
			 }else{
				 $scope.timeflag=false;
			 }
			 $scope.fjlist=data.data.fjs;
			 alert($scope.fjlist[0].filename)
			 $scope.flag=false;
		 }else{
			 $scope.flag=true;
		 }
	 })*/
	 
	 
	/* $scope.findSzyd=function(){
		 
	 };*/
	 
	 
	$rootScope.fjflag1=false;
	 $rootScope.fjflag2=false;
	 $rootScope.fjflag3=false;
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
	    //获取列表
	    $scope.getData=function(a){
	    	if(a){
	     		 $scope.params = {
	     			        pageSize: 15,//每页显示条数
	     			        pageNo: 1,// 当前页
	     		 };
	     	}
	         console.log($scope.params);
	        commonServ.findWhiteMgByPage($scope.params).success(function (data) {
	            utils.loadData(data,function (data) {
	                $scope.pageInfo.totalCount = data.data.totalRecord;
	                $scope.pageInfo.pageCount = data.data.totalPage;
	                $scope.params.page = data.data.pageNo;
	                $scope.list = data.data.results;
	                $rootScope.listData=data.data.results;
	            })
	        });
	    }
	
	
	// 导入页面
    $scope.goupload = function() {
    	
    	commonServ.delWrong().success(function(data){
    		$rootScope.wronginfo="";
    	});
        $scope.tabUpload=1;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/goupload.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            height:200,
            scope: $scope,
        });
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
    
    //showSiteDetail(item)查看站点详情
    $scope.showSiteDetail=function(item){
    	commonServ.getSiteInfo(item.id).success(function(data){
    		$scope.siteInfo=data.data;
    	});
    	$scope.showDetailDialog=ngDialog.open({
            template: './tpl/white/whiteSiteInfo2.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            height:300,
            scope: $scope,
        });
    };
    
    //删除一条白名单站点信息
    $scope.delWhiteMgByid=function(item){
    	commonServ.delWhiteMgByid(item.id).success(function(data){
    		if(data.data=="删除成功"){
    			utils.msg("删除成功");
    			$rootScope.list1=null;
    			 commonServ.findWhiteMgByPage($scope.params).success(function (data) {
        	            utils.loadData(data,function (data) {
        	                $scope.pageInfo.totalCount = data.data.totalRecord;
        	                $scope.pageInfo.pageCount = data.data.totalPage;
        	                $scope.params.page = data.data.pageNo;
        	                $scope.list = data.data.results;
        	            })
        	        });
    		}else{
    			utils.msg("删除失败");
    		}
    	});
    };
    
    
    //保存入whitesubmit表参数
    $scope.saveparams = {
	        userName: $scope.username,// 录入名
	    };
    $scope.szydNoFun=function(){
    	$scope.szydNo=$("[name='szydNo']").val();
    	angular.extend($scope.saveparams,{
            szydNo : $scope.szydNo
          })
    };
    
    
    $scope.szydBeginTimeFun=function(){
    	$scope.szydBeginTime=$("[name='szydBeginTime']").val();
    	angular.extend($scope.saveparams,{
    		szydBeginTime : $scope.szydBeginTime
          })
    };
    
    //保存
    $scope.saveWhiteMgSubmit=function(status){
    	$scope.bz=$("#bz").val();
    	angular.extend($scope.saveparams,{
            bz : $scope.bz
          })
    	if($rootScope.list1==null){
    		utils.msg("请导入站点");
    		return;
    	}
    	$scope.szydNo=$("[name='szydNo']").val();
    	if($scope.szydNo==null || $scope.szydNo=="" ){
    			utils.msg("请输入三重一大编号");
    			return;
    	}else{
    		angular.extend($scope.saveparams,{
                szydNo : $scope.szydNo
              })
    	}
    	$scope.szydBeginTime=$("[name='szydBeginTime']").val();
    	if($scope.szydBeginTime==null || $scope.szydBeginTime==""){
    		utils.msg("请输入会议时间");
    		return;
    	}else{
    		angular.extend($scope.saveparams,{
        		szydBeginTime : $scope.szydBeginTime
              })
    	}
    	if($scope.uploadFiles.length==0){
    		utils.msg("请上传附件");
    		return;
    	}
    	$scope.status=status;
    	angular.extend($scope.saveparams,{
    		status :  $scope.status
          })
    	commonServ.saveWhiteMgSubmit($scope.saveparams).success(function(data){
    		commonServ.deleteWhiteMg().success(function(){
    		});
    		$state.go("app.whiteCheck");
    	})
    };
    
 // 附件1
    $scope.fj1 = function() {
        $scope.tabUpload=1;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/fj1.html?time='+new Date().getTime(),
            width: 400,
            scope: $scope,
        });
    };
    
 // 附件2
    $scope.fj2 = function() {
        $scope.tabUpload=1;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/fj2.html?time='+new Date().getTime(),
            width: 400,
            scope: $scope,
        });
    };
    
 // 附件3
    $scope.fj3 = function() {
        $scope.tabUpload=1;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/fj3.html?time='+new Date().getTime(),
            width: 400,
            scope: $scope,
        });
    };
    
    
  //下载自维基础数据excel 模板
    $scope.downDownDemo = function() {

    	var URL=commonServ.downLoadURI();

    	var form=$("<form>");
		form.attr("style","display:none");
		form.attr("target","");
		form.attr("method","post");
		form.attr("action",URL);
		var input=$("<input>");
		input.attr("type","hidden");
		input.attr("name","fileName");
		input.attr("value","白名单导入模板");
		$("body").append(form);
		form.append(input);
		form.submit();

    };
    
    
	// 继续上传框
    $scope.upload = function() {
        $scope.tabUpload=1;
        $scope.uploadFileDialog=ngDialog.open({
            template: './tpl/upload2.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 750,
            height:200,
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
       if(!/\.(xlsx|xls|XLSX|XLS)$/.test(ext)){
           utils.msg("请上传excel格式");
           return;
       }else {
           var objUrl = $scope.getObjectURL($scope.files);
           $(".preview-box").attr("src",objUrl);
           $scope.$apply();
       }

   }
   
   $scope.change1 = function(ele){
       $scope.files = ele.files;
       $scope.fileName = $scope.files[0].name;
       var extStart=$scope.fileName.lastIndexOf(".");
       var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
       if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|doc|DOC|pdf|PDF|pptx|PPTX|xlsx|xls|XLSX|XLS)$/.test(ext)){
           utils.msg("请上传图片或office或pdf文件");
           return;
       }else {
           var objUrl = $scope.getObjectURL($scope.files);
           $(".preview-box").attr("src",objUrl);
           $scope.$apply();
       }

   }
   
   $scope.change2 = function(ele){
       $scope.files = ele.files;
       $scope.fileName = $scope.files[0].name;
       var extStart=$scope.fileName.lastIndexOf(".");
       var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
       if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|doc|DOC|pdf|PDF|pptx|PPTX|xlsx|xls|XLSX|XLS)$/.test(ext)){
           utils.msg("请上传图片或office或pdf文件");
           return;
       }else {
           var objUrl = $scope.getObjectURL($scope.files);
           $(".preview-box").attr("src",objUrl);
           $scope.$apply();
       }

   }
   
   
   $scope.change3 = function(ele){
       $scope.files = ele.files;
       $scope.fileName = $scope.files[0].name;
       var extStart=$scope.fileName.lastIndexOf(".");
       var ext=$scope.fileName.substring(extStart,$scope.fileName.length).toUpperCase();
       if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|doc|DOC|pdf|PDF|pptx|PPTX|xlsx|xls|XLSX|XLS)$/.test(ext)){
           utils.msg("请上传图片或office或pdf文件");
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
           utils.msg("请上传excel文件");
           return;
       }
       var base_url = CONFIG.BASE_URL;
       var formData = new FormData($( "#uploadForm" )[0]);
       $.ajax({
           url:base_url+'/fileOperator/fileUploadexcel.do',
           type: 'POST',
           data: formData,
           async: false,
           cache: false,
           contentType: false,
           processData: false,
           success: function(data) {
               if (data.code==200) {
            	   //查找导入信息
            	   commonServ.findwrong().success(function(data){
            		   $rootScope.wronginfo=data.data;
            	   });
            	   commonServ.findWhiteMgByPage($scope.params).success(function (data) {
       	            utils.loadData(data,function (data) {
       	                $scope.pageInfo.totalCount = data.data.totalRecord;
       	                $scope.pageInfo.pageCount = data.data.totalPage;
       	                $scope.params.page = data.data.pageNo;
       	                $scope.list=data.data.results;
       	                $rootScope.list1 = data.data.results;
       	            })
       	        });
                   /*layer.alert(data.message, {
                       icon:1,
                       time:2000,
                       btn:[],
                   });*/
                   // 上傳成功后清空数据
                   $scope.files = [];
               }
               for(var key in data.data){
                   $scope.uploadFilesDetails = {
                       "id":"",
                       "upName":"",
                   }
//                   alert(data.data[key])
                   $scope.uploadFilesDetails.id = key;
                   $scope.uploadFilesDetails.upName = data.data[key];
                  /* $scope.resultData.attachmentId.push(key);*/
                   $scope.fileNameImg = data.data[key];
               }
               $scope.uploadFiles.push($scope.uploadFilesDetails);
           }
       });
   }
   
   
   $scope.uploadType1 = function(){
       if($scope.files.length == 0 || $scope.files == null){
           utils.msg("请上传图片或office或pdf文件");
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
            	   $rootScope.fjflag1=true;
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
                   $scope.uploadFilesDetails1 = {
                       "id":"",
                       "upName":"",
                   }
                   $scope.uploadFilesDetails1.id = key;
                   $scope.uploadFilesDetails1.upName = data.data[key];
                   // $scope.resultData.attachmentId.push(key);
                   // $scope.fileNameImg = data.data[key];
                   $rootScope.fjnames.push(data.data[key])
               }
               $scope.uploadFiles.push($scope.uploadFilesDetails1);
           }
       });
   }
   
   $scope.uploadType2 = function(){
       if($scope.files.length == 0 || $scope.files == null){
           utils.msg("请上传图片或office或pdf文件");
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
            	   $rootScope.fjflag2=true;
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
                   $scope.uploadFilesDetails2 = {
                       "id":"",
                       "upName":"",
                   }
                   $scope.uploadFilesDetails2.id = key;
                   $scope.uploadFilesDetails2.upName = data.data[key];
                   // $scope.resultData.attachmentId.push(key);
                   // $scope.fileNameImg = data.data[key];
                   $rootScope.fjnames.push(data.data[key])
               }
               $scope.uploadFiles.push($scope.uploadFilesDetails2);
           }
       });
   }  
   
   $scope.uploadType3 = function(){
       if($scope.files.length == 0 || $scope.files == null){
           utils.msg("请上传图片或office或pdf文件");
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
            	   $rootScope.fjflag3=true;
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
                   $scope.uploadFilesDetails3 = {
                       "id":"",
                       "upName":"",
                   }
                   $scope.uploadFilesDetails3.id = key;
                   $scope.uploadFilesDetails3.upName = data.data[key];
                   // $scope.resultData.attachmentId.push(key);
                   // $scope.fileNameImg = data.data[key];
                   $rootScope.fjnames.push(data.data[key])
               }
               $scope.uploadFiles.push($scope.uploadFilesDetails3);
           }
       });
   }
   
   
}]);







/**
 * 额定功率管理.
 */
app.controller('ratedManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {
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

	//查询资管机房拥有者 
	 commonServ.findProperty().success(function (data) {
            utils.loadData(data,function (data) {
                $scope.listProperty = data.data;
            })
        });
	
	//查询资管机房拥有者 
	 commonServ.findStatus().success(function (data) {
            utils.loadData(data,function (data) {
                $scope.listStatus = data.data;
            })
        });
	
    $rootScope.countys={};
    //获取列表
    $scope.getData=function(a){
    	if(a){
     		 $scope.params = {
     			        pageSize: 15,//每页显示条数
     			        pageNo: 1,// 当前页
     		 };
     	}
        delete $scope.params.countyId;
        delete $scope.params.cityId;
		console.log($scope.userCity,$scope.userCounty);
        console.log($rootScope.userCity,$rootScope.userCounty);
		if($scope.userCity != "" && $scope.userCity != null){			
            angular.extend($scope.params,{
              cityId : $rootScope.userCityId	//若城市有值，则将对应的城市ID传入cityId
			
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

         console.log($scope.params);
        angular.extend($scope.params,{
			zhLabel:$scope.zhLabel,  //资管机房名称
			zgProperty:$scope.zproperty,  //资管机房名称
			zgStatus:$scope.zstatus,  //资管机房名称
          //  deviceType:$scope.deviceType,	//设备类型
          //  deviceModel:$scope.deviceModel	//设备型号

        });

        commonServ.findPowerRateByPage($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.pageInfo.totalCount = data.data.totalRecord;
                $scope.pageInfo.pageCount = data.data.totalPage;
                $scope.params.page = data.data.pageNo;
                $scope.list = data.data.results;
            })
        });
    }
    
    //获取excel
    $scope.getDataExcel = function(){
    	var URL=commonServ.findPowerRateByPageExcel();
    	alert("数据加载中,请耐心等待,勿重复点击!!");
    	var form=$("<form>");
		form.attr("style","display:none");
		form.attr("target","");
		form.attr("method","post");
		form.attr("action",URL);
		if($scope.userCity != "" && $scope.userCity != null){	
			var input=$("<input>");
			input.attr("type","hidden");
			input.attr("name","cityId");
			input.attr("value",$rootScope.userCityId);//若城市有值，则将对应的城市ID传入cityId
			if($scope.cityId != "" && $scope.cityId != null){
				input.attr("value",$scope.cityId);
	        }
			form.append(input);
           
        }
        if($scope.userCounty != "" && $scope.userCounty != null){
        	var input1=$("<input>");
			input1.attr("type","hidden");
			input1.attr("name","countyId");
			input1.attr("value",$rootScope.userCountyId);//若区县有值，则将对应的区县ID赋给countyId 
			if($scope.countyId != "" && $scope.cityId != null){
				input1.attr("value",$scope.countyId);
	         }
			form.append(input1);
           
         }
        var input2=$("<input>");
		input2.attr("type","hidden");
		input2.attr("name","zhLabel");
		input2.attr("value",$scope.zhLabel);
		form.append(input2);
		
		var input3=$("<input>");
		input3.attr("type","hidden");
		input3.attr("name","zgProperty");
		input3.attr("value",$scope.zproperty);
		form.append(input3);
		
		var input4=$("<input>");
		input4.attr("type","hidden");
		input4.attr("name","zgStatus");
		input4.attr("value",$scope.zstatus);
		form.append(input4);
		
		$("body").append(form);
		form.submit();
    }

	 // 查看机房设备
    $scope.selectFacility = function(item){
                    commonServ.selectFacility(item.intId).success(function(data){
						if(data.data==null||data.data==""){
							utils.msg("该机房无设备！");
						}
						utils.loadData(data,function(data){
							$scope.facility = data.data;
                        });
                    })
					$scope.selectRateDialog=ngDialog.open({
                    template: './tpl/selectRateDialog.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    width: 540,
                    scope: $scope,
                });
	}
	
    // 修改额定功率--新系统弃用
    $scope.editedRMS = function(item){
    	commonServ.querySingleRMSPage(item.id).success(function(data){
            utils.loadData(data,function(data){
                $scope.object = data.data;
                $scope.showDetailDialog=ngDialog.open({
                    template: './tpl/addrateDialog.html?time='+new Date().getTime(),
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    width: 540,
                    scope: $scope,
                });
                // 保存修改后的额定功率
                $scope.saveEditedRMSInfo = function(rmsInfo){
                    commonServ.editedRMS(rmsInfo).success(function(data){
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
   /* //关闭查看详情
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    }; */
    
	    //关闭查看机房设备
    $scope.closeDialog=function(){
        $scope.selectRateDialog.close("");
    };
    
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


}]);






/**
 * 数据导入
 */
app.controller('dataExprotCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', '$http','commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, $http, commonServ) {
	$rootScope.auditType=-1;
    //基础数据导入
	$scope.uploadStie = function() {
        //报账点
        var SITEURL=commonServ.siteImport();

        var file = document.querySelector('input[type=file]').files[0];
        if(file==null){
            utils.msg("请选择文件!");
            return;
        }
        if(!file){
            return;
        }
        var fileName = file.name;
        var index1=fileName.lastIndexOf(".");
        var index2=fileName.length;
        var suffix=fileName.substring(index1+1,index2);//后缀名

        if(suffix!="xlsx"){
            utils.msg("请选择文件.xlsx文件文件后缀必须为小写");
            return;
        }
        var fd = new FormData();
        fd.append('file', file);

        /*if((!(fileName.indexOf("基础")>=0 || fileName.indexOf("站点")>=0 || fileName.indexOf("自维")>= 0)) && !(fileName.indexOf("成本")>=0 || fileName.indexOf("中心")>=0)){
	        utils.confirm('注意',"导入基础数据站点数据--excel文件名--请包含'自维/基础数据'字段!" +
		 				"导入成本中心数据--excel文件名--请包含'成本中心'字段!",function(){
	         utils.ajaxSuccess(200,function(data){
	         	});
	        });
        }*/

        //导入报账点
        	$http({
                method:'POST',
                url:SITEURL,
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
                 })
                 .success( function (data){
                	  var other = data.data!=null?data.data:'OK';
                      var msg="自维站点数据--导入成功!"+other;
                  if(data.code!=200){
                	  var other = data.data!=null?data.data:'';
                      var msg="自维站点数据--导入失败!"+other;
                  }
                  utils.confirm('信息:',msg,function(){
                	  utils.ajaxSuccess(200,function(data){
                	  	});
                });
             });

 	}

	//导入成本中心
	$scope.uploadCenter = function() {
        var CENTERURL=commonServ.costCenterImport();

        var file = document.querySelector('input[type=file]').files[0];
        if(file==null){
            utils.msg("请选择文件!");
            return;
        }
        if(!file){
            return;
        }
        var fileName = file.name;
        var index1=fileName.lastIndexOf(".");
        var index2=fileName.length;
        var suffix=fileName.substring(index1+1,index2);//后缀名

        if(suffix!="xlsx"){
            utils.msg("请选择文件.xlsx文件文件后缀必须为小写");
            return;
        }
        var fd = new FormData();
        fd.append('file', file);
        	//导入成本中心
	         $http({
	              method:'POST',
	              url:CENTERURL,
	              data: fd,
	              headers: {'Content-Type': undefined},
	              transformRequest: angular.identity
	               })
	               .success( function (data){
	            	    var other = data.data!=null?data.data:'OK';
	                    var msg="成本中心数据--导入成功!"+other;
	                if(data.code!=200){
	                	var other = data.data!=null?data.data:'';
	                    var msg="成本中心数据--导入失败!"+other;
	                }
	                utils.confirm('信息:',msg,function(){
	                	  utils.ajaxSuccess(200,function(data){
	                	  	});
	                });
	    	   });

 	}



    //下载自维基础数据excel 模板
    $scope.downDownDemo = function() {

    	var URL=commonServ.downLoadURI();

    	var form=$("<form>");
		form.attr("style","display:none");
		form.attr("target","");
		form.attr("method","post");
		form.attr("action",URL);
		var input=$("<input>");
		input.attr("type","hidden");
		input.attr("name","fileName");
		input.attr("value","自维基础数据(模板)");
		$("body").append(form);
		form.append(input);
		form.submit();

    };

    //下载成本中心excel 模板
    $scope.downDownCenter = function() {

    	var URL=commonServ.downLoadURI();

    	var form=$("<form>");
		form.attr("style","display:none");
		form.attr("target","");
		form.attr("method","post");
		form.attr("action",URL);
		var input=$("<input>");
		input.attr("type","hidden");
		input.attr("name","fileName");
		input.attr("value","成本中心数据(模板)");
		$("body").append(form);
		form.append(input);
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
    $scope.getData=function(){
        commonServ.getlogList($scope.params).success(function (data) {
            utils.loadData(data,function (data) {
                $scope.list=data;
            })
        });
    }




    /**
     * 查看
     */
    $scope.showDetail=function(item){


        $scope.SubmitDialog=ngDialog.open({

            template: './tpl/viewElectricDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1136,
            scope: $scope,
        });


        //
        //commonServ.queryElectrictyTotalAmount(item.id).success(function(data){
        //
        //    utils.loadData(data,function(data){
        //        $scope.obj=data.data;
        //    });
        //
        //});
        //
        //
        //
        //utils.alert(item);


    }


    $scope.closeDialog=function(){

        $scope.SubmitDialog.close("");
    }


}]);




app.controller('baseDataExcelCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ) {
	$rootScope.auditType=-1;
	commonServ.baseDataExcelCtrl().success(function(data){
		$scope.excel=data.data;
    });
	
	$scope.downDataExcelGo=function(){
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

}]);










