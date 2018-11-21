MENU.addItem([
    {
        value:"系统管理",
        id:"systemManagement",
        icon:"img/settings.png",
        childBoxStyle:"background-color:#fff",
        allowRole:["province"],//province（省）/city（市）/manager（经办人）

        child:[
            {
                value:"用户/角色",
                id:"user"
            },
            {
                value:"系统故障",
                id:"systemFailure"
            },
            {
                value:"参数设置",
                id:"setParameter"
            },
            {
                value:"流程管理",
                id:"process",
                clickFun:function (contentBox,routBox) {
                    var user = getUserData().userLevel;
                    console.log(user);
                    queryProcess.init(routBox);
                }
            },
            {
                value:"操作管理",
                id:"operation"
            }
        ]
    }
]);
// 流程查询
var queryProcess = {
    setCityy: false,
    creatDom: function(){
        var html = "";
            html +=     '<div class="process-header">';
            html +=         '<div class="select-all">';
            html +=             '<select class="city" id="city">';
            html +=                 '<option>市</option>';
            html +=             '</select>'; 
            html +=             '<select class="district" id="district">';
            html +=                 '<option>区</option>';
            html +=             '</select>'; 
            html +=          '</div>';
            html +=          '<div class="search-input"><input type="text" placeholder=""/></div>';
            html +=          '<div class="querybtn">搜索</div>';
            html +=     '</div>';
            html +=     '<div class="basic-content">';
            html +=         '<div class="subtitle"><input type="button" value="新增审批流程"/></div>';
            html +=         '<table class="process-result" id="tableResult">';
            html +=             '<colgroup>';
            html +=                 '<col style="width:10%" />';
            html +=                 '<col style="width:20%" />';
            html +=                 '<col style="width:7%" />';
            html +=                 '<col style="width:20%" />';
            html +=                 '<col style="width:30%" />';
            html +=                 '<col style="width:13%" />';
            html +=             '</colgroup>';
            html +=             '<thead>';
            html +=                 '<tr>';
            html +=                      '<th>流程名称</th>';
            html +=                      '<th>流程说明</th>';
            html +=                      '<th>用户地市</th>';
            html +=                      '<th>用户区县</th>';
            html +=                      '<th>审批人</th>';
            html +=                      '<th>操作</th>';
            html +=                 '</tr>';
            html +=             '</thead>';
            html +=         '</table>';
            html +=         '<table class="table-result">'
            html +=             '<colgroup>';
            html +=                 '<col style="width:10%" />';
            html +=                 '<col style="width:20%" />';
            html +=                 '<col style="width:7%" />';
            html +=                 '<col style="width:20%" />';
            html +=                 '<col style="width:30%" />';
            html +=                 '<col style="width:13%" />';
            html +=             '</colgroup>';
            html +=             '<tbody class="query-date">';
            html +=                 '<tr class="even">';
            html +=                      '<td>电费审批</td>';
            html +=                      '<td>锦江区电费审批配置</td>';
            html +=                      '<td>成都市</td>';
            html +=                      '<td>成都市 锦江区</td>';
            html +=                      '<td>一级审批人李红霞,二级审批人库豫昆,三级审批人罗丽佳</td>';
            html +=                      '<td><a class="check-detail">查看</a><a class="edit-process">修改</a></td>';
            html +=                 '</tr>';
            html +=                 '<tr class="odd">';
            html +=                      '<td>预付审批</td>';
            html +=                      '<td>武侯区预付审批配置</td>';
            html +=                      '<td>成都市</td>';
            html +=                      '<td>成都市 武侯区</td>';
            html +=                      '<td>一级审批人李红霞,二级审批人熊华,三级审批人彭明</td>';
            html +=                      '<td><a class="check-detail">查看</a><a class="edit-process">修改</a></td>';
            html +=                 '</tr>';            
            html +=             '</tbody>';
            html +=         '</table>';
            html +=     '</div>';
            $("#contentBox").append(html);
    },
    init: function(routBox){
        var _this = this;
        _this.creatDom();
        _this.initCity();

        $(".subtitle input").on('click',function(){
            $(".process-header,.basic-content").hide();
            addProcess.init(routBox);
            routBox.innerHTML = '<span>流程管理</span>><span class="nowRout">新增审批流程</span>';
        });
         // 加载城市信息
        $("#city").on("change",function(){
            _this.setCityy = true;
            _this.initDistrict();
        });
    },
      //市区选择
    initCity: function(){
        var _this = this;
        var url = Interface.get("DS","getCity");   //获取城市信息
        // 加载城市的数据
        $.get(
            url,
            function(data){
                var html = "";
                data.sort(function(a,b){
                      return Number(a.key)-Number(b.key)
                });
                for (var attr in data){
                    html += "<option value='" + data[attr].key + "'>" + data[attr].value + "</option>";
                }
                $("#city").append(html);
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
            val,
            function(data){
                var html = "";
                for(var attr in data){
                    html += "<option value='"+ data[attr].key +"'>"+ data[attr].value +"</option>";
                }
                if (_this.setCityy === true) {
                    $("#district").empty().append(html);
                } 
            }
        );
    }
};
// 流程管理
var addProcess = {
    setCity: false,
    creatDom: function(){
        var html = "";
            html +=     '<div class="add-process">';
            html +=         '<form action="">';
            html +=             '<ul class="list-iteam list-ul">';
            html +=                 '<li><span>流程名称:</span><input type="text"></li>';
            html +=                 '<li><span>用户地市:</span><select name="" id="citys"><option select="select">市区</option></select></li>';
            html +=                 '<li><span>用户区县:</span><select name="" id="districts"><option select="select">区县</option></select></li>';
            html +=                 '<li class="list-text"><span>流程说明:</span><textarea></textarea></li>';
            html +=             '</ul>';
            html +=             '<ul class="list-iteam list-middle">';
            html +=                 '<li>';
            html +=                     '<span>审批流程:</span><i>1\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;第1级审批人</i><input type="text" placeholder="请添加审批人">';
            html +=                 '</li>';
            html +=                 '<li class="right-padding">';
            html +=                     '<i>2\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;第2级审批人</i><input type="text" placeholder="请添加审批人">';
            html +=                 '</li>';
            html +=                 '<li class="right-padding">';
            html +=                     '<i><small>3</small>\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;第<small>3</small>级审批人</i><input type="text" placeholder="请添加审批人">';
            html +=                 '</li>';
            html +=                 '<li class="provid right-padding">'
            html +=                     '<input type="button" value="+ 添加审批人">';
            html +=                 '</li>';
            html +=             '</ul>';
            html +=             '<ul class="list-iteam ">';
            html +=                 '<li class="right-padding">';
            html +=                     '<input type="button" class="save-process" value="保存"><input type="button" class="cancel" value="取消">';
            html +=                 '</li>';
            html +=             '</ul>';
            html +=         '</form>';
            html +=     '</div>';
            $("#contentBox").css("background","#fff").append(html);
    },
    init: function(routBox){
        var _this = this;
        _this.creatDom();
        _this.initCity();
        $(".save-process").on("click",function(){
            CMalert("内容不能为空！");
        });
        $(".cancel").on("click",function(){
            $(".process-header,.basic-content").show();
            $(".add-process").hide();
           routBox.innerHTML = '<span>系统管理</span>><span class="nowRout">流程管理</span>';
        });
        var i = 3;
        $(".provid").on("click",function(){
            var list = $(".list-middle li:last").prev().clone(true);
                i++;
            $(".list-middle li:last").prev().after(list);
            $(".list-middle li:last").prev().find("small").html(i);
        });
        // 加载城市信息
        $("#citys").on("change",function(){
            _this.setCity = true;
            _this.initDistrict();
        });
    },
     //市区选择
    initCity: function(){
        var _this = this;
        var url = Interface.get("DS","getCity");   //获取城市信息
        // 加载城市的数据
        $.get(
            url,
            function(data){
                var html = "";
                data.sort(function(a,b){
                      return Number(a.key)-Number(b.key)
                });
                for (var attr in data){
                    html += "<option value='" + data[attr].key + "'>" + data[attr].value + "</option>";
                }
                $("#citys").append(html);
                // 加载城市信息后加载区县
                _this.initDistrict();
            },"json");
    },
    //区县选择
    initDistrict: function() {
        var _this = this;
        var cityId = $("#citys").val();
        var url = Interface.get("DS","getCounty");   //获取地区信息
        var val = {
            cityId:cityId
        }
        $.getJSON(
            url,
            val,
            function(data){
                var html = "";
                for(var attr in data){
                    html += "<option value='"+ data[attr].key +"'>"+ data[attr].value +"</option>";
                }
                if (_this.setCity === true) {
                    $("#districts").empty().append(html);
                } 
            }
        );
    }
}
