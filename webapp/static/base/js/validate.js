/*********************************************************************************
*                                   校验组件说明                                     
*    author:zhongwei by ennew                                                    
*    version:1.0                                                                 
*    updateTime: 2016-08-12                                                      
*    实现功能：通过errMsg找到对应需要校验的对象，进行校验，支持自定义报警模式(默认
*    tip窗口模式)，支持组件校验，组件包含下拉框，上传控件                                                                            
*                                                                                
*                                                                                
**********************************************************************************/
$(document).ready(function(){
	//initValidate();
});

var totalErrMsg = "";
function initValidate(parentObj,isAll)
{
	for(var key in errMsg)
	{
		//if(key == "forInt")
		//	alert(1);
		var ctrlList = (parentObj == null) ? $("."+key) : $(parentObj).find("."+key);
		for(var nI=0; nI<ctrlList.length; nI++)
		{
			//if($(ctrlList[nI]).parents('*:hidden').length == 0 && $(ctrlList[nI]).parents("*[id*='template']").length == 0 && ctrlList[nI].getAttribute("isBind") != "1")
			if($(ctrlList[nI]).parents('*:hidden').length == 0 && ctrlList[nI].getAttribute("isBind") != "1")
			{
				var obj = new clsValidateCtrl();
				obj.type = key;
				obj.ctrl = ctrlList[nI];
				if(ctrlList[nI].getAttribute("isBind") != 2)
				{
					ctrlList[nI].setAttribute("isBind","1");
					if(key != "requiredTime")	//时间空间自定义方法校验
						obj.bind();
				}
				ctrlList[nI].validateCtrl = obj;
				$(ctrlList[nI]).attr("validateTab","1");
			}
			else if(isAll == 1 && ctrlList[nI].getAttribute("isBind") != "1")
			{
				var obj = new clsValidateCtrl();
				obj.type = key;
				obj.ctrl = ctrlList[nI];
				if(ctrlList[nI].getAttribute("isBind") != 2)
				{
					ctrlList[nI].setAttribute("isBind","1");
					if(key != "requiredTime")	//时间空间自定义方法校验
						obj.bind();
				}
				ctrlList[nI].validateCtrl = obj;
				$(ctrlList[nI]).attr("validateTab","1");
			}
		}
	}
}

function clearValidate(parentObj)
{
	var ctrlList = (parentObj == null) ? $("*[validateTab = '1']") : $(parentObj).find("*[validateTab = '1']");
	for(var nI=ctrlList.length-1;nI>=0; nI--)
	{
		var ctrl = ctrlList[nI];
		for(var key in errMsg)
			$(ctrl).removeClass(key);
		ctrl.validateCtrl = null;
		$(ctrl).removeAttr("validateTab")
        $(ctrl).removeAttr("isBind")
	}
}

function initValidateNoBind(parentObj)
{
	for(var key in errMsg)
	{
		//if(key == "forInt")
		//	alert(1);
		var ctrlList = (parentObj == null) ? $("."+key) : $(parentObj).find("."+key);
		for(var nI=0; nI<ctrlList.length; nI++)
		{
			//if($(ctrlList[nI]).parents('*:hidden').length == 0 && $(ctrlList[nI]).parents("*[id*='template']").length == 0 && ctrlList[nI].getAttribute("isBind") != "1")
			if($(ctrlList[nI]).parents('*:hidden').length == 0 && ctrlList[nI].getAttribute("isBind") != "1")
			{
				var obj = new clsValidateCtrl();
				obj.type = key;
				obj.ctrl = ctrlList[nI];
				ctrlList[nI].setAttribute("isBind","1");
				//obj.bind();
				ctrlList[nI].validateCtrl = obj;
			}
		}
	}
}

function getFunctionBody(funcObject)
{
	if(funcObject){
		var strBody = funcObject.toString();
		return strBody.substr(strBody.indexOf("{"));
	}else{
		return "";
	}
}
	
function clsValidateCtrl()
{
	this.ctrl		= null;
	this.parentCtrl	= null;
	this.type		= null;
	this.isTip		= null;
	this.msg		= null;
	this.errTab		= false;
	this.popWin		= null;
	
	this.bind		= clsValidateCtrl$bind;
	this.validate	= clsValidateCtrl$validate;
	this.showInfo	= clsValidateCtrl$showInfo;
	this.hideInfo	= clsValidateCtrl$hideInfo;
	this.validateAll= clsValidateCtrl$validateAll;	//按class做遍历校验
	this.validateAll4Ctrl = clsValidateCtrl$validateAll4Ctrl;	//按控件遍历校验
	this.validateAllNotNull4Ctrl = clsValidateCtrl$validateAllNotNull4Ctrl;//值不为空才校验
}

function clsValidateCtrl$bind()
{
	
	switch(this.ctrl.tagName.toLowerCase())
	{
		case "input":case "textarea":
			$(this.ctrl).blur(function(){
				for(var key in errMsg)
				{
					if($(this).hasClass(key))
					{
						this.validateCtrl.type = key;
						if(this.getAttribute("isTip") != null)
							this.validateCtrl.isTip = this.getAttribute("isTip");
						totalErrMsg = "";
						if(!this.validateCtrl.validate())
						{
							if(totalErrMsg != "")
							{
								var alertBox=new clsAlertBoxCtrl()
								alertBox.Alert(totalErrMsg,"错误提示",null,null,null,null,null,this.popWin);
								break;
							}
						}
					}
				}
			});
			break;
		case "select":
			$(this.ctrl).change(function(){
				for(var key in errMsg)
				{
					if($(this).hasClass(key))
					{
						this.validateCtrl.type = key;
						if(this.getAttribute("isTip") != null)
							this.validateCtrl.isTip = this.getAttribute("isTip");
						totalErrMsg = "";
						if(!this.validateCtrl.validate())
						{
							if(totalErrMsg != "")
							{
								var alertBox=new clsAlertBoxCtrl()
								alertBox.Alert(totalErrMsg,"错误提示",null,null,null,null,null,this.popWin);
								break;
							}
						}
					}
				}
			});
			break;
		/*
		case "div":
			if($(this.ctrl).hasClass("comUpload"))
			{
			    if($(this.ctrl)[0].style.display != "none")
		        {
		            var oImg = $(this.ctrl).find("img[id*='uploadImg']")[0];
		            if(oImg != null)
		            {
		            	var obj = new clsValidateCtrl();
						obj.type = key;
						obj.ctrl = oImg;
						ctrlList[nI].setAttribute("isBind","1");
						obj.bind();
						ctrlList[nI].validateCtrl = obj;
		            }
		        }
		    }
			break;
		*/
	}
	
	
}

