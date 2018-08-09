function clsSelectCtrl()
		{
			this.jsonData	= null;
			this.parentCtrl = null;
			this.asyncPath	= null;
			this.asyncParam = null;
			this.init		= clsSelectCtrl$init;
			this.parse		= clsSelectCtrl$parse;
			this.clearUnionSelCtrl	= clsSelectCtrl$clearUnionSelCtrl;
		}

		function clsSelectCtrl$init()
		{
			if(this.jsonData != null)
			{
				var ctrlId			= this.jsonData.id;
				var jsonDataSelect	= this.jsonData.data;
				if(this.parentCtrl == null)
					var obj	= document.getElementById(ctrlId);
				else
					var obj = $subNode(this.parentCtrl, ctrlId);
				
				if(obj != null)
				{
					$addEvent(obj, "onchange", function(event){
						var obj		= new clsSelectCtrl();
						//如果全部加载数据
						obj.jsonData= $event(event).options[$event(event).selectedIndex].domNode;
						//如果异步加载数据
						//obj.jsonData= JSON.parse($xmlSend(this.asyncPath,this.asyncParam));
						obj.clearUnionSelCtrl($event(event).getAttribute("unionSel"));
						obj.init();
					});
					obj.innerHTML		= "";
					$addoOption(obj,"","请选择","");
					for(var nI=0; nI<jsonDataSelect.length; nI++)
					{
						var jsonItem = jsonDataSelect[nI];
						var strText 	= jsonItem.text;
						var strValue	= jsonItem.value;
						$addoOption(obj,strValue,strText,null,null,null,null,jsonItem);
					}
				}
			}
		}

		function clsSelectCtrl$parse(jsonData)
		{
			if(jsonData != null)
			{
				var ctrlId = jsonData.id;

			}
		}

		function clsSelectCtrl$clearUnionSelCtrl(unionSel)
		{
			if(unionSel != null)
			{
				for(var nI=0; nI<unionSel.split(",").length; nI++)
				{
					var ctrlId = unionSel.split(",")[nI];
					if(ctrlId != null)
					{
						if(this.parentCtrl == null)
							var obj	= document.getElementById(ctrlId);
						else
							var obj = $subNode(this.parentCtrl, ctrlId);
						obj.innerHTML ="";
						$addoOption(obj,"","请选择","");
					}
					
				}
			}
		}