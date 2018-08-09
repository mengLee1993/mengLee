function clsMethodLee(){
    this.requestUrl = {
        "path1":"/sysAcct/sysAcctList", //用户管理列表查询
        "path2":"/sysAcct/sysAcctDeleteById",//用户管理列表删除接口
        "path3":"/sysAcct/sysAcctDiscontinuation",//用户管理列表停用接口
        "path4":"/roleInfo/roleRoleAcctInfo",//用户管理查看角色接口
        //"path5":"/sysAcct/sysAcctToRoleInfoDelete",//用户管理查看角色接口-删除接口;
        "path5":"/sysAcct/deleteSysAcct2Role2",//用户管理查看角色接口-删除接口;

        "path6":"/sysAcct/sysAcctToRoleInfoAdd",//用户管理查看角色接口-添加接口;
        "path7":"/sysAcct/sysAcctAddUser",//用户管理新建用户接口;
        "path8":"/roleInfo/roleInfoAllLike",//新建用户，获取角色列表集合
        "path9":"/orgInfo/getListTreeOrgInfo"//新建用户，获取组织集联列表集合
    };
    this.acctType = ""; 
    this.userAcctId = "";
    this.useNewOrEdit = 0;//0-新建，1-编辑
    this.submitJson = {};//新建用户参数;
    this.cacheJson = {};//用户列表删除，禁用  缓存当前标示;
    this.editListMark = 0;//0-新建  1-修改用户list
    this.cacheJson2 = {};//角色列表删除，添加  缓存当前标示;
    this.organizationjoinId = "";//新建用户时，选择角色需要获取当前选择组织的id组合查询角色;
    this.organizationlastId = "";//新建用户时，选择组织需要获取当前选择组织的末级id
    this.userId = "";//缓存当前管理员所属组织id   个人与企业标示
    this.documentLee = null;
    this.init = clsMethodLee$init;//初始化页面的展示内容,绑定dom节点
    this.parse = clsMethodLee$parse;//初始化页面的数据
    this.operate = clsMethodLee$operate;//初始化页面的数据
    this.refresh = clsMethodLee$refresh;//
}

function clsMethodLee$init(){
    //新建用户dom
    this.userNew = $("#userNew");
    //新建用户弹框中确认dom
    this.userNewSure = $("#userNewSure");
    //新建用户弹框选择组织按钮input
    this.organizationShow = $("#selectOrganization");
    //新建用户弹框选择角色按钮input
    this.roleShow = $("#selectRole");
    //新建用户弹框选择角色后的确认按钮
    this.roleSelectSure = $("#roleSelectSure");
    //新建用户弹框选择角色后的取消按钮
    this.roleSelectCancel = $("#roleSelectCancel");
    //新建用户弹框选择组织后的确认按钮
    this.organizationSelectSure = $("#organizationSelectSure");
    //新建用户弹框选择组织后的取消按钮
    this.organizationSelectCancel = $("#organizationSelectCancel");
    //新建用户中重置密码
    this.resetPassWord = $("#resetPassWord");
    this.parse();
}
function clsMethodLee$parse(){
    //判断是个人用户还是企业用户
    this.userId = $.cookie("orgId");
    //判断是否用户是否是超级管理员
    this.acctType = $.cookie("acctType");
    if(this.userId.length == "11"){
        $(".userNewPopup-ulist-listPosition").eq(0).remove();
    }
    if(this.acctType == 0){
        $(".userNewPopup-ulist-listPosition").eq(1).remove();
    }
    if($("#tableList").attr("reqParam")){
        var jsonParam = JSON.parse($("#tableList").attr("reqParam"));
    }else{
        var jsonParam = {};
    }
    jsonParam.acctType = document.body.jsLee.acctType;
    jsonParam.oInfoId = document.body.jsLee.userId;
    initplugPath($("#tableList")[0],"standardTableCtrl",this.requestUrl.path1,jsonParam,"POST");
    this.operate();
}

