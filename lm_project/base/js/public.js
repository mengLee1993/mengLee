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
window.console = window.console || (function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
    };
    return c;
})();
try {
    var mainframe = top.window.document.getElementById("mainframe");
} catch (e) {
}
;
var Browser = new Browser();
Browser.init();
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
function $getNamedObj(strTagName, event) {
    var element = $event(event);
    if (element.tagName != null) {
        while (element.tagName.toUpperCase() != strTagName) {
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
    if (Browser.ie) {
        return rootNode.all(subid);
    }
    if (Browser.ff || Browser.ie11) {
        if ($getAtt(rootNode, "id") == subid || $getAtt(rootNode, "name") == subid) {
            return rootNode;
        }
        var acn = rootNode.childNodes;
        for (var i = 0; i < acn.length; i++) {
            if (!$isWs(acn[i])) {
                var result = $subNode(acn[i], subid);
                if ($defined(result)) {
                    return result;
                }
            }
        }
    }
    return null;
}

//得到所有指定Id的对象
function $subAllNode(rootNode, subid) {
    return $(rootNode).find("*[id='" + subid + "']");
    /*var arr = new Array();
     if (Browser.ie)
     {
     if(rootNode.all[subid] == null)
     return arr;
     else{
     if(rootNode.all[subid].length > 0)
     return rootNode.all[subid];
     else
     {
     if(rootNode.all[subid] == null)
     return arr;
     else
     {
     arr.push(rootNode.all[subid]);
     return arr;
     }

     }
     }
     }
     if (Browser.ff || Browser.ie11) {

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
     return arr;*/
}

//DOM查找：selectSingleNode
function $selectSingleNode(oNode, xPathStr) {
    if (Browser.ie) return oNode.selectSingleNode(xPathStr);
    if (Browser.ff || Browser.ie11) {
        var xltems = $selectNodes(oNode, xPathStr);
        if (xltems.length > 0) return xltems[0]; else return null;
    }
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
function $append(oTable, oNode) {
    if (Browser.ie || Browser.ie11) oTable.childNodes[0].appendChild(oNode);
    if (Browser.ff) oTable.appendChild(oNode);
}

//判断一个Node是不是WhiteSpace
function $isWs(oNode) {
    return !(/[^\t\n\r ]/.test(oNode.data))
}

//获得事件源
function $event(event) {
    event = event ? event : (window.event ? window.event : null);
    return event.srcElement ? event.srcElement : event.target;
}

//遍历对象元素，注意:统一使用[]获取集合类对象.
function $each(oNames, index) {
    return oNames[index];
}

//根据name返回对象集合
function $getByName(oName) {
    return document.getElementsByName(oName);
}

//根据id返回对象
function $getById(oId) {
    return document.getElementById(oId);
}

//获取对象自定义属性
function $getAtt(obj, oAtt) {
    try {
        return obj.getAttribute(oAtt);
    } catch (e) {
        return null;
    }
    ;
}

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
    if (Browser.ie) {
        oElement.attachEvent(sEvent, func);
    }
    if (Browser.ff || Browser.ie11) {
        sEvent = sEvent.substring(2, sEvent.length);
        oElement.addEventListener(sEvent, func, false);
    }
}

//移除监听事件
function $detachEvent(oElement, sEvent, func) {
    if (Browser.ie) {
        oElement.detachEvent(sEvent, func);
    }
    if (Browser.ff || Browser.ie11) {
        sEvent = sEvent.substring(2, sEvent.length);
        oElement.removeEventListener(sEvent, func, false);
    }
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
function $getChild(obj) {
    if (Browser.ie) {
        var arr = new Array();
        for (var nI = 0; nI < obj.childNodes.length; nI++) {
            if (obj.childNodes[nI].nodeType == 1) {
                arr[arr.length] = obj.childNodes[nI];
            }
        }
        return arr;
    }
    //return obj.childNodes;
    if (Browser.ff || Browser.ie11)
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
                if ($defined(oDom) && oDom != null) {
                    oDom.async = false;
                    return oDom;
                }
            } catch (e) {
                continue;
            }
        }
    }
    if (Browser.ff) {
        var DomP = new DOMParser();
        oDom = document.implementation.createDocument("", "", null);
        oDom.async = false;
        return oDom;
    }
}

//如果传入的参数为null或undefined,则返回fasle;否则返回true;
function $defined(obj) {
    return (obj != undefined);
}

//将DOM对象转为字符串
function $xml(oNode) {
    if (Browser.ie || Browser.ie11) {
        return oNode.xml;
    }
    if (Browser.ff) {
        var oSerializer = new XMLSerializer();
        return oSerializer.serializeToString(oNode);
    }
}

//得到text值
function $text(oNode) {
    if (Browser.ie || Browser.ie11) {
        return oNode.text;
    }
    if (Browser.ff) {
        return oNode.textContent;
    }
}

//判断浏览器类型，目前支持IE浏览器和firefox浏览器
function Browser() {
    this.ie = false;
    this.ff = false;
    this.ie11 = false;
    this.init = Browser$init;
}

