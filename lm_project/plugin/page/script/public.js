//************************************************************************************//
//    兼容性的问题：
//   1.统一使用var关键字来定义常量.
//   2.统一用getElementById("idName")来取得id为idName的HTML对象.
//   3.统一通过getAttribute()获取自定义属性.
//   4.统一使用[]获取集合类对象.
//   5.统一使用document.formName.elements["elementName"].
//   6.IE下input.type属性为只读;但是Firefox下input.type属性为读写.
//   7.Firefox的event只能在事件发生的现场使用.另外事件源 IE:event.srcElement；FF:event.target
//   8.使用mX(mX = event.x ? event.x : event.pageX;)来代替IE下的event.x或者Firefox下的event.pageX.
//   9.使用window.location来代替window.location.href
//   10.手型样式 style="cursor:pointer;"则在IE和firefox下都能适用
//************************************************************************************//
try { var mainframe = top.window.document.getElementById("mainframe"); } catch (e) { };
var Browser = new Browser(); Browser.init();
//var Versions = new Array("Msxml2.domdocument.5.0", "Msxml2.domdocument.4.0", "Msxml2.domdocument.3.0", "Msxml2.domdocument", "Microsoft.domdocument");
var Versions = new Array("Msxml2.domdocument");
//取得ajax的xmlHttpRequest对象
function $getAjax() {
    var xmlHttp;
    try { // for firefox opera   
        xmlHttp = new XMLHttpRequest();
    } catch (e) { // for ie   
        var ieVersions = new Array("MSXML2.XMLHTTP");
        for (var i = 0; i < ieVersions.length && !xmlHttp; i++) {
            try {
                xmlHttp = new ActiveXObject(ieVersions[i]);
            } catch (e) {
            }
        }
    }
    if (!xmlHttp) {
        return false;
    } else {
        return xmlHttp;
    }
}

//得到指定对象
function $getNamedObj(strTagName)
{
	var element = $event(event);
	if (element.tagName != null)
	{
		while (element.tagName.toUpperCase() != strTagName)
		{
			element = element.parentNode;
			if (element == null)
				break;
		}
		return element;
	}
	return null;
}

function $firstChild(oNode) {
    if (!$defined(oNode)) return null;
    if (oNode.childNodes.length == 0) return null;
    var oC = oNode.childNodes[0];
    while ($isWs(oC)) {
        if (oC.nextSibling)
            oC = oC.nextSibling;
        else
            return null;
    }
    return oC;
}
function $lastChild(oNode) {
    if (!$defined(oNode)) return null;
    if (oNode.childNodes.length == 0) return null;
    var oC = oNode.childNodes[oNode.childNodes.length - 1];
    while ($isWs(oC)) {
        if (oC.previousSibling)
            oC = oC.previousSibling;
        else
            return null;
    }
    return oC;
}
//从某一节点对象里获得子节点对象
function $subNode(rootNode, subid) {
	if (Browser.ie) { return rootNode.all(subid); }
	if (Browser.ff || Browser.ie11) {
        if ($getAtt(rootNode, "id") == subid || $getAtt(rootNode, "name") == subid) { return rootNode; }
        var acn = rootNode.childNodes;
        for (var i = 0; i < acn.length; i++) {
            if (!$isWs(acn[i])) {
                var result = $subNode(acn[i], subid);
                if ($defined(result)) { return result; }
            }
        }
	}
    return null;
}

//得到所有指定Id的对象
function $subAllNode(rootNode, subid) {
	 if (Browser.ie) { return rootNode.all(subid); }
	 if (Browser.ff || Browser.ie11) {
        var arr = new Array();
        if ($getAtt(rootNode, "id") == subid || $getAtt(rootNode, "name") == subid)
            arr[arr.length] = rootNode;
        var acn = rootNode.childNodes;
        for (var i = 0; i < acn.length; i++) {
            if (!$isWs(acn[i])) 
            {
	            var result = $subAllNode(acn[i], subid);
	            for (var j = 0; j < result.length; j++)
	            {
	            	if ($defined(result[j])) 
	            		arr[arr.length] = result[j];
	            }
            }
        }
        return arr;
	 }
	 return null;
}

