function clsTable()
		{
			this.oTable		= null;
			this.jsonData	= null;
			this.init		= clsTable$init;
			this.parseData	= clsTable$parseData;
			this.cssTable	= clsTable$cssTable;
			this.refreshData= clsTable$refreshData;
		}

		function clsTable$init()
		{
			if(this.oTable != null)
			{
				var templateRow = this.oTable.rows[this.oTable.rows.length-1];
				for (var nI=0;nI<this.jsonData.length ; nI++)
				{
					
					var oCloneRow	= templateRow.cloneNode(true);
					var jsonDataRow = this.jsonData[nI].data;
					oCloneRow.setAttribute("rowType","dataRow");
					oCloneRow.setAttribute("rowData",jsonDataRow);
					oCloneRow		= this.parseData(jsonDataRow,oCloneRow);
					oCloneRow.style.display = "";
					templateRow.parentNode.insertBefore(oCloneRow,templateRow);
				}
				this.cssTable();
			}
			return false;
		}

		function clsTable$parseData(jsonDataRow,oCloneRow)
		{
			for(var nI=0; nI<jsonDataRow.length; nI++)
			{
				var objTarget = $subNode(oCloneRow, jsonDataRow[nI].id);
				if(objTarget != null && objTarget.tagName != null)
				{
					switch(objTarget.tagName.toUpperCase())
					{
						case "TD":
							objTarget.innerHTML = jsonDataRow[nI].value;
							break;
						case "A":
							objTarget.innerHTML = jsonDataRow[nI].value;
							objTarget.href		= jsonDataRow[nI].href;
							break;
						default:
							break;
					}
				}
			}
			return oCloneRow;
		}

		function clsTable$cssTable()
		{
			for(var nI=1; nI<this.oTable.rows.length-1; nI++)
			{
				
				if(nI % 2 == 0)
				{
					var oRow = this.oTable.rows[nI];
					oRow.className = "oddTr";
				}
					
				
			}
		}

		function clsTable$refreshData()
		{
			for(var nI=this.oTable.rows.length-1; nI>=0; nI--)
			{
				var oRow = this.oTable.rows[nI];
				if(oRow.getAttribute("rowType") == "dataRow")
					this.oTable.deleteRow(nI);
			}
			this.init();
		}