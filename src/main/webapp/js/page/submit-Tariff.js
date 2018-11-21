/**
 * Created by issuser on 2017/3/8.
 */
MENU.addItem([
    {
        value:"稽核管理",
        id:"AuditManagement",
        icon:"img/audit_icon.png",
        childBoxStyle:"background-color:#1c2226",
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
                        child:[
                            //第四级菜单
                            {
                                value:"电费录入",
                                id:"inputTariff",
                                clickFun:function (contentBox,routBox) {
                                    initSubmitTariffPage.apply(this,arguments)
                                }
                            },
                            {
                                value:"电费稽核",
                                id:"auditTariff",
                                clickFun:function (contentBox,routBox) {
                                    initAuditTariff.apply(this,arguments)
                                }
                            },
                            {
                                value:"提交财务",
                                id:"inputFinance",
                                clickFun:function (contentBox,routBox) {
                                    initInputFinance.apply(this,arguments)
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
]);
var CMdialog=new DialogCM({bodyCssString:"width:60%;margin-left:-30%",header:true,footer:true});//主要弹窗
var addMetaerDialog=new DialogCM({bodyCssString:"width:60%;margin-left:-30%",header:true,footer:true});//新增电表详情弹窗

/*创建操作元素（查看/编辑/撤销/提交..等等）*/
function createOperation(type,id,fun) {
    var
        myary={
            "add":"增加",
            "view":"查看",
            "modify":"修改",
            "submit":"提交",
            "revoke":"撤销",
            "delete":"删除",
            "push-finance":"推送财务",
            "push-expense":"推送报销发起人"
        },
        div=creatDom("div",{class:"o-"+type},null,myary[type]);
    div.addEventListener("click",function (e) {
        e.stopPropagation();
        fun&&fun.call(this,id);
        alert(Interface.get("CM",type)+"单号：");
        // $.ajax({
        //     url:Interface.get("CM",type),
        //     type:"get",
        //     dataType:"json",
        //     success:function (data) {
        //
        //     }
        // })
    });


    return div
}
/*创建输入单元*/
function createInputUnit(name,domAry,isMust,nameStyle) {
    var box=creatDom("label",{class:"input-box search-input"},{isMust:isMust},'<span '+(isMust===true?'class="mast-icon" ':' ')+(nameStyle?'style="'+nameStyle+'"':' ')+'>'+name+'</span><div></div>');
    var div=box.getElementsByTagName("div")[0];
    domAry.forEach(function (dom) {
        $(div).append(dom);
    });
    return box
}
/*初始化新增稽核单*/
function initAddAuditSheet(previousBox,routerBox) {
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

            alert("保存成功");
            MENU.getItem("inputTariff").click();
        });
        submit.addEventListener("click",function () {
            alert("提交成功");
            MENU.getItem("inputTariff").click();
        });

    //实例化表格容器
    var tableBox=new TableCM({
        default:true,
        title:[creatDom("h4",{style:"margin:-10px;font-weight:bold;border-bottom:1px solid #f6f6f8;padding:15px 10px;"},null,"台账明细")],
        cellWidth:["33%","33%","33%"],
        valueKey:["column1","column2","column3"],
        footer:[btnBox]
    });


        var
            AccountBtn=creatDom("button"),//查询报账点按钮；
            SupplierBtn=creatDom("button"),//供应商名称按钮；
            costBtn=creatDom("button"),//成本中心按钮；
            Meterbtn=creatDom("div",{class:"meter-detail"},null,"电表明细");//电表明细按钮
            AccountBtn.addEventListener("click",function (e) {
                e.stopPropagation();
                alert("获取报账点名称！")
            });
            Meterbtn.addEventListener("click",function (e) {
                e.stopPropagation();
               initMeterDetail("123456")
            });
            SupplierBtn.addEventListener("click",function (e) {
                e.stopPropagation();
                var dialog=new DialogCM({header:true,bodyCssString:"width:40%;margin-left:-20%"}),
                    content=creatDom("div",{style:"overflow:auto;padding:20px;"}),
                    inputAry=[
                        createInputUnit("预付金额",[creatDom("input",{type:"text",value:""})]),
                        createInputUnit("流程中核销金额",[creatDom("input",{type:"text",value:""})]),
                        createInputUnit("已核销金额",[creatDom("input",{type:"text",value:""})]),
                        createInputUnit("未核销金额",[creatDom("input",{type:"text",value:""})]),
                        createInputUnit("本次核销金额",[creatDom("input",{type:"text",value:""})]),
                    ];
                content.appendChild(creatDom("div",{ class:"text-center",style:"color:#e2935e;font-size:16px;padding:10px;"},null,"预付申请批次号：ABC123456789"));
                inputAry.forEach(function (unit) {
                    content.appendChild(unit)
                });
                CMdialog.initBodyCss("width:30%;margin-left:-15%");//重置弹框的宽度
                CMdialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">预付稽核信息</div>');
                CMdialog.fullContent(content);
                CMdialog.fullFooter([]);
                CMdialog.show()
            });


    var
        uploadFile=creatDom("label",{class:"uploadFile-cm"},null,'<input type="file" multiple>'),
        fullContent=[
        {
            column1:createInputUnit("稽核单流水号:",["#12345678"]),
            column2:createInputUnit("地市:",["成都市"]),
            column3:createInputUnit("区县:",["武侯区"])
        },
        {
            column1:createInputUnit("报账点名称:",['<input type="text" readonly>',AccountBtn,Meterbtn],true),
            column2:createInputUnit("报账点别名:",['<input type="text">'],true),
            column3:createInputUnit("是否包干:",[creatSelectCM("","width:100%",["不包干","包干"])],true)
        },
        {
            column1:createInputUnit("产权性质:",[creatSelectCM("","width:100%",["自维","塔维"])],true),
            column2:createInputUnit("供应商名称:",['<input type="text" readonly>',SupplierBtn],true),
            column3:createInputUnit("成本中心:",['<input type="text" readonly>',costBtn],true)
        },
        {
            column1:createInputUnit("铁塔站地址编号:",['<input type="text">'],false,"color:#4b8de6"),
            column2:createInputUnit("开票系数:",['<input type="text">'],false,"color:#4b8de6"),
            column3:createInputUnit("分摊比例:",['<input type="text">'],false,"color:#4b8de6")
        },
        {
            column1:createInputUnit("分摊电费金额:",['<input type="text">'],false,"color:#4b8de6"),
            column2:"",
            column3:""
        },
        {
            column1:createInputUnit("发票类型:",[creatSelectCM("普通发票","width:100%",["普通发票","分割单/发票复印件/收据","增值税普通发票","增值税专票"])],true),
            column2:createInputUnit("税率:",['<input type="text" disabled>']),
            column3:createInputUnit("税金金额:",['<input type="text">'])
        },
        {
            column1:createInputUnit("电费金额（不含税）:",['<input type="text">']),
            column2:createInputUnit("其他费用:",['<input type="text" >']),
            column3:createInputUnit("总金额（含税）:",['<input type="text">'])
        },
        {
            column1:createInputUnit("报销总金额:",['<input type="text">']),
            column2:createInputUnit("支付总金额:",['<input type="text" >']),
            column3:""
        },
        {
            column1:createInputUnit("上传附件:",[uploadFile]),
            column2:"",
            column3:""
        }
    ];

    tableBox.full(fullContent);

    this.appendChild(tableBox.tableBox);
    tableBox.initHight()
}
/*新增电表明细*/
function addMeterDetail(id) {
    CMdialog.hide();//隐藏电表列表弹框

    var
        cancelBtn=creatDom("button",{class:"btn btn-primary btn-blue1" ,style:"background:#999;margin-right:10px;border-color:#999;color:#fff;"},null,"取消"),
        sureBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"确认");

    //创建表格框架
    var tableBox=new TableCM({
        default:true,
        cellWidth:["33%","33%","33%"],
        valueKey:["column1","column2","column3"]
    });
    //创建填充数据
    var fullData=[
        {
            column1:createInputUnit("是否翻表:",['<input type="text">']),
            column2:createInputUnit("电表户号:",['<input type="text">']),
            column3:createInputUnit("用电止度（度）:",['<input type="text">'])
        },
        {
            column1:createInputUnit("电损（度）:",['<input type="text">']),
            column2:createInputUnit("用电起度（度）:",['<input type="text">']),
            column3:createInputUnit("单价（不含税）:",['<input type="text">'])
        },
        {
            column1:createInputUnit("备注:",['<input type="text">']),
            column2:createInputUnit("总电量（度）:",['<input type="text">']),
            column3:createInputUnit("用电天数（度）:",['<input type="text">'])
        },
    ];
    tableBox.full(fullData);//填充框架


    //填充弹框
    addMetaerDialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">电表明细填写</div>');
    addMetaerDialog.fullContent(tableBox.tableBox);
    addMetaerDialog.fullFooter([cancelBtn,sureBtn]);
    addMetaerDialog.show();//显示弹框
    tableBox.initHight()//重置高度
    //按钮事件绑定
    cancelBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        addMetaerDialog.hide();
        CMdialog.show();//再次显示电表列表弹框
    });
    sureBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        alert("确认成功");
        addMetaerDialog.hide();
        this.textContent="修改";
        this.className="o-modify";
        CMdialog.show();//再次显示电表列表弹框
    }.bind(this))
}
/*初始化电表明细*/
function initMeterDetail(meterId) {

    var meterTable=new TableCM({
       head:["电表号","电表户号","电表编号","电表归属（起始日期）","电表归属（终止日期）","操作"],
        cellWidth:["26%","12%","12%","20%","20%","10%"],
        valueKey:["value1","value2","value3","value4","value5","value6"],
    });
    //创建分页
    var
        pagingBox=creatDom("div",{class:"text-center"}),
        meterPaging=new PagingNew({
            footerBox:pagingBox,
            maxShowPage:10,
            click:function (clickNum,showlineNum) {
                alert(clickNum+":"+showlineNum||"")
            }
        });

    //请求数据
    $.ajax({
        url:"testJson/meterDetailsData.json",
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
/*初始化填充电费录入*/
function initSubmitTariffPage(contentBox,routBox) {

    var
        select1=creatSelectCM("地区","",["全部","已处理","未处理"]),
        select2=creatSelectCM("区县","",["全部","再批","再次提交"]),
        select3=creatSelectCM("状态","",["等待提交稽核","审批中","等待提交审批","审批通过","被驳回","等待推送财务","等待推送报销发起人","推送成功"]),
        serchebox=SearchBox([//-----------------------------------------------------------------------搜索盒子创建实例化
            {key:"selectValue",dom:select1},
            {key:"selectValue",dom:select2},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"报账点名称"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"稽核单流水号"})},
            {key:"selectValue",dom:select3}
            ]);
        serchebox.Search(function (valueArray) {//---------------------------------------------------搜索点击事件绑定
           console.log(valueArray)
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
                    click:function (clickNum,showlineNum) {
                        alert(clickNum+":"+showlineNum)
                    }
                });
            // 创建表格
    var tableBox=new TableCM({
            title:[addAudit,batchSubmit,batchDelet,batchIput],
            head:[creatDom("input",{type:"checkbox",name:"test"}),"稽核单流水号","地区","区县","报账点名称","建单时间","电量","单价","金额","状态","操作"],
            cellWidth:["5%","20%","8%","8%","9%","8%","8%","8%","8%","8%","10%"],
            valueKey:["value1","value2","value3","value4","value5","value6","value7","value8","value9","value10","value11"],
            footer:[pagingBox]
        });
        //请求数据
        $.ajax({
            url:"testJson/tableData.json",
            type:"get",
            dataType:"json",
            success:function (data) {
                var valueKeyAry=tableBox.valueKey.slice(1,-1);
                data.forEach(function (obj) {
                    valueKeyAry.forEach(function (key) {
                            obj[key]='<div class="ellipsis">'+obj[key]+'</div>'
                    });
                    obj.value1=creatDom("input",{type:"checkbox",name:"test",id:obj.value1});
                    obj.value11=creatDom("div",{class:"operation-box"});
                    obj.value11.appendChild(createOperation("view",obj.value2));
                    obj.value11.appendChild(createOperation("revoke",obj.value2))
                });
                paging.init(25);
                tableBox.full(data);

            }
        });
        var child_1=creatDom("div",{style:"height:100%;width:100%"}),
            child_2=creatDom("div",{style:"height:100%;width:100%;display:none;"});
    //新增稽核单事件绑定
    addAudit.addEventListener("click",function (e) {
        e.stopPropagation();
        routBox.innerHTML=routBox.innerHTML.replace('class="nowRout"',"")+'><span class="nowRout">新增稽核单</span>';
        initAddAuditSheet.call(child_2,child_1,routBox);
    });
    batchSubmit.addEventListener("click",function (e) {
        e.stopPropagation();
        alert(this.textContent)
    });
        child_1.appendChild(serchebox);
        child_1.appendChild(tableBox.tableBox);

        contentBox.appendChild(child_1);
        contentBox.appendChild(child_2);
    tableBox.initHight();//重置table的高度
    // $(".selectpicker").selectpicker();

}
/*初始化填充电费稽核*/
function initAuditTariff(contentBox,routBox) {
	alert("aaaa");
    var
        select1=creatSelectCM("请选择稽核单状态","",["等待提交稽核","等待提交审批","审批中","审批通过","被驳回"]),
        serchebox=SearchBox([//-----------------------------------------------------------------------搜索盒子创建实例化
            {key:"selectValue",dom:select1},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"稽核单流水号"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",readOnly:"",class:"form_datetime form-control",placeholder:"建单时间"})}
        ]);
    serchebox.Search(function (valueArray) {//---------------------------------------------------搜索点击事件绑定
        console.log(valueArray)
    });
    //创建页脚分页
    var pagingBox=creatDom("div",{style:"min-height:30px"}),
        paging=new PagingNew({
            footerBox:pagingBox,
            maxShowPage:10,
            setShowLine:[10,15,20,25,30],
            click:function (clickNum,showlineNum) {
                alert(clickNum+":"+showlineNum)
            }
        });
    // 创建表格
    var tableBox=new TableCM({
        head:[creatDom("input",{type:"checkbox",name:"test"}),"稽核单流水号","地区","区县","稽核单状态","报账点名称","建单时间","电量","金额","同比上个月涨幅","电费金额（不含税）","税金金额","其他费用","操作"],
        cellWidth:["5%","10%","8%","8%","7%","8%","8%","8%","8%","10%","20%"],
        valueKey:["value1","value2","value3","value4","value5","value6","value7","value8","value9","value10","value11"],
        footer:[pagingBox]
    });
    //请求数据
    $.ajax({
        url:"testJson/getAuditTariff.json",
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
                obj.value11.appendChild(createOperation("view",id));
                obj.value11.appendChild(createOperation("modify",id,function (id) {
                    modifyAuditTariff.call(this,id)
                }));
                obj.value11.appendChild(createOperation("submit",id));
                obj.value11.appendChild(createOperation("revoke",id));
            });
            paging.init(25);
            tableBox.full(data);
        }
    });
    $(contentBox).append(serchebox);//添加搜索盒子到容器内部
    $(contentBox).append(tableBox.tableBox);
    tableBox.initHight();//重置table的高度
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii'});//初始化时间选择器
}
/*修改稽核单*/
function modifyAuditTariff(id) {
    var
        cancelBtn=creatDom("button",{class:"btn btn-primary btn-blue1" ,style:"background:#999;margin-right:10px;border-color:#999;color:#fff;"},null,"取消"),
        sureBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"保存");

    //创建表格框架
    var tableBox=new TableCM({
        default:true,
        cellWidth:["33%","33%","33%"],
        valueKey:["column1","column2","column3"]
    });
    //创建填充数据
    var fullData=[
        {
            column1:createInputUnit("稽核单流水号:",['<input type="text" readonly value="'+id+'">']),
            column2:createInputUnit("地区:",['<input type="text">']),
            column3:createInputUnit("区县:",['<input type="text">'])
        },
        {
            column1:createInputUnit("稽核单状态:",['<input type="text">']),
            column2:createInputUnit("报账点名称:",['<input type="text">']),
            column3:createInputUnit("建单时间:",['<input type="text">'])
        },
        {
            column1:createInputUnit("电量:",['<input type="text">']),
            column2:createInputUnit("金额:",['<input type="text">']),
            column3:createInputUnit("同比上月涨幅:",['<input type="text">'])
        },
    ];
    tableBox.full(fullData);//填充框架

    //填充弹框
    addMetaerDialog.fullTitle('<div class="text-center" style="font-size: 18px;font-weight: bold">修改稽核单</div>');
    addMetaerDialog.fullContent(tableBox.tableBox);
    addMetaerDialog.fullFooter([cancelBtn,sureBtn]);
    addMetaerDialog.show();//显示弹框
    tableBox.initHight()//重置高度
    //按钮事件绑定
    cancelBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        addMetaerDialog.hide();
    });
    sureBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        alert("保存成功");
        addMetaerDialog.hide();
    }.bind(this))
}
/*初始化填充提交财务*/
function initInputFinance(contentBox,routBox) {

    var child_1=creatDom("div",{style:"height:100%;width:100%"}),
        child_2=creatDom("div",{style:"height:100%;width:100%;display:none;"});

    var
        serchebox=SearchBox([//-----------------------------------------------------------------------搜索盒子创建实例化
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"稽核单流水号"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",class:"form-control",placeholder:"报账点名称"})}
        ]);
    serchebox.Search(function (valueArray) {//---------------------------------------------------搜索点击事件绑定
        alert(valueArray)
    });



    //--------------------------------------------------

    //创建页脚分页
    var pagingBox=creatDom("div",{style:"min-height:30px"}),
        paging=new PagingNew({
            footerBox:pagingBox,
            maxShowPage:10,
            setShowLine:[10,15,20,25,30],
            click:function (clickNum,showlineNum) {
                alert(clickNum+":"+showlineNum)
            }
        });
    //（创建头部按钮）
    var addAudit=creatDom("button",{class:"btn btn-blue"},null,"生成电费提交单");
    addAudit.addEventListener("click",function (e) {
        e.stopPropagation();
        routBox.innerHTML=routBox.innerHTML.replace('class="nowRout"',"")+'><span class="nowRout">新增稽核单</span>';
        generateTariffAuditSheet.call(child_2,child_1,routBox)
    });
    // 创建表格
    var tableBox=new TableCM({
        title:[addAudit],
        head:[creatDom("input",{type:"checkbox",name:"test"}),"稽核单流水号","地市","区县","报账点名称","建单时间","电量","单价","金额","状态","操作"],
        cellWidth:["10%","10%","10%","10%","10%","10%","8%","8%","8%","8%","8%"],
        valueKey:["value1","value2","value3","value4","value5","value6","value7","value8","value9","value10","value11"],
        footer:[pagingBox]
    });
    //请求数据
    $.ajax({
        url:"testJson/getAuditTariff.json",
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
                    alert(id)
                }));
            });
            paging.init(25);
            tableBox.full(data);
        }
    });
    child_1.appendChild(serchebox);//添加搜索盒子到容器内部
    child_1.appendChild(tableBox.tableBox);
    $(contentBox).append(child_1);
    $(contentBox).append(child_2);
    tableBox.initHight();//重置table的高度
}
/*初始化生成电费提交单*/
function generateTariffAuditSheet(previousBox,routerBox) {
    console.log(this);
    onlyShow(this);//只显示自己
    this.innerHTML="";

    var
        select1=creatSelectCM("请选择稽核单状态","",["全部","已处理","未处理"]),
        select2=creatSelectCM("录入人员状态","",["全部","再批","再次提交"]),
        serchebox=SearchBox([//-----------------------------------------------------------------------搜索盒子创建实例化
            {key:"selectValue",dom:select1},
            {key:"selectValue",dom:select2},
            {key:"value",dom:creatDom("input",{size:16,type:"text",readOnly:"",class:"form_datetime form-control",placeholder:"起始时间"})},
            {key:"value",dom:creatDom("input",{size:16,type:"text",readOnly:"",class:"form_datetime form-control",placeholder:"结束时间"})}
        ]);
    serchebox.Search(function (valueArray) {//---------------------------------------------------搜索点击事件绑定
        console.log(valueArray)
    });
    //（创建头部按钮）
    var addAudit=creatDom("button",{class:"btn btn-blue"},null,"批量推送财务"),
        batchSubmit=creatDom("button",{class:"btn btn-blue"},null,"批量推送经办人");
    addAudit.addEventListener("click",function (e) {
        alert("批量推送财务成功");
        MENU.getItem("inputFinance").click();
    });
    //创建页脚分页
    var pagingBox=creatDom("div",{style:"min-height:30px"}),
        paging=new PagingNew({
            footerBox:pagingBox,
            maxShowPage:10,
            setShowLine:[10,15,20,25,30],
            click:function (clickNum,showlineNum) {
                alert(clickNum+":"+showlineNum)
            }
        });
    // 创建表格
    var tableBox=new TableCM({
        title:[addAudit,batchSubmit],
        head:[creatDom("input",{type:"checkbox",name:"test"}),"电费提交单号","制单时间","地市","区县","推送类型","报销状态","价款金额","税金金额","操作"],
        cellWidth:["5%","14%","8%","8%","8%","8%","8%","8%","8%","25%","25%"],
        valueKey:["value1","value2","value3","value4","value5","value6","value7","value8","value9","value11"],
        footer:[pagingBox]
    });
    //请求数据
    $.ajax({
        url:"testJson/getAuditTariff.json",
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
                obj.value11.appendChild(createOperation("view",id));
                obj.value11.appendChild(createOperation("push-finance",id,function (id) {
                    alert(this.textContent+"成功，单号："+id);
                    MENU.getItem("inputFinance").click();
                }));
                obj.value11.appendChild(createOperation("push-expense",id,function (id) {
                    alert(this.textContent+"成功，单号："+id);
                    MENU.getItem("inputFinance").click();
                }));
            });
            paging.init(25);
            tableBox.full(data);
        }
    });
    $(this).append(serchebox);//添加搜索盒子到容器内部
    $(this).append(tableBox.tableBox);
    tableBox.initHight();//重置table的高度
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii'});//初始化时间选择器
}