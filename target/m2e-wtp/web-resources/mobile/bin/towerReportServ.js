/*
* @Author: admin
* @Date:   2017-02-07 09:51:35
* @Last Modified by:   admin
* @Last Modified time: 2017-02-07 10:19:58
*/


app.service('towerReportServ', [ '$http', function($http) {

    var base_url = CONFIG.BASE_URL;

    return {

        //电量统计管理-全省站点用电量情况
        stationEPStastic:function (typeCode,year){
            if(typeCode != undefined && typeCode != ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = (new Date()).getFullYear();
            }
            return $http.get(base_url+'/towerElectricPower/stationEPStastic.do?typeCode='+typeCode+'&year='+ year)
        },

        //电量统计管理- 全省站点直供电，转供电用电量情况
        stationDetailEPStastic:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = (new Date()).getFullYear();
            }
            return $http.get(base_url+'/towerElectricPower/stationDetailEPStastic.do?typeCode='+typeCode+'&year='+ year)
        },





        //电费统计管理-全省站点电费情况
        stationECStastic:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = (new Date()).getFullYear();
            }
            return $http.get(base_url+'/towerElectricCharge/stationECStastic.do?typeCode='+typeCode+'&year='+ year)
        },

        //电费统计管理-全省站点电费占收比，占支比
        scaleECStastic:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = 2016;
            }
            return $http.get(base_url+'/electricCharge/scaleECStastic.do?typeCode='+typeCode+'&year='+ year)
        },

        //电费统计管理-全省站点单载波电费情况
        scECStastic:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = 2016;
            }
            return $http.get(base_url+'/electricCharge/scECStastic.do?typeCode='+typeCode+'&year='+ year)
        },



        //稽核统计管理-全省站点超额定功率标杆情况
        superPowerRating:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = 2016;
            }
            return $http.get(base_url+'/auditReport/superPowerRating.do?typeCode='+typeCode+'&year='+ year)
        },

        //稽核统计管理-全省站点超智能电表标杆值、超开关电源标杆值情况
        superSmartMeter:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = 2016;
            }
            return $http.get(base_url+'/auditReport/superSmartMeter.do?typeCode='+typeCode+'&year='+ year)
        },





        //单价统计管理-全省电费单价占比情况
        unitPriceProportion:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = 2016;
            }
            return $http.get(base_url+'/unitPrice/proportion.do?typeCode='+typeCode+'&year='+ year)
        },



        //指标统计管理- 资产、财务系统基站名称一致性报表
        normConsistency:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = 2016;
            }
            return $http.get(base_url+'/norm/consistency.do?typeCode='+typeCode+'&year='+ year)
        },
        //指标统计管理- 全省站点智能电表接入率、可用率报表
        normAvailability:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = 2016;
            }
            return $http.get(base_url+'/norm/availability.do?typeCode='+typeCode+'&year='+ year)
        },
        //指标统计管理- 全省站点开关电源监控完好率、可用率报表
        normSitePower:function (typeCode,year){
            if(typeCode == undefined || typeCode == ''){
                typeCode = 0;
            }
            if(year == undefined || year == ''){
                year = 2016;
            }
            return $http.get(base_url+'/norm/sitePower.do?typeCode='+typeCode+'&year='+ year)
        },
        //统计
        provinceSummary:function (year){
            if(!year){
                year = new Date().getFullYear();
            }
            return $http.get(base_url+'/report/summary/provinceSummary.do?year='+ year)
        }


    }
}]);