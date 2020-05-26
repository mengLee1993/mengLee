function getAjaxResultWait(strPath, method, param, callbackMethod, beforeSendFunc,complete , asyncType) {
    var strPath = (requestUrl == null) ? strPath : requestUrl + strPath;
    var operId = (param.operId == null) ? "" : param.operId;
    jsonReqHeaderData.operTitle = operId;
    var reqParam = {"reqHeader": jsonReqHeaderData};
    reqParam["reqBody"] = param;
    asyncType = asyncType || false;
    $.ajax({
        url: strPath,
        type: method,
        async: asyncType,
        cache: false,
        data: JSON.stringify(reqParam),
        dataType: 'text',
        contentType: 'application/json',
        beforeSend: beforeSendFunc ? beforeSendFunc : function () {
            $("#ajax_waitBox").show();
        },
        success: function (data) {
            if (typeof(callbackMethod) == "string") {
                eval(callbackMethod);
            } else if (typeof(callbackMethod) == "function") {
                callbackMethod(data);
            }
            var jsonResultData = JSON.parse(data);
            jumpUrl(null, jsonResultData.retCode, null, jsonResultData);
        },
        complete: complete ? complete :function(){
            $("#ajax_waitBox").hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}
$(function(){
   $("body").append("<div id='_loadingAjax'></div>");
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
   $("#_loadingAjax").html(htmlStr);
});