function clsMethodLee$operate(){
    this.userNew.on("click",function(){//新建用户点击操作
        document.body.jsLee.editListMark = 0;
        openWin("600","500","userNewPopup",true);
        $("#selectOrganizationPopup").hide();
        $("#selectRolePopup").hide();
        $("#userNewPopup h2").html("新增用户");
        document.body.jsLee.useNewOrEdit = 0;
        clearPopup(0);
        //重新赋值请求组织的末级id
        document.body.jsLee.organizationlastId = "";
        document.body.jsLee.organizationjoinId = "";
        $("#selectOrganization").attr("orgidnamearr",JSON.stringify([]));
        $("#selectRole").attr("roleids",JSON.stringify([]));
    });

    this.userNewSure.on("click",function(){//新建||编辑用户提交操作
        //获取提交入参json数据
        if(submitChek()){
            var jsonParam = {"acctTitle":"","acctPassword":"","name":"","mobilePhone":"","email":""};
            getValue4Desc(jsonParam,$("#userNewPopup")[0]);
            if(document.body.jsLee.editListMark == 0){//新建操作
                jsonParam.acctId = "";
            }else{
                jsonParam.acctId = $(this).attr("acctId");
            }
            if(document.body.jsLee.userId.length == 11){
                jsonParam.oInfoId = document.body.jsLee.userId;
            }else{
                jsonParam.oInfoId = document.body.jsLee.organizationlastId;
            }
            if(document.body.jsLee.acctType == 0){
                jsonParam.acctType = 1;
            }else if(document.body.jsLee.acctType == 1){
                 jsonParam.acctType = 2;
            }

            jsonParam.roleIds = $("#selectRole").attr("roleids") ? JSON.parse($("#selectRole").attr("roleids")) : [];
            getAjaxResult(document.body.jsLee.requestUrl.path7,"POST",jsonParam,"submitCallBack(data)")
        }
    });

    this.organizationShow.on("click",function(){//弹框 组织显示
        if($("#selectOrganizationPopup").is(":hidden")){
            $("#selectOrganizationPopup").show();
            $("#selectRolePopup").hide();

            //复现当前所选组织
            orgistClear();//清空小title组织显示
            var orgIdNameArr = $("#selectOrganization").attr("orgIdNameArr") ? JSON.parse($("#selectOrganization").attr("orgIdNameArr")) : [];
            for(var nI = 0; nI < orgIdNameArr.length; nI++ ){
                createRow(orgIdNameArr[nI].orgId,orgIdNameArr[nI].orgName);
            }

            //初始化页面组织集联数据
           /* if(!document.body.jsLee.organizationjoinId){
                jsonParam.id = document.body.jsLee.userId;
            }else{
                jsonParam.id = document.body.jsLee.organizationlastId;
            }*/
            if($("#organizationList").attr("reqParam")){
                var jsonParam = JSON.parse($("#organizationList").attr("reqParam"));
            }else{
                var jsonParam = {};
            }
            jsonParam.id2 = document.body.jsLee.userId;
            jsonParam.id = document.body.jsLee.organizationlastId;
            initplugPath($("#organizationList")[0],"standardTableCtrl",document.body.jsLee.requestUrl.path9,jsonParam,"POST")
        }else{
            $("#selectOrganizationPopup").hide();
        }
    });

    this.roleShow.on("click",function(){//弹框 角色显示
        if($("#selectRolePopup").is(":hidden")){
            $("#selectRolePopup").show();
            var jsonParam = {};
            // 如果没有选择组织结构的话，需要把当前页面的管理员id回传;
            if(!document.body.jsLee.organizationjoinId){
                jsonParam.orgId = document.body.jsLee.userId;
            }else{
                jsonParam.orgId = document.body.jsLee.organizationlastId;
            }
            getAjaxResult(document.body.jsLee.requestUrl.path8,"POST",jsonParam,"roleListCallBack(data)")
        }else{
            $("#selectRolePopup").hide();
        }
    });
    this.roleSelectCancel.on("click",function() {//新建用户弹框选择完组织后取消按钮
        $("#selectRolePopup").hide();
    });
    this.roleSelectSure.on("click",function(){//新建用户弹框选择完角色后确定按钮
        var htmlText = "";
        var roleIds = [];
        $("#selectRolePopup").find("*[id=cloneList]").each(function(){
            if($(this).find("input[type=checkbox]").is(":checked")){
                htmlText += htmlText == "" ? $(this).find("#roleTitle").html() : "," + $(this).find("#roleTitle").html();
                roleIds.push($(this).find("#roleTitle").attr("roleId"));
            }
        });
        $("#selectRole").html(htmlText).attr("roleIds",JSON.stringify(roleIds));
        $("#selectRolePopup").hide();
    });

    this.organizationSelectCancel.on("click",function() {//新建用户弹框选择完组织后取消按钮
        $("#selectOrganizationPopup").hide();
    });
    this.organizationSelectSure.on("click",function(){//新建用户弹框选择完组织后确定按钮
        //修改组织对角色重新赋值
        var arr = JSON.parse($("#selectOrganization").attr("orgidnamearr"));
        if(arr.length > 0){
            if(arr[arr.length-1].orgId != document.body.jsLee.organizationlastId){
                $("#selectRole").attr("roleids",JSON.stringify([])).html("");
            }
        }
        //对组织显示div重新赋值
        var htmlText = "";
        var orgIdNameArr = [];
        $("#selectOrganizationPopup *[id=cloneList]").each(function(){
            htmlText += htmlText == "" ? $(this).find("#orgNameShow").html() : "," + $(this).find("#orgNameShow").html();
            orgIdNameArr.push({"orgId":$(this).attr("idmark"),"orgName":$(this).find("#orgNameShow").html()});
        });
        $("#selectOrganization").html(htmlText);
        //为复现数据  显示弹框内容做数据缓存
        $("#selectOrganization").attr("orgIdNameArr",JSON.stringify(orgIdNameArr));
        $("#selectOrganizationPopup").hide();
    });

    this.resetPassWord.on("click",function(){//重置密码
        $("#acctPassword").val("123456");
    });

}
// 插件
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

