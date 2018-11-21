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
MENU.addItem([
    {
        value:"基础数据",
        id:"BasicData",
        icon:"img/data_icon.png",
        childBoxStyle:"background-color:#1c2226",
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
                            var infoes = "额定功率标杆 | <span>共<i class='number'>5700</i>个</span>";
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
                            var infoes = "智能电表标杆 | <span>共<i class='number'>5700</i>个</span>";
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
                            var infoes = "开关电源标杆 | <span>共<i class='number'>5700</i>个</span>";
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
    pageOne: 1,                                    //当前显示的页数
    pagesize: 10,                                  //每页显示条数
    parentUl: $(".page-list ul"),                  //分页容器
    // 显示查询数据信息
    template: function(basicInfo,pageCount,pageList){
        var  str = '',
            d = basicInfo;
        console.log(basicInfo);
        // 当总页数只有一页
        if (this.pageOne == pageCount) {
            for(var i = (this.pageOne-1)*(this.pagesize);i<d.length;i++){
                str += '<tr>';
                str +=    '<td>'+d[i].id+'</td>';
                str +=    '<td>'+d[i].area+'</td>';
                str +=    '<td>'+d[i].county+'</td>';
                str +=    '<td>'+d[i].accountName+'</td>';
                str +=    '<td>'+d[i].resourceName+'</td>';
                str +=    '<td>'+d[i].oldFinanceName+'</td>';
                str +=    '<td>'+d[i].productNature+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse" >查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        } else {
            for(var j = (this.pageOne-1)*(this.pagesize);j< this.pageOne*this.pagesize;j++){
                str += '<tr>';
                str +=    '<td>'+d[j].id+'</td>';
                str +=    '<td>'+d[j].area+'</td>';
                str +=    '<td>'+d[j].county+'</td>';
                str +=    '<td>'+d[j].accountName+'</td>';
                str +=    '<td>'+d[j].resourceName+'</td>';
                str +=    '<td>'+d[j].oldFinanceName+'</td>';
                str +=    '<td>'+d[j].productNature+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse">查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        }
        // 查询结果
        $(".query-date").html(str);
        $('.query-date').find('tr:even').addClass('even');
        $('.query-date').find('tr:odd').addClass('odd');
    },
    // 分页数据
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
    // 上一页操作
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
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,2);
                break;
            case pageCount:
                this.page_icon(pageCount-4,pageCount,3);
                break;
            default:
                this.page_icon(pageNum-3,pageNum+2,2);
                break;
        }
    },
    // 下一页操作
    pageDown: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,pageCount,1);
                break;
            case 2:
                this.page_icon(1,pageCount,2);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,4);
                break;
            case pageCount:
                break;
            default:
                this.page_icon(pageNum-2,pageCount,3);
                break;
        }
    },
    // 判断省略号
    judge: function(down,up,pageCount){
        var last = pageCount;
        var flag = $(".page-list ul li:first").clone(true).html("...");
        var firstNum =  $(".page-list ul li:first").clone(true).html("1");
        var lastNum =  $(".page-list ul li:first").clone(true).html(last);
        // 下一页判断
        if(down > 8){
            $(".page-list ul").prepend(flag).prepend(firstNum);
        }else if(up < pageCount){   // 上一页
            if (up > 6) {
                $(".page-list ul").prepend(flag).prepend(firstNum);
                $(".page-list ul li:last").html(pageCount);
            } else {
                // $(".page-list ul").prepend(flag).prepend(firstNum);
                $(".page-list ul li:last").html(pageCount);
                // $(".page-list ul li:first").next().html("2");
            }
        }
    },
    // 初始创建页面数据
    creatMarkPage: function() {
        var html = "";
        html +=  '<div class="rate-date">';
        html +=     '<!-- 额定功率content -->';
        html +=     '<div class="basic-content">';
        html +=         '<table class="table-result" id="tableResult">';
        html +=             '<thead>';
        html +=                 '<tr>';
        html +=                      '<th>序号</th>';
        html +=                      '<th>地区</th>';
        html +=                      '<th>区县</th>';
        html +=                      '<th>移动点名称</th>';
        html +=                      '<th>移动站点名称</th>';
        html +=                      '<th>站点总功率（W）</th>';
        html +=                      '<th>操作</th>';
        html +=                 '</tr>';
        html +=             '</thead>';
        html +=             '<tbody class="query-date">';
        html +=             '</tbody>';
        html +=         '</table>';
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
    init: function() {
        var _this = this;
        _this.creatMarkPage();
        // $(".query").on('click',function(){
        // 服务器中获取数据
        $.ajax({
            // url: 'http://10.65.125.146:8080/audit/siteInfo/querySite.do?&pageNo=1&pageSize=10&countyID=1067&cityID=830',
            url: 'testJson/basicDate.json',
            type: 'get',
            dataType: 'json'
        })
            .done(function(data) {
                var basicInfo = data.data;
                $('.number').html(data.totalData);
                // if (data.error_code == 0) {
                //根据总页数判断，如果小于5页，则显示所有页数，如果大于5页，则显示5页。根据当前点击的页数生成
                //总页数
                var pageAll = data.totalData,                                                   //总行数数
                    pageCount = Math.ceil(pageAll/_this.pagesize);                          //总页数
                //总页数
                if(pageCount>5){
                    _this.page_icon(1,pageCount,0);  // 显示分页页码
                }else{
                    _this.page_icon(1,pageCount,0);
                }
                _this.template(basicInfo,pageCount); //显示默认的数据

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
                // 选中显示行
                $('.select-row li').on('click',function(){
                    var text = $(this).html();
                    $('.select-row span').text(text);
                    $(this).parent().hide();  // 隐藏上拉菜单框
                    var page = parseInt(text);
                    pageCount = Math.ceil(pageAll/page); // 重新定义总页数
                    _this.template(basicInfo,pageCount);                // 重新显示分页数据
                    _this.page_icon(1,pageCount,0);                // 重新显示分页页码

                });
                //绑定点击页码跳转
                $('body').on('click', '.page-list ul li', function() {
                    if (pageCount > 5) { //总页数大于5页的时候
                        var pageNum = parseInt($(this).html()); //获取当前点击的页数
                        if (!isNaN(pageNum)) {
                            _this.pageGroup(pageNum,pageCount);     //跳转到指定的页数
                            var index = $(this).text();             // 当前页
                            if (pageNum>6){
                                var flag = $(".page-list ul li:first").clone(true).html("...");
                                var firstNum =  $(".page-list ul li:first").clone(true).html("1");
                                $(".page-list ul").prepend(flag).prepend(firstNum);
                            }
                            _this.pageOne = index;
                            var pageList = (_this.pageOne-1)*(_this.pagesize);  // 要显示的行数
                            _this.template(basicInfo,pageCount); // 显示数据
                        }
                    } else {
                        var index = $(this).text();
                        _this.pageOne = index;
                        _this.template(basicInfo,pageCount);
                        $(this).addClass("curr").siblings("li").removeClass("curr");
                    }
                });
                // 省略号禁用
                $("body").on('mouseover', '.page-list ul li', function() {
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
                    if(pageCount > 5){
                        var pageNum = parseInt($(".page-list li.curr").html());//获取当前页
                        _this.pageUp(pageNum,pageCount);
                        _this.judge(0,pageNum,pageCount);
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index>0){
                            _this.pageOne -= 1;
                            // var down = index;
                            _this.template(basicInfo,pageCount);
                        }else{
                            _this.pageOne = 1;
                            _this.template(basicInfo,pageCount);
                        }

                    }else{
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index > 0){
                            _this.pageOne -= 1;
                            _this.template(basicInfo,pageCount);
                            $(".page-list ul li").removeClass("curr");//清除所有选中
                            $(".page-list ul li").eq(index-1).addClass("curr");//选中上一页
                        }
                    }
                });


                //点击下一页
                $(".pagingDown").click(function(){
                    if(pageCount > 5){
                        var pageNum = parseInt($(".page-list li.curr").html());//获取当前页
                        _this.pageDown(pageNum,pageCount);
                        if(_this.pageOne != pageCount){
                            var index = parseInt($(".page-list ul li.curr").text());//获取当前页
                            _this.pageOne = index;
                            _this.template(basicInfo,pageCount);
                            _this.judge(index);
                        }
                    }else{
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index+1 < pageCount){
                            _this.pageOne = _this.pageOne*1+1;
                            _this.template(basicInfo,pageCount);
                            $(".page-list ul li").removeClass("curr");//清除所有选中
                            $(".page-list ul li").eq(index+1).addClass("curr");//选中上一页
                        }
                    }
                });
                // 点击查看
                $("body").off('click','.through').on('click', '.through', function(){
                    var idText = $(this).siblings("td:first").html();
                    console.log(idText);
                    dialog.openDialog(idText);
                    return false;
                });
                // }
            })
            .fail(function() {
                console.log("分页数据获取失败");
            });

        // });
    }
};
// 智能电表标杆
// // 额定功率标杆
var wattHourMark = {
    pageOne: 1,                                    //当前显示的页数
    pagesize: 10,                                  //每页显示条数
    parentUl: $(".page-list ul"),                  //分页容器
    // 显示查询数据信息
    template: function(basicInfo,pageCount,pageList){
        var  str = '',
            d = basicInfo;
        console.log(basicInfo);
        // 当总页数只有一页
        if (this.pageOne == pageCount) {
            for(var i = (this.pageOne-1)*(this.pagesize);i<d.length;i++){
                str += '<tr>';
                str +=    '<td>'+d[i].id+'</td>';
                str +=    '<td>'+d[i].area+'</td>';
                str +=    '<td>'+d[i].county+'</td>';
                str +=    '<td>'+d[i].accountName+'</td>';
                str +=    '<td>'+d[i].resourceName+'</td>';
                str +=    '<td>'+d[i].oldFinanceName+'</td>';
                str +=    '<td>'+d[i].productNature+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse" >查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        } else {
            for(var j = (this.pageOne-1)*(this.pagesize);j< this.pageOne*this.pagesize;j++){
                str += '<tr>';
                str +=    '<td>'+d[j].id+'</td>';
                str +=    '<td>'+d[j].area+'</td>';
                str +=    '<td>'+d[j].county+'</td>';
                str +=    '<td>'+d[j].accountName+'</td>';
                str +=    '<td>'+d[j].resourceName+'</td>';
                str +=    '<td>'+d[j].oldFinanceName+'</td>';
                str +=    '<td>'+d[j].productNature+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse">查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        }
        // 查询结果
        $(".query-date").html(str);
        $('.query-date').find('tr:even').addClass('even');
        $('.query-date').find('tr:odd').addClass('odd');
    },
    // 分页数据
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
    // 上一页操作
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
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,2);
                break;
            case pageCount:
                this.page_icon(pageCount-4,pageCount,3);
                break;
            default:
                this.page_icon(pageNum-3,pageNum+2,2);
                break;
        }
    },
    // 下一页操作
    pageDown: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,pageCount,1);
                break;
            case 2:
                this.page_icon(1,pageCount,2);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,4);
                break;
            case pageCount:
                break;
            default:
                this.page_icon(pageNum-2,pageCount,3);
                break;
        }
    },
    // 判断省略号
    judge: function(down,up,pageCount){
        var last = pageCount;
        var flag = $(".page-list ul li:first").clone(true).html("...");
        var firstNum =  $(".page-list ul li:first").clone(true).html("1");
        var lastNum =  $(".page-list ul li:first").clone(true).html(last);
        // 下一页判断
        if(down > 8){
            $(".page-list ul").prepend(flag).prepend(firstNum);
        }else if(up < pageCount){   // 上一页
            if (up > 6) {
                $(".page-list ul").prepend(flag).prepend(firstNum);
                $(".page-list ul li:last").html(pageCount);
            } else {
                // $(".page-list ul").prepend(flag).prepend(firstNum);
                $(".page-list ul li:last").html(pageCount);
                // $(".page-list ul li:first").next().html("2");
            }
        }
    },
    // 初始创建页面数据
    creatMarkPage: function() {
        var html = "";
        html +=  '<div class="rate-date">';
        html +=     '<!-- 智能电表content -->';
        html +=     '<div class="basic-content">';
        html +=         '<table class="table-result" id="tableResult">';
        html +=             '<thead>';
        html +=                 '<tr>';
        html +=                      '<th>序号</th>';
        html +=                      '<th>地区</th>';
        html +=                      '<th>区县</th>';
        html +=                      '<th>移动点名称</th>';
        html +=                      '<th>机房或资源点名称</th>';
        html +=                      '<th>智能电表读数</th>';
        html +=                      '<th>动环智能电表测点监控状态</th>';
        html +=                      '<th>更新状态</th>';
        html +=                      '<th>更新时间</th>';
        html +=                      '<th>操作</th>';
        html +=                 '</tr>';
        html +=             '</thead>';
        html +=             '<tbody class="query-date">';
        html +=             '</tbody>';
        html +=         '</table>';
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
    // 分页初始操作
    init: function() {
        // 数据呈现
        var _this = this;
        _this.creatMarkPage();

        // $(".query").on('click',function(){
        // 服务器中获取数据
        $.ajax({
            // url: 'http://10.65.125.146:8080/audit/siteInfo/querySite.do?&pageNo=1&pageSize=10&countyID=1067&cityID=830',
            url: 'testJson/basicDate.json',
            type: 'get',
            dataType: 'json'
        })
            .done(function(data) {
                var basicInfo = data.data;
                $('.number').html(data.totalData);
                // if (data.error_code == 0) {
                //根据总页数判断，如果小于5页，则显示所有页数，如果大于5页，则显示5页。根据当前点击的页数生成
                //总页数
                var pageAll = data.totalData,                                                   //总行数数
                    pageCount = Math.ceil(pageAll/_this.pagesize);                          //总页数
                //总页数
                if(pageCount>5){
                    _this.page_icon(1,pageCount,0);  // 显示分页页码
                }else{
                    _this.page_icon(1,pageCount,0);
                }
                _this.template(basicInfo,pageCount); //显示默认的数据

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
                // 选中显示行
                $('.select-row li').on('click',function(){
                    var text = $(this).html();
                    $('.select-row span').text(text);
                    $(this).parent().hide();  // 隐藏上拉菜单框
                    var page = parseInt(text);
                    pageCount = Math.ceil(pageAll/page); // 重新定义总页数
                    _this.template(basicInfo,pageCount);                // 重新显示分页数据
                    _this.page_icon(1,pageCount,0);                // 重新显示分页页码

                });
                //绑定点击页码跳转
                $('body').on('click', '.page-list ul li', function() {
                    if (pageCount > 5) { //总页数大于5页的时候
                        var pageNum = parseInt($(this).html()); //获取当前点击的页数
                        if (!isNaN(pageNum)) {
                            _this.pageGroup(pageNum,pageCount);     //跳转到指定的页数
                            var index = $(this).text();             // 当前页
                            if (pageNum>6){
                                var flag = $(".page-list ul li:first").clone(true).html("...");
                                var firstNum =  $(".page-list ul li:first").clone(true).html("1");
                                $(".page-list ul").prepend(flag).prepend(firstNum);
                            }
                            _this.pageOne = index;
                            var pageList = (_this.pageOne-1)*(_this.pagesize);  // 要显示的行数
                            _this.template(basicInfo,pageCount); // 显示数据
                        }
                    } else {
                        var index = $(this).text();
                        _this.pageOne = index;
                        _this.template(basicInfo,pageCount);
                        $(this).addClass("curr").siblings("li").removeClass("curr");
                    }
                });
                // 省略号禁用
                $("body").on('mouseover', '.page-list ul li', function() {
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
                    if(pageCount > 5){
                        var pageNum = parseInt($(".page-list li.curr").html());//获取当前页
                        _this.pageUp(pageNum,pageCount);
                        _this.judge(0,pageNum,pageCount);
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index>0){
                            _this.pageOne -= 1;
                            // var down = index;
                            _this.template(basicInfo,pageCount);
                        }else{
                            _this.pageOne = 1;
                            _this.template(basicInfo,pageCount);
                        }

                    }else{
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index > 0){
                            _this.pageOne -= 1;
                            _this.template(basicInfo,pageCount);
                            $(".page-list ul li").removeClass("curr");//清除所有选中
                            $(".page-list ul li").eq(index-1).addClass("curr");//选中上一页
                        }
                    }
                });


                //点击下一页
                $(".pagingDown").click(function(){
                    if(pageCount > 5){
                        var pageNum = parseInt($(".page-list li.curr").html());//获取当前页
                        _this.pageDown(pageNum,pageCount);
                        if(_this.pageOne != pageCount){
                            var index = parseInt($(".page-list ul li.curr").text());//获取当前页
                            _this.pageOne = index;
                            _this.template(basicInfo,pageCount);
                            _this.judge(index);
                        }
                    }else{
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index+1 < pageCount){
                            _this.pageOne = _this.pageOne*1+1;
                            _this.template(basicInfo,pageCount);
                            $(".page-list ul li").removeClass("curr");//清除所有选中
                            $(".page-list ul li").eq(index+1).addClass("curr");//选中上一页
                        }
                    }
                });
                // 点击查看
                $("body").off('click','.through').on('click', '.through', function(){
                    var idText = $(this).siblings("td:first").html();
                    console.log(idText);
                    dialog.openDialog(idText);
                    return false;
                });
                // }
            })
            .fail(function() {
                console.log("分页数据获取失败");
            });

        // });
    }
};

