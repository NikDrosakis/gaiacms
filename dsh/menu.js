/*updated:2020-01-29 20:20:34 menu - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
		/*
		 parameters for all the form
		 declare vars
		 */
		var menu_obj = {
			adata: 'manage',
			fetch: "SELECT * FROM menu",
			query:"UPDATE post SET $row=? WHERE id="+GS.id,
			form: {
				1: {type: "text", row: "title", key: 'key', global: ''},
				2: {type: "drop", row: "orient", alias: "Orientation", key: 'key', global: GS.orient},
				3: {type: "drop", row: "status", key: 'key', global: GS.status},
				4: {type: "drop", row: "style", key: '', global: GS.menu_styles}
			}
		};
		var links_obj = {
			adata: 'links',
			fetch: "SELECT * FROM links",
			query:"UPDATE post SET $row=? WHERE id="+GS.id,
			form: {
				1: {type: "text", row: "title",key: 'key'},
				2: {type: "text", row: "link", key: 'key'},
				5: {type: "number", row: "sort", key: 'key'}
			}
		};
		//make sortable
		g.ui.sortable("UPDATE links SET sort=? WHERE id=?","li");
//edit menulink
		$(document).on("keyup","input[id^='title"+GS.langprefix+"_'],input[id^='uri_']",function(){
			var exp= g.explode('_',this.id);
			var val= this.value;
			g.l("UPDATE links SET "+exp[0]+"='"+val+"' WHERE id="+exp[2]);
			g.db.query("UPDATE links SET "+exp[0]+"='"+val+"' WHERE id="+exp[2],function(data){
				if(data!='No'){
					if(exp[0]=='title'+GS.langprefix) {
						$('#menuals' + exp[1]+"_"+exp[2]).text(val);
					}else {
						$('#menulink' + exp[1]+"_"+exp[2]).text(val)
					}
				}
			});
		})
//edit menutitle
		$(document)
			.on("keyup","input[id^='mealias_']",function(){
				var exp= g.explode('_',this.id);
				var val= this.value;
				g.l("UPDATE menu SET title"+GS.langprefix+"='"+val+"' WHERE id="+exp[1]);
				g.db.query("UPDATE menu SET title"+GS.langprefix+"='"+val+"' WHERE id="+exp[1],function(data){
					if(data!='No'){
						$('#malias_' + exp[1]).text(val);
					}
				});
			})
			
			
			/************************
			NEW MENU 
			*************************/
			.on("change","select[id^='subnewmenu1']",function(){
				var menuid= this.id.replace('subnewmenu1','');
				$('#newmenupage'+menuid).val(this.value);				
			})
			.on("change","select[id^='subnewmenu2']",function(){
				var menuid= this.id.replace('subnewmenu2','');
				$('#newmenumode'+menuid).val(this.value);				
			})
			.on("change","select[id^='newmenuselector']",function(){
				var menuid= this.id.replace('newmenuselector','');
				//if TAX 
				if(this.value=="tax" || this.value=="post" || this.value=="user"){
					var newo=GS[this.value+'_uri'];
					var newohtml="<option>Select</option>";for(var o in newo){newohtml+='<option value="'+newo[o]+'">'+newo[o]+'</option>';}
					$('#newmenupage'+menuid).val(this.value);
					$('#subnewmenu2'+menuid).append(newohtml).css("display","block");														
				
				//if STATIC 
				}else if(this.value.indexOf(',') > -1){
				var newo=this.value.split(',');
				var newohtml="<option>Select</option>";for(var o in newo){newohtml+='<option value="'+newo[o]+'">'+newo[o]+'</option>';}
					$('#subnewmenu1'+menuid).append(newohtml).css("display","block");
					$('#newmenupage'+menuid).val('');
					$('#subnewmenu2'+menuid).css("display","none");
			}else{
			$('#newmenupage'+menuid).val(this.value);
			$('#subnewmenu1'+menuid).css("display","none");
			$('#subnewmenu2'+menuid).css("display","none");
			}
			this.value=0; 
		  })	  
			.on("click","button[id^='savenewmenu']",function() {
				var menuid= this.id.replace('savenewmenu','');
				var input1= $('#newmenupage'+menuid).val().trim();
				var input2= $('#newmenumode'+menuid).val().trim();
				var title= $('#newmenutitle'+menuid).val().trim();
				var uri=input1+(input2!=''? "/"+input2:'');
				var query= "INSERT INTO links (menuid,title"+GS.langprefix+",uri,sort) VALUES("+menuid+",'"+title+"','"+uri+"',0)";
//				g.l(query)
				g.db.query(query,function(data){
					location.reload();
				});
			})
			//new uri from custom page
			// .on("change","select[id^='newcustombtn']",function() {
			// 	var menuid= this.id.replace('newcustombtn','');
			// 	var id= this.value;
			// 	var query= "UPDATE page SET menuid="+menuid+",status=1 WHERE id="+id;
			// 	g.db.func("query",query,function(){location.reload();});
			// })
			//del uri
			.on("click","button[id^='delmenu']",function() {
				var id= this.id.replace('delmenu','');
				g.db.query("DELETE FROM menu WHERE id="+id,function(){$('#mBox'+id).hide();});
			})
			.on("click","button[id^='delink']",function() {
				var menu= g.explode('_',this.id)[1];
				var id= g.explode('_',this.id)[2];
								g.db.query("DELETE FROM links WHERE id="+id,function(){$('.menuBox'+id).remove();});
								$('#nodorder'+menu+'_'+id).hide();
			})