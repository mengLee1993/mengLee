function clsMethodLee(){
    this.requestUrl = {
        "path1":"/password/modifyPassword"
    };
    this.documentLee = null;
    this.init = clsMethodLee$init;//初始化页面的展示内容,绑定dom节点
    this.parse = clsMethodLee$parse;//初始化页面的数据
    this.operate = clsMethodLee$operate;//初始化页面的数据
    this.refresh = clsMethodLee$refresh;//刷新页面的数据
}

function clsMethodLee$init(){
    //新建用户dom
    this.passwordNew = $("#passwordNew");//修改密码整体div;
    this.password = $("#password");//新密码input;
    this.confirmPassword = $("#confirmPassword");//确认密码;
    this.submitSure = $("#submitSure");//修改密码提交按钮;
    this.parse();
}
function clsMethodLee$parse(){
    initValidate(document.body.jsLee.passwordNew[0]);//初始化校验组件
    this.operate();
}

function clsMethodLee$operate(){
    this.confirmPassword.on("blur",function(){//确认密码是否一致
        passwordDiffer(document.body.jsLee.password,$(this));
    });

    this.submitSure.on("click",function(){//修改密码提交操作;
        if(submitCheck()){
            var jsonParam = {"userName":"","oldPassword":"","password":""};
            getValue4Desc(jsonParam,document.body.jsLee.passwordNew[0]);
            //getAjaxResult(document.body.jsLee.requestUrl.path1,"POST",jsonParam,"submitCallBack(data)");
            var alertBox=new clsAlertBoxCtrl();
            alertBox.Alert("修改密码成功","成功提示",1,"","passwordTip");
        }

    });

}
function clsMethodLee$refresh(){

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

function submitCheck(){//修改密码提交校验
    initValidate($("#passwordNew")[0]);
    var valiClass=new clsValidateCtrl();
    if(!valiClass.validateAll4Ctrl("#passwordNew") || !passwordDiffer(document.body.jsLee.password,document.body.jsLee.confirmPassword)){
        if(!passwordDiffer(document.body.jsLee.password,document.body.jsLee.confirmPassword)){
            passwordDiffer(document.body.jsLee.password,document.body.jsLee.confirmPassword)
        }
        return false;
    }
    return true;
}

function submitCallBack(data){//修改密码成功接口返回
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert("修改密码成功","成功提示",1,"","passwordTip");
    }else {
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert(data.retDesc,"失败提示",1,"","passwordErrTip");
    }
}

function clsAlertBoxCtrl$sure() {//修改密码成功弹框确定
    if (this.id == "passwordTip") {//修改密码成功
        closePopupWin();
    }else if(this.id == "passwordErrTip"){//修改密码失败
        closePopupWin();
    }
}

$(function(){
    //初始化自己封装方法
    var methodLee = new clsMethodLee();
    document.body.jsLee = methodLee;
    methodLee.init();
});