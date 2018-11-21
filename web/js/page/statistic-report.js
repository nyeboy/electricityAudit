MENU.addItem([{
    value: "统计报表",
    id: "dataCarts",
    icon: "img/table_icon.png",
    childBoxStyle:"background-color:#fff",
    allowRole:["province","city"],//province（省）/city（市）/manager（经办人）
    child: [{
        value: "统计报表",
        id: "dataCart_1",
        clickFun: function(contentBox, routerBox) {
            fullDataChart.apply(this, arguments);
        }
    }]
}]);
/*tab页签的值，根据bootstrap的tab结构定义name和id
* id：页签的id。当创建其图表容器时，会以id+"Chart"作为图表容器的id，如：Chart
* */
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
                    id: ''
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
    /*下部Dom的数据，330版本暂时前台定义桩数据，后期需要从与后台真正交互*/
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
    /*
    * 将界面分解为上中下三部分，创建上部dom
    */
    function createTop(){
        var cityArr=[];
        cityArr=getCityList();
        var cityDom='',disable;
        for(var i=0;i<cityArr.length;i++){
            if(cityArr[i].value=='成都'){
                disable='';
                cityArr[i].key=1;
            }else{
                disable='disabled="disabled"';
            }
            cityDom+='<option '+disable + ' value='+cityArr[i].key+'>'+cityArr[i].value+'</option>';
        }
        var topFilterDom=creatDom("div",{class:'top-filter'},null,'<div class="col-xs-3">'+
            '<select name="province" class="form-control" id="province">'+
            '<option>四川省</option></select></div>'+
            '<div class="col-xs-3">'+
            '<select name="city" class="form-control" id="city">'+
            '<option value="0">==全市==</option>'+cityDom+'</select></div>'+
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
    /*填充DOM：按照topDOM-->middleDom-->bottomDom顺序*/
    var startTopDom=creatDom("div",{id:'statistic-report'},null,createTop());//append('<div id="statistic-report"></div>');
    $("#contentBox").append(startTopDom);
    $('#queryBtn').click(function(){
        var params={
            citySelected:$('#city').val(),//城市
            reportTypeSelected:$('#reportType').val()//管理类型
        }
        var tab=tabArrFun(params.reportTypeSelected);
        createContent(tab);
        $(".middle-chart").remove();
        $(".bottom-total ").remove();
        $('#statistic-report').append(createContent(tab));//默认显示电费管理的tab
        $('#statistic-report').append(createBottom(bottomData));
        ajaxFun(params);
    });
    $('#queryBtn').click();
    // 城市列表获取
    function getCityList(){
        var urlVal=Interface.get("DS","getCity");
        var cityArr=[];
        $.ajax({
                url:urlVal,
                type:'get',
                async:false,
                dataType:'json'
            }
        ).done(function(data){
                if(data.code==200){
                    for(var i=0;i<data.data.length;i++){
                        cityArr.push(data.data[i]);
                    }
                    console.log(cityArr);
                }else{
                    console.log('城市列表获取失败');
                }
            }).fail(function(){
            });
        return cityArr;
    }
    function ajaxFun(params){
        //根据查询参数选择调用对应接口
        //typeId是各个tab页签下的dom节点ID，即要绘制的图的id
        var urlVal='',typeId='';
        switch (params.reportTypeSelected){
            case 'eleFeeMgmt':
                //urlVal=Interface.get('Audit','eleFeeMgmt');//电费统计管理
                urlVal= 'http://localhost:8080/audit/electricCharge/stationECStastic.do';//电费情况
                //urlVal='testJson/stationECStastic.json';
                typeId="stationECStastic";
                ajaxReq(urlVal,typeId);
                urlVal='http://localhost:8080/audit/electricCharge/scaleECStastic.do';//电费占收比、占支比报表？
                //urlVal='testJson/scaleECStastic.json';
                typeId="scaleECStastic";
                ajaxReq(urlVal,typeId);
                urlVal='http://localhost:8080/audit/electricCharge/scECStastic.do';//单载波电费
                //urlVal='testJson/scECStastic.json';
                typeId="scECStastic";
                ajaxReq(urlVal,typeId);
                break;
            case 'eleQuantityMgmt':
                //urlVal=Interface.get('Audit','eleQuantityMgmt');//电量统计管理
                urlVal='http://localhost:8080/audit/electricPower/stationEPStastic.do';//用电量情况
                typeId="stationEPStastic";
                ajaxReq(urlVal,typeId);
                urlVal='http://localhost:8080/audit/electricPower/stationDetailEPStastic.do';//直供电、转供电用电量情况
                typeId="stationDetailEPStastic";
                ajaxReq(urlVal,typeId);
                break;
            case 'priceMgmt':
                urlVal=Interface.get('Audit','priceMgmt');//单价统计管理
                typeId='';
                ajaxReq(urlVal,typeId);
                break;
            case 'auditMgmt':
                urlVal=Interface.get('Audit','superPowerRatingCount');//稽核统计管理--超额定功率标杆值情况
                typeId='superPowerRatingCount';
                ajaxReq(urlVal,typeId);
                urlVal=Interface.get('Audit','superSmartMeter');//稽核统计管理--超智能电表标杆值、超开关电源标杆值情况统计报表
                typeId='superSmartMeterCount';
                ajaxReq(urlVal,typeId);
                break;
            case 'indexMgmt':
                urlVal=Interface.get('Audit','availability');//指标统计管理--智能电表接入率、可用率
                typeId='smartMeterOfAvailability';
                ajaxReq(urlVal,typeId);
                urlVal=Interface.get('Audit','consistency');//指标统计管理--资管、财务系统基站名称一致性
                typeId='financialSystemConsistency';
                ajaxReq(urlVal,typeId);
                urlVal=Interface.get('Audit','sitePower');//指标统计管理--站点开关电源监控完好率、可用率
                typeId='provinceSitePower';
                ajaxReq(urlVal,typeId);
                break;
        }
        function ajaxReq(urlVal,typeId){
            $.ajax({
                url: urlVal,
                type:'get',
                data:{
                    typeCode:params.citySelected
                },
                dataType:'json'
            }).done(function(data){
                if(data.code==200){
                    //获取值后，分类：根据调用接口对应的tab填放数据（因后台所有接口暂时独立，一图一接口方式）
                    var legendArr=[];
                    //暂无数据
                    if(data.data.length==0){
                        addNoDataDom(typeId);
                    }else{
                        switch (typeId){
                            //电费统计管理大类下
                            case 'stationECStastic':
                                dataObj=chartDataFormat(data.data,typeId);
                                DrawChartStationECStastic("stationECStasticChart",dataObj,'电费情况');
                                break;
                            case 'scaleECStastic':
                                dataObj=chartDataFormat(data.data,typeId);
                                DrawChartScaleECStastic("scaleECStasticChart",dataObj,'电费占收比、占支比报表');
                                break;
                            case 'scECStastic':
                                dataObj=chartDataFormat(data.data,typeId);
                                var legendName='单载波电费(元)';
                                var yLabelFor='(元)';
                                DrawChart("scECStasticChart",dataObj,'单载波电费情况报表',legendName,yLabelFor);
                                break;
                            //电量管理大类
                            case 'stationEPStastic':
                                typeId='stationEP';
                                dataObj=chartDataFormat(data.data,typeId);
                                var legendName='电量(万度)';
                                var yLabelFor='(万度)';
                                DrawChart("stationEPChart",dataObj,'用电量情况',legendName,yLabelFor);
                                break;
                            case 'stationDetailEPStastic':
                                typeId='stationDetailEP';
                                dataObj=chartDataFormat(data.data,typeId);
                                DrawChartStationDetailEP("stationDetailEPChart",dataObj,'直供电、转供电用电量情况');
                                break;
                            //单价管理大类
                            case '':
                                legendArr=[{
                                    name:'>1.3元占比',
                                    value:'proportion1',
                                    type:'bar'
                                },{
                                    name:'1-1.3元占比',
                                    value:'proportion2',
                                    type:'bar'
                                },{
                                    name:'<1元占比',
                                    value:'proportion3',
                                    type:'bar'
                                }];
                                chartId=typeId+'Chart';
                                ChartFun(data.data,legendArr,'电费单价占比情况',chartId)();
                                break;
                            case 'superPowerRatingCount':
                                legendArr=[{
                                    name:'超额定功率占比',
                                    value:'proportion',
                                    type:'line'
                                }];
                                chartId=typeId+'Chart';
                                ChartFun(data.data,legendArr,'超额定功率标杆值情况',chartId)();
                                break;
                            case 'superSmartMeterCount':
                                legendArr=[{
                                    name:'超智能电表超标比例',
                                    value:'proportion1',
                                    type:'line'
                                },{
                                    name:'开关电源超标比例',
                                    value:'proportion2',
                                    type:'line'
                                }];
                                chartId=typeId+'Chart';
                                ChartFun(data.data,legendArr,'超智能电表标杆值、超开关电源标杆值情况',chartId)();
                                chartUnitPrice(chartId);
                                break;
                            //指标统计大类
                            case 'financialSystemConsistency':
                                legendArr=[{
                                    name:'财务系统站点数 ',
                                    value:'site',
                                    type:'bar'
                                },{
                                    name:'匹配成功资管数据',
                                    value:'successData',
                                    type:'bar'
                                },{
                                    name:'匹配成功率',
                                    value:'successRate',
                                    type:'line'
                                }];
                                chartId=typeId+'Chart';
                                ChartFun(data.data,legendArr,'资管、财务系统基站名称一致性',chartId)();
                                break;
                            case 'smartMeterOfAvailability':
                                legendArr=[{
                                    name:'智能电表接入率',
                                    value:'accessRate',
                                    type:'line'
                                },{
                                    name:'智能电表可用率',
                                    value:'availableRate',
                                    type:'line'
                                }];
                                chartId=typeId+'Chart';
                                ChartFun(data.data,legendArr,'智能电表接入率、可用率',chartId)();
                                break;
                            case 'provinceSitePower':
                                legendArr=[{
                                    name:'动环网管现有站点数',
                                    value:'site',
                                    type:'bar'
                                },{
                                    name:'开关电源监控完好率',
                                    value:'availability',
                                    type:'line'
                                },{
                                    name:'开关电源可用率',
                                    value:'availableRate',
                                    type:'line'
                                }];
                                chartId=typeId+'Chart';
                                ChartFun(data.data,legendArr,'开关电源监控完好率、可用率',chartId)();
                                break;
                        }
                    }
                }
            }).fail(function(err) {
                console.log("er:数据获取失败");
            });
        }
    }
}
/*-------------------------------绘图模板，包括：电费单价占比情况-------------------*/
function ChartFun(data,legendArr,title,chartId){
    //数据组装
    var dataFormat=function(){
        var dataObj={
            titleData:title,
            legendData:[],
            xAxisData:[],
            seriesData:[]
        }
        var value,obj;
        //x轴赋值[]格式
        for (var j = 0; j < data.length; j++) {
            if(chartId=='smartMeterOfAvailabilityChart'||chartId=='financialSystemConsistencyChart'||chartId=='provinceSitePowerChart'){
                dataObj.xAxisData.push(data[j].city||'');
            }else{
                dataObj.xAxisData.push(data[j].cityName || '');
            }
        }
        //y轴赋值  legendArr：数据系列[]格式
        for(var i=0;i<legendArr.length;i++){
            value=legendArr[i].value;
            dataObj.legendData.push(legendArr[i].name);
            obj={
                name:legendArr[i].name,
                type:legendArr[i].type,
                data:[]
            }
            //堆积图
            if(chartId=='Chart'){
                obj.stack='总量';
            }
            if(chartId=='financialSystemConsistencyChart'&&i==2) {
                obj.yAxisIndex=1;
                obj.markLine={
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }
            if(chartId=='provinceSitePowerChart'&&i!==0) {
                obj.yAxisIndex=1;
            }
            for (var j = 0; j < data.length; j++) {
                obj.data.push(data[j][value]||0);//y轴p1值填充
            }
            dataObj.seriesData.push(obj);
        }
        return dataObj;
    };
    //基础配置
    var basicOption=function(){
        var dom = document.getElementById(chartId);
        var container = document.getElementById("systemContent");
        function resizedom () {
            dom.style.width = (container.clientWidth-40)+'px';
        };
        resizedom(); 
        var option = {
            title:{text:'',top:'3%',left: 'center'},
            legend: {
                orient: 'horizontal',
                padding:[30,0,10,0],
                top:'8%',
                x: 'center',
                //orient: 'horizontal',
                //padding:[30,0,10,0],
                //top:10,
                data:[],
                width: dom.style.width
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                left: 'right',
                padding:[22,22,0,0],
                feature: {
                    //dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '6%',
                top:'20%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data:[],
                    axisTick: {
                        // interval: 0,
                        alignWithLabel: true
                    },
                    axisLabel:{  
                         interval:0,//横轴信息全部显示  
                         rotate: 45,//-30度角倾斜显示
                         textStyle: {
                            fontSize: '12'
                         }  
                    }  
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }
            ],
            series : [],
            color: [   //堆积图颜色配置
                    '#fda638',
                    '#9dcc6b',
                    '#558edc',
                ]
        };
        return option;
    }
    //绘制开始
    var startDraw=function(){
        var dom = document.getElementById(chartId);
        var container = document.getElementById("systemContent");
        function resizedom () {
            dom.style.width = (container.clientWidth-40)+'px';
        };
        resizedom(); 
        var myChart = echarts.init(dom);
        var myOption=basicOption();
        var chartData=dataFormat();
        myOption.title.text =chartData.titleData;
        myOption.legend.data =chartData.legendData;
        myOption.xAxis[0].data =chartData.xAxisData;
        myOption.series=chartData.seriesData;
        if(chartId=="financialSystemConsistencyChart"||chartId=="provinceSitePowerChart"){
            myOption.yAxis[0].axisLabel.formatter='{value}';
        }
        myChart.setOption(myOption);
        window.onresize = function(){
            resizedom(); 
            myChart.resize();
        }
    }
    chartUnitPrice=function(){
        var dom = document.getElementById(chartId);
        var container = document.getElementById("systemContent");
        function resizedom () {
            dom.style.width = (container.clientWidth-40)+'px';
        };
        resizedom(); 
        var myChart = echarts.init(dom);
        option = {
            title: {
                text: title,
                left: 'center',
                padding:[0,0,100,0]
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                orient: 'horizontal',
                padding:[30,0,10,0],
                top:10,
                data:['占收比','占支比'],
                x: 'center',
                width: dom.style.width
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    //dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: [1, 2, 5, 3, 2, 3, 0],
                axisLabel:{  
                     interval:0,//横轴信息全部显示  
                     rotate: 45,//-30度角倾斜显示
                     textStyle: {
                        fontSize: '12'
                     }  
                }  
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
                    //data:[],
                    data:[11, 11, 15, 13, 12, 13, 10],
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    },
                    itemStyle:{  
                        normal:{color:'#558edc'}  
                    } 
                },
                {
                    name:'占支比',
                    type:'line',
                    //data:[],
                    data:[110, 11, 15, 13, 12, 13, 100],
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    },
                    itemStyle:{  
                        normal:{color:'#9dcc6b'}  
                    } 
                }
            ]
        };
        myChart.setOption(option);
        window.onresize = function(){
            resizedom(); 
            myChart.resize();
        }
    }
    return startDraw;
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
    var dom = document.getElementById(chartId);
    var container = document.getElementById("systemContent");
    function resizedom () {
        dom.style.width = (container.clientWidth-40)+'px';
    };
    resizedom(); 
    var myChart = echarts.init(dom);
    var option = {
        title: {
            text: textVal,
            left: 'center',
            top:'3%'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            orient: 'horizontal',
            padding:[30,0,10,0],
            top:'8%',
            data:['占收比','占支比'],
            x: 'center',
            width: dom.style.width
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
                //dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        grid: {
            left: '2%',
            right: '5%',
            bottom: '6%',
            top:'20%',
            containLabel: true
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{  
                 interval:0,//横轴信息全部显示  
                 rotate: 45,//-30度角倾斜显示
                 textStyle: {
                    fontSize: '12'
                 }  
            }  
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
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },
                itemStyle:{  
                    normal:{color:'#558edc'}  
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
                },
                itemStyle:{  
                    normal:{color:'#9dcc6b'}  
                } 
            }
        ]
    };
    option.xAxis.data=dataObj.xAxisData;
    option.series[0].data=dataObj.seriesData.income;
    option.series[1].data=dataObj.seriesData.expenditure;
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        resizedom();
        myChart.resize();
    });
}
//电费情况
function DrawChartStationECStastic(chartId,dataObj,textVal){
    var dom = document.getElementById(chartId);
    var container = document.getElementById("systemContent");
    function resizedom () {
        dom.style.width = (container.clientWidth-40)+'px';
    };
    resizedom(); 
    var myChart = echarts.init(dom);
    var option = {
                    title:{
                        text:textVal,
                        left: 'center',
                        top:'3%',
                    },
                    legend: {
                        orient: 'horizontal',
                        padding:[30,0,10,0],
                        top:'8%',
                        data:['2015年(万元)','2016年(万元)','2015年-2016年增幅(万元)','2015年-2016年增幅(%)'],
                        x:'center',
                        width: dom.style.width
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
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
                           // dataView: {readOnly: false},
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '6%',
                        top:'20%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data:[],
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel:{  
                                 interval:0,//横轴信息全部显示  
                                 rotate: 45,//-30度角倾斜显示
                                 textStyle: {
                                    fontSize: '12'
                                 }  
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
                name:'2015年(万元)',
                type:'bar',
                data:[],
                itemStyle:{  
                    normal:{color:'#558edc'}  
                } 
            },{
                name:'2016年(万元)',
                type:'bar',
                data:[],
                itemStyle:{  
                    normal:{color:'#9dcc6b'}  
                } 
            },{
                name:'2015年-2016年增幅(万元)',
                type:'bar',
                data:[],
                itemStyle:{  
                    normal:{color:'#fda638'}  
                } 
            },{
                name:'2015年-2016年增幅(%)',
                type:'line',
                yAxisIndex: 1,
                data:[],
                itemStyle:{  
                    normal:{color:'#ed6b6f'}  
                } 
            }
        ]
    };
    option.xAxis[0].data=dataObj.xAxisData;
    option.series[0].data=dataObj.seriesData.preYear;
    option.series[1].data=dataObj.seriesData.currentYear;
    option.series[2].data=dataObj.seriesData.add;
    option.series[3].data=dataObj.seriesData.addScale;
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        resizedom(); 
        myChart.resize();
    });
}
//直供电，转供电用电量情况
function DrawChartStationDetailEP(chartId,dataObj,textVal){
    var dom = document.getElementById(chartId);
    var container = document.getElementById("systemContent");
    function resizedom () {
        dom.style.width = (container.clientWidth-40)+'px';
    };
    resizedom(); 
    var myChart = echarts.init(dom);
    var option = {
        title:{text:textVal,top:'3%',left: 'center'},
        legend: {
            orient: 'horizontal',
            padding:[30,0,10,0],
            top:'8%',
            data:['直供电电量(万度)','转供电电量(万度)','转供电比例(%)'],
            x: 'center',
            width: dom.style.width
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
            bottom: '6%',
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
               // dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis : [
            {
                type : 'category',
                data:[],
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel:{  
                     interval:0,//横轴信息全部显示  
                     rotate: 45,//-30度角倾斜显示
                     textStyle: {
                        fontSize: '12'
                     }  
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
                data:[],
                itemStyle:{  
                    normal:{color:'#558edc'}  
                } 
            }, {
                name: '转供电电量(万度)',
                type: 'bar',
                data: [],
                itemStyle:{  
                    normal:{color:'#9dcc6b'}  
                } 
            },{
                name:'转供电比例(%)',
                type:'line',
                yAxisIndex: 1,
                data:[],
                itemStyle:{  
                    normal:{color:'#ed6b6f'}  
                } 
            }
        ]
    };
    option.xAxis[0].data=dataObj.xAxisData;
    option.series[0].data=dataObj.seriesData.Direct;
    option.series[1].data=dataObj.seriesData.Rotary;
    option.series[2].data=dataObj.seriesData.RotaryScale;
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        resizedom(); 
        myChart.resize();
    });
}
//单载波  +  用电量情况
function DrawChart(chartId,dataObj,textVal,legendName,yLabelFor){
    var dom = document.getElementById(chartId);
    var container = document.getElementById("systemContent");
    function resizedom () {
        dom.style.width = (container.clientWidth-40)+'px';
    };
    resizedom(); 
    var myChart = echarts.init(dom);
    var option = {
        title:{text:textVal,top:'3%',left: 'center'},
        color: ['#3398DB'],
        legend: {
            data:[{
                name:legendName,//'单载波电费'
            }],
            orient: 'horizontal',
            padding:[30,0,10,0],
            top:'8%',
            x: 'center',
            width: dom.style.width
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '2%',
            right: '6%',
            bottom: '6%',
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
               // dataView: {readOnly: false,show:false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis : [
            {
                type : 'category',
                data:[],
                // axisLabel:{rotate:45},//x-label 倾斜
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel:{  
                     interval:0,//横轴信息全部显示  
                     rotate: 45,//-30度角倾斜显示
                     textStyle: {
                        fontSize: '12'
                     }  
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
                },
                itemStyle:{  
                    normal:{color:'#558edc'}  
                } 
            }
        ]
    };
    option.xAxis[0].data=dataObj.xAxisData;
    option.series[0].data=dataObj.seriesData;
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        resizedom(); 
        myChart.resize();
    });
}
// 数据图初始
function createContent(tabArr){
    var status;
    var typeTabDom;
    var chartId;
    var typeContentDom;
    var contentDom;
    var tabDom='';
    var tabContentDom='';
    for(var i=0;i<tabArr.length;i++){
        status=(i==0)?"active":"";
        tabDom+='<li class="'+status+'"><a href="#'+tabArr[i].id+'" data-toggle="tab">'+tabArr[i].name+'</a></li>';
    }
    typeTabDom='<ul id="typeTab" class="nav nav-tabs">'+tabDom+'</ul>';
    for(var i=0;i<tabArr.length;i++) {
        status=(i==0)?"fade in active":"";
        chartId=tabArr[i].id+'Chart';
        if(tabArr[i].id=='targetSystem'){
            tabContentDom+='<div class="tab-pane '+status+'" id="'+tabArr[i].id+'">' +
                '<div id="'+chartId+'" class="pull-left" style="width:79%; height: 506px;">' +
                '</div>' +
                '<div id="rankList" class="pull-left" style="width: 215px; height: 440px;">' +
                '</div>'+
                '</div>';
        }else{
        tabContentDom+='<div class="tab-pane '+status+'" id="'+tabArr[i].id+'"><div id="'+chartId+'" style="width:100%; height: 506px;"></div></div>';
        }
    }
    typeContentDom='<div id="typeContent" class="tab-content">'+tabContentDom+'</div>';
    contentDom=creatDom("div",{class:'middle-chart'},null,typeTabDom+typeContentDom);
    return contentDom;
}
// 底部数据图
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
/*暂无数据Dom
* typeId:每个tab页签的id
*/
function addNoDataDom(typeId){
    $('#'+typeId).empty('');
    var dom= '<div class="nodata-box">' +
        '<img src="img/nodata_icon.png">' +
        '<div>暂无数据</div></div>';
    $('#'+typeId).append(dom);
}