function clsValidateCtrl$validate()
{
	if(this.ctrl.getAttribute("isVal") == 0)
		var result = true;
	else
		var result = errMsg[this.type].test(this.ctrl);
	
	
	//if(result.constructor == Boolean)
	if(typeof errMsg[this.type].msg == 'string' && !result)
	{
		this.msg = errMsg[this.type].msg;
		if(this.isTip == null)
			this.showInfo(this.msg);
		else if(typeof(tipFunc) == "function")
			//eval("tipFunc(this)");	
			tipFunc(this,false);
		else
			totalErrMsg = totalErrMsg + "<br>" + this.isTip + ":" + this.msg;
			
	}
	else if(typeof errMsg[this.type].msg == 'function' && !result)
	{
		this.msg = errMsg[this.type].msg(this.ctrl);
		if(this.isTip == null)
			this.showInfo(this.msg);
		else if(typeof(tipFunc) == "function")
			tipFunc(this,false);
		else
			totalErrMsg = totalErrMsg + "<br>" + this.isTip + ":" + this.msg;
	}
	else if((errMsg[this.type].msg.constructor == Array) && (result != true))
	{
		this.msg = errMsg[this.type].msg;
		if(this.isTip == null)
			this.showInfo(this.msg);
		else if(typeof(tipFunc) == "function")
			tipFunc(this,false);
		else
			totalErrMsg = totalErrMsg + "<br>" + this.isTip + ":" + this.msg;
	}
	else
	{
		this.msg = null;
		//if(this.isTip == null)
		//	this.hideInfo();
		if(typeof(tipFunc) == "function")
			//eval("tipFunc(this)");	
			tipFunc(this,true);
	}
	return result;
}

function clsValidateCtrl$showInfo(strMsg)
{
	
	switch(this.ctrl.tagName.toLowerCase())
	{
		case "select":
			if(this.ctrl.divSelect != null)
			{
				var ele = this.ctrl.divSelect[0];
			}else{
                var ele = this.ctrl;
			}
			break;
		case "img":
			var ele = this.ctrl;
			break;
		default:
			var ele = this.ctrl;
			break;
	}
	
	$(ele).poshytip('destroy');
	$(ele).poshytip({
		className: 'tip-twitter',
		showOn: 'none',
		alignTo: 'target',
		alignX: 'right',
		alignY: 'inner-top',
		content:strMsg,
		offsetX: 5,
		offsetY:0,
		autoHide:true,
		hideTimeout:5000
	});
	
	$(ele).poshytip('show');
}

function clsValidateCtrl$hideInfo()
{
	var ele = this.ctrl;
	if(this.ctrl.tagName == "select" || this.ctrl.tagName == "SELECT")
	{
		if(this.ctrl.divSelect != null)
		{
			var ele = this.ctrl.divSelect[0];
		}
	}
	else if(this.ctrl.tagName == "img" || this.ctrl.tagName == "IMG")
	{
		var ele = $(this.ctrl);
	}
	$(ele).poshytip('destroy');
}

function clsValidateCtrl$validateAll(parentCtrl)
{
	/*for(var nI=0; nI<$("*[validateTab='1']").length; nI++)
	{
		if($("*[validateTab='1']")[nI].validateCtrl != null)
			$("*[validateTab='1']")[nI].validateCtrl.errTab = false;
	}*/
	var bln = true;
	totalErrMsg = "";
	for(var key in errMsg)
	{
		var ctrlList = (parentCtrl == null) ? $("."+key) : $(parentCtrl).find("."+key);
		for(var nI=0; nI<ctrlList.length; nI++)
		{
			if($(ctrlList[nI]).parents("*:hidden").length == 0)
			{
				ctrlList[nI].validateCtrl.type = key;
				ctrlList[nI].validateCtrl.ctrl = ctrlList[nI];
				if(ctrlList[nI].getAttribute("isTip") != null)
					ctrlList[nI].validateCtrl.isTip = ctrlList[nI].getAttribute("isTip");
				//if(!ctrlList[nI].validateCtrl.errTab)
				var result = ctrlList[nI].validateCtrl.validate();
				//else
				//	result = false;
				if(!result)
				{
					//ctrlList[nI].validateCtrl.errTab = true;
					bln = false;
				}
			}
		}
	}
	if(totalErrMsg != "")
	{
		var alertBox=new clsAlertBoxCtrl();
		alertBox.sureAfterTab = 0;
		alertBox.Alert(totalErrMsg,"错误提示",null,null,null,null,null,this.popWin);
	}
	return bln;
}


function clsValidateCtrl$validateAll4Ctrl(parentCtrl,isAll)
{

	if(parentCtrl != null)
		var ctrlList = $(parentCtrl).find("*[validateTab='1']");
	else
		var ctrlList = $("*[validateTab='1']");

	var bln = true;
	totalErrMsg = "";
	for(var nI=0; nI<ctrlList.length; nI++)
	{
		for(var key in errMsg)
		{
			if($(ctrlList[nI]).hasClass(key) && ($(ctrlList[nI]).attr("isTip") != null || $(ctrlList[nI]).attr("isTip") != ""))
			{
				ctrlList[nI].validateCtrl.type = key;
				ctrlList[nI].validateCtrl.ctrl = ctrlList[nI];
				ctrlList[nI].validateCtrl.isTip = ctrlList[nI].getAttribute("isTip");
				var result = ctrlList[nI].validateCtrl.validate();
				if(!result)
				{
					bln = false;
					break;
				}
			}
			if($(ctrlList[nI]).hasClass(key) && $(ctrlList[nI]).parents("*:hidden").length == 0)
			{
				ctrlList[nI].validateCtrl.type = key;
				ctrlList[nI].validateCtrl.ctrl = ctrlList[nI];
				if(ctrlList[nI].getAttribute("isTip") != null)
					ctrlList[nI].validateCtrl.isTip = ctrlList[nI].getAttribute("isTip");
				var result = ctrlList[nI].validateCtrl.validate();
				if(!result)
				{
					bln = false;
					break;
				}
			}
		}
	}
	if(totalErrMsg != "")
	{
		var alertBox=new clsAlertBoxCtrl();
		alertBox.sureAfterTab = 0;
		alertBox.Alert(totalErrMsg,"错误提示",null,null,null,null,null,this.popWin);
	}
	return bln;
}