//DOM查找：selectSingleNode
function $selectSingleNode(oNode, xPathStr) {
    if (Browser.ie) return oNode.selectSingleNode(xPathStr);
    if (Browser.ff || Browser.ie11) { var xltems = $selectNodes(oNode, xPathStr); if (xltems.length > 0) return xltems[0]; else return null; }
}
//DOM查找：selectNodes
function $selectNodes(oNode, xPathStr) {
    if (Browser.ie || Browser.ie11) return oNode.selectNodes(xPathStr);
    if (Browser.ff) {
        if (document.implementation.hasFeature("XPath", "3.0")) {
            var oNSResolver = oNode.ownerDocument.createNSResolver(oNode);
            var altems = oNode.ownerDocument.evaluate(xPathStr, oNode, oNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var aResult = [];
            for (var i = 0; i < altems.snapshotLength; i++) {
                aResult[i] = altems.snapshotItem(i);
            }
            return aResult;
        }
    }
}
//appendChild ,ie中不能用空的table直接append一个子结点。
function $append(oTable, oNode) { if (Browser.ie || Browser.ie11) oTable.childNodes[0].appendChild(oNode); if (Browser.ff) oTable.appendChild(oNode); }
//判断一个Node是不是WhiteSpace
function $isWs(oNode) { return !(/[^\t\n\r ]/.test(oNode.data)) }
//获得事件源
function $event(event) { event = event ? event : (window.event ? window.event : null); return event.srcElement ? event.srcElement : event.target; }
//遍历对象元素，注意:统一使用[]获取集合类对象.
function $each(oNames, index) { return oNames[index]; }
//根据name返回对象集合
function $getByName(oName) { return document.getElementsByName(oName); }
//根据id返回对象
function $getById(oId) { return document.getElementById(oId); }
//获取对象自定义属性
function $getAtt(obj, oAtt) { try { return obj.getAttribute(oAtt); } catch (e) { return null; }; }
//自定义属性
function $setAtt(obj, oAtt, vl) {
    for (var index in oAtt) {
        if (Browser.ff) {
            if (oAtt[index] == "className")
                oAtt[index] = "class";
        }
        obj.setAttribute(oAtt[index], vl[index]);
    }
}
//增加监听事件
function $addEvent(oElement, sEvent, func) {
	if (Browser.ie) { oElement.attachEvent(sEvent, func); }
    if (Browser.ff || Browser.ie11) { sEvent = sEvent.substring(2, sEvent.length); oElement.addEventListener(sEvent, func, false); }
}

//移除监听事件
function $detachEvent(oElement, sEvent, func) {
    if (Browser.ie) { oElement.detachEvent(sEvent, func); }
    if (Browser.ff || Browser.ie11) { sEvent = sEvent.substring(2, sEvent.length); oElement.removeEventListener(sEvent, func, false); }
}

//获得行对象
function $getRow(event) {
    var element = $event(event);
    if (element.tagName != null) {
        while (element.tagName.toUpperCase() != "TR") {
            element = element.parentNode;
            if (element == null)
                break;
        }
        return element;
    }
    return null;
}

//得到浏览器类型
function getNaviType() {
	if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0))
        return "ie";
    else if (navigator.userAgent.indexOf('Firefox') >= 0)
        return "ff";
    else if (navigator.userAgent.indexOf('Opera') >= 0)
        return "op";
    else if (navigator.userAgent.indexOf('Chrome') >= 0)
        return "gg";
    else
        return "ie";

}
//得到对象子节点
function $getChild(obj)
{
	 if (Browser.ie || Browser.ie11)
		 return obj.childNodes;
	 if (Browser.ff)
		 return obj.children;
}

//传入数据获得DOM对象
function $getDom(xmlurl, xmlstr) {
	if (getNaviType() == "ie") return getIEDom(xmlurl, xmlstr);
    if (getNaviType() == "ff") return getFFDom(xmlurl, xmlstr);
    if (getNaviType() == "gg") return getGGDom(xmlurl, xmlstr);
}
//获得空DOM对象
function $getNDom() {
    var oDom;
    if (Browser.ie || Browser.ie11) {
        for (var index in Versions) {
            try {
                oDom = new ActiveXObject(Versions[index]);
                if ($defined(oDom) && oDom != null) { oDom.async = false; return oDom; }
            } catch (e) { continue; }
        }
    }
    if (Browser.ff) {
        var DomP = new DOMParser(); oDom = document.implementation.createDocument("", "", null);
        oDom.async = false; return oDom;
    }
}
//如果传入的参数为null或undefined,则返回fasle;否则返回true; 
function $defined(obj) { return (obj != undefined); }
//将DOM对象转为字符串
function $xml(oNode) {
    if (Browser.ie || Browser.ie11) { return oNode.xml; }
    if (Browser.ff) { var oSerializer = new XMLSerializer(); return oSerializer.serializeToString(oNode); }
}

