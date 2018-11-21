/**
 * Created by issuser on 2017/2/14.
 */
/*
    接口配置获取方法
    var url=Interface.get(id,key)
            //:id为配置接口对象的id(除非在同一页面有不同域的接口，一般都是固定一个的)
            //:key接口配置时候的KEY值(可选)


            例：
            （1.配置接口）:必须在本文件内配置----（约束）
                 Interface.add({
                             id:"CM",
                             environment:{
                                 dev:"http://localhost:8080/BBS/",
                                 line:"http://139.129.218.203:8767/BBS/"
                             },

                             login:"user/loginNowTest"
                 });
            （2.获取接口）:在其他页面需要http请求的地方调用
                var url=Interface.get("CM","login")
                    //url:http://localhost:8080/BBS/user/loginNowTest
                 var url=Interface.get("CM")
                     //url:http://localhost:8080/BBS/

*/


var Interface={
    nowEnvironment:"dev",//切换开发环境和上线环境/dev/line
    fieldBox:{},
    add:function (option) {
        this.fieldBox[option.id]=option
    },
    get:function (id,interfaceName) {
        return this.fieldBox[id].environment[this.nowEnvironment]+(this.fieldBox[id][interfaceName]||"")
    }
};
Interface.add({
    id:"CM",
    environment:{
        dev:"http://localhost:8080/CM/",//开发环境接口公共字段
        line:"http://139.129.218.203:8767/BBS/"//上线环境接口公共字段
    },
    //这里统一添加接口的键值对
    "login":"testLogin",//登录
    "add":"addMeter",//增加电表
    "view":"view",//查看稽核单
    "modify":"modify",//修改稽核单
    "submit":"submit",//提交稽核单
    "revoke":"revoke",//撤销稽核单
    "delete":"delete",//删除稽核单
    "push-finance":"push-finance",//推送财务
    "push-expense":"push-expense"//推送报销发起人
});
Interface.add({
    id:"Audit",
    environment:{
        dev:"http://localhost:8080/audit/",//开发环境接口公共字段--西安
    },
    //数据报表接口键值对
    eleFeeMgmt:"",//电费统计管理
    eleQuantityMgmt:"",//电量统计管理
    priceMgmt:"unitPrice/proportion.do",//单价统计管理
    auditMgmt:"",//用电量管理
    indexMgmt:"",//用电量管理
});