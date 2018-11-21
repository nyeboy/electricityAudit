/**
 * Created by issuser on 2017/3/3.
 */
/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||（公用部分）|||||||||||||||||||||||||||||||||||||||||||||||||*/
function getID(id) {return document.getElementById(id)}
function c_log(text,flog) {return console.log(text,flog)}

function testTime(fun) {
    var before=new Date().getTime();
    fun();
    c_log(new Date().getTime()-before,"testTime---------------")
}

function setCss(dom,cssStr) {
        if(cssStr&&typeof cssStr=="string"){
            cssStr.split(";").filter(function(e){return e!=""}).forEach(function(attr,index){
                var attrKey=attr.split(":")[0];
                if(/-/.test(attrKey)){
                    var str="";
                    attrKey.split("-").forEach(function(s,i){
                        if(i!=0){
                            s= s.substr(0,1).toUpperCase()+ s.substr(1);
                        }
                        str+=s
                    });
                    attrKey=str
                }
                dom.style[attrKey]=attr.split(":")[1]
            });
        }
}
/*
 检测object是否含有某组属性，例如：
 var obj={name:"test",age:10};
 var one=hasKey(obj,["name","age"]),two=hasKey(obj,["name","age","ather"]);
 one//true;
 two//false
 */
function hasKey(obj,keyArray){
    if(obj instanceof Object&&keyArray instanceof Array){
        var ble=false;
        for(var i= 0,n=keyArray.length;i<n;i++){
            if(obj.hasOwnProperty(keyArray[i])){
                ble=true;
            }else {
                ble=false;
                break
            }
        }
        return ble
    }
};
/*
 创建Dom
 */
