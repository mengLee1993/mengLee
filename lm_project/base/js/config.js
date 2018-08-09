var requestUrl = "";



/*****************************增值测试地址*************************************/
var domainUrl = "http://10.4.105.172:8051";	//请求后台地址


/*****************************用户测试地址*************************************/
//var domainUrl = "http://10.4.105.172:8051";	//请求后台地址

/*****************************本机测试地址*************************************/
//var domainUrl = "http://localhost:8080";	//请求后台地址

/******************************************************************************
 *                               地址跳转
 *    author:zhongwei by egou
 *    version:1.0
 *    updateTime: 2017-07-28
 *    参数说明:
 *		strUrl:跳转地址   status:错误码，404,500这种,  
 *      jumpType:0表示本页刷新,1表示打开新页面
 *
 ******************************************************************************/
var configFlag = false;
function jumpUrl(strUrl,status,jumpType,data)
{
	//if(jumpType == "-1")
	//	return false;
	if(typeof(loadingProc) == "function" && !configFlag){
		configFlag = true;
        loadingProc(1);
	}
	if(status != null)
	{
		var objWin = (window.parent.location.href == window.location.href) ? window.location : window.parent.location;
		switch(status)
		{
			/*case "1":
				(jumpType == 0) ? window.location.href = "" : window.open("");
				break;*/
			case "0":
				alert(data.msg);
				break;
			case "999999":
				objWin.href = "/shop/index.php?act=login";
				break;
			default:
				if(strUrl != "" && strUrl != null)
					(jumpType == 0) ? window.location.href = strUrl : window.open(strUrl);
				break;
		}
	}
}