//渲染table每一行
function clsStandardTableCtrl$progress(jsonItem, cloneRow) {
    if(this.ctrl.id == "tableList"){//页面用户列表

        //进行赋值操作
        $(cloneRow).find("#nameDatil").html(jsonItem.name);

        //禁用，启用判断
        if(jsonItem.status == 0){
            $(cloneRow).find("#disableOperate").html("禁用");
        }else{
            $(cloneRow).find("#disableOperate").html("启用");
        }

        //每一行查看操作
        $(cloneRow).find("#viewContent").on("click",function(){
            document.body.jsLee.userAcctId = jsonItem.acctId;
            if($("#roleList").attr("reqParam")){
                var jsonParam = JSON.parse($("#roleList").attr("reqParam"));
            }else{
                var jsonParam = {};
            }
            jsonParam.acctId = jsonItem.acctId;
            jsonParam.orgId = jsonItem.orgId;
            openWin("370","300","userDetailPopup",true);
            initplugPath($("#roleList")[0],"standardTableCtrl",document.body.jsLee.requestUrl.path4,jsonParam,"POST");
        });

        //停用操作||启用操作
        $(cloneRow).find("#disableOperate").on("click",function(){
            var tipHtml = $(this).html();
            var alertBox=new clsAlertBoxCtrl();
            alertBox.Alert("是否执行" + tipHtml + "操作","警告提示",1,"","disableOperate");
            document.body.jsLee.cacheJson = jsonItem.status == 0 ? {"status":1,"acctId":jsonItem.acctId} : {"status":0,"acctId":jsonItem.acctId};
        });
        //删除操作
        $(cloneRow).find("#deleteOperate").on("click",function(){
            var alertBox=new clsAlertBoxCtrl();
            alertBox.Alert("是否执行删除操作","警告提示",1,"","deleteOperate");
            document.body.jsLee.cacheJson = {"acctId":jsonItem.acctId};
        });

        //编辑操作
        $(cloneRow).find("#editOperate").on("click",function(){
            document.body.jsLee.editListMark = 1;
            $("#userNewSure").attr("acctId",jsonItem.acctId);
            openWin("600","500","userNewPopup",true);
            $("#selectOrganizationPopup").hide();
            $("#selectRolePopup").hide();
            $("#userNewPopup h2").html("修改用户");
            clearPopup(1);
            //获取编辑用户的组织信息和角色信息
            var orgInfoJson = jsonItem.orgInfo;
            var orgInfoArr = [];
            operationData({"data":orgInfoJson,"newData":orgInfoArr});
            if(orgInfoArr.length > 0){
                document.body.jsLee.organizationlastId = orgInfoArr[0].id;//组织需要的末级id
            }else{
                document.body.jsLee.organizationlastId = "";//组织需要的末级id
            }
            document.body.jsLee.organizationjoinId = "";
            for(var nI = orgInfoArr.length - 1; nI >= 0; nI-- ){
                document.body.jsLee.organizationjoinId += nI==orgInfoArr.length - 1 ? orgInfoArr[nI].id : "," + orgInfoArr[nI].id;
            }
            valuePopup(jsonItem);
        });

        //用户信息移入操作显示详情
        $(cloneRow).find("#name").parents(".useMange-content-table-content").hover(function(){
            $(this).find(".useMange-contentTableContent-detail").show();
        },function(){
            $(this).find(".useMange-contentTableContent-detail").hide();
        });
    }else if(this.ctrl.id == "roleList"){//角色弹框列表
        if(jsonItem.orAcct == 0){//添加
            $(cloneRow).find("#operateBtn").html("添加");
        }else if(jsonItem.orAcct == 1){//删除
            $(cloneRow).find("#operateBtn").html("删除");
        }
        //添加||删除操作
        $(cloneRow).find("#operateBtn").on("click",function(){
            document.body.jsLee.cacheJson2 = {"acctId":document.body.jsLee.userAcctId,"roleId":jsonItem.roleId};
            if(jsonItem.orAcct == 0){
                document.body.jsLee.cacheJson2.existence = "insert";
                getAjaxResult(document.body.jsLee.requestUrl.path6,"POST",document.body.jsLee.cacheJson2,"disableCallBack(data)")
            }else {
                document.body.jsLee.cacheJson2.existence = "delete";
                getAjaxResult(document.body.jsLee.requestUrl.path5,"POST",document.body.jsLee.cacheJson2,"disableCallBack(data)")
            }
           // closePopupWin();
        });

    }else if(this.ctrl.id == "organizationList"){//组织弹框列表
        $(cloneRow).find("#orgName").attr("markId",jsonItem.id);
        $(cloneRow).find("#orgName").on("click",function(){//点击组织，进行选择，调取下一级的组织列表；集联操作
            document.body.jsLee.organizationlastId = jsonItem.id;
            if($("#organizationList *[id=cloneList]").length == 0){//如果第一个不加","
                document.body.jsLee.organizationjoinId += jsonItem.id;
            }else{
                document.body.jsLee.organizationjoinId += ("," + jsonItem.id);
            }
            //选择后渲染顶部标题面包屑显示
            createRow(jsonItem.id,jsonItem.orgName);
            var jsonParam = {};
            /*if(!document.body.jsLee.organizationjoinId){
                jsonParam.id = document.body.jsLee.userId;
            }else{
                jsonParam.id = document.body.jsLee.organizationlastId;
            }*/
            if($("#organizationList").attr("reqParam")){
                var jsonParam = JSON.parse($("#organizationList").attr("reqParam"));
            }else{
                var jsonParam = {};
            }
            jsonParam.id2 = document.body.jsLee.userId;
            jsonParam.id = document.body.jsLee.organizationlastId;
            //调取下级集联接口
            initplugPath($("#organizationList")[0],"standardTableCtrl",document.body.jsLee.requestUrl.path9,jsonParam,"POST")
        });
    }
}

