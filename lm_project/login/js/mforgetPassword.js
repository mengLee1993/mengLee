function clsMethodLee(){
    this.requestUrl = {
        "path1":"/password/account"
    };
    this.documentLee = null;
    this.checkDrag = false;//滑动校验标识
    this.init = clsMethodLee$init;//初始化页面的展示内容,绑定dom节点
    this.parse = clsMethodLee$parse;//初始化页面的数据
    this.operate = clsMethodLee$operate;//初始化页面的数据
    this.refresh = clsMethodLee$refresh;//刷新页面的数据
}

function clsMethodLee$init(){
    //新建用户dom
    this.nextStep = $("#nextStep");//提交按钮
    this.registerBox = $("#registerBox");//html整体盒子

    this.parse();
}
function clsMethodLee$parse(){
    //initplugPath($("#tableList")[0],"standardTableCtrl",this.requestUrl.path1,{},"POST");
    initValidate($("#registerBox")[0]);//初始化校验组件
    $("#drag").html("");
    $('#drag').drag();//初始化滑动校验
    this.operate();
}

function clsMethodLee$operate(){
    this.nextStep.on("click",function(){//提交操作
        if(checkSubmit()){
            var jsonParam = {"userName":$("#userName").val()};
           // getAjaxResult(document.body.jsLee.requestUrl.path1,"POST",jsonParam,"submitCallBack(data)");
            jumpUrl("forgetEdit.html?skipHtml=0&userId=" + 1 + "&userType=" + 1 + "&phoneNo=" + 1 + "&email=" + 1,data.retCode,0);
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

function validatePass(handler,text,drag){//滑动校验成功返回函数
    document.body.jsLee.checkDrag = true;
}

function checkSubmit(){
    initValidate($("#registerBox")[0]);
    var valiClass=new clsValidateCtrl();
    if(!valiClass.validateAll4Ctrl("#registerBox") || !document.body.jsLee.checkDrag){
        if(!document.body.jsLee.checkDrag){
            showErrInfoByCustomDiv($("#drag"),"请滑动校验");
        }
        return false;
    }
    return true;

}

function submitCallBack(data){//下一步找回密码操作接口返回
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        var dataResult = data.rspBody;
        //校验用户名操作成功，跳转忘记密码修改页面
        /*页面初始化网址必传信息
          phoneNo——手机号
          email——邮箱号
          userType——企业和用户标示
          skipHtml——是否为邮箱验证跳转页面*/
        jumpUrl("forgetEdit.html?skipHtml=0&userId=" + dataResult.userId + "&userType=" + dataResult.userType + "&phoneNo=" + dataResult.phoneNo + "&email=" +dataResult.email,data.retCode,0);
    }else{
        alert(data.retDesc);
    }
}

$(function(){
    //初始化自己封装方法
    var methodLee = new clsMethodLee();
    document.body.jsLee = methodLee;
    methodLee.init();
});