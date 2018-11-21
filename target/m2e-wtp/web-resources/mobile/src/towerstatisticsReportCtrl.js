/**
 * Created by issuser on 2017/4/25.
 */


// 统计报表
app.controller('towerStatisticsReportCtrl', ['lsServ', '$rootScope', '$scope', 'ngDialog', '$state', '$stateParams', 'utils', 'towerReportServ', function (lsServ, $rootScope, $scope, ngDialog, $state, $stateParams, utils, towerReportServ) {

    $scope.years=[];

    towerReportServ.provinceSummary().success(function(data){
        utils.loadData(data,function(data){
            $scope.proSum = data.data;
        })
    })

	$scope.cityId = '0';
    $scope.getYears=function(){
        var myDate= new Date(); 
        var startYear=myDate.getFullYear()-10;//起始年份 
        var endYear=myDate.getFullYear();//结束年份 
        for (var i=endYear;i>=startYear;i--){ 
            $scope.years.push(i);
        } 
    }

   
    $scope.getYears();
    $scope.switchChart=function(chartName){
        if(chartName != undefined && chartName != null){
            $scope.subMenu = chartName;
        }

        if(chartName == '全省站点用电量情况'){
             $scope.getStationEPStastic();
        }else if(chartName == '全省站点直供电，转供电用电量情况'){
             $scope.stationDetailEPStastic();
        }else if(chartName == '全省站点电费情况'){
             $scope.stationECStastic();
        }else if(chartName == '全省站点电费占收比,占支比，全省站点单载波电费情况'){
             $scope.scECStastic();   
        }else if(chartName == '全省站点超额定功率标杆情况'){
            $scope.superPowerRating();
        }else if(chartName == '全省站点超智能电表标杆值、超开关电源标杆值情况'){
            $scope.superSmartMeter();
        }else if(chartName == '全省电费单价占比情况'){
            $scope.unitPriceProportion();
        }
    }

    $scope.getData=function(){
        debugger;
        console.log( $scope.cityId);
        console.log( $scope.year);
        console.log( $scope.type);
        //判断查看全省，还是市级查看全市
        if($scope.cityId != undefined){
            $scope.typeCode = $scope.cityId;
        }else{
            $scope.typeCode = 0;
        }
       if($scope.type != undefined){
            $scope.changeMenu($scope.type);
       }else{
            $scope.switchChart('全省站点用电量情况')
       }
    }


    $scope.getListValsForAttr=function(list,attr){
        return utils.getListValsForAttr(list,attr);
    }


    $scope.getListValsForAttrAndSubAttr=function(list,attr,subAttr){
        return utils.getListValsForAttrAndSubAttr(list,attr,subAttr);
    }



    $scope.menus=[
        {
            key:"电量统计管理",
            value:[{id:1,name:"全省站点用电量情况"},{id:2,name:"全省站点直供电，转供电用电量情况"}],
        },

        {
            key:"电费统计管理",
            value:[{id:3,name:"全省站点电费情况"},{id:4,name:"全省站点电费占收比,占支比，全省站点单载波电费情况"}],
        },
        {
            key:"稽核统计管理",
            value:[{id:5,name:"全省站点超额定功率标杆情况"},{id:6,name:"全省站点超智能电表标杆值、超开关电源标杆值情况"}],
        },
        // {
        //     key:"单价统计管理",
        //     value:[{id:7,name:"全省电费单价占比情况"}],
        // }
    ];
	$scope.type=$scope.menus[0].key;

  
    
    $scope.changeMenu=function(value){
        if(value != undefined){

             $scope.stasticType=value;
        }
        for (var i=0; i < $scope.menus.length; i++){
            if(value==$scope.menus[i].key){
                $scope.subMenu=$scope.menus[i].value[0].name;
                $scope.switchChart($scope.subMenu);
                break;
            }
        }

    }
   
   


    //指标统计管理- 资产、财务系统基站名称一致性报表
    $scope.normConsistency=function (){
        if(!$scope.typeCode){
            $scope.typeCode = 0 
        }
        if(!$scope.year){
            $scope.year = new Date().getFullYear();
        }


        console.log("//指标统计管理- 资产、财务系统基站名称一致性报表")

        towerReportServ.normConsistency($scope.typeCode,$scope.year).success(function(data){

            utils.loadData(data,function(data){
                if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
                console.log("资产、财务系统基站名称一致性报表>>>>>>>>>>>>>",data);
                 $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
                var chartData=data.data;

                var title = '资产、财务系统基站名称一致性报表';

                var option = {


                    title: {
                        text:title,
                        left: 'center',
                        top:'3%',

                    },

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        },
                        formatter:function(param){
                            // console.log(param)
                            // console.log(param[1])
                            var data = "";
                            data += param[0].axisValue + '</br>';
                            for(var i = 0; i< param.length;i++){
                                if(param[i].seriesName == '匹配成功率'){
                                    data += param[i].seriesName + " : " + param[i].value + "%" + "</br>";
                                }else{
                                    data += param[i].seriesName + " : " + param[i].value + "</br>";
                                }
                            }
                            // console.log(data);
                            return data;
                        }
                    },
                    legend: {
                        orient: 'horizontal',
                        padding:[30,0,10,0],
                        top:'3.3%',
                        data:['财务系统站点数','匹配成功资管数量','匹配成功率']
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '0.6%',
                        top:'20%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: $scope.getListValsForAttr(chartData,"city"),
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '',
                            min: 0,
                            max: 25000,
                            interval: 5000,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        }
                    ],
                    series: [
                        {
                            name:'财务系统站点数',
                            type:'bar',
                            data:$scope.getListValsForAttr(chartData,"site")
                        },
                        {
                            name:'匹配成功资管数量',
                            type:'bar',
                            data:$scope.getListValsForAttr(chartData,"successData")
                        },
                        {
                            name:'匹配成功率',
                            type:'line',
                            yAxisIndex: 1,

                            data:$scope.getListValsForAttr(chartData,"successRate")
                        }
                    ]
                };


                myChart.setOption(option);
                 $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })

            })
        });

    };


    //指标统计管理- 全省站点智能电表接入率、可用率报表------------------------------已完成
    $scope.normAvailability=function (){
        if(!$scope.typeCode){
            $scope.typeCode = 0 
        }
        if(!$scope.year){
            $scope.year = new Date().getFullYear();
        }
        towerReportServ.normAvailability($scope.typeCode,$scope.year).success(function(data){

            utils.loadData(data,function(data){
                if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
                $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
                console.log("智能电表接入率>>>>>>>>>>>>>",data);

                var chartData= data.data;

                var   option = {


                    title: {
                        text: "智能电表接入率、可用率",
                        left: 'center',
                        top:'3%',
                    },

                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        orient: 'horizontal',
                        padding:[30,0,10,0],
                        top:'3.3%',
                        data:['智能电表接入率','智能电表可用率']
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '0.6%',
                        top:'20%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: $scope.getListValsForAttr(chartData,"city")
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    },
                    series: [
                        {
                            name:'智能电表接入率',
                            type:'line',
                            data: $scope.getListValsForAttr(chartData,"accessRate"),
                            /*markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }*/
                        },
                        {
                            name:'智能电表可用率',
                            type:'line',
                            data: $scope.getListValsForAttr(chartData,"availableRate"),
                            /*markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }*/
                        }

                    ]
                };

                myChart.setOption(option);
                 $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })
            })
        });
    };

    //指标统计管理- 资产、财务系统基站名称一致性报表------------------------------已完成
    $scope.normSitePower=function (){
        if(!$scope.typeCode){
            $scope.typeCode = 0 
        }
        if(!$scope.year){
            $scope.year = new Date().getFullYear();
        }

        towerReportServ.normSitePower($scope.typeCode,$scope.year).success(function(data){

            utils.loadData(data,function(data){
                if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
                console.log("财务系统基站名称一致性报表>>>>>>>>>>>>>",data);
                 $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
               
                var chartData= data.data;

                var title = '折柱混合';

                var option = {


                    title: {
                        text:title,
                        left: 'center',
                        top:'3%',
                    },

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    legend: {
                        orient: 'horizontal',
                        padding:[30,0,10,0],
                        top:'3.3%',
                        data:['动环网管现有站点数','开关电源监控完好率','开关电源可控率']
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '0.6%',
                        top:'20%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: $scope.getListValsForAttr(chartData,"city"),
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '',
                            min: 0,
                            max: 25000,
                            interval: 5000,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        }
                    ],
                    series: [
                        {
                            name:'动环网管现有站点数',
                            type:'bar',
                            data:$scope.getListValsForAttr(chartData,"site")
                        },
                        {
                            name:'开关电源监控完好率',
                            type:'bar',
                            data:$scope.getListValsForAttr(chartData,"availability")
                        },
                        {
                            name:'开关电源可控率',
                            type:'line',
                            yAxisIndex: 1,
                            data:$scope.getListValsForAttr(chartData,"availableRate")
                        }
                    ]
                };


                myChart.setOption(option);
                 $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })
            })
        });

    };








    //稽核统计管理-全省站点超额定功率标杆情况------------------------------已完成
    $scope.superPowerRating=function (){
        if(!$scope.typeCode){
            $scope.typeCode = 0 
        }
        if(!$scope.year){
            $scope.year = new Date().getFullYear();
        }


        towerReportServ.superPowerRating($scope.typeCode,$scope.year).success(function(data){

            utils.loadData(data,function(data){
                if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
                $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
                
                console.log("superPowerRating",data);

                var chartData= data.data;

                var   option = {
                   title: {
                       text: "超额定功率标杆值占比情况",
                       left: 'center',
                       top:'3%',
                   },

                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        orient: 'horizontal',
                        padding:[30,0,10,0],
                        top:'3.3%',
                        data:['超额定功率标杆值占比']
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '0.6%',
                        top:'20%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: $scope.getListValsForAttr(chartData,"cityName")
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    },
                    series: [
                        {
                            name:'超额定功率占比',
                            type:'line',
                            data: $scope.getListValsForAttr(chartData,"proportion"),
                            /*markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }*/
                        }
                    ]
                };


                myChart.setOption(option);
                $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })

            })
        });

    };

    //稽核统计管理-全省站点超智能电表标杆值、超开关电源标杆值情况------------------------------已完成
    $scope.superSmartMeter=function (){
        if(!$scope.typeCode){
            $scope.typeCode = 0 
        }
        if(!$scope.year){
            $scope.year = new Date().getFullYear();
        }
        towerReportServ.superSmartMeter($scope.typeCode,$scope.year).success(function(data){

            utils.loadData(data,function(data){
                if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
                console.log("超智能电表标杆值、超开关电源标杆值情况",data);
              $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
               
                var chartData= data.data;

                var   option = {


                    title: {
                        text: "超智能电表标杆值、超开关电源标杆值情况",
                        left: 'center',
                        top:'3%',
                    },

                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        orient: 'horizontal',
                        padding:[30,0,10,0],
                        top:'3.3%',
                        data:['超智能电表标杆值','超开关电源标杆值']
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '0.6%',
                        top:'20%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: $scope.getListValsForAttr(chartData,"cityName")
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    series: [
                        {
                            name:'超智能电表标杆值',
                            type:'line',
                            data: $scope.getListValsForAttr(chartData,"proportion1"),
                            /*markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }*/
                        },
                        {
                            name:'超开关电源标杆值',
                            type:'line',
                            data: $scope.getListValsForAttr(chartData,"proportion2"),
                            /*markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }*/
                        }
                    ]
                };
                myChart.setOption(option);
                 $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })
          })
        });
    };




    //电量统计管理-全省站点用电量情况  --------------------------------[已完成]
    $scope.getStationEPStastic=function(){
        console.log("  //电量统计管理-全省站点用电量情况");
        towerReportServ.stationEPStastic($scope.typeCode, $scope.year).success(function(data){

            utils.loadData(data,function(data){
                debugger;
                if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
                $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
               
                console.log("getStationEPStastic",data);
                var chartData=data.data;
                console.log(data.data);

                var option = {
                    title:{text:"用电量情况",top:'3%',left: 'center'},
                   /* color: ['#3398DB'],*/
                    legend: {
                        data:[{
                            name:"用电量情况",//'单载波电费'
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
                            //axisLabel:{rotate:45},//x-label 倾斜
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel: {
                                formatter: '{value}万度'
                            }
                        }
                    ],
                    series : [
                        {
                            name:"电量（万度）",
                            type:'bar',
                            barWidth: '20%',
                            data: $scope.getListValsForAttrAndSubAttr(chartData,"cityData","power"),
                            /*markLine:{
                                data:[{
                                    type:'average',name:'平均值'
                                }],
                            }*/
                        }
                    ]
                };
                myChart.setOption(option);
                 $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                        console.log("resize.....................")
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })
            })
        });
    };


    //电量统计管理- 全省站点直供电，转供电用电量情况  --------------------------------[已完成]
    $scope.stationDetailEPStastic=function(){

        towerReportServ.stationDetailEPStastic($scope.typeCode,$scope.year).success(function(data){

            utils.loadData(data,function(data){
                if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
                console.log("getStationEPStastic",data);
                var chartData=data.data;
              $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
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
                $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })

            })
        });

    }





    //电费统计管理-全省站点电费情况--------------------------------[未完成-待后端接口修改]
    $scope.stationECStastic=function (){
        if(!$scope.typeCode){
            $scope.typeCode = 0 
        }
        if(!$scope.year){
            $scope.year = new Date().getFullYear();
        }


        console.log("电费统计管理-全省站点电费情况");

        towerReportServ.stationECStastic( $scope.typeCode,$scope.year).success(function(data){

            utils.loadData(data,function(data){
                if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
                $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
               

                var chartData=data.data;
                // console.log(data.data);
                var legendList = [];
                // console.log(data.data[0].cityData);
                var keyCurrentTotal = data.data[0].cityData.keyCurrentTotal ||'';
                var keyPastTotal = data.data[0].cityData.keyPastTotal ||'';
                var keyAddTotal = data.data[0].cityData.keyAddTotal ||'';
                var keyAddRate = data.data[0].cityData.keyAddRate ||'';
                legendList.push(keyCurrentTotal);
                legendList.push(keyPastTotal);
                legendList.push(keyAddTotal);
                legendList.push(keyAddRate);
                // console.log($scope.getListValsForAttrAndSubAttr(chartData,"cityData","currentTotal"));
                //  console.log($scope.getListValsForAttrAndSubAttr(chartData,"cityData","pastTotal"));
                //  console.log($scope.getListValsForAttrAndSubAttr(chartData,"cityData","addTotal"));
                //  console.log($scope.getListValsForAttrAndSubAttr(chartData,"cityData","addRate"));
                //  console.log($scope.getListValsForAttr(chartData,"cityName"));
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
                 $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })
            })
        });

    }

    //电费统计管理-全省站点电费占收比，占支比--------------------------------[已完成]
    $scope.scaleECStastic=function (){
        if(!$scope.typeCode){
            $scope.typeCode = 0 
        }
        if(!$scope.year){
            $scope.year = new Date().getFullYear();
        }
        towerReportServ.scaleECStastic($scope.typeCode,$scope.year).success(function(data){

            utils.loadData(data,function(data){
                if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                }
              $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
              
                var chatData=data.data;
                // console.log(data.data);
                // console.log($scope.getListValsForAttrAndSubAttr(chatData,'cityData','占收比'));
                // console.log($scope.getListValsForAttrAndSubAttr(chatData,'cityData','占支比'));
                option = {
                    title: {
                        text: '电费占收比，占支比',
                        subtext: ''

                    },
                    legend: {
                        orient: 'horizontal',
                        padding:[30,0,10,0],
                        top:'3.3%',
                        data:['占收比','占支比']
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '0.6%',
                        top:'20%',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter:function(param){
                            console.log(param)
                            console.log(param[1])
                            var data = "";
                            data += param[0].axisValue + '</br>';
                            for(var i = 0; i< param.length;i++){
                                data += param[i].seriesName + " : " + param[i].value + "%" + "</br>";
                            }
                            // console.log(data);
                            return data;
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
                            /*markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }*/
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
                 $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })
            })
        });
    }

    //电费统计管理-全省站点单载波电费情况--------------------------------[已完成]
    $scope.scECStastic=function (){
        if(!$scope.typeCode){
            $scope.typeCode = 0 
        }
        if(!$scope.year){
            $scope.year = new Date().getFullYear();
        }

        console.log("  //电费统计管理-全省站点单载波电费情况");

        towerReportServ.scECStastic( $scope.typeCode,$scope.year).success(function(data){
    
            utils.loadData(data,function(data){
            if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                } 
                $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
               
                console.log("getStationEPStastic",data);
                var chartData= data.data;
                var list = $scope.getListValsForAttrAndSubAttr(chartData,"cityData","SCEC");

                console.log("  //电费统计管理-全省站点单载波电费情况",list);

                var option = {
                    title:{text:"单载波电费",top:'3%',left: 'center'},
                   /* color: ['#3398DB'],*/
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
                            //axisLabel:{rotate:45},//x-label 倾斜
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
                            /*markLine:{
                                data:[{
                                    type:'average',name:'平均值'
                                }]
                            }*/
                        }
                    ]
                };

                myChart.setOption(option);
                 $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })
            })
        });
    }


    //单价统计管理-全省电费单价占比情况--------------------------------[已完成]
    $scope.unitPriceProportion=function (){
        if(!$scope.typeCode){
            $scope.typeCode = 0 
        }
        if(!$scope.year){
            $scope.year = new Date().getFullYear();
        }
            towerReportServ.unitPriceProportion($scope.typeCode,$scope.year).success(function(data){
            utils.loadData(data,function(data){
            if(!data.data || !data.data.length){
                    $scope.noData = true;
                }else{
                    $scope.noData = false;
                } 
               $.get('assets/js/extends/walden.json', function (obj) {
                echarts.registerTheme('walden', obj);
                var myChart = echarts.init(document.getElementById('container'),'walden');
               
                console.log("getStationEPStastic",data);
                var chartData= data.data;
                var list = $scope.getListValsForAttr(chartData,'cityName');

                console.log("单价占比",list);

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
                            //axisLabel:{rotate:45},//x-label 倾斜
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
                            /*markLine:{
                                data:[{
                                    type:'average',name:'平均值'
                                }]
                            }*/
                        },
                        {
                            name:"1-1.3元占比",
                            type:'bar',
                            barWidth: '20%',
                            data: $scope.getListValsForAttr(chartData,'proportion2'),
                            /*markLine:{
                                data:[{
                                    type:'average',name:'平均值'
                                }]
                            }*/
                        },
                        {
                            name:"小于1元占比",
                            type:'bar',
                            barWidth: '20%',
                            data: $scope.getListValsForAttr(chartData,'proportion3'),
                            /*markLine:{
                                data:[{
                                    type:'average',name:'平均值'
                                }]
                            }*/
                        }
                    ]
                };

                myChart.setOption(option);
                 $(window).on("resize.doResize", function (){
                    $scope.$apply(function(){
                          $("#container").height($(".chart-content").height());
                          $("#container").width($(".chart-content").width());
                          myChart.resize();
                    });
                });
                $scope.$on("$destroy",function (){
                    $(window).off("resize.doResize"); 
                });
            })
            })
        })
    }
    // 初始化
    $('#container').height($('.chart-content').height());
    $scope.typeCode=0;
    $scope.stasticType='电量统计管理';
    $scope.changeMenu('电量统计管理');

     // $scope.unitPriceProportion();
    //$scope.scaleECStastic();
    // $scope.scECStastic();
    // $scope.stationECStastic();
    //$scope.getStationEPStastic();
    // $scope.stationDetailEPStastic();
    // $scope.superPowerRating();
    // $scope.superSmartMeter();
    // $scope.normAvailability();
    // $scope.normSitePower();
    // $scope.normConsistency();
    //normConsistency
}]);
