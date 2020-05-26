
jQuery.extend({
    "confirm":function (info,title,callback,btnSureName,btnCancelName,isStyle,isInterVal){
        /*
        * info为需要显示提示的内容,callback为回调函数
        * title标题内容
        * callback 确定回调函数
        * btnSureName  确定按钮名称
        * btnCancelName   取消按钮明名称
        * isStyle    弹框样式  del——删除弹框  com——普通框样式2
        * isInterVal   是否定时关闭
        *
        * */
       	btnSureName = btnSureName ? btnSureName : "确定";
        btnCancelName = btnCancelName ? btnCancelName : "取消";
        title = title ? title : "提示";
        var isStyleClass = "";
        switch (isStyle){
            case "del"://删除
                isStyleClass = "show_info_contain_del";
                break;
            case "com"://另一种样式
                isStyleClass = "show_info_contain_com";
                break;
        }

        var content=
        	'<div class="show_info" id="info-show">'
        	+ '<div class="show_info_contain '+ isStyleClass + '" id="contain-info-show">'
            	+'<div class="show_info_tittle"><i class="iconfont iconLiRa_notes1 message-tip"></i>'+ title 
            	+'<i class="iconfont iconLiRa_cross message-close" id="show_info_close"></i></div>'
            	+'<div class="show_info_content">'+info+'</div>'
            	+'<div class="show_info_confirm_cancel tr" id="show_info_confirm_cancel"><a href="javascript:void(0);" id="cancel-info-show" class="btn_green1 btn-cancel">'+ btnCancelName +'</a><a href="javascript:void(0);" id="confirm-info-show" class="btn_green1 btn-sure">'
            		+ btnSureName +'</a></div>'
            +'</div>';
            +'</div>'
            
        $('body').append(content);
        if($("#contain-info-show").height() > $("#contain-info-show").css("min-height").split("px")[0]){
            $("#contain-info-show").css("margin-top","-" + ($("#contain-info-show").height() / 2) + "px");
        }
        $('#show_info_confirm_cancel').click(function(e){
            if(e.target==$("#confirm-info-show")[0]){
                $('#info-show').remove();
                if(callback){
                	callback.call(this,true);
                }
            }else if(e.target==$("#cancel-info-show")[0]){
                $('#info-show').remove();
                if(callback){
                	callback.call(this,false);
                }
            }
        });
        $("#show_info_close").click(function(){
        	$('#info-show').remove();
        });
        if(isInterVal){
            setTimeout(function(){
                $("#show_info_close").click();
            },isInterVal);
        }
    }
    
})