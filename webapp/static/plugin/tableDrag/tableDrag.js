$(function(){
    $("#tableSort")[0].data = {"rspBody":{"resultData":[{},{},{}]}};
    $("#tableSort").attr("comType","standardTableCtrl");
    document.body.jsCtrl.ctrl = $("#tableSort")[0];
    document.body.jsCtrl.init();
    for(var i=0;i<$("*[dragTable]").length;i++){
        var tableDragF=new tableDrag();
        tableDragF.ctrl=$("*[dragTable]")[i];
        var boxCtrl=$($("*[dragTable]")[i]).attr("boxCtrl");
        tableDragF.boxCtrl=document.getElementById(boxCtrl);
        var cardCtrl=$($("*[dragTable]")[i]).attr("parentCtrlDrag");
        tableDragF.parentCtrl=document.getElementById(cardCtrl);
        tableDragF.init();
    }
})
function tableDrag(){
    this.ctrl=null;                 //当前table
    this.parentCtrl=null;           //table父集
    this.boxCtrl=null;              //拖动出现的效果
    this.dragSort=null;             //localStorage的数据
    this.isAjax=1;
    this.isSort=1;
    this.init=tableDrag$init;       //初始化方法
    this.initAlfet=tableDrag$initAlfet; //初始化之前
    this.create=tableDrag$create;   //css的创建方法
    this.parse=tableDrag$parse;
    this.after=tableDrag$after;
}
function tableDrag$initAlfet(){
    //初始化的时候给table的th的加入indexDrag属性，方便排序
    for(var i=0;i<$(this.ctrl).find("th").length;i++){
        $($(this.ctrl).find("th")[i]).attr("indexDrag",i);
    }
    var that=this;
    if(Number(this.isAjax)==1){
        $.ajax({
            url:requestUrl+ "/table-custom-layout/find",
            type: "post",
            async: false,
            cache: false,
            data: JSON.stringify({"reqBody":{"pageCode":window.location.pathname}}),
            dataType: 'text',
            contentType: 'application/json',
            success: function (data)
            {
                var jsonData = JSON.parse(data);
                if(jsonData.retCode == "0000000")
                {
                    that.dragSort=JSON.parse(jsonData.rspBody.descJson);
                    $(that.ctrl).attr("dragSid",jsonData.rspBody.sid);
                }
            }
        })
    }else{
        if(!window.localStorage.dragSort){
            var jsonData={};
            jsonData[window.location.pathname]=[];
            window.localStorage.dragSort=JSON.stringify(jsonData);
        }else{
            var jsonData=JSON.parse(window.localStorage.dragSort);
            that.dragSort=jsonData[window.location.pathname];
        }
        // for()
    }

    //本次存储是否有dragSort如果没有创建一个 数据格式 {"ip":[{"id":"","jsonItem":[]}]}
    if(!that.dragSort){
        var jsonData=[];
        that.dragSort=jsonData;
    }else{
        //把字符串json转为数组
        // var jsonData=that.dragSort;
        //判断本地存储是否有当前页面的JSON
        // if(jsonData[window.location.pathname]){
        var jsonArr=that.dragSort;
        if(jsonArr.length){
            var jsonDargTable;
            //当前的JSON是不是当前id的数据
            for(var s=0;s<jsonArr.length;s++){
                if(jsonArr[s].id==this.ctrl.id){
                    jsonDargTable=jsonArr[s].jsonItem;
                }
            }
            if(jsonDargTable){
                if(jsonDargTable.length){
                    var that=this;
                    //先把table存下来
                    var cloneTable=$(this.ctrl).clone(true)[0];
                    //循环当前本地存储的数据 如果旧的和新的不是一样的时候用before去替换
                    for(var j=0;j<jsonDargTable.length;j++){
                        var dragSort=jsonDargTable[j];
                        var thIndex=dragSort.indexDrag;
                        var indexDragEdit=dragSort.indexDragEdit;
                        if(thIndex!=indexDragEdit){
                            $(this.ctrl).find("tr").each(function (i) {
                                if(i==0){ //如果为0的时候是th
                                    $($($(that.ctrl).find("tr")[i]).find("th")[indexDragEdit]).before($($($(cloneTable).find("tr")[i]).find("th")[thIndex]).clone(true));
                                    $($($(that.ctrl).find("tr")[i]).find("th")[indexDragEdit+1]).remove();
                                }else{
                                    $($($(that.ctrl).find("tr")[i]).find("td")[indexDragEdit]).before($($($(cloneTable).find("tr")[i]).find("td")[thIndex]).clone(true));
                                    $($($(that.ctrl).find("tr")[i]).find("td")[indexDragEdit+1]).remove();
                                }
                            })
                        }
                    }
                }
            }
        }
    }
}
function tableDrag$init(){
    if($(this.ctrl).attr("isAjax")!=null){
        this.isAjax=$(this.ctrl).attr("isAjax");
    }
    if($(this.ctrl).attr("isSort")!=null){
        this.isSort=$(this.ctrl).attr("isSort");
    }
    this.initAlfet();
    this.create();
    this.parse();
}
function tableDrag$create(){
    var styleTag = document.createElement("link");
    styleTag.setAttribute('type', 'text/css');
    styleTag.setAttribute('rel', 'stylesheet');
    styleTag.setAttribute('href', "/static/plugin/tableDrag/columnDrag.css");
    $("head")[0].appendChild(styleTag);
}
function tableDrag$parse(){
    var that=this;
    var ochek = this.parentCtrl,
        otable = this.ctrl,
        oth = otable.getElementsByTagName("th"),
        box = this.boxCtrl,
        arrn = [];
    //所有的th都加上鼠标按下、移动、抬起事件
    for (var i = 0; i < oth.length; i++) {
        // if($(oth[i]).attr("isDrag")){
        //     continue;
        // }
        if(Number(this.isSort)==1){
            oth[i].onclick=function(){
                sortTable(that.ctrl,$(this).index());
            }
        }
        //先把th上面的鼠标事件先移除，再次给加上鼠标事件
        $(oth[i]).unbind("mousedown");
        oth[i].onmousedown = function (e) {
            if($(this).attr("isDrag")){
                return;
            }
            //当前的下标
            var startIndex = $(this).index();
            //拖动效果的Y轴位置
            box.style.top=getElementPos(that.ctrl).y+"px";
            var e = e || window.event,
                target = e.target || e.srcElement,
                //当前的width
                thW = target.offsetWidth,
                maxl = ochek.offsetWidth - thW,
                rows = otable.rows,
                ckL = ochek.offsetLeft,
                disX = e.pageX,
                thLeft=target.offsetLeft,
                _this = this,
                cdisX = e.clientX - ckL - disX;
            var widthTwo=thW/2
            for (var i = 0; i < rows.length; i++) {
                var op = document.createElement("p");
                op.innerHTML = rows[i].cells[this.cellIndex].innerHTML;
                box.appendChild(op);
            };
            for (var i = 0; i < oth.length; i++) {
                arrn.push(oth[i].offsetLeft);
            };

            box.style.width = thW + "px";
            box.style.left = disX + "px";
            //未完成 还有事件没写。
            document.onmousemove = function (e) {
                var e = e || window.event,
                    target = e.target || e.srcElement,
                    thW = target.offsetWidth;
                var moveBoll=true;
                box.style.left = e.clientX - ckL - cdisX-widthTwo + "px";
                box.style.display = "block";
                if (box.offsetLeft > maxl) {
                    box.style.left = maxl + "px";
                } else if (box.offsetLeft < 0) {
                    box.style.left = 0;
                }
                document.onselectstart = function () {
                    return false
                };
                window.getSelection ? window.getSelection().removeAllRanges() : doc.selection.empty();
            }
            document.onmouseup = function (e) {
                var e = e || window.event,
                    target = e.target || e.srcElement,
                    opr = box.getElementsByTagName("p");
                var ochekLeft = disX-e.pageX;
                // console.log(ochekLeft,disX);
                oboxl=thLeft+thW/2-ochekLeft;
                for (var i = 0; i < arrn.length; i++) {
                    if (arrn[i] < oboxl) {
                        var index = i;
                    }
                };
                if(!index){
                    if(oboxl<0){
                        var index = 0;
                    }
                }

                if(index<startIndex){
                    $(otable).find("tr").each(function (i) {
                        if(i==0){
                            $($($(otable).find("tr")[i]).find("th")[index]).before($($($(otable).find("tr")[i]).find("th")[startIndex]).clone(true));
                            $($($(otable).find("tr")[i]).find("th")[startIndex+1]).remove();
                            that.parse();
                        }else{
                            $($($(otable).find("tr")[i]).find("td")[index]).before($($($(otable).find("tr")[i]).find("td")[startIndex]).clone(true));
                            $($($(otable).find("tr")[i]).find("td")[startIndex+1]).remove();
                        }
                    })
                }else if(index>startIndex){
                    $(otable).find("tr").each(function (i) {
                        if(i==0){
                            $($($(otable).find("tr")[i]).find("th")[index]).after($($($(otable).find("tr")[i]).find("th")[startIndex]).clone(true));
                            $($($(otable).find("tr")[i]).find("th")[startIndex]).remove();
                            that.parse();
                        }else{
                            $($($(otable).find("tr")[i]).find("td")[index]).after($($($(otable).find("tr")[i]).find("td")[startIndex]).clone(true));
                            $($($(otable).find("tr")[i]).find("td")[startIndex]).remove();
                        }
                    })
                }
                box.innerHTML = "";
                arrn.splice(0, arrn.length);
                box.style.display = "none";
                document.onmousemove = null;
                document.onmouseup = null;
                document.onselectstart = function () {
                    return false
                };
                if(index==startIndex){
                    return;
                }else{
                    that.after();
                }

            }

        }
    }
}
function tableDrag$after() {
    var jsonData=[];
    for(var i=0;i<$(this.ctrl).find("th").length;i++){
        $($(this.ctrl).find("th")[i]).attr("indexDragEdit",i);
        jsonData.push({"indexDrag":$($(this.ctrl).find("th")[i]).attr("indexDrag"),"indexDragEdit":i});
    }
    // var dragJson=JSON.parse(window.localStorage.dragSort);
    var jsonCopyDrag=this.dragSort;
    // this.dragSort={"id":this.ctrl.id,jsonItem:jsonData};
    var bool=false;
    for(var j=0;j<jsonCopyDrag.length;j++){
        if(jsonCopyDrag[j].id==this.ctrl.id){
            bool=true;
            jsonCopyDrag[j].jsonItem=jsonData;
        }else{
            bool=false;
        }
    }
    if(bool==false){
        jsonCopyDrag.push({"id":this.ctrl.id,"jsonItem":jsonData});
    }
    var dragSid=$(this.ctrl).attr("dragSid")?$(this.ctrl).attr("dragSid"):"";
    var reqParam={"pageCode":window.location.pathname,"descJson":JSON.stringify(jsonCopyDrag),"sid":dragSid}
    if(Number(this.isAjax)==1){
        getAjaxResult("/table-custom-layout/saveData","post",reqParam,function(data){
            // var jsData=JSON.parse(data);
            // if(jsData.retCode=="0000000"){
            //
            // }
        })
    }else{
        var dragJson=JSON.parse(window.localStorage.dragSort);
        dragJson[window.location.pathname]=jsonCopyDrag;
        window.localStorage.dragSort=JSON.stringify(dragJson);
    }
}
function getElementPos(elementId){
    var ua = navigator.userAgent.toLowerCase();
    var isOpera = (ua.indexOf('opera') != -1);
    var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
    var el = elementId;
    if (el.parentNode === null || el.style.display == 'none') {
        return false;
    }
    var parent = null;
    var pos = [];
    var box;
    if (el.getBoundingClientRect) //IE
    {
        box = el.getBoundingClientRect();
        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        return {
            x: box.left + scrollLeft,
            y: box.top + scrollTop
        };
    }
    else
    if (document.getBoxObjectFor) // gecko
    {
        box = document.getBoxObjectFor(el);
        var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
        var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
        pos = [box.x - borderLeft, box.y - borderTop];
    }
    else // safari & opera
    {
        pos = [el.offsetLeft, el.offsetTop];
        parent = el.offsetParent;
        if (parent != el) {
            while (parent) {
                pos[0] += parent.offsetLeft;
                pos[1] += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }
        if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute'))
        {
            pos[0] -= document.body.offsetLeft;
            pos[1] -= document.body.offsetTop;
        }
    }
    if (el.parentNode) {
        parent = el.parentNode;
    }
    else {
        parent = null;
    }
    while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled
        pos[0] -= parent.scrollLeft;
        pos[1] -= parent.scrollTop;
        if (parent.parentNode) {
            parent = parent.parentNode;
        }
        else {
            parent = null;
        }
    }
    return {
        x: pos[0],
        y: pos[1]
    };
}
function sortTable(table, idx) {
    var otable = table,
        otody = otable.tBodies[0],
        // otr = otody.rows,
        tarr = [];
    // var otr=[];
    var cloneId=$(otable).attr("templateid").replace(/template/g, "clone") ;
    var sortCtrl=$(otable).find("*[id="+cloneId+"]");
    for(var j=0;j<sortCtrl.length;j++){
        tarr.push(sortCtrl[j]);
    }
    if (otody.sortCol == idx) {
        tarr.reverse();
    } else {
        tarr.sort(function (tr1, tr2) {
            var value1 = tr1.cells[idx].innerHTML;
            var value2 = tr2.cells[idx].innerHTML;
            if (!isNaN(value1) && !isNaN(value2)) {
                return value1 - value2;
            } else {
                return value1.localeCompare(value2);
            }
        })
    }
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < tarr.length; i++) {
        fragment.appendChild(tarr[i]);
    };
    otody.appendChild(fragment);
    otody.sortCol = idx;
    var sortCtrl=$(otable).find("*[id="+cloneId+"]");
    for(var j=0;j<sortCtrl.length;j++){
        if(j%2){
            $(sortCtrl[j]).addClass("table-list-even");
        }else{
            $(sortCtrl[j]).removeClass("table-list-even");
        }
    }
}