app.service('utils', ['ngDialog', function (ngDialog) {


    return {


        /**
         * 判断i 是否在 list 中；
         * @param i
         * @param list
         * @returns {boolean}
         */
        iInList:function(i,list){

            var flag=false;


            try{
                if(list.length==undefined){

                    return false;

                }


            }catch (e){
                return false;

            }


            for(var j=0; j<list.length; j++ ){
                if(i==list[j]){
                    flag=true;
                    break;
                }
            }

            return flag;


        },




        /**
         * 获取集合中 某个某个属性的值
         * @param list
         * @param attr
         * @returns {Array}
         */
        getListValsForAttr:function(list,attr){

            var arr=[];

            for(var i=0; i<list.length; i++){
                var item = list[i];
                arr.push(item[attr]);
            }

            return arr;
        },


        /**
         * 获取集合中某属性中的某属性值
         * @param list
         * @param attr
         * @param subAttr
         * @returns {Array}
         */
       getListValsForAttrAndSubAttr:function(list,attr,subAttr){

            var arr=[];

            for(var i=0; i<list.length; i++){
                var item = list[i];
                arr.push(item[attr][subAttr]);
            }

            return arr;
        },




        /**
         * 获取日期差 时间格式yyyy-mm-dd
         * @param strDateStart
         * @param strDateEnd
         * @param strSeparator "日期分隔符"  默认 “-”
         * @returns {Nu@mber|*}
         */
        getDays:function(strDateStart,strDateEnd,strSeparator){

            if(strSeparator==undefined){
                var strSeparator = "-"; //日期分隔符
            }

            var oDate1;
            var oDate2;
            var iDays;
            oDate1= strDateStart.split(strSeparator);
            oDate2= strDateEnd.split(strSeparator);
            var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
            var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
            iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
            return iDays ;
        },




    /**
         * layer 弹出框
         * @param title
         * @param domId
         * @param height
         * @param width
         * @returns {*}
         */
        layerDialog:function (title,domId,height,width) {

            return layer.open({
                type: 1,
                title:title,
                skin: 'layui-layer-rim', //加上边框
                area: [height,width], //宽高
                content: $(domId)
            });
        },

        /**
         * 关闭layerDialog
         * @param layerDialog
         */
        closeLayerDialog:function(layerDialog){
            layer.close(layerDialog);
        },


        /**
         * 判断是否为会员
         * @param type
         * @returns {boolean}
         */
        isMember:function(type) {
            if(type!=''&&type!=null){
                return true ;
            }else{
                return false;
            }
        },


        /**
         * 对象转换 string to object
         * @param list
         */
        changeObj: function (listOrItem) {


            //console.log(">>>>>>>>>>",typeof listOrItem);

            if (listOrItem instanceof Array) {
                var arr = [];
                for (var i = 0; i < listOrItem.length; i++) {

                    var item = listOrItem[i];

                    // console.log(">>>>>>>>>>",typeof item == 'string');


                    if (typeof  item == 'string') {

                        arr.push(JSON.parse(listOrItem[i]));

                    } else {
                        arr.push(item)
                    }

                }


                //console.log(arr);


                return arr;
            } else {

                if (typeof  listOrItem == 'string') {

                    return JSON.parse(listOrItem);
                } else {
                    return listOrItem
                }
            }


        },


        /**
         * 判断item 是否在列表中 判断依据为属性
         * @param item
         * @param arr
         * @param itemAttr
         * @param arritemAttr
         * @returns {boolean}
         */
        itemInArray: function (item, arr, itemAttr, arrItemAttr) {

            var flag = false;

            for (var i = 0; i < arr.length; i++) {

                var temp = arr[i];

                if (item[itemAttr] == temp[arrItemAttr]) {
                    flag = true;
                    break
                }
            }

            return flag;
        },


        arrUnique: function (arr) {

            var unique = {};

            arr.forEach(function (item) {
                unique[JSON.stringify(item)] = item;
            });

            return arr = Object.keys(unique).map(function (u) {
                return JSON.parse(u)
            });


        },


        /**
         * 转换 object 中的属性值 为 类型
         * @param obj
         * @returns {*}
         */
        formatObjValToStr: function (obj) {

            for (var i in obj) {
                if (typeof  obj[i] != 'tring') {
                    obj[i] =  obj[i]==null? "": obj[i]+"";
                }
            }
            return obj;
        },

        /**
         * 全选
         * @param  {[type]}  domId [description]
         * @param  {Boolean} isArr [description]
         * @return {[type]}        [description]
         */
        getCheckedVals: function (domId, isArr) {
            var arr = [];
            $(domId + " input[type='checkbox']:checked").each(function () {
                if($(this).val() != "on"){
                    arr.push($(this).val());
                }
            });

            if (isArr) {
                return arr;
            } else {
                return arr.join(',');
            }

        },

        /**
         * 获取单选框值
         * @returns {*}
         */
        getCheckedValsForRadio:function(domId){

            var obj = null;

            $(domId + " input[type='radio']:checked").each(function () {
                obj=$(this).val();
            });


            return obj;

        },

        //Array 转 字符串，以separator 为分隔符
        arrayToStr: function (arr, separator) {
            return arr.join(separator);
        },


        // js原生confirm 优化
        confirm: function (title, text, successFn,cancelFn) {


            if(text=='' || text==null){
                text=title;
            };


            var index= layer.confirm(text, {
                btn: ['确定','取消'] //按钮
            }, function(){

                if(typeof successFn == 'function'){
                    // alert("successFn");
                    successFn();
                    layer.close(index);
                }
            }, function(){
                if(typeof cancelFn == 'function'){
                    cancelFn();
                    layer.close(index);
                }
            });

        },



        //全局退出登录方法
        logout: function () {

            // window.localStorage.removeItem("token");
            // window.localStorage.removeItem("userInfo");
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("userInfo");

            logout();


        },

        /**
         * 加载数据方法
         * @param data
         * @param fn
         */
        loadData: function (data, fn) {

            if (data.code==200) {
                if (typeof fn == 'function') {
                    fn(data);
                }
            }
        },

        /**
         * ajax 请求成功方式
         * @param data
         * @param fn 回调函数
         */
        ajaxSuccess: function (data, fn, text) {
            //请求成功
            if (data.code==200) {

                layer.alert(text, {
                    icon:1,
                    time:2000,
                    btn:[],
                });

                if(typeof fn == 'function'){
                    //setTimeout(function(){
                        fn();
                    //},2000);
                }


            }
        },

        /**
         * 深拷贝
         * @param obj
         */
        deepCopy: function copy(obj){
           var str, newobj = obj.constructor === Array ? [] : {};
            if(typeof obj !== 'object'){
                return;
            } else if(window.JSON){
                str = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(str); //还原
            } else {
                for(var i in obj){
                    newobj[i] = typeof obj[i] === 'object' ?
                    cloneObj(obj[i]) : obj[i];
                }
            }
            return newobj;
        },

        /**
         * 信息提示框
         * @param str
         */
        msg: function (str, fn) {
            msg(str, fn);
        },

        bigMsg: function (str) {
            swal({
                title: str,
                type: 'info',
                text: "2's后将自动关闭.",
                timer: 2000,
                showConfirmButton: false
            });

        },


        alert:function(text,fn){
            var index=  layer.alert(text,function(){
                if(typeof fn == 'function'){
                    fn();
                }
                layer.close(index);
            });
        },


        succes: function (msg) {
            layer.alert(msg, {
                icon:1,
                time:2000,
                btn:[]
            });

        },
        error: function (msg) {

            layer.alert(msg, {
                icon:2,
                time:2000,
                btn:[]
            });



        },

        ajaxSuccess: function (data, fn) {

            if (data.code==200) {
                var msg = data.message;

                layer.alert(msg, {
                    icon:1,
                    time:2000,
                    btn:[]
                });

                //回调方法
                if (typeof fn == 'function') {
                    //fn();
                    fn(data);
                }

            }

        },

        /**
         *
         * @param data
         * @param fn
         * @param subtitle
         * @param callback
         */
        ajaxSuccessCallback: function (data, fn, subtitle, callback) {
            if (data.code==200) {
                var msg = data.message;

                if (typeof data.message == "object") {
                    msg = '操作成功！'
                }




                var index=  layer.alert(text,function(){
                    if(typeof callback == 'function'){
                        fn();
                    }
                    layer.close(index);
                });



                //回调方法
                if (typeof fn == 'function') {
                    //fn();
                    fn(data);
                }

            }
        },

     



    };
}]);