//得到text值
function $text(oNode) {
    if (Browser.ie || Browser.ie11) { return oNode.text; }
    if (Browser.ff) { return oNode.textContent; }
}
//判断浏览器类型，目前支持IE浏览器和firefox浏览器
function Browser() 
{ 
	this.ie = false; 
	this.ff = false; 
	this.ie11 = false; 
	this.init = Browser$init; 
}
function Browser$init() 
{
	if (document.getBoxObjectFor != null) 
	{ 
		this.ff = true; 
	} 
	else if (!!window.ActiveXObject || "ActiveXObject" in window) 
	{
		if(!window.attachEvent)
			this.ie11 = true;
		else
			this.ie = true; 
	} 
	else 
	{ 
		this.ff = true; 
	}
}
//IE浏览器下创建DOM对象
function getIEDom(xmlurl, xmlstr) {
    for (var index in Versions) {
        try {
            var oDom = new ActiveXObject(Versions[index]);
            oDom.async = false;
            if (xmlurl != null) {
                oDom.load(xmlurl) ? oDom : null;
                return oDom == null ? null : oDom;
            } else {
                oDom.loadXML(xmlstr) ? oDom : null;
                return oDom == null ? null : oDom;
            }
        } catch (e) { continue; }
    }
}
//firefox浏览器下创建DOM对象
function getFFDom(xmlurl, xmlstr) {
    var DomP = new DOMParser();
    var dom = document.implementation.createDocument("", "", null);
    if (xmlurl != null) {
        dom.async = false;
        dom.load(xmlurl);
        return dom;
    } 
    else 
    { 
    	var reg	= new RegExp("&&","g");
    	xmlstr 	= xmlstr.replace(reg,"&amp;&amp;");
    	var dom = DomP.parseFromString(xmlstr, "text/xml"); 
    	if (dom.firstChild.tagName == "parsererror") 
    		return null;
    	return dom; 
    }
}
//谷歌浏览器创建DOM对象
function getGGDom(xmlurl, xmlstr) {
    if (xmlurl != null) {
        try {
            var oXmlHttp = new XMLHttpRequest();
            oXmlHttp.open("GET", xmlurl, false);
            oXmlHttp.send(null);
            return oXmlHttp.responseXML;
        }
        catch (e) {
            return;
        }
    }
    else {
        var DomP= new DOMParser();
        var reg	= new RegExp("&&","g");
        xmlstr 	= xmlstr.replace(reg,"&amp;&amp;");
        var dom = DomP.parseFromString(xmlstr, "text/xml");
        if (dom.firstChild.tagName == "parsererror")
            return null;
        return dom;
    }
}


