var relativeUrl = "https://menglee1993.github.io/";
$(function(){
    //头部、尾部引用
    $("body").children().eq(0).before("<div id='headerLoad'></div>").css({"margin-top":"60px"});
    $("body").append("<div id='footerLoad'></div>");
    $("#headerLoad").load(relativeUrl + "lm_publicHtml/lm_header.html",function(){
        //判断页面位置，修改头部导航栏跳转相对链接
        var localhostUrl = window.location.href;
        var varValue = "../../";
        if(localhostUrl.indexOf("lm_html") != -1 || localhostUrl.indexOf("lm_game") != -1 || localhostUrl.indexOf("lm_article") != -1){
            $(".lm_submenu a").each(function(){
                $(this).attr("href",varValue + $(this).attr("href"));
            });
            $("#homePage").attr("href",varValue + $("#homePage").attr("href"));
            $("#about").attr("href",varValue + $("#about").attr("href"));
        }else if(localhostUrl.indexOf("lm_other") != -1 ){
            varValue = "../";
            $(".lm_submenu a").each(function(){
                $(this).attr("href",varValue + $(this).attr("href"));
            });
            $("#homePage").attr("href",varValue + $("#homePage").attr("href"));
            $("#about").attr("href",varValue + $("#about").attr("href"));
        }
    }).css({"position":"fixed","top":0,"width":"100%","z-index":22222222222});
    //$("#footerLoad").load(relativeUrl + "lm_publicHtml/lm_footer.html",function(){});
});
