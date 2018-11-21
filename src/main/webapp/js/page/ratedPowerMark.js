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

var addBasicDate = {
    pageOne: 1, //当前显示的页数
    pagesize: 10, //每页显示条数
    parentUl: $(".page-list ul"),
    template: function(data,pageCount,pageList){
        var  str = '',
             d = data;
        // 当总页数只有一页
        if (this.pageOne == pageCount) {
            for(var i = (this.pageOne-1)*(this.pagesize);i<d.length;i++){
                str += '<tr>'; 
                str +=    '<td>';
                str +=       '<input type="checkbox">';  
                str +=    '</td>';
                str +=    '<td>'+d[i].cityName+'</td>';
                str +=    '<td>'+d[i].districtName+'</td>';
                str +=    '<td>'+d[i].reimbur+'</td>';
                str +=    '<td>'+d[i].site+'</td>';
                str +=    '<td>'+d[i].oldName+'</td>';
                str +=    '<td>'+d[i].nature+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="../../img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse" >'+d[i].detailed+'</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        } else {
            for(var j = (this.pageOne-1)*(this.pagesize);j< this.pageOne*this.pagesize;j++){
                str += '<tr>';
                str +=    '<td>';
                str +=       '<input type="checkbox">';  
                str +=    '</td>';
                str +=    '<td>'+d[j].cityName+'</td>';
                str +=    '<td>'+d[j].districtName+'</td>';
                str +=    '<td>'+d[j].reimbur+'</td>';
                str +=    '<td>'+d[j].site+'</td>';
                str +=    '<td>'+d[j].oldName+'</td>';
                str +=    '<td>'+d[j].nature+'</td>';
                str +=    '<td class="through">';
                str +=         '<img src="../../img/search_icon.png"/>';
                str +=         '<a href="javascript:void(0)" class="browse">'+d[j].detailed+'</a>';
                str +=     '</td>';
                str += '</tr>';
            }
        }
        // 查询结果
        $(".query-date").html(str);
        $('.query-date').find('tr:even').addClass('even');   
        $('.query-date').find('tr:odd').addClass('odd');
    },
    page_icon: function(cPage,count,eq,parentUl){
        //根据当前选中页生成页面点击按钮
        var ul_html = '';
        for(var i=cPage;i<=count;i++){
            ul_html += '<li>'+i+'</li>';
        }
        $(".page-list ul").html(ul_html);
        // $(".page-list ul").find("li:gt(2)").not("li:last()").prev().hide(); // 前两个元素和最后两个元素之间的元素隐藏
        $(".page-list ul li").eq(eq).addClass("curr");
        // if (count >= 4) {
        //     $(".page-list ul li").eq(count-2).html("...");
        // }
    },
    //点击跳转页面显示的数据
    pageGroup: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
                this.page_icon(1,pageCount,0);
            break;
            case 2:
                this.page_icon(1,5,1);
            break;
            case pageCount-1:
                this.page_icon(pageCount-4,pageCount,3);
            break;
            case pageCount:
                this.page_icon(pageCount-4,pageCount,4);
            break;
            default:
                this.page_icon(pageNum-2,pageNum+2,2);
            break;
        }
    },
    pageUp: function(pageNum,pageCount){
        switch(pageNum){
            case 1:
            break;
            case 2:
                this.page_icon(1,5,0);
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
                this.page_icon(pageNum-2,pageNum+2,3);
            break;
        }
    },
    init: function() {
        // var _this =  this;
        console.log('测试');
        // 数据呈现
        var _this = this;
        creatBasicPage();
        
        function creatBasicPage() {
            var html = "";
                html +=  '<div class="basic-date">';
                html +=     '<!-- 基础数据title -->';
                html +=     '<div class="search-title">';
                html +=         '<div class="select-all">';
                html +=             '<select class="city selectDistable">';
                html +=                 '<option>==市==</option>';
                html +=             '</select>'; 
                html +=             '<select class="district selectDistable">';
                html +=                 '<option>==区==</option>';
                html +=             '</select>'; 
                html +=          '</div>';
                html +=          '<div class="select-name"><input type="text" value="报账点"/></div>';
                html +=          '<div class="query">搜索</div>';
                html +=     '</div>';
                html +=     '<!-- 基础数据content -->';
                html +=     '<div class="basic-content">';
                html +=         '<table class="table-result" id="tableResult">';
                html +=             '<thead>';
                html +=                 '<tr>';
                html +=                      '<th><input type="checkbox" /></th>';
                html +=                      '<th>地区</th>';
                html +=                      '<th>区县</th>';
                html +=                      '<th>报账点名称</th>';
                html +=                      '<th>资管站点名称</th>';
                html +=                      '<th>原财务站点名称</th>';
                html +=                      '<th>产权性质</th>';
                html +=                      '<th>详细信息</th>';
                html +=                 '</tr>';
                html +=             '</thead>';
                html +=             '<tbody class="query-date">';
                html +=             '</tbody>';
                html +=         '</table>';
                html +=     '</div>';
                html +=     '<!-- 基础数据footer -->';
                html +=     '<div class="basic-footer">';
                html +=         '<div class="footer">'
                html +=             '<div class="current-page">显示行</div>';
                html +=             '<div class="select-row">';
                html +=                 '<span>10</span>'   
                html +=                 '<ul>';
                html +=                     '<li>30</li>';
                html +=                     '<li>20</li>';
                html +=                     '<li>15</li>';
                html +=                     '<li>10</li>';
                html +=                 '</ul>';
                html +=             '</div>';
                html +=             '<div class="pageUp">上一页</div>';
                html +=             '<div class="page-list">';
                html +=                 '<ul>';
                html +=                     '<li class="curr">1</li>';
                html +=                     '<li>2</li>';
                html +=                     '<li>3</li>';
                html +=                     '<li>...</li>';
                html +=                 '</ul>';
                html +=             '</div>';
                html +=             '<div class="pageDown">下一页</div>';
                html +=             '<div class="down-load"><a data-type="xls" class="down">下载EXCEL</a></div>';
                html +=          '</div>';
                html +=     '</div>';
                html +=  '</div>';

            $('#contentBox').css('background','#f6f6f8').html(html);
        }
        $.ajax({
            url: 'test.json',
            type: 'get',
            dataType: 'json'
        })
        .done(function(data) {
            // if (data.error_code == 0) {
                //根据总页数判断，如果小于5页，则显示所有页数，如果大于5页，则显示5页。根据当前点击的页数生成
                //总页数
                var pageAll = data.length; //总条数
                console.log(pageAll);
                // page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;
                var pageCount = Math.ceil(pageAll/_this.pagesize); //总页数
                if(pageCount>4){
                    _this.page_icon(1,pageCount,0);  // 分页页码
                }else{
                    _this.page_icon(1,pageCount,0);
                }
                _this.template(data,data,pageCount); //默认显示的数据

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
                        console.log('b');
                        $(this).addClass('curr').siblings().removeClass('curr');
                    },
                    function(){
                        $(this).removeClass('curr');
                    }
                );
                // 选中显示行
                $('.select-row').find('li').on('click',function(){
                    var text = $(this).html();
                    $('.select-row span').text(text);
                    $(this).parent().hide();
                    _this.pagesize = parseInt(text);
                    pageCount = Math.ceil(pageAll/_this.pagesize); // 重新定义总页数
                    _this.template(data,pageCount);
                    _this.page_icon(1,pageCount,0);
                });
                //点击页码
                $("body").on('click', '.page-list ul li', function() {
                    console.log('c');
                    if (pageCount > 5) { //总页数大于5页的时候
                        var pageNum = parseInt($(this).html());//获取当前页数
                        _this.pageGroup(pageNum,pageCount);

                        var index = $(this).text();
                        _this.pageOne = index;
                        var pageList = (_this.pageOne-1)*(_this.pagesize); 
                        _this.template(data,pageCount);
                    } else {
                        var index = $(this).text();
                        _this.pageOne = index;
                        _this.template(data,pageCount);

                        $(this).addClass("curr").siblings("li").removeClass("curr");
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

                //点击上一页
                $(".pageUp").click(function(){
                    console.log('上')
                    if(pageCount > 5){
                        var pageNum = parseInt($(".page-list li.curr").html());//获取当前页
                        _this.pageUp(pageNum,pageCount);
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index>0){
                            _this.pageOne -= 1;
                            _this.template(data,pageCount);
                        }else{
                            _this.pageOne = 1;
                            _this.template(data,pageCount);
                        }

                    }else{
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index > 0){
                            _this.pageOne -= 1;
                            _this.template(data,pageCount);
                            $(".page-list ul li").removeClass("curr");//清除所有选中
                            $(".page-list ul li").eq(index-1).addClass("curr");//选中上一页
                        }
                    }
                });
                
                //点击下一页
                $(".pageDown").click(function(){
                    console.log('下')

                    if(pageCount > 5){
                        var pageNum = parseInt($(".page-list li.curr").html());//获取当前页
                        _this.pageDown(pageNum,pageCount);
                        if(_this.pageOne != pageCount){
                            var index = $(".page-list ul li.curr").text();//获取当前页
                            _this.pageOne = index;
                            _this.template(data,pageCount);
                        }
                    }else{
                        var index = $(".page-list ul li.curr").index();//获取当前页
                        if(index+1 < pageCount){
                            _this.pageOne = _this.pageOne*1+1;
                            _this.template(data,pageCount);
                            $(".page-list ul li").removeClass("curr");//清除所有选中
                            $(".page-list ul li").eq(index+1).addClass("curr");//选中上一页
                        }
                    }
                });
                // 点击查看
                $("body").on('click', '.through', function(){
                    dialog.openDialog();
                });
            // }
        })
        .fail(function() {
            console.log("分页数据获取失败");
        });
    }
};
