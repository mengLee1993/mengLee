function clsMethodLee(){
    this.requestUrl = {
        "path1":" /user/register"
    };
    this.documentLee = null;
    this.registerType = 0;//注册类型 企业或者个人 0-企业  1-个人
    this.checkDrag = false;//滑动校验标示，是否通过
    this.init = clsMethodLee$init;//初始化页面的展示内容,绑定dom节点
    this.parse = clsMethodLee$parse;//初始化页面的数据
    this.operate = clsMethodLee$operate;//初始化页面的数据
    this.refresh = clsMethodLee$refresh;//刷新页面的数据
}

function clsMethodLee$init(){
    this.enterpriseRegister = $("#enterpriseRegister");//企业注册div
    this.personRegister = $("#personRegister");//个人注册div
    this.submitRegister = $("#submitRegister");//个人||企业注册提交按钮
    this.agreement = $("#agreement");//协议点击查看按钮
    this.registerTypeDom = $("#registerType li");//点击操作切换注册类型
    /*企业级操作*/
    //this.entName = $("#enterpriseRegister #entName");//企业名称
    //this.creditCode = $("#enterpriseRegister #creditCode");//税号名称
    //this.userName = $("#enterpriseRegister #userName");//用户名称
    this.passwordFir = $("#enterpriseRegister #password");//密码
    this.confirmPasswordFir = $("#enterpriseRegister #confirmPassword");//确认密码
    //this.email = $("#enterpriseRegister #email");//电子邮箱
    /*个人用户级操作*/
    //this.userName = $("#personRegister #userName");//用户名
    //this.certNo = $("#personRegister #certNo");//身份证号码
    this.passwordSec = $("#personRegister #password");//密码
    this.confirmPasswordSec = $("#personRegister #confirmPassword");//确认密码
    //this.phoneNo = $("#personRegister #phoneNo");//手机号码
    //this.email = $("#personRegister #email");//电子邮箱
    /*协议按钮*/
    this.agreementSure = $("#agreementSure");//弹框中同意协议按钮
    this.agreementInput = $("#agreementInput");//同意协议的checkbox
    this.parse();
}
function clsMethodLee$parse(){
    //initplugPath($("#tableList")[0],"standardTableCtrl",this.requestUrl.path1,{},"POST");
    initValidate($("#enterpriseRegister")[0]);//初始化校验组件
    $('#dragA').drag();//初始化滑动校验
    this.operate();
}

function clsMethodLee$operate(){
    this.registerTypeDom.on("click",function(){//注册类型切换
        if($(this).attr("nidx") == 0){//企业注册
            document.body.jsLee.registerType = 0;
            //初始化页面
            initTabBox(document.body.jsLee.enterpriseRegister);
        }else{//个人注册
            document.body.jsLee.registerType = 1;
            //初始化页面
            initTabBox(document.body.jsLee.personRegister);
        }
    });

    this.confirmPasswordFir.on("blur",function(){//企业用户确认密码操作
        passwordDiffer(document.body.jsLee.passwordFir,document.body.jsLee.confirmPasswordFir)
    });

    this.confirmPasswordSec.on("blur",function(){//企业用户确认密码操作
        passwordDiffer(document.body.jsLee.passwordSec,document.body.jsLee.confirmPasswordSec)
    });

    this.submitRegister.on("click",function(){//注册提交
        if(checkSubmit()){
            var jsonParam = jsonJoin();
            //getAjaxResult(document.body.jsLee.requestUrl.path1,"POST",jsonParam,"submitCallBack(data)")
            var alertBox=new clsAlertBoxCtrl();
            alertBox.Alert("注册成功!是否跳转登陆页面？","成功提示",1,"","registerTip");
        }
    });

    /*协议操作*/
    this.agreement.on("click",function(){//点击查看协议按钮
        openWin("990","550","agreementPopup",true);
    });

    this.agreementSure.on("click",function(){//弹框同意协议操作
        closePopupWin();
        document.body.jsLee.agreementInput.prop("checked",true);
        document.body.jsLee.submitRegister.removeAttr("disabled").css("background","red");
    });

    this.agreementInput.on("change",function(){//同意协议checkbox选择
        if($(this).is(":checked")){
            document.body.jsLee.submitRegister.removeAttr("disabled").css("background","red");
        }else{
            document.body.jsLee.submitRegister.attr("disabled",true).css("background","#e5e5e5");
        }
    });

}
function clsMethodLee$refresh(){

}

