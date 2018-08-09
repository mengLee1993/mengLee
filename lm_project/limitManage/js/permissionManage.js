

//树形菜单渲染 
function treeCheck(){
    this.data = {};
    this.isAllChecked = null;//该属性是否把子集全选

}
treeCheck.prototype.unionChecked = function(dom){
    $(dom).click(function(){

        for(var i=0;i<$(dom).length;i++){//后期优化
            // if(){
            //  this.isAllChecked = false;//该属性是否把子集全选
            // }
        }
        //当选中或取消一个权限时，也同时选中或取消所有的下级权限
        $(this).siblings("ul").find("input").attr("checked",this.checked);

        //当选中一个权限时，也要选中所有的直接上级权限
        // if(this.checked ==true){
        //     $(this).parents("li").children("input").attr("checked",true);
        // }

        //当某一个父权限下的子权限都不选中时，该父权限也不选中
        // var elements=$(this).parent("li").parent("ul").find("input");
        // var num=elements.length;
        // /*alert(num);*/
        // var a=0;
        // for(var i=0;i<num;i++){
        //     if(elements[i].checked==false){
        //         a++;
        //     }
        //}
        if(a==num){
            $(this).parent("li").parent("ul").siblings("input").attr("checked",false);
        }
    });
}
treeCheck.prototype.loopLoad = function(options){//递归,无限遍历下级dom树
    //数据， 父级dom,  是否是选中,  是否有checkbox框
    var data = options.data;
    var parentDom = options.parentDom;
    var isNeedCheck = options.isNeedCheck;
    var parentId = options.parentId;
    var showName = options.showName;
    var clickFunc = options.clickFunc;
    //var globalFunctionId = options.globalFunctionId;
    if(data){
        var oUl = document.createElement("ul");
        if( parentDom.attr("id") && parentDom.attr("id") == parentId ){
            $("#" + parentId).empty();
            oUl.id = "navigation";
            parentDom.append(oUl);
        }else{
            //if(!bol)oUl.style.display == "none";
            parentDom.append(oUl);
        }
        for(var i=0;i<data.length;i++){
            var oLi = document.createElement("li");
            var chk = "";
            if(data[i].status == 1){ 
                chk = "checked";
            }
            //oLi.innerHTML = "<div class='hitarea expandable-hitarea'></div>";
            if(isNeedCheck){
                oLi.innerHTML += "<input type='checkbox' "+chk+">";
            }

            if(showName){
                oLi.innerHTML += "<a href='javascript:;' class='cloneTreeA'>"+data[i][showName]+"</a>";
            }else{
                if(data[i]["roleTitle"]){
                    oLi.innerHTML += "<a href='javascript:;' class='cloneTreeA'>"+data[i][["roleTitle"]]+"</a>";
                }else{
                    oLi.innerHTML += "<a href='javascript:;' class='cloneTreeA'>"+data[i][["roleGroupTitle"]]+"</a>";
                }
            }
            oLi.data = data[i];
            //oLi.options = options;
            if(data[i].lev == 1){
                $("#" +id+ "#navigation").append(oLi);
            }else{
                $(oUl).append(oLi)
            }

            //var dom = $(oUl).find("li").eq($(oUl).find("li").length-1).find("a");
            // dom.on("click",function(){
            //     eval($(this).parent()[0].options.clickFunc)
            // })

            // if(globalFunctionId == ""){
            //     $("#root").click()
            // }else if(globalFunctionId == data[i].functionId){
            //     dom.click();
            // }
            
            if(data[i].children){
                this.loopLoad({"data":data[i].children, "parentDom":$(oLi), "isNeedCheck":isNeedCheck, "parentId":$(oLi).attr("id"),"showName":showName});

            }
        }
    }
}
treeCheck.prototype.treeBindClick = function(options){
     $("#" + options.parentId +" a").click(function(){

        var parentData = $(this).parent("li")[0].data;

        $("#looptree a").css({"color":"#4A90E2"});
        $(this).css({"color":"red"});

        if(parentData.functionId){//权限
            $("#editPermission").show();
            $("#detailRow")[0].data = parentData;
        }else{
            if(parentData.orRole){//角色。分类
                if(parentData.orRole == "角色"){//角色
                    $("#editRuleOrRules").show();
                    $("#deleteRuleOrRules").show();
                }else{//分类
                    $("#createNewRuleOrRules").show();
                    $("#editRuleOrRules").show();
                    $("#deleteRuleOrRules").show();
                }
                $("#detailRow")[0].data = parentData;
            }
        }
        setValue4Desc($(this).parent("li")[0].data, $("#detailRow")[0])
     })

}

