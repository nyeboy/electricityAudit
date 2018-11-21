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
        allowRole:["province","city"],//province（省）/city（市）/manager（经办人）
        child:[
            {
                value:"基础数据呈现",
                id:"displayData",
                clickFun:function (contentBox,routBox) {    
                    addBasicDate.init();
                    addBasicDate.initCity();        //市区联动
                    var info = document.createElement("div");
                    info.className = "right-router";
                    // var infoes = "报账点 | <span>共<i class='number'></i>个</span>";
                    info.innerHTML = "报账点 | <span>共<i class='number'></i>个</span>";
                    routBox.appendChild(info);
                }
            }
        ]
    }
]);
var addBasicDate = {
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
    //初始创建页面数据
    creatBasicPage: function() {
            var html = "";
                html +=  '<div class="basic-date">';
                html +=     '<!-- 基础数据title -->';
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
                html +=     '<!-- 基础数据content -->';
                html +=     '<div class="basic-content">';
                html +=         '<table class="table-result" id="tableResult">';
                html +=             '<colgroup>';
                html +=                 '<col style="width:5%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:10%" />';
                html +=                 '<col style="width:9%" />';
                html +=             '</colgroup>';
                html +=             '<thead>';
                html +=                 '<tr>';
                html +=                      '<th>序号</th>';
                html +=                      '<th>地区</th>';
                html +=                      '<th>区县</th>';
                html +=                      '<th>报账点名称</th>';
                html +=                      '<th>资管站点名称</th>';
                html +=                      '<th>原财务站点名称</th>';
                html +=                      '<th>产权性质</th>';
                html +=                      '<th>详细信息</th>';
                html +=                 '</tr>';
                html +=             '</thead>';
                html +=         '</table>';
                html +=         '<div class="tbody-box">';
                html +=         '<table class="table-result">'
                html +=             '<colgroup>';
                html +=                 '<col style="width:5%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:20%" />';
                html +=                 '<col style="width:10%" />';
                html +=                 '<col style="width:9%" />';
                html +=             '</colgroup>';
                html +=             '<tbody class="query-date">';
                html +=             '</tbody>';
                html +=         '</table>'
                html +=         '</div>';
                html +=     '</div>';
                html +=     '<!-- 基础数据footer -->';
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
    template: function(basicInfo,pageCount,pageOne){
        var  str = '',
             d = basicInfo;
        var _this = this;
        // 当总页数只有一页
        if (this.pageOne == pageCount) {
            for(var i = 0 ;i<d.length;i++){
                str += '<tr data-cityId="'+d[i].id+'">'; 
                str +=    '<td>'+[(pageOne-1)*_this.pagesize+1+i]+'</td>';
                str +=    '<td>'+d[i].area+'</td>';
                str +=    '<td>'+d[i].county+'</td>';
                str +=    '<td>'+d[i].accountName+'</td>';
                str +=    '<td>'+d[i].resourceName+'</td>';
                str +=    '<td>'+d[i].oldFinanceName+'</td>';
                str +=    '<td>'+d[i].productNature+'</td>';
                str +=    '<td class="through" data-name="name'+ [i] +'">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse">查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        } else {
            for(var j = 0 ;j<d.length;j++){
                str += '<tr data-cityId="'+d[j].id+'">';
                str +=    '<td>'+[(pageOne-1)*_this.pagesize+1+j]+'</td>';
                str +=    '<td>'+d[j].area+'</td>';
                str +=    '<td>'+d[j].county+'</td>';
                str +=    '<td>'+d[j].accountName+'</td>';
                str +=    '<td>'+d[j].resourceName+'</td>';
                str +=    '<td>'+d[j].oldFinanceName+'</td>';
                str +=    '<td>'+d[j].productNature+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse" data-name="name'+ [j] +'" >查看</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        }
        // 查询结果
        $(".query-date").html(str);
        $('.query-date').find('tr:even').addClass('even');   
        $('.query-date').find('tr:odd').addClass('odd');
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
        var url = Interface.get("DS","getBasicData");   //获取基础数据地址
        // 服务器中获取数据
        $.ajax({
            type:"get",
            // url:"http://120.77.81.69:8080/audit/siteInfo/querySite.do?",
            url:url,
            // url: 'testJson/basicDate.json',
            dataType:"json",
            data:{pageNo:pageOne,pageSize:pagesize,countyId:countyId,cityId:cityId,siteName:siteName}
        })
        .done(function(data) {
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
    // 初始渲染页面
    init: function() {
        var _this = this;
        _this.initCity();
        _this.creatBasicPage();  //创建页面
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
         // 下载 EXCEL 文件
        $('body').on('click','.down-load a',function(e){
            console.log('a');
            e.preventDefault();
            if(e.target.nodeName === "A"){
                tableExport('tableResult', '数据呈现', e.target.getAttribute('data-type'));
            }
        });
        // 点击查看详情
        $("body").off('click', '.through').on('click', '.through', function(){
            var idText = $(this).parent().attr("data-cityId");
            dialog.openDialog(idText);
            return false;
        });
        // 加载城市信息
        $("#city").on("change",function(){
            _this.setCity = true;
            _this.initDistrict();
        });
    }
};
