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
                value:"基础数据维护",
                id:"maintainData",
                child:[
                    //第二级菜单
                    {
                        value:"合同信息管理",
                        id:"contractInfo",
                        clickFun:function (contentBox,routBox) {
                           underConstruction.creatPageHtml();
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
var underConstruction = {
    creatPageHtml: function(){
        var html ="";
            html += '<div class="build-html"><img src="../../img/build_bg.png"/></div>';
         $('#contentBox').css('background','#f6f6f8').html(html);
    }
};
