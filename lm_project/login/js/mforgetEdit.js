/*页面初始化网址必传信息userId——用户id  phoneNo——手机号  email——邮箱号  userType——企业和用户标示  skipHtml——是否为邮箱验证跳转页面*/
function clsMethodLee(){
    this.requestUrl = {
        "path1":"/password/send",//发送邮件或者接收短信接口
        "path2":"/password/validateCode",//发送邮件或者接收短信接口
        "path3":"/password/restPassword"//发送邮件或者接收短信接口
    };
    this.documentLee = null;
    this.userId = GetQueryString("userId");//用户id
    this.userType = GetQueryString("userType");//初始化找回密码的用户类型 1——企业 2——个人
    this.skipHtml = GetQueryString("skipHtml");//是否由邮箱发送，跳转回页面修改密码  1——是  0——否
    this.editWay = 0;//验证方式 0——邮箱  1——手机号
    this.stepIndex = 1;//头部定位第几步
    this.checkDrag = false;//是否欢动校验成功
    this.init = clsMethodLee$init;//初始化页面的展示内容,绑定dom节点
    this.parse = clsMethodLee$parse;//初始化页面的数据
    this.operate = clsMethodLee$operate;//初始化页面的数据
    this.refresh = clsMethodLee$refresh;//刷新页面的数据
}

function clsMethodLee$init(){
    /*第一步*/
    this.firstStep = $("#firstStep");//第一步
    this.phoneNo = $("#phoneNo");//第一步渲染的手机号码
    this.email = $("#email");//第一步渲染的邮箱
    this.selectWayBox = $("#selectWayBox");//选择验证方式外层div，操作是否显示,若为企业只有邮箱一种验证方式
    this.selectWay = $("#selectWay");//选择验证方式按钮
    this.emailWay = $("#emailWay");//邮箱验证内容
    this.phoneWay = $("#phoneWay");//手机验证内容
    this.getCode = $("#getCode");//获取短信验证码
    this.nextFir = $("#firstStep #nextStep");//第一步下一步按钮
    /*第二步*/
    this.secondStep = $("#secondStep");//第二步
    this.passwordReset = $("#passwordReset");//第二步整体div
    this.confirmPassword = $("#confirmPassword");//确认密码input节点
    this.nextSec = $("#secondStep #nextStep");//第二步下一步按钮
    /*第三步*/
    this.thirdStep = $("#thirdStep");//第三步


    this.parse();
}
function clsMethodLee$parse(){
    if(this.skipHtml == 1){//邮箱验证，跳转页面
        setpInit(2);
        document.body.jsLee.firstStep.hide();
        document.body.jsLee.secondStep.show();
        document.body.jsLee.stepIndex = 2;
        initValidate(document.body.jsLee.passwordReset[0]);//初始化校验组件
    }
    //判断为企业时，只有一种修改密码方式
    if(this.userType == 1){//企业
        this.selectWayBox.html("邮箱验证").css("text-indent","15px");
    }else{//个人
        //初始化选择方式下拉框
        this.selectWay.chosen({
            no_results_text: "暂无结果",
            width: "340PX",
            enable_split_word_search: false,
            placeholder_text_single: '邮箱验证',
        });
    }

    //初始滑动校验
    $('#dragA').html("");
    $('#dragA').drag();

    //初始化邮箱和手机号
    this.phoneNo.html(GetQueryString("phoneNo"));
    this.email.html(GetQueryString("email"));

    this.operate();
}

function clsMethodLee$operate(){
    /*第一步*/
    this.selectWay.on("change",function(){//验证方式选择变化
        initTabBox($(this));
    });

    this.getCode.on("click",function(){//验证短信验证码操作
        if(submitCheck(document.body.jsLee.stepIndex,2)){
            var jsonParam = {"userId":document.body.jsLee.userId,"status":1};//0——邮箱  1——短信
            //getAjaxResult(document.body.jsLee.requestUrl.path1,"POST",jsonParam,"phoneCallBack(data)");
            setVeriyCodeInterval();
        }
    });

    this.nextFir.on("click",function(){//第一步下一步操作
        if(submitCheck(document.body.jsLee.stepIndex,document.body.jsLee.editWay)){
            if(document.body.jsLee.editWay == 0){//邮箱修改 不跳转下一步
                var jsonParam = {"userId":document.body.jsLee.userId,"status":0};//0——邮箱  1——短信
                //getAjaxResult(document.body.jsLee.requestUrl.path1,"POST",jsonParam,"emailCallBack(data)");
                var alertBox=new clsAlertBoxCtrl();
                alertBox.Alert("请登陆邮箱验证","成功提示",0);
            }else{//手机号修改 跳转下一步
                var jsonParam = {"userId":document.body.jsLee.userId,"valiCode":$("#valiCode").val()};
                //getAjaxResult(document.body.jsLee.requestUrl.path2,"POST",jsonParam,"valiCodeCallBack(data)");
                setpInit(2);
                document.body.jsLee.firstStep.hide();
                document.body.jsLee.secondStep.show();
                document.body.jsLee.stepIndex = 2;
                initValidate(document.body.jsLee.passwordReset[0]);//初始化校验组件
            }
        }
    });

    /*第二步*/
    this.confirmPassword.on("blur",function(){//确认密码校验
        passwordDiffer($("#password"),$(this));
    });

    this.nextSec.on("click",function(){//第二步下一步操作
        if(submitCheck(document.body.jsLee.stepIndex)){
            var jsonParam = {"userId":document.body.jsLee.userId,"password":$("#password").val()};
            //getAjaxResult(document.body.jsLee.requestUrl.path3,"POST",jsonParam,"passwordCallBack(data)");
            setpInit(3);
            document.body.jsLee.secondStep.hide();
            document.body.jsLee.thirdStep.show();
            document.body.jsLee.stepIndex = 3;
        }
    });
}
function clsMethodLee$refresh(){

}

