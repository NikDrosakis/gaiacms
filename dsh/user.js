/*updated:2020-01-29 20:20:34 user - v.0.73 - Author:Nikos Drosakis - License: GPL License*/

/*
@user Page Javascript-- Dashboard
developed by Nikos Drosakis
*/
 $('.wysiwyg').summernote();
 
$(document).ready(function() {
//set new post group

	/*********************************************
	 * TOP BUTTONS
	 ***********************************************/
	$("#newuserbtn").click(function(){location.href='/dsh/user?sub=new';})
	$("#groups").click(function(){location.href='/dsh/user?sub=groups';})

/*	$("#newgroupsbtn").click(function(){
		if(!$('#submitnewusergrp').html()) {
			$("<input class='form-control' placeholder='New usergroup name' id='newusergrp'><button class='btn btn-success' id='submitnewusergrp'>Create</button>").insertAfter(this)
		}else{
			$("#newusergrp").remove();
			$("#submitnewusergrp").remove();
		}
	})
	$(document).on('click',"#submitnewusergrp",function(){
		var grpname= $('#newusergrp').val().trim();
		if(grpname!=""){
			g.db.query('INSERT INTO usergrp (name) VALUES("'+grpname+'")',function(){
				location.reload();
			});
		}else{
			g.ui.notify('danger','Please insert a usergroup name.')
		}
	})
*/
	/*********************************************
	 * USER EDIT
	 ***********************************************/
if(GS.uid!=""){
	var table= 'user';

	$(document).on('keyup', "#name,#url,#mail,#tel,#firstname,#lastname,#title,#seodescription", function () {
		if (this.id == 'name') {
			$('#name').text(this.value)
		}		
		var value=this.value.trim();
		g.db.query("UPDATE user SET "+this.id+"='"+value+"' WHERE id="+GS.uid);
	})
	.on('change', "#status,#grp,#seopriority", function () {
		g.db.queryone(table, this, GS.uid);
	})
	.on('click', "#submit_content", function () {
		//var obj = {};
		//obj.id = this.id.replace('submit_', '');
		//obj.uid = GS.uid;		
		//obj.value = "content='"+$('#' + obj.id).summernote('code')+"'";
        //obj.table = "user";
        //obj.where= "id="+GS.uid;
		//g.db.queryhtml(obj, function(data){g.ui.notify('alert',obj.id+' updated!');},"POST");		
		var row =this.id.replace('submit_', '');
		var value=$('#' + row).summernote('code');
		 g.db.query("UPDATE user SET "+row+"='"+value+"' WHERE id="+GS.uid, function(data){g.l(data);});
	})

		
	//uploader
	var objgroup=3; //user	
        g.media.uploader(GS.mode, objgroup, GS.uid,function(data){g.l(data)});


}else if(GS.sub=='new'){
	/*********************************************
	 * USER NEW
	 ***********************************************/
//greeklish (sql name is set as unique)
	$(document).on('keyup', "#name", function () {
		this.value=g.greeklish(this.value)
	})	
	$(document).on('click', "#submit_user", function () {
		var formid=$("#form_user");
		event.preventDefault();
		var form = formid.serializeArray();
		form[g.size(form)]={name:'registered',value: g.phptimestamp()}
		form[g.size(form)]={name:'modified',value: g.phptimestamp()}
		g.l(form)
		$.post(g.ajaxfile, form, function (data, textStatus, jqXHR) {
			g.l(data)
			if (data == 'no') {
				g.l(textStatus)
				g.l(jqXHR)
				g.ui.notify("danger","Form cannot be submitted or username exists.");
			} else {
				// g.l(data)
				location.href="/dsh/user?uid="+data;
				// formid.reset();
			}
		},'json');
	})

}else if(GS.sub=='groups'){
	/*********************************************
	 * USER groups
	 ***********************************************/
	$(document).on("click","input[id^='per']",function(){
		var e=g.explode('-',this.id),
		id= e[1],
		page= e[2];
		
	if(!$(this).is(':checked')){		
		g.db.query("UPDATE usergrp SET permissions= JSON_REMOVE(permissions, REPLACE(JSON_SEARCH(permissions, 'one', '"+page+"'),\'\"','')) WHERE id="+id,function(data){g.l(data)});
	}else{
		g.db.query("UPDATE usergrp SET permissions= JSON_ARRAY_APPEND(permissions, '$', '"+page+"') WHERE id="+id,function(data){g.l(data)});
	}
		
		/*
		value= this.checked ? 1 : 0;		
		g.db.func('fetchList1', "permissions,usergrp",function (p) {		
			
			if(p.length >0){
				p = g.json_decode(p);
			g.l(p)	
				if(value==1) {
					p.push(page);
				}else{
					var index = p.indexOf(page);
					if (index > -1) {
						p.splice(index, 1);
					}
				}				
				
				g.db.query("UPDATE usergrp SET permissions='"+g.json_encode(p)+"' WHERE id="+id);
			}else{
				pageq= '["'+page+'"]';
				g.db.query("UPDATE usergrp SET permissions='"+pageq+"' WHERE id="+id);
			}
		})
		*/
	})

}

	 //delete
	$(document).on('click', "button[id^='delete']", function () {
		var id=this.id.replace('delete','');
		bootbox.confirm("This user will be deleted. Are you sure?",function(res){
		if(res){
  	    g.db.query("DELETE FROM user WHERE id="+id, function(data){g.l(data);
		if(data!='No'){
			$('#nodorder1_'+id).hide();
			}else{
			bootbox.alert("problem deleting");
			}
			 })
			 }
		})	
		})	

})