

var dialog = {
    // 初始弹出层
    creatDialog: function(siteInfoVO,contractVO,supplierVO,watthourMeterVO){
            var html = "";
                html +=    '<div id="popup">';
                html +=        '<!-- 标题 -->';
                html +=        '<h2 class="dialog-title">详细信息<a class="close-btn" href="#"></a></h2>';
                html +=        '<div class="dialog-content">';
                html +=            '<div class="search">';
                html +=                 '<span class="open-menu">全部展开</span>';
                html +=                 '<span class="stop-menu">全部收起</span>';
                html +=            '</div>';
                html +=            '<ul class="detail-info">';
                html +=                '<li class="list list-hover">';
                html +=                    '<span>报账点信息</span>';
                html +=                    '<i class="arrow"></i>';
                html +=                    '<table>';
                html +=                        '<thead>';
                html +=                            '<tr>';
                html +=                                '<th>地市</th>';
                html +=                                '<th>区县</th>';
                html +=                                '<th>报账点名称</th>';
                html +=                                '<th>报账点别名</th>';
                html +=                                '<th>资管站点名称</th>';
                html +=                                '<th>原财务站点名称</th>';
                html +=                                '<th>产权性质</th>';
                html +=                            '</tr>';
                html +=                        '</thead>';
                html +=                        '<tbody>';
                html +=                             '<tr>'; 
                html +=                                 '<td>'+siteInfoVO.area+'</td>';
                html +=                                 '<td>'+siteInfoVO.county+'</td>';
                html +=                                 '<td>'+siteInfoVO.accountName+'</td>';
                html +=                                 '<td>'+siteInfoVO.accountAlias+'</td>';
                html +=                                 '<td>'+siteInfoVO.resourceName+'</td>';
                html +=                                 '<td>'+siteInfoVO.oldFinanceName+'</td>';
                html +=                                 '<td>'+siteInfoVO.productNature+'</td>';
                html +=                             '</tr>';
                html +=                        '</tbody>';
                html +=                    '</table>';
                html +=                '</li>';
                html +=                '<li class="list list-hover">';
                html +=                    '<span>合同信息</span>';
                html +=                    '<i class="arrow"></i>';
                html +=                    '<table>';
                html +=                        '<thead>';
                html +=                            '<tr>';
                html +=                                '<th>合同ID</th>';
                html +=                                '<th>合同名称</th>';
                html +=                                '<th>合同生效日期</th>';
                html +=                                '<th>合同终止日期</th>';
                html +=                                '<th>是否包干</th>';
                html +=                                '<th>包干价</th>';
                html +=                                '<th>缴费周期</th>';
                html +=                                '<th>电报户号</th>';
                html +=                                '<th>单价</th>';
                html +=                            '</tr>';
                html +=                        '</thead>';
                html +=                        '<tbody>';
                html +=                             '<tr>'; 
                html +=                                 '<td></td>';
                html +=                                 '<td>'+contractVO.name+'</td>';
                html +=                                 '<td>'+contractVO.startDate+'</td>';
                html +=                                 '<td>'+contractVO.endDate+'</td>';
                html +=                                 '<td>'+contractVO.isClud+'</td>';
                html +=                                 '<td>'+contractVO.cludPrice+'</td>';
                html +=                                 '<td>'+contractVO.paymentCycle+'</td>';
                html +=                                 '<td>'+contractVO.paymentAccountCode+'</td>';
                html +=                                 '<td>'+contractVO.unitPrice+'</td>';
                html +=                             '</tr>';
                html +=                        '</tbody>';
                html +=                    '</table>';
                html +=                '</li>';
                html +=                '<li class="list list-hover">';
                html +=                    '<span>供应商信息</span>';
                html +=                    '<i class="arrow"></i>';
                html +=                    '<table>';
                html +=                        '<thead>';
                html +=                            '<tr>';
                html +=                                '<th>供应商名称</th>';
                html +=                                '<th>供应商ID</th>';
                html +=                                '<th>供应商组织结构代码</th>';
                html +=                                '<th>供应商地点ID</th>';
                html +=                            '</tr>';
                html +=                        '</thead>';
                html +=                        '<tbody>';
                html +=                             '<tr>'; 
                html +=                                 '<td>'+supplierVO.name+'</td>';
                html +=                                 '<td>'+supplierVO.id+'</td>';
                html +=                                 '<td>'+supplierVO.organizationCode+'</td>';
                html +=                                 '<td>'+supplierVO.id+'</td>';
                html +=                             '</tr>';
                html +=                        '</tbody>';
                html +=                    '</table>';
                html +=                '</li>';
                html +=                '<li class="list list-hover">';
                html +=                    '<span>供电信息</span>';
                html +=                    '<i class="arrow"></i>';
                html +=                    '<table>';
                html +=                        '<thead>';
                html +=                            '<tr>';
                html +=                                '<th>用电类型</th>';
                html +=                                '<th>供电公司/业主</th>';
                html +=                                '<th>共享方式</th>';
                html +=                                '<th>电费缴纳方式</th>';
                html +=                            '</tr>';
                html +=                        '</thead>';
                html +=                        '<tbody>';
                html +=                        '</tbody>';
                html +=                    '</table>';
                html +=                '</li>';
                html +=                '<li class="list list-hover">';
                html +=                    '<span>电表信息</span>';
                html +=                    '<i class="arrow"></i>';
                html +=                    '<table>';
                html +=                        '<thead>';
                html +=                            '<tr>';
                html +=                                '<th>电表号</th>';
                html +=                                '<th>电表编号</th>';
                html +=                                '<th>电表户号</th>';
                html +=                                '<th>电表类型</th>';
                html +=                                '<th>电表状态</th>';
                html +=                                '<th>倍率</th>';
                html +=                                '<th>最大读数</th>';
                html +=                                '<th>当前读数</th>';
                html +=                                '<th>当前电费归属日期</th>';
                html +=                                '<th>所属户头</th>';
                html +=                            '</tr>';
                html +=                        '</thead>';
                html +=                        '<tbody>';
                html +=                             '<tr>'; 
                html +=                                 '<td>'+watthourMeterVO.id+'</td>';
                html +=                                 '<td>'+watthourMeterVO.code+'</td>';
                html +=                                 '<td>'+watthourMeterVO.paymentAccountCode+'</td>';
                html +=                                 '<td>'+watthourMeterVO.ptype+'</td>';
                html +=                                 '<td>'+watthourMeterVO.status+'</td>';
                html +=                                 '<td>'+watthourMeterVO.rate+'</td>';
                html +=                                 '<td>'+watthourMeterVO.maxReading+'</td>';
                html +=                                 '<td>'+watthourMeterVO.currentReading+'</td>';
                html +=                                 '<td>'+watthourMeterVO.reimbursementDate+'</td>';
                html +=                                 '<td>'+watthourMeterVO.belongCompany+'</td>';
                html +=                             '</tr>';
                html +=                        '</tbody>';
                html +=                    '</table>';
                html +=                '</li>';
                html +=                '<li class="list list-hover">';
                html +=                    '<span>机房设备信息</span>';
                html +=                    '<i class="arrow"></i>';
                html +=                    '<table>';
                html +=                        '<thead>';
                html +=                            '<tr>';
                html +=                                '<th>机房或资源点名称</th>';
                html +=                                '<th>机房类型</th>';
                html +=                                '<th>网元状态</th>';
                html +=                                '<th>设备专业</th>';
                html +=                                '<th>设备类型</th>';
                html +=                                '<th>型号</th>';
                html +=                                '<th>生产厂家</th>';
                html +=                                '<th>数量</th>';
                html +=                            '</tr>';
                html +=                        '</thead>';
                html +=                        '<tbody>';
                html +=                        '</tbody>';
                html +=                    '</table>';
                html +=                '</li>';
                html +=                '<li class="list list-hover">';
                html +=                    '<span>其他信息</span>';
                html +=                    '<i class="arrow"></i>';
                html +=                    '<table>';
                html +=                        '<thead>';
                html +=                            '<tr>';
                html +=                                '<th>报销周期</th>';
                html +=                                '<th>分摊比例</th>';
                html +=                        '</thead>';
                html +=                        '<tbody>';
                html +=                        '</tbody>';
                html +=                    '</table>';
                html +=                '</li>';                 
                html +=            '</ul>';
                html +=        '</div>';
                html +=    '</div>';
                html +=    '<div id="mask"></div>';
            $(".systemBox").append(html);
    },
    // 打开弹出层
    openDialog: function(idText){
        var _this = this;
        $.ajax({
            // url: 'http://10.65.125.146:8080/audit/siteInfo/queryDetail.do?id='+ idText +'',
            url: 'testJson/benchmarking.json',
            type: 'get',
            dataType: 'json'
        })
        .done(function(data) {
            console.log(data);
            var siteInfoVO = data.siteInfoVO;
            var contractVO = data.contractVO;
            var supplierVO = data.supplierVO;
            var watthourMeterVO = data.watthourMeterVO;
            _this.creatDialog(siteInfoVO,contractVO,supplierVO,watthourMeterVO);
            var box = 312;    // 弹出框的一半
            var pageY = $(window).height()/2-box;     // 偏移Y轴位置
            var clientHeight = $(window).height();  //页面高度 
            var pageX =$(window).scrollTop()+$(window).width()/2-box;  // 偏移X轴位置
            console.log(pageY,pageX,clientHeight);
            // 打开弹出层
            $("#popup").animate({
                top: pageY,
                opacity:'show',
                width: 624,
                height:618,
                right: pageX
              },500);
            //  关闭弹出层
            $("#popup .close-btn").click(function(){
                $(this).parents("#popup").animate({
                    top: 0,
                    opacity:'hide',
                    width: 0,
                    height: 0,
                    right:0
                },500,function(){
                    $("#popup").remove();
                    $("#mask").remove();
                });
            });
            // 移入
            $(".list").hover(
                function (){
                    $(this).removeClass("list-hover").addClass("fade-list");
                },function(){
                    $(this).removeClass("fade-list").addClass("list-hover");
                }
            );
            $(".list").on("click",function(){
                if($(this).children("table").is(":hidden")) {
                    $(this).children("table").slideDown("600");
                    $(this).find('span').css('font-weight',"700");
                    $(this).find("i").css({
                        "width": "15px",
                        "height": "9px",
                        "background":"url(../../img/drop-down.png) no-repeat"
                    });

                } else {
                    $(this).children("table").slideUp("600");
                    $(this).find('span').css('font-weight',"500");
                    $(this).find("i").css({
                        "width": "8px",
                        "height": "14px",
                        "background":"url(../../img/drop-UP.png) no-repeat"
                    });

                }
            });
            // 全部展开
            $(".open-menu").click(function(){
                if($(".list table").is(":hidden")) {
                    $(".list table").slideDown();
                    $(".list span").css('font-weight',"700");
                }
            });
            // 全部收起
            $(".stop-menu").click(function(){
                if($(".list table").is(":visible")) {
                    $(".list table").slideUp();
                    $(".list span").css('font-weight',"500");
                }
            });
            return false;
         })
        .fail(function() {
            console.log("数据获取失败");
        });
    }
};