function submitCheck(index,editWay){//下一步操作校验每一步   editWay——第一步修改方式0-邮箱 1—手机号
    if(index == 1 && editWay == 0){//第一步邮箱验证
        if(!document.body.jsLee.checkDrag){
            showErrInfoByCustomDiv($("#dragA"),"请滑动校验");
            return false;
        }
        return true;
    }else if(index == 1 && editWay == 1){//第一步手机号验证
        initValidate($("#phoneWay")[0]);
        var valiClass=new clsValidateCtrl();
        if(!valiClass.validateAll4Ctrl("#phoneWay") || !document.body.jsLee.checkDrag){
            if(!document.body.jsLee.checkDrag){
                showErrInfoByCustomDiv($("#dragB"),"请滑动校验");
            }
            return false;
        }
        return true;
    }else if(index == 1 && editWay == 2){
        if(!document.body.jsLee.checkDrag){
            showErrInfoByCustomDiv($("#dragB"),"请滑动校验");
            return false;
        }
        return true;
    }else if(index == 2){//第二步校验
        initValidate($("#secondStep")[0]);
        var valiClass=new clsValidateCtrl();
        if(!valiClass.validateAll4Ctrl("#secondStep") || !passwordDiffer($("#password"),$("#confirmPassword"))){
            if(!passwordDiffer($("#password"),$("#confirmPassword"))){
                passwordDiffer($("#password"),$("#confirmPassword"));
            }
            return false;
        }
        return true;
    }
}

function setpInit(index){
    $("*[comType=stdProgressBar]").attr("curstep",index);
    document.body.jsCtrl.ctrl = $("*[comType=stdProgressBar]")[0];
    document.body.jsCtrl.init();
}

function validatePass(handler,text,drag){//滑动校验成功返回函数
    document.body.jsLee.checkDrag = true;
}

function setVeriyCodeInterval (){// 60秒后重新获取
    var num = 60;
    oTimer = setInterval(function(){
        num--;
        if (num > 0 ) {
            $("#getCodeTime").show().html("重新发送("+num+")");
        }else{
            $("#getCodeTime").hide();
            clearInterval(oTimer);
        }
    },1000)

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

function emailCallBack(data){//邮箱验证发送成功接口返回
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert("请登陆邮箱验证","成功提示",0);
    }else{
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert(data.retDesc,"失败提示",0);
    }
}

function phoneCallBack(data){//短信验证发送成功接口返回
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        setVeriyCodeInterval();
    }else{
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert(data.retDesc,"失败提示",0);(data.retDesc);
    }
}

function valiCodeCallBack(data){//手机输入手机验证码后，验证码校验接口返回
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        setpInit(2);
        document.body.jsLee.firstStep.hide();
        document.body.jsLee.secondStep.show();
        document.body.jsLee.stepIndex = 2;
        initValidate(document.body.jsLee.passwordReset[0]);//初始化校验组件
    }else{
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert(data.retDesc,"失败提示",0);
    }
}

function initTabBox(dom){//手机验证和邮箱验证切换，初始化页面
    if(dom.find("option:selected").val() == "0"){//邮箱
        document.body.jsLee.emailWay.show();
        document.body.jsLee.phoneWay.hide();
        $('#dragA').html("");
        $('#dragA').drag();
        document.body.jsLee.editWay = 0;
        document.body.jsLee.checkDrag = false;
    }else{//手机号
        document.body.jsLee.phoneWay.show();
        document.body.jsLee.emailWay.hide();
        $('#dragB').html("");
        $('#dragB').drag();
        document.body.jsLee.editWay = 1;
        document.body.jsLee.checkDrag = false;
        initValidate($("#phoneWay")[0]);
    }
}

function passwordCallBack(data){//重置密码接口返回
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        setpInit(3);
        document.body.jsLee.secondStep.hide();
        document.body.jsLee.thirdStep.show();
        document.body.jsLee.stepIndex = 3;
    }else{
        var alertBox=new clsAlertBoxCtrl();
        alertBox.Alert(data.retDesc,"失败提示",0);
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