//弹框点击确定返回函数
function clsAlertBoxCtrl$sure() {
    if (this.id == "disableOperate") {//禁用操作
        closePopupWin();
        getAjaxResult(document.body.jsLee.requestUrl.path3,"POST",document.body.jsLee.cacheJson,"disableCallBack(data)")
    }else if(this.id == "deleteOperate"){//删除操作
        closePopupWin();
        getAjaxResult(document.body.jsLee.requestUrl.path2,"POST",document.body.jsLee.cacheJson,"deleteCallBack(data)")
    }
}

//用户列表禁用操作成功回调
function disableCallBack(data){
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        if($("#tableList").attr("reqParam")){
            var jsonParam = JSON.parse($("#tableList").attr("reqParam"));
        }else{
            var jsonParam = {};
        }
        initplugPath($("#tableList")[0],"standardTableCtrl",this.requestUrl.path1,jsonParam,"POST");
    }
}

//用户列表删除操作成功回调
function deleteCallBack(data){
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        if($("#tableList").attr("reqParam")){
            var jsonParam = JSON.parse($("#tableList").attr("reqParam"));
        }else{
            var jsonParam = {};
        }
        initplugPath($("#tableList")[0],"standardTableCtrl",this.requestUrl.path1,jsonParam,"POST");
    }
}
//新建用户时选择角色时候，角色列表渲染回调函数;
function roleListCallBack(data){
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        $("#selectRolePopup").find("*[id=cloneList]").each(function(){
            $(this).remove();
        });
        var jsonItem = data.rspBody;
        for(var nI = 0; nI < jsonItem.length; nI++){
            var cloneList = $("#selectRolePopup").find("#templateList").clone(true);
            cloneList.show().attr("id","cloneList");
            cloneList.find("#roleTitle").html(jsonItem[nI].roleTitle).attr("roleId",jsonItem[nI].roleId);
            //判断是否被勾选
            var roleIdsArr = $("#selectRole").attr("roleIds") ? JSON.parse($("#selectRole").attr("roleIds")) : [];
            for(var mI = 0; mI <  roleIdsArr.length; mI++ ){
                if(roleIdsArr[mI] == jsonItem[nI].roleId){
                    cloneList.find("input").prop("checked",true);
                }
            }
            $("#selectRolePopup").find("#templateList").before(cloneList);
        }
    }
}