function checkSubmit(){
    if(document.body.jsLee.registerType == 0){//企业enterpriseRegister
        initValidate($("#enterpriseRegister")[0]);
        var valiClass=new clsValidateCtrl();
        if(!valiClass.validateAll4Ctrl("#enterpriseRegister") || !document.body.jsLee.checkDrag || !passwordDiffer(document.body.jsLee.passwordFir,document.body.jsLee.confirmPasswordFir)){
            if(!document.body.jsLee.checkDrag){
                showErrInfoByCustomDiv($("#dragA"),"请滑动校验");
            }
            passwordDiffer(document.body.jsLee.passwordFir,document.body.jsLee.confirmPasswordFir);
            /*if(!passwordDiffer(document.body.jsLee.passwordFir,document.body.jsLee.confirmPasswordFir)){
                passwordDiffer(document.body.jsLee.passwordFir,document.body.jsLee.confirmPasswordFir);
            }*/
            return false;
        }
        return true;
    }else{//个人personRegister
        initValidate($("#personRegister")[0]);
        var valiClass=new clsValidateCtrl();
        if(!valiClass.validateAll4Ctrl("#personRegister") || !document.body.jsLee.checkDrag || !passwordDiffer(document.body.jsLee.passwordSec,document.body.jsLee.confirmPasswordSec)){
            if(!document.body.jsLee.checkDrag){
                showErrInfoByCustomDiv($("#dragB"),"请滑动校验");
            }
            passwordDiffer(document.body.jsLee.passwordSec,document.body.jsLee.confirmPasswordSec);
            /*if(!passwordDiffer(document.body.jsLee.passwordSec,document.body.jsLee.confirmPasswordSec)){
                passwordDiffer(document.body.jsLee.passwordSec,document.body.jsLee.confirmPasswordSec);
            }*/
            return false;
        }
        return true;
    }

}

function validatePass(handler,text,drag){//滑动校验成功返回函数
    document.body.jsLee.checkDrag = true;
}

//按照组件重新编写div校验
function showErrInfoByCustomDiv(elem,error)
{
    $(elem).poshytip({
        className: 'tip-twitter',
        showOn: 'none',
        alignTo: 'target',
        alignX: 'right',
        alignY: 'inner-right',
        content:error,
        offsetX: 5,
        offsetY: -30,
        autoHide:true,
        hideTimeout:5000
    });
    $(elem).poshytip('hide');
    $(elem).poshytip('show');
}

function passwordDiffer(a,b){//校验两次密码是否一致   a——首次输入密码  b——再次验证密码
    if(!b.val()){
        showErrInfoByCustomDiv(b,"必填选项!");
        return false;
    }else if(a.val() != b.val()){
        showErrInfoByCustomDiv(b,"两次密码输入不一致!");
        return false;
    }
    return true;
}

function jsonJoin(){//拼接注册入参
    var jsonParam = {"entName":"","creditCode":"","userName":"","password":"","confirmPassword":"","email":"","phoneNo":"","certNo":"","custType":""}
    if(document.body.jsLee.registerType == 0){//企业注册
        jsonParam.custType = 1;
        getValue4Desc(jsonParam,document.body.jsLee.enterpriseRegister[0]);
    }else{//个人注册
        jsonParam.custType = 2;
        getValue4Desc(jsonParam,document.body.jsLee.personRegister[0]);
    }
    return jsonParam;
}

function submitCallBack(data){//注册返回函数
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        //注册成功跳转登陆页面;
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert("注册成功!是否跳转登陆页面？","成功提示",1,"","registerTip");

    }else{
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert(data.retDesc,"失败提示",1,"","registerErrTip");
    }

}

function initTabBox(dom){//tab切换，初始化页面
    //初始化校验组件
    initValidate(dom[0]);
    //初始化滑动校验
    if(dom.attr("id") == "enterpriseRegister"){//企业
        $('#dragA').html("");
        $('#dragA').drag();
    }else{//个人
        $('#dragB').html("");
        $('#dragB').drag();
    }
    document.body.jsLee.checkDrag = false;
    //初始化注册按钮
    document.body.jsLee.agreementInput.prop("checked",false);
    document.body.jsLee.submitRegister.attr("disabled",true).css("background","#e5e5e5");
    //初始化页面input信息
    dom.find("input").each(function(){
        $(this).val("");
    });
}

function clsAlertBoxCtrl$sure() {//注册成功弹框确定，跳转页面
    if (this.id == "registerTip") {//注册成功
        closePopupWin();
        jumpUrl("login.html","0000000",0);
    }else if(this.id == "registerErrTip"){
        closePopupWin();
    }
}

$(function(){
    //初始化自己封装方法
    var methodLee = new clsMethodLee();
    document.body.jsLee = methodLee;
    methodLee.init();
});