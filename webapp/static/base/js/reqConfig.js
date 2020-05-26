/*****************************增值测试地址*************************************/
var requestUrl = ""; //请求后台地址 var requestUrl = "http://10.5.210.200:8086/mockjs/8"; //请求后台地址
var domainName = "http://"+document.domain+":8080";
if(document.domain == "localhost"){
    domainName = "http://"+window.location.host;
}
var jsonReqHeaderData = {}
// 竞拍生产
// var WebSocketUrl="220.194.33.147:10183"
// 竞拍测试
var WebSocketUrl="10.3.246.239:10183"
/*****************************用户测试地址*************************************/
//var requestUrl = "http://10.4.105.172:8051";	//请求后台地址

/*****************************本机测试地址*************************************/
//var requestUrl = "http://localhost:8080";	//请求后台地址
if(getCookie("isLogin") == ""){
	setCookie("isLogin","0");
}
if($.cookie('auth-token')){
    var jsonMetadata = jsonMetadata?jsonMetadata:parent.jsonMetadata;
    if(jsonMetadata == null && window.location.href.indexOf("login.html")==-1){
        //缓存小代码数据 优化页面
        getAjaxResult("/base-dict-data/findBaseDictDataMap","post",{},   function metaDataBack(data)
        {
            var jsData=JSON.parse(data);
            if(jsData.retCode=="0000000")
            {
                jsonMetadata = jsData;
            }
        });
        //缓存人员信息到cookie
        /*getAjaxResult("/customer/getUserCenterInfo","post",{},   function userInfoCache(data)
        {
            var jsData=JSON.parse(data);
            if(jsData.retCode=="0000000")
            {
                var expiresDate= new Date();
                expiresDate.setTime(expiresDate.getTime() + (30*60*1000));
                $.cookie('userInfo',JSON.stringify(jsData.rspBody),{ expires: expiresDate, path: '/' });
            }
        });*/
    }

    var jsonOrgdata = jsonOrgdata?jsonOrgdata:parent.jsonOrgdata;
    if(jsonOrgdata == null && window.location.href.indexOf("login.html")==-1){
        //缓存小代码数据 优化页面
        getAjaxResult("/customer/getUserCenteOrg","post",{},   function metaDataBack(data)
        {
            var jsData=JSON.parse(data);
            if(jsData.retCode=="0000000")
            {
                jsonOrgdata = jsData;
            }
        });
    }
}



/******************************************************************************
 *                               地址跳转
 *    author:zhongwei by egou
 *    version:1.0
 *    updateTime: 2017-07-28
 *    参数说明:
 *		strUrl:跳转地址   status:错误码，404,500这种, "0000000"-成功
 *      jumpType:0表示本页刷新,1表示打开新页面
 *
 ******************************************************************************/

function jumpUrl(strUrl, status, jumpType, data) {
    if (typeof (loadingProc) == "function" && !configFlag) {
        configFlag = true;
        loadingProc(1);
    }
    if (status != null) {
        var objWin = (window.parent.location.href == window.location.href) ? window.location : window.parent.location;
        switch (status) {
            case "0000000":
                if (strUrl != "" && strUrl != null)
                    (jumpType == 0) ? window.location.href = strUrl : window.open(strUrl);
                break;
                /* case "999999":
                     objWin.href = "/shop/index.php?act=login";
                     break;*/
			case "0000":
                if (strUrl != "" && strUrl != null)
                    (jumpType == 0) ? window.location.href = strUrl : window.open(strUrl);
                break;
            case "0200000":
            	setCookie("isLogin","0");
				if(document.domain == "zxjypt.sggf.com" && window.location.port == "8080")
					window.location.href = "http://zxjypt.sggf.com:8080/#/login";
				else if(document.domain == "10.68.26.66" || document.domain == "zxjy.sggf.com")
					window.location.href = "http://10.68.26.68/#/login";
				else
					window.location.href = "/sdapstatic/auctionPlat/limitManage/html-gulp-www/login.html";
                break;
            default:
                if (status != 0000000 && data != null)
                    alert(data.retDesc);
                break;
        }
    }
}

