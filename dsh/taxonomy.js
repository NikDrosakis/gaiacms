/*updated:2020-01-29 20:20:34 taxonomy - v.0.73 - Author:Nikos Drosakis - License: GPL License*/

g.tax = {
	get: function () {
		var groups = '', i, j;
		g.db.func("fa", "SELECT * FROM taxgrp WHERE status=1", function (grps) {

			g.db.func('fetchList1', "taxid,post,WHERE id=" + g.get.id, function (selected) {

				for (j in grps) {
					//select taxonomies without children
					g.db.func("fa", "SELECT * FROM tax WHERE taxgrpid=" + grps[j].id + " AND parent=0", function (stax) {
						// g.l(stax)
						groups += '<label>' + grps[j].name + '</label>';
						if (grps[j].multiple == 0) {
							groups += '<select id="tax' + grps[j].id + '">' +
								'<option value="0">Select ' + grps[j].name + '</option>';
							for (i in stax) {
								groups += '<option value="' + stax[i].id + '" ' + (stax[i].id in selected ? "selected=selected" : "") + '>' + stax[i].name + '</option>';
							}
							groups += '</select>';
						} else {

						}
						$('#box_taxonomy').append(groups);
						j += 1;
					});
				}
			});


		})
	}
};

//post uploader 
var objgroup=2; //id of objgroup table post
g.l("tax", objgroup, GS.id)
     //   g.media.uploader(GS.mode, objgroup, "",function(data){g.l(data)});
		
/****************************************
		TAXPANEL
******************************************/
function chain(id,val){
    var chain='';
//   var selected=<?=json_encode($selected)?>;
  // var selectedList='<?=implode(',',$selected)?>';
    g.db.func('fa','SELECT * FROM tax WHERE parent='+val,function(taxchild){
        g.l(taxchild);
        if(taxchild.length==0 && val!=0 ) {
            chain += '<select id="tax'+id+'"><option value=0>Select</option>';
            for (var i in taxchild) {
                chain += '<option value="' + taxchild[i].id + '">' + taxchild[i].name + '</option>';
            }
            chain += '</select>';
        }else{
            chain += '';
        }
        $('#chain'+id).html(chain)
    });
}
/****************************************
		EVENTS
******************************************/

$(document).on("change","select[id^='tax']",function(){
    var taxgrpid= this.id.replace('tax','');
    chain(taxgrpid,this.value);

    //if multiple ==0
    var val= this.value;
    var multiple= $('#multiple'+taxgrpid).val();
    g.l(multiple)
//        if(multiple==0) {
//            g.db.func("query", "DELETE FROM postax WHERE postid=" + g.get.id, function (data) {
//                if (data != 'No') {
//                    g.db.func("query", "INSERT INTO postax(postid,taxid) VALUES(" + g.get.id + "," + val + ")");
//                } else {
//                    g.alert("Problem inserting tax");
//                }
//            })
////            });
////            g.db.func("query", "UPDATE postax SET taxid="+val+" WHERE postid=" + g.get.id, function (data) {
////                if(data!='yes') {
////                    g.alert("Problem inserting tax");
////                }
////                });
//        }else{
    g.db.query("UPDATE post SET taxid="+val+" WHERE id=" + g.get.id);
//        }
})

.on("click","input[name^='tax']",function(){
    var taxgrpid=this.name.replace('tax','');
    var value= this.value!="" ? this.value : "";
    if ($(this).is(':checked')){
        g.db.query("UPDATE post SET taxid="+value+" WHERE id=" + g.get.id);
    }
	//else{
      //  g.db.query("DELETE FROM postax WHERE postid="+g.get.id+" AND taxid="+value+"");
    //}
})
.on("click","button[id^='newtaxsave']",function(){
    var taxgrpid=this.id.replace('newtaxsave','');
    var value= $('#newtax'+taxgrpid).val().trim();
    // var arr= value.split(',');
    // for(var i in arr) {
    g.db.max('id','tax','',function(data){
        var id=parseInt(data)+1;
        g.db.query("INSERT INTO tax(id,parent,name,taxgrpid) VALUES("+id+",0,'" + value + "',"+taxgrpid+")",function(){
          //  g.db.func("query","INSERT INTO postax(postid,taxid) VALUES(" + g.get.id + "," + id + ")");
            $('#box'+taxgrpid).append('<input id="tax'+id+'" checked name="tax'+id+'" type="checkbox" value="'+id+'">'+value);
            $('#newtax'+taxgrpid).val('');
        });
    });
    // }
})

