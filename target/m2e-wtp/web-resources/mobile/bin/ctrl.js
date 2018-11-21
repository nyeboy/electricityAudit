/**
 *
 *
 */


app.controller('headerCtrl', ['lsServ',  '$rootScope', '$scope', '$state', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state, ngDialog, utils, commonServ) {
	$rootScope.auditType=-1;
    //显示系统信息框
    $scope.showNotice=false;
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

    //获取当前用户
    commonServ.getCurrentUser().success(function (data) {
        utils.loadData(data,function (data) {
            console.log("getCurrentUser",data);
            $rootScope.loginUser=data.data;
            $rootScope.account=data.data.account;
            $rootScope.userLevel=data.data.userLevel;
            $rootScope.userCity = data.data.cityStr;
            // $rootScope.functionType=     //判断自维塔维;
            console.log("$rootScope.functionType"+$rootScope.functionType);
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
            utils.ajaxSuccess(data,function (data) {
            	setTimeout( $rootScope.closePage(), 3000);
            });
		});
    };

    $rootScope.closePage=function(){
		window.opener=null;
		window.open('','_self');
		window.close();
    }


    // 页面跳转
    $rootScope.goPage=function(item,$event) {
        if(item.child==undefined || item.child.length==0){
                console.log(item);
                var str = 'app.' + item.id;
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
                    utils.alert(item.value+'模块,正在开发中...')
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
		commonServ.normDetail(cityCode, 2016).success(function(data){
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
			commonServ.stationDetailEPStastic(0,year).success(function(data){
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
			towerReportServ.stationDetailEPStastic(0,year).success(function(data){
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
        commonServ.normDetail(cityCode, 2016).success(function(data){
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
			commonServ.stationDetailEPStastic(cityId,year).success(function(data){
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
			towerReportServ.stationDetailEPStastic(cityId,year).success(function(data){
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

    // 自维
    if (!$rootScope.functionType) {
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
    $scope.pageInfo = {
        totalCount: 0,//总的记录条数
        pageCount: 0,// 总的页数
        pageOptions: [15,50,100,200],//每页条数的选项,选填
        showPages: 5//显示几个页码,选填
    };

    $scope.my_data = [];
    $scope.params = {
        pageSize: 10,//每页显示条数
        pageNo: 1,// 当前页
    };

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

        if($scope.departmentId && !departmentId){
        	departmentId = $scope.departmentId;
        }

        if(departmentId || departmentId == 0){
        	angular.extend($scope.params,{
        	    departmentId:departmentId
       		})
        }

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

        if(!user.roleIds || user.roleIds == '' || !user.account || !user.userName || (!user.province &&  user.userStatus!=0) || !user.city || !user.county ||( !user.userStatus && user.userStatus != 0) || !user.county){
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
         if(!user.roleIds || user.roleIds == '' || !user.account || !user.userName || (!user.province &&  user.userStatus!=0) || !user.city || !user.county ||( !user.userStatus && user.userStatus != 0) || !user.county){
            utils.msg("请完成必填项后再提交。");
            return;
        }

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
                    $scope.getData();

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
        pageSize: 10,//每页显示条数
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

            "siteName":$scope.siteName,
        })

        commonServ.getBaseDataByPage($scope.params).success(function (data) {
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
          }


      }

    //查看详情
    $scope.showDetail=function(item){

        commonServ.getBaseDataByDetails(item.id).success(function (data) {

            utils.loadData(data,function (data) {
                console.log(data);
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
    	$scope.subList=[];
        commonServ.queryPowerRatingDetail(item.siteId).success(function(data){

            utils.loadData(data,function(data){

                    $scope.subList=data.data; //
            })
        });



        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/benchMarkDialog.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 1000,
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
         console.log($scope.params);
        angular.extend($scope.params,{
            "changeType":$scope.changeType,      // 修改类型
            "applyUserName":$scope.applyUserName,// 申请人姓名
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

    // 查看维护数据详情

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
            "accountName":$scope.accountName
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

     //修改
    $scope.modifySiteInfo=function(item){
        $scope.siteInfo = utils.deepCopy(item);
        $scope.status = 'update';
        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/modifySite.html?time='+new Date().getTime(),
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            width: 800,
            scope: $scope,
        });

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

}]);




/**
 * 供电信息管理
 */
app.controller('supplierPowerManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

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
            	"id":item.id

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




/**
 * 供应商信息管理
 */
app.controller('supplierManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

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

    //查看详情
    $scope.showDetail=function(item){

        $scope.showDetailDialog=ngDialog.open({
            template: './tpl/otherManagerEdit.html?time='+new Date().getTime(),
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
            name : $scope.name
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

}]);


/**
 * 额定功率管理.
 */
app.controller('ratedManagerCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', 'commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, commonServ) {

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
            deviceType:$scope.deviceType,	//设备类型
            deviceModel:$scope.deviceModel	//设备型号

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

    // 修改额定功率
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
    //关闭查看详情
    $scope.closeDialog=function(){
        $scope.showDetailDialog.close("");
    };


}]);






/**
 * 数据导入
 */
app.controller('dataExprotCtrl', ['lsServ',  '$rootScope', '$scope', '$state','$stateParams', 'ngDialog', 'utils', '$http','commonServ', function (lsServ, $rootScope, $scope, $state,$stateParams, ngDialog, utils, $http, commonServ) {

    //数据导入
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











