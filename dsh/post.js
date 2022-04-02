/*updated:2020-01-29 20:20:34 post - v.0.73 - Author:Nikos Drosakis - License: GPL License*/

 $('.wysiwyg').summernote();
$(document)
    .on("click","span[id^='lastname']",function(){
        g.ui.table.editable(this.id);
    })
    .on("keyup","input[id^='lastname']",function() {
        // g.l('UPDATE user SET lastname="'+this.value+'" WHERE id=1')
        g.db.query('UPDATE user SET lastname="'+this.value+'" WHERE id=1');
    })

$(document).ready(function(){
    /*********************************************
     * TOP BUTTONS
     ***********************************************/
    $("#newgroupsbtn").click(function(){
        if(!$('#submitnewpostgrp').html()) {
            $("<input class='form-control' placeholder='New postgroup name' id='newpostgrp'><button class='btn btn-success' id='submitnewpostgrp'>Create</button>").insertAfter(this)
        }else{
            $("#newpostgrp").remove();
            $("#submitnewpostgrp").remove();
        }
    })
    $(document).on('click',"#submitnewpostgrp",function(){
        var grpname= $('#newpostgrp').val().trim();
        if(grpname!=""){
            g.db.query('INSERT INTO postgrp (name,status) VALUES("'+grpname+'",1)',function(){
                location.reload();
            });
        }else{
            g.ui.notify('alert','Please insert a postgroup name.')
        }
    })

        //make sortable
    g.ui.sortable("UPDATE post SET sort=? WHERE id=?", "tr");
    /*********************************************
* POST EDIT
***********************************************/
if(GS.id !="") {
	
        $(document).on('keyup change', "#title,#titlegr,#uri,#subtitle,#subtitlegr,#sort,#seodescription,#seopriority", function () {
            var value=this.value.trim();
			if (this.id == 'title') {
                $('#title').text(value);
            };
			//g.db.queryone('post', this, GS.id);			
            g.db.query("UPDATE post SET "+this.id+"='"+value+"',modified="+g.phptimestamp()+" WHERE id="+GS.id,function(data){
				g.l(data);
			});
        })

        $(document).on('change', "#status,#postgrpid,#seopriority", function () {
            g.db.queryone('post', this, GS.id);
        })
        $(document).on('click', "#submit_content,#submit_contentgr,#submit_excerpt,#submit_excerptgr,#submit_html1,#submit_html2,#submit_html3", function () {
            var row =this.id.replace('submit_', '');
			var value=$('#' + row).summernote('code');
			//var obj = {
            //id : id,
            //value : ,
            //table : "post",
            //where : "id="+GS.id
			//}
            g.db.query("UPDATE post SET "+row+"='"+value+"' WHERE id="+GS.id, function(data){g.l(data);});
            //g.db.queryhtml(obj, function(data){g.l(data);},"POST");
        })

//post uploader 
var objgroup=1; //id of objgroup table post
g.l(GS.mode, objgroup, GS.id)
        g.media.uploader(GS.mode, objgroup, GS.id,function(data){
            g.l(data)
        });
	
}else if(GS.sub=='new'){
/*********************************************
* POST NEW
***********************************************/

$(document).on('click', "#submit_post", function () {
    var formid=$("#form_post");
    event.preventDefault();
    var form = formid.serializeArray();
    form[g.size(form)]={name:'uid',value: g.cookie.get('GSID')}
    form[g.size(form)]={name:'created',value: g.phptimestamp()}
    form[g.size(form)]={name:'modified',value: g.phptimestamp()}
  //  form[g.size(form)]={name:'excerpt',value: $('#excerpt').summernote('code')}
//    form[g.size(form)]={name:'content',value: $('#content').summernote('code')}
    g.l(form)
    $.post(g.ajaxfile, form, function (data, textStatus, jqXHR) {
          g.l(data)
        if (data == 'no') {
            g.l(textStatus)
            g.l(jqXHR)
            g.alert("Form cannot be submitted");
        } else {
            g.l(data)
               location.href="/dsh/post?id="+data;
            // formid.reset();
        }
    },'json');
})
/*
* POST GROUPS
* */
	}else if(GS.sub=='groups'){
		g.ui.table.get({
            adata: 'postgrp',
            fetch: ["fa","SELECT * FROM postgrp"],
            order: ["id","ASC"],
            list:{
                0:{row:'id'},
                1:{row:'name'}
            }
        });
/*
* POST TABLE
* */
	}else{
	window.postlist=function(q){
		var page=!g.cookie.get('post_page') ? 1: g.cookie.get('post_page');    
		var data= {a:"load_posts",page:page,q:q,mode:GS.mode,name:GS.name};
		//url,div,data,callback,method,datatype
		g.file.include(g.ajaxfile,data,function(res){
			 g.l(res)			     
				$('#post').html(res.html);	 
				 $('#count_post').text(res.count+ " posts saved");           
				g.ui.pagination.get(page, res.count, 12,GS.mode);
		},'POST');
	}
	
	$(document).on('click', "#ssearch_book", function () {
		var q= $('#search_book').val().trim()
		booklist(q);
	})
	 postlist();
	 
	 //delete
	$(document).on('click', "button[id^='delete']", function () {
		var id=this.id.replace('delete','');
		bootbox.confirm("This post will be deleted. Are you sure?",function(res){
		if(res){
  	    g.db.query("DELETE FROM post WHERE id="+id, function(data){
			g.l(data);
		if(data=='yes'){$('#nodorder1_'+id).hide();}else{bootbox.alert("problem deleting")}
			 })
			 }
		})	
		})	
	}
})