function comJudgeLogin() {
    $.ajax({
        url: requestUrl + '/vasCommon/getUserInfo',
        type: 'post',
        data: '',
        async: false,
        success: function (data) {
            data = JSON.parse(data);

            //status==1已登录，0未登录
            if (typeof (comJudgeLogin) == 'function') {
                comJudgeLoginLogic(data);
            }
        },
        error: function (data) {
            alert(data)
        }
    });
}
//下载文件
function downloadFile(fileName,fileUrl,downloadBool){
    //ture是全路径  false 相对路径
    if(downloadBool){
        window.open("/api/file/allPathdownload?fileName="+fileName+"&filePath="+fileUrl+"");
    }else{
        window.open("/api/file/download?fileName="+fileName+"&filePath="+fileUrl+"");
    }
}


function clsMessageBoxTip() {
    this.html = "";
    this.ctrl = null;			//点击弹出窗口触发的按钮对象
    this.parentCtrl = null;
    this.messageCtrl = null;
    this.messageCtrlPop = null;
    this.reqParam   = "{}";
    this.titleName   = "客户弹窗";
    this.template = clsMessageBoxTip$template;
    this.init = clsMessageBoxTip$init;
    this.parse = clsMessageBoxTip$parse;
    this.bind = clsMessageBoxTip$bind;
    this.openWin = clsMessageBoxTip$openWin;
    this.closeWin = clsMessageBoxTip$closeWin;
    this.after = clsMessageBoxTip$after;
    this.cssCreate = clsMessageBoxTip$cssCreate;
    this.creatCtrl = null;
    this.jsonData  = null;
}
function clsMessageBoxTip$parse() {

    if (document.getElementById("messageBoxWin") == null) {
        this.html = "";
        this.template();
        this.messageCtrl = document.createElement("div");
        this.messageCtrl.id = "coveredCustDIV";
        this.messageCtrl.className = "coveredPopup";
        // this.messageCtrl.style.display = "none";
        this.messageCtrl.style.zIndex = 3000000002;
        document.body.appendChild(this.messageCtrl);
    }
    else {
        this.html = "";
        this.template();
        this.messageCtrl = document.getElementById("messageBoxWin");
    }
    this.cssCreate();
    this.messageCtrl.innerHTML = this.html;
    $(this.messageCtrl).find("#custMian_tab").attr('comtype',"standardTableCtrl");
    document.body.jsCtrl.ctrl =$("#custMian_tab")[0];
    document.body.jsCtrl.init();
    document.body.jsCtrl.ctrl=$(this.messageCtrl).find("*[comtype=searchBtnCtrl]")[0];
    document.body.jsCtrl.init();
    document.body.jsCtrl.ctrl=$(this.messageCtrl).find("*[comtype=clearAllCond]")[0];
    document.body.jsCtrl.init();
    // this.openWin();
}