//新建用户时，弹框清空内容
function clearPopup(idx){
    $("#userNewPopup input[type=text]").each(function(){
        $(this).val("");
    });
    $("#selectOrganization").html("");
    $("#selectRole").html("");
    $("#acctPassword").val("123456");
    $("#resetPassWord").hide();
    if(idx == 1)//1-为新建  0为编辑
        $("#resetPassWord").show();
}

//点击选择组织的时候，当前弹框组织清空
function orgistClear(){
    /*for(var nI = 0; nI < $("#organizationList *[id=cloneList]").length; nI++ ){
        $("#organizationList *[id=cloneList]").eq(nI).remove();
    }*/
    $("#organizationList *[id=cloneList]").remove();
}

//编辑用户时，弹框内容赋值
function valuePopup(data){
    //拼接组织显示信息;
    var orgInfoJson = data.orgInfo;
    var orgInfoArr = [];
    operationData({"data":orgInfoJson,"newData":orgInfoArr});
    var selectOrganizationValue = "";//赋值内容value
    var orgIdNameArr = [];
    //为复现数据  显示弹框内容做数据缓存
    $("#selectOrganization").attr("orgIdNameArr",JSON.stringify(orgIdNameArr));
    var orgIds = [];
    var orgNames = [];
    for(var nI = orgInfoArr.length-1; nI >= 0; nI-- ){
        selectOrganizationValue += selectOrganizationValue == "" ? orgInfoArr[nI].orgName : "," + orgInfoArr[nI].orgName;
        orgIdNameArr.push({"orgId":orgInfoArr[nI].id,"orgName":orgInfoArr[nI].orgName});
    }
    data.selectOrganization = selectOrganizationValue;
    //拼接角色显示信息;
    var selectRoleValue = "";//赋值内容value
    var roleIds = [];
    for (mI = 0; mI < data.roleArr.length; mI++ ){
        selectRoleValue += selectRoleValue == "" ? data.roleArr[mI].roleTitle : "," + data.roleArr[mI].roleTitle;
        roleIds.push(data.roleArr[mI].roleId);
    }
    data.selectRole = selectRoleValue;
    setValue4Desc(data,$("#userNewPopup")[0]);
    //为复现数据  显示弹框内容做数据缓存
    $("#selectRole").attr("roleIds",JSON.stringify(roleIds));
    $("#selectOrganization").attr("orgIdNameArr",JSON.stringify(orgIdNameArr));
}