function creatDom(type,setobj,hiddeAttrObj,innerContent){
    var dom=document.createElement(type);
    setobj&&[].forEach.call(Object.keys(setobj),function(n){
        dom.setAttribute(n,setobj[n])
    });
    hiddeAttrObj&&[].forEach.call(Object.keys(hiddeAttrObj),function(n){
        dom[n]=hiddeAttrObj[n]
    });
    innerContent&&(innerContent.nodeType===1||innerContent.nodeType===11?dom.appendChild(innerContent):(dom.innerHTML=innerContent));
    //dom.style.webkitTransform="translateZ(0)";
    return dom
}
function onlyShow() {
    var flog=true,childenAry=arguments[0].parentNode.children;
    for(var i=0,n=arguments.length-1;i<n;i++){
        if(arguments[i].parentNode!=arguments[i+1].parentNode){flog=false;break}
    }
    if(flog){
        for(var p=0,pn=childenAry.length;p<pn;p++){
            childenAry[p].style.display="none"
        }
        for(var a=0,an=arguments.length;a<an;a++){
            arguments[a].style.display=arguments[a].getAttribute("data-beforeShow")||"block"
        }
    }else c_log("元素不在同一容器内！")
}
/*创建select*/
function creatSelectCM(startValue,style,optionAry,isGoUp) {
    var ul=creatDom("ul",{style:"display:none"}),
        div=creatDom("div",null,{_value:startValue,isOpen:false},startValue),
        selectBOX=creatDom("div",{class:"my-select",style:style},{selectValue:startValue},div);
    selectBOX.appendChild(ul);
    if(isGoUp===true){
        ul.className="select-top";
        div.className="div-top";
    }
    selectBOX.initOption=function (optionAry) {
        ul.innerHTML="";
        for(var i=0,n=optionAry.length;i<n;i++){
            ul.appendChild(creatDom("li",null,{_value:optionAry[i]},optionAry[i]))
        }
    };
    selectBOX.initOption(optionAry);
    div.addEventListener("click",function (e) {
        e.stopPropagation();
        if(this.isOpen){
            ul.style.display="none";
            this.className=this.className.replace(" open","")
        }else {
            ul.style.display="block";
            this.className+=" open"
        }
        this.isOpen=!this.isOpen
    });
    var chageFun=null;
    ul.addEventListener("click",function (e) {
        e.stopPropagation();
        var target=e.target;
        if(target._value){
            div.className=div.className.replace(" open","");
            selectBOX.selectValue=target._value;
            div.textContent=target._value;
            this.style.display="none";
            div.isOpen=!div.isOpen;
            chageFun&&chageFun.call(selectBOX)
        }
    });
    selectBOX.onchage=function (fun) {
        fun&&(chageFun=fun)
    };

    return selectBOX
}
/*选择其余的DOm兄弟元素*/
function restElement(dom,callBack) {
    var left=dom,right=dom;
    while (left.previousElementSibling){
        left=left.previousElementSibling;
        callBack&&callBack(left)
    }
    while (right.nextElementSibling){
        right=right.nextElementSibling;
        callBack&&callBack(right)
    }
    left=null;right=null;
}
function PagingNew(setObj) {
    if(hasKey(setObj,["footerBox"])){
        setObj.footerBox.className="page_footer pd_10 text_c";

        var fra=document.createDocumentFragment(),

            clickNum=0,allPageNum=0,pageBtnAry=[],showLineNum=null,

            btnValue=setObj.btnValue?setObj.btnValue.split("&"):[],

            btnArray=[
                creatDom("a",{style:"display:none"},{flag:"start"},btnValue[0]||"首页"),
                creatDom("a",{style:"display:none"},{flag:"previous"},btnValue[1]||"上一页"),
                creatDom("div",{style:"display:inline;"}),
                creatDom("a",{style:"display:none"},{flag:"next"},btnValue[2]||"下一页"),
                creatDom("a",{style:"display:none"},{flag:"end"},btnValue[3]||"末页"),
                creatDom("a",{style:"display:none"},{flag:null}),
            ],
            clickFun=function (clickPage) {
                pageBtnAry[clickPage].parentNode.style.display="inline-block";
                restElement(pageBtnAry[clickPage].parentNode,function (dom) {
                    dom.style.display="none"
                });
                pageBtnAry.forEach(function (btnDom) {
                    btnDom.removeAttribute("class")
                });
                pageBtnAry[clickPage].className="click";
                setObj.click&&setObj.click(clickPage,showLineNum||"")
            };

        btnArray.forEach(function (btnDom) {
            fra.appendChild(btnDom)
        });
        setObj.footerBox.appendChild(fra);

        //设置显示航
        if(setObj.setShowLine&&setObj.setShowLine instanceof Array){
            showLineNum=setObj.setShowLine[0];
            var setLine=creatDom("a",{style:"padding:0 0 0 5px",class:"set-line"},{flag:null},'显示行'),
                paging_select=creatSelectCM(showLineNum,"width:50px;display:inline-block;text-align:center;height:27px;vertical-align: middle;margin:0 0 0 5px;",setObj.setShowLine,true);
            setLine.appendChild(paging_select);
            setObj.footerBox.insertBefore(setLine,btnArray[0]);
            paging_select.onchage(function () {
                showLineNum=this.selectValue
            })
        }

        this.initFun=function (fun) {
            clickFun=function (clickPage) {
                pageBtnAry.forEach(function (btnDom) {
                    btnDom.removeAttribute("class")
                });
                pageBtnAry[clickPage].className="click";
                fun&&fun(clickPage,showLineNum||"")
            };
        };
        this.init=function (pageNum) {
            btnArray.forEach(function (btnDom,index) {
                if(index!=2){
                    btnDom.style.display=pageNum>1?"inline-block":"none";
                    index==5&&(btnDom.textContent="共"+pageNum+"页")
                }
            });
            btnArray[2].innerHTML="";
            pageBtnAry.length=0;
            clickNum=0;
            allPageNum=pageNum;
            for(var lineLen=0,max=setObj.maxShowPage,n=Math.ceil(allPageNum/max);lineLen<n;lineLen++){
                var pageChunkBox=creatDom("div",{style:"display:"+(lineLen==0?"inline-block;":"none")});
                for(var i=0;i<max;i++){
                    var indexI=lineLen*max+i;
                    if(indexI>=allPageNum){break};
                    var a=creatDom("a",i==0&&lineLen==0?{class:"click"}:null,{flag:indexI},indexI+1);
                    pageChunkBox.appendChild(a);
                    pageBtnAry.push(a)
                }
                btnArray[2].appendChild(pageChunkBox)
            }

        };
        setObj.footerBox.addEventListener("click",function (e) {
            e.stopPropagation();
            switch (e.target.flag){
                case "start":clickNum=0;break;
                case "previous":clickNum!=0?clickNum--:clickNum=0;break;
                case "next":clickNum!=(allPageNum-1)?clickNum++:clickNum=(allPageNum-1);break;
                case "end":clickNum=allPageNum-1;break;
                default:(typeof e.target.flag=="number")&&(clickNum=e.target.flag);
            }
            (typeof e.target.flag=="number"||typeof e.target.flag=="string")&&clickFun(clickNum)
        })
    }else {c_log("分页配置错误！")}
}
/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||（公用部分_END）||||||||||||||||||||||||||||||||||||||||||||||*/
/*创建搜索组件盒子*/
function SearchBox(domArray) {
    var box=creatDom("div"),
        btn=creatDom("button",{class:"btn btn-primary",type:"button"},null,"搜索"),
        searchBox=creatDom("div",{class:"searchBox"},null,box),
        FUN=null;

    searchBox.appendChild(btn);
    for(var i=0;i<domArray.length;i++){
        $(box).append(domArray[i].dom);
        domArray[i].dom.style.width=(100-domArray.length*0.5)/domArray.length+"%";
        domArray[i].dom.style.marginRight="0.5%";
        domArray[i].dom.style.display="inline-block";
        domArray[i].dom.style.verticalAlign="middle"
    }
    btn.addEventListener("click",function (e) {
        e.stopPropagation();
        var value=[];
        for(var i=0;i<domArray.length;i++){
            value.push(domArray[i].dom[domArray[i].key]);
        }

        FUN&&FUN.call(this,value)
    });
    searchBox.Search=function (fun) {
        fun&&(FUN=fun)
    };
    return searchBox
};
/*创建多级表格*/
function TableCM(initObj) {
    var cellWidth=initObj.cellWidth||null;
    var tableOne=createTable({
            head:initObj.head,
            cellWidth:cellWidth,
        }),
        tableTwo=createTable({
            default:initObj.default,
            cellWidth:cellWidth,
            body:initObj.body||[],
            valueKey:initObj.valueKey||[]
        }),
        contentBox=creatDom("div",{class:"CM-table-body"},null,creatDom("div",null,null,tableTwo)),
        BOX=creatDom("div",{class:"CM-table"});

    //组件表格
    if(initObj.title&&initObj.title instanceof Array){
        var title=creatDom("div",{class:"CM-table-title"});
        for(var i=0,n=initObj.title.length;i<n;i++){
            $(title).append(initObj.title[i])
        }
        BOX.appendChild(title)
    }
    initObj.head&&BOX.appendChild(tableOne);
    BOX.appendChild(contentBox);
    if(initObj.footer&&initObj.footer instanceof Array){
        var footer=creatDom("div",{class:"CM-table-footer text-right"});
        for(var f=0,fn=initObj.footer.length;f<fn;f++){
            $(footer).append(initObj.footer[f])
        }
        BOX.appendChild(footer)
    }
    var initH=function (dom) {
        var mt=0,mb=0,domT=dom,domB=dom;
        while (domT.previousElementSibling){
            domT=domT.previousElementSibling;
            mt+=domT.offsetHeight
        }
        while (domB.nextElementSibling){
            domB=domB.nextElementSibling;
            mb+=domB.offsetHeight;
        }
        dom.style.marginTop=-mt+"px";
        dom.style.paddingTop=mt+"px";
        dom.style.marginBottom=-mb+"px";
        dom.style.paddingBottom=mb+"px";
        mt=null;mb=null;domB=null;domT=null
    };
    // 实例方法绑定
    this.full=function (JSONdataAry) {
        tableTwo.full(JSONdataAry,initObj.valueKey)
    };
    this.initHight=function () {
        initH(BOX);
        initH(contentBox)
    };
    this.tableBox=BOX;
    this.valueKey=initObj.valueKey
}
/*创建单级表格*/
function createTable(initObj) {
    var
        tbody=creatDom("tbody"),
        table=creatDom("table",{style:"table-layout:fixed",class:"table"+(initObj.default===true?"":" table-striped table-hover")}),
        cellWidth=initObj.cellWidth;

    table.full=function (JSONaryData,valueKeyAry) {
        if(JSONaryData&&JSONaryData instanceof Array&&(valueKeyAry.length>0)){
            tbody.innerHTML="";
            for(var r=0,n=JSONaryData.length;r<n;r++){
                var tr=creatDom("tr");
                for(var c=0;c<valueKeyAry.length;c++){
                    tr.appendChild(creatDom("td",cellWidth&&(r==0)?{style:"width:"+cellWidth[c]}:null,null,JSONaryData[r][valueKeyAry[c]]))
                }
                tbody.appendChild(tr);
            }
            table.appendChild(tbody)
        }
    };
    if(initObj.head&&initObj.head instanceof Array){
        var tr=creatDom("tr");
        for(var i=0;i<initObj.head.length;i++){
            tr.appendChild(creatDom("th",cellWidth?{style:"width:"+cellWidth[i]}:null,null,initObj.head[i]))
        }
        table.appendChild(creatDom("thead",null,null,tr));
        table.className+=" CM-table-head"
    }
    (initObj.body&&initObj.body.length>0)&&table.full(initObj.body,initObj.valueKey);
    return table
}
/*创建dialog弹窗*/
function DialogCM(initObj) {
    var mask=creatDom("div",{class:"dialogCM-mask"},{isShow:false},
            '<div class="dialogCM-body">' +
            (initObj.header?
                ('<div class="dialogCM-header bd-b">' +
                '<div class="dialogCM-title"></div>'+
                '<button class="dialogCM-close">×</button>'+
                '</div>'):"")+
            '<div class="dialogCM-content bd-b"></div>'+
            (initObj.footer?
                ( '<div class="dialogCM-footer text-center"></div>'):"")+
            '</div>'
        ),
        _body=mask.querySelector(".dialogCM-body"),
        _title=mask.querySelector(".dialogCM-title"),
        _close=mask.querySelector(".dialogCM-close"),
        _header=mask.querySelector(".dialogCM-header"),
        _content=mask.querySelector(".dialogCM-content"),
        _footer=mask.querySelector(".dialogCM-footer");
    document.body.appendChild(mask);
    initObj.bodyCssString&&setCss(_body,initObj.bodyCssString);

    mask.addEventListener("click",function (e) {
        e.stopPropagation();
        this.hide()
    }.bind(this));
    _close&&_close.addEventListener("click",function (e) {
        e.stopPropagation();
        this.hide()
    }.bind(this));
    _body.addEventListener("click",function (e) {
        e.stopPropagation();
    });
    this.initBodyCss=function (cssString) {
        setCss(_body,cssString);
    };
    this.show=function () {
        mask.style.display="block";
        setTimeout(function () {
            if(_content.offsetHeight>500){
                _content.style.height="500px"
            }
            _body.style.marginTop=-_body.offsetHeight/2+"px";
            _body.style.transform="translateY(0)";
            mask.style.opacity="1";
        },0)
    };
    this.hide=function () {
        _body.style.transform="translateY(-50px)";
        mask.style.opacity="0";
        setTimeout(function () {
            mask.style.display="none";
            setCss(_body,initObj.bodyCssString);
            // _body.setAttribute("style",initObj.bodyCssString);
            _content.style.height="inherit"
        },200)
    };
    this.fullContent=function (content) {
        _content.innerHTML="";
        $(_content).append(content)
    };
    this.delete=function () {
        document.body.removeChild(mask)
    };
    initObj.header&&(this.fullTitle=function (title) {
        _title.innerHTML="";
        $(_title).append(title)
    });
    initObj.footer&&(this.fullFooter=function (footerAry) {
        _footer.innerHTML="";
        footerAry.forEach(function (dom) {
            $(_footer).append(dom)
        });
    })
}
/*创建菜单*/
function Menu(menuBox) {
    var _menuAry=[],menuBtnObj={},itemHeigh=null,
        _renderMenu=function (jsonAry,domBox,Hierarchy) {//渲染菜单函数体
            Hierarchy=Hierarchy||0;
            Hierarchy++;
        if(domBox.nodeName!="UL"){
            var ul=creatDom("ul",{unselectable:"on"});
            domBox.appendChild(ul);
            domBox=ul
        }
        var fra=document.createDocumentFragment();
            for(var i=0,n=jsonAry.length;i<n;i++){

                var div=creatDom("div",{style:"padding-left:"+Hierarchy*20+"px;"},
                    {menuId:jsonAry[i].id,isOpen:false},
                    jsonAry[i].icon?('<img src="'+jsonAry[i].icon+'">'+jsonAry[i].value):jsonAry[i].value
                    ),
                    li=creatDom("li",null,null,div);
                if(jsonAry[i].child&&(jsonAry[i].child instanceof Array&&jsonAry[i].child.length>0)){
                    div.style.backgroundImage='url("img/arrowShow.png")';
                    var ul2=creatDom("ul",{style:"height:0;overflow:hidden;"+jsonAry[i].childBoxStyle||""});
                    li.appendChild(ul2);
                    _renderMenu(jsonAry[i].child,ul2,Hierarchy);//递归调用自身
                }
                fra.appendChild(li);
                if(menuBtnObj.hasOwnProperty(jsonAry[i].id)){
                    console.log(jsonAry[i].value+"ID:"+jsonAry[i].id+" 重复!");
                    return false
                }
                menuBtnObj[jsonAry[i].id]=div;
                (function (i) {
                    div.addEventListener("click",function (e) {//div绑定事件
                        e.stopPropagation();

                        if(jsonAry[i].clickFun){
                            onlyShow(getID("businessBox"));
                            var self=this,c=['<span class="nowRout">'+this.textContent+'</span>'];
                            while (self.parentNode.parentNode.previousElementSibling){
                                self=self.parentNode.parentNode.previousElementSibling;
                                c.splice(0,0,'<span>'+self.textContent+'</span>');
                            }
                            getID("contentRout").innerHTML=c.join(">");
                            getID("contentBox").innerHTML="";
                            jsonAry[i].clickFun.call(this,getID("contentBox"),getID("contentRout"));
                        }
                        if(this.nextElementSibling){
                            var next=this.nextElementSibling,nextHeight=0;
                            for(var c=0,cn=next.children.length;c<cn;c++){
                                nextHeight+=next.children[c].offsetHeight
                            }
                            if(this.isOpen){
                                this.style.backgroundImage='url("img/arrowShow.png")';
                                next.style.height=nextHeight+"px";
                                setTimeout(function () {
                                    next.style.height="0";
                                },10)
                            }else {
                                this.style.backgroundImage='url("img/arrow.png")';
                                next.style.height=nextHeight+"px";
                                setTimeout(function () {
                                    next.style.height="auto";
                                },200)
                            }
                        }
                        this.isOpen=!this.isOpen;
                    })
                })(i);
            }
            domBox.appendChild(fra)
    };
    var conCatMenuObj=function (mainMenuAry,JSONary) {//递归合并菜单对象函数体，
        for(var i=0,n=JSONary.length;i<n;i++){
            var flog=true;
            for(var p=0,pn=mainMenuAry.length;p<pn;p++){
                if(mainMenuAry[p].id==JSONary[i].id){
                    JSONary[i].icon&&(mainMenuAry[p].icon=JSONary[i].icon);
                    JSONary[i].childBoxStyle&&(mainMenuAry[p].childBoxStyle=JSONary[i].childBoxStyle);
                    JSONary[i].clickFun&&(mainMenuAry[p].clickFun=JSONary[i].clickFun);
                    mainMenuAry[p].child=mainMenuAry[p].child||[];
                    JSONary[i].child&&conCatMenuObj(mainMenuAry[p].child,JSONary[i].child);
                    flog=false;
                    break
                }
            }
            if(flog){
                mainMenuAry.push(JSONary[i])
            }
        }
        return mainMenuAry
    };
    //添加菜单
    this.addItem=function (JSONmenuData) {
        _menuAry=conCatMenuObj(_menuAry,JSONmenuData);
    };
    //删除菜单（功能未完善，请勿调用2017.3.6）
    this.removeItem=function (menueID) {
        for(var i=0,n=_menuAry.length;i<n;i++){
            if(_menuAry[i].id===menueID){
                _menuAry.splice(i,1);break
            }
        }
        menuBtnObj[menueID].parentNode.parentNode.removeChild(menuBtnObj[menueID].parentNode);
        delete menuBtnObj[menueID]
    };
    //获取菜单对象
    this.getItem=function (menueID) {
        return menuBtnObj[menueID]
    };
    //渲染菜单
    this.render=function () {
        _renderMenu(_menuAry,menuBox);
        itemHeigh=menuBox.getElementsByTagName("div")[0].offsetHeight
    }
}
//实例化菜单
var MENU=new Menu(getID("menuBox"));
//配置菜单
MENU.addItem([
    //第一级菜单
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
                                id:"inputTariff"
                            },
                            {
                                value:"电费稽核",
                                id:"auditTariff"
                            },
                            {
                                value:"提交财务",
                                id:"inputFinance"
                            }
                        ]
                    },
                    {
                        value:"预付提交",
                        id:"submitAdvance"
                    },
                    {
                        value:"电费计提",
                        id:"getTariff"
                    },
                    {
                        value:"电费转售",
                        id:"resaleTariff"
                    },
                    {
                        value:"电费回收",
                        id:"recoveryTariff"
                    }
                ]
            },
            {
                value:"油机发电",
                id:"OilGenerator"
            },
            {
                value:"历史数据",
                id:"dataHistory"
            },
            {
                value:"工单处理",
                id:"WorkOrderProcessing"
            }
        ]
    },
    {
        value:"基础数据",
        id:"BasicData",
        icon:"img/data_icon.png",
        childBoxStyle:"background-color:#1c2226",
        child:[
            {
                value:"基础数据呈现",
                id:"displayData"
            },
            {
                value:"基础数据维护",
                id:"maintainData"
            },
            {
                value:"标杆管理",
                id:"benchmarking"
            },
            {
                value:"数据导入",
                id:"inputData"
            }
        ]
    },
    {
        value:"数据报表",
        id:"dataCarts",
        icon:"img/table_icon.png",
        childBoxStyle:"background-color:#1c2226",
        child:[
            {
                value:"数据报表",
                id:"dataCart_1"
            }
        ]
    },
    {
        value:"系统管理",
        id:"systemManagement",
        icon:"img/table_icon.png",
        childBoxStyle:"background-color:#1c2226",
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
            }
        ]
    }
]);
//渲染菜单
window.onload=function () {
    MENU.render();
};
//绑定主页跳转
getID("logoBox").addEventListener("click",function (e) {
   onlyShow(getID("indexBox"))
});
getID("goIndex").addEventListener("click",function (e) {
    onlyShow(getID("indexBox"))
});