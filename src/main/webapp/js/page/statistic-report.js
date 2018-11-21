MENU.addItem([{
    value: "数据报表",
    id: "dataCarts",
    icon: "img/table_icon.png",
    childBoxStyle: "background-color:#1c2226",
    child: [{
        value: "数据报表",
        id: "dataCart_1",
        clickFun: function(contentBox, routerBox) {
            fullDataChart.apply(this, arguments);

        }
    }]
}]);

function fullDataChart(contentBox, routerBox) {
    var tabArrFun=function(mgmt){//管理类型
        var tabArr = []; //页签值：数组
        switch (mgmt) {
            case 'eleQuantityMgmt':
                //电量统计管理
                tabArr = [{
                    name: '用电量情况',
                    id: 'stationEP'
                }, {
                    name: '直供电、转供电用电量情况',
                    id: 'stationDetailEP'
                }];
                break;
            case 'priceMgmt':
                //单价统计管理
                tabArr = [{
                    name: '电费单价占比情况统计',
                    id: 'UnitPriceProportion'
                }];
                break;
            case 'auditMgmt':
                //稽核统计管理
                tabArr = [{
                    name: '基站超额定功率标杆值占比情况',
                    id: 'superPowerRatingCount'
                }, {
                    name: '超智能电表标杆值比例 /超电源开关标杆值比例',
                    id: 'superSmartMeterCount'
                }];
                break;
            case 'indexMgmt':
                //指标统计管理
                tabArr = [{
                    name: '资管、财务系统基站名称一致性',
                    id: 'financialSystemConsistency'
                }, {
                    name: '智能电表接入率、可用率',
                    id: 'smartMeterOfAvailability'
                }, {
                    name: '站点开关电源监控完好率、可用率',
                    id: 'provinceSitePower'
                }];
                break;
            default :
            //电费统计管理
            tabArr = [{
                name: '电费情况',
                id: 'stationECStastic'
            }, {
                name: '电费占收比，占支比',
                id: 'scaleECStastic'
            }, {
                name: '单载波电费情况',
                id: 'scECStastic'
            }];
            break;
        }
        return tabArr;
    }

    var bottomData=[{
        title:'电费基本数据',
        content:[{
            name:'直供电比例',
            value:'75.41%'
        },{
                name:'转供电比例',
                value:'25.41%'
        }]
    },{
        title:'全省财务数据',
        content:[{
            name:'2016年电量',
            value:'75.4亿度'
        },{
            name:'2016年电量',
            value:'14.5亿度'
        }]
    },{
        title:'全省基站报账站点数据',
        content:[{
            name:'基站总数',
            value:'25,402'
        },{
            name:'自维',
            value:'12,122'
        }]
    },{
        title:'铁塔信息',
        content:[{
            name:'移交铁塔站点',
            value:'25,102'
        },{
            name:'过户站点',
            value:'32,122'
        }]
    }];
//    home-page-tab
/*    var tabArr=[{
        name:'评优指标体系(月) (地图)',
        id:'targetSystem'
    },{
        name:'全省电费情况',
        id:'eleCharge'
    },{
        name:'全省电费占收比、占支比',
        id:'balanceOfPayments'
    },{
        name:'全省单载波电费情况',
        id:'singleCarrierFee'
    },{
        name:'全省直供电、转供电用电量情况',
        id:'eleConsumption'
    },{
        name:'全省电费单价占比情况',
        id:'eleChargePrice'
    }];*/
    function creatDom(type,setobj,hiddeAttrObj,innerContent){
        var dom=document.createElement(type);
        setobj&&[].forEach.call(Object.keys(setobj),function(n){
            dom.setAttribute(n,setobj[n])
        });
        hiddeAttrObj&&[].forEach.call(Object.keys(hiddeAttrObj),function(n){
            dom[n]=hiddeAttrObj[n]
        });
        innerContent&&(innerContent.nodeType===1||innerContent.nodeType===11?dom.appendChild(innerContent):(dom.innerHTML=innerContent));
        //dom.style.webkitTransform="translateZ(0)";
        return dom
    }
    function createTop(){
        var topFilterDom=creatDom("div",{class:'top-filter row'},null,'<div class="col-xs-3">'+
            '<select name="province" class="form-control" id="province">'+
            '<option>四川省</option></select></div>'+
            '<div class="col-xs-3">'+
            '<select name="city" class="form-control" id="city">'+
            '<option value="0">==全市==</option><option value="1">成都市</option></select></div>'+
            '<div class="col-xs-3">'+
            '<select name="reportType" class="form-control" id="reportType" placeholder="选择报表查询类型">'+
            '<option value="eleFeeMgmt">电费统计管理</option>' +
            '<option value="eleQuantityMgmt">电量统计管理</option>' +
            '<option value="priceMgmt">单价统计管理</option>' +
            '<option value="auditMgmt"">稽核统计管理</option>' +
            '<option value="indexMgmt">指标统计管理</option></select></div>'+
            '<div class="col-xs-2 pull-right">'+
            '<button type="button" class="btn btn-primary btn-block" id="queryBtn">查询</button></div>');
        return topFilterDom;
    }
    function createBottom(data) {
        var dom='';
        var box;
        for(var i=0;i<data.length;i++){
            dom+='<div class="col-md-3 total-box"><div class="top-data">' +
                '<div class="pull-left"> ' +
                '<div class="title">' + data[i].content[0].name + '</div> ' +
                '<div class="data">' + data[i].content[0].value + '</div> ' +
                '</div> ' +
                '<div class="pull-right"> ' +
                '<div class="title">' + data[i].content[1].name + '</div> ' +
                '<div class="data">' + data[i].content[1].value + '</div>' +
                '</div> ' +
                '</div> ' +
                '<div class="bottom-title">' + data[i].title + '</div></div>';
        }
        dom='<div class="row total-row">'+dom+'</div>';
        box=creatDom("div", {class: "bottom-total container-fluid"}, null, dom);
        return box;
    }
    function createContent(tabArr){
        var status;
        var typeTabDom;
        var chartId;
        var typeContentDom;
        var contentDom;
        var tabDom='';
        var tabContentDom='';
        for(var i=0;i<tabArr.length;i++){
            status=(i==0)?"active":"dropdown";
            tabDom+='<li class="'+status+'"><a href="#'+tabArr[i].id+'" data-toggle="tab">'+tabArr[i].name+'</a></li>';
        }
        typeTabDom='<ul id="typeTab" class="nav nav-tabs">'+tabDom+'</ul>';
        for(var i=0;i<tabArr.length;i++) {
            chartId=tabArr[i].id+'Chart';
            tabContentDom+='<div class="tab-pane fade in active" id="'+tabArr[i].id+'"><div id="'+chartId+'" style="width:1070px;height:400px;"></div></div>';
        }
        typeContentDom='<div id="typeContent" class="tab-content">'+tabContentDom+'</div>';
        contentDom=creatDom("div",{class:'middle-chart'},null,typeTabDom+typeContentDom);
        return contentDom;
    }
    /*填充DOM：按照topDOM-->middleDom-->bottomDom顺序*/
    var startTopDom=creatDom("div",{id:'statistic-report'},null,createTop());//append('<div id="statistic-report"></div>');
    contentBox.append(startTopDom);
    $('#statistic-report').append(createContent(tabArrFun('eleFeeMgmt')));//默认显示电费管理的tab
    $('#statistic-report').append(createBottom(bottomData));


    $('#queryBtn').click(function(){
        var params={
            citySelected:$('#city').val(),//城市
            reportTypeSelected:$('#reportType').val()//管理类型
        }
        var tab=tabArrFun();
        createContent(tab);
        ajaxFun(params);

    });

    function ajaxFun(params){
        //根据查询参数选择调用对应接口   ===============TODO================
        var urlVal='',typeId='';
        switch (params.reportTypeSelected){
            case 'eleFeeMgmt':
                //urlVal=Interface.get('Audit','eleFeeMgmt');//电费统计管理
                urlVal= 'http://localhost:8080/audit/electricCharge/stationECStastic.do';//电费情况
                typeId="stationECStastic";
                ajaxReq();
                urlVal='http://localhost:8080/audit/electricCharge/scaleECStastic.do';//电费占收比、占支比报表？
                urlVal='http://localhost:8080/audit/electricCharge/scECStastic.do?typeCode=0';//单载波电费
                 typeId="scaleECStastic";
                 dataObj=chartDataFormat(data.data,typeId);
                 DrawChartScaleECStastic("scaleECStasticChart",dataObj,'电费占收比、占支比报表');
                 typeId="scECStastic";
                 dataObj=chartDataFormat(data.data,typeId);
                 var legendName='单载波电费(元)';
                 var yLabelFor='(元)'
                 DrawChart("stationEPChart",dataObj,'单载波电费情况报表',legendName,yLabelFor);

                break;
            case 'eleQuantityMgmt':
                //urlVal=Interface.get('Audit','eleQuantityMgmt');//电量统计管理
                urlVal='http://localhost:8080/audit/electricPower/stationEPStastic.do?typeCode=0';//用电量情况
                urlVal='http://localhost:8080/audit/electricPower/stationDetailEPStastic.do?typeCode=0';//直供电、转供电用电量情况
                break;
            case 'priceMgmt':
                urlVal=Interface.get('Audit','priceMgmt');//单价统计管理
                break;
            case 'auditMgmt':
                urlVal=Interface.get('Audit','auditMgmt');//稽核统计管理
                break;
            case 'indexMgmt':
                urlVal=Interface.get('Audit','indexMgmt');//指标统计管理
                break;
        }
        function ajaxReq(){
            $.ajax({
                url: urlVal,
                type:'get',
                data:{
                    typeCode:params.citySelected
                },
                dataType:'json'
            }).done(function(data){
                console.log('enter ok!');
                if(data.code==200){
                    switch (typeId){
                        case 'stationECStastic':
                            dataObj=chartDataFormat(data.data,typeId);
                            DrawChartStationECStastic("stationECStasticChart",dataObj,'电费情况');
                            break;
                        case '':

                    }

                }
            }).fail(function(err) {
                console.log("er:数据获取失败");
            });
        }

    }
    function ChartFun(){
        var dataFormat=function(){

        };

    }
    //DrawChart("targetSystemChart");
    $.ajax({
        //url: 'http://localhost:8080/audit/unitPrice/proportion.do?typeCode=0',
        //url: 'http://localhost:8080/audit/electricCharge/scECStastic.do?typeCode=0',//单载波电费
        //url: 'http://localhost:8080/audit/electricCharge/scaleECStastic.do?typeCode=0',//电费占收比、占支比报表？
        //url: 'http://localhost:8080/audit/electricCharge/stationECStastic.do?typeCode=0',//电费情况
        //url: 'http://localhost:8080/audit/electricPower/stationDetailEPStastic.do?typeCode=0',//直供电、转供电用电量情况
        url: 'http://localhost:8080/audit/electricPower/stationEPStastic.do?typeCode=0',//用电量情况
        type: 'get',
        dataType: 'json'
    }).done(function(data) {
        console.log('dataSuccess');
        if(data.code===200){
            var typeId='';
            var chartId=typeId+'Chart';
            /*typeId="scECStastic";
             dataObj=chartDataFormat(data.data,typeId);
             var legendName='单载波电费(元)';
             var yLabelFor='(元)'
             DrawChart("stationEPChart",dataObj,'单载波电费情况报表',legendName,yLabelFor);
           // DrawChart("scECStasticChart",dataObj,'单载波电费情况报表','单载波电费(元)');*/
            /*typeId="scaleECStastic";
            dataObj=chartDataFormat(data.data,typeId);
            DrawChartScaleECStastic("scaleECStasticChart",dataObj,'电费占收比、占支比报表');*/
           /* typeId="stationECStastic";
            dataObj=chartDataFormat(data.data,typeId);
            DrawChartStationECStastic("stationECStasticChart",dataObj,'电费情况');*/
            /*typeId='stationDetailEP';
            dataObj=chartDataFormat(data.data,typeId);
            DrawChartStationDetailEP("stationDetailEPChart",dataObj,'直供电、转供电用电量情况');*/
            typeId='stationEP';
            dataObj=chartDataFormat(data.data,typeId);
            var legendName='电量(万度)';
            var yLabelFor='(万度)'
            DrawChart("stationEPChart",dataObj,'用电量情况',legendName,yLabelFor);
        }else{
            alert("error"+data.message);
        }
    }).fail(function(err) {
        console.log("数据获取失败");
    });
}
function chartDataFormat(data,typeId){
    var dataObj={
        xAxisData:[],
        seriesData:[]  //单载波
    }
    if(typeId=="scaleECStastic") {
        //电费占收比、占支比报表,有两条series数据
        dataObj.seriesData = {
            income: [],
            expenditure: []
        };
        for (var i = 0; i < data.length; i++) {
            dataObj.xAxisData.push(data[i].cityName || '');
            dataObj.seriesData.income.push(data[i].cityData.income || '');
            dataObj.seriesData.expenditure.push(data[i].cityData.expenditure || '');
        }
    } else if(typeId=='scECStastic'){
        //单载波
        for (var i = 0; i < data.length; i++) {
            dataObj.xAxisData.push(data[i].cityName||'');
            dataObj.seriesData.push(data[i].cityData.SCEC||'');
        }
    }else if(typeId=="stationECStastic"){
         //电费情况
        dataObj.seriesData = {
            preYear: [],
            currentYear: [],
            add:[],
            addScale:[]
        };
        for (var i = 0; i < data.length; i++) {
            dataObj.xAxisData.push(data[i].cityName||'');
            dataObj.seriesData.preYear.push(data[i].cityData.preYear||'');
            dataObj.seriesData.currentYear.push(data[i].cityData.currentYear||'');
            dataObj.seriesData.add.push(data[i].cityData.add||'');
            dataObj.seriesData.addScale.push(data[i].cityData.addScale||'');
        }
    }else if(typeId=='stationEP'){
        //用电量情况
        for (var i = 0; i < data.length; i++) {
            dataObj.xAxisData.push(data[i].cityName||'');
            dataObj.seriesData.push(data[i].cityData.power||'');
        }
    }else if(typeId=="stationDetailEP"){
        //直供电，转供电用电量情况
        dataObj.seriesData = {
            Direct: [],
            Rotary: [],
            RotaryScale:[]
        };
        for (var i = 0; i < data.length; i++) {
            dataObj.xAxisData.push(data[i].cityName||'');
            dataObj.seriesData.Direct.push(data[i].cityData.Direct||'');
            dataObj.seriesData.Rotary.push(data[i].cityData.Rotary||'');
            dataObj.seriesData.RotaryScale.push(data[i].cityData.RotaryScale||'');
        }
    }
    return dataObj;
}
//电费占收比、占支比报表
function DrawChartScaleECStastic(chartId,dataObj,textVal){
    var myChart = echarts.init(document.getElementById(chartId));
    option = {
        title: {
            text: textVal
        },
        tooltip: {
            trigger: 'axis'
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
            data: []
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
                data:[],
                //data:[11, 11, 15, 13, 12, 13, 10],
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'占支比',
                type:'line',
                data:[],
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    option.xAxis.data=dataObj.xAxisData;
    option.series[0].data=dataObj.seriesData.income;
    option.series[1].data=dataObj.seriesData.expenditure;
    myChart.setOption(option);
}
//电费情况
function DrawChartStationECStastic(chartId,dataObj,textVal){
    var myChart = echarts.init(document.getElementById(chartId));
    var option = {
        title:{text:textVal},
        legend: {
            data:['2015年(万元)','2016年(万元)','2015年-2016年增幅(万元)','2015年-2016年增幅(%)']
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data:[],
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
                name:'2015年(万元)',
                type:'bar',
                data:[]
            },{
                name:'2016年(万元)',
                type:'bar',
                data:[]
            },{
                name:'2015年-2016年增幅(万元)',
                type:'bar',
                data:[]
            },{
                name:'2015年-2016年增幅(%)',
                type:'line',
                yAxisIndex: 1,
                data:[]
            }
        ]
    };
    option.xAxis[0].data=dataObj.xAxisData;
    option.series[0].data=dataObj.seriesData.preYear;
    option.series[1].data=dataObj.seriesData.currentYear;
    option.series[2].data=dataObj.seriesData.add;
    option.series[3].data=dataObj.seriesData.addScale;
    myChart.setOption(option);
}
//直供电，转供电用电量情况
function DrawChartStationDetailEP(chartId,dataObj,textVal){
    var myChart = echarts.init(document.getElementById(chartId));
    var option = {
        title:{text:textVal},
        legend: {
            data:['直供电电量(万度)','转供电电量(万度)','转供电比例(%)']
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data:[],
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
                data:[]
            }, {
                name: '转供电电量(万度)',
                type: 'bar',
                data: []
            },{
                name:'转供电比例(%)',
                type:'line',
                yAxisIndex: 1,
                data:[]
            }
        ]
    };
    option.xAxis[0].data=dataObj.xAxisData;
    option.series[0].data=dataObj.seriesData.Direct;
    option.series[1].data=dataObj.seriesData.Rotary;
    option.series[2].data=dataObj.seriesData.RotaryScale;
    myChart.setOption(option);
}
//单载波  +  用电量情况
function DrawChart(chartId,dataObj,textVal,legendName,yLabelFor){
    var myChart = echarts.init(document.getElementById(chartId));
    var option = {
        title:{text:textVal},
        color: ['#3398DB'],
        legend: {
            data:[{
                name:legendName,//'单载波电费'
            }]
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data:[],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel: {
                    formatter: '{value}'+yLabelFor
                }
            }
        ],
        series : [
            {
                name:legendName,
                type:'bar',
                barWidth: '60%',
                data:[],
                markLine:{
                    data:[{
                        type:'average',name:'平均值'
                    }]
                }
            }
        ]
    };
    option.xAxis[0].data=dataObj.xAxisData;
    option.series[0].data=dataObj.seriesData;
    myChart.setOption(option);
}



/*function addFilterOpt() {
    var cityArr = [{ 'id': '0', 'value': '成都' },
        { 'id': '1', 'value': '绵阳' }, { 'id': '2', 'value': '泸州' }, { 'id': '3', 'value': '乐山' }, { 'id': '4', 'value': '雅安' }
    ];
    var areaArr = [{ 'id': '00', 'value': '白羊' },
        { 'id': '01', 'value': '武侯' }
    ];
    var reportTypeArr = [{ 'id': '0', 'value': '类型1' },
        { 'id': '1', 'value': '类型2' }
    ]
    for (var i = 0; i < cityArr.length; i++) {
        $("#city").append("<option value='" + cityArr[i].id + "'>" + cityArr[i].value + "</option>");
    }
    for (var i = 0; i < areaArr.length; i++) {
        $("#area").append("<option value='" + areaArr[i].id + "'>" + areaArr[i].value + "</option>");
    }

}

function creatChart() {
    // var chartDom = $('#main');
    // var myChart = echarts.init(chartDom);
    // var app.title = '堆叠条形图';
    var myChart = echarts.init(document.getElementById('main'));
    console.log(111)
    console.log(myChart);
    var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
    myChart.setOption('option');
}*/
