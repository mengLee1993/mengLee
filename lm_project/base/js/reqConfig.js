/*****************************增值测试地址*************************************/
var requestUrl = "http://10.5.210.201:8086/mockjs/2";	//请求后台地址business
// var requestUrl = "http://localhost:8051";
//var requestUrl = "http://rap.ennew.dev/mockjs/32/";	//请求rap地址

// var urlStr = "http:///static/";
//APP9624317094
var jsonReqHeaderData = {};
// getCookie("sid",jsonReqHeaderData);
// var sid = $.cookie("sid");
// var channelId =  $.cookie("channelId");
// if(channelId !="" && channelId != undefined &&  channelId != null)
// {
//     setCookie('channelId',channelId,jsonReqHeaderData);
// }
// else
// {
//     jsonReqHeaderData["channelId"] = "";
// }



// if(sid)setCookie('sid',sid,jsonReqHeaderData);
// if(!sid && window.location.href.indexOf("/login.html")<0){
//     window.location.href="/static/canalBackstage3.0/login/html-www/login.html";
// }
/*****************************用户测试地址*************************************/
//var requestUrl = "http://10.4.105.172:8051";	//请求后台地址

/*****************************本机测试地址*************************************/
//var requestUrl = "http://localhost:8080";	//请求后台地址


/******************************************************************************
 *                               地址跳转
 *    author:zhongwei by egou
 *    version:1.0
 *    updateTime: 2017-07-28
 *    参数说明:
 *		strUrl:跳转地址   status:错误码，404,500这种,
 *      jumpType:0表示本页刷新,1表示打开新页面
 *
 ******************************************************************************/
/***********区分渠道 奥德&阳光易购**********/
// var lcoationJson = [{"domain":"aode.channel-backstage.ygego.alpha","channelId":1},{"domain":"aode.channel-backstage.ygego.beta","channelId":2},
//     {"domain":"aode.channel-backstage.ygego.beta1","channelId":2},{"domain":"aode.channel-backstage.ygego.beta2","channelId":2},
//     {"domain":"ygego.channel-backstage.ygego.alpha","channelId":1},
//     ,{"domain":"ygego.channel-backstage.ygego.beta2","channelId":1}];
//
// function getHref()
// {
//     //获取当前地址
//     var currentHref = window.location.host;
//     if(currentHref == lcoationJson[0].domain || currentHref == lcoationJson[1].domain || currentHref == lcoationJson[2].domain || currentHref == lcoationJson[3].domain)
//     {
//         jsonReqHeaderData.channelId = 2;
//         //document.getElementsByTagName("title").text("奥德e购运营管理平台");
//     }
//     // else if(currentHref == lcoationJson[1].domain)
//     else
//     {
//         jsonReqHeaderData.channelId = 1;
//      //   document.getElementsByTagName("title").text("阳光e购运营管理平台");
//     }
//     return jsonReqHeaderData;
// }
/***********区分渠道**********/

function comJudgeLogin(){
    $.ajax({
        url: requestUrl+'/vasCommon/getUserInfo',
        type:'post',
        data:'',
        async:false,
        success:function (data){
            data = JSON.parse(data);

            //status==1已登录，0未登录
            if(typeof(comJudgeLogin) == 'function'){
                comJudgeLoginLogic(data);
            }
        },
        error:function (data){
            alert(data)
        }
    });
}

/******************************************************************************
 *                               地址跳转
 *    author:zhongwei by egou
 *    version:1.0
 *    updateTime: 2017-07-28
 *    参数说明:
 *      strUrl:跳转地址   status:错误码，404,500这种,
 *      jumpType:0表示本页刷新,1表示打开新页面
 *
 ******************************************************************************/

function jumpUrl(strUrl,status,jumpType,data)
{
    //if(jumpType == "-1")
    //  return false;
    if(status != null)
    {
        var objWin = (window.parent.location.href == window.location.href) ? window.location : window.parent.location;
        if(window.location.href.indexOf("/login.html") != -1)return;
        switch(status)
        {
            /*case "1":
             (jumpType == 0) ? window.location.href = "" : window.open("");
             break;*/
            // case "6000901":
            //     clearCookie("sid",jsonReqHeaderData);
            //     objWin.href = "/static/canalBackstage3.0/login/html-www/login.html";
            //     break;
            // case "6000902":
            //     clearCookie("sid",jsonReqHeaderData);
            //     objWin.href = "/static/canalBackstage3.0/login/html-www/login.html";
            //     break;
            // default:
            //     if(strUrl != "" && strUrl != null)
            //         (jumpType == 0) ? window.location.href = strUrl : window.open(strUrl);
            //     break;
        }
    }
}

/******************************************************************************
 *                               头部加载
 *    author:
 *    version:1.0
 *    updateTime: 2017-07-28
 *    参数说明:
 *		num: 1代表有侧边栏(990px)  2代表没有侧边栏(890px) 3代表没有侧边栏(1190px)
 *      typeId: 1代表采购商t  2代表供应商  3代表运营端  4代表企业中心  5代表消息中心
 *
 ******************************************************************************/
// var creatHeaderUrl = "http://localhost:8051/";
// function creatHeader(num,typeId){
//     // num 1代表有侧边栏(990px)  2代表没有侧边栏(890px) 3代表没有侧边栏(1190px)
//     // typeId 1代表采购商  2代表供应商  3代表运营端  4代表企业中心  5代表消息中心
//     if(typeId == 1){
//         $("#js-loader").load("/static/purchaser/commonHeader/commonHeader.html",function(){
//             determineWhether(num);
//         });
//     }else if(typeId == 2){
//         $("#js-loader").load("/static/purchaser/commonHeader/commonHeader.html",function(){

//             determineWhether(num);
//         });
//     }else if(typeId == 3){
//         $("#js-loader").load("/static/purchaser/commonHeader/commonHeader.html",function(){
//             determineWhether(num);
//         });
//     }else if(typeId == 4){
//         $("#js-loader").load("/static/purchaser/commonHeader/commonHeader.html",function(){
//             determineWhether(num);
//         });
//     }else if(typeId == 5){
//         $("#js-loader").load("/static/purchaser/commonHeader/commonHeader.html",function(){
//             determineWhether(num);
//         });
//     }
// }
function determineWhether(num)
{
    if(num == 1){
        $("#js-mainWidth").css({
            "right":"0px",
            "width":"990px"
        });
        $("#js-leftNavBar").show();
    }else if(num == 2){
        $("#js-mainWidth").css({
            "right":"150px",
            "width":"890px"
        });
        //console.log($("#js-leftNavBar"));
        $("#js-leftNavBar").hide();
    }else if(num == 3){
        $("#js-mainWidth").css({
            "right":"0",
            "width":"1190px"
        });
        //console.log($("#js-leftNavBar"));
        $("#js-leftNavBar").hide();
    }
    $("#js-mainWidth").show();
}

//load头部底部文件;
$(function(){
    //getHref();
    if(!$("#loginIf").val()){
        $("body").children().eq(0).before("<div id='headerLoad'></div>").css("margin","10px auto");
        $("#headerLoad").load("/static/canalBackstage3.0/comHearder/coommonhead.html");
    }

});

