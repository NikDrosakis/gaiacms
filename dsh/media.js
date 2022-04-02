/*updated:2020-01-29 20:20:34 media - v.0.73 - Author:Nikos Drosakis - License: GPL License*/

$(document).ready(function() {
//post uploader 
        var objgroup=0;
		//GS.mode
		g.media.uploader("obj", 1, 0,function(data){
            g.l(data)
        });
		
    if (g.get.sub == 'groups') {

        g.f = {
            adata: 'objgroup',
            fetch: ["fa", "SELECT * FROM objgroup"],
            order: ["id", "ASC"],
            list: {
                0: {row: 'id'},
                1: {row: 'name'}
            }
        };
        g.ui.table.get(g.f);
    }
})
	 
	 g.ui.viewer.img();
/*************************************************
					EVENTS
****************************************************/	
	//set new post group
    $(document).on("click", "#newobjgrpbtn", function () {
            if ($('#newobjgrp').html() == "") {
                g.ui.form.get({
                    adata: "objgroup",
                    nature: "new",
                    append: "#newobjgrp",
                    list: {
                        0: {row: 'name', placeholder: "Media Group Name", params: "required"}
                    }
                }, function () {
                    location.reload();
                })
            } else {
                $('#newobjgrp').html('');
            }
        })
	.on("click", "button[id^='del']", function () {		
		var id = this.id.replace('del','');
		var file = $(this).attr('file');
		g.file.unlink (GS.UPLOADS_ROOTPATH+file);
		g.file.unlink (GS.UPLOADS_ROOTPATH+'thumbs/icon_'+file);
		g.db.query ("DELETE FROM obj where id="+id);
		$( "#photo"+id ).hide()        
    })
	.on("keyup", "input[id^='title_'], textarea[id^='summary_']", function () {		
		var spl= this.id.split('_');		
		var val=this.value.trim();
		if(val!=''){
			var query='UPDATE obj SET '+spl[0]+'="'+val+'" WHERE id='+spl[1];
		//	g.l(query)
			g.db.query(query);
		}
	})

