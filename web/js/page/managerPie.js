/* 经办人主页 */
var managerPie = {
	pageOne: 1,                                   //当前显示的页数
    pagesize: 10,                                 //每页显示条数
    pageCount: "",                                //总页数
    pageAll: "",                                  //信息总条数
    currentPage: "",                              //当前设置显示行数
    setPage: false,                               //是否设置
    setCity: false,                               //城市设置
    roleType: 2,
	// 初始化
	init: function(config){
       this.roleType=userSetObj.judgeUser(getUserData()).userLevel;
        if(this.roleType == 2) {
            this.div = $(config.id);    //初始化获取元素
            this.render();              // 渲染页面
        }
	},
	// 饼图创建
	creatPie: function(){
		var dom = document.getElementById("pie-chart");
        var container = document.getElementById("home-page");
        //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        function resizedom () {
            dom.style.width = (container.clientWidth)+'px';
            dom.style.height = (container.clientHeight - 200)+'px';
        };
        //设置容器高宽
        resizedom(); 
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		option = {
        	title : {
	            text: '稽核单状态统计',
	            x:'center',
	            y: '5%',
	            textStyle: {
	            color: '#585c5e',
	            fontSize: '18'
	            }
          	},
          	tooltip : {   // 鼠标移入，弹出框内容
              trigger: 'item',
              formatter: "{a} <br/>{b} {c}:  ({d}%)"
          	},
            legend: {
              orient: 'vertical',
              x: '80%',
              y: '10%',
              data: ['等待提交稽核','审批中','等待提交审核','审批通过','被驳回','等待推送至财务','等待推送报销发起人','推送成功'],
              height: dom.style.height,
              width: dom.style.width 
          	},
          	series : [
              	{
                	name: '访问来源',
                  	type: 'pie',
                  	radius : '70%',
                  	center: ['50%', '57%'], //扇形图坐标位置
                  	data:[
                      	{value:335, name:'等待提交稽核'},
                      	{value:310, name:'审批中'},
                      	{value:234, name:'等待提交审核'},
                      	{value:1356, name:'审批通过'},
                      	{value:154,name:'被驳回'},
                      	{value:1256,name:'等待推送至财务'},
                      	{value:814,name:'等待推送报销发起人'},
                      	{value:763,name:'推送成功'},
                  	],
                  	itemStyle: {
                      	emphasis: {
                          	shadowBlur: 10,
                          	shadowOffsetX: 0,
                          	shadowColor: 'rgba(0, 0, 0, 0.5)'
                    	}
                  	}
              	}
          	],
	          	color: [   //饼图颜色配置
	          		'#ffa726',
	          		'#f2615e',
	          		'#26c6da',
	          		'#9ccc65',
	          		'#fb81cf',
	          		'#7d7ff3',
	          		'#e1d95a',
	          		'#5fa4f2'
	          	]
        	};
		if (option && typeof option === "object") {
		    myChart.setOption(option, true);
		};
        //用于使chart自适应高度和宽度
        window.onresize = function () {
            //重置容器高宽
            resizedom();
            myChart.resize();
        };
	},
	// 数据表格创建
    creatMarkPage: function() {
            var html = "";
                html +=  '<div class="rate-date">';
                html +=     '<!-- 额定功率content -->';
                html +=     '<div class="basic-content">';
                html +=         '<table class="table-result" id="tableResult">';
                html +=             '<colgroup>';
                html +=                 '<col style="width:17%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:17%" />';
                html +=                 '<col style="width:10%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=             '</colgroup>';
                html +=             '<thead>';
                html +=                 '<tr>';
                html +=                      '<th>稽核单流水号</th>';
                html +=                      '<th>地区</th>';
                html +=                      '<th>区县</th>';
                html +=                      '<th>稽核单状态</th>';
                html +=                      '<th>报账点名称</th>';
                html +=                      '<th>建单时间</th>';
                html +=                      '<th>电量(度)</th>';
                html +=                      '<th>金额（元）</th>';
                html +=                      '<th>同比上个月涨幅</th>';
                html +=                      '<th>操作</th>';
                html +=                 '</tr>';
                html +=             '</thead>';
                html +=         '</table>';
                html +=         '<table class="table-result">'
                html +=             '<colgroup>';
                html +=                 '<col style="width:17%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:17%" />';
                html +=                 '<col style="width:10%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=                 '<col style="width:8%" />';
                html +=             '</colgroup>';
                html +=             '<tbody class="query-date">';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879900</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>锦江区金像寺001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>10059</td>';
                html +=                     '<td>15088.5</td>';
                html +=                     '<td>5</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879901</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>锦江区锦城逸景001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>10059</td>';
                html +=                     '<td>15088.5</td>';
                html +=                     '<td>5</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879902</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>锦江区岷山饭店001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>8467</td>';
                html +=                     '<td>12700.5</td>';
                html +=                     '<td>2</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879903</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>成都锦江区朗御001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>6042</td>';
                html +=                     '<td>9063</td>';
                html +=                     '<td>3</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879904</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>成都锦江区金殿城1800001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>10059</td>';
                html +=                     '<td>13665</td>';
                html +=                     '<td>1</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                     '<td>JH201703171489730879905</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>锦江区刘家花园四季中心001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>8467</td>';
                html +=                     '<td>1456</td>';
                html +=                     '<td>2</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879906</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>锦江区上海东韵001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>9313</td>';
                html +=                     '<td>9063</td>';
                html +=                     '<td>3</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879907</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>成都锦江区福利旅馆001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>9772</td>';
                html +=                     '<td>13632</td>';
                html +=                     '<td>1</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879907</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>成都锦江区金殿城1800001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>9586</td>';
                html +=                     '<td>14023</td>';
                html +=                     '<td>1</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879907</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>成都锦江区锦华茶坊001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>9314</td>';
                html +=                     '<td>11589</td>';
                html +=                     '<td>1</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=                 '<tr>';
                html +=                     '<td>JH201703171489730879907</td>';
                html +=                     '<td>成都</td>';
                html +=                     '<td>锦江区</td>';
                html +=                     '<td>等待提交审批</td>';
                html +=                     '<td>成都锦江区蓝光香槟广场001</td>';
                html +=                     '<td>2017-3-17</td>';
                html +=                     '<td>9398</td>';
                html +=                     '<td>13982</td>';
                html +=                     '<td>1</td>';
                html +=                     '<td class="through">';
                html +=                         '<img src="img/search_icon.png"/>';
                html +=                         '<a href="javascript:void(0)" class="browse" >查看</a>';
                html +=                     '</td>';
                html +=                 '</tr>';
                html +=             '</tbody>';
                html +=         '</table>';
                html +=     '</div>';
                html +=     '<!-- 额定功率footer -->';
                // html +=     '<div class="basic-footer">';
                // html +=         '<div class="footer">'
                // html +=             '<div class="current-page">显示行</div>';
                // html +=             '<div class="select-row">';
                // html +=                 '<span>10</span>'   
                // html +=                 '<ul>';
                // html +=                     '<li>100</li>';
                // html +=                     '<li>50</li>';
                // html +=                     '<li>20</li>';
                // html +=                     '<li>10</li>';
                // html +=                 '</ul>';
                // html +=             '</div>';
                // html +=             '<div class="pagingUp">上一页</div>';
                // html +=             '<div class="page-list">';
                // html +=                 '<ul>';
                // html +=                     '<li class="curr">1</li>';
                // html +=                 '</ul>';
                // html +=             '</div>';
                // html +=             '<div class="pagingDown">下一页</div>';
                // html +=          '</div>';
                // html +=     '</div>';
                html +=  '</div>';
			// $(".basic-footer").css("position","relative");
            $('.data-table').html(html).hide();
    },
    //  //显示查询数据信息
    // template: function(basicInfo,pageCount,pageList){
    //     var  str = '',
    //          d = basicInfo;
    //     // 当总页数只有一页
    //     if (this.pageOne == pageCount) {
    //         for(var i = 0 ;i<d.length;i++){
    //             str += '<tr>'; 
    //             str +=    '<td>'+d[i].id+'</td>';
    //             str +=    '<td>'+d[i].area+'</td>';
    //             str +=    '<td>'+d[i].county+'</td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td class="through">';
    //             str +=         '<img src="img/search_icon.png"/>';
    //             str +=         '<a href="javascript:void(0)" class="browse" >查看</a>';
    //             str +=     '</td>';
    //             str += '</tr>';
    //         }
    //     } else {
    //         for(var j = 0 ;j<d.length;j++){
    //             str += '<tr>';
    //             str +=    '<td>'+d[j].id+'</td>';
    //             str +=    '<td>'+d[j].area+'</td>';
    //             str +=    '<td>'+d[j].county+'</td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td></td>';
    //             str +=    '<td class="through">';
    //             str +=         '<img src="img/search_icon.png"/>';
    //             str +=         '<a href="javascript:void(0)" class="browse">查看</a>';
    //             str +=     '</td>';
    //             str += '</tr>';
    //         }
    //     }
    //     // 查询结果
    //     $(".query-date").html(str);
    //     $('.query-date').find('tr:even').addClass('even');   
    //     $('.query-date').find('tr:odd').addClass('odd');
    // },
    // //分页数据
    // page_icon: function(cPage,count,eq,parentUl){
    //     //根据当前选中页生成页面点击按钮
    //     var ul_html = '';
    //     for(var i = cPage;i<=count;i++){
    //         ul_html += '<li>'+i+'</li>';
    //     }
    //     $(".page-list ul").html(ul_html);
    //     $(".page-list ul li:gt(3)").not(":last()").hide(); // 3到最后一个之间隐藏
    //     var len = $(".page-list ul li").length;
    //     if (len>=6) {
    //         $(".page-list ul li:last").prev().html("...").show();
    //     }else {
    //         $(".page-list ul li").show();
    //     }
        
    //     $(".page-list ul li").eq(eq).addClass("curr");
    // },
    // //点击跳转页面显示的数据
    // pageGroup: function(pageNum,pageCount){
    //     switch(pageNum){
    //         case 1:
    //             this.page_icon(1,pageCount,0);
    //             break;
    //         case 2:
    //             this.page_icon(1,pageCount,1);
    //             break;
    //         case pageCount-2:
    //             this.page_icon(pageCount-4,pageCount,2);
    //             break;
    //         case pageCount-1:
    //             this.page_icon(pageCount-4,pageCount,3);
    //             break;
    //         case pageCount:
    //             this.page_icon(pageCount-4,pageCount,4);
    //             break;
    //         default:
    //             this.page_icon(pageNum-1,pageCount,1);
    //             break;
    //     }
    // },
    // //上一页操作
    // pageUp: function(pageNum,pageCount){
    //     switch(pageNum){
    //         case 1:
    //             break;
    //         case 2:
    //             this.page_icon(1,6,0);
    //             break;
    //         case 3: 
    //             this.page_icon(1,6,1);
    //             break;
    //         case 4:
    //             this.page_icon(1,6,2);
    //             break;
    //         case 5:
    //             this.page_icon(1,6,3);
    //             break;
    //         case pageCount-1:
    //             this.page_icon(pageCount-4,pageCount,2);
    //             break;
    //         case pageCount:
    //             this.page_icon(pageCount-4,pageCount,3);
    //             break;
    //         default:
    //             this.page_icon(pageNum-2,pageNum+2,1);
    //             break; 
    //     }   
    // },
    // //下一页操作
    // pageDown: function(pageNum,pageCount){
    //     switch(pageNum){
    //         case 1:
    //             this.page_icon(1,pageCount,1);
    //             break;
    //         case 2:
    //             this.page_icon(1,pageCount,2);
    //             break;
    //         case pageCount-1:
    //             this.page_icon(pageCount-4,pageCount,4);  //倒数第一页
    //             break;
    //          case pageCount-2:
    //             this.page_icon(pageCount-4,pageCount,3);  //倒数第二页
    //             break;
    //         case pageCount-3:
    //             this.page_icon(pageCount-4,pageCount,2);  //倒数第三页
    //             break;
    //         case pageCount:                               //最后一页
    //             break;
    //         default:
    //             this.page_icon(pageNum,pageCount,1);
    //             break;
    //     }
    // },
    // //判断省略号
    // judge: function(down,up,pageCount){
    //         var last = pageCount;
    //         var flag = $(".page-list ul li:first").clone(true).html("...");
    //         var firstNum =  $(".page-list ul li:first").clone(true).html("1");
    //         var lastNum =  $(".page-list ul li:first").clone(true).html(last);
    //         // 下一页判断
    //         if(down > 3){
    //             $(".page-list ul").prepend(flag).prepend(firstNum);
    //         }else if(up < pageCount){   // 上一页
    //             if (up >6) {
    //                 $(".page-list ul").prepend(flag).prepend(firstNum);
    //                 $(".page-list ul li:last").html(pageCount);
    //             } else {
    //                 if(up>4 && up<6) {
    //                     $(".page-list ul").prepend(flag).prepend(firstNum);
    //                 }
    //                 $(".page-list ul li:last").html(pageCount).prev().html("...");
    //             }
    //         }
    // },
    // //请求数据
    // ajaxGetDate: function(pageOne,pagesize,countyID,cityID){
    //     var _this = this;
    //     // 服务器中获取数据
    //     $.ajax({
    //         type:"get",
    //         url:"http://localhost:8080/audit/siteInfo/querySite.do?",
    //         // url: 'testJson/basicDate.json',
    //         dataType:"json",
    //         data:{pageNo:pageOne,pageSize:pagesize}
    //     })
    //     .done(function(data) {          
    //         var basicInfo = data.data;                                                // 每页的行数
    //         $('.number').html(data.totalData);                                        // 总报账点个数显示
    //         //总页数
    //         _this.pageAll = data.totalData;                                           //信息总条数
    //         _this.pageCount = Math.ceil(_this.pageAll/_this.pagesize);                //总页数
    //         if(_this.pageOne == 1 || _this.setPage == true) {                         //初始创建分页页码 
    //             _this.page_icon(1,_this.pageCount,0);                                 
    //         }
    //         _this.template(basicInfo,_this.pageCount);                                //渲染页面显示数据
    //     })
    //     .fail(function() {
    //         console.log("分页数据获取失败");
    //     });
    // },
    // 查看详情
    viewDetails: function(data) {
        var
            sureBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"确定"),
            tableBox=new TableCM({
                border:true,
                default:true,
                cellWidth:["33%","33%","33%"],
                valueKey:["column1","column2","column3"]
            });
        var fullContentData=[
            {
                column1:createInputUnit("所属省:",["四川省"],true),
                column2:createInputUnit("所属市:",["成都市"],true),
                column3:createInputUnit("所属县/区:",["锦江区"],true)
            },
            {
                column1:createInputUnit("报销部门:",["四川省"],true),
                column2:createInputUnit("预付开始时间:",["2017-02-01"],true),
                column3:createInputUnit("预付结束时间:",["2017-03-01"],true)
            },
            {
                column1:createInputUnit("预付总金额:",[Number(Math.random()*5000).toFixed(2)],true),
                column2:createInputUnit("预付供应商:",["四川省移动网络技术有限公司"],true),
                column3:createInputUnit("上传附件:",["HHDSA2017028.JPG"],true)
            },
            {
                column1:createInputUnit("合同ID:",["CG2017030258664"],true),
                column2:"",
                column3:""
            }
        ];
            tableBox.full(fullContentData);
        var td=tableBox.tableContent.insertRow().insertCell(0);
            td.appendChild(
                createInputUnit("备注:",["提交财务才可以报销"],false,"width:11.45%;vertical-align:top;")
            );
            td.colSpan=3;


        addMetaerDialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">查看详情</div>');
        addMetaerDialog.fullContent(tableBox.tableBox);
        addMetaerDialog.fullFooter([sureBtn]);
        addMetaerDialog.show();
        //事件绑定
        sureBtn.addEventListener("click",function (e) {
            e.stopPropagation();
            addMetaerDialog.hide();
        })
    },
    // 初始渲染页面
    creatPieTable: function() {
        var _this = this;
        _this.creatMarkPage();  //创建页面
        // _this.ajaxGetDate(_this.pageOne,_this.pagesize);// 初始渲染

        // // 搜索框输入
        // $(".select-name input").on("change",function(){
        //     // 文字输入
        //     var textInput = $(".select-name input").val();
        //     $(this).val(textInput);
        // });
        // // 设置显示行数
        // $('.select-row span').on('click',function(){
        //     if( $('.select-row ul').is(':hidden')){
        //         $('.select-row ul').show();
        //     } else {
        //         $('.select-row ul').hide();
        //     }
        // });
        // // 显示行移入移出效果
        // $('.select-row').find('li').hover(
        //     function(){
        //         $(this).addClass('curr').siblings().removeClass('curr');
        //     },
        //     function(){
        //         $(this).removeClass('curr');
        //     }
        // );
        // // 选中设置显示行
        // $('.select-row li').on('click',function(){
        //     var text = $(this).html();
        //     $('.select-row span').html(text);
        //     $(this).parent().hide();  // 隐藏上拉菜单框
        //     _this.pagesize = parseInt(text); 
        //     _this.setPage = true;
        //     _this.ajaxGetDate(1,_this.pagesize);
        // });
        // //绑定点击页码跳转
        // $('body').on('click', '.page-list ul li', function() {
        //     var pageNum = parseInt($(this).html()); //获取当前点击的页数
        //     _this.pageOne = pageNum;
        //     if (!isNaN(pageNum)) {
        //         _this.ajaxGetDate(_this.pageOne,_this.pagesize);
        //          _this.pageGroup(pageNum,_this.pageCount);     //跳转到指定的页数
        //         var flag = $(".page-list ul li:first").clone(true).html("...");
        //         var firstNum =  $(".page-list ul li:first").clone(true).html("1");
        //         if (pageNum>4){
        //             $(".page-list ul").prepend(flag).prepend(firstNum);
        //         } 
        //     }else {
        //         $('body').off('click', '.page-list ul li');
        //     }
        // });
        // 省略号禁用
        // $('body').on('mouseover', '.page-list ul li', function() {
        //     var pageNum = parseInt($(this).html()); //获取当前点击的页数
        //     if(isNaN(pageNum)) {
        //         $(this).css("cursor","not-allowed");
        //     }

        // });
        // $(".pagingDown,.pagingUp").hover(
        //     function(){
        //         $(this).addClass("curr");
        //     },
        //     function(){
        //         $(this).removeClass("curr");
        //     }
        // );    
        // //点击上一页
        // $(".pagingUp").click(function(){
        //     var indexPage = parseInt($(".page-list li.curr").html());           //获取当前页
        //     if (indexPage>1) {
        //         _this.pageOne -= 1;
        //         _this.pageUp(indexPage,_this.pageCount);
        //         _this.judge(0,indexPage-1,_this.pageCount);
        //         _this.ajaxGetDate(_this.pageOne,_this.pagesize);
        //     } else {
        //         _this.pageOne = 1;
        //         _this.ajaxGetDate(_this.pageOne,_this.pagesize);
        //     }
        // });
        // //点击下一页
        // $(".pagingDown").click(function(){
        //     if(_this.pageOne != _this.pageCount) {
        //         var indexPage = parseInt($(".page-list li.curr").html());           //获取当前页
        //         var nextPage = parseInt($(".page-list li.curr").next().text());    //获取下一页索引
        //         _this.pageOne = nextPage;                                       
        //         _this.pageDown(indexPage,_this.pageCount);
        //         _this.judge(indexPage);
        //         _this.ajaxGetDate(nextPage,_this.pagesize);
        //     } else {
        //         alert("已经是最后一页");
        //     }
        // });
        // // 点击查看详情
        $("body").off('click', '.through').on('click', '.through', function(){
            // var idText = $(this).siblings("td:first").html();
           _this.viewDetails();
        });
    },
	render: function(){
		var _this = this;	
		_this.creatPie();		//饼图加载
		_this.creatPieTable();  //表格加载
		// 选项卡切换
		$(".header-pie li").on("click",function(){
			$(this).addClass("tab-hover").siblings().removeClass("tab-hover");
			$(".manager-content").find(".showIndex").eq($(this).index()).show().siblings().hide();
		});
	}
};
// managerPie.init({id:"manager"}); 