function clsMethodLee(){
    this.requestUrl = {
        "path1":"/user/login"//登陆接口
    };
    this.documentLee = null;
    this.checkMark = false;//滑动校验标示
    this.init = clsMethodLee$init;//初始化页面的展示内容,绑定dom节点
    this.parse = clsMethodLee$parse;//初始化页面的数据
    this.operate = clsMethodLee$operate;//初始化页面的数据
    this.refresh = clsMethodLee$refresh;//刷新页面的数据
    this.checkSure = false;
}

function clsMethodLee$init(){
    $('#drag').drag();
    this.userName = $("#js-input--username");//用户名input节点
    this.password = $("#js-input-password");//密码input节点
    this.errorHint = $("#js-loginFrom__errorHint--hide");//错误提示节点
    this.errorHintText = $("#js-loginFrom__hintContent");//错误提示错误信息展示节点
    this.hideErrContent = $("#hideErrContent");//关闭错误提示按钮节点
    this.loginBtn = $("#js-login__btn--login");//登录按钮节点
    this.hideErrContentText = {"msg1":"用户名不能为空","msg2":"密码不能为空"};

    this.parse();
}
function clsMethodLee$parse(){
    //initplugPath($("#tableList")[0],"standardTableCtrl",this.requestUrl.path1,{},"POST");
    this.operate();
}

function clsMethodLee$operate(){
    this.userName.on("focus",function(){//用户名获取焦点操作
        document.body.jsLee.errorHint.hide();
    });
    this.userName.on("blur",function(){//用户名失去焦点操作
        if($(this).val() == ""){
            document.body.jsLee.errorHintText.html(document.body.jsLee.hideErrContentText.msg1);
            document.body.jsLee.errorHint.show();
            checkInput();
        }
    });
    this.password.on("focus",function(){//密码获取焦点操作
        document.body.jsLee.errorHint.hide();
    });
    this.password.on("blur",function(){//密码失去焦点操作
        if($(this).val() == ""){
            document.body.jsLee.errorHintText.html(document.body.jsLee.hideErrContentText.msg2);
            document.body.jsLee.errorHint.show();
        }
        checkInput();
    });
    this.loginBtn.on("click",function(){//提交按钮操作
        var jsonParam = {"acctId":document.body.jsLee.userName.val(),"password":document.body.jsLee.password.val()};
        //getAjaxResult(document.body.jsLee.requestUrl.path1,"POST",jsonParam,"submitCallBack(data)")
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert("登陆成功","成功提示",1,"","loginTipTip");
    });
    this.hideErrContent.on("click",function(){
        document.body.jsLee.errorHint.hide();
    });


}
function clsMethodLee$refresh(){

}

//已有数组，初始化插件;
function initplugData(docm,comType,data){
    $(docm).attr("comType",comType);
    docm.data = {"rspBody":{"resultData":data}};
    document.body.jsCtrl.ctrl = docm;
    document.body.jsCtrl.init();
}
//未知数组，已有接口，初始化插件;
function initplugPath(docm,comType,reqPath,reqParam,reqMethod){
    if(reqPath != null){
        $(docm).attr("reqPath",reqPath);
    }
    if(reqParam != null){
        $(docm).attr("reqParam",JSON.stringify(reqParam));
    }
    if(reqMethod != null){
        $(docm).attr("reqMethod",reqMethod);
    }
    $(docm).attr("comType",comType);
    document.body.jsCtrl.ctrl = docm;
    document.body.jsCtrl.init();
}

function validateBefore(){//滑动校验前的操作
    document.body.jsLee.errorHint.hide();
}

function validatePass(handler,text,drag){//滑动校验成功返回函数
    document.body.jsLee.checkMark = true;
    checkInput();
}

function checkInput(){//校验输入信息
    if(checkInput && $("#js-input--username").val() && $("#js-input-password").val()){
        $("#js-login__btn--login").prop("disabled",false).css("background","red");
    }else{
        $("#js-login__btn--login").prop("disabled",true).css("background","#e5e5e5");
    }
}

function submitCallBack(data){
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert("登陆成功","成功提示",1,"","loginTipTip");
    }else {
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert(data.retDesc,"失败提示",1,"","loginTipErrTip");
    }
}

function clsAlertBoxCtrl$sure() {//登陆成功弹框确定
    if (this.id == "loginTip") {//登陆成功
        closePopupWin();
    }else if(this.id == "loginTipErrTip"){//登陆失败
        closePopupWin();
    }
}

$(function(){
    //初始化自己封装方法
    var methodLee = new clsMethodLee();
    document.body.jsLee = methodLee;
    methodLee.init();
});