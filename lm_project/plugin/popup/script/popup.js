/*-------------------------- +
  »ñÈ¡id, class, tagName
 +-------------------------- */
var get = {
	byId: function(id) {
		return typeof id === "string" ? document.getElementById(id) : id
	},
	byClass: function(sClass, oParent) {
		var aClass = [];
		var reClass = new RegExp("(^| )" + sClass + "( |$)");
		var aElem = this.byTagName("*", oParent);
		for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
		return aClass
	},
	byTagName: function(elem, obj) {
		return (obj || document).getElementsByTagName(elem)
	}
};
var dragMinWidth = 250;
var dragMinHeight = 124;
/*-------------------------- +
  ÍÏ×§º¯Êý
 +-------------------------- */
function drag(oDrag, handle)
{
	var disX = dixY = 0;
	var oMin = get.byClass("min", oDrag)[0];
	var oMax = get.byClass("max", oDrag)[0];
	var oRevert = get.byClass("revert", oDrag)[0];
	var oClose = get.byClass("close", oDrag)[0];
	handle = handle || oDrag;
	handle.style.cursor = "move";
	handle.onmousedown = function (event)
	{
		var event = event || window.event;
		disX = event.clientX - oDrag.offsetLeft;
		disY = event.clientY - oDrag.offsetTop;
		
		document.onmousemove = function (event)
		{
			var event = event || window.event;
			var iL = event.clientX - disX;
			var iT = event.clientY - disY;
			var maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
			var maxT = document.documentElement.clientHeight - oDrag.offsetHeight;
			
			iL <= 0 && (iL = 0);
			iT <= 0 && (iT = 0);
			//iL >= maxL && (iL = maxL);
			//iT >= maxT && (iT = maxT);
			
			oDrag.style.left = iL + "px";
			oDrag.style.top = iT + "px";
			
			return false
		};
		
		document.onmouseup = function ()
		{
			document.onmousemove = null;
			document.onmouseup = null;
			this.releaseCapture && this.releaseCapture()
		};
		this.setCapture && this.setCapture();
		return false
	};	
	//×î´ó»¯°´Å¥
	oMax.onclick = function ()
	{
		oDrag.style.top = oDrag.style.left = 0;
		oDrag.style.width = document.documentElement.clientWidth - 2 + "px";
		oDrag.style.height = document.documentElement.clientHeight - 2 + "px";
		this.style.display = "none";
		oRevert.style.display = "block";
	};
	//»¹Ô­°´Å¥
	oRevert.onclick = function ()
	{		
		oDrag.style.width = dragMinWidth + "px";
		oDrag.style.height = dragMinHeight + "px";
		oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + "px";
		oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + "px";
		this.style.display = "none";
		oMax.style.display = "block";
	};
	//×îÐ¡»¯°´Å¥
	oMin.onclick = function ()
	{
		oDrag.style.display = "none";
		var oA = document.createElement("a");
		oA.className = "open";
		oA.href = "javascript:;";
		oA.title = "»¹Ô­";
		document.body.appendChild(oA);
		oA.onclick = function ()
		{
			oDrag.style.display = "block";
			document.body.removeChild(this);
			this.onclick = null;
		};
	};

	//¹Ø±Õ°´Å¥
	oClose.onclick = function ()
	{
		oDrag.style.display = "none";
		/*
		var oA = document.createElement("a");
		oA.className = "open";
		oA.href = "javascript:;";
		oA.title = "»¹Ô­";
		document.body.appendChild(oA);
		oA.onclick = function ()
		{
			oDrag.style.display = "block";
			document.body.removeChild(this);
			this.onclick = null;
		};*/
		endCovered();
	};
	//×èÖ¹Ã°ÅÝ
	oMin.onmousedown = oMax.onmousedown = oClose.onmousedown = function (event)
	{
		this.onfocus = function () {this.blur()};
		(event || window.event).cancelBubble = true	
	};
}
/*-------------------------- +
  ¸Ä±ä´óÐ¡º¯Êý
 +-------------------------- */