//弹出方法
function clsMessageBoxTip$openWin() {
    this.messageCtrl.remove();
}
function clsMessageBoxTip$closeWin() {
    $(this.messageCtrlPop).css({"display":"none"});
    $(this.messageCtrl).css({"display":"none"});
}
function clsMessageBoxTip$init() {

    if(this.ctrl.getAttribute("json")){
        this.json=JSON.parse(this.ctrl.getAttribute("json"));
    }
    if(this.ctrl.getAttribute("nameStr")){
        this.nameStr=JSON.parse(this.ctrl.getAttribute("nameStr"));
    }
    if(this.ctrl.getAttribute("reqPath")){
        this.reqPath=this.ctrl.getAttribute("reqPath");
    }
    if(this.ctrl.getAttribute("reqParam")){
        this.reqParam=this.ctrl.getAttribute("reqParam");
    }
    if(this.ctrl.getAttribute("valuationInput")){
        this.valuationInput=this.ctrl.getAttribute("valuationInput");
    }
    if(this.ctrl.getAttribute("codeInput")){
        this.codeInput=this.ctrl.getAttribute("codeInput");
    }
    if(this.ctrl.getAttribute("json")){
        this.jsonItem= JSON.parse(this.ctrl.getAttribute("json"));
    }
    if(this.ctrl.getAttribute("titleName")){
        this.titleName= this.ctrl.getAttribute("titleName");
    }
    this.parse();
    this.jsCtrl = this;
    this.bind();
}
function clsMessageBoxTip$bind() {
    // btnOne
    $( this.jsCtrl.messageCtrl).find(".btnOne").click(function (event) {
        var that = document.body.jsTools;
        if($(document.body.jsTools.messageCtrl).find(".customin:checked").length>0){
            document.body.jsTools.ctrl.jsonData = $(document.body.jsTools.messageCtrl).find(".customin:checked").parents("tr:first")[0].jsonData;
            var seclJsonItem = $(document.body.jsTools.messageCtrl).find(".customin:checked").parents("tr:first")[0].jsonData;
            //parentCtrl  在自己页面定义   parentCtrl内的任意字段可赋值
            if (that.parentCtrl != null){
                $(that.parentCtrl).find("#"+that.valuationInput).val(seclJsonItem[document.body.jsTools.jsonItem.jsonName]);
                $(that.parentCtrl).find("#"+that.valuationInput).attr("code",seclJsonItem[document.body.jsTools.jsonItem.jsonCode]);
                if (that.codeInput != null)
                    $(that.parentCtrl).find("#"+that.codeInput).val(seclJsonItem[document.body.jsTools.jsonItem.jsonCode]);
            }
            else
            {
                $(that.ctrl).find("#"+that.valuationInput).val(seclJsonItem[document.body.jsTools.jsonItem.jsonName]);
                $(that.ctrl).find("#"+that.valuationInput).attr("code",seclJsonItem[document.body.jsTools.jsonItem.jsonCode]);
                if (that.codeInput != null)
                    $(that.ctrl).find("#"+that.codeInput).val(seclJsonItem[document.body.jsTools.jsonItem.jsonCode]);
            }
        }else{
            if (that.parentCtrl){
                $(that.parentCtrl).find("#"+that.valuationInput).val("");
                $(that.parentCtrl).find("#"+that.valuationInput).attr("code","");
                $(that.parentCtrl).find("#"+that.codeInput).val("");
            } else
            {
                $(that.ctrl).find("#"+that.codeInput).val("");
                $(that.ctrl).find("#"+that.valuationInput).val("");
                $(that.ctrl).find("#"+that.valuationInput).attr("code","");
            }

        }

        $("#coveredCustDIV").remove();
        document.body.jsTools.after();
        that.parentCtrl = null;
    });
    $( this.jsCtrl.messageCtrl).find(".btnSecond").click(function(){
        $("#coveredCustDIV").remove();
    });
    $( this.jsCtrl.messageCtrl).find(".closebtn").click(function(){
        $("#coveredCustDIV").remove();
    })
}
function clsMessageBoxTip$cssCreate(){
    var styleTag = document.createElement("link");
    styleTag.setAttribute('type', 'text/css');
    styleTag.setAttribute('rel', 'stylesheet');
    styleTag.setAttribute('href', "/sdapstatic/auctionPlat/common/css/toolCommon.css");
    $("head")[0].appendChild(styleTag);
}
//弹出窗口模板
function clsMessageBoxTip$template() {
    var jsonName=this.json.jsonName;
    var jsonCode=this.json.jsonCode;
    var name=this.nameStr.name;
    var nameCode=this.nameStr.nameCode;
    var reqPath=this.reqPath;
    var searchBtn=this.searchBtn;
    var tableId=this.messageCtrl;
    var template="template"+this.objId;
    var reqparam = this.reqParam;
    var iscustomerFlag = null;
    this.html = this.html + "<div id='messageBoxWin' class='popup-cust' style='z-index:3000000003;'>";
    this.html = this.html + "<div class='title'>";
    this.html = this.html + "<h2>"+this.titleName+"</h2>";
    this.html = this.html + "<div>";
    this.html = this.html + "<a class='min' href='javascript:;' title='最小化' style='display:none;'></a>";
    this.html = this.html + "<a class='max' href='javascript:;' title='最大化' style='display:none;'></a>";
    this.html = this.html + "<a class='revert' href='javascript:;' title='还原' style='display:none;'></a>";
    this.html = this.html + "<a class='closebtn' href='javascript:;' title='关闭'></a>";
    this.html = this.html + "</div>";
    this.html = this.html + "</div>";
    this.html = this.html + "<div class='content' id='custSearch'>";
    for(var key in JSON.parse(this.reqParam)){
        this.html = this.html + '<input type="hidden" id="'+key+'" value="'+JSON.parse(this.reqParam)[key]+'"> ';
        iscustomerFlag = key;
    }
    this.html = this.html + '<span class="lablename fl">编码</span><input type="hidden" id="null"/><input type="text" class="trade_input main-content-input__con fl" style="width:230px !important;min-width: 0px !important;" id="'+jsonCode+'">';
    this.html = this.html + '<span class="lablename ml10 fl">名称</span><input type="text" class="trade_input main-content-input__con fl" style="width:230px !important;min-width: 0px !important;" id="'+jsonName+'">';
    this.html = this.html + '<a href="javascript:;" class="btn-search trade_btn ml50" comtype="searchBtnCtrl" rule="cond" cond="'+jsonCode+','+jsonName+','+iscustomerFlag+'"  uniontableid="custMian_tab"  parentId="custSearch">\n' + '' +
        ' <i class="btn_kind_icon btn_kind_search__icon"></i><span>搜索</span></a>';
    this.html = this.html + '<a href="javascript:;" class="btn-reset trade_btn resetBtn ml10" comtype="clearAllCond" id="clearCond" bindctrlid="'+jsonCode+','+jsonName+'" parentId="custSearch"><i></i>'+
        '<span>重置</span></a>';
    this.html = this.html + '<div style="height: 310px;overflow: auto;" class="pt10"  id="customChoose">';
    this.html = this.html + '<table class="download-template__tab"  reqparam='+reqparam+'  scrollCtrlId="customChoose"  comtype="" method="POST" scrollCtrlId="customChoose"\n' + 'reqpath="'+reqPath+'" templateid="templateCust" id="custMian_tab" bgodd="table-list-even" page="mainPage">';
    this.html = this.html + '<tr class="table-list-header line-header">';
    this.html = this.html + '<th class="table-list-header__th" style="width: 48px"></th>';
    for(var key in this.nameStr){
        this.html = this.html + '<th class="table-list-header__th">'+this.nameStr[key]+'</th>';
    }
    this.html = this.html + '</tr>';
    this.html = this.html + '</div>';
    this.html = this.html + ' <tr id="templateCust" style="display: none" >';
    this.html = this.html + ' <td class="table-header-item table-list-tr__item"><input\n' + 'type="radio" name="custom" class="customin"></td>';
    for(var keyJ in this.json){
        this.html = this.html + '<td class="table-header-item table-list-tr__item" id="'+this.json[keyJ]+'">323</td>';
    }

    this.html = this.html + '</tr>';
    this.html = this.html + '</table>';
    this.html = this.html + '</div>';
    this.html = this.html + '<div class="filepage tcdPageCode mainPage" id="">';
    this.html = this.html + '</div>';
    this.html = this.html + '</div>';
    this.html = this.html + "<div class='btn tc'>";
    this.html = this.html + "<a href='javascript:' class='btnOne btnStyle1 mr10'>确 定</a>";
    if (this.messageType != "success")
        this.html = this.html + "<a href='javascript:' class='btnSecond btnStyle1_1'>返回</a>";
    this.html = this.html + "</div>";
    this.html = this.html + "</div>";
}