function Browser$init() {
    if (document.getBoxObjectFor != null) {
        this.ff = true;
    }
    else if (!!window.ActiveXObject || "ActiveXObject" in window) {
        if (!window.attachEvent)
            this.ie11 = true;
        else
            this.ie = true;
    }
    else {
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
        } catch (e) {
            continue;
        }
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
    else {
        var reg = new RegExp("&&", "g");
        xmlstr = xmlstr.replace(reg, "&amp;&amp;");
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
        var DomP = new DOMParser();
        var reg = new RegExp("&&", "g");
        xmlstr = xmlstr.replace(reg, "&amp;&amp;");
        var dom = DomP.parseFromString(xmlstr, "text/xml");
        if (dom.firstChild.tagName == "parsererror")
            return null;
        return dom;
    }
}


if (window.Node) {
    Node.prototype.replaceNode = function (Node) {// 替换指定节点
        this.parentNode.replaceChild(Node, this);
    }
    Node.prototype.removeNode = function (removeChildren) {// 删除指定节点
        if (removeChildren)
            return this.parentNode.removeChild(this);
        else {
            var range = document.createRange();
            range.selectNodeContents(this);
            return this.parentNode.replaceChild(range.extractContents(), this);
        }
    }
    Node.prototype.swapNode = function (Node) {// 交换节点
        var nextSibling = this.nextSibling;
        var parentNode = this.parentNode;
        node.parentNode.replaceChild(this, Node);
        parentNode.insertBefore(node, nextSibling);
    }
}
if (window.Event) {
    if (getNaviType() != "ie") {
        Event.prototype.__defineSetter__("returnValue", function (b) {//
            if (!b) this.preventDefault();
            return b;
        });
        Event.prototype.__defineSetter__("cancelBubble", function (b) {// 设置或者检索当前事件句柄的层次冒泡
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
        Event.prototype.__defineGetter__("fromElement", function () {// 返回鼠标移出的源节点
            var node;
            if (this.type == "mouseover")
                node = this.relatedTarget;
            else if (this.type == "mouseout")
                node = this.target;
            if (!node) return;
            while (node.nodeType != 1) node = node.parentNode;
            return node;
        });
        Event.prototype.__defineGetter__("toElement", function () {// 返回鼠标移入的源节点
            var node;
            if (this.type == "mouseout")
                node = this.relatedTarget;
            else if (this.type == "mouseover")
                node = this.target;
            if (!node) return;
            while (node.nodeType != 1) node = node.parentNode;
            return node;
        });
        Event.prototype.__defineGetter__("offsetX", function () {
            return this.layerX;
        });
        Event.prototype.__defineGetter__("offsetY", function () {
            return this.layerY;
        });
    }
}
if (window.Document) {

}
if (window.HTMLElement) {
    if (getNaviType() != "ie") {
        HTMLElement.prototype.__defineGetter__("all", function () {//document.all()
            var a = this.getElementsByTagName("*");
            var node = this;
            a.tags = function (sTagName) {
                return node.getElementsByTagName(sTagName);
            }
            return a;
        });
        HTMLElement.prototype.__defineGetter__("parentElement", function () {
            if (this.parentNode == this.ownerDocument) return null;
            return this.parentNode;
        });
        HTMLElement.prototype.__defineGetter__("children", function () {
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
        HTMLElement.prototype.__defineGetter__("currentStyle", function () {
            return this.ownerDocument.defaultView.getComputedStyle(this, null);
        });
        HTMLElement.prototype.__defineSetter__("outerHTML", function (sHTML) {
            var r = this.ownerDocument.createRange();
            r.setStartBefore(this);
            var df = r.createContextualFragment(sHTML);
            this.parentNode.replaceChild(df, this);
            return sHTML;
        });
        HTMLElement.prototype.__defineGetter__("outerHTML", function () {
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
        HTMLElement.prototype.__defineGetter__("canHaveChildren", function () {
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

        HTMLElement.prototype.__defineSetter__("innerText", function (sText) {
            var parsedText = document.createTextNode(sText);
            this.innerHTML = parsedText;
            return parsedText;
        });
        HTMLElement.prototype.__defineGetter__("innerText", function () {
            var r = this.ownerDocument.createRange();
            r.selectNodeContents(this);
            return r.toString();
        });
        HTMLElement.prototype.__defineSetter__("outerText", function (sText) {
            var parsedText = document.createTextNode(sText);
            this.outerHTML = parsedText;
            return parsedText;
        });
        HTMLElement.prototype.__defineGetter__("outerText", function () {
            var r = this.ownerDocument.createRange();
            r.selectNodeContents(this);
            return r.toString();
        });
        HTMLElement.prototype.attachEvent = function (sType, fHandler) {
            var shortTypeName = sType.replace(/on/, "");
            fHandler._ieEmuEventHandler = function (e) {
                window.event = e;
                return fHandler();
            }
            this.addEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
        }
        HTMLElement.prototype.detachEvent = function (sType, fHandler) {
            var shortTypeName = sType.replace(/on/, "");
            if (typeof (fHandler._ieEmuEventHandler) == "function")
                this.removeEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
            else
                this.removeEventListener(shortTypeName, fHandler, true);
        }
        HTMLElement.prototype.contains = function (Node) {// 是否包含某节点
            do if (Node == this) return true;
            while (Node = Node.parentNode);
            return false;
        }
        HTMLElement.prototype.insertAdjacentElement = function (where, parsedNode) {
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
        HTMLElement.prototype.insertAdjacentHTML = function (where, htmlStr) {
            var r = this.ownerDocument.createRange();
            r.setStartBefore(this);
            var parsedHTML = r.createContextualFragment(htmlStr);
            this.insertAdjacentElement(where, parsedHTML);
        }
        HTMLElement.prototype.insertAdjacentText = function (where, txtStr) {
            var parsedText = document.createTextNode(txtStr);
            this.insertAdjacentElement(where, parsedText);
        }
        HTMLElement.prototype.attachEvent = function (sType, fHandler) {
            var shortTypeName = sType.replace(/on/, "");
            fHandler._ieEmuEventHandler = function (e) {
                //window.event=e;
                return fHandler();
            }
            this.addEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
        }
        HTMLElement.prototype.detachEvent = function (sType, fHandler) {
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
        XMLDocument.prototype.selectNodes = function (cXPathString, xNode) {
            if (!xNode) {
                xNode = this;
            }
            var oNSResolver = this.createNSResolver(this.documentElement)
            var aItems = this.evaluate(cXPathString, xNode, oNSResolver,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
            var aResult = [];
            for (var i = 0; i < aItems.snapshotLength; i++) {
                aResult[i] = aItems.snapshotItem(i);
            }
            return aResult;
        }
        Element.prototype.selectNodes = function (cXPathString) {
            if (this.ownerDocument.selectNodes) {
                return this.ownerDocument.selectNodes(cXPathString, this);
            }
            else {
                throw "For XML Elements Only";
            }
        }
    }
    if (document.implementation.hasFeature("XPath", "3.0")) {
        // prototying the XMLDocument
        XMLDocument.prototype.selectSingleNode = function (cXPathString, xNode) {
            if (!xNode) {
                xNode = this;
            }
            var xItems = this.selectNodes(cXPathString, xNode);
            if (xItems.length > 0) {
                return xItems[0];
            }
            else {
                return null;
            }
        }
        Element.prototype.selectSingleNode = function (cXPathString) {
            if (this.ownerDocument.selectSingleNode) {
                return this.ownerDocument.selectSingleNode(cXPathString, this);
            }
            else {
                throw "For XML Elements Only";
            }
        }
    }
}

/*try { // 让firefox下的event调用像IE下的一样
    window.constructor.prototype.__defineGetter__("event", function () {
        var o = arguments.callee.caller;
        var e;
        while (o != null) {
            e = o.arguments[0];
            if (e && (e.constructor == Event || e.constructor == MouseEvent)) return e;
            o = o.caller;
        }
        return null;
    });
} catch (e) {
}*/

function xmlSend(strPath, xmlDoc, isAsync) {
    try {
        var oXmlHttp = new XMLHttpRequest();
        if (isAsync != null)
            oXmlHttp.open("POST", strPath, isAsync);
        else
            oXmlHttp.open("POST", strPath, false);
        oXmlHttp.send(xmlDoc);
        if (oXmlHttp.responseText.replace(/(^\s+)|(\s+$)/g, "") == "invalid session")
            alert("session已经过期，请重新登录！");
        return oXmlHttp.responseText;
    }
    catch (e) {
        return;
    }
}

function xmlSend2(strPath, xmlDoc) {
    try {
        var oXmlHttp = new XMLHttpRequest();
        oXmlHttp.open("POST", strPath, true);
        oXmlHttp.send(xmlDoc);
        if (oXmlHttp.responseText.replace(/(^\s+)|(\s+$)/g, "") == "invalid session")
            alert("session已经过期，请重新登录！");
        return oXmlHttp.responseText;
    }
    catch (e) {
        return;
    }
}

//阻止冒泡
function $stopPropagation(event) {
    if (event.stopPropagation)
        event.stopPropagation();
    else
        event.cancelBubble = true;
}

//增加一个option对象
function $addoOption(oSelectCtrl, strValue, strText, selValue, selText, strAttributeNameArray, strAttributeValueArray, oNode) {
    var oOption = document.createElement("OPTION");
    if (oSelectCtrl != null) {
        if (strValue != null)
            oOption.value = strValue;
        if (strText != null)
            oOption.text = strText;
        if ((strValue == selValue && strValue != null && selValue != null) || (strText == selText && strText != null && selText != null))
            oOption.selected = true;
        if (oNode != null) {
            oOption.domNode = oNode;
        }
        if (strAttributeNameArray != null) {
            for (var nI = 0; nI < strAttributeNameArray.length; nI++)
                oOption.setAttribute(strAttributeNameArray[nI], strAttributeValueArray[nI]);
        }
        oSelectCtrl.options.add(oOption);
    }
}

//得到随机颜色
function getRandomColor() {
    return '#' +
        (function (color) {
            return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
            && (color.length == 6) ? color : arguments.callee(color);
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

function generateUUID() {
    return Math.uuid();
}

//****************************end********************************//
//计算控件向上到body的距离
function calculateCtrlTop(obj) {
    if (obj != null) {
        var nTop = 0;
        while (obj != null) {
            nTop = nTop + obj.offsetTop;
            if (obj.offsetParent != null && obj.offsetParent.tagName != null && obj.offsetParent.tagName.toLowerCase() == "body")
                break;
            obj = obj.offsetParent;
        }
        return nTop;
    }
}

//计算控件向左到body的距离
function calculateCtrlLeft(obj) {
    if (obj != null) {
        var nLeft = 0;
        while (obj != null) {
            nLeft = nLeft + obj.offsetLeft;
            if (obj.offsetParent != null && obj.offsetParent.tagName != null && obj.offsetParent.tagName.toLowerCase() == "body")
                break;
            obj = obj.offsetParent;
        }
        return nLeft;
    }
}

//clone json对象
function cloneJson(_DataObj) {
    /*var objClone;
    if (_DataObj.constructor == Object) objClone = new _DataObj.constructor();
    else objClone = new _DataObj.constructor(_DataObj.valueOf());
    for (var key in _DataObj) {
        if (objClone[key] != _DataObj[key]) {
            if (typeof(_DataObj[key]) == 'object') {
                objClone[key] = cloneJson(_DataObj[key]);
            }
            else {
                objClone[key] = _DataObj[key];
            }
        }
    }
    return objClone;*/
    var temp = JSON.stringify(_DataObj);
    return JSON.parse(temp);
}

// ajax response data 统一转换及处理方法
function jsonDataParse(data) {
    var jsonObj = eval('(' + data + ')');
    if ('-1' == jsonObj.status) {
        // 需要登录
        window.location.href = ctx + "/logout";
    }

    return jsonObj;
}


function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
} //通过className获取元素
function getByClassName(oParent, sClass) {
    var aEle = oParent.getElementsByTagName('*');
    var aResult = [];
    var re = new RegExp('\\b' + sClass + '\\b', 'i');

    for (var i = 0; i < aEle.length; i++) {
        if (re.test(aEle[i].className)) {
            aResult.push(aEle[i]);
        }
    }
    return aResult;
}

String.prototype.gblen = function () {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94)
            len += 2;
        else
            len++;
    }
    return len;
}

function trim(str) { //删除左右两端的空格　　

    return str.replace(/(^\s*)|(\s*$)/g, "");

}

function ltrim(str) { //删除左边的空格

    return str.replace(/(^\s*)/g, "");

}

function rtrim(str) { //删除右边的空格

    return str.replace(/(\s*$)/g, "");

}

//得到指定天dayCount:第几天,strDate:目标日期,operator:+或者-
function getCustomDate(dayCount, strDate, operator, spar) {
    if (strDate == null)
        var now = new Date();
    else
        var now = new Date(strDate);
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

function $getInnerText(element) {
    return (typeof element.textContent == "string") ? element.textContent : element.innerText;
}

function $setInnerText(element, text) {
    if (typeof element.textContent == "string") {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}

/**
 * 时间格式转utc
 * @param c_date
 * @returns
 */
function date2utcs(c_date) {
    if (!c_date)
        return "";
    var tempArray2 = c_date.split(" ")[1].split(":");
    var tempArray = c_date.split(" ")[0].split("-");
    if (tempArray.length != 3) {
        //alert(c_date)
        alert("你输入的日期格式不正确,正确的格式:2000-05-01 23:23:23");
        return 0;
    }
    var date = new Date(tempArray[0], tempArray[1] - 1, tempArray[2],
        tempArray2[0], tempArray2[1], tempArray2[2]);
    return parseInt("" + date.getTime() / 1000);
};

/**
 * utc格式转换为时间格式
 * @param n_utc
 * @returns {String}
 */
function utc2Date(n_utc) {
    if (!n_utc || n_utc == null || n_utc == "null" || n_utc == "无")
        return "";
    var date = new Date();
    date.setTime((parseInt(n_utc) + 8 * 3600) * 1000);
    var s = date.getUTCFullYear() + "-";
    if ((date.getUTCMonth() + 1) < 10) {
        s += "0" + (date.getUTCMonth() + 1) + "-";
    } else {
        s += (date.getUTCMonth() + 1) + "-";
    }
    if (date.getUTCDate() < 10) {
        s += "0" + date.getUTCDate();
    } else {
        s += date.getUTCDate();
    }
    if (date.getUTCHours() < 10) {
        s += " 0" + date.getUTCHours() + ":";
    } else {
        s += " " + date.getUTCHours() + ":";
    }
    if (date.getMinutes() < 10) {
        s += "0" + date.getUTCMinutes() + ":";
    } else {
        s += date.getUTCMinutes() + ":";
    }
    if (date.getUTCSeconds() < 10) {
        s += "0" + date.getUTCSeconds();
    } else {
        s += date.getUTCSeconds();
    }

    return s;
}


Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
    return format;
};


/**
 * form input 传化为json
 */
function formDataToJson(formId) {
    var ov = $("#" + formId).serializeArray();
    var data = {};
    for (var i = 0; i < ov.length; i++) {
        var datai = ov[i];
        var name = datai.name;
        var value = datai.value;
        if (data[name] && value && value != "") {
            data[name] += "," + value;
        } else {
            data[name] = value;
        }
    }
    return data;
}

/**
 * yyyy-MM-dd hh:mm:ss  时间格式转成Date对象
 */
function dateStr2Millseconds(dateStr) {
    var dateSplitArray = dateStr.substring(0, 10).split('-');
    var formatDateStr = dateSplitArray[1] + '/' + dateSplitArray[2] + '/' + dateSplitArray[0] + ' ' + dateStr.substring(11, 19);

    return Date.parse(formatDateStr);
}

/**
 * 文件上传
 \ennew-c2p-webapps-wwwp\src\main\webapp\static\uploadcompressFile.html
 \ennew-c2p-webapps-wwwp\src\main\webapp\static\uploadFile.html
 ennew-c2p-webapps-wwwp\src\main\webapp\static\uploadCutFile.html
 uploadFile 普通上传，   uploadCutFile 图片剪切，  uploadcompressFile 图片缩小或者放大
 'fileOwnerType' : '1',    //1：活动    2：创新    3：商品        4：展厅
 'resouceType' : '1',    //1：图片        2：视频    3：文本        4:u3d商品文件
 'groupName' : '1',        //详细，请查看 cn.ejzg.framework.rss.common.GroupName
 存放系统公共资源，如货架、店铺装修模版等，所有用户均可以访问
 SYS_PUB("1", "syspub"),
 // 存放主用户公共资源，如卖场图片、海报、Logo、商品图片、创意图片等，该Group资源需要根据用户等级进行分配，并统计到卖场占用的空间内
 USER_PUB("2", "userpub"),
 // 存放主用户私有资源，如营业执照、身份证照片，该Group内资源为私有资源，需要进行访问权限控制
 USER_SECURITY("3", "usersecurity"),
 // 存放用户交互产生的其他资源，该部分不计入到用户空间，但不需要进行身份认证，所有人都可以访问
 USER_BUSI_PUB("4", "userbusipub"),
 // 存放用户交互产生的其他资源，该部分不计入到用户空间，但需要进行身份认证，仅用户可访问
 USER_BUSI_PRIV("5", "userbusipriv"),
 // 存放产品详情html
 PROD_DETAIL("6", "proddetail");
 这个三个参数必须传
 * @param targetObj
 * @param param
 *        size 文件大小
 *        fileOwnerType : '1',    //1：活动    2：创新    3：商品        4：展厅
 resouceType : '1',    //1：图片        2：视频    3：文本        4:u3d商品文件
 groupName : '1',
 */
function public_fileAjaxUpload(targetObj, param) {
    var p = {
        "size": 20,
        "fileOwnerType": "1",
        "resouceType": "1",
        "groupName": "1",
        "previewpath": "",
        "regex": /^(jpg|png|bmp)$/
    };
    $.extend(p, param);
    new AjaxUpload($("#uploadBtn", targetObj), {
        action: ctx + '/file/uploadFile',
        name: 'file',
        parentObj: targetObj,
        responseType: 'json',
        onSubmit: function (file, ext) {
            if (ext && p.regex.test(ext.toLowerCase())) {
                this.setData({
                    'picName': file,
                    'size': 1024 * 1024 * p.size,
                    "fileOwnerType": p.fileOwnerType,
                    "resouceType": p.resouceType,
                    "groupName": p.groupName
                });
            } else {
                alert("请上传jpg|png|gif|jpeg图片！");
                return false;
            }
        },
        onComplete: function (file, response) {
            if (response.status == "1") {
                //得到返回图片url并赋值到image上
                $("#uploadImg", targetObj).attr("src", response.results.fullPath);
                $("#uploadImg", targetObj).attr("file_id", response.results.fileId);

                //上传之后class变化
                $("#commonUpBox", targetObj).addClass('upImgAfer');
                $("#delete", targetObj).bind("click", function () {
                    $("#uploadImg", targetObj).attr("src", def_img_src);
                    $("#uploadImg", targetObj).attr("file_id", "");
                });
                //hideErrors($("#uploadImg",targetObj));
            } else {
                Toast.warn("上传失败!");
                return;
            }
        }
    });
}


var Toast = {
    show: function (e, d, c) {
        $("#Toast_clewBoxDiv").remove();
        if ($("#Toast_clewBoxDiv").length > 0) {
            var b = "<span id='mode_clew' style='position:absolute;z-index: 10000;!important;' class='clewBox_layer'>";
            b += "<span class='" + d + "'></span>" + e + "<span class='clew_end'></span>";
            b += "</span></div>";
            $("#Toast_clewBoxDiv").html(b);
            $("#Toast_clewBoxDiv").css("display", "none");
        } else {
            var a = document.createElement("div");
            a.setAttribute("id", "Toast_clewBoxDiv");
            a.className = "clewBox_layer_wrap";
            var b = "<span id='mode_clew' style='z-index: 9999999;!important;' class='clewBox_layer'>";
            b += "<span class='" + d + "'></span>" + e + "<span class='clew_end'></span>";
            b += "</span></div>";
            a.innerHTML = b;
            document.body.appendChild(a);
            $("#Toast_clewBoxDiv").css("display", "none");
        }
        $("#Toast_clewBoxDiv").fadeIn(1000);
        setTimeout(function () {
                $("#Toast_clewBoxDiv").fadeOut(1000);
            },
            c ? c : 2000);
    },
    success: function (msg, timeout) {
        this.show(msg, "clew_ico_succ", timeout);
    },
    fail: function (msg, timeout) {
        this.show(msg, "clew_ico_fail", timeout);
    },
    warn: function (msg, timeout) {
        this.show(msg, "clew_ico_hits", timeout);
    }
};

var Hall_Toast = {
    show: function (e, d, c) {
        $("#Toast_clewBoxDiv").remove();
        if ($("#Toast_clewBoxDiv").length > 0) {
            var b = "<span id='mode_clew' style='position:absolute;z-index: 10000;!important;' class='clewBox_layer'>";
            b += "<span class='" + d + "'></span>" + e + "<span class='clew_end'></span>";
            b += "</span></div>";
            $("#Toast_clewBoxDiv").html(b);
            $("#Toast_clewBoxDiv").css("display", "none");
        } else {
            var a = document.createElement("div");
            a.setAttribute("id", "Toast_clewBoxDiv");
            a.className = "clewBox_layer_wrap";
            a.style.top = "40%";
            a.style.left = "400px";
            var b = "<span id='mode_clew' style='z-index: 9999999;!important;' class='clewBox_layer'>";
            b += "<span class='" + d + "'></span>" + e + "<span class='clew_end'></span>";
            b += "</span></div>";
            a.innerHTML = b;
            document.body.appendChild(a);
            $("#Toast_clewBoxDiv").css("display", "none");
        }


        $("#Toast_clewBoxDiv").fadeIn(1000);


        setTimeout(function () {
                $("#Toast_clewBoxDiv").fadeOut(1000);
            },
            c ? c : 2000);
    },
    success: function (msg, timeout) {
        this.show(msg, "clew_ico_succ", timeout);
    },
    fail: function (msg, timeout) {
        this.show(msg, "clew_ico_fail", timeout);
    },
    warn: function (msg, timeout) {
        this.show(msg, "clew_ico_hits", timeout);
    }
};

function formatEmail(str, beginPos, endPos) {
    beginPos = (beginPos == null) ? 0 : beginPos;
    endPos = (endPos == null) ? str.split("@")[0].length - 1 : str.split("@")[0].length - endPos - 1;
    var result = "";

    for (var mI = 0; mI < str.split("@")[0].length; mI++) {
        if (mI < beginPos || mI > endPos)
            result = result + str.split("@")[0].charAt(mI);
        else
            result = result + "*";
    }
    if (str.split("@")[1] != null)
        return result + "@" + str.split("@")[1];
    else if ((beginPos + endPos) >= str.split("@")[0].length)
        return str;
    else
        return result;
}

//计算字符串字节的长度
function byteRangeLength(str) {
    if (!str) {
        return 0;
    }
    var length = str.length;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127) {
            length++;
        }
    }
    return length;
}

$(document).ready(function () {
    if (!typeof(imgPlaceholder) == "undefined" && !imgPlaceholder) {
        $("img").error(function () {
            $(this).attr("src", "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==");
        });
    }
});

//时间戳转换为字符串时间显示
function timestampToStr(timestamp) {
    if (timestamp == '' || timestamp == null) {
        return "";
    }
    var d = new Date(timestamp);    //根据时间戳生成的时间对象
    var dateStr = (d.getFullYear()) + "-";
    //月
    if (d.getMonth() < 9) {
        dateStr = dateStr + "0" + (d.getMonth() + 1) + "-";
    } else {
        dateStr = dateStr + (d.getMonth() + 1) + "-";
    }
    //日
    if (d.getDate() < 10) {
        dateStr = dateStr + "0" + d.getDate() + " ";
    } else {
        dateStr = dateStr + d.getDate() + " ";
    }
    return dateStr;
}

//时间戳转换为字符串时间显示
function timestampToStrFen(timestamp) {
    if (timestamp == '' || timestamp == null) {
        return "";
    }
    var d = new Date(timestamp);    //根据时间戳生成的时间对象
    var dateStr = (d.getFullYear()) + "-";
    //月
    if (d.getMonth() < 9) {
        dateStr = dateStr + "0" + (d.getMonth() + 1) + "-";
    } else {
        dateStr = dateStr + (d.getMonth() + 1) + "-";
    }
    //日
    if (d.getDate() < 10) {
        dateStr = dateStr + "0" + d.getDate() + " ";
    } else {
        dateStr = dateStr + d.getDate() + " ";
    }
    //时
    if (d.getHours() < 10) {
        dateStr = dateStr + "0" + d.getHours() + ":";
    } else {
        dateStr = dateStr + d.getHours() + ":";
    }
    //分
    if (d.getMinutes() < 10) {
        dateStr = dateStr + "0" + d.getMinutes();
    } else {
        dateStr = dateStr + d.getMinutes();
    }
    return dateStr;
}

//选择其他，文本框可以输入
function changeOpen(value, idName) {
    if (value == '1') {
        $('#' + idName).val('');
        $('#' + idName).attr("readonly", true);
    } else {
        $('#' + idName).attr("readonly", false);
    }
}

/**
 * 录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全
 * arg1 inputObject
 * 这个函数写得很傻，是我很早以前写的了，没有进行优化，但功能十分齐全，你尝试着使用
 * 其实有一种可以更快速的JavaScript内置函数可以提取杂乱数据中的数字：
 * parseFloat('10');
 **/
function overFormat(th, event) {
    var code = event.keyCode;
    if (code != 37 && code != 38 && code != 39 && code != 40 && code != 8) {
        var v = th.value;
        if (v === '') {
            v = '0.00';
        } else if (v === '0') {
            v = '0.00';
        } else if (v === '0.') {
            v = '0.00';
        } else if (/^0+\d+\.?\d*.*$/.test(v)) {
            v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
            //v = inp.getRightPriceFormat(v).val;
        } else if (/^0\.\d$/.test(v)) {
            v = v + '0';
        } else if (!/^\d+\.\d{2}$/.test(v)) {
            if (/^\d+\.\d{2}.+/.test(v)) {
                v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
            } else if (/^\d+$/.test(v)) {
                v = v + '.00';
            } else if (/^\d+\.$/.test(v)) {
                v = v + '00';
            } else if (/^\d+\.\d$/.test(v)) {
                v = v + '0';
            } else if (/^[^\d]+\d+\.?\d*$/.test(v)) {
                v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
            } else if (/\d+/.test(v)) {
                v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
                ty = false;
            } else if (/^0+\d+\.?\d*$/.test(v)) {
                v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
                ty = false;
            } else {
                v = '0.00';
            }
        }
        th.value = v;
    }
}

/**
 * 实时动态强制更改用户录入
 * arg1 inputObject
 **/
function amount(th, event) {
    var code = event.keyCode;
    //alert(code);
    if (code != 37 && code != 38 && code != 39 && code != 40 && code != 8) {

        var regStrs = [
            ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
            ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
            ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
            ['^(\\d+\\.\\d{2}).+', '$1'], //禁止录入小数点后两位以上
        ];

        if (th.value.charAt(0) == ".") {
            th.value = "0" + th.value;
        }
        for (i = 0; i < regStrs.length; i++) {
            var reg = new RegExp(regStrs[i][0], "g");
            th.value = th.value.replace(reg, regStrs[i][1]);
        }
    }
}

//时间日期转成时分秒  YYYY-MM-dd HH:mm:ss
function timestampToStrSuper(timestamp) {
    if (timestamp == '' || timestamp == null) {
        return "";
    }
    var d = new Date(timestamp);    //根据时间戳生成的时间对象
    var dateStr = (d.getFullYear()) + "-";
    //月
    if (d.getMonth() < 9) {
        dateStr = dateStr + "0" + (d.getMonth() + 1) + "-";
    } else {
        dateStr = dateStr + (d.getMonth() + 1) + "-";
    }
    //日
    if (d.getDate() < 10) {
        dateStr = dateStr + "0" + d.getDate() + " ";
    } else {
        dateStr = dateStr + d.getDate() + " ";
    }
    //时
    if (d.getHours() < 10) {
        dateStr = dateStr + "0" + d.getHours() + ":";
    } else {
        dateStr = dateStr + d.getHours() + ":";
    }
    //分
    if (d.getMinutes() < 10) {
        dateStr = dateStr + "0" + d.getMinutes() + ":";
    } else {
        dateStr = dateStr + d.getMinutes() + ":";
    }
    //秒
    if (d.getSeconds() < 10) {
        dateStr = dateStr + "0" + d.getSeconds();
    } else {
        dateStr = dateStr + d.getSeconds();
    }
    return dateStr;
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
}

// Array.prototype.indexOf = function (val) {
//     for (var i = 0; i < this.length; i++) {
//         if (this[i] == val) return i;
//     }
//     return -1;
// };
//
// Array.prototype.remove = function (val) {
//     var index = this.indexOf(val);
//     if (index > -1) {
//         this.splice(index, 1);
//     }
// };


function arrayIndexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) return i;
    }
    return -1;
}

//数组删除
function arrayRemove(arr, val) {
    var index = arrayIndexOf(arr, val);
    if (index > -1) {
        arr.splice(index, 1);
    }
}


/**
 * 文本框限制字符数
 * @param oText 文本框html对象
 * @param oNum 字符数html对象 无填null
 * @param nLen nLen为限制字符数，默认值10个
 */
function limitWordNumber(oText, oNum, nLen) {
    var nLen = (nLen == null) ? 10 : nLen;
    $(oText).on('keyup', function () {
        $(oText).val($.trim(this.value));
        if (this.value.length >= nLen) {
            this.value = this.value.substring(0, nLen);
            oNum && $(oNum).html(0);
        } else {
            oNum && $(oNum).html(nLen - $(this).val().length);
        }

    }).on('mouseup', function () {
        $(oText).val($.trim(this.value));
        if (this.value.length >= nLen) {
            this.value = this.value.substring(0, nLen);
            oNum && $(oNum).html(0);
        } else {
            oNum && $(oNum).html(nLen - $(this).val().length);
        }
    }).on('blur', function () {
        $(oText).val($.trim(this.value));
        if (this.value.length >= nLen) {
            this.value = this.value.substring(0, nLen);
            oNum && $(oNum).html(0);
        } else {
            oNum && $(oNum).html(nLen - $(this).val().length);
        }
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


/**
 ** 浮点数加减乘除的BUG 用来得到精确的加法结果
 ** 说明：javascript的加减乘除的结果会有误差，在两个浮点数计算的时候会比较明显。这个函数返回较为精确的结果。
 **/
function calcuNum(){
    var calcuNumObj = {};
    calcuNumObj.accAdd = function(arg1, arg2) {
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    }
    calcuNumObj.accSub = function(arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }
    calcuNumObj.accMul = function(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        }
        catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        }
        catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }
    calcuNumObj.accDiv = function(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }
    return calcuNumObj;
}

/**
 * 手机号脱敏
 * @param  {[type]} phone        [11位手机号]
 * @param  {[type]} showFrontNum [前面要显示的数字数量，没有为0]
 * @param  {[type]} showEndNum   [后面要显示的数字数量，没有为0]
 * @return {[type]}              [脱敏的手机号]
 */
function outDesensiti(phone, showFrontNum, showEndNum) {
    if (!phone)
        return "";
    if (phone.length != 11)
        return phone;
    var desensiLen = 11 - (showFrontNum == undefined ? 0 : showFrontNum) - (showEndNum == undefined ? 0 : showEndNum);
    var desensiStr = "";
    for (var i = 0; i < desensiLen; i++) {
        desensiStr += "*";
    }
    if (desensiStr.length == 11)
        return phone;
    return phone.replace(eval("/(\\d{" + showFrontNum + "})\\d{" + desensiLen + "}(\\d{" + showEndNum + "})/"), '$1' + desensiStr + '$2');
}

//返回当前日期
function getCurrentDate() {
    var obj = new Date();
    return obj.getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
}

jQuery.download = function (url, data, method) { // 获得url和data
    if (url && data) {
        // data 是 string 或者 array/object
        data = typeof data == 'string' ? data : jQuery.param(data); // 把参数组装成 form的 input
        var inputs = '';
        jQuery.each(data.split('&'), function () {
            var pair = this.split('=');
            inputs += "<input type='hidden' name='" + pair[0] + "' value='" + pair[1] + "' />";
        }); // request发送请求
        jQuery("<form action='" + url + "' method='" + (method || "post") + "'>" + inputs + "</form>").appendTo("body").submit().remove();
    }
}
/*
* 实现瀑布流排版
* 例子li进行瀑布流排版
* <ul class='CommodityCategory-wrap'>   <li></li>   <li></li>  </ul>
* $('.CommodityCategory-wrap li').flowLayout({});
* css样式  ul{position:relative}   li{position:absolute}
*gapWidth:30, //间隙    gapHeight:30, //间歇   column:2 //列
*/
$(function(){
    (function ($) {
        $.fn.flowLayout = function(options) {
            var dft = {
                gapWidth:30, //间隙
                gapHeight:30, //间歇
                column:2 //列
            };
            var ops = $.extend(dft,options);
            var _this = $(this);
            _this.width((_this.parents('.CommodityCategory-wrap').width()-2*ops.gapWidth)/2)
            var _pWidth=_this.parents('.CommodityCategory-wrap').width();
            $(".CommodityCategory-wrap").css({
                'opacity':0
            });
            var columnHeight=[],columnIndex=0;
            for (var i=0 ;i<ops.column;i++){
                columnHeight.push(0);
            }
            setTimeout(function () {
                for(var j =0 ; j< _this.length ;j++){
                    console.log(columnHeight[columnIndex]);
                    $(_this).eq(j).css({
                        'top':columnHeight[columnIndex]+ops.gapHeight+'px',
                        'left':_pWidth*columnIndex/ops.column+'px'
                    })
                    columnHeight[columnIndex]+=$(_this).eq(j).height()+ops.gapHeight
                    columnIndex=getIndex();
                }
            },50)
            function getIndex() {
                var columnIndex=0,maxHeight=0;
                for(var i =0 ;i < columnHeight.length ;i++){
                    if(columnHeight[i]<columnHeight[columnIndex]){
                        columnIndex=i;
                    }
                    if(columnHeight[i]>maxHeight){
                        maxHeight=columnHeight[i]
                    }
                }
                $(".CommodityCategory-wrap").css({
                    'opacity':1,
                    'height':maxHeight
                });
                return columnIndex;
            }
        }
    })(jQuery)
})


