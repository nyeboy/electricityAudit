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
        dev:"http://localhost:8080/audit/",//开发环境接口公共字段
        line:"http://120.77.81.69:8080/audit/"//上线环境接口公共字段
    },
    getElectricityInputList:"inputElectricty/queryList.do",//获取电费录入列表
    deleteBatchList:"inputElectricty/deleteByIDs.do",//批量删除录入
    getInputElectrictyDetails:"inputElectricty/deleteByIDs.do",//获取录入详情
    getAddAuditSheetData:"inputElectricty/toAdd.do",//请求新增稽核单
    getAccountListData:"testJson/AccountDatalist.json",//获取报账点列表
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
        line:"http://120.77.81.69:8080/audit/"
    },
    //数据报表接口键值对
    priceMgmt:"unitPrice/proportion.do",//单价统计管理
    superPowerRatingCount:'auditReport/superPowerRating.do',//稽核管理--全省站点超额定功率标杆值情况
    superSmartMeter:"auditReport/superSmartMeter.do",//稽核管理--超智能电表标杆值、超开关电源标杆值情况统计报表
    availability:'norm/availability.do',//指标统计管理--全省智能电表接入率、可用率
    consistency:'norm/consistency.do',//指标统计管理--资管、财务系统基站名称一致性
    sitePower:'norm/sitePower.do',//指标统计管理--站点开关电源监控完好率、可用率
    roleType:'checkUserLevel.do',//用户权限--0非领导 1省领导
    detail:'report/summary/detail.do',//首页--各区域（省/市）详细信息
    stationECStastic:'electricCharge/stationECStastic.do',//电费情况
    scaleECStastic:'electricCharge/scaleECStastic.do',//电费占收比、占支比
    scECStastic:'electricCharge/scECStastic.do',//单载波电费
    stationDetailEP:'electricPower/stationDetailEPStastic.do',//直供电、转供电用电量情况
});
Interface.add({
    id:"DS",
    environment:{
        dev:"http://localhost:8080/audit/",//开发环境接口公共字段
        line:"http://120.77.81.69:8080/audit/"//上线环境接口公共字段
    },
    getCity:"systemData/queryCityList.do",//获取城市名称
    getCounty:"systemData/queryCountyList.do",//获取地区名称
    getBasicData:"siteInfo/querySite.do",//获取基础数据
    getDetails:"siteInfo/queryDetail.do",//获取数据详情
    getpowRating:"benchmark/powerRating.do",// 获取额定标杆数据
    getpowRatingDeatail:"benchmark/powerRatingDetail.do",// 获取额定标杆数据
});