//选择后渲染顶部标题面包屑显示
function createRow(idMark,nameMark){//组织id，组织name
    var cloneList = $("#orgSelectDetail").find("#templateList").clone(true);
    cloneList.show().attr({"id":"cloneList","idMark":idMark});
    cloneList.find("#orgNameShow").html(nameMark);
    $("#orgSelectDetail").find("#templateList").before(cloneList);
    //删除操作
    cloneList.find("#orgNameShowDelete").on("click",function(){
        $(this).parents("#cloneList").nextAll("*[id=cloneList]").remove();
        $(this).parents("#cloneList").remove();
        var idsMark = document.body.jsLee.organizationjoinId.split($(this).parents("#cloneList").attr("idMark"))[0];
        if(idsMark[idsMark.length - 1] == ","){
            idsMark = idsMark.substring(0,idsMark.length-1);
        }
        //赋值角色需要的组织组合id
        document.body.jsLee.organizationjoinId = idsMark;
        // 赋值末级id
        document.body.jsLee.organizationlastId = document.body.jsLee.organizationjoinId.split(",")[document.body.jsLee.organizationjoinId.split(",").length-1];
        var jsonParam = {};
        /*if(!document.body.jsLee.organizationjoinId){
            jsonParam.id = document.body.jsLee.userId;
        }else{
            jsonParam.id = document.body.jsLee.organizationlastId;
        }*/
        if($("#organizationList").attr("reqParam")){
            var jsonParam = JSON.parse($("#organizationList").attr("reqParam"));
        }else{
            var jsonParam = {};
        }
        jsonParam.id = document.body.jsLee.organizationlastId;
        jsonParam.id2 = document.body.jsLee.userId;
        initplugPath($("#organizationList")[0],"standardTableCtrl",document.body.jsLee.requestUrl.path9,jsonParam,"POST")
    });
}
//新建用户提交成功返回;
function submitCallBack(data){
    data = JSON.parse(data);
    if(data.retCode == "0000000"){
        closePopupWin();
        if($("#tableList").attr("reqParam")){
            var jsonParam = JSON.parse($("#tableList").attr("reqParam"));
        }else{
            var jsonParam = {};
        }
        initplugPath($("#tableList")[0],"standardTableCtrl",this.requestUrl.path1,jsonParam,"POST");
    }
}

//新建用户提交校验
function submitChek(){
    initValidate($("#userNewPopup")[0]);
    var valiClass=new clsValidateCtrl();
    if(!valiClass.validateAll4Ctrl("#userNewPopup") || $("#selectOrganization").html() == "" || $("#selectRole").html() == ""){
        if($("#selectOrganization").html() == ""){
            showErrInfoByCustomDiv($("#selectOrganization"),"请选择组织");
        }
        if($("#selectRole").html() == ""){
            showErrInfoByCustomDiv($("#selectRole"),"请选择角色");
        }
        return false;
    }else{
        return true;
    }
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

//解析递归方法
function operationData(options){
    //options.newData
    var currentData = {};
    for(var key in options.data){

        if(key != "parent" || key != "children" ){
            currentData[key] = options.data[key];
        }
    }
    options.newData.push(currentData);

    if(options.data.parent){
        operationData({"data":options.data.parent,"newData":options.newData});
    }else{
        return options.newData;
    }
}

//搜索操作
function clsSearchBtnCtrl$after(jsonCond){
    jsonCond.oInfoId = document.body.jsLee.userId;
    jsonCond.acctType = document.body.jsLee.acctType;
    return jsonCond;

}

$(function(){
    //初始化自己封装方法
    var methodLee = new clsMethodLee();
    document.body.jsLee = methodLee;
    methodLee.init();
});