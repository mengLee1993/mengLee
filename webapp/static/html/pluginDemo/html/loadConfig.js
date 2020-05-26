$(function(){
    //头部、尾部引用
    $("body").children().eq(0).before("<div id='headerLoad'></div>").css({"margin-top":"60px"});
    $("body").append("<div id='footerLoad'></div>");
    $("#headerLoad").load("../load/header.html",function(){
        //判断页面位置，修改头部导航栏跳转相对链接
        $(".lm_submenu a").each(function(){
            $(this).attr("href",$(this).attr("href"));
        });
    }).css({"position":"fixed","top":0,"width":"100%","z-index":22222222222});
    $("#footerLoad").load(relativeUrl + "../load/footer.html",function(){});
});
