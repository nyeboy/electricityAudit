/**
 * Created by issuser on 2017/3/8.
 */
MENU.addItem([
    {
        value:"稽核管理",
        id:"AuditManagement",
        icon:"img/audit_icon.png",
        childBoxStyle:"background-color:#fff",
        child:[
            //第二级菜单
            {
                value:"基站电费",
                id:"BaseTariff",
                child:[
                    //第三级菜单
                    {
                        value:"电费提交",
                        id:"submitTariff",
                        allowRole:["manager","city"],//province（省）/city（市）/manager（经办人）
                        child:[
                            //第四级菜单
                            {
                                value:"电费录入",
                                id:"inputTariff",
                                allowRole:["manager"],//province（省）/city（市）/manager（经办人）
                                clickFun:function (contentBox,routBox) {
                                    initSubmitTariffPage.apply(this,arguments)
                                }
                            },
                            {
                                value:"电费稽核",
                                id:"auditTariff",
                                allowRole:["manager","city"],//province（省）/city（市）/manager（经办人）
                                clickFun:function (contentBox,routBox) {
                                    initAuditTariff.apply(this,arguments)
                                }
                            },
                            {
                                value:"提交财务",
                                id:"inputFinance",
                                allowRole:["manager"],//province（省）/city（市）/manager（经办人）
                                clickFun:function (contentBox,routBox) {
                                    initInputFinance.apply(this,arguments)
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        value:"系统管理",
        id:"systemManagement",
        icon:"img/settings.png",
        allowRole:["province"],
        childBoxStyle:"background-color:#246cce",
        child:[
            {
                value:"用户/角色",
                id:"user",
                clickFun:function(){underConstruction.creatPageHtml()}
            },
            {
                value:"系统故障",
                id:"systemFailure",
                clickFun:function(){underConstruction.creatPageHtml()}
            },
            {
                value:"参数设置",
                id:"setParameter",
                clickFun:function(){underConstruction.creatPageHtml()}
            },
            {
                value:"流程管理",
                id:"process",
                clickFun:function () {
                    initProcessManagement.apply(this,arguments)
                }
            },
            {
                value:"操作管理",
                id:"operation",
                clickFun:function(){underConstruction.creatPageHtml()}
            }
        ]
    }
]);
var CMdialog=new DialogCM({bodyCssString:"width:60%;margin-left:-30%",header:true,footer:true});//主要弹窗
var addMetaerDialog=new DialogCM({bodyCssString:"width:60%;margin-left:-30%",header:true,footer:true});//新增电表详情弹窗
var AuditTariff=new DialogCM({bodyCssString:"width:74%;margin-left:-37%",header:true,footer:true});//稽核单编辑弹窗

/*请求基础封装*/
function post_(url,fun) {
    request_({
        url:url,
        method:"get",
        proxy:false,
        success:function (data) {
            typeof data!="object"&&(data=JSON.parse(data));
            fun&&fun(data)
        },
        fail:function (err) {
            c_log(err)
        }
    })
}
/*创建操作元素（查看/编辑/撤销/提交..等等）*/
function createOperation(type,id,fun) {
    var
        myary={
            "add":"增加",
            "view":"查看",
            "modify":"修改",
            "submit":"提交",
            "adopt":"通过",
            "reject":"驳回",
            "revoke":"撤销",
            "delete":"删除",
            "push-finance":"推送财务",
            "push-expense":"推送报销发起人"
        },
        div=creatDom("div",{class:"o-"+type},null,myary[type]);
    div.addEventListener("click",function (e) {
        e.stopPropagation();
        fun&&fun.call(this,id);
    });


    return div
}
/*创建输入单元*/
function createInputUnit(name,domAry,isMust,nameStyle) {
    var DivW=null,DivH=null;
    if(/width:\d+(\.\d+)?%/.test(nameStyle)){
        var Percentage=Number(/width:\d+(\.\d+)?%/.exec(nameStyle)[0].slice(6,-1));
        DivW=100-Percentage
    }
    var box=creatDom("label",{class:"input-box _search-input"},{isMust:isMust},
        '<span '+(isMust===true?'class="mast-icon" ':' ')+(nameStyle?'style="'+nameStyle+'"':' ')+'>'+name+'</span><div></div>'
    );
    var div=box.getElementsByTagName("div")[0];
    DivW&&(div.style.width=DivW+"%");
    domAry.forEach(function (dom) {
        if(typeof dom=="string"&&/height:\d+(\.\d+)?px?%?/.test(dom)){

            div.parentNode.style.height=/height:\d+(\.\d+)?px?%?/.exec(dom)[0].slice(7)
        }
        $(div).append(dom);
    });
    return box
}
/*深度拷贝对象*/
var deepCopy= function(source) {
    var result={};
    for (var key in source) {
        result[key] = source[key];
    }
    return result;
};
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
/*____________________________________________________________________________________________________________________*/
/*-------------------------------------------------|||（电费录入）|||-------------------------------------------------*/
/*请求电费录入列表(ajax)*/
function getElectricityInputList(nowPageNum,pageSize,valuekey,fun) {
    nowPageNum=nowPageNum||1;
    pageSize=pageSize||10;
    // var url="testJson/tableData.json";
    // var url="testJson/tableData.json";
    post_("testJson/dflr_.json",function (data) {
    //        c_log(data,"请求列表数据");
    //        if(data.code!=200){
    //            CMalert(data.message);
    //            return false
    //        }else {
    //            var data1=data.data
    //        }
        var list=data;
        //        c_log(list,"--------dsadsada-------------");
        var valueKeyAry=valuekey.slice(1,-1);

        list.forEach(function (obj) {
            obj.value1=creatDom("input",{type:"checkbox",name:"test",id:obj.serialNumber});
            valueKeyAry.forEach(function (key) {
                obj[key]='<div class="ellipsis">'+(obj[key]||'--')+'</div>'
            });
            obj.value11=creatDom("div",{class:"operation-box"});
            obj.value11.appendChild(createOperation("view",obj.serialNumber,function (id) {
                // alert("dsad")
                viewDetails()
            }));
            obj.value11.appendChild(createOperation("modify",obj.serialNumber),function(id){
                modifyAuditTariff.call(this,id)
            });
            obj.value11.appendChild(createOperation("submit",obj.serialNumber),function(id){
                CMalert("提交成功？",null,null,true)
            });
            obj.value11.appendChild(createOperation("delete",obj.serialNumber),function(id){
                CMalert("确认删除？",null,null,true)
            });
        });
        fun&&fun(list,Math.ceil(data.totalData/data.pageSize))
    });
}
/*初始化报账点名称列表信息(dialog)*/
function dialogAccountList(id,btnary,inputObj) {
    var
        getAccountListData=function (fun) {
            post_("testJson/bzdcx_.json",function (data) {
                var valueKeyAry=tableBox.valueKey.slice(1);
                data.forEach(function (obj) {
                    obj.value1=creatDom("input",{type:"radio",name:"AccountList"},{AccountData:deepCopy(obj)});
                    valueKeyAry.forEach(function (key) {
                        obj[key]='<div class="ellipsis text-left">'+(obj[key]||'--')+'</div>'
                    })
                });
                fun&&fun(data)
            })
        },
        checkInput=null;

    var
        searchBtn=creatDom("button",{class:"searchBtn-cm"},null,"搜索"),
        searchBox=creatDom("div",{class:"searchBox-cm"},null,'<input type="text" placeholder="报账点名称\\报账点别名\\供应商名称">');

        searchBox.appendChild(searchBtn);

    var
        cancelBtn=creatDom("button",{class:"btn btn-primary btn-blue1" ,style:"background:#999;margin-right:10px;border-color:#999;color:#fff;"},null,"取消"),
        sureBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"确定"),
        tableBox=new TableCM({
            title:[searchBox],
            head:["选择","报账点名称","报账点别名","站点名称","原财务站点名","供应商名称"],
            cellWidth:["5%","19%","19%","19%","19%","19%"],
            valueKey:["value1","value2","value3","value4","value5","value6"]
        });
    getAccountListData(function (JSONdata) {
        tableBox.full(JSONdata);
        CMdialog.show();
        tableBox.initHight();
    });
    CMdialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">报账点列表</div>');
    CMdialog.fullContent(tableBox.tableBox);
    CMdialog.fullFooter([cancelBtn,sureBtn]);

    //点击事件绑定---------------------
        //搜索
        searchBtn.addEventListener("click",function (e) {
            e.stopPropagation();
            var searchValue=this.previousElementSibling.value.trim();
            if(!searchValue){
                CMalert("输入的字段不能为空！");
                return false
            }
            getAccountListData(function (JSONdata) {
                CMalert("搜索成功！");
                c_log(JSONdata);
                tableBox.full(JSONdata);
            })
        });
        //tableInput单选框
        tableBox.tableContent.addEventListener("click",function (e) {
           e.stopPropagation();
           var target=e.target;
                target.AccountData&&(checkInput=target)
        });
        //确定
        sureBtn.addEventListener("click",function (e) {
            e.stopPropagation();
            if(checkInput){

                    //                inputObj={
                    //                    accountName:creatDom("input",{type:"text",disabled:""}),//报账点名称
                    //                    accountOtherName:creatDom("input",{type:"text",disabled:""}),//报账点别名
                    //                    isLump:creatDom("input",{type:"text",disabled:""}),//是否包干
                    //                    property:creatDom("input",{type:"text",disabled:""}),//产权性质
                    //                    supplierName:creatDom("input",{type:"text",disabled:""}),//供应商名称
                    //                    costCenter:creatDom("input",{type:"text",disabled:""}),//成本中心
                    //                    tax:creatDom("input",{type:"text"}),//税金金额
                    //                    tariff:creatDom("input",{type:"text"}),//电费金额（不含税）
                    //                    writeOffAll:creatDom("input",{type:"text",disabled:""}),//核销总金额
                    //                    other:creatDom("input",{type:"text"}),//其他费用
                    //                    totalAmount:creatDom("input",{type:"text"}),//总金额（含税）
                    //                    paymentAll:creatDom("input",{type:"text",disabled:""})//支付总金额
                    //                }
                    //                this.previousElementSibling.value=checkInput.AccountData[this.valueKey];
                inputObj.accountName.value=checkInput.AccountData.value2;
                inputObj.accountOtherName.value=checkInput.AccountData.value3;
                inputObj.isLump.value="是";
                inputObj.property.value="自维";
                inputObj.supplierName.value=checkInput.AccountData.value6;
                /*
                   330演示                     
                 */
                // inputObj.costCenter.value=checkInput.AccountData.value5;   
                inputObj.tariff.value=Math.floor(Math.random()*10000).toFixed(2);
                CMdialog.hide();
                checkInput=null;
                btnary&&btnary.forEach(function(btn){
                    btn.isClick=true
                });

            }else {
                CMalert("您未选择任何站点！")
            }
        }.bind(this));
        //取消
        cancelBtn.addEventListener("click",function (e) {
            e.stopPropagation();
            CMdialog.hide()
        })
}
/*预付核销信息弹窗（dialog）*/
function dialogPrepaid(id,inputObj) {
    var
        value1=28515.89,value2=15000,userInpt=creatDom("input",{type:"text",value:""}),
        // dialog=new DialogCM({header:true,bodyCssString:"width:40%;margin-left:-20%"}),
        content=creatDom("div",{style:"overflow:auto;padding:20px;"}),
        saveBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"保存"),
        cancelBtn=creatDom("button",{class:"btn btn-primary btn-blue1" ,style:"background:#999;margin-right:10px;border-color:#999;color:#fff;"},null,"取消"),
        inputAry=[
            createInputUnit("预付单总金额",['<input type="text" disabled value="'+value1.toFixed(2)+'">']),
            createInputUnit("流程中核销金额",['<input type="text" disabled value="0.00">']),
            createInputUnit("已核销金额",['<input type="text" disabled value="'+value2.toFixed(2)+'">']),
            createInputUnit("未核销金额",['<input type="text" disabled value="'+(value1.toFixed(2)-value2.toFixed(2))+'">']),
            createInputUnit("本次核销金额",[userInpt])
        ];
    content.appendChild(creatDom("div",{ class:"text-center",style:"color:#e2935e;font-size:16px;padding:10px;"},null,"预付申请批次号：YF201703221490166298919"));
    inputAry.forEach(function (unit) {
        content.appendChild(unit)
    });
    CMdialog.initBodyCss("width:30%;margin-left:-15%");//重置弹框的宽度
    CMdialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">预付核销单</div>');
    CMdialog.fullContent(content);
    CMdialog.fullFooter([cancelBtn,saveBtn]);
    CMdialog.show();
    //事件绑定
    //保存
    saveBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        if(parseInt(userInpt.value.trim())>(value1-value2)){
            CMalert("“本次未核销金额”不能大于“未核销金额”，请您再次填写合适金额！",function(){
                CMdialog.initBodyCss("width:30%;margin-left:-15%");//重置弹框的宽度
            });
            return false
        }
        inputObj.writeOffAll.value=userInpt.value.trim();
        CMalert("保存成功！",null,2)
    });
    cancelBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        CMdialog.hide()
    })
}
/*查看详情（dialog）*/
function viewDetails(data) {
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
}
/*初始化填充电费录入----------------------------------------------------------------------------------------（page1）*/
function initSubmitTariffPage(contentBox,routBox) {

    var selectLink=regionalLinkage();
    var
        serchebox=SearchBox([//-----------------------------------------------------------------------搜索盒子创建实例化
            {key:"selectValue",dom:selectLink[0]},
            {key:"selectValue",dom:selectLink[1]},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"报账点名称"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"稽核单流水号"})}
        ]);
    serchebox.Search(function (valueArray) {//---------------------------------------------------搜索点击事件绑定
        CMalert(valueArray.join())
    });
    //------------------------------------------------------------------------------------------------初始化表格实例
    //（创建头部按钮）
    var addAudit=creatDom("button",{class:"btn btn-blue"},null,"+新增稽核单"),
        batchSubmit=creatDom("button",{class:"btn btn-blue"},null,"批量提交"),
        batchDelet=creatDom("button",{class:"btn btn-blue"},null,"批量删除"),
        batchIput=creatDom("button",{class:"btn btn-blue"},null,"批量导入");
    //创建页脚分页
    var pagingBox=creatDom("div",{style:"min-height:30px"}),
        paging=new PagingNew({
            footerBox:pagingBox,
            maxShowPage:10,
            setShowLine:[10,15,20,25,30],
            setShowLineChange:function (showLineNum) {//选择行后，重置分页
                getElectricityInputList(0,showLineNum,tableBox.valueKey,function (listJson,pageAll) {
                    tableBox.full(listJson);
                    paging.init(5)
                })
            },
            click:function (clickNum,showlineNum) {
                getElectricityInputList(clickNum+1,showlineNum,tableBox.valueKey,function (listJson,pageAll) {
                    tableBox.full(listJson);
                });
            }
        });
    // 创建表格
    var
        headCheckBox=creatDom("input",{type:"checkbox",name:"test"}),
        tableBox=new TableCM({
        title:[addAudit,batchSubmit,batchDelet,batchIput],
        head:[headCheckBox,"稽核单流水号","地区","区县","报账点名称","建单时间","电量（度）","金额（元）","状态","操作"],
        cellWidth:["4%","15%","7%","7%","14%","8%","5%","8%","8%","24%"],
        valueKey:["value1","value2","value10","value3","value4","value5","value6","value8","value9","value11"],
        footer:[pagingBox]
    });
    //全选事件绑定
    headCheckBox.addEventListener("click",function (e) {
        e.stopPropagation();
        var checkBoxAry=tableBox.tableContent.getElementsByTagName("input");
        [].forEach.call(checkBoxAry,function (checkbox) {
            checkbox.checked=this.checked
        }.bind(this));
    });
    //ajax请求数据
    getElectricityInputList(0,10,tableBox.valueKey,function (listJson,pageAll) {
        tableBox.full(listJson);
        paging.init(5);
    });

    var child_1=creatDom("div",{style:"height:100%;width:100%"}),
        child_2=creatDom("div",{style:"height:100%;width:100%;display:none;"});
    //新增稽核单事件绑定
    addAudit.addEventListener("click",function (e) {
        e.stopPropagation();
        routBox.innerHTML=routBox.innerHTML.replace('class="nowRout"',"")+'><span class="nowRout">新增稽核单</span>';
        // ajax请求新增
        // post_(Interface.get("CM","getAddAuditSheetData"),function (data) {
            initAddAuditSheet.call(child_2,child_1,routBox,"data");
        // });
    });
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
    //批量提交事件绑定
    batchSubmit.addEventListener("click",function (e) {
        e.stopPropagation();
        if(!getCheckedInput()){
            CMalert("未选择任何稽核单！");
            return false
        }
        CMalert("确定提交所选稽核单？",null,null,true)
    });
    //批量删除
    batchDelet.addEventListener("click",function (e) {
        e.stopPropagation();
        if(!getCheckedInput()){
            CMalert("未选择任何稽核单！");
            return false
        }
        CMalert("确定删除所选稽核单？",null,null,true)
    });
    //批量导入
    batchIput.addEventListener("click",function (e) {
        e.stopPropagation();
        creatDom("input",{type:"file"}).click();
        //        CMalert(this.textContent)
    });
    child_1.appendChild(serchebox);
    child_1.appendChild(tableBox.tableBox);

    contentBox.appendChild(child_1);
    contentBox.appendChild(child_2);
    tableBox.initHight();//重置table的高度
    // $(".selectpicker").selectpicker();
}
/*填充稽核单编辑界面*/
function fullAuditContent(initData,title,footerBox) {
    //实例化表格容器
    var inittObj={
        default:true, // 区分框架和TABLE
        cellWidth:["33%","33%","33%"],
        valueKey:["column1","column2","column3"]
    };
    title&&(inittObj.title=[title]);
    footerBox&&(inittObj.footer=[footerBox]);
    var tableBox=new TableCM(inittObj);


    var
        AccountBtn=creatDom("button",null,{valueKey:"value2"}),//查询报账点按钮；
        SupplierBtn=creatDom("button",null,{valueKey:"value6"}),//供应商名称按钮；
        costBtn=creatDom("button"),//成本中心按钮；
        Meterbtn=creatDom("span",null,{isClick:false},"电表明细"),//电表明细按钮
        Prepaidbtn=creatDom("span",null,{isClick:false},"预付核销信息");//预付核销信息按钮

    var btnBox=creatDom("div",{class:"text-right detail-query"},null,Meterbtn);//顶部两个按钮盒子
    btnBox.appendChild(Prepaidbtn);
    //事件绑定
    //查询报账点
    AccountBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        dialogAccountList.call(this,"新增稽核单ID",[Meterbtn,Prepaidbtn],inputObj)
    });
    //查询电表明细
    Meterbtn.addEventListener("click",function (e) {
        e.stopPropagation();
        if(this.isClick){
            dialogMeterDetail.call(this,"新增稽核单ID")
        }else{
            CMalert("请您先选择报账点！")
        }
    });
    //查询供应商名称
    SupplierBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        dialogAccountList.call(this,"新增稽核单ID",[Meterbtn,Prepaidbtn],inputObj)
    });
    //查询预付稽核
    Prepaidbtn.addEventListener("click",function (e) {
        e.stopPropagation();
        if(this.isClick){
            dialogPrepaid.call(this,"新增稽核单ID",inputObj)
        }else{
            CMalert("请您先选择报账点！")
        }
    });


    var
        addInvoiceBtn=creatDom("div",{class:"o-add"},{isAdd:false},"新增发票"),
        addInvoiceBox=creatDom("div",{class:"operation-box meter-detail "},null,'<span>发票税率：</span>');
    addInvoiceBox.appendChild(addInvoiceBtn);
    //新增发票事件绑定
    addInvoiceBtn.addEventListener("click",function (e) {
        var thisRow=this;
        inputObj.tax.value = "";
        inputObj.tariff.value = "";
        inputObj.totalAmount.value = "";
        inputObj.paymentAll.value = "";

        while (thisRow.parentNode.nodeName!="TBODY"){
            thisRow=thisRow.parentNode;
        }
        e.stopPropagation();
        if(this.isAdd){
            tableBox.deleteRow(thisRow.rowIndex+1,1);
            this.className="o-add";
            this.textContent="新增发票"
        }else {
            var addData=[
                {
                    column1:createInputUnit("发票类型2:",[creatSelectCM("","width:100%",["普通发票","分割单/发票复印件/收据","增值税普通发票","增值税专票"]),'<div class="operation-box meter-detail"><span>发票税率：</span></div>'],true),
                    column2:createInputUnit("税金金额2:",['<input type="text">']),
                    column3:createInputUnit("电费金额2（不含税）:",['<input type="text">'])
                }
            ];
            tableBox.nextPush(thisRow,addData);
            this.className="o-delete";
            this.textContent="删除发票"
        }
        this.isAdd=!this.isAdd
    });
    var fileBox=creatDom("div",{class:"input-box _search-input"},null,
        '<span>上传附件</span>' +
        '<div class="uploadFile-cm">' +
        '<label><input type="file" multiple><span>选择文件</span></label>' +
        '<button class="btn btn-default">上传所有文件</button>'+
        '</div>'
    );

    var
        FPoption=[
            ["增值税普通发票(17%)","17%"],
            ["增值税普通发票(3%)","3%"],
            ["增值税专用发票(17%)","17%"],
            ["增值税专用发票(3%)","3%"],
            ["普通发票","0"],
            ["分割单","0"],
            ["收据","0"],
            ["白条","0"]
        ],
        FPclass=creatSelectCM("","width:100%",FPoption.map(function(ary){return ary[0]})),  
        costClass = creatSelectCM("请选择公司","width:100%",["公司锦江分公司","成都分公司_TD"]),//成本中心

        inputObj={
            accountName:creatDom("input",{type:"text",disabled:""}),//报账点名称
            accountOtherName:creatDom("input",{type:"text",disabled:""}),//报账点别名
            isLump:creatDom("input",{type:"text",disabled:""}),//是否包干
            property:creatDom("input",{type:"text",disabled:""}),//产权性质
            supplierName:creatDom("input",{type:"text",disabled:""}),//供应商名称
            // costCenter:creatDom("input",{type:"text",disabled:""}),//成本中心   330演示
            tax:creatDom("input",{type:"text"}),//税金金额
            tariff:creatDom("input",{type:"text"}),//电费金额（不含税）
            writeOffAll:creatDom("input",{type:"text",disabled:""}),//核销总金额
            other:creatDom("input",{type:"text"}),//其他费用
            totalAmount:creatDom("input",{type:"text"}),//总金额（含税）
            paymentAll:creatDom("input",{type:"text",disabled:""})//支付总金额
        },
        fullContent=[
            {
                column1:createInputUnit("稽核单流水号:",[initData.serialNumber||"JH2017322224612"+Math.floor(Math.random()*1000)]),
                column2:createInputUnit("地市:",[initData.areas||"成都市"]),
                column3:createInputUnit("区县:",[initData.counties||"锦江区"])
            },
            {
                column1:createInputUnit("报账点名称:",[inputObj.accountName,AccountBtn,btnBox],true),
                column2:createInputUnit("报账点别名:",[inputObj.accountOtherName]),
                column3:createInputUnit("是否包干:",[inputObj.isLump],true)
            },
            {
                column1:createInputUnit("产权性质:",[inputObj.property],true),
                column2:createInputUnit("供应商名称:",[inputObj.supplierName,SupplierBtn],true),
                column3:createInputUnit("成本中心:",[costClass],true)
            },
            {
                column1:createInputUnit("发票类型:",[FPclass,addInvoiceBox],true),
                column2:createInputUnit("税金金额:",[inputObj.tax]),
                column3:createInputUnit("电费金额（不含税）:",[inputObj.tariff])
            },
            {
                column1:createInputUnit("核销总金额:",[inputObj.writeOffAll]),
                column2:createInputUnit("其他费用:",[inputObj.other]),
                column3:createInputUnit("总金额（含税）:",[inputObj.totalAmount])
            },
            {
                column1:createInputUnit("支付总金额:",[inputObj.paymentAll]),
                column2:"",
                column3:""
            },
            {
                column1:fileBox,
                column2:"",
                column3:""
            }
        ];
    //发票选择事件绑定 税率计算
    FPclass.onchage(function () {
        inputObj.tax.value=Number(parseInt(inputObj.tariff.value)*parseInt(FPoption[this.index][1])/100).toFixed(2);
        inputObj.totalAmount.value=parseInt(inputObj.tariff.value)*(1+parseInt(FPoption[this.index][1])/100)+(parseInt(inputObj.other.value)||0);
        inputObj.paymentAll.value=parseInt( inputObj.totalAmount.value)-(parseInt(inputObj.writeOffAll.value)||0);
        addInvoiceBox.getElementsByTagName("span")[0].textContent="发票税率："+FPoption[this.index][1];
    });
    inputObj.other.addEventListener("input",function(e){
        inputObj.totalAmount.value=parseInt(inputObj.tariff.value)*(1+parseInt(FPoption[FPclass.index][1])/100)+(parseInt(this.value)||0);
        inputObj.paymentAll.value=parseInt( inputObj.totalAmount.value)-(parseInt(inputObj.writeOffAll.value)||0);
    });
    tableBox.full(fullContent);
    var
        checkedFileBtn=fileBox.getElementsByTagName("input")[0],
        uploadFileBtn=fileBox.getElementsByTagName("button")[0],
        fileListBox=creatDom("div",{class:"text-left",style:"width:100%;padding-left:11.45%"}),
        td=tableBox.tableContent.insertRow().insertCell(0);

    td.appendChild(fileListBox);
    td.colSpan=3;
    //文件选择事件绑定
    checkedFileBtn.addEventListener("change",function (e) {
        var files=this.files,fra=document.createDocumentFragment();

        if((files.length+fileListBox.children.length)>5){
            CMalert("上传的文件最多不能超过5个");
            return false
        }

        for(var f=0;f<files.length;f++){
            if(!/^image\/\S+/.test(files[f].type)){
                c_log("文件："+files[f].name+" 不是图片格式");
                break
            }
            var fileTtem=creatDom("div",{class:"file-item"},{file:files[f]},
                '<div><img src="'+URL.createObjectURL(files[f]) +'" alt="'+files[f].name+'"></div><button class="file-close">×</button>'
            );
            fra.appendChild(fileTtem);
        }
        fileListBox.appendChild(fra)
    });
    //文件上传事件绑定
    uploadFileBtn.addEventListener("click",function (e) {
        var uploadFile=[];

        [].forEach.call(fileListBox.children,function (fileItem) {
            uploadFile.push(fileItem.file)
        });
        if(uploadFile.length==0){
            CMalert("您选择的附件为空，请选择后再上传！");
            return false
        }
        c_log(uploadFile,"FileAry------");
        CMalert("文件上传成功，请完善信息后点击保存！")
    });

    //删除选择的文件
    fileListBox.addEventListener("click",function (e) {
        var target=e.target;
        if(target.nodeName=="BUTTON"){
            this.removeChild(target.parentNode);
            URL.revokeObjectURL(target.previousElementSibling.getElementsByTagName("img")[0].src)
        }
        if(target.nodeName=="IMG"){
            var sureBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"确认");
            addMetaerDialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">'+target.alt+'</div>');
            addMetaerDialog.fullContent('<div class="text-center" style="width: 100%"><img src="'+target.src+'" style="max-width: 100%"></div>');
            addMetaerDialog.fullFooter([sureBtn]);
            addMetaerDialog.show();
            sureBtn.addEventListener("click",function (e) {
                e.stopPropagation();
                addMetaerDialog.hide()
            })
        }

    });
    return tableBox
}
/*初始化新增稽核单------------------------------------------------------------------------------------------（page2）*/
function initAddAuditSheet(previousBox,routerBox,initData) {
    c_log(initData,"addData");
    //相对于同一层级，唯一显示当前容器
    onlyShow(this);
    this.innerHTML="";
    //this指向此页面的容器（并非功能页的容器）
    //创建保存/提交按钮
    var save=creatDom("button",{class:"btn btn-primary" ,type:"button",style:"margin-right:10px;background-color:#4b8de6;width:100px;"},null,"保存"),
        submit=creatDom("button",{class:"btn btn-primary" ,type:"button",style:"background-color:#4b8de6;width:100px;"},null,"提交"),
        btnBox=creatDom("div",{class:"text-center"},null,save);

        btnBox.appendChild(submit);

    save.addEventListener("click",function () {
        CMalert("保存成功",function () {
            MENU.getItem("inputTariff").click();
        });
    });
    submit.addEventListener("click",function () {
        CMalert("提交成功",function () {
            MENU.getItem("inputTariff").click();
        });
    });
    var title=creatDom("h4",{style:"margin:-10px;font-weight:bold;border-bottom:1px solid #f6f6f8;padding:15px 10px;"},null,"台账明细");
    var tableBox=fullAuditContent(initData,title,btnBox);
    this.appendChild(tableBox.tableBox);
    tableBox.initHight()
}
/*新增电表明细（dialog）*/
function addMeterDetail(id) {
    var
        cancelBtn=creatDom("button",{class:"btn btn-primary btn-blue1" ,style:"background:#999;margin-right:10px;border-color:#999;color:#fff;"},null,"取消"),
        sureBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"确认");

    //创建表格框架
    var tableBox=new TableCM({
        default:true,
        cellWidth:["33.3%","33.3%","33.3%"],
        valueKey:["column1","column2","column3"]
    });
    //创建填充数据
    var dataInput=creatDom("input",{size:16,type:"text",readOnly:"",class:"form_datetime form-control",placehovarlder:"123456"});
    var dataInputs=creatDom("input",{size:16,type:"text",readOnly:"",class:"form_datetime",placehovarlder:""});
    var selectDate = creatSelectCM("是","width:100%",["否"]);
    var fullData=[
        {
            column1:createInputUnit("是否翻表:",[selectDate]),
            column2:createInputUnit("电损（度）:",['<input type="text">']),
            column3:""
        },
        {
            column1:createInputUnit("电费归属起始日期:",[dataInput]),
            column2:createInputUnit("电费归属终止日期:",[dataInputs]),
            column3:createInputUnit("用电天数:",['<input type="text">'])
        },
        {
            column1:createInputUnit("用电起度（度）:",['<input type="text" disabled value="18800">']),
            column2:createInputUnit("用电止度（度）:",['<input type="text">']),
            column3:createInputUnit("总用电量:",['<input type="text">'])
        },
        {
            column1:createInputUnit("单价:",['<input type="text">']),
            column2:createInputUnit("电表总金额（含税）:",['<input type="text">']),
            column3:""
        }
    ];
    tableBox.full(fullData);//填充框架

    var contentBox=creatDom("div",null,null,tableBox.tableBox);
        contentBox.appendChild(
            creatDom("div",{style:"padding:10px"},null,
                createInputUnit("备注:",['<textarea style="width: 100%;height:100px;border: 1px solid #d2d4d6;border-radius: 4px;resize: none;line-height: 20px">'],false,"width:11.45%;vertical-align:top;")
            ));

    //填充弹框
    addMetaerDialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">电表明细填写</div>');
    addMetaerDialog.fullContent(creatDom("div",{style:"padding-right:2%;"},null,contentBox));
    addMetaerDialog.fullFooter([cancelBtn,sureBtn]);
    addMetaerDialog.show();//显示弹框
    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        showMeridian: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN',//中文，需要引用zh-CN.js包
        startView: 2,//月视图
        minView: 2//日期时间选择器所能够提供的最精确的时间选择视图
    });//初始化时间选择器
    tableBox.initHight()//重置高度
    //按钮事件绑定
    cancelBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        addMetaerDialog.hide();
    });
    sureBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        CMalert("确认成功",null,2);
        this.textContent="修改";
        this.className="o-modify";
    }.bind(this))
}
/*初始化电表明细列表（dialog）*/
function dialogMeterDetail(meterId) {
    var meterTable=new TableCM({
       head:["电表号","电表户号","电表标识符","电表归属（起始日期）","电表归属（终止日期）","操作"],
        cellWidth:["26%","12%","12%","20%","20%","10%"],
        valueKey:["value1","value2","value3","value4","value5","value6"]
    });
    //创建分页
    var
        pagingBox=creatDom("div",{class:"text-center"}),
        meterPaging=new PagingNew({
            footerBox:pagingBox,
            maxShowPage:10,
            click:function (clickNum,showlineNum) {
                CMalert(clickNum+":"+showlineNum||"")
            }
        });

    //请求数据
    $.ajax({
        url:"testJson/dbmx_.json",
        type:"get",
        dataType:"json",
        success:function (data) {
            var valueKeyAry=meterTable.valueKey.slice(0,-1);
            data.forEach(function (obj) {
                valueKeyAry.forEach(function (key) {
                    obj[key]='<div class="ellipsis">'+obj[key]+'</div>'
                });
                obj.value6=creatDom("div",{class:"operation-box"});
                obj.value6.appendChild(createOperation("add",obj.value1,function (id) {//操作（新增电表详情）点击事件
                    addMeterDetail.call(this,id)
                }));
            });
            meterPaging.init(25);
            meterTable.full(data);
            CMdialog.show();
            meterTable.initHight()
        }
    });

    CMdialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">电表明细</div>');
    CMdialog.fullContent(meterTable.tableBox);
    CMdialog.fullFooter([pagingBox]);
}
/*____________________________________________________________________________________________________________________*/
/*-------------------------------------------------|||（电费稽核）|||-------------------------------------------------*/
/*初始化填充电费稽核（page）*/
function initAuditTariff(contentBox,routBox) {
    var
        //select1=creatSelectCM("请选择稽核单状态","",["等待提交审批","审批中","审批成功","被驳回","等待推送财务","审批报销发起人推送财务","等待财务报销","报销成功","报销失败"]),
        select1=creatSelectCM("请选择稽核单状态","",["审批中","审批通过","审批驳回","等待报销","报销成功","报销失败"]),
        serchebox=SearchBox([//-----------------------------------------------------------------------搜索盒子创建实例化
            {key:"selectValue",dom:select1},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"稽核单流水号"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"报账点名称"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",readOnly:"",class:"form_datetime form-control",placeholder:"建单时间"})}
        ]);
    serchebox.Search(function (valueArray) {//---------------------------------------------------搜索点击事件绑定
        CMalert(valueArray.join())
    });
    //（创建头部按钮）
    var batchSubmit=creatDom("button",{class:"btn btn-blue"},null,"批量通过"),
        batchDelete=creatDom("button",{class:"btn btn-blue"},null,"批量驳回");
    //创建页脚分页
    var pagingBox=creatDom("div",{style:"min-height:30px"}),
        paging=new PagingNew({
            footerBox:pagingBox,
            maxShowPage:10,
            setShowLine:[10,15,20,25,30],
            setShowLineChange:function (showLineNum) {

            },
            click:function (clickNum,showlineNum) {
                CMalert(clickNum+":"+showlineNum)
            }
        });
    // 创建表格
    var
        headCheckBox=creatDom("input",{type:"checkbox",name:"test"}),
        tableBox=new TableCM({
        title:[batchSubmit,batchDelete],
        head:[headCheckBox,"稽核单流水号","地区","区县","稽核单状态","报账点名称","建单时间","电量（度）","金额（元）","同比上个月涨幅","电费金额（不含税）","税金金额","其他费用","操作"],
        cellWidth:["5%","15%","7%","7%","7%","15%","8%","8%","8%","auto","200px"],
        valueKey:["value1","value2","value3","value4","value5","value6","value7","value8","value9","value10","value11"],
        footer:[pagingBox]
    });
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
    //批量提交事件绑定
    batchSubmit.addEventListener("click",function (e) {
        e.stopPropagation();
        if(!getCheckedInput()){
            CMalert("未选择任何稽核单！");
            return false
        }
        CMalert("确定批量通过？",null,null,true)
    });
    //批量删除事件绑定
    batchDelete.addEventListener("click",function (e) {
        e.stopPropagation();
        if(!getCheckedInput()){
            CMalert("未选择任何稽核单！");
            return false
        }
        CMalert("确定批量驳回？",null,null,true)
    });
    //请求数据
    $.ajax({
        url:"testJson/dfjh_.json",
        type:"get",
        dataType:"json",
        success:function (data) {
            var userNow=userSetObj.judgeUser(getUserData());
            var valueKeyAry=tableBox.valueKey.slice(1,-1);
            data.forEach(function (obj) {
                var id=obj.value2;
                obj.value1=creatDom("input",{type:"checkbox",name:"test",id:obj.value1});
                valueKeyAry.forEach(function (key) {
                    obj[key]='<div class="ellipsis">'+obj[key]+'</div>'
                });
                obj.value11=creatDom("div",{class:"operation-box"});
                switch (userNow.userLevel){
                    case 0:
                        ;break;
                    case 1:
                        obj.value11.appendChild(createOperation("view",id,function (id) {
                            viewDetails()
                        }));
                        obj.value11.appendChild(createOperation("adopt",id,function (id) {
                            CMalert("确认通过?",null,null,true)
                        }));
                        obj.value11.appendChild(createOperation("reject",id,function (id) {
                            CMalert("确认驳回？",null,null,true)
                        }))
                        ;break;
                    case 2:
                        obj.value11.appendChild(createOperation("view",id,function (id) {
                            viewDetails()
                        }));
                        obj.value11.appendChild(createOperation("revoke",id,function (id) {
                            CMalert("撤销成功！")
                        }))

                        ;break;
                }
            });
            paging.init(5);
            tableBox.full(data);
        }
    });
    $(contentBox).append(serchebox);//添加搜索盒子到容器内部
    $(contentBox).append(tableBox.tableBox);
    tableBox.initHight();//重置table的高度
    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        showMeridian: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN',//中文，需要引用zh-CN.js包
        startView: 2,//月视图
        minView: 2//日期时间选择器所能够提供的最精确的时间选择视图
    });//初始化时间选择器
}
/*修改稽核单（dialog）*/
function modifyAuditTariff(id) {
    var
        cancelBtn=creatDom("button",{class:"btn btn-primary btn-blue1" ,style:"background:#999;margin-right:10px;border-color:#999;color:#fff;"},null,"取消"),
        sureBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"保存");

   var tableBox=fullAuditContent(id);

    //填充弹框
    AuditTariff.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">修改稽核单</div>');
    AuditTariff.fullContent(tableBox.tableBox);
    AuditTariff.fullFooter([cancelBtn,sureBtn]);
    AuditTariff.show();//显示弹框
    tableBox.initHight()//重置高度
    //按钮事件绑定
    cancelBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        AuditTariff.hide();
    });
    sureBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        CMalert("保存成功",null,2);
    }.bind(this))
}
/*____________________________________________________________________________________________________________________*/
/*-------------------------------------------------|||（提交财务）|||-------------------------------------------------*/
/*初始化填充提交财务-----------------------------------------------------------------------------------------（page1）*/
function initInputFinance(contentBox,routBox) {

    var child_1=creatDom("div",{style:"height:100%;width:100%"}),
        child_2=creatDom("div",{style:"height:100%;width:100%;display:none;"});

    var
        serchebox=SearchBox([//-----------------------------------------------------------------------搜索盒子创建实例化
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"稽核单流水号"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"报账点名称"})}
        ]);
    serchebox.Search(function (valueArray) {//---------------------------------------------------搜索点击事件绑定
        CMalert(valueArray.join())
    });



    //--------------------------------------------------

    //创建页脚分页
    var pagingBox=creatDom("div",{style:"min-height:30px"}),
        paging=new PagingNew({
            footerBox:pagingBox,
            maxShowPage:10,
            setShowLine:[10,15,20,25,30],
            setShowLineChange:function (showLineNum) {

            },
            click:function (clickNum,showlineNum) {
                CMalert(clickNum+":"+showlineNum)
            }
        });
    //（创建头部按钮）
    var addAudit=creatDom("button",{class:"btn btn-blue"},null,"生成电费提交单");
    addAudit.addEventListener("click",function (e) {
        e.stopPropagation();
        routBox.innerHTML=routBox.innerHTML.replace('class="nowRout"',"")+'><span class="nowRout">生成电费提交单</span>';
        generateTariffAuditSheet.call(child_2,child_1,routBox)
    });
    // 创建表格
    var
        headCheckBox=creatDom("input",{type:"checkbox",name:"test"}),
        tableBox=new TableCM({
        title:[addAudit],
        head:[headCheckBox,"稽核单流水号","地市","区县","报账点名称","建单时间","电量（度）","金额（元）","状态","操作"],
        cellWidth:["5%","16%","8%","8%","15%","12%","8%","8%","12%","8%"],
        valueKey:["value1","value2","value3","value4","value5","value6","value7","value9","value10","value11"],
        footer:[pagingBox]
    });
    //全选事件绑定
    headCheckBox.addEventListener("click",function (e) {
        e.stopPropagation();
        var checkBoxAry=tableBox.tableContent.getElementsByTagName("input");
        [].forEach.call(checkBoxAry,function (checkbox) {
            checkbox.checked=this.checked
        }.bind(this));
    });
    //请求数据
    $.ajax({
        url:"testJson/tjcw.json",
        type:"get",
        dataType:"json",
        success:function (data) {
            var valueKeyAry=tableBox.valueKey.slice(1,-1);
            data.forEach(function (obj) {
                var id=obj.value2;
                valueKeyAry.forEach(function (key) {
                    obj[key]='<div class="ellipsis">'+obj[key]+'</div>'
                });
                obj.value1=creatDom("input",{type:"checkbox",name:"test",id:obj.value1});
                obj.value11=creatDom("div",{class:"operation-box"});
                obj.value11.appendChild(createOperation("view",id,function (id) {
                   viewDetails();
                }));
            });
            paging.init(5);
            tableBox.full(data);
        }
    });
    child_1.appendChild(serchebox);//添加搜索盒子到容器内部
    child_1.appendChild(tableBox.tableBox);
    $(contentBox).append(child_1);
    $(contentBox).append(child_2);
    tableBox.initHight();//重置table的高度
}
/*初始化生成电费提交单---------------------------------------------------------------------------------------（page2）*/
function generateTariffAuditSheet(previousBox,routerBox) {
    // console.log(this);
    onlyShow(this);//只显示自己
    this.innerHTML="";

    var
        select1=creatSelectCM("请选择稽核单状态","",["等待提交稽核","等待提交审批","审批中","审批通过","被驳回"]),
        serchebox=SearchBox([//-----------------------------------------------------------------------搜索盒子创建实例化
            {key:"selectValue",dom:select1},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"电费提交单号"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",readOnly:"",class:"form_datetime form-control",placeholder:"起始时间"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",readOnly:"",class:"form_datetime form-control",placeholder:"结束时间"})}
        ]);
    serchebox.Search(function (valueArray) {//---------------------------------------------------搜索点击事件绑定
        CMalert(valueArray.join())
    });
    //（创建头部按钮）
    var addAudit=creatDom("button",{class:"btn btn-blue"},null,"批量推送财务"),
        batchSubmit=creatDom("button",{class:"btn btn-blue"},null,"批量推送报销人");
    addAudit.addEventListener("click",function (e) {
        CMalert("批量推送财务成功",function () {
            MENU.getItem("inputFinance").click();
        });
    });
    //创建页脚分页
    var pagingBox=creatDom("div",{style:"min-height:30px"}),
        paging=new PagingNew({
            footerBox:pagingBox,
            maxShowPage:10,
            setShowLine:[10,15,20,25,30],
            setShowLineChange:function (showLineNum) {

            },
            click:function (clickNum,showlineNum) {
                CMalert(clickNum+":"+showlineNum)
            }
        });
    // 创建表格
    var
        headCheckBox=creatDom("input",{type:"checkbox",name:"test"}),
        tableBox=new TableCM({
        title:[addAudit,batchSubmit],
        head:[headCheckBox,"电费提交单号","制单时间","地市","区县","推送类型","报销状态","价款金额（元）","税金金额（元）","操作"],
        cellWidth:["5%","16%","8%","8%","8%","8%","8%","8%","8%","25%","24%"],
        valueKey:["value1","value2","value3","value4","value5","value6","value7","value8","value9","value11"],
        footer:[pagingBox]
    });
    //全选事件绑定
    headCheckBox.addEventListener("click",function (e) {
        e.stopPropagation();
        var checkBoxAry=tableBox.tableContent.getElementsByTagName("input");
        [].forEach.call(checkBoxAry,function (checkbox) {
            checkbox.checked=this.checked
        }.bind(this));
    });
    //请求数据
    $.ajax({
        url:"testJson/dftj.json",
        type:"get",
        dataType:"json",
        success:function (data) {
            var valueKeyAry=tableBox.valueKey.slice(1,-1);

            data.forEach(function (obj) {
                var id=obj.value2;
                valueKeyAry.forEach(function (key) {
                    obj[key]='<div class="ellipsis">'+obj[key]+'</div>'
                });
                obj.value1=creatDom("input",{type:"checkbox",name:"test",id:obj.value1});
                obj.value11=creatDom("div",{class:"operation-box"});
                obj.value11.appendChild(createOperation("view",id,function (id) {
                    viweTariffDetails();
                }));
                obj.value11.appendChild(createOperation("push-finance",id,function (id) {
                    CMalert(this.textContent+"成功，单号："+id,function () {
                        MENU.getItem("inputFinance").click();
                    });
                }));
                obj.value11.appendChild(createOperation("push-expense",id,function (id) {
                    CMalert(this.textContent+"成功，单号："+id,function () {
                        MENU.getItem("inputFinance").click();
                    });
                }));
            });
            paging.init(25);
            tableBox.full(data);
        }
    });
    $(this).append(serchebox);//添加搜索盒子到容器内部
    $(this).append(tableBox.tableBox);
    tableBox.initHight();//重置table的高度
    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        showMeridian: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN',//中文，需要引用zh-CN.js包
        startView: 2,//月视图
        minView: 2//日期时间选择器所能够提供的最精确的时间选择视图
    });//初始化时间选择器
}
/*查看电费提交单详情（dialog）*/
function viweTariffDetails(){
    var
        sureBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"确定"),
        tableBox1=new TableCM({
            border:true,
            default:true,
            title:['<div class="text-left" style="font-size: 17px;font-weight: bold;color:#4b8de6">电费提交单详情</div>'],
            cellWidth:["33%","33%","33%"],
            valueKey:["column1","column2"]
        });
    // 创建表格
    var
        tableBox2=new TableCM({
            title:['<div class="text-left" style="font-size: 17px;font-weight: bold;color:#4b8de6">稽核单列表</div>'],
            head:["稽核单号","地市","区县","录入员","稽核单状态","金额","供应商","操作"],
            cellWidth:["18%","6%","6%","20%","12%","6%","24%","8%"],
            valueKey:["value2","value10","value3","value4","value9","value8","value12","value11"]
        });
    var fullContentData1=[
        {
            column1:createInputUnit("电费提交单号:",["CD201703191488336074237"]),
            column2:createInputUnit("区县经办人:",["成都_后勤服务中心_彭郎"])
        },
        {
            column1:createInputUnit("制单时间:",["2017-03-19 10:14"]),
            column2:createInputUnit("地市:",["成都"])
        },
        {
            column1:createInputUnit("区县:",["锦江区"]),
            column2:createInputUnit("推送类型:",["报销"])
        },
        {
            column1:createInputUnit("报销状态:",[""]),
            column2:createInputUnit("报销总金额:",["94995.3"])
        }
    ];
    tableBox1.full(fullContentData1);
    post_("testJson/dflr_.json",function(data){
        var valueKeyAry=tableBox2.valueKey;
        data.forEach(function(obj){
            valueKeyAry.forEach(function (key) {
                obj[key]='<div class="ellipsis">'+obj[key]+'</div>'
            });
            obj.value11=creatDom("div",{class:"operation-box"});
            obj.value11.appendChild(createOperation("view",obj.value2,function (id) {
                viewDetails();
            }));
        });
        tableBox2.full(data.slice(0,3));
    });


    var contentBox=creatDom("div",null,null,tableBox1.tableBox);
        contentBox.appendChild(tableBox2.tableBox);

        CMdialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">查看详情</div>');
        CMdialog.fullContent(contentBox);
        CMdialog.fullFooter([sureBtn]);
        CMdialog.show();
        //事件绑定
        sureBtn.addEventListener("click",function (e) {
            e.stopPropagation();
            CMdialog.hide();
        })
}
/*____________________________________________________________________________________________________________________*/
/*----------------------------------------------|||（系统管理>流程管理）|||-------------------------------------------*/
/*初始化填充流程管理*/
function initProcessManagement(contentBox,routBox) {
    var
        select1=creatSelectCM("地区","",["成都市","德阳市","绵阳市"]),
        select2=creatSelectCM("区县","",["高新区","武侯区","青羊区"]),
        serchebox=SearchBox([//-----------------------------------------------------------------------搜索盒子创建实例化
            {key:"selectValue",dom:select1},
            {key:"selectValue",dom:select2},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"审批人"})}
        ]);
    serchebox.Search(function (valueArray) {//---------------------------------------------------搜索点击事件绑定
        CMalert(valueArray)
    });

    contentBox.appendChild(serchebox)
}