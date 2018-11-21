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
        childBoxStyle:"background-color:#fff",
        child:[
            {
                value:"基础数据维护",
                id:"maintainData",
                child:[
                    //第二级菜单
                    {
                        value:"合同信息管理",
                        id:"contractInfo",
                        clickFun:function (contentBox,routBox) {
                           contractMainTain.apply(this,arguments);
                        }
                    },
                    {
                        value:"供应商信息管理",
                        id:"supplierInfo",
                        clickFun:function () {
                           underConstruction.creatPageHtml();
                        }
                    },
                    {
                        value:"供电信息管理",
                        id:"powerInfo",
                        clickFun:function () {
                           underConstruction.creatPageHtml();
                        }
                    },
                    {
                        value:"电表信息管理",
                        id:"wattHour",
                        clickFun:function () {
                           underConstruction.creatPageHtml();
                        }
                    },
                    {
                        value:"发票信息管理",
                        id:"invoice",
                        clickFun:function () {
                           underConstruction.creatPageHtml();
                        }
                    },
                    {
                        value:"额定功率管理",
                        id:"ratedPower",
                        clickFun:function () {
                           underConstruction.creatPageHtml();
                        }
                    },
                    {
                        value:"报账点管理",
                        id:"reimburseMent",
                        clickFun:function () {
                           underConstruction.creatPageHtml();
                        }
                    },
                    {
                        value:"其他信息管理",
                        id:"otherInfo",
                        clickFun:function () {
                           underConstruction.creatPageHtml();
                        }
                    }
                ]
            }
        ]
    }
]);
// 正在建设页面
var underConstruction = {
    creatPageHtml: function(){
        var html ="";
            html += '<div class="build-html"><img src="img/build_bg.png"/></div>';
         $('#contentBox').css('background','#f6f6f8').html(html);
    }
};
/*创建操作元素（查看/修改/撤销/）*/
function createOperation(type,id,fun) {
    var
        myary={
            "view":"查看",
            "modify":"修改",
            "revoke":"撤销",
        },
        div=creatDom("div",{class:"o-"+type},null,myary[type]);
    div.addEventListener("click",function (e) {
        e.stopPropagation();
        fun&&fun.call(this,id);
    });
    return div
}
/*区县联动*/  
function regionalLinkage(){
    var
        select1=creatSelectCM("成都市","",[]),
        select2=creatSelectCM("锦江区","",[]);
    var getCity=function(cityId,fun){
        var url = Interface.get("DS","getCity");   //获取城市信息
        // 加载城市的数据
        $.get(
            url,
            function(data){
              data.sort(function(a,b){
                  return Number(a.key)-Number(b.key)
              });
              select1.initOption(data.map(function(obj){return obj.value}));
              select1.onchage(function(){
                  getCounty(data[this.index].key)
              });
              getCounty(data[0].key)
          })
    },
    getCounty=function(cityId,fun){
        var urlCounty = Interface.get("DS","getCounty");   //获取地区信息
        $.getJSON(
            urlCounty,
            {cityId:cityId},
            function(data){
                data.sort(function(a,b){
                    return Number(a.key)-Number(b.key)
                });
                select2.initOption(data.map(function(obj){return obj.value}))
            })
        };
    getCity();
    return [select1,select2]
}
// 合同信息管理
function contractMainTain(contentBox,routBox) {
    // 创建搜索
    var selectLink=regionalLinkage();
    var serchebox=SearchBox([
            {key:"selectValue",dom:selectLink[0]},
            {key:"selectValue",dom:selectLink[1]},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"报账点名称"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"合同编号"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"合同名称"})}
        ]);
    serchebox.Search(function (valueArray) {
        CMalert(valueArray.join());
    });
    // 创建table表头按钮
    var batchImport  = creatDom("button",{class:"btn btn-blue"},null,"批量导入");
    // 创建页面table
    var headCheckBox=creatDom("input",{type:"checkbox",name:"test"}),
        tableBox =new TableCM({
        title:[batchImport],
        head:[headCheckBox,"合同编号","合同名称","合同生效日期","合同终止日期","是否包干","包干价","缴费周期","电表户号","单价","操作"],
        cellWidth:["5%","15%","15%","10%","10%","10%","5%","10%","7%","auto","7%"],
        valueKey:["value1","value2","value3","value4","value5","value6","value7","value8","value9","value10","value11"]
        // footer:[pagingBox]
    });
    /*
        *事件处理
     */
    //校验必填项
    var getCheckedInput=function(){
        var flog=true,inputAry=tableBox.tableContent.getElementsByTagName("input");
        for(var i= 0,n=inputAry.length;i<n;i++){
            if(inputAry[i].checked===true){
                flog=true;break
            }
            flog=false
        }
        return flog
    };
    //全选事件绑定
    headCheckBox.addEventListener("click",function (e) {
        e.stopPropagation();
        var checkBoxAry=tableBox.tableContent.getElementsByTagName("input");
        [].forEach.call(checkBoxAry,function (checkbox) {
            checkbox.checked=this.checked
        }.bind(this));
    });
    //批量删除导入绑定
    batchImport.addEventListener("click",function (e) {
        e.stopPropagation();
        if(!getCheckedInput()){
            CMalert("未选择任何单据！");
            return false
        }
        CMalert("确定批量导入？",null,null,true)
    });
    //请求数据
    $.ajax({
        url:"testJson/contractInfo.json",
        type:"get",
        dataType:"json",
        success:function (data) {
            var userNow=userSetObj.judgeUser(getUserData());  //获取权限
            var valueKeyAry=tableBox.valueKey.slice(1,-1);
            data.forEach(function (obj) {
                var id=obj.value2;
                obj.value1=creatDom("input",{type:"checkbox",name:"test",id:obj.value1});
                valueKeyAry.forEach(function (key) {
                    obj[key]='<div class="ellipsis">'+obj[key]+'</div>'
                });
                obj.value11=creatDom("div",{class:"operation-box"});
                switch (userNow.userLevel){
                    // case 0:
                    //     break;
                    case 0:
                        obj.value11.appendChild(createOperation("modify",id,function (id) {  //修改
                            // CMalert("确认通过?",null,null,true)
                        }));
                        ;break;
                    // case 2:
                    //     obj.value11.appendChild(createOperation("view",id,function (id) {
                    //         viewDetails()
                    //     }));
                    //     obj.value11.appendChild(createOperation("revoke",id,function (id) {
                    //         CMalert("撤销成功！")
                    //     }))

                    //     ;break;
                }
            });
            // paging.init(5);
            tableBox.full(data);
        }
    });
    $(contentBox).append(serchebox);//添加搜索盒子到容器内部 
    $(contentBox).append(tableBox.tableBox);
    tableBox.initHight();//重置table的高度

}
 