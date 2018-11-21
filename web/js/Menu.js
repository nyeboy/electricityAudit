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
// 设置样式css
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
    selectBOX.optionBox=ul;
    selectBOX.initOption=function (optionAry) {
        div.textContent=optionAry[0];
        div._value=optionAry[0];
        ul.innerHTML="";
        for(var i=0,n=optionAry.length;i<n;i++){
            ul.appendChild(creatDom("li",null,{_value:optionAry[i],index:i},optionAry[i]))
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
            selectBOX.index=target.index;
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

            btnValue=(setObj.btnValue?setObj.btnValue.split("&"):[]),

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
        var _self=this;
        if(setObj.setShowLine&&setObj.setShowLineChange&&setObj.setShowLine instanceof Array){
            showLineNum=setObj.setShowLine[0];
            var setLine=creatDom("a",{style:"padding:0 0 0 5px",class:"set-line"},{flag:null},'显示行'),
                paging_select=creatSelectCM(showLineNum,"width:50px;display:inline-block;text-align:center;height:27px;vertical-align: middle;margin:0 0 0 5px;",setObj.setShowLine,true);
            setLine.appendChild(paging_select);
            setObj.footerBox.insertBefore(setLine,btnArray[0]);
            paging_select.onchage(function () {
                showLineNum=this.selectValue;
                setObj.setShowLineChange(showLineNum)
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
/*
 ajax请求设置：
 var obj={
 "url":,//请求地址
 "method":,//请求方式get/post
 "success":,//function(data){}请求成功的回调函数，params:data:成功的数据
 "fail":,//function(err)请求失败的回调函数
 "proxy":,//布尔值：true为使用代理
 "data":,//需要POST的数据
 "contentType":,//获取数据的mime类型
 }
 request_(obj)//输出页码对象集合
 */
function request_(obj){
    if(hasKey(obj,["url","method","success","fail"])){
        var xhr=new XMLHttpRequest(),url=null;
        if(obj.timeout){
            xhr.timeout=obj.timeout;
            xhr.ontimeout=function(){
                xhr.abort();
                obj.fail("请求超时")
            };
        }
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4){// 4 = "loaded"
                if (xhr.status==200){// 200 = OK
                    var data=xhr.responseText,
                        headerArray=xhr.getAllResponseHeaders().trim().split("\r\n"),
                        headerObj={};
                    headerArray.forEach(function (option) {
                        var optionArray=option.split(":");
                        headerObj[optionArray[0]]=optionArray[1];
                        optionArray=null
                    });
                    obj.success(data,headerObj)
                }else{
                    obj.fail(xhr.status);
                }
            }
        };
        xhr.open(obj.method,obj.proxy===true?location.href:obj.url,true);
        // xhr.setRequestHeader("Content-Type",obj.contentType||"application/x-www-form-urlencoded");
        if(obj.proxy&&obj.proxy===true){//如果是代理请求，直接前端处理代理的options以header发送到服务器
            xhr.setRequestHeader("RequestType","proxy");
            var urlFragment=obj.url.replace(/^https?:\/\//,"").split("/");
            var options={
                host:urlFragment[0].split(":")[0],
                port: urlFragment[0].split(":")[1]||80,
                path: "/"+urlFragment.slice(1).join("/"),
                method: obj.method,
                headers:{
                    "Content-Type": obj.contentType||"application/x-www-form-urlencoded"
                }
            };
            // c_log(options,"HEADER----------")
            var codeS=JSON.stringify(options);
            xhr.setRequestHeader("ProxyOptions",codeS);
        }else {
            xhr.setRequestHeader("RequestType","ajax");
        }
        if(/post|POST/.test(obj.method)){
            // c_log(obj.data.get("header"));
            xhr.send(obj.data?obj.contentType=="multipart/form-data"?obj.data:JSON.stringify(obj.data):null);
        }else {
            xhr.send(null)
        }
        return xhr
    }
}
/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||（公用部分_END）||||||||||||||||||||||||||||||||||||||||||||||*/
/*创建alert*/

var _CMalert=new DialogCM({bodyCssString:"width:300px;margin-left:-150px",footer:true,noMaskEvent:true});

function CMalert (value,fun,backLeve,hasCansle) {
    var saveBtn=creatDom("button",{class:"btn btn-primary btn-blue1"},null,"确定"),cansleBtn=null;
    if(hasCansle===true){
        cansleBtn=creatDom("button",{class:"btn btn-primary btn-blue1" ,style:"background:#999;margin-right:10px;border-color:#999;color:#fff;"},null,"取消");
        cansleBtn.addEventListener("click",function(e){
            e.stopPropagation();
            _CMalert.hide(backLeve)
        })
    }
    _CMalert.fullContent(creatDom("div",{style:"padding:20px;word-break:break-all;word-wrap:break-word;"},null,value));
    _CMalert.fullFooter([cansleBtn||"",saveBtn]);
    _CMalert.show();
    saveBtn.addEventListener("click",function (e) {
        e.stopPropagation();
        fun&&fun();
        _CMalert.hide(backLeve)
    })
}
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
            cellWidth:cellWidth
        }),
        tableTwo=createTable({
            default:initObj.default,
            cellWidth:cellWidth,
            body:initObj.body||[],
            valueKey:initObj.valueKey||[],
            border:initObj.border
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
    this.nextPush=function (nowRow,JSONary) {
        var index=nowRow.rowIndex+1;
        JSONary.forEach(function (obj) {
            var row=tableTwo.insertRow(index);
            initObj.valueKey.forEach(function (key,cellIndex) {
                $(row.insertCell(cellIndex)).append(obj[key])
            });
            index++
        });
        index=null
    };
    this.deleteRow=function (startIndex,num) {
        for(var i=0;i<num;i++){
            tableTwo.deleteRow(startIndex)
        }
    };
    this.tableContent=tableTwo;
    this.tableBox=BOX;
    this.valueKey=initObj.valueKey
}
/*创建单级表格*/
function createTable(initObj) {
    var
        tbody=creatDom("tbody"),
        table=creatDom("table",{style:"table-layout:fixed",class:"table"+
        (initObj.default===true?"":" table-striped table-hover")+
        (initObj.border===true?" CM-borderTable":"")
        }),
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
    //初始化弹窗实例栈
    DialogCM.shoDialogStack=DialogCM.shoDialogStack||[];
    
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
    initObj.maskCssString&&setCss(mask,initObj.maskCssString);
    initObj.contentString&&setCss(_content,initObj.contentString);

    !initObj.noMaskEvent&&mask.addEventListener("click",function (e) {
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
    this._show=function (PleaseDoNotCallThisMethod) {
        mask.style.display="block";
        setTimeout(function () {
            if(_content.offsetHeight>500){
                _content.style.height="500px"
            }else {
                _content.style.maxHeight="500px"
            }
            _body.style.marginTop=-_body.offsetHeight/2+"px";
            _body.style.transform="translateY(0)";
            mask.style.opacity="1";
        },0);
    };//禁止实例调用（此方法为内部专用）
    this.show=function () {
        this._show();
        if(DialogCM.shoDialogStack.length>0){
            DialogCM.shoDialogStack[DialogCM.shoDialogStack.length-1]._hide();
        }
        DialogCM.shoDialogStack.push(this);//将显示的实例放入弹窗栈

    };
    this._hide=function (PleaseDoNotCallThisMethod) {
        _body.style.transform="translateY(-50px)";
        mask.style.opacity="0";
        setTimeout(function () {
            mask.style.display="none";
            setCss(_body,initObj.bodyCssString);
            // _body.setAttribute("style",initObj.bodyCssString);
            // _content.style.height="inherit"
            setCss(_content,"max-height:inherit;height:inherit")
        },200);
    };//禁止实例调用（此方法为内部专用）
    this.hide=function (DescLevel) {
        DescLevel>0&&typeof DescLevel=="number"?(DescLevel=-DescLevel):(DescLevel=-1);//配置要回退的层级
        this._hide();
        DialogCM.shoDialogStack.splice(DescLevel);//移除栈
        if(DialogCM.shoDialogStack.length>0){
            DialogCM.shoDialogStack[DialogCM.shoDialogStack.length-1]._show();
        }
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
var userSetObj={
    AuthorityAry:[
        {
            id:"1",
            Authority:["province"],
            userLevel:0
        },
        {
            id:"237",
            Authority:["city"],
            userLevel:1
        },
        {
            id:222,
            Authority:["manager"],
            userLevel:2
        }
    ],
    judgeUser:function(userData){
        var one=null;
        for(var a= 0,an=this.AuthorityAry.length;a<an;a++){
            if(this.AuthorityAry[a].id==userData.userId){
                one=this.AuthorityAry[a];
                break
            }
        }
        return one
    }
};

/*创建菜单*/
function Menu(menuBox) {
    if(!menuBox){return false}
    var userData=null,nowUser=null;  //权限过滤
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

                var div=creatDom("div",{style:"padding-left:"+Hierarchy*20+"px; border-left:4px solid transparent"},
                    {menuId:jsonAry[i].id,isOpen:false},
                    jsonAry[i].icon?('<img src="'+jsonAry[i].icon+'">'+jsonAry[i].value):jsonAry[i].value
                    ),
                    li=creatDom("li",null,null,div);
                if(Hierarchy == 1) { div.style.cssText="font-weight:700;color:#666;font-size:16px;padding-left:20px;"};
                // 查看该菜单是否有子菜单 
                if(jsonAry[i].child&&(jsonAry[i].child instanceof Array&&jsonAry[i].child.length>0)){
                    Hierarchy!=1&&(div.style.backgroundImage='url("img/arrowShow.png")');
                    var ul2=creatDom("ul",{style:"height:"+(Hierarchy!=1?"0":"auto")+";overflow:hidden;"+jsonAry[i].childBoxStyle||""});
                    li.appendChild(ul2);
                    _renderMenu(jsonAry[i].child,ul2,Hierarchy);//递归调用自身
                }
                //权限过滤
                if(jsonAry[i].allowRole&&userData){
                    var flog=false;
                    jsonAry[i].allowRole.forEach(function(astr){
                        (nowUser.indexOf(astr)!==-1)&&(flog=true)
                    });
                    if(!flog){
                        continue
                    }
                }
                fra.appendChild(li);
                if(menuBtnObj.hasOwnProperty(jsonAry[i].id)){
                    console.log(jsonAry[i].value+"ID:"+jsonAry[i].id+" 重复!");
                    return false
                }
                menuBtnObj[jsonAry[i].id]=div;
                (function (i) {
                    Hierarchy!=1&&div.addEventListener("click",function (e) {//div绑定事件
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
                            $(this).parent().siblings().parents("ul").find("div").removeClass("menuClick").removeClass("currBg").css("border-left-color","transparent");
                            $(this).parent().parents("ul").find("div").removeClass("menuClick").removeClass("currBg").css("border-left-color","transparent");
                            $(this).addClass("menuClick").addClass("currBg").css("border-left-color","#1a62c4").parents("ul").prev("div").addClass("menuClick");
                        }
                        if(this.nextElementSibling){
                            var next=this.nextElementSibling,nextHeight=0;
                            for(var c=0,cn=next.children.length;c<cn;c++){
                                nextHeight+=next.children[c].offsetHeight
                            }   
                            if(this.isOpen){
                                $(this).css({"background-image":"url(img/arrowShow.png)"});
                                next.style.height=nextHeight+"px";
                                setTimeout(function () {
                                    next.style.height="0";
                                },10)
                            }else {
                                $(this).css({"background-image":"url(img/arrow_down.png)"});
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
                    JSONary[i].value&&(mainMenuAry[p].value=JSONary[i].value);
                    JSONary[i].icon&&(mainMenuAry[p].icon=JSONary[i].icon);
                    JSONary[i].allowRole&&(mainMenuAry[p].allowRole=JSONary[i].allowRole);
                    JSONary[i].childBoxStyle&&(mainMenuAry[p].childBoxStyle=JSONary[i].childBoxStyle);
                    JSONary[i].clickFun&&(mainMenuAry[p].clickFun=JSONary[i].clickFun);
                    mainMenuAry[p].child=mainMenuAry[p].child||[];
                    JSONary[i].child&&conCatMenuObj(mainMenuAry[p].child,JSONary[i].child);
                    flog=false;
                    break;
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
    //        menuBox.innerHTML="";
        userData=getUserData();
        nowUser=userSetObj.judgeUser(getUserData()).Authority;
        c_log(nowUser,"dsada");
        //判断角色权限

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
                        id:"submitAdvance",
                        clickFun:function(){underConstruction.creatPageHtml()}
                    },
                    {
                        value:"电费计提",
                        id:"getTariff",
                        clickFun:function(){underConstruction.creatPageHtml()}
                    },
                    {
                        value:"电费转售",
                        id:"resaleTariff",
                        clickFun:function(){underConstruction.creatPageHtml()}
                    },
                    {
                        value:"电费回收",
                        id:"recoveryTariff",
                        clickFun:function(){underConstruction.creatPageHtml()}
                    }
                ]
            },
            {
                value:"历史数据",
                id:"dataHistory",
                clickFun:function(){underConstruction.creatPageHtml()}
            },
            {
                value:"工单处理",
                id:"WorkOrderProcessing",
                clickFun:function(){underConstruction.creatPageHtml()}
            }
        ]
    },
    {
        value:"基础数据",
        id:"BasicData",
        icon:"img/data_icon.png",
        childBoxStyle:"background-color:#fff",
        child:[
            {
                value:"基础数据呈现",
                id:"displayData"
            },
            {
                value:"基础数据维护",
                id:"maintainData",
                allowRole:["province"]//province（省）/city（市）/manager（经办人）

            },
            {
                value:"标杆管理",
                id:"benchmarking",
                allowRole:["province"]//province（省）/city（市）/manager（经办人）
            },
            {
                value:"数据导入",
                id:"inputData",
                allowRole:["province"],//province（省）/city（市）/manager（经办人）
                clickFun:function(){underConstruction.creatPageHtml()}
            }
        ]
    },
    {
        value:"统计报表",
        id:"dataCarts",
        icon:"img/table_icon.png",
        childBoxStyle:"background-color:#fff",
        child:[
            {
                value:"统计报表",
                id:"dataCart_1",
            }
        ]
    },
    {
        value:"系统管理",
        id:"systemManagement",
        icon:"img/table_icon.png",
        childBoxStyle:"background-color:#fff",
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
            }
        ]
    }
]);
// 渲染菜单
// 绑定主页跳转
getID("logoBox")&&getID("logoBox").addEventListener("click",function (e) {
    console.log("aa");
   onlyShow(getID("indexBox"));
});
getID("goIndex")&&getID("goIndex").addEventListener("click",function (e) {
   onlyShow(getID("indexBox"));
});
getID("notices")&&getID("notices").addEventListener("click",function (e){
    var isShow = true;
    if(this.isShow) {
        getID("news").style.display="none";
    }else {
        getID("news").style.display="block";
    }
    this.isShow = !this.isShow;
})
// 绑定首页跳转
getID("submitContent")&&getID("submitContent").addEventListener("click",function(e) {
   MENU.getItem("inputTariff").click();
});
// 用户判断
function getUserData() {
    var data=sessionStorage.getItem("userData");
    if(data){
        return JSON.parse(sessionStorage.getItem("userData"))
    }else console.log("用户未登录！")
}
//登录
function initLogin(initFun) {
    var userData=sessionStorage.getItem("userData");

    var login=new DialogCM({
        noMaskEvent:true,
        contentString:"border:none;",
        bodyCssString:"width:500px;margin-left:-250px;background:transparent;",
        maskCssString:'background: url("img/login.jpg") no-repeat ;background-size: 100% 100%;'
    });
    var fullLogin=function(initFun){
        var
            user=creatDom("input",{type:"text",placeholder:"用户名"}),
            password=creatDom("input",{type:"password",placeholder:"密码"}),
            loginBtn=creatDom("input",{type:"button",value:"登录"}),
            content=creatDom("div",{class:"logoin-content"},null,'<div>四川移动网络业务管理稽核平台</div>');

        content.appendChild(user);
        content.appendChild(password);
        content.appendChild(loginBtn);


        login.fullContent(content);
        //事件绑定
        loginBtn.addEventListener("click",function (e) {
            e.stopPropagation();

            var userName=user.value.trim(),
                passwordStr=password.value.trim();
            if(userName&&passwordStr){
                $.ajax({
                    url:"http://localhost:8080/audit/login.do?account="+userName+"&password="+passwordStr,
                    type:"get",
                    dataType:"json",
                    success:function (data) {
                        typeof data!="object"&&(data=JSON.parse(data));
                        if(data.code==200){
                            var userData=data.data;
                            typeof userData!="object"&&(userData=JSON.parse(userData));
                            c_log(userData);
                            sessionStorage.setItem("userData",JSON.stringify(userData));
                            login.hide();
                            onlyShow(getID("systemBox"));
                            initFun&&initFun(userData);
                        }else {
                            CMalert(data.message)
                        }
                    }
                });
            }else {
                CMalert("用户名或密码不能为空")
            }
        })
    };
    getID("signOut").addEventListener("click",function(e){
    //        e.stopPropagation();
    //        fullLogin(initFun);
    //        login.show();
    //        getID("systemBox").style.display="none";
        sessionStorage.removeItem("userData");
        location.reload()
    });
    if(userData){
        onlyShow(getID("systemBox"));
        initFun&&initFun(userData);
        return false
    }
    fullLogin(initFun);
    login.show();

}
//initLogin(function (userData) {
//    //你要登录后初始化首页函数；你内部要获取用户信息可以直接：getUserData()
//    console.log('userData:');
//    console.log(userData);
//    //homePage.initDom();
//});
// 水印组件
function watermark(settings) {
    //默认设置
    var defaultSettings={
        watermark_txt:"text",
        watermark_x:100,//水印起始位置x轴坐标
        watermark_y:50,//水印起始位置Y轴坐标
        watermark_rows:15,//水印行数
        watermark_cols:15,//水印列数
        watermark_x_space:10,//水印x轴间隔
        watermark_y_space:200,//水印y轴间隔
        watermark_color:'#000000',//水印字体颜色
        watermark_alpha:0.1,//水印透明度
        watermark_fontsize:'40px',//水印字体大小
        watermark_fontWeight: 700,
        watermark_font:'微软雅黑',//水印字体
        watermark_width:120,//水印宽度
        watermark_height:90,//水印长度
        watermark_pointerEvents: "none", //鼠标遮挡事件
        watermark_angle:20//水印倾斜度数
    };
    //采用配置项替换默认值，作用类似jquery.extend
    if(arguments.length===1&&typeof arguments[0] ==="object" )
    {
        var src=arguments[0]||{};
        for(key in src)
        {
            if(src[key]&&defaultSettings[key]&&src[key]===defaultSettings[key])
                continue;
            else if(src[key])
                defaultSettings[key]=src[key];
        }
    }
    var oTemp = document.createDocumentFragment();
    //获取页面最大宽度
    var page_width = Math.max(document.body.scrollWidth,document.body.clientWidth);
    //获取页面最大长度
    var page_height = Math.max(document.body.scrollHeight,document.body.clientHeight);

    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (defaultSettings.watermark_cols == 0 ||
 　　　　(parseInt(defaultSettings.watermark_x 
　　　　+ defaultSettings.watermark_width *defaultSettings.watermark_cols 
　　　　+ defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) 
　　　　> page_width)) {
        defaultSettings.watermark_cols = 
　　　　　　parseInt((page_width
　　　　　　　　　　-defaultSettings.watermark_x
　　　　　　　　　　+defaultSettings.watermark_x_space) 
　　　　　　　　　　/ (defaultSettings.watermark_width 
　　　　　　　　　　+ defaultSettings.watermark_x_space));
        defaultSettings.watermark_x_space = 
　　　　　　parseInt((page_width 
　　　　　　　　　　- defaultSettings.watermark_x 
　　　　　　　　　　- defaultSettings.watermark_width 
　　　　　　　　　　* defaultSettings.watermark_cols) 
　　　　　　　　　　/ (defaultSettings.watermark_cols - 1));
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (defaultSettings.watermark_rows == 0 ||
 　　　　(parseInt(defaultSettings.watermark_y 
　　　　+ defaultSettings.watermark_height * defaultSettings.watermark_rows 
　　　　+ defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) 
　　　　> page_height)) {
        defaultSettings.watermark_rows = 
　　　　　　parseInt((defaultSettings.watermark_y_space 
　　　　　　　　　　　+ page_height - defaultSettings.watermark_y) 
　　　　　　　　　　　/ (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
        defaultSettings.watermark_y_space = 
　　　　　　parseInt((page_height 
　　　　　　　　　　- defaultSettings.watermark_y 
　　　　　　　　　　- defaultSettings.watermark_height 
　　　　　　　　　　* defaultSettings.watermark_rows) 
　　　　　　　　　/ (defaultSettings.watermark_rows - 1));
    }
    var x; //偏移量
    var y; //偏移量
    var data= new Date(); //系统时间
    // var aero = getUserData().cityStr;
    // var city = getUserData().countyStr;
    var watermark_name = getUserData().userName; 
    for (var i = 0; i < defaultSettings.watermark_rows; i++) {
        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
        for (var j = 0; j < defaultSettings.watermark_cols; j++) {
            x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
            var mask_div = document.createElement('div');   //水印
            mask_div.id = 'mask_div' + i + j;
            mask_div.className = "mask";
            var Y = data.getFullYear() + '年';
            var M = (data.getMonth()+1 < 10 ? '0'+(data.getMonth()+1) : data.getMonth()+1) + '月';
            var D = data.getDate() + '日';
            var h = data.getHours() + ':';
            var m = (data.getMinutes() < 10 ? '0'+ data.getMinutes(): data.getMinutes()) +':';
            var s = data.getSeconds() < 10 ? '0'+ data.getSeconds():data.getSeconds(); 
            var time = document.createElement("div");
            time.className = "time-system";
            time.innerHTML = watermark_name + Y + M + D + h + m + s;
            mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
            mask_div.appendChild(time);
            //设置水印div倾斜显示
            mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.visibility = "";
            mask_div.style.position = "absolute";
            mask_div.style.left = x + 'px';
            mask_div.style.top = y + 'px';
            // mask_div.style.overflow = "hidden";
            mask_div.style.zIndex = "800";
            mask_div.style.opacity = defaultSettings.watermark_alpha;           //透明度
            mask_div.style.fontSize = defaultSettings.watermark_fontsize;       //字号
            mask_div.style.fontFamily = defaultSettings.watermark_font;         //字体
            mask_div.style.color = defaultSettings.watermark_color;
            mask_div.style.fontWeight = defaultSettings.watermark_fontWeight;
            mask_div.style.pointerEvents = defaultSettings.watermark_pointerEvents;  //鼠标事件
            mask_div.style.width = defaultSettings.watermark_width + 'px';
            mask_div.style.height = defaultSettings.watermark_height + 'px';
            mask_div.style.display = "block";
            oTemp.appendChild(mask_div);
        };
    };
   
    document.body.appendChild(oTemp);
   
}

window.addEventListener("resize", function () {
    $(".mask").remove();
    watermark({ watermark_txt: "四川移动网络业务管理稽核系统",watermark_width:560});
});