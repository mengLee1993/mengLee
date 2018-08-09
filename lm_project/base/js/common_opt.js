/**
 * Created by Administrator on 2017/6/16.
 * 每个页面加载时都要执行的操作
 */
//肤色功能处理
$(document).ready(function () {
    initThemeColor("orange");

})

/**函数名称： changeThemeColor
 * 函数功能： 换肤
 * 入口参数： themeColor：换肤肤色名称
 * */
function changeThemeColor(themeColor) {

    $('head link[href],head script[src]').each(function () {
        var preTheme = getCookie('preTheme');
        //preThemeReg为skinName的正则转换
        var preThemeReg1 = new RegExp(preTheme, "g");
        var preThemeReg2 = new RegExp(preTheme.substring(0, 1).toUpperCase() + preTheme.substring(1), "g");
        if (this.tagName.toLowerCase() == 'link') {
            $(this).attr("href", $(this).attr('href').replace(preThemeReg1, themeColor))
            $(this).attr("href", $(this).attr('href').replace(preThemeReg2, themeColor.substring(0, 1).toUpperCase() + themeColor.substring(1)))
        } else if (this.tagName.toLowerCase() == 'script') {

                $(this).attr("src", $(this).attr('src').replace(preThemeReg1, themeColor))
                $(this).attr("src", $(this).attr('src').replace(preThemeReg2, themeColor.substring(0, 1).toUpperCase() + themeColor.substring(1)))

        }

    })
}

/********| 函数名称： setCookie || 函数功能： 设置cookie函数 || 入口参数： name：cookie名称  value:cookie值|*********/
function setCookie(name, value) {
    var argv = setCookie.arguments;
    var argc = setCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    if (expires != null) {
        var LargeExpDate = new Date();
        LargeExpDate.setTime(LargeExpDate.getTime() + (expires * 1000 * 3600 * 24));
    }
    document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + LargeExpDate.toGMTString()));
}
/********| 函数名称： getCookie || 函数功能： 读取cookie函数 || 入口参数： name：cookie名称 |*********/
function getCookie(name) {
    var search = name + "="
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1) end = document.cookie.length;
            return unescape(document.cookie.substring(offset, end));
        } else {
            return ""
        }
    }
}
/*******| 函数名称： deleteCookie || 函数功能： 删除cookie函数 || 入口参数： Name：cookie名称 |*******/
function deleteCookie(name) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
    setCookie(name, "", expdate);
}

/*******| 函数名称： initThemeColor || 函数功能： 初始页面肤色 || 入口参数： themeColor：初始颜色（'blue，orange'） |*******/
function initThemeColor(themeColor) {
    //肤色处理
    if (getCookie('curTheme')) {
        var changeThemeTo = getCookie('curTheme');
        changeThemeColor(changeThemeTo);
    } else {
        setCookie('curTheme', themeColor);
        setCookie('preTheme', themeColor);
    }
    //换肤功能
    $('.change-skin').click(function () {
        var preTheme = getCookie('curTheme');
        var changeThemeTo = $(this).attr('changeThemeTo');
        deleteCookie('curTheme');
        setCookie('curTheme', changeThemeTo);

        deleteCookie('preTheme');
        setCookie('preTheme', preTheme);
        changeThemeColor(changeThemeTo);
    })
}

/*
 * 函数名：onlyNrowParse
 * 函数功能：商品属性显示两行多余“…”
 * 入口参数：obj：包含文字内容的dom节点
 *           strValue：填充内容
 *           nH:文字显示最大高度
 * */
function onlyNrowParse(obj, strValue, nH) {
    var strTar = "";
    for (var mI = 0; mI < strValue.length; mI++) {
        strTar = strTar + strValue.charAt(mI);
        var bln = (mI == strValue.length - 1) ? true : false;
        if (!onlyNrow(strTar, obj, bln, nH))
            break;
    }
}


function onlyNrow(strTar, obj, bln, nH) {
    var strSrc = obj.innerHTML;
    obj.innerHTML = (bln) ? strTar : strTar + "…";
    //obj.innerHTML = strTar + "…";
    if (obj.offsetHeight > nH) {
        obj.innerHTML = strSrc;
        return false;
    }
    return true;
}


/*
 * 函数名：bubbleShow
 * 函数功能：显示气泡提示框
 * 入口参数：relativeObj：相对定位dom对象
 *           contentHtml：hover框html内容
 *           positionobj ：jquery里css()方法里面的定位参数对象  {"left":"10px","top":"10px","bottom":"10px"}
 *           sanjiaoDir:不填默认朝上，“down”朝下
 * */
function bubbleShow(relativeObj,contentHtml,positionobj,sanjiaoDir){

    var htmlstr='<div class="bubbleTip-w220">'
        +'<i class="bubble-triangle"></i>'
        +'</div>';
    var $bubbleTip = $(htmlstr);
    $bubbleTip.append(contentHtml).css(positionobj);
    if(sanjiaoDir && sanjiaoDir == "down"){//如果三角方向参数存在
        $bubbleTip.find("i")[0].className="";
        $bubbleTip.find("i").addClass("bubble-triangle-down");
    }

    // 注册hover事件
    $(relativeObj).hover(function(){
        if($(this).find("bubbleTip-w220").length>0){
            $(this).find("bubbleTip-w220").show();
        }else{
            $(this).append($bubbleTip);
        }
        $(relativeObj).addClass("pr");

    },function(){
        $(this).find(".bubbleTip-w220").hide();
    })
}


