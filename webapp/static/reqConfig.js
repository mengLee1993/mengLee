/*****************************测试地址*************************************/
var requestUrl = "/api";
var jsonMetadata = {"rspBody":null};
var valiClass = typeof clsValidateCtrl != "undefined" ? new clsValidateCtrl() : null;
var param = {};


/******************************************************************************
 *                               地址跳转
 *    author:zhongwei by egou
 *    version:1.0
 *    updateTime: 2017-07-28
 *    参数说明:
 *		strUrl:跳转地址   status:错误码，404,500这种, "0000000"-成功
 *      jumpType:0表示本页刷新,1表示打开新页面
 *      isAsync:true表示异步，false表示同步
 *
 ******************************************************************************/
function jumpUrl(strUrl,status,jumpType,data,isAsync)
{
    if(typeof(loadingProc) == "function" && isAsync){
        loadingProc(1);
    }
    if(status != null)
    {
        var objWin = (window.parent.location.href == window.location.href) ? window.location : window.parent.location;
        switch(status)
        {
            case "0000000":
                if(strUrl != "" && strUrl != null)
                    (jumpType == 0) ? window.location.href = strUrl : window.open(strUrl);
                break;
            /* case "999999":
                 objWin.href = "/shop/index.php?act=login";
                 break;*/
            case "0200000":
                objWin.href="/static/main/mod-home/html-www/login-Index.html";
                break;
            case "654321":
                alert(data);
                break;
            default:
                if(status != "0000000" && data != null)
                // alert(data.retDesc);
                    break;
        }
    }
}

//固定表头
function nayiLock(scrollDivId) {
    jQuery("#" + scrollDivId).scroll(function () {
        var left = jQuery("#" + scrollDivId).scrollLeft();
        jQuery(this).find(".lock-col").each(function () {
            jQuery(this).css({ "position": "relative", "left": left, "background-color": "#daefff", "z-index": jQuery(this).hasClass("lock-row") ? 20 : 10 });
        });

        var top = jQuery("#" + scrollDivId).scrollTop();
        jQuery(this).find(".lock-row").each(function () {
            jQuery(this).css({ "position": "relative", "top": top, "background-color": "#daefff", "z-index": jQuery(this).hasClass("lock-col") ? 20 : 9 });
        });
    });
}

function loadingProc(isFinal){
    if(isFinal == 0){//请求前
        if(($("body",window.parent.document).length > 0 && $("[id=_loadingAjax]",window.parent.document).length > 0) || ($("body",window.parent.document).length == 0 && $("[id=_loadingAjax]").length > 0)){
            return;
        }
        if($("body",window.parent.document).length > 0){
            $("body",window.parent.document).append("<div id='_loadingAjax'></div>");
        }else{
            $("body").append("<div id='_loadingAjax'></div>");
        }
        var heightSet = $(window).height() > $("body").height() ? $(window).height() : $("body").height();
        var htmlStr = '<div id="ajax_waitBox" style="height:'+ heightSet +'px">' +
            '<div id="ajax_waitBoxCon" style="height:'+ $(window).height() +'px;position: relative">' +
            '<div id="ajax_wait">' +
            '<div id="ajax_wait_1" class="ajax_wait">' +
            '</div>' +
            '<div id="ajax_wait_2" class="ajax_wait">' +
            '</div>' +
            '<div id="ajax_wait_3" class="ajax_wait">' +
            '</div>' +
            '<div id="ajax_wait_4" class="ajax_wait">' +
            '</div>' +
            '<div id="ajax_wait_5" class="ajax_wait">' +
            '</div>' +
            '<div id="ajax_wait_6" class="ajax_wait">' +
            '</div>' +
            '<div id="ajax_wait_7" class="ajax_wait">' +
            '</div>' +
            '<div id="ajax_wait_8" class="ajax_wait">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        if($("body",window.parent.document).length > 0){
            $("#_loadingAjax",window.parent.document).html(htmlStr);
            $("#ajax_waitBox",window.parent.document).show();
        }else{
            $("#_loadingAjax").html(htmlStr);
            $("#ajax_waitBox").show();
        }

    }else if(isFinal == 1){//请求后
        if(($("body",window.parent.document).length > 0 && $("[id=_loadingAjax]",window.parent.document).length == 0) || ($("body",window.parent.document).length == 0 && $("[id=_loadingAjax]").length == 0)){
            return;
        }
        if($("body",window.parent.document).length > 0){
            $("#_loadingAjax",window.parent.document).remove();
        }else{
            $("#_loadingAjax").remove();
        }
    }
}

if(!sessionStorage.getItem("dataConfig") || (sessionStorage.getItem("dataConfig") && !JSON.parse(sessionStorage.getItem("dataConfig")).login.login.isLogin)){
    if(window.location.href.indexOf("login/html/login.html") == -1){
        window.location.href = "../../login/html/login.html";

    }
}else{
    var dataConfig = JSON.parse(sessionStorage.getItem("dataConfig"));
}



/*my common*/
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