function clsMessageBoxTip$after() {

}

$(function(){
    var jsTools=new clsMessageBoxTip();
    // jsTools.init();/
    document.body.jsTools=jsTools;
    $(".trade_inputclose").click(function () {
        this.ctrl = $(this).parents("[clearobjstr]")[0];
        $(this.ctrl).hasClass("disedit") ? "" : $(this).prevAll("input:first").val("");
        if (this.ctrl && !$(this.ctrl).hasClass("disedit")) {
            if (this.ctrl.getAttribute("clearParentId")) {
                this.ctrl.parentdId = this.ctrl.getAttribute("clearParentId");
            }
            if (this.ctrl.getAttribute("clearObjStr")) {
                this.ctrl.clearObj = trim(this.ctrl.getAttribute("clearObjStr")).split(",");
            }
            if (this.ctrl.parentdId && this.ctrl.clearObj) {
                for (var i = 0; i < this.ctrl.clearObj.length; i++) {
                    $("#" + this.ctrl.parentdId).find("#" + this.ctrl.clearObj[i]).val("");
                    if ($("#" + this.ctrl.parentdId).find("#" + this.ctrl.clearObj[i])[0].tagName.toLowerCase() == "select") {
                        $("#" + this.ctrl.parentdId).find("#" + this.ctrl.clearObj[i]).trigger('chosen:updated');
                    }
                }
            }
        }
        tradeInputcloseCallback(this);
    })
});
function tradeInputcloseCallback(obj) {
    //obj.ctrl父盒子
    //obj.ctrl.jsonData  取数据
}