// 开关电源标杆
var switchMark = {
    pageOne: 1,                                    //当前显示的页数
    pagesize: 10,                                  //每页显示条数
    parentUl: $(".page-list ul"),                  //分页容器
    // 显示查询数据信息
    template: function(basicInfo,pageCount,pageList){
        var  str = '',
            d = basicInfo;
        console.log(basicInfo);
        // 当总页数只有一页
        if (this.pageOne == pageCount) {
            for(var i = (this.pageOne-1)*(this.pagesize);i<d.length;i++){
                str += '<tr>';
                str +=    '<td>'+d[i].id+'</td>';
                str +=    '<td>'+d[i].area+'</td>';
                str +=    '<td>'+d[i].county+'</td>';
                str +=    '<td>'+d[i].accountName+'</td>';
                str +=    '<td>'+d[i].resourceName+'</td>';
                str +=    '<td>'+d[i].oldFinanceName+'</td>';
                str +=    '<td>'+d[i].productNature+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse" >查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        } else {
            for(var j = (this.pageOne-1)*(this.pagesize);j< this.pageOne*this.pagesize;j++){
                str += '<tr>';
                str +=    '<td>'+d[j].id+'</td>';
                str +=    '<td>'+d[j].area+'</td>';
                str +=    '<td>'+d[j].county+'</td>';
                str +=    '<td>'+d[j].accountName+'</td>';
                str +=    '<td>'+d[j].resourceName+'</td>';
                str +=    '<td>'+d[j].oldFinanceName+'</td>';
                str +=    '<td>'+d[j].productNature+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse">查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        }
        // 查询结果
        $(".query-date").html(str);
        $('.query-date').find('tr:even').addClass('even');
        $('.query-date').find('tr:odd').addClass('odd');
    },
    // 分页数据
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
    // 上一页操作
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
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,2);
                break;
            case pageCount:
                this.page_icon(pageCount-4,pageCount,3);
                break;
            default:
                this.page_icon(pageNum-3,pageNum+2,2);
                break;
        }
    },
    // 下一页操作
    pageDown: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,pageCount,1);
                break;
            case 2:
                this.page_icon(1,pageCount,2);
                break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,4);
                break;
            case pageCount:
                break;
            default:
                this.page_icon(pageNum-2,pageCount,3);
                break;
        }
    },
    // 判断省略号
    judge: function(down,up,pageCount){
        var last = pageCount;
        var flag = $(".page-list ul li:first").clone(true).html("...");
        var firstNum =  $(".page-list ul li:first").clone(true).html("1");
        var lastNum =  $(".page-list ul li:first").clone(true).html(last);
        // 下一页判断
        if(down > 8){
            $(".page-list ul").prepend(flag).prepend(firstNum);
        }else if(up < pageCount){   // 上一页
            if (up > 6) {
                $(".page-list ul").prepend(flag).prepend(firstNum);
                $(".page-list ul li:last").html(pageCount);
            } else {
                // $(".page-list ul").prepend(flag).prepend(firstNum);
                $(".page-list ul li:last").html(pageCount);
                // $(".page-list ul li:first").next().html("2");
            }
        }
    },
    // 初始创建页面数据
    creatMarkPage: function() {
        var html = "";
        html +=  '<div class="rate-date">';
        html +=     '<!--开关电源content -->';
        html +=     '<div class="basic-content">';
        html +=         '<table class="table-result" id="tableResult">';
        html +=             '<thead>';
        html +=                 '<tr>';
        html +=                      '<th>序号</th>';
        html +=                      '<th>地区</th>';
        html +=                      '<th>区县</th>';
        html +=                      '<th>移动点名称</th>';
        html +=                      '<th>机房或资源点名称</th>';
        html +=                      '<th>闲忙时开关电源负载电流</th>';
        html +=                      '<th>开关电源浮充电压</th>';
        html +=                      '<th>更新状态</th>';
        html +=                      '<th>更新时间</th>';
        html +=                      '<th>操作</th>';
        html +=                 '</tr>';
        html +=             '</thead>';
        html +=             '<tbody class="query-date">';
        html +=             '</tbody>';
        html +=         '</table>';
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
    init: function() {
        var _this = this;
        _this.creatMarkPage();
        // $(".query").on('click',function(){
        // 服务器中获取数据
        $.ajax({
            // url: 'http://10.65.125.146:8080/audit/siteInfo/querySite.do?&pageNo=1&pageSize=10&countyID=1067&cityID=830',
            url: 'testJson/basicDate.json',
            type: 'get',
            dataType: 'json'
        })
            .done(function(data) {
                var basicInfo = data.data;
                $('.number').html(data.totalData);
                // if (data.error_code == 0) {
                //根据总页数判断，如果小于5页，则显示所有页数，如果大于5页，则显示5页。根据当前点击的页数生成
                //总页数
                var pageAll = data.totalData,                                                   //总行数数
                    pageCount = Math.ceil(pageAll/_this.pagesize);                          //总页数
                //总页数
                if(pageCount>5){
                    _this.page_icon(1,pageCount,0);  // 显示分页页码
                }else{
                    _this.page_icon(1,pageCount,0);
                }
                _this.template(basicInfo,pageCount); //显示默认的数据

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
                // 选中显示行
                $('.select-row li').on('click',function(){
                    var text = $(this).html();
                    $('.select-row span').text(text);
                    $(this).parent().hide();  // 隐藏上拉菜单框
                    var page = parseInt(text);
                    pageCount = Math.ceil(pageAll/page); // 重新定义总页数
                    _this.template(basicInfo,pageCount);                // 重新显示分页数据
                    _this.page_icon(1,pageCount,0);                // 重新显示分页页码

                });
                //绑定点击页码跳转
                $('body').on('click', '.page-list ul li', function() {
                    if (pageCount > 5) { //总页数大于5页的时候
                        var pageNum = parseInt($(this).html()); //获取当前点击的页数
                        if (!isNaN(pageNum)) {
                            _this.pageGroup(pageNum,pageCount);     //跳转到指定的页数
                            var index = $(this).text();             // 当前页
                            if (pageNum>6){
                                var flag = $(".page-list ul li:first").clone(true).html("...");
                                var firstNum =  $(".page-list ul li:first").clone(true).html("1");
                                $(".page-list ul").prepend(flag).prepend(firstNum);
                            }
                            _this.pageOne = index;
                            var pageList = (_this.pageOne-1)*(_this.pagesize);  // 要显示的行数
                            _this.template(basicInfo,pageCount); // 显示数据
                        }
                    } else {
                        var index = $(this).text();
                        _this.pageOne = index;
                        _this.template(basicInfo,pageCount);
                        $(this).addClass("curr").siblings("li").removeClass("curr");
                    }
                });
                // 省略号禁用
                $("body").on('mouseover', '.page-list ul li', function() {
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
                    if(pageCount > 5){
                        var pageNum = parseInt($(".page-list li.curr").html());//获取当前页
                        _this.pageUp(pageNum,pageCount);
                        _this.judge(0,pageNum,pageCount);
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index>0){
                            _this.pageOne -= 1;
                            // var down = index;
                            _this.template(basicInfo,pageCount);
                        }else{
                            _this.pageOne = 1;
                            _this.template(basicInfo,pageCount);
                        }

                    }else{
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index > 0){
                            _this.pageOne -= 1;
                            _this.template(basicInfo,pageCount);
                            $(".page-list ul li").removeClass("curr");//清除所有选中
                            $(".page-list ul li").eq(index-1).addClass("curr");//选中上一页
                        }
                    }
                });


                //点击下一页
                $(".pagingDown").click(function(){
                    if(pageCount > 5){
                        var pageNum = parseInt($(".page-list li.curr").html());//获取当前页
                        _this.pageDown(pageNum,pageCount);
                        if(_this.pageOne != pageCount){
                            var index = parseInt($(".page-list ul li.curr").text());//获取当前页
                            _this.pageOne = index;
                            _this.template(basicInfo,pageCount);
                            _this.judge(index);
                        }
                    }else{
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index+1 < pageCount){
                            _this.pageOne = _this.pageOne*1+1;
                            _this.template(basicInfo,pageCount);
                            $(".page-list ul li").removeClass("curr");//清除所有选中
                            $(".page-list ul li").eq(index+1).addClass("curr");//选中上一页
                        }
                    }
                });
                // 点击查看
                $("body").off('click','.through').on('click', '.through', function(){
                    var idText = $(this).siblings("td:first").html();
                    console.log(idText);
                    dialog.openDialog(idText);
                    return false;
                });
                // }
            })
            .fail(function() {
                console.log("分页数据获取失败");
            });

        // });
    }
};