//非空增加校验
function clsValidateCtrl$validateAllNotNull4Ctrl(parentCtrl)
{

	if(parentCtrl != null)
		var ctrlList = $(parentCtrl).find("*[validateTab='1']");
	else
		var ctrlList = $("*[validateTab='1']");

	var bln = true;
	for(var nI=0; nI<ctrlList.length; nI++)
	{
		for(var key in errMsg)
		{
			var isValidate = true;
			switch(ctrlList[nI].tagName.toLowerCase()) {
				case "input":case "textarea":
					if(ctrlList[nI].type == "checkbox") 
					{}
					else 
					{
						var oJsCtrl = new clsTextCtrl();
						oJsCtrl.ctrl = ctrlList[nI];
						if(oJsCtrl.getValue() == "")
							isValidate = false;
					}
					break;
				case "img":
					var oJsCtrl = new clsImgCtrl();
					oJsCtrl.ctrl = ctrlList[nI];
					if(oJsCtrl.getValue() == "" || oJsCtrl.getValue() == null)
						isValidate = false;
					break;
				case "a":
					var oJsCtrl = new clsACtrl();
					oJsCtrl.ctrl = ctrlList[nI];
					if(oJsCtrl.getValue() == "" || oJsCtrl.getValue() == null)
						isValidate = false;
					break;
				case "select":
					//if($(ctrlList[nI]).attr("comType") == null)
					//{
						var oJsCtrl = new clsTextCtrl();
						oJsCtrl.ctrl = ctrlList[nI];
						if(oJsCtrl.getValue() == "")
							isValidate = false;
					//}
					break;
				default:
					if(ctrlList[nI].getAttribute("radiosList") == "list")
					{
						var oJsCtrl = new clsRadioCtrl();
						oJsCtrl.ctrl = ctrlList[nI];
						if(oJsCtrl.getValue() == "")
							isValidate = false;
					}
					else
					{
						var oJsCtrl = new clsOtherCtrl();
						oJsCtrl.ctrl = ctrlList[nI];
						if(oJsCtrl.getValue() == "")
							isValidate = false;
					}
					break;
			}



			if($(ctrlList[nI]).hasClass(key) && $(ctrlList[nI]).attr("isTip") == "2")
			{
				ctrlList[nI].validateCtrl.type = key;
				ctrlList[nI].validateCtrl.ctrl = ctrlList[nI];
				ctrlList[nI].validateCtrl.isTip = ctrlList[nI].getAttribute("isTip");
				var result = (isValidate == true) ? ctrlList[nI].validateCtrl.validate() : true;
				if(!result)
				{
					bln = false;
					break;
				}
			}
			if($(ctrlList[nI]).hasClass(key) && $(ctrlList[nI]).parents("*:hidden").length == 0)
			{
				ctrlList[nI].validateCtrl.type = key;
				ctrlList[nI].validateCtrl.ctrl = ctrlList[nI];
				if(ctrlList[nI].getAttribute("isTip") != null)
					ctrlList[nI].validateCtrl.isTip = ctrlList[nI].getAttribute("isTip");
				var result = (isValidate == true) ? ctrlList[nI].validateCtrl.validate() : true;
				if(!result)
				{
					bln = false;
					break;
				}
			}
		}
	}
	return bln;
}



