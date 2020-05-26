/*****************************测试地址*************************************/
var requestUrl = "/api";
var jsonMetadata = {"rspBody":null};
var valiClass = new clsValidateCtrl();
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
    window.close();
    //jumpUrl("../../login/html/login.html","0000000",0)
}else{
    var dataConfig = JSON.parse(sessionStorage.getItem("dataConfig"));
}