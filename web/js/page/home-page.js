/**
 * Created by Administrator on 2017/3/15.
 */

var homePage={
    _this:'',
    typeId:'targetSystem',
    chartId:'targetSystemChart',
    roleType:2,//角色类型：0省 1市 2普经办
    urlVal:'',
    data:{},
    chartTitle:'',
    title:'四川评优指标体系',
    chartDataObj:{},//图表数据：是data经加工后形成，可push给图表生成图表。
    legendArr:[],//系列名称和后台对应表
    tabArrFun:function(){
        var tabArr=[];
        if(_this.roleType==0) {
            tabArr = [{
                name: '评优指标体系(月)',
                id: 'targetSystem'
            }, {
                name: '全省电费情况',
                id: 'stationECStastic'
            }, {
                name: '全省电费占收比、占支比',
                id: 'scaleECStastic'
            }, {
                name: '全省单载波电费情况',
                id: 'scECStastic'
            }, {
                name: '全省直供电、转供电用电量情况',
                id: 'stationDetailEP'
            }, {
                name: '全省电费单价占比情况',
                id: 'UnitPriceProportion'
            }];
        }else if(_this.roleType==1){
            tabArr = [{
                name: '评优指标体系(月)',
                id: 'targetSystem'
            }, {
                name: '全市电费情况',
                id: 'stationECStastic'
            }, {
                name: '全市电费占收比、占支比',
                id: 'scaleECStastic'
            }, {
                name: '全市单载波电费情况',
                id: 'scECStastic'
            }, {
                name: '全市直供电、转供电用电量情况',
                id: 'stationDetailEP'
            }, {
                name: '全市电费单价占比情况',
                id: 'UnitPriceProportion'
            }];
        }
        return tabArr;
    },
    bottomDataFun:function(){
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
                value:'3.54亿度'
            },{
                name:'2016年电量',
                value:'1.05亿度'
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
         return bottomData;
    },
    initDom:function(){
         _this=this;
         //0省   1市   2普通经办人
         _this.roleType=userSetObj.judgeUser(getUserData()).userLevel;
         //_this.roleType=(getUserData().userLevel===0)?1:0;
         $("#userName").text(getUserData().userName||'');
         $("#userMobile").text(getUserData().mobile||'');
         $("#userArea").text(getUserData().cityStr+getUserData().countyStr||'');
         $('.middle-chart').remove();
         $('.bottom-total').remove();
         if(_this.roleType==0){
             $('.top-message').remove();
         }
         if(_this.roleType==1){
            $('.detail').each(function(index,element){
                 $(this).html('<div class="text-center">待审批<span class="circle">0</span></div>');
            });
            $(".circle").eq(0).html("9").parent().addClass("audit-pedding").attr('id',"reviewContent");    // 330假数据
            $(".circle").eq(1).html("8").parent().addClass("audit-pedding").attr('id',"reviewC");    // 330假数据
            getID("reviewContent")&&getID("reviewContent").addEventListener("click",function(e) {
               MENU.getItem("auditTariff").click();
            });
            getID("reviewC")&&getID("reviewC").addEventListener("click",function(e) {
               MENU.getItem("auditTariff").click();
               console.log("a");
            });
         }
         if(_this.roleType!==2){
             $('.manager-pie').remove();
             $('#home-page').append(createContent(_this.tabArrFun()));//默认显示电费管理的tab
             $('#home-page').append(createBottom(_this.bottomDataFun()));
         }
         //地图数据系列
         _this.legendArr=[{
             name:'综合排名',
             value:'comprehensiveRank'
         },{
             name:'单载波电费',
             value:'SCEC'
         },{
             name:'占收比',
             value:'income'
         },{
             name:'占支比',
             value:'expenditure'
         },{
             name:'转供电比例',
             value:'RotaryScale'
         },{
             name:'超额定功率标杆比例',
             value:'proportion'
         },{
             name:'开关电源可用率',
             value:'proportion1'
         },{
             name:'智能电表可用率',
             value:'proportion2'
         },{
             name:'资材一致性',
             value:'successRate'
         },{
             name:'信息反馈、质量',
             value:'feedback'
         }];
         if(_this.roleType!==2){
             _this.ajaxGetWhichFun();
         }
    },
    ajaxGetWhichFun:function(){
        _this.typeId='targetSystem';
        _this.urlVal=Interface.get('Audit','detail');
        _this.getAjaxFun();//地图

        _this.typeId='stationECStastic';
        _this.urlVal=Interface.get('Audit',_this.typeId);//电费统计管理--电费情况
        _this.getAjaxFun();

        _this.typeId='scaleECStastic';
        _this.urlVal=Interface.get('Audit',_this.typeId);//电费统计管理--电费占收比、占支比
        _this.getAjaxFun();

        _this.typeId='scECStastic';
        _this.urlVal=Interface.get('Audit',_this.typeId);//电费统计管理--单载波电费
        _this.getAjaxFun();

        _this.typeId='UnitPriceProportion';
        _this.urlVal=Interface.get('Audit','priceMgmt');//电费统计管理--电费单价占比情况
        _this.getAjaxFun();

        _this.typeId='stationDetailEP';
        _this.urlVal=Interface.get('Audit',_this.typeId);//电费统计管理--直供电、转供电用电量情况
        _this.getAjaxFun();
    },
    chartDataFormatFun:function(){
        //地图统一配置基本样式
        var mapItemStyle={
                normal: {
                    borderWidth:.5,//各区域边框宽度
                    borderColor: '#0d4566',//区域描线颜色 #000  #0d4566 #3681af
                    areaColor:"#4599cc",//单位区域颜色
                    label:{show:true},
                    //color:'',//'#ee5d59',//系列色
                    // shadowColor: 'inset rgba(0, 0, 0, 0.5)',//地图阴影
                    // shadowBlur: 10//地图阴影大小
                },
                emphasis: {
                    //borderWidth: .5,
                    //borderColor: '#4b0082',
                    areaColor:"#64c1fa",//"#fe5e80",//单位区域:hover颜色
                    label:{show:true},
                    color:'#4b0082',
                    shadowColor: 'rgba(0, 0, 0, 0.5)',//地图阴影
                    shadowBlur: 10//地图阴影大小
                }
            };
        var maplabel={
            emphasis:{
                textStyle:{
                    color:'#fff',
                    fontWeight:600
                }
            }
        };
        if(this.roleType==0){
            //全省
            var data=_this.data;
            var legendArr=_this.legendArr;
            var dataObj = {
                titleData: _this.title,
                legendData: [],
                seriesData: []
            };
            var seriesObj,value,obj={};
            //y轴赋值  legendArr：数据系列[]格式
            for(var i=0;i<legendArr.length;i++){
                value=legendArr[i].value;
                dataObj.legendData.push(legendArr[i].name);
                seriesObj={
                    name: legendArr[i].name,
                    roam:true,
                    type: 'map',
                    top:62,
                    mapType: 'sichuan', // 自定义扩展图表类型
                    itemStyle: mapItemStyle,
                    label:maplabel,
                    data:[],//[{name: '中西区', value: 20057.34}],
                    showLegendSymbol:true,
                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],
                    aspectScale:1,//拉伸比例
                        scaleLimit:{
                        min:1,
                        max:5
                    }
                }
                //后台返回数据再处理:每一个legend系列将所有data遍历，加工到seriesObj中，得到一个系列的所有series.data[]
                for (var j = 0; j < data.length; j++) {
                    //series[]中的每一个seriesObj{}的data[]下的每一个obj  格式：{name: '中西区', value: 20057.34}
                    obj={
                        name:'',
                        value:''
                    };
                    switch (data[j].cityName){
                        case '阿坝':obj.name='阿坝藏族羌族自治州';break;
                        case '甘孜':obj.name='甘孜藏族自治州';break;
                        case '凉山':obj.name='凉山彝族自治州';break;
                        default :obj.name=data[j].cityName+'市';break;
                    }
                    if(data[j].comprehensiveRank==1){
                        obj.selected=true;
                        obj.itemStyle={emphasis:{areaColor:'#fe5e80'}};
                    }
                    obj.value=data[j][value]||0;
                    seriesObj.data.push(obj);//y轴p1值填充
                }
                dataObj.seriesData.push(seriesObj);
            }
        }else if(_this.roleType==1){
            //成都市
            var data=_this.data;
            var legendArr=_this.legendArr;
            _this.title ='成都市评优指标体系';
            var dataObj = {
                titleData: _this.title,
                legendData: [],
                seriesData: []
            };
            var seriesObj,value,obj={};
            //y轴赋值  legendArr：数据系列[]格式
            for(var i=0;i<legendArr.length;i++){
                value=legendArr[i].value;
                dataObj.legendData.push(legendArr[i].name);
                seriesObj={//series[]中的每一个seriesObj{}
                    name:legendArr[i].name,
                    data:[]
                };
                seriesObj={
                    name: legendArr[i].name,
                    type: 'map',
                    mapType: 'chengdu', // 自定义扩展图表类型
                    itemStyle:mapItemStyle,
                    label:maplabel,
                    data:[],//[{name: '中西区', value: 20057.34}],
                    aspectScale:1,//拉伸比例
                    color:['#ffa726','#f2615e', '#34dbf0','#c393ff','#e4bda4', '#e1d95a','#fb81cf','#b651fd', '#cfe5ff','#a2e15a'],//系列色
                    scaleLimit:{
                        min:1,
                        max:5
                    }
                }
                //后台返回数据再处理:每一个legend系列将所有data遍历，加工到seriesObj中，得到一个系列的所有series.data[]
                for (var j = 0; j < data.length; j++) {
                    //series[]中的每一个seriesObj{}的data[]下的每一个obj  格式：{name: '中西区', value: 20057.34}
                    obj={
                        name:data[j].cityName,
                        value:data[j][value]||'--',
                    };
                    if(data[j].comprehensiveRank==1){
                        obj.selected=true;
                        obj.itemStyle={emphasis:{areaColor:'#fe5e80'}};
                    }
                    seriesObj.data.push(obj);//y轴p1值填充
                }
                dataObj.seriesData.push(seriesObj);
            }
        }
        this.chartDataObj=dataObj;
    },
    getAjaxFun:function(){
            $.ajax({
                url: _this.urlVal,
                type:'get',
                async:false,
                data:{
                    typeCode:_this.roleType
                },
                dataType:'json'
            }).done(function(data){
                    if(data.code==200) {
                        //获取值后，分类：根据调用接口对应的tab填放数据（因后台所有接口暂时独立，一图一接口方式）
                        var legendArr = [],typeId='';
                        if (data.data.length == 0) {
                            //暂无数据
                            addNoDataDom(_this.typeId);
                        }else{
                        _this.data=data.data;
                        switch(_this.typeId){
                            case 'stationECStastic':
                                dataObj=chartDataFormat(_this.data,_this.typeId);
                                DrawChartStationECStastic("stationECStasticChart",dataObj,'电费情况');
                                break;
                            case 'scaleECStastic':
                                dataObj=chartDataFormat(_this.data,_this.typeId);
                                DrawChartScaleECStastic("scaleECStasticChart",dataObj,'电费占收比、占支比报表');
                                break;
                            case 'scECStastic':
                                dataObj=chartDataFormat(_this.data,_this.typeId);
                                var legendName='单载波电费(元)';
                                var yLabelFor='(元)';
                                DrawChart("scECStasticChart",dataObj,'单载波电费情况报表',legendName,yLabelFor);
                                break;
                            case 'stationDetailEP':
                                dataObj=chartDataFormat(_this.data,_this.typeId);
                                DrawChartStationDetailEP("stationDetailEPChart",dataObj,'直供电、转供电用电量情况');
                                break;
                            case 'UnitPriceProportion':
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
                                chartId=_this.typeId+'Chart';
                                //dataObj=chartDataFormat(_this.data,_this.typeId);
                                ChartFun(_this.data,legendArr,'电费单价占比情况',chartId)();
                                break;
                            case 'targetSystem':
                                _this.rankListDomFun();//排名Dom
                                _this.chartDataFormatFun();//必须在这里执行Fun，否则会导致异步加载，Fun里的data数据未取到的问题
                                _this.chartShowWhichFun();//开始绘制charts
                                break;
                        }
                            /*_this.data=data.data;
                            _this.chartDataFormatFun();//必须在这里执行Fun，否则会导致异步加载，Fun里的data数据未取到的问题
                            _this.chartShowWhichFun();//开始绘制charts*/
                        }
                    }else{
                    }
             });
    },
    rankListDomFun:function(){
        var dom='';
        if(_this.roleType==0){
            dom='<div class="sidebar-title">全省综合排名</div>' +
                '<div class="sidebar-tree">' +
                '<ul><li><span>自贡市</span><span>1</span></li>'+
                '<li><span>马尔康市</span><span>2</span></li>'+
                '<li><span>泸州市</span><span>3</span></li>'+
                '<li><span>德阳市</span><span>4</span></li>'+
                '<li><span>绵阳市</span><span>5</span></li>'+
                '<li><span>广元市</span><span>6</span></li>'+
                '<li><span>遂宁市</span><span>7</span></li>'+
                '<li><span>内江市</span><span>8</span></li>'+
                '<li><span>乐山市</span><span>9</span></li>'+
                '<li><span>南充市</span><span>10</span></li>'+
                '</ul>' +
                '</div>';
        }else if(_this.roleType==1){
            dom='<div class="sidebar-title">全市综合排名</div>' +
                '<div class="sidebar-tree">' +
                '<ul><li><span>成华区</span><span>1</span></li>'+
                '<li><span>崇州市</span><span>2</span></li>'+
                '<li><span>大邑县</span><span>3</span></li>'+
                '<li><span>都江堰市</span><span>4</span></li>'+
                '<li><span>高新南区</span><span>5</span></li>'+
                '<li><span>高新西区</span><span>6</span></li>'+
                '<li><span>简阳市</span><span>7</span></li>'+
                '<li><span>金牛区</span><span>8</span></li>'+
                '<li><span>金堂县</span><span>9</span></li>'+
                '<li><span>锦江区</span><span>10</span></li>'+
                '</ul>' +
                '</div>';
        }
        $('#rankList').empty().append(dom);
    },
    chartShowWhichFun:function(){
        _this.mapChartFun();
        if(_this.roleType==0){
            $('#turnBack').remove();
        }
    },
    mapChartFun:function(){
         if(_this.roleType==0){
             var cityProper = {
                 '成都市': 'testJson/chengdu.json',
             }
             //省级
             // JSON。引入方式有两种：js/json，建议json方式
             $.getJSON('testJson/sichuan.json', function (data) {
                 echarts.registerMap('sichuan', data);
                 var chart = echarts.init(document.getElementById(_this.chartId));
                 var option = {
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
                         left: '5.5%',
                         top:'13%',
                         //align:'top',
                         itemGap:15,
                         selectedMode: 'single',
                         data:[]// data:['iphone3','iphone4','iphone5']
                     },
                     //visualMap: {
                     //    min: 0,
                     //    max: 2500,
                     //    left: 'left',
                     //    top: 'bottom',
                     //    text: ['高','低'],           // 文本，默认为数值文本
                     //    calculable: true,
                     //    inRange: {
                     //        color: ['#4398cc', '#4398cc']//地图默认颜色
                     //    },
                     //    //show:true
                     //},
                     toolbox: {
                         show: true,
                         orient: 'horizontal',
                         left: 'right',
                         padding:[22,22,0,0],
                         feature: {
                             //dataView: {readOnly: false},
                             restore: {show:true},
                             saveAsImage: {}
                         }
                     },
                     series: []
                 };
                 option.title.text=_this.chartDataObj.titleData;
                 option.legend.data=_this.chartDataObj.legendData;
                 option.series=_this.chartDataObj.seriesData;
                 chart.setOption(option,true);
                 chart.on("click", function(params) {
                     var city = params.name;
                     if (!cityProper[city]) {
                         option.series.splice(1);
                         option.legend = null;
                         option.visualMap = null;
                         chart.setOption(option, false);
                         return;
                     }

                     //市级
                     _this.roleType=1;
                     _this.typeId='targetSystem';
                     _this.urlVal=Interface.get('Audit','detail');
                     _this.getAjaxFun();//地图
                     //地图下钻，增加返回按钮
                         var dom='<div id="turnBack"></div>';
                         $('#turnBack').remove();
                         $('#rankList').before(dom);
                         $('#turnBack').on('click',function(){
                             _this.roleType=0;
                             _this.title='四川评优指标体系';
                             _this.typeId='targetSystem';
                             _this.urlVal=Interface.get('Audit','detail');
                             _this.getAjaxFun();//地图
                         });


                 });

             });
         }else if(_this.roleType==1){
             //市级
             $.getJSON('testJson/chengdu.json', function (data) {
                 echarts.registerMap('chengdu', data);
                 var chart = echarts.init(document.getElementById(_this.chartId));
                 chart.setOption({
                     series: [{
                         type: 'map',
                         map: 'chengdu',
                         top:62,
                         zoom:1,
                         roam:true
                     }]
                 });
                 var option = {
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
                         left: '5.5%',
                         top:'13%',
                         itemGap:15,
                         selectedMode: 'single',
                         data:[]// data:['iphone3','iphone4','iphone5']
                     },
                   /*  visualMap: {
                         min: 0,
                         max: 2500,
                         left: 'left',
                         top: 'bottom',
                         text: ['高','低'],           // 文本，默认为数值文本
                         calculable: true,
                         show:false
                     },*/
                     toolbox: {
                         show: true,
                         orient: 'horizontal',
                         left: 'right',
                         padding:[22,22,0,0],
                         feature: {
                           //  dataView: {readOnly: false},
                             restore: {show:true},//还原
                             saveAsImage: {}
                         }
                     },
                     series: []
                 };
                 option.title.text=_this.chartDataObj.titleData;
                 option.legend.data=_this.chartDataObj.legendData;
                 option.series=_this.chartDataObj.seriesData;
                 chart.setOption(option);
             });

         }
     }
}
//homePage.initDom();