var errFlag=0;
var errMsg = {
	
    required: {
        msg: "必填选项!",
        test: function(obj) {
        	if(obj.value.length<1){
        		return false;
        	}
        	var placeholder = obj.getAttribute("placeholder");
        	if(null != placeholder && placeholder == obj.value){
        		return false;
        	}
        	return true;
        }
    },
	requiredTime: {
		msg: "时间不能为空!",
		test: function(obj) {
			if(obj.value.length<1){
				return false;
			}
			var placeholder = obj.getAttribute("placeholder");
			if(null != placeholder && placeholder == obj.value){
				return false;
			}
			return true;
		}
	},
	requireRadio: {
		msg: "至少选择一项!",
		test: function(obj) {
			for(var nI=0; nI<$(obj).find("input[type='radio']").length; nI++)
			{
				var eleRadio = $(obj).find("input[type='radio']")[nI];
				if(eleRadio.checked)
					return true;
			}
			return false;
		}
	},
	requireCheckbox: {
		msg: "至少选择一项!",
		test: function(obj) {
			for(var nI=0; nI<$(obj).find("input[type='checkbox']").length; nI++)
			{
				var eleRadio = $(obj).find("input[type='checkbox']")[nI];
				if(eleRadio.checked)
					return true;
			}
			return false;
		}
	},
	requiredImg: {
        msg: "图片不允许为空!",
        test: function(obj) {
            return obj.getAttribute("src") != "";
        }
    },
    requiredUploadImg: {
        msg: "请上传图片!",
        test: function(obj) {
            return obj.getAttribute("src") != "";
        }
    },
    requiredUploadU3D: {
        msg: "请上传U3D!",
        test: function(obj) {
            return obj.getAttribute("src") != "";
        }
    },
    comUploadNull: {
        msg: "图片不允许为空!",
        test: function(obj) {
			//如果校验不通过
			if(obj.style.display != "none")
			{
				var oImg = $(obj).find("img[id*='uploadImg']")[0];
				return oImg.getAttribute("src") != "";
			}
			return true;
        }
    },
    urlDomain: {
        msg: "域名不合法",
        test: function(obj) {
            return !obj.value || /^[^@-]+\.com(\.cn)?$/.test(obj.value);
        }
    },
    commonDomain: {
        msg: "域名不合法",
        test: function(obj) {
            return !obj.value || /(^[A-Za-z0-9\u4e00-\u9fa5]+)((\-([A-Za-z0-9\u4e00-\u9fa5]+))?)(\.([A-Za-z0-9\u4e00-\u9fa5]+)((\-([A-Za-z0-9\u4e00-\u9fa5]+))?))+$/.test(obj.value);
        }
    },
    wapDomian: {
    	msg: "WAP域名不合法",
    	test: function(obj) {
            return !obj.value || /^([A-Za-z0-9])+\.?([A-Za-z0-9])+$/.test(obj.value);
        }
    },
    mastId:{
    	msg: "masId不合法",
      test: function(obj) {
            return !obj.value || /^M.{2}AH.{9}$/.test(obj.value);
    	}
    },
    masStandard:
    {
    	msg: "MAS标准代码不合法",
      test: function(obj) {
            return !obj.value || /^MAH\d{7}$/.test(obj.value);
    	}
    }, 
    mas06Standard:
    {
    	msg: "MAS标准代码不合法",
      test: function(obj) {
            return !obj.value || /^M06AH\d{9}$/.test(obj.value);
    	}
    }, 
    lineSpeed:
    {
    	msg: "带宽不合法",
      test: function(obj) {
            return !obj.value || /^[2468]$|^[1-9][02468]$|^1[0-4][02468]|^15[024]$/.test(obj.value);
    	}
    },
    scale:
    {
    	msg: "比例输入不合法",
      test: function(obj) {
          var objArr=obj.value.split(":");
          if(objArr.length==2 && parseInt(objArr[0])+parseInt(objArr[1])==100)
          {
            return !obj.value || /^([0-9]|[1-9][0-9]):([0-9]|[1-9][0-9])$/.test(obj.value);
          }else
          {
          	return false; 
          }
    	}
    },
    HHmm:{
    		msg:"时间格式为HHmm",
    		test: function(obj) {
            return !obj.value || /^([0-1][0-9]|[2][0-3])[0-5][0-9]$/.test(obj.value);
        	}
    },
    shortNo:{
    		msg:"短号格式以61-69开头",
    		test: function(obj) {
            return !obj.value || /^[6][1-9]\d{4}$/.test(obj.value);
        	}
    },
    email: {
        msg: "邮箱格式不正确",
        test: function(obj) {
            return !obj.value || /^[a-z0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/.test(obj.value);
        }
    },
    dateFormat: {
        msg: "日期格式MM/DD/YYYY",
        test: function(obj) {
            return !obj.value || /^\d{2}\/\d{2}\/\d{2,4}$/.test(obj.value);
            //格式是MM/DD/YYYY	
        }
    },
    url: {
        msg: "网址不合法。",
        test: function(obj) {
            return !obj.value || /^(http|https|ftp):\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/.test(obj.value);
        }
    },
    forMoney:{//vflag = 0 不能为负数,vflag = -1 不能为正数
    	msg:["输入格式有误！", "金额不能为负数！", "金额不能为正数！"],
    	test:function(obj){
    		if(!obj.value) return true;
				var num = obj.value;
				var flag = obj.getAttribute("vflag");
				if(flag==null) flag=0;
				num.toString().replace(/\$|\,/g,'');
				if(flag == 0){
                    this.msg = ["输入格式有误！", "金额不能为负数！"]
				}else{
                    this.msg = ["输入格式有误！", "金额不能为正数！"]
				}
			
				if(isNaN(num))
				{
					return 0;
				}
			
				if(flag==0&&num<0)   // vflag = 0 不能为负数
				{
					//return 1;
                    return 0;
				}
				if(flag==-1&&num>0)  //vflag = -1 不能为正数
				{
					//return 2;
                    return 0;
				}
				obj.value=formatAsMoney(num);
				return true;
			//格式化金额
				function formatAsMoney(mnt) {
				    mnt -= 0;
				    mnt = (Math.round(mnt*100))/100;
				    return (mnt == Math.floor(mnt)) ? mnt + '.00'
				              : ( (mnt*10 == Math.floor(mnt*10)) ?
				                       mnt + '0' : mnt);
				}
			}
		},
    idCard: {
        msg: ["号码位数不对", "号码出生日期错误或含有非法字符", "号码校验错误", "地区非法"],
        test: function(obj) {
        		
            var idcard, Y, JYM;
            var S, M;
            var   aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"***",71:"台湾",81:"香港",82:"澳门",91:"国外 ",99:"信息保护 "}  
            idcard=obj.value = obj.value.replace(/(^\s*)|(\s*$)/g, "");
            if(!idcard) return true;
            if(aCity[parseInt(idcard.substr(0,2))]==null) return 3;
	    	var idcard_array = new Array();
            idcard_array = idcard.split("");
            switch (idcard.length) {
            		case 0:
            			return true;
            			break;
                case 15:
                		var Ai=idcard.slice(0,6)+"19"+idcard.slice(6,16);
                    if (!/^\d+$/.test(Ai))  return 1;
    								var yyyy=Ai.slice(6,10) ,  mm=Ai.slice(10,12)-1  ,  dd=Ai.slice(12,14);
    								var d=new Date(yyyy,mm,dd) ,  now=new Date();
    								var year=d.getFullYear() ,  mon=d.getMonth() , day=d.getDate();
    								if (year!=yyyy || mon!=mm || day!=dd || d>now ) return 1;
    								return true;
                    break;
                case 18:
                    //18位身份号码检测
                    //出生日期的合法性检查
                    //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                    //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                    if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                        ereg = /^[1-9][0-9]{5}[12]\d[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                    }
                    else {
                        ereg = /^[1-9][0-9]{5}[12]\d[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                    }
                    if (ereg.test(idcard)) {
                        //测试出生日期的合法性
                        //计算校验位
                        S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
											    + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
											    + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
											    + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
											    + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
											    + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
											    + (parseInt(idcard_array[6])  + parseInt(idcard_array[16])) * 2
											    + parseInt(idcard_array[7]) * 1
											    + parseInt(idcard_array[8]) * 6
											    + parseInt(idcard_array[9]) * 3;
                        Y = S % 11;
                        M = "F";
                        JYM = "10X98765432";
                        M = JYM.substr(Y, 1); //判断校验位
                        if (idcard_array[17] == 'x')
                            idcard_array[17] = 'X';
						 if (M == idcard_array[17]) {
	                            	return true; //检测ID的校验位
	                        }else {
	                            	return 2;
	                        }
                    }
                    else {
                        return 1;
                    }
                    break;
                default:
                    return 0;
            }

        }
    },
	c_idCard: {
        msg: ["号码位数不对", "号码出生日期错误或含有非法字符"],
        test: function(obj) {	
            idcard=obj.value = obj.value.replace(/(^\s*)|(\s*$)/g, "");
	    	var idcard_array = new Array();
            idcard_array = idcard.split("");
            switch (idcard.length) {
            	case 0:
            			return true;
            			break;
                case 15:
                		var Ai=idcard.slice(0,6)+"19"+idcard.slice(6,16);
                    	if (!/^\d+$/.test(Ai))  return 1;
						var yyyy=Ai.slice(6,10) ,  mm=Ai.slice(10,12)-1  ,  dd=Ai.slice(12,14);
						var d=new Date(yyyy,mm,dd) ,  now=new Date();
						var year=d.getFullYear() ,  mon=d.getMonth() , day=d.getDate();
						if (year!=yyyy || mon!=mm || day!=dd || d>now ) return 1;
						return true;
                    break;
                case 18:
                    //18位身份号码检测
                    //出生日期的合法性检查
                    //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                    //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                    if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                        ereg = /^[1-9][0-9]{5}[12]\d[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                    }
                    else {
                        ereg = /^[1-9][0-9]{5}[12]\d[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                    }
                    if (ereg.test(idcard)) {
                        //测试出生日期的合法性
                        if(parseInt(idcard.substr(6, 4))<1900)
                          return 1;
                        var yyyy=idcard.slice(6,10) ,  mm=idcard.slice(10,12)-1  ,  dd=idcard.slice(12,14);
                        var d=new Date(yyyy,mm,dd) ,  now=new Date();
                        var year=d.getFullYear() ,  mon=d.getMonth() , day=d.getDate();
                        if (year!=yyyy || mon!=mm || day!=dd || d>now ) return 1;
                        return true;
                    }else
                    	return 1;
                    break;
                default:
                    return 0;
            }

        }
    },
    upLetter: {
        msg: "必须为大写英文字母",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[A-Z]+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                //obj.select();
                return false;
            }
            return true;
        }
    },
    upLetterOrNuber: {
        msg: "必须为大写英文字母或数字",
        test: function(obj) {
            if(!obj.value) return true;
            var patrn = /^[A-Z0-9]+$/;;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                //obj.select();
                return false;
            }
            return true;
        }
    },
    lowLetter: {
        msg: "必须为小写英文字母",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[a-z]+$/
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    allLetter: {
        msg: "必须为英文",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[A-Za-z]+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    numOrLetter: {
        msg: "必须为英文或数字",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[A-Za-z0-9]+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    numAndLetter:{
	  	 msg: "必须为数字和字母的混合",
	      test: function(obj) {
	      		if(!obj.value) return true;
	          var sInput = obj.value;
	          if (sInput&&(!(/^([a-zA-Z]|[0-9]){0,}$/.test(sInput)&&/[a-zA-Z]{1}/.test(sInput)&&/\d{1}/.test(sInput)))) {
              return false;
          }
	          return true;
	      }
	
	},
    numLetterChinese: {
        msg: "必须为英文,数字或汉字",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    numLetterChineseplus: {
        msg: "必须为英文,数字或汉字或-",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[A-Za-z0-9\u4e00-\u9fa5\-]+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    numChinese: {
        msg: "必须为数字或汉字",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[0-9\u4e00-\u9fa5]+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    letterChineseSpace: {
        msg: "必须为英文或汉字",
        test: function(obj) {
            if(!obj.value) return true;
            var patrn = /^[A-Za-z\u4e00-\u9fa5\s]+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    noChineseSpace: {
        msg: "不能包含汉字或者空格",
        test: function(obj) {
          
        		if(!obj.value) return true;
            var patrn =  /[\u4e00-\u9fa5\s]/;
            var sInput = obj.value;
         
            if (sInput.search(patrn) != -1) {
                return false;
            }
            return true;
        }
    },
    noSpace: {
        msg: "不能包含汉字",
        test: function(obj) {
          
        		if(!obj.value) return true;
            var patrn = /(^\s*)|(\s*$)/g;
            var sInput = obj.value;
         
            if (sInput.search(patrn) != -1) {
                return false;
            }
            return true;
        }
    },
    space: {
        msg: "只能包含汉字",
        test: function(obj) {

            if(!obj.value) return true;
            var patrn =  /^[\u4e00-\u9fa5]+$/;
            var sInput = obj.value;

            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    postCode: {
        msg: "邮政编码格式错误",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[0-9]{1}(\d){5}$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    tfPhone: {//校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
        msg: "电话号码格式错误 例:010-821666XX-XXXXXX",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn =/^(\d{3,4}-\d{7,8})(-\d{1,6})?$/;
            var sInput = obj.value;
            if (obj.value && sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    commonPhone: {//校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
        msg: "电话号码格式错误",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[+]{0,1}((0(\d{2}))?([-]{0,1})([1-9]\d{7})|(0(\d{3}))?([-]{0,1})([1-9]\d{6,7}))$/;
            var sInput = obj.value;
            if (obj.value && sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    andCellphone: {//校验手机、固话、传真号码：可以“+”开头，除数字外，可含有“-”
        msg: "电话号码格式错误",
        test: function(obj) {
        		if(!obj.value) return true;
           	var patrn = /^[+]{0,1}(\d{3,4})?([-]{0,1})?(\d{7,8})$/;
           	//var patrn = /^[+]{0,1}(\d{3,4})([-])?(\d{7,8})$/;   //不能限制长度，故修改为上面
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    notallCellPhone:{//
      	 msg: "不能使用手机号",
          test: function(obj) {
          	if(!obj.value) return true;
            var patrn = /^((\(\d{3}\))|(\d{3}\-))?[12][03458]\d{9}$/;
             // var patrn = /^1[358][39]\d{8}$/;//电信
            //var patrn = /^1[35][0126]\d{8}$/;//联通
            //var patrn = /^1[358][4-9]\d{8}$/;//移动
              var sInput = obj.value;
            
              if (sInput.search(patrn)!=-1) {
                  return false;
              }
              return true;
          }
      	},
    cellPhone: {//服务号码
        msg: "服务号码格式错误",
        test: function(obj) {
        	 if(!obj.value) return true;
        	 var patrn=/^[^\u4e00-\u9fa5]{0,}$/;
          // var patrn = /^((\(\d{3}\))|(\d{3}\-))?[12][0358]\d{9}$/;
           // var patrn = /^1[358][39]\d{8}$/;//电信
          //var patrn = /^1[35][0126]\d{8}$/;//联通
          //var patrn = /^1[358][4-9]\d{8}$/;//移动
            var sInput = obj.value;
            if (sInput.search(patrn)==-1) {
                return false;
            }
            return true;
        }
    },
    allCellPhone:{//原手机号码验证
    	 msg: "手机号码格式错误",
        test: function(obj) {
        	if(!obj.value) return true;
          var patrn = /^((\(\d{3}\))|(\d{3}\-))?[12][034578]\d{9}$/;
           // var patrn = /^1[358][39]\d{8}$/;//电信
          //var patrn = /^1[35][0126]\d{8}$/;//联通
          //var patrn = /^1[358][4-9]\d{8}$/;//移动
            var sInput = obj.value;
            if (sInput.search(patrn)==-1) {
                return false;
            }
            return true;
        }
    	},
     newPhone:{//最新手机号码验证
    	 msg: "手机号码格式错误",
        test: function(obj) {
        	if(!obj.value) return true;
          var patrn = /^1(3|4|5|7|8)\d{9}$/;
           // 以1开头，第二位为3,4,5,7,8  [0-9]的11位数字
            var sInput = obj.value;
            if (sInput.search(patrn)==-1) {
                return false;
            }
            return true;
        }
    	},
		
    forTelecom: {//电信
        msg: "不是电信手机号码",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^1[358][39]\d{8}$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    forUnicom: {//联通
        msg: "不是联通手机号码",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^1[35][0126]\d{8}$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    forMobile: {//移动
		msg: "不是移动手机号码",
		test: function(obj) {
			if(!obj.value) return true;
			// var patrn = /^1[358][4-9]\d{8}$/;
			//var patrn = /^1(3[4-9]|47|5[012789]|8[7-8])\d{8}$/;
			var patrn = /^\d{11}$/;
			var sInput = obj.value;
			if (sInput.search(patrn) == -1) {
				return false;
			}
			return true;
		}
	},

    ipAddress: {
        msg: "IP地址错误",
        test: function(obj) {
        		if(!obj.value) return true;
            //var pattern = /^(\d{1,2}|1\d\d|1\d?\*|2[0-4][\d*]|2\*|25[0-5]|25\*)(\.(\d{1,2}|1\d\d|1\d?\*|2[0-4][\d*]|2\*|25[0-5]|25\*)){3}$/;
             var pattern = /^([1-9]|[1-9]\d|(1[0-1|3-9]\d|12[0-6|8-9]|2[0-3]\d|24[0-7]))(\.(\d|[1-9]\d|(1\d{2}|2([0-4]\d|5[0-5])))){3}$/;
            var sInput = obj.value;
            if (sInput.search(pattern) == -1) {
                return false;
            }
            return true;
        }
    },
    ipAddressArray: {
        msg: "IP地址错误",
        test: function(obj) {
        		if(!obj.value) return true;
            //var pattern = /^(\d{1,2}|1\d\d|1\d?\*|2[0-4][\d*]|2\*|25[0-5]|25\*)(\.(\d{1,2}|1\d\d|1\d?\*|2[0-4][\d*]|2\*|25[0-5]|25\*)){3}$/;
             var pattern = /^(([1-9]|[1-9]\d|(1[0-1|3-9]\d|12[0-6|8-9]|2[0-3]\d|24[0-7]))(\.(\d|[1-9]\d|(1\d{2}|2([0-4]\d|5[0-5])))){3})(,([1-9]|[1-9]\d|(1[0-1|3-9]\d|12[0-6|8-9]|2[0-3]\d|24[0-7]))(\.(\d|[1-9]\d|(1\d{2}|2([0-4]\d|5[0-5])))){3})*$/;
            var sInput = obj.value;
            if (sInput.search(pattern) == -1) {
                return false;
            }
            return true;
        }
    },
    num_letter: {
        msg: "必须为数字,英文和下划线",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^\w+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    num_letterTop: {
        msg: "必须为数字,英文和下划线或上划线",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn =  /^[A-Za-z0-9_-]+$/;
            var sInput = obj.value;
            
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    isSizeOf: {//需要自定义属性v_maxlength,v_minlength
        msg: ["必须为数字"],
        test: function(obj) {
        		if(!obj.value) return true;
            var maxval = parseFloat(obj.getAttribute("v_maxlength"));
            var minval = parseFloat(obj.getAttribute("v_minlength"));
            //var selval = parseFloat(obj.value);
            if (isNaN(obj.value)) {
                return 0;
            }else{
            	var tempVal = obj.value;//防止obj的value发生科学计数法的变化
            	var selval = parseFloat(tempVal);
            }
						var flag = obj.getAttribute("v_flag");
						if(typeof(flag) == "undefined" || flag == "" ||flag == null)	flag = "TT" ;
						var lflag = flag.substring(0,1);//flag.split("|")[0];
						var rflag = flag.substring(1,2);//flag.split("|")[1];
			
            if (!isNaN(maxval)) {
            	if(rflag == "T"){
	                if (selval > maxval) {
	                    return 0;
	                }
              }else{
	              	if (selval >= maxval) {
	                    return 0;	
	              	}
            	}
            }
            
            if (!isNaN(minval)) {
	           	if(lflag == "T"){
	                if (selval < minval) {
	                    return 0;
	                }
	           	}else {
	           		if (selval <= minval) {
	                   	return 0;
	               	}	
	           	}
         	}	
            return true;
        }
    },
     isDigLengthOf:{//数值的位数,需要自定义属性v_maxlength,v_minlength
    	 		msg: ["数值位数不在指定范围内","必须为数字"],
        	test: function(obj) {
        			if(!obj.value) return true;
        		var maxlen = parseFloat(obj.getAttribute("v_maxlength"));
	            var minlen = parseFloat(obj.getAttribute("v_minlength"));
	            var reg = new RegExp("\\s","gi");
	            var val=obj.value.replace(reg, "");
	
	            if (isNaN(obj.value)&&obj.value!="") {
	                return 1;
	            }
	            if (!isNaN(maxlen)) {
	                if ((val+"").length > maxlen) {
	                    return 0;
	                }
	            }
	            if (!isNaN(minlen)) {
	                if ((val+"").length < minlen) {
	                    return 0;
	                }
	            }
	            return true;
	        }
    	},
    isLengthOf: {//需要自定义属性v_maxlength,v_minlength
        //msg: "长度不在指定范围内",
        msg: function(obj){
            if(typeof(obj) != "function" && obj.getAttribute("isLengthOfmsg") != "" && obj.getAttribute("isLengthOfmsg") !=null)
                return obj.getAttribute("isLengthOfmsg");
            else
                return  "长度不在指定范围内";
        },
        test: function(obj) {
        		if(!obj.value) return true;
            var maxlen = parseFloat(obj.getAttribute("v_maxlength"));
            var minlen = parseFloat(obj.getAttribute("v_minlength"));
            var val=obj.value.replace(/(^\s*)|(\s*$)/g, "");
            if (!isNaN(maxlen)) {
                if ((val+"").length > maxlen) {
                	//obj.value = obj.value.substring(0,maxlen);
                    return false;
                }
            }
            if (!isNaN(minlen)) {
                if ((val+"").length < minlen) {
                    return false;
                }
            }
            return true;
        }
    },
	
	dotOrInt: {
        msg: function(obj){
             if(obj.getAttribute("dotNum") != null)
                 return "必须为非负数字且小数点后最多"+obj.getAttribute("dotNum")+"位";
			 else
				 return "必须为非负数字";
         },
        test: function(obj) {
        		if(!obj.value) return true;
            //var patrn =/^[0-9]+([.]{1}[0-9]{1,2})?$/;
            var patrn = new RegExp("^[0-9]+([.]{1}[0-9]{1,"+obj.getAttribute("dotNum")+"})?$","g");
			var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },

     byteSize:{
    	 msg: function(obj){
             if(obj.getAttribute("byteSizemsg") != "")
                 return obj.getAttribute("byteSizemsg");
             else
                 return  "输入内容的字节长度不符";
         },
        // msg:"输入内容的字节长度不符",
        test:function(obj){
            if(!obj.value) return true;
            var maxlen = parseFloat(obj.getAttribute("v_maxlength"));
            var minlen = parseFloat(obj.getAttribute("v_minlength"));
            var val=obj.value.replace(/(^\s*)|(\s*$)/g, "");
            var cArr = val.match(/[^\x00-\xff]/ig);  
            var byteLen=val.length + (cArr == null ? 0 : cArr.length);  
             if (!isNaN(maxlen)) {
                if (byteLen > maxlen) {
                    return false;
                }
            }
            if (!isNaN(minlen)) {
                if (byteLen < minlen) {
                    return false;
                }
            }
            return true;
        }
    },
    samePW:{
        msg:"密码不一致，请重新输入",
        test:function(obj)
        {
        	var pw = document.getElementById(obj.getAttribute("v_pw"));
    		var confirmPw = document.getElementById(obj.getAttribute("v_confirmPw"));
    		if(pw.value!=""&&confirmPw.value!=""&&pw.value != confirmPw.value){
    			return false;
    		}else if(pw.value!=""&&confirmPw.value!=""&&pw.value==confirmPw.value){
    			if(pw.parentNode&&pw.parentNode.getAttribute("errstate"))
                {
                    //hideErrors(pw);
                    //pw.parentNode.removeAttribute("errstate");
                    validateElement(pw);
                }
                if(confirmPw.parentNode&&confirmPw.parentNode.getAttribute("errstate"))
                {
                    hideErrors(confirmPw);
                    confirmPw.parentNode.removeAttribute("errstate");
                }
                return true;
    		}
    		return true; 
        }
    },
    posInt: {
        msg: "请输入正整数",
        test: function(obj) {
        		if(!obj.value) return true;
            obj.value = $.trim(obj.value).replace(/\s/g, "");
            var patrn = /^[0-9]*[1-9][0-9]*$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    posIntZero: {
        msg: "请输入零或正整数",
        test: function(obj) 
        	{
        		if(!obj.value) return true;
        		if(obj.value == "0") return true;
	            obj.value = $.trim(obj.value).replace(/\s/g, "");
	            var patrn = /^[0-9]*[1-9][0-9]*$/;
	            var sInput = obj.value;
	            if (sInput.search(patrn) == -1) {
	                return false;
	            }
	            return true;
        	}
    },
    forallInt: {
        msg: "必须为非负数字且小数点后最多两位",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn =/^[0-9]+([.]{1}[0-9]{1,2})?$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
	},
	foralCount: {
        msg: "必须为负数字且小数点后最多两位",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn =/^-[0-9]+([.]{1}[0-9]{1,2})?$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    forInt: {
        msg: "必须为整数",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^-?\d+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    nonNegInt: {
        msg: "必须为非负整数",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^\d+$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    negInt: {
        msg: "必须为负整数！",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^-[0-9]*[1-9][0-9]*$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    notNegReal: {
        msg: "必须为非负实数！",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^[0-9]+((\.{1}?[0-9]{1,13})|(\.{0}?[0-9]{0}))?$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    forReal: {
        msg: "必须为实数！",
        test: function(obj) {
        		if(!obj.value) return true;
            var patrn = /^([-]{0,1})?[0-9]+((\.{1}?[0-9]{1,13})|(\.{0}?[0-9]{0}))?$/;
            var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    uploadFile: {//验证上传文件格式，需要自定义属性v_upType
        msg: ["请选择要上传的文件！", "请上传后缀名正确的文件"],
        test: function(obj) {
        		if(!obj.value) return true;
            var fileName = obj.value.replace(/^\s*/, "").replace(/\s*$/, "");
            if (fileName == "") {
                return 0;
            }
            else {
                var pos = fileName.lastIndexOf(".");
                if (pos != -1) {
                    var suf = fileName.substring(pos + 1, fileName.length).toLowerCase();
                    var upType = obj.v_upType.split(",");
                    for (var i = 0; i < upType.length; i++) {
                        if (upType[i] == suf) {
                            return true;
                        }
                    }
                };
                return 1;
            }
            return true;
        }
    },
     compareDate : {
    	msg : "结束日期比开始日期早",
    	test : function(obj){
    		var frontDate = document.getElementById(obj.getAttribute("v_extB"));
    		var behindDate = document.getElementById(obj.getAttribute("v_extE"));
    		if(frontDate.value!=""&&behindDate.value!=""&&frontDate.value > behindDate.value){
    			return false;
    		}else if(frontDate.value!=""&&behindDate.value!=""&&frontDate.value<behindDate.value){
    			if(frontDate.parentNode&&frontDate.parentNode.getAttribute("errstate"))
                {
                    hideErrors(frontDate);
                    frontDate.parentNode.removeAttribute("errstate");
                } 
                if(behindDate.parentNode&&behindDate.parentNode.getAttribute("errstate"))
                {
                    hideErrors(behindDate);
                    behindDate.parentNode.removeAttribute("errstate");
                } 
                return true;
    		}
    		return true;
    	}
    },
    compareNowDate : {
        msg : "结束日期比当前日期早",
        test : function(obj){
            var dateString  = obj.value;
            var data = Date.parse(new Date(dateString));
            var nowDate = Date.parse(new Date());
            if(data!=0&&data-nowDate<0)
            {
                return false;
            }else
            {
                return true;
            }

            return true;
        }
    },
    yyyy:{//yyyy
    	msg:"日期格式为yyyy",
    	test:function(obj){
    			if(!obj.value) return true;
    			if(getDateFromFormat(obj.value,"yyyy")==0)
    					return false;
    			return true;
    		} 	
    	},
    HHmmss:{//HHmmss
    	msg:"日期格式为HHmmss",
    	test:function(obj){
    			if(!obj.value) return true;
    			if(getDateFromFormat(obj.value,"HHmmss")==0)
    					return false;
    			return true;
    		} 	
    	},
    yyyyMMddHHmmss:{//yyyyMMddHHmmss
    	msg:"日期格式为yyyyMMddHHmmss",
    	test:function(obj){
    			if(!obj.value) return true;
    			if(getDateFromFormat(obj.value,"yyyyMMddHHmmss")==0)
    					return false;
    			return true;
    		} 	
    	},
  	speyyyyMMddHHmmss:{//yyyyMMddHHmmss
  	msg:"日期格式为yyyyMMdd HH:mm:ss",
  	test:function(obj){
  			if(getDateFromFormat(obj.value,"yyyyMMdd HH:mm:ss")==0)
  					return false;
  			return true;
  		} 	
  	},
    MM:{//MM
    	msg:"日期格式为MM",
    	test:function(obj){
    			if(!obj.value) return true;
    			if(getDateFromFormat(obj.value,"MM")==0)
    					return false;
    			return true;
    		} 	
    	},
    dd:{//dd
    	msg:"日期格式为dd",
    	test:function(obj){
    			if(!obj.value) return true;
    			if(getDateFromFormat(obj.value,"dd")==0)
    					return false;
    			return true;
    		} 	
    	},
  	yyyyMMdd:{
  		msg:"日期格式为yyyyMMdd",
  		test:function(obj){
  			if(!obj.value) return true;
  			if(getDateFromFormat(obj.value,"yyyyMMdd")==0)
  					return false;
  			return true;
  		} 	
  	},
  	yyyyMM:{
  		msg:"日期格式为yyyyMM",
  		test:function(obj){
  			if(!obj.value) return true;
  			if(getDateFromFormat(obj.value,"yyyyMM")==0)
  					return false;
  			return true;
  		} 		
  	},
  	yyyyMMddHH:{
  		msg:"日期格式为yyyyMMddHH",
  		test:function(obj){
  			if(!obj.value) return true;
  			if(getDateFromFormat(obj.value,"yyyyMMddHH")==0)
  					return false;
  			return true;
  		}	
  	},
  	"lineyyyyMMdd":{
  		msg:"日期格式为yyyy-MM-dd",
  		test:function(obj){
  			if(!obj.value) return true;
  			if(getDateFromFormat(obj.value,"yyyy-MM-dd")==0)
  					return false;
  			return true;
  		}	
  	},
  	"ColonHHmmss":{
  		msg:"日期格式为HH:mm:ss",
  		test:function(obj){
  			if(!obj.value) return true;
  			if(getDateFromFormat(obj.value,"HH:mm:ss")==0)
  					return false;
  			return true;
  		}	
  	},
  	"lineyyyyMMddHHmmss":{
  		msg:"格式为yyyy-MM-dd HH:mm:ss",
  		test:function(obj){
  			if(!obj.value) return true;
  			if(getDateFromFormat(obj.value,"yyyy-MM-dd HH:mm:ss")==0)
  					return false;
  			return true;
  		}	
  	},
  	moneyFormat:{
  		msg:"必须为带0到2位小数的数值",
  		test:function(obj){
				var objValue=obj.value;
  			if(!objValue) return true;
				if(isNaN(objValue)) return false;
  			var mArr=(objValue+"").split(".");
				if(mArr.length>1){
						if(mArr[1].length==0||mArr[1].length>2) return false;
					}
  			return true;

  		}	

  	},
  	multiMoneyFormat:{
  		msg:["必须为小数","小数点后位数不对"],
  		test:function(obj){
				var objValue=obj.value;
				var decNum = obj.getAttribute("v_decNum");
	  		if(!objValue) return true;
				if(isNaN(objValue)) return 0;
				if(objValue.indexOf("\.")==-1) return 0;
	  		var mArr=(objValue+"").split(".");
				if(mArr.length>1){
							if(mArr[1].length!=decNum) return 1;
						}
	  			return true;
	  		}	
  	},
  	haveSpe:{
			msg:"不能输入\\ / < > \' \" & 等字符",
			test:function(obj)
			{
				if(!obj.value) return true;
				return haveSpe(obj.value);
				function haveSpe(str)
				{
				  var comp="\\/><\'\"&";
				  var aChar="";
				  for(var i=0;i<str.length;i++)
				  {
					aChar=str.charAt(i);  
					if(comp.indexOf(aChar)!=-1)
						return false;
				  }
				  return true;
				}
			}
		},
		haveSpeForAll:{   //对所有的文本框进行限制
			msg:"不能输入如下英文字符 \ < >  '  \" & # , %",
			test:function(obj)
			{
				if(!obj.value) return true;
				return haveSpe(obj.value);
				function haveSpe(str)
				{
				  var comp="\\><\'\"&#,%";
				  var aChar="";
				  for(var i=0;i<str.length;i++)
				  {
					aChar=str.charAt(i);  
					if(comp.indexOf(aChar)!=-1)
						return false;
				  }
				  return true;
				}
			}
		},
		haveNoSpecial:{   
			msg:"不能输入如下英文字符 \ < >  '  \" ",
			test:function(obj)
			{
				if(!obj.value) return true;
				return haveSpe(obj.value);
				function haveSpe(str)
				{
				  var comp="\\><\'\"";
				  var aChar="";
				  for(var i=0;i<str.length;i++)
				  {
					aChar=str.charAt(i);  
					if(comp.indexOf(aChar)!=-1)
						return false;
				  }
				  return true;
				}
			}
		},
	for0_9:{
		msg:"必须由数字组成",
		test:function(obj)
			{
				if(!obj.value) return true;
				var numStr="0123456789";
				if(obj.value.length==0)
					return false;
				if (!isMadeOf(obj.value,numStr))
					return false;
				return true;
				function isMadeOf(val,str)
				{
				
					var jj;
					var chr;
					for (jj=0;jj<val.length;++jj){
						chr=val.charAt(jj);
						if (str.indexOf(chr,0)==-1)
							return false;			
					}
					
					return true;
				}
			}
	},
	plateNumber: {
        msg: "车牌号不合法!",
        test: function(obj) {
            return !obj.value ||  /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(obj.value);
        }
    },
	isServ:{
 		msg:"不符合服务名称格式",
 		test: function(obj) {
        if(!obj.value) return true;
 				var patrn=/^[s]{1}([0-9]|[a-zA-Z]){0,}$/;
 				var sInput=obj.value;
 				if(!patrn.exec(sInput)) return false;
 				return true;
 		}
 	},
    ennewPassWord: {
        msg: "密码必须是数字,字母,符号任意两种组合",
        test: function(obj) {
        		if(!obj.value) return true;
        	//var patrn =/^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!@#$%^&])|(?=.*?[A-Za-z])(?=.*?[!@#$%^&]))[\dA-Za-z!@#$%^&]+$/;
        	var patrn =/^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[\*\(\)\._<>!@#$%^&])|(?=.*?[A-Za-z])(?=.*?[\*\(\)\._<>!@#$%^&]))[\dA-Za-z\*\(\)\._<>!@#$%^&]{6,20}$/;		   
        	var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
	ennewUserName: {
        msg: "用户必须是数字,字母,汉字任意两种组合",
        test: function(obj) {
        		if(!obj.value) return true;
        	//var patrn =/^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!@#$%^&])|(?=.*?[A-Za-z])(?=.*?[!@#$%^&]))[\dA-Za-z!@#$%^&]+$/;
        	var patrn =/^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[\u4E00-\u9FA5])|(?=.*?[A-Za-z])(?=.*?[\u4E00-\u9FA5]))[\dA-Za-z\u4E00-\u9FA5]{2,30}$/;		   
        	var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    compareCustom: {
        msg: function(obj){
            if(obj.getAttribute("msg") != "")
                return obj.getAttribute("msg");
            else
                return  "值有误";
        },
        test: function(obj) {
            if(!obj.value) return true;
            var strValue    = obj.value;
            var strTarValue = obj.getAttribute("compareTarId");
            strTarValue=document.getElementById(strTarValue).value;
            if(strTarValue == "" || strTarValue==null){
                return true;
            }
            var symbol      = obj.getAttribute("symbol");
            switch(symbol)
            {
                case ">":
                    if(strValue <= strTarValue)
                        return false;
                    break;
                case "<":
                    if(strValue >= strTarValue)
                        return false;
                    break;
                case "=":
                    if(strValue != strTarValue)
                        return false;
                    break;
                case ">=":
                    if(strValue < strTarValue)
                        return false;
                    break;
                case "<=":
                    if(strValue > strTarValue)
                        return false;
                    break;
            }
            return true;
        }
    },
    keyWord: {
        msg: function(obj){
        	
        	var sepa			= obj.getAttribute("sepa");
        	var keywordminlength= obj.getAttribute("keywordminlength");
        	var sepanum			= obj.getAttribute("sepanum");
        	return  "关键字必须以'"+sepa+"'分隔，每个关键字长度不能超过"+keywordminlength+",并且关键字不能超过"+sepanum+"个";
        },
        test: function(obj) {
        		if(!obj.value) return true;
        	var strValue		= obj.value;
        	var arr 	= new Array();
        	var sepa			= obj.getAttribute("sepa");
        	var keywordminlength= obj.getAttribute("keywordminlength");
        	var sepanum			= obj.getAttribute("sepanum");
        	var ele = "";
        	for(var nI=0; nI<strValue.length; nI++)
        	{
        		
        		if(strValue.charAt(nI) != sepa)
        		{
        			ele = ele + strValue.charAt(nI);
        		}
        			
        		else
        		{
        			if(ele != "")
        			{
        				if(ele.length > keywordminlength)
        					return false;
        				else
        					arr.push(ele);
        			}
        			ele = "";
        		}
        	}
        	if(ele != "")
        	{
        		if(ele.length > keywordminlength)
					return false;
				else
					arr.push(ele);
        	}
        	if(arr.length > sepanum)
        		return false;
        	return true;
        }
    },qqTest: {
        msg: "QQ账号不正确",
        test: function(obj) {
        		if(!obj.value) return true;
        	//控制在5~15位
        	var patrn =/^\d{5,15}$/;		   
        	var sInput = obj.value;
            if (sInput.search(patrn) == -1) {
                return false;
            }
            return true;
        }
    },
    userDefineValidate: {
        msg: function(obj){
        	return obj.getAttribute("msg");
        },
        test: function(obj) {
        	if(typeof(userDefineValidate) == "function")
        		return userDefineValidate(obj);
        	return true;
        }
    },
    
    
		
}
	
function showErrInfoByCustom(elem,error,timehide)
{
    $(elem).poshytip({
        className: 'tip-twitter',
		showOn: 'none',
		alignTo: 'target',
		alignX: 'right',
		alignY: 'inner-top',
		content:error,
		offsetX: 5,
		offsetY:0,
		autoHide:true,
		hideTimeout:timehide?timehide:3000
    });
    $(elem).poshytip('hide');
    $(elem).poshytip('show');
}


function hideAllErrInfo(parentCtrl)
{
	if(parentCtrl == null)
	{
		var ctrlList = $("*[validateTab='1']");
	}
	else
	{
		var ctrlList = $(parentCtrl).find("*[validateTab='1']");
	}
	for(var nI=0; nI<ctrlList.length; nI++)
	{
		var ele = ctrlList[nI];
		if(ele.tagName == "select" || ele.tagName == "SELECT")
		{
			if(ele.divSelect != null)
			{
				var ele = ele.divSelect[0];
			}
		}
		else if(ele.tagName == "img" || ele.tagName == "IMG")
		{
			var ele = $(ele);
		}
		$(ele).poshytip('destroy');
	}
}