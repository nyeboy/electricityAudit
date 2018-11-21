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


// MENU.addItem([
//     //第一级菜单
//     {
//         value:"稽核管理",
//         id:"AuditManagement",
//         icon:"img/audit_icon.png",
//         childBoxStyle:"background-color:#1c2226",
//         child:[
//             //第二级菜单
//             {
//                 value:"基站电费",
//                 id:"BaseTariff",
//                 child:[
//                     //第三级菜单
//                     {
//                         value:"电费提交",
//                         id:"submitTariff",
//                         child:[
//                             //第四级菜单
//                             {
//                                 value:"电费录入",
//                                 id:"inputTariff",
//                                 clickFun:function (contentBox,routBox) {
//                                     contentBox.innerHTML="测试容器"
//                                 }
//                             },
//                             {
//                                 value:"电费稽核",
//                                 id:"auditTariff",
//                                 clickFun:function () {
//                                     alert(this.textContent)
//                                 }
//                             },
//                             {
//                                 value:"提交财务",
//                                 id:"inputFinance",
//                                 clickFun:function () {
//                                     alert(this.textContent)
//                                 }
//                             }
//                         ]
//                     },
//                     {
//                         value:"预付提交",
//                         id:"submitAdvance",
//                         clickFun:function () {
//                             alert(this.textContent)
//                         }
//                     },
//                     {
//                         value:"电费计提",
//                         id:"getTariff",
//                         clickFun:function () {
//                             alert(this.textContent)
//                         }
//                     },
//                     {
//                         value:"电费转售",
//                         id:"resaleTariff",
//                         clickFun:function () {
//                             alert(this.textContent)
//                         }
//                     },
//                     {
//                         value:"电费回收",
//                         id:"recoveryTariff",
//                         clickFun:function () {
//                             alert(this.textContent)
//                         }
//                     }
//                 ]
//             },
//             {
//                 value:"油机发电",
//                 id:"OilGenerator",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             },
//             {
//                 value:"历史数据",
//                 id:"dataHistory",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             },
//             {
//                 value:"工单处理",
//                 id:"WorkOrderProcessing",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             }
//         ]
//     },
//     {
//         value:"基础数据",
//         id:"BasicData",
//         icon:"img/data_icon.png",
//         childBoxStyle:"background-color:#1c2226",
//         child:[
//             {
//                 value:"基础数据呈现",
//                 id:"displayData",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             },
//             {
//                 value:"基础数据维护",
//                 id:"maintainData",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             },
//             {
//                 value:"标杆管理",
//                 id:"benchmarking",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             },
//             {
//                 value:"数据导入",
//                 id:"inputData",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             }
//         ]
//     },
//     {
//         value:"数据报表",
//         id:"dataCarts",
//         icon:"img/table_icon.png",
//         childBoxStyle:"background-color:#1c2226",
//         child:[
//             {
//                 value:"数据报表",
//                 id:"dataCart_1"
//             }
//         ]
//     },
//     {
//         value:"系统管理",
//         id:"systemManagement",
//         icon:"img/table_icon.png",
//         childBoxStyle:"background-color:#1c2226",
//         child:[
//             {
//                 value:"用户/角色",
//                 id:"user",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             },
//             {
//                 value:"系统故障",
//                 id:"systemFailure",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             },
//             {
//                 value:"参数设置",
//                 id:"setParameter",
//                 clickFun:function () {
//                     alert(this.textContent)
//                 }
//             }
//         ]
//     }
// ]);