/*
TAGS
*/
.on("click","#newtagsave",function(){
	var tag=$('#newtag').val().trim();
	var tagarray= tag.split(',');
	var newtagarray=[];
	for(var i in tagarray){
		var trimmed=tagarray[i].trim().toLowerCase();
		if(trimmed!=''){	
		g.db.query("UPDATE post SET tags= JSON_ARRAY_APPEND(tags, '$', '"+trimmed+"') WHERE JSON_CONTAINS(tags,JSON_ARRAY('"+trimmed+"'))=0 AND id="+g.get.id,function(data){g.l(data)});
		newtagarray.push(trimmed);		
		$('#newtag').val('');
		location.reload();
	}} g.l(newtagarray)
})
.on("click","input[id^='addtag_']",function(){
	var tag=this.id.replace('addtag_','');
	if(!$(this).is(':checked')){		
		g.db.query("UPDATE post SET tags= JSON_REMOVE(tags, REPLACE(JSON_SEARCH(tags, 'one', '"+tag+"'),\'\"','')) WHERE id="+g.get.id,function(data){g.l(data)});
	}else{
		g.db.query("UPDATE post SET tags= JSON_ARRAY_APPEND(tags, '$', '"+tag+"') WHERE id="+g.get.id,function(data){g.l(data)});
	}
})

.on("click","#newgroupsbtn",function(){
		if(!$('#submitnewtaxgrp').html()) {
			$("<div id='newtaxgrpbox' style='background:lightyellow;padding:10px;margin:10px'><input class='form-control' placeholder='New taxgroup name' id='newtaxgrp'>" +
				"Parenting:<select class='form-control' id='parenting'><option value='0'>No</option><option value='1'>Yes</option></select>" +
				"Multiple:<select class='form-control' id='multiple'><option value='0'>No</option><option value='1'>Yes</option></select>" +
				"<button class='btn btn-success' id='submitnewtaxgrp'>Create</button></div>").insertAfter(this)
		}else{
			$("#newtaxgrpbox").remove();
		}
	})
.on('click',"#submitnewtaxgrp",function(){
		var grpname= $('#newtaxgrp').val().trim();
		var parenting= $('#parenting').val();
		var multiple= $('#multiple').val();
		if(grpname!=""){
			g.db.query('INSERT INTO taxgrp (name,parenting,multiple) VALUES("'+grpname+'",'+parenting+','+multiple+')',function(){
				location.reload();
			});
		}else{
			g.ui.notify('alert','Please insert a taxgroup name.')
		}
	})
	/***************
	 * create tax in g.get.id
	 ****************/
.on('click',"button[id^='newtax_']",function(){
		var exp= g.explode('_',this.id);
		var parent= exp[1];
		var taxname= exp[2];
		var parenthtml='<option value=0>No parent</option>';

		for(var i in parents){
			parenthtml += '<option value='+i+'>'+parents[i]+'</option>';
		}
		if(!$('#submitnewtax').html()) {
			$("<div id='newtaxbox' style='background:cornsilk;padding:10px;margin:10px'>" +
				"<input class='form-control' placeholder='" + taxname + " name' id='newtax'>" +
				(parent==1 ? "Parent:<select class='form-control' id='parent'>"+parenthtml+"</select>":"") +
				"<button class='btn btn-success' id='submitnewtax'>Create</button></div>").insertAfter(this);
		}else{
			$('#newtaxbox').remove();
		}
	})
.on('click',"#submitnewtax",function(){
		var name= $('#newtax').val().trim();
		var parent= !$('#parent').val() ? 0 :$('#parent').val();
		if(name!=""){
			g.db.query('INSERT INTO tax(name,parent,taxgrpid) VALUES("'+name+'",'+parent+','+g.get.id+')',function(){
				location.reload();
			});
		}else{
			g.ui.notify('alert','Please insert a taxgroup name.')
		}
	})
//DELETE
.on("click","button[id^='deletegrp_']",function(){
	var id= this.id.replace('deletegrp_','');
	g.confirm("Your taxonomy type will be deleted. Are you sure?",function(res){
	if(res==true){
	g.db.query("DELETE FROM taxgrp WHERE id="+id,function(data){
		if(data=='yes'){
		$('#line'+id).hide();}});
	}
	})	
	})

	//DELETE
.on("click","button[id^='deletetax_']",function(){
		var id= this.id.replace('deletetax_','');
		g.confirm("Your taxonomy will be deleted. Are you sure?",function(res){
			if(res==true){
				g.db.query("DELETE FROM tax WHERE id="+id,function(data){if(data=='yes'){$('#line'+id).hide();} });
			}
		})
	})

	//UPDATE NAME- STATUS
.on("keyup change","input[id^='name_'], select[id^='status_']",function(){
	var exp= g.explode('_',this.id);
	g.db.query("UPDATE taxgrp SET "+exp[0]+"='"+this.value+"' WHERE id="+exp[1])
	})

//UPDATE PARENT
.on("change keyup","select[id^='parent_'],input[id^='name_']",function(){
var exp= g.explode('_',this.id);
g.db.query("UPDATE tax SET "+exp[0]+"='"+this.value+"' WHERE id="+exp[1]);
// g.db.func('?a=parent&b='+this.value+'&c='+id,AJAX);
if(this.value!='0'){$('#delete_'+exp[1]).css('display','block');}else{$('#delete_'+exp[1]).css('display','none');}
})