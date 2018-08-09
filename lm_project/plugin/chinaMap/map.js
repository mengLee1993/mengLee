/*!
 * SVG Map
 * @version v1.0.2
 * @author  Rocky(rockyuse@163.com)
 * @date    2014-01-16
 *
 * (c) 2012-2013 Rocky, http://sucaijiayuan.com
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */

;!function (win, $, undefined) {
	var SVGMap = (function () {
		function SVGMap(dom, options) {
			this.dom = dom;
			this.setOptions(options);
			this.render();
		}
		SVGMap.prototype.options = {
			mapName: 'china', /*名字*/
			mapWidth: 500,  /*地图宽度*/
			mapHeight: 400, /*地图高度*/
			stateColorList: ['2770B5', '429DD4', '5AABDA', '1C8DFF', '70B3DD', 'C6E1F4', 'EDF2F6'],
			stateDataAttr: ['stateInitColor', 'stateHoverColor', 'stateSelectedColor', 'baifenbi'],
			stateDataType: 'json',  /*自定义数据格式 json配合stateData，xml配合stateSettingsXmlPath*/
			stateSettingsXmlPath: '', /*xml路径，例'js/res/chinaMapSettings.xml' */
			stateData: {},   /*自定义数据*/

			strokeWidth: 1,
			strokeColor: 'F9FCFE',
			strokeHoverColor: 'd9d9d9',
			stateInitColor: '',
			stateHoverColor: 'ffffff',
			stateSelectedColor: 'E32F02',
			stateDisabledColor: 'eeeeee',

			showTip: true,   /*是否显示提示*/
			tipWidth: 140,
			tipHeight: 127,
			tipOuterH : 0,
			tipOuterW : 0,
			stateTipHtml: function (stateData, obj) {   /*返回数据function*/
				return obj.name;
			},

			hoverCallback: function (stateData, obj) {},  /*回调函数*/
			clickCallback: function (stateData, obj) {},
			external: false   /*定义外部事件   这里传入一个Object名称，之后基于这个对象设置属性或方法*/
		};

		SVGMap.prototype.setOptions = function (options) {
			if (options == null) {
				options = null;
			}
			this.options = $.extend({}, this.options, options);
			return this;
		};

		SVGMap.prototype.scaleRaphael = function (container, width, height) {
			var wrapper = document.getElementById(container);
			if (!wrapper.style.position) wrapper.style.position = "relative";
			wrapper.style.width = width + "px";
			wrapper.style.height = height + "px";
			//wrapper.style.overflow = "hidden";
			var nestedWrapper;
			if (Raphael.type == "VML") {
				wrapper.innerHTML = "<rvml:group style='position : absolute; width: 1000px; height: 1000px; top: 0px; left: 0px' coordsize='1000,1000' class='rvml' id='vmlgroup_" + container + "'><\/rvml:group>";
				nestedWrapper = document.getElementById("vmlgroup_" + container);
			} else {
				wrapper.innerHTML = '<div class="svggroup"></div>';
				nestedWrapper = wrapper.getElementsByClassName("svggroup")[0];
			}
			var paper = new Raphael(nestedWrapper, width, height);
			var vmlDiv;
			if (Raphael.type == "SVG") {
				paper.canvas.setAttribute("viewBox", "0 0 " + width + " " + height);
			} else {
				vmlDiv = wrapper.getElementsByTagName("div")[0];
			}
			paper.changeSize = function (w, h, center, clipping) {
				clipping = !clipping;
				var ratioW = w / width;
				var ratioH = h / height;
				var scale = ratioW < ratioH ? ratioW : ratioH;
				var newHeight = parseInt(height * scale);
				var newWidth = parseInt(width * scale);
				if (Raphael.type == "VML") {
					var txt = document.getElementsByTagName("textpath");
					for (var i in txt) {
						var curr = txt[i];
						if (curr.style) {
							if (!curr._fontSize) {
								var mod = curr.style.font.split("px");
								curr._fontSize = parseInt(mod[0]);
								curr._font = mod[1];
							}
							curr.style.font = curr._fontSize * scale + "px" + curr._font;
						}
					}
					var newSize;
					if (newWidth < newHeight) {
						newSize = newWidth * 1000 / width;
					} else {
						newSize = newHeight * 1000 / height;
					}
					newSize = parseInt(newSize);
					nestedWrapper.style.width = newSize + "px";
					nestedWrapper.style.height = newSize + "px";
					if (clipping) {
						nestedWrapper.style.left = parseInt((w - newWidth) / 2) + "px";
						nestedWrapper.style.top = parseInt((h - newHeight) / 2) + "px";
					}
					vmlDiv.style.overflow = "visible";
				}
				if (clipping) {
					newWidth = w;
					newHeight = h;
				}
				wrapper.style.width = newWidth + "px";
				wrapper.style.height = newHeight + "px";
				paper.setSize(newWidth, newHeight);
				if (center) {
					wrapper.style.position = "absolute";
					wrapper.style.left = parseInt((w - newWidth) / 2) + "px";
					wrapper.style.top = parseInt((h - newHeight) / 2) + "px";
				}
			};
			paper.scaleAll = function (amount) {
				paper.changeSize(width * amount, height * amount);
			};
			paper.changeSize(width, height);
			paper.w = width;
			paper.h = height;
			return paper;
		};
		SVGMap.prototype.render = function () {
			var opt = this.options,
				_self = this.dom,
				mapName = opt.mapName,
				mapConfig = eval(mapName + 'MapConfig');

			var stateData = {};

			if (opt.stateDataType == 'xml') {
				var mapSettings = opt.stateSettingsXmlPath;
				$.ajax({
					type: 'GET',
					url: mapSettings,
					async: false,
					dataType: $.browser.msie ? 'text' : 'xml',
					success: function (data) {
						var xml;
						if ($.browser.msie) {
							xml = new ActiveXObject('Microsoft.XMLDOM');
							xml.async = false;
							xml.loadXML(data);
						} else {
							xml = data;
						}
						var $xml = $(xml);
						$xml.find('stateData').each(function (i) {
							var $node = $(this),
								stateName = $node.attr('stateName');

							stateData[stateName] = {};
							// var attrs = $node[0].attributes;
							// alert(attrs);
							// for(var i in attrs){
							//     stateData[stateName][attrs[i].name] = attrs[i].value;
							// }
							for (var i = 0, len = opt.stateDataAttr.length; i < len; i++) {
								stateData[stateName][opt.stateDataAttr[i]] = $node.attr(opt.stateDataAttr[i]);
							}
						});
					}
				});
			} else {
				stateData = opt.stateData;
			}

			var offsetXY = function (obj) {
				var mouseX = $(obj.node).offset().left+$(obj.node).prev().outerWidth()/2, mouseY = $(obj.node).offset().top+$(obj.node).prev().outerHeight()/2;
				var tipWidth = opt.tipWidth,tipHeight = opt.tipHeight;
				var fangwei =obj.direction;
				var tipOuterH = opt.tipOuterH,tipOuterW = opt.tipOuterW;
				var tipTextLeft = 0,tipTextTop = 0;
				var dian00 = [],dian01 = [],dian02 = [],dian03 = [],dian04 = [],tipBox = [],tipConW = tipWidth,tipConH = tipHeight;
				var x = $('.itemCon #ChinaMap').offset().left;
				var y = $('.itemCon #ChinaMap').offset().top;
				if(fangwei == 'left'||fangwei == 'right'){
					tipConW = tipWidth + tipOuterW;
					tipConH = tipHeight;
					mouseY = mouseY - tipConH/2-y;
					if(fangwei == 'left'){
						mouseX = mouseX - tipConW - x;
						dian00 = [tipConW,tipConH/2];
						dian01 = [0,0];
						dian02 = [tipWidth,0];
						dian03 = [0,tipConH];
						dian04 = [tipWidth,tipConH];
					}else{
						mouseX = mouseX - x;
						//tipTextLeft = tipOuterW;
						dian00 = [0,tipConH/2];
						dian01 = [tipConW,0];
						dian02 = [tipOuterW,0];
						dian03 = [tipConW,tipConH];
						dian04 = [tipOuterW,tipConH];
					}
				}else{
					tipConW = tipWidth;
					tipConH = tipHeight + tipOuterH;
					if(fangwei == 'top'){
						mouseX = mouseX - tipConW/2 - x;
						mouseY = mouseY - tipConH - 10 - y;
						dian00 = [tipConW/2,tipConH];
						dian01 = [0,0];
						dian02 = [0,tipHeight];
						dian03 = [tipConW,0];
						dian04 = [tipConW,tipHeight];
					}else{
						tipTextTop = tipOuterH;
						mouseX = mouseX - tipConW/2 - x;
						mouseY = mouseY + 10 - y;
						dian00 = [tipConW/2,0];
						dian01 = [0,tipConH];
						dian02 = [0,tipOuterH];
						dian03 = [tipConW,tipConH];
						dian04 = [tipConW,tipOuterH];
					}
				}
				// var paperTip01 = Raphael('stateTip',tipConW, tipConH);
				// paperTip01.path('M'+dian00[0]+','+dian00[1]+'L'+dian02[0]+","+dian02[1]+'L'+dian04[0]+','+dian04[1]+'Z').attr({
				// 	fill : '#e9e9e9',
				// 	opacity : 0.4,
				// 	stroke : '#e9e9e9'
				// });
				// paperTip01.path('M'+dian00[0]+','+dian00[1]+'L'+dian02[0]+","+dian02[1]+'L'+dian01[0]+','+dian01[1]+'Z').attr({
				// 	fill : '#aaaaaa',
				// 	opacity : 0.4,
				// 	stroke : '#aaaaaa'
				// });
				// paperTip01.path('M'+dian00[0]+','+dian00[1]+'L'+dian01[0]+","+dian01[1]+'L'+dian03[0]+','+dian03[1]+'Z').attr({
				// 	fill : '#c9c8c8',
				// 	opacity : 0.4,
				// 	stroke : '#c9c8c8'
				// });
				// paperTip01.path('M'+dian00[0]+','+dian00[1]+'L'+dian03[0]+","+dian03[1]+'L'+dian04[0]+','+dian04[1]+'Z').attr({
				// 	fill : '#d7d6d6',
				// 	opacity : 0.4,
				// 	stroke : '#d7d6d6'
				// });
				return [mouseX,mouseY,tipTextLeft,tipTextTop];
			};

			var r = this.scaleRaphael(_self.attr('id'), mapConfig.width, mapConfig.height),
				attributes = {
					cursor: 'pointer',
					stroke: '#' + opt.strokeColor,
					'stroke-width': opt.strokeWidth,
					'stroke-linejoin': 'round'
				};

			var stateColor = {},objHover;

			for (var state in mapConfig.shapes) {
				var thisStateData = stateData[state],
					initColor = '#' + (thisStateData && opt.stateColorList[thisStateData.stateInitColor] || opt.stateInitColor||mapConfig['names'][state]['color']),
					hoverColor = '#' + (thisStateData && thisStateData.stateHoverColor || opt.stateHoverColor),
					selectedColor = '#' + (thisStateData && thisStateData.stateSelectedColor || opt.stateSelectedColor),
					disabledColor = '#' + (thisStateData && thisStateData.stateDisabledColor || opt.stateDisabledColor);

				stateColor[state] = {};

				stateColor[state].initColor = initColor;
				stateColor[state].hoverColor = hoverColor;
				stateColor[state].selectedColor = selectedColor;

				var obj = r.path(mapConfig['shapes'][state]);
				obj.id = state;
				obj.name = mapConfig['names'][state]['name'];
				obj.attr(attributes);
				obj.attr({fill: initColor});
				var offsetX =obj.getBBox().x+mapConfig['names'][state]['x'], offsetY =obj.getBBox().y+mapConfig['names'][state]['y'];
				var font = r.text(offsetX,offsetY,obj.name).attr({cursor: 'pointer','metadata' : {mapId: 1 }});
				obj.font = font;
				font.obj = obj;
				font.direction = mapConfig['names'][state]['direction'];
				font.mapId = obj.mapId = mapConfig['names'][state]['id'];
				if (opt.external) {
					opt.external[obj.id] = obj;
				}
				if (stateData[state] && stateData[state].diabled) {
					obj.attr({
						fill: disabledColor,
						cursor: 'default'
					});
				} else {
					obj.attr({
						fill: initColor
					});
					objHover =obj;

					//新加
					addData = mapConfig;


					obj.mousemove(function(){
						objHover.attr({
							fill: stateColor[objHover.id].initColor,
							stroke: '#' + opt.strokeColor
						});
						objHover = this;
						this.attr({
							fill: stateColor[this.id].hoverColor,
							stroke: '#' + opt.strokeHoverColor
						});

						//$('#mapTipContent dl').removeClass();
						//$('#mapTipContent dl').addClass('mapTipText'+this.mapId);
						if (opt.showTip) {//&&($('.mapTipText.mapTipText'+ this.mapId).length)
							$('#stateTip').empty();
							var _offsetXY = new offsetXY(this.font);
							$('#stateTip').stop(false,true).animate({
								left:_offsetXY[0],
								top: _offsetXY[1],
								display : 'inline'
							},100).show().append('<div id="mapTipContainer"></div>');
							console.log();
							$("#mapTipContainer").css({
								position : "absolute",
								left : _offsetXY[2],
								top :  _offsetXY[3]
							});
							var showData = addData['names'][this.id]['resultInfo']
							$('#mapTipContent dl').clone().appendTo('#stateTip')
                            $('#stateTip dl dt:first').html("共计"+showData.number+"家超市");
                            $('#stateTip dl dd:first').find('p').eq(1).html(showData.list.hasDistribution+'家');
                            $('#stateTip dl dd').eq(1).find('p').eq(1).html(showData.list.applying+'家');
                            $('#stateTip dl dd').eq(2).find('p').eq(1).html(showData.list.kind+'家');
							//$('.mapTipText.mapTipText'+ this.mapId).clone().appendTo('#mapTipContainer');
						}else{
							$('#stateTip').empty();
						}
					});
					// font.mousemove(function(){
					// 	objHover.attr({
					// 		fill: stateColor[objHover.id].initColor,
					// 		stroke: '#' + opt.strokeColor
					// 	});
					// 	objHover = this.obj;
					// 	this.obj.attr({
					// 		fill: stateColor[this.obj.id].hoverColor,
					// 		stroke: '#' + opt.strokeHoverColor
					// 	});
					// 	if (opt.showTip&&($('.mapTipText.mapTipText'+ this.mapId).length)) {
					// 		$('#stateTip').empty();
					// 		var _offsetXY = new offsetXY(this);
					// 		$('#stateTip').stop(false,true).animate({
					// 			left:_offsetXY[0],
					// 			top: _offsetXY[1],
					// 			display : 'inline'
					// 		},100).show().append('<div id="mapTipContainer"></div>');
					// 		console.log();
					// 		$("#mapTipContainer").css({
					// 			position : "absolute",
					// 			left : _offsetXY[2],
					// 			top :  _offsetXY[3]
					// 		});
					// 		$('.mapTipText.mapTipText'+this.mapId).clone().appendTo('#mapTipContainer');
					// 	}else{
					// 		$('#stateTip').empty();
					// 	}
					// });
				}
				r.changeSize(opt.mapWidth, opt.mapHeight, false, false);
			}
			$("body").mousemove(function(e){
				var _svg = _self;
				if(e.pageX<_svg.offset().left|| e.pageX>(_svg.offset().left+_svg.innerWidth())||
					e.pageY<_svg.offset().top|| e.pageY>(_svg.offset().top+_svg.innerHeight())){
					objHover.attr({
						fill: stateColor[objHover.id].initColor,
						stroke: '#' + opt.strokeColor
					});
					$('#stateTip').empty();
				}
			});
		};
		return SVGMap;
	})();

	$.fn.SVGMap = function (opts) {
		var $this = $(this),
			data = $this.data();

		if (data.SVGMap) {
			delete data.SVGMap;
		}
		if (opts !== false) {
			data.SVGMap = new SVGMap($this, opts);
		}
		return data.SVGMap;
	};
}(window, jQuery);
