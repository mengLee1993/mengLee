;(function (){
var jsSrc=document.scripts;
	jsSrc=jsSrc[jsSrc.length-1].src;
	var typeStr = jsSrc.split("?")[1].split("=")[1];
	
if(type = 'purchaser'){//公用头部，首页等频道公用头部
	$.get("./mod-header.html", function(result){
    	$("body").prepend(result);
  	});
}else if(type = 'small-purchaser'){//小头部，比如登陆注册的头部

}else if(type = ''){//......

};
})();