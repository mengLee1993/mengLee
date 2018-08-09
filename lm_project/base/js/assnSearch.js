        /*************通过输入字符过滤**************/
        /************规则：1.所有都是字母***********/
        /************规则：2.包含汉字***************/
        /*******************结束********************/
        function filterLi() {
            var oTarget = $(".box_ul")[0];
            var oSelf = $("#skuCode")[0];
            if (oSelf.value != "") {
                if (isChinese(oSelf.value))	//包含汉字
                {
                    for (var nI = 0; nI < $getChild(oTarget).length; nI++) {
                        var oLi = $getChild(oTarget)[nI];
                        var transString = $(oLi).find(".box_ul_p1").attr("goodsItemName");

                        if (transString.indexOf(oSelf.value.toUpperCase()) != -1) {
                            var nIdx = transString.indexOf(oSelf.value.toUpperCase());
                            var nStart = nIdx;
                            var nEnd = nIdx + oSelf.value.length;
                            var strNew = transString.substring(0, nStart) + "<font color='red'>" + transString.substring(nStart, nEnd) + "</font>" + transString.substring(nEnd, transString.length);
                            //strNew;
                            $(oLi).find(".box_ul_p1").html(strNew);
                            //$subNode(oLi, "selectSpan").innerHTML = strNew;
                            oLi.style.display = "";
                        }
                        else {
                            $(oLi).find(".box_ul_p1").html(strNew);
                            //$subNode(oLi, "selectSpan").innerHTML = oLi.jsonData.dictTreeName;
                            oLi.style.display = "none";
                        }
                    }
                }
                else						//不包含汉字
                {
                    //如果全部字母
                    for (var nI = 0; nI < $getChild(oTarget).length; nI++) {
                        var oLi = $getChild(oTarget)[nI];
                        var transString = t($(oLi).find(".box_ul_p1").attr("goodsItemName"));

                        if (transString.indexOf(oSelf.value.toUpperCase()) != -1) {
                            var nIdx = transString.indexOf(oSelf.value.toUpperCase());
                            var nStart = nIdx;
                            var nEnd = nIdx + oSelf.value.length;
                            var strNew = $(oLi).find(".box_ul_p1").attr("goodsItemName").substring(0, nStart) + "<font color='red'>" + $(oLi).find(".box_ul_p1").attr("goodsItemName").substring(nStart, nEnd) + "</font>" + $(oLi).find(".box_ul_p1").attr("goodsItemName").substring(nEnd, $(oLi).find(".box_ul_p1").attr("goodsItemName").length);
                            //strNew;
                            $(oLi).find(".box_ul_p1").html(strNew);
                            //$subNode(oLi, "selectSpan").innerHTML = strNew;
                            oLi.style.display = "";
                        }
                        else {
                            $(oLi).find(".box_ul_p1").html($(oLi).find(".box_ul_p1").attr("goodsItemName"));
                            //$subNode(oLi, "selectSpan").innerHTML = oLi.jsonData.dictTreeName;
                            oLi.style.display = "none";
                        }
                    }

                }
            }
            else {
                for (var nI = 0; nI < $getChild(oTarget).length; nI++) {
                    var oLi = $getChild(oTarget)[nI];
                    $(oLi).find(".box_ul_p1").text($(oLi).find(".box_ul_p1").attr("goodsItemName"));
                    //$subNode(oLi, "selectSpan").innerHTML = oLi.jsonData.dictTreeName;
                    oLi.style.display = "";
                    if(nI>nShowNum)
                        oLi.style.display = "none";
                }
            }
        }

        //是否包含汉字,true:包含,false:不包含
        function isChinese(strValue) {
            var reg = new RegExp("[\u4e00-\u9fa5]");
            return reg.test(strValue);
        }