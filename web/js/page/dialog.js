

var dialog = {
    // 初始弹出层
    creatDialog: function(siteInfoVO,contractVO,supplierVO,watthourMeterVO,deviceVO ){
            var _this = this;
            var tt = _this.getLocalTime(watthourMeterVO.reimbursementDate);
            var endDate = _this.getLocalTime(contractVO.endDate);
            var startDate = _this.getLocalTime(contractVO.startDate);
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
                html +=                        '<tbody class="siteInfoVO">';
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
                html +=                                '<th>电表户号</th>';
                html +=                                '<th>单价</th>';
                html +=                            '</tr>';
                html +=                        '</thead>';
                html +=                        '<tbody>';
                html +=                             '<tr>'; 
                html +=                                 '<td></td>';
                html +=                                 '<td></td>';
                html +=                                 '<td>'+startDate+'</td>';
                html +=                                 '<td>'+endDate+'</td>';
                html +=                                 '<td></td>';
                html +=                                 '<td></td>';
                html +=                                 '<td></td>';
                html +=                                 '<td></td>';
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
                html +=                             '<tr>'; 
                html +=                                 '<td></td>';
                html +=                                 '<td></td>';
                html +=                                 '<td></td>';
                html +=                                 '<td></td>';
                html +=                             '</tr>';
                html +=                        '</tbody>';
                html +=                    '</table>';
                html +=                '</li>';
                html +=                '<li class="list list-hover">';
                html +=                    '<span>电表信息</span>';
                html +=                    '<i class="arrow"></i>';
                html +=                    '<table>';
                html +=                        '<thead>';
                html +=                            '<tr class="watthour-head">';
                html +=                            '</tr>';
                html +=                        '</thead>';
                html +=                        '<tbody>';
                html +=                             '<tr>'; 
                html +=                                 '<td></td>';
                html +=                                 '<td>'+watthourMeterVO.code+'</td>';
                html +=                                 '<td></td>';
                html +=                                 '<td class="wattype">'+watthourMeterVO.ptype+'</td>';
                html +=                                 '<td class="watstatus">'+watthourMeterVO.status+'</td>';
                html +=                                 '<td>'+watthourMeterVO.rate+'</td>';
                html +=                                 '<td></td>';
                html +=                                 '<td>'+watthourMeterVO.currentReading+'</td>';
                html +=                                 '<td>'+tt+'</td>';
                html +=                                 '<td></td>';
                html +=                             '</tr>';
                html +=                        '</tbody>';
                html +=                    '</table>';
                html +=                '</li>';
                html +=                '<li class="list list-hover">';
                html +=                    '<span>机房设备信息</span>';
                html +=                    '<i class="arrow"></i>';
                html +=                    '<table>';
                html +=                        '<thead><tr class="device-table"></tr></thead>';
                html +=                        '<tbody class="deviceVO"></tbody>';
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
     // 时间格式化
    getLocalTime: function (nS) {     
        var date = new Date(nS);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate();
        var t = Y+M+D; 
        return t;  
    },
    ajaxGetDiaolog: function(idText) {
        var _this = this;
        var url = Interface.get("DS","getDetails");   //获取基础数据详细信息
        $.ajax({
            url:url,
            data: {id:idText},
            type: 'get',
            dataType: 'json'
        }) 
        .done(function(data) {
            console.log(data);
            var siteInfoVO = data.siteInfoVO;    // 报账点信息
            var contractVO = data.contractVO;    // 合同信息
            var supplierVO = data.supplierVO;    // 供应商信息
            var watthourMeterVO = data.watthourMeterVO;     // 电表信息
            var deviceVO    = data.deviceVO;        // 机房设备信息
            console.log(deviceVO);
            _this.creatDialog(siteInfoVO,contractVO,supplierVO,watthourMeterVO);
            var watthourThead = ["电表号","电表编号","电表户号","电表类型","电表状态","倍率","最大读数","当前读数","当前电费归属日期","所属户头"];  //电表信息
            var deviceThead = ["机房或资源点名称","机房类型","网元状态","设备专业","设备类型","型号","生产厂家","数量"];  //设备信息
            $.each(deviceThead,function(index,obj){
                var tr = '<th>'+obj+'</th>';
                $(".device-table").append(tr);
            });
            $.each(watthourThead,function(index,obj){
                var tr = '<th>'+obj+'</th>';
                $(".watthour-head").append(tr);
            });
            $.each(deviceVO,function(index,obj){
                var str = '<tr>'+
                          '<td>'+obj.equipmentRoomName+'</td>'+
                          '<td></td>'+
                          '<td>在线</td>'+
                          '<td>'+obj.deviceBelong+'</td>'+
                          '<td>'+obj.deviceModel+'</td>'+
                          '<td>'+obj.deviceType+'</td>'+
                          '<td>'+obj.deviceVendor+'</td>'+
                          '<td>'+obj.number+'</td>'+
                          '</tr>';
                $(".deviceVO").append(str);
            });
            var watType = $(".wattype").html(),
                watstatus = $(".watstatus").html();
            if(watType == 1) { $(".wattype").html("普通")} else { $(".wattype").html("智能")};
            if(watstatus == 1) { $(".watstatus").html("正常")} else { $(".watstatus").html("损坏")};

            // 弹出框属性设置
            var box = 440;    // 弹出框的一半
            var clientHeight = $(window).height();  //页面高度 
            var boxHeight = 309
            var pageY = clientHeight/2-boxHeight;     // 偏移Y轴位置
            var pageX =$(window).scrollTop()+$(window).width()/2-box;  // 偏移X轴位置
            // 打开弹出层
            $("#popup").stop(true).animate({
                top: pageY,
                opacity:'show',
                width: 880,
                height:618,
                right: pageX
            },500);
            //  关闭弹出层
            $("#popup .close-btn").click(function(){
                $(this).parents("#popup").stop(true).animate({
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

        })
        .fail(function() {
            CMalert.log("数据获取失败");
        });
            return false;
    },
    // 打开弹出层及事件
    openDialog: function(idText){
        var _this = this;
        _this.ajaxGetDiaolog(idText);
    }
};

