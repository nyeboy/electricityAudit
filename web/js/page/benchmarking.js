/**
 * Created by issuser on 2017/3/6.
 */
/*
var JSONArray=[
    {
        value:"",//(string必须)/菜单item显示的文字
        id:"",//(string必须)/菜单item显示的id:（注意：不是html元素的id）
        icon:"",//(url可选)/菜单的图标
        childBoxStyle:"",//(cssString可选)/子菜单容器的样式
        child:,//(array可选)/菜单的下一级子菜单
        clickFun:function(contentBox,routBox){//(function可选)/点击此菜单执行的回调函数，其中this指向其本身的DOM元素
            //contentBox:右边容器DOM对象
            //routBox:右边操作路径DOM对象
        },




    }
]
//注：依照此数据格式配置（child属性嵌套），可实现多层级树形菜单构建


//配置菜单
 MENU.addItem(JSONArray);

//获取相应菜单ID的DOM元素
 MENU.getItem(menuId)//menuId指前面配置菜单设置的id

//删除相应id菜单（此功能本项目暂时不需要，未开发完成）
 MENU.removeItem(menuId)

*/
// 配置路由
MENU.addItem([
    {
        value:"基础数据",
        id:"BasicData",
        icon:"img/data_icon.png",
        allowRole:["province","city"],//province（省）/city（市）/manager（经办人）
        child:[
            {
                value:"标杆管理",
                id:"benchmarking",
                child:[
                 //第二级菜单
                    {
                        value:"额定功率标杆",
                        id:"ratedPowerMark",
                        clickFun:function (contentBox,routBox) {
                            ratedPowerMark.init();
                            var info = document.createElement("div");
                            info.className = "right-router";
                            var infoes = "额定功率标杆 | <span>共<i class='number'></i>个</span>";
                            info.innerHTML = infoes;
                            routBox.appendChild(info);
                        }
                    },
                    {
                        value:"智能电表标杆",
                        id:"wattHourMark",
                        clickFun:function (contentBox,routBox) {
                            wattHourMark.init();
                            var info = document.createElement("div");
                            info.className = "right-router";
                            var infoes = "智能电表标杆 | <span>共<i class='number'></i>个</span>";
                            info.innerHTML = infoes;
                            routBox.appendChild(info);
                        }
                    },
                    {
                        value:"开关电源标杆",
                        id:"switchMark",
                        clickFun:function (contentBox,routBox) {
                            switchMark.init();
                            var info = document.createElement("div");
                            info.className = "right-router";
                            var infoes = "开关电源标杆 | <span>共<i class='number'></i>个</span>";
                            info.innerHTML = infoes;
                            routBox.appendChild(info);
                        }
                    }
                ]
            }
        ]
    },
]);
// 额定功率标杆
var ratedPowerMark = {
    pageOne: 1,                                   //当前显示的页数
    pagesize: 10,                                 //每页显示条数
    pageCount: "",                                //总页数
    pageAll: "",                                  //信息总条数
    currentPage: "",                              //当前设置显示行数
    setCity: false,                               //城市设置
    cityId: "",                                   //城市查询条件
    countyId: "",                                 //区县查询条件
    siteName: "",                                 //模糊查询条件
    initState: true,                              //初始渲染 
     // 初始创建页面数据
    creatMarkPage: function() {
            var html = "";
                html +=  '<div class="rate-date">';
                html +=     '<!-- title -->';
                html +=     '<div class="search-title">';
                html +=         '<div class="select-all">';
                html +=             '<select class="city" id="city">';
                html +=                 '<option>市</option>';
                html +=             '</select>'; 
                html +=             '<select class="district" id="district">';
                html +=                 '<option>区</option>';
                html +=             '</select>'; 
                html +=          '</div>';
                html +=          '<div class="select-name"><input type="text" placeholder="报账点名称"/></div>';
                html +=          '<div class="query">搜索</div>';
                html +=     '</div>';
                html +=     '<!-- 额定功率content -->';
                html +=     '<div class="basic-content">';
                html +=         '<table class="table-result" id="tableResult">';
                html +=             '<colgroup>';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:12%" />';
                html +=                 '<col style="width:10%" />';
                html +=                 '<col style="width:12%" />';
                html +=                 '<col style="width:16%" />';
                html +=                 '<col style="width:8%" />';
                html +=             '</colgroup>';
                html +=             '<thead>';
                html +=                 '<tr>';
                html +=                      '<th>序号</th>';
                html +=                      '<th>地市</th>';
                html +=                      '<th>区县</th>';
                html +=                      '<th>报账点名称</th>';
                html +=                      '<th>报账点总功率（瓦）</th>';
                html +=                      '<th>电量标杆值（度）</th>';
                html +=                      '<th>更新状态</th>';
                html +=                      '<th>更新时间</th>';
                html +=                      '<th>操作</th>';
                html +=                 '</tr>';
                html +=             '</thead>';
                html +=         '</table>';
                html +=         '<div class="tbody-box">';
                html +=         '<table class="table-result">'
                html +=             '<colgroup>';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:12%" />';
                html +=                 '<col style="width:10%" />';
                html +=                 '<col style="width:12%" />';
                html +=                 '<col style="width:16%" />';
                html +=                 '<col style="width:8%" />';
                html +=             '</colgroup>';
                html +=             '<tbody class="query-date">';
                html +=             '</tbody>';
                html +=         '</table>';
                html +=         '</div>';
                html +=     '</div>';
                html +=     '<!-- 额定功率footer -->';
                html +=     '<div class="basic-footer">';
                html +=         '<div class="footer">'
                html +=             '<div class="current-page">显示行</div>';
                html +=             '<div class="select-row">';
                html +=                 '<span>10</span>'   
                html +=                 '<ul>';
                html +=                     '<li>100</li>';
                html +=                     '<li>50</li>';
                html +=                     '<li>20</li>';
                html +=                     '<li>10</li>';
                html +=                 '</ul>';
                html +=             '</div>';
                html +=             '<div class="pagingUp">上一页</div>';
                html +=             '<div class="page-list">';
                html +=                 '<ul>';
                html +=                     '<li class="curr">1</li>';
                html +=                 '</ul>';
                html +=             '</div>';
                html +=             '<div class="pagingDown">下一页</div>';
                html +=          '</div>';
                html +=     '</div>';
                html +=  '</div>';
            $('#contentBox').css('background','#f6f6f8').html(html);
    },
     //显示查询数据信息
    template: function(basicInfo,pageCount,pageOne){
        var  str = '',
            _this = this,
             d = basicInfo;
        // 当总页数只有一页
        if (this.pageOne == pageCount) {
            for(var i = 0 ;i<d.length;i++){
                var time = d[i].updateTime;
                var tt =  _this.getLocalTime(time);
                str += '<tr data-cityId="'+d[i].siteId+'">'; 
                str +=    '<td>'+[(pageOne-1)*_this.pagesize+1+i]+'</td>';
                str +=    '<td>'+d[i].cityName+'</td>';
                str +=    '<td>'+d[i].countyName+'</td>';
                str +=    '<td>'+d[i].siteName+'</td>';
                str +=    '<td>'+d[i].totalPowerRating+'</td>';
                str +=    '<td>'+d[i].totalElectricity+'</td>';
                str +=    '<td>'+d[i].updateStatus+'</td>';
                str +=    '<td class="updata-time">'+tt+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse" >查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        } else {
            for(var j = 0 ;j<d.length;j++){
                var time = d[j].updateTime;
                var tt =  _this.getLocalTime(time);
                str += '<tr data-cityId="'+d[j].siteId+'">';
                str +=    '<td>'+[(pageOne-1)*_this.pagesize+1+j]+'</td>';
                str +=    '<td>'+d[j].cityName+'</td>';
                str +=    '<td>'+d[j].countyName+'</td>';
                str +=    '<td>'+d[j].siteName+'</td>';
                str +=    '<td>'+d[j].totalPowerRating+'</td>';
                str +=    '<td>'+d[j].totalElectricity+'</td>';
                str +=    '<td>'+d[j].updateStatus+'</td>';
                str +=    '<td class="updata-time">'+tt+'</td>'; 
                str +=    '<td class="through">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse">查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        }
        // 查询结果
        // $(".query-date").initHight()
        $(".query-date").html(str);
        $('.query-date').find('tr:even').addClass('even');   
        $('.query-date').find('tr:odd').addClass('odd');
    },
    // 时间格式化
    getLocalTime: function (nS) {     
        var date = new Date(nS);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        // var h = date.getHours() + ':';
        // var m = date.getMinutes() + ':';
        // var s = date.getSeconds(); 
        var t = Y+M+D; 
        return t;  
    },
     //分页数据
    page_icon: function(cPage,count,eq){
        //根据当前选中页生成页面点击按钮
        var ul_html = '';
        for(var i = cPage;i<=count;i++){
            ul_html += '<li>'+i+'</li>';
        }
        $(".page-list ul").html(ul_html);
        $(".page-list ul li").eq(eq).addClass("curr");
    },
    //点击跳转页面显示的数据
    pageGroup: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,5,0);
                break;
            case 2:
                this.page_icon(1,5,1);
                break;
            case 3:
                this.page_icon(1,5,2);
                break;
            case 4:
                this.page_icon(1,5,3);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,3);  //倒数第一页
                break;
            case pageCount-2:
                this.page_icon(pageCount-4,pageCount,2);  //倒数第二页
                break;
            case pageCount-3:
                this.page_icon(pageCount-4,pageCount,1);  //倒数第三页
                break;
            case pageCount:                               //最后一页
                this.page_icon(pageCount-4,pageCount,4);  
                break;
            default:
                this.page_icon(pageNum-2,pageNum+2,2);
                break;
        }
    },
    //上一页操作
    pageUp: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,5,0);
                break;
            case 2:
                this.page_icon(1,5,1);
                break;
            case 3: 
                this.page_icon(1,5,2);
                break;
            case 4:
                this.page_icon(1,5,3);
                break;
            case 5:
                this.page_icon(1,5,4);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,3);
                break;
            case pageCount-2:
                this.page_icon(pageCount-4,pageCount,2);  //倒数第二页
                break;
            case pageCount-3:
                this.page_icon(pageCount-4,pageCount,1);  //倒数第三页
                break;
            case pageCount-4:
                this.page_icon(pageCount-4,pageCount,0);  //倒数第三页
                break;
            // case pageCount:
            //     this.page_icon(pageCount-4,pageCount,3);
            //     break;
            default:
                this.page_icon(pageNum-2,pageNum+2,2);
                break; 
        }   
    },
    //下一页操作
    pageDown: function(pageNum,pageCount){
        switch(pageNum){
            // case 1:
            //     this.page_icon(1,pageCount,1);
            //     break;
            case 2:
                this.page_icon(1,pageCount,1);
                break;
            case 3:
                this.page_icon(1,pageCount,2);
                break;
            case 4:
                this.page_icon(1,pageCount,3);
                break;
            case 5:
                this.page_icon(1,pageCount,4);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,3);  //倒数第一页
                break;
            case pageCount-2:
                this.page_icon(pageCount-4,pageCount,2);  //倒数第二页
                break;
            case pageCount-3:
                this.page_icon(pageCount-4,pageCount,1);  //倒数第三页
                break;
            case pageCount-4:
                this.page_icon(pageCount-4,pageCount,0);  //倒数第四页
                break;
            case pageCount:                               //最后一页
                this.page_icon(pageCount-4,pageCount,4);  
                break;
            default:
                this.page_icon(pageNum-2,pageNum+2,2);
                break;
        }
    },
    //判断省略号
    judge: function(down,pageCount,up,setNum){
        var last = pageCount;       //页码总数
        var prevFlag = $(".page-list ul li:last").clone(true).html("...");      // 省略号
        var lastFlag = $(".page-list ul li:last").clone(true).html("...");      // 省略号
        var firstNum =  $(".page-list ul li:last").clone(true).html("1");   // 数字1
        var lastNum =  $(".page-list ul li:last").clone(true).html(last);   // 最后页码
        var len = $(".page-list ul li").length;                              // 页码个数
        // 页码总个数大于6 针对数据内容页码数超过6
        if (len>6) {
            $(".page-list ul li:gt(4)").not(":last()").hide(); 
            $(".page-list ul li:last").prev().before(lastFlag);    
        }
        // 点击下一页的判断
        if (down>=6 && down < pageCount-4 && down != "") {     
            $(".page-list ul").prepend(prevFlag).prepend(firstNum); 
            $(".page-list ul li:last").after(lastNum).after(lastFlag);  
        } else if(down >= pageCount -4 && down <= pageCount && down != "") {   
            $(".page-list ul").prepend(prevFlag).prepend(firstNum); 
            if (down === pageCount) {
                $(".page-list ul li:first,.page-list ul li:eq(1)").removeClass('curr');  
            }
        }
        // 上一页判断
        if (up >= pageCount-5 && up!= "") {
            $(".page-list ul").prepend(prevFlag).prepend(firstNum); 
        } else if (up < pageCount-5 && up >= 5 && up != "") {
            $(".page-list ul").prepend(prevFlag).prepend(firstNum); 
            $(".page-list ul li:last").after(lastNum).after(lastFlag);  
        } else if (up < 5 && up !== "") {
            $(".page-list ul li:last").after(lastNum).after(lastFlag);  
            $(".page-list ul li").removeClass('curr');  
            $(".page-list ul li").eq(up).addClass('curr');  
        }
        // 点击页码的判断
        if (setNum < 5) {
            $(".page-list ul li:last").after(lastNum).after(lastFlag);  
            $(".page-list ul li").removeClass("curr");
            $(".page-list ul li").eq(setNum-1).addClass("curr");
        } else if (setNum >= 5 && setNum <= pageCount-4 ){
            $(".page-list ul").prepend(prevFlag).prepend(firstNum); 
            $(".page-list ul li:last").after(lastNum).after(lastFlag);  
        }else if (setNum > pageCount -4) {
            $(".page-list ul").prepend(prevFlag).prepend(firstNum); 
            if (setNum === pageCount) {
                $(".page-list ul li:first,.page-list ul li:eq(1)").removeClass('curr');  
            }
        }
    },
    //市区选择
    initCity: function(){
        var _this = this;
        var url = Interface.get("DS","getCity");   //获取城市信息
        // 加载城市的数据
        $.get(
            // "http://120.77.81.69:8080/audit/systemData/queryCityList.do?",
            // "http://localhost:8080/audit/systemData/queryCityList.do?",
            url,
            function(data){
                var html = "";
                data.sort(function(a,b){
                      return Number(a.key)-Number(b.key)
                });
                for (var attr in data){
                    html += "<option value='" + data[attr].key + "'>" + data[attr].value + "</option>";
                }
                // $("#city").append(html);
                var judgeManager = getUserData().userId;
                if (judgeManager == "237") {
                    $("#city").empty().append("<option>成都市</option>").addClass("selected").attr("disabled","disabled");
                    $("#district").empty().append("<option>锦江区</option>").addClass("selected").attr("disabled","disabled");
                } else {
                    $("#city").empty().prepend("<option>市</option>").append(html);
                }
                // 加载城市信息后加载区县
                _this.initDistrict();
            },"json");
    },
    //区县选择
    initDistrict: function() {
        var _this = this;
        var cityId = $("#city").val();
        var url = Interface.get("DS","getCounty");   //获取地区信息
        var val = {
            cityId:cityId
        }
        $.getJSON(
            url,
            // "http://120.77.81.69:8080/audit/systemData/queryCountyList.do?",
            // "http://localhost:8080/audit/systemData/queryCountyList.do?",
            val,
            function(data){
                var html = "";
                for(var attr in data){
                    html += "<option value='"+ data[attr].key +"'>"+ data[attr].value +"</option>";
                }
                if (_this.setCity === true) {
                    $("#district").empty().append(html);
                } 
            }
        );
    },
    //请求数据
    ajaxGetDate: function(pageOne,pagesize,countyId,cityId,siteName){
        var _this = this;
        var url = Interface.get("DS","getpowRating");   //获取基础数据地址
        // 服务器中获取数据
        $.ajax({
            type:"get",
            url:url,
            dataType:"json",
            data:{pageNo:pageOne,pageSize:pagesize,countyId:countyId,cityId:cityId,siteName:siteName}
        })
        .done(function(data) {
            console.log(data);
            var basicInfo = data.data;                                                      // 每页的行数
            if(data.data.length != 0){
                $('.number').html(data.totalData);                                        // 总报账点个数显示
                //总页数
                _this.pageAll = data.totalData;                                           //信息总条数
                _this.pageCount = Math.ceil(_this.pageAll/_this.pagesize);                //总页数
                if(_this.initState) {                                                   //初始创建分页页码 
                    _this.page_icon(1,_this.pageCount,0);
                    $('.number').html(data.totalData);                                        // 总报账点个数显示
                    _this.judge();
                }
                _this.template(basicInfo,_this.pageCount,pageOne);                                //渲染页面显示数据
            }else {
                $(".query-date").empty();
                CMalert('暂时无数据!');
            }
        })
        .fail(function() {
            console.log("分页数据获取失败");
        });
    },
    // 查看详情
    viewDetails: function(idText) {
        var url = Interface.get("DS","getpowRatingDeatail");   //获取额定功率详细信息
        console.log(url);
        $.ajax({
            url:url,
            data: {siteId:idText},
            type: 'get',
            dataType: 'json'
        })
        .done(function(data){
            var meterTable=new TableCM({
                head:["设备ID号","机房名称","设备专业","网元状态","型号","生产厂家","数量"],
                cellWidth:["8%","32%","10%","15%","15%","10%","10%"],
                valueKey:["equipmentRoomId","equipmentRoomName","deviceBelong","deviceModel","deviceType","deviceVendor","number"]
            });
            var valueKeyAry=meterTable.valueKey;
            data.forEach(function (obj) {
                valueKeyAry.forEach(function (key) {
                    obj[key]='<div class="ellipsis">'+obj[key]+'</div>'
                });
            });
            meterTable.full(data);
            CMdialog.show();
            meterTable.initHight();
            CMdialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">查看详情</div>');
            CMdialog.fullContent(meterTable.tableBox);
        })
    },
    // 初始渲染页面
    init: function() {
        var _this = this;
        _this.initCity();
        _this.creatMarkPage();  //创建页面
        $(".city").on("change",function(){
            _this.cityId = $(this).children('option:selected').attr('value');      //城市选择
        });
        $(".district").on("change",function(){
            _this.countyId = $(this).children('option:selected').attr('value');   //区县选择
        });
        // 搜索框输入
        $(".select-name input").on("change",function(){
            // 文字输入
            _this.siteName = $(".select-name input").val();
            $(this).val(_this.siteName);
        });
        // 回车搜索
        // $(document).on("keydown",function(e){
        //     var key = e.which;
        //     if(key == 13 && _this.siteName != "") {
        //         $(".query").click();
        //     } 
        // });
        // 查询数据渲染页面
        $(".query").on('click',function(){
            // $(this).css("background","#286090");
             _this.initState = true;       // 初始状态
            var judgeManager = getUserData().userId;   // 获取用户权限
            if (judgeManager == "237") {
               _this.cityId = "28";
               _this.district = "1167";
               if(_this.cityId || _this.countyId || _this.siteName){
                    _this.ajaxGetDate(1,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
                }
            } else {
                // 初始渲染
                if(_this.cityId || _this.countyId || _this.siteName){
                    _this.ajaxGetDate(1,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
                }else{
                    CMalert("区域选择不能为空！");
                }
            }
        });
        // 设置显示行数
        $('.select-row span').on('click',function(){
            if( $('.select-row ul').is(':hidden')){
                $('.select-row ul').show();
            } else {
                $('.select-row ul').hide();
            }
        });
        // 显示行移入移出效果
        $('.select-row').find('li').hover(
            function(){
                $(this).addClass('curr').siblings().removeClass('curr');
            },
            function(){
                $(this).removeClass('curr');
            }
        );
        // 选中设置显示行 设置后重新渲染页面及页码
        $('.select-row li').on('click',function(){
            var text = $(this).html();
            $('.select-row span').html(text);
            $(this).parent().hide();  // 隐藏上拉菜单框
            _this.pagesize = parseInt(text); 
            _this.initState = true;   // 重新渲染数据
            var height = $(".tbody-box").outerHeight();
                if( height >1) {
                _this.ajaxGetDate(1,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
            }
        });
        //绑定点击页码跳转
        $('body').on('click', '.page-list ul li', function() {
            _this.initState = false;          
            var pageNum = parseInt($(this).html()); //获取当前点击的页数
            var height = $(".tbody-box").outerHeight();
            if( height >1) {
                if(_this.pageCount>6){
                    if (!isNaN(pageNum)) {
                        _this.ajaxGetDate(pageNum,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
                        _this.pageGroup(pageNum,_this.pageCount);     //跳转到指定的页数
                        _this.judge("",_this.pageCount,"",pageNum);
                    }
                }else{
                    if (!isNaN(pageNum)) {
                        _this.ajaxGetDate(pageNum,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
                        $(this).addClass("curr").siblings("li").removeClass("curr");
                    }
                }
            }
        });
        // 省略号禁用
        $('body').on('mouseover', '.page-list ul li', function() {
            var pageNum = parseInt($(this).html()); //获取当前点击的页数
            if(isNaN(pageNum)) {
                $(this).css("cursor","not-allowed");
            }

        });
        $(".pagingDown,.pagingUp").hover(
            function(){
                $(this).addClass("curr");
            },
            function(){
                $(this).removeClass("curr");
            }
        );    
        //点击上一页
        $(".pagingUp").click(function(){
            var indexPage = parseInt($(".page-list li.curr").html());           //获取当前页
            _this.initState = false;
            var height = $(".tbody-box").outerHeight();
            if( height >1) {
                if(_this.pageCount>6){
                    if (indexPage>1) {
                        indexPage -= 1;
                        _this.pageUp(indexPage,_this.pageCount);
                        _this.judge(0,_this.pageCount,indexPage-1);
                        _this.ajaxGetDate(indexPage,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
                    } else {
                        indexPage = 1;
                        _this.ajaxGetDate(indexPage,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
                    }
                } else {
                    if( indexPage > 1){
                        indexPage -= 1;
                        _this.ajaxGetDate(indexPage,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
                        $(".page-list ul li").removeClass("curr");
                        $(".page-list ul li").eq(indexPage-1).addClass('curr');
                    } 
                }
            }
        });
        //点击下一页
        $(".pagingDown").click(function(){
            var indexPage = parseInt($(".page-list li.curr").html());           //获取当前页
            // var nextPage = parseInt($(".page-list li.curr").next().text());    //获取下一页索引
            _this.initState = false;
            var height = $(".tbody-box").outerHeight();
            if( height >1) {
                if(_this.pageCount>6){
                    if(indexPage != _this.pageCount) {
                        // _this.pageOne = nextPage;  
                        indexPage += 1 ;                                  
                        _this.pageDown(indexPage,_this.pageCount);
                        _this.judge(indexPage,_this.pageCount);
                        _this.ajaxGetDate(indexPage,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
                    } else {
                        CMalert("已经是最后一页");
                    }
                } else {
                    if(indexPage != _this.pageCount) {
                        indexPage += 1 ;                                  
                        // _this.pageOne = nextPage;                                       
                        _this.ajaxGetDate(indexPage,_this.pagesize,_this.countyId,_this.cityId,_this.siteName);
                        $(".page-list ul li").removeClass("curr");
                        $(".page-list ul li").eq(indexPage-1).addClass('curr');
                    } else {
                        CMalert("已经是最后一页");
                    }
                }
            }
        });
        // 点击查看详情
        $("body").off('click', '.through').on('click', '.through', function(){
            var idText = $(this).parent().attr("data-cityId");
            console.log(idText);
            _this.viewDetails(idText);
            return false;
        });
        // 加载城市信息
        $("#city").on("change",function(){
            _this.setCity = true;
            _this.initDistrict();
        });
    }
};
// 智能电表标杆
var wattHourMark = {
    pageOne: 1,                                   //当前显示的页数
    pagesize: 10,                                  //每页显示条数
    pageCount: "",                                //总页数
    pageAll: "",                                  //信息总条数
    currentPage: "",                              //当前设置显示行数
    setPage: false,                               //是否设置
    setCity: false,                               //城市设置
    parentUl: $(".page-list ul"),                 //分页容器
    // 初始创建页面数据
    creatMarkPage: function() {
            var html = "";
                html +=  '<div class="rate-date">';
                html +=     '<!-- 数据title -->';
                html +=     '<div class="search-title">';
                html +=         '<div class="select-all">';
                html +=             '<select class="city" id="city">';
                html +=                 '<option>市</option>';
                html +=             '</select>'; 
                html +=             '<select class="district" id="district">';
                html +=                 '<option>区</option>';
                html +=             '</select>'; 
                html +=          '</div>';
                html +=          '<div class="select-name"><input type="text" placeholder="报账点名称"/></div>';
                html +=          '<div class="query">搜索</div>';
                html +=     '</div>';
                html +=     '<!-- 智能电表content -->';
                html +=     '<div class="basic-content">';
                html +=         '<table class="table-result" id="tableResult">';
                html +=             '<colgroup>';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:10%" />';
                html +=             '</colgroup>';
                html +=             '<thead>';
                html +=                 '<tr>';
                html +=                      '<th>序号</th>';
                html +=                      '<th>地市</th>';
                html +=                      '<th>区县</th>';
                html +=                      '<th>移动点名称</th>';
                html +=                      '<th>机房或资源点名称</th>';
                html +=                      '<th>智能电表读数</th>';
                html +=                      '<th>动环智能电表测点监控状态</th>';
                html +=                      '<th>电量标杆值（度）</th>';
                html +=                      '<th>更新状态</th>';
                html +=                      '<th>更新时间</th>';
                html +=                 '</tr>';
                html +=             '</thead>';
                html +=         '</table>';
                html +=         '<div class="tbody-box">'
                html +=         '<table class="table-result">'
                html +=             '<colgroup>';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:10%" />';
                html +=             '</colgroup>';
                html +=             '<tbody class="query-date">';
                html +=             '</tbody>';
                html +=         '</table>';
                html +=         '</div>';
                html +=     '</div>';
                html +=     '<!-- 智能电表footer -->';
                html +=     '<div class="basic-footer">';
                html +=         '<div class="footer">'
                html +=             '<div class="current-page">显示行</div>';
                html +=             '<div class="select-row">';
                html +=                 '<span>10</span>'   
                html +=                 '<ul>';
                html +=                     '<li>100</li>';
                html +=                     '<li>50</li>';
                html +=                     '<li>20</li>';
                html +=                     '<li>10</li>';
                html +=                 '</ul>';
                html +=             '</div>';
                html +=             '<div class="pagingUp">上一页</div>';
                html +=             '<div class="page-list">';
                html +=                 '<ul>';
                html +=                     '<li class="curr">1</li>';
                html +=                 '</ul>';
                html +=             '</div>';
                html +=             '<div class="pagingDown">下一页</div>';
                html +=          '</div>';
                html +=     '</div>';
                html +=  '</div>';
            $('#contentBox').css('background','#f6f6f8').html(html);
    },
    //显示查询数据信息
    template: function(basicInfo,pageCount,pageList){
        var  str = '',
            _this = this,
             d = basicInfo;
        // 当总页数只有一页
        if (this.pageOne == pageCount) {
            for(var i = 0 ;i<d.length;i++){
                var time = d[i].updateTime;
                var tt =  _this.getLocalTime(time);
                str += '<tr>'; 
                str +=    '<td>'+d[i].value1+'</td>';
                str +=    '<td>'+d[i].value2+'</td>';
                str +=    '<td>'+d[i].value3+'</td>';
                str +=    '<td>'+d[i].value4+'</td>';
                str +=    '<td>'+d[i].value5+'</td>';
                str +=    '<td>'+d[i].value6+'</td>';
                str +=    '<td>'+d[i].value7+'</td>';
                str +=    '<td>'+d[i].value8+'</td>';
                str +=    '<td>'+d[i].value9+'</td>';
                str +=    '<td>'+d[i].value10+'</td>';
                str += '</tr>';
            }
        } else {
            for(var j = 0 ;j<d.length;j++){
                var time = d[j].updateTime;
                var tt =  _this.getLocalTime(time);
                str += '<tr>';
                str +=    '<td>'+d[j].value1+'</td>';
                str +=    '<td>'+d[j].value2+'</td>';
                str +=    '<td>'+d[j].value3+'</td>';
                str +=    '<td>'+d[j].value4+'</td>';
                str +=    '<td>'+d[j].value5+'</td>';
                str +=    '<td>'+d[j].value6+'</td>';
                str +=    '<td>'+d[j].value7+'</td>';
                str +=    '<td>'+d[j].value8+'</td>';
                str +=    '<td>'+d[j].value9+'</td>';
                str +=    '<td>'+d[j].value10+'</td>';
                str += '</tr>';
            }
        }
        // 查询结果
        $(".query-date").html(str);
         // 时间格式化
        // var time = $(".updata-time").html();
        // _this.getLocalTime(time);
        $('.query-date').find('tr:even').addClass('even');   
        $('.query-date').find('tr:odd').addClass('odd');
    },
    //分页数据
    page_icon: function(cPage,count,eq,parentUl){
        //根据当前选中页生成页面点击按钮
        var ul_html = '';
        for(var i = cPage;i<=count;i++){
            ul_html += '<li>'+i+'</li>';
        }
        $(".page-list ul").html(ul_html);
        $(".page-list ul li:gt(3)").not(":last()").hide(); // 3到最后一个之间隐藏
        var len = $(".page-list ul li").length;
        if (len>=6) {
            $(".page-list ul li:last").prev().html("...").show();
        }else {
            $(".page-list ul li").show();
        }
        
        $(".page-list ul li").eq(eq).addClass("curr");
    },
    //点击跳转页面显示的数据
    pageGroup: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,pageCount,0);
                break;
            case 2:
                this.page_icon(1,pageCount,1);
                break;
            case pageCount-2:
                this.page_icon(pageCount-4,pageCount,2);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,3);
                break;
            case pageCount:
                this.page_icon(pageCount-4,pageCount,4);
                break;
            default:
                this.page_icon(pageNum-1,pageCount,1);
                break;
        }
    },
    //上一页操作
    pageUp: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                break;
            case 2:
                this.page_icon(1,6,0);
                break;
            case 3: 
                this.page_icon(1,6,1);
                break;
            case 4:
                this.page_icon(1,6,2);
                break;
            case 5:
                this.page_icon(1,6,3);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,2);
                break;
            case pageCount:
                this.page_icon(pageCount-4,pageCount,3);
                break;
            default:
                this.page_icon(pageNum-2,pageNum+2,1);
                break; 
        }   
    },
    //下一页操作
    pageDown: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,pageCount,1);
                break;
            case 2:
                this.page_icon(1,pageCount,2);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,4);  //倒数第一页
                break;
             case pageCount-2:
                this.page_icon(pageCount-4,pageCount,3);  //倒数第二页
                break;
            case pageCount-3:
                this.page_icon(pageCount-4,pageCount,2);  //倒数第三页
                break;
            case pageCount:                               //最后一页
                break;
            default:
                this.page_icon(pageNum,pageCount,1);
                break;
        }
    },
    //判断省略号
    judge: function(down,up,pageCount){
        var last = pageCount;
        var flag = $(".page-list ul li:first").clone(true).html("...");
        var firstNum =  $(".page-list ul li:first").clone(true).html("1");
        var lastNum =  $(".page-list ul li:first").clone(true).html(last);
        // 下一页判断
        if(down > 3){
            $(".page-list ul").prepend(flag).prepend(firstNum);
        }else if(up < pageCount){   // 上一页
            if (up >6) {
                $(".page-list ul").prepend(flag).prepend(firstNum);
                $(".page-list ul li:last").html(pageCount);
            } else {
                if(up>4 && up<6) {
                    $(".page-list ul").prepend(flag).prepend(firstNum);
                }
                $(".page-list ul li:last").html(pageCount).prev().html("...");
            }
        }
    },
    //请求数据
    ajaxGetDate: function(pageOne,pagesize,countyID,cityID){
        var _this = this;
        // // 服务器中获取数据
        // $.ajax({
        //     type:"get",
        //     // url:"http://localhost:8080/audit/benchmark/powerRating.do?",
        //     url: 'testJson/wattHourMark.json',
        //     dataType:"json",
        //     // data:{pageNo:pageOne,pageSize:pagesize}
        // })
        // .done(function(data) { 
        //     console.log(data);  
        //     // 模拟数据
        //     var  basicInfo = data;
        //     $(".number").html(basicInfo.lenght);
        //      _this.pageAll = basicInfo.length;                                           //信息总条数
        //     _this.pageCount = Math.ceil(_this.pageAll/_this.pagesize);                //总页数
        //     if(_this.pageOne == 1 || _this.setPage == true) {                         //初始创建分页页码 
        //         _this.page_icon(1,_this.pageCount,0);                                 
        //     }
        //     _this.template(basicInfo,_this.pageCount);                                //渲染页面显示数据
        //    // 线上数据 
        //     // var basicInfo = data.data;                                                // 每页的行数
            // $('.number').html(data.totalData);                                        // 总报账点个数显示
        //     // //总页数
        //     // _this.pageAll = data.totalData;                                           //信息总条数
        //     // _this.pageCount = Math.ceil(_this.pageAll/_this.pagesize);                //总页数
        //     // if(_this.pageOne == 1 || _this.setPage == true) {                         //初始创建分页页码 
        //     //     _this.page_icon(1,_this.pageCount,0);                                 
        //     // }
        //     // _this.template(basicInfo,_this.pageCount);                                //渲染页面显示数据
        // })
        // .fail(function() {
        //     CMalert("分页数据获取失败");
        // });
    },
    // 时间格式化
    getLocalTime: function (nS) {     
        var date = new Date(nS);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        // var h = date.getHours() + ':';
        // var m = date.getMinutes() + ':';
        // var s = date.getSeconds(); 
        var t = Y+M+D; 
        return t;  
    },
    // 初始渲染页面
    init: function() {
        var _this = this;
        _this.creatMarkPage();  //创建页面
        $.ajax({
            type:"get",
            // url:"http://localhost:8080/audit/benchmark/powerRating.do?",
            url: 'testJson/wattHourMark.json',
            dataType:"json",
            // data:{pageNo:pageOne,pageSize:pagesize}
        })
        .done(function(data) { 
            console.log(data);  
            // 模拟数据
            // 
            var  basicInfo = data;
            $(".number").html(data.length);
             _this.pageAll = basicInfo.length;                                           //信息总条数
            _this.pageCount = Math.ceil(_this.pageAll/_this.pagesize);                //总页数
            if(_this.pageOne == 1 || _this.setPage == true) {                         //初始创建分页页码 
                _this.page_icon(1,_this.pageCount,0);                                 
            }
            _this.template(basicInfo,_this.pageCount);                                //渲染页面显示数据
           // 线上数据 
            // var basicInfo = data.data;                                                // 每页的行数
            // $('.number').html(data.totalData);                                        // 总报账点个数显示
            // //总页数
            // _this.pageAll = data.totalData;                                           //信息总条数
            // _this.pageCount = Math.ceil(_this.pageAll/_this.pagesize);                //总页数
            // if(_this.pageOne == 1 || _this.setPage == true) {                         //初始创建分页页码 
            //     _this.page_icon(1,_this.pageCount,0);                                 
            // }
            // _this.template(basicInfo,_this.pageCount);                                //渲染页面显示数据
        })
        .fail(function() {
            CMalert("分页数据获取失败");
        });
        // _this.ajaxGetDate(_this.pageOne,_this.pagesize);// 初始渲染
        // 搜索框输入
        $(".select-name input").on("change",function(){
            // 文字输入
            var textInput = $(".select-name input").val();
            $(this).val(textInput);
        });
        // 设置显示行数
        $('.select-row span').on('click',function(){
            if( $('.select-row ul').is(':hidden')){
                $('.select-row ul').show();
            } else {
                $('.select-row ul').hide();
            }
        });
        // 显示行移入移出效果
        $('.select-row').find('li').hover(
            function(){
                $(this).addClass('curr').siblings().removeClass('curr');
            },
            function(){
                $(this).removeClass('curr');
            }
        );
        // 选中设置显示行
        $('.select-row li').on('click',function(){
            var text = $(this).html();
            $('.select-row span').html(text);
            $(this).parent().hide();  // 隐藏上拉菜单框
            _this.pagesize = parseInt(text); 
            _this.setPage = true;
            _this.ajaxGetDate(1,_this.pagesize);
        });
        //绑定点击页码跳转
        $('body').on('click', '.page-list ul li', function() {
            var pageNum = parseInt($(this).html()); //获取当前点击的页数
            _this.pageOne = pageNum;
            if (!isNaN(pageNum)) {
                _this.ajaxGetDate(_this.pageOne,_this.pagesize);
                 _this.pageGroup(pageNum,_this.pageCount);     //跳转到指定的页数
                var flag = $(".page-list ul li:first").clone(true).html("...");
                var firstNum =  $(".page-list ul li:first").clone(true).html("1");
                if (pageNum>4){
                    $(".page-list ul").prepend(flag).prepend(firstNum);
                } 
            }else {
                $('body').off('click', '.page-list ul li');
            }
        });
        // 省略号禁用
        $('body').on('mouseover', '.page-list ul li', function() {
            var pageNum = parseInt($(this).html()); //获取当前点击的页数
            if(isNaN(pageNum)) {
                $(this).css("cursor","not-allowed");
            }

        });
        $(".pagingDown,.pagingUp").hover(
            function(){
                $(this).addClass("curr");
            },
            function(){
                $(this).removeClass("curr");
            }
        );    
        //点击上一页
        $(".pagingUp").click(function(){
            var indexPage = parseInt($(".page-list li.curr").html());           //获取当前页
            if (indexPage>1) {
                _this.pageOne -= 1;
                _this.pageUp(indexPage,_this.pageCount);
                _this.judge(0,indexPage-1,_this.pageCount);
                _this.ajaxGetDate(_this.pageOne,_this.pagesize);
            } else {
                _this.pageOne = 1;
                _this.ajaxGetDate(_this.pageOne,_this.pagesize);
            }
        });
        //点击下一页
        $(".pagingDown").click(function(){
            if(_this.pageOne != _this.pageCount) {
                var indexPage = parseInt($(".page-list li.curr").html());           //获取当前页
                var nextPage = parseInt($(".page-list li.curr").next().text());    //获取下一页索引
                _this.pageOne = nextPage;                                       
                _this.pageDown(indexPage,_this.pageCount);
                _this.judge(indexPage);
                _this.ajaxGetDate(nextPage,_this.pagesize);
            } else {
                alert("已经是最后一页");
            }
        });
        // 点击查看详情
        $("body").off('click', '.through').on('click', '.through', function(){
            var idText = $(this).siblings("td:first").html();
            dialog.openDialog(idText);
            return false;
        });
    }

};
// 开关电源标杆
var switchMark = {
    pageOne: 1,                                   //当前显示的页数
    pagesize: 10,                                  //每页显示条数
    pageCount: "",                                //总页数
    pageAll: "",                                  //信息总条数
    currentPage: "",                              //当前设置显示行数
    setPage: false,                               //是否设置
    setCity: false,                               //城市设置
    parentUl: $(".page-list ul"),                 //分页容器
     // 初始创建页面数据
    creatMarkPage: function() {
            var html = "";
                html +=  '<div class="rate-date">';
                html +=     '<!-- 数据title -->';
                html +=     '<div class="search-title">';
                html +=         '<div class="select-all">';
                html +=             '<select class="city" id="city">';
                html +=                 '<option>市</option>';
                html +=             '</select>'; 
                html +=             '<select class="district" id="district">';
                html +=                 '<option>区</option>';
                html +=             '</select>'; 
                html +=          '</div>';
                html +=          '<div class="select-name"><input type="text" placeholder="报账点名称"/></div>';
                html +=          '<div class="query">搜索</div>';
                html +=     '</div>';
                html +=     '<!--开关电源content -->';
                html +=     '<div class="basic-content">';
                html +=         '<table class="table-result" id="tableResult">';
                html +=             '<colgroup>';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:10%" />';
                html +=             '</colgroup>';
                html +=             '<thead>';
                html +=                 '<tr>';
                html +=                      '<th>序号</th>';
                html +=                      '<th>地市</th>';
                html +=                      '<th>区县</th>';
                html +=                      '<th>移动点名称</th>';
                html +=                      '<th>机房或资源点名称</th>';
                html +=                      '<th>闲忙时开关电源负载电流</th>';
                html +=                      '<th>开关电源浮充电压</th>';
                html +=                      '<th>电量标杆值（度）</th>';
                html +=                      '<th>更新状态</th>';
                html +=                      '<th>更新时间</th>';
                html +=                 '</tr>';
                html +=             '</thead>';
                html +=         '</table>';
                html +=         '<div class="tbody-box">'
                html +=         '<table class="table-result">'
                html +=             '<colgroup>';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:7%" />';
                html +=                 '<col style="width:10%" />';
                html +=             '</colgroup>';
                html +=             '<tbody class="query-date">';
                html +=             '</tbody>';
                html +=         '</table>';
                html +=         '</div>';
                html +=     '</div>';
                html +=     '<!--开关电源footer -->';
                html +=     '<div class="basic-footer">';
                html +=         '<div class="footer">'
                html +=             '<div class="current-page">显示行</div>';
                html +=             '<div class="select-row">';
                html +=                 '<span>10</span>'   
                html +=                 '<ul>';
                html +=                     '<li>100</li>';
                html +=                     '<li>50</li>';
                html +=                     '<li>20</li>';
                html +=                     '<li>10</li>';
                html +=                 '</ul>';
                html +=             '</div>';
                html +=             '<div class="pagingUp">上一页</div>';
                html +=             '<div class="page-list">';
                html +=                 '<ul>';
                html +=                     '<li class="curr">1</li>';
                html +=                 '</ul>';
                html +=             '</div>';
                html +=             '<div class="pagingDown">下一页</div>';
                html +=             '<div class="down-load"><a data-type="xls" class="down">下载EXCEL</a></div>';
                html +=          '</div>';
                html +=     '</div>';
                html +=  '</div>';
            $('#contentBox').css('background','#f6f6f8').html(html);
    },
    //显示查询数据信息
    template: function(basicInfo,pageCount,pageList){
        var  str = '',
            _this = this,
             d = basicInfo;
        // // 当总页数只有一页
        // if (this.pageOne == pageCount) {
        //     for(var i = 0 ;i<d.length;i++){
        //         var time = d[i].updateTime;
        //         var tt =  _this.getLocalTime(time);
        //         str += '<tr>'; 
        //         str +=    '<td>'+[i+1]+'</td>';
        //         str +=    '<td>'+d[i].cityName+'</td>';
        //         str +=    '<td>'+d[i].countyName+'</td>';
        //         str +=    '<td>'+d[i].siteName+'</td>';
        //         str +=    '<td></td>';
        //         str +=    '<td>'+d[i].totalPowerRating+'</td>';
        //         str +=    '<td></td>';
        //         str +=    '<td></td>';
        //         str +=    '<td class="updata-time">'+tt+'</td>';
        //         str +=    '<td class="through">';
        //         str +=         '<img src="img/search_icon.png"/>';
        //         str +=         '<a href="javascript:void(0)" class="browse" >查看</a>';
        //         str +=     '</td>';
        //         str += '</tr>';
        //     }
        // } else {
        //     for(var j = 0 ;j<d.length;j++){
        //         var time = d[j].updateTime;
        //         var tt =  _this.getLocalTime(time);
        //         str += '<tr>';
        //         str +=    '<td>'+[j+1]+'</td>';
        //         str +=    '<td>'+d[j].cityName+'</td>';
        //         str +=    '<td>'+d[j].countyName+'</td>';
        //         str +=    '<td>'+d[j].siteName+'</td>';
        //         str +=    '<td></td>';
        //         str +=    '<td>'+d[j].totalPowerRating+'</td>';
        //         str +=    '<td></td>';
        //         str +=    '<td>'+d[j].totalElectricity+'</td>';
        //         str +=    '<td></td>';
        //         str +=    '<td class="updata-time">'+tt+'</td>'; 
        //         str +=    '<td class="through">';
        //         str +=         '<img src="img/search_icon.png"/>';
        //         str +=         '<a href="javascript:void(0)" class="browse">查看</a>';
        //         str +=     '</td>';
        //         str += '</tr>';
        //     }
        // }
         // 当总页数只有一页
        if (this.pageOne == pageCount) {
            for(var i = 0 ;i<d.length;i++){
                var time = d[i].updateTime;
                var tt =  _this.getLocalTime(time);
                str += '<tr>'; 
                str +=    '<td>'+d[i].value1+'</td>';
                str +=    '<td>'+d[i].value2+'</td>';
                str +=    '<td>'+d[i].value3+'</td>';
                str +=    '<td>'+d[i].value4+'</td>';
                str +=    '<td>'+d[i].value5+'</td>';
                str +=    '<td>'+d[i].value6+'</td>';
                str +=    '<td>'+d[i].value7+'</td>';
                str +=    '<td>'+d[i].value8+'</td>';
                str +=    '<td>'+d[i].value9+'</td>';
                str +=    '<td>'+d[i].value10+'</td>';
                str += '</tr>';
            }
        } else {
            for(var j = 0 ;j<d.length;j++){
                var time = d[j].updateTime;
                var tt =  _this.getLocalTime(time);
                str += '<tr>';
                str +=    '<td>'+d[j].value1+'</td>';
                str +=    '<td>'+d[j].value2+'</td>';
                str +=    '<td>'+d[j].value3+'</td>';
                str +=    '<td>'+d[j].value4+'</td>';
                str +=    '<td>'+d[j].value5+'</td>';
                str +=    '<td>'+d[j].value6+'</td>';
                str +=    '<td>'+d[j].value7+'</td>';
                str +=    '<td>'+d[j].value8+'</td>';
                str +=    '<td>'+d[j].value9+'</td>';
                str +=    '<td>'+d[j].value10+'</td>';
                str += '</tr>';
            }
        }
        // 查询结果
        $(".query-date").html(str);
         // 时间格式化
        // var time = $(".updata-time").html();
        // _this.getLocalTime(time);
        $('.query-date').find('tr:even').addClass('even');   
        $('.query-date').find('tr:odd').addClass('odd');
    },
    //分页数据
    page_icon: function(cPage,count,eq,parentUl){
        //根据当前选中页生成页面点击按钮
        var ul_html = '';
        for(var i = cPage;i<=count;i++){
            ul_html += '<li>'+i+'</li>';
        }
        $(".page-list ul").html(ul_html);
        $(".page-list ul li:gt(3)").not(":last()").hide(); // 3到最后一个之间隐藏
        var len = $(".page-list ul li").length;
        if (len>=6) {
            $(".page-list ul li:last").prev().html("...").show();
        }else {
            $(".page-list ul li").show();
        }
        
        $(".page-list ul li").eq(eq).addClass("curr");
    },
    //点击跳转页面显示的数据
    pageGroup: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,pageCount,0);
                break;
            case 2:
                this.page_icon(1,pageCount,1);
                break;
            case pageCount-2:
                this.page_icon(pageCount-4,pageCount,2);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,3);
                break;
            case pageCount:
                this.page_icon(pageCount-4,pageCount,4);
                break;
            default:
                this.page_icon(pageNum-1,pageCount,1);
                break;
        }
    },
    //上一页操作
    pageUp: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                break;
            case 2:
                this.page_icon(1,6,0);
                break;
            case 3: 
                this.page_icon(1,6,1);
                break;
            case 4:
                this.page_icon(1,6,2);
                break;
            case 5:
                this.page_icon(1,6,3);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,2);
                break;
            case pageCount:
                this.page_icon(pageCount-4,pageCount,3);
                break;
            default:
                this.page_icon(pageNum-2,pageNum+2,1);
                break; 
        }   
    },
    //下一页操作
    pageDown: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,pageCount,1);
                break;
            case 2:
                this.page_icon(1,pageCount,2);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,4);  //倒数第一页
                break;
             case pageCount-2:
                this.page_icon(pageCount-4,pageCount,3);  //倒数第二页
                break;
            case pageCount-3:
                this.page_icon(pageCount-4,pageCount,2);  //倒数第三页
                break;
            case pageCount:                               //最后一页
                break;
            default:
                this.page_icon(pageNum,pageCount,1);
                break;
        }
    },
    //判断省略号
    judge: function(down,up,pageCount){
            var last = pageCount;
            var flag = $(".page-list ul li:first").clone(true).html("...");
            var firstNum =  $(".page-list ul li:first").clone(true).html("1");
            var lastNum =  $(".page-list ul li:first").clone(true).html(last);
            // 下一页判断
            if(down > 3){
                $(".page-list ul").prepend(flag).prepend(firstNum);
            }else if(up < pageCount){   // 上一页
                if (up >6) {
                    $(".page-list ul").prepend(flag).prepend(firstNum);
                    $(".page-list ul li:last").html(pageCount);
                } else {
                    if(up>4 && up<6) {
                        $(".page-list ul").prepend(flag).prepend(firstNum);
                    }
                    $(".page-list ul li:last").html(pageCount).prev().html("...");
                }
            }
    },
    //请求数据
    ajaxGetDate: function(pageOne,pagesize,countyID,cityID){
        var _this = this;
        // 服务器中获取数据
        $.ajax({
            type:"get",
            // url:"http://localhost:8080/audit/benchmark/powerRating.do?",
            url: 'testJson/switchMark.json',
            dataType:"json",
            // data:{pageNo:pageOne,pageSize:pagesize}
        })
        .done(function(data) {      
            var basicInfo = data;
            $('.number').html(data.length); 
             //总页数
            _this.pageAll = data.length;                                           //信息总条数
            _this.pageCount = Math.ceil(_this.pageAll/_this.pagesize);                //总页数
            if(_this.pageOne == 1 || _this.setPage == true) {                         //初始创建分页页码 
                _this.page_icon(1,_this.pageCount,0);                                 
            }
            _this.template(basicInfo,_this.pageCount);                                //渲染页面显示数据   
            // var basicInfo = data.data;                                                // 每页的行数
            // $('.number').html(data.totalData);                                        // 总报账点个数显示
            // //总页数
            // _this.pageAll = data.totalData;                                           //信息总条数
            // _this.pageCount = Math.ceil(_this.pageAll/_this.pagesize);                //总页数
            // if(_this.pageOne == 1 || _this.setPage == true) {                         //初始创建分页页码 
            //     _this.page_icon(1,_this.pageCount,0);                                 
            // }
            // _this.template(basicInfo,_this.pageCount);                                //渲染页面显示数据
        })
        .fail(function() {
            CMalert("分页数据获取失败");
        });
    },
    // 时间格式化
    getLocalTime: function (nS) {     
        var date = new Date(nS);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        // var h = date.getHours() + ':';
        // var m = date.getMinutes() + ':';
        // var s = date.getSeconds(); 
        var t = Y+M+D; 
        return t;  
    },
    // 初始渲染页面
    init: function() {
        var _this = this;
        _this.creatMarkPage();  //创建页面
        _this.ajaxGetDate(_this.pageOne,_this.pagesize);// 初始渲染
        // 搜索框输入
        $(".select-name input").on("change",function(){
            // 文字输入
            var textInput = $(".select-name input").val();
            $(this).val(textInput);
        });
        // 设置显示行数
        $('.select-row span').on('click',function(){
            if( $('.select-row ul').is(':hidden')){
                $('.select-row ul').show();
            } else {
                $('.select-row ul').hide();
            }
        });
        // 显示行移入移出效果
        $('.select-row').find('li').hover(
            function(){
                $(this).addClass('curr').siblings().removeClass('curr');
            },
            function(){
                $(this).removeClass('curr');
            }
        );
        // 选中设置显示行
        $('.select-row li').on('click',function(){
            var text = $(this).html();
            $('.select-row span').html(text);
            $(this).parent().hide();  // 隐藏上拉菜单框
            _this.pagesize = parseInt(text); 
            _this.setPage = true;
            _this.ajaxGetDate(1,_this.pagesize);
        });
        //绑定点击页码跳转
        $('body').on('click', '.page-list ul li', function() {
            var pageNum = parseInt($(this).html()); //获取当前点击的页数
            _this.pageOne = pageNum;
            if (!isNaN(pageNum)) {
                _this.ajaxGetDate(_this.pageOne,_this.pagesize);
                 _this.pageGroup(pageNum,_this.pageCount);     //跳转到指定的页数
                var flag = $(".page-list ul li:first").clone(true).html("...");
                var firstNum =  $(".page-list ul li:first").clone(true).html("1");
                if (pageNum>4){
                    $(".page-list ul").prepend(flag).prepend(firstNum);
                } 
            }else {
                $('body').off('click', '.page-list ul li');
            }
        });
        // 省略号禁用
        $('body').on('mouseover', '.page-list ul li', function() {
            var pageNum = parseInt($(this).html()); //获取当前点击的页数
            if(isNaN(pageNum)) {
                $(this).css("cursor","not-allowed");
            }

        });
        $(".pagingDown,.pagingUp").hover(
            function(){
                $(this).addClass("curr");
            },
            function(){
                $(this).removeClass("curr");
            }
        );    
        //点击上一页
        $(".pagingUp").click(function(){
            var indexPage = parseInt($(".page-list li.curr").html());           //获取当前页
            if (indexPage>1) {
                _this.pageOne -= 1;
                _this.pageUp(indexPage,_this.pageCount);
                _this.judge(0,indexPage-1,_this.pageCount);
                _this.ajaxGetDate(_this.pageOne,_this.pagesize);
            } else {
                _this.pageOne = 1;
                _this.ajaxGetDate(_this.pageOne,_this.pagesize);
            }
        });
        //点击下一页
        $(".pagingDown").click(function(){
            if(_this.pageOne != _this.pageCount) {
                var indexPage = parseInt($(".page-list li.curr").html());           //获取当前页
                var nextPage = parseInt($(".page-list li.curr").next().text());    //获取下一页索引
                _this.pageOne = nextPage;                                       
                _this.pageDown(indexPage,_this.pageCount);
                _this.judge(indexPage);
                _this.ajaxGetDate(nextPage,_this.pagesize);
            } else {
                alert("已经是最后一页");
            }
        });
        // 点击查看详情
        $("body").off('click', '.through').on('click', '.through', function(){
            var idText = $(this).siblings("td:first").html();
            dialog.openDialog(idText);
            return false;
        });
    }
};
