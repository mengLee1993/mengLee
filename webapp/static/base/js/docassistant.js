/*********************************************************************************
 *                                   组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：通过对页面标签的解析，初始化标签，支持单选下拉框，简单表格，文本框,
 *    超链接
 *
 *
 **********************************************************************************/

function clsDocAssistant() {
    this.ctrl = null;
    this.parentCtrl = null;
    this.jsonData = null;
    this.init = clsDocAssistant$init;
    this.parse = clsDocAssistant$parse;
    this.refresh = clsDocAssistant$refresh;
}

function clsDocAssistant$init() {
    //1.初始化整个页面
    if (this.ctrl == null) {
        var ctrlList = (this.parentCtrl == null) ? $("*[comType][sort!=1]") : $(this.parentCtrl).find("*[comType][sort!=1]");
        for (var nI = 0; nI < ctrlList.length; nI++) {
            this.ctrl = ctrlList[nI];
            this.parse();
        }

        // var ctrlList = (this.parentCtrl == null) ? $("*[comType][sort=1]") : $(this.parentCtrl).find("*[comType][sort=1]");
        // for (var nI = 0; nI < ctrlList.length; nI++) {
        //     this.ctrl = ctrlList[nI];
        //     this.parse();
        // }
    }
    else // 2.初始化指定对象
    {
        this.parse();
    }
}

function clsDocAssistant$parse() {
    var comType = $(this.ctrl).attr("comType");
    switch (comType) {
        case "form":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }

                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsFormCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            oJsCtrl.init();
                            this.ctrl.jsBodyCtrl = oJsCtrl;
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
						//alert(errorThrown);
                    }
                });
            }
            else {
                var oJsCtrl = new clsFormCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.init();
                this.ctrl.jsBodyCtrl = oJsCtrl;
            }
            break;
        case "singleSelectCtrl":
            if (this.ctrl.data == null && this.ctrl.getAttribute("dataType") == null && this.ctrl.getAttribute("orgType") == null) 
			{
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";
                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'json',
					beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        if (data.retCode == "0000000") {
                            var oJsCtrl = new clsSingleSelectCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = data.rspBody;
                            oJsCtrl.jsonFData = data;
                            oJsCtrl.init();
                            this.ctrl.jsCtrl = oJsCtrl;
                        }
                        jumpUrl(null, data.retCode, null, data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                       if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
			else if(this.ctrl.getAttribute("dataType") != null)
			{
				var oJsCtrl = new clsSingleSelectCtrl();
                oJsCtrl.ctrl = this.ctrl;
                if(this.ctrl.data != null)
                {
                    oJsCtrl.jsonData = this.ctrl.data.rspBody;
                    oJsCtrl.jsonFData = this.ctrl.data;
                }
                else
                {
                    //临时
                    var jsonArr = [];
                    if(jsonMetadata){
                        if(jsonMetadata.rspBody == null || jsonMetadata.rspBody[$(this.ctrl).attr("dataType")] == null)
                            jsonArr = [{"typeCode":"","typeName":""}];
                        else
                        {
                            for (key in jsonMetadata.rspBody[$(this.ctrl).attr("dataType")])
                            {
                                var jsonItem = {"typeCode":key,"typeName":jsonMetadata.rspBody[$(this.ctrl).attr("dataType")][key]};
                                jsonArr.push(jsonItem);
                            }
                        }
                        oJsCtrl.jsonData	= jsonArr;
                        oJsCtrl.jsonFData	= jsonMetadata;
                    }
				}
				oJsCtrl.init();
                this.ctrl.jsCtrl = oJsCtrl;
			}
            else if(this.ctrl.getAttribute("orgType") != null)
            {
                var oJsCtrl = new clsSingleSelectCtrl();
                oJsCtrl.ctrl = this.ctrl;
                if(this.ctrl.data != null)
                {
                    oJsCtrl.jsonData = this.ctrl.data.rspBody;
                    oJsCtrl.jsonFData = this.ctrl.data;
                }
                else
				{
					//临时
                    var jsonArr = [];
                    if(jsonOrgdata){
                        jsonArr = jsonOrgdata.rspBody.rows;
                        oJsCtrl.jsonData	= jsonArr;
                        oJsCtrl.jsonFData	= jsonOrgdata;
                    }
				}
				
                oJsCtrl.init();
                this.ctrl.jsCtrl = oJsCtrl;
            }
			else
			{
				var oJsCtrl = new clsSingleSelectCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.init();
                this.ctrl.jsCtrl = oJsCtrl;
			}
            break;
        case "unionSelectCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";
                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'json',
					
					beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        if (data.retCode == "0000000") {
                            var oJsCtrl = new clsUnionSelectCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            if (this.ctrl.parentObj != null)
                                oJsCtrl.parentCtrl = this.ctrl.parentObj;
                            else if (this.ctrl.getAttribute("parentCtrl") != null)
                                oJsCtrl.parentCtrl = $(this.ctrl).parents(this.ctrl.getAttribute("parentCtrl") + ":first")[0];
                            oJsCtrl.jsonData = data.rspBody;
                            oJsCtrl.jsonFData = data;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();
                        }
                        jumpUrl(null, data.retCode, null, data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsUnionSelectCtrl();
                oJsCtrl.ctrl = this.ctrl;
                if (this.ctrl.getAttribute("parentCtrl") != null)
                    oJsCtrl.parentCtrl = $(this.ctrl).parents(this.ctrl.getAttribute("parentCtrl") + ":first")[0];
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();

            }
            break;
        case "unionSelectAsyncCtrl":	//异步下拉
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'json',
					beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        if (data.retCode == "0000000") {
                            var oJsCtrl = new clsUnionSelectAsyncCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            if (this.ctrl.getAttribute("parentCtrl") != null)
                                oJsCtrl.parentCtrl = $(this.ctrl).parents(this.ctrl.getAttribute("parentCtrl") + ":first")[0];
                            oJsCtrl.jsonData = data.rspBody;
                            oJsCtrl.jsonFData = data;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();
                        }
                        jumpUrl(null, data.retCode, null, data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsUnionSelectAsyncCtrl();
                oJsCtrl.ctrl = this.ctrl;
                if (this.ctrl.getAttribute("parentCtrl") != null)
                    oJsCtrl.parentCtrl = $(this.ctrl).parents(this.ctrl.getAttribute("parentCtrl") + ":first")[0];
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();

            }
            break;
        case "colsCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }

                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";
                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    dataType: 'text',
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsColsCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            this.ctrl.jsCtrl = oJsCtrl;
                            //oJsCtrl.init();
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        //alert(errorThrown);
                        
						if(JSON.parse(jqXHR.responseText).code != null)
							var data = {"retDesc":JSON.parse(jqXHR.responseText).data.respDesc};
						else
							var data = {"retDesc":"ajax请求错误"}
						if(this.async){
							jumpUrl(null, data.retCode, null,data ,true);
						}else{
							jumpUrl(null, data.retCode, null, data);
						}
                    }
                });
            }
            else {
                var oJsCtrl = new clsColsCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                this.ctrl.jsCtrl = oJsCtrl;
                //oJsCtrl.init();
            }
            break;
        case "standardTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";
                if(this.ctrl.getAttribute("asyncType") != null)
                    var asyncType = true;
                else
                    var asyncType = false;
                if (typeof(loadingProc) == "function" && asyncType)
                    loadingProc(0);
                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: asyncType,
                    cache: false,
                    ctrl: this.ctrl,
                    dataType: 'text',
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsStandardTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();
                        }
                        if(this.async){
                            jumpUrl(null, jsonData.retCode, null, jsonData,true);
                        }else{
                            jumpUrl(null, jsonData.retCode, null, jsonData);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                       
							if(JSON.parse(jqXHR.responseText).code != null)
								var data = {"retDesc":JSON.parse(jqXHR.responseText).data.respDesc};
							else
								var data = {"retDesc":"ajax请求错误"}
							if(this.async){
								jumpUrl(null, data.retCode, null,data ,true);
							}else{
								jumpUrl(null, data.retCode, null, data);
							}
						
                    }
                });
            }
            else {
                var oJsCtrl = new clsStandardTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();
            }
            break;
        case "fixedColsTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsFixedColsTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            oJsCtrl.init();
                            this.ctrl.jsCtrl = oJsCtrl;
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsFixedColsTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.init();
                this.ctrl.jsCtrl = oJsCtrl;
            }
            break;
        case "rowspanTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                else
                    return false;
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsRowspanTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            oJsCtrl.init();
                            this.ctrl.jsCtrl = oJsCtrl;
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsRowspanTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.init();
                this.ctrl.jsCtrl = oJsCtrl;
            }
            break;
        case "rowspanCommonTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null && this.ctrl.getAttribute("reqPath") != "") {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                else
                    return false;
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsRowspanCommonTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            oJsCtrl.init();
                            this.ctrl.jsCtrl = oJsCtrl;
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsRowspanCommonTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.init();
                this.ctrl.jsCtrl = oJsCtrl;
            }
            break;
        case "level2TableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                else
                    return false;
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsLevel2TableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            oJsCtrl.init();
                            this.ctrl.jsCtrl = oJsCtrl;
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsLevel2TableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.init();
                this.ctrl.jsCtrl = oJsCtrl;
            }
            break;
        case "rowspanBlockTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsRowspanBlockTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsRowspanBlockTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();
            }
            break;
        case "thirdLevelTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }

                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    dataType: 'text',
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsThirdLevelTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsThirdLevelTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();
            }
            break;
        case "parentChildTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }

                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }

                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    dataType: 'text',
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsParentChildTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsParentChildTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();
            }
            break;
        case "treeListCtrl":
            if (this.ctrl.data == null || this.ctrl.data == undefined) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";
                if(this.ctrl.getAttribute("asyncType") != null)
                    var asyncType = true;
                else
                    var asyncType = false;
                if (typeof(loadingProc) == "function" && asyncType)
                    loadingProc(0);

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: asyncType,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsTreeListCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();

                        }
                        if(this.async){
                            jumpUrl(null, jsonData.retCode, null, jsonData,true);
                        }else{
                            jumpUrl(null, jsonData.retCode, null, jsonData);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                     		if(JSON.parse(jqXHR.responseText).code != null)
								var data = {"retDesc":JSON.parse(jqXHR.responseText).data.respDesc};
							else
								var data = {"retDesc":"ajax请求错误"}
							if(this.async){
								jumpUrl(null, data.retCode, null,data ,true);
							}else{
								jumpUrl(null, data.retCode, null, data);
							}
					}
                });
            }
            else {
                var oJsCtrl = new clsTreeListCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();

            }
            break;
        case "dynamicTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }

                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsDynamicTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        
						if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsDynamicTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();
            }
            break;
        case "uploadCtrl":
            var oJsCtrl = new clsUploadCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "checkAll":	//全选
            var oJsCtrl = new clsCheckAllCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "clearAllCond":	//清空所有条件
            var oJsCtrl = new clsClearAllCondCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "messageBox":		//弹出提示框
            var oJsCtrl = new clsMessageBoxCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "stdProgressBar":		//进度条
            var oJsCtrl = new clsStdProgressBarCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "searchBtnCtrl":	//查询按钮
            var oJsCtrl = new clsSearchBtnCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "placeholder":		//placeholder效果兼容ie8
            var oJsCtrl = new clsPlaceholderCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "number":
            var oJsCtrl = new clsNumberCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "selectDropCtrl":	//下拉菜单模拟下拉框

            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                if (this.ctrl.getAttribute("reqParam") != null)
                    var reqParam = this.ctrl.getAttribute("reqParam");
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";
                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: reqParam,
                    dataType: 'json',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        var oJsCtrl = new clsSelectDropCtrl();
                        oJsCtrl.ctrl = this.ctrl;
                        oJsCtrl.jsonData = jsonData.rspBody;
                        oJsCtrl.jsonFData = jsonData;
                        oJsCtrl.init();
                        this.ctrl.jsCtrl = oJsCtrl;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsSelectDropCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.init();
                this.ctrl.jsCtrl = oJsCtrl;
            }
        case "tab":
            var aLi = $(this.ctrl).find('.tabTit li');
            var aDiv = $(this.ctrl).find('.tabContent');
            for (var i = 0; i < aLi.length; i++) {
                $(aLi[i]).click(function () {
                    for (var i = 0; i < aLi.length; i++) {
                        $(aLi[i]).removeClass("tabTitLi");
                        $(aDiv[i]).hide();
                    }
                    var n = $(this).index();
                    $(this).addClass("tabTitLi");
                    $(aDiv[n]).show();
                })
            }
            break;
        case "tabCtrl":
            var oJsCtrl = new clsTabCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "standardEditTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }

                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";
                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    dataType: 'text',
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsStandardEditTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        
							if(JSON.parse(jqXHR.responseText).code != null)
								var data = {"retDesc":JSON.parse(jqXHR.responseText).data.respDesc};
							else
								var data = {"retDesc":"ajax请求错误"}
							if(this.async){
								jumpUrl(null, data.retCode, null,data ,true);
							}else{
								jumpUrl(null, data.retCode, null, data);
							}
						
                    }
                });
            }
            else {
                var oJsCtrl = new clsStandardEditTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();
            }
            break;
        case "countDown":
        case "countDownTimerCtrl":
            var oJsCtrl = new clsCountDownTimerCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "strPageCtrl":
            var oJsCtrl = new clsStrPageCtrl();
            oJsCtrl.ctrl = this.ctrl;
            oJsCtrl.init();
            this.ctrl.jsCtrl = oJsCtrl;
            break;
        case "customTableCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }
                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    dataType: 'text',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new customTableCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            oJsCtrl.init();
                            this.ctrl.jsCtrl = oJsCtrl;
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new customTableCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                oJsCtrl.init();
                this.ctrl.jsCtrl = oJsCtrl;
            }
            break;
        case "plusMinusRowCtrl":
            if (this.ctrl.data == null) {
                if (this.ctrl.getAttribute("reqPath") != null) {
                    var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                    if (reqPath.split("?").length == 1)
                        reqPath = reqPath + "?" + Math.random();
                    else
                        reqPath = reqPath + "&" + Math.random();
                }

                if (this.ctrl.getAttribute("reqParam") != null) {
                    var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
                    var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (this.ctrl.getAttribute("reqMethod") != null)
                    var reqMethod = this.ctrl.getAttribute("reqMethod");
                else
                    var reqMethod = "POST";

                $.ajax({
                    url: reqPath,
                    type: reqMethod,
                    async: false,
                    cache: false,
                    ctrl: this.ctrl,
                    contentType: 'application/json',
                    data: JSON.stringify(reqParam),
                    // dataType: 'json',
					
beforeSend:function (xhr) {
						xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
					},
                    success: function (data) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.retCode == "0000000") {
                            var oJsCtrl = new clsPlusMinusRowCtrl();
                            oJsCtrl.ctrl = this.ctrl;
                            oJsCtrl.jsonData = jsonData.rspBody;
                            oJsCtrl.jsonFData = jsonData;
                            this.ctrl.jsCtrl = oJsCtrl;
                            oJsCtrl.init();
                        }
                        jumpUrl(null, jsonData.retCode, null, jsonData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        
						if(JSON.parse(jqXHR.responseText).code != null)
							alert(JSON.parse(jqXHR.responseText).data.respDesc);
						else
							alert("ajax请求错误");
                    }
                });
            }
            else {
                var oJsCtrl = new clsPlusMinusRowCtrl();
                oJsCtrl.ctrl = this.ctrl;
                oJsCtrl.jsonData = this.ctrl.data.rspBody;
                oJsCtrl.jsonFData = this.ctrl.data;
                this.ctrl.jsCtrl = oJsCtrl;
                oJsCtrl.init();
            }
            break;
    }
}

function clsDocAssistant$refresh() {
    if (this.ctrl != null) {
        //1.自己是否有comType 2.子节点是否有comType
        var comType = $(this.ctrl).attr("comType");
        if (comType != null) {
            this.parse();
        }
    }
}

/*********************************************************************************
 *                               单选下拉框组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：支持下拉框初始化并且赋值，支持设置默认空值，动态刷新下拉框
 *
 *
 *
 **********************************************************************************/
function clsSingleSelectCtrl() {
    this.ctrl = null;		//初始化对象
    this.selCode = "code";	//code值
    this.selValue = "1";	//text值
    this.initValue = null;		//初始值
    this.initText = null;     //初始文本值
    this.classHideTab = null; //是否隐藏css
    this.isSearch = true; //是否显示搜索 true不现实  false 显示
    this.emptyValue = "请选择";	//默认空值
    this.jsonData = null;		//ajax返回结果
    this.isBeauty = null;	//是否用chosen插件美化 null不美化
    this.init = clsSingleSelectCtrl$init;
    this.parse = clsSingleSelectCtrl$parse;
    this.setValue = clsSingleSelectCtrl$setValue;
    this.getValue = clsSingleSelectCtrl$getValue;
    this.refresh = clsSingleSelectCtrl$refresh;
}

function clsSingleSelectCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("selCode") != null)
            this.selCode = this.ctrl.getAttribute("selCode");
        if (this.ctrl.getAttribute("selValue") != null)
            this.selValue = this.ctrl.getAttribute("selValue");
        if (this.ctrl.getAttribute("initValue") != null)
            this.initValue = this.ctrl.getAttribute("initValue");
        if (this.ctrl.getAttribute("initText") != null)
            this.initText = this.ctrl.getAttribute("initText");
        if (this.ctrl.getAttribute("emptyValue") != null)
            this.emptyValue = this.ctrl.getAttribute("emptyValue");
        if (this.ctrl.getAttribute("classHideTab") != null)
            this.classHideTab = this.ctrl.getAttribute("classHideTab");
        if (this.ctrl.getAttribute("isSearch") != null)
            this.isSearch = JSON.parse(this.ctrl.getAttribute("isSearch"));
        if (this.ctrl.getAttribute("isBeauty") != null)
            this.isBeauty = JSON.parse(this.ctrl.getAttribute("isBeauty"));
        this.parse();
    }
}

function clsSingleSelectCtrl$parse() {
    if (this.jsonData != null) {
        this.ctrl.innerHTML = "";
        if (this.emptyValue != "notnull")
            $addoOption(this.ctrl, "", this.emptyValue, "");

        for (var nI = 0; nI < this.jsonData.length; nI++) {
            var jsonItem = this.jsonData[nI];
            var nameArr = new Array("realText");
            var valueArr= new Array(jsonItem[this.selValue]);
            /*if($(this.ctrl).attr("dataType") != null)
            {
                var strText = jsonItem[this.selCode]+"-"+jsonItem[this.selValue];
                //this.initText = jsonItem[this.selCode]+"-"+initText;
            }
            else*/
            var strText = jsonItem[this.selValue];
            var strValue = jsonItem[this.selCode];
            if($(this.ctrl).attr("multiple") == "multiple")
            {
                if (this.initValue != null)
                {
                    var blnOption = false;
                    for(var mI=0; mI<this.initValue.split(",").length; mI++)
                    {
                        if (strValue == this.initValue.split(",")[mI])
                        {
                            blnOption = true;
                            break;
                        }
                    }
                    if (blnOption)
                        $addoOption(this.ctrl, strValue, strText, this.initValue.split(",")[mI], null, nameArr, valueArr, jsonItem);
                    else
                        $addoOption(this.ctrl, strValue, strText, null, null, nameArr, valueArr, jsonItem);
                }
                else if (this.initText != null)
                {
                    var blnOption = false;
                    for(var mI=0; mI<this.initText.split(",").length; mI++)
                    {
                        /*if($(this.ctrl).attr("dataType") != null)
                        {
                            if (strText == strValue+"-"+this.initText.split(",")[mI])
                            {
                                blnOption = true;
                                break;
                            }
                        }
                        else
                        {*/
						if (strText == this.initText.split(",")[mI])
						{
							blnOption = true;
							break;
						}
                        /*}*/
                    }
                    if (blnOption)
                        $addoOption(this.ctrl, strValue, strText, null, strText, nameArr, valueArr, jsonItem);
                    else
                        $addoOption(this.ctrl, strValue, strText, null, null, nameArr, valueArr, jsonItem);
                }
                else
                    $addoOption(this.ctrl, strValue, strText, null, null, nameArr, valueArr, jsonItem);
            }
            else
            {
                if (this.initValue != null) {
                    if (strValue == this.initValue)
                        $addoOption(this.ctrl, strValue, strText, this.initValue, null, nameArr, valueArr, jsonItem);
                    else
                        $addoOption(this.ctrl, strValue, strText, null, null, nameArr, valueArr, jsonItem);
                }
                else if (this.initText != null)
                {
                    /*if($(this.ctrl).attr("dataType") != null)
                    {
                        if (strText == strValue+"-"+this.initText)
                            $addoOption(this.ctrl, strValue, strText, null, strText, nameArr, valueArr, jsonItem);
                        else
                            $addoOption(this.ctrl, strValue, strText, null, null, nameArr, valueArr, jsonItem);
                    }
                    else
                    {*/
                        if (strText == this.initText)
                            $addoOption(this.ctrl, strValue, strText, null, this.initText, nameArr, valueArr, jsonItem);
                        else
                            $addoOption(this.ctrl, strValue, strText, null, null, nameArr, valueArr, jsonItem);
                    /*}*/
                }
                else
                    $addoOption(this.ctrl, strValue, strText, null, null, nameArr, valueArr, jsonItem);
            }
        }
        if(this.isBeauty == null)
        {
            if (this.ctrl.style.width != null) {
                $(this.ctrl).chosen({
                    //disable_search_threshold: 5,
                    disable_search:this.isSearch,
                    //search_contains: true,
                    classHideTab:this.classHideTab,
                    width: this.ctrl.style.width,
                    no_results_text: "没有匹配结果!",
                    enable_split_word_search: false,
                    placeholder_text_single: '请选择'
                });
            }
            else {
                $(this.ctrl).chosen({
                    //disable_search_threshold: 5,
                    disable_search:this.isSearch,
                    // disable_search:true,
                    //search_contains: true,
                    width: this.ctrl.style.width,
                    classHideTab:this.classHideTab,
                    no_results_text: "没有匹配结果!",
                    enable_split_word_search: false,
                    placeholder_text_single: '请选择'
                });
            }
            $(this.ctrl).trigger('chosen:updated');
        }
    }
}

function clsSingleSelectCtrl$setValue(strValue, strText,arr) {
    if (this.ctrl != null) {
        if (strValue != null)
            $(this.ctrl).val(strValue);
        else if (strText != null)
            this.ctrl.options[this.ctrl.selectedIndex].text = strText;
        else //复选
        {
            for(var nI=0; nI<arr.length; nI++)
            {
                $(this.ctrl).find("option").each(function(){
                    if($(this).val() == arr[nI])
                        $(this).prop("selected",true);

                });
            }

        }
        if(this.isBeauty == null)
            $(this.ctrl).trigger('chosen:updated');
    }
}

function clsSingleSelectCtrl$getValue() {
    return this.ctrl.value;
}

function clsSingleSelectCtrl$refresh() {
    this.parse();
}


/*********************************************************************************
 *                               级联下拉框组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-09-24
 *    实现功能：支持下拉框初始化并且赋值，支持下拉框级联选择
 *
 *
 *
 **********************************************************************************/
function clsUnionSelectCtrl() {
    this.ctrl = null;		//初始化对象
    this.parentCtrl = null;		//父对象
    this.selCode = "code";	//code值
    this.selValue = "1";		//text值
    this.initValues = null;		//初始值
    this.initTexts = null;		//初始值
    this.paramName = this.selCode;	//请求参数key值
    this.nIdx = 0;
    this.emptyValue = "请选择";	//默认空值
    this.jsonData = null;		//ajax返回结果
    this.isEmptyShow = 1;       //1表示不管下拉框是否有内容，都显示,0表示下拉框没有内容自动隐藏
    this.init = clsUnionSelectCtrl$init;
    this.parse = clsUnionSelectCtrl$parse;
    this.setValue = clsUnionSelectCtrl$setValue;
    this.refresh = clsUnionSelectCtrl$refresh;
    this.getValue = clsUnionSelectCtrl$getValue;
    this.isBeauty = null;	//是否美化

    this.childReqPath = null;
    this.childReqParam = null;
    this.childParamName = null;
    this.childMethod = "GET";
    this.initChild = clsUnionSelectCtrl$initChild;
    this.parseChild = clsUnionSelectCtrl$parseChild;
}

function clsUnionSelectCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("selCode") != null)
            this.selCode = this.ctrl.getAttribute("selCode");
        if (this.ctrl.getAttribute("selValue") != null)
            this.selValue = this.ctrl.getAttribute("selValue");
        if (this.ctrl.getAttribute("initValues") != null)
            this.initValues = this.ctrl.getAttribute("initValues");
        if (this.ctrl.getAttribute("initTexts") != null)
            this.initTexts = this.ctrl.getAttribute("initTexts");
        if (this.ctrl.getAttribute("emptyValue") != null)
            this.emptyValue = this.ctrl.getAttribute("emptyValue");
        if (this.ctrl.getAttribute("paramName") != null)
            this.paramName = this.ctrl.getAttribute("paramName");
        if (this.ctrl.getAttribute("isEmptyShow") != null)
            this.isEmptyShow = this.ctrl.getAttribute("isEmptyShow");
        if (this.ctrl.getAttribute("isBeauty") != null)
            this.isBeauty = this.ctrl.getAttribute("isBeauty");

        this.parse();
    }
}

function clsUnionSelectCtrl$initChild(ctrl, parentCtrl, initValues, nIdx) {
    if (nIdx == null)
        nIdx = this.nIdx + 1;
    else
        this.nIdx = nIdx;
    if (parentCtrl != null)
        this.parentCtrl = parentCtrl;
    if (this.initValues == null)
        var initValue = null;
    else
        var initValue = this.initValues.split("####")[nIdx];
    if (this.initTexts == null)
        var initText = null;
    else
        var initText = this.initTexts.split("####")[nIdx];
    var jsonData = ctrl.options[ctrl.selectedIndex].domNode;
    var unionSel = ctrl.getAttribute("unionSel");
    //如果unionsel不等于空，表示有下一级下拉框
    if (unionSel != null) {
        var nextCtrl = null;
        for (var nI = 0; nI < unionSel.split(",").length; nI++) {
            var ctrlId = unionSel.split(",")[nI];
            //设置下一级对象
            if (nI == 0)
                nextCtrl = (this.parentCtrl == null) ? document.getElementById(ctrlId) : $(this.parentCtrl).find("#" + ctrlId)[0];

            if (ctrlId != null) {
                if (this.parentCtrl == null)
                    var obj = document.getElementById(ctrlId);
                else
                    var obj = $subNode(this.parentCtrl, ctrlId);
                obj.innerHTML = "";
                $addoOption(obj, "", this.emptyValue, "");
            }
            else
                return false;

            if (this.parentCtrl == null) {
                var nWidth = $("#" + ctrlId)[0].style.width == null ? "100px" : $("#" + ctrlId)[0].style.width;
                $("#" + ctrlId).chosen({
                    //disable_search_threshold: 5,
                    search_contains: true,
                    no_results_text: "没有匹配结果!",
                    width: nWidth,
                    enable_split_word_search: false,
                    placeholder_text_single: '请选择'
                });
                $("#" + ctrlId).trigger('chosen:updated');
            }
            else {
                var nWidth = $(this.parentCtrl).find("#" + ctrlId)[0].style.width == null ? "100px" : $(this.parentCtrl).find("#" + ctrlId)[0].style.width;

                $(this.parentCtrl).find("#" + ctrlId).chosen({
                    //disable_search_threshold: 5,
                    search_contains: true,
                    no_results_text: "没有匹配结果!",
                    width: nWidth,
                    enable_split_word_search: false,
                    placeholder_text_single: '请选择'
                });
                $(this.parentCtrl).find("#" + ctrlId).trigger('chosen:updated');
            }
        }

        if (ctrl.value != "") {
            if (nextCtrl.getAttribute("reqPath") == null) {
                if (ctrl.getAttribute("reqPath") != null)
                    this.childReqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
                if (ctrl.getAttribute("reqParam") != null) {
                    this.childReqParam = JSON.parse(ctrl.getAttribute("reqParam"));
                    this.childReqParam[this.paramName] = ctrl.value;
                }
                if (ctrl.getAttribute("method") != null)
                    this.childMethod = ctrl.getAttribute("method");
            }
            else {
                this.childReqPath = (requestUrl == null) ? nextCtrl.getAttribute("reqPath") : requestUrl + nextCtrl.getAttribute("reqPath");
                if (nextCtrl.getAttribute("paramName") != null)
                    this.childParamName = nextCtrl.getAttribute("paramName");
                else
                    this.childParamName = this.paramName
                if (nextCtrl.getAttribute("reqParam") != null) {
                    this.childReqParam = JSON.parse(nextCtrl.getAttribute("reqParam"));
                    this.childReqParam[this.childParamName] = ctrl.value;

                    var operId = (nextCtrl.getAttribute("operId") == null) ? "" : nextCtrl.getAttribute("operId");
                    var reqBody = this.childReqParam;
                    jsonReqHeaderData.operTitle = operId;
                    var reqParam = {"reqHeader": jsonReqHeaderData};
                    reqParam["reqBody"] = reqBody;
                }
                if (nextCtrl.getAttribute("method") != null)
                    this.childMethod = nextCtrl.getAttribute("method");
            }
            //得到下级下拉框数据
            $.ajax({
                url: this.childReqPath,// 跳转到 action
                data: JSON.stringify(reqParam),//传的参数，用jsondata自己组合
                type: this.childMethod,
                jsCtrl: this,
                ctrl: ctrl,
                cache: false,
                async: false,
                dataType: 'json',
                contentType: 'application/json',
				
beforeSend:function (xhr) {
					xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
				},
                success: function (data) {
                    //更新下一级数据
                    if (this.jsCtrl.parentCtrl == null) {
                        var obj = document.getElementById(unionSel.split(",")[0]);
                        var unionSelObj = $(this.ctrl).attr("unionSel");
                        if (this.jsCtrl.isEmptyShow == 0 && data.rspBody.length == 0) {
                            if (unionSelObj != null || unionSelObj != "") {
                                for (var nI = 0; nI < unionSelObj.split(",").length; nI++) {
                                    var ctrlId = unionSelObj.split(",")[nI];
                                    if (ctrlId != null) {
                                        if (this.jsCtrl.parentCtrl == null && ($("#" + ctrlId).attr("isEmptyShow") == 0 || $("#" + ctrlId).attr("isEmptyShow") == null))
                                            $("#" + ctrlId + "_chosen").hide();
                                    }
                                }
                            }
                            if ($(obj).attr("isEmptyShow") == 0 || $(obj).attr("isEmptyShow") == null)
                                $("#" + obj.id + "_chosen").hide();
                        }
                        else {
                            if (unionSel != null || unionSel != "") {
                                for (var nI = 0; nI < unionSelObj.split(",").length; nI++) {
                                    var ctrlId = unionSelObj.split(",")[nI];
                                    if (ctrlId != null) {
                                        if (this.jsCtrl.parentCtrl == null)
                                            $("#" + ctrlId + "_chosen").show();
                                    }
                                }
                            }
                            $("#" + obj.id + "_chosen").show();
                        }
                    }
                    else {
                        var obj = $subNode(this.jsCtrl.parentCtrl, unionSel.split(",")[0]);
                        var unionSelObj = $(this.ctrl).attr("unionSel");
                        if (this.jsCtrl.isEmptyShow == 0 && data.rspBody.length == 0) {
                            if (unionSelObj != null || unionSelObj != "") {
                                for (var nI = 0; nI < unionSelObj.split(",").length; nI++) {
                                    var ctrlId = unionSelObj.split(",")[nI];
                                    if (ctrlId != null) {
                                        if (this.jsCtrl.parentCtrl == null && ($(this.jsCtrl.parentCtrl).find("#" + ctrlId).attr("isEmptyShow") == 0 || $(this.jsCtrl.parentCtrl).find("#" + ctrlId).attr("isEmptyShow") == null))
                                            $(this.jsCtrl.parentCtrl).find("#" + ctrlId + "_chosen").hide();
                                    }
                                }
                            }
                            if ($(obj).attr("isEmptyShow") == 0 || $(obj).attr("isEmptyShow") == null)
                                $(this.jsCtrl.parentCtrl).find("#" + obj.id + "_chosen").hide();
                        }

                        else {
                            if (unionSelObj != null || unionSelObj != "") {
                                for (var nI = 0; nI < unionSelObj.split(",").length; nI++) {
                                    var ctrlId = unionSelObj.split(",")[nI];
                                    if (ctrlId != null) {
                                        if (this.jsCtrl.parentCtrl == null)
                                            $(this.jsCtrl.parentCtrl).find("#" + ctrlId + "_chosen").show();
                                    }
                                }
                            }
                            $(this.jsCtrl.parentCtrl).find("#" + obj.id + "_chosen").show();
                        }


                    }
                    obj.innerHTML = "";
                    $addoOption(obj, "", this.jsCtrl.emptyValue, "");


                    for (var nI = 0; nI < data.rspBody.length; nI++) {
                        var jsonItem = data.rspBody[nI];
                        var strText = jsonItem[obj.getAttribute("selValue")];
                        var strValue = jsonItem[obj.getAttribute("selCode")];
                        if (strValue == initValue && initValue != "")
                            $addoOption(obj, strValue, strText, initValue, null, null, null, jsonItem);
                        else if (strText == initText && initText != "")
                            $addoOption(obj, strValue, strText, null, initText, null, null, jsonItem);
                        else
                            $addoOption(obj, strValue, strText, null, null, null, null, jsonItem);
                    }
                    if (this.jsCtrl.parentCtrl == null) {
                        obj.jsCtrl = this.jsCtrl;
                        var nWidth = $(obj)[0].style.width == null ? "100px" : $(obj)[0].style.width;
                        $(obj).chosen({
                            //disable_search_threshold: 5,
                            search_contains: true,
                            no_results_text: "没有匹配结果!",
                            width: nWidth,
                            enable_split_word_search: false,
                            placeholder_text_single: '请选择'
                        });
                        $(obj).trigger('chosen:updated');
                        if (obj.getAttribute("unionSel") != null) {
                            $(obj).change(function (event) {

                                var oJsCtrl = new clsUnionSelectCtrl();
                                oJsCtrl.ctrl = this;

                                if (this.getAttribute("selCode") != null)
                                    oJsCtrl.selCode = this.getAttribute("selCode");
                                if (this.getAttribute("selValue") != null)
                                    oJsCtrl.selValue = this.getAttribute("selValue");
                                if (this.getAttribute("initValues") != null)
                                    oJsCtrl.initValues = this.getAttribute("initValues");
                                if (this.getAttribute("emptyValue") != null)
                                    oJsCtrl.emptyValue = this.getAttribute("emptyValue");
                                if (this.getAttribute("paramName") != null)
                                    oJsCtrl.paramName = this.getAttribute("paramName");
                                if (this.getAttribute("isEmptyShow") != null)
                                    oJsCtrl.isEmptyShow = this.getAttribute("isEmptyShow");

                                if (this.getAttribute("parentCtrl") != null)
                                    oJsCtrl.parentCtrl = $(this).parents(this.getAttribute("parentCtrl") + ":first")[0];
                                oJsCtrl.initChild(this, null, null, null);
                                this.jsCtrl = oJsCtrl;
                            });
                            if (this.jsCtrl.initValues != null && this.jsCtrl.initValues.split("####").length - 1 >= this.jsCtrl.nIdx)
                                this.jsCtrl.initChild($(obj)[0], null, this.jsCtrl.initValues, this.jsCtrl.nIdx + 1);
                            else if (this.jsCtrl.initTexts != null && this.jsCtrl.initTexts.split("####").length - 1 >= this.jsCtrl.nIdx)
                                this.jsCtrl.initChild($(obj)[0], null, "", this.jsCtrl.nIdx + 1);
                        }

                    }
                    else {
                        var nWidth = $(this.jsCtrl.parentCtrl).find("#" + obj.id)[0].style.width == null ? "100px" : $(this.jsCtrl.parentCtrl).find("#" + obj.id)[0].style.width;
                        $(this.jsCtrl.parentCtrl).find("#" + obj.id).chosen({
                            //disable_search_threshold: 5,
                            search_contains: true,
                            no_results_text: "没有匹配结果!",
                            width: nWidth,
                            enable_split_word_search: false,
                            placeholder_text_single: '请选择'
                        });
                        $(this.jsCtrl.parentCtrl).find("#" + obj.id).trigger('chosen:updated');
                        if (obj.getAttribute("unionSel") != null) {
                            $(this.jsCtrl.parentCtrl).find("#" + obj.id).jsCtrl = this.jsCtrl;
                            $(this.jsCtrl.parentCtrl).find("#" + obj.id).change(function (event) {
                                var oJsCtrl = new clsUnionSelectCtrl();
                                oJsCtrl.ctrl = this;

                                if (this.getAttribute("selCode") != null)
                                    oJsCtrl.selCode = this.getAttribute("selCode");
                                if (this.getAttribute("selValue") != null)
                                    oJsCtrl.selValue = this.getAttribute("selValue");
                                if (this.getAttribute("initValues") != null)
                                    oJsCtrl.initValues = this.getAttribute("initValues");
                                if (this.getAttribute("emptyValue") != null)
                                    oJsCtrl.emptyValue = this.getAttribute("emptyValue");
                                if (this.getAttribute("paramName") != null)
                                    oJsCtrl.paramName = this.getAttribute("paramName");
                                if (this.getAttribute("isEmptyShow") != null)
                                    oJsCtrl.isEmptyShow = this.getAttribute("isEmptyShow");

                                if (this.parentCtrl != null)
                                    oJsCtrl.parentCtrl = this.parentCtrl;
                                oJsCtrl.initChild(oJsCtrl.ctrl, oJsCtrl.parentCtrl, null, null);
                                //oJsCtrl.initChild(this, null, null, null);
                                this.jsCtrl = oJsCtrl;
                            });
                            if (this.jsCtrl.initValues != null && this.jsCtrl.initValues.split("####").length - 1 >= this.jsCtrl.nIdx)
                                this.jsCtrl.initChild($(obj)[0], null, this.jsCtrl.initValues, this.jsCtrl.nIdx + 1);
                            else if (this.jsCtrl.initTexts != null && this.jsCtrl.initTexts.split("####").length - 1 >= this.jsCtrl.nIdx)
                                this.jsCtrl.initChild($(obj)[0], null, "", this.jsCtrl.nIdx + 1);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    
					if(JSON.parse(jqXHR.responseText).code != null)
						alert(JSON.parse(jqXHR.responseText).data.respDesc);
					else
						alert("ajax请求错误");
                }
            });
        }

    }
}

function clsUnionSelectCtrl$parse() {
    if (this.jsonData != null) {
        var initValue = null;
        if (this.initValues != null)
            initValue = this.initValues.split("####")[this.nIdx];
        var initText = null;
        if (this.initTexts != null)
            initText = this.initTexts.split("####")[this.nIdx];
        this.ctrl.innerHTML = "";
        $addoOption(this.ctrl, "", this.emptyValue, "");
        for (var nI = 0; nI < this.jsonData.length; nI++) {
            var jsonItem = this.jsonData[nI];
            var strText = jsonItem[this.selValue];
            var strValue = jsonItem[this.selCode];
            if (strValue == initValue && initValue != "")
                $addoOption(this.ctrl, strValue, strText, initValue, null, null, null, jsonItem);
            else if (strText == initText && initText != "")
                $addoOption(this.ctrl, strValue, strText, null, initText, null, null, jsonItem);
            else
                $addoOption(this.ctrl, strValue, strText, null, null, null, null, jsonItem);
        }

        var nWidth = this.ctrl.style.width == null ? "100px" : this.ctrl.style.width;

        $(this.ctrl).chosen({
            //disable_search_threshold: 5,
            search_contains: true,
            no_results_text: "没有匹配结果!",
            width: nWidth,
            enable_split_word_search: false,
            placeholder_text_single: '请选择'
        });
        $(this.ctrl).trigger('chosen:updated');

        $(this.ctrl).change(function (event) {
            this.jsCtrl.initChild(this, this.jsCtrl.parentCtrl, null, null);
        });
        if (this.initValues != null && this.initValues.split("####").length - 1 >= this.nIdx) {
            this.ctrl.jsCtrl.initChild(this.ctrl, null, this.initValues, this.nIdx + 1);
        }


        var unionSel = this.ctrl.getAttribute("unionSel");
        if (unionSel != null) {
            for (var nI = 0; nI < unionSel.split(",").length; nI++) {
                var ctrlId = unionSel.split(",")[nI];
                if (ctrlId != null) {
                    if (this.parentCtrl == null)
                        var obj = document.getElementById(ctrlId);
                    else
                        var obj = $subNode(this.parentCtrl, ctrlId);
                    var nWidth = obj.style.width == null ? "100px" : obj.style.width;

                    $(obj).chosen({
                        search_contains: true,
                        no_results_text: "没有匹配结果!",
                        width: nWidth,
                        enable_split_word_search: false,
                        placeholder_text_single: '请选择'
                    });
                    $(obj).trigger('chosen:updated');
                }
            }
        }
    }
}

function clsUnionSelectCtrl$parseChild() {

}

function clsUnionSelectCtrl$setValue(strValue, strText) {
    if (this.ctrl != null) {
        if (strValue != null)
            $(this.ctrl).val(strValue);
        else if (strText != null)
            this.ctrl.options[this.ctrl.selectedIndex].text = strText;
        $(this.ctrl).trigger('chosen:updated');
    }
}

function clsUnionSelectCtrl$getValue(key) {
    return (this.parentCtrl == null) ? $("#" + key).val() : $(this.parentCtrl).find("#" + key).val();
}

function clsUnionSelectCtrl$refresh() {
    this.parse();
}


/*********************************************************************************
 *                               异步生成级联下拉框组件说明
 *    author:zhongwei by ygego
 *    version:1.0
 *    updateTime: 2018-03-28
 *    实现功能：支持下拉框初始化并且赋值，支持下拉框级联选择
 *
 *
 *
 **********************************************************************************/
function clsUnionSelectAsyncCtrl() {
    this.ctrl = null;		//初始化对象
    this.currObj = null;
    this.parentCtrl = null;		//父对象
    this.selCode = "code";	//code值
    this.selValue = "1";		//text值
    this.initValues = null;		//初始值
    this.initTexts = null;		//初始值
    this.paramName = this.selCode;	//请求参数key值
    this.templateId = null;
    this.nIdx = 0;
    this.emptyValue = "请选择";	//默认空值
    this.jsonData = null;		//ajax返回结果
    this.isEmptyShow = 1;       //1表示不管下拉框是否有内容，都显示,0表示下拉框没有内容自动隐藏
    this.init = clsUnionSelectAsyncCtrl$init;
    this.parse = clsUnionSelectAsyncCtrl$parse;
    this.setValue = clsUnionSelectAsyncCtrl$setValue;
    this.refresh = clsUnionSelectAsyncCtrl$refresh;
    this.getValue = clsUnionSelectAsyncCtrl$getValue;
    this.after = clsUnionSelectAsyncCtrl$after;
    this.initAfter = clsUnionSelectAsyncCtrl$initAfter;
}

function clsUnionSelectAsyncCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("selCode") != null)
            this.selCode = this.ctrl.getAttribute("selCode");
        if (this.ctrl.getAttribute("selValue") != null)
            this.selValue = this.ctrl.getAttribute("selValue");
        if (this.ctrl.getAttribute("initValues") != null)
            this.initValues = this.ctrl.getAttribute("initValues");
        if (this.ctrl.getAttribute("initTexts") != null)
            this.initTexts = this.ctrl.getAttribute("initTexts");
        if (this.ctrl.getAttribute("emptyValue") != null)
            this.emptyValue = this.ctrl.getAttribute("emptyValue");
        if (this.ctrl.getAttribute("paramName") != null)
            this.paramName = this.ctrl.getAttribute("paramName");
        if (this.ctrl.getAttribute("isEmptyShow") != null)
            this.isEmptyShow = this.ctrl.getAttribute("isEmptyShow");

        this.templateId = this.ctrl.getAttribute("templateSelectId");
        this.cloneId = this.templateId.replace("template", "clone");

        //清空
        var cloneList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
        for (var nI = cloneList.length - 1; nI >= 0; nI--) {
            cloneList[nI].parentNode.removeChild(cloneList[nI]);
        }
        this.currObj = this.ctrl;
        this.parse(this.jsonData);
        if (this.initValues != null) {
            for (var nI = 0; nI < this.initValues.split("####").length; nI++) {
                var strValue = this.initValues.split("####")[nI];
                var curSelectCtrl = $(this.ctrl).find(".cloneSelectCtrl:last");
                $(curSelectCtrl).val(strValue);
                $(curSelectCtrl).change();
            }
            this.initAfter();
        }
    }
}


function clsUnionSelectAsyncCtrl$parse(jsonData) {
    if (jsonData != null && jsonData.length > 0) {
        /*var initValue = null;
        if (this.initValues != null)
            initValue = this.initValues.split("####")[this.nIdx];
        var initText = null;
        if (this.initTexts != null)
            initText = this.initTexts.split("####")[this.nIdx];
        this.ctrl.innerHTML = "";*/

        var templateSelectCtrl = $(this.ctrl).find("#" + this.templateId)[0];
        var cloneSelectCtrl = templateSelectCtrl.cloneNode(true);
        cloneSelectCtrl.id = "cloneSelectCtrl";
        $(cloneSelectCtrl).addClass("cloneSelectCtrl");
        $(cloneSelectCtrl).show();
        cloneSelectCtrl.jsCtrl = this;
        cloneSelectCtrl.jsonData = jsonData;
        templateSelectCtrl.parentNode.insertBefore(cloneSelectCtrl, templateSelectCtrl);

        $addoOption(cloneSelectCtrl, "", this.emptyValue, "");
        for (var nI = 0; nI < jsonData.length; nI++) {
            var jsonItem = jsonData[nI];
            var strText = jsonItem[this.selValue];
            var strValue = jsonItem[this.selCode];
            /*if (strValue == initValue && initValue != "")
                $addoOption(cloneSelectCtrl, strValue, strText, initValue, null, null, null, jsonItem);
            else if (strText == initText && initText != "")
                $addoOption(cloneSelectCtrl, strValue, strText, null, initText, null, null, jsonItem);
            else*/
            $addoOption(cloneSelectCtrl, strValue, strText, null, null, null, null, jsonItem);
        }

        /*var nWidth = this.ctrl.style.width == null ? "100px" : this.ctrl.style.width;

        $(this.ctrl).chosen({
            //disable_search_threshold: 5,
            no_results_text: "没有匹配结果!",
            width: nWidth,
            enable_split_word_search: false,
            placeholder_text_single: '请选择'
        });
        $(this.ctrl).trigger('chosen:updated');
		*/

        $(cloneSelectCtrl).change(function (event) {
            if (this.jsCtrl.ctrl.getAttribute("reqParam") != null) {
                var operId = (this.jsCtrl.ctrl.getAttribute("operId") == null) ? "" : this.jsCtrl.ctrl.getAttribute("operId");
                var reqBody = JSON.parse(this.jsCtrl.ctrl.getAttribute("reqParam"));
                reqBody[this.jsCtrl.ctrl.getAttribute("paramName")] = this.value;
                jsonReqHeaderData.operTitle = operId;
                var reqParam = {"reqHeader": jsonReqHeaderData};
                reqParam["reqBody"] = reqBody;
            }

            for (var nI = $(this).nextAll(".cloneSelectCtrl").length - 1; nI >= 0; nI--) {
                $(this).nextAll(".cloneSelectCtrl")[nI].parentNode.removeChild($(this).nextAll(".cloneSelectCtrl")[nI]);
            }

            // var reqPath = this.jsCtrl.ctrl.getAttribute("reqPath");
            var reqPath = (requestUrl == null) ? this.jsCtrl.ctrl.getAttribute("reqPath") : requestUrl + this.jsCtrl.ctrl.getAttribute("reqPath");
            if (this.jsCtrl.ctrl.getAttribute("reqMethod") != null)
                var reqMethod = this.jsCtrl.ctrl.getAttribute("reqMethod");
            else
                var reqMethod = "POST";
            this.jsCtrl.currObj = this;

            $.ajax({
                url: reqPath,
                type: reqMethod,
                async: false,
                cache: false,
                ctrl: this.jsCtrl,
                contentType: 'application/json',
                data: JSON.stringify(reqParam),
                dataType: 'json',
				
beforeSend:function (xhr) {
					xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
				},
                success: function (data) {
                    if (data.retCode == "0000000") {
                        this.ctrl.parse(data.rspBody);
                    }
                    jumpUrl(null, data.retCode, null, data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    
					if(JSON.parse(jqXHR.responseText).code != null)
						alert(JSON.parse(jqXHR.responseText).data.respDesc);
					else
						alert("ajax请求错误");
                }
            });
        });

        /*if (this.initValues != null && this.initValues.split("####").length - 1 >= this.nIdx) {
            this.ctrl.jsCtrl.initChild(this.ctrl,null, this.initValues, this.nIdx + 1);
        }*/


        /*var unionSel = this.ctrl.getAttribute("unionSel");
        if (unionSel != null) {
            for (var nI = 0; nI < unionSel.split(",").length; nI++) {
                var ctrlId = unionSel.split(",")[nI];
                if (ctrlId != null) {
                    if (this.parentCtrl == null)
                        var obj = document.getElementById(ctrlId);
                    else
                        var obj = $subNode(this.parentCtrl, ctrlId);
                    var nWidth = obj.style.width == null ? "100px" : obj.style.width;

                    $(obj).chosen({
                        no_results_text: "没有匹配结果!",
                        width: nWidth,
                        enable_split_word_search: false,
                        placeholder_text_single: '请选择'
                    });
                    $(obj).trigger('chosen:updated');
                }
            }
        }*/
    }
    this.after(jsonData);
}

function clsUnionSelectAsyncCtrl$initAfter() {
}

function clsUnionSelectAsyncCtrl$after() {
}

function clsUnionSelectAsyncCtrl$parseChild() {

}

function clsUnionSelectAsyncCtrl$setValue(strValue, strText) {
    if (this.ctrl != null) {
        if (strValue != null)
            $(this.ctrl).val(strValue);
        else if (strText != null)
            this.ctrl.options[this.ctrl.selectedIndex].text = strText;
        $(this.ctrl).trigger('chosen:updated');
    }
}

function clsUnionSelectAsyncCtrl$getValue(key) {
    return (this.parentCtrl == null) ? $("#" + key).val() : $(this.parentCtrl).find("#" + key).val();
}

function clsUnionSelectAsyncCtrl$refresh() {
    this.parse();
}


/*********************************************************************************
 *                               简单表格组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：标准表格，一行标题，其他数据行且无rowspan，支持动态刷新和分页
 *
 *
 *
 **********************************************************************************/
function clsStandardTableCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.jsonAddData = null;
    this.templateId = null;
    this.cloneId = null;
    this.noDataId = null;
    this.bgEven = null;	//奇数行背景
    this.bgOdd = null;		//偶数行背景
    this.sortDescCls = null;			//降序cls
    this.sortAscCls = null;			//升序cls
    this.sortDefaultCls = null;		//默认排序cls
    this.totalCls = null;			//是否自动添加总条数
    this.colResizeFlag = false;
    this.idx = null;
    this.url = null;
    this.clsChk = null;		//checkbox className
    this.clsAllChk = null;		//全选checkbox className
    this.cacheArr = new Array();
    this.isCacheCond = null;
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.sortType = "1";		//排序类型 1为点击图标排序，2为点击标题排序
    this.unionColsId = null;
    this.unionParentColsId = null;
    this.scrollCtrlId	= null;	//是否有滚动翻页
    this.ctrlSel	= "0"	//是否按住ctrl选中行对象，0表示不选中，1表示选中
    this.init = clsStandardTableCtrl$init;
    this.parse = clsStandardTableCtrl$parse;
    this.refresh = clsStandardTableCtrl$refresh;
    this.clear = clsStandardTableCtrl$clear;
    this.setValue = clsStandardTableCtrl$setValue;
    this.before = clsStandardTableCtrl$before;
    this.progress = clsStandardTableCtrl$progress;
    this.after = clsStandardTableCtrl$after;
    this.page = clsStandardTableCtrl$page;
    this.setChildDocAssistant = clsStandardTableCtrl$setChildDocAssistant;
    this.cacheChkProc = clsStandardTableCtrl$cacheChkProc;
    this.cacheChkAfter = clsStandardTableCtrl$cacheChkAfter;
    this.sortAfter = clsStandardTableCtrl$sortAfter;
    this.parseAdd	= clsStandardTableCtrl$parseAdd;
    this.initAdd	= clsStandardTableCtrl$initAdd;
    this.initScroll = clsStandardTableCtrl$initScroll;
    this.chkAfter	= clsStandardTableCtrl$chkAfter;
    this.selRow		= clsStandardTableCtrl$selRow;
}

function clsStandardTableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("templateId") != null)
            this.templateId = this.ctrl.getAttribute("templateId");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("clsChk") != null)
            this.clsChk = this.ctrl.getAttribute("clsChk");
        if (this.ctrl.getAttribute("clsAllChk") != null)
            this.clsAllChk = this.ctrl.getAttribute("clsAllChk");
        if (this.ctrl.getAttribute("isCacheCond") != null)
            this.isCacheCond = this.ctrl.getAttribute("isCacheCond");
        if (this.ctrl.cacheArr != null)
            this.cacheArr = this.ctrl.cacheArr;
        if (this.ctrl.getAttribute("isCacheCond") != null)
            this.isCacheCond = this.ctrl.getAttribute("isCacheCond");
        if (this.ctrl.getAttribute("bgEven") != null)
            this.bgEven = this.ctrl.getAttribute("bgEven");
        if (this.ctrl.getAttribute("bgOdd") != null)
            this.bgOdd = this.ctrl.getAttribute("bgOdd");
        if (this.ctrl.getAttribute("sortDescCls") != null)
            this.sortDescCls = this.ctrl.getAttribute("sortDescCls");
        if (this.ctrl.getAttribute("sortAscCls") != null)
            this.sortAscCls = this.ctrl.getAttribute("sortAscCls");
        if (this.ctrl.getAttribute("totalCls") != null)
            this.totalCls = this.ctrl.getAttribute("totalCls");
        if (this.ctrl.getAttribute("sortType") != null)
            this.sortType = this.ctrl.getAttribute("sortType");
        if (this.ctrl.getAttribute("unionColsId") != null)
            this.unionColsId = this.ctrl.getAttribute("unionColsId");
        if (this.ctrl.getAttribute("unionParentColsId") != null)
            this.unionParentColsId = this.ctrl.getAttribute("unionParentColsId");
        if (this.ctrl.getAttribute("scrollCtrlId") != null)
            this.scrollCtrlId = this.ctrl.getAttribute("scrollCtrlId");
        if (this.ctrl.getAttribute("colResizeFlag") != null)
            this.colResizeFlag = this.ctrl.getAttribute("colResizeFlag");
        if (this.ctrl.getAttribute("ctrlSel") != null)
            this.ctrlSel = this.ctrl.getAttribute("ctrlSel");


        this.parse();
        if(this.scrollCtrlId != null)
            this.initScroll();
        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));

    }
}

function clsStandardTableCtrl$page(strClsName) {
    if (this.jsonData != null) {
        $("." + strClsName).createPage({
            pageCount: this.jsonData.pages,
            current: this.jsonData.pageNum,
            parentObj: this.ctrl,
            backFn: function (p) {
                var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
                jsonCondData.pageNum = p;
                $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
                document.body.jsCtrl.ctrl = $(this)[0].parentObj;
                document.body.jsCtrl.init();
                //$(this)[0].parentObj.jsCtrl.refresh();
            }
        });
    }

}

function clsStandardTableCtrl$initScroll()
{
    $("#"+this.scrollCtrlId).unbind("scroll");
    $("#"+this.scrollCtrlId)[0].jsCtrl = this;
    nayiLock(this.scrollCtrlId);
    $("#"+this.scrollCtrlId).scroll(function () {
        var scrollTop = $(this).scrollTop();

        if(this == window)
        {
            if (document.documentElement.scrollHeight >document.documentElement.clientHeight)
            {
                var scrollHeight = $(document.body).outerHeight(true);
                var windowHeight = $(window).height();
            }
            else
            {
                var scrollHeight = document.body.scrollHeight;
                var windowHeight = document.body.clientHeight;
            }
        }
        else
        {
            var scrollHeight = this.scrollHeight;
            var windowHeight = $(this).height();
        }


        if (scrollTop + windowHeight >= scrollHeight) {
            //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
            this.jsCtrl.initAdd();
        }
    });
}

function clsStandardTableCtrl$initAdd()
{
    var jsonCondData = JSON.parse(this.ctrl.getAttribute("reqParam"));
    jsonCondData.pageNum = (this.jsonData.pageNum == null) ? 1 : this.jsonData.pageNum+1;
    this.ctrl.setAttribute("reqParam", JSON.stringify(jsonCondData));
    if (this.jsonData.pageNum == this.jsonData.pages)
        return false;
    if (this.ctrl.data == null) {
        if (this.ctrl.getAttribute("reqPath") != null) {
            var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
            if (reqPath.split("?").length == 1)
                reqPath = reqPath + "?" + Math.random();
            else
                reqPath = reqPath + "&" + Math.random();
        }

        if (this.ctrl.getAttribute("reqParam") != null) {
            var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
            var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
            jsonReqHeaderData.operTitle = operId;
            var reqParam = {"reqHeader": jsonReqHeaderData};
            reqParam["reqBody"] = reqBody;
        }
        if (this.ctrl.getAttribute("reqMethod") != null)
            var reqMethod = this.ctrl.getAttribute("reqMethod");
        else
            var reqMethod = "POST";
        if(this.ctrl.getAttribute("asyncType") != null)
            var asyncType = true;
        else
            var asyncType = false;
        if (typeof(loadingProc) == "function" && asyncType)
            loadingProc(0);
        $.ajax({
            url: reqPath,
            type: reqMethod,
            async: asyncType,
            cache: false,
            ctrl: this.ctrl,
            dataType: 'text',
            contentType: 'application/json',
            data: JSON.stringify(reqParam),
            dataType: 'text',
			
beforeSend:function (xhr) {
				xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
			},
            success: function (data) {
                var jsonData = JSON.parse(data);
                if (jsonData.retCode == "0000000") {
                    this.ctrl.jsCtrl.jsonAddData = jsonData.rspBody;
                    this.ctrl.jsCtrl.jsonData.pageNum = jsonData.rspBody.pageNum;
                    this.ctrl.jsCtrl.jsonData.resultData = this.ctrl.jsCtrl.jsonData.resultData.concat(jsonData.rspBody.resultData);
                    this.ctrl.jsCtrl.parseAdd();
                }
                if(this.async){
                    jumpUrl(null, jsonData.retCode, null, jsonData,true);
                }else{
                    jumpUrl(null, jsonData.retCode, null, jsonData);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
               
					if(JSON.parse(jqXHR.responseText).code != null)
						var data = {"retDesc":JSON.parse(jqXHR.responseText).data.respDesc};
					else
						var data = {"retDesc":"ajax请求错误"}
					if(this.async){
						jumpUrl(null, data.retCode, null,data ,true);
					}else{
						jumpUrl(null, data.retCode, null, data);
					}
						
				
            }
        });
    }
    else {
        this.jsonAddData = this.ctrl.data;
        this.jsonData.resultData = this.jsonData.resultData.concat(this.jsonAddData.resultData);
        this.parseAdd();
    }
}

function clsStandardTableCtrl$parseAdd()
{
    this.before();
    if (this.jsonData != null && this.templateId != null) {

        this.cloneId = this.templateId.replace("template", "clone");
        var templateRow = $(this.ctrl).find("#" + this.templateId)[0];


        if (this.jsonAddData.resultData != null)
        {
            /*if(this.isCacheCond != null)
                this.ctrl.cacheArr = new Array();*/
            for (var nI = 0; nI < this.jsonAddData.resultData.length; nI++) {
                var jsonItem = this.jsonAddData.resultData[nI];
                var cloneRow = templateRow.cloneNode(true);
                if (this.bgOdd != null) {
                    if (nI % 2 == 0)
                        $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgEven);
                    else
                        $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgOdd);

                }
                cloneRow.id = this.cloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                this.progress(jsonItem, cloneRow);
                //如果有序号字段，则赋值
                if (this.idx != null)
                    $(cloneRow).find("#" + this.idx).html($(this.ctrl).find("*[id='"+this.cloneId+"']").length + 1);
                this.setValue(jsonItem, cloneRow);
                this.setChildDocAssistant(cloneRow);
                templateRow.parentNode.insertBefore(cloneRow, templateRow);
                //初始化checkbox和全选直接互相联动
                if (this.clsChk != null && this.clsAllChk != null) {
                    cloneRow.jsUnionCtrl = this;
                    $(cloneRow).find("." + this.clsChk)[0].jsUnionCtrl = this;
                    $(cloneRow).find("." + this.clsChk).click(function () {
                        var bln = true;
                        $(this.jsUnionCtrl.ctrl).find("*[id^='clone']").find("." + this.jsUnionCtrl.clsChk).each(function () {
                            if (this.checked == false)
                                bln = false;
                        });
                        $("." + this.jsUnionCtrl.clsAllChk).prop("checked", bln);
                        this.jsUnionCtrl.cacheChkProc(this);
                    });
                }

                if (this.isValidate == "1")
                    initValidate(cloneRow);
            }
            if(this.ctrlSel == "1")	//表格必须有clsChk clsAllChk
            {
                $(this.ctrl).find("*[id='"+this.cloneId+"']").mousemove(function(){
                    this.jsUnionCtrl.selRow(this);
                })
            }
        }

        if (this.sortType == 1) {
            //初始化降序升序方法
            if (this.sortDescCls != null) {
                for (var nI = 0; nI < $("." + this.sortDescCls).length; nI++)
                    $("." + this.sortDescCls)[nI].jsCtrl = this;
                $("." + this.sortDescCls).unbind("click");
                $("." + this.sortDescCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    //reqParam["sortType"] = "desc";
                    reqParam["order"] = this.getAttribute("paramName") + " desc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'desc');
                });

            }
            if (this.sortAscCls != null) {
                for (var nI = 0; nI < $("." + this.sortAscCls).length; nI++)
                    $("." + this.sortAscCls)[nI].jsCtrl = this;
                $("." + this.sortAscCls).unbind("click");
                $("." + this.sortAscCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    //reqParam["sortType"] = "asc";
                    reqParam["order"] = this.getAttribute("paramName") + " asc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'asc');
                });
            }
        }
        else {
            var sortDesc = this.ctrl.getAttribute("sortDesc");
            if (sortDesc != null) {
                var jsonSortDesc = JSON.parse(sortDesc);
                this.sortDescCls = jsonSortDesc.descCls;
                this.sortAscCls = jsonSortDesc.ascCls;
                this.sortDefaultCls = jsonSortDesc.defaultCls;
                for (var nI = 0; nI < $("." + this.sortDefaultCls).length; nI++)
                    $("." + this.sortDefaultCls)[nI].jsCtrl = this;
                $("." + this.sortDefaultCls).unbind("click");
                $("." + this.sortDefaultCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    if (this.getAttribute("sort") == null) {
                        this.setAttribute("sort", "desc");
                        //reqParam["sortType"] = "desc";
                        reqParam["order"] = this.getAttribute("paramName") + " desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }
                    else if (this.getAttribute("sort") == "desc") {
                        this.setAttribute("sort", "asc");
                        //reqParam["sortType"] = "asc";
                        reqParam["order"] = this.getAttribute("paramName") + " asc";
                        this.jsCtrl.sortAfter(this, 'asc');
                    }
                    else {
                        this.setAttribute("sort", "desc");
                        //reqParam["sortType"] = "desc";
                        reqParam["order"] = this.getAttribute("paramName") + " desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }

                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();


                });
            }
        }
    }
    this.after();
    if(this.unionColsId != null)
    {
        if(this.unionParentColsId != null)
            $("*[id='"+this.unionColsId+"']")[0].jsCtrl.parentCtrl = this.unionParentColsId;
        $("*[id='"+this.unionColsId+"']")[0].jsCtrl.init();
    }
}

function clsStandardTableCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateId != null) {

        this.cloneId = this.templateId.replace("template", "clone");
        this.clear();
        var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
        if (this.noDataId != null && this.jsonData.resultData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
            if (this.totalCls != null && $("." + this.totalCls).length > 0)
                $("." + this.totalCls).hide();
        }
        else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
            if (this.totalCls != null && $("." + this.totalCls).length > 0) {
                $("." + this.totalCls).show();
                $("." + this.totalCls).find("#total").text(this.jsonData.total);
            }
        }
        else {
        }

        if (this.jsonData.resultData != null)
        {
            /*if(this.isCacheCond != null)
                this.ctrl.cacheArr = new Array();*/
            for (var nI = 0; nI < this.jsonData.resultData.length; nI++) {
                var jsonItem = this.jsonData.resultData[nI];
                var cloneRow = templateRow.cloneNode(true);
                if (this.bgOdd != null) {
                    if (nI % 2 == 0)
                        $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgEven);
                    else
                        $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgOdd);

                }
                cloneRow.id = this.cloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                this.progress(jsonItem, cloneRow);
                //如果有序号字段，则赋值
                if (this.idx != null)
                    $(cloneRow).find("#" + this.idx).html(nI + 1);
                this.setValue(jsonItem, cloneRow);
                this.setChildDocAssistant(cloneRow);
                templateRow.parentNode.insertBefore(cloneRow, templateRow);
                //初始化checkbox和全选直接互相联动
                if (this.clsChk != null && this.clsAllChk != null) {
                    cloneRow.jsUnionCtrl = this;
                    $(cloneRow).find("." + this.clsChk)[0].jsUnionCtrl = this;
                    $(cloneRow).find("." + this.clsChk)[0].oRow = cloneRow;
                    $(cloneRow).find("." + this.clsChk).click(function () {
                        var bln = true;
                        $(this.jsUnionCtrl.ctrl).find("*[id^='clone']").find("." + this.jsUnionCtrl.clsChk).each(function () {
                            if (this.checked == false)
                                bln = false;
                        });
                        $(this.jsUnionCtrl.ctrl).find("." + this.jsUnionCtrl.clsAllChk).prop("checked", bln);
                        this.jsUnionCtrl.cacheChkProc(this);
                        this.jsUnionCtrl.chkAfter(this.oRow,this.checked,this);
                        selColor4Tr(this.oRow,this.checked,this);
                    });
                }

                if (this.isValidate == "1")
                    initValidate(cloneRow);
            }
            if(this.ctrlSel == "1")	//表格必须有clsChk clsAllChk
            {
                $(this.ctrl).find("*[id='"+this.cloneId+"']").mousemove(function(){
                    this.jsUnionCtrl.selRow(this);
                })
            }
        }

        if (this.sortType == 1) {
            //初始化降序升序方法
            if (this.sortDescCls != null) {
                for (var nI = 0; nI < $("." + this.sortDescCls).length; nI++)
                    $("." + this.sortDescCls)[nI].jsCtrl = this;
                $("." + this.sortDescCls).unbind("click");
                $("." + this.sortDescCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    //reqParam["sortType"] = "desc";
                    reqParam["order"] = this.getAttribute("paramName") + " desc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'desc');
                });

            }
            if (this.sortAscCls != null) {
                for (var nI = 0; nI < $("." + this.sortAscCls).length; nI++)
                    $("." + this.sortAscCls)[nI].jsCtrl = this;
                $("." + this.sortAscCls).unbind("click");
                $("." + this.sortAscCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    //reqParam["sortType"] = "asc";
                    reqParam["order"] = this.getAttribute("paramName") + " asc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'asc');
                });
            }
        }
        else {
            var sortDesc = this.ctrl.getAttribute("sortDesc");
            if (sortDesc != null) {
                var jsonSortDesc = JSON.parse(sortDesc);
                this.sortDescCls = jsonSortDesc.descCls;
                this.sortAscCls = jsonSortDesc.ascCls;
                this.sortDefaultCls = jsonSortDesc.defaultCls;
                for (var nI = 0; nI < $("." + this.sortDefaultCls).length; nI++)
                    $("." + this.sortDefaultCls)[nI].jsCtrl = this;
                $("." + this.sortDefaultCls).unbind("click");
                $("." + this.sortDefaultCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    if (this.getAttribute("sort") == null) {
                        this.setAttribute("sort", "desc");
                        //reqParam["sortType"] = "desc";
                        reqParam["order"] = this.getAttribute("paramName") + " desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }
                    else if (this.getAttribute("sort") == "desc") {
                        this.setAttribute("sort", "asc");
                        //reqParam["sortType"] = "asc";
                        reqParam["order"] = this.getAttribute("paramName") + " asc";
                        this.jsCtrl.sortAfter(this, 'asc');
                    }
                    else {
                        this.setAttribute("sort", "desc");
                        //reqParam["sortType"] = "desc";
                        reqParam["order"] = this.getAttribute("paramName") + " desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }

                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();


                });
            }
        }
    }
    if(this.colResizeFlag == "1")
    {
        $(this.ctrl).colResizable({disable:true});
        //$(this.ctrl).colResizable({resizeMode:'flex'});
        $(this.ctrl).colResizable({liveDrag:true, gripInnerHtml:"<div class='grip2'></div>", draggingClass:"dragging", resizeMode:'overflow'});
    }
    this.after();
    if(this.unionColsId != null)
    {
        if(this.unionParentColsId != null)
            $("*[id='"+this.unionColsId+"']")[0].jsCtrl.parentCtrl = this.unionParentColsId;
        $("*[id='"+this.unionColsId+"']")[0].jsCtrl.init();
    }

}

function clsStandardTableCtrl$selRow(oRow)
{
    var obj = $(oRow).find("." + this.clsChk)[0]
    if(!obj.checked && window.event.ctrlKey)
    {
        obj.checked = true;
        var bln = true;
        $(obj.jsUnionCtrl.ctrl).find("*[id^='clone']").find("." + obj.jsUnionCtrl.clsChk).each(function () {
            if (this.checked == false)
                bln = false;
        });
        $(obj.jsUnionCtrl.ctrl).find("." + obj.jsUnionCtrl.clsAllChk).prop("checked", bln);
        obj.jsUnionCtrl.cacheChkProc(obj);
        obj.jsUnionCtrl.chkAfter(oRow,obj.checked,obj);
        selColor4Tr(oRow,obj.checked,obj);
    }
    else if(obj.checked && window.event.altKey)
    {
        obj.checked = false;
        var bln = false;
        /*$(obj.jsUnionCtrl.ctrl).find("*[id^='clone']").find("." + obj.jsUnionCtrl.clsChk).each(function () {
            if (this.checked == false)
                bln = false;
        });*/
        $(obj.jsUnionCtrl.ctrl).find("." + obj.jsUnionCtrl.clsAllChk).prop("checked", bln);
        obj.jsUnionCtrl.cacheChkProc(obj);
        obj.jsUnionCtrl.chkAfter(oRow,obj.checked,obj);
        selColor4Tr(oRow,obj.checked,obj);
    }
}

function clsStandardTableCtrl$sortAfter(obj, type) {
    if (this.sortType == "1") {
        $("." + this.sortAscCls).removeClass("ascBgCurrentCls").addClass("ascBgCls");
        $("." + this.sortDescCls).removeClass("descBgCurrentCls").addClass("descBgCls");

        if (type == "asc")
            $(obj).removeClass("ascBgCls").addClass("ascBgCurrentCls");
        else
            $(obj).removeClass("descBgCls").addClass("descBgCurrentCls");
    }
    else {
        $("." + this.sortDescCls).removeClass(this.sortDescCls).addClass(this.sortDefaultCls);
        $("." + this.sortAscCls).removeClass(this.sortAscCls).addClass(this.sortDefaultCls);
        if (type == "asc")
            $(obj).removeClass(this.sortDefaultCls).addClass(this.sortAscCls);
        else
            $(obj).removeClass(this.sortDefaultCls).addClass(this.sortDescCls);

    }
}

function clsStandardTableCtrl$chkAfter()
{
}

function clsStandardTableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            //增加从公用变量取主数据的对应中文值
            /*if(window.parents != null && window.parents.jsonMetadata != null)
            {
                var jsonMetadata = window.parents.jsonMetadata;
                if($(ctrl).attr("dataType") != null)
                {
                    var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][value];
                }

            }*/
            //临时
            if($(ctrl).attr("dataType") != null && ctrl.tagName.toLowerCase() != "select")
            {
                if(jsonMetadata !=undefined &&jsonMetadata.rspBody != null && jsonMetadata.rspBody[$(ctrl).attr("dataType")] != null)
                {
                    if($(ctrl).attr("multiple") == "multiple")
                    {
                        var strValue = "";
                        for(var keyS in jsonMetadata.rspBody[$(ctrl).attr("dataType")])
                        {
                            for(var nI=0; nI<value.split(",").length; nI++)
                            {
                                if(keyS == value.split(",")[nI])
                                {
                                    strValue = (strValue == "") ? jsonMetadata.rspBody[$(ctrl).attr("dataType")][value.split(",")[nI]] : strValue + "," + jsonMetadata.rspBody[$(ctrl).attr("dataType")][value.split(",")[nI]];
                                    break;
                                }
                            }
                        }
                        var value = strValue;
                    }
                    else
                    {
                        if($(ctrl).attr("valType") == "text")
                        {
                            for(key in jsonMetadata.rspBody[$(ctrl).attr("dataType")])
                            {
                                if(jsonMetadata.rspBody[$(ctrl).attr("dataType")][key] == value)
                                {
                                    $(ctrl).attr("valCode",key);
                                    break;
                                    //var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][key];
                                }
                            }
                        }
                        else if($(ctrl).attr("valType") == "code")
                        {
                            $(ctrl).attr("valCode",value);
                            var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][value];
                        }
                        else
                            var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][value];
                    }

                }
                if(value == null)
                    value = "";
            }
			else if($(ctrl).attr("orgType") != null && ctrl.tagName.toLowerCase() != "select")
            {
//              if(jsonOrgdata !=undefined &&jsonOrgdata.rspBody != null && jsonOrgdata.rspBody[$(ctrl).attr("orgType")] != null)
                if(jsonOrgdata !=undefined &&jsonOrgdata.rspBody != null && jsonOrgdata.rspBody.rows.length > 0 )
                {
                    if($(ctrl).attr("multiple") == "multiple")
                    {
                        var strValue = "";
                        for(var mI=0; mI<jsonOrgdata.rspBody.rows.length; mI++)
                        {
							var strOrgType = jsonOrgdata.rspBody.rows[mI][$(ctrl).attr("orgType")];
                            for(var nI=0; nI<value.split(",").length; nI++)
                            {
                                if(strOrgType == value.split(",")[nI])
                                {
                                    strValue = (strValue == "") ? jsonOrgdata.rspBody.rows[mI][$(ctrl).attr("orgText")] : strValue + "," + jsonOrgdata.rspBody.rows[mI][$(ctrl).attr("orgText")];
                                    break;
                                }
                            }
                        }
                        var value = strValue;
                    }
                    else
                    {
                        if($(ctrl).attr("valType") == "text")
                        {
							for(var nI=0; nI<jsonOrgdata.rspBody.rows.length; nI++)
                            {
                                if(jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgType")] == value)
                                {
                                    $(ctrl).attr("valCode",value);
									//var value = jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgText")];
                                    break;
                                   
                                }
                            }
                        }
                        else if($(ctrl).attr("valType") == "code")
                        {
							$(ctrl).attr("valCode",value);
							for(var nI=0; nI<jsonOrgdata.rspBody.rows.length; nI++)
                            {
                                if(jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgType")] == value)
                                {
                                   var value = jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgText")];
                                   break;
                                    //var value = jsonOrgdata.rspBody[$(ctrl).attr("dataType")][key];
                                }
                            }
                            
                        }
                        else
                        {
							for(var nI=0; nI<jsonOrgdata.rspBody.rows.length; nI++)
                            {
                                if(jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgType")] == value)
                                {
                                   var value = jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgText")];
                                   break;
                                    //var value = jsonOrgdata.rspBody[$(ctrl).attr("dataType")][key];
                                }
                            }
						}
                    }

                }
                if(value == null)
                    value = "";
            }
            else if( ctrl.tagName.toLowerCase() == "select")
            {
                if($(ctrl).attr("valType") == "text")
                {
                    for(key in jsonMetadata.rspBody[$(ctrl).attr("dataType")])
                    {
                        if(jsonMetadata.rspBody[$(ctrl).attr("dataType")][key] == value)
                        {
                            $(ctrl).attr("valCode",key);
                            var value = key;
                            break;
                            //var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][key];
                        }
                    }
                }
            }

            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "select":
                    var oJsCtrl = new clsTextCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    $(ctrl).attr("initValue",value);
                    if($(ctrl).attr("isBeauty") == null)
                        $(ctrl).trigger('chosen:updated');
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsStandardTableCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsStandardTableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsStandardTableCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

//缓存选项
function clsStandardTableCtrl$cacheChkProc(obj) {
    if (this.isCacheCond != null) {
        if (typeof(this.isCacheCond) == "function")
            this.cacheArr = this.isCacheCond(this);
        else {
            var cloneRow = $(obj).parents("*[id='" + this.cloneId + "']:first")[0];
            var isRepeat = false;
            for (var nI = this.cacheArr.length - 1; nI >= 0; nI--) {
                var ele = this.cacheArr[nI];
                if (ele[this.isCacheCond] == cloneRow.jsonData[this.isCacheCond]) {
                    if (!obj.checked)
                        this.cacheArr.splice(nI, 1);
                    isRepeat = true;
                }
            }
            if (!isRepeat)
                this.cacheArr.push(cloneRow.jsonData);
        }
        this.ctrl.cacheArr = this.cacheArr;
        this.cacheChkAfter(obj, this);
    }
}

function clsStandardTableCtrl$cacheChkAfter(obj, jsCtrl) {

}

function clsStandardTableCtrl$before() {
}

function clsStandardTableCtrl$progress(jsonItem, cloneRow) {
}

function clsStandardTableCtrl$after() {
}


/*********************************************************************************
 *                               简单表格组件2说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：标准表格，但是列数固定，超出列数自动换行，支持动态刷新和分页
 *
 *
 *
 **********************************************************************************/
function clsFixedColsTableCtrl() {
    this.ctrl = null;	//初始化对象
    this.jsonData = null;	//ajax返回结果
    this.templateRowId = null;	//行模板ID
    this.templateCellId = null;	//单元格模板ID
    this.cloneRowId = null;
    this.cloneCellId = null;
    this.colsNum = null;	//列数
    this.noDataId = null;
    this.init = clsFixedColsTableCtrl$init;
    this.parse = clsFixedColsTableCtrl$parse;
    this.refresh = clsFixedColsTableCtrl$refresh;
    this.clear = clsFixedColsTableCtrl$clear;
    this.setValue = clsFixedColsTableCtrl$setValue;
    this.before = clsFixedColsTableCtrl$before;
    this.progress = clsFixedColsTableCtrl$progress;
    this.after = clsFixedColsTableCtrl$after;
    this.page = clsFixedColsTableCtrl$page;
}

function clsFixedColsTableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("templateRowId") != null)
            this.templateRowId = this.ctrl.getAttribute("templateRowId");
        if (this.ctrl.getAttribute("templateCellId") != null)
            this.templateCellId = this.ctrl.getAttribute("templateCellId");
        if (this.ctrl.getAttribute("colsNum") != null)
            this.colsNum = this.ctrl.getAttribute("colsNum");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        this.parse();
        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));
    }
}

function clsFixedColsTableCtrl$page(strClsName) {
    $("." + strClsName).createPage({
        pageCount: this.jsonData.pages,
        current: this.jsonData.pageNum,
        parentObj: this.ctrl,
        backFn: function (p) {
            var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
            jsonCondData.pageNum = p;
            $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
            document.body.jsCtrl.ctrl = $(this)[0].parentObj;
            document.body.jsCtrl.init();
            //$(this)[0].parentObj.jsCtrl.refresh();
        }
    });
}

function clsFixedColsTableCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateRowId != null) {
        this.cloneRowId = this.templateRowId.replace("template", "clone");
        this.clear();
        var templateRow = $(this.ctrl).find("#" + this.templateRowId)[0];
        var cloneRow = templateRow.cloneNode(true);
        cloneRow.id = this.cloneId;
        cloneRow.style.display = "";

        //查无数据处理
        if (this.noDataId != null && this.jsonData.resultData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
        }
        else {
        }
        if (this.jsonData.resultData != null) {
            var flagNum = 0;
            for (var nI = 0; nI < this.jsonData.resultData.length; nI++) {
                var jsonItem = this.jsonData.resultData[nI];

                var templateCell = $(cloneRow).find("#" + this.templateCellId)[0];
                var cloneCell = templateCell.cloneNode(true);
                cloneCell.style.display = "";
                cloneCell.id = this.cloneCellId;
                cloneCell.jsonData = jsonItem;

                this.progress(jsonItem, cloneCell);
                this.setValue(jsonItem, cloneCell);

                templateCell.parentNode.insertBefore(cloneCell, templateCell);
                flagNum++;
                if (flagNum >= this.colsNum) {
                    templateRow.parentNode.insertBefore(cloneRow, templateRow);
                    cloneRow = templateRow.cloneNode(true);
                    cloneRow.style.display = "";
                    flagNum = 0;
                }
            }
            if (flagNum <= (parseInt(this.colsNum) - 1) && flagNum > 0)
                templateRow.parentNode.insertBefore(cloneRow, templateRow);
        }

    }
    this.after();
}

function clsFixedColsTableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsFixedColsTableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsFixedColsTableCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.cloneRowId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

function clsFixedColsTableCtrl$before() {
}

function clsFixedColsTableCtrl$progress(jsonItem, cloneRow) {
}

function clsFixedColsTableCtrl$after() {
}

/*********************************************************************************
 *                               简单表格3组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-12-15
 *    实现功能：一行对应多行的表格
 *
 *
 *
 **********************************************************************************/
function clsRowspanTableCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.templateId = null;
    this.cloneId = null;
    this.noDataId = null;
    this.idx = null;
    this.group = null;
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.init = clsRowspanTableCtrl$init;
    this.parse = clsRowspanTableCtrl$parse;
    this.refresh = clsRowspanTableCtrl$refresh;
    this.clear = clsRowspanTableCtrl$clear;
    this.setValue = clsRowspanTableCtrl$setValue;
    this.before = clsRowspanTableCtrl$before;
    this.progress = clsRowspanTableCtrl$progress;
    this.after = clsRowspanTableCtrl$after;
    this.page = clsRowspanTableCtrl$page;
    this.addRow = clsRowspanTableCtrl$addRow;
    this.deleteRow = clsRowspanTableCtrl$deleteRow;
    this.setChildDocAssistant = clsRowspanTableCtrl$setChildDocAssistant;
    this.addRowProcess = clsRowspanTableCtrl$addRowProcess;
}

function clsRowspanTableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("templateId") != null)
            this.templateId = this.ctrl.getAttribute("templateId");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("group") != null)
            this.group = this.ctrl.getAttribute("group").split(",");
        if (this.ctrl.getAttribute("jsonChildName") != null)
            this.jsonChildName = this.ctrl.getAttribute("jsonChildName");
        this.parse();
        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));


    }
}

function clsRowspanTableCtrl$page(strClsName) {
    $("." + strClsName).createPage({
        pageCount: this.jsonData.pages,
        current: this.jsonData.pageNum,
        parentObj: this.ctrl,
        backFn: function (p) {
            var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
            jsonCondData.pageNum = p;
            $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
            document.body.jsCtrl.ctrl = $(this)[0].parentObj;
            document.body.jsCtrl.init();
            //$(this)[0].parentObj.jsCtrl.refresh();
        }
    });
}

function clsRowspanTableCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateId != null) {
        this.cloneId = this.templateId.replace("template", "clone");
        this.clear();
        var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
        if (this.noDataId != null && this.jsonData.resultData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
        }
        else {
        }

        if (this.jsonData.resultData != null) {
            for (var nI = 0; nI < this.jsonData.resultData.length; nI++) {
                var jsonItem = this.jsonData.resultData[nI];

                var rowArray = new Array();
                if (jsonItem[this.jsonChildName] != null && jsonItem[this.jsonChildName].length > 0) {
                    for (var mI = 0; mI < jsonItem[this.jsonChildName].length; mI++) {
                        var jsonCItem = jsonItem[this.jsonChildName][mI];

                        var cloneRow = templateRow.cloneNode(true);
                        cloneRow.id = this.cloneId;
                        cloneRow.style.display = "";
                        cloneRow.jsonData = jsonItem;

                        this.progress(jsonItem, cloneRow, jsonCItem);
                        if (mI == 0) {
                            for (var xI = 0; xI < this.group.length; xI++) {
                                $(cloneRow).find("#" + this.group[xI])[0].rowSpan = jsonItem[this.jsonChildName].length;
                            }
                            //如果有序号字段，则赋值
                            if (this.idx != null)
                                $(cloneRow).find("#" + this.idx).html(nI + mI + 1);
                            //绑定新建行按钮
                            if ($(cloneRow).find("#btnAdd").length > 0) {
                                $(cloneRow).find("#btnAdd").click(function () {
                                    $(this).parents("table:first")[0].jsCtrl.addRow(this);
                                });
                            }
                            //绑定删除按钮方法
                            if ($(cloneRow).find("#btnDel").length > 0) {
                                $(cloneRow).find("#btnDel").click(function () {
                                    $(this).parents("table:first")[0].jsCtrl.deleteRow(this);
                                });
                            }
                            this.setValue(jsonItem, cloneRow);
                            this.setValue(jsonCItem, cloneRow);
                        }
                        else {
                            for (var xI = 0; xI < this.group.length; xI++) {
                                $(cloneRow).find("#" + this.group[xI])[0].rowSpan = jsonItem[this.jsonChildName].length;
                                $(cloneRow).find("#" + this.group[xI])[0].style.display = "none";
                                //$(cloneRow).find("#"+this.group[xI])[0].parentNode.removeChild($(cloneRow).find("#"+this.group[xI])[0]);
                            }
                            //如果有序号字段，则赋值
                            if (this.idx != null)
                                $(cloneRow).find("#" + this.idx).html(nI + mI + 1);
                            //绑定新建行按钮
                            if ($(cloneRow).find("#btnAdd").length > 0) {
                                $(cloneRow).find("#btnAdd").click(function () {
                                    $(this).parents("table:first")[0].jsCtrl.addRow(this);
                                });
                            }
                            //绑定删除按钮方法
                            if ($(cloneRow).find("#btnDel").length > 0) {
                                $(cloneRow).find("#btnDel").click(function () {
                                    $(this).parents("table:first")[0].jsCtrl.deleteRow(this);
                                });
                            }
                            this.setValue(jsonItem, cloneRow);
                            this.setValue(jsonCItem, cloneRow);
                        }
                        rowArray[rowArray.length] = cloneRow;
                        cloneRow.arrRow = rowArray;
                        this.setChildDocAssistant(cloneRow);
                        templateRow.parentNode.insertBefore(cloneRow, templateRow);
                        if (this.isValidate == "1")
                            initValidate(cloneRow);
                    }
                }
                else {
                    var cloneRow = templateRow.cloneNode(true);
                    cloneRow.id = this.cloneId;
                    cloneRow.style.display = "";
                    cloneRow.jsonData = jsonItem;

                    this.progress(jsonItem, cloneRow);

                    rowArray[rowArray.length] = cloneRow;
                    cloneRow.arrRow = rowArray;
                    this.setChildDocAssistant(cloneRow);
                    templateRow.parentNode.insertBefore(cloneRow, templateRow);
                    if (this.isValidate == "1")
                        initValidate(cloneRow);
                }
            }
        }
    }
    this.after();
}

function clsRowspanTableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsRowspanTableCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsRowspanTableCtrl$addRow(obj) {
    var nIdx = $(obj).parents("tr:first")[0].rowIndex + parseInt($(obj).parents("td:first").attr("rowspan"));


    for (var nI = $(obj).parents("tr:first")[0].rowIndex + 1; nI < nIdx; nI++) {
        var oRow = this.ctrl.rows[nI];
        for (var xI = 0; xI < this.group.length; xI++) {
            $(oRow).find("#" + this.group[xI])[0].rowSpan = parseInt($(oRow).find("#" + this.group[xI])[0].rowSpan) + 1;
        }
    }

    this.cloneId = this.templateId.replace("template", "clone");
    var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
    var cloneRow = templateRow.cloneNode(true);
    cloneRow.id = this.cloneId;
    cloneRow.style.display = "";
    for (var xI = 0; xI < this.group.length; xI++) {
        $(obj).parents("tr:first").find("#" + this.group[xI])[0].rowSpan = parseInt($(obj).parents("tr:first").find("#" + this.group[xI])[0].rowSpan) + 1;
        //$(obj).parents("tr:first").find("#"+this.group[xI])[0].style.display = "none";
        $(cloneRow).find("#" + this.group[xI])[0].rowSpan = parseInt($(obj).parents("tr:first").find("#" + this.group[xI])[0].rowSpan);
        $(cloneRow).find("#" + this.group[xI])[0].style.display = "none";
        //$(cloneRow).find("#"+this.group[xI])[0].parentNode.removeChild($(cloneRow).find("#"+this.group[xI])[0]);
    }

    //绑定新建行按钮
    if ($(cloneRow).find("#btnAdd").length > 0) {
        $(cloneRow).find("#btnAdd").click(function () {
            $(this).parents("table:first")[0].jsCtrl.addRow(this);
        });
    }

    //绑定删除按钮方法
    if ($(cloneRow).find("#btnDel").length > 0) {
        $(cloneRow).find("#btnDel").click(function () {
            $(this).parents("table:first")[0].jsCtrl.deleteRow(this);
        });
    }
    //如果有序号字段，重新排序?????
    //if(this.idx != null)
    //	$(cloneRow).find("#"+this.idx).html(nI+mI+1);


    cloneRow.arrRow = $(obj).parents("tr:first")[0].arrRow;
    this.addRowProcess(cloneRow)
    $(this.ctrl).find("tr")[nIdx].parentNode.insertBefore(cloneRow, $(this.ctrl).find("tr")[nIdx]);
    $(obj).parents("tr:first")[0].arrRow[$(obj).parents("tr:first")[0].arrRow.length] = cloneRow;
    if (this.isValidate == "1")
        initValidate(cloneRow);

}

function clsRowspanTableCtrl$deleteRow(obj) {
    var targetRow = $(obj).parents("tr:first")[0];
    var arrRow = targetRow.arrRow;
    var nIdx = null;
    for (var nI = 0; nI < arrRow.length; nI++) {
        if (arrRow[nI] == targetRow)
            nIdx = nI;
    }
    var newArr = new Array();
    for (var nI = 0; nI < arrRow.length; nI++) {
        arrRow[nI].arrRow = newArr;
        if (nI != nIdx)
            newArr[newArr.length] = arrRow[nI];
    }
    targetRow.arrRow = newArr;


    if (nIdx == 0) {
        for (var nI = 0; nI < newArr.length; nI++) {
            for (var xI = 0; xI < this.group.length; xI++) {
                if (nIdx == 0 && nI == 0)
                    $(newArr[nI]).find("#" + this.group[xI])[0].style.display = "";
                $(newArr[nI]).find("#" + this.group[xI])[0].rowSpan = $(newArr[nI]).find("#" + this.group[xI])[0].rowSpan - 1;
            }
        }
    }
    else {
        for (var nI = 0; nI < newArr.length; nI++) {
            for (var xI = 0; xI < this.group.length; xI++) {
                $(newArr[nI]).find("#" + this.group[xI])[0].rowSpan = $(newArr[nI]).find("#" + this.group[xI])[0].rowSpan - 1;
            }
        }
    }
    targetRow.parentNode.removeChild(targetRow);
}

function clsRowspanTableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsRowspanTableCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

function clsRowspanTableCtrl$addRowProcess(oRow) {

}

function clsRowspanTableCtrl$before() {
}

function clsRowspanTableCtrl$progress(jsonItem, cloneRow) {
}

function clsRowspanTableCtrl$after() {
}


/*********************************************************************************
 *                               简单表格4组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-12-15
 *    实现功能：一行对应多行的表格(只支持2层嵌套),json参数平级,支持序号，checkbox选择
 *
 *
 *
 **********************************************************************************/
function clsLevel2TableCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.templateParentId = null;
    this.templateChildId = null;
    this.cloneId = null;
    this.noDataId = null;
    this.idx = null;
    this.group = null;
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.init = clsLevel2TableCtrl$init;
    this.parse = clsLevel2TableCtrl$parse;
    this.refresh = clsLevel2TableCtrl$refresh;
    this.clear = clsLevel2TableCtrl$clear;
    this.setValue = clsLevel2TableCtrl$setValue;
    this.before = clsLevel2TableCtrl$before;
    this.progress = clsLevel2TableCtrl$progress;
    this.after = clsLevel2TableCtrl$after;
    this.page = clsLevel2TableCtrl$page;
    this.addRow = clsLevel2TableCtrl$addRow;
    this.deleteRow = clsLevel2TableCtrl$deleteRow;
    this.addRowAfter = clsLevel2TableCtrl$addRowAfter;
    this.deleteRowAfter = clsLevel2TableCtrl$deleteRowAfter;
    this.setChildDocAssistant = clsLevel2TableCtrl$setChildDocAssistant;
    this.addRowProcess = clsLevel2TableCtrl$addRowProcess;
}

function clsLevel2TableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("templateParentId") != null)
            this.templateParentId = this.ctrl.getAttribute("templateParentId");
        if (this.ctrl.getAttribute("templateChildId") != null)
            this.templateChildId = this.ctrl.getAttribute("templateChildId");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("group") != null)
            this.group = this.ctrl.getAttribute("group");
        if (this.ctrl.getAttribute("jsonChildName") != null)
            this.jsonChildName = this.ctrl.getAttribute("jsonChildName");
        this.parse();
        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));


    }
}

function clsLevel2TableCtrl$page(strClsName) {
    $("." + strClsName).createPage({
        pageCount: this.jsonData.pages,
        current: this.jsonData.pageNum,
        parentObj: this.ctrl,
        backFn: function (p) {
            var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
            jsonCondData.pageNum = p;
            $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
            document.body.jsCtrl.ctrl = $(this)[0].parentObj;
            document.body.jsCtrl.init();
            //$(this)[0].parentObj.jsCtrl.refresh();
        }
    });
}

function clsLevel2TableCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateChildId != null && this.templateParentId != null) {
        this.cloneParentId = this.templateParentId.replace("template", "clone");
        this.cloneChildId = this.templateChildId.replace("template", "clone");
        this.clear();
        var templateParentRow = $(this.ctrl).find("#" + this.templateParentId)[0];
        var templateChildRow = $(this.ctrl).find("#" + this.templateChildId)[0];

        if (this.noDataId != null && this.jsonData[this.jsonChildName] == null) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        else if (this.noDataId != null && this.jsonData[this.jsonChildName].length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        else if (this.noDataId != null && this.jsonData[this.jsonChildName].length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
        }
        else {
        }

        if (this.jsonData[this.jsonChildName] != null) {
            var parentValue = "";
            var rowArray = new Array();
            var num = 1;
            for (var nI = 0; nI < this.jsonData[this.jsonChildName].length; nI++) {
                var jsonItem = this.jsonData[this.jsonChildName][nI];

                var cloneChildRow = templateChildRow.cloneNode(true);
                cloneChildRow.id = this.cloneChildId;
                cloneChildRow.style.display = "";
                cloneChildRow.jsonData = jsonItem;

                var currParentValue = jsonItem[this.group];
                if (currParentValue != parentValue) {
                    rowArray = new Array();
                    num = 1;
                    var cloneParentRow = templateParentRow.cloneNode(true);
                    cloneParentRow.id = this.cloneParentId;
                    cloneParentRow.style.display = "";
                    cloneParentRow.jsonData = jsonItem;

                    this.progress(jsonItem, cloneParentRow);

                    cloneParentRow.arrRow = rowArray;
                    this.setValue(jsonItem, cloneParentRow);
                    this.setChildDocAssistant(cloneParentRow);
                    templateChildRow.parentNode.insertBefore(cloneParentRow, templateChildRow);
                    if (this.isValidate == "1")
                        initValidate(cloneParentRow);

                    parentValue = currParentValue;
                }

                if (this.idx != null) {
                    $(cloneChildRow).find("#" + this.idx).html(num);
                    num++;
                }
                this.progress(jsonItem, cloneChildRow);
                rowArray[rowArray.length] = cloneChildRow;


                //cloneRow.arrRow = rowArray;
                this.setValue(jsonItem, cloneChildRow);
                this.setChildDocAssistant(cloneChildRow);
                templateChildRow.parentNode.insertBefore(cloneChildRow, templateChildRow);
                if (this.isValidate == "1")
                    initValidate(cloneChildRow);

            }
        }
    }
    this.after();
}

function clsLevel2TableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsLevel2TableCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsLevel2TableCtrl$addRow(obj) {
    var nIdx = $(obj).parents("tr:first")[0].rowIndex + parseInt($(obj).parents("td:first").attr("rowspan"));


    for (var nI = $(obj).parents("tr:first")[0].rowIndex + 1; nI < nIdx; nI++) {
        var oRow = this.ctrl.rows[nI];
        for (var xI = 0; xI < this.group.length; xI++) {
            $(oRow).find("#" + this.group[xI])[0].rowSpan = parseInt($(oRow).find("#" + this.group[xI])[0].rowSpan) + 1;
        }
    }

    this.cloneId = this.templateId.replace("template", "clone");
    var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
    var cloneRow = templateRow.cloneNode(true);
    cloneRow.id = this.cloneId;
    cloneRow.style.display = "";
    for (var xI = 0; xI < this.group.length; xI++) {
        $(obj).parents("tr:first").find("#" + this.group[xI])[0].rowSpan = parseInt($(obj).parents("tr:first").find("#" + this.group[xI])[0].rowSpan) + 1;
        //$(obj).parents("tr:first").find("#"+this.group[xI])[0].style.display = "none";
        $(cloneRow).find("#" + this.group[xI])[0].rowSpan = parseInt($(obj).parents("tr:first").find("#" + this.group[xI])[0].rowSpan);
        $(cloneRow).find("#" + this.group[xI])[0].style.display = "none";
        //$(cloneRow).find("#"+this.group[xI])[0].parentNode.removeChild($(cloneRow).find("#"+this.group[xI])[0]);
    }

    //绑定新建行按钮
    if ($(cloneRow).find("#btnAdd").length > 0) {
        $(cloneRow).find("#btnAdd").click(function () {
            $(this).parents("table:first")[0].jsCtrl.addRow(this);
        });
    }

    //绑定删除按钮方法
    if ($(cloneRow).find("#btnDel").length > 0) {
        $(cloneRow).find("#btnDel").click(function () {
            $(this).parents("table:first")[0].jsCtrl.deleteRow(this);
        });
    }
    //如果有序号字段，重新排序?????
    //if(this.idx != null)
    //	$(cloneRow).find("#"+this.idx).html(nI+mI+1);


    cloneRow.arrRow = $(obj).parents("tr:first")[0].arrRow;
    cloneRow.jsonData = $(obj).parents("tr:first")[0].jsonData;
    this.addRowProcess(cloneRow)
    $(this.ctrl).find("tr")[nIdx].parentNode.insertBefore(cloneRow, $(this.ctrl).find("tr")[nIdx]);
    $(obj).parents("tr:first")[0].arrRow[$(obj).parents("tr:first")[0].arrRow.length] = cloneRow;
    if (this.isValidate == "1")
        initValidate(cloneRow);
    this.addRowAfter();

}

function clsLevel2TableCtrl$deleteRow(obj) {
    var targetRow = $(obj).parents("tr:first")[0];
    var arrRow = targetRow.arrRow;
    var nIdx = null;
    for (var nI = 0; nI < arrRow.length; nI++) {
        if (arrRow[nI] == targetRow)
            nIdx = nI;
    }
    var newArr = new Array();
    for (var nI = 0; nI < arrRow.length; nI++) {
        arrRow[nI].arrRow = newArr;
        if (nI != nIdx)
            newArr[newArr.length] = arrRow[nI];
    }
    targetRow.arrRow = newArr;


    if (nIdx == 0) {
        for (var nI = 0; nI < newArr.length; nI++) {
            for (var xI = 0; xI < this.group.length; xI++) {
                if (nIdx == 0 && nI == 0)
                    $(newArr[nI]).find("#" + this.group[xI])[0].style.display = "";
                $(newArr[nI]).find("#" + this.group[xI])[0].rowSpan = $(newArr[nI]).find("#" + this.group[xI])[0].rowSpan - 1;
            }
        }
    }
    else {
        for (var nI = 0; nI < newArr.length; nI++) {
            for (var xI = 0; xI < this.group.length; xI++) {
                $(newArr[nI]).find("#" + this.group[xI])[0].rowSpan = $(newArr[nI]).find("#" + this.group[xI])[0].rowSpan - 1;
            }
        }
    }
    targetRow.parentNode.removeChild(targetRow);
    this.deleteRowAfter();
}

function clsLevel2TableCtrl$addRowAfter() {

}

function clsLevel2TableCtrl$deleteRowAfter() {

}

function clsLevel2TableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsLevel2TableCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

function clsLevel2TableCtrl$addRowProcess(oRow) {

}

function clsLevel2TableCtrl$before() {
}

function clsLevel2TableCtrl$progress(jsonItem, cloneRow) {
}

function clsLevel2TableCtrl$after() {
}


/*********************************************************************************
 *                               一对多行表格组件说明(无限级)
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-12-27
 *    实现功能：一行对应多行的表格
 *
 *
 *
 **********************************************************************************/
function clsRowspanCommonTableCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.templateId = null;
    this.cloneId = null;
    this.noDataId = null;
    this.idx = null;
    this.group = null;
    this.jsonChildName = null;
    this.init = clsRowspanCommonTableCtrl$init;
    this.parse = clsRowspanCommonTableCtrl$parse;
    this.refresh = clsRowspanCommonTableCtrl$refresh;
    this.clear = clsRowspanCommonTableCtrl$clear;
    this.setValue = clsRowspanCommonTableCtrl$setValue;
    this.before = clsRowspanCommonTableCtrl$before;
    this.progress = clsRowspanCommonTableCtrl$progress;
    this.after = clsRowspanCommonTableCtrl$after;
    this.page = clsRowspanCommonTableCtrl$page;
    this.setChildDocAssistant = clsRowspanCommonTableCtrl$setChildDocAssistant;
    this.addRowProcess = clsRowspanTableCtrl$addRowProcess;
    this.getRowSpan = clsRowspanCommonTableCtrl$getRowSpan;
    this.setRowSpan = clsRowspanCommonTableCtrl$setRowSpan;
    this.deleteRow = clsRowspanCommonTableCtrl$deleteRow;
    this.deleteRowAfter = clsRowspanCommonTableCtrl$deleteRowAfter;
}

function clsRowspanCommonTableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("templateId") != null)
            this.templateId = this.ctrl.getAttribute("templateId");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("group") != null)
            this.group = JSON.parse(this.ctrl.getAttribute("group"));
        if (this.ctrl.getAttribute("jsonChildName") != null)
            this.jsonChildName = this.ctrl.getAttribute("jsonChildName");
        if (this.ctrl.getAttribute("isPage") != null)
            this.isPage = this.ctrl.getAttribute("isPage");

        this.parse();
        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));


    }
}

function clsRowspanCommonTableCtrl$page(strClsName) {
    $("." + strClsName).createPage({
        pageCount: this.jsonData.pages,
        current: this.jsonData.pageNum,
        parentObj: this.ctrl,
        backFn: function (p) {
            var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
            jsonCondData.pageNum = p;
            $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
            document.body.jsCtrl.ctrl = $(this)[0].parentObj;
            document.body.jsCtrl.init();
            //$(this)[0].parentObj.jsCtrl.refresh();
        }
    });
}

function clsRowspanCommonTableCtrl$parse() {


    /*
     * if(this.jsonData != null && this.templateId != null)
     {
     this.cloneId = this.templateId.replace("template","clone");
     this.clear();
     var templateRow = $(this.ctrl).find("#"+this.templateId)[0];
     if(this.noDataId != null && this.jsonData.resultData == null)
     {
     $("#"+this.noDataId)[0].style.display = "";
     if(this.ctrl.getAttribute("page") != null)
     $("."+this.ctrl.getAttribute("page"))[0].style.display = "none";
     }
     else if(this.noDataId != null && this.jsonData.resultData.length == 0)
     {
     $("#"+this.noDataId)[0].style.display = "";
     if(this.ctrl.getAttribute("page") != null)
     $("."+this.ctrl.getAttribute("page"))[0].style.display = "none";
     }
     else if(this.noDataId != null && this.jsonData.resultData.length > 0)
     {
     $("#"+this.noDataId)[0].style.display = "none";
     if(this.ctrl.getAttribute("page") != null)
     $("."+this.ctrl.getAttribute("page"))[0].style.display = "";
     }
     else
     {}

     if(this.jsonData.resultData != null)
     {
     for(var nI=0; nI<this.jsonData.resultData.length; nI++) {
     var jsonItem = this.jsonData.resultData[nI];
     */


    if (this.isPage == null) {
        this.before();
        if (this.jsonData != null && this.templateId != null) {
            this.cloneId = this.templateId.replace("template", "clone");
            this.clear();
            var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
            if (this.noDataId != null && this.jsonData.length == 0) {
                $("#" + this.noDataId)[0].style.display = "";
                if (this.ctrl.getAttribute("page") != null)
                    $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
            }
            else if (this.noDataId != null && this.jsonData.length > 0) {
                $("#" + this.noDataId)[0].style.display = "none";
                if (this.ctrl.getAttribute("page") != null)
                    $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
            }
            else {
            }


            for (var nI = 0; nI < this.jsonData.length; nI++) {
                var jsonItem = this.jsonData[nI];
                var rowArray = new Array();
                var cloneRow = templateRow.cloneNode(true);
                cloneRow.id = this.cloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                templateRow.parentNode.insertBefore(cloneRow, templateRow);

                for (key in this.group) {
                    this.setRowSpan(cloneRow, key, this.group[key], jsonItem[key]);
                }
                this.progress(jsonItem, cloneRow);
                this.setValue(jsonItem, cloneRow);
                if (this.idx != null)
                    $(cloneRow).find("#" + this.idx).html(nI + 1);

                //绑定删除按钮方法
                if ($(cloneRow).find("#btnDel").length > 0) {
                    $(cloneRow).find("#btnDel").click(function () {
                        $(this).parents("table:first")[0].jsCtrl.deleteRow(this);
                    });
                }
            }
        }
        this.after();
    }
    else {
        this.before();
        if (this.jsonData != null && this.templateId != null) {
            this.cloneId = this.templateId.replace("template", "clone");
            this.clear();
            var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
            if (this.noDataId != null && this.jsonData.resultData == null) {
                $("#" + this.noDataId)[0].style.display = "";
                if (this.ctrl.getAttribute("page") != null)
                    $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
            }
            else if (this.noDataId != null && this.jsonData.resultData.length == 0) {
                $("#" + this.noDataId)[0].style.display = "";
                if (this.ctrl.getAttribute("page") != null)
                    $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
            }
            else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
                $("#" + this.noDataId)[0].style.display = "none";
                if (this.ctrl.getAttribute("page") != null)
                    $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
            }

            for (var nI = 0; nI < this.jsonData.resultData.length; nI++) {
                var jsonItem = this.jsonData.resultData[nI];
                var rowArray = new Array();
                var cloneRow = templateRow.cloneNode(true);
                cloneRow.id = this.cloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                templateRow.parentNode.insertBefore(cloneRow, templateRow);

                for (key in this.group) {
                    this.setRowSpan(cloneRow, key, this.group[key], jsonItem[key]);
                }
                this.progress(jsonItem, cloneRow);
                this.setValue(jsonItem, cloneRow);
                if (this.idx != null)
                    $(cloneRow).find("#" + this.idx).html(nI + 1);
            }
        }
        else {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        this.after();
    }
}

function clsRowspanCommonTableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = (jsonItem[key] == null) ? " " : jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
            //var oCell		= (ctrl.tagName != null && ctrl.tagName == "TD") ? ctrl : $(ctrl).find("td:first");

            /*var jsonSpanData= this.getRowSpan(key,value)
             var nRowSpan	= jsonSpanData.nIdx;
             var nPos		= jsonSpanData.nPos;
             if(this.group != null && this.group != "")
             {
             var lvl = parseInt(this.group.lvl);
             for(var nI=0; nI<lvl-1; nI++)
             {
             //for(var mI=0; mI<this.group["lvl"+(nI+1)]
             }
             oCell.rowSpan	= nRowSpan;
             }
             */
        }

    }
}

function clsRowspanCommonTableCtrl$setRowSpan(cloneRow, key, lvl, value) {
    if (cloneRow.arrLvl == null)
        cloneRow.arrLvl = new Array();
    if (lvl == 1) {
        if (this.isPage == null)
            var jsonRowSapnData = this.getRowSpan(key, value, 0, this.jsonData.length);
        else
            var jsonRowSapnData = this.getRowSpan(key, value, 0, this.jsonData.resultData.length);
        cloneRow.arrLvl[lvl] = jsonRowSapnData;
    }
    else if (lvl.toString().split("#").length > 1) {
        var jsonRowSapnData = cloneRow.arrLvl[parseInt(lvl.toString().split("#")[1])];
    }
    else {
        var jsonParentRowSapnData = cloneRow.arrLvl[lvl - 1];
        var jsonRowSapnData = this.getRowSpan(key, value, jsonParentRowSapnData.nStartPos, jsonParentRowSapnData.nEndPos);
        cloneRow.arrLvl[lvl] = jsonRowSapnData;
    }
    var ctrl = $(cloneRow).find("#" + key)[0];
    var oCell = (ctrl.tagName != null && ctrl.tagName == "TD") ? ctrl : $(ctrl).parents("td:first")[0];
    if (cloneRow.rowIndex == jsonRowSapnData.nStartPos + 1) {
        oCell.rowSpan = jsonRowSapnData.nIdx;
    }
    else {
        oCell.rowSpan = jsonRowSapnData.nIdx;
        oCell.style.display = "none";
    }
}

function clsRowspanCommonTableCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsRowspanCommonTableCtrl$getRowSpan(key, value, nStartRow, nEndRow) {
    var nIdx = 0;
    var nStartPos;
    var nEndPos = nEndRow;
    if (this.isPage == null) {
        for (var nI = nStartRow; nI < nEndRow; nI++) {
            var jsonItem = this.jsonData[nI];
            if (jsonItem[key] == value) {
                if (nIdx > 0) {
                    nEndPos = nI;
                }	//return {"nIdx":nIdx,"nStartPos":nStartPos,"nEndPos":nI};
                else
                    nStartPos = nI;
                nIdx++;

            }
            else if (nIdx > 0) {
                nEndPos = nI - 1;
                break;
                //nIdx++;
            }

        }
        if (nEndPos < this.jsonData.length)
            nEndPos++
    }
    else {
        for (var nI = nStartRow; nI < nEndRow; nI++) {
            var jsonItem = this.jsonData.resultData[nI];
            if (jsonItem[key] == value) {
                if (nIdx > 0) {
                    nEndPos = nI;
                }	//return {"nIdx":nIdx,"nStartPos":nStartPos,"nEndPos":nI};
                else
                    nStartPos = nI;
                nIdx++;

            }
            else if (nIdx > 0) {
                nEndPos = nI - 1;
                break;
                //nIdx++;
            }

        }
        if (nEndPos < this.jsonData.resultData.length)
            nEndPos++
    }
    return {"nIdx": nIdx, "nStartPos": nStartPos, "nEndPos": nEndPos};
}

function clsRowspanCommonTableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsRowspanCommonTableCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

function clsRowspanCommonTableCtrl$addRowProcess(oRow) {

}

function clsRowspanCommonTableCtrl$before() {
}

function clsRowspanCommonTableCtrl$progress(jsonItem, cloneRow) {
}

function clsRowspanCommonTableCtrl$after() {
}

function clsRowspanCommonTableCtrl$deleteRow(obj) {
    var oRow = $(obj).parents("tr:first")[0];
    var jsonData = $(obj).parents("table:first")[0].jsCtrl.jsonData;
    for (var nI = 0; nI < jsonData.length; nI++) {
        if (jsonData[nI] == oRow.jsonData) {
            jsonData.splice(nI, 1);
            break;
        }
    }
    $(obj).parents("table:first")[0].jsCtrl.jsonData = jsonData;
    $(obj).parents("table:first")[0].jsCtrl.refresh();
    this.deleteRowAfter(obj);
}

function clsRowspanCommonTableCtrl$deleteRowAfter(obj) {
}


/*********************************************************************************
 *                               块状表格组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：数据行块状显示，每块数据显示为rowspan模式
 *
 *
 *
 **********************************************************************************/
function clsRowspanBlockTableCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.templateParentId = null;	//最外层模板id
    this.templateChildId = null;	//分组行模板id
    this.cloneId = null;
    this.noDataId = null;
    this.idx = null;
    this.group = null;
    this.jsonChildName = null;
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.nStartStep = 1;
    this.init = clsRowspanBlockTableCtrl$init;
    this.parse = clsRowspanBlockTableCtrl$parse;
    this.refresh = clsRowspanBlockTableCtrl$refresh;
    this.clear = clsRowspanBlockTableCtrl$clear;
    this.setValue = clsRowspanBlockTableCtrl$setValue;
    this.before = clsRowspanBlockTableCtrl$before;
    this.progress = clsRowspanBlockTableCtrl$progress;
    this.blockAfter = clsRowspanBlockTableCtrl$blockAfter;
    this.after = clsRowspanBlockTableCtrl$after;
    this.page = clsRowspanBlockTableCtrl$page;
    this.setChildDocAssistant = clsRowspanBlockTableCtrl$setChildDocAssistant;
    this.setRowSpan = clsRowspanBlockTableCtrl$setRowSpan;
    this.getRowSpan = clsRowspanBlockTableCtrl$getRowSpan;
}

function clsRowspanBlockTableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("templateParentId") != null)
            this.templateParentId = this.ctrl.getAttribute("templateParentId");
        if (this.ctrl.getAttribute("templateChildId") != null)
            this.templateChildId = this.ctrl.getAttribute("templateChildId");
        if (this.ctrl.getAttribute("group") != null)
            this.group = JSON.parse(this.ctrl.getAttribute("group"));
        if (this.ctrl.getAttribute("jsonChildName") != null)
            this.jsonChildName = this.ctrl.getAttribute("jsonChildName");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("nStartStep") != null)
            this.nStartStep = parseInt(this.ctrl.getAttribute("nStartStep"));

        this.parse();
        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));


    }
}

function clsRowspanBlockTableCtrl$page(strClsName) {
    $("." + strClsName).createPage({
        pageCount: this.jsonData.pages,
        current: this.jsonData.pageNum,
        parentObj: this.ctrl,
        backFn: function (p) {
            var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
            jsonCondData.pageNum = p;
            $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
            document.body.jsCtrl.ctrl = $(this)[0].parentObj;
            document.body.jsCtrl.init();
            //$(this)[0].parentObj.jsCtrl.refresh();
        }
    });
}

function clsRowspanBlockTableCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateParentId != null) {

        this.cloneId = this.templateParentId.replace("template", "clone");
        this.clear();
        var templateRow = $(this.ctrl).find("#" + this.templateParentId)[0];
        if (this.noDataId != null && this.jsonData.resultData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
        }
        else {
        }
        if (this.jsonData.resultData != null) {
            for (var nI = 0; nI < this.jsonData.resultData.length; nI++) {
                var jsonItem = this.jsonData.resultData[nI];
                var cloneRow = templateRow.cloneNode(true);
                cloneRow.id = this.cloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                this.progress(jsonItem, cloneRow);
                //如果有序号字段，则赋值
                if (this.idx != null)
                    $(cloneRow).find("#" + this.idx).html(nI + 1);
                this.setValue(jsonItem, cloneRow);


                if (jsonItem[this.jsonChildName] != null) {
                    var templateChildRow = $(cloneRow).find("#" + this.templateChildId)[0];
                    var rowArray = new Array();
                    for (var mI = 0; mI < jsonItem[this.jsonChildName].length; mI++) {
                        var jsonCItem = jsonItem[this.jsonChildName][mI];

                        var cloneChildRow = templateChildRow.cloneNode(true);
                        cloneChildRow.id = this.templateChildId.replace("template", "clone");
                        cloneChildRow.style.display = "";
                        cloneChildRow.jsonData = jsonCItem;
                        templateChildRow.parentNode.insertBefore(cloneChildRow, templateChildRow);
                        rowArray[rowArray.length] = cloneChildRow;
                        cloneChildRow.arrRow = rowArray;
                        for (key in this.group) {
                            this.setRowSpan(cloneChildRow, key, this.group[key], jsonCItem[key], jsonItem);
                        }
                        this.progress(jsonCItem, cloneChildRow);
                        this.setValue(jsonCItem, cloneChildRow);
                        if (this.idx != null)
                            $(cloneChildRow).find("#" + this.idx).html(mI + 1);
                    }
                    this.blockAfter(cloneRow, jsonItem);
                }


                this.setChildDocAssistant(cloneRow);
                templateRow.parentNode.insertBefore(cloneRow, templateRow);
                if (this.isValidate == "1")
                    initValidate(cloneRow);
            }


            /*





             */
        }

    }
    this.after();

}

function clsRowspanBlockTableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsRowspanBlockTableCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsRowspanBlockTableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsRowspanBlockTableCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

function clsRowspanBlockTableCtrl$setRowSpan(cloneRow, key, lvl, value, jsonData) {
    if (cloneRow.arrLvl == null)
        cloneRow.arrLvl = new Array();
    if (lvl == 1) {
        if (this.isPage == null)
            var jsonRowSapnData = this.getRowSpan(key, value, 0, jsonData[this.jsonChildName].length, jsonData);
        else
            var jsonRowSapnData = this.getRowSpan(key, value, 0, jsonData[this.jsonChildName].length, jsonData);
        cloneRow.arrLvl[lvl] = jsonRowSapnData;
    }
    else if (lvl.toString().split("#").length > 1) {
        var jsonRowSapnData = cloneRow.arrLvl[parseInt(lvl.toString().split("#")[1])];
    }
    else {
        var jsonParentRowSapnData = cloneRow.arrLvl[lvl - 1];
        var jsonRowSapnData = this.getRowSpan(key, value, jsonParentRowSapnData.nStartPos, jsonParentRowSapnData.nEndPos, jsonData);
        cloneRow.arrLvl[lvl] = jsonRowSapnData;
    }
    var ctrl = $(cloneRow).find("#" + key)[0];
    var oCell = (ctrl.tagName != null && ctrl.tagName == "TD") ? ctrl : $(ctrl).parents("td:first")[0];
    if (cloneRow.rowIndex == jsonRowSapnData.nStartPos + this.nStartStep) {
        oCell.rowSpan = jsonRowSapnData.nIdx;
    }
    else {
        oCell.rowSpan = jsonRowSapnData.nIdx;
        oCell.style.display = "none";
    }
}


function clsRowspanBlockTableCtrl$getRowSpan(key, value, nStartRow, nEndRow, jsonData) {
    var nIdx = 0;
    var nStartPos;
    var nEndPos = nEndRow;
    if (this.isPage == null) {
        for (var nI = nStartRow; nI < nEndRow; nI++) {
            var jsonItem = jsonData[this.jsonChildName][nI];
            if (jsonItem[key] == value) {
                if (nIdx > 0) {
                    nEndPos = nI;
                }	//return {"nIdx":nIdx,"nStartPos":nStartPos,"nEndPos":nI};
                else
                    nStartPos = nI;
                nIdx++;

            }
            else if (nIdx > 0) {
                nEndPos = nI - 1;
                break;
                //nIdx++;
            }

        }
        if (nEndPos < jsonData[this.jsonChildName].length)
            nEndPos++
    }
    else {
        for (var nI = nStartRow; nI < nEndRow; nI++) {
            var jsonItem = jsonData[this.jsonChildName][nI];
            if (jsonItem[key] == value) {
                if (nIdx > 0) {
                    nEndPos = nI;
                }	//return {"nIdx":nIdx,"nStartPos":nStartPos,"nEndPos":nI};
                else
                    nStartPos = nI;
                nIdx++;

            }
            else if (nIdx > 0) {
                nEndPos = nI - 1;
                break;
                //nIdx++;
            }

        }
        if (nEndPos < jsonData[this.jsonChildName].length)
            nEndPos++
    }
    return {"nIdx": nIdx, "nStartPos": nStartPos, "nEndPos": nEndPos};
}

function clsRowspanBlockTableCtrl$blockAfter() {
}

function clsRowspanBlockTableCtrl$before() {
}

function clsRowspanBlockTableCtrl$progress(jsonItem, cloneRow) {
}

function clsRowspanBlockTableCtrl$after() {
}

/*********************************************************************************
 *                               全选控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：通过ID绑定表格，并且自动全选，支持业务自定义接口，支持得到选中
 *    checkbox的list集合
 *
 *
 **********************************************************************************/
function clsCheckAllCtrl() {
    this.ctrl = null;
    this.bindTableCtrl = null;
    this.chkList = null;
    //this.userFunc		= null;
    this.init = clsCheckAllCtrl$init;
    this.parse = clsCheckAllCtrl$parse;
    this.getSelList = clsCheckAllCtrl$getSelList;
    this.checkedAll = clsCheckAllCtrl$checkedAll;
    this.clearAll = clsCheckAllCtrl$clearAll;
    this.after = clsCheckAllCtrl$after;
}

function clsCheckAllCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("unionTableId") != null) {
            this.bindTableCtrl = $("#" + this.ctrl.getAttribute("unionTableId"))[0];
            //if(this.ctrl.getAttribute("userFunc") != null)
            //	this.userFunc = this.ctrl.getAttribute("userFunc");

            this.parse();
        }
    }
}

function clsCheckAllCtrl$parse() {
    if ($(this.ctrl).attr("chkId") != null)
        this.chkList = $(this.bindTableCtrl).find("*[id^='clone']").find("input[id='" + $(this).attr("chkId") + "'][isSel!='0']");
    else
        this.chkList = $(this.bindTableCtrl).find("*[id^='clone']").find("input[type='checkbox'][isSel!='0']");

    $(this.ctrl).click(function (event) {
        var flag = $(this)[0].checked;
        var objChkAll = this;
        //if($(this).attr("sort") != "1")
        //{
        if ($(this).attr("chkId") != null) {
            $(this)[0].jsCtrl.chkList = $($(this)[0].jsCtrl.bindTableCtrl).find("*[id^='clone']").find("input[id='" + $(this).attr("chkId") + "'][isSel!='0']");
            $(this)[0].jsCtrl.chkList.each(function () {
                $(this)[0].checked = flag;
                selColor4Tr(this.oRow,flag,this);
                objChkAll.jsCtrl.bindTableCtrl.jsCtrl.cacheChkProc($(this)[0]);
            });

        }
        else {
            $(this)[0].jsCtrl.chkList = $($(this)[0].jsCtrl.bindTableCtrl).find("*[id^='clone']").find("input[type='checkbox'][isSel!='0']");
            $(this)[0].jsCtrl.chkList.each(function () {
                $(this)[0].checked = flag;
                selColor4Tr(this.oRow,flag,this);
                objChkAll.jsCtrl.bindTableCtrl.jsCtrl.cacheChkProc($(this)[0]);
            });
        }
        for (var nI = 0; nI < $(this)[0].jsCtrl.chkList.length; nI++) {
            $(this)[0].jsCtrl.chkList[nI].jsCtrl = $(this)[0].jsCtrl;
            $($(this)[0].jsCtrl.chkList[nI]).unbind("click");
            $($(this)[0].jsCtrl.chkList[nI]).click(function () {
                var flag = true;
                this.jsCtrl.chkList.each(function () {
                    if (!this.checked)
                        flag = false;
                });
                this.jsCtrl.ctrl.checked = flag;
                this.jsCtrl.after();
                this.jsCtrl.bindTableCtrl.jsCtrl.cacheChkProc(this);
                this.jsCtrl.bindTableCtrl.jsCtrl.chkAfter(this.oRow,this.checked,this);
                selColor4Tr(this.oRow,this.checked,this);
            });
        }
        /*}
         else
         {
         $(this)[0].jsCtrl.chkList.each(function(){
         $(this)[0].checked = flag;
         });
         }*/
        $(this)[0].jsCtrl.after();
    });

    for (var nI = 0; nI < this.chkList.length; nI++) {
        this.chkList[nI].jsCtrl = this;
        $(this.chkList[nI]).click(function () {
            var flag = true;
            this.jsCtrl.chkList.each(function () {
                if (!this.checked)
                    flag = false;
            });
            this.jsCtrl.ctrl.checked = flag;
            this.jsCtrl.after();
            selColor4Tr(this.oRow,this.checked,this);
            //$(this)[0].jsCtrl.bindTableCtrl.jsCtrl.cacheChkProc($(this)[0]);
        });
    }
    //$(this.ctrl).attr("sort","0");

}

function clsCheckAllCtrl$getSelList() {
    if ($(this.ctrl).attr("chkId") != null) {
        return $(this.bindTableCtrl).find("input[id='" + $(this.ctrl).attr("chkId") + "']:checked");
    }
    else {
        return $(this.bindTableCtrl).find("input[type='checkbox']:checked");
    }
}

function clsCheckAllCtrl$checkedAll() {
    if ($(this.ctrl).attr("chkId") != null) {
        $(this.bindTableCtrl).find("input[id='" + $(this.ctrl).attr("chkId") + "']:checked").each(function () {
            $(this)[0].checked = true;
        });
    }
    else {
        $(this.bindTableCtrl).find("input[type='checkbox']:checked").each(function () {
            $(this)[0].checked = true;
        });
    }
}

function clsCheckAllCtrl$clearAll() {
    if ($(this.ctrl).attr("chkId") != null) {
        $(this.bindTableCtrl).find("input[id='" + $(this.ctrl).attr("chkId") + "']:checked").each(function () {
            $(this)[0].checked = false;
        });
    }
    else {
        $(this.bindTableCtrl).find("input[type='checkbox']:checked").each(function () {
            $(this)[0].checked = false;
        });
    }
}

function clsCheckAllCtrl$after() {

}

/*********************************************************************************
 *                               其他HTML控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：对其他控件赋值或者初始化，其他控件包括div,span,li,image等。。。
 *
 *
 *
 **********************************************************************************/
function clsOtherCtrl() {
    this.ctrl = null;
    this.jsonData = null;
    this.setValue = clsOtherCtrl$setValue;
    this.getValue = clsOtherCtrl$getValue;
}

function clsOtherCtrl$setValue(value) {
    this.ctrl.jsonData = this.jsonData;
    if (this.ctrl.getAttribute("unit") != null)
        this.ctrl.innerHTML = this.ctrl.getAttribute("unit") + value;
    else
        this.ctrl.innerHTML = (value == null) ? "" : value;
}

function clsOtherCtrl$getValue(key, type) {
    return (type == null) ? $(this.ctrl).text() : this.ctrl.jsonData;
}

function clsACtrl() {
    this.ctrl = null;
    this.jsonData = null;
    this.setValue = clsACtrl$setValue;
    this.getValue = clsACtrl$getValue;
}

function clsACtrl$setValue(value) {
    this.ctrl.jsonData = this.jsonData;
    if (this.ctrl.getAttribute("showValue") != null)
        this.ctrl.innerHTML = this.jsonData[this.ctrl.getAttribute("showValue")];
    this.ctrl.href = value;
}

function clsACtrl$getValue(key, type) {
    return (type == null) ? $(this.ctrl).attr("href") : this.ctrl.jsonData;
}

function clsCheckboxCtrl() {
    this.ctrl = null;
    this.jsonData = null;
    this.setValue = clsCheckboxCtrl$setValue;
    this.getValue = clsCheckboxCtrl$getValue;
	this.setCodeValue = clsCheckboxCtrl$setCodeValue;
}

function clsCheckboxCtrl$setValue(value) {
    this.ctrl.jsonData = this.jsonData;
    this.ctrl.checked = (value == "1") ? true : false;
    $(this.ctrl).attr("val",value);
}

function clsCheckboxCtrl$setCodeValue(value) {
    this.ctrl.jsonData = this.jsonData;
    this.ctrl.checked = (value == "1") ? true : false;
    $(this.ctrl).attr("val",value);
    $(this.ctrl).attr("codeVal",value);
}

function clsCheckboxCtrl$getValue(key, type) 
{
	if($(this.ctrl).attr("codeVal") == null)
		return (type == null) ? $(this.ctrl).attr("val") : this.ctrl.jsonData;
	else
		return (type == null) ? $(this.ctrl).attr("codeVal") : this.ctrl.jsonData;
}

function clsRadioCtrl() {
    this.ctrl = null;
    this.jsonData = null;
    this.setValue = clsRadioCtrl$setValue;
    this.getValue = clsRadioCtrl$getValue;
}

function clsRadioCtrl$setValue(value) {
    this.ctrl.jsonData = this.jsonData;
    $(this.ctrl).find("input[type='radio']").each(function () {
        if ($(this).attr("val") == value)
            this.checked = true;
    });
}

function clsRadioCtrl$getValue(key, type) {
    var returnVal = "";
    $(this.ctrl).find("input[type='radio']").each(function () {
        if (this.checked)
            returnVal = (type == null) ? $(this).attr("val") : this.ctrl.jsonData;
    });
    return returnVal;
}

function clsTextCtrl() {
    this.ctrl = null;
    this.jsonData		= null;
    this.setValue		= clsTextCtrl$setValue;
    this.getValue		= clsTextCtrl$getValue;
	this.setCodeValue	= clsTextCtrl$setCodeValue;
}

function clsTextCtrl$setValue(value) {
    this.ctrl.jsonData = this.jsonData;
    this.ctrl.value = value;
}

function clsTextCtrl$setCodeValue(value) {
    this.ctrl.jsonData = this.jsonData;
    $(this.ctrl).attr("codeVal",value);
}

function clsTextCtrl$getValue() 
{
	if($(this.ctrl).attr("codeVal") == null)
		return this.ctrl.value;
	else
		return $(this.ctrl).attr("codeVal");
}

function clsImgCtrl() {
    this.ctrl = null;
    this.jsonData = null;
    this.setValue = clsImgCtrl$setValue;
    this.getValue = clsImgCtrl$getValue;
}

function clsImgCtrl$setValue(value) {
    if ($(this.ctrl).attr("ImgSize") != null) {
        var imgType = value.substring(value.lastIndexOf('.') + 1);
        value = value + "_" + $(this.ctrl).attr("ImgSize") + imgType;//例如http://xxx.jpg_100x100.jpg
    }
    this.ctrl.jsonData = this.jsonData;
    this.ctrl.src = value;
}

function clsImgCtrl$getValue(key, type) {
    return (type == null) ? $(this.ctrl).attr("href") : this.ctrl.jsonData;
}

function clsSelectCtrl() {
    this.ctrl = null;
    this.jsonData = null;
    this.setValue = clsSelectCtrl$setValue;
    this.getValue = clsSelectCtrl$getValue;
    this.getText  = clsSelectCtrl$getText;
}

function clsSelectCtrl$setValue(value) {
    this.ctrl.jsonData = this.jsonData;

    if($(this.ctrl).attr("multiple") == "multiple")
    {
        for(var nI=0; nI<$(this.ctrl).find("option").length; nI++)
        {
            var oOption = $(this.ctrl).find("option")[nI];
            for(var mI=0; mI<value.split(",").length; mI++)
            {
                if($(oOption).attr("value") == value.split(",")[mI])
                {
                    oOption.selected = "selected";
                    break;
                }
            }
        }
    }
    else
        this.ctrl.value = value;
}

function clsSelectCtrl$getValue() {
    if($(this.ctrl).attr("multiple") == "multiple")
    {
        var strValue = "";
        for(var nI=0; nI<$(this.ctrl).find("option").length; nI++)
        {
            if($(this.ctrl).find("option").eq(nI).attr("selected") == "selected")
            {
                strValue = (strValue == "") ? $(this.ctrl).find("option").eq(nI).val() : strValue + "," + $(this.ctrl).find("option").eq(nI).val();
            }
        }
        return strValue;
    }
    else
        return this.ctrl.value;
}

function clsSelectCtrl$getText()
{
    if($(this.ctrl).find("option:selected").attr("realText") == null)
        return $(this.ctrl).find("option:selected").text();
    else
        return $(this.ctrl).find("option:selected").attr("realText");
}

/*********************************************************************************
 *                               清空所有查询条件控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-08-01
 *    实现功能：通过对指定id进行值清空操作
 *
 *
 *
 **********************************************************************************/
function clsClearAllCondCtrl() {
    this.ctrl = null;
    this.jsonData = null;
    this.bindCtrlId = null;
    this.parentId = null;
    this.setValue = clsClearAllCondCtrl$setValue;
    this.init = clsClearAllCondCtrl$init;			//初始化参数和给按钮绑定删除方法
    this.clearAll	= clsClearAllCondCtrl$clearAll;		//供外部直接调用清除内容
    this.after		= clsClearAllCondCtrl$after;
}

function clsClearAllCondCtrl$setValue() {
}

function clsClearAllCondCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("parentId") != null)
            this.parentId = this.ctrl.getAttribute("parentId");
        if (this.ctrl.getAttribute("bindCtrlId") != null)
            this.bindCtrlId = this.ctrl.getAttribute("bindCtrlId");
        $(this.ctrl).click(function () {
            var ctrl = $(this)[0].jsCtrl.ctrl;
            if (ctrl.getAttribute("bindCtrlId") != null) {
                var bindCtrlId = $(this)[0].jsCtrl.bindCtrlId;
                for (var nI = 0; nI < bindCtrlId.split(",").length; nI++) {
                    if (this.jsCtrl.parentId == null)
                        var ele = $("#" + bindCtrlId.split(",")[nI])[0];
                    else
                        var ele = $("#" + this.jsCtrl.parentId).find("#" + bindCtrlId.split(",")[nI])[0];
                    if (ele != null) {
                        switch (ele.tagName.toLowerCase()) {
                            case "input":
                                if (ele.type == "text")
                                    ele.value = "";
                                else if (ele.type == "checkbox")
                                {
                                    ele.checked = false;
                                    $(ele).attr("val",0);
                                }
                                else
                                    ele.value = "";
                                break;
                            case "textarea":
                                ele.value = "";
                                break;
                            case "select":
                                ele.value = "";
                                if (ele.getAttribute("comType") == "unionSelectCtrl") {
                                    var unionSel = ele.getAttribute("unionSel");
                                    for (var mI = 0; mI < unionSel.split(",").length; mI++) {
                                        var ctrlId = unionSel.split(",")[mI];
                                        if (ctrlId != null) {
                                            if (this.jsCtrl.parentId == null)
                                                var obj = document.getElementById(ctrlId);
                                            else
                                                var obj = $("#" + this.jsCtrl.parentId).find("#" + ctrlId)[0];
                                            obj.innerHTML = "";
                                            $addoOption(obj, "", ele.getAttribute("emptyValue"), "");
                                            $(obj).trigger('chosen:updated');
                                        }
                                    }
                                }
                                $(ele).trigger('chosen:updated');
                                break;
                            default:
                                if (ele.getAttribute("radiosList") == "list") {
                                    $(ele).find("input").each(function () {
                                        $(this).prop("checked", false);
                                    });
                                }
                                else
                                    $(ele).text("");
                                break;
                        }
                    }
                }
            }
            this.jsCtrl.after();
        });

    }
}

function clsClearAllCondCtrl$clearAll() {

    if (this.ctrl.getAttribute("bindCtrlId") != null) {
        var bindCtrlId = $(this)[0].jsCtrl.bindCtrlId;
        for (var nI = 0; nI < bindCtrlId.split(",").length; nI++) {
            if (this.jsCtrl.parentId == null)
                var ele = $("#" + bindCtrlId.split(",")[nI])[0];
            else
                var ele = $("#" + this.parentId).find("#" + bindCtrlId.split(",")[nI])[0];
            if (ele != null) {
                switch (ele.tagName.toLowerCase()) {
                    case "input":
                        if (ele.type == "text")
                            ele.value = "";
                        else if (ele.type == "checkbox")
                        {
                            ele.checked = false;
                            $(ele).attr("val",0);
                        }
                        else
                            ele.value = "";
                        break;
                    case "textarea":
                        ele.value = "";
                        break;
                    case "select":
                        ele.value = "";
                        if (ele.getAttribute("comType") == "unionSelectCtrl") {
                            var unionSel = ele.getAttribute("unionSel");
                            for (var mI = 0; mI < unionSel.split(",").length; mI++) {
                                var ctrlId = unionSel.split(",")[mI];
                                if (ctrlId != null) {
                                    if (this.parentId == null)
                                        var obj = document.getElementById(ctrlId);
                                    else
                                        var obj = $("#" + this.parentId).find("#" + ctrlId)[0];
                                    obj.innerHTML = "";
                                    $addoOption(obj, "", ele.getAttribute("emptyValue"), "");
                                    $(obj).trigger('chosen:updated');
                                }
                            }
                        }
                        $(ele).trigger('chosen:updated');
                        break;
                    default:
                        if (ele.getAttribute("radiosList") == "list") {
                            $(ele).find("input").each(function () {
                                $(this).prop("checked", false);
                            });
                        }
                        else
                            $(ele).text("");
                        break;
                }
            }
        }
    }
}

function clsClearAllCondCtrl$after()
{

}

/*********************************************************************************
 *                               弹出提示框控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-08-01
 *    实现功能：支持成功，失败提示框
 *
 *
 *
 **********************************************************************************/
function clsMessageBoxCtrl() {
    this.html = "";
    this.ctrl = null;			//点击弹出窗口触发的按钮对象
    this.messageCtrl = null;			//弹出层对象
    this.title = "信息提示";	//弹出框标题
    this.content = "";			//弹出框内容不能超过20个字
    this.subcontent = "";			//弹出框内容不能超过20个字
    this.btnContent = {}        //按钮样式和按钮内容 {"btnone":按钮文字,"btnSecond":按钮文字}
    this.messageCls = "popup";		//弹出框className
    this.messageType = "error";		//弹出框类型，error:错误   success:成功
    this.defineFunc = null;			//自定义方法，点击确定按钮自动调用
    this.isBind = "1";			//是否绑定方法，如果为0，则只初始化模板，自己调用方法
    this.template = clsMessageBoxCtrl$template;
    this.init = clsMessageBoxCtrl$init;
    this.parse = clsMessageBoxCtrl$parse;
    this.bind = clsMessageBoxCtrl$bind;
    this.openWin = clsMessageBoxCtrl$openWin;
    this.openSelWin = clsMessageBoxCtrl$openSelWin;
    this.after = clsMessageBoxCtrl$after;
}

function clsMessageBoxCtrl$init() {
    if (this.ctrl.getAttribute("messageType") != null)
        this.messageType = this.ctrl.getAttribute("messageType");
    if (this.ctrl.getAttribute("title") != null)
        this.title = this.ctrl.getAttribute("title");
    if (this.ctrl.getAttribute("content") != null)
        this.content = this.ctrl.getAttribute("content");
    if (this.ctrl.getAttribute("subcontent") != null)
        this.subcontent = this.ctrl.getAttribute("subcontent");
    if (this.ctrl.getAttribute("btnContent") != null)
        this.btnContent = this.ctrl.getAttribute("btnContent");
    if (this.ctrl.getAttribute("defineFunc") != null)
        this.defineFunc = this.ctrl.getAttribute("defineFunc");
    if (this.ctrl.getAttribute("isBind") != null)
        this.isBind = this.ctrl.getAttribute("isBind");

    this.parse();
    if (this.isBind == "1") {
        $(this.ctrl).click(function () {
            this.jsCtrl.ctrl = this;
            this.jsCtrl.messageCtrl.innerHTML = this.jsCtrl.html;

            var btnContent = this.jsCtrl.btnContent;
            if (!$.isEmptyObject(btnContent)) {
                btnContent = JSON.parse(btnContent)
            }
            var btnSecond = "取消";
            if (btnContent.btnSecond) {
                btnSecond = btnContent.btnSecond;
            }
            var btnOne = "返回";
            if (btnContent.btnOne) {
                btnOne = btnContent.btnOne;
            }
            $(this.jsCtrl.messageCtrl).find(".btnOne").html(btnOne)
            $(this.jsCtrl.messageCtrl).find(".btnSecond").html(btnSecond)
            $(this.jsCtrl.messageCtrl).find(".title h2").html(this.jsCtrl.title)
            $(this.jsCtrl.messageCtrl).find(".main-tipinfo").html(this.jsCtrl.content)

            this.jsCtrl.openWin();
            this.jsCtrl.bind();
        });
    }
}

function clsMessageBoxCtrl$parse() {

    if (document.getElementById("messageBoxWin") == null) {
        this.template();
        this.messageCtrl = document.createElement("div");
        this.messageCtrl.id = "messageBoxWin";
        this.messageCtrl.className = "popup";
        this.messageCtrl.style.display = "none";
        this.messageCtrl.style.zIndex = 1000;
        document.body.appendChild(this.messageCtrl);
    }
    else {
        this.template();
        this.messageCtrl = document.getElementById("messageBoxWin");
    }
    switch (this.messageType) {
        case "error":	//错误提示
            $(this.messageCtrl).removeClass("sucpop");
            break;
        case "success":	//成功提示
            $(this.messageCtrl).addClass("sucpop");
        case "tip"://提示
            $(this.messageCtrl).addClass("tip");
            break;
    }
    this.messageCtrl.innerHTML = this.html;
}

function clsMessageBoxCtrl$openSelWin() {
    this.parse();
    this.openWin();
}


function clsMessageBoxCtrl$bind() {

    $(this.messageCtrl).find(".btnOne").unbind();
    $(this.messageCtrl).find(".btnSecond").unbind();

    $(this.messageCtrl).find(".btnOne").click(this.ctrl, function (event) {
        closePopupWin();
        if (event.data.jsCtrl.defineFunc != null)
            eval(event.data.jsCtrl.defineFunc);
        event.data.jsCtrl.after();

    });

    $(this.messageCtrl).find(".btnSecond").click(function () {
        hideAllErrInfo(this.messageCtrl);
        closePopupWin();
    });
}

//弹出方法
function clsMessageBoxCtrl$openWin() {
    openWin(400, 220, "messageBoxWin", true);
}

//弹出窗口模板
function clsMessageBoxCtrl$template() {
    //this.html = this.html + "<div id='messageBoxWin' class='popup' style='display:none;z-index:1000;'>";
    this.html = this.html + "<div class='title'>";
    this.html = this.html + "<h2>" + this.title + "</h2>";
    this.html = this.html + "<div>";
    this.html = this.html + "<a class='min' href='javascript:;' title='最小化' style='display:none;'></a>";
    this.html = this.html + "<a class='max' href='javascript:;' title='最大化' style='display:none;'></a>";
    this.html = this.html + "<a class='revert' href='javascript:;' title='还原' style='display:none;'></a>";
    this.html = this.html + "<a class='close' href='javascript:;' title='关闭'></a>";
    this.html = this.html + "</div>";
    this.html = this.html + "</div>";
    this.html = this.html + "<div class='content'>";
    this.html = this.html + "<div class='main'>";
    this.html = this.html + "<div class='cell'>";
    this.html = this.html + "<i></i>";
    this.html = this.html + "<div class='tipinfoCon'>"
    this.html = this.html + "<p class='main-tipinfo'>" + this.content + "</p>"
    this.html = this.html + "<p class='sub-tipinfo'><i></i>" + this.subcontent + "</p>"
    this.html = this.html + "</div>";
    this.html = this.html + "</div>";
    this.html = this.html + "</div>";
    this.html = this.html + "<div class='btn'>";
    this.html = this.html + "<a href='javascript:' class='btnOne btnStyle1 mr10'>确 定</a>";
    if (this.messageType != "success")
        this.html = this.html + "<a href='javascript:' class='btnSecond btnStyle1_1'>返回</a>";
    this.html = this.html + "</div>";
    this.html = this.html + "</div>";
    //this.html = this.html + "</div>";
}

function clsMessageBoxCtrl$after() {

}

/*********************************************************************************
 *                               查询按钮控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-08-01
 *    实现功能：支持成功，失败提示框
 *
 *
 *
 **********************************************************************************/
function clsSearchBtnCtrl() {
    this.ctrl = null;			//查询按钮对象
    this.cond = null;			//查询条件
    this.rule = null;			//生成条件json规则
    this.unionTableId = null;			//关联表格ID，此表格必须有comType属性
    this.parentId = null;
    this.before = clsSearchBtnCtrl$before;			//自定义方法，点击查询按钮自动调用
    this.progress = clsSearchBtnCtrl$progress;		//自定义方法，点击查询按钮自动调用
    this.after = clsSearchBtnCtrl$after;			//自定义方法，点击查询按钮自动调用
    this.init = clsSearchBtnCtrl$init;
    this.parse = clsSearchBtnCtrl$parse;
    this.getCond = clsSearchBtnCtrl$getCond;
}

function clsSearchBtnCtrl$init() {
    if (this.ctrl.getAttribute("cond") != null)
        this.cond = this.ctrl.getAttribute("cond");
    if (this.ctrl.getAttribute("rule") != null)
        this.rule = this.ctrl.getAttribute("rule");
    if (this.ctrl.getAttribute("unionTableId") != null)
        this.unionTableId = this.ctrl.getAttribute("unionTableId");
    if (this.ctrl.getAttribute("parentId") != null)
        this.parentId = this.ctrl.getAttribute("parentId");

    $(this.ctrl).click(function () {
        if (this.jsCtrl.before())
            return false;
        this.jsCtrl.parse();
    });
    //this.before();
    //this.parse();
}

function clsSearchBtnCtrl$parse() {
    if (this.ctrl != null) {
        var jsonCond = this.getCond();
        jsonCond = this.after(jsonCond);
        document.getElementById(this.unionTableId).setAttribute("reqParam", JSON.stringify(jsonCond));
        this.progress(jsonCond, document.getElementById(this.unionTableId));
        document.body.jsCtrl.ctrl = document.getElementById(this.unionTableId);
        document.body.jsCtrl.init();
    }

}

function clsSearchBtnCtrl$getCond() {
    var jsonCond = {};
    if (this.cond != null) {
        for (var nI = 0; nI < this.cond.split(",").length; nI++) {
            var ele = this.cond.split(",")[nI];
            if (this.rule != null)
                key = ele.replace(this.rule, "");
            else
                key = ele;
            if (this.parentId != null)
                var objCond = $("#" + this.parentId).find("#" + ele)[0];
            else
                var objCond = $("#" + ele)[0];
            switch (objCond.tagName.toLowerCase()) {
                case "input":
                    if($(objCond).val() != "")
                        jsonCond[key] = $(objCond).val();
                    break;
                case "select":
                    if($(objCond).val() != "")
                        jsonCond[key] = $(objCond).val();
                    break;
                default:
                    if($(objCond).val() != "")
                        jsonCond[key] = $(objCond).text();
                    break;
            }
        }
    }
    return jsonCond;
}

function clsSearchBtnCtrl$before() {
    //document.getElementById(this.unionTableId).setAttribute("sort",0);
}

function clsSearchBtnCtrl$progress() {

}

function clsSearchBtnCtrl$after(jsonCond) {
    return jsonCond;
}

/*********************************************************************************
 *                               模拟Placeholder控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-08-01
 *    实现功能：判断是否支持Placeholder属性，如果不支持，则用span模拟Placeholder效果
 *
 *
 *
 **********************************************************************************/
function clsPlaceholderCtrl() {
    this.placeholder = "";
    this.isPlaceholder = clsPlaceholderCtrl$isPlaceholder;
    this.init = clsPlaceholderCtrl$init;
    this.template = clsPlaceholderCtrl$template;
}

function clsPlaceholderCtrl$isPlaceholder() {
    return 'placeholder' in document.createElement('input');
}

function clsPlaceholderCtrl$init() {
    if (this.ctrl.getAttribute("placeholder") != null)
        this.placeholder = this.ctrl.getAttribute("placeholder");
    if (!this.isPlaceholder()) {
        $(this.ctrl).after(this.template());
        $(this.ctrl).blur(function () {
            if ($(this).val() == "")
                $(this).next().show();
        });
        $(this.ctrl).focus(function () {
            $(this).next().hide();
        });
        $(this.ctrl).next().click(function () {
            $(this).prev()[0].focus();
        });
    }
}

function clsPlaceholderCtrl$template() {
    return "<label class='comPlaceholder'>" + this.placeholder + "</label>";
}


/*********************************************************************************
 *                               上传控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-09-02
 *    实现功能： 包括上传，删除，左右移动图片等功能绑定
 *
 *
 *
 **********************************************************************************/

function clsUploadCtrl() {
    this.ctrl = null;//当前的dom元素
    this.jsonData = null;
    //this.parentCtrl     = null;
    this.reqPath = null;//this.ctrl的后台请求地址
    this.uploadBgSrc = null;//this.ctrl的背景默认图片
    this.uploadSize = null;//this.ctrl的大小设置，值为'{"w":"80","h":"30"}'，可选，默认大小79*59
    this.fileType = null;//this.ctrl的上传类型，值为img/video/doc/xls/txt
    this.fileExt = null;
    this.uploadType = null;//this.ctrl样式类型，button（按钮）或者默认类型
    this.uploadTypeVal = null;//this.ctrl的内容，uploadType为button时需要赋值
    this.parseFunc = clsUploadCtrl$parseFunc;//ajaxUpload渲染函数
    this.jsonParam = null;//发送的附加数据
    //this.emptyContent   = "上传图片";
    this.Type = ['jpg|png', 'avi|3gp|wmv|rmvb|mp4|mpeg|rm)|mov', 'doc|docx', 'xls|xlsx|xlsm', 'txt', 'pdf'];
    this.init = clsUploadCtrl$init;       //初始化
    this.parse = clsUploadCtrl$parse;      //解析
    this.template = clsUploadCtrl$template;   //dom模板
    this.deleteImg = clsUploadCtrl$deleteImg;
    this.successAfter = clsUploadCtrl$successAfter;//上传成功后状态不为1时调用，需自己写内容
    this.failAfter = clsUploadCtrl$failAfter;//上传成功后状态不为1时调用，需自己写内容
    this.uploadBefore = clsUploadCtrl$uploadBefore;//上传之前执行的函数
    this.setValue = clsUploadCtrl$setValue;//初始化赋值函数
    this.getValue = clsUploadCtrl$getValue;//返回图片路径
}

function clsUploadCtrl$deleteImg() {
}

function clsUploadCtrl$init() {
    if (this.ctrl.getAttribute("reqPath") != null)
        this.reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
    if (this.ctrl.getAttribute("uploadBgSrc") != null)
        this.uploadBgSrc = this.ctrl.getAttribute("uploadBgSrc");
    if (this.ctrl.getAttribute("uploadSize") != null)
        this.uploadSize = JSON.parse(this.ctrl.getAttribute("uploadSize"));
    if (this.ctrl.getAttribute("fileType") != null)
        this.fileType = this.ctrl.getAttribute("fileType");
    if (this.ctrl.getAttribute("objPos") != null)
        this.objPos = this.ctrl.getAttribute("objPos");
    if (this.ctrl.getAttribute("uploadType") != null)
        this.uploadType = this.ctrl.getAttribute("uploadType");
    if (this.ctrl.getAttribute("uploadTypeVal") != null)
        this.uploadTypeVal = this.ctrl.getAttribute("uploadTypeVal");
    if (this.ctrl.getAttribute("jsonParam") != null)
        this.jsonParam = JSON.parse(this.ctrl.getAttribute("jsonParam"));
    if (this.ctrl.getAttribute("fileExt") != null)
        this.fileExt = this.ctrl.getAttribute("fileExt");
    this.template();
    this.parse();
}

function clsUploadCtrl$parse() {
    if (this.uploadType == "button") {
        if (this.fileType == "custom") {//类型自定义
            this.Type = [this.fileExt];
            this.parseFunc(-1, this.objPos);
        } else {
            this.parseFunc(null, this.objPos);
        }
    } else {
        if (this.fileType == "img") {
            this.parseFunc(0, this.objPos);
        } else if (this.fileType == "video") {
            this.parseFunc(1, this.objPos);
        } else if (this.fileType == "doc") {
            this.parseFunc(2, this.objPos);
        } else if (this.fileType == "xls") {
            this.parseFunc(3, this.objPos);
        } else if (this.fileType == "txt") {
            this.parseFunc(4, this.objPos);
        } else if (this.fileType == "pdf") {
            this.parseFunc(5, this.objPos);
        } else if (this.fileType == "custom") {//类型自定义
            this.Type = [this.fileExt];
            this.parseFunc(-1, this.objPos);
        }

        $(this.ctrl).find('.imgDelete')[0].jsCtrl = this;
        $(this.ctrl).find('.imgDelete').bind('click', function () {
            this.jsCtrl.deleteImg($(this).siblings(".comShowImg"));
        });
    }

}


function clsUploadCtrl$parseFunc(type, objPos) {
    new AjaxUpload($(this.ctrl).find("#uploadBtn"), {
        action: this.reqPath,
        name: 'file',
        parentObj: this.ctrl,
        responseType: 'json',
        // 发送的附加数据
        data: this.jsonParam,
        onSubmit: function (file, ext, parent) {//parent就是oncomplete里的file
            var fillArr = parent.jsCtrl.Type;
            var str = type == -1 ? fillArr[0] : fillArr[type];//type == -1 用户自定义文件限定类型
            var patt = new RegExp(str);
            if (ext && patt.test(ext.toLowerCase())) {
            } else {
                alert("请上传格式为" + str + "的文件！");
                return false;
            }
            return parent.jsCtrl.uploadBefore(this, file, ext, parent);
        },
        onComplete: function (file, response) {
            //response = {name: "jilin.jpg", type: "image/jpeg", tmp_name: 'http://imgsrc.baidu.com/imgad/pic/item/a6efce1b9d16fdfaef6fb6ccbe8f8c5494ee7b94.jpg', error: 0,status:"1", size: 5007}
            if (response.retCode == "0000000") {
                $(file).addClass('comUploadAfter')
                if (type != null) {
                    $(file).addClass('comUploadAfter')
                    $(file).find('img').attr('src', response.rspBody.viewUrl);
                    $(file).find('.imgDelete').show();
                    file.jsCtrl.jsonData = response;
                }
                if (file.jsCtrl.successAfter(file, response))
                    alert("上传成功");
            }
            else{
                if(!file.jsCtrl.failAfter(file, response)){
                    alert(response.retDesc);
                }
            }

        },
        onChange: function (file, extension) {

        }
    }, objPos);
}

function clsUploadCtrl$template() {
    $(this.ctrl).addClass('comUpload');
    $(this.ctrl).html("");
    var uploadHTML = null;
    if (this.uploadType == "button") {
        uploadHTML = '<p id="uploadBtn" class="uploadBtn">'+ this.uploadTypeVal +'</p>'
    } else {
        uploadHTML = '<a href="javascript:;" class="imgDelete"></a>';
        uploadHTML += '<img src="' + this.uploadBgSrc + '" alt="" class="comShowImg">';
        uploadHTML += '<p id="uploadBtn" class="uploadBtn"></p>'
    }
    $(this.ctrl).append(uploadHTML);
    $(this.ctrl).css("cssText", "width:" + this.uploadSize.w + "px !important;height:" + this.uploadSize.h + "px !important");
    $(this.ctrl).find(".uploadBtn").css("cssText", "width:" + this.uploadSize.w + "px !important;height:" + this.uploadSize.h + "px !important");
}

function clsUploadCtrl$successAfter(ctrl, response) {
    // return true;
}

function clsUploadCtrl$failAfter(ctrl, response){

}

function clsUploadCtrl$uploadBefore(thisAjaxupload, file, ext, parent) {
    return true;
}

function clsUploadCtrl$setValue(url){
    $(this.ctrl).find("img").attr("src",url);
    $(this.ctrl).addClass("comUploadAfter");
}

function clsUploadCtrl$getValue(url){
    return $(this.ctrl).find("img").attr("src");
}


/*********************************************************************************
 *                               下拉菜单模拟下拉框控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-08-01
 *    实现功能：支持动态添加下拉框内容和自动刷新下拉框数据
 *
 *
 *
 **********************************************************************************/

function clsSelectDropCtrl() {
    this.dispalyText = null;	//显示的文本框
    this.displaySearch = null;	//显示的查询框
    this.displayAdd = null;	//显示的添加框
    this.displayBtnAdd = null;	//显示的添加按钮
    this.displayDragMenu = null;	//显示的下拉菜单div;
    this.displayDragUl = null;	//显示的下拉菜单ul;
    this.addBtn = null; //添加按钮
    this.addText = null;	//添加文本框
    this.isHover = "0";
    this.ctrl = null;
    this.jsonData = null;
    this.initValue = null;
    this.changeFunc = null;
    this.option = {"isCustomOption": true, "width": "180px"};
    this.htmlTemplate = clsSelectDropCtrl$htmlTemplate;
    this.init = clsSelectDropCtrl$init;
    this.refresh = clsSelectDropCtrl$refresh;
    this.parse = clsSelectDropCtrl$parse;
    this.addOption = clsSelectDropCtrl$addOption;
    this.filter = clsSelectDropCtrl$filter;
    this.isChinese = clsSelectDropCtrl$isChinese;
    this.isRepeatText = clsSelectDropCtrl$isRepeatText;
    this.clear = clsSelectDropCtrl$clear;
    this.hover = clsSelectDropCtrl$hover;
    this.setValue = clsSelectDropCtrl$setValue;
    this.getValue = clsSelectDropCtrl$getValue;
    this.getText = clsSelectDropCtrl$getText;
}

function clsSelectDropCtrl$clear() {
    $(this.ctrl).find(".list")[0].innerHTML = "";
}

function clsSelectDropCtrl$hover() {
    $(this.ctrl).find(".ss_t span").mouseover(function () {
        if (typeof(initDropBoxBefore) == "function")
            initDropBoxBefore(this);	//给下拉框赋值
        //this.jsCtrl.init();
    });
}

function clsSelectDropCtrl$setValue(strValue, jsonData) {
    $(this.ctrl).find(".ss_t span").html(strValue);
    $(this.ctrl).find(".ss_t span")[0].jsonData = jsonData;
}

function clsSelectDropCtrl$getValue() {
    return $(this.ctrl).find(".ss_t span")[0].jsonData;
}

function clsSelectDropCtrl$getText() {
    return $(this.ctrl).find(".ss_t span").html();
}

function clsSelectDropCtrl$htmlTemplate() {
    var strHTML = "<a class='ss_t'>";
    strHTML = strHTML + "<span>请选择</span>";
    strHTML = strHTML + "<div><b class='down'></b></div>";
    strHTML = strHTML + "</a>";
    strHTML = strHTML + "<div class='ss_b'>";
    strHTML = strHTML + "<div class='search'><input name='btnSearch' type='text'></div>";
    strHTML = strHTML + "<div class='sb_box'>";
    strHTML = strHTML + "<ul class='list'>";
    strHTML = strHTML + "</ul>";
    if (this.option.isCustomOption) {
        strHTML = strHTML + "<div class='add'>";
        strHTML = strHTML + "<input type='text' class='addInput'><a href='javascript:;' class='addBtn'>添加</a>";
        strHTML = strHTML + "</div>";
    }
    strHTML = strHTML + "</div>";
    strHTML = strHTML + "</div>";
    return strHTML;
}

function clsSelectDropCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("selCode") != null)
            this.selCode = this.ctrl.getAttribute("selCode");
        if (this.ctrl.getAttribute("selValue") != null)
            this.selValue = this.ctrl.getAttribute("selValue");
        if (this.ctrl.getAttribute("initValue") != null)
            this.initValue = this.ctrl.getAttribute("initValue");
        if (this.ctrl.getAttribute("emptyValue") != null)
            this.emptyValue = this.ctrl.getAttribute("emptyValue");
        if (this.ctrl.getAttribute("option") != null)
            this.option = JSON.parse(this.ctrl.getAttribute("option"));
        if (this.ctrl.getAttribute("isHover") != null)
            this.isHover = this.ctrl.getAttribute("isHover");
        if (this.ctrl.getAttribute("changeFunc") != null)
            this.changeFunc = this.ctrl.getAttribute("changeFunc");

        this.parse();
        if (this.isHover == "1")
            this.hover();
    }
}

function clsSelectDropCtrl$refresh() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("selCode") != null)
            this.selCode = this.ctrl.getAttribute("selCode");
        if (this.ctrl.getAttribute("selValue") != null)
            this.selValue = this.ctrl.getAttribute("selValue");
        if (this.ctrl.getAttribute("initValue") != null)
            this.initValue = this.ctrl.getAttribute("initValue");
        if (this.ctrl.getAttribute("emptyValue") != null)
            this.emptyValue = this.ctrl.getAttribute("emptyValue");
        if (this.ctrl.getAttribute("option") != null)
            this.option = JSON.parse(this.ctrl.getAttribute("option"));
        if (this.ctrl.getAttribute("isHover") != null)
            this.isHover = JSON.parse(this.ctrl.getAttribute("isHover"));

        this.parse();
        if (this.isHover == "1")
            this.hover();
    }
}

function clsSelectDropCtrl$parse() {
    //this.ctrl.selectCtrl	= this;
    this.ctrl.innerHTML = this.htmlTemplate();
    this.dispalyText = $(this.ctrl).find("span")[0];
    this.displayDragMenu = $(this.ctrl).find(".ss_b")[0];
    this.displayDragUl = $(this.ctrl).find(".list")[0];
    this.displaySearch = $(this.ctrl).find("input[name='btnSearch']")[0];
    this.displaySearch.jsCtrl = this;

    $(this.displaySearch).keyup(function (event) {
        this.jsCtrl.filter();
    });
    //是否有添加按钮
    if (this.option.isCustomOption) {
        this.addBtn = $(this.ctrl).find(".addBtn")[0];
        this.addText = $(this.ctrl).find(".addInput")[0];
        this.addBtn.jsCtrl = this;
        if (this.option.addCustomOptionPath == null) {
            $(this.addBtn).click(function () {
                var obj = this.jsCtrl;
                var strValue = obj.addText.value;
                if (strValue != "" && obj.isRepeatText(strValue))
                    obj.addOption(strValue, strValue);
                else
                    alert("请输入要添加的内容，并且内容与已有下拉框文本不能重复！");
            });
        }
    }

    if (this.jsonData != null) {
        this.clear();
        for (var nI = 0; nI < this.jsonData.length; nI++) {
            var jsonItem = this.jsonData[nI];
            var strText = jsonItem[this.selValue];
            var strValue = jsonItem[this.selCode];
            if (strValue == this.initValue)	//赋值未做
            {
                this.addOption(strValue, strText, jsonItem);
                this.setValue(strText, jsonItem);
            }
            else
                this.addOption(strValue, strText, jsonItem);
        }

    }
}

function clsSelectDropCtrl$addOption(strValue, strText, objItem) {
    if (this.ctrl != null) {
        var oLi = document.createElement("LI");
        oLi.innerHTML = strText;
        oLi.setAttribute("sText", strText);
        oLi.setAttribute("sValue", strValue);
        if (objItem != null)
            oLi.jsonData = objItem;
        oLi.parentObj = this.ctrl;
        $(this.ctrl).find(".list")[0].appendChild(oLi);
        oLi.parentCtrl = this.ctrl;
        $(oLi).click(function (event) {
            var oSpan = $(this.parentObj).find("span")[0];
            //$(this.parentObj).find(".ss_b").hide(100);
            oSpan.innerHTML = $getInnerText(this);
            oSpan.jsonData = this.jsonData;
            oSpan.setAttribute("sValue", this.getAttribute("sValue"));
            //if(typeof(this.parentCtrl.jsCtrl.changeFunc) == "function")
            eval(this.parentCtrl.jsCtrl.changeFunc + "(this)");
        });
    }
}

/*************通过输入字符过滤**************/
/************规则：1.所有都是字母***********/

/************规则：2.包含汉字***************/
/*******************结束********************/
function clsSelectDropCtrl$filter() {
    var oTarget = this.displayDragUl;
    var oSelf = this.displaySearch;
    if (oSelf.value != "") {
        if (this.isChinese(oSelf.value))	//包含汉字
        {
            for (var nI = 0; nI < $getChild(oTarget).length; nI++) {
                var oLi = $getChild(oTarget)[nI];
                var transString = oLi.getAttribute("sText");

                if (transString.indexOf(oSelf.value.toUpperCase()) != -1) {
                    var nIdx = transString.indexOf(oSelf.value.toUpperCase());
                    var nStart = nIdx;
                    var nEnd = nIdx + oSelf.value.length;
                    var strNew = oLi.getAttribute("sText").substring(0, nStart) + "<font color='red'>" + oLi.getAttribute("sText").substring(nStart, nEnd) + "</font>" + oLi.getAttribute("sText").substring(nEnd, oLi.getAttribute("sText").length);
                    //strNew;
                    oLi.innerHTML = strNew;
                    oLi.style.display = "";
                }
                else {
                    oLi.innerHTML = oLi.getAttribute("sText");
                    oLi.style.display = "none";
                }
            }
        }
        else						//不包含汉字
        {
            //如果全部字母
            for (var nI = 0; nI < $getChild(oTarget).length; nI++) {
                var oLi = $getChild(oTarget)[nI];
                var transString = t(oLi.getAttribute("sText"));

                if (transString.indexOf(oSelf.value.toUpperCase()) != -1) {
                    var nIdx = transString.indexOf(oSelf.value.toUpperCase());
                    var nStart = nIdx;
                    var nEnd = nIdx + oSelf.value.length;
                    var strNew = oLi.getAttribute("sText").substring(0, nStart) + "<font color='red'>" + oLi.getAttribute("sText").substring(nStart, nEnd) + "</font>" + oLi.getAttribute("sText").substring(nEnd, oLi.getAttribute("sText").length);
                    //strNew;
                    oLi.innerHTML = strNew;
                    oLi.style.display = "";
                }
                else {
                    oLi.innerHTML = oLi.getAttribute("sText");
                    oLi.style.display = "none";
                }
            }

        }
    }
    else {
        for (var nI = 0; nI < $getChild(oTarget).length; nI++) {
            var oLi = $getChild(oTarget)[nI];
            oLi.innerHTML = oLi.getAttribute("sText");
            oLi.style.display = "";
        }
    }
}

//是否包含汉字,true:包含,false:不包含
function clsSelectDropCtrl$isChinese(strValue) {
    var reg = new RegExp("[\u4e00-\u9fa5]");
    return reg.test(strValue);
}

//添加内容是否重复
function clsSelectDropCtrl$isRepeatText(strValue) {
    var flag = true;
    $(this.displayDragUl).find("li").each(function () {
        if (strValue == $(this).html())
            flag = false;
    });
    return flag;
}

/*********************************************************************************
 *                               树形表格控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-09-20
 *    实现功能：支持动态添加树节点，支持编辑树节点名称
 *
 *
 *
 **********************************************************************************/
function clsTreeListCtrl() {
    this.jsonData = null;
    this.init = clsTreeListCtrl$init;
    this.refresh = clsTreeListCtrl$refresh;
    /***普通树***/
    this.tree = clsTreeListCtrl$tree;
    this.parseTree = clsTreeListCtrl$parseTree;
    /***弹出窗口可以选择的树***/
    this.treeSelect = clsTreeListCtrl$treeSelect;
    this.parseTreeSelect = clsTreeListCtrl$parseTreeSelect;
    /***树形列表***/
    this.treeList = clsTreeListCtrl$treeList;
    this.parse = clsTreeListCtrl$parse;

    /***树形列表2***/
    this.treeList2 = clsTreeListCtrl$treeList2;
    this.parse2 = clsTreeListCtrl$parse2;

    /***甘特图***/
    this.ganttChart = clsTreeListCtrl$ganttChart;
    this.colResizeFlag = "0";

    this.checkType = null;
    this.ctrl = null;
    this.isCheck = true;
    this.t = "t";
    this.c = "c";
    this.jsonId = "id";
    this.deleteJson = [];
    this.cloneId = null;
    this.templateId = null;
    this.treeCell = null;
    this.arrowStatus = null;
    this.dbclickRow = null;
    this.getAllChild = clsTreeListCtrl$getAllChild;		//得到所有子节点
    this.getAllParent = clsTreeListCtrl$getAllParent;		//得到所有父级节点
    this.getNextChild = clsTreeListCtrl$getNextChild;		//得到下一级子节点
    this.getParent = clsTreeListCtrl$getParent;		//得到父节点
    this.selAllUnionNode = clsTreeListCtrl$selAllUnionNode;	//选择所有关联节点
    this.upMove = clsTreeListCtrl$upMove;			//向上移动
    this.downMove = clsTreeListCtrl$downMove;			//向下移动
    this.addNode = clsTreeListCtrl$addNode;			//添加节点
    this.getNextNode = clsTreeListCtrl$getNextNode;		//得到下一个同级节点
    this.getPrevNode = clsTreeListCtrl$getPrevNode;		//得到上一个同级节点
    this.removeNode = clsTreeListCtrl$removeNode;		//删除指定节点及其下面的所有子节点
    this.removeNodeAfter = clsTreeListCtrl$removeNodeAfter;		//删除指定节点及其下面的所有子节点之后的方法
    this.getJsonData = clsTreeListCtrl$getJsonData;		//得到最新的jsonData
    this.bindFunc = clsTreeListCtrl$bindFunc;
    this.process = clsTreeListCtrl$process;			//执行中调用用户自定义方法
    this.after = clsTreeListCtrl$after;			//执行后调用用户自定义方法
    this.isRemoveNode = clsTreeListCtrl$isRemoveNode;		//是否能删除子节点，jsp页面根据业务重写方法
    this.isAddNode = clsTreeListCtrl$isAddNode;		//是否能添加子节点，jsp页面根据业务重写方法
    this.selectNode = clsTreeListCtrl$selectNode;		//选择树节点，并调用业务方法(单选)。
    this.getAllLeafNode = clsTreeListCtrl$getAllLeafNode;	//得到所有叶子节点
    this.isLastChild = clsTreeListCtrl$isLastChild;	//判断是否本层最后一个节点
    this.setValue = clsTreeListCtrl$setValue;
    this.clear = clsTreeListCtrl$clear;
    this.addNodeAfter = clsTreeListCtrl$addNodeAfter;
    this.page = clsTreeListCtrl$page;
    this.addTopNode = clsTreeListCtrl$addTopNode;
    this.asyncLoad	= clsTreeListCtrl$asyncLoad;

    this.dateMinus	= clsTreeListCtrl$dateMinus;
    this.calColSpan	= clsTreeListCtrl$calColSpan;
    this.getDateArr	= clsTreeListCtrl$getDateArr;
    this.getCustomDate = clsTreeListCtrl$getCustomDate;

    this.startDt= null;
    this.endDt	= null;
    this.initProcessBar= clsTreeListCtrl$initProcessBar;
    this.createProcessBar = clsTreeListCtrl$createProcessBar;
}

function clsTreeListCtrl$init() {
    if (this.ctrl.getAttribute("t") != null)
        this.t = this.ctrl.getAttribute("t");
    if (this.ctrl.getAttribute("c") != null)
        this.c = this.ctrl.getAttribute("c");
    if (this.ctrl.getAttribute("jsonId") != null)
        this.jsonId = this.ctrl.getAttribute("jsonId");
    if (this.ctrl.getAttribute("templateId") != null)
        this.templateId = this.ctrl.getAttribute("templateId");
    if (this.ctrl.getAttribute("checkType") != null)
        this.checkType = this.ctrl.getAttribute("checkType");
    if (this.ctrl.getAttribute("treeCell") != null)
        this.treeCell = this.ctrl.getAttribute("treeCell");
    if (this.ctrl.getAttribute("arrowStatus") != null)
        this.arrowStatus = this.ctrl.getAttribute("arrowStatus");
    if (this.ctrl.getAttribute("startDt") != null)
        this.startDt = this.ctrl.getAttribute("startDt");
    if (this.ctrl.getAttribute("endDt") != null)
        this.endDt = this.ctrl.getAttribute("endDt");
    if (this.ctrl.getAttribute("colResizeFlag") != null)
        this.colResizeFlag = this.ctrl.getAttribute("colResizeFlag");
    if (this.ctrl.getAttribute("dbclickRow") != null)
        this.dbclickRow = this.ctrl.getAttribute("dbclickRow");

    if (this.ctrl.getAttribute("treeType") == "tree")
        this.tree();
    else if (this.ctrl.getAttribute("treeType") == "treeList2")
        this.treeList2();
    else if (this.ctrl.getAttribute("treeType") == "treeList")
        this.treeList();
    else if (this.ctrl.getAttribute("treeType") == "ganttChart")
        this.ganttChart();
    else
        this.treeSelect();
    if (this.ctrl.getAttribute("page") != null)
        this.page(this.ctrl.getAttribute("page"));
}

function clsTreeListCtrl$refresh() {
    this.ctrl.innerHTML = "";
    this.init();
}

function clsTreeListCtrl$tree() {
    var level = 0;
    if (this.jsonData != null) {
        if (this.jsonData.length > 0) {
            for (var nI = 0; nI < this.jsonData.length; nI++) {
                var oRow = this.ctrl.insertRow(-1);
                oRow.setAttribute("level", level);
                oRow.jsonData = this.jsonData[nI];
                if (this.checkType == "leaf") {
                    if (this.jsonData[nI][this.c] != null && this.jsonData[nI][this.c].length > 0)
                        $(oRow).append("<td class='td0'><input type='checkbox' disabled style='opacity:0;'></td>");
                    else
                        $(oRow).append("<td class='td0'><input type='checkbox'></td>");
                }
                else
                    $(oRow).append("<td class='td0'><i class='open'></i></td>");
                $(oRow).append("<td class='td1'><input type='checkbox'></td>");
                $(oRow).append("<td class='td2'>" + this.jsonData[nI][this.t] + "</td>");

                this.process(oRow, this.jsonData[nI]);
                this.bindFunc(oRow, "tree");
                this.parseTree(this.jsonData[nI], level);
            }
        }
        else {
            var oRow = this.ctrl.insertRow(-1);
            oRow.setAttribute("level", level);
            oRow.jsonData = this.jsonData;
            $(oRow).append("<td class='td0'><i class='open'></i></td>");
            if (this.checkType == "leaf") {
                if (this.jsonData[this.c] != null && this.jsonData[this.c].length > 0)
                    $(oRow).append("<td class='td1'><input type='checkbox' disabled style='opacity:0;'></td>");
                else
                    $(oRow).append("<td class='td1'><input type='checkbox'></td>");
            }
            else
                $(oRow).append("<td class='td1'><input type='checkbox'></td>");
            $(oRow).append("<td class='td2'>" + this.jsonData[this.t] + "</td>");

            this.process(oRow, this.jsonData);
            this.bindFunc(oRow, "tree");
            this.parseTree(this.jsonData, level);
        }
    }
}

function clsTreeListCtrl$treeList() {
    var level = 0;
    if (this.jsonData != null) {

        if (this.jsonData.length > 0) {
            for (var nI = 0; nI < this.jsonData.length; nI++) {
                var oRow = this.ctrl.insertRow(-1);
                oRow.setAttribute("level", level);
                oRow.jsonData = this.jsonData[nI];

                $(oRow).append("<td class='td0'><i class='open'></i></td>");
                if (this.jsonData[nI].isChk == "1")
                    $(oRow).append("<td class='td1'><input type='checkbox' checked></td>");
                else
                    $(oRow).append("<td class='td1'><input type='checkbox'></td>");
                $(oRow).append("<td class='td2'><input type='text' class='inputWidth' value='" + this.jsonData[nI][this.t] + "'></td>");
                $(oRow).append("<td class='td3'><a href='javascript:;' id='upMove' class='moveUp moveUpGray'></a><a href='javascript:;' id='downMove' class='moveDown'></a></td>");
                $(oRow).append("<td class='td4'><a href='javascript:;' id='addNode' class='proAdd'></a><a href='javascript:;' class='' id='deleteNode'></a></td>");

                this.process(oRow, this.jsonData[nI]);
                var isNextNode = (nI < this.jsonData.length - 1) ? true : false;
                this.bindFunc(oRow, "treeList", isNextNode);
                this.parse(this.jsonData[nI], level);
            }
        }
        else {
            var oRow = this.ctrl.insertRow(-1);
            oRow.setAttribute("level", level);
            oRow.jsonData = this.jsonData;
            $(oRow).append("<td class='td0'><i class='open'></i></td>");
            if (this.jsonData.isChk == "1")
                $(oRow).append("<td class='td1'><input type='checkbox' checked></td>");
            else
                $(oRow).append("<td class='td1'><input type='checkbox'></td>");
            $(oRow).append("<td class='td2'><input type='text' class='inputWidth' value='" + this.jsonData[this.t] + "'></td>");


            this.process(oRow, this.jsonData);
            $(oRow).append("<td class='td3'></td>");
            $(oRow).append("<td class='td4'><a href='javascript:;' id='addNode' class='proAdd'></a><a></a></td>");

            this.process(oRow, this.jsonData);
            this.bindFunc(oRow, "treeList");
            this.parse(this.jsonData, level);

        }


    }
}

function clsTreeListCtrl$process() {
}

function clsTreeListCtrl$after() {
}

function clsTreeListCtrl$parse(jsonData, level) {
    level++;
    for (var nI = 0; nI < jsonData[this.c].length; nI++) {
        var oRow = this.ctrl.insertRow(-1);
        oRow.setAttribute("level", level);
        oRow.jsonData = jsonData[this.c][nI];
        if (this.isCheck && level == 0) {
            $(oRow).append("<td class='td0'><i class='shrink'></i></td>");
            $(oRow).append("<td class='td1'><input type='checkbox'></td>");
            $(oRow).append("<td class='td2'><input type='text' class='inputWidth' value='" + jsonData[this.c][nI][this.t] + "'></td>");
        }
        else if (this.isCheck && level > 0) {
            $(oRow).append("<td class='td0'></td>");
            $(oRow).append("<td class='td1'></td>");
            $(oRow).append("<td class='td2'><div class='menu" + (level + 1) + "'><span class='chWidth'><i class='shrink'></i><input type='checkbox'></span><input type='text' class='inputWidth' value='" + jsonData[this.c][nI][this.t] + "'></div></td>");

        }

        $(oRow).append("<td class='td3'><a href='javascript:;' id='upMove' class='moveUp moveUpGray'></a><a href='javascript:;' id='downMove' class='moveDown'></a></td>");
        if (oRow.getAttribute("level") == "1")
            $(oRow).append("<td class='td4'><a href='javascript:;' id='addNode' class='proAdd'></a><a href='javascript:;' class='' id='deleteNode'></a></td>");
        else
            $(oRow).append("<td class='td4'><a href='javascript:;'  style='cursor:default'></a><a href='javascript:;' class='' id='deleteNode'></a></td>");

        this.process(oRow, jsonData, level);
        var isNextNode = (nI < jsonData[this.c].length - 1) ? true : false;
        this.bindFunc(oRow, "treeList", isNextNode);

        if (jsonData[this.c][nI][this.c] != null && jsonData[this.c][nI][this.c].length > 0)
            this.parse(jsonData[this.c][nI], level);
    }
}


function clsTreeListCtrl$treeList2() {
    var level = 0;
    if (this.jsonData != null && this.templateId != null) {

        this.cloneId = this.templateId.replace("template", "clone");
        this.clear();
        var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
        if (this.noDataId != null && this.jsonData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            //    if (this.ctrl.getAttribute("page") != null)
            //        $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        else if (this.noDataId != null && this.jsonData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            //if (this.ctrl.getAttribute("page") != null)
            //    $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
        }
        else {
        }
        var page = this.ctrl.getAttribute("page");
        if(page != null)
            var jsonData = this.jsonData.resultData;
        else
            var jsonData = this.jsonData;
        if (jsonData.length > 0) {
            for (var nI = 0; nI < jsonData.length; nI++) {
                var jsonItem = jsonData[nI];
                var cloneRow = templateRow.cloneNode(true);
                cloneRow.id = this.cloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                cloneRow.setAttribute("level", level);

                $(cloneRow).find("#" + this.treeCell).addClass("padding" + level);
                //如果有序号字段，则赋值
                //if (this.idx != null)
                //   $(cloneRow).find("#" + this.idx).html(nI + 1);
                this.setValue(jsonItem, cloneRow);


                templateRow.parentNode.insertBefore(cloneRow, templateRow);
                this.process(cloneRow, jsonData[nI], level);
                var isNextNode = (nI < jsonData.length - 1) ? true : false;
                this.bindFunc(cloneRow, "treeList", isNextNode);

                if(this.ctrl.getAttribute("dbclickRow") == 1)
                {
                    var objRowClick = cloneRow;
                    var eventName = "dblclick";
                }
                else
                {
                    var objRowClick = ($(cloneRow).find(".down-"+this.arrowStatus).length == 0) ? $(cloneRow).find(".up-"+this.arrowStatus).parent()[0] : $(cloneRow).find(".down-"+this.arrowStatus).parent()[0];
                    var eventName = "click";
                }

                //if($(cloneRow).find(".up-"+this.arrowStatus).length > 0)
                if(objRowClick != null)
                    objRowClick.jsCtrl = this;
                $(objRowClick).on(eventName,function () {
                    if(this.jsCtrl.dbclickRow == 1)
                        $(this).find("#openIcon").click();

                    var oTable = $(this).parents("table:first")[0];
                    //var _this = $(this).find(".up-"+oTable.jsCtrl.arrowStatus);
                    var _this = ($(this).find(".down-"+oTable.jsCtrl.arrowStatus).length == 0) ? $(this).find(".up-"+oTable.jsCtrl.arrowStatus) : $(this).find(".down-"+oTable.jsCtrl.arrowStatus);
                    if ($(_this).hasClass("down-"+oTable.jsCtrl.arrowStatus))
                    {
                        $(_this).removeClass("down-"+oTable.jsCtrl.arrowStatus).addClass("up-"+oTable.jsCtrl.arrowStatus);
                        var childNodes = oTable.jsCtrl.getAllChild(_this);
                        for (var nI = 0; nI < childNodes.length; nI++)
                        {
                            $(childNodes[nI]).hide();
                            $(childNodes[nI]).find(".down-"+oTable.jsCtrl.arrowStatus).removeClass("down-"+oTable.jsCtrl.arrowStatus).addClass("up-"+oTable.jsCtrl.arrowStatus);
                        }
                    }
                    else {
                        $(_this).removeClass("up-"+oTable.jsCtrl.arrowStatus).addClass("down-"+oTable.jsCtrl.arrowStatus);
                        var childNodes = oTable.jsCtrl.getAllChild(_this);
                        for (var nI = 0; nI < childNodes.length; nI++)
                        {
                            if (childNodes[nI].getAttribute("level") == level + 1)
                                $(childNodes[nI]).show();
                            //$(childNodes[nI]).find(".down"+oTable.jsCtrl.arrowStatus).removeClass("down"+oTable.jsCtrl.arrowStatus).addClass("up"+oTable.jsCtrl.arrowStatus);
                        }
                    }
                });

                this.parse2(jsonData[nI], level);
            }
            if(this.colResizeFlag == "1")
            {
                $(this.ctrl).colResizable({disable:true});
                //$(this.ctrl).colResizable({resizeMode:'flex'});
                $(this.ctrl).colResizable({liveDrag:true, gripInnerHtml:"<div class='grip2'></div>", draggingClass:"dragging", resizeMode:'overflow'});
            }
            this.after();
        }
    }
}




function clsTreeListCtrl$parse2(jsonData, level,oTargetRow) {
    level++;
    var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
    for (var nI = 0; nI < jsonData[this.c].length; nI++) {
        var jsonItem = jsonData[this.c][nI];
        var cloneRow = templateRow.cloneNode(true);
        cloneRow.id = this.cloneId;
        cloneRow.style.display = "";
        cloneRow.jsonData = jsonItem;
        cloneRow.setAttribute("level", level);

        $(cloneRow).find("#" + this.treeCell).addClass("padding" + level);
        //this.progress(jsonItem, cloneRow);
        //如果有序号字段，则赋值
        //if (this.idx != null)
        //   $(cloneRow).find("#" + this.idx).html(nI + 1);
        this.setValue(jsonItem, cloneRow);

        if(oTargetRow == null)
            templateRow.parentNode.insertBefore(cloneRow, templateRow);
        else
            oTargetRow.parentNode.insertBefore(cloneRow, oTargetRow);

        this.process(cloneRow, jsonItem, level);
        var isNextNode = (nI < jsonData[this.c].length - 1) ? true : false;
        this.bindFunc(cloneRow, "treeList", isNextNode);
        if(this.ctrl.getAttribute("dbclickRow") == 1)
        {
            var objRowClick = cloneRow;
            var eventName = "dblclick";
        }
        else
        {
            //var objRowClick = ($(cloneRow).find(".down-"+this.arrowStatus).length == 0) ? $(cloneRow).find(".up-"+this.arrowStatus).parent()[0] : $(cloneRow).find(".down-"+this.arrowStatus).parent()[0];
            var objRowClick = $(cloneRow).find(".up-"+this.arrowStatus).parent()[0];
            var eventName = "click";
        }
        if(objRowClick != null)
            objRowClick.jsCtrl = this;
        $(objRowClick).on(eventName,function () {
            if(this.jsCtrl.dbclickRow == 1)
                $(this).find("#openIcon").click();

            var oTable = $(this).parents("table:first")[0];
            //var _this = $(this).find(".up-"+oTable.jsCtrl.arrowStatus);
            var _this = ($(this).find(".down-"+oTable.jsCtrl.arrowStatus).length == 0) ? $(this).find(".up-"+oTable.jsCtrl.arrowStatus) : $(this).find(".down-"+oTable.jsCtrl.arrowStatus);
            if ($(_this).hasClass("down-"+oTable.jsCtrl.arrowStatus))
            {
                $(_this).removeClass("down-"+oTable.jsCtrl.arrowStatus).addClass("up-"+oTable.jsCtrl.arrowStatus);
                var childNodes = oTable.jsCtrl.getAllChild(_this);
                for (var nI = 0; nI < childNodes.length; nI++)
                {
                    $(childNodes[nI]).hide();
                    $(childNodes[nI]).find(".down-"+oTable.jsCtrl.arrowStatus).removeClass("down-"+oTable.jsCtrl.arrowStatus).addClass("up-"+oTable.jsCtrl.arrowStatus);
                }
            }
            else {
                $(_this).removeClass("up-"+oTable.jsCtrl.arrowStatus).addClass("down-"+oTable.jsCtrl.arrowStatus);
                var childNodes = oTable.jsCtrl.getAllChild(_this);
                for (var nI = 0; nI < childNodes.length; nI++)
                {
                    if (childNodes[nI].getAttribute("level") == level + 1)
                        $(childNodes[nI]).show();
                    //$(childNodes[nI]).find(".down"+oTable.jsCtrl.arrowStatus).removeClass("down"+oTable.jsCtrl.arrowStatus).addClass("up"+oTable.jsCtrl.arrowStatus);
                }
            }

        });


        if (jsonData[this.c][nI][this.c] != null && jsonData[this.c][nI][this.c].length > 0)
            this.parse2(jsonData[this.c][nI], level);

    }
}

function clsTreeListCtrl$ganttChart()
{
    //初始化标题
    var jsonTitleData = this.getDateArr(this.startDt,this.endDt);

    var oYRow	= this.ctrl.insertRow(0);
    var oYCell	= oYRow.insertCell(-1);
    $(oYCell).text("任务");
    oYCell.rowSpan = 3;
    var oMRow = this.ctrl.insertRow(1);
    var oDRow = this.ctrl.insertRow(2);
    for(var nI=0; nI<jsonTitleData.length; nI++)
    {
        var oYCell = oYRow.insertCell(-1);
        $(oYCell).text(jsonTitleData[nI].y);
        oYCell.colSpan = this.calColSpan("y",jsonTitleData[nI]);
        for(var mI=0; mI<jsonTitleData[nI].mList.length; mI++)
        {
            var oMCell = oMRow.insertCell(-1);
            $(oMCell).text(jsonTitleData[nI].mList[mI].m);
            oMCell.colSpan = this.calColSpan("m",jsonTitleData[nI].mList[mI]);
            for(key in jsonTitleData[nI].mList[mI].dList)
            {
                var oDCell = oDRow.insertCell(-1);
                $(oDCell).text(jsonTitleData[nI].mList[mI].dList[key]);
                var dVal = jsonTitleData[nI].y + "-" + jsonTitleData[nI].mList[mI].m + "-" + (jsonTitleData[nI].mList[mI].dList[key]);
                $(oDCell).attr("dVal",dVal);
                $(oDCell).addClass("tdd");
            }
        }
    }

    var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
    for(var nI=0; nI<$(oDRow).find("td").length; nI++)
    {
        var oTemplateCell = templateRow.insertCell(-1);
        //$(oTemplateCell).addClass("table-list-tr__item");
        $(oTemplateCell).html("&nbsp;")
        $(oTemplateCell).css("position","relative");
        $(oTemplateCell).addClass("tdd");
        $(oTemplateCell).attr("dVal",$(oDRow).find("td").eq(nI).attr("dVal"));

    }

    //初始化树
    this.treeList2();
}

//日期相减
function clsTreeListCtrl$dateMinus(date1,date2)
{//date1:小日期   date2:大日期
    var sdate = new Date(date1.replace(/-/g, '/'));
    var now = new Date(date2.replace(/-/g, '/'));
    var days = now.getTime() - sdate.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    return day+1;
}

function clsTreeListCtrl$initProcessBar(oRow,jsonData)
{
    switch(jsonData.status)
    {
        case 1:	//进行中
            if(jsonData.finishStartDate != null)
            {
                //已完成时间段
                var finishStartDate = jsonData.finishStartDate;
                var finishEndDate	= jsonData.finishEndDate;
                this.createProcessBar(finishStartDate,finishEndDate,oRow,"planDiv",jsonData.completionRateStr);
            }
            if(jsonData.overStartDate != null)
            {
                //已超期时间段
                var overStartDate	= jsonData.overStartDate;
                var overEndDate		= jsonData.overEndDate;
                this.createProcessBar(overStartDate,overEndDate,oRow,"planDivRed","")
            }
            if(jsonData.unDoneStartDate != null)
            {
                //未完成时间段
                var unDoneStartDate	= jsonData.unDoneStartDate;
                var unDoneEndDate	= jsonData.unDoneEndDate;
                this.createProcessBar(unDoneStartDate,unDoneEndDate,oRow,"planDivBlue","")
            }
            break;
        case 6:	//已经完成
            if(jsonData.finishStartDate != null)
            {
                //已完成时间段
                var finishStartDate = jsonData.finishStartDate;
                var finishEndDate	= jsonData.finishEndDate;
                this.createProcessBar(finishStartDate,finishEndDate,oRow,"planDiv",jsonData.completionRateStr);
            }
            if(jsonData.overStartDate != null)
            {
                //已超期时间段
                var overStartDate	= jsonData.overStartDate;
                var overEndDate		= jsonData.overEndDate;
                this.createProcessBar(overStartDate,overEndDate,oRow,"planDivRed","")
            }
            if(jsonData.unDoneStartDate != null)
            {
                //未完成时间段
                var unDoneStartDate	= jsonData.unDoneStartDate;
                var unDoneEndDate	= jsonData.unDoneEndDate;
                this.createProcessBar(unDoneStartDate,unDoneEndDate,oRow,"planDivBlue","")
            }
            break;
    }
}

function clsTreeListCtrl$createProcessBar(startDate,endDate,oRow,className,strValue)
{
    var nDay = this.dateMinus(startDate,endDate);
    for(var nI=0; nI<$(oRow).find("td").length; nI++)
    {
        if(dateCompare($(oRow).find("td").eq(nI).attr("dVal"),startDate))
        {
            $(oRow).find("td").eq(nI).html("<div style='width:"+nDay*22+"px;' class='"+className+"'>"+strValue+"</div>");
        }
    }
}

//日期相减
function dateCompare(date1,date2)
{//date1:小日期   date2:大日期
    if(date1 == null || date2 == null)
        return false;
    var sdate = new Date(date1.replace(/-/g, '/'));
    var now = new Date(date2.replace(/-/g, '/'));
    return now.getTime() == sdate.getTime();
}

function clsTreeListCtrl$calColSpan(tab,jsonData)
{
    switch(tab)
    {
        case "y":
            var nLen = 0;
            for(var nI=0; nI<jsonData.mList.length; nI++)
            {
                nLen = nLen + jsonData.mList[nI].dList.length;
            }
            if(nLen == 0)
                return 1;
            else
                return nLen;
        case "m":
            return jsonData.dList.length;
    }
}

function clsTreeListCtrl$getDateArr(startDate,endDate)
{
    //var nI = 0;
    var oDate	= new Date(startDate.replace(/-/g, '/'));
    //new Date(startDate).getTime()
    var jsonData = [{"y":oDate.getFullYear(),"mList":[{"m":oDate.getMonth()+1,"dList":[oDate.getDate()]}]}];
    while(startDate != endDate)
    {

        //nI++;
        startDate = this.getCustomDate(1,startDate,"add","-");
        var oDate	= new Date(startDate.replace(/-/g, '/'));
        var strYear = oDate.getFullYear();
        if(jsonData[jsonData.length-1].y == strYear)
        {
            if(jsonData[jsonData.length-1].mList[jsonData[jsonData.length-1].mList.length-1].m == oDate.getMonth()+1)
                jsonData[jsonData.length-1].mList[jsonData[jsonData.length-1].mList.length-1].dList.push(oDate.getDate());
            else
            {
                jsonData[jsonData.length-1].mList.push({"m":oDate.getMonth()+1,"dList":[oDate.getDate()]});
            }
        }
        else
        {
            jsonData.push({"y":oDate.getFullYear(),"mList":[{"m":oDate.getMonth()+1,"dList":[oDate.getDate()]}]});

        }
    }
    return jsonData;
}

//得到指定天dayCount:第几天,strDate:目标日期,operator:+或者-
function clsTreeListCtrl$getCustomDate(dayCount, strDate, operator, spar) {
    if (strDate == null)
        var now = new Date();
    else
        var now = new Date(strDate.replace(/-/g, '/'));
    if (dayCount != null) {
        if (operator == "add")
            now.setDate(now.getDate() + 1 * dayCount);
        else
            now.setDate(now.getDate() - 1 * dayCount);
    }

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (spar == null)
        return year + '/' + month + '/' + day;
    else
        return year + spar + month + spar + day;
}

//异步加载
function clsTreeListCtrl$asyncLoad(cloneRow)
{
    if (this.ctrl.getAttribute("reqPath") != null) {
        var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
        if (reqPath.split("?").length == 1)
            reqPath = reqPath + "?" + Math.random();
        else
            reqPath = reqPath + "&" + Math.random();
    }
    if (this.ctrl.getAttribute("reqParam") != null) {
        var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
        var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
        jsonReqHeaderData.operTitle = operId;
        var reqParam = {"reqHeader": jsonReqHeaderData};
        reqParam["reqBody"] = reqBody;
    }
    if (this.ctrl.getAttribute("reqMethod") != null)
        var reqMethod = this.ctrl.getAttribute("reqMethod");
    else
        var reqMethod = "POST";
    for(key in reqParam.reqBody)
    {
        reqParam.reqBody[key] = cloneRow.jsonData[key];
    }
    $.ajax({
        url: reqPath,
        type: reqMethod,
        async: false,
        cache: false,
        ctrl: this.ctrl,
        jsCtrl:this,
        oTargetRow:cloneRow,
        contentType: 'application/json',
        data: JSON.stringify(reqParam),
        dataType: 'text',
		
beforeSend:function (xhr) {
			xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
		},
        success: function (data) {
            var jsonData = JSON.parse(data);
            if (jsonData.retCode == "0000000") {
                var jsonNewData = {};
                jsonNewData[this.jsCtrl.c] = jsonData.rspBody;
                if($(this.oTargetRow).next().length == 0)
                    this.jsCtrl.parse2(jsonNewData, this.oTargetRow.getAttribute("level"),this.oTargetRow);
                else
                    this.jsCtrl.parse2(jsonNewData, this.oTargetRow.getAttribute("level"),$(this.oTargetRow).next()[0]);
                this.jsCtrl.after();
                $(this.oTargetRow).find("#openIcon").attr("isLoad",1);
            }
            jumpUrl(null, jsonData.retCode, null, jsonData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $(this.oTargetRow).find("#openIcon").removeAttr("isLoad");
            
			if(JSON.parse(jqXHR.responseText).code != null)
				alert(JSON.parse(jqXHR.responseText).data.respDesc);
			else
				alert("ajax请求错误");
        }
    });
}

function clsTreeListCtrl$setValue(jsonItem, cloneRow)
{
    for (key in jsonItem)
    {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];

            //临时
            if($(ctrl).attr("dataType") != null && ctrl.tagName.toLowerCase() != "select")
            {
                if(jsonMetadata !=undefined &&jsonMetadata.rspBody != null && jsonMetadata.rspBody[$(ctrl).attr("dataType")] != null)
                {
                    if($(ctrl).attr("multiple") == "multiple")
                    {
                        var strValue = "";
                        for(var keyS in jsonMetadata.rspBody[$(ctrl).attr("dataType")])
                        {
                            for(var nI=0; nI<value.split(",").length; nI++)
                            {
                                if(keyS == value.split(",")[nI])
                                {
                                    strValue = (strValue == "") ? jsonMetadata.rspBody[$(ctrl).attr("dataType")][value.split(",")[nI]] : strValue + "," + jsonMetadata.rspBody[$(ctrl).attr("dataType")][value.split(",")[nI]];
                                    break;
                                }
                            }
                        }
                        var value = strValue;
                    }
                    else
                    {
                        if($(ctrl).attr("valType") == "text")
                        {
                            for(key in jsonMetadata.rspBody[$(ctrl).attr("dataType")])
                            {
                                if(jsonMetadata.rspBody[$(ctrl).attr("dataType")][key] == value)
                                {
                                    $(ctrl).attr("valCode",key);
                                    break;
                                    //var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][key];
                                }
                            }
                        }
                        else if($(ctrl).attr("valType") == "code")
                        {
                            $(ctrl).attr("valCode",value);
                            var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][value];
                        }
                        else
                            var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][value];
                    }

                }
                if(value == null)
                    value = "";
            }
            else if( ctrl.tagName.toLowerCase() == "select")
            {
                if($(ctrl).attr("valType") == "text")
                {
                    for(key in jsonMetadata.rspBody[$(ctrl).attr("dataType")])
                    {
                        if(jsonMetadata.rspBody[$(ctrl).attr("dataType")][key] == value)
                        {
                            $(ctrl).attr("valCode",key);
                            var value = key;
                            break;
                            //var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][key];
                        }
                    }
                }
            }



            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        $(ctrl).attr("regionValue",value);
                        ctrl.jsCtrl = oJsCtrl;
                        $(ctrl).click(function(){
                            if(this.checked)
                                this.jsCtrl.jsonData[this.id] = 1;
                            else
                                this.jsCtrl.jsonData[this.id] = 0;
                            if(this.jsCtrl.jsonData.opt != "i")
                            {
                                if($(this).val() != $(this).attr("regionValue"))
                                    this.jsCtrl.jsonData.opt = "u";
                                else
                                    this.jsCtrl.jsonData.opt = "r";
                            }
                        });
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                        $(ctrl).attr("regionValue",value);
                        $(ctrl).blur(function(){
                            this.jsCtrl.jsonData[this.id] = $(this).val();
                            if(this.jsCtrl.jsonData.opt != "i")
                            {
                                if($(this).val() != $(this).attr("regionValue"))
                                    this.jsCtrl.jsonData.opt = "u";
                                else
                                    this.jsCtrl.jsonData.opt = "r";
                            }
                        });
                    }
                    break;
                case "select":
                    var oJsCtrl = new clsTextCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    $(ctrl).attr("regionValue",value);
                    $(ctrl).blur(function(){
                        this.jsCtrl.jsonData[this.id] = $(this).val();
                        if(this.jsCtrl.jsonData.opt != "i")
                        {
                            if($(this).val() != $(this).attr("regionValue"))
                                this.jsCtrl.jsonData.opt = "u";
                            else
                                this.jsCtrl.jsonData.opt = "r";
                        }
                    });
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsTreeListCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

function clsTreeListCtrl$parseTree(jsonData, level) {
    level++;
    for (var nI = 0; nI < jsonData[this.c].length; nI++) {
        var oRow = this.ctrl.insertRow(-1);
        oRow.setAttribute("level", level);
        oRow.jsonData = jsonData[this.c][nI];
        if (this.isCheck && level == 0) {
            $(oRow).append("<td class='td0'><i class='open'></i></td>");
            if (this.checkType == "leaf") {
                if (jsonData[this.c][nI][this.c] != null && jsonData[this.c][nI][this.c].length > 0)
                    $(oRow).append("<td class='td1'><input type='checkbox' disabled style='opacity:50;'></td>");
                else {
                    if (jsonData[this.c][nI].isChk == "1")
                        $(oRow).append("<td class='td1'><input type='checkbox' checked></td>");
                    else
                        $(oRow).append("<td class='td1'><input type='checkbox'></td>");
                }
            }
            else
                $(oRow).append("<td class='td1'><input type='checkbox'></td>");
            $(oRow).append("<td class='td2'>" + jsonData[this.c][nI][this.t] + "</td>");
        }
        else if (this.isCheck && level > 0) {
            $(oRow).append("<td class='td0'></td>");
            $(oRow).append("<td class='td1'></td>");
            if (this.checkType == "leaf") {
                if (jsonData[this.c][nI][this.c] != null && jsonData[this.c][nI][this.c].length > 0)
                    $(oRow).append("<td class='td2'><div class='menu" + (level + 1) + "'><span class='chWidth'><i class='shrink'></i><input type='checkbox' disabled style='opacity:50;'></span>" + jsonData[this.c][nI][this.t] + "</div></td>");
                else {
                    if (jsonData[this.c][nI].isChk == "1")
                        $(oRow).append("<td class='td2'><div class='menu" + (level + 1) + "'><span class='chWidth'><i class='shrink'></i><input type='checkbox' checked></span>" + jsonData[this.c][nI][this.t] + "</div></td>");
                    else
                        $(oRow).append("<td class='td2'><div class='menu" + (level + 1) + "'><span class='chWidth'><i class='shrink'></i><input type='checkbox'></span>" + jsonData[this.c][nI][this.t] + "</div></td>");
                }
            }
            else {
                if (jsonData[this.c][nI].isChk == "1")
                    $(oRow).append("<td class='td2'><div class='menu" + (level + 1) + "'><span class='chWidth'><i class='shrink'></i><input type='checkbox' checked></span>" + jsonData[this.c][nI][this.t] + "</div></td>");
                else
                    $(oRow).append("<td class='td2'><div class='menu" + (level + 1) + "'><span class='chWidth'><i class='shrink'></i><input type='checkbox'></span>" + jsonData[this.c][nI][this.t] + "</div></td>");
            }
        }

        this.process(oRow, jsonData);
        this.bindFunc(oRow, "tree");

        if (jsonData[this.c][nI][this.c] != null && jsonData[this.c][nI][this.c].length > 0)
            this.parseTree(jsonData[this.c][nI], level);
    }
}

function clsTreeListCtrl$treeSelect() {
    var level = 0;
    if (this.jsonData != null) {
        if (this.jsonData.length > 0) {
            for (var nI = 0; nI < this.jsonData.length; nI++) {
                var oRow = this.ctrl.insertRow(-1);
                oRow.setAttribute("level", level);
                oRow.jsonData = this.jsonData[nI];
                if (this.checkType == "leaf") {
                    if (this.jsonData[nI][this.c] != null && this.jsonData[nI][this.c].length > 0)
                        $(oRow).append("<td class='td0'></td>");
                    else
                        $(oRow).append("<td class='td0'></td>");
                }
                else
                    $(oRow).append("<td class='td0'><i class='open'></i></td>");
                $(oRow).append("<td class='td1'></td>");
                $(oRow).append("<td class='td2'>" + this.jsonData[nI][this.t] + "</td>");
                $(oRow).append("<td class='td3'></td>");
                this.process(oRow, this.jsonData[nI]);
                this.bindFunc(oRow, "tree");
                this.parseTree(this.jsonData[nI], level);
            }
        }
        else {
            var oRow = this.ctrl.insertRow(-1);
            oRow.setAttribute("level", level);
            oRow.jsonData = this.jsonData;
            $(oRow).append("<td class='td0'><i class='open'></i></td>");
            if (this.checkType == "leaf") {
                if (this.jsonData[this.c] != null && this.jsonData[this.c].length > 0)
                    $(oRow).append("<td class='td1'></td>");
                else
                    $(oRow).append("<td class='td1'></td>");
            }
            else
                $(oRow).append("<td class='td1'></td>");
            $(oRow).append("<td class='td2'>" + this.jsonData[this.t] + "</td>");
            $(oRow).append("<td class='td3'></td>");

            this.process(oRow, this.jsonData);
            this.bindFunc(oRow, "tree");
            this.parseTreeSelect(this.jsonData, level);
        }
    }
}

function clsTreeListCtrl$parseTreeSelect(jsonData, level) {
    level++;
    for (var nI = 0; nI < jsonData[this.c].length; nI++) {
        var oRow = this.ctrl.insertRow(-1);
        oRow.setAttribute("level", level);
        oRow.jsonData = jsonData[this.c][nI];
        if (this.isCheck && level == 0) {
            $(oRow).append("<td class='td0'><i class='open'></i></td>");
            $(oRow).append("<td class='td1'></td>");
            $(oRow).append("<td class='td2'>" + jsonData[this.c][nI][this.t] + "</td>");

        }
        else if (this.isCheck && level > 0) {
            $(oRow).append("<td class='td0'></td>");
            $(oRow).append("<td class='td1'></td>");
            $(oRow).append("<td class='td2'><div class='menu" + (level + 1) + "'><span class='chWidth'><i class='shrink'></i></span>" + jsonData[this.c][nI][this.t] + "</div></td>");
        }
        $(oRow).append("<td class='td3'></td>");

        this.process(oRow, jsonData);
        this.bindFunc(oRow, "treeSelect");

        if (jsonData[this.c][nI][this.c] != null && jsonData[this.c][nI][this.c].length > 0)
            this.parseTreeSelect(jsonData[this.c][nI], level);
    }
}

function clsTreeListCtrl$getAllChild(obj) {
    var arrChildNode = new Array();
    var level = $(obj).parents("tr:first").attr("level");
    $(obj).parents("tr:first").nextAll().each(function () {
        var cLevel = $(this).attr("level");
        if (parseInt(level) < parseInt(cLevel))
            arrChildNode[arrChildNode.length] = $(this)[0];
        else
            return false;
    });
    return arrChildNode;
}

function clsTreeListCtrl$getParent(obj) {
    var parentNode;
    var level = $(obj).attr("level");
    if (level == 0)
        return this.ctrl;
    $(obj).prevAll().each(function () {
        var cLevel = $(this).attr("level");
        if (parseInt(level) > parseInt(cLevel)) {
            parentNode = $(this)[0];
            return false;
        }
    });
    return parentNode;
}

function clsTreeListCtrl$getAllParent(obj) {
    var arrParentNode = new Array();
    if (obj.tagName.toLowerCase() == "tr") {
        var level = $(obj).attr("level");
        var targetObj = $(obj);
    }
    else {
        var level = $(obj).parents("tr:first").attr("level");
        var targetObj = $(obj).parents("tr:first");
    }
    targetObj.prevAll().each(function () {
        var cLevel = $(this).attr("level");
        if (parseInt(level) > parseInt(cLevel)) {
            arrParentNode[arrParentNode.length] = $(this)[0];
            level--;
        }
    });
    return arrParentNode;
}

function clsTreeListCtrl$selAllUnionNode(obj) {
    var arr = this.getAllChild(obj);
    for (var nI = 0; nI < arr.length; nI++)
    {
        if($(arr[nI]).find("input[type='checkbox']").prop("disabled") == false)
            $(arr[nI]).find("input[type='checkbox']")[0].checked = obj.checked;
    }
    var arrP = this.getAllParent(obj);
    for (var nI = 0; nI < arrP.length; nI++) {
        var arrNextChildNode = this.getNextChild($(arrP[nI]).find("input[type='checkbox']")[0]);
        var flag = true;
        for (var mI = 0; mI < arrNextChildNode.length; mI++) {
            if ($(arrNextChildNode[mI]).find("input[type='checkbox']")[0].checked) {
                flag = false;
                break;
            }
        }
        if($(arrP[nI]).find("input[type='checkbox']").prop("disabled") == false)
        {
            if (obj.checked)
                $(arrP[nI]).find("input[type='checkbox']")[0].checked = true;
            else if (!obj.checked && flag)
                $(arrP[nI]).find("input[type='checkbox']")[0].checked = false;
        }
    }
}

function clsTreeListCtrl$getNextChild(obj) {
    var arrNextChildNode = new Array();
    var level = $(obj).parents("tr:first").attr("level");
    $(obj).parents("tr:first").nextAll().each(function () {
        var cLevel = $(this).attr("level");
        if ((parseInt(level) + 1) == parseInt(cLevel)) {
            arrNextChildNode[arrNextChildNode.length] = $(this)[0];
        }
        else if ((parseInt(level) + 1) > parseInt(cLevel))
            return false;
        //else
        //	return false;
    });
    return arrNextChildNode;
}

function clsTreeListCtrl$isLastChild(obj) {
    if ($(obj).next().length == 0)
        return true;

    if ($(obj).attr("level") != $(obj).next().attr("level"))
        return true;
    else
        return false;
}

function clsTreeListCtrl$upMove(obj) {
    var level = obj.getAttribute("level")
    var prevNode = this.getPrevNode(obj);//$(obj).prevAll("tr[level='"+level+"']");

    if (prevNode != null) {
        //变化对应json数据
        var parentNode = this.getParent(obj);
        var key;
        if (level == 0) {
            for (var nI = 0; nI < parentNode.jsCtrl.jsonData.length; nI++) {
                if (obj.jsonData == parentNode.jsCtrl.jsonData[nI]) {
                    key = nI;
                    break;
                }
            }
            if (key != null) {
                var temp = parentNode.jsCtrl.jsonData[key];
                parentNode.jsCtrl.jsonData[key] = parentNode.jsCtrl.jsonData[key - 1];
                parentNode.jsCtrl.jsonData[key - 1] = temp;
            }
        }
        else {
            for (var nI = 0; nI < parentNode.jsonData[this.c].length; nI++) {
                if (obj.jsonData == parentNode.jsonData[this.c][nI]) {
                    key = nI;
                    break;
                }
            }
            if (key != null) {
                var temp = parentNode.jsonData[this.c][key];
                parentNode.jsonData[this.c][key] = parentNode.jsonData[this.c][key - 1];
                parentNode.jsonData[this.c][key - 1] = temp;
            }
        }
        var tarChildNode = this.getAllChild($(obj).find("td"));
        prevNode.parentNode.insertBefore(obj, prevNode);
        for (var nI = 0; nI < tarChildNode.length; nI++) {
            prevNode.parentNode.insertBefore(tarChildNode[nI], prevNode);
        }
    }
}

function clsTreeListCtrl$downMove(obj) {
    var level = obj.getAttribute("level");
    var nextNode = this.getNextNode(obj);//$(obj).nextAll("tr[level='"+level+"']");

    if (nextNode != null) {
        //变化对应json数据
        var parentNode = this.getParent(obj);
        var key;
        if (level == 0) {
            for (var nI = 0; nI < parentNode.jsCtrl.jsonData.length; nI++) {
                if (obj.jsonData == parentNode.jsCtrl.jsonData[nI]) {
                    key = nI;
                    break;
                }
            }
            if (key != null) {
                var temp = parentNode.jsCtrl.jsonData[key];
                parentNode.jsCtrl.jsonData[key] = parentNode.jsCtrl.jsonData[key + 1];
                parentNode.jsCtrl.jsonData[key + 1] = temp;
            }
        }
        else {
            for (var nI = 0; nI < parentNode.jsonData[this.c].length; nI++) {
                if (obj.jsonData == parentNode.jsonData[this.c][nI]) {
                    key = nI;
                    break;
                }
            }
            if (key != null) {
                var temp = parentNode.jsonData[this.c][key];
                parentNode.jsonData[this.c][key] = parentNode.jsonData[this.c][key + 1];
                parentNode.jsonData[this.c][key + 1] = temp;
            }
        }

        var nextChildNode = this.getAllChild($(nextNode).find("td"));
        obj.parentNode.insertBefore(nextNode, obj);
        for (var nI = 0; nI < nextChildNode.length; nI++) {
            obj.parentNode.insertBefore(nextChildNode[nI], obj);
        }
    }

}

function clsTreeListCtrl$addNode(obj) {
    var arrChildNode = this.getAllChild($(obj).find("td"));

    var nextNode = this.getNextNode(obj);

    if (arrChildNode.length == 0) {
        var newNode = document.getElementById(this.templateId).cloneNode(true);
        newNode.id = this.cloneId;
        $(newNode).show();
        $(newNode).addClass(this.cloneId);
        $(newNode).find("#" + this.treeCell).addClass("padding" + (parseInt(obj.getAttribute("level")) + 1));
        newNode.setAttribute("level", parseInt(obj.getAttribute("level")) + 1);
        this.process(newNode);
        $(newNode).insertAfter(obj);
    }
    else {
        var newNode = arrChildNode[0].cloneNode(true);
        newNode.setAttribute("level", parseInt(obj.getAttribute("level")) + 1);
        $(newNode).find("input[type='text']")[0].value = "";
        this.process(newNode);
        var nextNode = this.getNextNode(obj);
        $(newNode).insertAfter(arrChildNode[arrChildNode.length - 1]);

    }

    //变化对应json数据
    var parentNode = obj;
    if (obj.jsonData[this.c] == null)
        obj.jsonData[this.c] = [];
    var jsonItem = {};


    //newNode.jsonData = obj.jsonData[this.c][obj.jsonData[this.c].length - 1];
    /*var nextNode = this.getNextNode(obj);
     if(nextNode == null)
     obj.parentNode.appendChild(newNode,obj);
     else
     nextNode.parentNode.insertBefore(newNode,nextNode);
     */
    this.bindFunc(newNode, "treeList");
    this.addNodeAfter(newNode,parentNode);
    if(newNode.jsonData == null)
    {
        newNode.jsonData = {};
    }
    newNode.jsonData.opt = "i";
    this.setValue(newNode.jsonData, newNode);
    obj.jsonData[this.c].push(newNode.jsonData);
}

function clsTreeListCtrl$addTopNode()
{
}

function clsTreeListCtrl$addNodeAfter(oRow,oPRow) {

}

function clsTreeListCtrl$getNextNode(obj) {
    var level = parseInt(obj.getAttribute("level"));
    var nextNode = null;
    $(obj).nextAll().each(function () {
        if (parseInt($(this).attr("level")) < level) {
            return false;
        }
        else if (parseInt($(this).attr("level")) == level) {
            nextNode = $(this)[0];
            return false;
        }
    });
    return nextNode;

}

function clsTreeListCtrl$getPrevNode(obj) {
    var level = parseInt(obj.getAttribute("level"));
    var prevNode = null;
    $(obj).prevAll().each(function () {
        if (parseInt($(this).attr("level")) < level) {
            return false;
        }
        else if (parseInt($(this).attr("level")) == level) {
            prevNode = $(this)[0];
            return false;
        }
    });
    return prevNode;
}

function clsTreeListCtrl$removeNode(obj) {
    //变化对应json数据

    var arrChildNode = this.getAllChild($(obj).find("td"));
    if (arrChildNode.length > 0) {
        alert("有子节点不允许删除！");
        return false;
    }
    else {
        var parentNode = this.getParent(obj);
        if (parentNode.tagName.toLowerCase() == "table") {
            for (var nI = 0; nI < parentNode.jsCtrl.jsonData.length; nI++) {
                if (obj.jsonData == parentNode.jsCtrl.jsonData[nI]) {
                    key = nI;
                    break;
                }
            }
            if(this.ctrl.getAttribute("page") != null)
                parentNode.jsCtrl.jsonData.resultData.splice(key, 1);
            else
                parentNode.jsCtrl.jsonData.splice(key, 1);
        }
        else {
            for (var nI = 0; nI < parentNode.jsonData[this.c].length; nI++) {
                if (obj.jsonData == parentNode.jsonData[this.c][nI]) {
                    key = nI;
                    break;
                }
            }

            parentNode.jsonData[this.c].splice(key, 1);
        }
        if (obj.jsonData[this.jsonId] != null)
        {
            if(obj.jsonData.opt != "i")
            {
                obj.jsonData.opt = "d";
                this.deleteJson.push(obj.jsonData);
            }
        }
        /*for(var nI=0; nI<arrChildNode.length; nI++)
         {
         if(arrChildNode[nI].jsonData.id != null)
         this.deleteJson.push(arrChildNode[nI].jsonData.id);
         $(arrChildNode[nI]).remove();

         }*/
        this.removeNodeAfter(obj);
        $(obj).remove();
    }
}

function clsTreeListCtrl$getJsonData() {
    return this.ctrl.jsonData;
}

function clsTreeListCtrl$bindFunc(oRow, type, isNextNode) {
    switch (type) {
        case "tree":
            if (this.checkType == "leaf") {
                $(oRow).find("input[type='checkbox']").click(function () {
                    //$(this).parents("tr:first").attr("level")
                    ($(this)[0].checked) ? $(this).parents("tr:first")[0].jsonData.isChk = "1" : $(this).parents("tr:first")[0].jsonData.isChk = "0";
                });
            }
            else {
                $(oRow).find("input[type='checkbox']").click(function () {
                    //$(this).parents("tr:first").attr("level")
                    $(this).parents("table:first")[0].jsCtrl.selAllUnionNode($(this)[0]);
                });
            }
            break;
        case "treeList":
            $(oRow).find("input[type='checkbox']").click(function () {
                //$(this).parents("tr:first").attr("level")
                $(this).parents("table:first")[0].jsCtrl.selAllUnionNode($(this)[0]);
            });

            /*if (this.getPrevNode(oRow) == null) {
             $(oRow).find("#upMove").addClass("moveUpGray");
             }
             else {
             */
            $(oRow).find("#upMove").removeClass("moveUpGray");
            $(oRow).find("#upMove").click(function () {
                $(this).parents("table:first")[0].jsCtrl.upMove($(this).parents("tr:first")[0]);
            });

            /*
             if (!isNextNode) {
             $(oRow).find("#downMove").addClass("moveDownGray");
             }
             else
             {*/
            $(oRow).find("#downMove").removeClass("moveDownGray");
            $(oRow).find("#downMove").click(function () {
                $(this).parents("table:first")[0].jsCtrl.downMove($(this).parents("tr:first")[0]);
            });


            $(oRow).find("#addNode").click(function () {
                if ($(this).parents("table:first")[0].jsCtrl.isAddNode($(this).parents("tr:first")[0]))
                    $(this).parents("table:first")[0].jsCtrl.addNode($(this).parents("tr:first")[0]);
            });

            //if (!this.isRemoveNode(oRow)) {
            //$(oRow).find("#deleteNode").removeClass("proDelete");
            //}
            //else
            //{
            $(oRow).find("#deleteNode").addClass("proDelete");
            $(oRow).find("#deleteNode").click(function () {
                if ($(this).parents("table:first")[0].jsCtrl.isRemoveNode($(this).parents("tr:first")[0]))
                    $(this).parents("table:first")[0].jsCtrl.removeNode($(this).parents("tr:first")[0]);
            });
            //}

            $(oRow).find("#openIcon").click(function () {
                if($(this).attr("isLoad") == null)
                {
                    $(this).parents("table:first")[0].jsCtrl.asyncLoad($(this).parents("tr:first")[0]);
                }
            });

            $(oRow).find(".inputWidth").blur(function () {
                $(this).parents("tr:first")[0].jsonData[$(this).parents("table:first")[0].jsCtrl.t] = $(this).val();
            });
            break;
        case "treeSelect":
            if (oRow.jsonData[this.c].length == 0) {
                $(oRow).find(".td2").click(function () {
                    //$(this).parents("tr:first").attr("level")
                    $(this).parents("table:first")[0].jsCtrl.selectNode($(this).parents("tr:first"));
                });
            }
            break;
        case "treeList2":
            $(oRow).find("input[type='checkbox']").click(function () {
                //$(this).parents("tr:first").attr("level")
                $(this).parents("table:first")[0].jsCtrl.selAllUnionNode($(this)[0]);
            });

            /*if (this.getPrevNode(oRow) == null) {
             $(oRow).find("#upMove").addClass("moveUpGray");
             }
             else {
             */
            $(oRow).find("#upMove").removeClass("moveUpGray");
            $(oRow).find("#upMove").click(function () {
                $(this).parents("table:first")[0].jsCtrl.upMove($(this).parents("tr:first")[0]);
            });

            /*
             if (!isNextNode) {
             $(oRow).find("#downMove").addClass("moveDownGray");
             }
             else
             {*/
            $(oRow).find("#downMove").removeClass("moveDownGray");
            $(oRow).find("#downMove").click(function () {
                $(this).parents("table:first")[0].jsCtrl.downMove($(this).parents("tr:first")[0]);
            });


            $(oRow).find("#addNode").click(function () {
                if ($(this).parents("table:first")[0].jsCtrl.isAddNode($(this).parents("tr:first")[0]))
                    $(this).parents("table:first")[0].jsCtrl.addNode($(this).parents("tr:first")[0]);
            });

            //if (!this.isRemoveNode(oRow)) {
            //$(oRow).find("#deleteNode").removeClass("proDelete");
            //}
            //else
            //{
            $(oRow).find("#deleteNode").addClass("proDelete");
            $(oRow).find("#deleteNode").click(function () {
                if ($(this).parents("table:first")[0].jsCtrl.isRemoveNode($(this).parents("tr:first")[0]))
                    $(this).parents("table:first")[0].jsCtrl.removeNode($(this).parents("tr:first")[0]);
            });
            //}

            $(oRow).find(".inputWidth").blur(function () {
                $(this).parents("tr:first")[0].jsonData[$(this).parents("table:first")[0].jsCtrl.t] = $(this).val();
            });
            break;
    }

}

function clsTreeListCtrl$selectNode() {

}
function clsTreeListCtrl$removeNodeAfter(oRow) {

}


function clsTreeListCtrl$isRemoveNode(oRow) {
    return true;
}

function clsTreeListCtrl$isAddNode(oRow) {
    return true;
}

function clsTreeListCtrl$getAllLeafNode(isCheck) {
    var preLevel;
    var arrLeaf = new Array();
    if (this.cloneId != null) {
        for (var nI = 0; nI < $(this.ctrl).find("*[id='" + this.cloneId + "']").length; nI++) {
            var oRow = $(this.ctrl).find("*[id='" + this.cloneId + "']")[nI];
            var oNextRow = $(this.ctrl).find("*[id='" + this.cloneId + "']")[nI + 1];
            if (oRow.getAttribute("level") != null && oNextRow != null && oNextRow.getAttribute("level") != null) {
                if (parseInt(oRow.getAttribute("level")) >= parseInt(oNextRow.getAttribute("level"))) {
                    if (isCheck == null)
                        arrLeaf.push(oRow);
                    else {
                        if ($(oRow).find("input[type='checkbox']")[0].checked)
                            arrLeaf.push(oRow);
                    }
                }
            }
            else if (oRow.getAttribute("level") != null && oNextRow == null) {
                if (isCheck == null)
                    arrLeaf.push(oRow);
                else {
                    if ($(oRow).find("input[type='checkbox']")[0].checked)
                        arrLeaf.push(oRow);
                }
            }
        }
    }
    else {
        for (var nI = 0; nI < this.ctrl.rows.length; nI++) {
            var oRow = this.ctrl.rows[nI];
            var oNextRow = this.ctrl.rows[nI + 1];
            if (oRow.getAttribute("level") != null && oNextRow != null && oNextRow.getAttribute("level") != null) {
                if (parseInt(oRow.getAttribute("level")) >= parseInt(oNextRow.getAttribute("level"))) {
                    if (isCheck == null)
                        arrLeaf.push(oRow);
                    else {
                        if ($(oRow).find("input[type='checkbox']")[0].checked)
                            arrLeaf.push(oRow);
                    }
                }
            }
            else if (oRow.getAttribute("level") != null && oNextRow == null) {
                if (isCheck == null)
                    arrLeaf.push(oRow);
                else {
                    if ($(oRow).find("input[type='checkbox']")[0].checked)
                        arrLeaf.push(oRow);
                }
            }
        }
    }
    return arrLeaf;
}

function clsTreeListCtrl$page(strClsName) {
    if (this.jsonData != null) {
        $("." + strClsName).createPage({
            pageCount: this.jsonData.pages,
            current: this.jsonData.pageNum,
            parentObj: this.ctrl,
            backFn: function (p) {
                var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
                jsonCondData.pageNum = p;
                $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
                document.body.jsCtrl.ctrl = $(this)[0].parentObj;
                document.body.jsCtrl.init();
                //$(this)[0].parentObj.jsCtrl.refresh();
            }
        });
    }

}

/*********************************************************************************
 *                               数字控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：根据类型格式化数字，3个数字一个逗号，或者小数点后面保留几位不够补0
 *
 *
 *
 **********************************************************************************/
function clsNumberCtrl() {
    this.ctrl = null;
    this.formatType = "normal";
    this.regionValue = "0.00";
    this.partInt = "0";
    this.partDot = "00";
    this.init = clsNumberCtrl$init;
    this.parse = clsNumberCtrl$parse;
    this.template = clsNumberCtrl$template;
}

function clsNumberCtrl$init() {
    if (this.ctrl.getAttribute("formatType") != null)
        this.formatType = this.ctrl.getAttribute("formatType");
    if (this.ctrl.getAttribute("regionValue") != null)
        this.regionValue = this.ctrl.getAttribute("regionValue");

    this.parse();
}

function clsNumberCtrl$parse() {
    switch (this.formatType) {
        case "normal":
            var partInt = this.regionValue.toString().split(".")[0]
            var partDot = this.regionValue.toString().split(".")[1];
            var iNum = 0;
            for (var nI = partInt.length - 1; nI >= 0; nI--) {
                iNum++;
                this.partInt = (this.partInt == "0") ? partInt.charAt(nI) : partInt.charAt(nI) + this.partInt;
                if (iNum == 3 && nI > 0) {
                    this.partInt = "," + this.partInt;
                    iNum = 0;
                }
            }
            if (partDot != null) {
                if (partDot.length < 2)
                    this.partDot = partDot + "0";
                else if (partDot.length == 2)
                    this.partDot = partDot;
                else
                    this.partDot = partDot.charAt(0) + partDot.charAt(1)
            }
            break;
    }
    this.ctrl.innerHTML = this.template();
}

function clsNumberCtrl$template() {
    return this.partInt + "<i>." + this.partDot + "</i>";
}


/*********************************************************************************
 *                               简单可编辑表格组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：标准表格，一行标题，其他数据行且无rowspan，支持动态刷新和分页
 *
 *
 *
 **********************************************************************************/
function clsStandardEditTableCtrl()
{
    this.ctrl		= null;		//初始化对象
    this.jsonData	= null;		//ajax返回结果
    this.templateId = null;
    this.cloneId	= null;
    this.noDataId	= null;
    this.bgEven		= null;	//奇数行背景
    this.bgOdd		= null;		//偶数行背景
    this.sortDescCls= null;			//降序cls
    this.sortAscCls = null;			//升序cls
    this.sortDefaultCls = null;		//默认排序cls
    this.totalCls	= null;			//是否自动添加总条数
    this.idx		= null;
    this.url		= null;
    this.chkId		= null;		//行checkbox的ID
    this.clsChk		= null;		//checkbox className
    this.clsAllChk	= null;		//全选checkbox className
    this.cacheArr	= new Array();
    this.isCacheCond= null;
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.sortType	= "1";		//排序类型 1为点击图标排序，2为点击标题排序
    this.insertPos	= "1";		//1插入第一行 0插入最后一行
    this.insertId	= null;
    this.deleteId	= null;
    this.colResizeFlag = false;
    this.init		= clsStandardEditTableCtrl$init;
    this.parse		= clsStandardEditTableCtrl$parse;
    this.initAdd	= clsStandardEditTableCtrl$initAdd;
    this.parseAdd	= clsStandardEditTableCtrl$parseAdd;
    this.refresh	= clsStandardEditTableCtrl$refresh;
    this.clear		= clsStandardEditTableCtrl$clear;
    this.setValue	= clsStandardEditTableCtrl$setValue;
    this.before		= clsStandardEditTableCtrl$before;
    this.progress	= clsStandardEditTableCtrl$progress;
    this.after		= clsStandardEditTableCtrl$after;
    this.page		= clsStandardEditTableCtrl$page;
    this.setChildDocAssistant = clsStandardEditTableCtrl$setChildDocAssistant;
    this.cacheChkProc = clsStandardEditTableCtrl$cacheChkProc;
    this.cacheChkAfter = clsStandardEditTableCtrl$cacheChkAfter;
    this.sortAfter = clsStandardEditTableCtrl$sortAfter;
    this.insert		= clsStandardEditTableCtrl$insert;
    this.del		= clsStandardEditTableCtrl$del;
    this.bind		= clsStandardEditTableCtrl$bind;
    this.getData	= clsStandardEditTableCtrl$getData;
    this.optBefore	= clsStandardEditTableCtrl$optBefore;
    this.insertAfter = clsStandardEditTableCtrl$insertAfter;
    this.delAfter = clsStandardEditTableCtrl$delAfter;
    this.chkAfter	= clsStandardEditTableCtrl$chkAfter;
}

function clsStandardEditTableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("templateId") != null)
            this.templateId = this.ctrl.getAttribute("templateId");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("clsChk") != null)
            this.clsChk = this.ctrl.getAttribute("clsChk");
        if (this.ctrl.getAttribute("clsAllChk") != null)
            this.clsAllChk = this.ctrl.getAttribute("clsAllChk");
        if (this.ctrl.getAttribute("isCacheCond") != null)
            this.isCacheCond = this.ctrl.getAttribute("isCacheCond");
        if (this.ctrl.cacheArr != null)
            this.cacheArr = this.ctrl.cacheArr;
        if (this.ctrl.getAttribute("isCacheCond") != null)
            this.isCacheCond = this.ctrl.getAttribute("isCacheCond");
        if (this.ctrl.getAttribute("bgEven") != null)
            this.bgEven = this.ctrl.getAttribute("bgEven");
        if (this.ctrl.getAttribute("bgOdd") != null)
            this.bgOdd = this.ctrl.getAttribute("bgOdd");
        if (this.ctrl.getAttribute("sortDescCls") != null)
            this.sortDescCls = this.ctrl.getAttribute("sortDescCls");
        if (this.ctrl.getAttribute("sortAscCls") != null)
            this.sortAscCls = this.ctrl.getAttribute("sortAscCls");
        if (this.ctrl.getAttribute("totalCls") != null)
            this.totalCls = this.ctrl.getAttribute("totalCls");
        if (this.ctrl.getAttribute("sortType") != null)
            this.sortType = this.ctrl.getAttribute("sortType");
        if (this.ctrl.getAttribute("insertId") != null)
            this.insertId = this.ctrl.getAttribute("insertId");
        if (this.ctrl.getAttribute("deleteId") != null)
            this.deleteId = this.ctrl.getAttribute("deleteId");
        if (this.ctrl.getAttribute("chkId") != null)
            this.chkId = this.ctrl.getAttribute("chkId");
        if (this.ctrl.getAttribute("insertPos") != null)
            this.insertPos = this.ctrl.getAttribute("insertPos");
        if (this.ctrl.getAttribute("colResizeFlag") != null)
            this.colResizeFlag = this.ctrl.getAttribute("colResizeFlag");

        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));
        this.parse();

    }
}

function clsStandardEditTableCtrl$page(strClsName) {
    if (this.jsonData != null) {
        $("." + strClsName).createPage({
            pageCount: this.jsonData.pages,
            current: this.jsonData.pageNum,
            parentObj: this.ctrl,
            backFn: function (p) {
                var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
                jsonCondData.pageNum = p;
                $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
                document.body.jsCtrl.ctrl = $(this)[0].parentObj;
                document.body.jsCtrl.init();
                //$(this)[0].parentObj.jsCtrl.refresh();
            }
        });
    }

}

function clsStandardEditTableCtrl$initAdd()
{
    var jsonCondData = JSON.parse(this.ctrl.getAttribute("reqParam"));
    jsonCondData.pageNum = (this.jsonData.pageNum == null) ? 1 : this.jsonData.pageNum+1;
    this.ctrl.setAttribute("reqParam", JSON.stringify(jsonCondData));

    if (this.ctrl.data == null) {
        if (this.ctrl.getAttribute("reqPath") != null) {
            var reqPath = (requestUrl == null) ? this.ctrl.getAttribute("reqPath") : requestUrl + this.ctrl.getAttribute("reqPath");
            if (reqPath.split("?").length == 1)
                reqPath = reqPath + "?" + Math.random();
            else
                reqPath = reqPath + "&" + Math.random();
        }

        if (this.ctrl.getAttribute("reqParam") != null) {
            var operId = (this.ctrl.getAttribute("operId") == null) ? "" : this.ctrl.getAttribute("operId");
            var reqBody = JSON.parse(this.ctrl.getAttribute("reqParam"));
            jsonReqHeaderData.operTitle = operId;
            var reqParam = {"reqHeader": jsonReqHeaderData};
            reqParam["reqBody"] = reqBody;
        }
        if (this.ctrl.getAttribute("reqMethod") != null)
            var reqMethod = this.ctrl.getAttribute("reqMethod");
        else
            var reqMethod = "POST";
        $.ajax({
            url: reqPath,
            type: reqMethod,
            async: false,
            cache: false,
            ctrl: this.ctrl,
            dataType: 'text',
            contentType: 'application/json',
            data: JSON.stringify(reqParam),
            dataType: 'text',
			
beforeSend:function (xhr) {
				xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
			},
            success: function (data) {
                var jsonData = JSON.parse(data);
                if (jsonData.retCode == "0000000") {
                    this.ctrl.jsCtrl.jsonAddData = jsonData.rspBody;
                    this.ctrl.jsCtrl.jsonData.resultData = this.ctrl.jsCtrl.jsonData.resultData.concat(jsonData.rspBody.resultData);
                    this.ctrl.jsCtrl.parseAdd();
                }
                jumpUrl(null, jsonData.retCode, null, jsonData);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                
				if(JSON.parse(jqXHR.responseText).code != null)
					var data = {"retDesc":JSON.parse(jqXHR.responseText).data.respDesc};
				else
					var data = {"retDesc":"ajax请求错误"}
				if(this.async){
					jumpUrl(null, data.retCode, null,data ,true);
				}else{
					jumpUrl(null, data.retCode, null, data);
				}
					
            }
        });
    }
    else {
        this.jsonAddData = this.ctrl.data;
        this.jsonData.resultData = this.jsonData.resultData.concat(this.jsonAddData.resultData);
        this.parseAdd();
    }
}

function clsStandardEditTableCtrl$parseAdd()
{
    this.before();
    if (this.jsonAddData != null && this.templateId != null) {

        this.cloneId = this.templateId.replace("template", "clone");
        var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
        if (this.noDataId != null && this.jsonData.resultData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
            if (this.totalCls != null && $("." + this.totalCls).length > 0)
                $("." + this.totalCls).hide();
        }
        else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
            if (this.totalCls != null && $("." + this.totalCls).length > 0) {
                $("." + this.totalCls).show();
                $("." + this.totalCls).find("#total").text(this.jsonData.total);
            }
        }
        else {
        }

        if (this.jsonAddData.resultData != null) {
            for (var nI = 0; nI < this.jsonAddData.resultData.length; nI++) {
                var jsonItem = this.jsonAddData.resultData[nI];
                jsonItem.opt = "update";
                var cloneRow = templateRow.cloneNode(true);
                if (this.bgOdd != null) {
                    if (nI % 2 == 0)
                        $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgEven);
                    else
                        $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgOdd);

                }
                cloneRow.id = this.cloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                this.progress(jsonItem, cloneRow);
                //如果有序号字段，则赋值
                if (this.idx != null)
                    $(cloneRow).find("#" + this.idx).html($(this.ctrl).find("*[id='"+this.cloneId+"']").length + 1);
                templateRow.parentNode.insertBefore(cloneRow, templateRow);
                this.setValue(jsonItem, cloneRow);
                this.setChildDocAssistant(cloneRow);
                //初始化checkbox和全选直接互相联动
                if (this.clsChk != null && this.clsAllChk != null) {
                    $(cloneRow).find("." + this.clsChk)[0].jsUnionCtrl = this;
                    $(cloneRow).find("." + this.clsChk)[0].oRow = cloneRow;
                    $(cloneRow).find("." + this.clsChk).click(function () {
                        var bln = true;
                        $(this.jsUnionCtrl.ctrl).find("*[id^='clone']").find("." + this.jsUnionCtrl.clsChk).each(function () {
                            if (this.checked == false)
                                bln = false;
                        });
                        $(this.jsUnionCtrl.ctrl).find("." + this.jsUnionCtrl.clsAllChk).prop("checked", bln);
                        this.jsUnionCtrl.cacheChkProc(this);
                        this.jsUnionCtrl.chkAfter(this.oRow,this.checked,this);
                        selColor4Tr(this.oRow,this.checked,this);
                    });
                }

                if (this.isValidate == "1")
                    initValidate(cloneRow);
            }
        }

        if (this.sortType == 1) {
            //初始化降序升序方法
            if (this.sortDescCls != null) {
                for (var nI = 0; nI < $("." + this.sortDescCls).length; nI++)
                    $("." + this.sortDescCls)[nI].jsCtrl = this;
                $("." + this.sortDescCls).unbind("click");
                $("." + this.sortDescCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    //reqParam["sortType"] = "desc";
                    reqParam["order"] = this.getAttribute("paramName") + " desc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'desc');
                });

            }
            if (this.sortAscCls != null) {
                for (var nI = 0; nI < $("." + this.sortAscCls).length; nI++)
                    $("." + this.sortAscCls)[nI].jsCtrl = this;
                $("." + this.sortAscCls).unbind("click");
                $("." + this.sortAscCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    //reqParam["sortType"] = "asc";
                    reqParam["order"] = this.getAttribute("paramName") + " asc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'asc');
                });
            }
        }
        else {
            var sortDesc = this.ctrl.getAttribute("sortDesc");
            if (sortDesc != null) {
                var jsonSortDesc = JSON.parse(sortDesc);
                this.sortDescCls = jsonSortDesc.descCls;
                this.sortAscCls = jsonSortDesc.ascCls;
                this.sortDefaultCls = jsonSortDesc.defaultCls;
                for (var nI = 0; nI < $("." + this.sortDefaultCls).length; nI++)
                    $("." + this.sortDefaultCls)[nI].jsCtrl = this;
                $("." + this.sortDefaultCls).unbind("click");
                $("." + this.sortDefaultCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    if (this.getAttribute("sort") == null) {
                        this.setAttribute("sort", "desc");
                        //reqParam["sortType"] = "desc";
                        reqParam["order"] = this.getAttribute("paramName") + " desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }
                    else if (this.getAttribute("sort") == "desc") {
                        this.setAttribute("sort", "asc");
                        //reqParam["sortType"] = "asc";
                        reqParam["order"] = this.getAttribute("paramName") + " asc";
                        this.jsCtrl.sortAfter(this, 'asc');
                    }
                    else {
                        this.setAttribute("sort", "desc");
                        //reqParam["sortType"] = "desc";
                        reqParam["order"] = this.getAttribute("paramName") + " desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }

                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();


                });
            }
        }
    }
    this.after();
    this.bind();
}

function clsStandardEditTableCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateId != null) {

        this.cloneId = this.templateId.replace("template", "clone");
        this.clear();
        var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
        if (this.noDataId != null && this.jsonData.resultData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
            if (this.totalCls != null && $("." + this.totalCls).length > 0)
                $("." + this.totalCls).hide();
        }
        else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
            if (this.totalCls != null && $("." + this.totalCls).length > 0) {
                $("." + this.totalCls).show();
                $("." + this.totalCls).find("#total").text(this.jsonData.total);
            }
        }
        else {
        }

        if (this.jsonData.resultData != null) {
            for (var nI = 0; nI < this.jsonData.resultData.length; nI++) {
                var jsonItem = this.jsonData.resultData[nI];
                jsonItem.opt = "update";
                var cloneRow = templateRow.cloneNode(true);
                if (this.bgOdd != null) {
                    if (nI % 2 == 0)
                        $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgEven);
                    else
                        $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgOdd);

                }
                cloneRow.id = this.cloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                this.progress(jsonItem, cloneRow);
                //如果有序号字段，则赋值
                if (this.idx != null)
                    $(cloneRow).find("#" + this.idx).html(nI + 1);
                templateRow.parentNode.insertBefore(cloneRow, templateRow);
                this.setChildDocAssistant(cloneRow);
                this.setValue(jsonItem, cloneRow);
                //初始化checkbox和全选直接互相联动
                if (this.clsChk != null && this.clsAllChk != null) {
                    $(cloneRow).find("." + this.clsChk)[0].jsUnionCtrl = this;
                    $(cloneRow).find("." + this.clsChk)[0].oRow = cloneRow;
                    $(cloneRow).find("." + this.clsChk).click(function () {
                        var bln = true;
                        $(this.jsUnionCtrl.ctrl).find("*[id^='clone']").find("." + this.jsUnionCtrl.clsChk).each(function () {
                            if (this.checked == false)
                                bln = false;
                        });
                        $(this.jsUnionCtrl.ctrl).find("." + this.jsUnionCtrl.clsAllChk).prop("checked", bln);
                        this.jsUnionCtrl.cacheChkProc(this);
                        this.jsUnionCtrl.chkAfter(this.oRow,this.checked,this);
                        selColor4Tr(this.oRow,this.checked,this);
                    });
                }

                if (this.isValidate == "1")
                    initValidate(cloneRow);
            }
        }

        if (this.sortType == 1) {
            //初始化降序升序方法
            if (this.sortDescCls != null) {
                for (var nI = 0; nI < $("." + this.sortDescCls).length; nI++)
                    $("." + this.sortDescCls)[nI].jsCtrl = this;
                $("." + this.sortDescCls).unbind("click");
                $("." + this.sortDescCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    //reqParam["sortType"] = "desc";
                    reqParam["order"] = this.getAttribute("paramName") + " desc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'desc');
                });

            }
            if (this.sortAscCls != null) {
                for (var nI = 0; nI < $("." + this.sortAscCls).length; nI++)
                    $("." + this.sortAscCls)[nI].jsCtrl = this;
                $("." + this.sortAscCls).unbind("click");
                $("." + this.sortAscCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    //reqParam["sortType"] = "asc";
                    reqParam["order"] = this.getAttribute("paramName") + " asc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'asc');
                });
            }
        }
        else {
            var sortDesc = this.ctrl.getAttribute("sortDesc");
            if (sortDesc != null) {
                var jsonSortDesc = JSON.parse(sortDesc);
                this.sortDescCls = jsonSortDesc.descCls;
                this.sortAscCls = jsonSortDesc.ascCls;
                this.sortDefaultCls = jsonSortDesc.defaultCls;
                for (var nI = 0; nI < $("." + this.sortDefaultCls).length; nI++)
                    $("." + this.sortDefaultCls)[nI].jsCtrl = this;
                $("." + this.sortDefaultCls).unbind("click");
                $("." + this.sortDefaultCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    //reqParam["sortField"] = this.getAttribute("paramName");
                    if (this.getAttribute("sort") == null) {
                        this.setAttribute("sort", "desc");
                        //reqParam["sortType"] = "desc";
                        reqParam["order"] = this.getAttribute("paramName") + " desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }
                    else if (this.getAttribute("sort") == "desc") {
                        this.setAttribute("sort", "asc");
                        //reqParam["sortType"] = "asc";
                        reqParam["order"] = this.getAttribute("paramName") + " asc";
                        this.jsCtrl.sortAfter(this, 'asc');
                    }
                    else {
                        this.setAttribute("sort", "desc");
                        //reqParam["sortType"] = "desc";
                        reqParam["order"] = this.getAttribute("paramName") + " desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }

                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();


                });
            }
        }
    }
    if(this.colResizeFlag == "1")
    {
        $(this.ctrl).colResizable({disable:true});
        $(this.ctrl).colResizable({liveDrag:true, gripInnerHtml:"<div class='grip2'></div>", draggingClass:"dragging", resizeMode:'overflow'});
    }
    this.after();
    this.bind();

}

function clsStandardEditTableCtrl$chkAfter()
{

}

function clsStandardEditTableCtrl$sortAfter(obj, type) {
    if (this.sortType == "1") {
        $("." + this.sortAscCls).removeClass("ascBgCurrentCls").addClass("ascBgCls");
        $("." + this.sortDescCls).removeClass("descBgCurrentCls").addClass("descBgCls");

        if (type == "asc")
            $(obj).removeClass("ascBgCls").addClass("ascBgCurrentCls");
        else
            $(obj).removeClass("descBgCls").addClass("descBgCurrentCls");
    }
    else {
        $("." + this.sortDescCls).removeClass(this.sortDescCls).addClass(this.sortDefaultCls);
        $("." + this.sortAscCls).removeClass(this.sortAscCls).addClass(this.sortDefaultCls);
        if (type == "asc")
            $(obj).removeClass(this.sortDefaultCls).addClass(this.sortAscCls);
        else
            $(obj).removeClass(this.sortDefaultCls).addClass(this.sortDescCls);

    }
}

function clsStandardEditTableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            //临时
            if($(ctrl).attr("dataType") != null && ctrl.tagName.toLowerCase() != "select")
            {
                if(jsonMetadata.rspBody != null && jsonMetadata.rspBody[$(ctrl).attr("dataType")] != null)
                    var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][value];
                if(value == null)
                    value = "";
            }
			else if($(ctrl).attr("orgType") != null && ctrl.tagName.toLowerCase() != "select")
            {
                if(jsonOrgdata.rspBody != null && jsonOrgdata.rspBody.rows.length > 0)
                {
					for(var nI=0; nI<jsonOrgdata.rspBody.rows.length; nI++)
					{
						if(jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgType")] == value)
						{
						   var value = jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgText")];
						   break;
							//var value = jsonOrgdata.rspBody[$(ctrl).attr("dataType")][key];
						}
					}
				}
                if(value == null)
                    value = "";
            }
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        $(ctrl).attr("regionValue",value);
                        ctrl.jsCtrl = oJsCtrl;
                        $(ctrl).click(function(){
                            if(this.checked)
                                this.jsCtrl.jsonData[this.id] = 1;
                            else
                                this.jsCtrl.jsonData[this.id] = 0;
                        });
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                        $(ctrl).css("width",$(ctrl).parent().width());
                        value == null?$(ctrl).attr("regionValue",""):$(ctrl).attr("regionValue",value);
                        $(ctrl).blur(function(){
                            this.jsCtrl.jsonData[this.id] = $(this).val();
                        });
                    }
                    break;
                case "select":
                    var oJsCtrl = new clsSelectCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    if($(ctrl).attr("txtKey") != null)
                        jsonItem[$(ctrl).attr("txtKey")] = oJsCtrl.getText();
                    if($(ctrl).attr("isBeauty") == null)
                        $(ctrl).trigger('chosen:updated');
                    ctrl.jsCtrl = oJsCtrl;
                    $(ctrl).attr("regionValue",value);
                    $(ctrl).blur(function()
                    {
                        var strValue = "";
                        var strText = "";
                        if($(this).attr("multiple") == "multiple")
                        {

                            for(var nI=0; nI<$(this).find("option").length; nI++)
                            {
                                if($(this).find("option").eq(nI).attr("selected") == "selected")
                                {
                                    strValue = (strValue == "") ? $(this).find("option").eq(nI).val() : strValue + "," + $(this).find("option").eq(nI).val();
                                    strText = (strText == "") ? $(this).find("option").eq(nI).text() : strValue + "," + $(this).find("option").eq(nI).text();
                                }
                            }
                        }
                        else
                        {
                            strValue = this.value;
                            strText	= this.jsCtrl.getText();
                        }
                        this.jsCtrl.jsonData[this.id] = strValue;
                        if($(this).attr("txtKey") != null)
                            this.jsCtrl.jsonData[$(this).attr("txtKey")] = strText;
                    });

                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsStandardEditTableCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsStandardEditTableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsStandardEditTableCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

//缓存选项
function clsStandardEditTableCtrl$cacheChkProc(obj) {
    if (this.isCacheCond != null) {
        if (typeof(this.isCacheCond) == "function")
            this.cacheArr = this.isCacheCond(this);
        else {
            var cloneRow = $(obj).parents("*[id='" + this.cloneId + "']:first")[0];
            var isRepeat = false;
            for (var nI = this.cacheArr.length - 1; nI >= 0; nI--) {
                var ele = this.cacheArr[nI];
                if (ele[this.isCacheCond] == cloneRow.jsonData[this.isCacheCond]) {
                    if (!obj.checked)
                        this.cacheArr.splice(nI, 1);
                    isRepeat = true;
                }
            }
            if (!isRepeat)
                this.cacheArr.push(cloneRow.jsonData);
        }
        this.ctrl.cacheArr = this.cacheArr;
        this.cacheChkAfter(obj, this);
    }
}

function clsStandardEditTableCtrl$bind()
{
    if(this.insertId != null)
    {
        if($("#"+this.insertId).attr("unionTableId") == this.ctrl.id)
        {
            $("#"+this.insertId)[0].jsCtrl = this;
            $("#"+this.insertId).unbind("click");
            $("#"+this.insertId).click(function(){
                this.jsCtrl.insert();
            });
        }
    }
    if(this.deleteId != null)
    {
        if($("#"+this.deleteId).attr("unionTableId") == this.ctrl.id)
        {
            $("#"+this.deleteId)[0].jsCtrl = this;
            $("#"+this.deleteId).unbind("click");
            $("#"+this.deleteId).click(function(){
                this.jsCtrl.del();
            });
        }
    }
    /*else if(this.saveId != null)
    {
        if($("#"+this.saveId).attr("unionTableId") == this.ctrl.id)
        {
            $("#"+this.saveId)[0].jsCtrl = this;
            $("#"+this.saveId).click(function(){
                this.jsCtrl.save();
            });
        }
    }*/
}

function clsStandardEditTableCtrl$insert()
{
    this.before();
    if (this.jsonData != null && this.templateId != null) {

        this.cloneId = this.templateId.replace("template", "clone");
        var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
        /*if (this.noDataId != null && this.jsonData.resultData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
            if (this.totalCls != null && $("." + this.totalCls).length > 0)
                $("." + this.totalCls).hide();
        }
        else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
            if (this.totalCls != null && $("." + this.totalCls).length > 0) {
                $("." + this.totalCls).show();
                $("." + this.totalCls).find("#total").text(this.jsonData.total);
            }
        }
        else {
        }*/
        //新建之前无记录，在新建时把暂无数据隐藏
        if (this.noDataId != null && this.jsonData.resultData.length == 0)
        {
            $("#" + this.noDataId)[0].style.display = "none";
        }

        //if (this.jsonData.resultData != null) {
        //    for (var nI = 0; nI < this.jsonData.resultData.length; nI++) {

        var jsonItem = null;
        var cloneRow = templateRow.cloneNode(true);
        $(cloneRow).attr("tab","insert");
        if(this.jsonData.resultData.length != null)
        {
            if (this.bgOdd != null) {
                if (this.jsonData.resultData.length % 2 == 0)
                    $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgEven);
                else
                    $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgOdd);

            }
        }
        else
            $(cloneRow).removeClass(this.bgOdd).removeClass(this.bgEven).addClass(this.bgEven);

        cloneRow.id = this.cloneId;
        cloneRow.style.display = "";
        jsonItem = this.progress(null, cloneRow);	//jsonItem务必在progress中补齐
        cloneRow.jsonData = jsonItem;
        this.setChildDocAssistant(cloneRow);
        this.setValue(jsonItem, cloneRow);
        if(this.optBefore("insert",cloneRow))
        {
            if(this.insertPos != 1)
            {
                templateRow.parentNode.insertBefore(cloneRow, templateRow);
                //如果有序号字段，则赋值
                var rowNum = $(this.ctrl).find("*[id='"+this.cloneId+"'][tab!=delete]").length;
            }
            else
            {
                if($(this.ctrl).find("*[id='"+this.cloneId+"'][tab!=delete]").length == 0)
                    templateRow.parentNode.insertBefore(cloneRow, templateRow);
                else
                    templateRow.parentNode.insertBefore(cloneRow, $(this.ctrl).find("*[id='"+this.cloneId+"'][tab!=delete]")[0]);
            }

            if (this.idx != null)
            {
                for(var nI=0; nI<$(this.ctrl).find("*[id='"+this.cloneId+"'][tab!=delete]").length; nI++)
                {
                    var oRow = $(this.ctrl).find("*[id='"+this.cloneId+"'][tab!=delete]")[nI];
                    $(oRow).find("#" + this.idx).html(nI+1);
                }
            }

            //初始化checkbox和全选直接互相联动
            if (this.clsChk != null && this.clsAllChk != null) {
                $(cloneRow).find("." + this.clsChk)[0].jsUnionCtrl = this;
                $(cloneRow).find("." + this.clsChk)[0].oRow = cloneRow;
                $(cloneRow).find("." + this.clsChk).click(function () {
                    var bln = true;
                    $(this.jsUnionCtrl.ctrl).find("*[id^='clone']").find("." + this.jsUnionCtrl.clsChk).each(function () {
                        if (this.checked == false)
                            bln = false;
                    });
                    $("." + this.jsUnionCtrl.clsAllChk).prop("checked", bln);
                    this.jsUnionCtrl.cacheChkProc(this);
                    selColor4Tr(this.oRow,this.checked,this);
                });
            }

            if (this.isValidate == "1")
                initValidate(cloneRow);
        }
        //}
        //}

        /*
        if (this.sortType == 1) {
            //初始化降序升序方法
            if (this.sortDescCls != null) {
                for (var nI = 0; nI < $("." + this.sortDescCls).length; nI++)
                    $("." + this.sortDescCls)[nI].jsCtrl = this;
                $("." + this.sortDescCls).unbind("click");
                $("." + this.sortDescCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    reqParam["sortField"] = this.getAttribute("paramName");
                    reqParam["sortType"] = "desc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'desc');
                });

            }
            if (this.sortAscCls != null) {
                for (var nI = 0; nI < $("." + this.sortAscCls).length; nI++)
                    $("." + this.sortAscCls)[nI].jsCtrl = this;
                $("." + this.sortAscCls).unbind("click");
                $("." + this.sortAscCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    reqParam["sortField"] = this.getAttribute("paramName");
                    reqParam["sortType"] = "asc";
                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();
                    this.jsCtrl.sortAfter(this, 'asc');
                });
            }
        }
        else {
            var sortDesc = this.ctrl.getAttribute("sortDesc");
            if (sortDesc != null) {
                var jsonSortDesc = JSON.parse(sortDesc);
                this.sortDescCls = jsonSortDesc.descCls;
                this.sortAscCls = jsonSortDesc.ascCls;
                this.sortDefaultCls = jsonSortDesc.defaultCls;
                for (var nI = 0; nI < $("." + this.sortDefaultCls).length; nI++)
                    $("." + this.sortDefaultCls)[nI].jsCtrl = this;
                $("." + this.sortDefaultCls).unbind("click");
                $("." + this.sortDefaultCls).click(function () {
                    var reqParam = this.jsCtrl.ctrl.getAttribute("reqParam");
                    if (reqParam == null || reqParam == "")
                        reqParam = {};
                    else
                        reqParam = JSON.parse(reqParam);
                    reqParam["sortField"] = this.getAttribute("paramName");
                    if (this.getAttribute("sort") == null) {
                        this.setAttribute("sort", "desc");
                        reqParam["sortType"] = "desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }
                    else if (this.getAttribute("sort") == "desc") {
                        this.setAttribute("sort", "asc");
                        reqParam["sortType"] = "asc";
                        this.jsCtrl.sortAfter(this, 'asc');
                    }
                    else {
                        this.setAttribute("sort", "desc");
                        reqParam["sortType"] = "desc";
                        this.jsCtrl.sortAfter(this, 'desc');
                    }

                    this.jsCtrl.ctrl.setAttribute("reqParam", JSON.stringify(reqParam));
                    document.body.jsCtrl.ctrl = this.jsCtrl.ctrl;
                    document.body.jsCtrl.init();


                });
            }
        }*/
    }
    this.insertAfter(cloneRow);
}

function clsStandardEditTableCtrl$del()
{
    if(this.chkId != null)
    {
        for(var nI=$("#"+this.ctrl.id).find("*[id='"+this.cloneId+"']").length-1; nI>=0; nI--)
        {
            var item = $("#"+this.ctrl.id).find("*[id='"+this.cloneId+"']")[nI];
            if($(item).find("#"+this.chkId)[0].checked)
            {
                if(this.optBefore("delete",item))
                {
                    if($(item).attr("tab") != "insert")
                    {
                        $(item).attr("tab","delete");
                        item.jsonData.opt = "delete";
                        $(item).hide();
                    }
                    else
                    {
                        this.delAfter(item);
                        item.parentNode.removeChild(item);
                    }
                }
            }
        }

    }
    // var rowNum = 0;
    for(var nI=0; nI<$("#"+this.ctrl.id).find("*[id='"+this.cloneId+"'][tab!=delete]").length; nI++){
        var itemC = $("#"+this.ctrl.id).find("*[id='"+this.cloneId+"'][tab!=delete]")[nI];
        if (this.idx != null){
            // if($(itemC).attr("tab")!="delete")
            //     rowNum++;
            $(itemC).find("#" + this.idx).html(nI+1);
        }
    }
    this.after();

}
function clsStandardEditTableCtrl$delAfter() {

}

function clsStandardEditTableCtrl$optBefore(tab,obj)
{
    return true;
}
function clsStandardEditTableCtrl$insertAfter() {

}
function clsStandardEditTableCtrl$getData()
{
    initValidateNoBind();
    var obj = new clsValidateCtrl();
    if(obj.validateAll())
    {
        var jsonData = [];
        $(this.ctrl).find("*[id='"+this.cloneId+"']").each(function(){
            jsonData.push(this.jsonData);
        });
        this.jsonData.resultData = jsonData;
        return this.jsonData;
    }
    return null;
}

function clsStandardEditTableCtrl$cacheChkAfter(obj, jsCtrl) {

}

function clsStandardEditTableCtrl$before() {
}

function clsStandardEditTableCtrl$progress(jsonItem, cloneRow) {
}

function clsStandardEditTableCtrl$after() {
}

/*********************************************************************************
 *                               alert弹出窗口组件说明
 *    author:dengyunfeng by ennew
 *    version:1.0
 *    updateTime: 2016-12-28
 *    实现功能：
 *
 *
 *
 **********************************************************************************/

function clsAlertBoxCtrl() {
    this.Alert = clsAlertBoxCtrl$Alert;
    this.templateAlert = clsAlertBoxCtrl$templateAlert;
    this.openWinAlert = clsAlertBoxCtrl$openWinAlert;
    this.jsonItem = {};//可以动态给对象挂载值
    this.alertSure = clsAlertBoxCtrl$sure;
    this.sureAfterTab = 1;
    this.alertSureAfter = clsAlertBoxCtrl$sureAfter;
    this.alertCancel = clsAlertBoxCtrl$cancle;
    this.alertCancelAfter = clsAlertBoxCtrl$cancleAfter;
    this.alertCloseAfter = clsAlertBoxCtrl$closeAfter;
    this.id = "";
    this.autoHide = false;//是否自动消失
    this.countDown = null;//倒计时
    this.autoHideFunc = clsAlertBoxCtrl$autoHideFunc;//自动消失执行的函数
    this.popWin = null;
}

function clsAlertBoxCtrl$Alert(data, title, hasCancle,isSure, popType,idName,isRepeat,popWin) {
    var _this = this;

    if(popWin != null)
        this.popWin = popWin;
    if ($("#alertBoxWin").length == 0) {
        var alertContent = this.templateAlert(data, true, title, hasCancle,isSure, popType,idName);
        $('body:first').append(alertContent);
    }
    else {
        var alertContent = this.templateAlert(data, false, title, hasCancle,isSure,popType,idName);
        $("#alertBoxWin").html(alertContent);
    }
    var num =  $("#alertBoxWin #countDown").text();
    var _this = this;
    this.countDown = setInterval(function(){
        num--;
        $("#alertBoxWin #countDown").text(num);
        if(num == 0){
            _this.autoHideFunc();
            closePopupWin();
            clearInterval(_this.countDown);
        }
    },1000);
    if($("#alertBoxWin").is(':hidden'))
    {
        $(popWin).hide();
        this.openWinAlert();
    }
    $('#alertBoxWin .btnOne').click(function () {
        _this.alertSure();
        closePopupWin();
        if(_this.popWin != null)
        {
            $(_this.popWin).show();
            startCovered(_this.popWin);
            currPopDiv = _this.popWin;
            _this.popWin = null;
        }
        if(_this.sureAfterTab == 1)
            _this.alertSureAfter();
    })
    $('#alertBoxWin .btnSecond').click(function () {
        _this.alertCancel();
        closePopupWin();
        if(_this.popWin != null)
        {
            $(_this.popWin).show();
            startCovered(_this.popWin);
            currPopDiv = _this.popWin;
            _this.popWin = null;
        }
        // clsAlertBoxCtrl$cancle();
        _this.alertCancelAfter()
    });
    $('#alertBoxWin .close').click(function () {

        closePopupWin();
        if(_this.popWin != null)
        {
            $(_this.popWin).show();
            startCovered(_this.popWin);
            currPopDiv = _this.popWin;
            _this.popWin = null;
        }
        _this.alertCloseAfter();
    });
    $(document).keyup(function(event){
        switch(event.keyCode) {
            //ESC关闭弹窗
            case 27:
                closePopupWin();
                if(_this.popWin != null)
                {
                    $(_this.popWin).show();
                    startCovered(_this.popWin);
                    currPopDiv = _this.popWin;
                    _this.popWin = null;
                }
                _this.alertCloseAfter();
            //按Enter确认
            case 13:
                _this.alertSure();
                closePopupWin();
                if(_this.popWin != null)
                {
                    $(_this.popWin).show();
                    startCovered(_this.popWin);
                    currPopDiv = _this.popWin;
                    _this.popWin = null;
                }
                if(_this.sureAfterTab == 1)
                    _this.alertSureAfter();
        }
    });
}

//模拟alert弹窗模板
function clsAlertBoxCtrl$templateAlert(data, bln, title, hasCancle,hasSure, popType,idName) {
    if (bln && popType && popType == 1) {
        this.html = "<div id='alertBoxWin' class='popup sucpop' style='display:none;z-index:1000;'>";
    } else if (bln && !popType) {
        this.html = "<div id='alertBoxWin' class='popup' style='display:none;z-index:1000;'>";
    } else {
        this.html = "";
    }

    this.html = this.html + "<div class='title'>";
    if (title) {
        this.html = this.html + "<h2>" + title + "</h2>";
    } else {
        this.html = this.html + "<h2></h2>";
    }
    this.html = this.html + "<div id='"+ idName +"'>";
    this.html = this.html + "<a class='min' href='javascript:;' title='最小化' style='display:none;'></a>";
    this.html = this.html + "<a class='max' href='javascript:;' title='最大化' style='display:none;'></a>";
    this.html = this.html + "<a class='revert' href='javascript:;' title='还原' style='display:none;'></a>";
    this.html = this.html + "<a class='close' href='javascript:;' title='关闭'";
    if(this.autoHide)this.html = this.html + "style='display:none'"
    this.html = this.html + "></a>"
    this.html = this.html + "</div>";
    this.html = this.html + "</div>";
    this.html = this.html + "<div class='content'>";
    this.html = this.html + "<div class='main'>";
    this.html = this.html + "<div class='cell'>";
    this.html = this.html + "<i><b></b></i><span>" + data + "</span>";
    this.html = this.html + "</div>";
    this.html = this.html + "</div>";
    this.html = this.html + "<div class='btn'>";
    if(!this.autoHide){
        if(!hasSure)this.html = this.html + "<a href='javascript:' class='btnOne btnStyle1'>确 定</a>";
        if (hasCancle) this.html = this.html + "<a href='javascript:' class='btnSecond btnStyle1 ml10'>返回</a>";
    }else{
        this.html = this.html + "<span style='color:red' id='countDown'>3</span>秒后自动关闭";
    }
    this.html = this.html + "</div>";
    this.html = this.html + "</div>";
    this.id = idName;
    if (bln)
        this.html = this.html + "</div>";
    return this.html;
}

//弹出方法
function clsAlertBoxCtrl$openWinAlert() {
    openWin(345, 160, "alertBoxWin", true,null,null,true);
}

//点击确认执行的方法
function clsAlertBoxCtrl$sure() {

}

//关闭窗口以后执行回调函数
function clsAlertBoxCtrl$sureAfter()
{

}
//点击弹窗X回调函数
function clsAlertBoxCtrl$closeAfter(){

}
//点击取消执行的方法
function clsAlertBoxCtrl$cancle() {

}

//关闭窗口以后执行回调函数
function clsAlertBoxCtrl$cancleAfter()
{

}
//自动消失执行的函数
function clsAlertBoxCtrl$autoHideFunc(){

}
function clsStdProgressBarCtrl() {
    this.html = "";
    this.ctrl = null;			//进度条对象
    this.steps = "";	//进度条步骤总数
    this.stepsName = null;	//进度条步骤名称
    this.stepsRemark = "";	//进度条步骤备注
    this.curstep = "";
    this.templateIdx = "0";
    this.progressBarW = "";			//进度条自适应宽度
    this.template = clsStdProgressBarCtrl$template;
    this.templateA = clsStdProgressBarCtrl$templateA;
    this.init = clsStdProgressBarCtrl$init;
    this.parse = clsStdProgressBarCtrl$parse;
}

function clsStdProgressBarCtrl$init() {
    if (this.ctrl.getAttribute("templateIdx") != null)
        this.templateIdx = this.ctrl.getAttribute("templateIdx");
    if (this.ctrl.getAttribute("steps") != null)
        this.steps = this.ctrl.getAttribute("steps");
    if (this.ctrl.getAttribute("stepsName") != null)
        this.stepsName = this.ctrl.getAttribute("stepsName");
    if (this.ctrl.getAttribute("stepsRemark") != null)
        this.stepsRemark = this.ctrl.getAttribute("stepsRemark");
    if (this.ctrl.getAttribute("curstep") != null)
        this.curstep = this.ctrl.getAttribute("curstep");
    if (this.ctrl.getAttribute("progressBarW") != null)
        this.progressBarW = this.ctrl.getAttribute("progressBarW");

    this.parse();
}

function clsStdProgressBarCtrl$parse() {
    switch (this.templateIdx) {
        case "0":
            this.template();
            break;
        case "1":
            this.templateA();
            break;
        default:
            this.template();
            break;
    }

    this.ctrl.innerHTML = this.html;
}


//进度条模板
function clsStdProgressBarCtrl$template() {
    this.html = '<ul class="progressBar_ul clearfix to-b">';
    this.steps = parseInt(this.steps);
    var singleStepW = parseInt(parseFloat(this.progressBarW) / this.steps);
    var stepsNameArr = (this.stepsName == null) ? null : this.stepsName.split(',');
    for (var stepIdx = 0; stepIdx < this.steps; stepIdx++) {
        this.html += '<li class="' + (stepIdx == 0 ? "progressBar_li_first " : "") + (stepIdx + 1 <= this.curstep ? "progressBar_li_cur " : "") + (stepIdx == this.steps - 1 ? "progressBar_li_last " : "") + 'progressBar_li" style="width:' + singleStepW + 'px;">'
            + '<span class="progressBar_circle">' + (stepIdx + 1) + '</span>'
        if (stepsNameArr != null)
            this.html += '<p class="progressName">' + (stepsNameArr[stepIdx] ? stepsNameArr[stepIdx] : "") + '</p></li>';
        else
            this.html += '</li>';
    }
    this.html += '</ul>';

}


//进度条模板A
function clsStdProgressBarCtrl$templateA() {
    this.html = '<ul class="progressBar_ul clearfix to-b">';
    this.steps = parseInt(this.steps);
    var singleStepW = parseInt(parseFloat(this.progressBarW) / this.steps);
    var stepsNameArr = this.stepsName.split(',');
    var stepsRemarkArr = this.stepsRemark.split(',');
    for (var stepIdx = 0; stepIdx < this.steps; stepIdx++) {
        this.html += '<li class="' + (stepIdx == 0 ? "progressBar_li_first " : "") + (stepIdx + 1 <= this.curstep ? "progressBar_li_cur " : "") + (stepIdx == this.steps - 1 ? "progressBar_li_last " : "") + 'progressBar_li" style="width:' + singleStepW + 'px;">'
            + '<p class="progressName">' + (stepsNameArr[stepIdx] ? stepsNameArr[stepIdx] : "") + '</p>'
            + '<span class="progressBar_circle">' + (stepIdx + 1) + '</span>'
            + '<div class="progressBar_li_data">' + (stepsRemarkArr[stepIdx] ? stepsRemarkArr[stepIdx] : "") + '</div>'
            + '</li>'
    }
    this.html += '</ul>';

}


/*********************************************************************************
 *                               倒数时间控件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2017-1-4
 *    实现功能：支持倒数时间，并且当倒数时间为0时触发自定义方法
 *
 *
 *
 **********************************************************************************/
function clsCountDownTimerCtrl() {
    this.ctrl = null;
    this.targetTime = null;
    this.differTime = null;
    this.clearId = null;
    this.countTime = 0;
    this.showType = "0"; //0:不管是否为0全部显示, 1:如果天为000则不显示,2:最多显示2位如天小时或者小时分钟
    this.condition = null;//自定义条件
    this.init = clsCountDownTimerCtrl$init;
    this.parse = clsCountDownTimerCtrl$parse;
    this.getTime = clsCountDownTimerCtrl$getTime;
    this.fillZero = clsCountDownTimerCtrl$fillZero;
    this.zeroFunc = clsCountDownTimerCtrl$zeroFunc;
    this.zeroFuncAfter=clsCountDownTimerCtrl$zeroFuncAfter;
    this.before = clsCountDownTimerCtrl$before;
    this.resetTime = clsCountDownTimerCtrl$resetTime;
    this.difineFunc = clsCountDownTimerCtrl$difineFunc;
}

function clsCountDownTimerCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("showType") != null)
            this.showType = this.ctrl.getAttribute("showType");
        if (this.ctrl.getAttribute("targetTime") != null)
            this.targetTime = this.ctrl.getAttribute("targetTime");
        if (this.ctrl.getAttribute("differTime") != null)
            this.differTime = this.ctrl.getAttribute("differTime");
        if (this.ctrl.getAttribute("condition") != null)
            this.condition = this.ctrl.getAttribute("condition");
        this.parse();
    }
}

function clsCountDownTimerCtrl$parse() {
    var objTimer = this.ctrl;
    this.ctrl.innerHTML = '<span></span><span></span><span></span><span></span>';
    this.countTime = 0;

    this.clearId = setInterval(function () {
        //var a = objTimer;
        //alert(objTimer)
        objTimer.jsCtrl.countTime++;
        objTimer.jsCtrl.getTime();
    }, 1000);
}

function clsCountDownTimerCtrl$getTime() {
    var a = this.ctrl.getElementsByTagName('span')[0];
    var b = this.ctrl.getElementsByTagName('span')[1];
    var c = this.ctrl.getElementsByTagName('span')[2];
    var d = this.ctrl.getElementsByTagName('span')[3];
    if (this.ctrl.getAttribute('targetTime')) {
        var differTime = parseFloat(this.ctrl.getAttribute('targetTime')) - new Date().getTime();
    }
    if (this.ctrl.getAttribute('differTime')) {
        var differTime = parseFloat(this.ctrl.getAttribute('differTime')) - this.countTime * 1000;
    }
    $(this.ctrl).attr("currentTime",differTime);
    this.before(this.ctrl,differTime);
    if(this.condition != null)
    {
        if(eval(this.condition))
        {
            this.difineFunc(this.ctrl,differTime);
        }
    }
    if (differTime <= 0) {
        a.innerHTML = '0天';
        b.innerHTML = '0小时';
        c.innerHTML = '0分';
        d.innerHTML = '0秒';
        if(differTime <= -1){
            a.innerHTML = '0天';
            b.innerHTML = '0小时';
            c.innerHTML = '0分';
            d.innerHTML = '0秒';
            clearInterval(this.clearId);
            this.zeroFuncAfter(this.ctrl);
            return;
        }else{
            this.zeroFunc(this.ctrl);
            return;
        }
        
    }
    var days = parseInt(differTime / (1000 * 60 * 60 * 24))
    var hours = parseInt(differTime % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    var minutes = parseInt(differTime % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) / (1000 * 60));
    var seconds = parseInt(differTime % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) % (1000 * 60) / 1000);
    // console.log(days+' '+hours+' '+minutes+' '+seconds)
    var dayVal = parseInt(this.fillZero(days, 3));
    var hVal = parseInt(this.fillZero(hours, 2));
    var mVal = parseInt(this.fillZero(minutes, 2));
    var sVal = parseInt(this.fillZero(seconds, 2));
    switch (this.showType) {
        case "1":
            a.innerHTML = (dayVal == "000") ? "" : parseInt(dayVal) + "天";
            b.innerHTML = (hVal == "00") ? "" : parseInt(hVal) + "小时";
            c.innerHTML = (mVal == "00") ? "" : parseInt(mVal) + "分";
            d.innerHTML = (sVal == "00") ? "" : parseInt(sVal) + "秒";
            break;
        case "2":
            $(a).show();
            $(b).show();
            $(c).show();
            $(d).show();
            a.innerHTML = (dayVal == "000") ? "0" : dayVal + "天";
            b.innerHTML = (hVal == "00") ? "0小时" : hVal + "小时";
            c.innerHTML = (mVal == "00") ? "0分" : mVal + "分";
            d.innerHTML = (sVal == "00") ? "0秒" : sVal + "秒";
            if (dayVal != "000") {
                $(c).hide();
                $(d).hide();
            }
            else {
                if (hVal != "00") {
                    $(a).hide();
                    $(d).hide();
                }
                else {
                    if (mVal != "00") {
                        $(a).hide();
                        $(b).hide();
                    }
                    else {
                        if (sVal != "00") {
                            $(a).hide();
                            $(b).hide();
                            $(c).hide();
                        }
                    }
                }
            }
            break;
        default:
            a.innerHTML = this.fillZero(days, 3) + "天";
            b.innerHTML = this.fillZero(hours, 2) + "小时";
            c.innerHTML = this.fillZero(minutes, 2) + "分";
            d.innerHTML = this.fillZero(seconds, 2) + "秒";
            break;
    }

}
function clsCountDownTimerCtrl$resetTime()
{
    clearInterval(this.clearId);
    var objTimer = this.ctrl;
    this.countTime = 0;

    this.clearId = setInterval(function () {
        //var a = objTimer;
        //alert(objTimer)
        objTimer.jsCtrl.countTime++;
        objTimer.jsCtrl.getTime();
    }, 1000);
}
function clsCountDownTimerCtrl$fillZero(num, digit) {
    var str = '' + num;
    while (str.length < digit) {
        str = '0' + str;
    }
    return str;
}


function clsCountDownTimerCtrl$zeroFunc(obj) {

}
function clsCountDownTimerCtrl$before(ctrl,timeNum){

}

function clsCountDownTimerCtrl$difineFunc()
{
    
}
function clsCountDownTimerCtrl$zeroFuncAfter(){
    
}

/*********************************************************************************
 *                               简单表单组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2017-02-20
 *    实现功能：对表单赋值，支持自定义赋值
 *
 *
 *
 **********************************************************************************/
function clsFormCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.jsonChildName = null;
    this.init = clsFormCtrl$init;
    this.parse = clsFormCtrl$parse;
    this.refresh = clsFormCtrl$refresh;
    this.clear = clsFormCtrl$clear;
    this.setValue = clsFormCtrl$setValue;
    this.before = clsFormCtrl$before;
    this.after = clsFormCtrl$after;
    this.empty = clsFormCtrl$empty;
    this.setChildDocAssistant = clsFormCtrl$setChildDocAssistant;
}

function clsFormCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("jsonChildName") != null)
            this.jsonChildName = this.ctrl.getAttribute("jsonChildName");
        this.parse();
    }
}

function clsFormCtrl$parse() {
    this.before(this.jsonData);
    if (this.jsonData != null) {
        if (this.jsonChildName == null)
            this.setValue(this.jsonData);
        else
            this.setValue(this.jsonData[this.jsonChildName]);
    }
    this.after(this.jsonData);

}

function clsFormCtrl$setValue(jsonItem) {
    for (key in jsonItem) {
        var ctrl = $(this.ctrl).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsFormCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsFormCtrl$empty(jsonItem) {
    for (key in jsonItem) {
        var ctrl = $(this.ctrl).find("#" + key)[0];
        if (ctrl != null) {
            var value = "";
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsFormCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsFormCtrl$clear() {
    if (this.jsonData != null) {
        if (this.jsonChildName == null)
            this.empty(this.jsonData);
        else
            this.empty(this.jsonData[this.jsonChildName]);
    }
}

function clsFormCtrl$before(jsonItem) {
}

function clsFormCtrl$after(jsonItem) {
}

/*********************************************************************************
 *                               标准tab页组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2017-05-19
 *    实现功能：tab页，支持内容一个容器或者多个容器 tabType:uniqueContent(一个容器)
 *    null为多个容器
 *
 *
 **********************************************************************************/
function clsTabCtrl() {
    this.ctrl = null;		//初始化对象
    this.contentCls = "tabContent";
    this.tabType = null;
    this.eleContent = null;
    this.init = clsTabCtrl$init;
    this.parse = clsTabCtrl$parse;
    this.after = clsTabCtrl$after;
}

function clsTabCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("contentCls") != null)
            this.contentCls = this.ctrl.getAttribute("contentCls");

        if (this.ctrl.getAttribute("tabType") != null)
            this.tabType = this.ctrl.getAttribute("tabType");
        /*if(this.ctrl.getAttribute("initValue") != null)
         this.initValue = this.ctrl.getAttribute("initValue");
         if(this.ctrl.getAttribute("emptyValue") != null)
         this.emptyValue = this.ctrl.getAttribute("emptyValue");*/
        this.parse();
    }
}

function clsTabCtrl$parse() {
    var eleTab = $(this.ctrl).find('li');
    this.eleContent = $('.' + this.contentCls);
    for (var nI = 0; nI < eleTab.length; nI++) {
        eleTab[nI].tabCtrl = this.ctrl;
        if (this.tabType == "uniqueContent")
            eleTab[nI].setAttribute("nIdx", 0);
        else
            eleTab[nI].setAttribute("nIdx", nI);
        $(eleTab[nI]).unbind("click");
        $(eleTab[nI]).click(function () {
            for (var nI = 0; nI < eleTab.length; nI++) {
                $(eleTab[nI]).removeClass("tabTitLi");
                if (this.tabCtrl.jsCtrl.tabType != "uniqueContent")
                    $(this.tabCtrl.jsCtrl.eleContent[nI]).hide();
            }
            var nIdx = $(this).index();
            $(this).addClass("tabTitLi");
            $(this.tabCtrl.jsCtrl.eleContent[nIdx]).show();
            this.tabCtrl.jsCtrl.after(this.getAttribute("nIdx"), this);
        });
    }
}

function clsTabCtrl$after(nIdx) {

}

/*********************************************************************************
 *                               字符串分页组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2017-06-16
 *    实现功能：通过指定分页高度把百度富文本编辑器中的内容以p为标准进行分页
 *
 *
 *
 **********************************************************************************/
function clsStrPageCtrl() {
    this.ctrl = null;		//初始化对象
    this.pageHeight = 0;
    this.nPages = 1;

    this.init = clsStrPageCtrl$init;
    this.parse = clsStrPageCtrl$parse;
    this.page = clsStrPageCtrl$page;
}

function clsStrPageCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("pageHeight") != null)
            this.pageHeight = parseFloat(this.ctrl.getAttribute("pageHeight"));

        //this.parse();
    }
}

function clsStrPageCtrl$parse() {
    var sumH = 0;				//当前页面累计高度
    var nCurrentPage = 1;				//当前页数
    var nPages = this.nPages;		//总页数
    var pageHeight = this.pageHeight;	//多高分页;
    var objPNum = $(this.ctrl).children("*").length;
    $(this.ctrl).children("*").each(function (nIdx) {
        $(this).attr("pageNum", nPages);
        sumH = sumH + this.offsetHeight;
        if (sumH > pageHeight && nIdx < objPNum - 1) {
            nPages++;
            sumH = 0;
        }
    });
    this.nPages = nPages;

    $(this.ctrl).children("*[pageNum!='" + nCurrentPage + "']").each(function () {
        $(this).hide();
    });
    this.page(this.ctrl.getAttribute("page"));
}

function clsStrPageCtrl$page(strClsName) {
    $("." + strClsName).createPage({
        pageCount: this.nPages,
        current: 1,
        parentObj: this.ctrl,
        backFn: function (p) {

            $($(this)[0].parentObj).find("p[pageNum!='" + p + "']").each(function () {
                $(this).hide();
            });
            $($(this)[0].parentObj).find("p[pageNum='" + p + "']").each(function () {
                $(this).show();
            });
        }
    });
}

/*********************************************************************************
 *                               加减行组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-09-04
 *    实现功能：第一行永远没有减号，加号永远在最后一行，如果多行，除了第一行都有减号
 *
 *
 *
 **********************************************************************************/
function clsPlusMinusRowCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.templateId = null;
    this.cloneId = null;
    this.clsPlus = null;
    this.clsMinus = null;
    this.idx = null;
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.init = clsPlusMinusRowCtrl$init;
    this.parse = clsPlusMinusRowCtrl$parse;
    this.refresh = clsPlusMinusRowCtrl$refresh;
    this.clear = clsPlusMinusRowCtrl$clear;
    this.setValue = clsPlusMinusRowCtrl$setValue;
    this.before = clsPlusMinusRowCtrl$before;
    this.progress = clsPlusMinusRowCtrl$progress;
    this.after = clsPlusMinusRowCtrl$after;
    this.bind = clsPlusMinusRowCtrl$bind;
}

function clsPlusMinusRowCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("templateId") != null)
            this.templateId = this.ctrl.getAttribute("templateId");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("clsPlus") != null)
            this.clsPlus = this.ctrl.getAttribute("clsPlus");
        if (this.ctrl.getAttribute("clsMinus") != null)
            this.clsMinus = this.ctrl.getAttribute("clsMinus");

        this.parse();

    }
}

function clsPlusMinusRowCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateId != null) {

        this.cloneId = this.templateId.replace("template", "clone");
        this.clear();
        var templateRow = $(this.ctrl).find("#" + this.templateId)[0];
        if (this.jsonData != null) {
            for (var nI = 0; nI < this.jsonData.rspBody.length; nI++) {
                var jsonItem = this.jsonData.rspBody[nI];
                var cloneRow = templateRow.cloneNode(true);
                cloneRow.id = this.cloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                this.progress(jsonItem, cloneRow);

                if (nI > 0) {
                    if (nI == this.jsonData.rspBody.length - 1) {
                        $(cloneRow).find("." + this.clsPlus).show();
                        $(cloneRow).find("." + this.clsMinus).show();
                    }
                    else {
                        $(cloneRow).find("." + this.clsPlus).hide();
                        $(cloneRow).find("." + this.clsMinus).show();
                    }
                }
                else if (nI == 0 && this.jsonData.rspBody.length == 1) {
                    $(cloneRow).find("." + this.clsPlus).show();
                    $(cloneRow).find("." + this.clsMinus).hide();
                }


                //如果有序号字段，则赋值
                if (this.idx != null)
                    $(cloneRow).find("#" + this.idx).html(nI + 1);
                this.setValue(jsonItem, cloneRow);
                templateRow.parentNode.insertBefore(cloneRow, templateRow);
                this.bind(cloneRow);
                if (this.isValidate == "1")
                    initValidate(cloneRow);
            }
        }

    }
    this.after();
    $(cloneRow).find("." + this.clsPlus)[0].ctrl = this.ctrl;
    $(cloneRow).find("." + this.clsMinus)[0].ctrl = this.ctrl;
    $(cloneRow).find("." + this.clsPlus).click(function () {
        var templateRow = $(this.ctrl).find("#" + this.ctrl.jsCtrl.templateId)[0];
        var cloneRow = templateRow.cloneNode(true);
        cloneRow.id = this.ctrl.jsCtrl.cloneId;
        cloneRow.style.display = "";
        templateRow.parentNode.insertBefore(cloneRow, templateRow);
        this.ctrl.jsCtrl.bind(cloneRow);
        this.ctrl.jsCtrl.refresh();
    });
    $(cloneRow).find("." + this.clsMinus).click(function () {
        var targetRow = $(this).parents("*[id='" + this.ctrl.jsCtrl.cloneId + "']")[0];
        targetRow.parentNode.removeChild(targetRow);
        this.ctrl.jsCtrl.refresh();
    });
}

function clsPlusMinusRowCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsPlusMinusRowCtrl$refresh() {
    var objList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = 0; nI < objList.length; nI++) {
        if (nI > 0) {
            if (nI == objList.length - 1) {
                $(objList[nI]).find("." + this.clsPlus).show();
                $(objList[nI]).find("." + this.clsMinus).show();
            }
            else {
                $(objList[nI]).find("." + this.clsPlus).hide();
                $(objList[nI]).find("." + this.clsMinus).show();
            }
        }
        else if (nI == 0 && objList.length == 1) {
            $(objList[nI]).find("." + this.clsPlus).show();
            $(objList[nI]).find("." + this.clsMinus).hide();
        }
        else {
            $(objList[nI]).find("." + this.clsPlus).hide();
            $(objList[nI]).find("." + this.clsMinus).hide();
        }
    }
}

function clsPlusMinusRowCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

function clsPlusMinusRowCtrl$before() {
}

function clsPlusMinusRowCtrl$progress(jsonItem, cloneRow) {
}

function clsPlusMinusRowCtrl$after() {
}


/*********************************************************************************
 *                               父子关系表格组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-07-27
 *    实现功能：主子表数据初始化，主表checkbox控制子表
 *
 *
 *
 **********************************************************************************/
function clsParentChildTableCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.templateParentId = null;
    this.parentCloneId = null;
    this.childParentId = null;
    this.childCloneId = null;
    this.noDataId = null;
    this.idx = null;
    this.parentIdx = null;
    this.url = null;
    this.jsonChildName = null;
    this.chkP = null;	//父表checkbox
    this.chkC = null;	//子表checkbox
    this.nStartStep = "0";
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.cacheArr	= new Array();
    this.isCacheCond= null;
    this.init = clsParentChildTableCtrl$init;
    this.parse = clsParentChildTableCtrl$parse;
    this.refresh = clsParentChildTableCtrl$refresh;
    this.clear = clsParentChildTableCtrl$clear;
    this.setValue = clsParentChildTableCtrl$setValue;
    this.before = clsParentChildTableCtrl$before;
    this.progress = clsParentChildTableCtrl$progress;
    this.childProgress = clsParentChildTableCtrl$childProgress;
    this.after = clsParentChildTableCtrl$after;
    this.chkAfter = clsParentChildTableCtrl$chkAfter;
    this.page = clsParentChildTableCtrl$page;
    this.setChildDocAssistant = clsParentChildTableCtrl$setChildDocAssistant;
    this.cacheChkProc=clsParentChildTableCtrl$cacheChkProc;
    this.cacheChkAfter = clsStandardTableCtrl$cacheChkAfter;
}

function clsParentChildTableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("parentIdx") != null)
            this.parentIdx = this.ctrl.getAttribute("parentIdx");
        if (this.ctrl.getAttribute("templateChildId") != null)
            this.templateChildId = this.ctrl.getAttribute("templateChildId");
        if (this.ctrl.getAttribute("templateParentId") != null)
            this.templateParentId = this.ctrl.getAttribute("templateParentId");
        if (this.ctrl.getAttribute("jsonChildName") != null)
            this.jsonChildName = this.ctrl.getAttribute("jsonChildName");
        if (this.ctrl.getAttribute("nStartStep") != null)
            this.nStartStep = this.ctrl.getAttribute("nStartStep");
        if (this.ctrl.getAttribute("chkC") != null)
            this.chkC = this.ctrl.getAttribute("chkC");
        if (this.ctrl.getAttribute("chkP") != null)
            this.chkP = this.ctrl.getAttribute("chkP");

        this.parse();
        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));


    }
}

function clsParentChildTableCtrl$page(strClsName) {
    if (this.jsonData != null) {
        $("." + strClsName).createPage({
            pageCount: this.jsonData.pages,
            current: this.jsonData.pageNum,
            parentObj: this.ctrl,
            backFn: function (p) {
                var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
                jsonCondData.pageNum = p;
                $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
                document.body.jsCtrl.ctrl = $(this)[0].parentObj;
                document.body.jsCtrl.init();
                //$(this)[0].parentObj.jsCtrl.refresh();
            }
        });
    }

}

function clsParentChildTableCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateParentId != null) {

        this.parentCloneId = this.templateParentId.replace("template", "clone");
        this.clear();
        var parentTemplateRow = $(this.ctrl).find("#" + this.templateParentId)[0];

        this.childCloneId = this.templateChildId.replace("template", "clone");

        if (this.noDataId != null && this.jsonData.resultData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
        }
        else {
        }
        if (this.jsonData.resultData != null) {
            for (var nI = 0; nI < this.jsonData.resultData.length; nI++) {
                var jsonItem = this.jsonData.resultData[nI];
                var cloneRow = parentTemplateRow.cloneNode(true);
                cloneRow.id = this.parentCloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                this.progress(jsonItem, cloneRow);
                //如果有序号字段，则赋值
                if (this.parentIdx != null)
                    $(cloneRow).find("#" + this.parentIdx).html(nI + 1);
                this.setValue(jsonItem, cloneRow);
                this.setChildDocAssistant(cloneRow);
                parentTemplateRow.parentNode.insertBefore(cloneRow, parentTemplateRow);

                //解析子表
                if (jsonItem[this.jsonChildName] != null) {
                    for (var mI = 0; mI < jsonItem[this.jsonChildName].length; mI++) {
                        var jsonCItem = jsonItem[this.jsonChildName][mI];
                        var childTemplateRow = $(cloneRow).find("#" + this.templateChildId)[0];
                        var childCloneRow = childTemplateRow.cloneNode(true);
                        childCloneRow.id = this.childCloneId;
                        childCloneRow.style.display = "";
                        childCloneRow.jsonData = jsonCItem;
                        childCloneRow.jsonPData = jsonItem;
                        this.childProgress(jsonCItem, childCloneRow, jsonItem, cloneRow);
                        //如果有序号字段，则赋值
                        if (this.idx != null)
                            $(childCloneRow).find("#" + this.idx).html(mI + 1);
                        this.setValue(jsonCItem, childCloneRow);
                        this.setChildDocAssistant(childCloneRow);
                        childTemplateRow.parentNode.insertBefore(childCloneRow, childTemplateRow);
                    }
                }

                if (this.chkP != null) {
                    $(cloneRow).find("." + this.chkP)[0].parentObj = cloneRow;
                    $(cloneRow).find("." + this.chkP)[0].jsPCtrl = this;
                    $(cloneRow).find("." + this.chkP).click(function () {
                        if (this.checked) {
                            $(this.parentObj).find("." + this.jsPCtrl.chkC).each(function () {
                                if ($(this).parents('*:hidden').length == 0)
                                    this.checked = true;
                            });
                        }
                        else {
                            $(this.parentObj).find("." + this.jsPCtrl.chkC).each(function () {
                                if ($(this).parents('*:hidden').length == 0)
                                    this.checked = false;
                            });
                        }
                        this.jsPCtrl.chkAfter(this);
                    });

                    $(cloneRow).find("." + this.chkP)[0].arrObj = new Array();
                    var objChkP = $(cloneRow).find("." + this.chkP)[0];
                    for (var xI = 0; xI < $(cloneRow).find("." + this.chkC).length; xI++) {
                        var chkCItem = $(cloneRow).find("." + this.chkC)[xI];
                        if ($(chkCItem).parents('*:hidden').length == 0)
                            $(cloneRow).find("." + this.chkP)[0].arrObj.push(chkCItem);
                        chkCItem.objChkP = objChkP;
                    }

                    $(cloneRow).find("." + this.chkC).click(function () {
                        var bln = true;
                        for (var nI = 0; nI < this.objChkP.arrObj.length; nI++) {
                            if (this.objChkP.arrObj[nI].checked == false)
                                bln = false;
                        }
                        this.objChkP.checked = bln;
                    });
                }

                //初始化checkbox和全选直接互相联动
                if (this.chkP != null && this.clsAllChk != null) {
                    $(cloneRow).find("." + this.chkP)[0].jsUnionCtrl = this;
                    $(cloneRow).find("." + this.chkP).click(function () {
                        var bln = true;
                        $(this.jsUnionCtrl.ctrl).find("*[id^='clone']").find("." + this.jsUnionCtrl.chkP).each(function () {
                            if (this.checked == false)
                                bln = false;
                        });
                        $(this.jsUnionCtrl.ctrl).find("." + this.jsUnionCtrl.clsAllChk).prop("checked", bln);
                        this.jsUnionCtrl.cacheChkProc(this);
                    });
                }

                if (this.isValidate == "1")
                    initValidate(cloneRow);
            }
        }

    }
    this.after();

}

//缓存选项
function clsParentChildTableCtrl$cacheChkProc(obj) {
    if (this.isCacheCond != null) {
        if (typeof(this.isCacheCond) == "function")
            this.cacheArr = this.isCacheCond(this);
        else {
            var cloneRow = $(obj).parents("*[id='" + this.cloneId + "']:first")[0];
            var isRepeat = false;
            for (var nI = this.cacheArr.length - 1; nI >= 0; nI--) {
                var ele = this.cacheArr[nI];
                if (ele[this.isCacheCond] == cloneRow.jsonData[this.isCacheCond]) {
                    if (!obj.checked)
                        this.cacheArr.splice(nI, 1);
                    isRepeat = true;
                }
            }
            if (!isRepeat)
                this.cacheArr.push(cloneRow.jsonData);
        }
        this.ctrl.cacheArr = this.cacheArr;
        this.cacheChkAfter(obj, this);
    }
}

function clsParentChildTableCtrl$cacheChkAfter(obj, jsCtrl) {

}

function clsParentChildTableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "select":
                    var oJsCtrl = new clsTextCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    $(ctrl).attr("regionValue",value);
                    $(ctrl).blur(function(){
                        this.jsCtrl.jsonData[this.id] = $(this).val();
                    });
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsParentChildTableCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsParentChildTableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsParentChildTableCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.parentCloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

function clsParentChildTableCtrl$before() {
}

function clsParentChildTableCtrl$progress(jsonItem, cloneRow) {
}

function clsParentChildTableCtrl$childProgress(jsonCItem, childCloneRow, jsonItem, cloneRow) {
}

function clsParentChildTableCtrl$after() {
}

function clsParentChildTableCtrl$chkAfter() {

}

/*********************************************************************************
 *                               三层关系表格组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2016-11-02
 *    实现功能：主子表数据初始化，主表checkbox控制子表
 *
 *
 *
 **********************************************************************************/
function clsThirdLevelTableCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.templateParentId = null;
    this.templateChildId = null;
    this.templateGrandChildId = null;
    this.parentCloneId = null;
    this.childParentId = null;
    this.childCloneId = null;
    this.grandChildCloneId = null;
    this.noDataId = null;
    this.idx = null;
    this.grandIdx = null;
    this.parentIdx = null;
    this.url = null;
    this.jsonSecondName = null;
    this.jsonThirdName = null;
    this.chkP = null;	//父表checkbox
    this.chkC = null;	//子表checkbox
    this.chkCC = null;	//孙子表checkbox
    this.nStartStep = "0";
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.init = clsThirdLevelTableCtrl$init;
    this.parse = clsThirdLevelTableCtrl$parse;
    this.refresh = clsThirdLevelTableCtrl$refresh;
    this.clear = clsThirdLevelTableCtrl$clear;
    this.setValue = clsThirdLevelTableCtrl$setValue;
    this.before = clsThirdLevelTableCtrl$before;
    this.progress = clsThirdLevelTableCtrl$progress;
    this.childProgress = clsThirdLevelTableCtrl$childProgress;
    this.grandChildProgress = clsThirdLevelTableCtrl$grandChildProgress;
    this.after = clsThirdLevelTableCtrl$after;
    this.chkAfter = clsThirdLevelTableCtrl$chkAfter;
    this.page = clsThirdLevelTableCtrl$page;
    this.cacheChkProc = clsThirdLevelTableCtrl$cacheChkProc;
    this.setChildDocAssistant = clsThirdLevelTableCtrl$setChildDocAssistant;
}

function clsThirdLevelTableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("grandIdx") != null)
            this.grandIdx = this.ctrl.getAttribute("grandIdx");
        if (this.ctrl.getAttribute("parentIdx") != null)
            this.parentIdx = this.ctrl.getAttribute("parentIdx");
        if (this.ctrl.getAttribute("templateChildId") != null)
            this.templateChildId = this.ctrl.getAttribute("templateChildId");
        if (this.ctrl.getAttribute("templateParentId") != null)
            this.templateParentId = this.ctrl.getAttribute("templateParentId");
        if (this.ctrl.getAttribute("templateGrandChildId") != null)
            this.templateGrandChildId = this.ctrl.getAttribute("templateGrandChildId");
        if (this.ctrl.getAttribute("jsonSecondName") != null)
            this.jsonSecondName = this.ctrl.getAttribute("jsonSecondName");
        if (this.ctrl.getAttribute("jsonThirdName") != null)
            this.jsonThirdName = this.ctrl.getAttribute("jsonThirdName");
        if (this.ctrl.getAttribute("nStartStep") != null)
            this.nStartStep = this.ctrl.getAttribute("nStartStep");
        if (this.ctrl.getAttribute("chkC") != null)
            this.chkC = this.ctrl.getAttribute("chkC");
        if (this.ctrl.getAttribute("chkCC") != null)
            this.chkCC = this.ctrl.getAttribute("chkCC");
        if (this.ctrl.getAttribute("chkP") != null)
            this.chkP = this.ctrl.getAttribute("chkP");

        this.parse();
        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));


    }
}

function clsThirdLevelTableCtrl$page(strClsName) {
    if (this.jsonData != null) {
        $("." + strClsName).createPage({
            pageCount: this.jsonData.pages,
            current: this.jsonData.pageNum,
            parentObj: this.ctrl,
            backFn: function (p) {
                var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
                jsonCondData.pageNum = p;
                $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
                document.body.jsCtrl.ctrl = $(this)[0].parentObj;
                document.body.jsCtrl.init();
                //$(this)[0].parentObj.jsCtrl.refresh();
            }
        });
    }

}

function clsThirdLevelTableCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateParentId != null) {

        this.parentCloneId = this.templateParentId.replace("template", "clone");
        this.clear();
        var parentTemplateRow = $(this.ctrl).find("#" + this.templateParentId)[0];

        this.childCloneId = this.templateChildId.replace("template", "clone");
        this.grandChildCloneId = this.templateGrandChildId.replace("template", "clone");
        if (this.noDataId != null && this.jsonData.resultData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        else if (this.noDataId != null && this.jsonData.resultData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
        }
        else {
        }
        if (this.jsonData.resultData != null) {
            for (var nI = 0; nI < this.jsonData.resultData.length; nI++) {
                var jsonItem = this.jsonData.resultData[nI];
                var cloneRow = parentTemplateRow.cloneNode(true);
                cloneRow.id = this.parentCloneId;
                cloneRow.style.display = "";
                cloneRow.jsonData = jsonItem;
                this.progress(jsonItem, cloneRow);
                //如果有序号字段，则赋值
                if (this.parentIdx != null)
                    $(cloneRow).find("#" + this.parentIdx).html(nI + 1);
                this.setValue(jsonItem, cloneRow);
                this.setChildDocAssistant(cloneRow);
                parentTemplateRow.parentNode.insertBefore(cloneRow, parentTemplateRow);

                //解析子表
                if (jsonItem[this.jsonSecondName] != null) {
                    for (var mI = 0; mI < jsonItem[this.jsonSecondName].length; mI++) {
                        var jsonCItem = jsonItem[this.jsonSecondName][mI];
                        var childTemplateRow = $(cloneRow).find("#" + this.templateChildId)[0];
                        var childCloneRow = childTemplateRow.cloneNode(true);
                        childCloneRow.id = this.childCloneId;
                        childCloneRow.style.display = "";
                        childCloneRow.jsonData = jsonCItem;
                        childCloneRow.jsonPData = jsonItem;
                        this.childProgress(jsonCItem, childCloneRow, jsonItem);
                        //如果有序号字段，则赋值
                        if (this.idx != null)
                            $(childCloneRow).find("#" + this.idx).html(mI + 1);
                        this.setValue(jsonCItem, childCloneRow);
                        this.setChildDocAssistant(childCloneRow);
                        childTemplateRow.parentNode.insertBefore(childCloneRow, childTemplateRow);

                        //解析孙子表
                        if (jsonCItem[this.jsonThirdName] != null) {
                            for (var xI = 0; xI < jsonCItem[this.jsonThirdName].length; xI++) {
                                var jsonCCItem = jsonCItem[this.jsonThirdName][xI];
                                var grandChildTemplateRow = $(childCloneRow).find("#" + this.templateGrandChildId)[0];
                                var grandChildCloneRow = grandChildTemplateRow.cloneNode(true);
                                grandChildCloneRow.id = this.grandChildCloneId;
                                grandChildCloneRow.style.display = "";
                                grandChildCloneRow.jsonData = jsonCCItem;
                                grandChildCloneRow.jsonPData = jsonCItem;
                                grandChildCloneRow.jsonGFData = jsonItem;
                                this.grandChildProgress(jsonCCItem, grandChildCloneRow, jsonCItem, jsonItem);
                                //如果有序号字段，则赋值
                                if (this.grandIdx != null)
                                    $(grandChildCloneRow).find("#" + this.grandIdx).html(xI + 1);
                                this.setValue(jsonCCItem, grandChildCloneRow);
                                this.setChildDocAssistant(grandChildCloneRow);
                                grandChildTemplateRow.parentNode.insertBefore(grandChildCloneRow, grandChildTemplateRow);
                            }
                        }
                    }
                }

                if (this.chkP != null) {
                    $(cloneRow).find("." + this.chkP)[0].parentObj = cloneRow;
                    $(cloneRow).find("." + this.chkP)[0].jsPCtrl = this;
                    $(cloneRow).find("." + this.chkP).unbind("click");
                    $(cloneRow).find("." + this.chkP).click(function () {
                        if (this.checked) {
                            $(this.parentObj).find("." + this.jsPCtrl.chkC).each(function () {
                                if ($(this).parents('*:hidden').length == 0)
                                    this.checked = true;
                            });
                        }
                        else {
                            $(this.parentObj).find("." + this.jsPCtrl.chkC).each(function () {
                                if ($(this).parents('*:hidden').length == 0)
                                    this.checked = false;
                            });
                        }
                        this.jsPCtrl.chkAfter(this);
                    });

                    $(cloneRow).find("." + this.chkP)[0].arrObj = new Array();
                    var objChkP = $(cloneRow).find("." + this.chkP)[0];
                    for (var xI = 0; xI < $(cloneRow).find("." + this.chkC).length; xI++) {
                        var chkCItem = $(cloneRow).find("." + this.chkC)[xI];
                        if ($(chkCItem).parents('*:hidden').length == 0) {
                            $(cloneRow).find("." + this.chkP)[0].arrObj.push(chkCItem);
                            chkCItem.jsPCtrl = this;
                        }
                        chkCItem.objChkP = objChkP;
                    }
                    $(cloneRow).find("." + this.chkC).unbind("click");
                    $(cloneRow).find("." + this.chkC).click(function () {
                        var bln = true;
                        for (var nI = 0; nI < this.objChkP.arrObj.length; nI++) {
                            if (this.objChkP.arrObj[nI].checked == false)
                                bln = false;
                        }
                        this.objChkP.checked = bln;
                        this.jsPCtrl.chkAfter(this);
                    });
                }

                if (this.isValidate == "1")
                    initValidate(cloneRow);
            }
        }

    }
    this.after();

}

function clsThirdLevelTableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsThirdLevelTableCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsThirdLevelTableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsThirdLevelTableCtrl$clear() {
    var cloneList = $(this.ctrl).find("*[id='" + this.parentCloneId + "']");
    for (var nI = cloneList.length - 1; nI >= 0; nI--) {
        cloneList[nI].parentNode.removeChild(cloneList[nI]);
    }
}

function clsThirdLevelTableCtrl$before() {
}

function clsThirdLevelTableCtrl$progress(jsonItem, cloneRow) {
}

function clsThirdLevelTableCtrl$childProgress(jsonCItem, cloneRow, jsonItem) {
}

function clsThirdLevelTableCtrl$grandChildProgress(jsonCItem, cloneRow, jsonItem) {
}

function clsThirdLevelTableCtrl$after() {
}

function clsThirdLevelTableCtrl$chkAfter() {

}

//缓存选项
function clsThirdLevelTableCtrl$cacheChkProc(obj) {

}

/*********************************************************************************
 *                               动态表格组件说明
 *    author:zhongwei by ennew
 *    version:1.0
 *    updateTime: 2018-01-17
 *    实现功能：表格标题和内容全部动态添加
 *
 *
 *
 **********************************************************************************/
function clsDynamicTableCtrl() {
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.templateTitleId = null;
    this.templateCellId = null;
    this.templateRowId = null;
    this.cloneTitleId = null;
    this.cloneCellId = null;
    this.cloneRowId = null;
    this.noDataId = null;
    this.idx = null;
    this.url = null;
    this.clsChk = null;		//checkbox className
    this.clsAllChk = null;		//全选checkbox className
    this.cacheArr = new Array();
    this.isCacheCond = null;
    this.isValidate = "0";		//0:表示不校验,1:表示需要校验
    this.init = clsDynamicTableCtrl$init;
    this.parse = clsDynamicTableCtrl$parse;
    this.refresh = clsDynamicTableCtrl$refresh;
    this.clear = clsDynamicTableCtrl$clear;
    this.setValue = clsDynamicTableCtrl$setValue;
    this.before = clsDynamicTableCtrl$before;
    this.progress = clsDynamicTableCtrl$progress;
    this.after = clsDynamicTableCtrl$after;
    clsStandardTableCtrl$after;
    this.page = clsDynamicTableCtrl$page;
    this.setChildDocAssistant = clsDynamicTableCtrl$setChildDocAssistant;
    this.cacheChkProc = clsDynamicTableCtrl$cacheChkProc;
    this.cacheChkAfter = clsDynamicTableCtrl$cacheChkAfter;
}

function clsDynamicTableCtrl$init() {
    if (this.ctrl != null) {
        if (this.ctrl.getAttribute("isValidate") != null)
            this.isValidate = this.ctrl.getAttribute("isValidate");
        if (this.ctrl.getAttribute("templateTitleId") != null)
            this.templateTitleId = this.ctrl.getAttribute("templateTitleId");
        if (this.ctrl.getAttribute("templateCellId") != null)
            this.templateCellId = this.ctrl.getAttribute("templateCellId");
        if (this.ctrl.getAttribute("templateRowId") != null)
            this.templateRowId = this.ctrl.getAttribute("templateRowId");
        if (this.ctrl.getAttribute("noData") != null)
            this.noDataId = this.ctrl.getAttribute("noData");
        if (this.ctrl.getAttribute("idx") != null)
            this.idx = this.ctrl.getAttribute("idx");
        if (this.ctrl.getAttribute("clsChk") != null)
            this.clsChk = this.ctrl.getAttribute("clsChk");
        if (this.ctrl.getAttribute("clsAllChk") != null)
            this.clsAllChk = this.ctrl.getAttribute("clsAllChk");
        if (this.ctrl.getAttribute("isCacheCond") != null)
            this.isCacheCond = this.ctrl.getAttribute("isCacheCond");
        if (this.ctrl.cacheArr != null)
            this.cacheArr = this.ctrl.cacheArr;
        this.parse();
        if (this.ctrl.getAttribute("page") != null)
            this.page(this.ctrl.getAttribute("page"));

    }
}

function clsDynamicTableCtrl$page(strClsName) {
    if (this.jsonData != null) {
        $("." + strClsName).createPage({
            pageCount: this.jsonData.pages,
            current: this.jsonData.pageNum,
            parentObj: this.ctrl,
            backFn: function (p) {
                var jsonCondData = JSON.parse($(this)[0].parentObj.getAttribute("reqParam"));
                jsonCondData.pageNum = p;
                $(this)[0].parentObj.setAttribute("reqParam", JSON.stringify(jsonCondData));
                document.body.jsCtrl.ctrl = $(this)[0].parentObj;
                document.body.jsCtrl.init();
                //$(this)[0].parentObj.jsCtrl.refresh();
            }
        });
    }

}

function clsDynamicTableCtrl$parse() {
    this.before();
    if (this.jsonData != null && this.templateTitleId != null && this.templateCellId != null && this.templateRowId != null) {

        this.cloneTitleId = this.templateTitleId.replace("template", "clone");
        this.cloneCellId = this.templateCellId.replace("template", "clone");
        this.cloneRowId = this.templateRowId.replace("template", "clone");
        this.clear();
        var templateTitle = $(this.ctrl).find("#" + this.templateTitleId)[0];
        var templateRow = $(this.ctrl).find("#" + this.templateRowId)[0];
        if (this.noDataId != null && this.jsonData.length == 0) {
            $("#" + this.noDataId)[0].style.display = "";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "none";
        }
        else if (this.noDataId != null && this.jsonData.length > 0) {
            $("#" + this.noDataId)[0].style.display = "none";
            if (this.ctrl.getAttribute("page") != null)
                $("." + this.ctrl.getAttribute("page"))[0].style.display = "";
        }
        else {
        }
        if (this.jsonData != null) {
            for (var nI = 0; nI < this.jsonData.rspBody.length; nI++) {
                var jsonItem = this.jsonData.rspBody[nI];
                if (nI == 0) {
                    for (key in jsonItem) {
                        var cloneTitle = templateTitle.cloneNode(true);
                        cloneTitle.id = this.cloneTitleId;
                        cloneTitle.style.display = "";
                        cloneTitle.jsonData = jsonItem;
                        $(cloneTitle).addClass(this.cloneTitleId);
                        //this.setValue(jsonItem, cloneTitle);
                        $(cloneTitle).text(jsonItem[key]);
                        templateTitle.parentNode.insertBefore(cloneTitle, templateTitle);
                    }
                }
                else {
                    var cloneRow = templateRow.cloneNode(true);
                    cloneRow.id = this.cloneRowId;
                    cloneRow.style.display = "";
                    cloneRow.jsonData = jsonItem;
                    this.progress(jsonItem, cloneRow);
                    //如果有序号字段，则赋值
                    if (this.idx != null)
                        $(cloneRow).find("#" + this.idx).html(nI + 1);
                    var templateCell = $(cloneRow).find("#" + this.templateCellId)[0];
                    for (key in jsonItem) {
                        var cloneCell = templateCell.cloneNode(true);
                        cloneCell.id = this.cloneCellId;
                        cloneCell.style.display = "";
                        $(cloneCell).text(jsonItem[key]);
                        templateCell.parentNode.insertBefore(cloneCell, templateCell);
                    }
                    //this.setValue(jsonItem, cloneRow);
                    templateRow.parentNode.insertBefore(cloneRow, templateRow);
                    //初始化checkbox和全选直接互相联动
                    if (this.clsChk != null && this.clsAllChk != null) {
                        $(cloneRow).find("." + this.clsChk)[0].jsUnionCtrl = this;
                        $(cloneRow).find("." + this.clsChk).click(function () {
                            var bln = true;
                            $(this.jsUnionCtrl.ctrl).find("*[id^='clone']").find("." + this.jsUnionCtrl.clsChk).each(function () {
                                if (this.checked == false)
                                    bln = false;
                            });
                            $("." + this.jsUnionCtrl.clsAllChk).prop("checked", bln);
                            this.jsUnionCtrl.cacheChkProc(this);
                        });
                    }

                    if (this.isValidate == "1")
                        initValidate(cloneRow);
                }
            }
        }

    }
    this.after();

}

function clsDynamicTableCtrl$setValue(jsonItem, cloneRow) {
    for (key in jsonItem) {
        var ctrl = $(cloneRow).find("#" + key)[0];
        if (ctrl != null) {
            var value = jsonItem[key];
            switch (ctrl.tagName.toLowerCase()) {
                case "input":
                    if (ctrl.type == "checkbox") {
                        var oJsCtrl = new clsCheckboxCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    else {
                        var oJsCtrl = new clsTextCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                    }
                    break;
                case "img":
                    var oJsCtrl = new clsImgCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;

                    break;
                case "a":
                    var oJsCtrl = new clsACtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
                default:
                    var oJsCtrl = new clsOtherCtrl();
                    oJsCtrl.ctrl = ctrl;
                    oJsCtrl.jsonData = jsonItem;
                    oJsCtrl.setValue(value);
                    ctrl.jsCtrl = oJsCtrl;
                    break;
            }
        }

    }
}

function clsDynamicTableCtrl$setChildDocAssistant(cloneRow) {
    if ($(cloneRow).find("*[comType]").length > 0) {
        var objChildDoc = new clsDocAssistant()
        objChildDoc.parentCtrl = cloneRow;
        objChildDoc.init();
    }

}

function clsDynamicTableCtrl$refresh() {
    this.clear();
    this.parse();
}

function clsDynamicTableCtrl$clear() {
    var cloneTitleList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneTitleList.length - 1; nI >= 0; nI--) {
        cloneTitleList[nI].parentNode.removeChild(cloneTitleList[nI]);
    }

    var cloneCellList = $(this.ctrl).find("*[id='" + this.cloneId + "']");
    for (var nI = cloneCellList.length - 1; nI >= 0; nI--) {
        cloneCellList[nI].parentNode.removeChild(cloneCellList[nI]);
    }

    var cloneRowList = $(this.ctrl).find("*[id='" + this.cloneRowId + "']");
    for (var nI = cloneRowList.length - 1; nI >= 0; nI--) {
        cloneRowList[nI].parentNode.removeChild(cloneRowList[nI]);
    }
}

//缓存选项
function clsDynamicTableCtrl$cacheChkProc(obj) {
    if (this.isCacheCond != null) {
        if (typeof(this.isCacheCond) == "function")
            this.cacheArr = this.isCacheCond(this);
        else {
            var cloneRow = $(obj).parents("*[id='" + this.cloneId + "']:first")[0];
            var isRepeat = false;
            for (var nI = this.cacheArr.length - 1; nI >= 0; nI--) {
                var ele = this.cacheArr[nI];
                if (ele[this.isCacheCond] == cloneRow.jsonData[this.isCacheCond]) {
                    if (!obj.checked)
                        this.cacheArr.splice(nI, 1);
                    isRepeat = true;
                }
            }
            if (!isRepeat)
                this.cacheArr.push(cloneRow.jsonData);
        }
        this.ctrl.cacheArr = this.cacheArr;
        this.cacheChkAfter(obj, this);
    }
}

function clsDynamicTableCtrl$cacheChkAfter(obj, jsCtrl) {

}

function clsDynamicTableCtrl$before() {
}

function clsDynamicTableCtrl$progress(jsonItem, cloneRow) {
}

function clsDynamicTableCtrl$after() {
}

//显示隐藏列
function clsColsCtrl()
{
    this.ctrl = null;		//初始化对象
    this.jsonData = null;		//ajax返回结果
    this.parentCtrl = null;

    this.init = clsColsCtrl$init;
    this.parse = clsColsCtrl$parse;
    this.refresh = clsColsCtrl$refresh;
    this.clear = clsColsCtrl$clear;
    this.before = clsColsCtrl$before;
    this.progress = clsColsCtrl$progress;
    this.after = clsColsCtrl$after;

}

function clsColsCtrl$init()
{
    if(this.jsonData != null)
    {
        this.parse();
    }
}

function clsColsCtrl$parse()
{
    this.before();
    for(var nI=0; nI<this.jsonData.resultData.length; nI++)
    {
        var jsonItem = this.jsonData.resultData[nI];
        if(this.parentCtrl == null)
        {
            this.progress();
            if(jsonItem.hidden)
                $(this.ctrl).find("*[colName='"+jsonItem.data_field+"']").hide();
            else
                $(this.ctrl).find("*[colName='"+jsonItem.data_field+"']").show();

        }
        else
        {
            this.progress();
            if(jsonItem.hidden)
                $(this.parentCtrl).find(this.ctrl).find("*[colName='"+jsonItem.data_field+"']").hide();
            else
                $(this.parentCtrl).find(this.ctrl).find("*[colName='"+jsonItem.data_field+"']").show();
        }
    }
    this.after();
}

function clsColsCtrl$refresh()
{

}

function clsColsCtrl$clear()
{

}

function clsColsCtrl$before()
{

}

function clsColsCtrl$progress()
{

}

function clsColsCtrl$after()
{

}


//公用ajax请求方法
function getAjaxResult(strPath, method, param, callbackMethod, beforeSendFunc, asyncType,defineUrl) {
    if(defineUrl != null)
		var strPath = (requestUrl == null) ? strPath : defineUrl + strPath;
	else
		var strPath = (requestUrl == null) ? strPath : requestUrl + strPath;
    var operId = (param.operId == null) ? "" : param.operId;
    jsonReqHeaderData.operTitle = operId;
    var reqParam = {"reqHeader": jsonReqHeaderData};

    //统一参数
    for(key in jsonReqHeaderData)
        param[key] = jsonReqHeaderData[key];
    //version-start
    if(typeof(param) == "object" && Object.prototype.toString.call(param).toLowerCase() == "[object object]" && !param.length && version) {
        if(!param["version"]){
            param["version"] = version;
        }

    }
    //version-start
    reqParam["reqBody"] = param;
    asyncType = asyncType || false;
    if (typeof(loadingProc) == "function" && asyncType)
        loadingProc(0);
    $.ajax({
        url: strPath,
        type: method,
        async: asyncType,
        cache: false,
        data: JSON.stringify(reqParam),
		dataType: 'text',
        contentType: 'application/json',
        
		beforeSend:function (xhr) {
			xhr.setRequestHeader("auth-token",$.cookie("auth-token"));
        },
        success: function (data)
        {
            var jsonData = transJson(data);
            if(jsonData.retCode != "0000000")
            {
                if(typeof (errorFunc)=="function"){
                    errorFunc(jsonData);
                }else{
                    //alert(jsonData.retDesc);
                }
            }
            if (typeof(callbackMethod) == "string") {
                eval(callbackMethod);
            } else if (typeof(callbackMethod) == "function") {
                callbackMethod(JSON.stringify(jsonData));
            }
            if(this.async){
                jumpUrl(null, jsonData.retCode, null, jsonData,true);
            }else{
                jumpUrl(null, jsonData.retCode, null, jsonData);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //alert(errorThrown);
			/*if(JSON.parse(jqXHR.responseText).code != null)
				var data = {"retDesc":JSON.parse(jqXHR.responseText).data.respDesc};
			else
				var data = {"retDesc":"ajax请求错误"}*/
			var data = transJson(jqXHR.responseText);
            if(this.async){
                jumpUrl(null, data.retCode, null,data ,true);
            }else{
                jumpUrl(null, data.retCode, null, data);
            }

        }
    });
}

//公用ajax请求方法
function getAjaxResult4Tydic(strPath, method, param, callbackMethod, beforeSendFunc, asyncType) {
    var strPath = (requestUrl == null) ? strPath : requestUrl + strPath;
    var operId = (param.operId == null) ? "" : param.operId;
    jsonReqHeaderData.operTitle = operId;
    var reqParam = param;//{"reqHeader": jsonReqHeaderData};

    //统一参数
    for(key in jsonReqHeaderData)
        param[key] = jsonReqHeaderData[key];
    //version-start
    if(typeof(param) == "object" && Object.prototype.toString.call(param).toLowerCase() == "[object object]" && !param.length && version) {
        if(!param["version"]){
            param["version"] = version;
        }

    }
    //version-start
    //reqParam["reqBody"] = param;
	//reqParam["auth-token"] = $.cookie("auth-token");
    asyncType = asyncType || false;
    if (typeof(loadingProc) == "function" && asyncType)
        loadingProc(0);
    $.ajax({
        url: strPath,
        type: method,
        async: asyncType,
        cache: false,
        data: JSON.stringify(reqParam),
        dataType: 'text',
        contentType: 'application/json',
        
		beforeSend:function () {
        },
        success: function (data)
        {
            var jsonData = transJson(data);
            if(jsonData.retCode != "0000000")
            {
                if(typeof (errorFunc)=="function"){
                    errorFunc(jsonData);
                }else{
                    alert(jsonData.retDesc);
                }
            }
            if (typeof(callbackMethod) == "string") {
                eval(callbackMethod);
            } else if (typeof(callbackMethod) == "function") {
                callbackMethod(JSON.stringify(jsonData));
            }
            if(this.async){
                jumpUrl(null, jsonData.retCode, null, jsonData,true);
            }else{
                jumpUrl(null, jsonData.retCode, null, jsonData);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //alert(errorThrown);
			/*if(JSON.parse(jqXHR.responseText).code != null)
				var data = {"retDesc":JSON.parse(jqXHR.responseText).data.respDesc};
			else
				var data = {"retDesc":"ajax请求错误"}
			*/
			var data = transJson(jqXHR.responseText);
            if(this.async){
                jumpUrl(null, data.retCode, null,data ,true);
            }else{
                jumpUrl(null, data.retCode, null, data);
            }

        }
    });
}

//公用ajax请求方法(改良)
function getAjaxResultNew(options) {//strPath, method, param, callbackMethod, beforeSendFunc, asyncType, ctrl
    option = options || "";
    if(!options){
        alert("入参有误");
        return;
    }
    var strPath = (requestUrl == null) ? options.strPath : requestUrl + options.strPath;
    var operId = (options.param.operId == null) ? "" : options.param.operId;
    jsonReqHeaderData.operTitle = operId;
    var reqParam = {"reqHeader": jsonReqHeaderData};
    reqParam["reqBody"] = options.param;
    options.asyncType = options.asyncType || false;
    $.ajax({
        url: options.strPath,
        type: options.method,
        async: options.asyncType,
        cache: false,
        data: JSON.stringify(reqParam),
        dataType: 'text',
        ctrl:options.ctrl,
        contentType: 'application/json',
        beforeSend: options.beforeSendFunc ? options.beforeSendFunc : function () {
        },
        success: function (data) {
            if (typeof(options.callbackMethod) == "string") {
                eval(options.callbackMethod);
            } else if (typeof(options.callbackMethod) == "function") {
                options.callbackMethod(data);
            }
            var jsonResultData = JSON.parse(data);
            jumpUrl(null, jsonResultData.retCode, null, jsonResultData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

/*获取数据通用*/
function setValue4Desc(jsonItem, cloneRow, isDesc, isAttr) {
    for (key in jsonItem) {
        if (typeof(jsonItem[key]) == "object" && jsonItem[key] != null) {
            setValue4DescProcess(jsonItem[key], key,jsonItem);
        }
        else {
            //version-start
            if(jsonItem["version"]){
                version = jsonItem["version"];
            }
            //version-end
            if(isAttr == true)
                var ctrl = $(cloneRow).find("." + key)[0];
            else
                var ctrl = $(cloneRow).find("#" + key)[0];
            if (ctrl != null) {
                var value = jsonItem[key];
                if (value == null) {
                    value = "";
                }

				var codeVal = null;
                //临时 select不要加dataType
                if($(ctrl).attr("dataType") != null && ctrl.tagName.toLowerCase() != "select")
                {	//主数据缓存
                    if(jsonMetadata.rspBody != null && jsonMetadata.rspBody[$(ctrl).attr("dataType")] != null)
                    {
						codeVal = value;
						var value = jsonMetadata.rspBody[$(ctrl).attr("dataType")][value];
					}
					if(value == null){
                        value = "";
                    }
                }
				else if(jsonOrgdata.rspBody != null && jsonOrgdata.rspBody.rows.length > 0)
                {	//组织结构缓存
					if(ctrl.tagName.toLowerCase() != "select")
					{
						for(var nI=0; nI<jsonOrgdata.rspBody.rows.length; nI++)
						{
							if(jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgType")] == value)
							{
								codeVal = value;
								var value = jsonOrgdata.rspBody.rows[nI][$(ctrl).attr("orgText")];
								break;
								//var value = jsonOrgdata.rspBody[$(ctrl).attr("dataType")][key];
							}
						}
						if(value == null){
							value = "";
						}
					}
				}
                switch (ctrl.tagName.toLowerCase()) {
                    case "input":
                    case "textarea":
                        if (ctrl.type == "checkbox") {
                            var oJsCtrl = new clsCheckboxCtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            oJsCtrl.setValue(value);
							ctrl.jsCtrl = oJsCtrl;
                        }
                        else {
                            var oJsCtrl = new clsTextCtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            oJsCtrl.setValue(value);
                            ctrl.jsCtrl = oJsCtrl;
                        }
						if(codeVal != null)
							oJsCtrl.setCodeValue(codeVal);
                        if(isDesc == true)
                            ctrl.disabled = true;
                        break;
                    case "img":
                        var oJsCtrl = new clsImgCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;

                        break;
                    case "a":
                        var oJsCtrl = new clsACtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        ctrl.jsCtrl = oJsCtrl;
                        break;
                    case "select":
                        if(ctrl.id == "sourcesSystem")
                            var aaaa = 111;
                        // if ($(ctrl).attr("comType") != null) {
                        var oJsCtrl = new clsSelectCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        oJsCtrl.setValue(value);
                        if(isDesc == true)
                            ctrl.disabled = true;
                        if($(ctrl).attr("isBeauty") == null)
                            $(ctrl).trigger('chosen:updated');
                        ctrl.jsCtrl = oJsCtrl;
                        // }
                        break;
                    default:
                        if (ctrl.getAttribute("radiosList") == "list") {
                            var oJsCtrl = new clsRadioCtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            oJsCtrl.setValue(value);
                            ctrl.jsCtrl = oJsCtrl;
                        }
                        else if (ctrl.getAttribute("checkboxList") == "list")
                        {
                            $(this.ctrl).find("input[type='checkbox']").each(function(){
                                this.checked = false;
                                if(isDesc == true)
                                    this.disabled = true;
                            });
                            $(this.ctrl).find("input[type='checkbox']").each(function(idx){
                                for (var nI=0; nI<value.split(",").length; nI++)
                                {
                                    if(this.getAttribute("val") == value.split(",")[nI])
                                        this.checked = true;
                                }
                            });
                        }
                        else {
                            var oJsCtrl = new clsOtherCtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            oJsCtrl.setValue(value);
                            ctrl.jsCtrl = oJsCtrl;
                        }
                        break;
                }
            }
        }
    }
}

function setValue4DescProcess(jsonItem, key,jsonData) {

}

/*获取数据通用*/
function getValue4Desc(jsonItem, cloneRow) {
    for (key in jsonItem) {
        if (typeof(jsonItem[key]) == "object" && jsonItem[key] != null) {
            getValue4DescProcess(jsonItem[key], key);
        }
        else {
            var ctrl = $(cloneRow).find("#" + key)[0];

            if (ctrl != null) {
                /*if (ctrl.jsCtrl != null) {
                    jsonItem[key] = ctrl.jsCtrl.getValue(key);
                }
                else {
                    switch (ctrl.tagName.toLowerCase()) {
                        case "input":
                        case "textarea":
                            if (ctrl.type == "checkbox") {
                                var oJsCtrl = new clsCheckboxCtrl();
                                oJsCtrl.ctrl = ctrl;
                                oJsCtrl.jsonData = jsonItem;
                                jsonItem[key] = oJsCtrl.getValue();
                                ctrl.jsCtrl = oJsCtrl;
                            }
                            else {
                                var oJsCtrl = new clsTextCtrl();
                                oJsCtrl.ctrl = ctrl;
                                oJsCtrl.jsonData = jsonItem;
                                jsonItem[key] = oJsCtrl.getValue();
                                ctrl.jsCtrl = oJsCtrl;
                            }
                            break;
                        case "img":
                            var oJsCtrl = new clsImgCtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            jsonItem[key] = oJsCtrl.getValue();
                            ctrl.jsCtrl = oJsCtrl;

                            break;
                        case "a":
                            var oJsCtrl = new clsACtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            jsonItem[key] = oJsCtrl.getValue();
                            ctrl.jsCtrl = oJsCtrl;
                            break;
                        case "select":
                            //if ($(ctrl).attr("comType") == null) {
                                var oJsCtrl = new clsSelectCtrl();
                                oJsCtrl.ctrl = ctrl;
                                oJsCtrl.jsonData = jsonItem;
                                jsonItem[key] = oJsCtrl.getValue();
								if($(ctrl).attr("txtKey") != null)
									jsonItem[$(ctrl).attr("txtKey")] = oJsCtrl.getText();
                                ctrl.jsCtrl = oJsCtrl;
						   // }
                            break;
                        default:
                            if (ctrl.getAttribute("radiosList") == "list") {
                                var oJsCtrl = new clsRadioCtrl();
                                oJsCtrl.ctrl = ctrl;
                                oJsCtrl.jsonData = jsonItem;
                                jsonItem[key] = oJsCtrl.getValue();
                                ctrl.jsCtrl = oJsCtrl;
                            }
                            else {
                                var oJsCtrl = new clsOtherCtrl();
                                oJsCtrl.ctrl = ctrl;
                                oJsCtrl.jsonData = jsonItem;
                                jsonItem[key] = oJsCtrl.getValue();
                                ctrl.jsCtrl = oJsCtrl;
                            }
                            break;
                    }
                }*/
                switch (ctrl.tagName.toLowerCase()) {
                    case "input":
                    case "textarea":
                        if (ctrl.type == "checkbox") {
                            var oJsCtrl = new clsCheckboxCtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            jsonItem[key] = oJsCtrl.getValue();
                            ctrl.jsCtrl = oJsCtrl;
                        }
                        else {
                            var oJsCtrl = new clsTextCtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            jsonItem[key] = oJsCtrl.getValue();
                            ctrl.jsCtrl = oJsCtrl;
                        }
                        break;
                    case "img":
                        var oJsCtrl = new clsImgCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        jsonItem[key] = oJsCtrl.getValue();
                        ctrl.jsCtrl = oJsCtrl;

                        break;
                    case "a":
                        var oJsCtrl = new clsACtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        jsonItem[key] = oJsCtrl.getValue();
                        ctrl.jsCtrl = oJsCtrl;
                        break;
                    case "select":
                        //if ($(ctrl).attr("comType") == null) {
                        var oJsCtrl = new clsSelectCtrl();
                        oJsCtrl.ctrl = ctrl;
                        oJsCtrl.jsonData = jsonItem;
                        jsonItem[key] = oJsCtrl.getValue();
                        if($(ctrl).attr("txtKey") != null)
                            jsonItem[$(ctrl).attr("txtKey")] = oJsCtrl.getText();
                        ctrl.jsCtrl = oJsCtrl;
                        // }
                        break;
                    default:
                        if (ctrl.getAttribute("radiosList") == "list") {
                            var oJsCtrl = new clsRadioCtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            jsonItem[key] = oJsCtrl.getValue();
                            ctrl.jsCtrl = oJsCtrl;
                        }
                        else {
                            var oJsCtrl = new clsOtherCtrl();
                            oJsCtrl.ctrl = ctrl;
                            oJsCtrl.jsonData = jsonItem;
                            jsonItem[key] = oJsCtrl.getValue();
                            ctrl.jsCtrl = oJsCtrl;
                        }
                        break;
                }
            }
        }
    }
}

function getValue4DescProcess() {

}

//权限管理模块添加标识方法
function globalConfigFunc(){

};


globalConfigFunc.prototype.configSelect = function(options) {
    //规则：
    //采购组织和公司不能绑定在同一个组织上，前台不做校验；
    //公司下只有子级的组织可以赋上子公司身份，孙子级不能赋上公司身份，且前台不做校验做校验

    //入参解释：
    //options.idName  =》  关联的select id名称                string
    //options.url     =》  select onchange的时候请求的接口路劲 string
    //options.method  =》  ajax请求方法                       string(post/get)
    //options.reqParam=》  请求入参                           json
    //options.callback=》  回调函数名称                       string
    //options.selCode =》  下拉框的value值                    string
    //options.data=》 配置文件数据                            json


    //将配置文件数据转化为下拉框插件可识别数据
    var jurisFlag = false;
    var jurisArr = [];
    var jurisI=0;

    for(var key in options.data){

        if(options.data[key].isShow){

            jurisFlag = true;

            jurisArr[jurisI] = {};

            for(var keyName in options.data[key]){

                jurisArr[jurisI][keyName] = options.data[key][keyName];

            };

            jurisI++;

        };
    };

    //初始化下拉框美化
    if(options.data.isShow){
        $("#"+options.idName).show();

        $("#"+options.idName)[0].data = {"rspBody":jurisArr};

        $("#"+options.idName).attr({"comType":"singleSelectCtrl","selValue":"text","selCode":options.selCode,"emptyValue":"notnull"});

        document.body.jsCtrl.ctrl = $("#a")[0];

        document.body.jsCtrl.init();
    }else{
        $("#"+options.idName).hide();
    }

    $("#"+options.idName).off("change")
    //点击选择下拉框内容执行方法
    $("#"+options.idName).on("change",function(){

        options.reqParam = eval(options.beforeFuncName)(this);

        getAjaxResult(options.url, options.method, options.reqParam, options.callbackName+"(data)");

    });
}

function selColor4Tr(oRow,bln,obj)
{
    if(oRow != null && oRow.tagName == "TR")
    {
        if(obj.type.toLowerCase() == "radio")
        {
            for(var nI=0; nI<$(obj).parents("table:first").find("tr").length; nI++)
                $(obj).parents("table:first").find("tr").removeClass("table-list-checked");
        }
        if(bln)
            $(oRow).addClass("table-list-checked");
        else
            $(oRow).removeClass("table-list-checked");
    }
}

globalConfigFunc.prototype.rule = function(options){
    //入参解释：
    //options.idName  =》  关联的select id名称                string
    //options.url     =》  select onchange的时候请求的接口路劲 string
    //options.method  =》  ajax请求方法                       string(post/get)
    //options.reqParam=》  请求入参                           json
    //options.callback=》  回调函数名称                       string
    //options.data=》 配置文件数据                            json

    $("#"+options.idName).blur(function(){

        if(options.data.isNeedCheck){
            getAjaxResult(options.url, options.method, options.reqParam, options.callbackName+"(data)");
        }

    });
}
// //是否需要唯一性校验方法
// function (options){

// }

//对象化解析数组嵌套型json为平级
function clsJson2Obj()
{
	this.jsonData	= null;
	this.init		= clsJson2Obj$init;
	this.parse		= clsJson2Obj$parse;
	this.parseChild	= clsJson2Obj$parseChild;
	this.listName	= "children";
	this.arrTreeObj	= new Array();
}

function clsJson2Obj$init()
{
	this.parse();
}

function clsJson2Obj$parse()
{
	if(this.jsonData[this.listName] != null)
	{
		for(var nI=0; nI<this.jsonData[this.listName].length; nI++)
		{
			var jsonItem	= this.jsonData[this.listName][nI];
			var obj			= new clsChildJson();
			obj.jsonData	= jsonItem;
			obj.jsonPData	= this.jsonData;
			obj.listName	= this.listName;
			obj.level		= 1;
			obj.arrTreeObj	= this.arrTreeObj;
			if(this.arrTreeObj[obj.level-1] == null)
			{
				var arrItemObj = new Array();
				arrItemObj[0] = obj;
				this.arrTreeObj.push(arrItemObj);
			}
			else
			{
				this.arrTreeObj[obj.level-1].push(obj);
			}
			obj.parse();
		}
	}
}

function clsJson2Obj$parseChild()
{
	
}

function clsChildJson()
{
	this.jsonPData	= null;
	this.jsonData	= null;
	this.level		= 1;
	this.parse		= clsChildJson$parse;
	this.listName	= "list";
	this.arrTreeObj	= null;
}

function clsChildJson$parse()
{
	if(this.jsonData[this.listName] != null)
	{
		for(var nI=0; nI<this.jsonData[this.listName].length; nI++)
		{
			var jsonItem	= this.jsonData[this.listName][nI];
			var obj			= new clsChildJson();
			obj.jsonData	= jsonItem;
			obj.jsonPData	= this.jsonData;
			obj.level		= this.level+1;
			obj.listName	= this.listName;
			obj.arrTreeObj	= this.arrTreeObj;


			if(this.arrTreeObj[obj.level-1] == null)
			{
				var arrItemObj = new Array();
				arrItemObj[0] = obj;
				this.arrTreeObj.push(arrItemObj);
			}
			else
			{
				this.arrTreeObj[obj.level-1].push(obj);
			}
			obj.parse();
		}
	}
}

$(document).ready(function () {
    var objDoc = new clsDocAssistant();
    //在初始化之前执行用户自己的方法
    if (typeof(initBefore) == "function")
        initBefore();

    objDoc.init();
    document.body.jsCtrl = objDoc;
});

function transJson(data)
{
	var jsonData = JSON.parse(data);
	var jsonReturnData = {"retCode":"0000000","retDesc":"操作成功","rspBody":{}}
	if(jsonData.code != null && jsonData.code == "1")	//未登录直接ajax
	{
		jsonReturnData.retCode	= "0200000";
		jsonReturnData.retDesc	= "未登录，请重新登陆";
	}
	else if(jsonData.code == null && jsonData.data != null)	//菜单
	{
		jsonReturnData.rspBody = jsonData.data;
	}
	else if(jsonData.constructor == Array)	//权限码存储到本机
	{
		jsonReturnData.retCode = "0000000";
		jsonReturnData.retDesc = "权限码已经保存到本机";
		jsonReturnData.rspBody = jsonData;
	}
	else if(jsonData.respCode != null && jsonData.respCode == "0000")	//登录返回成功
	{
		jsonReturnData.retCode = "0000000";
		for(key in jsonData)
		{
			if(key != "respCode" && key != "respDesc")
			jsonReturnData.rspBody[key] = jsonData[key];
		}
	}
	else
	{
		jsonReturnData = jsonData;
	}

	return jsonReturnData;
}