function resize(oParent, handle, isLeft, isTop, lockX, lockY,isResize)
{
	if(isResize)
	{
		handle.onmousedown = function (event)
		{
			var event = event || window.event;
			var disX = event.clientX - handle.offsetLeft;
			var disY = event.clientY - handle.offsetTop;	
			var iParentTop = oParent.offsetTop;
			var iParentLeft = oParent.offsetLeft;
			var iParentWidth = oParent.offsetWidth;
			var iParentHeight = oParent.offsetHeight;
			
			document.onmousemove = function (event)
			{
				var event = event || window.event;
				
				var iL = event.clientX - disX;
				var iT = event.clientY - disY;
				var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;
				var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;			
				var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
				var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;
				
				isLeft && (oParent.style.left = iParentLeft + iL + "px");
				isTop && (oParent.style.top = iParentTop + iT + "px");
				
				iW < dragMinWidth && (iW = dragMinWidth);
				iW > maxW && (iW = maxW);
				lockX || (oParent.style.width = iW + "px");
				
				
				iH < dragMinHeight && (iH = dragMinHeight);
				iH > maxH && (iH = maxH);
				lockY || (oParent.style.height = iH + "px");
				$(oParent).find(".content")[0].style.height = (iH-50)+"px";

				if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;
				
				return false;	
			};
			document.onmouseup = function ()
			{
				document.onmousemove = null;
				document.onmouseup = null;
			};
			return false;
		}
	}
};

function openWin(nW,nH,id,bol)
{
	var oDrag = document.getElementById(id);
	oDrag.style.width = nW + "px";
	oDrag.style.height= nH +"px";
	oDrag.style.display = "";
	 $(oDrag).find('.content')[0].style.height = (nH - 50)+"px";
	var oTitle = get.byClass("title", oDrag)[0];
	var oL = get.byClass("resizeL", oDrag)[0];
	var oT = get.byClass("resizeT", oDrag)[0];
	var oR = get.byClass("resizeR", oDrag)[0];
	var oB = get.byClass("resizeB", oDrag)[0];
	var oLT = get.byClass("resizeLT", oDrag)[0];
	var oTR = get.byClass("resizeTR", oDrag)[0];
	var oBR = get.byClass("resizeBR", oDrag)[0];
	var oLB = get.byClass("resizeLB", oDrag)[0];
	
	drag(oDrag, oTitle);
	//ËÄ½Ç
	resize(oDrag, oLT, true, true, false, false,false);
	resize(oDrag, oTR, false, true, false, false,false);
	resize(oDrag, oBR, false, false, false, false,false);
	resize(oDrag, oLB, true, false, false, false,false);
	//ËÄ±ß
	resize(oDrag, oL, true, false, false, true,false);
	resize(oDrag, oT, false, true, true, false,false);
	resize(oDrag, oR, false, false, false, true,false);
	resize(oDrag, oB, false, false, true, false,false);
	if(bol)startCovered(oDrag);
	
	currPopDiv = oDrag;
	
}
var currPopDiv;


	function startCovered(oDrag){
		//var documentWidth = $(document).width();  
		//var documentHeight = $(document).height();  
		//var coveredCss = 'position:absolute;';  
		var coveredCss = 'position:absolute;';  
		coveredCss += 'top:0px;';  
		coveredCss += 'left:0px;';  
		coveredCss += 'z-index:100;';  
		//alert($(document).scrollTop());
		
		if($(oDrag).parent()[0] == document.body)
		{
			coveredCss += 'width:' + (parseInt($(window).width())+parseInt($(document).scrollLeft())) + 'px;';  
			coveredCss += 'height:' + (parseInt($(window).height())+parseInt($(document).scrollTop())) + 'px;';  
		}
		else
		{
			coveredCss += 'width:' + $(oDrag).parent().width() + 'px;';  
			coveredCss += 'height:' + $(oDrag).parent().height() + 'px;';  
		}

		
		coveredCss += 'background-color:#000;';  
		coveredCss += 'filter:alpha(opacity=50);';  
		coveredCss += '-moz-opacity:0.5;';  
		coveredCss += 'opacity: 0.5;';  
		  
		var coverFloor = '<div style="' + coveredCss + '" id="coveredDIV" name="coveredDIV"></div>';  
		$(oDrag).parent().append(coverFloor);  
		$(window).resize(function() {
			if(oDrag != null)
			{
				if(oDrag.style.display != "none")
				{
					endCovered();
					startCovered(oDrag);
				}
			}
		});
	}  
	function endCovered(){  
		if($("#coveredDIV") != null)
			$("#coveredDIV").remove();  
	}  