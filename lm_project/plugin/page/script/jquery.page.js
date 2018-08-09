//分页插件
//zhongwei修改于2016-03-18增加跳转页面
/**
2014-08-05 ch
**/
(function($){
	var ms = {
		init:function(obj,args){
			return (function(){
				obj.off('click', 'a.tcdNumber');
				obj.off('click', 'a.prevPage');
				obj.off('click', 'a.nextPage');
				obj.off('click', 'a.firstPage');
				obj.off('click', 'a.lastPage');
				if(args.isJump == null || args.isJump)
					obj.off('click', 'a.jumpPage');
				ms.fillHtml(obj,args);
				ms.bindEvent(obj,args);
			})();
		},
		//填充html
		fillHtml:function(obj,args){
			return (function(){//console.log(obj)
				//obj.children().unbind();
				//$(obj).find(">a").unbind();
				
				//$("#jumpSure").off("click");
				obj.empty();
				//obj[0].innerHTML='';

				//首页
				/*obj.append('<a href="javascript:;" class="firstPage">首页</a>');*/
				//上一页
				if(args.current > 1){
					obj.append('<a href="javascript:;" class="firstPage">首页</a>');
					obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
				}else{
					obj.remove('.prevPage');
					obj.append('<a href="javascript:;" class="firstPage">首页</a>');
					obj.append('<span class="disabled">上一页</span>');
				}
				//中间页码
				if(args.current != 1 && args.current >= 4 && args.pageCount != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+1+'</a>');
				}
				if(args.current-2 > 2 && args.current <= args.pageCount && args.pageCount > 5){
					obj.append('<span>...</span>');
				}
				var start = args.current -2,end = args.current+2;
				if((start > 1 && args.current < 4)||args.current == 1){
					end++;
				}
				if(args.current > args.pageCount-4 && args.current >= args.pageCount){
					start--;
				}
				for (;start <= end; start++) {
					if(start <= args.pageCount && start >= 1){
						if(start != args.current){
							obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
						}else{
							obj.append('<span class="current">'+ start +'</span>');
						}
					}
				}
				if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5){
					obj.append('<span>...</span>');
				}
				if(args.current != args.pageCount && args.current < args.pageCount -2  && args.pageCount != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+args.pageCount+'</a>');
				}
				//下一页
				if(args.current < args.pageCount){
					obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
					obj.append('<a href="javascript:;" class="lastPage" pageCount="'+args.pageCount+'">末页</a>');
				}else{
					obj.remove('.nextPage');
					obj.append('<span class="disabled">下一页</span>');//末页
					obj.append('<a href="javascript:;" class="lastPage" pageCount="'+args.pageCount+'">末页</a>');
				}


				//obj.append("<select><option>10条</option><option>20条</option><option>50条</option></select><span class='eachPage'>每页</span>");


				//末页
				/*obj.append('<a href="javascript:;" class="lastPage">末页</a>');*/
				//增加总共多少页，跳转到多少页
				
				if(args.isJump == null || args.isJump)
				{
					obj.append("<span class='totalPage'>&nbsp;&nbsp;共"+args.pageCount+"页，&nbsp;跳至第&nbsp;</span>");
					obj.append("<span class='totalPage'><input type='text' class='inputJump'  currentCount='"+args.current+"' pageCount='"+args.pageCount+"' onkeyup='dataCheck(this);' onafterpaste='dataCheck(obj);' id='jumpPage'/> 页</span>");
					obj.append("<a href='javascript:;' id='jumpSure' class='jumpPage'>确定</a>");
				}
				else
				{
					obj.append("<span class='totalPage'>&nbsp;&nbsp;共"+args.pageCount+"页</span>");
				}




			})();
		},
		//绑定事件
		bindEvent:function(obj,args){
			return (function(){

				obj.on("click","a.tcdNumber",function(){
					var current = parseInt($(this).text());
                    if(typeof(pageBefore) == "function")
                    {
                        if(!pageBefore('tcdNumber',current))
                            return false;
                    }
					ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount,"isJump":args.isJump});
					if(typeof(args.backFn)=="function"){
						args.backFn(current);
					}
				});


				//首页
				obj. on("click","a.firstPage",function(){
					var current = parseInt(obj.children("span.current").text());
                    if(typeof(pageBefore) == "function")
                    {
                        if(!pageBefore('firstPage',current))
                            return false;
                    }
					ms.fillHtml(obj,{"current":1,"pageCount":args.pageCount,"isJump":args.isJump});
					if(typeof(args.backFn)=="function"){
						args.backFn(1);
					}
				});
				//末页
				obj. on("click","a.lastPage",function(){
					//lastPageNum 统一传总页数，调用页面定义；
					var current=args.pageCount;
                    if(typeof(pageBefore) == "function")
                    {
                        if(!pageBefore('lastPage',current))
                            return false;
                    }
					ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount,"isJump":args.isJump});
					if(typeof(args.backFn)=="function"){
						args.backFn(current);
					}
				});

				//上一页
				
				obj.on("click","a.prevPage",function(){
					var current = parseInt(obj.children("span.current").text());
                    if(typeof(pageBefore) == "function")
                    {
                        if(!pageBefore('prevPage',current))
                            return false;
                    }
					ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount,"isJump":args.isJump});
					if(typeof(args.backFn)=="function"){
						args.backFn(current-1);
					}
				});
				//下一页
				
				obj.on("click","a.nextPage",function(){
					var current = parseInt(obj.children("span.current").text());
                    if(typeof(pageBefore) == "function")
                    {
                        if(!pageBefore('nextPage',current))
                            return false;
                    }
					ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount,"isJump":args.isJump});
					if(typeof(args.backFn)=="function"){
						args.backFn(current+1);
					}
				});//console.log($("#jumpSure").length)
				//$("#jumpSure").on("click",function(){alert(1)
					
				//});
				if(args.isJump == null || args.isJump)
				{
					obj.on("click","a.jumpPage",function(){
						//if(obj.find("#jumpPage").val() == "" || obj.find("#jumpPage").val() == null)
						//	jumpPageNum = parseInt(obj.find("#jumpPage").attr("currentcount"));
						//else
							var jumpPageNum = parseInt(obj.find("#jumpPage").val());
						
						var pageCount	= parseInt(obj.find("#jumpPage").attr("pageCount"));
						
						if(jumpPageNum == 0)
						{
							alert("0不是正确的页数！");
							return false;
						}else if(jumpPageNum > pageCount)
						{
							alert("跳转页数不能大于总页数！");
							return false;
						}else if(jumpPageNum>0||jumpPageNum <=pageCount){
                            if(typeof(pageBefore) == "function")
                            {
                                if(!pageBefore('nextPage',jumpPageNum))
                                    return false;
                            }
							ms.fillHtml(obj,{"current":jumpPageNum,"pageCount":pageCount,"isJump":args.isJump});
							if(typeof(args.backFn)=="function"){
								args.backFn(jumpPageNum);
							}
						}else {
							alert("跳转页数不能为空！");
							return false;
						}
					});
				}