if (window.Node) {
    Node.prototype.replaceNode = function(Node) {// 替换指定节点 
        this.parentNode.replaceChild(Node, this);
    }
    Node.prototype.removeNode = function(removeChildren) {// 删除指定节点 
        if (removeChildren)
            return this.parentNode.removeChild(this);
        else {
            var range = document.createRange();
            range.selectNodeContents(this);
            return this.parentNode.replaceChild(range.extractContents(), this);
        }
    }
    Node.prototype.swapNode = function(Node) {// 交换节点 
        var nextSibling = this.nextSibling;
        var parentNode = this.parentNode;
        node.parentNode.replaceChild(this, Node);
        parentNode.insertBefore(node, nextSibling);
    }
}
if (window.Event) 
{
	if (getNaviType() != "ie")
	{
	    Event.prototype.__defineSetter__("returnValue", function(b) {// 
	        if (!b) this.preventDefault();
	        return b;
	    });
	    Event.prototype.__defineSetter__("cancelBubble", function(b) {// 设置或者检索当前事件句柄的层次冒泡 
	        if (b) this.stopPropagation();
	        return b;
	    });
	    /*
	    Event.prototype.__defineGetter__("srcElement",function(){ 
	    var node=this.target; 
	    while(node.nodeType!=1)node=node.parentNode; 
	    return node; 
	    }); 
	    */
	    Event.prototype.__defineGetter__("fromElement", function() {// 返回鼠标移出的源节点 
	        var node;
	        if (this.type == "mouseover")
	            node = this.relatedTarget;
	        else if (this.type == "mouseout")
	            node = this.target;
	        if (!node) return;
	        while (node.nodeType != 1) node = node.parentNode;
	        return node;
	    });
	    Event.prototype.__defineGetter__("toElement", function() {// 返回鼠标移入的源节点 
	        var node;
	        if (this.type == "mouseout")
	            node = this.relatedTarget;
	        else if (this.type == "mouseover")
	            node = this.target;
	        if (!node) return;
	        while (node.nodeType != 1) node = node.parentNode;
	        return node;
	    });
	    Event.prototype.__defineGetter__("offsetX", function() {
	        return this.layerX;
	    });
	    Event.prototype.__defineGetter__("offsetY", function() {
	        return this.layerY;
	    });
	}
}
if (window.Document) {

}
if (window.HTMLElement) 
{
	if (getNaviType() != "ie")
	{
	    HTMLElement.prototype.__defineGetter__("all", function() {//document.all()
	        var a = this.getElementsByTagName("*");
	        var node = this;
	        a.tags = function(sTagName) {
	            return node.getElementsByTagName(sTagName);
	        }
	        return a;
	    });
	    HTMLElement.prototype.__defineGetter__("parentElement", function() {
	        if (this.parentNode == this.ownerDocument) return null;
	        return this.parentNode;
	    });
	    HTMLElement.prototype.__defineGetter__("children", function() {
	        var tmp = [];
	        var j = 0;
	        var n;
	        for (var i = 0; i < this.childNodes.length; i++) {
	            n = this.childNodes[i];
	            if (n.nodeType == 1) {
	                tmp[j++] = n;
	                if (n.name) {
	                    if (!tmp[n.name])
	                        tmp[n.name] = [];
	                    tmp[n.name][tmp[n.name].length] = n;
	                }
	                if (n.id)
	                    tmp[n.id] = n;
	            }
	        }
	        return tmp;
	    });
	    HTMLElement.prototype.__defineGetter__("currentStyle", function() {
	        return this.ownerDocument.defaultView.getComputedStyle(this, null);
	    });
	    HTMLElement.prototype.__defineSetter__("outerHTML", function(sHTML) {
	        var r = this.ownerDocument.createRange();
	        r.setStartBefore(this);
	        var df = r.createContextualFragment(sHTML);
	        this.parentNode.replaceChild(df, this);
	        return sHTML;
	    });
	    HTMLElement.prototype.__defineGetter__("outerHTML", function() {
	        var attr;
	        var attrs = this.attributes;
	        var str = "<" + this.tagName;
	        for (var i = 0; i < attrs.length; i++) {
	            attr = attrs[i];
	            if (attr.specified)
	                str += " " + attr.name + "='" + attr.value + "'";
	        }
	        if (!this.canHaveChildren)
	            return str + ">";
	        return str + ">" + this.innerHTML + "</" + this.tagName + ">";
	    });
	    HTMLElement.prototype.__defineGetter__("canHaveChildren", function() {
	        switch (this.tagName.toLowerCase()) {
	            case "area":
	            case "base":
	            case "basefont":
	            case "col":
	            case "frame":
	            case "hr":
	            case "img":
	            case "br":
	            case "input":
	            case "isindex":
	            case "link":
	            case "meta":
	            case "param":
	                return false;
	        }
	        return true;
	    });
	
	    HTMLElement.prototype.__defineSetter__("innerText", function(sText) {
	        var parsedText = document.createTextNode(sText);
	        this.innerHTML = parsedText;
	        return parsedText;
	    });
	    HTMLElement.prototype.__defineGetter__("innerText", function() {
	        var r = this.ownerDocument.createRange();
	        r.selectNodeContents(this);
	        return r.toString();
	    });
	    HTMLElement.prototype.__defineSetter__("outerText", function(sText) {
	        var parsedText = document.createTextNode(sText);
	        this.outerHTML = parsedText;
	        return parsedText;
	    });
	    HTMLElement.prototype.__defineGetter__("outerText", function() {
	        var r = this.ownerDocument.createRange();
	        r.selectNodeContents(this);
	        return r.toString();
	    });
	    HTMLElement.prototype.attachEvent = function(sType, fHandler) {
	        var shortTypeName = sType.replace(/on/, "");
	        fHandler._ieEmuEventHandler = function(e) {
	            window.event = e;
	            return fHandler();
	        }
	        this.addEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
	    }
	    HTMLElement.prototype.detachEvent = function(sType, fHandler) {
	        var shortTypeName = sType.replace(/on/, "");
	        if (typeof (fHandler._ieEmuEventHandler) == "function")
	            this.removeEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
	        else
	            this.removeEventListener(shortTypeName, fHandler, true);
	    }
	    HTMLElement.prototype.contains = function(Node) {// 是否包含某节点 
	        do if (Node == this) return true;
	        while (Node = Node.parentNode);
	        return false;
	    }
	    HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode) {
	        switch (where) {
	            case "beforeBegin":
	                this.parentNode.insertBefore(parsedNode, this);
	                break;
	            case "afterBegin":
	                this.insertBefore(parsedNode, this.firstChild);
	                break;
	            case "beforeEnd":
	                this.appendChild(parsedNode);
	                break;
	            case "afterEnd":
	                if (this.nextSibling)
	                    this.parentNode.insertBefore(parsedNode, this.nextSibling);
	                else
	                    this.parentNode.appendChild(parsedNode);
	                break;
	        }
	    }
	    HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr) {
	        var r = this.ownerDocument.createRange();
	        r.setStartBefore(this);
	        var parsedHTML = r.createContextualFragment(htmlStr);
	        this.insertAdjacentElement(where, parsedHTML);
	    }
	    HTMLElement.prototype.insertAdjacentText = function(where, txtStr) {
	        var parsedText = document.createTextNode(txtStr);
	        this.insertAdjacentElement(where, parsedText);
	    }
	    HTMLElement.prototype.attachEvent = function(sType, fHandler) {
	        var shortTypeName = sType.replace(/on/, "");
	        fHandler._ieEmuEventHandler = function(e) {
	            //window.event=e; 
	            return fHandler();
	        }
	        this.addEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
	    }
	    HTMLElement.prototype.detachEvent = function(sType, fHandler) {
	        var shortTypeName = sType.replace(/on/, "");
	        if (typeof (fHandler._ieEmuEventHandler) == "function")
	            this.removeEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
	        else
	            this.removeEventListener(shortTypeName, fHandler, true);
	    }
	}
}

