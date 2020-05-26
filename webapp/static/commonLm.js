//初始化docassistant的方法
function initplugPath(docm,comType,data,reqPath,reqParam,reqMethod){
    if(data != null){
        docm.data = data;
    }
    if(reqPath != null){
        $(docm).attr("reqPath",reqPath);
    }
    if(reqParam != null){
        $(docm).attr("reqParam",JSON.stringify(reqParam));
    }
    if(reqMethod != null){
        $(docm).attr("reqMethod",reqMethod);
    }
    if(comType != null){
        $(docm).attr("comType",comType);
    }
    document.body.jsCtrl.ctrl = docm;
    document.body.jsCtrl.init();
    /*if(data != null){
        docm.data = null;
    }*/
}

//获取当前日期，转换成2019-01-01格式
function CurentTime(now,times){//times year——年  month——月  day-—日（默认） hour——时  minute——分  second——秒
    times = times ? times : "day";
    now = new Date(now);
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1;  //月
    var day = now.getDate(); //日
    var hh = now.getHours();  //时
    var mm = now.getMinutes(); //分
    var ss = now.getSeconds(); //分
    var clock = year;
    if(times == "year")return clock;

    //如果日期为月末最后一天
    switch(month) {
        case 4:
        case 6:
        case 9:
        case 11:
            day = day > 30 ? 30 : day;
            break;
        case 2:
            //判断是否是闰年
            //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
            //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
            //所以得出判断闰年的表达式：
            if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                day = day > 29 ? 29 : day;
            } else {
                day = day > 28 ? 28 : day;
            }
            break;
    }

    clock += "-";
    if(month < 10)clock += "0";clock += month;
    if(times == "month")return clock;

    clock += "-";
    if(day < 10)clock += "0";clock += day;
    if(times == "day")return clock;

    clock += " ";
    if(hh < 10)clock += "0";clock += hh;
    if(times == "hour")return clock;

    clock += ":";
    if (mm < 10) clock += '0';clock += mm;
    if(times == "minute")return clock;

    clock += ":";
    if (ss < 10) clock += '0';clock += ss;
    if(times == "second")return clock;

    return(clock);
}