//				obj.find("#jumpSure").click(function(){
//					var jumpPageNum = parseInt(obj.find("#jumpPage").val());
//					var pageCount	= parseInt(obj.find("#jumpPage").attr("pageCount"));
//					if(jumpPageNum == 0)
//					{
//						alert("0不是正确的页数！");
//						return false;
//					}else if(jumpPageNum > pageCount)
//					{
//						alert("跳转页数不能大于总页数！");
//						return false;
//					}else if(jumpPageNum>0||jumpPageNum <=pageCount){
//						if(typeof(args.onJump)=="function"){
//							args.onJump(jumpPageNum);
//						}
//					}else {
//						alert("跳转页数不能为空！");
//						return false;
//					}
//				});
			})();
		}
	}
	$.fn.createPage = function(options){
		var args = $.extend({
			pageCount : 10,
			current : 1,
			backFn : function(){}
		},options);
		ms.init(this,args);
	}
})(jQuery);

function jumpPage4Page(event)
{//alert(1);
	var jumpPageNum = $subNode($event(event).parentNode,"jumpPage").value;
	var pageCount	= $subNode($event(event).parentNode,"jumpPage").getAttribute("pageCount");
	
	if(jumpPageNum == 0)
	{
		alert("0不是正确的页数！");
		return false;
	}else if(jumpPageNum > pageCount)
	{
		alert("跳转页数不能大于总页数！");
		return false;
	}
	else if(jumpPageNum>0||jumpPageNum <=pageCount)
	{
		try{
			jumpPage(jumpPageNum);
		}catch(e){}
	}
	//else if(jumpPageNum>0||jumpPageNum <=pageCount){
		//if(typeof(args.onJump)=="function"){
		//	args.onJump(jumpPageNum);
		//}
	//}
else {
		alert("跳转页数不能为空！");
		return false;
	}
}

function dataCheck(obj)
{
	obj.value=obj.value.replace(/[^\d]/g,'');
}