if (document.implementation && document.implementation.createDocument) {
    /* XMLDocument.prototype.loadXML = function(xmlString)
    {
    var childNodes = this.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--)
    this.removeChild(childNodes[i]);
    var dp = new DOMParser();
    var newDOM = dp.parseFromString(xmlString, "text/xml");
    var newElt = this.importNode(newDOM.documentElement, true);
    this.appendChild(newElt);
    };*/

    if (document.implementation.hasFeature("XPath", "3.0")) {
        XMLDocument.prototype.selectNodes = function(cXPathString, xNode) {
            if (!xNode) { xNode = this; }
            var oNSResolver = this.createNSResolver(this.documentElement)
            var aItems = this.evaluate(cXPathString, xNode, oNSResolver,
                       XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
            var aResult = [];
            for (var i = 0; i < aItems.snapshotLength; i++) {
                aResult[i] = aItems.snapshotItem(i);
            }
            return aResult;
        }
        Element.prototype.selectNodes = function(cXPathString) {
            if (this.ownerDocument.selectNodes) {
                return this.ownerDocument.selectNodes(cXPathString, this);
            }
            else { throw "For XML Elements Only"; }
        }
    }
    if (document.implementation.hasFeature("XPath", "3.0")) {
        // prototying the XMLDocument
        XMLDocument.prototype.selectSingleNode = function(cXPathString, xNode) {
            if (!xNode) { xNode = this; }
            var xItems = this.selectNodes(cXPathString, xNode);
            if (xItems.length > 0) {
                return xItems[0];
            }
            else {
                return null;
            }
        }
        Element.prototype.selectSingleNode = function(cXPathString) {
            if (this.ownerDocument.selectSingleNode) {
                return this.ownerDocument.selectSingleNode(cXPathString, this);
            }
            else { throw "For XML Elements Only"; }
        }
    }
}
try { // 让firefox下的event调用像IE下的一样
    window.constructor.prototype.__defineGetter__("event", function() {
        var o = arguments.callee.caller;
        var e;
        while (o != null) {
            e = o.arguments[0];
            if (e && (e.constructor == Event || e.constructor == MouseEvent)) return e;
            o = o.caller;
        }
        return null;
    });
} catch (e) { }

	function xmlSend(strPath,xmlDoc,isAsync)
	{
		try 
		{
            var oXmlHttp = new XMLHttpRequest();
            if(isAsync != null)
            	oXmlHttp.open("POST", strPath, isAsync);
            else
            	oXmlHttp.open("POST", strPath, false);
            oXmlHttp.send(xmlDoc);
            if(oXmlHttp.responseText.replace(/(^\s+)|(\s+$)/g, "") == "invalid session")
            	alert("session已经过期，请重新登录！");
            return oXmlHttp.responseText;
        }
        catch (e) {
            return;
        }
	}
	
	function xmlSend2(strPath,xmlDoc)
	{
		try 
		{
            var oXmlHttp = new XMLHttpRequest();
            oXmlHttp.open("POST", strPath, true);
            oXmlHttp.send(xmlDoc);
            if(oXmlHttp.responseText.replace(/(^\s+)|(\s+$)/g, "") == "invalid session")
            	alert("session已经过期，请重新登录！");
            return oXmlHttp.responseText;
        }
        catch (e) {
            return;
        }
	}

	//增加一个option对象
function $addoOption(oSelectCtrl,strValue,strText,selValue,selText,strAttributeNameArray,strAttributeValueArray,oNode)
{
	var oOption = document.createElement("OPTION");
	if (oSelectCtrl != null)
	{
		if (strValue != null)
			oOption.value	= strValue;
		if (strText	!= null)
			oOption.text	= strText;
		if ((strValue == selValue && strValue != null && selValue != null) || (strText == selText && strText != null && selText != null))
			oOption.selected = true;
		if(oNode != null)
		{
			oOption.domNode = oNode;
		}
		if (strAttributeNameArray != null)
		{
			for (var nI=0; nI<strAttributeNameArray.length; nI++)
				oOption.setAttribute(strAttributeNameArray[nI],strAttributeValueArray[nI]);
		}
		oSelectCtrl.options.add(oOption);
	}
}

//得到随机颜色
	function getRandomColor()
	{    
		return  '#' +    
		    (function(color){    
		    return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
		      && (color.length == 6) ?  color : arguments.callee(color);    
		  })('');    
	}

//***************************得到uuid****************************//
	Math.uuid = (function () {
	
	    // Private array of chars to use
	
	    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	
	    return function (len, radix) {
	
	        var chars = CHARS, uuid = [], rnd = Math.random;
	
	        radix = radix || chars.length;
	
	        if (len) {
	
	            // Compact form
	
	            for (var i = 0; i < len; i++) uuid[i] = chars[0 | rnd() * radix];
	
	        } else {
	
	            // rfc4122, version 4 form
	
	            var r;
	
	            // rfc4122 requires these characters
	
	            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	
	            uuid[14] = '4';
	
	            // Fill in random data.  At i==19 set the high bits of clock sequence as
	
	            // per rfc4122, sec. 4.1.5
	
	            for (var i = 0; i < 36; i++) {
	
	                if (!uuid[i]) {
	
	                    r = 0 | rnd() * 16;
	
	                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
	
	                }
	
	            }
	
	        }
	
	        return uuid.join('');
	
	    };
	
	})();
	
	// Deprecated - only here for backward compatability
	
	var randomUUID = Math.uuid;
	
	function generateUUID() 
	{
	    return Math.uuid();
	}
//****************************end********************************//
	//计算控件向上到body的距离
    function calculateCtrlTop(obj)
    {
        if (obj != null)
        {
            var nTop = 0;
            while(obj != null)
            {
                nTop = nTop + obj.offsetTop;
                if (obj.offsetParent != null && obj.offsetParent.tagName != null && obj.offsetParent.tagName.toLowerCase() == "body")
                    break;
                obj = obj.offsetParent;
            }
            return nTop;
        }
    }

    //计算控件向左到body的距离
    function calculateCtrlLeft(obj)
    {
        if (obj != null)
        {
            var nLeft = 0;
            while(obj != null)
            {
                nLeft = nLeft + obj.offsetLeft;
                if (obj.offsetParent != null && obj.offsetParent.tagName != null && obj.offsetParent.tagName.toLowerCase() == "body")
                    break;
                obj = obj.offsetParent;
            }
            return nLeft;
        }
    }